import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { User } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import {
  X,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  User as UserIcon,
} from 'lucide-react';

interface UserPreferencesModalProps {
  user: User;
  onClose: () => void;
}

type ModalView = 'MAIN' | 'PROFILE' | 'PASSWORD';

import { useAuth } from '../../context/AuthContext';

export const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({ user, onClose }) => {
  const { updateUser } = useAuth();
  const [view, setView] = useState<ModalView>('MAIN');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Profile editable state
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profileRoleTitle, setProfileRoleTitle] = useState(`${user.role} Executive`);
  const [profileEmpId, setProfileEmpId] = useState(
    user.role === 'ACCOUNTS'
      ? 'ACC-001'
      : user.role === 'SALES'
      ? 'SAL-001'
      : user.role === 'WAREHOUSE'
      ? 'WH-001'
      : 'ADM-001'
  );
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password sub-view state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Preferences toggles state
  const [toggles, setToggles] = useState({
    followUpReminders: true,
    overdueAlerts: true,
    challanConfirmations: true,
    stockWarnings: true,
    confirmBeforeSubmit: true,
    showStockWarningsChallan: true,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaveStatus(key);
    setTimeout(() => setSaveStatus(null), 1500);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName || !profileEmail) {
      setProfileMsg({ type: 'error', text: 'Full Name and Corporate Email are required.' });
      return;
    }
    updateUser({ name: profileName, email: profileEmail });
    setProfileMsg({ type: 'success', text: 'Profile details updated successfully!' });
    setTimeout(() => {
      setProfileMsg(null);
      setView('MAIN');
    }, 1200);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPasswordMsg({ type: 'error', text: 'Please complete all password fields.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
    setTimeout(() => {
      setPasswordMsg(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setView('MAIN');
    }, 1200);
  };

  // Role-specific settings section title
  const getRoleSettingsTitle = () => {
    switch (user.role) {
      case 'SALES':
        return 'CHALLAN PREFERENCES';
      case 'WAREHOUSE':
        return 'INVENTORY PREFERENCES';
      case 'ACCOUNTS':
        return 'DISPLAY PREFERENCES';
      default:
        return 'WORKSPACE PREFERENCES';
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-[600px] rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden my-auto animate-in fade-in zoom-in-95">
        
        {/* MODAL HEADER - Fixed at top */}
        <div className="p-5 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center space-x-2">
            {view !== 'MAIN' && (
              <button
                onClick={() => setView('MAIN')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors mr-1"
                title="Back to Settings"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {view === 'MAIN' && `${user.role === 'SALES' ? 'Sales' : user.role} Settings`}
                {view === 'PROFILE' && 'My Profile Details'}
                {view === 'PASSWORD' && 'Change Password'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {view === 'MAIN' && `Manage your ${user.role.toLowerCase()} workspace preferences and account security.`}
                {view === 'PROFILE' && 'Personal information and employee role assignment.'}
                {view === 'PASSWORD' && 'Update your system login password.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY - Scrollable inside if needed */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          
          {/* MAIN VIEW */}
          {view === 'MAIN' && (
            <div className="space-y-5 text-xs">
              
              {/* ACCOUNT SECTION */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">ACCOUNT</span>
                
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
                  <button
                    type="button"
                    onClick={() => setView('PROFILE')}
                    className="w-full p-3.5 flex items-center justify-between hover:bg-slate-100/80 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">My Profile</h4>
                        <p className="text-[11px] text-slate-500">{user.name} &middot; {user.email}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setView('PASSWORD')}
                    className="w-full p-3.5 flex items-center justify-between hover:bg-slate-100/80 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Change Password</h4>
                        <p className="text-[11px] text-slate-500">Update corporate account authentication password</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* NOTIFICATIONS SECTION */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">NOTIFICATIONS</span>
                  {saveStatus && (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1 animate-fade-in">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Saved</span>
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {(user.role === 'ACCOUNTS'
                    ? [
                        { key: 'challanConfirmations' as const, label: 'Challan Confirmed' },
                        { key: 'followUpReminders' as const, label: 'Challan Cancelled' },
                        { key: 'stockWarnings' as const, label: 'Stock Movement' },
                        { key: 'overdueAlerts' as const, label: 'Low Stock Alert' },
                        { key: 'confirmBeforeSubmit' as const, label: 'Daily Operations Summary' },
                      ]
                    : user.role === 'WAREHOUSE'
                    ? [
                        { key: 'followUpReminders' as const, label: 'Low-stock alerts' },
                        { key: 'overdueAlerts' as const, label: 'Out-of-stock alerts' },
                        { key: 'challanConfirmations' as const, label: 'Stock movement confirmation' },
                        { key: 'stockWarnings' as const, label: 'Inventory update notifications' },
                      ]
                    : [
                        { key: 'followUpReminders' as const, label: 'Follow-up reminders' },
                        { key: 'overdueAlerts' as const, label: 'Overdue follow-up alerts' },
                        { key: 'challanConfirmations' as const, label: 'Challan confirmations' },
                        { key: 'stockWarnings' as const, label: 'Stock availability warnings' },
                      ]
                  ).map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="font-semibold text-slate-700">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => handleToggle(item.key)}
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                          toggles[item.key] ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          toggles[item.key] ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* WORKSPACE PREFERENCES */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  WORKSPACE PREFERENCES
                </span>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="font-semibold text-slate-700">Date Format</span>
                    <select className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-900">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  {user.role === 'ACCOUNTS' && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="font-semibold text-slate-700">Default Challan View</span>
                      <select className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-900">
                        <option value="ALL">All Challans</option>
                        <option value="CONFIRMED">Confirmed Only</option>
                        <option value="DRAFT">Draft Only</option>
                        <option value="CANCELLED">Cancelled Only</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="font-semibold text-slate-700">Rows Per Page</span>
                    <select className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-900">
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* PROFILE SUB-VIEW */}
          {view === 'PROFILE' && (
            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              {profileMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold ${
                    profileMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {profileMsg.text}
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-base flex items-center justify-center">
                  {profileName
                    ? profileName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    : 'US'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{profileName}</h4>
                  <p className="text-slate-500">{profileEmail}</p>
                  <div className="mt-1">
                    <Badge variant={user.role} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Full Name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
                <Input
                  label="Corporate Email"
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="corporate@company.com"
                  required
                />
                <Input
                  label="Role Title"
                  value={profileRoleTitle}
                  onChange={(e) => setProfileRoleTitle(e.target.value)}
                  placeholder="e.g. Senior Sales Manager"
                />
                <Input
                  label="Employee ID"
                  value={profileEmpId}
                  onChange={(e) => setProfileEmpId(e.target.value)}
                  placeholder="EMP-001"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setView('MAIN')}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {/* PASSWORD SUB-VIEW */}
          {view === 'PASSWORD' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              {passwordMsg && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {passwordMsg.text}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setView('MAIN')}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Update Password
                </Button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
