'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import documentService from '../services/documentService';
import DownloadModal from './modals/DownloadModal';
import { FormData, DocumentResponse } from '../types/form';

const UserForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    address: '',
    date: '',
    price: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<DocumentResponse | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDownloadUrl('');

    try {
      const result = await documentService.generateDocument(formData as Record<string, unknown>);
            console.log({result});
      if (result.success) {
        console.log('Document generated:', result.data);
        setApiResponse(result.data as DocumentResponse);

        // Set download URL and show modal
        if (result.data?.data?.documentFile?.downloadUrl) {
          const downloadUrl = result.data.data.documentFile.downloadUrl;
          console.log('Download URL:', downloadUrl);
          console.log('Document filename:', result.data.data.documentFile.filename);
          setDownloadUrl(downloadUrl);
          setShowModal(true);
        } else {
          console.error('No download URL found in response:', result.data);
        }
      } else {
        setError(result.error ?? 'Failed to generate document');
        console.error('Failed to generate document:', result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (downloadUrl && apiResponse?.data?.documentFile?.filename) {
      const result = await documentService.downloadDocument(downloadUrl, apiResponse.data.documentFile.filename);
      if (!result.success) {
        setError(result.error ?? 'Failed to download document');
      }
    } else {
      // Fallback: just trigger download with generic filename
      if (downloadUrl) {
        const result = await documentService.downloadDocument(downloadUrl, 'document.pdf');
        if (!result.success) {
          setError(result.error ?? 'Failed to download document');
        }
      }
    }
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
  };

  const handleFillTestData = (testData: FormData): void => {
    setFormData(testData);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Beleef Form</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative group">
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="block h-16 w-full text-gray-900 bg-transparent rounded-t-lg px-4 pt-5 pb-2.5
              border-0 border-b-2 border-gray-300 appearance-none
              focus:outline-none focus:ring-0 focus:border-indigo-600 peer text-base
              transition-colors duration-200 ease-in-out
              group-hover:border-gray-400"
              placeholder=" "
              required
            />
            <label
              htmlFor="fullName"
              className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
              peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
            >
              Full Name
            </label>
          </div>

          <div className="relative group">
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="block min-h-[120px] w-full text-gray-900 bg-transparent rounded-lg px-4 pt-8 pb-2.5
              border-2 border-gray-300 appearance-none resize-none
              focus:outline-none focus:ring-0 focus:border-indigo-600 peer text-base
              transition-colors duration-200 ease-in-out
              group-hover:border-gray-400"
              placeholder=" "
              required
            />
            <label
              htmlFor="address"
              className="absolute text-base text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
              peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-indigo-600"
            >
              Address
            </label>
          </div>

          <div className="relative group">
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="block h-16 w-full text-gray-900 bg-transparent rounded-lg px-4 pt-5 pb-2.5
              border-2 border-gray-300 appearance-none
              focus:outline-none focus:ring-0 focus:border-indigo-600 peer text-base
              transition-colors duration-200 ease-in-out
              group-hover:border-gray-400"
              required
            />
            <label
              htmlFor="date"
              className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4"
            >
              Date
            </label>
          </div>

              <div className="relative group">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="block h-16 w-full text-gray-900 bg-transparent rounded-lg px-4 pt-5 pb-2.5
                  border-2 border-gray-300 appearance-none
                  focus:outline-none focus:ring-0 focus:border-indigo-600 peer text-base
                  transition-colors duration-200 ease-in-out
                  group-hover:border-gray-400"
                  placeholder=" "
                  min={0}
                  required
                />
                <label
                  htmlFor="price"
                  className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                  peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
                >
                  Price
                </label>
              </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Generating PDF...' : 'Generate PDF Document'}
          </button>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">❌ {error}</p>
            </div>
          )}

          <DownloadModal
            isOpen={showModal}
            onClose={handleCloseModal}
            downloadUrl={downloadUrl}
            documentData={formData}
            onDownload={handleDownload}
          />
        </form>
      </div>
    </div>
  );
};

export default UserForm;
