import { CustomerviewComponent } from './customerview/customerview.component';
import { ChildCustomerlist, CustomerlistComponent } from './customerlist/customerlist.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GmailModule } from '../gmail/gmail.module';
import { DeleteContactsComponent } from './delete-contacts/delete-contacts.component';
import { ReAssignSaleComponent } from './re-assign-sale/re-assign-sale.component';
// import { DynamicDirective } from './dynamic.directive';
import { ComponentInjectorComponent } from '../component-injector/component-injector.component';
// import { InjectorComponent } from 'projects/test-app/src/app/injector/injector.component';
import { TestComponentComponent } from 'projects/test-app/src/app/test-component/test-component.component';
import { MydocumentComponent } from 'projects/test-app/src/app/english-channel-contact-tab1/mydocument/mydocument.component';
import { EnglishChannelContactTab2Component } from 'projects/test-app/src/app/english-channel-contact-tab2/english-channel-contact-tab2.component';
import { CommonSearchModule } from '../common-search/common-search.module';
import { CustomTablesModule } from '../custom-tables/custom-tables.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { OutlookModule } from '../outlook/outlook.module';
// import { AddExperiencePopupComponent } from 'projects/test-app/src/app/english-channel-contact-tab2/add-experience-popup/add-experience-popup.component';

@NgModule({
  declarations: [
    CustomerDetailsComponent,
    ChildCustomerlist,
    CustomerlistComponent,
    CustomerviewComponent,
    DeleteContactsComponent,
    ReAssignSaleComponent,
    ComponentInjectorComponent,
    // InjectorComponent,
    TestComponentComponent,
    MydocumentComponent,
    EnglishChannelContactTab2Component,
    // AddExperiencePopupComponent,
  ],
  imports: [
    // CommonModule,
    SharedModule,
    ContactRoutingModule,
    GmailModule,
    OutlookModule,
    CommonSearchModule,
    CustomTablesModule,
    ScrollingModule
  ],
})
export class ContactModule {}
