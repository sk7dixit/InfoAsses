import { api } from './api';
import { ApiResponse, Challan } from '../types';

export interface CreateChallanPayload {
  customerId: string;
  items: { productId: string; quantity: number }[];
}

export const challanApi = {
  getChallans: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    const res = await api.get<ApiResponse<Challan[]>>('/challans', { params });
    return res.data;
  },

  getChallanById: async (id: string) => {
    const res = await api.get<ApiResponse<Challan>>(`/challans/${id}`);
    return res.data;
  },

  createChallan: async (payload: CreateChallanPayload) => {
    const res = await api.post<ApiResponse<Challan>>('/challans', payload);
    return res.data;
  },

  updateChallan: async (id: string, payload: Partial<CreateChallanPayload>) => {
    const res = await api.put<ApiResponse<Challan>>(`/challans/${id}`, payload);
    return res.data;
  },

  confirmChallan: async (id: string) => {
    const res = await api.post<ApiResponse<Challan>>(`/challans/${id}/confirm`);
    return res.data;
  },

  cancelChallan: async (id: string) => {
    const res = await api.post<ApiResponse<Challan>>(`/challans/${id}/cancel`);
    return res.data;
  },
};
