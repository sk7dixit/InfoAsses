import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../../services/inventory.api';
import { productApi } from '../../services/product.api';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { StockMovementModal } from './StockMovementModal';
import { StockMovement, Product } from '../../types';
import {
  Boxes,
  Plus,
  AlertTriangle,
  History,
  Search,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const InventoryList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'movements' | 'low-stock'>('overview');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { hasRole } = useAuth();
  const queryClient = useQueryClient();
  const canRecord = hasRole(['ADMIN', 'WAREHOUSE']);

  // All products overview query
  const { data: productsRes, isLoading: loadingProducts } = useQuery({
    queryKey: ['inventory-products-overview', search, locationFilter],
    queryFn: () => productApi.getProducts({ limit: 100, search }),
  });

  // Stock movements query
  const { data: movementsRes, isLoading: loadingMovements } = useQuery({
    queryKey: ['stock-movements', page],
    queryFn: () => inventoryApi.getMovements({ page, limit: 20 }),
  });

  // Low stock query
  const { data: lowStockRes, isLoading: loadingLowStock } = useQuery({
    queryKey: ['low-stock-products'],
    queryFn: () => inventoryApi.getLowStockProducts(),
  });

  const products = productsRes?.data || [];
  const lowStockCount = lowStockRes?.data?.length || 8;
  const movements = movementsRes?.data || [];

  // Filter products locally for location/status if specified
  const filteredProducts = products.filter((p) => {
    if (locationFilter && p.warehouseLocation !== locationFilter) return false;
    if (stockStatusFilter === 'IN_STOCK') return p.currentStock > p.minimumStock;
    if (stockStatusFilter === 'LOW_STOCK') return p.currentStock <= p.minimumStock && p.currentStock > 0;
    if (stockStatusFilter === 'OUT_OF_STOCK') return p.currentStock === 0;
    return true;
  });

  const movementColumns: Column<StockMovement>[] = [
    {
      header: 'Date & Time',
      accessor: (row) => <span className="text-xs text-slate-500 font-medium">{new Date(row.createdAt).toLocaleString()}</span>,
    },
    {
      header: 'Product Details',
      accessor: (row) => (
        <div>
          <h4 className="font-bold text-slate-900 text-xs">{row.product.productName}</h4>
          <span className="text-[10px] font-mono text-slate-400">SKU: {row.product.sku}</span>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: (row) => <Badge variant={row.movementType} />,
    },
    {
      header: 'Quantity',
      accessor: (row) => (
        <span className={`font-bold text-xs ${row.movementType === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {row.movementType === 'IN' ? '+' : '-'}{row.quantity} units
        </span>
      ),
    },
    {
      header: 'Reason / Reference',
      accessor: (row) => <span className="text-xs text-slate-600 font-medium">{row.reason}</span>,
    },
    {
      header: 'Logged By',
      accessor: (row) => <span className="text-xs font-semibold text-slate-700">{row.createdBy.name}</span>,
    },
  ];

  const productColumns: Column<Product>[] = [
    {
      header: 'Product',
      accessor: (row) => (
        <div className="flex items-center space-x-3">
          {row.imageUrl ? (
            <img
              src={row.imageUrl}
              alt={row.productName}
              className="w-9 h-9 object-cover rounded-lg border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
              <Package className="w-4 h-4" />
            </div>
          )}
          <div>
            <h4 className="font-bold text-slate-900 text-xs">{row.productName}</h4>
            <span className="text-[10px] text-slate-400 font-mono">SKU: {row.sku}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Location',
      accessor: (row) => (
        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
          {row.warehouseLocation || 'Warehouse A'}
        </span>
      ),
    },
    {
      header: 'Current Stock',
      accessor: (row) => (
        <span className={`font-bold text-xs ${row.currentStock <= row.minimumStock ? 'text-rose-600' : 'text-slate-900'}`}>
          {row.currentStock} units
        </span>
      ),
    },
    {
      header: 'Minimum Threshold',
      accessor: (row) => <span className="text-xs text-slate-500 font-medium">{row.minimumStock} units</span>,
    },
    {
      header: 'Status',
      accessor: (row) => {
        const isOut = row.currentStock === 0;
        const isLow = row.currentStock <= row.minimumStock && !isOut;

        return isOut ? (
          <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
            Out of Stock
          </span>
        ) : isLow ? (
          <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold inline-flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Low Stock
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold">
            In Stock
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: (row) => (
        canRecord ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5 text-blue-600" />}
          >
            Move Stock
          </Button>
        ) : null
      ),
    },
  ];

  return (
    <div className="space-y-7">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory & Stock</h1>
          <p className="text-sm text-slate-500 mt-1">
            {hasRole(['ACCOUNTS'])
              ? 'Review current stock levels and inventory movements.'
              : 'Monitor stock levels, record inventory movements, and identify items that need attention.'}
          </p>
        </div>
        {canRecord && (
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Record Stock Movement
          </Button>
        )}
      </div>

      {/* TOP 4 SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Stock Units</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">4,820</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">Across all warehouses</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Items</p>
              <h3 className="text-3xl font-bold text-rose-600 mt-1">{lowStockCount}</h3>
              <p className="text-xs font-semibold text-rose-600 mt-1">Requires restocking</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-slate-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Out of Stock</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">3</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">0 units remaining</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock Movements</p>
              <h3 className="text-3xl font-bold text-purple-600 mt-1">286</h3>
              <p className="text-xs font-semibold text-purple-600 mt-1">Audited transactions</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* STOCK ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stock Movement IN vs OUT (7 cols) */}
        <Card
          title="Stock Movement Activity"
          subtitle="Inventory IN receipts vs OUT dispatches over recent 30 days"
          className="lg:col-span-7"
        >
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900">Total Stock IN</span>
                </div>
                <span className="font-bold text-emerald-700 text-base">+1,240 units</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ArrowDownRight className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-900">Total Stock OUT</span>
                </div>
                <span className="font-bold text-blue-700 text-base">-890 units</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
                <span className="font-semibold text-slate-700">Supplier Purchases (IN)</span>
                <span className="font-bold text-emerald-600">+980 units</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
                <span className="font-semibold text-slate-700">Confirmed Sales Challans (OUT)</span>
                <span className="font-bold text-blue-600">-810 units</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
                <span className="font-semibold text-slate-700">Stock Returns & Adjustments</span>
                <span className="font-bold text-purple-600">+260 units / -80 units</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stock Health Overview (5 cols) */}
        <Card
          title="Stock Health"
          subtitle="Inventory threshold monitoring & quick filters"
          className="lg:col-span-5"
        >
          <div className="space-y-3 pt-1">
            <button
              onClick={() => {
                setActiveTab('overview');
                setStockStatusFilter('HEALTHY');
              }}
              className="w-full p-3 bg-emerald-50 hover:bg-emerald-100/70 rounded-xl border border-emerald-100 flex items-center justify-between text-xs transition-colors text-left"
            >
              <div>
                <span className="font-bold text-emerald-900 block">Healthy Stock Level</span>
                <span className="text-[10px] text-emerald-700">Above minimum alert limit &rarr;</span>
              </div>
              <span className="font-extrabold text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-subtle">
                126 SKUs (89%)
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('low-stock');
                setStockStatusFilter('');
              }}
              className="w-full p-3 bg-amber-50 hover:bg-amber-100/70 rounded-xl border border-amber-100 flex items-center justify-between text-xs transition-colors text-left"
            >
              <div>
                <span className="font-bold text-amber-900 block">Low Stock Items</span>
                <span className="text-[10px] text-amber-700">At or below reorder level &rarr;</span>
              </div>
              <span className="font-extrabold text-amber-900 bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-subtle">
                8 SKUs (6%)
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('overview');
                setStockStatusFilter('OUT_OF_STOCK');
              }}
              className="w-full p-3 bg-rose-50 hover:bg-rose-100/70 rounded-xl border border-rose-100 flex items-center justify-between text-xs transition-colors text-left"
            >
              <div>
                <span className="font-bold text-rose-900 block">Out of Stock Items</span>
                <span className="text-[10px] text-rose-700">0 units remaining &rarr;</span>
              </div>
              <span className="font-extrabold text-rose-900 bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-subtle">
                3 SKUs (2%)
              </span>
            </button>
          </div>
        </Card>
      </div>

      {/* TABS BAR */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Current Inventory</span>
        </button>

        <button
          onClick={() => setActiveTab('movements')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'movements'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Movement History Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('low-stock')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'low-stock'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Low Stock Watchlist</span>
          {lowStockRes?.data && lowStockRes.data.length > 0 && (
            <span className="ml-1 px-2 py-0.5 text-[10px] bg-rose-100 text-rose-700 font-bold rounded-full">
              {lowStockRes.data.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB CONTENT: CURRENT INVENTORY */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              placeholder="Search product name, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4 text-slate-400" />}
            />

            <Select
              options={[
                { value: '', label: 'All Warehouse Locations' },
                { value: 'Warehouse A', label: 'Warehouse A' },
                { value: 'Warehouse B', label: 'Warehouse B' },
                { value: 'Warehouse C', label: 'Warehouse C' },
              ]}
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />

            <Select
              options={[
                { value: '', label: 'All Stock Statuses' },
                { value: 'IN_STOCK', label: 'In Stock' },
                { value: 'LOW_STOCK', label: 'Low Stock Alert' },
                { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
              ]}
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
            />
          </div>

          <Table
            columns={productColumns}
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            isLoading={loadingProducts}
            emptyText="No inventory items match your search filters."
          />
        </div>
      )}

      {/* TAB CONTENT: MOVEMENT HISTORY */}
      {activeTab === 'movements' && (
        <Table
          columns={movementColumns}
          data={movementsRes?.data || []}
          keyExtractor={(item) => item.id}
          isLoading={loadingMovements}
          emptyText="No stock movements logged."
          pagination={
            movementsRes?.meta
              ? {
                  page: movementsRes.meta.page,
                  totalPages: movementsRes.meta.totalPages,
                  totalItems: movementsRes.meta.totalItems,
                  onPageChange: (newPage) => setPage(newPage),
                }
              : undefined
          }
        />
      )}

      {/* TAB CONTENT: LOW STOCK */}
      {activeTab === 'low-stock' && (
        <Table
          columns={productColumns}
          data={lowStockRes?.data || []}
          keyExtractor={(item) => item.id}
          isLoading={loadingLowStock}
          emptyText="✓ No low stock items. All inventory levels are healthy above minimum thresholds."
        />
      )}

      {/* STOCK MOVEMENT MODAL */}
      <StockMovementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
          queryClient.invalidateQueries({ queryKey: ['low-stock-products'] });
          queryClient.invalidateQueries({ queryKey: ['inventory-products-overview'] });
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }}
      />
    </div>
  );
};
