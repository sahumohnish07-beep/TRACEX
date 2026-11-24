from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas.received_data import ReceivedDataItem, AddToViewRequest
from app.repositories.received_data_repo import (
    list_received_data,
    add_received_data_to_view,
)

router = APIRouter(prefix="/received-data", tags=["Received Data"])


@router.get(
    "",
    response_model=List[ReceivedDataItem],
    summary="List Data Packages Received from Outside Agencies",
    description="Inspect transferred data payloads including decrypted IP access logs, RTO registry exports, and financial records.",
)
def get_received_data(db: Session = Depends(get_db)):
    return list_received_data(db=db)


@router.post(
    "/{payload_id}/add-to-view",
    response_model=ReceivedDataItem,
    summary="Merge Received Data Package into Investigation Workspace",
    description="Imports entities and telemetry from received data package into private case workspace view.",
)
def merge_data_into_view(
    payload_id: str,
    payload: AddToViewRequest,
    db: Session = Depends(get_db),
):
    return add_received_data_to_view(db=db, payload_id=payload_id, view_id=payload.viewId)
