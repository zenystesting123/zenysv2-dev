import { animate, style, transition, trigger } from '@angular/animations';
import { DOCUMENT, Location } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { finalize, map, startWith, takeUntil } from 'rxjs/operators';
import { GoogleCalendarEventService } from 'src/app/calendar-events/google-calendar-event.service';
import { CommonService } from 'src/app/common.service';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { CrudServiceComponent } from 'src/app/crud-service/crud-service.component';
import {
  Attachments,
  CustomerNotes,
  defaultServiceSettings,
  Expenses,
  FollowUps,
  Invoice,
  messageTemplateModel,
  paymentDetails,
  PaymentReceipt,
  PlanDocLimit,
  ProductInSaleModel,
  ProductModel,
  ProductUnits,
  Profile,
  SalesNotes,
  Service,
  serviceSettings,
  StageValues,
  Task,
  UserAccessDetails,
  deleteLogModel,
  taggedUsers,
  paymentSettings,
  defaultPaymentSettings,
  tagUsers,
  shareAttOrDocLink,
  defaultContactSettings,
  contactSettings,
  StageHistoryModel
} from 'src/app/data-models';
import { Expenses1Component } from 'src/app/expenses1/expenses1.component';
import { FullLayoutComponent } from 'src/app/full-layout/full-layout.component';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { Paymentreceipt1Component } from 'src/app/paymentreceipt1/paymentreceipt1.component';
import { CrudModal1Component } from 'src/app/taskboard/crud-modal1/crud-modal1.component';
import { ServiceDetailsService } from './service-details.service';
import * as firebase from 'firebase';
import { ComposemailComponent } from 'src/app/gmail/composemail/composemail.component';
import { FormControl, NgForm } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { Currencies } from 'src/app/currencies';
import { HttpClient } from '@angular/common/http';
import { CallViewAudioPlayerComponent } from 'src/app/call-view-audio-player/call-view-audio-player.component';
import { FollowupTaskCreateComponent } from 'src/app/followup-task-create/followup-task-create.component';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { Pipelines } from 'src/app/model/pipeline.modal';
export interface ExpensesData {
  cid: string;
  sid: string;
  mode: string;
  serviceTitle: string;
  csname: string;
  cfname: string;
  company: string;
  expenseId: string;
} //data model to send for expense popup and bottomsheet
export interface DialogData1 {
  customerId: string;
  serviceId: string;
  mode: string;
  paymentId: string;
  customerName: string;
  company: string;
  customerSecondName: string;
} //data model to send for payment popup and bottomsheet

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
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
export class ServiceDetailsComponent implements OnInit {
  @ViewChild('file') file;
  parentSubject: Subject<any> = new Subject(); //for email
  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.

  customerId: string; //customer id w.r.t service
  orgId: string; //org id w.r.t service
  serviceId = this.route.snapshot.paramMap.get('serviceId');
  spinner: boolean = true;
  taskDetails: paymentDetails = {
    id: null,
    serviceId: null,
    mode: null,
    custId: null,
    userId: null,
    custFname: null,
    custSname: null,
    serviceTitle: null,
    custComp: null,
    smode: null,
    saleId: '',
    saleTitle: '',
    additionalFieldsArr: [],
  }; //data model to send for popups and bottomsheets of collection
  profitAmount: number; //profit amount
  service: Observable<Service>; //used to display in HTML with async operator
  uploadProgress$: Observable<number>; //attachment upload progress
  uploadReset: Observable<number>; //attachment upload progress in number
  serviceValue: number = 0; //estimated value of service
  expenseAmount: number = 0; //expense amount of this particular service
  task: AngularFireUploadTask; //to upload attachment
  tasks: firebase.default.storage.UploadTask; //to upload attachment
  invoicedAmount: number; //invoiced amount of this particular service
  collectedAmount: number; //collected amount of this particular service
  quotations: Invoice[]; //quotations associated with this particular service
  estimates: Invoice[]; //estimates associated with this particular service
  expenses: Expenses[]; //expenses associated with this particular service
  attachments: Attachments[]; //attachments associated with this particular service
  paymentReceipts: PaymentReceipt[]; //collections associated with this particular service
  invoices: Invoice[]; //invoices associated with this particular service
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
  estimateAmount: number; //estimated amount with this particular service
  customerfirstname: string = ''; //first name of customer having this particular service
  customersecondname: string = ''; //last name of customer having this particular service
  customersurname: string = ''; //surname of customer having this particular sale
  company: string = ''; //company of customer having this particular service

  // additional filed variables
  fieldListArray: any[];
  additionalFields: any[];
  filteredAdditionalField: any = []; // to hold only active custom fields

  taskss: Task[]; //open tasks associated with this particular service
  tasksAll: Task[]; //all tasks associated with this particular service
  serviceName: string; //service title
  serviceStatus: any; //service status array under super user profile
  attachmentSize: any; //totla attachment size allowed under super user profile
  customerName: string = ''; //customer name associated with this aprticular service
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

  items: ProductInSaleModel[] = []; //products array under products collection under service
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
  serviceNotes: any[]; //array of service notes
  lastserviceNote: SalesNotes; //last service note to dispaly
  user: firebase.default.UserInfo; //authentication info
  isHovering: boolean; //for drag and drop attachment
  networkConnection: boolean; //network check

  // based on access control settings disable corresponding view, edit, create and service
  disableViewContact: boolean = false;
  disableserviceView: boolean = false;
  disableserviceEdit: boolean = false;
  disableDoc: boolean = false; //disable services doc creation
  disableDocView: boolean = false;
  disableDocEst: boolean = false; //disable services Doc view
  disableDocCreateEst: boolean = false; //disable services Doc view
  disableDocQuot: boolean = false; //disable services Doc view
  disableDocCreateQuot: boolean = false; //disable services Doc view
  disableDocInv: boolean = false; //disable services Doc view
  disableDocCreateInv: boolean = false; //disable services Doc view
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
  custData: any; //customer details associated with this service
  satusToSend: string = ''; //for edit, to send stage from parent
  stageHistoryToSend: any = null; //for edit, to send stage history from parent
  superUserName: string; //logged in user super user name
  activetab: any; //for mat-tab click events, to check active tab
  buttonPresent: boolean = false; //fixed FAB button in mobile hide/show
  buttonDisabled: boolean = false; //fixed FAB button in mobile disable/enable
  serviceAssignedToName: string; //service assigned to name
  serviceAssignedTo: string; //service assigned to id
  subUsers = []; //subuser array
  assignedArray = []; //array created using subusers and supoer user for select options of assigned to
  serviceToedit: Service = null; //service to edit to send to common service
  totalUserCount: number = 1;
  totalUploadLimit: number;
  currentlyUploaded: number;
  uploadPercentage: number;
  currentPlan: string;
  orderWonCheck = false;

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
  private lastNoteSubscription: Subscription;
  private productsSubscription: Subscription;
  private commonServSubscription: Subscription;

  superUserDetails: Profile = null; //super user details

  // customisable field names
  fieldNameContact: string = 'Contact';
  fieldNameservice: string = 'Support';
  fieldNameTask: string = 'Task';
  fieldNameMeeting: string = 'Meeting';
  fieldNameEstimate: string = 'Estimate';
  fieldNameQuotation: string = 'Quotation';
  fieldNameInvoice: string = 'Invoice';
  fieldNameCollection: string = 'Collection';
  fieldNameExpense: string = 'Expense';
  fieldNameItems: string = 'Products and Service';
  fieldNameServiceNotes: string = 'Note';
  fieldNameFollowup: string = 'FollowUP';
  initClientSubscription: Subscription;

  // to update service stages
  stageValues: StageHistoryModel = {
    date: null,
    stageId: null,
    pipelineId: null,
  }; //status model
  stageHistories: Array<StageValues> = [];
  inPipeline = false;
  won = false;
  lost = false;
  disableFollView: boolean = false;
  disableFoll: boolean = false; //create followups disable
  disableFollEdit: boolean = false;
  nextFollowUp: FollowUps[]; //next followup
  allFollowUp: FollowUps[]; //all followups
  followUps: FollowUps[] = [];

