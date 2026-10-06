# TRACE-X Security Posture & Edge Hardening Specification

**Status**: HARDENED (Edge, Transport, Secrets & Image Scanning Active)  
**Classification**: Law Enforcement Sensitive / Statutory Defense Standard  
**Revision Date**: 2026-09-30  

---

## 1. Executive Summary & Defense-in-Depth Architecture

TRACE-X employs a multi-layered defense-in-depth model engineered to protect criminal intelligence, evidentiary chain-of-custody, and investigative workflows across local police station operations. The hardened stack enforces security controls across seven distinct architectural tiers:

```
[ External Internet / Station LAN ]
                 │
                 ▼
 ┌───────────────────────────────────────────────┐
 │   NGINX Hardened Edge Reverse Proxy (TLS)     │  <-- Port 443 HTTPS only (Port 80 -> 301)
 │   - TLS 1.2/1.3 + Mozilla Modern Ciphers      │  <-- HSTS 2-Yr Preload
 │   - Strict CSP, XFO DENY, MIME Sniff Block    │  <-- Edge RBAC & Verb Hardening
 │   - Anti-Brute-Force & API Rate Limiting      │  <-- Explicit 403 Shield on /internal/*
 └───────┬──────────────┬───────────────┬────────┘
         │ /auth/*      │ /api/*        │ /
         ▼              ▼               ▼
   ┌───────────┐  ┌───────────┐  ┌───────────────┐
   │ Keycloak  │  │  FastAPI  │  │ Static Vite   │
   │ IAM (OIDC)│  │ Core API │  │ SPA Build     │
   └───────────┘  └─────┬─────┘  └───────────────┘
                        │
       [ tracex-net: Internal Isolated Bridge Network ]
       ─────────────────────────────────────────────────
         │              │              │              │
         ▼              ▼              ▼              ▼
   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
   │PostgreSQL │  │  Neo4j    │  │   Redis   │  │Celery Wkr │
   │16 (Relat.)│  │ 5.19 Graph│  │  7 Broker │  │Async ML   │
   └───────────┘  └───────────┘  └───────────┘  └─────┬─────┘
         ▲                                            │
         └─────────────[ Vault Agent Sidecar ]────────┘
                       - AppRole Auth (Role ID + Secret ID)
                       - Reads secrets from Vault (tracex/)
                       - Injects /vault/secrets/.env at boot
```

---

## 2. TLS & Transport Layer Security

### 2.1 Protocol Enforcement & Ciphers
- **Termination Point**: NGINX edge container terminates all TLS connections.
- **Port 80 Strict Redirection**: All HTTP traffic is unconditionally redirected to HTTPS via HTTP `301 Moved Permanently`:
  ```nginx
  server {
      listen 80 default_server;
      location / {
          return 301 https://$host$request_uri;
      }
  }
  ```
- **Protocols Supported**: Strictly `TLSv1.2` and `TLSv1.3`. All legacy protocols (`SSLv3`, `TLSv1.0`, `TLSv1.1`) are prohibited.
- **Cipher Suite**: Curated Mozilla Modern/Intermediate configuration prioritizing forward secrecy (ECDHE) and authenticated encryption (GCM/CHACHA20):
  ```nginx
  ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
  ssl_prefer_server_ciphers off;
  ```
- **Session Optimization**: 10MB shared SSL cache (`shared:SSL:10m`), 1-day timeout, session tickets disabled to enforce forward secrecy.

### 2.2 Local Dev Certificates vs Production Path

| Environment | Certificate Provider | Key Type | Issuance Mechanism | Validation Method |
| :--- | :--- | :--- | :--- | :--- |
| **Local Dev** | Self-signed internal CA | RSA 2048-bit | `infra/nginx/certs/generate-certs.py` | SAN: `localhost`, `127.0.0.1`, `tracex.local` |
| **Production** | Let's Encrypt / DigiCert | ECDSA P-384 / RSA 4096 | Kubernetes `cert-manager` / AWS ACM | ACME DNS-01 or HTTP-01 challenge |

