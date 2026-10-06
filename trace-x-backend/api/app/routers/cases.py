from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas.case import (
    CaseItem,
    CaseCreateRequest,
    CaseUpdateRequest,
    CaseDetailResponse,
)
from app.schemas.common import PaginationParams, PaginatedResponse
from app.repositories.case_repo import (
    list_cases,
    get_case_detail,
    get_case_by_number_or_id,
    create_case,
    update_case,
)

from app.core.auth import CurrentUser, get_current_user, require_permission

router = APIRouter(prefix="/cases", tags=["Cases"])


@router.get(
    "",
    response_model=PaginatedResponse[CaseItem],
    summary="List Station Investigation Cases",
    description="Search cases with filters for status, crime type, location, and pagination.",
)
def get_cases(
    search: Optional[str] = Query(default=None, description="Search term for case title, ID, or description"),
    status: Optional[str] = Query(default=None, description="Filter by status (ACTIVE, UNDER_ANALYSIS, CLOSED, etc.)"),
    crime_type: Optional[str] = Query(default=None, description="Filter by crime category"),
    location: Optional[str] = Query(default=None, description="Filter by location/jurisdiction"),
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    current_user: CurrentUser = Depends(require_permission("view_case")),
    db: Session = Depends(get_db),
):
    params = PaginationParams(page=page, page_size=page_size)
    items, total = list_cases(
        db=db,
        current_user=current_user,
        search=search,
        status_filter=status,
        crime_type_filter=crime_type,
        location_filter=location,
        params=params,
    )
    return PaginatedResponse.create(items=items, total=total, params=params)


@router.get(
    "/{case_id}",
    response_model=CaseDetailResponse,
    summary="Get Case Dossier Details",
    description="Retrieve full case dossier including verified entities, evidence ledgers, and attention flags.",
)
def get_case(
    case_id: str,
    current_user: CurrentUser = Depends(require_permission("view_case")),
    db: Session = Depends(get_db),
):
    return get_case_detail(db=db, case_id=case_id, current_user=current_user)


from app.core.redis_cache import invalidate_cache_pattern


@router.post(
    "",
    response_model=CaseItem,
    status_code=status.HTTP_201_CREATED,
    summary="Create New Case Investigation",
    description="Initialize a new investigation case via the 5-step intake wizard with confirmed entities.",
)
async def create_new_case(
    payload: CaseCreateRequest,
    current_user: CurrentUser = Depends(require_permission("edit_case")),
    db: Session = Depends(get_db),
):
    result = create_case(db=db, req=payload)
    await invalidate_cache_pattern("dashboard:summary*")
    await invalidate_cache_pattern("cases:network:*")
    return result


@router.patch(
    "/{case_id}",
    response_model=CaseItem,
    summary="Update Case Attributes",
    description="Update status, priority, narrative, or attention reasons for an investigation case.",
)
async def update_existing_case(
    case_id: str,
    payload: CaseUpdateRequest,
    current_user: CurrentUser = Depends(require_permission("edit_case")),
    db: Session = Depends(get_db),
):
    # Verify user can view and edit case within their authority
    get_case_by_number_or_id(db, case_id, current_user=current_user)
    result = update_case(db=db, case_id=case_id, req=payload)
    await invalidate_cache_pattern("dashboard:summary*")
    await invalidate_cache_pattern(f"cases:network:{case_id}*")
    return result


