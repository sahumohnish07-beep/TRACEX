from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class CytoscapeNodeData(BaseModel):
    id: str = Field(..., example="PER-4401")
    label: str = Field(..., example="Tariq Merchant")
    sublabel: Optional[str] = Field(default=None, example="Primary Suspect")
    nodeType: str = Field(..., example="PERSON")
    sourceType: str = Field(..., example="VERIFIED_RECORD")
    verified: bool = Field(default=True, example=True)
    connectionsCount: Optional[int] = Field(default=0, example=6)
    properties: Optional[Dict[str, str]] = Field(default_factory=dict)
    evidenceBasis: Optional[List[str]] = Field(default_factory=list)
    pgId: Optional[str] = None


class CytoscapeNodeElement(BaseModel):
    group: str = Field(default="nodes", example="nodes")
    data: CytoscapeNodeData


class CytoscapeEdgeData(BaseModel):
    id: str = Field(..., example="e-PER-4401-PER-4402")
    source: str = Field(..., example="PER-4401")
    target: str = Field(..., example="PER-4402")
    label: str = Field(..., example="COORDINATION")
    edgeType: str = Field(..., example="ASSOCIATION")
    sourceType: str = Field(..., example="VERIFIED_RECORD")
    strength: Optional[str] = Field(default="STRONG", example="STRONG")
    evidenceCount: Optional[int] = Field(default=1, example=2)
    evidence: List[str] = Field(default_factory=list, example=["124 recorded voice calls in 30 days"])
    confidence: Optional[float] = Field(default=None, example=0.99)
    createdAt: Optional[str] = None


class CytoscapeEdgeElement(BaseModel):
    group: str = Field(default="edges", example="edges")
    data: CytoscapeEdgeData


class CytoscapeGraphResponse(BaseModel):
    nodes: List[CytoscapeNodeElement]
    edges: List[CytoscapeEdgeElement]


class NodeExplanationResponse(BaseModel):
    id: str = Field(..., example="PER-4401")
    label: str = Field(..., example="Tariq Merchant")
    nodeType: str = Field(..., example="PERSON")
    sourceType: str = Field(..., example="VERIFIED_RECORD")
    verified: bool = Field(default=True)
    sublabel: Optional[str] = None
    associatedCasesCount: int = Field(default=0, example=2)
    phoneCount: int = Field(default=0, example=2)
    vehicleCount: int = Field(default=0, example=2)
    locationCount: int = Field(default=0, example=1)
    evidenceList: List[str] = Field(default_factory=list)
    properties: Dict[str, str] = Field(default_factory=dict)
