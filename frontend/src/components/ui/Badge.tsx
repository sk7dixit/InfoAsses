import React from 'react';

type BadgeVariant = 
  | 'LEAD' | 'ACTIVE' | 'INACTIVE'
  | 'DRAFT' | 'CONFIRMED' | 'CANCELLED'
  | 'IN' | 'OUT'
  | 'ADMIN' | 'SALES' | 'WAREHOUSE' | 'ACCOUNTS'
  | 'RETAIL' | 'WHOLESALE' | 'DISTRIBUTOR'
  | 'LOW_STOCK';

interface BadgeProps {
  variant: BadgeVariant | string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children }) => {
  const v = variant.toUpperCase();

  const getStyle = () => {
    switch (v) {
      case 'CONFIRMED':
      case 'ACTIVE':
      case 'IN':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DRAFT':
      case 'LEAD':
      case 'WHOLESALE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED':
      case 'INACTIVE':
      case 'OUT':
      case 'LOW_STOCK':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SALES':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'WAREHOUSE':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'ACCOUNTS':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'DISTRIBUTOR':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyle()}`}
    >
      {children || variant}
    </span>
  );
};
