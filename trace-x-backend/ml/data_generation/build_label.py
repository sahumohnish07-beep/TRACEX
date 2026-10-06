"""TRACE-X Data Generation: Build Weak Label
Implements Step 1 (Branch B): Evaluates candidate connection records against the
7-point evidentiary scoring rubric and produces binary target `is_genuine_connection`.
"""

import pandas as pd
import numpy as np

# Evidentiary scoring rubric sets
RESOLVED_STATUSES = {'Resolved', 'Closed', 'Charges Filed'}
HIGH_INTIMACY_RELATIONSHIPS = {'financially_connected', 'worked_with', 'associated_with', 'knows'}
SUSPECT_ROLES = {'Person of Interest', 'Associate', 'Owner', 'Driver'}
HARD_TELEMETRY_ACTIVITIES = {'Transaction recorded', 'Communication logged', 'Asset linked'}
FORENSIC_EVIDENCE_TYPES = {'Audit Record', 'Transaction Record', 'Call Metadata'}


def compute_weak_label(df: pd.DataFrame) -> pd.Series:
    """Computes the 7-point evidentiary score and binarizes at threshold >= 4.

    Returns a Series of int8 (0 or 1).
    """
    s_status = df['CaseStatus'].isin(RESOLVED_STATUSES).astype(np.int8) * 2
    s_rel = df['Relationship'].isin(HIGH_INTIMACY_RELATIONSHIPS).astype(np.int8) * 2
    s_role = df['PersonRole'].isin(SUSPECT_ROLES).astype(np.int8) * 1
    s_act = df['Activity'].isin(HARD_TELEMETRY_ACTIVITIES).astype(np.int8) * 1
    s_ev = df['EvidenceType'].isin(FORENSIC_EVIDENCE_TYPES).astype(np.int8) * 1

    total_score = s_status + s_rel + s_role + s_act + s_ev
    return (total_score >= 4).astype(np.int8)


if __name__ == "__main__":
    import os
    raw_path = os.path.join(os.path.dirname(__file__), "..", "data", "raw", "TraceX_3Million_Unique_Cases.csv")
    print(f"Testing weak label computation on sample from {raw_path}...")
    sample = pd.read_csv(raw_path, nrows=50000)
    labels = compute_weak_label(sample)
    print(f"Sample positive rate: {labels.mean():.4f}")
    print(labels.value_counts(normalize=True))
