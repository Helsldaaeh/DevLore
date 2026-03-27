import { apiClient } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  roleId?: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    roleId: number;
    roleName: string;
    profile: string;
  };
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/api/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/api/auth/register', data);
  return response.data;
};