# TRACE-X Connection Scoring: Leakage Audit

## 1. Audit Scope & Context

This audit evaluates the 16 raw columns in `TraceX_3Million_Unique_Cases.csv` against the 7-point evidentiary scoring formula defined in `docs/label-derivation.md`.

In Phase I, the heuristic binary label `is_genuine_connection` was computed as:
$$\text{Evidentiary Score} = S_{\text{CaseStatus}} + S_{\text{Relationship}} + S_{\text{PersonRole}} + S_{\text{Activity}} + S_{\text{EvidenceType}} \quad (\ge 4 \implies 1)$$

If any model is given the direct representations of these 5 columns, standard tree ensembles (Random Forest, Gradient Boosting) will trivially rediscover this algebraic inequality rather than discovering independent investigative connection patterns.

---

## 2. Complete 16-Column Classification

| # | Raw Column Name | Status | Label Formula Role | Action in Modeling |
|---|-----------------|--------|---------------------|--------------------|
| 1 | `CaseID` | **ID Column** | Not used in formula | **Exclude** (Arbitrary primary key; causes memorization) |
| 2 | `CaseType` | **Independent Context** | **NOT USED** | **Retain in Tier A** (Crime category context) |
| 3 | `CaseStatus` | **LABEL-DERIVED** | Directly provides +2 points if in `{'Resolved', 'Closed', 'Charges Filed'}` | **Exclude from Tier A** (Isolate to Tier B) |
| 4 | `PersonID` | **Entity Key** | Not used in formula | **Transform to Tier A** (Node degree / co-occurrence count) |
| 5 | `PersonName` | **PII String** | Not used in formula | **Exclude** (Zero generalizable inductive value) |
| 6 | `PersonRole` | **LABEL-DERIVED** | Directly provides +1 point if in `{'Person of Interest', 'Associate', 'Owner', 'Driver'}` | **Exclude from Tier A** (Isolate to Tier B) |
| 7 | `Relationship` | **LABEL-DERIVED** | Directly provides +2 points if in `{'financially_connected', 'worked_with', 'associated_with', 'knows'}` | **Exclude from Tier A** (Isolate to Tier B) |
| 8 | `ConnectedPersonID`| **Entity Key** | Not used in formula | **Transform to Tier A** (Node degree / co-occurrence count) |
| 9 | `ConnectedPersonName`| **PII String** | Not used in formula | **Exclude** (Zero generalizable inductive value) |
| 10 | `VehicleID` | **Entity Key** | Not used in formula | **Transform to Tier A** (Fleet reuse frequency) |
| 11 | `EvidenceID` | **ID Column** | Not used in formula | **Exclude** (Sequential row key) |
| 12 | `LocationID` | **Spatial Key** | Not used in formula | **Transform to Tier A** (Location density frequency) |
| 13 | `Location` | **Spatial Categorical**| **NOT USED** | **Retain in Tier A** (Jurisdiction regional code) |
| 14 | `Activity` | **LABEL-DERIVED** | Directly provides +1 point if in `{'Transaction recorded', 'Communication logged', 'Asset linked'}` | **Exclude from Tier A** (Isolate to Tier B) |
| 15 | `EvidenceType` | **LABEL-DERIVED** | Directly provides +1 point if in `{'Audit Record', 'Transaction Record', 'Call Metadata'}` | **Exclude from Tier A** (Isolate to Tier B) |
| 16 | `EventDate` | **Temporal String** | **NOT USED** | **Retain in Tier A** (Year, month, day-of-week, elapsed recency) |

---

## 3. Columns Marked "LABEL-DERIVED — Exclude from Direct Feature Use"

The following **5 columns** directly dictate the label score and must be excluded from trustworthy baseline models (Tier A):
1. **`CaseStatus`**
2. **`Relationship`**
3. **`PersonRole`**
4. **`Activity`**
5. **`EvidenceType`**

Any feature that directly encodes these columns (e.g. `is_case_adjudicated`, `is_high_intimacy_rel`, `is_suspect_role`, `is_hard_telemetry_act`, `is_forensic_evidence`, or their categorical code encodings) belongs strictly to **Tier B**.
