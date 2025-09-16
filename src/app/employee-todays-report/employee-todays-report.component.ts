/**********************************************************************************
Description: Component is used to display todays ahhendance report of employees under this superuser
             Only for Web
Inputs:
Outputs:
**********************************************************************************/
import { DatePipe, Location } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { CommonService } from '../common.service';
import {
  AttendanceModel,
  CSVDailyAttModel,
  EmployeeModel,
} from '../data-models';
import { EmployeeTodaysReportService } from './employee-todays-report.service';
import { saveAs } from 'file-saver';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-todays-report',
  templateUrl: './employee-todays-report.component.html',
  styleUrls: ['./employee-todays-report.component.scss'],
  providers: [DatePipe],
})
export class EmployeeTodaysReportComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort; //sort for mat-table
  @ViewChild(MatPaginator) paginator: MatPaginator; //paginator for mat-table

  superUserId = '';
  progressBarStatus = false;
  displayedColumnsToday: string[] = [
    'employeeName',
    'attStatus',
    'checkIn',
    'checkInUpdated',
    'checkOut',
    'checkOutUpdated',
    'loginTime', 'logoutTime', 'activeTime', 'autoLogouts'
  ]; //mat-table columns for todays report
  dataSourceToday: MatTableDataSource<AttendanceModel>; //mat-table data for todays report

  // to fetch and display todays attendance
  todaysDate = new Date(); //todays date
  date = new Date().getDate(); //date only
  month = new Date().toLocaleString('en-us', { month: 'long' }); //month only
  year = new Date().getFullYear().toString(); //year only
  employeedailyData: AttendanceModel[] = [];
  csvData: CSVDailyAttModel[] = [];

  basePath = '';
  employeesArray: EmployeeModel[] = [];

  // Subject that emits when the component has been destroyed.
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    public commonService: CommonService,
    private serviceInstance: EmployeeTodaysReportService,
    private location: Location,
    private datePipe: DatePipe,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    // subscribing common datas from commnon service
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        this.superUserId = allData.userDetails.superUserId;

        // employee details are fetching to get the employee name corresponding to employeeid
        this.serviceInstance
          .getEmployeeDetails(this.superUserId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((employees) => {
            this.employeesArray = employees.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as EmployeeModel;
            });
          });
        this.callSubscription();
      });
  }
  async callSubscription() {
    await this.getDate();
    this.dataSourceToday = new MatTableDataSource([]);
    this.dataSourceToday.data = this.employeedailyData;
    this.progressBarStatus = true;

    this.dataSourceToday.sort = this.sort;
    this.dataSourceToday.paginator = this.paginator;
  }
  getDate() {
    return new Promise<void>((resolve) => {
      this.basePath = `users/${this.superUserId}/attendance/${this.year}/${this.month}/${this.date}`;
      this.serviceInstance
        .getAttendanceData(this.basePath)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          if (data) {
            let employeeTodaysData = Object.values(data);

            for (let i = 0; i < this.employeesArray.length; i++) {
              for (let j = 0; j < employeeTodaysData.length; j++) {
                if(employeeTodaysData[j].employeeId == this.employeesArray[i].employeeID){
                  employeeTodaysData[j].employeeName =
                  this.employeesArray[i]?.employeeFirstName +
                  ' ' +
                  (this.employeesArray[i]?.employeeSecondName
                    ? this.employeesArray[i]?.employeeSecondName
                    : '');
                }
              }
            }

            this.employeedailyData = employeeTodaysData;
          } else {
            this.employeedailyData = [];
          }
          resolve();
        });
    });
  }
  onBack() {
    this.location.back();
  }
  onDownloadAsCsv() {
    if(this.employeedailyData?.length > 0){
      this.csvData = [];
      this.employeedailyData.forEach((data) => {
        let arrayofest: CSVDailyAttModel = new CSVDailyAttModel(
          data.employeeName,
          data.attStatus,
          data.checkIn,
          this.datePipe.transform(data.checkInUpdated?.toDate(), 'medium'),
          data.checkOut,
          this.datePipe.transform(data.checkOutUpdated?.toDate(), 'medium'),
          this.datePipe.transform(data.loginTime, 'medium'),
          this.datePipe.transform(data.logoutTime, 'medium'),
          data.activeTime,
          data.autoLogouts
        );
        this.csvData.push(arrayofest);
      });
      const replacer = (key, value) => (value === null ? '' : value);
      const head = [
        'Employee Name',
        'Status',
        'In Time',
        'In Time logged',
        'Out Time',
        'Out Time logged',
        'Login Time',
        'Logout Time',
        'Recorded Active Time',
        'Auto Logouts'
      ];
      const header = Object.keys(this.csvData[0]);

      let csv = this.csvData.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(',')
      );

      csv.unshift(head.join(','));

      let csvArray = csv.join('\r\n');

      var blob = new Blob([csvArray], { type: 'text/csv' });
      saveAs(blob, 'emp_daily_report.csv');
    }else{
      this.snack.open('No Data to download', '', {
        duration: 2000,
      });
    }
  }
  dateChanged() {
    this.progressBarStatus = false;

    this.date = new Date(this.todaysDate).getDate(); //date only
    this.month = new Date(this.todaysDate).toLocaleString('en-us', {
      month: 'long',
    }); //month only
    this.year = new Date(this.todaysDate).getFullYear().toString(); //year only

    this.callSubscription();
  }
  resetDate() {
    this.progressBarStatus = false;
    this.todaysDate = new Date();
    this.date = new Date().getDate(); //date only
    this.month = new Date().toLocaleString('en-us', {
      month: 'long',
    }); //month only
    this.year = new Date().getFullYear().toString(); //year only

    this.callSubscription();
  }
  // on destroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
