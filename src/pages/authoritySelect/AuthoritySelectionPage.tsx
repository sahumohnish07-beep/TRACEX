import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Building2, Landmark, Globe, Lock } from 'lucide-react';
import { Button } from '../../components/Button';
import { useAuth } from '../../app/AuthContext';

export const AuthoritySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsLocal } = useAuth();

  const handleLocalLogin = async () => {
    await loginAsLocal(() => navigate('/dashboard'));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-page)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '48px 24px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header Section */}
      <header style={{ textAlign: 'center' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'inherit',
            outline: 'none',
          }}
          aria-label="Return to TRACE-X landing page"
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: 'var(--primary)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <Shield size={24} aria-hidden="true" />
          </div>
          <span
            style={{
              fontSize: '30px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--primary)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            TRACE-X
          </span>
        </Link>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-muted)',
            marginTop: '8px',
            marginBottom: 0,
          }}
        >
          AI Criminal Network Analysis
        </p>
      </header>

      {/* Center Section with 3 Cards */}
      <main
        style={{
          width: '100%',
          maxWidth: '1100px',
          margin: 'auto 0',
          padding: '32px 0',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--text)',
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          Select Your Authority Level
        </h1>

        <div className="authority-grid">
          {/* Card 1 — Local Authority */}
          <div className="authority-card" tabIndex={0} aria-label="Local Authority card">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div
                  aria-hidden="true"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Building2 size={26} />
                </div>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'var(--text)',
                    margin: '0 0 4px 0',
                  }}
                >
                  Local Authority
                </h2>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    marginBottom: '12px',
                  }}
                >
                  Police Station Level
                </div>
                <p
                  style={{
                    fontSize: '16px',
                    color: 'var(--text)',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  Access for individual police stations, station house officers, and local investigation units.
                </p>
              </div>

              <div style={{ marginTop: '24px' }}>
                <Button
                  id="btn-login-local"
                  variant="primary"
                  onClick={handleLocalLogin}
                  style={{ width: '100%' }}
                >
                  Login as Local
                </Button>
              </div>
            </div>
          </div>

          {/* Card 2 — State Authority */}
          <div className="authority-card" tabIndex={0} aria-label="State Authority card">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div
                  aria-hidden="true"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Landmark size={26} />
                </div>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'var(--text)',
                    margin: '0 0 4px 0',
                  }}
                >
                  State Authority
                </h2>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    marginBottom: '12px',
                  }}
                >
                  State Headquarters Level
                </div>
                <p
                  style={{
                    fontSize: '16px',
                    color: 'var(--text)',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  Access for state police headquarters, CID special crime wings, and inter-district coordination.
                </p>
              </div>

              <div style={{ marginTop: '24px' }}>
                <Button
                  id="btn-login-state"
                  variant="secondary"
                  onClick={() => navigate('/login/state')}
                  style={{ width: '100%' }}
                >
                  Login as State
                </Button>
              </div>
            </div>
          </div>

          {/* Card 3 — Central Authority */}
          <div className="authority-card" tabIndex={0} aria-label="Central Authority card">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div
                  aria-hidden="true"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Globe size={26} />
                </div>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'var(--text)',
                    margin: '0 0 4px 0',
                  }}
                >
                  Central Authority
                </h2>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    marginBottom: '12px',
                  }}
                >
                  National Level
                </div>
                <p
                  style={{
                    fontSize: '16px',
                    color: 'var(--text)',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  Access for national authorities, federal intelligence units, and cross-border intelligence databases.
                </p>
              </div>

              <div style={{ marginTop: '24px' }}>
                <Button
                  id="btn-login-central"
                  variant="secondary"
                  onClick={() => navigate('/login/central')}
                  style={{ width: '100%' }}
                >
                  Login as Central
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer
        style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lock size={14} aria-hidden="true" />
          <span>Secure Authentication | Authorized Personnel Only</span>
        </div>
        <div>TRACE-X &copy; 2026</div>
      </footer>

      <style>{`
        .authority-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1100px) {
          .authority-grid {
            grid-template-columns: 1fr;
          }
        }
        .authority-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-subtle);
          padding: 24px;
          display: flex;
          flex-direction: column;
          outline: none;
          transition: border-color 150ms ease;
        }
        .authority-card:hover {
          border-color: var(--primary);
        }
        .authority-card:focus-visible {
          outline: var(--focus-outline);
          outline-offset: var(--focus-offset);
        }
      `}</style>
    </div>
  );
};
