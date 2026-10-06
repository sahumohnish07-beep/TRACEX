/**
 * TRACE-X Typed API Services
 * Built on OpenAPI generated schema (src/api/schema.d.ts) and apiClient
 * With automatic seamless fallback to local mock repositories when backend API is offline
 */

import { api } from './client';
import type {
  CaseItem,
  MissingLinkCandidate,
  DataRequestItem,
  IncomingRequestItem,
  ReceivedDataItem,
  InvestigationViewItem,
  AuditLogEntry,
  PersonRecord,
} from '../types';
import type { CytoscapeElement } from '../graph/graphTypes';
import {
  MOCK_STAT_COUNTS,
  MOCK_CASES,
  MOCK_PERSONS,
  MOCK_MISSING_LINKS,
  MOCK_DATA_REQUESTS,
  MOCK_INCOMING_REQUESTS,
  MOCK_RECEIVED_DATA,
  MOCK_INVESTIGATION_VIEWS,
  MOCK_AUDIT_LOGS,
  MOCK_CASE_NETWORK_ELEMENTS,
} from '../data/mockData';

// Cache offline state for 30s to avoid repeated socket timeouts in dev mode
let backendOfflineUntil = 0;

export const isBackendKnownOffline = (): boolean => {
  return Date.now() < backendOfflineUntil;
};

export const markBackendOffline = (): void => {
  backendOfflineUntil = Date.now() + 30000;
};

// ============================================================================
// 1. Dashboard API
// ============================================================================
export interface DashboardSummaryResponse {
  activeCases: number;
  casesUnderAnalysis: number;
  pendingRequests: number;
  newConnections: number;
  recentCases: CaseItem[];
}

const getMockDashboardSummary = (): DashboardSummaryResponse => ({
  activeCases: MOCK_STAT_COUNTS.activeCases,
  casesUnderAnalysis: MOCK_STAT_COUNTS.casesUnderAnalysis,
  pendingRequests: MOCK_STAT_COUNTS.pendingRequests,
  newConnections: MOCK_STAT_COUNTS.newConnections,
  recentCases: MOCK_CASES.slice(0, 5),
});

export const fetchDashboardSummary = async (): Promise<DashboardSummaryResponse> => {
  if (isBackendKnownOffline()) {
    return getMockDashboardSummary();
  }
  try {
    return await api.get<DashboardSummaryResponse>('/api/v1/dashboard/summary');
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, using local mock dashboard data:', err);
    return getMockDashboardSummary();
  }
};

// ============================================================================
// 2. Cases API
// ============================================================================
export interface CreateCasePayload {
  caseNumber: string;
  title: string;
  crimeType: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  station?: string;
  summary?: string;
}

export const fetchCases = async (): Promise<CaseItem[]> => {
  if (isBackendKnownOffline()) {
    return MOCK_CASES;
  }
  try {
    return await api.get<CaseItem[]>('/api/v1/cases');
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, using local mock cases:', err);
    return MOCK_CASES;
  }
};

export const fetchCaseDetail = async (caseId: string): Promise<CaseItem> => {
  if (isBackendKnownOffline()) {
    const found = MOCK_CASES.find(c => c.id === caseId);
    return found || MOCK_CASES[0];
  }
  try {
    return await api.get<CaseItem>(`/api/v1/cases/${encodeURIComponent(caseId)}`);
  } catch (err) {
    markBackendOffline();
    console.warn(`Backend API unavailable, using local mock case for ${caseId}:`, err);
    const found = MOCK_CASES.find(c => c.id === caseId);
    return found || MOCK_CASES[0];
  }
};

