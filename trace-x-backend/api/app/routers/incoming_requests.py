from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas.incoming_requests import (
    IncomingRequestItem,
    IncomingActionRequest,
    IncomingShareRequest,
)
from app.repositories.request_repo import (
    list_incoming_requests,
    get_incoming_request,
    act_on_incoming_request,
    share_incoming_request_data,
)

from app.core.auth import CurrentUser, require_permission

router = APIRouter(prefix="/incoming-requests", tags=["Incoming Requisitions & Disclosures"])


@router.get(
    "",
    response_model=List[IncomingRequestItem],
    summary="List Incoming Requisitions from Outside Agencies",
    description="Retrieve all incoming official data requisitions seeking local station records, vehicles, and network graphs.",
)
def get_incoming_list(
    current_user: CurrentUser = Depends(require_permission("view_case")),
    db: Session = Depends(get_db),
):
    return list_incoming_requests(db=db)


@router.get(
    "/{request_id}",
    response_model=IncomingRequestItem,
    summary="Get Incoming Requisition Details & Disclosure Checklist",
    description="Inspect agency mandate, requested records, and available vs restricted local documents.",
)
def get_incoming_detail(
    request_id: str,
    current_user: CurrentUser = Depends(require_permission("view_case")),
):
    return get_incoming_request(request_id=request_id)


@router.post(
    "/{request_id}/approve",
    response_model=IncomingRequestItem,
    summary="Approve Incoming Requisition",
    description="Formally approve incoming data request for disclosure packaging.",
)
def approve_request(
    request_id: str,
    current_user: CurrentUser = Depends(require_permission("approve_data_request")),
):
    return act_on_incoming_request(request_id=request_id, action="APPROVE")


@router.post(
    "/{request_id}/reject",
    response_model=IncomingRequestItem,
    summary="Reject Incoming Requisition",
    description="Reject external request with legal reason returned to requesting agency.",
)
def reject_request(
    request_id: str,
    current_user: CurrentUser = Depends(require_permission("approve_data_request")),
):
    return act_on_incoming_request(request_id=request_id, action="REJECT")


@router.post(
    "/{request_id}/clarify",
    response_model=IncomingRequestItem,
    summary="Request Clarification on Requisition Scope",
    description="Send formal query back to requesting officer requesting tighter scope or legal justification.",
)
def clarify_request(
    request_id: str,
    current_user: CurrentUser = Depends(require_permission("approve_data_request")),
):
    return act_on_incoming_request(request_id=request_id, action="CLARIFY")


@router.post(
    "/{request_id}/share",
    summary="Transmit Disclosed Data Package (Selective Sharing)",
    description="Transmits explicitly checked records only over Gov-PKI Level 3 pipe with time-locked validity token. Never defaults to all records.",
)
def share_data_package(
    request_id: str,
    payload: IncomingShareRequest,
    current_user: CurrentUser = Depends(require_permission("share_records")),
    db: Session = Depends(get_db),
):
    return share_incoming_request_data(
        db=db,
        request_id=request_id,
        req=payload,
    )

