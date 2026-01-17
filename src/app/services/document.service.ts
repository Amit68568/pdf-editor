import { Injectable } from '@angular/core';
import { StorageService, Document } from './storage.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private currentDocument = new BehaviorSubject<Document | null>(null);
  currentDocument$ = this.currentDocument.asObservable();

  constructor(private storageService: StorageService) { }

  /**
   * Fetch all documents from local storage
   */
  getAllDocuments(): Observable<Document[]> {
    return this.storageService.getAllDocuments();
  }

  /**
   * Get a specific document by ID from local storage
   */
  getDocument(id: string): Observable<Document | undefined> {
    return this.storageService.getDocument(id);
  }

  /**
   * Create a new document in local storage
   */
  createDocument(document: Partial<Document>): Observable<Document> {
    return this.storageService.createDocument(document);
  }

  /**
   * Update a document in local storage
   */
  updateDocument(id: string, updates: Partial<Document>): Observable<Document | undefined> {
    return this.storageService.updateDocument(id, updates);
  }

  /**
   * Delete a document from local storage
   */
  deleteDocument(id: string): Observable<void> {
    return this.storageService.deleteDocument(id);
  }

  /**
   * Upload a document file
   */
  uploadDocument(file: File, type: 'pdf' | 'doc' | 'ppt'): Observable<Document> {
    return this.storageService.uploadDocument(file, type);
  }

  /**
   * Set current document
   */
  setCurrentDocument(document: Document): void {
    this.currentDocument.next(document);
  }

  /**
   * Get current document
   */
  getCurrentDocument(): Document | null {
    return this.currentDocument.value;
  }
}

