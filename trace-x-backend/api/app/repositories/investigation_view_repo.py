from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.investigation_view import InvestigationView
from app.schemas.investigation_view import InvestigationViewItem, InvestigationViewSaveRequest
from app.core.errors import ProblemException

_VIEW_STORE = {
    "VIEW-891-A": {
        "id": "VIEW-891-A",
        "caseId": "CASE-2026-0891",
        "caseTitle": "Hawala Logistics & Shadow Syndicate",
        "title": "Dockyard Cash Courier Flow & Cold Storage Network",
        "createdDate": "2026-02-20",
        "lastModified": "2026-02-26 14:10 IST",
        "nodeCount": 18,
        "edgeCount": 24,
        "notes": "Working hypothesis: Cold Storage Unit 4 used as intermediate transfer hub before cash reaches bullion dealers.",
    },
    "VIEW-744-B": {
        "id": "VIEW-744-B",
        "caseId": "CASE-2026-0744",
        "caseTitle": "Interstate Luxury Vehicle Theft",
        "title": "Chassis Tampering Racket - MIDC Garage Cluster",
        "createdDate": "2026-02-12",
        "lastModified": "2026-02-24 11:30 IST",
        "nodeCount": 12,
        "edgeCount": 16,
        "notes": "Isolated cluster around Deva Sawant and two forged fitness certification agents.",
    },
}


def get_investigation_view(db: Session, view_id: str) -> InvestigationViewItem:
    # Check DB or fallback
    view_db = db.query(InvestigationView).filter(InvestigationView.view_identifier == view_id).first()
    if view_db:
        return InvestigationViewItem(
            id=view_db.view_identifier,
            caseId=view_db.case_number or "CASE-2026-0891",
            caseTitle=view_db.case_title or "Station Case",
            title=view_db.title,
            createdDate=view_db.created_at.strftime("%Y-%m-%d"),
            lastModified=view_db.updated_at.strftime("%Y-%m-%d %H:%M IST"),
            nodeCount=view_db.node_count,
            edgeCount=view_db.edge_count,
            notes=view_db.notes,
            graphState=view_db.graph_state,
        )

    if view_id in _VIEW_STORE:
        return InvestigationViewItem(**_VIEW_STORE[view_id])

    # Default fallback
    return InvestigationViewItem(
        id=view_id,
        caseId="CASE-2026-0891",
        caseTitle="Hawala Logistics & Shadow Syndicate",
        title=f"Custom Workspace View ({view_id})",
        createdDate="2026-02-20",
        lastModified="2026-02-26 14:10 IST",
        nodeCount=18,
        edgeCount=24,
        notes="Private sandbox layout saved by lead investigator.",
    )


def save_investigation_view(
    db: Session,
    view_id: str,
    req: InvestigationViewSaveRequest,
) -> InvestigationViewItem:
    if view_id in _VIEW_STORE:
        if req.title:
            _VIEW_STORE[view_id]["title"] = req.title
        if req.notes is not None:
            _VIEW_STORE[view_id]["notes"] = req.notes
        if req.nodeCount is not None:
            _VIEW_STORE[view_id]["nodeCount"] = req.nodeCount
        if req.edgeCount is not None:
            _VIEW_STORE[view_id]["edgeCount"] = req.edgeCount
        _VIEW_STORE[view_id]["lastModified"] = "2026-02-26 15:45 IST"
        return InvestigationViewItem(**_VIEW_STORE[view_id])

    new_item = {
        "id": view_id,
        "caseId": "CASE-2026-0891",
        "caseTitle": "Hawala Logistics & Shadow Syndicate",
        "title": req.title or f"Custom Workspace View ({view_id})",
        "createdDate": "2026-02-26",
        "lastModified": "2026-02-26 15:45 IST",
        "nodeCount": req.nodeCount or 18,
        "edgeCount": req.edgeCount or 24,
        "notes": req.notes or "",
        "graphState": req.graphState,
    }
    _VIEW_STORE[view_id] = new_item
    return InvestigationViewItem(**new_item)
