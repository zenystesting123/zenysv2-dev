/**********************************************************************************
Description: Component is used to dispaly details for a particular contact
             add and edit priority, status, assigned to, sale, sale documents, collection,
             task, attachment, followups, email associated with this contact
Inputs: userdata, superuser data, access control settings, layout iobserver from common service
Outputs:
Child : confirm-edit-assignedto :-
        Description: Popup used to confirm an updation of assigned to field of contact
        Input : to be updated assigned to name
**********************************************************************************/
import { CustomerDetailsService } from './customer-details.service';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  addFieldsArr,
  Attachments,
  Customer,
  CustomerNotes,
  FollowUps,
  Invoice,
  PaymentReceipt,
  PlanDocLimit,
  Profile,
  Sales,
  Service,
  SubUsers,
  Task,
  UserAccessDetails,
  defaultContactSettings,
  contactSettings,
  messageTemplateModel,
  defaultTaskSettings,
  taskSettings,
  saleSettings,
  defaultSaleSettings,
  taggedUsers,
  serviceSettings,
  defaultServiceSettings,
  Expenses,
  deleteLogModel,
  paymentSettings,
  defaultPaymentSettings,
  expenseSettings,
  defaultExpenseSettings,
  tagUsers,
} from '../../data-models';
import { finalize, takeUntil } from 'rxjs/operators';
import { CrudModal1Component } from 'src/app/taskboard/crud-modal1/crud-modal1.component';
import { Paymentreceipt1Component } from '../../paymentreceipt1/paymentreceipt1.component';
import { Addnewsale1Component } from '../../addnewsale1/addnewsale1.component';
import { ChangecustprioritydialogComponent } from '../../changecustprioritydialog/changecustprioritydialog.component';
import { ChangecuststatdialogComponent } from '../../changecuststatdialog/changecuststatdialog.component';
import { RejectleaddialogComponent } from '../../rejectleaddialog/rejectleaddialog.component';
import { NgForm } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { ConfirmationpopupComponent } from '../../confirmationpopup/confirmationpopup.component';

// for gmail integration
import { GoosleapitofirebaseService } from '../../gmail/googleapis/goosleapitofirebase.service';
// end of for gmail integration

import { animate, style, transition, trigger } from '@angular/animations';
import { Location } from '@angular/common';
import { Addcontactpopup1Component } from '../../addcontactpopup1/addcontactpopup1.component';
import { NetworkCheckService } from '../../networkcheck.service';
import { CommonService } from 'src/app/common.service';
import { GoogleCalendarEventService } from 'src/app/calendar-events/google-calendar-event.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { MatTableDataSource } from '@angular/material/table';
import { FullLayoutComponent } from 'src/app/full-layout/full-layout.component';
import { CallViewAudioPlayerComponent } from 'src/app/call-view-audio-player/call-view-audio-player.component';
import { FollowupTaskCreateComponent } from 'src/app/followup-task-create/followup-task-create.component';
import { CrudServiceComponent } from 'src/app/crud-service/crud-service.component';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { Pipelines, statusModel } from 'src/app/model/pipeline.modal';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
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
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('file') file;
  @ViewChild('customDoc') customDoc;

  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  parentSubject: Subject<any> = new Subject(); //for email
  displayedColumns: string[] = [
    'Date',
    'Invoice No',
    'Payment Mode',
    'Amount',
    'edit',
  ]; //collection table columns
  displayedColumn: string[] = ['Date', 'Filename', 'Uploaded', 'edit']; //attachment table columns
  displayedColumnSale: string[] = [
    'saleTitle',
    'salesStage',
    'selectedSalePipeline',
    'assignedToName',
  ]; //sale table columns
  dataSourceService: any = null; //for sales table: mat-table-dataSource
  displayedColumnService: string[] = [
    'serviceTitle',
    'servicesStage',
    'selectedServPipeline',
    'assignedToName',
  ]; //sale table columns
  serviceSettings: serviceSettings = defaultServiceSettings.CONST_VALUE; //default sale settings values
  dataSourceCollection: any = null; //for collection table
  dataSourceAttachments: any = null; //for attachment table
  dataSourceSales: any = null; //for sales table: mat-table-dataSource
  allTasks: Task[] = []; //variable holds all tasks fetched
  dataSourceTask: any = null; //for task mat-table
  displayedColumnsTask: string[] = [
    'title',
    'dueDate',
    'priority',
    'assignedTo',
    'status',
    'actions',
  ]; //task table columns
  customerName: string = ''; //customer first name + customeer seciond name
  attachmentSize: any; //attacnhment size
  networkConnection: boolean; //network connection check
  disableSale: boolean = false; //disable addition of sale
  disableService: boolean = false; //disable addition of sale
  customerDetails: Observable<Customer>; // data read from DB and use async operator to display in HTML
  salesInProgress: number = 0; //sales in pogresss associated with this customer
  salesList: Sales[] = []; //all sales associated with this customer
  servicesList: Service[] = []; //all services associated with this customer
  quotations: Invoice[] = []; //quotations associated with this customer
  estimate: Invoice[] = []; //estimatess associated with this customer
  paymentReceipts: PaymentReceipt[] = []; //collections associated with this customer
  tasks: Task[] = []; //open tasks associated with this customer
  invoices: Invoice[] = []; //invoices associated with this customer
  error: string;
  dragAreaClass: string;
  customDocuments: any[] = []; //custom uploadDOcuments
  customerSubscribtion: Subscription; //customer data subscription
  private commonServSub: Subscription; //common service userdatas subscription
  usrProfileData: UserAccessDetails = null; //access control settings from common service
  activetab: string = ''; //for tabclick event,
  userData: Profile = null; //logged in users data from common service
  superUserData: Profile = null; //logged in users superuser data from common servcie
  nextFollowUp: FollowUps[]; //next followup
  allFollowUp: FollowUps[]; //all followups
  followUps: FollowUps[] = [];
  fileBeingUploaded: boolean = false;
  progressBarStatus: boolean = false; //progress bar status
  uploadFileLimit: any = [];
  task: AngularFireUploadTask; //for attachment upload
  customerNote: CustomerNotes; //single editing customer note
  customerNotes: CustomerNotes[] = []; //collection of csuomter notes
  userName: string; //logged in users full name
  attachments: Attachments[] = []; //attachments under this customer
  dataAccessRule: string = ''; //dataAccessRule of logged in user
  superUserId: string = ''; //logged in users superuser id
  userRole: string = ''; //logged in users user role
  accountType: string = ''; //logged in users account type
  userId: string = ''; //logged in users id
  customerPipelines: Pipelines[] = []; //status stored under super user profile
  customerStatus: statusModel[] = [];
  today: Date = new Date();
  custData: Customer = null; //customer details
  assignedTo: string; //assigned to id of current customer
  prevAssignedTo: string; //assigned to id of current customer
  assignedToName: string; //assigned to name of current customer
  subUsers: SubUsers[] = []; //subusers under super user
  userFirstName: string; //super user first name
  userSecondName: string; //super user second name
  noteEditMode: boolean = false; //notes edit mode control

  // for additional fields
  additionalFields: any[];
  filteredAdditionalField: any = []; // to hold only active custom fields
  addFieldArrModel: addFieldsArr = {
    fieldValue: null,
  };
  fieldListArray = [this.addFieldArrModel];

