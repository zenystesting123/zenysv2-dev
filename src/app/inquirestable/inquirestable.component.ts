/**********************************************************************************
Description: component is to display the inquiries received, only if dataAccessRule is 'All'
             to create opprortunity for the inquired one/ to reject/ delete inquiry
             Child component popup-delete-inquiry is a confirmation to reject/delete an inquiry
             Only web
Inputs:
Outputs:
**********************************************************************************/
import { Inquiries, Profile, UserAccessDetails } from './../data-models';
import { InquirestableService } from './inquirestable.service';
import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { saveAs } from 'file-saver';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DatePipe, Location } from '@angular/common';
import { CommonService } from '../common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Addcontactpopup1Component } from '../addcontactpopup1/addcontactpopup1.component';

export class ArrayCsv {
  constructor(
    public Date: string,
    public Email: string,
    public Message: string,
    public Phone: number,
    public Status: string,
    public Name: string,
    public View_Status:string,
  ) {}
}//madel of inquiry csv table
export interface DialogDatain {
  id: string;
  mode: string;
  Message: string;
  Date: string;
  Name: string;
  Phone: string;
  Email: string;
  Status: string;
}//inquiry interface to define expanded element model
@Component({
  selector: 'app-inquirestable',
  templateUrl: './inquirestable.component.html',
  styleUrls: ['./inquirestable.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  providers: [DatePipe]
})
export class InquirestableComponent
  implements OnInit, OnDestroy, AfterViewInit
{

  private onDestroy$: Subject<void> = new Subject<void>(); //ng on destroy variable

  //arrays for CSV download purposes


  displayedColumns: string[] = [
    'message',
    'date',
    'name',
    'email',
    'phone',
    'status',
    'actions',
  ]; //mat-table columns
  expandedElement: DialogDatain | null; //expanded element of expandable row table

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  progressBarStatus: boolean = false;

  documentsArray: MatTableDataSource<Inquiries>; //mat-table data source
  // for filtering and rest pupose we are saving data in other arrays
  inquiryArray: MatTableDataSource<Inquiries>;
  inquiryOneArray: MatTableDataSource<Inquiries>;
  filterArray: MatTableDataSource<Inquiries>;
  resetDateArray: MatTableDataSource<Inquiries>;

  endDate = new Date(); //to fetch with date from DB last date is stored to this variable
  selectedDate1: any = null; //filtrer date 1
  selectedDate2: any = null; //filter date 2
  searchTerm: string = ''; //search filter variable
  userId: string = ''; //logged in users id
  superUserId: string = ''; //super user id

  usrProfileData: UserAccessDetails = null; //access control settings
  disableContact: boolean = false; //boolean to checvk if contact addition is restricted
  checkDataAccessRuleAll: boolean = false; //if dataAccessRule =='All', boolean to set to true
  elementArray = []; //status new is saved to this array

  isFilterApplied = 'default'; //to display headings appropriately, filter applied is checked by this boolean
  userData: Profile = null; //logged in users data
  superUserData: Profile = null; //logged in users superuser data

  csvData:ArrayCsv[]=[];//CSV download array
  inquiriesTwo:Inquiries[] = []//data of inquiries to use in csv function

  constructor(
    public dialog: MatDialog,
    private db: InquirestableService,
    private location: Location,
    private commonService: CommonService,
    private _snackBar: MatSnackBar,
    private datePipe:DatePipe
  ) {

    // fetching userdata, userid, superuserid from commonService
    this.userData = this.commonService.getUserData();
    this.userId = this.commonService.getUserId();
    this.superUserId = this.userData.superUserId;

    //get the details of user profile assigned to the user
    this.usrProfileData = this.commonService.getProfileData();
    if (this.usrProfileData) {
      if (this.usrProfileData[0]) {
        // check dataAccessRule
        if (this.usrProfileData[0].dialogdataAccessRule == 'All') {
          this.checkDataAccessRuleAll = true;
        } else if (this.usrProfileData[0].dialogdataAccessRule != 'All') {
          this.checkDataAccessRuleAll = false;
        }

        // disable add contact
        if (this.usrProfileData[0].isCheckedCont == false) {
          this.disableContact = true;
        } else {
          if (this.usrProfileData[0].contactsCreate == false) {
            this.disableContact = true;
          }
        }
      }
    }
    // function calling inquiries list from DB
    this.getInqiryListFromApi();
    this.documentsArray = new MatTableDataSource([]);
    this.resetDateArray = new MatTableDataSource([]);
    this.inquiryArray = new MatTableDataSource([]);
    this.filterArray = new MatTableDataSource([]);
    this.inquiryOneArray = new MatTableDataSource([]);
  }

  ngOnInit(): void {}

  // fetch inquiries from DB
  getInqiryListFromApi() {
    this.db
      .getInquiries(this.superUserId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Inquiries;
        });

        // inquiries stored in doc is saved to other arrays
        this.documentsArray.data = doc;
        this.inquiriesTwo = doc
        this.inquiryOneArray.data = doc;
        this.resetDateArray.data = doc;
        this.inquiryArray.data = doc;
        this.filterArray.data = doc;

        this.progressBarStatus = true;

        // if selected dates are there, showing only datas in selected dates
        if (this.selectedDate1 && this.selectedDate2) {
          let inqArray = [];
          for (let i = 0; i < this.inquiryOneArray.data.length; i++) {
            if (
              new Date(this.inquiryOneArray.data[i].date).getDate() >=
              new Date(this.selectedDate1).getDate()
            ) {
              if (
                new Date(this.inquiryOneArray.data[i].date).getDate() <=
                new Date(this.selectedDate2).getDate()
              ) {
                inqArray.push(this.inquiryOneArray.data[i]);
              }
            }
          }
          this.documentsArray.data = inqArray;
        }
      });
  }


  onDate2(e) {
    this.isFilterApplied = 'date';
    this.searchTerm = null;
    let startDate = this.selectedDate1.getTime();
    let last = this.selectedDate2;
    if (last) {
      last.setHours(23);
      last.setMinutes(59);
      last.setSeconds(59);
      last.setMilliseconds(999);
    }
    let endDate = new Date(last).getTime();

    // fetching inquiries from DB with selected dates
    this.db
      .getInquiriesFilter(this.superUserId, startDate, endDate)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        let doc = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Inquiries;
        });
        this.documentsArray.data = doc;
        this.inquiriesTwo = doc;
        // this.resetDateArray.data = doc;
        this.inquiryArray.data = doc;
        this.filterArray.data = doc;
      });
  }

  // Opportunity customer table is called and thus adding a new contact
  createOpportunity(message, date, name, phone, email, status, id) {
    this.dialog.open(Addcontactpopup1Component, {
      width: 'auto',
      height: 'auto',
      minHeight: '100px',
      data: {
        id: id,
        mode: 'create',
        Message: message,
        Date: date,
        Name: name,
        Phone: phone,
        Email: email,
        Status: status,
      },
    });
  }

  // reset arrays
  resetDate() {
    this.isFilterApplied = 'default';
    this.searchTerm = null;
    this.selectedDate1 = null;
    this.selectedDate2 = null;
    this.documentsArray.data = this.inquiryOneArray.data;
    this.resetDateArray.data = this.inquiryOneArray.data;
    this.filterArray.data = this.inquiryOneArray.data;
    this.inquiriesTwo = this.inquiryOneArray.data;
  }
  // search term filtering
  filter(query: string) {
    this.documentsArray.data = query
      ? this.resetDateArray.data.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.email.toString().includes(query.toLowerCase())
        )
      : this.inquiryArray.data;
      this.inquiriesTwo = this.documentsArray.data;
  }

  ngAfterViewInit() {
    this.documentsArray.paginator = this.paginator;
    this.documentsArray.sort = this.sort;
  }

  onBack() {
    this.location.back();
  }

  // CSV download function
  onDownloadAsCsv(){
    if(this.inquiriesTwo.length>0){
    this.csvData= [];
    this.inquiriesTwo.forEach((data) => {
      let arrayofest: ArrayCsv = new ArrayCsv(
        new Date(data.date).toLocaleString(),
        data.email,
        data.message,
        data.phone,
        data.status,
        data.name,
        data.viewStatus==true?'Viewed':'New'

      );
      this.csvData.push(arrayofest);
    });
    const replacer = (key, value) => (value === null ? '' : value);
    const header = Object.keys(this.csvData[0]);
    let csv = this.csvData.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], { type: 'text/csv' });
    saveAs(blob, 'inquiries_report.csv');
  }else {
    this._snackBar.open('No data to download', '', {
      duration: 2000,
    });
  }
  }

  // filetring function
  filtering(data:string){
    if(data == 'viewed'){
      this.isFilterApplied = 'viewed';
      let filter = [];
      for (let i = 0; i < this.filterArray.data.length; i++) {
        if (this.filterArray.data[i].viewStatus == true) {
          if (this.filterArray.data[i].status == 'No action taken') {
            filter.push(this.filterArray.data[i]);
          }
        }
      }
      this.documentsArray.data = filter;
    }else if(data == 'new'){
      this.isFilterApplied = 'new';
      this.documentsArray.data = this.filterArray.data.filter(
        (p) => p.viewStatus == false
      );
    }else if(data == 'rejected'){
      this.isFilterApplied = 'rejected';
      this.documentsArray.data = this.filterArray.data.filter(
        (p) => p.status == 'Rejected'
      );
    }else if(data == 'contact'){
      this.isFilterApplied = 'contCreated';
      this.documentsArray.data = this.filterArray.data.filter(
        (p) => p.status == 'Opportunity Created'
      );
    }
    this.inquiriesTwo = this.documentsArray.data;
  }

  // function to make status viewed on expanding a row
  getRecord(element) {
    // chevk for element viewstatus, if its false, then inquiry is pushed to element array
    // if element array length  > 0, update its viewStatus as viewed to DB, and make the element array empty
    // we are checking expanded elemet is null, to prevent data updating on viewing and thus automatically refreshing
    if (this.expandedElement == null) {//step 2:case1:if the expanded element is closed, and element array has an element of which status to be updated in Db, it will get updated
      if (this.elementArray.length > 0) {
        this.updateInq();
      }
    } else {
      if (element.viewStatus == false) {
        if (this.elementArray.length > 0) {//step2:case 3:without closing, another row is expanded and its view status is also false, now we have two rows to be updated in DB
          this.updateInq();
        }
        this.elementArray.push(element);// step 1:a row is expanded and if the clicked rows view status is false, pusth the element to element array
      } else {
        if (this.elementArray.length > 0) {//step 2:case2:without closing the expanded element,try to expand another row, whose view status is false, then check if element array has any pending data to be updated in DB, thus updating it
          this.updateInq();
        }
      }
    }
  }
