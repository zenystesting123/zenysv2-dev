import { DatacardSettingsComponent } from './datacard-settings/datacard-settings.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { CustomersettingsComponent } from './customersettings/customersettings.component';
import { TasksettingsComponent } from './tasksettings/tasksettings.component';
import { SalesettingsComponent } from './salesettings/salesettings.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { DocumentsettingsComponent } from './documentsettings/documentsettings.component';
import { EmailTemplateSettingsComponent } from './email-template-settings/email-template-settings.component';
import { SubusersComponent } from './subusers/subusers.component';
import { ExpenseSettingsComponent } from './expense-settings/expense-settings.component';
import { FieldNameSettingsComponent } from './field-name-settings/field-name-settings.component';
import { RazorpaysubmerchantComponent } from './razorpaysubmerchant/razorpaysubmerchant.component';
import { EmployeeSettingsComponent } from './employee-settings/employee-settings.component';
import { MessageTemplateComponent } from './message-template/message-template.component';
import { ProductSettingsComponent } from './product-settings/product-settings.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { FollowupsSettingsComponent } from './followups-settings/followups-settings.component';
import { PaymentSettingsComponent } from './payment-settings/payment-settings.component';
import { ServiceSettingsComponent } from './service-settings/service-settings.component';
import { FollowupAdditionalSettingsComponent } from './followup-additional-settings/followup-additional-settings.component';
import { AdditionalfieldCommonComponent } from './additionalfield-common/additionalfield-common.component';
import { OrganisationSettingComponent } from './organisation-setting/organisation-setting.component';
import { SettingsNewComponent } from './settings-new/settings-new.component';
import { LeadCaptureSettingsComponent } from './lead-capture-settings/lead-capture-settings.component';




const routes: Routes = [{ path: '', component: SettingsComponent },
{ path: 'custsettings', component: CustomersettingsComponent, data:{animation:'asettings'} },
{ path: 'salessettings', component: SalesettingsComponent, data:{animation:'salesettings'} },
{ path: 'service-settings', component: ServiceSettingsComponent, data:{animation:'servsettings'} },
{ path: 'tasksettings', component: TasksettingsComponent, data:{animation:'servsettings'} },
{ path: 'expensesettings', component: ExpenseSettingsComponent , data:{animation:'expsettings'} },
{ path: 'profilesettings', component: ProfileSettingsComponent, data:{animation:'psettings'} },
{ path: 'subusersettings', component: SubusersComponent, data:{animation:'subsettings'} },
{ path: 'contact-form-settings', component: DatacardSettingsComponent , data:{animation:'subsettings'} },
{ path: 'docsettings', component: DocumentsettingsComponent, data:{animation:'docsettings'} },
{ path: 'emailsettings', component: EmailTemplateSettingsComponent, data:{animation:'esettings'} },
{ path: 'field-name-settings', component: FieldNameSettingsComponent, data:{animation:'fsettings'} },
{ path: 'employee-settings', component: EmployeeSettingsComponent, data:{animation:'empsettings'} },
{ path: 'product-settings', component: ProductSettingsComponent, data:{animation:'prodsettings'} },
{ path: 'payments', component: RazorpaysubmerchantComponent, data:{animation:'empsettings'} },
{ path: 'messagetemplate', component: MessageTemplateComponent, data:{animation:'msettings'} },
{ path: 'generalsettings', component: GeneralSettingsComponent, data:{animation:'generalsettings'} },
{ path: 'followupsettings', component: FollowupsSettingsComponent, data:{animation:'followupsettings'} },
{ path: 'paymentsettings', component: PaymentSettingsComponent, data:{animation:'followupsettings'} },
{ path: 'followupcustomfields', component: FollowupAdditionalSettingsComponent, data:{animation:'followupcustomfields'} },
{ path: 'additionalfields', component: AdditionalfieldCommonComponent, data:{animation:'followupcustomfields'} },
{ path: 'organisation-settings', component: OrganisationSettingComponent, data:{animation:'prodsettings'} },
{ path: 'settingsnew', component: SettingsNewComponent, data:{animation:'followupcustomfields'} },
{ path: 'lead-capture-settings', component: LeadCaptureSettingsComponent, data:{animation:'followupcustomfields'} },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
