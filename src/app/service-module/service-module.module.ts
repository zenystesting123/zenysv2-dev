import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceModuleRoutingModule } from './service-module-routing.module';
import {
  ChildServiceList,
  ServiceListComponent,
} from './service-list/service-list.component';
import {
  ChildServiceDetails,
  ServiceDetailsComponent,
  ServicesAddProduct,
} from './service-details/service-details.component';
import { SharedModule } from '../shared/shared.module';
import { GmailModule } from '../gmail/gmail.module';
import { CommonSearchModule } from '../common-search/common-search.module';
import { CustomTablesModule } from '../custom-tables/custom-tables.module';
import { OutlookModule } from '../outlook/outlook.module';

@NgModule({
  declarations: [
    ServiceListComponent,
    ServiceDetailsComponent,
    ChildServiceDetails,
    ServicesAddProduct,
    ChildServiceList,
  ],
  imports: [CommonModule, ServiceModuleRoutingModule, SharedModule, GmailModule, OutlookModule, CommonSearchModule,CustomTablesModule],
})
export class ServiceModuleModule {}
