import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllpayssubsComponent } from './allpayssubs/allpayssubs.component';
import { DocPreviewComponent } from './doc-preview/doc-preview.component';
import { PaymentsComponent } from './payments/payments.component';
import { RazorpaytestComponent } from './razorpaytest.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';

const routes: Routes = [

  {
    path: 'razorpay',
    component: RazorpaytestComponent,
    data: {
      title: 'razor'
    }
  },
 
  {
    path: 'docpreview/:saleID/:scn/:docType/:custID/:docID',
    component: DocPreviewComponent
  },


  
  // razorpay start
  {
    path: 'payment',
    component: AllpayssubsComponent,
    data: {
      title: 'payrazor'
    },
  },

  {
    path: 'razorpay1',
    // component: RazorpaytestComponent,
    children: [
      {
        path: 'payment',
        component: PaymentsComponent,
        data: {
          title: 'payment'
        }
      },
      {
        path: 'subscription',
        component: SubscriptionsComponent,
        data: {
          title: 'subscription'
        }
      }
    ]
  },


  // razorpay end





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RazorpayRoutingModule { }
