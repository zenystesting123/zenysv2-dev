import { SmsSendingComponent } from './sms-sending/sms-sending.component';
import { UploadCustomerExcelComponent } from './upload-customer-excel/upload-customer-excel.component';
import { FirebaseLoginPageComponent } from './firebase-login-page/firebase-login-page.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { SearchComponent } from './search/search.component';
import { CreateloadingComponent } from './createloading/createloading.component';
import { InquirestableComponent } from './inquirestable/inquirestable.component';
//import { DocumentsettingsComponent } from './documentsettings/documentsettings.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { DashhomeComponent } from './dashhome/dashhome.component';
import { CustomersearchComponent } from './customersearch/customersearch.component';

import { FollowUpListMaterialComponent } from './follow-up-list-material/follow-up-list-material.component';

import { ContactdashboardComponent } from './contactdashboard/contactdashboard.component';
import { TaskboardComponent } from './taskboard/taskboard.component';
import { SelectcustsaleComponent } from './selectcustsale/selectcustsale.component';
import { SelectsaledialogComponent } from './selectsaledialog/selectsaledialog.component';
import { InvoiceGeneratorComponent } from './invoice-generator/invoice-generator.component';
import { ShowemailthreadComponent } from './gmail/showemailthread/showemailthread.component';
import { GoogleCalandarEventsListComponent } from './calendar-events/google-calandar-events-list/google-calandar-events-list.component';
import { RazorpayModule } from './razorpaytest/razorpay.module';
import {
  AddProduct,
  ProductsAndServicesComponent,
} from './products-and-services/products-and-services.component';
import { AutomationComponent } from './automation/automation.component';

import { AutomationlistComponent } from './automations/automationlist/automationlist.component';

import { ToolBarSearchComponent } from './tool-bar-search/tool-bar-search.component';
import { ObservableTableComponent } from './observable-table/observable-table.component';
import { UploadFilesComponent } from './upload-files/upload-files.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeMonthlyReportComponent } from './employee-monthly-report/employee-monthly-report.component';
import { EmployeeTodaysReportComponent } from './employee-todays-report/employee-todays-report.component';
import { AttendanceMarkingComponent } from 'projects/attendancemanagement/src/app/attendance-marking/attendance-marking.component';
import { StageAutumationCreateComponent } from './automations/stage-autumation-create/stage-autumation-create.component';
import { FunctionstesterComponent } from './functionstester/functionstester.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

