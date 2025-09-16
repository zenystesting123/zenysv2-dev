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
import { CommonService } from 'src/app/common.service';
import {
  DisplayColumn,
  Service,
  StageHistoryModel,
  SubUsers,
  contactSettings,
  defaultContactSettings,
  defaultServiceSettings,
  modules,
  serviceSettings,
} from 'src/app/data-models';
import { Pipelines } from 'src/app/model/pipeline.modal';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { StatusPopupComponent } from 'src/app/settings/status-popup/status-popup.component';
import { SupportGridService } from './support-grid.service';
import { ChildServiceList } from 'src/app/service-module/service-list/service-list.component';
import { take } from 'rxjs/operators';
import { ServiceTableColumns } from 'src/app/model/custom-report.model';
import { SupportListService } from '../support-list/support-list.service';
@Component({
  selector: 'app-support-grid',
  templateUrl: './support-grid.component.html',
  styleUrls: ['./support-grid.component.scss'],
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
export class SupportGridComponent implements OnInit, OnDestroy {
  // pass the event to service-list component so we can avoid duplication of same function in support-litemode table/ grid and this component

  @Output() editServiceEvent = new EventEmitter<{ index: number, service: Service }>();
  @Output() addTaskEvent = new EventEmitter<Service>();
  @Output() onCreateFollowUpsEvent = new EventEmitter<Service>();
  @Output() onTableSettingsEvent = new EventEmitter<DisplayColumn[]>(); // customize table columns

  @Input() userId: string; //logged in users id
  @Input() superUserId: string = ''; //super user id of logged in user
  @Input() columnsDispaly = []; // all column in table
  @Input() disableEditService: boolean = false; //based on access control, disable support edit
  @Input() actServiceAgeing: boolean = false; // check for is ageing is activated
  @Input() serviceSettings: serviceSettings = defaultServiceSettings.CONST_VALUE; // conatct field name settings
  @Input() contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  @Input() selection = new SelectionModel<Service>(true, []); // table selection
  @Input() customFieldsService: any = []; // custom fields support
  @Input() tableDefaultData = ServiceTableColumns; // default column
  @Input() accountType: string = ''; //accountType of logged in user
  @Input() disableFoll = false;//disable create followup
  @Input() serviceDataAccessRule: string; //contact data accees rule
  @Input() fieldNameFollowup: string = 'FollowUp';
  @Input() fieldNameTask: string = 'Task';
  @Input() fieldNameContact: string = 'Contact'; //customisable field name
  @Input() fieldNameService: string = 'Support';
  @Input() fieldNameOrganization = 'Organization';
  @Input() fieldNameServiceNotes: string = 'Note';
  @Input() cardFields: any[]; // all card fields
  @Input() displayFields: any; // displaying card fields
  @Input() servicePipelines: Pipelines[] = [];// service pipeline array
  @Input() userName: string; //logged in users full name
  @Input() reload: boolean; // for display the grid view
  @Input() myViews: any = []; // list of my views
  @Input() publicViews: any = []; // list of public views
  @Input() branches = [];
  @Input() disableDownloadService = false; //disabel download table

  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.
  userIdsArray: any[] = []; // user id array
  //holds the service array fetched from DB and stored in other arrays for filtering and reset purposes
  documentsArray: MatTableDataSource<Service>;
  filteredService: Service[];
  serviceFilter: Service[];
  displayName: string = 'displayServiceColumns';
  tableName: string = 'Service';
  serviceStatus: any = null; //Service stages under super user profile
  progressBarStatus: boolean = false; //progress bar status
  supportLoaded: boolean = false; //boolean to confirm DB fetch is completed
  stageHistories: any[];
  stageValues: StageHistoryModel = {
    date: null,
    stageId: null,
    pipelineId: null,
  };
  subUsers: SubUsers[] = []; //array of subusers under superuser
  serviceStatusAge: any; // Service age number
  inPipeline = false;
  won = false;
  lost = false;
  stageCollapseArray = [];
  columns = [];
  userNamesArray: any[] = [];
  sortField: any;
  sortOrder: any;
  userIdArray: any;
  serviceSubscription: Subscription;
  alertPopupStatus: boolean = false; // to open the alert dialoge once
  subscriptionOnViewChange: Subscription
  networkConnection: boolean; //to check network connection

  constructor(
    public dialog: MatDialog,
    private router: Router,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private changeDetectorRef: ChangeDetectorRef,
    public serviceGridService: SupportGridService, public tableService: SupportListService
  ) {
    this.documentsArray = new MatTableDataSource([]);
    this.subscriptionOnViewChange = this.serviceGridService.onFunctionCall$.subscribe((data) => {
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
        this.serviceGridService.onFunctionCall(""); // set onFunctionCallSource as empty
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
    this.documentsArray.data = this.filteredService;
    this.getStatusAndAgeFn();
    this.filterDataByPipeline(this.tableService.pipelineServiceSelection);
    this.selection.clear(); //clear select of table
    this.progressBarStatus = true;
    this.changeDetectorRef.detectChanges();
  }
  ngOnInit() {
    this.selection.clear();
    this.getStatusAndAgeFn();
    [this.userIdsArray, this.userNamesArray] =
      this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names

    if (this.serviceDataAccessRule) {
      [this.userIdArray, this.subUsers] =
        this.commonService.createUserlist(this.serviceDataAccessRule, this.userId);
    }

    if (this.serviceGridService.serviceViewSelected) {

      this.tableService.selectedStatus = ''; // reset selected status when filter changed
      this.tableService.secondViewSelected = this.serviceGridService.serviceViewSelected.viewName; // asisgn second view name

      this.tableService.viewSelected = this.tableService.secondViewSelected;
      this.getViewData();
    } else {
      if (this.myViews.length > 0) {
        this.serviceGridService.serviceViewSelected = this.myViews[0];
        this.tableService.selectedStatus = ''; // reset selected status when filter changed
        this.tableService.secondViewSelected = this.serviceGridService.serviceViewSelected.viewName; // asisgn second view name

        this.tableService.viewSelected = this.tableService.secondViewSelected;
        this.getViewData();
      } else if (this.publicViews.length > 0) {
        this.serviceGridService.serviceViewSelected = this.publicViews[0];
        this.tableService.selectedStatus = ''; // reset selected status when filter changed
        this.tableService.secondViewSelected = this.serviceGridService.serviceViewSelected.viewName; // asisgn second view name

        this.tableService.viewSelected = this.tableService.secondViewSelected;
        this.getViewData();
      } else {
        this.tableService.selectedStatus = ''; // reset selected status when filter changed
        this.tableService.secondViewSelected = 'To be closed'; // asisgn second view name

        this.tableService.viewSelected =
          this.tableService.secondViewSelected; // for displaying viewname in toolbar

        this.serviceGridService.isOldModeVisible = false;
      }
    }


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
      this.serviceGridService.serviceViewSelected.primaryQuery.queryField ==
      'additionalFieldsArr' &&
      !this.customFieldsService[this.serviceGridService.serviceViewSelected.primaryQuery.ind].isActive
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
      this.serviceGridService.serviceViewSelected.sortField.fieldType == 'Additional' &&
      !this.customFieldsService[this.serviceGridService.serviceViewSelected.sortField.ind].isActive
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
      this.serviceGridService.serviceViewSelected.filters?.forEach((element) => {
        if (
          element.queryField == 'additionalFieldsArr' &&
          !this.customFieldsService[element.ind].isActive
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
      this.serviceGridService.serviceViewSelected.primaryQuery
    );
    this.sortField = this.serviceGridService.serviceViewSelected.sortField;
    this.sortOrder = this.serviceGridService.serviceViewSelected.sortOrder;
    if (queryData) {
      if (this.serviceSubscription && !this.serviceSubscription.closed) {
        this.serviceSubscription.unsubscribe();
      }
      this.serviceSubscription = this.serviceGridService.getServiceList(
        this.superUserId,
        queryData,
        this.userIdArray,
      ).subscribe((data) => {
        let dataRead = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Service;
        });
        
        //If the primary query is based on createdBy field, then apply data access rule based on createdBy
        if (queryData.queryField == "createdBy") {
          if (
            this.serviceDataAccessRule == 'Team' ||
            this.serviceDataAccessRule == 'Own'
          ) {
            if (this.userIdArray) {
              dataRead = dataRead.filter((element) =>
                this.userIdArray.includes(element.createdBy)
              );
            } else {
              [this.userIdArray, this.subUsers] =
                this.commonService.createUserlist(
                  this.serviceDataAccessRule,
                  this.userId
                );
              dataRead = dataRead.filter((element) =>
                this.userIdArray.includes(element.createdBy)
              );
            }
          } else if (this.serviceDataAccessRule == 'Branch') {
            let branchId = this.commonService.getBranch(this.userId);
            dataRead = dataRead.filter(
              (element) => element.associatedBranch === branchId
            );
          }
        } else {
          //Filter records based on data access rule
          if (
            this.serviceDataAccessRule == 'Team' ||
            this.serviceDataAccessRule == 'Own'
          ) {
            if (this.userIdArray) {
              dataRead = dataRead.filter((element) =>
                this.userIdArray.includes(element.assignedTo)
              );
            } else {
              [this.userIdArray, this.subUsers] =
                this.commonService.createUserlist(
                  this.serviceDataAccessRule,
                  this.userId
                );
              dataRead = dataRead.filter((element) =>
                this.userIdArray.includes(element.assignedTo)
              );
            }
          } else if (this.serviceDataAccessRule == 'Branch') {
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
        if (this.serviceGridService.serviceViewSelected.filters.length > 0) {
          let filterData = this.serviceGridService.serviceViewSelected.filters;
          filterData.forEach((element) => {
            let filterQuery = this.commonService.getQueryData(element);
            dataRead = dataRead.filter((record) =>
              this.commonService.filterData(record, filterQuery)
            );
          });
        }
        this.serviceGridService.serviceList.next(dataRead as Service[]);

        this.filteredService = dataRead;

        this.serviceFilter = this.filteredService;
        this.documentsArray.data = this.filteredService;

        this.filterDataByPipeline(
          this.tableService.pipelineServiceSelection
        );
        this.supportLoaded = true;
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
      return e.selectedServPipeline === pipelineId;
    });
    this.changeDetectorRef.detectChanges();
  }



  getFieldValue(field, data) {
    return this.commonService.getFieldValue(field, data, modules.services);
  }
  customizeCardContent(module) {
    //call the popup for card field customization
    const dialogRef = this.dialog.open(CardSettingsComponent, {
      data: ['service', this.cardFields, this.customFieldsService],
      width: '600px',
    });
  }
  initStageCollapseArray() {
    this.stageCollapseArray = [];
    this.serviceStatus.forEach((element) => {
      this.stageCollapseArray.push(false);
    });
  }
  //Function to get stages and corresponding ages for selected pipeline
  getStatusAndAgeFn() {
    //based on pipeline selected filter stages and age
    var result = this.servicePipelines.filter((obj) => {
      return (
        obj.pipelineId === this.tableService.pipelineServiceSelection
      );
    });
    let statusArray;
    if (result.length > 0) {
      statusArray = result[0].pipelineStages.map(({ stageId, age }) => ({
        stageId,
        age,
      }));
    }
    this.serviceStatus = statusArray?.map(({ stageId }) => {
      return stageId;
    });

    this.serviceStatusAge = statusArray?.map(({ age }) => {
      return age;
    });
    this.initStageCollapseArray();
  }


  // data for drag and drop part in list view
  getFilteredData(docData, stage) {
    if (docData) {
      if (this.commonService.userPlan.multiPipelineAccess) {
        const pipelineSel = docData.filter((data) => {
          return data.selectedServPipeline === this.tableService.pipelineServiceSelection;
        });
    
        const dataService = pipelineSel.filter((data) => data.servicesStage === stage);
        return dataService;
      } else {
        const dataService = docData.filter((data) => data.servicesStage === stage);
        return dataService;
      }
    }
  }
  // status for drag and drop section in list view
  getFilteredStatus(docData, stage) {
    let dataServiceStatus = docData.filter((data) => data != stage);
    return dataServiceStatus;
  }
  // drag and drop and thus update status in service slist view
  drop(event: CdkDragDrop<Service[]>) {
    let datePlaced = new Date().getTime();
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      //let serviceId = event.previousContainer.data[event.previousIndex].id;
      let serviceId = event.item.data.id;
      // if drag and drop to lost column, need to show popup if disaplay for reason for rejection is checked
      if (
        this.serviceSettings.rejectionReasonVal?.display === true &&
        event.container.id === this.serviceStatus[this.serviceStatus.length - 1]
      ) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
          statusName: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.container.id),
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
            if (result) {
              //Update the status of the service which has been dropped to new stage in front end so that delay updating db doesnot cause the card to jump back to previous stage and then get updated
              let i = 0;
              for (i = 0; i < this.serviceFilter.length; i++) {
                if (this.serviceFilter[i].id == serviceId) {
                  this.serviceFilter[i].servicesStage = event.container.id;

                  break;
                }
              }
              let currentHistory =
               event.item.data.stageHistory;
              this.stageValues.date = datePlaced;
              this.stageValues.stageId = event.container.id;
              this.stageValues.pipelineId = this.tableService.pipelineServiceSelection;
              if (event.item.data.stageHistory) {
                currentHistory.push(this.stageValues);
                this.stageHistories = currentHistory;
              } else {
                this.stageHistories = [this.stageValues];
              }
              let prevObj;
              let currObj;
              if (
                event.container.id ===
                this.serviceStatus[this.serviceStatus.length - 1]
              ) {
                this.lost = true;
                this.won = false;
                this.inPipeline = false;
                prevObj = { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.previousContainer.id), rejectionReasonVal: '' };
                currObj = { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.container.id), rejectionReasonVal: result.rejectionReasonValue };
              } else if (
                event.container.id ===
                this.serviceStatus[this.serviceStatus.length - 2]
              ) {
                this.lost = false;
                this.won = true;
                this.inPipeline = false;
                prevObj = { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.previousContainer.id) };
                currObj = { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.container.id) };
              } else {
                this.lost = false;
                this.won = false;
                this.inPipeline = true;
                prevObj = { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.previousContainer.id) };
                currObj = { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.container.id) };
              }

              this.serviceGridService.onUpdateserviceStatus(
                this.superUserId,
                serviceId,
                event.container.id,
                this.stageHistories,
                datePlaced,
                this.inPipeline,
                this.won,
                this.lost,
                (event.container.id === this.serviceStatus[this.serviceStatus.length - 1]) ? result.rejectionReasonValue : '',
                ChangeLogComponent.saveLog(
                  this.constructor.name,
                  this.userId,
                  this.userName,
                  prevObj, currObj,
                  this.serviceFilter[i].changeLog
                )
              );
            }
          });
      } else {
        //Update the status of the service which has been dropped to new stage in front end so that delay updating db doesnot cause the card to jump back to previous stage and then get updated
        let i = 0;
        for (i = 0; i < this.serviceFilter.length; i++) {
          if (this.serviceFilter[i].id == serviceId) {
            this.serviceFilter[i].servicesStage = event.container.id;
            /*this.servicesArray.data[i].servicesStage = event.container.id;
          this.array2.data[i].servicesStage = event.container.id;
          if(this.documentsArray){
            if(this.documentsArray.data){
              if(this.documentsArray.data[i]){
                this.documentsArray.data[i].servicesStage = event.container.id;
              }
            }
          }*/
            break;
          }
        }
        let currentHistory =
          //event.previousContainer.data[event.previousIndex].stageHistory;
          event.item.data.stageHistory;
        this.stageValues.date = datePlaced;
        this.stageValues.stageId = event.container.id;
        this.stageValues.pipelineId = this.tableService.pipelineServiceSelection;
        if (event.item.data.stageHistory) {
          currentHistory.push(this.stageValues);
          this.stageHistories = currentHistory;
        } else {
          this.stageHistories = [this.stageValues];
        }

        if (
          event.container.id ===
          this.serviceStatus[this.serviceStatus.length - 1]
        ) {
          this.lost = true;
          this.won = false;
          this.inPipeline = false;
        } else if (
          event.container.id ===
          this.serviceStatus[this.serviceStatus.length - 2]
        ) {
          this.lost = false;
          this.won = true;
          this.inPipeline = false;
        } else {
          this.lost = false;
          this.won = false;
          this.inPipeline = true;
        }

        this.serviceGridService.onUpdateserviceStatus(
          this.superUserId,
          serviceId,
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
            { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.previousContainer.id) },
            { servicesStage: this.commonService.getStatusName(modules.services, this.tableService.pipelineServiceSelection, event.container.id) },
            this.serviceFilter[i].changeLog
          )
        );
      }
    }
  }
  // list view selection
  onToggle() {
    this.selection.clear(); //clear select of table
    this.serviceGridService.serviceView = 'grid';

  }
  // table view selection
  onToggleTab() {
    this.serviceGridService.serviceView = 'table';

  }



  // on destroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.serviceSubscription?.unsubscribe();
    this.subscriptionOnViewChange?.unsubscribe();
  }
  trackbyServiceList(index: number, service: Service): string {
    return service.id;
  }
  getAgedStatus(element) {
    // if age activation is there
    if (this.actServiceAgeing) {
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
      const pipeLine = this.servicePipelines.filter((obj) => {
        return obj.pipelineId === element.selectedServPipeline;
      });
      if (pipeLine.length === 0) {
        return 'N/A';
      } else {
        let statusArray = pipeLine[0].pipelineStages;
        if (statusArray.length === 0) {
          return 'N/A';
        } else {
          let statusObj = statusArray.filter((obj) => {
            return obj.stageId === element.servicesStage;
          });
          // status deleted case
          if (statusObj.length === 0) {
            return 'N/A';
          } else {
            let maxDaysinStage = statusObj[0].age;

            if (
              element.servicesStage ===
              statusArray[statusArray.length - 1].stageId ||
              element.servicesStage === statusArray[statusArray.length - 2].stageId
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


  // Service edit function
  editService(row) {
    const data = { index: 0, service: row };
    this.editServiceEvent.emit(data);
  }
  // add task
  addTask(serviceFiltered) {
    this.addTaskEvent.emit(serviceFiltered);
  }
  // create followup
  onCreateFollowUps(support) {
    this.onCreateFollowUpsEvent.emit(support);
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
}



