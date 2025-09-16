/**********************************************************************************
Description: Component is used create and edit profiles
             Invite, add and remove users under a superuser, edit account type of a user under superuser
             Control access permissions of users under this superuser
             Mobile :- only display and edit account type of a user
CHILDREN :
1. dialog-overview-example.html
   Description: Popup in web and mobile to change account type of a particular user
   Input : Array of Profiles under Superuser, SubUser Details
   Output : updated account type
2. inviting-email.html
   Description: Popup in web to invite a user to join under this super user
   Input : Array of Profiles under Superuser- to invite for one of the profile
   Output : if invited, sending mail and updating in DB
3. subuser-profiles.html
   Description: Popup in web to create / edit user profiles
   Input : existing profile data if in edit mode
   Output : newly created/ updated profile
4. delete-confirmation-subusers.html
   Description: Popup in web to get a confirmation on removing an existing subuser/ cancel an invitation
**********************************************************************************/
import {
  Component,
  OnInit,
  Inject,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  Profile,
  InvitationModel,
  UserAccessDetails,
  SubUsers,
  customFieldNamesData,
  SuperUserProfile,
  AdminProfile,
  SubUserProfile,
  subUsers,
  reportsToModel,
} from './../../data-models';
import { MatTableDataSource } from '@angular/material/table';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { SubusersService } from './subusers.service';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/common.service';
import { UserFeatures } from 'src/app/model/productfeatures.model';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { getCountryCodes } from 'src/app/countryCode';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { ZenysmainaccountService } from 'src/app/zenysmainaccount.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';

// dialog data for update account type
export interface DialogData {
  index: number;
  subId: string;
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  dataAccessRule: string;
  // userRole: string;
  accountType: string;
}

