import { NextRequest, NextResponse } from 'next/server';
import { PDFUtils } from '@/app/utils/pdfUtils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      address,
      price,
      date,
      fullName,
      templateName = 'compliance.pdf'
    } = body;

    console.log('Received document generation request:', {
      address,
      price,

      date,
      fullName,
      templateName
    });

    // Validate required fields
    if (!address) {
      return NextResponse.json({
        error: 'Missing required fields',
        missingFields: ['address'],
        message: 'Please provide all required fields: address'
      }, { status: 400 });
    }

    const pdfUtils = new PDFUtils();

    // Check if template exists
    const templateExists = await pdfUtils.templateExists(templateName);
    if (!templateExists) {
      const availableTemplates = await pdfUtils.listTemplates();
      return NextResponse.json({
        error: 'Template not found',
        message: `Template '${templateName}' not found in templates folder`,
        availableTemplates
      }, { status: 404 });
    }

    // Fill the PDF template
    const formData = { address, price, date, fullName };
    const result = await pdfUtils.fillPDFTemplate(templateName, formData);

    return NextResponse.json({
      success: true,
      message: 'Document generated successfully',
      data: {
        documentId: result.filename.replace('.pdf', ''),
        generatedAt: new Date().toISOString(),
        customerInfo: {
          address,
          price,
          date,
          fullName
        },
        documentFile: {
          filename: result.filename,
          downloadUrl: result.downloadUrl,
          filePath: result.filePath
        }
      }
    });

  } catch (error) {
    console.error('Error generating document:', error);

    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Failed to generate document'
    }, { status: 500 });
  }
}