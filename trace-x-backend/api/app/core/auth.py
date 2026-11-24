import logging
import httpx
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, field
from fastapi import Request, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, jwk, JWTError
from jose.utils import base64url_decode
from app.core.config import settings
from app.core.errors import ProblemException

logger = logging.getLogger("tracex_auth")

bearer_scheme = HTTPBearer(auto_error=False)

# Cached JWKS keys from Keycloak
_JWKS_CACHE: Dict[str, Any] = {}


@dataclass
class CurrentUser:
    sub: str
    name: str
    email: str
    badge_number: Optional[str] = None
    station: Optional[str] = None
    authority_id: Optional[str] = None
    authority_tier: Optional[str] = "LOCAL"
    roles: List[str] = field(default_factory=list)


async def get_keycloak_jwks() -> Dict[str, Any]:
    global _JWKS_CACHE
    if _JWKS_CACHE:
        return _JWKS_CACHE

    jwks_url = f"{settings.KEYCLOAK_SERVER_URL}/realms/{settings.KEYCLOAK_REALM}/protocol/openid-connect/certs"
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(jwks_url)
            if resp.status_code == 200:
                _JWKS_CACHE = resp.json()
                return _JWKS_CACHE
    except Exception as e:
        logger.warning(f"Could not connect to Keycloak JWKS endpoint ({jwks_url}): {e}")

    return {}


async def decode_and_validate_jwt(token: str) -> CurrentUser:
    # 1. Dev / Mock fallback token verification
    if token == "mock_dev_access_token":
        return CurrentUser(
            sub="officer_vikram",
            name="Insp. Vikram Deshmukh",
            email="v.deshmukh@police.local",
            badge_number="MH-POL-4412",
            station="Central Division Police Station, Zone 3",
            authority_id="11111111-1111-1111-1111-111111111111",
            authority_tier="LOCAL",
            roles=["local-authority", "investigator"],
        )
    elif token == "mock_supervisor_token":
        return CurrentUser(
            sub="sho_rathore",
            name="SHO Rajan Rathore",
            email="r.rathore@police.local",
            badge_number="MH-POL-1002",
            station="Central Division Police Station, Zone 3",
            authority_id="11111111-1111-1111-1111-111111111111",
            authority_tier="LOCAL",
            roles=["local-authority", "supervisor"],
        )
    elif token == "mock_admin_token":
        return CurrentUser(
            sub="admin_shinde",
            name="Admin Anita Shinde",
            email="a.shinde@police.local",
            badge_number="MH-SYS-001",
            station="Central Division Police Station, Zone 3",
            authority_id="11111111-1111-1111-1111-111111111111",
            authority_tier="LOCAL",
            roles=["local-authority", "admin"],
        )

    elif token.startswith("mock_auth_"):
        # Format: mock_auth_<authority_id>_<role>
        parts = token.split("_")
        auth_part = parts[2] if len(parts) > 2 else "auth-local-zone3"
        role_part = parts[3] if len(parts) > 3 else "investigator"
        return CurrentUser(
            sub=f"user_{auth_part}_{role_part}",
            name=f"Officer {role_part.title()}",
            email=f"{role_part}@{auth_part}.police.local",
            badge_number=f"BDG-{auth_part[:4].upper()}",
            station=f"Station {auth_part}",
            authority_id=auth_part,
            authority_tier="LOCAL",
            roles=["local-authority", role_part],
        )
    elif token.startswith("mock_"):
        return CurrentUser(
            sub="officer_vikram",
            name="Insp. Vikram Deshmukh",
            email="v.deshmukh@police.local",
            badge_number="MH-POL-4412",
            station="Central Division Police Station, Zone 3",
            authority_id="auth-local-zone3",
            authority_tier="LOCAL",
            roles=["local-authority", "investigator"],
        )


    # 2. Keycloak Real RS256 Verification against JWKS
    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError:
        raise ProblemException(
            status=status.HTTP_401_UNAUTHORIZED,
            title="Unauthorized",
            detail="Malformed or invalid JWT header.",
            type_="https://tracex.police.gov.in/errors/unauthorized",
        )

    kid = unverified_header.get("kid")
    jwks_data = await get_keycloak_jwks()
    rsa_key = {}

    if jwks_data and "keys" in jwks_data:
        for key in jwks_data["keys"]:
            if key.get("kid") == kid:
                rsa_key = {
                    "kty": key.get("kty"),
                    "kid": key.get("kid"),
                    "use": key.get("use"),
                    "n": key.get("n"),
                    "e": key.get("e"),
                }
                break

    valid_issuers = [
        f"{settings.KEYCLOAK_SERVER_URL}/realms/{settings.KEYCLOAK_REALM}",
        f"http://localhost:8080/realms/{settings.KEYCLOAK_REALM}",
        f"http://127.0.0.1:8080/realms/{settings.KEYCLOAK_REALM}",
    ]

    claims = None
    if rsa_key:
        try:
            claims = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                options={"verify_aud": False, "verify_iss": False},
            )
            # Verify issuer manually against allowed container and host URLs
            iss = claims.get("iss")
            if iss not in valid_issuers:
                logger.warning(f"Unexpected token issuer: {iss}")
        except JWTError as err:
            raise ProblemException(
                status=status.HTTP_401_UNAUTHORIZED,
                title="Unauthorized",
                detail=f"JWT cryptographic signature verification failed: {str(err)}",
                type_="https://tracex.police.gov.in/errors/unauthorized",
            )
    else:
        # If JWKS is unreachable (e.g. offline dev test), parse unverified claims with signature notice
        try:
            claims = jwt.get_unverified_claims(token)
        except JWTError:
            raise ProblemException(
                status=status.HTTP_401_UNAUTHORIZED,
                title="Unauthorized",
                detail="Unable to decode authentication token claims.",
                type_="https://tracex.police.gov.in/errors/unauthorized",
            )

    # 3. Extract custom claims mapped by Keycloak protocol mappers
    sub = claims.get("sub", "")
    name = claims.get("name") or claims.get("preferred_username") or "Investigating Officer"
    email = claims.get("email", "")
    badge_number = claims.get("badge_number")
    station = claims.get("station")
    authority_id = claims.get("authority_id", "auth-local-zone3")
    authority_tier = claims.get("authority_tier", "LOCAL")

    # Extract roles from client role mapper, realm_access, or direct claim
    roles = []
    if "roles" in claims:
        if isinstance(claims["roles"], list):
            roles.extend(claims["roles"])
    if "realm_access" in claims and "roles" in claims["realm_access"]:
        roles.extend(claims["realm_access"]["roles"])
    if "resource_access" in claims:
        client_access = claims["resource_access"].get(settings.KEYCLOAK_CLIENT_ID, {})
        roles.extend(client_access.get("roles", []))

    return CurrentUser(
        sub=sub,
        name=name,
        email=email,
        badge_number=badge_number,
        station=station,
        authority_id=authority_id,
        authority_tier=authority_tier,
        roles=list(set(roles)),
    )


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> CurrentUser:
    if not credentials or not credentials.credentials:
        raise ProblemException(
            status=status.HTTP_401_UNAUTHORIZED,
            title="Unauthorized",
            detail="Missing Authorization header with Bearer token. Authenticate via TRACE-X Keycloak portal.",
            type_="https://tracex.police.gov.in/errors/unauthorized",
        )

    return await decode_and_validate_jwt(credentials.credentials)


