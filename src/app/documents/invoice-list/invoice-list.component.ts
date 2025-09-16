/*-------------------------------------------------------
DESCRIPTION: Shows invoice list
-------------------------------------------------------------------*/
import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DecimalPipe, Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { contactSettings, customFields, defaultContactSettings, defaultSaleSettings, defaultServiceSettings, DisplayColumn, Invoice, Profile, SettingsItem, SubUsers, UserAccessDetails } from 'src/app/data-models';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { CommonService } from 'src/app/common.service';
import { InvoiceTableColumns } from 'src/app/model/custom-report.model';
import { ViewBuilderComponent } from 'src/app/view-builder/view-builder.component';
import { DocumentSortingDef, DocumentViewSettingsDef } from 'src/app/model/custom-filter.model';
import { Router } from '@angular/router';
import { StatusPopupComponent } from 'src/app/settings/status-popup/status-popup.component';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { ViewServiceService } from 'src/app/view-builder/view-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvoiceTableColumnsInvPlan } from 'src/app/model/custom-report-invoicing.model';
@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  providers: [DecimalPipe],
})
export class InvoiceListComponent implements OnInit, OnDestroy {
  invoiceList: MatTableDataSource<Invoice>; //stores list of Invoice
  disableInvoiceView: boolean = false; // disable add invoice
  disableAddDoc: boolean = false; // disable doc view
  disableInvDownload = false;
  superUserId: string; // super user id
  userId: string; // user id
  isLoaded: boolean = false; // check all data are loaded and the displaytable else progress bar
  usrDataProfiles: UserAccessDetails; // stores user profile data
  checkDataAccessRule: string = 'Own'; // for checking access rule
  fieldNameInvoice: string = 'Invoice'; //for set field name for estimate
  columns = [];
  superUserDetails: Profile;
  userDetails: Profile;
  userIdsArray: any[] = [];
  userNamesArray: any[] = [];
  pipelineNames = [] = []; //Array to store the pipeline
  displayColumnsSaved: DisplayColumn[] = [];
  displayName: string = 'displayInvoiceColumns'
  tableName: string = 'Invoice';
  tableDefaultData = InvoiceTableColumns
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  saleTitleSettings: SettingsItem = defaultSaleSettings.CONST_VALUE.saleTitle;
  serviceTitleSettings: SettingsItem = defaultServiceSettings.CONST_VALUE.serviceTitle;
  viewId: number = 0;//View selected for displaying the data
  viewSettingArray: any = DocumentViewSettingsDef.DATA//customer view settings array
  viewSettingSelected: any = this.viewSettingArray[0]; //particular view chosen by user
  sortField: any;
  sortOrder: string;
  dataRead: any[];
  userIdArray: any;
  userList: any;
  documentSubscription: Subscription;
  userDetailsSubscription: Subscription;
  sortFieldDef = DocumentSortingDef.Data
  customFields: customFields[] = [];
  alertPopupStatus:boolean=false;// to open the alert dialoge once
  constructor(
    public dialog: MatDialog,
    private location: Location,
    private snackBar: MatSnackBar,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private router: Router,
    private viewServiceService: ViewServiceService,
  ) {
    //initialize array
    this.invoiceList = new MatTableDataSource([]);
  }
  ngOnInit(): void {
    // subscribe user details from commonservice
    this.userDetailsSubscription = this.commonService.userDatas
      .subscribe((allData) => {
        let authDetails = allData.authDetails; // bind auth details
        if (authDetails){
          if(allData.userDetails?.enableLiteMode) {
            this.router.navigate(['dash/inv-paginator-table']);
          }else {
            this.userId = authDetails.uid;
            this.superUserDetails = allData.superUserDetails
            this.userDetails = allData.userDetails
            if (allData.userDetails) {
              // if user details exist
              if (allData.userDetails.superUserId) {
                //If the superuserid is set assign it
                this.superUserId = allData.userDetails.superUserId;
              } else {
                //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
                this.superUserId = this.userId;
              }
              // set the field name
              if (allData.superUserDetails.fieldNames) {
                this.fieldNameInvoice =
                  allData.superUserDetails.fieldNames.fieldNameInvoice;
              }
              this.customFields =
              allData.superUserDetails.customFieldsInvoices;
              if (allData.userDetails.displayInvoiceColumns) {
                this.displayColumnsSaved = allData.userDetails.displayInvoiceColumns
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
              if (this.displayColumnsSaved.length > 0) {
                //if table settings are stored in db, use the stored data
                this.columns = this.displayColumnsSaved;
              } else {
                //if plan is invoicing, get default table config from custom-report-invoicing model
                if(allData.superUserDetails.plan == 'invoicing'){
                  this.columns = InvoiceTableColumnsInvPlan;
                  this.tableDefaultData = InvoiceTableColumnsInvPlan;
                } else {
                  //if plan is not invoicing, get default table config from custom-report model
                  this.columns = InvoiceTableColumns;
                }
              }
              this.usrDataProfiles = allData.usrProfileData;
              [this.userIdsArray, this.userNamesArray] = this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names
              //get the details of user profile assigned to the user
              if (this.usrDataProfiles) {
                // disable invoice create and view
                if (this.usrDataProfiles.isCheckedSalesInv == false) {
                  this.disableAddDoc = true; // disable add invoice
                  this.disableInvoiceView = true; // disable view invoice
                  this.disableInvDownload = true;
                } else {
                  if (this.usrDataProfiles.salesDCreateInv == false) {
                    this.disableAddDoc = true; // disable add invoice
                  }
                  if (this.usrDataProfiles.salesDViewInv == false) {
                    this.disableInvoiceView = true; // disable view invoice
                  }
                  if (this.usrDataProfiles.invDownload == false) {
                    this.disableInvDownload = true;
                  }
                }
                // data access rule
                if (this.usrDataProfiles.dialogdataAccessRule) {
                  this.checkDataAccessRule =
                    this.usrDataProfiles.dialogdataAccessRule;
                }
              }
              if (allData.userDetails.invoiceViewSettings) {
                this.viewSettingArray = JSON.parse(JSON.stringify(allData.userDetails.invoiceViewSettings)) //View setting array for customer list
                this.viewSettingSelected = this.viewSettingArray[this.viewId]; // particular view selected
              }
              [this.userIdArray, this.userList] = this.commonService.createUserlist(this.usrDataProfiles.dialogdataAccessRule, this.userId);
              this.getViewData()
            }
          }
        }
      });
  }
  onCreateInvoice() {

    this.router.navigate(['/dash/document/documentinvoicemanagement/none/create/Invoice/none/none/none'])
  }
  // back button
  onBack() {
    this.location.back();
  }
  ngOnDestroy() {
    // on destroy
    this.userDetailsSubscription?.unsubscribe();
    this.documentSubscription?.unsubscribe();
  }
  viewChanged(viewIndex) {
    this.viewId = viewIndex;
    this.viewSettingSelected = this.viewSettingArray[this.viewId]; // particular view selected
    this.alertPopupStatus=false;// popup status set as false to open poup if next view contactins deletd add field
    this.getViewData();
  }
  getViewData() {
    this.isLoaded=false;
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
    this.sortField = this.viewSettingSelected.sortField;
    this.sortOrder = this.viewSettingSelected.sortOrder;
    if (queryData) {
      if (this.documentSubscription && !this.documentSubscription.closed) {
        this.documentSubscription?.unsubscribe();
      }
      this.documentSubscription = this.commonService
        .readPrimaryData(this.superUserId, 'Invoices', queryData, this.userIdArray)
        .subscribe((data) => {
          this.dataRead = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as any;
          });
          this.dataRead = this.dataRead.filter((element) =>
            this.userIdArray.includes(element.createdBy)
          );
          this.dataRead = this.commonService.sortData(this.dataRead, this.sortField, this.sortOrder)
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
          this.invoiceList.data =
            this.dataRead.map((doc) => {
              return {
                ...doc,
                ...doc.docData,
                ...doc.customerData,
                name:
                  doc.customerData.fname1 +
                  ' ' +
                  (doc.customerData.sname != null
                    ? doc.customerData.sname
                    : ''),
              };
            });
          this.isLoaded = true;
        });
    }else{
      this.isLoaded=true;
    }
  }
  //Function to open the popup to edit views
  editView(mode) {
    //call the popup for card field customization
    let dialogRef = this.dialog.open(ViewBuilderComponent, {
      data: ['Invoices', this.viewId, mode, this.sortFieldDef],
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
        this.viewServiceService.onSaveView(this.userId, this.viewSettingArray, 'Invoices').then(res=>{
          this.snackBar.open('View has been deleted', '', { duration: 2000 });
        })
      }
    });
  }
}
