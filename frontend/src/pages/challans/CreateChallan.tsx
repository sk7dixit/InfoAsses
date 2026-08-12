import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../../services/customer.api';
import { productApi } from '../../services/product.api';
import { challanApi } from '../../services/challan.api';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Plus, Trash2, Save, CheckCircle2, AlertCircle, Phone, Building } from 'lucide-react';

interface SelectedItem {
  productId: string;
  quantity: number;
}

export const CreateChallan: React.FC = () => {
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<SelectedItem[]>([{ productId: '', quantity: 1 }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch customers
  const { data: customersRes } = useQuery({
    queryKey: ['select-customers'],
    queryFn: () => customerApi.getCustomers({ limit: 100 }),
  });

  // Fetch products
  const { data: productsRes } = useQuery({
    queryKey: ['select-products'],
    queryFn: () => productApi.getProducts({ limit: 100 }),
  });

  const customers = customersRes?.data || [];
  const products = productsRes?.data || [];
  const productMap = new Map(products.map((p) => [p.id, p]));
  const selectedCustomer = customers.find((c) => c.id === customerId);

  const addItemRow = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const removeItemRow = (index: number) => {
    if (items.length === 1) return;
    const next = [...items];
    next.splice(index, 1);
    setItems(next);
  };

  const updateItem = (index: number, field: keyof SelectedItem, value: any) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  // Check if any row has stock violation
  const hasStockViolation = items.some((item) => {
    if (!item.productId || !productMap.has(item.productId)) return false;
    const p = productMap.get(item.productId)!;
    return item.quantity > p.currentStock;
  });

  const handleSaveChallan = async (confirmDirectly: boolean) => {
    setErrorMsg('');

    if (!customerId) {
      setErrorMsg('Please select a customer client for this delivery challan.');
      return;
    }

    const invalidItems = items.filter((i) => !i.productId || i.quantity <= 0);
    if (invalidItems.length > 0) {
      setErrorMsg('Please select valid products and positive quantities for all item lines.');
      return;
    }

    if (confirmDirectly && hasStockViolation) {
      setErrorMsg('Cannot confirm challan: One or more products exceed available warehouse stock.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create Draft Challan
      const createdRes = await challanApi.createChallan({
        customerId,
        items,
      });

      const newChallanId = createdRes.data.id;

      // 2. If user requested immediate confirmation, trigger confirm API
      if (confirmDirectly) {
        await challanApi.confirmChallan(newChallanId);
      }

      navigate(`/challans/${newChallanId}`);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to process sales delivery challan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate totals
  let estimatedTotalAmount = 0;
  let totalItemUnits = 0;

  items.forEach((item) => {
    if (item.productId && productMap.has(item.productId)) {
      const p = productMap.get(item.productId)!;
      estimatedTotalAmount += Number(p.unitPrice) * item.quantity;
      totalItemUnits += item.quantity;
    }
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/challans')} icon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Sales Delivery Challan</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Automatic sequence generation. Stock is deducted only upon confirmation.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: CUSTOMER SELECTION */}
      <Card title="Step 1 — Customer Client Information">
        <div className="space-y-4">
          <Select
            label="Select Client / Customer Account *"
            options={[
              { value: '', label: '-- Select Customer --' },
              ...customers.map((c) => ({
                value: c.id,
                label: `${c.customerName} ${c.businessName ? `(${c.businessName})` : ''} - Mobile: ${c.mobile}`,
              })),
            ]}
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />

          {selectedCustomer && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-slate-900 text-sm">{selectedCustomer.customerName}</h4>
                  <Badge variant={selectedCustomer.customerType} />
                  <Badge variant={selectedCustomer.status} />
                </div>
                {selectedCustomer.businessName && (
                  <p className="text-slate-600 font-medium flex items-center space-x-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedCustomer.businessName}</span>
                  </p>
                )}
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-slate-500 font-medium flex items-center space-x-1 justify-end">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedCustomer.mobile}</span>
                </span>
                {selectedCustomer.email && <p className="text-slate-400">{selectedCustomer.email}</p>}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* STEP 2: MULTI-PRODUCT LINE ITEMS GRID */}
      <Card
        title="Step 2 — Add Dispatch Product Line Items"
        subtitle="Add catalog products, quantities, and verify stock availability"
        action={
          <Button type="button" variant="outline" size="sm" onClick={addItemRow} icon={<Plus className="w-4 h-4" />}>
            Add Product Line
          </Button>
        }
      >
        <div className="space-y-4">
          {items.map((row, idx) => {
            const currentP = productMap.get(row.productId);
            const isInsufficient = currentP && currentP.currentStock < row.quantity;

            return (
              <div
                key={idx}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
              >
                <div className="sm:col-span-6">
                  <Select
                    label={`Line Item #${idx + 1} Product *`}
                    options={[
                      { value: '', label: '-- Select Catalog Product --' },
                      ...products.map((p) => ({
                        value: p.id,
                        label: `${p.productName} (SKU: ${p.sku}) - Available Stock: ${p.currentStock} units`,
                      })),
                    ]}
                    value={row.productId}
                    onChange={(e) => updateItem(idx, 'productId', e.target.value)}
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Quantity *"
                    type="number"
                    min={1}
                    value={row.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                    required
                  />
                </div>

                <div className="sm:col-span-2 text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Line Subtotal</span>
                  <span className="text-sm font-bold text-slate-900">
                    ₹{currentP ? (Number(currentP.unitPrice) * row.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
                  </span>
                </div>

                <div className="sm:col-span-1 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={items.length === 1}
                    onClick={() => removeItemRow(idx)}
                    icon={<Trash2 className="w-4 h-4 text-slate-400 hover:text-rose-600" />}
                  />
                </div>

                {isInsufficient && (
                  <div className="sm:col-span-12 mt-1 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>Insufficient stock: Only {currentP.currentStock} units are currently available.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* TOTALS SUMMARY */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs font-bold text-slate-900">
          <span>Total Line Items: {items.length} | Total Dispatch Quantity: {totalItemUnits} units</span>
          <span className="text-base text-blue-600">
            Estimated Total Amount: ₹{estimatedTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </Card>

      {/* SUBMIT ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-end items-center space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
        <Button type="button" variant="ghost" onClick={() => navigate('/challans')}>
          Cancel
        </Button>

        <Button
          type="button"
          variant="secondary"
          isLoading={isSubmitting}
          onClick={() => handleSaveChallan(false)}
          icon={<Save className="w-4 h-4" />}
        >
          Save as Draft
        </Button>

        <Button
          type="button"
          variant="primary"
          disabled={hasStockViolation}
          isLoading={isSubmitting}
          onClick={() => handleSaveChallan(true)}
          icon={<CheckCircle2 className="w-4 h-4" />}
        >
          Confirm Challan & Deduct Stock
        </Button>
      </div>
    </div>
  );
};