  enableOutboundCallsViaCallBridging: boolean = false;
  callBridgingServiceProvider: string;
  contactNumber: string = '';
  altContactNumber: string = '';
  userNumber: string;
  autoCallToken: string = '';
  allSubUsers: any[] = []; //to store subUsers based on access rule
  disableReAssign = false;
  viewCheck: boolean; //if single details page view is accessible
  viewCheckTagged = false; //boolean to control users view access: no view access in normal case, but view is enabled by tagging
  navSelected: string = 'Info';
  serviceSettings: serviceSettings = defaultServiceSettings.CONST_VALUE;
  paymentSettings: paymentSettings = defaultPaymentSettings.CONST_VALUE; //default payment settings values
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  associatedBranch = '';
  prevAssBranch = '';
  branches = [];
  changeLog: any = {};
  prevNote: any;
  branch: string;
  currentStatus: string;
  DIDNumber: string = '';
  serviceWaTemp: messageTemplateModel[] = []; //to hold the fetrched service whatsapp message templates
  customerNote: CustomerNotes; //single editing customer note
  userEmail = ''; //holds logged in users email
  //custom pipe to implement sorting of data wrt date modified in changeLog
  propName = 'dateModified'; //property for sorting
  allFolowupSubscription: Subscription; // for closing all followupsubscription
  lastNoteId: string; //id of last note
  customsort = (a, b) => {
    //returns the greater date first
    return Number(b.value[this.propName]) - Number(a.value[this.propName]);
  };
  taggedUserArray: taggedUsers[] = []; //tagged users array stored under service doc
  taggedUserIdArray: string[] = []; //array holding only userId s of tagged users
  disableTaskAdd = false; //disable task add option for tagged user
  disableTaskEdit = false; //disable task edit option for tagged user
  taskStatusOptions: any = [] // for holding task status
  lastStatusOption: any; //get last status
  taskDefaultOpn:any[]= ['Open','Completed']
  filteredOptions: taggedUsers[] = []; //filtered taggedUsers list
  searchTerm = ''; //input entry to search in tag users
  mailChoosen: string = ''; //to choose the mail to use
  allCustomDocuments: any[] =[];//array used to store document from collection
  selectedFile: any;
  listDocument: any[]=[];//array used to store & display documents
 customDocuments:any[] = []//custom uploadDOcuments
  documentSubscription:Subscription;
  currentDocument: any;//
  contactDetails = null;
  callBridgingExtension: any;
  outboundCallBridgingType: any = '';

  servicePipelines: Pipelines[] = []; //status stored under super user profile
  pipelineId = 0; //pipelineId of contact
  constructor(
    private analytics: AngularFireAnalytics,
    @Inject(DOCUMENT) private document: Document,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    private ref: ChangeDetectorRef,
    private router: Router,
    private fullLayoutComp: FullLayoutComponent,
    private _bottomSheet: MatBottomSheet,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private servicedetailsService: ServiceDetailsService,
    public networkCheck: NetworkCheckService,
    private location: Location,
    public commonService: CommonService,
    public goog: GoogleCalendarEventService,
    private httpClient: HttpClient
  ) { }

