import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { EstimateListComponent } from './estimate-list/estimate-list.component';
import { QuotationlistComponent } from './quotationlist/quotationlist.component';
import { PaymentReceiptListComponent } from './payment-receipt-list/payment-receipt-list.component';
// import { CollectionListMobileComponent } from './collection-list-mobile/collection-list-mobile.component';
const routes: Routes = [
  {
    path: 'Invoicelist',
    component: InvoiceListComponent,
    data: {
      title: 'Invoicelist',
      animation:'Invoices'
    },
  },
  {
    path: 'estimatelist',
    component: EstimateListComponent,
    data: {
      title: 'estimatelist',
      animation:'Estimate'
    },
  },
  {
    path: 'Quotationlist',
    component: QuotationlistComponent,
    data: {
      title: 'Quotationlist',
      animation:'Quotation'
    },
  },
  {
    path: 'payment-receipt',
    component: PaymentReceiptListComponent,
    data: {
      title: 'payment-receipt',
      animation:'Collection'
    },
  },
 
  // {
  //   path: 'payment-receipt-mob',
  //   component: CollectionListMobileComponent,
  //   data: {
  //     title: 'payment-receipt',
  //   },
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
