import uuid
import pytest
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool

from app.core.celery_app import celery_app
from app.core.db import Base, SessionLocal
from app.models.case import Document, ExtractedEntity, Case, CaseStatus, PriorityLevel
from app.models.enums import DocumentStatus
from app.models.data_request import DataRequest, SharedRecord, DataRequestStatus
from app.models.audit import AuditLog
from app.models.graph_sync import GraphSyncEvent, GraphSyncStatus, GraphEventType
from app.models.auth import Authority, AuthorityType, User
from app.tasks import (
    process_uploaded_document,
    sync_confirmed_entity_to_graph,
    score_missing_links,
    expire_shared_records,
)

# Configure Celery for eager synchronous testing
celery_app.conf.update(
    task_always_eager=True,
    task_eager_propagates=True,
)


def test_process_uploaded_document_eager(db_session: Session):
    """Test process_uploaded_document transitions:

    Document created with Processing -> entities extracted -> PROCESSED.
    """
    case = db_session.query(Case).first()
    user = db_session.query(User).first()

    doc = Document(
        id=uuid.uuid4(),
        case_id=case.id,
        filename="bank_wire_evidence.pdf",
        file_type="application/pdf",
        storage_path="/storage/documents/bank_wire_evidence.pdf",
        file_size_bytes=1024 * 512,
        processing_status=DocumentStatus.Processing,
        uploaded_by=user.id,
    )
    db_session.add(doc)
    db_session.commit()

    # Run eager task
    result = process_uploaded_document(str(doc.id))

    assert result["status"] == "PROCESSED"
    assert result["extracted_count"] >= 4

    # Verify DB state
    db_session.refresh(doc)
    assert doc.processing_status == DocumentStatus.Processed

    # Verify extracted entities written to table
    entities = db_session.query(ExtractedEntity).filter(ExtractedEntity.document_id == doc.id).all()
    assert len(entities) >= 4
    entity_values = [e.raw_value for e in entities]
    assert "Zahir Abbas Merchant" in entity_values
    assert "+91 98204 11902" in entity_values


def test_process_uploaded_document_failed_path(db_session: Session):
    """Test error handling and visible 'Failed' status transition on unrecoverable failure."""
    case = db_session.query(Case).first()
    user = db_session.query(User).first()

    doc = Document(
        id=uuid.uuid4(),
        case_id=case.id,
        filename="corrupted_file.pdf",
        file_type="application/pdf",
        storage_path="/storage/documents/corrupted_file.pdf",
        file_size_bytes=1024,
        processing_status=DocumentStatus.Processing,
        uploaded_by=user.id,
    )
    db_session.add(doc)
    db_session.commit()

    # Run with trigger_failure=True (exhaust retries)
    try:
        result = process_uploaded_document(str(doc.id), trigger_failure=True)
    except Exception:
        pass

    # Verify DB transition to Failed
    db_session.refresh(doc)
    assert doc.processing_status == DocumentStatus.Failed


def test_sync_confirmed_entity_to_graph_eager(db_session: Session):
    """Test consuming graph_sync_events outbox and marking events COMPLETED."""
    event = GraphSyncEvent(
        id=uuid.uuid4(),
        event_type=GraphEventType.ENTITY_UPSERT,
        entity_type="PERSON",
        entity_id="PER-4401",
        pg_id="11111111-1111-1111-1111-111111111111",
        payload={
            "id": "PER-4401",
            "name": "Tariq Merchant",
            "nodeType": "PERSON",
            "source_type": "VERIFIED_RECORD",
        },
        status=GraphSyncStatus.PENDING,
    )
    db_session.add(event)
    db_session.commit()

    # Run eager task
    result = sync_confirmed_entity_to_graph("PER-4401")
    assert result["status"] == "SUCCESS"
    assert result["processed_events_count"] >= 1

    # Verify event state in DB
    db_session.refresh(event)
    assert event.status == GraphSyncStatus.COMPLETED
    assert event.processed_at is not None


def test_score_missing_links_eager(db_session: Session):
    """Test missing link analysis scoring task."""
    result = score_missing_links("CASE-2026-0891")
    assert result["status"] == "COMPLETED"
    assert result["scored_candidates_count"] >= 1
    assert "top_predictions" in result


def test_expire_shared_records_eager(db_session: Session):
    """Test Celery Beat hourly job: revoking expired records and writing statutory audit log."""
    case = db_session.query(Case).first()
    user = db_session.query(User).first()
    auth = db_session.query(Authority).first()

    req = DataRequest(
        id=uuid.uuid4(),
        request_number="REQ-EXPIRE-TEST-001",
        requesting_authority_id=auth.id,
        source_authority_id=auth.id,
        requesting_officer_id=user.id,
        case_id=case.id,
        requested_info={"categories": ["TELECOM"]},
        reason="Inter-agency disclosure test",
        status=DataRequestStatus.Approved,
        access_duration="1 Hour",
    )
    db_session.add(req)
    db_session.flush()

    # Expired 2 hours ago
    expired_time = datetime.now(timezone.utc) - timedelta(hours=2)
    shared_rec = SharedRecord(
        id=uuid.uuid4(),
        data_request_id=req.id,
        record_type="DOCUMENT",
        record_id="DOC-DISCLOSE-8888",
        access_expiry=expired_time,
        shared_by=user.id,
    )
    shared_rec_id = shared_rec.id
    db_session.add(shared_rec)
    db_session.commit()

    # Run expire task
    result = expire_shared_records()
    assert result["status"] == "SUCCESS"
    assert result["revoked_count"] >= 1

    # Verify record revoked from table
    remaining = db_session.query(SharedRecord).filter(SharedRecord.id == shared_rec_id).first()
    assert remaining is None

    # Verify statutory audit log entry written
    audit = db_session.query(AuditLog).filter(
        AuditLog.action == "Shared Records",
        AuditLog.target_id == "DOC-DISCLOSE-8888",
    ).first()
    assert audit is not None
    assert "Statutory Access Expired" in str(audit.metadata_payload)
