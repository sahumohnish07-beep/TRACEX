/**
 * PKCE (Proof Key for Code Exchange) Utility using Web Crypto API.
 * Conforms to RFC 7636.
 */

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080';
const REALM = 'tracex';
const CLIENT_ID = 'tracex-frontend';
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'http://localhost:5173/auth/callback';

export function generateRandomString(length: number = 64): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  return result;
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  
  // Base64url encode without padding
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function preparePkceAuthorization(roleHint: string = 'local-authority'): Promise<string> {
  const verifier = generateRandomString(64);
  const challenge = await generateCodeChallenge(verifier);
  const state = generateRandomString(32);

  // Store in sessionStorage for the duration of the redirect
  sessionStorage.setItem('tracex_pkce_verifier', verifier);
  sessionStorage.setItem('tracex_auth_state', state);
  sessionStorage.setItem('tracex_role_hint', roleHint);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    scope: 'openid profile email',
    redirect_uri: REDIRECT_URI,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    state: state,
    role_hint: roleHint,
  });

  return `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/auth?${params.toString()}`;
}

export function getStoredVerifier(): string | null {
  const verifier = sessionStorage.getItem('tracex_pkce_verifier');
  sessionStorage.removeItem('tracex_pkce_verifier');
  return verifier;
}
