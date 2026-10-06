# Model Card: TRACE-X Missing Link Scoring Models (v1)

## Model Overview
- **Model Family**: Missing Link Connection Classifier & Anomaly Detector
- **Version**: `v1`
- **Trained Artifacts Path**: `ml/models/v1/`
  - `isolation_forest.joblib` (Production Recommendation)
  - `preprocessor_tier_a.joblib` & `preprocessor_full.joblib`
  - `hgb_tier_a.joblib` & `hgb_full.joblib` (Calibrated Isotonic)
  - `rf_tier_a.joblib` & `rf_full.joblib` (Calibrated Isotonic)
  - `shap_explainer_tier_a.joblib`
- **Framework**: `scikit-learn==1.9.1`, `joblib==1.6.0`, `shap==0.52.0`

---

## Dataset & Label Derivation
- **Total Dataset Size**: 1,048,575 rows (Train: 734,002 | Val: 157,285 | Test: 157,288).
- **Label Origin**: Weak heuristic label derived using 7-point evidentiary score across 5 operational columns: `CaseStatus`, `Relationship`, `PersonRole`, `Activity`, and `EvidenceType` (details in [label-derivation.md](file:///c:/Users/shrey/OneDrive/Desktop/TRACEX%20R2/docs/label-derivation.md)).
- **Positive Label Rate**: **29.7505%** across all splits.

---

## Empirical Evaluation Metrics (157,288 Test Rows)

| Model | Feature Tier | Pre-Cal PR-AUC | Post-Cal PR-AUC | ROC-AUC | F1 Score | Recall | Precision | Brier Loss |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **HistGradientBoosting** | **Tier A (12 Leakage-Free)** | **0.2959** | **0.2959** | 0.4975 | 0.0000 | 0.0000 | 0.1667 | 0.2090 |
| **Random Forest** | **Tier A (12 Leakage-Free)** | **0.3019** | **0.3019** | 0.5057 | 0.0000 | 0.0000 | 0.0000 | 0.2090 |
| **Isolation Forest** | **Tier A (Unsupervised)** | **0.2980** | **0.2980** | 0.5004 | 0.3807 | 0.5262 | 0.2982 | 0.2907 |
| **HistGradientBoosting** | **Full (Tier A + Tier B)** | **1.0000** | **1.0000** | 1.0000 | **1.0000** | 1.0000 | 1.0000 | 0.0000 |
| **Random Forest** | **Full (Tier A + Tier B)** | **1.0000** | **1.0000** | 1.0000 | **1.0000** | 1.0000 | 1.0000 | 0.0000 |

---

## Performance Gap & Data Leakage Audit
- **Observed Gap**: **+0.7041 PR-AUC** between Tier A and Full.
- **Root Cause**: The 5 Tier B features are direct algebraic inputs to the heuristic label formula. Models trained on the Full feature set achieve 1.0000 PR-AUC through circular formula reconstruction, not generalized behavioral learning.
- **Baseline Alignment**: Tier A features (pure graph topology, temporal frequency, spatial density) perform directly at the 0.2975 random baseline, indicating independence between graph structure and the heuristic scoring rule in this dataset.

---

## Production Recommendation
- **Recommended Model**: **`isolation_forest.joblib` (Tier A Unsupervised Anomaly Detection)**.
- **Rationale**: Completely uncoupled from heuristic label leakage; highlights high-degree, anomalous structural patterns across jurisdictions without circular reasoning.
- **Prohibited**: Full-feature models (`hgb_full.joblib`, `rf_full.joblib`) are barred from production inference.

---

## Decision-Support & Compliance Disclaimer
> **IMPORTANT NOTICE FOR LAW ENFORCEMENT & INVESTIGATIVE PERSONNEL**:
> All missing link connection scores and anomaly indicators produced by this model suite are strictly for **decision-support and investigative lead prioritization**. They do not constitute probable cause, legal evidence, or automated identification. Every surfaced link requires independent human verification and evidentiary corroboration prior to investigative action.
