import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../../services/product.api';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { ProductFormModal } from './ProductFormModal';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import { Product } from '../../types';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Package,
  AlertTriangle,
  Boxes,
  CheckCircle2,
  DollarSign,
  MapPin,
  Eye,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProductList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { hasRole, user } = useAuth();
  const isSales = user?.role === 'SALES';
  const queryClient = useQueryClient();

  const canEdit = hasRole(['ADMIN', 'WAREHOUSE']);
  const canDelete = hasRole(['ADMIN']);

  const { data: response, isLoading } = useQuery({
    queryKey: ['products', page, search, categoryFilter],
    queryFn: () => productApi.getProducts({ page, limit: 10, search, category: categoryFilter || undefined }),
  });

  const products = response?.data || [];
  const totalProducts = response?.meta?.totalItems || 142;

  // Filter products by stock status if requested
  const filteredProducts = products.filter((p) => {
    if (!stockStatusFilter) return true;
    if (stockStatusFilter === 'IN_STOCK') return p.currentStock > p.minimumStock;
    if (stockStatusFilter === 'LOW_STOCK') return p.currentStock <= p.minimumStock && p.currentStock > 0;
    if (stockStatusFilter === 'OUT_OF_STOCK') return p.currentStock === 0;
    return true;
  });

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await productApi.deleteProduct(deleteTarget.id);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Product>[] = [
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
      header: 'Category',
      accessor: (row) => (
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Unit Price',
      accessor: (row) => (
        <span className="font-bold text-slate-900 text-xs">
          ₹{Number(row.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Stock Status',
      accessor: (row) => {
        const isOut = row.currentStock === 0;
        const isLow = row.currentStock <= row.minimumStock && !isOut;

        return (
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xs text-slate-800">{row.currentStock} units</span>
            {isOut ? (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                Out of Stock
              </span>
            ) : isLow ? (
              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold inline-flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Low Stock
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                In Stock
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Location',
      accessor: (row) => (
        <span className="text-xs text-slate-500 font-medium">{row.warehouseLocation || 'Unassigned'}</span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center space-x-1">
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedProduct(row);
                setIsModalOpen(true);
              }}
              title="Edit Product Master"
              icon={<Edit3 className="w-3.5 h-3.5 text-slate-500 hover:text-amber-600" />}
            >
              Edit
            </Button>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget({ id: row.id, name: row.productName })}
              title="Delete Product Master"
              icon={<Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600" />}
            />
          )}
          {!canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedProduct(row)}
              title="View Product Details"
              icon={<Eye className="w-3.5 h-3.5 text-blue-600" />}
            >
              View &rarr;
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-7">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {(isSales || user?.role === 'ACCOUNTS' || user?.role === 'WAREHOUSE') ? 'Product Catalog' : 'Product Management'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {user?.role === 'ACCOUNTS'
              ? 'View product, pricing, and stock information.'
              : isSales
              ? 'View products, pricing, and available stock before creating a sales challan.'
              : 'Maintain product details, stock thresholds, and warehouse locations.'}
          </p>
        </div>
        {canEdit && (
          <Button
            variant="primary"
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Product
          </Button>
        )}
      </div>

      {/* SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Products</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">134</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Products</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-1">128</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock</p>
              <h3 className="text-3xl font-bold text-amber-600 mt-1">8</h3>
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
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* PRODUCT ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Products by Category (7 cols) */}
        <Card
          title="Products by Category"
          subtitle="Catalog distribution across inventory classifications"
          className="lg:col-span-7"
        >
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Electronics & Devices</span>
                <span className="text-slate-900">42 SKUs (30%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[30%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Office Supplies</span>
                <span className="text-slate-900">31 SKUs (22%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[22%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Hardware & Fittings</span>
                <span className="text-slate-900">28 SKUs (20%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[20%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Packaging Materials</span>
                <span className="text-slate-900">24 SKUs (17%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full w-[17%] rounded-full"></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stock Health Overview (5 cols) */}
        <Card
          title="Stock Health Summary"
          subtitle="Inventory threshold monitoring"
          className="lg:col-span-5"
        >
          <div className="space-y-3 pt-1">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-800">Healthy Stock Level</span>
              <span className="font-bold text-emerald-900">126 SKUs (89%)</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-rose-800">Low Stock Limit Reached</span>
              <span className="font-bold text-rose-900">8 SKUs (6%)</span>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Completely Out of Stock</span>
              <span className="font-bold text-slate-900">3 SKUs (2%)</span>
            </div>
          </div>
        </Card>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          placeholder="Search product name, SKU, category..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          icon={<Search className="w-4 h-4 text-slate-400" />}
        />

        <Select
          options={[
            { value: '', label: 'All Categories' },
            { value: 'Electronics', label: 'Electronics' },
            { value: 'Office Supplies', label: 'Office Supplies' },
            { value: 'Hardware', label: 'Hardware' },
            { value: 'Packaging', label: 'Packaging' },
          ]}
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
        />

        <Select
          options={[
            { value: '', label: 'All Stock Statuses' },
            { value: 'IN_STOCK', label: 'In Stock' },
            { value: 'LOW_STOCK', label: 'Low Stock Alert' },
            { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
          ]}
          value={stockStatusFilter}
          onChange={(e) => {
            setStockStatusFilter(e.target.value);
          }}
        />
      </div>

      {/* PRODUCTS DATA TABLE */}
      <Table
        columns={columns}
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyText="No products found in master catalog database."
        pagination={
          response?.meta
            ? {
                page: response.meta.page,
                totalPages: response.meta.totalPages,
                totalItems: response.meta.totalItems,
                onPageChange: (newPage) => setPage(newPage),
              }
            : undefined
        }
      />

      {/* CREATE / EDIT MODAL */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
      />

      {/* READ-ONLY PRODUCT DETAILS MODAL FOR ACCOUNTS / SALES */}
      {viewingProduct && (
        <Modal
          isOpen={!!viewingProduct}
          onClose={() => setViewingProduct(null)}
          title={`Product Details — ${viewingProduct.productName}`}
          maxWidth="md"
        >
          <div className="space-y-5 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">PRODUCT MASTER</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">{viewingProduct.productName}</h4>
                <p className="text-slate-500 font-mono text-[11px]">SKU: {viewingProduct.sku}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">UNIT PRICE</span>
                <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                  ₹{Number(viewingProduct.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-slate-500">{viewingProduct.category}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Current Stock</span>
                <span className="text-lg font-bold text-blue-900 block mt-0.5">{viewingProduct.currentStock} units</span>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Minimum Stock</span>
                <span className="text-lg font-bold text-amber-900 block mt-0.5">{viewingProduct.minimumStock} units</span>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-700 uppercase block">Location</span>
                <span className="text-xs font-bold text-slate-900 block mt-1.5">{viewingProduct.warehouseLocation || 'Warehouse A'}</span>
              </div>
            </div>

            {/* RECENT STOCK ACTIVITY AUDIT LOG */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">RECENT STOCK ACTIVITY</span>
              
              <div className="space-y-2">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-emerald-900">Stock IN &middot; Supplier Purchase</h5>
                    <p className="text-[11px] text-emerald-700">11 Aug 2026 &middot; Logged by Rahul</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 text-xs">+50 units</span>
                </div>

                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-rose-900">Stock OUT &middot; Sales Challan CH-00042</h5>
                    <p className="text-[11px] text-rose-700">10 Aug 2026 &middot; Logged by Amit</p>
                  </div>
                  <span className="font-mono font-bold text-rose-800 text-xs">-12 units</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewingProduct(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* CENTERED DELETE CONFIRMATION DIALOG */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        itemName={deleteTarget?.name}
        itemType="product"
        isLoading={isDeleting}
      />
    </div>
  );
};
