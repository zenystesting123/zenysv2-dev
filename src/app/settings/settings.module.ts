import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { CustomersettingsComponent } from './customersettings/customersettings.component';
import { TasksettingsComponent } from './tasksettings/tasksettings.component';
import { SharedModule } from "../shared/shared.module";
import { SalesettingsComponent } from './salesettings/salesettings.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { DocumentsettingsComponent } from './documentsettings/documentsettings.component';
import { EmailTemplateSettingsComponent } from './email-template-settings/email-template-settings.component';
import { SubusersComponent } from './subusers/subusers.component';
import { DialogOverviewExampleDialog } from './subusers/subusers.component';
import { RazorpayModule } from '../razorpaytest/razorpay.module';
import { StatusPopupComponent } from './status-popup/status-popup.component';
import { ExpenseSettingsComponent } from './expense-settings/expense-settings.component';
import { FieldNameSettingsComponent } from './field-name-settings/field-name-settings.component';
import { Dialog2Component } from './profile-settings/dialog2/dialog2.component';
import { DocumentnumberingPopupComponent } from './documentnumbering-popup/documentnumbering-popup.component';
import { RazorpaysubmerchantComponent } from './razorpaysubmerchant/razorpaysubmerchant.component';
import { EmployeeSettingsComponent } from './employee-settings/employee-settings.component';

import { DatacardSettingsComponent } from './datacard-settings/datacard-settings.component';
import { MessageTemplateComponent } from './message-template/message-template.component';
import { MessageTemplateConfirmationComponent } from './message-template-confirmation/message-template-confirmation.component';
import { MessageTemplateTypeSelectComponent } from './message-template-type-select/message-template-type-select.component';
import { PaymentDueComponent } from './payment-due/payment-due.component';
import { DocumentApprovalComponent } from './document-approval/document-approval.component';
import { ChildProductSettings, ProductSettingsComponent } from './product-settings/product-settings.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { FollowupsSettingsComponent } from './followups-settings/followups-settings.component';
import { ServiceSettingsComponent } from './service-settings/service-settings.component';
import { PaymentSettingsComponent } from './payment-settings/payment-settings.component';
import { FollowupAdditionalSettingsComponent } from './followup-additional-settings/followup-additional-settings.component';
import { CommonSearchModule } from '../common-search/common-search.module';
import { AdditionalfieldCommonComponent } from './additionalfield-common/additionalfield-common.component';
import { OrganisationSettingComponent } from './organisation-setting/organisation-setting.component';
import { SettingsNewComponent } from './settings-new/settings-new.component';
import { LeadCaptureSettingsComponent } from './lead-capture-settings/lead-capture-settings.component';
import { PipelineAndStagesComponent } from './pipeline-and-stages/pipeline-and-stages/pipeline-and-stages.component';
// imoprt {RazorpayModule}
//import { FormsModule, ReactiveFormsModule } from "@angular/forms";
@NgModule({
  declarations: [SettingsComponent,
    CustomersettingsComponent,
    TasksettingsComponent,
    SalesettingsComponent,
    ProfileSettingsComponent,
    DocumentsettingsComponent,
    EmailTemplateSettingsComponent,
    SubusersComponent,
    DialogOverviewExampleDialog,
    StatusPopupComponent,
    ExpenseSettingsComponent,
    FieldNameSettingsComponent,
    Dialog2Component,
    DocumentnumberingPopupComponent,
    RazorpaysubmerchantComponent,
    EmployeeSettingsComponent,
    DatacardSettingsComponent,
    MessageTemplateComponent,
    MessageTemplateConfirmationComponent,
    MessageTemplateTypeSelectComponent,
    PaymentDueComponent,
    DocumentApprovalComponent,
    ProductSettingsComponent,
    GeneralSettingsComponent,
    FollowupsSettingsComponent,
    ServiceSettingsComponent,
    FollowupAdditionalSettingsComponent,
    ChildProductSettings,
    PaymentSettingsComponent,
    AdditionalfieldCommonComponent,
    SettingsNewComponent,
    OrganisationSettingComponent,
    LeadCaptureSettingsComponent,
    PipelineAndStagesComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    SettingsRoutingModule,
    RazorpayModule,
    CommonSearchModule
  ]
})
export class SettingsModule { }
