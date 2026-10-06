# TRACE-X Backend Monorepo

Backend infrastructure and API service for the **TRACE-X Criminal Network Analysis & Investigation Platform**. Runs alongside the existing React + TypeScript frontend without port conflicts.

---

## 1. Directory Structure

```
trace-x-backend/
├── api/                    FastAPI service & Celery background tasks
│   ├── app/
│   │   ├── core/           Configuration (pydantic-settings), Celery setup
│   │   └── main.py         Application entrypoint & GET /health check
│   ├── Dockerfile
│   └── requirements.txt    Pinned dependencies
├── ml/                     Machine Learning pipelines & model artifacts
│   ├── pipelines/          Entity resolution & link prediction stubs
│   └── artifacts/          Serialized models
├── infra/                  Deployment & infrastructure configurations
│   ├── docker/
│   ├── nginx/              Reverse proxy configuration (api, keycloak, frontend)
│   ├── keycloak/           Realm export (roles, clients, test local officer)
│   ├── prometheus/         Metrics scrape configuration
│   └── vault/              Dev-mode secret engine configuration
├── migrations/             Alembic migration configuration for PostgreSQL
│   ├── alembic.ini
│   ├── env.py
│   └── versions/
├── neo4j/                  Graph database Cypher scripts
│   ├── schema.cypher       Unique constraints & search indexes
│   └── seed.cypher         Station network seed data
├── .github/workflows/      CI linting & compose validation
├── docker-compose.yml      Orchestration for all 10 services on `tracex-net`
├── .env.example            Environment configuration template
└── .env                    Local environment variables
```

---

## 2. Services & Port Mapping

All services communicate over the internal Docker network `tracex-net`:

| Service | Container Name | Image / Version | Host Port | Purpose |
|---|---|---|---|---|
| **PostgreSQL** | `tracex-postgres` | `postgres:16-alpine` | `5432` | Relational case data & audit log |
| **Neo4j** | `tracex-neo4j` | `neo4j:5.19-community` | `7474`, `7687` | Criminal association graph (APOC enabled) |
| **Redis** | `tracex-redis` | `redis:7-alpine` | `6379` | In-memory cache & Celery broker |
| **Keycloak** | `tracex-keycloak` | `keycloak:24.0` | `8080` | OIDC IAM, realm `tracex` |
| **HashiCorp Vault** | `tracex-vault` | `vault:1.15` | `8200` | Secure secrets management |
| **API** | `tracex-api` | FastAPI (Python 3.11) | `8000` | Core backend REST API |
| **Celery Worker** | `tracex-celery-worker` | FastAPI image | — | Asynchronous forensic tasks |
| **Celery Beat** | `tracex-celery-beat` | FastAPI image | — | Scheduled pipeline coordinator |
| **Nginx** | `tracex-nginx` | `nginx:1.25-alpine` | `80` | Reverse proxy for API & Auth |
| **Prometheus** | `tracex-prometheus` | `prometheus:v2.51.0` | `9090` | Time-series metrics collection |
| **Grafana** | `tracex-grafana` | `grafana:10.4.0` | `3000` | Operational monitoring dashboard |

> **Frontend Port Isolation**: The frontend runs independently on Vite port `5173`. None of the backend services use port `5173`, ensuring zero collision.

---

## 3. Quick Start

### Start all services
```bash
cd trace-x-backend
docker compose up -d --build
```

### Verify Container Health
```bash
docker compose ps
```

### Healthcheck Endpoint
```bash
curl http://localhost:8000/health
```
Expected response:
```json
{
  "status": "healthy",
  "system": "TRACE-X Criminal Network Analysis API",
  "version": "1.0.0",
  "environment": "development",
  "services": {
    "postgres": { "status": "healthy" },
    "neo4j": { "status": "healthy", "engine": "Neo4j 5.x + APOC" },
    "redis": { "status": "healthy", "mode": "standalone" }
  }
}
```

### Seed Neo4j Database
```bash
cypher-shell -a bolt://localhost:7687 -u neo4j -p tracex_graph_2026 -f neo4j/schema.cypher
cypher-shell -a bolt://localhost:7687 -u neo4j -p tracex_graph_2026 -f neo4j/seed.cypher
```
