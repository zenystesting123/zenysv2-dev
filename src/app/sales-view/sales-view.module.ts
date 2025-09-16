import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SalesViewRoutingModule } from './sales-view-routing.module';
import { SaleComponent } from './sale/sale.component';
import { SalesdetailsComponent } from './salesdetails/salesdetails.component';
import { GmailModule } from '../gmail/gmail.module';
// import { InjectorComponent } from 'projects/test-app/src/app/injector/injector.component';
import { EnglishChannelSaleTab1Component } from 'projects/test-app/src/app/english-channel-sale-tab1/english-channel-sale-tab1.component';
import { CommonSearchModule } from '../common-search/common-search.module';
import { CustomTablesModule } from '../custom-tables/custom-tables.module';
import { SalesProductComponent } from './sales-product/sales-product.component';
import { OutlookModule } from '../outlook/outlook.module';
@NgModule({
  declarations: [
    SaleComponent,
    SalesdetailsComponent,
    // InjectorComponent,
    EnglishChannelSaleTab1Component,
    SalesProductComponent,
  ],
  imports: [SharedModule, SalesViewRoutingModule, GmailModule, OutlookModule, CommonSearchModule,CustomTablesModule],
})
export class SalesViewModule {}
