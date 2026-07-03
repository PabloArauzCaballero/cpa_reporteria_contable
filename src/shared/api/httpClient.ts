import { assertApiEnv, env } from '../../config/env';
import { readSessionToken } from '../auth/session';

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return response.json();
  return response.text();
}

function readPayloadMessage(payload: unknown): string {
  if (typeof payload === 'string') return payload.trim();

  if (typeof payload === 'object' && payload !== null) {
    const source = payload as Record<string, unknown>;
    const direct = source.message ?? source.error ?? source.detail;
    if (Array.isArray(direct)) return direct.map(String).join(', ');
    if (direct !== undefined && direct !== null) return String(direct).trim();
  }

  return '';
}

function resolveErrorMessage(payload: unknown, status: number): string {
  const payloadMessage = readPayloadMessage(payload);
  if (payloadMessage) return payloadMessage;
  if (status === 400) return 'La solicitud no pudo procesarse. Revisa los datos enviados.';
  if (status === 401) return 'No autorizado. Revisa credenciales, endpoint de login o token de sesión.';
  if (status === 403) return 'No tienes permisos para consultar esta reportería.';
  if (status === 404) return 'El servicio solicitado no está disponible.';
  if (status >= 500) return 'El backend no pudo procesar la solicitud.';
  return `No se pudo completar la consulta. Código ${status}.`;
}

function buildHeaders(hasBody: boolean, includeSessionToken: boolean): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (hasBody) headers['Content-Type'] = 'application/json';

  if (includeSessionToken) {
    const token = readSessionToken();
    if (token) headers['X-Session-Token'] = token;
  }

  return headers;
}

interface RequestOptions<TBody> {
  method: 'GET' | 'POST';
  body?: TBody;
  includeSessionToken: boolean;
}

async function request<TResponse, TBody = unknown>(path: string, options: RequestOptions<TBody>): Promise<TResponse> {
  assertApiEnv();
  const response = await fetch(`${env.apiBaseUrl}${normalizePath(path)}`, {
    method: options.method,
    headers: buildHeaders(options.body !== undefined, options.includeSessionToken),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const payload = await parseResponse(response);
  if (!response.ok) {
    throw new HttpError(resolveErrorMessage(payload, response.status), response.status, payload);
  }

  return payload as TResponse;
}

export function get<TResponse>(path: string): Promise<TResponse> {
  return request<TResponse>(path, { method: 'GET', includeSessionToken: true });
}

export function post<TResponse, TBody = unknown>(path: string, body: TBody): Promise<TResponse> {
  return request<TResponse, TBody>(path, { method: 'POST', body, includeSessionToken: true });
}

export function postPublic<TResponse, TBody = unknown>(path: string, body: TBody): Promise<TResponse> {
  return request<TResponse, TBody>(path, { method: 'POST', body, includeSessionToken: false });
}
