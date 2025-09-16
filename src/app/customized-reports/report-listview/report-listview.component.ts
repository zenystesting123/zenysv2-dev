/*-----------------------------------------------------------
Description : Listing report based on the module and can delete the report 
--------------------------------------------------------------*/

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/common.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { CreateNewComponent } from '../create-new/create-new.component';
import { MatDialog } from '@angular/material/dialog';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportServiceService } from '../report-view/report-service.service';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { Profile, ReportSettings } from 'src/app/data-models';

@Component({
  selector: 'app-report-listview',
  templateUrl: './report-listview.component.html',
  styleUrls: ['./report-listview.component.scss'],
})
export class ReportListviewComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>(); //Subject that emits when the component has been destroyed.
  reportSettingsArray :ReportSettings[]= []; //report settings
  salesArray = []; //sales array
  productsArray = []; //Products in sale array
  customerArray = []; // customer array
  serviceArray = [];//Service array
  callArray = []; //call array
  taskArray = []; // task array
  quotationArray = []; //Quotations array
  invoiceArray = [];//Invoice array
  estimateArray = [];//Quotations array
  paymentArray = [];//Collection array
  expenseArray = [];// Expense array
  reportArray = []; //array
  userId: string;
  dialogRef: any;
  // customisable field names
  fieldNameContact: string = 'Contact';
  fieldNameSale: string = 'Sale';
  fieldNameService: string = 'Support';
  fieldNameFollowup: string = 'FollowUp';
  fieldNameTask: string = 'Task';
  fieldNameMeeting: string = 'Meeting';
  fieldNameEstimate: string = 'Estimate';
  fieldNameQuotation: string = 'Quotation';
  fieldNameInvoice: string = 'Invoice';
  fieldNameCollection: string = 'Collection';
  fieldNameExpense: string = 'Expense';
  fieldNameItems: string = 'Products and Service';
  networkConnection: boolean; // checks network connection
  reportListSubscription: Subscription;
  userDataSubscription: Subscription;
  superUserDetails: Profile;
  constructor(
    private _location: Location,
    public commonService: CommonService,
    private snackBar: MatSnackBar,
    private reportService: ReportServiceService,
    public dialog: MatDialog,
    public networkCheck: NetworkCheckService,
  ) { }

  ngOnInit(): void {
    this.userDataSubscription = this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        this.userId = allData.authDetails.uid;
        this.superUserDetails = allData.superUserDetails;
        if (allData.userDetails.superUserId) {
          // customisable field names assigning
          if (allData.superUserDetails.fieldNames) {
            this.fieldNameContact =
              allData.superUserDetails.fieldNames.fieldNameContact;
            this.fieldNameSale =
              allData.superUserDetails.fieldNames.fieldNameSale;
            this.fieldNameTask =
              allData.superUserDetails.fieldNames.fieldNameTask;
            this.fieldNameMeeting =
              allData.superUserDetails.fieldNames.fieldNameMeeting;
            this.fieldNameFollowup =
              allData.superUserDetails.fieldNames.fieldNameFollowup;
            this.fieldNameEstimate =
              allData.superUserDetails.fieldNames.fieldNameEstimate;
            this.fieldNameQuotation =
              allData.superUserDetails.fieldNames.fieldNameQuotation;
            this.fieldNameInvoice =
              allData.superUserDetails.fieldNames.fieldNameInvoice;
            this.fieldNameCollection =
              allData.superUserDetails.fieldNames.fieldNameCollection;
            this.fieldNameExpense =
              allData.superUserDetails.fieldNames.fieldNameExpense;
            this.fieldNameItems =
              allData.superUserDetails.fieldNames.fieldNameItems;
            this.fieldNameService = allData.superUserDetails.fieldNames.fieldNameService;
          }
        }
        this.getReportList();
      });
  }
  //add reports to respective arrays
  reportFilter() {
    this.customerArray = [];
    this.salesArray = [];
    this.productsArray = [];
    this.taskArray = [];
    this.callArray = [];
    this.serviceArray = [];
    this.invoiceArray = [];
    this.quotationArray = [];
    this.estimateArray = [];
    this.paymentArray = [];
    this.expenseArray = [];
    this.reportSettingsArray.forEach((element) => {
      if (element.module == 'customers') {
        this.customerArray.push(element);
      } else if (element.module == 'sales') {
        this.salesArray.push(element);
      } else if (element.module == 'products') {
        this.productsArray.push(element);
      } else if (element.module == 'tasks') {
        this.taskArray.push(element);
      } else if (element.module == 'Follow Ups') {
        this.callArray.push(element);
      } else if (element.module == 'services') {
        this.serviceArray.push(element);
      } else if (element.module == 'Invoices') {
        this.invoiceArray.push(element);
      } else if (element.module == 'Quotations') {
        this.quotationArray.push(element);
      } else if (element.module == 'Estimates') {
        this.estimateArray.push(element);
      } else if (element.module == 'paymentsreceived') {
        this.paymentArray.push(element);
      } else if (element.module == 'Expenses') {
        this.expenseArray.push(element);
      }
    });
  }
  //to load respective report
  selection(item: string) {
    this.commonService.selectedReportListModule = item;// bind current view to common service while moving to another page and come back previous view will display
    if (item == 'sale') {
      this.reportArray = this.salesArray;
    } else if (item == 'customer') {
      this.reportArray = this.customerArray;
    } else if (item == 'products') {
      this.reportArray = this.productsArray;
    }
    else if (item == 'task') {
      this.reportArray = this.taskArray;
    } else if (item == 'call') {
      this.reportArray = this.callArray;
    }
    else if (item == 'services') {
      this.reportArray = this.serviceArray;
    } else if (item == 'invoice') {
      this.reportArray = this.invoiceArray;
    } else if (item == 'quotation') {
      this.reportArray = this.quotationArray;
    } else if (item == 'estimate') {
      this.reportArray = this.estimateArray;
    } else if (item == 'expense') {
      this.reportArray = this.expenseArray;
    } else if (item == 'payment') {
      this.reportArray = this.paymentArray;
    }
  }
  //navigate to home-dashboard
  onBack() {
    this._location.back();
  }
  createNewReport() {
    //open the dialog to customize the table fields
    this.dialogRef = this.dialog.open(CreateNewComponent, {
      width: '600px',
      data: {
        userId: this.userId,
        superUserDetails: this.superUserDetails
      }
    });
  }
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  // delete report
  deleteReport(id, title) {
    let dialogref = this.dialog.open(ConfirmationpopupComponent, {
      width: '400px',
      data: {
        smode: 'delete_report',
        viewName: title,
        reportId: id,
        userId: this.userId,
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res == 'reportdeleted') {
        this.snackBar.open('Report has been deleted', '', { duration: 2000 });
      }
    });
  }
  // get report list
  getReportList() {
    this.reportListSubscription = this.reportService
      .getReports(this.userId)
      .subscribe((data) => {
        this.reportSettingsArray = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as ReportSettings;
        });
        this.reportFilter();
        this.selection(this.commonService.selectedReportListModule);
      });
  }
  ngOnDestroy(): void {
    this.reportListSubscription?.unsubscribe();
    this.userDataSubscription?.unsubscribe();
  }
}
