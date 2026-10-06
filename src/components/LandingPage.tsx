import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  onHoverTargetChange: (isHovering: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onHoverTargetChange }) => {
  const navigate = useNavigate();

  const handleXClick = () => {
    navigate('/login');
  };

  return (
    <main
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
        userSelect: 'none',
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

      {/* Top Header Tactical Indicator */}
      <header
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          letterSpacing: '0.06em',
          color: 'var(--landing-text-muted)',
          textTransform: 'uppercase',
          opacity: 0.9,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--landing-desc)',
              boxShadow: '0 0 8px rgba(47, 95, 208, 0.5)',
            }}
          />
          <span>NODE CLUSTER: 36 // CLEARANCE LVL 4</span>
        </div>
        <div>
          <span>SYS.VER: 2.4.0-PROD</span>
        </div>
      </header>

      {/* Center Hero Layout */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          margin: 'auto 0',
          position: 'relative',
        }}
      >
        {/* Wordmark Container */}
        <h1
          style={{
            margin: 0,
            padding: 0,
            fontSize: 'clamp(5.5rem, 10vw, 8rem)',
            fontWeight: 800,
            letterSpacing: '-0.045em',
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'baseline',
            justifyContent: 'center',
          }}
        >
          {/* "TRACE" in --landing-text-trace matching size & cap-height of "X" */}
          <span
            style={{
              color: 'var(--landing-text-trace)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'inherit',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '-0.045em',
              lineHeight: 1,
            }}
          >
            TRACE
          </span>

          {/* Clickable "X" in --landing-text-x */}
          <button
            id="enter-portal-button"
            type="button"
            aria-label="Enter TRACE-X login portal"
            onClick={handleXClick}
            onMouseEnter={() => onHoverTargetChange(true)}
            onMouseLeave={() => onHoverTargetChange(false)}
            onFocus={() => onHoverTargetChange(true)}
            onBlur={() => onHoverTargetChange(false)}
            style={{
              color: 'var(--landing-text-x)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'inherit',
              fontWeight: 800,
              letterSpacing: '-0.045em',
              lineHeight: 1,
              padding: '0 4px',
              margin: 0,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              borderRadius: '8px',
              transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), text-shadow 0.2s ease, color 0.2s ease',
            }}
            className="interactive-x-button"
          >
            X
          </button>
        </h1>

        {/* Description line in --landing-desc */}
        <p
          style={{
            marginTop: '1.5rem',
            marginBottom: '1rem',
            color: 'var(--landing-desc)',
            fontSize: 'clamp(20px, 2.2vw, 26px)',
            fontWeight: 500,
            fontFamily: 'var(--font-sans)',
            letterSpacing: '-0.01em',
            lineHeight: 1.45,
            maxWidth: '780px',
          }}
        >
          Criminal Network Analysis &amp; Investigation Platform
        </p>

        {/* Micro-hint in --landing-text-muted */}
        <button
          type="button"
          onClick={handleXClick}
          onMouseEnter={() => onHoverTargetChange(true)}
          onMouseLeave={() => onHoverTargetChange(false)}
          onFocus={() => onHoverTargetChange(true)}
          onBlur={() => onHoverTargetChange(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--landing-text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '16px',
            fontWeight: 500,
            letterSpacing: '0.02em',
            marginTop: '0.5rem',
            background: 'rgba(31, 42, 107, 0.04)',
            border: '1px solid rgba(31, 42, 107, 0.12)',
            cursor: 'pointer',
            padding: '8px 20px',
            borderRadius: '24px',
            transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
          }}
          aria-label="Click X to begin"
        >
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--landing-desc)',
            }}
          />
          <span>Click X to begin</span>
        </button>
      </div>

      {/* Footer */}
      <footer
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontFamily: 'var(--font-sans)',
          fontSize: '15px',
          color: 'var(--landing-text-muted)',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(31, 42, 107, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ letterSpacing: '0.01em', fontWeight: 500 }}>
            Secure Authentication · Authorized Personnel Only
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', letterSpacing: '0.04em' }}>
          TRACE-X &copy; 2026
        </div>
      </footer>

      <style>{`
        .interactive-x-button:hover {
          transform: translateY(-1px) scale(1.04);
          text-shadow: 0 0 16px rgba(31, 42, 107, 0.25);
        }
        .interactive-x-button:active {
          transform: scale(0.97);
        }
        .interactive-x-button:focus-visible {
          outline: 2px solid var(--focus-ring);
          outline-offset: 4px;
          background-color: rgba(31, 42, 107, 0.05);
        }
      `}</style>
    </main>
  );
};
