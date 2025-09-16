/*****************************************************
Descrition : table for invoice, take data dynamically based on the page size
 * ************************************************************* */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent,
} from '@angular/material/paginator';
import { Subject, Subscription } from 'rxjs';
import {
  Branch,
  DisplayColumn,
  Invoice,
  Profile,
  SettingsItem,
  SubUsers,
  contactSettings,
  defaultContactSettings,
  defaultSaleSettings,
} from 'src/app/data-models';
import { InvoiceTableColumns } from 'src/app/model/custom-report.model';
import { InvPaginatorIntl } from './invoice-paginator-intl';
import { CommonService } from 'src/app/common.service';
import { InvoiceTableService } from './invoice-table.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { CustomReportTableService } from 'src/app/custom-tables/custom-report-table/custom-report-table.service';
import { InvoiceListService } from 'src/app/documents/invoice-list/invoice-list.service';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceTableColumnsInvPlan } from 'src/app/model/custom-report-invoicing.model';
import { CustomTableSettingsComponent } from 'src/app/custom-tables/custom-table-settings/custom-table-settings.component';

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: InvPaginatorIntl }],
})
export class InvoiceTableComponent implements OnInit {
  commonServiceUserSubscription: Subscription; // used for unsubscribe user subscription
  getDataSubscription: Subscription; // used for unsubscribe invoice data subscription
  private onDestroy$: Subject<void> = new Subject<void>();
  userId: string; // current user id
  superUserId: string; // super user id
  columnsDispaly = []; // table columns configuration
  // invSettings: documentSett = defaultSaleSettings.CONST_VALUE; // custoer settigs configuration
  tableDefaultData = InvoiceTableColumns; // table columns configuration . used for adding new field which is added on modal
  displayName: string = 'displayInvoiceColumns'; // field for saving table settings
  tableName: string = 'Invoice'; // table name
  userIdsArray: any[] = []; // users id
  userNamesArray: any[] = []; // users names
  customFieldsInvoices: any[]; // invoice additional fields
  accountType: string = ''; //accountType of logged in user
  displayedColumns = []; // for getting the selected column for displaying in the table
  // custom field names
  fieldNameContact: string = 'Contact';
  fieldNameSale: string = 'Sale';
  fieldNameInvoice: string = 'Invoice';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  totalItems = 0; // invoice list length used for pagination
  pageSizeOptions: number[] = [10, 20, 30]; //page size options for table
  firstSetDataLoaded: boolean = false; // for calling the getData fn only once in oninit
  superUserDetails: Profile = null; //super user details of logged in user
  userEmail = ''; //logged in users email
  userName = ''; //logged in users full name
  userFirstName = ''; //logged in users firstname
  userSecondName = ''; //logged in users sec name
  allSubUsers = []; //all subusers array under this superuser
  branches: Branch[]; // list of branches
  subUsers: SubUsers[] = []; // sub users list

  disableDownloadInvoice: boolean = false; //disable download invoice
  disableViewInvoice: boolean = false; //disable view invoice

  isLoading: boolean = true; // for displaying spinner while data is loading
  viewSelectionArray: string[] = ['Assigned to me', 'Created by me']; // first view selection array
  viewSettingSelected: string = 'Assigned to me'; // first view seleceted
  dateIndexMap = new Map<number, string>(); //for saing last document date readed
  docIdIndexMap = new Map<number, string>(); //for saing last document id readed
  networkConnection: boolean; //to check network connection
  paginatorIntl: MatPaginatorIntl;
  pipelineNameArray: Array<string> = [];
  selectedInvoice: Invoice = null;
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE; // custoer settigs configuration
  saleTitleSettings: SettingsItem = defaultSaleSettings.CONST_VALUE.saleTitle;

  constructor(
    public commonService: CommonService,
    public tableService: InvoiceTableService,
    public chageDetection: ChangeDetectorRef,
    public datepipe: DatePipe,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    public networkCheck: NetworkCheckService,
    private serviceInstance: CustomReportTableService,
    public invListService: InvoiceListService,
    private customPaginatorIntl: InvPaginatorIntl
  ) {
    this.paginatorIntl = customPaginatorIntl;
    //initialize array
    this.tableService.invList = new MatTableDataSource([]);
    this.branches = this.commonService.branches;
  }

