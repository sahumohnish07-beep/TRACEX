from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas.person import PersonRecord
from app.repositories.person_repo import get_person_record

router = APIRouter(prefix="/persons", tags=["Persons"])


@router.get(
    "/{person_id}",
    response_model=PersonRecord,
    summary="Get Full Criminal Dossier for a Subject",
    description="Retrieve person profile with national identity, phone numbers, vehicles, associated cases, and verification counts.",
)
def get_person(
    person_id: str,
    db: Session = Depends(get_db),
):
    return get_person_record(db=db, person_id=person_id)
