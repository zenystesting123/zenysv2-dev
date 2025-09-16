import { CreateloadingService } from './createloading.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { NetworkCheckService } from '../networkcheck.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  InvitationModel,
  AdminProfile,
  customFieldNamesData,
  ExpenseCategories,
  SubUserProfile,
  SuperUserProfile,
  Profile,
} from '../data-models';
import { CommonService } from '../common.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-createloading',
  templateUrl: './createloading.component.html',
  styleUrls: ['./createloading.component.scss'],
})
export class CreateloadingComponent implements OnInit {
  private userID: string = '';
  profile: Observable<any>;
  profileSubscription: Subscription;
  userName: string;
  loading: any;
  crmAccess = false;
  userEmail = '';
  saleStatus: any = [
    'Inquiry',
    'Opportunity',
    'Confirmed',
    'Sale-Completed',
    'Lost/Dropped',
  ];
  customerStatus: any = [
    'Lead',
    'Prospect',
    'Opportunity',
    'Customer-Won',
    'Lost/Rejected',
  ];
  customerStatusOpn: string =
    'Lead,Prospect,Opportunity,Customer-Won,Lost/Rejected';
  saleStatusOpn: string =
    'Inquiry,Opportunity,Confirmed,Sale-Completed,Lost/Dropped';
    taskStatusOpn: any = ['Open','Completed']
  custLeadOpn: string = 'Online,Offline';
  custLead: any = ['Online', 'Offline'];
  date = new Date().getTime();
  freeDateend = new Date();
  plan: string = 'free';
  ExpensecategoryList: any;
  firstName = '';
  lastName = '';
  superUserId = '';
  docId = '';
  accType = '';
  phone = '';
  code = '';
  company = '';
  category = '';
  categoryOthers = '';

  correspondingInvitation: InvitationModel = null; //invitation corresponding to the logged in mail
  notInvited = false; //not present in invitation collection
  correspondingUser: Profile = null; //document in user collection corresponding to the logged in users id
  dispalyName = '';
  private onDestroy$: Subject<void> = new Subject<void>(); //on destroy variable
  timeZone = '';
  tzOffset = new Date().getTimezoneOffset();
  accCreationTime: number = null; //acc created time
  timeNow: number = null; //time at the moment of checking

