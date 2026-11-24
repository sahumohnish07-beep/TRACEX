"""TRACE-X Data Generation: Build Feature Tiers
Separates train, val, and test splits into:
  1. Tier A only (12 leakage-free structural features + target)
  2. Full feature set (Tier A + Tier B: 26 features + target)
Saves outputs to ml/data/splits/tier_a/ and ml/data/splits/full/
"""

import os
import pandas as pd

TIER_A_FEATURES = [
    'case_type_code',
    'is_financial_or_cyber',
    'is_organized_crime',
    'location_code',
    'event_year',
    'event_month',
    'event_day_of_week',
    'days_since_reference',
    'person_degree_freq',
    'connected_degree_freq',
    'location_density_freq',
    'vehicle_reuse_freq',
]

TIER_B_FEATURES = [
    'case_status_code',
    'is_case_adjudicated',
    'rel_type_code',
    'is_high_intimacy_rel',
    'is_vehicle_link',
    'is_location_visit',
    'is_witness_reported',
    'person_role_code',
    'is_suspect_role',
    'is_witness_or_victim',
    'activity_code',
    'is_hard_telemetry_act',
    'evidence_type_code',
    'is_forensic_evidence',
]

TARGET = 'is_genuine_connection'


def build_feature_tiers():
    base_splits_dir = os.path.join(os.path.dirname(__file__), "..", "data", "splits")
    tier_a_dir = os.path.join(base_splits_dir, "tier_a")
    full_dir = os.path.join(base_splits_dir, "full")

    os.makedirs(tier_a_dir, exist_ok=True)
    os.makedirs(full_dir, exist_ok=True)

    print("=================================================================")
    print("             BUILDING TIER A & FULL FEATURE TABLES               ")
    print("=================================================================")

    for split_name in ['train', 'val', 'test']:
        src_path = os.path.join(base_splits_dir, f"{split_name}.parquet")
        if not os.path.exists(src_path):
            raise FileNotFoundError(f"Missing split file: {src_path}")

        print(f"\nProcessing {split_name}.parquet...")
        df = pd.read_parquet(src_path)
        row_count = len(df)
        pos_rate = df[TARGET].mean()
        print(f"  Total Rows: {row_count:,} | Positive Rate: {pos_rate:.4%}")

        # 1. Tier A Table
        tier_a_cols = TIER_A_FEATURES + [TARGET]
        tier_a_df = df[tier_a_cols].copy()
        tier_a_path = os.path.join(tier_a_dir, f"{split_name}.parquet")
        tier_a_df.to_parquet(tier_a_path, index=False, engine='pyarrow')
        print(f"  -> Saved Tier A: {tier_a_path} (Shape: {tier_a_df.shape})")

        # 2. Full Table (Tier A + Tier B)
        full_cols = TIER_A_FEATURES + TIER_B_FEATURES + [TARGET]
        full_df = df[full_cols].copy()
        full_path = os.path.join(full_dir, f"{split_name}.parquet")
        full_df.to_parquet(full_path, index=False, engine='pyarrow')
        print(f"  -> Saved Full:   {full_path} (Shape: {full_df.shape})")

    print("\nFeature tier separation completed successfully.")


if __name__ == "__main__":
    build_feature_tiers()
