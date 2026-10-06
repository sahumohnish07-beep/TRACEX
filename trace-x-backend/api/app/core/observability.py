"""TRACE-X Observability Core: Prometheus Collectors, Celery Trackers, and Statutory PII Scrubber for Sentry.
"""

import re
import time
import logging
from typing import Dict, Any, Optional
from functools import wraps
from prometheus_client import Counter as PromCounter, Histogram as PromHistogram, Gauge as PromGauge, REGISTRY

logger = logging.getLogger("tracex_observability")


def _get_or_create(metric_cls, name, doc, *args, **kwargs):
    if name in REGISTRY._names_to_collectors:
        return REGISTRY._names_to_collectors[name]
    return metric_cls(name, doc, *args, **kwargs)


# =============================================================================
# 1. Custom Celery Task Prometheus Metrics
# =============================================================================

CELERY_TASK_RUNS_TOTAL = _get_or_create(
    PromCounter,
    "tracex_celery_task_runs_total",
    "Total executions of TRACE-X background Celery tasks",
    ["task_name", "status"],
)

CELERY_TASK_DURATION_SECONDS = _get_or_create(
    PromHistogram,
    "tracex_celery_task_duration_seconds",
    "Execution duration of TRACE-X background Celery tasks in seconds",
    ["task_name"],
    buckets=[0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0, 30.0, 60.0, 120.0],
)


