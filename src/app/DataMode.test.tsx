import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, waitFor, screen, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { DataModeProvider } from './DataModeContext';
import { AppShell } from './AppShell';
import { CasesPage } from '../features/cases/CasesPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import {
  fetchDashboardSummary,
  fetchCases,
  markBackendOffline,
  setFallbackAllowedOverride,
  resetDataModeState,
  isDemoModeActive,
  SERVICE_UNAVAILABLE_MESSAGE,
} from '../api/services';

describe('DataMode and Fallback Guard', () => {
  beforeEach(() => {
    resetDataModeState();
    sessionStorage.setItem('tracex_auth', 'true');
    sessionStorage.setItem('tracex_level', 'LOCAL');
    // Simulate backend is offline
    markBackendOffline();
  });

  afterEach(() => {
    resetDataModeState();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Production Mode (Fallback Disallowed)', () => {
    it('service throws Service unavailable error when backend offline in prod mode', async () => {
      setFallbackAllowedOverride(false);

      await expect(fetchDashboardSummary()).rejects.toThrow(SERVICE_UNAVAILABLE_MESSAGE);
      await expect(fetchCases()).rejects.toThrow(SERVICE_UNAVAILABLE_MESSAGE);
      expect(isDemoModeActive()).toBe(false);
    });

    it('shows error state with "Service unavailable. Unable to reach the server." and Retry button in UI', async () => {
      setFallbackAllowedOverride(false);

      await act(async () => {
        render(
          <AuthProvider>
            <DataModeProvider>
              <MemoryRouter initialEntries={['/cases']}>
                <Routes>
                  <Route path="/cases" element={<CasesPage />} />
                </Routes>
              </MemoryRouter>
            </DataModeProvider>
          </AuthProvider>
        );
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Service unavailable\. Unable to reach the server\./i)
        ).toBeDefined();
        expect(screen.getByRole('button', { name: /Retry/i })).toBeDefined();
      });

      // Verify demo banner is NOT displayed
      expect(screen.queryByText(/Demo data - not real case records/i)).toBeNull();
      expect(isDemoModeActive()).toBe(false);
    });
  });

  describe('Demo Mode (Fallback Allowed)', () => {
    it('service returns mock data and sets demoModeActive to true', async () => {
      setFallbackAllowedOverride(true);

      const summary = await fetchDashboardSummary();
      expect(summary).toBeDefined();
      expect(summary.activeCases).toBeGreaterThan(0);
      expect(isDemoModeActive()).toBe(true);

      const cases = await fetchCases();
      expect(cases.length).toBeGreaterThan(0);
    });

    it('shows persistent banner "Demo data - not real case records" in AppShell', async () => {
      setFallbackAllowedOverride(true);

      await act(async () => {
        render(
          <AuthProvider>
            <DataModeProvider>
              <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                  <Route element={<AppShell />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                  </Route>
                </Routes>
              </MemoryRouter>
            </DataModeProvider>
          </AuthProvider>
        );
      });

      // Verify banner appears
      await waitFor(() => {
        const banner = screen.getByText(/Demo data - not real case records/i);
        expect(banner).toBeDefined();
      });

      // Verify dashboard rendered without error state
      await waitFor(() => {
        expect(screen.getByText(/Local Authority Investigation Dashboard/i)).toBeDefined();
      });

      expect(screen.queryByText(/Service unavailable\. Unable to reach the server\./i)).toBeNull();
    });
  });
});
