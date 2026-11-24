# TRACE-X Authentication Architecture & Flow Specification

This document details the complete end-to-end authentication flow, Keycloak OIDC configuration, WebAuthn MFA registration, and token management architecture for the TRACE-X platform.

---

## 1. High-Level Flow Sequence

The entry flow connects the public landing page to the secure investigative workspace (`AppShell`) at `/dashboard`:

1. **Landing Page (`/`)**: Investigator clicks the **TraceX** wordmark at the top of the landing page, routing to `/login`.
2. **Authority Selection (`/login`)**: Displays three authority tier cards:
   - **Login as Local**: Connected to Keycloak OIDC authorization flow.
   - **Login as State**: Routes to `/login/state` (placeholder page - not available in current build).
   - **Login as Central**: Routes to `/login/central` (placeholder page - not available in current build).
3. **PKCE Generation & Redirect**: Clicking "Login as Local" generates a cryptographic code verifier and challenge (RFC 7636, SHA-256) and redirects to Keycloak's authorization endpoint.
4. **Keycloak Authentication & WebAuthn**: Keycloak authenticates credentials. On first login, Keycloak enforces the `webauthn-register` required action to pair a hardware security key (FIDO2 / YubiKey / Windows Hello).
5. **Authorization Callback (`/auth/callback`)**: Keycloak redirects back to frontend with authorization code and state.
6. **Backend Token Exchange (`POST /api/v1/auth/token`)**:
   - Exchanges code and verifier.
   - Returns short-lived access token in JSON body (kept in React memory only).
   - Issues long-lived refresh token in `httpOnly`, `Secure`, `SameSite=Lax` cookie.
7. **WebAuthn First-Time Enrollment Screen (`/webauthn-enroll`)**: Shown once on first login before proceeding to workspace.
8. **Secure Workspace (`/dashboard`)**: Officer lands in the AppShell. Every subsequent API call includes `Authorization: Bearer <access_token>`.

---

## 2. Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Officer as Officer (Investigator)
    participant Browser as Browser / React SPA
    participant Keycloak as Keycloak OIDC (Port 8080)
    participant Backend as FastAPI Backend (Port 8000)

    Note over Officer, Browser: Step 1: Entry Flow & Authority Selection
    Officer->>Browser: Click "TraceX" wordmark on Landing Page (/)
    Browser-->>Officer: Render Authority Selection Page (/login)
    Officer->>Browser: Click "Login as Local" Card
    Note over Browser: Generate PKCE code_verifier & code_challenge (S256)
    Browser->>Keycloak: GET /realms/tracex/protocol/openid-connect/auth<br/>?client_id=tracex-frontend&response_type=code<br/>&scope=openid profile email roles<br/>&code_challenge=...&code_challenge_method=S256<br/>&role_hint=local-authority

    Note over Keycloak, Officer: Step 2: Keycloak Password & Security Key
    Keycloak-->>Officer: Present Keycloak Login Form
    Officer->>Keycloak: Submit username + password
    opt First Login (Required Action)
        Keycloak-->>Officer: Prompt WebAuthn / Security Key Registration
        Officer->>Keycloak: Register FIDO2 Key / Windows Hello Biometric
    end
    Keycloak-->>Browser: 302 Redirect to /auth/callback?code=AUTH_CODE&state=STATE

    Note over Browser, Backend: Step 3: Secure Token Exchange
    Browser->>Backend: POST /api/v1/auth/token<br/>{ code, code_verifier, redirect_uri }
    Backend->>Keycloak: POST /realms/tracex/protocol/openid-connect/token (Backchannel)
    Keycloak-->>Backend: { access_token, refresh_token, id_token, expires_in }
    Backend-->>Browser: 200 OK<br/>Body: { access_token, token_type, expires_in, user }<br/>Set-Cookie: tracex_refresh_token=...; HttpOnly; SameSite=Lax; Path=/api/v1/auth

    Note over Browser: Store access_token in React Memory State ONLY<br/>(Never in localStorage / sessionStorage)

    alt First Login WebAuthn Verification
        Browser-->>Officer: Navigate to /webauthn-enroll
        Officer->>Browser: Touch Security Key / Confirm Biometrics
        Browser-->>Officer: Navigate to /dashboard
    else Returning Officer
        Browser-->>Officer: Navigate directly to /dashboard
    end

    Note over Browser, Backend: Step 4: Protected API Access & Silent Refresh
    Browser->>Backend: GET /api/v1/dashboard/summary<br/>Authorization: Bearer <access_token>
    Backend->>Backend: Validate RS256 signature against Keycloak JWKS<br/>Verify issuer, audience, sub, authority_tier
    Backend-->>Browser: 200 OK (Protected JSON Payload)

    opt Token Expiry / Browser Reload
        Browser->>Backend: POST /api/v1/auth/refresh (Cookie sent automatically)
        Backend->>Keycloak: Exchange refresh_token for new access_token
        Backend-->>Browser: 200 OK { access_token, user }
    end
