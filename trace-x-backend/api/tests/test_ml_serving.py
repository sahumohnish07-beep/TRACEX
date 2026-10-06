"""TRACE-X ML Serving Integration Tests
Validates:
1. Internal POST /internal/score-connection endpoint
2. Corroborated connection (high degree + shared vehicle) -> evidence_strength reaches "Strong"
3. Uncorroborated connection (high anomaly score only, no shared facts) -> caps at "Moderate"
4. Missing links GET endpoint /api/v1/cases/{id}/missing-links reads real ml_predictions
   with AI_ANALYSIS evidence format, sorted by evidence strength, without raw numeric leak.
"""

import pytest
import uuid
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.case import Case, CaseStatus, PriorityLevel
from app.models.entities import Person, Vehicle, PersonStatus, RiskLevel, CaseEntity
from app.models.enums import SourceType, EvidenceStrength, PredictionStatus
from app.models.ml import MLPrediction
from ml.serving.model_service import score_connection_pair


def test_corroborated_connection_reaches_strong(client: TestClient, db_session: Session):
    """Seed a case with high graph centrality AND a shared VehicleID -> confirm evidence_strength reaches 'Strong'."""
    case = db_session.query(Case).first()

    # Create two persons
    p1_id = f"PER-TEST-{uuid.uuid4().hex[:4].upper()}"
    p2_id = f"PER-TEST-{uuid.uuid4().hex[:4].upper()}"

    person1 = Person(
        id=uuid.uuid4(),
        person_id=p1_id,
        full_name="Rajesh G. Khurana",
        status=PersonStatus.SUSPECT,
        risk_level=RiskLevel.HIGH,
        source_type=SourceType.VERIFIED_RECORD,
    )
    person2 = Person(
        id=uuid.uuid4(),
        person_id=p2_id,
        full_name="Sunil M. Verma",
        status=PersonStatus.ASSOCIATE,
        risk_level=RiskLevel.STANDARD,
        source_type=SourceType.SYSTEM_DERIVED,
    )
    db_session.add(person1)
    db_session.add(person2)
    db_session.flush()

    # Seed shared vehicle
    shared_plate = f"MH-02-AB-{uuid.uuid4().hex[:4].upper()}"
    v1 = Vehicle(
        id=uuid.uuid4(),
        plate_number=shared_plate,
        owner_person_id=person1.id,
        source_type=SourceType.VERIFIED_RECORD,
    )
    v2 = Vehicle(
        id=uuid.uuid4(),
        plate_number=shared_plate,
        owner_person_id=person2.id,
        source_type=SourceType.SYSTEM_DERIVED,
    )
    db_session.add(v1)
    db_session.add(v2)
    db_session.commit()

    # Call internal scoring endpoint with high degree/centrality + shared vehicle
    payload = {
        "case_id": case.case_number,
        "person_id": p1_id,
        "connected_person_id": p2_id,
        "degree_a": 85,
        "degree_b": 85,
        "location_density": 250,
    }
    resp = client.post("/internal/score-connection", json=payload)
    assert resp.status_code == 200
    data = resp.json()

    # Assertions
    assert data["model_name"] == "tracex-isolation-forest-tier-a"
    assert data["model_version"] == "1.0.0"
    assert len(data["corroborating_facts"]) >= 1
    assert any("Shared vehicle" in f for f in data["corroborating_facts"])
    # Corroborated link with shared vehicle reaches Strong
    assert data["evidence_strength"] == "Strong"
    assert data["anomaly_score"] >= 0.60
    assert not data["is_calibrated_classifier"]
    assert data["underlying_label_type"] == "HEURISTIC_WEAK_LABEL_DIAGNOSTIC"


