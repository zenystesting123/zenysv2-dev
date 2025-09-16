/**********************************************************************************
Description: Component is used as a parent component for followup grid and table view in lite mode
             Only for Web
Inputs: userdatas from common service, followups fetch from DB
Outputs:
**********************************************************************************/
import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import { GridContainerService } from './grid-container.service';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { MatDialog } from '@angular/material/dialog';
import { CardSettingsComponent } from 'src/app/card-settings/card-settings.component';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FollowupTaskCreateComponent } from 'src/app/followup-task-create/followup-task-create.component';
import { Router } from '@angular/router';
import { FollowupListComponent } from '../followup-list/followup-list.component';
import { FollowupTableComponent } from '../followup-table/followup-table.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Branch, FollowUps, SubUsers } from 'src/app/data-models';
import { ChildFollowUpList } from 'src/app/follow-up-list-material/follow-up-list-material.component';

@Component({
  selector: 'app-grid-container',
  templateUrl: './grid-container.component.html',
  styleUrls: ['./grid-container.component.scss'],
})
export class GridContainerComponent implements OnInit {
  @ViewChild(FollowupTableComponent) tableChild!: FollowupTableComponent; // table view child component
  @ViewChildren(FollowupListComponent) //grid view children
  childComponents: QueryList<FollowupListComponent>; // grid view child components
  reloadChildComponent: boolean = false; // for showing the grid view
  followupTypes = ['Upcoming', 'OverDue', 'Completed']; //3 child components in followup grid view
  superUserId = ''; //logged in users superuser id
  userId = ''; //logged in users id

  //customised fieldnames
  fieldNameFollowup = 'FollowUp';
  fieldNameOrganization = 'Organization';
  fieldNameCustomer = 'Contact';
  fieldNameSale = 'Sale';
  fieldNameService = 'Support';
  fieldNameContactNotes = 'Notes';

  // to customise and display content of grid view card
  cardFields: any;
  displayFields: any;

  //logged in users name and contact number
  userName = '';
  userNumber = '';

  // variables to make call
  enableOutboundCallsViaCallBridging = false;
  outboundCallBridgingType = '';
  callBridgingServiceProvider = '';
  DIDNumber;
  autoCallToken;
  callBridgingExtension;

  subUsers; // pass sub user list
  allSubUsers: SubUsers[] = []; //subusers to show in reassigning options
  branches: Branch[] = []; //branches under superuser
  superUserFirstName; // pass super user first name
  superUserSecondName; // pass super user second name
  userIdArray: any; //super users nd subusers id array

  //disable create/edit/view of followups based on profiles
  disableCreateFollowUp: boolean = false;
  disableFollEdit = false;
  disableFollowUp = false;
  disableReAssign = false;
  isLoading = true; //spinner to show while data is fetching and displaying
  selection = new SelectionModel<FollowUps>(true, []); // table selection

