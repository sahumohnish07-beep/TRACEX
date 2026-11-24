// ============================================================================
// TRACE-X Neo4j 5.x Baseline Seed Data
// Consistent with PostgreSQL Phase B seed & Frontend Cytoscape graph models
// Total Nodes: ~155 | Total Relationships: ~310
// ============================================================================

// ----------------------------------------------------------------------------
// 1. CASE NODES (6)
// ----------------------------------------------------------------------------
MERGE (c_CASE_2026_0891:Case {id: 'CASE-2026-0891'})
SET c_CASE_2026_0891.pg_id = 'case-uuid-0891',
    c_CASE_2026_0891.case_number = 'CASE-2026-0891',
    c_CASE_2026_0891.title = 'Hawala Logistics & Shadow Syndicate',
    c_CASE_2026_0891.label = 'CASE-2026-0891',
    c_CASE_2026_0891.sublabel = 'Hawala Logistics & Shadow Syndicate',
    c_CASE_2026_0891.crime_type = 'Financial Crime / Syndicate Money Laundering',
    c_CASE_2026_0891.priority = 'CRITICAL',
    c_CASE_2026_0891.status = 'UNDER_ANALYSIS',
    c_CASE_2026_0891.station = 'Central Division Police Station, Zone 3',
    c_CASE_2026_0891.date_opened = '2026-02-14',
    c_CASE_2026_0891.nodeType = 'CASE',
    c_CASE_2026_0891.source_type = 'VERIFIED_RECORD',
    c_CASE_2026_0891.verified = true;
MERGE (c_TRX_2026_0142:Case {id: 'TRX-2026-0142'})
SET c_TRX_2026_0142.pg_id = 'case-uuid-0142',
    c_TRX_2026_0142.case_number = 'TRX-2026-0142',
    c_TRX_2026_0142.title = 'Vehicle Theft Network',
    c_TRX_2026_0142.label = 'TRX-2026-0142',
    c_TRX_2026_0142.sublabel = 'Vehicle Theft Network',
    c_TRX_2026_0142.crime_type = 'Organized Vehicle Trafficking',
    c_TRX_2026_0142.priority = 'HIGH',
    c_TRX_2026_0142.status = 'ACTIVE',
    c_TRX_2026_0142.station = 'Central Division Police Station, Zone 3',
    c_TRX_2026_0142.date_opened = '2026-01-28',
    c_TRX_2026_0142.nodeType = 'CASE',
    c_TRX_2026_0142.source_type = 'VERIFIED_RECORD',
    c_TRX_2026_0142.verified = true;
MERGE (c_TRX_2026_0137:Case {id: 'TRX-2026-0137'})
SET c_TRX_2026_0137.pg_id = 'case-uuid-0137',
    c_TRX_2026_0137.case_number = 'TRX-2026-0137',
    c_TRX_2026_0137.title = 'Organized Theft Syndicate',
    c_TRX_2026_0137.label = 'TRX-2026-0137',
    c_TRX_2026_0137.sublabel = 'Organized Theft Syndicate',
    c_TRX_2026_0137.crime_type = 'Commercial Burglary',
    c_TRX_2026_0137.priority = 'HIGH',
    c_TRX_2026_0137.status = 'UNDER_ANALYSIS',
    c_TRX_2026_0137.station = 'Central Division Police Station, Zone 3',
    c_TRX_2026_0137.date_opened = '2026-02-01',
    c_TRX_2026_0137.nodeType = 'CASE',
    c_TRX_2026_0137.source_type = 'VERIFIED_RECORD',
    c_TRX_2026_0137.verified = true;
MERGE (c_CASE_2026_0744:Case {id: 'CASE-2026-0744'})
SET c_CASE_2026_0744.pg_id = 'case-uuid-0744',
    c_CASE_2026_0744.case_number = 'CASE-2026-0744',
    c_CASE_2026_0744.title = 'Interstate Luxury Vehicle Theft & Smuggling',
    c_CASE_2026_0744.label = 'CASE-2026-0744',
    c_CASE_2026_0744.sublabel = 'Interstate Luxury Vehicle Theft & Smuggling',
    c_CASE_2026_0744.crime_type = 'Organized Vehicle Trafficking',
    c_CASE_2026_0744.priority = 'HIGH',
    c_CASE_2026_0744.status = 'ACTIVE',
    c_CASE_2026_0744.station = 'Central Division Police Station, Zone 3',
    c_CASE_2026_0744.date_opened = '2026-01-20',
    c_CASE_2026_0744.nodeType = 'CASE',
    c_CASE_2026_0744.source_type = 'VERIFIED_RECORD',
    c_CASE_2026_0744.verified = true;
MERGE (c_CASE_2026_0612:Case {id: 'CASE-2026-0612'})
SET c_CASE_2026_0612.pg_id = 'case-uuid-0612',
    c_CASE_2026_0612.case_number = 'CASE-2026-0612',
    c_CASE_2026_0612.title = 'Cross-District Counterfeit Currency Distribution',
    c_CASE_2026_0612.label = 'CASE-2026-0612',
    c_CASE_2026_0612.sublabel = 'Cross-District Counterfeit Currency Distribution',
    c_CASE_2026_0612.crime_type = 'Counterfeit Currency Circulation',
    c_CASE_2026_0612.priority = 'HIGH',
    c_CASE_2026_0612.status = 'UNDER_ANALYSIS',
    c_CASE_2026_0612.station = 'Central Division Police Station, Zone 3',
    c_CASE_2026_0612.date_opened = '2026-01-08',
    c_CASE_2026_0612.nodeType = 'CASE',
    c_CASE_2026_0612.source_type = 'VERIFIED_RECORD',
    c_CASE_2026_0612.verified = true;
MERGE (c_CASE_2026_0520:Case {id: 'CASE-2026-0520'})
SET c_CASE_2026_0520.pg_id = 'case-uuid-0520',
    c_CASE_2026_0520.case_number = 'CASE-2026-0520',
    c_CASE_2026_0520.title = 'Industrial Warehouse Burglary & Copper Theft',
    c_CASE_2026_0520.label = 'CASE-2026-0520',
    c_CASE_2026_0520.sublabel = 'Industrial Warehouse Burglary & Copper Theft',
    c_CASE_2026_0520.crime_type = 'Commercial Burglary',
    c_CASE_2026_0520.priority = 'MEDIUM',
    c_CASE_2026_0520.status = 'ACTIVE',
    c_CASE_2026_0520.station = 'Central Division Police Station, Zone 3',
    c_CASE_2026_0520.date_opened = '2025-12-18',
    c_CASE_2026_0520.nodeType = 'CASE',
    c_CASE_2026_0520.source_type = 'VERIFIED_RECORD',
    c_CASE_2026_0520.verified = true;

// ----------------------------------------------------------------------------
// 2. PERSON NODES (55)
// ----------------------------------------------------------------------------
MERGE (p_PER_4401:Person {id: 'PER-4401'})
SET p_PER_4401.pg_id = 'per-uuid-4401',
    p_PER_4401.name = 'Tariq Merchant',
    p_PER_4401.label = 'Tariq Merchant',
    p_PER_4401.sublabel = 'Primary Suspect (Person A)',
    p_PER_4401.status = 'SUSPECT',
    p_PER_4401.risk_level = 'HIGH',
    p_PER_4401.national_id = 'ABCDE1234F',
    p_PER_4401.primary_address = 'Flat 402, Sea Breeze Heights, Dockyard Road, Mumbai',
    p_PER_4401.aliases = ["Tariq Bhai", "T.M. Freight", "Person A"],
    p_PER_4401.evidence_basis = ["FIR #18/26 Charge Record", "Passport Authority Database", "Court Seizure Warrant #14/26"],
    p_PER_4401.nodeType = 'PERSON',
    p_PER_4401.source_type = 'VERIFIED_RECORD',
    p_PER_4401.verified = true;
MERGE (p_PER_4402:Person {id: 'PER-4402'})
SET p_PER_4402.pg_id = 'per-uuid-4402',
    p_PER_4402.name = 'Devendra Sawant',
    p_PER_4402.label = 'Devendra Sawant',
    p_PER_4402.sublabel = 'Accomplice / Enforcer (Person B)',
    p_PER_4402.status = 'SUSPECT',
    p_PER_4402.risk_level = 'ELEVATED',
    p_PER_4402.national_id = 'FGHIJ5678K',
    p_PER_4402.primary_address = 'Room 12, Chawl 4, MIDC Area, Pune',
    p_PER_4402.aliases = ["Deva Boxer", "D.S.", "Person B"],
    p_PER_4402.evidence_basis = ["Station Custody Ledger #441", "Seizure Memo 2026/08"],
    p_PER_4402.nodeType = 'PERSON',
    p_PER_4402.source_type = 'VERIFIED_RECORD',
    p_PER_4402.verified = true;
MERGE (p_PER_4403:Person {id: 'PER-4403'})
SET p_PER_4403.pg_id = 'per-uuid-4403',
    p_PER_4403.name = 'Nilesh Kantilal Vora',
    p_PER_4403.label = 'Nilesh Kantilal Vora',
    p_PER_4403.sublabel = 'Bullion Intermediary (Person C)',
    p_PER_4403.status = 'PERSON_OF_INTEREST',
    p_PER_4403.risk_level = 'STANDARD',
    p_PER_4403.national_id = 'LMNOP9012Q',
    p_PER_4403.primary_address = '77 Bullion Bazar, Zaveri Chambers, Mumbai',
    p_PER_4403.aliases = ["Kanti Bullion", "Person C"],
    p_PER_4403.evidence_basis = ["Pattern matching cross-case trade bill settlement", "FIU Flag #8812"],
    p_PER_4403.nodeType = 'PERSON',
    p_PER_4403.source_type = 'SYSTEM_DERIVED',
    p_PER_4403.verified = false;
MERGE (p_PER_4409:Person {id: 'PER-4409'})
SET p_PER_4409.pg_id = 'per-uuid-4409',
    p_PER_4409.name = 'Farhan Qureshi',
    p_PER_4409.label = 'Farhan Qureshi',
    p_PER_4409.sublabel = 'Mule Account Holder (Person D)',
    p_PER_4409.status = 'PERSON_OF_INTEREST',
    p_PER_4409.risk_level = 'STANDARD',
    p_PER_4409.national_id = 'UVWXY3456Z',
    p_PER_4409.primary_address = 'Chawl No. 8, Kurla West, Mumbai',
    p_PER_4409.aliases = ["Farhan Mule", "Person D"],
    p_PER_4409.evidence_basis = ["Pattern similarity to verified mule network in Case #0419", "Rapid ATM cash dispersion"],
    p_PER_4409.nodeType = 'PERSON',
    p_PER_4409.source_type = 'AI_ANALYSIS',
    p_PER_4409.verified = false;
MERGE (p_PER_4410:Person {id: 'PER-4410'})
SET p_PER_4410.pg_id = 'per-uuid-4410',
    p_PER_4410.name = 'Imran Khan',
    p_PER_4410.label = 'Imran Khan',
    p_PER_4410.sublabel = 'Hawala Cash Courier (Person E)',
    p_PER_4410.status = 'SUSPECT',
    p_PER_4410.risk_level = 'HIGH',
    p_PER_4410.national_id = 'MUM8000K',
    p_PER_4410.primary_address = 'Sector 1, Metro Zone, Mumbai',
    p_PER_4410.aliases = ["Person E", "Imran Bhai"],
    p_PER_4410.evidence_basis = ["Intelligence dossier ref #TRX-INF-100", "Field observation log Zone 1"],
    p_PER_4410.nodeType = 'PERSON',
    p_PER_4410.source_type = 'VERIFIED_RECORD',
    p_PER_4410.verified = true;
MERGE (p_PER_4411:Person {id: 'PER-4411'})
SET p_PER_4411.pg_id = 'per-uuid-4411',
    p_PER_4411.name = 'Suresh Patil',
    p_PER_4411.label = 'Suresh Patil',
    p_PER_4411.sublabel = 'Dock Terminal Transporter (Person F)',
    p_PER_4411.status = 'ASSOCIATE',
    p_PER_4411.risk_level = 'STANDARD',
    p_PER_4411.national_id = 'MUM8001K',
    p_PER_4411.primary_address = 'Sector 2, Metro Zone, Mumbai',
    p_PER_4411.aliases = ["Person F", "Suresh Bhai"],
    p_PER_4411.evidence_basis = ["Intelligence dossier ref #TRX-INF-101", "Field observation log Zone 2"],
    p_PER_4411.nodeType = 'PERSON',
    p_PER_4411.source_type = 'AI_ANALYSIS',
    p_PER_4411.verified = false;
MERGE (p_PER_4412:Person {id: 'PER-4412'})
SET p_PER_4412.pg_id = 'per-uuid-4412',
    p_PER_4412.name = 'Ganesh Mhatre',
    p_PER_4412.label = 'Ganesh Mhatre',
    p_PER_4412.sublabel = 'Shell Company Director (Person G)',
    p_PER_4412.status = 'PERSON_OF_INTEREST',
    p_PER_4412.risk_level = 'ELEVATED',
    p_PER_4412.national_id = 'MUM8002K',
    p_PER_4412.primary_address = 'Sector 3, Metro Zone, Mumbai',
    p_PER_4412.aliases = ["Person G", "Ganesh Bhai"],
    p_PER_4412.evidence_basis = ["Intelligence dossier ref #TRX-INF-102", "Field observation log Zone 3"],
    p_PER_4412.nodeType = 'PERSON',
    p_PER_4412.source_type = 'SYSTEM_DERIVED',
    p_PER_4412.verified = false;
MERGE (p_PER_4413:Person {id: 'PER-4413'})
SET p_PER_4413.pg_id = 'per-uuid-4413',
    p_PER_4413.name = 'Rashid Siddiqui',
    p_PER_4413.label = 'Rashid Siddiqui',
    p_PER_4413.sublabel = 'RTO Forgery Agent (Person H)',
    p_PER_4413.status = 'SUSPECT',
    p_PER_4413.risk_level = 'STANDARD',
    p_PER_4413.national_id = 'MUM8003K',
    p_PER_4413.primary_address = 'Sector 4, Metro Zone, Mumbai',
    p_PER_4413.aliases = ["Person H", "Rashid Bhai"],
    p_PER_4413.evidence_basis = ["Intelligence dossier ref #TRX-INF-103", "Field observation log Zone 4"],
    p_PER_4413.nodeType = 'PERSON',
    p_PER_4413.source_type = 'VERIFIED_RECORD',
    p_PER_4413.verified = true;
MERGE (p_PER_4414:Person {id: 'PER-4414'})
SET p_PER_4414.pg_id = 'per-uuid-4414',
    p_PER_4414.name = 'Manoj Kadam',
    p_PER_4414.label = 'Manoj Kadam',
    p_PER_4414.sublabel = 'Chassis Tampering Mechanic (Person I)',
    p_PER_4414.status = 'PERSON_OF_INTEREST',
    p_PER_4414.risk_level = 'HIGH',
    p_PER_4414.national_id = 'MUM8004K',
    p_PER_4414.primary_address = 'Sector 5, Metro Zone, Mumbai',
    p_PER_4414.aliases = ["Person I", "Manoj Bhai"],
    p_PER_4414.evidence_basis = ["Intelligence dossier ref #TRX-INF-104", "Field observation log Zone 5"],
    p_PER_4414.nodeType = 'PERSON',
    p_PER_4414.source_type = 'SYSTEM_DERIVED',
    p_PER_4414.verified = false;
MERGE (p_PER_4415:Person {id: 'PER-4415'})
SET p_PER_4415.pg_id = 'per-uuid-4415',
    p_PER_4415.name = 'Aslam Bhamla',
    p_PER_4415.label = 'Aslam Bhamla',
    p_PER_4415.sublabel = 'Burner SIM Distributor (Person J)',
    p_PER_4415.status = 'ASSOCIATE',
    p_PER_4415.risk_level = 'STANDARD',
    p_PER_4415.national_id = 'MUM8005K',
    p_PER_4415.primary_address = 'Sector 6, Metro Zone, Mumbai',
    p_PER_4415.aliases = ["Person J", "Aslam Bhai"],
    p_PER_4415.evidence_basis = ["Intelligence dossier ref #TRX-INF-105", "Field observation log Zone 1"],
    p_PER_4415.nodeType = 'PERSON',
    p_PER_4415.source_type = 'AI_ANALYSIS',
    p_PER_4415.verified = false;
MERGE (p_PER_4416:Person {id: 'PER-4416'})
SET p_PER_4416.pg_id = 'per-uuid-4416',
    p_PER_4416.name = 'Vijay Salvi',
    p_PER_4416.label = 'Vijay Salvi',
    p_PER_4416.sublabel = 'Safehouse Custodian (Person K)',
    p_PER_4416.status = 'SUSPECT',
    p_PER_4416.risk_level = 'ELEVATED',
    p_PER_4416.national_id = 'MUM8006K',
    p_PER_4416.primary_address = 'Sector 7, Metro Zone, Mumbai',
    p_PER_4416.aliases = ["Person K", "Vijay Bhai"],
    p_PER_4416.evidence_basis = ["Intelligence dossier ref #TRX-INF-106", "Field observation log Zone 2"],
    p_PER_4416.nodeType = 'PERSON',
    p_PER_4416.source_type = 'VERIFIED_RECORD',
    p_PER_4416.verified = true;
MERGE (p_PER_4417:Person {id: 'PER-4417'})
SET p_PER_4417.pg_id = 'per-uuid-4417',
    p_PER_4417.name = 'Sunil Shinde',
    p_PER_4417.label = 'Sunil Shinde',
    p_PER_4417.sublabel = 'Customs Clearing Broker (Person L)',
    p_PER_4417.status = 'ASSOCIATE',
    p_PER_4417.risk_level = 'STANDARD',
    p_PER_4417.national_id = 'MUM8007K',
    p_PER_4417.primary_address = 'Sector 8, Metro Zone, Mumbai',
    p_PER_4417.aliases = ["Person L", "Sunil Bhai"],
    p_PER_4417.evidence_basis = ["Intelligence dossier ref #TRX-INF-107", "Field observation log Zone 3"],
    p_PER_4417.nodeType = 'PERSON',
    p_PER_4417.source_type = 'AI_ANALYSIS',
    p_PER_4417.verified = false;
MERGE (p_PER_4418:Person {id: 'PER-4418'})
SET p_PER_4418.pg_id = 'per-uuid-4418',
    p_PER_4418.name = 'Altaf Patel',
    p_PER_4418.label = 'Altaf Patel',
    p_PER_4418.sublabel = 'Informal Trade Bookkeeper (Person M)',
    p_PER_4418.status = 'PERSON_OF_INTEREST',
    p_PER_4418.risk_level = 'HIGH',
    p_PER_4418.national_id = 'MUM8008K',
    p_PER_4418.primary_address = 'Sector 9, Metro Zone, Mumbai',
    p_PER_4418.aliases = ["Person M", "Altaf Bhai"],
    p_PER_4418.evidence_basis = ["Intelligence dossier ref #TRX-INF-108", "Field observation log Zone 4"],
    p_PER_4418.nodeType = 'PERSON',
    p_PER_4418.source_type = 'SYSTEM_DERIVED',
    p_PER_4418.verified = false;
MERGE (p_PER_4419:Person {id: 'PER-4419'})
SET p_PER_4419.pg_id = 'per-uuid-4419',
    p_PER_4419.name = 'Anand More',
    p_PER_4419.label = 'Anand More',
    p_PER_4419.sublabel = 'Warehouse Watchman (Person N)',
    p_PER_4419.status = 'SUSPECT',
    p_PER_4419.risk_level = 'STANDARD',
    p_PER_4419.national_id = 'MUM8009K',
    p_PER_4419.primary_address = 'Sector 10, Metro Zone, Mumbai',
    p_PER_4419.aliases = ["Person N", "Anand Bhai"],
    p_PER_4419.evidence_basis = ["Intelligence dossier ref #TRX-INF-109", "Field observation log Zone 5"],
    p_PER_4419.nodeType = 'PERSON',
    p_PER_4419.source_type = 'VERIFIED_RECORD',
    p_PER_4419.verified = true;
MERGE (p_PER_4420:Person {id: 'PER-4420'})
SET p_PER_4420.pg_id = 'per-uuid-4420',
    p_PER_4420.name = 'Pravin Jadhav',
    p_PER_4420.label = 'Pravin Jadhav',
    p_PER_4420.sublabel = 'Logistics Fleet Dispatcher (Person O)',
    p_PER_4420.status = 'PERSON_OF_INTEREST',
    p_PER_4420.risk_level = 'ELEVATED',
    p_PER_4420.national_id = 'MUM8010K',
    p_PER_4420.primary_address = 'Sector 1, Metro Zone, Mumbai',
    p_PER_4420.aliases = ["Person O", "Pravin Bhai"],
    p_PER_4420.evidence_basis = ["Intelligence dossier ref #TRX-INF-110", "Field observation log Zone 1"],
    p_PER_4420.nodeType = 'PERSON',
    p_PER_4420.source_type = 'SYSTEM_DERIVED',
    p_PER_4420.verified = false;
MERGE (p_PER_4421:Person {id: 'PER-4421'})
SET p_PER_4421.pg_id = 'per-uuid-4421',
    p_PER_4421.name = 'Rafiq Memon',
    p_PER_4421.label = 'Rafiq Memon',
    p_PER_4421.sublabel = 'Mule Account Recruiter (Person P)',
    p_PER_4421.status = 'ASSOCIATE',
    p_PER_4421.risk_level = 'STANDARD',
    p_PER_4421.national_id = 'MUM8011K',
    p_PER_4421.primary_address = 'Sector 2, Metro Zone, Mumbai',
    p_PER_4421.aliases = ["Person P", "Rafiq Bhai"],
    p_PER_4421.evidence_basis = ["Intelligence dossier ref #TRX-INF-111", "Field observation log Zone 2"],
    p_PER_4421.nodeType = 'PERSON',
    p_PER_4421.source_type = 'AI_ANALYSIS',
    p_PER_4421.verified = false;
MERGE (p_PER_4422:Person {id: 'PER-4422'})
SET p_PER_4422.pg_id = 'per-uuid-4422',
    p_PER_4422.name = 'Sachin Tambe',
    p_PER_4422.label = 'Sachin Tambe',
    p_PER_4422.sublabel = 'Hawala Cash Courier (Person Q)',
    p_PER_4422.status = 'SUSPECT',
    p_PER_4422.risk_level = 'HIGH',
    p_PER_4422.national_id = 'MUM8012K',
    p_PER_4422.primary_address = 'Sector 3, Metro Zone, Mumbai',
    p_PER_4422.aliases = ["Person Q", "Sachin Bhai"],
    p_PER_4422.evidence_basis = ["Intelligence dossier ref #TRX-INF-112", "Field observation log Zone 3"],
    p_PER_4422.nodeType = 'PERSON',
    p_PER_4422.source_type = 'VERIFIED_RECORD',
    p_PER_4422.verified = true;
