#!/usr/bin/env bash
# Generate self-signed TLS certificates using OpenSSL for TRACE-X local development
set -euo pipefail

CERT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$CERT_DIR"

echo "Generating local development TLS certificate for TRACE-X..."

cat > cert.conf << 'EOF'
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = req_ext

[dn]
C = IN
ST = Delhi
L = New Delhi
O = TRACE-X Law Enforcement Development
CN = localhost

[req_ext]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = tracex.local
DNS.3 = *.tracex.local
DNS.4 = nginx
DNS.5 = api
DNS.6 = keycloak
IP.1 = 127.0.0.1
EOF

openssl req -x509 -nodes -days 825 -newkey rsa:2048 \
  -keyout server.key \
  -out server.crt \
  -config cert.conf \
  -extensions req_ext

rm -f cert.conf

echo "Local development certificates generated successfully in $CERT_DIR:"
echo "  - server.key"
echo "  - server.crt"
