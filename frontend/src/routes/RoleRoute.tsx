import React from 'react';
import { Role } from '../types';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface RoleRouteProps {
  roles: Role[];
  children: React.ReactNode;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ roles, children }) => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  if (!user || !hasRole(roles)) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-12 text-center max-w-lg mx-auto my-12">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-heading mb-2">Access Denied (403)</h2>
        <p className="text-sm text-slate-600 mb-6">
          Your account role <span className="font-semibold text-slate-900">'{user?.role}'</span> does not have authorization to view this section.
        </p>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};
