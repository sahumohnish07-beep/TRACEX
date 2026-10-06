# TRACE-X Observability & Telemetry Specification

**Status**: PRODUCTION READY (Prometheus, Grafana, Sentry, OpenMetrics & Tracing Active)  
**Classification**: Law Enforcement Sensitive / Statutory Operational Standards  
**Target Environment**: Docker Compose / Kubernetes Hardened Architecture  
**Last Updated**: 2026-09-30  

---

## 1. Executive Summary & Observability Architecture

TRACE-X delivers real-time situational awareness across high-stakes criminal intelligence workloads, asynchronous graph scoring pipelines, and strict statutory audit trails. The observability architecture ties together:
1. **Prometheus Metrics Engine**: Collects sub-second route latencies, connection pool health, Celery execution stats, and machine learning scoring distributions.
2. **Grafana Dashboards & Alerting**: Delivers actionable visualizations across API health, Celery throughput, ML drift early-warning, and database connection saturations.
3. **Statutory Distributed Tracing**: Correlates frontend user interactions with edge reverse proxy requests, FastAPI route executions, Celery background tasks, and append-only audit log events via a single unified `X-Request-ID`.
4. **Sentry Error Tracking with Statutory PII Scrubbing**: Ensures real-time stack trace capture with zero leakage of statutory law enforcement identifiers (Case IDs, Person IDs, Person Names, phone numbers, or vehicle plates).

```
   ┌────────────────────────────────────────────────────────┐
   │ React Frontend (@sentry/react + X-Request-ID Header)   │
   └───────────────────────────┬────────────────────────────┘
                               │ HTTPS / X-Request-ID
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ NGINX Edge Proxy ($req_id mapping + security headers)  │
   └───────────────────────────┬────────────────────────────┘
                               │ proxy_set_header X-Request-ID
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ FastAPI Core API (prometheus-fastapi-instrumentator)   │
   │  - RequestIdMiddleware & sentry_statutory_scrubber     │
   │  - OpenMetrics /metrics endpoint                       │
   │  - Audit log emission with correlation request_id       │
   └───────────────┬────────────────────────┬───────────────┘
                   │ Celery task dispatch   │ Engine & Driver status
                   ▼                        ▼
   ┌─────────────────────────┐   ┌──────────────────────────┐
   │ Celery Async Workers    │   │ PostgreSQL & Neo4j Pools │
   │  - @track_celery_task   │   │  - postgres_exporter     │
   │  - ML Serving metrics   │   │  - redis_exporter        │
   └───────────────┬─────────┘   └──────────┬───────────────┘
                   │                        │
                   └───────────┬────────────┘
                               ▼ Scrapes (:9090)
   ┌────────────────────────────────────────────────────────┐
   │ Prometheus Metrics Engine (Scrapes API, DB, Redis, ML) │
   │  - Evaluates alert_rules.yml every 15s                 │
   └───────────────────────────┬────────────────────────────┘
                               ▼ Alerting & Provisioned Viz (:3000)
   ┌────────────────────────────────────────────────────────┐
   │ Grafana Production Dashboards                          │
   │  - API Health & Traffic (Route p95, Error Rates)       │
   │  - Celery Throughput & ML Scoring Distribution         │
   │  - Database & Graph Driver Health                      │
   └────────────────────────────────────────────────────────┘
```

---

## 2. Prometheus Metrics & Scrape Catalog

Prometheus scrapes application and infrastructure targets every 15 seconds. Application metrics are exposed at `/metrics` via [main.py](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/api/app/main.py).

### 2.1 Metric Definitions

