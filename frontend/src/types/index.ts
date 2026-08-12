export type Role = 'ADMIN' | 'SALES' | 'WAREHOUSE' | 'ACCOUNTS';
export type CustomerType = 'RETAIL' | 'WHOLESALE' | 'DISTRIBUTOR';
export type CustomerStatus = 'LEAD' | 'ACTIVE' | 'INACTIVE';
export type MovementType = 'IN' | 'OUT';
export type ChallanStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED';
export type EmploymentStatus = 'ACTIVE' | 'ON_CONTRACT' | 'INACTIVE';

export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  joiningDate: string;
  contractStart?: string | null;
  contractEnd?: string | null;
  status: EmploymentStatus;
  loginEnabled: boolean;
  lastWorkingDate?: string | null;
  notes?: string | null;
  userId?: string | null;
  user?: {
    id: string;
    email: string;
    role: Role;
    isActive: boolean;
  } | null;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  customerName: string;
  mobile: string;
  email?: string | null;
  businessName?: string | null;
  gstNumber?: string | null;
  customerType: CustomerType;
  address?: string | null;
  status: CustomerStatus;
  followUpDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    followUps: number;
    challans: number;
  };
}

export interface FollowUp {
  id: string;
  customerId: string;
  note: string;
  followUpDate: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    role: Role;
  };
  createdAt: string;
}

export interface Product {
  id: string;
  productName: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minimumStock: number;
  warehouseLocation?: string | null;
  imageUrl?: string | null;
  cloudinaryPublicId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  product: {
    id: string;
    productName: string;
    sku: string;
    category?: string;
  };
  quantity: number;
  movementType: MovementType;
  reason: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    role?: Role;
  };
  createdAt: string;
}

export interface ChallanItem {
  id: string;
  challanId: string;
  productId: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  createdAt: string;
  product?: {
    id: string;
    currentStock: number;
    imageUrl?: string | null;
  };
}

export interface Challan {
  id: string;
  challanNumber: string;
  customerId: string;
  customer: {
    id: string;
    customerName: string;
    businessName?: string | null;
    mobile: string;
    email?: string | null;
    address?: string | null;
    gstNumber?: string | null;
  };
  totalQuantity: number;
  status: ChallanStatus;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    role?: Role;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
  items: ChallanItem[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  errors?: { field: string; message: string }[];
}
