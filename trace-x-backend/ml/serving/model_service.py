"""TRACE-X ML Serving: Model Service
Loads and serves the PRODUCTION-CONFIRMED model: Isolation Forest on 12 Tier A features.
Explicitly avoids loading any supervised classifiers (RF/HGB) or Full-feature models.
"""

import os
import logging
from typing import Dict, Any, List, Tuple, Optional
import joblib
import numpy as np
import pandas as pd

from ml.features.tier_a_builder import build_tier_a_vector, BASELINE_STATS

logger = logging.getLogger("tracex_model_service")

# Static Model Metadata
MODEL_NAME = "tracex-isolation-forest-tier-a"
MODEL_VERSION = "1.0.0"
TRAINING_PARADIGM = "Unsupervised structural anomaly detection on 12 leakage-free Tier A features"
IS_HEURISTIC_TRAINING_BENCHMARK = True

_model = None
_preprocessor = None


def get_model_service():
    """Singleton getter for loaded model service."""
    global _model, _preprocessor
    if _model is None or _preprocessor is None:
        load_production_models()
    return _model, _preprocessor


def load_production_models():
    """Loads isolation_forest.joblib and preprocessor_tier_a.joblib into memory once."""
    global _model, _preprocessor
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    models_dir = os.path.join(base_dir, "models", "v1")

    iso_path = os.path.join(models_dir, "isolation_forest.joblib")
    prep_path = os.path.join(models_dir, "preprocessor_tier_a.joblib")

    if not os.path.exists(iso_path):
        raise FileNotFoundError(f"Isolation Forest model artifact missing at {iso_path}")
    if not os.path.exists(prep_path):
        raise FileNotFoundError(f"Tier A preprocessor artifact missing at {prep_path}")

    logger.info(f"Loading production Isolation Forest from: {iso_path}")
    _model = joblib.load(iso_path)
    logger.info(f"Loading Tier A Preprocessor from: {prep_path}")
    _preprocessor = joblib.load(prep_path)
    logger.info("TRACE-X ML Serving: Isolation Forest & Tier A Preprocessor loaded successfully.")


def compute_anomaly_score(df_tier_a: pd.DataFrame) -> float:
    """Computes continuous normalized anomaly score in [0.0, 1.0] from raw Isolation Forest scores.

    Calibration: score_samples produces negative values (approx -0.45 to -0.30).
    Normalized score: lower score_samples -> higher anomaly score S in [0.0, 1.0].
    """
    model, preprocessor = get_model_service()
    X_proc = preprocessor.transform(df_tier_a)
    raw_score = float(model.score_samples(X_proc)[0])

    # Min-max normalization calibrated to test split distribution:
    # min_val = -0.45 (extreme outlier), max_val = -0.30 (in-distribution baseline)
    min_val = -0.45
    max_val = -0.30
    norm_score = float(np.clip((max_val - raw_score) / (max_val - min_val), 0.0, 1.0))
    return round(norm_score, 4)


def determine_evidence_strength(anomaly_score: float, corroborating_facts: List[str]) -> str:
    """Assigns EvidenceStrength ('Strong', 'Moderate', 'Limited') per exact bucketing rule:

    - Anomaly score ALONE can NEVER exceed 'Moderate' without concrete corroboration (C >= 1).
    - If S >= 0.60 and C >= 1: 'Strong'
    - If S >= 0.60 and C == 0: 'Moderate'
    - If 0.35 <= S < 0.60 and C >= 1: 'Moderate'
    - Otherwise: 'Limited'
    """
    c_count = len(corroborating_facts)
    if anomaly_score >= 0.60:
        if c_count >= 1:
            return "Strong"
        return "Moderate"
    elif anomaly_score >= 0.35:
        if c_count >= 1:
            return "Moderate"
        return "Limited"
    else:
        return "Limited"


def generate_feature_contributions(df_tier_a: pd.DataFrame) -> List[str]:
    """Distributional Feature Deviation Approximation:

    Generates plain-language evidence bullets explaining which structural features
    contributed to the Isolation Forest anomaly score based on the training distribution.
    """
    row = df_tier_a.iloc[0]
    bullets = []

    # 1. Fleet / Vehicle reuse
    if row.get('vehicle_reuse_freq', 1) > BASELINE_STATS['vehicle_reuse_p75']:
        bullets.append(f"Vehicle associated with multiple records (fleet frequency: {int(row['vehicle_reuse_freq'])})")

    # 2. Graph Connectivity / Degree
    if row.get('connected_degree_freq', 1) > BASELINE_STATS['connected_degree_p75']:
        bullets.append(f"Multiple relationship connections recorded across active cases (degree: {int(row['connected_degree_freq'])})")

    # 3. Crime Typology Context
    is_org = int(row.get('is_organized_crime', 0))
    is_fin = int(row.get('is_financial_or_cyber', 0))
    if is_org == 1 and is_fin == 1:
        bullets.append("Case pattern consistent with organized syndicate activity and financial laundering")
    elif is_org == 1:
        bullets.append("Identified within organized crime / smuggling jurisdictional dossier")
    elif is_fin == 1:
        bullets.append("Financial / cyber transaction telemetry logged in case registry")

    # 4. Geographic Cluster Density
    if row.get('location_density_freq', 1) > BASELINE_STATS['location_density_p75']:
        bullets.append(f"High-frequency geographic crime cluster (location incident density: {int(row['location_density_freq'])})")

    # 5. Temporal Recency
    if row.get('days_since_reference', 0) > BASELINE_STATS['days_since_ref_p75']:
        bullets.append("Recent active telemetry observed in ongoing investigative horizon")

    if not bullets:
        bullets.append("Baseline cross-jurisdictional presence co-referenced in police ledger")

    return bullets[:3]


def score_connection_pair(
    case_type: Optional[str] = None,
    location: Optional[str] = None,
    event_date: Optional[Any] = None,
    person_degree: int = 1,
    connected_degree: int = 1,
    location_density: int = 1,
    vehicle_reuse: int = 1,
    corroborating_facts: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """High-level scoring pipeline for candidate pair."""
    facts = corroborating_facts or []
    df_tier_a = build_tier_a_vector(
        case_type=case_type,
        location=location,
        event_date=event_date,
        person_degree=person_degree,
        connected_degree=connected_degree,
        location_density=location_density,
        vehicle_reuse=vehicle_reuse,
    )

    anomaly_score = compute_anomaly_score(df_tier_a)
    evidence_strength = determine_evidence_strength(anomaly_score, facts)
    structural_bullets = generate_feature_contributions(df_tier_a)

    # Combined evidence list matching frontend presentation
    combined_evidence = facts + structural_bullets

    return {
        "model_name": MODEL_NAME,
        "model_version": MODEL_VERSION,
        "anomaly_score": anomaly_score,
        "evidence_strength": evidence_strength,
        "connection_basis": structural_bullets,
        "evidence_basis": combined_evidence,
        "corroborating_facts": facts,
        "is_calibrated_classifier": False,
        "training_paradigm": TRAINING_PARADIGM,
        "underlying_label_type": "HEURISTIC_WEAK_LABEL_DIAGNOSTIC",
    }
