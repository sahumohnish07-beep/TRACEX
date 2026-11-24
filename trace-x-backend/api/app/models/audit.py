import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    event,
    DDL,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.db import Base


class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)
    action = Column(String(100), nullable=False, index=True)  # CASE_ACCESSED, EXPORT_GENERATED, etc.
    target_type = Column(String(100), nullable=False)  # CASE, DATA_REQUEST, PERSON, VIEW
    target_id = Column(String(100), nullable=False)    # e.g. CASE-2026-0891
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="SET NULL"), nullable=True, index=True)
    metadata_payload = Column("metadata", JSONB, nullable=True)  # Detailed event payload
    ip_address = Column(String(50), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    user = relationship("User", back_populates="audit_logs")
    case = relationship("Case")


# Append-only trigger DDL: Blocks UPDATE and DELETE operations at database level
trigger_function_ddl_pg = DDL(
    """
    CREATE OR REPLACE FUNCTION enforce_audit_log_append_only()
    RETURNS TRIGGER AS $$
    BEGIN
        RAISE EXCEPTION 'Audit log is strictly append-only. Modification or deletion is legally prohibited under statutory audit standards.';
    END;
    $$ LANGUAGE plpgsql;
    """
)

trigger_ddl_pg = DDL(
    """
    CREATE OR REPLACE TRIGGER trg_audit_log_immutable
    BEFORE UPDATE OR DELETE ON audit_log
    FOR EACH ROW
    EXECUTE FUNCTION enforce_audit_log_append_only();
    """
)

sqlite_no_update_ddl = DDL(
    """
    CREATE TRIGGER IF NOT EXISTS trg_audit_log_no_update
    BEFORE UPDATE ON audit_log
    BEGIN
        SELECT RAISE(ABORT, 'Audit log is strictly append-only. UPDATE rejected.');
    END;
    """
)

sqlite_no_delete_ddl = DDL(
    """
    CREATE TRIGGER IF NOT EXISTS trg_audit_log_no_delete
    BEFORE DELETE ON audit_log
    BEGIN
        SELECT RAISE(ABORT, 'Audit log is strictly append-only. DELETE rejected.');
    END;
    """
)

# Postgres triggers
event.listen(AuditLog.__table__, "after_create", trigger_function_ddl_pg.execute_if(dialect="postgresql"))
event.listen(AuditLog.__table__, "after_create", trigger_ddl_pg.execute_if(dialect="postgresql"))

# SQLite triggers (for test environments and local SQLite runs)
event.listen(AuditLog.__table__, "after_create", sqlite_no_update_ddl.execute_if(dialect="sqlite"))
event.listen(AuditLog.__table__, "after_create", sqlite_no_delete_ddl.execute_if(dialect="sqlite"))


# Python ORM safeguard: raises exception if session tries to modify/delete an AuditLog instance
@event.listens_for(AuditLog, "before_update")
def receive_before_update(mapper, connection, target):
    raise ValueError("Audit log is strictly append-only. Modification is prohibited.")


@event.listens_for(AuditLog, "before_delete")
def receive_before_delete(mapper, connection, target):
    raise ValueError("Audit log is strictly append-only. Deletion is prohibited.")