| Metric Name | Type | Labels | Description / Source |
| :--- | :--- | :--- | :--- |
| `http_requests_total` | Counter | `handler`, `method`, `status` | Route invocation counter from `prometheus-fastapi-instrumentator`. |
| `http_request_duration_seconds` | Histogram | `handler`, `method`, `status` | Request duration distribution per route. |
| `tracex_ml_predictions_total` | Counter | `evidence_strength` (`Strong`, `Moderate`, `Limited`) | Total scored connection predictions emitted by Isolation Forest pipeline. |
| `tracex_ml_prediction_latency_seconds` | Histogram | None | Inference latency distribution for missing-link scoring. |
| `tracex_ml_evidence_strength_ratio` | Gauge | `evidence_strength` | Real-time fraction of predictions in each evidence strength bracket. |
| `tracex_ml_drift_alert_gauge` | Gauge | None | Binary drift flag: `1` if Strong-ratio deviates >50% relative from 12.5% baseline, `0` otherwise. |
| `tracex_ml_strong_ratio_deviation` | Gauge | None | Absolute percentage point deviation of Strong predictions from baseline. |
| `tracex_celery_task_runs_total` | Counter | `task_name`, `status` (`success`, `failure`) | Celery background task outcome counter. |
| `tracex_celery_task_duration_seconds` | Histogram | `task_name` | Celery task execution time histogram. |
| `tracex_db_pool_size` | Gauge | None | Configured PostgreSQL SQLAlchemy pool size limit. |
| `tracex_db_pool_checked_out` | Gauge | None | Number of active checked-out connections to PostgreSQL. |
| `tracex_db_pool_overflow` | Gauge | None | PostgreSQL connection pool overflow count. |
| `tracex_neo4j_pool_in_use` | Gauge | None | Neo4j Bolt driver in-flight active sessions. |
| `tracex_neo4j_pool_idle` | Gauge | None | Neo4j Bolt driver pooled idle connections. |

### 2.2 Exporters in Compose
- **`postgres-exporter`** (`prom/postgres-exporter:v0.15.0` on port 9187): Exports connection counts, deadlocks, transaction throughput, table vacuum stats, and query latencies.
- **`redis-exporter`** (`oliver006/redis_exporter:v1.58.0` on port 9121): Exports Redis memory utilization, connected clients, queue depth, commands/sec, and eviction rates.

---

## 3. Provisioned Grafana Dashboards

Dashboards are provisioned declaratively via [dashboards.yml](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/infra/grafana/provisioning/dashboards/dashboards.yml).

### 3.1 API Health & Traffic (`tracex-api-health`)
- **Key Visualizations**:
  - Request Volume by Route & Method (`sum(rate(http_requests_total[5m])) by (handler, method)`).
  - P95 Request Latency (`histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, handler))`).
  - Error Rates 4xx & 5xx (`sum(rate(http_requests_total{status=~"[45].."}[5m])) / sum(rate(http_requests_total[5m])) * 100`).
  - Auth Flow Failures (`sum(rate(http_requests_total{handler=~".*login.*|.*auth.*", status=~"[45].."}[5m]))`).

### 3.2 Celery & ML Pipeline (`tracex-celery-ml-pipeline`)
- **Key Visualizations**:
  - Celery Throughput & Failure Rate (`sum(rate(tracex_celery_task_runs_total[5m])) by (task_name, status)`).
  - Background Task Latencies P50/P95/P99.
  - ML Scoring Volume per Minute (`sum(rate(tracex_ml_predictions_total[5m])) * 60`).
  - **Evidence-Strength Distribution Over Time (Prominent Trendline)**:
    - Plots `Strong`, `Moderate`, and `Limited` ratios over time.
    - Displays fixed statutory baseline threshold for Strong links at **12.5%** (`0.125`).
    - Visualizes drift envelope: Upper limit **18.75%** (`0.1875`) and Lower limit **6.25%** (`0.0625`).
    - Directly highlights `tracex_ml_drift_alert_gauge` state.

### 3.3 Database & Infrastructure Health (`tracex-db-health`)
- **Key Visualizations**:
  - PostgreSQL Pool Utilization (`tracex_db_pool_checked_out / tracex_db_pool_size * 100`).
  - Neo4j Graph Driver Pool In-Use vs. Idle.
  - Redis Memory Used & Broker Queue Size (`redis_connected_clients`, `redis_memory_used_bytes`).
  - PostgreSQL Active Connections & Transaction Commit/Rollback Rates (`pg_stat_database_xact_commit`).

---

## 4. Alert Ownership & Escalation Matrix

Alert rules are defined in [alert_rules.yml](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/infra/prometheus/alert_rules.yml) and evaluated continuously by Prometheus.

