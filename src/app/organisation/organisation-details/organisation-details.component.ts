import { DOCUMENT, Location } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Addcontactpopup1Component } from 'src/app/addcontactpopup1/addcontactpopup1.component';
import { Addnewsale1Component } from 'src/app/addnewsale1/addnewsale1.component';
import { CallViewAudioPlayerComponent } from 'src/app/call-view-audio-player/call-view-audio-player.component';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { CommonService } from 'src/app/common.service';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { CrudServiceComponent } from 'src/app/crud-service/crud-service.component';
import {
  Attachments,
  Branch,
  contactSettings,
  Customer,
  CustomerNotes,
  defaultContactSettings,
  defaultorganisationSettings,
  defaultSaleSettings,
  defaultServiceSettings,
  defaultTaskSettings,
  FollowUps,
  Invoice,
  OrganisationModel,
  organisationSettings,
  PaymentReceipt,
  PlanDocLimit,
  Sales,
  saleSettings,
  Service,
  serviceSettings,
  SubUsers,
  Task,
  taskSettings,
  UserAccessDetails,
  deleteLogModel,
  paymentSettings,
  defaultPaymentSettings,
  expenseSettings,
  defaultExpenseSettings
} from 'src/app/data-models';
import { FollowupTaskCreateComponent } from 'src/app/followup-task-create/followup-task-create.component';
import { FullLayoutComponent } from 'src/app/full-layout/full-layout.component';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { Paymentreceipt1Component } from 'src/app/paymentreceipt1/paymentreceipt1.component';
import { SelectsaledialogComponent } from 'src/app/selectsaledialog/selectsaledialog.component';
import { CrudModal1Component } from 'src/app/taskboard/crud-modal1/crud-modal1.component';
import { CrudFormComponent } from '../crud-form/crud-form.component';
import { OrganisationDetailsService } from './organisation-details.service';

@Component({
  selector: 'app-organisation-details',
  templateUrl: './organisation-details.component.html',
  styleUrls: ['./organisation-details.component.scss'],
})
export class OrganisationDetailsComponent implements OnInit {
  @ViewChild('file') file;
  attachmentSize: any; //attacnhment size
  networkConnection: boolean; //network connection check
  disableSale: boolean = false; //disable addition of sale
  disableService: boolean = false; //disable addition of sale
  disableSaleAdd = false;
  disableSaleView = false;
  disableServiceView = false;
  disableViewContact = false;
  disableAddContact = false;
  disableAtt = false;
  contactsList: Customer[] = [];
  salesList: Sales[] = []; //all sales associated with this customer
  servicesList: Service[] = []; //all services associated with this customer
  quotations: Invoice[] = []; //quotations associated with this customer
  estimate: Invoice[] = []; //estimatess associated with this customer
  invoices: Invoice[] = []; //invoices associated with this customer
  paymentReceipts: PaymentReceipt[] = []; //collections associated with this customer
  tasks: Task[] = []; //open tasks associated with this customer
  orgId = '';
  accountType = '';
  uploadFileLimit: any = [];
  userId = '';
  superUserId = '';

  // customisable field names
  fieldNameContact: string = 'Contact';
  fieldNameSale: string = 'Sale';
  fieldNameService = 'Support';
  fieldNameFollowup: string = 'FollowUp';
  fieldNameTask: string = 'Task';
  fieldNameEstimate: string = 'Estimate';
  fieldNameQuotation: string = 'Quotation';
  fieldNameInvoice: string = 'Invoice';
  fieldNameCollection: string = 'Collection';
  fieldNameContactNotes: string = 'Note';
  disableDocEst: boolean = false; //disable Sales Doc view
  disableDocCreateEst: boolean = false; //disable Sales Doc view
  disableDocQuot: boolean = false; //disable Sales Doc view
  disableDocCreateQuot: boolean = false; //disable Sales Doc view
  disableDocInv: boolean = false; //disable Sales Doc view
  disableDocCreateInv: boolean = false; //disable Sales Doc view