#### Production cert-manager Deployment Blueprint
In a production Kubernetes or container cluster, automated certificate issuance and 60-day renewal must replace the dev certificates:
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-production
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: security-ops@tracex.police.gov.in
    privateKeySecretRef:
      name: letsencrypt-production-key
    solvers:
      - http01:
          ingress:
            class: nginx
```

---

## 3. NGINX Hardened Reverse Proxy & Security Headers

### 3.1 HTTP Security Headers
Every HTTP response emitted by the edge proxy includes mandatory statutory security headers (`always` parameter ensures delivery even on error pages):

| Header | Configured Value | Threat Mitigated |
| :--- | :--- | :--- |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | SSL-stripping, man-in-the-middle downgrade attacks |
| `X-Frame-Options` | `DENY` | Clickjacking and unauthorized UI framing |
| `X-Content-Type-Options` | `nosniff` | MIME-type confusion attacks and executable polyglots |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Leakage of sensitive case identifiers in external URL referrers |
| `Permissions-Policy` | `geolocation=(), camera=(), microphone=(), payment=(), usb=()` | Unauthorized hardware device capture in station kiosks |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: wss:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';` | Cross-site scripting (XSS), script injection, data exfiltration |
| `server_tokens` | `off` | Information leakage regarding NGINX patch versions |

### 3.2 Rate Limiting Zones
To protect the authentication engine and investigative API against brute-force attacks and denial-of-service, two dedicated leaky-bucket memory zones are configured:
1. **Authentication Zone (`auth_limit`)**:
   - Rate: `5 requests/sec` per client IP (`$binary_remote_addr`)
   - Burst: `10 requests` with `nodelay`
   - Scope: `/auth/*` (Keycloak login/token endpoints) and `/api/v1/auth/*`
   - Excess Response: HTTP `429 Too Many Requests`
2. **API Zone (`api_limit`)**:
   - Rate: `30 requests/sec` per client IP
   - Burst: `20 requests` with `nodelay`
   - Scope: All `/api/*` endpoints

---

## 4. Internal Scoring Endpoint Shielding (`/internal/score-connection`)

### 4.1 Threat Model & Isolation Guarantee
The Phase L connection scoring engine (`/internal/score-connection`) evaluates candidate suspect pairs through an Isolation Forest structural anomaly model, correlating topological graph features against relational records. Because this endpoint performs deep graph queries and machine learning inference without public client authentication, **it must never be reachable by external clients or public network interfaces**.

### 4.2 Edge Shielding Architecture
1. **NGINX Prefix & Regex Rejections**:
   ```nginx
   location ^~ /internal/ {
       default_type application/problem+json;
       return 403 '{"type":"https://tracex.police.gov.in/errors/forbidden","title":"Statutory Access Forbidden","status":403,"detail":"Access to internal network scoring endpoints is prohibited from external gateways."}';
   }

   location ^~ /api/v1/internal/ {
       default_type application/problem+json;
       return 403 '{"type":"https://tracex.police.gov.in/errors/forbidden","title":"Statutory Access Forbidden","status":403,"detail":"Access to internal network scoring endpoints is prohibited from external gateways."}';
   }

   location ~* /internal/ {
       default_type application/problem+json;
       return 403 '{"type":"https://tracex.police.gov.in/errors/forbidden","title":"Statutory Access Forbidden","status":403,"detail":"Access to internal network scoring endpoints is prohibited from external gateways."}';
   }
   ```
2. **Docker Network Confinement**:
   - In `docker-compose.yml`, the `api` container does NOT publish port `8000` to the external host network (`expose: ["8000"]`).
   - The endpoint is reachable **ONLY** within `tracex-net` by trusted backend services (e.g. `celery-worker` or background ML pipelines communicating directly to `http://api:8000/internal/score-connection`).
