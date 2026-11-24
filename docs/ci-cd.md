# TRACE-X CI/CD Pipeline & Branch Protection Specification

**Status**: ACTIVE & ENFORCED (GitHub Actions Workflows Active)  
**Classification**: Law Enforcement Sensitive / Statutory Operational Standards  
**Target Environment**: GitHub Enterprise / Public / Hybrid Police Deployment  
**Revision Date**: 2026-09-30  

---

## 1. Overview & Pipeline Architecture

TRACE-X enforces strict automated gates before any code merges into the production baseline (`main` branch) or deploys to local police station nodes. The pipeline consists of two primary workflows:

1. **Continuous Integration (`.github/workflows/ci.yml`)**:
   - Executes automatically on every Pull Request targeting `main` and on pushes to `main`.
   - Runs backend static analysis, type checking, ephemeral database integration tests, coverage reporting, and the mandatory **ML Leakage Safety Guard**.
   - Runs frontend linting, TypeScript checking, Vitest unit tests, and full Vite production bundling (including source-map generation).
   - Enforces container security scanning (Trivy critical CVE threshold) and repository secret scanning (Gitleaks).

2. **Continuous Delivery (`.github/workflows/cd.yml`)**:
   - Executes upon merge to `main` or upon semantic release tags (`v*.*.*`).
   - Builds and publishes multi-component container images to GitHub Container Registry (GHCR).
   - Executes database schema migrations through a controlled, environment-protected step.
   - Deploys the updated stack to target hosts (parameterized via GitHub Actions secrets).
   - Registers a Sentry release and associates commits and source maps for end-to-end crash diagnostics.

---

## 2. GitHub Actions Workflows

### 2.1 Continuous Integration (`ci.yml`)

The CI workflow runs across three parallel jobs:

```
                  ┌────────────────────────────────────────┐
                  │              Pull Request              │
                  └───────┬──────────────┬──────────┬──────┘
                          │              │          │
         ┌────────────────┘              │          └────────────────┐
         ▼                               ▼                           ▼
┌──────────────────┐           ┌──────────────────┐        ┌──────────────────┐
│   Backend CI     │           │   Frontend CI    │        │  Security Scan   │
│ - Ruff Lint      │           │ - Oxlint / ESLint│        │ - Gitleaks       │
│ - Mypy Types     │           │ - tsc --noEmit   │        │ - Trivy CVE Scan │
│ - Ephemeral DBs  │           │ - Vitest Tests   │        │   (Critical exit)│
│ - ML Guard       │           │ - Vite Build     │        └──────────────────┘
│ - Pytest Cov     │           └──────────────────┘
└──────────────────┘
```

#### Ephemeral Service Containers
Backend integration tests spin up isolated service containers:
- **PostgreSQL 16**: Port 5432, verifies relational schemas, audit logs, and UUID extensions.
- **Neo4j 5.19-Community**: Ports 7474/7687, verifies graph Cypher operations and APOC procedures.
- **Redis 7-Alpine**: Port 6379, verifies Celery queue operations and cache invalidations.

#### Required ML Serving Checks
The test suite explicitly enforces that the following 4 core ML serving integration tests **must pass as non-optional gates**:
1. `test_corroborated_connection_reaches_strong`: Verifies high graph centrality + shared vehicle reaches `Strong` evidence level.
2. `test_uncorroborated_connection_caps_at_moderate`: Confirms pure anomaly score without corroborating facts is capped strictly at `Moderate`.
3. `test_missing_links_endpoint_reads_ml_predictions_sorted`: Asserts `/api/v1/cases/{id}/missing-links` returns real predictions ordered by strength (`Strong` -> `Moderate` -> `Limited`) without raw float leakage.
4. `test_score_missing_links_eager`: Validates eager Celery task execution, candidate resolution, and metric emission.

---

## 3. Production-Model Regression Guard

### 3.1 Motivation & Phase L Leakage Safety Guarantee
During Phase L model evaluation, supervised algorithms (`RandomForestClassifier`, `HistGradientBoostingClassifier`) and full feature sets (`Tier B`, `Tier C`) exhibited severe data leakage due to target-correlated features (e.g. interagency disclosures, court warrant dates, charge-sheet filings) and false-positive inflation on sparse graphs.

The production decision was locked strictly to **unsupervised Isolation Forest on 12 Tier A topological and spatial features**.

### 3.2 Automated CI Guard Implementation
To prevent future developers from silently reintroducing leaked models or supervised classifiers, CI executes [test_model_leakage_guard.py](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/api/tests/test_model_leakage_guard.py):

```python
# test_model_leakage_guard.py
PROHIBITED_MODEL_PATTERNS = [
    r"rf_tier_a\.joblib",
    r"hgb_tier_a\.joblib",
    r"random_forest",
    r"hist_gradient_boosting",
    r"tier_b",
    r"tier_c",
    r"full_features",
    r"ground_truth_label",
    r"calibrated_classifier",
]

ALLOWED_MODEL_FILES = {
    "isolation_forest.joblib",
    "preprocessor_tier_a.joblib",
}
```