// update view status as false to DB
updateInq(){
  this.db
  .updateinquiry(this.superUserId, this.elementArray[0].id, true)
  .then((res) => {
    this.elementArray = [];
  })
  .catch((e) => {
    console.log(e);
  });
}

  // delte an inquiry after confirming it on a popup
  deleteInquiry(name, id) {
    const dialogRef = this.dialog.open(PopupDeleteInquiry, {
      width: '400px',
      data: {
        scenario: 'delete',
        name: name,
        id: id,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        // console.log(result)
        if (result) {
          this.db
            .deleteInquiry(this.superUserId, result)
            .then((res) => {
              this._snackBar.open('Inquiry deleted', '', {
                duration: 500,
              });
            })
            .catch((e) => {
              console.log(e);
              this._snackBar.open('Error while deleting', '', {
                duration: 500,
              });
            });
        }
      });
  }

  // rejecting inquiry function
  rejectInquiry(name, id) {
    const dialogRef = this.dialog.open(PopupDeleteInquiry, {
      width: '400px',
      data: {
        scenario: 'reject',
        name: name,
        id: id,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        // console.log(result)
        if (result) {
          this.db
            .rejectInquiry(this.superUserId, result)
            .then((res) => {
              this._snackBar.open('Inquiry rejected', '', {
                duration: 500,
              });
            })
            .catch((e) => {
              console.log(e);
              this._snackBar.open('Error while rejecting', '', {
                duration: 500,
              });
            });
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
// delete inquiry popup class starts here
@Component({
  selector: 'popup-delete-inquiry',
  templateUrl: 'popup-delete-inquiry.html',
  styleUrls: ['./inquirestable.component.scss'],
})
export class PopupDeleteInquiry {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<PopupDeleteInquiry>
  ) {
    // console.log(this.data)
  }
  onNoClick() {
    this.dialogRef.close();
  }
}
// delete inquiry popup class ends here
