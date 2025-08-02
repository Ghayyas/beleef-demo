import React from 'react';
import './DownloadModal.css';
import { FormData } from '../../types/form';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadUrl: string;
  documentData: FormData;
  onDownload: () => Promise<void>;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  documentData,
  onDownload
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 transform transition-all animate-modal">
        <div className="bg-gradient-to-r from-yellow-50 to-red-600 px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Document Generated Successfully!</h2>
          <button
            onClick={onClose}
            className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4 animate-bounce">✅</div>
            <p className="text-gray-600">Your document has been generated with the following details:</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <p className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">Full Name:</span>
              <span>{documentData.fullName}</span>
            </p>
            <p className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">Address:</span>
              <span className="text-right flex-1 ml-4">{documentData.address}</span>
            </p>
            <p className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">Date:</span>
              <span>{documentData.date}</span>
            </p>
            <p className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">Price:</span>
              <span> {documentData.price}</span>
            </p>
        
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={onDownload}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-md font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-150"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
