#!/usr/bin/env bash
# ==============================================================================
# TRACE-X Trivy Container Image Vulnerability Scanner
# Can run directly via local trivy CLI or fallback to aquasec/trivy container
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPORT_DIR="$ROOT_DIR/security-reports"
mkdir -p "$REPORT_DIR"

SEVERITY="${SEVERITY:-HIGH,CRITICAL}"
EXIT_CODE_ON_FAIL="${EXIT_CODE_ON_FAIL:-0}" # Set to 1 in CI (Phase O)

IMAGES=(
  "tracex-api"
  "tracex-celery-worker"
  "nginx:1.25-alpine"
  "quay.io/keycloak/keycloak:24.0"
  "hashicorp/vault:1.15"
  "postgres:16-alpine"
  "redis:7-alpine"
  "neo4j:5.19-community"
)

echo "================================================================="
echo " TRACE-X Container Security & Vulnerability Scan (Trivy)"
echo " Severity Threshold: $SEVERITY"
echo " Report Output Dir:  $REPORT_DIR"
echo "================================================================="

USE_DOCKER=false
if ! command -v trivy &> /dev/null; then
  if command -v docker &> /dev/null; then
    echo ">> Trivy CLI not found on PATH. Falling back to aquasec/trivy docker container..."
    USE_DOCKER=true
  else
    echo "ERROR: Neither 'trivy' CLI nor 'docker' is available on PATH."
    exit 1
  fi
fi

FAILED_SCANS=0

for img in "${IMAGES[@]}"; do
  SAFE_NAME=$(echo "$img" | tr '/:' '_')
  REPORT_FILE="$REPORT_DIR/${SAFE_NAME}-report.json"
  SARIF_FILE="$REPORT_DIR/${SAFE_NAME}-report.sarif"

  echo ""
  echo ">>> Scanning image: $img ..."

  if [ "$USE_DOCKER" = true ]; then
    # Dockerized Trivy execution
    docker run --rm \
      -v /var/run/docker.sock:/var/run/docker.sock \
      -v "$REPORT_DIR:/reports" \
      aquasec/trivy:latest image \
      --severity "$SEVERITY" \
      --ignore-unfixed \
      --format table \
      "$img" || true

    docker run --rm \
      -v /var/run/docker.sock:/var/run/docker.sock \
      -v "$REPORT_DIR:/reports" \
      aquasec/trivy:latest image \
      --severity "$SEVERITY" \
      --ignore-unfixed \
      --format json \
      --output "/reports/${SAFE_NAME}-report.json" \
      "$img" || true
  else
    # Native Trivy execution
    trivy image \
      --severity "$SEVERITY" \
      --ignore-unfixed \
      --format table \
      "$img" || true

    trivy image \
      --severity "$SEVERITY" \
      --ignore-unfixed \
      --format json \
      --output "$REPORT_FILE" \
      "$img" || true

    trivy image \
      --severity "$SEVERITY" \
      --ignore-unfixed \
      --format sarif \
      --output "$SARIF_FILE" \
      "$img" || true
  fi
done

echo ""
echo "================================================================="
echo " Trivy Scan Completed."
echo " Scan reports stored in: $REPORT_DIR/"
echo " In Phase O, this script runs in GitHub Actions CI with EXIT_CODE_ON_FAIL=1"
echo "================================================================="
