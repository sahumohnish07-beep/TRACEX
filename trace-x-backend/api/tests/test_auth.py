import pytest
from fastapi.testclient import TestClient
from app.main import app

def test_protected_endpoint_without_token():
    with TestClient(app) as raw_client:
        resp = raw_client.get("/api/v1/dashboard/summary")
        assert resp.status_code == 401
        data = resp.json()
        assert data["status"] == 401
        assert "detail" in data

def test_protected_endpoint_with_invalid_token():
    with TestClient(app) as raw_client:
        resp = raw_client.get(
            "/api/v1/dashboard/summary",
            headers={"Authorization": "Bearer invalid_garbage_token"}
        )
        assert resp.status_code == 401
        data = resp.json()
        assert data["status"] == 401


def test_protected_endpoint_with_valid_token(client: TestClient):
    resp = client.get(
        "/api/v1/dashboard/summary",
        headers={"Authorization": "Bearer mock_dev_access_token"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "stat_cards" in data
    assert "requires_attention" in data

def test_auth_token_exchange(client: TestClient):
    resp = client.post(
        "/api/v1/auth/token",
        json={
            "code": "test_auth_code_123",
            "code_verifier": "test_pkce_verifier_xyz_secure_random_string",
            "redirect_uri": "http://localhost:5173/auth/callback"
        }
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "Bearer"
    assert data["user"]["badge_number"] == "DL-7482"
    assert "local-authority" in data["user"]["roles"]
    assert "tracex_refresh_token" in resp.cookies

def test_auth_refresh_with_cookie(client: TestClient):
    # Set mock cookie
    client.cookies.set("tracex_refresh_token", "mock_refresh_token_valid")
    resp = client.post("/api/v1/auth/refresh")
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["username"] == "officer_vikram"

def test_auth_refresh_without_cookie_fails(client: TestClient):
    client.cookies.clear()
    resp = client.post("/api/v1/auth/refresh")
    assert resp.status_code == 401
    data = resp.json()
    assert data["status"] == 401

def test_auth_me_endpoint(client: TestClient):
    resp = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer mock_dev_access_token"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["username"] == "officer_vikram"
    assert data["authority_tier"] == "LOCAL"
    assert data["authority_id"] == "AUTH-DELHI-NORTH"

def test_auth_logout(client: TestClient):
    client.cookies.set("tracex_refresh_token", "mock_refresh_token_valid")
    resp = client.post("/api/v1/auth/logout")
    assert resp.status_code == 200
    assert resp.json()["status"] == "logged_out"
