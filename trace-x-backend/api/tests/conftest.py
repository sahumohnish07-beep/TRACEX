import os
import sys
import pytest
from typing import Generator

# Add backend directory to sys.path so ml and app can be imported
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
import uuid
from datetime import datetime, timezone, date

# SQLite in-memory engine for fast test execution
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.compiler import compiles

@compiles(UUID, "sqlite")
def compile_uuid_sqlite(type_, compiler, **kw):
    return "VARCHAR(36)"

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

import app.core.db
app.core.db.SessionLocal = TestingSessionLocal
app.core.db.engine = test_engine

from app.core.db import Base, get_db
from app.main import app
from app.models import (
    Authority,
    AuthorityType,
    Role,
    User,
    Case,
    CaseStatus,
    PriorityLevel,
    SourceType,
    Person,
    PersonStatus,
    RiskLevel,
    CaseEntity,
    Document,
    DocumentStatus,
)


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    import app.core.db
    import app.tasks
    app.core.db.SessionLocal = TestingSessionLocal
    app.tasks.SessionLocal = TestingSessionLocal

    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()

    # Seed baseline test case and user
    auth_id = uuid.UUID("11111111-1111-1111-1111-111111111111")
    auth = Authority(
        id=auth_id,
        name="Central Division Police Station, Zone 3",
        type=AuthorityType.LOCAL,
        jurisdiction="Zone 3 Metro",
    )
    db.add(auth)
    db.flush()


    user = User(
        id=uuid.uuid4(),
        keycloak_sub="sub-test-vikram",
        name="Insp. Vikram Deshmukh",
        email="vikram@police.gov.in",
        role="Senior Investigating Officer",
        badge_id="MH-POL-4412",
        authority_id=auth.id,
    )
    db.add(user)
    db.flush()

    case1 = Case(
        id=uuid.uuid4(),
        case_number="CASE-2026-0891",
        fir_number="FIR #18/26",
        title="Hawala Logistics & Shadow Syndicate",
        crime_type="Financial Crime / Syndicate Money Laundering",
        status=CaseStatus.UNDER_ANALYSIS,
        priority=PriorityLevel.CRITICAL,
        police_station="Central Division Police Station, Zone 3",
        location="Dockyard Road, Terminal Gate 3",
        description="Investigation into layered cash transfers and mule accounts linked to freight import invoices.",
        investigating_officer_id=user.id,
        authority_id=auth.id,
        requires_attention=True,
        attention_reason="3 new system-derived telecom overlaps detected.",
    )
    db.add(case1)
    db.flush()

    person1 = Person(
        id=uuid.uuid4(),
        person_id="PER-4401",
        full_name="Tariq Merchant",
        aliases=["Tariq Bhai", "T.M. Freight"],
        national_id="ABCDE1234F",
        date_of_birth=date(1982, 5, 19),
        gender="Male",
        status=PersonStatus.SUSPECT,
        risk_level=RiskLevel.HIGH,
        primary_address="Flat 402, Al-Madina Heights, Dock Road, Zone 3",
        source_type=SourceType.VERIFIED_RECORD,
        evidence_basis=["Court Seizure Warrant #14/26", "Interrogation Memo #02"],
    )
    db.add(person1)
    db.flush()

    ce1 = CaseEntity(
        id=uuid.uuid4(),
        case_id=case1.id,
        entity_type="PERSON",
        entity_id="PER-4401",
        role_in_case="Primary Suspect",
        source_type=SourceType.VERIFIED_RECORD,
    )
    db.add(ce1)
    db.commit()
    db.close()

    yield

    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, headers={"Authorization": "Bearer mock_dev_access_token"}) as test_client:
        yield test_client
    app.dependency_overrides.clear()

