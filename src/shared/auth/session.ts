export interface AuthSession {
  token: string;
  userName: string;
  userEmail: string;
  permissions: string[];
  createdAt: string;
}

const AUTH_SESSION_KEY = 'cpa_reporteria_contable_auth_session';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function normalizeStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => normalizeText(item))
    .filter(Boolean);
}

export function readStoredSession(): AuthSession | null {
  const rawSession = window.localStorage.getItem(AUTH_SESSION_KEY);
  if (!rawSession) return null;

  try {
    const parsed = JSON.parse(rawSession) as unknown;
    if (!isRecord(parsed)) return null;

    const token = normalizeText(parsed.token);
    const userName = normalizeText(parsed.userName);
    const userEmail = normalizeText(parsed.userEmail);
    const createdAt = normalizeText(parsed.createdAt);
    const permissions = normalizeStringList(parsed.permissions);

    if (!token || !userEmail) return null;
    return {
      token,
      userName: userName || userEmail,
      userEmail,
      permissions,
      createdAt: createdAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function storeSession(session: AuthSession): void {
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}

export function readSessionToken(): string {
  return readStoredSession()?.token ?? '';
}
