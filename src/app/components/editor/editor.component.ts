import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { StorageService, Document } from '../../services/storage.service';
import { FileExportService } from '../../services/file-export.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  ClassicEditor,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Font,
  Alignment,
  Essentials,
  Paragraph,
  RemoveFormat,
  List,
  TodoList,
  Indent,
  Link,
  BlockQuote,
  Table,
  TableToolbar,
  HorizontalLine,
  Autoformat,
  Undo
} from 'ckeditor5';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, CKEditorModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild('editorToolbar') editorToolbar!: ElementRef;

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
    licenseKey: 'GPL',
    plugins: [
      Essentials, Paragraph, Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
      Font, Alignment, RemoveFormat, List, TodoList, Indent, Link, BlockQuote,
      Table, TableToolbar, HorizontalLine, Autoformat, Undo
    ],
    toolbar: [
      'heading', '|',
      'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
      'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'removeFormat', '|',
      'alignment', '|',
      'bulletedList', 'numberedList', 'todoList', '|',
      'outdent', 'indent', '|',
      'link', 'blockQuote', 'insertTable', 'horizontalLine', '|',
      'undo', 'redo'
    ],
    placeholder: 'Start writing your document...'
  };

  // Editor Toolbar State
  zoomLevel: number = 100;
  currentPage: number = 1;
  totalPages: number = 1;
  isFullScreen: boolean = false;
  private readonly A4_HEIGHT_PX = 1056;

  constructor(
    private documentService: DocumentService,
    private storageService: StorageService,
    private fileExportService: FileExportService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Listen to scroll events to update current page
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDocument(id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  /**
   * Update page statistics based on content and scroll
   */
  private updatePageStats(): void {
    // Estimate total pages based on content length or scroll height
    // Since CKEditor grows, we can use the document height approximation
    const editorElement = document.querySelector('.ck-content');
    if (editorElement) {
      const height = editorElement.getBoundingClientRect().height;
      this.totalPages = Math.max(1, Math.ceil(height / this.A4_HEIGHT_PX));
    }
  }

  private onScroll(): void {
    const scrollY = window.scrollY;
    // Offset by header/toolbar height approx 150px
    this.currentPage = Math.max(1, Math.ceil((scrollY + 200) / (this.A4_HEIGHT_PX * (this.zoomLevel / 100))));
    this.updatePageStats();
  }

  // Hook into content changes to update stats
  onContentChange(): void {
    // Debounce or just call update
    setTimeout(() => this.updatePageStats(), 100);
  }

  onEditorReady(editor: any): void {
    // Merge the custom toolbar items into the main CKEditor toolbar
    const toolbarElement = editor.ui.view.toolbar.element;
    // The items list is usually a flex container inside
    const itemsContainer = toolbarElement.querySelector('.ck-toolbar__items');
    const myToolbar = this.editorToolbar.nativeElement;

    if (itemsContainer && myToolbar) {
      // Append our toolbar controls to the end of the existing items
      itemsContainer.appendChild(myToolbar);
    }
  }

  /**
   * Navigate back to documents list
   */
  goBack(): void {
    this.router.navigate(['/']);
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
      let baseName = this.document.name.replace(/\.(pdf|docx?|pptx?)$/i, '');
      const userInput = prompt('Enter file name to download:', baseName);

      if (userInput === null) {
        this.isExporting = false;
        return; // User cancelled
      }

      baseName = userInput.trim() || baseName;

      // Optionally update document name if changed
      if (baseName !== this.document.name) {
        this.document.name = baseName;
        this.saveDocument();
      }

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



  toggleFullScreen(): void {
    try {
      this.isFullScreen = !this.isFullScreen;
      console.log('Fullscreen toggled to:', this.isFullScreen);

      // Update stats safely
      setTimeout(() => {
        try {
          this.updatePageStats();
        } catch (e) {
          console.warn('Error updating page stats:', e);
        }
      }, 100);
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  }
}

