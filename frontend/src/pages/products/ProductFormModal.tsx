import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { productApi } from '../../services/product.api';
import { Product } from '../../types';
import { Upload, Image as ImageIcon } from 'lucide-react';

const productSchema = z.object({
  productName: z.string().min(2, 'Product name is required'),
  sku: z.string().min(2, 'SKU is required'),
  category: z.string().min(2, 'Category is required'),
  unitPrice: z.coerce.number().positive('Unit price must be positive'),
  currentStock: z.coerce.number().int().min(0, 'Current stock cannot be negative').default(0),
  minimumStock: z.coerce.number().int().min(0, 'Minimum stock cannot be negative').default(5),
  warehouseLocation: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        productName: product.productName,
        sku: product.sku,
        category: product.category,
        unitPrice: Number(product.unitPrice),
        currentStock: product.currentStock,
        minimumStock: product.minimumStock,
        warehouseLocation: product.warehouseLocation || '',
      });
      setPreviewUrl(product.imageUrl || null);
    } else {
      reset({
        productName: '',
        sku: '',
        category: '',
        unitPrice: 0,
        currentStock: 0,
        minimumStock: 5,
        warehouseLocation: '',
      });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
  }, [product, reset, isOpen]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData();
      formData.append('productName', data.productName);
      formData.append('sku', data.sku);
      formData.append('category', data.category);
      formData.append('unitPrice', data.unitPrice.toString());
      formData.append('currentStock', data.currentStock.toString());
      formData.append('minimumStock', data.minimumStock.toString());
      if (data.warehouseLocation) formData.append('warehouseLocation', data.warehouseLocation);
      if (selectedFile) formData.append('image', selectedFile);

      if (product) {
        await productApi.updateProduct(product.id, formData);
      } else {
        await productApi.createProduct(formData);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save product master');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product Master' : 'Add New Product Master'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Product Name *"
            placeholder="UltraWide Monitor 34-inch"
            {...register('productName')}
            error={errors.productName?.message}
          />
          <Input
            label="SKU Code *"
            placeholder="MON-34-001"
            disabled={!!product}
            {...register('sku')}
            error={errors.sku?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Category *"
            placeholder="Laptops / Peripherals / Displays"
            {...register('category')}
            error={errors.category?.message}
          />
          <Input
            label="Unit Price (INR) *"
            type="number"
            step="0.01"
            placeholder="12500.00"
            {...register('unitPrice')}
            error={errors.unitPrice?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Minimum Stock Alert Limit *"
            type="number"
            placeholder="5"
            {...register('minimumStock')}
            error={errors.minimumStock?.message}
          />
          <Input
            label="Warehouse Location"
            placeholder="Warehouse A / Shelf A-101"
            {...register('warehouseLocation')}
            error={errors.warehouseLocation?.message}
          />
        </div>

        {/* CURRENT STOCK INFORMATIONAL BADGE FOR WAREHOUSE WORKFLOW */}
        {product ? (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-700 block">Current Stock</span>
              <span className="text-[11px] text-slate-500">Stock changes are recorded through Stock IN / OUT movements</span>
            </div>
            <span className="font-mono font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-subtle">
              {product.currentStock} units
            </span>
          </div>
        ) : (
          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-800 flex items-center justify-between">
            <span>New product initial stock defaults to <strong>0 units</strong>. Record a <strong>Stock IN</strong> movement to add inventory.</span>
            <input type="hidden" value={0} {...register('currentStock')} />
          </div>
        )}

        {/* Cloudinary Image Upload Section */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Product Image (Cloudinary Upload)
          </label>
          <div className="flex items-center space-x-4 border border-dashed border-slate-300 p-4 rounded-lg bg-slate-50">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Product preview"
                className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow-subtle shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}
            <div className="flex-1 space-y-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="product-image-upload"
              />
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<Upload className="w-4 h-4" />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedFile ? 'Change Image' : 'Select Image File'}
                </Button>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(product?.imageUrl || null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {selectedFile
                  ? `Selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`
                  : 'PNG, JPG, WEBP up to 5MB (Uploads directly to Cloudinary)'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
