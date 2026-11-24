"""TRACE-X ML Training: Calibrated Wrapper
Provides an explicit Isotonic Calibration wrapper around pre-fitted scikit-learn models,
calibrating predicted probabilities against the 157,285-row validation split.
Compatible across scikit-learn >= 1.4, 1.5, 1.6, 1.9+.
"""

import numpy as np
import pandas as pd
from sklearn.isotonic import IsotonicRegression


class IsotonicCalibratedModel:
    def __init__(self, base_estimator):
        self.base_estimator = base_estimator
        self.calibrator = IsotonicRegression(out_of_bounds='clip', y_min=0.0, y_max=1.0)
        self.classes_ = np.array([0, 1])

    def fit_calibration(self, X_val, y_val):
        """Fits isotonic regression on uncalibrated validation probabilities."""
        if hasattr(self.base_estimator, "predict_proba"):
            raw_probs = self.base_estimator.predict_proba(X_val)[:, 1]
        elif hasattr(self.base_estimator, "decision_function"):
            raw_scores = self.base_estimator.decision_function(X_val)
            raw_probs = 1.0 / (1.0 + np.exp(-raw_scores))
        else:
            raise AttributeError("Base estimator lacks predict_proba or decision_function.")

        self.calibrator.fit(raw_probs, y_val)
        return self

    def predict_proba(self, X):
        """Returns (N, 2) array of [P(y=0), P(y=1)] calibrated probabilities."""
        if hasattr(self.base_estimator, "predict_proba"):
            raw_probs = self.base_estimator.predict_proba(X)[:, 1]
        else:
            raw_scores = self.base_estimator.decision_function(X)
            raw_probs = 1.0 / (1.0 + np.exp(-raw_scores))

        cal_p1 = np.clip(self.calibrator.predict(raw_probs), 0.0, 1.0)
        cal_p0 = 1.0 - cal_p1
        return np.column_stack([cal_p0, cal_p1])

    def predict(self, X, threshold=0.5):
        """Binary prediction using calibrated probability threshold."""
        p1 = self.predict_proba(X)[:, 1]
        return (p1 >= threshold).astype(int)
