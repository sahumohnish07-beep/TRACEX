/**
 * TRACE-X Production API Client Layer
 * Automatic in-memory token injection, X-Request-ID propagation,
 * 401 Unauthorized handling -> redirect to Landing Page (/),
 * RFC 7807 problem details handling.
 */

import { getOrCreateRequestId } from '../core/sentry';

let tokenGetter: (() => string | null) | null = null;
let logoutHandler: (() => void) | null = null;

export const configureApiClient = (
  getToken: () => string | null,
  onUnauthorized: () => void
) => {
  tokenGetter = getToken;
  logoutHandler = onUnauthorized;
};

export class ApiError extends Error {
  public status: number;
  public details: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});

  // 1. Attach In-Memory Bearer Token
  const token = tokenGetter ? tokenGetter() : null;
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // 2. Attach X-Request-ID for distributed end-to-end tracing
  if (!headers.has('X-Request-ID')) {
    headers.set('X-Request-ID', getOrCreateRequestId());
  }

  // 3. Ensure JSON content-type if body is provided and not FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 800);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      ...options,
      headers,
      credentials: 'include', // Ensures httpOnly cookie is transmitted
      signal: options.signal || controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  // 4. Handle 401 Unauthorized -> Redirect to Landing Page (/)
  if (response.status === 401) {
    if (logoutHandler) {
      logoutHandler();
    }
    // Hard redirect to landing page if not on landing or auth pages
    if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/auth')) {
      window.location.href = '/';
    }
    throw new ApiError(401, 'Session expired or unauthorized. Redirecting to landing page.');
  }

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
    let parsedBody: any = null;
    try {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json') || contentType.includes('+json')) {
        parsedBody = await response.json();
        errorDetail = parsedBody.detail || parsedBody.title || errorDetail;
      }
    } catch {
      // Body not JSON
    }
    throw new ApiError(response.status, errorDetail, parsedBody);
  }

  // If 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  // Check content type before parsing JSON body
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json') && !contentType.includes('+json')) {
    throw new ApiError(response.status, `Non-JSON response received (${contentType || 'empty'})`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(url: string, options?: RequestInit) => apiClient<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, body?: any, options?: RequestInit) =>
    apiClient<T>(url, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T>(url: string, body?: any, options?: RequestInit) =>
    apiClient<T>(url, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T>(url: string, body?: any, options?: RequestInit) =>
    apiClient<T>(url, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T>(url: string, options?: RequestInit) => apiClient<T>(url, { ...options, method: 'DELETE' }),
};
