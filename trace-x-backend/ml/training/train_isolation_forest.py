"""TRACE-X ML Training: Isolation Forest
Trains IsolationForest on Tier A leakage-free features ONLY (unsupervised, no label seen).
Outputs normalized [0, 1] anomaly score where 1.0 = highly anomalous pattern.
Saves model to ml/models/v1/isolation_forest.joblib.
"""

import os
import time
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

TARGET = 'is_genuine_connection'


class AnomalyScorer:
    def __init__(self, model, preprocessor):
        self.model = model
        self.preprocessor = preprocessor

    def predict_anomaly_score(self, X_raw: pd.DataFrame) -> np.ndarray:
        """Outputs score in [0, 1] where 1.0 = highly anomalous / suspicious connection."""
        X_p = self.preprocessor.transform(X_raw)
        # score_samples returns opposite of anomaly score (lower is more abnormal)
        raw_scores = self.model.score_samples(X_p)
        # Normalize: lower raw_scores -> higher anomaly probability
        norm_scores = 1.0 / (1.0 + np.exp(10 * (raw_scores + 0.5)))
        return np.clip(norm_scores, 0.0, 1.0)


def train_isolation_forest():
    splits_dir = os.path.join(os.path.dirname(__file__), "..", "data", "splits", "tier_a")
    models_dir = os.path.join(os.path.dirname(__file__), "..", "models", "v1")
    os.makedirs(models_dir, exist_ok=True)

    print("=================================================================")
    print("      TRAINING ISOLATION FOREST ON TIER A FEATURES ONLY          ")
    print("=================================================================")

    # Load Tier A training data
    train_path = os.path.join(splits_dir, "train.parquet")
    print(f"Loading {train_path}...")
    t0 = time.time()
    train_df = pd.read_parquet(train_path)
    X_train = train_df.drop(columns=[TARGET])
    print(f"Loaded {len(X_train):,} rows with {X_train.shape[1]} features in {time.time() - t0:.2f}s.")

    # Load preprocessor
    prep_path = os.path.join(models_dir, "preprocessor_tier_a.joblib")
    preprocessor = joblib.load(prep_path)
    X_train_proc = preprocessor.transform(X_train)

    # Subsample for training Isolation Forest efficiently (100k rows is industry standard for tree partition diversity)
    sample_size = min(100_000, len(X_train_proc))
    print(f"Fitting IsolationForest on {sample_size:,} subsample...")
    np.random.seed(42)
    sample_indices = np.random.choice(len(X_train_proc), size=sample_size, replace=False)
    X_sample = X_train_proc[sample_indices]

    iso_forest = IsolationForest(
        n_estimators=150,
        max_samples='auto',
        contamination=0.1,  # expected anomaly rate in criminal networks
        random_state=42,
        n_jobs=-1,
    )
    iso_forest.fit(X_sample)

    out_path = os.path.join(models_dir, "isolation_forest.joblib")
    joblib.dump(iso_forest, out_path)
    print(f"Successfully saved raw Isolation Forest model to {out_path}")



if __name__ == "__main__":
    train_isolation_forest()
