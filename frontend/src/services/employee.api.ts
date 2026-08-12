import { api } from './api';
import { ApiResponse, Employee, Role, EmploymentStatus } from '../types';

export interface EmployeeStats {
  total: number;
  active: number;
  onContract: number;
  inactive: number;
  roles: {
    sales: number;
    warehouse: number;
    accounts: number;
    admin: number;
  };
}

export const employeeApi = {
  getEmployees: async (params?: { page?: number; limit?: number; search?: string; role?: Role; status?: EmploymentStatus }) => {
    const res = await api.get<ApiResponse<Employee[]>>('/employees', { params });
    return res.data;
  },

  getEmployeeById: async (id: string) => {
    const res = await api.get<ApiResponse<Employee>>(`/employees/${id}`);
    return res.data;
  },

  createEmployee: async (data: Partial<Employee> & { password?: string }) => {
    const res = await api.post<ApiResponse<Employee>>('/employees', data);
    return res.data;
  },

  updateEmployee: async (id: string, data: Partial<Employee>) => {
    const res = await api.put<ApiResponse<Employee>>(`/employees/${id}`, data);
    return res.data;
  },

  toggleStatus: async (id: string, data: { status: EmploymentStatus; loginEnabled: boolean }) => {
    const res = await api.patch<ApiResponse<Employee>>(`/employees/${id}/status`, data);
    return res.data;
  },

  getStats: async () => {
    const res = await api.get<ApiResponse<EmployeeStats>>('/employees/stats');
    return res.data;
  },
};
