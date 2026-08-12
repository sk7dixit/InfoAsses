import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { inventoryApi } from '../../services/inventory.api';
import { productApi } from '../../services/product.api';

interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StockMovementModal: React.FC<StockMovementModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: productsRes } = useQuery({
    queryKey: ['all-products-select'],
    queryFn: () => productApi.getProducts({ limit: 100 }),
    enabled: isOpen,
  });

  const products = productsRes?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || quantity <= 0 || !reason) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await inventoryApi.recordMovement({
        productId,
        quantity,
        movementType,
        reason,
      });
      onSuccess();
      onClose();
      setProductId('');
      setQuantity(1);
      setReason('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to record stock movement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProduct = products.find((p) => p.id === productId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Manual Stock Movement" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Product *"
          options={[
            { value: '', label: '-- Select Catalog Item --' },
            ...products.map((p) => ({
              value: p.id,
              label: `${p.productName} (SKU: ${p.sku}) - Current Stock: ${p.currentStock}`,
            })),
          ]}
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        />

        {selectedProduct && (
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex justify-between">
            <span>Available Stock: <strong className="text-slate-900">{selectedProduct.currentStock} units</strong></span>
            <span>Min Stock Alert: <strong className="text-slate-900">{selectedProduct.minimumStock} units</strong></span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Movement Type *"
            options={[
              { value: 'IN', label: 'Stock IN (Receive Purchase)' },
              { value: 'OUT', label: 'Stock OUT (Manual Deduction)' },
            ]}
            value={movementType}
            onChange={(e) => setMovementType(e.target.value as 'IN' | 'OUT')}
          />
          <Input
            label="Quantity Units *"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Movement Reason / Reference *
          </label>
          <select
            className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 shadow-subtle mb-2"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          >
            <option value="">-- Select Reason --</option>
            {movementType === 'IN' ? (
              <>
                <option value="Supplier Purchase">Supplier Purchase</option>
                <option value="Stock Received">Stock Received</option>
                <option value="Customer Return">Customer Return</option>
              </>
            ) : (
              <>
                <option value="Sales Challan Dispatch">Sales Challan Dispatch</option>
                <option value="Damaged Stock">Damaged Stock</option>
                <option value="Internal Warehouse Transfer">Internal Warehouse Transfer</option>
              </>
            )}
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Record Movement
          </Button>
        </div>
      </form>
    </Modal>
  );
};
