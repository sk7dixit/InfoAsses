import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Package, FileText, ArrowRight } from 'lucide-react';
import { PublicLayout } from '../../components/layout/PublicLayout';

export const ModulesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <section className="relative z-10 py-12 px-6 max-w-6xl mx-auto">
        {/* Page Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Core modules
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Everything the team needs to manage customers, inventory, and sales challans in one system.
          </p>
        </div>

        {/* 3 Core Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 01 */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-5">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                MODULE 01
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1 mb-2">
                Customer CRM
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                Keep customer details, business information, follow-ups, and notes together so the sales team knows what needs attention.
              </p>
            </div>

            <button
              onClick={() => navigate('/customers')}
              className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900 group hover:text-slate-700 transition-colors w-full"
            >
              <span>View Customers</span>
              <ArrowRight className="w-4 h-4 text-slate-700 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Module 02 */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-5">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                MODULE 02
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1 mb-2">
                Product & Inventory
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                Manage products, monitor stock levels, and keep a record of every stock movement.
              </p>
            </div>

            <button
              onClick={() => navigate('/inventory')}
              className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900 group hover:text-slate-700 transition-colors w-full"
            >
              <span>View Inventory</span>
              <ArrowRight className="w-4 h-4 text-slate-700 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Module 03 */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-5">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                MODULE 03
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1 mb-2">
                Sales Challans
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                Create challans, add multiple products, and confirm orders only when the required stock is available.
              </p>
            </div>

            <button
              onClick={() => navigate('/challans')}
              className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900 group hover:text-slate-700 transition-colors w-full"
            >
              <span>Manage Challans</span>
              <ArrowRight className="w-4 h-4 text-slate-700 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
};
