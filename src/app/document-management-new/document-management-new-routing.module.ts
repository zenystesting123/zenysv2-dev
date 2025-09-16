import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstimateManagementComponent } from './estimate-management/estimate-management.component';
import { InvoiceManagementComponent } from './invoice-management/invoice-management.component';
import { PreviewComponent } from './preview/preview.component';
import { QuotationManagementComponent } from './quotation-management/quotation-management.component';

const routes: Routes = [
  {
    path: 'documentmanagement/:saleID/:scn/:docType/:custID/:orgID/:docID',
    component: EstimateManagementComponent,
  },
  {
    path: 'documentquotationmanagement/:saleID/:scn/:docType/:custID/:orgID/:docID',
    component: QuotationManagementComponent,
  },
  {
    path: 'documentinvoicemanagement/:saleID/:scn/:docType/:custID/:orgID/:docID',
    component: InvoiceManagementComponent,
  },
  {
    path: ':docType/:docID',
    component: PreviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentManagementNewRoutingModule { }
