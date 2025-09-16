import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadCaptureFormComponent } from './lead-capture-form/lead-capture-form.component';

const routes: Routes = [
  {
    path: ':docId/:formId',
    component: LeadCaptureFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
