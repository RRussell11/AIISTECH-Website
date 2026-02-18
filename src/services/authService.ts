import api from './api';
import { LoginCredentials, LoginResponse, RegisterData, User } from '@/types/auth.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  async register(userData: RegisterData): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/register', userData);
    return data;
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
};
