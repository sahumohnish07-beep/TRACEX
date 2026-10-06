from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "TRACE-X Criminal Network Analysis API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # PostgreSQL Configuration
    POSTGRES_SERVER: str = "postgres"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "tracex_db"

    @property
    def async_database_url(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    @property
    def sync_database_url(self) -> str:
        return f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Neo4j Graph DB Configuration
    NEO4J_URI: str = "bolt://neo4j:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "tracex_graph_2026"

    # Redis & Celery Configuration
    REDIS_URL: str = "redis://redis:6379/0"
    CELERY_BROKER_URL: str = "redis://redis:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://redis:6379/1"

    # Keycloak Configuration
    KEYCLOAK_SERVER_URL: str = "http://keycloak:8080"
    KEYCLOAK_REALM: str = "tracex"
    KEYCLOAK_CLIENT_ID: str = "tracex-api"
    KEYCLOAK_CLIENT_SECRET: str = "tracex-secret-key"

    # HashiCorp Vault Configuration
    VAULT_URL: str = "http://vault:8200"
    VAULT_TOKEN: str = "tracex-dev-root-token"

    # Observability & Monitoring
    SENTRY_DSN: str = "https://placeholder_key@sentry.io/placeholder_project"

    # CORS Origins (allow frontend on local dev & hardened TLS reverse proxy)
    BACKEND_CORS_ORIGINS: List[str] = [
        "https://localhost",
        "https://127.0.0.1",
        "https://tracex.local",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:80",
        "http://localhost",
    ]

    model_config = SettingsConfigDict(
        env_file=("/vault/secrets/.env", ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow",
    )


settings = Settings()
