/*********************************************************
 * Description : Task lite mode component with grid view and table view, it comtaines grid view and table as child component
 *
 * ************************************************************************* */
import { ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { Branch, DisplayColumn, SettingsItem, SubUsers, Task, contactSettings, defaultContactSettings, defaultSaleSettings, defaultServiceSettings, defaultTaskSettings, taskSettings, } from 'src/app/data-models';
import { TaskTableColumnsLeadPlan } from 'src/app/model/custom-report-leadManagement.model';
import { TaskTableColumns } from 'src/app/model/custom-report.model';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { TaskTableService } from './task-table.service';
import { CrudModal1Component } from 'src/app/taskboard/crud-modal1/crud-modal1.component';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { take } from 'rxjs/operators';
import { TaskTableViewComponent } from '../task-table-view/task-table-view.component';
import { TaskGridViewComponent } from '../task-grid-view/task-grid-view.component';
import { CardSettingsComponent } from 'src/app/card-settings/card-settings.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ChildTaskboard } from 'src/app/taskboard/taskboard.component';
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {

  @ViewChild(TaskTableViewComponent) tableChild!: TaskTableViewComponent; // table view child component
  @ViewChildren(TaskGridViewComponent) childComponents: QueryList<TaskGridViewComponent>; // grid view child components

  taskTypes = ['Upcoming', 'OverDue', 'Completed'];// grid view component names
  reloadChildComponent: boolean = false; // for showing the grid view
  commonServiceUserSubscription: Subscription;// used for unsubscribe user subscription
  userId: string; // current user id
  superUserId: string;// super user id
  columnsDispaly = []; // table columns configuration
  taskSettings: taskSettings = defaultTaskSettings.CONST_VALUE;// custoer settigs configuration
  tableDefaultData = TaskTableColumns;// table columns configuration . used for adding new field which is added on modal
  userIdsArray: any[] = [];// users id
  userNamesArray: any[] = [];// users names
  customFieldTask: any[]; // contact additional fields
  isLoading: boolean = true;// for displaying spinner while data is loading
  networkConnection: boolean; //to check network connection
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;// customer settigs configuration
  saleTitleSettings: SettingsItem = defaultSaleSettings.CONST_VALUE.saleTitle;// sale settigs configuration
  serviceTitleSettings: SettingsItem = defaultServiceSettings.CONST_VALUE.serviceTitle;// service settigs configuration
  statusOption: any[] = []; // status option
  lastTaskStatusOpn: string; // last status
  displayFields: any; // display card fields
  cardFields: any = []; // card fields
  selection = new SelectionModel<Task>(true, []); // table selection

  // custom field names
  fieldNameContact: string = 'Contact';
  fieldNameSale: string = 'Sale';
  fieldNameService: string = 'Support';
  fieldNameTask: string = 'Task';
  fieldNameOrganization: string = 'Organization';
  fieldNameFollowup: string = 'FollowUp';//setting default value for followup
  fieldNameContactNotes: string = 'Note'; //setting default value for note
  disableReAssign = false; //reassign option disable /enable according to profile
  branches: Branch[] = []; //branches saved under superuser
  allSubUsers: SubUsers[] = []; //subusers + superuser array to show optionss for reassigning
  userName = ''; //user name of logged in person

  constructor(public commonService: CommonService, public tableService: TaskTableService,
    public chageDetection: ChangeDetectorRef,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private router: Router,
    public networkCheck: NetworkCheckService) {
    //initialize array
    this.tableService.taskList = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.commonServiceUserSubscription = this.commonService.userDatas.pipe(take(1)).subscribe(
      (allData) => {
        if (!allData.userDetails.enableLiteMode) {
          this.router.navigate(['dash/tasks']);
        }
        else {
          if (this.commonService.userPlan.activitiesAccess && this.commonService.userPlan.tasksAccess) {
            this.userId = allData.userId;
            this.superUserId = allData.userDetails.superUserId;
            this.userName = allData.userDetails.lastname ?
            allData.userDetails.firstname + ' ' + allData.userDetails.lastname :
            allData.userDetails.firstname;
            this.statusOption = allData.superUserDetails.taskStatusOpn
              ? allData.superUserDetails.taskStatusOpn
              : ['Open', 'Completed'];
            this.lastTaskStatusOpn = this.statusOption[this.statusOption.length - 1];

            //get task setting configuration
            if (
              allData.superUserDetails.taskSettings &&
              typeof allData.superUserDetails.taskSettings !== 'undefined' &&
              allData.superUserDetails.taskSettings !== null
            ) {
              this.taskSettings = allData.superUserDetails.taskSettings;
            }
            // disable reassign according to profile settings
            if(allData.usrProfileData.isCheckedTask === false){
              this.disableReAssign = true
            }else if(allData.usrProfileData.taskReAssign === false){
              this.disableReAssign = true;
            }
            // branches and subusers assigning
            this.branches = allData.branches;
            const allSubUsers = this.commonService.createUserlist(
              'All',
              'any'
            )[1];
            this.allSubUsers = allSubUsers.filter(function (e) {
              return e.status != 'suspended';
            });
            //get customer setting configuration
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
              this.saleTitleSettings = allData.superUserDetails.saleSettings.saleTitle;
            }
            if (
              allData.superUserDetails.serviceSettings &&
              typeof allData.superUserDetails.serviceSettings !== 'undefined' &&
              allData.superUserDetails.serviceSettings !== null
            ) {
              this.serviceTitleSettings = allData.superUserDetails.serviceSettings.serviceTitle;
            }
            if ((allData.userDetails.taskDefaultView
              && this.commonService.taskView == this.commonService.taskDefaultView)
              || (allData.userDetails.taskDefaultView && allData.userDetails.taskDefaultView != this.commonService.taskDefaultView)) {

              this.commonService.taskView = allData.userDetails.taskDefaultView;
              this.commonService.taskDefaultView = allData.userDetails.taskDefaultView;
            }
            if (this.commonService.taskView == 'grid') {
              this.reloadChildComponent = true; // if sale view selected is grid, show grid view
            }

            // get field name
            if (allData.superUserDetails.fieldNames) {
              this.fieldNameContact =
                allData.superUserDetails.fieldNames.fieldNameContact;
              this.fieldNameSale = allData.superUserDetails.fieldNames.fieldNameSale;
              this.fieldNameService =
                allData.superUserDetails.fieldNames.fieldNameService;
              this.fieldNameTask =
                allData.superUserDetails.fieldNames.fieldNameTask;
              if (allData.superUserDetails.fieldNames.fieldNameOrganization) {
                this.fieldNameOrganization = allData.superUserDetails.fieldNames.fieldNameOrganization;
              }
              this.fieldNameFollowup = allData.superUserDetails.fieldNames.fieldNameFollowup ? allData.superUserDetails.fieldNames.fieldNameFollowup : 'FollowUp';
              this.fieldNameContactNotes =
                allData.superUserDetails.fieldNames.fieldNameContactNotes ? allData.superUserDetails.fieldNames.fieldNameContactNotes : 'Note';
            }
            [this.cardFields, this.displayFields] = this.commonService.getCardFields('task', this.fieldNameContactNotes, this.fieldNameFollowup)

            this.customFieldTask = allData.superUserDetails.customFieldsTask;
            let displayColumnsSaved: DisplayColumn[] = [];
            if (allData.userDetails.displayTaskColumns) {
              displayColumnsSaved = allData.userDetails.displayTaskColumns;
            }
            if (displayColumnsSaved.length > 0) {
              //if table settings are stored in db, use the stored data
              this.columnsDispaly = allData.userDetails.displayTaskColumns;
              // remove select column if settings already saved in DB
              var ind = this.columnsDispaly.findIndex(
                (p) => p.columnDef == 'select'
              );
              if (ind > -1) {
                this.columnsDispaly.splice(ind, 1);
              }
            } else {
              //if plan is invoicing, get default table config from custom-report-invoicing model
              if (allData.superUserDetails.plan == 'leadManagement') {
                //if plan is leadManagement, get default table config from custom-report-leadManagement model
                this.columnsDispaly = TaskTableColumnsLeadPlan;
                this.tableDefaultData = TaskTableColumnsLeadPlan;
              } else {
                //if plan is not invoicing or leadManagement, get default table config from custom-report model
                this.columnsDispaly = TaskTableColumns;
              }
            }
            [this.userIdsArray, this.userNamesArray] =
              this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names


            // get first set of data based on the page size and page index.
            if (this.tableService.secondViewSelected == "Open task") {
              this.tableService.viewSelected = this.tableService.firstViewSelected + '/ ' + "Open " + this.fieldNameTask;// for displaying viewname in toolbar
            } else if (this.tableService.secondViewSelected == "Completed task") {
              this.tableService.viewSelected = this.tableService.firstViewSelected + '/ ' + "Completed " + this.fieldNameTask;// for displaying viewname in toolbar
            }
             else if (this.tableService.secondViewSelected == "Due today") {
              this.tableService.viewSelected = this.tableService.firstViewSelected + '/ ' + "Due today";// for displaying viewname in toolbar
            }

            this.isLoading = false
          } else {
            this.isLoading = false;
          }
        }
      })
  }


  // if view is changed
  viewSelected(viewName, firstViewName) {
    this.isLoading = true;// show spinner
    this.tableService.taskList.data = [];// clear data
    this.tableService.firstViewSelected = firstViewName;//  asisgn first view name
    this.tableService.secondViewSelected = viewName; // asisgn second view name
    if (viewName == "Open task") {
      this.tableService.viewSelected = this.tableService.firstViewSelected + '/ ' + "Open " + this.fieldNameTask;// for displaying viewname in toolbar
    } else if (viewName == "Completed task") {
      this.tableService.viewSelected = this.tableService.firstViewSelected + '/ ' + "Completed " + this.fieldNameTask;// for displaying viewname in toolbar
    }else if (viewName == "Due today") {
      this.tableService.viewSelected = this.tableService.firstViewSelected + '/ ' + "Due today";// for displaying viewname in toolbar
    }

    if (this.commonService.taskView == 'grid') {
      this.reloadGridViewChildComponent();
    }
    // reset data saved in service
    this.reloadTableComponent();
    this.isLoading = false;// show spinner
  }
  // reload grid view
  reloadGridViewChildComponent() {
    this.isLoading = true;
    this.reloadChildComponent = false
    this.childComponents.forEach(child => {
      child.displayedData.next([])
      child.initializeData();
    });
    this.reloadChildComponent = true;
    this.isLoading = false;
  }
  // reload table view
  reloadTableComponent() {
    this.tableService.taskList.data = []; // clear data
    this.tableChild.isLoading = true;
    this.tableChild.resetQueryAndTableData();
    this.isLoading = false;
  }
  ngAfterViewInit() {
    this.chageDetection.detectChanges();
  }
  ngOnDestroy(): void {
    this.tableService.taskList.data = [];
    // unsubscribe all subscription
    this.commonServiceUserSubscription?.unsubscribe();
  }
  // edit task
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
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if (result) {
        if (this.commonService.taskView == 'grid') {
          // if  edited all column should refresh
          this.reloadGridViewChildComponent();

        }
      }

    });
  }

  // network check
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }

  deleteTask(data: { index: number, id: string }) {
    const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
      data: {
        taskId: data.id, smode: "taskdelete", superId: this.superUserId
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if (result == 'deleted') {
        if (this.commonService.taskView == 'grid') {
          const specificChild = this.childComponents.find(child => child.index === data.index);

          specificChild.loading = true;
          // one column should refresh , based on the index passed from child
          if (specificChild) {
            specificChild.displayedData.next([])
            specificChild.initializeData();
          }

        }
      }

    });
  }
  //triggered while click on mark as complete button to compete a task
  updatestatus(task) {
    const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
      data: {
        taskId: task.id, smode: "taskcompleted", superId: this.superUserId,
        changeLog: task.changeLog,
        currentStatus: task.status ? task.status : '',
        lastStatus: this.lastTaskStatusOpn,
        constructorName: this.constructor.name
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if (result == 'completed') {
        if (this.commonService.taskView == 'grid') {
          // if  edited all column should refresh
          this.reloadGridViewChildComponent();
        }
      }

    });
  }
  // to toggle between list and table view, to select list
  onToggle() {
    this.commonService.taskView = 'grid';
    // all should refresh while toggle
    this.reloadGridViewChildComponent();
  }
  // to toggle between list and table view, to select table
  onToggleTab() {
    this.commonService.taskView = 'table';
  }
  customizeCardContent() {
    //call the popup for card field customization
    const dialogRef = this.dialog.open(CardSettingsComponent, {
      data: ['task', this.cardFields],
      width: '600px',
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((data) => {
      if (data) {
        [this.cardFields, this.displayFields] = this.commonService.getCardFields('task', this.fieldNameContactNotes, this.fieldNameFollowup)

      }
    })
  }
    // fn to re assign selected tasks
    onSubUserAssigned(selected, subUserId, firstName, secondName, branchId){
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
          lastStatus: this.lastTaskStatusOpn
        },
      });
      dialogRef.afterClosed().pipe(take(1)).subscribe(data=>{
        this.selection.clear(); //clear select of table
      })
    }
}

