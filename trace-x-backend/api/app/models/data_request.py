import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    Enum as SQLEnum,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.db import Base
from app.models.enums import DataRequestStatus, UrgencyLevel


class DataRequest(Base):
    __tablename__ = "data_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_number = Column(String(100), unique=True, nullable=False, index=True)
    requesting_authority_id = Column(UUID(as_uuid=True), ForeignKey("authorities.id", ondelete="RESTRICT"), nullable=False, index=True)
    source_authority_id = Column(UUID(as_uuid=True), ForeignKey("authorities.id", ondelete="RESTRICT"), nullable=False, index=True)
    requesting_officer_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True)

    requested_info = Column(JSONB, nullable=False)  # JSON payload of requested categories and records
    reason = Column(Text, nullable=False)  # Statutory justification
    urgency = Column(SQLEnum(UrgencyLevel, name="urgency_level"), nullable=False, default=UrgencyLevel.ROUTINE)
    status = Column(SQLEnum(DataRequestStatus, name="data_request_status"), nullable=False, default=DataRequestStatus.Pending, index=True)
    access_duration = Column(String(50), default="30 Days", nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    requesting_authority = relationship("Authority", foreign_keys=[requesting_authority_id])
    source_authority = relationship("Authority", foreign_keys=[source_authority_id])
    requesting_officer = relationship("User", foreign_keys=[requesting_officer_id])
    case = relationship("Case", back_populates="data_requests")
    shared_records = relationship("SharedRecord", back_populates="data_request", cascade="all, delete-orphan")


class SharedRecord(Base):
    __tablename__ = "shared_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    data_request_id = Column(UUID(as_uuid=True), ForeignKey("data_requests.id", ondelete="CASCADE"), nullable=False, index=True)
    record_type = Column(String(100), nullable=False)
    record_id = Column(String(100), nullable=False)
    record_metadata = Column(JSONB, nullable=True)
    access_expiry = Column(DateTime(timezone=True), nullable=False)  # Expiry date enforcing access window
    shared_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    data_request = relationship("DataRequest", back_populates="shared_records")
    sharer = relationship("User")
