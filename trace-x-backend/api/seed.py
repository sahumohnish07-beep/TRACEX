"""
TRACE-X Database Seed Script
Populates PostgreSQL with exact demo data matching existing frontend screens under /dashboard onward:
- Authorities, Users, Roles, Permissions (RBAC)
- Cases (CASE-2026-0891, TRX-2026-0142 "Vehicle Theft Network", TRX-2026-0137, etc.)
- Persons, Vehicles, Locations, Phone Numbers (with VERIFIED_RECORD, SYSTEM_DERIVED, AI_ANALYSIS)
- Documents & Extracted Entities (Upload & Review step wizard)
- Data Requests (TRX-REQ-0184, TRX-REQ-0181) & Shared Records (30-day access)
- ML Predictions (Missing Link Analysis candidates with SHAP values & evidence strength)
- Audit Log (Station activity ledger with append-only compliance)
"""

import sys
import uuid
from datetime import datetime, timedelta, timezone

from app.core.db import SessionLocal, engine
from app.models import (
    Base,
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
    Authority,
    Role,
    Permission,
    User,
    role_permissions,
    Case,
    Document,
    ExtractedEntity,
    Person,
    Vehicle,
    Location,
    PhoneNumber,
    CaseEntity,
    DataRequest,
    SharedRecord,
    MLPrediction,
    AuditLog,
)