  stageInPipeline(i) {
    var result = this.serviceStatus.filter(obj => {
      return obj.stageId === this.currentStatus
    })
    const statusObj = result[0]

    let currentStageIndex = this.serviceStatus.indexOf(statusObj);
    //console.log("Index of current state", currentStageIndex)
    //If current stage is not won or lost
    if (i <= this.serviceStatus.length - 3) {
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
    else if (i == this.serviceStatus.length - 2) {
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

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('serviceId');
    this.initClientSubscription = this.goog.initClient.subscribe((data) => {
      // console.log(data);
    });
    this.uploadFileLimit = PlanDocLimit.sizeLimit;
    this.commonServSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        this.dragAreaClass = 'dragarea';
        this.isMobilesize = allData.isMobileSize;
        this.isTabletsize = allData.isTabetSize;
        this.user = allData.authDetails;
        this.userId = allData.userId;
        this.userEmail = allData.userDetails.email;
        let userData = allData.userDetails;
        this.superUserDetails = allData.superUserDetails;
        this.orderWonCheck = this.superUserDetails.orderWonCheck;
        this.subUsers = allData.subUsers;
        this.superUserId = userData.superUserId;
        this.branches = allData.branches;
         //get customDoc value
      this.customDocuments = allData.superUserDetails.serviceCustomDoc?allData.superUserDetails.serviceCustomDoc:this.customDocuments;
        // assign whatsapp templates from common service
        this.serviceWaTemp = allData.whatsAppTemplates.filter(
          (templates) => templates.tempRecType === 'Service'
        );
        this.totalUserCount = allData.superUserDetails.noSubusers + 1;
        this.currentlyUploaded = allData.superUserDetails.totalAttachmentsSize;
        this.currentPlan = allData.superUserDetails.plan;
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
        this.userNumber = allData.userDetails.phone;

        if (allData.superUserDetails.enableOutboundCallsViaCallBridging) {
          this.enableOutboundCallsViaCallBridging =
            allData.superUserDetails.enableOutboundCallsViaCallBridging;
        }
        if (allData.superUserDetails.outboundCallType) {
          this.outboundCallBridgingType = allData.superUserDetails.outboundCallType;
          // console.log(" this.callBridgingType", this.outboundCallBridgingType)
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
        if (allData.superUserDetails.DIDNumber) {
          this.DIDNumber = allData.superUserDetails.DIDNumber;
        }
        this.additionalFields = this.superUserDetails.customFieldsService;
        if (userData) {
          this.userName = userData.firstname + ' ' + userData.lastname;
          // this.dataAccessRule = data.dataAccessRule;
          this.userRole = userData.userRole;
          this.accountType = userData.accountType;
          // check restriction

          this.usrProfileData = allData.usrProfileData;
          this.dataAccessRule = this.usrProfileData.serviceDataAccessRule;

          if (this.superUserDetails) {
            this.plan = this.superUserDetails.plan;
            //Read the customer form customization settings
            //taskStatusOptions
            this.taskStatusOptions = this.superUserDetails.taskStatusOpn ? this.superUserDetails.taskStatusOpn : this.taskDefaultOpn;
            this.lastStatusOption = this.taskStatusOptions[this.taskStatusOptions.length - 1];
            this.attachmentSize = this.superUserDetails.totalAttachmentsSize;
            this.createDate = this.superUserDetails?.createdDate;

            if (!this.attachmentSize) {
              this.attachmentSize = 0;
            }
            if (this.superUserDetails.fieldNames) {
              this.fieldNameContact =
                this.superUserDetails.fieldNames.fieldNameContact;
              // this.fieldNameservice =
              // this.superUserDetails.fieldNames.fieldNameservice;
              this.fieldNameTask =
                this.superUserDetails.fieldNames.fieldNameTask;
              this.fieldNameFollowup =
                this.superUserDetails.fieldNames.fieldNameFollowup;
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
              this.fieldNameServiceNotes = this.superUserDetails.fieldNames
                .fieldNameServiceNotes
                ? this.superUserDetails.fieldNames.fieldNameServiceNotes
                : 'Note';
            }
            if (this.superUserDetails?.fieldNames?.fieldNameService) {
              this.fieldNameservice =
                this.superUserDetails.fieldNames.fieldNameService;
            }

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
              allData.superUserDetails.serviceSettings &&
              typeof allData.superUserDetails.serviceSettings !== 'undefined' &&
              allData.superUserDetails.serviceSettings !== null
            ) {
              this.serviceSettings = allData.superUserDetails.serviceSettings;
              if (allData.superUserDetails.serviceSettings) {
                this.commonService.checkCustomField(
                  defaultServiceSettings.CONST_VALUE,
                  allData.superUserDetails.serviceSettings
                );
              }
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
            // reading service
            this.service = this.servicedetailsService.getservice(
              this.serviceId,
              this.superUserId
            );
            this.service.pipe(takeUntil(this.onDestroy$)).subscribe((data) =>{
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

                this.serviceToedit = data;
                this.pipelineId = data.selectedServPipeline;
                this.serviceName = data.serviceTitle;
                this.associatedBranch = data.associatedBranch
                  ? data.associatedBranch
                  : '';
                this.prevAssBranch = data.associatedBranch
                  ? data.associatedBranch
                  : '';
                this.serviceValue = data.estimatedValue;
                this.invoicedAmount = data.invoicedAmount;
                this.collectedAmount = data.collectedAmount;
                this.customerId = data.customerId;
                this.orgId = data.orgId ? data.orgId : null;
                this.estimateAmount = data.estimatedValue;
                this.expenseAmount = data.expenseAmount;
                this.customerfirstname = data.firstName;
                this.customersecondname = data.secondName;
                this.currentStatus = data.servicesStage;
                if (data.surname) {
                  this.customersurname = data.surname;
                }
                this.company = data.companyName;
                this.satusToSend = data?.servicesStage;
                this.stageHistoryToSend = data?.stageHistory;
                this.branch = data.associatedBranch;
                this.lastNoteId = data.lastNoteId ? data.lastNoteId : '';
                if (data.changeLog) {
                  const changeLogArray: any = Object.values(data.changeLog);
                  this.changeLog = changeLogArray.sort(
                    (objA, objB) =>
                      Number(objB.dateModified) - Number(objA.dateModified)
                  );
                }
                let viewCheckPrimary =
                  this.commonService.checkDataAccessRule(
                    'services',
                    this.userId,
                    data.assignedTo,
                    this.branch
                  ) || data.createdBy == this.userId; //Allow access if data access rule check passes or record has been created by user
                // if user already has access to sales no need to check access further
                if (viewCheckPrimary === true) {
                  this.viewCheck = true;
                  // if user has no access, check if user is tagged and thus allow access
                } else {
                  this.viewCheck = this.commonService.checkTaggedUser(
                    'services',
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
                  // disable followups
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
                  // disable service
                  if (this.usrProfileData.isCheckedService == false) {
                    this.disableserviceView = true;
                    this.disableserviceEdit = true;
                    this.disableReAssign = true;
                  } else {
                    if (this.usrProfileData.servicesView == false) {
                      this.disableserviceView = true;
                    }
                    if (this.usrProfileData.servicesEdit == false) {
                      this.disableserviceEdit = true;
                      this.disableReAssign = true;
                    }
                    if (this.usrProfileData.serviceReAssign == false) {
                      this.disableReAssign = true;
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
                  if (this.usrProfileData.isCheckedServiceAtt == false) {
                    this.disableAtt = true;
                    this.disableAttRemove = true;
                    this.disableAttView = true;
                  } else {
                    if (this.usrProfileData.serviceattAdd == false) {
                      this.disableAtt = true;
                    }
                    if (this.usrProfileData.serviceattRemove == false) {
                      this.disableAttRemove = true;
                    }
                    if (this.usrProfileData.serviceattView == false) {
                      this.disableAttView = true;
                    }
                  }
                } else {
                  // disable task section
                  this.disableTaskAdd = true;
                  this.disableTaskEdit = true;

                  // disable contact
                  this.disableViewContact = false;

                  // disable followups
                  this.disableFoll = true;
                  this.disableFollEdit = true;
                  this.disableFollView = false;

                  // disable service
                  this.disableserviceView = false;
                  this.disableserviceEdit = true;
                  this.disableReAssign = true;

                  // disable notes
                  this.disableNotes = false;
                  this.disableNotesEdit = false;
                  this.disableNotesView = false;

                  // disable attachments

                  this.disableAtt = true;
                  this.disableAttRemove = true;
                  this.disableAttView = false;
                }


                if(this.commonService.userPlan.multiPipelineAccess){
                  this.servicePipelines = JSON.parse(JSON.stringify(allData.servicePipelines));
                 }else{
                   this.servicePipelines.push(JSON.parse(JSON.stringify(allData.servicePipelines))[0]);
                 }
                 var result = this.servicePipelines.filter(obj => {
                  return obj.pipelineId === data?.selectedServPipeline
                })
                this.serviceStatus = result[0]?.pipelineStages.map(({ name, stageId }) => ({
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

                this.serviceAssignedToName = this.commonService.getAssignedToName(data.assignedTo);;
                this.serviceAssignedTo = data.assignedTo;
                if (!this.expenseAmount) {
                  this.expenseAmount = 0;
                }
                if (!this.invoicedAmount) {
                  this.invoicedAmount = 0;
                }
                this.profitAmount = this.invoicedAmount - this.expenseAmount;
                if (this.customerId) {
                  this.custSubscription = this.servicedetailsService
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

            //read the notes associated witht the service
            this.notesSubscription = this.servicedetailsService
              .readNote(this.serviceId, this.superUserId)
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
                this.serviceNotes = EditableData;
              });

            //get all documents
      this.documentSubscription = this.servicedetailsService
      .fetchdocuments(this.serviceId, this.superUserId)
      .subscribe((data) => {
        this.allCustomDocuments = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as any;
        });
        this.listDocument = this.customDocuments.map((obj1) => {
          let obj2 = this.allCustomDocuments.find((obj2) => obj1.docIdentifier === obj2.docIdentifier);
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
              verifiedById: null
            };
            return { ...obj1, ...undefinedObj };
          }
        });
      });

            //fetching products and services details to show in items card
            this.productsSubscription = this.servicedetailsService
              .getserviceProducts(this.superUserId, this.serviceId)
              .subscribe((data) => {
                this.items = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as ProductInSaleModel;
                });
                // this.buttonPresent = true;
              });
            // fetching open tasks only to show count in badge
            this.taskSubscription = this.servicedetailsService
              .getTasks(
                this.superUserId,
                this.userId,
                this.serviceId,
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
            this.allFolowupSubscription = this.servicedetailsService
              .getAllFollowUps(this.serviceId, this.superUserId)
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
  // tag user clear search
  clearSearchTerm() {
    this.searchTerm = '';
    this.filteredOptions = [...this.taggedUserArray];
  }

  //event to get mail choosen
  chooseMail($event: any){
    this.mailChoosen = $event;
  }
  // search tag user
  applyFilter($event) {
    this.searchTerm = $event;
    this.filteredOptions = this.taggedUserArray.filter((item) =>
      item.userName.toLowerCase().includes($event)
    );
  }
  // function to tag a user for this Sale
  tagUser($event: any, userid, tagged, userName, i) {
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
    this.servicedetailsService
      .updateTaggedUser(this.superUserId, this.serviceId, taggedArray)
      .then((resp) => {
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
      .catch((err) => {
        this.snack.open(`Error occured`, '', {
          duration: 2000,
        });
      });
  }
  // download attachment
  downloadAttachment(url) {
    this.document.location.href = url;
  }
  async downloadAttachmentCheck(url: string) {
    try {
      const res = await this.httpClient
        .get(url, { responseType: 'blob' })
        .toPromise();
      this.downloadFile(res);
    } catch (e) {
      // console.log(e.body.message);
    }
  }
  clearNote(form: NgForm) {
    form.reset(); //reset the form after writing the data
  }
  downloadFile(data) {
    const url = window.URL.createObjectURL(data);
    const e = document.createElement('a');
    e.href = url;
    e.download = url.substr(url.lastIndexOf('/') + 1);
    document.body.appendChild(e);
    e.click();
    document.body.removeChild(e);
  }

  // mobile task icon route to taskboard for particular service
  tasksRoute() {
    this.router.navigate(['/dash/tasks/service', this.serviceId]);
  }
  // delete attachment
  deleteAttachment(id, path, url, filename, size) {
    this.dialog.open(ConfirmationpopupComponent, {
      data: {
        taskId: id,
        smode: 'servattachmentDelete',
        path: path,
        url: url,
        orginalPath: filename,
        serviceId: this.serviceId,
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
  trackbyFwp(index: number, task: FollowUps): string {
    return task.id;
  }
  //create a quote for a paritcular service ID
  createQuote() {
    this.router.navigate([
      '/dash/document/documentquotationmanagement/',
      this.serviceId,
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
        serviceId: this.serviceId,
        customerId: this.customerId,
        mode: 'create',
        changeLog: this.changeLog,
        componentName: this.constructor.name,
        moduleName:'services',
        docId: this.serviceId
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
        sid: this.serviceId,
        cid: this.customerId,
        cfname: this.customerfirstname,
        csname: this.customersecondname,
        company: this.company,
        serviceTitle: this.serviceName,
        mode: 'create',
      },
    });
  }

  setNavOption(option) {
    this.navSelected = option;
    if (this.navSelected == 'Emails') {
      this.parentSubject.next('Email');
    }

    if (this.navSelected == 'Attachments') {
      // attachments fetching
      // attachments fetching
      this.attachmentSubscription = this.servicedetailsService
        .getAttachments(this.superUserId, this.serviceId)
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
  }
  // add service document-mobile -open bottom sheet to select which document has to create
  addDocumentsMob() {
    // this._bottomSheet.open(BottomSheetservicesDocuments, {
    //   data: {
    //     custId: this.customerId,
    //     serviceId: this.serviceId,
    //     fieldNameservice: this.fieldNameservice,
    //     fieldNameEstimate: this.fieldNameEstimate,
    //     fieldNameQuotation: this.fieldNameQuotation,
    //     fieldNameInvoice: this.fieldNameInvoice,
    //     disableEst: this.disableDocCreateEst,
    //     disableQuot: this.disableDocCreateQuot,
    //     disableInv: this.disableDocCreateInv,
    //   },
    // });
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
    // console.log(event.dataTransfer.files[0])
    event.preventDefault();
    event.stopPropagation();
    if (this.commonService.getStatus() === true) {
      this.dialog.open(ConfirmationpopupComponent, {
        width: '300px',
        data: {
          smode: 'uploadinprogress',
        },
      });
      // console.log('uploading in progress')
    } else {
      if (event.dataTransfer.files) {
        let files: FileList = event.dataTransfer.files[0];
        this.uploadAttachment(files, 'drag');
      }
    }
  }
  //select file for custom document
  selectFile(event: any,customDoc,i) {
    //get file extension
    var extension = event.target.files[0]?.name.substr(event.target.files[0]?.name.lastIndexOf('.'))
    //check if selected file extension is suppoerted by current customDoc
    if (customDoc.doctypes.includes(extension)) {
      this.selectedFile = event.target.files;
      if (event.target.files[0]) {
        //passing selected file for uploading
        this.uploadDocument(event, customDoc.docIdentifier, this.currentDocument);
      }
    } else if(customDoc.doctypes.length === 0){
      this.selectedFile = event.target.files;
      if (event.target.files[0]) {
        //passing selected file for uploading
        this.uploadDocument(event, customDoc.docIdentifier, this.currentDocument);
      }
    }
    else {
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
  deleteCustomDoc(id, path, url, filename, size){
      this.dialog.open(ConfirmationpopupComponent, {
        data: {
          taskId: id,
          smode: 'customServiceDocDelete',
          path: path,
          url: url,
          orginalPath: filename,
          custId: this.serviceId,
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
  //custom document verificatio n
  verificationCheck(event, documentId,fileName) {
     //marking document as verified & updating changeLog
    if(event === true){
      const verifiedDate = new Date().getTime();
      const verifiedByName = this.userName;
      const verifiedById = this.userId;
      this.servicedetailsService.changeDocVerification(
        this.superUserId,
        this.serviceId,
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
        ),
      );// marking unverified
    } else if(event === false){
      const verifiedDate = null;
      const verifiedByName = this.userName;
      const verifiedById = this.userId;
      this.servicedetailsService.changeDocVerification(
        this.superUserId,
        this.serviceId,
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
        ),
      );
    }
  }
  // upload customDocument
  uploadDocument(event,customDocIdentifier,currentDocument) {
    let date = new Date().getTime();
    let str;
    let size;
    let downloadURL;
    let file;
    let newSize;
    let uploadedBy = this.userName;
    let docUploadDate = new Date().getTime();
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
        this.servicedetailsService.updateSize(this.superUserId, newSize);
          const filePath = `attachment/${
            this.userId
          }/service/${Date.now()}_${str}`;
          //uploaded Date
        this.fullLayoutComp.uploadCustomDocument(
          filePath,
          file,
          this.serviceId,
          str,
          docUploadDate,
          uploadedBy,
          size,
          newSize,
          customDocIdentifier,
        "services",
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
    let downloadURL;
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
    // console.log(file)
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
        this.servicedetailsService.updateSize(this.superUserId, newSize);

        const filePath = `attachment/${this.user.uid
          }/service/${Date.now()}_${str}`;

        this.fullLayoutComp.uploadAttachment(
          filePath,
          file,
          this.serviceId,
          str,
          date,
          name,
          size,
          newSize,
          'service',
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

        //       this.servicedetailsService.attachmentsToCollection(
        //         this.superUserId,
        //         this.customerId,
        //         this.serviceId,
        //         str,
        //         downloadURL,
        //         filePath,
        //         date,
        //         size,
        //         name,
        //       );
        //       this.fileBeingUploaded=false;
        //       this.ref.detectChanges();
        //       this.servicedetailsService.updateSize(this.superUserId, newSize);
        //       // this.snack.open('Attachment added successfully', '', {
        //       //   duration: 500,
        //       // });
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
      'attachmentSupport'
    )[0] as HTMLElement;
    this.file.nativeElement.value = '';
    element.click();
  }
  // edit collection-web
  editPayment(element, id) {
    this.commonService.updatePaymentToEdit(element);
    this.dialog.open(Paymentreceipt1Component, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        serviceId: this.serviceId,
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
        moduleName:'services',
        docId: this.serviceId
      },
    });
  }
  // edit collection-mobile
  editPaymentMob(id) {
    this.taskDetails.serviceId = this.serviceId;
    this.taskDetails.mode = 'createBtm';
    this.taskDetails.smode = 'update';
    this.taskDetails.id = id;
    this.taskDetails.serviceTitle = this.serviceName;

    // this._bottomSheet.open(BottomSheetPaymentUpdateComponent, {
    //   data: this.taskDetails,
    // });
  }

  // create invoice-web
  createInvoice() {
    //create an invoice for a paritcular service ID

    this.router.navigate([
      '/dash/document/documentinvoicemanagement/',
      this.serviceId,
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
      this.serviceId,
      'create',
      'Estimate',
      this.customerId ? this.customerId : 'none',
      this.orgId ? this.orgId : 'none',
      'none',
    ]);
  }
  deleteTask(taskid, status, title) {
    const dialogRef = this.dialog.open(ChildServiceDetails, {
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
              this.servicedetailsService.updateSize(this.superUserId, newSize);
              //delete from storage
              const storageRef = firebase.default.storage().ref();
              var desertRef = storageRef.child(att.path);
              await desertRef.delete();
            }
          });
        }

        this.servicedetailsService
          .deleteTask(this.superUserId, taskid)
          .then((data) => {
            this.servicedetailsService.addToDeleteLog(
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
      this.servicedetailsService
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
        sid: this.serviceId,
        cid: this.customerId,
        orgId: this.orgId,
        mode: 'serviceCreate',
        company: this.company,
        firstName: this.customerfirstname,
        secondName: this.customersecondname,
        surname: this.customersurname,
        serviceName: this.serviceName,
      },
    });
  }
  // update service stage
  updateserviceStage(stage: string, statusName) {
    let rejected = false; //boolean to show whether reason for rejection field if status is lost/rejected
    if (this.satusToSend != stage) {
      if (stage === this.serviceStatus[this.serviceStatus.length - 1].stageId) {
        rejected = true;
      }
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        stage: stage,
        fieldNameservice: this.fieldNameservice,
        scenario: 'updateStage',
        rejected,
        rejectionReasonValue: '', //selected reason for rejection
        rejectionReasonArr:
          this.serviceSettings?.rejectionReason?.rejectionReason?.split(','), //reason for rejection options array
        rejectionReasonDisplay:
          this.serviceSettings.rejectionReasonVal?.display, //whether to display/not reason for rejection
        rejectionReasonMandatory:
          this.serviceSettings.rejectionReasonVal?.mandatory, //reason for rejection mandatory check
          statusName: statusName ,
          pipelineId: this.pipelineId
        };
      const dialogRef = this.dialog.open(ChildServiceDetails, dialogConfig);
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          // console.log(result);
          if (result) {
            // console.log('proceed');
            let datePlaced = new Date().getTime(); //Get TimeStamp
            let currentHistory = this.stageHistoryToSend;
            this.stageValues.date = datePlaced;
            this.stageValues.stageId = stage;
            this.stageValues.pipelineId = this.pipelineId;
            currentHistory.push(this.stageValues);
            this.stageHistories = currentHistory;

            let prevObj;
            let currObj;
            // console.log(this.stageHistories);
            if (stage === this.serviceStatus[this.serviceStatus.length - 1].stageId) {
              this.lost = true;
              this.won = false;
              this.inPipeline = false;
              prevObj = { servicesStage: this.getStatusName(this.satusToSend), rejectionReasonVal: '' };
              currObj = { servicesStage: statusName, rejectionReasonVal: result.rejectionReasonValue };
            } else if (
              stage === this.serviceStatus[this.serviceStatus.length - 2].stageId
            ) {
              this.lost = false;
              this.won = true;
              this.inPipeline = false;
              prevObj = { servicesStage: this.getStatusName(this.satusToSend) };
              currObj = { servicesStage: statusName };
            } else {
              this.lost = false;
              this.won = false;
              this.inPipeline = true;
              prevObj = { servicesStage: this.getStatusName(this.satusToSend) };
              currObj = { servicesStage: statusName };
            }

            this.servicedetailsService.updateServiceStage(
              this.superUserId,
              this.serviceId,
              stage,
              this.stageHistories,
              datePlaced,
              this.inPipeline,
              this.won,
              this.lost,
              stage === this.serviceStatus[this.serviceStatus.length - 1].stageId ? result.rejectionReasonValue : '',
              ChangeLogComponent.saveLog(
                this.constructor.name,
                this.userId,
                this.userName,
                prevObj, currObj,
                this.changeLog
              )
            );
            this.snack.open('Successfully updated', '', {
              duration: 2000,
            });
          }
        });
    }
  }
  // update service priority
  updateservicePriority(priority: string) {
    if (this.serviceToedit.priority != priority) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        priority: priority,
        fieldNameservice: this.fieldNameservice,
        scenario: 'updatePriority',
      };
      const dialogRef = this.dialog.open(ChildServiceDetails, dialogConfig);
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          if (result) {
            // console.log(result);
            if (result === 'proceed') {
              // console.log('proceed');
              this.servicedetailsService.updateServicePriority(
                this.superUserId,
                this.serviceId,
                {
                  priority: priority,
                  lastModifiedDate: new Date().getTime(),
                  changeLog: ChangeLogComponent.saveLog(
                    this.constructor.name,
                    this.userId,
                    this.userName,
                    { priority: this.serviceToedit.priority },
                    { priority: priority },
                    this.changeLog
                  ),
                }
              );
              this.snack.open('Successfully updated', '', {
                duration: 2000,
              });
            }
          }
        });
    }
  }
  getStatusName(statusId){
    if(!!statusId){
      var result = this.serviceStatus.filter(obj => {
        return obj.stageId === statusId
      })
      const statusName = result[0].name;
      return statusName ? statusName : 'N/A';
    }
  }

  // view service
  onViewservice() {
    if (this.isMobilesize == false) {
      const dialogRef = this.dialog.open(CrudServiceComponent, {
        panelClass: 'custom-dialog-container',
        width: '580px',
        height: 'auto',
        minHeight: '100px',
        disableClose: true,
        data: { scenario: 'view', id: this.serviceId },
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => { });
    }
    if (this.isMobilesize == true) {
      this.router.navigate(['/addservice', 'view', this.serviceId]);
    }
  }
  // edit service
  onEditservice() {
    if (this.isMobilesize == false) {
      this.commonService.updateserviceToEdit(this.serviceToedit);
      const dialogRef = this.dialog.open(CrudServiceComponent, {
        width: '580px',
        height: 'auto',
        minHeight: '100px',
        disableClose: true,
        data: { scenario: 'edit', id: this.serviceId },
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => { });
    }
    if (this.isMobilesize == true) {
      this.commonService.updateserviceToEdit(this.serviceToedit);
      this.router.navigate(['/addservice', 'edit', this.serviceId]);
    }
  }
  // add service from Mobile
  onAddMob() {
    this.router.navigate(['/addservice', 'create']);
  }

  async sndMail(url) {
    this.sendemailpopup(url);
  }

  sendemailpopup(url) {
    const dialogRef = this.dialog.open(ComposemailComponent, {
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
  // back in toolbar-mobile-route to services list
  onBackMob() {
    this.router.navigate(['/dash/services/servicelist-mobileview']);
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
        this.servicedetailsService.updateSize(this.superUserId, newSize);

        let storageRef = firebase.default.storage().ref();
        const filePath = `attachment/${this.user.uid
          }/service/${Date.now()}_${str}`;

        this.task = this.storage.upload(filePath, file);
        const ref = this.storage.ref(filePath);

        this.task
          .snapshotChanges()
          .pipe(
            finalize(async () => {
              downloadURL = await ref.getDownloadURL().toPromise();
              if (downloadURL) {
                this.servicedetailsService
                  .attachmentsToCollection(
                    this.superUserId,
                    name,
                    this.serviceId,
                    str,
                    downloadURL,
                    filePath,
                    date,
                    size,
                    this.userName
                  )
                  .then((resp) => {
                    this.fileBeingUploaded = false;
                    this.ref.detectChanges();
                    this.snack.open('Attachment added successfully', '', {
                      duration: 500,
                    });
                  })
                  .catch((e) => {
                    // revert the updated size if uploading failed
                    this.servicedetailsService.updateSize(
                      this.superUserId,
                      this.attachmentSize
                    );
                    this.fileBeingUploaded = false;
                  });
              } else {
                // revert the updated size if uploading failed
                this.servicedetailsService.updateSize(
                  this.superUserId,
                  this.attachmentSize
                );
              }
            })
          )
          .pipe(takeUntil(this.onDestroy$))
          .subscribe();
      }

      this.servicedetailsService.updateChangeLog(
        this.superUserId,
        'services',
        this.serviceId,
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
  // create service note
  onSubmitNote(form: NgForm, GAevent) {
    this.analytics.logEvent(GAevent);
    let createdDate = new Date().getTime();
    this.servicedetailsService.writeNote(
      form.value,
      this.superUserId,
      createdDate,
      this.serviceId,
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
  // update service note
  onUpdateNote(notes) {
    if (this.prevNote != notes.notes) {
      const note = notes.notes;
      const noteId = notes.id;
      this.servicedetailsService.updateNote(
        note,
        this.superUserId,
        this.serviceId,
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
  // to make service note in edit mode
  onEditNote(note) {
    note.isEditable = true;
    this.prevNote = note.notes;
  }
  inputAttachment() {
    let element: HTMLElement = document.getElementsByName(
      'attachmentSupport'
    )[0] as HTMLElement;
    this.file.nativeElement.value = '';
    element.click();
  }
  //for custom document upload
  inputAttachmentDoc(i,currentDoc) {
    let element: HTMLElement = document.getElementsByClassName(
      `customContactDocUpload_${i}`
    )[0] as HTMLElement;
    this.currentDocument = currentDoc
    element.click();
  }
  shareClicked(attachmentid) {
    this.servicedetailsService
      .getsharedwithid(this.serviceId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res2) => {
        var data: any = {};
        if (res2.data()) {
          this.servicedetailsService
            .addinvoicetoshare(this.serviceId, attachmentid)
            .then(() => {
              this.servicedetailsService.sendEmail({
                to: this.custData.email,
                template: {
                  name: 'sharedDoc',
                  data: {
                    userName: this.superUserName,
                    link: shareAttOrDocLink,
                  },
                },
                // html:"A document have been send to you by "+this.userData.companyName=="N/A"?this.userData.contactname:this.userData.companyName+". Click the link <a href=''>Click here</a> "
              });
              this.servicedetailsService.togglesharestatus(
                this.superUserId,
                attachmentid,
                this.serviceId,
                true
              );
            });
        } else {
          this.servicedetailsService
            .initshareinvoice({
              serviceID: this.serviceId,
              userId: this.superUserId,
              customerEmail: this.custData.email,
              shareDate: Date.now(),
            })
            .then(() => {
              this.servicedetailsService
                .addinvoicetoshare(this.serviceId, attachmentid)
                .then(() => {
                  this.servicedetailsService.sendEmail({
                    to: this.custData.email,
                    template: {
                      name: 'sharedDoc',
                      data: {
                        userName: this.superUserName,
                        link: shareAttOrDocLink,
                      },
                    },
                  });
                  this.servicedetailsService.togglesharestatus(
                    this.superUserId,
                    attachmentid,
                    this.serviceId,
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
  // add Product fromservices
  addProductservice() {
    const dialogRef2 = this.dialog.open(ServicesAddProduct, {
      width: '800px',
      disableClose: true,
      data: {
        scenario: 'add',
        userId: this.userId,
        superUserId: this.superUserId,
        accountType: this.accountType,
        fieldNameItems: this.fieldNameItems,
      },
    });
    dialogRef2
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          let newProduct = {
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
          };
          this.servicedetailsService
            .addProduct(this.superUserId, this.serviceId, newProduct)
            .then((res) => {
              const updatedEstValue =
                this.estimateAmount +
                result[4] * (1 - result[7] / 100) * result[6];
              this.servicedetailsService.updateserviceEstValue(
                this.superUserId,
                this.serviceId,
                updatedEstValue
              );
              this.snack.open(this.fieldNameItems + ' added', '', {
                duration: 500,
              });
            })
            .catch((e) => {
              this.snack.open('Error while adding ' + this.fieldNameItems, '', {
                duration: 2000,
              });
            });
        }
      });
  }
  // edit Product from services
  editProduct(product) {
    const oldProdEstValue =
      product.unitPrice * (1 - product.discount / 100) * product.quantity;
    const dialogRef2 = this.dialog.open(ServicesAddProduct, {
      width: '800px',
      disableClose: true,
      data: {
        scenario: 'edit',
        userId: this.userId,
        superUserId: this.superUserId,
        accountType: this.accountType,
        product: product,
        fieldNameItems: this.fieldNameItems,
      },
    });
    dialogRef2
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          const newProdEstValue = result[3] * (1 - result[6] / 100) * result[5];
          this.servicedetailsService.updateProduct(
            this.superUserId,
            this.serviceId,
            result[0],
            result[1],
            result[2],
            result[3] ? result[3] : 0,
            result[4],
            result[5],
            result[6] ? result[6] : 0,
            result[7] ? result[7] : 0,
            result[8] ? result[8] : 0,
            result[9] ? result[9] : 0,
            result[10] ? result[10] : 0
          );
          if (oldProdEstValue !== newProdEstValue) {
            const updatedEstValue =
              this.estimateAmount - oldProdEstValue + newProdEstValue;
            this.servicedetailsService.updateserviceEstValue(
              this.superUserId,
              this.serviceId,
              updatedEstValue
            );
          }
          this.snack.open('Product updated', '', {
            duration: 500,
          });
        }
      });
  }
  addProductserviceMob() {
    const queryParams = {
      scenario: 'add',
      userId: this.userId,
      superUserId: this.superUserId,
      accountType: this.accountType,
      fieldNameItems: this.fieldNameItems,
      serviceId: this.serviceId,
      estValue: this.estimateAmount,
    };

    const string = JSON.stringify(queryParams);
    this.router.navigate([
      `/dash/services/serviceview/${this.serviceId}/add-product/${string}`,
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
      serviceId: this.serviceId,
      estValue: this.estimateAmount,
    };
    const string = JSON.stringify(queryParams);
    this.router.navigate([
      `/dash/services/serviceview/${this.serviceId}/add-product/${string}`,
    ]);
  }
  // dlete product mobile
  deleteProductMob(product) {
    const oldProdEstValue4 =
      product.unitPrice * (1 - product.discount / 100) * product.quantity;
    const updatedEstValue4 = this.estimateAmount - oldProdEstValue4;

    this.servicedetailsService.deleteProduct(
      this.superUserId,
      this.serviceId,
      product.id
    );
    this.servicedetailsService.updateserviceEstValue(
      this.superUserId,
      this.serviceId,
      updatedEstValue4
    );
    this.snack.open('Product deleted', '', {
      duration: 500,
    });
  }
  // delete product
  deleteProduct(product) {
    const oldProdEstValue3 =
      product.unitPrice * (1 - product.discount / 100) * product.quantity;
    const updatedEstValue3 = this.estimateAmount - oldProdEstValue3;
    const dialogRef2 = this.dialog.open(ServicesAddProduct, {
      width: '400px',
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
          this.servicedetailsService.deleteProduct(
            this.superUserId,
            this.serviceId,
            result.id
          );
          this.servicedetailsService.updateserviceEstValue(
            this.superUserId,
            this.serviceId,
            updatedEstValue3
          );
          this.snack.open('Product deleted', '', {
            duration: 500,
          });
        }
      });
  }
  // edit and update task
  servicesTaskUpdate(element) {
    // if (this.customersecondname) {
    //   this.customerName =
    //     this.customerfirstname + ' ' + this.customersecondname;
    // } else {
    //   this.customerName = this.customerfirstname;
    // }
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
    // const dialogRef1 = this.dialog.open(servicesTask, {
    //   width: '900px',
    //   data: {
    //     id: element.id,
    //     userId: this.userId,
    //     superUserId: this.superUserId,
    //     serviceId: this.serviceId,
    //     title: element.title,
    //     description: element.description,
    //     assignedTo: element.assignedToName,
    //     dueDate: element.dueDate,
    //     priority: element.priority,
    //     status: element.status,
    //     customerName: this.customerName,
    //     serviceTitle: this.serviceName,
    //     userName: this.userName,
    //     superUserName: this.superUserName,
    //     assignedToId: element.assignedTo,
    //   },
    // });
    // dialogRef1
    //   .afterClosed()
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe((result) => {
    //     if (result) {
    //       this.servicedetailsService.updateTask(
    //         result[0].superUserId,
    //         result[0].id,
    //         result[0].title,
    //         result[0].description,
    //         result[0].priority,
    //         result[0].status,
    //         result[1],
    //         result[2],
    //         result[3]
    //       );

    //       this.snack.open('Successfully updated task', '', {
    //         duration: 500,
    //       });
    //     }
    //   });
  }
  //mark task as completed in tasks tab
  taskCompleted(taskId, status, changeLog) {
    this.dialog.open(ConfirmationpopupComponent, {
      data: {
        taskId: taskId,
        smode: 'taskcompleted',
        superId: this.superUserId,
        changeLog: changeLog,
        currentStatus: status,
        lastStatus: this.lastStatusOption,
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
  // tab change in mobile check
  tabClick(tab) {
    this.activetab = tab.tab.textLabel;
    if (this.activetab == 'Notes') {
      // reading notes - MK 14th March 2022 - moving this section to be loaded by default
    }
    if (this.activetab == 'ITEMS') {
      if (this.disableItemsCreate) {
        this.buttonDisabled = true;
      } else {
        this.buttonDisabled = false;
      }
      //fetching products and services details to show in items card
      this.productsSubscription = this.servicedetailsService
        .getserviceProducts(this.superUserId, this.serviceId)
        .subscribe((data) => {
          this.items = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as ProductInSaleModel;
          });
          this.buttonPresent = true;
        });
    }
    if (this.activetab == 'DOCUMENTS') {
      if (this.disableDoc) {
        this.buttonDisabled = true;
      } else {
        this.buttonDisabled = false;
      }
      this.buttonPresent = true;

      this.QuoteSubscription = this.servicedetailsService
        .getQuotations(this.superUserId, this.serviceId)
        .subscribe((data) => {
          this.quotations = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
        });
      this.EstSubscription = this.servicedetailsService
        .getEstimates(this.superUserId, this.serviceId)
        .subscribe((data) => {
          this.estimates = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
        });
      this.InvSubscription = this.servicedetailsService
        .getInvoices(this.superUserId, this.serviceId)
        .subscribe((data) => {
          this.invoices = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
        });
    } else if (this.activetab == 'Collections') {
      this.buttonPresent = true;
      if (this.disableColl) {
        this.buttonDisabled = true;
      } else {
        this.buttonDisabled = false;
      }

      // get the list of payments
      this.collectionSubscription = this.servicedetailsService
        .getPaymentReceipt(this.superUserId, this.serviceId)
        .subscribe((data) => {
          this.paymentReceipts = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as PaymentReceipt;
          });
          this.dataSource = new MatTableDataSource([]);
          this.dataSource = this.paymentReceipts;
        });
    } else if (this.activetab == 'ATTACHMENTS') {
      this.buttonPresent = true;
      if (this.disableAtt) {
        this.buttonDisabled = true;
      } else {
        this.buttonDisabled = false;
      }

      // attachments fetching
      this.attachmentSubscription = this.servicedetailsService
        .getAttachments(this.superUserId, this.serviceId)
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
    } else if (this.activetab == 'EXPENSES') {
      this.buttonPresent = true;
      if (this.disableExp) {
        this.buttonDisabled = true;
      } else {
        this.buttonDisabled = false;
      }

      // fetching expenses
      this.expenseSubscription = this.servicedetailsService
        .getExpenses(this.superUserId, this.serviceId)
        .subscribe((data) => {
          this.expenses = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Expenses;
          });
          this.dataSources = new MatTableDataSource([]);
          this.dataSources = this.expenses;
        });
    } else if (tab.tab.textLabel == 'Email') {
      this.parentSubject.next('Email');
      this.buttonPresent = false;
    } else if (this.activetab == 'TASKS') {
      //all tasks fetching
      this.allTasksSubscription = this.servicedetailsService
        .getAllTasks(
          this.superUserId,
          this.userId,
          this.serviceId,
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
          this.buttonPresent = true;
        });
    } else if (this.activetab == 'Follow-Up') {
      if (this.disableFoll) {
        this.buttonDisabled = true;
      } else {
        this.buttonDisabled = false;
      }
      this.buttonPresent = true;
    } else {
      this.buttonPresent = false;
    }
  }
  // tab change in web and corresponding data fetch from DB
  tabClickWeb(tab) {
    this.activetab = tab.tab.textLabel;
    if (tab.tab.textLabel == 'Email') {
      this.parentSubject.next('Email');
    }
    if (this.activetab == 'ITEMS') {
      this.productsSubscription = this.servicedetailsService
        .getserviceProducts(this.superUserId, this.serviceId)
        .subscribe((data) => {
          this.items = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as ProductInSaleModel;
          });
          this.dataSourceitems = new MatTableDataSource([]);
          this.dataSourceitems = this.items;
        });
    }
    if (this.activetab == 'Documents') {
      //@MK 24/5/2021 - replaced the data access rule based fetching of document details, instead getting all documents for a service
      this.QuoteSubscription = this.servicedetailsService
        .getQuotations(this.superUserId, this.serviceId)
        .subscribe((data) => {
          this.quotations = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
        });
      this.EstSubscription = this.servicedetailsService
        .getEstimates(this.superUserId, this.serviceId)
        .subscribe((data) => {
          this.estimates = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
        });
      this.InvSubscription = this.servicedetailsService
        .getInvoices(this.superUserId, this.serviceId)
        .subscribe((data) => {
          this.invoices = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
        });
    }
    if (this.activetab == 'Collections') {
      // get the list of payments
      this.collectionSubscription = this.servicedetailsService
        .getPaymentReceipt(this.superUserId, this.serviceId)
        .subscribe((data) => {
          this.paymentReceipts = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as PaymentReceipt;
          });
          this.dataSource = new MatTableDataSource([]);
          this.dataSource = this.paymentReceipts;
        });
    }
    if (this.activetab == 'Notes') {
      // reading notes
      this.notesSubscription = this.servicedetailsService
        .readNote(this.serviceId, this.superUserId)
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
          this.serviceNotes = EditableData;
        });
    }
    if (this.activetab == 'Attachments') {
      // attachments fetching
      this.attachmentSubscription = this.servicedetailsService
        .getAttachments(this.superUserId, this.serviceId)
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
    if (this.activetab == 'Expenses') {
      // fetching expenses
      this.expenseSubscription = this.servicedetailsService
        .getExpenses(this.superUserId, this.serviceId)
        .subscribe((data) => {
          this.expenses = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Expenses;
          });
          this.dataSources = new MatTableDataSource([]);
          this.dataSources = this.expenses;
        });
    }
    if (this.activetab == 'Taks') {
      //all tasks fetching
      this.allTasksSubscription = this.servicedetailsService
        .getAllTasks(
          this.superUserId,
          this.userId,
          this.serviceId,
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
  onPlayAudio(resourceURL) {
    const dialogRef = this.dialog.open(CallViewAudioPlayerComponent, {
      width: '500px',
      data: resourceURL,
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
  // to call the autocall api and pass all the details with contact number
  onCall() {
    if (
      this.enableOutboundCallsViaCallBridging &&
      this.contactNumber &&
      this.userNumber
    ) {
      let customerName;

      if (this.serviceToedit.secondName && this.serviceToedit.surname) {
        // if second name & surname is there
        customerName =
          this.serviceToedit.firstName +
          ' ' +
          this.serviceToedit.secondName +
          ' ' +
          this.serviceToedit.surname;
      } else if (this.serviceToedit.secondName && !this.serviceToedit.surname) {
        customerName = this.serviceToedit.firstName + ' ' + this.serviceToedit.secondName;
      } else if (!this.serviceToedit.secondName && this.serviceToedit.surname) {
        customerName = this.serviceToedit.firstName + ' ' + this.serviceToedit.surname;
      } else {
        customerName = this.serviceToedit.firstName;
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
          this.serviceToedit.companyName,
          this.customerId,
          customerName,
          startTime,
          null,
          this.autoCallToken,
          this.DIDNumber,
          this.serviceToedit.orgId ? this.serviceToedit.orgId : '',
          this.serviceToedit.associatedBranch
            ? this.serviceToedit.associatedBranch
            : 'none',
          this.callBridgingExtension,
          this.outboundCallBridgingType,
         null,
         null,
         this.serviceName,
         this.serviceId
        )
        .subscribe((data: any) => { });
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
      if (this.serviceToedit.secondName && this.serviceToedit.surname) {
        // if second name & surname is there
        customerName =
          this.serviceToedit.firstName +
          ' ' +
          this.serviceToedit.secondName +
          ' ' +
          this.serviceToedit.surname;
      } else if (this.serviceToedit.secondName && !this.serviceToedit.surname) {
        customerName = this.serviceToedit.firstName + ' ' + this.serviceToedit.secondName;
      } else if (!this.serviceToedit.secondName && this.serviceToedit.surname) {
        customerName = this.serviceToedit.firstName + ' ' + this.serviceToedit.surname;
      } else {
        customerName = this.serviceToedit.firstName;
      }
      this.commonService
        .onAutoCall(
          this.userNumber,
          this.altContactNumber,
          this.superUserId,
          this.userId,
          this.userName,
          this.serviceToedit.companyName,
          this.customerId,
          customerName,
          startTime,
          null,
          this.autoCallToken,
          this.DIDNumber,
          this.serviceToedit.orgId ? this.serviceToedit.orgId : '',
          this.serviceToedit.associatedBranch
            ? this.serviceToedit.associatedBranch
            : 'none',
          this.callBridgingExtension,
          this.outboundCallBridgingType,
          null,
          null,
          this.serviceName,
          this.serviceId
        )
        .subscribe((data: any) => { });
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
        .subscribe((data: any) => { });
      this.snack.open('Initiating Call', '', {
        duration: 2000,
      });
    }
  }

  // update assignedto from services details
  updateAssignedTo(assignedTo) {
    if (assignedTo.userId != this.serviceToedit.assignedTo) {
      let prevVal = {
        assignedTo: this.serviceToedit.assignedTo,
        assignedToName: this.commonService.getAssignedToName(this.serviceToedit.assignedTo),
      };
      let curVal = {
        assignedTo: assignedTo.userId,
        assignedToName: assignedTo.name,
      };
      const dialogRef = this.dialog.open(ChildServiceDetails, {
        width: '500px',
        data: {
          scenario: 'assignedTo',
          assignedTo,
          fieldNameservice: this.fieldNameservice,
        },
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          if (result) {
            // console.log(result);
            if (result === 'proceed') {
              // this.servicedetailsService.updateAssignedTo(
              //   this.superUserId,
              //   this.serviceId,
              //   assignedTo.userId,
              //   assignedTo.name,
              //   ChangeLogComponent.saveLog(
              //     this.constructor.name,
              //     this.userId,
              //     this.userName,
              //     prevVal,
              //     curVal,
              //     this.changeLog
              //   )

              // );
              this.snack.open('Successfully updated', '', {
                duration: 2000,
              });
            }
          }
        });
    }
  }
  // createUserlist() {
  //   //function to create list of users as per data acces rule
  //   let userList: any[] = [];
  //   let userIdArray = [];

  //     if (this.subUsers) {
  //       // create array of subuser ids and names
  //       this.subUsers.forEach((elem) => {
  //         userIdArray.push(elem.userId);
  //         userList.push({
  //           firstname: elem.firstname,
  //           lastname: elem.lastname ? elem.lastname : '',
  //           userId: elem.userId,
  //           branchId: elem.branchId ? elem.branchId : 'NA'

  //         });
  //       });
  //       userIdArray.push(this.superUserId);
  //       userList.push({
  //         firstname: this.superUserDetails.firstname,
  //         lastname: this.superUserDetails.lastname ? this.superUserDetails.lastname : '',
  //         userId: this.superUserId,
  //         branchId: this.superUserDetails.associatedBranch?this.superUserDetails.associatedBranch:'NA',
  //       });
  //     }

  //   return userList;
  // }

  assignedToEventHander($event: any) {
    if ($event !== null) {
      let assTo = $event;
      let assToName;
      let assBranch;

      for (let i = 0; i < this.allSubUsers.length; i++) {
        if (assTo === this.allSubUsers[i].userId) {
          assToName = this.allSubUsers[i].lastname
            ? this.allSubUsers[i].firstname + ' ' + this.allSubUsers[i].lastname
            : this.allSubUsers[i].firstname;
          if (this.allSubUsers[i].branchId) {
            assBranch = this.allSubUsers[i].branchId;
          } else {
            assBranch = 'NA';
          }
        }
      }

      const dialogRef = this.dialog.open(ChildServiceDetails, {
        width: '500px',
        data: {
          fieldNameService: this.fieldNameservice,
          scenario: 'assigned',
          serviceId: this.serviceId,
          fieldNameTask: this.fieldNameTask,
          fieldNameFollowup: this.fieldNameFollowup,
          checked: false,
          prevAssigned: this.commonService.getAssignedToName(this.serviceToedit.assignedTo),
          currAssigned: assToName,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.serviceAssignedTo = $event;

          if (this.serviceAssignedTo) {
            this.serviceAssignedToName = assToName;
            this.associatedBranch = assBranch;

            let prevVal = {
              assignedTo: this.serviceToedit.assignedTo,
              assignedToName: this.commonService.getAssignedToName(this.serviceToedit.assignedTo),
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
              assignedTo: this.serviceAssignedTo,
              assignedToName: this.serviceAssignedToName,
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
            if (this.serviceToedit.assignedTo != this.serviceAssignedTo) {
              if (result.checked === true) {
                this.servicedetailsService.updateAssignedTo(
                  this.superUserId,
                  this.serviceId,
                  this.serviceAssignedTo,
                  this.serviceAssignedToName,
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
                  return ele.assignedTo === this.serviceToedit.assignedTo;
                });

                tasksFiltered.forEach((ele) => {
                  this.servicedetailsService.onUpdateTask(
                    this.superUserId,
                    ele.id,
                    this.serviceAssignedTo,
                    this.serviceAssignedToName,
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
                  return ele.assignedTo === this.serviceToedit.assignedTo;
                });

                follsFiltered.forEach((ele) => {
                  this.servicedetailsService.onUpdateFollowUp(
                    this.superUserId,
                    ele.id,
                    this.serviceAssignedTo,
                    this.serviceAssignedToName,
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

                this.snack.open('Successfully updated', '', {
                  duration: 2000,
                });
              } else {
                this.servicedetailsService.updateAssignedTo(
                  this.superUserId,
                  this.serviceId,
                  this.serviceAssignedTo,
                  this.serviceAssignedToName,
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
          this.serviceAssignedTo = null;
          this.serviceAssignedToName = null;
        }
      });
    }
  }

  assignedToNameEventHander($event: any) {
    // this.serviceAssignedToName = $event;
  }

  branchIdEventHandler($event: any) {
    this.associatedBranch = $event;
    // console.log($event,this.associatedBranch);
    let prevVal = {
      associatedBranch: this.branches.find(
        (item) => item.id === this.prevAssBranch
      )?.name
        ? this.branches.find((item) => item.id === this.prevAssBranch)?.name
        : 'None',
    };
    let curVal = {
      associatedBranch: this.branches.find(
        (item) => item.id === this.associatedBranch
      )?.name,
    };
    if (
      this.associatedBranch !== null &&
      this.associatedBranch != this.prevAssBranch
    ) {
      this.servicedetailsService.updateBranch(
        this.superUserId,
        this.serviceId,
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
  getCreatedByName(userId){
    let createdByName = '';
    let obj = this.allSubUsers.find(o => o.userId === userId);
    if(!!obj){
      createdByName = obj.lastname?(obj.firstname+' '+obj.lastname):obj.firstname
    }
    return createdByName;
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
    this.lastNoteSubscription?.unsubscribe();
    this.productsSubscription?.unsubscribe();
    this.custSubscription?.unsubscribe();
    this.commonServSubscription?.unsubscribe();
    this.allFolowupSubscription?.unsubscribe();
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
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: this.customerId,
        companyNames: this.company,
        customerNames: customerName,
        contactNumber: this.contactDetails.contactNo ? this.contactDetails.contactNo:'', // pass customer number
        countryCode: this.contactDetails.code ? this.contactDetails.code:'', // pass customer country code
        assignedTo: this.custData.assignedTo,
        assignedToName: this.commonService.getAssignedToName(this.custData.assignedTo),
        scenario: 'create from service',
        subUsers: this.subUsers,
        fname: this.superUserDetails.firstname,
        lastname: this.superUserDetails.lastname,
        serviceId: this.serviceId,
        serviceTitle: this.serviceName,
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
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
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

  // to send whatsapp message
  async onWhatsAppContact() {
    //first fetch whatsapp sale templates
    await this.getAllServiceWaTemp();
  }
  // Db fetch all templates related to whatsapp and sale
  getAllServiceWaTemp() {
    return new Promise<void>((resolve) => {
      this.servicedetailsService
        .getAllServiceWaTemp(this.superUserId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.serviceWaTemp = data.map((e) => {
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
        (subuser) => subuser.userId === this.serviceAssignedTo
      );
    }
    var contact = this.custData;
    var service = this.serviceToedit;
    const code = this.custData.code?.replace('+', '');
    var assignedTo = {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
    };
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
    if (selectedTempl === 'noTemplate') {
      window.open(
        `https://web.whatsapp.com/send?phone=${code}${this.custData.contactNo}`,
        '',
        'width=800,height=600'
      );
    } else {
      var str: any = selectedTempl.body
        .replace(/\#\[service.Service Title\]/g, service.serviceTitle)
        .replace(/\#\[service.Estimated Value\]/g, service.estimatedValue)
        .replace(
          /\#\[service.Start Date\]/g,
          this.convertDate(service.startDate)
        )
        .replace(
          /\#\[service.Expected Completion Date\]/g,
          this.convertDate(service.expCompletionDate)
        )
        .replace(/\#\[service.Stage\]/g, this.commonService.getStatusName('services', service.selectedServPipeline,service.servicesStage))
        .replace(/\#\[service.Priority\]/g, service.priority)
        .replace(/\#\[service.Assigned To\]/g, service.assignedToName)
        .replace(
          /\#\[service.Description\]/g,
          service.description
            ? service.description
            : 'Service Description not provided'
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
      if (this.superUserDetails.customFieldsService) {
        let teststring = str;
        for (
          let i = 0;
          i < this.superUserDetails.customFieldsService.length;
          i++
        ) {
          var str1 =
            '\\#\\[service.' +
            this.superUserDetails.customFieldsService[i].fieldName +
            '\\]';
          var re = new RegExp(str1, 'g');
          teststring = teststring.replace(
            re,
            service.additionalFieldsArr
              ? service.additionalFieldsArr[i + '']?.fieldValue
                ? this.superUserDetails.customFieldsService[i].fieldType ==
                  'date'
                  ? typeof service.additionalFieldsArr[i + ''].fieldValue ==
                    'object'
                    ? this.convertDate(
                      service.additionalFieldsArr[i + ''].fieldValue
                    )
                    : 'Date not provided'
                  : this.superUserDetails.customFieldsService[i].fieldType ==
                    'date_time'
                    ? this.convertDateTime(
                      service.additionalFieldsArr[i + ''].fieldValue
                    )
                    : service.additionalFieldsArr[i + '']?.fieldValue
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
  selector: 'child-service-details',
  templateUrl: 'child-service-details.html',
  styleUrls: ['./service-details.component.scss'],
})
export class ChildServiceDetails {
  proceed = 'proceed';
  rejectionReasonArr: string[] = []; //reason for rejection options stored as an array
  rejectionReasonArrPresent = true; //if reason for rerejection array is present/not
  constructor(
    public dialogRef: MatDialogRef<ChildServiceDetails>,
    @Inject(MAT_DIALOG_DATA) public data,
    public networkCheck: NetworkCheckService
  ) {
    const rejArr = data.rejectionReasonArr?.filter((n) => n);

    if (!!rejArr && rejArr.length > 0) {
      this.rejectionReasonArr = rejArr;
      this.rejectionReasonArrPresent = true;
    } else {
      this.rejectionReasonArr[0] = 'No options are available';
      this.rejectionReasonArrPresent = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
// add product
@Component({
  selector: 'services-add-product',
  templateUrl: 'services-add-product.html',
  styleUrls: ['./service-details.component.scss'],
})
export class ServicesAddProduct {
  products: ProductModel[] = [];
  superUserId: string;
  selectedProduct: ProductModel;
  prodSelected: boolean = false;

  productName: string;
  productCode: string;
  productDes: string;
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

  myControl = new FormControl();
  filteredOptions: Observable<ProductModel[]>;
  Obj: any;
  isMobilesize: boolean = false;
  productId = '';
  productCategory = '';
  estValue = 0;
  oldEstValue = 0;

  constructor(
    @Optional() public dialogRef: MatDialogRef<ServicesAddProduct>,
    private serviceInstance: ServiceDetailsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private location: Location,
    private servicedetailsService: ServiceDetailsService,
    private snack: MatSnackBar,
    private router: Router
  ) {
    if (!data) {
      route.params.subscribe((val) => {
        this.Obj = this.route.snapshot.paramMap.get('Obj');
        this.data = JSON.parse(this.Obj);
        this.estValue = this.data.estValue;
      });
      //Check the screen size
      this.isMobilesize = this.commonService.isMobilesize;
    }

    this.currencyList = Currencies.getCurencies();
    this.prodUnitaArray = this.getunits();

    if (this.data.scenario == 'edit' && this.isMobilesize == true) {
      this.servicedetailsService
        .getSingleProduct(
          this.data.superUserId,
          this.data.saleId,
          this.data.productId
        )
        .subscribe((data) => {
          this.prodSelected = true;
          this.productName = data.prodName;
          this.productCode = data.hsnCode;
          this.productDes = data.prodDes;
          this.currency = data.currency;
          this.unitPrice = data.unitPrice;
          this.unit = data.unit;
          this.taxType = data.taxType;
          this.discount = data.discount;
          this.cgst = data.cgst;
          this.sgst = data.sgst;
          this.igst = data.igst;
          this.availability = data.availability;
          this.vatRate = data.vatRate;
          this.quantity = data.quantity;
          this.oldEstValue =
            this.unitPrice * (1 - this.discount / 100) * this.quantity;
        });
    } else if (this.data.scenario == 'edit' && this.isMobilesize == false) {
      this.prodSelected = true;
      this.productName = data.product.prodName;
      this.productCode = data.product.hsnCode;
      this.productDes = data.product.prodDes;
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
    }
    this.superUserId = this.data.superUserId;

    // if scenario is create, we need all products to fetch from DB
    if (this.superUserId) {
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

            this.filteredOptions = this.myControl.valueChanges.pipe(
              startWith(''),

              map((value) =>
                typeof value === 'string' ? value : value.fname1
              ),
              map((fname1) =>
                fname1 ? this._filter(fname1) : this.products.slice()
              )
            );
          });
      }
    }
  }
  onBack() {
    this.location.back();
  }
  private _filter(value) {
    const filterValue = value.toLowerCase();
    return this.products.filter((option) =>
      option.prodName.toLowerCase().includes(filterValue)
    );
  }

  // autoComplete display function
  displayFn(subject) {
    return subject ? subject.prodName : undefined;
  }

  onNoClick1(): void {
    this.dialogRef.close();
  }

  productSelected() {
    for (let i = 0; i < this.products.length; i++) {
      if (this.selectedProduct.id == this.products[i].id) {
        this.prodSelected = true;
        this.productName = this.selectedProduct.prodName;
        this.productCode = this.selectedProduct.hsnCode;
        this.productDes = this.selectedProduct.prodDes;
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
  }
  // get Units
  getunits(): string[] {
    this.pUnits = new ProductUnits();
    return this.pUnits.prodUnits;
  }

  addP(
    PName,
    PCode,
    Pdes,
    curr,
    price,
    unit,
    qty,
    dis,
    cgst,
    sgst,
    igst,
    vat,
    tax
  ) {
    let newProduct = {
      prodName: PName,
      hsnCode: PCode ? PCode : ' ',
      prodDes: Pdes ? Pdes : ' ',
      currency: curr,
      unitPrice: price ? price : 0,
      unit: unit ? unit : ' ',
      quantity: qty,
      discount: dis ? dis : 0,
      cgst: cgst ? cgst : 0,
      sgst: sgst ? sgst : 0,
      igst: igst ? igst : 0,
      // availability:result[11],
      vatRate: vat ? vat : 0,
      taxType: tax,
      productId: this.productId,
      prodCategory: this.productCategory ? this.productCategory : '',
    };

    this.servicedetailsService
      .addProduct(this.superUserId, this.data.saleId, newProduct)
      .then((res) => {
        const updatedEstvalue5 = this.estValue + price * (1 - dis / 100) * qty;
        this.servicedetailsService.updateserviceEstValue(
          this.superUserId,
          this.data.saleId,
          updatedEstvalue5
        );
        this.snack.open('Successfully added', '', {
          duration: 500,
        });
      })
      .catch((e) => {
        this.snack.open('Error while adding ', '', {
          duration: 2000,
        });
      });

    this.router.navigate([`/dash/sales/saleview/${this.data.saleId}`]);
  }
  deleteP(result) {
    this.servicedetailsService.deleteProduct(
      this.superUserId,
      this.data.saleId,
      result.id
    );

    this.snack.open('Successfully deleted', '', {
      duration: 500,
    });
  }
  editP(
    id,
    productDes,
    currency,
    unitPrice,
    unit,
    quantity,
    discount,
    cgst,
    sgst,
    igst,
    vatRate
  ) {
    const newEstValue = unitPrice * (1 - discount / 100) * quantity;
    this.servicedetailsService.updateProduct(
      this.superUserId,
      this.data.saleId,
      id,
      productDes,
      currency,
      unitPrice ? unitPrice : 0,
      unit,
      quantity,
      discount ? discount : 0,
      cgst ? cgst : 0,
      sgst ? sgst : 0,
      igst ? igst : 0,
      vatRate ? vatRate : 0
    );
    if (this.oldEstValue !== newEstValue) {
      const updEstVal = this.estValue + newEstValue - this.oldEstValue;
      this.servicedetailsService.updateserviceEstValue(
        this.superUserId,
        this.data.saleId,
        updEstVal
      );
    }
    this.snack.open('Successsfully updated', '', {
      duration: 500,
    });
    this.router.navigate([`/dash/sales/saleview/${this.data.saleId}`]);
  }
}
