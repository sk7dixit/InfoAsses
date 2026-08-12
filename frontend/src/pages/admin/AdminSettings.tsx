import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import {
  Building,
  Shield,
  Sliders,
  Lock,
  Activity,
  Save,
  CheckCircle2,
  AlertCircle,
  Users,
  Boxes,
  FileText,
  Clock,
  Key,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'company' | 'roles' | 'operations' | 'security' | 'audit'>('company');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states for Company Profile
  const [companyName, setCompanyName] = useState('ApexERP Enterprises Pvt Ltd');
  const [gstin, setGstin] = useState('27AAAAA0000A1Z5');
  const [address, setAddress] = useState('Suite 402, Technology Park, MIDC, Mumbai, MH - 400093');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('corporate@erp.com');
  const [currency, setCurrency] = useState('INR');

  // Form states for Operations
  const [defaultWarehouse, setDefaultWarehouse] = useState('Warehouse A');
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [challanPrefix, setChallanPrefix] = useState('CH');
  const [startingChallanNum, setStartingChallanNum] = useState(1);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const activityLogs = [
    { id: 1, user: 'System Administrator', action: 'Modified system settings', module: 'Settings', timestamp: '11 Aug 2026, 20:32' },
    { id: 2, user: 'Amit Sharma', action: 'Confirmed Sales Challan CH-00042', module: 'Sales Challans', timestamp: '11 Aug 2026, 18:45' },
    { id: 3, user: 'Ravi Kumar', action: 'Recorded Stock IN (+50 units)', module: 'Inventory', timestamp: '11 Aug 2026, 16:20' },
    { id: 4, user: 'Neha Gupta', action: 'Logged follow-up note for Client Amit Traders', module: 'Customer CRM', timestamp: '11 Aug 2026, 14:10' },
    { id: 5, user: 'System Administrator', action: 'Created new employee account (Sales)', module: 'Employee Management', timestamp: '10 Aug 2026, 11:30' },
  ];

  return (
    <div className="space-y-7 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Admin Settings & Configuration
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure company profile, role access matrix, operational rules, security controls, and audit trails.
          </p>
        </div>
        <span className="px-3 py-1 bg-slate-900 text-white font-bold text-xs rounded-xl self-start sm:self-center">
          Admin Portal Only
        </span>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2 shadow-card">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>System configuration saved successfully!</span>
        </div>
      )}

      {/* SETTINGS TABS & MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* TABS SIDEBAR (4 cols) */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'company', label: 'Company Profile', icon: Building, desc: 'Name, GST, Address' },
            { id: 'roles', label: 'Roles & Access', icon: Shield, desc: '4-Role Permission Matrix' },
            { id: 'operations', label: 'Operations & Stock', icon: Sliders, desc: 'Warehouse & Challans' },
            { id: 'security', label: 'Security & Access', icon: Lock, desc: 'Passwords & Sessions' },
            { id: 'audit', label: 'Activity Log Audit', icon: Activity, desc: 'Real-Time Transaction Feed' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center space-x-3 ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-card'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs leading-snug">{tab.label}</h4>
                  <p className={`text-[10px] ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>{tab.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* TAB PANELS CONTENT (9 cols) */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: COMPANY PROFILE */}
          {activeTab === 'company' && (
            <Card title="Company Profile & System Identity" subtitle="Information displayed on sales challans and corporate records">
              <form onSubmit={handleSave} className="space-y-5 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Company Name *"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                  <Input
                    label="GSTIN Number *"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Corporate Address *"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Corporate Phone *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <Input
                    label="Corporate Email *"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Select
                    label="Default Currency *"
                    options={[
                      { value: 'INR', label: 'INR (₹ - Indian Rupee)' },
                      { value: 'USD', label: 'USD ($ - US Dollar)' },
                    ]}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  />
                </div>

                <div className="pt-3 flex justify-end">
                  <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
                    Save Company Profile
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 2: ROLES & PERMISSIONS MATRIX */}
          {activeTab === 'roles' && (
            <Card title="System Roles & Permissions Matrix" subtitle="Authoritative role access control rules across operational modules">
              <div className="space-y-5 pt-2">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Admin Role</span>
                    <h4 className="text-lg font-bold text-slate-900">Full System</h4>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Sales Role</span>
                    <h4 className="text-lg font-bold text-blue-600">CRM & Challans</h4>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Warehouse Role</span>
                    <h4 className="text-lg font-bold text-purple-600">Products & Stock</h4>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Accounts Role</span>
                    <h4 className="text-lg font-bold text-teal-600">Read-Only Audit</h4>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 font-semibold uppercase text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Module / Feature</th>
                        <th className="px-4 py-3 text-center">Admin</th>
                        <th className="px-4 py-3 text-center">Sales</th>
                        <th className="px-4 py-3 text-center">Warehouse</th>
                        <th className="px-4 py-3 text-center">Accounts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { module: 'Employee Management', admin: 'Full Control', sales: '❌ No Access', warehouse: '❌ No Access', accounts: '❌ No Access' },
                        { module: 'Customer CRM & Follow-ups', admin: 'Full Control', sales: 'Manage', warehouse: 'Read-Only', accounts: 'Read-Only' },
                        { module: 'Products Catalog', admin: 'Full Control', sales: 'Read-Only', warehouse: 'Manage', accounts: 'Read-Only' },
                        { module: 'Inventory & Stock Movements', admin: 'Full Control', sales: 'Read-Only', warehouse: 'Manage', accounts: 'Read-Only' },
                        { module: 'Sales Delivery Challans', admin: 'Full Control', sales: 'Create & Confirm', warehouse: 'Read-Only', accounts: 'Read-Only' },
                        { module: 'System & Admin Settings', admin: 'Full Control', sales: '❌ No Access', warehouse: '❌ No Access', accounts: '❌ No Access' },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="px-4 py-3 font-bold text-slate-900">{row.module}</td>
                          <td className="px-4 py-3 text-center font-bold text-slate-900 bg-slate-50/50">{row.admin}</td>
                          <td className="px-4 py-3 text-center font-medium text-slate-700">{row.sales}</td>
                          <td className="px-4 py-3 text-center font-medium text-slate-700">{row.warehouse}</td>
                          <td className="px-4 py-3 text-center font-medium text-teal-700 bg-teal-50/30">{row.accounts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 3: OPERATIONS & INVENTORY SETTINGS */}
          {activeTab === 'operations' && (
            <Card title="Operations & Stock Configuration" subtitle="Default warehouse rules and sequence number formatting">
              <form onSubmit={handleSave} className="space-y-5 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Default Storage Warehouse *"
                    options={[
                      { value: 'Warehouse A', label: 'Warehouse A (Primary)' },
                      { value: 'Warehouse B', label: 'Warehouse B (Secondary)' },
                      { value: 'Warehouse C', label: 'Warehouse C (Overflow)' },
                    ]}
                    value={defaultWarehouse}
                    onChange={(e) => setDefaultWarehouse(e.target.value)}
                  />
                  <Input
                    label="Low Stock Alert Minimum Threshold *"
                    type="number"
                    min={1}
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(parseInt(e.target.value, 10) || 10)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Sales Challan Prefix *"
                    value={challanPrefix}
                    onChange={(e) => setChallanPrefix(e.target.value)}
                  />
                  <Input
                    label="Starting Challan Sequence *"
                    type="number"
                    min={1}
                    value={startingChallanNum}
                    onChange={(e) => setStartingChallanNum(parseInt(e.target.value, 10) || 1)}
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Generated Sequence Format Preview</p>
                  <span className="font-mono text-sm font-bold text-blue-600">{challanPrefix}-00042</span>
                </div>

                <div className="pt-3 flex justify-end">
                  <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
                    Save Operational Defaults
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 4: SECURITY & ACCESS */}
          {activeTab === 'security' && (
            <Card title="Security Controls & Password Management" subtitle="Update admin security credentials and authentication controls">
              <form onSubmit={handleSave} className="space-y-5 pt-2">
                <Input
                  label="Current Admin Password *"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="New Admin Password *"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <Input
                    label="Confirm New Password *"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-3 flex justify-end">
                  <Button type="submit" variant="primary" icon={<Key className="w-4 h-4" />}>
                    Update Password & Security
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 5: SYSTEM ACTIVITY AUDIT LOG */}
          {activeTab === 'audit' && (
            <Card title="System Activity Audit Log" subtitle="Real-time audit trail of administrative and operational user transactions">
              <div className="space-y-4 pt-2">
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 font-semibold uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Action Description</th>
                        <th className="px-4 py-3">Module</th>
                        <th className="px-4 py-3 text-right">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activityLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/60">
                          <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{log.id}</td>
                          <td className="px-4 py-3 font-bold text-slate-900">{log.user}</td>
                          <td className="px-4 py-3 font-medium text-slate-700">{log.action}</td>
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700 text-[10px]">
                              {log.module}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-slate-500 font-medium">{log.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};
