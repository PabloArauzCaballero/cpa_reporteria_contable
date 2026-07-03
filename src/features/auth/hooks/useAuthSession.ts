import { useCallback, useMemo, useState } from 'react';
import { clearStoredSession, readStoredSession, storeSession, type AuthSession } from '../../../shared/auth/session';
import { login } from '../api/authApi';
import type { LoginCredentials } from '../domain/authTypes';
import { validateLoginCredentials } from '../domain/loginValidation';

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession());
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const signIn = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    const validationError = validateLoginCredentials(credentials);
    if (validationError) {
      setAuthError(validationError);
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const authenticatedUser = await login(credentials);
      const nextSession: AuthSession = {
        token: authenticatedUser.token,
        userEmail: authenticatedUser.userEmail,
        userName: authenticatedUser.userName,
        createdAt: new Date().toISOString(),
      };
      storeSession(nextSession);
      setSession(nextSession);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo iniciar sesión.';
      setAuthError(message);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const signOut = useCallback(() => {
    clearStoredSession();
    setSession(null);
  }, []);

  return useMemo(() => ({
    session,
    isAuthenticated: Boolean(session?.token),
    isAuthenticating,
    authError,
    signIn,
    signOut,
  }), [authError, isAuthenticating, session, signIn, signOut]);
}
