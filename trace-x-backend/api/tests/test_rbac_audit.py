import uuid
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.case import Case, CaseStatus, PriorityLevel
from app.models.auth import Authority, AuthorityType, User
from app.models.audit import AuditLog
from app.main import app


# ---------------------------------------------------------------------------
# RBAC Tests
# ---------------------------------------------------------------------------

def test_investigator_cannot_approve_data_request(client: TestClient):
    """Investigator lacks 'approve_data_request' permission -> 403 Forbidden."""
    resp = client.post(
        "/api/v1/incoming-requests/REQ-IN-2026-019/approve",
        headers={"Authorization": "Bearer mock_dev_access_token"},  # Investigator role
    )
    assert resp.status_code == 403
    data = resp.json()
    assert data["status"] == 403
    assert "approve_data_request" in data["detail"]
    assert "Statutory Access Forbidden" in data["title"]


def test_supervisor_can_approve_data_request(client: TestClient):
    """Supervisor holds 'approve_data_request' permission -> 200 OK."""
    resp = client.post(
        "/api/v1/incoming-requests/REQ-IN-2026-019/approve",
        headers={"Authorization": "Bearer mock_supervisor_token"},  # Supervisor role
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "APPROVED"


def test_investigator_cannot_share_records(client: TestClient):
    """Investigator lacks 'share_records' permission -> 403 Forbidden."""
    resp = client.post(
        "/api/v1/incoming-requests/REQ-IN-2026-019/share",
        json={
            "selectedShares": ["doc-1"],
            "redactionLevel": "FULL",
            "accessDuration": "15 Days",
        },
        headers={"Authorization": "Bearer mock_dev_access_token"},
    )
    assert resp.status_code == 403
    data = resp.json()
    assert data["status"] == 403
    assert "share_records" in data["detail"]


def test_supervisor_can_share_records(client: TestClient):
    """Supervisor holds 'share_records' permission -> 200 OK."""
    resp = client.post(
        "/api/v1/incoming-requests/REQ-IN-2026-019/share",
        json={
            "selectedShares": ["doc-1"],
            "redactionLevel": "FULL",
            "accessDuration": "15 Days",
        },
        headers={"Authorization": "Bearer mock_supervisor_token"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["sharedItemsCount"] == 1


def test_investigator_cannot_view_audit_log(client: TestClient):
    """Investigator lacks 'view_audit_log' permission -> 403 Forbidden."""
    resp = client.get(
        "/api/v1/audit-log",
        headers={"Authorization": "Bearer mock_dev_access_token"},
    )
    assert resp.status_code == 403
    data = resp.json()
    assert data["status"] == 403
    assert "view_audit_log" in data["detail"]


def test_supervisor_can_view_audit_log(client: TestClient):
    """Supervisor holds 'view_audit_log' permission -> 200 OK."""
    resp = client.get(
        "/api/v1/audit-log",
        headers={"Authorization": "Bearer mock_supervisor_token"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "total" in data


# ---------------------------------------------------------------------------
# Authority-Tier Scoping Tests
# ---------------------------------------------------------------------------

def test_authority_a_token_cannot_read_authority_b_cases(client: TestClient, db_session: Session):
    """Proves an officer with Authority A's token cannot read Authority B's case -> 403."""
    # Create Authority B and a case in Authority B
    auth_b_id = uuid.UUID("22222222-2222-2222-2222-222222222222")
    auth_b = db_session.query(Authority).filter(Authority.id == auth_b_id).first()
    if not auth_b:
        auth_b = Authority(
            id=auth_b_id,
            name="South Division Police Station, Zone 9",
            type=AuthorityType.LOCAL,
            jurisdiction="Zone 9 Coastal",
        )
        db_session.add(auth_b)
        db_session.flush()

    user_b = db_session.query(User).filter(User.badge_id == "MH-POL-9999").first()
    if not user_b:
        user_b = User(
            id=uuid.uuid4(),
            keycloak_sub="sub-officer-b",
            name="Insp. Ashok Shinde",
            email="ashok@police.gov.in",
            role="Investigating Officer",
            badge_id="MH-POL-9999",
            authority_id=auth_b.id,
        )
        db_session.add(user_b)
        db_session.flush()

    case_b = db_session.query(Case).filter(Case.case_number == "CASE-AUTH-B-001").first()
    if not case_b:
        case_b = Case(
            id=uuid.uuid4(),
            case_number="CASE-AUTH-B-001",
            title="Jurisdiction B Classified Syndicate",
            crime_type="Narcotics",
            status=CaseStatus.ACTIVE,
            priority=PriorityLevel.HIGH,
            police_station="South Division Police Station, Zone 9",
            location="Pier 9",
            description="Restricted jurisdiction case",
            investigating_officer_id=user_b.id,
            authority_id=auth_b.id,
            requires_attention=False,
        )
        db_session.add(case_b)
        db_session.commit()

    # Case CASE-AUTH-B-001 belongs to Authority B (22222222-...)
    # Token mock_dev_access_token belongs to Authority A (11111111-...)
    resp = client.get(
        "/api/v1/cases/CASE-AUTH-B-001",
        headers={"Authorization": "Bearer mock_dev_access_token"},
    )
    assert resp.status_code == 403
    data = resp.json()
    assert data["status"] == 403
    assert "Cross-jurisdiction access violation" in data["detail"]

    # In list_cases, Authority A must NOT see Authority B's case
    list_resp = client.get(
        "/api/v1/cases",
        headers={"Authorization": "Bearer mock_dev_access_token"},
    )
    assert list_resp.status_code == 200
    list_data = list_resp.json()
    case_ids = [c["id"] for c in list_data["items"]]
    assert "CASE-AUTH-B-001" not in case_ids


# ---------------------------------------------------------------------------
# Audit Logging Tests & Immutable Append-Only Verification
# ---------------------------------------------------------------------------

def test_sensitive_read_and_write_writes_audit_log(client: TestClient, db_session: Session):
    """Tests that accessing a case or saving an investigation view triggers audit logging."""
    # 1. Read case
    client.get(
        "/api/v1/cases/CASE-2026-0891",
        headers={"Authorization": "Bearer mock_dev_access_token"},
    )

    # Verify audit row created
    log = db_session.query(AuditLog).filter(
        AuditLog.action == "Viewed Case",
        AuditLog.target_id == "CASE-2026-0891",
    ).first()
    assert log is not None
    assert log.target_type == "CASE"

    # 2. Write investigation view
    client.post(
        "/api/v1/investigation-views/CASE-2026-0891",
        json={
            "name": "Custom Analytical Workspace",
            "description": "Auto-test workspace",
            "nodes": [],
            "edges": [],
        },
        headers={"Authorization": "Bearer mock_dev_access_token"},
    )

    log_view = db_session.query(AuditLog).filter(
        AuditLog.action == "Created Investigation View",
        AuditLog.target_id == "CASE-2026-0891",
    ).first()
    assert log_view is not None


def test_audit_log_rejects_update_and_delete_raw_sql(db_session: Session):
    """Raw SQL test proving audit_log table rejects UPDATE and DELETE."""
    # Insert test audit log
    test_id = str(uuid.uuid4())
    user = db_session.query(User).first()
    user_id = str(user.id)

    db_session.execute(
        text(
            f"""
            INSERT INTO audit_log (id, user_id, action, target_type, target_id, ip_address, created_at)
            VALUES ('{test_id}', '{user_id}', 'Viewed Case', 'CASE', 'CASE-TEST', '127.0.0.1', datetime('now'))
            """
        )
    )
    db_session.commit()

    # Attempt raw SQL UPDATE -> Must fail
    with pytest.raises(Exception) as exc_update:
        db_session.execute(
            text(f"UPDATE audit_log SET action = 'Forged Action' WHERE id = '{test_id}'")
        )
        db_session.commit()
    db_session.rollback()
    assert "append-only" in str(exc_update.value).lower() or "abort" in str(exc_update.value).lower()

    # Attempt raw SQL DELETE -> Must fail
    with pytest.raises(Exception) as exc_delete:
        db_session.execute(
            text(f"DELETE FROM audit_log WHERE id = '{test_id}'")
        )
        db_session.commit()
    db_session.rollback()
    assert "append-only" in str(exc_delete.value).lower() or "abort" in str(exc_delete.value).lower()
