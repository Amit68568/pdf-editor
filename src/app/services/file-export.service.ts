import { Injectable } from '@angular/core';
import { Document as DocxDocument, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } from 'docx';
// @ts-ignore
import html2pdf from 'html2pdf.js';

@Injectable({
  providedIn: 'root'
})
export class FileExportService {

  /**
   * Export document content as PDF (WYSIWYG)
   * Uses html2pdf.js to preserve formatting, fonts, and colors.
   */
  async exportAsPdf(fileName: string, content: string): Promise<void> {
    try {
      // Create a temporary container for formatting
      const element = document.createElement('div');
      element.innerHTML = content;

      // Apply basic styling to ensure it looks good in PDF
      // A4 is roughly 210mm x 297mm. 
      // html2pdf usually handles 1px = 1/96 (default) or similar.
      // We set a width to simulate the editor content width.
      element.style.width = '100%';
      element.style.padding = '20px';
      element.style.fontFamily = 'Arial, Helvetica, sans-serif'; // Default fallbacks
      element.style.lineHeight = '1.5';

      // Ensure images are accessible (if any)

      const opt: any = {
        margin: 0.5, // 0.5 inch margin
        filename: `${fileName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // Generate and save
      await html2pdf().set(opt).from(element).save();

    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw new Error('Failed to export PDF');
    }
  }

  /**
   * Export document content as Word document
   */
  async exportAsDocx(fileName: string, content: string): Promise<void> {
    try {
      const paragraphs: Paragraph[] = [];

      // Add content
      const plainText = this.stripHtml(content);
      const lines = plainText.split('\n');
      for (const line of lines) {
        if (line.trim()) {
          paragraphs.push(
            new Paragraph({
              text: line,
              spacing: { after: 200 }
            })
          );
        } else {
          // Empty line
          paragraphs.push(
            new Paragraph({
              text: '',
              spacing: { after: 100 }
            })
          );
        }
      }

      // Add timestamp
      const timestamp = new Date().toLocaleString();
      paragraphs.push(
        new Paragraph({
          text: `Generated on: ${timestamp}`,
          run: {
            italics: true,
            color: '808080'
          },
          spacing: { before: 400 }
        })
      );

      const doc = new DocxDocument({
        sections: [{
          properties: {},
          children: paragraphs
        }]
      });

      const blob = await Packer.toBlob(doc);
      this.downloadBlob(blob, `${fileName}.docx`);

    } catch (error) {
      console.error('Error exporting DOCX:', error);
      throw new Error('Failed to export Word document');
    }
  }

  /**
   * Export document content as plain text
   */
  exportAsText(fileName: string, content: string): void {
    const plainText = this.stripHtml(content);
    const text = `${plainText}\n\nGenerated on: ${new Date().toLocaleString()}`;
    const blob = new Blob([text], { type: 'text/plain' });
    this.downloadBlob(blob, `${fileName}.txt`);
  }

  /**
   * Export as Markdown
   */
  exportAsMarkdown(fileName: string, content: string): void {
    // Basic HTML to Markdown conversion (just strip tags for now to match other formats)
    const plainText = this.stripHtml(content);
    const markdown = `${plainText}\n\n---\n*Generated on: ${new Date().toLocaleString()}*`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    this.downloadBlob(blob, `${fileName}.md`);
  }

  /**
   * Convert PDF to Word (simulate - copy content)
   */
  async convertPdfToWord(fileName: string, content: string): Promise<void> {
    const docName = fileName.replace('.pdf', '');
    await this.exportAsDocx(docName, content);
  }

  /**
   * Convert Word to PDF (simulate - copy content)
   */
  async convertWordToPdf(fileName: string, content: string): Promise<void> {
    const pdfName = fileName.replace('.docx', '');
    await this.exportAsPdf(pdfName, content);
  }

  /**
   * Helper: Strip HTML tags to get plain text
   * Improved Regex approach for better layout preservation in plain text exports
   */
  private stripHtml(html: string): string {
    if (!html) return '';

    // 1. Explicitly replace block tags with newlines
    let text = html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<li>/gi, '  • '); // Add bullet point

    // 2. Strip all remaining HTML tags
    text = text.replace(/<[^>]+>/g, '');

    // 3. Decode known entities (basic) or use lightweight decoder
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');

    return text;
  }

  /**
   * Helper: Download blob as file
   */
  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
