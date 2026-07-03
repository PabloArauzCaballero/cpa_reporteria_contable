import { env } from '../../../config/env';
import { postPublic } from '../../../shared/api/httpClient';
import { clearStoredSession } from '../../../shared/auth/session';
import type { AuthenticatedUser, LoginCredentials } from '../domain/authTypes';
import { mapLoginResponse } from './authResponseMapper';

function normalizeLoginPayload(credentials: LoginCredentials): LoginCredentials {
  return {
    email: credentials.email.trim().toLowerCase(),
    password: credentials.password,
  };
}

export async function login(credentials: LoginCredentials): Promise<AuthenticatedUser> {
  clearStoredSession();
  const payload = normalizeLoginPayload(credentials);
  const response = await postPublic<unknown, LoginCredentials>(env.authLoginEndpoint, payload);
  return mapLoginResponse(response, payload.email);
}
