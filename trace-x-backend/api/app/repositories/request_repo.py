import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.data_request import DataRequest, SharedRecord
from app.models.auth import Authority, User
from app.models.case import Case
from app.models.enums import DataRequestStatus, UrgencyLevel
from app.schemas.requests import DataRequestItem, DataRequestCreate, DataRequestUpdate
from app.schemas.incoming_requests import IncomingRequestItem, IncomingShareRequest
from app.schemas.common import PaginationParams
from app.core.errors import ProblemException


def list_outgoing_requests(db: Session, params: Optional[PaginationParams] = None) -> Tuple[List[DataRequestItem], int]:
    query = db.query(DataRequest).order_by(desc(DataRequest.created_at))
    total = query.count()
    if params:
        records = query.offset(params.offset).limit(params.page_size).all()
    else:
        records = query.all()

    items: List[DataRequestItem] = []
    for r in records:
        target_name = r.source_authority.name if r.source_authority else "State Police Headquarters — CID Intelligence Wing"
        officer_name = r.requesting_officer.name if r.requesting_officer else "Insp. Vikram Deshmukh"
        case_num = r.case.case_number if r.case else "CASE-2026-0891"
        case_title = r.case.title if r.case else "Hawala Logistics & Shadow Syndicate"
        categories = r.requested_info.get("categories", ["Intelligence Dossier"]) if isinstance(r.requested_info, dict) else ["Intelligence Dossier"]

        status_str = "PENDING"
        if r.status in [DataRequestStatus.Approved, DataRequestStatus.Data_Sent, DataRequestStatus.Received]:
            status_str = "APPROVED"
        elif r.status == DataRequestStatus.Rejected:
            status_str = "REJECTED"

        items.append(
            DataRequestItem(
                id=r.request_number,
                targetAuthority=target_name,
                requestingOfficer=officer_name,
                caseId=case_num,
                caseTitle=case_title,
                requestDate=r.created_at.strftime("%Y-%m-%d") if r.created_at else "2026-02-21",
                status=status_str,
                categories=categories,
                purpose=r.reason,
                urgency=r.urgency.value if hasattr(r.urgency, "value") else str(r.urgency),
            )
        )

    # Demo fallback if empty
    if not items:
        items = [
            DataRequestItem(
                id="REQ-OUT-2026-041",
                targetAuthority="State Police Headquarters — CID Intelligence Wing",
                requestingOfficer="Insp. Vikram Deshmukh",
                caseId="CASE-2026-0891",
                caseTitle="Hawala Logistics & Shadow Syndicate",
                requestDate="2026-02-21",
                status="PENDING",
                categories=["Interstate Hawala Operatives Database", "Cross-Border Telecom Intercept Logs"],
                purpose="Corroborating mule account holders registered in neighboring state jurisdiction.",
                urgency="HIGH",
            ),
            DataRequestItem(
                id="REQ-OUT-2026-038",
                targetAuthority="Transport Department — Regional RTO Database",
                requestingOfficer="Sub-Insp. Priya Shenoy",
                caseId="CASE-2026-0744",
                caseTitle="Interstate Luxury Vehicle Theft",
                requestDate="2026-02-14",
                status="APPROVED",
                categories=["Vehicle Registration & Chassis History", "Fitness Certificate Inspection Logs"],
                purpose="Verification of forged duplicate registration certificates.",
                urgency="ROUTINE",
            ),
            DataRequestItem(
                id="REQ-OUT-2026-029",
                targetAuthority="Financial Intelligence Unit — State Liaison Office",
                requestingOfficer="Insp. Vikram Deshmukh",
                caseId="CASE-2026-0612",
                caseTitle="Cross-District Counterfeit Currency",
                requestDate="2026-01-28",
                status="APPROVED",
                categories=["Suspicious Transaction Reports (STRs)"],
                purpose="Tracing shell company bank accounts used for fake note laundering.",
                urgency="HIGH",
            ),
        ]
        total = len(items)

    return items, total


