import type { AuthSession } from './session';

const ADMIN_PERMISSION_CODES = [
  'ADMIN',
  'SUPER_ADMIN',
  'ROOT',
  'SYSTEM.ADMIN',
  'SISTEMA.ADMIN',
  'ADMINISTRADOR',
];

export function normalizePermissionCode(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/:+/g, '.')
    .replace(/\.+/g, '.');
}

function isAdministratorPermission(permission: string): boolean {
  return ADMIN_PERMISSION_CODES.includes(permission);
}

function permissionMatches(userPermission: string, requiredPermission: string): boolean {
  if (userPermission === requiredPermission) return true;

  if (userPermission.endsWith('.*')) {
    const prefix = userPermission.slice(0, -2);
    return requiredPermission === prefix || requiredPermission.startsWith(`${prefix}.`);
  }

  if (requiredPermission.endsWith('.*')) {
    const prefix = requiredPermission.slice(0, -2);
    return userPermission === prefix || userPermission.startsWith(`${prefix}.`);
  }

  return false;
}

export function hasPermission(permissions: string[], requiredPermissions: string[]): boolean {
  const normalizedUserPermissions = permissions
    .map(normalizePermissionCode)
    .filter(Boolean);

  if (normalizedUserPermissions.some(isAdministratorPermission)) return true;

  const normalizedRequiredPermissions = requiredPermissions
    .map(normalizePermissionCode)
    .filter(Boolean);

  return normalizedRequiredPermissions.some((requiredPermission) => (
    normalizedUserPermissions.some((userPermission) => permissionMatches(userPermission, requiredPermission))
  ));
}

export function sessionHasPermission(session: AuthSession | null, requiredPermissions: string[]): boolean {
  if (!session) return false;
  return hasPermission(session.permissions, requiredPermissions);
}
