/*********************************************************************************
Description: component used for displating task and filtering for web and mobile
Inputs: task details
Outputs:
***********************************************************************************/

import {
  Branch,
  contactSettings,
  customFields,
  defaultContactSettings,
  defaultSaleSettings,
  defaultServiceSettings,
  defaultTaskSettings,
  DisplayColumn,
  modules,
  Profile,
  SettingsItem,
  SubUsers,
  Task,
  taskSettings,
  taskViewSettingsDef,
  UserAccessDetails,
} from './../data-models';
import { ConfirmationpopupComponent } from './../confirmationpopup/confirmationpopup.component';
import { CrudModal1Component } from './crud-modal1/crud-modal1.component';
import { TaskboardService } from './taskboard.service';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  Inject,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NetworkCheckService } from '../networkcheck.service';
import { CommonService } from '../common.service';
import { MatTableDataSource } from '@angular/material/table';
import { endOfWeek, startOfWeek } from 'date-fns';
import { Router } from '@angular/router';
import { TaskTableColumns } from '../model/custom-report.model';
import { take } from 'rxjs/operators';
import { ViewBuilderComponent } from '../view-builder/view-builder.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CardSettingsComponent } from '../card-settings/card-settings.component';
import { ChangeLogComponent } from '../change-log/change-log.component';
import { SelectSearchComponent } from '../common-search/select-search/select-search.component';
import { StatusPopupComponent } from '../settings/status-popup/status-popup.component';
import { ViewServiceService } from '../view-builder/view-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskTableColumnsLeadPlan } from '../model/custom-report-leadManagement.model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-taskboard',
  templateUrl: './taskboard.component.html',
  styleUrls: ['./taskboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskboardComponent implements OnInit, OnDestroy {
  displayedColumnsTask: string[] = [
    'dueDate',
    'title',
    'priority',
    'status',
    'assignedToName',
    'tags',
    'actions',
  ]; //used as heading of table

  dialogRef: any;
  dateToggle: boolean = false; //to check is date selected or not
  dataSourceTask: any; //to set data to table
  taskss: Task[]; //for storing tasks list
  toggle: boolean; //to check toggle is view is done
  subUsers: any[]; //to store subusers list
  progressBarStatus: boolean = false; //to enable and disable progress bar
  userId: string; //to store user id
  currentView: string; //to store current view week,month....
  dataAccessRule: string; //to set data acess rule
  userDetailsSubscription: Subscription; //for subscribing to userdetails
  taskSubscriptionDate: Subscription; //for subscribing tasks
  taskSubscriptionWeek: Subscription; //for subscribing tasks
  superUserId: string; //for storing superuser id
  selectedDate1: any = null; //for storing first date in filter
  selectedDate2: any = null; //for storing second date in filter
  isMobilesize: boolean = false; //for checking is this mobile resolution
  searchTerm: string = null; //for search field
  filterTask: Task[]; //task used for filtering
  upcomingTask: any = []; //upcoming task array
  completedTask: any = []; //completed task array
  filterName: string = ''; //to store filtered name of users
  userFullName: string; //to store full name of user
  dueTask: any = []; //due task array
  fieldNameContact: string = 'Contact'; //setting default value for customer
  fieldNameFollowup: string = 'FollowUp'; //setting default value for followup
  fieldNameContactNotes: string = 'Note'; //setting default value for note
  fieldNameSale: string = 'Sale'; //setting default value for sale
  fieldNameTask: string = 'Task'; //setting default value for task
  fieldNameOrganization: string = 'Organization'; //def value for Org name
  fieldNameService: string = 'Support'; //def value for support name

  superUserDetails: any; //to store super user details
  selectedAssign: any; //selected assigned to user
  teamUsers: any[] = []; //store team users list
  userFirstName: string = ''; //to store username of logged in user
  userLastName: string = ''; //to store username last for logged in user
  viewChangeToggled: boolean = false; //check wether toggle bw table and grid view done
  allTaskForList: any[]; //to store all tasks in grid view
  viewFilter: string = 'upcoming';
  teamView: boolean = false;
  //for defining destroy
  private onDestroy$: Subject<void> = new Subject<void>();
  mode: any;
  filterApplied: any;
  teamUserIds: any[];

  columns = [];
  userDetails: Profile;
  userIdsArray: any[] = [];
  userNamesArray: any[] = [];
  displayColumnsSaved: DisplayColumn[] = [];
  displayName: string = 'displayTaskColumns';
  tableName: string = 'Task';
  usrDataProfiles: UserAccessDetails; // user proile access details
  tableDefaultData = TaskTableColumns;
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  saleTitleSettings: SettingsItem = defaultSaleSettings.CONST_VALUE.saleTitle;
  serviceTitleSettings: SettingsItem =
    defaultServiceSettings.CONST_VALUE.serviceTitle;
  taskSettings: taskSettings = defaultTaskSettings.CONST_VALUE;
  customFields: customFields[] = [];
  viewSettingArray: any = taskViewSettingsDef.DATA; //customer view settings array
  viewSettingSelected: any = this.viewSettingArray[0]; //particular view chosen by user
  sortField: any;
  sortOrder: any;
  userIdArray: any;
  sortFieldsTask: any = [
    {
      columnDef: 'dueDate',
      header: 'Due date',
      display: true,
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
    {
      columnDef: 'date',
      header: 'Created Date',
      display: true,
      type: 'date',
      fieldType: 'def',
      ind: 0,
    },
  ];
  displayFields: any;
  cardFields: any = [];
  allUsersId: any = [];
  userDetailsAll: any = [];
  queryData: any;
  taskSubscription: Subscription;
  userList: any;
  userName: string;

  secondaryFilterSet: boolean = false; //Field to check if secondary filter has been set or not
  secondaryFilterField: any;
  secondaryFilterValue: any;
  allSubUsers: any[] = [];
  alertPopupStatus: boolean = false; // to open the alert dialoge once
  defaultTaskstatus: any = ['Open', 'Completed']; //default value for task status
  taskStatusOptions: any; //task status otpions
  lastTaskStatusOpn: string;

  selection = new SelectionModel<Task>(true, []); //multiple selection for reassigning
  activeUsersArray: SubUsers[] = []; //to display only active subusers
  branches: Branch[] = []; //branches saved under superuser
  disableReAssign = false; //if reassign is disabled according to profile

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public commonService: CommonService,
    public dialog: MatDialog,
    private location: Location,
    public networkCheck: NetworkCheckService,
    private changeDetectorRef: ChangeDetectorRef,
    private viewServiceService: ViewServiceService
  ) {
    //getting user data from common service file
    let defaultViewset = true; // to block changinf the view if userdatas are changed
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          if (allData.userDetails?.enableLiteMode) {
            this.router.navigate(['dash/task-list']);
          } else {
            this.isMobilesize = allData.isMobileSize;
            this.superUserDetails = allData.superUserDetails;
            this.userDetails = allData.userDetails;
            if (this.superUserDetails.fieldNames) {
              //getting field name to display
              if (this.superUserDetails.fieldNames.fieldNameContact) {
                this.fieldNameContact =
                  this.superUserDetails.fieldNames.fieldNameContact;
              }
              this.fieldNameFollowup = this.superUserDetails.fieldNames
                .fieldNameFollowup
                ? this.superUserDetails.fieldNames.fieldNameFollowup
                : 'FollowUp';
              this.fieldNameContactNotes = this.superUserDetails.fieldNames
                .fieldNameContactNotes
                ? this.superUserDetails.fieldNames.fieldNameContactNotes
                : 'Note';
              if (this.superUserDetails.fieldNames.fieldNameSale) {
                this.fieldNameSale =
                  this.superUserDetails.fieldNames.fieldNameSale;
              }
              if (this.superUserDetails.fieldNames.fieldNameOrganization) {
                this.fieldNameOrganization =
                  this.superUserDetails.fieldNames.fieldNameOrganization;
              }
              if (this.superUserDetails.fieldNames.fieldNameService) {
                this.fieldNameService =
                  this.superUserDetails.fieldNames.fieldNameService;
              }
            }
            this.userId = allData.userId;
            this.userName = allData.userDetails.lastname
              ? allData.userDetails.firstname +
                ' ' +
                allData.userDetails.lastname
              : allData.userDetails.firstname;
            this.dataAccessRule = allData.usrProfileData.taskDataAccessRule;
            if (allData.usrProfileData.isCheckedTask === false) {
              this.disableReAssign = true;
            } else if (allData.usrProfileData.taskReAssign === false) {
              this.disableReAssign = true;
            }
            this.superUserId = allData.userDetails.superUserId;
            this.currentView = ' Open ' + this.fieldNameTask + 's';
            this.allSubUsers = this.commonService.createUserlist(
              'All',
              'any'
            )[1];
            // to reassign display only active users list
            this.activeUsersArray = this.allSubUsers.filter(function (e) {
              return e.status != 'suspended';
            });
            //getting all subusers
            if (allData.userDetails.taskViewSettings) {
              this.viewSettingArray = JSON.parse(
                JSON.stringify(allData.userDetails.taskViewSettings)
              ); //View setting array for customer list
              this.viewSettingSelected =
                this.viewSettingArray[this.commonService.taskViewId]; // particular view selected
            } else {
              this.viewSettingSelected =
                this.viewSettingArray[this.commonService.taskViewId]; // particular view selected
            }
            [this.allUsersId, this.userDetailsAll] =
              this.commonService.createUserlist('All', 'any'); //create list of all subusers
            [this.cardFields, this.displayFields] =
              this.commonService.getCardFields(
                'task',
                this.fieldNameContactNotes,
                this.fieldNameFollowup
              );
            //this.subUsers = allData.subUsers;
            this.dataSourceTask = new MatTableDataSource([]);
            this.userFirstName = allData.userDetails.firstname;
            this.userLastName = allData.userDetails.lastname;
            let lastName = this.userLastName ? this.userLastName : '';
            this.userFullName = this.userFirstName + ' ' + lastName;
            this.teamUsers = [];
            this.teamUserIds = [];
            this.customFields = allData.superUserDetails.customFieldsTask;
            //customisation contact field
            if (
              allData.superUserDetails.contactSettings &&
              typeof allData.superUserDetails.contactSettings !== 'undefined' &&
              allData.superUserDetails.contactSettings !== null
            ) {
              this.contactSettings = allData.superUserDetails.contactSettings;
            }

            if (
              allData.superUserDetails.saleSettings &&
              typeof allData.superUserDetails.saleSettings !== 'undefined' &&
              allData.superUserDetails.saleSettings !== null
            ) {
              this.saleTitleSettings =
                allData.superUserDetails.saleSettings.saleTitle;
            }

            if (
              allData.superUserDetails.taskSettings &&
              typeof allData.superUserDetails.taskSettings !== 'undefined' &&
              allData.superUserDetails.taskSettings !== null
            ) {
              this.taskSettings = allData.superUserDetails.taskSettings;
            }
            if (
              allData.superUserDetails.serviceSettings &&
              typeof allData.superUserDetails.serviceSettings !== 'undefined' &&
              allData.superUserDetails.serviceSettings !== null
            ) {
              this.serviceTitleSettings =
                allData.superUserDetails.serviceSettings.serviceTitle;
            }

            if (allData.userDetails.displayTaskColumns) {
              this.displayColumnsSaved = allData.userDetails.displayTaskColumns;
            }
            if (this.displayColumnsSaved.length > 0) {
              //if table settings are stored in db, use the stored data
              this.columns = this.displayColumnsSaved;
            } else {
              //if plan is leadManagement, get default table config from custom-report-leadManagement model
              if (allData.superUserDetails.plan == 'leadManagement') {
                this.columns = TaskTableColumnsLeadPlan;
                this.tableDefaultData = TaskTableColumnsLeadPlan;
              } else {
                //if plan is not leadManagement, get default table config from custom-report model
                this.columns = TaskTableColumns;
              }
            }
            //taskStatusOptions
            this.taskStatusOptions = allData.superUserDetails.taskStatusOpn
              ? allData.superUserDetails.taskStatusOpn
              : this.defaultTaskstatus;
            this.lastTaskStatusOpn =
              this.taskStatusOptions[this.taskStatusOptions.length - 1];

            this.usrDataProfiles = allData.usrProfileData;
            [this.userIdsArray, this.userNamesArray] =
              this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names

            //setting current user in array to display thuis users details too
            this.teamUsers.push({
              userId: this.userId,
              reportsToId: this.userId,
            });
            this.teamUserIds.push(this.userId);
            this.filterName = 'assigned to';
            //geting open tasks from db
            let date = new Date();
            let firstDay;
            let lastDay;
            firstDay = new Date(startOfWeek(date).getTime()); //find first day of the week
            lastDay = new Date(endOfWeek(date).getTime()); // find lastday of the week
            [this.userIdArray, this.subUsers] =
              this.commonService.createUserlist(
                this.dataAccessRule,
                this.userId
              );
            // to set the view based on the default view saved in db.
            // at the first time the block will excute also then if customerView changed in current user, any other changes in super/current user will not enter to this block
            if (
              (allData.userDetails.taskDefaultView &&
                defaultViewset &&
                this.commonService.taskView ==
                  this.commonService.taskDefaultView) ||
              (allData.userDetails.taskDefaultView &&
                allData.userDetails.taskDefaultView !=
                  this.commonService.taskDefaultView)
            ) {
              this.commonService.taskView = allData.userDetails.taskDefaultView;
              this.commonService.taskDefaultView =
                allData.userDetails.taskDefaultView;
              defaultViewset = false;
            }
            this.getViewData();
          }
        }
      }
    );
  }
  viewChanged(viewIndex) {
    this.commonService.taskViewId = viewIndex;
    this.viewSettingSelected =
      this.viewSettingArray[this.commonService.taskViewId]; // particular view selected
    this.alertPopupStatus = false; // popup status set as false to open poup if next view contactins deletd add field
    this.getViewData();
  }

  secondaryFilter(field, value) {
    this.secondaryFilterSet = true;
    this.secondaryFilterField = field;
    this.secondaryFilterValue = value;
    let filteredData = [];
    filteredData = this.taskss.filter((record) => {
      return record[field] === value;
    });
    this.dataSourceTask.data = filteredData;
    this.filterTask = filteredData;
    this.completedTask = [];
    this.upcomingTask = [];
    this.dueTask = [];
    let today = new Date();
    let date = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0,
      0,
      0
    ); //set the time to zero (12 AM) to include all records from that day

    this.completedTask = filteredData.filter(
      (el) => el.status == this.lastTaskStatusOpn
    );
    this.upcomingTask = filteredData.filter(
      (el) =>
        el.status != this.lastTaskStatusOpn &&
        new Date(el.dueDate.toDate()) >= date
    );
    this.dueTask = filteredData.filter(
      (el) =>
        el.status != this.lastTaskStatusOpn &&
        new Date(el.dueDate.toDate()) < date
    );
    this.allTaskForList = filteredData;
  }
  onShowDialog(evt: MouseEvent, scenario): void {
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
        }
        this.changeDetectorRef.detectChanges();
      });
  }

  clearFilter() {
    this.secondaryFilterSet = false;
    this.dataSourceTask.data = this.taskss;
    this.filterTask = this.taskss;
    this.completedTask = [];
    this.upcomingTask = [];
    this.dueTask = [];
    let today = new Date();
    let date = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0,
      0,
      0
    ); //set the time to zero (12 AM) to include all records from that day

    this.completedTask = this.taskss.filter(
      (el) => el.status == this.lastTaskStatusOpn
    );
    this.upcomingTask = this.taskss.filter(
      (el) =>
        el.status != this.lastTaskStatusOpn &&
        new Date(el.dueDate.toDate()) >= date
    );
    this.dueTask = this.taskss.filter(
      (el) =>
        el.status != this.lastTaskStatusOpn &&
        new Date(el.dueDate.toDate()) < date
    );
    this.allTaskForList = this.taskss;
  }

  getViewData() {
    this.progressBarStatus = false;
    // open a popup if deleted additional field is used in custom view query
    if (
      this.viewSettingSelected.primaryQuery.queryField ==
        'additionalFieldsArr' &&
      !this.customFields[this.viewSettingSelected.primaryQuery.ind].isActive
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
      !this.customFields[this.viewSettingSelected.sortField.ind].isActive
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
          !this.customFields[element.ind].isActive
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
    this.queryData = this.commonService.getQueryData(
      this.viewSettingSelected.primaryQuery
    );
    this.sortField = this.viewSettingSelected.sortField;
    this.sortOrder = this.viewSettingSelected.sortOrder;
    if (this.queryData) {
      if (this.taskSubscription && !this.taskSubscription.closed) {
        this.taskSubscription.unsubscribe();
      }
      this.taskSubscription = this.commonService
        .readPrimaryData(
          this.superUserId,
          'tasks',
          this.queryData,
          this.userIdArray
        )
        .subscribe((data) => {
          this.taskss = [];
          this.taskss = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Task;
          });

          if (this.dataAccessRule == 'Team' || this.dataAccessRule == 'Own') {
            if (this.userIdArray) {
              this.taskss = this.taskss.filter((element) =>
                this.userIdArray.includes(element.assignedTo)
              );
            } else {
              [this.userIdArray, this.userList] =
                this.commonService.createUserlist(
                  this.dataAccessRule,
                  this.userId
                );
              this.taskss = this.taskss.filter((element) =>
                this.userIdArray.includes(element.assignedTo)
              );
            }
          } else if (this.dataAccessRule == 'Branch') {
            let branchId = this.commonService.getBranch(this.userId);
            this.taskss = this.taskss.filter(
              (element) => element.associatedBranch === branchId
            );
          }

          this.taskss = this.commonService.sortData(
            this.taskss,
            this.sortField,
            this.sortOrder
          );
          // check if filter is present
          if (this.viewSettingSelected.filters.length > 0) {
            let filterData = this.viewSettingSelected.filters;
            filterData.forEach((element) => {
              let querFiled = element.queryField;
              let filterQuery = this.commonService.getQueryData(element);
              this.taskss = this.taskss.filter((record) =>
                this.commonService.filterData(record, filterQuery)
              );
            });
          }
          this.dataSourceTask.data = this.taskss;
          this.filterTask = this.taskss;
          this.completedTask = [];
          this.upcomingTask = [];
          this.dueTask = [];
          //filtering task for grid view
          let today = new Date();
          let date = new Date(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate(),
            0,
            0,
            0
          ); //set the time to zero (12 AM) to include all records from that day

          this.completedTask = this.taskss.filter(
            (el) => el.status == this.lastTaskStatusOpn
          );
          this.upcomingTask = this.taskss.filter(
            (el) =>
              el.status != this.lastTaskStatusOpn &&
              new Date(el.dueDate.toDate()) >= date
          );
          this.dueTask = this.taskss.filter(
            (el) =>
              el.status != this.lastTaskStatusOpn &&
              new Date(el.dueDate.toDate()) < date
          );
          this.allTaskForList = this.taskss;
          if (this.secondaryFilterSet == true) {
            this.secondaryFilter(
              this.secondaryFilterField,
              this.secondaryFilterValue
            );
          }
          this.progressBarStatus = true;
          this.changeDetectorRef.detectChanges();
        });
    } else {
      this.progressBarStatus = true;
    }
  }
  //triggered while changing view by grid and table
  onToggleTab(view) {
    this.commonService.taskView = view;
  }

  //triggered while giving input to search field
  filter(query: string) {
    //search for table view
    this.taskss = query
      ? this.filterTask.filter(
          (p) =>
            p.company?.toLowerCase().includes(query.toLowerCase()) ||
            p.status?.toLowerCase().includes(query.toLowerCase()) ||
            p.priority?.toLowerCase().includes(query.toLowerCase()) ||
            p.name?.toLowerCase().includes(query.toLowerCase()) ||
            p.lastName?.toLowerCase().includes(query.toLowerCase()) ||
            p.assignedToName?.toLowerCase().includes(query.toLowerCase()) ||
            (p.name + ' ' + p.lastName)
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            p.saleTitle?.toLowerCase().includes(query.toLowerCase()) ||
            p.title?.toLowerCase().includes(query.toLowerCase())
        )
      : this.filterTask;
    this.dataSourceTask.data = this.taskss;

    //search for list unless we dont have complted task in first search
    let listSearch = query
      ? this.allTaskForList.filter(
          (p) =>
            p.company?.toLowerCase().includes(query.toLowerCase()) ||
            p.status?.toLowerCase().includes(query.toLowerCase()) ||
            p.priority?.toLowerCase().includes(query.toLowerCase()) ||
            p.name?.toLowerCase().includes(query.toLowerCase()) ||
            p.assignedToName?.toLowerCase().includes(query.toLowerCase()) ||
            p.lastName?.toLowerCase().includes(query.toLowerCase()) ||
            p.assignedToName?.toLowerCase().includes(query.toLowerCase()) ||
            (p.name + ' ' + p.lastName)
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            p.saleTitle?.toLowerCase().includes(query.toLowerCase()) ||
            p.title?.toLowerCase().includes(query.toLowerCase())
        )
      : this.allTaskForList;
    let today = new Date();
    let date = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0,
      0,
      0
    ); //set the time to zero (12 AM) to include all records from that day
    this.completedTask = [];
    this.upcomingTask = [];
    this.dueTask = [];
    this.completedTask = listSearch.filter(
      (el) => el.status == this.lastTaskStatusOpn
    );
    this.upcomingTask = listSearch.filter(
      (el) =>
        el.status != this.lastTaskStatusOpn &&
        new Date(el.dueDate.toDate()) >= date
    );
    this.dueTask = listSearch.filter(
      (el) =>
        el.status != this.lastTaskStatusOpn &&
        new Date(el.dueDate.toDate()) < date
    );
  }
  //triggered while adding a task
  addTask() {
    this.selectedAssign = '';
    this.dialog.open(CrudModal1Component, {
      width: '520px',
      height: 'auto',
      disableClose: true,
      data: {
        id: '',
        mode: 'create',
      },
    });
  }

  //Function to open the popup to edit views
  editView(mode) {
    //call the popup for card field customization
    this.dialogRef = this.dialog.open(ViewBuilderComponent, {
      data: ['tasks', this.commonService.taskViewId, mode, this.sortFieldsTask],
      width: 'auto',
    });
    // Subscribe when the dialog box closes
    this.dialogRef.afterClosed().subscribe((res) => {
      // Receive data from dialog component
      // If new view has been added, then read the new view and load data
      if (res.response == 'Add') {
        this.commonService.taskViewId = this.viewSettingArray.length - 1;
        this.viewSettingSelected =
          this.viewSettingArray[this.commonService.taskViewId];
        this.getViewData();
      } else {
        this.viewSettingSelected =
          this.viewSettingArray[this.commonService.taskViewId];
      }
    });
  }
  //triggered while deleting a task
  deleteid(id: string) {
    this.dialog.open(ConfirmationpopupComponent, {
      data: {
        taskId: id,
        smode: 'taskdelete',
        superId: this.superUserId,
      },
    });
  }
  //triggered while click on mark as complete button to compete a task
  updatestatus(id: string, status, changeLog) {
    this.dialog.open(ConfirmationpopupComponent, {
      data: {
        taskId: id,
        smode: 'taskcompleted',
        superId: this.superUserId,
        changeLog: changeLog,
        currentStatus: status,
        lastStatus: this.lastTaskStatusOpn,
        constructorName: this.constructor.name,
      },
    });
  }
  //triggered while updating task
  updateid(task, taskid: string) {
    this.commonService.updateTaskToEdit(task);
    this.dialog.open(CrudModal1Component, {
      width: '1060px',
      height: 'auto',
      disableClose: true,
      data: {
        id: taskid,
        mode: 'update',
      },
    });
  }

  customizeCardContent(module) {
    //call the popup for card field customization
    this.dialogRef = this.dialog.open(CardSettingsComponent, {
      data: ['task', this.cardFields],
      width: '600px',
    });
  }
  //funtion to  go back to previous page
  onBack() {
    this.location.back();
  }

  ngOnInit(): void {}

  // fn to re assign selected tasks
  onSubUserAssigned(selected, subUserId, firstName, secondName, branchId) {
    let assignedToName = secondName ? firstName + ' ' + secondName : firstName;
    const dialogRef = this.dialog.open(ChildTaskboard, {
      width: '500px',
      minHeight: '100px',
      disableClose: true,
      data: {
        scenario: 'reAssign',
        fieldNameTask: this.fieldNameTask,
        assignedToName: assignedToName,
        selected,
        subUserId,
        branchId,
        superUserId: this.superUserId,
        branches: this.branches,
        userId: this.userId,
        userName: this.userName,
        lastStatus: this.lastTaskStatusOpn,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((data) => {
        this.selection.clear(); //clear select of table
      });
  }

  getFieldValueSort(field, data) {
    return this.commonService.getFieldValueSort(field, data);
  }
  getFieldValue(field, data) {
    return this.commonService.getFieldValue(field, data, modules.tasks);
  }

  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    //unsubscribing subscription
    this.onDestroy$.next();
    this.userDetailsSubscription?.unsubscribe();
    this.taskSubscriptionWeek?.unsubscribe();
    this.taskSubscriptionDate?.unsubscribe();
    this.taskSubscription?.unsubscribe();
  }

  onViewOrg(orgId: string) {
    let link: string = 'dash/organisation/orgdetails/' + orgId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }

  // go to customer details page
  onViewCustomer(customerId: string) {
    let link: string = 'dash/contact/customerdetails/' + customerId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }

  onViewSale(saleId: string) {
    let link: string = 'dash/sales/saleview/' + saleId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }

  onViewSupport(supportId: string) {
    let link: string = 'dash/service/service-details/' + supportId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }

  createGroupigArrayAssignedTo() {
    let groupingArrayValues = [];
    let groupingArrayNames = [];

    //function to create grouping array for assigned to based on the data access rule
    if (this.usrDataProfiles.dialogdataAccessRule == 'All') {
      if (this.subUsers) {
        // create array of subuser ids and names
        this.subUsers.forEach((elem) => {
          groupingArrayValues.push(elem.userId);
          groupingArrayNames.push(
            elem.firstname + ' ' + (elem.lastname ? elem.lastname : '')
          );
        });
        //add the super user data to the arrays
        groupingArrayValues.push(this.superUserId);
        groupingArrayNames.push(
          this.superUserDetails.firstname +
            ' ' +
            (this.superUserDetails.lastname
              ? this.superUserDetails.lastname
              : '')
        );
      }
    } else if (this.usrDataProfiles.dialogdataAccessRule == 'Team') {
      if (this.subUsers) {
        // assign subusers
        for (let i = 0; i < this.subUsers.length; i++) {
          if (this.subUsers[i].reportsToId === this.userId) {
            groupingArrayValues.push(this.subUsers[i].userId);
            groupingArrayNames.push(
              this.subUsers[i].firstname +
                ' ' +
                (this.subUsers[i].lastname ? this.subUsers[i].lastname : '')
            );
          }
        }
        //Add the details of the current user to the list
        groupingArrayValues.push(this.userId);
        groupingArrayNames.push(
          this.userDetails.firstname +
            ' ' +
            (this.userDetails.lastname ? this.userDetails.lastname : '')
        );
      }
    } else {
      //If data access rule is own, then only get the current user details
      groupingArrayValues = [this.userId];
      groupingArrayNames = [
        this.userDetails.firstname +
          ' ' +
          (this.userDetails.lastname ? this.userDetails.lastname : ''),
      ];
    }
    return [groupingArrayValues, groupingArrayNames];
  }
  //delete view
  deleteView() {
    let dialogref = this.dialog.open(ConfirmationpopupComponent, {
      width: '400px',
      data: {
        smode: 'delete_view',
        viewName: this.viewSettingArray[this.commonService.taskViewId].viewName,
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res == 'deleted') {
        // if delete clicked delete the view from viewsetting array and if view number is greater than 0 then minius 1 to view number and update view
        this.viewSettingArray.splice(this.commonService.taskViewId, 1);
        if (this.commonService.taskViewId > 0) {
          this.commonService.taskViewId = this.commonService.taskViewId - 1;
        }
        this.viewServiceService
          .onSaveView(this.userId, this.viewSettingArray, 'tasks')
          .then((res) => {
            this.snackBar.open('View has been deleted', '', { duration: 2000 });
          });
      }
    });
  }
}
@Component({
  selector: 'child-taskboard',
  templateUrl: 'child-taskboard.html',
  styleUrls: ['./taskboard.component.scss'],
})
export class ChildTaskboard {
  scenario = 'reAssign'; //scenario of child component called
  spinner = false; //spinner to show while reassigning
  count = 0; //for reassign, no is stored in this variable

  constructor(
    public dialogRef: MatDialogRef<ChildTaskboard>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snack: MatSnackBar,
    private serviceInst: TaskboardService
  ) {}

  // cancel fn
  onNoClick(): void {
    this.dialogRef.close();
  }
  // reassign fn
  reAssignFn() {
    this.spinner = true;
    this.data.selected.forEach((ele) => {
      this.serviceInst
        .onUpdateTask(
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
        )
        .then((resp) => {
          this.count++;
          if (this.count == this.data.selected.length) {
            this.dialogRef.close();

            // mat snack bar
            this.snack.open('Re-assigning completed', '', {
              duration: 2000,
            });
          }
        });
    }); //update in task collection
  }
}
