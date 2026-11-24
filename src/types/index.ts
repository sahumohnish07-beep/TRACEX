export type SourceType = 'VERIFIED_RECORD' | 'SYSTEM_DERIVED' | 'AI_ANALYSIS';

export type CaseStatus = 'ACTIVE' | 'UNDER_ANALYSIS' | 'PENDING_REVIEW' | 'CLOSED';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface CaseEntity {
  id: string;
  name: string;
  type: 'PERSON' | 'PHONE' | 'VEHICLE' | 'LOCATION' | 'ORGANIZATION';
  roleInCase: string;
  sourceType: SourceType;
}

export interface CaseItem {
  id: string;
  title: string;
  crimeType: string;
  status: CaseStatus;
  priority: PriorityLevel;
  station: string;
  leadOfficer: string;
  dateOpened: string;
  summary: string;
  entitiesCount: number;
  connectionsCount: number;
  evidenceCount: number;
  requiresAttention: boolean;
  attentionReason?: string;
}

export interface PersonRecord {
  id: string;
  fullName: string;
  aliases: string[];
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  status: 'SUSPECT' | 'PERSON_OF_INTEREST' | 'ASSOCIATE' | 'WITNESS';
  riskLevel: 'HIGH' | 'ELEVATED' | 'STANDARD';
  primaryAddress: string;
  phoneNumbers: string[];
  vehicles: string[];
  associatedCases: Array<{ caseId: string; title: string; role: string; year: string }>;
  verifiedRecordsCount: number;
  systemConnectionsCount: number;
  aiIdentifiedPatternsCount: number;
}

export interface EvidenceItem {
  id: string;
  caseId: string;
  type: string;
  description: string;
  dateCollected: string;
  collectingOfficer: string;
  chainOfCustody: string;
  sourceType: SourceType;
}

export interface MissingLinkCandidate {
  id: string;
  caseId: string;
  caseTitle: string;
  sourceEntity: { id: string; name: string; type: string };
  targetEntity: { id: string; name: string; type: string };
  evidenceStrength: 'STRONG' | 'MODERATE' | 'LIMITED';
  connectionBasis: string[];
  evidenceBasis: string[];
  identifiedDate: string;
  status: 'PENDING_REVIEW' | 'CONFIRMED' | 'DISMISSED';
}

export interface DataRequestItem {
  id: string;
  targetAuthority: string;
  requestingOfficer: string;
  caseId: string;
  caseTitle: string;
  requestDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  categories: string[];
  purpose: string;
  urgency: 'HIGH' | 'ROUTINE';
}

export interface IncomingRequestItem {
  id: string;
  requestingAgency: string;
  officerName: string;
  officerBadge: string;
  caseRef: string;
  requestDate: string;
  justification: string;
  requestedData: string[];
  availableData: string[];
  restrictedData: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  accessDuration: string;
}

export interface ReceivedDataItem {
  id: string;
  sourceAuthority: string;
  caseId: string;
  caseTitle: string;
  receivedDate: string;
  transferProtocol: string;
  summary: string;
  recordTypes: string[];
  entitiesCount: number;
  addedToView: boolean;
}

export interface InvestigationViewItem {
  id: string;
  caseId: string;
  caseTitle: string;
  title: string;
  createdDate: string;
  lastModified: string;
  nodeCount: number;
  edgeCount: number;
  notes: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officer: string;
  badgeNumber: string;
  action: string;
  caseRef: string;
  ipAddress: string;
  details: string;
}
