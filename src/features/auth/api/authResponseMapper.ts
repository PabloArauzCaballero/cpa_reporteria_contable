import type { AuthenticatedUser } from '../domain/authTypes';

const PERMISSION_TEXT_KEYS = [
  'codigo',
  'code',
  'permiso',
  'permission',
  'clave',
  'name',
  'nombre',
  'authority',
];

const PERMISSION_COLLECTION_KEYS = [
  'permissions',
  'permisos',
  'authorities',
  'claims',
  'acciones',
  'roles',
];

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

function addPermission(target: Set<string>, value: unknown): void {
  const candidate = text(value);
  if (candidate) target.add(candidate);
}

function collectPermissionEntries(source: unknown, target: Set<string>): void {
  if (typeof source === 'string' || typeof source === 'number') {
    addPermission(target, source);
    return;
  }

  if (Array.isArray(source)) {
    source.forEach((item) => collectPermissionEntries(item, target));
    return;
  }

  if (!isRecord(source)) return;

  PERMISSION_TEXT_KEYS.forEach((key) => addPermission(target, source[key]));
  PERMISSION_COLLECTION_KEYS.forEach((key) => collectPermissionEntries(source[key], target));
}

function collectPermissionsFromResponse(response: Record<string, unknown>): string[] {
  const data = nestedRecord(response, 'data');
  const user = nestedRecord(data, 'user');
  const usuario = nestedRecord(data, 'usuario');
  const session = nestedRecord(data, 'session');
  const profile = Object.keys(user).length > 0 ? user : usuario;
  const sources = [response, data, profile, session];
  const permissions = new Set<string>();

  sources.forEach((source) => {
    PERMISSION_COLLECTION_KEYS.forEach((key) => collectPermissionEntries(source[key], permissions));
  });

  return Array.from(permissions).sort((left, right) => left.localeCompare(right, 'es'));
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
    throw new Error('No se pudo confirmar el acceso. Solicita verificación de tu usuario.');
  }

  const email = text(profile.email) || text(profile.correo) || fallbackEmail;
  const name = text(profile.nombre_usuario)
    || text(profile.nombre)
    || text(profile.name)
    || text(data.nombre_usuario)
    || email;

  return {
    token,
    userEmail: email,
    userName: name,
    permissions: collectPermissionsFromResponse(root),
  };
}
