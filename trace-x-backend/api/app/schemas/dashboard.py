from typing import List
from pydantic import BaseModel, Field
from app.schemas.case import CaseItem


class StatCounts(BaseModel):
    activeCases: int = Field(..., example=42)
    casesUnderAnalysis: int = Field(..., example=17)
    pendingRequests: int = Field(..., example=5)
    newConnections: int = Field(..., example=12)


class DashboardSummaryResponse(BaseModel):
    stats: StatCounts
    recentCases: List[CaseItem]
    requiresAttention: List[CaseItem]

    class Config:
        json_schema_extra = {
            "example": {
                "stats": {
                    "activeCases": 42,
                    "casesUnderAnalysis": 17,
                    "pendingRequests": 5,
                    "newConnections": 12,
                },
                "recentCases": [],
                "requiresAttention": [],
            }
        }
