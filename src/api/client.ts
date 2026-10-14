import axios, { AxiosError } from 'axios';
import { getApiBaseUrl } from '@/lib/env';
import { ApiError } from './errors';
import { tokenStore } from './tokenStore';

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null): void => {
  unauthorizedHandler = handler;
};

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  headers: { Accept: 'application/json' },
});

apiClient.interceptors.request.use(config => {
  const token = tokenStore.get();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }
    const axiosError = error as AxiosError;
    if (!axiosError.response) {
      return Promise.reject(
        new ApiError({
          status: 0,
          title: 'Network error',
          detail: 'Cannot reach the server. Check your connection.',
        }),
      );
    }
    const { status, data } = axiosError.response;
    // a 401 on a request that carried a token means the session is dead (login failures carry none)
    if (status === 401 && axiosError.config?.headers?.has('Authorization')) {
      tokenStore.clear();
      unauthorizedHandler?.();
    }
    return Promise.reject(ApiError.fromProblemDetail(data, status));
  },
);

export default apiClient;
