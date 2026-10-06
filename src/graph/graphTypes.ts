import type { SourceType } from '../types';

export type NodeType = 'PERSON' | 'PHONE' | 'VEHICLE' | 'LOCATION' | 'CASE' | 'CRIME_SCENE';

export type EdgeType = 'COMMUNICATION' | 'ASSOCIATION' | 'OWNERSHIP' | 'LOCATION_CO_PRESENCE' | 'FINANCIAL_TRANSFER' | 'SUSPECT_INVOLVEMENT';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface GraphNodeData {
  id: string;
  label: string;
  sublabel?: string;
  nodeType: NodeType;
  sourceType: SourceType;
  verified: boolean;
  isKingpin?: boolean;
  investigativePriority?: PriorityLevel;
  investigationRationale?: string;
  connectionsCount?: number;
  properties?: Record<string, string>;
  evidenceBasis?: string[];
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  label: string;
  edgeType: EdgeType;
  sourceType: SourceType;
  strength?: 'STRONG' | 'MODERATE' | 'LIMITED';
  investigativePriority?: PriorityLevel;
  investigationRationale?: string;
  evidenceCount?: number;
  evidence: string[];
}

export interface CytoscapeNodeElement {
  group: 'nodes';
  data: GraphNodeData;
  position?: { x: number; y: number };
}

export interface CytoscapeEdgeElement {
  group: 'edges';
  data: GraphEdgeData;
}

export type CytoscapeElement = CytoscapeNodeElement | CytoscapeEdgeElement;
