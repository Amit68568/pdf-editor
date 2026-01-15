import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { StorageService, Document } from '../../services/storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  isLoading = false;
  isUploading = false;
  showUploadForm = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedFile: File | null = null;
  fileType: 'pdf' | 'doc' = 'pdf';
  private destroy$ = new Subject<void>();

  constructor(
    private documentService: DocumentService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all documents from local storage
   */
  loadDocuments(): void {
    this.isLoading = true;
    this.storageService.getAllDocuments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (docs: Document[]) => {
          this.documents = docs;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to load documents';
          this.isLoading = false;
          console.error('Error loading documents:', error);
        }
      });
  }

  /**
   * Handle file selection
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  /**
   * Upload document to local storage
   */
  uploadDocument(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file';
      return;
    }

    this.isUploading = true;
    this.storageService.uploadDocument(this.selectedFile, this.fileType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (doc: Document) => {
          this.documents.push(doc);
          this.successMessage = 'Document uploaded successfully!';
          this.selectedFile = null;
          this.isUploading = false;
          // Reset file input
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to upload document';
          this.isUploading = false;
          console.error('Error uploading document:', error);
        }
      });
  }

  /**
   * Open document editor
   */
  editDocument(doc: Document): void {
    this.router.navigate(['/editor', doc.id]);
  }

  /**
   * Delete document from local storage
   */
  deleteDocument(id: string): void {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    this.storageService.deleteDocument(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.documents = this.documents.filter(d => d.id !== id);
          this.successMessage = 'Document deleted successfully!';
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to delete document';
          console.error('Error deleting document:', error);
        }
      });
  }

  /**
   * Format date
   */
  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }

  /**
   * Toggle upload form visibility
   */
  toggleUploadForm(): void {
    this.showUploadForm = !this.showUploadForm;
  }
}