export const createCase = async (payload: CreateCasePayload): Promise<CaseItem> => {
  if (isBackendKnownOffline()) {
    const newCase: CaseItem = {
      id: payload.caseNumber,
      title: payload.title,
      crimeType: payload.crimeType,
      status: 'UNDER_ANALYSIS',
      priority: payload.priority,
      station: payload.station || 'Central Division Police Station',
      leadOfficer: 'Insp. Vikram Deshmukh',
      dateOpened: new Date().toISOString().split('T')[0],
      summary: payload.summary || '',
      entitiesCount: 1,
      connectionsCount: 0,
      evidenceCount: 0,
      requiresAttention: false,
    };
    MOCK_CASES.unshift(newCase);
    return newCase;
  }
  try {
    return await api.post<CaseItem>('/api/v1/cases', payload);
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, saving case to local mock state:', err);
    const newCase: CaseItem = {
      id: payload.caseNumber,
      title: payload.title,
      crimeType: payload.crimeType,
      status: 'UNDER_ANALYSIS',
      priority: payload.priority,
      station: payload.station || 'Central Division Police Station',
      leadOfficer: 'Insp. Vikram Deshmukh',
      dateOpened: new Date().toISOString().split('T')[0],
      summary: payload.summary || '',
      entitiesCount: 1,
      connectionsCount: 0,
      evidenceCount: 0,
      requiresAttention: false,
    };
    MOCK_CASES.unshift(newCase);
    return newCase;
  }
};

export const uploadCaseDocument = async (caseId: string, file: File): Promise<{ document_id: string; filename: string; task_id?: string }> => {
  if (isBackendKnownOffline()) {
    return {
      document_id: `DOC-${Date.now()}`,
      filename: file.name,
      task_id: `TASK-${Date.now()}`,
    };
  }
  try {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post<{ document_id: string; filename: string; task_id?: string }>(
      `/api/v1/cases/${encodeURIComponent(caseId)}/documents`,
      formData
    );
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, simulating document upload:', err);
    return {
      document_id: `DOC-${Date.now()}`,
      filename: file.name,
      task_id: `TASK-${Date.now()}`,
    };
  }
};

export const confirmExtractedEntity = async (caseId: string, entityPayload: { entity_type: string; entity_id: string; role_in_case?: string }): Promise<any> => {
  if (isBackendKnownOffline()) {
    return { success: true, caseId, ...entityPayload };
  }
  try {
    return await api.post(`/api/v1/cases/${encodeURIComponent(caseId)}/entities`, entityPayload);
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, simulating entity confirmation:', err);
    return { success: true, caseId, ...entityPayload };
  }
};

// ============================================================================
// 3. Network Analysis / Subgraph API
// ============================================================================
export const fetchCaseGraph = async (caseId: string): Promise<CytoscapeElement[]> => {
  if (isBackendKnownOffline()) {
    return MOCK_CASE_NETWORK_ELEMENTS;
  }
  try {
    return await api.get<CytoscapeElement[]>(`/api/v1/network/${encodeURIComponent(caseId)}`);
  } catch (err) {
    markBackendOffline();
    console.warn(`Backend API unavailable, using local mock graph for ${caseId}:`, err);
    return MOCK_CASE_NETWORK_ELEMENTS;
  }
};

// ============================================================================
// 4. Missing Link Analysis API
// ============================================================================
export const fetchMissingLinks = async (caseId: string): Promise<MissingLinkCandidate[]> => {
  if (isBackendKnownOffline()) {
    return MOCK_MISSING_LINKS;
  }
  try {
    return await api.get<MissingLinkCandidate[]>(`/api/v1/cases/${encodeURIComponent(caseId)}/missing-links`);
  } catch (err) {
    markBackendOffline();
    console.warn(`Backend API unavailable, using local mock missing links for ${caseId}:`, err);
    return MOCK_MISSING_LINKS;
  }
};

// ============================================================================
// 5. Data Requests API
// ============================================================================
export interface CreateDataRequestPayload {
  targetAuthority: string;
  caseId: string;
  categories: string[];
  purpose: string;
  urgency: 'HIGH' | 'ROUTINE';
}

export const fetchDataRequests = async (): Promise<DataRequestItem[]> => {
  if (isBackendKnownOffline()) {
    return MOCK_DATA_REQUESTS;
  }
  try {
    return await api.get<DataRequestItem[]>('/api/v1/data-requests');
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, using local mock data requests:', err);
    return MOCK_DATA_REQUESTS;
  }
};

