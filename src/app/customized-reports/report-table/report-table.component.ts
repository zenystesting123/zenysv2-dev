import { Branch, customFields, followUpTableColumns,modules, Profile,  ReportSettings,  SubUsers } from 'src/app/data-models';
import { Component, OnInit, Input, Inject, SimpleChanges, ViewChild, OnChanges, OnDestroy, IterableDiffer, IterableDiffers, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { customerTableColumns, salesTableColumns, productTableColumns, serviceTableColumns, taskTableColumns, invoiceTableColumns, quotationTableColumns, estimateTableColumns, expenseTableColumns, paymentTableColumns } from 'src/app/data-models';
import { TableSettingsComponent } from '../table-settings/table-settings.component';
import { CrudModal1Component } from 'src/app/taskboard/crud-modal1/crud-modal1.component';
import { CommonService } from 'src/app/common.service';
import { FollowupTaskCreateComponent } from 'src/app/followup-task-create/followup-task-create.component';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { contactSettings, defaultContactSettings, saleSettings, defaultSaleSettings, serviceSettings, defaultServiceSettings } from 'src/app/data-models';
import { Paymentreceipt1Component } from 'src/app/paymentreceipt1/paymentreceipt1.component';
import { Expenses1Component } from 'src/app/expenses1/expenses1.component';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss']
})

