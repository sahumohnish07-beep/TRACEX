from app.routers.dashboard import router as dashboard_router
from app.routers.cases import router as cases_router
from app.routers.persons import router as persons_router
from app.routers.network import router as network_router
from app.routers.missing_links import router as missing_links_router
from app.routers.documents import router as documents_router
from app.routers.requests import router as requests_router
from app.routers.incoming_requests import router as incoming_requests_router
from app.routers.received_data import router as received_data_router
from app.routers.investigation_views import router as investigation_views_router
from app.routers.audit import router as audit_router
from app.routers.internal_scoring import router as internal_scoring_router

__all__ = [
    "dashboard_router",
    "cases_router",
    "persons_router",
    "network_router",
    "missing_links_router",
    "documents_router",
    "requests_router",
    "incoming_requests_router",
    "received_data_router",
    "investigation_views_router",
    "audit_router",
    "internal_scoring_router",
]
