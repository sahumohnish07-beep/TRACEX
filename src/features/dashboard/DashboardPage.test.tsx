import { describe, it, expect } from 'vitest';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DashboardPage } from './DashboardPage';
import { AuthProvider } from '../../app/AuthContext';

describe('DashboardPage', () => {
  it('renders dashboard metrics and recent cases cleanly', async () => {
    sessionStorage.setItem('tracex_auth', 'true');
    sessionStorage.setItem('tracex_level', 'LOCAL');

    const { getByText, getAllByText, queryByText } = render(
      <AuthProvider>
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText(/Local Authority Investigation Dashboard/i)).toBeDefined();
      expect(getByText(/Active Cases/i)).toBeDefined();
      expect(getAllByText(/Under Analysis/i).length).toBeGreaterThan(0);
      expect(getByText(/Pending Requests/i)).toBeDefined();
    });

    expect(queryByText(/Unable to load dashboard summary/i)).toBeNull();
  });

  it('filters visible items when clicking stat cards', async () => {
    sessionStorage.setItem('tracex_auth', 'true');
    sessionStorage.setItem('tracex_level', 'LOCAL');

    const { getByText, queryByText, getAllByText } = render(
      <AuthProvider>
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText(/Active Station Investigations/i)).toBeDefined();
    });

    // 1. Click Active Cases
    const activeCasesCard = getByText(/Active Cases/i).closest('[role="button"]') || getByText(/Active Cases/i);
    fireEvent.click(activeCasesCard);

    await waitFor(() => {
      expect(getByText(/Active Station Cases \(/i)).toBeDefined();
      expect(queryByText(/Active Station Investigations/i)).toBeNull();
      expect(getByText(/Clear Filter & Show All/i)).toBeDefined();
    });

    // 2. Click Under Analysis
    const underAnalysisCard = getAllByText(/Under Analysis/i)[0].closest('[role="button"]') || getAllByText(/Under Analysis/i)[0];
    fireEvent.click(underAnalysisCard);

    await waitFor(() => {
      expect(getByText(/Cases Under Active Analysis \(/i)).toBeDefined();
      expect(queryByText(/Active Station Cases \(/i)).toBeNull();
    });

    // 3. Click Pending Requests
    const pendingRequestsCard = getByText(/Pending Requests/i).closest('[role="button"]') || getByText(/Pending Requests/i);
    fireEvent.click(pendingRequestsCard);

    await waitFor(() => {
      expect(getByText(/Pending Inter-Agency Requests \(/i)).toBeDefined();
      expect(getByText(/Target Authority/i)).toBeDefined();
    });

    // 4. Click New Connections
    const newConnectionsCard = getByText(/New Connections/i).closest('[role="button"]') || getByText(/New Connections/i);
    fireEvent.click(newConnectionsCard);

    await waitFor(() => {
      expect(getByText(/New Connections & Missing Links \(/i)).toBeDefined();
      expect(getByText(/Entity Correlation Pair/i)).toBeDefined();
    });

    // 5. Click Clear Filter
    fireEvent.click(getByText(/Clear Filter & Show All/i));

    await waitFor(() => {
      expect(getByText(/Active Station Investigations/i)).toBeDefined();
    });
  });
});
