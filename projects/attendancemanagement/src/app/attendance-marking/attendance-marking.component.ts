import { Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import {
  AttendanceModel,
  AttendanceModelDB,
  AttendanceStatus,
  EmployeeModel,
} from '../employee-model';
import { AttendanceMarkingService } from './attendance-marking.service';

@Component({
  selector: 'app-attendance-marking',
  templateUrl: './attendance-marking.component.html',
  styleUrls: ['./attendance-marking.component.scss'],
})
export class AttendanceMarkingComponent implements OnInit, OnDestroy {
  attendanceStatusArray: string[] = []; //attendance status array from data-model.ts
  attendanceStatus: AttendanceStatus = null; //current attendance status
  todaysDate = new Date();
  date = new Date().getDate();
  month = new Date().toLocaleString('en-us', { month: 'long' });
  year = new Date().getFullYear().toString();
  attCheckInTime = null;
  attCheckOutTime = null;
  basePath = '';
  collectionPath = '';
  superUserId = '';
  docId = '';
  displayedColumns = ['index', 'attStatus', 'checkIn', 'checkOut', 'loginTime', 'logoutTime', 'activeTime', 'autoLogouts'];
  dataSource: any;
  tableData: Array<{
    id: any;
    attStatus: string;
    checkIn: any;
    checkOut: string;
    inEditMode: boolean;
    outEditMode: boolean;
    loginTime: any,
    logoutTime: any,
    activeTime: string,
    autoLogouts: number
  }> = [];

  array: AttendanceModel[] = [];
  progressBarStatus = false;
  employeeName = '';
  selectedYearArray = [];
  selectedYear = '';

  monthArray: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  selectedMonthArray: string[] = [];

  employeeID = '';
  employeeEmail = '';
  employeeDetails: EmployeeModel = null;

  noAccess = false;

  // Subject that emits when the component has been destroyed.
  private onDestroy$: Subject<void> = new Subject<void>();

  selectedId = null;
  inSelectedIdBoolean = false;
  inSelectedIdBooleanFalse = false;
  outSelectedIdBoolean = false;
  outSelectedIdBooleanFalse = false;

  completeArray = [];
  dataAlreadyRecorded = false;
  logoutToBeRecorded = false;

  constructor(
    private afAuth: AngularFireAuth,
    private serviceInstance: AttendanceMarkingService,
    private snack: MatSnackBar,
    private location: Location,
    private router: Router,
    public commonService: CommonService
  ) {
    this.attendanceStatusArray = this.getAttStatus();

    let thisYear = new Date().getFullYear().toString();
    let lastYear = (new Date().getFullYear() - 1).toString();

    this.selectedYearArray = [
      { year: thisYear, name: 'This year' },
      { year: lastYear, name: 'Last year' },
    ];
  }

  ngOnInit(): void {
    this.afAuth.authState.pipe(takeUntil(this.onDestroy$)).subscribe((user) => {
      if (user) {
        this.employeeEmail = user.email;
        this.employeeID = user.uid;
        // fetch user details corresponding to this mail under superusers employees collection
        this.serviceInstance
          .getEmployeeDetails(this.employeeEmail)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((data) => {
            let eData = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as EmployeeModel;
            });
            if (eData) {
              this.employeeDetails = eData[0];

              if (typeof this.employeeDetails === 'undefined') {
                this.noAccess = true;
                this.progressBarStatus = true;
              } else {
                if (this.employeeDetails.CRMAccess == false) {
                  // update to Db such that NO CRM ACCESS
                  this.serviceInstance.setNoCRMAccess(this.employeeID, false);
                } else {
                  // update to Db CRM ACCESS
                  this.serviceInstance.setNoCRMAccess(this.employeeID, true);
                }
                if(this.employeeDetails.CRMAccess === true){
                  this.logoutToBeRecorded = true;
                }
                this.superUserId = this.employeeDetails.superUsrId;
                this.docId = this.employeeDetails.docId;
                this.employeeName =
                  this.employeeDetails.employeeFirstName +
                  ' ' +
                  (this.employeeDetails.employeeSecondName
                    ? this.employeeDetails.employeeSecondName
                    : '');

                if (!this.employeeDetails.employeeID) {
                  this.proceedFn();
                } else {
                  this.selectedYear = 'This year';
                  if (this.selectedYear == 'This year') {
                    let index = this.monthArray.indexOf(
                      new Date().toLocaleString('en-us', { month: 'long' })
                    );
                    this.selectedMonthArray = this.monthArray.slice(
                      0,
                      index + 1
                    );
                  } else {
                    this.selectedMonthArray = this.monthArray;
                  }
                  this.callSubscription(this.month, this.year);
                }
              }
            }
          });
      }
    });
  }
  proceedFn() {
    // step1: update EmployeeID for firsttime signup
    this.serviceInstance
      .setEmployeeIDFn(this.superUserId, this.docId, this.employeeID)
      .then((res) => {
        // step 2
        this.selectedYear = 'This year';
        if (this.selectedYear == 'This year') {
          let index = this.monthArray.indexOf(
            new Date().toLocaleString('en-us', { month: 'long' })
          );
          this.selectedMonthArray = this.monthArray.slice(
            0,
            index + 1
          );
        } else {
          this.selectedMonthArray = this.monthArray;
        }
        this.callSubscription(this.month, this.year);
      });
  }
  async callSubscription(month, year) {
    this.collectionPath = `users/${this.superUserId}/attendance/${this.year}/${this.month}`;
    this.serviceInstance
    .getAttendanceData(this.collectionPath)
    .pipe(takeUntil(this.onDestroy$))
    .subscribe((data) => {
      let doc = data.map((e) => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as {}),
        } as AttendanceModelDB;
      });


      if (doc) {
        const documntId = this.employeeID;
        let newArray = [];

        for (let i = 0; i < doc.length; i++) {
          for (let j = 1; j < 32; j++) {
            if (doc[i].id == j.toString()) {
              Object.keys(doc[i]).filter(function (key) {
                if (doc[i][key].employeeId === documntId) {
                  newArray.push(doc[i][key]);
                }
              });
            }
          }
        }

        this.completeArray = newArray;

        this.array = newArray.map(
          ({
            id,
            attStatus,
            checkIn,
            checkInUpdated,
            checkOut,
            checkOutUpdated,
            loginTime,
            logoutTime,
            activeTime,
            autoLogouts
          }) => ({
            id,
            attStatus,
            checkIn,
            checkInUpdated,
            checkOut,
            checkOutUpdated,
            loginTime,
            logoutTime,
            activeTime,
            autoLogouts
          })
        );
        this.doActions(this.month, this.year);
      }

    });

  }
  doActions(month, year) {
    this.tableData = [
      {
        id: '1',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '2',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '3',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '4',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '5',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '6',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '7',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '8',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '9',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '10',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '11',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '12',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '13',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '14',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '15',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '16',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '17',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '18',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '19',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '20',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '21',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '22',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '23',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '24',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '25',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '26',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '27',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '28',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '29',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '30',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
      {
        id: '31',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        inEditMode: false,
        outEditMode: false,
        loginTime: null,
        logoutTime: null,
        activeTime: null,
        autoLogouts: null
      },
    ];

    if (month == 'February') {
      if ((0 == year % 4 && 0 != year % 100) || 0 == year % 400) {
        // leapyear
        this.tableData = this.tableData.filter(
          (element, index) => index < this.tableData.length - 2
        );
      } else {
        this.tableData = this.tableData.filter(
          (element, index) => index < this.tableData.length - 3
        );
      }
    } else if (month == 'April') {
      this.tableData = this.tableData.filter(
        (element, index) => index < this.tableData.length - 1
      );
    } else if (month == 'June') {
      this.tableData = this.tableData.filter(
        (element, index) => index < this.tableData.length - 1
      );
    } else if (month == 'September') {
      this.tableData = this.tableData.filter(
        (element, index) => index < this.tableData.length - 1
      );
    } else if (month == 'November') {
      this.tableData = this.tableData.filter(
        (element, index) => index < this.tableData.length - 1
      );
    }

    for (let i = 0; i < this.array.length; i++) {
      let objIndex = this.tableData.findIndex(
        (obj) => obj.id == this.array[i].id
      );
      this.tableData[objIndex].attStatus = this.array[i].attStatus;
      this.tableData[objIndex].checkIn = this.array[i].checkIn;
      this.tableData[objIndex].checkOut = this.array[i].checkOut;
      this.tableData[objIndex].loginTime = this.array[i].loginTime;
      this.tableData[objIndex].logoutTime = this.array[i].logoutTime;
      this.tableData[objIndex].activeTime = this.array[i].activeTime;
      this.tableData[objIndex].autoLogouts = this.array[i].autoLogouts;
    }

    if (this.inSelectedIdBooleanFalse == true) {
      this.tableData[this.selectedId - 1].inEditMode = false;
      this.inSelectedIdBooleanFalse = false;
    }
    if (this.inSelectedIdBoolean == true) {
      this.tableData[this.selectedId - 1].inEditMode = true;
      this.inSelectedIdBoolean = false;
    }
    if (this.outSelectedIdBooleanFalse == true) {
      this.tableData[this.selectedId - 1].outEditMode = false;
      this.outSelectedIdBooleanFalse = false;
    }
    if (this.outSelectedIdBoolean == true) {
      this.tableData[this.selectedId - 1].outEditMode = true;
      this.outSelectedIdBoolean = false;
    }
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.data = this.tableData;
    this.progressBarStatus = true;
  }

  onBack() {
    this.location.back();
  }
  getAttStatus(): string[] {
    this.attendanceStatus = new AttendanceStatus();
    return this.attendanceStatus.attendanceStatus;
  }

  dateChanged() {
    this.date = this.todaysDate.getDate();
    this.month = this.todaysDate.toLocaleString('en-us', { month: 'long' });
    this.year = this.todaysDate.getFullYear().toString();
    this.callSubscription(this.month, this.year);
  }
  attStatusChanged(id, status) {

    let logInTime;
    let logOutTime;
    let actTime;
    let actTimeNo;
    let autoLogouts;

    for (let i = 0; i < this.completeArray.length; i++) {
      if (this.completeArray[i].id == id) {
        logInTime = this.completeArray[i].loginTime;
        logOutTime = this.completeArray[i].logoutTime;
        actTime = this.completeArray[i].activeTime;
        actTimeNo = this.completeArray[i].activeTimeNo;
        autoLogouts = this.completeArray[i].autoLogouts
      }
    }

    this.basePath = `users/${this.superUserId}/attendance/${this.year}/${this.month}/${id}`;
    if (status == 'Personal Leave') {
      if(this.dataAlreadyRecorded === true){
        this.serviceInstance
        .updateOtherStatus(
          this.basePath,
          status,
          this.superUserId,
          id,
          this.employeeName,
          this.employeeID,
          logInTime?logInTime:null,
          logOutTime?logOutTime:null,
          actTime?actTime:null,
          actTimeNo?actTimeNo:null,
          autoLogouts?autoLogouts:0
        )
        .then((res) => {
          this.snack.open('Status updated', '', {
            duration: 2000,
          });
          this.doActions(this.month, this.year);
          // this.callSubscription(this.month, this.year);
        })
        .catch((e) => {
          console.log(e);
        });
      }else{
        this.serviceInstance
        .setOtherStatus(
          this.basePath,
          status,
          this.superUserId,
          id,
          this.employeeName,
          this.employeeID,
          logInTime?logInTime:null,
          logOutTime?logOutTime:null,
          actTime?actTime:null,
          actTimeNo?actTimeNo:null,
          autoLogouts?autoLogouts:0
        )
        .then((res) => {
          this.snack.open('Status updated', '', {
            duration: 2000,
          });
          this.doActions(this.month, this.year);
          // this.callSubscription(this.month, this.year);
        })
        .catch((e) => {
          console.log(e);
        });
      }
    } else if (status == 'Public Holiday') {
      if(this.dataAlreadyRecorded === true){
        this.serviceInstance
        .updateOtherStatus(
          this.basePath,
          status,
          this.superUserId,
          id,
          this.employeeName,
          this.employeeID,
          logInTime?logInTime:null,
          logOutTime?logOutTime:null,
          actTime?actTime:null,
          actTimeNo?actTimeNo:null,
          autoLogouts?autoLogouts:0
        )
        .then((res) => {
          this.snack.open('Status updated', '', {
            duration: 2000,
          });
          this.doActions(this.month, this.year);
          // this.callSubscription(this.month, this.year);
        })
        .catch((e) => {
          console.log(e);
        });
      }else{
        this.serviceInstance
        .setOtherStatus(
          this.basePath,
          status,
          this.superUserId,
          id,
          this.employeeName,
          this.employeeID,
          logInTime?logInTime:null,
          logOutTime?logOutTime:null,
          actTime?actTime:null,
          actTimeNo?actTimeNo:null,
          autoLogouts?autoLogouts:0
        )
        .then((res) => {
          this.snack.open('Status updated', '', {
            duration: 2000,
          });
          this.doActions(this.month, this.year);
          // this.callSubscription(this.month, this.year);
        })
        .catch((e) => {
          console.log(e);
        });
      }
    } else {
      if(this.dataAlreadyRecorded === true){
        this.serviceInstance
        .updateStatus(
          this.basePath,
          status,
          this.superUserId,
          id,
          this.employeeName,
          this.employeeID,
          logInTime?logInTime:null,
          logOutTime?logOutTime:null,
          actTime?actTime:null,
          actTimeNo?actTimeNo:null,
          autoLogouts?autoLogouts:0
        )
        .then((res) => {
          this.snack.open('Status updated', '', {
            duration: 2000,
          });
          // this.callSubscription(this.month, this.year);
        })
        .catch((e) => {
          console.log(e);
        });
      }else{
        this.serviceInstance
        .setStatus(
          this.basePath,
          status,
          this.superUserId,
          id,
          this.employeeName,
          this.employeeID,
          logInTime?logInTime:null,
          logOutTime?logOutTime:null,
          actTime?actTime:null,
          actTimeNo?actTimeNo:null,
          autoLogouts?autoLogouts:0
        )
        .then((res) => {
          this.snack.open('Status updated', '', {
            duration: 2000,
          });
          // this.callSubscription(this.month, this.year);
        })
        .catch((e) => {
          console.log(e);
        });
      }
    }
  }
  checkInTimeChanged(id, checkin, checkOutToCheck) {
    if (checkOutToCheck < checkin) {
      this.snack.open('Error!! Check-In time greater than Check-out time', '', {
        duration: 5000,
      });
    } else {
      this.basePath = `users/${this.superUserId}/attendance/${this.year}/${this.month}/${id}`;
      this.selectedId = id;
      this.inSelectedIdBooleanFalse = true;
      if (typeof checkin === 'undefined') {
        // this.serviceInstance.updateinEditModeFalse(this.basePath).then((res) => {
        this.doActions(this.month, this.year);
        // this.callSubscription(this.month, this.year)
        // });
      }else if (checkin === null) {
        // this.serviceInstance.updateinEditModeFalse(this.basePath).then((res) => {
        this.doActions(this.month, this.year);
        // this.callSubscription(this.month, this.year)
        // });
      } else {
        let aStatus;
        let cOut;
        let cOutUp;
        let sId;
        let eId;
        let dat;
        let ename;
        let ID;
        let logInTime;
        let logOutTime;
        let actTime;
        let actTimeNo;
        let autoLogouts;

        for (let i = 0; i < this.completeArray.length; i++) {
          if (this.completeArray[i].id == id) {
            aStatus = this.completeArray[i].attStatus;
            cOut = this.completeArray[i].checkOut;
            cOutUp = this.completeArray[i].checkOutUpdated;
            sId = this.completeArray[i].superUserId;
            eId = this.completeArray[i].employeeId;
            dat = this.completeArray[i].date;
            ename = this.completeArray[i].employeeName;
            ID = this.completeArray[i].id;
            logInTime = this.completeArray[i].loginTime?this.completeArray[i].loginTime:null;
            logOutTime = this.completeArray[i].logoutTime?this.completeArray[i].logoutTime:null;
            actTime = this.completeArray[i].activeTime?this.completeArray[i].activeTime:null;
            actTimeNo = this.completeArray[i].activeTimeNo?this.completeArray[i].activeTimeNo:null;
            autoLogouts = this.completeArray[i].autoLogouts?this.completeArray[i].autoLogouts:null;
          }
        }

        this.serviceInstance
          .updateCheckIn(
            this.basePath,
            checkin ? checkin : null,
            new Date(),
            aStatus,
            cOut,
            cOutUp,
            sId,
            eId,
            dat,
            ename,
            ID,
            logInTime,
            logOutTime,
            actTime,
            actTimeNo,
            autoLogouts
          )
          .then((res) => {
            this.snack.open('Check-In time updated', '', {
              duration: 2000,
            });
            this.doActions(this.month, this.year);
            //  this.callSubscription(this.month, this.year);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }
  checkOutTimeChanged(id, checkout, checkInToCheck) {
    if (checkInToCheck > checkout) {
      this.snack.open('Error!! Check-Out time is less than Check-In time', '', {
        duration: 5000,
      });
    } else {
      this.basePath = `users/${this.superUserId}/attendance/${this.year}/${this.month}/${id}`;
      this.selectedId = id;
      this.outSelectedIdBooleanFalse = true;

      if (typeof checkout === 'undefined') {
        // this.serviceInstance.updateoutEditModeFalse(this.basePath).then((res) => {
        this.doActions(this.month, this.year);
        // this.callSubscription(this.month, this.year)
        // });
      }else if (checkout === null) {
        // this.serviceInstance.updateoutEditModeFalse(this.basePath).then((res) => {
        this.doActions(this.month, this.year);
        // this.callSubscription(this.month, this.year)
        // });
      } else {
        let aStatus;
        let cIn;
        let cInUp;
        let sId;
        let eId;
        let dat;
        let ename;
        let ID;
        let logInTime;
        let logOutTime;
        let actTime;
        let actTimeNo;
        let autoLogouts;

        for (let i = 0; i < this.completeArray.length; i++) {
          if (this.completeArray[i].id == id) {
            aStatus = this.completeArray[i].attStatus;
            cIn = this.completeArray[i].checkIn;
            cInUp = this.completeArray[i].checkInUpdated;
            sId = this.completeArray[i].superUserId;
            eId = this.completeArray[i].employeeId;
            dat = this.completeArray[i].date;
            ename = this.completeArray[i].employeeName;
            ID = this.completeArray[i].id;
            logInTime = this.completeArray[i].loginTime?this.completeArray[i].loginTime:null;
            logOutTime = this.completeArray[i].logoutTime?this.completeArray[i].logoutTime:null;
            actTime = this.completeArray[i].activeTime?this.completeArray[i].activeTime:null;
            actTimeNo = this.completeArray[i].activeTimeNo?this.completeArray[i].activeTimeNo:null;
            autoLogouts = this.completeArray[i].autoLogouts?this.completeArray[i].autoLogouts:null;
          }
        }

        this.serviceInstance
          .updateCheckOut(
            this.basePath,
            checkout ? checkout : null,
            new Date(),
            aStatus,
            cIn,
            cInUp,
            sId,
            eId,
            dat,
            ename,
            ID,
            logInTime,
            logOutTime,
            actTime,
            actTimeNo,
            autoLogouts
          )
          .then((res) => {
            this.snack.open('Check-Out time updated', '', {
              duration: 2000,
            });
            this.doActions(this.month, this.year);
            //  this.callSubscription(this.month, this.year);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }

  editInClick(id) {
    this.basePath = `users/${this.superUserId}/attendance/${this.year}/${this.month}/${id}`;
    // this.serviceInstance.updateinEditMode(this.basePath).then((res) => {

    this.selectedId = id;
    this.inSelectedIdBoolean = true;
    this.doActions(this.month, this.year);

    // this.callSubscription(this.month, this.year)
    // });
  }
  editOutClick(id) {
    this.basePath = `users/${this.superUserId}/attendance/${this.year}/${this.month}/${id}`;
    // this.serviceInstance.updateoutEditMode(this.basePath).then((res) => {

    this.selectedId = id;
    this.outSelectedIdBoolean = true;
    this.doActions(this.month, this.year);

    // this.callSubscription(this.month, this.year)
    // });
  }

  yearChanged() {
    if (this.selectedYear == 'Last year') {
      this.selectedMonthArray = this.monthArray;

      var d = new Date();
      var intYear = d.getFullYear() - 1;
      this.year = intYear.toString();

      this.callSubscription(this.month, this.year);
    } else if (this.selectedYear == 'This year') {
      let index = this.monthArray.indexOf(
        new Date().toLocaleString('en-us', { month: 'long' })
      );
      this.selectedMonthArray = this.monthArray.slice(0, index + 1);

      var d = new Date();
      var intYear = d.getFullYear();
      this.year = intYear.toString();

      this.callSubscription(this.month, this.year);
    }
  }

  monthChanged() {
    this.callSubscription(this.month, this.year);
  }

  logOut() {
    if(this.logoutToBeRecorded === true){
      this.commonService.callLogOut.next( true );
    }else{
      this.afAuth.signOut().then((res) => {
        this.router.navigate(['/attendancemanagement/login']);
      });
    }
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