@Component({
  selector: 'app-subusers',
  templateUrl: './subusers.component.html',
  styleUrls: ['./subusers.component.scss'],
})
export class SubusersComponent implements OnInit, OnDestroy {
  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    if (this.profileArray) {
      this.profileArray.paginator = this.paginator;
      this.profileArray.sort = this.sort;
    }
  }

  private onDestroy$: Subject<void> = new Subject<void>(); //on destroy variable

  displayedColumns: string[] = [
    'id',
    'firstname',
    'email',
    'accountType',
    'reportsToName',
    'actions',
  ]; //acctive subuser table
  displayedColumns1: string[] = ['profileName', 'profileDescription']; //default and custom profiles tables
  displayedColumnsBr: string[] = ['name', 'actions']; //branches table
  displayedColumnsInv: string[] = [
    'email',
    'status',
    'accountType',
    'reportsToName',
    'actions',
  ]; //invitations table

  profileArray: any; //mat-table datasource variable for subusers table
  dataSourceInvitations: MatTableDataSource<InvitationModel>; //invitations table
  dataSourceProfiles: any; //profiles table
  dataSourceBranches: any;
  branches = [];

  userPlan: UserFeatures;

  invitations: InvitationModel[] = []; //holds invitations subscribing from DB
  userRole: string; //user role of loggedin user
  accountType: string; //account type of logged in user
  userId: string;
  superUserId: string;
  profiles = []; //array hold the subusers details
  notEdit: boolean = true; //to block direct route for subusers if superuser turned off setting permission
  defaultProfiles = []; //array variable storing the profiles under superuser subscibed data from DB
  usrProfileData: UserAccessDetails; //holds the profile fdetails of restriction applied by superuser
  userName: string; //superusername is saved to mention in the sending emails ot subusers
  superuserEmail: string; //superuseremail is stored to send email to subusers
  superUserData: Profile; //logged ins superuserdata
  userData: Profile; //logged ins user data
  disableAddSubuser: boolean = false; //button to add user is controlled by this variable
  noofSubusers: number = 0; //no of active subusers
  noOfInv: number = 0; //no of invitations
  multiUser: boolean = false; //local boolean variable to check if the user's plan has enabled multiuser
  isSuperUser = false;

  progressBarStatus: boolean = false;
  isTabletsize: Boolean = false;
  isMobilesize: Boolean = false;
  profilesList: string[] = []; //profileslist for mat-select options to change from admin<=>SubUser and so on

  // ProflieDialog var starts

  dialogdataAccessRule: string; //data access rule of particu;lar profile defining in profiles dialog box

  isCheckedCont: boolean = true; //main mat-slide-toggle boolean variable for contact
  isCheckedOrg = true;
  isCheckedSale: boolean = true;
  isCheckedSalesEst: boolean = true;
  isCheckedSalesQuot: boolean = true;
  isCheckedSalesInv: boolean = true;
  isCheckedDashB: boolean = true;
  isCheckedNotes: boolean = true;
  isCheckedFoll: boolean = true;
  isCheckedAtt: boolean = true;
  isCheckedContAtt: boolean = true;
  isCheckedSaleAtt: boolean = true;
  isCheckedServiceAtt: boolean = true;
  isCheckedSett: boolean = true;
  contactsView: boolean = true; //child of mat-slide-toggle variable to permit view Contact
  orgsView = true;
  contactsCreate: boolean = true; //child of mat-slide-toggle variable to permit create
  orgsCreate = true;
  contactsEdit: boolean = true; //child of mat-slide-toggle variable to permit edit
  orgsEdit = true;
  contactsDelete: boolean = true; //child of mat-slide-toggle variable to permit delete
  orgsDelete = true;
  salesView: boolean = true;
  salesCreate: boolean = true;
  salesEdit: boolean = true;
  salesDelete: boolean = true;
  salesDViewEst: boolean = true;
  salesDCreateEst: boolean = true;
  salesDEditEst: boolean = true;
  salesDViewQuot: boolean = true;
  salesDCreateQuot: boolean = true;
  salesDEditQuot: boolean = true;
  salesDViewInv: boolean = true;
  salesDCreateInv: boolean = true;
  salesDEditInv: boolean = true;
  DBView: boolean = true;
  DBDownloadReports: boolean = true;
  notesView: boolean = true;
  notesCreate: boolean = true;
  notesEdit: boolean = true;
  notesDelete: boolean = true;
  follView: boolean = true;
  follCreate: boolean = true;
  follEdit: boolean = true;
  follDelete: boolean = true;
  attView: boolean = true;
  attAdd: boolean = true;
  attRemove: boolean = true;
  contattView: boolean = true;
  contattAdd: boolean = true;
  contattRemove: boolean = true;
  saleattView: boolean = true;
  saleattAdd: boolean = true;
  saleattRemove: boolean = true;
  serviceattView: boolean = true;
  serviceattAdd: boolean = true;
  serviceattRemove: boolean = true;
  settView: boolean = true;
  settEdit: boolean = true;
  DBReportsView: boolean = true;
  collectionsView: boolean = true;
  collectionCreate: boolean = true;
  collectionEdit: boolean = true;
  collectionDelete: boolean = true;
  expView: boolean = true;
  expCreate: boolean = true;
  expEdit: boolean = true;
  expDelete: boolean = true;
  isCheckedColl: boolean = true;
  isCheckedExp: boolean = true;
  isCheckedItems: boolean = true;
  itemsView: boolean = true;
  itemsCreate: boolean = true;
  itemsEdit: boolean = true;
  itemsDelete: boolean = true;
  contactsDownload = true;
  orgsDownload = true;
  salesDownload = true;
  estDownload = true;
  quotDownload = true;
  invDownload = true;
  expDownload = true;
  collDownload = true;
  contactReAssign = true;
  orgReAssign = true;
  saleReAssign = true;
  followUpReAssign = true;
  servicesView: boolean = true;
  servicesCreate: boolean = true;
  servicesEdit: boolean = true;
  servicesDelete: boolean = true;
  servicesDownload = true;
  serviceReAssign = true;
  taskView: boolean = true;
  taskCreate: boolean = true;
  taskEdit: boolean = true;
  taskDelete: boolean = true;
  taskReAssign = true;
  isCheckedService = true;
  isCheckedTask = true;
  contactDataAccessRule = 'All';
  orgDataAccessRule = 'All';
  saleDataAccessRule = 'All';
  serviceDataAccessRule = 'All';
  taskDataAccessRule = 'All';
  followUpDataAccessRule = 'All';
  // ProfileDialog var ends: add in data-model.ts also

  enableOutboundCallsViaCallBridging: boolean = false; //to check for telephony calls enable
  callBridgingServiceProvider: string; //callBridgin service provider
  commonServiceSubscription: Subscription;
  subUsersReporttToArray = [];
  reportsToArray = [];
  plan = '';
  filter: string; //search variable
  lockAccessAutoLogout: boolean = false;
  suspendedArray: any;
  timeZone = '';
  tzOffset = new Date().getTimezoneOffset();

  constructor(
    private snack: MatSnackBar,
    public dialog: MatDialog,
    private subuserService: SubusersService,
    private location: Location,
    public commonService: CommonService,
    public networkCheck: NetworkCheckService,
    private mainaccountserv: ZenysmainaccountService
  ) {}
  ngOnInit(): void {
    this.commonServiceSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        // layout checking
        this.isTabletsize = allData.isTabetSize;
        this.isMobilesize = allData.isMobileSize;
        // userdata and userid fetch from common service
        this.userData = allData.userDetails;
        this.plan = allData.superUserDetails.plan;
        this.userId = allData.userId;
        if (this.userData) {
          // superuserid, account type and userrole is assigning
          this.superUserId = this.userData.superUserId;
          this.userRole = this.userData.userRole;
          this.accountType = this.userData.accountType;
        }
        if (this.userData.superUserId === this.userId) {
          this.isSuperUser = true;
        }

        //check if callbriging is enable
        if (allData.superUserDetails.enableOutboundCallsViaCallBridging) {
          this.enableOutboundCallsViaCallBridging =
            allData.superUserDetails.enableOutboundCallsViaCallBridging;
        }
        //get callBridging service provider name
        if (allData.superUserDetails.callBridgingServiceProvider) {
          this.callBridgingServiceProvider =
            allData.superUserDetails.callBridgingServiceProvider;
        }
        // fetch superuser data from common service
        this.superUserData = allData.superUserDetails;
        if (this.superUserData) {
          // superuser email and name is saved to send invitation
          this.superuserEmail = this.superUserData?.email;
          this.userName =
            this.superUserData.firstname +
            ' ' +
            (this.superUserData.lastname ? this.superUserData.lastname : ' ');

          if (this.superUserData.lockAccessAutoLogout === true) {
            this.lockAccessAutoLogout = true;
            this.displayedColumns.unshift('accessLockAutologout');
          }

          //Check Plan restriction
          //getting the userplan based features
          this.userPlan = this.commonService.getUserPlan();
          if (this.userPlan) {
            if (this.userPlan.multiUser) {
              this.multiUser = true;
            } else {
              this.multiUser = false;
            }
          }
        }

        //get the details of user profile assigned to the user
        this.usrProfileData = allData.usrProfileData;
        if (this.usrProfileData) {
          // disable addSale and sale view
          if (this.usrProfileData.isCheckedSett == false) {
            this.notEdit = true;
          } else {
            if (this.usrProfileData.settView == false) {
              this.notEdit = true;
            } else {
              this.notEdit = false;
            }
          }
        }

        // read subusers from DB, though we get subusers from Common Service, it will be asynchronous,
        // so if we have an invitation and
        // if the user accepts an invitation it wont be under invitation table
        // also it wont be under subuser table if we take subusers from commonservcie
        this.subuserService
          .getsubUsers(this.superUserId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((data) => {
            this.profiles = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as {};
            });

            const filteresProfiles = this.profiles.filter(function (e) {
              return e.status != 'suspended';
            });
            this.noofSubusers = filteresProfiles.length;
            this.profileArray = new MatTableDataSource([]);
            this.profileArray.data = filteresProfiles;
            this.profileArray.sort = this.sort;

            const filteredProfiles = this.profiles.filter(function (e) {
              return e.status === 'suspended';
            });
            this.suspendedArray = new MatTableDataSource([]);
            this.suspendedArray.data = filteredProfiles;

            this.reportsToArray = this.profiles.map(
              ({ userId, firstname, lastname }) => ({
                userId,
                firstname,
                lastname,
              })
            );
            let superuserdetails = {
              firstname: this.userName,
              lastname: '',
              userId: this.superUserId,
            };

            this.reportsToArray.push(superuserdetails);

            for (let i = 0; i < this.profiles.length; i++) {
              if (typeof this.profiles[i].reportsToId === 'undefined') {
                // old data without reports to field
                // update with superuser as reports to person
                // step 1: update in subuser collection
                // step 2: update in invitation collection
                // step 3: update in employee collection if its an employee
                // step 2 and 3 can be done under invitations fetch
                this.subuserService.updateSubUser(
                  this.superUserId,
                  this.profiles[i].id,
                  this.profiles[i].accountType,
                  this.superUserId,
                  this.userName,
                  this.profiles[i].firstname,
                  this.profiles[i].lastname ? this.profiles[i].lastname : '',
                  this.profiles[i].contactNo ? this.profiles[i].contactNo : '',
                  this.profiles[i].email,
                  this.profiles[i].code ? this.profiles[i].code : '',
                  this.profiles[i].branchId ? this.profiles[i].branchId : '',
                  this.profiles[i].branchName
                    ? this.profiles[i].branchName
                    : '',
                  this.profiles[i].extensionNumber
                    ? this.profiles[i].extensionNumber
                    : '',
                  this.profiles[i].callerId ? this.profiles[i].callerId : ''
                );
              }
            }
          });

        // read profiles from DB
        this.subuserService
          .getDefaultProfiles(this.superUserId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((data) => {
            this.defaultProfiles = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as {};
            });
            // for selecting the profile, to create a mat-select we are storing the profile names under this user in an array
            this.profilesList = [];
            let pArray = this.defaultProfiles.map(function (item) {
              return item['profileName'];
            });
            pArray.forEach((value, index) => {
              if (value == 'SuperUser') pArray.splice(index, 1);
            });
            this.profilesList = pArray;
            this.dataSourceProfiles = new MatTableDataSource([]);
            this.dataSourceProfiles.data = this.defaultProfiles;
          });

        // read invitations from DB
        this.subuserService
          .getInvitation(this.superUserId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((data) => {
            this.invitations = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as InvitationModel;
            });
            // check for old data without reportsToId field and update with superuser
            for (let i = 0; i < this.invitations.length; i++) {
              if (
                this.invitations[i].status == 'active' ||
                this.invitations[i].status == 'invited' ||
                this.invitations[i].status == 'declined'
              ) {
                if (typeof this.invitations[i].reportsToId === 'undefined') {
                  this.subuserService.updateInvReportsTo(
                    this.invitations[i].id,
                    this.invitations[i].accountType,
                    this.superUserId,
                    this.userName,
                    this.invitations[i].employeeFName
                      ? this.invitations[i].employeeFName
                      : '',
                    this.invitations[i].employeeLName
                      ? this.invitations[i].employeeLName
                      : '',
                    this.invitations[i].email,
                    this.invitations[i].contactNo
                      ? this.invitations[i].contactNo
                      : '',
                    this.invitations[i].code ? this.invitations[i].code : '',
                    this.invitations[i].branchId
                      ? this.invitations[i].branchId
                      : '',
                    this.invitations[i].branchName
                      ? this.invitations[i].branchName
                      : ''
                  );
                  if (this.invitations[i].crmAccess === true) {
                    this.subuserService.updateATypeInEmpColl(
                      this.superUserId,
                      this.invitations[i].docId,
                      this.invitations[i].accountType,
                      this.superUserId,
                      this.userName,
                      this.invitations[i].employeeFName
                        ? this.invitations[i].employeeFName
                        : '',
                      this.invitations[i].employeeLName
                        ? this.invitations[i].employeeLName
                        : '',
                      this.invitations[i].contactNo
                        ? this.invitations[i].contactNo
                        : '',
                      this.invitations[i].email,
                      this.invitations[i].code ? this.invitations[i].code : ''
                    );
                  }
                }
              }
            }

            this.dataSourceInvitations = new MatTableDataSource([]);
            this.dataSourceInvitations.data = this.invitations.filter(function (
              e
            ) {
              return e.status == 'invited' || e.status == 'declined';
            });
            // active invitations are shown under subuser table here only pending invitation and declined are shown
            // no of invitations are taken to check with the no of the subusers allowed
            this.noOfInv = this.dataSourceInvitations.data.length;
            if (
              this.noofSubusers + this.noOfInv >=
              this.superUserData.noSubusers
            ) {
              this.disableAddSubuser = true;
            }

            this.progressBarStatus = true;
          });

        // read branches from DB
        this.subuserService
          .getBranches(this.superUserId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((data) => {
            this.branches = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as {};
            });
            this.dataSourceBranches = new MatTableDataSource([]);
            this.dataSourceBranches.data = this.branches;
            if (this.branches.length > 0) {
              this.displayedColumns.splice(0, 0, 'branchName');
            }
            this.displayedColumns = this.displayedColumns.filter(
              (el, i, a) => i === a.indexOf(el)
            );
          });
      }
    );
  }

  // search for products function
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.profileArray.filter = filterValue.trim().toLowerCase();
  }

  onBack() {
    this.location.back();
  }
  // edit subuser role : open popup and update account type it accordingly under user and superuser
  openDialog(
    id,
    userId,
    firstname,
    lastname,
    email,
    accountType,
    reportsToId,
    contactNo,
    code,
    branchId,
    extensionNum,
    callerId
  ) {
    let phoneNoArray = []; //array to store contact nos of subusera=s and superuser to check duplication
    phoneNoArray = this.invitations.map((subuser) => Number(subuser.contactNo)); //create an array with subusers phone numbers

    if (!!this.superUserData.phone) {
      phoneNoArray.push(Number(this.superUserData.phone)); //push superusers phone number also into the phone no array
    }

    // removing current contact number
    if (!!contactNo) {
      const currContNoIndex = phoneNoArray.indexOf(contactNo);
      if (currContNoIndex > -1) {
        // only splice array when item is found
        phoneNoArray.splice(currContNoIndex, 1); // 2nd parameter means remove one item only
      }
    }

    let invitationId = '';
    let invDocId = '';
    let invEmployeeStatus = false;
    let arraytoUpdate = [];

    // to update in inv collection
    this.subuserService.getInvitations(email).subscribe((data) => {
      let invit = data.map((e) => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as {}),
        } as InvitationModel;
      });

      if (invit) {
        if (invit[0]) {
          invitationId = invit[0].id;
          (invDocId = invit[0].docId),
            (invEmployeeStatus = invit[0].employeeStatus);
        }
      }
    });

    let existingUsers = this.profiles; //active and suspended subusers

    // subusers in invitation collection
    for (const inv of this.invitations) {
      let element = {
        firstname: inv.employeeFName,
        lastname: inv.employeeLName,
      };
      existingUsers.push(element);
    }

    // superuser name added to already existing users names array
    let supUser = {
      firstname: this.superUserData.firstname,
      lastname: this.superUserData.lastname,
    };
    existingUsers.push(supUser);

    // username array creating with subusers data
    let userNameArray = [];
    const currentuserName = firstname.trim() + ' ' + lastname?.trim();
    for (let subuser of existingUsers) {
      userNameArray.push(
        subuser.firstname.trim() + ' ' + subuser.lastname?.trim()
      );
    }

    // removing current username
    const index = userNameArray.indexOf(currentuserName);
    if (index > -1) {
      // only splice array when item is found
      userNameArray.splice(index, 1); // 2nd parameter means remove one item only
    }

    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      disableClose: true,
      width: '600px',
      data: {
        subId: id,
        id: userId,
        firstname: firstname,
        lastname: lastname,
        email: email,
        profilelist: this.profilesList,
        accountType: accountType,
        reportsToArray: this.reportsToArray,
        selectedReportsTo: reportsToId,
        contactNo: contactNo,
        code: code,
        branches: this.branches,
        selectedBranchId: branchId,
        plan: this.plan,
        existingSubusers: userNameArray,
        extensionNumber: extensionNum,
        callerId: callerId,
        callBridgingServiceProvider: this.callBridgingServiceProvider,
        outBoundCallEnabled: this.enableOutboundCallsViaCallBridging,
        phoneNoArray,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          // if first/last name changed
          if (firstname !== result[2] || lastname !== result[3]) {
            arraytoUpdate = this.profiles.filter((char) => {
              return char.reportsToId === userId;
            });
          }

          const data = {
            id: result[0],
            subId: result[1],
            firstname: result[2],
            lastname: result[3],
            email: result[4],
            accountType: result[5],
            reportsToId: result[6],
            reportsToName: result[7],
            contactNo: result[8] ? result[8] + '' : '',
            code: result[9] ? result[9] : '',
            branchId: result[10] ? result[10] : '',
            branchName: this.branches.find((item) => item.id === result[10])
              ?.name
              ? this.branches.find((item) => item.id === result[10])?.name
              : '',
            extensionNumber: result[12],
            callerId: result[13],
          };
          this.subuserService.updateSubUser(
            this.superUserId,
            data.id,
            data.accountType,
            data.reportsToId,
            data.reportsToName,
            data.firstname,
            data.lastname,
            data.contactNo,
            data.email,
            data.code,
            data.branchId,
            data.branchName,
            data.extensionNumber,
            data.callerId
          );
          this.subuserService.updateUser(
            data.subId,
            this.superUserId,
            data.accountType,
            data.firstname,
            data.lastname,
            data.contactNo,
            data.email,
            data.code
          );

          // new starts here
          // update in inv coll
          this.subuserService.updateInvReportsTo(
            invitationId,
            result[5],
            result[6],
            result[7],
            data.firstname,
            data.lastname,
            data.email,
            data.contactNo,
            data.code,
            data.branchId,
            data.branchName
          );
          if (invEmployeeStatus == true) {
            // update in employee collection
            this.subuserService.updateATypeInEmpColl(
              this.superUserId,
              invDocId,
              result[5],
              result[6],
              result[7],
              data.firstname,
              data.lastname,
              data.contactNo,
              data.email,
              data.code
            );
            // update in inv coll
            // this.subuserService.updateATypeInv(invitationId, result[5]);
          }
          // new ends here

          // if there are users under this subuser, we have to change reports to of that subusers
          arraytoUpdate.forEach((ele) => {
            this.subuserService.onUpdateReportsToName(
              this.superUserId,
              ele.id,
              result[3] ? result[2] + ' ' + result[3] : result[2]
            );
          });

          this.snack.open('Successfully updated', '', {
            duration: 2000,
          });
          // this.updateRowData(data);
        }
      });
  }
  // update row of subuser table if it is not updated
  updateRowData(row_obj) {
    this.profiles = this.profiles.filter((character) => {
      if (character.id === row_obj.id) {
        character.dataAccessRule = row_obj.dataAccessRule;
        // character.userRole = row_obj.userRole;
        character.accountType = row_obj.accountType;
        this.profileArray = this.profiles;
      }
      return true;
    });
  }
  // add new custom profile
  newProfile() {
    const dialogRef1 = this.dialog.open(SubuserProfilesDialog, {
      disableClose: true,
      width: '900px',
      data: {
        scenario: 'create',
        fieldNameContact: this.superUserData.fieldNames.fieldNameContact,
        fieldNameSale: this.superUserData.fieldNames.fieldNameSale,
        fieldNameService: this.superUserData.fieldNames.fieldNameService
          ? this.superUserData.fieldNames.fieldNameService
          : 'Support',
        fieldNameEstimate: this.superUserData.fieldNames.fieldNameEstimate,
        fieldNameQuotation: this.superUserData.fieldNames.fieldNameQuotation,
        fieldNameInvoice: this.superUserData.fieldNames.fieldNameInvoice,
        fieldNameCollection: this.superUserData.fieldNames.fieldNameCollection,
        fieldNameExpense: this.superUserData.fieldNames.fieldNameExpense,
        fieldNameItems: this.superUserData.fieldNames.fieldNameItems,
        fieldNameFollowup: this.superUserData.fieldNames.fieldNameFollowup,
        fieldNameTask: this.superUserData.fieldNames.fieldNameTask,
        profilelist: this.profilesList,
        dialogdataAccessRule: this.dialogdataAccessRule,
        isCheckedCont: this.isCheckedCont,
        isCheckedOrg: this.isCheckedOrg,
        isCheckedSale: this.isCheckedSale,
        isCheckedSalesEst: this.isCheckedSalesEst,
        isCheckedSalesQuot: this.isCheckedSalesQuot,
        isCheckedSalesInv: this.isCheckedSalesInv,
        isCheckedDashB: this.isCheckedDashB,
        isCheckedNotes: this.isCheckedNotes,
        isCheckedFoll: this.isCheckedFoll,
        isCheckedAtt: this.isCheckedAtt,
        isCheckedContAtt: this.isCheckedContAtt,
        isCheckedSaleAtt: this.isCheckedSaleAtt,
        isCheckedServiceAtt: this.isCheckedServiceAtt,
        isCheckedSett: this.isCheckedSett,
        contactsView: this.contactsView,
        orgsView: this.orgsView,
        contactsCreate: this.contactsCreate,
        orgsCreate: this.orgsCreate,
        contactsEdit: this.contactsEdit,
        orgsEdit: this.orgsEdit,
        contactsDelete: this.contactsDelete,
        orgsDelete: this.orgsDelete,
        salesView: this.salesView,
        salesCreate: this.salesCreate,
        salesEdit: this.salesEdit,
        salesDelete: this.salesDelete,
        salesDViewEst: this.salesDViewEst,
        salesDCreateEst: this.salesDCreateEst,
        salesDEditEst: this.salesDEditEst,
        salesDViewQuot: this.salesDViewQuot,
        salesDCreateQuot: this.salesDCreateQuot,
        salesDEditQuot: this.salesDEditQuot,
        salesDViewInv: this.salesDViewInv,
        salesDCreateInv: this.salesDCreateInv,
        salesDEditInv: this.salesDEditInv,
        DBView: this.DBView,
        DBDownloadReports: this.DBDownloadReports,
        notesView: this.notesView,
        notesCreate: this.notesCreate,
        notesEdit: this.notesEdit,
        notesDelete: this.notesDelete,
        follView: this.follView,
        follCreate: this.follCreate,
        follEdit: this.follEdit,
        follDelete: this.follDelete,
        attView: this.attView,
        attAdd: this.attAdd,
        attRemove: this.attRemove,
        contattView: this.contattView,
        contattAdd: this.contattAdd,
        contattRemove: this.contattRemove,
        saleattView: this.saleattView,
        saleattAdd: this.saleattAdd,
        saleattRemove: this.saleattRemove,
        serviceattView: this.serviceattView,
        serviceattAdd: this.serviceattAdd,
        serviceattRemove: this.serviceattRemove,
        settView: this.settView,
        settEdit: this.settEdit,
        isCheckedColl: this.isCheckedColl,
        isCheckedExp: this.isCheckedExp,
        DBReportsView: this.DBDownloadReports,
        collectionsView: this.collectionsView,
        collectionCreate: this.collectionCreate,
        collectionEdit: this.collectionEdit,
        collectionDelete: this.collectionDelete,
        expView: this.expView,
        expCreate: this.expCreate,
        expEdit: this.expEdit,
        expDelete: this.expDelete,
        isCheckedItems: this.isCheckedItems,
        itemsView: this.itemsView,
        itemsCreate: this.itemsCreate,
        itemsEdit: this.itemsEdit,
        itemsDelete: this.itemsDelete,
        contactsDownload: this.contactsDownload,
        orgsDownload: this.orgsDownload,
        salesDownload: this.salesDownload,
        estDownload: this.estDownload,
        quotDownload: this.quotDownload,
        invDownload: this.invDownload,
        expDownload: this.expDownload,
        collDownload: this.collDownload,
        contactReAssign: this.contactReAssign,
        orgReAssign: this.orgReAssign,
        saleReAssign: this.saleReAssign,
        followUpReAssign: this.followUpReAssign,
        servicesView: this.servicesView,
        servicesEdit: this.servicesEdit,
        servicesCreate: this.servicesCreate,
        servicesDelete: this.servicesDelete,
        servicesDownload: this.servicesDownload,
        serviceReAssign: this.serviceReAssign,
        taskCreate: this.taskCreate,
        taskView: this.taskView,
        taskEdit: this.taskEdit,
        taskDelete: this.taskDelete,
        taskReAssign: this.taskReAssign,
        isCheckedService: this.isCheckedService,
        isCheckedTask: this.isCheckedTask,
        contactDataAccessRule: this.contactDataAccessRule,
        orgDataAccessRule: this.orgDataAccessRule,
        saleDataAccessRule: this.saleDataAccessRule,
        serviceDataAccessRule: this.serviceDataAccessRule,
        taskDataAccessRule: this.taskDataAccessRule,
        followUpDataAccessRule: this.followUpDataAccessRule,
      },
    });
    dialogRef1
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          const data = {
            profileName: result[0],
            profileDescription: result[1],
            dialogdataAccessRule: result[2],
            isCheckedCont: result[3],
            isCheckedSale: result[4],
            isCheckedSalesEst: result[5],
            isCheckedSalesQuot: result[6],
            isCheckedSalesInv: result[7],
            isCheckedDashB: result[8],
            isCheckedNotes: result[9],
            isCheckedFoll: result[10],
            isCheckedAtt: result[11],
            isCheckedSett: result[12],
            contactsView: result[13],
            contactsCreate: result[14],
            contactsEdit: result[15],
            contactsDelete: result[16],
            salesView: result[17],
            salesCreate: result[18],
            salesEdit: result[19],
            salesDelete: result[20],
            salesDViewEst: result[21],
            salesDCreateEst: result[22],
            salesDEditEst: result[23],
            salesDViewQuot: result[24],
            salesDCreateQuot: result[25],
            salesDEditQuot: result[26],
            salesDViewInv: result[27],
            salesDCreateInv: result[28],
            salesDEditInv: result[29],
            DBView: result[30],
            DBDownloadReports: result[31],
            notesView: result[32],
            notesCreate: result[33],
            notesEdit: result[34],
            notesDelete: result[35],
            follView: result[36],
            follCreate: result[37],
            follEdit: result[38],
            follDelete: result[39],
            attView: result[40],
            attAdd: result[41],
            attRemove: result[42],
            settView: result[43],
            settEdit: result[44],
            isCheckedColl: result[45],
            isCheckedExp: result[46],
            DBReportsView: result[47],
            collectionsView: result[48],
            collectionCreate: result[49],
            collectionEdit: result[50],
            collectionDelete: result[51],
            expView: result[52],
            expCreate: result[53],
            expEdit: result[54],
            expDelete: result[55],
            isCheckedItems: result[56],
            itemsView: result[57],
            itemsCreate: result[58],
            itemsEdit: result[59],
            itemsDelete: result[60],
            contactsDownload: result[61],
            salesDownload: result[62],
            estDownload: result[63],
            quotDownload: result[64],
            invDownload: result[65],
            expDownload: result[66],
            collDownload: result[67],
            contattView: result[68],
            contattAdd: result[69],
            contattRemove: result[70],
            saleattView: result[71],
            saleattAdd: result[72],
            saleattRemove: result[73],
            serviceattView: result[74],
            serviceattAdd: result[75],
            serviceattRemove: result[76],
            isCheckedContAtt: result[77],
            isCheckedSaleAtt: result[78],
            isCheckedServiceAtt: result[79],
            contactReAssign: result[80],
            saleReAssign: result[81],
            followUpReAssign: result[82],
            servicesView: result[83],
            servicesEdit: result[84],
            servicesCreate: result[85],
            servicesDelete: result[86],
            serviceReAssign: result[87],
            taskReAssign: result[88],
            isCheckedService: result[89],
            isCheckedTask: result[90],
            servicesDownload: result[91],
            contactDataAccessRule: result[92],
            saleDataAccessRule: result[93],
            serviceDataAccessRule: result[94],
            taskDataAccessRule: result[95],
            followUpDataAccessRule: result[96],
            orgDataAccessRule: result[97],
            isCheckedOrg: result[98],
            orgsView: result[99],
            orgsCreate: result[100],
            orgsEdit: result[101],
            orgsDelete: result[102],
            orgsDownload: result[103],
            orgReAssign: result[104],
          };

          this.subuserService.create(this.superUserId, data);
          this.snack.open('Profile created', '', {
            duration: 2000,
          });
        }
      });
  }
  newBranch() {
    const dialogRef = this.dialog.open(DeleteConfirmationSubusers, {
      disableClose: true,
      width: '400px',
      data: {
        scenario: 'add branch',
        branchName: '',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          let branch = {
            name: result.branchName,
          };
          this.subuserService.addNewBranch(this.superUserId, branch);
          this.snack.open('Successfully added', '', {
            duration: 2000,
          });
        }
      });
  }
  editBranch(branch) {
    const dialogRef = this.dialog.open(DeleteConfirmationSubusers, {
      disableClose: true,
      width: '400px',
      data: {
        scenario: 'edit branch',
        branchName: branch.name,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.subuserService.updateBranch(
            this.superUserId,
            branch.id,
            result.branchName
          );
          if (branch.name !== result.branchName) {
            // update in inv and subuser collection
            this.profiles.forEach((ele) => {
              if (ele.branchId === branch.id) {
                this.subuserService.onUpdateBranchName(
                  this.superUserId,
                  ele.id,
                  result.branchName
                );
              }
            });
            this.invitations.forEach((element) => {
              if (element.branchId === branch.id) {
                this.subuserService.updateInvitationBranch(
                  element.id,
                  result.branchName
                );
              }
            });
          }
          this.snack.open('Successfully updated', '', {
            duration: 2000,
          });
        }
      });
  }
  deleteBranch(branch) {
    const dialogRef = this.dialog.open(DeleteConfirmationSubusers, {
      disableClose: true,
      width: '400px',
      data: {
        scenario: 'delete branch',
        branchName: branch.name,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          if (result == 'delete') {
            this.subuserService.removeBranch(this.superUserId, branch.id);
            this.snack.open('Branch deleted', '', {
              duration: 2000,
            });
          }
        }
      });
  }
  // edit an already created profile
  getRecord(row) {
    const dialogRef1 = this.dialog.open(SubuserProfilesDialog, {
      disableClose: true,
      width: '900px',
      data: {
        scenario: 'edit',
        fieldNameContact: this.superUserData.fieldNames.fieldNameContact,
        fieldNameSale: this.superUserData.fieldNames.fieldNameSale,
        fieldNameService: this.superUserData.fieldNames.fieldNameService
          ? this.superUserData.fieldNames.fieldNameService
          : 'Support',
        fieldNameEstimate: this.superUserData.fieldNames.fieldNameEstimate,
        fieldNameQuotation: this.superUserData.fieldNames.fieldNameQuotation,
        fieldNameInvoice: this.superUserData.fieldNames.fieldNameInvoice,
        fieldNameCollection: this.superUserData.fieldNames.fieldNameCollection,
        fieldNameExpense: this.superUserData.fieldNames.fieldNameExpense,
        fieldNameItems: this.superUserData.fieldNames.fieldNameItems,
        fieldNameFollowup: this.superUserData.fieldNames.fieldNameFollowup,
        fieldNameTask: this.superUserData.fieldNames.fieldNameTask,
        profilelist: this.profilesList,
        profileName: row.profileName,
        profileDescription: row.profileDescription,
        dialogdataAccessRule: row.dialogdataAccessRule,
        // voxbayExtensionNumber:
        isCheckedCont:
          typeof row.isCheckedCont === 'undefined' ? true : row.isCheckedCont,
        isCheckedOrg:
          typeof row.isCheckedOrg === 'undefined' ? true : row.isCheckedOrg,
        isCheckedSale:
          typeof row.isCheckedSale === 'undefined' ? true : row.isCheckedSale,
        isCheckedDashB:
          typeof row.isCheckedDashB === 'undefined' ? true : row.isCheckedDashB,
        isCheckedNotes:
          typeof row.isCheckedNotes === 'undefined' ? true : row.isCheckedNotes,
        isCheckedFoll:
          typeof row.isCheckedFoll === 'undefined' ? true : row.isCheckedFoll,
        isCheckedAtt:
          typeof row.isCheckedAtt === 'undefined' ? true : row.isCheckedAtt,
        isCheckedSett:
          typeof row.isCheckedSett === 'undefined' ? true : row.isCheckedSett,
        contactsView:
          typeof row.contactsView === 'undefined' ? true : row.contactsView,
        orgsView: typeof row.orgsView === 'undefined' ? true : row.orgsView,
        contactsCreate:
          typeof row.contactsCreate === 'undefined' ? true : row.contactsCreate,
        orgsCreate:
          typeof row.orgsCreate === 'undefined' ? true : row.orgsCreate,
        contactsEdit:
          typeof row.contactsEdit === 'undefined' ? true : row.contactsEdit,
        orgsEdit: typeof row.orgsEdit === 'undefined' ? true : row.orgsEdit,
        contactsDelete:
          typeof row.contactsDelete === 'undefined' ? true : row.contactsDelete,
        orgsDelete:
          typeof row.orgsDelete === 'undefined' ? true : row.orgsDelete,
        salesView: typeof row.salesView === 'undefined' ? true : row.salesView,
        salesCreate:
          typeof row.salesCreate === 'undefined' ? true : row.salesCreate,
        salesEdit: typeof row.salesEdit === 'undefined' ? true : row.salesEdit,
        salesDelete:
          typeof row.salesDelete === 'undefined' ? true : row.salesDelete,
        DBView: typeof row.DBView === 'undefined' ? true : row.DBView,
        DBDownloadReports:
          typeof row.DBDownloadReports === 'undefined'
            ? true
            : row.DBDownloadReports,
        notesView: typeof row.notesView === 'undefined' ? true : row.notesView,
        notesCreate:
          typeof row.notesCreate === 'undefined' ? true : row.notesCreate,
        notesEdit: typeof row.notesEdit === 'undefined' ? true : row.notesEdit,
        notesDelete:
          typeof row.notesDelete === 'undefined' ? true : row.notesDelete,
        follView: typeof row.follView === 'undefined' ? true : row.follView,
        follCreate:
          typeof row.follCreate === 'undefined' ? true : row.follCreate,
        follEdit: typeof row.follEdit === 'undefined' ? true : row.follEdit,
        follDelete:
          typeof row.follDelete === 'undefined' ? true : row.follDelete,
        attView: typeof row.attView === 'undefined' ? true : row.attView,
        attAdd: typeof row.attAdd === 'undefined' ? true : row.attAdd,
        attRemove: typeof row.attRemove === 'undefined' ? true : row.attRemove,
        settView: typeof row.settView === 'undefined' ? true : row.settView,
        settEdit: typeof row.settEdit === 'undefined' ? true : row.settEdit,
        isCheckedColl:
          typeof row.isCheckedColl === 'undefined' ? true : row.isCheckedColl,
        isCheckedExp:
          typeof row.isCheckedExp === 'undefined' ? true : row.isCheckedExp,
        DBReportsView:
          typeof row.DBReportsView === 'undefined' ? true : row.DBReportsView,
        collectionsView:
          typeof row.collectionsView === 'undefined'
            ? true
            : row.collectionsView,
        collectionCreate:
          typeof row.collectionCreate === 'undefined'
            ? true
            : row.collectionCreate,
        collectionEdit:
          typeof row.collectionEdit === 'undefined' ? true : row.collectionEdit,
        collectionDelete:
          typeof row.collectionDelete === 'undefined'
            ? true
            : row.collectionDelete,
        expView: typeof row.expView === 'undefined' ? true : row.expView,
        expCreate: typeof row.expCreate === 'undefined' ? true : row.expCreate,
        expEdit: typeof row.expEdit === 'undefined' ? true : row.expEdit,
        expDelete: typeof row.expDelete === 'undefined' ? true : row.expDelete,
        isCheckedItems:
          typeof row.isCheckedItems === 'undefined' ? true : row.isCheckedItems,
        itemsView: typeof row.itemsView === 'undefined' ? true : row.itemsView,
        itemsCreate:
          typeof row.itemsCreate === 'undefined' ? true : row.itemsCreate,
        itemsEdit: typeof row.itemsEdit === 'undefined' ? true : row.itemsEdit,
        itemsDelete:
          typeof row.itemsDelete === 'undefined' ? true : row.itemsDelete,
        isCheckedSalesEst:
          typeof row.isCheckedSalesEst === 'undefined'
            ? true
            : row.isCheckedSalesEst,
        isCheckedSalesQuot:
          typeof row.isCheckedSalesQuot === 'undefined'
            ? true
            : row.isCheckedSalesQuot,
        isCheckedSalesInv:
          typeof row.isCheckedSalesInv === 'undefined'
            ? true
            : row.isCheckedSalesInv,
        salesDViewEst:
          typeof row.salesDViewEst === 'undefined' ? true : row.salesDViewEst,
        salesDCreateEst:
          typeof row.salesDCreateEst === 'undefined'
            ? true
            : row.salesDCreateEst,
        salesDEditEst:
          typeof row.salesDEditEst === 'undefined' ? true : row.salesDEditEst,
        salesDViewQuot:
          typeof row.salesDViewQuot === 'undefined' ? true : row.salesDViewQuot,
        salesDCreateQuot:
          typeof row.salesDCreateQuot === 'undefined'
            ? true
            : row.salesDCreateQuot,
        salesDEditQuot:
          typeof row.salesDEditQuot === 'undefined' ? true : row.salesDEditQuot,
        salesDViewInv:
          typeof row.salesDViewInv === 'undefined' ? true : row.salesDViewInv,
        salesDCreateInv:
          typeof row.salesDCreateInv === 'undefined'
            ? true
            : row.salesDCreateInv,
        salesDEditInv:
          typeof row.salesDEditInv === 'undefined' ? true : row.salesDEditInv,
        contactsDownload:
          typeof row.contactsDownload === 'undefined'
            ? true
            : row.contactsDownload,
        orgsDownload:
          typeof row.orgsDownload === 'undefined' ? true : row.orgsDownload,
        salesDownload:
          typeof row.salesDownload === 'undefined' ? true : row.salesDownload,
        estDownload:
          typeof row.estDownload === 'undefined' ? true : row.estDownload,
        quotDownload:
          typeof row.quotDownload === 'undefined' ? true : row.quotDownload,
        invDownload:
          typeof row.invDownload === 'undefined' ? true : row.invDownload,
        expDownload:
          typeof row.expDownload === 'undefined' ? true : row.expDownload,
        collDownload:
          typeof row.collDownload === 'undefined' ? true : row.collDownload,
        isCheckedContAtt:
          typeof row.isCheckedContAtt === 'undefined'
            ? true
            : row.isCheckedContAtt,
        isCheckedSaleAtt:
          typeof row.isCheckedSaleAtt === 'undefined'
            ? true
            : row.isCheckedSaleAtt,
        isCheckedServiceAtt:
          typeof row.isCheckedServiceAtt === 'undefined'
            ? true
            : row.isCheckedServiceAtt,
        contattView:
          typeof row.contattView === 'undefined' ? true : row.contattView,
        contattAdd:
          typeof row.contattAdd === 'undefined' ? true : row.contattAdd,
        contattRemove:
          typeof row.contattRemove === 'undefined' ? true : row.contattRemove,
        saleattView:
          typeof row.saleattView === 'undefined' ? true : row.saleattView,
        saleattAdd:
          typeof row.saleattAdd === 'undefined' ? true : row.saleattAdd,
        saleattRemove:
          typeof row.saleattRemove === 'undefined' ? true : row.saleattRemove,
        serviceattView:
          typeof row.serviceattView === 'undefined' ? true : row.serviceattView,
        serviceattAdd:
          typeof row.serviceattAdd === 'undefined' ? true : row.serviceattAdd,
        serviceattRemove:
          typeof row.serviceattRemove === 'undefined'
            ? true
            : row.serviceattRemove,
        contactReAssign:
          typeof row.contactReAssign === 'undefined'
            ? true
            : row.contactReAssign,
        orgReAssign:
          typeof row.orgReAssign === 'undefined' ? true : row.orgReAssign,
        saleReAssign:
          typeof row.saleReAssign === 'undefined' ? true : row.saleReAssign,
        followUpReAssign:
          typeof row.followUpReAssign === 'undefined'
            ? true
            : row.followUpReAssign,
        servicesView:
          typeof row.servicesView === 'undefined' ? true : row.servicesView,
        servicesEdit:
          typeof row.servicesEdit === 'undefined' ? true : row.servicesEdit,
        servicesCreate:
          typeof row.servicesCreate === 'undefined' ? true : row.servicesCreate,
        servicesDelete:
          typeof row.servicesDelete === 'undefined' ? true : row.servicesDelete,
        servicesDownload:
          typeof row.servicesDownload === 'undefined'
            ? true
            : row.servicesDownload,
        serviceReAssign:
          typeof row.serviceReAssign === 'undefined'
            ? true
            : row.serviceReAssign,
        taskReAssign:
          typeof row.taskReAssign === 'undefined' ? true : row.taskReAssign,
        isCheckedService:
          typeof row.isCheckedService === 'undefined'
            ? true
            : row.isCheckedService,
        isCheckedTask:
          typeof row.isCheckedTask === 'undefined' ? true : row.isCheckedTask,
        contactDataAccessRule:
          typeof row.contactDataAccessRule === 'undefined'
            ? row.dialogdataAccessRule
            : row.contactDataAccessRule,
        orgDataAccessRule:
          typeof row.orgDataAccessRule === 'undefined'
            ? row.dialogdataAccessRule
            : row.orgDataAccessRule,
        saleDataAccessRule:
          typeof row.saleDataAccessRule === 'undefined'
            ? row.dialogdataAccessRule
            : row.saleDataAccessRule,
        serviceDataAccessRule:
          typeof row.serviceDataAccessRule === 'undefined'
            ? row.dialogdataAccessRule
            : row.serviceDataAccessRule,
        taskDataAccessRule:
          typeof row.taskDataAccessRule === 'undefined'
            ? row.dialogdataAccessRule
            : row.taskDataAccessRule,
        followUpDataAccessRule:
          typeof row.followUpDataAccessRule === 'undefined'
            ? row.dialogdataAccessRule
            : row.followUpDataAccessRule,
      },
    });
    dialogRef1
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.subuserService.updateProfiles(
            this.superUserId,
            row.id,
            result[0],
            result[1],
            result[2],
            result[3],
            result[4],
            result[5],
            result[6],
            result[7],
            result[8],
            result[9],
            result[10],
            result[11],
            result[12],
            result[13],
            result[14],
            result[15],
            result[16],
            result[17],
            result[18],
            result[19],
            result[20],
            result[21],
            result[22],
            result[23],
            result[24],
            result[25],
            result[26],
            result[27],
            result[28],
            result[29],
            result[30],
            result[31],
            result[32],
            result[33],
            result[34],
            result[35],
            result[36],
            result[37],
            result[38],
            result[39],
            result[40],
            result[41],
            result[42],
            result[43],
            result[44],
            result[45],
            result[46],
            result[47],
            result[48],
            result[49],
            result[50],
            result[51],
            result[52],
            result[53],
            result[54],
            result[55],
            result[56],
            result[57],
            result[58],
            result[59],
            result[60],
            result[61],
            result[62],
            result[63],
            result[64],
            result[65],
            result[66],
            result[67],
            result[68],
            result[69],
            result[70],
            result[71],
            result[72],
            result[73],
            result[74],
            result[75],
            result[76],
            result[77],
            result[78],
            result[79],
            result[80],
            result[81],
            result[82],
            result[83],
            result[84],
            result[85],
            result[86],
            result[87],
            result[88],
            result[89],
            result[90],
            result[91],
            result[92],
            result[93],
            result[94],
            result[95],
            result[96],
            result[97],
            result[98],
            result[99],
            result[100],
            result[101],
            result[102],
            result[103],
            result[104]
          );
          if (row.profileName != result[0]) {
            // find the subusers with that profie name and update it at user, subuser, invitation level
            // if an employee update in employee collection also
            for (let i = 0; i < this.profiles.length; i++) {
              if (this.profiles[i].accountType == row.profileName) {
                // update in subuser collection of superuser
                this.subuserService.updateSubUserAcc(
                  this.superUserId,
                  this.profiles[i].id,
                  result[0]
                );
                this.subuserService.updateUserAcc(
                  this.profiles[i].userId,
                  result[0]
                );
              }
            }
            for (let i = 0; i < this.invitations.length; i++) {
              if (this.invitations[i].accountType == row.profileName) {
                this.subuserService.updateATypeInv(
                  this.invitations[i].id,
                  result[0]
                );
                if (this.invitations[i].employeeStatus == true) {
                  this.subuserService.updateEmloyeeAcc(
                    this.superUserId,
                    this.invitations[i].docId,
                    result[0]
                  );
                }
              }
            }
          }
          this.snack.open('Profile updated', '', {
            duration: 2000,
          });
        }
      });
  }
  // add new subuser-sending email invitation
  newSubUser() {
    let existingUsers = this.profiles; //active and suspended subusers
    let phoneNoArray = []; //array to store contact nos of subusera=s and superuser to check duplication
    phoneNoArray = this.invitations.map((subuser) => Number(subuser.contactNo)); //create an array with subusers phone numbers

    if (!!this.superUserData.phone) {
      phoneNoArray.push(Number(this.superUserData.phone)); //push superusers phone number also into the phone no array
    }
    // subusers in invitation collection
    for (const inv of this.invitations) {
      let element = {
        firstname: inv.employeeFName,
        lastname: inv.employeeLName,
      };
      existingUsers.push(element);
    }

    // superuser name added to already existing users names array
    let supUser = {
      firstname: this.superUserData.firstname,
      lastname: this.superUserData.lastname,
    };
    existingUsers.push(supUser);

    const dialogRef = this.dialog.open(InvitingEmail, {
      disableClose: true,
      width: '600px',
      data: {
        profilelist: this.profilesList,
        reportsToArray: this.reportsToArray,
        branches: this.branches,
        plan: this.plan,
        existingSubusers: existingUsers,
        callBridgingEnabled: this.enableOutboundCallsViaCallBridging,
        callBridgingProvider: this.callBridgingServiceProvider,
        phoneNoArray,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result[10] && result[10]?.length > 5) {
          // test starts here

          const firebaseApp = firebase.default.initializeApp(
            environment.firebaseConfig,
            'signupInstance'
          );

          firebaseApp
            .auth()
            .createUserWithEmailAndPassword(result[0], result[10])
            .then((userCredential) => {
              // Signed in
              firebaseApp.delete();

              var user = userCredential.user;

              const uName = result[5] ? result[4] + ' ' + result[5] : result[4];

              // 1. save in invitation collection
              // 2.user profile updation with firstname, superuserid. acctype and all
              // 3. subuser collection of superuser
              const invitationDetails = {
                email: result[0],
                superUserId: this.superUserId,
                userName: this.userName,
                superUserEmail: this.superuserEmail,
                accountType: result[1],
                status: 'active',
                reportsToId: result[2],
                reportsToName: result[3],
                employeeFName: result[4],
                employeeLName: result[5],
                contactNo: result[6] ? result[6] + '' : '',
                code: result[6] ? result[7] : '',
                branchId: result[8],
                branchName: result[9],
                extensionNumber: result[11] ? result[11] : null,
                callerId: result[12] ? result[12] : '',
              };

              const subUserDetails = {
                userId: user.uid,
                accountType: result[1],
                email: result[0],
                firstname: result[4],
                lastname: result[5] ? result[5] : '',
                reportsToId: result[2],
                reportsToName: result[3],
                contactNo: result[6],
                code: result[7],
                branchId: result[8] ? result[8] : '',
                branchName: result[9] ? result[9] : '',
                status: 'active',
                extensionNumber: result[11] ? result[11] : null,
                callerId: result[12] ? result[12] : null,
              };

              const form1 = {
                firstname: result[4],
                lastname: result[5] ? result[5] : '',
                countryCode: result[7],
                phone: result[6],
                company: this.superUserData.company,
                category: this.superUserData.category,
                categoryOthers: this.superUserData.categoryOthers,
              };

              this.subuserService.invitation(invitationDetails);

              this.subuserService.addSubUser(this.superUserId, subUserDetails);

              // users timezone field is saved along with other datas
              if (
                typeof Intl === 'object' &&
                typeof Intl.DateTimeFormat === 'function'
              ) {
                this.timeZone =
                  Intl.DateTimeFormat().resolvedOptions().timeZone;
                const ct = require('countries-and-timezones');
                this.tzOffset = ct.getTimezone(this.timeZone);
              }
              this.subuserService.createDefaultProfileSub(
                this.timeZone,
                this.tzOffset,
                'free',
                user.uid,
                user.email,
                result[4],
                result[1],
                result[5] ? result[5] : '',
                this.superUserId,
                result[6] + '',
                result[7],
                this.superUserData.company ? this.superUserData.company : '',
                this.superUserData.category ? this.superUserData.category : '',
                this.superUserData.categoryOthers
                  ? this.superUserData.categoryOthers
                  : null
              );

              // if all other data write to Db successed and now we have to write new fieldnames
              const customf = customFieldNamesData.data;
              this.subuserService.createCustomFieldNames(customf, user.uid);

              //Once the user basic profile is created, then add the user profile documents (Superuser, admin and subuser settings)
              //  Datas of 3 Default Profiles from data-model.ts
              let superUserProfileData = SuperUserProfile.data;
              let AdminProfileData = AdminProfile.data2;
              let SubUserProfileData = SubUserProfile.data3;
              // adding SuperUser profile to DB
              this.subuserService.createProfiles(
                superUserProfileData,
                user.uid
              );

              // adding Admin profile to DB
              this.subuserService.createProfiles(AdminProfileData, user.uid);

              // adding SubUser profile to DB
              this.subuserService.createProfiles(SubUserProfileData, user.uid);

              // add sample contact, sale, service, task and followup
              // addDefaultPipeline after this only add sample contact/sale and service should be called
              this.commonService.addDefaultPipeline(user.uid, this.superUserData.category);
              //.report
              this.commonService.addSampleReport(user.uid, this.superUserData.category);
              // dashboard report
              this.commonService.addSampleDashBoardReport(user.uid);
              // 1.contact
              this.commonService.addSampleContact(uName, user.uid);
              // 2.sale
              this.commonService.addSampleSale(uName, user.uid);
              // 3.service
              this.commonService.addSampleService(uName, user.uid);
              // 4.task
              this.commonService.addSampleTask(uName, user.uid);
              // 5.followup
              this.commonService.addSampleCall(uName, user.uid);
              // 6.organisation
              this.commonService.addSampleOrg(uName, user.uid);
              // 7.email templates
              this.commonService.addEmailTemp1(user.uid);
              this.commonService.addEmailTemp2(user.uid);
              this.commonService.addEmailTemp3(user.uid);
              this.commonService.addEmailTemp4(user.uid);
              this.commonService.addEmailTemp5(user.uid);
              // 8.add automations
              this.commonService.addAutom1(user.uid, this.superUserData.category);
              this.commonService.addAutom2(user.uid);
              this.commonService.addAutom3(user.uid);
              this.commonService.addAutom4(user.uid);
              this.commonService.addAutom5(user.uid, this.superUserData.category);
              this.commonService.addAutom6(user.uid);
              this.commonService.addAutom7(user.uid);

              //Once a new user is added, create a contact in Zenys account
              this.mainaccountserv
                .createCustomer(user.uid, form1, user.email, null)
                .then(() => {
                  this.mainaccountserv.updateContactSequenceNumber();
                  //console.log("saved to zenys")
                });
            })
            .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              firebaseApp.delete();
              // Catch this errorCode to know if user exists
              if (errorCode === 'auth/email-already-in-use') {
                var errMessage = `${errorMessage} Please contact Zenys support to add this user`
                this.dialog.open(ConfirmationpopupComponent, {
                  width: '400px',
                  data: {
                    smode: 'errorMessage',
                    message: errMessage
                  },
                });
                return;
              }else if (errorCode == 'auth/weak-password') {
                this.dialog.open(ConfirmationpopupComponent, {
                  width: '400px',
                  data: {
                    smode: 'errorMessage',
                    message: errorMessage
                  },
                });
              } else {
                this.dialog.open(ConfirmationpopupComponent, {
                  width: '400px',
                  data: {
                    smode: 'errorMessage',
                    message: errorMessage
                  },
                });
              }
            });

          // test ends here
        } else {
          let email = result[0];
          let accountType = result[1];
          let link = 'https://crm.zenys.org/login';
          //2 DB operations- sending mail, adding under invitation collection
          // .then is used since we need to make one more DB write based on th result
          this.subuserService
            .sendEmail({
              to: email,
              template: {
                name: 'invitingSubUser',
                data: {
                  userName: this.userName,
                  accountType: accountType,
                  link: link,
                },
              },
            })
            .then((res) => {
              let invitationDetails = {
                email: email,
                superUserId: this.superUserId,
                userName: this.userName,
                superUserEmail: this.superuserEmail,
                accountType: accountType,
                status: 'invited',
                reportsToId: result[2],
                reportsToName: result[3],
                employeeFName: result[4],
                employeeLName: result[5],
                contactNo: result[6] ? result[6] + '' : '',
                code: result[6] ? result[7] : '',
                branchId: result[8],
                branchName: result[9],
                extensionNumber: result[11] ? result[11] : null,
                callerId: result[12] ? result[12] : null,
              };
              this.subuserService.invitation(invitationDetails);

              this.snack.open('Invitation send', '', {
                duration: 2000,
              });
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
    });
  }
  // remove from SubuserList
  remove(user) {
    // confirmation popup
    const dialogRef = this.dialog.open(DeleteConfirmationSubusers, {
      disableClose: true,
      width: '400px',
      data: {
        scenario: 'remove user',
        name: `${user.firstname} ${user.lastname}`,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          if (result == 'delete') {
            // disable button check
            this.noofSubusers--;
            if (
              this.noofSubusers + this.noOfInv !=
              this.superUserData.noSubusers
            ) {
              this.disableAddSubuser = false;
            }
            // table updating
            if (this.profileArray.data) {
              this.profileArray.data = this.profileArray.data.filter(
                (character) => {
                  return character.id != user.id;
                }
              );
            }
            // invitation id
            let invitationId;
            let employeeStatus;
            let docId;

            // this for loop has to be changed
            for (let i = 0; i < this.invitations.length; i++) {
              if (this.invitations[i].email == user.email) {
                if (this.invitations[i].status == 'active') {
                  invitationId = this.invitations[i].id;
                  docId = this.invitations[i].docId;
                  if (this.invitations[i].employeeStatus === true) {
                    employeeStatus = true;
                  }
                }
              }
            }
            //4 DB operations-removing subuser from superusrr list, remove from invitation collection, sending mail,updating at user level
            // we are using .then since we need to do some other operation based on the result from one Db operation
            // checked it with removing then then email is not sending, so put back that .then
            this.subuserService.removeSubUser(this.superUserId, user.id);
            if (employeeStatus == true) {
              this.subuserService.updateInvitationEmp(invitationId, user.email);
              // update in employee collection also
              this.subuserService.updateInEmpColl(this.superUserId, docId);
            } else {
              this.subuserService.removeInv(invitationId);
            }
            this.subuserService.sendEmail({
              to: user.email,
              template: {
                name: 'removeSubUser',
                data: {
                  userName: this.userName,
                },
              },
            });
            this.subuserService
              .upsateSubUserDetails(user.userId)
              .then((resp) => {
                //check for CRMAccess field in user - employee as a subuser scenario
                this.subuserService
                  .getUser(user.userId)
                  .pipe(takeUntil(this.onDestroy$))
                  .subscribe((data) => {
                    if (data.CRMAccess === true) {
                      this.subuserService.upsateSubUserDetailsEmployee(
                        user.userId,
                        this.superUserId
                      );
                    }
                  });
              });

            this.snack.open('Subuser removed', '', {
              duration: 2000,
            });
          }
        }
      });
  }
  // suspend user function
  async suspend(user) {
    // check if contact is assigned
    let contactData = await this.subuserService.getContactWithSubsuer(
      this.superUserId,
      user.userId
    );
    // if sale is assigned
    let saleData = await this.subuserService.getSaleWithSubsuer(
      this.superUserId,
      user.userId
    );
    // if service is assigned
    let supportData = await this.subuserService.getSupportWithSubsuer(
      this.superUserId,
      user.userId
    );
    // any of sale/service/contact is assigned to this user

      // confirmation popup
      const dialogRef = this.dialog.open(DeleteConfirmationSubusers, {
        disableClose: true,
        width: '400px',
        data: {
          scenario: 'suspend user',
          name: `${user.firstname} ${user.lastname}`,
          contactDataLength: contactData.length,
          saleDataLength: saleData.length,
          supportDataLength: supportData.length,
          fieldNameContact: this.superUserData.fieldNames.fieldNameContact,
          fieldNameSale: this.superUserData.fieldNames.fieldNameSale,
          fieldNameService: this.superUserData.fieldNames.fieldNameService
        },
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          if (result) {
            if (result == 'delete') {
              this.noofSubusers--;
              if (
                this.noofSubusers + this.noOfInv !=
                this.superUserData.noSubusers
              ) {
                this.disableAddSubuser = false;
              }

              // starts
              const invit = this.invitations.find(
                (item) => item.email === user.email
              );

              this.subuserService.updateInvitationEmpSuspend(
                invit.id,
                user.email
              );
              this.subuserService.suspendSubUser(this.superUserId, user.id);
              this.subuserService.sendEmail({
                to: user.email,
                template: {
                  name: 'removeSubUser',
                  data: {
                    userName: this.userName,
                  },
                },
              });

              this.subuserService
                .upsateSubUserDetails(user.userId)
                .then((resp) => {
                  //check for CRMAccess field in user - employee as a subuser scenario
                  this.subuserService
                    .getUser(user.userId)
                    .pipe(takeUntil(this.onDestroy$))
                    .subscribe((data) => {
                      if (data.CRMAccess === true) {
                        this.subuserService.upsateSubUserDetailsEmployee(
                          user.userId,
                          this.superUserId
                        );
                      }
                    });
                });

              this.snack.open('User suspended', '', {
                duration: 2000,
              });

              // ends
            }
          }
        });

  }
  reActivate(user) {
    // confirmation popup
    const dialogRef = this.dialog.open(DeleteConfirmationSubusers, {
      disableClose: true,
      width: '400px',
      data: {
        scenario: 're-Activate user',
        name: `${user.firstname} ${user.lastname}`,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          if (result == 'delete') {
            this.noofSubusers++;
            if (
              this.noofSubusers + this.noOfInv !=
              this.superUserData.noSubusers
            ) {
              this.disableAddSubuser = false;
            }

            // starts
            const invit = this.invitations.find(
              (item) => item.email === user.email
            );

            this.subuserService.updateInvitationEmpActivate(
              invit.id,
              user.email,
              user.accountType,
              user.reportsToId,
              user.reportsToName
            );
            this.subuserService.activateSubUser(this.superUserId, user.id);
            this.subuserService.sendEmail({
              to: user.email,
              template: {
                name: 'confirmInvitation',
                data: {
                  userName: this.userName,
                  accountType: user.accountType,
                },
              },
            });

            this.subuserService
              .reActivateSubUserDetails(
                user.userId,
                user.accountType,
                this.superUserId
              )
              .then((resp) => {
                //check for CRMAccess field in user - employee as a subuser scenario
                this.subuserService
                  .getUser(user.userId)
                  .pipe(takeUntil(this.onDestroy$))
                  .subscribe((data) => {
                    if (data.CRMAccess === false) {
                      this.subuserService.activateSubUserDetailsEmployee(
                        user.userId,
                        this.superUserId
                      );
                    }
                  });
              });

            this.snack.open('User added', '', {
              duration: 2000,
            });

            // ends
          }
        }
      });
  }
  enableAcc(subuser) {
    this.subuserService
      .enableatUser(subuser.userId)
      .then((resp) => {
        this.subuserService.enablesubUser(this.superUserId, subuser.id);
      })
      .then((response) => {
        this.snack.open('User account enabled', '', {
          duration: 2000,
        });
      });
  }
  // remove from invitation
  removeInv(invit) {
    // confiration popup
    const dialogRef = this.dialog.open(DeleteConfirmationSubusers, {
      disableClose: true,
      width: '400px',
      data: {
        scenario: 'remove inv',
        name: `${invit.email}`,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          if (result == 'delete') {
            this.noOfInv--;
            if (
              this.noofSubusers + this.noOfInv !=
              this.superUserData.noSubusers
            ) {
              this.disableAddSubuser = false;
            }
            if (invit.employeeStatus == true) {
              this.subuserService.updateInvitationEmp(invit.id, invit.email);
              // update in employee collection also
              this.subuserService.updateInEmpColl(
                this.superUserId,
                invit.docId
              );
            } else {
              this.subuserService.removeInv(invit.id);
            }
            this.snack.open('Invitation cancelled', '', {
              duration: 2000,
            });
          }
        }
      });
  }
  // ngonDestroy
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
// Editing Subuser Details PopUp selector
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./subusers.component.scss'],
})
export class DialogOverviewExampleDialog {
  reportsToValue;
  selectedReportsToId = '';
  selectedReportsToName = '';
  branchValue;
  selectedBranchId = '';
  selectedBranchName = '';
  contactNo = '';
  extensionNum: string = '';
  callerId: string = '';
  CountryCodes = getCountryCodes.CountryCodes; //countrycodes from countrycodes.ts
  public defaultCode = ''; //default countrycode is assigned to India
  disableOnUserName = false; //to disable Invite button if username already exists
  disableOnCOntNo = false; // to disable Invite button if contact number already exists

