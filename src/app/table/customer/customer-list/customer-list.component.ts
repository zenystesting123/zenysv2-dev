/*********************************************************
 * Description : Customer lite mode component with grid view and table view, it comtaines grid view and table as child component
 *
 * ************************************************************************* */
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, combineLatest } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { TableService } from './table.service';
import { Branch, Customer, DisplayColumn, MsgCountModel, Profile, StageHistoryModel, SubUsers, contactSettings, defaultContactSettings, messageTemplateModel } from 'src/app/data-models';
import { Pipelines } from 'src/app/model/pipeline.modal';
import { CustomerListGridViewComponent } from '../customer-list-grid-view/customer-list-grid-view.component';
import { CustomerlistService } from 'src/app/contact/customerlist/customerlist.service';
import { take, takeUntil } from 'rxjs/operators';
import { CustomReportTableService } from 'src/app/custom-tables/custom-report-table/custom-report-table.service';
import { emailTemplateModel } from 'src/app/settings/email-template-settings/email-template.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Addcontactpopup1Component } from 'src/app/addcontactpopup1/addcontactpopup1.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import * as firebase from 'firebase';
import { FollowupTaskCreateComponent } from 'src/app/followup-task-create/followup-task-create.component';
import { CrudModal1Component } from 'src/app/taskboard/crud-modal1/crud-modal1.component';
import { CrudServiceComponent } from 'src/app/crud-service/crud-service.component';
import { Addnewsale1Component } from 'src/app/addnewsale1/addnewsale1.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangecuststatdialogComponent } from 'src/app/changecuststatdialog/changecuststatdialog.component';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { CustomerTableColumns } from 'src/app/model/custom-report.model';
import { CustomerTableColumnsInvPlan } from 'src/app/model/custom-report-invoicing.model';
import { CustomerTableColumnsLeadPlan } from 'src/app/model/custom-report-leadManagement.model';
import { SelectionModel } from '@angular/cdk/collections';
import { ReAssignSaleComponent } from 'src/app/contact/re-assign-sale/re-assign-sale.component';
import { DeleteContactsComponent } from 'src/app/contact/delete-contacts/delete-contacts.component';
import { CustomTableSettingsComponent } from 'src/app/custom-tables/custom-table-settings/custom-table-settings.component';
import { CustomerTableViewComponent } from '../customer-table-view/customer-table-view.component';
import { CardSettingsComponent } from 'src/app/card-settings/card-settings.component';
import { ChildCustomerlist } from 'src/app/contact/customerlist/customerlist.component';
import { CustomerGridService } from '../customer-grid/customer-grid.service';
import { CustomerGridComponent } from '../customer-grid/customer-grid.component';
import { LiteModeViewFilterComponent } from '../../lite-mode-view-filter/lite-mode-view-filter.component';
import { CustomViewSelectComponent } from '../custom-view-select/custom-view-select.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy ,AfterViewChecked{
  userId: string; // current user id
  superUserId: string; // super user id
  networkConnection: boolean; //to check network connection
  disableViewContact: boolean = false; //disable view contact
  disableEditContact: boolean = false; //disable edit contact
  disableReAssign: boolean = false; //disable reassign contact
  fieldNameContact: string = 'Contact';
  fieldNameOrganization = 'Organization';
  fieldNameContactNotes: string = 'Note';
  fieldNameFollowup: string = 'FollowUp';
  fieldNameTask: string = 'Task';
  fieldNameSale: string = 'Sale';
  fieldNameService: string = 'Support';
  fieldNameEstimate: string = 'Estimate';
  fieldNameQuotation: string = 'Quotation';
  fieldNameInvoice: string = 'Invoice';
  fieldNameExpense: string = 'Expense';
  fieldNameCollection: string = 'Collection';
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE; // custoer settigs configuration
  commonServiceUserSubscription: Subscription;
  cardFields: any[]; // card fields
  displayFields: any; // display card fields
  firstSetDataLoaded: boolean = false; // for calling the getData fn only once in oninit
  customerPipelines: Pipelines[] = []; // customer pipeline
  progressBarDisplay: boolean = false; // progress bar loader
  @ViewChildren(CustomerListGridViewComponent) childComponents: QueryList<CustomerListGridViewComponent>;
  @ViewChild(CustomerTableViewComponent) tableChild!: CustomerTableViewComponent;
  actCustAgeing: boolean = false; // check for is ageing is activated
  enableOutboundCallsViaCallBridging: boolean = false; //for checking autocall enabled or not
  userName = ''; //logged in users full name
  userNumber = ''; //logged in users number
  autoCallToken: string = ''; // token for auocall authentication
  DIDNumber: string = ''; // did number for autocall
  callBridgingServiceProvider = ''; // auto call service provider name
  outboundCallBridgingType: any = '';
  callBridgingExtension: any;
  private onDestroy$: Subject<void> = new Subject<void>();
  userEmail = ''; //logged in users email
  smsEnabled = false; //SMS settings saved user
  waEnabled = false; //WhatsApp settings saved user
  smsCount = 0; //if daily sms send limit exceeded
  waCount = 0; //if daily wa send limit exceeded
  emailCount = 0; //if daily email send limit exceeded to update in UI
  whatsAppTemplates: messageTemplateModel[] = []; //to hold the fetrched whatsapp message templates
  smsTemplates: messageTemplateModel[] = []; //to hold the fetrched sms message templates
  emailTemplates: emailTemplateModel[] = []; //to hold the fetrched email templates
  emailEnabled = false; //SMTP settings of email completed
  smtpSettings = null; //SMTP settings saved in DB
  superUserDetails: Profile = null; //super user details of logged in user
  subUsers: SubUsers[] = [];
  allSubUsers: any[] = [];
  userFirstName = ''; //logged in users firstname
  userSecondName = ''; //logged in users sec name
  disableSale = false; // disable sale create
  disableDownloadContact: boolean = false; //disable download contact
  disableDeleteContact: boolean = false; //disable delete contact
  disableService = false; // disable service create
  disableFoll = false; // disable followup create
  disableCreateNote = false; // disable Note creation
  accountType: string = ''; //accountType of logged in user
  customFieldContacts: any[]; // contact additional fields
  columnsDispaly = []; // table columns configuration
  userIdsArray: any[] = []; // users id
  userNamesArray: any[] = []; // users names
  branches: Branch[]; // list of branches
  tableDefaultData = CustomerTableColumns; // table columns configuration .used for adding new field which is added on modal
  selection = new SelectionModel<Customer>(true, []); // table selection
  reloadChildComponent: boolean = false; // for reloading grid view in default views
  reloadOldTableChildComponent: boolean = false; // for reloading grid view in custom filter views
  contactDataAccessRule:string; // contact access rule
  myViews: any = []; // list of created by me views
  publicViews: any = [];// list of publilc views

  @ViewChild(CustomerGridComponent) childComponent: CustomerGridComponent;
  constructor(public commonService: CommonService, private router: Router, private serviceInstance: CustomReportTableService,
    public networkCheck: NetworkCheckService, public tableService: TableService, private customerlistService: CustomerlistService,
    private snackBar: MatSnackBar, public dialog: MatDialog, private cdRef: ChangeDetectorRef
    , public customerGridService: CustomerGridService, private _snackBar: MatSnackBar,) {
    this.branches = this.commonService.branches;
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
 }
  ngOnInit(): void {
    let defaultViewset = true; // to block changinf the view if userdatas are changed
    this.commonServiceUserSubscription = this.commonService.userDatas.pipe(take(1)).subscribe(
      (allData) => {
       
        if (!allData.userDetails.enableLiteMode) {
        this.router.navigate(['dash/contact/customerlist']);
        } else {
        if (allData.usrProfileData) {
          // disable add contact and contact list view
          if (allData.usrProfileData.isCheckedCont == false) {
            this.disableDownloadContact = true;
            this.disableViewContact = true;
            this.disableEditContact = true;
            this.disableDeleteContact = true;
          } else {
            if (allData.usrProfileData.contactsDownload == false) {
              this.disableDownloadContact = true;
            }
            if (allData.usrProfileData.contactsView == false) {
              this.disableViewContact = true;
            }
            if (allData.usrProfileData.contactsEdit == false) {
              this.disableEditContact = true;
              this.disableReAssign = true;
            }
            if (allData.usrProfileData.contactReAssign == false) {
              this.disableReAssign = true;
            }
            if (allData.usrProfileData.contactsDelete == false) {
              this.disableDeleteContact = true;
            }
            // disable Sale
            if (allData.usrProfileData.isCheckedSale == false) {
              this.disableSale = true;
              this.commonService.addDocLimitaion.addSaleDisable = true;
            } else {
              if (allData.usrProfileData.salesCreate == false) {
                this.disableSale = true;
                this.commonService.addDocLimitaion.addSaleDisable = true;
              }
            }
            // disable services
            if (allData.usrProfileData.isCheckedService == false) {
              this.disableService = true;
            } else {
              if (allData.usrProfileData.servicesCreate == false) {
                this.disableService = true;
              }
            }

            // disable followups
            if (allData.usrProfileData.isCheckedFoll == false) {
              this.disableFoll = true;
            } else {
              if (allData.usrProfileData.follCreate == false) {
                this.disableFoll = true;
              }
            }
            // disable notes
            if (allData.usrProfileData.isCheckedNotes == false) {
              this.disableCreateNote = true;
            } else {
              if (allData.usrProfileData.notesCreate == false) {
                this.disableCreateNote = true;
              }
            }
          }
          this.contactDataAccessRule = allData.usrProfileData?.contactDataAccessRule? allData.usrProfileData?.contactDataAccessRule:"Own";
        }
        if (
          this.commonService.userPlan.contactAccess &&
          !this.disableViewContact
        ) {
          this.superUserDetails = allData.superUserDetails;
          this.userId = allData.userId;
         
          this.superUserId = allData.userDetails.superUserId;
          this.subUsers = allData.subUsers;
          const allSubUsers = this.commonService.createUserlist(
            'All',
            'any'
          )[1];
          this.getView();
          this.allSubUsers = allSubUsers.filter(function (e) {
            return e.status != 'suspended';
          });
          if (allData.superUserDetails.fieldNames) {
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
            this.fieldNameContactNotes = allData.superUserDetails.fieldNames
              .fieldNameContactNotes
              ? allData.superUserDetails.fieldNames.fieldNameContactNotes
              : 'Note';

            this.fieldNameOrganization = allData.superUserDetails.fieldNames
              .fieldNameOrganization
              ? allData.superUserDetails.fieldNames.fieldNameOrganization
              : 'Organization';

            this.fieldNameEstimate =
              allData.superUserDetails.fieldNames.fieldNameEstimate;
            this.fieldNameQuotation =
              allData.superUserDetails.fieldNames.fieldNameQuotation;
            this.fieldNameInvoice =
              allData.superUserDetails.fieldNames.fieldNameInvoice;
            this.fieldNameExpense =
              allData.superUserDetails.fieldNames.fieldNameExpense;
            this.fieldNameCollection =
              allData.superUserDetails.fieldNames.fieldNameCollection;
          }
          this.userEmail = allData.userDetails.email;
          this.userNumber = allData.userDetails.phone;
          if (allData.userDetails.firstname)
            this.userFirstName = allData.userDetails.firstname;
          if (allData.userDetails.lastname)
            this.userSecondName = allData.userDetails.lastname;
          if (allData.superUserDetails.actCustAgeing) {
            // check for customer ageing is activated
            this.actCustAgeing = allData.superUserDetails.actCustAgeing;
          }
          if (this.superUserId === this.userId) {
            if (allData.superUserDetails.extensionNumber) {
              this.callBridgingExtension = allData.superUserDetails.extensionNumber ? allData.superUserDetails.extensionNumber : '';
            }
          } else {
            const userObject = allData.subUsers.find(user => user.userId === this.userId)
            this.callBridgingExtension = userObject ? userObject.extensionNumber : null;
          }
          this.userName =
            allData.userDetails.firstname +
            ' ' +
            (allData.userDetails.lastname
              ? allData.userDetails.lastname
              : '');

          if (allData.superUserDetails.enableOutboundCallsViaCallBridging) {
            this.enableOutboundCallsViaCallBridging =
              allData.superUserDetails.enableOutboundCallsViaCallBridging;
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
          if (allData.superUserDetails.outboundCallType) {
            this.outboundCallBridgingType = allData.superUserDetails.outboundCallType;
          }
          //get customer setting configuration
          if (
            allData.superUserDetails.contactSettings &&
            typeof allData.superUserDetails.contactSettings !== 'undefined' &&
            allData.superUserDetails.contactSettings !== null
          ) {
            this.contactSettings = allData.superUserDetails.contactSettings;
          }
          //if there is multiple pipeline access, show all five pipelines else show single pipeline
          this.customerPipelines = [];
          this.customerPipelines = JSON.parse(
            JSON.stringify(allData.customerPipelines)
          );
          if (this.commonService.userPlan.multiPipelineAccess) {
            // do nothing
          } else {
            this.customerPipelines.length = 1;
          }


          this.accountType = allData.userDetails.accountType;
          this.customFieldContacts =
            allData.superUserDetails.customFieldsContact;
          let displayColumnsSaved: DisplayColumn[] = [];
          if (allData.userDetails.displayCustomerColumns) {
            displayColumnsSaved = allData.userDetails.displayCustomerColumns;
          }
          if (displayColumnsSaved.length > 0) {
            //if table settings are stored in db, use the stored data
            this.columnsDispaly = allData.userDetails.displayCustomerColumns;
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

          if (allData.superUserDetails.actCustAgeing) {
            // check for customer ageing is activated
            this.actCustAgeing = allData.superUserDetails.actCustAgeing;
          }

          // check for email credentials and plan permissions to enable email sending
          this.customerlistService
            .getEmailSMTP(allData.userDetails.superUserId)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((doc) => {
              if (!!doc) {
                if (
                  !!doc.type &&
                  this.commonService.userPlan.emailTemplates
                ) {
                  this.emailEnabled = true;
                  this.smtpSettings = doc;
                }
              }
            });
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
                // if (item.type === 'Email') {
                //   sumEmail += item.counted;
                // }
                if (item.type === 'WhatsApp') {
                  sumWa += item.counted;
                }
              });
              this.smsCount = sumSMS;
              // this.emailCount = sumEmail;
              this.waCount = sumWa;
            });

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
          if (
            (allData.userDetails.contactDefaultView &&
              defaultViewset &&
              this.customerGridService.customerView ==
              this.customerGridService.customerDefaultView) ||
            (allData.userDetails.contactDefaultView &&
              allData.userDetails.contactDefaultView !=
              this.customerGridService.customerDefaultView)
          ) {
            this.customerGridService.customerView =
              allData.userDetails.contactDefaultView;
            this.customerGridService.customerDefaultView =
              allData.userDetails.contactDefaultView;
            defaultViewset = false;

          }
          if(this.customerGridService.customerView =='grid'){
            this.reloadChildComponent = true;
            this.reloadOldTableChildComponent = true;
          }
          // get first set of data based on the page size and page index.
          if (!this.firstSetDataLoaded) {
            // for calling the function only once when user datas are chaged no need tocall the function again
            if (this.tableService.pipelineCustomerSelection == '') {
              this.tableService.pipelineCustomerSelection =
                this.customerPipelines[0].pipelineId;
            }
            if (this.tableService.selectedPipelineNameArray.length == 0) {
              this.tableService.selectedPipelineNameArray = [];
              this.tableService.selectedPipelineNameArray.push(this.customerPipelines[0].pipelineId);
            }
            [this.cardFields, this.displayFields] =
              this.commonService.getCardFields(
                'customer',
                this.fieldNameContactNotes,
                this.fieldNameFollowup
              );
            // to set the view based on the default view saved in db.
            // at the first time the block will excute also then if customerView changed in current user, any other changes in super/current user will not enter to this block


            // get status array based on pipeline selected
            this.getStatus(allData);
            this.firstSetDataLoaded = true;
          } else {
            // get status array based on pipeline selected
            this.getStatus(allData);
          }

          this.initStageCollapseArray();
          this.progressBarDisplay = true;
        }else{
          this.progressBarDisplay = true;
        }
        }
      })

  }
  // go to upload data as CSV route
  routeUpload() {
    this.router.navigate(['dash/upload-customer-excel']);
  }
  // network check
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.commonServiceUserSubscription?.unsubscribe();
  }
  // if view is changed
  viewSelected(viewName) {
    this.tableService.selectedStatus = ''; // reset selected status when filter changed
    this.tableService.secondViewSelected = viewName; // asisgn second view name
    if (viewName == 'Last note added date') {
      this.tableService.viewSelected =
        'Last ' +
        this.fieldNameContactNotes +
        ' added date'; // for displaying viewname in toolbar
    } else if (viewName == 'All contacts') {
      this.tableService.viewSelected =
        'All ' +
        this.fieldNameContact +
        's'; // for displaying viewname in toolbar
    } else {
      this.tableService.viewSelected =
        this.tableService.secondViewSelected; // for displaying viewname in toolbar
    }
    this.progressBarDisplay = false;
    if (this.customerGridService.customerView == 'grid') {
      this.reloadGridViewChildComponent();
    }
      this.reloadTableComponent();
    // this.reloadChildComponent =  true;
    this.progressBarDisplay = true;
  }
  // if status filter is selcted
  viewSelectedStatus(data) {
    this.tableService.selectedStatus = data.status.stageId;
    this.tableService.secondViewSelected = data.viewName; // asisgn second view name

    this.tableService.viewSelected =
      this.contactSettings.status.displayName +
      '/ ' +
      data.status.name; // for displaying viewname in toolbar
    this.progressBarDisplay = false;
    if (this.customerGridService.customerView == 'grid') {
      this.reloadGridViewChildComponent();
    }
    this.reloadTableComponent();
    // this.reloadChildComponent =  true;
    this.progressBarDisplay = true;
  }
  // get status array based on pipeline selected
  getStatus(allData) {
    if (this.tableService.selectedPipelineNameArray.length == 1) {
      this.tableService.statusArray = this.commonService.getStatusArray(
        'customers',
        this.tableService.selectedPipelineNameArray[0]
      );
      if (this.tableService.selectedPipelineNameArray[0] == 0) {
        //getting status of customer pipeline1
        this.tableService.statusArray =
          allData.superUserDetails?.contactStatus?.map(({ name }) => {
            return name;
          });
      }
    }
  }
  initStageCollapseArray() {
    this.tableService.stageCollapseArray = [];
    this.tableService.statusArray.forEach((element) => {
      this.tableService.stageCollapseArray.push(false);
    });
  }
  viewPipelineChanged() {
    this.tableService.selectedPipelineNameArray = [];
    this.tableService.selectedPipelineNameArray = [
      this.tableService.pipelineCustomerSelection,
    ];
    // based on the pipeline selected set status array
    this.tableService.statusArray = this.commonService.getStatusArray(
      'customers',
      this.tableService.pipelineCustomerSelection
    );
    this.progressBarDisplay = false;

    if (!this.customerGridService.isOldModeVisible) {
      // if previous filter is status then reset it to to be converted
      if (this.tableService.secondViewSelected == 'status') {
        this.tableService.secondViewSelected = 'To be converted';
        this.tableService.viewSelected =
          this.tableService.secondViewSelected; // for displaying viewname in toolbar
      }
      if (this.customerGridService.customerView == 'grid') {
        this.reloadGridViewChildComponent();
      }
      this.reloadTableComponent();

      this.progressBarDisplay = true;
    } else {
      this.progressBarDisplay = false;
      this.customerGridService.onFunctionCall('viewPipelineChanged');
      this.progressBarDisplay = true;
    }
  }
  // reload grid view
  reloadGridViewChildComponent() {
    this.progressBarDisplay = false;
    this.childComponents.forEach(child => {
      // child.reload = true;
      child.displayedData.next([])
      child.initializeData();
    });
    this.progressBarDisplay = true;
  }
  // reload table view
  reloadTableComponent() {
    this.tableService.customerList.data = []; // clear data
    this.tableChild.isLoading = true;
    this.tableChild.resetQueryAndTableData();
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
      this.snackBar.open('Initiating Call', '', {
        duration: 2000,
      });
    }
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
  addTask(custFiltered) {
    this.selection.clear();
    this.dialog.open(CrudModal1Component, {
      width: '520px',
      height: 'auto',
      disableClose: true,
      data: {
        cid: custFiltered.id,
        orgId: custFiltered.orgId,
        mode: 'custCreate',
        company: custFiltered.companyName,
        firstName: custFiltered.firstName,
        secondName: custFiltered.secondName,
        surname: custFiltered.surname,
      },
    });
  }

  // customer notes adding function
  addNotes(data) {
    let custFiltered = data.custFiltered
    let GAevent = data.GAevent
    this.selection.clear();
    let firstName = custFiltered.firstName ? custFiltered.firstName : '';
    let secondName = custFiltered.secondName
      ? ' ' + custFiltered.secondName
      : '';
    let surname = custFiltered.surname ? ' ' + custFiltered.surname : '';
    let customerName = firstName + secondName + surname;

   const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
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
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if (this.customerGridService.customerView == 'grid' && result && !this.customerGridService.isOldModeVisible) {
        const specificChild = this.childComponents.find(child => child.index === data.index);
          specificChild.loading = true;
            // if status is not edit only one column should refresh , based on the index passed from child
          if (specificChild) {
            specificChild.displayedData.next([])
            specificChild.initializeData();
          }
      }
    });
  }

  // create followups from customer fn
  onCreateFollowUps(
    custData
  ) {
    this.selection.clear();
    let customerName;
    if (custData.secondName && custData.surname) {
      // if second name & surname is there
      customerName = custData.firstName + ' ' + custData.secondName + ' ' + custData.surname;
    } else if (custData.secondName && !custData.surname) {
      customerName = custData.firstName + ' ' + custData.secondName;
    } else if (!custData.secondName && custData.surname) {
      customerName = custData.firstName + ' ' + custData.surname;
    } else {
      customerName = custData.firstName;
    }

    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: custData.id,
        companyNames: custData.companyName,
        customerNames: customerName,
        contactNumber: custData.contactNo ? custData.contactNo : '', // pass customer number
        countryCode: custData.code ? custData.code : '', // pass customer country code
        assignedTo: custData.assignedTo,
        assignedToName: custData.assignedToName,
        scenario: 'create',
        subUsers: this.subUsers,
        fname: this.userFirstName,
        lastname: this.userSecondName,
        orgId: custData.orgId,
      },
    });
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
  triggerWhatsapp(data: { templates: any, custFiltered: Customer }) {
    this.selection.clear();
    let templates = data.templates;
    let custFiltered = data.custFiltered;

    // this.selection.clear();
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
  triggerSms(data: { templates: messageTemplateModel, custFiltered: Customer }) {
    this.selection.clear();
    let templates = data.templates;
    let custFiltered = data.custFiltered;

    // this.selection.clear();
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
  triggerEmail(data: { templates: emailTemplateModel, custFiltered: Customer }) {
    this.selection.clear();
    let templates = data.templates;
    let custFiltered = data.custFiltered;
    // this.selection.clear();
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
  editCustomer(data: { index: number, customer: Customer }) {
    this.selection.clear();
    this.commonService.updateCustomerToEdit(data.customer);
    const dialogRef = this.dialog.open(Addcontactpopup1Component, {
      panelClass: 'custom-dialog-container',
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: {
        id: data.customer.id,
        scenario: 'edit',
      },
    })
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if (this.customerGridService.customerView == 'grid' && !this.customerGridService.isOldModeVisible) {
        const specificChild = this.childComponents.find(child => child.index === data.index);
        if (result == 'changed status') {
          // if status is  edited all one column should refresh
          this.progressBarDisplay = false;
          this.reloadGridViewChildComponent();
        } else if (result == 'not changed status') {
          specificChild.loading = true;
            // if status is not edit only one column should refresh , based on the index passed from child
          if (specificChild) {
            specificChild.displayedData.next([])
            specificChild.initializeData();
          }
        } else {

        }
      }
    });
  }
  getFilteredStatus(stage) {
    let dataCustStatus = [];
    this.tableService.statusArray.forEach(element => {
      if (element.stageId != stage) {
        dataCustStatus.push(element.stageId)
      }
    });

    return dataCustStatus;
  }
  // customer list - drag and drop
  drop(event: CdkDragDrop<Customer[]>, index: number) {
    let previousIndex;
    for (let i = 0; i < this.tableService.statusArray.length; i++) {
      if (event.previousContainer.id == this.tableService.statusArray[i].stageId) {
        previousIndex = i;
        break;
      }
    }
    const previousChildComponent = this.childComponents.toArray()[previousIndex];
    const childComponent = this.childComponents.toArray()[index];
    previousChildComponent.isLoaded = false;
    childComponent.isLoaded = false;
    if (event.previousContainer === event.container) {
      previousChildComponent.isLoaded = true;
      childComponent.isLoaded = true;

    } else {

      let cust = event.item.data.id;
      // if drag and drop to lost column, need to show popup to enter reason for rejection
      // if reason for rejection disaply is checked
      if (
        this.contactSettings.rejectionReasonVal?.display === true &&
        event.container.id ===
        this.tableService.statusArray[this.tableService.statusArray.length - 1].stageId
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
            this.tableService.selectedPipelineNameArray[0],
            event.previousContainer.id
          ),
          curStatus: this.commonService.getStatusName(
            'customers',
            this.tableService.selectedPipelineNameArray[0],
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
          custStatus: this.tableService.statusArray, //Customer status array defined in the super user profile
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
          pipelineId: this.tableService.selectedPipelineNameArray[0],
          statusName: this.commonService.getStatusName(
            'customers',
            this.tableService.selectedPipelineNameArray[0],
            event.container.id
          ),
        };

        const dialogRef = this.dialog.open(
          ChangecuststatdialogComponent,
          dialogConfig
        )
        dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
          if (result) {
            previousChildComponent.displayedData.next([])
            childComponent.displayedData.next([])
            previousChildComponent.initializeData();
            childComponent.initializeData();
          } else {
            previousChildComponent.isLoaded = true;
            childComponent.isLoaded = true;
          }

        });
      } else {
        let i = 0;
        if (previousChildComponent) {

          for (i = 0; i < previousChildComponent.displayedData.value.length; i++) {
            if (previousChildComponent.displayedData.value[i].id == cust) {
              previousChildComponent.displayedData.value[i].status = event.container.id;
              break;
            }
          }
        }

        //Update the status of the customer which has been dropped to new stage in front end
        // so that delay updating db doesnot cause the card to jump back to previous stage and then get updated

        let currentHistory =
          event.item.data.stageHistory;
        let stageValues: StageHistoryModel = {
          date: null,
          stageId: null,
          pipelineId: null,
        };
        let stageHistories = [];
        let won = false;
        let lost = false;
        let inPipeline = true;
        let datePlaced = new Date().getTime();
        stageValues.date = datePlaced;
        stageValues.stageId = event.container.id;
        stageValues.pipelineId =
          this.tableService.selectedPipelineNameArray[0];
        if (event.item.data.stageHistory) {
          currentHistory.push(stageValues);
          stageHistories = currentHistory;
        } else {
          stageHistories = [stageValues];
        }

        if (
          event.container.id ===
          this.tableService.statusArray[this.tableService.statusArray.length - 1].stageId
        ) {
          lost = true;
          won = false;
          inPipeline = false;
        } else if (
          event.container.id ===
          this.tableService.statusArray[this.tableService.statusArray.length - 2].stageId
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
          stageHistories,
          datePlaced,
          inPipeline,
          won,
          lost,
          '',
          ChangeLogComponent.saveLog(
            this.constructor.name,
            this.userId,
            this.userName,
            {
              status: this.commonService.getStatusName(
                'customers',
                this.tableService.selectedPipelineNameArray[0],
                event.previousContainer.id
              )
            },
            {
              status: this.commonService.getStatusName(
                'customers',
                this.tableService.selectedPipelineNameArray[0],
                event.container.id
              )
            },
            previousChildComponent.displayedData.value[i].changeLog
          )
        ).then((res) => {
          previousChildComponent.displayedData.next([])
          childComponent.displayedData.next([])
          previousChildComponent.initializeData();
          childComponent.initializeData();
        });

      }
    }
  }
  getFilteredData(index) {
    const specificChild = this.childComponents?.find(child => child.index === index);
    if (specificChild)
      return specificChild.displayedData.value ? specificChild.displayedData.value : [];
  }
  // reassign contact
  onSubUserAssigned(selected, subUserId, firstName, secondName, branchId) {
    let custListArrayString: string;
    let userType: string;
    if (subUserId === this.superUserId) {
      userType = 'Main User';
    } else {
      userType = 'Sub User';
    }

    custListArrayString = JSON.stringify(selected);
    let assignedToNameTemp = '';
    if (secondName != null) {
      assignedToNameTemp = firstName + ' ' + secondName;
    } else {
      assignedToNameTemp = firstName;
    }

    let assignedToName = assignedToNameTemp;
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
      },
    });
  }
   // delete contact
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
      },
    });
  }
  // to toggle between list and table view, to select list
  onToggle() {
    if (!this.customerGridService.isOldModeVisible) {
      this.selection.clear(); //clear select of table
      this.reloadChildComponent = false;
      this.reloadOldTableChildComponent = false;
      this.customerGridService.customerView = 'grid';
      // all should refresh while toggle
      this.reloadGridViewChildComponent();
      this.reloadChildComponent = true;
      this.reloadOldTableChildComponent = true;
    }else{
      this.reloadChildComponent = false;
      this.reloadOldTableChildComponent = false;
      this.customerGridService.onFunctionCall('onToggle');
      this.reloadOldTableChildComponent = true;
      this.reloadChildComponent = true;
    }
    this.cdRef.detectChanges();
  }
  // to toggle between list and table view, to select table
  onToggleTab() {
    if (!this.customerGridService.isOldModeVisible) {
      this.reloadChildComponent = false;
      this.reloadOldTableChildComponent = false;
      this.customerGridService.customerView = 'table';
      this.cdRef.detectChanges();
    }else{
      this.reloadChildComponent = false;
      this.reloadOldTableChildComponent = false;
      this.customerGridService.onFunctionCall('onToggleTab');
    }
    this.cdRef.detectChanges();
  }
  openDialog(data: { columnsDispaly: any, customFieldContacts: any }) {
    let columnsDispaly = data.columnsDispaly;
    let customFieldContacts = data.customFieldContacts;
    let col = columnsDispaly.map((obj) => ({
      ...obj,
    }));
    //open the dialog to customize the table fields
    const dialogRef = this.dialog.open(CustomTableSettingsComponent, {
      data: {
        columndata: col,
        userId: this.userId,
        displayName: 'displayCustomerColumns',
        customFields: customFieldContacts,
      },
      disableClose: true,
      width: '600px',
    })
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if(result){
        this.tableChild.columnsDispaly = result.displayCustomerColumns;
        this.columnsDispaly = result.displayCustomerColumns;
        this.tableChild.configureTable();
      }
    })
  }
    //Function to open the card content custmization popup
  customizeCardContent() {
      const dialogRef = this.dialog.open(CardSettingsComponent, {
        data: ['customer', this.cardFields, this.customFieldContacts],
        width: '600px',
      })
      dialogRef.afterClosed().pipe(take(1)).subscribe((data) => {
        if(data){
          [this.cardFields, this.displayFields] =
          this.commonService.getCardFields(
            'customer',
            this.fieldNameContactNotes,
            this.fieldNameFollowup
          );
        }
      })
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
  onTableSettings(value){
    this.columnsDispaly=value;
    this.cdRef.detectChanges();
   }
     // filter by assgigned to me or created by
  onViewFilter(evt: MouseEvent): void {
    const target = new ElementRef(evt.currentTarget);
    const dialogRef = this.dialog.open(CustomViewSelectComponent, {
      panelClass: 'dialog-side-panel',
      data: {
        trigger: target,
        contactSettings:this.contactSettings,
        cardFields:this.cardFields,
        fieldNameContactNotes:this.fieldNameContactNotes,
        fieldNameContact:this.fieldNameContact,
        superUserId:this.superUserId,
        userId:this.userId,
        myViews:this.myViews,
        publicViews:this.publicViews
      },
    });
    const dialogSubmitSubscription =
      dialogRef.componentInstance.viewSelectedEvent.subscribe((value: string) => {
        dialogSubmitSubscription.unsubscribe();
        this.selection.clear();
        this.viewSelected(value)
      });
    const dialogSubmitSubscriptionTwo =
      dialogRef.componentInstance.viewSelectedStatusEvent.subscribe(( value:{ viewName: string, status: string } ) => {
        dialogSubmitSubscriptionTwo.unsubscribe();
        this.selection.clear();
        this.viewSelectedStatus(value)
      });
  }
  // edit custom view
  editView(mode,) {
    let customerViewSelected = JSON.parse(JSON.stringify(this.customerGridService.customerViewSelected));
    //call the popup for card field customization
    const dialogRef = this.dialog.open(LiteModeViewFilterComponent, {
      data: [
        'customers',
        customerViewSelected,
        mode,
        this.cardFields,
      ],
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.customerGridService.customerViewSelected.primaryQuery = res.viewSettings.primaryQuery;
        this.customerGridService.customerViewSelected.filters = res.viewSettings.filters;
        this.customerGridService.customerViewSelected.viewName = res.viewSettings.viewName;
        this.customerGridService.customerViewSelected.sortField = res.viewSettings.sortField;
        this.customerGridService.customerViewSelected.sortOrder = res.viewSettings.sortOrder;
        this.tableService.selectedStatus = ''; // reset selected status when filter changed
        this.tableService.secondViewSelected = res.viewSettings.viewName; // asisgn second view name
        this.tableService.viewSelected = this.tableService.secondViewSelected; // for displaying viewname in toolbar
        this.customerGridService.onFunctionCall('viewChanged');
      }
    });
  }
  //delete view
  deletePublicView() {
    let dialogref = this.dialog.open(ConfirmationpopupComponent, {
      width: '400px',
      data: {
        smode: 'delete_view',
        viewName:
          this.customerGridService.customerViewSelected.viewName,
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res == 'deleted') {
        this.tableService
          .onDeletePublicView(this.superUserId, this.customerGridService.customerViewSelected.id)
          .then((res) => {
            this._snackBar.open('View has been deleted', '', {
              duration: 2000,
            });
            if (this.myViews.length > 0) {
              this.customerGridService.customerViewSelected = this.myViews[0];
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = this.customerGridService.customerViewSelected.viewName; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar
              this.customerGridService.onFunctionCall('viewChanged');
            }
            else if (this.publicViews.length > 0) {
              this.customerGridService.customerViewSelected = this.publicViews[0];
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = this.customerGridService.customerViewSelected.viewName; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar
              this.customerGridService.onFunctionCall('viewChanged');
            }else{
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = 'To be converted'; // asisgn second view name
      
              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar
      
              this.customerGridService.isOldModeVisible = false;
            }
           
          });

      }
    });
  }
  // delete custom view created by me
  deleteMyView() {
    let dialogref = this.dialog.open(ConfirmationpopupComponent, {
      width: '400px',
      data: {
        smode: 'delete_view',
        viewName:
          this.customerGridService.customerViewSelected.viewName,
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res == 'deleted') {
        this.tableService
          .onDeleteMyView(this.userId, this.customerGridService.customerViewSelected.id)
          .then((res) => {
            this._snackBar.open('View has been deleted', '', {
              duration: 2000,
            });
            if (this.myViews.length > 0) {
              this.customerGridService.customerViewSelected = this.myViews[0];
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = this.customerGridService.customerViewSelected.viewName; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar
              this.customerGridService.onFunctionCall('viewChanged');
            }
            else if (this.publicViews.length > 0) {
              this.customerGridService.customerViewSelected = this.publicViews[0];
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = this.customerGridService.customerViewSelected.viewName; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar
              this.customerGridService.onFunctionCall('viewChanged');
            } else {
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = 'To be converted'; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar

              this.customerGridService.isOldModeVisible = false;
            }
          });
      }
    });
  }
  // get views list
  getView() {
    combineLatest([
      this.tableService.getMyViews(this.userId),
      this.tableService.getPublicViews(this.superUserId)
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        ([myViewsData, publicViewsData]) => {
  
          this.myViews = myViewsData.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as any;
          });
  
          // Separate publicViews into two arrays based on createdBy condition
         let publicViewsCreatedByCurrentUser = publicViewsData.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as any;
          }).filter(publicView => publicView.createdBy === this.userId);
  
          this.publicViews = publicViewsData.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as any;
          }).filter(publicView => publicView.createdBy !== this.userId);
  
          // Add publicViews where createdBy is equal to this.userId to myViews
          this.myViews = [...this.myViews, ...publicViewsCreatedByCurrentUser];
  
          this.cdRef.detectChanges();
        },
        error => {
          console.error('Error fetching views:', error);
          // Handle errors as needed
        }
      );
  }
}
