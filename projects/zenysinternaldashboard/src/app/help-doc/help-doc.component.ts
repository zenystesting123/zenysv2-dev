import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HelpDocService } from './help-doc.service';
import {
  HelpContentModel,
  HelpTopicsModel,
  HelpVideoModel,
} from './help.model';

@Component({
  selector: 'app-help-doc',
  templateUrl: './help-doc.component.html',
  styleUrls: ['./help-doc.component.scss'],
})
export class HelpDocComponent implements OnInit {
  displayPage = 'DASH HOME';
  videoURL: string;
  snippetsArray = [];
  pageQuerying: string;
  typesOfPages: string[] = [
    'DASH HOME',
    'CUSTOMER REPORT',
    'SALES REPORT',
    'TEAM SALE REPORT',
    'PRODUCT SALE',
    'SUPPORT REPORT',
    'TASK REPORT',
    'FOLLOWUP REPORT',
    'INVOICE REPORT',
    'DASHBOARD GRID',
    'CUSTOM REPORTS',
    'PRODUCT AND SERVICE WISE SALES',
    'SERVICE LIST',
    'SERVICE DETAILS',
    'UPLOAD FILES',
    'SERVICE SETTINGS',
    'FIELD NAME SETTINGS',
    'PRODUCT SETTINGS',
    'GENERAL SETTINGS',
    'FOLLOW UP SETTINGS',
    'MESSAGE TEMPLATES',
    'CONTACTS LIST',
    'CONTACT DETAILS',
    'SALES LIST',
    'SALES DETAILS',
    'INQUIRY LIST',
    'CHAT',
    'AUTOMATIONS',
    'DASHBOARD',
    'ESTIMATE LIST',
    'QUOTATION LIST',
    'INVOICE LIST',
    'COLLECTION LIST',
    'EXPENSE LIST',
    'ITEMS',
    'TASKS',
    'MEETING',
    'FOLLOWUP LIST',
    'CONTACT SETTINGS',
    'SALE SETTINGS',
    'EXPENSE SETTINGS',
    'PROFILE SETTINGS',
    'DOCUMENT SETTINGS',
    'SUBUSERS SETTINGS',
    'EMAIL SETTINGS',
    'UPLOAD CUSTOMER EXCEL',
    'ORGANISATION LIST',
    'TASK SETTINGS',
    'PAYMENT SETTINGS',
    'ORGANISATION SETTINGS',
    'LEAD CAPTURE SETTINGS',
    'PRODUCTS CATEGORIES',
    'ORGANIZATION DETAILS',
    'SETTINGS',
    'REPORTS LIST',
    'REPORTS CHILD',
    'EST CREATE',
    'QUOT CREATE',
    'INV CREATE',
    'INVOICE',
    'QUOTATION',
    'ESTIMATE',
    'FB INTEGRATION',
  ];
  HELP_DATA: HelpContentModel[];
  displayedColumns = [
    'position',
    'title',
    'snippet',
    'content',
    'contentLink',
    'actions',
  ];
  dataSource: any;
  pageisSelected: boolean = false;
  oninit: boolean = true;

