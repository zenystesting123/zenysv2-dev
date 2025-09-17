/**********************************************************************************
Description: Component is used to display sales details of a particular Sale
             add and edit priority, status, assigned to, sale documents, collection,
             task, attachment, expenses, email associated with this contact
             For Mobile and Web
Input : UserData and superuser data from common service
CHILDREN :
1. bottom-sheet-sales-document.html
   Description:In mobile bottom sheet to select which sales document should be created
   Input : SaleId and CustomerId
   Output :
2. confirm-assignedto.html
   Description: Popup in web and mobile to change assigned to field of particular sale
   Input : Assigned to name  to be updated
   Output :
3. sales-add-product.html
   Description: Popup in web to add product under products and services
   Input : scenario, userid, superuserid and account type, and product details in edit scenario
   Output :
4. sales-task.html : (need to remove and use task board CRUD itself)
   Description: Popup in web to update task and add comments under task associated with this Sale
   Input : all data associated with the task
   Output : updated task
**********************************************************************************/
import { Expenses1Component } from '../../expenses1/expenses1.component';
import {
  Sales,
  PaymentReceipt,
  Profile,
  Invoice,
  Attachments,
  SalesNotes,
  Task,
  paymentDetails,
  Expenses,
  ProductModel,
  ProductUnits,
  ProductInSaleModel,
  UserAccessDetails,
  PlanDocLimit,
  addFieldsArr,
  FollowUps,
  ProductCategories,
  SubUsers,
  ProductSettings,
  itemMax,
  defaultProductSettings,
  defaultSaleSettings,
  saleSettings,
  messageTemplateModel,
  CustomerNotes,
  taskSettings,
  defaultTaskSettings,
  deleteLogModel,
  taggedUsers,
  defaultPaymentSettings,
  paymentSettings,
  expenseSettings,
  defaultExpenseSettings,
  tagUsers,
  shareAttOrDocLink,
  defaultContactSettings,
  contactSettings,
} from '../../data-models';
import { Paymentreceipt1Component } from '../../paymentreceipt1/paymentreceipt1.component';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { SalesdetailsService } from './salesdetails.service';
import { Addnewsale1Component } from '../../addnewsale1/addnewsale1.component';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ChangesaleprioritydialogComponent } from '../../changesaleprioritydialog/changesaleprioritydialog.component';
import { ChangesalestatdialogComponent } from '../../changesalestatdialog/changesalestatdialog.component';
import { CrudModal1Component } from '../../taskboard/crud-modal1/crud-modal1.component';
import * as firebase from 'firebase';
import { finalize, map, startWith, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { DOCUMENT } from '@angular/common';
import { ConfirmationpopupComponent } from '../../confirmationpopup/confirmationpopup.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { ComposemailComponent } from '../../gmail/composemail/composemail.component';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, NgForm } from '@angular/forms';
import { NetworkCheckService } from '../../networkcheck.service';

// import { BottomSheetPaymentUpdateComponent } from '../../bottom-sheet-payment-update/bottom-sheet-payment-update.component';
import { CommonService } from 'src/app/common.service';
import { Currencies } from 'src/app/currencies';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { GoogleCalendarEventService } from 'src/app/calendar-events/google-calendar-event.service';

import { FullLayoutComponent } from 'src/app/full-layout/full-layout.component';
import { ServiceDetailsService } from 'src/app/service-module/service-details/service-details.service';
import { FollowupTaskCreateComponent } from 'src/app/followup-task-create/followup-task-create.component';
import { CallViewAudioPlayerComponent } from 'src/app/call-view-audio-player/call-view-audio-player.component';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { Pipelines } from 'src/app/model/pipeline.modal';

export interface ExpensesData {
  docId: any;
  moduleName: any;
  changeLog: any;
  componentName: string;
  orgId: any;
  cid: string;
  sid: string;
  mode: string;
  saleTitle: string;
  csname: string;
  cfname: string;
  company: string;
  expenseId: string;
} //data model to send for expense popup and bottomsheet
export interface DialogData1 {
  docId: string;
  moduleName: string;
  componentName: string;
  saleTitle: any;
  customerId: string;
  saleId: string;
  mode: string;
  paymentId: string;
  customerName: string;
  company: string;
  customerSecondName: string;
  orgId: string;
  changeLog: any;
} //data model to send for payment popup and bottomsheet

@Component({
  selector: 'app-salesdetails',
  templateUrl: './salesdetails.component.html',
  styleUrls: ['./salesdetails.component.scss'],
  animations: [
    trigger('FlyIn', [
      transition('void=>*', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate('100ms'),
      ]),
      transition('*=>void', [
        animate('100ms', style({ opacity: 0, transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
})
export class SalesdetailsComponent implements OnInit {
  @ViewChild('file') file;
  parentSubject: Subject<any> = new Subject(); //for email
  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.

  customerId: string; //customer id w.r.t sale
  orgId: string; //org Id w.r.t sale
  saleId = this.route.snapshot.paramMap.get('saleId');
  spinner: boolean = true;
  taskDetails: paymentDetails = {
    id: null,
    saleId: null,
    mode: null,
    custId: null,
    userId: null,
    custFname: null,
    custSname: null,
    saleTitle: null,
    custComp: null,
    smode: null,
    serviceId: '',
    serviceTitle: '',
    additionalFieldsArr: [],
  }; //data model to send for popups and bottomsheets of collection
  profitAmount: number; //profit amount
  sale: Observable<Sales>; //used to display in HTML with async operator
  uploadProgress$: Observable<number>; //attachment upload progress
  uploadReset: Observable<number>; //attachment upload progress in number
  saleValue: number = 0; //estimated value of sale
  expenseAmount: number = 0; //expense amount of this particular sale
  task: AngularFireUploadTask; //to upload attachment
  tasks: firebase.default.storage.UploadTask; //to upload attachment
  invoicedAmount: number; //invoiced amount of this particular sale
  collectedAmount: number; //collected amount of this particular sale
  quotations: Invoice[]; //quotations associated with this particular sale
  estimates: Invoice[]; //estimates associated with this particular sale
  expenses: Expenses[]; //expenses associated with this particular sale
  attachments: Attachments[]; //attachments associated with this particular sale
  paymentReceipts: PaymentReceipt[]; //collections associated with this particular sale
  invoices: Invoice[]; //invoices associated with this particular sale
  createDate: any; //created date under super user profile
  downloadURL: Observable<string>; //to upload attachment
  dataAccessRule: string = ''; //logged in users data access rule
  superUserId: string = ''; //logged in users super user id
  userRole: string = ''; //logged in users user role
  accountType: string = ''; //logged in users account type
  userId: string = ''; //logged in users id
  fileBeingUploaded: boolean = false;
  // layout checks
  isTabletsize: boolean = false;
  isMobilesize: boolean = false;
  dragAreaClass: string;
  progressBarStatus: boolean = false;
  estimateAmount: number; //estimated amount with this particular sale
  customerfirstname: string = ''; //first name of customer having this particular sale
  customersecondname: string = ''; //last name of customer having this particular sale
  customersurname: string = ''; //surname of customer having this particular sale
  company: string = ''; //company of customer having this particular sale

  // additional filed variables
  additionalFields: any[];
  filteredAdditionalField: any = []; // to hold only active custom fields
  addFieldArrModel: addFieldsArr = {
    fieldValue: null,
  };
  fieldListArray = [this.addFieldArrModel];

  taskss: Task[]; //open tasks associated with this particular sale
  tasksAll: Task[]; //all tasks associated with this particular sale
  saleName: string; //sale title
  saleStatus: any; //sale status array under super user profile
  attachmentSize: any; //totla attachment size allowed under super user profile
  customerName: string = ''; //customer name associated with this aprticular sale
  plan: any; //plan under super user profile

  dataSource: any; //collection table datasource
  dataSources: any; //expense table data source
  displayedColumns: string[] = [
    'Date',
    'Invoice No',
    'Payment Mode',
    'Amount',
    'edit',
  ]; //collection table columns

  dataSourceAtt: any; //attachment table datasource
  displayedColumnAtt: string[] = [
    'Date',
    'Filename',
    'Uploaded',
    'Shared',
    'edit',
  ]; //attachment table column

  dataSourceTask: any; //task table data source
  displayedColumnTask: string[] = [
    'title',
    'dueDate',
    'priority',
    'assignedTo',
    'status',
    'actions',
  ]; //task table columns

  items: ProductInSaleModel[] = []; //products array under products collection under sale
  dataSourceitems: any; //products and services table data source
  displayedColumnItems: string[] = [
    'prodName',
    'hsnCode',
    'currency',
    'unitPrice',
    'unit',
    'quantity',
    'discount',
    'actions',
  ]; //products and services table columns

  userName: string = ''; //logged in user's name
  saleNotes: any[]; //array of sale notes
  user: firebase.default.UserInfo; //authentication info
  isHovering: boolean; //for drag and drop attachment
  networkConnection: boolean; //network check

  // based on access control settings disable corresponding view, edit, create and sale
  disableViewContact: boolean = false;
  disableSaleView: boolean = false;
  disableSaleEdit: boolean = false;
  disableDoc: boolean = false; //disable sales doc creation
  disableDocView: boolean = false;
  disableDocEst: boolean = false; //disable Sales Doc view
  disableDocCreateEst: boolean = false; //disable Sales Doc view
  disableDocQuot: boolean = false; //disable Sales Doc view
  disableDocCreateQuot: boolean = false; //disable Sales Doc view
  disableDocInv: boolean = false; //disable Sales Doc view
  disableDocCreateInv: boolean = false; //disable Sales Doc view
  disableColl: boolean = false; //create collection disable
  disableCollView: boolean = false;
  disableCollEdit: boolean = false;
  disableExp: boolean = false; //add Expense disable
  disableExpView: boolean = false;
  disableExpEdit: boolean = false;
  disableNotes: boolean = false; //create notes disable
  disableNotesView: boolean = false;
  disableNotesEdit: boolean = false;
  disableAtt: boolean = false; //add attachemnt disabling
  disableAttView: boolean = false;
  disableAttRemove: boolean = false;
  disableItemsView: boolean = false;
  disableItemsCreate: boolean = false;
  disableItemsEdit: boolean = false;
  disableItemsDelete: boolean = false;
  usrProfileData: UserAccessDetails = null; //access control settings from common service
  uploadFileLimit: any = [];
  custData: any; //customer details associated with this sale
  satusToSend: string = ''; //for edit, to send stage from parent
  stageHistoryToSend: any = null; //for edit, to send stage history from parent
  superUserName: string; //logged in user super user name
  activetab: any; //for mat-tab click events, to check active tab
  saleAssignedToName: string; //sale assigned to name
  subUsers = []; //subuser array
  assignedArray = []; //array created using subusers and supoer user for select options of assigned to
  saleToedit: Sales = null; //sale to edit to send to common service
  totalUserCount: number = 1;
  totalUploadLimit: number;
  currentlyUploaded: number;
  uploadPercentage: number;
  currentPlan: string;
  orderWonCheck = false; //to confirm products while changing to sale completed stage
  customerNote: CustomerNotes; //single editing customer note

  private taskSubscription: Subscription;
  private allTasksSubscription: Subscription;
  private attachmentSubscription: Subscription;
  private notesSubscription: Subscription;
  private expenseSubscription: Subscription;
  private collectionSubscription: Subscription;
  private EstSubscription: Subscription;
  private QuoteSubscription: Subscription;
  private InvSubscription: Subscription;
  private custSubscription: Subscription;
  private productsSubscription: Subscription;
  private commonServSubscription: Subscription;

  superUserDetails: Profile = null; //super user details

  // customisable field names
  fieldNameContact: string = 'Contact';
  fieldNameSale: string = 'Sale';
  fieldNameTask: string = 'Task';
  fieldNameMeeting: string = 'Meeting';
  fieldNameEstimate: string = 'Estimate';
  fieldNameQuotation: string = 'Quotation';
  fieldNameInvoice: string = 'Invoice';
  fieldNameCollection: string = 'Collection';
  fieldNameExpense: string = 'Expense';
  fieldNameItems: string = 'Products and Service';
  fieldNameSaleNotes: string = 'Note';
  fieldNameFollowup: string = 'FollowUP';

  initClientSubscription: Subscription;
  allFollowUp: FollowUps[]; //all followups
  enableOutboundCallsViaCallBridging: boolean = false;
  callBridgingServiceProvider: string;
  contactNumber: string = '';
  altContactNumber: string = '';
  userNumber: string;
  autoCallToken: string = '';
  saleAssignedTo: string; //service assigned to id
  nextFollowUp: FollowUps[]; //next followup
  followUps: FollowUps[] = [];

  prodCatArray: string[] = [];
  disableFollView: boolean = false;
  disableFoll: boolean = false; //create followups disable
  disableFollEdit: boolean = false;
  allSubUsers: SubUsers[] = [];
  disableReAssign = false;
  changeLog: any = {};
  priority: string;
  assignedTo: string;
  assignedToName: string;
  itemsQtyDisplay: boolean; //whether to diaply qty of products
  maxItems: number = itemMax.MAX_ITEM; //max items that can be added with a slae
  viewCheck: boolean = false; //if single details page view is accessible
  viewCheckTagged = false; //boolean to control users view access: no view access in normal case, but view is enabled by tagging
  productSettings: ProductSettings = defaultProductSettings.CONST_VALUE; //customisable fields
  saleSettings: saleSettings = defaultSaleSettings.CONST_VALUE; //customisable fields
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  taskSettings: taskSettings = defaultTaskSettings.CONST_VALUE;
  paymentSettings: paymentSettings = defaultPaymentSettings.CONST_VALUE; //default payment settings values
  expenseSettings: expenseSettings = defaultExpenseSettings.CONST_VALUE; //default expense settings values
  navSelected: string = 'Info';
  associatedBranch = ''; //current branch
  prevAssBranch = ''; //previous branch
  branches = []; //branches of users
  prevNote: any;
  currentStage: string;
  itemsArray: any; //to hold the product field of sales details doc
  deletedProducts: any = {};
  addedProducts: any = {};
  saleWaTemp: messageTemplateModel[] = []; //to hold the fetched sale whatsapp message templates
  userEmail = ''; //holds email of logged in user
  DIDNumber: string = '';

  //custom pipe to implement sorting of data wrt date modified in changeLog
  propName = 'dateModified'; //property for sorting
  allFolowupSubscription: Subscription; // for closing all followupsubscription
  customsort = (a, b) => {
    //returns the greater date first
    return Number(b.value[this.propName]) - Number(a.value[this.propName]);
  };
  lastNoteId: string; //id of last note
  taggedUserArray: taggedUsers[] = []; //tagged users array stored under sales doc
  taggedUserIdArray: string[] = []; //array holding only userId s of tagged users
  disableTaskAdd = false; //disable task add option for tagged user
  disableTaskEdit = false; //disable task edit option for tagged user
  taskStatusOptions: any = []; // for holding task status
  lastStatusOption: any; //get last status
  taskDefaultOpn: any[] = ['Open', 'Completed'];

  filteredOptions: taggedUsers[] = []; //filtered taggedUsers list
  searchTerm = ''; //input entry to search in tag users
  mailChoosen: string = ''; //to choose the mail to use
  listDocument: any[] = [];
  customDocuments: any[] = []; //custom uploadDOcuments
  allCustomDocuments: any[] = [];
  documentSubscription: Subscription;
  selectedFile: any;
  currentDocument: any;
  contactDetails =null;
  callBridgingExtension: any;
  outboundCallBridgingType: any ='';
  salePipelines: Pipelines[] = []; //sale pipelins
  pipelineId:number;

  constructor(
    private analytics: AngularFireAnalytics,
    @Inject(DOCUMENT) private document: Document,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    private ref: ChangeDetectorRef,
    private router: Router,
    private fullLayoutComp: FullLayoutComponent,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private salesdetailsService: SalesdetailsService,
    public networkCheck: NetworkCheckService,
    private location: Location,
    public commonService: CommonService,
    public goog: GoogleCalendarEventService,
    private servicedetailsService: ServiceDetailsService
  ) {
    this.saleId = this.route.snapshot.paramMap.get('saleId');
    this.initClientSubscription = this.goog.initClient.subscribe((_data) => {});
    this.uploadFileLimit = PlanDocLimit.sizeLimit;
    this.commonServSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        this.dragAreaClass = 'dragarea';
        this.isMobilesize = allData.isMobileSize;
        this.isTabletsize = allData.isTabetSize;
        this.user = allData.authDetails;
        this.userId = allData.userId;
        let userData = allData.userDetails;
        this.userEmail = allData.userDetails.email;
        this.superUserDetails = allData.superUserDetails;
        this.orderWonCheck = this.superUserDetails.orderWonCheck;
        this.subUsers = allData.subUsers;
        this.superUserId = userData.superUserId;
        // assign whatsapp templates from common service
        this.saleWaTemp = allData.whatsAppTemplates.filter(
          (templates) => templates.tempRecType === 'Sale'
        );
        this.branches = allData.branches;
        this.totalUserCount = allData.superUserDetails.noSubusers + 1;
        this.currentlyUploaded = allData.superUserDetails.totalAttachmentsSize;
        this.currentPlan = allData.superUserDetails.plan;
        //get customDoc value
        this.customDocuments = allData.superUserDetails.saleCustomDoc
          ? allData.superUserDetails.saleCustomDoc
          : this.customDocuments;
        if (allData.superUserDetails.DIDNumber) {
          this.DIDNumber = allData.superUserDetails.DIDNumber;
        }
        if (allData.superUserDetails.itemQtyDisplay === false) {
          this.itemsQtyDisplay = false;
        } else {
          this.itemsQtyDisplay = true;
        }

        this.maxItems = allData.superUserDetails.itemMaxAllowed
          ? allData.superUserDetails.itemMaxAllowed
          : itemMax.MAX_ITEM;
        if (
          typeof allData.superUserDetails.productCategories === 'undefined' ||
          allData.superUserDetails.productCategories?.length === 0
        ) {
          this.prodCatArray = this.getCats();
        } else {
          this.prodCatArray = allData.superUserDetails.productCategories;
        }
        //taskStatusOptions
        this.taskStatusOptions = allData.superUserDetails.taskStatusOpn
          ? allData.superUserDetails.taskStatusOpn
          : this.taskDefaultOpn;
        this.lastStatusOption =
          this.taskStatusOptions[this.taskStatusOptions.length - 1];
        if (this.currentPlan == 'diamond') {
          this.totalUploadLimit =
            this.uploadFileLimit.diamond * this.totalUserCount;
        } else if (this.currentPlan == 'gold') {
          this.totalUploadLimit =
            this.uploadFileLimit.gold * this.totalUserCount;
        } else {
          this.totalUploadLimit =
            this.uploadFileLimit.free * this.totalUserCount;
        }
        this.uploadPercentage = Math.round(
          (this.currentlyUploaded / this.totalUploadLimit) * 100
        );

        this.additionalFields = this.superUserDetails.customFieldsSale;
        if (userData) {
          this.userName = userData.lastname ? userData.firstname + ' ' + userData.lastname : userData.firstname;
          // this.dataAccessRule = data.dataAccessRule;
          this.userRole = userData.userRole;
          this.accountType = userData.accountType;
          // check restriction
          this.userNumber = allData.userDetails.phone;
          if (allData.superUserDetails.enableOutboundCallsViaCallBridging) {
            this.enableOutboundCallsViaCallBridging =
              allData.superUserDetails.enableOutboundCallsViaCallBridging;
          }
          if (allData.superUserDetails.outboundCallType) {
            this.outboundCallBridgingType = allData.superUserDetails.outboundCallType;
          }
          if (allData.superUserDetails.callBridgingServiceProvider) {
            this.callBridgingServiceProvider =
              allData.superUserDetails.callBridgingServiceProvider;
          }
          if(this.superUserId === this.userId){
            if (allData.superUserDetails.extensionNumber) {
              this.callBridgingExtension = allData.superUserDetails.extensionNumber?allData.superUserDetails.extensionNumber:'';
            }
          } else{
            const userObject = allData.subUsers.find(user => user.userId === this.userId)
            this.callBridgingExtension = userObject?userObject.extensionNumber:null;
          }
          if (allData.superUserDetails.autoCallToken) {
            this.autoCallToken = allData.superUserDetails.autoCallToken;
          }
          this.usrProfileData = allData.usrProfileData;
          this.dataAccessRule = this.usrProfileData.saleDataAccessRule;

          //customisation field
          if (
            allData.superUserDetails.contactSettings &&
            typeof allData.superUserDetails.contactSettings !== 'undefined' &&
            allData.superUserDetails.contactSettings !== null
          ) {
            this.contactSettings = allData.superUserDetails.contactSettings;
            if (allData.superUserDetails.contactSettings) {
              this.commonService.checkCustomField(
                defaultContactSettings.CONST_VALUE,
                allData.superUserDetails.contactSettings
              );
            }
          }
          if (
            allData.superUserDetails.saleSettings &&
            typeof allData.superUserDetails.saleSettings !== 'undefined' &&
            allData.superUserDetails.saleSettings !== null
          ) {
            this.saleSettings = allData.superUserDetails.saleSettings;

            if (allData.superUserDetails.saleSettings) {
              this.commonService.checkCustomField(
                defaultSaleSettings.CONST_VALUE,
                allData.superUserDetails.saleSettings
              );
            }
          }
          if (
            allData.superUserDetails.taskSettings &&
            typeof allData.superUserDetails.taskSettings !== 'undefined' &&
            allData.superUserDetails.taskSettings !== null
          ) {
            this.taskSettings = allData.superUserDetails.taskSettings;
            if (allData.superUserDetails.taskSettings) {
              this.commonService.checkCustomField(
                defaultTaskSettings.CONST_VALUE,
                allData.superUserDetails.taskSettings
              );
            }
          }
          if (this.superUserDetails) {
            this.plan = this.superUserDetails.plan;
            //Read the customer form customization settings
            this.attachmentSize = this.superUserDetails.totalAttachmentsSize;
            this.createDate = this.superUserDetails?.createdDate;

            if (!this.attachmentSize) {
              this.attachmentSize = 0;
            }
            if (this.superUserDetails.fieldNames) {
              this.fieldNameContact =
                this.superUserDetails.fieldNames.fieldNameContact;
              this.fieldNameSale =
                this.superUserDetails.fieldNames.fieldNameSale;
              this.fieldNameTask =
                this.superUserDetails.fieldNames.fieldNameTask;
              this.fieldNameMeeting =
                this.superUserDetails.fieldNames.fieldNameMeeting;
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
              this.fieldNameSaleNotes =
                this.superUserDetails.fieldNames.fieldNameSaleNotes;
              this.fieldNameFollowup =
                this.superUserDetails.fieldNames.fieldNameFollowup;
            }

            let currentUser = {
              name: this.userName,
              userId: this.userId,
            };
            this.superUserName =
              this.superUserDetails.firstname +
              ' ' +
              this.superUserDetails.lastname;
            let SuperUser = {
              userId: this.superUserId,
              name: this.superUserName,
            };
            // reading sale
            this.sale = this.salesdetailsService.getSale(
              this.saleId,
              this.superUserId
            );
            this.sale.pipe(takeUntil(this.onDestroy$)).subscribe((data) =>{
              if(data) {
                // tag user starts here
                // if there is tagged users
                const allUsers = this.allSubUsers.filter(function (e) {
                  return e.status != 'suspended';
                });
                // if there is tagged users
                if (data.taggedUsers?.length > 0) {
                  const taggedTrueArray = data.taggedUsers.filter(
                    (taggedUser) => taggedUser.tagged === true
                  );
                  this.taggedUserIdArray = taggedTrueArray.map((i) => i.userId); //create a new array with only userIds for viewCheck operation

                  // create a tagged user array with username to use
                  this.taggedUserArray = allUsers.map((item) => {
                    let container: taggedUsers = {
                      userId: '',
                      userName: '',
                      tagged: false,
                    };
                    const idx = data.taggedUsers.findIndex(
                      (elem) => elem.tagged === true && elem.userId === item.userId
                    );

                    container.userId = item.userId;
                    container.userName = item.lastname
                      ? item.firstname + ' ' + item.lastname
                      : item.firstname;
                    container.tagged = idx !== -1 ? true : false;

                    return container;
                  });
                } else {
                  // case: no tagged users yet, display all subusers name with checkbox unchecked & createdBy checked
                  this.taggedUserArray = allUsers.map((item) => {
                    let container: taggedUsers = {
                      userId: '',
                      userName: '',
                      tagged: false,
                    };
                    container.userId = item.userId;
                    container.userName = item.lastname
                      ? item.firstname + ' ' + item.lastname
                      : item.firstname;
                    container.tagged =
                      data.createdBy === item.userId ? true : false;

                    return container;
                  });
                }

                // assigning filteredOptions w.r.t searchterm
                if (this.searchTerm === '') {
                  this.filteredOptions = [...this.taggedUserArray];
                } else {
                  this.filteredOptions = this.taggedUserArray.filter((item) =>
                    item.userName.toLowerCase().includes(this.searchTerm)
                  );
                }
                // tag user ends here

                this.saleToedit = data;
                this.saleName = data.saleTitle;
                this.associatedBranch = data.associatedBranch
                  ? data.associatedBranch
                  : '';
                this.prevAssBranch = data.associatedBranch
                  ? data.associatedBranch
                  : '';
                this.saleValue = data.estimatedValue;
                this.invoicedAmount = data.invoicedAmount;
                this.collectedAmount = data.collectedAmount;
                this.customerId = data.customerId;
                this.orgId = data.orgId;
                this.estimateAmount = data.estimatedValue;
                this.expenseAmount = data.expenseAmount;
                this.customerfirstname = data.firstName;
                this.customersecondname = data.secondName;
                this.customersurname = data.surname;
                this.company = data.companyName;
                this.currentStage = data.salesStage;

                this.satusToSend = data?.salesStage;
                this.stageHistoryToSend = data?.stageHistory;
                this.priority = data?.priority;
                this.assignedTo = data?.assignedTo;
                this.assignedToName = this.commonService.getAssignedToName(
                  data?.assignedTo
                );
                this.changeLog = data?.changeLog ? data?.changeLog : {};
                this.lastNoteId = data?.lastNoteId ? data?.lastNoteId : '';
                let viewCheckPrimary =
                  this.commonService.checkDataAccessRule(
                    'sales',
                    this.userId,
                    data.assignedTo,
                    data.associatedBranch
                  ) || data.createdBy == this.userId; //Allow access if data access rule check passes or record has been created by user
                // if user already has access to contact no need to check access further
                if (viewCheckPrimary === true) {
                  this.viewCheck = true;
                  // if user has no access, check if user is tagged and thus allow access
                } else {
                  this.viewCheck = this.commonService.checkTaggedUser(
                    'sales',
                    this.userId,
                    this.taggedUserIdArray
                  );

                  if (this.viewCheck === true) {
                    this.viewCheckTagged = true;
                  }
                }

                if (this.usrProfileData && this.viewCheckTagged === false) {
                  // disable contact
                  if (this.usrProfileData.isCheckedCont == false) {
                    this.disableViewContact = true;
                  } else {
                    if (this.usrProfileData.contactsView == false) {
                      this.disableViewContact = true;
                    }
                  }
                  // disable Sale
                  if (this.usrProfileData.isCheckedSale == false) {
                    this.disableSaleView = true;
                    this.disableSaleEdit = true;
                    this.disableReAssign = true;
                  } else {
                    if (this.usrProfileData.salesView == false) {
                      this.disableSaleView = true;
                    }
                    if (this.usrProfileData.salesEdit == false) {
                      this.disableSaleEdit = true;
                      this.disableReAssign = true;
                    }
                    if (this.usrProfileData.saleReAssign == false) {
                      this.disableReAssign = true;
                    }
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
                  // disable notes
                  if (this.usrProfileData.isCheckedNotes == false) {
                    this.disableNotes = true;
                    this.disableNotesEdit = true;
                    this.disableNotesView = true;
                  } else {
                    if (this.usrProfileData.notesView == false) {
                      this.disableNotesView = true;
                    }
                    if (this.usrProfileData.notesCreate == false) {
                      this.disableNotes = true;
                    }
                    if (this.usrProfileData.notesEdit == false) {
                      this.disableNotesEdit = true;
                    }
                  }
                  // disable attachments
                  if (this.usrProfileData.isCheckedSaleAtt == false) {
                    this.disableAtt = true;
                    this.disableAttRemove = true;
                    this.disableAttView = true;
                  } else {
                    if (this.usrProfileData.saleattAdd == false) {
                      this.disableAtt = true;
                    }
                    if (this.usrProfileData.saleattRemove == false) {
                      this.disableAttRemove = true;
                    }
                    if (this.usrProfileData.saleattView == false) {
                      this.disableAttView = true;
                    }
                  }
                  // disable collection
                  if (this.usrProfileData.isCheckedColl == false) {
                    this.disableColl = true;
                    this.disableCollEdit = true;
                    this.disableCollView = true;
                  } else {
                    if (this.usrProfileData.collectionCreate == false) {
                      this.disableColl = true;
                    }
                    if (this.usrProfileData.collectionsView == false) {
                      this.disableCollView = true;
                    }
                    if (this.usrProfileData.collectionEdit == false) {
                      this.disableCollEdit = true;
                    }
                  }
                  // disable expenses
                  if (this.usrProfileData.isCheckedExp == false) {
                    this.disableExp = true;
                    this.disableExpEdit = true;
                    this.disableExpView = true;
                  } else {
                    if (this.usrProfileData.expCreate == false) {
                      this.disableExp = true;
                    }
                    if (this.usrProfileData.expView == false) {
                      this.disableExpView = true;
                    }
                    if (this.usrProfileData.expEdit == false) {
                      this.disableExpEdit = true;
                    }
                  }
                  if (this.usrProfileData.isCheckedFoll == false) {
                    this.disableFoll = true;
                    this.disableFollEdit = true;
                    this.disableFollView = true;
                  } else {
                    if (this.usrProfileData.follView == false) {
                      this.disableFollView = true;
                    }
                    if (this.usrProfileData.follCreate == false) {
                      this.disableFoll = true;
                    }
                    if (this.usrProfileData.follEdit == false) {
                      this.disableFollEdit = true;
                    }
                  }
                  // disable Products and Services
                  if (this.usrProfileData.isCheckedItems == false) {
                    this.disableItemsDelete = true;
                    this.disableItemsEdit = true;
                    this.disableItemsView = true;
                    this.disableItemsCreate = true;
                  } else {
                    if (this.usrProfileData.itemsView == false) {
                      this.disableItemsView = true;
                    }
                    if (this.usrProfileData.itemsCreate == false) {
                      this.disableItemsCreate = true;
                    }
                    if (this.usrProfileData.itemsEdit == false) {
                      this.disableItemsEdit = true;
                    }
                    if (this.usrProfileData.itemsDelete == false) {
                      this.disableItemsDelete = true;
                    }
                  }
                } else {
                  // disable task section
                  this.disableTaskAdd = true;
                  this.disableTaskEdit = true;

                  // disable contact
                  this.disableViewContact = false;
                  // disable Sale
                  this.disableSaleView = false;
                  this.disableSaleEdit = true;
                  this.disableReAssign = true;

                  // disable estimates
                  this.disableDocEst = false;
                  this.disableDocCreateEst = true;

                  // disable quotation
                  this.disableDocQuot = false;
                  this.disableDocCreateQuot = true;

                  // disable invoices
                  this.disableDocInv = false;
                  this.disableDocCreateInv = true;
                  // disable notes
                  this.disableNotes = false;
                  this.disableNotesEdit = false;
                  this.disableNotesView = false;

                  // disable attachments
                  this.disableAtt = true;
                  this.disableAttRemove = true;
                  this.disableAttView = false;

                  // disable collection
                  this.disableColl = true;
                  this.disableCollEdit = true;
                  this.disableCollView = false;

                  // disable expenses
                  this.disableExp = true;
                  this.disableExpEdit = true;
                  this.disableExpView = false;

                  // disable followup
                  this.disableFoll = true;
                  this.disableFollEdit = true;
                  this.disableFollView = false;

                  // disable Products and Services
                  this.disableItemsDelete = true;
                  this.disableItemsEdit = true;
                  this.disableItemsView = false;
                  this.disableItemsCreate = true;
                }
                //if there is multiple pipeline access, show all five pipelines else show single pipeline
                this.salePipelines = JSON.parse(JSON.stringify(allData.salePipelines))
                if (this.commonService.userPlan.multiPipelineAccess
                ) {
                  // do nothing
                }else{
                  this.salePipelines.length = 1;
                }
                var result = this.salePipelines.filter(obj => {
                  return obj.pipelineId === data?.selectedSalePipeline
                })
                this.pipelineId = data?.selectedSalePipeline
                this.saleStatus = result[0].pipelineStages.map(({ name, stageId }) => ({
                  name, stageId
                }));
                if (data.additionalFieldsArr) {
                  this.fieldListArray = data.additionalFieldsArr;
                  const fieldListLen = Object.keys(this.fieldListArray).length;
                  for (let i = 0; i < this.additionalFields?.length; i++) {
                    this.additionalFields[i].datavalue = '';
                  }
                  if (fieldListLen != 0) {
                    for (let i = 0; i < fieldListLen; i++) {
                      if (this.additionalFields[i]) {
                        this.additionalFields[i].datavalue =
                          this.fieldListArray[i].fieldValue;
                      }
                    }
                  }
                } else {
                  for (let i = 0; i < this.additionalFields?.length; i++) {
                    this.additionalFields[i].datavalue = '';
                  }
                }

                // to filter and save only active custom fields
                this.filteredAdditionalField = [];
                for (let i = 0; i < this.additionalFields?.length; i++) {
                  if (this.additionalFields[i].isActive) {
                    this.filteredAdditionalField.push(this.additionalFields[i]);
                  }
                }
                this.saleAssignedToName = this.commonService.getAssignedToName(
                  data.assignedTo
                );
                this.saleAssignedTo = data.assignedTo;
                if (!this.expenseAmount) {
                  this.expenseAmount = 0;
                }
                if (!this.invoicedAmount) {
                  this.invoicedAmount = 0;
                }
                this.profitAmount = this.invoicedAmount - this.expenseAmount;
                if (this.customerId) {
                  this.custSubscription = this.salesdetailsService
                    .getCustdetails(this.superUserId, this.customerId)
                    .subscribe((res) => {
                      this.custData = res.data();
                      if (this.custData) {
                        if (this.custData.contactNo) {
                          this.contactNumber = this.custData.contactNo;
                        }
                        if (this.custData.alternateContactNumber) {
                          this.altContactNumber = this.custData.alternateContactNumber;
                        }
                      }
                  });
              }
              // assigning to local variables and mat-table data
              if (data?.itemsArray) {
                this.items = Object.values(data?.itemsArray); //array format
              }

                this.itemsArray = data.itemsArray ? data.itemsArray : null;
                this.dataSourceitems = new MatTableDataSource([]);
                this.dataSourceitems = this.items;
              }
            });

            // reading subusers
            this.assignedArray = [];
            for (let i = 0; i < this.subUsers.length; i++) {
              if (this.subUsers[i].secondname) {
                this.assignedArray[i] = {
                  userId: this.subUsers[i].userId,
                  name:
                    this.subUsers[i].firstname +
                    ' ' +
                    this.subUsers[i].secondname,
                };
              } else if (this.subUsers[i].lastname) {
                this.assignedArray[i] = {
                  userId: this.subUsers[i].userId,
                  name:
                    this.subUsers[i].firstname +
                    ' ' +
                    this.subUsers[i].lastname,
                };
              } else {
                this.assignedArray[i] = {
                  userId: this.subUsers[i].userId,
                  name: this.subUsers[i].firstname,
                };
              }
            }
            if (this.accountType == 'SuperUser') {
              this.assignedArray.push(currentUser);
            } else {
              this.assignedArray.push(SuperUser);
            }

            this.allSubUsers = this.commonService.createUserlist(
              'All',
              'any'
            )[1];

            //read the notes associated witht the sale
            this.notesSubscription = this.salesdetailsService
              .readNote(this.saleId, this.superUserId)
              .subscribe((data) => {
                let EditableData = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as SalesNotes;
                });
                EditableData.forEach((element) => {
                  element.isEditable = false;
                });
                this.saleNotes = EditableData;
              });
            //get all documents
            this.documentSubscription = this.salesdetailsService
              .fetchdocuments(this.saleId, this.superUserId)
              .subscribe((data) => {
                this.allCustomDocuments = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as any;
                });
                this.listDocument = this.customDocuments.map((obj1) => {
                  let obj2 = this.allCustomDocuments.find(
                    (obj2) => obj1.docIdentifier === obj2.docIdentifier
                  );
                  //if obj2 with docIdentifier value same found,add that object customdocument array with its original value,For doctype onl true values are taken
                  if (obj2) {
                    let doctypes = [];
                    for (let doctype in obj1.doctypes) {
                      if (obj1.doctypes[doctype]) {
                        doctypes.push('.' + doctype);
                      }
                    }
                    return { ...obj1, ...obj2, doctypes };
                  } else {
                    let doctypes = [];
                    for (let doctype in obj1.doctypes) {
                      if (obj1.doctypes[doctype]) {
                        doctypes.push('.' + doctype);
                      }
                    }
                    //if no object add fields of allCustomdocument to customDocument ,with field value initialsed to null
                    const undefinedObj = {
                      docIdentifier: obj1.docIdentifier,
                      docValidation: obj1.docValidation,
                      doctypes,
                      documentName: obj1.documentName,
                      downloadURL: null,
                      fileName: null,
                      id: null,
                      path: null,
                      size: null,
                      uploadedBy: null,
                      uploadedDate: null,
                      verificationDate: null,
                      verificationStatus: null,
                      verifiedBy: null,
                      verifiedById: null,
                    };
                    return { ...obj1, ...undefinedObj };
                  }
                });
              });
            // fetching open tasks only to show count in badge
            this.taskSubscription = this.salesdetailsService
              .getTasks(
                this.superUserId,
                this.userId,
                this.saleId,
                this.usrProfileData.taskDataAccessRule,
                this.accountType,
                this.lastStatusOption
              )
              .subscribe((data) => {
                this.taskss = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Task;
                });
                this.progressBarStatus = true;
              });

            // getting all followup
            this.allFolowupSubscription = this.salesdetailsService
              .getAllFollowUps(this.saleId, this.superUserId)
              .subscribe((data) => {
                this.allFollowUp = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as FollowUps;
                });
                this.nextFollowUp = this.allFollowUp.filter(
                  (obj) => obj.completedStatus == false
                ); // get open followup
                this.nextFollowUp.sort(
                  (a, b) => a.callStartDate - b.callStartDate
                ); // sort open followup by call start date ascending order
                this.allFollowUp.sort(
                  (a, b) => b.callStartDate - a.callStartDate
                ); // sort all followup by call start date descending order
                this.followUps = this.nextFollowUp;
              });
          }
        }
      }
    );
  }

  stageInPipeline(i) {
    var result = this.saleStatus.filter(obj => {
      return obj.stageId === this.currentStage
    })
    const statusObj = result[0]
    let currentStageIndex = this.saleStatus.indexOf(statusObj);

    //If current stage is not won or lost
    if (i <= this.saleStatus.length - 3) {
      if (i < currentStageIndex) {
        return {
          border: 'border-info',
          text: 'text-info',
          badge: 'bg-soft-info',
          background: 'bg-soft-info',
        };
      } else if (i == currentStageIndex) {
        return {
          border: 'border-primary',
          text: 'text-white',
          badge: 'bg-soft-primary',
          background: 'bg-primary',
        };
      } else {
        return {
          border: 'border-warning',
          text: 'text-info',
          badge: 'bg-soft-warning',
          background: 'bg-white',
        };
      }
    }
    //If won
    else if (i == this.saleStatus.length - 2) {
      if (i != currentStageIndex) {
        return {
          border: 'border-success',
          text: 'text-success',
          badge: 'bg-soft-success',
          background: 'bg-white',
        };
      } else {
        return {
          border: 'border-success',
          text: 'text-white',
          badge: 'bg-soft-success',
          background: 'bg-success',
        };
      }
    }
    //If lost
    else {
      if (i != currentStageIndex) {
        return {
          border: 'border-danger',
          text: 'text-danger',
          badge: 'bg-soft-danger',
          background: 'bg-white',
        };
      } else {
        return {
          border: 'border-danger',
          text: 'text-white',
          badge: 'bg-soft-danger',
          background: 'bg-danger',
        };
      }
    }
  }

  setNavOption(option) {
    this.navSelected = option;
    if (this.navSelected == 'Sales docs') {
      //@MK 24/5/2021 - replaced the data access rule based fetching of document details, instead getting all documents for a sale
      this.QuoteSubscription = this.salesdetailsService
        .getQuotations(this.superUserId, this.saleId)
        .subscribe((data) => {
          this.quotations = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
          this.quotations.sort(
            (a, b) => b.docData.docDate.seconds - a.docData.docDate.seconds
          );
        });
      this.EstSubscription = this.salesdetailsService
        .getEstimates(this.superUserId, this.saleId)
        .subscribe((data) => {
          this.estimates = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
          this.estimates.sort(
            (a, b) => b.docData.docDate.seconds - a.docData.docDate.seconds
          );
        });
      this.InvSubscription = this.salesdetailsService
        .getInvoices(this.superUserId, this.saleId)
        .subscribe((data) => {
          this.invoices = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
          this.invoices.sort(
            (a, b) => b.docData.docDate.seconds - a.docData.docDate.seconds
          );
        });
    }
    if (this.navSelected == 'Revenue and Expenses') {
      // get the list of payments
      this.collectionSubscription = this.salesdetailsService
        .getPaymentReceipt(this.superUserId, this.saleId)
        .subscribe((data) => {
          this.paymentReceipts = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as PaymentReceipt;
          });
          this.paymentReceipts.sort(
            (a, b) => b.paymentDate.seconds - a.paymentDate.seconds
          );
          this.dataSource = new MatTableDataSource([]);
          this.dataSource = this.sortData(this.paymentReceipts, 'collection');
        });
    }

    if (this.navSelected == 'Emails') {
      this.parentSubject.next('Email');
    }

    if (this.navSelected == 'Attachments') {
      // attachments fetching
      this.attachmentSubscription = this.salesdetailsService
        .getAttachments(this.superUserId, this.saleId)
        .subscribe((data) => {
          this.attachments = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Attachments;
          });
          setTimeout(() => {
            this.dataSourceAtt = new MatTableDataSource([]);
            this.dataSourceAtt = this.attachments;
          }, 500);
        });
    }
    if (this.navSelected == 'Revenue and Expenses') {
      // fetching expenses
      this.expenseSubscription = this.salesdetailsService
        .getExpenses(this.superUserId, this.saleId)
        .subscribe((data) => {
          this.expenses = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Expenses;
          });
          this.expenses.sort(
            (a, b) => b.expenseDate.seconds - a.expenseDate.seconds
          );
          this.dataSources = new MatTableDataSource([]);
          this.dataSources = this.sortData(this.expenses, 'expenses');
        });
    }
  }
  sortData(data, collection) {
    if (collection === 'expenses') {
      return data.sort((a, b) => {
        return b.expenseDate.seconds - a.expenseDate.seconds;
      });
    } else if (collection === 'collection') {
      return data.sort((a, b) => {
        return b.paymentDate.seconds - a.paymentDate.seconds;
      });
    }
  }
  //event to get mail choosen
  chooseMail($event: any){
    this.mailChoosen = $event;
  }

  // get categoriess
  getCats(): string[] {
    let category: ProductCategories = null;
    category = new ProductCategories();
    return category.prodCats;
  }

  // download attachment
  downloadAttachment(url) {
    this.document.location.href = url;
  }

  trackbyFwp(_index: number, task: FollowUps): string {
    return task.id;
  }
  // mobile task icon route to taskboard for particular sale
  tasksRoute() {
    this.router.navigate(['/dash/tasks/sale', this.saleId]);
  }
  // delete attachment
  deleteAttachment(id, path, url, filename, size) {
    this.dialog.open(ConfirmationpopupComponent, {
      data: {
        taskId: id,
        smode: 'attachmentDelete',
        path: path,
        url: url,
        orginalPath: filename,
        saleId: this.saleId,
        userId: this.superUserId,
        size: size,
        changeLog: ChangeLogComponent.saveLog(
          this.constructor.name,
          this.userId,
          this.userName,
          '',
          { deletedAttachment: filename },
          this.changeLog
        ),
      },
    });
  }

  //create a quote for a paritcular sale ID
  createQuote() {
    this.router.navigate([
      '/dash/document/documentquotationmanagement/',
      this.saleId,
      'create',
      'Quotation',
      this.customerId ? this.customerId : 'none',
      this.orgId ? this.orgId : 'none',
      'none',
    ]);
  }
  // add collection from toolbar/tab-web
  addPayment() {
    this.dialog.open(Paymentreceipt1Component, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        saleId: this.saleId,
        customerId: this.customerId,
        customerName: this.saleToedit.secondName
          ? this.saleToedit.firstName + ' ' + this.saleToedit.secondName
          : this.saleToedit.firstName,
        mode: 'create',
        orgId: this.orgId,
        company: this.company,
        saleTitle: this.saleName,
        changeLog: this.changeLog,
        componentName: this.constructor.name,
        moduleName: 'sales',
        docId: this.saleId,
      },
    });
  }
  // add expenses from toolbar/tab-web
  addExpenses() {
    this.dialog.open(Expenses1Component, {
      width: '600px',
      height: 'auto',
      disableClose: true,
      data: {
        sid: this.saleId,
        cid: this.customerId,
        cfname: this.customerfirstname,
        csname: this.customersecondname,
        orgId: this.orgId,
        company: this.company,
        saleTitle: this.saleName,
        mode: 'create',
        changeLog: this.changeLog,
        componentName: this.constructor.name,
        moduleName: 'sales',
        docId: this.saleId,
      },
    });
  }

  // edit expense - web
  editExpense(id, expense) {
    this.commonService.updateExpenseToEdit(expense);
    this.dialog.open(Expenses1Component, {
      width: '600px',
      height: 'auto',
      disableClose: true,
      data: {
        mode: 'update',
        expenseId: id,
        changeLog: this.changeLog,
        componentName: this.constructor.name,
        moduleName: 'sales',
        docId: this.saleId,
      },
    });
  }
  // for display progress of attachment uploading-
  resetBar() {
    this.uploadProgress$ = this.uploadReset;
  }
  // add collection -mobile

  @HostListener('dragover', ['$event']) onDragOver(event: any) {
    this.dragAreaClass = 'droparea';
    event.preventDefault();
  }
  @HostListener('dragenter', ['$event']) onDragEnter(event: any) {
    this.dragAreaClass = 'droparea';
    event.preventDefault();
  }
  @HostListener('dragend', ['$event']) onDragEnd(event: any) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }
  @HostListener('dragleave', ['$event']) onDragLeave(event: any) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }
  @HostListener('drop', ['$event']) onDrop(event: any) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
    event.stopPropagation();
    if (this.commonService.getStatus() === true) {
      this.dialog.open(ConfirmationpopupComponent, {
        width: '300px',
        data: {
          smode: 'uploadinprogress',
        },
      });
    } else {
      if (event.dataTransfer.files) {
        let files: FileList = event.dataTransfer.files[0];
        this.uploadAttachment(files, 'drag');
      }
    }
  }
  //selecting file for custom document
  selectFile(event: any, customDoc, _i) {
    //get file extension
    var extension = event.target.files[0]?.name.substr(
      event.target.files[0]?.name.lastIndexOf('.')
    );
    //check if selected file extension is suppoerted by current customDoc
    if (customDoc.doctypes.includes(extension)) {
      this.selectedFile = event.target.files;
      if (event.target.files[0]) {
        //passing selected file for uploading
        this.uploadDocument(
          event,
          customDoc.docIdentifier,
          this.currentDocument
        );
      }
    } else if (customDoc.doctypes.length === 0) {
      this.selectedFile = event.target.files;
      if (event.target.files[0]) {
        //passing selected file for uploading
        this.uploadDocument(
          event,
          customDoc.docIdentifier,
          this.currentDocument
        );
      }
    } else {
      this.dialog.open(ConfirmationpopupComponent, {
        width: '400px',
        data: {
          smode: 'doctypeNotSupported',
          reportsArray: customDoc.doctypes,
        },
      });
    }
  }
  // download document
  downloadDoc(url) {
    window.open(url, '_blank');
  }
  //deleting custom document
  deleteCustomDoc(id, path, url, filename, size) {
    this.dialog.open(ConfirmationpopupComponent, {
      data: {
        taskId: id,
        smode: 'customSaleDocDelete',
        path: path,
        url: url,
        orginalPath: filename,
        custId: this.saleId,
        userId: this.superUserId,
        size: size,
        changeLog: ChangeLogComponent.saveLog(
          this.constructor.name,
          this.userId,
          this.userName,
          '',
          { deletedDocument: filename },
          this.changeLog
        ),
      },
    });
  }
  //verifying custom document
  verificationCheck(event, documentId, fileName) {
    //marking document as verified & updating changeLog
    if (event === true) {
      const verifiedDate = new Date().getTime();
      const verifiedByName = this.userName;
      const verifiedById = this.userId;
      this.salesdetailsService.changeDocVerification(
        this.superUserId,
        this.saleId,
        documentId,
        verifiedByName,
        verifiedById,
        verifiedDate,
        event,
        ChangeLogComponent.saveLog(
          this.constructor.name,
          this.userId,
          this.userName,
          '',
          { documentVerified: fileName },
          this.changeLog
        )
      ); //marking document as verified & updating changeLog
    } else if (event === false) {
      const verifiedDate = null;
      const verifiedByName = this.userName;
      const verifiedById = this.userId;
      this.salesdetailsService.changeDocVerification(
        this.superUserId,
        this.saleId,
        documentId,
        verifiedByName,
        verifiedById,
        verifiedDate,
        event,
        ChangeLogComponent.saveLog(
          this.constructor.name,
          this.userId,
          this.userName,
          '',
          { markDocAsUnverified: fileName },
          this.changeLog
        )
      );
    }
  }
  // upload custom document
  uploadDocument(event, customDocIdentifier, currentDocument) {
    let str;
    let size;
    let file;
    let newSize;
    let uploadedBy = this.userName;
    let docUploadDate = new Date().getTime();
    //  let verficationStatus = validation;
    if (event.target.files.length > 0) {
      str = event.target.files[0].name;
      file = event.target.files[0];
      size = event.target.files[0].size / 1024 / 1024;
    }

    if (file) {
      newSize = this.attachmentSize + size;
      if (newSize > this.totalUploadLimit && this.plan == 'diamond') {
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: 'diamond',
            size: this.uploadFileLimit.diamond,
          },
        });
      } else if (newSize > this.totalUploadLimit && this.plan == 'gold') {
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: 'gold',
            size: this.uploadFileLimit.gold,
          },
        });
      } else if (newSize > this.totalUploadLimit && this.plan == 'free') {
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: 'free',
            size: this.uploadFileLimit.free,
          },
        });
      } else {
        // update size before uploading to storage and collection, so that it will reflect to sum up if others are trying to upload
        this.salesdetailsService.updateSize(this.superUserId, newSize);
        const filePath = `attachment/${this.userId}/sale/${Date.now()}_${str}`;
        //uploaded Date
        this.fullLayoutComp.uploadCustomDocument(
          filePath,
          file,
          this.saleId,
          str,
          docUploadDate,
          uploadedBy,
          size,
          newSize,
          customDocIdentifier,
          'sales',
          '',
          ChangeLogComponent.saveLog(
            this.constructor.name,
            this.userId,
            this.userName,
            '',
            { addedDocument: str },
            this.changeLog
          ),
          currentDocument
        );
      }
    }
  }
  // upload attachment
  uploadAttachment(event, type) {
    this.ref.detectChanges();
    let date = new Date().getTime();
    let str;
    let size;
    let file;
    let newSize;
    let name =
      this.superUserDetails?.firstname + ' ' + this.superUserDetails?.lastname;
    // let datePlaced = new Date().getTime();
    if (type == 'drag') {
      str = event.name;
      file = event;
      size = event.size / 1024 / 1024;
    } else {
      if (event.target.files.length > 0) {
        str = event.target.files[0].name;
        file = event.target.files[0];
        size = event.target.files[0].size / 1024 / 1024;
      }
    }
    if (file) {
      newSize = this.attachmentSize + size;
      if (newSize > this.totalUploadLimit && this.plan == 'diamond') {
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: 'diamond',
            size: this.uploadFileLimit.diamond,
          },
        });
      } else if (newSize > this.totalUploadLimit && this.plan == 'gold') {
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: 'gold',
            size: this.uploadFileLimit.gold,
          },
        });
      } else if (newSize > this.totalUploadLimit && this.plan == 'free') {
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: 'free',
            size: this.uploadFileLimit.free,
          },
        });
      } else {
        // update size before uploading to storage and collection, so that it will reflect to sum up if others are trying to upload
        this.salesdetailsService.updateSize(this.superUserId, newSize);

        const filePath = `attachment/${
          this.user.uid
        }/sale/${Date.now()}_${str}`;

        this.fullLayoutComp.uploadAttachment(
          filePath,
          file,
          this.saleId,
          str,
          date,
          name,
          size,
          newSize,
          'sale',
          this.customerId,
          ChangeLogComponent.saveLog(
            this.constructor.name,
            this.userId,
            this.userName,
            '',
            { addedAttachment: str },
            this.changeLog
          )
        );
        // this.task = this.storage.upload(filePath, file);
        // const ref = this.storage.ref(filePath);

        // this.uploadProgress$ = this.task.percentageChanges();
        // this.task
        //   .snapshotChanges()
        //   .pipe(
        //     finalize(async () => {
        //       downloadURL = await ref.getDownloadURL().toPromise();

        //       this.salesdetailsService.attachmentsToCollection(
        //         this.superUserId,
        //         name,
        //         this.saleId,
        //         str,
        //         downloadURL,
        //         filePath,
        //         date,
        //         size
        //       );
        //       this.fileBeingUploaded=false;
        //       this.ref.detectChanges();
        //       this.salesdetailsService.updateSize(this.superUserId, newSize);
        //       this.snack.open('Attachment added successfully', '', {
        //         duration: 500,
        //       });
        //     })
        //   )
        //   .pipe(takeUntil(this.onDestroy$))
        //   .subscribe();
      }
    }
  }
  // select attachemnt
  openL() {
    let element: HTMLElement = document.getElementsByName(
      'attachmentSale'
    )[0] as HTMLElement;
    this.file.nativeElement.value = '';
    element.click();
  }
  //check if the value is a date
  checkDate(value) {
    if (new Date(value).getTime()) {
      return false;
    } else {
      return true;
    }

    /*  if(Object.prototype.toString.call(value) === '[object Date]') {
      return true
    } else {
      return false
    } */
  }

  // edit collection-web
  editPayment(element, id) {
    this.commonService.updatePaymentToEdit(element);
    this.dialog.open(Paymentreceipt1Component, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        saleId: this.saleId,
        customerId: this.customerId,
        mode: 'update',
        paymentId: id,
        customerName: element.customerSecondName
          ? element.customerName + ' ' + element.customerSecondName
          : element.customerName,
        orgId: element.orgId,
        company: element.customerCompany,
        saleTitle: element.saleTitle,
        changeLog: this.changeLog,
        componentName: this.constructor.name,
        moduleName: 'sales',
        docId: this.saleId,
      },
    });
  }
  // edit collection-mobile
  editPaymentMob(id) {
    this.taskDetails.saleId = this.saleId;
    this.taskDetails.mode = 'createBtm';
    this.taskDetails.smode = 'update';
    this.taskDetails.id = id;
    this.taskDetails.saleTitle = this.saleName;

    // this._bottomSheet.open(BottomSheetPaymentUpdateComponent, {
    //   data: this.taskDetails,
    // });
  }

  // create invoice-web
  createInvoice() {
    //create an invoice for a paritcular sale ID

    this.router.navigate([
      '/dash/document/documentinvoicemanagement/',
      this.saleId,
      'create',
      'Invoice',
      this.customerId ? this.customerId : 'none',
      this.orgId ? this.orgId : 'none',
      'none',
    ]);
  }
  // create estimate-web
  createEstimate() {
    this.router.navigate([
      '/dash/document/documentmanagement/',
      this.saleId,
      'create',
      'Estimate',
      this.customerId ? this.customerId : 'none',
      this.orgId ? this.orgId : 'none',
      'none',
    ]);
  }

  ngOnInit(): void {}
  clearNote(form: NgForm) {
    form.reset(); //reset the form after writing the data
  }
  // tag user clear search
  clearSearchTerm() {
    this.searchTerm = '';
    this.filteredOptions = [...this.taggedUserArray];
  }

  // search tag user
  applyFilter($event) {
    this.searchTerm = $event;
    this.filteredOptions = this.taggedUserArray.filter((item) =>
      item.userName.toLowerCase().includes($event)
    );
  }
  // function to tag a user for this Sale
  tagUser($event: any, userid, tagged, userName, _i) {
    $event.stopPropagation(); //to enable multiple selection

    // only userId and tagged is saved to DB
    const taggedArray = this.taggedUserArray.map((item) => {
      let container: tagUsers = {
        userId: '',
        tagged: false,
      };
      container.userId = item.userId;
      container.tagged = userid === item.userId ? tagged : item.tagged;

      return container;
    });

    // update to DB
    this.salesdetailsService
      .updateTaggedUser(this.superUserId, this.saleId, taggedArray)
      .then((_resp) => {
        if (tagged === true) {
          this.snack.open(`Successfully tagged ${userName}`, '', {
            duration: 2000,
          });
        } else {
          this.snack.open(`Untagged user ${userName}`, '', {
            duration: 2000,
          });
        }
      })
      .catch((_err) => {
        this.snack.open(`Error occured`, '', {
          duration: 2000,
        });
      });
  }

  deleteTask(taskid, status, title) {
    const dialogRef = this.dialog.open(ConfirmAssignedto, {
      width: '500px',
      data: {
        scenario: 'deletetask',
        fieldNameTask: this.fieldNameTask,
        status: status == 'OPEN' ? 'Open' : status,
        title: title,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        let deleteLogTask: deleteLogModel = {
          delByemail: this.userEmail,
          delByuserId: this.userId,
          dateNtime: new Date(),
          tasksDeleted: 1,
          contDeleted: 0,
          follDeleted: 0,
        };
        //get Attachemnts in task
        await this.getAttachments(this.superUserId, taskid);
        // delete att
        if (!!this.attachments) {
          let newSize = this.attachmentSize;
          this.attachments.forEach(async (att) => {
            if (!!att) {
              newSize = newSize - att.size;
              //update total size
              this.salesdetailsService.updateSize(this.superUserId, newSize);
              //delete from storage
              const storageRef = firebase.default.storage().ref();
              var desertRef = storageRef.child(att.path);
              await desertRef.delete();
            }
          });
        }
        this.salesdetailsService
          .deleteTask(this.superUserId, taskid)
          .then((_data) => {
            this.salesdetailsService.addToDeleteLog(
              this.superUserId,
              deleteLogTask
            );
            this.snack.open(`${this.fieldNameTask} deleted`, '', {
              duration: 2000,
            });
          });
      }
    });
  }
  //get Attachemnts for task as a promise
  getAttachments(superId, id) {
    return new Promise<void>((resolve) => {
      this.salesdetailsService
        .getAttachmentsTask(superId, id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.attachments = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Attachments;
          });
          resolve();
        });
    });
  }
  // add task
  addTask() {
    this.dialog.open(CrudModal1Component, {
      width: '520px',
      height: 'auto',
      disableClose: true,
      data: {
        sid: this.saleId,
        cid: this.customerId,
        orgId: this.orgId,
        mode: 'saleCreate',
        company: this.company,
        firstName: this.customerfirstname,
        secondName: this.customersecondname,
        surname: this.customersurname,
        saleName: this.saleName,
      },
    });
  }

  // update sale stage
  updateSaleStage(stage: string, statusName) {
    if (this.satusToSend != stage) {

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      let changeLogParams = {
        constructorName: this.constructor.name,
        userId: this.userId,
        userName: this.userName,
        prevSalesStage: this.commonService.getStatusName('sales', this.pipelineId, this.satusToSend),
        curSalesStage: this.commonService.getStatusName('sales', this.pipelineId, stage),
        changeLog: this.changeLog,
      };

      dialogConfig.data = {
        userId: this.superUserId,
        saleId: this.saleId,
        status: stage,
        saleStatus: this.saleStatus,
        currentStage: this.satusToSend,
        currentHistory: this.stageHistoryToSend,
        fieldNameSale: this.fieldNameSale,
        fieldNameItems: this.fieldNameItems,
        products: this.items,
        orderWonCheck: this.orderWonCheck,
        estValue: this.estimateAmount,
        changeLogParams: changeLogParams,
        rejectionReasonArr:
          this.saleSettings?.rejectionReason?.rejectionReason?.split(','), //reason for rejection options array
        rejectionReasonMandatory:
          this.saleSettings.rejectionReasonVal?.mandatory, //reason for rejection options  mandatory check
        rejectionReasonDisplay: this.saleSettings.rejectionReasonVal?.display, //whether to display/not reason for rejection
        disableReAssign: this.disableSaleEdit, //status edit disable on disable edit
        statusName: statusName, //stage id is passing as status variable, local variable for name
        pipelineId: this.pipelineId,
        statusFieldName: this.saleSettings.salesStage.displayName
      };

      this.dialog.open(
        ChangesalestatdialogComponent,
        dialogConfig
      );
    }
  }
  // update sale priority
  updateSalePriority(priority: string) {
    if (this.priority != priority) {
      const dialogConfig = new MatDialogConfig();
      let changeLogParams = {
        constructorName: this.constructor.name,
        userId: this.userId,
        userName: this.userName,
        prevPriority: this.priority,
        curPriority: priority,
        changeLog: this.changeLog,
      };
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      dialogConfig.data = {
        userId: this.superUserId,
        saleId: this.saleId,
        priority: priority,
        fieldNameSale: this.fieldNameSale,
        changeLogParams: changeLogParams,
      };

      this.dialog.open(
        ChangesaleprioritydialogComponent,
        dialogConfig
      );
    }
  }
  getStatusName(statusId){
    if(!!statusId){
      var result = this.saleStatus.filter(obj => {
        return obj.stageId === statusId
      })
      const statusName = result[0].name;
      return statusName ? statusName : 'N/A';
    }
  }
  // view sale
  onViewSale() {
    if (this.isMobilesize == false) {
      const dialogRef = this.dialog.open(Addnewsale1Component, {
        width: '800px',
        height: 'auto',
        disableClose: true,
        data: { scenario: 'view', id: this.saleId },
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((_result) => {});
    }
    if (this.isMobilesize == true) {
      this.router.navigate(['/addsale', 'view', this.saleId]);
    }
  }
  // edit sale
  onEditSale() {
    if (this.isMobilesize == false) {
      this.commonService.updateSaleToEdit(this.saleToedit);
      const dialogRef = this.dialog.open(Addnewsale1Component, {
        width: '800px',
        height: 'auto',
        disableClose: true,
        data: { scenario: 'edit', id: this.saleId },
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((_result) => {});
    }
    if (this.isMobilesize == true) {
      this.commonService.updateSaleToEdit(this.saleToedit);
      this.router.navigate(['/addsale', 'edit', this.saleId]);
    }
  }
  // add sale from Mobile
  onAddMob() {
    this.router.navigate(['/addsale', 'create']);
  }

  async sndMail(url) {
    this.sendemailpopup(url);
  }

  sendemailpopup(url) {
    this.dialog.open(ComposemailComponent, {
      width: '700px',
      data: {
        superuserid: this.superUserId,
        customerid: this.customerId,
        link: url,
      },
    });
  }
  // back in web toolbar
  onBack() {
    this.location.back();
  }
  // back in toolbar-mobile-route to sales list
  onBackMob() {
    this.router.navigate(['/dash/sales/salelist-mobileview']);
  }
  // route to contact details from web
  contactView() {
    this.router.navigate(['/dash/contact/customerdetails/', this.customerId]);
  }
  // route to contact details from mobile
  contactViewMob() {
    this.router.navigate(['/dash/contact/customerdetails/', this.customerId]);
  }
  // drag and drop attachment
  toggleHover(event: boolean) {
    this.isHovering = event;
  }
  onDrops(files: FileList) {
    this.fileBeingUploaded = true;
    this.ref.detectChanges();
    let date = new Date().getTime();
    let str;
    let downloadURL;
    let file;
    let size;
    let newSize;
    let sumSize = 0;
    let name =
      this.superUserDetails?.firstname + ' ' + this.superUserDetails?.lastname;
    // let datePlaced = new Date().getTime();
    for (let i = 0; i < files.length; i++) {
      if (files.length > 0) {
        str = files[0].name;
        file = files[0];
        size = files[0].size / 1024 / 1024;
      }
      sumSize = size + sumSize;

      newSize = this.attachmentSize + sumSize;
      if (newSize > this.totalUploadLimit && this.plan == 'diamond') {
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: 'diamond',
            size: this.uploadFileLimit.diamond,
          },
        });
      } else if (newSize > this.totalUploadLimit && this.plan == 'gold') {
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: 'gold',
            size: this.uploadFileLimit.gold,
          },
        });
      } else if (newSize > this.totalUploadLimit && this.plan == 'free') {
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: 'free',
            size: this.uploadFileLimit.free,
          },
        });
      } else {
        newSize = this.attachmentSize + sumSize;
        // update size before uploading to storage and collection, so that it will reflect to sum up if others are trying to upload
        this.salesdetailsService.updateSize(this.superUserId, newSize);

        const filePath = `attachment/${
          this.user.uid
        }/sale/${Date.now()}_${str}`;

        this.task = this.storage.upload(filePath, file);
        const ref = this.storage.ref(filePath);

        this.task
          .snapshotChanges()
          .pipe(
            finalize(async () => {
              downloadURL = await ref.getDownloadURL().toPromise();
              if (downloadURL) {
                this.salesdetailsService
                  .attachmentsToCollection(
                    this.superUserId,
                    name,
                    this.saleId,
                    str,
                    downloadURL,
                    filePath,
                    date,
                    size,
                    this.userName
                  )
                  .then((_res) => {
                    this.fileBeingUploaded = false;
                    this.ref.detectChanges();
                    this.snack.open('Attachment added successfully', '', {
                      duration: 500,
                    });
                  })
                  .catch((_e) => {
                    // revert the updated size if uploading failed
                    this.salesdetailsService.updateSize(
                      this.superUserId,
                      this.attachmentSize
                    );
                    this.fileBeingUploaded = false;
                  });
              } else {
                // revert the updated size if uploading failed
                this.salesdetailsService.updateSize(
                  this.superUserId,
                  this.attachmentSize
                );
              }
            })
          )
          .pipe(takeUntil(this.onDestroy$))
          .subscribe();
      }

      this.salesdetailsService.updateChangeLog(
        this.superUserId,
        'sales',
        this.saleId,
        ChangeLogComponent.saveLog(
          this.constructor.name,
          this.userId,
          this.userName,
          '',
          { addedAttachment: str },
          this.changeLog
        )
      );
    }
  }
  // create sale note
  onSubmitNote(form: NgForm, GAevent) {
    this.analytics.logEvent(GAevent);
    let createdDate = new Date().getTime();
    this.salesdetailsService.writeNote(
      form.value,
      this.superUserId,
      createdDate,
      this.saleId,
      this.userName,
      this.userId,
      ChangeLogComponent.saveLog(
        this.constructor.name,
        this.userId,
        this.userName,
        {},
        { addedNotes: form.value },
        this.changeLog
      )
    );
    form.reset(); //reset the form after writing the data
  }
  // update sale note
  onUpdateNote(notes) {
    if (this.prevNote != notes.notes) {
      const note = notes.notes;
      const noteId = notes.id;
      this.salesdetailsService.updateNote(
        note,
        this.superUserId,
        this.saleId,
        noteId,
        ChangeLogComponent.saveLog(
          this.constructor.name,
          this.userId,
          this.userName,
          { Notes: this.prevNote },
          { Notes: note },
          this.changeLog
        ),
        this.lastNoteId
      );
    }
    notes.isEditable = false;
  }
  // network check
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  // to make sale note in edit mode
  onEditNote(note) {
    note.isEditable = true;
    this.prevNote = note.notes;
  }
  inputAttachment() {
    let element: HTMLElement = document.getElementsByName(
      'attachmentSale'
    )[0] as HTMLElement;
    this.file.nativeElement.value = '';
    element.click();
  }
  inputAttachmentDoc(i, currentDocument) {
    let element: HTMLElement = document.getElementsByClassName(
      `customContactDocUpload_${i}`
    )[0] as HTMLElement;
    this.currentDocument = currentDocument;
    element.click();
  }
  shareClicked(attachmentid) {
    this.salesdetailsService
      .getsharedwithid(this.saleId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res2) => {
        if (res2.data()) {
          this.salesdetailsService
            .addinvoicetoshare(this.saleId, attachmentid)
            .then(() => {
              this.salesdetailsService.sendEmail({
                to: this.custData.email,
                template: {
                  name: 'sharedDoc',
                  data: {
                    userName: this.userName,
                    link: shareAttOrDocLink,
                  },
                },
                // html:"A document have been send to you by "+this.userData.companyName=="N/A"?this.userData.contactname:this.userData.companyName+". Click the link <a href=''>Click here</a> "
              });
              this.salesdetailsService.togglesharestatus(
                this.superUserId,
                attachmentid,
                this.saleId,
                true
              );
            });
        } else {
          this.salesdetailsService
            .initshareinvoice({
              saleID: this.saleId,
              userId: this.superUserId,
              customerEmail: this.custData.email,
              shareDate: Date.now(),
            })
            .then(() => {
              this.salesdetailsService
                .addinvoicetoshare(this.saleId, attachmentid)
                .then(() => {
                  this.salesdetailsService.sendEmail({
                    to: this.custData.email,
                    template: {
                      name: 'sharedDoc',
                      data: {
                        userName: this.userName,
                        link: shareAttOrDocLink,
                      },
                    },
                  });
                  this.salesdetailsService.togglesharestatus(
                    this.superUserId,
                    attachmentid,
                    this.saleId,
                    true
                  );
                });
            });
        }
      });
    // })
    this.snack.open('Shared attachment', null, { duration: 2000 });
  }
  // task row clicked function
  getRecord(id) {
    this.dialog.open(CrudModal1Component, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        id: id,
        mode: 'updateWithComments',
      },
    });
  }
  // add Product fromSales
  addProductSale() {
    const dialogRef2 = this.dialog.open(SalesAddProduct, {
      // minWidth: '400px',
      width: '700px',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: {
        scenario: 'add',
        userId: this.userId,
        superUserId: this.superUserId,
        accountType: this.accountType,
        fieldNameItems: this.fieldNameItems,
        prodCatArray: this.prodCatArray,
        productSettings: this.superUserDetails.productSettings
          ? this.superUserDetails.productSettings
          : null,
        itemsQtyDisplay: this.itemsQtyDisplay,
      },
    });
    dialogRef2
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          //append result to itemsArray
          if (this.items?.length > 0) {
            this.itemsArray[this.items.length] = {
              prodName: result[0],
              hsnCode: result[1] ? result[1] : ' ',
              prodDes: result[2] ? result[2] : ' ',
              currency: result[3],
              unitPrice: result[4] ? result[4] : 0,
              unit: result[5] ? result[5] : ' ',
              quantity: result[6],
              discount: result[7] ? result[7] : 0,
              cgst: result[8] ? result[8] : 0,
              sgst: result[9] ? result[9] : 0,
              igst: result[10] ? result[10] : 0,
              // availability:result[11],
              vatRate: result[11] ? result[11] : 0,
              taxType: result[12],
              productId: result[13],
              prodCategory: result[14] ? result[14] : '',
              additionalFieldsArr: result[15] ? result[15] : null,
            };
            this.addedProducts[0] = {
              productId: result[13],
              quantity: result[6],
              discount: result[7] ? result[7] : 0,
              unitPrice: result[4] ? result[4] : 0,
              prodName: result[0],
              prodCategory: result[14] ? result[14] : '',
            };
            this.changeLog = ChangeLogComponent.saveLog(
              this.constructor.name,
              this.userId,
              this.userName,
              '',
              { addedProducts: this.addedProducts },
              this.changeLog
            );
            this.salesdetailsService
              .updateItemField(
                this.superUserId,
                this.saleId,
                this.itemsArray,
                this.changeLog
              ) //save toDB
              .then((_res) => {
                let productEstValue = 0; //ensure 0 before adding up
                for (let i = 0; i < this.items.length; i++) {
                  productEstValue +=
                    this.items[i].unitPrice *
                    (1 - this.items[i].discount / 100) *
                    this.items[i].quantity;
                }
                // update estimated value
                this.salesdetailsService.updateSaleEstValue(
                  this.superUserId,
                  this.saleId,
                  productEstValue
                );
                this.snack.open('Successfully added', '', {
                  duration: 500,
                });
              })
              .catch((_e) => {
                this.snack.open(
                  'Error while adding ' + this.fieldNameItems,
                  '',
                  {
                    duration: 2000,
                  }
                );
              });
          } else {
            let itemsArr = <addFieldsArr>{};
            itemsArr[0] = {
              prodName: result[0],
              hsnCode: result[1] ? result[1] : ' ',
              prodDes: result[2] ? result[2] : ' ',
              currency: result[3],
              unitPrice: result[4] ? result[4] : 0,
              unit: result[5] ? result[5] : ' ',
              quantity: result[6],
              discount: result[7] ? result[7] : 0,
              cgst: result[8] ? result[8] : 0,
              sgst: result[9] ? result[9] : 0,
              igst: result[10] ? result[10] : 0,
              // availability:result[11],
              vatRate: result[11] ? result[11] : 0,
              taxType: result[12],
              productId: result[13],
              prodCategory: result[14] ? result[14] : '',
              additionalFieldsArr: result[15] ? result[15] : null,
            };
            this.addedProducts[0] = {
              productId: result[13],
              quantity: result[6],
              discount: result[7] ? result[7] : 0,
              unitPrice: result[4] ? result[4] : 0,
              prodName: result[0],
              prodCategory: result[14] ? result[14] : '',
            };
            this.changeLog = ChangeLogComponent.saveLog(
              this.constructor.name,
              this.userId,
              this.userName,
              '',
              { addedProducts: this.addedProducts },
              this.changeLog
            );
            this.salesdetailsService
              .updateItemField(
                this.superUserId,
                this.saleId,
                itemsArr,
                this.changeLog
              ) //save toDB
              .then((_res) => {
                let productEstValue = 0; //ensure 0 before adding up
                for (let i = 0; i < this.items.length; i++) {
                  productEstValue +=
                    this.items[i].unitPrice *
                    (1 - this.items[i].discount / 100) *
                    this.items[i].quantity;
                }
                // update estimated value
                this.salesdetailsService.updateSaleEstValue(
                  this.superUserId,
                  this.saleId,
                  productEstValue
                );
                this.snack.open('Successfully added', '', {
                  duration: 500,
                });
              })
              .catch((_e) => {
                this.snack.open(
                  'Error while adding ' + this.fieldNameItems,
                  '',
                  {
                    duration: 2000,
                  }
                );
              });
          }
        }
      });
  }
  // edit Product from Sales
  editProduct(product, index) {
    const oldProdEstValue =
      product.unitPrice * (1 - product.discount / 100) * product.quantity;
    const dialogRef2 = this.dialog.open(SalesAddProduct, {
      // minWidth: '400px',
      width: '700px',
      disableClose: true,
      data: {
        scenario: 'edit',
        userId: this.userId,
        superUserId: this.superUserId,
        accountType: this.accountType,
        product: product,
        fieldNameItems: this.fieldNameItems,
        productSettings: this.superUserDetails.productSettings
          ? this.superUserDetails.productSettings
          : null,
        itemsQtyDisplay: this.itemsQtyDisplay,
      },
    });
    let prevQuantity = product.quantity;
    let prevUnitPrice = product.unitPrice;
    let prevDiscount = product.discount;
    dialogRef2
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          const newProdEstValue = result[4] * (1 - result[7] / 100) * result[6];

          this.itemsArray[index] = {
            prodName: result[0],
            hsnCode: result[1] ? result[1] : ' ',
            prodDes: result[2] ? result[2] : ' ',
            currency: result[3],
            unitPrice: result[4] ? result[4] : 0,
            unit: result[5] ? result[5] : ' ',
            quantity: result[6],
            discount: result[7] ? result[7] : 0,
            cgst: result[8] ? result[8] : 0,
            sgst: result[9] ? result[9] : 0,
            igst: result[10] ? result[10] : 0,
            vatRate: result[11] ? result[11] : 0,
            taxType: result[12],
            productId: result[13],
            prodCategory: result[14] ? result[14] : '',
            additionalFieldsArr: result[15] ? result[15] : null,
          };

          this.items = Object.values(this.itemsArray); //array confirming
          let preVal = {};
          let curVal = {};
          preVal[0] = {};
          curVal[0] = {};
          if (prevQuantity != result[6]) {
            preVal[0] = { quantity: prevQuantity };
            curVal[0] = { quantity: result[6] };
          }
          if (prevDiscount != result[7]) {
            Object.assign(preVal[0], { discount: prevDiscount });
            Object.assign(curVal[0], { discount: result[7] ? result[7] : 0 });
          }
          if (prevUnitPrice != result[4]) {
            Object.assign(preVal[0], { unitPrice: prevUnitPrice });
            Object.assign(curVal[0], { unitPrice: result[4] ? result[4] : 0 });
          }
          if (Object.keys(preVal[0]).length && Object.keys(curVal[0]).length) {
            Object.assign(preVal[0], {
              id: result[13],
              productName: result[0],
            });
            Object.assign(curVal[0], {
              id: result[13],
              productName: result[0],
            });
            this.changeLog = ChangeLogComponent.saveLog(
              this.constructor.name,
              this.userId,
              this.userName,
              { prodFormArray: preVal },
              { prodFormArray: curVal },
              this.changeLog
            );
          }
          // save in DB
          this.salesdetailsService.updateItemField(
            this.superUserId,
            this.saleId,
            this.itemsArray,
            this.changeLog
          );

          if (oldProdEstValue !== newProdEstValue) {
            const updatedEstValue =
              this.estimateAmount - oldProdEstValue + newProdEstValue;
            // update estimated value
            this.salesdetailsService.updateSaleEstValue(
              this.superUserId,
              this.saleId,
              updatedEstValue
            );
          }
          this.snack.open('Successfully updated', '', {
            duration: 500,
          });
        }
      });
  }
  addProductSaleMob() {
    const queryParams = {
      scenario: 'add',
      userId: this.userId,
      superUserId: this.superUserId,
      accountType: this.accountType,
      fieldNameItems: this.fieldNameItems,
      saleId: this.saleId,
      estValue: this.estimateAmount,
      itemsQtyDisplay: this.itemsQtyDisplay,
    };

    const string = JSON.stringify(queryParams);
    this.router.navigate([
      `/dash/sales/saleview/${this.saleId}/add-product/${string}`,
    ]);
  }
  editProductMob(product) {
    const queryParams = {
      scenario: 'edit',
      userId: this.userId,
      superUserId: this.superUserId,
      accountType: this.accountType,
      productId: product.id,
      fieldNameItems: this.fieldNameItems,
      saleId: this.saleId,
      estValue: this.estimateAmount,
      itemsQtyDisplay: this.itemsQtyDisplay,
    };
    const string = JSON.stringify(queryParams);
    this.router.navigate([
      `/dash/sales/saleview/${this.saleId}/add-product/${string}`,
    ]);
  }
  // dlete product mobile
  deleteProductMob(product) {
    const oldProdEstValue4 =
      product.unitPrice * (1 - product.discount / 100) * product.quantity;
    const updatedEstValue4 = this.estimateAmount - oldProdEstValue4;

    this.salesdetailsService.deleteProduct(
      this.superUserId,
      this.saleId,
      product.id
    );
    this.salesdetailsService.updateSaleEstValue(
      this.superUserId,
      this.saleId,
      updatedEstValue4
    );
    this.snack.open(`${this.fieldNameItems} deleted`, '', {
      duration: 500,
    });
  }
  // delete product
  deleteProduct(product, i) {
    const oldProdEstValue3 =
      product.unitPrice * (1 - product.discount / 100) * product.quantity;
    const updatedEstValue3 = this.estimateAmount - oldProdEstValue3;

    const dialogRef2 = this.dialog.open(SalesAddProduct, {
      // width: '400px',
      disableClose: true,
      data: {
        scenario: 'delete',
        name: product.prodName,
        id: product.id,
        fieldNameItems: this.fieldNameItems,
      },
    });
    dialogRef2
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          // delete selected product
          this.items.splice(i, 1);
          let itemsArr = {};

          this.items.forEach((doc, index) => {
            itemsArr[index] = {
              prodName: doc.prodName,
              hsnCode: doc.hsnCode ? doc.hsnCode : '',
              prodDes: doc.prodDes,
              currency: doc.currency,
              unitPrice: doc.unitPrice,
              unit: doc.unit,
              quantity: doc.quantity,
              discount: doc.discount,
              cgst: doc.cgst,
              sgst: doc.sgst,
              igst: doc.igst,
              vatRate: doc.vatRate,
              taxType: doc.taxType,
              productId: doc.productId,
              prodCategory: doc.prodCategory ? doc.prodCategory : '',
              additionalFieldsArr: doc.additionalFieldsArr
                ? doc.additionalFieldsArr
                : null,
            };
          });
          this.deletedProducts[0] = {
            productId: product.productId,
            quantity: product.quantity,
            discount: product.discount,
            unitPrice: product.unitPrice,
            prodName: product.prodName,
            prodCategory: product.prodCategory,
          };
          this.changeLog = ChangeLogComponent.saveLog(
            this.constructor.name,
            this.userId,
            this.userName,
            '',
            { deletedProducts: this.deletedProducts },
            this.changeLog
          );
          // save to DB
          this.salesdetailsService.updateItemField(
            this.superUserId,
            this.saleId,
            itemsArr,
            this.changeLog
          );

          // update estimated value
          this.salesdetailsService.updateSaleEstValue(
            this.superUserId,
            this.saleId,
            updatedEstValue3
          );
          this.snack.open('Item deleted', '', {
            duration: 500,
          });
        }
      });
  }
  // edit and update task
  salesTaskUpdate(element) {
    this.commonService.updateTaskToEdit(element);
    this.dialog.open(CrudModal1Component, {
      width: '1060px',
      height: 'auto',
      disableClose: true,
      data: {
        id: element.id,
        mode: 'update',
      },
    });
  }
  //mark task as completed in tasks tab
  taskCompleted(taskId, status, changeLog) {
    this.dialog.open(ConfirmationpopupComponent, {
      data: {
        taskId: taskId,
        smode: 'taskcompleted',
        superId: this.superUserId,
        currentStatus: status,
        lastStatus: this.lastStatusOption,
        changeLog: changeLog,
        constructorName: this.constructor.name,
      },
    });
    this.ref.detectChanges();
  }
  //find the discounted rate
  getDiscountedRate(unitPrice: number, discount: number) {
    let discountVal = (unitPrice * discount) / 100;
    let discountedRate = unitPrice - discountVal;
    return discountedRate;
  }
  getCreatedByName(userId) {
    let createdByName = '';
    let obj = this.allSubUsers.find((o) => o.userId === userId);
    if (!!obj) {
      createdByName = obj.lastname
        ? obj.firstname + ' ' + obj.lastname
        : obj.firstname;
    }
    return createdByName;
  }

  // tab change in web and corresponding data fetch from DB
  tabClickWeb(tab) {
    this.activetab = tab.tab.textLabel;
    if (this.activetab == 'Taks') {
      //all tasks fetching
      this.allTasksSubscription = this.salesdetailsService
        .getAllTasks(
          this.superUserId,
          this.userId,
          this.saleId,
          this.usrProfileData.taskDataAccessRule,
          this.accountType
        )
        .subscribe((data) => {
          this.tasksAll = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Task;
          });
          this.dataSourceTask = new MatTableDataSource([]);
          this.dataSourceTask = this.tasksAll;

          this.progressBarStatus = true;
        });
    }
  }

  // update assignedto from sales details
  updateAssignedTo(assignedTo) {
    this.dialog.open(ConfirmAssignedto, {
      width: '500px',
      data: {
        scenario: 'assigned',
        assignedTo,
        userId: this.superUserId,
        saleId: this.saleId,
        fieldNameSale: this.fieldNameSale,
      },
    });
  }

  assignedToEventHander($event: any) {
    if ($event !== null) {
      let currAss = $event;
      let currAssName;
      let assBranch;

      for (let i = 0; i < this.allSubUsers.length; i++) {
        if (currAss === this.allSubUsers[i].userId) {
          currAssName = this.allSubUsers[i].lastname
            ? this.allSubUsers[i].firstname + this.allSubUsers[i].lastname
            : this.allSubUsers[i].firstname;

          if (this.allSubUsers[i].branchId) {
            assBranch = this.allSubUsers[i].branchId;
          } else {
            assBranch = 'NA';
          }
        }
      }

      const dialogRef = this.dialog.open(ConfirmAssignedto, {
        autoFocus: false,
        width: '500px',
        data: {
          scenario: 'assigned',
          userId: this.superUserId,
          saleId: this.saleId,
          fieldNameSale: this.fieldNameSale,
          fieldNameTask: this.fieldNameTask,
          fieldNameFollowup: this.fieldNameFollowup,
          fieldNameEstimate: this.fieldNameEstimate,
          fieldNameQuotation: this.fieldNameQuotation,
          fieldNameInvoice: this.fieldNameInvoice,
          checked: false,
          prevAssigned: this.assignedToName,
          currAssigned: currAssName,
        },
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          this.saleAssignedTo = currAss;

          if (this.saleAssignedTo) {
            this.saleAssignedToName = currAssName;
            this.associatedBranch = assBranch;
            let prevVal = {
              assignedTo: this.assignedTo,
              assignedToName: this.assignedToName,
              ...(this.branches.length > 0 && {
                associatedBranch: this.branches.find(
                  (item) => item.id === this.prevAssBranch
                )?.name
                  ? this.branches.find((item) => item.id === this.prevAssBranch)
                      ?.name
                  : 'None',
              }),
            };
            let curVal = {
              assignedTo: this.saleAssignedTo,
              assignedToName: this.saleAssignedToName,
              ...(this.branches.length > 0 && {
                associatedBranch: this.branches.find(
                  (item) => item.id === this.associatedBranch
                )?.name
                  ? this.branches.find(
                      (item) => item.id === this.associatedBranch
                    )?.name
                  : 'None',
              }),
            };
            if (this.assignedTo != this.saleAssignedTo) {
              if (result.checked === true) {
                this.salesdetailsService.updateAssignedTo(
                  this.superUserId,
                  this.saleId,
                  this.saleAssignedTo,
                  this.saleAssignedToName,
                  this.associatedBranch,
                  ChangeLogComponent.saveLog(
                    this.constructor.name,
                    this.userId,
                    this.userName,
                    prevVal,
                    curVal,
                    this.changeLog
                  )
                );

                const tasksFiltered = this.taskss.filter((ele) => {
                  return ele.assignedTo === this.assignedTo;
                });

                tasksFiltered.forEach((ele) => {
                  this.salesdetailsService.onUpdateTask(
                    this.superUserId,
                    ele.id,
                    this.saleAssignedTo,
                    this.saleAssignedToName,
                    this.associatedBranch,
                    ChangeLogComponent.saveLog(
                      this.constructor.name,
                      this.userId,
                      this.userName,
                      prevVal,
                      curVal,
                      ele.changeLog
                    )
                  );
                }); //update in task collection

                const follsFiltered = this.followUps.filter((ele) => {
                  return ele.assignedTo === this.assignedTo;
                });

                follsFiltered.forEach((ele) => {
                  this.salesdetailsService.onUpdateFollowUp(
                    this.superUserId,
                    ele.id,
                    this.saleAssignedTo,
                    this.saleAssignedToName,
                    this.associatedBranch,
                    ChangeLogComponent.saveLog(
                      this.constructor.name,
                      this.userId,
                      this.userName,
                      prevVal,
                      curVal,
                      this.changeLog
                    )
                  );
                }); //update in followups collection
                let assigned = this.assignedTo;
                await this.getEstimatesReassign(assigned);
                await this.getQuotationsReassign(assigned);
                await this.getInvoicesReassign(assigned);

                this.snack.open('Successfully updated', '', {
                  duration: 2000,
                });
              } else {
                this.salesdetailsService.updateAssignedTo(
                  this.superUserId,
                  this.saleId,
                  this.saleAssignedTo,
                  this.saleAssignedToName,
                  this.associatedBranch,
                  ChangeLogComponent.saveLog(
                    this.constructor.name,
                    this.userId,
                    this.userName,
                    prevVal,
                    curVal,
                    this.changeLog
                  )
                );
                this.snack.open('Successfully updated', '', {
                  duration: 2000,
                });
              }
            }
          }
        } else {
          this.saleAssignedTo = null;
          this.saleAssignedToName = null;
        }
      });
    }
  }
  async getEstimatesReassign(assignedTo) {
    let estimates = await this.salesdetailsService.getDocsWithSale(
      this.superUserId,
      this.saleId,
      assignedTo,
      'Estimates'
    );
    estimates.forEach((ele) => {
      this.salesdetailsService.onUpdateDocs(
        this.superUserId,
        ele.id,
        'Estimates',
        this.saleAssignedTo
      );
    }); //update in estimates collection
  }
  async getQuotationsReassign(assignedTo) {
    let quotations = await this.salesdetailsService.getDocsWithSale(
      this.superUserId,
      this.saleId,
      assignedTo,
      'Quotations'
    );
    quotations.forEach((ele) => {
      this.salesdetailsService.onUpdateDocs(
        this.superUserId,
        ele.id,
        'Quotations',
        this.saleAssignedTo
      );
    }); //update in quotations collection
  }
  async getInvoicesReassign(assignedTo) {
    let invoices = await this.salesdetailsService.getDocsWithSale(
      this.superUserId,
      this.saleId,
      assignedTo,
      'Invoices'
    );
    invoices.forEach((ele) => {
      this.salesdetailsService.onUpdateDocs(
        this.superUserId,
        ele.id,
        'Invoices',
        this.saleAssignedTo
      );
    }); //update in quotations collection
  }
  assignedToNameEventHander(_$event: any) {
    // this.saleAssignedToName = $event;
  }

  branchIdEventHandler($event: any) {
    this.associatedBranch = $event;
    let prevVal = {
      associatedBranch:
        this.branches.length > 0
          ? this.branches.find((item) => item.id === this.prevAssBranch)?.name
            ? this.branches.find((item) => item.id === this.prevAssBranch)?.name
            : 'None'
          : '',
    };
    let curVal = {
      associatedBranch:
        this.branches.length > 0
          ? this.branches.find((item) => item.id === this.associatedBranch)
              ?.name
          : '',
    };
    if (
      this.associatedBranch !== null &&
      this.prevAssBranch != this.associatedBranch
    ) {
      this.salesdetailsService.updateBranch(
        this.superUserId,
        this.saleId,
        this.associatedBranch,
        ChangeLogComponent.saveLog(
          this.constructor.name,
          this.userId,
          this.userName,
          prevVal,
          curVal,
          this.changeLog
        )
      );
      this.snack.open('Successfully updated', '', {
        duration: 2000,
      });
    }
  }

  // on destroy function
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.initClientSubscription.unsubscribe();
    this.QuoteSubscription?.unsubscribe();
    this.EstSubscription?.unsubscribe();
    this.InvSubscription?.unsubscribe();
    this.collectionSubscription?.unsubscribe();
    this.notesSubscription?.unsubscribe();
    this.attachmentSubscription?.unsubscribe();
    this.allTasksSubscription?.unsubscribe();
    this.taskSubscription?.unsubscribe();
    this.expenseSubscription?.unsubscribe();
    this.productsSubscription?.unsubscribe();
    this.custSubscription?.unsubscribe();
    this.commonServSubscription?.unsubscribe();
    this.allFolowupSubscription?.unsubscribe();
  }
  onPlayAudio(resourceURL) {
    this.dialog.open(CallViewAudioPlayerComponent, {
      width: '500px',
      data: resourceURL,
    });
  }
  // to call the autocall api and pass all the details with conatct numbet
  onCall() {
    if (
      this.enableOutboundCallsViaCallBridging &&
      this.contactNumber &&
      this.userNumber
    ) {
      let customerName;

      if (this.saleToedit.secondName && this.saleToedit.surname) {
        // if second name & surname is there
        customerName =
          this.saleToedit.firstName +
          ' ' +
          this.saleToedit.secondName +
          ' ' +
          this.saleToedit.surname;
      } else if (this.saleToedit.secondName && !this.saleToedit.surname) {
        customerName = this.saleToedit.firstName + ' ' + this.saleToedit.secondName;
      } else if (!this.saleToedit.secondName && this.saleToedit.surname) {
        customerName = this.saleToedit.firstName + ' ' + this.saleToedit.surname;
      } else {
        customerName = this.saleToedit.firstName;
      }

      let minute = new Date().getMinutes();
      let hour = new Date().getHours();
      let startTime = hour + ':' + minute;
      this.commonService
        .onAutoCall(
          this.userNumber,
          this.contactNumber,
          this.superUserId,
          this.userId,
          this.userName,
          this.saleToedit.companyName,
          this.customerId,
          customerName,
          startTime,
          null,
          this.autoCallToken,
          this.DIDNumber,
          this.saleToedit.orgId ? this.saleToedit.orgId : '',
          this.saleToedit.associatedBranch
            ? this.saleToedit.associatedBranch
            : 'none',
          this.callBridgingExtension,
          this.outboundCallBridgingType,
         this.saleName,
         this.saleId,
         null,
         null
        )
        .subscribe((_data: any) => { });
      this.snack.open('Initiating Call', '', {
        duration: 2000,
      });
    }
  }
  // to call the autocall api and pass all the details with alternate number
  onCallAlternate() {
    if (
      this.enableOutboundCallsViaCallBridging &&
      this.altContactNumber &&
      this.userNumber
    ) {
      let minute = new Date().getMinutes();
      let hour = new Date().getHours();
      let startTime = hour + ':' + minute;
      let customerName;
      if (this.saleToedit.secondName && this.saleToedit.surname) {
        // if second name & surname is there
        customerName =
          this.saleToedit.firstName +
          ' ' +
          this.saleToedit.secondName +
          ' ' +
          this.saleToedit.surname;
      } else if (this.saleToedit.secondName && !this.saleToedit.surname) {
        customerName = this.saleToedit.firstName + ' ' + this.saleToedit.secondName;
      } else if (!this.saleToedit.secondName && this.saleToedit.surname) {
        customerName = this.saleToedit.firstName + ' ' + this.saleToedit.surname;
      } else {
        customerName = this.saleToedit.firstName;
      }
      this.commonService
        .onAutoCall(
          this.userNumber,
          this.altContactNumber,
          this.superUserId,
          this.userId,
          this.userName,
          this.saleToedit.companyName,
          this.customerId,
          customerName,
          startTime,
          null,
          this.autoCallToken,
          this.DIDNumber,
          this.saleToedit.orgId ? this.saleToedit.orgId : '',
          this.saleToedit.associatedBranch
            ? this.saleToedit.associatedBranch
            : 'none',
          this.callBridgingExtension,
          this.outboundCallBridgingType,
          this.saleName,
          this.saleId,
          null,
          null
        )
        .subscribe((_data: any) => { });
      this.snack.open('Initiating Call', '', {
        duration: 2000,
      });
    }
  }
  onCallFollowUp(id,data) {
    if (
      this.enableOutboundCallsViaCallBridging &&
      this.contactNumber &&
      this.userNumber
    ) {
      let minute = new Date().getMinutes();
      let hour = new Date().getHours();
      let startTime = hour + ':' + minute;
      this.commonService
        .onAutoCall(
          this.userNumber,
          this.contactNumber,
          this.superUserId,
          this.userId,
          this.userName,
          data.companyName,
          this.customerId,
          data.customerName,
          startTime,
          id,
          this.autoCallToken,
          this.DIDNumber,
          data.orgId ? data.orgId : '',
          data.associatedBranch
            ? data.associatedBranch
            : 'none',
          this.callBridgingExtension,
          this.outboundCallBridgingType,
          data.saleTitle ? data.saleTitle:null,
          data.saleId ? data.saleId:null,
          data.serviceTitle ? data.serviceTitle:null,
          data.serviceId ? data.serviceId:null,
        )
        .subscribe((_data: any) => {});
      this.snack.open('Initiating Call', '', {
        duration: 2000,
      });
    }
  }
  getContact(id) {
    return new Promise<void>((resolve) => {
      this.commonService
        .getContact(this.superUserId, id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.contactDetails = data;
          resolve();
        });
    });
  }
  // create followupos in web
  async onCreateFollowUps() {
    let customerName;

    if (this.customersecondname && this.customersurname) {
      // if second name & surname is there
      customerName =
        this.customerfirstname +
        ' ' +
        this.customersecondname +
        ' ' +
        this.customersurname;
    } else if (this.customersecondname && !this.customersurname) {
      customerName = this.customerfirstname + ' ' + this.customersecondname;
    } else if (!this.customersecondname && this.customersurname) {
      customerName = this.customerfirstname + ' ' + this.customersurname;
    } else {
      customerName = this.customerfirstname;
    }
    await this.getContact(this.customerId);
    this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: this.customerId,
        companyNames: this.company,
        customerNames: customerName,
        contactNumber: this.contactDetails.contactNo ? this.contactDetails.contactNo:'', // pass customer number
        countryCode: this.contactDetails.code ? this.contactDetails.code:'', // pass customer country code
        assignedTo: this.custData.assignedTo,
        assignedToName: this.commonService.getAssignedToName(
          this.custData.assignedTo
        ),
        scenario: 'create from sale',
        subUsers: this.subUsers,
        fname: this.superUserDetails.firstname,
        lastname: this.superUserDetails.lastname,
        saleId: this.saleId,
        saleTitle: this.saleName,
        orgId: this.orgId,
      },
    });
  }
  // if followup completed update in followup collection and in customer details
  markasCompleted(taskId: string, changeLog) {
    let completed = true;
    let newChangeLog = ChangeLogComponent.saveLog(
      this.constructor.name,
      this.userId,
      this.userName,
      {completedStatus: false},
      {completedStatus: true},
      changeLog
    );
    this.servicedetailsService.UpdateTask(taskId, completed, this.superUserId, newChangeLog);
    this.snack.open(this.fieldNameFollowup + ' task closed', '', {
      duration: 2000,
    });
  }
  // edit followup
  onEditFollowUps(taskId: string, followUpData: FollowUps) {
    this.commonService.followUpDetails = followUpData;
    if (this.customersecondname && this.customersurname) {
      // if second name & surname is there
      this.customerName =
        this.customerfirstname +
        ' ' +
        this.customersecondname +
        ' ' +
        this.customersurname;
    } else if (this.customersecondname && !this.customersurname) {
      this.customerName =
        this.customerfirstname + ' ' + this.customersecondname;
    } else if (!this.customersecondname && this.customersurname) {
      this.customerName = this.customerfirstname + ' ' + this.customersurname;
    } else {
      this.customerName = this.customerfirstname;
    }
    this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: this.customerId,
        companyNames: this.company,
        customerNames: this.customerName,
        contactNumber: followUpData.contactNumber ? followUpData.contactNumber:'', // pass customer number
        countryCode: followUpData.countryCode ? followUpData.countryCode:'', // pass customer country code
        scenario: 'edit',
        followUpId: taskId,
        subUsers: this.subUsers,
        fname: this.superUserDetails.firstname,
        lastname: this.superUserDetails.lastname,
      },
    });
  }

  // make call
  onNormalCall() {
    if (this.custData.contactNo) {
      window.location.href = 'tel:' + this.custData.contactNo;
    } else {
      this.snack.open('Please add contact number', '', {
        duration: 2000,
      });
    }
  }

  // to send whatsapp message
  async onWhatsAppContact() {
    //first fetch whatsapp sale templates
    await this.getAllSaleWaTemp();
  }
  // Db fetch all templates related to whatsapp and sale
  getAllSaleWaTemp() {
    return new Promise<void>((resolve) => {
      this.salesdetailsService
        .getAllSaleWaTemp(this.superUserId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.saleWaTemp = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as messageTemplateModel;
          });
          resolve();
        });
    });
  }
  // if a template is selected to send whatspp message
  selectTemplate(selectedTempl) {
    let ass = null;

    if (this.subUsers?.length > 0) {
      ass = this.subUsers?.find(
        (subuser) => subuser.userId === this.assignedTo
      );
    }
    var contact = this.custData;
    var sale = this.saleToedit;
    const code = this.custData.code?.replace('+', '');

    var assignedTo = {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
    };
    // to replace assigned to user values, check if its a subuser/superuser,
    // so that replace from subuser array/to replace data with superuser details
    if (ass === null || typeof ass === 'undefined') {
      assignedTo.firstname = this.superUserDetails.firstname;
      assignedTo.lastname = this.superUserDetails.lastname
        ? this.superUserDetails.lastname
        : '';
      assignedTo.email = this.superUserDetails.email
        ? this.superUserDetails.email
        : 'Email not provided';
      assignedTo.phone = this.superUserDetails.phone
        ? `${this.superUserDetails.countryCode}${this.superUserDetails.phone}`
        : 'Contact Number not provided';
    } else {
      assignedTo.firstname = ass.firstname;
      assignedTo.lastname = ass.lastname ? ass.lastname : '';
      assignedTo.email = ass.email ? ass.email : 'Email not provided';
      assignedTo.phone = ass.contactNo
        ? `${ass.code}${ass.contactNo}`
        : 'Contact Number not provided';
    }
    // if without template is selected, no replacement of fields, no phone number
    if (selectedTempl === 'noTemplate') {
      window.open(
        `https://web.whatsapp.com/send?phone=${code}${this.custData.contactNo}`,
        '',
        'width=800,height=600'
      );
    } else {
      // replacing body merged fields
      var str: any = selectedTempl.body
        .replace(/\#\[sale.Sale Title\]/g, sale.saleTitle)
        .replace(/\#\[sale.Estimated Value\]/g, sale.estimatedValue)
        .replace(/\#\[sale.Start Date\]/g, this.convertDate(sale.startDate))
        .replace(
          /\#\[sale.Expected Completion Date\]/g,
          this.convertDate(sale.expCompletionDate)
        )
        .replace(/\#\[sale.Stage\]/g, this.commonService.getStatusName('sales', sale.selectedSalePipeline,sale.salesStage))
        .replace(/\#\[sale.Priority\]/g, sale.priority)
        .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
        .replace(
          /\#\[sale.Description\]/g,
          sale.description ? sale.description : 'Sale Description not provided'
        )
        .replace(/\#\[contact.Company Name\]/g, contact.companyName)
        .replace(/\#\[contact.First Name\]/g, contact.firstName)
        .replace(
          /\#\[contact.Second Name\]/g,
          contact.secondName ? contact.secondName : ''
        )
        .replace(
          /\#\[contact.Contact No\]/g,
          contact.contactNo ? contact.contactNo : 'Contact Number not provided'
        )
        .replace(
          /\#\[contact.Email\]/g,
          contact.email ? contact.email : 'Email not provided'
        )
        .replace(/\#\[contact.Priority\]/g, contact.priority)
        .replace(/\#\[contact.Status\]/g, this.commonService.getStatusName('customers', contact.selectedContactPipeline, contact.status))
        .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
        .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
        .replace(
          /\#\[user.Last Name\]/g,
          assignedTo.lastname ? assignedTo.lastname : ''
        )
        .replace(
          /\#\[user.Contact No\]/g,
          assignedTo.phone ? assignedTo.phone : 'Contact Number not provided'
        )
        .replace(/\#\[user.Email\]/g, assignedTo.email ? assignedTo.email : '');
      //replace contact additional fields
      if (this.superUserDetails.customFieldsContact) {
        let teststring = str;
        for (
          let i = 0;
          i < this.superUserDetails.customFieldsContact.length;
          i++
        ) {
          var str1 =
            '\\#\\[contact.' +
            this.superUserDetails.customFieldsContact[i].fieldName +
            '\\]';
          var re = new RegExp(str1, 'g');
          teststring = teststring.replace(
            re,
            contact.additionalFieldsArr
              ? contact.additionalFieldsArr[i + '']?.fieldValue
                ? this.superUserDetails.customFieldsContact[i].fieldType ==
                  'date'
                  ? typeof contact.additionalFieldsArr[i + ''].fieldValue ==
                    'object'
                    ? this.convertDate(
                        contact.additionalFieldsArr[i + ''].fieldValue
                      )
                    : 'Date not provided'
                  : this.superUserDetails.customFieldsContact[i].fieldType ==
                    'date_time'
                  ? this.convertDateTime(
                      contact.additionalFieldsArr[i + ''].fieldValue
                    )
                  : contact.additionalFieldsArr[i + '']?.fieldValue
                : 'Value not provided'
              : 'Value not provided'
          );
        }
        str = teststring;
      }
      if (this.superUserDetails.customFieldsSale) {
        let teststring = str;
        for (
          let i = 0;
          i < this.superUserDetails.customFieldsSale.length;
          i++
        ) {
          var str1 =
            '\\#\\[sale.' +
            this.superUserDetails.customFieldsSale[i].fieldName +
            '\\]';
          var re = new RegExp(str1, 'g');
          teststring = teststring.replace(
            re,
            sale.additionalFieldsArr
              ? sale.additionalFieldsArr[i + '']?.fieldValue
                ? this.superUserDetails.customFieldsSale[i].fieldType == 'date'
                  ? typeof sale.additionalFieldsArr[i + ''].fieldValue ==
                    'object'
                    ? this.convertDate(
                        sale.additionalFieldsArr[i + ''].fieldValue
                      )
                    : 'Date not provided'
                  : this.superUserDetails.customFieldsSale[i].fieldType ==
                    'date_time'
                  ? this.convertDateTime(
                      sale.additionalFieldsArr[i + ''].fieldValue
                    )
                  : sale.additionalFieldsArr[i + '']?.fieldValue
                : 'Value not provided'
              : 'Value not provided'
          );
        }
        str = teststring;
      }

      const convStr = this.convertToPlain(str);
      const convStr1 = encodeURIComponent(convStr);

      if (convStr1) {
        window.open(
          `https://web.whatsapp.com/send?phone=${code}${this.custData.contactNo}&text=${convStr1}`,
          '',
          'width=800,height=600'
        );
      }
    }
  }
  // function to retrieve message body saved as html string
  convertToPlain(htmlString) {
    let html = htmlString.replace(/<\/div>/g, '</div>\n');
    html = html.replace(/<\/p>/g, '</p>\n');

    // Create a new div element
    var tempDivElement = document.createElement('div');

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element
    return tempDivElement.textContent || tempDivElement.innerText || '';
  }
  // to convert date and time from timestamp to string
  convertDateTime(date) {
    if (date && typeof date === 'object') {
      const n = date.toDate();
      let d = n.toLocaleString('en-GB');
      return d;
    } else {
      return 'Invalid date/date not provided';
    }
  }
  // to convert dates in additional field in message body
  convertDate(date) {
    if (date) {
      var d = new Date(date.toDate());
      var month;
      var day;
      var year;
      (month = '' + (d.getMonth() + 1)),
        (day = '' + d.getDate()),
        (year = d.getFullYear());

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [day, month, year].join('-');
    }
  }
}
// confirm assigned to popup
@Component({
  selector: 'confirm-assignedto',
  templateUrl: 'confirm-assignedto.html',
  styleUrls: ['./salesdetails.component.scss'],
})
export class ConfirmAssignedto {
  constructor(
    public dialogRef1: MatDialogRef<ConfirmAssignedto>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}

  onNoClick(): void {
    this.dialogRef1.close();
  }
}

// salesProduct popup class starts
@Component({
  selector: 'sales-add-product',
  templateUrl: 'sales-add-product.html',
  styleUrls: ['./salesdetails.component.scss'],
})
export class SalesAddProduct {
  products: ProductModel[] = [];
  superUserId: string;
  selectedProduct: ProductModel;
  prodSelected: boolean = false;

  productName: string;
  productCode: string;
  productDes: string;
  additionalFieldsArr: any;
  currency: string;
  unitPrice: number;
  unit: string;
  taxType: string;
  discount: number;
  cgst: number;
  sgst: number;
  igst: number;
  availability: boolean = false;
  vatRate: number;
  currencyList = [];
  prodUnitaArray: string[] = [];
  pUnits: ProductUnits = null;

  quantity: number = 1;

  myControl = new FormControl('');
  filteredOptions: Observable<ProductModel[]>;
  myControlCat = new FormControl('');
  filteredOptionsCat: Observable<string[]>;

  Obj: any;
  isMobilesize: boolean = false;
  productId = '';
  productCategory = '';
  estValue = 0;
  oldEstValue = 0;
  prodCatArray: string[] = [];
  selProdCat = '';
  productSettings: ProductSettings = defaultProductSettings.CONST_VALUE;
  saleSettings: saleSettings = defaultSaleSettings.CONST_VALUE;
  itemsQtyDisplay = false;

  constructor(
    @Optional() public dialogRef: MatDialogRef<SalesAddProduct>,
    private serviceInstance: SalesdetailsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private location: Location,
  ) {
    if (!data) {
      route.params.subscribe((_val) => {
        this.Obj = this.route.snapshot.paramMap.get('Obj');
        this.data = JSON.parse(this.Obj);
        this.estValue = this.data.estValue;
      });
      //Check the screen size
      this.isMobilesize = this.commonService.isMobilesize;
    }

    this.currencyList = Currencies.getCurencies();
    this.prodUnitaArray = this.getunits();
    if (data) {
      if (
        typeof data.productSettings !== 'undefined' &&
        data.productSettings !== null
      ) {
        this.productSettings = data.productSettings;
      }
    }

    if (this.data.scenario == 'edit') {
      this.prodSelected = true;
      this.productName = data.product.prodName;
      this.productCode = data.product.hsnCode;
      this.productDes = data.product.prodDes;
      this.additionalFieldsArr = data.product.additionalFieldsArr;
      this.currency = data.product.currency;
      this.unitPrice = data.product.unitPrice;
      this.unit = data.product.unit;
      this.taxType = data.product.taxType;
      this.discount = data.product.discount;
      this.cgst = data.product.cgst;
      this.sgst = data.product.sgst;
      this.igst = data.product.igst;
      this.availability = data.product.availability;
      this.vatRate = data.product.vatRate;
      this.quantity = data.product.quantity;
      this.productId = data.product.productId;
    }
    this.superUserId = this.data.superUserId;
    this.itemsQtyDisplay = this.data.itemsQtyDisplay;

    // if scenario is create, we need all products to fetch from DB
    if (this.superUserId) {
      this.prodCatArray = this.data.prodCatArray;
      if (this.data.scenario == 'add') {
        this.serviceInstance
          .getProducts(this.superUserId)
          .subscribe((products) => {
            this.products = products.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as ProductModel;
            });
            // for auto-complete starts

            this.filteredOptionsCat = this.myControlCat.valueChanges.pipe(
              startWith(''),
              map((value) => this._filterCat(value || ''))
            );
            this.filteredOptions = this.myControl.valueChanges.pipe(
              startWith(''),

              map((value) =>
                typeof value === 'string' ? value : value.fname1
              ),
              map((fname1) => this._filter(fname1))
            );
          });
      }
    }
  }

  private _filterCat(value: string): string[] {
    this.myControl.patchValue('');
    //disable add product icon
    this.prodSelected = false;
    const filterValue = value.toLowerCase();

    return this.prodCatArray.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  categorySelected(optionSelected) {
    if (this.data?.scenario === 'edit') {
      this.data.prodCategory = optionSelected;
    } else {
      this.productCategory = optionSelected;
    }
  }
  onBack() {
    this.location.back();
  }

  private _filter(value: string): ProductModel[] {
    let category = this.myControlCat.value
      ? this.myControlCat.value.toLowerCase()
      : '';
    //value entered in the input box
    const filterValue = value != undefined ? value.toLowerCase() : '';
    //filterlist contains all the values filtered according to category
    let filterList = [];

    //filterlist should contains products based on category
    filterList = this.products.filter((option) =>
      option.prodCategory?.toLowerCase().includes(category)
    );

    //return filterlist to display in search autocomplete
    return filterList.filter((option) =>
      option.prodName.toLowerCase().includes(filterValue)
    );
  }
  //clear product category value
  clearCategory() {
    //clear category and product values on clearing category
    this.myControlCat.patchValue('');
    this.myControl.patchValue('');

    //disable add product icon
    this.prodSelected = false;
  }
  clearProduct() {
    this.myControl.patchValue('');
    //disable add product icon
    this.prodSelected = false;
  }
  // autoComplete display function
  displayFn(subject) {
    return subject ? subject.prodName : undefined;
  }

  onNoClick1(): void {
    this.dialogRef.close();
  }

  productSelected() {
    this.selectedProduct = this.myControl.value;
    if (this.selectedProduct) {
      if (this.selectedProduct.id) {
        for (let i = 0; i < this.products.length; i++) {
          if (this.selectedProduct.id == this.products[i].id) {
            this.prodSelected = true;
            this.productName = this.selectedProduct.prodName;
            this.productCode = this.selectedProduct.hsnCode;
            this.productDes = this.selectedProduct.prodDes;
            this.additionalFieldsArr = this.selectedProduct.additionalFieldsArr;
            this.currency = this.selectedProduct.currency;
            this.unitPrice = this.selectedProduct.unitPrice;
            this.unit = this.selectedProduct.unit;
            this.taxType = this.selectedProduct.taxType;
            this.discount = this.selectedProduct.discount;
            this.cgst = this.selectedProduct.cgst;
            this.sgst = this.selectedProduct.sgst;
            this.igst = this.selectedProduct.igst;
            this.availability = this.selectedProduct.availability;
            this.vatRate = this.selectedProduct.vatRate;
            this.productId = this.selectedProduct.id;
            this.productCategory = this.selectedProduct.prodCategory;
          }
        }
      } else {
        this.prodSelected = false;
      }
    } else {
      this.prodSelected = false;
    }
  }
  // get Units
  getunits(): string[] {
    this.pUnits = new ProductUnits();
    return this.pUnits.prodUnits;
  }
}
// salesProduct popup class ends
