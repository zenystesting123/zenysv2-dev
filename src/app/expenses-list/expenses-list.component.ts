/**********************************************************************************
Description: Component is used to list  expenses
**********************************************************************************/
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DisplayColumn, Profile, defaultExpenseSettings, Expenses, expenseSettings, UserAccessDetails, customFields, contactSettings, defaultContactSettings, SettingsItem, defaultSaleSettings, defaultServiceSettings } from '../data-models';
import { Location } from '@angular/common';
import { Expenses1Component } from '../expenses1/expenses1.component';
import { CommonService } from '../common.service';
import { NetworkCheckService } from '../networkcheck.service';
import { ExpenseTableColumns } from '../model/custom-report.model';
import { ExpenseSortingDef, ExpenseViewSettingsDef } from '../model/custom-filter.model';
import { ViewBuilderComponent } from '../view-builder/view-builder.component';
import { StatusPopupComponent } from '../settings/status-popup/status-popup.component';
import { ConfirmationpopupComponent } from '../confirmationpopup/confirmationpopup.component';
import { ViewServiceService } from '../view-builder/view-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
})
export class ExpensesListComponent implements OnInit, OnDestroy {

  progressBarStatus: boolean = false; //progressbar
  documentsArray: MatTableDataSource<Expenses>; //mat-table datasource
  userDetailsSubscription: Subscription; //userdata subscription from commonservice
  expenseFilterSubscription: Subscription;
  superUserId: string = ''; //logged in users superuserid
  userId: string = ''; //logged in users id
  disableCreateExp: boolean = false; //disable add expense based on profile access
  disableEditExpense: boolean = false;//disable edit expense based on profile access
  disableViewExpense: boolean = false;//disable view expense based on profile access
  disableExpDownload = false;//disable view expense based on profile access
  networkConnection: boolean; // checks network connection
  fieldNameExpense: string = 'Expense'
  expenseSettings: expenseSettings = defaultExpenseSettings.CONST_VALUE;
  columns = [];
  userIdsArray: any[] = [];
  userNamesArray: any[] = [];
  pipelineNames = [] = []; //Array to store the pipeline
  displayColumnsSaved: DisplayColumn[] = [];
  displayName: string = 'displayExpenseColumns'
  tableName: string = 'Expense';
  tableDefaultData = ExpenseTableColumns
  customFields: customFields[] = [];
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  saleTitleSettings: SettingsItem = defaultSaleSettings.CONST_VALUE.saleTitle;
  serviceTitleSettings: SettingsItem = defaultServiceSettings.CONST_VALUE.serviceTitle;
  viewId: number = 0;//View selected for displaying the data
  viewSettingArray: any = ExpenseViewSettingsDef.DATA//customer view settings array
  viewSettingSelected: any = this.viewSettingArray[0]; //particular view chosen by user
  userIdArray: any;
  userList: any;
  sortFieldDef = ExpenseSortingDef.Data
  dataRead: any[];
  alertPopupStatus:boolean=false;// to open the alert dialoge once 
  constructor(
    public dialog: MatDialog,
    private location: Location,
    private snackbar: MatSnackBar,
    public commonService: CommonService,
    public networkCheck: NetworkCheckService,
    public viewServiceService: ViewServiceService,
  ) {
    this.documentsArray = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    // userdata subscribing from commonservice
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          // assigning data to local variables
          this.userId = allData.userId;
          // values assign to superuserid
          if (allData.userDetails.superUserId) {
            this.superUserId = allData.userDetails.superUserId;
          } else {
            this.superUserId = allData.userId;
          }
          if (allData.userDetails.displayExpenseColumns) {
            this.displayColumnsSaved = allData.userDetails.displayExpenseColumns
          }
          this.customFields = allData.superUserDetails.customFieldsExpense;
          if (this.displayColumnsSaved.length > 0) {
            //if table settings are stored in db, use the stored data
            this.columns = this.displayColumnsSaved;
          } else {
            this.columns = ExpenseTableColumns;
          }
          [this.userIdsArray, this.userNamesArray] = this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names

          if (
            typeof allData.superUserDetails.expenseSettings != 'undefined' ||
            allData.superUserDetails.expenseSettings != null
          ) {
            this.expenseSettings = allData.superUserDetails.expenseSettings;
          }

          //customisation contact field
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
          if (
            allData.superUserDetails.serviceSettings &&
            typeof allData.superUserDetails.serviceSettings !== 'undefined' &&
            allData.superUserDetails.serviceSettings !== null
          ) {
            this.serviceTitleSettings = allData.superUserDetails.serviceSettings.serviceTitle;
          }
          //checking data rule for view edit and download
          if (allData.usrProfileData) {
            if (allData.usrProfileData.isCheckedExp == false) {
              this.disableCreateExp = true;
              this.disableEditExpense = true;
              this.disableViewExpense = true;
              this.disableExpDownload = true;
            } else {
              if (allData.usrProfileData.expCreate == false) {
                this.disableCreateExp = true;
              }
              if (allData.usrProfileData.expEdit == false) {
                this.disableEditExpense = true;
              }
              if (allData.usrProfileData.expView == false) {
                this.disableViewExpense = true;
              }
              if (allData.usrProfileData.expDownload == false) {
                this.disableExpDownload = true;
              }
            }
          }
          //getting field name
          if (allData.superUserDetails.fieldNames) {
            this.fieldNameExpense = allData.superUserDetails.fieldNames.fieldNameExpense;
          }
          if (allData.userDetails.expenseViewSettings) {
            this.viewSettingArray = JSON.parse(JSON.stringify(allData.userDetails.expenseViewSettings)) //View setting array for customer list
            this.viewSettingSelected = this.viewSettingArray[this.viewId]; // particular view selected
          }
          [this.userIdArray, this.userList] = this.commonService.createUserlist(allData.usrProfileData.dialogdataAccessRule, this.userId);
          this.getViewData()
        }
      }
    );
  }
  // for check network connection
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  // call popup to add expense
  addExpense() {
    this.dialog.open(Expenses1Component, {
      width: '600px',
        height: 'auto',
      disableClose: true,
      data: {
        mode: 'createFromList',
        componentName: this.constructor.name
      },
    });
  }
  //triggered while clicking back button
  onBack() {
    this.location.back();
  }
  // on destroy to unsubscribe
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.userDetailsSubscription?.unsubscribe();
    this.expenseFilterSubscription?.unsubscribe();
  }
  viewChanged(viewIndex) {
    this.viewId = viewIndex;
    this.viewSettingSelected = this.viewSettingArray[this.viewId]; // particular view selected
    this.alertPopupStatus=false;// popup status set as false to open poup if next view contactins deletd add field
    this.getViewData();
  }
  getViewData() {
    this.progressBarStatus = false;
    // open a popup if deleted additional field is used in custom view query
    if (this.viewSettingSelected.primaryQuery.queryField == 'additionalFieldsArr'
      && !this.customFields[this.viewSettingSelected.primaryQuery.ind].isActive) {
      if (!this.alertPopupStatus) {
        this.dialog.open(StatusPopupComponent, {
          disableClose: true,
          data: {
            type: 'Addtional_field_custom_view',
          },
        });
      }
      this.alertPopupStatus = true;
    } else if (this.viewSettingSelected.sortField.fieldType == 'Additional'
      && !this.customFields[this.viewSettingSelected.sortField.ind].isActive) {
      if (!this.alertPopupStatus) {
        this.dialog.open(StatusPopupComponent, {
          disableClose: true,
          data: {
            type: 'Addtional_field_custom_view',
          },
        });
      }
      this.alertPopupStatus = true;
    } else {
      this.viewSettingSelected.filters?.forEach(element => {
        if (element.queryField == 'additionalFieldsArr'
          && !this.customFields[element.ind].isActive) {
          if (!this.alertPopupStatus) {
            this.dialog.open(StatusPopupComponent, {
              disableClose: true,
              data: {
                type: 'Addtional_field_custom_view',
              },
            });
          }
          this.alertPopupStatus = true;
        }
      });
    }
    // get the data from specific format
    let queryData = this.commonService.getQueryData(this.viewSettingSelected.primaryQuery);
    let sortField = this.viewSettingSelected.sortField;
    let sortOrder = this.viewSettingSelected.sortOrder;
    if (queryData) {
      if (this.expenseFilterSubscription && !this.expenseFilterSubscription.closed) {
        this.expenseFilterSubscription?.unsubscribe();
      }
      this.expenseFilterSubscription = this.commonService
        .readPrimaryData(this.superUserId, 'Expenses', queryData, this.userIdArray)
        .subscribe((data) => {
          this.dataRead = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Expenses;
          });

          this.dataRead = this.dataRead.filter((element) =>
            this.userIdArray.includes(element.createdById)
          );
          this.dataRead = this.commonService.sortData(this.dataRead, sortField, sortOrder)
          // check if filter is present
          if (this.viewSettingSelected.filters.length > 0) {
            let filterData = this.viewSettingSelected.filters;
            filterData.forEach((element) => {
              let filterQuery = this.commonService.getQueryData(element);
              this.dataRead = this.dataRead.filter((record) =>
                this.commonService.filterData(record, filterQuery)
              );
            });
          }
          this.documentsArray.data = this.dataRead
          this.progressBarStatus = true;
        });
    }else{
      this.progressBarStatus = true;
    }
  }
  //Function to open the popup to edit views
  editView(mode) {
    //call the popup for card field customization
    let dialogRef = this.dialog.open(ViewBuilderComponent, {
      data: ['Expenses', this.viewId, mode, this.sortFieldDef],
      width: 'auto',
    });
    // Subscribe when the dialog box closes
    dialogRef.afterClosed().subscribe(
      (res)=>{
        // Receive data from dialog component
        // If new view has been added, then read the new view and load data
        if (res.response == 'Add') {
          this.viewId = this.viewSettingArray.length - 1;
          this.viewSettingSelected = this.viewSettingArray[this.viewId];
          this.getViewData();
        } else{
          this.viewSettingSelected = this.viewSettingArray[this.viewId];
        }
      }
    );
  }
  //delete view 
  deleteView() {
    let dialogref = this.dialog.open(ConfirmationpopupComponent, {
      width: '400px',
      data: {
        smode: 'delete_view',
        viewName: this.viewSettingArray[this.viewId].viewName,
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res == 'deleted') {
        // if delete clicked delete the view from viewsetting array and if view number is greater than 0 then minius 1 to view number and update view
        this.viewSettingArray.splice(this.viewId, 1);
        if (this.viewId > 0) {
          this.viewId = this.viewId - 1;
        }
        this.viewServiceService.onSaveView(this.userId, this.viewSettingArray, 'Expenses').then(res=>{
          this.snackbar.open('View has been deleted', '', { duration: 2000 });
        })
      }
    });
  }
}