MERGE (p_PER_4423:Person {id: 'PER-4423'})
SET p_PER_4423.pg_id = 'per-uuid-4423',
    p_PER_4423.name = 'Javed Shaikh',
    p_PER_4423.label = 'Javed Shaikh',
    p_PER_4423.sublabel = 'Dock Terminal Transporter (Person R)',
    p_PER_4423.status = 'ASSOCIATE',
    p_PER_4423.risk_level = 'STANDARD',
    p_PER_4423.national_id = 'MUM8013K',
    p_PER_4423.primary_address = 'Sector 4, Metro Zone, Mumbai',
    p_PER_4423.aliases = ["Person R", "Javed Bhai"],
    p_PER_4423.evidence_basis = ["Intelligence dossier ref #TRX-INF-113", "Field observation log Zone 4"],
    p_PER_4423.nodeType = 'PERSON',
    p_PER_4423.source_type = 'AI_ANALYSIS',
    p_PER_4423.verified = false;
MERGE (p_PER_4424:Person {id: 'PER-4424'})
SET p_PER_4424.pg_id = 'per-uuid-4424',
    p_PER_4424.name = 'Dilip Sawant',
    p_PER_4424.label = 'Dilip Sawant',
    p_PER_4424.sublabel = 'Shell Company Director (Person S)',
    p_PER_4424.status = 'PERSON_OF_INTEREST',
    p_PER_4424.risk_level = 'ELEVATED',
    p_PER_4424.national_id = 'MUM8014K',
    p_PER_4424.primary_address = 'Sector 5, Metro Zone, Mumbai',
    p_PER_4424.aliases = ["Person S", "Dilip Bhai"],
    p_PER_4424.evidence_basis = ["Intelligence dossier ref #TRX-INF-114", "Field observation log Zone 5"],
    p_PER_4424.nodeType = 'PERSON',
    p_PER_4424.source_type = 'SYSTEM_DERIVED',
    p_PER_4424.verified = false;
MERGE (p_PER_4425:Person {id: 'PER-4425'})
SET p_PER_4425.pg_id = 'per-uuid-4425',
    p_PER_4425.name = 'Nadeem Sayed',
    p_PER_4425.label = 'Nadeem Sayed',
    p_PER_4425.sublabel = 'RTO Forgery Agent (Person T)',
    p_PER_4425.status = 'SUSPECT',
    p_PER_4425.risk_level = 'STANDARD',
    p_PER_4425.national_id = 'MUM8015K',
    p_PER_4425.primary_address = 'Sector 6, Metro Zone, Mumbai',
    p_PER_4425.aliases = ["Person T", "Nadeem Bhai"],
    p_PER_4425.evidence_basis = ["Intelligence dossier ref #TRX-INF-115", "Field observation log Zone 1"],
    p_PER_4425.nodeType = 'PERSON',
    p_PER_4425.source_type = 'VERIFIED_RECORD',
    p_PER_4425.verified = true;
MERGE (p_PER_4426:Person {id: 'PER-4426'})
SET p_PER_4426.pg_id = 'per-uuid-4426',
    p_PER_4426.name = 'Kishore Pawar',
    p_PER_4426.label = 'Kishore Pawar',
    p_PER_4426.sublabel = 'Chassis Tampering Mechanic (Person U)',
    p_PER_4426.status = 'PERSON_OF_INTEREST',
    p_PER_4426.risk_level = 'HIGH',
    p_PER_4426.national_id = 'MUM8016K',
    p_PER_4426.primary_address = 'Sector 7, Metro Zone, Mumbai',
    p_PER_4426.aliases = ["Person U", "Kishore Bhai"],
    p_PER_4426.evidence_basis = ["Intelligence dossier ref #TRX-INF-116", "Field observation log Zone 2"],
    p_PER_4426.nodeType = 'PERSON',
    p_PER_4426.source_type = 'SYSTEM_DERIVED',
    p_PER_4426.verified = false;
MERGE (p_PER_4427:Person {id: 'PER-4427'})
SET p_PER_4427.pg_id = 'per-uuid-4427',
    p_PER_4427.name = 'Irfan Ansari',
    p_PER_4427.label = 'Irfan Ansari',
    p_PER_4427.sublabel = 'Burner SIM Distributor (Person V)',
    p_PER_4427.status = 'ASSOCIATE',
    p_PER_4427.risk_level = 'STANDARD',
    p_PER_4427.national_id = 'MUM8017K',
    p_PER_4427.primary_address = 'Sector 8, Metro Zone, Mumbai',
    p_PER_4427.aliases = ["Person V", "Irfan Bhai"],
    p_PER_4427.evidence_basis = ["Intelligence dossier ref #TRX-INF-117", "Field observation log Zone 3"],
    p_PER_4427.nodeType = 'PERSON',
    p_PER_4427.source_type = 'AI_ANALYSIS',
    p_PER_4427.verified = false;
MERGE (p_PER_4428:Person {id: 'PER-4428'})
SET p_PER_4428.pg_id = 'per-uuid-4428',
    p_PER_4428.name = 'Vinod Kamble',
    p_PER_4428.label = 'Vinod Kamble',
    p_PER_4428.sublabel = 'Safehouse Custodian (Person W)',
    p_PER_4428.status = 'SUSPECT',
    p_PER_4428.risk_level = 'ELEVATED',
    p_PER_4428.national_id = 'MUM8018K',
    p_PER_4428.primary_address = 'Sector 9, Metro Zone, Mumbai',
    p_PER_4428.aliases = ["Person W", "Vinod Bhai"],
    p_PER_4428.evidence_basis = ["Intelligence dossier ref #TRX-INF-118", "Field observation log Zone 4"],
    p_PER_4428.nodeType = 'PERSON',
    p_PER_4428.source_type = 'VERIFIED_RECORD',
    p_PER_4428.verified = true;
MERGE (p_PER_4429:Person {id: 'PER-4429'})
SET p_PER_4429.pg_id = 'per-uuid-4429',
    p_PER_4429.name = 'Zubair Qureshi',
    p_PER_4429.label = 'Zubair Qureshi',
    p_PER_4429.sublabel = 'Customs Clearing Broker (Person X)',
    p_PER_4429.status = 'ASSOCIATE',
    p_PER_4429.risk_level = 'STANDARD',
    p_PER_4429.national_id = 'MUM8019K',
    p_PER_4429.primary_address = 'Sector 10, Metro Zone, Mumbai',
    p_PER_4429.aliases = ["Person X", "Zubair Bhai"],
    p_PER_4429.evidence_basis = ["Intelligence dossier ref #TRX-INF-119", "Field observation log Zone 5"],
    p_PER_4429.nodeType = 'PERSON',
    p_PER_4429.source_type = 'AI_ANALYSIS',
    p_PER_4429.verified = false;
MERGE (p_PER_4430:Person {id: 'PER-4430'})
SET p_PER_4430.pg_id = 'per-uuid-4430',
    p_PER_4430.name = 'Prashant Rane',
    p_PER_4430.label = 'Prashant Rane',
    p_PER_4430.sublabel = 'Informal Trade Bookkeeper (Person Y)',
    p_PER_4430.status = 'PERSON_OF_INTEREST',
    p_PER_4430.risk_level = 'HIGH',
    p_PER_4430.national_id = 'MUM8020K',
    p_PER_4430.primary_address = 'Sector 1, Metro Zone, Mumbai',
    p_PER_4430.aliases = ["Person Y", "Prashant Bhai"],
    p_PER_4430.evidence_basis = ["Intelligence dossier ref #TRX-INF-120", "Field observation log Zone 1"],
    p_PER_4430.nodeType = 'PERSON',
    p_PER_4430.source_type = 'SYSTEM_DERIVED',
    p_PER_4430.verified = false;
MERGE (p_PER_4431:Person {id: 'PER-4431'})
SET p_PER_4431.pg_id = 'per-uuid-4431',
    p_PER_4431.name = 'Bilal Merchant',
    p_PER_4431.label = 'Bilal Merchant',
    p_PER_4431.sublabel = 'Warehouse Watchman (Person Z)',
    p_PER_4431.status = 'SUSPECT',
    p_PER_4431.risk_level = 'STANDARD',
    p_PER_4431.national_id = 'MUM8021K',
    p_PER_4431.primary_address = 'Sector 2, Metro Zone, Mumbai',
    p_PER_4431.aliases = ["Person Z", "Bilal Bhai"],
    p_PER_4431.evidence_basis = ["Intelligence dossier ref #TRX-INF-121", "Field observation log Zone 2"],
    p_PER_4431.nodeType = 'PERSON',
    p_PER_4431.source_type = 'VERIFIED_RECORD',
    p_PER_4431.verified = true;
MERGE (p_PER_4432:Person {id: 'PER-4432'})
SET p_PER_4432.pg_id = 'per-uuid-4432',
    p_PER_4432.name = 'Ashok Gaikwad',
    p_PER_4432.label = 'Ashok Gaikwad',
    p_PER_4432.sublabel = 'Logistics Fleet Dispatcher (Person AA)',
    p_PER_4432.status = 'PERSON_OF_INTEREST',
    p_PER_4432.risk_level = 'ELEVATED',
    p_PER_4432.national_id = 'MUM8022K',
    p_PER_4432.primary_address = 'Sector 3, Metro Zone, Mumbai',
    p_PER_4432.aliases = ["Person AA", "Ashok Bhai"],
    p_PER_4432.evidence_basis = ["Intelligence dossier ref #TRX-INF-122", "Field observation log Zone 3"],
    p_PER_4432.nodeType = 'PERSON',
    p_PER_4432.source_type = 'SYSTEM_DERIVED',
    p_PER_4432.verified = false;
MERGE (p_PER_4433:Person {id: 'PER-4433'})
SET p_PER_4433.pg_id = 'per-uuid-4433',
    p_PER_4433.name = 'Shoaib Malik',
    p_PER_4433.label = 'Shoaib Malik',
    p_PER_4433.sublabel = 'Mule Account Recruiter (Person AB)',
    p_PER_4433.status = 'ASSOCIATE',
    p_PER_4433.risk_level = 'STANDARD',
    p_PER_4433.national_id = 'MUM8023K',
    p_PER_4433.primary_address = 'Sector 4, Metro Zone, Mumbai',
    p_PER_4433.aliases = ["Person AB", "Shoaib Bhai"],
    p_PER_4433.evidence_basis = ["Intelligence dossier ref #TRX-INF-123", "Field observation log Zone 4"],
    p_PER_4433.nodeType = 'PERSON',
    p_PER_4433.source_type = 'AI_ANALYSIS',
    p_PER_4433.verified = false;
MERGE (p_PER_4434:Person {id: 'PER-4434'})
SET p_PER_4434.pg_id = 'per-uuid-4434',
    p_PER_4434.name = 'Sanjay Parab',
    p_PER_4434.label = 'Sanjay Parab',
    p_PER_4434.sublabel = 'Hawala Cash Courier (Person AC)',
    p_PER_4434.status = 'SUSPECT',
    p_PER_4434.risk_level = 'HIGH',
    p_PER_4434.national_id = 'MUM8024K',
    p_PER_4434.primary_address = 'Sector 5, Metro Zone, Mumbai',
    p_PER_4434.aliases = ["Person AC", "Sanjay Bhai"],
    p_PER_4434.evidence_basis = ["Intelligence dossier ref #TRX-INF-124", "Field observation log Zone 5"],
    p_PER_4434.nodeType = 'PERSON',
    p_PER_4434.source_type = 'VERIFIED_RECORD',
    p_PER_4434.verified = true;
MERGE (p_PER_4435:Person {id: 'PER-4435'})
SET p_PER_4435.pg_id = 'per-uuid-4435',
    p_PER_4435.name = 'Yusuf Batata',
    p_PER_4435.label = 'Yusuf Batata',
    p_PER_4435.sublabel = 'Dock Terminal Transporter (Person AD)',
    p_PER_4435.status = 'ASSOCIATE',
    p_PER_4435.risk_level = 'STANDARD',
    p_PER_4435.national_id = 'MUM8025K',
    p_PER_4435.primary_address = 'Sector 6, Metro Zone, Mumbai',
    p_PER_4435.aliases = ["Person AD", "Yusuf Bhai"],
    p_PER_4435.evidence_basis = ["Intelligence dossier ref #TRX-INF-125", "Field observation log Zone 1"],
    p_PER_4435.nodeType = 'PERSON',
    p_PER_4435.source_type = 'AI_ANALYSIS',
    p_PER_4435.verified = false;
MERGE (p_PER_4436:Person {id: 'PER-4436'})
SET p_PER_4436.pg_id = 'per-uuid-4436',
    p_PER_4436.name = 'Rajesh Ghate',
    p_PER_4436.label = 'Rajesh Ghate',
    p_PER_4436.sublabel = 'Shell Company Director (Person AE)',
    p_PER_4436.status = 'PERSON_OF_INTEREST',
    p_PER_4436.risk_level = 'ELEVATED',
    p_PER_4436.national_id = 'MUM8026K',
    p_PER_4436.primary_address = 'Sector 7, Metro Zone, Mumbai',
    p_PER_4436.aliases = ["Person AE", "Rajesh Bhai"],
    p_PER_4436.evidence_basis = ["Intelligence dossier ref #TRX-INF-126", "Field observation log Zone 2"],
    p_PER_4436.nodeType = 'PERSON',
    p_PER_4436.source_type = 'SYSTEM_DERIVED',
    p_PER_4436.verified = false;
MERGE (p_PER_4437:Person {id: 'PER-4437'})
SET p_PER_4437.pg_id = 'per-uuid-4437',
    p_PER_4437.name = 'Haroon Rasheed',
    p_PER_4437.label = 'Haroon Rasheed',
    p_PER_4437.sublabel = 'RTO Forgery Agent (Person AF)',
    p_PER_4437.status = 'SUSPECT',
    p_PER_4437.risk_level = 'STANDARD',
    p_PER_4437.national_id = 'MUM8027K',
    p_PER_4437.primary_address = 'Sector 8, Metro Zone, Mumbai',
    p_PER_4437.aliases = ["Person AF", "Haroon Bhai"],
    p_PER_4437.evidence_basis = ["Intelligence dossier ref #TRX-INF-127", "Field observation log Zone 3"],
    p_PER_4437.nodeType = 'PERSON',
    p_PER_4437.source_type = 'VERIFIED_RECORD',
    p_PER_4437.verified = true;
MERGE (p_PER_4438:Person {id: 'PER-4438'})
SET p_PER_4438.pg_id = 'per-uuid-4438',
    p_PER_4438.name = 'Mahesh Thorat',
    p_PER_4438.label = 'Mahesh Thorat',
    p_PER_4438.sublabel = 'Chassis Tampering Mechanic (Person AG)',
    p_PER_4438.status = 'PERSON_OF_INTEREST',
    p_PER_4438.risk_level = 'HIGH',
    p_PER_4438.national_id = 'MUM8028K',
    p_PER_4438.primary_address = 'Sector 9, Metro Zone, Mumbai',
    p_PER_4438.aliases = ["Person AG", "Mahesh Bhai"],
    p_PER_4438.evidence_basis = ["Intelligence dossier ref #TRX-INF-128", "Field observation log Zone 4"],
    p_PER_4438.nodeType = 'PERSON',
    p_PER_4438.source_type = 'SYSTEM_DERIVED',
    p_PER_4438.verified = false;
MERGE (p_PER_4439:Person {id: 'PER-4439'})
SET p_PER_4439.pg_id = 'per-uuid-4439',
    p_PER_4439.name = 'Sameer Chogle',
    p_PER_4439.label = 'Sameer Chogle',
    p_PER_4439.sublabel = 'Burner SIM Distributor (Person AH)',
    p_PER_4439.status = 'ASSOCIATE',
    p_PER_4439.risk_level = 'STANDARD',
    p_PER_4439.national_id = 'MUM8029K',
    p_PER_4439.primary_address = 'Sector 10, Metro Zone, Mumbai',
    p_PER_4439.aliases = ["Person AH", "Sameer Bhai"],
    p_PER_4439.evidence_basis = ["Intelligence dossier ref #TRX-INF-129", "Field observation log Zone 5"],
    p_PER_4439.nodeType = 'PERSON',
    p_PER_4439.source_type = 'AI_ANALYSIS',
    p_PER_4439.verified = false;
MERGE (p_PER_4440:Person {id: 'PER-4440'})
SET p_PER_4440.pg_id = 'per-uuid-4440',
    p_PER_4440.name = 'Nitin Bagwe',
    p_PER_4440.label = 'Nitin Bagwe',
    p_PER_4440.sublabel = 'Safehouse Custodian (Person AI)',
    p_PER_4440.status = 'SUSPECT',
    p_PER_4440.risk_level = 'ELEVATED',
    p_PER_4440.national_id = 'MUM8030K',
    p_PER_4440.primary_address = 'Sector 1, Metro Zone, Mumbai',
    p_PER_4440.aliases = ["Person AI", "Nitin Bhai"],
    p_PER_4440.evidence_basis = ["Intelligence dossier ref #TRX-INF-130", "Field observation log Zone 1"],
    p_PER_4440.nodeType = 'PERSON',
    p_PER_4440.source_type = 'VERIFIED_RECORD',
    p_PER_4440.verified = true;
MERGE (p_PER_4441:Person {id: 'PER-4441'})
SET p_PER_4441.pg_id = 'per-uuid-4441',
    p_PER_4441.name = 'Rizwan Kazi',
    p_PER_4441.label = 'Rizwan Kazi',
    p_PER_4441.sublabel = 'Customs Clearing Broker (Person AJ)',
    p_PER_4441.status = 'ASSOCIATE',
    p_PER_4441.risk_level = 'STANDARD',
    p_PER_4441.national_id = 'MUM8031K',
    p_PER_4441.primary_address = 'Sector 2, Metro Zone, Mumbai',
    p_PER_4441.aliases = ["Person AJ", "Rizwan Bhai"],
    p_PER_4441.evidence_basis = ["Intelligence dossier ref #TRX-INF-131", "Field observation log Zone 2"],
    p_PER_4441.nodeType = 'PERSON',
    p_PER_4441.source_type = 'AI_ANALYSIS',
    p_PER_4441.verified = false;
MERGE (p_PER_4442:Person {id: 'PER-4442'})
SET p_PER_4442.pg_id = 'per-uuid-4442',
    p_PER_4442.name = 'Gautam Surana',
    p_PER_4442.label = 'Gautam Surana',
    p_PER_4442.sublabel = 'Informal Trade Bookkeeper (Person AK)',
    p_PER_4442.status = 'PERSON_OF_INTEREST',
    p_PER_4442.risk_level = 'HIGH',
    p_PER_4442.national_id = 'MUM8032K',
    p_PER_4442.primary_address = 'Sector 3, Metro Zone, Mumbai',
    p_PER_4442.aliases = ["Person AK", "Gautam Bhai"],
    p_PER_4442.evidence_basis = ["Intelligence dossier ref #TRX-INF-132", "Field observation log Zone 3"],
    p_PER_4442.nodeType = 'PERSON',
    p_PER_4442.source_type = 'SYSTEM_DERIVED',
    p_PER_4442.verified = false;
MERGE (p_PER_4443:Person {id: 'PER-4443'})
SET p_PER_4443.pg_id = 'per-uuid-4443',
    p_PER_4443.name = 'Aijaz Kashmiri',
    p_PER_4443.label = 'Aijaz Kashmiri',
    p_PER_4443.sublabel = 'Warehouse Watchman (Person AL)',
    p_PER_4443.status = 'SUSPECT',
    p_PER_4443.risk_level = 'STANDARD',
    p_PER_4443.national_id = 'MUM8033K',
    p_PER_4443.primary_address = 'Sector 4, Metro Zone, Mumbai',
    p_PER_4443.aliases = ["Person AL", "Aijaz Bhai"],
    p_PER_4443.evidence_basis = ["Intelligence dossier ref #TRX-INF-133", "Field observation log Zone 4"],
    p_PER_4443.nodeType = 'PERSON',
    p_PER_4443.source_type = 'VERIFIED_RECORD',
    p_PER_4443.verified = true;
MERGE (p_PER_4444:Person {id: 'PER-4444'})
SET p_PER_4444.pg_id = 'per-uuid-4444',
    p_PER_4444.name = 'Dinesh Kulkarni',
    p_PER_4444.label = 'Dinesh Kulkarni',
    p_PER_4444.sublabel = 'Logistics Fleet Dispatcher (Person AM)',
    p_PER_4444.status = 'PERSON_OF_INTEREST',
    p_PER_4444.risk_level = 'ELEVATED',
    p_PER_4444.national_id = 'MUM8034K',
    p_PER_4444.primary_address = 'Sector 5, Metro Zone, Mumbai',
    p_PER_4444.aliases = ["Person AM", "Dinesh Bhai"],
    p_PER_4444.evidence_basis = ["Intelligence dossier ref #TRX-INF-134", "Field observation log Zone 5"],
    p_PER_4444.nodeType = 'PERSON',
    p_PER_4444.source_type = 'SYSTEM_DERIVED',
    p_PER_4444.verified = false;
MERGE (p_PER_4445:Person {id: 'PER-4445'})
SET p_PER_4445.pg_id = 'per-uuid-4445',
    p_PER_4445.name = 'Waseem Akram',
    p_PER_4445.label = 'Waseem Akram',
    p_PER_4445.sublabel = 'Mule Account Recruiter (Person AN)',
    p_PER_4445.status = 'ASSOCIATE',
    p_PER_4445.risk_level = 'STANDARD',
    p_PER_4445.national_id = 'MUM8035K',
    p_PER_4445.primary_address = 'Sector 6, Metro Zone, Mumbai',
    p_PER_4445.aliases = ["Person AN", "Waseem Bhai"],
    p_PER_4445.evidence_basis = ["Intelligence dossier ref #TRX-INF-135", "Field observation log Zone 1"],
    p_PER_4445.nodeType = 'PERSON',
    p_PER_4445.source_type = 'AI_ANALYSIS',
    p_PER_4445.verified = false;
MERGE (p_PER_4446:Person {id: 'PER-4446'})
SET p_PER_4446.pg_id = 'per-uuid-4446',
    p_PER_4446.name = 'Ravindra Bhosale',
    p_PER_4446.label = 'Ravindra Bhosale',
    p_PER_4446.sublabel = 'Hawala Cash Courier (Person AO)',
    p_PER_4446.status = 'SUSPECT',
    p_PER_4446.risk_level = 'HIGH',
    p_PER_4446.national_id = 'MUM8036K',
    p_PER_4446.primary_address = 'Sector 7, Metro Zone, Mumbai',
    p_PER_4446.aliases = ["Person AO", "Ravindra Bhai"],
    p_PER_4446.evidence_basis = ["Intelligence dossier ref #TRX-INF-136", "Field observation log Zone 2"],
    p_PER_4446.nodeType = 'PERSON',
    p_PER_4446.source_type = 'VERIFIED_RECORD',
    p_PER_4446.verified = true;
MERGE (p_PER_4447:Person {id: 'PER-4447'})
SET p_PER_4447.pg_id = 'per-uuid-4447',
    p_PER_4447.name = 'Tanveer Alam',
    p_PER_4447.label = 'Tanveer Alam',
    p_PER_4447.sublabel = 'Dock Terminal Transporter (Person AP)',
    p_PER_4447.status = 'ASSOCIATE',
    p_PER_4447.risk_level = 'STANDARD',
    p_PER_4447.national_id = 'MUM8037K',
    p_PER_4447.primary_address = 'Sector 8, Metro Zone, Mumbai',
    p_PER_4447.aliases = ["Person AP", "Tanveer Bhai"],
    p_PER_4447.evidence_basis = ["Intelligence dossier ref #TRX-INF-137", "Field observation log Zone 3"],
    p_PER_4447.nodeType = 'PERSON',
    p_PER_4447.source_type = 'AI_ANALYSIS',
    p_PER_4447.verified = false;
MERGE (p_PER_4448:Person {id: 'PER-4448'})
SET p_PER_4448.pg_id = 'per-uuid-4448',
    p_PER_4448.name = 'Bablu Thakur',
    p_PER_4448.label = 'Bablu Thakur',
    p_PER_4448.sublabel = 'Shell Company Director (Person AQ)',
    p_PER_4448.status = 'PERSON_OF_INTEREST',
    p_PER_4448.risk_level = 'ELEVATED',
    p_PER_4448.national_id = 'MUM8038K',
    p_PER_4448.primary_address = 'Sector 9, Metro Zone, Mumbai',
    p_PER_4448.aliases = ["Person AQ", "Bablu Bhai"],
    p_PER_4448.evidence_basis = ["Intelligence dossier ref #TRX-INF-138", "Field observation log Zone 4"],
    p_PER_4448.nodeType = 'PERSON',
    p_PER_4448.source_type = 'SYSTEM_DERIVED',
    p_PER_4448.verified = false;
MERGE (p_PER_4449:Person {id: 'PER-4449'})
SET p_PER_4449.pg_id = 'per-uuid-4449',
    p_PER_4449.name = 'Shabir Ahmed',
    p_PER_4449.label = 'Shabir Ahmed',
    p_PER_4449.sublabel = 'RTO Forgery Agent (Person AR)',
    p_PER_4449.status = 'SUSPECT',
    p_PER_4449.risk_level = 'STANDARD',
    p_PER_4449.national_id = 'MUM8039K',
    p_PER_4449.primary_address = 'Sector 10, Metro Zone, Mumbai',
    p_PER_4449.aliases = ["Person AR", "Shabir Bhai"],
    p_PER_4449.evidence_basis = ["Intelligence dossier ref #TRX-INF-139", "Field observation log Zone 5"],
    p_PER_4449.nodeType = 'PERSON',
    p_PER_4449.source_type = 'VERIFIED_RECORD',
    p_PER_4449.verified = true;
MERGE (p_PER_4450:Person {id: 'PER-4450'})
SET p_PER_4450.pg_id = 'per-uuid-4450',
    p_PER_4450.name = 'Deepak Sonawane',
    p_PER_4450.label = 'Deepak Sonawane',
    p_PER_4450.sublabel = 'Chassis Tampering Mechanic (Person AS)',
    p_PER_4450.status = 'PERSON_OF_INTEREST',
    p_PER_4450.risk_level = 'HIGH',
    p_PER_4450.national_id = 'MUM8040K',
    p_PER_4450.primary_address = 'Sector 1, Metro Zone, Mumbai',
    p_PER_4450.aliases = ["Person AS", "Deepak Bhai"],
    p_PER_4450.evidence_basis = ["Intelligence dossier ref #TRX-INF-140", "Field observation log Zone 1"],
    p_PER_4450.nodeType = 'PERSON',
    p_PER_4450.source_type = 'SYSTEM_DERIVED',
    p_PER_4450.verified = false;
MERGE (p_PER_4451:Person {id: 'PER-4451'})
SET p_PER_4451.pg_id = 'per-uuid-4451',
    p_PER_4451.name = 'Zameer Khan',
    p_PER_4451.label = 'Zameer Khan',
    p_PER_4451.sublabel = 'Burner SIM Distributor (Person AT)',
    p_PER_4451.status = 'ASSOCIATE',
    p_PER_4451.risk_level = 'STANDARD',
    p_PER_4451.national_id = 'MUM8041K',
    p_PER_4451.primary_address = 'Sector 2, Metro Zone, Mumbai',
    p_PER_4451.aliases = ["Person AT", "Zameer Bhai"],
    p_PER_4451.evidence_basis = ["Intelligence dossier ref #TRX-INF-141", "Field observation log Zone 2"],
    p_PER_4451.nodeType = 'PERSON',
    p_PER_4451.source_type = 'AI_ANALYSIS',
    p_PER_4451.verified = false;
MERGE (p_PER_4452:Person {id: 'PER-4452'})
SET p_PER_4452.pg_id = 'per-uuid-4452',
    p_PER_4452.name = 'Chetan Joshi',
    p_PER_4452.label = 'Chetan Joshi',
    p_PER_4452.sublabel = 'Safehouse Custodian (Person AU)',
    p_PER_4452.status = 'SUSPECT',
    p_PER_4452.risk_level = 'ELEVATED',
    p_PER_4452.national_id = 'MUM8042K',
    p_PER_4452.primary_address = 'Sector 3, Metro Zone, Mumbai',
    p_PER_4452.aliases = ["Person AU", "Chetan Bhai"],
    p_PER_4452.evidence_basis = ["Intelligence dossier ref #TRX-INF-142", "Field observation log Zone 3"],
    p_PER_4452.nodeType = 'PERSON',
    p_PER_4452.source_type = 'VERIFIED_RECORD',
    p_PER_4452.verified = true;
MERGE (p_PER_4453:Person {id: 'PER-4453'})
SET p_PER_4453.pg_id = 'per-uuid-4453',
    p_PER_4453.name = 'Mohsin Baig',
    p_PER_4453.label = 'Mohsin Baig',
    p_PER_4453.sublabel = 'Customs Clearing Broker (Person AV)',
    p_PER_4453.status = 'ASSOCIATE',
    p_PER_4453.risk_level = 'STANDARD',
    p_PER_4453.national_id = 'MUM8043K',
    p_PER_4453.primary_address = 'Sector 4, Metro Zone, Mumbai',
    p_PER_4453.aliases = ["Person AV", "Mohsin Bhai"],
    p_PER_4453.evidence_basis = ["Intelligence dossier ref #TRX-INF-143", "Field observation log Zone 4"],
    p_PER_4453.nodeType = 'PERSON',
    p_PER_4453.source_type = 'AI_ANALYSIS',
    p_PER_4453.verified = false;
MERGE (p_PER_4454:Person {id: 'PER-4454'})
SET p_PER_4454.pg_id = 'per-uuid-4454',
    p_PER_4454.name = 'Raju Nepali',
    p_PER_4454.label = 'Raju Nepali',
    p_PER_4454.sublabel = 'Informal Trade Bookkeeper (Person AW)',
    p_PER_4454.status = 'PERSON_OF_INTEREST',
    p_PER_4454.risk_level = 'HIGH',
    p_PER_4454.national_id = 'MUM8044K',
    p_PER_4454.primary_address = 'Sector 5, Metro Zone, Mumbai',
    p_PER_4454.aliases = ["Person AW", "Raju Bhai"],
    p_PER_4454.evidence_basis = ["Intelligence dossier ref #TRX-INF-144", "Field observation log Zone 5"],
    p_PER_4454.nodeType = 'PERSON',
    p_PER_4454.source_type = 'SYSTEM_DERIVED',
    p_PER_4454.verified = false;
MERGE (p_PER_4455:Person {id: 'PER-4455'})
SET p_PER_4455.pg_id = 'per-uuid-4455',
    p_PER_4455.name = 'Navin Shah',
    p_PER_4455.label = 'Navin Shah',
    p_PER_4455.sublabel = 'Warehouse Watchman (Person AX)',
    p_PER_4455.status = 'SUSPECT',
    p_PER_4455.risk_level = 'STANDARD',
    p_PER_4455.national_id = 'MUM8045K',
    p_PER_4455.primary_address = 'Sector 6, Metro Zone, Mumbai',
    p_PER_4455.aliases = ["Person AX", "Navin Bhai"],
    p_PER_4455.evidence_basis = ["Intelligence dossier ref #TRX-INF-145", "Field observation log Zone 1"],
    p_PER_4455.nodeType = 'PERSON',
    p_PER_4455.source_type = 'VERIFIED_RECORD',
    p_PER_4455.verified = true;
MERGE (p_PER_4456:Person {id: 'PER-4456'})
SET p_PER_4456.pg_id = 'per-uuid-4456',
    p_PER_4456.name = 'Munna Pandey',
    p_PER_4456.label = 'Munna Pandey',
    p_PER_4456.sublabel = 'Logistics Fleet Dispatcher (Person AY)',
    p_PER_4456.status = 'PERSON_OF_INTEREST',
    p_PER_4456.risk_level = 'ELEVATED',
    p_PER_4456.national_id = 'MUM8046K',
    p_PER_4456.primary_address = 'Sector 7, Metro Zone, Mumbai',
    p_PER_4456.aliases = ["Person AY", "Munna Bhai"],
    p_PER_4456.evidence_basis = ["Intelligence dossier ref #TRX-INF-146", "Field observation log Zone 2"],
    p_PER_4456.nodeType = 'PERSON',
    p_PER_4456.source_type = 'SYSTEM_DERIVED',
    p_PER_4456.verified = false;
MERGE (p_PER_4457:Person {id: 'PER-4457'})
SET p_PER_4457.pg_id = 'per-uuid-4457',
    p_PER_4457.name = 'Ajay Solanki',
    p_PER_4457.label = 'Ajay Solanki',
    p_PER_4457.sublabel = 'Mule Account Recruiter (Person AZ)',
    p_PER_4457.status = 'ASSOCIATE',
    p_PER_4457.risk_level = 'STANDARD',
    p_PER_4457.national_id = 'MUM8047K',
    p_PER_4457.primary_address = 'Sector 8, Metro Zone, Mumbai',
    p_PER_4457.aliases = ["Person AZ", "Ajay Bhai"],
    p_PER_4457.evidence_basis = ["Intelligence dossier ref #TRX-INF-147", "Field observation log Zone 3"],
    p_PER_4457.nodeType = 'PERSON',
    p_PER_4457.source_type = 'AI_ANALYSIS',
    p_PER_4457.verified = false;
MERGE (p_PER_4458:Person {id: 'PER-4458'})
SET p_PER_4458.pg_id = 'per-uuid-4458',
    p_PER_4458.name = 'Fayyaz Pehelwan',
    p_PER_4458.label = 'Fayyaz Pehelwan',
    p_PER_4458.sublabel = 'Hawala Cash Courier (Person A[)',
    p_PER_4458.status = 'SUSPECT',
    p_PER_4458.risk_level = 'HIGH',
    p_PER_4458.national_id = 'MUM8048K',
    p_PER_4458.primary_address = 'Sector 9, Metro Zone, Mumbai',
    p_PER_4458.aliases = ["Person A[", "Fayyaz Bhai"],
    p_PER_4458.evidence_basis = ["Intelligence dossier ref #TRX-INF-148", "Field observation log Zone 4"],
    p_PER_4458.nodeType = 'PERSON',
    p_PER_4458.source_type = 'VERIFIED_RECORD',
    p_PER_4458.verified = true;
MERGE (p_PER_4459:Person {id: 'PER-4459'})
SET p_PER_4459.pg_id = 'per-uuid-4459',
    p_PER_4459.name = 'Gopal Shetty',
    p_PER_4459.label = 'Gopal Shetty',
    p_PER_4459.sublabel = 'Dock Terminal Transporter (Person A\)',
    p_PER_4459.status = 'ASSOCIATE',
    p_PER_4459.risk_level = 'STANDARD',
    p_PER_4459.national_id = 'MUM8049K',
    p_PER_4459.primary_address = 'Sector 10, Metro Zone, Mumbai',
    p_PER_4459.aliases = ["Person A\\", "Gopal Bhai"],
    p_PER_4459.evidence_basis = ["Intelligence dossier ref #TRX-INF-149", "Field observation log Zone 5"],
    p_PER_4459.nodeType = 'PERSON',
    p_PER_4459.source_type = 'AI_ANALYSIS',
    p_PER_4459.verified = false;
MERGE (p_PER_4460:Person {id: 'PER-4460'})
SET p_PER_4460.pg_id = 'per-uuid-4460',
    p_PER_4460.name = 'Kafeel Ansari',
    p_PER_4460.label = 'Kafeel Ansari',
    p_PER_4460.sublabel = 'Shell Company Director (Person A])',
    p_PER_4460.status = 'PERSON_OF_INTEREST',
    p_PER_4460.risk_level = 'ELEVATED',
    p_PER_4460.national_id = 'MUM8050K',
    p_PER_4460.primary_address = 'Sector 1, Metro Zone, Mumbai',
    p_PER_4460.aliases = ["Person A]", "Kafeel Bhai"],
    p_PER_4460.evidence_basis = ["Intelligence dossier ref #TRX-INF-150", "Field observation log Zone 1"],
    p_PER_4460.nodeType = 'PERSON',
    p_PER_4460.source_type = 'SYSTEM_DERIVED',
    p_PER_4460.verified = false;

// ----------------------------------------------------------------------------
// 3. PHONE NODES (40)
// ----------------------------------------------------------------------------
MERGE (ph_PH_98201:Phone {id: 'PH-98201'})
SET ph_PH_98201.pg_id = 'ph-uuid-98201',
    ph_PH_98201.number = '+91 98201 55431',
    ph_PH_98201.label = '+91 98201 55431',
    ph_PH_98201.sublabel = 'Tariq Merchant Official',
    ph_PH_98201.subscriber = 'Tariq Merchant Official',
    ph_PH_98201.carrier = 'Airtel Metro',
    ph_PH_98201.evidence_basis = ['Airtel KYC CAF Form #44109'],
    ph_PH_98201.nodeType = 'PHONE',
    ph_PH_98201.source_type = 'VERIFIED_RECORD',
    ph_PH_98201.verified = true;
MERGE (ph_PH_98209:Phone {id: 'PH-98209'})
SET ph_PH_98209.pg_id = 'ph-uuid-98209',
    ph_PH_98209.number = '+91 98209 88120',
    ph_PH_98209.label = '+91 98209 88120',
    ph_PH_98209.sublabel = 'Dockyard Burner SIM',
    ph_PH_98209.subscriber = 'Dockyard Burner SIM',
    ph_PH_98209.carrier = 'Jio Corporate',
    ph_PH_98209.evidence_basis = ['Cell Tower CDR Burst Contact with Tariq Merchant'],
    ph_PH_98209.nodeType = 'PHONE',
    ph_PH_98209.source_type = 'SYSTEM_DERIVED',
    ph_PH_98209.verified = false;
MERGE (ph_PH_97690:Phone {id: 'PH-97690'})
SET ph_PH_97690.pg_id = 'ph-uuid-97690',
    ph_PH_97690.number = '+91 97690 12091',
    ph_PH_97690.label = '+91 97690 12091',
    ph_PH_97690.sublabel = 'Devendra Sawant Personal',
    ph_PH_97690.subscriber = 'Devendra Sawant Personal',
    ph_PH_97690.carrier = 'Vodafone Idea',
    ph_PH_97690.evidence_basis = ['Seized Handset SIM #1'],
    ph_PH_97690.nodeType = 'PHONE',
    ph_PH_97690.source_type = 'VERIFIED_RECORD',
    ph_PH_97690.verified = true;
MERGE (ph_PH_98210:Phone {id: 'PH-98210'})
SET ph_PH_98210.pg_id = 'ph-uuid-98210',
    ph_PH_98210.number = '+91 98210 33419',
    ph_PH_98210.label = '+91 98210 33419',
    ph_PH_98210.sublabel = 'Nilesh Vora Office Line',
    ph_PH_98210.subscriber = 'Nilesh Vora Office Line',
    ph_PH_98210.carrier = 'MTNL Mumbai',
    ph_PH_98210.evidence_basis = ['Zaveri Chambers Business Landline'],
    ph_PH_98210.nodeType = 'PHONE',
    ph_PH_98210.source_type = 'VERIFIED_RECORD',
    ph_PH_98210.verified = true;
MERGE (ph_PH_98204:Phone {id: 'PH-98204'})
SET ph_PH_98204.pg_id = 'ph-uuid-98204',
    ph_PH_98204.number = '+91 98204 10548',
    ph_PH_98204.label = '+91 98204 10548',
    ph_PH_98204.sublabel = 'Burner Handset #4',
    ph_PH_98204.subscriber = 'Burner Handset #4',
    ph_PH_98204.carrier = 'Airtel Metro',
    ph_PH_98204.evidence_basis = ['Telecom switch CDR export batch #204'],
    ph_PH_98204.nodeType = 'PHONE',
    ph_PH_98204.source_type = 'SYSTEM_DERIVED',
    ph_PH_98204.verified = false;
MERGE (ph_PH_98205:Phone {id: 'PH-98205'})
SET ph_PH_98205.pg_id = 'ph-uuid-98205',
    ph_PH_98205.number = '+91 98205 10685',
    ph_PH_98205.label = '+91 98205 10685',
    ph_PH_98205.sublabel = 'Commercial VoIP Line #5',
    ph_PH_98205.subscriber = 'Commercial VoIP Line #5',
    ph_PH_98205.carrier = 'Jio Corporate',
    ph_PH_98205.evidence_basis = ['Telecom switch CDR export batch #205'],
    ph_PH_98205.nodeType = 'PHONE',
    ph_PH_98205.source_type = 'AI_ANALYSIS',
    ph_PH_98205.verified = false;
MERGE (ph_PH_98206:Phone {id: 'PH-98206'})
SET ph_PH_98206.pg_id = 'ph-uuid-98206',
    ph_PH_98206.number = '+91 98206 10822',
    ph_PH_98206.label = '+91 98206 10822',
    ph_PH_98206.sublabel = 'Burner Handset #6',
    ph_PH_98206.subscriber = 'Burner Handset #6',
    ph_PH_98206.carrier = 'Vodafone Idea',
    ph_PH_98206.evidence_basis = ['Telecom switch CDR export batch #206'],
    ph_PH_98206.nodeType = 'PHONE',
    ph_PH_98206.source_type = 'VERIFIED_RECORD',
    ph_PH_98206.verified = true;
MERGE (ph_PH_98207:Phone {id: 'PH-98207'})
SET ph_PH_98207.pg_id = 'ph-uuid-98207',
    ph_PH_98207.number = '+91 98207 10959',
    ph_PH_98207.label = '+91 98207 10959',
    ph_PH_98207.sublabel = 'Commercial VoIP Line #7',
    ph_PH_98207.subscriber = 'Commercial VoIP Line #7',
    ph_PH_98207.carrier = 'BSNL Gateway',
    ph_PH_98207.evidence_basis = ['Telecom switch CDR export batch #207'],
    ph_PH_98207.nodeType = 'PHONE',
    ph_PH_98207.source_type = 'AI_ANALYSIS',
    ph_PH_98207.verified = false;
MERGE (ph_PH_98208:Phone {id: 'PH-98208'})
SET ph_PH_98208.pg_id = 'ph-uuid-98208',
    ph_PH_98208.number = '+91 98208 11096',
    ph_PH_98208.label = '+91 98208 11096',
    ph_PH_98208.sublabel = 'Burner Handset #8',
    ph_PH_98208.subscriber = 'Burner Handset #8',
    ph_PH_98208.carrier = 'Airtel Metro',
    ph_PH_98208.evidence_basis = ['Telecom switch CDR export batch #208'],
    ph_PH_98208.nodeType = 'PHONE',
    ph_PH_98208.source_type = 'SYSTEM_DERIVED',
    ph_PH_98208.verified = false;
MERGE (ph_PH_98209:Phone {id: 'PH-98209'})
SET ph_PH_98209.pg_id = 'ph-uuid-98209',
    ph_PH_98209.number = '+91 98209 11233',
    ph_PH_98209.label = '+91 98209 11233',
    ph_PH_98209.sublabel = 'Commercial VoIP Line #9',
    ph_PH_98209.subscriber = 'Commercial VoIP Line #9',
    ph_PH_98209.carrier = 'Jio Corporate',
    ph_PH_98209.evidence_basis = ['Telecom switch CDR export batch #209'],
    ph_PH_98209.nodeType = 'PHONE',
    ph_PH_98209.source_type = 'VERIFIED_RECORD',
    ph_PH_98209.verified = true;
MERGE (ph_PH_98210:Phone {id: 'PH-98210'})
SET ph_PH_98210.pg_id = 'ph-uuid-98210',
    ph_PH_98210.number = '+91 98200 11370',
    ph_PH_98210.label = '+91 98200 11370',
    ph_PH_98210.sublabel = 'Burner Handset #10',
    ph_PH_98210.subscriber = 'Burner Handset #10',
    ph_PH_98210.carrier = 'Vodafone Idea',
    ph_PH_98210.evidence_basis = ['Telecom switch CDR export batch #210'],
    ph_PH_98210.nodeType = 'PHONE',
    ph_PH_98210.source_type = 'SYSTEM_DERIVED',
    ph_PH_98210.verified = false;
MERGE (ph_PH_98211:Phone {id: 'PH-98211'})
SET ph_PH_98211.pg_id = 'ph-uuid-98211',
    ph_PH_98211.number = '+91 98201 11507',
    ph_PH_98211.label = '+91 98201 11507',
    ph_PH_98211.sublabel = 'Commercial VoIP Line #11',
    ph_PH_98211.subscriber = 'Commercial VoIP Line #11',
    ph_PH_98211.carrier = 'BSNL Gateway',
    ph_PH_98211.evidence_basis = ['Telecom switch CDR export batch #211'],
    ph_PH_98211.nodeType = 'PHONE',
    ph_PH_98211.source_type = 'AI_ANALYSIS',
    ph_PH_98211.verified = false;
MERGE (ph_PH_98212:Phone {id: 'PH-98212'})
SET ph_PH_98212.pg_id = 'ph-uuid-98212',
    ph_PH_98212.number = '+91 98202 11644',
    ph_PH_98212.label = '+91 98202 11644',
    ph_PH_98212.sublabel = 'Burner Handset #12',
    ph_PH_98212.subscriber = 'Burner Handset #12',
    ph_PH_98212.carrier = 'Airtel Metro',
    ph_PH_98212.evidence_basis = ['Telecom switch CDR export batch #212'],
    ph_PH_98212.nodeType = 'PHONE',
    ph_PH_98212.source_type = 'VERIFIED_RECORD',
    ph_PH_98212.verified = true;
MERGE (ph_PH_98213:Phone {id: 'PH-98213'})
SET ph_PH_98213.pg_id = 'ph-uuid-98213',
    ph_PH_98213.number = '+91 98203 11781',
    ph_PH_98213.label = '+91 98203 11781',
    ph_PH_98213.sublabel = 'Commercial VoIP Line #13',
    ph_PH_98213.subscriber = 'Commercial VoIP Line #13',
    ph_PH_98213.carrier = 'Jio Corporate',
    ph_PH_98213.evidence_basis = ['Telecom switch CDR export batch #213'],
    ph_PH_98213.nodeType = 'PHONE',
    ph_PH_98213.source_type = 'AI_ANALYSIS',
    ph_PH_98213.verified = false;