  totalUserCount: number = 1;
  totalUploadLimit: number;
  currentlyUploaded: number;
  uploadPercentage: number;
  currentPlan: string;
  allSubUsers: SubUsers[] = [];

  assignedTo = '';
  assignedToName = '';
  associatedBranch = '';
  prevAssBranch = '';
  viewCheck: boolean = false; //Check whether current user has access to the particular record. true - allowed, false - not allowed
  navSelected: string = 'Info';
  serviceInProgress: number;
  serviceWon: number;
  serviceLost: number;
  salesWon: number;
  salesLost: number;
  contInProgress: number;
  contWOn: number;
  contLost: number;
  changeLog: any;
  companyName = '';
  selectedCode = '';
  contactNumber = '';
  website = '';
  dateCreated: number;
  progressBarStatus = false;
  enableOutboundCallsViaCallBridging: boolean = false;
  userNumber: string;
  callBridgingServiceProvider: string;
  autoCallToken = '';
  branches: Branch[] = [];
  orgData: OrganisationModel = null;
  salesInProgress: number = 0; //sales in pogresss associated with this customer
  usrProfileData: UserAccessDetails = null;
  disableColl = false;
  dataSourceAttachments: any = null; //for attachment table
  allTasks: Task[] = []; //variable holds all tasks fetched
  dataSourceContact: any = null;
  dataSourceSales: any = null; //for sales table: mat-table-dataSource
  displayedColumnSale: string[] = [
    'saleTitle',
    'salesStage',
    'selectedSalePipeline',
    'assignedToName',
  ]; //sale table columns
  saleSettings: saleSettings = defaultSaleSettings.CONST_VALUE; //default sale settings values
  expenseSettings: expenseSettings = defaultExpenseSettings.CONST_VALUE; //default sale settings values

  dataSourceService: any = null; //for sales table: mat-table-dataSource
  displayedColumnService: string[] = [
    'serviceTitle',
    'servicesStage',
    'selectedServPipeline',
    'assignedToName',
  ]; //sale table columns
  serviceSettings: serviceSettings = defaultServiceSettings.CONST_VALUE; //default sale settings values

  displayedColumnsCont: string[] = [
    'firstName',
    'secondName',
    'contactNo',
    'email',
    'assignedToName',
  ]; //task table columns
  dataSourceTask: any = null; //for task mat-table
  displayedColumnsTask: string[] = [
    'title',
    'dueDate',
    'priority',
    'assignedTo',
    'status',
    'actions',
  ]; //task table columns
  dataSourceCollection: any = null;
  displayedColumns: string[] = [
    'Date',
    'Invoice No',
    'Payment Mode',
    'Amount',
    'edit',
  ]; //collection table columns
  displayedColumn: string[] = ['Date', 'Filename', 'Uploaded', 'edit']; //attachment table columns
  nextFollowUp: FollowUps[]; //next followup
  allFollowUp: FollowUps[]; //all followups
  orgNotes = []; //collection of csuomter notes
  orgNote = null;
  userName = '';
  dragAreaClass = 'dragarea';
  attachments: Attachments[] = [];
  plan = '';
  prevAssignedTo = '';
  prevAssName = '';
  additionalFields: any[];
  filteredAdditionalField: any = []; // to hold only active custom fields
  //customisation field
  orgSettings: organisationSettings = defaultorganisationSettings.CONST_VALUE;
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  taskSettings: taskSettings = defaultTaskSettings.CONST_VALUE;
  paymentSettings: paymentSettings = defaultPaymentSettings.CONST_VALUE; //default payment settings values
  
  dataAccessRule = 'Own';
  disableEdit = false;
  fieldNameOrganization = 'Organization';
  disableReAssign = false;
  userEmail = ''; //hold email of logged in user

  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  branch: string;
  prevNote: any;
  DIDNumber: string = '';

  //custom pipe to implement sorting of data wrt date modified in changeLog
  propName = 'dateModified'; //property for sorting
  allFolowupSubscription: Subscription; // for closing all followupsubscription
  customsort = (a, b) => {
    //returns the greater date first
    return Number(b.value[this.propName]) - Number(a.value[this.propName]);
  };
  lastStatusOption: any; //get last status
  taskStatusOptions:any=[] // for holding task status
  taskDefaultOpn :any[]= ['Open','Completed']


