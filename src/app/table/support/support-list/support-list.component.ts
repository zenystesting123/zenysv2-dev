/*********************************************************
 * Description : Service lite mode component with grid view and table view, it contains grid view and table as child component
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
import { CardSettingsComponent } from 'src/app/card-settings/card-settings.component';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { CommonService } from 'src/app/common.service';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { CustomTableSettingsComponent } from 'src/app/custom-tables/custom-table-settings/custom-table-settings.component';
import { Branch, DisplayColumn, Profile, Service, StageHistoryModel, contactSettings, defaultContactSettings, defaultServiceSettings, modules, serviceSettings } from 'src/app/data-models';
import { FollowupTaskCreateComponent } from 'src/app/followup-task-create/followup-task-create.component';
import { Pipelines } from 'src/app/model/pipeline.modal';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { CrudModal1Component } from 'src/app/taskboard/crud-modal1/crud-modal1.component';
import { SupportListService } from './support-list.service';
import { SupportGridService } from '../support-grid/support-grid.service';
import { SupportGridViewComponent } from '../support-grid-view/support-grid-view.component';
import { SupportTableViewComponent } from '../support-table-view/support-table-view.component';
import { SupportCustomViewSelectComponent } from '../support-custom-view-select/support-custom-view-select.component';
import { LiteModeViewFilterComponent } from '../../lite-mode-view-filter/lite-mode-view-filter.component';
import { CrudServiceComponent } from 'src/app/crud-service/crud-service.component';
import { ChildServiceList } from 'src/app/service-module/service-list/service-list.component';
import { ServiceTableColumns } from 'src/app/model/custom-report.model';
@Component({
  selector: 'app-support-list',
  templateUrl: './support-list.component.html',
  styleUrls: ['./support-list.component.scss']
})
export class SupportListComponent implements OnInit, OnDestroy, AfterViewChecked {
  userId: string; // current user id
  superUserId: string; // super user id
  networkConnection: boolean; //to check network connection
  //field names
  fieldNameContact: string = 'Contact';
  fieldNameOrganization = 'Organization';
  fieldNameFollowup: string = 'FollowUp';
  fieldNameTask: string = 'Task';
  fieldNameService: string = 'Support';
  fieldNameServiceNote: string = 'Note';
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE; // customer settings configuration
  serviceSettings: serviceSettings = defaultServiceSettings.CONST_VALUE; // Service settigs configuration
  commonServiceUserSubscription: Subscription; // for closing user subscription
  cardFields: any[]; // grid view card fields
  displayFields: any; // display fields for table
  servicePipelines: Pipelines[] = []; // pipeline
  progressBarDisplay: boolean = false; // for displaying progress bar
  @ViewChildren(SupportGridViewComponent) childComponents: QueryList<SupportGridViewComponent>; // grid view child components
  @ViewChild(SupportTableViewComponent) tableChild!: SupportTableViewComponent; // table view child component
  actServiceAgeing: boolean = false; // check for is ageing is activated
  userName = ''; //logged in users full name
  superUserDetails: Profile = null; //super user details of logged in user
  allSubUsers: any[] = [];
  accountType: string = ''; //accountType of logged in user
  columnsDispaly = []; // table columns configuration
  userIdsArray: any[] = []; // users id
  userNamesArray: any[] = []; // users names
  branches: Branch[]; // list of branches
  tableDefaultData = ServiceTableColumns; // table columns configuration .used for adding new field which is added on modal
  selection = new SelectionModel<Service>(true, []); // table selection
  reloadChildComponent: boolean = false; // for showing the grid view
  disableViewService: boolean = false; //disable Service view based on access control permission
  disableDownloadService = false; //disabel download table
  disableFoll = false; // disable followup
  disableReAssign = false; // disable reassign 
  disableEditService: boolean = false; //based on access control, disable Service edit
  customFieldsService: any[]; // contact additional fields
  taskStatusOption: any;
  lastStatusoption: any;
  reloadOldTableChildComponent: boolean = false; // for reloading grid view in custom filter views
  contactDataAccessRule: string; // contact access rule
  myViews: any = []; // list of created by me views
  publicViews: any = [];// list of publilc views
  serviceDataAccessRule: string = ''; //data access rule of logged in user
  private onDestroy$: Subject<void> = new Subject<void>();
  stageValues: StageHistoryModel = {
    date: null,
    stageId: null,
    pipelineId: null
  }
  stageHistories: any[];
  stageHistory: any[] = [];
  constructor(public commonService: CommonService, private router: Router,
    public networkCheck: NetworkCheckService, public tableService: SupportListService,
    public dialog: MatDialog, private cdRef: ChangeDetectorRef,
    public serviceGridService: SupportGridService, private _snackBar: MatSnackBar,) {
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
            this.router.navigate(['dash/support-list']);
          } else {
            this.serviceDataAccessRule = allData.usrProfileData.serviceDataAccessRule;
            //get the details of user profile assigned to the user
            // disable add service and service list view
            if (allData.usrProfileData.isCheckedService == false) {
              this.disableDownloadService = true;
              this.disableViewService = true;
              this.disableEditService = true;
            } else {
              if (allData.usrProfileData.servicesDownload == false) {
                this.disableDownloadService = true;
              }
              if (allData.usrProfileData.servicesView == false) {
                this.disableViewService = true;
              }
              if (allData.usrProfileData.servicesEdit == false) {
                this.disableEditService = true;
                this.disableReAssign = true;
              }
              if (allData.usrProfileData.serviceReAssign == false) {
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
            if (
              this.commonService.userPlan.serviceAccess &&
              !this.disableViewService
            ) {
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

                this.fieldNameService =
                  this.superUserDetails.fieldNames.fieldNameService;

                this.fieldNameTask =
                  this.superUserDetails.fieldNames.fieldNameTask;


                this.fieldNameFollowup =
                  this.superUserDetails.fieldNames.fieldNameFollowup;

                this.fieldNameServiceNote = allData.superUserDetails.fieldNames
                  .fieldNameServiceNotes
                  ? allData.superUserDetails.fieldNames.fieldNameServiceNotes
                  : 'Note';

                this.fieldNameOrganization = allData.superUserDetails.fieldNames
                  .fieldNameOrganization
                  ? allData.superUserDetails.fieldNames.fieldNameOrganization
                  : 'Organization';



              }

              if (allData.superUserDetails.actserviceAgeing) {
                // check for Service ageing is activated
                this.actServiceAgeing = allData.superUserDetails.actserviceAgeing;
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
              //get Service setting configuration
              if (
                allData.superUserDetails.serviceSettings &&
                typeof allData.superUserDetails.serviceSettings !== 'undefined' &&
                allData.superUserDetails.serviceSettings !== null
              ) {
                this.serviceSettings = allData.superUserDetails.serviceSettings;
              }
              //if there is multiple pipeline access, show all five pipelines else show single pipeline
              this.servicePipelines = [];
              this.servicePipelines = JSON.parse(
                JSON.stringify(allData.servicePipelines)
              );
              if (this.commonService.userPlan.multiPipelineAccess) {
                // do nothing
              } else {
                this.servicePipelines.length = 1;
              }


              this.accountType = allData.userDetails.accountType;
              this.customFieldsService =
                allData.superUserDetails.customFieldsService;
              let displayColumnsSaved: DisplayColumn[] = [];
              if (allData.userDetails.displayServiceColumns) {
                displayColumnsSaved = allData.userDetails.displayServiceColumns;
              }
              if (displayColumnsSaved.length > 0) {
                //if table settings are stored in db, use the stored data
                this.columnsDispaly = allData.userDetails.displayServiceColumns;
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
                (allData.userDetails.serviceDefaultView &&
                  defaultViewset &&
                  this.serviceGridService.serviceView ==
                  this.serviceGridService.serviceDefaultView) ||
                (allData.userDetails.serviceDefaultView &&
                  allData.userDetails.serviceDefaultView !=
                  this.serviceGridService.serviceDefaultView)
              ) {
                this.serviceGridService.serviceView =
                  allData.userDetails.serviceDefaultView;
                this.serviceGridService.serviceDefaultView =
                  allData.userDetails.serviceDefaultView;
                defaultViewset = false;

              }

              if (this.serviceGridService.serviceView == 'grid') {
                this.reloadChildComponent = true; // if service view selected is grid, show grid viwe
                this.reloadOldTableChildComponent = true;
              }
              if (this.tableService.pipelineServiceSelection == '') {
                this.tableService.pipelineServiceSelection =
                  this.servicePipelines[0].pipelineId;
              }
              if (this.tableService.selectedPipelineNameArray.length == 0) {
                this.tableService.selectedPipelineNameArray = [];
                this.tableService.selectedPipelineNameArray.push(this.servicePipelines[0].pipelineId);
              }
              [this.cardFields, this.displayFields] =
                this.commonService.getCardFields(
                  'service',
                  this.fieldNameServiceNote,
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
    this.tableService.serviceList.data = []; // clear data
    this.tableService.secondViewSelected = viewName; // asisgn second view name
    if (viewName == 'Last note added') {
      this.tableService.viewSelected =
        'Last ' +
        this.fieldNameServiceNote +
        ' added'; // for displaying viewname in toolbar
    } else if (viewName == 'All Support') {
      this.tableService.viewSelected =
        'All ' +
        this.fieldNameService; // for displaying viewname in toolbar
    } else {
      this.tableService.viewSelected =
        this.tableService.secondViewSelected; // for displaying viewname in toolbar
    }
    this.progressBarDisplay = false;
    if (this.serviceGridService.serviceView == 'grid') {
      this.reloadGridViewChildComponent();
    }
    this.reloadTableComponent();

    this.progressBarDisplay = true;
  }
  // if status filter is selcted
  viewSelectedStatus(data) {
    this.tableService.selectedStatus = data.status.stageId;
    this.tableService.serviceList.data = []; // clear data
    this.tableService.secondViewSelected = data.viewName; // asisgn second view name

    this.tableService.viewSelected =
      this.serviceSettings.servicesStage.displayName +
      '/ ' +
      data.status.name; // for displaying viewname in toolbar
    this.progressBarDisplay = false;
    if (this.serviceGridService.serviceView == 'grid') {
      this.reloadGridViewChildComponent();
    }
    this.reloadTableComponent();
    this.progressBarDisplay = true;
  }
  // get status array based on pipeline selected
  getStatus() {
    if (this.tableService.selectedPipelineNameArray.length == 1) {
      this.tableService.statusArray = this.commonService.getStatusArray(
        'services',
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
      this.tableService.pipelineServiceSelection,
    ];
    // based on the pipeline selected set status array
    this.tableService.statusArray = this.commonService.getStatusArray(
      modules.services,
      this.tableService.pipelineServiceSelection
    );
    this.progressBarDisplay = false;
    if (!this.serviceGridService.isOldModeVisible) {
      // if previous filter is status then reset it to To be closed
      if (this.tableService.secondViewSelected == 'status') {
        this.tableService.secondViewSelected = 'To be closed';
        this.tableService.viewSelected =
          this.tableService.secondViewSelected; // for displaying viewname in toolbar
      }
      if (this.serviceGridService.serviceView == 'grid') {
        this.reloadGridViewChildComponent();
      }
      this.reloadTableComponent();
      this.progressBarDisplay = true;
    } else {
      this.progressBarDisplay = false;
      this.serviceGridService.onFunctionCall('viewPipelineChanged');
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
    this.tableService.serviceList.data = []; // clear data
    this.tableChild.isLoading = true;
    this.tableChild.resetQueryAndTableData();
  }

  // add task from service fn
  addTask(
    serviceFiltered
  ) {
    this.dialog.open(CrudModal1Component, {
      width: '520px',
      height: 'auto',
      disableClose: true,
      data: {
        sid: serviceFiltered.id,
        cid: serviceFiltered.customerId,
        orgId: serviceFiltered.orgId,
        mode: 'serviceCreate',
        company: serviceFiltered.companyName,
        firstName: serviceFiltered.firstName,
        secondName: serviceFiltered.secondName,
        surname: serviceFiltered.surname,
        serviceName: serviceFiltered.serviceTitle,
      },
    });
  }

  // create followups from service fn
  onCreateFollowUps(
    serviceFiltered
  ) {
    let customerName;
    if (serviceFiltered.secondName && serviceFiltered.surname) {
      // if second name & surname is there
      customerName = serviceFiltered.firstName + ' ' + serviceFiltered.secondName + ' ' + serviceFiltered.surname;
    } else if (serviceFiltered.secondName && !serviceFiltered.surname) {
      customerName = serviceFiltered.firstName + ' ' + serviceFiltered.secondName;
    } else if (!serviceFiltered.secondName && serviceFiltered.surname) {
      customerName = serviceFiltered.firstName + ' ' + serviceFiltered.secondName;
    } else {
      customerName = serviceFiltered.firstName;
    }
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: serviceFiltered.customerId,
        companyNames: serviceFiltered.companyName,
        customerNames: customerName,
        contactNumber: serviceFiltered.contactNumber
          ? serviceFiltered.contactNumber
          : '', // pass customer number
        countryCode: serviceFiltered.countryCode ? serviceFiltered.countryCode : '', // pass customer country code
        assignedTo: serviceFiltered.assignedTo,
        assignedToName: serviceFiltered.assignedToName,
        scenario: 'create from service',
        subUsers: this.allSubUsers,
        fname: this.superUserDetails.firstname,
        lastname: this.superUserDetails.lastname,
        serviceId: serviceFiltered.id,
        serviceTitle: serviceFiltered.serviceTitle,
        orgId: serviceFiltered.orgId,
      },
    });
  }

  editService(data: { index: number, service: Service }) {
    this.selection.clear(); // clear table data selection
    this.commonService.updateserviceToEdit(data.service);
    const dialogRef = this.dialog.open(CrudServiceComponent, {
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: { scenario: 'edit', id: data.service.id },
    })
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if (this.serviceGridService.serviceView == 'grid' && !this.serviceGridService.isOldModeVisible) {
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
    let serviceStatus = [];
    this.tableService.statusArray.forEach(element => {
      if (element.stageId != stage) {
        serviceStatus.push(element.stageId)
      }
    });

    return serviceStatus;
  }

  // drag and drop and thus update status in service slist view
  drop(event: CdkDragDrop<Service[]>, index: number) {
    let datePlaced = new Date().getTime();
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
      //let serviceId = event.previousContainer.data[event.previousIndex].id;
      let serviceId = event.item.data.id;
      // if drag and drop to lost column, need to show popup if disaplay for reason for rejection is checked
      if (
        this.serviceSettings.rejectionReasonVal?.display === true &&
        event.container.id === this.tableService.statusArray[this.tableService.statusArray.length - 1].stageId
      ) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
          statusName: this.commonService.getStatusName(modules.services, this.tableService.selectedPipelineNameArray[0], event.container.id),
          stage: event.container.id,
          fieldNameservice: this.fieldNameService,
          scenario: 'updateStage',
          rejectionReasonValue: '', //to store selected reason
          rejectionReasonArr:
            this.serviceSettings?.rejectionReason?.rejectionReason?.split(','), //reason for rejection options array
          rejectionReasonMandatory:
            this.serviceSettings.rejectionReasonVal.mandatory, //reason for rejection mandatory check
          rejectionReasonDisplay: this.serviceSettings.rejectionReasonVal.display, //whether to display/not reason for rejection
        };
        const dialogRef = this.dialog.open(ChildServiceList, dialogConfig);
        dialogRef
          .afterClosed()
          .pipe(take(1))
          .subscribe((result) => {
            // console.log(result);
            if (result) {
              //Update the status of the service which has been dropped to new stage in front end so that delay updating db doesnot cause the card to jump back to previous stage and then get updated
              let i = 0;
              if (previousChildComponent) {

                for (i = 0; i < previousChildComponent.displayedData.value.length; i++) {
                  if (previousChildComponent.displayedData.value[i].id == serviceId) {
                    previousChildComponent.displayedData.value[i].servicesStage = event.container.id;
                    break;
                  }
                }
              }
              let currentHistory =
                //event.previousContainer.data[event.previousIndex].stageHistory;
                event.item.data.stageHistory;
              this.stageValues.date = datePlaced;
              this.stageValues.stageId = event.container.id;
              this.stageValues.pipelineId = this.tableService.pipelineServiceSelection
              if (event.item.data.stageHistory) {
                currentHistory.push(this.stageValues);
                this.stageHistories = currentHistory;
              } else {
                this.stageHistories = [this.stageValues];
              }
              let lost = false;
              let won = false;
              let inPipeline = true;
              let prevObj;
              let currObj;
              if (
                event.container.id ===
                this.tableService.statusArray[this.tableService.statusArray.length - 1].stageId
              ) {
                lost = true;
                won = false;
                inPipeline = false;
                prevObj = { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.previousContainer.id), rejectionReasonVal: '' };
                currObj = { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.container.id), rejectionReasonVal: result.rejectionReasonValue };
              } else if (
                event.container.id ===
                this.tableService.statusArray[this.tableService.statusArray.length - 2].stageId
              ) {
                lost = false;
                won = true;
                inPipeline = false;
                prevObj = { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.previousContainer.id) };
                currObj = { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.container.id) };
              } else {
                lost = false;
                won = false;
                inPipeline = true;
                prevObj = { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.previousContainer.id) };
                currObj = { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.container.id) };
              }

              this.serviceGridService.onUpdateserviceStatus(
                this.superUserId,
                serviceId,
                event.container.id,
                this.stageHistories,
                datePlaced,
                inPipeline,
                won,
                lost,
                (event.container.id === this.tableService.statusArray[this.tableService.statusArray.length - 1].stageId) ? result.rejectionReasonValue : '',
                ChangeLogComponent.saveLog(
                  this.constructor.name,
                  this.userId,
                  this.userName,
                  prevObj, currObj,
                  previousChildComponent.displayedData.value[i].changeLog
                )
              ).then((res) => {
                previousChildComponent.displayedData.next([])
                childComponent.displayedData.next([])
                previousChildComponent.initializeData();
                childComponent.initializeData();
              });
            } else {
              previousChildComponent.isLoaded = true;
              childComponent.isLoaded = true;
            }
          });
      } else {
        //Update the status of the service which has been dropped to new stage in front end so that delay updating db doesnot cause the card to jump back to previous stage and then get updated
        let i = 0;
        if (previousChildComponent) {

          for (i = 0; i < previousChildComponent.displayedData.value.length; i++) {
            if (previousChildComponent.displayedData.value[i].id == serviceId) {
              previousChildComponent.displayedData.value[i].servicesStage = event.container.id;
              break;
            }
          }
        }
        let currentHistory =
          //event.previousContainer.data[event.previousIndex].stageHistory;
          event.item.data.stageHistory;
        this.stageValues.date = datePlaced;
        this.stageValues.stageId = event.container.id;
        this.stageValues.pipelineId = this.tableService.pipelineServiceSelection
        if (event.item.data.stageHistory) {
          currentHistory.push(this.stageValues);
          this.stageHistories = currentHistory;
        } else {
          this.stageHistories = [this.stageValues];
        }
        let lost = false;
        let won = false;
        let inPipeline = true;
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

        this.serviceGridService.onUpdateserviceStatus(
          this.superUserId,
          serviceId,
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
            { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.previousContainer.id) },
            { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.container.id) },
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
  onSubUserAssigned(selected, subUserId, firstName, secondName, branchId) {
    let assignedToName = firstName + ' ' + (secondName ? secondName : '');
    if (this.selection.selected.length > 0) {
      this.selection.clear(); //clear select of table
    }
    const dialogRef = this.dialog.open(ChildServiceList, {
      width: '500px',
      minHeight: '100px',
      disableClose: true,
      data: {
        fieldNameservice: this.fieldNameService,
        fieldNameTask: this.fieldNameTask,
        fieldNameFollowup: this.fieldNameFollowup,
        assignedToName: assignedToName,
        checked: false,
        selected,
        subUserId,
        branchId,
        branches: this.branches,
        superUserId: this.superUserId,
        userId: this.userId,
        userName: this.userName,
        scenario: 'reAssign',
        lastStatus: this.lastStatusoption,
      },
    });
  }

  // to toggle between list and table view, to select list
  onToggle() {
    if (!this.serviceGridService.isOldModeVisible) {
      this.selection.clear(); //clear select of table
      this.reloadChildComponent = false;
      this.reloadOldTableChildComponent = false;
      this.serviceGridService.serviceView = 'grid';
      // all should refresh while toggle
      this.reloadGridViewChildComponent();
      this.reloadChildComponent = true;
      this.reloadOldTableChildComponent = true;
    } else {
      this.reloadChildComponent = false;
      this.reloadOldTableChildComponent = false;
      this.serviceGridService.onFunctionCall('onToggle');
      this.reloadOldTableChildComponent = true;
      this.reloadChildComponent = true;
    }
    this.cdRef.detectChanges();
  }
  // to toggle between list and table view, to select table
  onToggleTab() {
    if (!this.serviceGridService.isOldModeVisible) {
      this.reloadChildComponent = false;
      this.reloadOldTableChildComponent = false;
      this.serviceGridService.serviceView = 'table';
      this.cdRef.detectChanges();
    } else {
      this.reloadChildComponent = false;
      this.reloadOldTableChildComponent = false;
      this.serviceGridService.onFunctionCall('onToggleTab');
    }
    this.cdRef.detectChanges();
  }
  openDialog(data: { columnsDispaly: any, customField: any }) {
    let columnsDispaly = data.columnsDispaly;
    let customFieldServices = data.customField;
    let col = columnsDispaly.map((obj) => ({
      ...obj,
    }));
    //open the dialog to customize the table fields
    const dialogRef = this.dialog.open(CustomTableSettingsComponent, {
      data: {
        columndata: col,
        userId: this.userId,
        displayName: 'displayServiceColumns',
        customFields: customFieldServices,
      },
      disableClose: true,
      width: '600px',
    })
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if (result) {
        this.tableChild.columnsDispaly = result.displayServiceColumns;
        this.columnsDispaly = result.displayServiceColumns;
        this.tableChild.configureTable();
      }
    })
  }
  //Function to open the card content custmization popup
  customizeCardContent() {
    const dialogRef = this.dialog.open(CardSettingsComponent, {
      data: ['service', this.cardFields, this.customFieldsService],
      width: '600px',
    })
    dialogRef.afterClosed().pipe(take(1)).subscribe((data) => {
      if (data) {
        [this.cardFields, this.displayFields] =
          this.commonService.getCardFields(
            'service',
            this.fieldNameServiceNote,
            this.fieldNameFollowup
          );
      }
    })
  }
  // selecy a filter
  onViewFilter(evt: MouseEvent): void {
    const target = new ElementRef(evt.currentTarget);
    const dialogRef = this.dialog.open(SupportCustomViewSelectComponent, {
      panelClass: 'dialog-side-panel',
      data: {
        trigger: target,
        serviceSettings: this.serviceSettings,
        cardFields: this.cardFields,
        fieldNameService: this.fieldNameService,
        fieldNameServiceNote: this.fieldNameServiceNote,
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
    let serviceViewSelected = JSON.parse(JSON.stringify(this.serviceGridService.serviceViewSelected));
    //call the popup for card field customization
    const dialogRef = this.dialog.open(LiteModeViewFilterComponent, {
      data: [
        'services',
        serviceViewSelected,
        mode,
        this.cardFields,
      ],
      width: 'auto',
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((res) => {
      if (res) {
        this.serviceGridService.serviceViewSelected.primaryQuery = res.viewSettings.primaryQuery;
        this.serviceGridService.serviceViewSelected.filters = res.viewSettings.filters;
        this.serviceGridService.serviceViewSelected.viewName = res.viewSettings.viewName;
        this.serviceGridService.serviceViewSelected.sortField = res.viewSettings.sortField;
        this.serviceGridService.serviceViewSelected.sortOrder = res.viewSettings.sortOrder;
        this.tableService.selectedStatus = ''; // reset selected status when filter changed
        this.tableService.secondViewSelected = res.viewSettings.viewName; // asisgn second view name
        this.tableService.viewSelected = this.tableService.secondViewSelected; // for displaying viewname in toolbar
        this.serviceGridService.onFunctionCall('viewChanged');
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
          this.serviceGridService.serviceViewSelected.viewName,
      },
      disableClose: true,
    });
    dialogref.afterClosed().pipe(take(1)).subscribe((res) => {
      if (res == 'deleted') {
        this.tableService
          .onDeletePublicView(this.superUserId, this.serviceGridService.serviceViewSelected.id)
          .then((res) => {
            this._snackBar.open('View has been deleted', '', {
              duration: 2000,
            });
            if (this.myViews.length > 0) {
              this.serviceGridService.serviceViewSelected = this.myViews[0];
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = this.serviceGridService.serviceViewSelected.viewName; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar
              this.serviceGridService.onFunctionCall('viewChanged');
            }
            else if (this.publicViews.length > 0) {
              this.serviceGridService.serviceViewSelected = this.publicViews[0];
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = this.serviceGridService.serviceViewSelected.viewName; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar
              this.serviceGridService.onFunctionCall('viewChanged');
            } else {
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = 'To be closed'; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar

              this.serviceGridService.isOldModeVisible = false;
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
          this.serviceGridService.serviceViewSelected.viewName,
      },
      disableClose: true,
    });
    dialogref.afterClosed().pipe(take(1)).subscribe((res) => {
      if (res == 'deleted') {
        this.tableService
          .onDeleteMyView(this.userId, this.serviceGridService.serviceViewSelected.id)
          .then((res) => {
            this._snackBar.open('View has been deleted', '', {
              duration: 2000,
            });
            if (this.myViews.length > 0) {
              this.serviceGridService.serviceViewSelected = this.myViews[0];
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = this.serviceGridService.serviceViewSelected.viewName; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar
              this.serviceGridService.onFunctionCall('viewChanged');
            }
            else if (this.publicViews.length > 0) {
              this.serviceGridService.serviceViewSelected = this.publicViews[0];
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = this.serviceGridService.serviceViewSelected.viewName; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar
              this.serviceGridService.onFunctionCall('viewChanged');
            } else {
              this.tableService.selectedStatus = ''; // reset selected status when filter changed
              this.tableService.secondViewSelected = 'To be closed'; // asisgn second view name

              this.tableService.viewSelected =
                this.tableService.secondViewSelected; // for displaying viewname in toolbar

              this.serviceGridService.isOldModeVisible = false;
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
  onTableSettings(value) {
    this.columnsDispaly = value;
    this.cdRef.detectChanges();
  }
}

