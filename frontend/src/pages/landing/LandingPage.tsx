import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Package, FileText } from 'lucide-react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import GradientWaves from '../../components/GradientWaves';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      {/* HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center justify-center pt-8 pb-16 px-6 overflow-hidden">
        {/* Animated Gradient Waves Background */}
        <div className="absolute inset-0 z-0 opacity-75 pointer-events-none">
          <GradientWaves
            horizonColor="#f8fafc"
            waveColor="#93c5fd"
            crestColor="#c084fc"
            speed={0.35}
            amplitude={2.0}
            waveScale={0.5}
            waveRatio={0.9}
            swell={25}
            turbulence={15}
            tilt={1.1}
            zoom={1.0}
            height={5.0}
            fogDepth={18}
            detail="medium"
            brightness={1.0}
            opacity={0.75}
            mouseInteraction={true}
            parallaxStrength={0.4}
            grain={true}
            grainIntensity={0.03}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-7">
          {/* Small Clean Label */}
          <div>
            <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/90 text-slate-700 border border-slate-200/90 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-slate-700 inline-block"></span>
              <span>ERP + CRM Operations Portal</span>
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
            Keep customers, stock, and sales in sync.
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Manage customers, inventory, and sales challans from one place — with each team working from the same data.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-md flex items-center justify-center space-x-2 group"
            >
              <span>Enter Operations Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/modules')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold bg-white text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/90 shadow-sm backdrop-blur-md flex items-center justify-center space-x-2"
            >
              <span>View Modules</span>
            </button>
          </div>

          {/* Bottom text */}
          <p className="text-xs text-slate-500 pt-4 font-medium tracking-wide">
            Customers &middot; Inventory &middot; Sales Challans &middot; Role-based Access
          </p>
        </div>
      </section>

      {/* SHORT OVERVIEW SECTION */}
      <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Built around the work your team actually does.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/modules')}
            className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Customers
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Keep customer details and follow-ups organized.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/modules')}
            className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Inventory
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Know current stock and record every movement.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/modules')}
            className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Sales Challans
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Create challans and validate stock before confirmation.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/modules')}
            className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-900 hover:text-slate-700 group transition-colors"
          >
            <span>Explore all modules</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </PublicLayout>
  );
};
