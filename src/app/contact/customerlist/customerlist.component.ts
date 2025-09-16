/**********************************************************************************
Description: Component is used to dispalylist of contacts under this user
**********************************************************************************/
import {
  contactSettings,
  Customer,
  customerViewSettingsDef,
  defaultContactSettings,
  DisplayColumn,
  messageTemplateModel,
  modules,
  MsgCountModel,
  Profile,
  StageHistoryModel,
  SubUsers,
  UserAccessDetails,
} from '../../data-models';

import { CustomerlistService } from './customerlist.service';
import { Router } from '@angular/router';
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  NgZone,
  Inject,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { DatePipe, DecimalPipe, Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { ReAssignSaleComponent } from '../re-assign-sale/re-assign-sale.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DeleteContactsComponent } from '../delete-contacts/delete-contacts.component';
import { NetworkCheckService } from '../../networkcheck.service';
import { CommonService } from 'src/app/common.service';
import { take, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerTableColumns } from 'src/app/model/custom-report.model';
import { CardSettingsComponent } from 'src/app/card-settings/card-settings.component';
import { ViewBuilderComponent } from 'src/app/view-builder/view-builder.component';
import { Addnewsale1Component } from 'src/app/addnewsale1/addnewsale1.component';
import { CrudServiceComponent } from 'src/app/crud-service/crud-service.component';
import { CrudModal1Component } from 'src/app/taskboard/crud-modal1/crud-modal1.component';
import { FollowupTaskCreateComponent } from 'src/app/followup-task-create/followup-task-create.component';
import { Addcontactpopup1Component } from 'src/app/addcontactpopup1/addcontactpopup1.component';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { SelectSearchComponent } from 'src/app/common-search/select-search/select-search.component';
import { StatusPopupComponent } from 'src/app/settings/status-popup/status-popup.component';
import { CommonListDataService } from 'src/app/common-list-data.service';
import { CustomerTableColumnsInvPlan } from 'src/app/model/custom-report-invoicing.model';
import { CustomerTableColumnsLeadPlan } from 'src/app/model/custom-report-leadManagement.model';
import * as firebase from 'firebase';
import { emailTemplateModel } from 'src/app/settings/email-template-settings/email-template.model';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { UserFeatures } from 'src/app/model/productfeatures.model';
import { ViewServiceService } from 'src/app/view-builder/view-service.service';
import { ChangecuststatdialogComponent } from 'src/app/changecuststatdialog/changecuststatdialog.component';
import { Pipelines, PipelineStages } from 'src/app/model/pipeline.modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface customerUpload {
  uploadNo: number;
  currentNo: number;
  pendingNo: number;
} //used in upload-customer-list-popup-component

@Component({
  selector: 'app-customerlist',
  templateUrl: './customerlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./customerlist.component.scss'],
  providers: [DecimalPipe],
})
export class CustomerlistComponent implements OnInit, OnDestroy {
  viewSettingArray: any = customerViewSettingsDef.DATA; //customer view settings array
  viewSettingSelected: any = this.viewSettingArray[0]; //particular view chosen by user
  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.
  userFirstName: string = null; //logged in users first name
  userSecondName: string = null; //logged in users second name
  subUsers: SubUsers[] = []; // sub users list
  plan: any; //plan of superuser
  progressBarStatus: boolean = false; // for showing the loader
  // additional fileds variable
  fieldListArray: any = [];
  CustomerTableDataArray: MatTableDataSource<Customer>; //mat-table datasource
  // table data is stored in other variables for filtering and reset
  resetDateArray: MatTableDataSource<Customer>; // used for reset filter list
  customersArray: MatTableDataSource<Customer>; // used for filter list
  userId: string; //logged in users id
  superUserId: string = ''; //super user id of logged in user
  selection = new SelectionModel<Customer>(true, []);
  custListStatus: any; //customer status under super user profile
  custListArray: any; //Customer status array defined in the super user profile
  custLoaded: boolean = false; //if customer data is loaded
  customerData: Customer[]; //holds customer data fetched from DB
  stageHistories: any[]; // to store stage histories of current contact
  networkConnection: boolean; //to check network connection
  userProfileData: UserAccessDetails = null; //access control settings
  disableViewContact: boolean = false; //disable view contact
  disableEditContact: boolean = false; //disable edit contact
  disableDeleteContact: boolean = false; //disable delete contact
  disableDownloadContact: boolean = false; //disable download contact
  disableSale = false;//disable create sale
  disableService = false;//disable create service
  disableFoll = false;//disable create followup
  disableCreateNote = false; // disable Note creation
  dataAccessRuleCheck: string; //contact data accees rule

  superUserDetails: Profile = null; //logged in users super user data
  accountType: string = ''; //accountType of logged in user
  // custom field names
  fieldNameFollowup: string = 'FollowUp';
  fieldNameContactNotes: string = 'Note';
  fieldNameTask: string = 'Task';
  fieldNameContact: string = 'Contact'; //customisable field name
  fieldNameSale: string = 'Sale';
  fieldNameService: string = 'Support';
  fieldNameOrganization = 'Organization';
  fieldNameEstimate: string = 'Estimate';
  fieldNameQuotation: string = 'Quotation';
  fieldNameInvoice: string = 'Invoice';
  fieldNameExpense: string = 'Expense';
  fieldNameCollection: string = 'Collection';

  commonServiceUserSubscription: Subscription; //common service user subscription
  dialogRef: any;
  actCustAgeing: boolean = false; // check for is ageing is activated
  custStatusAge: any; // customer age number
  customerPipelines: Pipelines[] = [];// customer pipeline array

  stageCollapseArray = []; // stage collaps list
  customFieldContacts: any[]; // contact custom fields
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE; // conatct field name settings
  cardFields: any[]; // all card fields
  displayFields: any; // displaying card fields
  dataRead: any[]; // customer list
  userList: any; // list of users data
  userIdArray: any;// list of users id
  sortField: any; // filter sort field
  sortOrder: any;// filter sort order

  columnsDispaly = []; // all column in table
  userDetails: Profile;// logged in user details
  userIdsArray: any[] = [];// list of users id
  userNamesArray: any[] = []; // list of users names
  pipelineNames = []; //Array to store the pipeline
  displayColumnsSaved: DisplayColumn[] = [];// saved column in table
  displayName: string = 'displayCustomerColumns'; // used as saving field for customer column
  tableName: string = 'Customer';// table name
  tableDefaultData = CustomerTableColumns; // default column
  allUsersId: any; // all user id
  userDetailsAll: any; // all user details
  customerSubscription: Subscription; // used for closing subscription
  secondaryFilterSet: boolean = false; //Field to check if secondary filter has been set or not
  secondaryFilterField: any; // secondary filter field name
  secondaryFilterValue: any; // secondary filter field value
  sortOrderSet: boolean = false; //Field to check if sort filter has been set or not
  sortCardFieldSet: boolean = false;
  sortBy: any; // sort by field name
  noOfStages: number; // no of stages
  noOfCustinViewPipeline: any; // no of customer in pipeline
  allSubUsers: any[] = []; // all sub users
  getFilteredDataCalls: number = 0;
  getFieldValueCalls: number = 0;
  branches = []; // list of branches
  disableReAssign = false;// reassign disable check

  enableOutboundCallsViaCallBridging: boolean = false; //for checking autocall enabled or not
  userNumber: string; // user number for autocall
  callBridgingServiceProvider: string; // auto call service provider name
  autoCallToken: string = ''; // token for auocall authentication
  userName: string; //logged in users full name
  DIDNumber: string = ''; // did number for autocall
  alertPopupStatus: boolean = false; // to open the alert dialoge once
  whatsAppTemplates: messageTemplateModel[] = []; //to hold the fetrched whatsapp message templates
  smsTemplates: messageTemplateModel[] = []; //to hold the fetrched sms message templates
  emailTemplates: emailTemplateModel[] = []; //to hold the fetrched email templates
  smtpSettings = null; //SMTP settings saved in DB
  emailEnabled = false; //SMTP settings of email completed
  smsEnabled = false; //SMS settings saved user
  waEnabled = false; //WhatsApp settings saved user
  smsCount = 0; //if daily sms send limit exceeded
  waCount = 0; //if daily wa send limit exceeded
  emailCount = 0; //if daily email send limit exceeded to update in UI
  userPlan: UserFeatures; // user plan
  agedFilterSet: boolean = false; //Field to check if aged filter has been set or not
  taskStatusOptions: any; // task status list
  defaultTaskOpn: any[] = ['Open', 'Completed']; // task default status
  lastStatusOption: any; // task last status
  callBridgingExtension: any; // voxbay caller extention
  outboundCallBridgingType: any = ''; // voxbay call type
  constructor(
    public datepipe: DatePipe,
    private router: Router,
    private customerlistService: CustomerlistService,
    public dialog: MatDialog,
    private location: Location,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private _snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    public commonListDataService: CommonListDataService,
    private viewServiceService: ViewServiceService
  ) {
    this.CustomerTableDataArray = new MatTableDataSource([]);
    this.customersArray = new MatTableDataSource([]);
    this.resetDateArray = new MatTableDataSource([]);
  }

