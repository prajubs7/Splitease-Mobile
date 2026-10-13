export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
};

export const login = async (_payload: LoginRequest): Promise<{ accessToken: string; tokenType: string; expiresIn: number }> => ({
  accessToken: 'demo-token',
  tokenType: 'Bearer',
  expiresIn: 3600,
});

export const register = async (_payload: RegisterRequest) => ({
  id: 'demo-user-id',
  email: _payload.email,
  fullName: _payload.fullName,
  createdAt: new Date().toISOString(),
});

export const getCurrentUser = async () => ({
  id: 'demo-user-id',
  email: 'demo@example.com',
  fullName: 'Demo User',
  createdAt: new Date().toISOString(),
});
