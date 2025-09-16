












import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModuleWithProviders } from '@angular/compiler/src/core';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';
// import { MatTableModule } from '@angular/material/table';
// import { MatSortModule } from '@angular/material/sort';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { FormsModule } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatInputModule } from '@angular/material/input';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatListModule } from '@angular/material/list';
// import { HttpClientModule } from '@angular/common/http';
// import {MatTabsModule} from '@angular/material/tabs';
// import {MatCardModule} from '@angular/material/card';
// import { MatSnackBar } from '@angular/material';
import { environment } from '../environments/environment';
import {  CONFIG, DEBUG_MODE, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
// import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
//Section for configuring angular firebase UI login component
import { SharedModule } from './shared/shared.module';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      return true;
    },
    uiShown: function () {
    }
  },
  signInFlow: 'popup',
  signInSuccessUrl: '/createCustomer',
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: [
      ],
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

import { LoginComponent } from './login/login.component';
import { SharedSalesComponent } from './shared-sales/shared-sales.component';
import { SalesDetailsComponent } from './sales-details/sales-details.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { InvoicemanagmentComponent } from './invoicemanagment/invoicemanagment.component';
import { QuotationmanagementComponent } from './quotationmanagement/quotationmanagement.component';
import { EstimatemanagementComponent } from './estimatemanagement/estimatemanagement.component';
import { DocpreviewComponent } from './docpreview/docpreview.component';
import {MatCardHarness} from '@angular/material/card/testing';
import { ConfirmationpopupComponent } from './confirmationpopup/confirmationpopup.component';
import { TopnavComponent } from './topnav/topnav.component';
import { TaskboardComponent } from './taskboard/taskboard.component';
// import { NgxPrintModule } from 'ngx-print';

var firebaseConfig = environment.firebaseConfig;
// login page ui



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SharedSalesComponent,
    SalesDetailsComponent,
    CreateCustomerComponent,
    InvoicemanagmentComponent,
    QuotationmanagementComponent,
    EstimatemanagementComponent,
    DocpreviewComponent,
    ConfirmationpopupComponent,
    TopnavComponent,
    TaskboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // AngularFireAnalyticsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    // MatTableModule,
    // MatSortModule,
    // MatTabsModule,
    // MatPaginatorModule,
    // FormsModule,
    // MatFormFieldModule,
    // MatToolbarModule,
    // MatIconModule,
    // MatButtonModule,
    // MatInputModule,
    // MatDatepickerModule,
    // HttpClientModule,
    // MatNativeDateModule,
    // MatMenuModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    // MatSidenavModule,
    // MatListModule,
    // MatProgressSpinnerModule,
    // MatSnackBarModule,
    // MatBottomSheetModule,
    // MatCardModule,
    // NgxPrintModule
    // MatCardHarness
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
