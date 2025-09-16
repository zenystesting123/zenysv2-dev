import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { Branch, DisplayColumn, Invoice, SettingsItem, SubUsers, contactSettings, defaultContactSettings, defaultSaleSettings, defaultServiceSettings,  } from 'src/app/data-models';
import { EstimateTableColumns } from 'src/app/model/custom-report.model';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { CustomTableSettingsComponent } from 'src/app/custom-tables/custom-table-settings/custom-table-settings.component';
import { PaginatorEstimateIntl } from './paginator-estimate-table';
import { EstimateTableService } from './estimate-table.service';
import { EstimateTableColumnsInvPlan } from 'src/app/model/custom-report-invoicing.model';
@Component({
  selector: 'app-estimate-table',
  templateUrl: './estimate-table.component.html',
  styleUrls: ['./estimate-table.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: PaginatorEstimateIntl}
  ]
})
export class EstimateTableComponent implements OnInit, OnDestroy {
  commonServiceUserSubscription: Subscription;// used for unsubscribe user subscription
  getDataSubscription: Subscription;// used for unsubscribe data subscription
  private onDestroy$: Subject<void> = new Subject<void>();
  userId: string; // current user id
  superUserId: string;// super user id
  columnsDispaly = []; // table columns configuration
  tableDefaultData = EstimateTableColumns;// table columns configuration . used for adding new field which is added on modal
  displayName: string = 'displayEstimateColumns';// field for saving table settings
  userIdsArray: any[] = [];// users id
  userNamesArray: any[] = [];// users names
  customFieldEstimate: any[]; // contact additional fields
  displayedColumns = []; // for getting the selected column for displaying in the table

  // custom field names
  fieldNameEstimate: string = 'Estimate';//for set field name for estimate

  @ViewChild(MatPaginator) paginator: MatPaginator;
  totalItems = 0; // list length used for pagination
  pageSizeOptions: number[] = [10, 20, 30];//page size options for table
  firstSetDataLoaded: boolean = false;// for calling the getData fn only once in oninit
  branches: Branch[];// list of branches
  subUsers: SubUsers[] = [];// sub users list=
  isLoading: boolean = true;// for displaying spinner while data is loading
  dateIndexMap = new Map<number, string>(); //for saing last document date readed
  docIdIndexMap = new Map<number, string>();//for saing last document id readed
  networkConnection: boolean; //to check network connection
  paginatorIntl: MatPaginatorIntl;
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;// custoer settigs configuration
  saleTitleSettings: SettingsItem = defaultSaleSettings.CONST_VALUE.saleTitle;
  disableDownload: boolean = false; //disable download
  disableView: boolean = false; //disable view
  constructor(public commonService: CommonService, public tableService: EstimateTableService,
    public chageDetection: ChangeDetectorRef,
    public datepipe: DatePipe,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    public networkCheck: NetworkCheckService, private customPaginatorIntl: PaginatorEstimateIntl) {
    this.paginatorIntl = customPaginatorIntl;
    //initialize array
    this.tableService.estimateList = new MatTableDataSource([]);
    this.branches = this.commonService.branches;
  }

