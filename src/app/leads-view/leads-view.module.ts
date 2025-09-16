import { NgModule } from '@angular/core';
import { LeadsViewRoutingModule } from './leads-view-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LeadAddPopupComponent } from './lead-add-popup/lead-add-popup.component';
import { LeadPurchaseComponent } from './lead-purchase/lead-purchase.component';
import { PurchasedleadsComponent } from './purchasedleads/purchasedleads.component';
import { LeadshareviewComponent } from './leadshareview/leadshareview.component';
import { LeadshareComponent } from './leadshare/leadshare.component';


@NgModule({
  declarations: [
    LeadAddPopupComponent,
    LeadPurchaseComponent,
    PurchasedleadsComponent,
    LeadshareviewComponent,
    LeadshareComponent,
  ],
  imports: [
    SharedModule,
    LeadsViewRoutingModule
  ]
})
export class LeadsViewModule { }
