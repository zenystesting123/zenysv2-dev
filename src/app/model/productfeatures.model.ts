
/*--------------------------------------
Description : For Checks the user plan, free user limitation, plan details
--------------------------------------*/

import {
  Branch,
  Customer,
  FollowUps,
  Inquiries,
  Profile,
  Sales,
  SubUsers,
  UserAccessDetails,
  ProductModel,
  OrganisationModel,
  messageTemplateModel
} from '../data-models';
import { Pipelines } from './pipeline.modal';
//for storing basic details as observable
export class UserDatas {
  constructor(
    public userDetails: Profile, // user details
    public superUserDetails: Profile, // super user details
    public userId: string, // user id
    public usrProfileData: UserAccessDetails, // user profile data
    public inquiryList: Inquiries[], // inquiry list
    public subUsers: SubUsers[], // sub user list
    public authDetails: any, // authentication details
    public isMobileSize: boolean, // check for mobile size
    public isTabetSize: boolean, // check fr tablet size
    public branches: Branch[], //branches saved with common data
    public products: ProductModel[], //products saved in common service
    public organisations: OrganisationModel[], //organisations saved
    public whatsAppTemplates: messageTemplateModel[], //whatsapp templates saved
    public customerPipelines: Pipelines[], //customer Pipeline
    public salePipelines: Pipelines[], //sale Pipeline
    public servicePipelines: Pipelines[] //service Pipeline
  ) {}
}
// an interface for storing plan access
export interface UserFeatures {
  additionalFieldLimit: number// add'n field limit
  maxPipelineLimit: number // max Pipeline Limit
  gmailIntegration: boolean;
  outlookIntegration: boolean;
  fbIntegration: boolean;
  collectOnlinePaymentsFromCustomers: boolean;
  emailTemplates: boolean; //whether display/create/edit email templates
  multiUser: boolean;
  shareDocuments: boolean;
  shareInvoices: boolean;
  branchEnabled: boolean; //controls display of branch
  /* Added for generalising plans view for each module*/
  //Allows multiple pipeline access
  multiPipelineAccess: boolean;
  //Contact Module - Removes display of all contact related data
  contactAccess: boolean;
  contactPipelineAccess: boolean; //controls display of pipeline
  contactStatusAccess: boolean; //controls display of status

  //Organisation Module - Removes display of all org related data
  orgAccess: boolean;

  //Sales Module - Removes display of all sale related data
  saleAccess: boolean;
  salePipelineAccess: boolean; //controls display of pipeline
  saleStagesAccess: boolean; //controls display of status
  //switch off sale list display in sidebar
  saleListAccess: boolean;
  //switch off sale list display in sidebar
  productwiseSaleAccess: boolean;

  //Service module - Removes display of all service related data
  serviceAccess: boolean;
  servicePipelineAccess: boolean; //controls display of pipeline
  serviceStagesAccess: boolean; //controls display of status
  //Activities - Removes display of all activities related data - turnoff tasks, meetings, and followup
  activitiesAccess: boolean;
  tasksAccess: boolean; //controls access of only tasks module
  calendarIntegration: boolean; //controls access of only meetings module
  followupsAccess: boolean; //controls access of only followups module

  //Dashboard - Removes display of dashboard, list and grid view
  dashboardAccess: boolean;

  //Documents - Removes display of all documents related data - turnoff estimate, quotation, and invoice
  documentsAccess: boolean;
  estimatesAccess: boolean; //controls access of only estimate module
  quotationsAccess: boolean; //controls access of only quotation module
  invoicesAccess: boolean; //controls access of only invoice module

  //Collections - Removes display of payment related data
  collectionsAccess: boolean;

  //Expense - Removes display of expense related data
  expenseAccess: boolean;

  //Products,Services, Category - Removes display of Products,Services and Category
  productsAccess: boolean;
  productsServicesAccess: boolean; //controls access of only products and services module
  categoryAccess: boolean; //controls access of only categories module