def test_uncorroborated_connection_caps_at_moderate(client: TestClient, db_session: Session):
    """Seed candidate with high anomaly score but NO corroborating graph facts -> confirm capped at 'Moderate'."""
    case = db_session.query(Case).first()

    p_iso1 = f"PER-ISO-{uuid.uuid4().hex[:4].upper()}"
    p_iso2 = f"PER-ISO-{uuid.uuid4().hex[:4].upper()}"

    person1 = Person(
        id=uuid.uuid4(),
        person_id=p_iso1,
        full_name="Outlier Entity Alpha",
        status=PersonStatus.PERSON_OF_INTEREST,
        risk_level=RiskLevel.STANDARD,
        source_type=SourceType.SYSTEM_DERIVED,
    )
    person2 = Person(
        id=uuid.uuid4(),
        person_id=p_iso2,
        full_name="Outlier Entity Beta",
        status=PersonStatus.PERSON_OF_INTEREST,
        risk_level=RiskLevel.STANDARD,
        source_type=SourceType.SYSTEM_DERIVED,
    )
    db_session.add(person1)
    db_session.add(person2)
    db_session.commit()

    # Call internal scoring endpoint with high degree/centrality but NO shared vehicles/phones/cases
    payload = {
        "case_id": case.case_number,
        "person_id": p_iso1,
        "connected_person_id": p_iso2,
        "degree_a": 85,
        "degree_b": 85,
        "location_density": 250,
    }
    resp = client.post("/internal/score-connection", json=payload)
    assert resp.status_code == 200
    data = resp.json()

    # Assertions: No concrete corroborating facts, so MUST NOT exceed 'Moderate' despite high anomaly score
    assert len(data["corroborating_facts"]) == 0
    assert data["anomaly_score"] >= 0.60
    assert data["evidence_strength"] == "Moderate"
    assert data["evidence_strength"] != "Strong"


def test_missing_links_endpoint_reads_ml_predictions_sorted(client: TestClient, db_session: Session):
    """GET /cases/{id}/missing-links returns real ML predictions sorted by EvidenceStrength (Strong -> Moderate -> Limited)."""
    case = db_session.query(Case).first()

    # Clean existing
    db_session.query(MLPrediction).filter(MLPrediction.case_id == case.id).delete()

    # Add 2 predictions: 1 Moderate, 1 Strong
    p_mod = MLPrediction(
        id=uuid.uuid4(),
        case_id=case.id,
        entity_a_id="PER-9001",
        entity_a_name="Subject One",
        entity_a_type="PERSON",
        entity_b_id="PER-9002",
        entity_b_name="Subject Two",
        entity_b_type="PERSON",
        model_name="tracex-isolation-forest-tier-a",
        model_version="1.0.0",
        probability=0.55,
        calibrated_probability=0.55,
        evidence_strength=EvidenceStrength.Moderate,
        connection_basis=["Multiple relationship connections recorded across active cases (degree: 38)"],
        evidence_basis=["Jurisdictional graph correlation and station registry co-occurrence"],
        status=PredictionStatus.PENDING_REVIEW,
    )
    p_strong = MLPrediction(
        id=uuid.uuid4(),
        case_id=case.id,
        entity_a_id="PER-9003",
        entity_a_name="Subject Three",
        entity_a_type="PERSON",
        entity_b_id="PER-9004",
        entity_b_name="Subject Four",
        entity_b_type="PERSON",
        model_name="tracex-isolation-forest-tier-a",
        model_version="1.0.0",
        probability=0.68,
        calibrated_probability=0.68,
        evidence_strength=EvidenceStrength.Strong,
        connection_basis=[
            "Vehicle associated with multiple records (fleet frequency: 2)",
            "Multiple relationship connections recorded across active cases (degree: 44)",
        ],
        evidence_basis=[
            "Shared vehicle registration and ownership record: MH-01-CR-8902",
            "Co-referenced across 2 distinct investigative case ledgers",
        ],
        status=PredictionStatus.PENDING_REVIEW,
    )
    db_session.add(p_mod)
    db_session.add(p_strong)
    db_session.commit()

    # Query endpoint
    resp = client.get(f"/api/v1/cases/{case.case_number}/missing-links")
    assert resp.status_code == 200
    candidates = resp.json()

    assert len(candidates) >= 2
    # Verify sorting: Strong must appear before Moderate
    strengths = [c["evidenceStrength"] for c in candidates]
    assert strengths[0] == "STRONG"
    assert strengths[1] == "MODERATE"

    # Verify no raw numbers/percentages leaked in user-facing basis
    for c in candidates:
        assert "evidenceBasis" in c
        assert "connectionBasis" in c
        for b in c["connectionBasis"]:
            assert "0." not in b  # No raw floats leaked
