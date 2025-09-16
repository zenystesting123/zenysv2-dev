import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleComponent } from './sale/sale.component';
import { SalesProductComponent } from './sales-product/sales-product.component';
import { SalesAddProduct, SalesdetailsComponent } from './salesdetails/salesdetails.component';

const routes: Routes = [
  {
    path: 'sale',
    component: SaleComponent,
    data: {
      animation:'SalesList',
      title: 'sale'
    },
  },
  {
    path: 'saleview/:saleId',
    component: SalesdetailsComponent,
    data: {
      title: 'Sale Details',
      animation:'SalesDetails'
    },
  },
  {
    path: 'saleview/:saleId/add-product/:Obj',
    component: SalesAddProduct,
    data: {
      title: 'Sale Details',
    },
  },
  {
    path: 'product',
    component: SalesProductComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesViewRoutingModule { }
