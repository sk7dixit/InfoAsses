import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { customerApi } from '../../services/customer.api';
import { Customer } from '../../types';

const customerSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  mobile: z.string().min(8, 'Mobile number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  businessName: z.string().optional(),
  gstNumber: z.string().optional(),
  customerType: z.enum(['RETAIL', 'WHOLESALE', 'DISTRIBUTOR']),
  status: z.enum(['LEAD', 'ACTIVE', 'INACTIVE']),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSuccess: () => void;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  customer,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerType: 'RETAIL',
      status: 'LEAD',
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        customerName: customer.customerName,
        mobile: customer.mobile,
        email: customer.email || '',
        businessName: customer.businessName || '',
        gstNumber: customer.gstNumber || '',
        customerType: customer.customerType,
        status: customer.status,
        address: customer.address || '',
        notes: customer.notes || '',
      });
    } else {
      reset({
        customerName: '',
        mobile: '',
        email: '',
        businessName: '',
        gstNumber: '',
        customerType: 'RETAIL',
        status: 'LEAD',
        address: '',
        notes: '',
      });
    }
  }, [customer, reset, isOpen]);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (customer) {
        await customerApi.updateCustomer(customer.id, data);
      } else {
        await customerApi.createCustomer(data);
      }
      onSuccess();
      onClose();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to save customer');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? 'Edit Customer Details' : 'Add New CRM Customer'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Customer Name *"
            placeholder="John Doe / TechCorp"
            {...register('customerName')}
            error={errors.customerName?.message}
          />
          <Input
            label="Mobile Number *"
            placeholder="+91 9876543210"
            {...register('mobile')}
            error={errors.mobile?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="client@company.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Business Name"
            placeholder="Acme Solutions Pvt Ltd"
            {...register('businessName')}
            error={errors.businessName?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="GST Number"
            placeholder="27AAAAA0000A1Z5"
            {...register('gstNumber')}
            error={errors.gstNumber?.message}
          />
          <Select
            label="Customer Type *"
            options={[
              { value: 'RETAIL', label: 'Retail Client' },
              { value: 'WHOLESALE', label: 'Wholesale Buyer' },
              { value: 'DISTRIBUTOR', label: 'Distributor Partner' },
            ]}
            {...register('customerType')}
            error={errors.customerType?.message}
          />
          <Select
            label="CRM Status *"
            options={[
              { value: 'LEAD', label: 'Lead' },
              { value: 'ACTIVE', label: 'Active Account' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]}
            {...register('status')}
            error={errors.status?.message}
          />
        </div>

        <Input
          label="Billing / Shipping Address"
          placeholder="Street, City, Pin Code"
          {...register('address')}
          error={errors.address?.message}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Initial CRM Notes
          </label>
          <textarea
            rows={3}
            className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 shadow-subtle"
            placeholder="Specific preferences, deal requirements, or background context..."
            {...register('notes')}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {customer ? 'Update Customer' : 'Create Customer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
