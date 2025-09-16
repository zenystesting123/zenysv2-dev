import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MailListComponent } from './mail-list/mail-list.component';
import { MsalRedirectComponent } from '@azure/msal-angular';


const routes: Routes = [
  {
    path:'mail',
    component:MailListComponent
  },
  {
    //lazy load outlook module
    path: 'auth',
    component: MsalRedirectComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutlookRoutingModule { }
