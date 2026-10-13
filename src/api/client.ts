import { ApiError, ProblemDetail } from './errors';

export const API_BASE_URL = 'http://10.0.2.2:8080';

export type ApiClientConfig = {
  baseURL: string;
  accessToken?: string;
};

export const normalizeProblemDetail = (payload: unknown): ProblemDetail => {
  const candidate = typeof payload === 'object' && payload !== null ? payload : {};

  return {
    status: Number((candidate as Record<string, unknown>).status ?? 500),
    title: String((candidate as Record<string, unknown>).title ?? 'Request failed'),
    detail: String((candidate as Record<string, unknown>).detail ?? 'Something went wrong.'),
    fieldErrors:
      typeof (candidate as Record<string, unknown>).fieldErrors === 'object'
        ? ((candidate as Record<string, Record<string, string[]>>).fieldErrors ?? {})
        : undefined,
  };
};

export const getAuthHeaders = (token: string): Record<string, string> => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const createApiError = (payload: unknown): ApiError => {
  const normalized = normalizeProblemDetail(payload);
  return new ApiError(normalized);
};

export const apiClient: ApiClientConfig = {
  baseURL: API_BASE_URL,
};