```

---

## 3. Keycloak Realm Configuration Details

Configuration file: [`infra/keycloak/realm-export.json`](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/infra/keycloak/realm-export.json)

### Realm Parameters
- **Realm Name**: `tracex`
- **Display Name**: `TRACE-X Law Enforcement Intelligence System`
- **Supported Login**: Username/password, FIDO2/WebAuthn hardware tokens.

### Client Configuration (`tracex-frontend`)
- **Client ID**: `tracex-frontend`
- **Public Client**: `publicClient: true` (no client secret exposed in browser).
- **PKCE Enforced**: `pkce.code.challenge.method: S256`.
- **Standard Flow**: Authorization Code Flow (`standardFlowEnabled: true`, `implicitFlowEnabled: false`, `directAccessGrantsEnabled: false`).
- **Redirect URIs**:
  - `http://localhost:5173/*` (Frontend Vite Dev Server)
  - `http://127.0.0.1:5173/*`
  - `https://tracex.police.gov.in/*` (Production Gateway)
- **Web Origins**: `+` (Permitted CORS for redirect URIs).

### Client Roles
- `local-authority`: Local police station / division investigative level.
- `state-authority`: State police headquarters / CID / STF tier.
- `central-authority`: National investigative agencies (CBI / NIA / IB).
- `investigator`: Case officer with evidence analysis & dossier authoring permissions.
- `supervisor`: Senior officer with inter-jurisdictional request sign-off rights.
- `admin`: System administrator & audit log clearance.

### Custom JWT Protocol Mappers
Keycloak maps police officer profile claims directly into both ID and Access tokens:
| Claim Name | Token Path | Description | Example Value |
| :--- | :--- | :--- | :--- |
| `authority_id` | `authority_id` | Unique Authority identifier | `AUTH-DELHI-NORTH` |
| `authority_tier` | `authority_tier` | Authority jurisdictional hierarchy | `LOCAL` |
| `badge_number` | `badgeNumber` | Law enforcement badge / service number | `DL-7482` |
| `station` | `station` | Assigned police station or unit | `Civil Lines Police Station, North Division` |
| `realm_access.roles` | `roles` | Assigned officer roles | `["local-authority", "investigator"]` |

### Multi-Factor Authentication (WebAuthn)
- Configured required action: `webauthn-register`.
- Enforces FIDO2 / U2F compatible security keys (YubiKey, Nitrokey, or platform authenticators such as Windows Hello / Touch ID).
- Triggered automatically on first login before granting token issuance.

---

## 4. Frontend Security & Guard Architecture

### Storage Policy: No Storage of Access Tokens
- **Access Token**: Stored purely in React memory state within [`AuthContext.tsx`](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/src/app/AuthContext.tsx). Never persisted to `localStorage`, `sessionStorage`, or un-keyed cookies.
- **Refresh Token**: Handled exclusively by the backend via `httpOnly`, `SameSite=Lax`, `Path=/api/v1/auth` cookie named `tracex_refresh_token`. Completely inaccessible to client-side JavaScript, eliminating XSS token theft vectors.
- **Silent Bootstrapping**: On page reload or fresh tab opening, `AuthContext` makes a silent `POST /api/v1/auth/refresh` with `credentials: "include"`. If the cookie is present and valid, the user session resumes without requiring re-login.

### Route Protection
Implemented in [`AppShell.tsx`](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/src/app/AppShell.tsx):
- Every route under `/dashboard`, `/cases/*`, `/requests/*`, `/alerts/*`, `/audit/*`, and `/settings/*` is guarded.
- If `!user && !isLoading`, the officer is immediately redirected to the Landing Page (`/`).

---

## 5. Backend JWT Dependency & Error Handling

### Dependency: `get_current_user`
Implemented in [`trace-x-backend/api/app/core/auth.py`](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/trace-x-backend/api/app/core/auth.py):
- Extracts `Authorization: Bearer <token>` from incoming HTTP request.
- Validates token against Keycloak's public JSON Web Key Set (`/realms/tracex/protocol/openid-connect/certs`).
- Verifies:
  - Token signature (`RS256`).
  - Expiration timestamp (`exp`).
  - Issuer (`iss == http://localhost:8080/realms/tracex`).
  - Audience (`aud == tracex-frontend` or client account).
- Extracts and constructs `CurrentUser` model:
  ```python
  class CurrentUser(BaseModel):
      id: str
      username: str
      email: Optional[str]
      roles: List[str]
      authority_id: str
      authority_tier: str
      badge_number: Optional[str]
      station: Optional[str]
  ```

### RFC 7807 Problem Details
Missing, expired, or forged tokens raise standard `ProblemException`:
```json
{
  "type": "https://tracex.police.gov.in/errors/unauthorized",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Missing Bearer token in Authorization header",
  "instance": "/api/v1/dashboard/summary"
}
```
All Phase D API routers (`/cases`, `/persons`, `/network`, `/missing-links`, `/requests`, `/incoming-requests`, `/received-data`, `/investigation-views`, `/documents`, `/audit`, `/dashboard`) enforce this dependency globally.
