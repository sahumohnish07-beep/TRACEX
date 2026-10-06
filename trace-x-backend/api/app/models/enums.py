import enum


class AuthorityType(str, enum.Enum):
    LOCAL = "LOCAL"
    STATE = "STATE"
    CENTRAL = "CENTRAL"


class CaseStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    UNDER_ANALYSIS = "UNDER_ANALYSIS"
    PENDING_REVIEW = "PENDING_REVIEW"
    CLOSED = "CLOSED"
    RESOLVED = "RESOLVED"


class PriorityLevel(str, enum.Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class SourceType(str, enum.Enum):
    VERIFIED_RECORD = "VERIFIED_RECORD"
    SYSTEM_DERIVED = "SYSTEM_DERIVED"
    AI_ANALYSIS = "AI_ANALYSIS"


class DocumentStatus(str, enum.Enum):
    Processing = "Processing"
    Processed = "Processed"
    Failed = "Failed"


class DataRequestStatus(str, enum.Enum):
    Pending = "Pending"
    Under_Review = "Under Review"
    Approved = "Approved"
    Rejected = "Rejected"
    Data_Sent = "Data Sent"
    Received = "Received"


class UrgencyLevel(str, enum.Enum):
    HIGH = "HIGH"
    ROUTINE = "ROUTINE"


class EvidenceStrength(str, enum.Enum):
    Strong = "Strong"
    Moderate = "Moderate"
    Limited = "Limited"


class PersonStatus(str, enum.Enum):
    SUSPECT = "SUSPECT"
    PERSON_OF_INTEREST = "PERSON_OF_INTEREST"
    ASSOCIATE = "ASSOCIATE"
    WITNESS = "WITNESS"
    VICTIM = "VICTIM"


class RiskLevel(str, enum.Enum):
    HIGH = "HIGH"
    ELEVATED = "ELEVATED"
    STANDARD = "STANDARD"
    LOW = "LOW"


class PredictionStatus(str, enum.Enum):
    PENDING_REVIEW = "PENDING_REVIEW"
    CONFIRMED = "CONFIRMED"
    DISMISSED = "DISMISSED"
