import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { challanApi } from '../../services/challan.api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { ArrowLeft, CheckCircle2, XCircle, Printer, Building, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ChallanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();

  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  const canAction = hasRole(['ADMIN', 'SALES']);

  const { data: response, isLoading } = useQuery({
    queryKey: ['challan', id],
    queryFn: () => challanApi.getChallanById(id!),
    enabled: !!id,
  });

  const challan = response?.data;

  const handleConfirm = async () => {
    if (!window.confirm('Confirming this delivery challan will IMMEDIATELY deduct product stock in inventory. Proceed?')) {
      return;
    }

    setIsConfirming(true);
    setStockError(null);

    try {
      await challanApi.confirmChallan(id!);
      queryClient.invalidateQueries({ queryKey: ['challan', id] });
      queryClient.invalidateQueries({ queryKey: ['challans'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Stock confirmation failed';
      const errors = err.response?.data?.errors;
      if (errors && errors.length > 0) {
        setStockError(`${msg}: ${errors.map((e: any) => e.message).join(', ')}`);
      } else {
        setStockError(msg);
      }
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this delivery challan?')) {
      return;
    }

    setIsCancelling(true);
    try {
      await challanApi.cancelChallan(id!);
      queryClient.invalidateQueries({ queryKey: ['challan', id] });
      queryClient.invalidateQueries({ queryKey: ['challans'] });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel challan');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!challan) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Sales challan not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/challans')}>
          Back to Challans List
        </Button>
      </div>
    );
  }

  // Calculate grand total snapshot value
  let grandTotal = 0;
  challan.items.forEach((item) => {
    grandTotal += Number(item.unitPriceSnapshot) * item.quantity;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/challans')} icon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-slate-900 font-heading">{challan.challanNumber}</h1>
              <Badge variant={challan.status} />
            </div>
            <p className="text-xs text-slate-500">Generated on {new Date(challan.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => window.print()} icon={<Printer className="w-4 h-4" />}>
            Print Delivery Note
          </Button>

          {canAction && challan.status === 'DRAFT' && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              isLoading={isConfirming}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm & Deduct Stock
            </Button>
          )}

          {canAction && challan.status !== 'CANCELLED' && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleCancel}
              isLoading={isCancelling}
              icon={<XCircle className="w-4 h-4" />}
            >
              Cancel Challan
            </Button>
          )}
        </div>
      </div>

      {/* Stock Error Banner */}
      {stockError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium flex items-center space-x-3 shadow-subtle">
          <AlertTriangle className="w-6 h-6 shrink-0 text-rose-600" />
          <div>
            <h4 className="font-bold text-rose-800">Transaction Aborted</h4>
            <p className="text-xs text-rose-700 mt-0.5">{stockError}</p>
          </div>
        </div>
      )}

      {/* Printable Challan Document Card */}
      <Card className="p-8 space-y-8 bg-white border border-slate-200 shadow-lg">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between border-b border-slate-200 pb-6 gap-6">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 mb-2">
              <Building className="w-6 h-6" />
              <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">ApexERP Enterprise</span>
            </div>
            <p className="text-xs text-slate-500">Corporate Goods Dispatch & Logistics</p>
            <p className="text-xs text-slate-500">GSTIN: 27AAAAA0000A1Z5</p>
          </div>

          <div className="text-left sm:text-right">
            <h2 className="text-xl font-extrabold text-slate-900 font-heading uppercase tracking-wider">Delivery Challan</h2>
            <p className="text-sm font-bold text-blue-600 mt-1">{challan.challanNumber}</p>
            <p className="text-xs text-slate-500 mt-0.5">Date: {new Date(challan.createdAt).toLocaleDateString()}</p>
            <p className="text-xs text-slate-500">Issued By: {challan.createdBy.name}</p>
          </div>
        </div>

        {/* Customer Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Deliver To Client</p>
            <h3 className="font-bold text-slate-900 text-base">{challan.customer.customerName}</h3>
            {challan.customer.businessName && <p className="text-slate-600">{challan.customer.businessName}</p>}
            <p className="text-xs text-slate-500 mt-1">Mobile: {challan.customer.mobile}</p>
            {challan.customer.email && <p className="text-xs text-slate-500">Email: {challan.customer.email}</p>}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Shipping Address & Tax</p>
            <p className="text-slate-700">{challan.customer.address || 'Address on file'}</p>
            {challan.customer.gstNumber && (
              <p className="text-xs font-mono font-semibold text-slate-600 mt-2">
                GSTIN: {challan.customer.gstNumber}
              </p>
            )}
          </div>
        </div>

        {/* Item Snapshots Table */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-heading mb-3 uppercase tracking-wider">
            Dispatched Item Snapshots
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Product Name (Snapshot)</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {challan.items.map((item, idx) => {
                  const lineTotal = Number(item.unitPriceSnapshot) * item.quantity;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{item.productNameSnapshot}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.skuSnapshot}</td>
                      <td className="px-4 py-3 text-right text-slate-700">
                        ₹{Number(item.unitPriceSnapshot).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        ₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="flex justify-between items-end pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-400 space-y-1">
            <p>• Snapshotted prices remain unchanged even if product master prices update.</p>
            <p>• Goods received in sound condition by client representative.</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-semibold">Total Dispatch Value</p>
            <h3 className="text-2xl font-extrabold text-blue-600 font-heading">
              ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">Total Units: {challan.totalQuantity}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
