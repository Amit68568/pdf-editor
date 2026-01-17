import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  features = [
    {
      icon: '📄',
      title: 'Create Documents',
      description: 'Create beautiful PDF and Word documents directly in your browser'
    },
    {
      icon: '✏️',
      title: 'Edit & Manage',
      description: 'Edit your documents with a clean, intuitive editor interface'
    },
    {
      icon: '💾',
      title: 'Save Locally',
      description: 'All your documents are safely stored in your browser storage'
    },
    {
      icon: '📥',
      title: 'Export Anywhere',
      description: 'Download your documents as PDF or Word formats instantly'
    },
    {
      icon: '🌐',
      title: 'Works Offline',
      description: 'No internet connection needed - create and edit anywhere'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Instant file generation and export without server delays'
    }
  ];

  stats = [
    { number: '100%', label: 'Offline' },
    { number: 'Instant', label: 'Export' },
    { number: 'No', label: 'Account Needed' },
    { number: 'Free', label: 'Forever' }
  ];

  constructor(
    private router: Router,
    private documentService: DocumentService
  ) { }

  navigateToCreate() {
    this.router.navigate(['/create']);
  }

  triggerFileUpload() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput?.click();
  }

  infoFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      const type = file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.pptx') || file.name.endsWith('.ppt') ? 'ppt' : 'doc';

      this.documentService.uploadDocument(file, type).subscribe({
        next: (doc) => {
          this.router.navigate(['/editor', doc.id]);
        },
        error: (err) => {
          console.error('Error uploading file:', err);
          alert('Failed to upload file');
        }
      });
    }
  }
}
