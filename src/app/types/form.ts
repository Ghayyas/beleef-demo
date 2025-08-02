export interface FormData extends Record<string, unknown> {
  fullName: string;
  address: string;
  date: string;
  price: string;
}

export interface DocumentResponse {
  data: {
    documentFile: {
      downloadUrl: string;
      filename: string;
    };
  };
}
