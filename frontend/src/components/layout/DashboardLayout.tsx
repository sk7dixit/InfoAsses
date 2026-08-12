import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Sleek Top Header Navigation */}
      <Header />

      {/* Main Content (Full Width) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">
        <Outlet />
      </main>

      {/* System Footer */}
      <footer className="py-4 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400 font-medium">
        ApexERP Operations Platform &copy; 2026 &middot; Mini ERP & CRM System v1.0
      </footer>
    </div>
  );
};
