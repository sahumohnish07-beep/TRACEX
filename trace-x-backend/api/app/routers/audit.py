from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas.audit import AuditLogEntry, AuditLogFilterParams
from app.schemas.common import PaginationParams, PaginatedResponse
from app.repositories.audit_repo import list_audit_logs

from app.core.auth import CurrentUser, require_permission

router = APIRouter(prefix="/audit-log", tags=["Statutory Audit Trail"])


@router.get(
    "",
    response_model=PaginatedResponse[AuditLogEntry],
    summary="Query Immutable Statutory Station Audit Trail",
    description="Inspect audit ledger with strict filters for Action Category, Associated Case, Officer, and Date Range.",
)
def get_audit_trail(
    action: Optional[str] = Query(default=None, description="Action category (e.g. USER_LOGIN_AUTHENTICATED)"),
    case_ref: Optional[str] = Query(default=None, description="Case reference number"),
    search: Optional[str] = Query(default=None, description="Free text search in officer, action, or details"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user: CurrentUser = Depends(require_permission("view_audit_log")),
    db: Session = Depends(get_db),
):
    filters = AuditLogFilterParams(action=action, case_ref=case_ref, search=search)
    params = PaginationParams(page=page, page_size=page_size)
    items, total = list_audit_logs(db=db, filters=filters, params=params, current_user=current_user)
    return PaginatedResponse.create(items=items, total=total, params=params)

