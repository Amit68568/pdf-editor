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
  editOpen = false;

  constructor(private router: Router) { }

  openCreate() {
    this.createOpen = true;
    this.convertOpen = false;
    this.editOpen = false;
  }

  closeCreate() {
    this.createOpen = false;
  }

  openConvert() {
    this.convertOpen = true;
    this.createOpen = false;
    this.editOpen = false;
  }

  closeConvert() {
    this.convertOpen = false;
  }

  openEdit() {
    this.editOpen = true;
    this.createOpen = false;
    this.convertOpen = false;
  }

  closeEdit() {
    this.editOpen = false;
  }

  closeMenus() {
    this.createOpen = false;
    this.convertOpen = false;
    this.editOpen = false;
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

  // Edit actions (Placeholders)
  editPdf() {
    console.log('Edit PDF clicked');
    this.closeMenus();
  }

  editDoc() {
    console.log('Edit Doc clicked');
    this.closeMenus();
  }

  editPpt() {
    console.log('Edit PPT clicked');
    this.closeMenus();
  }

  mergePdf() {
    console.log('Merge PDF clicked');
    this.closeMenus();
  }

  splitPdf() {
    console.log('Split PDF clicked');
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
}
