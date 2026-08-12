import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { customerApi } from '../../services/customer.api';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { CustomerFormModal } from './CustomerFormModal';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import { Customer } from '../../types';
import {
  UserPlus,
  Search,
  Eye,
  Edit3,
  Trash2,
  Phone,
  Mail,
  Calendar,
  Users,
  UserCheck,
  Clock,
  AlertCircle,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CustomerList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const canEdit = hasRole(['ADMIN', 'SALES']);
  const canDelete = hasRole(['ADMIN']);

  const { data: response, isLoading } = useQuery({
    queryKey: ['customers', page, search, statusFilter, typeFilter],
    queryFn: () =>
      customerApi.getCustomers({
        page,
        limit: 10,
        search,
        status: statusFilter || undefined,
        customerType: typeFilter || undefined,
      }),
  });

  const { data: upcomingFollowUpsRes } = useQuery({
    queryKey: ['upcoming-followups'],
    queryFn: () => customerApi.getUpcomingFollowUps(5),
  });

  const totalCustomers = response?.meta?.totalItems || 186;
  const upcomingFollowUps = upcomingFollowUpsRes?.data || [];

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await customerApi.deleteCustomer(deleteTarget.id);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setDeleteTarget(null);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Customer>[] = [
    {
      header: 'Customer',
      accessor: (row) => (
        <div>
          <button
            onClick={() => navigate(`/customers/${row.id}`)}
            className="font-bold text-slate-900 hover:text-blue-600 text-left transition-colors text-xs"
          >
            {row.customerName}
          </button>
          {row.email && <p className="text-[11px] text-slate-400 font-normal">{row.email}</p>}
        </div>
      ),
    },
    {
      header: 'Business',
      accessor: (row) => (
        <div className="text-xs">
          <p className="font-semibold text-slate-800">{row.businessName || '—'}</p>
          {row.gstNumber && <p className="text-[10px] text-slate-400 font-mono">GST: {row.gstNumber}</p>}
        </div>
      ),
    },
    {
      header: 'Type & Status',
      accessor: (row) => (
        <div className="flex flex-col space-y-1">
          <div>
            <Badge variant={row.status} />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{row.customerType}</span>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: (row) => (
        <div className="text-xs text-slate-600">
          <div className="flex items-center space-x-1 font-semibold text-slate-800">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{row.mobile}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Next Follow-up',
      accessor: (row) => (
        <div className="text-xs">
          {row.followUpDate ? (
            <span className="inline-flex items-center space-x-1 text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(row.followUpDate).toLocaleDateString()}</span>
            </span>
          ) : (
            <span className="text-slate-400 font-medium">None scheduled</span>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/customers/${row.id}`)}
            title="View Details & Follow-up History"
            icon={<Eye className="w-3.5 h-3.5 text-slate-500 hover:text-blue-600" />}
          >
            View
          </Button>
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCustomer(row);
                setIsModalOpen(true);
              }}
              title="Edit Customer"
              icon={<Edit3 className="w-3.5 h-3.5 text-slate-500 hover:text-amber-600" />}
            >
              Edit
            </Button>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget({ id: row.id, name: row.customerName })}
              title="Delete Customer"
              icon={<Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />}
            />
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer CRM</h1>
          <p className="text-sm text-slate-500 mt-1">
            {hasRole(['ACCOUNTS'])
              ? 'Review customer information and business details.'
              : 'Manage customer information, relationships, and scheduled follow-up touchpoints.'}
          </p>
        </div>
        {canEdit && (
          <Button
            variant="primary"
            onClick={() => {
              setSelectedCustomer(null);
              setIsModalOpen(true);
            }}
            icon={<UserPlus className="w-4 h-4" />}
          >
            Add Customer
          </Button>
        )}
      </div>

      {/* TOP 4 MAIN KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Customers</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalCustomers}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Accounts</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-1">10</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prospect Leads</p>
              <h3 className="text-3xl font-bold text-purple-600 mt-1">4</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Follow-ups Due</p>
              <h3 className="text-3xl font-bold text-amber-600 mt-1">3</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* CRM ANALYTICS & FOLLOW-UP WATCHLIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customer Distribution by Type & Status (7 cols) */}
        <Card
          title="Customer Overview"
          subtitle="Breakdown by business account type & pipeline status"
          className="lg:col-span-7"
        >
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Customers by Type</span>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700">Wholesale</span>
                    <span className="text-slate-900">6 (40%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[40%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700">Retail Buyers</span>
                    <span className="text-slate-900">5 (33%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full w-[33%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700">Distributors</span>
                    <span className="text-slate-900">4 (27%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full w-[27%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-l border-slate-100 pl-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Customers by Status</span>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-emerald-700">Active Accounts</span>
                    <span className="text-slate-900">10 (67%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[67%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-blue-700">Leads & Prospects</span>
                    <span className="text-slate-900">4 (27%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[27%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-500">Inactive</span>
                    <span className="text-slate-900">1 (6%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-400 h-full w-[6%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Follow-up Touchpoint Watchlist (5 cols) */}
        <Card
          title="Scheduled Touchpoints"
          subtitle="Upcoming CRM follow-up commitments"
          className="lg:col-span-5"
        >
          <div className="grid grid-cols-3 gap-2 text-center mb-4">
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-[10px] font-bold uppercase text-amber-700">Due Today</span>
              <p className="text-lg font-bold text-amber-900">4</p>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-[10px] font-bold uppercase text-blue-700">This Week</span>
              <p className="text-lg font-bold text-blue-900">8</p>
            </div>
            <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100">
              <span className="text-[10px] font-bold uppercase text-rose-700">Overdue</span>
              <p className="text-lg font-bold text-rose-900">3</p>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {upcomingFollowUps.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/customers/${c.id}`)}
                className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900">{c.customerName}</p>
                  <p className="text-[10px] text-slate-500">{c.businessName || c.mobile}</p>
                </div>
                <span className="font-semibold text-blue-600 text-[11px]">
                  {new Date(c.followUpDate!).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          placeholder="Search by customer name, business, mobile, email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          icon={<Search className="w-4 h-4 text-slate-400" />}
        />

        <Select
          options={[
            { value: '', label: 'All Customer Types' },
            { value: 'RETAIL', label: 'Retail' },
            { value: 'WHOLESALE', label: 'Wholesale' },
            { value: 'DISTRIBUTOR', label: 'Distributor' },
          ]}
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
        />

        <Select
          options={[
            { value: '', label: 'All Account Statuses' },
            { value: 'LEAD', label: 'Lead' },
            { value: 'ACTIVE', label: 'Active Account' },
            { value: 'INACTIVE', label: 'Inactive' },
          ]}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* CUSTOMERS DATA TABLE */}
      <Table
        columns={columns}
        data={response?.data || []}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyText="No CRM customers match your search filters."
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
      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['customers'] })}
      />

      {/* CENTERED DELETE CONFIRMATION DIALOG */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Customer"
        itemName={deleteTarget?.name}
        itemType="customer"
        isLoading={isDeleting}
      />
    </div>
  );
};
