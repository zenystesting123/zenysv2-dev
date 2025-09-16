import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomerlistComponent } from './customerlist/customerlist.component';
import { CustomerviewComponent } from './customerview/customerview.component';

const routes: Routes = [

  {
    path: 'customerlist',
    component: CustomerlistComponent,
    data: {
      title: 'customerlist',
      animation: 'ContactList',
    },
  },
  {
    path: 'customerdetails/:custId',
    component: CustomerDetailsComponent,
    data: {
      title: 'customerdetails',
      animation:'CustomerDetails'
    },
  },
  {
    path: 'custview/:custId',
    component: CustomerviewComponent,
    data: {
      title: 'Customer Details'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