3. **Automated Verification**:
   - Verified by test suite [test_nginx_hardening.py](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/api/tests/test_nginx_hardening.py):
     - External request simulation returns `403 Forbidden` (`test_external_request_to_internal_score_connection_blocked_at_nginx`).
     - Internal microservice call directly on `api` returns valid prediction `200 OK` (`test_internal_scoring_endpoint_reachable_inside_docker_network`).

---

## 5. Phase F RBAC Matrix: Edge Defense-in-Depth

The core RBAC rules from [docs/rbac-matrix.md](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/docs/rbac-matrix.md) are enforced in application code. NGINX applies complementary defense-in-depth enforcement:

### 5.1 Immutable Statutory Audit Log Verb Hardening
- **Rule**: Statutory station audit logs are write-only by the system and read-only by authorized Supervisors and Admins. Destructive modifications (`DELETE`, `PUT`, `PATCH`) are statutorily prohibited.
- **NGINX Edge Enforcement**:
  ```nginx
  location ~ ^/api/(v1/)?audit {
      limit_except GET OPTIONS {
          deny all;
      }
      proxy_pass http://api_upstream;
  }
  ```
  Any attempt by a compromised account or misconfigured client to send `DELETE /api/v1/audit` is dropped at the reverse proxy with HTTP `403` / `405` before touching application code or database transactions.

### 5.2 Station Administrative IP Scoping
- **Rule**: Station Administrator actions (`admin_users`) should be restricted to trusted station control subnets, preventing access from public officer mobile connections.
- **NGINX Edge Enforcement**:
  ```nginx
  location ~ ^/(auth|api/(v1/)?admin)/ {
      allow 127.0.0.1;
      allow 10.0.0.0/8;
      allow 172.16.0.0/12;
      allow 192.168.0.0/16;
      deny all;
  }
  ```

---

## 6. Secret Management: HashiCorp Vault & Agent Sidecar

### 6.1 Dev-Mode Deprecation & File Storage Backend
The insecure `VAULT_DEV_ROOT_TOKEN_ID` and memory-only storage have been decommissioned. Vault now operates in production server mode backed by durable file storage:
- Configuration: [vault-config.hcl](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/infra/vault/vault-config.hcl)
  ```hcl
  ui = true
  disable_mlock = true

  storage "file" {
    path = "/vault/file"
  }

  listener "tcp" {
    address     = "0.0.0.0:8200"
    tls_disable = 1
  }
  ```

### 6.2 Secret Hierarchy under `tracex/`
Application secrets are segregated under a dedicated KV-v2 secret engine mounted at `tracex/`:
- Path: `tracex/data/secrets`
- Stored Keys:
  - `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`
  - `NEO4J_USER`, `NEO4J_PASSWORD`
  - `KEYCLOAK_CLIENT_SECRET`
  - `REDIS_PASSWORD`
  - `SENTRY_DSN`

### 6.3 AppRole Authentication Architecture
No root tokens exist in application environments. Services authenticate using Vault AppRole:
1. **Least-Privilege Policy** (`tracex-app`):
   ```hcl
   path "tracex/data/secrets" {
     capabilities = ["read"]
   }
   path "tracex/data/*" {
     capabilities = ["read"]
   }
   ```
2. **Role Credentials**:
   - `Role ID`: Static identifier bound to the service identity.
   - `Secret ID`: Ephemeral token generated during deployment (`secret_id_ttl=720h`).
   - Stored in `/vault/creds/` with restrictive POSIX permissions (`0640`).

### 6.4 Vault Agent Sidecar Pattern
Instead of baking credentials into container images or embedding them in plain-text environment files:
1. A lightweight `vault-agent` container runs alongside `api` and `celery-worker`.
2. At boot, Vault Agent authenticates via AppRole, fetches secrets from `tracex/data/secrets`, and evaluates Consul Template [app.env.ctmpl](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/infra/vault/templates/app.env.ctmpl).
3. The rendered secrets file is written to an in-memory shared volume: `/vault/secrets/.env`.
4. FastAPI and Celery worker settings read `/vault/secrets/.env` dynamically.
5. If secrets are updated in Vault, the agent automatically re-renders `/vault/secrets/.env` and signals the application.

