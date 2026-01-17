import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { StorageService, Document } from '../../services/storage.service';
import { FileExportService } from '../../services/file-export.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, CKEditorModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnInit, OnDestroy {
  document: Document | null = null;
  editingContent: string = '';
  isLoading = false;
  isSaving = false;
  isExporting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  private destroy$ = new Subject<void>();

  public Editor = ClassicEditor;
  public config = {
    toolbar: [
      'heading', '|',
      'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
      'insertTable', '|',
      'undo', 'redo'
    ],
    placeholder: 'Start writing your document...'
  };

  constructor(
    private documentService: DocumentService,
    private storageService: StorageService,
    private fileExportService: FileExportService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDocument(id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load document from local storage
   */
  loadDocument(id: string): void {
    this.isLoading = true;
    this.storageService.getDocument(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (doc: Document | undefined) => {
          if (doc) {
            this.document = doc;
            this.editingContent = doc.content || '';
            this.isLoading = false;
            this.documentService.setCurrentDocument(doc);
          } else {
            this.errorMessage = 'Document not found';
            this.isLoading = false;
          }
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to load document';
          this.isLoading = false;
          console.error('Error loading document:', error);
        }
      });
  }

  /**
   * Save document changes to local storage
   */
  saveDocument(): void {
    if (!this.document) {
      this.errorMessage = 'No document selected';
      return;
    }

    this.isSaving = true;
    this.storageService.updateDocument(this.document.id, {
      content: this.editingContent
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated: Document | undefined) => {
          if (updated) {
            this.document = updated;
            this.successMessage = 'Document saved successfully!';
            this.isSaving = false;
            setTimeout(() => this.successMessage = null, 3000);
          }
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to save document';
          this.isSaving = false;
          console.error('Error saving document:', error);
        }
      });
  }

  /**
   * Download document to local device
   */
  async downloadDocument(): Promise<void> {
    if (!this.document) return;

    this.isExporting = true;
    try {
      const baseName = this.document.name.replace(/\.(pdf|docx?|pptx?)$/i, '');

      if (this.document.type === 'pdf') {
        await this.fileExportService.exportAsPdf(baseName, this.editingContent);
      } else {
        // For 'doc' and 'ppt' 
        await this.fileExportService.exportAsDocx(baseName, this.editingContent);
      }
      this.successMessage = 'File downloaded successfully!';
      setTimeout(() => this.successMessage = null, 3000);
    } catch (error) {
      this.errorMessage = 'Failed to download file';
      console.error('Error downloading file:', error);
    } finally {
      this.isExporting = false;
    }
  }

  /**
   * Navigate back to documents list
   */
  goBack(): void {
    this.router.navigate(['/']);
  }
}

