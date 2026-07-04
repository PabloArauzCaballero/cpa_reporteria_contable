function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function normalizeEndpoint(value: string | undefined, fallback: string): string {
  const endpoint = String(value || fallback).trim();
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

export const env = {
  apiBaseUrl: trimTrailingSlash(import.meta.env.VITE_SERVICIO_CONTABLE_URL ?? import.meta.env.VITE_API_BASE_URL ?? ''),
  authRequired: true,
  authLoginEndpoint: normalizeEndpoint(import.meta.env.VITE_RUTA_ACCESO ?? import.meta.env.VITE_AUTH_LOGIN_ENDPOINT, '/api/auth/publicAuth/login'),
  reporteriaContableEndpoint: normalizeEndpoint(
    import.meta.env.VITE_RUTA_REPORTERIA ?? import.meta.env.VITE_REPORTERIA_CONTABLE_ENDPOINT,
    '/api/reporteria/contabilidad/powerbi-movimientos',
  ),
};

export function assertApiEnv(): void {
  if (!env.apiBaseUrl) {
    throw new Error('Falta configurar la dirección del servicio contable.');
  }
}
