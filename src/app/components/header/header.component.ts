import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  createOpen = false;
  convertOpen = false;

  constructor(private router: Router) {}

  toggleCreate() {
    this.createOpen = !this.createOpen;
    this.convertOpen = false;
  }

  toggleConvert() {
    this.convertOpen = !this.convertOpen;
    this.createOpen = false;
  }

  closeMenus() {
    this.createOpen = false;
    this.convertOpen = false;
  }

  // Create actions
  createNewPdf() {
    this.router.navigate(['/create'], { queryParams: { type: 'pdf' } });
    this.closeMenus();
  }

  createNewWord() {
    this.router.navigate(['/create'], { queryParams: { type: 'doc' } });
    this.closeMenus();
  }

  createNewPpt() {
    this.router.navigate(['/create'], { queryParams: { type: 'ppt' } });
    this.closeMenus();
  }

  // Convert actions
  convertPdfToWord() {
    console.log('Convert PDF to Word');
    this.closeMenus();
  }

  convertWordToPdf() {
    console.log('Convert Word to PDF');
    this.closeMenus();
  }

  convertPdfToJpg() {
    console.log('Convert PDF to JPG');
    this.closeMenus();
  }

  convertPdfToPng() {
    console.log('Convert PDF to PNG');
    this.closeMenus();
  }

  convertPdfToExcel() {
    console.log('Convert PDF to Excel');
    this.closeMenus();
  }

  convertPdfToPpt() {
    console.log('Convert PDF to PPT');
    this.closeMenus();
  }

  goHome() {
    this.router.navigate(['/']);
    this.closeMenus();
  }

  goToDocuments() {
    this.router.navigate(['/documents']);
    this.closeMenus();
  }
}
