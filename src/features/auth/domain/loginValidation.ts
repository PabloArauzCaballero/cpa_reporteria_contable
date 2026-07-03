import type { LoginCredentials } from './authTypes';

export function validateLoginCredentials(credentials: LoginCredentials): string | null {
  if (!credentials.email.trim()) return 'Ingresa tu correo institucional.';
  if (!credentials.email.includes('@')) return 'Ingresa un correo válido.';
  if (!credentials.password.trim()) return 'Ingresa tu contraseña.';
  return null;
}
