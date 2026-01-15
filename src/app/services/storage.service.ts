import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc';
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'documents';
  private documentsSubject = new BehaviorSubject<Document[]>([]);
  documents$ = this.documentsSubject.asObservable();

  constructor() {
    this.loadDocuments();
  }

  private loadDocuments(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const documents = stored ? JSON.parse(stored) : this.getDefaultDocuments();
      this.documentsSubject.next(documents);
    } catch (error) {
      console.error('Error loading documents from storage:', error);
      this.documentsSubject.next(this.getDefaultDocuments());
    }
  }

  private getDefaultDocuments(): Document[] {
    return [
      {
        id: '1',
        name: 'Sample PDF Document',
        type: 'pdf',
        content: 'This is a sample PDF document for testing.',
        createdAt: new Date('2025-01-14T10:00:00Z'),
        updatedAt: new Date('2025-01-15T09:15:00Z')
      },
      {
        id: '2',
        name: 'Sample Word Document',
        type: 'doc',
        content: 'This is a sample Word document for testing.',
        createdAt: new Date('2025-01-14T14:30:00Z'),
        updatedAt: new Date('2025-01-15T09:15:00Z')
      }
    ];
  }

  private saveToStorage(documents: Document[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(documents));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  getAllDocuments(): Observable<Document[]> {
    return this.documents$;
  }

  getDocument(id: string): Observable<Document | undefined> {
    const docs = this.documentsSubject.value;
    return of(docs.find(doc => doc.id === id));
  }

  createDocument(document: Partial<Document>): Observable<Document> {
    const newDoc: Document = {
      id: this.generateId(),
      name: document.name || 'Untitled',
      type: document.type || 'pdf',
      content: document.content || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docs = [...this.documentsSubject.value, newDoc];
    this.documentsSubject.next(docs);
    this.saveToStorage(docs);

    return of(newDoc);
  }

  updateDocument(id: string, updates: Partial<Document>): Observable<Document | undefined> {
    const docs = this.documentsSubject.value;
    const index = docs.findIndex(doc => doc.id === id);

    if (index === -1) {
      return of(undefined);
    }

    const updated: Document = {
      ...docs[index],
      ...updates,
      id: docs[index].id,
      createdAt: docs[index].createdAt,
      updatedAt: new Date()
    };

    docs[index] = updated;
    this.documentsSubject.next([...docs]);
    this.saveToStorage(docs);

    return of(updated);
  }

  deleteDocument(id: string): Observable<void> {
    const docs = this.documentsSubject.value.filter(doc => doc.id !== id);
    this.documentsSubject.next(docs);
    this.saveToStorage(docs);
    return of(void 0);
  }

  uploadDocument(file: File, type: 'pdf' | 'doc'): Observable<Document> {
    return new Observable(observer => {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result as string;
        const doc: Partial<Document> = {
          name: file.name,
          type: type,
          content: `File uploaded: ${file.name}\n\n${content.substring(0, 200)}...`
        };

        this.createDocument(doc).subscribe(newDoc => {
          observer.next(newDoc);
          observer.complete();
        });
      };

      reader.onerror = () => {
        observer.error('Error reading file');
      };

      reader.readAsText(file);
    });
  }

  setCurrentDocument(doc: Document): void {
    // For tracking currently viewed document
  }

  private generateId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
