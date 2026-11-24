import pytest
from fastapi.testclient import TestClient


def test_get_cases_list(client: TestClient):
    response = client.get("/api/v1/cases")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "page_size" in data
    assert data["total"] >= 1

    first = data["items"][0]
    assert "id" in first
    assert "title" in first
    assert "status" in first
    assert "priority" in first
    assert "leadOfficer" in first


def test_get_cases_filtered(client: TestClient):
    response = client.get("/api/v1/cases?status=UNDER_ANALYSIS")
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        assert item["status"] == "UNDER_ANALYSIS"


def test_get_case_detail(client: TestClient):
    response = client.get("/api/v1/cases/CASE-2026-0891")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "CASE-2026-0891"
    assert data["title"] == "Hawala Logistics & Shadow Syndicate"
    assert "entities" in data
    assert "evidence" in data
    assert len(data["entities"]) >= 1
    assert data["entities"][0]["id"] == "PER-4401"


def test_case_not_found_rfc7807(client: TestClient):
    response = client.get("/api/v1/cases/CASE-NONEXISTENT")
    assert response.status_code == 404
    assert response.headers["content-type"] == "application/problem+json"
    problem = response.json()
    assert problem["status"] == 404
    assert problem["title"] == "Case Not Found"
    assert "detail" in problem
    assert problem["instance"] == "/api/v1/cases/CASE-NONEXISTENT"


def test_create_case_wizard(client: TestClient):
    payload = {
        "title": "Interstate Luxury Vehicle Trafficking",
        "crimeType": "Organized Vehicle Trafficking",
        "priority": "HIGH",
        "narrative": "Tampered chassis numbers and forged RTO documents.",
        "policeStation": "Central Division Police Station, Zone 3",
        "location": "Western Expressway Toll Gate",
        "confirmedEntities": [
            {
                "name": "Zahir Abbas Merchant",
                "type": "PERSON",
                "details": "Signatory on dummy importer accounts",
            }
        ],
    }
    response = client.post("/api/v1/cases", json=payload)
    assert response.status_code == 201
    created = response.json()
    assert created["title"] == payload["title"]
    assert created["crimeType"] == payload["crimeType"]
    assert created["priority"] == "HIGH"
    assert created["id"].startswith("CASE-2026-")


def test_update_case(client: TestClient):
    update_payload = {
        "priority": "CRITICAL",
        "requiresAttention": False,
        "summary": "Updated case intelligence summary after initial interrogations.",
    }
    response = client.patch("/api/v1/cases/CASE-2026-0891", json=update_payload)
    assert response.status_code == 200
    updated = response.json()
    assert updated["priority"] == "CRITICAL"
    assert updated["requiresAttention"] is False
    assert updated["summary"] == update_payload["summary"]