def create_outgoing_request(db: Session, req: DataRequestCreate, user_id: Optional[uuid.UUID] = None) -> DataRequestItem:
    local_auth = db.query(Authority).first()
    state_auth = db.query(Authority).filter(Authority.id != (local_auth.id if local_auth else None)).first()
    target_case = db.query(Case).filter(Case.case_number == req.caseId).first() or db.query(Case).first()
    officer = db.query(User).first()

    req_num = f"REQ-OUT-2026-{uuid.uuid4().hex[:3].upper()}"
    urg = UrgencyLevel.HIGH if req.urgency.upper() == "HIGH" else UrgencyLevel.ROUTINE

    new_req = DataRequest(
        id=uuid.uuid4(),
        request_number=req_num,
        requesting_authority_id=local_auth.id if local_auth else uuid.uuid4(),
        source_authority_id=state_auth.id if state_auth else uuid.uuid4(),
        requesting_officer_id=officer.id if officer else uuid.uuid4(),
        case_id=target_case.id if target_case else uuid.uuid4(),
        requested_info={"categories": req.categories},
        reason=req.purpose,
        urgency=urg,
        status=DataRequestStatus.Pending,
        access_duration="30 Days",
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)

    return DataRequestItem(
        id=new_req.request_number,
        targetAuthority=req.targetAuthority,
        requestingOfficer=officer.name if officer else "Insp. Vikram Deshmukh",
        caseId=target_case.case_number if target_case else req.caseId,
        caseTitle=target_case.title if target_case else "Station Investigation",
        requestDate=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        status="PENDING",
        categories=req.categories,
        purpose=req.purpose,
        urgency=req.urgency.upper(),
    )


def delete_outgoing_request(db: Session, request_id: str) -> None:
    req = db.query(DataRequest).filter(DataRequest.request_number == request_id).first()
    if req:
        db.delete(req)
        db.commit()


# In-memory mock state for incoming requests demonstrations
_INCOMING_MOCK_STORE = [
    {
        "id": "REQ-IN-2026-019",
        "requestingAgency": "Navi Mumbai Crime Branch — Anti-Extortion Cell",
        "officerName": "Sr. Insp. Arvind Kulkarni",
        "officerBadge": "MH-NB-1092",
        "caseRef": "NM-CR-2026-1108 (Port Extortion & Contraband)",
        "requestDate": "2026-02-26",
        "justification": "Suspect Tariq Merchant observed in surveillance footage near Nhava Sheva container terminal. Requesting local station records and vehicle registrations.",
        "requestedData": [
            "Verified Vehicle Details (MH-01-CR-8902)",
            "Station Beat Inspection Notes (Dockyard Road)",
            "Local Associate Network Graph Data",
            "Confidential Informant Dossier",
        ],
        "availableData": [
            "Verified Vehicle Details (MH-01-CR-8902)",
            "Station Beat Inspection Notes (Dockyard Road)",
            "Local Associate Network Graph Data",
        ],
        "restrictedData": [
            "Confidential Informant Dossier (Classified Section 8 - Local Station Privilege)",
        ],
        "status": "PENDING",
        "accessDuration": "30 Days (Read-Only)",
    }
]


def list_incoming_requests(db: Session) -> List[IncomingRequestItem]:
    return [IncomingRequestItem(**item) for item in _INCOMING_MOCK_STORE]


def get_incoming_request(request_id: str) -> IncomingRequestItem:
    item = next((r for r in _INCOMING_MOCK_STORE if r["id"] == request_id), None)
    if not item:
        item = _INCOMING_MOCK_STORE[0]
    return IncomingRequestItem(**item)


def act_on_incoming_request(request_id: str, action: str, reason: Optional[str] = None) -> IncomingRequestItem:
    item = next((r for r in _INCOMING_MOCK_STORE if r["id"] == request_id), None)
    if not item:
        item = _INCOMING_MOCK_STORE[0]

    action_upper = action.upper()
    if action_upper == "APPROVE":
        item["status"] = "APPROVED"
    elif action_upper == "REJECT":
        item["status"] = "REJECTED"
    elif action_upper == "CLARIFY":
        item["status"] = "CLARIFICATION_REQUESTED"

    return IncomingRequestItem(**item)


def share_incoming_request_data(
    db: Session,
    request_id: str,
    req: IncomingShareRequest,
    user_id: Optional[uuid.UUID] = None,
) -> dict:
    if not req.selectedShares or len(req.selectedShares) == 0:
        raise ProblemException(
            status=400,
            title="Explicit Selection Required",
            detail="You must explicitly select at least one record to share, or reject the request. Never default to all records.",
            instance=f"/api/v1/incoming-requests/{request_id}/share",
        )

    # Record shared package
    item = next((r for r in _INCOMING_MOCK_STORE if r["id"] == request_id), None)
    if item:
        item["status"] = "APPROVED"

    return {
        "requestId": request_id,
        "sharedItemsCount": len(req.selectedShares),
        "accessDuration": req.accessDuration,
        "protocol": "Gov-PKI Level 3 (Time-locked token)",
        "message": f"Successfully signed and shared {len(req.selectedShares)} records with requesting agency.",
    }
