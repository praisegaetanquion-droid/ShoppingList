import React from 'react';
import BaseModal from './BaseModal';
import { AlertTriangleIcon, XCircleIcon } from '../icons';

type ModalType = 'delete' | 'warning';

interface ConfirmModalProps {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const icons = {
  delete: <XCircleIcon className="w-12 h-12 text-red-400" />,
  warning: <AlertTriangleIcon className="w-12 h-12 text-yellow-400" />,
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}) => {
  return (
    <BaseModal isOpen={isOpen}>
      <div className="p-6 flex flex-col items-center text-center">
        <div className="p-3 bg-opacity-20 rounded-full mb-4">
          {icons[type]}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{message}</p>
        
        {type === 'delete' && (
          <div className="flex gap-4 w-full">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-full"
            >
              {cancelText || 'Cancel'}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded-full"
            >
              {confirmText || 'Delete'}
            </button>
          </div>
        )}
        
        {type === 'warning' && (
           <button
             onClick={onConfirm}
             className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-full"
           >
             {confirmText || 'Got it'}
           </button>
        )}
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;