import React from 'react';

interface BaseModalProps {
  children: React.ReactNode;
  isOpen: boolean;
}

const BaseModal: React.FC<BaseModalProps> = ({ children, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-sm">
        {children}
      </div>
    </div>
  );
};

export default BaseModal;