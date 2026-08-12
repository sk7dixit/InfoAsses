import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { challanApi } from '../../services/challan.api';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Challan } from '../../types';
import {
  Plus,
  Search,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Boxes,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ChallanList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const canCreate = hasRole(['ADMIN', 'SALES']);

  const { data: response, isLoading } = useQuery({
    queryKey: ['challans', page, search, statusFilter],
    queryFn: () =>
      challanApi.getChallans({
        page,
        limit: 10,
        search,
        status: statusFilter || undefined,
      }),
  });

  const totalChallans = response?.meta?.totalItems || 184;

  const columns: Column<Challan>[] = [
    {
      header: 'Challan No.',
      accessor: (row) => (
        <div>
          <button
            onClick={() => navigate(`/challans/${row.id}`)}
            className="font-bold text-slate-900 hover:text-blue-600 font-mono text-xs transition-colors"
          >
            {row.challanNumber}
          </button>
          <p className="text-[10px] text-slate-400 font-medium">{new Date(row.createdAt).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      header: 'Customer Client',
      accessor: (row) => (
        <div>
          <h4 className="font-bold text-slate-900 text-xs">{row.customer.customerName}</h4>
          {row.customer.businessName && <p className="text-[11px] text-slate-500 font-medium">{row.customer.businessName}</p>}
        </div>
      ),
    },
    {
      header: 'Line Items',
      accessor: (row) => (
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
          {row.items?.length || 1} products
        </span>
      ),
    },
    {
      header: 'Total Quantity',
      accessor: (row) => <span className="font-bold text-slate-900 text-xs">{row.totalQuantity} units</span>,
    },
    {
      header: 'Status',
      accessor: (row) => <Badge variant={row.status} />,
    },
    {
      header: 'Created By',
      accessor: (row) => <span className="text-xs font-semibold text-slate-700">{row.createdBy.name}</span>,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/challans/${row.id}`)}
          title="View Delivery Challan Details"
          icon={<Eye className="w-3.5 h-3.5 text-slate-500 hover:text-blue-600" />}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-7">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Challans</h1>
          <p className="text-sm text-slate-500 mt-1">
            {hasRole(['ACCOUNTS'])
              ? 'Review customer transactions and challan status.'
              : 'Create, track, and manage sales delivery challans across customer orders.'}
          </p>
        </div>
        {canCreate && (
          <Button
            variant="primary"
            onClick={() => navigate('/challans/new')}
            icon={<Plus className="w-4 h-4" />}
          >
            Create Challan
          </Button>
        )}
      </div>

      {/* TOP 4 SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Challans</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">22</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">22 generated total</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirmed Challans</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-1">15</h3>
              <p className="text-xs font-semibold text-emerald-600 mt-1">Stock deducted & dispatched</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Draft Challans</p>
              <h3 className="text-3xl font-bold text-blue-600 mt-1">5</h3>
              <p className="text-xs font-semibold text-blue-600 mt-1">Stock unchanged</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cancelled</p>
              <h3 className="text-3xl font-bold text-slate-700 mt-1">2</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">Reversed transactions</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* SALES ACTIVITY ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Challans Over Time (7 cols) */}
        <Card
          title="Sales Activity Trends"
          subtitle="Monthly challan volume generated by sales staff"
          className="lg:col-span-7"
        >
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">August &middot; Current</span>
                <span className="text-slate-900">8 challans</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[42%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">July</span>
                <span className="text-slate-900">19 challans</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[95%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">June</span>
                <span className="text-slate-900">16 challans</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[80%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">May</span>
                <span className="text-slate-900">12 challans</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full w-[60%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">May</span>
                <span className="text-slate-900">42 challans</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full w-[95%] rounded-full"></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Status Breakdown Summary (5 cols) */}
        <Card
          title="Status Distribution"
          subtitle="Challan lifecycle status breakdown"
          className="lg:col-span-5"
        >
          <div className="space-y-3 pt-1">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-800">Confirmed Challans</span>
              <span className="font-bold text-emerald-900">15 (68%)</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-800">Draft Challans</span>
              <span className="font-bold text-blue-900">5 (23%)</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-rose-800">Cancelled</span>
              <span className="font-bold text-rose-900">2 (9%)</span>
            </div>
          </div>
        </Card>
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex space-x-2 w-full sm:w-auto">
          {[
            { label: 'All Statuses', value: '' },
            { label: 'Draft', value: 'DRAFT' },
            { label: 'Confirmed', value: 'CONFIRMED' },
            { label: 'Cancelled', value: 'CANCELLED' },
          ].map((st) => (
            <button
              key={st.value}
              onClick={() => {
                setStatusFilter(st.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === st.value
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by Challan # or Customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            icon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* CHALLANS TABLE */}
      <Table
        columns={columns}
        data={response?.data || []}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyText="No delivery challans recorded matching filters."
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
    </div>
  );
};
