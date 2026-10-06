import uuid
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Enum as SQLEnum,
    Table,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.db import Base
from app.models.enums import AuthorityType

role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", UUID(as_uuid=True), ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
    Column("permission_id", UUID(as_uuid=True), ForeignKey("permissions.id", ondelete="CASCADE"), primary_key=True),
)


class Authority(Base):
    __tablename__ = "authorities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, unique=True, index=True)
    type = Column(SQLEnum(AuthorityType, name="authority_type"), nullable=False, index=True)
    jurisdiction = Column(String(255), nullable=False)
    parent_authority_id = Column(UUID(as_uuid=True), ForeignKey("authorities.id", ondelete="SET NULL"), nullable=True, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Self-referential relationship
    parent_authority = relationship("Authority", remote_side=[id], backref="sub_authorities")
    users = relationship("User", back_populates="authority")
    cases = relationship("Case", back_populates="authority")


class Role(Base):
    __tablename__ = "roles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    permissions = relationship("Permission", secondary=role_permissions, back_populates="roles")
    users = relationship("User", back_populates="role_rel")


class Permission(Base):
    __tablename__ = "permissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    roles = relationship("Role", secondary=role_permissions, back_populates="permissions")


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    keycloak_sub = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=True, index=True)
    role = Column(String(100), nullable=False)  # Functional display role, e.g. "Senior Investigating Officer"
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id", ondelete="SET NULL"), nullable=True, index=True)
    authority_id = Column(UUID(as_uuid=True), ForeignKey("authorities.id", ondelete="RESTRICT"), nullable=False, index=True)
    badge_id = Column(String(100), nullable=False, index=True)  # e.g. "MH-POL-4412"
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    authority = relationship("Authority", back_populates="users")
    role_rel = relationship("Role", back_populates="users")
    investigated_cases = relationship("Case", back_populates="investigating_officer")
    audit_logs = relationship("AuditLog", back_populates="user")
