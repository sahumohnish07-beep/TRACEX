"""
TRACE-X SQLAlchemy Database Models
"""

from app.core.db import Base
from app.models.enums import (
    AuthorityType,
    CaseStatus,
    PriorityLevel,
    SourceType,
    DocumentStatus,
    DataRequestStatus,
    UrgencyLevel,
    EvidenceStrength,
    PersonStatus,
    RiskLevel,
    PredictionStatus,
)
from app.models.auth import Authority, Role, Permission, User, role_permissions
from app.models.case import Case, Document, ExtractedEntity
from app.models.entities import Person, Vehicle, Location, PhoneNumber, CaseEntity
from app.models.data_request import DataRequest, SharedRecord
from app.models.ml import MLPrediction
from app.models.investigation_view import InvestigationView
from app.models.graph_sync import GraphSyncEvent, GraphEventType, GraphSyncStatus

__all__ = [
    "Base",
    "AuthorityType",
    "CaseStatus",
    "PriorityLevel",
    "SourceType",
    "DocumentStatus",
    "DataRequestStatus",
    "UrgencyLevel",
    "EvidenceStrength",
    "PersonStatus",
    "RiskLevel",
    "PredictionStatus",
    "Authority",
    "Role",
    "Permission",
    "User",
    "role_permissions",
    "Case",
    "Document",
    "ExtractedEntity",
    "Person",
    "Vehicle",
    "Location",
    "PhoneNumber",
    "CaseEntity",
    "DataRequest",
    "SharedRecord",
    "MLPrediction",
    "AuditLog",
    "InvestigationView",
    "GraphSyncEvent",
    "GraphEventType",
    "GraphSyncStatus",
]

