/**
 * TRACE-X Typed API Services
 * Built on OpenAPI generated schema (src/api/schema.d.ts) and apiClient
 * With guarded fallback to local mock repositories when backend API is offline.
 * NOTE: For a law-enforcement tool, fake data must never look real.
 * Fallback is allowed ONLY when import.meta.env.DEV is true OR VITE_ENABLE_DEMO_MODE === "true".
 * In production builds (import.meta.env.PROD) with backend offline, an error is thrown instead:
 * "Service unavailable. Unable to reach the server."
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

export const SERVICE_UNAVAILABLE_MESSAGE = 'Service unavailable. Unable to reach the server.';

// Cache offline state for 30s to avoid repeated socket timeouts in dev mode
let backendOfflineUntil = 0;

export const isBackendKnownOffline = (): boolean => {
  return Date.now() < backendOfflineUntil;
};

export const markBackendOffline = (): void => {
  backendOfflineUntil = Date.now() + 30000;
};

// ============================================================================
// Data Mode & Fallback Guard State
// ============================================================================
let fallbackAllowedOverride: boolean | null = null;
let demoModeActive = false;
type DataModeListener = (active: boolean) => void;
const dataModeListeners = new Set<DataModeListener>();

export const setFallbackAllowedOverride = (allowed: boolean | null): void => {
  fallbackAllowedOverride = allowed;
};

export const isFallbackAllowed = (): boolean => {
  if (fallbackAllowedOverride !== null) {
    return fallbackAllowedOverride;
  }
  const demoModeEnv = (import.meta as any).env?.VITE_ENABLE_DEMO_MODE;
  if (demoModeEnv === 'true' || demoModeEnv === true) {
    return true;
  }
  return Boolean((import.meta as any).env?.DEV && !(import.meta as any).env?.PROD);
};

export const isDemoModeActive = (): boolean => demoModeActive;

export const setDemoModeActive = (active: boolean): void => {
  demoModeActive = active;
  dataModeListeners.forEach(listener => {
    try {
      listener(active);
    } catch (e) {
      console.error('Error notifying data mode listener:', e);
    }
  });
};

export const subscribeDataMode = (listener: DataModeListener): (() => void) => {
  dataModeListeners.add(listener);
  return () => {
    dataModeListeners.delete(listener);
  };
};

export const resetDataModeState = (): void => {
  backendOfflineUntil = 0;
  demoModeActive = false;
  fallbackAllowedOverride = null;
  dataModeListeners.forEach(l => l(false));
};

function handleFallback<T>(mockFactory: () => T, actionName?: string): T {
  if (!isFallbackAllowed()) {
    throw new Error(SERVICE_UNAVAILABLE_MESSAGE);
  }
  setDemoModeActive(true);
  if (actionName) {
    console.warn(`Backend API unavailable, using local mock data for ${actionName}`);
  }
  return mockFactory();
}

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
    return handleFallback(getMockDashboardSummary, 'dashboard summary');
  }
  try {
    return await api.get<DashboardSummaryResponse>('/api/v1/dashboard/summary');
  } catch (err) {
    markBackendOffline();
    return handleFallback(getMockDashboardSummary, 'dashboard summary');
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
    return handleFallback(() => MOCK_CASES, 'cases');
  }
  try {
    return await api.get<CaseItem[]>('/api/v1/cases');
  } catch (err) {
    markBackendOffline();
    return handleFallback(() => MOCK_CASES, 'cases');
  }
};

export const fetchCaseDetail = async (caseId: string): Promise<CaseItem> => {
  const getMockCase = () => {
    const found = MOCK_CASES.find(c => c.id === caseId);
    return found || MOCK_CASES[0];
  };
  if (isBackendKnownOffline()) {
    return handleFallback(getMockCase, `case detail ${caseId}`);
  }
  try {
    return await api.get<CaseItem>(`/api/v1/cases/${encodeURIComponent(caseId)}`);
  } catch (err) {
    markBackendOffline();
    return handleFallback(getMockCase, `case detail ${caseId}`);
  }
};

export const createCase = async (payload: CreateCasePayload): Promise<CaseItem> => {
  const createMockCase = () => {
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
  };
  if (isBackendKnownOffline()) {
    return handleFallback(createMockCase, 'create case');
  }
  try {
    return await api.post<CaseItem>('/api/v1/cases', payload);
  } catch (err) {
    markBackendOffline();
    return handleFallback(createMockCase, 'create case');
  }
};

export const uploadCaseDocument = async (caseId: string, file: File): Promise<{ document_id: string; filename: string; task_id?: string }> => {
  const mockUpload = () => ({
    document_id: `DOC-${Date.now()}`,
    filename: file.name,
    task_id: `TASK-${Date.now()}`,
  });
  if (isBackendKnownOffline()) {
    return handleFallback(mockUpload, 'document upload');
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
    return handleFallback(mockUpload, 'document upload');
  }
};

export const confirmExtractedEntity = async (caseId: string, entityPayload: { entity_type: string; entity_id: string; role_in_case?: string }): Promise<any> => {
  const mockConfirm = () => ({ success: true, caseId, ...entityPayload });
  if (isBackendKnownOffline()) {
    return handleFallback(mockConfirm, 'confirm entity');
  }
  try {
    return await api.post(`/api/v1/cases/${encodeURIComponent(caseId)}/entities`, entityPayload);
  } catch (err) {
    markBackendOffline();
    return handleFallback(mockConfirm, 'confirm entity');
  }
};

// ============================================================================
// 3. Network Analysis / Subgraph API
// ============================================================================
export const fetchCaseGraph = async (caseId: string): Promise<CytoscapeElement[]> => {
  if (isBackendKnownOffline()) {
    return handleFallback(() => MOCK_CASE_NETWORK_ELEMENTS, `graph for ${caseId}`);
  }
  try {
    return await api.get<CytoscapeElement[]>(`/api/v1/network/${encodeURIComponent(caseId)}`);
  } catch (err) {
    markBackendOffline();
    return handleFallback(() => MOCK_CASE_NETWORK_ELEMENTS, `graph for ${caseId}`);
  }
};

// ============================================================================
// 4. Missing Link Analysis API
// ============================================================================
export const fetchMissingLinks = async (caseId: string): Promise<MissingLinkCandidate[]> => {
  if (isBackendKnownOffline()) {
    return handleFallback(() => MOCK_MISSING_LINKS, `missing links for ${caseId}`);
  }
  try {
    return await api.get<MissingLinkCandidate[]>(`/api/v1/cases/${encodeURIComponent(caseId)}/missing-links`);
  } catch (err) {
    markBackendOffline();
    return handleFallback(() => MOCK_MISSING_LINKS, `missing links for ${caseId}`);
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
    return handleFallback(() => MOCK_DATA_REQUESTS, 'data requests');
  }
  try {
    return await api.get<DataRequestItem[]>('/api/v1/data-requests');
  } catch (err) {
    markBackendOffline();
    return handleFallback(() => MOCK_DATA_REQUESTS, 'data requests');
  }
};

export const createDataRequest = async (payload: CreateDataRequestPayload): Promise<DataRequestItem> => {
  const mockCreateRequest = () => {
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
  };
  if (isBackendKnownOffline()) {
    return handleFallback(mockCreateRequest, 'create data request');
  }
  try {
    return await api.post<DataRequestItem>('/api/v1/data-requests', payload);
  } catch (err) {
    markBackendOffline();
    return handleFallback(mockCreateRequest, 'create data request');
  }
};

// ============================================================================
// 6. Incoming Requests & Record Sharing API
// ============================================================================
export const fetchIncomingRequests = async (): Promise<IncomingRequestItem[]> => {
  if (isBackendKnownOffline()) {
    return handleFallback(() => MOCK_INCOMING_REQUESTS, 'incoming requests');
  }
  try {
    return await api.get<IncomingRequestItem[]>('/api/v1/incoming-requests');
  } catch (err) {
    markBackendOffline();
    return handleFallback(() => MOCK_INCOMING_REQUESTS, 'incoming requests');
  }
};

export const approveIncomingRequest = async (requestId: string, accessDuration: string = '24 Hours'): Promise<IncomingRequestItem> => {
  const mockApprove = (): IncomingRequestItem => {
    const item = MOCK_INCOMING_REQUESTS.find(r => r.id === requestId);
    if (item) {
      item.status = 'APPROVED';
      item.accessDuration = accessDuration;
      return item;
    }
    return { ...MOCK_INCOMING_REQUESTS[0], id: requestId, status: 'APPROVED' };
  };
  if (isBackendKnownOffline()) {
    return handleFallback(mockApprove, 'approve incoming request');
  }
  try {
    return await api.post<IncomingRequestItem>(`/api/v1/incoming-requests/${encodeURIComponent(requestId)}/approve`, { accessDuration });
  } catch (err) {
    markBackendOffline();
    return handleFallback(mockApprove, 'approve incoming request');
  }
};

export const rejectIncomingRequest = async (requestId: string, reason?: string): Promise<IncomingRequestItem> => {
  const mockReject = (): IncomingRequestItem => {
    const item = MOCK_INCOMING_REQUESTS.find(r => r.id === requestId);
    if (item) {
      item.status = 'REJECTED';
      return item;
    }
    return { ...MOCK_INCOMING_REQUESTS[0], id: requestId, status: 'REJECTED' };
  };
  if (isBackendKnownOffline()) {
    return handleFallback(mockReject, 'reject incoming request');
  }
  try {
    return await api.post<IncomingRequestItem>(`/api/v1/incoming-requests/${encodeURIComponent(requestId)}/reject`, { reason });
  } catch (err) {
    markBackendOffline();
    return handleFallback(mockReject, 'reject incoming request');
  }
};

export const shareRecordsForRequest = async (requestId: string, selectedRecordTypes: string[]): Promise<any> => {
  const mockShare = () => ({ success: true, requestId, sharedRecords: selectedRecordTypes });
  if (isBackendKnownOffline()) {
    return handleFallback(mockShare, 'share records');
  }
  try {
    return await api.post(`/api/v1/incoming-requests/${encodeURIComponent(requestId)}/share`, { recordTypes: selectedRecordTypes });
  } catch (err) {
    markBackendOffline();
    return handleFallback(mockShare, 'share records');
  }
};

// ============================================================================
// 7. Received Data API
// ============================================================================
export const fetchReceivedData = async (): Promise<ReceivedDataItem[]> => {
  if (isBackendKnownOffline()) {
    return handleFallback(() => MOCK_RECEIVED_DATA, 'received data');
  }
  try {
    return await api.get<ReceivedDataItem[]>('/api/v1/received-data');
  } catch (err) {
    markBackendOffline();
    return handleFallback(() => MOCK_RECEIVED_DATA, 'received data');
  }
};

export const addToInvestigationView = async (receivedDataId: string, caseId: string): Promise<any> => {
  const mockAdd = () => {
    const item = MOCK_RECEIVED_DATA.find(r => r.id === receivedDataId);
    if (item) {
      item.addedToView = true;
    }
    return { success: true, receivedDataId, caseId };
  };
  if (isBackendKnownOffline()) {
    return handleFallback(mockAdd, 'add received data to view');
  }
  try {
    return await api.post(`/api/v1/received-data/${encodeURIComponent(receivedDataId)}/add-to-view`, { caseId });
  } catch (err) {
    markBackendOffline();
    return handleFallback(mockAdd, 'add received data to view');
  }
};

// ============================================================================
// 8. Investigation Views API
// ============================================================================
export const fetchInvestigationViews = async (caseId?: string): Promise<InvestigationViewItem[]> => {
  const mockFetchViews = () => {
    if (caseId) {
      return MOCK_INVESTIGATION_VIEWS.filter(v => v.caseId === caseId);
    }
    return MOCK_INVESTIGATION_VIEWS;
  };
  if (isBackendKnownOffline()) {
    return handleFallback(mockFetchViews, 'investigation views');
  }
  try {
    const query = caseId ? `?caseId=${encodeURIComponent(caseId)}` : '';
    return await api.get<InvestigationViewItem[]>(`/api/v1/investigation-views${query}`);
  } catch (err) {
    markBackendOffline();
    return handleFallback(mockFetchViews, 'investigation views');
  }
};

export const createInvestigationView = async (viewPayload: { caseId: string; title: string; notes?: string }): Promise<InvestigationViewItem> => {
  const mockCreateView = () => {
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
  };
  if (isBackendKnownOffline()) {
    return handleFallback(mockCreateView, 'create investigation view');
  }
  try {
    return await api.post<InvestigationViewItem>('/api/v1/investigation-views', viewPayload);
  } catch (err) {
    markBackendOffline();
    return handleFallback(mockCreateView, 'create investigation view');
  }
};

// ============================================================================
// 9. Statutory Audit Log API
// ============================================================================
export const fetchAuditLogs = async (limit: number = 50): Promise<AuditLogEntry[]> => {
  if (isBackendKnownOffline()) {
    return handleFallback(() => MOCK_AUDIT_LOGS.slice(0, limit), 'audit logs');
  }
  try {
    return await api.get<AuditLogEntry[]>(`/api/v1/audit?limit=${limit}`);
  } catch (err) {
    markBackendOffline();
    return handleFallback(() => MOCK_AUDIT_LOGS.slice(0, limit), 'audit logs');
  }
};

// ============================================================================
// 10. Criminal Records & Persons API
// ============================================================================
export const fetchPersons = async (): Promise<PersonRecord[]> => {
  if (isBackendKnownOffline()) {
    return handleFallback(() => MOCK_PERSONS, 'persons');
  }
  try {
    return await api.get<PersonRecord[]>('/api/v1/persons');
  } catch (err) {
    markBackendOffline();
    return handleFallback(() => MOCK_PERSONS, 'persons');
  }
};

export const fetchPersonDetail = async (personId: string): Promise<PersonRecord> => {
  const mockPerson = () => {
    const found = MOCK_PERSONS.find(p => p.id === personId);
    return found || MOCK_PERSONS[0];
  };
  if (isBackendKnownOffline()) {
    return handleFallback(mockPerson, `person detail ${personId}`);
  }
  try {
    return await api.get<PersonRecord>(`/api/v1/persons/${encodeURIComponent(personId)}`);
  } catch (err) {
    markBackendOffline();
    return handleFallback(mockPerson, `person detail ${personId}`);
  }
};
