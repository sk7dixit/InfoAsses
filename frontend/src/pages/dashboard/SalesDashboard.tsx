import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { customerApi } from '../../services/customer.api';
import { challanApi } from '../../services/challan.api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import {
  Users,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Phone,
  Building,
} from 'lucide-react';

export const SalesDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: customersRes, isLoading: loadingCustomers } = useQuery({
    queryKey: ['sales-customers'],
    queryFn: () => customerApi.getCustomers({ limit: 10 }),
  });

  const { data: challansRes, isLoading: loadingChallans } = useQuery({
    queryKey: ['sales-challans'],
    queryFn: () => challanApi.getChallans({ limit: 5 }),
  });

  const totalMyCustomers = customersRes?.meta?.totalItems || 15;
  const recentChallans = challansRes?.data || [];

  return (
    <div className="space-y-7">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sales Workspace
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your customer accounts, follow-ups, and sales challans in one place.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/challans/new')}
          icon={<Plus className="w-4 h-4" />}
        >
          Create Challan
        </Button>
      </div>

      {/* TOP 4 SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Customers</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalMyCustomers}</h3>
              <p className="text-xs font-semibold text-blue-600 mt-1">11 active &middot; 4 leads</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Follow-ups Due</p>
              <h3 className="text-3xl font-bold text-amber-600 mt-1">7</h3>
              <p className="text-xs font-semibold text-amber-600 mt-1">4 scheduled today</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Draft Challans</p>
              <h3 className="text-3xl font-bold text-purple-600 mt-1">3</h3>
              <p className="text-xs font-semibold text-purple-600 mt-1">Stock unchanged</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirmed Challans</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-1">28</h3>
              <p className="text-xs font-semibold text-emerald-600 mt-1">Confirmed this month</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* TODAY'S FOLLOW-UPS & RECENT CHALLANS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's Follow-ups (7 cols) */}
        <Card
          title="Today's Follow-ups"
          subtitle="Priority touchpoints scheduled for today"
          className="lg:col-span-7"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/sales/follow-ups')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              All Follow-ups
            </Button>
          }
        >
          <div className="space-y-3 pt-2">
            {[
              { id: 'c1', name: 'Rajesh Sharma', company: 'Sharma General Store', time: 'Today &middot; 11:30 AM', purpose: 'Product discussion', status: 'DUE' },
              { id: 'c2', name: 'Amit Traders', company: 'Amit Traders Corp', time: 'Today &middot; 02:15 PM', purpose: 'Confirm delivery requirement', status: 'DUE' },
              { id: 'c3', name: 'Global Distro', company: 'Global Distributors', time: 'Overdue &middot; 10 Aug', purpose: 'Follow up on wholesale requirement', status: 'OVERDUE' },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <span className="text-slate-400 font-medium">&middot;</span>
                    <span className="text-slate-600 font-semibold">{item.company}</span>
                  </div>
                  <p className="text-slate-500 font-medium">{item.purpose}</p>
                  <span className="text-[11px] text-amber-700 font-semibold block" dangerouslySetInnerHTML={{ __html: item.time }}></span>
                </div>
                <div className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/customers')}
                  >
                    View Customer &rarr;
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* My Recent Challans (5 cols) */}
        <Card
          title="My Recent Challans"
          subtitle="Latest sales delivery challans"
          className="lg:col-span-5"
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
              {recentChallans.slice(0, 4).map((challan) => (
                <div
                  key={challan.id}
                  onClick={() => navigate(`/challans/${challan.id}`)}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div>
                    <span className="font-bold text-slate-900 text-xs font-mono">{challan.challanNumber}</span>
                    <p className="text-slate-500 font-medium text-[11px] mt-0.5">{challan.customer.customerName}</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <Badge variant={challan.status} />
                    <span className="text-[10px] text-slate-400 block">{challan.totalQuantity} units</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};
