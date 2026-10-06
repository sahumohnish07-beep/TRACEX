import { describe, it, expect } from 'vitest';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CriminalRecordsPage } from './CriminalRecordsPage';
import { AuthProvider } from '../../app/AuthContext';

describe('CriminalRecordsPage', () => {
  it('renders criminal records registry with multiple criminals', async () => {
    sessionStorage.setItem('tracex_auth', 'true');
    sessionStorage.setItem('tracex_level', 'LOCAL');

    const { getByText, queryByText } = render(
      <AuthProvider>
        <BrowserRouter>
          <CriminalRecordsPage />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText(/Station Criminal Records Registry/i)).toBeDefined();
      expect(getByText(/Tariq Merchant/i)).toBeDefined();
      expect(getByText(/Devendra "Deva" Sawant/i)).toBeDefined();
      expect(getByText(/Dr. Farhan Qureshi/i)).toBeDefined();
    }, { timeout: 3000 });

    expect(queryByText(/Unable to load criminal records/i)).toBeNull();
  });

  it('filters criminals by search query', async () => {
    sessionStorage.setItem('tracex_auth', 'true');
    sessionStorage.setItem('tracex_level', 'LOCAL');

    const { getByPlaceholderText, getByText, queryByText } = render(
      <AuthProvider>
        <BrowserRouter>
          <CriminalRecordsPage />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText(/Tariq Merchant/i)).toBeDefined();
    }, { timeout: 3000 });

    const searchInput = getByPlaceholderText(/Search by name, alias, national ID/i);
    fireEvent.change(searchInput, { target: { value: 'Goldy' } });

    await waitFor(() => {
      expect(getByText(/Gurpreet "Goldy" Singh/i)).toBeDefined();
      expect(queryByText(/Tariq Merchant/i)).toBeNull();
    }, { timeout: 3000 });
  });

  it('filters criminals when clicking stat cards', async () => {
    sessionStorage.setItem('tracex_auth', 'true');
    sessionStorage.setItem('tracex_level', 'LOCAL');

    const { getByText, getAllByText, queryByText } = render(
      <AuthProvider>
        <BrowserRouter>
          <CriminalRecordsPage />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText(/Tariq Merchant/i)).toBeDefined();
    }, { timeout: 3000 });

    // 1. Click "High Risk Tier" card
    const highRiskCard = getByText(/High Risk Tier/i).closest('[role="button"]') || getByText(/High Risk Tier/i);
    fireEvent.click(highRiskCard);

    await waitFor(() => {
      expect(getByText(/Filtered dossier view:/i)).toBeDefined();
      expect(getAllByText(/High Risk Tier/i).length).toBeGreaterThan(0);
      // Nilesh Kantilal Vora is STANDARD risk, so should be filtered out
      expect(queryByText(/Nilesh Kantilal Vora/i)).toBeNull();
      // Tariq Merchant is HIGH risk, should be visible
      expect(getByText(/Tariq Merchant/i)).toBeDefined();
    });

    // 2. Click "Persons of Interest" card
    const poiCard = getAllByText(/Persons of Interest/i)[0].closest('[role="button"]') || getAllByText(/Persons of Interest/i)[0];
    fireEvent.click(poiCard);

    await waitFor(() => {
      // Nilesh Kantilal Vora is PERSON_OF_INTEREST
      expect(getByText(/Nilesh Kantilal Vora/i)).toBeDefined();
      // Tariq Merchant is SUSPECT, so should be filtered out
      expect(queryByText(/Tariq Merchant/i)).toBeNull();
    });

    // 3. Click "Active Suspects" card
    const suspectsCard = getAllByText(/Active Suspects/i)[0].closest('[role="button"]') || getAllByText(/Active Suspects/i)[0];
    fireEvent.click(suspectsCard);

    await waitFor(() => {
      // Tariq Merchant is SUSPECT
      expect(getByText(/Tariq Merchant/i)).toBeDefined();
      // Nilesh Kantilal Vora is PERSON_OF_INTEREST, should be filtered out
      expect(queryByText(/Nilesh Kantilal Vora/i)).toBeNull();
    });

    // 4. Click "Total Records" card to reset
    const totalRecordsCard = getByText(/Total Records/i).closest('[role="button"]') || getByText(/Total Records/i);
    fireEvent.click(totalRecordsCard);

    await waitFor(() => {
      expect(queryByText(/Filtered dossier view:/i)).toBeNull();
      expect(getByText(/Tariq Merchant/i)).toBeDefined();
      expect(getByText(/Nilesh Kantilal Vora/i)).toBeDefined();
    });
  });
});
