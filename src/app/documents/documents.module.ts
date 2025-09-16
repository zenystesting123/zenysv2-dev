import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { DocumentsRoutingModule } from './documents-routing.module';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { EstimateListComponent } from './estimate-list/estimate-list.component';
import { QuotationlistComponent } from './quotationlist/quotationlist.component';
import { PaymentReceiptListComponent } from './payment-receipt-list/payment-receipt-list.component';
// import { CollectionListMobileComponent } from './collection-list-mobile/collection-list-mobile.component';
import { CustomTablesModule } from '../custom-tables/custom-tables.module';
@NgModule({
  declarations: [
    InvoiceListComponent,
    EstimateListComponent,
    QuotationlistComponent,
    PaymentReceiptListComponent,
    // CollectionListMobileComponent
  ],
  imports: [
    SharedModule,
    DocumentsRoutingModule,
    CustomTablesModule
  ]
})
export class DocumentsModule { }
