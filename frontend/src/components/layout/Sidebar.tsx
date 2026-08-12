import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  Boxes,
  FileText,
  UserCheck,
  Building,
  BarChart3,
} from 'lucide-react';
import { Role } from '../../types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: Role[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const isAccounts = user?.role === 'ACCOUNTS';

  const defaultSections: NavSection[] = [
    {
      title: 'MAIN',
      items: [
        {
          label: 'Dashboard',
          path: '/dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
          roles: ['ADMIN', 'SALES', 'WAREHOUSE'],
        },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        {
          label: 'Customers CRM',
          path: '/customers',
          icon: <Users className="w-4 h-4" />,
          roles: ['ADMIN', 'SALES', 'WAREHOUSE'],
        },
        {
          label: 'Products Master',
          path: '/products',
          icon: <Package className="w-4 h-4" />,
          roles: ['ADMIN', 'SALES', 'WAREHOUSE'],
        },
        {
          label: 'Inventory & Stock',
          path: '/inventory',
          icon: <Boxes className="w-4 h-4" />,
          roles: ['ADMIN', 'SALES', 'WAREHOUSE'],
        },
        {
          label: 'Sales Challans',
          path: '/challans',
          icon: <FileText className="w-4 h-4" />,
          roles: ['ADMIN', 'SALES', 'WAREHOUSE'],
        },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        {
          label: 'Employee Management',
          path: '/users',
          icon: <UserCheck className="w-4 h-4" />,
          roles: ['ADMIN'],
        },
      ],
    },
  ];

  const accountsSections: NavSection[] = [
    {
      title: 'MAIN',
      items: [
        {
          label: 'Accounts Overview',
          path: '/accounts/dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
          roles: ['ACCOUNTS'],
        },
      ],
    },
    {
      title: 'RECORDS',
      items: [
        {
          label: 'Customers (Read-Only)',
          path: '/customers',
          icon: <Users className="w-4 h-4" />,
          roles: ['ACCOUNTS'],
        },
        {
          label: 'Products Catalog',
          path: '/products',
          icon: <Package className="w-4 h-4" />,
          roles: ['ACCOUNTS'],
        },
        {
          label: 'Stock Levels',
          path: '/inventory',
          icon: <Boxes className="w-4 h-4" />,
          roles: ['ACCOUNTS'],
        },
        {
          label: 'Sales Challans',
          path: '/challans',
          icon: <FileText className="w-4 h-4" />,
          roles: ['ACCOUNTS'],
        },
      ],
    },
    {
      title: 'REPORTING',
      items: [
        {
          label: 'Sales Overview',
          path: '/accounts/dashboard',
          icon: <BarChart3 className="w-4 h-4" />,
          roles: ['ACCOUNTS'],
        },
      ],
    },
  ];

  const sections = isAccounts ? accountsSections : defaultSections;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0 z-30">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slate-100 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
          <Building className="w-4 h-4" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 text-sm leading-tight tracking-tight">ApexERP</h1>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
            Operations Platform
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {sections.map((sec) => {
          const validItems = sec.items.filter((item) =>
            user ? item.roles.includes(user.role) : false
          );

          if (validItems.length === 0) return null;

          return (
            <div key={sec.title} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {sec.title}
              </div>
              {validItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}
      </div>

      {/* Footer / System Indicator */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="text-[11px] text-slate-400 text-center font-medium">
          Mini ERP & CRM System v1.0
        </div>
      </div>
    </aside>
  );
};
