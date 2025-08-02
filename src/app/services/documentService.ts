import axios from 'axios';

const API_BASE_URL = 'https://docbuilder-makg.onrender.com/api';

class DocumentService {
  async generateDocument(documentData: Record<string, unknown>) {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-document`, documentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error generating document:', error);

      // Handle different error types
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        // Server responded with error status
        const err = error as { response: { data?: { message?: string }, status?: number } };
        return {
          success: false,
          error: err.response.data?.message || 'Server error occurred',
          status: err.response.status
        };
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'request' in error
      ) {
        // Request was made but no response received
        return {
          success: false,
          error: 'No response from server. Please check if the server is running.',
        };
      } else {
        // Something else happened
        return {
          success: false,
          error: 'An unexpected error occurred',
        };
      }
    }
  }

  async downloadDocument(downloadUrl: string, filename = 'document.pdf') {
    try {
      console.log('Downloading from URL:', downloadUrl);
      console.log('Filename:', filename);

      // Option 1: Try direct download with window.open (for same-origin URLs)
      if (downloadUrl.startsWith('https://docbuilder-makg.onrender.com')) {
        // For production, try direct download
        const directLink = document.createElement('a');
        directLink.href = downloadUrl;
        directLink.setAttribute('download', filename);
        directLink.setAttribute('target', '_blank');
        document.body.appendChild(directLink);
        directLink.click();
        document.body.removeChild(directLink);
        return { success: true };
      }

      // Option 2: Use axios for blob download
      const response = await axios.get(downloadUrl, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
        }
      });

      // Create blob link to download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const blobLink = document.createElement('a');
      blobLink.href = url;
      blobLink.setAttribute('download', filename);
      document.body.appendChild(blobLink);
      blobLink.click();
      document.body.removeChild(blobLink);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error: unknown) {
      console.error('Error downloading document:', error);
      console.error('Download URL:', downloadUrl);

      let errorMsg = 'Failed to download document';
      if (error instanceof Error) {
        errorMsg += `: ${error.message}`;
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMsg += `: ${axiosError.response.data.message}`;
        }
      }

      return {
        success: false,
        error: errorMsg
      };
    }
  }
}

const documentService = new DocumentService();
export default documentService;