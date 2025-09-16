/*----------------------------------------------------------------
Description : followup list details
              There is incoming,missed and outgoing view
              can filter by date and can search

--------------------------------------------------------------------*/
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import * as firebase from 'firebase';
import { Subject, Subscription } from 'rxjs';
import { FollowUps, SubUsers, UserAccessDetails } from '../data-models';
import { NetworkCheckService } from '../networkcheck.service';
import { CommonService } from '../common.service';
import { takeUntil } from 'rxjs/operators';
import { CallViewService } from './call-view.service';
import { MatDialog } from '@angular/material/dialog';
import { CallViewAudioPlayerComponent } from '../call-view-audio-player/call-view-audio-player.component';
import { CrudServiceComponent } from '../crud-service/crud-service.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Addcontactpopup1Component } from '../addcontactpopup1/addcontactpopup1.component';
import { FollowupTaskCreateComponent } from '../followup-task-create/followup-task-create.component';
import { Addnewsale1Component } from '../addnewsale1/addnewsale1.component';
@Component({
  selector: 'app-call-view',
  templateUrl: './call-view.component.html',
  styleUrls: ['./call-view.component.scss'],
})
export class CallViewComponent implements OnInit, OnDestroy {
  followUpListArray: FollowUps[] = []; // for displaying followuplist in table
  filterArray: FollowUps[] = []; // for filtering the list
  resetFilterArray: FollowUps[] = []; // for filter the list on click reset button based on the view
  user: firebase.default.UserInfo;
  selectedDate1: any = null; // start date for date filter -initialize to null
  selectedDate2: any = null; // end date for date filter -initialize to null
  searchTerm; // search term for the search filter
  superUserId: string; // super user id
  isLoaded: boolean = false; // check ifall datas are loaded and then show the table
  superUserFirstName: string; // super user first name
  superUserSecondName: string; // super user second name
  userProfileData: UserAccessDetails; // user proile access details
  disableFollowUp: boolean = false; // for disable followup view
  checkDataAccessRuleAll: string = 'Own'; // check access control
  disableViewContact: boolean = false; // for disable contact details view it prevents contact details view routing
  disableFollEdit: boolean = false; // disable followup edit
  isFilterApplied: boolean = false; // checks if filter applied to toggle table view(recent contact/dates selected view)
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  fieldNameFollowup: string = 'FollowUp'; // for storing followup feild name
  fieldNameContact: string = 'Contact'; // for storing contact feild name
  feildNameSale: string = 'Sale'; // for storing sale feild name
  feildNameTask: string = 'Task'; // for storing task feild name
  subUsers: SubUsers[] = []; // sub users list for passing the edit followup popup and for team access
  incomingList: FollowUps[];
  incomingListReset: FollowUps[] = [];
  // missedcallList: FollowUps[];
  // missedcallListReset: FollowUps[] = [];
  outgoingList: FollowUps[];
  outgoingListReset: FollowUps[] = [];
  viewFilter: string = 'incoming';
  view: string = 'today';
  followUpSubscription: Subscription = null;
  enableOutboundCallsViaCallBridging: boolean = false;
  callBridgingServiceProvider: string;
  userId: string;
  autoCallToken: string = '';
  userName: string = '';
  DIDNumber:string='';
  callBridgingExtension: any;
  outboundCallBridgingType: any = '';
  constructor(
    private callViewService: CallViewService,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  // add contact from sidenav
  addcontactfn(phoneNum, followUpId) {
    const dialogRef = this.dialog.open(Addcontactpopup1Component, {
      panelClass: 'custom-dialog-container',
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: {
        scenario: 'create',
        Phone: phoneNum,
        followUpId: followUpId
      },
    });
  }

  // add new sale from customer
  onAddSale(customerId:string) {
    if (this.commonService.addDocLimitaion.addSaleDisable) {
      this._snackBar.open('Sale limit expired for this month!', '', {
        duration: 2000,
      });
    } else {
      const dialogRef = this.dialog.open(Addnewsale1Component, {
        width: '800px',
        height: 'auto',
        disableClose: true,
        data: { scenario: 'createfromCustomer', id: customerId },
      });

    }
  }
  // add service fn
  addservicefn() {
    this.dialog.open(CrudServiceComponent, {
      width: '580px',
      height: 'auto',
      minHeight: '100px',
      disableClose: true,
      data: { scenario: 'create' },
    });
  }
  ngOnInit(): void {
    // subscribe user details from common service
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((datas) => {
        this.user = datas.authDetails; // bind auth details
        if (this.user) {
          // if auth user logged in
          let userDetails = datas.userDetails; // bind user details
          if (userDetails) {
            this.userId = datas.userId;
            // if user details exists
            if (userDetails.superUserId) {
              //If the superuserid is set assign it
              this.superUserId = userDetails.superUserId;
            } else {
              //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
              this.superUserId = this.user.uid;
            }
            if(datas.superUserDetails.DIDNumber){
              this.DIDNumber=datas.superUserDetails.DIDNumber
            }
            this.userName =
              datas.userDetails.firstname +
              ' ' +
              (datas.userDetails.lastname ? datas.userDetails.lastname : '');
            if (datas.superUserDetails.enableOutboundCallsViaCallBridging) {
              this.enableOutboundCallsViaCallBridging =
                datas.superUserDetails.enableOutboundCallsViaCallBridging;
            }
            if (datas.superUserDetails.outboundCallType) {
              this.outboundCallBridgingType = datas.superUserDetails.outboundCallType;
            }
            if (datas.superUserDetails.autoCallToken) {
              this.autoCallToken = datas.superUserDetails.autoCallToken;
            }
            if (datas.superUserDetails.callBridgingServiceProvider) {
              this.callBridgingServiceProvider =
                datas.superUserDetails.callBridgingServiceProvider;
            }
            if(this.superUserId === this.userId){
              if (datas.superUserDetails.extensionNumber) {
                this.callBridgingExtension = datas.superUserDetails.extensionNumber?datas.superUserDetails.extensionNumber:'';
              }
            } else{
              const userObject = datas.subUsers.find(user => user.userId === this.userId)
              this.callBridgingExtension = userObject?userObject.extensionNumber:null;
            }
            this.userProfileData = datas.usrProfileData; // bind user profile datas to get access details
            if (this.userProfileData) {
              // check if user profile data exists
              if (this.userProfileData.isCheckedFoll == false) {
                // check followup edit and view accecess if false
                this.disableFollowUp = true; // disable followup view
                this.disableFollEdit = true; // disable followup edit
              }
              if (this.userProfileData.follView == false) {
                this.disableFollowUp = true; // disable followup view
              }
              if (this.userProfileData.follEdit == false) {
                this.disableFollEdit = true; // disable followup edit
              }

              if (this.userProfileData.dialogdataAccessRule) {
                // check access control rule is all
                this.checkDataAccessRuleAll =
                  this.userProfileData.dialogdataAccessRule; // set true vale to checkDataAccessRuleAll
              }
              if (this.userProfileData.isCheckedCont == false) {
                // cehcks contact access rule
                this.disableViewContact = true; // disable contact view access
              } else if (this.userProfileData.contactsView == false) {
                this.disableViewContact = true; // disable contact view access
              }
            }
            this.superUserFirstName = datas.superUserDetails.firstname; // bind super user first name for passing followup edit popup
            this.superUserSecondName = datas.superUserDetails.lastname; // bind super user first name for passing followup edit popup
            this.subUsers = datas.subUsers; //Get the list of subusers for the super user  for passing followup edit popup
            if (datas.superUserDetails.fieldNames) {
              this.fieldNameFollowup =
                datas.superUserDetails.fieldNames.fieldNameFollowup; // get feild name of followup from super user
              this.fieldNameContact =
                datas.superUserDetails.fieldNames.fieldNameContact; // get feild name of contact from super user
              this.feildNameSale =
                datas.superUserDetails.fieldNames.fieldNameSale; // get feild name of sale from super user
              this.feildNameTask =
                datas.superUserDetails.fieldNames.fieldNameTask; // get feild name of task from super user
            }
            if (this.checkDataAccessRuleAll == 'All') {
              // if access controll rule is all get this weeks followups
              this.getThisTodaysFollowupListFromApi(this.superUserId);
            } else if (this.checkDataAccessRuleAll == 'Own') {
              this.getThisTodaysFollowupListFromApiforsubuser(
                // if access control rule is not all get this weeks followup assigned to the user
                this.superUserId,
                this.user.uid // for filter followups assigned to the user
              );
            } else if (this.checkDataAccessRuleAll == 'Team') {
              this.getThisTodaysFollowupListFromApiforTeam(
                // if access control rule is not all get this weeks followup assigned to the user
                this.superUserId,
                this.user.uid // for filter followups assigned to the user
              );
            }
          }
        }
      });
  }
  // get this weeks followup for if acces rule is not all
  getThisTodaysFollowupListFromApiforsubuser(mId, uId) {
    this.callViewService
      .getFollowUpssubuser(mId, uId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as FollowUps;
        });
        if (this.view == 'today') {
          this.resetFilterArray = doc; // bind data to resetFilterArray array for reset flteration
          this.followUpListArray = doc; // bind data to followUpListArray array for table view
          this.filterArray = doc; // bind data to filterArray for filteration
          this.incomingList = [];
          this.incomingList = this.followUpListArray.filter(
            (data) => data.direction == 'Inbound'
          );
          this.incomingListReset = this.incomingList;
          // this.missedcallList = [];
          // this.missedcallList = this.followUpListArray.filter(
          //   (data) => data.direction == 'Missed'
          // );
          // this.missedcallListReset = this.missedcallList;
          this.outgoingList = [];
          this.outgoingList = this.followUpListArray.filter(
            (data) => data.direction == 'Outbound'
          );
          this.outgoingListReset = this.outgoingList;

          this.isLoaded = true;
        } else {
          this.isLoaded = true;
        }
      });
  }
  // get this weeks followup for if acces rule is all
  getThisTodaysFollowupListFromApi(id) {
    this.callViewService
      .getFollowUps(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as FollowUps;
        });
        if (this.view == 'today') {
          this.resetFilterArray = doc; // bind data to resetFilterArray array for reset flteration
          this.followUpListArray = doc; // bind data to followUpListArray array for table view
          this.filterArray = doc; // bind data to filterArray for filteration
          this.incomingList = [];
          this.incomingList = this.followUpListArray.filter(
            (data) => data.direction == 'Inbound'
          );
          this.incomingListReset = this.incomingList;
          // this.missedcallList = [];
          // this.missedcallList = this.followUpListArray.filter(
          //   (data) => data.direction == 'Missed'
          // );
          // this.missedcallListReset = this.missedcallList;
          this.outgoingList = [];
          this.outgoingList = this.followUpListArray.filter(
            (data) => data.direction == 'Outbound'
          );
          this.outgoingListReset = this.outgoingList;

          this.isLoaded = true;
        } else {
          this.isLoaded = true;
        }
      });
  }

  // get this weeks followup for if acces rule is team
  async getThisTodaysFollowupListFromApiforTeam(mId, uId) {
    let followUpList: FollowUps[] = [];
    for (let subUser of this.subUsers) {
      if (subUser.reportsToId == uId) {
        let followUps = await this.callViewService.getFollowUpsTeam(
          mId,
          subUser.userId
        );
        followUpList.push(...followUps);
      }
    }
    let userfollowUp = await this.callViewService.getFollowUpsTeam(mId, uId);
    followUpList.push(...userfollowUp);
    if (this.view == 'today') {
      this.resetFilterArray = followUpList; // bind data to resetFilterArray array for reset flteration
      this.followUpListArray = followUpList; // bind data to followUpListArray array for table view
      this.filterArray = followUpList; // bind data to filterArray for filteration
      this.incomingList = [];
      this.incomingList = this.followUpListArray.filter(
        (data) => data.direction == 'Inbound'
      );
      this.incomingListReset = this.incomingList;
      // this.missedcallList = [];
      // this.missedcallList = this.followUpListArray.filter(
      //   (data) => data.direction == 'Missed'
      // );
      // this.missedcallListReset = this.missedcallList;
      this.outgoingList = [];
      this.outgoingList = this.followUpListArray.filter(
        (data) => data.direction == 'Outbound'
      );
      this.outgoingListReset = this.outgoingList;
      this.isLoaded = true;
    } else {
      this.isLoaded = true;
    }
  }
  // search filter
  filter(query: string) {
    if (this.selectedDate1 && this.selectedDate2) {
      // checks if dates are selected

      this.followUpListArray = query
        ? this.filterArray.filter(
          (p) =>
            p.companyName?.toLowerCase().includes(query.toLowerCase()) ||
            p.customerName?.toLowerCase().includes(query.toLowerCase())
        )
        : this.filterArray;

      this.incomingList = [];
      this.incomingList = this.followUpListArray.filter(
        (data) => data.direction == 'Inbound'
      );
      // this.missedcallList = [];
      // this.missedcallList = this.followUpListArray.filter(
      //   (data) => data.direction == 'Missed'
      // );
      this.outgoingList = [];
      this.outgoingList = this.followUpListArray.filter(
        (data) => data.direction == 'Outbound'
      );
    } else if (this.selectedDate1 == null || this.selectedDate2 == null) {
      // if dates are not selected
      this.followUpListArray = query
        ? this.filterArray.filter(
          (p) =>
            p.companyName?.toLowerCase().includes(query.toLowerCase()) ||
            p.customerName?.toLowerCase().includes(query.toLowerCase()) ||
            p.assignedToName?.toLowerCase().includes(query.toLowerCase())
        )
        : this.filterArray;

      this.incomingList = [];
      this.incomingList = this.followUpListArray.filter(
        (data) => data.direction == 'Inbound'
      );
      // this.missedcallList = [];
      // this.missedcallList = this.followUpListArray.filter(
      //   (data) => data.direction == 'Missed'
      // );
      this.outgoingList = [];
      this.outgoingList = this.followUpListArray.filter(
        (data) => data.direction == 'Outbound'
      );
    }
  }
  // filter by date
  onDate2() {
    if (this.followUpSubscription) {
      this.followUpSubscription.unsubscribe();
    }
    this.view = 'date';
    this.filterArray = []; //set empty filter array
    this.isFilterApplied = true; // for showing date selected view
    this.searchTerm = null; // set search term empty
    let firstDay = new Date(this.selectedDate1); // set first day to selecteddate1
    let lastDay = new Date(this.selectedDate2); // set last day to selecteddate2
    lastDay.setHours(23, 59, 59, 999);
    // checks access rule
    if (this.checkDataAccessRuleAll == 'All') {
      // if access rule is all gets all followup between firstday and lastday
      this.followUpSubscription = this.callViewService
        .getFollowUpsSuperUserFilter(this.superUserId, firstDay, lastDay)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          let doc = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as FollowUps;
          });
          if (this.view == 'date') {
            this.followUpListArray = doc; // for displaying that to table
            this.filterArray = doc; // for filteraton

            this.incomingList = [];
            this.incomingList = this.followUpListArray.filter(
              (data) => data.direction == 'Inbound'
            );
            // this.missedcallList = [];
            // this.missedcallList = this.followUpListArray.filter(
            //   (data) => data.direction == 'Missed'
            // );
            this.outgoingList = [];
            this.outgoingList = this.followUpListArray.filter(
              (data) => data.direction == 'Outbound'
            );
            this.isLoaded = true;
          } else {
            this.isLoaded = true;
          }
        });
    } else if (this.checkDataAccessRuleAll == 'Own') {
      // if access rule is not all gets all followup between firstday and lastday assigned to the user
      this.followUpSubscription = this.callViewService
        .getFollowUpssubuserFilter(
          this.superUserId,
          this.user.uid,
          firstDay,
          lastDay
        )
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          let doc = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as FollowUps;
          });
          if (this.view == 'date') {
            this.followUpListArray = doc; // for displaying that to table
            this.filterArray = doc; // for filteraton

            this.incomingList = [];
            this.incomingList = this.followUpListArray.filter(
              (data) => data.direction == 'Inbound'
            );
            // this.missedcallList = [];
            // this.missedcallList = this.followUpListArray.filter(
            //   (data) => data.direction == 'Missed'
            // );
            this.outgoingList = [];
            this.outgoingList = this.followUpListArray.filter(
              (data) => data.direction == 'Outbound'
            );
            this.isLoaded = true;
          } else {
            this.isLoaded = true;
          }
        });
    } else if (this.checkDataAccessRuleAll == 'Team') {
      // if access rule is not all gets all followup between firstday and lastday assigned to the user
      this.getFollowUpTeamFilter(
        this.superUserId,
        this.user.uid,
        firstDay,
        lastDay
      );
    }
  }
  // on reset button clicked
  resetDate() {
    this.view = 'today';
    this.isFilterApplied = false; // for showing this weeks followup
    this.selectedDate1 = null; // set selected1 date as null
    this.selectedDate2 = null; // set selected2 date as null
    this.searchTerm = null; // set search term as null
    this.followUpListArray = this.resetFilterArray; // reset view of table
    this.filterArray = this.resetFilterArray; // reset filter data
    this.incomingList = this.incomingListReset;
    // this.missedcallList = this.missedcallListReset;
    this.outgoingList = this.outgoingListReset;
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    // on destroy
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async getFollowUpTeamFilter(superUserId, userId, firstDay, lastDay) {
    let followUpList: FollowUps[] = [];
    for (let subUser of this.subUsers) {
      if (subUser.reportsToId == userId) {
        let followUps = await this.callViewService.getFollowUpsTeamFilter(
          superUserId,
          subUser.userId,
          firstDay,
          lastDay
        );
        followUpList.push(...followUps);
      }
    }
    let userfollowUp = await this.callViewService.getFollowUpsTeamFilter(
      superUserId,
      userId,
      firstDay,
      lastDay
    );
    followUpList.push(...userfollowUp);
    if (this.view == 'date') {
      this.followUpListArray = followUpList; // for displaying that to table
      this.filterArray = followUpList; // for filteraton

      this.incomingList = [];
      this.incomingList = this.followUpListArray.filter(
        (data) => data.direction == 'Inbound'
      );
      // this.missedcallList = [];
      // this.missedcallList = this.followUpListArray.filter(
      //   (data) => data.direction == 'Missed'
      // );
      this.outgoingList = [];
      this.outgoingList = this.followUpListArray.filter(
        (data) => data.direction == 'Outbound'
      );
      this.isLoaded = true;
    } else {
      this.isLoaded = true;
    }
  }
  changeView(value) {
    this.viewFilter = value;
  }
  onPlayAudio(resourceURL) {
    const dialogRef = this.dialog.open(CallViewAudioPlayerComponent, {
      width: 'auto',
      data: resourceURL,
    });
  }
  // to call the autocall api and pass all the details
  onCallBack(
    customerName,
    direction,
    sourceNumber,
    destinationNumber,
    customerId,
    companyName,
    orgId,
    associatedBranch,
    data
  ) {
    if (direction && sourceNumber && destinationNumber) {
      if (direction == 'Outbound') {
        let minute = new Date().getMinutes();
        let hour = new Date().getHours();
        let startTime = hour + ':' + minute;
        this.commonService
          .onAutoCall(
            sourceNumber,
            destinationNumber,
            this.superUserId,
            this.userId,
            this.userName,
            companyName,
            customerId,
            customerName,
            startTime,
            null,
            this.autoCallToken,
            this.DIDNumber,
            orgId?orgId:'',
            associatedBranch?associatedBranch:'none',
            this.callBridgingExtension,
            this.outboundCallBridgingType,
            data.saleTitle?data.saleTitle:null,
            data.saleId?data.saleId:null,
            data.serviceTitle?data.serviceTitle:null,
            data.serviceId?data.serviceId:null
          )
          .subscribe((data: any) => {
          });
        this._snackBar.open('Initiating Call', '', {
          duration: 2000,
        });
      } else if (direction == 'Inbound') {
        let minute = new Date().getMinutes();
        let hour = new Date().getHours();
        let startTime = hour + ':' + minute;
        this.commonService
          .onAutoCall(
            destinationNumber,
            sourceNumber,
            this.superUserId,
            this.userId,
            this.userName,
            companyName,
            customerId,
            customerName,
            startTime,
            null,
            this.autoCallToken,
            this.DIDNumber,
            orgId?orgId:'',
            associatedBranch?associatedBranch:'none',
            this.callBridgingExtension,
             this.outboundCallBridgingType,
             data.saleTitle?data.saleTitle:null,
             data.saleId?data.saleId:null,
             data.serviceTitle?data.serviceTitle:null,
            data.serviceId?data.serviceId:null
          )
          .subscribe((data: any) => { });
        this._snackBar.open('Initiating Call', '', {
          duration: 2000,
        });
      }
    }
  }
  editCall(followUpData) {
    this.commonService.followUpDetails = followUpData;
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: 'auto',
      disableClose: true,
      data: {
        id: followUpData.customerId, // pass customer id
        companyNames: followUpData.companyName, // pass company name
        customerNames: followUpData.customerName, // pass customer name
        contactNumber: followUpData.contactNumber ? followUpData.contactNumber:'', // pass customer number
        countryCode: followUpData.countryCode ? followUpData.countryCode:'', // pass customer country code
        scenario: 'edit', // scenario for followup popup
        followUpId: followUpData.id, // pass task id
        subUsers: this.subUsers, // pass sub user list
        fname: this.superUserFirstName, // pass super user first name
        lastname: this.superUserSecondName, // pass super user second name
        editFrom: 'table', // pass from  which part the popup is open
      },
    });
  }
}