  ngOnInit(): void {
    this.commonServiceUserSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (!allData.userDetails.enableLiteMode) {
          this.router.navigate(['dash/documents-list/estimatelist']);
        }
        else {
           //get the details of user profile assigned to the user
           if (allData.usrProfileData) {
            // disable estimate create and view
            if (allData.usrProfileData.isCheckedSalesEst == false) {
              this.disableView = true; // disable view estimate
              this.disableDownload = true;
            } else {
              
              if (allData.usrProfileData.salesDViewEst == false) {
                this.disableView = true; // disable view estimate
              }
              if (allData.usrProfileData.estDownload == false) {
                this.disableDownload = true;
              }
            }
          }
          if(!this.disableView && this.commonService.userPlan.documentsAccess && this.commonService.userPlan.estimatesAccess){
          this.userId = allData.userId;
          this.subUsers = allData.subUsers;
          this.superUserId = allData.userDetails.superUserId;
        
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
            this.saleTitleSettings = allData.superUserDetails.saleSettings.saleTitle;
          }
          
          // get field name
          if (allData.superUserDetails.fieldNames) {
              this.fieldNameEstimate = allData.superUserDetails.fieldNames.fieldNameEstimate;
          }
         
          this.customFieldEstimate = allData.superUserDetails.customFieldsEstimate;
          let displayColumnsSaved: DisplayColumn[] = [];
          if (allData.userDetails.displayEstimateColumns) {
            displayColumnsSaved = allData.userDetails.displayEstimateColumns;
          }
          if (displayColumnsSaved.length > 0) {
            //if table settings are stored in db, use the stored data
            this.columnsDispaly = allData.userDetails.displayEstimateColumns;
            // remove select column if settings already saved in DB
            var ind = this.columnsDispaly.findIndex(
              (p) => p.columnDef == 'select'
            );
            if (ind > -1) {
              this.columnsDispaly.splice(ind, 1);
            }
          } else {
            //if plan is invoicing, get default table config from custom-report-invoicing model
           if (allData.superUserDetails.plan == 'invoicing'){
              //if plan is invoicing, get default table config from custom-report-leadManagement model
              this.columnsDispaly = EstimateTableColumnsInvPlan;
              this.tableDefaultData = EstimateTableColumnsInvPlan;
            } else {
              //if plan is not invoicing or leadManagement, get default table config from custom-report model
              this.columnsDispaly = EstimateTableColumns;
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
          if (!this.firstSetDataLoaded) {// for calling the function only once when user datas are chaged no need tocall the function again      
            if (this.tableService.filterViewSelected == "This Week") {
              this.tableService.viewSelected = "This Week " + this.fieldNameEstimate;// for displaying viewname in toolbar
            } else if (this.tableService.filterViewSelected == "This Month") {
              this.tableService.viewSelected = "This Month " + this.fieldNameEstimate;// for displaying viewname in toolbar
            }else if (this.tableService.filterViewSelected == "This Quarter") {
              this.tableService.viewSelected = "This Quarter " + this.fieldNameEstimate;// for displaying viewname in toolbar
            }else if (this.tableService.filterViewSelected == "This Year") {
              this.tableService.viewSelected = "This Year " + this.fieldNameEstimate;// for displaying viewname in toolbar
            }
            this.getData(this.tableService.pageIndex)
            this.firstSetDataLoaded = true;
          }
          }else{
            this.isLoading =false
          }
        }
      })
  }
  configureTable() {
    //removing additional field if it is removed from settings
    this.customFieldEstimate?.forEach((element, index) => {
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
    this.customFieldEstimate?.forEach((element, index) => {
      if (element.isActive) {
        let field = this.customFieldEstimate[index].fieldName;
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
            columnDef: this.customFieldEstimate[index].fieldName,
            header: this.customFieldEstimate[index].fieldName,
            display: false,
            type: this.customFieldEstimate[index].fieldType,
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
    this.isLoading = true;//for showing spinner
    this.tableService.pageSize = event.pageSize;// get page size
    // hide page size selection if page index is not 0
    if (event.pageIndex > 0) {
      this.pageSizeOptions = [];
    } else {
      this.pageSizeOptions = [10, 20, 30];
    }
    let date = this.dateIndexMap.get(event.pageIndex); //get last document date readed
    let docId = this.docIdIndexMap.get(event.pageIndex); //get last document id readed
    this.tableService.lastDateTime = date; // assign  last document date readed
    this.tableService.lastDocumentId = docId;// assign  last document id readed
    this.getData(event.pageIndex);// get next set of data
  }
  getData(pageIndex) {
    this.getDataSubscription?.unsubscribe(); // unsubscribe previus subscription
    this.getDataSubscription = this.tableService.getData(this.superUserId).subscribe(data => {
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
        data =
          data.map((doc) => {
            return {
              ...doc,
              ...doc.docData,
              ...doc.customerData,
            };
          });
        this.tableService.pageIndex = pageIndex;// assign page index
        this.tableService.estimateList = new MatTableDataSource<Invoice>(data);
        this.docIdIndexMap.set(this.tableService.pageIndex + 1, data[data.length - 1].id);
        // based on the view selected and order by user in query update last date

        this.dateIndexMap.set(this.tableService.pageIndex + 1, data[data.length - 1].docData.docDate);

        this.totalItems = data.length;// length of data
        let colmn = this.columnsDispaly.map((obj) => ({
          ...obj,
        }));
        let datalist = this.tableService.estimateList.data.map((obj) => ({
          ...obj,
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
        this.tableService.estimateList.data = datalist;
        this.isLoading = false;// hide spinner
      } else {
        // if data length is not greater than zero assign lastDateTime and lastDocumentId based on the age index in service
        let date = this.dateIndexMap.get(this.tableService.pageIndex);
        let docId = this.docIdIndexMap.get(this.tableService.pageIndex);
        this.tableService.lastDateTime = date;
        this.tableService.estimateList = new MatTableDataSource<Invoice>([]);
        this.tableService.lastDocumentId = docId;
        this.tableService.estimateList.data = []
        this.totalItems = data.length;
        this.isLoading = false;// hide spinner
      }

    })
  }
  // if view is changed
  viewSelected(viewName) {
    this.isLoading = true;// show spinner
    this.tableService.estimateList.data = [];// clear data
    this.tableService.filterViewSelected = viewName; // asisgn second view name
    if (viewName == "This Week") {
      this.tableService.viewSelected = "This Week " + this.fieldNameEstimate;// for displaying viewname in toolbar
    } else if (viewName == "This Month") {
      this.tableService.viewSelected =  "This Month " + this.fieldNameEstimate;// for displaying viewname in toolbar
    }
    else if (viewName == "This Quarter") {
      this.tableService.viewSelected =  "This Quarter " + this.fieldNameEstimate;// for displaying viewname in toolbar
    }
    else if (viewName == "This Year") {
      this.tableService.viewSelected =  "This Year " + this.fieldNameEstimate;// for displaying viewname in toolbar
    }
    // reset data saved in service
    this.resetQueryAndTableData();
  }
  ngAfterViewInit() {
    this.chageDetection.detectChanges();
  }
  ngOnDestroy(): void {
    this.tableService.estimateList.data = [];
    // unsubscribe all subscription
    this.getDataSubscription?.unsubscribe();
    this.commonServiceUserSubscription?.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
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
        customFields: this.customFieldEstimate,
      },
      disableClose: true,
      width: '600px',
    });
  }
  // network check
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
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
    this.getData(this.tableService.pageIndex);// get data based on view selected
  }
  onRowClick(row){
    this.router.navigate(['/dash/document/Estimate', row.id]);
  }
}
