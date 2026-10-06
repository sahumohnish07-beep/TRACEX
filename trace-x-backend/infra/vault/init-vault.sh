#!/usr/bin/env bash
# ==============================================================================
# TRACE-X Vault Production-Hardened Initialization, Unseal & AppRole Setup
# ==============================================================================
set -euo pipefail

VAULT_ADDR="${VAULT_ADDR:-http://127.0.0.1:8200}"
export VAULT_ADDR
CREDS_DIR="${CREDS_DIR:-/vault/creds}"
POLICIES_DIR="${POLICIES_DIR:-/vault/policies}"
mkdir -p "$CREDS_DIR"

echo "=== TRACE-X Vault Initialization & Unseal Service ==="
echo "Target Vault Address: $VAULT_ADDR"

# Wait for Vault service to be online
echo "Waiting for Vault TCP listener..."
until curl -s "$VAULT_ADDR/v1/sys/health" > /dev/null 2>&1 || [ "$(curl -s -o /dev/null -w "%{http_code}" "$VAULT_ADDR/v1/sys/health")" = "501" ] || [ "$(curl -s -o /dev/null -w "%{http_code}" "$VAULT_ADDR/v1/sys/health")" = "503" ]; do
  sleep 1
done

INIT_STATUS=$(curl -s "$VAULT_ADDR/v1/sys/init" | grep -o '"initialized":[^,]*' | cut -d: -f2 || echo "false")

if [ "$INIT_STATUS" != "true" ]; then
  echo ">> Vault is uninitialized. Running operator init (5 key shares, threshold 3)..."
  vault operator init \
    -key-shares=5 \
    -key-threshold=3 \
    -format=json > "$CREDS_DIR/vault-init.json"

  chmod 0600 "$CREDS_DIR/vault-init.json"
  echo ">> Vault initialized. Keys stored in $CREDS_DIR/vault-init.json (Protect this file!)."
else
  echo ">> Vault is already initialized."
fi

# Perform Unseal using 3 threshold keys
if [ -f "$CREDS_DIR/vault-init.json" ]; then
  echo ">> Applying unseal keys..."
  KEY1=$(grep -o '"unseal_keys_b64":\[[^]]*\]' "$CREDS_DIR/vault-init.json" | sed 's/.*\["\(.*\)","\(.*\)","\(.*\)","\(.*\)","\(.*\)".*/\1/')
  KEY2=$(grep -o '"unseal_keys_b64":\[[^]]*\]' "$CREDS_DIR/vault-init.json" | sed 's/.*\["\(.*\)","\(.*\)","\(.*\)","\(.*\)","\(.*\)".*/\2/')
  KEY3=$(grep -o '"unseal_keys_b64":\[[^]]*\]' "$CREDS_DIR/vault-init.json" | sed 's/.*\["\(.*\)","\(.*\)","\(.*\)","\(.*\)","\(.*\)".*/\3/')
  ROOT_TOKEN=$(grep -o '"root_token":"[^"]*"' "$CREDS_DIR/vault-init.json" | cut -d'"' -f4)

  vault operator unseal "$KEY1" > /dev/null
  vault operator unseal "$KEY2" > /dev/null
  vault operator unseal "$KEY3" > /dev/null
  echo ">> Unseal completed. Vault status: ACTIVE."

  # Temporary root login to provision engine, secrets, policies, and AppRole
  export VAULT_TOKEN="$ROOT_TOKEN"

  echo ">> Configuring KV-v2 Secret Engine at 'tracex/'..."
  vault secrets enable -path=tracex kv-v2 2>/dev/null || echo "KV-v2 engine already enabled at tracex/"

  echo ">> Injecting application secrets under 'tracex/data/secrets'..."
  vault kv put tracex/secrets \
    POSTGRES_USER="${POSTGRES_USER:-postgres}" \
    POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-tracex_postgres_secure_pass_2026}" \
    POSTGRES_DB="${POSTGRES_DB:-tracex_db}" \
    POSTGRES_PORT="${POSTGRES_PORT:-5432}" \
    NEO4J_USER="${NEO4J_USER:-neo4j}" \
    NEO4J_PASSWORD="${NEO4J_PASSWORD:-tracex_graph_2026}" \
    KEYCLOAK_CLIENT_SECRET="${KEYCLOAK_CLIENT_SECRET:-tracex-secret-key-prod-99}" \
    REDIS_PASSWORD="${REDIS_PASSWORD:-tracex_redis_secure_pass_2026}" \
    SENTRY_DSN="${SENTRY_DSN:-https://placeholder_key@sentry.io/placeholder_project}"

  echo ">> Writing TRACE-X App Policy..."
  vault policy write tracex-app "$POLICIES_DIR/tracex-app-policy.hcl"

  echo ">> Enabling and configuring AppRole authentication..."
  vault auth enable approle 2>/dev/null || echo "AppRole auth already enabled"
  
  vault write auth/approle/role/tracex-app-role \
    token_policies="tracex-app" \
    token_ttl=1h \
    token_max_ttl=4h \
    secret_id_ttl=720h

  echo ">> Generating and persisting AppRole credentials for Vault Agent..."
  vault read -field=role_id auth/approle/role/tracex-app-role/role-id > "$CREDS_DIR/role-id"
  vault write -f -field=secret_id auth/approle/role/tracex-app-role/secret-id > "$CREDS_DIR/secret-id"
  chmod 0640 "$CREDS_DIR/role-id" "$CREDS_DIR/secret-id"

  echo ">> AppRole credentials generated successfully in $CREDS_DIR:"
  echo "     Role ID:   $CREDS_DIR/role-id"
  echo "     Secret ID: $CREDS_DIR/secret-id"
  echo ">> Vault initialization and AppRole bootstrapping complete."
else
  echo "Warning: $CREDS_DIR/vault-init.json not found. Unseal must be performed manually."
fi
