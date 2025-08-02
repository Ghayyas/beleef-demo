// API Configuration
export const API_BASE_URL = 'https://docbuilder-makg.onrender.com/api';

// Default form data for testing
export const DEFAULT_TEST_DATA = {
  "address": "House # 123, Street 15, F-8/2, Islamabad",
  "priceFrom": "5000",
  "priceTo": "10000",
  "salespersonName": "Ahmed Hassan",
  "date": "2024-01-15",
  "fullName": "Muhammad Ali Khan"
};

// Price options for dropdowns
export const PRICE_OPTIONS = [
  { value: "1000", label: "1,000" },
  { value: "2500", label: "2,500" },
  { value: "5000", label: "5,000" },
  { value: "7500", label: "7,500" },
  { value: "10000", label: "10,000" },
  { value: "15000", label: "15,000" },
  { value: "20000", label: "20,000" },
  { value: "25000", label: "25,000" },
  { value: "30000", label: "30,000" },
  { value: "50000", label: "50,000" },
  { value: "75000", label: "75,000" },
  { value: "100000", label: "100,000" }
];

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'No response from server. Please check if the server is running.',
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  DOWNLOAD_ERROR: 'Failed to download document',
  VALIDATION_ERROR: 'Please fill in all required fields'
};