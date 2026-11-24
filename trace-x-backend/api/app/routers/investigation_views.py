from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas.investigation_view import InvestigationViewItem, InvestigationViewSaveRequest
from app.repositories.investigation_view_repo import (
    get_investigation_view,
    save_investigation_view,
)

router = APIRouter(prefix="/investigation-views", tags=["Investigation Workspaces"])


@router.get(
    "/{view_id}",
    response_model=InvestigationViewItem,
    summary="Get Investigation Workspace Layout & State",
    description="Loads private sandbox view with custom node coordinates, edge clusters, and analytical notes.",
)
def get_view(
    view_id: str,
    db: Session = Depends(get_db),
):
    return get_investigation_view(db=db, view_id=view_id)


@router.post(
    "/{view_id}",
    response_model=InvestigationViewItem,
    summary="Save Investigation Workspace Layout & Annotations",
    description="Persists updated node coordinates, hidden items, and working hypotheses to the local station sandbox.",
)
def save_view(
    view_id: str,
    payload: InvestigationViewSaveRequest,
    db: Session = Depends(get_db),
):
    return save_investigation_view(db=db, view_id=view_id, req=payload)
