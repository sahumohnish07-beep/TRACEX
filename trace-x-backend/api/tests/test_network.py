import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient


def test_node_explanation_endpoint(client: TestClient):
    response = client.get("/api/v1/network/nodes/PER-4401/explanation")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "PER-4401"
    assert data["label"] == "Tariq Merchant"
    assert data["nodeType"] == "PERSON"
    assert data["sourceType"] == "VERIFIED_RECORD"
    assert data["verified"] is True
    assert "associatedCasesCount" in data
    assert "phoneCount" in data
    assert "vehicleCount" in data
    assert "evidenceList" in data
    assert len(data["evidenceList"]) > 0


@patch("app.routers.network.get_case_subgraph", new_callable=AsyncMock)
def test_get_case_network_cytoscape_shape(mock_subgraph, client: TestClient):
    mock_subgraph.return_value = {
        "nodes": [
            {
                "group": "nodes",
                "data": {
                    "id": "CASE-2026-0891",
                    "label": "CASE-2026-0891",
                    "sublabel": "Hawala Logistics Syndicate",
                    "nodeType": "CASE",
                    "sourceType": "VERIFIED_RECORD",
                    "verified": True,
                    "connectionsCount": 8,
                },
            },
            {
                "group": "nodes",
                "data": {
                    "id": "PER-4401",
                    "label": "Tariq Merchant",
                    "sublabel": "Primary Suspect",
                    "nodeType": "PERSON",
                    "sourceType": "VERIFIED_RECORD",
                    "verified": True,
                    "connectionsCount": 6,
                },
            },
        ],
        "edges": [
            {
                "group": "edges",
                "data": {
                    "id": "e-case-tariq",
                    "source": "CASE-2026-0891",
                    "target": "PER-4401",
                    "label": "PRIMARY_SUSPECT",
                    "edgeType": "ASSOCIATION",
                    "sourceType": "VERIFIED_RECORD",
                    "strength": "STRONG",
                    "evidence": ["FIR #18/26"],
                },
            }
        ],
    }

    response = client.get("/api/v1/cases/CASE-2026-0891/network")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "edges" in data
    assert len(data["nodes"]) == 2
    assert len(data["edges"]) == 1

    first_node = data["nodes"][0]
    assert first_node["group"] == "nodes"
    assert first_node["data"]["id"] == "CASE-2026-0891"
    assert first_node["data"]["nodeType"] == "CASE"

    first_edge = data["edges"][0]
    assert first_edge["group"] == "edges"
    assert first_edge["data"]["source"] == "CASE-2026-0891"
    assert first_edge["data"]["target"] == "PER-4401"
    assert first_edge["data"]["edgeType"] == "ASSOCIATION"
    assert first_edge["data"]["sourceType"] == "VERIFIED_RECORD"


def test_dashboard_summary_endpoint(client: TestClient):
    response = client.get("/api/v1/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "stats" in data
    assert "recentCases" in data
    assert "requiresAttention" in data
    assert data["stats"]["activeCases"] >= 1
    assert data["stats"]["casesUnderAnalysis"] >= 1


def test_missing_links_endpoint(client: TestClient):
    response = client.get("/api/v1/cases/CASE-2026-0891/missing-links")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    first = data[0]
    assert "id" in first
    assert "sourceEntity" in first
    assert "targetEntity" in first
    assert "evidenceStrength" in first
    assert "connectionBasis" in first
    assert "evidenceBasis" in first


def test_audit_log_endpoint(client: TestClient):
    response = client.get("/api/v1/audit-log")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 1
    first = data["items"][0]
    assert "action" in first
    assert "officer" in first
    assert "badgeNumber" in first