| Alert Name | Severity | Condition | Primary Owner | Escalation / Runbook |
| :--- | :--- | :--- | :--- | :--- |
| **`APIErrorRateSpike`** | Critical | 5xx error rate > 5% for > 2 min | Platform Engineering On-Call | Check FastAPI logs and Sentry for recent release regression or database outage. |
| **`AuthFailureSpike`** | Warning | Auth 4xx failure rate > 10 req/s for > 1 min | Security Ops / IAM Lead | Investigate potential brute-force or credential stuffing on Landing Page → `/login`. Inspect NGINX rate-limit drops. |
| **`CeleryBacklogGrowth`** | Warning | Task failure rate > 10% for > 5 min | Backend Team / Data Eng | Check Redis broker queue depth, worker OOM kills, and Neo4j connection saturation during missing-link scoring. |
| **`MLEvidenceStrengthDistributionDrift`** | Warning | `tracex_ml_drift_alert_gauge == 1` for > 15 min | ML Engineer / Lead Investigator | **PRIMARY MODEL DEGRADATION SIGNAL**. Inspect graph data pipeline, newly ingested cases, and Isolation Forest feature distributions. |
| **`PostgresPoolSaturation`** | Critical | Pool utilization > 90% for > 3 min | Platform Engineering / DBA | Check for leaked SQLAlchemy sessions or long-running audit query table scans. |

---

## 5. ML Evidence-Strength Drift Alert: Technical Justification

### 5.1 The Ground-Truth Dilemma in Production Law Enforcement
In production criminal intelligence, **ground-truth labels do not exist at inference time**. An edge between two persons of interest cannot be definitively confirmed as a true syndicate connection until months or years later following active police investigation, arrest, or judicial adjudication.

Supervised accuracy, precision-recall curves, and ROC-AUC cannot be calculated in real time. Consequently, **distribution drift in model outputs is the sole reliable early warning that the model's predictive power has collapsed**.

### 5.2 Isolation Forest Sensitivity & Weak Baseline Lift
The missing-link scoring engine utilizes an **Isolation Forest** unsupervised anomaly detector trained on graph topological features (Adamic-Adar, Jaccard coefficient, shared crime scenes, co-arrest counts, and timeline overlaps).

From Phase L benchmark evaluations:
- Baseline Strong-link ratio: **12.5%** of candidate pairs.
- Baseline Moderate-link ratio: **37.5%**.
- Baseline Limited-link ratio: **50.0%**.

Because Isolation Forest provides modest, fragile lift over random heuristics on sparse local police graphs, even slight shifts in graph density, entity duplication, or feature scaling cause the model to degenerate into two failure modes:
1. **False-Positive Saturation (Strong Ratio Spike > 18.75%)**: The model flags excessive pairs as "Strong", overwhelming detectives with low-quality leads and degrading investigative trust.
2. **False-Negative Collapse (Strong Ratio Drop < 6.25%)**: The model scores almost all pairs as "Limited", silently blinding investigators to critical syndicate links.

### 5.3 Alert Design
The metric `tracex_ml_drift_alert_gauge` is exposed by [metrics.py](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/ml/serving/metrics.py) using a rolling sample window (100 predictions) evaluated against statutory baseline:
$$\text{Relative Deviation} = \frac{|\text{Strong Ratio} - 0.125|}{0.125}$$
If relative deviation exceeds **50%** (i.e. Strong ratio falls below 6.25% or climbs above 18.75%) for >15 minutes, Prometheus triggers `MLEvidenceStrengthDistributionDrift`.

---

## 6. Distributed End-to-End Request Tracing Flow

TRACE-X enforces request traceability across all network and process boundaries using a standardized `X-Request-ID` header.

### 6.1 Lifecycle of a Request Trace

```
1. Frontend Action (React App / Landing Page)
   └─> getOrCreateRequestId() creates/reads sessionStorage X-Request-ID (e.g. "req-8f4b2a91-4c12-42da-91ef-7e3e21a8d055")
   └─> Attaches to axios/fetch request headers
   └─> Configures Sentry client scope: sentry.setTag("request_id", reqId)

2. Edge Reverse Proxy (NGINX)
   └─> Inspects incoming $http_x_request_id
   └─> If present, preserves as $req_id; if empty, generates new $request_id
   └─> Injects response header: add_header X-Request-ID $req_id always;
   └─> Passes to backend: proxy_set_header X-Request-ID $req_id;

3. Application Server (FastAPI)
   └─> RequestIdMiddleware intercepts incoming request
   └─> Assigns request.state.request_id = req_id
   └─> Attaches to Sentry scope: sentry_sdk.set_tag("request_id", req_id)
   └─> Reflects back on response: response.headers["X-Request-ID"] = req_id

4. Asynchronous Processing (Celery)
   └─> API router dispatches background task, passing request_id in task kwargs or headers
   └─> @track_celery_task logs execution context with correlation request_id

5. Statutory Audit Trail (PostgreSQL)
   └─> AuditLogMiddleware captures user, action, target case, and client IP
   └─> Writes entry to audit_logs table with details JSON containing:
       {"path": "/api/v1/cases/...", "method": "POST", "request_id": "req-8f4b2a91-..."}
```

