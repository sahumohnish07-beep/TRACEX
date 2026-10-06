import logging
from typing import Dict, Any, List, Optional
from neo4j import AsyncDriver
from app.graph.driver import get_graph_driver

logger = logging.getLogger("tracex_graph_repo")

# Edge type mapping from Neo4j relationship types to frontend Cytoscape EdgeTypes
REL_TYPE_TO_EDGE_TYPE = {
    "PHONE_COMMUNICATION": "COMMUNICATION",
    "SHARED_LOCATION": "LOCATION_CO_PRESENCE",
    "SAME_VEHICLE": "OWNERSHIP",
    "SAME_CRIME_SCENE": "ASSOCIATION",
    "PREVIOUS_CASE": "SUSPECT_INVOLVEMENT",
    "KNOWN_RELATIONSHIP": "ASSOCIATION",
}


def _derive_strength(source_type: str, confidence: Optional[float]) -> str:
    if confidence is not None:
        if confidence >= 0.85:
            return "STRONG"
        if confidence >= 0.65:
            return "MODERATE"
        return "LIMITED"
    if source_type == "VERIFIED_RECORD":
        return "STRONG"
    elif source_type == "SYSTEM_DERIVED":
        return "MODERATE"
    return "LIMITED"


def _format_cytoscape_node(node_dict: Dict[str, Any], labels: List[str], connections_count: int = 0) -> Dict[str, Any]:
    node_id = str(node_dict.get("id", ""))
    label = str(node_dict.get("label") or node_dict.get("name") or node_id)
    sublabel = str(node_dict.get("sublabel") or "")
    
    # Determine NodeType matching Cytoscape types: PERSON | PHONE | VEHICLE | LOCATION | CASE | CRIME_SCENE
    raw_node_type = str(node_dict.get("nodeType", ""))
    if not raw_node_type:
        for lbl in ["Person", "Phone", "Vehicle", "Location", "Case", "CrimeScene"]:
            if lbl in labels:
                raw_node_type = "CRIME_SCENE" if lbl == "CrimeScene" else lbl.upper()
                break
    node_type = raw_node_type.upper() if raw_node_type else "PERSON"

    source_type = str(node_dict.get("source_type") or node_dict.get("sourceType") or "SYSTEM_DERIVED")
    verified = bool(node_dict.get("verified", source_type == "VERIFIED_RECORD"))
    evidence_basis = node_dict.get("evidence_basis") or []
    if isinstance(evidence_basis, str):
        evidence_basis = [evidence_basis]

    # Gather entity properties for the Inspector side panel
    properties = {}
    for k in ["status", "risk_level", "primary_address", "national_id", "carrier", "subscriber", "model", "chassis_number", "city", "station", "crime_type", "location_address"]:
        if k in node_dict and node_dict[k] is not None:
            clean_key = k.replace("_", " ").title()
            properties[clean_key] = str(node_dict[k])

    return {
        "group": "nodes",
        "data": {
            "id": node_id,
            "label": label,
            "sublabel": sublabel,
            "nodeType": node_type,
            "sourceType": source_type,
            "verified": verified,
            "connectionsCount": connections_count,
            "properties": properties,
            "evidenceBasis": evidence_basis,
            "pgId": str(node_dict.get("pg_id", "")),
        },
    }


def _format_cytoscape_edge(
    edge_dict: Dict[str, Any],
    rel_type: str,
    source_id: str,
    target_id: str,
    edge_id: Optional[str] = None
) -> Dict[str, Any]:
    e_id = edge_id or f"e-{source_id}-{target_id}-{rel_type}"
    source_type = str(edge_dict.get("source_type", "SYSTEM_DERIVED"))
    confidence = edge_dict.get("confidence")
    if confidence is not None:
        try:
            confidence = float(confidence)
        except (ValueError, TypeError):
            confidence = None

    evidence = edge_dict.get("evidence") or []
    if isinstance(evidence, str):
        evidence = [evidence]

    strength = _derive_strength(source_type, confidence)
    edge_type = REL_TYPE_TO_EDGE_TYPE.get(rel_type, "ASSOCIATION")
    label = str(edge_dict.get("label") or rel_type)

    return {
        "group": "edges",
        "data": {
            "id": e_id,
            "source": source_id,
            "target": target_id,
            "label": label,
            "edgeType": edge_type,
            "sourceType": source_type,
            "strength": strength,
            "evidenceCount": len(evidence),
            "evidence": evidence,
            "confidence": confidence,
            "createdAt": str(edge_dict.get("created_at", "")),
        },
    }


