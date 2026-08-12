import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Building,
  LayoutDashboard,
  Users,
  Calendar,
  Package,
  Boxes,
  FileText,
  UserCheck,
  Bell,
  Settings,
  User as UserIcon,
  LogOut,
  CheckCircle2,
  Shield,
  X,
  Lock,
  Key,
} from 'lucide-react';
import { Role } from '../../types';
import { UserPreferencesModal } from './UserPreferencesModal';

interface NavModule {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: Role[];
}

import { INITIAL_NOTIFICATIONS, AppNotification } from '../../services/notification.service';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showSalesSettingsModal, setShowSalesSettingsModal] = useState(false);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  // Notification Feed State
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState<string>('ALL');

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter notifications by user role & tab
  const roleNotifications = notifications.filter((n) => user && n.roles.includes(user.role));
  const unreadCount = roleNotifications.filter((n) => !n.read).length;
  const actionRequiredCount = roleNotifications.filter(
    (n) => n.category === 'ACTION' || n.category === 'CRITICAL' || n.category === 'APPROVAL'
  ).length;

  const filteredNotifications = roleNotifications.filter((n) => {
    if (notifFilter === 'ALL') return true;
    if (notifFilter === 'ACTION') return n.category === 'ACTION' || n.category === 'CRITICAL' || n.category === 'APPROVAL';
    
    // Role-specific secondary & tertiary tabs
    if (user?.role === 'ADMIN') {
      if (notifFilter === 'SECURITY') return n.category === 'SECURITY';
      if (notifFilter === 'SYSTEM') return n.category === 'SYSTEM';
    } else if (user?.role === 'SALES') {
      if (notifFilter === 'ORDERS') return n.category === 'SALES' || n.category === 'ORDER';
      if (notifFilter === 'CUSTOMERS') return n.category === 'CUSTOMER' || n.category === 'PAYMENT';
    } else if (user?.role === 'ACCOUNTS') {
      if (notifFilter === 'PAYMENTS') return n.category === 'PAYMENT';
      if (notifFilter === 'INVOICES') return n.category === 'INVOICE' || n.category === 'EXPENSE';
    } else if (user?.role === 'WAREHOUSE') {
      if (notifFilter === 'STOCK') return n.category === 'STOCK' || n.category === 'INVENTORY';
      if (notifFilter === 'ORDERS') return n.category === 'ORDER';
    }
    return true;
  });

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (user && n.roles.includes(user.role) ? { ...n, read: true } : n))
    );
  };

  const handleNotifClick = (notif: AppNotification) => {
    setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
    setShowNotifMenu(false);
    navigate(notif.targetPath);
  };

  // All module definitions
  const modules: NavModule[] = [
    {
      id: 'dashboard-admin',
      label: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: ['ADMIN'],
    },
    {
      id: 'dashboard-sales',
      label: 'Sales Dashboard',
      path: '/sales/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: ['SALES'],
    },
    {
      id: 'dashboard-accounts',
      label: 'Accounts Overview',
      path: '/accounts/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: ['ACCOUNTS'],
    },
    {
      id: 'dashboard-warehouse',
      label: 'Warehouse Dashboard',
      path: '/warehouse/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: ['WAREHOUSE'],
    },
    {
      id: 'customers',
      label: user?.role === 'ACCOUNTS' ? 'Customers' : 'Customers CRM',
      path: '/customers',
      icon: <Users className="w-4 h-4" />,
      roles: ['ADMIN', 'SALES', 'ACCOUNTS'],
    },
    {
      id: 'followups-sales',
      label: 'Follow-ups Queue',
      path: '/sales/follow-ups',
      icon: <Calendar className="w-4 h-4" />,
      roles: ['SALES'],
    },
    {
      id: 'products',
      label: user?.role === 'ACCOUNTS' ? 'Products' : 'Products Master',
      path: '/products',
      icon: <Package className="w-4 h-4" />,
      roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'],
    },
    {
      id: 'inventory',
      label: user?.role === 'ACCOUNTS' ? 'Inventory & Stock' : 'Inventory & Stock',
      path: '/inventory',
      icon: <Boxes className="w-4 h-4" />,
      roles: ['ADMIN', 'WAREHOUSE', 'ACCOUNTS'],
    },
    {
      id: 'challans',
      label: user?.role === 'ACCOUNTS' ? 'Sales Delivery Challans' : 'Sales Delivery Challans',
      path: '/challans',
      icon: <FileText className="w-4 h-4" />,
      roles: ['ADMIN', 'SALES', 'ACCOUNTS'],
    },
    {
      id: 'employees',
      label: 'Employee Management',
      path: '/users',
      icon: <UserCheck className="w-4 h-4" />,
      roles: ['ADMIN'],
    },
  ];

  // Filter modules valid for current user's role
  const userModules = modules.filter((m) => (user ? m.roles.includes(user.role) : false));

  // Get user initials for avatar
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'US';

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-card">
      
      {/* LEFT: BRAND & SUBTITLE */}
      <div className="flex items-center space-x-3 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
          <Building className="w-4 h-4" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 text-sm leading-none tracking-tight">ApexERP</h1>
          <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider mt-0.5">
            Operations Platform
          </span>
        </div>
      </div>

      {/* CENTER: ROLE-BASED ICON MODULE NAVIGATION WITH TOOLTIPS */}
      {user && (
        <nav className="flex items-center space-x-2 sm:space-x-3 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
          {userModules.map((mod) => {
            const isActive = location.pathname === mod.path || (mod.path !== '/dashboard' && location.pathname.startsWith(mod.path));
            const isHovered = hoveredModule === mod.id;

            return (
              <div key={mod.id} className="relative group">
                <NavLink
                  to={mod.path}
                  onMouseEnter={() => setHoveredModule(mod.id)}
                  onMouseLeave={() => setHoveredModule(null)}
                  className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center relative transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-subtle'
                  }`}
                >
                  {mod.icon}
                  {isActive && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  )}
                </NavLink>

                {/* Smooth Hover Tooltip (~150ms) */}
                {isHovered && (
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-150">
                    <div className="bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap">
                      {mod.label}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      )}

      {/* RIGHT: UTILITIES (BELL, SETTINGS, CIRCULAR AVATAR) */}
      {user && (
        <div className="flex items-center space-x-3 shrink-0">
          
          {/* NOTIFICATIONS BELL */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="w-9 h-9 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl py-3 z-50 text-xs">
                {/* Header */}
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between font-bold text-slate-900">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Filter Tabs Dynamic per Role */}
                <div className="px-3 pt-2.5 pb-2 border-b border-slate-100 flex items-center space-x-1 overflow-x-auto text-[11px]">
                  <button
                    onClick={() => setNotifFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                      notifFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All ({roleNotifications.length})
                  </button>

                  <button
                    onClick={() => setNotifFilter('ACTION')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 flex items-center space-x-1 ${
                      notifFilter === 'ACTION' ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    <span>Action Required</span>
                    {actionRequiredCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-rose-200 text-rose-900 font-extrabold text-[9px] flex items-center justify-center">
                        {actionRequiredCount}
                      </span>
                    )}
                  </button>

                  {/* Secondary & Tertiary Role-Tailored Tabs */}
                  {user?.role === 'ADMIN' && (
                    <>
                      <button
                        onClick={() => setNotifFilter('SECURITY')}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                          notifFilter === 'SECURITY' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-50'
                        }`}
                      >
                        Security
                      </button>
                      <button
                        onClick={() => setNotifFilter('SYSTEM')}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                          notifFilter === 'SYSTEM' ? 'bg-slate-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        System
                      </button>
                    </>
                  )}

                  {user?.role === 'SALES' && (
                    <>
                      <button
                        onClick={() => setNotifFilter('ORDERS')}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                          notifFilter === 'ORDERS' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        Orders
                      </button>
                      <button
                        onClick={() => setNotifFilter('CUSTOMERS')}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                          notifFilter === 'CUSTOMERS' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-50'
                        }`}
                      >
                        Customers
                      </button>
                    </>
                  )}

                  {user?.role === 'ACCOUNTS' && (
                    <>
                      <button
                        onClick={() => setNotifFilter('PAYMENTS')}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                          notifFilter === 'PAYMENTS' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        Payments
                      </button>
                      <button
                        onClick={() => setNotifFilter('INVOICES')}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                          notifFilter === 'INVOICES' ? 'bg-purple-600 text-white' : 'text-purple-700 hover:bg-purple-50'
                        }`}
                      >
                        Invoices
                      </button>
                    </>
                  )}

                  {user?.role === 'WAREHOUSE' && (
                    <>
                      <button
                        onClick={() => setNotifFilter('STOCK')}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                          notifFilter === 'STOCK' ? 'bg-amber-600 text-white' : 'text-amber-700 hover:bg-amber-50'
                        }`}
                      >
                        Stock
                      </button>
                      <button
                        onClick={() => setNotifFilter('ORDERS')}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                          notifFilter === 'ORDERS' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-50'
                        }`}
                      >
                        Orders
                      </button>
                    </>
                  )}
                </div>

                {/* Notifications List */}
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No notifications in this section.
                    </div>
                  ) : (
                    filteredNotifications.map((n) => {
                      const categoryDot =
                        n.category === 'ACTION' || n.category === 'CRITICAL'
                          ? 'bg-rose-500'
                          : n.category === 'APPROVAL'
                          ? 'bg-amber-500'
                          : n.category === 'SALES' || n.category === 'PAYMENT' || n.category === 'INVENTORY'
                          ? 'bg-emerald-500'
                          : n.category === 'CUSTOMER' || n.category === 'INVOICE' || n.category === 'STOCK'
                          ? 'bg-amber-400'
                          : n.category === 'SECURITY' || n.category === 'ORDER'
                          ? 'bg-blue-500'
                          : n.category === 'EXPENSE'
                          ? 'bg-purple-500'
                          : 'bg-slate-400';

                      return (
                        <div
                          key={n.id}
                          onClick={() => handleNotifClick(n)}
                          className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3 ${
                            !n.read ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${categoryDot} shrink-0 mt-1.5`}></span>
                          <div className="flex-1 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <h5 className={`font-bold text-xs ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                {n.title}
                              </h5>
                              <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug">{n.message}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SETTINGS GEAR */}
          <button
            onClick={() => {
              if (user.role === 'ADMIN') {
                navigate('/admin/settings');
              } else {
                setShowSalesSettingsModal(true);
              }
            }}
            className="w-9 h-9 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors"
            title="User Preferences & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* CIRCULAR PROFILE AVATAR BUTTON */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-sm hover:scale-105 transition-transform"
              title={`${user.name} (${user.role})`}
            >
              {userInitials}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-slate-200 shadow-xl py-3 z-50 text-xs">
                <div className="px-4 py-2.5 border-b border-slate-100 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{user.name}</h4>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {user.role} &middot; Active
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowSalesSettingsModal(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowSalesSettingsModal(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                  >
                    Change Password
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-semibold transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* USER PREFERENCES MODAL FOR NON-ADMIN ROLES */}
      {showSalesSettingsModal && user && (
        <UserPreferencesModal
          user={user}
          onClose={() => setShowSalesSettingsModal(false)}
        />
      )}
    </header>
  );
};
