import { api } from './api';
import { ApiResponse, User, Role } from '../types';

export const userApi = {
  getUsers: async () => {
    const res = await api.get<ApiResponse<User[]>>('/users');
    return res.data;
  },

  createUser: async (data: { name: string; email: string; password: string; role: Role }) => {
    const res = await api.post<ApiResponse<User>>('/users', data);
    return res.data;
  },

  updateUser: async (id: string, data: Partial<User & { password?: string }>) => {
    const res = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return res.data;
  },

  deleteUser: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/users/${id}`);
    return res.data;
  },
};
