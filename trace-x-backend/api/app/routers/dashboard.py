from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas.dashboard import DashboardSummaryResponse
from app.repositories.dashboard_repo import get_dashboard_summary

from app.core.redis_cache import get_cached_json, set_cached_json

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
    summary="Get Operational Overview Summary",
    description="Returns the 4 stat cards (Active Cases, Under Analysis, Pending Requests, New Connections), Recent Cases table rows, and Requires Attention alert items for the station dashboard.",
)
async def get_summary(db: Session = Depends(get_db)):
    cache_key = "dashboard:summary"
    cached = await get_cached_json(cache_key)
    if cached:
        return DashboardSummaryResponse(**cached)

    result = get_dashboard_summary(db)
    await set_cached_json(cache_key, result.dict(), ttl_seconds=45)
    return result

