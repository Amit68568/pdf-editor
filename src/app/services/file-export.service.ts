import { Injectable } from '@angular/core';
import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import { Document as DocxDocument, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } from 'docx';

@Injectable({
  providedIn: 'root'
})
export class FileExportService {

  /**
   * Export document content as PDF
   */
  async exportAsPdf(fileName: string, content: string): Promise<void> {
    try {
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([612, 792]); // Letter size
      const { height } = page.getSize();
      let y = height - 50;

      // Add title
      page.drawText(fileName, {
        x: 50,
        y: y,
        size: 14,
        color: rgb(0, 0, 0)
      });

      y -= 30;

      // Add content with word wrapping
      const lines = content.split('\n');
      const pageHeight = height - 100;
      const lineHeight = 15;
      const maxCharsPerLine = 90;

      for (const line of lines) {
        // Word wrap if line is too long
        const wrappedLines = this.wrapText(line, maxCharsPerLine);

        for (const wrappedLine of wrappedLines) {
          if (y < 50) {
            page = pdfDoc.addPage([612, 792]);
            y = height - 50;
          }

          page.drawText(wrappedLine, {
            x: 50,
            y: y,
            size: 11,
            color: rgb(0, 0, 0)
          });

          y -= lineHeight;
        }

        y -= 5; // Extra space between paragraphs
      }

      // Add timestamp
      const timestamp = new Date().toLocaleString();
      page.drawText(`Generated on: ${timestamp}`, {
        x: 50,
        y: 30,
        size: 9,
        color: rgb(100, 100, 100)
      });

      const pdfBytes = await pdfDoc.save();
      this.downloadFile(pdfBytes, `${fileName}.pdf`, 'application/pdf');

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

      // Add title
      paragraphs.push(
        new Paragraph({
          text: fileName,
          run: {
            bold: true,
            size: 28,
          },
          spacing: { after: 400 }
        })
      );

      // Add content
      const lines = content.split('\n');
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

      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer as unknown as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
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
    const text = `${fileName}\n${'='.repeat(fileName.length)}\n\n${content}\n\nGenerated on: ${new Date().toLocaleString()}`;
    const blob = new Blob([text], { type: 'text/plain' });
    this.downloadBlob(blob, `${fileName}.txt`);
  }

  /**
   * Export as Markdown
   */
  exportAsMarkdown(fileName: string, content: string): void {
    const markdown = `# ${fileName}\n\n${content}\n\n---\n*Generated on: ${new Date().toLocaleString()}*`;
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
   * Helper: Wrap text to fit line width
   */
  private wrapText(text: string, maxCharsPerLine: number): string[] {
    const lines: string[] = [];
    let currentLine = '';

    const words = text.split(' ');
    for (const word of words) {
      if ((currentLine + word).length > maxCharsPerLine) {
        if (currentLine) {
          lines.push(currentLine.trim());
        }
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }

    if (currentLine) {
      lines.push(currentLine.trim());
    }

    return lines.length > 0 ? lines : [text];
  }

  /**
   * Helper: Download bytes as file
   */
  private downloadFile(data: Uint8Array, filename: string, mimeType: string): void {
    const blob = new Blob([data as unknown as BlobPart], { type: mimeType });
    this.downloadBlob(blob, filename);
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
