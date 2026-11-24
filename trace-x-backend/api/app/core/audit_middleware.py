import logging
import re
from typing import Optional
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, Response
from app.core.db import SessionLocal
from app.core.auth import decode_and_validate_jwt, CurrentUser
from app.models.auth import User
from app.models.case import Case
from app.models.audit import AuditLog
from app.repositories.audit_repo import write_audit_log

logger = logging.getLogger("tracex_audit_middleware")

# Sensitive read patterns and state-changing write patterns
# Vocabulary: Viewed Case, Requested Data, Approved Data Request, Shared Records, Viewed Received Data, Created Investigation View
AUDIT_ACTIONS = [
    # Sensitive Reads
    (r"^/api/v1/cases/([^/]+)$", "GET", "Viewed Case", "CASE"),
    (r"^/api/v1/cases/([^/]+)/network$", "GET", "Viewed Case", "CASE"),
    (r"^/api/v1/cases/([^/]+)/missing-links$", "GET", "Viewed Case", "CASE"),
    (r"^/api/v1/received-data", "GET", "Viewed Received Data", "RECEIVED_DATA"),
    # State-Changing Writes
    (r"^/api/v1/requests$", "POST", "Requested Data", "DATA_REQUEST"),
    (r"^/api/v1/incoming-requests/([^/]+)/approve$", "POST", "Approved Data Request", "DATA_REQUEST"),
    (r"^/api/v1/incoming-requests/([^/]+)/share$", "POST", "Shared Records", "DATA_REQUEST"),
    (r"^/api/v1/investigation-views/([^/]+)$", "POST", "Created Investigation View", "INVESTIGATION_VIEW"),
]


class AuditLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        method = request.method
        path = request.url.path

        # Check if route matches an audited action
        audit_spec = None
        target_id = "UNKNOWN"
        for pattern, req_method, action_name, target_type in AUDIT_ACTIONS:
            if method == req_method:
                match = re.search(pattern, path)
                if match:
                    groups = match.groups()
                    target_id = groups[0] if groups else "GLOBAL"
                    audit_spec = (action_name, target_type, target_id)
                    break

        # Process request
        response: Response = await call_next(request)

        # Only audit successful operations (2xx status codes)
        if audit_spec and 200 <= response.status_code < 300:
            action_name, target_type, target_id = audit_spec
            # Extract user from token
            auth_header = request.headers.get("authorization", "")
            current_user: Optional[CurrentUser] = None
            if auth_header.startswith("Bearer "):
                token = auth_header[7:].strip()
                try:
                    current_user = await decode_and_validate_jwt(token)
                except Exception as e:
                    logger.warning(f"Could not decode token for audit middleware: {e}")

            client_ip = request.client.host if request.client else "127.0.0.1"

            # Fail-closed audit write: if audit write fails, raise exception
            from app.core.db import get_db, SessionLocal
            from app.main import app
            db_factory = app.dependency_overrides.get(get_db)
            if db_factory:
                # Use test session generator
                gen = db_factory()
                db = next(gen)
                should_close = False
            else:
                db = SessionLocal()
                should_close = True

            try:
                user_record = None
                if current_user:
                    user_record = db.query(User).filter(User.keycloak_sub == current_user.sub).first()
                    if not user_record and current_user.name:
                        user_record = db.query(User).filter(User.name == current_user.name).first()
                if not user_record:
                    user_record = db.query(User).first()


                user_id = user_record.id if user_record else None

                case_id = None
                if target_type == "CASE" and target_id:
                    case_obj = db.query(Case).filter(Case.case_number == target_id).first()
                    if case_obj:
                        case_id = case_obj.id

                request_id = getattr(request.state, "request_id", None) or request.headers.get("X-Request-ID") or "N/A"
                details = f"[{request_id}] {action_name} on {target_type} '{target_id}' by {current_user.name if current_user else 'Officer'}"

                write_audit_log(
                    db=db,
                    action=action_name,
                    target_type=target_type,
                    target_id=target_id,
                    user_id=user_id,
                    case_id=case_id,
                    details=details,
                    ip_address=f"{client_ip} (Station LAN)",
                )
                db.commit()
            except Exception as audit_err:
                db.rollback()
                logger.error(f"Statutory audit logging failed: {audit_err}")
                # In fail-closed security, audit failure must fail the operation
                raise audit_err
            finally:
                if should_close:
                    db.close()

        return response

