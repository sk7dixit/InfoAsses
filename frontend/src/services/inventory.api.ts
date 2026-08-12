import { api } from './api';
import { ApiResponse, Product, StockMovement } from '../types';

export const inventoryApi = {
  getMovements: async (params?: { page?: number; limit?: number; productId?: string; movementType?: string }) => {
    const res = await api.get<ApiResponse<StockMovement[]>>('/inventory/movements', { params });
    return res.data;
  },

  getLowStockProducts: async () => {
    const res = await api.get<ApiResponse<Product[]>>('/inventory/low-stock');
    return res.data;
  },

  recordMovement: async (data: { productId: string; quantity: number; movementType: 'IN' | 'OUT'; reason: string }) => {
    const res = await api.post<ApiResponse<StockMovement>>('/inventory/movements', data);
    return res.data;
  },
};
