import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentFormComponent } from './document-form/document-form.component';
import { MainToolBarComponent } from './main-tool-bar/main-tool-bar.component';

const routes: Routes = [
  {
    path: '',
    component: MainToolBarComponent,
    data: {
      title: 'toolbar',
    },

    children: [
      {
        path: ':docType',
        component: DocumentFormComponent,
        data: {
          title: 'DocumentForm',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FreeToolRoutingModule {}