import { Addcontactpopup1Component } from './addcontactpopup1/addcontactpopup1.component';
import { Addnewsale1Component } from './addnewsale1/addnewsale1.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { FbLeadsComponent } from './fb-leads/fb-leads.component';
import { PageSettingsComponent } from './fb-leads/page-settings/page-settings.component';
import { MsalRedirectComponent } from '@azure/msal-angular';
import { EventsComponent } from './events/events.component';
import { FollowupTableComponent } from './table/FollowUp/followup-table/followup-table.component';
import { EstimateTableComponent } from './table/estimate-table/estimate-table.component';
import { QuotationTableComponent } from './table/quotation-table/quotation-table.component';
import { InvoiceTableComponent } from './table/invoice-table/invoice-table.component';
import { CustomerListComponent } from './table/customer/customer-list/customer-list.component';
import { SaleListComponent } from './table/sale/sale-list/sale-list.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { GridContainerComponent } from './table/FollowUp/grid-container/grid-container.component';
import { TaskListComponent } from './table/task/task-list/task-list.component';
import { LoginPageComponent } from './login-signup/login-page/login-page.component';
import { CustomerGridComponent } from './table/customer/customer-grid/customer-grid.component';
import { SupportListComponent } from './table/support/support-list/support-list.component';
import { UserLoginComponent } from './user-login/user-login/user-login.component';
import { AdminViewComponent } from './user-login/admin-view/admin-view.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  //changing the default path to login
  /* {
     path: '',
     component: LoginComponent,
     data: {
       title: 'login'
     },
   },*/
  {
    path: '',
    component: LoginPageComponent,
    data: {
      title: 'login',
    },
  },
  {
    path: 'user-login',
    component: UserLoginComponent,
    data: {
      title: 'user-login',
    },
  },
{
  path: 'admin',
  component: AdminViewComponent,
  data: {
    title: 'admin',
  },
},
  {
    path: 'zenysinternaldashboard',
    loadChildren:
      '../../projects/zenysinternaldashboard/src/app/app.module#ZenysInternalDashboardSharedModule',
  },
  // {
  //   path: 'docview',
  //   loadChildren:
  //     '../../projects/document-viewer/src/app/app.module#DocViewerSharedModule',
  // },
  // {
  //   path: 'lead-capture-form',
  //   loadChildren:
  //     '../../projects/lead-capture/src/app/app.module#LeadCaptureSharedModule',
  // },
  {
    path: 'lgcustomercapture',
    loadChildren:
      '../../projects/lgcustomercapture/src/app/app.module#LgcustomercaptureSharedModule',
  },
  {
    path: 'attendancemanagement',
    loadChildren:
      '../../projects/attendancemanagement/src/app/app.module#AttendanceManagementSharedModule',
  },
  {
    path: 'zenys-mobile',
    loadChildren:
      '../../projects/zenys-mobile/src/app/app.module#ZenysMobileSharedModule',
  },
  /* {
    path: 'rzr',
    component: RazortrialComponent
  },*/

  {
    path: 'login',
    component: LoginPageComponent,
    data: {
      title: 'login',
    },
  },

  {
    path: 'firebase-login',
    component: FirebaseLoginPageComponent,
    data: {
      title: 'firebase-login',
    },
  },
  {
    path: 'stripe',
    loadChildren: () =>
      import('./striperefreshmodule/striperefreshmodule.module').then(
        (m) => m.StriperefreshmoduleModule
      ),
  },
  {
    path: 'events',
    component: EventsComponent,
    data: {
      title: 'event',
      animation: 'calendar',
    },
  },
  {
    path: 'eventlist',
    loadChildren: () =>
      import('./calendar-events/calendar-events.module').then(
        (m) => m.CalendarEventsModule
      ),
  },
  {
    path: 'outlookeventlist',
    loadChildren: () =>
      import('./outlook-calendar-events/outlook-calendar-events.module').then(
        (m) => m.OutlookCalendarEventsModule
      ),
  },
  {
    path: 'tools',
    loadChildren: () =>
      import('./free-tool/free-tool.module').then((m) => m.FreeToolModule),
  },
  {
    path: 'create-profile',
    component: CreateProfileComponent,
    data: {
      title: 'create-profile',
    },
  },
  {
    path: 'functions',
    component: FunctionstesterComponent,
  },
  {
    path: 'loading',
    component: CreateloadingComponent,
    data: {
      title: 'loading',
    },
  },
  {
    path: 'user-login-locked',
    component: AccessDeniedComponent,
    data: {
      title: 'user-login-locked',
    },
  },

  /*{
    path: 'termsofservice',
    component: TermsofserviceComponent,
    data: {
      title: 'termsofservice'
    },
  },
  {
    path: 'privacypolicy',
    component: PrivacypolicyComponent,
    data: {
      title: 'privacypolicy'
    },
  },*/
  // {
  //   path: 'calendar',
  //   loadChildren: () => import('../app/calendar/calendar.module').then(m => m.CalendarsModule)
  // },
  // {
  //   path: 'calendar/:custId',
  //   loadChildren: () => import('../app/calendar/calendar.module').then(m => m.CalendarsModule)
  // },

  // {
  //   path: 'razorpay',
  //   component: RazorpaytestComponent,
  //   data: {
  //     title: 'razor'
  //   }
  // },
  // gmail path

  {
    //lazy load gmail module
    path: 'gmail',
    loadChildren: () =>
      import('./gmail/gmail.module').then((m) => m.GmailModule),
  },

  // gmail path

  {
    //lazy load outlook module
    path: 'outlook',
    loadChildren: () =>
      import('./outlook/outlook.module').then((m) => m.OutlookModule),
  },

  //auth component to recieve access token for outlook redirect
  {
    //lazy load outlook module
    path: 'auth',
    component: MsalRedirectComponent,
  },

  //Routes for dash/
  {
    path: 'dash',
    component: FullLayoutComponent,
    data: {
      title: 'Panel',
      authGuardPipe: redirectUnauthorizedToLogin,
    },
    children: [
      // {
      //   path:"grid",
      //   component:DashboardgridComponent
      // },
      {
        path:"followup-lite",
        component: GridContainerComponent
      },
      {
        path:"inv-paginator-table",
        component:InvoiceTableComponent
      },


      {
        path:"customer-list",
        component:CustomerListComponent
      },
      {
        path:"customer-table",
        component:CustomerGridComponent
      },
      {
        path:"sale-list",
        component:SaleListComponent
      },
      {
        path:"support-list",
        component:SupportListComponent
      },
      {
        path:"task-list",
        component:TaskListComponent
      },
      {
        path:"followup-table",
        component:FollowupTableComponent
      },
      {
        path:"estimate-table",
        component:EstimateTableComponent
      },
      {
        path:"quotation-table",
        component:QuotationTableComponent
      },
      {
        path: 'custom-report',
        loadChildren: () =>
          import('./customized-reports/customized-reports.module').then((m) => m.CustomizedReportsModule),
      },
      {
        //lazy load settings module
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        //lazy load document module
        path: 'doc',
        loadChildren: () =>
          import('./doc-management/document.module').then(
            (m) => m.DocumentModule
          ),
      },
      {
        //lazy load document module
        path: 'document',
        loadChildren: () =>
          import('./document-management-new/document-management-new.module').then(
            (m) => m.DocumentManagementNewModule
          ),
      },
      {
        //lazy load document module
        path: 'documents-list',
        loadChildren: () =>
          import('./documents/documents.module').then((m) => m.DocumentsModule),
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./contact/contact.module').then((m) => m.ContactModule),
      },
      {
        path: 'organisation',
        loadChildren: () =>
          import('./organisation/organisation.module').then((m) => m.OrganisationModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profilemodule/profilemodule.module').then(
            (m) => m.ProfilemoduleModule
          ),
      },
      {
        path: 'events',
        component: EventsComponent,
        data: {
          title: 'event',
          animation: 'calendar',
        },
      },
      {
        path: 'eventlist',
        loadChildren: () =>
          import('./calendar-events/calendar-events.module').then(
            (m) => m.CalendarEventsModule
          ),
      },
      {
        path: 'outlookeventlist',
        loadChildren: () =>
          import('./outlook-calendar-events/outlook-calendar-events.module').then(
            (m) => m.OutlookCalendarEventsModule
          ),
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./sales-view/sales-view.module').then(
            (m) => m.SalesViewModule
          ),
      },
      {
        path: 'leadshare',
        loadChildren: () =>
          import('./leads-view/leads-view.module').then(
            (m) => m.LeadsViewModule
          ),
      },

      {
        path: 'razorpay',
        loadChildren: () =>
          import('./razorpaytest/razorpay.module').then((m) => RazorpayModule),
      },
      /*{
        path: 'makelink',
        component: MakepaymentLinkComponent,
        data: {
          title: 'createprofile'
        },
      },*/
      //
      // path for chats
      {
        path: 'chat/:type',
        loadChildren: () =>
          import('./chat/chat.module').then((m) => m.ChatModule),
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('./chat/chat.module').then((m) => m.ChatModule),
      },

      // path for chats end

      // gmail component

      {
        path: 'attendancemanagement',
        loadChildren:
          '../../projects/attendancemanagement/src/app/app.module#AttendanceManagementSharedModule',
      },

      {
        //lazy load service module
        path: 'service',
        loadChildren: () =>
          import('./service-module/service-module.module').then((m) => m.ServiceModuleModule),
      },
      {
        path: 'search/:searchTerm/:searchSelected',
        component: ToolBarSearchComponent,
        data: {
          title: 'search',
        },
      },

      {
        path: 'upload-customer-excel',
        component: UploadCustomerExcelComponent,
        data: {
          title: 'upload-excel',
        },
      },

      {
        path: 'tasks',
        component: TaskboardComponent,
        data: {
          title: 'Taskboard',
          animation: 'Tasks',
        },

      },



      {
        path: 'tasks/:id',
        component: TaskboardComponent,
        data: {
          title: 'Taskboard',
        },
      },
      {
        path: 'fb',
        component: FbLeadsComponent,
        data: {
          title: 'FB Leads',
        },
      },
      {
        path: 'fbPage',
        component: PageSettingsComponent,
        data: {
          title: 'FB Leads',
        },
      },
      {
        path: 'obs-table',
        component: ObservableTableComponent,
        data: {
          title: 'Obs-Table',
        },
      },

      {
        path: 'tasks/:id/:saleId',
        component: TaskboardComponent,
        data: {
          title: 'Taskboard',
        },
      },
      {
        path: 'custsale', //use this component to select a sale after selecting a customer
        component: SelectcustsaleComponent,
        data: {
          title: 'custsale',
        },
      },

      // {
      //   path: 'calendar',
      //   loadChildren: () => import('../app/calendar/calendar.module').then(m => m.CalendarsModule)
      // },

      {
        path: 'home',
        component: DashhomeComponent,
        data: {
          animation: 'Home',
          title: 'Panel',
        },
      },
      {
        path: 'attendancemanagement/attendance-marking',
        component: AttendanceMarkingComponent,
      },
      {
        path: 'searchcs',
        component: CustomersearchComponent,
        data: {
          title: 'Search Customer',
        },
      },
      /*{
        path: 'emailapi',
        component: EmailapiComponent,
        data: {
          title: 'Email api'
        },
      },*/

      {
        path: 'searchsale',
        component: SelectsaledialogComponent,
        data: {
          title: 'Select  Sale',
        },
      },

      {
        path: 'ExpensesList',
        component: ExpensesListComponent,
        data: {
          title: 'Expenseslist',
          animation: 'Expenses',
        },
      },
      {
        path: 'products-and-services',
        component: ProductsAndServicesComponent,
        data: {
          title: 'ProductsnServices',
          animation: 'ProdnServ',
        },
      },
      {
        path: 'products-categories',
        component: ProductCategoryComponent,
        data: {
          title: 'Product Category',
          animation: 'ProdnServ',
        },
      },
      {
        path: 'upload-files',
        component: UploadFilesComponent,
        data: {
          title: 'uploadFiles',
          animation: 'UploadFiles',
        },
      },
      {
        path: 'employee-list',
        component: EmployeeListComponent,
        data: {
          title: 'EmployeeList',
          animation: 'empList',
        },
      },
      {
        path: 'employee-monthly-report',
        component: EmployeeMonthlyReportComponent,
        data: {
          title: 'EmployeeMonthlyReport',
          animation: 'mAtt',
        },
      },
      {
        path: 'employee-todays-report',
        component: EmployeeTodaysReportComponent,
        data: {
          title: 'EmployeeTodaysReport',
          animation: 'dAtt',
        },
      },
      {
        path: 'Inquireslist',
        component: InquirestableComponent,
        data: {
          animation: 'Inquiries',
          title: 'Inquireslist',
        },
      },
      {
        path: 'sms-request',
        component: SmsSendingComponent,
        data: {
          // animation: 'Inquiries',
          title: 'sms-request',
        },
      },
      /* {
        path: 'uploadexcel',
        component: UploadExcelComponent,
        data: {
          title: 'upload-excel'
        },
      },*/
      {
        path: 'followuplist',
        component: FollowUpListMaterialComponent,
        data: {
          title: 'followuplist',
          animation: 'followups',
        },
      },

      /* {
         path: 'contactfunnel',
         component: ContactFunnelReportComponent,
         data: {
           title: 'contactfunnel'
         },
       },
       {
         path: 'contactstageage/:scn',
         component: ContactStageAgeReportComponent,
         data: {
           title: 'contactstageage'
         },
       },
       {
         path: 'contactreportnofllowup',
         component: ContactReportNoFollowupComponent,
         data: {
           title: 'contactreportnofllowup'
         },
       },*/

      /*
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'dashboard'
        },
      },*/
      /*{
       path: 'salereport',
       component: SaleReportStatusValueComponent,
       data: {
         title: 'salereport'
       },
     },
    {
       path: 'salereportage/:scn',
       component: SaleReportAgeComponent,
       data: {
         title: 'salereportage'
       },
     },

     {
       path: 'salereportinvoicecollected',
       component: SaleReportInvoiceCollectionComponent,
       data: {
         title: 'salereportinvoicecollected'
       },
     },


     {
       path: 'invoicegenerator/:saleID/:scn/:docType/:custID/:docID',
       component: InvoiceGeneratorComponent
     },



     /*{
       path: 'customersettings',
       component: CustomersettingsComponent,
       data: {
         title: 'Customer settings'
       },
     },
     {
       path: 'customersettings/:id',
       component: CustomersettingsComponent,
       data: {
         title: 'Customer settings'
       },
     },
     {
       path: 'salesettings',
       component: SalesettingsComponent,
       data: {
         title: 'Sale settings'
       },
     },
     {
       path: 'profilesettings',
       component: ProfileSettingsComponent,
       data: {
         title: 'profile settings'
       },
     },
     {
       path: 'subusers',
       component: SubusersComponent
       // data: {
       //   title: 'SubUsers'
       // },
     },*/

      {
        path: 'contacts',
        component: ContactdashboardComponent,
        data: {
          title: 'contact',
        },
      },
      // {
      //   path: 'profile',
      //   component: ProfileComponent,
      //   data: {
      //     title: 'Profile'
      //   },
      // },

      /* {
        path: 'addcontacts/:scn/:id',
        component: AddNewCustomerComponent,
        data: {
          title: 'addcontact'
        },
      },
      {
        path: 'addnewsale',
        component: AddnewsaleComponent,
        data: {
          scenario: "create"
        }
      },*/

      {
        path: 'automations/:mode/:id',
        component: AutomationComponent,
        data: {
          scenario: 'automation',
        },
      },
      {
        path: 'stageautomations/:mode/:id',
        component: StageAutumationCreateComponent,
        data: {
          scenario: 'automation',
        },
      },
      {
        path: 'automation-list',
        component: AutomationlistComponent,
      },

      // {
      //   path: 'addcontacts/:scn',
      //   component: AddNewCustomerComponent,
      //   data: {
      //     title: 'addcontact'
      //   },
      // },
      /*{
        path: 'addsale/:scn/:id/:id1/:title',
        component: AddSaleMobileViewComponent,
        data: {
          title: 'addsale'
        },
      },
      {
        path: 'addsale/:scn/:id',
        component: AddSaleMobileViewComponent,
        data: {
          title: 'addsale'
        },
      },
      {
        path: 'addsale/:scn',
        component: AddSaleMobileViewComponent,
        data: {
          title: 'addsale'
        },
      },
      {
        path: 'addSale',
        component: AddnewsaleComponent,
        data: {
          title: 'addSale'
        },
      },
      {
        path: 'addCustomer',
        component: AddNewCustomerComponent,
        data: {
          title: 'addContact'
        },
      },
      {
        path: 'addcontacts/:scn/:id/:id1',
        component: AddNewCustomerComponent,
        data: {
          title: 'addcontact'
        },
      },

      {
        path: 'testing',
        component: TestingComponent,
        data: {
          title: 'testing'
        },
      },*/
      /*{
        path: 'document-settings',
        component: DocumentsettingsComponent,
        data: {
          title: 'document-settings'
        },
      },
      {
        path: 'email-template-settings',
        component: EmailTemplateSettingsComponent,
        data: {
          title: 'email-template-settings'
        },
      },
      {
        path: 'email-templates',
        component: EmailTemplateComponent,
        data: {
          title: 'EmailTemplates'
        },
        children:[
          {path:':scn/:id', component:EmailTemplateSettingsComponent},
          {path:':scn', component:EmailTemplateSettingsComponent}
        ]
      },*/

      /*{
        path: 'callerview/:custId', //view for calling agents
        component: CallerviewComponent,
        data: {
          title: 'Customer Calling Details'
        },
      },*/

      /*{
        path: 'usersettings',
        component: UsersettingsComponent,
        data: {
          title: 'User Settings'
        },
      },*/
      /*{
        path: 'userProfile',
        component: UserprofileComponent,
        data: {
          title: 'User Profile'
        },
      },*/
      {
        path: 'email/:mailthreadId',
        component: ShowemailthreadComponent,
        data: {
          title: 'email',
        },
      },
    ],
    canActivate: [AngularFireAuthGuard],
  },

  //Routes for home page and corresponding child components
  /*
   {
     path: 'homepage',
     component: HomeMaterialComponent,
     data: {
       title: 'HomePage'
     },
     children: [
       {

         path: '',
         component: HomeMainComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'search',
         component: SearchComponent,
         data: {
         title: 'search'
         },
       },
       {
         path: 'search/:category/:locType/:location',
         component: SearchComponent,
         data: {
         title: 'search'
         },
       },
       {
         path: 'search/:category',
         component: SearchComponent,
         data: {
         title: 'search'
         },
       },
       {
         path: 'go-online',
         component: HomeGoOnlineComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'photography',
         component: HomePhotographyComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'architecture',
         component: HomeArchitectureComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'customer-management',
         component: HomeCustomerManagementComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'sales-pro-management',
         component: HomeSalesProManagementComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'collections',
         component: HomeCollectionComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'invoicing',
         component: HomeInvoicingComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'product-guide',
         component: HomeProductGuideComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'quick-start-guide',
         component: HomeQuickStartGuideComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'task-management',
         component: HomeTaskManagementComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'meeting-appoinments',
         component: HomeMeetingAndAppointmentsComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'customer-followups',
         component: HomeCustomerFollowUpsComponent,
         data: {
           title: 'HomePage'
         },
       },

       {
         path: 'set-up-your-public-profile',
         component: HomeSetUpPublicProfileComponent,
         data: {
           title: 'HomePage'
         },
       },

       {
         path: 'manage-your-settings',
         component: HomeManageYourSettingsComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'adding-notes',
         component: HomeAddingNotesComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'inquiry-management',
         component: HomeInquiryManagementComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'dashboards-and-reports',
         component: HomeDashboardsAndReportsComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'upload-your-attachments',
         component: HomeUploadingAttachmentsComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'upload-multiple-contacts',
         component: HomeUploadingContactsComponent,
         data: {
           title: 'HomePage'
         },
       },
       {
         path: 'blogs',
         component: BlogComponent,
         data: {
           title: 'HomePage'
         },
         children:[
           {path:':scn/:id', component:BlogDetailedComponent},
           {path:':scn', component:BlogsAllComponent}
         ]
       },
       {
         path:'free-tool',
         loadChildren: () => import('./free-gst-invoice/free-gst-invoice.module').then(m => m.FreeGstInvoiceModule)
       },
       {
         path:'blog',
         loadChildren: () => import('./blogs/blogs.module').then(m => m.BlogsModule)
       },
       {
         path: 'terms',
         component: TermsComponent,
         data: {
           title: 'tersm'
         },
       },
       {
         path: 'refund',
         component: RefundsComponent,
         data: {
           title: 'tersm'
         },
       },
       {
         path: 'privacy',
         component: PrivacypolicyComponent,
         data: {
           title: 'privacy'
         },
       },
     ],



   },*/

  {
    //lazy load document module
    path: 'doc',
    loadChildren: () =>
      import('./doc-management/document.module').then((m) => m.DocumentModule),
  },
  {
    //lazy load document module
    path: 'document',
    loadChildren: () =>
      import('./document-management-new/document-management-new.module').then((m) => m.DocumentManagementNewModule),
  },

  {
    path: 'contact',
    loadChildren: () =>
      import('./contact/contact.module').then((m) => m.ContactModule),
  },

  {
    path: 'sales',
    loadChildren: () =>
      import('./sales-view/sales-view.module').then((m) => m.SalesViewModule),
  },
  {
    path: 'leadshare',
    loadChildren: () =>
      import('./leads-view/leads-view.module').then((m) => m.LeadsViewModule),
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then((m) => m.ChatModule),
  },

  /*{
    path: 'callerview/:custId', //view for calling agents
    component: CallerviewComponent,
    data: {
      title: 'Customer Calling Details'
    },
  },

  {
    path: 'Inquireslist',
    component: InquirestableComponent,
    data: {
      title: 'Inquireslist'
    },
  },
  /*{
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: 'dashboard'
    },
  },*/
  {
    path: 'followuplist',
    component: FollowUpListMaterialComponent,
    data: {
      title: 'followuplist',
    },
  },

  /*{
    path: 'customersettings',
    component: CustomersettingsComponent,
    data: {
      title: 'Customer settings'
    },
  },
  {
    path: 'salesettings',
    component: SalesettingsComponent,
    data: {
      title: 'Sale settings'
    },
  },
  {
    path: 'profilesettings',
    component: ProfileSettingsComponent,
    data: {
      title: 'Profile settings'
    },
  },

  {
    path: 'subusers',
    component: SubusersComponent
    // data: {
    //   title: 'SubUsers'
    // },
  },*/
  /*{
    path: 'document-settings',
    component: DocumentsettingsComponent,
    data: {
      title: 'document-settings'
    },
  },
  {
    path: 'email-template-settings',
    component: EmailTemplateSettingsComponent,
    data: {
      title: 'email-template-settings'
    },
  },
  {
    path: 'email-templates',
    component: EmailTemplateComponent,
    data: {
      title: 'EmailTemplates'
    },
    children:[
      {path:':scn/:id', component:EmailTemplateSettingsComponent},
      {path:':scn', component:EmailTemplateSettingsComponent}
    ]
  },*/
  {
    path: 'addcontacts/:scn',
    component: Addcontactpopup1Component,
    data: {
      title: 'addcontact',
    },
  },

  {
    path: 'addcontacts/:scn/:id',
    component: Addcontactpopup1Component,
    data: {
      title: 'addcontact',
    },
  },
  // add product from mobile
  {
    path: 'add-product/:scn/:currency/:taxType/:superUserId/:fieldName/:fieldNameItemsCategory',
    component: AddProduct,
    data: {
      title: 'add-product',
    },
  },
  // view product details from mobile
  {
    path: 'view-product/:scn/:superUserId/:productId/:fieldName/:fieldNameItemsCategory',
    component: AddProduct,
    data: {
      title: 'view-product',
    },
  },

  {
    path: 'addsale/:scn/:id',
    component: Addnewsale1Component,
    data: {
      title: 'addsale',
    },
  },
  {
    path: 'addsale/:scn',
    component: Addnewsale1Component,
    data: { scenario: 'create' },
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    //lazy load document module
    path: 'documents-list',
    loadChildren: () =>
      import('./documents/documents.module').then((m) => m.DocumentsModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
