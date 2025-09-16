/*-------------------------------------------------------
DESCRIPTION:  Shows quotation list
-------------------------------------------------------------------*/
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { contactSettings, customFields, defaultContactSettings, defaultSaleSettings, defaultServiceSettings, DisplayColumn, Invoice, Profile, SettingsItem, UserAccessDetails } from 'src/app/data-models';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { CommonService } from 'src/app/common.service';
import { QuotationTableColumns } from 'src/app/model/custom-report.model';
import { DocumentSortingDef, DocumentViewSettingsDef } from 'src/app/model/custom-filter.model';
import { ViewBuilderComponent } from 'src/app/view-builder/view-builder.component';
import { Router } from '@angular/router';
import { StatusPopupComponent } from 'src/app/settings/status-popup/status-popup.component';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { ViewServiceService } from 'src/app/view-builder/view-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuotationTableColumnsInvPlan } from 'src/app/model/custom-report-invoicing.model';

@Component({
  selector: 'app-quotationlist',
  templateUrl: './quotationlist.component.html',
  styleUrls: ['./quotationlist.component.scss'],
})
export class QuotationlistComponent implements OnInit, OnDestroy {
  quotationList: MatTableDataSource<Invoice>; //stores list of quotation
  superUserId: string; // super user id
  userId: string; // user id
  isLoaded: boolean = false; // check all data are loaded and the displaytable else progress bar
  disableAddDocument: boolean = false; // disable add quotation
  disableDocView: boolean = false; // disable doc view
  disableQuotDownload = false;
  usrDataProfiles: UserAccessDetails; // stores user profile data
  fieldNameQuotation: string = 'Quotation'; //for set field name for estimate
  columns = [];
  superUserDetails: Profile;
  userDetails: Profile;
  userIdsArray: any[] = [];
  userNamesArray: any[] = [];
  pipelineNames = [] = []; //Array to store the pipeline
  displayColumnsSaved: DisplayColumn[] = [];
  displayName: string = 'displayQuotationColumns'
  tableName: string = 'Quotation';
  tableDefaultData = QuotationTableColumns;
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  saleTitleSettings: SettingsItem = defaultSaleSettings.CONST_VALUE.saleTitle;
  serviceTitleSettings: SettingsItem = defaultServiceSettings.CONST_VALUE.serviceTitle;
  documentSubscription: Subscription;
  userDetailsSubscription: Subscription;
  viewId: number = 0;//View selected for displaying the data
  viewSettingArray: any = DocumentViewSettingsDef.DATA//customer view settings array
  viewSettingSelected: any = this.viewSettingArray[0]; //particular view chosen by user
  sortField: any;
  sortOrder: string;
  dataRead: any[];
  userIdArray: any;
  userList: any;
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
    this.quotationList = new MatTableDataSource([]);
  }
  ngOnInit() {
    // subscribe user details from commonservice
    this.userDetailsSubscription = this.commonService.userDatas
      .subscribe((allData) => {
        let authDetails = allData.authDetails; // bind auth details
        if (authDetails) {
          if (allData.userDetails?.enableLiteMode) {
            this.router.navigate(['dash/quotation-table']);
          }else{
          this.userId = authDetails.uid; // bind user id
          let userData = allData.userDetails; // bind current user details
          this.superUserDetails = allData.superUserDetails
          this.userDetails = allData.userDetails
          if (userData) {
            // if user details exist
            if (userData.superUserId) {
              //If the superuserid is set assign it
              this.superUserId = userData.superUserId;
            } else {
              //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
              this.superUserId = this.userId;
            }
            // set the field name
            if (allData.superUserDetails.fieldNames) {
              this.fieldNameQuotation =
                allData.superUserDetails.fieldNames.fieldNameQuotation;
            }
            this.customFields =
            allData.superUserDetails.customFieldsQuotation;
            if (allData.userDetails.displayQuotationColumns) {
              this.displayColumnsSaved = allData.userDetails.displayQuotationColumns
            }
            if (this.displayColumnsSaved.length > 0) {
              //if table settings are stored in db, use the stored data
              this.columns = this.displayColumnsSaved;
            } else {
              //if plan is invoicing, get default table config from custom-report-invoicing model
              if(allData.superUserDetails.plan == 'invoicing'){
                this.columns = QuotationTableColumnsInvPlan;
                this.tableDefaultData = QuotationTableColumnsInvPlan;
              } else {
                //if plan is not invoicing, get default table config from custom-report model
                this.columns = QuotationTableColumns
              }
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
            this.usrDataProfiles = allData.usrProfileData;
            [this.userIdsArray, this.userNamesArray] = this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names
            //get the details of user profile assigned to the user
            if (this.usrDataProfiles) {
              // disable quotation create and view
              if (this.usrDataProfiles.isCheckedSalesQuot == false) {
                this.disableAddDocument = true; // disable add quotation
                this.disableDocView = true; // disable view quotation
                this.disableQuotDownload = true;
              } else {
                if (this.usrDataProfiles.salesDCreateQuot == false) {
                  this.disableAddDocument = true; // disable add quotation
                }
                if (this.usrDataProfiles.salesDViewQuot == false) {
                  this.disableDocView = true; // disable view quotation
                }
                if (this.usrDataProfiles.quotDownload == false) {
                  this.disableQuotDownload = true;
                }
              }
            }
            if (allData.userDetails.quotationViewSettings) {
              this.viewSettingArray = JSON.parse(JSON.stringify(allData.userDetails.quotationViewSettings)) //View setting array for customer list
              this.viewSettingSelected = this.viewSettingArray[this.viewId]; // particular view selected
            }
            [this.userIdArray, this.userList] = this.commonService.createUserlist(this.usrDataProfiles.dialogdataAccessRule, this.userId);
            this.getViewData()
          }
        }
      }
      });
  }
  onCreateQuotation() {
    this.router.navigate(['/dash/document/documentquotationmanagement/none/create/Quotation/none/none/none'])
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
        .readPrimaryData(this.superUserId, 'Quotations', queryData, this.userIdArray)
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
          this.quotationList.data =
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
      data: ['Quotations', this.viewId, mode, this.sortFieldDef],
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
        this.viewServiceService.onSaveView(this.userId, this.viewSettingArray, 'Quotations').then(res=>{
          this.snackBar.open('View has been deleted', '', { duration: 2000 });
        })
      }
    });
  }
}
