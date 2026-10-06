from typing import List, Optional
from pydantic import BaseModel, Field


class AssociatedCaseSummary(BaseModel):
    caseId: str = Field(..., example="CASE-2026-0891")
    title: str = Field(..., example="Hawala Logistics & Shadow Syndicate")
    role: str = Field(..., example="Primary Subject / Account Controller")
    year: str = Field(..., example="2026")


class PersonRecord(BaseModel):
    id: str = Field(..., example="PER-4401")
    fullName: str = Field(..., example="Tariq Merchant")
    aliases: List[str] = Field(default_factory=list, example=["Tariq Bhai", "T.M. Freight"])
    nationalId: str = Field(..., example="ABCDE1234F")
    dateOfBirth: str = Field(..., example="1982-05-19")
    gender: str = Field(..., example="Male")
    status: str = Field(..., example="SUSPECT")
    riskLevel: str = Field(..., example="HIGH")
    primaryAddress: str = Field(..., example="Flat 402, Al-Madina Heights, Dock Road, Zone 3")
    phoneNumbers: List[str] = Field(default_factory=list, example=["+91 98201 55431", "+91 98209 88120"])
    vehicles: List[str] = Field(default_factory=list, example=["MH-01-CR-8902 (Silver Fortuner)"])
    associatedCases: List[AssociatedCaseSummary] = Field(default_factory=list)
    verifiedRecordsCount: int = Field(default=0, example=9)
    systemConnectionsCount: int = Field(default=0, example=14)
    aiIdentifiedPatternsCount: int = Field(default=0, example=5)