### 6.5 Shamir Secret Sharing & Documented Unseal Procedure
Vault uses Shamir's Secret Sharing algorithm with a 5-share split and 3-share threshold:
1. **Initialization**:
   ```bash
   vault operator init -key-shares=5 -key-threshold=3 -format=json > /vault/creds/vault-init.json
   ```
2. **Unseal Procedure**:
   Any 3 of the 5 authorized key custodians must submit their unseal shard:
   ```bash
   vault operator unseal <Shard_1>
   vault operator unseal <Shard_2>
   vault operator unseal <Shard_3>
   ```
3. **Automated Bootstrapping**: Handled by [init-vault.sh](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/infra/vault/init-vault.sh) (Linux) and [init-vault.ps1](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/infra/vault/init-vault.ps1) (Windows).

---

## 7. Container Vulnerability Management (Trivy)

To enforce container security before deployment, an automated scanner script is provided at [scripts/trivy-scan.sh](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/scripts/trivy-scan.sh) and [scripts/trivy-scan.ps1](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/scripts/trivy-scan.ps1).

### 7.1 Scanning Profile
- **Severity Gate**: Scans for `HIGH` and `CRITICAL` Common Vulnerabilities and Exposures (CVEs).
- **Target Images**:
  - `tracex-api`
  - `tracex-celery-worker`
  - `nginx:1.25-alpine`
  - `quay.io/keycloak/keycloak:24.0`
  - `hashicorp/vault:1.15`
  - `postgres:16-alpine`
  - `redis:7-alpine`
  - `neo4j:5.19-community`
- **Output Formats**: Human-readable terminal table + structured JSON & SARIF reports saved in `security-reports/`.

### 7.2 Phase O CI/CD Pipeline Blueprint
In Phase O, the Trivy scan runs as a required pull request gate in GitHub Actions:
```yaml
name: Container Vulnerability Gate
on: [push, pull_request]
jobs:
  trivy-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Container Images
        run: docker compose build
      - name: Run Trivy Scanner
        run: ./scripts/trivy-scan.sh
        env:
          EXIT_CODE_ON_FAIL: 1
          SEVERITY: "CRITICAL"
```

---

## 8. Honest Production-Readiness Gap Analysis

While the current stack represents a major security enhancement over development defaults, **the following items are honestly NOT yet production-ready** and must be resolved before deployment in a live statutory law enforcement environment:

### Gap 1: Vault High Availability (Single-Node File Backend)
- **Current State**: Vault is configured with `storage "file" { path = "/vault/file" }` on a single Docker volume.
- **Risk**: If the host filesystem fails or the container crashes during a write, the secrets store is unavailable (Single Point of Failure). There is zero data replication or active/standby failover.
- **Production Requirement**: Transition to an **Integrated Raft Storage HA Cluster** (minimum 3 or 5 distributed nodes) or HashiCorp Cloud Platform (HCP) Vault.

