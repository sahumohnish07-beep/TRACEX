from typing import List
from pydantic import BaseModel, Field


class ReceivedDataItem(BaseModel):
    id: str = Field(..., example="REC-2026-011")
    sourceAuthority: str = Field(..., example="State CID Cyber Cell")
    caseId: str = Field(..., example="CASE-2026-0891")
    caseTitle: str = Field(..., example="Hawala Logistics & Shadow Syndicate")
    receivedDate: str = Field(..., example="2026-02-25")
    transferProtocol: str = Field(..., example="Secure Agency Encrypted Pipe (Gov-PKI Level 3)")
    summary: str = Field(..., example="Decrypted IP access logs for online banking accounts originating from Dubai VPN gateway.")
    recordTypes: List[str] = Field(..., example=["VPN Endpoint IP Dumps", "Session Handshake Timestamps", "Bank Portal Metadata"])
    entitiesCount: int = Field(default=6, example=6)
    addedToView: bool = Field(default=False, example=False)


class AddToViewRequest(BaseModel):
    viewId: str = Field(..., example="VIEW-891-A")