  //Upload Files - Removes upload of attachments from all the modules
  uploadFilesAccess: boolean;
  contactFileUploadAccess: boolean; //controls file upload access of only contact module
  orgFileUploadAccess: boolean; //controls file upload access of only org module
  saleFileUploadAccess: boolean; //controls file upload access of only sale module
  serviceFileUploadAccess: boolean; //controls file upload access of only service module
  taskFileUploadAccess: boolean; //controls file upload access of only task module
  expenseFileUploadAccess: boolean; //controls file upload access of only expense module

  //Settings Access - turnoff display of settings icon
  settingsAccess: boolean;

  //Automations Access - removes automation access from settings, if settings turned on
  automation:boolean;

  //Lead capture Access - removes lead capture access from settings, if settings turned on
  leadCaptureAccess: boolean;

  messageTemplates:boolean; //whether disaplay/create/edit sms templates
  duePaymentNotification:boolean;
  waTemplates: boolean; //whether display/create/edit wa templates
  bulkSmsEnabled: boolean; //whether display bulk sms settings/options to send bulk sms
  bulkWaEnabled: boolean; //whether display bulk Whatsapp settings/options to send bulk Whatsapp messages
  bulkEmailEnabled: boolean; //whether display bulk Email settings/options to send bulk Emails
  bulkSmsLimit: number; //daily limit restrictions for sms
  bulkWaLimit: number; //daily limit restrictions for Whatsapp
  bulkEmailLimit: number; //daily limit restrictions for Email

