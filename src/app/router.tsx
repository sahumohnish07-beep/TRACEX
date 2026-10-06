import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { AppShell } from './AppShell';

// Public Pages
import { LandingPage } from '../pages/landing/LandingPage';
import { AuthoritySelectionPage } from '../pages/authoritySelect/AuthoritySelectionPage';
import { StatePlaceholderPage } from '../pages/authoritySelect/StatePlaceholderPage';
import { CentralPlaceholderPage } from '../pages/authoritySelect/CentralPlaceholderPage';
import { AuthCallbackPage } from '../pages/auth/AuthCallbackPage';
import { WebAuthnEnrollPage } from '../pages/auth/WebAuthnEnrollPage';

// Authenticated Local Authority Features
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { CasesPage } from '../features/cases/CasesPage';
import { NewCasePage } from '../features/newCase/NewCasePage';
import { CaseWorkspacePage } from '../features/caseWorkspace/CaseWorkspacePage';
import { NetworkAnalysisPage } from '../features/network/NetworkAnalysisPage';
import { MissingLinkPage } from '../features/missingLink/MissingLinkPage';
import { PersonProfilePage } from '../features/personProfile/PersonProfilePage';
import { CriminalRecordsPage } from '../features/persons/CriminalRecordsPage';
import { DataRequestsPage } from '../features/dataRequests/DataRequestsPage';
import { NewDataRequestPage } from '../features/dataRequests/NewDataRequestPage';
import { IncomingRequestPage } from '../features/incomingRequest/IncomingRequestPage';
import { ReviewSendingPage } from '../features/incomingRequest/ReviewSendingPage';
import { ReceivedDataPage } from '../features/receivedData/ReceivedDataPage';
import { InvestigationViewPage } from '../features/investigationView/InvestigationViewPage';
import { AuditLogPage } from '../features/auditLog/AuditLogPage';

export const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public standalone entry flow (No AppShell) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthoritySelectionPage />} />
          <Route path="/login/state" element={<StatePlaceholderPage />} />
          <Route path="/login/central" element={<CentralPlaceholderPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/webauthn-enroll" element={<WebAuthnEnrollPage />} />

          {/* Authenticated Local Authority Area (Inside AppShell) */}
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/cases/new" element={<NewCasePage />} />
            <Route path="/cases/:id" element={<CaseWorkspacePage />} />
            <Route path="/cases/:id/network" element={<NetworkAnalysisPage />} />
            <Route path="/cases/:id/missing-links" element={<MissingLinkPage />} />
            <Route path="/persons" element={<CriminalRecordsPage />} />
            <Route path="/persons/:id" element={<PersonProfilePage />} />
            <Route path="/requests" element={<DataRequestsPage />} />
            <Route path="/requests/new" element={<NewDataRequestPage />} />
            <Route path="/incoming/:id" element={<IncomingRequestPage />} />
            <Route path="/incoming/:id/review" element={<ReviewSendingPage />} />
            <Route path="/received" element={<ReceivedDataPage />} />
            <Route path="/views/:id" element={<InvestigationViewPage />} />
            <Route path="/audit" element={<AuditLogPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
