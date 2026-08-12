import { api } from './api';
import { ApiResponse, Customer, FollowUp } from '../types';

export const customerApi = {
  getCustomers: async (params?: { page?: number; limit?: number; search?: string; status?: string; customerType?: string }) => {
    const res = await api.get<ApiResponse<Customer[]>>('/customers', { params });
    return res.data;
  },

  getCustomerById: async (id: string) => {
    const res = await api.get<ApiResponse<Customer & { followUps: FollowUp[] }>>(`/customers/${id}`);
    return res.data;
  },

  createCustomer: async (data: Partial<Customer>) => {
    const res = await api.post<ApiResponse<Customer>>('/customers', data);
    return res.data;
  },

  updateCustomer: async (id: string, data: Partial<Customer>) => {
    const res = await api.put<ApiResponse<Customer>>(`/customers/${id}`, data);
    return res.data;
  },

  deleteCustomer: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/customers/${id}`);
    return res.data;
  },

  getFollowUps: async (customerId: string) => {
    const res = await api.get<ApiResponse<FollowUp[]>>(`/follow-ups/customer/${customerId}`);
    return res.data;
  },

  getUpcomingFollowUps: async (limit: number = 10) => {
    const res = await api.get<ApiResponse<Customer[]>>('/follow-ups/upcoming', { params: { limit } });
    return res.data;
  },

  addFollowUp: async (customerId: string, data: { note: string; followUpDate: string }) => {
    const res = await api.post<ApiResponse<FollowUp>>(`/follow-ups/customer/${customerId}`, data);
    return res.data;
  },
};
