import * as Sentry from '@sentry/react';

// Statutory Law Enforcement PII Scrubbing regexes
const CASE_REGEX = /CASE-\d{4}-\d{4,}/gi;
const PERSON_REGEX = /PER-(?:TEST-)?[A-Z0-9]{4,}/gi;
const PHONE_REGEX = /(?:\+91|0)?[6-9]\d{9}/g;
const PLATE_REGEX = /[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}/g;
const BADGE_REGEX = /[A-Z]{2}-POL-\d{4}/g;

function scrubString(val: string): string {
  if (typeof val !== 'string') return val;
  return val
    .replace(CASE_REGEX, '[REDACTED_CASE_ID]')
    .replace(PERSON_REGEX, '[REDACTED_PERSON_ID]')
    .replace(PHONE_REGEX, '[REDACTED_PHONE]')
    .replace(PLATE_REGEX, '[REDACTED_PLATE]')
    .replace(BADGE_REGEX, '[REDACTED_BADGE]');
}

function scrubObject(obj: unknown): unknown {
  if (!obj) return obj;
  if (typeof obj === 'string') return scrubString(obj);
  if (Array.isArray(obj)) return obj.map(scrubObject);
  if (typeof obj === 'object') {
    const res: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const lowerKey = k.toLowerCase();
      if (
        lowerKey.includes('case') ||
        lowerKey.includes('person') ||
        lowerKey.includes('phone') ||
        lowerKey.includes('plate') ||
        lowerKey.includes('badge') ||
        lowerKey.includes('token') ||
        lowerKey.includes('password')
      ) {
        res[k] = '[REDACTED_STATUTORY_PII]';
      } else {
        res[k] = scrubObject(v);
      }
    }
    return res;
  }
  return obj;
}

export function initFrontendSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const release = import.meta.env.VITE_APP_RELEASE || 'tracex-frontend@1.0.0';
  const environment = import.meta.env.MODE || 'development';

  if (!dsn || dsn.includes('placeholder')) {
    // Sentry unconfigured or placeholder in local dev
    return;
  }

  Sentry.init({
    dsn,
    release,
    environment,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    tracesSampleRate: 1.0,
    beforeSend(event) {
      try {
        // Scrub exception messages and values
        if (event.exception?.values) {
          event.exception.values.forEach((v) => {
            if (v.value) v.value = scrubString(v.value);
          });
        }
        // Scrub breadcrumbs
        if (event.breadcrumbs) {
          event.breadcrumbs.forEach((b) => {
            if (b.message) b.message = scrubString(b.message);
            if (b.data) b.data = scrubObject(b.data) as Record<string, unknown>;
          });
        }
        // Scrub extra payload
        if (event.extra) {
          event.extra = scrubObject(event.extra) as Record<string, unknown>;
        }
      } catch (err) {
        console.warn('Error in Sentry statutory scrubber:', err);
      }
      return event;
    },
  });
}

/** Generates or retrieves request-id for end-to-end trace correlation */
export function getOrCreateRequestId(): string {
  const existing = sessionStorage.getItem('tracex_req_id');
  if (existing) return existing;
  const newId = `req-fe-${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
  sessionStorage.setItem('tracex_req_id', newId);
  return newId;
}

export const SentryErrorBoundary = Sentry.ErrorBoundary;
