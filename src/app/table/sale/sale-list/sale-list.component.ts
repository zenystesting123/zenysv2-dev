/*********************************************************
 * Description : Sale lite mode component with grid view and table view, it comtaines grid view and table as child component
 * 
 * ************************************************************************* */


import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, Subscription, combineLatest } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Addnewsale1Component } from 'src/app/addnewsale1/addnewsale1.component';
import { CardSettingsComponent } from 'src/app/card-settings/card-settings.component';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { ChangesalestatdialogComponent } from 'src/app/changesalestatdialog/changesalestatdialog.component';
import { CommonService } from 'src/app/common.service';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { CustomTableSettingsComponent } from 'src/app/custom-tables/custom-table-settings/custom-table-settings.component';
import { Branch, DisplayColumn, Profile, Sales, StageHistoryModel, contactSettings, defaultContactSettings, defaultSaleSettings, modules, saleSettings } from 'src/app/data-models';
import { FollowupTaskCreateComponent } from 'src/app/followup-task-create/followup-task-create.component';
import { SaleTableColumns } from 'src/app/model/custom-report.model';
import { Pipelines } from 'src/app/model/pipeline.modal';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { ConfirmProducts, ReassignFromSale } from 'src/app/sales-view/sale/sale.component';
import { SaleService } from 'src/app/sales-view/sale/sale.service';
import { CrudModal1Component } from 'src/app/taskboard/crud-modal1/crud-modal1.component';
import { LiteModeViewFilterComponent } from '../../lite-mode-view-filter/lite-mode-view-filter.component';
import { SaleCustomViewSelectComponent } from '../sale-custom-view-select/sale-custom-view-select.component';
import { SaleGridViewComponent } from '../sale-grid-view/sale-grid-view.component';
import { SaleGridService } from '../sale-grid/sale-grid.service';
import { SaleTableViewComponent } from '../sale-table-view/sale-table-view.component';
import { SaleTableService } from './sale-table.service';
@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class SaleListComponent implements OnInit, OnDestroy, AfterViewChecked {
  userId: string; // current user id
  superUserId: string; // super user id
  networkConnection: boolean; //to check network connection
  //field names
  fieldNameContact: string = 'Contact';
  fieldNameOrganization = 'Organization';
  fieldNameFollowup: string = 'FollowUp';
  fieldNameTask: string = 'Task';
  fieldNameSale: string = 'Sale';
  fieldNameEstimate: string = 'Estimate';
  fieldNameQuotation: string = 'Quotation';
  fieldNameInvoice: string = 'Invoice';
  fieldNameItems: string = 'Products and Service';
  fieldNameSaleNotes: string = 'Note';
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE; // customer settings configuration
  saleSettings: saleSettings = defaultSaleSettings.CONST_VALUE; // sale settigs configuration
  commonServiceUserSubscription: Subscription; // for closing user subscription
  cardFields: any[]; // grid view card fields
  displayFields: any; // display fields for table
  salePipelines: Pipelines[] = []; // pipeline
  progressBarDisplay: boolean = false; // for displaying progress bar
  @ViewChildren(SaleGridViewComponent) childComponents: QueryList<SaleGridViewComponent>; // grid view child components
  @ViewChild(SaleTableViewComponent) tableChild!: SaleTableViewComponent; // table view child component
  actSaleAgeing: boolean = false; // check for is ageing is activated
  userName = ''; //logged in users full name
  superUserDetails: Profile = null; //super user details of logged in user
  allSubUsers: any[] = [];
  accountType: string = ''; //accountType of logged in user
  columnsDispaly = []; // table columns configuration
  userIdsArray: any[] = []; // users id
  userNamesArray: any[] = []; // users names
  branches: Branch[]; // list of branches
  tableDefaultData = SaleTableColumns; // table columns configuration .used for adding new field which is added on modal
  selection = new SelectionModel<Sales>(true, []); // table selection
  reloadChildComponent: boolean = false; // for showing the grid view
  disableSaleView: boolean = false; //disable sale view based on access control permission
  disableSaleDownload = false; //disabel download table
  disableFoll = false; // disable followup
  disableDocCreateEst: boolean = false; //disable Sales Doc view
  disableDocCreateQuot: boolean = false; //disable Sales Doc view
  disableDocCreateInv: boolean = false; //disable Sales Doc view
  disableReAssign = false; // disable reassign 
  disableSaleEdit: boolean = false; //based on access control, disable sale edit
  customFieldsSale: any[]; // contact additional fields
  orderWonCheck = false; //check for the field orderWonCheck
  taskStatusOption: any;
  lastStatusoption: any;
  reloadOldTableChildComponent: boolean = false; // for reloading grid view in custom filter views
  contactDataAccessRule:string; // contact access rule
  myViews: any = []; // list of created by me views
  publicViews: any = [];// list of publilc views
  saleDataAccessRule: string = ''; //data access rule of logged in user
  private onDestroy$: Subject<void> = new Subject<void>();
  constructor(public commonService: CommonService, private router: Router,
    public networkCheck: NetworkCheckService, public tableService: SaleTableService,
    public dialog: MatDialog, private cdRef: ChangeDetectorRef,
    private salesService: SaleService,public saleGridService:SaleGridService,private _snackBar: MatSnackBar,) {
    this.branches = this.commonService.branches;
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit() {
    let defaultViewset = true; // to block changinf the view if userdatas are changed
    this.commonServiceUserSubscription = this.commonService.userDatas.pipe(take(1)).subscribe(
      (allData) => {
        if (allData) {
          if (!allData.userDetails.enableLiteMode) {
            this.router.navigate(['dash/sales/sale']);
          } else {
            //get the details of user profile assigned to the user
            if (allData.usrProfileData) {
             this.saleDataAccessRule= allData.usrProfileData.saleDataAccessRule;
              // disable addSale and sale view
              if (allData.usrProfileData.isCheckedSale == false) {
                this.commonService.addDocLimitaion.addSaleDisable = true;
                this.disableSaleView = true;
                this.disableSaleEdit = true;
                this.disableSaleDownload = true;
                this.disableReAssign = true;
              } else {
                if (allData.usrProfileData.salesView == false) {
                  this.disableSaleView = true;
                }
                if (allData.usrProfileData.salesEdit == false) {
                  this.disableSaleEdit = true;
                }
                if (allData.usrProfileData.salesDownload == false) {
                  this.disableSaleDownload = true;
                }
                if (allData.usrProfileData.saleReAssign == false) {
                  this.disableReAssign = true;
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

              // disable documents
              if (allData.usrProfileData.isCheckedSalesEst == false) {
                this.disableDocCreateEst = true;
              } else {
                if (allData.usrProfileData.salesDCreateEst == false) {
                  this.disableDocCreateEst = true;
                }
              }
              if (allData.usrProfileData.isCheckedSalesQuot == false) {
                this.disableDocCreateQuot = true;
              } else {
                if (allData.usrProfileData.salesDCreateQuot == false) {
                  this.disableDocCreateQuot = true;
                }
              }
              if (allData.usrProfileData.isCheckedSalesInv == false) {
                this.disableDocCreateInv = true;
              } else {
                if (allData.usrProfileData.salesDCreateInv == false) {
                  this.disableDocCreateInv = true;
                }
              }
            }
            if (
              this.commonService.userPlan.saleAccess &&
              !this.disableSaleView
            ) {
              this.orderWonCheck = allData.superUserDetails.orderWonCheck;
              this.superUserDetails = allData.superUserDetails;
              this.userId = allData.userId;
              this.superUserId = allData.userDetails.superUserId;
              this.getView();
              const allSubUsers = this.commonService.createUserlist(
                'All',
                'any'
              )[1];
              this.taskStatusOption = allData.superUserDetails.taskStatusOpn
                ? allData.superUserDetails.taskStatusOpn
                : ['Open', 'Completed'];
              this.lastStatusoption =
                this.taskStatusOption[this.taskStatusOption.length - 1];
              this.allSubUsers = allSubUsers.filter(function (e) {
                return e.status != 'suspended';
              });
              if (allData.superUserDetails.fieldNames) {
                this.fieldNameContact =
                  this.superUserDetails.fieldNames.fieldNameContact;

                this.fieldNameSale =
                  this.superUserDetails.fieldNames.fieldNameSale;

                this.fieldNameTask =
                  this.superUserDetails.fieldNames.fieldNameTask;

                this.fieldNameItems =
                  this.superUserDetails.fieldNames.fieldNameItems;

                this.fieldNameFollowup =
                  this.superUserDetails.fieldNames.fieldNameFollowup;

                this.fieldNameSaleNotes = allData.superUserDetails.fieldNames
                  .fieldNameSaleNotes
                  ? allData.superUserDetails.fieldNames.fieldNameSaleNotes
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

              }

              if (allData.superUserDetails.actSaleAgeing) {
                // check for sale ageing is activated
                this.actSaleAgeing = allData.superUserDetails.actSaleAgeing;
              }

              this.userName =
                allData.userDetails.firstname +
                ' ' +
                (allData.userDetails.lastname
                  ? allData.userDetails.lastname
                  : '');


              //get customer setting configuration
              if (
                allData.superUserDetails.contactSettings &&
                typeof allData.superUserDetails.contactSettings !== 'undefined' &&
                allData.superUserDetails.contactSettings !== null
              ) {
                this.contactSettings = allData.superUserDetails.contactSettings;
              }
              //get sale setting configuration
              if (
                allData.superUserDetails.saleSettings &&
                typeof allData.superUserDetails.saleSettings !== 'undefined' &&
                allData.superUserDetails.saleSettings !== null
              ) {
                this.saleSettings = allData.superUserDetails.saleSettings;
              }
              //if there is multiple pipeline access, show all five pipelines else show single pipeline
              this.salePipelines = [];
              this.salePipelines = JSON.parse(
                JSON.stringify(allData.salePipelines)
              );
              if (this.commonService.userPlan.multiPipelineAccess) {
                // do nothing
              } else {
                this.salePipelines.length = 1;
              }


              this.accountType = allData.userDetails.accountType;
              this.customFieldsSale =
                allData.superUserDetails.customFieldsSale;
              let displayColumnsSaved: DisplayColumn[] = [];
              if (allData.userDetails.displaySaleColumns) {
                displayColumnsSaved = allData.userDetails.displaySaleColumns;
              }
              if (displayColumnsSaved.length > 0) {
                //if table settings are stored in db, use the stored data
                this.columnsDispaly = allData.userDetails.displaySaleColumns;
                // remove select column if settings already saved in DB
                var ind = this.columnsDispaly.findIndex(
                  (p) => p.columnDef == 'select'
                );
                if (ind > -1) {
                  this.columnsDispaly.splice(ind, 1);
                }
              }

              [this.userIdsArray, this.userNamesArray] =
                this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names       


              if (
                (allData.userDetails.saleDefaultView &&
                  defaultViewset &&
                  this.saleGridService.saleView ==
                  this.saleGridService.saleDefaultView) ||
                (allData.userDetails.saleDefaultView &&
                  allData.userDetails.saleDefaultView !=
                  this.saleGridService.saleDefaultView)
              ) {
                this.saleGridService.saleView =
                  allData.userDetails.saleDefaultView;
                this.saleGridService.saleDefaultView =
                  allData.userDetails.saleDefaultView;
                defaultViewset = false;

              }

              if (this.saleGridService.saleView == 'grid') {
                this.reloadChildComponent = true; // if sale view selected is grid, show grid viwe
                this.reloadOldTableChildComponent = true;
              }
              if (this.tableService.pipelineSaleSelection == '') {
                this.tableService.pipelineSaleSelection =
                  this.salePipelines[0].pipelineId;
              }
              if (this.tableService.selectedPipelineNameArray.length == 0) {
                this.tableService.selectedPipelineNameArray = [];
                this.tableService.selectedPipelineNameArray.push(this.salePipelines[0].pipelineId);
              }
              [this.cardFields, this.displayFields] =
                this.commonService.getCardFields(
                  'sale',
                  this.fieldNameSaleNotes,
                  this.fieldNameFollowup
                );
              
              // get status array based on pipeline selected
              this.getStatus();
              this.initStageCollapseArray();
              this.progressBarDisplay = true;
            } else {
              this.progressBarDisplay = true;
            }
          }
        }
      }
    );
  }

  // network check
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.commonServiceUserSubscription?.unsubscribe();
  }
  // if view is changed
  viewSelected(viewName) {
    this.tableService.selectedStatus = ''; // reset selected status when filter changed
    this.tableService.saleList.data = []; // clear data
    this.tableService.secondViewSelected = viewName; // asisgn second view name
    if (viewName == 'Last note added') {
      this.tableService.viewSelected =
        'Last ' +
        this.fieldNameSaleNotes +
        ' added'; // for displaying viewname in toolbar
    } else if (viewName == 'All Sales') {
      this.tableService.viewSelected =
        'All ' +
        this.fieldNameSale +
        's'; // for displaying viewname in toolbar
    } else if (viewName == 'note today') {
      this.tableService.viewSelected =
        this.fieldNameSaleNotes +
        ' today'; // for displaying viewname in toolbar
    } else if (viewName == 'note this week') {
      this.tableService.viewSelected =
        this.fieldNameSaleNotes +
        ' this week'; // for displaying viewname in toolbar
    } else if (viewName == 'note this month') {
      this.tableService.viewSelected =
        this.fieldNameSaleNotes +
        ' this month'; // for displaying viewname in toolbar
    } else {
      this.tableService.viewSelected =
        this.tableService.secondViewSelected; // for displaying viewname in toolbar
    }
    this.progressBarDisplay = false;
    if (this.saleGridService.saleView == 'grid') {
      this.reloadGridViewChildComponent();
    }
    this.reloadTableComponent();

    this.progressBarDisplay = true;
  }
  // if status filter is selcted
  viewSelectedStatus(data) {
    this.tableService.selectedStatus = data.status.stageId;
    this.tableService.saleList.data = []; // clear data
    this.tableService.secondViewSelected = data.viewName; // asisgn second view name

    this.tableService.viewSelected =
      this.saleSettings.salesStage.displayName +
      '/ ' +
      data.status.name; // for displaying viewname in toolbar
    this.progressBarDisplay = false;
    if (this.saleGridService.saleView == 'grid') {
      this.reloadGridViewChildComponent();
    }
    this.reloadTableComponent();
    this.progressBarDisplay = true;
  }
  // get status array based on pipeline selected
  getStatus() {
    if (this.tableService.selectedPipelineNameArray.length == 1) {
      this.tableService.statusArray = this.commonService.getStatusArray(
        'sales',
        this.tableService.selectedPipelineNameArray[0]
      );
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
      this.tableService.pipelineSaleSelection,
    ];
    // based on the pipeline selected set status array
    this.tableService.statusArray = this.commonService.getStatusArray(
      modules.sales,
      this.tableService.pipelineSaleSelection
    );
    this.progressBarDisplay = false;
    if (!this.saleGridService.isOldModeVisible) {
      // if previous filter is status then reset it to to be converted
      if (this.tableService.secondViewSelected == 'status') {
        this.tableService.secondViewSelected = 'To be converted';
        this.tableService.viewSelected =
          this.tableService.secondViewSelected; // for displaying viewname in toolbar
      }
      if (this.saleGridService.saleView == 'grid') {
        this.reloadGridViewChildComponent();
      }
      this.reloadTableComponent();
      this.progressBarDisplay = true;
    } else {
      this.progressBarDisplay = false;
      this.saleGridService.onFunctionCall('viewPipelineChanged');
      this.progressBarDisplay = true;
    }

  }
  // reload grid view
  reloadGridViewChildComponent() {
    this.reloadChildComponent = false
    this.childComponents.forEach(child => {
      child.displayedData.next([])
      child.initializeData();
    });
    this.reloadChildComponent = true;
    this.progressBarDisplay = true;
  }
  // reload table view
  reloadTableComponent() {
    this.tableService.saleList.data = []; // clear data
    this.tableChild.isLoading = true;
    this.tableChild.resetQueryAndTableData();
  }

  // add task from sale fn
  addTask(
    saleFiltered
  ) {
    this.dialog.open(CrudModal1Component, {
      width: '520px',
      height: 'auto',
      disableClose: true,
      data: {
        sid: saleFiltered.id,
        cid: saleFiltered.customerId,
        orgId: saleFiltered.orgId,
        mode: 'saleCreate',
        company: saleFiltered.companyName,
        firstName: saleFiltered.firstName,
        secondName: saleFiltered.secondName,
        surname: saleFiltered.surname,
        saleName: saleFiltered.saleTitle,
      },
    });
  }

  // create followups from sale fn
  onCreateFollowUps(
    saleFiltered
  ) {
    let customerName;
    if (saleFiltered.secondName && saleFiltered.surname) {
      // if second name & surname is there
      customerName = saleFiltered.firstName + ' ' + saleFiltered.secondName + ' ' + saleFiltered.surname;
    } else if (saleFiltered.secondName && !saleFiltered.surname) {
      customerName = saleFiltered.firstName + ' ' + saleFiltered.secondName;
    } else if (!saleFiltered.secondName && saleFiltered.surname) {
      customerName = saleFiltered.firstName + ' ' + saleFiltered.secondName;
    } else {
      customerName = saleFiltered.firstName;
    }
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: saleFiltered.customerId,
        companyNames: saleFiltered.companyName,
        customerNames: customerName,
        contactNumber: saleFiltered.contactNumber
          ? saleFiltered.contactNumber
          : '', // pass customer number
        countryCode: saleFiltered.countryCode ? saleFiltered.countryCode : '', // pass customer country code
        assignedTo: saleFiltered.assignedTo,
        assignedToName: saleFiltered.assignedToName,
        scenario: 'create from sale',
        subUsers: this.allSubUsers,
        fname: this.superUserDetails.firstname,
        lastname: this.superUserDetails.lastname,
        saleId: saleFiltered.id,
        saleTitle: saleFiltered.saleTitle,
        orgId: saleFiltered.orgId,
      },
    });
  }

  editSale(data: { index: number, sale: Sales }) {
    this.selection.clear();
    this.commonService.updateSaleToEdit(data.sale);
    const dialogRef = this.dialog.open(Addnewsale1Component, {
      width: '800px',
      height: 'auto',
      disableClose: true,
      data: { scenario: 'edit', id: data.sale.id },
    })
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if (this.saleGridService.saleView == 'grid' && !this.saleGridService.isOldModeVisible) {
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
    let saleStatus = [];
    this.tableService.statusArray.forEach(element => {
      if (element.stageId != stage) {
        saleStatus.push(element.stageId)
      }
    });

    return saleStatus;
  }
  // drag and drop and thus update status in sale slist view
  drop(event: CdkDragDrop<Sales[]>, index: number) {
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
      //let saleId = event.previousContainer.data[event.previousIndex].id;
      let saleId = event.item.data.id;
      //Update the status of the sale which has been dropped to new stage in front end so that delay updating db doesnot cause the card to jump back to previous stage and then get updated
      // if won stage, open popup confirm products
      // else if lost stage open popup - ChangesalestatdialogComponent
      if (
        event.container.id === this.tableService.statusArray[this.tableService.statusArray.length - 2].stageId &&
        this.orderWonCheck === true
      ) {
        let saleStatus = this.tableService.statusArray?.map(({ stageId }) => {
          return stageId;
        });
        // we have to show a confirmation of products
        const dialogRef = this.dialog.open(ConfirmProducts, {
          // width: '300px',
          data: {
            userId: this.userId,
            userName: this.userName,
            fieldNameItems: this.fieldNameItems,
            superUserId: this.superUserId,
            saleID: saleId,
            saleStatus: saleStatus,
            currentHistory:
              event.previousContainer.data[event.previousIndex].stageHistory,
            status: event.container.id,
            prevStatus: event.previousContainer.id,
            changeLog:
              event.previousContainer.data[event.previousIndex].changeLog,
            pipelineId: this.tableService.selectedPipelineNameArray[0],
            statusName: this.commonService.getStatusName(
              modules.sales,
              this.tableService.selectedPipelineNameArray[0],
              event.container.id
            ),
          },
        });
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
        // if drag and drop to lost stage column, need to show popup to enter reason for rejection
        //  if reason for rejection display is true
      } else if (
        this.saleSettings.rejectionReasonVal?.display === true &&
        event.container.id === this.tableService.statusArray[this.tableService.statusArray.length - 1].stageId
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
            this.tableService.selectedPipelineNameArray[0],
            event.previousContainer.id
          ),
          curSalesStage: this.commonService.getStatusName(
            modules.sales,
            this.tableService.selectedPipelineNameArray[0],
            event.container.id
          ),
          changeLog:
            event.previousContainer.data[event.previousIndex].changeLog,
        };

        dialogConfig.data = {
          userId: this.superUserId,
          saleId: saleId,
          status: event.container.id,
          saleStatus: this.commonService.getStatusArray(modules.sales, this.tableService.selectedPipelineNameArray[0]),
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
          pipelineId: this.tableService.selectedPipelineNameArray[0],
          statusName: this.commonService.getStatusName(
            modules.sales,
            this.tableService.selectedPipelineNameArray[0],
            event.container.id
          ),
          statusFieldName: this.saleSettings.salesStage.displayName
        };

        const dialogRef = this.dialog.open(ChangesalestatdialogComponent, dialogConfig);
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
            if (previousChildComponent.displayedData.value[i].id == saleId) {
              previousChildComponent.displayedData.value[i].salesStage = event.container.id;
              break;
            }
          }
        }
        // stageHistory part
        let currentHistory = event.item.data.stageHistory;
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

        let prevObj = {
          salesStage: this.commonService.getStatusName(
            modules.sales,
            this.tableService.selectedPipelineNameArray[0],
            event.previousContainer.id
          ),
        };
        let currObj = {
          salesStage: this.commonService.getStatusName(
            modules.sales,
            this.tableService.selectedPipelineNameArray[0],
            event.container.id
          ),
        };
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

        this.salesService.onUpdateSaleStatus(
          this.superUserId,
          saleId,
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
            prevObj,
            currObj,
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
    let assignedToName = secondName ? firstName + ' ' + secondName : firstName;
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


  // to toggle between list and table view, to select list
  onToggle() {
    if (!this.saleGridService.isOldModeVisible) {
      this.selection.clear(); //clear select of table
      this.reloadChildComponent = false;
      this.reloadOldTableChildComponent = false;
      this.saleGridService.saleView = 'grid';
      // all should refresh while toggle
      this.reloadGridViewChildComponent();
      this.reloadChildComponent = true;
      this.reloadOldTableChildComponent = true;
    } else {
      this.reloadChildComponent = false;
      this.reloadOldTableChildComponent = false;
      this.saleGridService.onFunctionCall('onToggle');
      this.reloadOldTableChildComponent = true;
      this.reloadChildComponent = true;
    }
    this.cdRef.detectChanges();
  }
  // to toggle between list and table view, to select table
  onToggleTab() {
    if (!this.saleGridService.isOldModeVisible) {
      this.reloadChildComponent = false;
      this.reloadOldTableChildComponent = false;
      this.saleGridService.saleView = 'table';
      this.cdRef.detectChanges();
    } else {
      this.reloadChildComponent = false;
      this.reloadOldTableChildComponent = false;
      this.saleGridService.onFunctionCall('onToggleTab');
    }
    this.cdRef.detectChanges();
  }
  openDialog(data: { columnsDispaly: any, customField: any }) {
    let columnsDispaly = data.columnsDispaly;
    let customFieldSales = data.customField;
    let col = columnsDispaly.map((obj) => ({
      ...obj,
    }));
    //open the dialog to customize the table fields
    const dialogRef = this.dialog.open(CustomTableSettingsComponent, {
      data: {
        columndata: col,
        userId: this.userId,
        displayName: 'displaySaleColumns',
        customFields: customFieldSales,
      },
      disableClose: true,
      width: '600px',
    })
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if (result) {
        this.tableChild.columnsDispaly = result.displaySaleColumns;
        this.columnsDispaly = result.displaySaleColumns;
        this.tableChild.configureTable();
      }
    })
  }
  //Function to open the card content custmization popup
  customizeCardContent() {
    const dialogRef = this.dialog.open(CardSettingsComponent, {
      data: ['sale', this.cardFields, this.customFieldsSale],
      width: '600px',
    })
    dialogRef.afterClosed().pipe(take(1)).subscribe((data) => {
      if (data) {
        [this.cardFields, this.displayFields] =
          this.commonService.getCardFields(
            'sale',
            this.fieldNameSaleNotes,
            this.fieldNameFollowup
          );
      }
    })
  }
  // filter by assgigned to me or created by
  onViewFilter(evt: MouseEvent): void {
    const target = new ElementRef(evt.currentTarget);
    const dialogRef = this.dialog.open(SaleCustomViewSelectComponent, {
      panelClass: 'dialog-side-panel',
      data: {
        trigger: target,
        saleSettings: this.saleSettings,
        cardFields: this.cardFields,
        fieldNameSaleNotes: this.fieldNameSaleNotes,
        fieldNameSale: this.fieldNameSale,
        superUserId: this.superUserId,
        userId: this.userId,
        myViews: this.myViews,
        publicViews: this.publicViews
      },
    });
    const dialogSubmitSubscription =
      dialogRef.componentInstance.viewSelectedEvent.subscribe((value: string) => {
        dialogSubmitSubscription.unsubscribe();
        this.selection.clear();
        this.viewSelected(value)
      });
    const dialogSubmitSubscriptionTwo =
      dialogRef.componentInstance.viewSelectedStatusEvent.subscribe((value: { viewName: string, status: string }) => {
        dialogSubmitSubscriptionTwo.unsubscribe();
        this.selection.clear();
        this.viewSelectedStatus(value)
      });
  }
  // edit custom view
  editView(mode,) {
    let saleViewSelected = JSON.parse(JSON.stringify(this.saleGridService.saleViewSelected));
    //call the popup for card field customization
    const dialogRef = this.dialog.open(LiteModeViewFilterComponent, {
      data: [
        'sales',
        saleViewSelected,
        mode,
        this.cardFields,
      ],
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.saleGridService.saleViewSelected.primaryQuery = res.viewSettings.primaryQuery;
        this.saleGridService.saleViewSelected.filters = res.viewSettings.filters;
        this.saleGridService.saleViewSelected.viewName = res.viewSettings.viewName;
        this.saleGridService.saleViewSelected.sortField = res.viewSettings.sortField;
        this.saleGridService.saleViewSelected.sortOrder = res.viewSettings.sortOrder;
        this.tableService.selectedStatus = ''; // reset selected status when filter changed
        this.tableService.secondViewSelected = res.viewSettings.viewName; // asisgn second view name
        this.tableService.viewSelected = this.tableService.secondViewSelected; // for displaying viewname in toolbar
        this.saleGridService.onFunctionCall('viewChanged');
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
          this.saleGridService.saleViewSelected.viewName,
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res == 'deleted') {
        this.tableService
          .onDeletePublicView(this.superUserId, this.saleGridService.saleViewSelected.id)
          .then((res) => {
            this._snackBar.open('View has been deleted', '', {
              duration: 2000,
            });
            if (this.myViews.length > 0) {
              this.saleGridService.saleViewSelected = this.myViews[0];
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = this.saleGridService.saleViewSelected.viewName; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar
              this.saleGridService.onFunctionCall('viewChanged');
            }
            else if (this.publicViews.length > 0) {
              this.saleGridService.saleViewSelected = this.publicViews[0];
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = this.saleGridService.saleViewSelected.viewName; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar
              this.saleGridService.onFunctionCall('viewChanged');
            } else {
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = 'To be converted'; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar

              this.saleGridService.isOldModeVisible = false;
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
          this.saleGridService.saleViewSelected.viewName,
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res == 'deleted') {
        this.tableService
          .onDeleteMyView(this.userId, this.saleGridService.saleViewSelected.id)
          .then((res) => {
            this._snackBar.open('View has been deleted', '', {
              duration: 2000,
            });
            if (this.myViews.length > 0) {
              this.saleGridService.saleViewSelected = this.myViews[0];
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = this.saleGridService.saleViewSelected.viewName; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar
              this.saleGridService.onFunctionCall('viewChanged');
            }
            else if (this.publicViews.length > 0) {
              this.saleGridService.saleViewSelected = this.publicViews[0];
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = this.saleGridService.saleViewSelected.viewName; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar
              this.saleGridService.onFunctionCall('viewChanged');
            } else {
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = 'To be converted'; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar

              this.saleGridService.isOldModeVisible = false;
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
  onTableSettings(value){
    this.columnsDispaly=value;
    this.cdRef.detectChanges();
   }
}