export class ReportTableComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() module = ''; // //module selected - sale/ contact/ task etc
  @Input() tableData: []; // // data to be displayed in the table
  @Input() customFields: any = []; // // data to be displayed in the table
  @Input() displayColumnsSaved: [] = []; // // data to be displayed in the table
  @Input() reportNo: number = 0; // // report number
  @Input() reportSetting:ReportSettings // // report number
  @Input() userId: ''; //user id
  @Input() userIdsArray: any[] = [];//array of user Ids including super user based on data access rule = All/ Own/ Team
  @Input() userNamesArray: any[] = []//array of user names including super user based on data access rule = All/ Own/ Team
  @Input() pipelineNames: any = []// pipeline names for contact or sale
  columns = [];
  customerColumns = customerTableColumns;
  salesColumns = salesTableColumns;
  productsColumn = productTableColumns;
  servicesColumns = serviceTableColumns;
  tasksColumns = taskTableColumns;
  followUpColumns = followUpTableColumns;
  dataList: MatTableDataSource<any>; //stores list of estimate
  invoiceColumns = invoiceTableColumns;
  quotationColumns = quotationTableColumns;
  estimateColumns = estimateTableColumns;
  expenseColumns = expenseTableColumns;
  paymentsColumns = paymentTableColumns;
  displayedColumns = [];
  dialogRef: any;
  taskDialog: any;
  followUpDialog: any;
  private onDestroy$: Subject<void> = new Subject<void>();
  subUsers: SubUsers[];
  superUserDetails: Profile;
  contactFieldSettings: contactSettings;
  saleFieldSettings: saleSettings;
  serviceFieldSettings: serviceSettings;
  fieldCustomSettings: any;
  iterableDiffer: IterableDiffer<any>;
  branches: Branch[];
  tableDefaultData: any[]; // default data for table
  @Input() fieldNameNotes: string = 'Note';//customisable note field name
  @Input() fieldNameFollowup: string = 'FollowUp'; //customisable FollowUp field name
  constructor(public datepipe: DatePipe, public dialog: MatDialog, private router: Router, public commonService: CommonService, public iterableDiffers: IterableDiffers,) {
    //initialize array
    //console.log("Constructor called",this.tableData)
    this.branches= this.commonService.branches;
    this.iterableDiffer = iterableDiffers.find([]).create(null)
    this.dataList = new MatTableDataSource([]);
    this.dataList.data = this.tableData;
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        if (allData.authDetails) {
          this.subUsers = allData.subUsers;
        }
        this.superUserDetails = allData.superUserDetails;
        if (allData.superUserDetails.contactSettings) {
          this.contactFieldSettings = allData.superUserDetails.contactSettings;
        } else {
          this.contactFieldSettings = defaultContactSettings.CONST_VALUE;
        }
        if (allData.superUserDetails.saleSettings) {
          this.saleFieldSettings = allData.superUserDetails.saleSettings;
        } else {
          this.saleFieldSettings = defaultSaleSettings.CONST_VALUE;
        }
        if (allData.superUserDetails.serviceSettings) {
          this.serviceFieldSettings = allData.superUserDetails.serviceSettings;
        } else {
          this.serviceFieldSettings = defaultServiceSettings.CONST_VALUE;
        }

      })
  }

  ngOnDestroy(): void {
  }


  ngOnInit(): void {

    this.configureTable();
    this.dataList.data = this.tableData;


  }



  onRowClick(rowId, row) {
    //Navigate to the corrsponding detail page or open the pop up


    if (this.module == 'customers') {
      let link = 'dash/contact/customerdetails/' + rowId
      // this.router.navigate(['dash/contact/customerdetails/' + rowId]);
      this.router.navigate([]).then(result => { window.open(link, '_blank'); });
    } else if (this.module == 'sales') {
      let link = 'dash/sales/saleview/' + rowId
      //this.router.navigate(['dash/sales/saleview/' + rowId]);
      this.router.navigate([]).then(result => { window.open(link, '_blank'); });
    } else if (this.module == 'tasks') {

        this.commonService.updateTaskToEdit(row);
         this.taskDialog= this.dialog.open(CrudModal1Component, {
          width: '1060px',
          height: 'auto',
          disableClose: true,
          data: {
            id: rowId, mode: "update"
          }
        });
        this.taskDialog.afterClosed().subscribe(x => {
          this.taskDialog = null;
       });


    } else if (this.module == 'Follow Ups') {
      let taskId: string = row.id;
      let customerId: string = row.customerId;
      let companyName: string = row.companyNam;
      let customerName: string = row.customerName;
      this.commonService.followUpDetails = row;
      this.followUpDialog = this.dialog.open(FollowupTaskCreateComponent, {
        width: '700px',
        height: 'auto',
        disableClose: true,
        data: {
          id: customerId, // pass customer id
          companyNames: companyName, // pass company name
          customerNames: customerName, // pass customer name
          contactNumber: row.contactNumber ? row.contactNumber:'', // pass customer number
          countryCode: row.countryCode ? row.countryCode:'', // pass customer country code
          scenario: 'edit', // scenario for followup popup
          followUpId: taskId, // pass task id
          subUsers: this.subUsers, // pass sub user list
          fname: this.superUserDetails.firstname, // pass super user first name
          lastname: this.superUserDetails.lastname, // pass super user second name
          editFrom: 'table', // pass from  which part the popup is open
        },
      });
      this.followUpDialog.afterClosed().subscribe(x => {
        this.followUpDialog = null;
      });
    }else if (this.module == 'Invoices') {

      let link = '/dash/document/Invoice/'+ row.id
      //this.router.navigate(['dash/sales/saleview/' + rowId]);
      this.router.navigate([]).then(result => { window.open(link, '_blank'); });
    }    else if (this.module == 'Quotations') {

      let link = '/dash/document/Quotation/'+  row.id
      //this.router.navigate(['dash/sales/saleview/' + rowId]);
      this.router.navigate([]).then(result => { window.open(link, '_blank'); });
    } else if (this.module == 'Estimates') {

      let link = '/dash/document/Estimate/'+ row.id
      //this.router.navigate(['dash/sales/saleview/' + rowId]);
      this.router.navigate([]).then(result => { window.open(link, '_blank'); });
    } else if (this.module == 'paymentsreceived'){
      this.commonService.updatePaymentToEdit(row);
      this.dialog.open(Paymentreceipt1Component, {
        width: '700px',
        height: 'auto',
        disableClose: true,
        data: {
          saleId: row.saleid,
          customerId: row.customerId,
          mode: 'update',
          paymentId: row.id,
          customerName: row.customerSecondName
          ? row.customerName + ' ' + row.customerSecondName
          : row.customerName,
          componentName: this.constructor.name,
        orgId: row.orgId,
        company: row.customerCompany,
        saleTitle: row.saleTitle,
        },
      });
    }else if (this.module == 'Expenses'){
      this.commonService.updateExpenseToEdit(row);
      this.dialog.open(Expenses1Component, {
        width: '600px',
        height: 'auto',
        disableClose: true,
        data: {
          mode: 'update',
          expenseId: row.id,
          componentName: this.constructor.name
        },
      });
    }
  }
  findColumnValue(element: any, column: any) {
    let cellValue: any;
    //MK - 13th Aug 2022 - removing the check for additional fields since we are inserting each additional fields into the data table as a
    /*if(column.fieldType == 'Additional'){
      try{
        let addnlFieldArray = element.additionalFieldsArr; // Get the sepcific value
        cellValue = addnlFieldArray[column.ind].fieldValue;
      } catch{
        cellValue = '';
      }
    }
    else {
      // if normal field get the value

      cellValue = element[column.columnDef];
    }*/
    //console.log(element, column)
    if (column.fieldType == 'docData'){
      cellValue = element.docData[column.columnDef];

    } else if (column.fieldType == 'customerData'){
      cellValue = element.customerData[column.columnDef];
    } else{
      cellValue = element[column.columnDef];
    }

    //fieldSplit = fieldSplit.split("]",1)

    //function to display the values in each cell of the table
    if (column.type == 'date') {
      if (typeof cellValue === 'number') {
        //if the date is stored as normal number and not timestamp
        try {
          return this.datepipe.transform(new Date(cellValue), 'dd-MM-yyyy');
        }
        catch {
          return ''
        }
      } else {
        //If the field type is in timestamp, then convert to date format
        let dateTemp = cellValue;
        //console.log("Date", dateTemp)
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
    }
    else if (column.type == 'date_time') {
      if (typeof cellValue === 'number') {
        //if the date is stored as normal number and not timestamp
        try {
          return this.datepipe.transform(new Date(cellValue), 'dd-MM-yyyy');
        }
        catch {
          return ''
        }
      } else {
        if (column.columnDef != 'nextFollowupDate' && column.columnDef != 'previousFollowupDate' ) {
        //If the field type is in timestamp, then convert to date format
        let dateTemp = cellValue;
        //console.log("Date", dateTemp)
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
       } else if (column.columnDef == 'nextFollowupDate' && this.module == 'customers') {
         // for displaying date with time
        //If the field type is in timestamp, then convert to date format
        let dateTemp = cellValue;
        //console.log("Date", dateTemp)
        try {
          //to hanndle cases where data is not presenet
          let nextFollowupTime= element.nextFollowupTime ? this.commonService.transformTo12Hour(element.nextFollowupTime) :''
          return this.datepipe.transform(
            new Date(dateTemp.seconds * 1000),
            'dd-MM-yyyy'
          )+' '+nextFollowupTime;
        } catch {
          //if data is not present return empty string
          return '';
        }
      }
       else if (column.columnDef == 'previousFollowupDate' && this.module == 'customers') {
         // for displaying date with time
        //If the field type is in timestamp, then convert to date format
        let dateTemp = cellValue;
        //console.log("Date", dateTemp)
        try {
          //to hanndle cases where data is not presenet

          let previousFollowupTime= element.previousFollowupTime ? this.commonService.transformTo12Hour(element.previousFollowupTime) :''
          return this.datepipe.transform(
            new Date(dateTemp.seconds * 1000),
            'dd-MM-yyyy'
          )+' '+previousFollowupTime;
        } catch {
          //if data is not present return empty string
          return '';
        }
      }
      }
    }
    else if (column.columnDef == 'createdBy' || column.columnDef == 'createdById') {
      return this.userNamesArray[this.userIdsArray.indexOf(cellValue)];//Get the name corresponding to the Id
    } else if (column.columnDef == 'selectedContactPipeline' || column.columnDef == 'selectedSalePipeline' || column.columnDef == 'selectedServPipeline') {
      return this.commonService.getPipelineNames(this.module, cellValue)
      //If field is pipeline
    } else if ((column.columnDef == 'status' && this.module =='customers')) {
      return this.commonService.getStatusName(this.module,element.selectedContactPipeline,cellValue)
      //If field is pipeline
    }
    else if ((column.columnDef == 'salesStage' && (this.module =='sales' || this.module == modules.products)) ) {
      return this.commonService.getStatusName(modules.sales,element.selectedSalePipeline,cellValue)
      //If field is pipeline
    }
    else if ((column.columnDef == 'servicesStage' && this.module =='services')) {
      return this.commonService.getStatusName(this.module,element.selectedServPipeline,cellValue)
      //If field is pipeline
    }
    else if (column.columnDef == 'associatedBranch') {
      const pos = this.branches.map(e => e.id).indexOf(cellValue);

      try {
        return this.branches[pos].name
      } catch {
        return 'NA';
      }

    }
    else if (
      column.columnDef == 'contactNumber' && this.module == 'Follow Ups'
    ) {
      let countryCode = element.countryCode ? element.countryCode:'';
      let contactNumber =  element[column.columnDef] ? element[column.columnDef]:'';
        return  countryCode+' '+contactNumber;
    }
      //If field is pipeline
    else if (column.columnDef == 'contactNumber' && this.module == modules.sales) {
      let countryCode = element.countryCode ? element.countryCode : '';
      let contactNumber = element.contactNumber ? element.contactNumber : '';
      return countryCode + ' ' + contactNumber;
    }
    else if (column.columnDef == 'altContactNumber' && this.module == modules.sales) {
      let altCountryCode = element.altCountryCode ? element.altCountryCode : '';
      let altContactNumber = element.altContactNumber ? element.altContactNumber : '';
      return altCountryCode + ' ' + altContactNumber;
    }
    else if (column.columnDef == 'contactNumber' && this.module == modules.services) {
      let countryCode = element.countryCode ? element.countryCode : '';
      let contactNumber = element.contactNumber ? element.contactNumber : '';
      return countryCode + ' ' + contactNumber;
    }
    else if (column.columnDef == 'altContactNumber' && this.module == modules.services) {
      let altCountryCode = element.altCountryCode ? element.altCountryCode : '';
      let altContactNumber = element.altContactNumber ? element.altContactNumber : '';
      return altCountryCode + ' ' + altContactNumber;
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

  ngOnChanges(changes: SimpleChanges) {
    //console.log("ngOnChanges called",this.tableData)
    this.dataList.data = this.tableData;
    this.dataList.paginator = this.paginator;
    this.dataList.sort = this.sort;
    this.configureTable();
    //For all additional fields introce new key value pairs corresponding to the additional field to enable search and filter
    if (this.dataList.data){
      this.dataList.data.forEach(element => {
        if(element.assignedTo){
          element.assignedToName = this.commonService.getAssignedToName(element.assignedTo)
        }
        this.columns.forEach(ele => {
          if (ele.fieldType == 'Additional') {
            let key = ele.columnDef;
            let val: any;
            try {
              val = element.additionalFieldsArr[ele.ind]?.fieldValue
            } catch {
              val = '';
            }
            element[`${key}`] = val;
          }

        })

      })
    }

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataList.filter = filterValue.trim().toLowerCase();

    if (this.dataList.paginator) {
      this.dataList.paginator.firstPage();
    }
  }

  configureTable() {

    {
      if (this.module == 'customers') {
        this.tableDefaultData = this.customerColumns;
        this.columns = this.customerColumns;
        this.fieldCustomSettings = this.contactFieldSettings;

      } else if (this.module == 'sales') {
        this.tableDefaultData = this.salesColumns;
        this.columns = this.salesColumns; //replace with sales column
        this.fieldCustomSettings = this.saleFieldSettings;
      } else if (this.module == 'products') {
        this.tableDefaultData = this.productsColumn;
        this.columns = this.productsColumn; //replace with sales column
        this.fieldCustomSettings = this.saleFieldSettings;
      }else if (this.module == 'services') {
        this.tableDefaultData = this.servicesColumns;
        this.fieldCustomSettings = this.serviceFieldSettings;
        this.columns = this.servicesColumns; //replace with service column
      }
      else if (this.module == 'tasks') {
        this.tableDefaultData = this.tasksColumns;
        this.columns = this.tasksColumns; //replace with sales column
      }
      else if (this.module == 'Follow Ups') {
        this.tableDefaultData = this.followUpColumns;
        this.columns = this.followUpColumns; //replace with sales column
      } else if (this.module == 'Invoices') {
        this.tableDefaultData = this.invoiceColumns;
        this.columns = this.invoiceColumns; //replace with sales column
      }
      else if (this.module == 'Quotations') {
        this.tableDefaultData = this.quotationColumns;
        this.columns = this.quotationColumns;
      }
      else if (this.module == 'Estimates') {
        this.tableDefaultData = this.estimateColumns;
        this.columns = this.estimateColumns;
      }
      else if (this.module == 'Expenses') {
        this.tableDefaultData = this.expenseColumns;
        this.columns = this.expenseColumns;
      }
      else if (this.module == 'paymentsreceived') {
        this.tableDefaultData = this.paymentsColumns;
        this.columns = this.paymentsColumns;
      }

    }    if (this.displayColumnsSaved !== undefined) {
      //if table settings are stored in db, use the stored data
      this.columns = this.displayColumnsSaved;
    }
    //check and add the custom fields if not present
    //console.log(this.customFields)
    if (this.customFields !== undefined && this.customFields.length > 0) {
      //check and add any additional fields configured newly if these are not present in the customFields array
      //console.log("custom fields", this.customFields)
      this.customFields.forEach((element, index) => {
        if(element.isActive){
          let field = 'additionalFieldsArr[' + index + '].fieldValue';
          let fieldPresent = false;
          this.columns.forEach((col) => {
            if (
              col.ind == index &&
              col.fieldType == 'Additional' &&
              col.header != element.fieldName
            ) {
              col.header = element.fieldName;
            }
            if (col.columnDef == field) {
              fieldPresent = true;
            }
          });
          if (fieldPresent == false) {

            this.columns.push({
              columnDef: field,
              header: this.customFields[index].fieldName,
              display: false,
              type: this.customFields[index].fieldType,
              fieldType: 'Additional',
              ind: index
            });
          }
        }
      });

      //check and removed any additional fields removed newly if these are present in the customFields array
      // let object3Names = this.customFields?.map(obj => obj.fieldName)// temp object to store field names
      // let object2Names = this.columns.map(obj => obj.header)//temp object to store the columndef
      // object2Names.filter(ele => {
      //   if (object3Names?.includes(ele)){}
      //   else {
      //     this.columns.filter((data, index) => {
      //       if (data.fieldType == 'Additional' && data.header == ele) {
      //         this.columns.splice(index, 1)
      //       }
      //     })
      //   }
      // })
    }

    let object1Names = this.tableDefaultData?.map((obj) => obj.columnDef); // for caching the result
    let objectNames = this.columns?.map((obj) => obj.columnDef); // for caching the result
    object1Names?.filter((ele) => {
      if (!objectNames?.includes(ele)) {
        this.tableDefaultData.filter((data) => {
          if (data.columnDef === ele) {
            this.columns.push(data);
            return;
          }
        });
      }
    });

    // for handling the fieldname customization and remove column if it is unchecked in fieldname settings
    for (var i = this.columns.length - 1; i >= 0; i--) {
      if (this.fieldCustomSettings) {
        Object.keys(this.fieldCustomSettings).forEach((ele) => {
          if (this.columns[i]?.columnDef == ele) {
            this.columns[i].header = this.fieldCustomSettings[`${ele}`].displayName;
            if (!this.fieldCustomSettings[`${ele}`].display) {
              this.columns.splice(i, 1); // removing the column
            }
          }
          // for handling the folowup customer name becuase here fullname is stored
          if (ele == 'customerControl') {
            if (this.columns[i]?.columnDef == 'customerName' && this.module == 'Follow Ups') {
              this.columns[i].header = this.fieldCustomSettings[`${ele}`].displayName
            }
          }
        });
      }
      if (this.module == modules.sales && this.contactFieldSettings) {
        // based on contact feild name setting of customer number / alt contact number show/hide column
        if (this.columns[i]?.columnDef == 'contactNumber') {
          let ele = 'contactNo'
          this.columns[i].header =
            this.contactFieldSettings[ele].displayName;
          if (!this.contactFieldSettings[`${ele}`].display) {
            this.columns.splice(i, 1); // removing the column
          }
        } else if (this.columns[i]?.columnDef == 'altContactNumber') {    
          let ele = 'alternateContactNumber'
          this.columns[i].header =
            this.contactFieldSettings[ele].displayName;
          if (!this.contactFieldSettings[`${ele}`].display) {
            this.columns.splice(i, 1); // removing the column
          }
        }
      }
      if (this.module == modules.services && this.contactFieldSettings) {
        // based on contact feild name setting of customer number / alt contact number show/hide column
        if (this.columns[i]?.columnDef == 'contactNumber') {
          let ele = 'contactNo'
          this.columns[i].header =
            this.contactFieldSettings[ele].displayName;
          if (!this.contactFieldSettings[`${ele}`].display) {
            this.columns.splice(i, 1); // removing the column
          }
        } else if (this.columns[i]?.columnDef == 'altContactNumber') {    
          let ele = 'alternateContactNumber'
          this.columns[i].header =
            this.contactFieldSettings[ele].displayName;
          if (!this.contactFieldSettings[`${ele}`].display) {
            this.columns.splice(i, 1); // removing the column
          }
        }
      }
      // for setting the contact field headers
      if (this.contactFieldSettings) {
        if (this.columns[i]?.columnDef == 'firstName' || this.columns[i]?.columnDef == 'fname1'
          || this.columns[i]?.columnDef == 'customerFirstName' || this.columns[i]?.columnDef == 'customerName' || this.columns[i]?.columnDef == 'name') {
          if (this.module != 'Followup') {
            this.columns[i].header = this.contactFieldSettings[`${'firstName'}`].displayName
          }
        }
        if (this.columns[i]?.columnDef == 'lastName' || this.columns[i]?.columnDef == 'secondName' || this.columns[i]?.columnDef == 'customerSecondName' || this.columns[i]?.columnDef == 'sname') {
          this.columns[i].header = this.contactFieldSettings[`${'secondName'}`].displayName

        }
        if (this.columns[i]?.columnDef == 'salutation') {
          this.columns[i].header = this.contactFieldSettings[`${'salutation'}`].displayName

        }
        if (this.columns[i]?.columnDef == 'surname') {
          this.columns[i].header = this.contactFieldSettings[`${'surname'}`].displayName

        }
        if (this.columns[i]?.columnDef == 'companyName' || this.columns[i]?.columnDef == 'customerCompany' || this.columns[i]?.columnDef == 'company') {
          this.columns[i].header = this.contactFieldSettings[`${'companyName'}`].displayName

        }
        if (this.columns[i]?.columnDef == 'contactNumber' &&
        this.module == 'Follow Ups') {
        this.columns[i].header =this.contactFieldSettings[`${'contactNo'}`].displayName;
        }
      }
      if (this.saleFieldSettings) {
        if (this.columns[i]?.columnDef == 'saleTitle') {
          this.columns[i].header = this.saleFieldSettings.saleTitle.displayName

        }
      }
      // for setting the service field headers
      if (this.serviceFieldSettings) {
        if (this.columns[i]?.columnDef == 'serviceTitle') {
          this.columns[i].header = this.serviceFieldSettings.serviceTitle.displayName

        }
      }
      // for changing the header by custom field name
      if (this.columns[i]?.columnDef == 'lastNoteDate') {
        this.columns[i].header = 'Last '+this.fieldNameNotes+' Date';
      }
      else if (this.columns[i]?.columnDef == 'lastAddedNote') {
        this.columns[i].header = 'Last '+this.fieldNameNotes;
      }
      else if (this.columns[i]?.columnDef == 'nextFollowupDate') {
        this.columns[i].header = 'Next '+this.fieldNameFollowup+' Date';
      }
      else if (this.columns[i]?.columnDef == 'previousFollowupDate') {
        this.columns[i].header = 'Previous '+this.fieldNameFollowup+' Date';
      }
      /*if (cardFields[i]?.display == true) {
        console.log("card field added to display field",cardFields[i], i )
        displayFields.push(cardFields[i]);
      }*/
    }
        //removing additional field if it is removed from settings
        this.customFields?.forEach((element, index) => {
          if (!element.isActive) {
            for (var i = this.columns?.length - 1; i >= 0; i--) {
              if (this.columns[i]?.fieldType == 'Additional' &&
              this.columns[i]?.columnDef == 'additionalFieldsArr['+index+'].fieldValue' && this.columns[i]?.ind == index) {
                this.columns?.splice(i, 1)
              }
            }
          }
        });
    //console.log("Columns added with adnl fields", this.columns)
    let filteredColumns = []; //temp array for storing the columns that are to be displayed
    this.columns.forEach((col, index) => {
      //       //Check the custom fiedl settings and remove any fields which are not to e displayed as per the settings
      if (col.display == true) {
        filteredColumns.push(col);
      }
    });

    this.displayedColumns = filteredColumns.map((c) => c.columnDef);
  }

  openDialog() {
    //open the dialog to customize the table fields
    this.dialogRef = this.dialog.open(TableSettingsComponent, {
      data: [this.columns, this.reportNo, this.reportSetting, this.userId,this.customFields],
      width: '600px',
    });
  }
  ngAfterViewInit() {
    this.dataList.paginator = this.paginator; //for pagination
    this.dataList.sort = this.sort; //for pagination
  }
}
