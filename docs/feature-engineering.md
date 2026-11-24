# TRACE-X Connection Scoring: Feature Engineering Specification

This document catalogues every engineered feature, its transformation logic, its source raw column(s), and its analytical rationale for the Missing Link Analysis connection scoring model.

---

## 1. Feature Catalog

All features are engineered strictly from the confirmed 16 columns present in `TraceX_3Million_Unique_Cases.csv`.

| # | Engineered Feature Name | Output Dtype | Source Column(s) | Transformation / Logic | Analytical Rationale |
|---|-------------------------|--------------|------------------|------------------------|----------------------|
| 1 | `rel_type_code` | `int8` | `Relationship` | Integer encoded index (0–9) across 10 relationship classes | Distinguishes distinct types of connection modes |
| 2 | `is_high_intimacy_rel` | `int8` (0/1) | `Relationship` | 1 if `Relationship` in `{'financially_connected', 'worked_with', 'associated_with', 'knows'}`, else 0 | Captures high-confidence direct interpersonal or financial ties |
| 3 | `is_vehicle_link` | `int8` (0/1) | `Relationship` | 1 if `Relationship == 'linked_to_vehicle'`, else 0 | Indicates vehicular co-utilization |
| 4 | `is_location_visit` | `int8` (0/1) | `Relationship` | 1 if `Relationship == 'visited_location'`, else 0 | Identifies geographic co-presence |
| 5 | `is_witness_reported` | `int8` (0/1) | `Relationship` | 1 if `Relationship` in `{'witnessed', 'reported_by'}`, else 0 | Separates formal testimonial connections from illicit ties |
| 6 | `case_type_code` | `int8` | `CaseType` | Integer encoded index (0–24) across 25 crime categories | Contextualizes relationship under specific crime typology |
| 7 | `is_financial_or_cyber` | `int8` (0/1) | `CaseType` | 1 if `CaseType` in `{'Banking Fraud', 'Financial Fraud', 'Tax Fraud', 'Cyber Fraud', 'Phishing'}`, else 0 | Highlights complex layered white-collar and cyber crimes |
| 8 | `is_organized_crime` | `int8` (0/1) | `CaseType` | 1 if `CaseType` in `{'Organized Crime', 'Smuggling', 'Extortion', 'Illegal Mining'}`, else 0 | Highlights hierarchical illicit syndicate behavior |
| 9 | `case_status_code` | `int8` | `CaseStatus` | Integer encoded index (0–6) across 7 legal lifecycle stages | Indicates stage of judicial and investigative validation |
| 10 | `is_case_adjudicated` | `int8` (0/1) | `CaseStatus` | 1 if `CaseStatus` in `{'Resolved', 'Closed', 'Charges Filed'}`, else 0 | Distinguishes mature verified cases from early intake |
| 11 | `person_role_code` | `int8` | `PersonRole` | Integer encoded index (0–9) across 10 subject roles | Encodes the operational capacity of the primary subject |
| 12 | `is_suspect_role` | `int8` (0/1) | `PersonRole` | 1 if `PersonRole` in `{'Person of Interest', 'Associate', 'Owner', 'Driver'}`, else 0 | Flags high-risk operational subjects |
| 13 | `is_witness_or_victim`| `int8` (0/1) | `PersonRole` | 1 if `PersonRole` in `{'Witness', 'Victim', 'Complainant'}`, else 0 | Flags low-risk cooperative entities |
| 14 | `activity_code` | `int8` | `Activity` | Integer encoded index (0–9) across 10 activity types | Identifies the recorded operational interaction |
| 15 | `is_hard_telemetry_act` | `int8` (0/1) | `Activity` | 1 if `Activity` in `{'Transaction recorded', 'Communication logged', 'Asset linked'}`, else 0 | Differentiates hard logs from narrative documentation |
| 16 | `evidence_type_code` | `int8` | `EvidenceType` | Integer encoded index (0–9) across 10 evidence classes | Distinguishes evidence legal modality |
| 17 | `is_forensic_evidence` | `int8` (0/1) | `EvidenceType` | 1 if `EvidenceType` in `{'Audit Record', 'Transaction Record', 'Call Metadata'}`, else 0 | Captures high-fidelity forensic data feeds |
| 18 | `location_code` | `int8` | `Location` | Integer encoded index (0–29) across 30 major jurisdiction hubs | Encodes regional geographic jurisdiction |
| 19 | `event_year` | `int16` | `EventDate` | Extracted calendar year from `DD-MM-YYYY` (2021–2026) | Temporal trend anchor |
| 20 | `event_month` | `int8` | `EventDate` | Extracted month of year (1–12) | Captures seasonality |
| 21 | `event_day_of_week` | `int8` | `EventDate` | Day of week (0=Monday, 6=Sunday) | Captures weekend vs weekday operational cadence |
| 22 | `days_since_reference`| `int16` | `EventDate` | Elapsed days from minimum dataset date (2021-01-01) | Continuous recency metric |
| 23 | `person_degree_freq` | `int32` | `PersonID` | Global case occurrence count of `PersonID` | Node degree metric in investigative multi-graph |
| 24 | `connected_degree_freq`| `int32`| `ConnectedPersonID` | Global case occurrence count of `ConnectedPersonID` | Node degree metric of target subject |
| 25 | `location_density_freq`| `int32`| `LocationID` | Total case frequency associated with specific `LocationID` | Geographic crime concentration density |
| 26 | `vehicle_reuse_freq` | `int8` | `VehicleID` | Frequency of `VehicleID` appearances across cases | Detects syndicate fleet reuse across operations |

---

## 2. Excluded Leakage Columns

The following columns are **strictly excluded** from model inputs:
- `CaseID`: Unique primary identifier per row; trivial overfitting without generalizable signal.
- `PersonName`, `ConnectedPersonName`: Free-text names with zero inductive generalization value.
- `EvidenceID`: Unique sequential primary key per row.
- `VehicleID`, `LocationID`, `PersonID`, `ConnectedPersonID` (raw strings): High-cardinality IDs replaced by their graph degree / density frequency statistics.
