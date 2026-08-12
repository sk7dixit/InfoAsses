import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { inventoryApi } from '../../services/inventory.api';
import { productApi } from '../../services/product.api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { StockMovementModal } from '../inventory/StockMovementModal';
import {
  Boxes,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Plus,
  ArrowRight,
  CheckCircle2,
  PackageX,
  History,
} from 'lucide-react';

export const WarehouseDashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

  const { data: movementsRes, isLoading: loadingMovements } = useQuery({
    queryKey: ['recent-movements'],
    queryFn: () => inventoryApi.getMovements({ limit: 5 }),
  });

  const { data: productsRes, isLoading: loadingProducts } = useQuery({
    queryKey: ['warehouse-products'],
    queryFn: () => productApi.getProducts({ limit: 50 }),
  });

  const products = productsRes?.data || [];
  const lowStockItems = products.filter((p) => p.currentStock <= p.minimumStock && p.currentStock > 0);
  const outOfStockItems = products.filter((p) => p.currentStock === 0);
  const healthyItemsCount = products.length - lowStockItems.length - outOfStockItems.length;

  return (
    <div className="space-y-7">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Warehouse Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor stock levels, recent movements, and items that need attention.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsMovementModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Record Stock Movement
        </Button>
      </div>

      {/* TOP 4 SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Stock Units</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">4,820</h3>
              <p className="text-xs font-semibold text-blue-600 mt-1">Across all locations</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Items</p>
              <h3 className="text-3xl font-bold text-amber-600 mt-1">2</h3>
              <p className="text-xs font-semibold text-amber-600 mt-1">Requires attention</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Out of Stock</p>
              <h3 className="text-3xl font-bold text-rose-600 mt-1">3</h3>
              <p className="text-xs font-semibold text-rose-600 mt-1">0 units remaining</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <PackageX className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock Movements</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-1">286</h3>
              <p className="text-xs font-semibold text-emerald-600 mt-1">Recorded this month</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* STOCK MOVEMENT ACTIVITY & STOCK HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Stock Movement Activity (7 cols) */}
        <Card
          title="Stock Movement Activity"
          subtitle="Inventory received and issued over the recent period"
          className="lg:col-span-7"
        >
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">Total Stock IN</span>
                  <h4 className="text-2xl font-bold text-emerald-900 mt-0.5">+1,240 <span className="text-xs font-normal">units</span></h4>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-rose-800 tracking-wider">Total Stock OUT</span>
                  <h4 className="text-2xl font-bold text-rose-900 mt-0.5">-890 <span className="text-xs font-normal">units</span></h4>
                </div>
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Clean Monthly IN vs OUT Volume Chart */}
            <div className="pt-2 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Recent 30-Day Movement Trend</span>
              
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700">Stock IN (Supplier Restock & Purchase)</span>
                    <span className="text-emerald-700 font-bold">1,240 units (58%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[58%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700">Stock OUT (Sales Delivery Challans)</span>
                    <span className="text-rose-700 font-bold">890 units (42%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[42%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stock Health (5 cols) */}
        <Card
          title="Stock Health"
          subtitle="Current inventory status based on minimum stock levels"
          className="lg:col-span-5"
        >
          <div className="space-y-3.5 pt-2 text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-emerald-900">Healthy Stock</h4>
                <p className="text-[11px] text-emerald-700">Above minimum threshold</p>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-emerald-900 block">126 products</span>
                <span className="text-[10px] font-extrabold text-emerald-700">89%</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-amber-900">Low Stock</h4>
                <p className="text-[11px] text-amber-700">At or below reorder level</p>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-amber-900 block">8 products</span>
                <span className="text-[10px] font-extrabold text-amber-700">6%</span>
              </div>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-rose-900">Out of Stock</h4>
                <p className="text-[11px] text-rose-700">0 units remaining</p>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-rose-900 block">3 products</span>
                <span className="text-[10px] font-extrabold text-rose-700">2%</span>
              </div>
            </div>
          </div>
        </Card>

      </div>

      {/* RECENT MOVEMENTS & ITEMS REQUIRING ATTENTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Stock Movements (7 cols) */}
        <Card
          title="Recent Stock Movements"
          subtitle="Audit log of recent inventory receipts and dispatches"
          className="lg:col-span-7"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/inventory')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              View Movement History &rarr;
            </Button>
          }
        >
          <div className="space-y-3 pt-2">
            {[
              { product: 'Wireless Mouse', qty: '+50 units', type: 'IN · Supplier Purchase', user: 'Alex · 11 Aug, 10:42 AM', isIn: true },
              { product: 'Mechanical Keyboard', qty: '-12 units', type: 'OUT · Sales Challan CH-00042', user: 'Alex · 11 Aug, 09:15 AM', isIn: false },
              { product: 'USB Hub', qty: '+25 units', type: 'IN · Supplier Purchase', user: 'Alex · 10 Aug, 04:30 PM', isIn: true },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{item.product}</h4>
                  <p className="text-slate-500 font-medium text-[11px] mt-0.5">{item.type}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.user}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
                    item.isIn ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.qty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Items Requiring Attention (5 cols) */}
        <Card
          title="Items Requiring Attention"
          subtitle="Low stock and out-of-stock products"
          className="lg:col-span-5"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/inventory')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              View Inventory &rarr;
            </Button>
          }
        >
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">Wireless Mouse</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">Current: <span className="font-bold text-amber-800">6</span> / Minimum: 10</p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                LOW STOCK
              </span>
            </div>

            <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">USB Hub</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">Current: <span className="font-bold text-rose-800">0</span> / Minimum: 5</p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                OUT OF STOCK
              </span>
            </div>
          </div>
        </Card>

      </div>

      {/* STOCK MOVEMENT MODAL */}
      <StockMovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['recent-movements'] });
          queryClient.invalidateQueries({ queryKey: ['warehouse-products'] });
        }}
      />
    </div>
  );
};
