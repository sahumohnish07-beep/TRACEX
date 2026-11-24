from typing import List, Optional
from pydantic import BaseModel, Field


class DataRequestItem(BaseModel):
    id: str = Field(..., example="REQ-OUT-2026-041")
    targetAuthority: str = Field(..., example="State Police Headquarters — CID Intelligence Wing")
    requestingOfficer: str = Field(..., example="Insp. Vikram Deshmukh")
    caseId: str = Field(..., example="CASE-2026-0891")
    caseTitle: str = Field(..., example="Hawala Logistics & Shadow Syndicate")
    requestDate: str = Field(..., example="2026-02-21")
    status: str = Field(..., example="PENDING")  # PENDING | APPROVED | REJECTED
    categories: List[str] = Field(
        ...,
        example=["Interstate Hawala Operatives Database", "Cross-Border Telecom Intercept Logs"],
    )
    purpose: str = Field(..., example="Corroborating mule account holders registered in neighboring state jurisdiction.")
    urgency: str = Field(..., example="HIGH")  # HIGH | ROUTINE


class DataRequestCreate(BaseModel):
    targetAuthorityId: Optional[str] = None
    targetAuthority: str = Field(..., example="State Police Headquarters — CID Intelligence Wing")
    caseId: str = Field(..., example="CASE-2026-0891")
    categories: List[str] = Field(..., example=["Vehicle Registration & Chassis History"])
    purpose: str = Field(..., example="Verification of forged duplicate registration certificates.")
    urgency: str = Field(default="ROUTINE", example="ROUTINE")


class DataRequestUpdate(BaseModel):
    status: Optional[str] = None
    urgency: Optional[str] = None
    purpose: Optional[str] = None
