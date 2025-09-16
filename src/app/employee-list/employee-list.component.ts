/**********************************************************************************
Description: Component is used to display list of employees under this superuser
             Only for Web
Inputs:
Outputs:

CHILD:employee-crud.html
Description: Component is used for CRUD operations on Single employee details
**********************************************************************************/
import { DOCUMENT, Location } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Subscription } from 'rxjs';
import { CommonService } from '../common.service';
import {
  InvitationModel,
  EmployeeGender,
  EmployeeModel,
  employeeSite,
  EmployeeStatus,
  Profile,
  SubUserAccTypes,
  Upload,
  SubUsers,
} from '../data-models';
import { NetworkCheckService } from '../networkcheck.service';
import { EmployeeListService } from './employee-list.service';
import * as firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { ConfirmationpopupComponent } from '../confirmationpopup/confirmationpopup.component';
import { takeUntil } from 'rxjs/operators';
import { getCountryCodes } from '../countryCode';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort; //sort for mat-table
  @ViewChild(MatPaginator) paginator: MatPaginator; //paginator for mat-table
  superUserId = ''; //superusers id
  userDetailsSubscription: Subscription; //common service subscription
  employeeSubscription: Subscription; //employee subsciption fromDB
  employees: EmployeeModel[] = []; //array holding fetched employee datas
  progressBarStatus = false; //progress bar status
  dataSource: MatTableDataSource<EmployeeModel>; //mat-table data for employee list
  displayedColumns: string[] = [
    'employeeID',
    'employeeFirstName',
    'designation',
    'officialEmail',
    'contactNo',
  ]; //mat-table columns for employee-list

  employeeEmail = ''; //email to which mail to be send while adding a new employee
  userName = ''; //to specify senders name in mail
  settingsConfigured = false; //only allow superuser to add employees after settings configured
  employeeNo = ''; //employee prefix + employee starting number
  employeeNoIn = 0; //employee starting number under super user profile
  superuserDetails: Profile = null; //local variable to hold super user details
  IDTemplate = ''; //template to be selected for printing ID card

  // super user company name and address for printing in ID card
  companyName = '';
  addLine1 = '';
  addLine2 = '';
  addCity = '';
  addState = '';
  addCountry = '';
  addPIN = '';

  logoSrc: string | ArrayBuffer = null;
  userId = '';
  userEmail = '';
  allowedNoOfSubUsers = 0;
  superUserEmail = '';
  subUserList: SubUsers[] = [];
  invLength = 0;
  subId = '';
  docId = '';
  corrInvitation: InvitationModel = null;
  corrInvId = '';
  invsUnderThisSuperUser: InvitationModel[] = [];
  invitationStatus = false;
  invitation: InvitationModel = null;
  invitationStatus2 = false;
  invitation2: InvitationModel = null;

  private onDestroy$: Subject<void> = new Subject<void>(); //on destroy variable

  constructor(
    private location: Location,
    public networkCheck: NetworkCheckService,
    private dialog: MatDialog,
    private serviceInstance: EmployeeListService,
    private _snack: MatSnackBar,
    public commonService: CommonService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        this.superUserId = allData.userDetails.superUserId;

        this.userId = allData.userId;
        this.userEmail = allData.userDetails.email;

        this.superuserDetails = allData.superUserDetails;
        this.superUserEmail = allData.superUserDetails.email;

        this.userName =
          this.superuserDetails.firstname +
          ' ' +
          (this.superuserDetails.lastname
            ? this.superuserDetails.lastname
            : '');

        this.companyName = this.superuserDetails.company;
        this.addLine1 = this.superuserDetails.street1;
        this.addLine2 = this.superuserDetails.street2;
        this.addCity = this.superuserDetails.city;
        this.addState = this.superuserDetails.state;
        this.addCountry = this.superuserDetails.country;
        this.addPIN = this.superuserDetails.pincode;

        this.serviceInstance
          .getsubUsers(this.superUserId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((data) => {
            this.subUserList = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as SubUsers;
            });
          });

        this.serviceInstance
          .getInvitationsSuperUser(this.superUserEmail)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((data) => {
            this.invsUnderThisSuperUser = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as InvitationModel;
            });

            let filteredInv = this.invsUnderThisSuperUser.filter(function (e) {
              return (
                e.status == 'invited' ||
                e.status == 'declined' ||
                e.status == 'active'
              );
            });
            this.invLength = filteredInv?.length;

            if (this.invLength > 0) {
              this.allowedNoOfSubUsers =
                allData.superUserDetails.noSubusers - this.invLength;
            } else {
              this.allowedNoOfSubUsers = allData.superUserDetails.noSubusers;
            }
          });

        if (
          this.superuserDetails.logo &&
          this.superuserDetails.logoStatus == true
        ) {
          const userStorageRef1 = firebase.default
            .storage()
            .ref()
            .child('logo/' + this.superUserId);
          userStorageRef1.getDownloadURL().then((url1) => {
            this.logoSrc = url1;
          });
        }

        // check if settings are configured
        if (!this.superuserDetails.employeeNoInit) {
          this.settingsConfigured = false;
        } else {
          this.settingsConfigured = true;
          this.IDTemplate = this.superuserDetails.employeeIDTemp;
          this.employeeNoIn = this.superuserDetails.employeeNoInit;
          if (!this.superuserDetails.employeePrefix) {
            this.employeeNo = `${this.superuserDetails.employeeNoInit}`;
          } else {
            this.employeeNo = `${this.superuserDetails.employeePrefix}-${this.superuserDetails.employeeNoInit}`;
          }
        }

        this.employeeSubscription = this.serviceInstance
          .getEmployees(this.superUserId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((employees) => {
            this.employees = employees.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as EmployeeModel;
            });

            this.dataSource = new MatTableDataSource([]);
            this.dataSource.data = this.employees;
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.progressBarStatus = true;
          });
      }
    );
  }

  onBack() {
    this.location.back();
  }

  // add a new Employee
  addEmployee() {
    const dialogRef = this.dialog.open(EmployeeCrud, {
      width: '800px',
      disableClose: true,
      data: {
        scenario: 'add',
        settingsConfigured: this.settingsConfigured,
        superUserId: this.superUserId,
        subuserArray: this.subUserList,
        superUserName: this.userName,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          let date = new Date().getTime();
          this.employeeEmail = result[6];

          this.serviceInstance
            .getEmployeeDetails(result[6])
            .toPromise()
            .then((response) => {
              if (response.empty) {
                //check for same email in invitation collection
                let inv = this.invsUnderThisSuperUser.filter(function (e) {
                  return e.email == result[6];
                });

                if (inv?.length > 0) {
                  this.invitation = inv[0];
                  this.invitationStatus = true; //already a subuser/invited subuser case
                }

                // => new email
                // check for no of subusers and CRMaccess condition
                if (
                  result[27] == true &&
                  this.allowedNoOfSubUsers == 0 &&
                  this.invitationStatus == false
                ) {
                  this.dialog.open(ConfirmationpopupComponent, {
                    width: '300px',
                    data: {
                      smode: 'noOfSubsusers',
                    },
                  });
                } else {
                  let newEmployee = {
                    employeeFirstName: result[0],
                    employeeSecondName: result[1],
                    dateOfBirth: result[2],
                    gender: result[3],
                    contactNo: result[4] ? result[4] + '' : '',
                    personalEmail: result[5],
                    officialEmail: result[6],
                    emergencyContactPerson: result[7],
                    emergencyContactNo: result[8],
                    commAddLine1: result[9],
                    commAddLine2: result[10],
                    commAddDist: result[11],
                    commAddState: result[12],
                    commAddCountry: result[13],
                    commAddZip: result[14],
                    permAddLine1: result[15],
                    permAddLine2: result[16],
                    permAddDist: result[17],
                    permAddState: result[18],
                    permAddCountry: result[19],
                    permAddZip: result[20],
                    status: result[21],
                    dateOfJoining: result[22],
                    exitDate: result[23],
                    designation: result[24],
                    bloodGroup: result[25],
                    imageURL: result[26],
                    createdDate: date,
                    employeeNo: this.employeeNo,
                    superUsrId: this.superUserId,
                    CRMAccess: result[27],
                    accType: result[28],
                    reportsToId: result[29],
                    reportsToName: result[30],
                    code: result[31] ? result[31] : '',
                  };
                  this.serviceInstance
                    .addEmployee(this.superUserId, newEmployee) //save in employee collection
                    .then((res) => {
                      this.docId = res.id;
                      this.serviceInstance
                        .saveDocId(this.superUserId, res.id) //id is saving as docId-a field inside document
                        .then((r) => {
                          //send mail with attendance-login if no crm access
                          if (result[27] == false) {
                            // send Email to employee in his official mail
                            let link = employeeSite.SITE_LOGIN; //decided at data-model

                            this.serviceInstance
                              .sendEmail({
                                to: this.employeeEmail,
                                template: {
                                  name: 'emailToEmployee',
                                  data: {
                                    userName: this.userName,
                                    link: link,
                                  },
                                },
                              })
                              .then((res) => {
                                let invitationDetails = {
                                  email: this.employeeEmail,
                                  superUserId: this.superUserId,
                                  userName: this.userName,
                                  superUserEmail: this.superuserDetails.email,
                                  employeeStatus: true,
                                  employeeFName: result[0],
                                  employeeLName: result[1],
                                  crmAccess: false,
                                  docId: this.docId,
                                  accountType: null,
                                  status: null,
                                  contactNo: result[4] ? result[4] + '' : '',
                                  code: result[31] ? result[31] : '',
                                };
                                if (this.invitationStatus == true) {
                                  // update in subuser and user collection if already a subuser
                                  let subUserDetails = this.subUserList.filter(
                                    (el) => {
                                      return el.email == result[6];
                                    }
                                  );

                                  if (subUserDetails) {
                                    if (subUserDetails[0]) {
                                      this.subId = subUserDetails[0].id;
                                      let uId = subUserDetails[0].userId;
                                      if (uId) {
                                        this.serviceInstance.updateAddUserFieldsCRMFalse(
                                          uId,
                                          result[0],
                                          result[1] ? result[1] : '',
                                          result[4] ? result[4] + '' : '',
                                          result[15],
                                          result[16],
                                          result[17],
                                          result[18],
                                          result[19],
                                          result[20],
                                          result[28],
                                          result[29],
                                          result[30],
                                          result[31] ? result[31] : ''
                                        );
                                        this.serviceInstance.removeSubUser(
                                          this.superUserId,
                                          this.subId
                                        );
                                      }
                                    }
                                  }
                                  this.serviceInstance
                                    .updateInvitationCRMFalse(
                                      this.invitation.id,
                                      result[0],
                                      result[1],
                                      this.docId
                                    )
                                    .then((resp) => {
                                      this._snack.open('Invitation send', '', {
                                        duration: 2000,
                                      });
                                    });
                                } else {
                                  this.serviceInstance
                                    .invitation(invitationDetails)
                                    .then((resp) => {
                                      this._snack.open('Invitation send', '', {
                                        duration: 2000,
                                      });
                                    });
                                }
                              })
                              .catch((e) => {
                                console.log(e);
                              });
                          } else {
                            //send email with crm login

                            let email = result[6];
                            let accountType = result[28];

                            //link has to be changed such that the success login dont need to go to create profile since all details are there
                            let link = 'https://crm.zenys.org/login';

                            //2 DB operations- sending mail, adding under invitation collection
                            // .then is used since we need to make one more DB write based on th result
                            this.serviceInstance
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
                                  superUserEmail: this.superuserDetails.email,
                                  accountType: accountType,
                                  status: 'invited',
                                  employeeStatus: true,
                                  employeeFName: result[0],
                                  employeeLName: result[1],
                                  crmAccess: true,
                                  docId: this.docId,
                                  reportsToId: result[29],
                                  reportsToName: result[30],
                                  contactNo: result[4] ? result[4] + '' : '',
                                  code: result[31] ? result[31] : '',
                                };
                                if (this.invitationStatus == true) {
                                  // update in subuser and user collection if already a subuser

                                  let subUserDetails = this.subUserList.filter(
                                    (el) => {
                                      return el.email == result[6];
                                    }
                                  );

                                  if (subUserDetails) {
                                    if (subUserDetails[0]) {
                                      this.subId = subUserDetails[0].id;
                                      this.serviceInstance.updateSubUser(
                                        this.superUserId,
                                        this.subId,
                                        result[28],
                                        result[29],
                                        result[30],
                                        result[0],
                                        result[1] ? result[1] : '',
                                        result[4] ? result[4] + '' : '',
                                        result[31] ? result[31] : ''
                                      );

                                      if (subUserDetails[0].userId) {
                                        this.serviceInstance.updateAddUserFields(
                                          subUserDetails[0].userId,
                                          result[0],
                                          result[1] ? result[1] : '',
                                          result[4] ? result[4] + '' : '',
                                          result[15],
                                          result[16],
                                          result[17],
                                          result[18],
                                          result[19],
                                          result[20],
                                          result[28],
                                          result[29],
                                          result[30],
                                          result[31] ? result[31] : ''
                                        );
                                      }
                                    }
                                  }

                                  this.serviceInstance
                                    .updateInvitationCRMTrue(
                                      this.invitation.id,
                                      result[0],
                                      result[1],
                                      this.docId,
                                      accountType,
                                      result[29],
                                      result[30],
                                      result[4] ? result[4] + '' : '',
                                      result[31] ? result[31] : ''
                                    )
                                    .then((resp1) => {
                                      this._snack.open('Invitation send', '', {
                                        duration: 2000,
                                      });
                                    });
                                } else {
                                  this.serviceInstance
                                    .invitation(invitationDetails)
                                    .then((resp2) => {
                                      this._snack.open('Invitation send', '', {
                                        duration: 2000,
                                      });
                                    });
                                }
                              })
                              .catch((e) => {
                                console.log(e);
                              });
                          }
                        });
                    })
                    .then((r) => {
                      //update employee no under super user details to increment
                      this.serviceInstance.updateEmployeeNo(
                        this.superUserId,
                        this.employeeNoIn
                      );
                    })
                    .then((resp) => {
                      //success message
                      this._snack.open('Employee added', '', {
                        duration: 2000,
                      });
                    })
                    .catch((e) => {
                      this._snack.open('Failed to add Employee', '', {
                        duration: 2000,
                      });
                    });
                }
              } else {
                this.dialog.open(ConfirmationpopupComponent, {
                  width: '300px',
                  data: {
                    smode: 'Emailalreadyexists',
                  },
                });
              }
            });
        }
      });
  }
  // row selected to view/edit an existing employee
  rowSelected(row) {
    let employeeMail = row.officialEmail;
    let CRMAccessValue = row.CRMAccess;

    let subUserDetails = this.subUserList.filter((el) => {
      return el.email == row.officialEmail;
    });

    if (subUserDetails) {
      if (subUserDetails[0]) {
        this.subId = subUserDetails[0].id;
      }
    }

    // we have to find the invitation id corresponding to this employee in inv collection
    this.serviceInstance
      .getInvitationsdocId(row.docId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        let invit = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as InvitationModel;
        });

        if (invit) {
          if (invit[0]) {
            this.corrInvitation = invit[0];
            this.corrInvId = invit[0].id;
          }
        }
      });

    const dialogRef = this.dialog.open(EmployeeCrud, {
      width: '800px',
      disableClose: true,
      data: {
        scenario: 'view',
        employeeDetails: row,
        employeeIDTemp: this.IDTemplate,
        companyName: this.companyName,
        addLine1: this.addLine1,
        addLine2: this.addLine2,
        addCity: this.addCity,
        addState: this.addState,
        addCountry: this.addCountry,
        addPIN: this.addPIN,
        logoSrc: this.logoSrc,
        superUserId: this.superUserId,
        subuserArray: this.subUserList,
        superUserName: this.userName,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          // STEP 1: if email is changed
          // 1: check email is available
          // 2: CRM Access : allowed no of subusers check

          // STEP 2: email is not changed
          // 1.check CRM access
          // a. if false: send employeemail, update in invitation
          // b. if true: send subuser mail, update in invitation
          // 3.we have deleted user withn old email, check in invitation collection for this deleted mail data
          // a.if status is active: remove from superusers subuser collection, and from invitation collection
          // b.if status is invited: remove from inv collection
          // c:if status is declined: remove from inv collection
          // step 3: email is not changed but CRM access changed
          // a. if CRM acces updated to true: send subuser mail, update in invitation
          // step 4: any way the name and details are updated by superuser,
          // a.if such an employee exists, it must reflect in their doc under users collection
          // b. check for user exists, and update if exists
          // updation completed
          if (row.officialEmail != result[6]) {
            //if email is changed

            this.serviceInstance
              .getEmployeeDetails(result[6])
              .toPromise()
              .then((response) => {
                if (response.empty) {
                  //check for same email in invitation collection
                  let inv = this.invsUnderThisSuperUser.filter(function (e) {
                    return e.email == result[6];
                  });

                  if (inv?.length > 0) {
                    this.invitation2 = inv[0];
                    this.invitationStatus2 = true; //already
                  }
                  //no such email exists good to go
                  if (
                    row.CRMAccess == false &&
                    result[27] == true &&
                    this.allowedNoOfSubUsers == 0 &&
                    this.invitationStatus2 == false //earlier CRMAccess is false, now it is true, check for allowed no of subusers
                  ) {
                    this.dialog.open(ConfirmationpopupComponent, {
                      width: '300px',
                      data: {
                        smode: 'noOfSubsusers',
                      },
                    });
                  } else {
                    //check if new email is already existing and then update if no doc present with current email and
                    // step1: update new data in employee callection under superuser
                    // step 2: this is email changed scenario => 1.delete the old user,
                    // 2.check CRM access
                    // a. if false: send employeemail, update in invitation
                    // b. if true: send subuser mail, update in invitation
                    // 3.we have deleted user withn old email, check in invitation collection for this deleted mail data
                    // a.if status is active: remove from superusers subuser collection,
                    // step 3: email is not changed but CRM access changed
                    // a. if CRM acces updated to true: send subuser mail, update in invitation
                    // step 4: any way the name and details are updated by superuser,
                    // a.if such an employee exists, it must reflect in their doc under users collection
                    // b. check for user exists, and update if exists
                    // updation completed

                    this.serviceInstance
                      .updateEmployee(
                        this.superUserId,
                        row.id,
                        result[0],
                        result[1],
                        result[2] ? result[2] : null,
                        result[3],
                        result[4] ? result[4] + '' : '',
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
                        result[22] ? result[22] : null,
                        result[23] ? result[23] : null,
                        result[24],
                        result[25],
                        result[26],
                        result[27],
                        result[28],
                        result[29],
                        result[30],
                        result[31] ? result[31] : ''
                      )
                      .then((res) => {
                        // we can delete the old a/c
                        this.serviceInstance
                          .deleteUser(row.employeeID)
                          .then((re) => {
                            // check invitation for status
                            if (this.corrInvitation.status == 'active') {
                              this.serviceInstance.removeSubUser(
                                row.superUsrId,
                                this.subId
                              );
                            }
                          })
                          .then((resp) => {
                            // send Email to employee in his official mail if email is changed
                            if (result[27] == false) {
                              // send Email to employee in his personal mail
                              let link = employeeSite.SITE_LOGIN; //decided at data-model

                              this.serviceInstance
                                .sendEmail({
                                  to: this.employeeEmail,
                                  template: {
                                    name: 'emailToEmployee',
                                    data: {
                                      userName: this.userName,
                                      link: link,
                                    },
                                  },
                                })
                                .then((res) => {
                                  // update invitation corresponding to employee
                                  this.serviceInstance.updateInvitationEmp(
                                    this.corrInvId,
                                    result[6],
                                    result[0],
                                    result[1] ? result[1] : '',
                                    result[4] ? result[4] + '' : '',
                                    result[31] ? result[31] : ''
                                  );
                                  if (this.invitationStatus2 == true) {
                                    // delete invitation corresponding to the subuser
                                    this.serviceInstance.removeInv(
                                      this.invitation2.id
                                    );
                                  }
                                })
                                .catch((e) => {
                                  console.log(e);
                                });
                            } else {
                              //send email with crm login

                              let email = result[6];
                              let accountType = result[28];

                              //link has to be changed such that the success login dont need to go to create profile since all details are there
                              let link = 'https://crm.zenys.org/login';

                              //2 DB operations- sending mail, adding under invitation collection
                              // .then is used since we need to make one more DB write based on th result
                              this.serviceInstance
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
                                  this.serviceInstance.updateInvitationSub(
                                    this.corrInvId,
                                    accountType,
                                    result[6],
                                    result[29],
                                    result[30],
                                    result[0],
                                    result[1] ? result[1] : '',
                                    result[4] ? result[4] + '' : '',
                                    result[31] ? result[31] : ''
                                  );

                                  if (this.invitationStatus2 == true) {
                                    // delete invitation corresponding to the subuser
                                    this.serviceInstance.removeInv(
                                      this.invitation2.id
                                    );
                                  }
                                })
                                .catch((e) => {
                                  console.log(e);
                                });
                            }
                          });
                      });
                  }
                } else {
                  this.dialog.open(ConfirmationpopupComponent, {
                    width: '300px',
                    data: {
                      smode: 'Emailalreadyexists',
                    },
                  });
                }
              });
          } else {
            if (
              row.CRMAccess == false &&
              result[27] == true &&
              this.allowedNoOfSubUsers == 0
            ) {
              this.dialog.open(ConfirmationpopupComponent, {
                width: '300px',
                data: {
                  smode: 'noOfSubsusers',
                },
              });
            } else {
              //normally update data
              this.serviceInstance
                .updateEmployee(
                  this.superUserId,
                  row.id,
                  result[0],
                  result[1],
                  result[2] ? result[2] : null,
                  result[3],
                  result[4] ? result[4] + '' : '',
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
                  result[22] ? result[22] : null,
                  result[23] ? result[23] : null,
                  result[24],
                  result[25],
                  result[26],
                  result[27],
                  result[28],
                  result[29],
                  result[30],
                  result[31] ? result[31] : ''
                )
                .then((resp) => {
                  //add logic of changing CRMAccess from false to true / from true to false
                  // (case on email is not updated but CRM value changed)

                  if (result[27] != CRMAccessValue) {
                    if (result[27] == true) {
                      //giving CRM access to new email
                      let email = result[6];
                      let accountType = result[28];

                      //link has to be changed such that the success login dont need to go to create profile since all details are there
                      let link = 'https://crm.zenys.org/login';

                      //2 DB operations- sending mail, adding under invitation collection
                      // .then is used since we need to make one more DB write based on th result
                      this.serviceInstance
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
                          this.serviceInstance.updateInvitationSub(
                            this.corrInvId,
                            accountType,
                            result[6],
                            result[29],
                            result[30],
                            result[0],
                            result[1] ? result[1] : '',
                            result[4] ? result[4] + '' : '',
                            result[31] ? result[31] : ''
                          );

                          this._snack.open('Invitation send', '', {
                            duration: 2000,
                          });
                        })
                        .then((re) => {
                          this.serviceInstance
                            .checkUser(row.employeeID)
                            .toPromise()
                            .then((res) => {
                              if (res.exists) {
                                // we have to update CRMAccess field as true
                                this.serviceInstance.upsateCRMfield(
                                  row.employeeID
                                );
                                // then for others will work after accept/decline approval
                              }
                            });
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                    } else if (result[27] == false) {
                      //terminating access of already existing user

                      this.serviceInstance
                        .sendEmail({
                          to: row.officialEmail,
                          template: {
                            name: 'removeSubUser',
                            data: {
                              userName: this.userName,
                            },
                          },
                        })
                        .then((res3) => {
                          this.serviceInstance
                            .checkUser(row.employeeID) // have to check if needed
                            .toPromise()
                            .then((res) => {
                              if (res.exists) {
                                this.serviceInstance.upsateSubUserDetails(
                                  row.employeeID
                                );
                              }
                            });
                        })
                        .then((res4) => {
                          this.serviceInstance.updateInvitationEmp(
                            this.corrInvId,
                            result[6],
                            result[0],
                            result[1] ? result[1] : '',
                            result[4] ? result[4] + '' : '',
                            result[31] ? result[31] : ''
                          );
                          if (this.corrInvitation.status == 'active') {
                            this.serviceInstance.removeSubUser(
                              row.superUsrId,
                              subUserDetails[0].id
                            );
                          }
                        });
                    }
                  }
                  if (result[27] == CRMAccessValue) {
                    // just account type is changed
                    if (result[28] != row.accType) {
                      this.serviceInstance
                        .checkUser(row.employeeID)
                        .toPromise()
                        .then((res) => {
                          if (res.exists) {
                            // update in superuser and user details
                            this.serviceInstance.updateSubUser(
                              this.superUserId,
                              this.subId,
                              result[28],
                              result[29],
                              result[30],
                              result[0],
                              result[1] ? result[1] : '',
                              result[4] ? result[4] + '' : '',
                              result[31] ? result[31] : ''
                            );
                            this.serviceInstance.updateUser(
                              row.employeeID,
                              result[28]
                            );
                            this.serviceInstance.updateInv(
                              this.corrInvId,
                              result[28],
                              result[29],
                              result[30],
                              result[0],
                              result[1] ? result[1] : '',
                              result[4] ? result[4] + '' : '',
                              result[31] ? result[31] : ''
                            );
                          } else {
                            // not a user yet
                            // update in invitation
                            this.serviceInstance.updateInv(
                              this.corrInvId,
                              result[28],
                              result[29],
                              result[30],
                              result[0],
                              result[1] ? result[1] : '',
                              result[4] ? result[4] + '' : '',
                              result[31] ? result[31] : ''
                            );
                          }
                        });
                    }
                    // just reportsTo field is changed
                    if (result[29] != row.reportsToId) {
                      this.serviceInstance
                        .checkUser(row.employeeID)
                        .toPromise()
                        .then((res) => {
                          if (res.exists) {
                            // update in superuser and user details
                            this.serviceInstance.updateSubUser(
                              this.superUserId,
                              this.subId,
                              result[28],
                              result[29],
                              result[30],
                              result[0],
                              result[1] ? result[1] : '',
                              result[4] ? result[4] + '' : '',
                              result[31] ? result[31] : ''
                            );
                            this.serviceInstance.updateInv(
                              this.corrInvId,
                              result[28],
                              result[29],
                              result[30],
                              result[0],
                              result[1] ? result[1] : '',
                              result[4] ? result[4] + '' : '',
                              result[31] ? result[31] : ''
                            );
                          } else {
                            // not a user yet
                            // update in invitation
                            this.serviceInstance.updateInv(
                              this.corrInvId,
                              result[28],
                              result[29],
                              result[30],
                              result[0],
                              result[1] ? result[1] : '',
                              result[4] ? result[4] + '' : '',
                              result[31] ? result[31] : ''
                            );
                          }
                        });
                    }
                  }
                })
                .then((respons) => {
                  // update at inv level
                  this.serviceInstance.updateInv(
                    this.corrInvId,
                    result[28],
                    result[29],
                    result[30],
                    result[0],
                    result[1] ? result[1] : '',
                    result[4] ? result[4] + '' : '',
                    result[31] ? result[31] : ''
                  );
                  // update at subuser level
                  if (this.subId) {
                    this.serviceInstance.updateSubUser(
                      this.superUserId,
                      this.subId,
                      result[28],
                      result[29],
                      result[30],
                      result[0],
                      result[1] ? result[1] : '',
                      result[4] ? result[4] + '' : '',
                      result[31] ? result[31] : ''
                    );
                  }
                })
                .then((res2) => {
                  // check if a user is there and then update at employees user level also
                  this.serviceInstance
                    .checkUser(row.employeeID)
                    .toPromise()
                    .then((res) => {
                      if (res.exists) {
                        // we have to update CRMAccess field as true
                        this.serviceInstance.updateUserFields(
                          row.employeeID,
                          result[0],
                          result[1],
                          result[4] ? result[4] + '' : '',
                          result[15],
                          result[16],
                          result[17],
                          result[18],
                          result[19],
                          result[20],
                          result[31] ? result[31] : ''
                        );
                        // then for others will work after accept/decline approval
                      }
                    });

                  this._snack.open('Successfully Updated', '', {
                    duration: 2000,
                  });
                });
            }
          }
        }
      });
  }

  // search by term function
  filter(query: string) {
    const val = query.replace(/\s/g, '');
    this.dataSource.data = this.employees.filter((item: EmployeeModel) => {
      if(item.employeeID){
        return (
          (item.employeeFirstName + ' ' + item.employeeSecondName)
            .replace(/\s/g, '')
            .toLowerCase()
            .indexOf(val.toLowerCase()) > -1 ||
          item.employeeID
            .replace(/\s/g, '')
            .toLowerCase()
            .indexOf(val.toLowerCase()) > -1
        );
      }else{
        return (
          (item.employeeFirstName + ' ' + item.employeeSecondName)
            .replace(/\s/g, '')
            .toLowerCase()
            .indexOf(val.toLowerCase()) > -1
        );
      }

    });
  }

  // ngonDestroy
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.userDetailsSubscription?.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