  constructor(
    public commonService: CommonService,
    private gridContainerService: GridContainerService,
    public networkCheck: NetworkCheckService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.commonService.userDatas.pipe(take(1)).subscribe((allData) => {
      if (allData) {
        // if lite mode is not enabled, route to normal component
        if (!allData.userDetails.enableLiteMode) {
          this.router.navigate(['dash/followuplist']);
          // if lite mode is on, check for plan wise access
        } else if (
          this.commonService.userPlan.activitiesAccess &&
          this.commonService.userPlan.followupsAccess
        ) {
          // if plan wise access permits
          this.superUserId = allData.userDetails.superUserId;
          this.userName =
            allData.userDetails.firstname +
            ' ' +
            (allData.userDetails.lastname ? allData.userDetails.lastname : '');
          this.userId = allData.userId;
          this.userNumber = allData.userDetails.phone;

          if (allData.superUserDetails.enableOutboundCallsViaCallBridging) {
            this.enableOutboundCallsViaCallBridging =
              allData.superUserDetails.enableOutboundCallsViaCallBridging;
          }
          if (allData.superUserDetails.DIDNumber) {
            this.DIDNumber = allData.superUserDetails.DIDNumber;
          }
          if (allData.superUserDetails.outboundCallType) {
            this.outboundCallBridgingType =
              allData.superUserDetails.outboundCallType;
          }
          if (allData.superUserDetails.callBridgingServiceProvider) {
            this.callBridgingServiceProvider =
              allData.superUserDetails.callBridgingServiceProvider;
          }
          if (this.superUserId === this.userId) {
            if (allData.superUserDetails.extensionNumber) {
              this.callBridgingExtension = allData.superUserDetails
                .extensionNumber
                ? allData.superUserDetails.extensionNumber
                : '';
            }
          } else {
            const userObject = allData.subUsers.find(
              (user) => user.userId === this.userId
            );
            this.callBridgingExtension = userObject
              ? userObject.extensionNumber
              : null;
          }
          [this.userIdArray, this.subUsers] = this.commonService.createUserlist(
            allData.usrProfileData.followUpDataAccessRule,
            this.userId
          );
          const allSubUsers = this.commonService.createUserlist(
            'All',
            'any'
          )[1];
          this.allSubUsers = allSubUsers.filter(function (e) {
            return e.status != 'suspended';
          });
          //setting current user in array to display thuis users details too
          this.superUserFirstName = allData.superUserDetails.firstname; // bind super user first name for passing followup edit popup
          this.superUserSecondName = allData.superUserDetails.lastname; // bind super user first name for passing followup edit popup
          this.branches = allData.branches;
          // check if user profile data exists
          if (allData.usrProfileData.isCheckedFoll == false) {
            // check followup edit and view accecess if false
            this.disableFollowUp = true; // disable followup view
            this.disableFollEdit = true; // disable followup edit
            this.disableCreateFollowUp = true; // disable create followup
            this.disableReAssign = true;
          } else {
            if (allData.usrProfileData.follView == false) {
              this.disableFollowUp = true; // disable followup view
            }
            if (allData.usrProfileData.follEdit == false) {
              this.disableFollEdit = true; // disable followup edit
            }
            if (allData.usrProfileData.follCreate == false) {
              this.disableCreateFollowUp = true;
            }
            if(allData.usrProfileData.followUpReAssign === false){
              this.disableReAssign = true
            }
          }

          // custm field name
          if (allData.superUserDetails.fieldNames) {
            this.fieldNameFollowup =
              allData.superUserDetails.fieldNames.fieldNameFollowup; // get feild name of followup from super user
            if (allData.superUserDetails.fieldNames.fieldNameOrganization) {
              this.fieldNameOrganization =
                allData.superUserDetails.fieldNames.fieldNameOrganization;
            }
            if (allData.superUserDetails.fieldNames.fieldNameCustomer) {
              this.fieldNameCustomer =
                allData.superUserDetails.fieldNames.fieldNameCustomer;
            }
            if (allData.superUserDetails.fieldNames.fieldNameSale) {
              this.fieldNameSale =
                allData.superUserDetails.fieldNames.fieldNameSale;
            }
            this.fieldNameContactNotes = allData.superUserDetails.fieldNames
              .fieldNameContactNotes
              ? allData.superUserDetails.fieldNames.fieldNameContactNotes
              : 'Note';
          }
          if (allData.superUserDetails.fieldNames.fieldNameSuport) {
            this.fieldNameService =
              allData.superUserDetails.fieldNames.fieldNameSuport;
          }

          [this.cardFields, this.displayFields] =
            this.commonService.getCardFields(
              'followup',
              this.fieldNameContactNotes,
              this.fieldNameFollowup
            );

          if (
            (allData.userDetails.followUpDefaultView &&
              this.commonService.followUpView ==
                this.commonService.followUpDefaultView) ||
            (allData.userDetails.followUpDefaultView &&
              allData.userDetails.followUpDefaultView !=
                this.commonService.followUpDefaultView)
          ) {
            this.commonService.followUpView =
              allData.userDetails.followUpDefaultView;
            this.commonService.followUpDefaultView =
              allData.userDetails.followUpDefaultView;
          }
          if (this.commonService.followUpView == 'grid') {
            this.reloadChildComponent = true; // if sale view selected is grid, show grid view
          }
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      }
    });
  }

  // reload grid view
  reloadGridViewChildComponent() {
    this.isLoading = true;
    this.reloadChildComponent = false;
    this.childComponents.forEach((child) => {
      child.displayedData.next([]);
      child.initializeData();
    });
    this.reloadChildComponent = true;
    this.isLoading = false;
  }
  // if view is changed
  viewSelected(viewName, firstViewName) {
    this.isLoading = true;
    this.gridContainerService.firstViewSelected = firstViewName; //  asisgn first view name
    this.gridContainerService.secondViewSelected = viewName; // asisgn second view name
    if (viewName == 'Todays call') {
      this.gridContainerService.viewSelected =
        this.gridContainerService.firstViewSelected +
        '/ ' +
        "Today's " +
        this.fieldNameFollowup; // for displaying viewname in toolbar
    } else if (viewName == 'This weeks call') {
      this.gridContainerService.viewSelected =
        this.gridContainerService.firstViewSelected +
        '/ ' +
        'This weeks ' +
        this.fieldNameFollowup; // for displaying viewname in toolbar
    } else if (viewName == 'Overdue call') {
      this.gridContainerService.viewSelected =
        this.gridContainerService.firstViewSelected +
        '/ ' +
        'Overdue ' +
        this.fieldNameFollowup; // for displaying viewname in toolbar
    }
    if (this.commonService.followUpView == 'grid') {
      // if  edited all column should refresh
      this.reloadGridViewChildComponent();
    }
    // reset data saved in service
    this.reloadTableComponent();

    this.isLoading = false; // show spinner
  }
  // reload table view
  reloadTableComponent() {
    this.gridContainerService.followupList.data = []; // clear data
    this.tableChild.isLoading = true;
    this.tableChild.resetQueryAndTableData();
    this.isLoading = false;
  }
  // customize card function
  customizeCardContent() {
    //call the popup for card field customization
    let dialogRef = this.dialog.open(CardSettingsComponent, {
      data: ['followup', this.cardFields],
      width: '600px',
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((data) => {
        if (data) {
          [this.cardFields, this.displayFields] =
            this.commonService.getCardFields(
              'followup',
              this.fieldNameContactNotes,
              this.fieldNameFollowup
            );
        }
      });
  }

  // toggle to table view fn
  onToggleToTable() {
    this.commonService.followUpView = 'table';
  }

  // toggle to grid view function
  onToggleGridView() {
    this.commonService.followUpView = 'grid';
    this.reloadGridViewChildComponent();
  }

  // if any followup task is closed
  markasCompleted(data) {
    // update followup completed status as true
    let completed = true;
    let newChangeLog = ChangeLogComponent.saveLog(
      this.constructor.name,
      this.userId,
      this.userName,
      { completedStatus: false },
      { completedStatus: true },
      data.changeLog
    );
    this.gridContainerService
      .UpdateFollowupTaskAsCompleted(
        data.id,
        completed,
        this.superUserId,
        newChangeLog
      )
      .then((resp) => {
        if (this.commonService.followUpView == 'grid') {
          // if  edited all column should refresh
          this.reloadGridViewChildComponent();
        }
        this._snackBar.open(this.fieldNameFollowup + ' task closed', '', {
          duration: 2000,
        });
      });
  }

  // followup edit fn
  onEditFollowUps(followUpData) {
    this.commonService.followUpDetails = followUpData;
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: followUpData.customerId, // pass customer id
        companyNames: followUpData.companyName, // pass company name
        customerNames: followUpData.customerName, // pass customer name
        contactNumber: followUpData.contactNumber
          ? followUpData.contactNumber
          : '', // pass customer number
        countryCode: followUpData.countryCode ? followUpData.countryCode : '', // pass customer country code
        scenario: 'edit', // scenario for followup popup
        followUpId: followUpData.id, // pass task id
        subUsers: this.subUsers, // pass sub user list
        fname: this.superUserFirstName, // pass super user first name
        lastname: this.superUserSecondName, // pass super user second name
        editFrom: 'table', // pass from  which part the popup is open
      },
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((data) => {
        if (data === 'Update') {
          if (this.commonService.followUpView == 'grid') {
            // if  edited all column should refresh
            this.reloadGridViewChildComponent();
          }
        }
      });
  }
      // fn to reassign selected followups
      onSubUserAssigned(selected, subUserId, firstName, secondName, branchId){
        let assignedToName = secondName ? firstName + ' ' + secondName : firstName;
        const dialogRef = this.dialog.open(ChildFollowUpList, {
         width: '500px',
         minHeight: '100px',
         disableClose: true,
         data: {
           scenario: 'reAssign',
           fieldNameFollowup: this.fieldNameFollowup,
           assignedToName: assignedToName,
           selected,
           subUserId,
           branchId,
           superUserId: this.superUserId,
           branches: this.branches,
           userId: this.userId,
           userName: this.userName,
         },
       });
       dialogRef.afterClosed().pipe(take(1)).subscribe(data=>{
         this.selection.clear(); //clear select of table
       })
   }
}
