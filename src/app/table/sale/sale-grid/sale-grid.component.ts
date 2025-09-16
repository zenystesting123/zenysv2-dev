import { animate, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { CardSettingsComponent } from 'src/app/card-settings/card-settings.component';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { ChangesalestatdialogComponent } from 'src/app/changesalestatdialog/changesalestatdialog.component';
import { CommonService } from 'src/app/common.service';
import {
  DisplayColumn,
  Sales,
  StageHistoryModel,
  SubUsers,
  contactSettings,
  defaultContactSettings,
  defaultSaleSettings,
  modules,
  saleSettings,
} from 'src/app/data-models';
import { SaleTableColumns } from 'src/app/model/custom-report.model';
import { Pipelines } from 'src/app/model/pipeline.modal';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { ConfirmProducts } from 'src/app/sales-view/sale/sale.component';
import { StatusPopupComponent } from 'src/app/settings/status-popup/status-popup.component';
import { SaleTableService } from '../sale-list/sale-table.service';
import { SaleGridService } from './sale-grid.service';
@Component({
  selector: 'app-sale-grid',
  templateUrl: './sale-grid.component.html',
  styleUrls: ['./sale-grid.component.scss'],
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
export class SaleGridComponent implements OnInit, OnDestroy {
  // pass the event to sale-list component so we can avoid duplication of same function in sale-litemode table/ grid and this component

  @Output() editSaleEvent = new EventEmitter<{ index: number, sale: Sales }>();
  @Output() addTaskEvent = new EventEmitter<Sales>();
  @Output() onCreateFollowUpsEvent = new EventEmitter<Sales>();
  @Output() onTableSettingsEvent = new EventEmitter<DisplayColumn[]>(); // customize table columns

  @Input() userId: string; //logged in users id
  @Input() superUserId: string = ''; //super user id of logged in user
  @Input() columnsDispaly = []; // all column in table
  @Input() disableSaleEdit: boolean = false; //based on access control, disable sale edit
  @Input() actSaleAgeing: boolean = false; // check for is ageing is activated
  @Input() saleSettings: saleSettings = defaultSaleSettings.CONST_VALUE; // conatct field name settings
  @Input() contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  @Input() selection = new SelectionModel<Sales>(true, []); // table selection
  @Input() customFieldsSale: any = []; // custom fields sale
  @Input() tableDefaultData = SaleTableColumns; // default column
  @Input() accountType: string = ''; //accountType of logged in user
  @Input() orderWonCheck: boolean; // orderWonCheck
  @Input() disableFoll = false;//disable create followup
  @Input() saleDataAccessRule: string; //contact data accees rule
  @Input() fieldNameFollowup: string = 'FollowUp';
  @Input() fieldNameTask: string = 'Task';
  @Input() fieldNameContact: string = 'Contact'; //customisable field name
  @Input() fieldNameSale: string = 'Sale';
  @Input() fieldNameOrganization = 'Organization';
  @Input() fieldNameItems: string = 'Products and Service';
  @Input() fieldNameEstimate: string = 'Estimate';
  @Input() fieldNameQuotation: string = 'Quotation';
  @Input() fieldNameInvoice: string = 'Invoice';
  @Input() fieldNameSaleNotes: string = 'Note';
  @Input() cardFields: any[]; // all card fields
  @Input() displayFields: any; // displaying card fields
  @Input() salePipelines: Pipelines[] = [];// sale pipeline array
  @Input() userName: string; //logged in users full name
  @Input() reload: boolean; // for display the grid view
  @Input() myViews: any = []; // list of my views
  @Input() publicViews: any = []; // list of public views
  @Input() branches = [];
  @Input() disableSaleDownload = false; //disabel download table
  @Input() disableDocCreateEst: boolean = false; //disable Sales Doc view
  @Input() disableDocCreateQuot: boolean = false; //disable Sales Doc view
  @Input() disableDocCreateInv: boolean = false; //disable Sales Doc view

  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.
  userIdsArray: any[] = []; // user id array
  //holds the sale array fetched from DB and stored in other arrays for filtering and reset purposes
  documentsArray: MatTableDataSource<Sales>;
  filteredSale: Sales[];
  saleFilter: Sales[];
  displayName: string = 'displaySaleColumns'; // table column fied name passed to report table
  tableName: string = 'Sale'; // table name passed to report table
  saleStatus: any = null; //sale stages under super user profile
  progressBarStatus: boolean = false; //progress bar status
  saleLoaded: boolean = false; //boolean to confirm DB fetch is completed
  stageHistories: any[];
  stageValues: StageHistoryModel = {
    date: null,
    stageId: null,
    pipelineId: null,
  };
  subUsers: SubUsers[] = []; //array of subusers under superuser
  saleStatusAge: any; // sale age number
  inPipeline = false;
  won = false;
  lost = false;
  stageCollapseArray = [];
  columns = [];
  userNamesArray: any[] = [];
  sortField: any;
  sortOrder: any;
  userIdArray: any;
  saleSubscription: Subscription;
  alertPopupStatus: boolean = false; // to open the alert dialoge once
  subscriptionOnViewChange: Subscription
  networkConnection: boolean; //to check network connection

  // secondaryFilterSet: boolean = false; //Field to check if secondary filter has been set or not
  // secondaryFilterField: any;
  // secondaryFilterValue: any;
  // sortOrderSet: boolean = false;
  // sortCardFieldSet: boolean = false;
  // sortBy: any;
  // noOfSaleinViewPipeline: number;
  // noOfStages: number;
  // agedFilterSet: boolean = false; //Field to check if aged filter has been set or not

  constructor(
    public dialog: MatDialog,
    private router: Router,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private changeDetectorRef: ChangeDetectorRef,
    public saleGridService: SaleGridService, public tableService: SaleTableService
  ) {
    this.documentsArray = new MatTableDataSource([]);
    this.subscriptionOnViewChange = this.saleGridService.onFunctionCall$.subscribe((data) => {
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
        this.saleGridService.onFunctionCall(""); // set onFunctionCallSource as empty
      }

    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.columnsDispaly = this.columnsDispaly;

  }
  //function to filter the data when pipeline is changed
  viewPipelineChanged() {
    this.progressBarStatus = false;
    this.changeDetectorRef.detectChanges();
    this.documentsArray.data = this.filteredSale;
    this.getStatusAndAgeFn();
    this.filterDataByPipeline(this.tableService.pipelineSaleSelection);
    this.selection.clear(); //clear select of table
    this.progressBarStatus = true;
    this.changeDetectorRef.detectChanges();
  }
  ngOnInit() {
    this.selection.clear();
    this.getStatusAndAgeFn();
    [this.userIdsArray, this.userNamesArray] =
      this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names

    if (this.saleDataAccessRule) {
      [this.userIdArray, this.subUsers] =
        this.commonService.createUserlist(this.saleDataAccessRule, this.userId);
    }

    if (this.saleGridService.saleViewSelected) {

      this.tableService.selectedStatus = ''; // reset selected status when filter changed
      this.tableService.secondViewSelected = this.saleGridService.saleViewSelected.viewName; // asisgn second view name

      this.tableService.viewSelected = this.tableService.secondViewSelected;
      this.getViewData();
    } else {
      if (this.myViews.length > 0) {
        this.saleGridService.saleViewSelected = this.myViews[0];
        this.tableService.selectedStatus = ''; // reset selected status when filter changed
        this.tableService.secondViewSelected = this.saleGridService.saleViewSelected.viewName; // asisgn second view name

        this.tableService.viewSelected = this.tableService.secondViewSelected;
        this.getViewData();
      } else if (this.publicViews.length > 0) {
        this.saleGridService.saleViewSelected = this.publicViews[0];
        this.tableService.selectedStatus = ''; // reset selected status when filter changed
        this.tableService.secondViewSelected = this.saleGridService.saleViewSelected.viewName; // asisgn second view name

        this.tableService.viewSelected = this.tableService.secondViewSelected;
        this.getViewData();
      } else {
        this.tableService.selectedStatus = ''; // reset selected status when filter changed
        this.tableService.secondViewSelected = 'To be converted'; // asisgn second view name

        this.tableService.viewSelected =
          this.tableService.secondViewSelected; // for displaying viewname in toolbar

        this.saleGridService.isOldModeVisible = false;
      }
    }


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
  viewChanged() {
    this.alertPopupStatus = false; // popup status set as false to open poup if next view contactins deletd add field
    this.getViewData();
    // this.getNoOfRecords();
    this.selection.clear(); //clear select of table
  }
  getViewData() {
    this.progressBarStatus = false;
    // open a popup if deleted additional field is used in custom view query
    if (
      this.saleGridService.saleViewSelected.primaryQuery.queryField ==
      'additionalFieldsArr' &&
      !this.customFieldsSale[this.saleGridService.saleViewSelected.primaryQuery.ind].isActive
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
      this.saleGridService.saleViewSelected.sortField.fieldType == 'Additional' &&
      !this.customFieldsSale[this.saleGridService.saleViewSelected.sortField.ind].isActive
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
      this.saleGridService.saleViewSelected.filters?.forEach((element) => {
        if (
          element.queryField == 'additionalFieldsArr' &&
          !this.customFieldsSale[element.ind].isActive
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
      this.saleGridService.saleViewSelected.primaryQuery
    );
    this.sortField = this.saleGridService.saleViewSelected.sortField;
    this.sortOrder = this.saleGridService.saleViewSelected.sortOrder;
    if (queryData) {
      if (this.saleSubscription && !this.saleSubscription.closed) {
        this.saleSubscription.unsubscribe();
      }
      this.saleSubscription = this.saleGridService.getSaleList(
        this.superUserId,
        queryData,
        this.userIdArray,
      ).subscribe((data) => {
        let dataRead = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Sales;
        });
        //If the primary query is based on createdBy field, then apply data access rule based on createdBy
        if (queryData.queryField == "createdBy") {
          if (
            this.saleDataAccessRule == 'Team' ||
            this.saleDataAccessRule == 'Own'
          ) {
            if (this.userIdArray) {
              dataRead = dataRead.filter((element) =>
                this.userIdArray.includes(element.createdBy)
              );
            } else {
              [this.userIdArray, this.subUsers] =
                this.commonService.createUserlist(
                  this.saleDataAccessRule,
                  this.userId
                );
                dataRead= dataRead.filter((element) =>
                this.userIdArray.includes(element.createdBy)
              );
            }
          } else if (this.saleDataAccessRule == 'Branch') {
            let branchId = this.commonService.getBranch(this.userId);
            dataRead = dataRead.filter(
              (element) => element.associatedBranch === branchId
            );
          }
        } else {
          //Filter records based on data access rule
          if (
            this.saleDataAccessRule == 'Team' ||
            this.saleDataAccessRule == 'Own'
          ) {
            if (this.userIdArray) {
              dataRead = dataRead.filter((element) =>
                this.userIdArray.includes(element.assignedTo)
              );
            } else {
              [this.userIdArray, this.subUsers] =
                this.commonService.createUserlist(
                  this.saleDataAccessRule,
                  this.userId
                );
                dataRead = dataRead.filter((element) =>
                this.userIdArray.includes(element.assignedTo)
              );
            }
          } else if (this.saleDataAccessRule == 'Branch') {
            let branchId = this.commonService.getBranch(this.userId);
            dataRead = dataRead.filter(
              (element) => element.associatedBranch === branchId
            );
          }

        }

        dataRead = this.commonService.sortData(
          dataRead,
          this.sortField,
          this.sortOrder
        );

        // check if filter is present
        if (this.saleGridService.saleViewSelected.filters.length > 0) {
          let filterData = this.saleGridService.saleViewSelected.filters;
          filterData.forEach((element) => {
            let filterQuery = this.commonService.getQueryData(element);
            dataRead = dataRead.filter((record) =>
              this.commonService.filterData(record, filterQuery)
            );
          });
        }
        this.saleGridService.saleList.next(dataRead as Sales[]);

        this.filteredSale = dataRead;

        this.saleFilter = this.filteredSale;
        this.documentsArray.data = this.filteredSale;

        // //If any filter was active, reapply the filter to make sure that filter does not get reset automatically on subscription update
        // if (this.secondaryFilterSet == true) {
        //   this.secondaryFilter(
        //     this.secondaryFilterField,
        //     this.secondaryFilterValue
        //   );
        // }
        // if (this.agedFilterSet == true) {
        //   this.aged_secondaryFilter();
        // }
        //If any custom sorting by field was active, reapply the filter to make sure that filter does not get reset automatically on subscription update
        // this.getNoOfRecords();
        // if (this.sortOrderSet == true) {
        //   this.setSortOrder(this.sortOrder);
        // }
        //If any custom sorting by order was active, reapply the filter to make sure that filter does not get reset automatically on subscription update

        // if (this.sortCardFieldSet == true) {
        //   this.sortCardField(this.sortBy);
        // }

        this.filterDataByPipeline(
          this.tableService.pipelineSaleSelection
        );
        // this.getFiltered(this.filteredSale);
        this.saleLoaded = true;
        this.progressBarStatus = true;
        this.changeDetectorRef.detectChanges();

      })
    } else {
      this.progressBarStatus = true;
    }
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
  filterDataByPipeline(pipelineId) {

    this.documentsArray.data = this.documentsArray.data.filter(function (e) {
      return e.selectedSalePipeline === pipelineId;
    });
    this.changeDetectorRef.detectChanges();
  }



  getFieldValue(field, data) {
    return this.commonService.getFieldValue(field, data, modules.sales);
  }
  customizeCardContent(module) {
    //call the popup for card field customization
    const dialogRef = this.dialog.open(CardSettingsComponent, {
      data: ['sale', this.cardFields, this.customFieldsSale],
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
    //based on pipeline selected filter stages and age
    var result = this.salePipelines.filter((obj) => {
      return (
        obj.pipelineId === this.tableService.pipelineSaleSelection
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


  // data for drag and drop part in list view
  getFilteredData(docData, stage) {
    if (docData) {
      if (this.commonService.userPlan.multiPipelineAccess) {
        const pipelineSel = docData.filter(
          (data) =>
            data.selectedSalePipeline ===
            this.tableService.pipelineSaleSelection
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
            userName: this.userName,
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
            pipelineId: this.tableService.pipelineSaleSelection,
            statusName: this.commonService.getStatusName(
              modules.sales,
              this.tableService.pipelineSaleSelection,
              event.container.id
            ),
          },
        });
        // if drag and drop to lost stage column, need to show popup to enter reason for rejection
        //  if reason for rejection display is true
      } else if (
        this.saleSettings.rejectionReasonVal?.display === true &&
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
            this.tableService.pipelineSaleSelection,
            event.previousContainer.id
          ),
          curSalesStage: this.commonService.getStatusName(
            modules.sales,
            this.tableService.pipelineSaleSelection,
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
            this.tableService.pipelineSaleSelection
          ),
          currentStage: event.previousContainer.id,
          currentHistory:
            event.previousContainer.data[event.previousIndex].stageHistory,
          fieldNameSale: this.fieldNameSale,
          changeLogParams: changeLogParams,
          rejectionReasonArr:
            this.saleSettings?.rejectionReason?.rejectionReason?.split(','), //reason for rejection options saved as array
          rejectionReasonMandatory:
            this.saleSettings.rejectionReasonVal.mandatory, //reason for rejection mandatory check
          rejectionReasonDisplay: this.saleSettings.rejectionReasonVal.display, //whether to display/not reason for rejection
          disableReAssign: this.disableSaleEdit,
          pipelineId: this.tableService.pipelineSaleSelection,
          statusName: this.commonService.getStatusName(
            modules.sales,
            this.tableService.pipelineSaleSelection,
            event.container.id
          ),
          statusFieldName: this.saleSettings.salesStage.displayName,
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
          this.tableService.pipelineSaleSelection;
        currentHistory.push(this.stageValues);
        this.stageHistories = currentHistory;

        let prevObj = {
          salesStage: this.commonService.getStatusName(
            modules.sales,
            this.tableService.pipelineSaleSelection,
            event.previousContainer.id
          ),
        };
        let currObj = {
          salesStage: this.commonService.getStatusName(
            modules.sales,
            this.tableService.pipelineSaleSelection,
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

        this.saleGridService.onUpdateSaleStatus(
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
            this.userName,
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
    this.saleGridService.saleView = 'grid';

  }
  // table view selection
  onToggleTab() {
    this.saleGridService.saleView = 'table';

  }



  // on destroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.saleSubscription?.unsubscribe();
    this.subscriptionOnViewChange?.unsubscribe();
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


  // sale edit function
  editSale(row) {
    const data = { index: 0, sale: row };
    this.editSaleEvent.emit(data);
  }
  // add task
  addTask(saleFiltered) {
    this.addTaskEvent.emit(saleFiltered);
  }
  // create followup
  onCreateFollowUps(sale) {
    this.onCreateFollowUpsEvent.emit(sale);
  }
  // table setting changed data is set in columnsDisplay
  onTableSettings(value) {
    this.columnsDispaly = value;
    this.onTableSettingsEvent.emit(value)
    this.changeDetectorRef.detectChanges();
  }
  // network check
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  // reset button action
  // resetDate() {
  //   this.selection.clear(); //clear select of table
  //   this.secondaryFilterSet = false;
  //   this.fileteredBy = null;
  //   this.isFilterApplied = false;
  //   this.agedFilterSet = false;
  //   //this.filteredSale = this.sales;
  //   this.documentsArray.data = this.filteredSale;
  //   this.array2.data = this.salesArray.data;
  //   this.checkedLow = false;
  //   this.checkedMedium = false;
  //   this.checkedHigh = false;
  //   this.saleFilter = this.filteredSale;
  //   this.statusCheck.forEach((element) => {
  //     element.isChecked = false;
  //   });
  //   this.pipelineChangedEvent();
  //   this.documentsArray.filter = '';
  //   this.selectedDate1 = null;
  //   this.selectedDate2 = null;
  //   this.searchTerm = null;
  //   /*if (!this.toggle) {
  //     this.fileteredBy = 'Created Date This Week';
  //     this.onCreatedDateThisWeek();
  //   }*/
  // }
  // secondaryFilter(field, value) {
  //   this.secondaryFilterSet = true;
  //   this.secondaryFilterField = field;
  //   this.secondaryFilterValue = value;
  //   let filteredData = [];
  //   filteredData = this.filteredSale.filter((record) => {
  //     return record[field] === value;
  //   });
  //   this.saleFilter = filteredData;
  //   this.documentsArray.data = filteredData;
  //   this.filterDataByPipeline(this.tableService.pipelineSaleSelection);
  // }
  // aged_secondaryFilter() {
  //   let filteredData = [];
  //   filteredData = this.filteredSale.filter((record) => {
  //     return this.getAgedStatus(record);
  //   });
  //   this.agedFilterSet = true;
  //   this.saleFilter = filteredData;
  //   this.documentsArray.data = filteredData;
  //   this.filterDataByPipeline(this.tableService.pipelineSaleSelection);
  //   this.selection.clear(); //clear select of table
  // }
  // getNoOfRecords() {
  //   this.noOfSaleinViewPipeline = this.saleFilter.length;
  //   if (this.tableService.pipelineSaleSelection != 'All Pipelines') {
  //     this.noOfSaleinViewPipeline = this.saleFilter.filter(
  //       (data) =>
  //         data.selectedSalePipeline ===
  //         this.tableService.pipelineSaleSelection
  //     ).length;
  //   }
  // }
  // pipelineChangedEvent() {
  //   if (this.tableService.pipelineSaleSelection == 'All Pipelines') {
  //     this.saleGridService.pipelineSaleSelection = 'All Pipelines';
  //   }
  //   this.documentsArray.data = this.filteredSale;
  //   this.getStatusAndAgeFn();
  //   this.filterDataByPipeline(this.tableService.pipelineSaleSelection);
  //   if (this.secondaryFilterSet == true) {
  //     this.secondaryFilter(
  //       this.secondaryFilterField,
  //       this.secondaryFilterValue
  //     );
  //   }
  //function to sort card data when sort order is changed
  // setSortOrder(order) {
  //   this.sortOrderSet = true;
  //   this.sortOrder = order;
  //   this.saleFilter = this.commonService.sortData(
  //     this.saleFilter,
  //     this.sortField,
  //     this.sortOrder
  //   );
  // }
  // //function to sort card data when sort field is changed
  // sortCardField(field) {
  //   this.sortCardFieldSet = true;
  //   if (!!field) {
  //     this.saleFilter = this.commonService.sortData(
  //       this.saleFilter,
  //       field,
  //       this.sortOrder
  //     );
  //   }
  // }
  //   if (this.sortOrderSet == true) {
  //     this.setSortOrder(this.sortOrder);
  //   }
  //   //If any custom sorting by order was active, reapply the filter to make sure that filter does not get reset automatically on subscription update

  //   if (this.sortCardFieldSet == true) {
  //     this.sortCardField(this.sortBy);
  //   }
  //   this.tableService.statusArray.length = this.saleStatus.length - 1;
  //   this.getNoOfRecords();
  //   this.selection.clear(); //clear select of table
  // }
}