**Guard Enforcement**:
- Inspects `load_production_models` in [model_service.py](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/ml/serving/model_service.py).
- Fails the build immediately if `rf_tier_a.joblib`, `hgb_tier_a.joblib`, or any prohibited pattern appears in the serving loader or its dependency tree.
- Confirms `tier_a_builder.py` only extracts the 12 approved Tier A structural features.

---

## 4. Continuous Delivery (`cd.yml`)

### 4.1 Artifact Matrix
The CD workflow builds three production container images and publishes them to GHCR:

| Image Name | Dockerfile | Tags | Target Purpose |
| :--- | :--- | :--- | :--- |
| `ghcr.io/<org>/api` | [Dockerfile](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/api/Dockerfile) | `latest`, `sha-<commit>`, `<semver>` | FastAPI Core Application Server |
| `ghcr.io/<org>/celery-worker` | [Dockerfile.celery](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/api/Dockerfile.celery) | `latest`, `sha-<commit>`, `<semver>` | Background Task & ML Inference Worker |
| `ghcr.io/<org>/frontend` | [Dockerfile.frontend](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/Dockerfile.frontend) | `latest`, `sha-<commit>`, `<semver>` | Hardened NGINX Edge + Static React SPA |

### 4.2 Database Migrations (Controlled Step)
Migrations are run via Alembic (`cd trace-x-backend/migrations && alembic upgrade head`).
- Configured as an independent pipeline stage with GitHub Environment protection (`production`).
- If database credentials are missing in a mock/test deployment, the step generates an offline SQL plan (`alembic upgrade head --sql`) to validate schema integrity without crashing.

### 4.3 Deployment Target Assumptions
The deployment step is parameterizable:
- **Default Assumption**: Target police station server running Docker Compose over SSH.
- Secrets required:
  - `DEPLOY_HOST`: Target server IP or FQDN.
  - `DEPLOY_USER`: Deployment service user with docker access.
  - `SSH_PRIVATE_KEY`: Encrypted private key for deployment authentication.
- **Alternative Target**: Kubernetes cluster via Helm or GitOps (e.g. ArgoCD). The workflow sets output variable `IMAGE_TAG` which can be consumed by a GitOps repo update commit.

### 4.4 Sentry Release Integration
The release step associates the deployed Git commit SHA with Sentry, uploads frontend source maps from `./dist`, and tags errors with the active release version (`tracex@<short-sha>`).

---

## 5. Branch Protection Policy

To guarantee system stability, legal compliance, and evidentiary integrity, the `main` branch is protected with the following required settings in GitHub:

```
Branch name pattern: main

[x] Require a pull request before merging
    [x] Require approvals: 1 (minimum)
    [x] Dismiss stale pull request approvals when new commits are pushed
    [x] Require review from Code Owners (Lead Architect & Statutory Officer)

[x] Require status checks to pass before merging
    [x] Require branches to be up to date before merging
    Status checks that are required:
      - Backend CI (Lint, TypeCheck, ML Leakage Guard, Pytest)
      - Frontend CI (Lint, TypeCheck, Vitest, Vite Build)
      - Security Scans (Trivy CVEs & Gitleaks Secrets)

[x] Require signed commits
[x] Require linear history
[x] Do not allow bypassing the above settings (applies to administrators)
```

> [!IMPORTANT]
> **Production Model Regression Guard is Mandatory**: Any PR that references supervised models or full-feature sets in `ml/serving/` will fail the `Backend CI` status check and cannot be merged, even by administrators.

---

## 6. GitHub Actions Secrets Specification

All credentials and sensitive configuration items must reside in **GitHub Repository Secrets** or **Environment Secrets**. Zero secrets are permitted in repository code or `.env` files.

| Secret Name | Purpose | Required In |
| :--- | :--- | :--- |
| `GITHUB_TOKEN` | Built-in token for checking out code and pushing container images to GHCR. | CI & CD |
| `PROD_DB_HOST` | Hostname of production PostgreSQL database. | CD (Alembic) |
| `PROD_DB_PORT` | Port of production PostgreSQL database (default `5432`). | CD (Alembic) |
| `PROD_DB_USER` | Production database administrative user. | CD (Alembic) |
| `PROD_DB_PASSWORD` | Production database password. | CD (Alembic) |
| `PROD_DB_NAME` | Database name (default `tracex_db`). | CD (Alembic) |
| `DEPLOY_HOST` | Target deployment server IP or hostname. | CD (Deploy) |
| `DEPLOY_USER` | Remote SSH deployment username. | CD (Deploy) |
| `SSH_PRIVATE_KEY` | SSH private key for remote host access. | CD (Deploy) |
| `SENTRY_AUTH_TOKEN` | API token with release management permissions for Sentry. | CD (Sentry) |
| `SENTRY_ORG` | Organization slug in Sentry. | CD (Sentry) |
| `SENTRY_PROJECT` | Project identifier in Sentry. | CD (Sentry) |