export const createDataRequest = async (payload: CreateDataRequestPayload): Promise<DataRequestItem> => {
  if (isBackendKnownOffline()) {
    const newReq: DataRequestItem = {
      id: `REQ-OUT-2026-${Math.floor(100 + Math.random() * 900)}`,
      targetAuthority: payload.targetAuthority,
      requestingOfficer: 'Insp. Vikram Deshmukh',
      caseId: payload.caseId,
      caseTitle: 'Syndicate Case Investigation',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      categories: payload.categories,
      purpose: payload.purpose,
      urgency: payload.urgency,
    };
    MOCK_DATA_REQUESTS.unshift(newReq);
    return newReq;
  }
  try {
    return await api.post<DataRequestItem>('/api/v1/data-requests', payload);
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, creating local mock data request:', err);
    const newReq: DataRequestItem = {
      id: `REQ-OUT-2026-${Math.floor(100 + Math.random() * 900)}`,
      targetAuthority: payload.targetAuthority,
      requestingOfficer: 'Insp. Vikram Deshmukh',
      caseId: payload.caseId,
      caseTitle: 'Syndicate Case Investigation',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      categories: payload.categories,
      purpose: payload.purpose,
      urgency: payload.urgency,
    };
    MOCK_DATA_REQUESTS.unshift(newReq);
    return newReq;
  }
};

// ============================================================================
// 6. Incoming Requests & Record Sharing API
// ============================================================================
export const fetchIncomingRequests = async (): Promise<IncomingRequestItem[]> => {
  if (isBackendKnownOffline()) {
    return MOCK_INCOMING_REQUESTS;
  }
  try {
    return await api.get<IncomingRequestItem[]>('/api/v1/incoming-requests');
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, using local mock incoming requests:', err);
    return MOCK_INCOMING_REQUESTS;
  }
};

export const approveIncomingRequest = async (requestId: string, accessDuration: string = '24 Hours'): Promise<IncomingRequestItem> => {
  if (isBackendKnownOffline()) {
    const item = MOCK_INCOMING_REQUESTS.find(r => r.id === requestId);
    if (item) {
      item.status = 'APPROVED';
      item.accessDuration = accessDuration;
      return item;
    }
    return { ...MOCK_INCOMING_REQUESTS[0], id: requestId, status: 'APPROVED' };
  }
  try {
    return await api.post<IncomingRequestItem>(`/api/v1/incoming-requests/${encodeURIComponent(requestId)}/approve`, { accessDuration });
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, approving local mock incoming request:', err);
    const item = MOCK_INCOMING_REQUESTS.find(r => r.id === requestId);
    if (item) {
      item.status = 'APPROVED';
      item.accessDuration = accessDuration;
      return item;
    }
    return { ...MOCK_INCOMING_REQUESTS[0], id: requestId, status: 'APPROVED' };
  }
};

export const rejectIncomingRequest = async (requestId: string, reason?: string): Promise<IncomingRequestItem> => {
  if (isBackendKnownOffline()) {
    const item = MOCK_INCOMING_REQUESTS.find(r => r.id === requestId);
    if (item) {
      item.status = 'REJECTED';
      return item;
    }
    return { ...MOCK_INCOMING_REQUESTS[0], id: requestId, status: 'REJECTED' };
  }
  try {
    return await api.post<IncomingRequestItem>(`/api/v1/incoming-requests/${encodeURIComponent(requestId)}/reject`, { reason });
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, rejecting local mock incoming request:', err);
    const item = MOCK_INCOMING_REQUESTS.find(r => r.id === requestId);
    if (item) {
      item.status = 'REJECTED';
      return item;
    }
    return { ...MOCK_INCOMING_REQUESTS[0], id: requestId, status: 'REJECTED' };
  }
};

export const shareRecordsForRequest = async (requestId: string, selectedRecordTypes: string[]): Promise<any> => {
  if (isBackendKnownOffline()) {
    return { success: true, requestId, sharedRecords: selectedRecordTypes };
  }
  try {
    return await api.post(`/api/v1/incoming-requests/${encodeURIComponent(requestId)}/share`, { recordTypes: selectedRecordTypes });
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, simulating record sharing:', err);
    return { success: true, requestId, sharedRecords: selectedRecordTypes };
  }
};

// ============================================================================
// 7. Received Data API
// ============================================================================
export const fetchReceivedData = async (): Promise<ReceivedDataItem[]> => {
  if (isBackendKnownOffline()) {
    return MOCK_RECEIVED_DATA;
  }
  try {
    return await api.get<ReceivedDataItem[]>('/api/v1/received-data');
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, using local mock received data:', err);
    return MOCK_RECEIVED_DATA;
  }
};

