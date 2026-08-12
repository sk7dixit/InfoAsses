import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { challanApi } from '../../services/challan.api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Activity,
  ArrowRight,
  Calendar,
  Layers,
} from 'lucide-react';

export const AccountsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('THIS_MONTH');

  const { data: challansRes, isLoading: loadingChallans } = useQuery({
    queryKey: ['accounts-challans-dashboard', dateRange],
    queryFn: () => challanApi.getChallans({ limit: 5 }),
  });

  const recentChallans = challansRes?.data || [];

  return (
    <div className="space-y-7">
      {/* HEADER WITH DATE RANGE FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Accounts Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review operational records and recent business activity.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-center">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">Period:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="TODAY">Today</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month</option>
              <option value="LAST_MONTH">Last Month</option>
              <option value="THIS_QUARTER">This Quarter</option>
              <option value="ALL_TIME">All Time</option>
            </select>
          </div>

          <span className="px-3 py-2 bg-teal-50 border border-teal-200 text-teal-700 font-bold text-xs rounded-xl hidden md:inline-block">
            Read-Only Audit Portal
          </span>
        </div>
      </div>

      {/* TOP 4 COHERENT CHALLAN LIFECYCLE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Challans</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">22</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">All sales challans</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirmed Challans</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-1">15</h3>
              <p className="text-xs font-semibold text-emerald-600 mt-1">Confirmed transactions</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Draft Challans</p>
              <h3 className="text-3xl font-bold text-amber-600 mt-1">5</h3>
              <p className="text-xs font-semibold text-amber-600 mt-1">Awaiting confirmation</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cancelled</p>
              <h3 className="text-3xl font-bold text-rose-600 mt-1">2</h3>
              <p className="text-xs font-semibold text-rose-600 mt-1">Cancelled transactions</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* CHALLAN ACTIVITY & CHALLAN STATUS INTERACTIVE BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Challan Activity Chart (7 cols) */}
        <Card
          title="Challan Activity"
          subtitle="Confirmed challan activity over time"
          className="lg:col-span-7"
        >
          <div className="space-y-3.5 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">August &middot; Current</span>
                <span className="text-amber-600 font-bold">8 challans</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[42%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">July</span>
                <span className="text-blue-600 font-bold">19 challans</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[100%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">June</span>
                <span className="text-emerald-600 font-bold">16 challans</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[84%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">May</span>
                <span className="text-purple-600 font-bold">12 challans</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full w-[63%] rounded-full"></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Challan Status Breakdown with Click Navigation (5 cols) */}
        <Card
          title="Challan Status"
          subtitle="Sales record status distribution (Click to filter)"
          className="lg:col-span-5"
        >
          <div className="space-y-3 pt-1">
            <button
              onClick={() => navigate('/challans?status=CONFIRMED')}
              className="w-full p-3 bg-emerald-50 hover:bg-emerald-100/70 rounded-xl border border-emerald-100 flex items-center justify-between text-xs transition-colors text-left"
            >
              <div>
                <span className="font-bold text-emerald-900 block">Confirmed Challans</span>
                <span className="text-[10px] text-emerald-700">Dispatched & stock deducted &rarr;</span>
              </div>
              <span className="font-extrabold text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-subtle">
                15 (68%)
              </span>
            </button>

            <button
              onClick={() => navigate('/challans?status=DRAFT')}
              className="w-full p-3 bg-amber-50 hover:bg-amber-100/70 rounded-xl border border-amber-100 flex items-center justify-between text-xs transition-colors text-left"
            >
              <div>
                <span className="font-bold text-amber-900 block">Draft Challans</span>
                <span className="text-[10px] text-amber-700">Pending confirmation &rarr;</span>
              </div>
              <span className="font-extrabold text-amber-900 bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-subtle">
                5 (23%)
              </span>
            </button>

            <button
              onClick={() => navigate('/challans?status=CANCELLED')}
              className="w-full p-3 bg-rose-50 hover:bg-rose-100/70 rounded-xl border border-rose-100 flex items-center justify-between text-xs transition-colors text-left"
            >
              <div>
                <span className="font-bold text-rose-900 block">Cancelled Challans</span>
                <span className="text-[10px] text-rose-700">Reversed transactions &rarr;</span>
              </div>
              <span className="font-extrabold text-rose-900 bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-subtle">
                2 (9%)
              </span>
            </button>
          </div>
        </Card>

      </div>

      {/* RECENT CHALLANS & RECENT OPERATIONS AUDIT FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Challans (7 cols) */}
        <Card
          title="Recent Challans"
          subtitle="Latest 5 generated delivery challans"
          className="lg:col-span-7"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/challans')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              View All &rarr;
            </Button>
          }
        >
          {loadingChallans ? (
            <div className="p-6 text-center">
              <Spinner />
            </div>
          ) : recentChallans.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No sales challans recorded.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {recentChallans.map((challan) => (
                <div
                  key={challan.id}
                  onClick={() => navigate(`/challans/${challan.id}`)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs font-mono">{challan.challanNumber}</span>
                      <Badge variant={challan.status} />
                    </div>
                    <p className="text-slate-500 mt-0.5">
                      Client: <span className="font-semibold text-slate-700">{challan.customer.customerName}</span> ({challan.totalQuantity} units)
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-slate-400 text-[11px] block">
                      {new Date(challan.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[11px] text-blue-600 font-bold hover:underline">View Record &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Activity Audit Feed (5 cols) */}
        <Card
          title="Recent Activity"
          subtitle="Latest updates across sales and inventory records"
          className="lg:col-span-5"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/challans')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              View All Activity &rarr;
            </Button>
          }
        >
          <div className="space-y-2.5 pt-1 text-xs">
            <div
              onClick={() => navigate('/challans')}
              className="p-3 bg-emerald-50/70 hover:bg-emerald-100/70 rounded-xl border border-emerald-100 flex items-start space-x-3 cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold mt-0.5">
                ✓
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">Challan Confirmed</h4>
                  <span className="text-[10px] text-slate-400">11:42 AM</span>
                </div>
                <p className="text-slate-600 text-[11px] font-medium">CH-000022 &middot; Raj Electronics</p>
                <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">By Amit Sharma</span>
              </div>
            </div>

            <div
              onClick={() => navigate('/inventory')}
              className="p-3 bg-rose-50/70 hover:bg-rose-100/70 rounded-xl border border-rose-100 flex items-start space-x-3 cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-bold mt-0.5">
                ↗
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">Stock OUT</h4>
                  <span className="text-[10px] text-slate-400">11:31 AM</span>
                </div>
                <p className="text-slate-600 text-[11px] font-medium">Mechanical Keyboard &middot; 5 units</p>
                <span className="text-[10px] text-rose-800 font-semibold block mt-0.5">By Rahul Sharma (Sales Challan CH-000022)</span>
              </div>
            </div>

            <div
              onClick={() => navigate('/challans')}
              className="p-3 bg-amber-50/70 hover:bg-amber-100/70 rounded-xl border border-amber-100 flex items-start space-x-3 cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold mt-0.5">
                📝
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">Challan Created (Draft)</h4>
                  <span className="text-[10px] text-slate-400">10:52 AM</span>
                </div>
                <p className="text-slate-600 text-[11px] font-medium">CH-000021 &middot; ABC Distributors</p>
                <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">By Amit Sharma</span>
              </div>
            </div>

            <div
              onClick={() => navigate('/inventory')}
              className="p-3 bg-blue-50/70 hover:bg-blue-100/70 rounded-xl border border-blue-100 flex items-start space-x-3 cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold mt-0.5">
                ↘
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">Stock IN</h4>
                  <span className="text-[10px] text-slate-400">10:15 AM</span>
                </div>
                <p className="text-slate-600 text-[11px] font-medium">Wireless Mouse &middot; 50 units (Supplier Purchase)</p>
                <span className="text-[10px] text-blue-800 font-semibold block mt-0.5">By Rahul Sharma</span>
              </div>
            </div>

            <div
              onClick={() => navigate('/customers')}
              className="p-3 bg-purple-50/70 hover:bg-purple-100/70 rounded-xl border border-purple-100 flex items-start space-x-3 cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold mt-0.5">
                👤
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">Customer Profile Updated</h4>
                  <span className="text-[10px] text-slate-400">09:30 AM</span>
                </div>
                <p className="text-slate-600 text-[11px] font-medium">Sharma General Store &middot; Business Info</p>
                <span className="text-[10px] text-purple-800 font-semibold block mt-0.5">By Admin</span>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};
