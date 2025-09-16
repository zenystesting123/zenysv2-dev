/**************************************************************************
 * Description :Child of table/task-list component,
 *  task lite mode table view, while change page it loads more data
 *
 * ************************************************************************* */
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { TaskTableService } from '../task-list/task-table.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { contactSettings, defaultContactSettings, SettingsItem, defaultSaleSettings, defaultServiceSettings, defaultTaskSettings, taskSettings, Task, Branch } from 'src/app/data-models';
import { TaskTableColumns } from 'src/app/model/custom-report.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { TaskPaginatorIntl } from './task-paginator-intl';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { DatePipe } from '@angular/common';
import { CustomTableSettingsComponent } from 'src/app/custom-tables/custom-table-settings/custom-table-settings.component';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-task-table-view',
  templateUrl: './task-table-view.component.html',
  styleUrls: ['./task-table-view.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: TaskPaginatorIntl }
  ]
})
export class TaskTableViewComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() userId: string; // current user id
  @Input() superUserId: string;// super user id
  @Input() fieldNameTask: string = 'Task';
  @Input() customFieldTask: any[]; // contact additional fields
  @Input() columnsDispaly = []; // table columns configuration
  @Input() tableDefaultData = TaskTableColumns;// table columns configuration . used for adding new field which is added on modal
  @Input() taskSettings: taskSettings = defaultTaskSettings.CONST_VALUE;// custoer settigs configuration
  @Input() contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;// custoer settigs configuration
  @Input() saleTitleSettings: SettingsItem = defaultSaleSettings.CONST_VALUE.saleTitle;
  @Input() serviceTitleSettings: SettingsItem = defaultServiceSettings.CONST_VALUE.serviceTitle;
  @Input() statusOption: any[] = [];
  @Input() lastTaskStatusOpn: string;
  @Input() userIdsArray: any[] = []; // users id
  @Input() userNamesArray: any[] = []; // users names
  @Input() selection = new SelectionModel<Task>(true, []); // table selection
  @Output() editTaskEvent = new EventEmitter<Task>();
  @Output() deleteTaskEvent = new EventEmitter<{ index: number, id: string }>();// delete task event passed to parent
  @Output() updateTaskStatusEvent = new EventEmitter<Task>();

  getDataSubscription: Subscription;// used for unsubscribe task data subscription
  displayedColumns = []; // for getting the selected column for displaying in the table
  isLoading: boolean = true;// for displaying spinner while data is loading
  networkConnection: boolean; //to check network connection
  dateIndexMap = new Map<number, string>(); //for saving last document date readed
  docIdIndexMap = new Map<number, string>(); //for saving last document id readed
  totalItems = 0; // task list length used for pagination
  pageSizeOptions: number[] = [10, 20, 30]; //page size options for table
  paginatorIntl: MatPaginatorIntl;
  branches: Branch[];// list of branches
  constructor(public networkCheck: NetworkCheckService, public commonService: CommonService, public chageDetection: ChangeDetectorRef,
    private customPaginatorIntl: TaskPaginatorIntl, public tableService: TaskTableService, public dialog: MatDialog,
    private snackBar: MatSnackBar, public datepipe: DatePipe,) {
    this.paginatorIntl = customPaginatorIntl;
    //initialize array
    this.tableService.taskList = new MatTableDataSource([]);
    this.branches = this.commonService.branches;
  }

  ngOnInit(): void {
    this.configureTable();
    this.getData(this.tableService.pageIndex);
  }
  ngOnDestroy(): void {
    this.tableService.taskList.data = [];
    // unsubscribe all subscription
    this.getDataSubscription?.unsubscribe();
  }
  onPageChanged(event) {
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
  // mark as completed
  updatestatus(data) {
    this.updateTaskStatusEvent.emit(data);
  }
  // edit task
  onEditTask(data) {
    this.editTaskEvent.emit(data);
  }
  //delete task
  deleteTask(id) {
    const data = { index: 0, id: id };
    this.deleteTaskEvent.emit(data);
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
        displayName: 'displayTaskColumns',
        customFields: this.customFieldTask,
      },
      disableClose: true,
      width: '600px',
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if (result) {
        this.columnsDispaly = result.displayTaskColumns;
        this.configureTable();
      }
    })
  }
  // network check
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  //if cvs has no data
  noDataMessage() {
    this.snackBar.open('No data to download', '', {
      duration: 2000,
    });
  }
  // get data based on last data fetched
  getData(pageIndex) {
    this.getDataSubscription?.unsubscribe(); // unsubscribe previus subscription
    this.getDataSubscription = this.tableService.getData(this.superUserId, this.userId, this.statusOption).subscribe(data => {
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
        this.tableService.pageIndex = pageIndex;// assign page index
        this.tableService.taskList = new MatTableDataSource<Task>(data);
        this.docIdIndexMap.set(this.tableService.pageIndex + 1, data[data.length - 1].id);
        // based on the view selected and order by user in query update last date

        this.dateIndexMap.set(this.tableService.pageIndex + 1, data[data.length - 1].dueDate);

        this.totalItems = data.length;// length of data
        let colmn = this.columnsDispaly.map((obj) => ({
          ...obj,
        }));
        let datalist = this.tableService.taskList.data.map((obj) => ({
          ...obj,
        }));
        datalist.forEach((element) => {
          // est assigned to name
          if (element.assignedTo) {
            element.assignedToName = this.commonService.getAssignedToName(element.assignedTo)
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
        this.tableService.taskList.data = datalist;
        this.isLoading = false;// hide spinner
      } else {
        // if data length is not greater than zero assign lastDateTime and lastDocumentId based on the age index in service
        let date = this.dateIndexMap.get(this.tableService.pageIndex);
        let docId = this.docIdIndexMap.get(this.tableService.pageIndex);
        this.tableService.lastDateTime = date;
        this.tableService.taskList = new MatTableDataSource<Task>([]);
        this.tableService.lastDocumentId = docId;
        this.tableService.taskList.data = []
        this.totalItems = data.length;
        this.isLoading = false;// hide spinner
      }

    })
  }
  //reset table data
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
    this.getData(this.tableService.pageIndex);// get data based on view selected
  }
  // table configuartion
  configureTable() {
    //removing additional field if it is removed from settings
    this.customFieldTask?.forEach((element, index) => {
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
    this.customFieldTask?.forEach((element, index) => {
      if (element.isActive) {
        let field = this.customFieldTask[index].fieldName;
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
            columnDef: this.customFieldTask[index].fieldName,
            header: this.customFieldTask[index].fieldName,
            display: false,
            type: this.customFieldTask[index].fieldType,
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
      if (this.taskSettings) {
        Object.keys(this.taskSettings).forEach((ele) => {
          if (this.columnsDispaly[i]?.columnDef == ele) {
            this.columnsDispaly[i].header =
              this.taskSettings[`${ele}`].displayName;
            if (!this.taskSettings[`${ele}`].display) {
              this.columnsDispaly.splice(i, 1); // removing the column
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
    // actions column adding to task table at index 1
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
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.tableService.taskList.data.length;
      return numSelected == numRows;
    }
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected()
        ? this.selection.clear()
        : this.tableService.taskList.data.forEach((row) =>
          this.selection.select(row)
        );
    }
}