  async getViewData() {
    this.progressBarStatus = false;
    // open a popup if deleted additional field is used in custom view query
    if (
      this.viewSettingSelected.primaryQuery.queryField ==
        'additionalFieldsArr' &&
      !this.fieldListArray[this.viewSettingSelected.primaryQuery.ind].isActive
    ) {
      if (!this.alertPopupStatus) {
        this.dialog.open(StatusPopupComponent, {
          disableClose: true,
          data: {
            type: 'Addtional_field_custom_view',
          },
        });
      }
      this.alertPopupStatus = true;
    } else if (
      this.viewSettingSelected.sortField.fieldType == 'Additional' &&
      !this.fieldListArray[this.viewSettingSelected.sortField.ind].isActive
    ) {
      if (!this.alertPopupStatus) {
        this.dialog.open(StatusPopupComponent, {
          disableClose: true,
          data: {
            type: 'Addtional_field_custom_view',
          },
        });
      }
      this.alertPopupStatus = true;
    } else {
      this.viewSettingSelected.filters?.forEach((element) => {
        if (
          element.queryField == 'additionalFieldsArr' &&
          !this.fieldListArray[element.ind].isActive
        ) {
          if (!this.alertPopupStatus) {
            this.dialog.open(StatusPopupComponent, {
              disableClose: true,
              data: {
                type: 'Addtional_field_custom_view',
              },
            });
          }
          this.alertPopupStatus = true;
        }
      });
    }
    // get the data from specific format
    let queryData = this.commonService.getQueryData(
      this.viewSettingSelected.primaryQuery
    );
    this.sortField = this.viewSettingSelected.sortField;
    this.sortOrder = this.viewSettingSelected.sortOrder;
    if (queryData) {
      if (this.customerSubscription && !this.customerSubscription.closed) {
        this.customerSubscription.unsubscribe();
      }

      this.customerSubscription = this.commonListDataService
        .getCustomerListListener()
        .subscribe((data) => {
          if (this.commonListDataService.cusomerListDataLoaded) {
            this.dataRead = data;
            this.customerData = this.dataRead;
            this.customersArray.data =
              this.dataRead =
              this.resetDateArray.data =
              this.CustomerTableDataArray.data =
              this.dataRead =
                this.dataRead.map((m) => {
                  if (m.secondName) {
                    return { name: m.firstName + ' ' + m.secondName, ...m };
                  } else {
                    return { name: m.firstName, ...m };
                  }
                });

            //If any filter was active, reapply the filter to make sure that filter does not get reset automatically on subscription update
            if (this.secondaryFilterSet == true) {
              this.secondaryFilter(
                this.secondaryFilterField,
                this.secondaryFilterValue
              );
            }
            this.getNoOfRecords();
            //If any custom sorting by field was active, reapply the filter to make sure that filter does not get reset automatically on subscription update
            if (this.agedFilterSet == true) {
              this.aged_secondaryFilter();
            }
            if (this.sortOrderSet == true) {
              this.setSortOrder(this.sortOrder);
            }
            //If any custom sorting by order was active, reapply the filter to make sure that filter does not get reset automatically on subscription update

            if (this.sortCardFieldSet == true) {
              this.sortCardField(this.sortBy);
            }
            this.filterDataByPipelines(
              this.commonListDataService.selectedCustPipeline
            );
            this.custLoaded = true;
            this.progressBarStatus = true;
            this.changeDetectorRef.detectChanges();
          }
        });
      if (!this.commonListDataService.cusomerListDataLoaded) {
        if (
          this.commonListDataService.customerSubscription &&
          !this.commonListDataService.customerSubscription.closed
        ) {
          this.commonListDataService.customerSubscription.unsubscribe();
        }
        this.commonListDataService.getCustomerList(
          this.superUserId,
          queryData,
          this.userIdArray,
          this.userProfileData.contactDataAccessRule,
          this.userId,
          this.userList,
          this.sortField,
          this.sortOrder,
          this.viewSettingSelected
        );
      }
    } else {
      this.progressBarStatus = true;
    }
  }
  filterDataByPipelines(pipelineId) {
    if (this.commonListDataService.selectedCustPipeline === 'All Pipelines') {
    } else {
      this.CustomerTableDataArray.data =
        this.CustomerTableDataArray.data.filter(function (e) {
          return e.selectedContactPipeline === pipelineId;
        });
    }
  }
  secondaryFilter(field, value) {
    this.secondaryFilterSet = true;
    this.secondaryFilterField = field;
    this.secondaryFilterValue = value;
    let filteredData = [];
    filteredData = this.dataRead.filter((record) => {
      return record[this.secondaryFilterField] === this.secondaryFilterValue;
    });
    this.customerData = filteredData;

    this.CustomerTableDataArray.data = filteredData;
    this.filterDataByPipelines(this.commonListDataService.selectedCustPipeline);
  }
  aged_secondaryFilter() {
    let filteredData = [];

    filteredData = this.dataRead.filter((record) => {
      return this.getAgedStatus(record);
    });
    this.agedFilterSet = true;
    this.customerData = filteredData;
    this.CustomerTableDataArray.data = filteredData;
    this.filterDataByPipelines(this.commonListDataService.selectedCustPipeline);
    this.selection.clear(); //clear select of table
  }

  //function to sort card data when sort order is changed
  setSortOrder(order) {
    this.sortOrderSet = true;
    this.sortOrder = order;
    this.customerData = this.commonService.sortData(
      this.customerData,
      this.sortField,
      this.sortOrder
    );
  }
  //function to sort card data when sort field is changed
  sortCardField(field) {
    this.sortCardFieldSet = true;
    this.sortBy = field;
    this.customerData = this.commonService.sortData(
      this.customerData,
      field,
      this.sortOrder
    );
  }

