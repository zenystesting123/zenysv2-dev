/**********************************************************************************
Description: Component is used to dispalylist of contacts based on the custom query.

**********************************************************************************/
import {
  contactSettings,
  Customer,
  defaultContactSettings,
  DisplayColumn,
  messageTemplateModel,
  modules,
  Profile,
  StageHistoryModel,
} from 'src/app/data-models';
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import {
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonService } from 'src/app/common.service';
import { CustomerTableColumns } from 'src/app/model/custom-report.model';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { StatusPopupComponent } from 'src/app/settings/status-popup/status-popup.component';
import { emailTemplateModel } from 'src/app/settings/email-template-settings/email-template.model';
import { ChangecuststatdialogComponent } from 'src/app/changecuststatdialog/changecuststatdialog.component';
import { Pipelines } from 'src/app/model/pipeline.modal';
import { TableService } from 'src/app/table/customer/customer-list/table.service';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { CustomerGridService } from './customer-grid.service';
@Component({
  selector: 'app-customer-grid',
  templateUrl: './customer-grid.component.html',
  styleUrls: ['./customer-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DecimalPipe],
})
export class CustomerGridComponent implements OnInit, OnDestroy, OnChanges {
  // pass the event to customer-list component so we can avoid duplication of same function in customer-litemode table/ grid and this component
  @Output() triggerSmsEvent = new EventEmitter<{ templates: messageTemplateModel, custFiltered: Customer }>(); // trigger sms
  @Output() triggerEmailEvent = new EventEmitter<{ templates: emailTemplateModel, custFiltered: Customer }>();// trigger email
  @Output() triggerWhatsappEvent = new EventEmitter<{ templates: any, custFiltered: Customer }>();// trigger whatsapp
  @Output() editCustomerEvent = new EventEmitter<{ index: number, customer: Customer }>();// edit customer
  @Output() callEvent = new EventEmitter<Customer>(); // auto call
  @Output() onAddSaleEvent = new EventEmitter<string>(); // add sale
  @Output() onAddServiceEvent = new EventEmitter<string>(); // add service
  @Output() addTaskEvent = new EventEmitter<Customer>(); // add task
  @Output() onCreateFollowUpsEvent = new EventEmitter<Customer>(); // add followup
  @Output() addNotesEvent = new EventEmitter<{ index: number, custFiltered: Customer, GAevent: string }>(); // add notes
  @Output() onTableSettingsEvent = new EventEmitter<DisplayColumn[]>(); // customize table columns

  @Input() userId: string; //logged in users id
  @Input() superUserId: string = ''; //super user id of logged in user
  @Input() selection = new SelectionModel<Customer>(true, []); // table selection
  @Input() fieldListArray: any = [];
  @Input() disableEditContact: boolean = false; //disable edit contact
  @Input() disableDownloadContact: boolean = false; //disable download contact
  @Input() disableSale = false;//disable create sale
  @Input() disableService = false;//disable create service
  @Input() disableFoll = false;//disable create followup
  @Input() disableCreateNote = false; // disable Note creation
  @Input() contactDataAccessRule: string; //contact data accees rule
  @Input() superUserDetails: Profile = null; //logged in users super user data
  @Input() accountType: string = ''; //accountType of logged in user
  @Input() fieldNameFollowup: string = 'FollowUp';
  @Input() fieldNameContactNotes: string = 'Note';
  @Input() fieldNameTask: string = 'Task';
  @Input() fieldNameContact: string = 'Contact'; //customisable field name
  @Input() fieldNameSale: string = 'Sale';
  @Input() fieldNameService: string = 'Support';
  @Input() fieldNameOrganization = 'Organization';
  @Input() customFieldContacts: any[]; // contact custom fields
  @Input() displayColumnsSaved: DisplayColumn[] = [];// saved column in table
  @Input() columnsDispaly = []; // all column in table
  @Input() tableDefaultData = CustomerTableColumns; // default column
  @Input() contactSettings: contactSettings = defaultContactSettings.CONST_VALUE; // conatct field name settings
  @Input() cardFields: any[]; // all card fields
  @Input() displayFields: any; // displaying card fields
  @Input() actCustAgeing: boolean = false; // check for is ageing is activated
  @Input() customerPipelines: Pipelines[] = [];// customer pipeline array
  @Input() enableOutboundCallsViaCallBridging: boolean = false; //for checking autocall enabled or not
  @Input() userName: string; //logged in users full name
  @Input() whatsAppTemplates: messageTemplateModel[] = []; //to hold the fetrched whatsapp message templates
  @Input() smsTemplates: messageTemplateModel[] = []; //to hold the fetrched sms message templates
  @Input() emailTemplates: emailTemplateModel[] = []; //to hold the fetrched email templates
  @Input() emailEnabled = false; //SMTP settings of email completed
  @Input() smsEnabled = false; //SMS settings saved user
  @Input() waEnabled = false; //WhatsApp settings saved user
  @Input() emailCount = 0; //if daily email send limit exceeded to update in UI
  @Input() reload: boolean; // for display the grid view
  @Input() myViews: any = []; // list of my views
  @Input() publicViews: any = []; // list of public views


  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.
  progressBarStatus: boolean = false; // for showing the loader
  CustomerTableDataArray: MatTableDataSource<Customer>; //mat-table datasource
  resetDateArray: MatTableDataSource<Customer>; // used for reset filter list
  customersArray: MatTableDataSource<Customer>; // used for filter list
  custListStatus: any; //customer status under super user profile
  custListArray: any; //Customer status array defined in the super user profile
  custLoaded: boolean = false; //if customer data is loaded
  customerData: Customer[]; //holds customer data fetched from DB
  stageHistories: any[]; // to store stage histories of current contact
  networkConnection: boolean; //to check network connection
  stageCollapseArray = []; // stage collaps list
  custStatusAge: any; // customer age number
  dataRead: any[]; // customer list
  userList: any; // list of users data
  userIdArray: any;// list of users id
  sortField: any; // filter sort field
  sortOrder: any;// filter sort order
  userIdsArray: any[] = [];// list of users id
  userNamesArray: any[] = []; // list of users names
  displayName: string = 'displayCustomerColumns'; // used as saving field for customer column
  tableName: string = 'Customer';// table name
  customerSubscription: Subscription; // used for closing subscription
  getFilteredDataCalls: number = 0;
  getFieldValueCalls: number = 0;
  alertPopupStatus: boolean = false; // to open the alert dialoge once
  private subscriptionOnViewChange: Subscription;

  // secondaryFilterSet: boolean = false; //Field to check if secondary filter has been set or not
  // secondaryFilterField: any; // secondary filter field name
  // secondaryFilterValue: any; // secondary filter field value
  // sortOrderSet: boolean = false; //Field to check if sort filter has been set or not
  // sortCardFieldSet: boolean = false;
  // sortBy: any; // sort by field name
  // noOfCustinViewPipeline: any; // no of customer in pipeline
  // agedFilterSet: boolean = false; //Field to check if aged filter has been set or not
  constructor(
    public datepipe: DatePipe,
    public customerGridService: CustomerGridService,
    public dialog: MatDialog,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private changeDetectorRef: ChangeDetectorRef,
    private tableService: TableService
  ) {
    this.CustomerTableDataArray = new MatTableDataSource([]);
    this.customersArray = new MatTableDataSource([]);
    this.resetDateArray = new MatTableDataSource([]);

    this.subscriptionOnViewChange = this.customerGridService.onFunctionCall$.subscribe((data) => {
      if (data) {
        if (data == 'onToggle') {
          this.onToggle();// toggle to grid view
        } else if (data == 'onToggleTab') {
          this.onToggleTab(); // toggle to table view
        } else if (data == 'viewChanged') {
          this.progressBarStatus = false;
          this.changeDetectorRef.detectChanges();
          this.viewChanged(); // when view changed read new data based on the custom filter
        } else if (data == 'viewPipelineChanged') {
          this.viewPipelineChanged(); // when pipeline changed filter data by selected pipeline
        }
        this.customerGridService.onFunctionCall(""); // set onFunctionCallSource as empty
      }

    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.columnsDispaly = this.columnsDispaly;

  }
  ngOnInit(): void {
    this.selection.clear();
    this.getStatusAndAgeFn();
    [this.userIdsArray, this.userNamesArray] =
      this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names
    //call the function to get the primary query details
    if (this.contactDataAccessRule) {
      [this.userIdArray, this.userList] =
        this.commonService.createUserlist(this.contactDataAccessRule, this.userId);
    }
    if (this.customerGridService.customerViewSelected) {

      this.tableService.selectedStatus = ''; // reset selected status when filter changed
      this.tableService.secondViewSelected = this.customerGridService.customerViewSelected.viewName; // asisgn second view name

      this.tableService.viewSelected = this.tableService.secondViewSelected;
      this.getViewData();
    } else {
      if (this.myViews.length > 0) {
        this.customerGridService.customerViewSelected = this.myViews[0];
        this.tableService.selectedStatus = ''; // reset selected status when filter changed
        this.tableService.secondViewSelected = this.customerGridService.customerViewSelected.viewName; // asisgn second view name

        this.tableService.viewSelected = this.tableService.secondViewSelected;
        this.getViewData();
      } else if (this.publicViews.length > 0) {
        this.customerGridService.customerViewSelected = this.publicViews[0];
        this.tableService.selectedStatus = ''; // reset selected status when filter changed
        this.tableService.secondViewSelected = this.customerGridService.customerViewSelected.viewName; // asisgn second view name

        this.tableService.viewSelected = this.tableService.secondViewSelected;
        this.getViewData();
      } else {
        this.tableService.selectedStatus = ''; // reset selected status when filter changed
        this.tableService.secondViewSelected = 'To be converted'; // asisgn second view name

        this.tableService.viewSelected =
          this.tableService.secondViewSelected; // for displaying viewname in toolbar

        this.customerGridService.isOldModeVisible = false;
      }
    }
  }
  // get data based on the custom filter
  async getViewData() {
    this.progressBarStatus = false;
    // open a popup if deleted additional field is used in custom view query
    if (
      this.customerGridService.customerViewSelected.primaryQuery.queryField ==
      'additionalFieldsArr' &&
      !this.fieldListArray[this.customerGridService.customerViewSelected.primaryQuery.ind].isActive
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
      this.customerGridService.customerViewSelected.sortField.fieldType == 'Additional' &&
      !this.fieldListArray[this.customerGridService.customerViewSelected.sortField.ind].isActive
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
      this.customerGridService.customerViewSelected.filters?.forEach((element) => {
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
      this.customerGridService.customerViewSelected.primaryQuery
    );
    this.sortField = this.customerGridService.customerViewSelected.sortField;
    this.sortOrder = this.customerGridService.customerViewSelected.sortOrder;
    if (queryData) {
      this.customerSubscription?.unsubscribe();
      this.customerSubscription = this.customerGridService.getCustomerList(
        this.superUserId,
        queryData,
        this.userIdArray
      ).subscribe((data) => {
        let dataRead = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Customer;
        });
        //If the primary query is based on createdBy field, then apply data access rule based on createdBy
        if (queryData.queryField == "createdBy") {
          //Else if the primary query is not based on createdBy field, then apply data access rule based on assigned to
          if (this.contactDataAccessRule == 'Team' || this.contactDataAccessRule == 'Own') {
            if (this.userIdArray) {
              dataRead = dataRead.filter((element) =>
                this.userIdArray.includes(element.createdBy)
              );
            } else {
              [this.userIdArray, this.userList] =
                this.commonService.createUserlist(
                  this.contactDataAccessRule,
                  this.userId
                );
              dataRead = dataRead.filter((element) =>
                this.userIdArray.includes(element.createdBy)
              );
            }
          } else if (this.contactDataAccessRule == 'Branch') {
            let branchId = this.commonService.getBranch(this.userId)
            dataRead = dataRead.filter(element =>
              element.associatedBranch === branchId
            );

          }
        } else {
          //Else if the primary query is not based on createdBy field, then apply data access rule based on assigned to
          if (this.contactDataAccessRule == 'Team' || this.contactDataAccessRule == 'Own') {
            if (this.userIdArray) {
              dataRead = dataRead.filter((element) =>
                this.userIdArray.includes(element.assignedTo)
              );
            } else {
              [this.userIdArray, this.userList] =
                this.commonService.createUserlist(
                  this.contactDataAccessRule,
                  this.userId
                );
              dataRead = dataRead.filter((element) =>
                this.userIdArray.includes(element.assignedTo)
              );
            }
          } else if (this.contactDataAccessRule == 'Branch') {
            let branchId = this.commonService.getBranch(this.userId)
            dataRead = dataRead.filter(element =>
              element.associatedBranch === branchId
            );

          }
        }
        dataRead = this.commonService.sortData(
          dataRead,
          this.sortField,
          this.sortOrder
        );
        // check if filter is present
        if (this.customerGridService.customerViewSelected.filters.length > 0) {
          let filterData = this.customerGridService.customerViewSelected.filters;
          filterData.forEach((element) => {
            let filterQuery = this.commonService.getQueryData(element);
            dataRead = dataRead.filter((record) =>
              this.commonService.filterData(record, filterQuery)
            );
          });
        }
        // this.cusomerListDataLoaded = true;
        this.customerGridService.customerList.next(dataRead as Customer[]);

        this.dataRead = dataRead;
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

        // //If any filter was active, reapply the filter to make sure that filter does not get reset automatically on subscription update
        // if (this.secondaryFilterSet == true) {
        //   this.secondaryFilter(
        //     this.secondaryFilterField,
        //     this.secondaryFilterValue
        //   );
        // }
        // // this.getNoOfRecords();
        // //If any custom sorting by field was active, reapply the filter to make sure that filter does not get reset automatically on subscription update
        // if (this.agedFilterSet == true) {
        //   this.aged_secondaryFilter();
        // }
        // if (this.sortOrderSet == true) {
        //   this.setSortOrder(this.sortOrder);
        // }
        // //If any custom sorting by order was active, reapply the filter to make sure that filter does not get reset automatically on subscription update

        // if (this.sortCardFieldSet == true) {
        //   this.sortCardField(this.sortBy);
        // }
        this.filterDataByPipelines(
          this.tableService.pipelineCustomerSelection
        );
        this.custLoaded = true;
        this.progressBarStatus = true;
        this.changeDetectorRef.detectChanges();
      })
    } else {
      this.progressBarStatus = true;
    }
  }
  // filter by pipeline
  filterDataByPipelines(pipelineId) {

    this.CustomerTableDataArray.data =
      this.CustomerTableDataArray.data.filter(function (e) {
        return e.selectedContactPipeline === pipelineId;
      });
    this.changeDetectorRef.detectChanges();
  }

  // trigger send whatsapp cloud function for single user
  triggerWhatsapp(templates, custFiltered) {
    const data = { templates: templates, custFiltered: custFiltered };
    this.triggerWhatsappEvent.emit(data)
  }
  // trigger send sms cloud function for single user
  triggerSms(templates, custFiltered) {
    const data = { templates: templates, custFiltered: custFiltered };
    this.triggerSmsEvent.emit(data)
  }
  // trigger send email cloud function for single user
  triggerEmail(templates, custFiltered) {
    const data = { templates: templates, custFiltered: custFiltered };
    this.triggerEmailEvent.emit(data)
  }
  // edit customer
  editCustomer(row) {
    const data = { index: 0, customer: row };
    this.editCustomerEvent.emit(data);
  }
  // add sale
  onAddSale(id) {
    this.onAddSaleEvent.emit(id);
  }
  // add service
  onAddService(id) {
    this.onAddServiceEvent.emit(id);
  }
  // add task
  addTask(custFiltered) {
    this.addTaskEvent.emit(custFiltered);
  }
  // add folllowup
  onCreateFollowUps(custFiltered) {
    this.onCreateFollowUpsEvent.emit(custFiltered);
  }
  // add notes
  addNotes(custFiltered, GAevent) {
    const data = { index: 0, custFiltered: custFiltered, GAevent: GAevent };
    this.addNotesEvent.emit(data);;
  }
  //call function
  onCall(custData) {
    this.callEvent.emit(custData);
  }
  // get the card field value
  getFieldValue(field, data) {
    this.getFieldValueCalls++;
    return this.commonService.getFieldValue(field, data, modules.customers);
  }
  // for stage collaps
  initStageCollapseArray() {
    this.stageCollapseArray = [];
    this.custListStatus.forEach((element) => {
      this.stageCollapseArray.push(false);
    });
  }

  // filter status age and id
  getStatusAndAgeFn() {
    var result = this.customerPipelines.filter((obj) => {
      return (
        obj.pipelineId === this.tableService.pipelineCustomerSelection
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

  //Function for checking whether a record is in progress, converted and lost and returning CSS classes
  stageInPipeline(i) {
    if (i <= this.tableService.statusArray.length - 2) {
      return {
        border: 'border-primary',
        text: 'text-primary',
        badge: 'bg-soft-primary',
        background: 'bg-soft-primary',
      };
    } else if (i == this.tableService.statusArray.length - 1) {
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
  ngAfterViewInit() { }
  // cdk drag and drop data in list view
  getFilteredData(docData, stage) {
    this.getFilteredDataCalls++;
    if (docData) {
      if (this.commonService.userPlan.multiPipelineAccess) {
        const pipelineSel = docData.filter(
          (data) =>
            data.selectedContactPipeline ===
            this.tableService.pipelineCustomerSelection

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
            this.tableService.pipelineCustomerSelection,
            event.previousContainer.id
          ),
          curStatus: this.commonService.getStatusName(
            'customers',
            this.tableService.pipelineCustomerSelection,
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
          pipelineId: this.tableService.pipelineCustomerSelection,
          statusName: this.commonService.getStatusName(
            'customers',
            this.tableService.pipelineCustomerSelection,
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
          this.tableService.pipelineCustomerSelection;
        if (event.item.data.stageHistory) {
          currentHistory.push(stageValues);
          this.stageHistories = currentHistory;
        } else {
          this.stageHistories = [stageValues];
        }
        let inPipeline = false;
        let won = false;
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
        this.customerGridService.onUpdateCustomer(
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
            {
              status: this.commonService.getStatusName(
                'customers',
                this.tableService.pipelineCustomerSelection,
                event.previousContainer.id
              )
            },
            {
              status: this.commonService.getStatusName(
                'customers',
                this.tableService.pipelineCustomerSelection,
                event.container.id
              )
            },
            this.customerData[i].changeLog
          )
        );
      }
    }
  }
  // to toggle between list and table view, to select list
  onToggle() {
    this.selection.clear(); //clear select of table
    this.customerGridService.customerView = 'grid';

  }
  // to toggle between list and table view, to select table
  onToggleTab() {
    this.customerGridService.customerView = 'table';
  }
  viewChanged() {
    this.alertPopupStatus = false; // popup status set as false to open poup if next view contains deletd add field
    this.getViewData();
    // this.getNoOfRecords();
    this.selection.clear(); //clear select of table
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
    this.customerSubscription?.unsubscribe();
    this.subscriptionOnViewChange?.unsubscribe();
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
  //function to filter the data when pipeline is changed
  viewPipelineChanged() {
    this.progressBarStatus = false;
    this.changeDetectorRef.detectChanges();
    this.CustomerTableDataArray.data = this.resetDateArray.data;
    this.getStatusAndAgeFn();
    this.filterDataByPipelines(this.tableService.pipelineCustomerSelection);
    this.selection.clear(); //clear select of table
    this.progressBarStatus = true;
    this.changeDetectorRef.detectChanges();
  }
  // table setting changed data is set in columnsDisplay
  onTableSettings(value) {
    this.columnsDispaly = value;
    this.onTableSettingsEvent.emit(value)
    this.changeDetectorRef.detectChanges();
  }
  // reset filter function
  // resetFilter() {
  //   this.selection.clear(); //clear select of table
  //   this.secondaryFilterSet = false;
  //   this.agedFilterSet = false;
  //   this.CustomerTableDataArray.data = this.resetDateArray.data;
  //   this.customerData = this.resetDateArray.data;
  //   this.customersArray.data = this.resetDateArray.data;
  //   // this.viewPipelineChanged();
  // }
  //Function to get the number of records for selected view and pipeline
  // getNoOfRecords() {
  //   this.noOfCustinViewPipeline = this.customerData.length;
  //   if (this.tableService.pipelineCustomerSelection != 'All Pipelines') {
  //     this.noOfCustinViewPipeline = this.customerData.filter(
  //       (data) =>
  //         data.selectedContactPipeline ===
  //         this.tableService.pipelineCustomerSelection
  //     ).length;
  //   }
  // }
  // secondaryFilter(field, value) {
  //   this.secondaryFilterSet = true;
  //   this.secondaryFilterField = field;
  //   this.secondaryFilterValue = value;
  //   let filteredData = [];
  //   filteredData = this.dataRead.filter((record) => {
  //     return record[this.secondaryFilterField] === this.secondaryFilterValue;
  //   });
  //   this.customerData = filteredData;

  //   this.CustomerTableDataArray.data = filteredData;
  //   this.filterDataByPipelines(this.tableService.pipelineCustomerSelection);
  // }
  // aged_secondaryFilter() {
  //   let filteredData = [];

  //   filteredData = this.dataRead.filter((record) => {
  //     return this.getAgedStatus(record);
  //   });
  //   this.agedFilterSet = true;
  //   this.customerData = filteredData;
  //   this.CustomerTableDataArray.data = filteredData;
  //   this.filterDataByPipelines(this.tableService.pipelineCustomerSelection);
  //   this.selection.clear(); //clear select of table
  // }

  // //function to sort card data when sort order is changed
  // setSortOrder(order) {
  //   this.sortOrderSet = true;
  //   this.sortOrder = order;
  //   this.customerData = this.commonService.sortData(
  //     this.customerData,
  //     this.sortField,
  //     this.sortOrder
  //   );
  // }
  // //function to sort card data when sort field is changed
  // sortCardField(field) {
  //   this.sortCardFieldSet = true;
  //   this.sortBy = field;
  //   this.customerData = this.commonService.sortData(
  //     this.customerData,
  //     field,
  //     this.sortOrder
  //   );
  // }

}
