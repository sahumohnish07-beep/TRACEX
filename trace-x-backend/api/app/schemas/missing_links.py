from typing import List, Optional
from pydantic import BaseModel, Field


class EntityBrief(BaseModel):
    id: str = Field(..., example="PER-4401")
    name: str = Field(..., example="Tariq Merchant")
    type: str = Field(..., example="PERSON")


class MissingLinkCandidate(BaseModel):
    id: str = Field(..., example="ML-01")
    caseId: str = Field(..., example="CASE-2026-0891")
    caseTitle: str = Field(..., example="Hawala Logistics & Shadow Syndicate")
    sourceEntity: EntityBrief
    targetEntity: EntityBrief
    evidenceStrength: str = Field(..., example="STRONG")
    connectionBasis: List[str] = Field(
        ...,
        example=[
            "Frequent CDR co-presence during off-hours (14 instances)",
            "Vehicle MH-01-CR-8902 spotted on toll camera near entrance",
        ],
    )
    evidenceBasis: List[str] = Field(
        ...,
        example=[
            "Tower Cell ID 404-45-8910 correlation",
            "ANPR checkpoint logs dated 2026-02-11 02:44 IST",
        ],
    )
    identifiedDate: str = Field(..., example="2026-02-22")
    status: str = Field(..., example="PENDING_REVIEW")


class MissingLinkReviewRequest(BaseModel):
    status: str = Field(..., example="CONFIRMED")  # CONFIRMED | DISMISSED
    reviewerNotes: Optional[str] = Field(default=None, example="Verified against cell site logs and investigator memo.")