### 6.2 Correlating Incidents Across Tools
When investigating a user-reported failure or Sentry alert:
1. Copy the `request_id` tag from the Sentry issue overview.
2. In Grafana Loki / NGINX access logs: filter by `request_id == "<REQ_ID>"` to verify edge HTTP status and latency.
3. In PostgreSQL Audit Logs:
   ```sql
   SELECT * FROM audit_logs 
   WHERE details LIKE '%req-8f4b2a91-4c12-42da-91ef-7e3e21a8d055%';
   ```
   This immediately reveals the sworn officer identity, timestamp, terminal IP, and affected Case Reference without guessing.

---

## 7. Sentry Statutory PII Scrubber Specification

In compliance with state police data protection mandates and evidentiary chain-of-custody safeguards, application error payloads **must never persist identifiable criminal or citizen data** in third-party error monitoring systems.

### 7.1 Redacted Entities & Regex Patterns
The FastAPI Sentry integration enforces `sentry_statutory_scrubber` ([observability.py](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/api/app/core/observability.py)) inside the `before_send` lifecycle:

| Target Identifier | Regular Expression Pattern | Substitution Token |
| :--- | :--- | :--- |
| **Case Numbers** | `CASE-\d{4}-\d{4,}` | `[REDACTED_CASE_ID]` |
| **Person IDs** | `PER-(?:TEST-)?[A-Z0-9]{4,}` | `[REDACTED_PERSON_ID]` |
| **Indian Phone Numbers** | `(?:\+91\|0)?[6-9]\d{9}` | `[REDACTED_PHONE]` |
| **Vehicle Registration Plates** | `[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}` | `[REDACTED_PLATE]` |
| **Police Badge Numbers** | `[A-Z]{2}-POL-\d{4}` | `[REDACTED_BADGE]` |

### 7.2 Field-Level Redactions
Any dictionary key matching `case_id`, `person_id`, `person_name`, `phone`, `plate_number`, `badge_number`, `password`, or `token` in:
- HTTP Request Body (`event["request"]["data"]`)
- Request Query Strings & URL paths (`event["request"]["url"]`, `event["request"]["query_string"]`)
- HTTP Headers (`Authorization`, `Cookie` stripped; all other headers scrubbed)
- Breadcrumb messages & breadcrumb payloads
- Exception messages and exception tracebacks

is unconditionally replaced with `[REDACTED_STATUTORY_PII]` while preserving `tags["request_id"]` for statutory log correlation.

### 7.3 Frontend Source-Mapped Traces & Release Tracking
- **Vite Configuration**: Sourcemaps enabled via `build.sourcemap = true` in [vite.config.ts](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/vite.config.ts).
- **Frontend Sentry**: Initialized in [sentry.ts](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/src/core/sentry.ts) with `BrowserTracing`, `Replay`, and `release: import.meta.env.VITE_SENTRY_RELEASE || "tracex-frontend@2.0.0"`.
- **Animated Components**: Errors originating in landing page canvas or graph physics components are caught cleanly by `SentryErrorBoundary` without crashing the application shell.
- **CI / Phase O Alignment**: Source map upload and release creation scripts hook directly into Git commit SHAs during container image packaging.

---

## 8. Verification & Operational Testing

The observability stack is verified via dedicated automated tests in [test_observability.py](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/api/tests/test_observability.py):
1. `test_prometheus_metrics_endpoint`: Confirms `/metrics` is live and serving Prometheus text format.
2. `test_celery_task_metrics_decorator`: Verifies `@track_celery_task` increments run counters and histogram durations.
3. `test_ml_metrics_prom_integration`: Verifies prediction counter, ratio gauges, and drift gauge outputs.
4. `test_db_pool_metrics_collector`: Confirms pool gauges report active and overflow stats.
5. `test_request_id_middleware_propagation`: Validates incoming and generated `X-Request-ID` handling.
6. `test_sentry_statutory_pii_scrubber`: Proves URLs, exceptions, breadcrumbs, and bodies containing Case IDs, Person IDs, phone numbers, and badge numbers are redacted while `request_id` tags remain intact.
