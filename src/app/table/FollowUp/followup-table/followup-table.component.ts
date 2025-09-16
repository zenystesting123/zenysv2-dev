/*****************************************************
Descrition : table for followup, take data dynamically based on the page size
 * ************************************************************* */
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import {
  Branch,
  DisplayColumn,
  FollowUps,
  SettingsItem,
  contactSettings,
  defaultContactSettings,
  defaultSaleSettings,
  defaultServiceSettings,
  defaultfollowUpSettings,
  followUpSettings,
} from 'src/app/data-models';
import { FollowUpTableColumnsLeadPlan } from 'src/app/model/custom-report-leadManagement.model';
import { FollowUpTableColumns } from 'src/app/model/custom-report.model';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { CustomTableSettingsComponent } from 'src/app/custom-tables/custom-table-settings/custom-table-settings.component';
import { PaginatorFollowupIntl } from './paginator-followup-table';
import { GridContainerService } from '../grid-container/grid-container.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ChildFollowUpList } from 'src/app/follow-up-list-material/follow-up-list-material.component';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-followup-table',
  templateUrl: './followup-table.component.html',
  styleUrls: ['./followup-table.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorFollowupIntl }],
})
export class FollowupTableComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>(); //on destroy subject to emit when leaving the page

  @ViewChild(MatPaginator) paginator: MatPaginator; //paginator referenee
  @Input() fieldNameFollowup = ''; //followup field name
  @Input() disableFollEdit = false; //disable edit followup based on user profile
  @Input() userName = ''; //logged in users name
  @Input() userNumber; //logged in users number
  // variables for call
  @Input() enableOutboundCallsViaCallBridging = false;
  @Input() outboundCallBridgingType;
  @Input() DIDNumber;
  @Input() autoCallToken;
  @Input() callBridgingExtension;
  @Input() subUsers; // pass sub user list
  @Input() superUserFirstName; // pass super user first name
  @Input() superUserSecondName; // pass super user second name
  @Input() userId: string; // current user id
  @Input() superUserId: string; // super user id
  @Input() selection = new SelectionModel<FollowUps>(true, []); // table selection

  @Output() markAsCompletedEvent = new EventEmitter<FollowUps>(); //mark as completed function event passing to parent
  @Output() editEvent = new EventEmitter<FollowUps>(); //edit event passing to parent

  commonServiceUserSubscription: Subscription; // used for unsubscribe user subscription
  getDataSubscription: Subscription; // used for unsubscribe followup data subscription
  columnsDispaly = []; // table columns configuration
  followUpSettings: followUpSettings = defaultfollowUpSettings.CONST_VALUE; // custoer settigs configuration
  tableDefaultData = FollowUpTableColumns; // table columns configuration . used for adding new field which is added on modal
  displayName: string = 'displayFollowupColumns'; // field for saving table settings
  userIdsArray: any[] = []; // users id
  userNamesArray: any[] = []; // users names
  customFieldFollowup: any[]; // contact additional fields
  displayedColumns = []; // for getting the selected column for displaying in the table
  totalItems = 0; // followup list length used for pagination
  pageSizeOptions: number[] = [10, 20, 30]; //page size options for table
  firstSetDataLoaded: boolean = false; // for calling the getData fn only once in oninit
  branches: Branch[]; // list of branches
  disableView: boolean = false; //disable view followup
  isLoading: boolean = true; // for displaying spinner while data is loading
  viewSelectionArray: string[] = ['Assigned to me', 'Created by me']; // first view selection array
  viewSettingSelected: string = 'Assigned to me'; // first view seleceted
  dateIndexMap = new Map<number, string>(); //for saing last document date readed
  docIdIndexMap = new Map<number, string>(); //for saing last document id readed
  networkConnection: boolean; //to check network connection
  paginatorIntl: MatPaginatorIntl;
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE; // custoer settigs configuration
  saleTitleSettings: SettingsItem = defaultSaleSettings.CONST_VALUE.saleTitle;
  serviceTitleSettings: SettingsItem =
    defaultServiceSettings.CONST_VALUE.serviceTitle;

  constructor(
    public commonService: CommonService,
    public chageDetection: ChangeDetectorRef,
    public datepipe: DatePipe,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    public networkCheck: NetworkCheckService,
    private customPaginatorIntl: PaginatorFollowupIntl,
    public gridContainerService: GridContainerService
  ) {
    this.paginatorIntl = customPaginatorIntl;
    //initialize array
    this.gridContainerService.followupList = new MatTableDataSource([]);
    this.branches = this.commonService.branches;
  }

  ngOnInit(): void {
    this.commonServiceUserSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          if (
            this.commonService.userPlan.activitiesAccess &&
            this.commonService.userPlan.followupsAccess &&
            !this.disableView
          ) {
            //get followup setting configuration
            if (
              allData.superUserDetails.followUpSettings &&
              typeof allData.superUserDetails.followUpSettings !==
                'undefined' &&
              allData.superUserDetails.followUpSettings !== null
            ) {
              this.followUpSettings = allData.superUserDetails.followUpSettings;
            }
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
            if (
              allData.superUserDetails.serviceSettings &&
              typeof allData.superUserDetails.serviceSettings !== 'undefined' &&
              allData.superUserDetails.serviceSettings !== null
            ) {
              this.serviceTitleSettings =
                allData.superUserDetails.serviceSettings.serviceTitle;
            }
            this.customFieldFollowup =
              allData.superUserDetails.customFieldsFollowUp;
            let displayColumnsSaved: DisplayColumn[] = [];
            if (allData.userDetails.displayFollowupColumns) {
              displayColumnsSaved = allData.userDetails.displayFollowupColumns;
            }
            if (displayColumnsSaved.length > 0) {
              //if table settings are stored in db, use the stored data
              this.columnsDispaly = allData.userDetails.displayFollowupColumns;
              // remove select column if settings already saved in DB
              var ind = this.columnsDispaly.findIndex(
                (p) => p.columnDef == 'select'
              );
              if (ind > -1) {
                this.columnsDispaly.splice(ind, 1);
              }
            } else {
              //if plan is invoicing, get default table config from custom-report-invoicing model
              if (allData.superUserDetails.plan == 'leadManagement') {
                //if plan is leadManagement, get default table config from custom-report-leadManagement model
                this.columnsDispaly = FollowUpTableColumnsLeadPlan;
                this.tableDefaultData = FollowUpTableColumnsLeadPlan;
              } else {
                //if plan is not invoicing or leadManagement, get default table config from custom-report model
                this.columnsDispaly = FollowUpTableColumns;
              }
            }
            [this.userIdsArray, this.userNamesArray] =
              this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names

            // configure table display
            this.configureTable();
            if (this.gridContainerService.pageIndex > 0) {
              this.pageSizeOptions = [];
            } else {
              this.pageSizeOptions = [10, 20, 30];
            }
            // get first set of data based on the page size and page index.
            if (!this.firstSetDataLoaded) {
              // for calling the function only once when user datas are chaged no need tocall the function again
              if (
                this.gridContainerService.secondViewSelected == 'Todays call'
              ) {
                this.gridContainerService.viewSelected =
                  this.gridContainerService.firstViewSelected +
                  '/ ' +
                  "Today's " +
                  this.fieldNameFollowup; // for displaying viewname in toolbar
              } else if (
                this.gridContainerService.secondViewSelected ==
                'This weeks call'
              ) {
                this.gridContainerService.viewSelected =
                  this.gridContainerService.firstViewSelected +
                  '/ ' +
                  'This weeks ' +
                  this.fieldNameFollowup; // for displaying viewname in toolbar
              } else if (
                this.gridContainerService.secondViewSelected == 'Overdue call'
              ) {
                this.gridContainerService.viewSelected =
                  this.gridContainerService.firstViewSelected +
                  '/ ' +
                  'Overdue ' +
                  this.fieldNameFollowup; // for displaying viewname in toolbar
              }
              this.getData(this.gridContainerService.pageIndex);
              this.firstSetDataLoaded = true;
            }
          } else {
            this.isLoading = false;
          }
        }
      }
    );

    if (this.commonService.followUpView == 'table') {
      this.viewSelected();
    }
  }
  configureTable() {
    //removing additional field if it is removed from settings
    this.customFieldFollowup?.forEach((element, index) => {
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
    this.customFieldFollowup?.forEach((element, index) => {
      if (element.isActive) {
        let field = this.customFieldFollowup[index].fieldName;
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
            columnDef: this.customFieldFollowup[index].fieldName,
            header: this.customFieldFollowup[index].fieldName,
            display: false,
            type: this.customFieldFollowup[index].fieldType,
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
      // for handling custom field names and removing field which are not displaying
      if (this.followUpSettings) {
        Object.keys(this.followUpSettings).forEach((ele) => {
          if (this.columnsDispaly[i]?.columnDef == ele) {
            this.columnsDispaly[i].header =
              this.followUpSettings[`${ele}`].displayName;
            if (!this.followUpSettings[`${ele}`].display) {
              this.columnsDispaly.splice(i, 1); // removing the column
            }
          }
          // for handling the folowup customer name becuase here fullname is stored
          if (ele == 'customerControl') {
            if (this.columnsDispaly[i]?.columnDef == 'customerName') {
              this.columnsDispaly[i].header =
                this.followUpSettings[`${ele}`].displayName;
            }
          }
        });
      }
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
        if (this.columnsDispaly[i]?.columnDef == 'contactNumber') {
          this.columnsDispaly[i].header =
            this.contactSettings[`${'contactNo'}`].displayName;
        }
      }
      // for setting the sale field headers
      if (this.saleTitleSettings) {
        if (this.columnsDispaly[i]?.columnDef == 'saleTitle') {
          this.columnsDispaly[i].header = this.saleTitleSettings.displayName;
        }
      }
      // for setting the service field headers
      if (this.serviceTitleSettings) {
        if (this.columnsDispaly[i]?.columnDef == 'serviceTitle') {
          this.columnsDispaly[i].header = this.serviceTitleSettings.displayName;
        }
      }
    }
    this.columnsDispaly.forEach((col) => {
      if (col.display == true) {
        filteredColumns.push(col);
      }
    });
    // for adding the check box as first column
    filteredColumns.splice(0, 0, {
      columnDef: 'select',
      header: 'select',
      display: true,
      type: 'string',
      fieldType: 'def',
      ind: 0,
    });
    // actions column adding to followup table at index 1
    filteredColumns.splice(1, 0, {
      columnDef: 'actions',
      header: 'actions',
      display: true,
      type: 'string',
      fieldType: 'def',
      ind: 0,
    });
    this.displayedColumns = filteredColumns.map((c) => c.columnDef);
  }
  // if page is changed
  onPageChanged(event: PageEvent) {
    this.isLoading = true; //for showing spinner
    this.selection.clear(); // clear table data selection
    this.gridContainerService.pageSize = event.pageSize; // get page size
    // hide page size selection if page index is not 0
    if (event.pageIndex > 0) {
      this.pageSizeOptions = [];
    } else {
      this.pageSizeOptions = [10, 20, 30];
    }
    let date = this.dateIndexMap.get(event.pageIndex); //get last document date readed
    let docId = this.docIdIndexMap.get(event.pageIndex); //get last document id readed
    this.gridContainerService.lastDateTime = date; // assign  last document date readed
    this.gridContainerService.lastDocumentId = docId; // assign  last document id readed
    this.getData(event.pageIndex); // get next set of data
  }
  getData(pageIndex) {
    this.getDataSubscription?.unsubscribe(); // unsubscribe previus subscription
    this.getDataSubscription = this.gridContainerService
      .getData(this.superUserId, this.userId)
      .subscribe((data) => {
        this.isLoading = true; // set loading true
        // here data readed should be page size + 1 . ie for getting if there is more data or not so we can hide the next page
        // if data length is greater tha page size the next page shouldd be set true and pop the last data .
        if (data.length > this.gridContainerService.pageSize) {
          data.pop();
          this.paginator.hasNextPage = () => true;
          this.chageDetection.detectChanges();
        } else {
          this.paginator.hasNextPage = () => false;
          this.chageDetection.detectChanges();
        }
        if (data.length > 0) {
          this.gridContainerService.pageIndex = pageIndex; // assign page index
          this.gridContainerService.followupList =
            new MatTableDataSource<FollowUps>(data);
          this.docIdIndexMap.set(
            this.gridContainerService.pageIndex + 1,
            data[data.length - 1].id
          );
          // based on the view selected and order by user in query update last date

          this.dateIndexMap.set(
            this.gridContainerService.pageIndex + 1,
            data[data.length - 1].callStartDate
          );

          this.totalItems = data.length; // length of data
          let colmn = this.columnsDispaly.map((obj) => ({
            ...obj,
          }));
          let datalist = this.gridContainerService.followupList.data.map(
            (obj) => ({
              ...obj,
            })
          );
          datalist.forEach((element) => {
            // est assigned to name
            if (element.assignedTo) {
              element.assignedToName = this.commonService.getAssignedToName(
                element.assignedTo
              );
            }
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
          this.gridContainerService.followupList.data = datalist;
          this.isLoading = false; // hide spinner
        } else {
          // if data length is not greater than zero assign lastDateTime and lastDocumentId based on the age index in service
          let date = this.dateIndexMap.get(this.gridContainerService.pageIndex);
          let docId = this.docIdIndexMap.get(
            this.gridContainerService.pageIndex
          );
          this.gridContainerService.lastDateTime = date;
          this.gridContainerService.followupList =
            new MatTableDataSource<FollowUps>([]);
          this.gridContainerService.lastDocumentId = docId;
          this.gridContainerService.followupList.data = [];
          this.totalItems = data.length;
          this.isLoading = false; // hide spinner
        }
      });
  }
  // if view is changed
  viewSelected() {
    this.isLoading = true; // show spinner
    this.gridContainerService.followupList.data = []; // clear data
    // reset data saved in service
    this.resetQueryAndTableData();
  }
  ngAfterViewInit() {
    this.chageDetection.detectChanges();
  }
  ngOnDestroy(): void {
    this.gridContainerService.followupList.data = [];
    // unsubscribe all subscription
    this.getDataSubscription?.unsubscribe();
    this.commonServiceUserSubscription?.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  // edit followup
  onEditFollowUps(followUpData) {
    this.editEvent.emit(followUpData);
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
      } else if (column.columnDef == 'contactNumber') {
        let countryCode = element.countryCode ? element.countryCode : '';
        let contactNumber = element[column.columnDef]
          ? element[column.columnDef]
          : '';
        return countryCode + ' ' + contactNumber;
        //If field is pipeline
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
        customFields: this.customFieldFollowup,
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
    this.gridContainerService.lastDateTime = null;
    this.gridContainerService.lastDocumentId = '';
    this.gridContainerService.pageIndex = 0;
    this.selection.clear(); // clear table data selection
    if (this.gridContainerService.pageIndex > 0) {
      this.pageSizeOptions = [];
    } else {
      this.pageSizeOptions = [10, 20, 30];
    }
    this.dateIndexMap = new Map<number, string>();
    this.docIdIndexMap = new Map<number, string>();
    this.getData(this.gridContainerService.pageIndex); // get data based on view selected
  }
  // to call the autocall api and pass all the details
  async onCallFollowUp(id, customerId) {
    if (this.enableOutboundCallsViaCallBridging && this.userNumber) {
      let data = await this.gridContainerService.readCustRecord(
        this.superUserId,
        customerId
      );

      if (data.contactNo) {
        let customerName;
        if (data.secondName && data.surname) {
          // if second name & surname is there
          customerName =
            data.firstName + ' ' + data.secondName + ' ' + data.surname;
        } else if (data.secondName && !data.surname) {
          customerName = data.firstName + ' ' + data.secondName;
        } else if (!data.secondName && data.surname) {
          customerName = data.firstName + ' ' + data.surname;
        } else {
          customerName = data.firstName;
        }
        let minute = new Date().getMinutes();
        let hour = new Date().getHours();
        let startTime = hour + ':' + minute;
        this.commonService
          .onAutoCall(
            this.userNumber,
            data.contactNo,
            this.superUserId,
            this.userId,
            this.userName,
            data.companyName,
            customerId,
            customerName,
            startTime,
            id,
            this.autoCallToken,
            this.DIDNumber,
            data.orgId ? data.orgId : '',
            data.associatedBranch ? data.associatedBranch : 'none',
            this.callBridgingExtension,
            this.outboundCallBridgingType,
            data.saleTitle ? data.saleTitle : null,
            data.saleId ? data.saleId : null,
            data.serviceTitle ? data.serviceTitle : null,
            data.serviceId ? data.serviceId : null
          )
          .subscribe((data: any) => {});
        this.snackBar.open('Initiating Call', '', {
          duration: 2000,
        });
      } else {
        this.snackBar.open('Contact number does not exist', '', {
          duration: 2000,
        });
      }
    }
  }
  // complete the follwup task
  markasCompleted(followup) {
    this.markAsCompletedEvent.emit(followup);
  }
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.gridContainerService.followupList.data.length;
      return numSelected == numRows;
    }
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected()
        ? this.selection.clear()
        : this.gridContainerService.followupList.data.forEach((row) =>
          this.selection.select(row)
        );
    }
}
