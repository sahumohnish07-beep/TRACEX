from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas.document import (
    DocumentUploadResponse,
    ExtractedEntityItem,
    EntityStatusUpdateRequest,
)
from app.repositories.document_repo import (
    upload_document,
    get_document_extracted_entities,
    update_extracted_entity_status,
)

router = APIRouter(tags=["Forensic Documents & Entity Extraction"])


@router.post(
    "/documents/upload",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Forensic Evidence Document / CDR Log",
    description="Uploads document, stores encrypted binary in evidence safe, and triggers OCR/NLP entity extraction pipeline.",
)
async def upload_file(
    file: UploadFile = File(...),
    case_id: Optional[str] = Form(default=None),
    db: Session = Depends(get_db),
):
    return upload_document(
        db=db,
        filename=file.filename or "uploaded_evidence.pdf",
        file_type=file.content_type or "application/pdf",
        case_id=case_id,
    )


@router.get(
    "/documents/{document_id}/extracted-entities",
    response_model=List[ExtractedEntityItem],
    summary="List Entities Extracted from Document",
    description="Returns persons, phone numbers, vehicles, and locations extracted by the NLP pipeline for investigator sign-off.",
)
def get_entities(
    document_id: str,
    db: Session = Depends(get_db),
):
    return get_document_extracted_entities(db=db, document_id=document_id)


from app.core.redis_cache import invalidate_cache_pattern


@router.post(
    "/extracted-entities/{entity_id}/confirm",
    summary="Confirm Extracted Entity",
    description="Investigator signs off on extracted entity, promoting it into active case intelligence registry.",
)
async def confirm_entity(
    entity_id: str,
    db: Session = Depends(get_db),
):
    result = update_extracted_entity_status(db=db, entity_id=entity_id, new_status="CONFIRMED")
    await invalidate_cache_pattern("cases:network:*")
    await invalidate_cache_pattern("dashboard:summary*")
    return result


@router.post(
    "/extracted-entities/{entity_id}/reject",
    summary="Reject Extracted Entity",
    description="Rejects false-positive or irrelevant entity candidate with record retained for audit purposes.",
)
async def reject_entity(
    entity_id: str,
    db: Session = Depends(get_db),
):
    result = update_extracted_entity_status(db=db, entity_id=entity_id, new_status="REJECTED")
    await invalidate_cache_pattern("cases:network:*")
    return result

