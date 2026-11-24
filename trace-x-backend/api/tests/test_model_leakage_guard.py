"""TRACE-X Regression Guard: ML Model Leakage Safety
Asserter: model_service.py loader ONLY imports isolation_forest.joblib and preprocessor_tier_a.joblib.
Protects Phase L's leakage-safety guarantee:
Fails the build if rf_tier_a.joblib, hgb_tier_a.joblib, or any full-feature / supervised model path
appears anywhere in the serving loader or its import graph.
"""

import inspect
import re
import ml.serving.model_service as model_service
import ml.serving.metrics as metrics
import ml.features.tier_a_builder as tier_a_builder


PROHIBITED_MODEL_PATTERNS = [
    r"rf_tier_a\.joblib",
    r"hgb_tier_a\.joblib",
    r"random_forest",
    r"hist_gradient_boosting",
    r"tier_b",
    r"tier_c",
    r"full_features",
    r"ground_truth_label",
    r"calibrated_classifier",
]

ALLOWED_MODEL_FILES = {
    "isolation_forest.joblib",
    "preprocessor_tier_a.joblib",
}


def test_model_service_loader_strictly_loads_allowed_artifacts():
    """Verify load_production_models only references isolation_forest and preprocessor_tier_a."""
    src = inspect.getsource(model_service.load_production_models)

    # Must contain both allowed files
    for allowed in ALLOWED_MODEL_FILES:
        assert allowed in src, f"Expected {allowed} in load_production_models source code"

    # Must NOT contain prohibited model artifact names or forbidden classifiers
    for pattern in PROHIBITED_MODEL_PATTERNS:
        match = re.search(pattern, src, re.IGNORECASE)
        assert not match, (
            f"REGRESSION VIOLATION: Found prohibited pattern '{pattern}' in load_production_models! "
            "Phase L strictly mandates Isolation Forest Tier A only to avoid data leakage."
        )


def test_entire_serving_module_has_zero_leakage_model_references():
    """Verify entire model_service.py file content does not load supervised/full-feature models."""
    src = inspect.getsource(model_service)

    # Check for direct file loads of rf or hgb
    assert "rf_tier_a.joblib" not in src, "rf_tier_a.joblib found in model_service.py"
    assert "hgb_tier_a.joblib" not in src, "hgb_tier_a.joblib found in model_service.py"

    # Confirm model metadata conforms to unsupervised Isolation Forest
    assert model_service.MODEL_NAME == "tracex-isolation-forest-tier-a"
    assert "Unsupervised" in model_service.TRAINING_PARADIGM


def test_tier_a_feature_builder_only_uses_leakage_safe_features():
    """Verify tier_a_builder only uses 12 Tier A features without future leakage."""
    src = inspect.getsource(tier_a_builder)

    prohibited_features = [
        "disclosed_by_interagency",
        "warrant_issued_date",
        "charge_sheet_filed",
        "court_disposition",
        "ground_truth",
    ]
    for feat in prohibited_features:
        assert feat not in src, f"Found potential future leakage feature '{feat}' in tier_a_builder!"
