# TRACE-X Connection Scoring: Feature Tiers Specification

This document defines the architectural division between **Tier A (Leakage-Free Structural Features)** and **Tier B (Label-Formula Features)** to guarantee scientific validity in model training.

---

## 1. Feature Tier Definitions

### TIER A: Leakage-Free Structural Features (12 Features)
Tier A consists exclusively of features derived from columns **NOT** in the heuristic label formula, or re-engineered into topological, spatial, and temporal signals independent of the direct rule:

| Feature Name | Type | Source Raw Column | Description |
| :--- | :--- | :--- | :--- |
| `case_type_code` | Categorical (`int8`) | `CaseType` | Integer code across 25 crime categories |
| `is_financial_or_cyber` | Binary (`int8`) | `CaseType` | Indicator for complex banking/cyber syndicates |
| `is_organized_crime` | Binary (`int8`) | `CaseType` | Indicator for smuggling/extortion/mining syndicates |
| `location_code` | Categorical (`int8`) | `Location` | Regional hub code across 30 cities |
| `event_year` | Numeric (`int16`) | `EventDate` | Event observation year (2021–2026) |
| `event_month` | Numeric (`int8`) | `EventDate` | Event observation month (1–12) |
| `event_day_of_week` | Numeric (`int8`) | `EventDate` | Day of week cadence (0–6) |
| `days_since_reference` | Numeric (`int16`) | `EventDate` | Continuous recency from 2021-01-01 anchor |
| `person_degree_freq` | Numeric (`int32`) | `PersonID` | Global multi-graph degree of source person |
| `connected_degree_freq`| Numeric (`int32`) | `ConnectedPersonID` | Global multi-graph degree of target person |
| `location_density_freq`| Numeric (`int32`) | `LocationID` | Total incident volume at specific location |
| `vehicle_reuse_freq` | Numeric (`int8`) | `VehicleID` | Syndicate vehicle fleet multi-case recurrence |

> **Trust Guarantee**: Tier A contains **zero** direct terms from the label formula. A model trained on Tier A tests whether genuine connections can be predicted from crime typology, temporal cadence, regional geography, and network node centrality alone.

---

### TIER B: Label-Formula Columns (14 Features)
Tier B contains the functional and categorical encodings of the **5 label-derived columns** (`CaseStatus`, `Relationship`, `PersonRole`, `Activity`, `EvidenceType`):

| Feature Name | Source Column | Rationale for Tier B Placement |
| :--- | :--- | :--- |
| `case_status_code` | `CaseStatus` | Direct input to label score |
| `is_case_adjudicated` | `CaseStatus` | Direct input (+2 points in formula) |
| `rel_type_code` | `Relationship` | Direct input to label score |
| `is_high_intimacy_rel` | `Relationship` | Direct input (+2 points in formula) |
| `is_vehicle_link` | `Relationship` | Sub-category of formula column |
| `is_location_visit` | `Relationship` | Sub-category of formula column |
| `is_witness_reported` | `Relationship` | Sub-category of formula column |
| `person_role_code` | `PersonRole` | Direct input to label score |
| `is_suspect_role` | `PersonRole` | Direct input (+1 point in formula) |
| `is_witness_or_victim` | `PersonRole` | Inverted sub-category of formula column |
| `activity_code` | `Activity` | Direct input to label score |
| `is_hard_telemetry_act` | `Activity` | Direct input (+1 point in formula) |
| `evidence_type_code` | `EvidenceType` | Direct input to label score |
| `is_forensic_evidence` | `EvidenceType` | Direct input (+1 point in formula) |

> **Caution**: Training on Tier B features guarantees artificially inflated metrics (AUC ~0.99) because the model simply solves the linear threshold arithmetic of the weak-label heuristic.

---

## 2. Experimental Dual-Model Strategy

To provide transparent, honest reporting to investigators:

1. **Model Set 1 (Tier A Only — Trustworthy Baseline)**:
   - Models: Random Forest, HistGradientBoosting, Isolation Forest.
   - Inputs: 12 Tier A features only.
   - Purpose: Evaluates genuine predictive signal from independent structural evidence.
2. **Model Set 2 (Full Feature Set — Tier A + Tier B)**:
   - Models: Same three architectures.
   - Inputs: All 26 features.
   - Purpose: Benchmarks the heuristic reproduction ceiling and reveals the exact performance gap between independent pattern discovery and rule reconstruction.
