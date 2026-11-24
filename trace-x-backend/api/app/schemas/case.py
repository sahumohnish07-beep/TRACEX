from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class CaseItem(BaseModel):
    id: str = Field(..., example="CASE-2026-0891")
    title: str = Field(..., example="Hawala Logistics & Shadow Syndicate")
    crimeType: str = Field(..., example="Financial Crime / Syndicate Money Laundering")
    status: str = Field(..., example="UNDER_ANALYSIS")
    priority: str = Field(..., example="CRITICAL")
    station: str = Field(..., example="Central Division Police Station")
    leadOfficer: str = Field(..., example="Insp. Vikram Deshmukh")
    dateOpened: str = Field(..., example="2026-02-14")
    summary: str = Field(..., example="Investigation into layered cash transfers and mule accounts linked to freight import invoices.")
    entitiesCount: int = Field(default=0, example=28)
    connectionsCount: int = Field(default=0, example=46)
    evidenceCount: int = Field(default=0, example=14)
    requiresAttention: bool = Field(default=False, example=True)
    attentionReason: Optional[str] = Field(default=None, example="3 new system-derived telecom overlaps detected with active suspect.")


class CaseCreateEntityInput(BaseModel):
    name: str = Field(..., example="Zahir Abbas Merchant")
    type: str = Field(..., example="PERSON")
    details: Optional[str] = Field(default=None, example="Signatory on dummy importer accounts")


class CaseCreateRequest(BaseModel):
    title: str = Field(..., example="Hawala Logistics & Shadow Syndicate")
    crimeType: str = Field(..., example="Financial Crime / Syndicate Hawala")
    priority: str = Field(default="HIGH", example="HIGH")
    narrative: str = Field(..., example="Initial FIR intelligence regarding shadow banking ledger.")
    policeStation: Optional[str] = Field(default="Central Division Police Station, Zone 3")
    location: Optional[str] = Field(default="Dockyard Road, Terminal Gate 3")
    confirmedEntities: Optional[List[CaseCreateEntityInput]] = Field(default_factory=list)


class CaseUpdateRequest(BaseModel):
    title: Optional[str] = None
    crimeType: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    summary: Optional[str] = None
    requiresAttention: Optional[bool] = None
    attentionReason: Optional[str] = None


class CaseEntityItem(BaseModel):
    id: str = Field(..., example="PER-4401")
    name: str = Field(..., example="Tariq Merchant")
    type: str = Field(..., example="PERSON")
    roleInCase: str = Field(..., example="Primary Suspect")
    sourceType: str = Field(..., example="VERIFIED_RECORD")


class EvidenceItem(BaseModel):
    id: str = Field(..., example="EVD-891-01")
    caseId: str = Field(..., example="CASE-2026-0891")
    type: str = Field(..., example="Digital Hardware")
    description: str = Field(..., example="Encrypted flash drive seized from Tariq Merchant residential search")
    dateCollected: str = Field(..., example="2026-02-15")
    collectingOfficer: str = Field(..., example="Insp. Vikram Deshmukh")
    chainOfCustody: str = Field(..., example="Station Malkhana Safe #2 (Vault Ref: MK-2026-04)")
    sourceType: str = Field(..., example="VERIFIED_RECORD")


class CaseDetailResponse(CaseItem):
    entities: List[CaseEntityItem] = Field(default_factory=list)
    evidence: List[EvidenceItem] = Field(default_factory=list)