// CRUD component starts here
@Component({
  selector: 'employee-crud',
  templateUrl: 'employee-crud.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeCrud {
  // variables on employee details form-EmployeeModel
  employeeFirstName = '';
  employeeSecondName = '';
  dateOfBirth = null;
  gender = '';
  contactNo = null;
  personalEmail = '';
  officialEmail = '';
  emergencyContactPerson = '';
  emergencyContactNo = null;
  commAddLine1 = '';
  commAddLine2 = '';
  commAddDist = '';
  commAddState = '';
  commAddCountry = '';
  commAddZip = '';
  permAddLine1 = '';
  permAddLine2 = '';
  permAddDist = '';
  permAddState = '';
  permAddCountry = '';
  permAddZip = '';
  status = '';
  dateOfJoining = null;
  exitDate = null;
  designation = '';
  bloodGroup = '';
  crmAccess = false;
  accType = '';
  employeeNo = '';
  imageSrc: string | ArrayBuffer = null;
  logoSrc: string | ArrayBuffer = null;

  disabledOnView = false; //on view the form will be disabled can be enable by clicking on edit option
  UrlToDelete = null; //to change an existing employee photograph, we have to delete the existing photo from storage
  // for that we are storing the existing URL in this variable

  employeeGenderArray: string[] = []; //gender array from data-model.ts
  eGender: EmployeeGender = null; //current gender
  employeeStatusArray: string[] = []; //status array from data-model.ts
  eStatus: EmployeeStatus = null; //current status
  subuserAccTypeArray: string[] = [];
  eAccType: SubUserAccTypes = null;
  reportsToArray;

  settingsConfigured = false;
  loader = false;
  employeeIDTemp = null; //ID card template under superuser

  // super user company name and address for printing in ID card
  companyName = '';
  addLine1 = '';
  addLine2 = '';
  addCity = '';
  addState = '';
  addCountry = '';
  addPIN = '';
  reportsTo = null;
  reportsToName = '';

  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';

  CountryCodes = getCountryCodes.CountryCodes; //countrycodes from countrycodes.ts
  public defaultCode = ''; //default countrycode is assigned to India

  urlDownload = ''; //url using for download
  private basepath: string = '/employeeImages'; //uploads folder under files in Firebase Storage
  private uploadTask: firebase.default.storage.UploadTask; //for upload file method

  private onDestroy$: Subject<void> = new Subject<void>(); //on destroy variable

  constructor(
    public dialogRef: MatDialogRef<EmployeeCrud>,
    @Inject(MAT_DIALOG_DATA) public data,
    private storageFire: AngularFireStorage,
    private router: Router,
    public dialog: MatDialog,
    private _snack: MatSnackBar,
    private serviceInstance: EmployeeListService
  ) {
    this.employeeGenderArray = this.getGenders();
    this.employeeStatusArray = this.getStatus();

    if (this.data) {
      // create reports ToArray
      this.reportsToArray = this.data.subuserArray.map(
        ({ userId, firstname, lastname }) => ({
          userId,
          firstname,
          lastname,
        })
      );
      let superuserdetails = {
        firstname: this.data.superUserName,
        lastname: '',
        userId: this.data.superUserId,
      };

      this.reportsToArray.push(superuserdetails);
      //  console.log(this.reportsToArray);

      // we have to get the profiles under superUser
      this.serviceInstance
        .getDefaultProfiles(this.data.superUserId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          let defaultProfiles = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as {};
          });
          let pArray = defaultProfiles.map(function (item) {
            return item['profileName'];
          });
          pArray.forEach((value, index) => {
            if (value == 'SuperUser') pArray.splice(index, 1);
          });
          this.subuserAccTypeArray = pArray;
        });

      if (this.data.scenario == 'add') {
        this.settingsConfigured = this.data.settingsConfigured;
      }

      if (this.data.scenario == 'view') {
        this.settingsConfigured = true;

        if (this.data.employeeIDTemp === 'template1') {
          this.employeeIDTemp = 'template1';
        } else if (this.data.employeeIDTemp === 'template2') {
          this.employeeIDTemp = 'template2';
        } else {
          this.employeeIDTemp = 'template1';
        }

        this.disabledOnView = true;
        this.UrlToDelete = this.data.employeeDetails.imageURL;
        this.companyName = this.data.companyName;
        this.addLine1 = this.data.addLine1;
        this.addLine2 = this.data.addLine2;
        this.addCity = this.data.addCity;
        this.addState = this.data.addState;
        this.addCountry = this.data.addCountry;
        this.addPIN = this.data.addPIN;
        this.logoSrc = this.data.logoSrc;

        this.employeeFirstName = this.data.employeeDetails.employeeFirstName;
        this.employeeSecondName = this.data.employeeDetails.employeeSecondName;
        this.dateOfBirth = this.data.employeeDetails.dateOfBirth;
        this.gender = this.data.employeeDetails.gender;
        this.contactNo = this.data.employeeDetails.contactNo;
        this.personalEmail = this.data.employeeDetails.personalEmail;
        this.officialEmail = this.data.employeeDetails.officialEmail;
        this.emergencyContactPerson =
          this.data.employeeDetails.emergencyContactPerson;
        this.emergencyContactNo = this.data.employeeDetails.emergencyContactNo;
        this.commAddLine1 = this.data.employeeDetails.commAddLine1;
        this.commAddLine2 = this.data.employeeDetails.commAddLine2;
        this.commAddDist = this.data.employeeDetails.commAddDist;
        this.commAddState = this.data.employeeDetails.commAddState;
        this.commAddCountry = this.data.employeeDetails.commAddCountry;
        this.commAddZip = this.data.employeeDetails.commAddZip;
        this.permAddLine1 = this.data.employeeDetails.permAddLine1;
        this.permAddLine2 = this.data.employeeDetails.permAddLine2;
        this.permAddDist = this.data.employeeDetails.permAddDist;
        this.permAddState = this.data.employeeDetails.permAddState;
        this.permAddCountry = this.data.employeeDetails.permAddCountry;
        this.permAddZip = this.data.employeeDetails.permAddZip;
        this.status = this.data.employeeDetails.status;
        this.dateOfJoining = this.data.employeeDetails.dateOfJoining;
        this.exitDate = this.data.employeeDetails.exitDate;
        this.designation = this.data.employeeDetails.designation;
        this.bloodGroup = this.data.employeeDetails.bloodGroup;
        this.imageSrc = this.data.employeeDetails.imageURL;
        this.urlDownload = this.data.employeeDetails.imageURL;
        this.crmAccess = this.data.employeeDetails.CRMAccess;
        this.accType = this.data.employeeDetails.accType;
        this.employeeNo = this.data.employeeDetails.employeeNo;
        this.reportsTo = this.data.employeeDetails.reportsToId;
        this.reportsToName = this.data.employeeDetails.reportsToName;
        this.defaultCode = this.data.employeeDetails.code
          ? this.data.employeeDetails.code
          : '';
      }
    }
  }
  getGenders(): string[] {
    this.eGender = new EmployeeGender();
    return this.eGender.employeeGender;
  }
  getStatus(): string[] {
    this.eStatus = new EmployeeStatus();
    return this.eStatus.employeeStatus;
  }

  onNoClick1() {
    this.dialogRef.close();
  }
  upload($event) {
    this.loader = true;
    if ($event.target.files && $event.target.files[0]) {
      const file = $event.target.files[0];
      if (file.size > 512000) {
        this.loader = false;
        this.dialog.open(ConfirmationpopupComponent, {
          width: '300px',
          data: {
            smode: 'employeePhotoSize',
          },
        });
      } else {
        // preview showing codes
        const reader = new FileReader();
        reader.onload = (e) => (this.imageSrc = reader.result);

        reader.readAsDataURL(file);
        // delete already existing from storage if scenario is edit
        if (this.data.scenario == 'view' && this.UrlToDelete) {
          return this.storageFire.storage
            .refFromURL(this.UrlToDelete)
            .delete()
            .then((res) => {
              // codes for firebase storage
              let currentupload = new Upload(file);
              this.pushUpload(currentupload);
            });
        } else {
          // codes for firebase storage
          let currentupload = new Upload(file);
          this.pushUpload(currentupload);
        }
      }
    }
  }

  // selected file after limit check is uploading to firebase storage
  pushUpload(upload: Upload) {
    let storageRef = firebase.default.storage().ref();
    this.uploadTask = storageRef
      .child(`${this.basepath}/${upload.file.name}`)
      .put(upload.file);

    this.uploadTask.on(
      firebase.default.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        upload.progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log(error);
      },
      () => {
        storageRef
          .child(`${this.basepath}/${upload.file.name}`)
          .getDownloadURL()
          .then((ref) => {
            this.urlDownload = ref;
            if (this.urlDownload) {
              this.loader = false;
              upload.url = this.urlDownload;
              upload.name = upload.file.name;
              this._snack.open('Photo upload completed', '', {
                duration: 2000,
              });
            }
          });
      }
    );
  }

  // edit on
  editOn() {
    this.disabledOnView = false;
    this.dateOfBirth = this.data.employeeDetails.dateOfBirth?.toDate();
    this.dateOfJoining = this.data.employeeDetails.dateOfJoining?.toDate();
    this.exitDate = this.data.employeeDetails.exitDate?.toDate();
  }

  uploadPhotograph() {
    let element: HTMLElement = document.getElementsByClassName(
      'attachment-selector'
    )[0] as HTMLElement;
    element.click();
  }
  gotoSettings() {
    this.router.navigate(['/dash/settings/employee-settings']);
    this.dialogRef.close();
  }

  reportToSelected(option) {
    this.reportsToName = option.firstname + ' ' + option.lastname;
    // console.log(this.reportsToName);
  }

  // ngonDestroy
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
// CRUD component ends here
