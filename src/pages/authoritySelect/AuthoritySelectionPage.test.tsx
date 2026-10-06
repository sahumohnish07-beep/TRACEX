import { describe, it, expect } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthoritySelectionPage } from './AuthoritySelectionPage';
import { AuthProvider } from '../../app/AuthContext';

describe('AuthoritySelectionPage', () => {
  it('renders authority selection options and allows local login', async () => {
    const { getByRole } = render(
      <AuthProvider>
        <BrowserRouter>
          <AuthoritySelectionPage />
        </BrowserRouter>
      </AuthProvider>
    );

    const localBtn = getByRole('button', { name: /Login as Local/i });
    expect(localBtn).toBeDefined();

    fireEvent.click(localBtn);

    await waitFor(() => {
      expect(sessionStorage.getItem('tracex_auth')).toBe('true');
      expect(sessionStorage.getItem('tracex_level')).toBe('LOCAL');
    });
  });
});