  constructor(
    private router: Router,
    private location: Location,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private orgDetailsService: OrganisationDetailsService,
    private fullLayoutComp: FullLayoutComponent,
    @Inject(DOCUMENT) private document: Document
  ) {
    route.params.pipe(takeUntil(this.onDestroy$)).subscribe((val) => {
      //Section 1: Get the information passed on to the module using router link
      this.orgId = this.route.snapshot.paramMap.get('orgId');
    });
  }

  ngOnInit(): void {
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        if (allData) {
          this.userId = allData.userId;
          this.superUserId = allData.userDetails.superUserId;
          this.userEmail = allData.userDetails.email;
          this.allSubUsers = this.commonService.createUserlist('All', 'any')[1];
          if (allData.superUserDetails?.fieldNames?.fieldNameOrganization) {
            this.fieldNameOrganization =
              allData.superUserDetails.fieldNames.fieldNameOrganization;
          }
          if (allData.superUserDetails.DIDNumber) {
            this.DIDNumber = allData.superUserDetails.DIDNumber;
          }
          if (allData.superUserDetails.fieldNames) {
            // assigning custom field names
            this.fieldNameContact =
              allData.superUserDetails.fieldNames.fieldNameContact;
            this.fieldNameSale =
              allData.superUserDetails.fieldNames.fieldNameSale;
            this.fieldNameTask =
              allData.superUserDetails.fieldNames.fieldNameTask;
            this.fieldNameFollowup =
              allData.superUserDetails.fieldNames.fieldNameFollowup;
            this.fieldNameEstimate =
              allData.superUserDetails.fieldNames.fieldNameEstimate;
            this.fieldNameQuotation =
              allData.superUserDetails.fieldNames.fieldNameQuotation;
            this.fieldNameInvoice =
              allData.superUserDetails.fieldNames.fieldNameInvoice;
            this.fieldNameCollection =
              allData.superUserDetails.fieldNames.fieldNameCollection;
            this.fieldNameContactNotes =
              allData.superUserDetails.fieldNames.fieldNameContactNotes;
          }
          if (allData.superUserDetails?.fieldNames?.fieldNameService) {
            this.fieldNameService =
              allData.superUserDetails.fieldNames.fieldNameService;
          }
          this.usrProfileData = allData.usrProfileData;
          if (
            this.usrProfileData.isCheckedOrg === false ||
            this.usrProfileData.orgsEdit === false
          ) {
            this.disableEdit = true;
            this.disableReAssign = true;
          }
          if (this.usrProfileData.orgReAssign === false) {
            this.disableReAssign = true;
          }
          this.dataAccessRule = this.usrProfileData.orgDataAccessRule;
          this.plan = allData.superUserDetails.plan;
          this.userName = allData.userDetails.lastname
            ? allData.userDetails.firstname + ' ' + allData.userDetails.lastname
            : allData.userDetails.firstname;
          this.additionalFields =
            allData.superUserDetails.customFieldsOrganisation;
            //taskStatusOptions
            
            this.taskStatusOptions = allData.superUserDetails.taskStatusOpn?allData.superUserDetails.taskStatusOpn:this.taskDefaultOpn;
          this.lastStatusOption = this.taskStatusOptions[this.taskStatusOptions.length - 1];
          //customisation field
          if (
            allData.superUserDetails.organisationSettings &&
            typeof allData.superUserDetails.organisationSettings !==
              'undefined' &&
            allData.superUserDetails.organisationSettings !== null
          ) {
            this.orgSettings = allData.superUserDetails.organisationSettings;
            this.commonService.checkCustomField(
              defaultorganisationSettings.CONST_VALUE,
              allData.superUserDetails.organisationSettings
            );
          }
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
          //field customisation for contactTable
          const displayTrueObjects = Object.entries(this.contactSettings)
            .filter(([key, value]) => value.display === true)
            .map(([key]) => key);
          const myArray = this.displayedColumnsCont.map((str, index) => ({
            value: str,
            id: index + 1,
          }));
          let intersectingElements = myArray.filter((obj) =>
            displayTrueObjects.includes(obj.value)
          );
          const newDisplayColumnCont = intersectingElements.map(
            (nameObject) => {
              const matchingName = displayTrueObjects.find(
                (name) => name === nameObject.value
              );
              return matchingName;
            }
          );
          this.displayedColumnsCont.splice(
            0,
            this.displayedColumnsCont.length,
            ...newDisplayColumnCont
          );

          this.branches = allData.branches;
          this.attachmentSize = allData.superUserDetails.totalAttachmentsSize;

          if (!this.attachmentSize) {
            this.attachmentSize = 0;
          }
          this.uploadFileLimit = PlanDocLimit.sizeLimit;
          this.totalUserCount = allData.superUserDetails.noSubusers + 1;
          this.currentlyUploaded =
            allData.superUserDetails.totalAttachmentsSize;
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

          if (this.usrProfileData) {
            // contact access check for contact
            if (this.usrProfileData.isCheckedCont == false) {
              // if the check box is false
              this.disableAddContact = true; // disable add contact
              this.disableViewContact = true; // disable view contact
            } else {
              if (this.usrProfileData.contactsCreate == false) {
                // if disable add contact
                this.disableAddContact = true; // disable add contact
              }
              if (this.usrProfileData.contactsView == false) {
                // if disable view contact
                this.disableViewContact = true; // disable view contact
              }
            }
            // disable Sale create and view
            if (this.usrProfileData.isCheckedSale == false) {
              // if the check box is false
              this.disableSaleAdd = true; // disable add sale
              this.disableSaleView = true; // disable view sale
            } else {
              if (this.usrProfileData.salesCreate == false) {
                // if disable add sale
                this.disableSaleAdd = true; // disable add sale
              }
              if (this.usrProfileData.salesView == false) {
                // if disable view sales
                this.disableSaleView = true; // disable view sale
              }
            }
          }
          this.orgDetailsService
            .readOrgRecord(this.superUserId, this.orgId)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((data) => {
              if (data) {
                this.orgData = data;
                this.companyName = data.companyName;
                this.assignedTo = data.assignedTo;
                this.branch = data.associatedBranch;
                this.prevAssignedTo = data.assignedTo;
                this.assignedToName =  this.commonService.getAssignedToName(data.assignedTo);
                this.prevAssName = this.commonService.getAssignedToName(data.assignedTo);
                this.website = data.website ? data.website : 'Not Provided';
                this.dateCreated = data.createdDate;
                this.associatedBranch = data.associatedBranch
                  ? data.associatedBranch
                  : '';
                this.prevAssBranch = data.associatedBranch
                  ? data.associatedBranch
                  : '';

                if (data.changeLog) {
                  const changeLogArray: any = Object.values(data.changeLog);
                  this.changeLog = changeLogArray.sort(
                    (objA, objB) =>
                      Number(objB.dateModified) - Number(objA.dateModified)
                  );
                }

                this.viewCheck =
                  this.commonService.checkDataAccessRule(
                    'customers',
                    this.userId,
                    this.assignedTo,
                    this.branch
                  ) || data.createdBy == this.userId; //Allow user to view if the document had been created b user or passess data acces rule criteria

                
                if (data.code) {
                  this.selectedCode = data.code;
                } else {
                  this.selectedCode = '';
                }
                if (data.contactNo) {
                  this.contactNumber = data.contactNo;
                } else {
                  this.contactNumber = '';
                }
                if (data.additionalFieldsArr) {
                  const fieldListArray = data.additionalFieldsArr;
                  const fieldListLen = Object.keys(fieldListArray).length;
                  for (let i = 0; i < this.additionalFields?.length; i++) {
                    this.additionalFields[i].datavalue = '';
                  }
                  if (fieldListLen != 0) {
                    for (let i = 0; i < fieldListLen; i++) {
                      if (this.additionalFields[i]) {
                        this.additionalFields[i].datavalue =
                          fieldListArray[i].fieldValue;
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

                this.progressBarStatus = true;
              }
            });

          // fetch contacts
          this.orgDetailsService
            .getContacs(this.orgId, this.superUserId)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((data) => {
              this.contactsList = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as Customer;
              });
              this.contInProgress = this.contactsList.filter(
                (record) => record.inPipeline == true
              ).length;
              this.contWOn = this.contactsList.filter(
                (record) => record.won == true
              ).length;
              this.contLost = this.contactsList.filter(
                (record) => record.lost == true
              ).length;
              this.dataSourceContact = new MatTableDataSource([]);
              this.dataSourceContact.data = this.contactsList;
            });

          // fetch sales
          this.orgDetailsService
            .getSales(this.orgId, this.superUserId)
            .pipe(takeUntil(this.onDestroy$))
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

          // fetch services
          this.orgDetailsService
            .getServices(this.orgId, this.superUserId)
            .pipe(takeUntil(this.onDestroy$))
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

          // tasks
          // get open tasks to get the count to dispaly in badge
          this.orgDetailsService
            .getTasks(this.superUserId, this.orgId,this.lastStatusOption)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((data) => {
              this.tasks = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as Task;
              });
            });

          // getting all followup
          this.allFolowupSubscription = this.orgDetailsService
            .getAllFollowUps(this.orgId, this.superUserId)
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
            });

          // notes
          this.orgDetailsService
            .readNote(this.orgId, this.superUserId)
            .pipe(takeUntil(this.onDestroy$))
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
              this.orgNotes = EditableData;
            });
        }
      });
  }
  //Navigation selector
  setNavOption(option) {
    this.navSelected = option;
    if (this.navSelected == 'Sales docs') {
      //Get sales docs
      this.orgDetailsService
        .getQuotations(this.superUserId, this.orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.quotations = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
        });
      this.orgDetailsService
        .getEstimate(this.superUserId, this.orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.estimate = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
        });
      this.orgDetailsService
        .getInvoices(this.superUserId, this.orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.invoices = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
        });
    }

    if (this.navSelected == 'Attachments') {
      // attachments fetching
      this.orgDetailsService
        .getAttachments(this.superUserId, this.orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.attachments = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Attachments;
          });
          this.dataSourceAttachments = new MatTableDataSource([]);
          this.dataSourceAttachments.data = this.attachments;
        });
    }
    if (this.navSelected == 'Payments') {
      // get the list of payments
      this.orgDetailsService
        .getPaymentReceipt(this.superUserId, this.orgId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.paymentReceipts = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as PaymentReceipt;
          });
          this.dataSourceCollection = new MatTableDataSource([]);
          this.dataSourceCollection.data = this.paymentReceipts;
        });
    }
  }
  //web toolbar back button
  onBack() {
    this.location.back();
  }
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  // add new sale from customer
  onAddSale() {
    if (this.commonService.addDocLimitaion.addSaleDisable) {
      this._snackBar.open('Sale limit expired for this month!', '', {
        duration: 2000,
      });
    } else {
      this.commonService.updateOrgToEdit(this.orgData);
      this.dialog.open(Addnewsale1Component, {
        width: '800px',
        height: 'auto',
        disableClose: true,
        data: {
          scenario: 'createfromOrg',
          id: this.orgId,
          orgName: this.companyName,
        },
      });
    }
  }
  // add service
  onAddService() {
    this.commonService.updateOrgToEdit(this.orgData);
    this.dialog.open(CrudServiceComponent, {
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: {
        scenario: 'createfromOrg',
        id: this.orgId,
        orgName: this.companyName,
      },
    });
  }
  // add task
  addTask() {
    this.dialog.open(CrudModal1Component, {
      width: '520px',
      height: 'auto',
      disableClose: true,
      data: {
        orgId: this.orgId,
        mode: 'orgCreate',
        company: this.companyName,
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
        cid: task.customerId,
        mode: 'update',
        company: task.company,
        firstName: task.name,
        secondName: task.lastName,
        surname: task.surname,
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
        changeLog: changeLog,
        currentStatus: status,
        lastStatus: this.lastStatusOption,
        constructorName: this.constructor.name,
      },
    });
  }
  deleteTask(taskid, status, title) {
    const dialogRef = this.dialog.open(ChildOrgDetails, {
      width: '400px',
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
        await this.getAttachments(this.superUserId,taskid);
        // delete att
        if (!!this.attachments) {
          let newSize = this.attachmentSize;
          this.attachments.forEach(async (att) => {
            if (!!att) {
              newSize = newSize - att.size;
              //update total size
              this.orgDetailsService.updateSize(this.superUserId, newSize);
              //delete from storage
              const storageRef = firebase.default.storage().ref();
              var desertRef = storageRef.child(att.path);
              await desertRef.delete();
            }
          });
        }

        this.orgDetailsService.deleteTask(this.superUserId, taskid).then(data=>{
        this.orgDetailsService.addToDeleteLog(this.superUserId, deleteLogTask);
        this._snackBar.open(`${this.fieldNameTask} deleted`, '', {
          duration: 2000,
        });
        })
      }
    });
  }

  //get Attachemnts for task as a promise
  getAttachments(superId,id){
    return new Promise<void>((resolve) => {
      this.orgDetailsService
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

  // add collection from toolbar/tab-web
  addPayment() {
    this.dialog.open(Paymentreceipt1Component, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        orgId: this.orgId,
        company: this.companyName,
        mode: 'createfromOrg',
        changeLog: this.changeLog,
        componentName: this.constructor.name,
        moduleName:'Organisations',
        docId: this.orgId
      },
    });
  }

  // edit collection
  editPayment(element) {
    this.commonService.updatePaymentToEdit(element);
    this.dialog.open(Paymentreceipt1Component, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        saleId: element.saleid,
        customerId: element.customerId,
        mode: 'update',
        paymentId: element.id,
        customerName: element.customerSecondName
          ? element.customerName + ' ' + element.customerSecondName
          : element.customerName,
        orgId: element.orgId,
        company: element.customerCompany,
        saleTitle: element.saleTitle,
        changeLog: this.changeLog,
        componentName: this.constructor.name,
        moduleName:'Organisations',
        docId: element.orgId
      },
    });
  }
  createDoc(docType: string) {
    if (docType == 'Estimate') {
      this.router.navigate([
        '/dash/document/documentmanagement/',
        'none',
        'create',
        docType,
        'none',
        this.orgId ? this.orgId : 'none',
        'none',
      ]);
    } else if (docType == 'Quotation') {
      this.router.navigate([
        '/dash/document/documentquotationmanagement/',
        'none',
        'create',
        docType,
        'none',
        this.orgId ? this.orgId : 'none',
        'none',
      ]);
    } else {
      this.router.navigate([
        '/dash/document/documentinvoicemanagement/',
        'none',
        'create',
        docType,
        'none',
        this.orgId ? this.orgId : 'none',
        'none',
      ]);
    }
    // const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;

    // dialogConfig.data = {
    //   userId: this.superUserId,
    //   custId: this.orgId,
    //   docType: docType,
    //   id: this.orgId,
    //   orgData: this.orgData,
    // };

    // const dialogRef = this.dialog.open(SelectsaledialogComponent, dialogConfig);
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
        // this.uploadAttachment(files);
      }
    }
  }
  inputAttachment() {
    let element: HTMLElement = document.getElementsByName(
      'attachmentOrg'
    )[0] as HTMLElement;
    this.file.nativeElement.value = '';
    element.click();
  }
  // upload attaxhment
  uploadAttachment(event, type) {
    let date = new Date().getTime();
    let str;
    let size;
    let downloadURL;
    let file;
    let newSize;
    let name = this.userName;
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
        this.orgDetailsService.updateSize(this.superUserId, newSize);
        const filePath = `attachment/${
          this.superUserId
        }/organisation/${Date.now()}_${str}`;
        this.fullLayoutComp.uploadAttachment(
          filePath,
          file,
          this.orgId,
          str,
          date,
          name,
          size,
          newSize,
          'org',
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
  // download attachment
  downloadAttachment(url) {
    this.document.location.href = url;
  }

  // delete attachment for web
  deleteAttachment(id, path, url, filename, size) {
    this.dialog.open(ConfirmationpopupComponent, {
      data: {
        taskId: id,
        smode: 'attachmentDeleteOrg',
        path: path,
        url: url,
        orginalPath: filename,
        custId: this.orgId,
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
  onEditOrg() {
    this.commonService.updateOrgToEdit(this.orgData);
    this.dialog.open(CrudFormComponent, {
      panelClass: 'custom-dialog-container',
      width: '400px',
      minHeight: '100px',
      height: 'auto',
      disableClose: true,
      data: { scenario: 'edit', orgId: this.orgId },
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
      data: {
        scenario: 'create',
        orgId: this.orgId,
        orgName: this.companyName,
      },
    });
  }
  onDelete() {}
  onCall() {
    // if (
    //   this.enableOutboundCallsViaCallBridging &&
    //   this.callBridgingServiceProvider == 'Bonvoice' &&
    //   this.contactNumber &&
    //   this.userNumber
    // ) {
    //   let customerName =
    //     this.orgData.firstName +
    //     ' ' +
    //     (this.orgData.secondName ? this.orgData.secondName : ' ');
    //   let minute = new Date().getMinutes();
    //   let hour = new Date().getHours();
    //   let startTime = hour + ':' + minute;
    //   this.commonService
    //     .onAutoCall(
    //       this.userNumber,
    //       this.contactNumber,
    //       this.superUserId,
    //       this.userId,
    //       this.userName,
    //       this.orgData.companyName,
    //       this.orgId,
    //       customerName,
    //       startTime,
    //       null,
    //       this.autoCallToken,
    //       this.DIDNumber
    //     )
    //     .subscribe((data: any) => {});
    //   this._snackBar.open('Initiating Call', '', {
    //     duration: 2000,
    //   });
    // }
  }
  onCallFollowUp(id) {
    // if (
    //   this.enableOutboundCallsViaCallBridging &&
    //   this.callBridgingServiceProvider == 'Bonvoice' &&
    //   this.contactNumber &&
    //   this.userNumber
    // ) {
    //   let customerName =
    //     this.orgData.firstName +
    //     ' ' +
    //     (this.orgData.secondName ? this.orgData.secondName : ' ');
    //   let minute = new Date().getMinutes();
    //   let hour = new Date().getHours();
    //   let startTime = hour + ':' + minute;
    //   this.commonService
    //     .onAutoCall(
    //       this.userNumber,
    //       this.contactNumber,
    //       this.superUserId,
    //       this.userId,
    //       this.userName,
    //       this.orgData.companyName,
    //       this.orgId,
    //       customerName,
    //       startTime,
    //       id,
    //       this.autoCallToken,
    //       this.DIDNumber
    //     )
    //     .subscribe((data: any) => {});
    //   this._snackBar.open('Initiating Call', '', {
    //     duration: 2000,
    //   });
    // }
  }
  onWhatsAppContact() {
    const code = this.orgData.code?.replace('+', '');
    window.open(
      `https://web.whatsapp.com/send?phone=${code}${this.orgData.contactNo}`,
      '',
      'width=800,height=600'
    );
    // window.open(`https://wa.me/` + this.selectedCode + this.contactNumber);
  }
  tabClickWeb(tab) {
    const activetab = tab.tab.textLabel;
    if (activetab == 'Notes') {
      this.orgDetailsService
        .readNote(this.orgId, this.superUserId)
        .pipe(takeUntil(this.onDestroy$))
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
          this.orgNotes = EditableData;
        });
    }
    if (activetab == 'TASKS') {
      // get all tasks from DB
      this.orgDetailsService
        .getAllTasks(this.superUserId, this.orgId)
        .pipe(takeUntil(this.onDestroy$))
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
  // make a customer note editable if click to edit
  onEditNote(note) {
    note.isEditable = true;
    this.prevNote = note.notes;
  }
  onClearNote(form: NgForm) {
    form.reset(); //reset the form after writing the data
  }
  // notes added
  onSubmitNote(form: NgForm, GAevent) {
    let createdDate = new Date().getTime();
    this.orgDetailsService.writeNote(
      form.value,
      this.superUserId,
      createdDate,
      this.orgId,
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
      this.orgDetailsService.updateNote(
        note,
        this.superUserId,
        this.orgId,
        noteId,
        ChangeLogComponent.saveLog(
          this.constructor.name,
          this.userId,
          this.userName,
          { Notes: this.prevNote },
          { Notes: note },
          this.changeLog
        )
      );
    }
    notes.isEditable = false;
  }
  // create followupos in web
  onCreateFollowUps() {
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        orgId: this.orgId,
        companyNames: this.companyName,
        contactNumber: '', // pass customer number
        countryCode: '', // pass customer country code
        assignedTo: this.assignedTo,
        assignedToName: this.assignedToName,
        scenario: 'create',
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
    this.orgDetailsService.UpdateTask(taskId, completed, this.superUserId, newChangeLog);

    this._snackBar.open(this.fieldNameFollowup + ' task closed', '', {
      duration: 2000,
    });
  }
  // edit followup
  onEditFollowUps(taskId: string, followUpData: FollowUps) {
    this.commonService.followUpDetails = followUpData;
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: followUpData.customerId,
        companyNames: followUpData.companyName,
        customerNames: followUpData.customerName,
        contactNumber: followUpData.contactNumber ? followUpData.contactNumber:'', // pass customer number
        countryCode: followUpData.countryCode ? followUpData.countryCode:'', // pass customer country code
        scenario: 'edit',
        followUpId: taskId,
      },
    });
  }

  onPlayAudio(resourceURL) {
    const dialogRef = this.dialog.open(CallViewAudioPlayerComponent, {
      width: '500px',
      data: resourceURL,
    });
  }
  assignedToEventHander($event: any) {
    this.assignedTo = $event;
    let assignedToName;

    if (this.assignedTo && this.prevAssignedTo != this.assignedTo) {
      for (let i = 0; i < this.allSubUsers.length; i++) {
        if (this.assignedTo === this.allSubUsers[i].userId) {
          assignedToName = this.allSubUsers[i].lastname
            ? this.allSubUsers[i].firstname + this.allSubUsers[i].lastname
            : this.allSubUsers[i].firstname;
          if (this.allSubUsers[i].branchId) {
            this.associatedBranch = this.allSubUsers[i].branchId;
          } else {
            this.associatedBranch = 'NA';
          }
        }
      }

      let prevVal = {
        assignedTo: this.prevAssignedTo,
        assignedToName: this.prevAssName,
        ...(this.branches.length > 0 && {
          associatedBranch: this.branches.find(
            (item) => item.id === this.prevAssBranch
          )?.name
            ? this.branches.find((item) => item.id === this.prevAssBranch)?.name
            : 'None',
        }),
      };
      let curVal = {
        assignedTo: this.assignedTo,
        assignedToName: assignedToName,
        ...(this.branches.length > 0 && {
          associatedBranch: this.branches.find(
            (item) => item.id === this.associatedBranch
          )?.name
            ? this.branches.find((item) => item.id === this.associatedBranch)
                ?.name
            : 'None',
        }),
      };
      this.orgDetailsService.updateAssignedTo(
        this.superUserId,
        this.orgId,
        this.assignedTo,
        assignedToName,
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
    }
  }

  assignedToNameEventHander($event: any) {
    this.assignedToName = $event;
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
      this.orgDetailsService.updateBranch(
        this.superUserId,
        this.orgId,
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
  // ondestroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.allFolowupSubscription?.unsubscribe();
  }
}
@Component({
  selector: 'child-org-details',
  templateUrl: 'child-org-details.html',
  styleUrls: ['./organisation-details.component.scss'],
})
export class ChildOrgDetails {
  delete = 'delete';
  constructor(
    public dialogRef: MatDialogRef<ChildOrgDetails>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
