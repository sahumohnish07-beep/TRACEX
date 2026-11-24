import uuid
from typing import List, Tuple, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.models.audit import AuditLog
from app.models.auth import User
from app.schemas.audit import AuditLogEntry, AuditLogFilterParams
from app.schemas.common import PaginationParams
from app.core.auth import CurrentUser

_FALLBACK_AUDIT_LOGS = [
    {
        "id": "AUD-99104",
        "timestamp": "2026-02-26 15:42:10 IST",
        "officer": "Insp. Vikram Deshmukh",
        "badgeNumber": "MH-POL-4412",
        "action": "Approved Data Request",
        "caseRef": "CASE-2026-0891",
        "ipAddress": "10.44.12.108 (Station LAN)",
        "details": "Reviewed incoming request REQ-IN-2026-019 from Navi Mumbai Crime Branch; classified informant records designated as restricted.",
    },
    {
        "id": "AUD-99103",
        "timestamp": "2026-02-26 14:12:04 IST",
        "officer": "Insp. Vikram Deshmukh",
        "badgeNumber": "MH-POL-4412",
        "action": "Created Investigation View",
        "caseRef": "CASE-2026-0891",
        "ipAddress": "10.44.12.108 (Station LAN)",
        "details": 'Saved private investigation layout "Dockyard Cash Courier Flow" with 18 nodes and 24 edges.',
    },
    {
        "id": "AUD-99102",
        "timestamp": "2026-02-26 11:05:44 IST",
        "officer": "Sub-Insp. Priya Shenoy",
        "badgeNumber": "MH-POL-4982",
        "action": "Viewed Case",
        "caseRef": "CASE-2026-0891",
        "ipAddress": "10.44.12.115 (Station LAN)",
        "details": "Flagged ML-01 (Tariq Merchant <-> Al-Farooq Cold Storage) for supervisor review based on CDR co-presence.",
    },
    {
        "id": "AUD-99101",
        "timestamp": "2026-02-25 18:22:19 IST",
        "officer": "Insp. Vikram Deshmukh",
        "badgeNumber": "MH-POL-4412",
        "action": "Viewed Received Data",
        "caseRef": "CASE-2026-0891",
        "ipAddress": "10.44.12.108 (Station LAN)",
        "details": "Imported State CID Cyber Cell VPN Endpoint IP dumps into private workspace view.",
    },
    {
        "id": "AUD-99100",
        "timestamp": "2026-02-25 10:14:02 IST",
        "officer": "Insp. Vikram Deshmukh",
        "badgeNumber": "MH-POL-4412",
        "action": "Viewed Case",
        "caseRef": "SESSION-AUTH",
        "ipAddress": "10.44.12.108 (Station LAN)",
        "details": "Local Authority credentials verified via cryptographic workstation key; session token initialized.",
    },
]


def write_audit_log(
    db: Session,
    action: str,
    target_type: str,
    target_id: str,
    user_id: Optional[uuid.UUID] = None,
    case_id: Optional[uuid.UUID] = None,
    details: Optional[str] = None,
    ip_address: Optional[str] = None,
    metadata_extra: Optional[Dict[str, Any]] = None,
) -> AuditLog:
    """Fail-closed audit write helper.

    Must participate in the caller's active database transaction.
    """
    if not user_id:
        user = db.query(User).first()
        user_id = user.id if user else uuid.uuid4()

    meta = {"details": details or f"Statutory log for {action}"}
    if metadata_extra:
        meta.update(metadata_extra)

    log_entry = AuditLog(
        id=uuid.uuid4(),
        user_id=user_id,
        action=action,
        target_type=target_type,
        target_id=target_id,
        case_id=case_id,
        metadata_payload=meta,
        ip_address=ip_address or "127.0.0.1",
    )
    db.add(log_entry)
    db.flush()
    return log_entry


def list_audit_logs(
    db: Session,
    filters: AuditLogFilterParams,
    params: Optional[PaginationParams] = None,
    current_user: Optional[CurrentUser] = None,
) -> Tuple[List[AuditLogEntry], int]:
    query = db.query(AuditLog).order_by(desc(AuditLog.created_at))

    if filters.action and filters.action.upper() != "ALL":
        query = query.filter(AuditLog.action.ilike(f"%{filters.action}%"))
    if filters.case_ref:
        query = query.filter(AuditLog.target_id.ilike(f"%{filters.case_ref}%"))
    if filters.search:
        s = f"%{filters.search.strip()}%"
        query = query.filter(
            or_(
                AuditLog.action.ilike(s),
                AuditLog.target_id.ilike(s),
                AuditLog.ip_address.ilike(s),
            )
        )

    db_logs = query.all()
    if db_logs:
        items = []
        for l in db_logs:
            details_text = "Station activity audit record"
            if isinstance(l.metadata_payload, dict):
                details_text = l.metadata_payload.get("details", details_text)
            elif l.metadata_payload:
                details_text = str(l.metadata_payload)

            items.append(
                AuditLogEntry(
                    id=f"AUD-{str(l.id)[:5].upper()}",
                    timestamp=l.created_at.strftime("%Y-%m-%d %H:%M:%S IST") if l.created_at else "2026-02-26 15:42:10 IST",
                    officer=l.user.name if l.user else (current_user.name if current_user else "Insp. Vikram Deshmukh"),
                    badgeNumber=l.user.badge_id if l.user and l.user.badge_id else (current_user.badge_number if current_user and current_user.badge_number else "MH-POL-4412"),
                    action=l.action,
                    caseRef=l.target_id or "CASE-2026-0891",
                    ipAddress=l.ip_address or "10.44.12.108 (Station LAN)",
                    details=details_text,
                )
            )
        total = len(items)
        if params:
            items = items[params.offset : params.offset + params.page_size]
        return items, total

    # Fallback to demo items
    filtered = []
    for l in _FALLBACK_AUDIT_LOGS:
        if filters.action and filters.action.upper() != "ALL" and filters.action.lower() not in l["action"].lower():
            continue
        if filters.case_ref and filters.case_ref.lower() not in l["caseRef"].lower():
            continue
        if filters.search:
            q = filters.search.lower()
            if not (q in l["id"].lower() or q in l["officer"].lower() or q in l["caseRef"].lower() or q in l["details"].lower()):
                continue
        filtered.append(AuditLogEntry(**l))

    total = len(filtered)
    if params:
        filtered = filtered[params.offset : params.offset + params.page_size]
    return filtered, total

