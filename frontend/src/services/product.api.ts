import { api } from './api';
import { ApiResponse, Product } from '../types';

export const productApi = {
  getProducts: async (params?: { page?: number; limit?: number; search?: string; category?: string; lowStock?: boolean }) => {
    const res = await api.get<ApiResponse<Product[]>>('/products', { params });
    return res.data;
  },

  getProductById: async (id: string) => {
    const res = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return res.data;
  },

  createProduct: async (formData: FormData) => {
    const res = await api.post<ApiResponse<Product>>('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateProduct: async (id: string, formData: FormData) => {
    const res = await api.put<ApiResponse<Product>>(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteProduct: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/products/${id}`);
    return res.data;
  },
};
