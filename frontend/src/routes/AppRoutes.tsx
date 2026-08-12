import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/auth/Login';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { AccountsDashboard } from '../pages/dashboard/AccountsDashboard';
import { SalesDashboard } from '../pages/dashboard/SalesDashboard';
import { WarehouseDashboard } from '../pages/dashboard/WarehouseDashboard';
import { SalesFollowUps } from '../pages/sales/SalesFollowUps';
import { CustomerList } from '../pages/customers/CustomerList';
import { CustomerDetails } from '../pages/customers/CustomerDetails';
import { ProductList } from '../pages/products/ProductList';
import { InventoryList } from '../pages/inventory/InventoryList';
import { ChallanList } from '../pages/challans/ChallanList';
import { CreateChallan } from '../pages/challans/CreateChallan';
import { ChallanDetails } from '../pages/challans/ChallanDetails';
import { UserManagement } from '../pages/users/UserManagement';
import { AdminSettings } from '../pages/admin/AdminSettings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Internal Employee Portal Entry */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Navigate to="/" replace />} />

      {/* Operational Portal (Protected Routes) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Warehouse Workspace Portal */}
          <Route
            path="/warehouse/dashboard"
            element={
              <RoleRoute roles={['ADMIN', 'WAREHOUSE']}>
                <WarehouseDashboard />
              </RoleRoute>
            }
          />

          {/* Sales Workspace Portal */}
          <Route
            path="/sales/dashboard"
            element={
              <RoleRoute roles={['ADMIN', 'SALES']}>
                <SalesDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/sales/follow-ups"
            element={
              <RoleRoute roles={['ADMIN', 'SALES']}>
                <SalesFollowUps />
              </RoleRoute>
            }
          />

          {/* Accounts Portal */}
          <Route
            path="/accounts/dashboard"
            element={
              <RoleRoute roles={['ADMIN', 'ACCOUNTS']}>
                <AccountsDashboard />
              </RoleRoute>
            }
          />

          {/* Customer CRM */}
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />

          {/* Products Master */}
          <Route path="/products" element={<ProductList />} />

          {/* Inventory & Stock Control */}
          <Route path="/inventory" element={<InventoryList />} />

          {/* Sales Delivery Challans */}
          <Route path="/challans" element={<ChallanList />} />
          <Route
            path="/challans/new"
            element={
              <RoleRoute roles={['ADMIN', 'SALES']}>
                <CreateChallan />
              </RoleRoute>
            }
          />
          <Route path="/challans/:id" element={<ChallanDetails />} />

          {/* Admin User Management */}
          <Route
            path="/users"
            element={
              <RoleRoute roles={['ADMIN']}>
                <UserManagement />
              </RoleRoute>
            }
          />

          {/* Admin Settings Portal */}
          <Route
            path="/admin/settings"
            element={
              <RoleRoute roles={['ADMIN']}>
                <AdminSettings />
              </RoleRoute>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
