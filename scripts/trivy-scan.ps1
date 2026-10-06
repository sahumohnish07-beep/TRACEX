# ==============================================================================
# TRACE-X Trivy Container Image Vulnerability Scanner (PowerShell)
# Can run directly via local trivy CLI or fallback to aquasec/trivy container
# ==============================================================================
param(
    [string]$Severity = "HIGH,CRITICAL",
    [int]$ExitCodeOnFail = 0
)

$ErrorActionPreference = "Continue"

$RootDir = Split-Path -Parent $PSScriptRoot
$ReportDir = Join-Path $RootDir "security-reports"

if (-not (Test-Path $ReportDir)) {
    New-Item -ItemType Directory -Path $ReportDir -Force | Out-Null
}

$images = @(
    "tracex-api",
    "tracex-celery-worker",
    "nginx:1.25-alpine",
    "quay.io/keycloak/keycloak:24.0",
    "hashicorp/vault:1.15",
    "postgres:16-alpine",
    "redis:7-alpine",
    "neo4j:5.19-community"
)

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " TRACE-X Container Security & Vulnerability Scan (Trivy)" -ForegroundColor Cyan
Write-Host " Severity Threshold: $Severity"
Write-Host " Report Output Dir:  $ReportDir"
Write-Host "=================================================================" -ForegroundColor Cyan

$hasTrivy = [bool](Get-Command trivy -ErrorAction SilentlyContinue)
$hasDocker = [bool](Get-Command docker -ErrorAction SilentlyContinue)

if (-not $hasTrivy -and -not $hasDocker) {
    Write-Error "Neither 'trivy' CLI nor 'docker' is available on PATH."
    exit 1
}

$useDocker = -not $hasTrivy

foreach ($img in $images) {
    $safeName = $img.Replace("/", "_").Replace(":", "_")
    $reportJson = Join-Path $ReportDir "$safeName-report.json"
    $reportSarif = Join-Path $ReportDir "$safeName-report.sarif"

    Write-Host "`n>>> Scanning image: $img ..." -ForegroundColor Yellow

    if ($useDocker) {
        docker run --rm `
            -v //var/run/docker.sock:/var/run/docker.sock `
            -v "${ReportDir}:/reports" `
            aquasec/trivy:latest image `
            --severity $Severity `
            --ignore-unfixed `
            --format table `
            $img

        docker run --rm `
            -v //var/run/docker.sock:/var/run/docker.sock `
            -v "${ReportDir}:/reports" `
            aquasec/trivy:latest image `
            --severity $Severity `
            --ignore-unfixed `
            --format json `
            --output "/reports/$safeName-report.json" `
            $img
    } else {
        trivy image --severity $Severity --ignore-unfixed --format table $img
        trivy image --severity $Severity --ignore-unfixed --format json --output $reportJson $img
        trivy image --severity $Severity --ignore-unfixed --format sarif --output $reportSarif $img
    }
}

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host " Trivy Scan Completed." -ForegroundColor Green
Write-Host " Scan reports stored in: $ReportDir\" -ForegroundColor Green
Write-Host " In Phase O, this script will be wired into CI with ExitCodeOnFail=1." -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