  constructor(
    public _firebaseAuth: AngularFireAuth,
    public router: Router,
    private db: CreateloadingService,
    private netCheck: NetworkCheckService,
    private snack: MatSnackBar,
    private commonService: CommonService
  ) {
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        if (allData.authDetails) {
          const user = allData.authDetails;
          if (user) {
            this.accCreationTime = user.metadata.a; //from auth details, assign creation time
            this.userID = user.uid;
            this.userEmail = user.email;
            this.dispalyName = user.displayName;
            // do procdures
            if(!!user.email && !!user.uid){
              this.doProcedures(user.email, user.uid);
            }
          }
        }
      });
  }

  async doProcedures(loggedInMail, loggedInId) {
    // step 1: check for existing user
    this.correspondingUser = await this.checkInUser(loggedInId);

    // step2: check in invitation collection with this mail
    await this.checkInInvitation(loggedInMail); //wait for invitation check
    if (this.netCheck.isConnectionAvailable) {
      // users timezone field is saved along with other datas
      if (
        typeof Intl === 'object' &&
        typeof Intl.DateTimeFormat === 'function'
      ) {
        this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const ct = require('countries-and-timezones');
        this.tzOffset = ct.getTimezone(this.timeZone);
      }
      if (this.correspondingUser) {
        // existingUser case
        if (
          this.correspondingUser.existingUser == undefined ||
          !this.correspondingUser.existingUser ||
          this.correspondingUser?.existingUser == null
        ) {
          this.router.navigate(['/create-profile']); //route to create profile page
        } else {
          if (
            !this.correspondingInvitation ||
            this.correspondingInvitation == null ||
            typeof this.correspondingInvitation == 'undefined'
          ) {
            //no ivitation present
            this.router.navigate(['/dash/home']);
          } else {
            // invitation present scenario

            //check for employeeStatus
            if (this.correspondingInvitation.employeeStatus == true) {
              if (this.correspondingInvitation.crmAccess == false) {
                //employee with no CRM access
                this.router.navigate([
                  '/attendancemanagement/attendance-marking',
                ]);
              } else {
                if (this.correspondingInvitation.status == 'invited') {
                  //employee with CRM access
                  this.router.navigate(['/create-sub-profile']);
                } else {
                  //we have to check if user profile is locked/not
                  if (this.correspondingUser.accessLockAutologout === true) {
                    this.router.navigate(['/user-login-locked']);
                  } else {
                    this.router.navigate(['/dash/home']);
                  }
                }
              }
            } else {
              //not an employee - normal subUser scenario
              if (this.correspondingInvitation.status == 'invited') {
                this.router.navigate(['/create-sub-profile']);
              } else {
                this.router.navigate(['/dash/home']);
              }
            }
          }
        }
      } else {
        // new user case
        if (
          !this.correspondingInvitation ||
          this.correspondingInvitation == null ||
          typeof this.correspondingInvitation == 'undefined'
        ) {
          //no ivitation present
          // check strictly if new user
          this.timeNow = new Date().getTime(); //need to get GMT time to calculate the difference
          const timeDiff = this.timeNow - this.accCreationTime;
          if (timeDiff > 40000) {
            // already a user, must be firebase connection issue
            this.router.navigate(['/dash/home']);
          } else {
            this.router.navigate(['/create-profile']);
          }
        } else {
          // invitation present
          // case of invitation present and new user, we have details of first name , last name and all
          // prepopulate and confirm for accept/decline or employee case

          await this.callSuperUserDetails();

          if (this.correspondingInvitation.employeeStatus == true) {
            let docId = this.correspondingInvitation.docId;
            let employeeID = loggedInId;
            this.db.setEmployeeIDFn(this.superUserId, docId, employeeID);
            await this.writeToDB();
            if (this.crmAccess == true) {
              this.router.navigate(['/create-sub-profile']);
            } else {
              this.router.navigate([
                '/attendancemanagement/attendance-marking',
              ]);
            }
          } else {
            // not an employee
            // check for subuser
            if (this.correspondingInvitation.status == 'invited') {
              // write to DB
              await this.writeToDBSub();
              this.router.navigate(['/create-sub-profile']);
            } else {
              this.router.navigate(['/create-profile']);
            }
          }
        }
      }
    } else {
      this._firebaseAuth.signOut();
      this.router.navigate(['']);
      window.location.reload();
      this.snack.open(
        'There seems to be network issues, pls check your connection',
        '',
        {
          duration: 2000,
        }
      );
    }
  }

  callSuperUserDetails() {
    return new Promise<void>((resolve) => {
      this.db
        .getUser(this.superUserId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((superUserData) => {
          this.company = superUserData.company ? superUserData.company : '';
          this.category = superUserData.category ? superUserData.category : '';
          this.categoryOthers = superUserData.categoryOthers
            ? superUserData.categoryOthers
            : '';
          resolve();
        });
    });
  }

  checkInInvitation(mail) {
    return new Promise<void>((resolve) => {
      this.db
        .getInvitations(mail)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((inv) => {
          let doc = inv.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as InvitationModel;
          });
          if (doc) {
            if (doc[0]) {
              this.correspondingInvitation = doc[0];
              this.firstName = this.correspondingInvitation.employeeFName;
              this.crmAccess = this.correspondingInvitation.crmAccess;
              this.accType = this.correspondingInvitation.accountType;
              this.lastName = this.correspondingInvitation.employeeLName;
              this.superUserId = this.correspondingInvitation.superUserId;
              this.phone = this.correspondingInvitation.contactNo
                ? this.correspondingInvitation.contactNo + ''
                : '';
              this.code = this.correspondingInvitation.code
                ? this.correspondingInvitation.code + ''
                : '';
            }
          }
          resolve();
        });
    });
  }

  // checkInUser(userId) {
  //   return new Promise<void>((resolve) => {
  //     this.profile = this.db.getUserDetails(userId);
  //     this.profileSubscription = this.profile.subscribe((prof) => {
  //       this.correspondingUser = prof;

  //       resolve();
  //     });
  //   });
  // }
  async checkInUser(userId): Promise<Profile> {
    return await this.db.getUserDetails(userId);
  }
  writeToDB() {
    this.ExpensecategoryList = this.getCategory();

    if (this.crmAccess == false) {
      this.accType = 'SuperUser';
    }

    this.db
      .createDefaultProfile(
        this.timeZone,
        this.tzOffset,
        this.date,
        this.saleStatus,
        this.customerStatus,
        this.plan,
        this.freeDateend,
        this.customerStatusOpn,
        this.saleStatusOpn,
        this.taskStatusOpn,
        this.custLeadOpn,
        this.custLead,
        this.ExpensecategoryList,
        this.userID,
        this.userEmail,
        this.firstName,
        this.crmAccess,
        this.accType,
        this.lastName,
        this.superUserId,
        this.phone,
        this.code,
        this.company,
        this.category,
        this.categoryOthers
      )
      .then((response) => {
        // if all other data write to Db successed and now we have to write new fieldnames
        let customf = customFieldNamesData.data;
        this.db.createCustomFieldNames(customf, this.userID).then((res) => {});
      })
      .then((r) => {
        //Once the user basic profile is created, then add the user profile documents (Superuser, admin and subuser settings)
        //  Datas of 3 Default Profiles from data-model.ts
        let superUserProfileData = SuperUserProfile.data;
        let AdminProfileData = AdminProfile.data2;
        let SubUserProfileData = SubUserProfile.data3;
        // adding SuperUser profile to DB
        this.db.create(superUserProfileData, this.userID).catch((e) => {
          console.log(e);
        });
        // adding Admin profile to DB
        this.db.create(AdminProfileData, this.userID).catch((e) => {
          console.log(e);
        });
        // adding SubUser profile to DB
        this.db.create(SubUserProfileData, this.userID).catch((e) => {
          console.log(e);
        });
      });
  }

  writeToDBSub() {
    this.ExpensecategoryList = this.getCategory();

    let fName;
    let lName;

    if (this.firstName?.length > 0) {
      fName = this.firstName;
    } else {
      fName = this.dispalyName;
    }

    if (this.lastName?.length > 0) {
      lName = this.lastName;
    } else {
      lName = '';
    }

    this.db
      .createDefaultProfileSub(
        this.timeZone,
        this.tzOffset,
        this.date,
        this.saleStatus,
        this.customerStatus,
        this.plan,
        this.freeDateend,
        this.customerStatusOpn,
        this.saleStatusOpn,
        this.taskStatusOpn,
        this.custLeadOpn,
        this.custLead,
        this.ExpensecategoryList,
        this.userID,
        this.userEmail,
        fName,
        this.accType,
        lName,
        this.superUserId,
        this.phone,
        this.code,
        this.company,
        this.category,
        this.categoryOthers
      )
      .then((response) => {
        // if all other data write to Db successed and now we have to write new fieldnames
        let customf = customFieldNamesData.data;
        this.db.createCustomFieldNames(customf, this.userID).then((res) => {});
      })
      .then((r) => {
        //Once the user basic profile is created, then add the user profile documents (Superuser, admin and subuser settings)
        //  Datas of 3 Default Profiles from data-model.ts
        let superUserProfileData = SuperUserProfile.data;
        let AdminProfileData = AdminProfile.data2;
        let SubUserProfileData = SubUserProfile.data3;
        // adding SuperUser profile to DB
        this.db.create(superUserProfileData, this.userID).catch((e) => {
          console.log(e);
        });
        // adding Admin profile to DB
        this.db.create(AdminProfileData, this.userID).catch((e) => {
          console.log(e);
        });
        // adding SubUser profile to DB
        this.db.create(SubUserProfileData, this.userID).catch((e) => {
          console.log(e);
        });
      });
  }

  getCategory(): string[] {
    let cat = new ExpenseCategories();
    return cat.categories;
  }

  ngOnInit() {}

  // ngonDestroy
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.profileSubscription?.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
