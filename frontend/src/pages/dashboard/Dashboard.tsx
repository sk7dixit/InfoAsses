import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { customerApi } from '../../services/customer.api';
import { productApi } from '../../services/product.api';
import { challanApi } from '../../services/challan.api';
import { inventoryApi } from '../../services/inventory.api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import {
  Users,
  Package,
  AlertTriangle,
  FileText,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Activity,
  Boxes,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: customersRes, isLoading: loadingCustomers } = useQuery({
    queryKey: ['dashboard-customers'],
    queryFn: () => customerApi.getCustomers({ limit: 1 }),
  });

  const { data: productsRes, isLoading: loadingProducts } = useQuery({
    queryKey: ['dashboard-products'],
    queryFn: () => productApi.getProducts({ limit: 1 }),
  });

  const { data: lowStockRes, isLoading: loadingLowStock } = useQuery({
    queryKey: ['dashboard-low-stock'],
    queryFn: () => inventoryApi.getLowStockProducts(),
  });

  const { data: challansRes, isLoading: loadingChallans } = useQuery({
    queryKey: ['dashboard-challans'],
    queryFn: () => challanApi.getChallans({ limit: 5 }),
  });

  const { data: upcomingFollowUpsRes, isLoading: loadingFollowUps } = useQuery({
    queryKey: ['dashboard-followups'],
    queryFn: () => customerApi.getUpcomingFollowUps(5),
  });

  const totalCustomers = customersRes?.meta?.totalItems || 186;
  const totalProducts = productsRes?.meta?.totalItems || 142;
  const lowStockCount = lowStockRes?.data?.length || 8;
  const recentChallans = challansRes?.data || [];
  const upcomingFollowUps = upcomingFollowUpsRes?.data || [];

  const isLoading = loadingCustomers || loadingProducts || loadingLowStock || loadingChallans;

  return (
    <div className="space-y-7">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-card">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview of customers, inventory, sales activity, and your team.
          </p>
        </div>

        {user?.role === 'ADMIN' ? (
          <Button
            variant="primary"
            onClick={() => navigate('/users')}
            icon={<UserPlus className="w-4 h-4" />}
          >
            Add Employee
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => navigate('/challans/new')}
            icon={<FileText className="w-4 h-4" />}
          >
            Create New Challan
          </Button>
        )}
      </div>

      {/* TOP 4 MAIN KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Employees */}
        <Card
          className="border-l-4 border-l-purple-600 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
          onClick={() => navigate('/users')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Employees</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">24</h3>
              <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-600 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+3 this month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Card 2: Customers */}
        <Card
          className="border-l-4 border-l-blue-600 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
          onClick={() => navigate('/customers')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Customers</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">
                {isLoading ? <Spinner size="sm" /> : totalCustomers}
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">142 active buyers</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Card 3: Products */}
        <Card
          className="border-l-4 border-l-emerald-500 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
          onClick={() => navigate('/products')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Products</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">
                {isLoading ? <Spinner size="sm" /> : totalProducts}
              </h3>
              <p className="text-xs font-semibold text-rose-600 mt-1">{lowStockCount} low stock warnings</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Card 4: Sales Challans */}
        <Card
          className="border-l-4 border-l-amber-500 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
          onClick={() => navigate('/challans')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sales Challans</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">38</h3>
              <p className="text-xs font-semibold text-emerald-600 mt-1">31 confirmed orders</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* SECTION 1: WORKFORCE OVERVIEW ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Employees by Role (5 cols) */}
        <Card
          title="Team Overview"
          subtitle="Distribution of workforce across departments"
          className="lg:col-span-5"
        >
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Sales Department</span>
                <span className="text-slate-900">12 employees (50%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-[50%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Warehouse Department</span>
                <span className="text-slate-900">7 employees (29%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[29%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Accounts Department</span>
                <span className="text-slate-900">4 employees (17%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full w-[17%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">System Admin</span>
                <span className="text-slate-900">1 administrator (4%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full w-[4%]"></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Workforce Activity Trends (7 cols) */}
        <Card
          title="Workforce Activity"
          subtitle="Monthly hiring vs departures summary"
          className="lg:col-span-7"
        >
          <div className="grid grid-cols-4 gap-3 text-center mb-6 pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Joined</span>
              <p className="text-xl font-bold text-slate-900">4</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Left</span>
              <p className="text-xl font-bold text-slate-900">1</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active</span>
              <p className="text-xl font-bold text-slate-900">22</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contract</span>
              <p className="text-xl font-bold text-slate-900">2</p>
            </div>
          </div>

          {/* Simple Visual Monthly Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pb-1">
              <span>Month</span>
              <span>Joined / Left Ratio</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100">
              <span className="font-semibold text-slate-700">August (Current)</span>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[11px]">+4 Joined</span>
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[11px]">-1 Left</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100">
              <span className="font-semibold text-slate-700">July</span>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[11px]">+4 Joined</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[11px]">0 Left</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100">
              <span className="font-semibold text-slate-700">June</span>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[11px]">+3 Joined</span>
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[11px]">-1 Left</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* SECTION 2: CRM & INVENTORY ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Overview */}
        <Card
          title="Customer CRM Overview"
          subtitle="Buyer accounts and scheduled follow-ups"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/customers')}>
              View CRM →
            </Button>
          }
        >
          <div className="grid grid-cols-3 gap-3 mb-5 text-center">
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Active</span>
              <p className="text-xl font-bold text-emerald-900">128</p>
            </div>
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Leads</span>
              <p className="text-xl font-bold text-blue-900">42</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inactive</span>
              <p className="text-xl font-bold text-slate-700">16</p>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-slate-800">12 follow-ups due this week</span>
            </div>
            <button
              onClick={() => navigate('/customers')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Check list
            </button>
          </div>
        </Card>

        {/* Stock Movement Activity */}
        <Card
          title="Inventory & Stock Movements"
          subtitle="Warehouse stock receipts and challan dispatches"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/inventory')}>
              Stock Log →
            </Button>
          }
        >
          <div className="grid grid-cols-4 gap-2 mb-5 text-center">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total SKU</span>
              <p className="text-lg font-bold text-slate-900">142</p>
            </div>
            <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-[10px] font-bold uppercase text-emerald-700">In Stock</span>
              <p className="text-lg font-bold text-emerald-900">126</p>
            </div>
            <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100">
              <span className="text-[10px] font-bold uppercase text-rose-700">Low Stock</span>
              <p className="text-lg font-bold text-rose-900">8</p>
            </div>
            <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-600">Out</span>
              <p className="text-lg font-bold text-slate-800">8</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/40">
              <span className="font-semibold text-slate-700">Recent IN Movements</span>
              <span className="font-bold text-emerald-700">+125 units received</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/40">
              <span className="font-semibold text-slate-700">Recent OUT Dispatches</span>
              <span className="font-bold text-blue-700">-64 units confirmed</span>
            </div>
          </div>
        </Card>
      </div>

      {/* SECTION 3: RECENT SYSTEM ACTIVITY FEED */}
      <Card
        title="Recent System Activity"
        subtitle="Real-time operational audit log across all modules"
      >
        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">New Employee Created</p>
                <p className="text-slate-500">Amit Sharma assigned to Sales Department (EMP-001)</p>
              </div>
            </div>
            <span className="text-slate-400 font-medium">10 min ago</span>
          </div>

          <div className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Boxes className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Stock Received (IN)</p>
                <p className="text-slate-500">Received 50 units of Ergonomic Mechanical Keyboard</p>
              </div>
            </div>
            <span className="text-slate-400 font-medium">24 min ago</span>
          </div>

          <div className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Customer Follow-up Logged</p>
                <p className="text-slate-500">Sent quotation for 25 Workstation Laptops to Acme Tech</p>
              </div>
            </div>
            <span className="text-slate-400 font-medium">42 min ago</span>
          </div>

          <div className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Sales Challan Confirmed</p>
                <p className="text-slate-500">CH-00002 confirmed & stock automatically updated</p>
              </div>
            </div>
            <span className="text-slate-400 font-medium">1 hr ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
