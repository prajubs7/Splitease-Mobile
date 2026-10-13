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
    if (status === 401) {
      tokenStore.clear();
      unauthorizedHandler?.();
    }
    return Promise.reject(ApiError.fromProblemDetail(data, status));
  },
);

export default apiClient;
