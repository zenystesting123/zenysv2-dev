/**********************************************************************************
Description: Component is used to display monthly ahhendance report of employees under this superuser
             Only for Web
Inputs:
Outputs:
**********************************************************************************/
import { DatePipe, Location } from '@angular/common';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { CommonService } from '../common.service';
import {
  AttendanceModel,
  AttendanceModelDB,
  CSVMonthlyAttModel,
  EmployeeModel,
} from '../data-models';
import { EmployeeMonthlyReportService } from './employee-monthly-report.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-monthly-report',
  templateUrl: './employee-monthly-report.component.html',
  styleUrls: ['./employee-monthly-report.component.scss'],
  providers: [DatePipe],
})
export class EmployeeMonthlyReportComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort; //sort for mat-table
  @ViewChild(MatPaginator) paginator: MatPaginator; //paginator for mat-table

  superUserId = '';
  progressBarStatus = false;

  employees: EmployeeModel[] = []; //total employees fetched from DB
  selectedEmployee: EmployeeModel; // selected employee
  empSelected: boolean = false; //to dispaly only after selecting an employee this boolean check if an employee is selected/not

  // for mat-autocomplete to select an employee
  myControl = new FormControl();
  filteredOptions: Observable<EmployeeModel[]>;

  todaysDate = new Date(); //todays date
  date = new Date().getDate(); //date only
  month = new Date().toLocaleString('en-us', { month: 'long' }); //month only
  year = new Date().getFullYear().toString(); //year only

  employeemonthlyData = [];
  dataSource: any;
  displayedColumns: string[] = [
    'id',
    'attStatus',
    'checkIn',
    'checkInUpdated',
    'checkOut',
    'checkOutUpdated',
    'loginTime',
    'logoutTime',
    'activeTime',
    'autoLogouts'
  ]; //mat-table columns for monthly report

  csvData: CSVMonthlyAttModel[] = []; //to download CSV fn
  selectedEmployeeName = ''; //to show in HTML

  // for year selection
  selectedYearArray = [];
  selectedYear = '';

  // for month selection
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
  selectedMonth = '';

  // booleans showing filter on
  yearFilterOn = false;
  montghFilterOn = false;

  tableData: Array<{
    id: any;
    attStatus: string;
    checkIn: any;
    checkInUpdated: any;
    checkOut: any;
    checkOutUpdated: any;
    loginTime: number;
    logoutTime: number;
    activeTime: string;
    autoLogouts: number;
  }> = []; //array to display data

  // Subject that emits when the component has been destroyed.
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private commonService: CommonService,
    private location: Location,
    private serviceInstance: EmployeeMonthlyReportService,
    private datePipe: DatePipe,
    private snack: MatSnackBar
  ) {
    let thisYear = new Date().getFullYear().toString();
    let lastYear = (new Date().getFullYear() - 1).toString();

    this.selectedYearArray = [
      { year: thisYear, name: 'This year' },
      { year: lastYear, name: 'Last year' },
    ];
  }

  ngOnInit(): void {
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        this.superUserId = allData.userDetails.superUserId;

        this.serviceInstance
          .getEmployees(this.superUserId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((products) => {
            this.employees = products.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as EmployeeModel;
            });

            this.progressBarStatus = true;

            this.filteredOptions = this.myControl.valueChanges.pipe(
              startWith(''),

              map((value) =>
                typeof value === 'string' ? value : value.fname1
              ),
              map((fname1) =>
                fname1 ? this._filter(fname1) : this.employees.slice()
              )
            );
          });
      });
  }

  private _filter(value) {
    const val = value.replace(/\s/g, '');
    return this.employees.filter((item: EmployeeModel) => {
      return (
        (
          item.employeeFirstName +
          ' ' +
          (item.employeeSecondName ? item.employeeSecondName : '')
        )
          .replace(/\s/g, '')
          .toLowerCase()
          .indexOf(val.toLowerCase()) > -1
      );
    });
  }

  // autoComplete display function
  displayFn(subject) {
    return subject
      ? subject.employeeFirstName +
          ' ' +
          (subject.employeeSecondName ? subject.employeeSecondName : '')
      : undefined;
  }

  onBack() {
    this.location.back();
  }

  // methods on employee selection
  async employeeSelected() {
    this.empSelected = false;
    if (this.selectedEmployee) {
      let eName =
        this.selectedEmployee.employeeFirstName +
        ' ' +
        (this.selectedEmployee.employeeSecondName
          ? this.selectedEmployee.employeeSecondName
          : '');

      if (typeof eName !== 'undefined') {
        this.selectedEmployeeName = eName;
        await this.getYear();
        await this.getMonth();
        let path = `${this.year}/${this.month}`;
        await this.getEmployeeDetails(path);
        this.doActions(this.month, this.year);
      }
    }
  }

  // data assigning
  doActions(month, year) {
    this.tableData = [
      {
        id: '1',
        attStatus: '',
        checkIn: null,
        checkOut: null,
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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
        checkInUpdated: null,
        checkOutUpdated: null,
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

    for (let i = 0; i < this.employeemonthlyData.length; i++) {
      let objIndex = this.tableData.findIndex(
        (obj) => obj.id == this.employeemonthlyData[i].id
      );
      this.tableData[objIndex].attStatus =
        this.employeemonthlyData[i]?.attStatus;
      this.tableData[objIndex].checkIn = this.employeemonthlyData[i]?.checkIn;
      this.tableData[objIndex].checkOut = this.employeemonthlyData[i]?.checkOut;
      this.tableData[objIndex].checkInUpdated =
        this.employeemonthlyData[i]?.checkInUpdated;
      this.tableData[objIndex].checkOutUpdated =
        this.employeemonthlyData[i]?.checkOutUpdated;
      this.tableData[objIndex].loginTime =
        this.employeemonthlyData[i]?.loginTime;
      this.tableData[objIndex].logoutTime =
        this.employeemonthlyData[i]?.logoutTime;
      this.tableData[objIndex].activeTime =
        this.employeemonthlyData[i]?.activeTime;
      this.tableData[objIndex].autoLogouts =
        this.employeemonthlyData[i]?.autoLogouts;
    }
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.data = this.tableData;
    this.progressBarStatus = true;
    if (this.employeemonthlyData?.length > 0) {
      this.empSelected = true;
    }
    setTimeout(() => {
      console.log(this.sort) //not undefined
      this.dataSource.sort = this.sort;
    })
  }

  // get attendance of selected employee
  getEmployeeDetails(path) {
    return new Promise<void>((resolve) => {
      this.serviceInstance
        .getMonthlyData(this.superUserId, this.selectedEmployee.docId, path)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          let doc = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as AttendanceModelDB;
          });

          if (doc) {
            const documntId = this.selectedEmployee.employeeID;
            let newArray = [];

            for (let i = 0; i < doc.length; i++) {
              for (let j = 1; j < 32; j++) {
                if (doc[i].id == j.toString()) {
                  Object.keys(doc[i]).filter(function (key) {
                    if (doc[i][key].employeeId === documntId) {
                      if (typeof doc[i][key].attStatus !== 'undefined') {
                        newArray.push(doc[i][key]);
                      }
                    }
                  });
                }
              }
            }

            this.employeemonthlyData = newArray.map(
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
          }

          //

          resolve();
        });
    });
  }

  // confirm year for fetching data from DB
  getYear() {
    return new Promise<void>((resolve) => {
      if (this.yearFilterOn == false) {
        this.year = new Date().getFullYear().toString(); //year only
        this.selectedYear = 'This year';

        let index = this.monthArray.indexOf(
          new Date().toLocaleString('en-us', { month: 'long' })
        );

        this.selectedMonthArray = this.monthArray.slice(0, index + 1);
      } else {
        if (this.selectedYear == 'Last year') {
          var d = new Date();
          var intYear = d.getFullYear() - 1;
          this.year = intYear.toString();

          this.selectedMonthArray = this.monthArray;
        } else if (this.selectedYear == 'This year') {
          var d = new Date();
          var intYear = d.getFullYear();
          this.year = intYear.toString();

          let index = this.monthArray.indexOf(
            new Date().toLocaleString('en-us', { month: 'long' })
          );

          this.selectedMonthArray = this.monthArray.slice(0, index + 1);
        }
      }
      resolve();
    });
  }

  // confirm month for db fetch
  getMonth() {
    return new Promise<void>((resolve) => {
      if (this.montghFilterOn == false) {
        this.month = new Date().toLocaleString('en-us', { month: 'long' }); //month only
        this.selectedMonth = this.month;
      } else {
        this.month = this.selectedMonth;
      }
      resolve();
    });
  }

  // year changed
  yearChanged() {
    this.progressBarStatus = false;
    this.yearFilterOn = true;
    if (this.selectedYear == 'Last year') {
      var d = new Date();
      var intYear = d.getFullYear() - 1;
      this.year = intYear.toString();

      this.selectedMonthArray = this.monthArray;

      this.employeeSelected();
    } else if (this.selectedYear == 'This year') {
      var d = new Date();
      var intYear = d.getFullYear();
      this.year = intYear.toString();

      let index = this.monthArray.indexOf(
        new Date().toLocaleString('en-us', { month: 'long' })
      );
      this.selectedMonthArray = this.monthArray.slice(0, index + 1);

      this.employeeSelected();
    }
  }

  // month changed
  monthChanged() {
    this.progressBarStatus = false;
    this.montghFilterOn = true;
    this.employeeSelected();
  }

  // download CSV
  onDownloadAsCsv() {
    if (this.dataSource.data?.length > 0) {
      this.csvData = [];
      this.dataSource.data.forEach((data) => {
        let arrayofest: CSVMonthlyAttModel = new CSVMonthlyAttModel(
          data.id,
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
        'Date',
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
      saveAs(blob, 'emp_monthly_report.csv');
    } else {
      this.snack.open('No Data to download', '', {
        duration: 2000,
      });
    }
  }

  // on destroy
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