MERGE (ph_PH_98214:Phone {id: 'PH-98214'})
SET ph_PH_98214.pg_id = 'ph-uuid-98214',
    ph_PH_98214.number = '+91 98204 11918',
    ph_PH_98214.label = '+91 98204 11918',
    ph_PH_98214.sublabel = 'Burner Handset #14',
    ph_PH_98214.subscriber = 'Burner Handset #14',
    ph_PH_98214.carrier = 'Vodafone Idea',
    ph_PH_98214.evidence_basis = ['Telecom switch CDR export batch #214'],
    ph_PH_98214.nodeType = 'PHONE',
    ph_PH_98214.source_type = 'SYSTEM_DERIVED',
    ph_PH_98214.verified = false;
MERGE (ph_PH_98215:Phone {id: 'PH-98215'})
SET ph_PH_98215.pg_id = 'ph-uuid-98215',
    ph_PH_98215.number = '+91 98205 12055',
    ph_PH_98215.label = '+91 98205 12055',
    ph_PH_98215.sublabel = 'Commercial VoIP Line #15',
    ph_PH_98215.subscriber = 'Commercial VoIP Line #15',
    ph_PH_98215.carrier = 'BSNL Gateway',
    ph_PH_98215.evidence_basis = ['Telecom switch CDR export batch #215'],
    ph_PH_98215.nodeType = 'PHONE',
    ph_PH_98215.source_type = 'VERIFIED_RECORD',
    ph_PH_98215.verified = true;
MERGE (ph_PH_98216:Phone {id: 'PH-98216'})
SET ph_PH_98216.pg_id = 'ph-uuid-98216',
    ph_PH_98216.number = '+91 98206 12192',
    ph_PH_98216.label = '+91 98206 12192',
    ph_PH_98216.sublabel = 'Burner Handset #16',
    ph_PH_98216.subscriber = 'Burner Handset #16',
    ph_PH_98216.carrier = 'Airtel Metro',
    ph_PH_98216.evidence_basis = ['Telecom switch CDR export batch #216'],
    ph_PH_98216.nodeType = 'PHONE',
    ph_PH_98216.source_type = 'SYSTEM_DERIVED',
    ph_PH_98216.verified = false;
MERGE (ph_PH_98217:Phone {id: 'PH-98217'})
SET ph_PH_98217.pg_id = 'ph-uuid-98217',
    ph_PH_98217.number = '+91 98207 12329',
    ph_PH_98217.label = '+91 98207 12329',
    ph_PH_98217.sublabel = 'Commercial VoIP Line #17',
    ph_PH_98217.subscriber = 'Commercial VoIP Line #17',
    ph_PH_98217.carrier = 'Jio Corporate',
    ph_PH_98217.evidence_basis = ['Telecom switch CDR export batch #217'],
    ph_PH_98217.nodeType = 'PHONE',
    ph_PH_98217.source_type = 'AI_ANALYSIS',
    ph_PH_98217.verified = false;
MERGE (ph_PH_98218:Phone {id: 'PH-98218'})
SET ph_PH_98218.pg_id = 'ph-uuid-98218',
    ph_PH_98218.number = '+91 98208 12466',
    ph_PH_98218.label = '+91 98208 12466',
    ph_PH_98218.sublabel = 'Burner Handset #18',
    ph_PH_98218.subscriber = 'Burner Handset #18',
    ph_PH_98218.carrier = 'Vodafone Idea',
    ph_PH_98218.evidence_basis = ['Telecom switch CDR export batch #218'],
    ph_PH_98218.nodeType = 'PHONE',
    ph_PH_98218.source_type = 'VERIFIED_RECORD',
    ph_PH_98218.verified = true;
MERGE (ph_PH_98219:Phone {id: 'PH-98219'})
SET ph_PH_98219.pg_id = 'ph-uuid-98219',
    ph_PH_98219.number = '+91 98209 12603',
    ph_PH_98219.label = '+91 98209 12603',
    ph_PH_98219.sublabel = 'Commercial VoIP Line #19',
    ph_PH_98219.subscriber = 'Commercial VoIP Line #19',
    ph_PH_98219.carrier = 'BSNL Gateway',
    ph_PH_98219.evidence_basis = ['Telecom switch CDR export batch #219'],
    ph_PH_98219.nodeType = 'PHONE',
    ph_PH_98219.source_type = 'AI_ANALYSIS',
    ph_PH_98219.verified = false;
MERGE (ph_PH_98220:Phone {id: 'PH-98220'})
SET ph_PH_98220.pg_id = 'ph-uuid-98220',
    ph_PH_98220.number = '+91 98200 12740',
    ph_PH_98220.label = '+91 98200 12740',
    ph_PH_98220.sublabel = 'Burner Handset #20',
    ph_PH_98220.subscriber = 'Burner Handset #20',
    ph_PH_98220.carrier = 'Airtel Metro',
    ph_PH_98220.evidence_basis = ['Telecom switch CDR export batch #220'],
    ph_PH_98220.nodeType = 'PHONE',
    ph_PH_98220.source_type = 'SYSTEM_DERIVED',
    ph_PH_98220.verified = false;
MERGE (ph_PH_98221:Phone {id: 'PH-98221'})
SET ph_PH_98221.pg_id = 'ph-uuid-98221',
    ph_PH_98221.number = '+91 98201 12877',
    ph_PH_98221.label = '+91 98201 12877',
    ph_PH_98221.sublabel = 'Commercial VoIP Line #21',
    ph_PH_98221.subscriber = 'Commercial VoIP Line #21',
    ph_PH_98221.carrier = 'Jio Corporate',
    ph_PH_98221.evidence_basis = ['Telecom switch CDR export batch #221'],
    ph_PH_98221.nodeType = 'PHONE',
    ph_PH_98221.source_type = 'VERIFIED_RECORD',
    ph_PH_98221.verified = true;
MERGE (ph_PH_98222:Phone {id: 'PH-98222'})
SET ph_PH_98222.pg_id = 'ph-uuid-98222',
    ph_PH_98222.number = '+91 98202 13014',
    ph_PH_98222.label = '+91 98202 13014',
    ph_PH_98222.sublabel = 'Burner Handset #22',
    ph_PH_98222.subscriber = 'Burner Handset #22',
    ph_PH_98222.carrier = 'Vodafone Idea',
    ph_PH_98222.evidence_basis = ['Telecom switch CDR export batch #222'],
    ph_PH_98222.nodeType = 'PHONE',
    ph_PH_98222.source_type = 'SYSTEM_DERIVED',
    ph_PH_98222.verified = false;
MERGE (ph_PH_98223:Phone {id: 'PH-98223'})
SET ph_PH_98223.pg_id = 'ph-uuid-98223',
    ph_PH_98223.number = '+91 98203 13151',
    ph_PH_98223.label = '+91 98203 13151',
    ph_PH_98223.sublabel = 'Commercial VoIP Line #23',
    ph_PH_98223.subscriber = 'Commercial VoIP Line #23',
    ph_PH_98223.carrier = 'BSNL Gateway',
    ph_PH_98223.evidence_basis = ['Telecom switch CDR export batch #223'],
    ph_PH_98223.nodeType = 'PHONE',
    ph_PH_98223.source_type = 'AI_ANALYSIS',
    ph_PH_98223.verified = false;
MERGE (ph_PH_98224:Phone {id: 'PH-98224'})
SET ph_PH_98224.pg_id = 'ph-uuid-98224',
    ph_PH_98224.number = '+91 98204 13288',
    ph_PH_98224.label = '+91 98204 13288',
    ph_PH_98224.sublabel = 'Burner Handset #24',
    ph_PH_98224.subscriber = 'Burner Handset #24',
    ph_PH_98224.carrier = 'Airtel Metro',
    ph_PH_98224.evidence_basis = ['Telecom switch CDR export batch #224'],
    ph_PH_98224.nodeType = 'PHONE',
    ph_PH_98224.source_type = 'VERIFIED_RECORD',
    ph_PH_98224.verified = true;
MERGE (ph_PH_98225:Phone {id: 'PH-98225'})
SET ph_PH_98225.pg_id = 'ph-uuid-98225',
    ph_PH_98225.number = '+91 98205 13425',
    ph_PH_98225.label = '+91 98205 13425',
    ph_PH_98225.sublabel = 'Commercial VoIP Line #25',
    ph_PH_98225.subscriber = 'Commercial VoIP Line #25',
    ph_PH_98225.carrier = 'Jio Corporate',
    ph_PH_98225.evidence_basis = ['Telecom switch CDR export batch #225'],
    ph_PH_98225.nodeType = 'PHONE',
    ph_PH_98225.source_type = 'AI_ANALYSIS',
    ph_PH_98225.verified = false;
MERGE (ph_PH_98226:Phone {id: 'PH-98226'})
SET ph_PH_98226.pg_id = 'ph-uuid-98226',
    ph_PH_98226.number = '+91 98206 13562',
    ph_PH_98226.label = '+91 98206 13562',
    ph_PH_98226.sublabel = 'Burner Handset #26',
    ph_PH_98226.subscriber = 'Burner Handset #26',
    ph_PH_98226.carrier = 'Vodafone Idea',
    ph_PH_98226.evidence_basis = ['Telecom switch CDR export batch #226'],
    ph_PH_98226.nodeType = 'PHONE',
    ph_PH_98226.source_type = 'SYSTEM_DERIVED',
    ph_PH_98226.verified = false;
MERGE (ph_PH_98227:Phone {id: 'PH-98227'})
SET ph_PH_98227.pg_id = 'ph-uuid-98227',
    ph_PH_98227.number = '+91 98207 13699',
    ph_PH_98227.label = '+91 98207 13699',
    ph_PH_98227.sublabel = 'Commercial VoIP Line #27',
    ph_PH_98227.subscriber = 'Commercial VoIP Line #27',
    ph_PH_98227.carrier = 'BSNL Gateway',
    ph_PH_98227.evidence_basis = ['Telecom switch CDR export batch #227'],
    ph_PH_98227.nodeType = 'PHONE',
    ph_PH_98227.source_type = 'VERIFIED_RECORD',
    ph_PH_98227.verified = true;
MERGE (ph_PH_98228:Phone {id: 'PH-98228'})
SET ph_PH_98228.pg_id = 'ph-uuid-98228',
    ph_PH_98228.number = '+91 98208 13836',
    ph_PH_98228.label = '+91 98208 13836',
    ph_PH_98228.sublabel = 'Burner Handset #28',
    ph_PH_98228.subscriber = 'Burner Handset #28',
    ph_PH_98228.carrier = 'Airtel Metro',
    ph_PH_98228.evidence_basis = ['Telecom switch CDR export batch #228'],
    ph_PH_98228.nodeType = 'PHONE',
    ph_PH_98228.source_type = 'SYSTEM_DERIVED',
    ph_PH_98228.verified = false;
MERGE (ph_PH_98229:Phone {id: 'PH-98229'})
SET ph_PH_98229.pg_id = 'ph-uuid-98229',
    ph_PH_98229.number = '+91 98209 13973',
    ph_PH_98229.label = '+91 98209 13973',
    ph_PH_98229.sublabel = 'Commercial VoIP Line #29',
    ph_PH_98229.subscriber = 'Commercial VoIP Line #29',
    ph_PH_98229.carrier = 'Jio Corporate',
    ph_PH_98229.evidence_basis = ['Telecom switch CDR export batch #229'],
    ph_PH_98229.nodeType = 'PHONE',
    ph_PH_98229.source_type = 'AI_ANALYSIS',
    ph_PH_98229.verified = false;
MERGE (ph_PH_98230:Phone {id: 'PH-98230'})
SET ph_PH_98230.pg_id = 'ph-uuid-98230',
    ph_PH_98230.number = '+91 98200 14110',
    ph_PH_98230.label = '+91 98200 14110',
    ph_PH_98230.sublabel = 'Burner Handset #30',
    ph_PH_98230.subscriber = 'Burner Handset #30',
    ph_PH_98230.carrier = 'Vodafone Idea',
    ph_PH_98230.evidence_basis = ['Telecom switch CDR export batch #230'],
    ph_PH_98230.nodeType = 'PHONE',
    ph_PH_98230.source_type = 'VERIFIED_RECORD',
    ph_PH_98230.verified = true;
MERGE (ph_PH_98231:Phone {id: 'PH-98231'})
SET ph_PH_98231.pg_id = 'ph-uuid-98231',
    ph_PH_98231.number = '+91 98201 14247',
    ph_PH_98231.label = '+91 98201 14247',
    ph_PH_98231.sublabel = 'Commercial VoIP Line #31',
    ph_PH_98231.subscriber = 'Commercial VoIP Line #31',
    ph_PH_98231.carrier = 'BSNL Gateway',
    ph_PH_98231.evidence_basis = ['Telecom switch CDR export batch #231'],
    ph_PH_98231.nodeType = 'PHONE',
    ph_PH_98231.source_type = 'AI_ANALYSIS',
    ph_PH_98231.verified = false;
MERGE (ph_PH_98232:Phone {id: 'PH-98232'})
SET ph_PH_98232.pg_id = 'ph-uuid-98232',
    ph_PH_98232.number = '+91 98202 14384',
    ph_PH_98232.label = '+91 98202 14384',
    ph_PH_98232.sublabel = 'Burner Handset #32',
    ph_PH_98232.subscriber = 'Burner Handset #32',
    ph_PH_98232.carrier = 'Airtel Metro',
    ph_PH_98232.evidence_basis = ['Telecom switch CDR export batch #232'],
    ph_PH_98232.nodeType = 'PHONE',
    ph_PH_98232.source_type = 'SYSTEM_DERIVED',
    ph_PH_98232.verified = false;
MERGE (ph_PH_98233:Phone {id: 'PH-98233'})
SET ph_PH_98233.pg_id = 'ph-uuid-98233',
    ph_PH_98233.number = '+91 98203 14521',
    ph_PH_98233.label = '+91 98203 14521',
    ph_PH_98233.sublabel = 'Commercial VoIP Line #33',
    ph_PH_98233.subscriber = 'Commercial VoIP Line #33',
    ph_PH_98233.carrier = 'Jio Corporate',
    ph_PH_98233.evidence_basis = ['Telecom switch CDR export batch #233'],
    ph_PH_98233.nodeType = 'PHONE',
    ph_PH_98233.source_type = 'VERIFIED_RECORD',
    ph_PH_98233.verified = true;
MERGE (ph_PH_98234:Phone {id: 'PH-98234'})
SET ph_PH_98234.pg_id = 'ph-uuid-98234',
    ph_PH_98234.number = '+91 98204 14658',
    ph_PH_98234.label = '+91 98204 14658',
    ph_PH_98234.sublabel = 'Burner Handset #34',
    ph_PH_98234.subscriber = 'Burner Handset #34',
    ph_PH_98234.carrier = 'Vodafone Idea',
    ph_PH_98234.evidence_basis = ['Telecom switch CDR export batch #234'],
    ph_PH_98234.nodeType = 'PHONE',
    ph_PH_98234.source_type = 'SYSTEM_DERIVED',
    ph_PH_98234.verified = false;
MERGE (ph_PH_98235:Phone {id: 'PH-98235'})
SET ph_PH_98235.pg_id = 'ph-uuid-98235',
    ph_PH_98235.number = '+91 98205 14795',
    ph_PH_98235.label = '+91 98205 14795',
    ph_PH_98235.sublabel = 'Commercial VoIP Line #35',
    ph_PH_98235.subscriber = 'Commercial VoIP Line #35',
    ph_PH_98235.carrier = 'BSNL Gateway',
    ph_PH_98235.evidence_basis = ['Telecom switch CDR export batch #235'],
    ph_PH_98235.nodeType = 'PHONE',
    ph_PH_98235.source_type = 'AI_ANALYSIS',
    ph_PH_98235.verified = false;
MERGE (ph_PH_98236:Phone {id: 'PH-98236'})
SET ph_PH_98236.pg_id = 'ph-uuid-98236',
    ph_PH_98236.number = '+91 98206 14932',
    ph_PH_98236.label = '+91 98206 14932',
    ph_PH_98236.sublabel = 'Burner Handset #36',
    ph_PH_98236.subscriber = 'Burner Handset #36',
    ph_PH_98236.carrier = 'Airtel Metro',
    ph_PH_98236.evidence_basis = ['Telecom switch CDR export batch #236'],
    ph_PH_98236.nodeType = 'PHONE',
    ph_PH_98236.source_type = 'VERIFIED_RECORD',
    ph_PH_98236.verified = true;
MERGE (ph_PH_98237:Phone {id: 'PH-98237'})
SET ph_PH_98237.pg_id = 'ph-uuid-98237',
    ph_PH_98237.number = '+91 98207 15069',
    ph_PH_98237.label = '+91 98207 15069',
    ph_PH_98237.sublabel = 'Commercial VoIP Line #37',
    ph_PH_98237.subscriber = 'Commercial VoIP Line #37',
    ph_PH_98237.carrier = 'Jio Corporate',
    ph_PH_98237.evidence_basis = ['Telecom switch CDR export batch #237'],
    ph_PH_98237.nodeType = 'PHONE',
    ph_PH_98237.source_type = 'AI_ANALYSIS',
    ph_PH_98237.verified = false;
MERGE (ph_PH_98238:Phone {id: 'PH-98238'})
SET ph_PH_98238.pg_id = 'ph-uuid-98238',
    ph_PH_98238.number = '+91 98208 15206',
    ph_PH_98238.label = '+91 98208 15206',
    ph_PH_98238.sublabel = 'Burner Handset #38',
    ph_PH_98238.subscriber = 'Burner Handset #38',
    ph_PH_98238.carrier = 'Vodafone Idea',
    ph_PH_98238.evidence_basis = ['Telecom switch CDR export batch #238'],
    ph_PH_98238.nodeType = 'PHONE',
    ph_PH_98238.source_type = 'SYSTEM_DERIVED',
    ph_PH_98238.verified = false;
MERGE (ph_PH_98239:Phone {id: 'PH-98239'})
SET ph_PH_98239.pg_id = 'ph-uuid-98239',
    ph_PH_98239.number = '+91 98209 15343',
    ph_PH_98239.label = '+91 98209 15343',
    ph_PH_98239.sublabel = 'Commercial VoIP Line #39',
    ph_PH_98239.subscriber = 'Commercial VoIP Line #39',
    ph_PH_98239.carrier = 'BSNL Gateway',
    ph_PH_98239.evidence_basis = ['Telecom switch CDR export batch #239'],
    ph_PH_98239.nodeType = 'PHONE',
    ph_PH_98239.source_type = 'VERIFIED_RECORD',
    ph_PH_98239.verified = true;

// ----------------------------------------------------------------------------
// 4. VEHICLE NODES (26)
// ----------------------------------------------------------------------------
MERGE (v_VEH_8902:Vehicle {id: 'VEH-8902'})
SET v_VEH_8902.pg_id = 'veh-uuid-8902',
    v_VEH_8902.plate = 'MH-01-CR-8902',
    v_VEH_8902.label = 'MH-01-CR-8902',
    v_VEH_8902.sublabel = 'Silver Fortuner',
    v_VEH_8902.model = 'Silver Fortuner',
    v_VEH_8902.chassis_number = 'CH-MH01-2024-889104',
    v_VEH_8902.evidence_basis = ['RTO Vahan Registration Gateway'],
    v_VEH_8902.nodeType = 'VEHICLE',
    v_VEH_8902.source_type = 'VERIFIED_RECORD',
    v_VEH_8902.verified = true;
MERGE (v_VEH_5510:Vehicle {id: 'VEH-5510'})
SET v_VEH_5510.pg_id = 'veh-uuid-5510',
    v_VEH_5510.plate = 'MH-04-AX-5510',
    v_VEH_5510.label = 'MH-04-AX-5510',
    v_VEH_5510.sublabel = 'Mahindra Scorpio (White)',
    v_VEH_5510.model = 'Mahindra Scorpio (White)',
    v_VEH_5510.chassis_number = 'CH-MH04-2023-112048',
    v_VEH_5510.evidence_basis = ['CCTV ANPR Camera Toll Gate 3'],
    v_VEH_5510.nodeType = 'VEHICLE',
    v_VEH_5510.source_type = 'SYSTEM_DERIVED',
    v_VEH_5510.verified = false;
MERGE (v_VEH_4421:Vehicle {id: 'VEH-4421'})
SET v_VEH_4421.pg_id = 'veh-uuid-4421',
    v_VEH_4421.plate = 'MH-02-BQ-4421',
    v_VEH_4421.label = 'MH-02-BQ-4421',
    v_VEH_4421.sublabel = 'Black Bajaj Pulsar',
    v_VEH_4421.model = 'Black Bajaj Pulsar',
    v_VEH_4421.chassis_number = 'CH-MH02-2022-990141',
    v_VEH_4421.evidence_basis = ['Station Seizure Memo #44/26'],
    v_VEH_4421.nodeType = 'VEHICLE',
    v_VEH_4421.source_type = 'VERIFIED_RECORD',
    v_VEH_4421.verified = true;
MERGE (v_VEH_9000:Vehicle {id: 'VEH-9000'})
SET v_VEH_9000.pg_id = 'veh-uuid-9000',
    v_VEH_9000.plate = 'MH-01-DE-9000',
    v_VEH_9000.label = 'MH-01-DE-9000',
    v_VEH_9000.sublabel = 'Mercedes C-Class (White)',
    v_VEH_9000.model = 'Mercedes C-Class (White)',
    v_VEH_9000.chassis_number = 'CH-MH01-2025-001092',
    v_VEH_9000.evidence_basis = ['Zaveri Bazar Parking Registry'],
    v_VEH_9000.nodeType = 'VEHICLE',
    v_VEH_9000.source_type = 'SYSTEM_DERIVED',
    v_VEH_9000.verified = false;
MERGE (v_VEH_1144:Vehicle {id: 'VEH-1144'})
SET v_VEH_1144.pg_id = 'veh-uuid-1144',
    v_VEH_1144.plate = 'MH-04-AX-1144',
    v_VEH_1144.label = 'MH-04-AX-1144',
    v_VEH_1144.sublabel = 'Container LCV Truck',
    v_VEH_1144.model = 'Container LCV Truck',
    v_VEH_1144.chassis_number = 'CH-MH04-2021-441098',
    v_VEH_1144.evidence_basis = ['Dock Port Gate Inward Manifest'],
    v_VEH_1144.nodeType = 'VEHICLE',
    v_VEH_1144.source_type = 'VERIFIED_RECORD',
    v_VEH_1144.verified = true;
MERGE (v_VEH_2005:Vehicle {id: 'VEH-2005'})
SET v_VEH_2005.pg_id = 'veh-uuid-2005',
    v_VEH_2005.plate = 'MH-02-EK-4185',
    v_VEH_2005.label = 'MH-02-EK-4185',
    v_VEH_2005.sublabel = 'Bolero Pickup 4x4',
    v_VEH_2005.model = 'Bolero Pickup 4x4',
    v_VEH_2005.chassis_number = 'CH-MH02-2024-80555',
    v_VEH_2005.evidence_basis = ['Highway Fastag ANPR toll passage #505'],
    v_VEH_2005.nodeType = 'VEHICLE',
    v_VEH_2005.source_type = 'AI_ANALYSIS',
    v_VEH_2005.verified = false;
