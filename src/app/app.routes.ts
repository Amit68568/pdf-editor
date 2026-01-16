import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

import { EditorComponent } from './components/editor/editor.component';
import { CreateDocumentComponent } from './components/create-document/create-document.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'create', component: CreateDocumentComponent },
  { path: 'editor/:id', component: EditorComponent },
  { path: '**', redirectTo: '' }
];
