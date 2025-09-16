import { animate, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import {
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ElementRef,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import { CrudServiceComponent } from 'src/app/crud-service/crud-service.component';
import {
  CheckStatus,
  contactSettings,
  defaultContactSettings,
  defaultServiceSettings,
  DisplayColumn,
  FollowUps,
  modules,
  Profile,
  Service,
  serviceSettings,
  StageHistoryModel,
  SubUsers,
  Task,
  UserAccessDetails,
} from 'src/app/data-models';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { ServiceListService } from './service-list.service';
import { ServiceTableColumns } from 'src/app/model/custom-report.model';
import { CardSettingsComponent } from 'src/app/card-settings/card-settings.component';
import { ViewBuilderComponent } from 'src/app/view-builder/view-builder.component';
import { ServiceViewSettingsDef } from 'src/app/model/custom-filter.model';
import { CrudModal1Component } from 'src/app/taskboard/crud-modal1/crud-modal1.component';
import { FollowupTaskCreateComponent } from 'src/app/followup-task-create/followup-task-create.component';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { SelectSearchComponent } from 'src/app/common-search/select-search/select-search.component';
import { StatusPopupComponent } from 'src/app/settings/status-popup/status-popup.component';
import { CommonListDataService } from 'src/app/common-list-data.service';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { ViewServiceService } from 'src/app/view-builder/view-service.service';
import { Pipelines } from 'src/app/model/pipeline.modal';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
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
export class ServiceListComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.
  services: Service[];
  filteredservice: Service[];
  serviceFilter: Service[];
  documentsArray: MatTableDataSource<Service>;
  servicesArray: MatTableDataSource<Service>;
  array1: MatTableDataSource<Service>;
  array2: MatTableDataSource<Service>;
  userId: string = ''; //logged in users id
  serviceStatus: any = null; //service stages under super user profile
  createDate: any = null; //logged in users created date
  serviceStatusLength: number = 0; // length of service stages under superuser profile
  statusCheck: CheckStatus[] = []; //service stages under superuser profile
  // disableContact: boolean = false; //disable contact create based on access control permission // code commented for cleanup
  disableserviceView: boolean = false; //disable service view based on access control permission
  disableservices: boolean = false; //disable create service based on access control permission
  disableserviceDownload = false; //disabel download table
  filters: String[]; //for filter by priority
  filtersservice: String[]; //for filter by status
  superUserId: string = ''; //logged in users superuser id
  progressBarStatus: boolean = false; //progress bar status
  serviceLoaded: boolean = false; //boolean to confirm DB fetch is completed
  filterViewtoolbar: Boolean = false; //to show/hide priority and stage filter button - currently not using
  noOfStages: number;
  // additional field variables
  fieldListArray: any = [];
  stageHistories: any[];
  stageHistory: any[] = [];
  stageValues: StageHistoryModel = {
    date:null,
    stageId: null,
    pipelineId: null
  }

  usrProfileData: UserAccessDetails = null; //access control settings
  disableserviceEdit: boolean = false; //based on access control, disable service edit
  searchTerm: string = null; //search by field variable
  superUserDetails: Profile = null; //super user profile
  // customisable field names
  fieldNameservice: string = 'Support';
  fieldNameContact: string = 'Contact';
  fieldNameTask: string = 'Task';
  fieldNameItems: string = 'Products and Service';
  fieldNameFollowup: string = 'FollowUp';
  fieldNameOrganization = 'Organization';
  fieldNameServiceNotes: string = 'Note';

  subUsers: SubUsers[] = []; //array of subusers under superuser
  userFirstName: string; //user first name
  userLastName: string; // userlast name
  commonServSubscription: Subscription; //commonservice subscription

  selection = new SelectionModel<Service>(true, []); //checkbox selection for re-assign service
  count = 0; //for reassign service, no of services is stored in this variable
  userFullName: string;
  today: Date = new Date();
  // filterStage: string; //code commente for cleanup
  // assignedToFilter: string; code commented for cleanup
  actserviceAgeing: boolean = false; // check for is ageing is activated
  serviceStatusPipeline: String[]; // service pipeline code commented for cleanup//need to verify this
  serviceStatusAge: any; // service age number
  stageCollapseArray = [];
  pipelineActive = false;
  inPipeline = false;
  won = false;
  lost = false;
  displayFields: any;
  cardFields: any;
  dialogRef: MatDialogRef<CardSettingsComponent, any>;

  columns = [];
  userIdsArray: any[] = [];
  userNamesArray: any[] = [];
  displayColumnsSaved: DisplayColumn[] = [];
  displayName: string = 'displayServiceColumns';
  tableName: string = 'Service';
  accountType: string;
  tableDefaultData = ServiceTableColumns;
  fieldSettings: serviceSettings = defaultServiceSettings.CONST_VALUE;
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  dataAccessRuleCheck: string;
  viewSettingArray: any = ServiceViewSettingsDef.DATA; //customer view settings array
  viewSettingSelected: any = this.viewSettingArray[0]; //particular view chosen by user
  sortField: any;
  sortOrder: any;
  userIdArray: any;
  allUsersId: any;
  userDetailsAll: any;
  serviceSubscription: Subscription;
  serviceSelected: Service = null;
  changeLog: any;
  secondaryFilterSet: boolean = false; //Field to check if secondary filter has been set or not
  secondaryFilterField: any;
  secondaryFilterValue: any;
  sortOrderSet: boolean = false;
  sortCardFieldSet: boolean = false;
  sortBy: any;
  noOfServiceinViewPipeline: any;
  allSubUsers: any[] = [];
  subusersToDisplay = [];
  userName: string;
  branches = [];
  disableReAssign = false;
  alertPopupStatus: boolean = false; // to open the alert dialoge once
  plan: string = ''; //plan of superuser
  agedFilterSet: boolean = false;//Field to check if aged filter has been set or not
  taskDefaultOption: any = ['Open','Completed'];
  taskStatusOption: any;
  lastStatusoption: any;
  contactDetails = null;// customer details
  servicePipelines:Pipelines[]=[]; // service pipelines
  constructor(
    private serviceService: ServiceListService,
    public dialog: MatDialog,
    private router: Router,
    private location: Location,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private snack: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    private viewServiceService: ViewServiceService,
    public commonListDataService: CommonListDataService
  ) {}

  ngOnInit(): void {
    this.documentsArray = new MatTableDataSource([]);
    this.servicesArray = new MatTableDataSource([]);
    this.array1 = new MatTableDataSource([]);
    this.array2 = new MatTableDataSource([]);
    let defaultViewset = true; // to block changinf the view if userdatas are changed
    this.commonServSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData){
          if(allData.userDetails.enableLiteMode){
            this.router.navigate(['dash/support-list']);
          }else {
            // assigning fetched datas to local variables
            this.usrProfileData = allData.usrProfileData;
            this.userId = allData.userId;
            this.userName = allData.userDetails.lastname
              ? allData.userDetails.firstname + ' ' + allData.userDetails.lastname
              : allData.userDetails.firstname;
            this.branches = allData.branches;
            let userData = allData.userDetails;
            this.superUserId = userData.superUserId;
            this.createDate = userData?.createdDate;
            this.superUserDetails = allData.superUserDetails;
            this.taskStatusOption = this.superUserDetails.taskStatusOpn?this.superUserDetails.taskStatusOpn:this.taskDefaultOption;
            this.lastStatusoption = this.taskStatusOption[this.taskStatusOption.length - 1];
            this.userFirstName = allData.superUserDetails.firstname;
            this.userLastName = allData.superUserDetails.lastname;
            if (allData.userDetails.serviceViewSettings) {
              this.viewSettingArray = JSON.parse(
                JSON.stringify(allData.userDetails.serviceViewSettings)
              ); //View setting array for sale list
              this.viewSettingSelected =
                this.viewSettingArray[this.commonListDataService.supportViewId]; // particular view selected
            }
            this.allSubUsers = this.commonService.createUserlist('All', 'any')[1];
            this.subusersToDisplay = this.allSubUsers;
            this.subusersToDisplay = this.subusersToDisplay.filter(function (e) {
              return e.status != 'suspended';
            });
            this.fieldNameServiceNotes = this.superUserDetails.fieldNames
              ?.fieldNameServiceNotes
              ? this.superUserDetails.fieldNames?.fieldNameServiceNotes
              : 'Note';
            this.fieldNameFollowup = this.superUserDetails?.fieldNames
              ?.fieldNameFollowup
              ? this.superUserDetails?.fieldNames?.fieldNameFollowup
              : 'FollowUp';
            [this.allUsersId, this.userDetailsAll] =
              this.commonService.createUserlist('All', 'any'); //create list of all subusers
            [this.cardFields, this.displayFields] =
              this.commonService.getCardFields(
                'service',
                this.fieldNameServiceNotes,
                this.fieldNameFollowup
              );

            if (allData.userDetails.lastname) {
              this.userFullName =
                allData.userDetails.firstname +
                ' ' +
                allData.userDetails.lastname;
            } else {
              this.userFullName = allData.userDetails.firstname;
            }
            if (allData.superUserDetails.actserviceAgeing) {
              // check for service ageing is activated
              this.actserviceAgeing = allData.superUserDetails.actserviceAgeing;
            }
            //customisation contact field
            if (
              allData.superUserDetails.contactSettings &&
              typeof allData.superUserDetails.contactSettings !== 'undefined' &&
              allData.superUserDetails.contactSettings !== null
            ) {
              this.contactSettings = allData.superUserDetails.contactSettings;
            }
            this.plan = allData.superUserDetails.plan;
            //if there is multiple pipeline access, show all pipelines else show single pipeline
          this.servicePipelines = JSON.parse(JSON.stringify(allData.servicePipelines));
          if (this.commonService.userPlan.multiPipelineAccess) {
            this.pipelineActive = true;
          } else {
            this.servicePipelines.length = 1;// set only one pipeline
          }

          var result = this.servicePipelines.filter((obj) => {
            return (
              obj.pipelineId === this.commonListDataService.selectedServicePipeline
            );
          });
          if(result.length === 0 &&this.commonListDataService.selectedServicePipeline != 'All Pipelines'){
            // if pipeline is not selected assign first pipeline
              this.commonListDataService.selectedServicePipeline =
              this.servicePipelines[0].pipelineId;
          }
          if(this.commonListDataService.pipelineServiceSelection){
            // if pipeline array is not there
            this.commonListDataService.pipelineServiceSelection =
            this.commonService.getPipelineNames(
              modules.services,
              this.servicePipelines[0].pipelineId
            );
          }
            this.getStatusAndAgeFn();
            this.noOfStages = this.serviceStatus?.length - 1;
            this.accountType = allData.userDetails.accountType;
            if (allData.userDetails.displayServiceColumns) {
              this.displayColumnsSaved =
                allData.userDetails.displayServiceColumns;
            }
            if (this.displayColumnsSaved.length > 0) {
              //if table settings are stored in db, use the stored data
              this.columns = this.displayColumnsSaved;
              // remove select column if settings already saved in DB
              var ind = this.columns.findIndex((p) => p.columnDef == 'select');
              if (ind > -1) {
                this.columns.splice(ind, 1);
              }
            } else {
              this.columns = ServiceTableColumns;
            }
            [this.userIdsArray, this.userNamesArray] =
              this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names
            if (this.usrProfileData.isCheckedService == false) {
              this.disableservices = true;
              this.disableserviceView = true;
              this.disableserviceEdit = true;
              this.disableserviceDownload = true;
              this.disableReAssign = true;
            } else {
              if (this.usrProfileData.servicesCreate == false) {
                this.disableservices = true;
              }
              if (this.usrProfileData.servicesView == false) {
                this.disableserviceView = true;
              }
              if (this.usrProfileData.servicesEdit == false) {
                this.disableserviceEdit = true;
              }
              if (this.usrProfileData.servicesDownload == false) {
                this.disableserviceDownload = true;
              }
              if (this.usrProfileData.serviceReAssign === false) {
                this.disableReAssign = true;
              }
            }
            if (this.superUserDetails) {
              if (this.superUserDetails?.fieldNames) {
                this.fieldNameContact =
                  this.superUserDetails?.fieldNames.fieldNameContact;

                this.fieldNameTask =
                  this.superUserDetails?.fieldNames.fieldNameTask;
                this.fieldNameItems =
                  this.superUserDetails?.fieldNames.fieldNameItems;
              }
              if (this.superUserDetails?.fieldNames?.fieldNameService) {
                this.fieldNameservice =
                  this.superUserDetails.fieldNames.fieldNameService;
              }
              if (allData.superUserDetails?.fieldNames?.fieldNameOrganization) {
                this.fieldNameOrganization =
                  allData.superUserDetails.fieldNames.fieldNameOrganization;
              }
              this.fieldListArray = this.superUserDetails?.customFieldsService;
              this.statusCheck = [];
              if (this.serviceStatus) {
                this.serviceStatus.forEach((element) => {
                  this.statusCheck.push(new CheckStatus(element, false));
                  this.serviceStatusLength = this.serviceStatus.length;
                });
              }
              if (
                allData.superUserDetails.serviceSettings &&
                typeof allData.superUserDetails.serviceSettings !== 'undefined' &&
                allData.superUserDetails.serviceSettings !== null
              ) {
                this.fieldSettings = allData.superUserDetails.serviceSettings;
              }
              if (this.usrProfileData.serviceDataAccessRule) {
                this.dataAccessRuleCheck =
                  this.usrProfileData.serviceDataAccessRule;
                [this.userIdArray, this.subUsers] =
                  this.commonService.createUserlist(
                    this.usrProfileData.serviceDataAccessRule,
                    this.userId
                  );
                  this.subUsers = this.subUsers.filter(function (e) {
                    return e.status != 'suspended';
                  });
              }
              // to set the view based on the default view saved in db.
              // at the first time the block will excute also then if customerView changed in current user, any other changes in super/current user will not enter to this block
              if (
                (allData.userDetails.serviceDefaultView &&
                  defaultViewset &&
                  this.commonListDataService.supportView ==
                    this.commonListDataService.supportDefaultView) ||
                (allData.userDetails.serviceDefaultView &&
                  allData.userDetails.serviceDefaultView !=
                    this.commonListDataService.supportDefaultView)
              ) {
                this.commonListDataService.supportView =
                  allData.userDetails.serviceDefaultView;
                this.commonListDataService.supportDefaultView =
                  allData.userDetails.serviceDefaultView;
                defaultViewset = false;
              }
              if (this.commonListDataService.supportView == 'grid') {
                if (
                  this.commonListDataService.selectedServicePipeline ===
                  'All Pipelines'
                ) {
                  this.commonListDataService.selectedServicePipeline = this.servicePipelines[0].pipelineId;// set it to firstpipeline for grid view
                  this.commonListDataService.pipelineServiceSelection =
                  this.commonService.getPipelineNames(modules.services, this.servicePipelines[0].pipelineId);
                  this.pipelineChangedEvent();
                }
              } else {
              }
              this.getViewData();
            }
          }
        }
      }
    );
  }

  async ServiceIsCalled(taskId) {
    // console.log('task called');
    await this.getService(taskId);
    this.commonService.updateserviceToEdit(this.serviceSelected);
    const dialogRef = this.dialog.open(CrudServiceComponent, {
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: { scenario: 'edit', id: taskId },
    });
  }
  getService(id) {
    return new Promise<void>((resolve) => {
      // console.log('fetch service from DB');
      this.serviceService
        .getService(this.superUserId, id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((task) => {
          this.serviceSelected = task;
          resolve();
        });
    });
  }
  // add task
  addTask(
    serviceId,
    customerId,
    orgId,
    company,
    fname,
    sname,
    surname,
    serviceTitle
  ) {
    this.dialog.open(CrudModal1Component, {
      width: '520px',
      height: 'auto',
      disableClose: true,
      data: {
        sid: serviceId,
        cid: customerId,
        orgId: orgId,
        mode: 'serviceCreate',
        company: company,
        firstName: fname,
        secondName: sname,
        surname: surname,
        serviceName: serviceTitle,
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
    serviceId,
    customerId,
    company,
    fname,
    sname,
    serviceTitle,
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
        contactNumber: this.contactDetails.contactNo ? this.contactDetails.contactNo:'', // pass customer number
        countryCode: this.contactDetails.code ? this.contactDetails.code:'', // pass customer country code
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
  getFieldValue(field, data) {
    return this.commonService.getFieldValue(field, data,modules.services);
  }
  customizeCardContent(module) {
    //call the popup for card field customization
    this.dialogRef = this.dialog.open(CardSettingsComponent, {
      data: ['service', this.cardFields, this.fieldListArray],
      width: '600px',
    });
  }
  initStageCollapseArray() {
    this.stageCollapseArray = [];
    this.serviceStatus?.forEach((element) => {
      this.stageCollapseArray.push(false);
    });
  }

  filterDataByPipelines(pipelineId) {
    // based onpipeline selected filter data
    if (
      this.commonListDataService.selectedServicePipeline === 'All Pipelines'
    ) {
      this.documentsArray.data = this.documentsArray.data
    } else {
      this.documentsArray.data =
      this.documentsArray.data?.filter(function (e) {
          return e.selectedServPipeline === pipelineId;
        });
    }
  }
  getStatusAndAgeFn() {
    if(this.commonListDataService.selectedServicePipeline !== 'All Pipelines'){
      //based on pipeline selected filter stages and age
      var result = this.servicePipelines.filter((obj) => {
        return obj.pipelineId === this.commonListDataService.selectedServicePipeline;
      });
      let statusArray;
      if(result.length>0){
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
  }
  pipelineChangedEvent() {
    if(this.commonListDataService.selectedServicePipeline=="All Pipelines"){
      this.commonListDataService.pipelineServiceSelection = "All Pipelines"
    }
    this.documentsArray.data = this.filteredservice;
    this.getStatusAndAgeFn();
    this.filterDataByPipelines(this.commonListDataService.selectedServicePipeline);
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
    this.noOfStages = this.serviceStatus.length - 1;
    this.getNoOfRecords();
    this.selection.clear(); //clear select of table
  }
  viewPipelineChanged() {
    this.documentsArray.data = this.filteredservice;
    this.getStatusAndAgeFn(); //created status and age array for selected pipeline

    this.filterDataByPipelines(this.commonListDataService.selectedServicePipeline);

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
    //this.getViewData();
    this.noOfStages = this.serviceStatus.length - 1;
    this.getNoOfRecords();

    this.getViewData();
    this.selection.clear(); //clear select of table
  }
  hideStage(i) {
    //console.log("Index",i)
    this.stageCollapseArray[i] = !this.stageCollapseArray[i];
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.documentsArray.data.length;
    return numSelected == numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.documentsArray.data.forEach((row) => this.selection.select(row));
  }
  // re assign contact to superuser
  onMainUserAssigned(selected: Service[], firstName, secondName) {
    let assignedToName = firstName + ' ' + (secondName ? secondName : '');
    let userId = this.superUserId;

    const dialogRef = this.dialog.open(ChildServiceList, {
      width: '500px',
      data: {
        fieldNameservice: this.fieldNameservice,
        fieldNameTask: this.fieldNameTask,
        assignedToName: assignedToName,
        scenario: 'reAssign',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          if (result === 're-assign') {
            this.progressBarStatus = false;
            selected.forEach((element) => {
              this.serviceService.onUpdateServiceMain(
                userId,
                element.id,
                assignedToName,
                'NA',
                ChangeLogComponent.saveLog(
                  'ServiceListComponent',
                  this.userId,
                  this.userName,
                  {
                    assignedTo: element.assignedTo,
                    assignedToName: element.assignedToName,
                    ...(this.branches.length > 0 && {
                      associatedBranch:
                        this.branches.length > 0
                          ? this.branches.find(
                              (item) => item.id === element.associatedBranch
                            )?.name
                            ? this.branches.find(
                                (item) => item.id === element.associatedBranch
                              )?.name
                            : ''
                          : '',
                    }),
                  },
                  {
                    assignedTo: userId,
                    assignedToName: assignedToName,
                    ...(this.branches.length > 0 && {
                      associatedBranch: 'NA',
                    }),
                  },
                  element.changeLog
                )
              );
              //update open tasks in tasks collection
              this.serviceService
                .getAllOpenTaskswithService(userId, element.id,this.lastStatusoption)
                .pipe(takeUntil(this.onDestroy$))
                .subscribe((data) => {
                  let openTaskswithservice = data.map((e) => {
                    return {
                      id: e.payload.doc.id,
                      ...(e.payload.doc.data() as {}),
                    } as Task;
                  });
                  openTaskswithservice.forEach((ele) => {
                    this.serviceService.onUpdateTaskMain(
                      userId,
                      ele.id,
                      assignedToName,
                      'NA',
                      ChangeLogComponent.saveLog(
                        'ServiceListComponent',
                        this.userId,
                        this.userName,
                        {
                          assignedTo: ele.assignedTo,
                          assignedToName: ele.assignedToName,
                          ...(this.branches.length > 0 && {
                            associatedBranch:
                              this.branches.length > 0
                                ? this.branches.find(
                                    (item) => item.id === ele.associatedBranch
                                  )?.name
                                  ? this.branches.find(
                                      (item) => item.id === ele.associatedBranch
                                    )?.name
                                  : ''
                                : '',
                          }),
                        },
                        {
                          assignedTo: userId,
                          assignedToName: assignedToName,
                          ...(this.branches.length > 0 && {
                            associatedBranch: 'NA',
                          }),
                        },
                        ele.changeLog
                      )
                    );
                  });
                  this.count++;
                  if (this.count == selected.length) {
                    this.progressBarStatus = true;
                    selected.length = 0;
                    this.selection = new SelectionModel<Service>(true, []);
                    // mat snack bar
                    this.snack.open('Re-assigning completed', '', {
                      duration: 2000,
                    });
                  }
                });
            });
          }
        }
      });
  }
  // reassign contact to subuser
  onSubUserAssigned(selected, subUserId, firstName, secondName, branchId) {
    let assignedToName = firstName + ' ' + (secondName ? secondName : '');
    let userId = this.superUserId;
    if (this.selection.selected.length > 0) {
      this.selection.clear(); //clear select of table
    }
    const dialogRef = this.dialog.open(ChildServiceList, {
      width: '500px',
      minHeight: '100px',
      disableClose: true,
      data: {
        fieldNameservice: this.fieldNameservice,
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
        lastStatus:this.lastStatusoption,
      },
    });
    // dialogRef
    //   .afterClosed()
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe((result) => {
    //     if (result) {
    //       if (result === 're-assign') {
    //         this.progressBarStatus = false;
    //         selected.forEach((element) => {
    //           this.serviceService.onUpdateserviceSub(
    //             userId,
    //             subUserId,
    //             element.id,
    //             assignedToName,
    //             branchId
    //           );
    //           //update open tasks in tasks collection
    //           this.serviceService
    //             .getAllOpenTaskswithService(userId, element.id)
    //             .pipe(takeUntil(this.onDestroy$))
    //             .subscribe((data) => {
    //               let openTaskswithservice = data.map((e) => {
    //                 return {
    //                   id: e.payload.doc.id,
    //                   ...(e.payload.doc.data() as {}),
    //                 } as Task;
    //               });
    //               openTaskswithservice.forEach((ele) => {
    //                 this.serviceService.onUpdateTaskSub(
    //                   userId,
    //                   subUserId,
    //                   ele.id,
    //                   assignedToName,
    //                   branchId
    //                 );
    //               });
    //               this.count++;
    //               if (this.count == selected.length) {
    //                 this.progressBarStatus = true;
    //                 selected.length = 0;
    //                 this.selection = new SelectionModel<Service>(true, []);
    //                 // mat snack bar
    //                 this.snack.open('Re-assigning completed', '', {
    //                   duration: 2000,
    //                 });
    //               }
    //             });
    //         });
    //       }
    //     }
    //   });
  }
  // data for drag and drop part in list view
  getFilteredData(docData, stage) {
    if (docData) {
      if (this.pipelineActive === true) {
        const pipelineSel = docData.filter(
          (data) =>
            data.selectedServPipeline ===
              this.commonListDataService.selectedServicePipeline
        );
        const dataService = pipelineSel.filter(
          (data) => data.servicesStage === stage
        );
        return dataService;
      } else {
        const dataService = docData.filter(
          (data) => data.servicesStage === stage
        );
        return dataService;
      }
    }
  }
  // status for drag and drop section in list view
  getFilteredStatus(docData, stage) {
    let dataserviceStatus = docData.filter((data) => data != stage);
    return dataserviceStatus;
  }
  // go to services details if we click mat-card in services list
  onViewservice(serviceId: string) {
    this.router.navigate(['dash/service/service-details/' + serviceId]);
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
      // console.log('else');
      //let serviceId = event.previousContainer.data[event.previousIndex].id;
      let serviceId = event.item.data.id;
      // if drag and drop to lost column, need to show popup if disaplay for reason for rejection is checked
      if (
        this.fieldSettings.rejectionReasonVal?.display === true &&
        event.container.id === this.serviceStatus[this.serviceStatus.length - 1]
      ) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
          statusName: this.commonService.getStatusName(modules.services, this.commonListDataService.selectedServicePipeline, event.container.id),
          stage: event.container.id,
          fieldNameservice: this.fieldNameservice,
          scenario: 'updateStage',
          rejectionReasonValue: '', //to store selected reason
          rejectionReasonArr:
            this.fieldSettings?.rejectionReason?.rejectionReason?.split(','), //reason for rejection options array
          rejectionReasonMandatory:
            this.fieldSettings.rejectionReasonVal.mandatory, //reason for rejection mandatory check
          rejectionReasonDisplay: this.fieldSettings.rejectionReasonVal.display, //whether to display/not reason for rejection
        };
        const dialogRef = this.dialog.open(ChildServiceList, dialogConfig);
        dialogRef
          .afterClosed()
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((result) => {
            // console.log(result);
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
                //event.previousContainer.data[event.previousIndex].stageHistory;
                event.item.data.stageHistory;
                this.stageValues.date = datePlaced;
                this.stageValues.stageId = event.container.id;
                  this.stageValues.pipelineId = this.commonListDataService.selectedServicePipeline
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
                prevObj = { servicesStage: this.commonService.getStatusName(modules.services, this.commonListDataService.selectedServicePipeline, event.previousContainer.id), rejectionReasonVal: '' };
                currObj = { servicesStage: this.commonService.getStatusName(modules.services, this.commonListDataService.selectedServicePipeline, event.container.id), rejectionReasonVal: result.rejectionReasonValue};
              } else if (
                event.container.id ===
                this.serviceStatus[this.serviceStatus.length - 2]
              ) {
                this.lost = false;
                this.won = true;
                this.inPipeline = false;
                prevObj = { servicesStage: this.commonService.getStatusName(modules.services, this.commonListDataService.selectedServicePipeline, event.previousContainer.id) };
                currObj = { servicesStage: this.commonService.getStatusName(modules.services, this.commonListDataService.selectedServicePipeline, event.container.id) };
              } else {
                this.lost = false;
                this.won = false;
                this.inPipeline = true;
                prevObj = { servicesStage: this.commonService.getStatusName(modules.services, this.commonListDataService.selectedServicePipeline, event.previousContainer.id) };
                currObj = { servicesStage: this.commonService.getStatusName(modules.services, this.commonListDataService.selectedServicePipeline, event.container.id) };
              }

              this.serviceService.onUpdateserviceStatus(
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
                  this.userFullName,
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
        this.stageValues.pipelineId = this.commonListDataService.selectedServicePipeline
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

        this.serviceService.onUpdateserviceStatus(
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
            this.userFullName,
            { servicesStage: this.commonService.getStatusName(modules.services, this.commonListDataService.selectedServicePipeline, event.previousContainer.id) },
            { servicesStage: this.commonService.getStatusName(modules.services, this.commonListDataService.selectedServicePipeline, event.container.id) },
            this.serviceFilter[i].changeLog
          )
        );
      }
    }
  }

  // list view selection
  onToggle() {
    this.selection.clear(); //clear select of table
    this.commonListDataService.supportView = 'grid';
    if (
      this.commonListDataService.pipelineServiceSelection === 'All Pipelines' || this.commonListDataService.selectedServicePipeline === 'All Pipelines'
    ) {
      this.commonListDataService.selectedServicePipeline = this.servicePipelines[0].pipelineId;// set it to firstpipeline for grid view
      this.commonListDataService.pipelineServiceSelection =
        this.commonService.getPipelineNames(
          modules.services,
          this.servicePipelines[0].pipelineId);
      this.pipelineChangedEvent();
    }
  }
  // table view selection
  onToggleTab() {
    this.commonListDataService.supportView = 'table';
  }
  // filter by status
  checkStatus() {
    this.filtersservice = [];
    this.statusCheck.forEach((element) => {
      if (element.isChecked) {
        this.filtersservice.push(element.name);
      } else {
        let index = this.filtersservice.findIndex((s) => s === element.name);
        if (index >= 0) {
          this.filtersservice.splice(index, 1);
        }
      }
    });
    let emptyArrayservice = new MatTableDataSource([]);
    this.filtersservice.forEach((element) => {
      this.servicesArray.data.forEach((item) => {
        if (item.servicesStage?.toLowerCase().includes(element.toLowerCase())) {
          emptyArrayservice.data.push(item);
        }
      });
    });
    if (this.filtersservice.length == 0) {
      emptyArrayservice.data = this.servicesArray.data;
    }

    this.documentsArray.data = emptyArrayservice.data;
  }
  // add service from web
  onAddservice() {
    const dialogRef = this.dialog.open(CrudServiceComponent, {
      panelClass: 'custom-dialog-container',
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: { scenario: 'create' },
    });
  }
  // staus and priority filter hided with filter icon - currently not using
  filterView() {
    this.filterViewtoolbar = !this.filterViewtoolbar;
  }
  //toolbar back in web
  onBack() {
    this.location.back();
  }
  // web - route to services setails
  onservicesDetails(servicesId) {
    this.router.navigate(['dash/service/service-details/' + servicesId]);
  }
  // on destroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.serviceSubscription?.unsubscribe();
    this.commonServSubscription?.unsubscribe();
  }
  trackbyserviceList(index: number, service: Service): string {
    return service.id;
  }
  // search by term function
  filter(query: string) {
    this.filteredservice = query
      ? this.array2.data?.filter(
          (p) =>
            p.companyName?.toLowerCase().includes(query.toLowerCase()) ||
            p.serviceTitle?.toLowerCase().includes(query.toLowerCase()) ||
            p.servicesStage?.toLowerCase().includes(query.toLowerCase()) ||
            (p.firstName + ' ' + p.secondName)
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            p.assignedToName?.toLowerCase().includes(query.toLowerCase()) ||
            p.sequenceNumber.toLocaleString().includes(query.toLowerCase())
        )
      : this.array2.data;
    this.documentsArray.data = this.filteredservice;
  }
  ageCheck(stageDate: Date) {
    let input: Date = new Date(stageDate);
    let daysinStage: number = Math.ceil(
      (this.today.getTime() - input.getTime()) / (1000 * 3600 * 24)
    ); //Calculate the number of days in current stage
    if (daysinStage >= 2) {
      return true;
    } else {
      return false;
    }
  }
  // for getting the aged service
  getAgedStatus(element) {
    // if age activation is there
    if (this.actserviceAgeing) {
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
      const pipeLine = this.servicePipelines.filter(obj => {
        return obj.pipelineId === element.selectedServPipeline
      })
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
        element.servicesStage === statusArray[statusArray.length - 1].stageId ||
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
  //Function to open the popup to edit views
  editView(mode) {
    //call the popup for card field customization
    let dialogRef = this.dialog.open(ViewBuilderComponent, {
      data: [
        'services',
        this.commonListDataService.supportViewId,
        mode,
        this.cardFields,
      ],
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.response == 'Add') {
        this.commonListDataService.supportViewId =
          this.viewSettingArray.length - 1;
        this.viewSettingSelected =
          this.viewSettingArray[this.commonListDataService.supportViewId];
        this.getViewData();
        this.selection.clear(); //clear select of table
      } else {
        this.selection.clear(); //clear select of table
        this.viewSettingSelected =
          this.viewSettingArray[this.commonListDataService.supportViewId];
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
          this.viewSettingArray[this.commonListDataService.supportViewId]
            .viewName,
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res == 'deleted') {
        // if delete clicked delete the view from viewsetting array and if view number is greater than 0 then minius 1 to view number and update view
        this.viewSettingArray.splice(
          this.commonListDataService.supportViewId,
          1
        );
        if (this.commonListDataService.supportViewId > 0) {
          this.commonListDataService.supportViewId =
            this.commonListDataService.supportViewId - 1;
        }
        this.selection.clear(); //clear select of table
        this.viewServiceService
          .onSaveView(this.userId, this.viewSettingArray, 'services')
          .then((res) => {
            this.snack.open('View has been deleted', '', { duration: 2000 });
          });
      }
    });
  }
  viewChanged(viewIndex) {
    this.commonListDataService.supportViewId = viewIndex;
    this.viewSettingSelected =
      this.viewSettingArray[this.commonListDataService.supportViewId]; // particular view selected
    this.alertPopupStatus = false; // popup status set as false to open poup if next view contactins deletd add field
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
      if (this.serviceSubscription && !this.serviceSubscription.closed) {
        this.serviceSubscription.unsubscribe();
      }
      this.serviceSubscription = this.commonService
        .readPrimaryData(
          this.superUserId,
          'services',
          queryData,
          this.userIdArray
        )
        .subscribe((data) => {
          this.filteredservice = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as any;
          });

          /*if(this.userIdArray){
            this.filteredservice = this.filteredservice.filter((element) =>
            this.userIdArray.includes(element.assignedTo)
          );
          }else{
            [this.userIdArray, this.subUsers] =
            this.commonService.createUserlist(
              this.usrProfileData.serviceDataAccessRule,
              this.userId
            );
            this.filteredservice = this.filteredservice.filter((element) =>
            this.userIdArray.includes(element.assignedTo)
          );
          }*/
          //If the primary query is based on createdBy field, then apply data access rule based on createdBy
          if (queryData.queryField == 'createdBy') {
            if (
              this.usrProfileData.serviceDataAccessRule == 'Team' ||
              this.usrProfileData.serviceDataAccessRule == 'Own'
            ) {
              if (this.userIdArray) {
                this.filteredservice = this.filteredservice.filter((element) =>
                  this.userIdArray.includes(element.createdBy)
                );
              } else {
                [this.userIdArray, this.subUsers] =
                  this.commonService.createUserlist(
                    this.usrProfileData.serviceDataAccessRule,
                    this.userId
                  );
                this.filteredservice = this.filteredservice.filter((element) =>
                  this.userIdArray.includes(element.createdBy)
                );
              }
            } else if (this.usrProfileData.serviceDataAccessRule == 'Branch') {
              let branchId = this.commonService.getBranch(this.userId);
              this.filteredservice = this.filteredservice.filter(
                (element) => element.associatedBranch === branchId
              );
            }
          } else {
            if (
              this.usrProfileData.serviceDataAccessRule == 'Team' ||
              this.usrProfileData.serviceDataAccessRule == 'Own'
            ) {
              if (this.userIdArray) {
                this.filteredservice = this.filteredservice.filter((element) =>
                  this.userIdArray.includes(element.assignedTo)
                );
              } else {
                [this.userIdArray, this.subUsers] =
                  this.commonService.createUserlist(
                    this.usrProfileData.serviceDataAccessRule,
                    this.userId
                  );
                this.filteredservice = this.filteredservice.filter((element) =>
                  this.userIdArray.includes(element.assignedTo)
                );
              }
            } else if (this.usrProfileData.serviceDataAccessRule == 'Branch') {
              let branchId = this.commonService.getBranch(this.userId);
              this.filteredservice = this.filteredservice.filter(
                (element) => element.associatedBranch === branchId
              );
            }
          }
          this.filteredservice = this.commonService.sortData(
            this.filteredservice,
            this.sortField,
            this.sortOrder
          );
          // check if filter is present
          if (this.viewSettingSelected.filters.length > 0) {
            let filterData = this.viewSettingSelected.filters;
            filterData.forEach((element) => {
              let filterQuery = this.commonService.getQueryData(element);
              this.filteredservice = this.filteredservice.filter((record) =>
                this.commonService.filterData(record, filterQuery)
              );
            });
          }

          this.serviceFilter = this.filteredservice;
          this.documentsArray.data = this.filteredservice;
          this.servicesArray.data = this.filteredservice;
          this.array2.data = this.filteredservice;

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

          this.filterDataByPipelines(this.commonListDataService.selectedServicePipeline);
          this.serviceLoaded = true;
          this.progressBarStatus = true;
          this.changeDetectorRef.detectChanges();
        });
    } else {
      this.progressBarStatus = true;
    }
  }

  getNoOfRecords() {
    // get no of record based on pipeline selected
    this.noOfServiceinViewPipeline = this.serviceFilter?.length;
    if (
      this.commonListDataService.selectedServicePipeline != 'All Pipelines'
    ) {
      this.noOfServiceinViewPipeline = this.serviceFilter?.filter(
        (data) =>
          data.selectedServPipeline === this.commonListDataService.selectedServicePipeline
      ).length;
    }
  }

  //function to sort card data when sort order is changed
  setSortOrder(order) {
    this.sortOrderSet = true;
    this.sortOrder = order;
    this.serviceFilter = this.commonService.sortData(
      this.serviceFilter,
      this.sortField,
      this.sortOrder
    );
  }
  //function to sort card data when sort field is changed
  sortCardField(field) {
    this.sortCardFieldSet = true;
    if(!!field){
      this.serviceFilter = this.commonService.sortData(
        this.serviceFilter,
        field,
        this.sortOrder
      );
    }
  }
  // reset button action
  resetDate() {
    this.selection.clear(); //clear select of table
    this.secondaryFilterSet = false;
    this.agedFilterSet = false;
    this.documentsArray.data = this.filteredservice;
    this.array2.data = this.servicesArray.data;
    this.serviceFilter = this.filteredservice;
    this.statusCheck.forEach((element) => {
      element.isChecked = false;
    });

    this.documentsArray.filter = '';
    this.searchTerm = null;
    this.viewPipelineChanged();
  }
  secondaryFilter(field, value) {
    this.secondaryFilterSet = true;
    this.secondaryFilterField = field;
    this.secondaryFilterValue = value;
    let filteredData = [];
    filteredData = this.filteredservice?.filter((record) => {
      return record[field] === value;
    });
    this.serviceFilter = filteredData;
    this.documentsArray.data = filteredData;
    this.filterDataByPipelines(this.commonListDataService.selectedServicePipeline);
  }
  aged_secondaryFilter() {
    let filteredData = [];
    filteredData = this.filteredservice.filter((record) => {
      return this.getAgedStatus(record);
    });
    this.agedFilterSet = true;
    this.serviceFilter = filteredData;
    this.documentsArray.data = filteredData;
    this.filterDataByPipelines(this.commonListDataService.selectedServicePipeline);
    this.selection.clear(); //clear select of table
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
@Component({
  selector: 'child-service-list',
  templateUrl: 'child-service-list.html',
  styleUrls: ['./service-list.component.scss'],
})
export class ChildServiceList {
  spinner = false;
  reAssign = 're-assign';
  count = 0; //for reassign sale, no of sales is stored in this variable
  tasks: Task[] = [];
  followUps: FollowUps[] = [];
  rejectionReasonArr: string[] = []; //reason for rejection options stored as an array
  rejectionReasonArrPresent = true; //if reason for rerejection array is present/not
  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.
  completedStatus: string;

  constructor(
    public dialogRef: MatDialogRef<ChildServiceList>,
    @Inject(MAT_DIALOG_DATA) public data,
    private servicesService: ServiceListService,
    private snack: MatSnackBar,
    public networkCheck: NetworkCheckService
  ) {
    const rejArr = data.rejectionReasonArr?.filter((n) => n);

    if (!!rejArr && rejArr.length > 0) {
      this.rejectionReasonArr = rejArr;
      this.rejectionReasonArrPresent = true;
    } else {
      this.rejectionReasonArr[0] = 'No options are available';
      this.rejectionReasonArrPresent = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  reAssignFn() {
    this.spinner = true;
    this.completedStatus = this.data.lastStatus;

    if (this.data.checked === true) {
      // this.progressBarStatus = false;
      this.data.selected.forEach(async (element) => {
        // this.doActions(element, subUserId, assignedToName, branchId);
        // 1fetch tasks and followups
        // 2.update in sales collection
        // 3.update in tasks and followUps

        await this.getTasks(element.id, element.assignedTo);
        await this.getFollowUps(element.id, element.assignedTo);

        this.tasks.forEach((ele) => {
          if (ele.assignedTo != this.data.subUserId)
            this.servicesService.onUpdateTask(
              this.data.superUserId,
              ele.id,
              this.data.subUserId,
              this.data.assignedToName,
              this.data.branchId,
              ChangeLogComponent.saveLog(
                'ServiceListComponent',
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
            this.servicesService.onUpdateFollowUp(
              this.data.superUserId,
              ele.id,
              this.data.subUserId,
              this.data.assignedToName,
              this.data.branchId,
              ChangeLogComponent.saveLog(
                'ServiceListComponent',
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
          this.servicesService
            .onUpdateserviceSub(
              this.data.superUserId,
              this.data.subUserId,
              element.id,
              this.data.assignedToName,
              this.data.branchId,
              ChangeLogComponent.saveLog(
                'ServiceListComponent',
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
            .then((resp1) => {
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
          this.servicesService
            .onUpdateserviceSub(
              this.data.superUserId,
              this.data.subUserId,
              element.id,
              this.data.assignedToName,
              this.data.branchId,
              ChangeLogComponent.saveLog(
                'ServiceListComponent',
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
            .then((resp2) => {
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
      this.servicesService
        .getTaskswithService(this.data.superUserId, id, assignedTo,this.completedStatus)
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
      this.servicesService
        .getFollowUpsWithService(this.data.superUserId, id, assignedTo)
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
}
