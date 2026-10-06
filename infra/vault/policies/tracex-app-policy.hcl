# TRACE-X Application Least-Privilege Policy
# Grants read access strictly to application runtime credentials under tracex/

path "tracex/data/secrets" {
  capabilities = ["read"]
}

path "tracex/data/*" {
  capabilities = ["read"]
}

path "tracex/metadata/*" {
  capabilities = ["read", "list"]
}
