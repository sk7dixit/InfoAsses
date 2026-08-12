import { api } from './api';
import { ApiResponse, User } from '../types';

export interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (credentials: { username?: string; email?: string; password: string; role?: string }) => {
    const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },

  logout: async () => {
    const res = await api.post<ApiResponse<void>>('/auth/logout');
    return res.data;
  },
};
