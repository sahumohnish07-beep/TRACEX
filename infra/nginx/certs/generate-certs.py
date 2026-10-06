#!/usr/bin/env python3
"""Generate self-signed TLS certificates for TRACE-X local development with SANs."""
import os
import datetime
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import ipaddress

def generate_self_signed_cert(output_dir: str):
    os.makedirs(output_dir, exist_ok=True)
    key_path = os.path.join(output_dir, "server.key")
    cert_path = os.path.join(output_dir, "server.crt")

    # Generate RSA 2048 private key (fast for dev, fully TLS 1.2+ compliant)
    key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )

    # Subject and Issuer (self-signed)
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COUNTRY_NAME, "IN"),
        x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "Delhi"),
        x509.NameAttribute(NameOID.LOCALITY_NAME, "New Delhi"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, "TRACE-X Law Enforcement Development"),
        x509.NameAttribute(NameOID.COMMON_NAME, "localhost"),
    ])

    now = datetime.datetime.now(datetime.timezone.utc)
    cert = (
        x509.CertificateBuilder()
        .subject_name(subject)
        .issuer_name(issuer)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(now - datetime.timedelta(days=1))
        .not_valid_after(now + datetime.timedelta(days=825))  # ~2.2 years
        .add_extension(
            x509.SubjectAlternativeName([
                x509.DNSName("localhost"),
                x509.DNSName("tracex.local"),
                x509.DNSName("*.tracex.local"),
                x509.DNSName("nginx"),
                x509.DNSName("api"),
                x509.DNSName("keycloak"),
                x509.IPAddress(ipaddress.IPv4Address("127.0.0.1")),
            ]),
            critical=False,
        )
        .add_extension(
            x509.BasicConstraints(ca=True, path_length=0),
            critical=True,
        )
        .add_extension(
            x509.KeyUsage(
                digital_signature=True,
                key_encipherment=True,
                key_cert_sign=True,
                crl_sign=False,
                content_commitment=False,
                data_encipherment=False,
                key_agreement=False,
                encipher_only=False,
                decipher_only=False,
            ),
            critical=True,
        )
        .add_extension(
            x509.ExtendedKeyUsage([
                x509.ExtendedKeyUsageOID.SERVER_AUTH,
                x509.ExtendedKeyUsageOID.CLIENT_AUTH,
            ]),
            critical=False,
        )
        .sign(key, hashes.SHA256())
    )

    with open(key_path, "wb") as f:
        f.write(
            key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.TraditionalOpenSSL,
                encryption_algorithm=serialization.NoEncryption(),
            )
        )

    with open(cert_path, "wb") as f:
        f.write(cert.public_bytes(serialization.Encoding.PEM))

    print(f"Generated certificates in: {output_dir}")
    print(f"  Key:  {key_path}")
    print(f"  Cert: {cert_path}")

if __name__ == "__main__":
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else "."
    generate_self_signed_cert(target)
