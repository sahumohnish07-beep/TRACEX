import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onHoverTargetChange: (isHovering: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onHoverTargetChange }) => {
  const navigate = useNavigate();
  const [badgeId, setBadgeId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStatus('VERIFYING BIOMETRICS & CRYPTOGRAPHIC TOKEN...');
    setTimeout(() => {
      setAuthStatus('ACCESS GRANTED — INITIALIZING SESSION CLUSTER');
    }, 1000);
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        padding: '2.5rem 2rem',
        boxSizing: 'border-box',
      }}
    >
      {/* Viewport Tactical Corner Accents */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 24,
          left: 24,
          width: 14,
          height: 14,
          borderTop: '1.5px solid rgba(31, 42, 107, 0.25)',
          borderLeft: '1.5px solid rgba(31, 42, 107, 0.25)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 24,
          right: 24,
          width: 14,
          height: 14,
          borderTop: '1.5px solid rgba(31, 42, 107, 0.25)',
          borderRight: '1.5px solid rgba(31, 42, 107, 0.25)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          width: 14,
          height: 14,
          borderBottom: '1.5px solid rgba(31, 42, 107, 0.25)',
          borderLeft: '1.5px solid rgba(31, 42, 107, 0.25)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 14,
          height: 14,
          borderBottom: '1.5px solid rgba(31, 42, 107, 0.25)',
          borderRight: '1.5px solid rgba(31, 42, 107, 0.25)',
          pointerEvents: 'none',
        }}
      />

      {/* Header with Back button */}
      <header
        style={{
          width: '100%',
          maxWidth: '520px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--landing-text-muted)',
        }}
      >
        <button
          id="back-to-landing-btn"
          onClick={() => navigate('/')}
          onMouseEnter={() => onHoverTargetChange(true)}
          onMouseLeave={() => onHoverTargetChange(false)}
          onFocus={() => onHoverTargetChange(true)}
          onBlur={() => onHoverTargetChange(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--landing-desc)',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '12px',
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid rgba(47, 95, 208, 0.25)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 1px 3px rgba(31, 42, 107, 0.05)',
            cursor: 'pointer',
          }}
        >
          &larr; RETURN TO OVERVIEW
        </button>

        <span style={{ letterSpacing: '0.05em' }}>GATEWAY // SECURE</span>
      </header>

      {/* Main Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(255, 255, 255, 0.94)',
          border: '1px solid rgba(31, 42, 107, 0.12)',
          boxShadow: '0 12px 36px rgba(31, 42, 107, 0.08), 0 2px 8px rgba(31, 42, 107, 0.04)',
          borderRadius: '12px',
          padding: '2.5rem',
          margin: 'auto 0',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              marginBottom: '0.5rem',
            }}
          >
            <span style={{ color: 'var(--landing-text-trace)' }}>Trace</span>
            <span style={{ color: 'var(--landing-text-x)' }}>X</span>
          </div>
          <p
            style={{
              color: 'var(--landing-desc)',
              fontSize: '13px',
              fontWeight: 500,
              margin: 0,
            }}
          >
            RESTRICTED ACCESS PORTAL · LEVEL 4
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label
              htmlFor="badge-input"
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--landing-text-muted)',
                marginBottom: '6px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Personnel Badge / Agency ID
            </label>
            <input
              id="badge-input"
              type="text"
              required
              placeholder="e.g. TX-8921-ALPHA"
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
              onFocus={() => onHoverTargetChange(true)}
              onBlur={() => onHoverTargetChange(false)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid rgba(31, 42, 107, 0.2)',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                color: 'var(--landing-text-trace)',
                backgroundColor: 'var(--landing-bg-alt)',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="passcode-input"
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--landing-text-muted)',
                marginBottom: '6px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Cryptographic Key / Passphrase
            </label>
            <input
              id="passcode-input"
              type="password"
              required
              placeholder="••••••••••••"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onFocus={() => onHoverTargetChange(true)}
              onBlur={() => onHoverTargetChange(false)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid rgba(31, 42, 107, 0.2)',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                color: 'var(--landing-text-trace)',
                backgroundColor: 'var(--landing-bg-alt)',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              }}
            />
          </div>

          {authStatus && (
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: 'rgba(47, 95, 208, 0.08)',
                color: 'var(--landing-desc)',
                border: '1px solid rgba(47, 95, 208, 0.25)',
              }}
            >
              {authStatus}
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            onMouseEnter={() => onHoverTargetChange(true)}
            onMouseLeave={() => onHoverTargetChange(false)}
            onFocus={() => onHoverTargetChange(true)}
            onBlur={() => onHoverTargetChange(false)}
            style={{
              marginTop: '0.5rem',
              backgroundColor: 'var(--landing-text-x)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: '14px',
              padding: '12px 18px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.02em',
              transition: 'background-color 0.2s ease, transform 0.15s ease',
              boxShadow: '0 4px 12px rgba(31, 42, 107, 0.2)',
            }}
          >
            AUTHENTICATE CREDENTIALS
          </button>
        </form>
      </div>

      {/* Footer info */}
      <footer
        style={{
          width: '100%',
          maxWidth: '520px',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--landing-text-muted)',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(31, 42, 107, 0.08)',
        }}
      >
        <span>CLASSIFIED SYSTEM · UNAUTHORIZED ACCESS SUBJECT TO PROSECUTION</span>
      </footer>
    </div>
  );
};
