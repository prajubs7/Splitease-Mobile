import { apiClient } from '@/api/client';
import type { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from '@/api/types';

export const login = async (payload: LoginRequest): Promise<TokenResponse> =>
  (await apiClient.post<TokenResponse>('/api/public/auth/login', payload)).data;

export const register = async (payload: RegisterRequest): Promise<UserResponse> =>
  (await apiClient.post<UserResponse>('/api/public/auth/register', payload)).data;

export const getCurrentUser = async (): Promise<UserResponse> =>
  (await apiClient.get<UserResponse>('/api/v1/users/me')).data;
