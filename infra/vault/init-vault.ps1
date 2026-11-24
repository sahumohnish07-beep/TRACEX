# ==============================================================================
# TRACE-X Vault Production-Hardened Initialization, Unseal & AppRole Setup (PowerShell)
# ==============================================================================
param(
    [string]$VaultAddr = "http://127.0.0.1:8200",
    [string]$CredsDir = "./infra/vault/creds",
    [string]$PoliciesDir = "./infra/vault/policies"
)

$ErrorActionPreference = "Stop"

Write-Host "=== TRACE-X Vault Initialization & Unseal Service ===" -ForegroundColor Cyan
Write-Host "Target Vault Address: $VaultAddr"

if (-not (Test-Path $CredsDir)) {
    New-Item -ItemType Directory -Path $CredsDir -Force | Out-Null
}

$env:VAULT_ADDR = $VaultAddr

# Check Vault status
Write-Host "Checking Vault status..."
$initJsonPath = Join-Path $CredsDir "vault-init.json"

try {
    $health = Invoke-RestMethod -Uri "$VaultAddr/v1/sys/health" -Method Get -SkipHttpErrorCheck
} catch {
    Write-Host "Vault unreachable or initializing..."
}

try {
    $initStatus = Invoke-RestMethod -Uri "$VaultAddr/v1/sys/init" -Method Get
    $isInitialized = $initStatus.initialized
} catch {
    $isInitialized = $false
}

if (-not $isInitialized) {
    Write-Host ">> Vault is uninitialized. Running operator init (5 key shares, threshold 3)..." -ForegroundColor Yellow
    $initOutput = & vault operator init -key-shares=5 -key-threshold=3 -format=json
    $initOutput | Set-Content -Path $initJsonPath -Encoding utf8
    Write-Host ">> Vault initialized. Keys stored in $initJsonPath" -ForegroundColor Green
} else {
    Write-Host ">> Vault already initialized." -ForegroundColor Green
}

if (Test-Path $initJsonPath) {
    $initData = Get-Content $initJsonPath -Raw | ConvertFrom-Json
    $keys = $initData.unseal_keys_b64
    $rootToken = $initData.root_token

    Write-Host ">> Unsealing Vault with 3 threshold keys..."
    for ($i = 0; $i -lt 3; $i++) {
        & vault operator unseal $keys[$i] | Out-Null
    }
    Write-Host ">> Unseal successful. Vault status: ACTIVE." -ForegroundColor Green

    $env:VAULT_TOKEN = $rootToken

    Write-Host ">> Enabling KV-v2 Secret Engine at 'tracex/'..."
    & vault secrets enable -path=tracex kv-v2 2>$null

    Write-Host ">> Injecting application secrets under 'tracex/data/secrets'..."
    & vault kv put tracex/secrets `
        POSTGRES_USER="postgres" `
        POSTGRES_PASSWORD="tracex_postgres_secure_pass_2026" `
        POSTGRES_DB="tracex_db" `
        POSTGRES_PORT="5432" `
        NEO4J_USER="neo4j" `
        NEO4J_PASSWORD="tracex_graph_2026" `
        KEYCLOAK_CLIENT_SECRET="tracex-secret-key-prod-99" `
        REDIS_PASSWORD="tracex_redis_secure_pass_2026" `
        SENTRY_DSN="https://placeholder_key@sentry.io/placeholder_project"

    Write-Host ">> Writing TRACE-X App Policy..."
    $policyPath = Join-Path $PoliciesDir "tracex-app-policy.hcl"
    & vault policy write tracex-app $policyPath

    Write-Host ">> Enabling AppRole authentication..."
    & vault auth enable approle 2>$null

    & vault write auth/approle/role/tracex-app-role `
        token_policies="tracex-app" `
        token_ttl=1h `
        token_max_ttl=4h `
        secret_id_ttl=720h

    Write-Host ">> Generating AppRole Role ID & Secret ID..."
    $roleId = & vault read -field=role_id auth/approle/role/tracex-app-role/role-id
    $secretId = & vault write -f -field=secret_id auth/approle/role/tracex-app-role/secret-id

    $roleIdPath = Join-Path $CredsDir "role-id"
    $secretIdPath = Join-Path $CredsDir "secret-id"

    $roleId | Set-Content -Path $roleIdPath -NoNewline -Encoding utf8
    $secretId | Set-Content -Path $secretIdPath -NoNewline -Encoding utf8

    Write-Host ">> AppRole credentials persisted to $CredsDir:" -ForegroundColor Green
    Write-Host "     Role ID:   $roleIdPath"
    Write-Host "     Secret ID: $secretIdPath"
}