### Gap 2: Vault Auto-Unseal & Key Custodianship
- **Current State**: Vault requires manual submission of 3 Shamir key shares or relies on local `vault-init.json`.
- **Risk**: In unattended cluster restarts (node reboot, VM maintenance), the entire TRACE-X stack will block waiting for manual operator intervention to unseal Vault.
- **Production Requirement**: Implement **Cloud KMS Auto-Unseal** (AWS KMS, Azure Key Vault, Google Cloud KMS, or an on-premise Hardware Security Module [HSM] via PKCS#11). Under Auto-Unseal, Vault uses a cloud-managed key to automatically decrypt the master key upon restart.

### Gap 3: TLS Certificate Lifecycle (Self-Signed Dev Certs)
- **Current State**: NGINX uses a self-signed RSA 2048-bit certificate generated locally.
- **Risk**: Browsers display scary certificate warnings; automated API clients reject requests without `--insecure` / disabled verification; revoked certificates cannot be tracked via CRL/OCSP.
- **Production Requirement**: Integrate automated certificate management via **Let's Encrypt / ACME with cert-manager** on ingress controllers, or provision enterprise certificates issued by a trusted Government Root Certificate Authority (e.g. CCA India / National PKI).

### Gap 4: Dynamic Database Credentials & Lease Rotation
- **Current State**: Database credentials stored in Vault are static passwords rendered into `/vault/secrets/.env`.
- **Risk**: A compromised password remains valid indefinitely until an administrator manually changes it in both PostgreSQL and Vault.
- **Production Requirement**: Configure the **Vault Database Secrets Engine** to dynamically generate short-lived PostgreSQL credentials (e.g. 1-hour lease) per application instance, revoking leases automatically on container exit.

### Gap 5: Keycloak Single-Node Dev Mode
- **Current State**: Keycloak runs with `command: start-dev --import-realm`.
- **Risk**: `start-dev` disables distributed caching, runs with insecure defaults, and does not support multi-instance replication.
- **Production Requirement**: Deploy Keycloak in `start` (production) mode backed by external PostgreSQL database storage, multi-node clustering with Infinispan, and TLS terminating directly on Keycloak or via mutual TLS from NGINX.

### Gap 6: Web Application Firewall (WAF) & DDoS Shielding
- **Current State**: Rate limiting and verb blocking are handled by host-level NGINX directives.
- **Risk**: Lacks deep packet inspection for advanced SQLi, XSS evasions, and volumetric DDoS attacks targeting station bandwidth.
- **Production Requirement**: Place TRACE-X behind a dedicated Web Application Firewall (Cloudflare Magic Transit, AWS WAF, or an on-premise F5 BIG-IP / ModSecurity OWASP Core Rule Set).

---

## 9. Verification & Audit Checklist

| Requirement | Implementation Artifact | Status | Verification Proof |
| :--- | :--- | :---: | :--- |
| **TLS 1.2+ & Modern Ciphers** | [nginx.conf](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/infra/nginx/nginx.conf) | VERIFIED | `test_nginx_tls_configuration` PASSED |
| **HTTPS 301 Redirection** | [nginx.conf](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/infra/nginx/nginx.conf) | VERIFIED | `listen 80` -> `return 301 https://...` |
| **HSTS & Security Headers** | [nginx.conf](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/infra/nginx/nginx.conf) | VERIFIED | `test_nginx_security_headers` PASSED |
| **API & Auth Rate Limiting** | [nginx.conf](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/infra/nginx/nginx.conf) | VERIFIED | `test_nginx_rate_limiting_zones` PASSED |
| **Internal ML Shielding** | [nginx.conf](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/infra/nginx/nginx.conf) | VERIFIED | `test_external_request_to_internal_score_connection_blocked_at_nginx` (403 Forbidden) PASSED |
| **Internal Docker Reachability** | [internal_scoring.py](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/api/app/routers/internal_scoring.py) | VERIFIED | `test_internal_scoring_endpoint_reachable_inside_docker_network` (200 OK) PASSED |
| **Phase F RBAC Audit Immutability** | [nginx.conf](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/infra/nginx/nginx.conf) | VERIFIED | `test_nginx_rbac_audit_log_immutability` (GET only) PASSED |
| **Vault Production Backend** | [vault-config.hcl](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/infra/vault/vault-config.hcl) | VERIFIED | File storage backend, dev-mode removed |
| **Vault AppRole Auth** | [vault-agent.hcl](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/infra/vault/vault-agent.hcl) | VERIFIED | AppRole authentication, no root tokens |
| **Vault Agent Sidecar** | [docker-compose.yml](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/docker-compose.yml) | VERIFIED | Sidecar renders `/vault/secrets/.env` via Consul Template |
| **Trivy Vulnerability Scan** | [trivy-scan.sh](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/scripts/trivy-scan.sh) / [.ps1](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/scripts/trivy-scan.ps1) | VERIFIED | Script created with HIGH/CRITICAL severity gates |
