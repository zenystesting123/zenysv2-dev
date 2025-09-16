import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { SharedSalesComponent } from './shared-sales/shared-sales.component';
import { SalesDetailsComponent } from './sales-details/sales-details.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import {EstimatemanagementComponent} from './estimatemanagement/estimatemanagement.component'
import {InvoicemanagmentComponent} from './invoicemanagment/invoicemanagment.component'
import {QuotationmanagementComponent} from './quotationmanagement/quotationmanagement.component'

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {
      title: 'login'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'login'
    }
  },
  {
    path:'createCustomer',
    component: CreateCustomerComponent,
    data:{
      title:'createCustomer'
    }
  },
    {
      path: 'dash',
      // component: FullLayoutComponent,
      data: {
        title: 'Panel',
        authGuardPipe: redirectUnauthorizedToLogin
      },
      children: [
        {
          path: 'sale',
          component: SharedSalesComponent,
          data: {
            title: 'sale'
          },
        },
        {
          path: 'saleview/:saleId',
          component: SalesDetailsComponent,
          data: {
            title: 'Sale Details'
          },
        },
        {
          path: 'documentmanagement/:saleID/:scn/:docType/:custID/:docID',
          component: EstimatemanagementComponent
        },
        {
          path: 'documentinvoicemanagement/:saleID/:scn/:docType/:custID/:docID',
          component: EstimatemanagementComponent
        },
       
        {
          path: 'documentquotationmanagement/:saleID/:scn/:docType/:custID/:docID',
          component: EstimatemanagementComponent
        },
        // path for chats
       {
        path: 'chat',
        loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)
      },

      // path for chats end

      ],
    canActivate: [AngularFireAuthGuard]

   },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
