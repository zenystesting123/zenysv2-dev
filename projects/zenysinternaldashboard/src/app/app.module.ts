import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { ContactsreportComponent } from './contactsreport/contactsreport.component';
import { DashboradpageComponent } from './dashboradpage/dashboradpage.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { DashboardLoginComponent } from './dashboard-login/dashboard-login.component';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AngularFireAnalyticsModule, CONFIG, DEBUG_MODE, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { environment } from '../environments/environment';
import { PublicProfileReportComponent } from './public-profile-report/public-profile-report.component';
import { AccountRequestComponent } from './account-request/account-request.component';
import { AccountrequestpopupComponent } from './account-request/accountrequestpopup/accountrequestpopup.component';
import { InquiriesComponent } from './inquiries/inquiries.component';
import { ScriptRunnerComponent } from './script-runner/script-runner.component';
import { HttpClientModule} from '@angular/common/http';
import { SearchtermScriptComponent } from './searchterm-script/searchterm-script.component';
import { HelpDocComponent } from './help-doc/help-doc.component';
import { AddNewPage } from './help-doc/help-doc.component';
import { ScriptCustomfieldsComponent } from './script-customfields/script-customfields.component';
import { UploadSaleComponent } from './upload-sale/upload-sale.component';
import { UploadCustomerComponent } from './upload-customer/upload-customer.component';
import { UploadTaskComponent } from './upload-task/upload-task.component';
import { UploadProductComponent } from './upload-product/upload-product.component';
import { StatusScriptComponent } from './status-script/status-script.component';
import { CommonScriptComponent } from './common-script/common-script.component';

import { SharedModule } from 'src/app/shared/shared.module';




//Section for configuring angular firebase UI login component

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      return true;
    },
    uiShown: function () { }
  },
  signInFlow: 'popup',
  signInSuccessUrl: '/zenysinternaldashboard/myDashboard/user-info',
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: [ ],
      customParameters: {
        'prompt': 'select_account',
        'auth_type': 'reauthenticate'
      }
    },
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    }
  ],
  credentialHelper: firebaseui.auth.CredentialHelper.NONE
};


@NgModule({
  declarations: [
    AppComponent,
    UserinfoComponent,
    ContactsreportComponent,
    DashboradpageComponent,
    NavBarComponent,
    DashboardLoginComponent,
    PublicProfileReportComponent,
    AccountRequestComponent,
    AccountrequestpopupComponent,
    InquiriesComponent,
    ScriptRunnerComponent,
    SearchtermScriptComponent,
    CommonScriptComponent,
    HelpDocComponent,
    AddNewPage,
    ScriptCustomfieldsComponent,
    UploadSaleComponent,
    UploadCustomerComponent,
    UploadTaskComponent,
    UploadProductComponent,
    StatusScriptComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    MatSidenavModule,
    MatListModule,
    AngularFireAnalyticsModule,
    HttpClientModule
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
@NgModule({})
export class ZenysInternalDashboardSharedModule{
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppModule,
      providers: []
    }
  }
}
