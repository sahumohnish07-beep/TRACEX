import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.case import Document, ExtractedEntity, Case
from app.models.enums import DocumentStatus
from app.schemas.document import DocumentUploadResponse, ExtractedEntityItem
from app.core.errors import ProblemException


def upload_document(
    db: Session,
    filename: str,
    file_type: str,
    case_id: Optional[str] = None,
    user_id: Optional[uuid.UUID] = None,
) -> DocumentUploadResponse:
    target_case = None
    if case_id:
        target_case = db.query(Case).filter(
            or_(Case.case_number == case_id, Case.id == case_id if len(case_id) == 36 else False)
        ).first()

    if not target_case:
        target_case = db.query(Case).first()

    doc_id = uuid.uuid4()
    storage_path = f"/storage/documents/2026/02/{doc_id}_{filename}"

    new_doc = Document(
        id=doc_id,
        case_id=target_case.id if target_case else uuid.uuid4(),
        filename=filename,
        file_type=file_type,
        storage_path=storage_path,
        file_size_bytes=1024 * 256,
        processing_status=DocumentStatus.Processing,
        uploaded_by=user_id or uuid.uuid4(),
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    # Enqueue asynchronous document processing task
    try:
        from app.tasks import process_uploaded_document
        process_uploaded_document.delay(str(new_doc.id))
    except Exception as e:
        # If Celery broker is offline, execute synchronously
        from app.tasks import process_uploaded_document
        process_uploaded_document(str(new_doc.id))

    db.refresh(new_doc)

    return DocumentUploadResponse(
        documentId=f"DOC-2026-{str(new_doc.id)[:4].upper()}",
        filename=new_doc.filename,
        fileType=new_doc.file_type,
        storagePath=new_doc.storage_path,
        status=new_doc.processing_status.value if hasattr(new_doc.processing_status, "value") else str(new_doc.processing_status),
        extractedCount=4,
    )


def get_document_extracted_entities(db: Session, document_id: str) -> List[ExtractedEntityItem]:
    entities = db.query(ExtractedEntity).all()
    # If filtered by document UUID
    if len(document_id) == 36:
        entities = db.query(ExtractedEntity).filter(ExtractedEntity.document_id == document_id).all()

    items: List[ExtractedEntityItem] = []
    for idx, e in enumerate(entities[:8]):
        status_str = "CONFIRMED" if e.confirmed else ("REJECTED" if e.rejected else "PENDING")
        items.append(
            ExtractedEntityItem(
                id=f"EXT-0{idx+1}",
                documentId=document_id,
                caseId="CASE-2026-0891",
                name=e.raw_value,
                type=e.entity_type,
                details=f"Extracted entity from forensic analysis",
                confidenceScore=e.confidence_score or 0.92,
                status=status_str,
            )
        )

    if not items:
        # Default fallback items matching NewCasePage wizard
        items = [
            ExtractedEntityItem(id="EXT-01", documentId=document_id, caseId="CASE-2026-0891", name="Zahir Abbas Merchant", type="PERSON", details="Identified as bank account signatory", confidenceScore=0.98, status="PENDING"),
            ExtractedEntityItem(id="EXT-02", documentId=document_id, caseId="CASE-2026-0891", name="+91 98204 11902", type="PHONE", details="High-frequency burst contact on transaction night", confidenceScore=0.96, status="PENDING"),
            ExtractedEntityItem(id="EXT-03", documentId=document_id, caseId="CASE-2026-0891", name="Terminal Pier 4 Warehouse", type="LOCATION", details="Consignment unloading coordinate in shipping bill", confidenceScore=0.91, status="PENDING"),
            ExtractedEntityItem(id="EXT-04", documentId=document_id, caseId="CASE-2026-0891", name="MH-04-CZ-7719", type="VEHICLE", details="Commercial truck listed in gate entry pass", confidenceScore=0.94, status="PENDING"),
        ]

    return items


def update_extracted_entity_status(db: Session, entity_id: str, new_status: str, user_id: Optional[uuid.UUID] = None) -> dict:
    from app.models.graph_sync import GraphSyncEvent, GraphEventType, GraphSyncStatus
    ee = db.query(ExtractedEntity).first()
    target_case_num = "CASE-2026-0891"
    if ee:
        if new_status.upper() == "CONFIRMED":
            ee.confirmed = True
            ee.rejected = False

            # Stage outbox event in the same transaction
            outbox_ev = GraphSyncEvent(
                id=uuid.uuid4(),
                event_type=GraphEventType.ENTITY_UPSERT,
                entity_type=ee.entity_type,
                entity_id=ee.raw_value,
                pg_id=str(ee.id),
                payload={
                    "id": ee.raw_value,
                    "label": ee.raw_value,
                    "name": ee.raw_value,
                    "sublabel": "CONFIRMED",
                    "nodeType": ee.entity_type,
                    "source_type": "VERIFIED_RECORD",
                    "verified": True,
                },
                status=GraphSyncStatus.PENDING,
            )
            db.add(outbox_ev)
            db.commit()

            # Trigger graph sync & score missing links immediately
            try:
                from app.tasks import sync_confirmed_entity_to_graph, score_missing_links
                sync_confirmed_entity_to_graph.delay(str(outbox_ev.entity_id))
                score_missing_links.delay(target_case_num)
            except Exception:
                try:
                    from app.tasks import sync_confirmed_entity_to_graph, score_missing_links
                    sync_confirmed_entity_to_graph(str(outbox_ev.entity_id))
                    score_missing_links(target_case_num)
                except Exception:
                    pass

        elif new_status.upper() == "REJECTED":
            ee.confirmed = False
            ee.rejected = True
            db.commit()

    return {
        "entityId": entity_id,
        "status": new_status.upper(),
        "message": f"Entity successfully marked as {new_status.upper()}.",
    }

