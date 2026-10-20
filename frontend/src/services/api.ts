import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
export const api = axios.create({ baseURL: '/api', withCredentials: true });
let refreshing: Promise<unknown> | null = null;
export function isSessionFailure(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  if (error.response?.status === 401) return true;
  // CookieJWTAuthentication has no authenticate_header; DRF may return 403 for an expired/missing cookie.
  const detail: unknown = error.response?.data?.detail;
  return error.response?.status === 403 && typeof detail === 'string' && /Authentication credentials were not provided|Invalid authentication token|User not found|credenciais de autenticação não foram fornecidas/i.test(detail);
}
// Retry a protected request once after renewing the HTTP-only cookie session.
api.interceptors.response.use(response => response, async (error: unknown) => {
  if (!axios.isAxiosError(error)) throw error;
  const request = error.config as (InternalAxiosRequestConfig & { sessionRetried?: boolean }) | undefined;
  const authAction = /^\/users\/(login|register|refresh)\//.test(request?.url || '');
  if (!isSessionFailure(error) || !request || request.sessionRetried || authAction) throw error;
  request.sessionRetried = true;
  if (!refreshing) refreshing = api.post('/users/refresh/').finally(() => { refreshing = null; });
  try { await refreshing; } catch (renewalError) { if (isSessionFailure(renewalError)) window.dispatchEvent(new Event('questio:session-expired')); throw renewalError; }
  return api.request(request);
});
