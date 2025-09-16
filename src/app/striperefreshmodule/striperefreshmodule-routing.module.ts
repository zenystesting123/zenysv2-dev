import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StripeCheckoutLinkComponent } from './stripe-checkout-link/stripe-checkout-link.component';
import { SuccesspageComponent } from './stripe-checkout-link/successpage/successpage.component';
import { StriperefreshurlComponent } from './striperefreshurl/striperefreshurl.component';

const routes: Routes = [
  {
    path:'striperefreshurl/:accountId',
    component: StriperefreshurlComponent
  },
  {
    path:'stripeCheckout/:userId/:docId/:type',
    component: StripeCheckoutLinkComponent
  },{
    path:'success/:userId/:docId/:type',
    component: SuccesspageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StriperefreshmoduleRoutingModule { }
