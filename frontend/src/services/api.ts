import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
const baseURL = (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || '/api';
export const api = axios.create({ baseURL, withCredentials: true });
let refreshing: Promise<unknown> | null = null;
export function isSessionFailure(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  if (error.response?.status === 401) return true;
  // CookieJWTAuthentication has no authenticate_header; DRF may return 403 for an expired/missing cookie.
  const detail: unknown = error.response?.data?.detail;
  return error.response?.status === 403 && typeof detail === 'string' && /Authentication credentials were not provided|Invalid authentication token|User not found|credenciais de autenticação não foram fornecidas/i.test(detail);
}
export function isHtmlFallbackResponse(headers: unknown, data: unknown): boolean {
  const contentType = typeof (headers as Record<string, unknown> | undefined)?.['content-type'] === 'string'
    ? String((headers as Record<string, unknown>)['content-type'])
    : '';
  return contentType.includes('text/html') || (typeof data === 'string' && /^\s*<!doctype html/i.test(data));
}
// Reject HTML SPA fallbacks and retry a protected request once after renewing the HTTP-only cookie session.
api.interceptors.response.use(response => {
  if (isHtmlFallbackResponse(response.headers, response.data)) {
    throw new axios.AxiosError('Invalid API response', 'ERR_BAD_RESPONSE', response.config, response.request, response);
  }
  return response;
}, async (error: unknown) => {
  if (!axios.isAxiosError(error)) throw error;
  const request = error.config as (InternalAxiosRequestConfig & { sessionRetried?: boolean }) | undefined;
  const authAction = /^\/users\/(login|register|refresh)\//.test(request?.url || '');
  if (!isSessionFailure(error) || !request || request.sessionRetried || authAction) throw error;
  request.sessionRetried = true;
  if (!refreshing) refreshing = api.post('/users/refresh/').finally(() => { refreshing = null; });
  try { await refreshing; } catch (renewalError) { if (isSessionFailure(renewalError)) window.dispatchEvent(new Event('questio:session-expired')); throw renewalError; }
  return api.request(request);
});
