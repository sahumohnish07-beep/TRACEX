import uuid
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.db import Base


class InvestigationView(Base):
    __tablename__ = "investigation_views"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    view_identifier = Column(String(50), unique=True, nullable=False, index=True)  # e.g. "VIEW-891-A"
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), nullable=True, index=True)
    case_number = Column(String(100), nullable=True, index=True)
    case_title = Column(String(255), nullable=True)
    title = Column(String(255), nullable=False)
    node_count = Column(Integer, default=0, nullable=False)
    edge_count = Column(Integer, default=0, nullable=False)
    notes = Column(Text, nullable=True)
    graph_state = Column(JSONB, nullable=True)  # custom node positions, hidden elements, annotations
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    case = relationship("Case")
    user = relationship("User")
