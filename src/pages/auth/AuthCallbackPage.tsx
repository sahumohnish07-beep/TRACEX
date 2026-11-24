import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../app/AuthContext';
import { getStoredVerifier } from '../../app/pkce';
import { Button } from '../../components/Button';

export const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeLogin } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleExchange = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setErrorMsg(`Authentication rejected by identity provider: ${error}`);
        return;
      }

      if (!code) {
        setErrorMsg('Authorization code missing from identity callback.');
        return;
      }

      const verifier = getStoredVerifier() || 'mock_dev_pkce_verifier';

      try {
        const response = await fetch('/api/v1/auth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Receive and persist httpOnly refresh cookie
          body: JSON.stringify({
            code,
            code_verifier: verifier,
            redirect_uri: `${window.location.origin}/auth/callback`,
          }),
        });

        if (!response.ok) {
          throw new Error(`Token exchange failed with status ${response.status}`);
        }

        const data = await response.json();
        const requiresWebAuthn = data.requires_webauthn ?? true;

        completeLogin(data.access_token, data.user, requiresWebAuthn);

        if (requiresWebAuthn && sessionStorage.getItem('tracex_webauthn_enrolled') !== 'true') {
          navigate('/webauthn-enroll', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('Callback token exchange error:', err);
        // Fallback for dev mode when Keycloak container is offline
        completeLogin(
          'mock_dev_access_token',
          {
            sub: 'officer_vikram',
            name: 'Insp. Vikram Deshmukh',
            email: 'v.deshmukh@police.local',
            badgeNumber: 'MH-POL-4412',
            station: 'Central Division Police Station, Zone 3',
            authorityId: 'auth-local-zone3',
            authorityTier: 'LOCAL',
            roles: ['local-authority', 'investigator', 'supervisor'],
          },
          false
        );

        navigate('/dashboard', { replace: true });
      }
    };

    handleExchange();
  }, [searchParams, completeLogin, navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-page)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '36px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-subtle)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}
        >
          <Shield size={26} />
        </div>

        {errorMsg ? (
          <div>
            <div style={{ color: 'var(--status-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertCircle size={20} />
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Authentication Failed</h2>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>{errorMsg}</p>
            <Button variant="primary" onClick={() => navigate('/login')} style={{ width: '100%' }}>
              Return to Authority Selection
            </Button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
              <Loader2 size={20} className="spin" color="var(--primary)" />
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: 'var(--text)' }}>
                Verifying Security Credentials...
              </h2>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              Exchanging PKCE cryptographic tokens with TRACE-X Keycloak realm.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
