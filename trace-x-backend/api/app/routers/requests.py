from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas.requests import DataRequestItem, DataRequestCreate, DataRequestUpdate
from app.schemas.common import PaginationParams, PaginatedResponse
from app.repositories.request_repo import (
    list_outgoing_requests,
    create_outgoing_request,
    delete_outgoing_request,
)

router = APIRouter(prefix="/requests", tags=["Data Requests"])


@router.get(
    "",
    response_model=PaginatedResponse[DataRequestItem],
    summary="List Outgoing Inter-Agency Data Requests",
    description="Fetch list of outgoing requisitions dispatched to state CID, RTO, or central intelligence agencies.",
)
def get_requests(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    params = PaginationParams(page=page, page_size=page_size)
    items, total = list_outgoing_requests(db=db, params=params)
    return PaginatedResponse.create(items=items, total=total, params=params)


@router.post(
    "",
    response_model=DataRequestItem,
    status_code=status.HTTP_201_CREATED,
    summary="Create Outgoing Inter-Agency Data Requisition",
    description="Initiates official statutory requisition for cross-border telecom logs, vehicle registrations, or financial records.",
)
def create_request(
    payload: DataRequestCreate,
    db: Session = Depends(get_db),
):
    return create_outgoing_request(db=db, req=payload)


@router.delete(
    "/{request_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Cancel / Withdraw Data Request",
    description="Withdraws pending outgoing requisition prior to receiving authority transmission.",
)
def delete_request(
    request_id: str,
    db: Session = Depends(get_db),
):
    delete_outgoing_request(db=db, request_id=request_id)
