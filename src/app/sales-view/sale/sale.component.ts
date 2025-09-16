import {
  contactSettings,
  defaultContactSettings,
  defaultSaleSettings,
  DisplayColumn,
  FollowUps,
  Invoice,
  modules,
  prodmodel,
  ProductInSaleModel,
  ProductModel,
  saleSettings,
  saleViewSettingsDef,
  StageHistoryModel,
  SubUsers,
  Task,
  UserAccessDetails,
} from './../../data-models';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Sales, Profile, StageValues, CheckStatus } from '../../data-models';
import { MatTableDataSource } from '@angular/material/table';
import { SaleService } from './sale.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from '@angular/material/dialog';
import { Addnewsale1Component } from '../../addnewsale1/addnewsale1.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { NetworkCheckService } from '../../networkcheck.service';
import { CommonService } from 'src/app/common.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { SaleTableColumns } from 'src/app/model/custom-report.model';
import { CardSettingsComponent } from 'src/app/card-settings/card-settings.component';
import { ViewBuilderComponent } from 'src/app/view-builder/view-builder.component';
import { FollowupTaskCreateComponent } from 'src/app/followup-task-create/followup-task-create.component';
import { CrudModal1Component } from 'src/app/taskboard/crud-modal1/crud-modal1.component';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { SelectSearchComponent } from 'src/app/common-search/select-search/select-search.component';
import { StatusPopupComponent } from 'src/app/settings/status-popup/status-popup.component';
import { CommonListDataService } from 'src/app/common-list-data.service';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { ViewServiceService } from 'src/app/view-builder/view-service.service';
import { ChangesalestatdialogComponent } from 'src/app/changesalestatdialog/changesalestatdialog.component';
import { Pipelines } from 'src/app/model/pipeline.modal';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', [
      transition('void=>*', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('400ms', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition('*=>void', [
        animate('400ms', style({ opacity: 0, transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class SaleComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.
  displayedColumns: string[]; //sale table columns
  //holds the sale array fetched from DB and stored in other arrays for filtering and reset purposes
  sales: Sales[];
  filteredSale: Sales[];
  saleFilter: Sales[];
  documentsArray: MatTableDataSource<Sales>;
  salesArray: MatTableDataSource<Sales>;
  array1: MatTableDataSource<Sales>;
  array2: MatTableDataSource<Sales>;
  dialogRef: any;
  selectedDate1: any = null; //filter date 1
  selectedDate2: any = null; //filter date 2
  checkedLow: boolean = false; // if low priority check is applied
  checkedMedium: boolean = false; // if medium priority check is applied
  checkedHigh: boolean = false; // if high priority check is applied
  dialogSubscription: Subscription; //dialog subscription
  userId: string = ''; //logged in users id
  dataAccessRule: string = ''; //data access rule of logged in user
  saleStatus: any = null; //sale stages under super user profile
  createDate: any = null; //logged in users created date
  saleStatusLength: number = 0; // length of sale stages under superuser profile
  statusCheck: CheckStatus[] = []; //sale stages under superuser profile
  disableContact: boolean = false; //disable contact create based on access control permission
  disableSaleView: boolean = false; //disable sale view based on access control permission
  disableSales: boolean = false; //disable create sale based on access control permission
  disableSaleDownload = false; //disabel download table
  disableFoll = false;
  disableDocCreateEst: boolean = false; //disable Sales Doc view
  disableDocCreateQuot: boolean = false; //disable Sales Doc view
  disableDocCreateInv: boolean = false; //disable Sales Doc view
  filters: String[]; //for filter by priority
  filtersSale: String[]; //for filter by status
  superUserId: string = ''; //logged in users superuser id
  progressBarStatus: boolean = false; //progress bar status
  saleLoaded: boolean = false; //boolean to confirm DB fetch is completed
  filterViewtoolbar: Boolean = false; //to show/hide priority and stage filter button - currently not using
  // additional field variables
  fieldListArray: any = [];
  stageHistories: any[];
  stageHistory: any[] = [];
  stageValues: StageHistoryModel = {
    date: null,
    stageId: null,
    pipelineId: null,
  };
  usrProfileData: UserAccessDetails = null; //access control settings
  dataAccessRuleCheck: string; //data access rule of logged in user check - true if value is "All"
  disableSaleEdit: boolean = false; //based on access control, disable sale edit
  isFilterApplied: boolean = false; // to check if filter is applied or not
  searchTerm: string = null; //search by field variable
  disableReAssign = false;
  superUserDetails: Profile = null; //super user profile
  // customisable field names
  fieldNameSale: string = 'Sale';
  fieldNameContact: string = 'Contact';
  fieldNameTask: string = 'Task';
  fieldNameFollowup: string = 'FollowUp';
  fieldNameItems: string = 'Products and Service';
  fieldNameEstimate: string = 'Estimate';
  fieldNameQuotation: string = 'Quotation';
  fieldNameInvoice: string = 'Invoice';
  fieldNameOrganization = 'Organization';
  fieldNameSaleNotes: string = 'Note';
  subusersToDisplay: SubUsers[] = []; //array of subusers under superuser
  subUsers: SubUsers[] = []; //array of subusers under superuser
  userFirstName: string; //user first name
  userLastName: string; // userlast name
  commonServSubscription: Subscription; //commonservice subscription
  fileteredBy: string = null; // for showing the message
  selection = new SelectionModel<Sales>(true, []); //checkbox selection for re-assign sale
  count = 0; //for reassign sale, no of sales is stored in this variable
  userFullName: string;
  today: Date = new Date();
  filterStage: string;
  assignedToFilter: string;
  orderWonCheck = false; //check for the field orderWonCheck
  actSaleAgeing: boolean = false; // check for is ageing is activated
  saleStatusPipeline: String[]; // sale pipeline
  saleStatusAge: any; // sale age number
  pipelineActive = false;
  inPipeline = false;
  won = false;
  lost = false;
  stageCollapseArray = [];
  displayFields: any;
  cardFields: any;
  columns = [];
  userDetails: Profile;
  userIdsArray: any[] = [];
  userNamesArray: any[] = [];
  pipelineNames = []; //Array to store the pipeline
  displayColumnsSaved: DisplayColumn[] = [];
  displayName: string = 'displaySaleColumns';
  tableName: string = 'Sale';
  accountType: string;
  tableDefaultData = SaleTableColumns;
  fieldSettings: saleSettings = defaultSaleSettings.CONST_VALUE;
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  viewSettingArray: any = saleViewSettingsDef.DATA; //customer view settings array
  viewSettingSelected: any = this.viewSettingArray[0]; //particular view chosen by user
  sortField: any;
  sortOrder: any;
  userIdArray: any;
  allUsersId: any;
  userDetailsAll: any;
  saleSubscription: Subscription;
  secondaryFilterSet: boolean = false; //Field to check if secondary filter has been set or not
  secondaryFilterField: any;
  secondaryFilterValue: any;
  sortOrderSet: boolean = false;
  sortCardFieldSet: boolean = false;
  sortBy: any;
  selectedSale: Sales = null;
  changeLog: any;
  noOfSaleinViewPipeline: number;
  noOfStages: number;
  allSubUsers: any[] = [];
  tasks: Task[];
  followUps: FollowUps[];
  userName: string;
  branches = [];
  alertPopupStatus: boolean = false; // to open the alert dialoge once
  plan: string = ''; //plan of superuser
  agedFilterSet: boolean = false; //Field to check if aged filter has been set or not
  taskStatusOption: any;
  lastStatusoption: any;
  taskDefaultOption: any = ['Open', 'Completed'];
  contactDetails = null;
  salePipelines: Pipelines[] = []; //sale pipelines

  constructor(
    private salesService: SaleService,
    public dialog: MatDialog,
    private router: Router,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private snack: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    private viewServiceService: ViewServiceService,
    public commonListDataService: CommonListDataService
  ) {
    this.documentsArray = new MatTableDataSource([]);
    this.salesArray = new MatTableDataSource([]);
    this.array1 = new MatTableDataSource([]);
    this.array2 = new MatTableDataSource([]);
  }
  ngOnInit() {
    let defaultViewset = true; // to block changinf the view if userdatas are changed
    this.commonServSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          if (allData.userDetails.enableLiteMode) {
            this.router.navigate(['dash/sale-list']);
          } else {
            {
              //if there is multiple pipeline access, show all five pipelines else show single pipeline
              this.salePipelines = JSON.parse(
                JSON.stringify(allData.salePipelines)
              );
              if (this.commonService.userPlan.multiPipelineAccess) {
                // do nothing
                this.pipelineActive = true;
              } else {
                this.salePipelines.length = 1;
              }
              // assigning fetched datas to local variables
              this.usrProfileData = allData.usrProfileData;
              this.userId = allData.userId;
              this.userName = allData.userDetails.lastname
                ? allData.userDetails.firstname +
                  ' ' +
                  allData.userDetails.lastname
                : allData.userDetails.firstname;
              let userData = allData.userDetails;
              this.branches = allData.branches;
              this.superUserId = userData.superUserId;
              if (allData.superUserDetails?.fieldNames?.fieldNameOrganization) {
                this.fieldNameOrganization =
                  allData.superUserDetails.fieldNames.fieldNameOrganization;
              }
              this.taskStatusOption = allData.superUserDetails.taskStatusOpn
                ? allData.superUserDetails.taskStatusOpn
                : this.taskDefaultOption;
              this.lastStatusoption =
                this.taskStatusOption[this.taskStatusOption.length - 1];
              this.createDate = userData?.createdDate;
              if (allData.userDetails.saleViewSettings) {
                this.viewSettingArray = JSON.parse(
                  JSON.stringify(allData.userDetails.saleViewSettings)
                ); //View setting array for customer list
                this.viewSettingSelected =
                  this.viewSettingArray[this.commonListDataService.saleViewId]; // particular view selected
              } else {
                this.viewSettingSelected =
                  this.viewSettingArray[this.commonListDataService.saleViewId]; // particular view selected
              }
              this.allSubUsers = this.commonService.createUserlist(
                'All',
                'any'
              )[1];
              this.subusersToDisplay = this.allSubUsers;
              this.subusersToDisplay = this.subusersToDisplay.filter(function (
                e
              ) {
                return e.status != 'suspended';
              });
              [this.allUsersId, this.userDetailsAll] =
                this.commonService.createUserlist('All', 'any'); //create list of all subusers

              this.userFirstName = allData.superUserDetails.firstname;
              this.userLastName = allData.superUserDetails.lastname;
              this.orderWonCheck = allData.superUserDetails.orderWonCheck;
              if (allData.userDetails.lastname) {
                this.userFullName =
                  allData.userDetails.firstname +
                  ' ' +
                  allData.userDetails.lastname;
              } else {
                this.userFullName = allData.userDetails.firstname;
              }
              this.superUserDetails = allData.superUserDetails;
              this.userDetails = allData.userDetails;
              this.accountType = allData.userDetails.accountType;

              if (this.superUserDetails) {
                // assigning super user details to local variables
                if (this.superUserDetails.fieldNames) {
                  this.fieldNameSale =
                    this.superUserDetails.fieldNames.fieldNameSale;
                  this.fieldNameContact =
                    this.superUserDetails.fieldNames.fieldNameContact;
                  this.fieldNameSaleNotes = this.superUserDetails.fieldNames
                    .fieldNameSaleNotes
                    ? this.superUserDetails.fieldNames.fieldNameSaleNotes
                    : 'Note';
                  this.fieldNameTask =
                    this.superUserDetails.fieldNames.fieldNameTask;
                  this.fieldNameItems =
                    this.superUserDetails.fieldNames.fieldNameItems;
                  this.fieldNameFollowup =
                    this.superUserDetails.fieldNames.fieldNameFollowup;
                  this.fieldNameEstimate =
                    this.superUserDetails.fieldNames.fieldNameEstimate;
                  this.fieldNameQuotation =
                    this.superUserDetails.fieldNames.fieldNameQuotation;
                  this.fieldNameInvoice =
                    this.superUserDetails.fieldNames.fieldNameInvoice;
                }

                this.fieldListArray = this.superUserDetails.customFieldsSale;
              }
              [this.cardFields, this.displayFields] =
                this.commonService.getCardFields(
                  'sale',
                  this.fieldNameSaleNotes,
                  this.fieldNameFollowup
                );
              //customisation contact field
              if (
                allData.superUserDetails.contactSettings &&
                typeof allData.superUserDetails.contactSettings !==
                  'undefined' &&
                allData.superUserDetails.contactSettings !== null
              ) {
                this.contactSettings = allData.superUserDetails.contactSettings;
              }
              if (
                allData.superUserDetails.saleSettings &&
                typeof allData.superUserDetails.saleSettings !== 'undefined' &&
                allData.superUserDetails.saleSettings !== null
              ) {
                this.fieldSettings = allData.superUserDetails.saleSettings;
              }
              if (allData.superUserDetails.actSaleAgeing) {
                // check for sale ageing is activated
                this.actSaleAgeing = allData.superUserDetails.actSaleAgeing;
              }
              this.plan = allData.superUserDetails.plan;
              //if there is multiple pipeline access, show all five pipelines else show single pipeline
              var result = this.salePipelines.filter((obj) => {
                return (
                  obj.pipelineId ===
                  this.commonListDataService.selectedSalePipeline
                );
              });
              if (
                result.length === 0 &&
                this.commonListDataService.selectedSalePipeline !=
                  'All Pipelines'
              ) {
                // if pipeline is not selected assign first pipeline
                this.commonListDataService.selectedSalePipeline =
                  this.salePipelines[0].pipelineId;
              }
              if (this.commonListDataService.pipelineSaleSelection) {
                // if pipeline array is not there
                this.commonListDataService.pipelineSaleSelection =
                  this.commonService.getPipelineNames(
                    modules.sales,
                    this.commonListDataService.selectedSalePipeline
                  );
              }
              this.getStatusAndAgeFn();
              this.noOfStages = this.saleStatus?.length - 1;
              if (allData.userDetails.displaySaleColumns) {
                this.displayColumnsSaved =
                  allData.userDetails.displaySaleColumns;
              }
              if (this.displayColumnsSaved.length > 0) {
                //if table settings are stored in db, use the stored data
                this.columns = this.displayColumnsSaved;
                // remove select column if settings already saved in DB
                var ind = this.columns.findIndex(
                  (p) => p.columnDef == 'select'
                );
                if (ind > -1) {
                  this.columns.splice(ind, 1);
                }
              } else {
                this.columns = SaleTableColumns;
              }
              [this.userIdsArray, this.userNamesArray] =
                this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names

              //get the details of user profile assigned to the user
              if (this.usrProfileData) {
                this.dataAccessRule = this.usrProfileData.saleDataAccessRule;
                // disable addSale and sale view
                if (this.usrProfileData.isCheckedSale == false) {
                  this.disableSales = true;
                  this.commonService.addDocLimitaion.addSaleDisable = true;
                  this.disableSaleView = true;
                  this.disableSaleEdit = true;
                  this.disableSaleDownload = true;
                  this.disableReAssign = true;
                } else {
                  if (this.usrProfileData.salesCreate == false) {
                    this.disableSales = true;
                    this.commonService.addDocLimitaion.addSaleDisable = true;
                  }
                  if (this.usrProfileData.salesView == false) {
                    this.disableSaleView = true;
                  }
                  if (this.usrProfileData.salesEdit == false) {
                    this.disableSaleEdit = true;
                  }
                  if (this.usrProfileData.salesDownload == false) {
                    this.disableSaleDownload = true;
                  }
                  if (this.usrProfileData.saleReAssign == false) {
                    this.disableReAssign = true;
                  }
                }

                // disable followups
                if (this.usrProfileData.isCheckedFoll == false) {
                  this.disableFoll = true;
                } else {
                  if (this.usrProfileData.follCreate == false) {
                    this.disableFoll = true;
                  }
                }

                // disable documents
                if (this.usrProfileData.isCheckedSalesEst == false) {
                  this.disableDocCreateEst = true;
                } else {
                  if (this.usrProfileData.salesDCreateEst == false) {
                    this.disableDocCreateEst = true;
                  }
                }
                if (this.usrProfileData.isCheckedSalesQuot == false) {
                  this.disableDocCreateQuot = true;
                } else {
                  if (this.usrProfileData.salesDCreateQuot == false) {
                    this.disableDocCreateQuot = true;
                  }
                }
                if (this.usrProfileData.isCheckedSalesInv == false) {
                  this.disableDocCreateInv = true;
                } else {
                  if (this.usrProfileData.salesDCreateInv == false) {
                    this.disableDocCreateInv = true;
                  }
                }

                if (userData.accountType == 'SuperUser') {
                  this.displayedColumns = [
                    'select',
                    'sequenceNumber',
                    'saleTitle',
                    'firstName',
                    'estimatedValue',
                    'selectedSalePipeline',
                    'salesStage',
                    'assignedToName',
                    'startDate',
                    'endDate',
                    'invoicedAmount',
                    'collectedAmount',
                  ];
                } else {
                  this.displayedColumns = [
                    'sequenceNumber',
                    'saleTitle',
                    'firstName',
                    'estimatedValue',
                    'selectedSalePipeline',
                    'salesStage',
                    'assignedToName',
                    'startDate',
                    'endDate',
                    'invoicedAmount',
                    'collectedAmount',
                  ];
                }

                if (this.usrProfileData.saleDataAccessRule) {
                  let accessRule = '';
                  accessRule = this.usrProfileData.saleDataAccessRule;
                  this.dataAccessRuleCheck =
                    this.usrProfileData.saleDataAccessRule;
                  [this.userIdArray, this.subUsers] =
                    this.commonService.createUserlist(accessRule, this.userId);
                }
                // to set the view based on the default view saved in db.
                // at the first time the block will excute also then if customerView changed in current user, any other changes in super/current user will not enter to this block
                if (
                  (allData.userDetails.saleDefaultView &&
                    defaultViewset &&
                    this.commonListDataService.saleView ==
                      this.commonListDataService.saleDefaultView) ||
                  (allData.userDetails.saleDefaultView &&
                    allData.userDetails.saleDefaultView !=
                      this.commonListDataService.saleDefaultView)
                ) {
                  this.commonListDataService.saleView =
                    allData.userDetails.saleDefaultView;
                  this.commonListDataService.saleDefaultView =
                    allData.userDetails.saleDefaultView;
                  defaultViewset = false;
                }
                if (this.commonListDataService.saleView == 'grid') {
                  if (
                    this.commonListDataService.pipelineSaleSelection ===
                    'All Pipelines'
                  ) {
                    this.commonListDataService.selectedSalePipeline =
                      this.salePipelines[0].pipelineId; // set it to firstpipeline for grid view
                    this.commonListDataService.pipelineSaleSelection =
                      this.commonService.getPipelineNames(
                        modules.sales,
                        this.salePipelines[0].pipelineId
                      );
                    this.pipelineChangedEvent();
                  }
                }
                this.getViewData();
              }
            }
          }
        }
      }
    );
  }
  async editSale(taskId) {
    await this.getSale(taskId);
    this.commonService.updateSaleToEdit(this.selectedSale);
    this.dialog.open(Addnewsale1Component, {
      width: '800px',
      height: 'auto',
      disableClose: true,
      data: { scenario: 'edit', id: taskId },
    });
  }
  getSale(id) {
    return new Promise<void>((resolve) => {
      // console.log('fetch sale from DB');
      this.salesService
        .getSale(this.superUserId, id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((task) => {
          this.selectedSale = task;
          resolve();
        });
    });
  }
  // create invoice-web
  createInvoice(saleId, customerId, orgId) {
    //create an invoice for a paritcular sale ID

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
  //function to sort card data when sort field is changed
  viewChanged(viewIndex) {
    this.commonListDataService.saleViewId = viewIndex;
    this.viewSettingSelected =
      this.viewSettingArray[this.commonListDataService.saleViewId]; // particular view selected
    this.alertPopupStatus = false; // popup status set as false to open poup if next view contactins deletd add field
    this.commonListDataService.saleListDataLoaded = false;
    this.getViewData();
    this.getNoOfRecords();
    this.selection.clear(); //clear select of table
  }
  getViewData() {
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
      if (this.saleSubscription && !this.saleSubscription.closed) {
        this.saleSubscription.unsubscribe();
      }
      this.saleSubscription = this.commonListDataService
        .getSaleListListener()
        .subscribe((data) => {
          if (this.commonListDataService.saleListDataLoaded) {
            this.filteredSale = data;

            this.saleFilter = this.filteredSale;
            this.documentsArray.data = this.filteredSale;
            this.salesArray.data = this.filteredSale;
            this.array2.data = this.filteredSale;

            //If any filter was active, reapply the filter to make sure that filter does not get reset automatically on subscription update
            if (this.secondaryFilterSet == true) {
              this.secondaryFilter(
                this.secondaryFilterField,
                this.secondaryFilterValue
              );
            }
            if (this.agedFilterSet == true) {
              this.aged_secondaryFilter();
            }
            //If any custom sorting by field was active, reapply the filter to make sure that filter does not get reset automatically on subscription update
            this.getNoOfRecords();
            if (this.sortOrderSet == true) {
              this.setSortOrder(this.sortOrder);
            }
            //If any custom sorting by order was active, reapply the filter to make sure that filter does not get reset automatically on subscription update

            if (this.sortCardFieldSet == true) {
              this.sortCardField(this.sortBy);
            }

            this.filterDataByPipeline(
              this.commonListDataService.selectedSalePipeline
            );
            // this.getFiltered(this.filteredSale);
            this.saleLoaded = true;
            this.progressBarStatus = true;
            this.changeDetectorRef.detectChanges();
          }
        });
      if (!this.commonListDataService.saleListDataLoaded) {
        if (
          this.commonListDataService.saleSubscription &&
          !this.commonListDataService.saleSubscription.closed
        ) {
          this.commonListDataService.saleSubscription.unsubscribe();
        }
        this.commonListDataService.getSaleList(
          this.superUserId,
          queryData,
          this.userIdArray,
          this.usrProfileData.saleDataAccessRule,
          this.userId,
          this.subUsers,
          this.sortField,
          this.sortOrder,
          this.viewSettingSelected
        );
      }
    } else {
      this.progressBarStatus = true;
    }
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
  filterDataByPipeline(pipelineId) {
    if (this.commonListDataService.selectedSalePipeline === 'All Pipelines') {
      // do nothing
      //this.documentsArray.data = this.filteredSale;
    } else {
      this.documentsArray.data = this.documentsArray.data.filter(function (e) {
        return e.selectedSalePipeline === pipelineId;
      });
    }
  }
  secondaryFilter(field, value) {
    this.secondaryFilterSet = true;
    this.secondaryFilterField = field;
    this.secondaryFilterValue = value;
    let filteredData = [];
    filteredData = this.filteredSale.filter((record) => {
      return record[field] === value;
    });
    this.saleFilter = filteredData;
    this.documentsArray.data = filteredData;
    this.filterDataByPipeline(this.commonListDataService.selectedSalePipeline);
  }
  aged_secondaryFilter() {
    let filteredData = [];
    filteredData = this.filteredSale.filter((record) => {
      return this.getAgedStatus(record);
    });
    this.agedFilterSet = true;
    this.saleFilter = filteredData;
    this.documentsArray.data = filteredData;
    this.filterDataByPipeline(this.commonListDataService.selectedSalePipeline);
    this.selection.clear(); //clear select of table
  }
  //function to sort card data when sort order is changed
  setSortOrder(order) {
    this.sortOrderSet = true;
    this.sortOrder = order;
    this.saleFilter = this.commonService.sortData(
      this.saleFilter,
      this.sortField,
      this.sortOrder
    );
  }
  //function to sort card data when sort field is changed
  sortCardField(field) {
    this.sortCardFieldSet = true;
    if (!!field) {
      this.saleFilter = this.commonService.sortData(
        this.saleFilter,
        field,
        this.sortOrder
      );
    }
  }
  //Function to open the popup to edit views
  editView(mode) {
    //call the popup for card field customization
    this.dialogRef = this.dialog.open(ViewBuilderComponent, {
      data: [
        'sales',
        this.commonListDataService.saleViewId,
        mode,
        this.cardFields,
      ],
      width: 'auto',
    });
    this.dialogRef.afterClosed().subscribe((res) => {
      // Receive data from dialog component
      // If new view has been added, then read the new view and load data
      if (res.response == 'Add') {
        this.commonListDataService.saleViewId =
          this.viewSettingArray.length - 1;
        this.viewSettingSelected =
          this.viewSettingArray[this.commonListDataService.saleViewId];
        this.commonListDataService.saleListDataLoaded = false;
        this.getViewData();
        this.selection.clear(); //clear select of table
      } else {
        this.commonListDataService.saleListDataLoaded = false;
        this.viewSettingSelected =
          this.viewSettingArray[this.commonListDataService.saleViewId];
        this.selection.clear(); //clear select of table
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
          this.viewSettingArray[this.commonListDataService.saleViewId].viewName,
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res == 'deleted') {
        // if delete clicked delete the view from viewsetting array and if view number is greater than 0 then minius 1 to view number and update view
        this.viewSettingArray.splice(this.commonListDataService.saleViewId, 1);
        if (this.commonListDataService.saleViewId > 0) {
          this.commonListDataService.saleViewId =
            this.commonListDataService.saleViewId - 1;
        }
        this.selection.clear(); //clear select of table
        this.commonListDataService.saleListDataLoaded = false;
        this.viewServiceService
          .onSaveView(this.userId, this.viewSettingArray, 'sales')
          .then((res) => {
            this.snack.open('View has been deleted', '', { duration: 2000 });
          });
      }
    });
  }
  getFieldValue(field, data) {
    return this.commonService.getFieldValue(field, data, modules.sales);
  }
  customizeCardContent(module) {
    //call the popup for card field customization
    this.dialogRef = this.dialog.open(CardSettingsComponent, {
      data: ['sale', this.cardFields, this.fieldListArray],
      width: '600px',
    });
  }
  initStageCollapseArray() {
    this.stageCollapseArray = [];
    this.saleStatus.forEach((element) => {
      this.stageCollapseArray.push(false);
    });
  }
  //Function to get stages and corresponding ages for selected pipeline
  getStatusAndAgeFn() {
    if (this.commonListDataService.selectedSalePipeline !== 'All Pipelines') {
      //based on pipeline selected filter stages and age
      var result = this.salePipelines.filter((obj) => {
        return (
          obj.pipelineId === this.commonListDataService.selectedSalePipeline
        );
      });
      let statusArray;
      if (result.length > 0) {
        statusArray = result[0].pipelineStages.map(({ stageId, age }) => ({
          stageId,
          age,
        }));
      }
      this.saleStatus = statusArray?.map(({ stageId }) => {
        return stageId;
      });

      this.saleStatusAge = statusArray?.map(({ age }) => {
        return age;
      });
      this.initStageCollapseArray();
    }
  }
  getNoOfRecords() {
    this.noOfSaleinViewPipeline = this.saleFilter.length;
    if (this.commonListDataService.selectedSalePipeline != 'All Pipelines') {
      this.noOfSaleinViewPipeline = this.saleFilter.filter(
        (data) =>
          data.selectedSalePipeline ===
          this.commonListDataService.selectedSalePipeline
      ).length;
    }
  }
  pipelineChangedEvent() {
    if (this.commonListDataService.selectedSalePipeline == 'All Pipelines') {
      this.commonListDataService.pipelineSaleSelection = 'All Pipelines';
    }
    this.documentsArray.data = this.filteredSale;
    this.getStatusAndAgeFn();
    this.filterDataByPipeline(this.commonListDataService.selectedSalePipeline);
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
    this.noOfStages = this.saleStatus.length - 1;
    this.getNoOfRecords();
    this.selection.clear(); //clear select of table
  }
  // reassign contact to subuser
  onSubUserAssigned(selected, subUserId, firstName, secondName, branchId) {
    let assignedToName = secondName ? firstName + ' ' + secondName : firstName;
    let userId = this.superUserId;
    if (this.selection.selected.length > 0) {
      this.selection.clear(); //clear select of table
    }
    const dialogRef = this.dialog.open(ReassignFromSale, {
      width: '500px',
      minHeight: '100px',
      disableClose: true,
      data: {
        fieldNameSale: this.fieldNameSale,
        fieldNameTask: this.fieldNameTask,
        fieldNameFollowup: this.fieldNameFollowup,
        assignedToName: assignedToName,
        checked: false,
        selected,
        subUserId,
        branchId,
        superUserId: this.superUserId,
        branches: this.branches,
        userId: this.userId,
        userName: this.userName,
        fieldNameEstimate: this.fieldNameEstimate,
        fieldNameQuotation: this.fieldNameQuotation,
        fieldNameInvoice: this.fieldNameInvoice,
        lastStatus: this.lastStatusoption,
      },
    });
  }
  // data for drag and drop part in list view
  getFilteredData(docData, stage) {
    if (docData) {
      if (this.pipelineActive === true) {
        const pipelineSel = docData.filter(
          (data) =>
            data.selectedSalePipeline ===
            this.commonListDataService.selectedSalePipeline
        );

        const dataSale = pipelineSel.filter(
          (data) => data.salesStage === stage
        );

        return dataSale;
      } else {
        const dataSale = docData.filter((data) => data.salesStage === stage);

        return dataSale;
      }
    }
  }
  // status for drag and drop section in list view
  getFilteredStatus(docData, stage) {
    let dataSaleStatus = docData.filter((data) => data != stage);
    return dataSaleStatus;
  }
  // drag and drop and thus update status in sale slist view
  drop(event: CdkDragDrop<Sales[]>) {
    let datePlaced = new Date().getTime();
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      //let saleId = event.previousContainer.data[event.previousIndex].id;
      let saleId = event.item.data.id;
      //Update the status of the sale which has been dropped to new stage in front end so that delay updating db doesnot cause the card to jump back to previous stage and then get updated
      // if won stage, open popup confirm products
      // else if lost stage open popup - ChangesalestatdialogComponent
      if (
        event.container.id === this.saleStatus[this.saleStatus.length - 2] &&
        this.orderWonCheck === true
      ) {
        // we have to show a confirmation of products
        const dialogRef = this.dialog.open(ConfirmProducts, {
          // width: '300px',
          data: {
            userId: this.userId,
            userName: this.userFullName,
            fieldNameItems: this.fieldNameItems,
            superUserId: this.superUserId,
            saleID: saleId,
            saleStatus: this.saleStatus,
            currentHistory:
              event.previousContainer.data[event.previousIndex].stageHistory,
            status: event.container.id,
            prevStatus: event.previousContainer.id,
            changeLog:
              event.previousContainer.data[event.previousIndex].changeLog,
            pipelineId: this.commonListDataService.selectedSalePipeline,
            statusName: this.commonService.getStatusName(
              modules.sales,
              this.commonListDataService.selectedSalePipeline,
              event.container.id
            ),
          },
        });
        // if drag and drop to lost stage column, need to show popup to enter reason for rejection
        //  if reason for rejection display is true
      } else if (
        this.fieldSettings.rejectionReasonVal?.display === true &&
        event.container.id === this.saleStatus[this.saleStatus.length - 1]
      ) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        let changeLogParams = {
          constructorName: this.constructor.name,
          userId: this.userId,
          userName: this.userName,
          prevSalesStage: this.commonService.getStatusName(
            modules.sales,
            this.commonListDataService.selectedSalePipeline,
            event.previousContainer.id
          ),
          curSalesStage: this.commonService.getStatusName(
            modules.sales,
            this.commonListDataService.selectedSalePipeline,
            event.container.id
          ),
          changeLog:
            event.previousContainer.data[event.previousIndex].changeLog,
        };

        dialogConfig.data = {
          userId: this.superUserId,
          saleId: saleId,
          status: event.container.id,
          saleStatus: this.commonService.getStatusArray(
            modules.sales,
            this.commonListDataService.selectedSalePipeline
          ),
          currentStage: event.previousContainer.id,
          currentHistory:
            event.previousContainer.data[event.previousIndex].stageHistory,
          fieldNameSale: this.fieldNameSale,
          changeLogParams: changeLogParams,
          rejectionReasonArr:
            this.fieldSettings?.rejectionReason?.rejectionReason?.split(','), //reason for rejection options saved as array
          rejectionReasonMandatory:
            this.fieldSettings.rejectionReasonVal.mandatory, //reason for rejection mandatory check
          rejectionReasonDisplay: this.fieldSettings.rejectionReasonVal.display, //whether to display/not reason for rejection
          disableReAssign: this.disableSaleEdit,
          pipelineId: this.commonListDataService.selectedSalePipeline,
          statusName: this.commonService.getStatusName(
            modules.sales,
            this.commonListDataService.selectedSalePipeline,
            event.container.id
          ),
          statusFieldName: this.fieldSettings.salesStage.displayName,
        };

        this.dialog.open(ChangesalestatdialogComponent, dialogConfig);
      } else {
        let i = 0;
        for (i = 0; i < this.saleFilter.length - 1; i++) {
          if (this.saleFilter[i].id == saleId) {
            this.saleFilter[i].salesStage = event.container.id;
            break;
          }
        }

        // stageHistory part
        let currentHistory = event.item.data.stageHistory;
        this.stageValues.date = datePlaced;
        this.stageValues.stageId = event.container.id;
        this.stageValues.pipelineId =
          this.commonListDataService.selectedSalePipeline;
        currentHistory.push(this.stageValues);
        this.stageHistories = currentHistory;

        let prevObj = {
          salesStage: this.commonService.getStatusName(
            modules.sales,
            this.commonListDataService.selectedSalePipeline,
            event.previousContainer.id
          ),
        };
        let currObj = {
          salesStage: this.commonService.getStatusName(
            modules.sales,
            this.commonListDataService.selectedSalePipeline,
            event.container.id
          ),
        };
        if (
          event.container.id === this.saleStatus[this.saleStatus.length - 1]
        ) {
          this.lost = true;
          this.won = false;
          this.inPipeline = false;
        } else if (
          event.container.id === this.saleStatus[this.saleStatus.length - 2]
        ) {
          this.lost = false;
          this.won = true;
          this.inPipeline = false;
        } else {
          this.lost = false;
          this.won = false;
          this.inPipeline = true;
        }

        this.salesService.onUpdateSaleStatus(
          this.superUserId,
          saleId,
          event.container.id,
          this.stageHistories,
          datePlaced,
          this.inPipeline,
          this.won,
          this.lost,
          '',
          ChangeLogComponent.saveLog(
            this.constructor.name,
            this.userId,
            this.userFullName,
            prevObj,
            currObj,
            this.saleFilter[i].changeLog
          )
        );
      }
    }
  }
  // list view selection
  onToggle() {
    this.selection.clear(); //clear select of table
    this.commonListDataService.saleView = 'grid';
    if (
      this.commonListDataService.pipelineSaleSelection === 'All Pipelines' ||
      this.commonListDataService.selectedSalePipeline === 'All Pipelines'
    ) {
      this.commonListDataService.selectedSalePipeline =
        this.salePipelines[0].pipelineId;
      this.commonListDataService.pipelineSaleSelection =
        this.commonService.getPipelineNames(
          modules.sales,
          this.salePipelines[0].pipelineId
        );
      this.pipelineChangedEvent();
    }
  }
  // table view selection
  onToggleTab() {
    this.commonListDataService.saleView = 'table';
    // this.documentsArray.data = this.salesArray.data;
    /*this.array2.data = this.salesArray.data;
    this.saleFilter = this.salesArray.data;
    this.fileteredBy = null;
    this.isFilterApplied = false;*/
  }
  // filter by priority
  checkPriority() {
    this.filters = [];
    if (this.checkedLow) {
      this.filters.push('Low');
    } else {
      let index = this.filters.findIndex((s) => s === 'Low');
      if (index >= 0) {
        this.filters.splice(index, 1);
      }
    }
    if (this.checkedMedium) {
      this.filters.push('Medium');
    } else {
      let index = this.filters.findIndex((s) => s === 'Medium');
      if (index >= 0) {
        this.filters.splice(index, 1);
      }
    }

    if (this.checkedHigh) {
      this.filters.push('High');
    } else {
      let index = this.filters.findIndex((s) => s === 'High');
      if (index >= 0) {
        this.filters.splice(index, 1);
      }
    }
    let emptyArray = new MatTableDataSource([]);
    this.filters.forEach((element) => {
      this.salesArray.data.forEach((item) => {
        if (item.priority?.toLowerCase().includes(element.toLowerCase())) {
          emptyArray.data.push(item);
        }
      });
    });
    if (this.filters.length == 0) {
      emptyArray.data = this.salesArray.data;
    }

    this.documentsArray.data = emptyArray.data;
    this.saleFilter = emptyArray.data;
  }
  // filter by status
  checkStatus() {
    this.filtersSale = [];
    this.statusCheck.forEach((element) => {
      if (element.isChecked) {
        this.filtersSale.push(element.name);
      } else {
        let index = this.filtersSale.findIndex((s) => s === element.name);
        if (index >= 0) {
          this.filtersSale.splice(index, 1);
        }
      }
    });
    let emptyArraySale = new MatTableDataSource([]);
    this.filtersSale.forEach((element) => {
      this.salesArray.data.forEach((item) => {
        if (item.salesStage?.toLowerCase().includes(element.toLowerCase())) {
          emptyArraySale.data.push(item);
        }
      });
    });
    if (this.filtersSale.length == 0) {
      emptyArraySale.data = this.salesArray.data;
    }

    this.documentsArray.data = emptyArraySale.data;
  }
  // reset button action
  resetDate() {
    this.selection.clear(); //clear select of table
    this.secondaryFilterSet = false;
    this.fileteredBy = null;
    this.isFilterApplied = false;
    this.agedFilterSet = false;
    //this.filteredSale = this.sales;
    this.documentsArray.data = this.filteredSale;
    this.array2.data = this.salesArray.data;
    this.checkedLow = false;
    this.checkedMedium = false;
    this.checkedHigh = false;
    this.saleFilter = this.filteredSale;
    this.statusCheck.forEach((element) => {
      element.isChecked = false;
    });
    this.pipelineChangedEvent();
    this.documentsArray.filter = '';
    this.selectedDate1 = null;
    this.selectedDate2 = null;
    this.searchTerm = null;
    /*if (!this.toggle) {
      this.fileteredBy = 'Created Date This Week';
      this.onCreatedDateThisWeek();
    }*/
  }
  // on destroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.dialogSubscription?.unsubscribe();
    this.commonServSubscription?.unsubscribe();
    this.saleSubscription?.unsubscribe();
  }
  trackbySaleList(index: number, sale: Sales): string {
    return sale.id;
  }
  getAgedStatus(element) {
    // if age activation is there
    if (this.actSaleAgeing) {
      let today: Date = new Date();
      let input: Date;
      if (element.stageHistory.length > 0) {
        input = new Date(
          element.stageHistory[element.stageHistory.length - 1].date
        );
      } else {
        input = new Date(element.createdDate);
      }

      let daysinStage: number = Math.ceil(
        (today.getTime() - input.getTime()) / (1000 * 3600 * 24)
      ); //Calculate the number of days in current stage
      //find the index of stage in stage array
      const pipeLine = this.salePipelines.filter((obj) => {
        return obj.pipelineId === element.selectedSalePipeline;
      });
      if (pipeLine.length === 0) {
        return 'N/A';
      } else {
        let statusArray = pipeLine[0].pipelineStages;
        if (statusArray.length === 0) {
          return 'N/A';
        } else {
          let statusObj = statusArray.filter((obj) => {
            return obj.stageId === element.salesStage;
          });
          // status deleted case
          if (statusObj.length === 0) {
            return 'N/A';
          } else {
            let maxDaysinStage = statusObj[0].age;

            if (
              element.salesStage ===
                statusArray[statusArray.length - 1].stageId ||
              element.salesStage === statusArray[statusArray.length - 2].stageId
            ) {
              // if statusis in last two status return false... ageging is not need for last two status
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
  hideStage(i) {
    this.stageCollapseArray[i] = !this.stageCollapseArray[i];
  }
  // add task
  addTask(
    saleId,
    customerId,
    orgId,
    company,
    fname,
    sname,
    surname,
    saleTitle
  ) {
    this.dialog.open(CrudModal1Component, {
      width: '520px',
      height: 'auto',
      disableClose: true,
      data: {
        sid: saleId,
        cid: customerId,
        orgId: orgId,
        mode: 'saleCreate',
        company: company,
        firstName: fname,
        secondName: sname,
        surname: surname,
        saleName: saleTitle,
      },
    });
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
  async onCreateFollowUps(
    saleId,
    customerId,
    company,
    fname,
    sname,
    saleTitle,
    assignedTo,
    assignedToName,
    orgId,
    surname
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
    await this.getContact(customerId);
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: customerId,
        companyNames: company,
        customerNames: customerName,
        contactNumber: this.contactDetails.contactNo
          ? this.contactDetails.contactNo
          : '', // pass customer number
        countryCode: this.contactDetails.code ? this.contactDetails.code : '', // pass customer country code
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
  }
  onShowDialog(evt: MouseEvent, scenario): void {
    const target = new ElementRef(evt.currentTarget);
    const dialogRef = this.dialog.open(SelectSearchComponent, {
      panelClass: 'dialog-side-panel',
      data: {
        trigger: target,
        placeHolderText: 'Users',
        allSubUsers: this.subusersToDisplay,
      },
    });
    // on submit clicked
    const dialogSubmitSubscription =
      dialogRef.componentInstance.submitClicked.subscribe((userId: string) => {
        dialogSubmitSubscription.unsubscribe();
        if (userId) {
          this.selection.clear(); //clear select of table
          this.secondaryFilter(scenario, userId);
        }

        this.changeDetectorRef.detectChanges();
      });
  }
}

// re-assign-sale starts here
@Component({
  selector: 'reassign-from-sale',
  templateUrl: 'reassign-from-sale.html',
  styleUrls: ['./sale.component.scss'],
})
export class ReassignFromSale {
  spinner = false;
  reAssign = 're-assign';
  count = 0; //for reassign sale, no of sales is stored in this variable
  tasks: Task[] = [];
  followUps: FollowUps[] = [];
  invoices: Invoice[] = [];
  estimates: Invoice[] = [];
  quotations: Invoice[] = [];
  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.
  lastStatusOpn: any;

  constructor(
    public dialogRef: MatDialogRef<ReassignFromSale>,
    @Inject(MAT_DIALOG_DATA) public data,
    private salesService: SaleService,
    private snack: MatSnackBar
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  reAssignFn() {
    this.spinner = true;
    if (this.data.checked === true) {
      this.lastStatusOpn = this.data.lastStatus;
      this.data.selected.forEach(async (element) => {
        // 1fetch tasks and followups
        // 2.update in sales collection
        // 3.update in tasks and followUps

        await this.getTasks(element.id, element.assignedTo);
        await this.getFollowUps(element.id, element.assignedTo);

        await this.getEstimates(element.id, element.assignedTo);
        await this.getInvoices(element.id, element.assignedTo);
        await this.getQuotations(element.id, element.assignedTo);

        this.tasks.forEach((ele) => {
          if (ele.assignedTo != this.data.subUserId)
            this.salesService.onUpdateTask(
              this.data.superUserId,
              ele.id,
              this.data.subUserId,
              this.data.assignedToName,
              this.data.branchId,
              ChangeLogComponent.saveLog(
                'SaleComponent',
                this.data.userId,
                this.data.userName,
                {
                  assignedTo: ele.assignedTo,
                  assignedToName: ele.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === ele.associatedBranch
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === ele.associatedBranch
                            )?.name
                          : ''
                        : '',
                  }),
                },
                {
                  assignedTo: this.data.subUserId,
                  assignedToName: this.data.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === this.data.branchId
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                          : ''
                        : '',
                  }),
                },
                ele.changeLog
              )
            );
        }); //update in task collection

        this.followUps.forEach((ele) => {
          if (ele.assignedTo != this.data.subUserId)
            this.salesService.onUpdateFollowUp(
              this.data.superUserId,
              ele.id,
              this.data.subUserId,
              this.data.assignedToName,
              this.data.branchId,
              ChangeLogComponent.saveLog(
                'SaleComponent',
                this.data.userId,
                this.data.userName,
                {
                  assignedTo: ele.assignedTo,
                  assignedToName: ele.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === ele.associatedBranch
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === ele.associatedBranch
                            )?.name
                          : ''
                        : '',
                  }),
                },
                {
                  assignedTo: this.data.subUserId,
                  assignedToName: this.data.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === this.data.branchId
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                          : ''
                        : '',
                  }),
                },
                ele.changeLog
              )
            );
        }); //update in followups collection
        if (element.assignedTo != this.data.subUserId) {
          this.salesService
            .onUpdateSaleSub(
              this.data.superUserId,
              this.data.subUserId,
              element.id,
              this.data.assignedToName,
              this.data.branchId,
              ChangeLogComponent.saveLog(
                'SaleComponent',
                this.data.userId,
                this.data.userName,
                {
                  assignedTo: element.assignedTo,
                  assignedToName: element.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === element.associatedBranch
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === element.associatedBranch
                            )?.name
                          : ''
                        : '',
                  }),
                },
                {
                  assignedTo: this.data.subUserId,
                  assignedToName: this.data.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === this.data.branchId
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                          : ''
                        : '',
                  }),
                },
                element.changeLog
              )
            )
            .then((response) => {
              this.count++;
              if (this.count == this.data.selected.length) {
                // this.progressBarStatus = true;
                // this.data.selected.length = 0;
                // this.selection = new SelectionModel<Sales>(true, []);

                this.dialogRef.close();

                // mat snack bar
                this.snack.open('Re-assigning completed', '', {
                  duration: 2000,
                });
              }
            });
        } else {
          this.count++;
          if (this.count == this.data.selected.length) {
            this.dialogRef.close();

            // mat snack bar
            this.snack.open('Re-assigning completed', '', {
              duration: 2000,
            });
          }
        }
      });
    } else {
      this.data.selected.forEach(async (element) => {
        if (element.assignedTo != this.data.subUserId) {
          this.salesService
            .onUpdateSaleSub(
              this.data.superUserId,
              this.data.subUserId,
              element.id,
              this.data.assignedToName,
              this.data.branchId,
              ChangeLogComponent.saveLog(
                'SaleComponent',
                this.data.userId,
                this.data.userName,
                {
                  assignedTo: element.assignedTo,
                  assignedToName: element.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === element.associatedBranch
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === element.associatedBranch
                            )?.name
                          : ''
                        : '',
                  }),
                },
                {
                  assignedTo: this.data.subUserId,
                  assignedToName: this.data.assignedToName,
                  ...(this.data.branches.length > 0 && {
                    associatedBranch:
                      this.data.branches.length > 0
                        ? this.data.branches.find(
                            (item) => item.id === this.data.branchId
                          )?.name
                          ? this.data.branches.find(
                              (item) => item.id === this.data.branchId
                            )?.name
                          : ''
                        : '',
                  }),
                },
                element.changeLog
              )
            )
            .then((resp) => {
              this.count++;
              if (this.count == this.data.selected.length) {
                // this.progressBarStatus = true;
                // this.data.selected.length = 0;
                // this.selection = new SelectionModel<Sales>(true, []);
                this.dialogRef.close();

                // mat snack bar
                this.snack.open('Re-assigning completed', '', {
                  duration: 2000,
                });
              }
            });
        } else {
          this.count++;
          if (this.count == this.data.selected.length) {
            this.dialogRef.close();

            // mat snack bar
            this.snack.open('Re-assigning completed', '', {
              duration: 2000,
            });
          }
        }
      });
    }
  }
  getTasks(id, assignedTo) {
    return new Promise<void>((resolve) => {
      this.salesService
        .getTaskswithSale(
          this.data.superUserId,
          id,
          assignedTo,
          this.lastStatusOpn
        )
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.tasks = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Task;
          });
          resolve();
        });
    });
  }
  getFollowUps(id, assignedTo) {
    return new Promise<void>((resolve) => {
      this.salesService
        .getFollowUpsWithSale(this.data.superUserId, id, assignedTo)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.followUps = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as FollowUps;
          });
          resolve();
        });
    });
  }
  async getEstimates(id, assignedTo) {
    let estimates = await this.salesService.getDocsWithSale(
      this.data.superUserId,
      id,
      assignedTo,
      'Estimates'
    );
    estimates.forEach((ele) => {
      this.salesService.onUpdateDoc(
        this.data.superUserId,
        ele.id,
        this.data.subUserId,
        'Estimates'
      );
    }); //update in estimates collection
  }
  async getQuotations(id, assignedTo) {
    let quotations = await this.salesService.getDocsWithSale(
      this.data.superUserId,
      id,
      assignedTo,
      'Quotations'
    );
    quotations.forEach((ele) => {
      this.salesService.onUpdateDoc(
        this.data.superUserId,
        ele.id,
        this.data.subUserId,
        'Quotations'
      );
    }); //update in quotations collection
  }
  async getInvoices(id, assignedTo) {
    let invoices = await this.salesService.getDocsWithSale(
      this.data.superUserId,
      id,
      assignedTo,
      'Invoices'
    );
    invoices.forEach((ele) => {
      this.salesService.onUpdateDoc(
        this.data.superUserId,
        ele.id,
        this.data.subUserId,
        'Invoices'
      );
    }); //update in quotations collection
  }
}
// confirm on products starts here
@Component({
  selector: 'confirm-products',
  templateUrl: 'confirm-products.html',
  styleUrls: ['./sale.component.scss'],
})
export class ConfirmProducts {
  spinner = true;
  update = 'update';
  prodArray = [];
  deletedProducts: any = {};
  addedProducts: any = {};
  products: ProductModel[] = []; //all products fetched in create sale to show in autocomplete
  selectedProduct: any = null;
  myControlProd = new FormControl();
  filteredOptionsProd: Observable<ProductModel[]>;
  addProdOption = false;
  // products fields
  productName: string;
  unitPrice: number;
  discount: number;
  quantity: number = 1;
  prod = new prodmodel();
  showFormOpt = false;
  tobeDeleteArray = [];
  prodArrayCopyForCancel = [];
  stageHistories: StageHistoryModel[] = []; //stage history array
  stageValues: StageHistoryModel = {
    date: null,
    stageId: null,
    pipelineId: null,
  }; //stage history model
  saleStatus = []; //sale stages of logged in user
  currentHistory: StageValues[] = null; //current history, if updating this is also has to be pushed
  inPipeline = false;
  won = false;
  lost = false;
  prevProdArray: any[];

