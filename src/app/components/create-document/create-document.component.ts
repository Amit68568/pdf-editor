import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService, Document } from '../../services/storage.service';

@Component({
  selector: 'app-create-document',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-document.component.html',
  styleUrl: './create-document.component.scss'
})
export class CreateDocumentComponent {
  documentType: 'pdf' | 'doc' | 'ppt' = 'pdf';
  documentTitle: string = '';
  documentContent: string = '';
  isSaving = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  typeIcons: { [key: string]: string } = {
    pdf: '📄',
    doc: '📋',
    ppt: '📊'
  };

  typeLabels: { [key: string]: string } = {
    pdf: 'PDF Document',
    doc: 'Word Document',
    ppt: 'PowerPoint Presentation'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService
  ) {
    // Get type from route params
    const type = this.route.snapshot.queryParamMap.get('type');
    if (type === 'pdf' || type === 'doc' || type === 'ppt') {
      this.documentType = type;
      this.documentTitle = `Untitled ${this.typeLabels[type]}`;
    }
  }

  createDocument() {
    if (!this.documentTitle.trim()) {
      this.errorMessage = 'Please enter a document title';
      return;
    }

    this.isSaving = true;
    const newDoc: Partial<Document> = {
      name: this.documentTitle,
      type: this.documentType,
      content: this.documentContent || `# ${this.documentTitle}\n\nStart typing here...`
    };

    this.storageService.createDocument(newDoc).subscribe({
      next: (doc: Document) => {
        this.isSaving = false;
        this.successMessage = 'Document created successfully!';
        setTimeout(() => {
          this.router.navigate(['/editor', doc.id]);
        }, 1000);
      },
      error: (error: any) => {
        this.isSaving = false;
        this.errorMessage = 'Failed to create document';
        console.error('Error creating document:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  updateTitle(event: Event) {
    const input = event.target as HTMLInputElement;
    this.documentTitle = input.value;
  }
}
