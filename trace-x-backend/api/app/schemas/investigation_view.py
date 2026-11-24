from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class InvestigationViewItem(BaseModel):
    id: str = Field(..., example="VIEW-891-A")
    caseId: str = Field(..., example="CASE-2026-0891")
    caseTitle: str = Field(..., example="Hawala Logistics & Shadow Syndicate")
    title: str = Field(..., example="Dockyard Cash Courier Flow & Cold Storage Network")
    createdDate: str = Field(..., example="2026-02-20")
    lastModified: str = Field(..., example="2026-02-26 14:10 IST")
    nodeCount: int = Field(default=18, example=18)
    edgeCount: int = Field(default=24, example=24)
    notes: Optional[str] = Field(
        default=None,
        example="Working hypothesis: Cold Storage Unit 4 used as intermediate transfer hub before cash reaches bullion dealers.",
    )
    graphState: Optional[Dict[str, Any]] = None


class InvestigationViewSaveRequest(BaseModel):
    title: Optional[str] = None
    notes: Optional[str] = None
    graphState: Optional[Dict[str, Any]] = None
    nodeCount: Optional[int] = None
    edgeCount: Optional[int] = None
