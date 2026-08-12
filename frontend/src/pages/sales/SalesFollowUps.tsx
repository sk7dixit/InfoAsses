import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { customerApi } from '../../services/customer.api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Phone,
  Search,
  Plus,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';

export const SalesFollowUps: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('TODAY');
  const [search, setSearch] = useState('');

  const { data: customersRes, isLoading } = useQuery({
    queryKey: ['sales-followups'],
    queryFn: () => customerApi.getCustomers({ limit: 50 }),
  });

  const customers = customersRes?.data || [];

  // Filter follow-up items
  const followUpItems = [
    { id: '1', name: 'Rajesh Sharma', company: 'Sharma General Store', mobile: '+91 98765 12345', type: 'Retail', date: 'Today · 11:30 AM', note: 'Call regarding bulk mechanical keyboard pricing and quantity discount.', status: 'DUE TODAY' },
    { id: '2', name: 'Amit Sharma', company: 'Amit Traders Corp', mobile: '+91 98765 23456', type: 'Wholesale', date: 'Today · 02:15 PM', note: 'Confirm sales delivery challan CH-00042 line items.', status: 'DUE TODAY' },
    { id: '3', name: 'Global Distro Corp', company: 'Global Distributors', mobile: '+91 98765 34567', type: 'Distributor', date: '10 Aug 2026', note: 'Follow up on wholesale order enquiry and delivery schedule.', status: 'OVERDUE' },
    { id: '4', name: 'Suresh Patel', company: 'Patel Electronics', mobile: '+91 98765 45678', type: 'Wholesale', date: '15 Aug 2026', note: 'Schedule quarterly product demo for UltraWide monitors.', status: 'THIS WEEK' },
    { id: '5', name: 'Vikram Mehta', company: 'Mehta Logistics', mobile: '+91 98765 56789', type: 'Distributor', date: '08 Aug 2026', note: 'Sent revised product price sheet. Awaiting PO confirmation.', status: 'COMPLETED' },
  ];

  return (
    <div className="space-y-7 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Customer Follow-ups
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage scheduled customer conversations and next actions.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/customers')}
          icon={<Plus className="w-4 h-4" />}
        >
          Manage Customers CRM
        </Button>
      </div>

      {/* TOP 4 SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Due Today</p>
              <h3 className="text-3xl font-bold text-amber-600 mt-1">4</h3>
              <p className="text-xs font-semibold text-amber-600 mt-1">Priority touchpoints</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">This Week</p>
              <h3 className="text-3xl font-bold text-blue-600 mt-1">8</h3>
              <p className="text-xs font-semibold text-blue-600 mt-1">Scheduled calls</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overdue</p>
              <h3 className="text-3xl font-bold text-rose-600 mt-1">3</h3>
              <p className="text-xs font-semibold text-rose-600 mt-1">Requires attention</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-1">26</h3>
              <p className="text-xs font-semibold text-emerald-600 mt-1">Completed this month</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* SEARCH BAR & FILTER TABS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex space-x-2 w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Tasks' },
            { id: 'TODAY', label: 'Due Today' },
            { id: 'OVERDUE', label: 'Overdue' },
            { id: 'COMPLETED', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search customer or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* FOLLOW-UPS TABLE */}
      <Card title="Scheduled Touchpoints Task List" subtitle="Log conversation notes and manage next touchpoint commitments">
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Customer Client</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Follow-up Note / Purpose</th>
                <th className="px-4 py-3">Scheduled Date</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {followUpItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <p className="text-[11px] text-slate-500">{item.company}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{item.mobile}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs">{item.note}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{item.date}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                      item.status === 'OVERDUE'
                        ? 'bg-rose-100 text-rose-700'
                        : item.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/customers')}
                      icon={<MessageSquare className="w-3.5 h-3.5 text-blue-600" />}
                    >
                      Log Note
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