MERGE (v_VEH_2006:Vehicle {id: 'VEH-2006'})
SET v_VEH_2006.pg_id = 'veh-uuid-2006',
    v_VEH_2006.plate = 'MH-03-EK-4222',
    v_VEH_2006.label = 'MH-03-EK-4222',
    v_VEH_2006.sublabel = 'Honda City Sedan',
    v_VEH_2006.model = 'Honda City Sedan',
    v_VEH_2006.chassis_number = 'CH-MH03-2024-80666',
    v_VEH_2006.evidence_basis = ['Highway Fastag ANPR toll passage #506'],
    v_VEH_2006.nodeType = 'VEHICLE',
    v_VEH_2006.source_type = 'VERIFIED_RECORD',
    v_VEH_2006.verified = true;
MERGE (v_VEH_2007:Vehicle {id: 'VEH-2007'})
SET v_VEH_2007.pg_id = 'veh-uuid-2007',
    v_VEH_2007.plate = 'MH-04-EK-4259',
    v_VEH_2007.label = 'MH-04-EK-4259',
    v_VEH_2007.sublabel = 'Tata Ace Delivery LCV',
    v_VEH_2007.model = 'Tata Ace Delivery LCV',
    v_VEH_2007.chassis_number = 'CH-MH04-2024-80777',
    v_VEH_2007.evidence_basis = ['Highway Fastag ANPR toll passage #507'],
    v_VEH_2007.nodeType = 'VEHICLE',
    v_VEH_2007.source_type = 'AI_ANALYSIS',
    v_VEH_2007.verified = false;
MERGE (v_VEH_2008:Vehicle {id: 'VEH-2008'})
SET v_VEH_2008.pg_id = 'veh-uuid-2008',
    v_VEH_2008.plate = 'MH-01-EK-4296',
    v_VEH_2008.label = 'MH-01-EK-4296',
    v_VEH_2008.sublabel = 'Toyota Innova Crysta',
    v_VEH_2008.model = 'Toyota Innova Crysta',
    v_VEH_2008.chassis_number = 'CH-MH01-2024-80888',
    v_VEH_2008.evidence_basis = ['Highway Fastag ANPR toll passage #508'],
    v_VEH_2008.nodeType = 'VEHICLE',
    v_VEH_2008.source_type = 'SYSTEM_DERIVED',
    v_VEH_2008.verified = false;
MERGE (v_VEH_2009:Vehicle {id: 'VEH-2009'})
SET v_VEH_2009.pg_id = 'veh-uuid-2009',
    v_VEH_2009.plate = 'MH-02-EK-4333',
    v_VEH_2009.label = 'MH-02-EK-4333',
    v_VEH_2009.sublabel = 'Hyundai Creta',
    v_VEH_2009.model = 'Hyundai Creta',
    v_VEH_2009.chassis_number = 'CH-MH02-2024-80999',
    v_VEH_2009.evidence_basis = ['Highway Fastag ANPR toll passage #509'],
    v_VEH_2009.nodeType = 'VEHICLE',
    v_VEH_2009.source_type = 'VERIFIED_RECORD',
    v_VEH_2009.verified = true;
MERGE (v_VEH_2010:Vehicle {id: 'VEH-2010'})
SET v_VEH_2010.pg_id = 'veh-uuid-2010',
    v_VEH_2010.plate = 'MH-03-EK-4370',
    v_VEH_2010.label = 'MH-03-EK-4370',
    v_VEH_2010.sublabel = 'Maruti Swift Tour',
    v_VEH_2010.model = 'Maruti Swift Tour',
    v_VEH_2010.chassis_number = 'CH-MH03-2024-81110',
    v_VEH_2010.evidence_basis = ['Highway Fastag ANPR toll passage #510'],
    v_VEH_2010.nodeType = 'VEHICLE',
    v_VEH_2010.source_type = 'SYSTEM_DERIVED',
    v_VEH_2010.verified = false;
MERGE (v_VEH_2011:Vehicle {id: 'VEH-2011'})
SET v_VEH_2011.pg_id = 'veh-uuid-2011',
    v_VEH_2011.plate = 'MH-04-EK-4407',
    v_VEH_2011.label = 'MH-04-EK-4407',
    v_VEH_2011.sublabel = 'Ashok Leyland Cargo Hauler',
    v_VEH_2011.model = 'Ashok Leyland Cargo Hauler',
    v_VEH_2011.chassis_number = 'CH-MH04-2024-81221',
    v_VEH_2011.evidence_basis = ['Highway Fastag ANPR toll passage #511'],
    v_VEH_2011.nodeType = 'VEHICLE',
    v_VEH_2011.source_type = 'AI_ANALYSIS',
    v_VEH_2011.verified = false;
MERGE (v_VEH_2012:Vehicle {id: 'VEH-2012'})
SET v_VEH_2012.pg_id = 'veh-uuid-2012',
    v_VEH_2012.plate = 'MH-01-EK-4444',
    v_VEH_2012.label = 'MH-01-EK-4444',
    v_VEH_2012.sublabel = 'Bolero Pickup 4x4',
    v_VEH_2012.model = 'Bolero Pickup 4x4',
    v_VEH_2012.chassis_number = 'CH-MH01-2024-81332',
    v_VEH_2012.evidence_basis = ['Highway Fastag ANPR toll passage #512'],
    v_VEH_2012.nodeType = 'VEHICLE',
    v_VEH_2012.source_type = 'VERIFIED_RECORD',
    v_VEH_2012.verified = true;
MERGE (v_VEH_2013:Vehicle {id: 'VEH-2013'})
SET v_VEH_2013.pg_id = 'veh-uuid-2013',
    v_VEH_2013.plate = 'MH-02-EK-4481',
    v_VEH_2013.label = 'MH-02-EK-4481',
    v_VEH_2013.sublabel = 'Honda City Sedan',
    v_VEH_2013.model = 'Honda City Sedan',
    v_VEH_2013.chassis_number = 'CH-MH02-2024-81443',
    v_VEH_2013.evidence_basis = ['Highway Fastag ANPR toll passage #513'],
    v_VEH_2013.nodeType = 'VEHICLE',
    v_VEH_2013.source_type = 'AI_ANALYSIS',
    v_VEH_2013.verified = false;
MERGE (v_VEH_2014:Vehicle {id: 'VEH-2014'})
SET v_VEH_2014.pg_id = 'veh-uuid-2014',
    v_VEH_2014.plate = 'MH-03-EK-4518',
    v_VEH_2014.label = 'MH-03-EK-4518',
    v_VEH_2014.sublabel = 'Tata Ace Delivery LCV',
    v_VEH_2014.model = 'Tata Ace Delivery LCV',
    v_VEH_2014.chassis_number = 'CH-MH03-2024-81554',
    v_VEH_2014.evidence_basis = ['Highway Fastag ANPR toll passage #514'],
    v_VEH_2014.nodeType = 'VEHICLE',
    v_VEH_2014.source_type = 'SYSTEM_DERIVED',
    v_VEH_2014.verified = false;
MERGE (v_VEH_2015:Vehicle {id: 'VEH-2015'})
SET v_VEH_2015.pg_id = 'veh-uuid-2015',
    v_VEH_2015.plate = 'MH-04-EK-4555',
    v_VEH_2015.label = 'MH-04-EK-4555',
    v_VEH_2015.sublabel = 'Toyota Innova Crysta',
    v_VEH_2015.model = 'Toyota Innova Crysta',
    v_VEH_2015.chassis_number = 'CH-MH04-2024-81665',
    v_VEH_2015.evidence_basis = ['Highway Fastag ANPR toll passage #515'],
    v_VEH_2015.nodeType = 'VEHICLE',
    v_VEH_2015.source_type = 'VERIFIED_RECORD',
    v_VEH_2015.verified = true;
MERGE (v_VEH_2016:Vehicle {id: 'VEH-2016'})
SET v_VEH_2016.pg_id = 'veh-uuid-2016',
    v_VEH_2016.plate = 'MH-01-EK-4592',
    v_VEH_2016.label = 'MH-01-EK-4592',
    v_VEH_2016.sublabel = 'Hyundai Creta',
    v_VEH_2016.model = 'Hyundai Creta',
    v_VEH_2016.chassis_number = 'CH-MH01-2024-81776',
    v_VEH_2016.evidence_basis = ['Highway Fastag ANPR toll passage #516'],
    v_VEH_2016.nodeType = 'VEHICLE',
    v_VEH_2016.source_type = 'SYSTEM_DERIVED',
    v_VEH_2016.verified = false;
MERGE (v_VEH_2017:Vehicle {id: 'VEH-2017'})
SET v_VEH_2017.pg_id = 'veh-uuid-2017',
    v_VEH_2017.plate = 'MH-02-EK-4629',
    v_VEH_2017.label = 'MH-02-EK-4629',
    v_VEH_2017.sublabel = 'Maruti Swift Tour',
    v_VEH_2017.model = 'Maruti Swift Tour',
    v_VEH_2017.chassis_number = 'CH-MH02-2024-81887',
    v_VEH_2017.evidence_basis = ['Highway Fastag ANPR toll passage #517'],
    v_VEH_2017.nodeType = 'VEHICLE',
    v_VEH_2017.source_type = 'AI_ANALYSIS',
    v_VEH_2017.verified = false;
MERGE (v_VEH_2018:Vehicle {id: 'VEH-2018'})
SET v_VEH_2018.pg_id = 'veh-uuid-2018',
    v_VEH_2018.plate = 'MH-03-EK-4666',
    v_VEH_2018.label = 'MH-03-EK-4666',
    v_VEH_2018.sublabel = 'Ashok Leyland Cargo Hauler',
    v_VEH_2018.model = 'Ashok Leyland Cargo Hauler',
    v_VEH_2018.chassis_number = 'CH-MH03-2024-81998',
    v_VEH_2018.evidence_basis = ['Highway Fastag ANPR toll passage #518'],
    v_VEH_2018.nodeType = 'VEHICLE',
    v_VEH_2018.source_type = 'VERIFIED_RECORD',
    v_VEH_2018.verified = true;
MERGE (v_VEH_2019:Vehicle {id: 'VEH-2019'})
SET v_VEH_2019.pg_id = 'veh-uuid-2019',
    v_VEH_2019.plate = 'MH-04-EK-4703',
    v_VEH_2019.label = 'MH-04-EK-4703',
    v_VEH_2019.sublabel = 'Bolero Pickup 4x4',
    v_VEH_2019.model = 'Bolero Pickup 4x4',
    v_VEH_2019.chassis_number = 'CH-MH04-2024-82109',
    v_VEH_2019.evidence_basis = ['Highway Fastag ANPR toll passage #519'],
    v_VEH_2019.nodeType = 'VEHICLE',
    v_VEH_2019.source_type = 'AI_ANALYSIS',
    v_VEH_2019.verified = false;
MERGE (v_VEH_2020:Vehicle {id: 'VEH-2020'})
SET v_VEH_2020.pg_id = 'veh-uuid-2020',
    v_VEH_2020.plate = 'MH-01-EK-4740',
    v_VEH_2020.label = 'MH-01-EK-4740',
    v_VEH_2020.sublabel = 'Honda City Sedan',
    v_VEH_2020.model = 'Honda City Sedan',
    v_VEH_2020.chassis_number = 'CH-MH01-2024-82220',
    v_VEH_2020.evidence_basis = ['Highway Fastag ANPR toll passage #520'],
    v_VEH_2020.nodeType = 'VEHICLE',
    v_VEH_2020.source_type = 'SYSTEM_DERIVED',
    v_VEH_2020.verified = false;
MERGE (v_VEH_2021:Vehicle {id: 'VEH-2021'})
SET v_VEH_2021.pg_id = 'veh-uuid-2021',
    v_VEH_2021.plate = 'MH-02-EK-4777',
    v_VEH_2021.label = 'MH-02-EK-4777',
    v_VEH_2021.sublabel = 'Tata Ace Delivery LCV',
    v_VEH_2021.model = 'Tata Ace Delivery LCV',
    v_VEH_2021.chassis_number = 'CH-MH02-2024-82331',
    v_VEH_2021.evidence_basis = ['Highway Fastag ANPR toll passage #521'],
    v_VEH_2021.nodeType = 'VEHICLE',
    v_VEH_2021.source_type = 'VERIFIED_RECORD',
    v_VEH_2021.verified = true;
MERGE (v_VEH_2022:Vehicle {id: 'VEH-2022'})
SET v_VEH_2022.pg_id = 'veh-uuid-2022',
    v_VEH_2022.plate = 'MH-03-EK-4814',
    v_VEH_2022.label = 'MH-03-EK-4814',
    v_VEH_2022.sublabel = 'Toyota Innova Crysta',
    v_VEH_2022.model = 'Toyota Innova Crysta',
    v_VEH_2022.chassis_number = 'CH-MH03-2024-82442',
    v_VEH_2022.evidence_basis = ['Highway Fastag ANPR toll passage #522'],
    v_VEH_2022.nodeType = 'VEHICLE',
    v_VEH_2022.source_type = 'SYSTEM_DERIVED',
    v_VEH_2022.verified = false;
MERGE (v_VEH_2023:Vehicle {id: 'VEH-2023'})
SET v_VEH_2023.pg_id = 'veh-uuid-2023',
    v_VEH_2023.plate = 'MH-04-EK-4851',
    v_VEH_2023.label = 'MH-04-EK-4851',
    v_VEH_2023.sublabel = 'Hyundai Creta',
    v_VEH_2023.model = 'Hyundai Creta',
    v_VEH_2023.chassis_number = 'CH-MH04-2024-82553',
    v_VEH_2023.evidence_basis = ['Highway Fastag ANPR toll passage #523'],
    v_VEH_2023.nodeType = 'VEHICLE',
    v_VEH_2023.source_type = 'AI_ANALYSIS',
    v_VEH_2023.verified = false;
MERGE (v_VEH_2024:Vehicle {id: 'VEH-2024'})
SET v_VEH_2024.pg_id = 'veh-uuid-2024',
    v_VEH_2024.plate = 'MH-01-EK-4888',
    v_VEH_2024.label = 'MH-01-EK-4888',
    v_VEH_2024.sublabel = 'Maruti Swift Tour',
    v_VEH_2024.model = 'Maruti Swift Tour',
    v_VEH_2024.chassis_number = 'CH-MH01-2024-82664',
    v_VEH_2024.evidence_basis = ['Highway Fastag ANPR toll passage #524'],
    v_VEH_2024.nodeType = 'VEHICLE',
    v_VEH_2024.source_type = 'VERIFIED_RECORD',
    v_VEH_2024.verified = true;
MERGE (v_VEH_2025:Vehicle {id: 'VEH-2025'})
SET v_VEH_2025.pg_id = 'veh-uuid-2025',
    v_VEH_2025.plate = 'MH-02-EK-4925',
    v_VEH_2025.label = 'MH-02-EK-4925',
    v_VEH_2025.sublabel = 'Ashok Leyland Cargo Hauler',
    v_VEH_2025.model = 'Ashok Leyland Cargo Hauler',
    v_VEH_2025.chassis_number = 'CH-MH02-2024-82775',
    v_VEH_2025.evidence_basis = ['Highway Fastag ANPR toll passage #525'],
    v_VEH_2025.nodeType = 'VEHICLE',
    v_VEH_2025.source_type = 'AI_ANALYSIS',
    v_VEH_2025.verified = false;

// ----------------------------------------------------------------------------
// 5. LOCATION NODES (18)
// ----------------------------------------------------------------------------
MERGE (l_LOC_302:Location {id: 'LOC-302'})
SET l_LOC_302.pg_id = 'loc-uuid-302',
    l_LOC_302.name = 'Al-Farooq Cold Storage Unit 4',
    l_LOC_302.label = 'Al-Farooq Cold Storage Unit 4',
    l_LOC_302.sublabel = 'Mumbai',
    l_LOC_302.address = 'Dockyard Road, Terminal Gate 3, Mumbai',
    l_LOC_302.city = 'Mumbai',
    l_LOC_302.latitude = 18.9612,
    l_LOC_302.longitude = 72.8431,
    l_LOC_302.evidence_basis = ['Utility Billing & Port Security Gatepass'],
    l_LOC_302.nodeType = 'LOCATION',
    l_LOC_302.source_type = 'SYSTEM_DERIVED',
    l_LOC_302.verified = false;
MERGE (l_LOC_303:Location {id: 'LOC-303'})
SET l_LOC_303.pg_id = 'loc-uuid-303',
    l_LOC_303.name = 'Zaveri Vaults Safe Deposit',
    l_LOC_303.label = 'Zaveri Vaults Safe Deposit',
    l_LOC_303.sublabel = 'Mumbai',
    l_LOC_303.address = 'Kalbadevi Road, Gate 1, Mumbai',
    l_LOC_303.city = 'Mumbai',
    l_LOC_303.latitude = 18.9515,
    l_LOC_303.longitude = 72.8311,
    l_LOC_303.evidence_basis = ['Trade transaction settlement timing correlation'],
    l_LOC_303.nodeType = 'LOCATION',
    l_LOC_303.source_type = 'AI_ANALYSIS',
    l_LOC_303.verified = false;
MERGE (l_LOC_304:Location {id: 'LOC-304'})
SET l_LOC_304.pg_id = 'loc-uuid-304',
    l_LOC_304.name = 'APMC Yard Terminal B',
    l_LOC_304.label = 'APMC Yard Terminal B',
    l_LOC_304.sublabel = 'Navi Mumbai',
    l_LOC_304.address = 'Vashi Sector 19, Navi Mumbai',
    l_LOC_304.city = 'Navi Mumbai',
    l_LOC_304.latitude = 19.076,
    l_LOC_304.longitude = 73.008,
    l_LOC_304.evidence_basis = ['APMC Market Committee Registered Merchant Office'],
    l_LOC_304.nodeType = 'LOCATION',
    l_LOC_304.source_type = 'VERIFIED_RECORD',
    l_LOC_304.verified = true;
MERGE (l_LOC_305:Location {id: 'LOC-305'})
SET l_LOC_305.pg_id = 'loc-uuid-305',
    l_LOC_305.name = 'MIDC Sector 2 Warehouse 18',
    l_LOC_305.label = 'MIDC Sector 2 Warehouse 18',
    l_LOC_305.sublabel = 'Navi Mumbai',
    l_LOC_305.address = 'TTC Industrial Area, Rabale',
    l_LOC_305.city = 'Navi Mumbai',
    l_LOC_305.latitude = 19.142,
    l_LOC_305.longitude = 73.001,
    l_LOC_305.evidence_basis = ['Industrial Lease Agreement 2024'],
    l_LOC_305.nodeType = 'LOCATION',
    l_LOC_305.source_type = 'VERIFIED_RECORD',
    l_LOC_305.verified = true;
MERGE (l_LOC_306:Location {id: 'LOC-306'})
SET l_LOC_306.pg_id = 'loc-uuid-306',
    l_LOC_306.name = 'Sewri Reclamation Timber Yard',
    l_LOC_306.label = 'Sewri Reclamation Timber Yard',
    l_LOC_306.sublabel = 'Mumbai',
    l_LOC_306.address = 'Sewri East Pier Gate',
    l_LOC_306.city = 'Mumbai',
    l_LOC_306.latitude = 18.995,
    l_LOC_306.longitude = 72.862,
    l_LOC_306.evidence_basis = ['Cell Tower Co-location Dump Zone 4'],
    l_LOC_306.nodeType = 'LOCATION',
    l_LOC_306.source_type = 'SYSTEM_DERIVED',
    l_LOC_306.verified = false;
MERGE (l_LOC_307:Location {id: 'LOC-307'})
SET l_LOC_307.pg_id = 'loc-uuid-307',
    l_LOC_307.name = 'Nhava Sheva Freight Yard 6',
    l_LOC_307.label = 'Nhava Sheva Freight Yard 6',
    l_LOC_307.sublabel = 'Navi Mumbai',
    l_LOC_307.address = 'JNPT Logistics Zone, Uran',
    l_LOC_307.city = 'Navi Mumbai',
    l_LOC_307.latitude = 18.95,
    l_LOC_307.longitude = 72.95,
    l_LOC_307.evidence_basis = ['Customs Bonded Warehouse Ledger'],
    l_LOC_307.nodeType = 'LOCATION',
    l_LOC_307.source_type = 'VERIFIED_RECORD',
    l_LOC_307.verified = true;
MERGE (l_LOC_308:Location {id: 'LOC-308'})
SET l_LOC_308.pg_id = 'loc-uuid-308',
    l_LOC_308.name = 'Wadala Truck Terminal Bay 12',
    l_LOC_308.label = 'Wadala Truck Terminal Bay 12',
    l_LOC_308.sublabel = 'Navi Mumbai',
    l_LOC_308.address = 'Wadala East Trans-Harbour',
    l_LOC_308.city = 'Navi Mumbai',
    l_LOC_308.latitude = 19.0,
    l_LOC_308.longitude = 72.85,
    l_LOC_308.evidence_basis = ['Beat constable surveillance journal ref #100'],
    l_LOC_308.nodeType = 'LOCATION',
    l_LOC_308.source_type = 'VERIFIED_RECORD',
    l_LOC_308.verified = true;
MERGE (l_LOC_309:Location {id: 'LOC-309'})
SET l_LOC_309.pg_id = 'loc-uuid-309',
    l_LOC_309.name = 'Masjid Bunder Cash Clearing Office',
    l_LOC_309.label = 'Masjid Bunder Cash Clearing Office',
    l_LOC_309.sublabel = 'Mumbai',
    l_LOC_309.address = 'Narshi Natha Street, Mandvi',
    l_LOC_309.city = 'Mumbai',
    l_LOC_309.latitude = 19.012,
    l_LOC_309.longitude = 72.865,
    l_LOC_309.evidence_basis = ['Beat constable surveillance journal ref #101'],
    l_LOC_309.nodeType = 'LOCATION',
    l_LOC_309.source_type = 'AI_ANALYSIS',
    l_LOC_309.verified = false;
MERGE (l_LOC_310:Location {id: 'LOC-310'})
SET l_LOC_310.pg_id = 'loc-uuid-310',
    l_LOC_310.name = 'Bhiwandi Textile Godown Hub',
    l_LOC_310.label = 'Bhiwandi Textile Godown Hub',
    l_LOC_310.sublabel = 'Mumbai',
    l_LOC_310.address = 'Bhiwandi Bypass Road',
    l_LOC_310.city = 'Mumbai',
    l_LOC_310.latitude = 19.024,
    l_LOC_310.longitude = 72.88,
    l_LOC_310.evidence_basis = ['Beat constable surveillance journal ref #102'],
    l_LOC_310.nodeType = 'LOCATION',
    l_LOC_310.source_type = 'SYSTEM_DERIVED',
    l_LOC_310.verified = false;
MERGE (l_LOC_311:Location {id: 'LOC-311'})
SET l_LOC_311.pg_id = 'loc-uuid-311',
    l_LOC_311.name = 'Kalamboli Steel Market Shed 9',
    l_LOC_311.label = 'Kalamboli Steel Market Shed 9',
    l_LOC_311.sublabel = 'Navi Mumbai',
    l_LOC_311.address = 'Kalamboli Logistics Node',
    l_LOC_311.city = 'Navi Mumbai',
    l_LOC_311.latitude = 19.036,
    l_LOC_311.longitude = 72.895,
    l_LOC_311.evidence_basis = ['Beat constable surveillance journal ref #103'],
    l_LOC_311.nodeType = 'LOCATION',
    l_LOC_311.source_type = 'VERIFIED_RECORD',
    l_LOC_311.verified = true;
