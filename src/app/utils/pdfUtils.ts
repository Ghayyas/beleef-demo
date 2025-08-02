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

      // Add Full Name on Page 1 (more visible)
      if (formData.fullName) {
        console.log(`📝 Adding Full Name: "${formData.fullName}"`);
        firstPage.drawText(`Full Name: ${formData.fullName}`, {
          x: 50,
          y: height - 100,
          size: fontSize,
          color: textColor,
        });
        console.log(`✅ Full Name placed on page 1 at (50, ${height - 100})`);
      }

      // Add Address on Page 1 (more visible)
      if (formData.address) {
        console.log(`📝 Adding Address: "${formData.address}"`);
        firstPage.drawText(`Address: ${formData.address}`, {
          x: 50,
          y: height - 140,
          size: fontSize,
          color: textColor,
        });
        console.log(`✅ Address placed on page 1 at (50, ${height - 140})`);
      }

      // Add Date on Page 1 (more visible)
      if (formData.date) {
        console.log(`📝 Adding Date: "${formData.date}"`);
        firstPage.drawText(`Date: ${formData.date}`, {
          x: 50,
          y: height - 180,
          size: fontSize,
          color: textColor,
        });
        console.log(`✅ Date placed on page 1 at (50, ${height - 180})`);
      }

      // Add Price on Page 1 (more visible)
      if (formData.price) {
        console.log(`📝 Adding Price: "${formData.price}"`);
        firstPage.drawText(`Price: $${formData.price}`, {
          x: 50,
          y: height - 220,
          size: fontSize,
          color: textColor,
        });
        console.log(`✅ Price placed on page 1 at (50, ${height - 220})`);
      }

      // Also add to original positions for compliance
      if (formData.address) {
        secondPage.drawText(formData.address, {
          x: 195,
          y: 660,
          size: fontSize,
          color: textColor,
        });

        fourthPage.drawText(formData.address, {
          x: 195,
          y: 658.5,
          size: fontSize,
          color: textColor,
        });
      }

      if (formData.price) {
        thirdPage.drawText(formData.price, {
          x: 140,
          y: 305,
          size: fontSize,
          color: textColor,
        });
      }

      if (formData.date) {
        thirdPage.drawText(formData.date, {
          x: 400,
          y: 155,
          size: fontSize,
          color: textColor,
        });

        fourthPage.drawText(formData.date, {
          x: 410,
          y: 128,
          size: fontSize,
          color: textColor,
        });

        fifthPage.drawText(formData.date, {
          x: 120,
          y: 280,
          size: fontSize,
          color: textColor,
        });
      }

      if (formData.fullName) {
        fifthPage.drawText(formData.fullName, {
          x: 150,
          y: 350,
          size: fontSize,
          color: textColor,
        });
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