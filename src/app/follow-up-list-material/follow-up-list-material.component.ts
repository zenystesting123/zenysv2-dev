/*----------------------------------------------------------------------------------
Description : Followup table .
 Component is used to dispalylist of contacts under this user

------------------------------------------------------------------------------------*/
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ElementRef,
  Inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { FollowUpListMaterialService } from './follow-up-list-material.service';
import { Branch, contactSettings, customFields, defaultContactSettings, defaultfollowUpSettings, defaultSaleSettings, defaultServiceSettings, DisplayColumn, FollowUps, followUpSettings, modules, SettingsItem, subUsers, SubUsers } from '../data-models';
import { Location } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NetworkCheckService } from '../networkcheck.service';
import { CommonService } from '../common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CallViewAudioPlayerComponent } from '../call-view-audio-player/call-view-audio-player.component';
import { Router } from '@angular/router';
import { FollowupTaskCreateComponent } from '../followup-task-create/followup-task-create.component';
import { FollowUpTableColumns } from '../model/custom-report.model';
import { FollowupSortingDef, FollowupViewSettingsDef } from '../model/custom-filter.model';
import { ViewBuilderComponent } from '../view-builder/view-builder.component';
import { CardSettingsComponent } from '../card-settings/card-settings.component';
import { SelectSearchComponent } from '../common-search/select-search/select-search.component';
import { StatusPopupComponent } from '../settings/status-popup/status-popup.component';
import { ConfirmationpopupComponent } from '../confirmationpopup/confirmationpopup.component';
import { ViewServiceService } from '../view-builder/view-service.service';
import { FollowUpTableColumnsLeadPlan } from '../model/custom-report-leadManagement.model';
import { ChangeLogComponent } from '../change-log/change-log.component';
import { SelectionModel } from '@angular/cdk/collections';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-follow-up-list-material',
  templateUrl: './follow-up-list-material.component.html',
  styleUrls: ['./follow-up-list-material.component.scss'],
  providers: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpListMaterialComponent implements OnInit, OnDestroy {
  followUpListArray: MatTableDataSource<FollowUps>; // for displaying followuplist in table
  filterArray: MatTableDataSource<FollowUps>;//  followuplist used in filter
  superUserId: string; // super user id
  isLoaded: boolean = false; // check ifall datas are loaded and then show the table
  superUserFirstName: string; // super user first name
  superUserSecondName: string; // super user second name
  disableFollowUp: boolean = false; // for disable followup view
  disableCreateFollowUp: boolean = false; // for disable followup view
  disableViewContact: boolean = false; // for disable contact details view it prevents contact details view routing
  disableFollEdit: boolean = false; // disable followup edit
  fieldNameFollowup: string = 'FollowUp'; // for storing followup feild name
  fieldNameOrganization: string = 'Organization'; // for storing followup feild name
  fieldNameCustomer: string = 'Customer'; // for storing followup feild name
  fieldNameSale: string = 'Sale'; // for storing followup feild name
  fieldNameService: string = 'Service'; // for storing followup feild name
  fieldNameContactNotes: string = 'Note'; // setting default value for note
  upcomingList: FollowUps[]; // upcoming followup list
  overDueList: FollowUps[]; // overdue followup list
  completedList: FollowUps[]; // completed followup list
  enableOutboundCallsViaCallBridging: boolean = false; // auto call enable check
  callBridgingServiceProvider: string; // call bridging service provider 
  userNumber: string; //current user number
  userId: string; // current user id
  userName: string; //logged in users full name
  autoCallToken: string = ''; // auto call token
  columns = []; // table settings are stored in db
  userIdsArray: any[] = []; // all user ids
  userNamesArray: any[] = []; // all user names
  pipelineNames = [] = []; //Array to store the pipeline
  displayColumnsSaved: DisplayColumn[] = []; // table settings are stored in db
  displayName: string = 'displayFollowupColumns';
  tableName: string = 'Followup'; // table name
  customFields: customFields[] = []; // followup custom fields
  tableDefaultData = FollowUpTableColumns; // default followup table fields
  followUpSettings: followUpSettings = defaultfollowUpSettings.CONST_VALUE;// field name settings for followup
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;// field name settings for contact
  saleTitleSettings: SettingsItem = defaultSaleSettings.CONST_VALUE.saleTitle;// field name settings for sale title
  serviceTitleSettings: SettingsItem = defaultServiceSettings.CONST_VALUE.serviceTitle;// field name settings for service title
  subUsers: subUsers[] = []; // sub user list
  userDetailsSubscription: Subscription; // for unsubscribinguser subscription
  followupSubscription: Subscription;//for unsubscribing followup data subscription 
  dataAccessRule: string;//to set data acess rule
  userIdArray: any; // user id array
  viewSettingArray: any = FollowupViewSettingsDef.DATA//customer view settings array
  viewSettingSelected: any = this.viewSettingArray[0]; //particular view chosen by user
  sortField: any; // selected sort field
  sortOrder: any; // selected sort order
  queryData: any; // selected query
  followupsData: FollowUps[];//for storing tasks list
  sortFieldDef = FollowupSortingDef.Data; // sort fields
  allUsersId: any = []; // all user ids
  userDetailsAll: any = [];// all user list
  cardFields: any; // all card fields
  displayFields: any; //display card fields
  userList: any;// all user list
  secondaryFilterSet: boolean = false; //Field to check if secondary filter has been set or not
  secondaryFilterField: any; // secondary filter field name
  secondaryFilterValue: any; // secondary filter value
  DIDNumber: string = ''; // did number for autocall
  alertPopupStatus: boolean = false;// to open the alert dialoge once
  callBridgingExtension: any; // auto call extenstion
  outboundCallBridgingType: any = ''; // auto call type
  selection = new SelectionModel<FollowUps>(true, []); //multiple selection for reassigning
  activeUsersArray: SubUsers[] = []; //to display only active subusers
  branches: Branch[] = []; //branches saved under superuser
  disableReAssign = false; //if reassign is disabled according to profile

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private followupService: FollowUpListMaterialService,
    private location: Location,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private _snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    private viewServiceService: ViewServiceService
  ) {
    // initialize array
    this.followUpListArray = new MatTableDataSource([]);
    this.filterArray = new MatTableDataSource([]);
  }
  ngOnInit(): void {
    let defaultViewset = true;// to block changinf the view if userdatas are changed
    // subscribe user details from common service
    this.userDetailsSubscription = this.commonService.userDatas
      .subscribe((datas) => {
        if (datas.authDetails) {
          // if auth user logged in
          let userDetails = datas.userDetails; // bind user details
          this.branches = datas.branches;
          if (userDetails) {
            if (datas.userDetails.enableLiteMode) {
              this.router.navigate(['dash/followup-lite']);
            } else {
              if (datas.superUserDetails.DIDNumber) {
                this.DIDNumber = datas.superUserDetails.DIDNumber
              }
              // custm field name
              if (datas.superUserDetails.fieldNames) {
                this.fieldNameFollowup =
                  datas.superUserDetails.fieldNames.fieldNameFollowup; // get feild name of followup from super user
                if (datas.superUserDetails.fieldNames.fieldNameOrganization) {
                  this.fieldNameOrganization = datas.superUserDetails.fieldNames.fieldNameOrganization;
                }
                if (datas.superUserDetails.fieldNames.fieldNameCustomer) {
                  this.fieldNameCustomer = datas.superUserDetails.fieldNames.fieldNameCustomer;
                }
                if (datas.superUserDetails.fieldNames.fieldNameSale) {
                  this.fieldNameSale = datas.superUserDetails.fieldNames.fieldNameSale;
                }
                this.fieldNameContactNotes =
                  datas.superUserDetails.fieldNames.fieldNameContactNotes ? datas.superUserDetails.fieldNames.fieldNameContactNotes : 'Note';
              }
              if (datas.superUserDetails.fieldNames.fieldNameSuport) {
                this.fieldNameService = datas.superUserDetails.fieldNames.fieldNameSuport;
              }
              [this.cardFields, this.displayFields] = this.commonService.getCardFields('followup', this.fieldNameContactNotes, this.fieldNameFollowup);
              [this.allUsersId, this.userDetailsAll] = this.commonService.createUserlist('All', 'any');//create list of all subusers
              // if user details exists
              if (userDetails.superUserId) {
                //If the superuserid is set assign it
                this.superUserId = userDetails.superUserId;
              } else {
                //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
                this.superUserId = datas.userId;
              }
              if (datas.superUserDetails.autoCallToken) {
                this.autoCallToken = datas.superUserDetails.autoCallToken;
              }
              if (datas.userDetails.displayFollowupColumns) {
                this.displayColumnsSaved = datas.userDetails.displayFollowupColumns
              }
              if (datas.userDetails.followUpViewSettings) {
                this.viewSettingArray = JSON.parse(JSON.stringify(datas.userDetails.followUpViewSettings)) //View setting array for customer list
                this.viewSettingSelected = this.viewSettingArray[this.commonService.followupViewId]; // particular view selected
              } else {
                this.viewSettingSelected = this.viewSettingArray[this.commonService.followupViewId]; // particular view selected
              }
              let allSubUsers = this.commonService.createUserlist('All', 'any')[1];
              // to reassign display only active users list
              this.activeUsersArray = allSubUsers.filter(function (e) {
                return e.status != 'suspended';
              });
              this.customFields =
                datas.superUserDetails.customFieldsFollowUp;
              if (this.displayColumnsSaved.length > 0) {
                //if table settings are stored in db, use the stored data
                this.columns = this.displayColumnsSaved;
              } else {
                //if plan is leadManagement, get default table config from custom-report-leadManagement model
                if (datas.superUserDetails.plan == 'leadManagement') {
                  this.columns = FollowUpTableColumnsLeadPlan;
                  this.tableDefaultData = FollowUpTableColumnsLeadPlan;
                } else {
                  //if plan is not leadManagement, get default table config from custom-report model
                  this.columns = FollowUpTableColumns;
                }
              }
              [this.userIdsArray, this.userNamesArray] = this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names
              // user profile datas to get access details
              if (datas.usrProfileData) {
                this.dataAccessRule = datas.usrProfileData.followUpDataAccessRule;
                // check if user profile data exists
                if (datas.usrProfileData.isCheckedFoll == false) {
                  // check followup edit and view accecess if false
                  this.disableFollowUp = true; // disable followup view
                  this.disableFollEdit = true; // disable followup edit
                  this.disableCreateFollowUp = true; // disable create followup
                  this.disableReAssign = true;
                }
                if (datas.usrProfileData.follView == false) {
                  this.disableFollowUp = true; // disable followup view
                }
                if (datas.usrProfileData.follEdit == false) {
                  this.disableFollEdit = true; // disable followup edit
                }
                if (datas.usrProfileData.follCreate == false) {
                  this.disableCreateFollowUp = true;
                }
                if (datas.usrProfileData.followUpReAssign == false) {
                  this.disableReAssign = true
                }

                if (datas.usrProfileData.isCheckedCont == false) {
                  // cehcks contact access rule
                  this.disableViewContact = true; // disable contact view access
                } else if (datas.usrProfileData.contactsView == false) {
                  this.disableViewContact = true; // disable contact view access
                }
              }
              //customisation contact field
              if (
                datas.superUserDetails.contactSettings &&
                typeof datas.superUserDetails.contactSettings !== 'undefined' &&
                datas.superUserDetails.contactSettings !== null
              ) {
                this.contactSettings = datas.superUserDetails.contactSettings;
              }

              //customisation field
              if (
                datas.superUserDetails.followUpSettings &&
                typeof datas.superUserDetails.followUpSettings !== 'undefined' &&
                datas.superUserDetails.followUpSettings !== null
              ) {
                this.followUpSettings = datas.superUserDetails.followUpSettings;
                if (datas.superUserDetails.followUpSettings) {
                  this.commonService.checkCustomField(defaultfollowUpSettings.CONST_VALUE, datas.superUserDetails.followUpSettings)
                }
              }
              if (
                datas.superUserDetails.saleSettings &&
                typeof datas.superUserDetails.saleSettings !== 'undefined' &&
                datas.superUserDetails.saleSettings !== null
              ) {
                this.saleTitleSettings = datas.superUserDetails.saleSettings.saleTitle;
              }


              if (
                datas.superUserDetails.serviceSettings &&
                typeof datas.superUserDetails.serviceSettings !== 'undefined' &&
                datas.superUserDetails.serviceSettings !== null
              ) {
                this.serviceTitleSettings = datas.superUserDetails.serviceSettings.serviceTitle;
              }
              this.userName =
                datas.userDetails.firstname +
                ' ' +
                (datas.userDetails.lastname ? datas.userDetails.lastname : '');
              this.userId = datas.userId;
              this.userNumber = datas.userDetails.phone;
              if (datas.superUserDetails.enableOutboundCallsViaCallBridging) {
                this.enableOutboundCallsViaCallBridging =
                  datas.superUserDetails.enableOutboundCallsViaCallBridging;
              }
              if (datas.superUserDetails.outboundCallType) {
                this.outboundCallBridgingType = datas.superUserDetails.outboundCallType;
              }
              if (datas.superUserDetails.callBridgingServiceProvider) {
                this.callBridgingServiceProvider =
                  datas.superUserDetails.callBridgingServiceProvider;
              }
              if (this.superUserId === this.userId) {
                if (datas.superUserDetails.extensionNumber) {
                  this.callBridgingExtension = datas.superUserDetails.extensionNumber ? datas.superUserDetails.extensionNumber : '';
                }
              } else {
                const userObject = datas.subUsers.find(user => user.userId === this.userId)
                this.callBridgingExtension = userObject ? userObject.extensionNumber : null;
              }
              //setting current user in array to display thuis users details too
              this.superUserFirstName = datas.superUserDetails.firstname; // bind super user first name for passing followup edit popup
              this.superUserSecondName = datas.superUserDetails.lastname; // bind super user first name for passing followup edit popup

              [this.userIdArray, this.subUsers] = this.commonService.createUserlist(this.dataAccessRule, this.userId);
              // to set the view based on the default view saved in db.
              // at the first time the block will excute also then if customerView changed in current user, any other changes in super/current user will not enter to this block
              if ((datas.userDetails.followUpDefaultView && defaultViewset
                && this.commonService.followUpView == this.commonService.followUpDefaultView)
                || (datas.userDetails.followUpDefaultView && datas.userDetails.followUpDefaultView != this.commonService.followUpDefaultView)) {
                this.commonService.followUpView = datas.userDetails.followUpDefaultView;
                this.commonService.followUpDefaultView = datas.userDetails.followUpDefaultView;
                defaultViewset = false;
              }
              this.getViewData()
            }
          }
        }
      });
  }
  // fn to reassign selected followups
  onSubUserAssigned(selected, subUserId, firstName, secondName, branchId) {
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
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      this.selection.clear(); //clear select of table
    })
  }
  // get selected view data
  getViewData() {
    this.isLoaded = false;
    // open a popup if deleted additional field is used in custom view query
    if (this.viewSettingSelected.primaryQuery.queryField == 'additionalFieldsArr'
      && !this.customFields[this.viewSettingSelected.primaryQuery.ind].isActive) {
      if (!this.alertPopupStatus) {
        this.dialog.open(StatusPopupComponent, {
          disableClose: true,
          data: {
            type: 'Addtional_field_custom_view',
          },
        });
      }
      this.alertPopupStatus = true;
    } else if (this.viewSettingSelected.sortField.fieldType == 'Additional'
      && !this.customFields[this.viewSettingSelected.sortField.ind].isActive) {
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
      this.viewSettingSelected.filters?.forEach(element => {
        if (element.queryField == 'additionalFieldsArr'
          && !this.customFields[element.ind].isActive) {
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
    this.queryData = this.commonService.getQueryData(this.viewSettingSelected.primaryQuery);
    this.sortField = this.viewSettingSelected.sortField;
    this.sortOrder = this.viewSettingSelected.sortOrder;
    if (this.queryData) {
      if (this.followupSubscription && !this.followupSubscription.closed) {
        this.followupSubscription.unsubscribe()
      }
      this.followupSubscription = this.commonService
        .readPrimaryData(this.superUserId, 'Follow Ups', this.queryData, this.userIdArray)
        .subscribe((data) => {
          this.followupsData = [];
          this.followupsData = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as FollowUps;
          });
          if (this.dataAccessRule == 'Team' || this.dataAccessRule == 'Own') {
            if (this.userIdArray) {
              this.followupsData = this.followupsData.filter((element) =>
                this.userIdArray.includes(element.assignedTo)
              );
            } else {
              [this.userIdArray, this.userList] =
                this.commonService.createUserlist(
                  this.dataAccessRule,
                  this.userId
                );
              this.followupsData = this.followupsData.filter((element) =>
                this.userIdArray.includes(element.assignedTo)
              );
            }
          } else if (this.dataAccessRule == 'Branch') {
            let branchId = this.commonService.getBranch(this.userId)
            this.followupsData = this.followupsData.filter(element =>
              element.associatedBranch === branchId
            );

          }

          this.followupsData = this.commonService.sortData(this.followupsData, this.sortField, this.sortOrder)
          // check if filter is present
          if (this.viewSettingSelected.filters.length > 0) {
            let filterData = this.viewSettingSelected.filters;
            filterData.forEach((element) => {
              let filterQuery = this.commonService.getQueryData(element);
              this.followupsData = this.followupsData.filter((record) =>
                this.commonService.filterData(record, filterQuery)
              );
            });
          }
          this.followUpListArray.data = this.followupsData;
          this.filterArray.data = this.followupsData;
          this.completedList = [];
          this.upcomingList = [];
          this.overDueList = [];
          //filtering task for upcoming, overdue and completed grid view
          let today = new Date();
          let date = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0); //set the time to zero (12 AM) to include all records from that day
          this.completedList = (this.followupsData.filter(el => (el.completedStatus == true)))
          this.upcomingList = (this.followupsData.filter(el => (el.completedStatus == false) && (new Date(el.callStartDate?.toDate()) >= date)))
          this.overDueList = (this.followupsData.filter(el => (el.completedStatus == false) && (new Date(el.callStartDate?.toDate()) < date)))
          if (this.secondaryFilterSet == true) {
            this.secondaryFilter(
              this.secondaryFilterField,
              this.secondaryFilterValue
            );
          }
          this.isLoaded = true;
          this.changeDetectorRef.detectChanges();

        });
    } else {
      this.isLoaded = true;
    }
  }
  // change view selected
  viewChanged(viewIndex) {
    this.commonService.followupViewId = viewIndex;
    this.viewSettingSelected = this.viewSettingArray[this.commonService.followupViewId]; // particular view selected
    this.alertPopupStatus = false;// popup status set as false to open poup if next view contactins deletd add field
    this.getViewData();
  }
  //Function to open the popup to edit views
  editView(mode) {
    //call the popup for card field customization
    let dialogRef = this.dialog.open(ViewBuilderComponent, {
      data: ['Follow Ups', this.commonService.followupViewId, mode, this.sortFieldDef],
      width: 'auto',
    });
    // Subscribe when the dialog box closes
    dialogRef.afterClosed().subscribe(
      (res) => {
        // Receive data from dialog component
        // If new view has been added, then read the new view and load data
        if (res.response == 'Add') {
          this.commonService.followupViewId = this.viewSettingArray.length - 1;
          this.viewSettingSelected = this.viewSettingArray[this.commonService.followupViewId]
          this.getViewData();
        } else {
          this.viewSettingSelected = this.viewSettingArray[this.commonService.followupViewId];
        }
      }
    );
  }
  //delete view
  deleteView() {
    let dialogref = this.dialog.open(ConfirmationpopupComponent, {
      width: '400px',
      data: {
        smode: 'delete_view',
        viewName: this.viewSettingArray[this.commonService.followupViewId].viewName,
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res == 'deleted') {
        // if delete clicked delete the view from viewsetting array and if view number is greater than 0 then minius 1 to view number and update view
        this.viewSettingArray.splice(this.commonService.followupViewId, 1);
        if (this.commonService.followupViewId > 0) {
          this.commonService.followupViewId = this.commonService.followupViewId - 1;
        }
        this.viewServiceService.onSaveView(this.userId, this.viewSettingArray, 'Follow Ups').then(res => {
          this._snackBar.open('View has been deleted', '', { duration: 2000 });
        })
      }
    });
  }
  // go to previous page
  onBack() {
    // on back button click
    this.location.back(); // moves to back location
  }
  // edit followup
  onEditFollowUps(
    // on edit button clicked. Open edit followups
    taskId: string,
    customerId: string,
    companyName: string,
    customerName: string,
    followUpData
  ) {
    this.commonService.followUpDetails = followUpData;
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        id: customerId, // pass customer id
        companyNames: companyName, // pass company name
        customerNames: customerName, // pass customer name
        contactNumber: followUpData.contactNumber ? followUpData.contactNumber : '', // pass customer number
        countryCode: followUpData.countryCode ? followUpData.countryCode : '', // pass customer country code
        scenario: 'edit', // scenario for followup popup
        followUpId: taskId, // pass task id
        subUsers: this.subUsers, // pass sub user list
        fname: this.superUserFirstName, // pass super user first name
        lastname: this.superUserSecondName, // pass super user second name
        editFrom: 'table', // pass from  which part the popup is open
      },
    });
  }
  // complete the follwup task
  markasCompleted(taskId: string, customerId: string, changeLog) {
    // update followup completed status as true
    let completed = true;
    let newChangeLog = ChangeLogComponent.saveLog(
      this.constructor.name,
      this.userId,
      this.userName,
      { completedStatus: false },
      { completedStatus: true },
      changeLog
    );
    this.followupService.UpdateFollowupTaskAsCompleted(
      taskId,
      completed,
      this.superUserId,
      newChangeLog
    );
    this._snackBar.open(this.fieldNameFollowup + ' task closed', '', {
      duration: 2000,
    });
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    // on destroy
    this.userDetailsSubscription?.unsubscribe();
    this.followupSubscription?.unsubscribe()
  }
  // create followup
  onCreateFollowUp() {
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: {
        scenario: 'customerSelectFollowUp',
      },
    });
  }
  // switch to table view
  onToggleToTable() {
    this.commonService.followUpView = 'table';
  }
  // switch to grid view
  onToggleGridView() {
    this.commonService.followUpView = 'grid';
  }
  // to call the autocall api and pass all the details
  async onCallFollowUp(id, customerId, followupData) {
    if (
      this.enableOutboundCallsViaCallBridging &&
      this.userNumber) {
      let contactNumber = followupData.contactNumber ? followupData.contactNumber : '';
      if (!contactNumber) {
        let data = await this.followupService
          .readCustRecord(this.superUserId, customerId)
        contactNumber = data.contactNo
      }
      if (
        contactNumber
      ) {
        let minute = new Date().getMinutes();
        let hour = new Date().getHours();
        let startTime = hour + ':' + minute;
        this.commonService
          .onAutoCall(
            this.userNumber,
            contactNumber,
            this.superUserId,
            this.userId,
            this.userName,
            followupData.companyName,
            customerId,
            followupData.customerName,
            startTime,
            id,
            this.autoCallToken,
            this.DIDNumber,
            followupData.orgId ? followupData.orgId : '',
            followupData.associatedBranch ? followupData.associatedBranch : 'none',
            this.callBridgingExtension,
            this.outboundCallBridgingType,
            followupData.saleTitle ? followupData.saleTitle : null,
            followupData.saleId ? followupData.saleId : null,
            followupData.serviceTitle ? followupData.serviceTitle : null,
            followupData.serviceId ? followupData.serviceId : null,
          )
          .subscribe((data: any) => { });
        this._snackBar.open('Initiating Call', '', {
          duration: 2000,
        });
      } else {
        this._snackBar.open('Contact number does not exist', '', {
          duration: 2000,
        });
      }
    } else {
      if (!this.userNumber) {
        this._snackBar.open("The user's contact number is not configured.", '', {
          duration: 2000,
        });
      }
    }


  }
  // play audio popup
  onPlayAudio(resourceURL) {
    const dialogRef = this.dialog.open(CallViewAudioPlayerComponent, {
      width: '500px',
      data: resourceURL,
    });
  }

  // go to org details page
  onViewOrg(orgId: string) {
    let link: string = 'dash/organisation/orgdetails/' + orgId
    this.router.navigate([]).then(result => { window.open(link, '_blank'); });;
  }

  // go to customer details page
  onViewCustomer(customerId: string) {
    let link: string = 'dash/contact/customerdetails/' + customerId
    this.router.navigate([]).then(result => { window.open(link, '_blank'); });;
  }
  // go to sale details page
  onViewSale(saleId: string) {
    let link: string = 'dash/sales/saleview/' + saleId
    this.router.navigate([]).then(result => { window.open(link, '_blank'); });;
  }
  // go to service details page
  onViewSupport(supportId: string) {
    let link: string = 'dash/service/service-details/' + supportId
    this.router.navigate([]).then(result => { window.open(link, '_blank'); });;
  }
  // secondary filter
  secondaryFilter(field, value) {
    this.secondaryFilterSet = true;
    this.secondaryFilterField = field;
    this.secondaryFilterValue = value;
    let filteredData = [];
    filteredData = this.followupsData.filter((record) => {
      return record[field] === value
    })
    this.followUpListArray.data = filteredData;
    this.filterArray.data = filteredData;
    this.completedList = [];
    this.upcomingList = [];
    this.overDueList = [];
    let today = new Date();
    let date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0); //set the time to zero (12 AM) to include all records from that day

    this.completedList = (filteredData.filter(el => (el.completedStatus == true)))
    this.upcomingList = (filteredData.filter(el => (el.completedStatus == false) && (new Date(el.callStartDate?.toDate()) >= date)))
    this.overDueList = (filteredData.filter(el => (el.completedStatus == false) && (new Date(el.callStartDate?.toDate()) < date)))
  }
  // filter dialog
  onShowDialog(evt: MouseEvent, scenario): void {
    const target = new ElementRef(evt.currentTarget);
    const dialogRef = this.dialog.open(SelectSearchComponent, {
      panelClass: "dialog-side-panel",
      data: {
        trigger: target,
        placeHolderText: 'Users',
        allSubUsers: this.activeUsersArray
      }
    });
    // on submit clicked
    const dialogSubmitSubscription =
      dialogRef.componentInstance.submitClicked.subscribe(
        (userId: string) => {
          dialogSubmitSubscription.unsubscribe();
          if (userId) {
            this.secondaryFilter(scenario, userId)
          }
          this.changeDetectorRef.detectChanges();
        })
  }
  // clear filter
  clearFilter() {
    this.secondaryFilterSet = false;
    this.followUpListArray.data = this.followupsData;
    this.filterArray.data = this.followupsData;
    this.completedList = [];
    this.upcomingList = [];
    this.overDueList = [];
    let today = new Date();
    let date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0); //set the time to zero (12 AM) to include all records from that day

    this.completedList = (this.followupsData.filter(el => (el.completedStatus == true)))
    this.upcomingList = (this.followupsData.filter(el => (el.completedStatus == false) && (new Date(el.callStartDate?.toDate()) >= date)))
    this.overDueList = (this.followupsData.filter(el => (el.completedStatus == false) && (new Date(el.callStartDate?.toDate()) < date)))
  }
  // customize card fields
  customizeCardContent(module) {
    //call the popup for card field customization
    let dialogRef = this.dialog.open(CardSettingsComponent, {
      data: ['followup', this.cardFields],
      width: '600px',
    });
  }
  // get card field value
  getFieldValue(field, data) {
    if (
      field.columnDef == 'contactNumber'
    ) {
      let countryCode = data.countryCode ? data.countryCode : '';
      let contactNumber = data[field.columnDef] ? data[field.columnDef] : '';
      return countryCode + ' ' + contactNumber;
      //If field is pipeline
    } else {
      return this.commonService.getFieldValue(field, data, modules.FollowUps);
    }

  }
}
@Component({
  selector: 'child-follow-up-list',
  templateUrl: 'child-follow-up-list.html',
  styleUrls: ['./follow-up-list-material.component.scss'],
})
export class ChildFollowUpList {
  scenario = 'reAssign'; //scenario of child component called
  spinner = false; //spinner to show while reassigning
  count = 0; //for reassign, no is stored in this variable

  constructor(
    public dialogRef: MatDialogRef<ChildFollowUpList>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snack: MatSnackBar,
    private serviceInst: FollowUpListMaterialService
  ) { }

  // cancel fn
  onNoClick(): void {
    this.dialogRef.close();
  }
  // reassign fn
  reAssignFn() {
    this.spinner = true;
    this.data.selected.forEach((ele) => {
      this.serviceInst
        .onUpdateFollowUp(
          this.data.superUserId,
          ele.id,
          this.data.subUserId,
          this.data.assignedToName,
          this.data.branchId,
          ChangeLogComponent.saveLog(
            'FollowUpList',
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
    }); //update in followups collection
  }

}
