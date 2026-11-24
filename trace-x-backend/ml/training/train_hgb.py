"""TRACE-X ML Training: HistGradientBoostingClassifier
Trains HistGradientBoostingClassifier on:
  1. Tier A features (native categorical indices for case_type_code, location_code)
  2. Full features (all categorical columns supported natively)
Wraps each in CalibratedClassifierCV(cv='prefit', method='isotonic') fit on val split.
Saves models to ml/models/v1/hgb_tier_a.joblib and ml/models/v1/hgb_full.joblib.
"""

import os
import time
import argparse
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.calibration import CalibratedClassifierCV

TARGET = 'is_genuine_connection'
POS_WEIGHT = 70.2495 / 29.7505  # ~2.361 balanced class weighting


def train_hgb(sample_frac: float = 1.0):
    splits_dir = os.path.join(os.path.dirname(__file__), "..", "data", "splits")
    models_dir = os.path.join(os.path.dirname(__file__), "..", "models", "v1")
    os.makedirs(models_dir, exist_ok=True)

    print("=================================================================")
    print(f"      TRAINING HIST GRADIENT BOOSTING (Sample: {sample_frac:.1%})        ")
    print("=================================================================")

    for tier_name in ['tier_a', 'full']:
        print(f"\n--- Training HGB on {tier_name.upper()} ---")
        t0 = time.time()
        train_path = os.path.join(splits_dir, tier_name, "train.parquet")
        val_path = os.path.join(splits_dir, tier_name, "val.parquet")

        train_df = pd.read_parquet(train_path)
        val_df = pd.read_parquet(val_path)

        if sample_frac < 1.0:
            train_df = train_df.sample(frac=sample_frac, random_state=42)

        X_train = train_df.drop(columns=[TARGET])
        y_train = train_df[TARGET].to_numpy()

        X_val = val_df.drop(columns=[TARGET])
        y_val = val_df[TARGET].to_numpy()

        # Compute sample weights for 29.75% / 70.25% class balance
        sample_weights = np.where(y_train == 1, POS_WEIGHT, 1.0)

        # Identify categorical features
        if tier_name == 'tier_a':
            cat_features = ['case_type_code', 'location_code']
        else:
            cat_features = [
                'case_type_code', 'location_code', 'case_status_code',
                'rel_type_code', 'person_role_code', 'activity_code', 'evidence_type_code'
            ]

        print(f"Fitting base HistGradientBoostingClassifier on {len(X_train):,} rows ({len(X_train.columns)} features)...")
        base_hgb = HistGradientBoostingClassifier(
            loss='log_loss',
            learning_rate=0.1,
            max_iter=200,
            max_leaf_nodes=31,
            categorical_features=cat_features,
            early_stopping=True,
            scoring='loss',
            random_state=42,
        )
        base_hgb.fit(X_train, y_train, sample_weight=sample_weights)

        # Calibrate probabilities with Isotonic calibration on validation set
        print(f"Fitting IsotonicCalibratedModel on {len(X_val):,} validation rows...")
        from calibration_wrapper import IsotonicCalibratedModel
        calibrated_hgb = IsotonicCalibratedModel(base_hgb)
        calibrated_hgb.fit_calibration(X_val, y_val)

        out_path = os.path.join(models_dir, f"hgb_{tier_name}.joblib")
        raw_out_path = os.path.join(models_dir, f"hgb_{tier_name}_uncalibrated.joblib")
        joblib.dump(calibrated_hgb, out_path)
        joblib.dump(base_hgb, raw_out_path)
        print(f"Saved: {out_path} (Training time: {time.time() - t0:.2f}s)")



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--sample-frac", type=float, default=1.0, help="Fraction of training set to use")
    args = parser.parse_args()
    train_hgb(sample_frac=args.sample_frac)
