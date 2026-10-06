from typing import List, Optional
from pydantic import BaseModel, Field


class IncomingRequestItem(BaseModel):
    id: str = Field(..., example="REQ-IN-2026-019")
    requestingAgency: str = Field(..., example="Navi Mumbai Crime Branch — Anti-Extortion Cell")
    officerName: str = Field(..., example="Sr. Insp. Arvind Kulkarni")
    officerBadge: str = Field(..., example="MH-NB-1092")
    caseRef: str = Field(..., example="NM-CR-2026-1108 (Port Extortion & Contraband)")
    requestDate: str = Field(..., example="2026-02-26")
    justification: str = Field(
        ...,
        example="Suspect Tariq Merchant observed in surveillance footage near terminal. Requesting local station records.",
    )
    requestedData: List[str] = Field(
        ...,
        example=[
            "Verified Vehicle Details (MH-01-CR-8902)",
            "Station Beat Inspection Notes (Dockyard Road)",
            "Local Associate Network Graph Data",
            "Confidential Informant Dossier",
        ],
    )
    availableData: List[str] = Field(
        ...,
        example=[
            "Verified Vehicle Details (MH-01-CR-8902)",
            "Station Beat Inspection Notes (Dockyard Road)",
            "Local Associate Network Graph Data",
        ],
    )
    restrictedData: List[str] = Field(
        ...,
        example=["Confidential Informant Dossier (Classified Section 8 - Local Station Privilege)"],
    )
    status: str = Field(..., example="PENDING")  # PENDING | APPROVED | REJECTED | CLARIFICATION_REQUESTED
    accessDuration: str = Field(default="30 Days (Read-Only)", example="30 Days (Read-Only)")


class IncomingActionRequest(BaseModel):
    action: str = Field(..., example="APPROVE")  # APPROVE | REJECT | CLARIFY
    reason: Optional[str] = Field(default=None, example="Mandate and jurisdiction verified under zone circular 14.")


class IncomingShareRequest(BaseModel):
    selectedShares: List[str] = Field(
        ...,
        min_length=1,
        example=[
            "Verified Vehicle Details (MH-01-CR-8902)",
            "Station Beat Inspection Notes (Dockyard Road)",
        ],
    )
    accessDuration: str = Field(default="30_DAYS", example="30_DAYS")
    sharingPurpose: str = Field(..., example="Mutual cross-jurisdiction vehicle smuggling corroboration")
    certified: bool = Field(default=True, example=True)
