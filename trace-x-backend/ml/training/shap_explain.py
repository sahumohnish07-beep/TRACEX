"""TRACE-X ML Training: SHAP Explanations & Evidence Generation
Computes TreeExplainer SHAP values on 15,000 test samples for Tier A models.
Saves global summary bar plot to ml/reports/shap_summary_tier_a.png.
Provides plain-language evidence generation mapping matching frontend UI style:
  - e.g. high vehicle_reuse_freq -> "Vehicle associated with multiple records"
  - e.g. high connected_degree_freq -> "Multiple relationship connections recorded"
  - e.g. is_organized_crime + is_financial_or_cyber -> "Case pattern consistent with organized activity"
"""

import os
import joblib
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import shap

TARGET = 'is_genuine_connection'


def run_shap_analysis():
    splits_dir = os.path.join(os.path.dirname(__file__), "..", "data", "splits", "tier_a")
    models_dir = os.path.join(os.path.dirname(__file__), "..", "models", "v1")
    reports_dir = os.path.join(os.path.dirname(__file__), "..", "reports")
    os.makedirs(reports_dir, exist_ok=True)

    print("=================================================================")
    print("           SHAP INTERPRETABILITY & EVIDENCE GENERATION           ")
    print("=================================================================")

    # Load 15,000 row representative test sample
    test_path = os.path.join(splits_dir, "test.parquet")
    test_df = pd.read_parquet(test_path).sample(n=15_000, random_state=42)
    X_test = test_df.drop(columns=[TARGET])

    # Load uncalibrated HGB Tier A model (native tree structure for TreeExplainer)
    hgb_model = joblib.load(os.path.join(models_dir, "hgb_tier_a_uncalibrated.joblib"))

    print("Computing TreeExplainer SHAP values on 15,000 samples...")
    explainer = shap.TreeExplainer(hgb_model)
    shap_values = explainer(X_test)

    # Save explainer artifact
    explainer_path = os.path.join(models_dir, "shap_explainer_tier_a.joblib")
    joblib.dump(explainer, explainer_path)
    print(f"Saved SHAP explainer to: {explainer_path}")

    # Generate global summary bar plot
    plt.figure(figsize=(10, 6))
    shap.summary_plot(shap_values, X_test, plot_type="bar", show=False)
    plt.title("Tier A Feature Importance (Mean |SHAP Value| Across 15,000 Test Records)", fontsize=12, pad=15)
    plt.tight_layout()
    shap_plot_path = os.path.join(reports_dir, "shap_summary_tier_a.png")
    plt.savefig(shap_plot_path, dpi=200)
    plt.close()
    print(f"Saved SHAP summary plot to: {shap_plot_path}")

    # Function to generate human-readable evidence bullets matching frontend style
    def generate_investigative_evidence(row: pd.Series, shap_contribs: np.ndarray, feature_names: list) -> list:
        bullets = []

        # High vehicle reuse
        if row.get('vehicle_reuse_freq', 0) > 1:
            bullets.append(f"Vehicle associated with multiple records (fleet frequency: {int(row['vehicle_reuse_freq'])})")

        # High network connectivity
        if row.get('connected_degree_freq', 0) > 30:
            bullets.append(f"Multiple relationship connections recorded across active cases (degree: {int(row['connected_degree_freq'])})")

        # Organized & financial crime pattern
        if row.get('is_organized_crime', 0) == 1 and row.get('is_financial_or_cyber', 0) == 1:
            bullets.append("Case pattern consistent with organized syndicate activity and financial laundering")
        elif row.get('is_organized_crime', 0) == 1:
            bullets.append("Identified within organized crime / smuggling jurisdictional dossier")
        elif row.get('is_financial_or_cyber', 0) == 1:
            bullets.append("Financial / cyber transaction telemetry logged in case registry")

        # High density geographic co-location
        if row.get('location_density_freq', 0) > 20:
            bullets.append(f"High-frequency geographic crime cluster (location incident density: {int(row['location_density_freq'])})")

        # Recency
        if row.get('days_since_reference', 0) > 1200:
            bullets.append("Recent active telemetry observed in ongoing investigative horizon")

        if not bullets:
            bullets.append("Baseline jurisdictional co-occurrence recorded in station ledger")

        return bullets[:3]

    print("\nDemonstration of generated evidence bullets for 3 test entities:")
    feature_names = list(X_test.columns)
    for i in range(3):
        sample_row = X_test.iloc[i]
        ev_bullets = generate_investigative_evidence(sample_row, shap_values.values[i], feature_names)
        print(f"  Entity {i+1} Evidence:")
        for b in ev_bullets:
            print(f"    - {b}")

    return explainer_path, shap_plot_path


if __name__ == "__main__":
    run_shap_analysis()
