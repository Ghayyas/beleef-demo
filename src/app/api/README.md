# API Documentation

## Generate Document Endpoint

**POST** `/api/generate-document`

### Description
Generates a PDF document by filling a template with provided form data. Returns the PDF file directly for download.

### Request Body
```json
{
  "address": "string (required)",
  "price": "string (optional)",
  "date": "string (optional)",
  "fullName": "string (optional)",
  "templateName": "string (optional, defaults to 'compliance.pdf')"
}
```

### Response
- **Content-Type**: `application/pdf`
- **Content-Disposition**: `attachment; filename="filled_document_[timestamp].pdf"`
- **Body**: Binary PDF data

The API returns the generated PDF file directly as a binary response, ready for download.

### Error Responses
- **400 Bad Request**: Missing required fields
- **404 Not Found**: Template not found
- **500 Internal Server Error**: PDF generation failed

### Example Usage
```bash
# Generate and download PDF directly
curl -X POST http://localhost:3000/api/generate-document \
  -H "Content-Type: application/json" \
  -d '{
    "address": "123 Main Street",
    "fullName": "John Doe",
    "date": "2024-01-15",
    "price": "150000"
  }' \
  --output document.pdf
```

### Features
- ✅ **Vercel Compatible**: No file system writes required
- ✅ **Direct PDF Download**: Returns PDF binary data directly
- ✅ **Automatic Download**: Frontend triggers download automatically
- ✅ **Form Data Integration**: Fills PDF with user-submitted data
- ✅ **Error Handling**: Proper error responses for missing templates/data

### File Structure
- Templates: `public/templates/`
- PDF Utils: `src/app/utils/pdfUtils.ts`
- Frontend Service: `src/app/services/documentService.ts`