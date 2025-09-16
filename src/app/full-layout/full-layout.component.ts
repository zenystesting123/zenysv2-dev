import { SalesdetailsService } from '../sales-view/salesdetails/salesdetails.service';
/**********************************************************************************
Description: Component holds main router-outlet; payment details,user accesss control features are checked here
             Help section to corresponding router is checked and displayed
             Mobile UI :- only contains the footer
             Web UI :- left side navigation, Right side help, and a top toolbar-row in UI
**********************************************************************************/
import {
  addFieldsArr,
  Branch,
  CalendarEventDetails,
  changeLogModel,
  contactSettings,
  Customer,
  defaultContactSettings,
  EmployeeModel,
  EventDate,
  FollowUps,
  HelpTopicsModel,
  HelpVideoModel,
  Inquiries,
  Notification,
  no_Network_Logout_Time,
  OrganisationModel,
  Profile,
  rejectedCont,
  sideNavExpanded,
  sideNavShrinked,
  Task,
  UserAccessDetails,
  StageHistoryModel,
} from './../data-models';
import {
  StageValues,
  CustomersImport,
} from 'projects/customers/src/app/data-models';
import { Title } from '@angular/platform-browser';
import { ProfileCheckComponent } from './../profilemodule/profile-check/profile-check.component';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavigationEnd, Router } from '@angular/router';
import * as firebase from 'firebase';
import { MatDialog } from '@angular/material/dialog';
import { Addcontactpopup1Component } from '../addcontactpopup1/addcontactpopup1.component';
import {
  FlyfromRt,
  FlyIn,
  FlyInside,
  marginadjust,
  SideCollapse,
  sideNavAnim,
  wait4Rt,
} from './full-layout.component.animation';

import { Addnewsale1Component } from '../addnewsale1/addnewsale1.component';
import { PwaserviceService } from '../pwaserv/pwaservice.service';
import { FullLayoutService } from './full-layout.service';
import { NetworkCheckService } from '../networkcheck.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from '../common.service';
import {
  AddDocumentDisable,
  docCreationLimits,
  PlanDetails,
  ProductPlans,
  UserFeatures,
} from '../model/productfeatures.model';
import {
  MobileslideInAnimation,
  slideInAnimation,
} from '../web-route-animation';
import { ChatroomService } from '../chat/chatroom/chatroom.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FreeUserPopupComponent } from '../free-user-popup/free-user-popup.component';
import { finalize, takeUntil } from 'rxjs/operators';
import { ServicesComponent } from '../services/services.component';
import { saveAs } from 'file-saver';
import { SubUserChatsService } from '../chat/sub-user-chat/sub-user-chats.service';

import { CustomerDetailsService } from '../contact/customer-details/customer-details.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { UploadCustomerLimitPopupComponent } from '../upload-customer-limit-popup/upload-customer-limit-popup.component';
import { AngularFireDatabase } from '@angular/fire/database';
import { CrudServiceComponent } from '../crud-service/crud-service.component';
import { ServiceDetailsService } from '../service-module/service-details/service-details.service';
import { CrudModal1Component } from '../taskboard/crud-modal1/crud-modal1.component';
import { GoogleCalandarEventsDetailsComponent } from '../calendar-events/google-calandar-events-details/google-calandar-events-details.component';
import { ConfirmationpopupComponent } from '../confirmationpopup/confirmationpopup.component';
import { FollowupTaskCreateComponent } from '../followup-task-create/followup-task-create.component';
import { CallViewPopUpComponent } from '../call-view-pop-up/call-view-pop-up.component';
import { CrudFormComponent } from '../organisation/crud-form/crud-form.component';
import { OrganisationDetailsService } from '../organisation/organisation-details/organisation-details.service';
import { CrudModal1Service } from '../taskboard/crud-modal1/crud-modal1.service';
import { Expenses1Service } from '../expenses1/expenses1.service';
import { Pipelines } from '../model/pipeline.modal';

export class CustomerCsvData {
  constructor(
    public count: number,
    public reason: string,
    public firstName: string,
    public secondNName: string,
    public companyName: string,
    public contactNo: string,
    public billingaddress1,
    public billingaddress2,
    public District,
    public State,
    public Country,
    public Pincode,
    public Code,
    public Phone,
    public Email,
    public taxId,
    public createdDate: any,
    public priority: string,
    public status: string,
    public leadSource: string,
    public invoicedAmount: number,
    public totalAmountCollected: number,
    public assignedToName: string
  ) {}
} //for CSV upload
@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss'],
  animations: [
    FlyIn,
    FlyInside,
    SideCollapse,
    sideNavAnim,
    marginadjust,
    slideInAnimation,
    MobileslideInAnimation,
    FlyfromRt,
    wait4Rt,
  ],
})
export class FullLayoutComponent implements OnInit, OnDestroy {
  user: firebase.default.UserInfo; //to hold authentication details
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  counter: number = 0;
  datas: {} = {};
  rejectedCount: number = 0;
  search: boolean = false;
  // toggle button to expand sub menus in expanded sidenavs
  docListView: boolean = false; //for documents
  saleListView: boolean = false; //for sales
  pendingsView: Boolean = false; //for pending actions
  employeesView: boolean = false; //for employees tab
  settingsView: boolean = false; //for settings
  dashboardView = false; //expanded navlist dashboard submenu
  itemsView = false;
  userId: any; //for storing user's id
  // layout checking variables
  isTabletsize: boolean = false;
  isMobilesize: boolean = false;
  additionalFields: any = []; //for storing additional details array
  filteredAdditionalField: any = []; //for storing non disabled additional fields array
  userName: string = ''; //user name to display in avatars
  userNamesplit: string = ''; //to get only first word of username
  dataAccessRule: string = ''; //dataAccessRule of logged in user
  accountType: string = ''; //account type of logged in user
  isSuperUser: Boolean = false; //flag for checking is SuperUser and enabling edit options
  profileVisiblity: Boolean = false; //profile visibilty restriction
  sideNavshrinked: Boolean = true; //if sidenav is shrinked
  sideNavexpanded: Boolean = false; //if sidenav is expanded
  fieldListArray: any = [];
  additionalFieldArray: any = [];
  contentMargin: number = sideNavShrinked.CONTENT_MARGIN; //margin of mat-sideNav-content
  sideNavExp: number = sideNavShrinked.CONTENT_MARGIN; //width of sideNav
  usrProfileData: UserAccessDetails = null; //access control from common service
  userDetails: Profile = null; //user details from common servcie
  superUserDetails: Profile = null; //superuser details from commonservice
  inquiries: Inquiries[]; //holds all inquiries
  badgeNo: number = 0; //badge number showing new inquiries count
  searchTerm: string = ''; //search term
  superUserId: string = ''; //superuserid of logged in user
  downloadUrl: any;
  form: any; //used to store users data in an array
  stageValues: StageHistoryModel = {
    //array defnition to store in stage history
    date: null,
    stageId: null,
    pipelineId: null,
  };
  errorWhileUpload: boolean = false;
  fullAdditionalBoolean: any = []; //to store true or false array corresponding to additinal field array
  fieldsArray: any = []; //to store pushed array value of fields
  fullFieldsArrray: any = []; //to store pushed array value of fields while uploading csv
  stageHistory: any[] = []; //to store stage history array of uploading customers
  dateCreate: any; //to store created date of customers
  subUsers: any[]; //to store subusers list
  statusArray: any[]; //to store customers status array in superuser
  csvData: CustomerCsvData[]; //used to store customer details from csv upload

  // variable restricting view and addition based on user profile
  disableContact: boolean = false; //disable addition of contact
  disableViewContact: boolean = false; //disable view contact
  disableSale: boolean = false; //disable addition of sale
  disableSaleView: boolean = false; //disable sale view
  disableOrg: boolean = false; //disable addition of sale
  disableOrgView: boolean = false; //disable sale view
  disableService: boolean = false; //disable addition of sale
  disableServiceView: boolean = false; //disable sale view
  disableDB: boolean = false; //disable Dashboard view
  disableDocEst: boolean = false; //disable Sales Doc view
  disableDocCreateEst: boolean = false; //disable Sales Doc view
  disableDocQuot: boolean = false; //disable Sales Doc view
  disableDocCreateQuot: boolean = false; //disable Sales Doc view
  disableDocInv: boolean = false; //disable Sales Doc view
  disableDocCreateInv: boolean = false; //disable Sales Doc view
  disableFoll: boolean = false; //disable followups view
  disableSett: boolean = false; //disable settings view
  disableColl: boolean = false; //disble collection view
  disableExp: boolean = false; //disable expense view
  disableItemsview: boolean = false; //disable items view
  disableAttView: boolean = false; //disable upload files view
  checkDataAccessRuleAll: boolean = false; //dataAccessRule = "All" makes this variable true
  fileUploading: boolean = false;
  csvUploading = false;
  // to stop spinner and to make loader false, to confirm all details are fetched, the booleans are used
  isInquiryApiRunning: boolean = false;
  isCustomerMonthWiseApiRunning: boolean = false;
  isSaleMonthWiseApiRunning: boolean = false;
  isInvoiceMonthWiseApiRunning: boolean = false;
  isQuotationMonthWiseApiRunning: boolean = false;
  isEstimateMonthWiseApiRunning: boolean = false;
  isNotificationApiRunning: boolean = false;
  uploadShow: boolean = false;
  csvLine: number; //for storing each line of uploaded csv
  fileReaded: any; //to store whole csv uploaded data
  // variables used in help section
  safeURL: any; //youtube URL src
  defaultHelp: boolean = false; //default contents loading while opening help
  readMore: boolean = false; //readmore
  pageQuerying: string; //variable holds the query to DB, according to current router
  snippetsArray = []; //snippets array
  showAllTopicFlag: boolean = false; //if all snippets are loaded/not
  // if a snippet is selected for detailed view
  contentOfSelectedSnippet: any; //content of selected snippet
  linkofSelectedSnippet: string; //link in the selected snippet content
  titleofSelectedSnippet: string; //title of the selected snippet
  loader: boolean = true;
  snapshot: Observable<any>; //to upload attachment
  uploadProgress$: Observable<number>; //to display upload progress of attachment
  authSubscription: Subscription;
  chatSubscription: Subscription;
  paymentHistorySubscription: Subscription;
  monthlyContactsSubscription: Subscription;
  salesMonthlySubscription: Subscription;
  monthlyInvoiceSubscription: Subscription;
  quoteMonthlySubscription: Subscription;
  estMonthlySubscription: Subscription;
  helpVideoSubscription: Subscription; //help video subscription
  helpTopicsSubscription: Subscription; //helptopics subscription
  commonServcieUserSubscription: Subscription; //commonservice subscription
  isLoaded: boolean = false; //wait until all subscriptions are loaded
  unreadChatCount: Number = 0; //unread chat count
  endDate = new Date(); //end Date to fetch month wise data
  dataArray: CustomersImport = {
    orgId: null,
    surname: null,
    assignedTo: null,
    assignedToName: null,
    associatedBranch: null,
    billingaddress1: null,
    billingaddress2: null,
    bpin: null,
    code: null,
    custLeadValue: null,
    companyName: null,
    collectedAmount: null,
    contactNo: null,
    country: null,
    dateCreated: null,
    district: null,
    email: null,
    firstName: null,
    followUpFlag: null,
    taxId: null,
    pan: null,
    priority: null,
    salutation: null,
    secondName: null,
    state: null,
    status: null,
    unConfirmedSales: null,
    amountToBeCollected: null,
    taskOpen: null,
    sequenceNumber: null,
    lifeTimeValue: null,
    totalAmountCollected: null,
    invoicedAmount: null,
    isCompany: null,
    additionalFieldsArr: null,
    searchTerm: {
      companyName: '',
      firstName: '',
      secondName: '',
      surname: '',
    },
    selectedContactPipeline: 0,
    altContactCode: null,
    alternateContactNumber: '',
    department: '',
    createdBy: '',
    inPipeline: false,
    won: false,
    lost: false,
  };
  addDocumentDisable: AddDocumentDisable = {
    addContactDisable: false,
    addSaleDisable: false,
    addEstimateDisable: false,
    addQuotationDisable: false,
    addInvoiceDisable: false,
    balanceCustomerFlag: false,
    balanceCustomers: docCreationLimits.Contact_monthly_limit,
    customerOverFlag: false,
    balanceSales: docCreationLimits.Sales_monthly_limit,
    balanceInvoices: docCreationLimits.Inv_monthly_limit,
    balanceQuotations: docCreationLimits.Quote_monthly_limit,
    balanceEstimates: docCreationLimits.Est_monthly_limit,
  }; //to check if document addition has to disable
  userPlan: UserFeatures;

  // customisable field names
  fieldNameItemsCategory = 'Category';
  fieldNameContact: string = 'Contact';
  fieldNameSale: string = 'Sale';
  fieldNameService: string = 'Support';
  fieldNameFollowup: string = 'FollowUp';
  fieldNameTask: string = 'Task';
  fieldNameMeeting: string = 'Meeting';
  fieldNameEstimate: string = 'Estimate';
  fieldNameQuotation: string = 'Quotation';
  fieldNameInvoice: string = 'Invoice';
  fieldNameCollection: string = 'Collection';
  fieldNameExpense: string = 'Expense';
  fieldNameItems: string = 'Products and Service';
  fieldNameOrganization: string = 'Organization';
  expiryFlag: boolean; //check active subscription end date and check if expired/not
  createDate: any; //superusers created date
  networkConnection: boolean; //network check
  subcycleend: any; //for subscription plan, check if current cycle end/not
  plan: string; //plan of logged in user
  paidFlag: boolean = false; //check active subscription end date and check if paid/not
  lastFreeDay: any; //fetch plan and find thae last free day
  balanceDaysFlag: boolean = false; //check active subscription end date and check if balancedays are left/not
  activeSubscriptionDateEnd: any; //subscription end date under payment history of superuser
  subscriptioncyclepaymentflag: boolean = true; //if subscription is pending/halted or active
  planFetch: string; //super user plan details
  isEmployee = false;
  userFirstName: any; //to store first name of the user
  userSecondName: any; //to store second name of the user
  sideNavShow: string = 'help';
  unreadChatCount2: number;
  subChatSubscription: Subscription;
  attmgmtEnabled = false;
  eachLines: any = [];
  searchSelected = 'Name';
  panelOpenState = false;
  customerSeq: number = 0;
  basePath = '';
  // invitation: InvitationModel = null;
  attendanceData;
  currentlogintime = new Date().getTime();
  logoutToBeRecorded = false;
  autoLogouts = 0;
  subUserId = '';
  logoutLoader = false;
  userLastName: string;
  ivrIntegrationEnable: boolean = false;
  disableCreateFollowUp: boolean = false; // for disable followup view
  pipelineNameArray: Array<string> = [];
  wonArray: Array<string> = [];
  lostArray: Array<string> = [];
  inPipelineArray: Array<string> = [];
  CSVHead = [];
  allCustArray: Customer[] = [];
  duplicateEmailArray: Array<string> = [];
  duplicateContNoArray: Array<string> = [];
  duplicateAltContNoArray: Array<string> = [];
  emailPresent = false; //duplicate email chevk
  contactNoPresent = false; //duplicate cont number check
  altContNoPresent = false; //alternate cont number duplicate check
  // isCustomerIndividual: boolean = false;
  taskAssigned = null;
  followUpAssigned = null;
  contAssigned = null;
  saleAssigned = null;
  serviceAssigned = null;
  navSelected: string = 'Home';
  organSelected = false;
  contSelected = false;
  saleSelected = false;
  supportSelected = false;
  actSelected = false;
  dashSelected = false;
  documSelected = false;
  expSelected = false;
  itemsSelected = false;
  fileSelected = false;
  employeeSelected = false;
  empSelected = false;
  clickAgain = false;
  branches: Branch[] = [];
  orgSelected: OrganisationModel = null;
  totalRec: number = 0; //totla CSV records uploading
  totalRecExceeded = false; //to display warning message if CSV of more than 2000 contacts is uploading
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  popUpOpen: boolean = false;
  sizeUpdated = 0; //for file upload error handling: totalattachment size - files size

  //Data object for listing recent items
  notificationData_recent: any[] = [];
  notificationData_recent_new: any[] = [];
  notificationData_recent_old: any[] = [];

  //Save first document in snapshot of items received
  firstInResponse_recent: any = [];

  //Save last document in snapshot of items received
  lastInResponse_recent: any = [];

  //Keep the array of first document of previous pages
  prev_strt_at_recent: any = [];

  //Maintain the count of clicks on Next Prev button
  pagination_clicked_count_recent = 0;

  //Disable next and prev buttons
  disable_next_recent: boolean = false;
  disable_prev_recent: boolean = false;

  //Data object for listing unread items
  notificationData_unRead: any[] = [];
  notificationData_unRead_new: any[] = [];
  notificationData_unRead_old: any[] = [];

  //Save first document in snapshot of items received
  firstInResponse_unRead: any = [];

  //Save last document in snapshot of items received
  lastInResponse_unRead: any = [];

  //Keep the array of first document of previous pages
  prev_strt_at_unRead: any = [];

  //Maintain the count of clicks on Next Prev button
  pagination_clicked_count_unRead = 0;

  //Disable next and prev buttons
  disable_next_unRead: boolean = false;
  disable_prev_unRead: boolean = false;

  selectedNotifn = 'recent'; //selected notification
  today = new Date().setHours(0, 0, 0, 0); //to divide notifications as new and earlier
  unreadLength = 0; //to show count at mat badge

  // notification subscriptions
  loadSubscription: Subscription;
  nextSubscription: Subscription;
  unreadLoadSubscription: Subscription;
  unreadNextSubscription: Subscription;

  enableLiteMode: boolean = false; //enable lite mode
  customerPipelines: Pipelines[] = []; //customer pipelines
  showLiteModeBtn = false; // to show/hide enable litemode toggle button

  constructor(
    public el: ElementRef,
    public chatRoom: ChatroomService,
    public commonService: CommonService,
    public fulllayoutservice: FullLayoutService,
    public Pwa: PwaserviceService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private _snackBar: MatSnackBar,
    private storage: AngularFireStorage,
    public dialog: MatDialog,
    public networkCheck: NetworkCheckService,
    private ref: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    public uploadAttachmentSizeCust: CustomerDetailsService,
    public uploadAttachmentSizeSale: SalesdetailsService,
    public servicedetailsService: ServiceDetailsService,
    public orgDetailsService: OrganisationDetailsService,
    public uploadAttachmentSizeTask: CrudModal1Service,
    public expenseService: Expenses1Service,
    private titleService: Title,
    private subChats: SubUserChatsService,
    private db: AngularFireDatabase,
    private customerDetailService: CustomerDetailsService
  ) {
    this.titleService.setTitle('Zenys Application'); // set the title
    let dateToday = new Date().getTime();
    let startDate = new EventDate(null, null); // setting start date
    let endDate = new EventDate(null, null); // setting end date

    //Step 1: Read the user details and super user details

    this.commonServcieUserSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          if (
            !!allData.userDetails &&
            allData.userDetails !== null &&
            typeof allData.userDetails !== 'undefined'
          ) {
            if (allData.userDetails.accessLockAutologout === true) {
              this.router.navigate(['/user-login-locked']);
            } else {
              if(allData.superUserDetails) {
                this.isMobilesize = allData.isMobileSize; //checck for mobile layout
                this.isTabletsize = allData.isTabetSize; //check for tablet layout
                this.user = allData.authDetails; //fetch auth details
                this.userId = allData.userId;
                this.superUserId = allData.userDetails.superUserId;
                this.customerPipelines = JSON.parse(JSON.stringify(allData.customerPipelines));
                if(this.commonService.userPlan.multiPipelineAccess){
                  // do nothing
                }else{
                  this.customerPipelines.length = 1;
                }
                this.userDetails = allData.userDetails; //userdeytails is assigned to local variable
                if (allData.userDetails.enableLiteMode) {
                  this.enableLiteMode = allData.userDetails.enableLiteMode;
                }
                if(allData.superUserDetails.createdDate <= 1704047399000){
                  this.showLiteModeBtn = true;
                }else{
                  this.showLiteModeBtn = false;
                }
                this.branches = allData.branches;
                // presence logic starts here
                this.presenceLogic(allData.userDetails.email);
                // presence logic ends here
                if (allData.superUserDetails.ivrIntegrationEnable) {
                  this.ivrIntegrationEnable =
                    allData.superUserDetails.ivrIntegrationEnable;
                }
                this.userSecondName = allData.superUserDetails.lastname;
                this.userFirstName = allData.superUserDetails.firstname;
                // if (allData.superUserDetails.isCustomerIndividual) {
                //   this.isCustomerIndividual =
                //     allData.superUserDetails.isCustomerIndividual;
                //   this.searchSelected = 'Name';
                // }

                if (allData.superUserDetails.contactSequentialNumber) {
                  this.customerSeq =
                    allData.superUserDetails.contactSequentialNumber;
                } else {
                  this.fulllayoutservice
                    .getCustomer(this.superUserId)
                    .pipe(takeUntil(this.onDestroy$))
                    .subscribe((data) => {
                      let customersList = data.map((e) => {
                        return {
                          id: e.payload.doc.id,
                          ...(e.payload.doc.data() as {}),
                        } as Customer;
                      });
                      this.customerSeq = customersList?.length;
                    });
                }

                if (allData.superUserDetails.ivrIntegrationEnable) {
                  this.getCallPopUp(this.superUserId, this.userId);
                }

                this.form = allData.superUserDetails;
                this.additionalFields =
                  allData.superUserDetails.customFieldsContact;
                this.userName = allData.userDetails?.firstname; //to show in ngx-avatar, firstname is taking as username
                this.userLastName = allData.userDetails?.lastname;
                this.userNamesplit = this.userName?.split(' ')[0]; //ngx-avataar is limiting to only one character
                this.accountType = allData.userDetails?.accountType; //read the user profile assigned
                this.filteredAdditionalField = [];
                this.fullAdditionalBoolean = [];
                //setting a true or false array based on active fields in additional fields array
                for (let i = 0; i < this.additionalFields?.length; i++) {
                  if (this.additionalFields[i].isActive) {
                    this.fullAdditionalBoolean.push(true);
                  } else {
                    this.fullAdditionalBoolean.push(false);
                  }
                }
                //storing all active fields in additional fields in a new array
                for (let i = 0; i < this.additionalFields?.length; i++) {
                  if (this.additionalFields[i].isActive) {
                    this.filteredAdditionalField.push(this.additionalFields[i]);
                  }
                }
                this.fieldListArray =
                  allData.superUserDetails?.customFieldsContact;
                for (let i = 0; i < this.fieldListArray?.length; i++) {
                  if (this.fieldListArray[i].isActive) {
                    this.additionalFieldArray.push(
                      this.fieldListArray[i].fieldName
                    );
                  } else {
                    this.additionalFieldArray.push(null);
                  }
                }

                this.wonArray = [];
                this.lostArray = [];
                this.inPipelineArray = [];

                if(!!this.customerPipelines){
                  if(this.customerPipelines.length>0){
                    for (let i = 0; i < this.customerPipelines.length; i++) {
                      for (let j = 0; j < this.customerPipelines[i].pipelineStages.length; j++) {
                        if(j == this.customerPipelines[i].pipelineStages.length-2){
                          this.wonArray.push(this.customerPipelines[i].pipelineStages[j].stageId);
                        }else if(j == this.customerPipelines[i].pipelineStages.length-1){
                          this.lostArray.push(this.customerPipelines[i].pipelineStages[j].stageId);
                        }else{
                          this.inPipelineArray.push(this.customerPipelines[i].pipelineStages[j].stageId);
                        }
                      }
                    }
                  }
                }



                // assigning profile visibility according to user's accounttype
                this.dateCreate = new Date().getTime();
                // superuser and admin - considered as superuser, all other profiles are considered as subusers
                if (this.accountType == 'SuperUser') {
                  this.isSuperUser = true;
                  this.profileVisiblity = true;
                } else {
                  this.isSuperUser = false;
                  this.profileVisiblity = false;
                }

                this.fulllayoutservice
                  .getEmployeeDetails(this.userDetails.email)
                  .pipe(takeUntil(this.onDestroy$))
                  .subscribe((data) => {
                    let eData = data.map((e) => {
                      return {
                        id: e.payload.doc.id,
                        ...(e.payload.doc.data() as {}),
                      } as EmployeeModel;
                    });
                    if (eData) {
                      let employeeDetails = eData[0];

                      if (typeof employeeDetails != 'undefined') {
                        this.isEmployee = true;
                      }
                    }
                  });

                // Step 2: Read the plan package definition based on the plan assigned to the super user
                // fetching superuserdetails
                if (allData.userDetails.superUserId) {
                  this.superUserId = allData.userDetails.superUserId; //assign super user id

                  let superuserData = allData.superUserDetails;

                  if (superuserData) {
                    this.superUserDetails = superuserData; //superuserdata is assigning to local variable


                    if (this.superUserDetails.attmgmtEnabled == true) {
                      this.attmgmtEnabled = true;
                    }

                    // customisable field names assigning
                    if (this.superUserDetails.fieldNames) {
                      this.fieldNameContact =
                        this.superUserDetails.fieldNames.fieldNameContact;
                      this.fieldNameSale =
                        this.superUserDetails.fieldNames.fieldNameSale;
                      this.fieldNameTask =
                        this.superUserDetails.fieldNames.fieldNameTask;
                      this.fieldNameMeeting =
                        this.superUserDetails.fieldNames.fieldNameMeeting;
                      this.fieldNameFollowup =
                        this.superUserDetails.fieldNames.fieldNameFollowup;
                      this.fieldNameEstimate =
                        this.superUserDetails.fieldNames.fieldNameEstimate;
                      this.fieldNameQuotation =
                        this.superUserDetails.fieldNames.fieldNameQuotation;
                      this.fieldNameInvoice =
                        this.superUserDetails.fieldNames.fieldNameInvoice;
                      this.fieldNameCollection =
                        this.superUserDetails.fieldNames.fieldNameCollection;
                      this.fieldNameExpense =
                        this.superUserDetails.fieldNames.fieldNameExpense;
                      this.fieldNameItems =
                        this.superUserDetails.fieldNames.fieldNameItems;
                      if (
                        this.superUserDetails?.fieldNames?.fieldNameOrganization
                      ) {
                        this.fieldNameOrganization =
                          this.superUserDetails.fieldNames.fieldNameOrganization;
                      }
                    }
                    if (this.superUserDetails?.fieldNames?.fieldNameService) {
                      this.fieldNameService =
                        this.superUserDetails.fieldNames.fieldNameService;
                    }
                    // if(this.superUserDetails?.fieldNames?.fieldNameItemsCategory){
                    //   this.fieldNameItemsCategory = this.superUserDetails?.fieldNames?.fieldNameItemsCategory
                    // }
                    if (
                      allData.superUserDetails?.productSettings?.category
                        ?.displayName
                    ) {
                      this.fieldNameItemsCategory =
                        allData.superUserDetails.productSettings.category.displayName;
                    }
                    if (allData.subUsers) {
                      this.subUsers = allData.subUsers;
                      for (let i = 0; i < allData.subUsers.length; i++) {
                        if (allData.subUsers[i].userId === this.userId) {
                          this.subUserId = allData.subUsers[i].id;
                        }
                      }
                    }

                    if (superuserData?.plan != ProductPlans.FREE) {
                      this.paidFlag = true;

                      var currentplanindex = 0;

                      for (
                        let i = 0;
                        i < superuserData?.paymentHistory.length;
                        i++
                      ) {
                        if (
                          superuserData?.paymentHistory[i].paymentMode ==
                          'subscription'
                        ) {
                          if (
                            superuserData?.paymentHistory[i].subscriptionStart <
                              Date.now() / 1000 &&
                            superuserData?.paymentHistory[i].subscriptionEnd >
                              Date.now() / 1000
                          ) {
                            currentplanindex = i;
                            break;
                          }
                        } else if (
                          superuserData?.paymentHistory[i].paymentMode ==
                          'manual'
                        ) {
                          if (
                            superuserData?.paymentHistory[i]
                              .currentCycleStartDate <
                              Date.now() / 1000 &&
                            superuserData?.paymentHistory[i].currentCycleEnd >
                              Date.now() / 1000
                          ) {
                            currentplanindex = i;

                            break;
                          }
                        }
                      }

                      if (
                        superuserData?.paymentHistory[currentplanindex].plan !=
                        superuserData.plan
                      ) {
                        if (
                          superuserData?.paymentHistory[currentplanindex]
                            .plan == undefined
                        ) {
                        } else {
                          // write plan
                          this.fulllayoutservice.updatePlan(
                            this.superUserId,
                            superuserData?.paymentHistory[currentplanindex].plan
                          );
                        }
                      }
                      // }
                      if (
                        superuserData?.paymentHistory[0].paymentMode ==
                        'subscription'
                      ) {
                        this.activeSubscriptionDateEnd =
                          superuserData?.paymentHistory[0].subscriptionEnd;
                        this.subcycleend =
                          superuserData?.paymentHistory[0].currentCycleEnd;
                        if (this.subcycleend < Date.now() / 1000) {
                          //  this
                          this.paymentHistorySubscription =
                            this.fulllayoutservice
                              .getsubscription(
                                superuserData?.paymentHistory[0].subscription_id
                              )
                              .subscribe((data: any) => {
                                if (
                                  data.status == 'pending' ||
                                  data.status == 'halted'
                                ) {
                                  this.subscriptioncyclepaymentflag = false;
                                }
                                if (data.status == 'active') {
                                  var paymentupdate = {
                                    charge_at: data.charge_at,
                                    currentCycleEnd: data.current_end,
                                    currentCycleStartDate: data.current_start,
                                    packageDuration:
                                      superuserData?.paymentHistory[0]
                                        .packageDuration,
                                    paymentMode: 'subscription',
                                    subscriptionEnd:
                                      superuserData?.paymentHistory[0]
                                        .subscriptionEnd,
                                    subscriptionStart:
                                      superuserData?.paymentHistory[0]
                                        .subscriptionStart,
                                    subscription_id:
                                      superuserData?.paymentHistory[0]
                                        .subscription_id,
                                  };
                                  var paymentHistory =
                                    superuserData?.paymentHistory;
                                  paymentHistory[0] = paymentupdate;

                                  this.fulllayoutservice.updatePaymentHistory(
                                    this.superUserId,
                                    paymentHistory
                                  );
                                }
                              });
                        }
                        if (
                          this.activeSubscriptionDateEnd <
                          Date.now() / 1000
                        ) {
                          (this.paidFlag = false), (this.expiryFlag = true);
                        }
                        if (
                          this.activeSubscriptionDateEnd >
                          Date.now() / 1000
                        ) {
                          this.paidFlag = true;
                          this.expiryFlag = false;
                          if (
                            this.activeSubscriptionDateEnd - Date.now() / 1000 <
                            604800
                          )
                            this.balanceDaysFlag = true;
                        }
                      }
                      if (
                        superuserData?.paymentHistory[0].paymentMode == 'manual'
                      ) {
                        this.activeSubscriptionDateEnd =
                          superuserData?.paymentHistory[0].currentCycleEnd;
                        if (
                          superuserData?.paymentHistory[0].currentCycleEnd <
                          Date.now() / 1000
                        ) {
                          this.paidFlag = false;
                          this.expiryFlag = true;
                        }
                        if (
                          superuserData?.paymentHistory[0].currentCycleEnd >
                          Date.now() / 1000
                        ) {
                          this.paidFlag = true;
                          this.expiryFlag = false;
                          if (
                            this.activeSubscriptionDateEnd - Date.now() / 1000 <
                            604800
                          )
                            this.balanceDaysFlag = true;
                        }
                      }
                    }

                    this.plan = superuserData?.plan; // If super user, then get the plan directly else
                    this.createDate = superuserData?.createdDate;
                    //getting the userplan based features
                    this.userPlan = this.commonService.userPlan;
                    this.planFetch = PlanDetails.getPlan(superuserData);
                    if (this.planFetch == ProductPlans.FREE) {
                      let date = new Date();
                      let dates = new Date(this.createDate);
                      this.lastFreeDay = dates.setDate(dates.getDate() + 30);
                      let firstDay = new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        1
                      ).getTime();
                      let lastDate = new Date(
                        date.getFullYear(),
                        date.getMonth() + 1,
                        0
                      );
                      lastDate.setHours(23);
                      lastDate.setMinutes(59);
                      lastDate.setSeconds(59);
                      lastDate.setMilliseconds(999);
                      let lastDay = new Date(lastDate).getTime();

                      if (dateToday >= this.lastFreeDay) {
                        this.currentMonthWiseCustomersFromApi(
                          firstDay,
                          lastDay
                        );
                        this.currentMonthWiseSalesFromApi(firstDay, lastDay);
                        this.currentMonthWiseInvoiceFromApi(firstDay, lastDay);
                        this.currentMonthWiseEstimateFromApi(firstDay, lastDay);
                        this.currentMonthWiseQuotationFromApi(
                          firstDay,
                          lastDay
                        );
                      }
                    }
                  }
                }
                // this.loadItems_recent();
                // this.loadItemsUnRead();
                this.fulllayoutservice
                  .loadItemsUnreadBadge(this.user.uid)
                  .subscribe((resp) => {
                    if (!resp.length) {
                      this.unreadLength = 0;
                    } else {
                      this.unreadLength = resp.length;
                    }
                  });
                // if (this.notificationselected == 'recent') {
                //   this.getRecentNotificationFromApi();
                // }
                // this.getAllUnreadNotificationFromApi('recent');

                // Step 3: For current logged in user, identify the profile assigned and read the configuration for the profile from superuser
                this.usrProfileData = allData.usrProfileData;
                if (this.usrProfileData) {
                  this.dataAccessRule =
                    this.usrProfileData.dialogdataAccessRule;

                  // check dataAccessRule
                  if (this.usrProfileData.dialogdataAccessRule == 'All') {
                    this.checkDataAccessRuleAll = true;
                    this.getInqiryListFromApi();
                  } else if (
                    this.usrProfileData.dialogdataAccessRule != 'All'
                  ) {
                    this.checkDataAccessRuleAll = false;
                    this.getInqiryListFromApi();
                  }
                  // disable add contact and contact list view
                  if (this.usrProfileData.isCheckedCont == false) {
                    this.disableContact = true;
                    this.addDocumentDisable.addContactDisable = true;
                    this.disableViewContact = true;
                  } else {
                    if (this.usrProfileData.contactsCreate == false) {
                      this.disableContact = true;
                      this.addDocumentDisable.addContactDisable = true;
                    }
                    if (this.usrProfileData.contactsView == false) {
                      this.disableViewContact = true;
                    }
                  }
                  // disable Sale create and view
                  if (this.usrProfileData.isCheckedSale == false) {
                    this.disableSale = true;
                    this.addDocumentDisable.addSaleDisable = true;
                    this.disableSaleView = true;
                  } else {
                    if (this.usrProfileData.salesCreate == false) {
                      this.disableSale = true;
                      this.addDocumentDisable.addSaleDisable = true;
                    }
                    if (this.usrProfileData.salesView == false) {
                      this.disableSaleView = true;
                    }
                  }
                  // org starts
                  // disable Sale create and view
                  if (this.usrProfileData.isCheckedOrg == false) {
                    this.disableOrg = true;
                    this.disableOrgView = true;
                  } else {
                    if (this.usrProfileData.orgsCreate == false) {
                      this.disableOrg = true;
                    }
                    if (this.usrProfileData.orgsView == false) {
                      this.disableOrgView = true;
                    }
                  }
                  // org ends
                  // disable service create and view
                  if (this.usrProfileData.isCheckedService == false) {
                    this.disableService = true;
                    this.disableServiceView = true;
                  } else {
                    if (this.usrProfileData.servicesCreate == false) {
                      this.disableService = true;
                    }
                    if (this.usrProfileData.servicesView == false) {
                      this.disableServiceView = true;
                    }
                  }
                  // disable Dashboard view
                  if (this.usrProfileData.isCheckedDashB == false) {
                    this.disableDB = true;
                  } else if (this.usrProfileData.DBView == false) {
                    this.disableDB = true;
                  }
                  // disable documents
                  if (this.usrProfileData.isCheckedSalesEst == false) {
                    this.disableDocEst = true;
                    this.disableDocCreateEst = true;
                  } else {
                    if (this.usrProfileData.salesDViewEst == false) {
                      this.disableDocEst = true;
                    }
                    if (this.usrProfileData.salesDCreateEst == false) {
                      this.disableDocCreateEst = true;
                    }
                  }
                  if (this.usrProfileData.isCheckedSalesQuot == false) {
                    this.disableDocQuot = true;
                    this.disableDocCreateQuot = true;
                  } else {
                    if (this.usrProfileData.salesDViewQuot == false) {
                      this.disableDocQuot = true;
                    }
                    if (this.usrProfileData.salesDCreateQuot == false) {
                      this.disableDocCreateQuot = true;
                    }
                  }
                  if (this.usrProfileData.isCheckedSalesInv == false) {
                    this.disableDocInv = true;
                    this.disableDocCreateInv = true;
                  } else {
                    if (this.usrProfileData.salesDViewInv == false) {
                      this.disableDocInv = true;
                    }
                    if (this.usrProfileData.salesDCreateInv == false) {
                      this.disableDocCreateInv = true;
                    }
                  }
                  // disable followups
                  if (this.usrProfileData.isCheckedFoll == false) {
                    this.disableFoll = true;
                  } else if (this.usrProfileData.follView == false) {
                    this.disableFoll = true;
                  }
                  // disable settings
                  if (this.usrProfileData.isCheckedSett == false) {
                    this.disableSett = true;
                  } else if (this.usrProfileData.settView == false) {
                    this.disableSett = true;
                  }
                  // disable collection
                  if (this.usrProfileData.isCheckedColl == false) {
                    this.disableColl = true;
                  } else if (this.usrProfileData.collectionsView == false) {
                    this.disableColl = true;
                  }
                  // disable expenses
                  if (this.usrProfileData.isCheckedExp == false) {
                    this.disableExp = true;
                  } else if (this.usrProfileData.expView == false) {
                    this.disableExp = true;
                  }
                  // disable items
                  if (this.usrProfileData.isCheckedItems == false) {
                    this.disableItemsview = true;
                  } else if (this.usrProfileData.itemsView == false) {
                    this.disableItemsview = true;
                  }
                  // disable attachments
                  if (allData.usrProfileData.isCheckedAtt == false) {
                    this.disableAttView = true;
                  } else if (allData.usrProfileData.attView == false) {
                    this.disableAttView = true;
                  }
                  if (this.usrProfileData.isCheckedFoll == false) {
                    this.disableCreateFollowUp = true; // disable create followup
                  } else if (this.usrProfileData.follCreate == false) {
                    this.disableCreateFollowUp = true;
                  }
                }
              }
            }
          } else {
            // if userDetails is null, logout after showing message of network issues/redirect to createProfile
            setTimeout(() => {
              this.dialog.open(ConfirmationpopupComponent, {
                width: '400px',
                data: {
                  smode: 'networkIssue',
                },
              });
            }, no_Network_Logout_Time);
          }
          this.loader = false;
        } else {
          this.commonService.userDetails.next(null);
          this.logout();
        }
      }
    );

    this.commonService.callLogOut
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.logout();
      });

    this.authSubscription = this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.chatSubscription = this.chatRoom
          .getunreadNumber(user.uid)
          .subscribe((data) => {
            this.unreadChatCount = data.length;
          });
        this.subChatSubscription = this.subChats
          .getunreadNumber(user.uid)
          .subscribe((data) => {
            this.unreadChatCount2 = data.length;
          });
      } else {
        this.commonService.userDetails.next(null);
        this.logout();
      }
    });
  } //Constructor end

  ngOnInit(): void {}

  // Recent chip under notification clicked fn
  recentNot() {
    this.selectedNotifn = 'recent';
  }
  // Unread chip under Notification clicked
  unreadNot() {
    this.selectedNotifn = 'unread';
  }
  // Load Recent notifications first time
  loadItems_recent() {
    this.isNotificationApiRunning = true;
    this.unreadLoadSubscription?.unsubscribe();
    this.unreadNextSubscription?.unsubscribe();
    this.loadSubscription = this.fulllayoutservice
      .loadNotifRecent(this.user.uid)
      .subscribe(
        (response) => {
          if (!response.length) {
            this.isNotificationApiRunning = false;
            this.updateValueToUi();
            return false;
          }
          this.firstInResponse_recent = response[0].payload.doc;
          this.lastInResponse_recent =
            response[response.length - 1].payload.doc;

          this.notificationData_recent = [];
          for (let item of response) {
            this.notificationData_recent.push(
              Object.assign(item.payload.doc.data(), {
                id: item.payload.doc.id,
              })
            );
          }
          this.notificationData_recent_new =
            this.notificationData_recent.filter(
              (t) => new Date(t.createdDate).setHours(0, 0, 0, 0) === this.today
            );
          this.notificationData_recent_old =
            this.notificationData_recent.filter(
              (t) => new Date(t.createdDate).setHours(0, 0, 0, 0) !== this.today
            );
          //Initialize values
          this.prev_strt_at_recent = [];
          this.pagination_clicked_count_recent = 0;
          this.disable_next_recent = false;
          this.disable_prev_recent = false;

          //Push first item to use for Previous action
          this.push_prev_startAt_recent(this.firstInResponse_recent);
          this.isNotificationApiRunning = false;
          this.updateValueToUi();
        },
        (error) => {}
      );
  }
  //Show previous set
  prevPage_recent() {
    if (this.pagination_clicked_count_recent === 1) {
      this.loadItems_recent();
    } else {
      this.disable_prev_recent = true;
      this.fulllayoutservice
        .prevPageRecent(
          this.user.uid,
          this.firstInResponse_recent,
          this.prev_strt_at_recent,
          this.pagination_clicked_count_recent
        )
        .subscribe(
          (response) => {
            this.firstInResponse_recent = response.docs[0];
            this.lastInResponse_recent =
              response.docs[response.docs.length - 1];

            this.notificationData_recent = [];
            for (let item of response.docs) {
              this.notificationData_recent.push(
                Object.assign(item.data(), { id: item.id })
              );
            }
            this.notificationData_recent_new =
              this.notificationData_recent.filter(
                (t) =>
                  new Date(t.createdDate).setHours(0, 0, 0, 0) === this.today
              );
            this.notificationData_recent_old =
              this.notificationData_recent.filter(
                (t) =>
                  new Date(t.createdDate).setHours(0, 0, 0, 0) !== this.today
              );

            //Maintaing page no.
            this.pagination_clicked_count_recent--;

            //Pop not required value in array
            this.pop_prev_startAt_recent(this.firstInResponse_recent);

            //Enable buttons again
            this.disable_prev_recent = false;
            this.disable_next_recent = false;
          },
          (error) => {
            this.disable_prev_recent = false;
          }
        );
    }
  }
  // Show next set
  nextPage_recent() {
    this.disable_next_recent = true;
    this.loadSubscription?.unsubscribe();
    this.nextSubscription = this.fulllayoutservice
      .nextpageRecent(this.user.uid, this.lastInResponse_recent)
      .subscribe(
        (response) => {
          if (!response.docs.length) {
            this.disable_next_recent = true;
            return;
          }

          this.firstInResponse_recent = response.docs[0];

          this.lastInResponse_recent = response.docs[response.docs.length - 1];
          this.notificationData_recent = [];
          for (let item of response.docs) {
            this.notificationData_recent.push(
              Object.assign(item.data(), { id: item.id })
            );
          }
          this.notificationData_recent_new =
            this.notificationData_recent.filter(
              (t) => new Date(t.createdDate).setHours(0, 0, 0, 0) === this.today
            );
          this.notificationData_recent_old =
            this.notificationData_recent.filter(
              (t) => new Date(t.createdDate).setHours(0, 0, 0, 0) !== this.today
            );

          this.pagination_clicked_count_recent++;

          this.push_prev_startAt_recent(this.firstInResponse_recent);

          this.disable_next_recent = false;
        },
        (error) => {
          this.disable_next_recent = false;
        }
      );
  }
  //Add document
  push_prev_startAt_recent(prev_first_doc) {
    this.prev_strt_at_recent.push(prev_first_doc);
  }
  //Remove not required document
  pop_prev_startAt_recent(prev_first_doc) {
    this.prev_strt_at_recent.forEach((element) => {
      if (prev_first_doc.data().id == element.data().id) {
        element = null;
      }
    });
  }
  // Load Unread Notificaations to get the count
  loadItemsUnRead() {
    this.loadSubscription?.unsubscribe();
    this.nextSubscription?.unsubscribe();
    this.unreadLoadSubscription = this.fulllayoutservice
      .loadItemsUnread(this.user.uid)
      .subscribe(
        (response) => {
          if (!response.length) {
            this.notificationData_unRead = [];
            this.notificationData_unRead_new = [];
            this.notificationData_unRead_old = [];
            // this.unreadLength = 0;
            return false;
          }
          if (!!response && response.length > 0) {
            this.firstInResponse_unRead = response[0].payload.doc;
            this.lastInResponse_unRead =
              response[response.length - 1].payload.doc;

            this.notificationData_unRead = [];
            for (let item of response) {
              this.notificationData_unRead.push(
                Object.assign(item.payload.doc.data(), {
                  id: item.payload.doc.id,
                })
              );
            }
            // this.unreadLength = this.notificationData_unRead.length;
            this.notificationData_unRead_new =
              this.notificationData_unRead.filter(
                (t) =>
                  new Date(t.createdDate).setHours(0, 0, 0, 0) === this.today
              );
            this.notificationData_unRead_old =
              this.notificationData_unRead.filter(
                (t) =>
                  new Date(t.createdDate).setHours(0, 0, 0, 0) !== this.today
              );

            //Initialize values
            this.prev_strt_at_unRead = [];
            this.pagination_clicked_count_unRead = 0;
            this.disable_next_unRead = false;
            this.disable_prev_unRead = false;

            //Push first item to use for Previous action
            this.push_prev_startAt_unRead(this.firstInResponse_unRead);
          }
        },
        (error) => {}
      );
  }
  //Show previous set
  prevPageUnRead() {
    if (this.pagination_clicked_count_unRead === 1) {
      this.loadItemsUnRead();
    } else {
      this.disable_prev_unRead = true;
      this.fulllayoutservice
        .prevPageUnread(
          this.user.uid,
          this.prev_strt_at_unRead,
          this.pagination_clicked_count_unRead,
          this.firstInResponse_unRead
        )
        .subscribe(
          (response) => {
            this.firstInResponse_unRead = response.docs[0];
            this.lastInResponse_unRead =
              response.docs[response.docs.length - 1];

            this.notificationData_unRead = [];
            for (let item of response.docs) {
              this.notificationData_unRead.push(
                Object.assign(item.data(), { id: item.id })
              );
            }
            this.notificationData_unRead_new =
              this.notificationData_unRead.filter(
                (t) =>
                  new Date(t.createdDate).setHours(0, 0, 0, 0) === this.today
              );
            this.notificationData_unRead_old =
              this.notificationData_unRead.filter(
                (t) =>
                  new Date(t.createdDate).setHours(0, 0, 0, 0) !== this.today
              );

            //Maintaing page no.
            this.pagination_clicked_count_unRead--;

            //Pop not required value in array
            this.pop_prev_startAt_unRead(this.firstInResponse_unRead);

            //Enable buttons again
            this.disable_prev_unRead = false;
            this.disable_next_unRead = false;
          },
          (error) => {
            this.disable_prev_unRead = false;
          }
        );
    }
  }
  // Show next set
  nextPageUnread() {
    this.disable_next_unRead = true;
    this.unreadLoadSubscription?.unsubscribe();
    this.unreadNextSubscription = this.fulllayoutservice
      .nxtPageUnread(this.user.uid, this.lastInResponse_unRead)
      .subscribe(
        (response) => {
          if (!response.docs.length) {
            this.disable_next_unRead = true;
            return;
          }

          this.firstInResponse_unRead = response.docs[0];

          this.lastInResponse_unRead = response.docs[response.docs.length - 1];
          this.notificationData_unRead = [];
          for (let item of response.docs) {
            this.notificationData_unRead.push(
              Object.assign(item.data(), { id: item.id })
            );
          }
          this.notificationData_unRead_new =
            this.notificationData_unRead.filter(
              (t) => new Date(t.createdDate).setHours(0, 0, 0, 0) === this.today
            );
          this.notificationData_unRead_old =
            this.notificationData_unRead.filter(
              (t) => new Date(t.createdDate).setHours(0, 0, 0, 0) !== this.today
            );
          this.pagination_clicked_count_unRead++;

          this.push_prev_startAt_unRead(this.firstInResponse_unRead);

          this.disable_next_unRead = false;
        },
        (error) => {
          this.disable_next_unRead = false;
        }
      );
  }
  //Add document
  push_prev_startAt_unRead(prev_first_doc) {
    this.prev_strt_at_unRead.push(prev_first_doc);
  }
  //Remove not required document
  pop_prev_startAt_unRead(prev_first_doc) {
    this.prev_strt_at_unRead.forEach((element) => {
      if (prev_first_doc.data().id == element.data().id) {
        element = null;
      }
    });
  }
  // fn to show 20+ if notification length > 20
  getString() {
    let len = '20+';
    return len;
  }
  exportTojson() {
    // exportData is your array which you want to dowanload as json and sample.json is your file name, customize the below lines as per your need.
    let exportData = this.superUserDetails;
    return saveAs(
      new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }),
      'automations.json'
    );
  }
  async presenceLogic(email) {
    const dateAtt = new Date().getDate(); //date only
    const monthAtt = new Date().toLocaleString('en-us', { month: 'long' }); //month only
    const yearAtt = new Date().getFullYear().toString(); //year only
    this.basePath = `users/${this.superUserId}/attendance/${yearAtt}/${monthAtt}/${dateAtt}`;

    if (this.userDetails) {
      if (this.userDetails.CRMAccess === true) {
        // check for attendance
        this.fulllayoutservice
          .getAttendance(this.basePath)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((attendance) => {
            // case1: a doc is there
            // case2: doc is not there
            // case3: doc is there but not this users data
            // case 4: doc is there, this users data is there, just to check and update logintime, if no logintime is there
            if (attendance) {
              //case 1
              var employeeTodaysData = Object.values(attendance);

              let requiredData = [];
              requiredData = employeeTodaysData.filter((e) => {
                return e.employeeId == this.userId;
              });

              if (requiredData?.length > 0) {
                // case 4

                this.attendanceData = requiredData[0];
                this.logoutToBeRecorded = true;
                this.commonService.updateLogOut(this.logoutToBeRecorded);
                const attData = requiredData[0];

                if (
                  typeof attData.loginTime === 'undefined' ||
                  attData.loginTime === null
                ) {
                  this.fulllayoutservice.updateLogInTime(
                    this.basePath,
                    attData.checkOut,
                    attData.checkOutUpdated,
                    attData.attStatus,
                    attData.checkIn,
                    attData.checkInUpdated,
                    attData.superUserId,
                    attData.employeeId,
                    attData.date,
                    attData.employeeName,
                    attData.id,
                    new Date().getTime(),
                    null,
                    'online',
                    0
                  );
                } else {
                  // no action needed
                  // login time is already recorded
                }
                // this.updateOnAway();
              } else {
                this.fulllayoutservice.updateLogInTime(
                  this.basePath,
                  null,
                  null,
                  null,
                  null,
                  null,
                  this.superUserId,
                  this.userId,
                  dateAtt,
                  this.userDetails.lastname
                    ? this.userDetails.firstname +
                        ' ' +
                        this.userDetails.lastname
                    : this.userDetails.firstname,
                  dateAtt,
                  new Date().getTime(),
                  null,
                  'online',
                  0
                );
              }
            } else {
              //case2

              this.fulllayoutservice.setLogInTime(
                this.basePath,
                null,
                null,
                null,
                null,
                null,
                this.superUserId,
                this.userId,
                dateAtt,
                this.userDetails.lastname
                  ? this.userDetails.firstname + ' ' + this.userDetails.lastname
                  : this.userDetails.firstname,
                dateAtt,
                new Date().getTime(),
                null,
                'online',
                0
              );
            }
          });
      }
    }
  }

  setNavOption(option) {
    this.navSelected = option;
    if (this.navSelected === 'Employee') {
      this.empSelected = true;
      this.employeeSelected = false;
      this.organSelected = false;
      this.contSelected = false;
      this.saleSelected = false;
      this.supportSelected = false;
      this.actSelected = false;
      this.dashSelected = false;
      this.documSelected = false;
      this.expSelected = false;
      this.itemsSelected = false;
      this.fileSelected = false;
    }
    if (this.navSelected === 'Emp') {
      this.empSelected = false;
      this.employeeSelected = true;
      this.organSelected = false;
      this.contSelected = false;
      this.saleSelected = false;
      this.supportSelected = false;
      this.actSelected = false;
      this.dashSelected = false;
      this.documSelected = false;
      this.expSelected = false;
      this.itemsSelected = false;
      this.fileSelected = false;
    }
    if (this.navSelected === 'Organization') {
      this.empSelected = false;
      this.employeeSelected = false;
      this.organSelected = true;
      this.contSelected = false;
      this.saleSelected = false;
      this.supportSelected = false;
      this.actSelected = false;
      this.dashSelected = false;
      this.documSelected = false;
      this.expSelected = false;
      this.itemsSelected = false;
      this.fileSelected = false;
    }
    if (this.navSelected === 'Contact') {
      this.empSelected = false;
      this.employeeSelected = false;
      this.organSelected = false;
      this.contSelected = true;
      this.saleSelected = false;
      this.supportSelected = false;
      this.actSelected = false;
      this.dashSelected = false;
      this.documSelected = false;
      this.expSelected = false;
      this.itemsSelected = false;
      this.fileSelected = false;
    }
    if (this.navSelected === 'Service') {
      this.empSelected = false;
      this.organSelected = false;
      this.employeeSelected = false;
      this.contSelected = false;
      this.saleSelected = false;
      this.supportSelected = true;
      this.actSelected = false;
      this.dashSelected = false;
      this.documSelected = false;
      this.expSelected = false;
      this.itemsSelected = false;
      this.fileSelected = false;
    }
    if (this.navSelected === 'Sale') {
      this.empSelected = false;
      this.employeeSelected = false;
      this.organSelected = false;
      this.contSelected = false;
      this.saleSelected = true;
      this.supportSelected = false;
      this.actSelected = false;
      this.dashSelected = false;
      this.documSelected = false;
      this.expSelected = false;
      this.itemsSelected = false;
      this.fileSelected = false;
    }
    if (this.navSelected === 'Activities') {
      this.empSelected = false;
      this.employeeSelected = false;
      this.organSelected = false;
      this.contSelected = false;
      this.saleSelected = false;
      this.supportSelected = false;
      this.actSelected = true;
      this.dashSelected = false;
      this.documSelected = false;
      this.expSelected = false;
      this.itemsSelected = false;
      this.fileSelected = false;
    }
    if (this.navSelected === 'DB') {
      this.empSelected = false;
      this.employeeSelected = false;
      this.organSelected = false;
      this.contSelected = false;
      this.saleSelected = false;
      this.supportSelected = false;
      this.actSelected = false;
      this.dashSelected = true;
      this.documSelected = false;
      this.expSelected = false;
      this.itemsSelected = false;
      this.fileSelected = false;
    }
    if (this.navSelected === 'Docs') {
      this.empSelected = false;
      this.employeeSelected = false;
      this.organSelected = false;
      this.contSelected = false;
      this.saleSelected = false;
      this.supportSelected = false;
      this.actSelected = false;
      this.dashSelected = false;
      this.documSelected = true;
      this.expSelected = false;
      this.itemsSelected = false;
      this.fileSelected = false;
    }
    if (this.navSelected === 'Exp') {
      this.empSelected = false;
      this.employeeSelected = false;
      this.organSelected = false;
      this.contSelected = false;
      this.saleSelected = false;
      this.supportSelected = false;
      this.actSelected = false;
      this.dashSelected = false;
      this.documSelected = false;
      this.expSelected = true;
      this.itemsSelected = false;
      this.fileSelected = false;
    }
    if (this.navSelected === 'Items') {
      this.empSelected = false;
      this.employeeSelected = false;
      this.organSelected = false;
      this.contSelected = false;
      this.saleSelected = false;
      this.supportSelected = false;
      this.actSelected = false;
      this.dashSelected = false;
      this.documSelected = false;
      this.expSelected = false;
      this.itemsSelected = true;
      this.fileSelected = false;
    }
    if (this.navSelected === 'Files') {
      this.empSelected = false;
      this.employeeSelected = false;
      this.organSelected = false;
      this.contSelected = false;
      this.saleSelected = false;
      this.supportSelected = false;
      this.actSelected = false;
      this.dashSelected = false;
      this.documSelected = false;
      this.expSelected = false;
      this.itemsSelected = false;
      this.fileSelected = true;
    }
  }

  // checkInvitation(userEmail) {
  //   return new Promise<void>((resolve) => {
  //     // we need invitation id to update decline/accept status
  //     this.fulllayoutservice
  //       .getInvitation(userEmail)
  //       .pipe(takeUntil(this.onDestroy$))
  //       .subscribe((inv) => {
  //         let doc = inv.map((e) => {
  //           return {
  //             id: e.payload.doc.id,
  //             ...(e.payload.doc.data() as {}),
  //           } as InvitationModel;
  //         });
  //         if (doc) {
  //           if (doc[0]) {
  //             this.invitation = doc[0];
  //           }
  //         }
  //         resolve();
  //       });
  //   });
  // }

  logout() {
    this.logoutLoader = true;
    if (this.attendanceData) {
      this.commonLogout();
    } else {
      this.afAuth.signOut().then(resp=>{
        window.location.reload();
        this.router.navigate(['']);
        })
    }

    //@MK 4/11/21 - commenting out this line to go to the login page as the subscriptions are not getting closed and the application is becoming very slow
    //window.location.href = 'https://zenys.org/';
  }

  commonLogout() {
    // active time calculation
    const diff =
      this.attendanceData.activeTimeNo +
      new Date().getTime() -
      this.currentlogintime;
    var days = Math.floor(diff / (60 * 60 * 24 * 1000));
    var hours = Math.floor(diff / (60 * 60 * 1000)) - days * 24;
    var minutes =
      Math.floor(diff / (60 * 1000)) - (days * 24 * 60 + hours * 60);
    var seconds =
      Math.floor(diff / 1000) -
      (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60);
    const actTime = `${hours} hours ${minutes} minutes ${seconds} seconds`;

    // autologout number fetch
    const autoLogoutCheck = this.commonService.getAutoLogOut();
    if (autoLogoutCheck === true) {
      this.autoLogouts = this.attendanceData.autoLogouts
        ? this.attendanceData.autoLogouts + 1
        : 1;
      if (
        this.autoLogouts === this.superUserDetails.accessLockAutoLogoutThreshold
      ) {
        this.fulllayoutservice.lockatUser(this.userId);
        this.fulllayoutservice.lockSubUser(this.superUserId, this.subUserId);
      } else if (
        this.autoLogouts > this.superUserDetails.accessLockAutoLogoutThreshold
      ) {
        this.fulllayoutservice.lockatUser(this.userId);
        this.fulllayoutservice.lockSubUser(this.superUserId, this.subUserId);
      }
    } else {
      this.autoLogouts = this.attendanceData.autoLogouts
        ? this.attendanceData.autoLogouts
        : 0;
    }

    this.fulllayoutservice
      .updateLogOutTime(
        this.basePath,
        this.attendanceData.checkOut,
        this.attendanceData.checkOutUpdated,
        this.attendanceData.attStatus,
        this.attendanceData.checkIn,
        this.attendanceData.checkInUpdated,
        this.attendanceData.superUserId,
        this.attendanceData.employeeId,
        this.attendanceData.date,
        this.attendanceData.employeeName,
        this.attendanceData.id,
        this.attendanceData.loginTime,
        new Date().getTime(),
        actTime,
        diff,
        this.autoLogouts
      )

      .then((resp) => {
        this.logoutToBeRecorded = false;
        this.commonService.updateLogOut(this.logoutToBeRecorded);
        this.afAuth.signOut().then(resp=>{
          window.location.reload();
        this.router.navigate(['']);
        })
      });
  }

  // go to public profile
  profile() {
    const dialogRef = this.dialog.open(ProfileCheckComponent, {});
  }

  // toggle button actions of documents in expanded sidenavbar
  toggleDocView() {
    this.docListView = !this.docListView;
    if (this.docListView == true) {
      this.pendingsView = false;
      this.settingsView = false;
      this.employeesView = false;
      this.saleListView = false;
      this.dashboardView = false;
      this.itemsView = false;
    }
  }
  // toggle button actions of settings in expanded sidenavbar
  toggleSettingsView() {
    this.settingsView = !this.settingsView;
    if (this.settingsView == true) {
      this.docListView = false;
      this.pendingsView = false;
      this.employeesView = false;
      this.saleListView = false;
      this.dashboardView = false;
      this.itemsView = false;
    }
  }
  itemsViewFn() {
    this.itemsView = !this.itemsView;
    if (this.itemsView === true) {
      this.docListView = false;
      this.pendingsView = false;
      this.employeesView = false;
      this.saleListView = false;
      this.dashboardView = false;
      this.settingsView = false;
    }
  }
  // sidenav expanded dashboard submenu view fn
  dashboardViewFn() {
    this.dashboardView = !this.dashboardView;
    if (this.dashboardView === true) {
      this.settingsView = false;
      this.docListView = false;
      this.pendingsView = false;
      this.employeesView = false;
      this.saleListView = false;
      this.itemsView = false;
    }
  }
  // toggle button actions of pending actios in expanded sidenavbar
  pendingActionsView() {
    this.pendingsView = !this.pendingsView;
    if (this.pendingsView == true) {
      this.settingsView = false;
      this.docListView = false;
      this.employeesView = false;
      this.saleListView = false;
      this.dashboardView = false;
      this.itemsView = false;
    }
  }

  // toggle button actions of employees menu tab in expanded sidenavbar
  employeeActionsView() {
    this.employeesView = !this.employeesView;
    if (this.employeesView == true) {
      this.settingsView = false;
      this.docListView = false;
      this.pendingsView = false;
      this.saleListView = false;
      this.dashboardView = false;
      this.itemsView = false;
    }
  }
  // side navbar toggling
  toggleSideNav() {
    this.sideNavexpanded = !this.sideNavexpanded;
    this.sideNavshrinked = !this.sideNavshrinked;
    if (this.sideNavexpanded) {
      this.contentMargin = sideNavExpanded.CONTENT_MARGIN;
      this.sideNavExp = sideNavExpanded.CONTENT_MARGIN;
    } else {
      this.contentMargin = sideNavShrinked.CONTENT_MARGIN;
      this.sideNavExp = sideNavShrinked.CONTENT_MARGIN;
    }
  }
  // toggle button actions of sale in expanded sidenavbar
  toggleSaleView() {
    this.saleListView = !this.saleListView;
    if (this.saleListView == true) {
      this.pendingsView = false;
      this.settingsView = false;
      this.employeesView = false;
      this.docListView = false;
      this.dashboardView = false;
      this.itemsView = false;
    }
  }
  // add sale from sidenav
  addsalefn() {
    const dialogRef = this.dialog.open(Addnewsale1Component, {
      width: '800px',
      height: 'auto',
      disableClose: true,
      data: { scenario: 'create' },
    });
  }
  // add service fn
  addservicefn() {
    this.dialog.open(CrudServiceComponent, {
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: { scenario: 'create' },
    });
  }
  // add contact from sidenav
  addcontactfn() {
    const dialogRef = this.dialog.open(Addcontactpopup1Component, {
      panelClass: 'custom-dialog-container',
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: { scenario: 'create' },
      autoFocus: false,
      restoreFocus: false,
    });
  }
  async addOrgfn() {
    this.dialog.open(CrudFormComponent, {
      panelClass: 'custom-dialog-container',
      width: '400px',
      minHeight: '100px',
      height: 'auto',
      disableClose: true,
      data: { scenario: 'create' },
    });
  }

  pay() {
    this.router.navigate(['/dash/razorpay/razorpay']);
  }

  // network check and thus disabling addition of contact, sale..
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }

  // Functions fetching required data from DB
  getInqiryListFromApi() {
    this.isInquiryApiRunning = true;
    this.fulllayoutservice
      .getInquiries(this.superUserId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.inquiries = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Inquiries;
        });
        this.badgeNo = 0;
        for (let i = 0; i < this.inquiries.length; i++) {
          if (this.inquiries[i].viewStatus == false) {
            this.badgeNo++;
          }
        }
        this.isInquiryApiRunning = false;
        this.updateValueToUi();
      });
  }

  currentMonthWiseCustomersFromApi(firstDay, lastDay) {
    this.isCustomerMonthWiseApiRunning = true;
    this.monthlyContactsSubscription = this.fulllayoutservice
      .getCustomerMonthFromApi(this.superUserId, firstDay, lastDay)
      .subscribe((data) => {
        let customersInMonth = data.map((e) => {
          return {
            id: e.payload.doc.id,
          } as {};
        });
        this.commonService.onUpdateCustomersInMonth(customersInMonth.length);

        if (customersInMonth.length) {
          this.addDocumentDisable.balanceCustomers =
            docCreationLimits.Contact_monthly_limit - customersInMonth?.length;
          if (this.addDocumentDisable.balanceCustomers < 0) {
            this.addDocumentDisable.balanceCustomers = 0;
          }
        }
        if (
          this.addDocumentDisable.balanceCustomers <=
          docCreationLimits.Contact_monthly_limit - 1
        ) {
          this.addDocumentDisable.balanceCustomerFlag = true;
          if (this.addDocumentDisable.balanceCustomers <= 0) {
            this.addDocumentDisable.customerOverFlag = true;
          } else {
            this.addDocumentDisable.customerOverFlag = false;
          }
        } else {
          this.addDocumentDisable.balanceCustomerFlag = false;
        }
        if (this.addDocumentDisable.customerOverFlag == true) {
          this.addDocumentDisable.addContactDisable = true;
        } else {
          this.addDocumentDisable.addContactDisable = false;
        }
        this.isCustomerMonthWiseApiRunning = false;
        this.updateValueToUi();
      });
  }

  currentMonthWiseSalesFromApi(firstDay, lastDay) {
    this.isSaleMonthWiseApiRunning = true;
    this.salesMonthlySubscription = this.fulllayoutservice
      .getSalesMonthFromApi(this.superUserId, firstDay, lastDay)
      .subscribe((data) => {
        let salesInMonth = data.map((e) => {
          return {
            id: e.payload.doc.id,
          } as {};
        });
        if (salesInMonth.length >= docCreationLimits.Sales_monthly_limit) {
          // this.disableSale = true;
          this.addDocumentDisable.addSaleDisable = true;
        }
        if (salesInMonth.length) {
          this.addDocumentDisable.balanceSales =
            docCreationLimits.Sales_monthly_limit - salesInMonth?.length;
          if (this.addDocumentDisable.balanceSales < 0) {
            this.addDocumentDisable.balanceSales = 0;
          }
        }
        this.isSaleMonthWiseApiRunning = false;
        this.updateValueToUi();
      });
  }

  currentMonthWiseInvoiceFromApi(firstDay, lastDay) {
    this.isInvoiceMonthWiseApiRunning = true;
    this.monthlyInvoiceSubscription = this.fulllayoutservice
      .getInvoiceMonthFromApi(this.superUserId, firstDay, lastDay)
      .subscribe((data) => {
        let invoicesInMonth = data.map((e) => {
          return {
            id: e.payload.doc.id,
          } as {};
        });

        if (invoicesInMonth.length >= docCreationLimits.Inv_monthly_limit) {
          this.addDocumentDisable.addInvoiceDisable = true;
        }
        if (invoicesInMonth.length) {
          this.addDocumentDisable.balanceInvoices =
            docCreationLimits.Inv_monthly_limit - invoicesInMonth?.length;
          if (this.addDocumentDisable.balanceInvoices < 0) {
            this.addDocumentDisable.balanceInvoices = 0;
          }
        }
        this.isInvoiceMonthWiseApiRunning = false;
        this.updateValueToUi();
      });
  }

  currentMonthWiseQuotationFromApi(firstDay, lastDay) {
    this.isQuotationMonthWiseApiRunning = true;
    this.quoteMonthlySubscription = this.fulllayoutservice
      .getQuotationMonthFromApi(this.superUserId, firstDay, lastDay)
      .subscribe((data) => {
        let quotationInMonth = data.map((e) => {
          return {
            id: e.payload.doc.id,
          } as {};
        });

        if (quotationInMonth?.length >= docCreationLimits.Quote_monthly_limit) {
          this.addDocumentDisable.addQuotationDisable = true;
        }
        if (quotationInMonth.length) {
          this.addDocumentDisable.balanceQuotations =
            docCreationLimits.Quote_monthly_limit - quotationInMonth?.length;
          if (this.addDocumentDisable.balanceQuotations < 0) {
            this.addDocumentDisable.balanceQuotations = 0;
          }
        }
        this.isQuotationMonthWiseApiRunning = false;
        this.updateValueToUi();
      });
  }

  currentMonthWiseEstimateFromApi(firstDay, lastDay) {
    this.isEstimateMonthWiseApiRunning = true;
    this.estMonthlySubscription = this.fulllayoutservice
      .getEstimatesMonthFromApi(this.superUserId, firstDay, lastDay)
      .subscribe((data) => {
        let estimateInMonth = data.map((e) => {
          return {
            id: e.payload.doc.id,
          } as {};
        });
        if (estimateInMonth?.length >= docCreationLimits.Est_monthly_limit) {
          this.addDocumentDisable.addEstimateDisable = true;
        }
        if (estimateInMonth.length) {
          this.addDocumentDisable.balanceEstimates =
            docCreationLimits.Est_monthly_limit - estimateInMonth?.length;
          if (this.addDocumentDisable.balanceEstimates < 0) {
            this.addDocumentDisable.balanceEstimates = 0;
          }
        }
        this.isEstimateMonthWiseApiRunning = false;
        this.updateValueToUi();
      });
  }

  //checking all the subscription is completed or not
  updateValueToUi() {
    if (
      this.isInquiryApiRunning ||
      this.isCustomerMonthWiseApiRunning ||
      this.isSaleMonthWiseApiRunning ||
      this.isQuotationMonthWiseApiRunning ||
      this.isInvoiceMonthWiseApiRunning ||
      this.isEstimateMonthWiseApiRunning ||
      this.isNotificationApiRunning
    ) {
      return;
    }
    this.commonService.updateUserLimitation(this.addDocumentDisable);
    this.isLoaded = true; // checks if plan is free and then show the limit popup
    if (
      this.planFetch == ProductPlans.FREE &&
      !this.commonService.isFreePopupOpen
    ) {
      this.commonService.isFreePopupOpen = true;
      this.openDialogForFreeUser(); // open free user limit popup
    }
  }
  //free ser limit popup for free user expires free limit
  openDialogForFreeUser(): void {
    const dialogRef = this.dialog.open(FreeUserPopupComponent, {
      width: '350px',
      data: {
        firstName: this.userDetails.firstname,
        fieldNameContact: this.fieldNameContact,
        fieldNameSale: this.fieldNameSale,
        fieldNameEstimate: this.fieldNameEstimate,
        fieldNameQuotation: this.fieldNameQuotation,
        fieldNameInvoice: this.fieldNameInvoice,
      },
    });
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  // clicking on help icon
  helpCalled() {
    this.defaultHelp = true;
    //  send pageQuerying variable corresponding to current router.urls to DB and then fetch correponding videoLink and topics

    //  DashHome
    if (this.router.url == '/dash/home') {
      this.pageQuerying = 'dashHome';
    }
    // contacts list
    if (
      this.router.url == '/dash/contact/customerlist' ||
      this.router.url == '/dash/customer-list'
    ) {
      this.pageQuerying = 'contactsList';
    }
    // salesList
    if (
      this.router.url == '/dash/sales/sale' ||
      this.router.url == '/dash/sale-list'
    ) {
      this.pageQuerying = 'salesList';
    }
    // inquiries
    if (this.router.url == '/dash/Inquireslist') {
      this.pageQuerying = 'inquiries';
    }
    // Dashboard
    if (this.router.url == '/dash/reports/summary') {
      this.pageQuerying = 'dashboard';
    }
    // Estimates
    if (
      this.router.url == '/dash/documents-list/estimatelist' ||
      this.router.url == '/dash/estimate-table'
    ) {
      this.pageQuerying = 'estimates';
    }
    // Quotations
    if (this.router.url == '/dash/documents-list/Quotationlist') {
      this.pageQuerying = 'quotations';
    }
    // invoices
    if (this.router.url == '/dash/documents-list/Invoicelist' ||
    this.router.url == '/dash/inv-paginator-table') {
      this.pageQuerying = 'invoices';
    }
    // collections
    if (this.router.url == '/dash/documents-list/payment-receipt') {
      this.pageQuerying = 'collections';
    }
    // expenses
    if (this.router.url == '/dash/ExpensesList') {
      this.pageQuerying = 'expenses';
    }
    // Products and Services
    if (this.router.url == '/dash/products-and-services') {
      this.pageQuerying = 'Items';
    }
    // tasks
    if (
      this.router.url == '/dash/tasks' ||
      this.router.url == '/dash/task-list'
    ) {
      this.pageQuerying = 'tasks';
    }
    // meetings
    if (this.router.url == '/dash/events') {
      this.pageQuerying = 'calendar';
    }
    // followups
    if (
      this.router.url == '/dash/followuplist' ||
      this.router.url == '/dash/followup-lite'
    ) {
      this.pageQuerying = 'followUps';
    }
    // customersettings
    if (this.router.url == '/dash/settings/custsettings') {
      this.pageQuerying = 'customerSettings';
    }
    // salesettings
    if (this.router.url == '/dash/settings/salessettings') {
      this.pageQuerying = 'saleSettings';
    }
    // expense settings
    if (this.router.url == '/dash/settings/expensesettings') {
      this.pageQuerying = 'expenseSettings';
    }
    // profile settings
    if (this.router.url == '/dash/settings/profilesettings') {
      this.pageQuerying = 'profileSettings';
    }
    // doc settings
    if (this.router.url == '/dash/settings/docsettings') {
      this.pageQuerying = 'docSettings';
    }
    // subuser settings
    if (this.router.url == '/dash/settings/subusersettings') {
      this.pageQuerying = 'subUserSettings';
    }
    // email settings
    if (this.router.url == '/dash/settings/emailsettings') {
      this.pageQuerying = 'emailSettings';
    }
    // upload-customer-excel
    if (this.router.url == '/dash/upload-customer-excel') {
      this.pageQuerying = 'uploadCustomerExcel';
    }
    // customer details
    if (this.router.url.includes('dash/contact/customerdetails')) {
      this.pageQuerying = 'contactDetails';
    }
    // sales details
    if (this.router.url.includes('dash/sales/saleview')) {
      this.pageQuerying = 'salesDetails';
    }
    // chat
    if (this.router.url.includes('dash/chat')) {
      this.pageQuerying = 'chat';
    }
    // automations
    if (this.router.url.includes('dash/automation-list')) {
      this.pageQuerying = 'automationList';
    }
    // prodServWiseSaleList
    if (this.router.url.includes('dash/sales/product')) {
      this.pageQuerying = 'prodServWiseSaleList';
    }
    // servicesList
    if (
      this.router.url.includes('dash/service/service-list') ||
      this.router.url.includes('dash/support-list')
    ) {
      this.pageQuerying = 'servicesList';
    }
    // service details
    if (this.router.url.includes('dash/service/service-details')) {
      this.pageQuerying = 'servicesDetails';
    }
    // serviceSettings
    if (this.router.url == '/dash/settings/service-settings') {
      this.pageQuerying = 'serviceSettings';
    }
    // fieldNameSettings
    if (this.router.url == '/dash/settings/field-name-settings') {
      this.pageQuerying = 'fieldNameSettings';
    }
    // productSettings
    if (this.router.url == '/dash/settings/product-settings') {
      this.pageQuerying = 'productSettings';
    }
    // generalSettings
    if (this.router.url == '/dash/settings/generalsettings') {
      this.pageQuerying = 'generalSettings';
    }
    // followUpSettings
    if (this.router.url == '/dash/settings/followupsettings') {
      this.pageQuerying = 'followUpSettings';
    }
    // uploadFiles
    if (this.router.url.includes('dash/upload-files')) {
      this.pageQuerying = 'uploadFiles';
    }
    // messageTemplates
    if (this.router.url == '/dash/settings/messagetemplate') {
      this.pageQuerying = 'messageTemplates';
    }

    // CUSTOMER REPORT
    if (this.router.url.includes('dash/reports/contact')) {
      this.pageQuerying = 'customerReports';
    }
    // SALES REPORT
    if (this.router.url.includes('dash/reports/sales')) {
      this.pageQuerying = 'salesReports';
    }
    // TEAM SALE REPORT
    if (this.router.url.includes('dash/reports/ind-sales-dash')) {
      this.pageQuerying = 'teamSaleReports';
    }
    // PRODUCT SALE
    if (this.router.url.includes('dash/reports/product-dash')) {
      this.pageQuerying = 'productSales';
    }
    // SUPPORT REPORT
    if (this.router.url.includes('dash/reports/services')) {
      this.pageQuerying = 'supportReports';
    }
    // TASK REPORT
    if (this.router.url.includes('dash/reports/task-dashboard')) {
      this.pageQuerying = 'taskReports';
    }
    // FOLLOWUP REPORT
    if (this.router.url.includes('dash/reports/followup-dash')) {
      this.pageQuerying = 'followUpReports';
    }
    // INVOICE REPORT
    if (this.router.url.includes('dash/reports/invcollection')) {
      this.pageQuerying = 'invoiceReports';
    }
    // DASHBOARD
    if (this.router.url.includes('dash/custom-report/grid')) {
      this.pageQuerying = 'dashboardGrid';
    }
    // CUSTOM REPORTS
    if (this.router.url.includes('dash/custom-report/list')) {
      this.pageQuerying = 'customReports';
    }
    //Organisation list
    if (this.router.url.includes('dash/organisation/orglist')) {
      this.pageQuerying = 'orgList';
    }
    // task settings
    if (this.router.url == '/dash/settings/tasksettings') {
      this.pageQuerying = 'taskSett';
    }
    // payment settings
    if (this.router.url == '/dash/settings/paymentsettings') {
      this.pageQuerying = 'paymentSett';
    }
    // org settings
    if (this.router.url == '/dash/settings/organisation-settings') {
      this.pageQuerying = 'orgSett';
    }
    // lead capture settings
    if (this.router.url == '/dash/settings/lead-capture-settings') {
      this.pageQuerying = 'leadCaptureSett';
    }
    // products-categories
    if (this.router.url.includes('dash/products-categories')) {
      this.pageQuerying = 'prodCategories';
    }
    // org details
    if (this.router.url.includes('dash/organisation/orgdetails')) {
      this.pageQuerying = 'orgDetails';
    }
    // settings
    if (this.router.url == '/dash/settings') {
      this.pageQuerying = 'settingsPage';
    }
    // reports list
    if (this.router.url.includes('dash/custom-report/list')) {
      this.pageQuerying = 'reportsList';
    }
    // reports details
    if (this.router.url.includes('dash/custom-report/report')) {
      this.pageQuerying = 'reportsChild';
    }
    // estimate create
    if (this.router.url.includes('dash/document/documentmanagement')) {
      this.pageQuerying = 'estCreate';
    }
    // quot create
    if (this.router.url.includes('dash/document/documentquotationmanagement')) {
      this.pageQuerying = 'quotCreate';
    }
    // inv create
    if (this.router.url.includes('dash/document/documentinvoicemanagement')) {
      this.pageQuerying = 'invCreate';
    }
    // inv display
    if (this.router.url.includes('dash/document/Invoice')) {
      this.pageQuerying = 'invPage';
    }
    // quotation
    if (this.router.url.includes('dash/document/Quotation')) {
      this.pageQuerying = 'quotPage';
    }
    // estimate
    if (this.router.url.includes('dash/document/Estimate')) {
      this.pageQuerying = 'estPage';
    }
    // FB integration
    if (this.router.url == '/dash/fb') {
      this.pageQuerying = 'fbIntegration';
    }
    if (this.pageQuerying) {
      this.getVideoURL(this.pageQuerying);
      this.getHelpTopics(this.pageQuerying);
    } else {
      this.snippetsArray = [];
    }
    // detect route changes
    this.router.events.pipe(takeUntil(this.onDestroy$)).subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.showAllTopicFlag = false;
        this.snippetsArray = null;
        this.safeURL = null;
        this.pageQuerying = null;
        this.helpCalled();
      }
    });
  }

  // if a particular snippet is selected
  snippetClick(snippet) {
    this.defaultHelp = false;
    this.contentOfSelectedSnippet = snippet.content;
    this.linkofSelectedSnippet = snippet.contentLink;
    this.titleofSelectedSnippet = snippet.title;
  }

  // show all snippets function, on default only 5 snippets will be shown
  showAll() {
    this.showAllTopicFlag = true;
  }
  // go to url in detailed content
  goToUrl() {
    window.open(this.linkofSelectedSnippet, '_blank');
  }

  // clear button help section
  onClear() {
    this.showAllTopicFlag = false;
    this.snippetsArray = [];
    this.safeURL = null;
    this.pageQuerying = null;
  }

  // once all snippets are showed, and then again to limit to 3 snippets
  showLess() {
    this.showAllTopicFlag = false;
  }

  // back butoon in help from detailed view to default help view
  helpBack() {
    this.defaultHelp = true;
  }
  // videoURL fetching from DB
  getVideoURL(pageQuerying) {
    this.helpVideoSubscription = this.fulllayoutservice
      .getHelpVideos(pageQuerying)
      .subscribe((data) => {
        let video = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as HelpVideoModel;
        });
        if (video) {
          if (video[0]) {
            let videoURL = video[0].link;
            this.safeURL =
              this._sanitizer.bypassSecurityTrustResourceUrl(videoURL);
          }
        }
      });
  }
  // helpTopics collections fetching from DB
  getHelpTopics(pageQuerying) {
    this.helpTopicsSubscription = this.fulllayoutservice
      .getHelpTopics(pageQuerying)
      .subscribe((data) => {
        let HelpTopics = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as HelpTopicsModel;
        });
        if (HelpTopics) {
          if (HelpTopics[0]) {
            this.snippetsArray = HelpTopics[0].helpTopic;
          } else {
            this.snippetsArray = [];
          }
        }
      });
  }
  onSearch() {
    this.panelOpenState = false;
    this.router.navigate(['dash/search', this.searchTerm, this.searchSelected]);
  }
  // @HostListener('window:unload', ['$event'])
  // unloadHandler(event) {
  //     this.PostCall();
  // }

  @HostListener('window:beforeunload', ['$event'])
  async beforeUnloadHander(event) {
    if (this.logoutToBeRecorded == true) {
      event.preventDefault();
      await this.PostCall();
      return false;
    }
  }

  PostCall() {
    return new Promise<void>((resolve) => {
      const diff =
        this.attendanceData.activeTimeNo +
        new Date().getTime() -
        this.currentlogintime;
      var days = Math.floor(diff / (60 * 60 * 24 * 1000));
      var hours = Math.floor(diff / (60 * 60 * 1000)) - days * 24;
      var minutes =
        Math.floor(diff / (60 * 1000)) - (days * 24 * 60 + hours * 60);
      var seconds =
        Math.floor(diff / 1000) -
        (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60);
      const actTime = `${hours} hours ${minutes} minutes ${seconds} seconds`;

      // autologout number fetch
      const autoLogoutCheck = this.commonService.getAutoLogOut();
      if (autoLogoutCheck === true) {
        this.autoLogouts = this.attendanceData.autoLogouts
          ? this.attendanceData.autoLogouts + 1
          : 1;
      } else {
        this.autoLogouts = this.attendanceData.autoLogouts
          ? this.attendanceData.autoLogouts
          : 0;
      }

      this.fulllayoutservice
        .updateLogOutTime(
          this.basePath,
          this.attendanceData.checkOut,
          this.attendanceData.checkOutUpdated,
          this.attendanceData.attStatus,
          this.attendanceData.checkIn,
          this.attendanceData.checkInUpdated,
          this.attendanceData.superUserId,
          this.attendanceData.employeeId,
          this.attendanceData.date,
          this.attendanceData.employeeName,
          this.attendanceData.id,
          this.attendanceData.loginTime,
          new Date().getTime(),
          actTime,
          diff,
          this.autoLogouts
        )
        .then((resp) => {
          this.logoutToBeRecorded = false;
          resolve();
        });
    });
  }

  @HostListener('window:unload')
  ngOnDestroy(): void {
    // if file uploading is in progress, we have to revert the superusers totalAttachment size updated
    if (this.fileUploading === true) {
      this.uploadAttachmentSizeCust.updateSize(
        this.superUserId,
        this.sizeUpdated
      );
    }
    //close all the subscription
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.authSubscription?.unsubscribe();
    this.chatSubscription?.unsubscribe();
    this.paymentHistorySubscription?.unsubscribe();
    this.monthlyContactsSubscription?.unsubscribe();
    this.salesMonthlySubscription?.unsubscribe();
    this.monthlyInvoiceSubscription?.unsubscribe();
    this.quoteMonthlySubscription?.unsubscribe();
    this.estMonthlySubscription?.unsubscribe();
    this.helpVideoSubscription?.unsubscribe();
    this.helpTopicsSubscription?.unsubscribe();
    this.commonServcieUserSubscription?.unsubscribe();
  }
  onService() {
    let contactName;
    if (this.superUserDetails.lastname) {
      contactName =
        this.superUserDetails.firstname + ' ' + this.superUserDetails.lastname;
    } else {
      contactName = this.superUserDetails.firstname;
    }

    const dialogRef = this.dialog.open(ServicesComponent, {
      width: '600px',
      data: {
        superUserId: this.superUserId,
        email: this.superUserDetails.email,
        contactNumber: this.superUserDetails.phone,
        countryCode: this.superUserDetails.countryCode,
        contactName: contactName,
      },
    });
  }
  // onclick ontification
  notificationCalled() {
    this.sideNavShow = 'notification';
    this.selectedNotifn = 'recent';
    this.loadItems_recent();
  }
  // for clear notification sidenav
  heplCalled() {
    this.sideNavShow = 'help';
    // this.loadSubscription?.unsubscribe();
    // this.nextSubscription?.unsubscribe();
    // this.unreadLoadSubscription?.unsubscribe();
    // this.unreadNextSubscription?.unsubscribe();
  }
  // for clear notification sidenav
  CallClicked() {
    this.sideNavShow = 'call';
  }

  // mark notification as view
  onReadNotification(notificationId, index?, array?) {
    // update in ui first since if we click Mark As Read from a next page,
    // it won't reflect unless going to next/previous/Unread page
    if (array && array == 'notificationData_recent_old') {
      this.notificationData_recent_old[index].viewStatus = true;
    }
    if (array && array == 'notificationData_recent_new') {
      this.notificationData_recent_new[index].viewStatus = true;
    }
    if (array && array == 'notificationData_unRead_old') {
      this.notificationData_unRead_old.splice(index, 1);
    }
    if (array && array == 'notificationData_unRead_new') {
      this.notificationData_unRead_new.splice(index, 1);
    }
    this.fulllayoutservice.onUpdateNotificationStatus(
      this.user.uid,
      notificationId
    );
  }

  // mark all unread notification as view
  async markAllNotificationAsRead() {
    this.fulllayoutservice.updateUnread(this.user.uid);
    // update in ui in unsubscribed case
    this.notificationData_unRead_old = [];
    this.notificationData_unRead_new = [];
  }

  notificationCLicked(notification) {
    if (!this.clickAgain) {
      if (
        notification.type &&
        notification.docId &&
        notification.type === 'Contact'
      ) {
        this.router.navigate([
          'dash/contact/customerdetails/' + notification.docId,
        ]);
      } else if (
        notification.type &&
        notification.docId &&
        notification.type === 'Sale'
      ) {
        this.router.navigate(['dash/sales/saleview/' + notification.docId]);
      } else if (
        notification.type &&
        notification.docId &&
        notification.type === 'Service'
      ) {
        this.router.navigate([
          'dash/service/service-details/' + notification.docId,
        ]);
      } else if (
        notification.type &&
        notification.docId &&
        notification.type === 'Task'
      ) {
        this.clickAgain = true;
        this.taskIsCalled(notification.docId);
      } else if (
        notification.type &&
        notification.docId &&
        notification.type === 'FollowUp'
      ) {
        this.clickAgain = true;
        this.followUpIsCalled(notification.docId);
      }
    }
  }
  async taskIsCalled(taskId) {
    await this.getTask(taskId);

    if (this.taskAssigned) {
      this.commonService.updateTaskToEdit(this.taskAssigned);
      this.dialog.open(CrudModal1Component, {
        width: '1060px',
        height: 'auto',
        disableClose: true,
        data: {
          id: taskId,
          mode: 'update',
        },
      });
      this.clickAgain = false;
    }
  }
  async ContactIsCalled(taskId) {
    await this.getContact(taskId);
    this.commonService.updateCustomerToEdit(this.contAssigned);
    const dialogRef = this.dialog.open(Addcontactpopup1Component, {
      panelClass: 'custom-dialog-container',
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: {
        id: taskId,
        scenario: 'edit',
      },
    });
  }
  async SaleIsCalled(taskId) {
    await this.getSale(taskId);
    this.commonService.updateSaleToEdit(this.saleAssigned);
    const dialogRef = this.dialog.open(Addnewsale1Component, {
      width: '800px',
      height: 'auto',
      disableClose: true,
      data: { scenario: 'edit', id: taskId },
    });
  }
  async ServiceIsCalled(taskId) {
    await this.getService(taskId);
    this.commonService.updateserviceToEdit(this.serviceAssigned);
    const dialogRef = this.dialog.open(CrudServiceComponent, {
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: { scenario: 'edit', id: taskId },
    });
  }
  async followUpIsCalled(taskId) {
    await this.getFollowUp(taskId);
    if (this.followUpAssigned) {
      let customerId: string = this.followUpAssigned.customerId;
      let companyName: string = this.followUpAssigned.companyNam;
      let customerName: string = this.followUpAssigned.customerName;
      this.commonService.followUpDetails = this.followUpAssigned;
      let followUpDialog = this.dialog.open(FollowupTaskCreateComponent, {
        width: '700px',
        height: 'auto',
        disableClose: true,
        data: {
          id: customerId, // pass customer id
          companyNames: companyName, // pass company name
          customerNames: customerName, // pass customer name
          contactNumber: this.followUpAssigned.contactNumber ? this.followUpAssigned.contactNumber:'', // pass customer number
          countryCode: this.followUpAssigned.countryCode ? this.followUpAssigned.countryCode:'', // pass customer country code
          scenario: 'edit', // scenario for followup popup
          followUpId: taskId, // pass task id
          subUsers: this.subUsers, // pass sub user list
          fname: this.superUserDetails.firstname, // pass super user first name
          lastname: this.superUserDetails.lastname, // pass super user second name
          editFrom: 'table', // pass from  which part the popup is open
        },
      });
      followUpDialog.afterClosed().subscribe((x) => {
        followUpDialog = null;
        this.clickAgain = false;
      });
    }
  }
  getTask(id) {
    return new Promise<void>((resolve) => {
      this.fulllayoutservice
        .getTask(this.superUserId, id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((task) => {
          this.taskAssigned = task;
          resolve();
        });
    });
  }
  getFollowUp(id) {
    return new Promise<void>((resolve) => {
      this.fulllayoutservice
        .getFollowUp(this.superUserId, id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((task) => {
          this.followUpAssigned = task;
          resolve();
        });
    });
  }
  getContact(id) {
    return new Promise<void>((resolve) => {
      this.fulllayoutservice
        .getContact(this.superUserId, id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((task) => {
          this.contAssigned = task;
          resolve();
        });
    });
  }
  getOrg(id) {
    return new Promise<void>((resolve) => {
      this.fulllayoutservice
        .getOrg(this.superUserId, id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((task) => {
          this.orgSelected = task;
          resolve();
        });
    });
  }
  getSale(id) {
    return new Promise<void>((resolve) => {
      this.fulllayoutservice
        .getSale(this.superUserId, id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((task) => {
          this.saleAssigned = task;
          resolve();
        });
    });
  }
  getService(id) {
    return new Promise<void>((resolve) => {
      this.fulllayoutservice
        .getService(this.superUserId, id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((task) => {
          this.serviceAssigned = task;
          resolve();
        });
    });
  }
  onSearchTermChanges(value) {
    this.searchSelected = value;
  }

  uploadAttachment(
    filePath,
    file,
    custId,
    str,
    date,
    name,
    size,
    newSize,
    form,
    otherId,
    changeLog
  ) {
    this.sizeUpdated = newSize - size;
    this.commonService.updateStatus(true);
    this.fileUploading = true;
    // this.uploadShow=true;
    let downloadURL;
    const task = this.storage.upload(filePath, file);

    const ref = this.storage.ref(filePath);
    this.uploadProgress$ = task.percentageChanges();

    task
      .snapshotChanges()
      .pipe(
        finalize(async () => {
          downloadURL = await ref.getDownloadURL().toPromise();
          if (downloadURL) {
            if (form == 'cust') {
              this.uploadAttachmentSizeCust
                .attachmentsToCollection(
                  this.superUserId,
                  custId,
                  str,
                  downloadURL,
                  filePath,
                  date,
                  name,
                  size
                )
                .then((res) => {
                  this.fulllayoutservice.updateChangeLog(
                    this.superUserId,
                    'customers',
                    custId,
                    changeLog
                  );
                  this._snackBar.open('Attachment added successfully', '', {
                    duration: 2000,
                  });
                  this.commonService.updateStatus(false);
                })
                .catch((e) => {
                  // revert the updated size if uploading failed
                  this.uploadAttachmentSizeCust.updateSize(
                    this.superUserId,
                    this.sizeUpdated
                  );
                  this._snackBar.open('Error!!! Attachment not added', '', {
                    duration: 2000,
                  });
                  this.commonService.updateStatus(false);
                });
            }
            if (form == 'sale') {
              this.uploadAttachmentSizeSale
                .attachmentsToCollection(
                  this.superUserId,
                  otherId,
                  custId,
                  str,
                  downloadURL,
                  filePath,
                  date,
                  size,
                  this.userLastName
                    ? this.userName + ' ' + this.userLastName
                    : this.userName
                )
                .then((res) => {
                  this.fulllayoutservice.updateChangeLog(
                    this.superUserId,
                    'sales',
                    custId,
                    changeLog
                  );
                  this._snackBar.open('Attachment added successfully', '', {
                    duration: 2000,
                  });
                  this.commonService.updateStatus(false);
                })
                .catch((e) => {
                  // revert the updated size if uploading failed
                  this.uploadAttachmentSizeCust.updateSize(
                    this.superUserId,
                    this.sizeUpdated
                  );
                  this._snackBar.open('Error!!! Attachment not added', '', {
                    duration: 2000,
                  });
                  this.commonService.updateStatus(false);
                });
            }
            if (form == 'service') {
              this.servicedetailsService
                .attachmentsToCollection(
                  this.superUserId,
                  otherId,
                  custId,
                  str,
                  downloadURL,
                  filePath,
                  date,
                  size,
                  this.userLastName
                    ? this.userName + ' ' + this.userLastName
                    : this.userName
                )
                .then((res) => {
                  this.fulllayoutservice.updateChangeLog(
                    this.superUserId,
                    'services',
                    custId,
                    changeLog
                  );
                  this._snackBar.open('Attachment added successfully', '', {
                    duration: 2000,
                  });
                  this.commonService.updateStatus(false);
                })
                .catch((e) => {
                  // revert the updated size if uploading failed
                  this.uploadAttachmentSizeCust.updateSize(
                    this.superUserId,
                    this.sizeUpdated
                  );
                  this._snackBar.open('Error!!! Attachment not added', '', {
                    duration: 2000,
                  });
                  this.commonService.updateStatus(false);
                });
            }
            if (form === 'org') {
              this.orgDetailsService
                .attachmentsToCollection(
                  this.superUserId,
                  custId,
                  str,
                  downloadURL,
                  filePath,
                  date,
                  this.userLastName
                    ? this.userName + ' ' + this.userLastName
                    : this.userName,

                  size
                )
                .then((res) => {
                  this.fulllayoutservice.updateChangeLog(
                    this.superUserId,
                    'Organisations',
                    custId,
                    changeLog
                  );
                  this._snackBar.open('Attachment added successfully', '', {
                    duration: 2000,
                  });
                  this.commonService.updateStatus(false);
                })
                .catch((e) => {
                  // revert the updated size if uploading failed
                  this.uploadAttachmentSizeCust.updateSize(
                    this.superUserId,
                    this.sizeUpdated
                  );
                  this._snackBar.open('Error!!! Attachment not added', '', {
                    duration: 2000,
                  });
                  this.commonService.updateStatus(false);
                });
            }
            if (form === 'tasks') {
              this.uploadAttachmentSizeTask
                .attachmentsToCollection(
                  this.superUserId,
                  custId,
                  str,
                  downloadURL,
                  filePath,
                  date,
                  name,
                  size
                )
                .then((res) => {
                  this.uploadAttachmentSizeTask.updateSize(
                    this.superUserId,
                    newSize
                  );
                  this.fulllayoutservice.updateChangeLog(
                    this.superUserId,
                    'tasks',
                    custId,
                    changeLog
                  );
                  // this._snackBar.open('Attachment added successfully', '', {
                  //   duration: 2000,
                  // });
                  this.commonService.updateStatus(false);
                })
                .catch((e) => {
                  // this._snackBar.open('Error!!! Attachment not added', '', {
                  //   duration: 2000,
                  // });
                  this.commonService.updateStatus(false);
                });
            }
            if (form === 'Expenses') {
              this.expenseService
                .attachmentsToCollection(
                  this.superUserId,
                  custId,
                  str,
                  downloadURL,
                  filePath,
                  date,
                  name,
                  size
                )
                .then((res) => {
                  this.uploadAttachmentSizeTask.updateSize(
                    this.superUserId,
                    newSize
                  );
                  this._snackBar.open('Attachment added successfully', '', {
                    duration: 2000,
                  });
                  this.commonService.updateStatus(false);
                })
                .catch((e) => {
                  this._snackBar.open('Error!!! Attachment not added', '', {
                    duration: 2000,
                  });
                  this.commonService.updateStatus(false);
                });
            }
          } else {
            // revert the updated size if uploading failed
            this.uploadAttachmentSizeCust.updateSize(
              this.superUserId,
              this.sizeUpdated
            );
          }
          this.fileUploading = false;
        })
      )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();

    this.snapshot = task.snapshotChanges().pipe(
      finalize(async () => {
        this.downloadUrl = await ref.getDownloadURL().toPromise();
      })
    );
  }
  //uploading function for custom Document
  uploadCustomDocument(
    filePath,
    file,
    custId,
    str,
    uploadedDate,
    uploadedBy,
    size,
    newSize,
    customDocIdentifier,
    form,
    otherId,
    changeLog,
    currentDocument
  ) {
    this.sizeUpdated = newSize - size;
    this.commonService.updateStatus(true);
    this.fileUploading = true;
    // this.uploadShow=true;
    let downloadURL;
    const task = this.storage.upload(filePath, file);

    const ref = this.storage.ref(filePath);
    this.uploadProgress$ = task.percentageChanges();

    task
      .snapshotChanges()
      .pipe(
        finalize(async () => {
          downloadURL = await ref.getDownloadURL().toPromise();
          if (downloadURL) {
            this.fulllayoutservice
              .documentToCollection(
                this.superUserId,
                custId,
                str,
                downloadURL,
                filePath,
                uploadedDate,
                uploadedBy,
                size,
                customDocIdentifier,
                form,
                changeLog
              )
              .then((res) => {
                this.uploadAttachmentSizeTask.updateSize(
                  this.superUserId,
                  newSize
                );
                this._snackBar.open('Document added successfully', '', {
                  duration: 2000,
                });
                this.commonService.updateStatus(false);
              })
              .catch((e) => {
                this._snackBar.open('Error!!! Document not added', '', {
                  duration: 2000,
                });
                this.commonService.updateStatus(false);
              });
            // }
          } else {
            // revert the updated size if uploading failed
            this.uploadAttachmentSizeCust.updateSize(
              this.superUserId,
              this.sizeUpdated
            );
          }
          this.fileUploading = false;
        })
      )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();

    this.snapshot = task.snapshotChanges().pipe(
      finalize(async () => {
        this.downloadUrl = await ref.getDownloadURL().toPromise();
      })
    );
  }
  uploadComplete() {
    this.fileUploading = false;
  }
  getBranches(userId) {
    return new Promise<void>((resolve) => {
      this.fulllayoutservice
        .getBranches(userId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.branches = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Branch;
          });
          resolve();
        });
    });
  }
  uploadCustomerFromFullLayout(fileInput: any) {
    this.csvUploading = true;

    this.fulllayoutservice.uploadedRec = 0; //ensure 0 while function starts to execute
    this.fulllayoutservice.progressCSV = 0; //ensure 0 while function starts to execute
    this.fulllayoutservice.rejCount = 0; //ensure 0 while function starts to execute
    this.fulllayoutservice.showCloseBtn = false; //close button for div is showing only after uploading is completed

    // check for duplicate contact number or duplicate email or duplicate alternate number is
    this.duplicateEmailArray = []; //ensure empty before function execution
    this.duplicateContNoArray = [];//ensure empty before function execution
    this.duplicateAltContNoArray = [];//ensure empty before function execution
    this.emailPresent = false; //ensure false before function execution
    this.contactNoPresent = false;//ensure false before function execution
    this.altContNoPresent = false;//ensure false before function execution
    this.fulllayoutservice.rejectedContacts = [];//ensure empty before function execution

    let datePlaced = new Date().getTime();
    this.fileReaded = [];
    //getting uploaded file
    this.fileReaded = fileInput?.target?.files[0];
    var extension = fileInput?.target?.files[0].type;
    var name = fileInput?.target?.files[0].name;
    var ext = name?.split('.')[1];
    if (!this.fileReaded) {
      this.fileReaded = fileInput[0];
      extension = fileInput[0].type;
      name = fileInput[0].name;
      ext = name.split('.')[1];
    }

    if (ext == 'csv') {
      this.eachLines = [];
      let reader: FileReader = new FileReader();
      //reading uploaded file as text
      reader.readAsText(this.fileReaded);
      //loading each rows
      reader.onload = (e) => {
        const csv: string = reader.result as string;
        //getting no: of customers in uploaded csv
        this.csvLine = csv.split('\n').length - 4;
        //calculating total number of customer after upload in this month
        let totalCust =
          this.commonService.customersInMonth * 1 + this.csvLine * 1;
        //checking users plan to limit customers upload
        if (
          this.commonService.planChecked == ProductPlans.FREE &&
          totalCust > docCreationLimits.Contact_monthly_limit
        ) {
          this.csvUploading = false;
          let freeCust = 50 - totalCust;
          //if cutsomer limit exceed then alert popup starts here
          const dialogRef = this.dialog.open(
            UploadCustomerLimitPopupComponent,
            {
              width: 'auto',
              data: {
                uploadNo: this.csvLine,
                currentNo: this.commonService.customersInMonth,
                pendingNo:
                  docCreationLimits.Contact_monthly_limit -
                  this.commonService.customersInMonth,
              },
            }
          );
        }
        //if no limit of customer present
        else {
          let Data = csv;
          let csvDat = Data.split(/\r|\r/);
          if(csvDat.length > 2000){
            this.totalRecExceeded = true;
            csvDat.length = 2001
          }else{
            this.totalRecExceeded = false;
          }
          let allData = csvDat;

          let headers = allData[0].split(',');

          this.totalRec = allData?.length - 1;

          if (headers.length < 25 + this.filteredAdditionalField?.length) {
            this.csvUploading = false;
            this.dialog.open(ConfirmationpopupComponent, {
              width: '400px',
              data: {
                smode: 'templatemismatch',
              },
            });
          } else {
            if (allData.length <= 1) {
              this.csvUploading = false;
              //case of only heading
              this.dialog.open(ConfirmationpopupComponent, {
                width: '400px',
                data: {
                  smode: 'nodatafound',
                },
              });
            } else {
              const format = /[+]+/;
              // this.csvUploading = true;
              let branchPresent = false; //to check if branch is entered/not
              this.commonService.updateCSVStatus(true);
              allData.forEach((val, indexs) => {
                if (indexs > 0) {
                  this.eachLines = [];
                  val.split(/\n/);

                  let data = this.splitCSVButIgnoreCommasInDoublequotes(val);
                  if (data) {
                    this.eachLines.push(data);
                    let currentSeqenceNumber = this.customerSeq;
                    // this.eachLines.pop();
                    if (this.eachLines.length != 0) {
                      this.eachLines.forEach(async (data, i) => {
                        let index = 0;
                        let addiFields = <addFieldsArr>{};
                        for (
                          let l = 0;
                          l < this.filteredAdditionalField.length;
                          l++
                        ) {
                          addiFields[l] = {
                            fieldValue: null,
                          };
                        }

                        this.dataArray = {
                          orgId: null,
                          surname: null,
                          assignedTo: null,
                          assignedToName: null,
                          associatedBranch: null,
                          billingaddress1: null,
                          billingaddress2: null,
                          bpin: null,
                          code: null,
                          custLeadValue: null,
                          companyName: null,
                          collectedAmount: null,
                          contactNo: null,
                          country: null,
                          dateCreated: null,
                          district: null,
                          email: null,
                          firstName: null,
                          followUpFlag: null,
                          taxId: null,
                          pan: null,
                          priority: null,
                          salutation: null,
                          secondName: null,
                          state: null,
                          status: null,
                          unConfirmedSales: null,
                          amountToBeCollected: null,
                          taskOpen: null,
                          sequenceNumber: null,
                          lifeTimeValue: null,
                          totalAmountCollected: null,
                          invoicedAmount: null,
                          isCompany: null,
                          additionalFieldsArr: addiFields,
                          searchTerm: {
                            companyName: '',
                            firstName: '',
                            secondName: '',
                            surname: '',
                          },
                          selectedContactPipeline: 0,
                          altContactCode: null,
                          alternateContactNumber: null,
                          department: null,
                          createdBy: null,
                          inPipeline: null,
                          won: null,
                          lost: null,
                        };

                        this.dataArray.salutation = data[index++]?.replace(
                          /\s/g,
                          ''
                        );
                        this.dataArray.firstName = data[index++]?.replaceAll(
                          '"',
                          ''
                        ); // data carring variables gets incremented for all values ordered in csv
                        this.dataArray.searchTerm.firstName =
                          this.dataArray?.firstName?.toLowerCase();
                        this.dataArray.secondName = data[index++]?.replaceAll(
                          '"',
                          ''
                        );
                        this.dataArray.surname = data[index++]?.replaceAll(
                          '"',
                          ''
                        );
                        let customerN = '';
                        if (
                          this.dataArray?.secondName &&
                          this.dataArray?.surname
                        ) {
                          // if second name & surname is there
                          customerN =
                            this.dataArray?.firstName +
                            ' ' +
                            this.dataArray?.secondName +
                            ' ' +
                            this.dataArray?.surname;
                        } else if (
                          this.dataArray?.secondName &&
                          !this.dataArray?.surname
                        ) {
                          customerN =
                            this.dataArray?.firstName +
                            ' ' +
                            this.dataArray?.secondName; //no surname
                        } else if (
                          !this.dataArray?.secondName &&
                          this.dataArray?.surname
                        ) {
                          customerN =
                            this.dataArray?.firstName +
                            ' ' +
                            this.dataArray?.surname; //no second name
                        } else {
                          customerN = this.dataArray?.firstName; //only firstname
                        }

                        this.dataArray.searchTerm.surname =
                          this.dataArray.surname?.toLowerCase();
                        this.dataArray.companyName = data[index++]?.replaceAll(
                          '"',
                          ''
                        );
                        this.dataArray.billingaddress1 = data[
                          index++
                        ]?.replaceAll('"', '');
                        this.dataArray.billingaddress2 = data[
                          index++
                        ]?.replaceAll('"', '');
                        this.dataArray.district = data[index++]?.replaceAll(
                          '"',
                          ''
                        );
                        this.dataArray.state = data[index++]?.replaceAll(
                          '"',
                          ''
                        );
                        this.dataArray.country = data[index++]?.replaceAll(
                          '"',
                          ''
                        );
                        this.dataArray.bpin = data[index++]?.replaceAll(
                          '"',
                          ''
                        );
                        const countryCode = data[index++];
                        if (format.test(countryCode)) {
                          this.dataArray.code = countryCode
                            ? `${countryCode}`
                            : null;
                        } else {
                          this.dataArray.code = countryCode
                            ? `+${countryCode}`
                            : null;
                        }
                        this.dataArray.contactNo = data[index++];

                        if (this.dataArray.contactNo) {
                          //if contact no present
                          if (
                            this.superUserDetails
                              .duplicateContactNumberDisable === true
                          ) {
                            if (
                              //push to create an array of contact numbers to check duplication
                              this.duplicateContNoArray.includes(
                                this.dataArray.contactNo
                              )
                            ) {
                              this.contactNoPresent = true;
                            } else {
                              this.contactNoPresent = false;
                              this.duplicateContNoArray.push(
                                this.dataArray.contactNo
                              );
                            }
                          } else {
                            this.contactNoPresent = false;
                          }

                          if (
                            this.dataArray.code === '' ||
                            this.dataArray.code === null ||
                            typeof this.dataArray.code === 'undefined'
                          ) {
                            this.dataArray.code = this.superUserDetails
                              .countryCode
                              ? this.superUserDetails.countryCode
                              : '+91';
                          }
                        }

                        this.dataArray.email = data[index++];

                        if (this.dataArray.email) {
                          //if email presetn
                          if (
                            this.superUserDetails.duplicateEmailDisable === true //if duplication check is on
                          ) {
                            if (
                              //push to create an array of emails to check duplication
                              this.duplicateEmailArray.includes(
                                this.dataArray.email
                              )
                            ) {
                              this.emailPresent = true;
                            } else {
                              this.emailPresent = false;
                              this.duplicateEmailArray.push(
                                this.dataArray.email
                              );
                            }
                          } else {
                            this.emailPresent = false;
                          }
                        }

                        this.dataArray.taxId = data[index++];

                        // pipeline and status part starts here
                        const pipelineVal = data[index++];

                        let firstPipeline = this.customerPipelines[0];
                        const pipeline: Pipelines[] =
                          this.customerPipelines?.filter((obj) => {
                            return obj.pipelineName === pipelineVal;
                          });
                        let selCPipeline: Pipelines;
                        if (pipeline.length > 0) {
                          selCPipeline = pipeline[0];
                        } else {
                          selCPipeline = firstPipeline;
                        }
                        this.dataArray.selectedContactPipeline =
                          selCPipeline.pipelineId;

                        if (!this.commonService.userPlan.multiPipelineAccess) {
                          this.dataArray.selectedContactPipeline = this.customerPipelines[0].pipelineId;
                        }
                        this.statusArray = selCPipeline.pipelineStages;
                        const statusVal = data[index++];
                        var result = selCPipeline.pipelineStages.filter(
                          (obj) => {
                            return obj.name === statusVal;
                          }
                        );
                        const statusObj = result[0];

                        this.dataArray.status = statusObj
                          ? statusObj.stageId
                          : selCPipeline.pipelineStages[0].stageId;

                        //if no status given in csv setting first status as default

                        if (!this.dataArray.status) {
                          this.dataArray.status = this.statusArray[0];
                        }
                        const stageHistory: StageHistoryModel[] = []
                        let newHistory:StageHistoryModel = {
                          date: new Date().getTime(),
                          stageId: this.dataArray.status,
                          pipelineId: this.dataArray.selectedContactPipeline,
                        };
                        stageHistory[0] = newHistory;
                        // pipeline and status part ends here

                        this.dataArray.priority = data[index++];
                        this.dataArray.assignedTo = data[index++];
                        if (
                          this.commonService.userPlan.branchEnabled &&
                          this.branches.length > 0
                        ) {
                          const assBranch = data[index++]?.replaceAll('"', '');

                          const associatedBranchId = this.branches.find(
                            (item) => item.name === assBranch
                          )?.id;
                          if (associatedBranchId) {
                            this.dataArray.associatedBranch =
                              associatedBranchId;
                            branchPresent = true; //if branch present, check for branch id with the given branch name
                          } else {
                            branchPresent = false;
                            this.dataArray.associatedBranch = 'NA'; //if no branch is assigned then assign 'NA'
                          }
                        }
                        this.dataArray.custLeadValue = data[
                          index++
                        ]?.replaceAll('"', '');
                        const altCountryCode = data[index++];

                        if (format.test(altCountryCode)) {
                          this.dataArray.altContactCode = altCountryCode
                            ? `${altCountryCode}`
                            : null;
                        } else {
                          this.dataArray.altContactCode = altCountryCode
                            ? `+${altCountryCode}`
                            : null;
                        }

                        // this.dataArray.altContactCode = data[index++];
                        this.dataArray.alternateContactNumber = data[index++];

                        // test starts here
                        if (this.dataArray.alternateContactNumber) {
                          //if alt cont no present
                          if (
                            this.superUserDetails
                              .duplicateAlternateContactNumberDisable === true
                          ) {
                            if (
                              //push to create an array of contact numbers to check duplication
                              this.duplicateAltContNoArray.includes(
                                this.dataArray.alternateContactNumber
                              )
                            ) {
                              this.altContNoPresent = true;
                            } else {
                              this.altContNoPresent = false;
                              this.duplicateAltContNoArray.push(
                                this.dataArray.alternateContactNumber
                              );
                            }
                          } else {
                            this.altContNoPresent = false;
                          }

                          if (
                            this.dataArray.code === '' ||
                            this.dataArray.code === null ||
                            typeof this.dataArray.code === 'undefined'
                          ) {
                            this.dataArray.code = this.superUserDetails
                              .countryCode
                              ? this.superUserDetails.countryCode
                              : '+91';
                          }
                        }
                        // test ends here

                        if (this.dataArray.alternateContactNumber) {
                          if (
                            this.dataArray.altContactCode === '' ||
                            this.dataArray.altContactCode === null ||
                            typeof this.dataArray.altContactCode === 'undefined'
                          ) {
                            this.dataArray.altContactCode = this
                              .superUserDetails.countryCode
                              ? this.superUserDetails.countryCode
                              : '+91';
                          }
                        }
                        this.dataArray.department = data[index++]?.replaceAll(
                          '"',
                          ''
                        );
                        this.dataArray.dateCreated = data[index++];

                        const nextFollDate = data[index++]; //next followup date

                        let additionalFields = <addFieldsArr>{};
                        for (
                          let x = 0;
                          x < this.superUserDetails.customFieldsContact?.length;
                          x++
                        ) {
                          if (
                            this.superUserDetails.customFieldsContact[x]
                              .isActive === true
                          ) {
                            let currentValue;
                            currentValue = data[index++]?.replaceAll('"', '');

                            if (
                              typeof currentValue !== 'undefined' &&
                              currentValue !== '' &&
                              currentValue !== null
                            ) {
                              if (
                                this.superUserDetails.customFieldsContact[x]
                                  .fieldType === 'date'
                              ) {
                                // starts here

                                const str = currentValue;

                                if (str.includes('/')) {
                                  const [day, month, year] = str.split('/');
                                  const date = new Date(
                                    +year,
                                    +month - 1,
                                    +day
                                  );
                                  additionalFields[x] = {
                                    fieldValue: date,
                                  };
                                } else if (str.includes('-')) {
                                  const [day, month, year] = str.split('-');
                                  const date = new Date(
                                    +year,
                                    +month - 1,
                                    +day
                                  );
                                  additionalFields[x] = {
                                    fieldValue: date,
                                  };
                                } else {
                                  //not in dd/mm/yyyy or dd-MM-yyyy format
                                  additionalFields[x] = {
                                    fieldValue: null,
                                  };
                                }

                                // ends here
                              } else if (
                                this.superUserDetails.customFieldsContact[x]
                                  .fieldType == 'date_time'
                              ) {
                                let xx = currentValue.split(' ');

                                // date field
                                const str = xx[0];
                                const timeField = xx[1] ? xx[1] : '00:00';
                                const timeFieldSplit = timeField?.split(':');
                                let hoursTime = timeFieldSplit[0];
                                const minTime = timeFieldSplit[1]
                                  ? timeFieldSplit[1]
                                  : 0;
                                const secTime = timeFieldSplit[2]
                                  ? timeFieldSplit[2]
                                  : 0;
                                const amPm = xx[2];
                                if (amPm && amPm !== '12') {
                                  if (
                                    amPm === 'PM' ||
                                    amPm === 'Pm' ||
                                    amPm === 'pm'
                                  ) {
                                    hoursTime = +hoursTime + 12;
                                  }
                                } else if (amPm && amPm == '12') {
                                  if (
                                    amPm === 'AM' ||
                                    amPm === 'Am' ||
                                    amPm === 'am'
                                  ) {
                                    hoursTime = 0;
                                  }
                                }

                                if (str.includes('/')) {
                                  const [day, month, year] = str.split('/');
                                  const date = new Date(
                                    +year,
                                    +month - 1,
                                    +day,
                                    +hoursTime,
                                    +minTime,
                                    +secTime
                                  );

                                  additionalFields[x] = {
                                    fieldValue: date,
                                  };
                                } else if (str.includes('-')) {
                                  const [day, month, year] = str.split('-');
                                  const date = new Date(
                                    +year,
                                    +month - 1,
                                    +day,
                                    +hoursTime,
                                    +minTime,
                                    +secTime
                                  );

                                  additionalFields[x] = {
                                    fieldValue: date,
                                  };
                                } else {
                                  //not in dd/mm/yyyy or dd-MM-yyyy format
                                  additionalFields[x] = {
                                    fieldValue: null,
                                  };
                                }
                              } else {
                                //not date addi fields
                                additionalFields[x] = {
                                  fieldValue: currentValue,
                                };
                              }
                            } else {
                              additionalFields[x] = {
                                fieldValue: null,
                              };
                            }
                          } else {
                            additionalFields[x] = {
                              fieldValue: null,
                            };
                          }
                          //setting additional field values array to dataArray
                          this.dataArray.additionalFieldsArr = additionalFields;
                        }

                        if (this.lostArray.includes(this.dataArray.status)) {
                          this.dataArray.lost = true;
                          this.dataArray.won = false;
                          this.dataArray.inPipeline = false;
                        } else if (
                          this.wonArray.includes(this.dataArray.status)
                        ) {
                          this.dataArray.lost = false;
                          this.dataArray.won = true;
                          this.dataArray.inPipeline = false;
                        } else {
                          this.dataArray.lost = false;
                          this.dataArray.won = false;
                          this.dataArray.inPipeline = true;
                        }

                        //if company in csv company check is given as true
                        if (this.dataArray.companyName) {
                          this.dataArray.isCompany = true;
                          this.dataArray.searchTerm.companyName =
                            this.dataArray.companyName.toLowerCase();
                        } else {
                          this.dataArray.isCompany = false;
                          this.dataArray.companyName = 'Individual';
                          this.dataArray.searchTerm.companyName =
                            this.dataArray.companyName.toLowerCase();
                        }

                        //if second name is null in csv
                        if (!this.dataArray.secondName) {
                          this.dataArray.secondName = '';
                        } else {
                          this.dataArray.searchTerm.secondName =
                            this.dataArray.secondName.toLowerCase();
                        }

                        //if priority field is empty in csv
                        if (!this.dataArray.priority) {
                          this.dataArray.priority = 'Medium';
                        }
                        //for finding the assigned to name
                        if (this.dataArray.assignedTo) {
                          const allSubUsers = this.commonService.createUserlist(
                            'All',
                            'any'
                          )[1];

                          //looping to check userid through subusers list
                          for (let i = 0; i < allSubUsers.length; i++) {
                            //checking id is same as uploaded
                            if (
                              allSubUsers[i].userId == this.dataArray.assignedTo
                            ) {
                              this.dataArray.assignedToName = allSubUsers[i]
                                .lastname
                                ? allSubUsers[i].firstname +
                                  ' ' +
                                  allSubUsers[i].lastname
                                : allSubUsers[i].firstname;

                              if (
                                !!this.branches &&
                                this.branches.length !== 0 &&
                                typeof this.branches !== 'undefined' &&
                                this.branches !== null &&
                                branchPresent === false //if no branch is already assigned, then assigned to users branch is taken
                              ) {
                                this.dataArray.associatedBranch = allSubUsers[i]
                                  .branchId
                                  ? allSubUsers[i].branchId
                                  : 'NA';
                              }
                            }
                          }
                          //if no user name is able to attach using given id
                          if (!this.dataArray.assignedToName) {
                            //setting uploader as assigned to and uploaders name
                            this.dataArray.assignedTo = this.userId;

                            this.dataArray.assignedToName = this.userSecondName
                              ? this.userFirstName + ' ' + this.userSecondName
                              : this.userFirstName;

                            if (
                              !this.branches ||
                              this.branches.length === 0 ||
                              typeof this.branches === 'undefined' ||
                              this.branches === null
                            ) {
                              this.dataArray.associatedBranch = 'NA';
                            } else if (branchPresent === false) {
                              //if no branch is already assigned, then assigned to users branch is taken
                              const allSubUsers =
                                this.commonService.createUserlist(
                                  'All',
                                  'any'
                                )[1];
                              for (let m = 0; m < allSubUsers.length; m++) {
                                if (allSubUsers[m].userId === this.userId) {
                                  this.dataArray.associatedBranch = allSubUsers[
                                    i
                                  ].branchId
                                    ? allSubUsers[m].branchId
                                    : 'NA';
                                }
                              }
                            }
                          }
                        }
                        //if no assigned to id is given
                        if (!this.dataArray.assignedTo) {
                          //setting uploader as assigned to and uploaders name
                          this.dataArray.assignedTo = this.userId;
                          this.dataArray.assignedToName = this.userDetails
                            .lastname
                            ? this.userDetails.firstname +
                              ' ' +
                              this.userDetails.lastname
                            : this.userDetails.firstname;

                          if (
                            !!this.branches &&
                            this.branches.length !== 0 &&
                            typeof this.branches !== 'undefined' &&
                            this.branches !== null &&
                            branchPresent === false //if no branch is already assigned, then assigned to users branch is taken
                          ) {
                            const allSubUsers =
                              this.commonService.createUserlist(
                                'All',
                                'any'
                              )[1];

                            for (let m = 0; m < allSubUsers.length; m++) {
                              if (allSubUsers[m].userId === this.userId) {
                                this.dataArray.associatedBranch = allSubUsers[m]
                                  .branchId
                                  ? allSubUsers[m].branchId
                                  : 'NA';
                              }
                            }
                          } else {
                            this.dataArray.associatedBranch = 'NA';
                          }
                        }

                        if (!this.dataArray.dateCreated) {
                          this.dataArray.dateCreated = this.dateCreate; //setting to date as uploaded date
                        } else {
                          // starts here

                          const dateInput = this.dataArray.dateCreated + '';

                          if (dateInput.includes('/')) {
                            const [day, month, year] = dateInput.split('/');
                            const dateInp = new Date(+year, +month - 1, +day);
                            this.dataArray.dateCreated = dateInp.getTime();
                          } else if (dateInput.includes('-')) {
                            const [day, month, year] = dateInput.split('-');
                            const dateInp = new Date(+year, +month - 1, +day);
                            this.dataArray.dateCreated = dateInp.getTime();
                          } else {
                            //not in dd/mm/yyyy or dd-MM-yyyy format
                            this.dataArray.dateCreated = null;
                          }

                          // ends here
                        }

                        this.dataArray.createdBy = this.userId;
                        this.dataArray.invoicedAmount = 0; //default values which is not being uploaded
                        this.dataArray.followUpFlag = 0;
                        this.dataArray.totalAmountCollected = 0;
                        this.dataArray.orgId = '';
                        // save to DB after checking duplication in the given file
                        if (
                          this.emailPresent === false &&
                          this.contactNoPresent === false &&
                          this.altContNoPresent === false
                        ) {
                          currentSeqenceNumber = currentSeqenceNumber + 1;
                          this.dataArray.sequenceNumber = currentSeqenceNumber;

                          let changeLog = <changeLogModel>{};
                          changeLog[0] = {
                            changedBy: this.userId,
                            changedByName: this.userLastName
                              ? this.userName + ' ' + this.userLastName
                              : this.userName,
                            changesFrom: 'csvData',
                            dateModified: new Date().getTime(),
                            currentValues: '',
                            previousValues: '',
                          };
                          await this.fulllayoutservice
                            .saveExcel(
                              this.superUserId,
                              this.dataArray,
                              stageHistory,
                              datePlaced,
                              changeLog,
                              this.totalRec,
                              this.superUserDetails.duplicateEmailDisable,
                              this.superUserDetails
                                .duplicateContactNumberDisable,
                              data.length
                            )
                            .then((res) => {
                              if (res) {
                                if (res.id) {
                                  if (!!nextFollDate) {
                                    let nxtFoll = null;
                                    // date field
                                    if (nextFollDate.includes('/')) {
                                      const [dayFoll, monthFoll, yearFoll] =
                                        nextFollDate.split('/');
                                      const dateFoll = new Date(
                                        +yearFoll,
                                        +monthFoll - 1,
                                        +dayFoll
                                      );
                                      nxtFoll = dateFoll;
                                    } else if (nextFollDate.includes('-')) {
                                      const [dayFoll, monthFoll, yearFoll] =
                                        nextFollDate.split('-');
                                      const dateFoll = new Date(
                                        +yearFoll,
                                        +monthFoll - 1,
                                        +dayFoll
                                      );
                                      nxtFoll = dateFoll;
                                    } else {
                                      nxtFoll = null;
                                    }

                                    let callData = {
                                      changeLog,
                                      companyName: this.dataArray.companyName,
                                      completedStatus: false,
                                      customerId: res.id,
                                      customerName: customerN,
                                      callStartDate: nxtFoll,
                                      dateCreated: new Date().getTime(),
                                      notes: null,
                                      callStartTime: '',
                                      outcome: null,
                                      status: 'Scheduled',
                                      direction: 'Outbound',
                                      saleId: '',
                                      saleTitle: '',
                                      serviceId: '',
                                      serviceTitle: '',
                                      additionalFieldsArr: null,
                                      orgId: '',
                                      assignedTo: this.dataArray.assignedTo,
                                      assignedToName:
                                        this.dataArray.assignedToName,
                                      createdBy: this.userId,
                                      associatedBranch:
                                        this.dataArray.associatedBranch === 'NA'
                                          ? 'none'
                                          : this.dataArray.associatedBranch,
                                    };
                                    this.fulllayoutservice.addCall(
                                      this.superUserId,
                                      callData
                                    );
                                  }

                                  this.fulllayoutservice.uploadedRec++;
                                  this.fulllayoutservice.progressCSV =
                                    ((this.fulllayoutservice.uploadedRec +
                                      this.fulllayoutservice.rejectedContacts
                                        .length) /
                                      this.totalRec) *
                                    100;

                                  if (
                                    this.fulllayoutservice.uploadedRec +
                                      this.fulllayoutservice.rejectedContacts
                                        .length ===
                                    this.totalRec
                                  ) {
                                    this.fulllayoutservice.showCloseBtn = true;
                                  }

                                  // test2 ends here
                                }
                              }
                            });
                        } else {
                          // rejected contacts functions
                          if (this.emailPresent === true) {
                            let rejCont: rejectedCont = {
                              reason: 'Email already present',
                              count: this.fulllayoutservice.rejCount,
                            };
                            let element = { ...rejCont, ...this.dataArray };
                            this.fulllayoutservice.rejectedContacts.push(
                              element
                            );
                          } else if (this.contactNoPresent === true) {
                            let rejCont: rejectedCont = {
                              reason: 'Duplicate contact number issue found',
                              count: this.fulllayoutservice.rejCount,
                            };
                            let element = { ...rejCont, ...this.dataArray };
                            this.fulllayoutservice.rejectedContacts.push(
                              element
                            );
                          } else if (this.altContNoPresent == true) {
                            let rejCont: rejectedCont = {
                              reason: 'Alternate contact number already exists',
                              count: this.fulllayoutservice.rejCount,
                            };
                            let element = { ...rejCont, ...this.dataArray };
                            this.fulllayoutservice.rejectedContacts.push(
                              element
                            );
                          }

                          this.fulllayoutservice.rejCount++; // to get the rejected count
                          this.fulllayoutservice.failedCsv = true;

                          this.fulllayoutservice.progressCSV =
                            ((this.fulllayoutservice.uploadedRec +
                              this.fulllayoutservice.rejectedContacts.length) /
                              this.totalRec) *
                            100;

                          if (
                            this.fulllayoutservice.uploadedRec +
                              this.fulllayoutservice.rejectedContacts.length ===
                            this.totalRec
                          ) {
                            this.fulllayoutservice.showCloseBtn = true;
                          }

                          this.emailPresent = false;
                          this.contactNoPresent = false;
                          this.altContNoPresent = false;
                        }

                        // if (i == this.eachLines.length - 1) {

                        //   this._snackBar.open(
                        //     'Some invalid datas neglected while uploading',
                        //     ' ',
                        //     {
                        //       duration: 3000,
                        //     }
                        //   );
                        // }
                        //saving each customer in csv using above datas
                      });

                      this.fulllayoutservice.updateSequenceNumber(
                        this.superUserId,
                        currentSeqenceNumber
                      );

                      fileInput = [];
                      return;
                    }
                  }
                }
              });
            }
          }
        }
      };
    } else {
      this.csvUploading = false;
      this.dialog.open(ConfirmationpopupComponent, {
        width: '300px',
        data: {
          smode: 'typenotcsv',
        },
      });
    }
  }
  closeCsvDiv() {
    this.csvUploading = false;
    this.commonService.updateCSVStatus(false);
  }
  getAllCustomers() {
    return new Promise<void>((resolve) => {
      this.fulllayoutservice
        .getAllCustomers(this.superUserId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.allCustArray = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Customer;
          });

          this.duplicateEmailArray = [];
          this.duplicateContNoArray = [];
          this.duplicateAltContNoArray = [];

          for (let i = 0; i < this.allCustArray.length; i++) {
            if (
              this.allCustArray[i].email &&
              this.allCustArray[i].email !== null &&
              this.allCustArray[i].email !== ''
            ) {
              this.duplicateEmailArray.push(this.allCustArray[i].email);
            }
            if (
              this.allCustArray[i].contactNo &&
              this.allCustArray[i].contactNo !== null &&
              this.allCustArray[i].contactNo !== ''
            ) {
              this.duplicateContNoArray.push(this.allCustArray[i].contactNo);
            }
            if (
              this.allCustArray[i].alternateContactNumber &&
              this.allCustArray[i].alternateContactNumber !== null &&
              this.allCustArray[i].alternateContactNumber !== ''
            ) {
              this.duplicateAltContNoArray.push(
                this.allCustArray[i].alternateContactNumber
              );
            }
          }
          resolve();
        });
    });
  }
  emptyRowCheck(data) {
    let count = 0;
    const lines = data.trim().split(/\s*[\r\n]+\s*/g);

    lines.forEach((line) => {
      if (line.match(/([^\s,])/)) {
        count++;
      }
    });
    return count;
  }
  splitCSVButIgnoreCommasInDoublequotes(str) {
    //split the str first
    //then merge the elments between two double quotes
    var delimiter = ',';
    var quotes = '"';
    var elements = str.split(delimiter);
    var newElements = [];
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].indexOf(quotes) >= 0) {
        //the left double quotes is found
        var indexOfRightQuotes = -1;
        var tmp = elements[i];
        //find the right double quotes
        for (var j = i + 1; j < elements.length; ++j) {
          if (elements[j].indexOf(quotes) >= 0) {
            indexOfRightQuotes = j;
            break;
          }
        }
        //found the right double quotes
        //merge all the elements between double quotes
        if (-1 != indexOfRightQuotes) {
          for (var j = i + 1; j <= indexOfRightQuotes; ++j) {
            tmp = tmp + delimiter + elements[j];
          }
          newElements.push(tmp);
          i = indexOfRightQuotes;
        } else {
          //right double quotes is not found
          newElements.push(elements[i]);
        }
      } else {
        //no left double quotes is found
        newElements.push(elements[i]);
      }
    }

    return newElements;
  }
  closeFailedCsv() {
    this.fulllayoutservice.failedCsv = false;
  }
  downloadFailedCsv() {
    if (this.fulllayoutservice.rejectedContacts?.length > 0) {
      // header starts
      // header starts
      const csvHead = [
        'Count',
        'Reason',
        `${this.contactSettings.firstName.displayName}`,
        `${this.contactSettings.secondName.displayName}`,
        `${this.contactSettings.companyName.displayName}`,
        `${this.contactSettings.alternateContactNumber.displayName}`,
        `${this.contactSettings.billingaddress1.displayName}`,
        `${this.contactSettings.billingaddress2.displayName}`,
        `${this.contactSettings.district.displayName}`,
        `${this.contactSettings.state.displayName}`,
        `${this.contactSettings.country.displayName}`,
        `${this.contactSettings.bpin.displayName}`,
        `Country Code(e.g 91)`,
        `${this.contactSettings.contactNo.displayName}`,
        `${this.contactSettings.email.displayName}`,
        `${this.contactSettings.taxId.displayName}`,
        'Created Date',
        `${this.contactSettings.status.displayName}`,
        `${this.contactSettings.priority.displayName}(Low/Medium/High)`,
        'Lead Source',
        'Invoiced Amount',
        'Collected Amount',
        'Assigned to',
      ];

      //getting field name of all additional field into defaault fields array
      for (let i = 0; i < this.additionalFields?.length; i++) {
        if (this.additionalFields[i].fieldType === 'date') {
          csvHead.push(
            `${this.additionalFields[i].fieldName}(dd/MM/yyyy or dd-MM-yyyy)`
          );
        } else if (this.additionalFields[i].fieldType === 'date_time') {
          csvHead.push(
            `${this.additionalFields[i].fieldName}(dd/MM/yyyy HH:MM:SS or dd-MM-yyyy HH:MM:SS)`
          );
        } else {
          csvHead.push(this.additionalFields[i].fieldName);
        }
      }
      // header ends

      this.csvData = [];
      let additionalField;
      this.fulllayoutservice.rejectedContacts.forEach((data) => {
        if (data.secondName == null) {
          data.secondName = '';
        }
        additionalField = data.additionalFieldsArray;

        let arrayofCustomers: CustomerCsvData = new CustomerCsvData(
          data.count,
          data.reason,
          data.firstName,
          data.secondName,
          data.companyName,
          data.alternateContactNumber,
          data.billingaddress1,
          data.billingaddress2,
          data.district,
          data.state,
          data.country,
          data.bpin,
          data.code,
          data.contactNo,
          data.email,
          data.taxId,
          new Date(data.dateCreated).toLocaleString(),
          data.priority,
          data.status,
          data.leadSource,
          data.invoicedAmount,
          data.totalAmountCollected,
          data.assignedToName
        );
        if (additionalField != undefined && additionalField?.length != 0) {
          for (let i = 0; i < this.fieldListArray?.length; i++) {
            if (this.fieldListArray[i].isActive) {
              if (this.fieldListArray[i].fieldType == 'date') {
                arrayofCustomers[eval('this.fieldListArray[i].fieldName')] =
                  additionalField[i];
              } else {
                arrayofCustomers[eval('this.fieldListArray[i].fieldName')] =
                  additionalField[i];
              }
            }
          }
        }

        this.csvData.push(arrayofCustomers);
      });

      const replacer = (key, value) => (value === null ? '' : value);
      let header = Object.keys(this.csvData[0]);
      let csv = this.csvData.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(',')
      );
      csv.unshift(csvHead.join(','));
      let csvArray = csv.join('\r\n');

      var blob = new Blob([csvArray], { type: 'text/csv' });
      saveAs(blob, 'contactFailedUpload.csv');
    } else {
      this._snackBar.open('No Data to download', '', {
        duration: 2000,
      });
    }
    this.fulllayoutservice.failedCsv = false;
  }
  onCreateFollowUp() {
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: '748px',
      disableClose: true,
      data: {
        scenario: 'customerSelectFollowUp',
      },
      autoFocus: false,
      restoreFocus: false,
    });
  }
  //triggered while adding a task
  addTask() {
    this.dialog.open(CrudModal1Component, {
      width: '520px',
      height: 'auto',
      disableClose: true,
      data: {
        id: '',
        mode: 'create',
      },
    });
  }
  getCallPopUp(superUserId, userId) {
    this.fulllayoutservice
      .getNotifyFollowUp(superUserId, userId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((followupData) => {
        let doc = followupData.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as FollowUps;
        });
        if (doc.length > 0 && !this.popUpOpen) {
          this.popUpOpen = true;
          const dialogRef = this.dialog
            .open(CallViewPopUpComponent, {
              width: '500px',
              data: doc,
            })
            .afterClosed()
            .subscribe((res) => {
              this.popUpOpen = false;
            });

          if (this.popUpOpen) {
            doc.forEach((element) => {
              this.fulllayoutservice.UpdateFollowupNotified(
                this.superUserId,
                element.id
              );
            });
          }
        }
      });
  }

  showSearch() {
    this.search = true;
    this.panelOpenState = true;
  }
  // update lite mode selction
  enableLiteModeUpdate() {
    this.enableLiteMode = !this.enableLiteMode;
    this.fulllayoutservice.updateEnableLiteMode(
      this.userId,
      this.enableLiteMode
    ).then((result)=>{
        window.location.reload();
    })
  }
  onContactTableRoute() {
    if (this.enableLiteMode) {
      this.router.navigate(['/dash/customer-list']);
    } else {
      this.router.navigate(['/dash/contact/customerlist']);
    }
  }
  onFollowupTableRoute() {
    if (this.enableLiteMode) {
      this.router.navigate(['/dash/followup-lite']);
    } else {
      this.router.navigate(['/dash/followuplist']);
    }
  }
  onTaskTableRoute() {
    if (this.enableLiteMode) {
      this.router.navigate(['/dash/task-list']);
    } else {
      this.router.navigate(['/dash/tasks']);
    }
  }
  onEstimateTableRoute() {
    if (this.enableLiteMode) {
      this.router.navigate(['/dash/documents-list/estimatelist']);
    } else {
      this.router.navigate(['/dash/estimate-table']);
    }
  }
}