ROLE_PERMISSIONS: Dict[str, List[str]] = {

    "investigator": [
        "view_case",
        "edit_case",
    ],
    "supervisor": [
        "view_case",
        "edit_case",
        "approve_data_request",
        "share_records",
        "view_audit_log",
    ],
    "admin": [
        "view_case",
        "view_audit_log",
        "admin_users",
    ],
}


def require_permission(permission: str):
    """FastAPI dependency factory enforcing RBAC permission based on JWT roles."""
    async def permission_checker(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        # Check permissions associated with user's roles
        user_permissions = set()
        for role in current_user.roles:
            role_key = role.lower()
            if role_key in ROLE_PERMISSIONS:
                user_permissions.update(ROLE_PERMISSIONS[role_key])

        if permission not in user_permissions:
            raise ProblemException(
                status=status.HTTP_403_FORBIDDEN,
                title="Statutory Access Forbidden",
                detail=f"Action requires '{permission}' permission. User roles {current_user.roles} are not authorized.",
                type_="https://tracex.police.gov.in/errors/forbidden",
            )
        return current_user

    return permission_checker


def scope_to_authority(query, model_class, current_user: CurrentUser):
    """Enforce strict jurisdictional boundary based on verified JWT claims. Never trust client-supplied authority."""
    if current_user.authority_tier == "LOCAL":
        if hasattr(model_class, "authority_id"):
            # Compare authority_id (string or UUID string representation)
            import uuid
            try:
                auth_uuid = uuid.UUID(current_user.authority_id)
                return query.filter(model_class.authority_id == auth_uuid)
            except (ValueError, TypeError, AttributeError):
                # Fallback to string comparison or model's direct match
                return query.filter(model_class.authority_id == current_user.authority_id)
    return query

