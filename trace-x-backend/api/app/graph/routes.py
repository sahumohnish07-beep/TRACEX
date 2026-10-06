from fastapi import APIRouter, Query, HTTPException, status
from typing import Dict, Any, List, Optional
from app.graph.repository import (
    get_case_subgraph,
    get_node_neighbors,
    search_nodes,
    get_connection_explanation,
)

router = APIRouter(prefix="/graph", tags=["Network Graph & Missing Links"])


@router.get("/cases/{case_id}/subgraph", response_model=Dict[str, Any])
async def get_case_network(case_id: str):
    """
    Get multi-entity association graph for a case, shaped directly
    as {nodes: [], edges: []} for Cytoscape.js rendering.
    """
    try:
        subgraph = await get_case_subgraph(case_id=case_id)
        return subgraph
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve graph for case {case_id}: {str(e)}",
        )


@router.get("/nodes/{node_id}/neighbors", response_model=Dict[str, Any])
async def get_neighbors(
    node_id: str,
    depth: int = Query(default=1, ge=1, le=3, description="Expansion traversal depth (1 to 3 hops)"),
):
    """
    Get neighbors around a node up to specified depth, shaped as Cytoscape elements.
    """
    try:
        return await get_node_neighbors(node_id=node_id, depth=depth)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to expand neighbors for node {node_id}: {str(e)}",
        )


@router.get("/nodes/search", response_model=List[Dict[str, Any]])
async def search_graph_nodes(
    q: str = Query(..., min_length=1, description="Entity search query (name, label, id, plate, phone)"),
    limit: int = Query(default=20, ge=1, le=100),
):
    """
    Fulltext and substring search across all node types in the graph.
    """
    try:
        return await search_nodes(query=q, limit=limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Graph search error: {str(e)}",
        )


@router.get("/explanation", response_model=Dict[str, Any])
async def explain_connection(
    node_a_id: str = Query(..., description="First entity identifier (e.g. PER-4401)"),
    node_b_id: str = Query(..., description="Second entity identifier (e.g. LOC-302)"),
):
    """
    Feeds the 'WHY IS THIS CONNECTION SHOWN?' panel in Network Analysis and Missing Links.
    Returns source_type, evidence list, confidence, and connection basis.
    """
    try:
        return await get_connection_explanation(node_a_id=node_a_id, node_b_id=node_b_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate connection explanation: {str(e)}",
        )