  ngOnInit(): void {
    let defaultViewset = true; // to block changinf the view if userdatas are changed
    this.commonServiceUserSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData.userDetails.enableLiteMode) {
          this.router.navigate(['dash/customer-list']);
        } else {
          // assigning data fetched to local  variables
          this.userProfileData = allData.usrProfileData;
          this.userId = allData.userId;
          this.superUserDetails = allData.superUserDetails;
          this.taskStatusOptions = this.superUserDetails.taskStatusOpn
            ? this.superUserDetails.taskStatusOpn
            : this.defaultTaskOpn;
          this.lastStatusOption =
            this.taskStatusOptions[this.taskStatusOptions.length - 1];
          this.userDetails = allData.userDetails;
          this.branches = allData.branches;
          this.subUsers = allData.subUsers;
          this.customFieldContacts = this.superUserDetails.customFieldsContact;
          this.userPlan = this.commonService.userPlan; //getting the userplan based features
          this.userName =
          allData.userDetails.firstname +
          ' ' +
          (allData.userDetails.lastname ? allData.userDetails.lastname : '');
          // check for sms credentials, and plan permissions to enable sms sending
          if (
            (!!this.superUserDetails.smsApiEntityId ||
              !!this.superUserDetails.smsApiSenderId) &&
            this.userPlan.messageTemplates
          ) {
            this.smsEnabled = true;
          }
          // check for whatsapp credentials and plan permissions to enable whatsapp msg sending
          if (
            !!this.superUserDetails.waBusURL &&
            this.userPlan.messageTemplates
          ) {
            this.waEnabled = true;
          }
          // check for email credentials and plan permissions to enable email sending
          this.customerlistService
            .getEmailSMTP(allData.userDetails.superUserId)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((doc) => {
              if (!!doc) {
                if (!!doc.type && this.userPlan.emailTemplates) {
                  this.emailEnabled = true;
                  this.smtpSettings = doc;
                }
              }
            });

          // email count check from todays bulkMails count
          this.customerlistService
            .getBulkEmails(allData.userDetails.superUserId)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((data) => {
              let bulkEmails = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as {};
              });
              this.emailCount = bulkEmails.length;
            });

          // fetch saved email templates
          this.customerlistService
            .getEmailTemplates(allData.userDetails.superUserId)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((data) => {
              this.emailTemplates = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as emailTemplateModel;
              });
            });

          // fetch saved sms templates
          this.customerlistService
            .getSMSTemplates(allData.userDetails.superUserId)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((data) => {
              let msgTemplates = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as messageTemplateModel;
              });

              // from all message templates fetched, filter out templates for whatsapp and sms
              this.whatsAppTemplates = msgTemplates.filter(
                (waTemp) => waTemp.templateType === 'WhatsApp'
              );
              this.smsTemplates = msgTemplates.filter(
                (waTemp) => waTemp.templateType === 'SMS'
              );
            });

          // get todays already sent sms, whatsapp, email counts
          this.customerlistService
            .getBulkMessagesCount(allData.userDetails.superUserId)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((data) => {
              const bulkMessages = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as MsgCountModel;
              });

              let sumSMS = 0;
              let sumWa = 0;
              bulkMessages.forEach(function (item) {
                if (item.type === 'SMS') {
                  sumSMS += item.counted;
                }

                if (item.type === 'WhatsApp') {
                  sumWa += item.counted;
                }
              });
              this.smsCount = sumSMS;
              this.waCount = sumWa;
            });
          if (allData.userDetails.customerViewSettings) {
            this.viewSettingArray = JSON.parse(
              JSON.stringify(allData.userDetails.customerViewSettings)
            ); //View setting array for customer list
            this.viewSettingSelected =
              this.viewSettingArray[this.commonListDataService.customerViewId]; // particular view selected
          } else {
            this.viewSettingSelected =
              this.viewSettingArray[this.commonListDataService.customerViewId]; // particular view selected
          }
          const allSubUsers = this.commonService.createUserlist(
            'All',
            'any'
          )[1];

          this.allSubUsers = allSubUsers.filter(function (e) {
            return e.status != 'suspended';
          });

          let userData = allData.userDetails;
          if (userData) {
            if (userData.firstname) this.userFirstName = userData.firstname;
            if (userData.lastname) this.userSecondName = userData.lastname;
            this.superUserId = userData.superUserId;
            this.accountType = userData.accountType;
          }

          [this.allUsersId, this.userDetailsAll] =
            this.commonService.createUserlist('All', 'any'); //create list of all subusers
          //if there is multiple pipeline access, show all five pipelines else show single pipeline
          this.customerPipelines = JSON.parse(
            JSON.stringify(allData.customerPipelines)
          );
          if (this.commonService.userPlan.multiPipelineAccess) {
          } else {
            this.customerPipelines.length = 1;
          }
          var result = this.customerPipelines.filter((obj) => {
            return (
              obj.pipelineId === this.commonListDataService.selectedCustPipeline
            );
          });
          if (
            result.length === 0 &&
            this.commonListDataService.selectedCustPipeline != 'All Pipelines'
          ) {
            // if pipeline is not selected assign first pipeline
            this.commonListDataService.selectedCustPipeline =
              this.customerPipelines[0].pipelineId;
          }

          this.commonListDataService.pipelineCustomerSelection ===
            this.commonService.getPipelineNames(
              'customers',
              this.customerPipelines[0].pipelineId
            );

          this.getStatusAndAgeFn();

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
              this.callBridgingExtension = allData.superUserDetails
                .extensionNumber
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
          if (allData.superUserDetails.DIDNumber) {
            this.DIDNumber = allData.superUserDetails.DIDNumber;
          }

          if (this.superUserDetails) {
            this.noOfStages = this.custListStatus?.length - 1;

            if (this.superUserDetails.fieldNames) {
              this.fieldNameOrganization = this.superUserDetails.fieldNames
                .fieldNameOrganization
                ? this.superUserDetails.fieldNames.fieldNameOrganization
                : 'Organization';

              this.fieldNameContact =
                this.superUserDetails.fieldNames.fieldNameContact;
              this.fieldNameSale =
                this.superUserDetails.fieldNames.fieldNameSale;
              this.fieldNameService =
                this.superUserDetails.fieldNames.fieldNameService;
              this.fieldNameTask =
                this.superUserDetails.fieldNames.fieldNameTask;
              this.fieldNameFollowup =
                this.superUserDetails.fieldNames.fieldNameFollowup;
              this.fieldNameContactNotes = this.superUserDetails.fieldNames
                .fieldNameContactNotes
                ? this.superUserDetails.fieldNames.fieldNameContactNotes
                : 'Note';
              this.fieldNameEstimate =
                this.superUserDetails.fieldNames.fieldNameEstimate;
              this.fieldNameQuotation =
                this.superUserDetails.fieldNames.fieldNameQuotation;
              this.fieldNameInvoice =
                this.superUserDetails.fieldNames.fieldNameInvoice;
              this.fieldNameExpense =
                this.superUserDetails.fieldNames.fieldNameExpense;
              this.fieldNameCollection =
                this.superUserDetails.fieldNames.fieldNameCollection;
            }
            this.plan = this.superUserDetails?.plan;

            this.fieldListArray = this.superUserDetails?.customFieldsContact;
          }
          if (allData.superUserDetails.actCustAgeing) {
            // check for customer ageing is activated
            this.actCustAgeing = allData.superUserDetails.actCustAgeing;
          }

          //customisation field
          if (
            allData.superUserDetails.contactSettings &&
            typeof allData.superUserDetails.contactSettings !== 'undefined' &&
            allData.superUserDetails.contactSettings !== null
          ) {
            this.contactSettings = allData.superUserDetails.contactSettings;
          }
          if (allData.userDetails.displayCustomerColumns) {
            this.displayColumnsSaved =
              allData.userDetails.displayCustomerColumns;
          }

          if (this.displayColumnsSaved.length > 0) {
            //if table settings are stored in db, use the stored data
            this.columnsDispaly = this.displayColumnsSaved;
            // remove select column if settings already saved in DB
            var ind = this.columnsDispaly.findIndex(
              (p) => p.columnDef == 'select'
            );
            if (ind > -1) {
              this.columnsDispaly.splice(ind, 1);
            }
          } else {
            //if plan is invoicing, get default table config from custom-report-invoicing model
            if (allData.superUserDetails.plan == 'invoicing') {
              this.columnsDispaly = CustomerTableColumnsInvPlan;
              this.tableDefaultData = CustomerTableColumnsInvPlan;
            } else if (allData.superUserDetails.plan == 'leadManagement') {
              //if plan is leadManagement, get default table config from custom-report-leadManagement model
              this.columnsDispaly = CustomerTableColumnsLeadPlan;
              this.tableDefaultData = CustomerTableColumnsLeadPlan;
            } else {
              //if plan is not invoicing or leadManagement, get default table config from custom-report model
              this.columnsDispaly = CustomerTableColumns;
            }
          }
          [this.userIdsArray, this.userNamesArray] =
            this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names

          //get the details of user profile assigned to the user
          if (this.userProfileData) {
            // disable add contact and contact list view
            if (this.userProfileData.isCheckedCont == false) {
              this.commonService.addDocLimitaion.addContactDisable = true;
              this.disableViewContact = true;
              this.disableEditContact = true;
              this.disableDeleteContact = true;
              this.disableDownloadContact = true;
              this.disableReAssign = true;
            } else {
              if (this.userProfileData.contactsCreate == false) {
                this.commonService.addDocLimitaion.addContactDisable = true;
              }
              if (this.userProfileData.contactsView == false) {
                this.disableViewContact = true;
              }
              if (this.userProfileData.contactsEdit == false) {
                this.disableEditContact = true;
              }
              if (this.userProfileData.contactsDelete == false) {
                this.disableDeleteContact = true;
              }
              if (this.userProfileData.contactsDownload == false) {
                this.disableDownloadContact = true;
              }
              if (this.userProfileData.contactReAssign === false) {
                this.disableReAssign = true;
              }
            }
            // disable Sale
            if (this.userProfileData.isCheckedSale == false) {
              this.disableSale = true;
              this.commonService.addDocLimitaion.addSaleDisable = true;
            } else {
              if (this.userProfileData.salesCreate == false) {
                this.disableSale = true;
                this.commonService.addDocLimitaion.addSaleDisable = true;
              }
            }
            // disable services
            if (this.userProfileData.isCheckedService == false) {
              this.disableService = true;
            } else {
              if (this.userProfileData.servicesCreate == false) {
                this.disableService = true;
              }
            }

            // disable followups
            if (this.userProfileData.isCheckedFoll == false) {
              this.disableFoll = true;
            } else {
              if (this.userProfileData.follCreate == false) {
                this.disableFoll = true;
              }
            }
            // disable notes
            if (this.userProfileData.isCheckedNotes == false) {
              this.disableCreateNote = true;
            } else {
              if (this.userProfileData.notesCreate == false) {
                this.disableCreateNote = true;
              }
            }
            //call the function to get the primary query details
            if (this.userProfileData.contactDataAccessRule) {
              let accessRule = '';
              accessRule = this.userProfileData.contactDataAccessRule;
              this.dataAccessRuleCheck =
                this.userProfileData.contactDataAccessRule;
              [this.userIdArray, this.userList] =
                this.commonService.createUserlist(accessRule, this.userId);
            }

            [this.cardFields, this.displayFields] =
              this.commonService.getCardFields(
                'customer',
                this.fieldNameContactNotes,
                this.fieldNameFollowup
              );
            // to set the view based on the default view saved in db.
            // at the first time the block will excute also then if customerView changed in current user, any other changes in super/current user will not enter to this block
            if (
              (allData.userDetails.contactDefaultView &&
                defaultViewset &&
                this.commonListDataService.customerView ==
                  this.commonListDataService.customerDefaultView) ||
              (allData.userDetails.contactDefaultView &&
                allData.userDetails.contactDefaultView !=
                  this.commonListDataService.customerDefaultView)
            ) {
              this.commonListDataService.customerView =
                allData.userDetails.contactDefaultView;
              this.commonListDataService.customerDefaultView =
                allData.userDetails.contactDefaultView;
              defaultViewset = false;
            }
            if (this.commonListDataService.customerView == 'grid') {
              if (
                this.commonListDataService.selectedCustPipeline ===
                'All Pipelines'
              ) {
                this.commonListDataService.pipelineCustomerSelection =
                  this.commonService.getPipelineNames(
                    'customers',
                    this.customerPipelines[0].pipelineId
                  );
                // this.pipelineNameArray[0];
                // this.viewPipelineChanged();
                this.pipelineChangedEvent();
              }
            } else {
              // if (this.plan !== 'gold') {
              //   this.pipelineNameArray.splice(
              //     this.pipelineNameArray.length,
              //     0,
              //     'All Pipelines'
              //   );
              // }
            }
            this.getViewData();
          }
        }
      }
    );
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
  // trigger send whatsapp cloud function from card
  triggerWhatsapp(templates, custFiltered) {
    if (this.waEnabled === true) {
      let selectedArray: Customer[] = [];
      selectedArray.push(custFiltered);
      this.triggerWhatsappfn(templates, selectedArray);
    } else {
      // send whatsapp messages if api is not configured

      //2 arguments to get template selected and to check the phone number/alt ph no
      let ass = null;

      if (this.subUsers?.length > 0) {
        ass = this.subUsers?.find(
          (subuser) => subuser.userId === custFiltered.assignedTo
        );
      }

      var contact = custFiltered;
      const code = custFiltered.code?.replace('+', '');
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

      if (templates === 'noTemplate') {
        window.open(
          `https://web.whatsapp.com/send?phone=${code}${custFiltered.contactNo}`,
          '',
          'width=800,height=600'
        );
      } else {
        // replacing body merged fields
        var str: any = templates.body
          .replace(/\#\[contact.Company Name\]/g, contact.companyName)
          .replace(/\#\[contact.First Name\]/g, contact.firstName)
          .replace(
            /\#\[contact.Second Name\]/g,
            contact.secondName ? contact.secondName : ''
          )
          .replace(
            /\#\[contact.Contact No\]/g,
            contact.contactNo
              ? contact.contactNo
              : 'Contact number not provided'
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
        if (this.superUserDetails.customFieldsContact) {
          let teststring = str;
          for (
            let i = 0;
            i < this.superUserDetails.customFieldsContact.length;
            i++
          ) {
            if (
              this.superUserDetails.customFieldsContact[i].isActive === true
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
                      : this.superUserDetails.customFieldsContact[i]
                          .fieldType == 'date_time'
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

        //message sending to primary contact number
        window.open(
          `https://web.whatsapp.com/send?phone=${code}${custFiltered.contactNo}&text=${convStr1}`,
          '',
          'width=800,height=600'
        );
      }
    }
  }
  // trigger send whatsapp cloud function from table
  triggerWhatsappfn(templates, selected: Customer[]) {
    // show a daily limit reached message if daily limit for allowed plan reached,
    //  else send whatsapp message
    if (selected.length + this.waCount > this.userPlan.bulkWaLimit) {
      this.dialog.open(ConfirmationpopupComponent, {
        width: '400px',
        data: {
          smode: 'countExceeded',
          remaining: this.userPlan.bulkWaLimit - this.waCount,
        },
      });
    } else {
      if (this.selection.selected.length > 0) {
        this.selection.clear(); //clear select of table
      }

      // data to send along
      const superId = this.superUserId;
      const superUserTimeZone = this.superUserDetails.timeZone;
      const customFieldsContact = this.superUserDetails.customFieldsContact;
      const waBusProvider = this.superUserDetails.waBusProvider;
      const waBusAuthKey = this.superUserDetails.waBusAuthKey;
      const waBusURL = this.superUserDetails.waBusURL;
      const waBusIntId = this.superUserDetails.waBusIntId;
      const waBusAppId = this.superUserDetails.waBusAppId;
      const waBusSourceNo = this.superUserDetails.waBusSourceNo;
      const allSubUsers = this.allSubUsers;
      const pipelines = this.customerPipelines;
      // call cloud fn
      const wamsgCallable = firebase.default
        .functions()
        .httpsCallable('callableSendWa');
      wamsgCallable({
        superId,
        allSubUsers,
        superUserTimeZone,
        customFieldsContact,
        waBusProvider,
        waBusAuthKey,
        waBusURL,
        waBusIntId,
        waBusAppId,
        waBusSourceNo,
        templates,
        selected,
        pipelines,
      })
        .then((resp) => {
          // receive return success response
          if (resp.data == 'whatsapp message sent') {
            this._snackBar.open('WhatsApp message sent!', '', {
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          // console.log(err);
          this._snackBar.open('Error occured!', '', {
            duration: 2000,
          });
        });
    }
  }
  // trigger send sms cloud function from card
  triggerSms(templates, custFiltered) {
    let selectedArray: Customer[] = [];
    selectedArray.push(custFiltered);
    this.triggerSmsfn(templates, selectedArray);
  }
  // trigger send sms cloud function from table
  triggerSmsfn(templates, selected: Customer[]) {
    // show a daily limit reached message if daily limit for allowed plan reached,
    //  else send SMS
    if (selected.length + this.smsCount > this.userPlan.bulkSmsLimit) {
      this.dialog.open(ConfirmationpopupComponent, {
        width: '400px',
        data: {
          smode: 'countExceeded',
          remaining: this.userPlan.bulkSmsLimit - this.smsCount,
        },
      });
    } else {
      if (this.selection.selected.length > 0) {
        this.selection.clear(); //clear select of table
      }
      // data to send along
      const superUserDetails = this.superUserDetails;
      const smsApiUserName = this.superUserDetails.smsApiUserName;
      const smsApiPwd = this.superUserDetails.smsApiPwd;
      const smsApiSenderId = this.superUserDetails.smsApiSenderId;
      const smsApiEntityId = this.superUserDetails.smsApiEntityId;
      const allSubUsers = this.allSubUsers;
      const pipelines = this.customerPipelines;

      // call cloud function
      const smsCallable = firebase.default
        .functions()
        .httpsCallable('callableSendSMS');
      smsCallable({
        allSubUsers,
        superUserDetails,
        smsApiUserName,
        smsApiPwd,
        smsApiSenderId,
        smsApiEntityId,
        templates,
        selected,
        pipelines,
      })
        .then((resp) => {
          // receive return success response
          if (resp.data == 'SMS send') {
            this._snackBar.open('SMS sent!', '', {
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          // console.log(err);
          this._snackBar.open('Error occured!', '', {
            duration: 2000,
          });
        });
    }
  }
  // trigger send email cloud function from card
  triggerEmail(templates, custFiltered) {
    let selectedArray: Customer[] = [];
    selectedArray.push(custFiltered);
    this.triggerEmailfn(templates, selectedArray);
  }
  // trigger send email cloud function from table
  triggerEmailfn(templates, selected: Customer[]) {
    // if smtp settings are of type personal mail, we are not providing bulk mail options
    // else send whatsapp
    if (selected.length > 1 && this.smtpSettings.type !== 'mailService') {
      this.dialog.open(ConfirmationpopupComponent, {
        width: '400px',
        data: {
          smode: 'personalMail',
        },
      });
    } else {
      // show a daily limit reached message if daily limit for allowed plan reached,
      //  else send email
      if (selected.length + this.emailCount > this.userPlan.bulkEmailLimit) {
        this.dialog.open(ConfirmationpopupComponent, {
          width: '400px',
          data: {
            smode: 'countExceeded',
            remaining: this.userPlan.bulkEmailLimit - this.emailCount,
          },
        });
      } else {
        if (this.selection.selected.length > 0) {
          this.selection.clear(); //clear select of table
        }
        // data to send along
        const superUserDetails = this.superUserDetails;
        const superUserId = this.superUserId;
        const allSubUsers = this.allSubUsers;
        const loggedInUser = this.userDetails.email;
        const pipelines = this.customerPipelines;
        // call cloud function
        const emailCallable = firebase.default
          .functions()
          .httpsCallable('callableSendEmail');
        emailCallable({
          superUserDetails,
          superUserId,
          allSubUsers,
          templates,
          selected,
          loggedInUser,
          pipelines,
        })
          .then((resp) => {
            // receive return success response
            if (resp.data == 'Email sent') {
              this._snackBar.open('Email sent!', '', {
                duration: 2000,
              });
            }
          })
          .catch((err) => {
            this._snackBar.open('Error occured!', '', {
              duration: 2000,
            });
          });
      }
    }
  }
  // customer edit
  editCustomer(customerData) {
    this.commonService.updateCustomerToEdit(customerData);
    this.dialog.open(Addcontactpopup1Component, {
      panelClass: 'custom-dialog-container',
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: {
        id: customerData.id,
        scenario: 'edit',
      },
    });
  }

  getFieldValue(field, data) {
    this.getFieldValueCalls++;
    return this.commonService.getFieldValue(field, data,modules.customers);
  }

  getFieldValueSort(field, data) {
    return this.commonService.getFieldValueSort(field, data);
  }

  //Function to open the card content custmization popup
  customizeCardContent(module) {
    this.dialogRef = this.dialog.open(CardSettingsComponent, {
      data: ['customer', this.cardFields, this.customFieldContacts],
      width: '600px',
    });
  }

  //Function to open the popup to edit views
  editView(mode) {
    //call the popup for card field customization
    this.dialogRef = this.dialog.open(ViewBuilderComponent, {
      data: [
        'customers',
        this.commonListDataService.customerViewId,
        mode,
        this.cardFields,
      ],
      width: 'auto',
    });
    this.dialogRef.afterClosed().subscribe((res) => {
      // Receive data from dialog component
      // If new view has been added, then read the new view and load data
      if (res.response == 'Add') {
        this.commonListDataService.customerViewId =
          this.viewSettingArray.length - 1;
        this.viewSettingSelected =
          this.viewSettingArray[this.commonListDataService.customerViewId];
        this.commonListDataService.cusomerListDataLoaded = false;
        this.getViewData();
        this.selection.clear(); //clear select of table
      } else {
        this.selection.clear(); //clear select of table
        this.commonListDataService.cusomerListDataLoaded = false;
        this.viewSettingSelected =
          this.viewSettingArray[this.commonListDataService.customerViewId];
      }
    });
  }
  //delete view
  deleteView() {
    let dialogref = this.dialog.open(ConfirmationpopupComponent, {
      width: '400px',
      data: {
        smode: 'delete_view',
        viewName:
          this.viewSettingArray[this.commonListDataService.customerViewId]
            .viewName,
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res == 'deleted') {
        // if delete clicked delete the view from viewsetting array and if view number is greater than 0 then minius 1 to view number and update view
        this.viewSettingArray.splice(
          this.commonListDataService.customerViewId,
          1
        );
        if (this.commonListDataService.customerViewId > 0) {
          this.commonListDataService.customerViewId =
            this.commonListDataService.customerViewId - 1;
        }
        this.selection.clear(); //clear select of table
        this.commonListDataService.cusomerListDataLoaded = false;
        this.viewServiceService
          .onSaveView(this.userId, this.viewSettingArray, 'customers')
          .then((res) => {
            this._snackBar.open('View has been deleted', '', {
              duration: 2000,
            });
          });
      }
    });
  }
  // go to uplad data as CSV route
  routeUpload() {
    this.router.navigate(['dash/upload-customer-excel']);
  }
  initStageCollapseArray() {
    this.stageCollapseArray = [];
    this.custListStatus.forEach((element) => {
      this.stageCollapseArray.push(false);
    });
  }
  // if filter view changed
  viewChanged(viewIndex) {
    this.commonListDataService.customerViewId = viewIndex;
    this.viewSettingSelected =
      this.viewSettingArray[this.commonListDataService.customerViewId]; // particular view selected
    this.alertPopupStatus = false; // popup status set as false to open poup if next view contains deletd add field
    this.commonListDataService.cusomerListDataLoaded = false;
    this.getViewData();
    this.getNoOfRecords();
    this.selection.clear(); //clear select of table
  }
  // filter status age and id
  getStatusAndAgeFn() {
    if (this.commonListDataService.selectedCustPipeline !== 'All Pipelines') {
      var result = this.customerPipelines.filter((obj) => {
        return (
          obj.pipelineId === this.commonListDataService.selectedCustPipeline
        );
      });
      const statusArray = result[0].pipelineStages.map(({ stageId, age }) => ({
        stageId,
        age,
      }));
      this.custListArray = statusArray;
      this.custListStatus = statusArray.map(({ stageId }) => {
        return stageId;
      });

      this.custStatusAge = statusArray.map(({ age }) => {
        return age;
      });
      this.initStageCollapseArray();
    }
  }
  // function for pipeline changed
  pipelineChangedEvent() {
    if (this.commonListDataService.selectedCustPipeline == 'All Pipelines') {
      this.commonListDataService.pipelineCustomerSelection = 'All Pipelines';
    }
    this.CustomerTableDataArray.data = this.resetDateArray.data;
    this.getStatusAndAgeFn();
    this.filterDataByPipelines(this.commonListDataService.selectedCustPipeline);
    if (this.secondaryFilterSet == true) {
      this.secondaryFilter(
        this.secondaryFilterField,
        this.secondaryFilterValue
      );
    }

    if (this.sortOrderSet == true) {
      this.setSortOrder(this.sortOrder);
    }
    //If any custom sorting by order was active, reapply the filter to make sure that filter does not get reset automatically on subscription update

    if (this.sortCardFieldSet == true) {
      this.sortCardField(this.sortBy);
    }
    this.noOfStages = this.custListStatus.length - 1;
    this.getNoOfRecords();
    this.selection.clear(); //clear select of table
  }
  //function to filter the data when pipeline is changed
  viewPipelineChanged() {
    this.CustomerTableDataArray.data = this.resetDateArray.data;

    this.filterDataByPipelines(this.commonListDataService.selectedCustPipeline);

    if (this.secondaryFilterSet == true) {
      this.secondaryFilter(
        this.secondaryFilterField,
        this.secondaryFilterValue
      );
    }

    if (this.sortOrderSet == true) {
      this.setSortOrder(this.sortOrder);
    }
    //If any custom sorting by order was active, reapply the filter to make sure that filter does not get reset automatically on subscription update

    if (this.sortCardFieldSet == true) {
      this.sortCardField(this.sortBy);
    }
    this.noOfStages = this.custListStatus.length - 1;
    this.getNoOfRecords();
    this.selection.clear(); //clear select of table
  }

  //Function for checking whether a record is in progress, converted and lost and returning CSS classes
  stageInPipeline(i) {
    if (i <= this.noOfStages - 2) {
      return {
        border: 'border-primary',
        text: 'text-primary',
        badge: 'bg-soft-primary',
        background: 'bg-soft-primary',
      };
    } else if (i == this.noOfStages - 1) {
      return {
        border: 'border-success',
        text: 'text-success',
        badge: 'bg-soft-success',
        background: 'bg-soft-success',
      };
    } else {
      return {
        border: 'border-danger',
        text: 'text-danger',
        badge: 'bg-soft-danger',
        background: 'bg-soft-danger',
      };
    }
  }
  // stage hide in grid view
  hideStage(i) {
    this.stageCollapseArray[i] = !this.stageCollapseArray[i];
  }
  ngAfterViewInit() {}
  //Function to get the number of records for selected view and pipeline
  getNoOfRecords() {
    this.noOfCustinViewPipeline = this.customerData.length;
    if (this.commonListDataService.selectedCustPipeline != 'All Pipelines') {
      this.noOfCustinViewPipeline = this.customerData.filter(
        (data) =>
          data.selectedContactPipeline ===
          this.commonListDataService.selectedCustPipeline
      ).length;
    }
  }

  // cdk drag and drop data in list view
  getFilteredData(docData, stage) {
    this.getFilteredDataCalls++;
    if (docData) {
      if (this.commonService.userPlan.multiPipelineAccess) {
        const pipelineSel = docData.filter(
          (data) =>
            data.selectedContactPipeline ===
            this.commonListDataService.selectedCustPipeline

        );
        const dataCust = pipelineSel.filter((data) => data.status === stage);

        return dataCust;
      } else {
        const dataCust = docData.filter((data) => data.status === stage);
        return dataCust;
      }
    }
  }
  // cdk drag and drop status in list view
  getFilteredStatus(docData, stage) {
    let dataCustStatus = docData.filter((data) => data != stage);
    return dataCustStatus;
  }

  // customer list - drag and drop
  drop(event: CdkDragDrop<Customer[]>) {
    let datePlaced = new Date().getTime();
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      let cust = event.item.data.id;
      // if drag and drop to lost column, need to show popup to enter reason for rejection
      // if reason for rejection disaply is checked
      if (
        this.contactSettings.rejectionReasonVal?.display === true &&
        event.container.id ===
          this.custListStatus[this.custListStatus.length - 1]
      ) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        let changeLogParams = {
          constructorName: this.constructor.name,
          userId: this.userId,
          userName: this.userName,
          prevStatus: this.commonService.getStatusName(
            'customers',
            this.commonListDataService.selectedCustPipeline,
            event.previousContainer.id
          ),
          curStatus: this.commonService.getStatusName(
            'customers',
            this.commonListDataService.selectedCustPipeline,
            event.container.id
          ),
          changeLog:
            event.previousContainer.data[event.previousIndex].changeLog,
        };

        dialogConfig.data = {
          userId: this.superUserId,
          custId: cust,
          status: event.container.id, // new status applied
          fieldNameContact: this.fieldNameContact,
          custStatus: this.custListArray, //Customer status array defined in the super user profile
          custDataStatus: event.previousContainer.id, //Current customer status prior to update
          custDataStageHistory:
            event.previousContainer.data[event.previousIndex].stageHistory,
          changeLogParams: changeLogParams,
          rejectionReasonArr:
            this.contactSettings?.rejectionReason?.rejectionReason?.split(','), //reason for rejection options array
          rejectionReasonMandatory:
            this.contactSettings.rejectionReasonVal?.mandatory, //reason for rejection options mandatory check
          rejectionReasonDisplay:
            this.contactSettings.rejectionReasonVal?.display, //whether to display/not reason for rejection
          disableReAssign: this.disableEditContact,
          pipelineId: this.commonListDataService.selectedCustPipeline,
          statusName: this.commonService.getStatusName(
            'customers',
            this.commonListDataService.selectedCustPipeline,
            event.container.id
          ),
        };

        const dialogRef = this.dialog.open(
          ChangecuststatdialogComponent,
          dialogConfig
        );
      } else {
        //Update the status of the customer which has been dropped to new stage in front end
        // so that delay updating db doesnot cause the card to jump back to previous stage and then get updated
        let i = 0;
        for (i = 0; i < this.customerData.length; i++) {
          if (this.customerData[i].id == cust) {
            this.customerData[i].status = event.container.id;
            //MK-19/11/22 - Commenting out updation of customer data table - implementation seems to be wrong
            // this.customersArray.data[i].status = event.container.id;
            // this.CustomerTableDataArray.data[i].status = event.container.id;
            // this.resetDateArray.data[i].status = event.container.id;
            break;
          }
        }
        let currentHistory =
          event.item.data.stageHistory;
        let stageValues: StageHistoryModel = {
          date: null,
          stageId: null,
          pipelineId: null,
        };
        stageValues.date = datePlaced;
        stageValues.stageId = event.container.id;
        stageValues.pipelineId =
          this.commonListDataService.selectedCustPipeline;
        if (event.item.data.stageHistory) {
          currentHistory.push(stageValues);
          this.stageHistories = currentHistory;
        } else {
          this.stageHistories = [stageValues];
        }
       let inPipeline = false;
       let  won = false;
       let lost = false;
        if (
          event.container.id ===
          this.custListStatus[this.custListStatus.length - 1]
        ) {
          lost = true;
          won = false;
          inPipeline = false;
        } else if (
          event.container.id ===
          this.custListStatus[this.custListStatus.length - 2]
        ) {
          lost = false;
          won = true;
          inPipeline = false;
        } else {
          lost = false;
          won = false;
          inPipeline = true;
        }
        this.customerlistService.onUpdateCustomer(
          this.superUserId,
          cust,
          event.container.id,
          this.stageHistories,
          datePlaced,
          inPipeline,
          won,
          lost,
          '',
          ChangeLogComponent.saveLog(
            this.constructor.name,
            this.userId,
            this.userName,
            { status: this.commonService.getStatusName(
              'customers',
              this.commonListDataService.selectedCustPipeline,
              event.previousContainer.id
            ) },
            { status: this.commonService.getStatusName(
              'customers',
              this.commonListDataService.selectedCustPipeline,
              event.container.id
            ) },
            this.customerData[i].changeLog
          )
        );
      }
    }
  }

  // to toggle between list and table view, to select list
  onToggle() {
    this.selection.clear(); //clear select of table
    this.commonListDataService.customerView = 'grid';
    if (this.commonListDataService.selectedCustPipeline === 'All Pipelines'
    || this.commonListDataService.pipelineCustomerSelection === 'All Pipelines') {
      this.commonListDataService.selectedCustPipeline =
        this.customerPipelines[0].pipelineId;
      this.commonListDataService.pipelineCustomerSelection =
        this.commonService.getPipelineNames(
          'customers',
          this.commonListDataService.selectedCustPipeline
        );
      this.pipelineChangedEvent();
    }
  }
  // to toggle between list and table view, to select table
  onToggleTab() {
    this.commonListDataService.customerView = 'table';
  }
  // reset filter function
  resetFilter() {
    this.selection.clear(); //clear select of table
    this.secondaryFilterSet = false;
    this.agedFilterSet = false;
    this.CustomerTableDataArray.data = this.resetDateArray.data;
    this.customerData = this.resetDateArray.data;
    this.customersArray.data = this.resetDateArray.data;
    this.viewPipelineChanged();
  }
  // delete contact from actions button after selecting contacts
  onDeleteContact(selected: Customer[]) {
    let custListArrayString: string;
    custListArrayString = JSON.stringify(selected);
    let userId = this.superUserId;
    selected.length = 0;
    this.selection = new SelectionModel<Customer>(true, []);
    const dialogRef = this.dialog.open(DeleteContactsComponent, {
      panelClass: 'custom-dialog-container',
      width: '400px',
      minHeight: '100px',
      height: 'auto',
      disableClose: true,
      data: {
        custListArrayString,
        userId,
        fieldNameContact: this.fieldNameContact,
        fieldNameSale: this.fieldNameSale,
        fieldNameService: this.fieldNameService,
        fieldNameInvoice: this.fieldNameInvoice,
        fieldNameExpense: this.fieldNameExpense,
        fieldNameCollection: this.fieldNameCollection,
        fieldNameTask: this.fieldNameTask,
        fieldNameFollowup: this.fieldNameFollowup,
        plan: this.plan,
      },
    });
  }
  // bulk pipeline and status update function
  updatePipelineAndStatus(selected) {
    const dialogRef = this.dialog.open(ChildCustomerlist, {
      width: '300px',
      disableClose: true,
      minHeight: '100px',
      height: 'auto',
      data: {
        selected,
        customerPipelines: this.customerPipelines,
        superUserId: this.superUserId,
        userId: this.userId,
        userName: this.userName,
        fieldNameContact: this.fieldNameContact,
        pipelineFieldName:
          this.contactSettings.selectedContactPipeline.displayName,
        statusFieldName: this.contactSettings.status.displayName,
        rejectionReasonName: this.contactSettings.rejectionReasonVal
          ?.displayName
          ? this.contactSettings.rejectionReasonVal?.displayName
          : 'Reason for rejection',
        rejectionReasonArr:
          this.contactSettings?.rejectionReason?.rejectionReason?.split(','), //reason for rejection options array
        rejectionReasonMandatory:
          this.contactSettings.rejectionReasonVal.mandatory, //reason for rejection options mandatory check
        rejectionReasonDisplay: this.contactSettings.rejectionReasonVal.display, //whether to display/not reason for rejection
      },
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        this.selection.clear();
      });
  }
  // reassign contact to subuser
  onSubUserAssigned(selected, subUserId, firstName, secondName, branchId) {
    let custListArrayString: string;
    let userType: string;
    if (subUserId === this.superUserId) {
      userType = 'Main User';
    } else {
      userType = 'Sub User';
    }

    custListArrayString = JSON.stringify(selected);
    let assignedToName =''
    if (secondName != null) {
      assignedToName = firstName + ' ' + secondName;
    } else {
      assignedToName = firstName;
    }

    let userId = this.superUserId;
    if (this.selection.selected.length > 0) {
      this.selection.clear(); //clear select of table
    }
    selected.length = 0;
    this.selection = new SelectionModel<Customer>(true, []);
    const dialogRef = this.dialog.open(ReAssignSaleComponent, {
      width: '500px',
      disableClose: true,
      minHeight: '100px',
      height: 'auto',
      data: {
        userId,
        subUserId,
        assignedToName,
        custListArrayString,
        userType,
        fieldNameSale: this.fieldNameSale,
        fieldNameService: this.fieldNameService,
        fieldNameContact: this.fieldNameContact,
        fieldNameTask: this.fieldNameTask,
        fieldNameFollowup: this.fieldNameFollowup,
        fieldNameEstimate: this.fieldNameEstimate,
        fieldNameQuotation: this.fieldNameQuotation,
        fieldNameInvoice: this.fieldNameInvoice,
        branchId: branchId,
        branches: this.branches,
        status: this.lastStatusOption,
      },
    });
  }
  // network check
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }

  // on destroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.commonServiceUserSubscription?.unsubscribe();
    this.customerSubscription?.unsubscribe();
  }

  trackbyCustList(index: number, custFiltered: Customer): string {
    return custFiltered.id;
  }
  // for getting the aged contact
  getAgedStatus(element) {
    // if age activation is there
    if (this.actCustAgeing) {
      let today: Date = new Date();
      let input: Date;
      if (element.stageHistory.length > 0) {
        input = new Date(
          element.stageHistory[element.stageHistory.length - 1].date
        );
      } else {
        input = new Date(element.dateCreated);
      }
      let daysinStage: number = Math.ceil(
        (today.getTime() - input.getTime()) / (1000 * 3600 * 24)
      ); //Calculate the number of days in current stage

      let maxDaysinStage = 0;
      let statusArray = [];
      let statusObj;

      const pipeLine = this.customerPipelines.filter((obj) => {
        return obj.pipelineId === element.selectedContactPipeline;
      });
      // pipeline deleted case
      if (pipeLine.length === 0) {
        return 'N/A';
      } else {
        statusArray = pipeLine[0].pipelineStages;
        // if no status array found
        if (statusArray.length === 0) {
          return 'N/A';
        } else {
          statusObj = statusArray.filter((obj) => {
            return obj.stageId === element.status;
          });
          // status deleted case
          if (statusObj.length === 0) {
            return 'N/A';
          } else {
            maxDaysinStage = statusObj[0].age;

            if (
              element.status === statusArray[statusArray.length - 1].stageId ||
              element.status === statusArray[statusArray.length - 2].stageId
            ) {
              return false;
            } else {
              if (daysinStage >= maxDaysinStage) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      }
    } else {
      return false;
    }
  }

  // add new sale from customer
  onAddSale(custId) {
    if (this.commonService.addDocLimitaion.addSaleDisable) {
      this._snackBar.open('Sale limit expired for this month!', '', {
        duration: 2000,
      });
    } else {
      this.dialog.open(Addnewsale1Component, {
        width: '800px',
        height: 'auto',
        disableClose: true,
        data: { scenario: 'createfromCustomer', id: custId },
      });
    }
  }
  // create service
  onAddService(custId) {
    this.dialog.open(CrudServiceComponent, {
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: { scenario: 'createfromCustomer', id: custId },
    });
  }

  // add task
  addTask(custId, orgId, cname, fname, sname, surname) {
    this.dialog.open(CrudModal1Component, {
      width: '520px',
      height: 'auto',
      disableClose: true,
      data: {
        cid: custId,
        orgId: orgId,
        mode: 'custCreate',
        company: cname,
        firstName: fname,
        secondName: sname,
        surname: surname,
      },
    });
  }
  // create followupos in web
  onCreateFollowUps(
    custId,
    cname,
    fname,
    sname,
    assignedTo,
    assignedToName,
    orgId,
    surname,
    custData
  ) {
    let customerName;
    if (sname && surname) {
      // if second name & surname is there
      customerName = fname + ' ' + sname + ' ' + surname;
    } else if (sname && !surname) {
      customerName = fname + ' ' + sname;
    } else if (!sname && surname) {
      customerName = fname + ' ' + surname;
    } else {
      customerName = fname;
    }
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: custId,
        companyNames: cname,
        customerNames: customerName,
        contactNumber: custData.contactNo ? custData.contactNo : '', // pass customer number
        countryCode: custData.code ? custData.code : '', // pass customer country code
        assignedTo: assignedTo,
        assignedToName: assignedToName,
        scenario: 'create',
        subUsers: this.subUsers,
        fname: this.userFirstName,
        lastname: this.userSecondName,
        orgId: orgId,
      },
    });
  }
  // filter by assgigned to me or created by
  onUserFilter(evt: MouseEvent, scenario): void {
    const target = new ElementRef(evt.currentTarget);
    const dialogRef = this.dialog.open(SelectSearchComponent, {
      panelClass: 'dialog-side-panel',
      data: {
        trigger: target,
        placeHolderText: 'Users',
        allSubUsers: this.allSubUsers,
      },
    });
    // on submit clicked
    const dialogSubmitSubscription =
      dialogRef.componentInstance.submitClicked.subscribe((userId: string) => {
        dialogSubmitSubscription.unsubscribe();
        if (userId) {
          this.secondaryFilter(scenario, userId);
          this.selection.clear(); //clear select of table
        }
        this.changeDetectorRef.detectChanges();
      });
  }
  // on outgoing call
  onCall(custData) {
    if (
      this.enableOutboundCallsViaCallBridging &&
      custData?.contactNo &&
      this.userNumber
    ) {
      let customerName;
      if (custData.secondName && custData.surname) {
        // if second name & surname is there
        customerName =
          custData.firstName +
          ' ' +
          custData.secondName +
          ' ' +
          custData.surname;
      } else if (custData.secondName && !custData.surname) {
        customerName = custData.firstName + ' ' + custData.secondName;
      } else if (!custData.secondName && custData.surname) {
        customerName = custData.firstName + ' ' + custData.surname;
      } else {
        customerName = custData.firstName;
      }

      let minute = new Date().getMinutes();
      let hour = new Date().getHours();
      let startTime = hour + ':' + minute;
      this.commonService
        .onAutoCall(
          this.userNumber,
          custData.contactNo,
          this.superUserId,
          this.userId,
          this.userName,
          custData.companyName,
          custData.id,
          customerName,
          startTime,
          null,
          this.autoCallToken,
          this.DIDNumber,
          custData.orgId ? custData.orgId : '',
          custData.associatedBranch ? custData.associatedBranch : 'none',
          this.callBridgingExtension,
          this.outboundCallBridgingType,
          null,
          null,
          null,
          null
        )
        .subscribe((data: any) => {});
      this._snackBar.open('Initiating Call', '', {
        duration: 2000,
      });
    }
    else {
      if(!this.userNumber){
        this._snackBar.open("The user's contact number is not configured.", '', {
          duration: 2000,
        });
      }
    }
  }
  // for adding notes in customer
  addNotes(custFiltered, GAevent) {
    let firstName = custFiltered.firstName ? custFiltered.firstName : '';
    let secondName = custFiltered.secondName
      ? ' ' + custFiltered.secondName
      : '';
    let surname = custFiltered.surname ? ' ' + custFiltered.surname : '';
    let customerName = firstName + secondName + surname;

    this.dialog.open(ConfirmationpopupComponent, {
      width: '800px',
      disableClose: true,
      data: {
        smode: 'createnote',
        customerId: custFiltered.id,
        changeLog: custFiltered.changeLog,
        GAevent: GAevent,
        superUserId: this.superUserId,
        userId: this.userId,
        userName: this.userName,
        fieldNameContactNotes: this.fieldNameContactNotes,
        fieldNameContact: this.fieldNameContact,
        customerName: customerName,
      },
    });
  }
}

@Component({
  selector: 'child-customerlist',
  templateUrl: 'child-customerlist.html',
  styleUrls: ['./customerlist.component.scss'],
})
export class ChildCustomerlist {
  scenario = 'statusUpdate'; //scenario of child component called
  spinner = false; //spinner to show while reassigning
  count = 0; //for reassign, no is stored in this variable
  selectedPipeline: number; //selected pipekine id is stored
  pipelines: Pipelines[] = []; //customer pipelines under superuser
  statusArray: PipelineStages[] = []; //status arrya corresponding to selevcted [pipeline]
  form: FormGroup; //reactive form to select pipelinr and status
  inPipeline: boolean; //in pipeline boolean variable if status is not won/lost
  won: boolean; //won boolean variable if status is won
  lost: boolean; //lost boolean if status is lost
  stageValues: StageHistoryModel = {
    date: null,
    stageId: null,
    pipelineId: null,
  }; //stage history to save to DB
  formData = {
    pipelineId: null,
    statusId: '',
    rejectionReason: ''
  } //formData initialisation

  constructor(
    public dialogRef: MatDialogRef<ChildCustomerlist>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snack: MatSnackBar,
    private serviceInst: CustomerlistService,
    public commonService: CommonService,
    private fb: FormBuilder,
  ) {
    this.pipelines = data.customerPipelines;

    this.form = this.fb.group({
      pipeline: [this.formData.pipelineId, Validators.required],
      status: [this.formData.statusId, Validators.required],
      rejectionReasonVal: [this.formData.rejectionReason],
    });
  }

  // cancel fn
  onNoClick(): void {
    this.dialogRef.close();
  }
  // pipeline selected function
  pipelineChangedEvent(pipelineId) {
    this.selectedPipeline = pipelineId;
    this.statusArray = this.commonService.getStatusArray(
      modules.customers,
      this.selectedPipeline
    );
    this.form.controls.status.setValue(this.statusArray[0].stageId);
  }
  // status selected function
  statusSelectedEvent(statusId) {
    var result = this.statusArray.filter((obj) => {
      return obj.stageId === statusId;
    });
    const statusObj = result[0];
    if (
      this.data.rejectionReasonMandatory === true &&
      statusObj === this.statusArray[this.statusArray.length - 1]
    ) {
      this.form.controls['rejectionReasonVal'].setValidators(
        Validators.required
      );
    } else {
      this.form.controls['rejectionReasonVal'].clearValidators();
      this.form.controls['rejectionReasonVal'].setValue('');
    }
  }
  // function when update is selected
  updateFn() {
    this.spinner = true;
    for (let i = 0; i < this.data.selected.length; i++)  {
      // stage history
      let currentHistory = this.data.selected[i].stageHistory;
      this.stageValues.date = new Date().getTime();
      this.stageValues.stageId = this.form.value.status;
      this.stageValues.pipelineId = this.form.value.pipeline;
      currentHistory.push(this.stageValues);
      const stageHistory = currentHistory;
      // changeLog, inPipeline, won, lost
      let changeLogParams = {
        constructorName: 'CustomerlistComponent',
        userId: this.data.userId,
        userName: this.data.userName,
        prevPipeline: this.commonService.getPipelineNames(
          modules.customers,
          this.data.selected[i].selectedContactPipeline
        ),
        curPipeline: this.commonService.getPipelineNames(
          modules.customers,
          this.form.value.pipeline
        ),
        prevStatus: this.commonService.getStatusName(
          modules.customers,
          this.data.selected[i].selectedContactPipeline,
          this.data.selected[i].status
        ),
        curStatus: this.commonService.getStatusName(
          modules.customers,
          this.form.value.pipeline,
          this.form.value.status
        ),
        changeLog: this.data.selected[i].changeLog,
      };
      let prevObj;
      let currObj;
      if (
        this.form.value.status ===
        this.statusArray[this.statusArray.length - 1].stageId
      ) {
        this.lost = true;
        this.won = false;
        this.inPipeline = false;
        if (changeLogParams.prevPipeline !== changeLogParams.curPipeline) {
          prevObj = {
            selectedContactPipeline: changeLogParams.prevPipeline,
            status: changeLogParams.prevStatus,
            rejectionReasonVal: this.data.selected[i].rejectionReasonValue
              ? this.data.selected[i].rejectionReasonValue
              : '',
          };
          currObj = {
            selectedContactPipeline: changeLogParams.curPipeline,
            status: changeLogParams.curStatus,
            rejectionReasonVal: this.form.value.rejectionReasonVal,
          };
        } else if (changeLogParams.prevStatus !== changeLogParams.curStatus) {
          prevObj = {
            status: changeLogParams.prevStatus,
            rejectionReasonVal: '',
          };
          currObj = {
            status: changeLogParams.curStatus,
            rejectionReasonVal: this.form.value.rejectionReasonVal,
          };
        }
      } else if (
        this.form.value.status ===
        this.statusArray[this.statusArray.length - 2].stageId
      ) {
        this.lost = false;
        this.won = true;
        this.inPipeline = false;
        if (changeLogParams.prevPipeline !== changeLogParams.curPipeline) {
          prevObj = {
            selectedContactPipeline: changeLogParams.prevPipeline,
            status: changeLogParams.prevStatus,
          };
          currObj = {
            selectedContactPipeline: changeLogParams.curPipeline,
            status: changeLogParams.curStatus,
          };
        } else if (changeLogParams.prevStatus !== changeLogParams.curStatus) {
          prevObj = {
            status: changeLogParams.prevStatus,
          };
          currObj = {
            status: changeLogParams.curStatus,
          };
        }
      } else {
        this.lost = false;
        this.won = false;
        this.inPipeline = true;
        if (changeLogParams.prevPipeline !== changeLogParams.curPipeline) {
          prevObj = {
            selectedContactPipeline: changeLogParams.prevPipeline,
            status: changeLogParams.prevStatus,
          };
          currObj = {
            selectedContactPipeline: changeLogParams.curPipeline,
            status: changeLogParams.curStatus,
          };
        } else if (changeLogParams.prevStatus !== changeLogParams.curStatus) {
          prevObj = {
            status: changeLogParams.prevStatus,
          };
          currObj = {
            status: changeLogParams.curStatus,
          };
        }
      }

      if (
        changeLogParams.prevPipeline === changeLogParams.curPipeline &&
        changeLogParams.prevStatus === changeLogParams.curStatus
      ) {
        // no updation if no change in pipeline/status
        this.count++;
        if (this.count == this.data.selected.length) {
          this.dialogRef.close();

          // mat snack bar
          this.snack.open('Successfully updated', '', {
            duration: 2000,
          });
        }
      } else {
        this.serviceInst
          .updatePipelineAndStatus(
            this.data.superUserId,
            this.data.selected[i].id,
            this.form.value.pipeline,
            this.form.value.status,
            stageHistory,
            this.inPipeline,
            this.won,
            this.lost,
            this.form.value.status ===
              this.statusArray[this.statusArray.length - 1].stageId
              ? this.form.value.rejectionReasonVal
              : '',
            ChangeLogComponent.saveLog(
              changeLogParams.constructorName,
              changeLogParams.userId,
              changeLogParams.userName,
              prevObj,
              currObj,
              changeLogParams.changeLog
            )
          )
          .then((resp) => {
            this.count++;
            if (this.count == this.data.selected.length) {
              this.dialogRef.close();

              // mat snack bar
              this.snack.open('Successfully updated', '', {
                duration: 2000,
              });
            }
          });
      }
    }
  }
}
