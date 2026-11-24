# TRACE-X Role-Based Access Control (RBAC) & Authority-Tier Scoping Matrix

This document defines the RBAC and data scoping model for the TRACE-X platform, specifically scoped to the Local Authority interface.

---

## 1. Core Principles

1. **Role × Action Matrix**: Permissions are tied to functional law enforcement roles (`investigator`, `supervisor`, `admin`).
2. **Authority-Tier Scoping**: A Local Authority investigator or supervisor only has access to cases, evidence, and requests where `entity.authority_id` matches their authenticated authority.
3. **Never Trust Client Authority**: The client is never permitted to specify or override `authority_id`. Scoping is strictly extracted from verified Keycloak JWT claims (`authority_id`, `authority_tier`) and applied server-side.
4. **Fail-Closed Security**: Any action lacking required permissions or targeting out-of-jurisdiction records results in RFC 7807 `403 Forbidden` (`application/problem+json`).
5. **Statutory Audit Integrity**: Every state change and sensitive read is captured immutably within the same database transaction.

---

## 2. Role × Action Permissions Matrix

| Permission Code | Description | Investigator | Supervisor | Admin | Scoping Rule |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `view_case` | Read case dossier, entities, graph networks, and missing links | **ALLOWED** | **ALLOWED** | **ALLOWED** | **Own Authority Only** (`case.authority_id == user.authority_id`) |
| `edit_case` | Create or update case details, status, priority, and attention notes | **ALLOWED** | **ALLOWED** | **DENIED** | **Own Authority Only** |
| `approve_data_request` | Approve or reject incoming inter-agency requisitions | **DENIED** | **ALLOWED** | **DENIED** | **Target Authority Only** |
| `share_records` | Sign and transmit selective record packages across agency boundaries | **DENIED** | **ALLOWED** | **DENIED** | **Local Authority Records Only** |
| `view_audit_log` | Inspect immutable statutory station audit trail | **DENIED** | **ALLOWED** | **ALLOWED** | **Own Authority Logs Only** |
| `admin_users` | Manage station personnel, badge clearances, and system parameters | **DENIED** | **DENIED** | **ALLOWED** | **Station Administrator Only** |

---

## 3. Authority-Tier Scoping Architecture

### Jurisdiction Boundary Rules
- **Local Authority Tier (`LOCAL`)**:
  - Bound to a specific Police Station or Division (e.g. `AUTH-DELHI-NORTH`).
  - May read and write cases assigned to their own `authority_id`.
  - Attempts to access cases belonging to another authority (`AUTH-MUMBAI-SOUTH`) raise `403 Forbidden` with detail `"Cross-jurisdiction access prohibited: Case belongs to external authority"`.
- **State Authority Tier (`STATE`)**:
  - Hierarchical umbrella across all local divisions within the state.
- **Central Authority Tier (`CENTRAL`)**:
  - National jurisdiction across inter-state crime syndicates.

### Query Scoping Implementation (`scope_to_authority`)
Repository queries automatically apply authority filters:
```python
def scope_to_authority(query: Query, model_class, current_user: CurrentUser) -> Query:
    """Enforce strict jurisdictional boundary based on verified JWT claims."""
    if current_user.authority_tier == "LOCAL":
        if hasattr(model_class, "authority_id"):
            return query.filter(model_class.authority_id == current_user.authority_id)
    return query
```

---

## 4. RFC 7807 Error Responses

When an investigator attempts an action outside their role or jurisdiction:

### Missing Permission (e.g. Investigator attempting to approve incoming request)
```json
{
  "type": "https://tracex.police.gov.in/errors/forbidden",
  "title": "Statutory Access Forbidden",
  "status": 403,
  "detail": "Action requires 'approve_data_request' permission. Role 'investigator' is not authorized.",
  "instance": "/api/v1/incoming-requests/REQ-IN-2026-019/approve"
}
```

### Cross-Jurisdiction Violation (e.g. Accessing external authority case)
```json
{
  "type": "https://tracex.police.gov.in/errors/jurisdiction-forbidden",
  "title": "Statutory Access Forbidden",
  "status": 403,
  "detail": "Cross-jurisdiction access violation: Case 'CASE-2026-9999' belongs to external authority 'AUTH-MUMBAI-SOUTH'. Local Authority officer 'AUTH-DELHI-NORTH' cannot view.",
  "instance": "/api/v1/cases/CASE-2026-9999"
}
```
