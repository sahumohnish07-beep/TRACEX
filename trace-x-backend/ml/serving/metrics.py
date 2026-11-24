"""TRACE-X ML Serving: Prometheus Monitoring & Drift Detection Hooks
Tracks inference counts, latency histograms, and weekly evidence strength distribution drift.
Exposes native Prometheus metrics compatible with Prometheus scrape format.
"""

import time
import logging
from collections import Counter
from typing import Dict, Any, List
from prometheus_client import Counter as PromCounter, Histogram as PromHistogram, Gauge as PromGauge, REGISTRY

logger = logging.getLogger("tracex_ml_metrics")

# =============================================================================
# Native Prometheus Metrics (Exported at /metrics)
# =============================================================================

def _get_or_create_metric(metric_cls, name, documentation, *args, **kwargs):
    """Avoid DuplicateMetricError during test reloads by retrieving existing registered metric."""
    if name in REGISTRY._names_to_collectors:
        return REGISTRY._names_to_collectors[name]
    return metric_cls(name, documentation, *args, **kwargs)

# 1. Prediction Volume by Evidence Strength (Strong / Moderate / Limited)
PROMETHEUS_PREDICTIONS_TOTAL = _get_or_create_metric(
    PromCounter,
    "tracex_ml_predictions_total",
    "Total ML missing link connection predictions scored",
    ["evidence_strength"],
)

# 2. Inference Latency Histogram
PROMETHEUS_PREDICTION_LATENCY = _get_or_create_metric(
    PromHistogram,
    "tracex_ml_prediction_latency_seconds",
    "ML inference latency in seconds for missing link scoring",
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.0, 5.0],
)

# 3. Evidence Strength Distribution Ratio Gauges
PROMETHEUS_EVIDENCE_STRENGTH_RATIO = _get_or_create_metric(
    PromGauge,
    "tracex_ml_evidence_strength_ratio",
    "Rolling ratio of scored connections by evidence strength bucket",
    ["evidence_strength"],
)

# 4. Weekly Drift Alert Gauge (0 = Normal, 1 = Drift Alert Triggered)
PROMETHEUS_DRIFT_ALERT_GAUGE = _get_or_create_metric(
    PromGauge,
    "tracex_ml_drift_alert_gauge",
    "Alert flag indicating Isolation Forest Strong-ratio drifted >50% from modest ~12.5% baseline (1=drift, 0=normal)",
)

# 5. Strong Ratio Percentage Deviation from Baseline
PROMETHEUS_STRONG_RATIO_DEVIATION = _get_or_create_metric(
    PromGauge,
    "tracex_ml_strong_ratio_deviation",
    "Relative percentage deviation of Strong evidence ratio from expected baseline",
)

# Baseline training contamination for Isolation Forest (Tier A structural features)
BASELINE_STRONG_RATIO = 0.125  # Expected ~10-15% Strong
DRIFT_TOLERANCE_THRESHOLD = 0.50  # 50% relative deviation triggers drift alert

# In-memory monitoring registers (preserving compatibility with legacy callers)
_METRICS = {
    "predictions_total": 0,
    "predictions_by_strength": Counter(),
    "latency_seconds_sum": 0.0,
    "latency_seconds_count": 0,
    "weekly_bucket_history": [],
}


def record_prediction_metric(evidence_strength: str, latency_seconds: float):
    """Updates prediction counter, distribution bucket, latency accumulator, and Prometheus metrics."""
    _METRICS["predictions_total"] += 1
    _METRICS["predictions_by_strength"][evidence_strength] += 1
    _METRICS["latency_seconds_sum"] += latency_seconds
    _METRICS["latency_seconds_count"] += 1

    # Update Prometheus Metrics
    try:
        PROMETHEUS_PREDICTIONS_TOTAL.labels(evidence_strength=evidence_strength).inc()
        PROMETHEUS_PREDICTION_LATENCY.observe(latency_seconds)

        # Update ratio gauges
        dist = get_evidence_strength_distribution()
        total = dist["total_predictions"]
        if total > 0:
            for strength in ["Strong", "Moderate", "Limited"]:
                ratio = dist.get(strength, 0.0)
                PROMETHEUS_EVIDENCE_STRENGTH_RATIO.labels(evidence_strength=strength).set(ratio)

            # Calculate Strong ratio deviation
            strong_ratio = dist.get("Strong", 0.0)
            rel_dev = abs(strong_ratio - BASELINE_STRONG_RATIO) / BASELINE_STRONG_RATIO
            PROMETHEUS_STRONG_RATIO_DEVIATION.set(round(rel_dev * 100, 2))

            # Set drift alert gauge if sample size >= 10 and deviation exceeds tolerance
            if total >= 10 and rel_dev > DRIFT_TOLERANCE_THRESHOLD:
                PROMETHEUS_DRIFT_ALERT_GAUGE.set(1)
            else:
                PROMETHEUS_DRIFT_ALERT_GAUGE.set(0)
    except Exception as e:
        logger.warning(f"Error publishing Prometheus ML metric: {e}")


def get_evidence_strength_distribution() -> Dict[str, Any]:
    """Calculates percentage distribution of evidence strength buckets over all scored connections."""
    total = _METRICS["predictions_total"]
    if total == 0:
        return {"Strong": 0.0, "Moderate": 0.0, "Limited": 0.0, "total_predictions": 0, "avg_latency_ms": 0.0}

    counts = _METRICS["predictions_by_strength"]
    return {
        "Strong": round(counts.get("Strong", 0) / total, 4),
        "Moderate": round(counts.get("Moderate", 0) / total, 4),
        "Limited": round(counts.get("Limited", 0) / total, 4),
        "total_predictions": total,
        "avg_latency_ms": round(
            (_METRICS["latency_seconds_sum"] / max(1, _METRICS["latency_seconds_count"])) * 1000, 2
        ),
    }


def perform_weekly_distribution_check() -> Dict[str, Any]:
    """Snapshot distribution for weekly drift detection against expected training contamination.

    Expected baseline: ~10-15% Strong (anomalous + corroborated), ~25-35% Moderate, ~50-65% Limited.
    Significant shifts indicate network graph drift or entity resolution changes.
    """
    dist = get_evidence_strength_distribution()
    total = dist["total_predictions"]
    strong_ratio = dist.get("Strong", 0.0)

    rel_deviation = (
        abs(strong_ratio - BASELINE_STRONG_RATIO) / BASELINE_STRONG_RATIO
        if BASELINE_STRONG_RATIO > 0
        else 0.0
    )
    is_drifted = total >= 10 and rel_deviation > DRIFT_TOLERANCE_THRESHOLD

    # Update Prometheus Drift Gauge
    PROMETHEUS_DRIFT_ALERT_GAUGE.set(1 if is_drifted else 0)
    PROMETHEUS_STRONG_RATIO_DEVIATION.set(round(rel_deviation * 100, 2))

    snapshot = {
        "timestamp": time.time(),
        "distribution": dist,
        "baseline_strong_ratio": BASELINE_STRONG_RATIO,
        "relative_deviation": round(rel_deviation, 4),
        "drift_detected": is_drifted,
    }
    _METRICS["weekly_bucket_history"].append(snapshot)
    if is_drifted:
        logger.warning(
            f"ALERT: ML Evidence Strength Distribution Drift Detected! Strong ratio={strong_ratio:.2%} "
            f"(baseline={BASELINE_STRONG_RATIO:.2%}, rel_dev={rel_deviation:.1%})"
        )
    else:
        logger.info(f"Weekly ML Evidence Strength Distribution Check: {dist}")
    return snapshot