  constructor(
    private afAuth: AngularFireAuth,
    private location: Location,
    private router: Router,
    private serviceInstance: HelpDocService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.pageQuerying = 'dashHome';
    if (this.pageQuerying) {
      this.getVideoURL(this.pageQuerying);
      this.getHelpTopics(this.pageQuerying);
    }
  }
  addnewPage() {
    const dialogRef = this.dialog.open(AddNewPage, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
      }
    });
  }
  selectedPage(page) {
    this.pageisSelected = true;
    this.displayPage = page;
    // console.log(page)
    // dash home
    if (page == 'DASH HOME') {
      this.pageQuerying = 'dashHome';
    }
    // contacts list
    if (page == 'CONTACTS LIST') {
      this.pageQuerying = 'contactsList';
    }
    // salesList
    if (page == 'SALES LIST') {
      this.pageQuerying = 'salesList';
    }
    // salesList
    if (page == 'PRODUCT AND SERVICE WISE SALES') {
      this.pageQuerying = 'prodServWiseSaleList';
    }
    // servicesList
    if (page == 'SERVICE LIST') {
      this.pageQuerying = 'servicesList';
    }
    // inquiries
    if (page == 'INQUIRY LIST') {
      this.pageQuerying = 'inquiries';
    }
    // Dashboard
    if (page == 'DASHBOARD') {
      this.pageQuerying = 'dashboard';
    }
    // Estimates
    if (page == 'ESTIMATE LIST') {
      this.pageQuerying = 'estimates';
    }
    // Quotations
    if (page == 'QUOTATION LIST') {
      this.pageQuerying = 'quotations';
    }
    // invoices
    if (page == 'INVOICE LIST') {
      this.pageQuerying = 'invoices';
    }
    // collections
    if (page == 'COLLECTION LIST') {
      this.pageQuerying = 'collections';
    }
    // expenses
    if (page == 'EXPENSE LIST') {
      this.pageQuerying = 'expenses';
    }
    // Products and Services
    if (page == 'ITEMS') {
      this.pageQuerying = 'Items';
    }
    // tasks
    if (page == 'TASKS') {
      this.pageQuerying = 'tasks';
    }
    // meetings
    if (page == 'MEETING') {
      this.pageQuerying = 'calendar';
    }
    // followups
    if (page == 'FOLLOWUP LIST') {
      this.pageQuerying = 'followUps';
    }
    // customersettings
    if (page == 'CONTACT SETTINGS') {
      this.pageQuerying = 'customerSettings';
    }
    // salesettings
    if (page == 'SALE SETTINGS') {
      this.pageQuerying = 'saleSettings';
    }
    // expense settings
    if (page == 'EXPENSE SETTINGS') {
      this.pageQuerying = 'expenseSettings';
    }
    // profile settings
    if (page == 'PROFILE SETTINGS') {
      this.pageQuerying = 'profileSettings';
    }
    // doc settings
    if (page == 'DOCUMENT SETTINGS') {
      this.pageQuerying = 'docSettings';
    }
    // subuser settings
    if (page == 'SUBUSERS SETTINGS') {
      this.pageQuerying = 'subUserSettings';
    }
    // email settings
    if (page == 'EMAIL SETTINGS') {
      this.pageQuerying = 'emailSettings';
    }
    // service settings
    if (page == 'SERVICE SETTINGS') {
      this.pageQuerying = 'serviceSettings';
    }
    // field name settings
    if (page == 'FIELD NAME SETTINGS') {
      this.pageQuerying = 'fieldNameSettings';
    }
    // product settings
    if (page == 'PRODUCT SETTINGS') {
      this.pageQuerying = 'productSettings';
    }
    // general settings
    if (page == 'GENERAL SETTINGS') {
      this.pageQuerying = 'generalSettings';
    }
    // followup settings
    if (page == 'FOLLOW UP SETTINGS') {
      this.pageQuerying = 'followUpSettings';
    }
    // contact details
    if (page == 'CONTACT DETAILS') {
      this.pageQuerying = 'contactDetails';
    }
    // sales details
    if (page == 'SALES DETAILS') {
      this.pageQuerying = 'salesDetails';
    }
    // services details
    if (page == 'SERVICE DETAILS') {
      this.pageQuerying = 'servicesDetails';
    }
    // chat
    if (page == 'CHAT') {
      this.pageQuerying = 'chat';
    }
    // automations
    if (page == 'AUTOMATIONS') {
      this.pageQuerying = 'automationList';
    }
    // upload-customer-excel
    if (page == 'UPLOAD CUSTOMER EXCEL') {
      this.pageQuerying = 'uploadCustomerExcel';
    }
    // upload-files
    if (page == 'UPLOAD FILES') {
      this.pageQuerying = 'uploadFiles';
    }
    // upload-files
    if (page == 'MESSAGE TEMPLATES') {
      this.pageQuerying = 'messageTemplates';
    }
    // REPORTS
    if (page == 'REPORTS') {
      this.pageQuerying = 'reports';
    }
    // CUSTOMER REPORT
    if (page == 'CUSTOMER REPORT') {
      this.pageQuerying = 'customerReports';
    }
    // SALES REPORT
    if (page == 'SALES REPORT') {
      this.pageQuerying = 'salesReports';
    }
    // TEAM SALE REPORT
    if (page == 'TEAM SALE REPORT') {
      this.pageQuerying = 'teamSaleReports';
    }
    // PRODUCT SALE
    if (page == 'PRODUCT SALE') {
      this.pageQuerying = 'productSales';
    }
    // SUPPORT REPORT
    if (page == 'SUPPORT REPORT') {
      this.pageQuerying = 'supportReports';
    }
    // TASK REPORT
    if (page == 'TASK REPORT') {
      this.pageQuerying = 'taskReports';
    }
    // FOLLOWUP REPORT
    if (page == 'FOLLOWUP REPORT') {
      this.pageQuerying = 'followUpReports';
    }
    // INVOICE REPORT
    if (page == 'INVOICE REPORT') {
      this.pageQuerying = 'invoiceReports';
    }
    // DASHBOARD
    if (page == 'DASHBOARD GRID') {
      this.pageQuerying = 'dashboardGrid';
    }
    // CUSTOM REPORTS
    if (page == 'CUSTOM REPORTS') {
      this.pageQuerying = 'customReports';
    }
    //Organisation list
    if (page == 'ORGANISATION LIST') {
      this.pageQuerying = 'orgList';
    }
    // task settings
    if (page == 'TASK SETTINGS') {
      this.pageQuerying = 'taskSett';
    }
    // payment settings
    if (page == 'PAYMENT SETTINGS') {
      this.pageQuerying = 'paymentSett';
    }
    // org settings
    if (page == 'ORGANISATION SETTINGS') {
      this.pageQuerying = 'orgSett';
    }
    // lead capture settings
    if (page == 'LEAD CAPTURE SETTINGS') {
      this.pageQuerying = 'leadCaptureSett';
    }
    // products-categories
    if (page == 'PRODUCTS CATEGORIES') {
      this.pageQuerying = 'prodCategories';
    }
    // org details
    if (page == 'ORGANIZATION DETAILS') {
      this.pageQuerying = 'orgDetails';
    }
    // settings
    if (page == 'SETTINGS') {
      this.pageQuerying = 'settingsPage';
    }
    // reports list
    if (page == 'REPORTS LIST') {
      this.pageQuerying = 'reportsList';
    }
    // reports details
    if (page == 'REPORTS CHILD') {
      this.pageQuerying = 'reportsChild';
    }
    // estimate create
    if (page == 'EST CREATE') {
      this.pageQuerying = 'estCreate';
    }
    // quot create
    if (page === 'QUOT CREATE') {
      this.pageQuerying = 'quotCreate';
    }
    // inv create
    if (page === 'INV CREATE') {
      this.pageQuerying = 'invCreate';
    }
    // inv display
    if (page === 'INVOICE') {
      this.pageQuerying = 'invPage';
    }
    // quotation
    if (page === 'QUOTATION') {
      this.pageQuerying = 'quotPage';
    }
    // estimate
    if (page === 'ESTIMATE') {
      this.pageQuerying = 'estPage';
    }
    // fb integration
    if (page === 'FB INTEGRATION') {
      this.pageQuerying = 'fbIntegration';
    }
    if (this.pageQuerying) {
      // check if collection exists then fetch data else create a collection with dummy data
      this.serviceInstance
        .contentexists(this.pageQuerying)
        .toPromise()
        .then((res) => {
          if (res.exists) {
            // console.log("collection exists");
            this.getVideoURL(this.pageQuerying);
            this.getHelpTopics(this.pageQuerying);
          } else {
            // console.log("collection not exists");
            // to add DUMMY DATA from page
            this.serviceInstance.contentfn(this.pageQuerying).then((res) => {
              // this.serviceInstance.videofn(this.pageQuerying).then(r => {
              //   console.log("DUMMY DATA added")
              // })
            });
          }
        });
    }
  }
  // videoURL fetching from DB
  getVideoURL(pageQuerying) {
    this.serviceInstance.getHelpVideos(pageQuerying).subscribe((data) => {
      let video = data.map((e) => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as {}),
        } as HelpVideoModel;
      });
      if (video) {
        if (video[0]) {
          this.videoURL = video[0].link;
        }
      }
    });
  }
  // helpTopics collections fetching from DB
  getHelpTopics(pageQuerying) {
    this.serviceInstance.getHelpTopics(pageQuerying).subscribe((data) => {
      let HelpTopics = data.map((e) => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as {}),
        } as HelpTopicsModel;
      });
      if (HelpTopics) {
        if (HelpTopics[0]) {
          this.snippetsArray = HelpTopics[0].helpTopic;
          this.HELP_DATA = HelpTopics[0].helpTopic;
          this.dataSource = new MatTableDataSource([]);
          this.dataSource.data = this.HELP_DATA;
        }
      }
    });
  }
  logout() {
    this.afAuth.signOut();
    this.router.navigate(['/zenysinternaldashboard/login']);
  }
  onBack() {
    this.location.back();
  }
  saveChanges() {
    const list = [];
    for (var i = 0; i < this.dataSource.data.length; i++) {
      list.push(i);
    }
    let positionArray = [];
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].position) {
        positionArray.push(this.dataSource.data[i].position - 1);
      }
    }

    const containsAll = (arr1, arr2) =>
      arr2.every((arr2Item) => arr1.includes(arr2Item));

    const sameMembers = (arr1, arr2) =>
      containsAll(arr1, arr2) && containsAll(arr2, arr1);

    if (positionArray.length != this.dataSource.data.length) {
      this.snackBar.open('Position cannot be empty', 'error', {
        duration: 2000,
      });
    } else if (positionArray.some((v) => v < 0)) {
      this.snackBar.open('Position cannot be 0, please start from 1', 'error', {
        duration: 2000,
      });
    } else if (sameMembers(list, positionArray)) {
      let reorderedArray = positionArray.map((i) => this.dataSource.data[i]);
      this.serviceInstance
        .saveHelpTopics(reorderedArray, this.pageQuerying)
        .then((res) => {
          this.snackBar.open('Successfully', 'updated', {
            duration: 2000,
          });
        });
    } else {
      this.snackBar.open('Position must be continuos', 'error', {
        duration: 2000,
      });
    }
  }

  saveVideo() {
    this.serviceInstance
      .saveVideoURL(this.videoURL, this.pageQuerying)
      .then((res) => {
        console.log('video URL saved');
      });
  }
  // Adds new user.
  addRow() {
    this.dataSource.data.push(
      this.createNewSnippet(this.dataSource.data.length + 1)
    );
    this.dataSource.filter = '';
  }
  createNewSnippet(id: number): HelpContentModel {
    return {
      position: id,
      title: '',
      snippet: '',
      content: '',
      contentLink: '',
    };
  }
  remove(element) {
    this.HELP_DATA = this.HELP_DATA.filter(function (value) {
      return value != element;
    });

    // change positions accordingly
    for (let i = 0; i < this.HELP_DATA.length; i++) {
      this.HELP_DATA[i].position = i + 1;
    }
    this.dataSource.data = this.HELP_DATA;

    // save to Db also
    this.serviceInstance
      .saveHelpTopics(this.HELP_DATA, this.pageQuerying)
      .then((res) => {
        this.snackBar.open('Snippet', 'deleted', {
          duration: 2000,
        });
      });
  }
}
@Component({
  selector: 'add-new-page',
  templateUrl: 'add-new-page.html',
  styleUrls: ['./help-doc.component.scss'],
})
export class AddNewPage {
  constructor(private dialogRef: MatDialogRef<AddNewPage>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
