import uuid
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Enum as SQLEnum,
    Text,
    BigInteger,
    Float,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.db import Base
from app.models.enums import CaseStatus, PriorityLevel, DocumentStatus


class Case(Base):
    __tablename__ = "cases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_number = Column(String(100), unique=True, nullable=False, index=True)
    fir_number = Column(String(100), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    crime_type = Column(String(150), nullable=False, index=True)
    status = Column(SQLEnum(CaseStatus, name="case_status"), nullable=False, default=CaseStatus.ACTIVE, index=True)
    priority = Column(SQLEnum(PriorityLevel, name="priority_level"), nullable=False, default=PriorityLevel.MEDIUM, index=True)
    police_station = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    investigating_officer_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)
    authority_id = Column(UUID(as_uuid=True), ForeignKey("authorities.id", ondelete="RESTRICT"), nullable=False, index=True)

    requires_attention = Column(Boolean, default=False, nullable=False)
    attention_reason = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    authority = relationship("Authority", back_populates="cases")
    investigating_officer = relationship("User", back_populates="investigated_cases")
    documents = relationship("Document", back_populates="case", cascade="all, delete-orphan")
    extracted_entities = relationship("ExtractedEntity", back_populates="case", cascade="all, delete-orphan")
    case_entities = relationship("CaseEntity", back_populates="case", cascade="all, delete-orphan")
    ml_predictions = relationship("MLPrediction", back_populates="case", cascade="all, delete-orphan")
    data_requests = relationship("DataRequest", back_populates="case")


class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    storage_path = Column(String(500), nullable=False)
    file_size_bytes = Column(BigInteger, nullable=True)
    processing_status = Column(
        SQLEnum(DocumentStatus, name="document_status"),
        nullable=False,
        default=DocumentStatus.Processing,
        index=True,
    )
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    case = relationship("Case", back_populates="documents")
    uploader = relationship("User")
    extracted_entities = relationship("ExtractedEntity", back_populates="document", cascade="all, delete-orphan")


class ExtractedEntity(Base):
    __tablename__ = "extracted_entities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True)
    entity_type = Column(String(50), nullable=False, index=True)  # PERSON, PHONE, VEHICLE, LOCATION, ORGANIZATION
    raw_value = Column(String(255), nullable=False)
    normalized_value = Column(String(255), nullable=True)
    confidence_score = Column(Float, nullable=True)
    confirmed = Column(Boolean, default=False, nullable=False, index=True)
    confirmed_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    rejected = Column(Boolean, default=False, nullable=False, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    document = relationship("Document", back_populates="extracted_entities")
    case = relationship("Case", back_populates="extracted_entities")
    confirmer = relationship("User", foreign_keys=[confirmed_by])