def seed_database():
    db = SessionLocal()
    print("[*] Starting TRACE-X database seed process...")

    try:
        # Check if already seeded
        existing_case = db.query(Case).filter(Case.case_number == "CASE-2026-0891").first()
        if existing_case:
            print("[!] Database already populated with base seed data. Skipping duplication.")
            return

        now = datetime.now(timezone.utc)

        # -------------------------------------------------------------
        # 1. Authorities (Local, State, Central)
        # -------------------------------------------------------------
        print("[*] Seeding Authorities hierarchy...")
        auth_central = Authority(
            id=uuid.uuid4(),
            name="Central Intelligence & Narcotics Control Bureau",
            type=AuthorityType.CENTRAL,
            jurisdiction="National / Union Territory Jurisdiction",
            created_at=now - timedelta(days=90),
        )
        auth_state = Authority(
            id=uuid.uuid4(),
            name="State Police Headquarters CID Special Crime Wing",
            type=AuthorityType.STATE,
            jurisdiction="State Headquarters & Inter-District Coordination",
            parent_authority=auth_central,
            created_at=now - timedelta(days=90),
        )
        auth_local = Authority(
            id=uuid.uuid4(),
            name="Central Division Police Station, Zone 3",
            type=AuthorityType.LOCAL,
            jurisdiction="Zone 3 Metro Police Station",
            parent_authority=auth_state,
            created_at=now - timedelta(days=90),
        )
        auth_state_pune = Authority(
            id=uuid.uuid4(),
            name="Pune Rural Crime Branch",
            type=AuthorityType.LOCAL,
            jurisdiction="Pune Rural Division",
            parent_authority=auth_state,
            created_at=now - timedelta(days=90),
        )
        db.add_all([auth_central, auth_state, auth_local, auth_state_pune])
        db.flush()

        # -------------------------------------------------------------
        # 2. RBAC: Roles & Permissions
        # -------------------------------------------------------------
        print("[*] Seeding RBAC Roles & Permissions...")
        perm_case_read = Permission(id=uuid.uuid4(), code="CASE_READ", description="View case dossiers and registry")
        perm_case_write = Permission(id=uuid.uuid4(), code="CASE_WRITE", description="Create and edit station cases")
        perm_evidence_upload = Permission(id=uuid.uuid4(), code="EVIDENCE_UPLOAD", description="Upload forensic files and extract entities")
        perm_link_review = Permission(id=uuid.uuid4(), code="LINK_REVIEW", description="Adjudicate AI missing link predictions")
        perm_data_request = Permission(id=uuid.uuid4(), code="DATA_REQUEST_MANAGE", description="Create and approve inter-agency data requests")
        perm_audit_view = Permission(id=uuid.uuid4(), code="AUDIT_VIEW", description="Inspect statutory station audit trail")
        
        db.add_all([
            perm_case_read, perm_case_write, perm_evidence_upload,
            perm_link_review, perm_data_request, perm_audit_view
        ])
        db.flush()

        role_sho = Role(id=uuid.uuid4(), name="STATION_HOUSE_OFFICER", description="Station commanding officer with full operational sign-off")
        role_sio = Role(id=uuid.uuid4(), name="LEAD_INVESTIGATOR", description="Senior Investigating Officer leading major cases")
        role_io = Role(id=uuid.uuid4(), name="INVESTIGATING_OFFICER", description="Field officer assigned to dossier evidence and entity review")
        
        role_sho.permissions.extend([perm_case_read, perm_case_write, perm_evidence_upload, perm_link_review, perm_data_request, perm_audit_view])
        role_sio.permissions.extend([perm_case_read, perm_case_write, perm_evidence_upload, perm_link_review, perm_data_request, perm_audit_view])
        role_io.permissions.extend([perm_case_read, perm_case_write, perm_evidence_upload, perm_link_review])

        db.add_all([role_sho, role_sio, role_io])
        db.flush()

        # -------------------------------------------------------------
        # 3. Users (Lead Officer & Station Team)
        # -------------------------------------------------------------
        print("[*] Seeding Station Officers...")
        user_vikram = User(
            id=uuid.uuid4(),
            keycloak_sub="usr-sub-vikram-4412",
            name="Insp. Vikram Deshmukh",
            email="vikram.deshmukh@police.zone3.gov.in",
            role="Senior Investigating Officer",
            badge_id="MH-POL-4412",
            authority_id=auth_local.id,
            role_id=role_sio.id,
            is_active=True,
            created_at=now - timedelta(days=90),
        )
        user_priya = User(
            id=uuid.uuid4(),
            keycloak_sub="usr-sub-priya-4418",
            name="Sub-Insp. Priya Shenoy",
            email="priya.shenoy@police.zone3.gov.in",
            role="Investigating Officer",
            badge_id="MH-POL-4418",
            authority_id=auth_local.id,
            role_id=role_io.id,
            is_active=True,
            created_at=now - timedelta(days=80),
        )
        user_ramesh = User(
            id=uuid.uuid4(),
            keycloak_sub="usr-sub-ramesh-4425",
            name="Asst. Sub-Insp. Ramesh G.",
            email="ramesh.g@police.zone3.gov.in",
            role="Field Intelligence Officer",
            badge_id="MH-POL-4425",
            authority_id=auth_local.id,
            role_id=role_io.id,
            is_active=True,
            created_at=now - timedelta(days=70),
        )
        user_sho = User(
            id=uuid.uuid4(),
            keycloak_sub="usr-sub-rathore-1002",
            name="DCP Arvind Rathore",
            email="arvind.rathore@police.zone3.gov.in",
            role="Station House Officer",
            badge_id="MH-POL-1002",
            authority_id=auth_local.id,
            role_id=role_sho.id,
            is_active=True,
            created_at=now - timedelta(days=120),
        )
        db.add_all([user_vikram, user_priya, user_ramesh, user_sho])
        db.flush()

        # -------------------------------------------------------------
        # 4. Cases (Frontend Exact Mock Numbers)
        # -------------------------------------------------------------
        print("[*] Seeding Station Cases...")
        case1 = Case(
            id=uuid.uuid4(),
            case_number="CASE-2026-0891",
            fir_number="FIR #18/26",
            title="Hawala Logistics & Shadow Syndicate",
            crime_type="Financial Crime / Syndicate Money Laundering",
            status=CaseStatus.UNDER_ANALYSIS,
            priority=PriorityLevel.CRITICAL,
            police_station="Central Division Police Station, Zone 3",
            location="Terminal 4, Dockyard Road, Zone 3",
            description="Investigation into layered cash transfers and mule accounts linked to freight import invoices in dock terminal 4.",
            investigating_officer_id=user_vikram.id,
            authority_id=auth_local.id,
            requires_attention=True,
            attention_reason="3 new system-derived telecom overlaps detected with active suspect Tariq Merchant.",
            created_at=now - timedelta(days=45),
        )

        case2 = Case(
            id=uuid.uuid4(),
            case_number="TRX-2026-0142",
            fir_number="FIR #42/26",
            title="Vehicle Theft Network",
            crime_type="Organized Vehicle Trafficking",
            status=CaseStatus.ACTIVE,
            priority=PriorityLevel.HIGH,
            police_station="Central Division Police Station, Zone 3",
            location="MIDC Sector 2, Zone 3",
            description="Interstate smuggling of stolen SUVs using forged RTO registrations and chassis number re-stamping.",
            investigating_officer_id=user_priya.id,
            authority_id=auth_local.id,
            requires_attention=True,
            attention_reason="Missing link analysis flagged an unregistered garage in MIDC area with high confidence correlation.",
            created_at=now - timedelta(days=32),
        )

        case3 = Case(
            id=uuid.uuid4(),
            case_number="TRX-2026-0137",
            fir_number="FIR #37/26",
            title="Organized Theft Syndicate",
            crime_type="Commercial Burglary",
            status=CaseStatus.UNDER_ANALYSIS,
            priority=PriorityLevel.HIGH,
            police_station="Central Division Police Station, Zone 3",
            location="APMC Yard Terminal B",
            description="Coordinated burglary across three container staging warehouses targeting industrial copper shipments.",
            investigating_officer_id=user_vikram.id,
            authority_id=auth_local.id,
            requires_attention=False,
            created_at=now - timedelta(days=28),
        )

        case4 = Case(
            id=uuid.uuid4(),
            case_number="CASE-2026-0744",
            fir_number="FIR #12/26",
            title="Interstate Luxury Vehicle Theft & Smuggling",
            crime_type="Organized Vehicle Trafficking",
            status=CaseStatus.ACTIVE,
            priority=PriorityLevel.HIGH,
            police_station="Central Division Police Station, Zone 3",
            location="Western Expressway Toll Gate",
            description="Tampered chassis numbers and forged RTO documents used to re-register stolen SUVs across state boundaries.",
            investigating_officer_id=user_priya.id,
            authority_id=auth_local.id,
            requires_attention=False,
            created_at=now - timedelta(days=40),
        )

        case5 = Case(
            id=uuid.uuid4(),
            case_number="CASE-2026-0612",
            fir_number="FIR #09/26",
            title="Cross-District Counterfeit Currency Distribution",
            crime_type="Counterfeit Currency Circulation",
            status=CaseStatus.UNDER_ANALYSIS,
            priority=PriorityLevel.HIGH,
            police_station="Central Division Police Station, Zone 3",
            location="APMC Market Vendor Hub",
            description="Circulation of high-grade fake notes through local APMC market vendors; serial numbers correlate with border seizure.",
            investigating_officer_id=user_vikram.id,
            authority_id=auth_local.id,
            requires_attention=False,
            created_at=now - timedelta(days=50),
        )

        case6 = Case(
            id=uuid.uuid4(),
            case_number="CASE-2026-0520",
            fir_number="FIR #99/25",
            title="Industrial Warehouse Burglary & Copper Theft",
            crime_type="Commercial Burglary",
            status=CaseStatus.ACTIVE,
            priority=PriorityLevel.MEDIUM,
            police_station="Central Division Police Station, Zone 3",
            location="Industrial Estate Plot 88",
            description="Theft of 8 tonnes of copper coils from logistics yard. GPS jammer recovered from gateway checkpoint.",
            investigating_officer_id=user_ramesh.id,
            authority_id=auth_local.id,
            requires_attention=True,
            attention_reason="Forensic CDR report uploaded by telecom nodal officer requires supervisor sign-off.",
            created_at=now - timedelta(days=60),
        )

        db.add_all([case1, case2, case3, case4, case5, case6])
        db.flush()

        # -------------------------------------------------------------
        # 5. Documents (Upload & Extract Wizard Step)
        # -------------------------------------------------------------
        print("[*] Seeding Forensic Documents & Upload Ledger...")
        doc1 = Document(
            id=uuid.uuid4(),
            case_id=case1.id,
            filename="FIR_18_2026_Initial_Complaint.pdf",
            file_type="PDF",
            storage_path="/data/cases/CASE-2026-0891/docs/FIR_18_2026.pdf",
            file_size_bytes=245760,
            processing_status=DocumentStatus.Processed,
            uploaded_by=user_vikram.id,
            created_at=now - timedelta(days=44),
        )
        doc2 = Document(
            id=uuid.uuid4(),
            case_id=case1.id,
            filename="CDR_Dump_98201_Jan_Feb2026.csv",
            file_type="CSV",
            storage_path="/data/cases/CASE-2026-0891/docs/CDR_Dump_98201.csv",
            file_size_bytes=1843200,
            processing_status=DocumentStatus.Processed,
            uploaded_by=user_vikram.id,
            created_at=now - timedelta(days=35),
        )
        doc3 = Document(
            id=uuid.uuid4(),
            case_id=case2.id,
            filename="RTO_Seizure_Memo_MH01CR8902.pdf",
            file_type="PDF",
            storage_path="/data/cases/TRX-2026-0142/docs/RTO_Seizure_Memo.pdf",
            file_size_bytes=320000,
            processing_status=DocumentStatus.Processed,
            uploaded_by=user_priya.id,
            created_at=now - timedelta(days=30),
        )
        db.add_all([doc1, doc2, doc3])
        db.flush()

        # -------------------------------------------------------------
        # 6. Extracted Entities (Review & Confirmation Wizard Step)
        # -------------------------------------------------------------
        print("[*] Seeding Extracted Entities...")
        ee1 = ExtractedEntity(
            id=uuid.uuid4(),
            document_id=doc1.id,
            case_id=case1.id,
            entity_type="PERSON",
            raw_value="Tariq Merchant",
            normalized_value="Tariq Merchant",
            confidence_score=0.98,
            confirmed=True,
            confirmed_by=user_vikram.id,
            rejected=False,
            created_at=now - timedelta(days=43),
        )
        ee2 = ExtractedEntity(
            id=uuid.uuid4(),
            document_id=doc2.id,
            case_id=case1.id,
            entity_type="PHONE",
            raw_value="+91 98201 55431",
            normalized_value="+919820155431",
            confidence_score=1.00,
            confirmed=True,
            confirmed_by=user_vikram.id,
            rejected=False,
            created_at=now - timedelta(days=34),
        )
        ee3 = ExtractedEntity(
            id=uuid.uuid4(),
            document_id=doc3.id,
            case_id=case2.id,
            entity_type="VEHICLE",
            raw_value="MH-01-CR-8902",
            normalized_value="MH01CR8902",
            confidence_score=0.99,
            confirmed=True,
            confirmed_by=user_priya.id,
            rejected=False,
            created_at=now - timedelta(days=29),
        )
        ee4 = ExtractedEntity(
            id=uuid.uuid4(),
            document_id=doc2.id,
            case_id=case1.id,
            entity_type="PERSON",
            raw_value="Farooq Chashmawala",
            normalized_value="Farooq Chashmawala",
            confidence_score=0.74,
            confirmed=False,
            confirmed_by=None,
            rejected=False,
            created_at=now - timedelta(days=34),
        )
        db.add_all([ee1, ee2, ee3, ee4])
        db.flush()

        # -------------------------------------------------------------
        # 7. Core Entities (Persons, Vehicles, Locations, Phones)
        # -------------------------------------------------------------
        print("[*] Seeding Core Intelligence Entities...")
        p1 = Person(
            id=uuid.uuid4(),
            person_id="PER-4401",
            full_name="Tariq Merchant",
            aliases=["Tariq Bhai", "T.M. Freight"],
            national_id="ABCDE1234F",
            date_of_birth=datetime(1982, 5, 14).date(),
            gender="MALE",
            status=PersonStatus.SUSPECT,
            risk_level=RiskLevel.HIGH,
            primary_address="Flat 402, Sea Breeze Heights, Dockyard Road, Mumbai",
            source_type=SourceType.VERIFIED_RECORD,
            source_document_id=doc1.id,
            evidence_basis=["FIR #18/26 Charge Record", "Passport Authority Database"],
            created_at=now - timedelta(days=43),
        )
        p2 = Person(
            id=uuid.uuid4(),
            person_id="PER-4402",
            full_name="Devendra Sawant",
            aliases=["Deva Boxer", "D.S."],
            national_id="FGHIJ5678K",
            date_of_birth=datetime(1986, 11, 20).date(),
            gender="MALE",
            status=PersonStatus.SUSPECT,
            risk_level=RiskLevel.ELEVATED,
            primary_address="Room 12, Chawl 4, MIDC Area, Pune",
            source_type=SourceType.VERIFIED_RECORD,
            source_document_id=doc1.id,
            evidence_basis=["Station Custody Ledger #441", "Seizure Memo 2026/08"],
            created_at=now - timedelta(days=40),
        )
        p3 = Person(
            id=uuid.uuid4(),
            person_id="PER-4403",
            full_name="Nilesh Kantilal Vora",
            aliases=["Kanti Bullion"],
            national_id="LMNOP9012Q",
            date_of_birth=datetime(1979, 3, 9).date(),
            gender="MALE",
            status=PersonStatus.PERSON_OF_INTEREST,
            risk_level=RiskLevel.STANDARD,
            primary_address="77 Bullion Bazar, Zaveri Chambers, Mumbai",
            source_type=SourceType.SYSTEM_DERIVED,
            source_document_id=doc2.id,
            evidence_basis=["Pattern matching cross-case trade bill settlement", "FIU Flag #8812"],
            created_at=now - timedelta(days=30),
        )
        db.add_all([p1, p2, p3])
        db.flush()

        v1 = Vehicle(
            id=uuid.uuid4(),
            plate_number="MH-01-CR-8902",
            make_model="Toyota Fortuner (Silver)",
            chassis_number="CH-MH01-2024-889104",
            owner_person_id=p1.id,
            source_type=SourceType.VERIFIED_RECORD,
            source_document_id=doc3.id,
            evidence_basis=["RTO Vahan Registration Gateway", "Toll Transponder ID #9901"],
            created_at=now - timedelta(days=40),
        )
        v2 = Vehicle(
            id=uuid.uuid4(),
            plate_number="MH-04-AX-5510",
            make_model="Mahindra Scorpio (White)",
            chassis_number="CH-MH04-2023-112048",
            owner_person_id=p2.id,
            source_type=SourceType.SYSTEM_DERIVED,
            source_document_id=None,
            evidence_basis=["CCTV ANPR Camera Toll Gate 3"],
            created_at=now - timedelta(days=25),
        )
        db.add_all([v1, v2])
        db.flush()

        l1 = Location(
            id=uuid.uuid4(),
            name="Al-Farooq Cold Storage Unit 4",
            address="Dockyard Road, Terminal Gate 3, Mumbai",
            city="Mumbai",
            state="Maharashtra",
            latitude=18.9612,
            longitude=72.8431,
            source_type=SourceType.SYSTEM_DERIVED,
            source_document_id=doc1.id,
            evidence_basis=["Utility Billing & Port Security Gatepass"],
            created_at=now - timedelta(days=42),
        )
        l2 = Location(
            id=uuid.uuid4(),
            name="Zaveri Vaults Safe Deposit",
            address="Kalbadevi Road, Gate 1, Mumbai",
            city="Mumbai",
            state="Maharashtra",
            latitude=18.9515,
            longitude=72.8311,
            source_type=SourceType.AI_ANALYSIS,
            source_document_id=None,
            evidence_basis=["Trade transaction settlement timing correlation"],
            created_at=now - timedelta(days=20),
        )
        db.add_all([l1, l2])
        db.flush()

        ph1 = PhoneNumber(
            id=uuid.uuid4(),
            phone_number="+91 98201 55431",
            subscriber_name="Tariq Merchant",
            telecom_carrier="Airtel Metro",
            associated_person_id=p1.id,
            source_type=SourceType.VERIFIED_RECORD,
            source_document_id=doc2.id,
            evidence_basis=["Airtel KYC CAF Form #44109"],
            created_at=now - timedelta(days=35),
        )
        ph2 = PhoneNumber(
            id=uuid.uuid4(),
            phone_number="+91 98209 88120",
            subscriber_name="Dockyard Burner SIM",
            telecom_carrier="Jio Corporate",
            associated_person_id=None,
            source_type=SourceType.SYSTEM_DERIVED,
            source_document_id=doc2.id,
            evidence_basis=["Cell Tower CDR Burst Contact with Tariq Merchant"],
            created_at=now - timedelta(days=35),
        )
        db.add_all([ph1, ph2])
        db.flush()

        # Connect entities to case1 and case2
        ce1 = CaseEntity(case_id=case1.id, entity_type="PERSON", entity_id="PER-4401", role_in_case="Primary Suspect", source_type=SourceType.VERIFIED_RECORD)
        ce2 = CaseEntity(case_id=case1.id, entity_type="PERSON", entity_id="PER-4402", role_in_case="Accomplice", source_type=SourceType.VERIFIED_RECORD)
        ce3 = CaseEntity(case_id=case1.id, entity_type="PERSON", entity_id="PER-4403", role_in_case="Person of Interest", source_type=SourceType.SYSTEM_DERIVED)
        ce4 = CaseEntity(case_id=case2.id, entity_type="VEHICLE", entity_id="MH-01-CR-8902", role_in_case="Recovered Smuggled Vehicle", source_type=SourceType.VERIFIED_RECORD)
        db.add_all([ce1, ce2, ce3, ce4])
        db.flush()

        # -------------------------------------------------------------
        # 8. Inter-Agency Data Requests & Shared Records
        # -------------------------------------------------------------
        print("[*] Seeding Data Requests & Shared Access Records...")
        dr1 = DataRequest(
            id=uuid.uuid4(),
            request_number="TRX-REQ-0184",
            requesting_authority_id=auth_local.id,
            source_authority_id=auth_state.id,
            requesting_officer_id=user_priya.id,
            case_id=case2.id,
            requested_info={
                "categories": ["Vehicle Impound Ledger", "CID Stolen Vehicle Alert"],
                "chassis_patterns": ["CH-MH01-2024*"],
                "jurisdictions": ["Pune Rural", "Thane District"]
            },
            reason="Inter-state chassis tampering correlation with Pune seizure memo. Required for charge sheet filing.",
            urgency=UrgencyLevel.HIGH,
            status=DataRequestStatus.Under_Review,
            access_duration="30 Days",
            created_at=now - timedelta(days=4),
        )

        dr2 = DataRequest(
            id=uuid.uuid4(),
            request_number="TRX-REQ-0181",
            requesting_authority_id=auth_local.id,
            source_authority_id=auth_central.id,
            requesting_officer_id=user_vikram.id,
            case_id=case1.id,
            requested_info={
                "categories": ["Tower Dump Triangulation", "IMEI Gateway Binding"],
                "target_numbers": ["+91 98209 88120"]
            },
            reason="SDR & tower dump triangulation for terminal gate 3 burner phone in syndicate money laundering case.",
            urgency=UrgencyLevel.HIGH,
            status=DataRequestStatus.Approved,
            access_duration="30 Days",
            created_at=now - timedelta(days=9),
        )

        dr3 = DataRequest(
            id=uuid.uuid4(),
            request_number="TRX-REQ-0177",
            requesting_authority_id=auth_local.id,
            source_authority_id=auth_central.id,
            requesting_officer_id=user_vikram.id,
            case_id=case1.id,
            requested_info={
                "categories": ["FIU Bullion Remitter Ledger"],
                "entity_name": "Kanti Bullion Traders"
            },
            reason="Cross-border bullion remitter ledger lookup for suspect trade clearing.",
            urgency=UrgencyLevel.ROUTINE,
            status=DataRequestStatus.Data_Sent,
            access_duration="30 Days",
            created_at=now - timedelta(days=14),
        )
        db.add_all([dr1, dr2, dr3])
        db.flush()

        sr1 = SharedRecord(
            id=uuid.uuid4(),
            data_request_id=dr3.id,
            record_type="FIU_CLEARING_LEDGER",
            record_id="FIU-2026-BUL-9812",
            record_metadata={
                "transaction_volume_inr": "48,500,000",
                "entities_flagged": 2,
                "transfer_channel": "HAWALA_SHADOW_CLEARING"
            },
            access_expiry=now + timedelta(days=16),
            shared_by=user_sho.id,
            created_at=now - timedelta(days=14),
        )
        db.add(sr1)
        db.flush()

        # -------------------------------------------------------------
        # 9. ML Predictions (Missing Link Analysis Screen)
        # -------------------------------------------------------------
        print("[*] Seeding ML Missing-Link Predictions...")
        pred1 = MLPrediction(
            id=uuid.uuid4(),
            case_id=case1.id,
            entity_a_id="PER-4401",
            entity_a_name="Tariq Merchant",
            entity_a_type="PERSON",
            entity_b_id="PER-4403",
            entity_b_name="Nilesh Kantilal Vora",
            entity_b_type="PERSON",
            model_name="tracex-link-gnn-v2",
            model_version="2.1.0",
            probability=0.88,
            calibrated_probability=0.84,
            evidence_strength=EvidenceStrength.Strong,
            connection_basis=[
                "3 informal settlement entries match Tariq's freight bill numbers exactly",
                "Devendra Sawant visited Zaveri Vaults 48h after large container arrival",
                "Shared telecom burst contacts logged via Dockyard Burner SIM"
            ],
            evidence_basis=[
                "FIU Ledger Extract #8812",
                "CCTV Unit Kalbadevi Gate",
                "CDR Triangulation Zone 3"
            ],
            shap_values={
                "fiu_ledger_match": 0.45,
                "co_presence_hours": 0.28,
                "common_associate_calls": 0.15,
                "geographic_proximity": 0.12
            },
            status=PredictionStatus.PENDING_REVIEW,
            created_at=now - timedelta(days=3),
        )

        pred2 = MLPrediction(
            id=uuid.uuid4(),
            case_id=case2.id,
            entity_a_id="PER-4402",
            entity_a_name="Devendra Sawant",
            entity_a_type="PERSON",
            entity_b_id="MH-01-CR-8902",
            entity_b_name="Silver Fortuner (MH-01-CR-8902)",
            entity_b_type="VEHICLE",
            model_name="tracex-vehicle-linker",
            model_version="1.4.0",
            probability=0.76,
            calibrated_probability=0.72,
            evidence_strength=EvidenceStrength.Moderate,
            connection_basis=[
                "Toll plaza scan sequence aligns with Devendra's cell tower location within 12 minutes",
                "Vehicle observed parked outside Devendra's residence chawl on 3 consecutive nights"
            ],
            evidence_basis=[
                "Fastag Transaction Log #MH01889",
                "Cell Tower CDR MIDC Sector 2"
            ],
            shap_values={
                "toll_cdr_coincidence": 0.52,
                "night_surveillance_sighting": 0.32,
                "past_conviction_overlap": 0.16
            },
            status=PredictionStatus.PENDING_REVIEW,
            created_at=now - timedelta(days=2),
        )
        db.add_all([pred1, pred2])
        db.flush()

        # -------------------------------------------------------------
        # 10. Audit Log (Station Activity Trail)
        # -------------------------------------------------------------
        print("[*] Seeding Append-Only Statutory Audit Log...")
        audit1 = AuditLog(
            id=uuid.uuid4(),
            user_id=user_vikram.id,
            action="CASE_WORKSPACE_OPENED",
            target_type="CASE",
            target_id="CASE-2026-0891",
            case_id=case1.id,
            metadata_payload={"officer": "Insp. Vikram Deshmukh", "station": "Zone 3", "mode": "WORKSPACE_VIEW"},
            ip_address="10.42.1.84",
            created_at=now - timedelta(hours=4),
        )
        audit2 = AuditLog(
            id=uuid.uuid4(),
            user_id=user_vikram.id,
            action="ML_PREDICTION_INSPECTED",
            target_type="ML_PREDICTION",
            target_id=str(pred1.id),
            case_id=case1.id,
            metadata_payload={"candidate_pair": "Tariq Merchant <-> Nilesh Vora", "evidence_strength": "Strong"},
            ip_address="10.42.1.84",
            created_at=now - timedelta(hours=3, minutes=15),
        )
        audit3 = AuditLog(
            id=uuid.uuid4(),
            user_id=user_priya.id,
            action="DATA_REQUISITION_SUBMITTED",
            target_type="DATA_REQUEST",
            target_id="TRX-REQ-0184",
            case_id=case2.id,
            metadata_payload={"target_agency": "State Police HQ CID", "urgency": "HIGH"},
            ip_address="10.42.1.92",
            created_at=now - timedelta(days=4),
        )
        audit4 = AuditLog(
            id=uuid.uuid4(),
            user_id=user_vikram.id,
            action="EXTERNAL_INTELLIGENCE_IMPORTED",
            target_type="SHARED_RECORD",
            target_id="FIU-2026-BUL-9812",
            case_id=case1.id,
            metadata_payload={"source": "Financial Intelligence Unit", "record_type": "FIU_CLEARING_LEDGER"},
            ip_address="10.42.1.84",
            created_at=now - timedelta(days=14),
        )
        db.add_all([audit1, audit2, audit3, audit4])
        db.flush()

        db.commit()
        print("[✓] TRACE-X database successfully seeded with all demo cases, entities, and audit trails!")

    except Exception as e:
        db.rollback()
        print(f"[!] Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
