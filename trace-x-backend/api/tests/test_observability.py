"""TRACE-X Observability Test Suite.
Validates:
1. Prometheus FastAPI scrape endpoint (/metrics) exposure and metric format.
2. ML prediction counters and weekly distribution drift alert gauge.
3. Celery task duration and success/failure counters.
4. Database & Neo4j connection pool gauges.
5. Sentry statutory PII scrubber (redacts CaseID, PersonID, Names, Phone, Plate, Badge).
6. End-to-end X-Request-ID propagation across middleware and headers.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.observability import (
    track_celery_task,
    sentry_statutory_scrubber,
    update_db_pool_metrics,
    CELERY_TASK_RUNS_TOTAL,
    CELERY_TASK_DURATION_SECONDS,
)
from ml.serving.metrics import (
    record_prediction_metric,
    perform_weekly_distribution_check,
    get_evidence_strength_distribution,
    PROMETHEUS_PREDICTIONS_TOTAL,
    PROMETHEUS_DRIFT_ALERT_GAUGE,
    PROMETHEUS_EVIDENCE_STRENGTH_RATIO,
)


@pytest.fixture
def client():
    return TestClient(app)


# =============================================================================
# 1. Prometheus /metrics Endpoint & Instrumentation Tests
# =============================================================================

def test_prometheus_metrics_endpoint_exposed(client):
    """Verify /metrics returns 200 OK and valid Prometheus exposition format."""
    response = client.get("/metrics")
    assert response.status_code == 200
    body = response.text

    # Verify standard instrumentator metrics
    assert "tracex_http_requests_total" in body or "http_requests_total" in body
    # Verify ML metrics are wired into scrape output
    assert "tracex_ml_predictions_total" in body
    assert "tracex_ml_prediction_latency_seconds" in body
    assert "tracex_ml_evidence_strength_ratio" in body
    assert "tracex_ml_drift_alert_gauge" in body
    # Verify Celery task metrics
    assert "tracex_celery_task_runs_total" in body
    assert "tracex_celery_task_duration_seconds" in body
    # Verify DB pool gauges
    assert "tracex_db_pool_size" in body
    assert "tracex_neo4j_pool_in_use" in body


# =============================================================================
# 2. ML Prediction Counters & Drift Detection Hook
# =============================================================================

def test_ml_prediction_metrics_and_drift_gauge():
    """Verify recording predictions updates Prometheus counters and drift gauge."""
    # Record predictions across evidence strengths
    for _ in range(12):
        record_prediction_metric("Moderate", 0.045)
    for _ in range(25):
        record_prediction_metric("Limited", 0.030)
    for _ in range(5):
        record_prediction_metric("Strong", 0.080)

    dist = get_evidence_strength_distribution()
    assert dist["total_predictions"] >= 42
    assert dist["Strong"] > 0
    assert dist["Moderate"] > 0
    assert dist["Limited"] > 0

    # Perform weekly distribution check
    snapshot = perform_weekly_distribution_check()
    assert "distribution" in snapshot
    assert "drift_detected" in snapshot
    assert "relative_deviation" in snapshot

    # Verify drift alert gauge is published
    gauge_val = PROMETHEUS_DRIFT_ALERT_GAUGE._value.get()
    assert gauge_val in (0.0, 1.0)


# =============================================================================
# 3. Custom Celery Task Tracking
# =============================================================================

def test_celery_task_tracking_decorator():
    """Verify track_celery_task decorator records task duration and success/failure counters."""
    @track_celery_task("test_score_missing_links")
    def mock_successful_task():
        return {"status": "SUCCESS"}

    @track_celery_task("test_score_missing_links")
    def mock_failing_task():
        raise RuntimeError("Simulated celery pipeline crash")

    # Run successful task
    res = mock_successful_task()
    assert res["status"] == "SUCCESS"

    # Run failing task
    with pytest.raises(RuntimeError):
        mock_failing_task()

    # Verify metrics updated
    success_count = CELERY_TASK_RUNS_TOTAL.labels(
        task_name="test_score_missing_links", status="SUCCESS"
    )._value.get()
    fail_count = CELERY_TASK_RUNS_TOTAL.labels(
        task_name="test_score_missing_links", status="FAILURE"
    )._value.get()

    assert success_count >= 1
    assert fail_count >= 1


# =============================================================================
# 4. Database & Neo4j Pool Gauge Updates
# =============================================================================

def test_update_db_pool_metrics():
    """Verify update_db_pool_metrics polls SQLAlchemy and Neo4j states without crashing."""
    # Should execute cleanly and update gauges
    update_db_pool_metrics()


# =============================================================================
# 5. Sentry Statutory PII Scrubber
# =============================================================================

def test_sentry_statutory_pii_scrubber():
    """Verify Sentry scrubber strips CaseID, PersonID, Officer Names, Phone, Plate, Badge."""
    unscrubbed_event = {
        "event_id": "99a8b7c6d5e4f3a2b1",
        "tags": {
            "case_id": "CASE-2026-0891",
            "request_id": "req-trace-4412",
        },
        "extra": {
            "target_person": "PER-4401",
            "full_name": "Tariq Merchant",
            "contact_phone": "+919876543210",
            "vehicle_plate": "MH-02-AB-4412",
            "badge_number": "MH-POL-4412",
        },
        "request": {
            "url": "http://api:8000/api/v1/cases/CASE-2026-0891/missing-links",
            "headers": {
                "Authorization": "Bearer sensitive_token_xyz",
                "Cookie": "session_cookie=abc",
                "X-Request-ID": "req-trace-4412",
            },
            "data": {
                "officer": "Insp. Vikram Deshmukh",
                "case_id": "CASE-2026-0891",
            },
        },
        "breadcrumbs": {
            "values": [
                {
                    "message": "Viewed dossier for PER-4401 in CASE-2026-0891",
                    "data": {"phone": "9876543210"},
                }
            ]
        },
        "exception": {
            "values": [
                {
                    "value": "Database connection failed for CASE-2026-0891 with PER-4401",
                }
            ]
        },
    }

    scrubbed = sentry_statutory_scrubber(unscrubbed_event, {})

    # Verify request_id is preserved for distributed audit tracing
    assert scrubbed["tags"]["request_id"] == "req-trace-4412"

    # Verify sensitive law enforcement IDs and PII are redacted
    assert "CASE-2026-0891" not in str(scrubbed)
    assert "PER-4401" not in str(scrubbed)
    assert "Tariq Merchant" not in str(scrubbed)
    assert "Insp. Vikram Deshmukh" not in str(scrubbed)
    assert "+919876543210" not in str(scrubbed)
    assert "MH-02-AB-4412" not in str(scrubbed)
    assert "MH-POL-4412" not in str(scrubbed)

    # Verify Authorization and Cookie headers removed
    assert "Authorization" not in scrubbed["request"]["headers"]
    assert "Cookie" not in scrubbed["request"]["headers"]


# =============================================================================
# 6. End-to-End X-Request-ID Tracing
# =============================================================================

def test_request_id_propagation_via_middleware(client):
    """Verify X-Request-ID is preserved if provided, or generated if absent."""
    # Case A: Client provides existing request-id
    custom_id = "req-custom-investigator-trace-999"
    res_a = client.get("/metrics", headers={"X-Request-ID": custom_id})
    assert res_a.headers.get("X-Request-ID") == custom_id

    # Case B: Client does not provide request-id -> middleware generates one
    res_b = client.get("/metrics")
    assert "X-Request-ID" in res_b.headers
    assert res_b.headers["X-Request-ID"].startswith("req-")