  // reports to autocomplete variables
  myControl = new FormControl(); //form control to check value changes
  options: reportsToModel[] = []; //array created from reports to users
  reportsTo: reportsToModel = null; //selected reporrts to local variable
  filteredOptions: Observable<reportsToModel[]>; //filtered array from reports to array

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    public commonService: CommonService,
    public networkCheck: NetworkCheckService
  ) {
    if (data) {
      // create options array from reports to array
      this.options = data.reportsToArray.map((item) => {
        let container: reportsToModel = {
          userId: '',
          name: '',
        };

        container.userId = item.userId;
        container.name = item.lastname
          ? item.firstname + ' ' + item.lastname
          : item.firstname;

        return container;
      });

      // according to value changes, filtered array
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name as string) : this.options.slice();
        })
      );

      this.reportsToValue = data.selectedReportsTo;
      this.selectedReportsToId = data.selectedReportsTo;
      this.branchValue = data.selectedBranchId;
      this.selectedBranchId = data.selectedBranchId;
      this.contactNo = data.contactNo ? data.contactNo : '';
      this.defaultCode = data.code ? data.code : '';
      this.extensionNum = data.extensionNumber ? data.extensionNumber : '';
      this.callerId = data.callerId ? data.callerId : '';

      for (let i = 0; i < data.reportsToArray.length; i++) {
        if (this.selectedReportsToId == data.reportsToArray[i].userId) {
          this.selectedReportsToName = data.reportsToArray[i].lastname
            ? data.reportsToArray[i].firstname +
              ' ' +
              data.reportsToArray[i].lastname
            : data.reportsToArray[i].firstname;
        }
      }
      // local variable defining
      this.reportsTo = {
        userId: this.selectedReportsToId,
        name: this.selectedReportsToName,
      };
    }
  }

  // autocomplete reports to display fn
  displayFn(user: reportsToModel): string {
    return user && user.name ? user.name : '';
  }

  // autocomplete filter function w.r.t name
  private _filter(name: string): reportsToModel[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  // fn to check for already existing username
  checkUserName() {
    const uName = this.data.firstname.trim() + ' ' + this.data.lastname?.trim();
    if (this.data.existingSubusers.includes(uName)) {
      this.disableOnUserName = true;
    } else {
      this.disableOnUserName = false;
    }
  }
  // contact number duplication check
  checkContactNo() {
    if (this.data.phoneNoArray.includes(this.contactNo)) {
      this.disableOnCOntNo = true; //if already exists disable invite button
    } else {
      this.disableOnCOntNo = false; //else make the boolean false
    }
  }
  //code to searchbale feld
  countryCodeEventHander($event: any) {
    this.defaultCode = $event;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  reportsToSelected(profile) {
    this.selectedReportsToId = profile.userId;
    this.selectedReportsToName = profile.name;
  }
  // clear button fn in reports to autocomplete
  clearValue() {
    this.myControl.reset();
    this.selectedReportsToId = '';
    this.selectedReportsToName = '';
  }
  branchSelected(branch) {
    this.selectedBranchId = branch.id;
    this.selectedBranchName = branch.name;
  }
}
// subuser profiles start here
@Component({
  selector: 'subuser-profiles-dialog',
  templateUrl: 'subuser-profiles-dialog.html',
  styleUrls: ['./subusers.component.scss'],
})
export class SubuserProfilesDialog {
  isEdit: boolean = true;
  profileList = [];
  disableSubmit: boolean = false;
  scenario: string = '';

  constructor(
    public dialogRef1: MatDialogRef<SubuserProfilesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snack: MatSnackBar,
    public commonService: CommonService,
    public networkCheck: NetworkCheckService
  ) {
    this.scenario = data.scenario;
    if (data.scenario == 'edit' && data.profileName == 'SuperUser') {
      this.isEdit = false;
    }
    if (data.scenario == 'create') {
      this.profileList = data.profilelist;
    } else if (data.scenario == 'edit') {
      this.profileList = data.profilelist;
      for (var i = 0; i < this.profileList.length; i++) {
        if (this.profileList[i] === data.profileName) {
          this.profileList.splice(i, 1);
        }
      }
    }
  }
  fn(data1) {
    if (this.profileList.includes(data1)) {
      this.snack.open('Same Profile Name Exists', '', {
        duration: 2000,
      });
      this.disableSubmit = true;
    } else if (data1 == 'SuperUser') {
      this.snack.open('Same Profile Name Exists', '', {
        duration: 2000,
      });
      this.disableSubmit = true;
    } else {
      this.disableSubmit = false;
    }
  }
  contactsSett($event: any) {
    $event.stopPropagation();
  }
  onNoClick1(): void {
    this.dialogRef1.close();
  }
}
// inviting email
@Component({
  selector: 'inviting-email',
  templateUrl: 'inviting-email.html',
  styleUrls: ['./subusers.component.scss'],
})
export class InvitingEmail {
  password = '';
  email = '';
  fName = '';
  lName = '';
  cNo = '';
  extensionNum: string = '';
  callerId: string = '';
  disableInvite: boolean = false;
  disableInv = false; //reportsTo
  disableInvit = false; //branch
  reportsToValue;
  branchValue;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  selectedReportToId = '';
  selectedReportToName = '';
  selectedBranchId = '';
  selectedBranchName = '';
  disableOnUserName = false; //to disable Invite button if username already exists
  userNameArray: string[] = []; //array to hold already existing subusers names

  // reports to autocomplete variables
  myControl = new FormControl(); //form control to check value changes
  options: reportsToModel[] = []; //array created from reports to users
  filteredOptions: Observable<reportsToModel[]>; //filtered array from reports to array

  disableOnCOntNo = false; // to disable Invite button if contact number already exists
  CountryCodes = getCountryCodes.CountryCodes; //countrycodes from countrycodes.ts
  public defaultCode = this.CountryCodes[97].dial_code; //default countrycode is assigned to India
  constructor(
    public dialogRef: MatDialogRef<InvitingEmail>,
    @Inject(MAT_DIALOG_DATA) public data,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService
  ) {
    if (!!data) {
      // create options array from reports to array
      this.options = data.reportsToArray.map((item) => {
        let container: reportsToModel = {
          userId: '',
          name: '',
        };

        container.userId = item.userId;
        container.name = item.lastname
          ? item.firstname + ' ' + item.lastname
          : item.firstname;

        return container;
      });

      // according to value changes, filtered array
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name as string) : this.options.slice();
        })
      );

      // array creating with subusers data from data passed to dialog
      this.userNameArray = [];
      for (let subuser of this.data.existingSubusers) {
        this.userNameArray.push(
          subuser.firstname.trim() + ' ' + subuser.lastname?.trim()
        );
      }
    }
  }
  // autocomplete reports to display fn
  displayFn(user: reportsToModel): string {
    return user && user.name ? user.name : '';
  }

  // autocomplete filter function w.r.t name
  private _filter(name: string): reportsToModel[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  // fn to check for already existing username
  checkUserName() {
    const uName = this.fName.trim() + ' ' + this.lName?.trim();
    if (this.userNameArray.includes(uName)) {
      this.disableOnUserName = true;
    } else {
      this.disableOnUserName = false;
    }
  }
  // contact number duplication check
  checkContactNo() {
    if (this.data.phoneNoArray.includes(this.cNo)) {
      this.disableOnCOntNo = true; //if already exists disable invite button
    } else {
      this.disableOnCOntNo = false; //else make the boolean false
    }
  }
  //code to searchbale feld
  countryCodeEventHander($event: any) {
    this.defaultCode = $event;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  selected() {
    this.disableInvite = true;
  }
  reportsToSelected(profile) {
    this.disableInv = true;
    this.selectedReportToId = profile.userId;
    this.selectedReportToName = profile.name;
  }
  // clear button fn in reports to autocomplete
  clearValue() {
    this.myControl.reset();
    this.selectedReportToId = '';
    this.selectedReportToName = '';
    this.disableInv = false;
  }
  branchSelected(branch) {
    this.disableInvit = true;
    this.selectedBranchId = branch.id;
    this.selectedBranchName = branch.name;
  }
}
// delete confirmation
@Component({
  selector: 'delete-confirmation-subusers',
  templateUrl: 'delete-confirmation-subusers.html',
  styleUrls: ['./subusers.component.scss'],
})
export class DeleteConfirmationSubusers {
  delete = 'delete';
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationSubusers>,
    @Inject(MAT_DIALOG_DATA) public data,
    public networkCheck: NetworkCheckService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
