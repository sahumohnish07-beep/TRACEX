from typing import Optional, List
from pydantic import BaseModel, Field


class DocumentUploadResponse(BaseModel):
    documentId: str = Field(..., example="DOC-2026-0041")
    filename: str = Field(..., example="Dockyard_Terminal4_Seizure_Memo.pdf")
    fileType: str = Field(..., example="application/pdf")
    storagePath: str = Field(..., example="/storage/documents/2026/02/doc_0041.pdf")
    status: str = Field(..., example="Processed")
    extractedCount: int = Field(default=4, example=4)


class ExtractedEntityItem(BaseModel):
    id: str = Field(..., example="EXT-01")
    documentId: str = Field(..., example="DOC-2026-0041")
    caseId: str = Field(..., example="CASE-2026-0891")
    name: str = Field(..., example="Zahir Abbas Merchant")
    type: str = Field(..., example="PERSON")
    details: str = Field(..., example="Identified as bank account signatory")
    confidenceScore: float = Field(default=0.95, example=0.98)
    status: str = Field(..., example="PENDING")  # PENDING | CONFIRMED | REJECTED


class EntityStatusUpdateRequest(BaseModel):
    status: str = Field(..., example="CONFIRMED")  # CONFIRMED | REJECTED
