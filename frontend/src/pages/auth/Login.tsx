import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/auth.api';
import { ShieldCheck, Users, Boxes, Receipt, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Role } from '../../types';
import GradientWaves from '../../components/GradientWaves';
import GooeyNav from '../../components/GooeyNav';

interface RoleOption {
  id: Role;
  title: string;
  desc: string;
  formSubtitle: string;
  icon: React.FC<{ className?: string }>;
  placeholderUsername: string;
  demoUsername: string;
  demoPass: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'ADMIN',
    title: 'Admin',
    desc: 'System administration',
    formSubtitle: 'Sign in to continue to the operations portal.',
    icon: ShieldCheck,
    placeholderUsername: 'admin_emp',
    demoUsername: 'admin_emp',
    demoPass: 'Admin@12',
  },
  {
    id: 'SALES',
    title: 'Sales',
    desc: 'Customers & challans',
    formSubtitle: 'Sign in to manage customers and sales operations.',
    icon: Users,
    placeholderUsername: 'saleemp_001',
    demoUsername: 'saleemp_001',
    demoPass: 'Sales@12',
  },
  {
    id: 'WAREHOUSE',
    title: 'Warehouse',
    desc: 'Products & stock',
    formSubtitle: 'Sign in to manage products and inventory.',
    icon: Boxes,
    placeholderUsername: 'whemp_001',
    demoUsername: 'whemp_001',
    demoPass: 'House@12',
  },
  {
    id: 'ACCOUNTS',
    title: 'Accounts',
    desc: 'Business records',
    formSubtitle: 'Sign in to review business records and challans.',
    icon: Receipt,
    placeholderUsername: 'acemp_001',
    demoUsername: 'acemp_001',
    demoPass: 'Account@12',
  },
];

