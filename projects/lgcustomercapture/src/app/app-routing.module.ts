import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { UploadAttachmtComponent } from './upload-attachmt/upload-attachmt.component';

const routes: Routes = [
  {path:'addcontacts', component:ContactFormComponent},
  {path:'lgcustomercapture/upload-att', component:UploadAttachmtComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
