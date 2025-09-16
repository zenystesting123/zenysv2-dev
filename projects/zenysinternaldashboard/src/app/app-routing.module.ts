import { UploadCustomerComponent } from './upload-customer/upload-customer.component';
import { UploadSaleComponent } from './upload-sale/upload-sale.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadCustomerExcelComponent } from 'src/app/upload-customer-excel/upload-customer-excel.component';
import { AccountRequestComponent } from './account-request/account-request.component';
import { ContactsreportComponent } from './contactsreport/contactsreport.component';
import { DashboardLoginComponent } from './dashboard-login/dashboard-login.component';
import { DashboradpageComponent } from './dashboradpage/dashboradpage.component';
import { HelpDocComponent } from './help-doc/help-doc.component';
import { InquiriesComponent } from './inquiries/inquiries.component';
import { PublicProfileReportComponent } from './public-profile-report/public-profile-report.component';
import { ScriptCustomfieldsComponent } from './script-customfields/script-customfields.component';
import { ScriptRunnerComponent } from './script-runner/script-runner.component';
import { SearchtermScriptComponent } from './searchterm-script/searchterm-script.component';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { UploadTaskComponent } from './upload-task/upload-task.component';
import { UploadProductComponent } from './upload-product/upload-product.component';
import { StatusScriptComponent } from './status-script/status-script.component';
import { CommonScriptComponent } from './common-script/common-script.component';


const routes: Routes = [
  {path:'zenysinternaldashboard', component:DashboardLoginComponent},
  {path:'zenysinternaldashboard/login', component:DashboardLoginComponent},
  {path:'zenysinternaldashboard/myDashboard',component:DashboradpageComponent, children:[
    {path:'user-info', component:UserinfoComponent},
    {path:'contacts-report/:id', component:ContactsreportComponent},
    {path:'public-profile-info', component:PublicProfileReportComponent},
    {path:'account-transfer', component:AccountRequestComponent},
    {path:'inquiries-report', component:InquiriesComponent},
    {path:'scripts', component:ScriptRunnerComponent},
  ]},
  {path:'zenysinternaldashboard/help', component:HelpDocComponent},
  {path:'zenysinternaldashboard/status-script', component:StatusScriptComponent},
  {path:'zenysinternaldashboard/upload-sales', component:UploadSaleComponent },
  {path:'zenysinternaldashboard/upload-customer', component:UploadCustomerComponent },
  {path:'zenysinternaldashboard/upload-tasks', component:UploadTaskComponent },
  {path:'zenysinternaldashboard/upload-products', component:UploadProductComponent },
  {path:'searchterm', component:SearchtermScriptComponent},
  {path:'commonscript', component:CommonScriptComponent},
  {path:'updatecustomfields', component:ScriptCustomfieldsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