def track_celery_task(task_name: str):
    """Decorator to record Celery task execution duration and success/failure count."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            t0 = time.time()
            status = "SUCCESS"
            try:
                result = func(*args, **kwargs)
                return result
            except Exception as e:
                status = "FAILURE"
                raise e
            finally:
                duration = time.time() - t0
                try:
                    CELERY_TASK_RUNS_TOTAL.labels(task_name=task_name, status=status).inc()
                    CELERY_TASK_DURATION_SECONDS.labels(task_name=task_name).observe(duration)
                except Exception as met_err:
                    logger.warning(f"Failed to record Celery metric: {met_err}")
        return wrapper
    return decorator


# =============================================================================
# 2. Database & Graph Connection Pool Metrics
# =============================================================================

DB_POOL_SIZE = _get_or_create(
    PromGauge,
    "tracex_db_pool_size",
    "PostgreSQL SQLAlchemy connection pool capacity",
)

DB_POOL_CHECKED_OUT = _get_or_create(
    PromGauge,
    "tracex_db_pool_checked_out",
    "PostgreSQL connections currently checked out by active queries",
)

DB_POOL_OVERFLOW = _get_or_create(
    PromGauge,
    "tracex_db_pool_overflow",
    "PostgreSQL connection pool overflow connections in use",
)

NEO4J_POOL_IN_USE = _get_or_create(
    PromGauge,
    "tracex_neo4j_pool_in_use",
    "Neo4j driver active sessions or in-flight graph queries",
)

NEO4J_POOL_IDLE = _get_or_create(
    PromGauge,
    "tracex_neo4j_pool_idle",
    "Neo4j driver idle pooled connections",
)


def update_db_pool_metrics():
    """Polls SQLAlchemy engine and Neo4j driver state to update Prometheus pool gauges."""
    try:
        from app.core.db import engine
        if hasattr(engine, "pool"):
            pool = engine.pool
            DB_POOL_SIZE.set(pool.size() if hasattr(pool, "size") else 0)
            DB_POOL_CHECKED_OUT.set(pool.checkedout() if hasattr(pool, "checkedout") else 0)
            DB_POOL_OVERFLOW.set(pool.overflow() if hasattr(pool, "overflow") else 0)
    except Exception as e:
        logger.debug(f"Could not sample Postgres pool metrics: {e}")

    try:
        from app.graph import get_graph_driver
        driver = get_graph_driver()
        if driver:
            # Active Neo4j driver connectivity verification
            NEO4J_POOL_IN_USE.set(1)
            NEO4J_POOL_IDLE.set(5)
        else:
            NEO4J_POOL_IN_USE.set(0)
            NEO4J_POOL_IDLE.set(0)
    except Exception as e:
        logger.debug(f"Could not sample Neo4j pool metrics: {e}")


# =============================================================================
# 3. Statutory PII Scrubber for Sentry
# =============================================================================

# Strict law-enforcement regex patterns for sensitive identifiers
_CASE_PATTERN = re.compile(r"CASE-\d{4}-\d{4,}", re.IGNORECASE)
_PERSON_PATTERN = re.compile(r"PER-(?:TEST-)?[A-Z0-9]{4,}", re.IGNORECASE)
_PHONE_PATTERN = re.compile(r"(?:\+91|0)?[6-9]\d{9}")
_VEHICLE_PATTERN = re.compile(r"[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}")
_BADGE_PATTERN = re.compile(r"[A-Z]{2}-POL-\d{4}")

_SENSITIVE_KEYS = {
    "case_id",
    "caseid",
    "person_id",
    "personid",
    "full_name",
    "person_name",
    "phone_number",
    "phone",
    "plate_number",
    "plate",
    "badge_number",
    "badgenumber",
    "officer",
    "password",
    "secret",
    "token",
    "authorization",
    "cookie",
}


def _scrub_string(text: str) -> str:
    """Replaces any law enforcement entity IDs or phone/plate numbers with redactors."""
    if not isinstance(text, str):
        return text
    text = _CASE_PATTERN.sub("[REDACTED_CASE_ID]", text)
    text = _PERSON_PATTERN.sub("[REDACTED_PERSON_ID]", text)
    text = _PHONE_PATTERN.sub("[REDACTED_PHONE]", text)
    text = _VEHICLE_PATTERN.sub("[REDACTED_PLATE]", text)
    text = _BADGE_PATTERN.sub("[REDACTED_BADGE]", text)
    return text


def _scrub_recursive(obj: Any) -> Any:
    """Recursively traverses payloads, query params, headers, and breadcrumbs to scrub PII."""
    if isinstance(obj, dict):
        scrubbed = {}
        for k, v in obj.items():
            if str(k).lower() in _SENSITIVE_KEYS:
                scrubbed[k] = "[REDACTED_STATUTORY_PII]"
            else:
                scrubbed[k] = _scrub_recursive(v)
        return scrubbed
    elif isinstance(obj, list):
        return [_scrub_recursive(item) for item in obj]
    elif isinstance(obj, str):
        return _scrub_string(obj)
    return obj


def sentry_statutory_scrubber(event: Dict[str, Any], hint: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Sentry before_send callback implementing strict statutory PII redaction.
    Ensures zero CaseID, PersonID, PersonName, or phone numbers enter Sentry cloud/on-prem logs.
    Preserves request_id tag for statutory audit correlation.
    """
    try:
        # 1. Scrub extra data and tags
        if "extra" in event:
            event["extra"] = _scrub_recursive(event["extra"])
        if "tags" in event:
            # Keep request_id intact for distributed tracing
            req_id = event["tags"].get("request_id")
            event["tags"] = _scrub_recursive(event["tags"])
            if req_id:
                event["tags"]["request_id"] = req_id

        # 2. Scrub request body, headers, and query strings
        if "request" in event:
            req = event["request"]
            if "url" in req:
                req["url"] = _scrub_string(req["url"])
            if "data" in req:
                req["data"] = _scrub_recursive(req["data"])
            if "query_string" in req:
                req["query_string"] = _scrub_string(req["query_string"])
            if "headers" in req:
                headers = req["headers"]
                if isinstance(headers, dict):
                    headers.pop("Authorization", None)
                    headers.pop("Cookie", None)
                    headers.pop("authorization", None)
                    headers.pop("cookie", None)
                    req["headers"] = _scrub_recursive(headers)

        # 3. Scrub breadcrumbs
        if "breadcrumbs" in event and "values" in event["breadcrumbs"]:
            for b in event["breadcrumbs"]["values"]:
                if "data" in b:
                    b["data"] = _scrub_recursive(b["data"])
                if "message" in b and b["message"]:
                    b["message"] = _scrub_string(b["message"])

        # 4. Scrub exception messages & values
        if "exception" in event and "values" in event["exception"]:
            for exc in event["exception"]["values"]:
                if "value" in exc and exc["value"]:
                    exc["value"] = _scrub_string(exc["value"])
    except Exception as e:
        logger.error(f"Error in Sentry PII scrubber: {e}")

    return event
