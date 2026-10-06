import uuid
import enum
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Integer,
    Text,
    Enum as SQLEnum,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.core.db import Base


class GraphEventType(str, enum.Enum):
    ENTITY_UPSERT = "ENTITY_UPSERT"
    RELATIONSHIP_UPSERT = "RELATIONSHIP_UPSERT"
    ENTITY_DELETE = "ENTITY_DELETE"


class GraphSyncStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    DEAD_LETTER = "DEAD_LETTER"


class GraphSyncEvent(Base):
    __tablename__ = "graph_sync_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_type = Column(SQLEnum(GraphEventType, name="graph_event_type"), nullable=False, default=GraphEventType.ENTITY_UPSERT)
    entity_type = Column(String(50), nullable=False, index=True)
    entity_id = Column(String(100), nullable=False, index=True)
    pg_id = Column(String(100), nullable=False, index=True)
    payload = Column(JSONB, nullable=False)
    status = Column(SQLEnum(GraphSyncStatus, name="graph_sync_status"), default=GraphSyncStatus.PENDING, nullable=False, index=True)
    retry_count = Column(Integer, default=0, nullable=False)
    max_retries = Column(Integer, default=5, nullable=False)
    last_error = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    processed_at = Column(DateTime(timezone=True), nullable=True)
