import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { preparePkceAuthorization } from './pkce';
import { configureApiClient } from '../api/client';

export interface AuthUser {
  sub: string;
  name: string;
  email: string;
  badgeNumber?: string;
  station?: string;
  authorityId?: string;
  authorityTier?: string;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  authorityLevel: string | null;
  user: AuthUser | null;
  accessToken: string | null;
  hasEnrolledWebAuthn: boolean;
  isLoading: boolean;
  loginAsLocal: (onLocalFallback?: () => void) => Promise<void>;
  completeLogin: (token: string, user: AuthUser, requiresWebAuthn?: boolean) => void;
  markWebAuthnEnrolled: () => void;
  logout: () => Promise<void>;
}

export const DEFAULT_LOCAL_USER: AuthUser = {
  sub: 'officer_vikram',
  name: 'Insp. Vikram Deshmukh',
  email: 'v.deshmukh@police.local',
  badgeNumber: 'MH-POL-4412',
  station: 'Central Division Police Station, Zone 3',
  authorityId: 'auth-local-zone3',
  authorityTier: 'LOCAL',
  roles: ['local-authority', 'investigator', 'supervisor'],
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  authorityLevel: null,
  user: null,
  accessToken: null,
  hasEnrolledWebAuthn: false,
  isLoading: true,
  loginAsLocal: async () => {},
  completeLogin: () => {},
  markWebAuthnEnrolled: () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In-memory token storage (never written to localStorage or sessionStorage)
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return sessionStorage.getItem('tracex_auth') === 'true' ? 'mock_dev_access_token' : null;
  });
  const [user, setUser] = useState<AuthUser | null>(() => {
    return sessionStorage.getItem('tracex_auth') === 'true' ? DEFAULT_LOCAL_USER : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('tracex_auth') === 'true';
  });
  const [authorityLevel, setAuthorityLevel] = useState<string | null>(() => {
    return sessionStorage.getItem('tracex_level') || (sessionStorage.getItem('tracex_auth') === 'true' ? 'LOCAL' : null);
  });
  const [hasEnrolledWebAuthn, setHasEnrolledWebAuthn] = useState<boolean>(() => {
    return sessionStorage.getItem('tracex_webauthn_enrolled') === 'true';
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    // If user already authenticated in this session, don't block on loading
    return sessionStorage.getItem('tracex_auth') !== 'true';
  });
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  // Wire API client layer
  useEffect(() => {
    configureApiClient(
      () => tokenRef.current,
      () => {
        setAccessToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    );
  }, []);

  // Attempt silent refresh on initial load via httpOnly cookie
  useEffect(() => {
    const attemptSilentRefresh = async () => {
      // If already authenticated via session storage in local mode, no need to hang
      const devAuth = sessionStorage.getItem('tracex_auth');
      if (devAuth === 'true') {
        setIsAuthenticated(true);
        setAuthorityLevel(sessionStorage.getItem('tracex_level') || 'LOCAL');
        setUser(DEFAULT_LOCAL_USER);
        setIsLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);

      try {
        const res = await fetch('/api/v1/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Includes httpOnly cookie
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && (contentType.includes('application/json') || contentType.includes('+json'))) {
          const data = await res.json();
          if (data && data.user) {
            setAccessToken(data.access_token);
            setUser(data.user);
            setIsAuthenticated(true);
            setAuthorityLevel(data.user.authorityTier || 'LOCAL');
          }
        }
      } catch {
        // Backend offline or timeout
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };

    attemptSilentRefresh();
  }, []);

  const completeLogin = useCallback((token: string, authUser: AuthUser, requiresWebAuthn: boolean = false) => {
    setAccessToken(token);
    setUser(authUser);
    setIsAuthenticated(true);
    setAuthorityLevel(authUser.authorityTier || 'LOCAL');
    sessionStorage.setItem('tracex_auth', 'true');
    sessionStorage.setItem('tracex_level', authUser.authorityTier || 'LOCAL');

    if (!requiresWebAuthn) {
      setHasEnrolledWebAuthn(true);
      sessionStorage.setItem('tracex_webauthn_enrolled', 'true');
    }
  }, []);

  const loginAsLocal = useCallback(async (onLocalFallback?: () => void) => {
    try {
      const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080';
      const REALM = 'tracex';

      // Check if Keycloak OIDC container is reachable
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600);
      await fetch(`${KEYCLOAK_URL}/realms/${REALM}`, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const authUrl = await preparePkceAuthorization('local-authority');
      window.location.href = authUrl;
    } catch (e) {
      console.warn('Keycloak OIDC offline, activating local station session:', e);
      // Fallback for standalone/local development mode
      completeLogin('mock_dev_access_token', DEFAULT_LOCAL_USER, false);
      if (onLocalFallback) {
        onLocalFallback();
      } else {
        window.location.href = '/dashboard';
      }
    }
  }, [completeLogin]);

  const markWebAuthnEnrolled = useCallback(() => {
    setHasEnrolledWebAuthn(true);
    sessionStorage.setItem('tracex_webauthn_enrolled', 'true');
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore network errors during logout
    }

    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthorityLevel(null);
    sessionStorage.removeItem('tracex_auth');
    sessionStorage.removeItem('tracex_level');
    sessionStorage.removeItem('tracex_webauthn_enrolled');
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authorityLevel,
        user,
        accessToken,
        hasEnrolledWebAuthn,
        isLoading,
        loginAsLocal,
        completeLogin,
        markWebAuthnEnrolled,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