  ngOnInit(): void {
    this.commonServiceUserSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (!allData.userDetails.enableLiteMode) {
          this.router.navigate(['dash/documents-list/Invoicelist']);
        } else {
          //get the details of user profile assigned to the user
          if (allData.usrProfileData) {
            // disable quotation create and view
            if (allData.usrProfileData.isCheckedSalesInv == false) {
              this.disableViewInvoice = true; // disable view quotation
              this.disableDownloadInvoice = true;
            } else {
              if (allData.usrProfileData.salesDViewInv == false) {
                this.disableViewInvoice = true; // disable view quotation
              }
              if (allData.usrProfileData.invDownload == false) {
                this.disableDownloadInvoice = true;
              }
            }
          }
          this.userId = allData.userId;

          this.subUsers = allData.subUsers;
          this.superUserId = allData.userDetails.superUserId;
          this.superUserDetails = allData.superUserDetails;
          this.allSubUsers = this.commonService.createUserlist('All', 'any')[1];

          if (allData.userDetails.firstname)
            this.userFirstName = allData.userDetails.firstname;
          if (allData.userDetails.lastname)
            this.userSecondName = allData.userDetails.lastname;
          this.userEmail = allData.userDetails.email;
          this.userName =
            allData.userDetails.firstname +
            ' ' +
            (allData.userDetails.lastname ? allData.userDetails.lastname : '');
          //get customer setting configuration
          if (
            allData.superUserDetails.contactSettings &&
            typeof allData.superUserDetails.contactSettings !== 'undefined' &&
            allData.superUserDetails.contactSettings !== null
          ) {
            this.contactSettings = allData.superUserDetails.contactSettings;
          }
          if (
            allData.superUserDetails.saleSettings &&
            typeof allData.superUserDetails.saleSettings !== 'undefined' &&
            allData.superUserDetails.saleSettings !== null
          ) {
            this.saleTitleSettings =
              allData.superUserDetails.saleSettings.saleTitle;
          }
          // get field name
          if (allData.superUserDetails.fieldNames) {
            this.fieldNameContact =
              this.superUserDetails.fieldNames.fieldNameContact;
            this.fieldNameSale = this.superUserDetails.fieldNames.fieldNameSale;
            this.fieldNameInvoice =
              allData.superUserDetails.fieldNames.fieldNameInvoice;
          }

          this.accountType = allData.userDetails.accountType;
          this.customFieldsInvoices =
            allData.superUserDetails.customFieldsInvoices;

          // this.customFieldsI = allData.superUserDetails.customFieldsInvoices;
          let displayColumnsSaved: DisplayColumn[] = [];
          if (allData.userDetails.displayInvoiceColumns) {
            displayColumnsSaved = allData.userDetails.displayInvoiceColumns;
          }
          if (displayColumnsSaved.length > 0) {
            //if table settings are stored in db, use the stored data
            this.columnsDispaly = allData.userDetails.displayInvoiceColumns;
            // remove select column if settings already saved in DB
            var ind = this.columnsDispaly.findIndex(
              (p) => p.columnDef == 'select'
            );
            if (ind > -1) {
              this.columnsDispaly.splice(ind, 1);
            }
          } else {
            if (allData.superUserDetails.plan == 'invoicing') {
              this.columnsDispaly = InvoiceTableColumnsInvPlan;
              this.tableDefaultData = InvoiceTableColumnsInvPlan;
            } else {
              this.columnsDispaly = InvoiceTableColumns;
            }
          }
          [this.userIdsArray, this.userNamesArray] =
            this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names

          // configure table display
          this.configureTable();
          if (this.tableService.pageIndex > 0) {
            this.pageSizeOptions = [];
          } else {
            this.pageSizeOptions = [10, 20, 30];
          }
          // get first set of data based on the page size and page index.
          if (!this.firstSetDataLoaded) {
            if (this.tableService.filterViewSelected == 'This Week') {
              this.tableService.viewSelected =
                'This Week ' + this.fieldNameInvoice; // for displaying viewname in toolbar
            } else if (this.tableService.filterViewSelected == 'This Month') {
              this.tableService.viewSelected =
                'This Month ' + this.fieldNameInvoice; // for displaying viewname in toolbar
            } else if (this.tableService.filterViewSelected == 'This Quarter') {
              this.tableService.viewSelected =
                'This Quarter ' + this.fieldNameInvoice; // for displaying viewname in toolbar
            } else if (this.tableService.filterViewSelected == 'This Year') {
              this.tableService.viewSelected =
                'This Year ' + this.fieldNameInvoice; // for displaying viewname in toolbar
            }
            this.getData(this.tableService.pageIndex);
            this.firstSetDataLoaded = true;
          }
        }
      }
    );
  }
  configureTable() {
    //removing additional field if it is removed from settings
    this.customFieldsInvoices?.forEach((element, index) => {
      if (!element.isActive) {
        for (var i = this.columnsDispaly?.length - 1; i >= 0; i--) {
          if (
            this.columnsDispaly[i]?.fieldType == 'Additional' &&
            this.columnsDispaly[i]?.columnDef == element.fieldName &&
            this.columnsDispaly[i]?.ind == index
          ) {
            this.columnsDispaly?.splice(i, 1);
          }
        }
      }
    });
    /*check and add the custom fields if not present*/
    this.customFieldsInvoices?.forEach((element, index) => {
      if (element.isActive) {
        let field = this.customFieldsInvoices[index].fieldName;
        let fieldPresent = false;
        this.columnsDispaly.forEach((col) => {
          if (
            col.ind == index &&
            col.fieldType == 'Additional' &&
            (col.columnDef != element.fieldName ||
              col.header != element.fieldName)
          ) {
            col.columnDef = element.fieldName;
            col.header = element.fieldName;
          }
          if (col.columnDef == field) {
            fieldPresent = true;
          }
        });
        if (fieldPresent == false) {
          this.columnsDispaly.push({
            columnDef: this.customFieldsInvoices[index].fieldName,
            header: this.customFieldsInvoices[index].fieldName,
            display: false,
            type: this.customFieldsInvoices[index].fieldType,
            fieldType: 'Additional',
            ind: index,
          });
        }
      }
    });

    // for handling any new fields added in data model
    let filteredColumns = []; //temp array for storing the columns that are to be displayed
    let object1Names = this.tableDefaultData.map((obj) => obj.columnDef); // for caching the result
    let objectNames = this.columnsDispaly.map((obj) => obj.columnDef); // for caching the result
    object1Names.filter((ele) => {
      if (!objectNames?.includes(ele)) {
        this.tableDefaultData.filter((data) => {
          if (data.columnDef === ele) {
            this.columnsDispaly.push(data);
            return;
          }
        });
      }
    });

    // for handling the fieldname customization and remove column if it is unchecked in fieldname settings
    // for handling the fieldname customization and remove column if it is unchecked in fieldname settings
    for (var i = this.columnsDispaly.length - 1; i >= 0; i--) {
      // for setting the contact field headers
      if (this.contactSettings) {
        if (
          this.columnsDispaly[i]?.columnDef == 'lastName' ||
          this.columnsDispaly[i]?.columnDef == 'secondName' ||
          this.columnsDispaly[i]?.columnDef == 'customerSecondName' ||
          this.columnsDispaly[i]?.columnDef == 'sname'
        ) {
          this.columnsDispaly[i].header =
            this.contactSettings[`${'secondName'}`].displayName;
        }
        if (this.columnsDispaly[i]?.columnDef == 'salutation') {
          this.columnsDispaly[i].header =
            this.contactSettings[`${'salutation'}`].displayName;
        }
        if (this.columnsDispaly[i]?.columnDef == 'surname') {
          this.columnsDispaly[i].header =
            this.contactSettings[`${'surname'}`].displayName;
        }
        if (
          this.columnsDispaly[i]?.columnDef == 'companyName' ||
          this.columnsDispaly[i]?.columnDef == 'customerCompany' ||
          this.columnsDispaly[i]?.columnDef == 'company'
        ) {
          this.columnsDispaly[i].header =
            this.contactSettings[`${'companyName'}`].displayName;
        }
      }
      // for setting the sale field headers
      if (this.saleTitleSettings) {
        if (this.columnsDispaly[i]?.columnDef == 'saleTitle') {
          this.columnsDispaly[i].header = this.saleTitleSettings.displayName;
        }
      }
    }
    this.columnsDispaly.forEach((col) => {
      if (col.display == true) {
        filteredColumns.push(col);
      }
    });

    this.displayedColumns = filteredColumns.map((c) => c.columnDef);
  }
  // if page is changed
  onPageChanged(event: PageEvent) {
    this.isLoading = true; //for showing spinner
    this.tableService.pageSize = event.pageSize; // get page size
    // hide page size selection if page index is not 0
    if (event.pageIndex > 0) {
      this.pageSizeOptions = [];
    } else {
      this.pageSizeOptions = [10, 20, 30];
    }
    let date = this.dateIndexMap.get(event.pageIndex); //get last document date readed
    let docId = this.docIdIndexMap.get(event.pageIndex); //get last document id readed
    this.tableService.lastDateTime = date; // assign  last document date readed
    this.tableService.lastDocumentId = docId; // assign  last document id readed
    this.getData(event.pageIndex); // get next set of data
  }
  // network check
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  getData(pageIndex) {
    this.getDataSubscription?.unsubscribe(); // unsubscribe previus subscription
    this.getDataSubscription = this.tableService
      .getData(this.superUserId)
      .subscribe((data) => {
        this.isLoading = true; // set loading true
        // here data readed should be page size + 1 . ie for getting if there is more data or not so we can hide the next page
        // if data length is greater tha page size the next page shouldd be set true and pop the last data .
        if (data.length > this.tableService.pageSize) {
          data.pop();
          this.paginator.hasNextPage = () => true;
          this.chageDetection.detectChanges();
        } else {
          this.paginator.hasNextPage = () => false;
          this.chageDetection.detectChanges();
        }
        if (data.length > 0) {
          this.tableService.pageIndex = pageIndex; // assign page index
          this.tableService.invList = new MatTableDataSource<Invoice>(data);
          this.docIdIndexMap.set(
            this.tableService.pageIndex + 1,
            data[data.length - 1].id
          );
          // based on the view selected and order by user in query update last date

          this.dateIndexMap.set(
            this.tableService.pageIndex + 1,
            data[data.length - 1].docData.docDate
          );

          this.totalItems = data.length; // length of data
          let colmn = this.columnsDispaly.map((obj) => ({
            ...obj,
          }));
          let datalist = this.tableService.invList.data.map((doc) => ({
            ...doc,
            ...doc.docData,
            ...doc.customerData,
            name:
              doc.customerData.fname1 +
              ' ' +
              (doc.customerData.sname != null ? doc.customerData.sname : ''),
          }));
          datalist.forEach((element) => {
            colmn.forEach((ele) => {
              // get additional field value
              if (ele.fieldType == 'Additional') {
                let key = ele.columnDef;
                let val: any;
                try {
                  val = element.additionalFieldsArr[ele.ind]?.fieldValue;
                } catch {
                  val = '';
                }
                element[`${key}`] = val;
              }
            });
          });
          this.tableService.invList.data = datalist;
          this.isLoading = false; // hide spinner
        } else {
          // if data length is not greater than zero assign lastDateTime and lastDocumentId based on the age index in service
          let date = this.dateIndexMap.get(this.tableService.pageIndex);
          let docId = this.docIdIndexMap.get(this.tableService.pageIndex);
          this.tableService.lastDateTime = date;
          this.tableService.invList = new MatTableDataSource<Invoice>([]);
          this.tableService.lastDocumentId = docId;
          this.tableService.invList.data = [];
          this.totalItems = data.length;
          this.isLoading = false; // hide spinner
        }
      });
  }
  // if view is changed
  viewSelected(viewName) {
    this.isLoading = true; // show spinner
    this.tableService.invList.data = []; // clear data
    this.tableService.filterViewSelected = viewName; // asisgn second view name
    if (viewName == 'This Week') {
      this.tableService.viewSelected = 'This Week ' + this.fieldNameInvoice; // for displaying viewname in toolbar
    } else if (viewName == 'This Month') {
      this.tableService.viewSelected = 'This Month ' + this.fieldNameInvoice; // for displaying viewname in toolbar
    } else if (viewName == 'This Quarter') {
      this.tableService.viewSelected = 'This Quarter ' + this.fieldNameInvoice; // for displaying viewname in toolbar
    } else if (viewName == 'This Year') {
      this.tableService.viewSelected = 'This Year ' + this.fieldNameInvoice; // for displaying viewname in toolbar
    }

    // reset data saved in service
    this.resetQueryAndTableData();
  }
  onRowClick(row) {
    if (this.tableName == 'Invoice') {
      this.router.navigate(['/dash/document/Invoice', row.id]);
    }
  }
  // for getting column value
  // for getting column value
  findColumnValue(element: any, column: any) {
    if (!this.isLoading) {
      let cellValue: any;
      cellValue = element[column.columnDef];
      //function to display the values in each cell of the table
      if (column.type == 'date') {
        if (typeof cellValue === 'number') {
          //if the date is stored as normal number and not timestamp
          try {
            return this.datepipe.transform(new Date(cellValue), 'dd-MM-yyyy');
          } catch {
            return '';
          }
        } else {
          //If the field type is in timestamp, then convert to date format
          let dateTemp = cellValue;
          try {
            //to hanndle cases where data is not presenet

            return this.datepipe.transform(
              new Date(dateTemp.seconds * 1000),
              'dd-MM-yyyy'
            );
          } catch {
            //if data is not present return empty string
            return '';
          }
        }
      } else if (column.type == 'date_time') {
        if (typeof cellValue === 'number') {
          //if the date is stored as normal number and not timestamp
          try {
            return this.datepipe.transform(new Date(cellValue), 'dd-MM-yyyy');
          } catch {
            return '';
          }
        } else {
          if (
            column.columnDef != 'nextFollowupDate' &&
            column.columnDef != 'previousFollowupDate'
          ) {
            //If the field type is in timestamp, then convert to date format
            let dateTemp = cellValue;
            try {
              //to hanndle cases where data is not presenet

              return this.datepipe.transform(
                new Date(dateTemp.seconds * 1000),
                'dd-MM-yyyy hh:mm a'
              );
            } catch {
              //if data is not present return empty string
              return '';
            }
          }
        }
      }
      if (column.type == 'boolean') {
        if (cellValue == true) {
          return 'Yes';
        } else {
          return 'No';
        }
      } else if (
        column.columnDef == 'createdBy' ||
        column.columnDef == 'createdById'
      ) {
        return this.userNamesArray[this.userIdsArray.indexOf(cellValue)]; //Get the name corresponding to the Id
      } else if (column.columnDef == 'associatedBranch') {
        const pos = this.branches.map((e) => e.id).indexOf(cellValue);

        try {
          return this.branches[pos].name;
        } catch {
          return 'NA';
        }
      } else {
        //get the value stored in the corresponding field
        try {
          return cellValue; // this needs to be replaced with string literals
        } catch {
          return '';
        }
      }
    }
  }
    //if cvs has no data
    noDataMessage() {
      this.snackBar.open('No data to download', '', {
        duration: 2000,
      });
    }
    //dialog to customize the table fields
    openDialog() {
      let col = this.columnsDispaly.map((obj) => ({
        ...obj,
      }));
      //open the dialog to customize the table fields
      const dialogRef = this.dialog.open(CustomTableSettingsComponent, {
        data: {
          columndata: col,
          userId: this.userId,
          displayName: this.displayName,
          customFields: this.customFieldsInvoices,
        },
        disableClose: true,
        width: '600px',
      });
    }

  resetQueryAndTableData() {
    // reset data saved in service
    this.tableService.lastDateTime = null;
    this.tableService.lastDocumentId = '';
    this.tableService.pageIndex = 0;
    if (this.tableService.pageIndex > 0) {
      this.pageSizeOptions = [];
    } else {
      this.pageSizeOptions = [10, 20, 30];
    }
    this.dateIndexMap = new Map<number, string>();
    this.docIdIndexMap = new Map<number, string>();
    this.getData(this.tableService.pageIndex); // get data based on view selected
  }
  ngAfterViewInit() {
    this.chageDetection.detectChanges();
  }
  ngOnDestroy(): void {
    this.tableService.invList.data = [];
    // unsubscribe all subscription
    this.getDataSubscription?.unsubscribe();
    this.commonServiceUserSubscription?.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
