import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from './AuthContext';
import { useDataMode } from './DataModeContext';
import { Database, ShieldCheck, AlertTriangle } from 'lucide-react';

export const AppShell: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isDemoMode } = useDataMode();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Wait for initial silent refresh check
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-page)' }}>
        <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Verifying security session...</div>
      </div>
    );
  }

  // Protected route check: Redirect unauthenticated users to Landing Page (/)
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
      {/* Persistent Demo Data Warning Banner */}
      {isDemoMode && (
        <div
          role="status"
          aria-live="polite"
          aria-label="Demo data notice"
          data-testid="demo-data-banner"
          style={{
            backgroundColor: 'var(--status-warning-bg)',
            color: 'var(--status-warning)',
            borderBottom: '1px solid rgba(163, 91, 0, 0.2)',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 600,
            width: '100%',
            boxSizing: 'border-box',
            zIndex: 1100,
          }}
        >
          <AlertTriangle size={18} aria-hidden="true" />
          <span>Demo data - not real case records</span>
        </div>
      )}

      {/* Top Header */}
      <Header onToggleSidebar={() => setMobileDrawerOpen(!mobileDrawerOpen)} />

      {/* Main Layout Area */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Desktop Sidebar */}
        <div className="desktop-sidebar-container">
          <Sidebar />
        </div>

        {/* Mobile / Tablet Drawer (below 1100px) */}
        {mobileDrawerOpen && (
          <div
            className="mobile-drawer-overlay"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          >
            <div
              className="mobile-drawer-content"
              onClick={e => e.stopPropagation()}
            >
              <Sidebar onCloseMobile={() => setMobileDrawerOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content (max-width 1440px, centered, independently scrolling) */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            overflowX: 'hidden',
          }}
        >
          <main
            style={{
              flex: 1,
              width: '100%',
              maxWidth: 'var(--max-content-width)',
              margin: '0 auto',
              padding: '32px 32px 48px 32px',
              boxSizing: 'border-box',
            }}
          >
            <Outlet />
          </main>

          {/* AppShell Footer with Demo Data badge */}
          <footer
            style={{
              padding: '20px 32px',
              borderTop: '1px solid var(--border)',
              backgroundColor: 'var(--bg-surface)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              fontSize: '14px',
              color: 'var(--text-muted)',
            }}
          >
            {/* Demo Data / Live Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isDemoMode ? (
                <>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'var(--status-warning-bg)',
                      color: 'var(--status-warning)',
                      border: '1px solid #FFE0B2',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: '14px',
                    }}
                  >
                    <Database size={14} aria-hidden="true" />
                    <span>Demo Data Mode</span>
                  </span>
                  <span>Local Authority Police Station Environment · Synthetic Intelligence Records</span>
                </>
              ) : (
                <>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      color: 'var(--status-success)',
                      border: '1px solid rgba(34, 197, 94, 0.25)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: '14px',
                    }}
                  >
                    <Database size={14} aria-hidden="true" />
                    <span>Live Station Records</span>
                  </span>
                  <span>Connected to Station Production Backend</span>
                </>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} aria-hidden="true" />
                <span>CJIS / Gov-PKI Compliant Audit Active</span>
              </span>
              <span>TRACE-X Platform &copy; 2026</span>
            </div>
          </footer>
        </div>
      </div>

      <style>{`
        .desktop-sidebar-container {
          display: block;
        }
        .mobile-drawer-overlay {
          display: none;
        }
        @media (max-width: 1100px) {
          .desktop-sidebar-container {
            display: none;
          }
          .mobile-drawer-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background-color: rgba(30, 36, 48, 0.6);
            z-index: 1000;
          }
          .mobile-drawer-content {
            width: 280px;
            height: 100%;
            background-color: var(--bg-surface);
            box-shadow: 4px 0 16px rgba(0, 0, 0, 0.2);
          }
        }
      `}</style>
    </div>
  );
};