export const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSelectRole = (roleOpt: RoleOption) => {
    setSelectedRole(roleOpt.id);
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setError('');
  };

  const fillDemoCredentials = () => {
    const roleOpt = ROLES.find((r) => r.id === selectedRole);
    if (roleOpt) {
      setUsername(roleOpt.demoUsername);
      setPassword(roleOpt.demoPass);
      setError('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({ username, password, role: selectedRole || undefined });
      const user = response.data.user;
      login(response.data.token, user);

      // Role-specific workspace redirection
      switch (user.role) {
        case 'ADMIN':
          navigate('/dashboard');
          break;
        case 'SALES':
          navigate('/sales/dashboard');
          break;
        case 'WAREHOUSE':
          navigate('/warehouse/dashboard');
          break;
        case 'ACCOUNTS':
          navigate('/accounts/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const currentRoleOpt = ROLES.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-[#070614] text-white font-sans selection:bg-purple-600 selection:text-white relative overflow-hidden flex flex-col justify-between">
      {/* Exact Dark GradientWaves WebGL Background */}
      <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
        <GradientWaves
          horizonColor="#5227FF"
          waveColor="#FF9FFC"
          crestColor="#FFFFFF"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1.0}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1.0}
          opacity={1.0}
          mouseInteraction={true}
          parallaxStrength={0.5}
          grain={true}
          grainIntensity={0.05}
        />
      </div>

      {/* Subconscious Background Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_50%,transparent_100%)] pointer-events-none z-0"></div>

      {/* MAIN TWO-COLUMN CONTAINER */}
      <main className="relative z-10 flex-1 flex items-center justify-center pt-12 sm:pt-14 pb-8 px-6">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT SIDE CONTENT & WORKSPACE OVERVIEW */}
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <h1 className="text-4xl sm:text-[48px] font-bold text-white tracking-tight leading-[1.1] drop-shadow-sm">
              Operations Portal
            </h1>
            <p className="text-base text-slate-300 font-normal leading-relaxed max-w-md mx-auto lg:mx-0">
              A single workspace for managing customers, inventory, and sales operations.
            </p>
            
            <div className="pt-1 flex items-center justify-center lg:justify-start space-x-2 text-sm font-medium text-slate-400">
              <span>Customers</span>
              <span className="text-slate-600">·</span>
              <span>Inventory</span>
              <span className="text-slate-600">·</span>
              <span>Sales</span>
              <span className="text-slate-600">·</span>
              <span>Accounts</span>
            </div>

            {/* PURPOSEFUL WORKSPACE OVERVIEW CARD */}
            <div className="pt-3">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 space-y-3.5 max-w-md mx-auto lg:mx-0 shadow-lg text-left">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                  <span className="text-[11px] font-semibold tracking-wider text-purple-300/90 uppercase">
                    WORKSPACE STATUS
                  </span>
                  <div className="flex items-center space-x-1.5 text-[12px] font-medium text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>All systems operational</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-xs text-slate-300">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
                    <div className="font-semibold text-white">CRM & Leads</div>
                    <div className="text-[11px] text-slate-400 leading-tight">Customer tracking</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
                    <div className="font-semibold text-white">Stock Control</div>
                    <div className="text-[11px] text-slate-400 leading-tight">Inventory audit</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
                    <div className="font-semibold text-white">Sales Challan</div>
                    <div className="text-[11px] text-slate-400 leading-tight">Delivery flow</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE ROLE SELECTION & LOGIN PANEL */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[420px] bg-slate-900/85 backdrop-blur-xl rounded-[24px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-7 sm:p-8 space-y-6">
              
              <AnimatePresence mode="wait">
                {selectedRole === null ? (
                  /* STEP 1: ROLE SELECTION GRID */
                  <motion.div
                    key="step-roles"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div>
                      <span className="text-[12px] font-semibold tracking-[0.12em] text-purple-300/90 uppercase block mb-1">
                        WELCOME BACK
                      </span>
                      <h2 className="text-2xl font-bold text-white tracking-tight">
                        Select your role
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Choose your assigned role to continue to your workspace.
                      </p>
                    </div>

                    <div className="pt-1">
                      <GooeyNav
                        items={ROLES.map((r) => ({
                          id: r.id,
                          label: r.title,
                          sublabel: r.desc,
                          icon: r.icon,
                          roleOpt: r,
                        }))}
                        particleCount={16}
                        particleDistances={[85, 12]}
                        particleR={95}
                        animationTime={550}
                        timeVariance={250}
                        colors={[1, 2, 3, 4]}
                        onItemSelect={(item) => {
                          handleSelectRole(item.roleOpt);
                        }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  /* STEP 2: ROLE AUTHENTICATION FORM */
                  <motion.div
                    key="step-login"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRole(null)}
                          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
                          <span>Back to role selection</span>
                        </button>
                        <span className="text-[10px] font-semibold tracking-wider text-purple-300/80 uppercase">
                          OPERATIONS PORTAL
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-white tracking-tight capitalize">
                        {currentRoleOpt?.title} access
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        {currentRoleOpt?.formSubtitle}
                      </p>
                    </div>

                    {error && (
                      <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-medium leading-relaxed">
                        {error}
                      </div>
                    )}

                    <form className="space-y-4" onSubmit={handleLogin}>
                      <div>
                        <label htmlFor="login-username" className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Employee Username
                        </label>
                        <input
                          id="login-username"
                          type="text"
                          placeholder={`e.g. ${currentRoleOpt?.placeholderUsername || 'username'}`}
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none p-1 rounded-lg hover:bg-slate-800/50"
                            title={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 text-purple-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          id="login-submit"
                          type="submit"
                          disabled={loading}
                          className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-70 transition-all duration-200 shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 group"
                        >
                          <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </form>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedRole(null)}
                        className="text-xs font-semibold text-slate-400 hover:text-white transition-colors inline-flex items-center space-x-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                        <span>Change role</span>
                      </button>

                      <span className="text-[11px] text-slate-500">
                        {currentRoleOpt?.title} role
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-5 px-6 text-center text-slate-500 text-[12px]">
        © 2026 Operations Portal
      </footer>
    </div>
  );
};
