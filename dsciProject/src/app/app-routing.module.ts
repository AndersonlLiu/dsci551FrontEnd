import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { FilesComponent } from './files/files.component';
import { EdfsComponent } from './edfs/edfs.component';
//import { BrowserModule } from '@anglar/platform-browser';
//import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'search-component', component: SearchComponent },
  { path: 'files-component', component: FilesComponent },
  { path: 'edfs-component', component: EdfsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