MERGE (l_LOC_312:Location {id: 'LOC-312'})
SET l_LOC_312.pg_id = 'loc-uuid-312',
    l_LOC_312.name = 'Kurla CST Road Auto Spares Market',
    l_LOC_312.label = 'Kurla CST Road Auto Spares Market',
    l_LOC_312.sublabel = 'Mumbai',
    l_LOC_312.address = 'CST Road, Kurla West',
    l_LOC_312.city = 'Mumbai',
    l_LOC_312.latitude = 19.048,
    l_LOC_312.longitude = 72.91,
    l_LOC_312.evidence_basis = ['Beat constable surveillance journal ref #104'],
    l_LOC_312.nodeType = 'LOCATION',
    l_LOC_312.source_type = 'SYSTEM_DERIVED',
    l_LOC_312.verified = false;
MERGE (l_LOC_313:Location {id: 'LOC-313'})
SET l_LOC_313.pg_id = 'loc-uuid-313',
    l_LOC_313.name = 'Panvel Expressway Checkpost Plaza',
    l_LOC_313.label = 'Panvel Expressway Checkpost Plaza',
    l_LOC_313.sublabel = 'Pune',
    l_LOC_313.address = 'Sion-Panvel Expressway Km 24',
    l_LOC_313.city = 'Pune',
    l_LOC_313.latitude = 19.06,
    l_LOC_313.longitude = 72.925,
    l_LOC_313.evidence_basis = ['Beat constable surveillance journal ref #105'],
    l_LOC_313.nodeType = 'LOCATION',
    l_LOC_313.source_type = 'AI_ANALYSIS',
    l_LOC_313.verified = false;
MERGE (l_LOC_314:Location {id: 'LOC-314'})
SET l_LOC_314.pg_id = 'loc-uuid-314',
    l_LOC_314.name = 'Crawford Market Bullion Cellar',
    l_LOC_314.label = 'Crawford Market Bullion Cellar',
    l_LOC_314.sublabel = 'Navi Mumbai',
    l_LOC_314.address = 'Lokmanya Tilak Road',
    l_LOC_314.city = 'Navi Mumbai',
    l_LOC_314.latitude = 19.072,
    l_LOC_314.longitude = 72.94,
    l_LOC_314.evidence_basis = ['Beat constable surveillance journal ref #106'],
    l_LOC_314.nodeType = 'LOCATION',
    l_LOC_314.source_type = 'VERIFIED_RECORD',
    l_LOC_314.verified = true;
MERGE (l_LOC_315:Location {id: 'LOC-315'})
SET l_LOC_315.pg_id = 'loc-uuid-315',
    l_LOC_315.name = 'Turbhe Naka Fuel Station & Rest Area',
    l_LOC_315.label = 'Turbhe Naka Fuel Station & Rest Area',
    l_LOC_315.sublabel = 'Mumbai',
    l_LOC_315.address = 'Thane-Belapur Road',
    l_LOC_315.city = 'Mumbai',
    l_LOC_315.latitude = 19.084,
    l_LOC_315.longitude = 72.955,
    l_LOC_315.evidence_basis = ['Beat constable surveillance journal ref #107'],
    l_LOC_315.nodeType = 'LOCATION',
    l_LOC_315.source_type = 'AI_ANALYSIS',
    l_LOC_315.verified = false;
MERGE (l_LOC_316:Location {id: 'LOC-316'})
SET l_LOC_316.pg_id = 'loc-uuid-316',
    l_LOC_316.name = 'Thane Golden Dike Creek Yard',
    l_LOC_316.label = 'Thane Golden Dike Creek Yard',
    l_LOC_316.sublabel = 'Mumbai',
    l_LOC_316.address = 'Kalyan-Thane Creek Front',
    l_LOC_316.city = 'Mumbai',
    l_LOC_316.latitude = 19.096,
    l_LOC_316.longitude = 72.97,
    l_LOC_316.evidence_basis = ['Beat constable surveillance journal ref #108'],
    l_LOC_316.nodeType = 'LOCATION',
    l_LOC_316.source_type = 'SYSTEM_DERIVED',
    l_LOC_316.verified = false;
MERGE (l_LOC_317:Location {id: 'LOC-317'})
SET l_LOC_317.pg_id = 'loc-uuid-317',
    l_LOC_317.name = 'Pune Highway Toll Plaza Katraj',
    l_LOC_317.label = 'Pune Highway Toll Plaza Katraj',
    l_LOC_317.sublabel = 'Navi Mumbai',
    l_LOC_317.address = 'Old Pune-Satara Highway',
    l_LOC_317.city = 'Navi Mumbai',
    l_LOC_317.latitude = 19.108,
    l_LOC_317.longitude = 72.985,
    l_LOC_317.evidence_basis = ['Beat constable surveillance journal ref #109'],
    l_LOC_317.nodeType = 'LOCATION',
    l_LOC_317.source_type = 'VERIFIED_RECORD',
    l_LOC_317.verified = true;
MERGE (l_LOC_318:Location {id: 'LOC-318'})
SET l_LOC_318.pg_id = 'loc-uuid-318',
    l_LOC_318.name = 'Charni Road Diamond Trade Chambers',
    l_LOC_318.label = 'Charni Road Diamond Trade Chambers',
    l_LOC_318.sublabel = 'Pune',
    l_LOC_318.address = 'Opera House Lane',
    l_LOC_318.city = 'Pune',
    l_LOC_318.latitude = 19.12,
    l_LOC_318.longitude = 73.0,
    l_LOC_318.evidence_basis = ['Beat constable surveillance journal ref #110'],
    l_LOC_318.nodeType = 'LOCATION',
    l_LOC_318.source_type = 'SYSTEM_DERIVED',
    l_LOC_318.verified = false;
MERGE (l_LOC_319:Location {id: 'LOC-319'})
SET l_LOC_319.pg_id = 'loc-uuid-319',
    l_LOC_319.name = 'Dadar TT Goods Dispatch Office',
    l_LOC_319.label = 'Dadar TT Goods Dispatch Office',
    l_LOC_319.sublabel = 'Mumbai',
    l_LOC_319.address = 'Dadar Central Yard',
    l_LOC_319.city = 'Mumbai',
    l_LOC_319.latitude = 19.132,
    l_LOC_319.longitude = 73.015,
    l_LOC_319.evidence_basis = ['Beat constable surveillance journal ref #111'],
    l_LOC_319.nodeType = 'LOCATION',
    l_LOC_319.source_type = 'AI_ANALYSIS',
    l_LOC_319.verified = false;

// ----------------------------------------------------------------------------
// 6. CRIME SCENE NODES (10)
// ----------------------------------------------------------------------------
MERGE (s_SCENE_01:CrimeScene {id: 'SCENE-01'})
SET s_SCENE_01.pg_id = 'scene-uuid-01',
    s_SCENE_01.name = 'Pier 7 Cash Drop Site',
    s_SCENE_01.label = 'Pier 7 Cash Drop Site',
    s_SCENE_01.sublabel = 'Crime Scene (CASE-2026-0891)',
    s_SCENE_01.case_id = 'CASE-2026-0891',
    s_SCENE_01.location_address = 'Dockyard Road Marine Wall',
    s_SCENE_01.evidence_basis = ['Panchnama dated 2026-02-14'],
    s_SCENE_01.nodeType = 'CRIME_SCENE',
    s_SCENE_01.source_type = 'VERIFIED_RECORD',
    s_SCENE_01.verified = true;
MERGE (s_SCENE_02:CrimeScene {id: 'SCENE-02'})
SET s_SCENE_02.pg_id = 'scene-uuid-02',
    s_SCENE_02.name = 'Terminal Gate 3 Seizure Checkpoint',
    s_SCENE_02.label = 'Terminal Gate 3 Seizure Checkpoint',
    s_SCENE_02.sublabel = 'Crime Scene (CASE-2026-0891)',
    s_SCENE_02.case_id = 'CASE-2026-0891',
    s_SCENE_02.location_address = 'Port Customs Security Gate 3',
    s_SCENE_02.evidence_basis = ['Seizure memo #41/26'],
    s_SCENE_02.nodeType = 'CRIME_SCENE',
    s_SCENE_02.source_type = 'VERIFIED_RECORD',
    s_SCENE_02.verified = true;
MERGE (s_SCENE_03:CrimeScene {id: 'SCENE-03'})
SET s_SCENE_03.pg_id = 'scene-uuid-03',
    s_SCENE_03.name = 'Western Expressway SUV Intercept Point',
    s_SCENE_03.label = 'Western Expressway SUV Intercept Point',
    s_SCENE_03.sublabel = 'Crime Scene (CASE-2026-0744)',
    s_SCENE_03.case_id = 'CASE-2026-0744',
    s_SCENE_03.location_address = 'Kashimira Toll Barrier',
    s_SCENE_03.evidence_basis = ['Highway Police FIR #12/26 Spot Inspection'],
    s_SCENE_03.nodeType = 'CRIME_SCENE',
    s_SCENE_03.source_type = 'VERIFIED_RECORD',
    s_SCENE_03.verified = true;
MERGE (s_SCENE_04:CrimeScene {id: 'SCENE-04'})
SET s_SCENE_04.pg_id = 'scene-uuid-04',
    s_SCENE_04.name = 'MIDC Sector 2 Tampering Garage',
    s_SCENE_04.label = 'MIDC Sector 2 Tampering Garage',
    s_SCENE_04.sublabel = 'Crime Scene (TRX-2026-0142)',
    s_SCENE_04.case_id = 'TRX-2026-0142',
    s_SCENE_04.location_address = 'Plot 88 Industrial Shed',
    s_SCENE_04.evidence_basis = ['CID Crime Branch Search Record #09/26'],
    s_SCENE_04.nodeType = 'CRIME_SCENE',
    s_SCENE_04.source_type = 'VERIFIED_RECORD',
    s_SCENE_04.verified = true;
MERGE (s_SCENE_05:CrimeScene {id: 'SCENE-05'})
SET s_SCENE_05.pg_id = 'scene-uuid-05',
    s_SCENE_05.name = 'APMC Fake Note Exchange Stall 4',
    s_SCENE_05.label = 'APMC Fake Note Exchange Stall 4',
    s_SCENE_05.sublabel = 'Crime Scene (CASE-2026-0612)',
    s_SCENE_05.case_id = 'CASE-2026-0612',
    s_SCENE_05.location_address = 'APMC Grain Market Lane 4',
    s_SCENE_05.evidence_basis = ['Local Police Spot Panchnama #04/26'],
    s_SCENE_05.nodeType = 'CRIME_SCENE',
    s_SCENE_05.source_type = 'VERIFIED_RECORD',
    s_SCENE_05.verified = true;
MERGE (s_SCENE_06:CrimeScene {id: 'SCENE-06'})
SET s_SCENE_06.pg_id = 'scene-uuid-06',
    s_SCENE_06.name = 'Plot 88 Logistics Copper Yard',
    s_SCENE_06.label = 'Plot 88 Logistics Copper Yard',
    s_SCENE_06.sublabel = 'Crime Scene (CASE-2026-0520)',
    s_SCENE_06.case_id = 'CASE-2026-0520',
    s_SCENE_06.location_address = 'Industrial Estate Logistics Berth',
    s_SCENE_06.evidence_basis = ['Burglary FIR Inspection Memo'],
    s_SCENE_06.nodeType = 'CRIME_SCENE',
    s_SCENE_06.source_type = 'VERIFIED_RECORD',
    s_SCENE_06.verified = true;
MERGE (s_SCENE_07:CrimeScene {id: 'SCENE-07'})
SET s_SCENE_07.pg_id = 'scene-uuid-07',
    s_SCENE_07.name = 'Zaveri Chambers Back Alley Drop',
    s_SCENE_07.label = 'Zaveri Chambers Back Alley Drop',
    s_SCENE_07.sublabel = 'Crime Scene (CASE-2026-0891)',
    s_SCENE_07.case_id = 'CASE-2026-0891',
    s_SCENE_07.location_address = 'Sheikh Memon Street Alley',
    s_SCENE_07.evidence_basis = ['CCTV Footage Timestamp Correlation'],
    s_SCENE_07.nodeType = 'CRIME_SCENE',
    s_SCENE_07.source_type = 'SYSTEM_DERIVED',
    s_SCENE_07.verified = false;
MERGE (s_SCENE_08:CrimeScene {id: 'SCENE-08'})
SET s_SCENE_08.pg_id = 'scene-uuid-08',
    s_SCENE_08.name = 'Highway 48 Truck Hijacking Mile 114',
    s_SCENE_08.label = 'Highway 48 Truck Hijacking Mile 114',
    s_SCENE_08.sublabel = 'Crime Scene (TRX-2026-0137)',
    s_SCENE_08.case_id = 'TRX-2026-0137',
    s_SCENE_08.location_address = 'NH-48 Manor Toll Corridor',
    s_SCENE_08.evidence_basis = ['Highway Patrol Incident FIR #37/26'],
    s_SCENE_08.nodeType = 'CRIME_SCENE',
    s_SCENE_08.source_type = 'VERIFIED_RECORD',
    s_SCENE_08.verified = true;
MERGE (s_SCENE_09:CrimeScene {id: 'SCENE-09'})
SET s_SCENE_09.pg_id = 'scene-uuid-09',
    s_SCENE_09.name = 'Sector 9 VoIP Gateway Flat Raid',
    s_SCENE_09.label = 'Sector 9 VoIP Gateway Flat Raid',
    s_SCENE_09.sublabel = 'Crime Scene (CASE-2026-0891)',
    s_SCENE_09.case_id = 'CASE-2026-0891',
    s_SCENE_09.location_address = 'Flat 301, Blue Star Arcade',
    s_SCENE_09.evidence_basis = ['Cyber Crime Raid Inventory #88/25'],
    s_SCENE_09.nodeType = 'CRIME_SCENE',
    s_SCENE_09.source_type = 'VERIFIED_RECORD',
    s_SCENE_09.verified = true;
MERGE (s_SCENE_10:CrimeScene {id: 'SCENE-10'})
SET s_SCENE_10.pg_id = 'scene-uuid-10',
    s_SCENE_10.name = 'Sewri Creek Boat Loading Pier',
    s_SCENE_10.label = 'Sewri Creek Boat Loading Pier',
    s_SCENE_10.sublabel = 'Crime Scene (TRX-2026-0142)',
    s_SCENE_10.case_id = 'TRX-2026-0142',
    s_SCENE_10.location_address = 'Sewri Mudflats Unofficial Ramp',
    s_SCENE_10.evidence_basis = ['Satellite Night Infrared Anomaly'],
    s_SCENE_10.nodeType = 'CRIME_SCENE',
    s_SCENE_10.source_type = 'AI_ANALYSIS',
    s_SCENE_10.verified = false;

// ============================================================================
// 7. RELATIONSHIPS (~310)
// Allowed types: PHONE_COMMUNICATION, SHARED_LOCATION, SAME_VEHICLE,
// SAME_CRIME_SCENE, PREVIOUS_CASE, KNOWN_RELATIONSHIP
// ============================================================================

// 7.1 KNOWN_RELATIONSHIP
MATCH (s {id: 'CASE-2026-0891'}), (t {id: 'PER-4401'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["FIR #18/26 named primary accused", "Seizure order #14/26"],
    confidence: 0.99,
    created_at: '2026-02-14T08:30:00Z',
    label: 'Primary Suspect'
}]->(t);
MATCH (s {id: 'CASE-2026-0891'}), (t {id: 'PER-4402'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Charge sheet memo #02/26 co-accused", "Dock gate surveillance photos"],
    confidence: 0.95,
    created_at: '2026-02-14T09:15:00Z',
    label: 'Named Accomplice'
}]->(t);
MATCH (s {id: 'CASE-2026-0891'}), (t {id: 'PER-4403'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Automated ledger cross-index", "Intermediary NEFT batch #TXN448910"],
    confidence: 0.82,
    created_at: '2026-02-16T11:20:00Z',
    label: 'Bullion Intermediary'
}]->(t);
MATCH (s {id: 'CASE-2026-0891'}), (t {id: 'PER-4409'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Cross-case account clustering anomaly model", "Sub-threshold ATM split cash deposits"],
    confidence: 0.74,
    created_at: '2026-02-18T14:40:00Z',
    label: 'Mule Account Holder'
}]->(t);
MATCH (s {id: 'TRX-2026-0142'}), (t {id: 'PER-4402'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Arrest custody record at MIDC garage", "Confession statement under section 161"],
    confidence: 0.98,
    created_at: '2026-01-29T10:00:00Z',
    label: 'Vehicle Trafficker'
}]->(t);
MATCH (s {id: 'CASE-2026-0744'}), (t {id: 'PER-4401'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Toll transponder account linked to Tariq's freight firm", "Common driver statement"],
    confidence: 0.85,
    created_at: '2026-01-22T16:00:00Z',
    label: 'Vehicle Financing Subject'
}]->(t);
MATCH (s {id: 'CASE-2026-0744'}), (t {id: 'PER-4402'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Transport log interception memo", "Forged RTO document recovery"],
    confidence: 0.96,
    created_at: '2026-01-21T14:30:00Z',
    label: 'Logistics Coordinator'
}]->(t);
MATCH (s {id: 'CASE-2026-0612'}), (t {id: 'PER-4403'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["APMC fake note serial linkage to bullion vault remittances"],
    confidence: 0.80,
    created_at: '2026-01-10T12:00:00Z',
    label: 'Currency Clearing Agent'
}]->(t);
MATCH (s {id: 'CASE-2026-0520'}), (t {id: 'PER-4402'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Recovered GPS jammer receipt from Devendra's residence"],
    confidence: 0.94,
    created_at: '2025-12-19T09:45:00Z',
    label: 'Burglary Reconnaissance'
}]->(t);
MATCH (s {id: 'TRX-2026-0137'}), (t {id: 'PER-4401'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Freight manifest route overlap with copper heist getaway corridor"],
    confidence: 0.71,
    created_at: '2026-02-02T17:15:00Z',
    label: 'Suspected Syndicate Mastermind'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'PER-4402'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["124 recorded voice calls in 30 days", "Joint business tenancy agreement for cold storage"],
    confidence: 0.99,
    created_at: '2026-02-14T10:00:00Z',
    label: 'Syndicate Enforcer'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'PER-4403'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Informal trade bill settlement match", "Zaveri Chambers CCTV encounter"],
    confidence: 0.84,
    created_at: '2026-02-15T15:20:00Z',
    label: 'Cash Clearing Partner'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PER-4409'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Repeated Rs. 49,000 sub-threshold banking transactions", "Known mule ring profile"],
    confidence: 0.76,
    created_at: '2026-02-17T11:10:00Z',
    label: 'Layering Mule Recruiter'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'PER-4410'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Informant intelligence memo TRX-MEMO-310", "Direct money remittance slip #410"],
    confidence: 0.80,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Courier Subordinate'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PER-4411'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Informant intelligence memo TRX-MEMO-311", "Direct money remittance slip #451"],
    confidence: 0.68,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Front Company Operative'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'PER-4412'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Informant intelligence memo TRX-MEMO-312", "Direct money remittance slip #492"],
    confidence: 0.90,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Syndicate Associate'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PER-4413'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Informant intelligence memo TRX-MEMO-313", "Direct money remittance slip #533"],
    confidence: 0.68,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Front Company Operative'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'PER-4414'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Informant intelligence memo TRX-MEMO-314", "Direct money remittance slip #574"],
    confidence: 0.80,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Courier Subordinate'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'PER-4415'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Informant intelligence memo TRX-MEMO-315", "Direct money remittance slip #615"],
    confidence: 0.90,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Syndicate Associate'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'PER-4416'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Informant intelligence memo TRX-MEMO-316", "Direct money remittance slip #656"],
    confidence: 0.80,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Courier Subordinate'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PER-4417'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Informant intelligence memo TRX-MEMO-317", "Direct money remittance slip #697"],
    confidence: 0.68,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Front Company Operative'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'PER-4418'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Informant intelligence memo TRX-MEMO-318", "Direct money remittance slip #738"],
    confidence: 0.90,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Syndicate Associate'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PER-4419'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Informant intelligence memo TRX-MEMO-319", "Direct money remittance slip #779"],
    confidence: 0.68,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Front Company Operative'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'PER-4420'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Informant intelligence memo TRX-MEMO-320", "Direct money remittance slip #820"],
    confidence: 0.80,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Courier Subordinate'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'PER-4421'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Informant intelligence memo TRX-MEMO-321", "Direct money remittance slip #861"],
    confidence: 0.90,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Syndicate Associate'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'PER-4422'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Informant intelligence memo TRX-MEMO-322", "Direct money remittance slip #902"],
    confidence: 0.80,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Courier Subordinate'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PER-4423'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Informant intelligence memo TRX-MEMO-323", "Direct money remittance slip #943"],
    confidence: 0.68,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Front Company Operative'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'PER-4424'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Informant intelligence memo TRX-MEMO-324", "Direct money remittance slip #984"],
    confidence: 0.90,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Syndicate Associate'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PER-4425'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Informant intelligence memo TRX-MEMO-325", "Direct money remittance slip #1025"],
    confidence: 0.68,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Front Company Operative'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'PER-4426'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Informant intelligence memo TRX-MEMO-326", "Direct money remittance slip #1066"],
    confidence: 0.80,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Courier Subordinate'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'PER-4427'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Informant intelligence memo TRX-MEMO-327", "Direct money remittance slip #1107"],
    confidence: 0.90,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Syndicate Associate'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'PER-4428'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Informant intelligence memo TRX-MEMO-328", "Direct money remittance slip #1148"],
    confidence: 0.80,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Courier Subordinate'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PER-4429'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Informant intelligence memo TRX-MEMO-329", "Direct money remittance slip #1189"],
    confidence: 0.68,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Front Company Operative'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'PER-4430'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Informant intelligence memo TRX-MEMO-330", "Direct money remittance slip #1230"],
    confidence: 0.90,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Syndicate Associate'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PER-4431'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Informant intelligence memo TRX-MEMO-331", "Direct money remittance slip #1271"],
    confidence: 0.68,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Front Company Operative'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'PER-4432'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Informant intelligence memo TRX-MEMO-332", "Direct money remittance slip #1312"],
    confidence: 0.80,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Courier Subordinate'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'PER-4433'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Informant intelligence memo TRX-MEMO-333", "Direct money remittance slip #1353"],
    confidence: 0.90,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Syndicate Associate'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'PER-4434'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Informant intelligence memo TRX-MEMO-334", "Direct money remittance slip #1394"],
    confidence: 0.80,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Courier Subordinate'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PER-4435'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Informant intelligence memo TRX-MEMO-335", "Direct money remittance slip #1435"],
    confidence: 0.68,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Front Company Operative'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'PER-4436'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Informant intelligence memo TRX-MEMO-336", "Direct money remittance slip #1476"],
    confidence: 0.90,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Syndicate Associate'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PER-4437'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Informant intelligence memo TRX-MEMO-337", "Direct money remittance slip #1517"],
    confidence: 0.68,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Front Company Operative'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'PER-4438'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Informant intelligence memo TRX-MEMO-338", "Direct money remittance slip #1558"],
    confidence: 0.80,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Courier Subordinate'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'PER-4439'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Informant intelligence memo TRX-MEMO-339", "Direct money remittance slip #1599"],
    confidence: 0.90,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Syndicate Associate'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'PER-4440'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Informant intelligence memo TRX-MEMO-340", "Direct money remittance slip #1640"],
    confidence: 0.80,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Courier Subordinate'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PER-4441'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Informant intelligence memo TRX-MEMO-341", "Direct money remittance slip #1681"],
    confidence: 0.68,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Front Company Operative'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'PER-4442'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Informant intelligence memo TRX-MEMO-342", "Direct money remittance slip #1722"],
    confidence: 0.90,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Syndicate Associate'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PER-4443'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Informant intelligence memo TRX-MEMO-343", "Direct money remittance slip #1763"],
    confidence: 0.68,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Front Company Operative'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'PER-4444'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Informant intelligence memo TRX-MEMO-344", "Direct money remittance slip #1804"],
    confidence: 0.80,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Courier Subordinate'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'PER-4445'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Informant intelligence memo TRX-MEMO-345", "Direct money remittance slip #1845"],
    confidence: 0.90,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Syndicate Associate'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'PER-4446'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Informant intelligence memo TRX-MEMO-346", "Direct money remittance slip #1886"],
    confidence: 0.80,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Courier Subordinate'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PER-4447'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Informant intelligence memo TRX-MEMO-347", "Direct money remittance slip #1927"],
    confidence: 0.68,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Front Company Operative'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'PER-4448'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Informant intelligence memo TRX-MEMO-348", "Direct money remittance slip #1968"],
    confidence: 0.90,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Syndicate Associate'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PER-4449'})
