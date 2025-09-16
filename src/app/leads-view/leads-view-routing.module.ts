import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadPurchaseComponent } from './lead-purchase/lead-purchase.component';
import { LeadshareComponent } from './leadshare/leadshare.component';
import { LeadshareviewComponent } from './leadshareview/leadshareview.component';
import { PurchasedleadsComponent } from './purchasedleads/purchasedleads.component';

const routes: Routes = [
  {
    path: 'purchasedleads',
    component: LeadPurchaseComponent,
    data: {
      title: 'Lead Share'
    },
  },
  {
    path: '',
    component: LeadshareComponent,
    data: {
      title: 'Lead Share'
    },
  },
  {
    path: 'sharedleads',
    component: LeadshareviewComponent,
    data: {
      title: 'Lead Share'
    },
  },
  {
    path: 'purchasedleads',
    component: PurchasedleadsComponent,
    data: {
      title: 'Purchased Leads'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsViewRoutingModule { }
