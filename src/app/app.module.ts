
import { CrudModal1Component } from './taskboard/crud-modal1/crud-modal1.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashhomeComponent } from './dashhome/dashhome.component';
import { ReportleaddialogComponent } from './reportleaddialog/reportleaddialog.component';
import { CustomersearchComponent } from './customersearch/customersearch.component';
import { RejectleaddialogComponent } from './rejectleaddialog/rejectleaddialog.component';
import { ChildFollowUpList, FollowUpListMaterialComponent } from './follow-up-list-material/follow-up-list-material.component';
import { ChangecuststatdialogComponent } from './changecuststatdialog/changecuststatdialog.component';
import { ChangecustprioritydialogComponent } from './changecustprioritydialog/changecustprioritydialog.component';
import { ContactdashboardComponent } from './contactdashboard/contactdashboard.component';
import { ChildTaskboard, TaskboardComponent } from './taskboard/taskboard.component';
import { Addnewsale1Component } from './addnewsale1/addnewsale1.component';
import { TemplatePrev1Component } from './templates/template-prev1/template-prev1.component';
import { TemplatePrev2Component } from './templates/template-prev2/template-prev2.component';
import { TemplatePrev3Component } from './templates/template-prev3/template-prev3.component';
import { TemplatePrev4Component } from './templates/template-prev4/template-prev4.component';
import { TemplatePrev5Component } from './templates/template-prev5/template-prev5.component';
import { Paymentreceipt1Component } from './paymentreceipt1/paymentreceipt1.component';
import { CustomerSearchPopUpComponent } from './customer-search-pop-up/customer-search-pop-up.component';
import { ChangesaleprioritydialogComponent } from './changesaleprioritydialog/changesaleprioritydialog.component';
import { ChangesalestatdialogComponent } from './changesalestatdialog/changesalestatdialog.component';
import { SelectcustsaleComponent } from './selectcustsale/selectcustsale.component';
import { SelectsaledialogComponent } from './selectsaledialog/selectsaledialog.component';
import { InquirestableComponent } from './inquirestable/inquirestable.component';
import { InquiresviewComponent } from './inquiresview/inquiresview.component';
import { CreateloadingComponent } from './createloading/createloading.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ConfirmationpopupComponent } from './confirmationpopup/confirmationpopup.component';
import { DropzoneDirective } from './dropzone.directive';
import { AddNewServiceComponent } from './add-new-service/add-new-service.component';
import { Addcontactpopup1Component } from './addcontactpopup1/addcontactpopup1.component';
import { InvoiceGeneratorComponent } from './invoice-generator/invoice-generator.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  AngularFireAnalyticsModule,
  CONFIG,
  DEBUG_MODE,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { SearchComponent } from './search/search.component';
import { ToastrModule } from 'ngx-toastr';

import { PwaserviceService } from './pwaserv/pwaservice.service';
import { MarkdownPipe } from './markdown.pipe';


import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { UploadCustomerLimitPopupComponent } from './upload-customer-limit-popup/upload-customer-limit-popup.component';
import { AgmCoreModule } from '@agm/core';
import { ZenysInternalDashboardSharedModule } from '../../projects/zenysinternaldashboard/src/app/app.module';
import { LeadCaptureSharedModule } from '../../projects/lead-capture/src/app/app.module';
import { Expenses1Component } from './expenses1/expenses1.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { SplashScreenService } from './splash-screen/splash-screen.service';

// import { BottomSheetPaymentUpdateComponent } from './bottom-sheet-payment-update/bottom-sheet-payment-update.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SubuserProfilesDialog } from './settings/subusers/subusers.component';
import { DialogOverviewExampleDialog } from './settings/profile-settings/profile-settings.component';
import { InvitingEmail } from './settings/subusers/subusers.component';
import { DeleteConfirmationSubusers } from './settings/subusers/subusers.component';
import { DeleteConfirmationEmail } from './settings/email-template-settings/email-template-settings.component';
import { ConfirmEditAssignedTo } from './contact/customer-details/customer-details.component';
import { ConfirmAssignedto } from './sales-view/salesdetails/salesdetails.component';
import { DeleteConfirmation } from './products-and-services/products-and-services.component';
import { EmailTemplateType } from './settings/email-template-settings/email-template-settings.component';
import { AddProduct } from './products-and-services/products-and-services.component';
import { SalesAddProduct } from './sales-view/salesdetails/salesdetails.component';
import { PopupDeleteInquiry } from './inquirestable/inquirestable.component';
import { GmailModule } from './gmail/gmail.module';
import { SharedModule } from './shared/shared.module';
import { PushnotificationService } from './pushnotification.service';
import { FreeUserPopupComponent } from './free-user-popup/free-user-popup.component';
import { ProductsAndServicesComponent } from './products-and-services/products-and-services.component';
import { AutomationComponent } from './automation/automation.component';
import { FirebaseLoginPageComponent } from './firebase-login-page/firebase-login-page.component';
import { AutomationlistComponent } from './automations/automationlist/automationlist.component';

// import { BottomSheetCollectionFromListComponent } from './bottom-sheet-payment-from-list/bottom-sheet-collection-from-list.component';
import { ToolBarSearchComponent } from './tool-bar-search/tool-bar-search.component';
import { UploadCustomerExcelComponent } from './upload-customer-excel/upload-customer-excel.component';
import { PopupComponent } from './automations/popup/popup.component';
import { ObservableTableComponent } from './observable-table/observable-table.component';
import { ServicesComponent } from './services/services.component';
import { SmsSendingComponent } from './sms-sending/sms-sending.component';
import { DocViewerSharedModule } from 'projects/document-viewer/src/app/app.module';
import {
  ConfirmProducts,
  ReassignFromSale,
} from './sales-view/sale/sale.component';
import {
  DeleteFile,
  UploadFilesComponent,
} from './upload-files/upload-files.component';
import {
  EmployeeCrud,
  EmployeeListComponent,
} from './employee-list/employee-list.component';
import { AttendanceManagementSharedModule } from 'projects/attendancemanagement/src/app/app.module';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { FreeToolSharedModule } from 'projects/free-tool/src/app/app.module';
import { EmployeeMonthlyReportComponent } from './employee-monthly-report/employee-monthly-report.component';
import { EmployeeTodaysReportComponent } from './employee-todays-report/employee-todays-report.component';
import { TempSelected } from './settings/employee-settings/employee-settings.component';
import { CustomReportsChannelpartnerComponent } from './custom-reports-channelpartner/custom-reports-channelpartner.component';
import { StageAutumationCreateComponent } from './automations/stage-autumation-create/stage-autumation-create.component';
import { FunctionstesterComponent } from './functionstester/functionstester.component';
import { CallViewComponent } from './call-view/call-view.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { CrudServiceComponent } from './crud-service/crud-service.component';
import { AddExperiencePopupComponent } from 'projects/test-app/src/app/english-channel-contact-tab2/add-experience-popup/add-experience-popup.component';
import { PopupdialogComponent } from 'projects/test-app/src/app/english-channel-sale-tab1/popupdialog/popupdialog.component';
import { DeleteConfirmComponent } from 'projects/test-app/src/app/english-channel-contact-tab1/delete-confirm/delete-confirm.component';
import { UploadPopupComponent } from 'projects/test-app/src/app/english-channel-contact-tab1/upload-popup/upload-popup.component';

import { CallViewAudioPlayerComponent } from './call-view-audio-player/call-view-audio-player.component';
;
import { DatePipe } from '@angular/common';
import { LgcustomercaptureSharedModule } from 'projects/lgcustomercapture/src/app/app.module';

import { FollowupTaskCreateComponent } from './followup-task-create/followup-task-create.component';

import { GridsterModule } from 'angular-gridster2';
import { DashboardDialog, DashboardgridComponent } from './customized-reports/dashboardgrid/dashboardgrid.component';
import { CommonSearchModule } from './common-search/common-search.module';
import { ChangeLogComponent } from './change-log/change-log.component';
import { CallViewPopUpComponent } from './call-view-pop-up/call-view-pop-up.component';
import { CardSettingsComponent } from './card-settings/card-settings.component';
import { ViewBuilderComponent } from './view-builder/view-builder.component';
import { CustomizedReportsModule } from './customized-reports/customized-reports.module';

import { CustomTablesModule } from './custom-tables/custom-tables.module';
import { CommonBranchComponent } from './common-branch/common-branch.component';
import { DebounceClickDirective } from './directive/debounce-click.directive';
import { OrganisationModule } from './organisation/organisation.module';
import { CommonOrgTagComponent } from './common-org-tag/common-org-tag.component';
import { ChildProductSettings,ProductCategoryComponent } from './product-category/product-category.component';
import { CommonCurrencyComponent } from './common-currency/common-currency.component';
import { PlatformModule } from '@angular/cdk/platform';
import { FbLeadsComponent } from './fb-leads/fb-leads.component';
import { PageSettingsComponent } from './fb-leads/page-settings/page-settings.component';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { OutlookModule } from './outlook/outlook.module';
import { EstimateTableComponent } from './table/estimate-table/estimate-table.component';
import { QuotationTableComponent } from './table/quotation-table/quotation-table.component';
import { EventsComponent } from './events/events.component';
import { FollowupTableComponent } from './table/FollowUp/followup-table/followup-table.component';
import { InvoiceTableComponent } from './table/invoice-table/invoice-table.component';
import { ChildPipelineAndStages } from './settings/pipeline-and-stages/pipeline-and-stages/pipeline-and-stages.component';
import { CustomerListComponent } from './table/customer/customer-list/customer-list.component';
import { CustomerListGridViewComponent } from './table/customer/customer-list-grid-view/customer-list-grid-view.component';
import { CustomerTableViewComponent } from './table/customer/customer-table-view/customer-table-view.component';
import { SaleListComponent } from './table/sale/sale-list/sale-list.component';
import { SaleGridViewComponent } from './table/sale/sale-grid-view/sale-grid-view.component';
import { SaleTableViewComponent } from './table/sale/sale-table-view/sale-table-view.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { TaskListComponent } from './table/task/task-list/task-list.component';
import { TaskTableViewComponent } from './table/task/task-table-view/task-table-view.component';
import { GridContainerComponent } from './table/FollowUp/grid-container/grid-container.component';
import { TaskGridViewComponent } from './table/task/task-grid-view/task-grid-view.component';
import { FollowupListComponent } from './table/FollowUp/followup-list/followup-list.component';
import { LoginPageComponent } from './login-signup/login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { LiteModeViewFilterComponent } from './table/lite-mode-view-filter/lite-mode-view-filter.component';
import { CustomerGridComponent } from './table/customer/customer-grid/customer-grid.component';
import { CustomViewSelectComponent } from './table/customer/custom-view-select/custom-view-select.component';
import { SaleCustomViewSelectComponent } from './table/sale/sale-custom-view-select/sale-custom-view-select.component';
import { SaleGridComponent } from './table/sale/sale-grid/sale-grid.component';
import { SupportListComponent } from './table/support/support-list/support-list.component';
import { SupportGridViewComponent } from './table/support/support-grid-view/support-grid-view.component';
import { SupportTableViewComponent } from './table/support/support-table-view/support-table-view.component';
import { SupportGridComponent } from './table/support/support-grid/support-grid.component';
import { SupportCustomViewSelectComponent } from './table/support/support-custom-view-select/support-custom-view-select.component';
import { UserLoginComponent } from './user-login/user-login/user-login.component';
import { AdminViewComponent } from './user-login/admin-view/admin-view.component';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader');
    },
  },
  signInFlow: 'popup',
  signInSuccessUrl: '/loading',
  signInOptions: [
    //GMail Auth Provider
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      //clientId: '1059747170002-mb13fen3gnln217t3sfjuvsa80u7ildr.apps.googleusercontent.com',
      scopes: [
        //'https://www.googleapis.com/auth/contacts.readonly' commenting out access to contacts
        //'https://www.googleapis.com/auth/calendar'
      ],
      customParameters: {
        // Forces account selection even when one account
        // is available.
        prompt: 'select_account',
        auth_type: 'reauthenticate',
      },
    },
    //Outlook Auth Provider
    // {
    //   provider: new firebase.auth.OAuthProvider('microsoft.com').providerId,

    //   scopes: [
    //     'mail.read', 'user.read'
    //   ],
    //   customParameters: {
    //     // Forces account selection even when one account
    //     // is available.
    //     prompt: 'select_account',
    //     auth_type: 'reauthenticate',
    //     clientId: '069c556f-1094-43e1-9beb-da5a93966ce4', // Application (client) ID from the app registration
    //     authority: 'https://login.microsoftonline.com/common/', // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
    //   },
    // },
    //EMail Auth Provider
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    },
  ],
  //tosUrl: '<your-tos-link>',
  //privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};

//The following section is currently not used
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: '/loading',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

var firebaseConfig = environment.firebaseConfig;

@NgModule({
  declarations: [
    MarkdownPipe,
    //AddNewCustomerComponent,
    AppComponent,
    //HomeComponent,
    Addnewsale1Component,
    LoginComponent,
    FullLayoutComponent,
    DashhomeComponent,

    ReportleaddialogComponent,
    CustomersearchComponent,

    RejectleaddialogComponent,
    FollowUpListMaterialComponent,

    ContactdashboardComponent,
    ChangecuststatdialogComponent,
    ChangecustprioritydialogComponent,
    TaskboardComponent,
    ImageUploadComponent,
    TemplatePrev1Component,
    TemplatePrev2Component,
    TemplatePrev3Component,
    TemplatePrev4Component,
    TemplatePrev5Component,
    TaskboardComponent,
    CrudModal1Component,
    Paymentreceipt1Component,
    CustomerSearchPopUpComponent,

    ChangesaleprioritydialogComponent,
    ChangesalestatdialogComponent,
    //DocumentsettingsComponent,
    SelectcustsaleComponent,
    SelectsaledialogComponent,
    InquirestableComponent,
    InquiresviewComponent,
    //SaleReportAgeComponent,
    //SaleReportStatusValueComponent,
    CreateloadingComponent,
    //UsersettingsComponent,
    ConfirmationpopupComponent,
    //SaleReportInvoiceCollectionComponent,
    //CustomersettingsComponent,
    //SalesettingsComponent,
    //ContactFunnelReportComponent,
    //ContactStageAgeReportComponent,
    //ContactReportNoFollowupComponent,

    DropzoneDirective,

    //CallerviewComponent,
    //UploadExcelComponent,

    //AddSaleMobileViewComponent,

    //HomeMaterialComponent,
    //UserprofileComponent,

    AddNewServiceComponent,
    // StripePortalComponent,
    //TermsofserviceComponent,
    //PrivacypolicyComponent,

    //SubusersComponent,
    // DialogOverviewExampleDialog,
    //EmailapiComponent,
    //DocumentsettingsDirective,
    // AddsubscriptionComponent,
    // StripePaymentsComponent,
    //EmailapiComponent,
    //DashboardComponent,
    Addcontactpopup1Component,

    InvoiceGeneratorComponent,

    //EmailpopupComponent,
    // ComposemailComponent,
    /*HomeMainComponent,
    HomeGoOnlineComponent,
    HomeCustomerManagementComponent,
    HomeSalesProManagementComponent,
    HomeInvoicingComponent,
    HomeCollectionComponent,
    HomeProductGuideComponent,
    TestingComponent,
    HomeQuickStartGuideComponent,
    HomeTaskManagementComponent,
    HomeMeetingAndAppointmentsComponent,
    HomeCustomerFollowUpsComponent,
    HomeAddingNotesComponent,
    HomeInquiryManagementComponent,
    TestingComponent,
    HomeDashboardsAndReportsComponent,
    HomeUploadingAttachmentsComponent,
    HomeUploadingContactsComponent,
    HomeSetUpPublicProfileComponent,
    HomeManageYourSettingsComponent,
    BlogsUsingzenysComponent,
    BlogsArchitectureComponent,
    BlogsAllComponent,
    BlogDetailedComponent,*/
    //BottomSheetMeetingComponent,
    //ProfileSettingsComponent,
    //StatusChangePopupComponent,

    // AddsalemobileComponent,
    //BlogComponent,
    // AddsubscriptionforfreeComponent,

    SearchComponent,
    // ShowemailthreadComponent,
    // HeadermobileComponent,
    // SidenavComponent,


    ConfirmationpopupComponent,
    //TermsComponent,
    //RefundsComponent,
    // RazorpaytestComponent,
    // PaymentselectorComponent,
    //RazortrialComponent,


    // TaskboardMobileComponent,

    // TimeFormat,

    // InvoicemodalComponent,
    // PaymentsComponent,
    // SubscriptionsComponent,
    // AllpayssubsComponent,
    UploadCustomerLimitPopupComponent,
    //MessagebirdapiComponent,
    //MakepaymentLinkComponent,
    //HomePhotographyComponent,
    //HomeArchitectureComponent,
    Expenses1Component,
    ExpensesListComponent,
    SplashScreenComponent,

    // BottomSheetPaymentUpdateComponent,
    //EmailTemplateSettingsComponent,
    //EmailTemplateComponent,
    SubuserProfilesDialog,
    DialogOverviewExampleDialog,
    InvitingEmail,
    DeleteConfirmationSubusers,
    DeleteConfirmationEmail,
    ConfirmEditAssignedTo,
    ConfirmAssignedto,
    DeleteConfirmation,
    EmailTemplateType,
    AddProduct,
    SalesAddProduct,
    PopupDeleteInquiry,
    ProductsAndServicesComponent,
    FreeUserPopupComponent,

    AutomationComponent,

    FirebaseLoginPageComponent,
    AutomationlistComponent,



    // BottomSheetCollectionFromListComponent,

    ToolBarSearchComponent,

    UploadCustomerExcelComponent,

    PopupComponent,

    // Dialog2Component,
    ObservableTableComponent,

    ServicesComponent,
    ReassignFromSale,
    ChildFollowUpList,
    ChildTaskboard,
    ConfirmProducts,
    UploadFilesComponent,
    EmployeeListComponent,
    EmployeeCrud,
    TempSelected,
    DeleteFile,

    SmsSendingComponent,

    EmployeeMonthlyReportComponent,

    EmployeeTodaysReportComponent,

    CustomReportsChannelpartnerComponent,

    StageAutumationCreateComponent,

    FunctionstesterComponent,

    CallViewComponent,
    AccessDeniedComponent,

    CrudServiceComponent,

    // ComponentInjectorComponent,

    // InterfaceComponent,

    // CdkDetailRowDirective,

    // EstimateListMobileComponent,

    // QuotationListMobileComponent,

    // InvoiceListMobileComponent,

    // CollectionListMobileComponent
    // PaymentReceiptUpdatedComponent
    AddExperiencePopupComponent,
    PopupdialogComponent,
    DeleteConfirmComponent,
    UploadPopupComponent,

    CallViewAudioPlayerComponent,



    FollowupTaskCreateComponent,

    // CommonUserSearchComponent,
    // CommonCountryCodeComponent,
    CallViewPopUpComponent,
    // MarkAsteriskDirective,
    CardSettingsComponent,
    ViewBuilderComponent,
    // CommonBranchComponent,
    DebounceClickDirective,
    CommonOrgTagComponent,
    ProductCategoryComponent,
    ChildProductSettings,
    // CommonCurrencyComponent,
    FbLeadsComponent,
    PageSettingsComponent,
    EstimateTableComponent,
    FollowupTableComponent,
    QuotationTableComponent,
    EventsComponent,
    FollowupTableComponent,
    InvoiceTableComponent,
    ChildPipelineAndStages,
    CustomerListComponent,
    CustomerListGridViewComponent,
    CustomerTableViewComponent,
    SaleListComponent,
    SaleGridViewComponent,
    SaleTableViewComponent,
    CreateProfileComponent,
    TaskListComponent,
    TaskTableViewComponent,
    GridContainerComponent,
    TaskGridViewComponent,
    FollowupListComponent,
    LoginPageComponent,
    SignupPageComponent,
    LiteModeViewFilterComponent,
    CustomerGridComponent,
    CustomViewSelectComponent,
    SaleCustomViewSelectComponent,
    SaleGridComponent,
    SupportListComponent,
    SupportGridViewComponent,
    SupportTableViewComponent,
    SupportGridComponent,
    SupportCustomViewSelectComponent,
    UserLoginComponent,
    AdminViewComponent,
    // DashboardgridComponent,
    // DashboardDialog
  ],

  imports: [
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        clientId: environment.outlookClientId, // Application (client) ID from the app registration
        authority: 'https://login.microsoftonline.com/common', // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
        redirectUri: '/auth' // This is your redirect URI
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      }
    }), {
      interactionType: InteractionType.Redirect, // MSAL Guard Configuration
      authRequest: {
        scopes: ['User.Read', 'Mail.Read', 'Mail.Send', 'Mail.ReadWrite', 'Calendars.Read', 'Calendars.ReadWrite', 'Calendars.Read.Shared', 'Calendars.ReadWrite.Shared', 'Calendars.ReadBasic']
      }
  }, {
    interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
    protectedResourceMap: new Map([
        ['https://graph.microsoft.com/beta/me', ['User.Read']],
        ['https://graph.microsoft.com/beta/me/messages', ['Mail.Read']],
        ['https://graph.microsoft.com/beta/me/sendMail', ['Mail.Send']],
        ['https://graph.microsoft.com/v1.0/me/calendarview',['Calendars.Read', 'Calendars.ReadWrite', 'Calendars.ReadBasic']],
        ['https://graph.microsoft.com/v1.0/me/events',['Calendars.Read', 'Calendars.ReadWrite', 'Calendars.ReadBasic']]
    ])
  }),
    CommonSearchModule,
    OrganisationModule,
    SharedModule,
    ToastrModule.forRoot(),
    //AngularFirestoreModule.enablePersistence(),//@MK 17/11/2021 - Persistance disabled as it seems to be making the web application slow

    BrowserModule,
    PlatformModule,
    AppRoutingModule,
    HttpClientModule,
    AngularEditorModule,
    //MatTableExporterModule,
    GooglePlaceModule,
    // GooglePlaceModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    // MatGoogleMapsAutocompleteModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    ZenysInternalDashboardSharedModule.forRoot(),
    // LeadCaptureSharedModule.forRoot(),
    LgcustomercaptureSharedModule.forRoot(),
    AttendanceManagementSharedModule.forRoot(),
    DocViewerSharedModule.forRoot(),
    FreeToolSharedModule.forRoot(),
    CustomizedReportsModule,
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyBI56WjWQbehuQKXtWW6fPm6RRF0KRQCBw',
      apiKey: 'AIzaSyCapl26Q6eZWn7yRdyhfUFwPDS7zwVfQOQ',
      libraries: ['places'],
      apiVersion: 'quarterly',
    }),

    /*Old ngx-auth-ui module which was removed due to issue in user record creation
    NgxAuthFirebaseUIModule.forRoot({
      //Setting for testing in local host
               apiKey: "AIzaSyDkHIhzGjy358lVXGMUo12yRRGtO6OdfMI",
            authDomain: "zenysdevelopment-f6491.firebaseapp.com",
            projectId: "zenysdevelopment-f6491",
            storageBucket: "zenysdevelopment-f6491.appspot.com",
            messagingSenderId: "926474914640",
            appId: "1:926474914640:web:276883d07682610c237a55",
            measurementId: "G-S18ZSBDGY2"

      //setting for testing system (online - Zenys development)

  //Settings for Production environment
  // apiKey: "  AIzaSyCHXy0lc_CPwPa8mPL0WIRGlvsjsWbUJb4",
  //   authDomain: "zenysproduction.firebaseapp.com",
  //    projectId: "zenysproduction",
  //   storageBucket: "zenysproduction.appspot.com",
  //    messagingSenderId: "461454236300",
  //    appId: "1:461454236300:web:62fca20bfcfd31740bb9a9",
  //    measurementId: "G-GMK88N8BFL"
    },
      () => 'ZenysDevelopment',
      {
        enableFirestoreSync: false, // enable/disable autosync users with firestore
        toastMessageOnAuthSuccess: false, // whether to open/show a snackbar message on auth success - default : true
        toastMessageOnAuthError: true, // whether to open/show a snackbar message on auth error - default : true
        //authGuardFallbackURL: '/loggedout', // url for unauthenticated users - to use in combination with canActivate feature on a route
        authGuardLoggedInURL: '/loading', // url for authenticated users - to use in combination with canActivate feature on a route
        passwordMaxLength: 20, // `min/max` input parameters in components should be within this range.
        passwordMinLength: 8, // Password length min/max in forms independently of each componenet min/max.
        // Same as password but for the name
        nameMaxLength: 50,
        nameMinLength: 2,
        // If set, sign-in/up form is not available until email has been verified.
        // Plus protected routes are still protected even though user is connected.
        guardProtectedRoutesUntilEmailIsVerified: false,
        enableEmailVerification: false, // default: true
      }
    ),*/
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAnalyticsModule,

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    GmailModule,
    OutlookModule,
    AngularFireMessagingModule,
    GridsterModule,
    CustomTablesModule,
  ],
  providers: [

    ScreenTrackingService,
    UserTrackingService,
    PwaserviceService,
    SplashScreenService,
    PushnotificationService,
    DatePipe,
    FullLayoutComponent,
    MsalGuard, // MsalGuard added as provider here
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
  ],
  bootstrap: [
    AppComponent,
    MsalRedirectComponent // MsalRedirectComponent bootstrapped here
  ],
})
export class AppModule {}

