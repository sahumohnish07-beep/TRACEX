import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NetworkBackground } from './NetworkBackground';
import { CustomCursor } from './CustomCursor';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHoveringX, setIsHoveringX] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleEnterClick = () => {
    navigate('/login');
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: 'var(--landing-bg)',
        backgroundImage: 'radial-gradient(circle at 50% 50%, var(--landing-bg) 60%, var(--landing-bg-alt) 100%)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '32px 24px',
        boxSizing: 'border-box',
        cursor: 'default',
      }}
    >
      {/* Decorative Cytoscape Network Background */}
      <NetworkBackground mousePos={mousePos} />

      {/* Custom Crosshair Cursor */}
      <CustomCursor mousePos={mousePos} isHoveringTarget={isHoveringX} />

      {/* Screen reader heading announcement */}
      <h1 className="sr-only">
        TRACE-X — Criminal Network Analysis &amp; Investigation Platform — click X to sign in
      </h1>

      {/* Top spacer (icon-free by design) */}
      <div style={{ height: '40px' }} aria-hidden="true" />

      {/* Center Wordmark & Content */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          margin: 'auto 0',
        }}
      >
        {/* Wordmark Container */}
        <div
          style={{
            fontSize: 'clamp(84px, 10vw, 120px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            userSelect: 'none',
          }}
          aria-hidden="true"
        >
          {/* "TRACE" in --landing-text-trace (#1E2430) matching size & cap-height of "X" */}
          <span
            style={{
              color: 'var(--landing-text-trace)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'inherit',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            TRACE
          </span>

          {/* Clickable "X" in --landing-text-x (#1F2A6B) */}
          <button
            id="landing-x-button"
            type="button"
            aria-label="Enter TRACE-X login portal"
            onClick={handleEnterClick}
            onMouseEnter={() => setIsHoveringX(true)}
            onMouseLeave={() => setIsHoveringX(false)}
            onFocus={() => setIsHoveringX(true)}
            onBlur={() => setIsHoveringX(false)}
            style={{
              color: 'var(--landing-text-x)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'inherit',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              padding: '0 4px',
              margin: 0,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '8px',
              transition: 'color 150ms ease, transform 150ms ease',
            }}
            className="landing-x-btn"
          >
            X
          </button>
        </div>

        {/* Description line in --landing-desc (#2F5FD0) */}
        <p
          style={{
            margin: '24px 0 16px 0',
            color: 'var(--landing-desc)',
            fontSize: 'clamp(20px, 2.2vw, 26px)',
            fontWeight: 500,
            fontFamily: 'var(--font-sans)',
            lineHeight: 1.45,
            maxWidth: '780px',
            letterSpacing: '-0.01em',
          }}
        >
          Criminal Network Analysis &amp; Investigation Platform
        </p>

        {/* Micro-hint in --landing-text-muted (#5A6475) */}
        <button
          type="button"
          onClick={handleEnterClick}
          onMouseEnter={() => setIsHoveringX(true)}
          onMouseLeave={() => setIsHoveringX(false)}
          onFocus={() => setIsHoveringX(true)}
          onBlur={() => setIsHoveringX(false)}
          style={{
            color: 'var(--landing-text-muted)',
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            fontWeight: 500,
            background: 'rgba(31, 42, 107, 0.04)',
            border: '1px solid rgba(31, 42, 107, 0.12)',
            cursor: 'pointer',
            padding: '8px 20px',
            borderRadius: '24px',
            marginTop: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
          }}
          className="landing-hint-btn"
          aria-label="Click X to begin authentication"
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--landing-desc)',
              display: 'inline-block',
            }}
            aria-hidden="true"
          />
          <span>Click X to begin</span>
        </button>
      </main>

      {/* Footer in --landing-text-muted (#5A6475), two lines */}
      <footer
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          color: 'var(--landing-text-muted)',
          fontSize: '15px',
          lineHeight: 1.7,
          userSelect: 'none',
        }}
      >
        <div>Secure Authentication · Authorized Personnel Only</div>
        <div style={{ fontWeight: 500, letterSpacing: '0.02em', marginTop: '2px' }}>TRACE-X &copy; 2026</div>
      </footer>

      <style>{`
        .landing-x-btn:hover {
          color: var(--primary-hover);
          transform: translateY(-2px);
          text-decoration: underline;
        }
        .landing-x-btn:focus-visible {
          outline: 3px solid var(--landing-text-x);
          outline-offset: 4px;
        }
        .landing-hint-btn:hover {
          background: rgba(31, 42, 107, 0.08);
          border-color: rgba(31, 42, 107, 0.25);
          color: var(--primary);
        }
        .landing-hint-btn:focus-visible {
          outline: 3px solid var(--landing-text-x);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};