  constructor(
    public dialogRef: MatDialogRef<ConfirmProducts>,
    @Inject(MAT_DIALOG_DATA) public data,
    private service: SaleService,
    private snackBar: MatSnackBar
  ) {
    if (data.superUserId) {
      this.service.getProducts(data.superUserId).subscribe((products) => {
        this.products = products.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as ProductModel;
        });

        this.filteredOptionsProd = this.myControlProd.valueChanges.pipe(
          startWith(''),

          map((value) => (typeof value === 'string' ? value : value.fname1)),
          map((fname1) =>
            fname1 ? this._filterProd(fname1) : this.products.slice()
          )
        );
      });
    }
    if (data.superUserId && data.saleID) {
      let first = true;
      this.service.getSale(data.superUserId, data.saleID).subscribe((data) => {
        if (data) {
          const saleProducts = Object.values(data?.itemsArray);
          this.prodArray = saleProducts.map(
            ({
              id,
              productId,
              quantity,
              discount,
              unitPrice,
              prodName,
              prodCategory,
            }) => ({
              id,
              productId,
              quantity,
              discount,
              unitPrice,
              prodName,
              prodCategory,
            })
          );
          this.prodArrayCopyForCancel = this.prodArray;
          this.spinner = false;
          if (first == true) {
            this.prevProdArray = JSON.parse(JSON.stringify(this.prodArray));
          }
          first = false;
        }
      });
    }
  }
  onNoClick(): void {
    this.prodArray = this.prodArrayCopyForCancel;
    this.dialogRef.close(); // close the dialogue
  }
  showForm() {
    this.showFormOpt = true;
  }
  productSelected() {
    if (this.selectedProduct !== null) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.selectedProduct.prodName === this.products[i].prodName) {
          this.addProdOption = true;
          this.prod = {
            id: 'id',
            productId: this.selectedProduct.id,
            prodName: this.selectedProduct.prodName,
            quantity: 1,
            discount: this.selectedProduct.discount,
            unitPrice: this.selectedProduct.unitPrice,
            prodCategory: this.selectedProduct.prodCategory,
          };
        }
      }
    } else {
      this.addProdOption = false;
    }
  }
  removeForm(index, obj) {
    this.deletedProducts[Object.keys(this.deletedProducts).length] = {
      id: this.prevProdArray[index].productId,
      prodName: this.prevProdArray[index].prodName,
      prodCategory: this.prevProdArray[index].prodCategory,
    };
    this.prevProdArray.splice(index, 1);
    this.prodArray.splice(index, 1);
    this.tobeDeleteArray.push(obj.id);
  }
  addProduct() {
    // check if product is selected
    this.prodArray.push(this.prod);
    this.prevProdArray.push(this.prod);
    this.addedProducts[Object.keys(this.addedProducts).length] = this.prod;
    this.selectedProduct = '';
    this.addProdOption = false;
  }
  clearSelection() {
    this.selectedProduct = '';
    this.addProdOption = false;
  }
  private _filterProd(value) {
    const filterValue = value.toLowerCase();
    return this.products.filter((option) =>
      option.prodName.toLowerCase().includes(filterValue)
    );
  }
  // autoComplete display function
  displayFnProduct(subject) {
    return subject ? subject.prodName : undefined;
  }
  onUpdate() {
    let datePlaced = new Date().getTime(); //Get TimeStamp;
    let statusArray = this.data.saleStatus;
    let currentHistory = this.data.currentHistory;
    const updatedArray = this.prodArray;
    //Corresponding to the new stage applied, identify the index number of the new stage in sale stage array in user profile settings and update the stage history array and stage name in db
    this.stageValues.date = datePlaced;
    this.stageValues.stageId = this.data.status;
    this.stageValues.pipelineId = this.data.pipelineId;
    currentHistory.push(this.stageValues);
    this.stageHistories = currentHistory;

    if (this.data.status === statusArray[statusArray.length - 1]) {
      this.lost = true;
      this.won = false;
      this.inPipeline = false;
    } else if (this.data.status === statusArray[statusArray.length - 2]) {
      this.lost = false;
      this.won = true;
      this.inPipeline = false;
    } else {
      this.lost = false;
      this.won = false;
      this.inPipeline = true;
    }
    this.service
      .onUpdateSaleStatus(
        this.data.superUserId,
        this.data.saleID,
        this.data.status,
        this.stageHistories,
        datePlaced,
        this.inPipeline,
        this.won,
        this.lost,
        '',
        ChangeLogComponent.saveLog(
          this.constructor.name,
          this.data.userId,
          this.data.userName,
          { status: this.data.prevStatus },
          { status: this.data.status },
          this.data.changeLog
        )
      )
      .then((res) => {
        let itemsArray = <ProductInSaleModel>{};
        /* Adding modified values to changeLog */
        let preVal = {};
        let curVal = {};
        let count = 0;

        /* Adding modified values to changeLog ends */
        updatedArray.forEach((doc, index) => {
          for (let i = 0; i < this.products.length; i++) {
            if (doc.productId === this.products[i].id) {
              itemsArray[index] = {
                prodName: this.products[i].prodName,
                hsnCode: this.products[i].hsnCode
                  ? this.products[i].hsnCode
                  : '',
                prodDes: this.products[i].prodDes,
                currency: this.products[i].currency,
                unitPrice: doc.unitPrice,
                unit: this.products[i].unit,
                quantity: doc.quantity,
                discount: doc.discount,
                cgst: this.products[i].cgst,
                sgst: this.products[i].sgst,
                igst: this.products[i].igst,
                vatRate: this.products[i].vatRate,
                taxType: this.products[i].taxType,
                productId: this.products[i].id,
                prodCategory: this.products[i].prodCategory
                  ? this.products[i].prodCategory
                  : '',
                additionalFieldsArr: this.products[i].additionalFieldsArr
                  ? this.products[i].additionalFieldsArr
                  : null,
              };

              if (this.prevProdArray[index].quantity != doc.quantity) {
                preVal[count] = {
                  quantity: this.prevProdArray[index].quantity,
                };
                curVal[count] = { quantity: doc.quantity };
              }
              if (this.prevProdArray[index].discount != doc.discount) {
                Object.assign(preVal[count], {
                  discount: this.prevProdArray[index].discount,
                });
                Object.assign(curVal[count], { discount: doc.discount });
              }
              if (this.prevProdArray[index].unitPrice != doc.unitPrice) {
                Object.assign(preVal[count], {
                  unitPrice: this.prevProdArray[index].unitPrice,
                });
                Object.assign(curVal[count], { unitPrice: doc.unitPrice });
              }
              if (preVal[count] && curVal[count]) {
                Object.assign(preVal[count], {
                  id: this.prevProdArray[index].productId,
                  productName: this.prevProdArray[index].prodName,
                });
                Object.assign(curVal[count], {
                  id: this.prevProdArray[index].productId,
                  productName: this.prevProdArray[index].prodName,
                });
                count = count + 1;
              }
            }
          }
        });
        let changeLog = this.data.changeLog;
        if (Object.keys(preVal).length && Object.keys(curVal).length) {
          changeLog = ChangeLogComponent.saveLog(
            this.constructor.name,
            this.data.userId,
            this.data.userName,
            { prodFormArray: preVal },
            { prodFormArray: curVal },
            this.data.changeLog
          );
        }
        if (Object.keys(this.addedProducts).length) {
          changeLog = ChangeLogComponent.saveLog(
            this.constructor.name,
            this.data.userId,
            this.data.userName,
            {},
            { addedProducts: this.addedProducts },
            changeLog
          );
        }
        if (Object.keys(this.deletedProducts).length) {
          changeLog = ChangeLogComponent.saveLog(
            this.constructor.name,
            this.data.userId,
            this.data.userName,
            {},
            { deletedProducts: this.deletedProducts },
            changeLog
          );
        }

        this.service.updateItemField(
          this.data.superUserId,
          this.data.saleID,
          itemsArray,
          changeLog
        ); //save to DB
      })
      .then((resp) => {
        this.dialogRef.close(true); // close the dialogue
        this.snackBar.open('Stage updated!', '', {
          duration: 500,
        });
      });
  }
}
