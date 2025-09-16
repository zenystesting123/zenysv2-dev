/**************************************************************************
 * Description :Child of table/sale-list component,
 *  Sale lite mode  table view, while change page it loads more data
 *
 * ************************************************************************* */

import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
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
import { MatDialog } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent,
} from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { CustomerlistService } from 'src/app/contact/customerlist/customerlist.service';
import {
  Branch,
  Sales,
  contactSettings,
  defaultContactSettings,
  defaultSaleSettings,
  modules,
  saleSettings,
} from 'src/app/data-models';
import { SaleTableColumns } from 'src/app/model/custom-report.model';
import { Pipelines } from 'src/app/model/pipeline.modal';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { SaleTableService } from '../sale-list/sale-table.service';
import { SalesPaginatorIntl } from './sales-paginator-intl';

@Component({
  selector: 'app-sale-table-view',
  templateUrl: './sale-table-view.component.html',
  styleUrls: ['./sale-table-view.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: SalesPaginatorIntl }],

})
export class SaleTableViewComponent implements OnInit, OnDestroy {
  commonServiceUserSubscription: Subscription; // used for unsubscribe user subscription
  getDataSubscription: Subscription; // used for unsubscribe Sale data subscription
  private onDestroy$: Subject<void> = new Subject<void>();
  paginatorIntl: MatPaginatorIntl;
  branches: Branch[]; // list of branches
  displayedColumns = []; // for getting the selected column for displaying in the table
  networkConnection: boolean; //to check network connection
  isLoading: boolean = true; // for displaying spinner while data is loading
  tableName: string = 'Sale'; // table name
  dateIndexMap = new Map<number, string>(); //for saing last document date readed
  docIdIndexMap = new Map<number, string>(); //for saing last document id readed
  totalItems = 0; // Sale list length used for pagination
  pageSizeOptions: number[] = [10, 20, 30]; //page size options for table
  @Input() disableDocCreateEst: boolean = false; //disable create estimate
  @Input() disableDocCreateQuot: boolean = false; //disable create quotation
  @Input() disableDocCreateInv: boolean = false; //disable create invoice
  @Input() disableSaleDownload: boolean = false; //disable download contact
  @Input() disableFoll = false; // disable followup create
  @Input() disableSaleEdit: boolean = false; //disable edit contact
  @Input() superUserId: boolean = false; //superUserId
  @Input() userId: boolean = false; // userId
  @Input() actSaleAgeing: boolean = false; // check for is ageing is activated
  @Input() salePipelines: Pipelines[] = [];
  @Input() selection = new SelectionModel<Sales>(true, []); // table selection
  @Input() userIdsArray: any[] = []; // users id
  @Input() userNamesArray: any[] = []; // users names
  @Input() customFieldsSale: any[]; // contact additional fields
  @Input() columnsDispaly = []; // table columns configuration
  @Input() tableDefaultData = SaleTableColumns; // table columns configuration .used for adding new field which is added on modal
  @Input() fieldNameSaleNotes: string = 'Note';
  @Input() fieldNameFollowup: string = 'FollowUp';
  @Input() fieldNameContact: string = 'Contact';
  @Input() fieldNameTask: string = 'Task';
  @Input() fieldNameSale: string = 'Sale';
  @Input() fieldNameEstimate: string = 'Estimate';
  @Input() fieldNameQuotation: string = 'Quotation';
  @Input() fieldNameInvoice: string = 'Invoice';
  @Input() accountType: string = '';
  @Input() saleSettings: saleSettings = defaultSaleSettings.CONST_VALUE; // sale settigs configuration
  @Input() contactSettings: contactSettings = defaultContactSettings.CONST_VALUE; // custoer settigs configuration
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() editSaleEvent = new EventEmitter<{ index: number, sale: Sales }>();
  @Output() addTaskEvent = new EventEmitter<Sales>();
  @Output() onCreateFollowUpsEvent = new EventEmitter<Sales>();
  @Output() openDialogEvent = new EventEmitter<{ columnsDispaly: any, customField: any }>();
  constructor(public commonService: CommonService, public tableService: SaleTableService,
    public chageDetection: ChangeDetectorRef,
    public datepipe: DatePipe,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    public networkCheck: NetworkCheckService,
    public customerlistService: CustomerlistService,
    private customPaginatorIntl: SalesPaginatorIntl
  ) {
    this.paginatorIntl = customPaginatorIntl;
    //initialize array
    this.tableService.saleList = new MatTableDataSource([]);
    this.branches = this.commonService.branches;
  }

  ngOnInit(): void {
    this.selection.clear();
    this.configureTable();
    this.getData(this.tableService.pageIndex);
  }

 // fn to configure table display
 configureTable() {
  //removing additional field if it is removed from settings
  this.customFieldsSale?.forEach((element, index) => {
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
  this.customFieldsSale?.forEach((element, index) => {
    if (element.isActive) {
      let field = this.customFieldsSale[index].fieldName;
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
          columnDef: this.customFieldsSale[index].fieldName,
          header: this.customFieldsSale[index].fieldName,
          display: false,
          type: this.customFieldsSale[index].fieldType,
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
    if (this.saleSettings) {
      Object.keys(this.saleSettings).forEach((ele) => {
        if (this.columnsDispaly[i]?.columnDef == ele) {
          this.columnsDispaly[i].header =
            this.saleSettings[`${ele}`].displayName;
          if (!this.saleSettings[`${ele}`].display) {
            this.columnsDispaly.splice(i, 1); // removing the column
          }
        }
        // for handling the folowup customer name becuase here fullname is stored
        if (ele == 'customerControl') {
          if (
            this.columnsDispaly[i]?.columnDef == 'customerName' &&
            this.tableName == 'Followup'
          ) {
            this.columnsDispaly[i].header =
              this.saleSettings[`${ele}`].displayName;
          }
        }
      });
    }
    if (this.contactSettings) {
      // based on contact feild name setting of customer number / alt contact number show/hide column
      if (this.columnsDispaly[i]?.columnDef == 'contactNumber') {
        let ele = 'contactNo'
        this.columnsDispaly[i].header =
          this.contactSettings[ele].displayName;
        if (!this.contactSettings[`${ele}`].display) {
          this.columnsDispaly.splice(i, 1); // removing the column
        }
      } else if (this.columnsDispaly[i]?.columnDef == 'altContactNumber') {
        let ele = 'alternateContactNumber'
        this.columnsDispaly[i].header =
          this.contactSettings[ele].displayName;
        if (!this.contactSettings[`${ele}`].display) {
          this.columnsDispaly.splice(i, 1); // removing the column
        }
      }
    }
    // for setting the sale field headers
    if (this.columnsDispaly[i]?.columnDef == 'saleTitle') {
      this.columnsDispaly[i].header =
        this.saleSettings[`${'saleTitle'}`].displayName;
    }

    // for changing the header by custom field name
    if (this.columnsDispaly[i]?.columnDef == 'lastNoteDate') {
      this.columnsDispaly[i].header =
        'Last ' + this.fieldNameSaleNotes + ' Date';
    } else if (this.columnsDispaly[i]?.columnDef == 'lastAddedNote') {
      this.columnsDispaly[i].header = 'Last ' + this.fieldNameSaleNotes;
    } else if (this.columnsDispaly[i]?.columnDef == 'nextFollowupDate') {
      this.columnsDispaly[i].header =
        'Next ' + this.fieldNameFollowup + ' Date';
    } else if (this.columnsDispaly[i]?.columnDef == 'previousFollowupDate') {
      this.columnsDispaly[i].header =
        'Previous ' + this.fieldNameFollowup + ' Date';
    }
  }

  this.columnsDispaly.forEach((col) => {
    if (col.display == true) {
      filteredColumns.push(col);
    }
  });

  // for customer table, we are not checking superuser/subuser , select option is available
  // as for other tables-sale/supp/org, add superuser condition and add select column
    // for adding the check box as first column
    filteredColumns.splice(0, 0, {
      columnDef: 'select',
      header: 'select',
      display: true,
      type: 'string',
      fieldType: 'def',
      ind: 0,
    });
    // actions column adding to customer table at index 1
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

  // fetch data from DB
  getData(pageIndex) {
    this.getDataSubscription?.unsubscribe(); // unsubscribe previus subscription
    this.getDataSubscription = this.tableService
      .getData(
        this.superUserId,
        this.userId,
        this.tableService.selectedPipelineNameArray
      )
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
          this.tableService.saleList = new MatTableDataSource<Sales>(data);
          this.docIdIndexMap.set(
            this.tableService.pageIndex + 1,
            data[data.length - 1].id
          );
          // based on the view selected and order by user in query update last date
          if (
            this.tableService.secondViewSelected === 'start today' ||
            this.tableService.secondViewSelected === 'start this week' ||
            this.tableService.secondViewSelected === 'start this month'
          ) {
            this.dateIndexMap.set(
              this.tableService.pageIndex + 1,
              data[data.length - 1].startDate
            );
          } else if (
            this.tableService.secondViewSelected === 'closing today' ||
            this.tableService.secondViewSelected === 'closing this week' ||
            this.tableService.secondViewSelected === 'closing this month'
          ) {
            this.dateIndexMap.set(
              this.tableService.pageIndex + 1,
              data[data.length - 1].expCompletionDate
            );
          } else if (
            this.tableService.secondViewSelected === 'edited today' ||
            this.tableService.secondViewSelected === 'edited this week' ||
            this.tableService.secondViewSelected === 'edited this month'
          ) {
            this.dateIndexMap.set(
              this.tableService.pageIndex + 1,
              data[data.length - 1].lastModifiedDate
            );
          } else if (
            this.tableService.secondViewSelected === 'note today' ||
            this.tableService.secondViewSelected === 'note this week' ||
            this.tableService.secondViewSelected === 'note this month'
          ) {
            this.dateIndexMap.set(
              this.tableService.pageIndex + 1,
              data[data.length - 1].lastNoteDate
            );
          } else {
            this.dateIndexMap.set(
              this.tableService.pageIndex + 1,
              data[data.length - 1].createdDate
            );
          }

          this.totalItems = data.length; // length of data
          let colmn = this.columnsDispaly.map((obj) => ({
            ...obj,
          }));
          let datalist = this.tableService.saleList.data.map((obj) => ({
            ...obj,
          }));
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
          this.tableService.saleList.data = datalist;
          this.isLoading = false; // hide spinner
        } else {
          // if data length is not greater than zero assign lastDateTime and lastDocumentId based on the age index in service
          let date = this.dateIndexMap.get(this.tableService.pageIndex);
          let docId = this.docIdIndexMap.get(this.tableService.pageIndex);
          this.tableService.lastDateTime = date;
          this.tableService.saleList = new MatTableDataSource<Sales>([]);
          this.tableService.lastDocumentId = docId;
          this.tableService.saleList.data = [];
          this.totalItems = data.length;
          this.isLoading = false; // hide spinner
        }
      });
  }
  resetQueryAndTableData() {
    // reset data saved in service
    this.tableService.lastDateTime = null;
    this.tableService.lastDocumentId = '';
    this.tableService.pageIndex = 0;
    this.selection.clear(); // clear table data selection
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
    this.tableService.saleList.data = [];
    // unsubscribe all subscription
    this.getDataSubscription?.unsubscribe();
    this.commonServiceUserSubscription?.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }
  onRowClick(row) {
    this.router.navigate(['dash/sales/saleview/' + row.id]);
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
          } else if (
            column.columnDef == 'nextFollowupDate' &&
            this.tableName == 'Customer'
          ) {
            // for displaying date with time
            //If the field type is in timestamp, then convert to date format
            let dateTemp = cellValue;
            try {
              //to hanndle cases where data is not presenet
              let nextFollowupTime = element.nextFollowupTime
                ? this.commonService.transformTo12Hour(element.nextFollowupTime)
                : '';
              return (
                this.datepipe.transform(
                  new Date(dateTemp.seconds * 1000),
                  'dd-MM-yyyy'
                ) +
                ' ' +
                nextFollowupTime
              );
            } catch {
              //if data is not present return empty string
              return '';
            }
          } else if (
            column.columnDef == 'previousFollowupDate' &&
            this.tableName == 'Customer'
          ) {
            // for displaying date with time
            //If the field type is in timestamp, then convert to date format
            let dateTemp = cellValue;
            try {
              //to hanndle cases where data is not presenet

              let previousFollowupTime = element.previousFollowupTime
                ? this.commonService.transformTo12Hour(
                    element.previousFollowupTime
                  )
                : '';
              return (
                this.datepipe.transform(
                  new Date(dateTemp.seconds * 1000),
                  'dd-MM-yyyy'
                ) +
                ' ' +
                previousFollowupTime
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
      } else if (column.columnDef === 'salesStage') {
        return this.commonService.getStatusName(
          modules.sales,
          element.selectedSalePipeline,
          element.salesStage
        );
      } else if (column.columnDef == 'selectedSalePipeline') {
        return this.commonService.getPipelineNames(modules.sales, cellValue);
        //If field is pipeline
      } else if (column.columnDef == 'associatedBranch') {
        const pos = this.branches.map((e) => e.id).indexOf(cellValue);

        try {
          return this.branches[pos].name;
        } catch {
          return 'NA';
        }
      }
      else if(column.columnDef == 'contactNumber' && this.tableName=='Sale'){
        let countryCode =element.countryCode ? element.countryCode:'';
        let contactNumber =element.contactNumber ? element.contactNumber:'';
        return countryCode+' '+contactNumber;
      }
      else if(column.columnDef == 'altContactNumber' && this.tableName=='Sale'){
        let altCountryCode =element.altCountryCode ? element.altCountryCode:'';
        let altContactNumber =element.altContactNumber ? element.altContactNumber:'';
        return altCountryCode+' '+altContactNumber;
      }
      else {
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
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableService.saleList.data.length;
    return numSelected == numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.tableService.saleList.data.forEach((row) =>
        this.selection.select(row)
      );
  }



  // add task from customer fn
  addTask(row) {
    this.addTaskEvent.emit(row);
  }

  // create followups from customer fn
  onCreateFollowUps(
    data
  ) {
    this.onCreateFollowUpsEvent.emit(data);
  }
  // edit customer
  editSale(row) {
    const data = { index: 0, sale: row };
    this.editSaleEvent.emit(data);
  }


  //dialog to customize the table fields
  openDialog() {
    const data = { columnsDispaly: this.columnsDispaly, customField: this.customFieldsSale };
    this.openDialogEvent.emit(data)
  }
  // network check
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  // for getting the aged contact
  getAgedStatus(element) {
    // if age activation is there
    if (this.actSaleAgeing) {
      //find the index of stage in stage array
      let today: Date = new Date();
      let input: Date;
      if (element.stageHistory.length > 0) {
        input = new Date(
          element.stageHistory[element.stageHistory.length - 1].date
        );
      } else {
        input = new Date(element.createdDate);
      }

      let daysinStage: number = Math.ceil(
        (today.getTime() - input.getTime()) / (1000 * 3600 * 24)
      ); //Calculate the number of days in current stage

      let maxDaysinStage = 0;
      let statusArray = [];
      let statusObj;

      const pipeLine = this.salePipelines.filter((obj) => {
        return obj.pipelineId === element.selectedSalePipeline;
      });
      // pipeline deleted case
      if (pipeLine.length === 0) {
        return 'N/A';
      } else {
        statusArray = pipeLine[0].pipelineStages;
        // if no status array found case
        if (statusArray.length === 0) {
          return 'N/A';
        } else {
          statusObj = statusArray.filter((obj) => {
            return obj.stageId === element.salesStage;
          });
          // status deleted case
          if (statusObj.length === 0) {
            return 'N/A';
          } else {
            maxDaysinStage = statusObj[0].age;
            if (
              element.salesStage ===
                statusArray[statusArray.length - 1].stageId ||
              element.salesStage === statusArray[statusArray.length - 2].stageId
            ) {
              return 'N/A';
            } else {
              if (daysinStage >= maxDaysinStage) {
                return 'Yes';
              } else {
                return 'No';
              }
            }
          }
        }
      }
    } else {
      return 'N/A';
    }
  }

  // create invoice-web
  createInvoice(saleId, customerId, orgId) {
    //create an invoice for a paritcular sale ID
    this.selection.clear(); // clear table data selection
    this.router.navigate([
      '/dash/document/documentinvoicemanagement/',
      saleId,
      'create',
      'Invoice',
      customerId ? customerId : 'none',
      orgId ? orgId : 'none',
      'none',
    ]);
  }
  // create estimate-web
  createEstimate(saleId, customerId, orgId) {
    this.selection.clear(); // clear table data selection
    this.router.navigate([
      '/dash/document/documentmanagement/',
      saleId,
      'create',
      'Estimate',
      customerId ? customerId : 'none',
      orgId ? orgId : 'none',
      'none',
    ]);
  }
  //create a quote for a paritcular sale ID
  createQuote(saleId, customerId, orgId) {
    this.selection.clear(); // clear table data selection
    this.router.navigate([
      '/dash/document/documentquotationmanagement/',
      saleId,
      'create',
      'Quotation',
      customerId ? customerId : 'none',
      orgId ? orgId : 'none',
      'none',
    ]);
  }
}

