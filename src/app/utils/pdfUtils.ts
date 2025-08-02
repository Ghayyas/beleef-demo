import { PDFDocument, rgb } from 'pdf-lib';
import { promises as fs } from 'fs';
import path from 'path';

interface FormData {
  address?: string;
  price?: string;
  date?: string;
  fullName?: string;
}

interface FillPDFResult {
  filename: string;
  pdfBytes: Uint8Array;
  success: boolean;
}

export class PDFUtils {
  private templatePath: string;
  private uploadsPath: string;

  constructor() {
    this.templatePath = path.join(process.cwd(), 'public', 'templates');
    this.uploadsPath = path.join(process.cwd(), 'public', 'uploads');
  }

    async fillPDFTemplate(templateName: string, formData: FormData): Promise<FillPDFResult> {
    try {
      console.log('🔄 Starting PDF generation with form data:', formData);

      const templateFilePath = path.join(this.templatePath, templateName);
      const templateBytes = await fs.readFile(templateFilePath);

      const pdfDoc = await PDFDocument.load(templateBytes);
      const pages = pdfDoc.getPages();

      if (pages.length === 0) {
        throw new Error('PDF template has no pages');
      }

      // Ensure we have at least 5 pages
      while (pdfDoc.getPageCount() < 5) {
        pdfDoc.addPage();
      }

      const allPages = pdfDoc.getPages();
      const [firstPage, secondPage, thirdPage, fourthPage, fifthPage] = allPages;
      const { width, height } = firstPage.getSize();

      console.log(`📄 PDF dimensions: ${width} x ${height}`);

      const fontSize = 14;
      const textColor = rgb(0, 0, 0);

      // Add form data to proper compliance document positions only

      // Add Address to Pages 2 and 4 (compliance form fields)
      if (formData.address) {
        console.log(`📝 Adding Address: "${formData.address}" to compliance pages`);

        secondPage.drawText(formData.address, {
          x: 195,
          y: 660,
          size: fontSize,
          color: textColor,
        });
        console.log(`✅ Address placed on Page 2 at (195, 660)`);

        fourthPage.drawText(formData.address, {
          x: 195,
          y: 658.5,
          size: fontSize,
          color: textColor,
        });
        console.log(`✅ Address placed on Page 4 at (195, 658.5)`);
      }

      // Add Price to Page 3 (compliance form field)
      if (formData.price) {
        console.log(`📝 Adding Price: "${formData.price}" to compliance page`);
        thirdPage.drawText(formData.price, {
          x: 140,
          y: 305,
          size: fontSize,
          color: textColor,
        });
        console.log(`✅ Price placed on Page 3 at (140, 305)`);
      }

      // Add Date to Pages 3, 4, and 5 (compliance form fields)
      if (formData.date) {
        console.log(`📝 Adding Date: "${formData.date}" to compliance pages`);

        thirdPage.drawText(formData.date, {
          x: 400,
          y: 155,
          size: fontSize,
          color: textColor,
        });
        console.log(`✅ Date placed on Page 3 at (400, 155)`);

        fourthPage.drawText(formData.date, {
          x: 410,
          y: 128,
          size: fontSize,
          color: textColor,
        });
        console.log(`✅ Date placed on Page 4 at (410, 128)`);

        fifthPage.drawText(formData.date, {
          x: 120,
          y: 280,
          size: fontSize,
          color: textColor,
        });
        console.log(`✅ Date placed on Page 5 at (120, 280)`);
      }

      // Add Full Name to Page 5 (compliance form field)
      if (formData.fullName) {
        console.log(`📝 Adding Full Name: "${formData.fullName}" to compliance page`);
        fifthPage.drawText(formData.fullName, {
          x: 150,
          y: 350,
          size: fontSize,
          color: textColor,
        });
        console.log(`✅ Full Name placed on Page 5 at (150, 350)`);
      }

      // Generate PDF in memory (no file system write needed)
      const timestamp = Date.now();
      const filename = `filled_document_${timestamp}.pdf`;

      const pdfBytes = await pdfDoc.save();

      console.log(`✅ PDF generated successfully: ${filename}`);
      console.log(`📦 PDF size: ${pdfBytes.length} bytes`);

      return {
        filename,
        pdfBytes,
        success: true
      };

    } catch (error) {
      console.error('Error filling PDF template:', error);
      throw new Error(`Failed to fill PDF template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listTemplates(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.templatePath);
      return files.filter(file => file.endsWith('.pdf'));
    } catch (error) {
      console.error('Error listing templates:', error);
      return [];
    }
  }

  async templateExists(templateName: string): Promise<boolean> {
    try {
      const templatePath = path.join(this.templatePath, templateName);
      await fs.access(templatePath);
      return true;
    } catch {
      return false;
    }
  }
}