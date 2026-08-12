import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  itemName?: string;
  itemType?: string;
  description?: string;
  isLoading?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  itemName,
  itemType = 'item',
  description,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4 text-xs">
        <div className="p-4 bg-rose-50 border border-rose-200/90 rounded-2xl flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="space-y-1 text-left">
            <h4 className="font-bold text-slate-900 text-sm">
              Are you sure you want to delete {itemName ? <span className="text-rose-700 font-extrabold">"{itemName}"</span> : `this ${itemType}`}?
            </h4>
            <p className="text-slate-600 leading-relaxed text-xs">
              {description || `This action cannot be undone. This ${itemType} and all associated records will be permanently removed from your workspace.`}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
            icon={<Trash2 className="w-4 h-4" />}
          >
            Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
