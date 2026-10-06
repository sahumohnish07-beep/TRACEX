from typing import Optional
from pydantic import BaseModel, Field


class AuditLogEntry(BaseModel):
    id: str = Field(..., example="AUD-99104")
    timestamp: str = Field(..., example="2026-02-26 15:42:10 IST")
    officer: str = Field(..., example="Insp. Vikram Deshmukh")
    badgeNumber: str = Field(..., example="MH-POL-4412")
    action: str = Field(..., example="DATA_REQUEST_APPROVAL_REVIEW")
    caseRef: str = Field(..., example="CASE-2026-0891")
    ipAddress: str = Field(..., example="10.44.12.108 (Station LAN)")
    details: str = Field(
        ...,
        example="Reviewed incoming request REQ-IN-2026-019 from Navi Mumbai Crime Branch; classified informant records designated as restricted.",
    )


class AuditLogFilterParams:
    def __init__(
        self,
        action: Optional[str] = None,
        case_ref: Optional[str] = None,
        user_name: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None,
        search: Optional[str] = None,
    ):
        self.action = action
        self.case_ref = case_ref
        self.user_name = user_name
        self.date_from = date_from
        self.date_to = date_to
        self.search = search
