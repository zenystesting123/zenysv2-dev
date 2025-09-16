import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RazorpayRoutingModule } from './razorpay-routing.module';
import { AllpayssubsComponent } from './allpayssubs/allpayssubs.component';
import { PaymentsComponent } from './payments/payments.component';
import { RazorpaytestComponent } from './razorpaytest.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { InvoicemodalComponent } from './invoicemodal/invoicemodal.component';
import { SelectpopupComponent } from './selectpopup/selectpopup.component';
import { DocPreviewComponent } from './doc-preview/doc-preview.component';

@NgModule({
  declarations: [
    AllpayssubsComponent,
    PaymentsComponent,
    RazorpaytestComponent,
    SubscriptionsComponent,
    InvoicemodalComponent,
    SelectpopupComponent,
    DocPreviewComponent
  ],
  imports: [
    // CommonModule,
    SharedModule,
    RazorpayRoutingModule
  ],
  exports:[
    AllpayssubsComponent,
  ]
})
export class RazorpayModule { }