async def get_case_subgraph(case_id: str, driver: Optional[AsyncDriver] = None) -> Dict[str, List[Dict[str, Any]]]:
    """
    Returns the case network subgraph shaped exactly as {nodes: [], edges: []}
    for direct Cytoscape consumption in /cases/:id/network.
    """
    if driver is None:
        driver = get_graph_driver()

    query = """
    MATCH (c:Case {id: $case_id})
    OPTIONAL MATCH (c)-[r1]-(n1)
    OPTIONAL MATCH (n1)-[r2]-(n2)
    WHERE NOT n2:Case OR n2.id = $case_id
    WITH collect(DISTINCT c) + collect(DISTINCT n1) + collect(DISTINCT n2) AS all_nodes
    UNWIND all_nodes AS node
    WITH DISTINCT node
    WHERE node IS NOT NULL
    MATCH (node)-[rel]-(other)
    WHERE other IN all_nodes AND id(node) < id(other)
    RETURN collect(DISTINCT node) AS nodes,
           collect(DISTINCT {rel: rel, source: startNode(rel).id, target: endNode(rel).id, type: type(rel)}) AS edges
    """

    nodes_result = []
    edges_result = []
    node_degree_map: Dict[str, int] = {}

    async with driver.session() as session:
        result = await session.run(query, case_id=case_id)
        record = await result.single()

        if not record or not record["nodes"]:
            # Fallback if case has no connections yet: return just the case node if it exists
            case_res = await session.run("MATCH (c:Case {id: $case_id}) RETURN c, labels(c) AS labels", case_id=case_id)
            c_rec = await case_res.single()
            if c_rec:
                nodes_result.append(_format_cytoscape_node(dict(c_rec["c"]), c_rec["labels"], 0))
            return {"nodes": nodes_result, "edges": edges_result}

        raw_nodes = record["nodes"]
        raw_edges = record["edges"]

        # Calculate degrees
        for e in raw_edges:
            src = e["source"]
            tgt = e["target"]
            node_degree_map[src] = node_degree_map.get(src, 0) + 1
            node_degree_map[tgt] = node_degree_map.get(tgt, 0) + 1

        for n in raw_nodes:
            nid = n.get("id")
            labels = list(n.labels) if hasattr(n, "labels") else []
            degree = node_degree_map.get(nid, 0)
            nodes_result.append(_format_cytoscape_node(dict(n), labels, degree))

        for idx, e in enumerate(raw_edges):
            rel_obj = e["rel"]
            rel_type = e["type"]
            src = e["source"]
            tgt = e["target"]
            edge_id = f"e-{src}-{tgt}-{idx}"
            edges_result.append(_format_cytoscape_edge(dict(rel_obj), rel_type, src, tgt, edge_id))

    return {"nodes": nodes_result, "edges": edges_result}


async def get_node_neighbors(
    node_id: str,
    depth: int = 1,
    driver: Optional[AsyncDriver] = None
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Returns subgraph around node_id up to 'depth' hops (depth between 1 and 3)
    shaped as {nodes: [], edges: []}.
    """
    if driver is None:
        driver = get_graph_driver()

    safe_depth = max(1, min(depth, 3))

    query = f"""
    MATCH (root {{id: $node_id}})
    OPTIONAL MATCH path = (root)-[*1..{safe_depth}]-(neighbor)
    WITH root, collect(DISTINCT neighbor) AS neighbors, collect(DISTINCT path) AS paths
    WITH [root] + neighbors AS all_nodes, paths
    UNWIND all_nodes AS node
    WITH DISTINCT node, all_nodes
    WHERE node IS NOT NULL
    MATCH (node)-[rel]-(other)
    WHERE other IN all_nodes AND id(node) < id(other)
    RETURN collect(DISTINCT node) AS nodes,
           collect(DISTINCT {{rel: rel, source: startNode(rel).id, target: endNode(rel).id, type: type(rel)}}) AS edges
    """

    nodes_result = []
    edges_result = []
    node_degree_map: Dict[str, int] = {}

    async with driver.session() as session:
        result = await session.run(query, node_id=node_id)
        record = await result.single()

        if not record or not record["nodes"]:
            # Node might exist isolated
            isolated_res = await session.run("MATCH (n {id: $node_id}) RETURN n, labels(n) AS labels", node_id=node_id)
            iso_rec = await isolated_res.single()
            if iso_rec:
                nodes_result.append(_format_cytoscape_node(dict(iso_rec["n"]), iso_rec["labels"], 0))
            return {"nodes": nodes_result, "edges": edges_result}

        raw_nodes = record["nodes"]
        raw_edges = record["edges"]

        for e in raw_edges:
            src = e["source"]
            tgt = e["target"]
            node_degree_map[src] = node_degree_map.get(src, 0) + 1
            node_degree_map[tgt] = node_degree_map.get(tgt, 0) + 1

        for n in raw_nodes:
            nid = n.get("id")
            labels = list(n.labels) if hasattr(n, "labels") else []
            degree = node_degree_map.get(nid, 0)
            nodes_result.append(_format_cytoscape_node(dict(n), labels, degree))

        for idx, e in enumerate(raw_edges):
            rel_obj = e["rel"]
            rel_type = e["type"]
            src = e["source"]
            tgt = e["target"]
            edge_id = f"e-{src}-{tgt}-{idx}"
            edges_result.append(_format_cytoscape_edge(dict(rel_obj), rel_type, src, tgt, edge_id))

    return {"nodes": nodes_result, "edges": edges_result}


async def search_nodes(query: str, limit: int = 20, driver: Optional[AsyncDriver] = None) -> List[Dict[str, Any]]:
    """
    Searches nodes across all labels matching name, label, id, phone number, or vehicle plate.
    Returns array of node objects.
    """
    if driver is None:
        driver = get_graph_driver()

    clean_query = query.strip()
    if not clean_query:
        return []

    cypher = """
    MATCH (n)
    WHERE n:Person OR n:Phone OR n:Vehicle OR n:Location OR n:Case OR n:CrimeScene
    WHERE toLower(coalesce(n.name, '')) CONTAINS toLower($query)
       OR toLower(coalesce(n.label, '')) CONTAINS toLower($query)
       OR toLower(coalesce(n.id, '')) CONTAINS toLower($query)
       OR toLower(coalesce(n.number, '')) CONTAINS toLower($query)
       OR toLower(coalesce(n.plate, '')) CONTAINS toLower($query)
       OR toLower(coalesce(n.case_number, '')) CONTAINS toLower($query)
       OR toLower(coalesce(n.address, '')) CONTAINS toLower($query)
    RETURN n, labels(n) AS labels
    LIMIT $limit
    """

    results = []
    async with driver.session() as session:
        res = await session.run(cypher, query=clean_query, limit=limit)
        async for record in res:
            node = record["n"]
            labels = record["labels"]
            results.append(_format_cytoscape_node(dict(node), labels, 0))

    return results


async def get_connection_explanation(
    node_a_id: str,
    node_b_id: str,
    driver: Optional[AsyncDriver] = None
) -> Dict[str, Any]:
    """
    Returns the evidence list, source_type, and connection basis that feeds
    the frontend's "WHY IS THIS CONNECTION SHOWN?" side panel in Network Analysis
    and Missing Link Analysis.
    """
    if driver is None:
        driver = get_graph_driver()

    # 1. First check for direct relationship between node A and node B
    direct_query = """
    MATCH (a {id: $node_a_id})-[r]-(b {id: $node_b_id})
    RETURN a, b, labels(a) AS a_labels, labels(b) AS b_labels,
           type(r) AS rel_type, properties(r) AS rel_props
    """

    async with driver.session() as session:
        res = await session.run(direct_query, node_a_id=node_a_id, node_b_id=node_b_id)
        records = [rec async for rec in res]

        if records:
            all_evidence: List[str] = []
            rel_types: List[str] = []
            source_types: List[str] = []
            confidences: List[float] = []

            for rec in records:
                rel_types.append(rec["rel_type"])
                props = rec["rel_props"]
                ev = props.get("evidence", [])
                if isinstance(ev, list):
                    all_evidence.extend(ev)
                elif isinstance(ev, str):
                    all_evidence.append(ev)

                st = props.get("source_type", "SYSTEM_DERIVED")
                source_types.append(st)
                if props.get("confidence") is not None:
                    try:
                        confidences.append(float(props["confidence"]))
                    except (ValueError, TypeError):
                        pass

            # Prioritize VERIFIED_RECORD > SYSTEM_DERIVED > AI_ANALYSIS
            primary_source_type = "AI_ANALYSIS"
            if "VERIFIED_RECORD" in source_types:
                primary_source_type = "VERIFIED_RECORD"
            elif "SYSTEM_DERIVED" in source_types:
                primary_source_type = "SYSTEM_DERIVED"

            avg_confidence = (sum(confidences) / len(confidences)) if confidences else None

            # Deduplicate evidence list
            unique_evidence = list(dict.fromkeys(all_evidence))
            if not unique_evidence:
                unique_evidence = [
                    f"Directly linked via verified case investigation records and {rel_types[0]} association."
                ]

            return {
                "direct_connection": True,
                "node_a_id": node_a_id,
                "node_b_id": node_b_id,
                "relationship_types": rel_types,
                "source_type": primary_source_type,
                "evidence": unique_evidence,
                "confidence": avg_confidence,
                "strength": _derive_strength(primary_source_type, avg_confidence),
                "connection_basis": [
                    f"{r.replace('_', ' ').title()} recorded between entities" for r in rel_types
                ],
            }

        # 2. If no direct connection, check shortest path
        path_query = """
        MATCH (a {id: $node_a_id}), (b {id: $node_b_id})
        MATCH p = shortestPath((a)-[*..4]-(b))
        RETURN [n in nodes(p) | n.id] AS node_ids,
               [n in nodes(p) | coalesce(n.label, n.name, n.id)] AS node_labels,
               [r in relationships(p) | type(r)] AS rel_types,
               [r in relationships(p) | properties(r).evidence] AS path_evidence,
               [r in relationships(p) | properties(r).source_type] AS path_sources
        """
        path_res = await session.run(path_query, node_a_id=node_a_id, node_b_id=node_b_id)
        path_rec = await path_res.single()

        if path_rec:
            node_ids = path_rec["node_ids"]
            node_labels = path_rec["node_labels"]
            rel_types = path_rec["rel_types"]
            path_sources = path_rec["path_sources"]

            path_ev: List[str] = []
            for ev_item in path_rec["path_evidence"]:
                if isinstance(ev_item, list):
                    path_ev.extend(ev_item)
                elif isinstance(ev_item, str):
                    path_ev.append(ev_item)

            hops = len(node_ids) - 1
            explanation = [
                f"Multi-hop correlation identified across {hops} intermediary node(s): {' -> '.join(node_labels)}"
            ]
            if path_ev:
                explanation.extend(list(dict.fromkeys(path_ev))[:3])

            return {
                "direct_connection": False,
                "hops": hops,
                "node_a_id": node_a_id,
                "node_b_id": node_b_id,
                "path_nodes": node_ids,
                "relationship_types": rel_types,
                "source_type": "AI_ANALYSIS",
                "evidence": explanation,
                "confidence": round(0.85 ** hops, 2),
                "strength": "MODERATE" if hops <= 2 else "LIMITED",
                "connection_basis": [
                    f"Indirect {hops}-hop graph traversal link",
                    f"Bridge entities: {', '.join(node_labels[1:-1])}" if hops > 1 else "Direct adjacent link"
                ],
            }

        # 3. No connection found
        return {
            "direct_connection": False,
            "hops": None,
            "node_a_id": node_a_id,
            "node_b_id": node_b_id,
            "relationship_types": [],
            "source_type": "SYSTEM_DERIVED",
            "evidence": ["No recorded graph path found within search horizon (max 4 hops)."],
            "confidence": None,
            "strength": "LIMITED",
            "connection_basis": ["Independent entity in station ledger"],
        }
