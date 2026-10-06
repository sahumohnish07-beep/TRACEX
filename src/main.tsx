import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initFrontendSentry, SentryErrorBoundary } from './core/sentry'

// Initialize Sentry with source maps & PII scrubber before React tree mounts
initFrontendSentry();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SentryErrorBoundary
      fallback={
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>Statutory System Error</h2>
          <p>An unexpected component failure occurred. The incident has been scrubbed and logged.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Reload Application
          </button>
        </div>
      }
    >
      <App />
    </SentryErrorBoundary>
  </StrictMode>,
)
