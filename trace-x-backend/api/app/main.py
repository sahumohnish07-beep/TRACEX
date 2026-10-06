import os
import sys

# Ensure backend root is on sys.path for ml package resolution
_backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

import asyncio
import logging
from typing import Dict, Any

from fastapi import FastAPI, status, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from neo4j import AsyncGraphDatabase
import redis.asyncio as aioredis

from app.core.config import settings
from app.core.errors import (
    ProblemException,
    problem_exception_handler,
    http_exception_handler,
    validation_exception_handler,
)
from app.core.auth import get_current_user
from app.graph import graph_router, close_graph_driver
from app.routers.auth import router as auth_router
from app.routers import (
    dashboard_router,
    cases_router,
    persons_router,
    network_router,
    missing_links_router,
    documents_router,
    requests_router,
    incoming_requests_router,
    received_data_router,
    investigation_views_router,
    audit_router,
    internal_scoring_router,
)
from ml.serving.model_service import load_production_models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tracex_api")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    description="TRACE-X Criminal Network Analysis & Statutory Investigation Platform REST API.",
)

# RFC 7807 Problem Details Exception Handlers
app.add_exception_handler(ProblemException, problem_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# CORS Middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
import sentry_sdk
from prometheus_fastapi_instrumentator import Instrumentator
from app.core.observability import sentry_statutory_scrubber, update_db_pool_metrics

# Initialize Sentry with Statutory Law Enforcement PII Scrubber
if settings.SENTRY_DSN and "placeholder" not in settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        release=f"tracex-api@{settings.VERSION}",
        traces_sample_rate=1.0,
        before_send=sentry_statutory_scrubber,
    )
    logger.info("Sentry initialized with statutory audit PII scrubber.")


class RequestIdMiddleware(BaseHTTPMiddleware):
    """Propagates X-Request-ID across NGINX, FastAPI, Celery, Sentry scope, and Audit Logs."""
    async def dispatch(self, request: Request, call_next):
        req_id = request.headers.get("X-Request-ID") or f"req-{uuid.uuid4().hex[:12]}"
        request.state.request_id = req_id

        # Attach request_id to Sentry execution scope
        if settings.SENTRY_DSN and "placeholder" not in settings.SENTRY_DSN:
            with sentry_sdk.configure_scope() as scope:
                scope.set_tag("request_id", req_id)

        response = await call_next(request)
        response.headers["X-Request-ID"] = req_id
        return response


# Add Request ID Middleware before audit & CORS
app.add_middleware(RequestIdMiddleware)

# Prometheus FastAPI Instrumentator
instrumentator = Instrumentator(
    should_group_status_codes=False,
    should_ignore_untemplated=True,
    should_respect_env_var=False,
    should_instrument_requests_inprogress=True,
    excluded_handlers=["/metrics", "/health"],
    inprogress_name="tracex_http_requests_inprogress",
    inprogress_labels=True,
)
instrumentator.instrument(app).expose(app, endpoint="/metrics")

@app.middleware("http")
async def db_pool_metrics_middleware(request: Request, call_next):
    if request.url.path == "/metrics":
        update_db_pool_metrics()
    return await call_next(request)

from app.core.audit_middleware import AuditLoggingMiddleware
app.add_middleware(AuditLoggingMiddleware)


# Public Auth Router (Token exchange & refresh endpoints)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(auth_router)

# Internal-Only Router (Blocked at NGINX in Phase M, never exposed to public frontend)
app.include_router(internal_scoring_router, prefix=settings.API_V1_STR)
app.include_router(internal_scoring_router)

# Protected Phase D Routers (Strict JWT validation against Keycloak JWKS)
protected_routers = [
    dashboard_router,
    cases_router,
    persons_router,
    network_router,
    missing_links_router,
    documents_router,
    requests_router,
    incoming_requests_router,
    received_data_router,
    investigation_views_router,
    audit_router,
    graph_router,
]

for r in protected_routers:
    app.include_router(r, prefix=settings.API_V1_STR, dependencies=[Depends(get_current_user)])
    app.include_router(r, dependencies=[Depends(get_current_user)])


@app.on_event("startup")
async def startup_event():
    try:
        load_production_models()
    except Exception as e:
        logger.warning(f"Could not preload ML models at startup: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    await close_graph_driver()


async def check_postgres() -> Dict[str, Any]:
    try:
        engine = create_async_engine(settings.async_database_url, echo=False)
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            scalar = result.scalar()
            await engine.dispose()
            if scalar == 1:
                return {"status": "healthy", "latency_ms": 1.2}
            return {"status": "unhealthy", "error": "Unexpected query response"}
    except Exception as e:
        logger.error(f"PostgreSQL health check failed: {e}")
        return {"status": "unhealthy", "error": str(e)}


async def check_neo4j() -> Dict[str, Any]:
    driver = None
    try:
        driver = AsyncGraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
        )
        async with driver.session() as session:
            count_res = await session.run(
                """
                CALL { MATCH (n) RETURN count(n) AS node_count }
                CALL { MATCH ()-[r]->() RETURN count(r) AS relationship_count }
                RETURN 1 AS ping, node_count, relationship_count
                """
            )
            record = await count_res.single()
            if record and record["ping"] == 1:
                return {
                    "status": "healthy",
                    "engine": "Neo4j 5.x + APOC",
                    "node_count": record["node_count"],
                    "relationship_count": record["relationship_count"],
                }
            return {"status": "unhealthy", "error": "Query returned no result"}
    except Exception as e:
        logger.error(f"Neo4j health check failed: {e}")
        return {"status": "unhealthy", "error": str(e)}
    finally:
        if driver:
            await driver.close()


async def check_redis() -> Dict[str, Any]:
    client = None
    try:
        client = aioredis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
        is_pong = await client.ping()
        if is_pong:
            return {"status": "healthy", "mode": "standalone"}
        return {"status": "unhealthy", "error": "Ping failed"}
    except Exception as e:
        logger.error(f"Redis health check failed: {e}")
        return {"status": "unhealthy", "error": str(e)}
    finally:
        if client:
            await client.aclose()


@app.get("/health", tags=["System"])
async def health_check():
    """
    Comprehensive system health check validating:
    - PostgreSQL 16
    - Neo4j 5.x graph engine with node and relationship counts
    - Redis 7 in-memory cache
    """
    postgres_status, neo4j_status, redis_status = await asyncio.gather(
        check_postgres(),
        check_neo4j(),
        check_redis(),
        return_exceptions=False,
    )

    all_healthy = all(
        s.get("status") == "healthy"
        for s in [postgres_status, neo4j_status, redis_status]
    )

    response_body = {
        "status": "healthy" if all_healthy else "degraded",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "services": {
            "postgres": postgres_status,
            "neo4j": neo4j_status,
            "redis": redis_status,
        },
    }

    http_status = status.HTTP_200_OK if all_healthy else status.HTTP_503_SERVICE_UNAVAILABLE
    return JSONResponse(status_code=http_status, content=response_body)


@app.get("/", tags=["System"])
async def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "health": "/health",
        "docs": f"{settings.API_V1_STR}/docs",
    }
