# API Documentation

## Generate Document Endpoint

**POST** `/api/generate-document`

### Description
Generates a PDF document by filling a template with provided form data.

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
```json
{
  "success": true,
  "message": "Document generated successfully",
  "data": {
    "documentId": "string",
    "generatedAt": "ISO date string",
        "customerInfo": {
      "address": "string",
      "price": "string",
      "date": "string",
      "fullName": "string"
    },
    "documentFile": {
      "filename": "string",
      "downloadUrl": "string",
      "filePath": "string"
    }
  }
}
```

### Error Responses
- **400 Bad Request**: Missing required fields
- **404 Not Found**: Template not found
- **500 Internal Server Error**: PDF generation failed

### Example Usage
```bash
curl -X POST http://localhost:3000/api/generate-document \
  -H "Content-Type: application/json" \
  -d '{
    "address": "123 Main Street",
    "fullName": "John Doe",
    "date": "2024-01-15",
    "price": "150000"
  }'
```

### File Structure
- Templates: `public/templates/`
- Generated files: `public/uploads/`
- PDF Utils: `src/app/utils/pdfUtils.ts`