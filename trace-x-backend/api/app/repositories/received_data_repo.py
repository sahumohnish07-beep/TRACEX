from typing import List, Optional
from sqlalchemy.orm import Session
from app.schemas.received_data import ReceivedDataItem
from app.core.errors import ProblemException

_RECEIVED_DATA_STORE = [
    {
        "id": "REC-2026-011",
        "sourceAuthority": "State CID Cyber Cell",
        "caseId": "CASE-2026-0891",
        "caseTitle": "Hawala Logistics & Shadow Syndicate",
        "receivedDate": "2026-02-25",
        "transferProtocol": "Secure Agency Encrypted Pipe (Gov-PKI Level 3)",
        "summary": "Decrypted IP access logs for online banking accounts originating from Dubai VPN gateway.",
        "recordTypes": ["VPN Endpoint IP Dumps", "Session Handshake Timestamps", "Bank Portal Metadata"],
        "entitiesCount": 6,
        "addedToView": True,
    },
    {
        "id": "REC-2026-009",
        "sourceAuthority": "Regional Transport Authority (RTO)",
        "caseId": "CASE-2026-0744",
        "caseTitle": "Interstate Luxury Vehicle Theft",
        "receivedDate": "2026-02-19",
        "transferProtocol": "RTO National Registry API Export",
        "summary": "Certified history of 14 stolen SUVs with duplicated engine serial tags.",
        "recordTypes": ["Chassis Inspection Certificates", "Transfer of Ownership Filings"],
        "entitiesCount": 14,
        "addedToView": False,
    },
]


def list_received_data(db: Session) -> List[ReceivedDataItem]:
    return [ReceivedDataItem(**d) for d in _RECEIVED_DATA_STORE]


def add_received_data_to_view(db: Session, payload_id: str, view_id: str) -> ReceivedDataItem:
    item = next((d for d in _RECEIVED_DATA_STORE if d["id"] == payload_id), None)
    if not item:
        raise ProblemException(
            status=404,
            title="Received Data Package Not Found",
            detail=f"Data package with ID '{payload_id}' was not found in received transfers.",
            instance=f"/api/v1/received-data/{payload_id}/add-to-view",
        )
    item["addedToView"] = True
    return ReceivedDataItem(**item)