  contactTableViewEnabled: boolean; //check if table view enabled in contact
  contactGridViewEnabled: boolean; //check if grid view enabled in contact
  saleTableViewEnabled: boolean; //check if table view enabled in sale
  saleGridViewEnabled: boolean; //check if grid view enabled in sale
  serviceTableViewEnabled: boolean; //check if table view enabled in support
  serviceGridViewEnabled: boolean; //check if grid view enabled in support

}
// free plan access
export class Free implements UserFeatures {
  constructor(
    public gmailIntegration: boolean = false,
    public outlookIntegration: boolean = false,
    public fbIntegration: boolean = false,
    public collectOnlinePaymentsFromCustomers: boolean = false,
    public emailTemplates: boolean = false,
    public multiUser: boolean = false,
    public shareDocuments: boolean = false,
    public shareInvoices: boolean = false,
    public messageTemplates: boolean = false,
    public duePaymentNotification: boolean = false,
    //To check if branch is enabled
    public branchEnabled: boolean = false,
    /* Added for generalising plans view for each module*/
    public multiPipelineAccess: boolean = false,
    //Contact Module
    public contactAccess: boolean = true,
    public contactPipelineAccess: boolean = true,
    public contactStatusAccess: boolean = true,

    //Organisation Module
    public orgAccess: boolean = true,

    //Sales Module
    public saleAccess: boolean = true,
    public salePipelineAccess: boolean = true, //controls display of pipeline
    public saleStagesAccess: boolean = true, //controls display of status
    public saleListAccess: boolean = true,
    public productwiseSaleAccess: boolean = true,

    //Service module
    public serviceAccess: boolean = true,
    public servicePipelineAccess: boolean = true, //controls display of pipeline
    public serviceStagesAccess: boolean = true, //controls display of status

    //Activities
    public activitiesAccess: boolean = true,
    public tasksAccess: boolean = true,
    public calendarIntegration: boolean = false,
    public followupsAccess: boolean = true,

    //Dashboard
    public dashboardAccess: boolean = true,

    //Documents
    public documentsAccess: boolean = true,
    public estimatesAccess: boolean = true,
    public quotationsAccess: boolean = true,
    public invoicesAccess: boolean = true,
    //Collections
    public collectionsAccess: boolean = true,

    //Expense
    public expenseAccess: boolean = true,

    //Products,Services, Category
    public productsAccess: boolean = true,
    public productsServicesAccess: boolean = true,
    public categoryAccess: boolean = true,

    //Upload Files
    public uploadFilesAccess: boolean = true,
    public contactFileUploadAccess: boolean = true,
    public orgFileUploadAccess: boolean = true,
    public saleFileUploadAccess: boolean = true,
    public serviceFileUploadAccess: boolean = true,
    public taskFileUploadAccess: boolean = true,
    public expenseFileUploadAccess: boolean = true,

    //Settings Access
    public settingsAccess: boolean = true,

    //Automations Access - removes automation access from settings, if settings turned on
    public automation: boolean = false,

    //Lead capture Access
    public leadCaptureAccess: boolean = true,

    public waTemplates: boolean = false,
    public bulkSmsEnabled: boolean = false,
    public bulkWaEnabled: boolean = false,
    public bulkEmailEnabled: boolean = false,
    public bulkSmsLimit: number = 0,
    public bulkWaLimit: number = 0,
    public bulkEmailLimit: number = 0,

    public contactTableViewEnabled: boolean = true, //check if table view enabled in contact
    public contactGridViewEnabled: boolean = true, //check if grid view enabled in contact
    public saleTableViewEnabled: boolean = true, //check if table view enabled in sale
    public saleGridViewEnabled: boolean = true, //check if grid view enabled in sale
    public serviceTableViewEnabled: boolean = true, //check if table view enabled in support
    public serviceGridViewEnabled: boolean = true ,//check if grid view enabled in support

    //additional field limit plan Based
    public additionalFieldLimit:number = 10,
    // maximum pipelines that can be added under a super user
    public maxPipelineLimit: number = 1,
  ) {}
}
// gold plan access
export class Gold implements UserFeatures {
  constructor(
    public gmailIntegration: boolean = false,
    public outlookIntegration: boolean = false,
    public fbIntegration: boolean = false,
    public collectOnlinePaymentsFromCustomers: boolean = false,
    public emailTemplates: boolean = false,
    public multiUser: boolean = true,
    public shareDocuments: boolean = false,
    public shareInvoices: boolean = false,
    public messageTemplates: boolean = false,
    public duePaymentNotification: boolean = false,
    //To check if branch is enabled
    public branchEnabled: boolean = false,
    /* Added for generalising plans view for each module*/
    public multiPipelineAccess: boolean = false,
    //Contact Module
    public contactAccess: boolean = true,
    public contactPipelineAccess: boolean = true,
    public contactStatusAccess: boolean = true,

    //Organisation Module
    public orgAccess: boolean = true,

    //Sales Module
    public saleAccess: boolean = true,
    public salePipelineAccess: boolean = true, //controls display of pipeline
    public saleStagesAccess: boolean = true, //controls display of status
    public saleListAccess:boolean = true,
    public productwiseSaleAccess: boolean = true,

    //Service module
    public serviceAccess: boolean = true,
    public servicePipelineAccess: boolean = true, //controls display of pipeline
    public serviceStagesAccess: boolean = true, //controls display of status

    //Activities
    public activitiesAccess: boolean = true,
    public tasksAccess: boolean = true,
    public calendarIntegration: boolean = false,
    public followupsAccess: boolean = true,

    //Dashboard
    public dashboardAccess: boolean = true,

    //Documents
    public documentsAccess: boolean = true,
    public estimatesAccess: boolean = true,
    public quotationsAccess: boolean = true,
    public invoicesAccess: boolean = true,
    //Collections
    public collectionsAccess: boolean = true,

    //Expense
    public expenseAccess: boolean = true,

    //Products,Services, Category
    public productsAccess: boolean = true,
    public productsServicesAccess: boolean = true,
    public categoryAccess: boolean = true,

    //Upload Files
    public uploadFilesAccess: boolean = true,
    public contactFileUploadAccess: boolean = true,
    public orgFileUploadAccess: boolean = true,
    public saleFileUploadAccess: boolean = true,
    public serviceFileUploadAccess: boolean = true,
    public taskFileUploadAccess: boolean = true,
    public expenseFileUploadAccess: boolean = true,
    //Settings Access
    public settingsAccess: boolean = true,

    //Automations Access - removes automation access from settings, if settings turned on
    public automation: boolean = false,

    //Lead capture Access
    public leadCaptureAccess: boolean = true,
    public waTemplates: boolean = false,
    public bulkSmsEnabled: boolean = false,
    public bulkWaEnabled: boolean = false,
    public bulkEmailEnabled: boolean = false,
    public bulkSmsLimit: number = 0,
    public bulkWaLimit: number = 0,
    public bulkEmailLimit: number = 0,

    public contactTableViewEnabled: boolean = true, //check if table view enabled in contact
    public contactGridViewEnabled: boolean = true, //check if grid view enabled in contact
    public saleTableViewEnabled: boolean = true, //check if table view enabled in sale
    public saleGridViewEnabled: boolean = true, //check if grid view enabled in sale
    public serviceTableViewEnabled: boolean = true, //check if table view enabled in support
    public serviceGridViewEnabled: boolean = true, //check if grid view enabled in support

     //additional field limit ,plan Based
     public additionalFieldLimit:number = 10,
     // maximum pipelines that can be added under a super user
     public maxPipelineLimit: number = 1,
  ) {}
}
// diamond plan access
export class Diamond implements UserFeatures {
  constructor(
    public gmailIntegration: boolean = true,
    public outlookIntegration: boolean = true,
    public fbIntegration: boolean = true,
    public collectOnlinePaymentsFromCustomers: boolean = true,
    public emailTemplates: boolean = true,
    public multiUser: boolean = true,
    public shareDocuments: boolean = true,
    public shareInvoices: boolean = true,
    public messageTemplates: boolean = true,
    public duePaymentNotification: boolean = true,
    //To check if branch is enabled
    public branchEnabled: boolean = true,
    /* Added for generalising plans view for each module*/
    public multiPipelineAccess: boolean = true,
    //Contact Module
    public contactAccess: boolean = true,
    public contactPipelineAccess: boolean = true,
    public contactStatusAccess: boolean = true,
    //Organisation Module
    public orgAccess: boolean = true,

    //Sales Module
    public saleAccess: boolean = true,
    public salePipelineAccess: boolean = true, //controls display of pipeline
    public saleStagesAccess: boolean = true, //controls display of status
    public saleListAccess:boolean = true,
    public productwiseSaleAccess: boolean = true,

    //Service module
    public serviceAccess: boolean = true,
    public servicePipelineAccess: boolean = true, //controls display of pipeline
    public serviceStagesAccess: boolean = true, //controls display of status

    //Activities
    public activitiesAccess: boolean = true,
    public tasksAccess: boolean = true,
    public calendarIntegration: boolean = true,
    public followupsAccess: boolean = true,

    //Dashboard
    public dashboardAccess: boolean = true,

    //Documents
    public documentsAccess: boolean = true,
    public estimatesAccess: boolean = true,
    public quotationsAccess: boolean = true,
    public invoicesAccess: boolean = true,
    //Collections
    public collectionsAccess: boolean = true,

    //Expense
    public expenseAccess: boolean = true,

    //Products,Services, Category
    public productsAccess: boolean = true,
    public productsServicesAccess: boolean = true,
    public categoryAccess: boolean = true,

    //Upload Files
    public uploadFilesAccess: boolean = true,
    public contactFileUploadAccess: boolean = true,
    public orgFileUploadAccess: boolean = true,
    public saleFileUploadAccess: boolean = true,
    public serviceFileUploadAccess: boolean = true,
    public taskFileUploadAccess: boolean = true,
    public expenseFileUploadAccess: boolean = true,
    //Settings Access
    public settingsAccess: boolean = true,

    //Automations Access - removes automation access from settings, if settings turned on
    public automation: boolean = true,

    //Lead capture Access
    public leadCaptureAccess: boolean = true,
    public waTemplates: boolean = true,
    public bulkSmsEnabled: boolean = true,
    public bulkWaEnabled: boolean = true,
    public bulkEmailEnabled: boolean = true,
    public bulkSmsLimit: number = 300,
    public bulkWaLimit: number = 300,
    public bulkEmailLimit: number = 300,

    public contactTableViewEnabled: boolean = true, //check if table view enabled in contact
    public contactGridViewEnabled: boolean = true, //check if grid view enabled in contact
    public saleTableViewEnabled: boolean = true, //check if table view enabled in sale
    public saleGridViewEnabled: boolean = true, //check if grid view enabled in sale
    public serviceTableViewEnabled: boolean = true, //check if table view enabled in support
    public serviceGridViewEnabled: boolean = true, //check if grid view enabled in support

     //additional field limit plan Based
     public additionalFieldLimit:number = 30,
     // maximum pipelines that can be added under a super user
     public maxPipelineLimit: number = 20,
  ) {}
}
// invoicing plan access
export class Invoicing implements UserFeatures {
  constructor(
    public  additionalFieldLimit: number = 10,// add'n field limit
    public gmailIntegration: boolean = true,
    public outlookIntegration: boolean = true,
    public fbIntegration: boolean = false,
    public collectOnlinePaymentsFromCustomers: boolean = false,
    public emailTemplates: boolean = true,
    public multiUser: boolean = false,
    public shareDocuments: boolean = false,
    public shareInvoices: boolean = false,
    public messageTemplates: boolean = true,
    public duePaymentNotification: boolean = false,
    //To check if branch is enabled
    public branchEnabled: boolean = false,
    /* Added for generalising plans view for each module*/
    public multiPipelineAccess: boolean = false,
    //Contact Module
    public contactAccess: boolean = true,
    public contactPipelineAccess: boolean = false,
    public contactStatusAccess: boolean = false,

    //Organisation Module
    public orgAccess: boolean = true,

    //Sales Module
    public saleAccess: boolean = false,
    public salePipelineAccess: boolean = false, //controls display of pipeline
    public saleStagesAccess: boolean = false, //controls display of status
    public saleListAccess:boolean = false,
    public productwiseSaleAccess: boolean = false,

    //Service module
    public serviceAccess: boolean = false,
    public servicePipelineAccess: boolean = true, //controls display of pipeline
    public serviceStagesAccess: boolean = true, //controls display of status

    //Activities
    public activitiesAccess: boolean = false,
    public tasksAccess: boolean = false,
    public calendarIntegration: boolean = false,
    public followupsAccess: boolean = false,

    //Dashboard
    public dashboardAccess: boolean = false,

    //Documents
    public documentsAccess: boolean = true,
    public estimatesAccess: boolean = true,
    public quotationsAccess: boolean = true,
    public invoicesAccess: boolean = true,
    //Collections
    public collectionsAccess: boolean = false,

    //Expense
    public expenseAccess: boolean = false,

    //Products,Services, Category
    public productsAccess: boolean = false,
    public productsServicesAccess: boolean = false,
    public categoryAccess: boolean = false,

    //Upload Files
    public uploadFilesAccess: boolean = false,
    public contactFileUploadAccess: boolean = false,
    public orgFileUploadAccess: boolean = false,
    public saleFileUploadAccess: boolean = false,
    public serviceFileUploadAccess: boolean = false,
    public taskFileUploadAccess: boolean = false,
    public expenseFileUploadAccess: boolean = false,
    //Settings Access
    public settingsAccess: boolean = true,

    //Automations Access - removes automation access from settings, if settings turned on
    public automation: boolean = true,

    //Lead capture Access
    public leadCaptureAccess: boolean = false,
    public waTemplates: boolean = false,
    public bulkSmsEnabled: boolean = false,
    public bulkWaEnabled: boolean = false,
    public bulkEmailEnabled: boolean = false,
    public bulkSmsLimit: number = 0,
    public bulkWaLimit: number = 0,
    public bulkEmailLimit: number = 0,

    public contactTableViewEnabled: boolean = true, //check if table view enabled in contact
    public contactGridViewEnabled: boolean = true, //check if grid view enabled in contact
    public saleTableViewEnabled: boolean = true, //check if table view enabled in sale
    public saleGridViewEnabled: boolean = true, //check if grid view enabled in sale
    public serviceTableViewEnabled: boolean = true, //check if table view enabled in support
    public serviceGridViewEnabled: boolean = true, //check if grid view enabled in support,
    // maximum pipelines that can be added under a super user
    public maxPipelineLimit: number = 1,
  ) {}
}
// lead management plan access
export class LeadManagement implements UserFeatures {
  constructor(
    public gmailIntegration: boolean = true,
    public outlookIntegration: boolean = true,
    public fbIntegration: boolean = false,
    public collectOnlinePaymentsFromCustomers: boolean = false,
    public emailTemplates: boolean = true,
    public multiUser: boolean = true,
    public shareDocuments: boolean = false,
    public shareInvoices: boolean = false,
    public messageTemplates: boolean = true,
    public duePaymentNotification: boolean = false,
    //To check if branch is enabled
    public branchEnabled: boolean = true,
    /* Added for generalising plans view for each module*/
    public multiPipelineAccess: boolean = true,
    //Contact Module
    public contactAccess: boolean = true,
    public contactPipelineAccess: boolean = true,
    public contactStatusAccess: boolean = true,
    //Organisation Module
    public orgAccess: boolean = false,

    //Sales Module
    public saleAccess: boolean = false,
    public salePipelineAccess: boolean = true, //controls display of pipeline
    public saleStagesAccess: boolean = true, //controls display of status
    public saleListAccess:boolean = false,
    public productwiseSaleAccess: boolean = false,

    //Service module
    public serviceAccess: boolean = false,
    public servicePipelineAccess: boolean = true, //controls display of pipeline
    public serviceStagesAccess: boolean = true, //controls display of status

    //Activities
    public activitiesAccess: boolean = true,
    public tasksAccess: boolean = true,
    public calendarIntegration: boolean = true,
    public followupsAccess: boolean = true,

    //Dashboard
    public dashboardAccess: boolean = true,

    //Documents
    public documentsAccess: boolean = false,
    public estimatesAccess: boolean = false,
    public quotationsAccess: boolean = false,
    public invoicesAccess: boolean = false,
    //Collections
    public collectionsAccess: boolean = false,

    //Expense
    public expenseAccess: boolean = false,

    //Products,Services, Category
    public productsAccess: boolean = false,
    public productsServicesAccess: boolean = false,
    public categoryAccess: boolean = false,

    //Upload Files
    public uploadFilesAccess: boolean = false,
    public contactFileUploadAccess: boolean = false,
    public orgFileUploadAccess: boolean = false,
    public saleFileUploadAccess: boolean = false,
    public serviceFileUploadAccess: boolean = false,
    public taskFileUploadAccess: boolean = false,
    public expenseFileUploadAccess: boolean = false,
    //Settings Access
    public settingsAccess: boolean = true,

    //Automations Access - removes automation access from settings, if settings turned on
    public automation: boolean = true,

    //Lead capture Access
    public leadCaptureAccess: boolean = true,
    public waTemplates: boolean = true,
    public bulkSmsEnabled: boolean = true,
    public bulkWaEnabled: boolean = true,
    public bulkEmailEnabled: boolean = true,
    public bulkSmsLimit: number = 100,
    public bulkWaLimit: number = 100,
    public bulkEmailLimit: number = 100,

    public contactTableViewEnabled: boolean = true, //check if table view enabled in contact
    public contactGridViewEnabled: boolean = true, //check if grid view enabled in contact
    public saleTableViewEnabled: boolean = true, //check if table view enabled in sale
    public saleGridViewEnabled: boolean = true, //check if grid view enabled in sale
    public serviceTableViewEnabled: boolean = true, //check if table view enabled in support
    public serviceGridViewEnabled: boolean = true, //check if grid view enabled in support
    //additional field limit plan Based
    public additionalFieldLimit:number = 10,
    // maximum pipelines that can be added under a super user
    public maxPipelineLimit: number = 5,
  ) {}
}
// document creation limit for free user
export enum docCreationLimits {
  Contact_monthly_limit = 10,
  Sales_monthly_limit = 10,
  Est_monthly_limit = 5,
  Quote_monthly_limit = 5,
  Inv_monthly_limit = 2,
}
// class for defining document add limits
export class AddDocumentDisable {
  constructor(
    public addContactDisable: boolean = false,
    public addSaleDisable: boolean = false,
    public addEstimateDisable: boolean = false,
    public addQuotationDisable: boolean = false,
    public addInvoiceDisable: boolean = false,
    public balanceCustomers: number = docCreationLimits.Contact_monthly_limit,
    public balanceSales: number = docCreationLimits.Sales_monthly_limit,
    public balanceInvoices: number = docCreationLimits.Inv_monthly_limit,
    public balanceQuotations: number = docCreationLimits.Quote_monthly_limit,
    public balanceEstimates: number = docCreationLimits.Est_monthly_limit,
    public balanceCustomerFlag: boolean = false,
    public customerOverFlag: boolean = false
  ) {}
}
// enum for user plan
export enum ProductPlans {
  FREE = 'free',
  GOLD = 'gold',
  DIAMOND = 'diamond',
  INVOICING = 'invoicing',
  LEADMANAGEMENT = 'leadManagement'
}
// for getting plan
export abstract class PlanDetails {
  static freeDurationMonths: number = 1; //no of free duration month
  // return the plan by checking if subscription end or not
  static getPlan(userData: Profile): ProductPlans {
    let dateToday = new Date().getTime(); // current date
    let dates = new Date(userData.createdDate); // user signed in date
    let lastFreeDay = dates.setDate(dates.getDate() + 30); // finding last free date
    // if (dateToday >= lastFreeDay) {

      // if free duration ends
      if (userData.plan == ProductPlans.FREE) {
        // if plan is free then return free plan
        return ProductPlans.FREE;
      } else if (userData.plan == ProductPlans.GOLD) {
        // if plan is gold then return the plan by checking if the subscription end or not
        if (userData.paymentHistory[0].paymentMode == 'manual') {
          // for manual subscription
          if (Date.now() / 1000 > userData.paymentHistory[0].currentCycleEnd) {
            // check subscription currentCycleEnd date is over
            return ProductPlans.FREE; // return free if subscription end
          } else {
            // return the current plan if subscription is not end
            return ProductPlans.GOLD;
          }
        } else if (userData.paymentHistory[0].paymentMode == 'subscription') {
          // for  subscription
          if (Date.now() / 1000 > userData.paymentHistory[0].subscriptionEnd) {
            // check subscription en date is over
            return ProductPlans.FREE; // return free if subscription end
          } else {
            // return the current plan if subscription is not end
            return ProductPlans.GOLD;
          }
        } else {
          return ProductPlans.FREE;
        }
      } else if (userData.plan == ProductPlans.DIAMOND) {
        // if plan is diamond then return the plan by checking if the subscription end or not
        if (userData.paymentHistory[0].paymentMode == 'manual') {
          // for manual subscription
          if (Date.now() / 1000 > userData.paymentHistory[0].currentCycleEnd) {
            // check subscription currentCycleEnd date is over
            return ProductPlans.FREE; // return free if subscription end
          } else {
            // return the current plan if subscription is not end
            return ProductPlans.DIAMOND;
          }
        } else if (userData.paymentHistory[0].paymentMode == 'subscription') {
          // for  subscription
          if (Date.now() / 1000 > userData.paymentHistory[0].subscriptionEnd) {
            // check subscription en date is over
            return ProductPlans.FREE; // return free if subscription end
          } else {
            // return the current plan if subscription is not end
            return ProductPlans.DIAMOND;
          }
        } else {
          return ProductPlans.FREE;
        }
      } else if (userData.plan == ProductPlans.INVOICING) {
        // if plan is diamond then return the plan by checking if the subscription end or not
        if (userData.paymentHistory[0].paymentMode == 'manual') {
          // for manual subscription
          if (Date.now() / 1000 > userData.paymentHistory[0].currentCycleEnd) {
            // check subscription currentCycleEnd date is over
            return ProductPlans.FREE; // return free if subscription end
          } else {
            // return the current plan if subscription is not end
            return ProductPlans.INVOICING;
          }
        } else if (userData.paymentHistory[0].paymentMode == 'subscription') {
          // for  subscription
          if (Date.now() / 1000 > userData.paymentHistory[0].subscriptionEnd) {
            // check subscription en date is over
            return ProductPlans.FREE; // return free if subscription end
          } else {
            // return the current plan if subscription is not end
            return ProductPlans.INVOICING;
          }
        } else {
          return ProductPlans.FREE;
        }
      } else if (userData.plan == ProductPlans.LEADMANAGEMENT) {
        // if plan is diamond then return the plan by checking if the subscription end or not
        if (userData.paymentHistory[0].paymentMode == 'manual') {
          // for manual subscription
          if (Date.now() / 1000 > userData.paymentHistory[0].currentCycleEnd) {
            // check subscription currentCycleEnd date is over
            return ProductPlans.FREE; // return free if subscription end
          } else {
            // return the current plan if subscription is not end
            return ProductPlans.LEADMANAGEMENT;
          }
        } else if (userData.paymentHistory[0].paymentMode == 'subscription') {
          // for  subscription
          if (Date.now() / 1000 > userData.paymentHistory[0].subscriptionEnd) {
            // check subscription en date is over
            return ProductPlans.FREE; // return free if subscription end
          } else {
            // return the current plan if subscription is not end
            return ProductPlans.LEADMANAGEMENT;
          }
        } else {
          return ProductPlans.FREE;
        }
      } else {
        // if plan is not free, gold or diamond then return free
        return ProductPlans.FREE;
      }
    // } else {
    //   //if free month not ended, but opted for invoicing, return invoicing plan
    //   if(userData.plan == ProductPlans.INVOICING){
    //     return ProductPlans.INVOICING;
    //   }
    //   //if free month not ended, but opted for lead management plan, return lead management plan
    //   else if(userData.plan == ProductPlans.LEADMANAGEMENT){
    //     return ProductPlans.LEADMANAGEMENT;
    //   } else {
    //   // if free month is not ended return diamond plan
    //   return ProductPlans.DIAMOND;
    //   }
    // }
  }
  // for getting plan wise access
  static getFeaturePrevilage(plan: ProductPlans): UserFeatures {
    switch (plan) {
      case ProductPlans.FREE: {
        // if plan is free return free acess
        return new Free();
      }
      case ProductPlans.GOLD: {
        // if plan is gold return gold acess
        return new Gold();
      }
      case ProductPlans.DIAMOND: {
        // if plan is diamond return diamond acess
        return new Diamond();
      }
      case ProductPlans.INVOICING: {
        // if plan is invoicing return acess for invoicing
        return new Invoicing();
      }
      case ProductPlans.LEADMANAGEMENT: {
        // if plan is leadManagement return acess for LeadManagement
        return new LeadManagement();
      }

      default: {
        // if plan is not free, gold or diamond then return free
        return new Free();
      }
    }
  }
}
