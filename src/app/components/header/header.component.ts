import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { StorageService, Document } from '../../services/storage.service';

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

  constructor(
    private router: Router,
    private storageService: StorageService
  ) { }

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
    this.createAndNavigate('Untitled PDF', 'pdf');
  }

  createNewWord() {
    this.createAndNavigate('Untitled Document', 'doc');
  }

  createNewPpt() {
    this.createAndNavigate('Untitled Presentation', 'ppt');
  }

  private createAndNavigate(name: string, type: 'pdf' | 'doc' | 'ppt') {
    this.storageService.createDocument({
      name: name,
      type: type,
      content: ''
    }).subscribe(doc => {
      this.closeMenus();
      this.router.navigate(['/editor', doc.id]);
    });
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