// other collections subscriptions associated with this customer
private taskSubscription: Subscription;
private allTasksSubscription: Subscription;
private attachmentSubscription: Subscription;
private notesSubscription: Subscription;
private documentSubscription: Subscription;
private collectionSubscription: Subscription;
private EstSubscription: Subscription;
private QuoteSubscription: Subscription;
private InvSubscription: Subscription;
private saleSubscription: Subscription;
private serviceSubscription: Subscription;
private lastNoteSubscription: Subscription;
private ExpenseSubscription: Subscription;

  // layout check variables
  isTabletsize: boolean = false;
  isMobilesize: boolean = false;

  // access control settings boolean
  disableAddContact: boolean = false;
  disableViewContact: boolean = false;
  disableEditContact: boolean = false;
  disableDeleteContact: boolean = false;
  disableSaleView: boolean = false;
  disableServiceView: boolean = false;
  disableDocEst: boolean = false; //disable Sales Doc view
  disableDocCreateEst: boolean = false; //disable Sales Doc view
  disableDocQuot: boolean = false; //disable Sales Doc view
  disableDocCreateQuot: boolean = false; //disable Sales Doc view
  disableDocInv: boolean = false; //disable Sales Doc view
  disableDocCreateInv: boolean = false; //disable Sales Doc view
  disableFoll: boolean = false; //create followups disable
  disableFollEdit: boolean = false;
  disableFollView: boolean = false;
  disableNotes: boolean = false; //create notes disable
  disableNotesView: boolean = false;
  disableNotesEdit: boolean = false;
  disableAtt: boolean = false; //add attachemnt disabling
  disableAttView: boolean = false;
  disableAttRemove: boolean = false;
  disableColl: boolean = false; //create collection disable
  disableCollView: boolean = false;
  disableCollEdit: boolean = false;
  disableTaskAdd = false;
  disableTaskEdit = false;

  // customisable field names
  fieldNameContact: string = 'Contact';
  fieldNameSale: string = 'Sale';
  fieldNameService = 'Support';
  fieldNameFollowup: string = 'FollowUp';
  fieldNameTask: string = 'Task';
  fieldNameEstimate: string = 'Estimate';
  fieldNameQuotation: string = 'Quotation';
  fieldNameInvoice: string = 'Invoice';
  fieldNameExpense: String = 'Expense';
  fieldNameCollection: string = 'Collection';
  fieldNameContactNotes: string = 'Note';

  // for gmail integration
  dataSourceEmail: any[] = [];
  plan: any;
  downloadUrl: any;
  // for making payment link
  totalunread: number = 0;
  composeopen: boolean = false;

  totalUserCount: number = 1;
  totalUploadLimit: number;
  currentlyUploaded: number;
  uploadPercentage: number;
  currentPlan: string;
  loading: boolean = true;
  uploadProgress$: Observable<number>; //to display upload progress of attachment
  uploadReset: Observable<number>; // to display upload progress of attachmeny
  custId: string; //current customer id
  isHovering: boolean; //for drag and drop
  createDate: any; //created date of super user profile
  snapshot: Observable<any>; //to upload attachment
  initClientSubscription: Subscription;
  selectedCode: string = '';
  contactNumber: string = '';
  selectedAltCode: string = ''; //Alternate contact number country code
  alternateContactNumber: string = '';
  enableOutboundCallsViaCallBridging: boolean = false;
  userNumber: string;
  callBridgingServiceProvider: string;
  autoCallToken: string = '';
  allSubUsers: SubUsers[] = [];
  disableReAssign = false;
  viewCheck: boolean = false; //Check whether current user has access to the particular record. true - allowed, false - not allowed
  viewCheckTagged = false; //boolean to control users view access: no view access in normal case, but view is enabled by tagging
  navSelected: string = 'Info';
  serviceInProgress: number;
  serviceWon: number;
  serviceLost: number;
  salesWon: number;
  salesLost: number;

  changeLog: any = {};

  //customisation field
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  taskSettings: taskSettings = defaultTaskSettings.CONST_VALUE;
  saleSettings: saleSettings = defaultSaleSettings.CONST_VALUE; //default sale settings values
  paymentSettings: paymentSettings = defaultPaymentSettings.CONST_VALUE; //default payment settings values
  expenseSettings: expenseSettings = defaultExpenseSettings.CONST_VALUE;

  associatedBranch = '';
  prevAssBranch = '';
  branches = [];
  prevNote: any;
  contactWaTemp: messageTemplateModel[] = []; //to hold the fetrched contact whatsapp message templates
  allFolowupSubscription: Subscription; // for closing all followupsubscription
  DIDNumber: string = ''; // did number for autocall
  taggedUserArray: taggedUsers[] = []; //tagged users array stored under customer doc
  taggedUserIdArray: string[] = []; //array holding only userId s of tagged users

  //custom pipe to implement sorting of data wrt
  // date modified in changeLog/created date in salestable
  propName = 'dateModified'; //property for sorting
  customsort = (a, b) => {
    //returns the greater date first
    return Number(b.value[this.propName]) - Number(a.value[this.propName]);
  };
  taskStatusOptions: any = []; // for holding task status
  lastStatusOption: any; //get last status
  taskDefaultOpn: any[] = ['Open', 'Completed'];

  filteredOptions: taggedUsers[] = []; //filtered taggedUsers list
  searchTerm = ''; //input entry to search in tag users
  mailChoosen: string = ''; //to choose the mail to use
  allCustomDocuments: any[] = []; //documents array
  selectedFile: any;
  listDocument: any[] = []; //array  for storing customDocuments
  currentDocument: any; //current document in upload
  callBridgingExtension: any; //extension
  outboundCallBridgingType: any = '';
  pipelineId = 0; //pipelineId of contact

  constructor(
    private analytics: AngularFireAnalytics,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private fullLayoutComp: FullLayoutComponent,
    private ref: ChangeDetectorRef,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private db: CustomerDetailsService,
    public goog: GoogleCalendarEventService,
    public db2: GoosleapitofirebaseService,
    private location: Location,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService
  ) {
    this.initClientSubscription = this.goog.initClient.subscribe((_data) => {});

    route.params.pipe(takeUntil(this.onDestroy$)).subscribe((_val) => {
      //Section 1: Get the information passed on to the module using router link
      this.custId = this.route.snapshot.paramMap.get('custId');
    });
  }
  getStatusName(statusId) {
    if (!!statusId) {
      var result = this.customerStatus.filter((obj) => {
        return obj.stageId === statusId;
      });
      const statusName = result[0].name;
      return statusName ? statusName : 'N/A';
    }
  }
  stageInPipeline(i) {
    var result = this.customerStatus.filter((obj) => {
      return obj.stageId === this.custData.status;
    });
    const statusObj = result[0];
    let currentStageIndex = this.customerStatus.indexOf(statusObj);

    //If current stage is not won or lost
    if (i <= this.customerStatus.length - 3) {
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
    else if (i == this.customerStatus.length - 2) {
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

  ngOnInit() {
    this.uploadFileLimit = PlanDocLimit.sizeLimit;
    this.commonServSub = this.commonService.userDatas.subscribe((allData) => {
      this.isMobilesize = allData.isMobileSize;
      // fetch data from common service and assign to local  variables
      this.userData = allData.userDetails;
      this.userId = allData.userId;
      this.superUserId = this.userData.superUserId;

      this.customerPipelines = JSON.parse(
        JSON.stringify(allData.customerPipelines)
      );
      if (this.commonService.userPlan.multiPipelineAccess) {
        // do nothing
      } else {
        this.customerPipelines.length = 1;
      }

      // assign whatsapp templates from common service
      this.contactWaTemp = allData.whatsAppTemplates.filter(
        (templates) => templates.tempRecType === 'Contact'
      );

      if (allData.superUserDetails.DIDNumber) {
        this.DIDNumber = allData.superUserDetails.DIDNumber;
      }
      this.branches = allData.branches;

      this.userName =
        this.userData.firstname +
        (this.userData.lastname ? ' ' + this.userData.lastname : '');
      this.userRole = this.userData.userRole;
      this.accountType = this.userData.accountType;
      this.superUserData = allData.superUserDetails;
      this.dragAreaClass = 'dragarea';
      this.dataAccessRule = allData.usrProfileData.contactDataAccessRule;
      //get customDoc value
      this.customDocuments = allData.superUserDetails.contactCustomDoc
        ? allData.superUserDetails.contactCustomDoc
        : this.customDocuments;
      // check restriction
      this.usrProfileData = allData.usrProfileData;
      // modules view/edit/delete disabling section
      if (!!this.usrProfileData && this.viewCheckTagged === false) {
        // disable contact section
        if (this.usrProfileData.isCheckedCont == false) {
          this.disableAddContact = true;
          this.disableViewContact = true;
          this.disableEditContact = true;
          this.disableDeleteContact = true;
          this.disableReAssign = true;
        } else {
          if (this.usrProfileData.contactsCreate == false) {
            this.disableAddContact = true;
          }
          if (this.usrProfileData.contactsView == false) {
            this.disableViewContact = true;
          }
          if (this.usrProfileData.contactsEdit == false) {
            this.disableEditContact = true;
            this.disableReAssign = true;
          }
          if (this.usrProfileData.contactsDelete == false) {
            this.disableDeleteContact = true;
          }
          if (this.usrProfileData.contactReAssign == false) {
            this.disableReAssign = true;
          }
        }
        // disable Sale
        if (this.usrProfileData.isCheckedSale == false) {
          this.disableSale = true;
          this.commonService.addDocLimitaion.addSaleDisable = true;
          this.disableSaleView = true;
        } else {
          if (this.usrProfileData.salesCreate == false) {
            this.disableSale = true;
            this.commonService.addDocLimitaion.addSaleDisable = true;
          }
          if (this.usrProfileData.salesView == false) {
            this.disableSaleView = true;
          }
        }
        // disable services
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
        if (this.usrProfileData.isCheckedContAtt == false) {
          this.disableAtt = true;
          this.disableAttRemove = true;
          this.disableAttView = true;
        } else {
          if (this.usrProfileData.contattAdd == false) {
            this.disableAtt = true;
          }
          if (this.usrProfileData.contattRemove == false) {
            this.disableAttRemove = true;
          }
          if (this.usrProfileData.contattView == false) {
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
      }
      if (allData.superUserDetails.autoCallToken) {
        this.autoCallToken = allData.superUserDetails.autoCallToken;
      }

      if (allData.superUserDetails.callBridgingServiceProvider) {
        this.callBridgingServiceProvider =
          allData.superUserDetails.callBridgingServiceProvider;
      }
      this.userNumber = allData.userDetails.phone;
      if (allData.superUserDetails.enableOutboundCallsViaCallBridging) {
        this.enableOutboundCallsViaCallBridging =
          allData.superUserDetails.enableOutboundCallsViaCallBridging;
      }
      if (allData.superUserDetails.outboundCallType) {
        this.outboundCallBridgingType =
          allData.superUserDetails.outboundCallType;
        // console.log(" this.callBridgingType", this.outboundCallBridgingType)
      }
      if (this.superUserId === this.userId) {
        if (allData.superUserDetails.extensionNumber) {
          this.callBridgingExtension = allData.superUserDetails.extensionNumber
            ? allData.superUserDetails.extensionNumber
            : '';
        }
      } else {
        const userObject = allData.subUsers.find(
          (user) => user.userId === this.userId
        );
        this.callBridgingExtension = userObject
          ? userObject.extensionNumber
          : null;
      }
      this.plan = this.superUserData.plan;
      this.createDate = this.superUserData.createdDate;

      //taskStatusOptions
      this.taskStatusOptions = allData.superUserDetails.taskStatusOpn
        ? allData.superUserDetails.taskStatusOpn
        : this.taskDefaultOpn;
      this.lastStatusOption =
        this.taskStatusOptions[this.taskStatusOptions?.length - 1];
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
        // sales settings fetch from DB, if field exists
        if (
          allData.superUserDetails.saleSettings &&
          typeof allData.superUserDetails.saleSettings !== 'undefined' &&
          allData.superUserDetails.saleSettings !== null
        ) {
          this.saleSettings = allData.superUserDetails.saleSettings;
        }
        // services settings fetch from DB, if field exists
        if (
          allData.superUserDetails.serviceSettings &&
          typeof allData.superUserDetails.serviceSettings !== 'undefined' &&
          allData.superUserDetails.serviceSettings !== null
        ) {
          this.serviceSettings = allData.superUserDetails.serviceSettings;
        }
       
      }

      //Read the customer form customization settings

      this.additionalFields = this.superUserData.customFieldsContact;

      this.plan = this.superUserData.plan;
      this.attachmentSize = this.superUserData.totalAttachmentsSize;

      if (!this.attachmentSize) {
        this.attachmentSize = 0;
      }
      this.userFirstName = this.superUserData.firstname;
      this.userSecondName = this.superUserData.lastname;
      this.totalUserCount = allData.superUserDetails.noSubusers + 1;
      this.currentlyUploaded = allData.superUserDetails.totalAttachmentsSize;
      this.currentPlan = allData.superUserDetails.plan;

      if (this.currentPlan == 'diamond') {
        this.totalUploadLimit =
          this.uploadFileLimit.diamond * this.totalUserCount;
      } else if (this.currentPlan == 'gold') {
        this.totalUploadLimit = this.uploadFileLimit.gold * this.totalUserCount;
      } else {
        this.totalUploadLimit = this.uploadFileLimit.free * this.totalUserCount;
      }

      this.uploadPercentage = Math.round(
        (this.currentlyUploaded / this.totalUploadLimit) * 100
      );

      if (this.superUserData.fieldNames) {
        // assigning custom field names
        this.fieldNameContact = this.superUserData.fieldNames.fieldNameContact;
        this.fieldNameSale = this.superUserData.fieldNames.fieldNameSale;
        this.fieldNameTask = this.superUserData.fieldNames.fieldNameTask;
        this.fieldNameFollowup =
          this.superUserData.fieldNames.fieldNameFollowup;
        this.fieldNameEstimate =
          this.superUserData.fieldNames.fieldNameEstimate;
        this.fieldNameQuotation =
          this.superUserData.fieldNames.fieldNameQuotation;
        this.fieldNameInvoice = this.superUserData.fieldNames.fieldNameInvoice;
        this.fieldNameExpense = this.superUserData.fieldNames.fieldNameExpense;
        this.fieldNameCollection =
          this.superUserData.fieldNames.fieldNameCollection;
        this.fieldNameContactNotes =
          this.superUserData.fieldNames.fieldNameContactNotes;
      }
      if (this.superUserData?.fieldNames?.fieldNameService) {
        this.fieldNameService = this.superUserData.fieldNames.fieldNameService;
      }
      //Get the list of subusers for the super user

      this.subUsers = allData.subUsers;
      this.allSubUsers = this.commonService.createUserlist('All', 'any')[1];

      // fetch particu;lar customers data
      this.customerDetails = this.db.readCustRecord(
        this.superUserId,
        this.custId
      ); //used with async operators
      this.customerSubscribtion = this.customerDetails.subscribe((data) => {
        if (data) {
          this.custData = data;
          {
            this.assignedTo = data.assignedTo;
            this.prevAssignedTo = data.assignedTo;
            this.assignedToName = this.commonService.getAssignedToName(
              data.assignedTo
            );
            this.associatedBranch = data.associatedBranch
              ? data.associatedBranch
              : '';
            this.prevAssBranch = data.associatedBranch
              ? data.associatedBranch
              : '';

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

            let viewCheckPrimary =
              this.commonService.checkDataAccessRule(
                'customers',
                this.userId,
                this.assignedTo,
                this.custData.associatedBranch
              ) || data.createdBy == this.userId; //Allow user to view if the document had been created b user or passess data acces rule criteria

            // if user already has access to contact no need to check access further
            if (viewCheckPrimary === true) {
              this.viewCheck = true;
              // if user has no access, check if user is tagged and thus allow access
            } else {

              this.viewCheck = this.commonService.checkTaggedUser(
                'customers',
                this.userId,
                this.taggedUserIdArray
              );

              if (this.viewCheck === true) {
                this.viewCheckTagged = true; //visible only due to tagged user criteria
              }
            }

            if (this.viewCheckTagged === true) {
              // disable task section
              this.disableTaskAdd = true;
              this.disableTaskEdit = true;

              // disable contact section
              this.disableAddContact = true;
              this.disableViewContact = false;
              this.disableEditContact = true;
              this.disableDeleteContact = true;
              this.disableReAssign = true;

              // disable Sale
              this.disableSale = true;
              this.commonService.addDocLimitaion.addSaleDisable = true;
              this.disableSaleView = false;

              // disable services
              this.disableService = true;
              this.disableServiceView = false;

              // disable estimates
              this.disableDocEst = false;
              this.disableDocCreateEst = true;

              // disable quotation
              this.disableDocQuot = false;
              this.disableDocCreateQuot = true;

              // disable invoices
              this.disableDocInv = false;
              this.disableDocCreateInv = true;

              // disable followups
              this.disableFoll = true;
              this.disableFollEdit = true;
              this.disableFollView = false;

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
            }

            if (data.changeLog) {
              const changeLogArray: any = Object.values(data.changeLog);
              this.changeLog = changeLogArray.sort(
                (objA, objB) =>
                  Number(objB.dateModified) - Number(objA.dateModified)
              );
            }
            this.pipelineId = data.selectedContactPipeline;

            var result = this.customerPipelines.filter((obj) => {
              return obj.pipelineId === data?.selectedContactPipeline;
            });
            if (result.length > 0) {
              this.customerStatus = result[0]?.pipelineStages?.map(
                ({ name, stageId }) => ({
                  name,
                  stageId,
                })
              );
            }
            if (data.additionalFieldsArr) {
              this.fieldListArray = data.additionalFieldsArr;
              const fieldListLen = Object.keys(this.fieldListArray).length;
              for (let i = 0; i < this.additionalFields?.length; i++) {
                this.additionalFields[i].datavalue = '';
              }
              if (fieldListLen != 0) {
                for (let i = 0; i < fieldListLen; i++) {
                  if (!!this.additionalFields) {
                    if (this.additionalFields[i]) {
                      this.additionalFields[i].datavalue =
                        this.fieldListArray[i].fieldValue;
                    }
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
            this.selectedCode = data.code ? data.code : '';
            this.contactNumber = data.contactNo ? data.contactNo : '';

            this.alternateContactNumber = data.alternateContactNumber
              ? data.alternateContactNumber
              : '';
            this.loading = false;
            if (this.custData) {
              this.progressBarStatus = true;
            }
          }
        }
      });

      // getting all followup
      this.allFolowupSubscription = this.db
        .getAllFollowUps(this.custId, this.superUserId)
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
          this.nextFollowUp.sort((a, b) => a.callStartDate - b.callStartDate); // sort open followup by call start date ascending order
          this.allFollowUp.sort((a, b) => b.callStartDate - a.callStartDate); // sort all followup by call start date descending order
          this.followUps = this.nextFollowUp;
        });

      //Get all notes
      this.notesSubscription = this.db
        .readNote(this.custId, this.superUserId)
        .subscribe((data) => {
          let EditableData = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as CustomerNotes;
          });

          EditableData.forEach((element) => {
            element.isEditable = false;
          });
          this.customerNotes = EditableData;
        });

      //get all documents
      this.documentSubscription = this.db
        .fetchdocuments(this.custId, this.superUserId)
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
      //get sales - we need to fetch sale length in web so as to disable add collection button in mat-toolbar

      // we are reading the list of sales in advance to determine if the add document button should be activated
      this.saleSubscription = this.db
        .getSales(
          this.custId,
          this.superUserId,
          this.usrProfileData.saleDataAccessRule,
          this.userId
        )
        .subscribe((data) => {
          this.salesList = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Sales;
          });
          // assign to table data
          this.dataSourceSales = new MatTableDataSource([]);
          this.dataSourceSales.data = this.salesList;

          this.salesInProgress = this.salesList.filter(
            (record) => record.inPipeline == true
          ).length;
          this.salesWon = this.salesList.filter(
            (record) => record.won == true
          ).length;
          this.salesLost = this.salesList.filter(
            (record) => record.lost == true
          ).length;
          // if (this.salesList?.length == 0) {
          //   this.disableColl = true;
          // }
        });

      this.serviceSubscription = this.db
        .getServices(
          this.custId,
          this.superUserId,
          this.usrProfileData.serviceDataAccessRule,
          this.userId
        )
        .subscribe((data) => {
          this.servicesList = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Service;
          });
          // assign to table data
          this.dataSourceService = new MatTableDataSource([]);
          this.dataSourceService.data = this.servicesList;

          this.serviceInProgress = this.servicesList.filter(
            (record) => record.inPipeline == true
          ).length;
          this.serviceWon = this.servicesList.filter(
            (record) => record.won == true
          ).length;
          this.serviceLost = this.servicesList.filter(
            (record) => record.lost == true
          ).length;
        });

      // get open tasks to get the count to dispaly in badge
      this.taskSubscription = this.db
        .getTasks(
          this.superUserId,
          this.userId,
          this.custId,
          this.usrProfileData.taskDataAccessRule,
          this.accountType,
          this.lastStatusOption
        )
        .subscribe((data) => {
          this.tasks = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Task;
          });
        });
    });
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

  // function to tag a user for this contact
  tagUser($event: any, userid, tagged, userName) {
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
    this.db
      .updateTaggedUser(this.superUserId, this.custId, taggedArray)
      .then((_resp) => {
        if (tagged === true) {
          this._snackBar.open(`Successfully tagged ${userName}`, '', {
            duration: 2000,
          });
        } else {
          this._snackBar.open(`Untagged user ${userName}`, '', {
            duration: 2000,
          });
        }
      })
      .catch((_err) => {
        this._snackBar.open(`Error occured`, '', {
          duration: 2000,
        });
      });
  }

  // sales table data sort w.r.t createdDate
  getsortData(data) {
    return data.sort((a, b) => {
      return b.createdDate - a.createdDate;
    });
  }

  //Navigation selector
  setNavOption(option) {
    this.navSelected = option;
    if (this.navSelected == 'Sales docs') {
      //Get sales docs
      this.QuoteSubscription = this.db
        .getQuotations(
          this.superUserId,
          this.custId,
          this.dataAccessRule,
          this.userId
        )
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
      this.EstSubscription = this.db
        .getEstimate(
          this.superUserId,
          this.custId,
          this.dataAccessRule,
          this.userId
        )
        .subscribe((data) => {
          this.estimate = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
          this.estimate.sort(
            (a, b) => b.docData.docDate.seconds - a.docData.docDate.seconds
          );
        });
      this.InvSubscription = this.db
        .getInvoices(
          this.superUserId,
          this.custId,
          this.dataAccessRule,
          this.userId
        )
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
    }
    if (this.navSelected == 'Emails') {
      this.parentSubject.next('Email');
      this.ref.detectChanges();
    }
    if (this.navSelected == 'Attachments') {
      // attachments fetching
      this.attachmentSubscription = this.db
        .getAttachments(this.superUserId, this.custId)
        .subscribe((data) => {
          this.attachments = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Attachments;
          });
          this.dataSourceAttachments = this.attachments;
        });
    }
    if (this.navSelected == 'Payments') {
      // get the list of payments
      this.collectionSubscription = this.db
        .getPaymentReceipt(this.superUserId, this.custId)
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
          this.dataSourceCollection = this.paymentReceipts;
        });
    }
  }

  deleteTask(taskid, status, title) {
    const dialogRef = this.dialog.open(ConfirmEditAssignedTo, {
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
          delByemail: this.userData.email,
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
          for (const att of this.attachments) {
            if (!!att) {
              newSize = newSize - att.size;
              //update total size
              this.db.updateSize(this.superUserId, newSize);
              //delete from storage
              const storageRef = firebase.default.storage().ref();
              var desertRef = storageRef.child(att.path);
              await desertRef.delete();
            }
          }
        }

        this.db.onDeleteTasks(this.superUserId, taskid).then((_data) => {
          this.db.addToDeleteLog(this.superUserId, deleteLogTask);
          this._snackBar.open(`${this.fieldNameTask} deleted`, '', {
            duration: 2000,
          });
        });
      }
    });
  }
  //get Attachemnts for task as a promise
  getAttachments(superId, id) {
    return new Promise<void>((resolve) => {
      this.db
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
  // download document
  downloadDoc(url) {
    window.open(url, '_blank');
  }

  // delete attachment for web
  deleteAttachment(id, path, url, filename, size) {
    this.dialog.open(ConfirmationpopupComponent, {
      data: {
        taskId: id,
        smode: 'attachmentDeleteCust',
        path: path,
        url: url,
        orginalPath: filename,
        custId: this.custId,
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
  //download attachment
  downloadAttachment(url) {
    window.open(url, '_blank');
  }
  // delete attachmnent for mobilr
  deleteAttachmentMob(id, path, url, filename) {
    this.dialog.open(ConfirmationpopupComponent, {
      width: '250px',
      data: {
        taskId: id,
        smode: 'attachmentDeleteCust',
        path: path,
        url: url,
        orginalPath: filename,
        custId: this.custId,
        userId: this.superUserId,
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

  // in mobile go to taskboard for customer
  tasksRoute() {
    this.router.navigate(['/dash/tasks', this.custId]);
  }

  isActive(snapshot) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }
  inputAttachment() {
    let element: HTMLElement = document.getElementsByName(
      'attachmentContact'
    )[0] as HTMLElement;
    this.file.nativeElement.value = '';
    element.click();
  }
  inputAttachmentDoc(i, currentDocument) {
    let element: HTMLElement = document.getElementsByClassName(
      `customContactDocUpload_${i}`
    )[0] as HTMLElement;
    this.currentDocument = currentDocument;
    // this.file.nativeElement.value = '';
    element.click();
  }
  offlineMessage() {
    this._snackBar.open('You are Offline', '', {
      duration: 2000,
    });
  }
  chooseMail($event: any) {
    this.mailChoosen = $event;
  }

  onClearNote(form: NgForm) {
    form.reset(); //reset the form after writing the data
  }
  // notes added
  onSubmitNote(form: NgForm, GAevent) {
    this.analytics.logEvent(GAevent);
    let createdDate = new Date().getTime();
    this.db.writeNote(
      form.value,
      this.superUserId,
      createdDate,
      this.custId,
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
  clearNote(form: NgForm) {
    form.reset(); //reset the form after writing the data
  }
  // update notes
  onUpdateNote(notes) {
    if (this.prevNote != notes.notes) {
      const note = notes.notes;
      const noteId = notes.id;
      this.db.updateNote(
        note,
        this.superUserId,
        this.custId,
        noteId,
        ChangeLogComponent.saveLog(
          this.constructor.name,
          this.userId,
          this.userName,
          { Notes: this.prevNote },
          { Notes: note },
          this.changeLog
        ),
        this.custData.lastNoteId ? this.custData.lastNoteId : ''
      );
    }
    notes.isEditable = false;
  }

  // reject lead dialog popup call
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      userId: this.superUserId,
      custId: this.custId,
    };
    this.dialog.open(RejectleaddialogComponent, dialogConfig);
  }
  //SelectsaledialogComponent
  createDoc(docType: string) {
    if (docType == 'Estimate') {
      this.router.navigate([
        '/dash/document/documentmanagement/',
        'none',
        'create',
        docType,
        this.custId ? this.custId : 'none',
        'none',
        'none',
      ]);
    } else if (docType == 'Quotation') {
      this.router.navigate([
        '/dash/document/documentquotationmanagement/',
        'none',
        'create',
        docType,
        this.custId ? this.custId : 'none',
        'none',
        'none',
      ]);
    } else {
      this.router.navigate([
        '/dash/document/documentinvoicemanagement/',
        'none',
        'create',
        docType,
        this.custId ? this.custId : 'none',
        'none',
        'none',
      ]);
    }
  }

  // update customer status
  updateCustomerstage(status: string, statusName) {
    if (status != this.custData.status) {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      let changeLogParams = {
        constructorName: this.constructor.name,
        userId: this.userId,
        userName: this.userName,
        prevStatus: this.getStatusName(this.custData.status),
        curStatus: statusName,
        changeLog: this.changeLog,
      };

      dialogConfig.data = {
        userId: this.superUserId,
        custId: this.custId,
        status: status, // new status applied
        fieldNameContact: this.fieldNameContact,
        custStatus: this.customerStatus, //Customer status array defined in the super user profile
        custDataStatus: this.custData?.status, //Current customer status prior to update
        custDataStageHistory: this.custData?.stageHistory,
        changeLogParams: changeLogParams,
        rejectionReasonArr:
          this.contactSettings?.rejectionReason?.rejectionReason?.split(','), //reason for rejection options array
        rejectionReasonMandatory:
          this.contactSettings.rejectionReasonVal.mandatory, //reason for rejection options mandatory check
        rejectionReasonDisplay: this.contactSettings.rejectionReasonVal.display, //whether to display/not reason for rejection
        disableReAssign: this.disableEditContact, //status edit disable on disable edit
        statusName: statusName, //stage id is passing as status variable, local variable for name
        pipelineId: this.pipelineId,
        from: 'details',
        statusFieldName: this.contactSettings.status.displayName,
      };

      this.dialog.open(
        ChangecuststatdialogComponent,
        dialogConfig
      );
    }
  }
  // update customer priority
  updateCustomerPriority(priority: string) {
    //this.customerPriority = priority;
    if (priority != this.custData.priority) {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      let changeLogParams = {
        constructorName: this.constructor.name,
        userId: this.userId,
        userName: this.userName,
        prevPriority: this.custData.priority,
        curPriority: priority,
        changeLog: this.changeLog,
      };

      dialogConfig.data = {
        userId: this.superUserId,
        custId: this.custId,
        priority: priority,
        fieldNameContact: this.fieldNameContact,
        changeLogParams: changeLogParams,
      };
      this.dialog.open(
        ChangecustprioritydialogComponent,
        dialogConfig
      );
    }
  }

  // add new sale from customer
  onAddSale() {
    if (this.commonService.addDocLimitaion.addSaleDisable) {
      this._snackBar.open('Sale limit expired for this month!', '', {
        duration: 2000,
      });
    } else {
      if (this.isMobilesize == false) {
        this.dialog.open(Addnewsale1Component, {
          width: '800px',
          height: 'auto',
          disableClose: true,
          data: { scenario: 'createfromCustomer', id: this.custId },
        });
      }
      if (this.isMobilesize == true) {
        this.router.navigate(['/dash/addsale', 'create', this.custId]);
      }
    }
  }

  onAddService() {
    if (this.isMobilesize == false) {
      this.dialog.open(CrudServiceComponent, {
        width: '580px',
        height: 'auto',
        minHeight: '100px',
        disableClose: true,
        data: { scenario: 'createfromCustomer', id: this.custId },
      });
    }
  }
  // add collection
  addPayment() {
    this.dialog.open(Paymentreceipt1Component, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        // id:this.saleId,
        orgId: this.custData.orgId ? this.custData.orgId : null,
        customerId: this.custId,
        mode: 'createCust',
        company: this.custData.companyName,
        customerName: this.custData.firstName,
        customerSecondName: this.custData.secondName,
        changeLog: this.changeLog,
        componentName: this.constructor.name,
        moduleName: 'customers',
        docId: this.custId,
      },
    });
  }
  // edit collection
  editPayment(element, id, sid) {
    this.commonService.updatePaymentToEdit(element);
    this.dialog.open(Paymentreceipt1Component, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        saleId: sid,
        customerId: this.custId,
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
        moduleName: 'customers',
        docId: this.custId,
      },
    });
  }
  // add task
  addTask() {
    CrudModal1Component;
    this.dialog.open(CrudModal1Component, {
      width: '520px',
      height: 'auto',
      disableClose: true,
      data: {
        cid: this.custId,
        orgId: this.custData.orgId ? this.custData.orgId : null,
        mode: 'custCreate',
        company: this.custData.companyName,
        firstName: this.custData.firstName,
        secondName: this.custData.secondName,
        surname: this.custData.surname,
      },
    });
  }
  // edit task
  taskUpdate(task) {
    this.commonService.updateTaskToEdit(task);
    this.dialog.open(CrudModal1Component, {
      width: '1060px',
      height: 'auto',
      disableClose: true,
      data: {
        id: task.id,
        cid: this.custId,
        mode: 'update',
        company: this.custData.companyName,
        firstName: this.custData.firstName,
        secondName: this.custData.secondName,
        surname: this.custData.surname,
      },
    });
  }
  // completed taskl updation
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
  // create followupos in web
  onCreateFollowUps() {
    if (this.custData.secondName && this.custData.surname) {
      // if second name & surname is there
      this.customerName =
        this.custData.firstName +
        ' ' +
        this.custData.secondName +
        ' ' +
        this.custData.surname;
    } else if (this.custData.secondName && !this.custData.surname) {
      this.customerName =
        this.custData.firstName + ' ' + this.custData.secondName;
    } else if (!this.custData.secondName && this.custData.surname) {
      this.customerName = this.custData.firstName + ' ' + this.custData.surname;
    } else {
      this.customerName = this.custData.firstName;
    }

    this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: this.custId,
        companyNames: this.custData.companyName,
        customerNames: this.customerName,
        contactNumber: this.contactNumber ? this.contactNumber : '', // pass customer number
        countryCode: this.selectedCode ? this.selectedCode : '', // pass customer country code
        assignedTo: this.assignedTo,
        assignedToName: this.assignedToName,
        scenario: 'create',
        subUsers: this.subUsers,
        fname: this.userFirstName,
        lastname: this.userSecondName,
        orgId: this.custData.orgId ? this.custData.orgId : null,
      },
    });
  }

  // edit followup in mobile

  // if followup completed update in followup collection and in customer details
  markasCompleted(taskId: string, changeLog) {
    let completed = true;
    let newChangeLog = ChangeLogComponent.saveLog(
      this.constructor.name,
      this.userId,
      this.userName,
      { completedStatus: false },
      { completedStatus: true },
      changeLog
    );
    this.db.UpdateTask(taskId, completed, this.superUserId, newChangeLog);

    this._snackBar.open(this.fieldNameFollowup + ' task closed', '', {
      duration: 2000,
    });
  }
  // in web to edit custyomer call edit contact popup
  onEditCustomer() {
    this.commonService.updateCustomerToEdit(this.custData);
    this.dialog.open(Addcontactpopup1Component, {
      panelClass: 'custom-dialog-container',
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: {
        id: this.custId,
        scenario: 'edit',
      },
    });
  }
  // edit followup
  onEditFollowUps(taskId: string, followUpData: FollowUps) {
    this.commonService.followUpDetails = followUpData;
    if (this.custData.secondName && this.custData.surname) {
      // if second name & surname is there
      this.customerName =
        this.custData.firstName +
        ' ' +
        this.custData.secondName +
        ' ' +
        this.custData.surname;
    } else if (this.custData.secondName && !this.custData.surname) {
      this.customerName =
        this.custData.firstName + ' ' + this.custData.secondName;
    } else if (!this.custData.secondName && this.custData.surname) {
      this.customerName = this.custData.firstName + ' ' + this.custData.surname;
    } else {
      this.customerName = this.custData.firstName;
    }
    this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: this.custId,
        companyNames: this.custData.companyName,
        customerNames: this.customerName,
        contactNumber: followUpData.contactNumber
          ? followUpData.contactNumber
          : '', // pass customer number
        countryCode: followUpData.countryCode ? followUpData.countryCode : '', // pass customer country code
        scenario: 'edit',
        followUpId: taskId,
        subUsers: this.subUsers,
        fname: this.userFirstName,
        lastname: this.userSecondName,
      },
    });
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }
  resetBar() {
    this.uploadProgress$ = this.uploadReset;
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
    let name = this.userData?.firstname + ' ' + this.userData?.lastname;
    for (let i = 0; i < files.length; i++) {
      if (files.length > 0) {
        str = files[0].name;
        file = files[0];
        size = files[0].size / 1024 / 1024;
      }
      sumSize = size + sumSize;
      newSize = this.attachmentSize + sumSize;
      if (newSize > 1024 && this.plan == 'paid') {
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: 'attachment1GB',
          },
        });
      } else if (newSize > 512 && this.plan == 'free') {
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: 'attachment512MB',
          },
        });
      } else {
        const filePath = `attachment/${
          this.userId
        }/customer/${Date.now()}_${str}`;
        this.task = this.storage.upload(filePath, file);
        const ref = this.storage.ref(filePath);
        this.uploadProgress$ = this.task.percentageChanges();
        this.task
          .snapshotChanges()
          .pipe(
            finalize(async () => {
              downloadURL = await ref.getDownloadURL().toPromise();

              this.db.attachmentsToCollection(
                this.superUserId,
                this.custId,
                str,
                downloadURL,
                filePath,
                date,
                name,
                size
              );
              this.fileBeingUploaded = false;
              this.ref.detectChanges();
              this._snackBar.open('Attachment added successfully', '', {
                duration: 2000,
              });
            })
          )
          .pipe(takeUntil(this.onDestroy$))
          .subscribe();
      }
      newSize = this.attachmentSize + sumSize;
      // update size before uploading to storage and collection,
      // so that it will reflect to sum up if others are trying to upload
      this.db.updateSize(this.superUserId, newSize);
      this.db.updateChangeLog(
        this.superUserId,
        'customers',
        this.custId,
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
  // go to corresponding document details route
  navToDoc(saleId, docType, custId, docId) {
    this.router.navigate([
      '/dash/documentmanagement',
      saleId,
      'view',
      docType,
      custId,
      docId,
    ]);
  }
  //web tab change event
  tabClickWeb(tab) {
    this.activetab = tab.tab.textLabel;
    if (this.activetab == 'TASKS') {
      // get all tasks from DB
      this.allTasksSubscription = this.db
        .getAllTasks(
          this.superUserId,
          this.userId,
          this.custId,
          this.usrProfileData.taskDataAccessRule,
          this.accountType
        )
        .subscribe((data) => {
          this.allTasks = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Task;
          });
          this.dataSourceTask = new MatTableDataSource([]);
          this.dataSourceTask.data = this.allTasks;
        });
    }
  }

  //web toolbar back button
  onBack() {
    this.location.back();
  }
  // mobile toolbar-on back-route to customer list page
  onBackMob() {
    this.router.navigate(['dash/contact/customerlist-mobileview']);
  }
  // edit customer in ,mobile
  onEditCustomerMob() {
    this.commonService.updateCustomerToEdit(this.custData);
    this.router.navigate(['/addcontacts', 'edit', this.custId]);
  }
  // add customer from mobile
  onAddCustomerMob() {
    this.router.navigate(['/addcontacts', 'create']);
  }
  // add sale from customer in mobile
  addSalecust() {
    this.router.navigate(['/addsale', 'createfromCustomer', this.custId]);
  }
  // network check to disable add buttons
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  // customer attachment delete
  deletedAttachmentCust(uid: string, path: string, size: any) {
    let newSize = this.attachmentSize - size;

    const storageRef = firebase.default.storage().ref();
    // [START storage_delete_file]
    // Create a reference to the file to delete
    var desertRef = storageRef.child(path);

    this.db.updateSize(uid, newSize).then((_resp2) => {
      // Delete the file
      desertRef.delete();
      // [END storage_delete_file]
    });
  }
  // delete customer option
  async onDelete() {
    //fetch estimates,quotations, invoices, expenses and collections before deleting contact
    let estimates = await this.getEstimates();
    let quotations = await this.getQuotations();
    let invoices = await this.getInvoices();
    let expenses = await this.getExpenses();
    let paymentReceipts = await this.getCollections();
    // cont with sale/service/sales docs/expense/collection cannot be deletd
    if (
      this.salesList.length > 0 ||
      this.servicesList.length > 0 ||
      estimates.length > 0 ||
      quotations.length > 0 ||
      invoices.length > 0 ||
      expenses.length > 0 ||
      paymentReceipts.length > 0
    ) {
      this.dialog.open(ConfirmationpopupComponent, {
        width: '400px',
        data: {
          smode: 'cannotDelete',
          fieldNameContact: this.fieldNameContact,
          fieldNameSale: this.fieldNameSale,
          fieldNameService: this.fieldNameService,
          fieldNameExpense: this.fieldNameExpense,
          fieldNameCollection: this.fieldNameCollection,
        },
      }); //dispaly messsage
    } else {
      this.dialog.open(ConfirmEditAssignedTo, {
        panelClass: 'custom-dialog-container',
        width: '400px',
        minHeight: '100px',
        height: 'auto',
        disableClose: true,
        data: {
          superUserId: this.superUserId,
          custId: this.custId,
          scenario: 'deleteCust',
          fieldNameContact: this.fieldNameContact,
          allTasks: this.allTasks,
          allFollowUp: this.allFollowUp,
          attachments: this.attachments,
          userId: this.userId,
          userEmail: this.userData.email,
          attSize: this.superUserData.totalAttachmentsSize,
        },
      });
      this.customerSubscribtion.unsubscribe();
    }
  }

  //get quotations associated to a customer through promise
  getQuotations() {
    return new Promise<Invoice[]>((resolve) => {
      //get quotations associated with the customer
      this.QuoteSubscription = this.db
        .getQuotations(
          this.superUserId,
          this.custId,
          this.dataAccessRule,
          this.userId
        )
        .subscribe((data) => {
          let quotations = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
          resolve(quotations);
        });
    });
  }
  //get estimates associated to a customer through promise
  getEstimates() {
    return new Promise<Invoice[]>((resolve) => {
      //get estimations associated with the customer
      this.EstSubscription = this.db
        .getEstimate(
          this.superUserId,
          this.custId,
          this.dataAccessRule,
          this.userId
        )
        .subscribe((data) => {
          let estimates = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
          resolve(estimates);
        });
    });
  }
  //get invoices associated to a customer through promise
  getInvoices() {
    return new Promise<Invoice[]>((resolve) => {
      //get invoices associated with the customer
      this.InvSubscription = this.db
        .getInvoices(
          this.superUserId,
          this.custId,
          this.dataAccessRule,
          this.userId
        )
        .subscribe((data) => {
          let invoices = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
          resolve(invoices);
        });
    });
  }
  //get expenses associated to a customer through promise
  getExpenses() {
    return new Promise<Expenses[]>((resolve) => {
      //get expenses associated with the customer
      this.ExpenseSubscription = this.db
        .getExpenses(
          this.superUserId,
          this.custId,
          this.dataAccessRule,
          this.userId
        )
        .subscribe((data) => {
          let expenses = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Expenses;
          });
          resolve(expenses);
        });
    });
  }
  //get collections associated to a customer through promise
  getCollections() {
    return new Promise<PaymentReceipt[]>((resolve) => {
      //get collections associated with the customer
      // get the list of payments
      this.collectionSubscription = this.db
        .getPaymentReceipt(this.superUserId, this.custId)
        .subscribe((data) => {
          let paymentReceipts = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as PaymentReceipt;
          });
          resolve(paymentReceipts);
        });
    });
  }

  // make a customer note editable if click to edit
  onEditNote(note) {
    note.isEditable = true;
    this.prevNote = note.notes;
  }

  settotalUnread() {
    this.totalunread = this.dataSourceEmail.filter((m) => {
      return m.msgtoread == true;
    }).length;
  }
  gotocomposemob(url) {
    this.db.passdata = {
      superuserid: this.superUserId,
      customerid: this.custId,
      link: url,
      tomail: this.custData.email,
    };
    this.composeopen = true;
    // this.router.navigate(['/gmail/composemobile'])
  }
  replyClick() {
    this.composeopen = true;
  }
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
  //selecting file custom document
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
  //deleting custom document
  deleteCustomDoc(id, path, url, filename, size) {
    this.dialog.open(ConfirmationpopupComponent, {
      data: {
        taskId: id,
        smode: 'customContactDocDelete',
        path: path,
        url: url,
        orginalPath: filename,
        custId: this.custId,
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
  //verifing csutomdocument
  verificationCheck(event, documentId, fileName) {
    //marking document as verified & updating changeLog
    if (event === true) {
      const verifiedDate = new Date().getTime();
      const verifiedByName = this.userName;
      const verifiedById = this.userId;
      this.db.changeDocVerification(
        this.superUserId,
        this.custId,
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
      ); //marking document as unverified
    } else if (event === false) {
      const verifiedDate = null;
      const verifiedByName = this.userName;
      const verifiedById = this.userId;
      this.db.changeDocVerification(
        this.superUserId,
        this.custId,
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
  // upload customdocument
  uploadDocument(event, customDocIdentifier, currentDocument) {
    let str;
    let size;
    let file;
    let newSize;
    let uploadedBy = this.userData?.firstname + ' ' + this.userData?.lastname;
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
        this.db.updateSize(this.superUserId, newSize);
        const filePath = `attachment/${
          this.userId
        }/customer/${Date.now()}_${str}`;
        //uploaded Date
        this.fullLayoutComp.uploadCustomDocument(
          filePath,
          file,
          this.custId,
          str,
          docUploadDate,
          uploadedBy,
          size,
          newSize,
          customDocIdentifier,
          'customers',
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
  // upload attaxhment
  uploadAttachment(event, type) {
    let date = new Date().getTime();
    let str;
    let size;
    let file;
    let newSize;
    let name = this.userData?.firstname + ' ' + this.userData?.lastname;
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
        let filePath;
        // update size before uploading to storage and collection, so that it will reflect to sum up if others are trying to upload
        this.db.updateSize(this.superUserId, newSize);
        filePath = `attachment/${
          this.userId
        }/customer/${Date.now()}_${str}`;
        if (type === 'customDocuments') {
          filePath = `attachment/${this.userId}/customer/${
            this.custId
          }/documents/${Date.now()}_${str}`;
        }
        this.fullLayoutComp.uploadAttachment(
          filePath,
          file,
          this.custId,
          str,
          date,
          name,
          size,
          newSize,
          type === 'customDocuments' ? 'custDoc' : 'cust',
          '',
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
  }

  // update assigned to field of customer
  updateAssignedTo(assignedTo) {
    if (assignedTo.userId != this.assignedTo) {
      const dialogRef = this.dialog.open(ConfirmEditAssignedTo, {
        width: '500px',
        data: {
          scenario: 'assigned',
          assignedTo,
          userId: this.superUserId,
          custId: this.custId,
          fieldNameContact: this.fieldNameContact,
        },
      });

      dialogRef.afterClosed().subscribe((_result) => {

      });
    }
  }
  trackbyFwp(_index: number, task: FollowUps): string {
    return task.id;
  }

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

      const dialogRef = this.dialog.open(ConfirmEditAssignedTo, {
        width: '500px',
        data: {
          scenario: 'assigned',
          userId: this.superUserId,
          custId: this.custId,
          fieldNameContact: this.fieldNameContact,
          fieldNameSale: this.fieldNameSale,
          fieldNameService: this.fieldNameService
            ? this.fieldNameService
            : 'Support',
          fieldNameTask: this.fieldNameTask,
          fieldNameFollowup: this.fieldNameFollowup,
          checked: false,
          fieldNameEstimate: this.fieldNameEstimate,
          fieldNameQuotation: this.fieldNameQuotation,
          fieldNameInvoice: this.fieldNameInvoice,
          prevAssigned: this.assignedToName,
          currAssigned: assToName,
        },
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        console.log(result)
        if (result) {
          this.assignedTo = $event;

          if (this.assignedTo && this.assignedTo != this.prevAssignedTo) {
            this.assignedToName = assToName;
            this.associatedBranch = assBranch;

            let prevVal = {
              assignedTo: this.prevAssignedTo,
              assignedToName:  this.commonService.getAssignedToName(
                this.prevAssignedTo
              ),
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
              assignedTo: this.assignedTo,
              assignedToName: this.assignedToName,
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
            if (result.checked === false) {
              this.db.updateAssignedTo(
                this.superUserId,
                this.custId,
                this.assignedTo,
                this.assignedToName,
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
              this._snackBar.open('Successfully updated', '', {
                duration: 2000,
              });
            } else {
              this.db.updateAssignedTo(
                this.superUserId,
                this.custId,
                this.assignedTo,
                this.assignedToName,
                this.associatedBranch,
                ChangeLogComponent.saveLog(
                  this.constructor.name,
                  this.userId,
                  this.userName,
                  prevVal,
                  curVal,
                  this.changeLog
                )
              ); //update in customer collection

              const tasksFiltered = this.tasks.filter((ele) => {
                return ele.assignedTo === this.prevAssignedTo;
              });

              tasksFiltered.forEach((ele) => {
                this.db.onUpdateTask(
                  this.superUserId,
                  ele.id,
                  this.assignedTo,
                  this.assignedToName,
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

              const salesFiltered = this.salesList.filter((ele) => {
                return ele.assignedTo === this.prevAssignedTo;
              });

              salesFiltered.forEach(async (ele) => {
                await this.getEstimatesReassign(
                  ele.id,
                  ele.assignedTo,
                  'docData.saleID',
                  'docData.saleAssignedToOwner',
                  'fromsale'
                );
                await this.getQuotationsReassign(
                  ele.id,
                  ele.assignedTo,
                  'docData.saleID',
                  'docData.saleAssignedToOwner',
                  'fromsale'
                );
                await this.getInvoicesReassign(
                  ele.id,
                  ele.assignedTo,
                  'docData.saleID',
                  'docData.saleAssignedToOwner',
                  'fromsale'
                );
                this.db.onUpdateSale(
                  this.superUserId,
                  ele.id,
                  this.assignedTo,
                  this.assignedToName,
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
              }); //update in sale collection

              const servicesFiltered = this.servicesList.filter((ele) => {
                return ele.assignedTo === this.prevAssignedTo;
              });

              servicesFiltered.forEach((ele) => {
                this.db.onUpdateService(
                  this.superUserId,
                  ele.id,
                  this.assignedTo,
                  this.assignedToName,
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
              }); //update in service collection

              const follsFiltered = this.followUps.filter((ele) => {
                return ele.assignedTo === this.prevAssignedTo;
              });

              follsFiltered.forEach((ele) => {
                this.db.onUpdateFollowUp(
                  this.superUserId,
                  ele.id,
                  this.assignedTo,
                  this.assignedToName,
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
              }); //update in followups collection
              let assigned = this.prevAssignedTo;
              await this.getEstimatesReassign(
                this.custId,
                assigned,
                'customerData.custID',
                'customerData.contactAssignedToOwner',
                'fromcust'
              );
              await this.getQuotationsReassign(
                this.custId,
                assigned,
                'customerData.custID',
                'customerData.contactAssignedToOwner',
                'fromcust'
              );
              await this.getInvoicesReassign(
                this.custId,
                assigned,
                'customerData.custID',
                'customerData.contactAssignedToOwner',
                'fromcust'
              );
            }
          }
        } else {
          this.assignedTo = null;
          this.assignedToName = null;
        }
      });
    }
  }

  async getEstimatesReassign(
    id: string,
    assignedTo,
    queryField1,
    queryField2,
    scenario
  ) {
    let estimates = await this.db.getDocsWithCustomer(
      this.superUserId,
      id,
      assignedTo,
      'Estimates',
      queryField1,
      queryField2
    );
    estimates.forEach((ele) => {
      this.db.onUpdateDocs(
        this.superUserId,
        ele.id,
        'Estimates',
        this.assignedTo,
        scenario
      );
    }); //update in estimates collection
  }
  async getQuotationsReassign(
    id: string,
    assignedTo,
    queryField1,
    queryField2,
    scenario
  ) {
    let quotations = await this.db.getDocsWithCustomer(
      this.superUserId,
      id,
      assignedTo,
      'Quotations',
      queryField1,
      queryField2
    );
    quotations.forEach((ele) => {
      this.db.onUpdateDocs(
        this.superUserId,
        ele.id,
        'Quotations',
        this.assignedTo,
        scenario
      );
    }); //update in quotations collection
  }
  async getInvoicesReassign(
    id: string,
    assignedTo,
    queryField1,
    queryField2,
    scenario
  ) {
    let invoices = await this.db.getDocsWithCustomer(
      this.superUserId,
      id,
      assignedTo,
      'Invoices',
      queryField1,
      queryField2
    );
    invoices.forEach((ele) => {
      this.db.onUpdateDocs(
        this.superUserId,
        ele.id,
        'Invoices',
        this.assignedTo,
        scenario
      );
    }); //update in invoices collection
  }
  assignedToNameEventHander(_$event: any) {
    // this.assignedToName = $event;
  }

  branchIdEventHandler($event: any) {
    this.associatedBranch = $event;

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
      this.prevAssBranch != this.associatedBranch
    ) {
      this.db.updateBranch(
        this.superUserId,
        this.custId,
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
    }
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
  // ondestroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.initClientSubscription.unsubscribe();
    this.customerSubscribtion?.unsubscribe();
    this.QuoteSubscription?.unsubscribe();
    this.EstSubscription?.unsubscribe();
    this.InvSubscription?.unsubscribe();
    this.collectionSubscription?.unsubscribe();
    this.notesSubscription?.unsubscribe();
    this.attachmentSubscription?.unsubscribe();
    this.allTasksSubscription?.unsubscribe();
    this.taskSubscription?.unsubscribe();
    this.saleSubscription?.unsubscribe();
    this.lastNoteSubscription?.unsubscribe();
    this.ExpenseSubscription?.unsubscribe();
    //this.SalesInProgresssubscription?.unsubscribe();
    this.commonServSub?.unsubscribe();
    this.allFolowupSubscription?.unsubscribe();
    this.documentSubscription?.unsubscribe();
    this.serviceSubscription?.unsubscribe();
  }
  // onWhatsAppContact() {
  //   window.open(`https://wa.me/` + this.selectedCode + this.contactNumber);
  // }
  // to send whatsapp message
  async onWhatsAppContact() {
    await this.getAllContWaTemp(); //first fetch whatsapp contact templates
  }
  // Db fetch all templates related to whatsapp and contact
  getAllContWaTemp() {
    return new Promise<void>((resolve) => {
      this.db
        .getAllContWaTemp(this.superUserId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.contactWaTemp = data.map((e) => {
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
  selectTemplate(selectedTempl, type) {
    //2 arguments to get template selected and to check the phone number/alt ph no
    let ass = null;

    if (this.subUsers?.length > 0) {
      ass = this.subUsers?.find(
        (subuser) => subuser.userId === this.assignedTo
      );
    }

    var contact = this.custData;
    const code = this.custData.code?.replace('+', '');
    const altCode = this.custData.altContactCode?.replace('+', '');
    var assignedTo = {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
    };

    // to replace assigned to user values, check if its a subuser/superuser,
    // so that replace from subuser array/to replace data with superuser details
    if (ass === null || typeof ass === 'undefined') {
      assignedTo.firstname = this.superUserData.firstname;
      assignedTo.lastname = this.superUserData.lastname
        ? this.superUserData.lastname
        : '';
      assignedTo.email = this.superUserData.email
        ? this.superUserData.email
        : 'Email not provided';
      assignedTo.phone = this.superUserData.phone
        ? `${this.superUserData.countryCode}${this.superUserData.phone}`
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
      if (type === 'primary') {
        window.open(
          `https://web.whatsapp.com/send?phone=${code}${this.custData.contactNo}`,
          '',
          'width=800,height=600'
        );
      } else if (type === 'secondary') {
        window.open(
          `https://web.whatsapp.com/send?phone=${altCode}${this.custData.alternateContactNumber}`,
          '',
          'width=800,height=600'
        );
      }
    } else {
      // replacing body merged fields
      var str: any = selectedTempl.body
        .replace(/\#\[contact.Company Name\]/g, contact.companyName)
        .replace(/\#\[contact.First Name\]/g, contact.firstName)
        .replace(
          /\#\[contact.Second Name\]/g,
          contact.secondName ? contact.secondName : ''
        )
        .replace(
          /\#\[contact.Contact No\]/g,
          contact.contactNo ? contact.contactNo : 'Contact number not provided'
        )
        .replace(
          /\#\[contact.Email\]/g,
          contact.email ? contact.email : 'Email not provided'
        )
        .replace(/\#\[contact.Priority\]/g, contact.priority)
        .replace(
          /\#\[contact.Status\]/g,
          this.commonService.getStatusName(
            'customers',
            contact.selectedContactPipeline,
            contact.status
          )
        )
        .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
        .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
        .replace(/\#\[user.Last Name\]/g, assignedTo.lastname)
        .replace(/\#\[user.Contact No\]/g, assignedTo.phone)
        .replace(/\#\[user.Email\]/g, assignedTo.email);

      // contact addi field replacing section
      if (this.superUserData.customFieldsContact) {
        let teststring = str;
        for (
          let i = 0;
          i < this.superUserData.customFieldsContact.length;
          i++
        ) {
          if (this.superUserData.customFieldsContact[i].isActive === true) {
            var str1 =
              '\\#\\[contact.' +
              this.superUserData.customFieldsContact[i].fieldName +
              '\\]';
            var re = new RegExp(str1, 'g');
            teststring = teststring.replace(
              re,
              contact.additionalFieldsArr
                ? contact.additionalFieldsArr[i + '']?.fieldValue
                  ? this.superUserData.customFieldsContact[i].fieldType ==
                    'date'
                    ? typeof contact.additionalFieldsArr[i + ''].fieldValue ==
                      'object'
                      ? this.convertDate(
                          contact.additionalFieldsArr[i + ''].fieldValue
                        )
                      : 'Date not provided'
                    : this.superUserData.customFieldsContact[i].fieldType ==
                      'date_time'
                    ? this.convertDateTime(
                        contact.additionalFieldsArr[i + ''].fieldValue
                      )
                    : contact.additionalFieldsArr[i + '']?.fieldValue
                  : 'Value not provided'
                : 'Value not provided'
            );
          }
        }
        str = teststring;
      }

      const convStr = this.convertToPlain(str); //html string is converted to plain text
      const convStr1 = encodeURIComponent(convStr); //URIEncoded data is sending over url to whatsapp

      // comments keeping for future reference
      // https://wa.me/0?text=I%27m%20inquiring%20about%20the%20apartment%20listing
      // https://wa.me/whatsappphonenumber/?text=urlencodedtext
      // https://api.whatsapp.com/send?text=urlencodedtext

      if (convStr1 && type === 'primary') {
        //message sending to primary contact number
        window.open(
          `https://web.whatsapp.com/send?phone=${code}${this.custData.contactNo}&text=${convStr1}`,
          '',
          'width=800,height=600'
        );
      } else if (convStr1 && type === 'secondary') {
        // message sending to alt contact number
        // comments keeping for future reference
        // window.open(`https://wa.me/${altCode}${this.custData.alternateContactNumber}?text=${convStr1}`, "", "width=800,height=600");
        // window.open("whatsapp://send?phone="+altCode+this.custData.alternateContactNumber +"&text="+convStr1);
        // window.open(`whatsapp://send?phone=${altCode}${this.custData.alternateContactNumber}&text=Hello`);
        window.open(
          `https://web.whatsapp.com/send?phone=${altCode}${this.custData.alternateContactNumber}&text=${convStr1}`,
          '',
          'width=800,height=600'
        );
      }
    }
  }

  convertToPlain(htmlString) {
    // add line breaks at </div>, </br> and </p>
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
  onWhatsAppAltContact() {
    window.open(
      `https://wa.me/` + this.selectedAltCode + this.alternateContactNumber
    );
  }
  // to call the autocall api and pass all the details with conatct numbet
  onCall() {
    if (
      this.enableOutboundCallsViaCallBridging &&
      this.contactNumber &&
      this.userNumber
    ) {
      let customerName;

      if (this.custData.secondName && this.custData.surname) {
        // if second name & surname is there
        customerName =
          this.custData.firstName +
          ' ' +
          this.custData.secondName +
          ' ' +
          this.custData.surname;
      } else if (this.custData.secondName && !this.custData.surname) {
        customerName = this.custData.firstName + ' ' + this.custData.secondName;
      } else if (!this.custData.secondName && this.custData.surname) {
        customerName = this.custData.firstName + ' ' + this.custData.surname;
      } else {
        customerName = this.custData.firstName;
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
          this.custData.companyName,
          this.custId,
          customerName,
          startTime,
          null,
          this.autoCallToken,
          this.DIDNumber,
          this.custData.orgId ? this.custData.orgId : '',
          this.custData.associatedBranch
            ? this.custData.associatedBranch
            : 'none',
          this.callBridgingExtension,
          this.outboundCallBridgingType,
          null,
          null,
          null,
          null
        )
        .subscribe((_data: any) => {});
      this._snackBar.open('Initiating Call', '', {
        duration: 2000,
      });
    }
  }
  // to call the autocall api and pass all the details
  onCallFollowUp(id, data) {
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
          this.custId,
          data.customerName,
          startTime,
          id,
          this.autoCallToken,
          this.DIDNumber,
          data.orgId ? data.orgId : '',
          data.associatedBranch ? data.associatedBranch : 'none',
          this.callBridgingExtension,
          this.outboundCallBridgingType,
          data.saleTitle ? data.saleTitle : null,
          data.saleId ? data.saleId : null,
          data.serviceTitle ? data.serviceTitle : null,
          data.serviceId ? data.serviceId : null
        )
        .subscribe((_data: any) => {});
      this._snackBar.open('Initiating Call', '', {
        duration: 2000,
      });
    }
  }
  // to call the autocall api and pass all the details with alternate number
  onCallAlternate() {
    if (
      this.enableOutboundCallsViaCallBridging &&
      this.alternateContactNumber &&
      this.userNumber
    ) {
      let minute = new Date().getMinutes();
      let hour = new Date().getHours();
      let startTime = hour + ':' + minute;
      let customerName;
      if (this.custData.secondName && this.custData.surname) {
        // if second name & surname is there
        customerName =
          this.custData.firstName +
          ' ' +
          this.custData.secondName +
          ' ' +
          this.custData.surname;
      } else if (this.custData.secondName && !this.custData.surname) {
        customerName = this.custData.firstName + ' ' + this.custData.secondName;
      } else if (!this.custData.secondName && this.custData.surname) {
        customerName = this.custData.firstName + ' ' + this.custData.surname;
      } else {
        customerName = this.custData.firstName;
      }
      this.commonService
        .onAutoCall(
          this.userNumber,
          this.alternateContactNumber,
          this.superUserId,
          this.userId,
          this.userName,
          this.custData.companyName,
          this.custId,
          customerName,
          startTime,
          null,
          this.autoCallToken,
          this.DIDNumber,
          this.custData.orgId ? this.custData.orgId : '',
          this.custData.associatedBranch
            ? this.custData.associatedBranch
            : 'none',
          this.callBridgingExtension,
          this.outboundCallBridgingType,
          null,
          null,
          null,
          null
        )
        .subscribe((_data: any) => {});
      this._snackBar.open('Initiating Call', '', {
        duration: 2000,
      });
    }
  }
  onPlayAudio(resourceURL) {
    this.dialog.open(CallViewAudioPlayerComponent, {
      width: '500px',
      data: resourceURL,
    });
  }
}

//edit assignedto confirmation popup
@Component({
  selector: 'confirm-edit-assignedTo',
  templateUrl: 'confirm-edit-assignedTo.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class ConfirmEditAssignedTo {
  allTasks: Task[] = [];
  allFollowUp: FollowUps[] = [];
  attachments: Attachments[] = [];
  btnClicked = false;
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  attachmentsTask: Attachments[] = [];

  constructor(
    public dialogRef1: MatDialogRef<ConfirmEditAssignedTo>,
    @Inject(MAT_DIALOG_DATA) public data,
    private router: Router,
    private db: CustomerDetailsService,
    private _snackBar: MatSnackBar
  ) {}
  onNoClick(): void {
    this.dialogRef1.close();
  }
  async deleteCust() {
    this.btnClicked = true;
    if (this.data.allTasks.length === 0) {
      // fetch tasks
      await this.getTasksPromise();
    } else {
      this.allTasks = this.data.allTasks;
    }
    // fetch attachments
    if (
      typeof this.data.attachments == 'undefined' ||
      this.data.attachments.length === 0
    ) {
      await this.getAttsPromise();
    } else {
      this.attachments = this.data.attachments;
    }

    // fetch foll
    if (
      typeof this.data.allFollowUp == 'undefined' ||
      this.data.allFollowUp.length === 0
    ) {
      await this.getFollowUpsPromise();
    } else {
      this.allFollowUp = this.data.allFollowUp;
    }

    const taskCount = this.allTasks.length;
    const follCount = this.allFollowUp.length;
    let totAttSize = this.data.attSize;
    // delete foll
    this.allFollowUp.forEach(async (followup) => {
      await this.db
        .onDeleteFollowUps(this.data.superUserId, followup.id)
        .then((_data) => {});
    });
    // delete task
    for (const taks of this.allTasks) {
      //get Attachments in task
      await this.getAttachmentsTask(this.data.superUserId, taks.id);
      // delete attachments in Task
      if (!!this.attachmentsTask) {
        for (const att of this.attachmentsTask) {
          if (!!att) {
            totAttSize = totAttSize - att.size;
            //update total size
            this.db.updateSize(this.data.superUserId, totAttSize);
            //delete from storage
            const storageRef = firebase.default.storage().ref();
            var desertRef = storageRef.child(att.path);
            await desertRef.delete();
          }
        }
      }
      await this.db
        .onDeleteTasks(this.data.superUserId, taks.id)
        .then((_data) => {});
    }
    // delete att
    if (!!this.attachments) {
      this.attachments.forEach(async (att) => {
        if (!!att) {
          totAttSize = totAttSize - att.size;
          this.db.updateSize(this.data.superUserId, totAttSize);
          const storageRef = firebase.default.storage().ref();
          var desertRef = storageRef.child(att.path);
          await desertRef.delete();
        }
      });
    }
    let deleteLogCust: deleteLogModel = {
      delByemail: this.data.userEmail,
      delByuserId: this.data.userId,
      dateNtime: new Date(),
      tasksDeleted: taskCount,
      contDeleted: 1,
      follDeleted: follCount,
    };
    this.db
      .onDeleteCustomer(this.data.superUserId, this.data.custId)
      .then((_data) => {
        this.db.addToDeleteLog(this.data.superUserId, deleteLogCust);
      });
    this.dialogRef1.close();
    this._snackBar.open(this.data.fieldNameContact + ' deleted', '', {
      duration: 2000,
    });
    this.router.navigate(['dash/home']);
  }
  //get Attachments for task as a promise
  getAttachmentsTask(superUserId, taskId) {
    return new Promise<void>(async (resolve) => {
      await this.db
        .getAttachmentsTask(superUserId, taskId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.attachmentsTask = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Attachments;
          });
          resolve();
        });
    });
  }
  getFollowUpsPromise() {
    return new Promise<void>((resolve) => {
      this.db
        .getAllFollowUps(this.data.custId, this.data.superUserId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.allFollowUp = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as FollowUps;
          });
          resolve();
        });
    });
  }
  getAttsPromise() {
    return new Promise<void>((resolve) => {
      this.db
        .getAttachments(this.data.superUserId, this.data.custId)
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
  getTasksPromise() {
    return new Promise<void>((resolve) => {
      this.db
        .getAllTasks(this.data.superUserId, null, this.data.custId, null, null)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.allTasks = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Task;
          });
          resolve();
        });
    });
  }
  // ondestroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
