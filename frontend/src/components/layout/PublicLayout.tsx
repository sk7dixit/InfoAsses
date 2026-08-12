import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building } from 'lucide-react';
import PillNav from '../PillNav';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Modules', href: '/modules' },
    { label: 'How it works', href: '/workflow' },
    { label: 'Roles', href: '/roles' },
    { label: 'Portal →', href: '/login' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-slate-900 selection:text-white relative overflow-hidden flex flex-col justify-between">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      {/* FLOATING GLASS HEADER */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center w-full max-w-6xl px-4 pointer-events-auto">
        <PillNav
          items={navItems}
          activeHref={location.pathname}
          ease="power2.easeOut"
          baseColor="rgba(255, 255, 255, 0.88)"
          pillColor="rgba(241, 245, 249, 0.8)"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#334155"
          initialLoadAnimation={true}
        />
      </div>

      {/* MAIN CONTENT WITH SUBTLE PAGE TRANSITION */}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 flex-1 pt-32 pb-16"
      >
        {children}
      </motion.main>

      {/* CLEAN NEUTRAL FOOTER */}
      <footer className="relative z-10 border-t border-slate-200 py-8 px-6 bg-white text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-[10px]">
              <Building className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900 text-xs tracking-tight">ERP + CRM Operations Portal</span>
          </div>

          <div className="flex items-center space-x-5 font-medium text-slate-600">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span>&middot;</span>
            <Link to="/modules" className="hover:text-slate-900 transition-colors">Modules</Link>
            <span>&middot;</span>
            <Link to="/workflow" className="hover:text-slate-900 transition-colors">How it works</Link>
            <span>&middot;</span>
            <Link to="/roles" className="hover:text-slate-900 transition-colors">Roles</Link>
            <span>&middot;</span>
            <Link to="/login" className="hover:text-slate-900 transition-colors">Login</Link>
          </div>

          <div className="text-slate-400">© 2026 Operations Portal</div>
        </div>
      </footer>
    </div>
  );
};
