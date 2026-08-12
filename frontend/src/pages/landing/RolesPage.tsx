import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Boxes, Activity, ArrowRight } from 'lucide-react';
import { PublicLayout } from '../../components/layout/PublicLayout';

export const RolesPage: React.FC = () => {
  const navigate = useNavigate();

  const roleData = [
    {
      role: 'Admin',
      icon: ShieldCheck,
      responsibility: 'Manage users and system settings',
      access: 'Full system access',
    },
    {
      role: 'Sales',
      icon: Users,
      responsibility: 'Manage customers, follow-ups and challans',
      access: 'CRM and sales operations',
    },
    {
      role: 'Warehouse',
      icon: Boxes,
      responsibility: 'Manage products and stock movements',
      access: 'Inventory operations',
    },
    {
      role: 'Accounts',
      icon: Activity,
      responsibility: 'Review business records and challans',
      access: 'Read-only records',
    },
  ];

  return (
    <PublicLayout>
      <section className="relative z-10 py-12 px-6 max-w-5xl mx-auto">
        {/* Page Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            One system. Different responsibilities.
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Each team gets access to the work they are responsible for.
          </p>
        </div>

        {/* Clean Role Matrix Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Responsibility</th>
                <th className="py-4 px-6">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {roleData.map((r) => {
                const IconComponent = r.icon;
                return (
                  <tr key={r.role} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center space-x-2">
                      <IconComponent className="w-4 h-4 text-slate-700" />
                      <span>{r.role}</span>
                    </td>
                    <td className="py-4 px-6">{r.responsibility}</td>
                    <td className="py-4 px-6 font-medium text-slate-600">{r.access}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 pt-8 border-t border-slate-200/80">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors inline-flex items-center space-x-2"
          >
            <span>Log in with Demo Credentials</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </section>
    </PublicLayout>
  );
};
