import type { AuthenticatedUser } from '../domain/authTypes';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function text(value: unknown): string {
  return String(value ?? '').trim();
}

function nestedRecord(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key];
  return isRecord(value) ? value : {};
}

export function mapLoginResponse(response: unknown, fallbackEmail: string): AuthenticatedUser {
  const root = isRecord(response) ? response : {};
  const data = nestedRecord(root, 'data');
  const user = nestedRecord(data, 'user');
  const usuario = nestedRecord(data, 'usuario');
  const profile = Object.keys(user).length > 0 ? user : usuario;

  const token = text(data.sessionToken)
    || text(root.sessionToken)
    || text(data.session_token)
    || text(root.session_token)
    || text(data.token)
    || text(root.token)
    || text(data.accessToken)
    || text(root.accessToken);

  if (!token) {
    throw new Error('El login no devolvió un token de sesión válido.');
  }

  const email = text(profile.email) || text(profile.correo) || fallbackEmail;
  const name = text(profile.nombre_usuario)
    || text(profile.nombre)
    || text(profile.name)
    || text(data.nombre_usuario)
    || email;

  return { token, userEmail: email, userName: name };
}
