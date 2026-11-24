"""TRACE-X ML Training: Preprocessors
Builds and saves scikit-learn ColumnTransformer pipelines for:
  1. Tier A features -> preprocessor_tier_a.joblib
  2. Full features   -> preprocessor_full.joblib
"""

import os
import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline

# Categorical vs Numeric Column Lists
TIER_A_CAT = ['case_type_code', 'location_code']
TIER_A_NUM = [
    'is_financial_or_cyber', 'is_organized_crime',
    'event_year', 'event_month', 'event_day_of_week', 'days_since_reference',
    'person_degree_freq', 'connected_degree_freq', 'location_density_freq', 'vehicle_reuse_freq'
]

FULL_CAT = [
    'case_type_code', 'location_code',
    'case_status_code', 'rel_type_code', 'person_role_code',
    'activity_code', 'evidence_type_code'
]
FULL_NUM = [
    'is_financial_or_cyber', 'is_organized_crime',
    'event_year', 'event_month', 'event_day_of_week', 'days_since_reference',
    'person_degree_freq', 'connected_degree_freq', 'location_density_freq', 'vehicle_reuse_freq',
    'is_case_adjudicated', 'is_high_intimacy_rel', 'is_vehicle_link',
    'is_location_visit', 'is_witness_reported', 'is_suspect_role',
    'is_witness_or_victim', 'is_hard_telemetry_act', 'is_forensic_evidence'
]


def build_preprocessors():
    models_dir = os.path.join(os.path.dirname(__file__), "..", "models", "v1")
    splits_dir = os.path.join(os.path.dirname(__file__), "..", "data", "splits")
    os.makedirs(models_dir, exist_ok=True)

    print("Building Preprocessors for Tier A and Full feature sets...")

    # Load small sample of train split for fitting transformer schemas
    train_a = pd.read_parquet(os.path.join(splits_dir, "tier_a", "train.parquet")).drop(columns=['is_genuine_connection'])
    train_full = pd.read_parquet(os.path.join(splits_dir, "full", "train.parquet")).drop(columns=['is_genuine_connection'])

    # 1. Tier A Preprocessor
    pipe_cat_a = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('ohe', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    pipe_num_a = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    preprocessor_tier_a = ColumnTransformer(
        transformers=[
            ('cat', pipe_cat_a, TIER_A_CAT),
            ('num', pipe_num_a, TIER_A_NUM),
        ],
        remainder='drop'
    )
    preprocessor_tier_a.fit(train_a)
    path_a = os.path.join(models_dir, "preprocessor_tier_a.joblib")
    joblib.dump(preprocessor_tier_a, path_a)
    print(f"Saved: {path_a}")

    # 2. Full Preprocessor
    pipe_cat_full = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('ohe', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    pipe_num_full = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    preprocessor_full = ColumnTransformer(
        transformers=[
            ('cat', pipe_cat_full, FULL_CAT),
            ('num', pipe_num_full, FULL_NUM),
        ],
        remainder='drop'
    )
    preprocessor_full.fit(train_full)
    path_full = os.path.join(models_dir, "preprocessor_full.joblib")
    joblib.dump(preprocessor_full, path_full)
    print(f"Saved: {path_full}")


if __name__ == "__main__":
    build_preprocessors()
