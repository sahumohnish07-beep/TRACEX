import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    Enum as SQLEnum,
    Text,
    Float,
    Date,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.db import Base
from app.models.enums import SourceType, PersonStatus, RiskLevel


class Person(Base):
    __tablename__ = "persons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    person_id = Column(String(50), unique=True, nullable=False, index=True)  # e.g. "PER-4401"
    full_name = Column(String(255), nullable=False, index=True)
    aliases = Column(JSONB, nullable=True)  # list of alias strings
    national_id = Column(String(100), nullable=True, index=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(20), nullable=True)
    status = Column(SQLEnum(PersonStatus, name="person_status"), nullable=False, default=PersonStatus.SUSPECT, index=True)
    risk_level = Column(SQLEnum(RiskLevel, name="risk_level"), nullable=False, default=RiskLevel.STANDARD, index=True)
    primary_address = Column(Text, nullable=True)

    source_type = Column(SQLEnum(SourceType, name="source_type"), nullable=False, default=SourceType.VERIFIED_RECORD, index=True)
    source_document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="SET NULL"), nullable=True, index=True)
    evidence_basis = Column(JSONB, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    source_document = relationship("Document")
    vehicles = relationship("Vehicle", back_populates="owner_person")
    phone_numbers = relationship("PhoneNumber", back_populates="associated_person")


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plate_number = Column(String(50), nullable=False, index=True)
    make_model = Column(String(100), nullable=True)
    chassis_number = Column(String(100), nullable=True, index=True)
    owner_person_id = Column(UUID(as_uuid=True), ForeignKey("persons.id", ondelete="SET NULL"), nullable=True, index=True)

    source_type = Column(SQLEnum(SourceType, name="source_type"), nullable=False, default=SourceType.VERIFIED_RECORD, index=True)
    source_document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="SET NULL"), nullable=True, index=True)
    evidence_basis = Column(JSONB, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    owner_person = relationship("Person", back_populates="vehicles")
    source_document = relationship("Document")


class Location(Base):
    __tablename__ = "locations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, index=True)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True, index=True)
    state = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    source_type = Column(SQLEnum(SourceType, name="source_type"), nullable=False, default=SourceType.VERIFIED_RECORD, index=True)
    source_document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="SET NULL"), nullable=True, index=True)
    evidence_basis = Column(JSONB, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    source_document = relationship("Document")


class PhoneNumber(Base):
    __tablename__ = "phone_numbers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phone_number = Column(String(50), nullable=False, index=True)
    subscriber_name = Column(String(255), nullable=True)
    telecom_carrier = Column(String(100), nullable=True)
    associated_person_id = Column(UUID(as_uuid=True), ForeignKey("persons.id", ondelete="SET NULL"), nullable=True, index=True)

    source_type = Column(SQLEnum(SourceType, name="source_type"), nullable=False, default=SourceType.VERIFIED_RECORD, index=True)
    source_document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="SET NULL"), nullable=True, index=True)
    evidence_basis = Column(JSONB, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    associated_person = relationship("Person", back_populates="phone_numbers")
    source_document = relationship("Document")


class CaseEntity(Base):
    __tablename__ = "case_entities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True)
    entity_type = Column(String(50), nullable=False, index=True)  # PERSON, PHONE, VEHICLE, LOCATION
    entity_id = Column(String(100), nullable=False, index=True)  # Foreign reference string e.g. PER-4401
    role_in_case = Column(String(100), nullable=False)  # Primary Suspect, Accomplice, POI
    source_type = Column(SQLEnum(SourceType, name="source_type"), nullable=False, default=SourceType.VERIFIED_RECORD)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    case = relationship("Case", back_populates="case_entities")
