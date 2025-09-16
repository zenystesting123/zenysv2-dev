/*-----------------------------------------------
  Description : Custom common table
  Input :userId, columns, dataList, dataListCopy, userNamesArray,pipelineNames, userIdsArray, displayName, tableName,
  disableEdit, customFields, subUsers, superUserFirstName,superUserSecondName, actAgeing,statusPipeline, statusAge,selection , accountType, fieldCustomsettings,
tableDefaultData,contactSettings,saleTitleSettings,serviceTitleSettings,disableDownload,disableSale ,disableService ,
disableFoll,disableCreateNote,disableEditContact ,disableEditSale ,disableEditService,
disableDocCreateEst ,disableDocCreateQuot ,disableDocCreateInv,whatsAppTemplates,smsTemplates,emailTemplates,emailEnabled,
  ---------------------------------------------------------------- */
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Addcontactpopup1Component } from 'src/app/addcontactpopup1/addcontactpopup1.component';
import { Addnewsale1Component } from 'src/app/addnewsale1/addnewsale1.component';
import { CommonService } from 'src/app/common.service';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { CrudServiceComponent } from 'src/app/crud-service/crud-service.component';
import {
  Branch,
  Customer,
  customFields,
  DisplayColumn,
  messageTemplateModel,
  modules,
  MsgCountModel,
  ProductModel,
  Profile,
  Sales,
  SubUsers,
} from 'src/app/data-models';
import { Expenses1Component } from 'src/app/expenses1/expenses1.component';
import { FollowupTaskCreateComponent } from 'src/app/followup-task-create/followup-task-create.component';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { Paymentreceipt1Component } from 'src/app/paymentreceipt1/paymentreceipt1.component';
import { emailTemplateModel } from 'src/app/settings/email-template-settings/email-template.model';
import { CrudModal1Component } from 'src/app/taskboard/crud-modal1/crud-modal1.component';
import { CustomTableSettingsComponent } from '../custom-table-settings/custom-table-settings.component';
import { CustomReportTableService } from './custom-report-table.service';
import * as firebase from 'firebase';
import { Pipelines } from 'src/app/model/pipeline.modal';
import { ChildCustomReportTableComponent } from '../child-custom-report-table/child-custom-report-table.component';
@Component({
  selector: 'app-custom-report-table',
  templateUrl: './custom-report-table.component.html',
  styleUrls: ['./custom-report-table.component.scss'],
})
export class CustomReportTableComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() userId: string; // current user id
  @Input() columns: DisplayColumn[] = []; // all columns
  @Input() dataList: any[] = []; // data to be displayed in the table
  @Input() dataListCopy: MatTableDataSource<any>; // data to be displayed in the table
  @Input() userNamesArray: any[] = []; //array of user names including super user based on data access rule = All/ Own/ Team
  @Input() pipelineNames: any = []; // pipeline names for contact or sale
  @Input() userIdsArray: any[] = []; //array of user Ids including super user based on data access rule = All/ Own/ Team
  @Input() displayName: string; // field name for storing table
  @Input() tableName: string; // table name
  @Input() disableEdit: boolean = false; // check for if edit is disabled
  @Input() customFields: customFields[] = []; // ustom filed for table
  @Input() subUsers: SubUsers[] = []; // subusers list
  @Input() superUserFirstName: string; // super user first name
  @Input() superUserSecondName: string; // super user second name
  @Input() actAgeing: boolean = false; // check for is ageing is activated
  @Input() statusPipeline: String[] = []; // customer pipeline
  @Input() statusAge: any = []; // age number
  @Input() selection = new SelectionModel<Customer>(true, []); // for selection checkbox
  @Input() accountType: string; // account type
  @Input() fieldCustomsettings: any; // custom field name setting
  @Input() tableDefaultData: any[]; // default data for table
  @Input() contactSettings: any; // custom field name setting for contact
  @Input() saleTitleSettings: any; // custom field name setting for contact
  @Input() serviceTitleSettings: any; // custom field name setting for contact
  @Input() disableDownload: boolean = false; //whether download is disabled/not
  @Input() disableSale = false; // sale add access
  @Input() disableService = false; //service add access
  @Input() disableFoll = false; //followUp add access
  @Input() disableCreateNote = false; //variable to control if notes addition is permitted
  @Input() disableEditContact = false; //control if edit contact is possible
  @Input() disableEditSale = false; //control if edit sale is possible
  @Input() disableEditService = false; //control if edit service is possible
  @Input() disableDocCreateEst = false; //control if est create is possible
  @Input() disableDocCreateQuot = false; //control if quot create is possible
  @Input() disableDocCreateInv = false; //control if inv create is possible
  @Input() whatsAppTemplates: messageTemplateModel[] = []; //to hold the fetrched whatsapp message templates
  @Input() smsTemplates: messageTemplateModel[] = []; //to hold the fetrched sms message templates
  @Input() emailTemplates: emailTemplateModel[] = []; //to hold the fetrched email templates
  @Input() emailEnabled = false; //SMTP settings of email completed
  @Input() inputFieldNameFollowup: string = 'FollowUp'; // fieldname followup
  @Input() inputFieldNameNotes: string = 'Note'; // fieldname notes
  @Input() tableFrom: string = ''; // table From scenario
  @Output() onTableSettingsEvent = new EventEmitter<DisplayColumn[]>();
  displayedColumns = []; // for getting the selcted column
  isLoaded: boolean = false; // for showing loader
  branches: Branch[]; // list of branches
  superUserId = ''; //supr user id of logged in user
  superUserDetails: Profile = null; //super user details of logged in user
  userEmail = ''; //logged in users email
  userName = ''; //logged in users full name
  userFirstName = ''; //logged in users firstname
  userSecondName = ''; //logged in users sec name
  userNumber = ''; //logged in users number
  autoCallToken: string = ''; // token for auocall authentication
  DIDNumber: string = ''; // did number for autocall
  smsEnabled = false; //SMS settings saved user
  waEnabled = false; //WhatsApp settings saved user
  smsCount = 0; //if daily sms send limit exceeded
  waCount = 0; //if daily wa send limit exceeded
  emailCount = 0; //if daily email send limit exceeded to update in UI
  allSubUsers = []; //all subusers array under this superuser
  // custom field names
  fieldNameFollowup: string = 'FollowUp';
  fieldNameContactNotes: string = 'Note';
  fieldNameTask: string = 'Task';
  fieldNameContact: string = 'Contact';
  fieldNameSale: string = 'Sale';
  fieldNameService: string = 'Support';
  fieldNameEstimate: string = 'Estimate';
  fieldNameQuotation: string = 'Quotation';
  fieldNameInvoice: string = 'Invoice';
  fieldNameItems: string = 'Products and Service'; //custom field names

  enableOutboundCallsViaCallBridging: boolean = false; //for checking autocall enabled or not
  callBridgingServiceProvider = ''; // auto call service provider name
  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.

  callBridgingExtension: any; // voxbay caller extension
  outboundCallBridgingType:any = ''; // voxbay call type
  customerPipelines: Pipelines[] = []; // customer pipeline list
  servicePipelines: Pipelines[] = []; // service pipeline list
  salePipelines: Pipelines[] = []; // sale pipeline list

  constructor(
    public datepipe: DatePipe,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    public commonService: CommonService,
    public networkCheck: NetworkCheckService,
    private serviceInstance: CustomReportTableService
  ) {
    this.branches = this.commonService.branches;
    this.dataListCopy = new MatTableDataSource([]);
  }
  ngOnInit(): void {
    // to get superuserid and superuser details saved in common service
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        this.superUserId = allData.userDetails.superUserId;
        this.superUserDetails = allData.superUserDetails;
        this.allSubUsers = this.commonService.createUserlist('All', 'any')[1];
        this.customerPipelines = JSON.parse(JSON.stringify(allData.customerPipelines));
        this.servicePipelines = JSON.parse(JSON.stringify(allData.servicePipelines));
        this.salePipelines = JSON.parse(JSON.stringify(allData.salePipelines));
        this.userNumber = allData.userDetails.phone;
        if (allData.userDetails.firstname)
          this.userFirstName = allData.userDetails.firstname;
        if (allData.userDetails.lastname)
          this.userSecondName = allData.userDetails.lastname;
        this.userEmail = allData.userDetails.email;
        this.userName =
          allData.userDetails.firstname +
          ' ' +
          (allData.userDetails.lastname ? allData.userDetails.lastname : '');

        if (allData.superUserDetails.enableOutboundCallsViaCallBridging) {
          this.enableOutboundCallsViaCallBridging =
            allData.superUserDetails.enableOutboundCallsViaCallBridging;
        }
        if (allData.superUserDetails.outboundCallType) {
          this.outboundCallBridgingType = allData.superUserDetails.outboundCallType;
        }
        if (allData.superUserDetails.autoCallToken) {
          this.autoCallToken = allData.superUserDetails.autoCallToken;
        }
        if (allData.superUserDetails.DIDNumber) {
          this.DIDNumber = allData.superUserDetails.DIDNumber;
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
        // check for sms credentials, and plan permissions to enable sms sending
        if (
          (!!allData.superUserDetails.smsApiEntityId ||
            !!allData.superUserDetails.smsApiSenderId) &&
          this.commonService.userPlan.messageTemplates
        ) {
          this.smsEnabled = true;
        }
        // check for whatsapp credentials and plan permissions to enable whatsapp msg sending
        if (
          !!allData.superUserDetails.waBusURL &&
          this.commonService.userPlan.messageTemplates
        ) {
          this.waEnabled = true;
        }

        if (this.superUserDetails.fieldNames) {
          this.fieldNameContact =
            this.superUserDetails.fieldNames.fieldNameContact;
          this.fieldNameSale = this.superUserDetails.fieldNames.fieldNameSale;
          this.fieldNameService =
            this.superUserDetails.fieldNames.fieldNameService;
          this.fieldNameTask = this.superUserDetails.fieldNames.fieldNameTask;
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
            this.fieldNameItems = this.superUserDetails.fieldNames.fieldNameItems;
        }
        // email count check from todays bulkMails count
        this.serviceInstance
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
        // get todays already sent sms, whatsapp, email counts
        this.serviceInstance
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
            // let sumEmail = 0;
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
      });
  }
  ngOnChanges(changes: SimpleChanges) {
    this.dataListCopy.data = this.dataList;
    this.columns = this.columns;
    this.configureTable(); // configure table datas
  }
  //search on table
  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListCopy.filter = filterValue.trim().toLowerCase();
    if (this.dataListCopy.paginator) {
      this.dataListCopy.paginator.firstPage();
    }
  }
  ngAfterViewInit() {
    this.dataListCopy.paginator = this.paginator; //for pagination
    this.dataListCopy.sort = this.sort; //for pagination
  }
  //open the dialog to customize the table fields
  onTableSettings() {
    let col = this.columns.map((obj) => ({
      ...obj,
    }));
    const dialogRef = this.dialog.open(CustomTableSettingsComponent, {
      data: {
        columndata: col,
        userId: this.userId,
        displayName: this.displayName,
        customFields: this.customFields,
      },
      disableClose: true,
      width: '600px',
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if(result && this.tableFrom =='lite mode customer'){
        this.columns = result.displayCustomerColumns;
        this.onTableSettingsEvent.emit(this.columns);
        this.configureTable();
      }
      else if(result && this.tableFrom =='lite mode sale'){
        this.columns = result.displaySaleColumns;
        this.onTableSettingsEvent.emit(this.columns);
        this.configureTable();
      }
      else if(result && this.tableFrom =='lite mode service'){
        this.columns = result.displayServiceColumns;
        this.onTableSettingsEvent.emit(this.columns);
        this.configureTable();
      }
    })
  }
  configureTable() {
    this.isLoaded = false;
    //removing additional field if it is removed from settings
    this.customFields?.forEach((element, index) => {
      if (!element.isActive) {
        for (var i = this.columns?.length - 1; i >= 0; i--) {
          if (
            this.columns[i]?.fieldType == 'Additional' &&
            this.columns[i]?.columnDef == element.fieldName &&
            this.columns[i]?.ind == index
          ) {
            this.columns?.splice(i, 1);
          }
        }
      }
    });
    /*check and add the custom fields if not present*/
    this.customFields?.forEach((element, index) => {
      if (element.isActive) {
        let field = this.customFields[index].fieldName;
        let fieldPresent = false;
        this.columns.forEach((col) => {
          if (
            col.ind == index &&
            col.fieldType == 'Additional' &&
            (col.columnDef != element.fieldName ||
              col.header != element.fieldName)
          ) {
            col.columnDef = element.fieldName;
            col.header = element.fieldName;
          }
          if (col.columnDef == field) {
            fieldPresent = true;
          }
        });
        if (fieldPresent == false) {
          this.columns.push({
            columnDef: this.customFields[index].fieldName,
            header: this.customFields[index].fieldName,
            display: false,
            type: this.customFields[index].fieldType,
            fieldType: 'Additional',
            ind: index,
          });
        }
      }
    });
    let colmn = this.columns.map((obj) => ({
      ...obj,
    }));
    let datalist = this.dataListCopy.data.map((obj) => ({
      ...obj,
    }));
    datalist.forEach((element) => {
      if (element.assignedTo) {
        element.assignedToName = this.commonService.getAssignedToName(
          element.assignedTo
        );
      }

      colmn.forEach((ele) => {
        if (ele.fieldType == 'Additional') {
          let key = ele.columnDef;
          let val: any;
          try {
            val = element.additionalFieldsArr[ele.ind]?.fieldValue;
          } catch {
            val = '';
          }
          element[`${key}`] = val;
        }
      });
    });
    this.dataListCopy.data = datalist;
    // for handling any new fields added in data model
    let filteredColumns = []; //temp array for storing the columns that are to be displayed
    let object1Names = this.tableDefaultData.map((obj) => obj.columnDef); // for caching the result
    let objectNames = this.columns.map((obj) => obj.columnDef); // for caching the result
    object1Names.filter((ele) => {
      if (!objectNames?.includes(ele)) {
        this.tableDefaultData.filter((data) => {
          if (data.columnDef === ele) {
            this.columns.push(data);
            return;
          }
        });
      }
    });

    // for handling the fieldname customization and remove column if it is unchecked in fieldname settings
    for (var i = this.columns.length - 1; i >= 0; i--) {
      // for handling custom field names and removing field which are not displaying
      if (this.fieldCustomsettings) {
        Object.keys(this.fieldCustomsettings).forEach((ele) => {

          if (this.columns[i]?.columnDef == ele) {
            this.columns[i].header =
              this.fieldCustomsettings[`${ele}`].displayName;
            if (!this.fieldCustomsettings[`${ele}`].display) {
              this.columns.splice(i, 1); // removing the column
            }
          }
          // for handling the folowup customer name becuase here fullname is stored
          if (ele == 'customerControl') {
            if (
              this.columns[i]?.columnDef == 'customerName' &&
              this.tableName == 'Followup'
            ) {
              this.columns[i].header =
                this.fieldCustomsettings[`${ele}`].displayName;
            }
          }
        });
      }
      if (this.tableName == 'Sale' && this.contactSettings) {
        // based on contact feild name setting of customer number / alt contact number show/hide column
        if (this.columns[i]?.columnDef == 'contactNumber') {
          let ele = 'contactNo'
          this.columns[i].header =
            this.contactSettings[ele].displayName;
          if (!this.contactSettings[`${ele}`].display) {
            this.columns.splice(i, 1); // removing the column
          }
        } else if (this.columns[i]?.columnDef == 'altContactNumber') {
          let ele = 'alternateContactNumber'
          this.columns[i].header =
            this.contactSettings[ele].displayName;
          if (!this.contactSettings[`${ele}`].display) {
            this.columns.splice(i, 1); // removing the column
          }
        }
      }
      if (this.tableName == 'Service' && this.contactSettings) {
        // based on contact feild name setting of customer number / alt contact number show/hide column
        if (this.columns[i]?.columnDef == 'contactNumber') {
          let ele = 'contactNo'
          this.columns[i].header =
            this.contactSettings[ele].displayName;
          if (!this.contactSettings[`${ele}`].display) {
            this.columns.splice(i, 1); // removing the column
          }
        } else if (this.columns[i]?.columnDef == 'altContactNumber') {
          let ele = 'alternateContactNumber'
          this.columns[i].header =
            this.contactSettings[ele].displayName;
          if (!this.contactSettings[`${ele}`].display) {
            this.columns.splice(i, 1); // removing the column
          }
        }
      }
      // for setting the contact field headers
      if (this.contactSettings) {
        if (
          this.columns[i]?.columnDef == 'firstName' ||
          this.columns[i]?.columnDef == 'fname1' ||
          this.columns[i]?.columnDef == 'customerFirstName' ||
          this.columns[i]?.columnDef == 'customerName' ||
          this.columns[i]?.columnDef == 'name'
        ) {
          if (this.tableName != 'Followup') {
            this.columns[i].header =
              this.contactSettings[`${'firstName'}`].displayName;
          }
        }
        if (
          this.columns[i]?.columnDef == 'lastName' ||
          this.columns[i]?.columnDef == 'secondName' ||
          this.columns[i]?.columnDef == 'customerSecondName' ||
          this.columns[i]?.columnDef == 'sname'
        ) {
          this.columns[i].header =
            this.contactSettings[`${'secondName'}`].displayName;
        }
        if (this.columns[i]?.columnDef == 'salutation') {
          this.columns[i].header =
            this.contactSettings[`${'salutation'}`].displayName;
        }
        if (this.columns[i]?.columnDef == 'surname') {
          this.columns[i].header =
            this.contactSettings[`${'surname'}`].displayName;
        }
        if (
          this.columns[i]?.columnDef == 'companyName' ||
          this.columns[i]?.columnDef == 'customerCompany' ||
          this.columns[i]?.columnDef == 'company'
        ) {
          this.columns[i].header =
            this.contactSettings[`${'companyName'}`].displayName;
        }
        if (
          this.columns[i]?.columnDef == 'contactNumber' &&
          this.tableName == 'Followup'
        ) {
          this.columns[i].header =
            this.contactSettings[`${'contactNo'}`].displayName;
        }
      }
      // for setting the sale field headers
      if (this.saleTitleSettings) {
        if (this.columns[i]?.columnDef == 'saleTitle') {
          this.columns[i].header = this.saleTitleSettings.displayName;
        }
      }
      // for setting the service field headers
      if (this.serviceTitleSettings) {
        if (this.columns[i]?.columnDef == 'serviceTitle') {
          this.columns[i].header = this.serviceTitleSettings.displayName;
        }
      }
      // for changing the header by custom field name
      if (this.columns[i]?.columnDef == 'lastNoteDate') {
        this.columns[i].header = 'Last ' + this.inputFieldNameNotes + ' Date';
      } else if (this.columns[i]?.columnDef == 'lastAddedNote') {
        this.columns[i].header = 'Last ' + this.inputFieldNameNotes;
      } else if (this.columns[i]?.columnDef == 'nextFollowupDate') {
        this.columns[i].header =
          'Next ' + this.inputFieldNameFollowup + ' Date';
      } else if (this.columns[i]?.columnDef == 'previousFollowupDate') {
        this.columns[i].header =
          'Previous ' + this.inputFieldNameFollowup + ' Date';
      }
    }

    this.columns.forEach((col) => {
      if (col.display == true) {
        filteredColumns.push(col);
      }
    });

    // for customer table, we are not checking superuser/subuser , select option is available
    // as for other tables-sale/supp/org, add superuser condition and add select column
    if (
      this.tableName === 'Customer' ||
      (this.tableName == 'Sale') ||
      (this.tableName == 'Service') ||
      (this.tableName == 'Organization') ||
      (this.tableName == 'Followup') ||
      (this.tableName == 'Task')
    ) {
      // for adding the check box as first column
      filteredColumns.splice(0, 0, {
        columnDef: 'select',
        header: 'select',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0,
      });
    }
    // actions column adding to customer table at index 1
    if (
      this.tableName === 'Customer' ||
      (this.accountType == 'SuperUser' && this.tableName == 'Sale') ||
      (this.accountType == 'SuperUser' && this.tableName == 'Service')
    ) {
      filteredColumns.splice(1, 0, {
        columnDef: 'actions',
        header: 'actions',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0,
      });
    } else if (
      (this.accountType != 'SuperUser' && this.tableName == 'Sale') ||
      (this.accountType != 'SuperUser' && this.tableName == 'Service')|| this.tableName === 'Products'
    ) {
      filteredColumns.splice(0, 0, {
        columnDef: 'actions',
        header: 'actions',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0,
      });
    }
    this.displayedColumns = filteredColumns.map((c) => c.columnDef);
    this.isLoaded = true;
  }
  // row click for edit popup / navigate to edit page
  onRowClick(row) {
    if (this.tableName == 'Invoice') {
      this.router.navigate(['/dash/document/Invoice', row.id]);
    } else if (this.tableName == 'Estimate') {
      this.router.navigate(['/dash/document/Estimate', row.id]);
    } else if (this.tableName == 'Quotation') {
      this.router.navigate(['/dash/document/Quotation', row.id]);
    } else if (this.tableName == 'Collection') {
      if (!this.disableEdit) {
        this.commonService.updatePaymentToEdit(row);
        this.dialog.open(Paymentreceipt1Component, {
          width: '700px',
          height: 'auto',
          disableClose: true,
          data: {
            saleId: row.saleid,
            customerId: row.customerId,
            mode: 'update',
            paymentId: row.id,
            customerName: row.customerSecondName
              ? row.customerName + ' ' + row.customerSecondName
              : row.customerName,
            orgId: row.orgId,
            company: row.customerCompany,
            saleTitle: row.saleTitle,
            componentName: this.constructor.name,
          },
        });
      } else {
        this.snackBar.open('Access Denied', '', {
          duration: 2000,
        });
      }
    } else if (this.tableName == 'Expense') {
      if (!this.disableEdit) {
        this.commonService.updateExpenseToEdit(row);
        this.dialog.open(Expenses1Component, {
          width: '600px',
          height: 'auto',
          disableClose: true,
          data: {
            mode: 'update',
            expenseId: row.id,
            componentName: this.constructor.name,
          },
        });
      } else {
        this.snackBar.open('Access Denied', '', {
          duration: 2000,
        });
      }
    } else if (this.tableName == 'Followup') {
      if (!this.disableEdit) {
        this.onEditFollowUps(row);
      } else {
        this.snackBar.open('Access Denied', '', {
          duration: 2000,
        });
      }
    } else if (this.tableName == 'Task') {
      this.onEditTask(row);
    } else if (this.tableName == 'Customer') {
      this.router.navigate(['dash/contact/customerdetails/' + row.id]);
    } else if (this.tableName == 'Organization') {
      this.router.navigate(['dash/organisation/orgdetails/' + row.id]);
    } else if (this.tableName == 'Sale') {
      this.router.navigate(['dash/sales/saleview/' + row.id]);
    } else if (this.tableName == 'Service') {
      this.router.navigate(['dash/service/service-details/' + row.id]);
    }
  }
  // find the colum value
  findColumnValue(element: any, column: any) {
    if (this.isLoaded) {
      let cellValue: any;

      if(column.columnDef === 'category'){
        cellValue = element['prodCategory'];
      }else if(column.columnDef === 'productName'){
        cellValue = element['prodName'];
      }else if(column.columnDef === 'units'){
        cellValue = element['unit'];
      }else if(column.columnDef === 'description'){
        cellValue = element['prodDes'];
      } else{
        cellValue = element[column.columnDef];
      }

      //function to display the values in each cell of the table
      if (column.type == 'date') {
        if (typeof cellValue === 'number') {
          //if the date is stored as normal number and not timestamp
          try {
            return this.datepipe.transform(new Date(cellValue), 'dd-MM-yyyy');
          } catch {
            return '';
          }
        } else {
          //If the field type is in timestamp, then convert to date format
          let dateTemp = cellValue;
          try {
            //to hanndle cases where data is not presenet

            return this.datepipe.transform(
              new Date(dateTemp.seconds * 1000),
              'dd-MM-yyyy'
            );
          } catch {
            //if data is not present return empty string
            return '';
          }
        }
      } else if (column.type == 'date_time') {
        if (typeof cellValue === 'number') {
          //if the date is stored as normal number and not timestamp
          try {
            return this.datepipe.transform(new Date(cellValue), 'dd-MM-yyyy');
          } catch {
            return '';
          }
        } else {
          if (
            column.columnDef != 'nextFollowupDate' &&
            column.columnDef != 'previousFollowupDate'
          ) {
            //If the field type is in timestamp, then convert to date format
            let dateTemp = cellValue;
            try {
              //to hanndle cases where data is not presenet

              return this.datepipe.transform(
                new Date(dateTemp.seconds * 1000),
                'dd-MM-yyyy hh:mm a'
              );
            } catch {
              //if data is not present return empty string
              return '';
            }
          } else if (
            column.columnDef == 'nextFollowupDate' &&
            this.tableName == 'Customer'
          ) {
            // for displaying date with time
            //If the field type is in timestamp, then convert to date format
            let dateTemp = cellValue;
            try {
              //to hanndle cases where data is not presenet
              let nextFollowupTime = element.nextFollowupTime
                ? this.commonService.transformTo12Hour(element.nextFollowupTime)
                : '';
              return (
                this.datepipe.transform(
                  new Date(dateTemp.seconds * 1000),
                  'dd-MM-yyyy'
                ) +
                ' ' +
                nextFollowupTime
              );
            } catch {
              //if data is not present return empty string
              return '';
            }
          } else if (
            column.columnDef == 'previousFollowupDate' &&
            this.tableName == 'Customer'
          ) {
            // for displaying date with time
            //If the field type is in timestamp, then convert to date format
            let dateTemp = cellValue;
            try {
              //to hanndle cases where data is not presenet

              let previousFollowupTime = element.previousFollowupTime
                ? this.commonService.transformTo12Hour(
                    element.previousFollowupTime
                  )
                : '';
              return (
                this.datepipe.transform(
                  new Date(dateTemp.seconds * 1000),
                  'dd-MM-yyyy'
                ) +
                ' ' +
                previousFollowupTime
              );
            } catch {
              //if data is not present return empty string
              return '';
            }
          }
        }
      }
      if (column.type == 'boolean') {
        if (cellValue == true) {
          return 'Yes';
        } else {
          return 'No';
        }
      } else if (
        column.columnDef == 'createdBy' ||
        column.columnDef == 'createdById'
      ) {
        return this.userNamesArray[this.userIdsArray.indexOf(cellValue)]; //Get the name corresponding to the Id
      } else if (column.columnDef == 'selectedContactPipeline') {
        // return this.pipelineNames[cellValue];
        return this.commonService.getPipelineNames(
          'customers',
          element.selectedContactPipeline
        );
        //If field is pipeline
      } else if (column.columnDef == 'selectedServPipeline') {
        // return this.pipelineNames[cellValue];
        return this.commonService.getPipelineNames(
          modules.services,
          element.selectedServPipeline
        );
        //If field is pipeline
      } else if (column.columnDef == 'selectedSalePipeline') {
        return this.commonService.getPipelineNames(
          modules.sales,
          element.selectedSalePipeline
        );
        //If field is pipeline
      } else if (column.columnDef == 'associatedBranch') {
        const pos = this.branches.map((e) => e.id).indexOf(cellValue);

        try {
          return this.branches[pos].name;
        } catch {
          return 'NA';
        }
      } else if (
        column.columnDef == 'contactNumber' &&
        this.tableName == 'Followup'
      ) {
        let countryCode = element.countryCode ? element.countryCode : '';
        let contactNumber = element[column.columnDef]
          ? element[column.columnDef]
          : '';
        return countryCode + ' ' + contactNumber;
        //If field is pipeline
      }
      else if(column.columnDef == 'contactNumber' && this.tableName=='Sale'){
        let countryCode =element.countryCode ? element.countryCode:'';
        let contactNumber =element.contactNumber ? element.contactNumber:'';
        return countryCode+' '+contactNumber;
      }
      else if(column.columnDef == 'altContactNumber' && this.tableName=='Sale'){
        let altCountryCode =element.altCountryCode ? element.altCountryCode:'';
        let altContactNumber =element.altContactNumber ? element.altContactNumber:'';
        return altCountryCode+' '+altContactNumber;
      }
      else if(column.columnDef == 'contactNumber' && this.tableName=='Service'){
        let countryCode =element.countryCode ? element.countryCode: '';
        let contactNumber =element.contactNumber ? element.contactNumber:  '';
        return countryCode+' '+contactNumber;
      }
      else if(column.columnDef == 'altContactNumber' && this.tableName=='Service'){
        let altCountryCode =element.altCountryCode ? element.altCountryCode:  '';
        let altContactNumber =element.altContactNumber ? element.altContactNumber:  '';
        return altCountryCode+' '+altContactNumber;
      }
      else if (
        column.columnDef === 'status' &&
        this.tableName === 'Customer'
      ) {
        return this.commonService.getStatusName(
          'customers',
          element.selectedContactPipeline,
          element.status
        );
      } else if (column.columnDef === 'servicesStage') {
        return this.commonService.getStatusName(
          modules.services,
          element.selectedServPipeline,
          element.servicesStage
        );
      } else if (column.columnDef === 'salesStage') {
        return this.commonService.getStatusName(
          modules.sales,
          element.selectedSalePipeline,
          element.salesStage
        );
      } else {
        //get the value stored in the corresponding field
        try {
          return cellValue; // this needs to be replaced with string literals
        } catch {
          return '';
        }
      }
    }
  }
  //if cvs has no data
  noDataMessage() {
    this.snackBar.open('No data to download', '', {
      duration: 2000,
    });
  }
  //open edit followup popup
  onEditFollowUps(followUpData) {
    followUpData.id,
      followUpData.customerId,
      followUpData.companyName,
      followUpData.customerName,
      (this.commonService.followUpDetails = followUpData);
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: followUpData.customerId, // pass customer id
        companyNames: followUpData.companyName, // pass company name
        customerNames: followUpData.customerName, // pass customer name
        contactNumber: followUpData.contactNumber
          ? followUpData.contactNumber
          : '', // pass customer number
        countryCode: followUpData.countryCode ? followUpData.countryCode : '', // pass customer country code
        scenario: 'edit', // scenario for followup popup
        followUpId: followUpData.id, // pass task id
        subUsers: this.subUsers, // pass sub user list
        fname: this.superUserFirstName, // pass super user first name
        lastname: this.superUserSecondName, // pass super user second name
        editFrom: 'table', // pass from  which part the popup is open
      },
    });
  }
  //open edit task popup
  onEditTask(task) {
    this.commonService.updateTaskToEdit(task);
    const dialogRef = this.dialog.open(CrudModal1Component, {
      width: '1060px',
      height: 'auto',
      disableClose: true,
      data: {
        id: task.id,
        mode: 'update',
      },
    });
  }
  // for getting the aged contact
  getAgedStatus(element, scenario) {
    // if age activation is there
    if (this.actAgeing) {
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
      if (scenario == 'customer') {
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
                element.status ===
                  statusArray[statusArray.length - 1].stageId ||
                element.status === statusArray[statusArray.length - 2].stageId
              ) {
                return 'N/A';
              } else {
                if (daysinStage >= maxDaysinStage) {
                  return 'Yes';
                } else {
                  return 'No';
                }
              }
            }
          }
        }
      } else if (scenario == 'sale') {
        const pipeLine = this.salePipelines.filter((obj) => {
          return obj.pipelineId === element.selectedSalePipeline;
        });
        if (pipeLine.length === 0) {
          return 'N/A';
        } else {
          statusArray = pipeLine[0].pipelineStages;
          if (statusArray.length === 0) {
            return 'N/A';
          } else {
            if (
              element.salesStage ===
                statusArray[statusArray.length - 1].stageId ||
              element.salesStage === statusArray[statusArray.length - 2].stageId
            ) {
              // if statusis in last two status return false... ageging is not need for last two status
              return 'N/A';
            } else {
              statusObj = statusArray.filter((obj) => {
                return obj.stageId === element.salesStage;
              });
              if (statusObj.length === 0) {
                return 'N/A';
              } else {
                maxDaysinStage = statusObj[0].age;
                {
                  if (daysinStage >= maxDaysinStage) {
                    return 'Yes';
                  } else {
                    return 'No';
                  }
                }
              }
            }
          }
        }
      } else if (scenario == 'service') {
        const pipeLine = this.servicePipelines.filter((obj) => {
          return obj.pipelineId === element.selectedServPipeline;
        });
        if (pipeLine.length === 0) {
          return 'N/A';
        } else {
          statusArray = pipeLine[0].pipelineStages;
          if (statusArray.length === 0) {
            return 'N/A';
          } else {
            statusObj = statusArray.filter((obj) => {
              return obj.stageId === element.servicesStage;
            });
            if (statusObj.length === 0) {
              return 'N/A';
            } else {
              maxDaysinStage = statusObj[0].age;

              if (
                element.servicesStage ===
                  statusArray[statusArray.length - 1].stageId ||
                element.servicesStage ===
                  statusArray[statusArray.length - 2].stageId
              ) {
                // if statusis in last two status return false... ageging is not need for last two status
                return 'N/A';
              } else {
                if (daysinStage >= maxDaysinStage) {
                  return 'Yes';
                } else {
                  return 'No';
                }
              }
            }
          }
        }
      }
    } else {
      return 'N/A';
    }
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataListCopy.data.length;
    return numSelected == numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataListCopy.data.forEach((row) => this.selection.select(row));
  }

  // add new sale from customer fn
  onAddSale(custId) {
    this.selection.clear();
    if (this.commonService.addDocLimitaion.addSaleDisable) {
      this.snackBar.open('Sale limit expired for this month!', '', {
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

  // add service from customer function
  onAddService(custId) {
    this.selection.clear();
    this.dialog.open(CrudServiceComponent, {
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: { scenario: 'createfromCustomer', id: custId },
    });
  }

  // add task from customer fn
  addTask(
    custId,
    orgId,
    cname,
    fname,
    sname,
    surname,
    saleId,
    saleTitle,
    serviceId,
    serviceTitle
  ) {
    this.selection.clear();
    if (this.tableName === 'Customer') {
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
    } else if (this.tableName === 'Sale') {
      this.dialog.open(CrudModal1Component, {
        width: '520px',
        height: 'auto',
        disableClose: true,
        data: {
          sid: saleId,
          cid: custId,
          orgId: orgId,
          mode: 'saleCreate',
          company: cname,
          firstName: fname,
          secondName: sname,
          surname: surname,
          saleName: saleTitle,
        },
      });
    } else if (this.tableName === 'Service') {
      this.dialog.open(CrudModal1Component, {
        width: '520px',
        height: 'auto',
        disableClose: true,
        data: {
          sid: serviceId,
          cid: custId,
          orgId: orgId,
          mode: 'serviceCreate',
          company: cname,
          firstName: fname,
          secondName: sname,
          surname: surname,
          serviceName: serviceTitle,
        },
      });
    }
  }

  // customer notes adding function
  addNotes(custFiltered, GAevent) {
    this.selection.clear();
    let firstName = custFiltered.firstName ? custFiltered.firstName : '';
    let secondName = custFiltered.secondName
      ? ' ' + custFiltered.secondName
      : '';
    let surname = custFiltered.surname ? ' ' + custFiltered.surname : '';
    let customerName = firstName + secondName + surname;

    this.dialog.open(ConfirmationpopupComponent, {
      width: '800px',
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
  // create followups from customer fn
  onCreateFollowUps(
    custId,
    cname,
    fname,
    sname,
    assignedTo,
    assignedToName,
    orgId,
    surname,
    saleId,
    saleTitle,
    serviceId,
    serviceTitle,
    docData
  ) {
    this.selection.clear();
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
    if (this.tableName === 'Customer') {
      const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
        width: '700px',
        disableClose: true,
        data: {
          id: custId,
          companyNames: cname,
          customerNames: customerName,
          contactNumber: docData.contactNo ? docData.contactNo : '', // pass customer number
          countryCode: docData.code ? docData.code : '', // pass customer country code
          assignedTo: assignedTo,
          assignedToName: assignedToName,
          scenario: 'create',
          subUsers: this.subUsers,
          fname: this.userFirstName,
          lastname: this.userSecondName,
          orgId: orgId,
        },
      });
    } else if (this.tableName === 'Sale') {
      const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
        width: '700px',
        disableClose: true,
        data: {
          id: custId,
          companyNames: cname,
          customerNames: customerName,
          contactNumber: docData.contactNumber
            ? docData.contactNumber
            : '', // pass customer number
          countryCode: docData.countryCode ? docData.countryCode : '', // pass customer country code
          assignedTo: assignedTo,
          assignedToName: assignedToName,
          scenario: 'create from sale',
          subUsers: this.subUsers,
          fname: this.superUserDetails.firstname,
          lastname: this.superUserDetails.lastname,
          saleId: saleId,
          saleTitle: saleTitle,
          orgId: orgId,
        },
      });
    } else if (this.tableName === 'Service') {
      const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
        width: '700px',
        disableClose: true,
        data: {
          id: custId,
          companyNames: cname,
          customerNames: customerName,
          contactNumber: docData.contactNumber
            ? docData.contactNumber
            : '', // pass customer number
          countryCode: docData.countryCode ? docData.countryCode : '', // pass customer country code
          assignedTo: assignedTo,
          assignedToName: assignedToName,
          scenario: 'create from service',
          subUsers: this.subUsers,
          fname: this.superUserDetails.firstname,
          lastname: this.superUserDetails.lastname,
          serviceId: serviceId,
          serviceTitle: serviceTitle,
          orgId: orgId,
        },
      });
    }
  }

  // contact edit function
   editCustomer(row) {
    this.selection.clear();
    this.commonService.updateCustomerToEdit(row);
    this.dialog.open(Addcontactpopup1Component, {
      panelClass: 'custom-dialog-container',
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: {
        id: row.id,
        scenario: 'edit',
      },
    });
  }

  //call function
  onCall(custData) {
    this.selection.clear();
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
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data: any) => {});
      this.snackBar.open('Initiating Call', '', {
        duration: 2000,
      });
    }else {
      if(!this.userNumber){
        this.snackBar.open("The user's contact number is not configured.", '', {
          duration: 2000,
        });
      }
    }
  }

  // html body converts to plain text  function for whatsapp messaging
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

  // trigger send whatsapp cloud function for single user
  triggerWhatsapp(templates, custFiltered) {
    this.selection.clear();
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
  // trigger send whatsapp cloud function for multiple user
  triggerWhatsappfn(templates, selected: Customer[]) {
    // show a daily limit reached message if daily limit for allowed plan reached,
    //  else send whatsapp message
    if (
      selected.length + this.waCount >
      this.commonService.userPlan.bulkWaLimit
    ) {
      this.dialog.open(ConfirmationpopupComponent, {
        width: '400px',
        data: {
          smode: 'countExceeded',
          remaining: this.commonService.userPlan.bulkWaLimit - this.waCount,
        },
      });
    } else {
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
            this.snackBar.open('WhatsApp message sent!', '', {
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.snackBar.open('Error occured!', '', {
            duration: 2000,
          });
        });
    }
  }

  // trigger send sms cloud function for single user
  triggerSms(templates, custFiltered) {
    this.selection.clear();
    let selectedArray: Customer[] = [];
    selectedArray.push(custFiltered);
    this.triggerSmsfn(templates, selectedArray);
  }
  // trigger send sms cloud function for multiple user
  triggerSmsfn(templates, selected: Customer[]) {
    // show a daily limit reached message if daily limit for allowed plan reached,
    //  else send SMS
    if (
      selected.length + this.smsCount >
      this.commonService.userPlan.bulkSmsLimit
    ) {
      this.dialog.open(ConfirmationpopupComponent, {
        width: '400px',
        data: {
          smode: 'countExceeded',
          remaining: this.commonService.userPlan.bulkSmsLimit - this.smsCount,
        },
      });
    } else {
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
            this.snackBar.open('SMS sent!', '', {
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.snackBar.open('Error occured!', '', {
            duration: 2000,
          });
        });
    }
  }

  // trigger send email cloud function for single user
  triggerEmail(templates, custFiltered) {
    this.selection.clear();
    let selectedArray: Customer[] = [];
    selectedArray.push(custFiltered);
    this.triggerEmailfn(templates, selectedArray);
  }
  // trigger send email cloud function for multiple user
  triggerEmailfn(templates, selected: Customer[]) {
    // show a daily limit reached message if daily limit for allowed plan reached,
    //  else send email
    if (
      selected.length + this.emailCount >
      this.commonService.userPlan.bulkEmailLimit
    ) {
      this.dialog.open(ConfirmationpopupComponent, {
        width: '400px',
        data: {
          smode: 'countExceeded',
          remaining:
            this.commonService.userPlan.bulkEmailLimit - this.emailCount,
        },
      });
    } else {
      // data to send along
      const superUserDetails = this.superUserDetails;
      const superUserId = this.superUserId;
      const allSubUsers = this.allSubUsers;
      const loggedInUser = this.userEmail;
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
            this.snackBar.open('Email sent!', '', {
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.snackBar.open('Error occured!', '', {
            duration: 2000,
          });
        });
    }
  }

  editProduct(product){
    this.commonService.updateProductToEdit(product);
    this.dialog.open(ChildCustomReportTableComponent, {
      width: '800px',
      disableClose: true,
      data: {
        scenario: 'edit',
        taxType: this.superUserDetails.taxType,
        fieldNameItems: this.fieldNameItems,
        fieldNameItemsCategory: this.fieldCustomsettings.category.displayName,
        arrayProductcategories: this.superUserDetails.productCategories,
        arrayProductUnits: this.superUserDetails.productUnits,
        productSettings: this.fieldCustomsettings,
        customFieldsProduct: this.customFields,
        superUserId: this.superUserId,
        itemMaxAllowed: this.superUserDetails.itemMaxAllowed
      },
    });
  }
  deleteProduct(product: ProductModel){
    const dialogRef = this.dialog.open(ChildCustomReportTableComponent, {
      data: {
        scenario: 'delete',
        productName: product.prodName,
        productId: product.id,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.serviceInstance.deleteProduct(this.superUserId, product.id);

          this.snackBar.open('Item deleted', '', {
            duration: 2000,
          });
        }
      });
  }
  // edit sale from actions buttons in sale table
   editSale(sale) {
    this.commonService.updateSaleToEdit(sale);
    this.dialog.open(Addnewsale1Component, {
      width: '800px',
      height: 'auto',
      disableClose: true,
      data: { scenario: 'edit', id: sale.id },
    });
  }
  // edit support fn from actions button in support table
   editService(service) {
    this.commonService.updateserviceToEdit(service);
    this.dialog.open(CrudServiceComponent, {
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: { scenario: 'edit', id: service.id },
    });
  }
  // create invoice-web
  createInvoice(saleId, customerId, orgId) {
    this.router.navigate([
      '/dash/document/documentinvoicemanagement/',
      saleId,
      'create',
      'Invoice',
      customerId ? customerId : 'none',
      orgId ? orgId : 'none',
      'none',
    ]);
  }
  // create estimate-web
  createEstimate(saleId, customerId, orgId) {
    this.router.navigate([
      '/dash/document/documentmanagement/',
      saleId,
      'create',
      'Estimate',
      customerId ? customerId : 'none',
      orgId ? orgId : 'none',
      'none',
    ]);
  }
  //create a quote for a paritcular sale ID
  createQuote(saleId, customerId, orgId) {
    this.router.navigate([
      '/dash/document/documentquotationmanagement/',
      saleId,
      'create',
      'Quotation',
      customerId ? customerId : 'none',
      orgId ? orgId : 'none',
      'none',
    ]);
  }
  // on destroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

