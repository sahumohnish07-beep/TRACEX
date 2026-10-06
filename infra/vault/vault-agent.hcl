# HashiCorp Vault Agent Sidecar Configuration
# Auto-authenticates using AppRole (Role ID + Secret ID) and renders application secrets

pid_file = "/vault/secrets/vault-agent.pid"

vault {
  address = "http://vault:8200"
  retry {
    num_retries = 15
  }
}

auto_auth {
  method "approle" {
    mount_path = "auth/approle"
    config = {
      role_id_file_path = "/vault/creds/role-id"
      secret_id_file_path = "/vault/creds/secret-id"
      remove_secret_id_file_after_reading = false
    }
  }

  sink "file" {
    config = {
      path = "/vault/secrets/.vault-token"
      mode = 0640
    }
  }
}

template {
  source      = "/vault/templates/app.env.ctmpl"
  destination = "/vault/secrets/.env"
  perms       = 0640
}