CREATE (s)-[:KNOWN_RELATIONSHIP {
    source_type: 'AI_ANALYSIS',
    evidence: ["Informant intelligence memo TRX-MEMO-349", "Direct money remittance slip #2009"],
    confidence: 0.68,
    created_at: '2026-02-15T12:00:00Z',
    label: 'Front Company Operative'
}]->(t);
// 7.2 PHONE_COMMUNICATION
MATCH (s {id: 'PER-4401'}), (t {id: 'PH-98201'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["KYC CAF Application with Aadhaar bio-metric verification"],
    confidence: 1.00,
    created_at: '2026-02-14T08:00:00Z',
    label: 'Registered Subscriber'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'PH-97690'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Handset recovered during arrest search at chawl"],
    confidence: 1.00,
    created_at: '2026-02-14T09:00:00Z',
    label: 'Handset Seizure'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'PH-98210'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Commercial lease KYC utility bill verification"],
    confidence: 1.00,
    created_at: '2026-02-15T10:00:00Z',
    label: 'Office Subscriber'
}]->(t);
MATCH (s {id: 'PH-98201'}), (t {id: 'PH-98209'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Telecom switch CDR burst handshake: 18 calls under 30 seconds"],
    confidence: 0.88,
    created_at: '2026-02-14T23:45:00Z',
    label: 'CDR Burst Contact'
}]->(t);
MATCH (s {id: 'PH-98209'}), (t {id: 'PH-97690'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Sequential calls immediately following Dockyard warehouse alarm"],
    confidence: 0.84,
    created_at: '2026-02-15T02:15:00Z',
    label: 'Night Alert Relay'
}]->(t);
MATCH (s {id: 'PH-98201'}), (t {id: 'PH-98210'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["9 calls logged on trade clearing remittance deadlines"],
    confidence: 0.81,
    created_at: '2026-02-16T17:30:00Z',
    label: 'Settlement Notification'
}]->(t);
MATCH (s {id: 'PER-4414'}), (t {id: 'PH-98204'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower CDR subscriber dump match #68", "IMEI binding verification log 4"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4415'}), (t {id: 'PH-98205'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower CDR subscriber dump match #85", "IMEI binding verification log 5"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4416'}), (t {id: 'PH-98206'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tower CDR subscriber dump match #102", "IMEI binding verification log 6"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4417'}), (t {id: 'PH-98207'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower CDR subscriber dump match #119", "IMEI binding verification log 7"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4418'}), (t {id: 'PH-98208'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower CDR subscriber dump match #136", "IMEI binding verification log 8"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4419'}), (t {id: 'PH-98209'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tower CDR subscriber dump match #153", "IMEI binding verification log 9"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4420'}), (t {id: 'PH-98210'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower CDR subscriber dump match #170", "IMEI binding verification log 10"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4421'}), (t {id: 'PH-98211'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower CDR subscriber dump match #187", "IMEI binding verification log 11"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4422'}), (t {id: 'PH-98212'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tower CDR subscriber dump match #204", "IMEI binding verification log 12"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4423'}), (t {id: 'PH-98213'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower CDR subscriber dump match #221", "IMEI binding verification log 13"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4424'}), (t {id: 'PH-98214'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower CDR subscriber dump match #238", "IMEI binding verification log 14"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4425'}), (t {id: 'PH-98215'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tower CDR subscriber dump match #255", "IMEI binding verification log 15"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4426'}), (t {id: 'PH-98216'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower CDR subscriber dump match #272", "IMEI binding verification log 16"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4427'}), (t {id: 'PH-98217'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower CDR subscriber dump match #289", "IMEI binding verification log 17"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4428'}), (t {id: 'PH-98218'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tower CDR subscriber dump match #306", "IMEI binding verification log 18"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4429'}), (t {id: 'PH-98219'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower CDR subscriber dump match #323", "IMEI binding verification log 19"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4430'}), (t {id: 'PH-98220'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower CDR subscriber dump match #340", "IMEI binding verification log 20"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4431'}), (t {id: 'PH-98221'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tower CDR subscriber dump match #357", "IMEI binding verification log 21"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4432'}), (t {id: 'PH-98222'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower CDR subscriber dump match #374", "IMEI binding verification log 22"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4433'}), (t {id: 'PH-98223'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower CDR subscriber dump match #391", "IMEI binding verification log 23"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4434'}), (t {id: 'PH-98224'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tower CDR subscriber dump match #408", "IMEI binding verification log 24"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4435'}), (t {id: 'PH-98225'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower CDR subscriber dump match #425", "IMEI binding verification log 25"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4436'}), (t {id: 'PH-98226'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower CDR subscriber dump match #442", "IMEI binding verification log 26"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4437'}), (t {id: 'PH-98227'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tower CDR subscriber dump match #459", "IMEI binding verification log 27"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4438'}), (t {id: 'PH-98228'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower CDR subscriber dump match #476", "IMEI binding verification log 28"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4439'}), (t {id: 'PH-98229'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower CDR subscriber dump match #493", "IMEI binding verification log 29"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4440'}), (t {id: 'PH-98230'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tower CDR subscriber dump match #510", "IMEI binding verification log 30"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4441'}), (t {id: 'PH-98231'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower CDR subscriber dump match #527", "IMEI binding verification log 31"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4442'}), (t {id: 'PH-98232'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower CDR subscriber dump match #544", "IMEI binding verification log 32"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4443'}), (t {id: 'PH-98233'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tower CDR subscriber dump match #561", "IMEI binding verification log 33"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4444'}), (t {id: 'PH-98234'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower CDR subscriber dump match #578", "IMEI binding verification log 34"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4445'}), (t {id: 'PH-98235'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower CDR subscriber dump match #595", "IMEI binding verification log 35"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4446'}), (t {id: 'PH-98236'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tower CDR subscriber dump match #612", "IMEI binding verification log 36"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4447'}), (t {id: 'PH-98237'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower CDR subscriber dump match #629", "IMEI binding verification log 37"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4448'}), (t {id: 'PH-98238'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower CDR subscriber dump match #646", "IMEI binding verification log 38"],
    confidence: 0.92,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PER-4449'}), (t {id: 'PH-98239'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tower CDR subscriber dump match #663", "IMEI binding verification log 39"],
    confidence: 0.75,
    created_at: '2026-02-15T14:00:00Z',
    label: 'Subscriber Binding'
}]->(t);
MATCH (s {id: 'PH-98204'}), (t {id: 'PH-98209'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 58s", "Cell tower sector handshake #36"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98205'}), (t {id: 'PH-98210'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 65s", "Cell tower sector handshake #45"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98206'}), (t {id: 'PH-98211'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 72s", "Cell tower sector handshake #54"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98207'}), (t {id: 'PH-98212'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 79s", "Cell tower sector handshake #63"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98208'}), (t {id: 'PH-98213'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 86s", "Cell tower sector handshake #72"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98209'}), (t {id: 'PH-98214'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 93s", "Cell tower sector handshake #81"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98210'}), (t {id: 'PH-98215'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 100s", "Cell tower sector handshake #90"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98211'}), (t {id: 'PH-98216'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 107s", "Cell tower sector handshake #99"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98212'}), (t {id: 'PH-98217'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 114s", "Cell tower sector handshake #108"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98213'}), (t {id: 'PH-98218'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 121s", "Cell tower sector handshake #117"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98214'}), (t {id: 'PH-98219'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 128s", "Cell tower sector handshake #126"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98215'}), (t {id: 'PH-98220'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 135s", "Cell tower sector handshake #135"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98216'}), (t {id: 'PH-98221'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 142s", "Cell tower sector handshake #144"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98217'}), (t {id: 'PH-98222'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 149s", "Cell tower sector handshake #153"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98218'}), (t {id: 'PH-98223'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 36s", "Cell tower sector handshake #162"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98219'}), (t {id: 'PH-98224'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 43s", "Cell tower sector handshake #171"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98220'}), (t {id: 'PH-98225'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 50s", "Cell tower sector handshake #180"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98221'}), (t {id: 'PH-98226'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 57s", "Cell tower sector handshake #189"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98222'}), (t {id: 'PH-98227'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 64s", "Cell tower sector handshake #198"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98223'}), (t {id: 'PH-98228'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 71s", "Cell tower sector handshake #207"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98224'}), (t {id: 'PH-98229'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 78s", "Cell tower sector handshake #216"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98225'}), (t {id: 'PH-98230'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 85s", "Cell tower sector handshake #225"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98226'}), (t {id: 'PH-98231'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 92s", "Cell tower sector handshake #234"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98227'}), (t {id: 'PH-98232'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 99s", "Cell tower sector handshake #243"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98228'}), (t {id: 'PH-98233'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 106s", "Cell tower sector handshake #252"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98229'}), (t {id: 'PH-98234'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 113s", "Cell tower sector handshake #261"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98230'}), (t {id: 'PH-98235'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 120s", "Cell tower sector handshake #270"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98231'}), (t {id: 'PH-98236'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 127s", "Cell tower sector handshake #279"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98232'}), (t {id: 'PH-98237'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 134s", "Cell tower sector handshake #288"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98233'}), (t {id: 'PH-98238'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 141s", "Cell tower sector handshake #297"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98234'}), (t {id: 'PH-98239'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 148s", "Cell tower sector handshake #306"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98235'}), (t {id: 'PH-98204'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 35s", "Cell tower sector handshake #315"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98236'}), (t {id: 'PH-98205'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 42s", "Cell tower sector handshake #324"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98237'}), (t {id: 'PH-98206'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 49s", "Cell tower sector handshake #333"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98238'}), (t {id: 'PH-98207'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Call Detail Record (CDR) duration 56s", "Cell tower sector handshake #342"],
    confidence: 0.85,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
MATCH (s {id: 'PH-98239'}), (t {id: 'PH-98208'})
CREATE (s)-[:PHONE_COMMUNICATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Call Detail Record (CDR) duration 63s", "Cell tower sector handshake #351"],
    confidence: 0.65,
    created_at: '2026-02-16T01:30:00Z',
    label: 'Voice Exchange'
}]->(t);
// 7.3 SHARED_LOCATION
MATCH (s {id: 'PER-4401'}), (t {id: 'LOC-302'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Cell tower 404-45-8910 triangulation", "ANPR toll pass logs at Gate 3"],
    confidence: 0.89,
    created_at: '2026-02-14T22:00:00Z',
    label: 'Frequent Off-Hours Co-presence'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'LOC-302'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Devendra's phone pinged identical sector antenna within 8 mins of Tariq"],
    confidence: 0.87,
    created_at: '2026-02-14T22:08:00Z',
    label: 'Co-located Cell Sector'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'LOC-303'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Registered commercial occupant of Zaveri Vaults Safe Deposit"],
    confidence: 1.00,
    created_at: '2026-02-10T09:00:00Z',
    label: 'Commercial Tenancy'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'LOC-303'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Observed entering Zaveri Vaults 48h after large container arrival"],
    confidence: 0.78,
    created_at: '2026-02-16T14:15:00Z',
    label: 'Surveillance Observation'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'LOC-305'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Arrest memo executed on premises of MIDC Sector 2 Warehouse"],
    confidence: 0.99,
    created_at: '2026-01-29T11:00:00Z',
    label: 'Raid Capture Location'
}]->(t);
MATCH (s {id: 'CASE-2026-0891'}), (t {id: 'LOC-302'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Primary target of search warrant #14/26"],
    confidence: 1.00,
    created_at: '2026-02-14T08:00:00Z',
    label: 'Case Target Premises'
}]->(t);
MATCH (s {id: 'TRX-2026-0142'}), (t {id: 'LOC-305'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Focal point of vehicle chassis re-stamping racket"],
    confidence: 1.00,
    created_at: '2026-01-28T09:00:00Z',
    label: 'Illegal Workshop Site'
}]->(t);
MATCH (s {id: 'PER-4410'}), (t {id: 'LOC-312'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #130", "Electronic toll barrier timestamp #290"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4411'}), (t {id: 'LOC-313'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #143", "Electronic toll barrier timestamp #319"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4412'}), (t {id: 'LOC-314'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #156", "Electronic toll barrier timestamp #348"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4413'}), (t {id: 'LOC-315'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #169", "Electronic toll barrier timestamp #377"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4414'}), (t {id: 'LOC-316'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #182", "Electronic toll barrier timestamp #406"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4415'}), (t {id: 'LOC-317'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #195", "Electronic toll barrier timestamp #435"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4416'}), (t {id: 'LOC-318'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #208", "Electronic toll barrier timestamp #464"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4417'}), (t {id: 'LOC-319'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #221", "Electronic toll barrier timestamp #493"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4418'}), (t {id: 'LOC-302'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #234", "Electronic toll barrier timestamp #522"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4419'}), (t {id: 'LOC-303'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #247", "Electronic toll barrier timestamp #551"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4420'}), (t {id: 'LOC-304'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #260", "Electronic toll barrier timestamp #580"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4421'}), (t {id: 'LOC-305'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #273", "Electronic toll barrier timestamp #609"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4422'}), (t {id: 'LOC-306'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #286", "Electronic toll barrier timestamp #638"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4423'}), (t {id: 'LOC-307'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #299", "Electronic toll barrier timestamp #667"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4424'}), (t {id: 'LOC-308'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #312", "Electronic toll barrier timestamp #696"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4425'}), (t {id: 'LOC-309'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #325", "Electronic toll barrier timestamp #725"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4426'}), (t {id: 'LOC-310'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #338", "Electronic toll barrier timestamp #754"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4427'}), (t {id: 'LOC-311'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #351", "Electronic toll barrier timestamp #783"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4428'}), (t {id: 'LOC-312'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #364", "Electronic toll barrier timestamp #812"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4429'}), (t {id: 'LOC-313'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #377", "Electronic toll barrier timestamp #841"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4430'}), (t {id: 'LOC-314'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #390", "Electronic toll barrier timestamp #870"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4431'}), (t {id: 'LOC-315'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #403", "Electronic toll barrier timestamp #899"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4432'}), (t {id: 'LOC-316'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #416", "Electronic toll barrier timestamp #928"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4433'}), (t {id: 'LOC-317'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #429", "Electronic toll barrier timestamp #957"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4434'}), (t {id: 'LOC-318'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #442", "Electronic toll barrier timestamp #986"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4435'}), (t {id: 'LOC-319'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #455", "Electronic toll barrier timestamp #1015"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4436'}), (t {id: 'LOC-302'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #468", "Electronic toll barrier timestamp #1044"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4437'}), (t {id: 'LOC-303'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #481", "Electronic toll barrier timestamp #1073"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4438'}), (t {id: 'LOC-304'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #494", "Electronic toll barrier timestamp #1102"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4439'}), (t {id: 'LOC-305'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #507", "Electronic toll barrier timestamp #1131"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4440'}), (t {id: 'LOC-306'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #520", "Electronic toll barrier timestamp #1160"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4441'}), (t {id: 'LOC-307'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #533", "Electronic toll barrier timestamp #1189"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4442'}), (t {id: 'LOC-308'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #546", "Electronic toll barrier timestamp #1218"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4443'}), (t {id: 'LOC-309'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #559", "Electronic toll barrier timestamp #1247"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4444'}), (t {id: 'LOC-310'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #572", "Electronic toll barrier timestamp #1276"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4445'}), (t {id: 'LOC-311'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #585", "Electronic toll barrier timestamp #1305"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4446'}), (t {id: 'LOC-312'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #598", "Electronic toll barrier timestamp #1334"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4447'}), (t {id: 'LOC-313'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #611", "Electronic toll barrier timestamp #1363"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4448'}), (t {id: 'LOC-314'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tower cell site telemetry dump ref #624", "Electronic toll barrier timestamp #1392"],
    confidence: 0.82,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'PER-4449'}), (t {id: 'LOC-315'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["Tower cell site telemetry dump ref #637", "Electronic toll barrier timestamp #1421"],
    confidence: 0.70,
    created_at: '2026-02-15T18:00:00Z',
    label: 'Cell Site Co-presence'
}]->(t);
MATCH (s {id: 'VEH-2005'}), (t {id: 'LOC-307'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["ANPR automated plate recognition camera capture at LOC-307", "Security barrier RFID logging"],
    confidence: 0.72,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2006'}), (t {id: 'LOC-308'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["ANPR automated plate recognition camera capture at LOC-308", "Security barrier RFID logging"],
    confidence: 0.88,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2007'}), (t {id: 'LOC-309'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["ANPR automated plate recognition camera capture at LOC-309", "Security barrier RFID logging"],
    confidence: 0.72,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2008'}), (t {id: 'LOC-310'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["ANPR automated plate recognition camera capture at LOC-310", "Security barrier RFID logging"],
    confidence: 0.72,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2009'}), (t {id: 'LOC-311'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["ANPR automated plate recognition camera capture at LOC-311", "Security barrier RFID logging"],
    confidence: 0.88,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2010'}), (t {id: 'LOC-312'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["ANPR automated plate recognition camera capture at LOC-312", "Security barrier RFID logging"],
    confidence: 0.72,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2011'}), (t {id: 'LOC-313'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["ANPR automated plate recognition camera capture at LOC-313", "Security barrier RFID logging"],
    confidence: 0.72,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2012'}), (t {id: 'LOC-314'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["ANPR automated plate recognition camera capture at LOC-314", "Security barrier RFID logging"],
    confidence: 0.88,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2013'}), (t {id: 'LOC-315'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["ANPR automated plate recognition camera capture at LOC-315", "Security barrier RFID logging"],
    confidence: 0.72,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2014'}), (t {id: 'LOC-316'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["ANPR automated plate recognition camera capture at LOC-316", "Security barrier RFID logging"],
    confidence: 0.72,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2015'}), (t {id: 'LOC-317'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["ANPR automated plate recognition camera capture at LOC-317", "Security barrier RFID logging"],
    confidence: 0.88,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2016'}), (t {id: 'LOC-318'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["ANPR automated plate recognition camera capture at LOC-318", "Security barrier RFID logging"],
    confidence: 0.72,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2017'}), (t {id: 'LOC-319'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["ANPR automated plate recognition camera capture at LOC-319", "Security barrier RFID logging"],
    confidence: 0.72,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2018'}), (t {id: 'LOC-302'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["ANPR automated plate recognition camera capture at LOC-302", "Security barrier RFID logging"],
    confidence: 0.88,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2019'}), (t {id: 'LOC-303'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["ANPR automated plate recognition camera capture at LOC-303", "Security barrier RFID logging"],
    confidence: 0.72,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2020'}), (t {id: 'LOC-304'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["ANPR automated plate recognition camera capture at LOC-304", "Security barrier RFID logging"],
    confidence: 0.72,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2021'}), (t {id: 'LOC-305'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["ANPR automated plate recognition camera capture at LOC-305", "Security barrier RFID logging"],
    confidence: 0.88,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2022'}), (t {id: 'LOC-306'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["ANPR automated plate recognition camera capture at LOC-306", "Security barrier RFID logging"],
    confidence: 0.72,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2023'}), (t {id: 'LOC-307'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["ANPR automated plate recognition camera capture at LOC-307", "Security barrier RFID logging"],
    confidence: 0.72,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2024'}), (t {id: 'LOC-308'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["ANPR automated plate recognition camera capture at LOC-308", "Security barrier RFID logging"],
    confidence: 0.88,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
MATCH (s {id: 'VEH-2025'}), (t {id: 'LOC-309'})
CREATE (s)-[:SHARED_LOCATION {
    source_type: 'AI_ANALYSIS',
    evidence: ["ANPR automated plate recognition camera capture at LOC-309", "Security barrier RFID logging"],
    confidence: 0.72,
    created_at: '2026-02-16T08:30:00Z',
    label: 'Vehicle Parking / Staging'
}]->(t);
// 7.4 SAME_VEHICLE
MATCH (s {id: 'PER-4401'}), (t {id: 'VEH-8902'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["RTO Vahan portal official registration ownership"],
    confidence: 1.00,
    created_at: '2026-02-14T08:00:00Z',
    label: 'Registered Owner'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'VEH-8902'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Toll plaza camera capture showing Devendra in driver seat", "Fingerprints recovered from steering wheel"],
    confidence: 0.94,
    created_at: '2026-02-14T23:10:00Z',
    label: 'Identified Driver'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'VEH-4421'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Vehicle keys seized from Devendra's pockets at arrest"],
    confidence: 1.00,
    created_at: '2026-01-29T10:30:00Z',
    label: 'Recovered in Possession'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'VEH-1144'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Freight bill of lading consignee company vehicle lease"],
    confidence: 0.97,
    created_at: '2026-02-10T14:00:00Z',
    label: 'Fleet Controller'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'VEH-9000'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["RTO Vahan registration matching Nilesh Vora"],
    confidence: 1.00,
    created_at: '2026-02-05T12:00:00Z',
    label: 'Registered Owner'
}]->(t);
MATCH (s {id: 'CASE-2026-0744'}), (t {id: 'VEH-8902'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Vehicle seized in connection with interstate stolen SUV registry"],
    confidence: 0.98,
    created_at: '2026-01-21T09:00:00Z',
    label: 'Impounded Evidence'
}]->(t);
MATCH (s {id: 'TRX-2026-0142'}), (t {id: 'VEH-5510'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Chassis serial number tampered in MIDC workshop raid"],
    confidence: 0.99,
    created_at: '2026-01-28T14:00:00Z',
    label: 'Tampered Vehicle'
}]->(t);
MATCH (s {id: 'PER-4415'}), (t {id: 'VEH-2005'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4415", "Insurance certificate named driver"],
    confidence: 0.74,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4416'}), (t {id: 'VEH-2006'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4416", "Insurance certificate named driver"],
    confidence: 0.92,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4417'}), (t {id: 'VEH-2007'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4417", "Insurance certificate named driver"],
    confidence: 0.74,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4418'}), (t {id: 'VEH-2008'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4418", "Insurance certificate named driver"],
    confidence: 0.92,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4419'}), (t {id: 'VEH-2009'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4419", "Insurance certificate named driver"],
    confidence: 0.74,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4420'}), (t {id: 'VEH-2010'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4420", "Insurance certificate named driver"],
    confidence: 0.92,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4421'}), (t {id: 'VEH-2011'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4421", "Insurance certificate named driver"],
    confidence: 0.74,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4422'}), (t {id: 'VEH-2012'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4422", "Insurance certificate named driver"],
    confidence: 0.92,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4423'}), (t {id: 'VEH-2013'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4423", "Insurance certificate named driver"],
    confidence: 0.74,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4424'}), (t {id: 'VEH-2014'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4424", "Insurance certificate named driver"],
    confidence: 0.92,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4425'}), (t {id: 'VEH-2015'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4425", "Insurance certificate named driver"],
    confidence: 0.74,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4426'}), (t {id: 'VEH-2016'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4426", "Insurance certificate named driver"],
    confidence: 0.92,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4427'}), (t {id: 'VEH-2017'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4427", "Insurance certificate named driver"],
    confidence: 0.74,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4428'}), (t {id: 'VEH-2018'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4428", "Insurance certificate named driver"],
    confidence: 0.92,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4429'}), (t {id: 'VEH-2019'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4429", "Insurance certificate named driver"],
    confidence: 0.74,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4430'}), (t {id: 'VEH-2020'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4430", "Insurance certificate named driver"],
    confidence: 0.92,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4431'}), (t {id: 'VEH-2021'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4431", "Insurance certificate named driver"],
    confidence: 0.74,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4432'}), (t {id: 'VEH-2022'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4432", "Insurance certificate named driver"],
    confidence: 0.92,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4433'}), (t {id: 'VEH-2023'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4433", "Insurance certificate named driver"],
    confidence: 0.74,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4434'}), (t {id: 'VEH-2024'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4434", "Insurance certificate named driver"],
    confidence: 0.92,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4435'}), (t {id: 'VEH-2025'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Traffic violation challan with driver Aadhaar matching PER-4435", "Insurance certificate named driver"],
    confidence: 0.74,
    created_at: '2026-02-12T10:00:00Z',
    label: 'Authorized Operator'
}]->(t);
MATCH (s {id: 'PER-4415'}), (t {id: 'PER-4430'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Toll cabin forward facial recognition match in vehicle VEH-2005", "Shared inter-city trip ticket"],
    confidence: 0.69,
    created_at: '2026-02-13T16:00:00Z',
    label: 'Co-Travelers'
}]->(t);
MATCH (s {id: 'PER-4416'}), (t {id: 'PER-4431'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Toll cabin forward facial recognition match in vehicle VEH-2006", "Shared inter-city trip ticket"],
    confidence: 0.81,
    created_at: '2026-02-13T16:00:00Z',
    label: 'Co-Travelers'
}]->(t);
MATCH (s {id: 'PER-4417'}), (t {id: 'PER-4432'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Toll cabin forward facial recognition match in vehicle VEH-2007", "Shared inter-city trip ticket"],
    confidence: 0.69,
    created_at: '2026-02-13T16:00:00Z',
    label: 'Co-Travelers'
}]->(t);
MATCH (s {id: 'PER-4418'}), (t {id: 'PER-4433'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Toll cabin forward facial recognition match in vehicle VEH-2008", "Shared inter-city trip ticket"],
    confidence: 0.81,
    created_at: '2026-02-13T16:00:00Z',
    label: 'Co-Travelers'
}]->(t);
MATCH (s {id: 'PER-4419'}), (t {id: 'PER-4434'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Toll cabin forward facial recognition match in vehicle VEH-2009", "Shared inter-city trip ticket"],
    confidence: 0.69,
    created_at: '2026-02-13T16:00:00Z',
    label: 'Co-Travelers'
}]->(t);
MATCH (s {id: 'PER-4420'}), (t {id: 'PER-4435'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Toll cabin forward facial recognition match in vehicle VEH-2010", "Shared inter-city trip ticket"],
    confidence: 0.81,
    created_at: '2026-02-13T16:00:00Z',
    label: 'Co-Travelers'
}]->(t);
MATCH (s {id: 'PER-4421'}), (t {id: 'PER-4436'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Toll cabin forward facial recognition match in vehicle VEH-2011", "Shared inter-city trip ticket"],
    confidence: 0.69,
    created_at: '2026-02-13T16:00:00Z',
    label: 'Co-Travelers'
}]->(t);
MATCH (s {id: 'PER-4422'}), (t {id: 'PER-4437'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Toll cabin forward facial recognition match in vehicle VEH-2012", "Shared inter-city trip ticket"],
    confidence: 0.81,
    created_at: '2026-02-13T16:00:00Z',
    label: 'Co-Travelers'
}]->(t);
MATCH (s {id: 'PER-4423'}), (t {id: 'PER-4438'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Toll cabin forward facial recognition match in vehicle VEH-2013", "Shared inter-city trip ticket"],
    confidence: 0.69,
    created_at: '2026-02-13T16:00:00Z',
    label: 'Co-Travelers'
}]->(t);
MATCH (s {id: 'PER-4424'}), (t {id: 'PER-4439'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Toll cabin forward facial recognition match in vehicle VEH-2014", "Shared inter-city trip ticket"],
    confidence: 0.81,
    created_at: '2026-02-13T16:00:00Z',
    label: 'Co-Travelers'
}]->(t);
MATCH (s {id: 'PER-4425'}), (t {id: 'PER-4440'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Toll cabin forward facial recognition match in vehicle VEH-2015", "Shared inter-city trip ticket"],
    confidence: 0.69,
    created_at: '2026-02-13T16:00:00Z',
    label: 'Co-Travelers'
}]->(t);
MATCH (s {id: 'PER-4426'}), (t {id: 'PER-4441'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Toll cabin forward facial recognition match in vehicle VEH-2016", "Shared inter-city trip ticket"],
    confidence: 0.81,
    created_at: '2026-02-13T16:00:00Z',
    label: 'Co-Travelers'
}]->(t);
MATCH (s {id: 'PER-4427'}), (t {id: 'PER-4442'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Toll cabin forward facial recognition match in vehicle VEH-2017", "Shared inter-city trip ticket"],
    confidence: 0.69,
    created_at: '2026-02-13T16:00:00Z',
    label: 'Co-Travelers'
}]->(t);
MATCH (s {id: 'PER-4428'}), (t {id: 'PER-4443'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Toll cabin forward facial recognition match in vehicle VEH-2018", "Shared inter-city trip ticket"],
    confidence: 0.81,
    created_at: '2026-02-13T16:00:00Z',
    label: 'Co-Travelers'
}]->(t);
MATCH (s {id: 'PER-4429'}), (t {id: 'PER-4444'})
CREATE (s)-[:SAME_VEHICLE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Toll cabin forward facial recognition match in vehicle VEH-2019", "Shared inter-city trip ticket"],
    confidence: 0.69,
    created_at: '2026-02-13T16:00:00Z',
    label: 'Co-Travelers'
}]->(t);
// 7.5 SAME_CRIME_SCENE
MATCH (s {id: 'CASE-2026-0891'}), (t {id: 'SCENE-01'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Primary seizure FIR #18/26 location panchnama"],
    confidence: 1.00,
    created_at: '2026-02-14T03:00:00Z',
    label: 'Primary Incident Site'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'SCENE-01'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tariq's phone pinged Pier 7 tower 14 minutes before seizure"],
    confidence: 0.89,
    created_at: '2026-02-14T03:01:00Z',
    label: 'Scene Cell Proximity'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'SCENE-01'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Devendra apprehended on site attempting to flee in skiff"],
    confidence: 1.00,
    created_at: '2026-02-14T03:15:00Z',
    label: 'Apprehended On Scene'
}]->(t);
MATCH (s {id: 'VEH-8902'}), (t {id: 'SCENE-01'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Vehicle impounded with motor running at Pier 7 slipway"],
    confidence: 1.00,
    created_at: '2026-02-14T03:20:00Z',
    label: 'Impounded At Scene'
}]->(t);
MATCH (s {id: 'CASE-2026-0891'}), (t {id: 'SCENE-02'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Customs container seizure report #41/26"],
    confidence: 1.00,
    created_at: '2026-02-15T09:00:00Z',
    label: 'Secondary Seizure Site'
}]->(t);
MATCH (s {id: 'CASE-2026-0744'}), (t {id: 'SCENE-03'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Highway Police spot interception panchnama"],
    confidence: 1.00,
    created_at: '2026-01-20T11:00:00Z',
    label: 'Highway Intercept Site'
}]->(t);
MATCH (s {id: 'TRX-2026-0142'}), (t {id: 'SCENE-04'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Raid inspection inventory dated 2026-01-28"],
    confidence: 1.00,
    created_at: '2026-01-28T14:30:00Z',
    label: 'Workshop Raid Scene'
}]->(t);
MATCH (s {id: 'CASE-2026-0612'}), (t {id: 'SCENE-05'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Market vendor fake currency recovery panchnama"],
    confidence: 1.00,
    created_at: '2026-01-08T15:00:00Z',
    label: 'Distribution Point'
}]->(t);
MATCH (s {id: 'CASE-2026-0520'}), (t {id: 'SCENE-06'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Warehouse burglary break-in panchnama and forensic lifts"],
    confidence: 1.00,
    created_at: '2025-12-18T07:30:00Z',
    label: 'Burglary Point of Entry'
}]->(t);
MATCH (s {id: 'CASE-2026-0891'}), (t {id: 'SCENE-07'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Correlated with cash transfer timings via CCTV metadata"],
    confidence: 0.77,
    created_at: '2026-02-17T18:00:00Z',
    label: 'Identified Handover Point'
}]->(t);
MATCH (s {id: 'PER-4430'}), (t {id: 'SCENE-01'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Crime scene forensic lifting memo #0", "CCTV timeline correlate at SCENE-01"],
    confidence: 0.88,
    created_at: '2026-02-14T04:00:00Z',
    label: 'Present At Scene'
}]->(t);
MATCH (s {id: 'PER-4431'}), (t {id: 'SCENE-02'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Crime scene forensic lifting memo #11", "CCTV timeline correlate at SCENE-02"],
    confidence: 0.72,
    created_at: '2026-02-14T04:00:00Z',
    label: 'Present At Scene'
}]->(t);
MATCH (s {id: 'PER-4432'}), (t {id: 'SCENE-03'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Crime scene forensic lifting memo #22", "CCTV timeline correlate at SCENE-03"],
    confidence: 0.88,
    created_at: '2026-02-14T04:00:00Z',
    label: 'Present At Scene'
}]->(t);
MATCH (s {id: 'PER-4433'}), (t {id: 'SCENE-04'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Crime scene forensic lifting memo #33", "CCTV timeline correlate at SCENE-04"],
    confidence: 0.72,
    created_at: '2026-02-14T04:00:00Z',
    label: 'Present At Scene'
}]->(t);
MATCH (s {id: 'PER-4434'}), (t {id: 'SCENE-05'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Crime scene forensic lifting memo #44", "CCTV timeline correlate at SCENE-05"],
    confidence: 0.88,
    created_at: '2026-02-14T04:00:00Z',
    label: 'Present At Scene'
}]->(t);
MATCH (s {id: 'PER-4435'}), (t {id: 'SCENE-06'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Crime scene forensic lifting memo #55", "CCTV timeline correlate at SCENE-06"],
    confidence: 0.72,
    created_at: '2026-02-14T04:00:00Z',
    label: 'Present At Scene'
}]->(t);
MATCH (s {id: 'PER-4436'}), (t {id: 'SCENE-07'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Crime scene forensic lifting memo #66", "CCTV timeline correlate at SCENE-07"],
    confidence: 0.88,
    created_at: '2026-02-14T04:00:00Z',
    label: 'Present At Scene'
}]->(t);
MATCH (s {id: 'PER-4437'}), (t {id: 'SCENE-08'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Crime scene forensic lifting memo #77", "CCTV timeline correlate at SCENE-08"],
    confidence: 0.72,
    created_at: '2026-02-14T04:00:00Z',
    label: 'Present At Scene'
}]->(t);
MATCH (s {id: 'PER-4438'}), (t {id: 'SCENE-09'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Crime scene forensic lifting memo #88", "CCTV timeline correlate at SCENE-09"],
    confidence: 0.88,
    created_at: '2026-02-14T04:00:00Z',
    label: 'Present At Scene'
}]->(t);
MATCH (s {id: 'PER-4439'}), (t {id: 'SCENE-10'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Crime scene forensic lifting memo #99", "CCTV timeline correlate at SCENE-10"],
    confidence: 0.72,
    created_at: '2026-02-14T04:00:00Z',
    label: 'Present At Scene'
}]->(t);
MATCH (s {id: 'VEH-2005'}), (t {id: 'SCENE-01'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tire tread casting correlation panchnama at SCENE-01", "Camera snapshot entering crime perimeter"],
    confidence: 0.90,
    created_at: '2026-02-14T04:30:00Z',
    label: 'Vehicle At Crime Scene'
}]->(t);
MATCH (s {id: 'VEH-2006'}), (t {id: 'SCENE-02'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tire tread casting correlation panchnama at SCENE-02", "Camera snapshot entering crime perimeter"],
    confidence: 0.74,
    created_at: '2026-02-14T04:30:00Z',
    label: 'Vehicle At Crime Scene'
}]->(t);
MATCH (s {id: 'VEH-2007'}), (t {id: 'SCENE-03'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tire tread casting correlation panchnama at SCENE-03", "Camera snapshot entering crime perimeter"],
    confidence: 0.90,
    created_at: '2026-02-14T04:30:00Z',
    label: 'Vehicle At Crime Scene'
}]->(t);
MATCH (s {id: 'VEH-2008'}), (t {id: 'SCENE-04'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tire tread casting correlation panchnama at SCENE-04", "Camera snapshot entering crime perimeter"],
    confidence: 0.74,
    created_at: '2026-02-14T04:30:00Z',
    label: 'Vehicle At Crime Scene'
}]->(t);
MATCH (s {id: 'VEH-2009'}), (t {id: 'SCENE-05'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tire tread casting correlation panchnama at SCENE-05", "Camera snapshot entering crime perimeter"],
    confidence: 0.90,
    created_at: '2026-02-14T04:30:00Z',
    label: 'Vehicle At Crime Scene'
}]->(t);
MATCH (s {id: 'VEH-2010'}), (t {id: 'SCENE-06'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tire tread casting correlation panchnama at SCENE-06", "Camera snapshot entering crime perimeter"],
    confidence: 0.74,
    created_at: '2026-02-14T04:30:00Z',
    label: 'Vehicle At Crime Scene'
}]->(t);
MATCH (s {id: 'VEH-2011'}), (t {id: 'SCENE-07'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tire tread casting correlation panchnama at SCENE-07", "Camera snapshot entering crime perimeter"],
    confidence: 0.90,
    created_at: '2026-02-14T04:30:00Z',
    label: 'Vehicle At Crime Scene'
}]->(t);
MATCH (s {id: 'VEH-2012'}), (t {id: 'SCENE-08'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tire tread casting correlation panchnama at SCENE-08", "Camera snapshot entering crime perimeter"],
    confidence: 0.74,
    created_at: '2026-02-14T04:30:00Z',
    label: 'Vehicle At Crime Scene'
}]->(t);
MATCH (s {id: 'VEH-2013'}), (t {id: 'SCENE-09'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Tire tread casting correlation panchnama at SCENE-09", "Camera snapshot entering crime perimeter"],
    confidence: 0.90,
    created_at: '2026-02-14T04:30:00Z',
    label: 'Vehicle At Crime Scene'
}]->(t);
MATCH (s {id: 'VEH-2014'}), (t {id: 'SCENE-10'})
CREATE (s)-[:SAME_CRIME_SCENE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Tire tread casting correlation panchnama at SCENE-10", "Camera snapshot entering crime perimeter"],
    confidence: 0.74,
    created_at: '2026-02-14T04:30:00Z',
    label: 'Vehicle At Crime Scene'
}]->(t);
// 7.6 PREVIOUS_CASE
MATCH (s {id: 'PER-4401'}), (t {id: 'CASE-2026-0891'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["FIR #18/26 primary subject charge sheet"],
    confidence: 1.00,
    created_at: '2026-02-14T08:00:00Z',
    label: 'Charge Sheet Subject'
}]->(t);
MATCH (s {id: 'PER-4401'}), (t {id: 'CASE-2026-0520'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Similar logistics staging patterns noted in 2025 copper theft"],
    confidence: 0.79,
    created_at: '2025-12-20T10:00:00Z',
    label: 'Pattern Modus Operandi'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'CASE-2026-0744'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Named accomplice in inter-state vehicle theft FIR #12/26"],
    confidence: 0.98,
    created_at: '2026-01-21T09:00:00Z',
    label: 'Prior Accused'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'CASE-2026-0520'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Conviction record for industrial yard trespassing 2025"],
    confidence: 1.00,
    created_at: '2025-12-22T14:00:00Z',
    label: 'Prior Conviction'
}]->(t);
MATCH (s {id: 'PER-4402'}), (t {id: 'TRX-2026-0142'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Primary accused in garage chassis tampering syndicate"],
    confidence: 1.00,
    created_at: '2026-01-28T09:30:00Z',
    label: 'Current Accused'
}]->(t);
MATCH (s {id: 'PER-4403'}), (t {id: 'CASE-2026-0612'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["FIU cross-match with counterfeit currency accounts"],
    confidence: 0.83,
    created_at: '2026-01-09T11:00:00Z',
    label: 'Financial Clearing Link'
}]->(t);
MATCH (s {id: 'CASE-2026-0891'}), (t {id: 'TRX-2026-0137'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Common shell companies identified across container freight heists"],
    confidence: 0.81,
    created_at: '2026-02-02T16:00:00Z',
    label: 'Syndicate Commonality'
}]->(t);
MATCH (s {id: 'CASE-2026-0744'}), (t {id: 'TRX-2026-0142'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Identical counterfeit RTO rubber stamps seized in both operations"],
    confidence: 0.99,
    created_at: '2026-01-29T15:00:00Z',
    label: 'Shared Forgery Source'
}]->(t);
MATCH (s {id: 'CASE-2026-0520'}), (t {id: 'TRX-2026-0137'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Serial number overlap of recovered industrial cutting torches"],
    confidence: 0.87,
    created_at: '2026-02-01T12:00:00Z',
    label: 'Toolmark Consistency'
}]->(t);
MATCH (s {id: 'PER-4410'}), (t {id: 'CASE-2026-0612'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Station register record #REG-2026-110", "Case diary entry signed by lead IO"],
    confidence: 0.91,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4411'}), (t {id: 'CASE-2026-0520'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Station register record #REG-2026-111", "Case diary entry signed by lead IO"],
    confidence: 0.73,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4412'}), (t {id: 'CASE-2026-0891'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Station register record #REG-2026-112", "Case diary entry signed by lead IO"],
    confidence: 0.91,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4413'}), (t {id: 'TRX-2026-0142'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Station register record #REG-2026-113", "Case diary entry signed by lead IO"],
    confidence: 0.73,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4414'}), (t {id: 'TRX-2026-0137'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Station register record #REG-2026-114", "Case diary entry signed by lead IO"],
    confidence: 0.91,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4415'}), (t {id: 'CASE-2026-0744'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Station register record #REG-2026-115", "Case diary entry signed by lead IO"],
    confidence: 0.73,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4416'}), (t {id: 'CASE-2026-0612'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Station register record #REG-2026-116", "Case diary entry signed by lead IO"],
    confidence: 0.91,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4417'}), (t {id: 'CASE-2026-0520'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Station register record #REG-2026-117", "Case diary entry signed by lead IO"],
    confidence: 0.73,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4418'}), (t {id: 'CASE-2026-0891'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Station register record #REG-2026-118", "Case diary entry signed by lead IO"],
    confidence: 0.91,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4419'}), (t {id: 'TRX-2026-0142'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Station register record #REG-2026-119", "Case diary entry signed by lead IO"],
    confidence: 0.73,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4420'}), (t {id: 'TRX-2026-0137'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Station register record #REG-2026-120", "Case diary entry signed by lead IO"],
    confidence: 0.91,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4421'}), (t {id: 'CASE-2026-0744'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Station register record #REG-2026-121", "Case diary entry signed by lead IO"],
    confidence: 0.73,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4422'}), (t {id: 'CASE-2026-0612'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Station register record #REG-2026-122", "Case diary entry signed by lead IO"],
    confidence: 0.91,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4423'}), (t {id: 'CASE-2026-0520'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Station register record #REG-2026-123", "Case diary entry signed by lead IO"],
    confidence: 0.73,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4424'}), (t {id: 'CASE-2026-0891'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Station register record #REG-2026-124", "Case diary entry signed by lead IO"],
    confidence: 0.91,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4425'}), (t {id: 'TRX-2026-0142'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Station register record #REG-2026-125", "Case diary entry signed by lead IO"],
    confidence: 0.73,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4426'}), (t {id: 'TRX-2026-0137'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Station register record #REG-2026-126", "Case diary entry signed by lead IO"],
    confidence: 0.91,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4427'}), (t {id: 'CASE-2026-0744'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Station register record #REG-2026-127", "Case diary entry signed by lead IO"],
    confidence: 0.73,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4428'}), (t {id: 'CASE-2026-0612'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Station register record #REG-2026-128", "Case diary entry signed by lead IO"],
    confidence: 0.91,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4429'}), (t {id: 'CASE-2026-0520'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Station register record #REG-2026-129", "Case diary entry signed by lead IO"],
    confidence: 0.73,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4430'}), (t {id: 'CASE-2026-0891'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Station register record #REG-2026-130", "Case diary entry signed by lead IO"],
    confidence: 0.91,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4431'}), (t {id: 'TRX-2026-0142'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'AI_ANALYSIS',
    evidence: ["Station register record #REG-2026-131", "Case diary entry signed by lead IO"],
    confidence: 0.73,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4432'}), (t {id: 'TRX-2026-0137'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Station register record #REG-2026-132", "Case diary entry signed by lead IO"],
    confidence: 0.91,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4433'}), (t {id: 'CASE-2026-0744'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'VERIFIED_RECORD',
    evidence: ["Station register record #REG-2026-133", "Case diary entry signed by lead IO"],
    confidence: 0.73,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);
MATCH (s {id: 'PER-4434'}), (t {id: 'CASE-2026-0612'})
CREATE (s)-[:PREVIOUS_CASE {
    source_type: 'SYSTEM_DERIVED',
    evidence: ["Station register record #REG-2026-134", "Case diary entry signed by lead IO"],
    confidence: 0.91,
    created_at: '2026-01-15T10:00:00Z',
    label: 'Associated In Case Record'
}]->(t);

// Final total relationships emitted: 306