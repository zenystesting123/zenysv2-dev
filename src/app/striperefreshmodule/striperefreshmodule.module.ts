import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { StripeCheckoutLinkComponent } from './stripe-checkout-link/stripe-checkout-link.component';
import { SuccesspageComponent } from './stripe-checkout-link/successpage/successpage.component';
import { StriperefreshmoduleRoutingModule } from './striperefreshmodule-routing.module';
import { StriperefreshurlComponent } from './striperefreshurl/striperefreshurl.component';


@NgModule({
  declarations: [
    StriperefreshurlComponent,
    StripeCheckoutLinkComponent,
    SuccesspageComponent
  ],
  imports: [
    SharedModule,
    StriperefreshmoduleRoutingModule,
    
  ]
})
export class StriperefreshmoduleModule { }
