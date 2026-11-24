"""TRACE-X ML Training: RandomForestClassifier
Trains RandomForestClassifier(class_weight='balanced') on:
  1. Tier A features (using preprocessor_tier_a)
  2. Full features   (using preprocessor_full)
Wraps each in IsotonicCalibratedModel fit on the 157,285 validation split.
Saves models to ml/models/v1/rf_tier_a.joblib and ml/models/v1/rf_full.joblib.
Supports --sample-frac flag for rapid iteration.
"""

import os
import sys
import time
import argparse
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier

# Ensure calibration wrapper is found
sys.path.insert(0, os.path.dirname(__file__))
from calibration_wrapper import IsotonicCalibratedModel

TARGET = 'is_genuine_connection'


class PipelineEstimator:
    def __init__(self, prep, model):
        self.prep = prep
        self.model = model

    def predict_proba(self, X):
        X_p = self.prep.transform(X)
        return self.model.predict_proba(X_p)

    def predict(self, X):
        X_p = self.prep.transform(X)
        return self.model.predict(X_p)


def train_rf(sample_frac: float = 0.25):
    splits_dir = os.path.join(os.path.dirname(__file__), "..", "data", "splits")
    models_dir = os.path.join(os.path.dirname(__file__), "..", "models", "v1")
    os.makedirs(models_dir, exist_ok=True)

    print("=================================================================")
    print(f"       TRAINING RANDOM FOREST (Sample fraction: {sample_frac:.1%})         ")
    print("=================================================================")

    for tier_name in ['tier_a', 'full']:
        print(f"\n--- Training Random Forest on {tier_name.upper()} ---")
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

        # Load preprocessor
        prep_path = os.path.join(models_dir, f"preprocessor_{tier_name}.joblib")
        preprocessor = joblib.load(prep_path)

        print(f"Preprocessing {len(X_train):,} training rows...")
        X_train_proc = preprocessor.transform(X_train)
        X_val_proc = preprocessor.transform(X_val)

        print(f"Fitting RandomForestClassifier(class_weight='balanced', n_estimators=100)...")
        base_rf = RandomForestClassifier(
            n_estimators=100,
            max_depth=16,
            min_samples_split=20,
            min_samples_leaf=10,
            class_weight='balanced',
            random_state=42,
            n_jobs=-1,
        )
        base_rf.fit(X_train_proc, y_train)

        pipeline_model = PipelineEstimator(preprocessor, base_rf)


        print(f"Fitting IsotonicCalibratedModel on validation set...")
        calibrated_rf = IsotonicCalibratedModel(pipeline_model)
        calibrated_rf.fit_calibration(X_val, y_val)

        out_path = os.path.join(models_dir, f"rf_{tier_name}.joblib")
        raw_out_path = os.path.join(models_dir, f"rf_{tier_name}_uncalibrated.joblib")
        joblib.dump(calibrated_rf, out_path)
        joblib.dump(pipeline_model, raw_out_path)
        print(f"Saved: {out_path} (Training time: {time.time() - t0:.2f}s)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--sample-frac", type=float, default=0.25, help="Fraction of training rows to use")
    args = parser.parse_args()
    train_rf(sample_frac=args.sample_frac)
