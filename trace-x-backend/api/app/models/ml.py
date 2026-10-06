import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    Enum as SQLEnum,
    Float,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.db import Base
from app.models.enums import EvidenceStrength, PredictionStatus


class MLPrediction(Base):
    __tablename__ = "ml_predictions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True)

    entity_a_id = Column(String(100), nullable=False, index=True)
    entity_a_name = Column(String(255), nullable=False)
    entity_a_type = Column(String(50), nullable=False)

    entity_b_id = Column(String(100), nullable=False, index=True)
    entity_b_name = Column(String(255), nullable=False)
    entity_b_type = Column(String(50), nullable=False)

    model_name = Column(String(100), nullable=False)
    model_version = Column(String(50), nullable=False)

    probability = Column(Float, nullable=False)
    calibrated_probability = Column(Float, nullable=False)
    evidence_strength = Column(
        SQLEnum(EvidenceStrength, name="evidence_strength"),
        nullable=False,
        default=EvidenceStrength.Moderate,
        index=True,
    )

    connection_basis = Column(JSONB, nullable=True)  # List of textual explanation statements
    evidence_basis = Column(JSONB, nullable=True)    # Corroborating documents / records
    shap_values = Column(JSONB, nullable=True)       # Feature importance / SHAP weights

    status = Column(
        SQLEnum(PredictionStatus, name="prediction_status"),
        nullable=False,
        default=PredictionStatus.PENDING_REVIEW,
        index=True,
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    case = relationship("Case", back_populates="ml_predictions")
