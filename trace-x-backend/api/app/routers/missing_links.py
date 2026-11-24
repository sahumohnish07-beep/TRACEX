from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas.missing_links import MissingLinkCandidate, MissingLinkReviewRequest
from app.repositories.missing_links_repo import (
    get_case_missing_links,
    review_missing_link_candidate,
)

router = APIRouter(tags=["Missing Link Analysis"])


@router.get(
    "/cases/{case_id}/missing-links",
    response_model=List[MissingLinkCandidate],
    summary="Get Missing Link Analysis Candidates for a Case",
    description="Returns candidate connections for investigator review, ranked with evidence strength, explanation basis chips, and corroborating documents.",
)
def get_missing_links(
    case_id: str,
    db: Session = Depends(get_db),
):
    return get_case_missing_links(db=db, case_id=case_id)


@router.post(
    "/cases/{case_id}/missing-links/{candidate_id}/review",
    summary="Adjudicate Candidate Connection (Confirm or Dismiss)",
    description="Confirm a candidate link to merge it into the investigation graph, or dismiss it with reason logged to the audit trail.",
)
def review_missing_link(
    case_id: str,
    candidate_id: str,
    payload: MissingLinkReviewRequest,
    db: Session = Depends(get_db),
):
    return review_missing_link_candidate(
        db=db,
        candidate_id=candidate_id,
        new_status=payload.status,
        reviewer_notes=payload.reviewerNotes,
    )