export const addToInvestigationView = async (receivedDataId: string, caseId: string): Promise<any> => {
  if (isBackendKnownOffline()) {
    const item = MOCK_RECEIVED_DATA.find(r => r.id === receivedDataId);
    if (item) {
      item.addedToView = true;
    }
    return { success: true, receivedDataId, caseId };
  }
  try {
    return await api.post(`/api/v1/received-data/${encodeURIComponent(receivedDataId)}/add-to-view`, { caseId });
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, adding received data to view in mock state:', err);
    const item = MOCK_RECEIVED_DATA.find(r => r.id === receivedDataId);
    if (item) {
      item.addedToView = true;
    }
    return { success: true, receivedDataId, caseId };
  }
};

// ============================================================================
// 8. Investigation Views API
// ============================================================================
export const fetchInvestigationViews = async (caseId?: string): Promise<InvestigationViewItem[]> => {
  if (isBackendKnownOffline()) {
    if (caseId) {
      return MOCK_INVESTIGATION_VIEWS.filter(v => v.caseId === caseId);
    }
    return MOCK_INVESTIGATION_VIEWS;
  }
  try {
    const query = caseId ? `?caseId=${encodeURIComponent(caseId)}` : '';
    return await api.get<InvestigationViewItem[]>(`/api/v1/investigation-views${query}`);
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, using local mock investigation views:', err);
    if (caseId) {
      return MOCK_INVESTIGATION_VIEWS.filter(v => v.caseId === caseId);
    }
    return MOCK_INVESTIGATION_VIEWS;
  }
};

export const createInvestigationView = async (viewPayload: { caseId: string; title: string; notes?: string }): Promise<InvestigationViewItem> => {
  if (isBackendKnownOffline()) {
    const newView: InvestigationViewItem = {
      id: `VIEW-${Date.now()}`,
      caseId: viewPayload.caseId,
      caseTitle: 'Investigation View',
      title: viewPayload.title,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toLocaleString(),
      nodeCount: 10,
      edgeCount: 14,
      notes: viewPayload.notes || '',
    };
    MOCK_INVESTIGATION_VIEWS.unshift(newView);
    return newView;
  }
  try {
    return await api.post<InvestigationViewItem>('/api/v1/investigation-views', viewPayload);
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, creating local mock investigation view:', err);
    const newView: InvestigationViewItem = {
      id: `VIEW-${Date.now()}`,
      caseId: viewPayload.caseId,
      caseTitle: 'Investigation View',
      title: viewPayload.title,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toLocaleString(),
      nodeCount: 10,
      edgeCount: 14,
      notes: viewPayload.notes || '',
    };
    MOCK_INVESTIGATION_VIEWS.unshift(newView);
    return newView;
  }
};

// ============================================================================
// 9. Statutory Audit Log API
// ============================================================================
export const fetchAuditLogs = async (limit: number = 50): Promise<AuditLogEntry[]> => {
  if (isBackendKnownOffline()) {
    return MOCK_AUDIT_LOGS.slice(0, limit);
  }
  try {
    return await api.get<AuditLogEntry[]>(`/api/v1/audit?limit=${limit}`);
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, using local mock audit logs:', err);
    return MOCK_AUDIT_LOGS.slice(0, limit);
  }
};

// ============================================================================
// 10. Criminal Records & Persons API
// ============================================================================
export const fetchPersons = async (): Promise<PersonRecord[]> => {
  if (isBackendKnownOffline()) {
    return MOCK_PERSONS;
  }
  try {
    return await api.get<PersonRecord[]>('/api/v1/persons');
  } catch (err) {
    markBackendOffline();
    console.warn('Backend API unavailable, using local mock persons:', err);
    return MOCK_PERSONS;
  }
};

export const fetchPersonDetail = async (personId: string): Promise<PersonRecord> => {
  if (isBackendKnownOffline()) {
    const found = MOCK_PERSONS.find(p => p.id === personId);
    return found || MOCK_PERSONS[0];
  }
  try {
    return await api.get<PersonRecord>(`/api/v1/persons/${encodeURIComponent(personId)}`);
  } catch (err) {
    markBackendOffline();
    console.warn(`Backend API unavailable, using local mock person for ${personId}:`, err);
    const found = MOCK_PERSONS.find(p => p.id === personId);
    return found || MOCK_PERSONS[0];
  }
};

