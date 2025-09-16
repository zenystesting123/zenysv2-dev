
/*-------------------------------------------------------
DESCRIPTION: filter collection list datas
-------------------------------------------------------------------*/
import { Subscription } from 'rxjs';
import { contactSettings, customFields, defaultContactSettings, defaultPaymentSettings, defaultSaleSettings, defaultServiceSettings, DisplayColumn, PaymentReceipt, paymentSettings, Profile, SettingsItem, UserAccessDetails } from '../../data-models';
import {
  Component,
  OnInit,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Paymentreceipt1Component } from '../../paymentreceipt1/paymentreceipt1.component';
import { Location } from '@angular/common';
import { NetworkCheckService } from '../../networkcheck.service';
import { CommonService } from 'src/app/common.service';
import { CollectionTableColumns } from 'src/app/model/custom-report.model';
import { PaymentSortingDef, PaymentViewSettingsDef } from 'src/app/model/custom-filter.model';
import { ViewBuilderComponent } from 'src/app/view-builder/view-builder.component';
import { StatusPopupComponent } from 'src/app/settings/status-popup/status-popup.component';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { ViewServiceService } from 'src/app/view-builder/view-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-payment-receipt-list',
  templateUrl: './payment-receipt-list.component.html',
  styleUrls: ['./payment-receipt-list.component.scss'],
})
export class PaymentReceiptListComponent implements OnInit, OnDestroy {
  collectionList: MatTableDataSource<PaymentReceipt>; //stores list of Invoice
  userId: string; // user id
  isLoaded: boolean = false; // check all data are loaded and the displaytable else progress bar
  superUserId: string; // super user id
  usrDataProfiles: UserAccessDetails; // stores user profile data
  disableCreateColl: boolean = false; // for disable add collection
  disableEditColl: boolean = false; // for disable edit collection
  disableViewColl: boolean = false; // for disable view collection
  disableCollDownload = false;// for disable download collection
  fieldNameCollection: string = 'Collection';//for set field name for estimate
  userDetailsSubscription: Subscription;
  paymentSubscription: Subscription;
  columns = [];
  superUserDetails: Profile;
  userDetails: Profile;
  userIdArray: any;
  userList: any;
  userIdsArray: any[] = [];
  userNamesArray: any[] = [];
  pipelineNames = [] = []; //Array to store the pipeline
  displayColumnsSaved: DisplayColumn[] = [];
  displayName: string = 'displayCollectionColumns'
  tableName: string = 'Collection';
  tableDefaultData = CollectionTableColumns
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  saleTitleSettings: SettingsItem = defaultSaleSettings.CONST_VALUE.saleTitle;
  serviceTitleSettings: SettingsItem = defaultServiceSettings.CONST_VALUE.serviceTitle;
  paymentSettings: paymentSettings = defaultPaymentSettings.CONST_VALUE;
  customFields: customFields[] = [];
  viewId: number = 0;//View selected for displaying the data
  viewSettingArray: any = PaymentViewSettingsDef.DATA//customer view settings array
  viewSettingSelected: any = this.viewSettingArray[0]; //particular view chosen by user
  sortField: any;
  sortOrder: string;
  dataRead: any[];
  sortFieldDef = PaymentSortingDef.Data
  alertPopupStatus:boolean=false;// to open the alert dialoge once 
  constructor(
    private location: Location,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private viewServiceService: ViewServiceService,
  ) {
    // initialize array
    this.collectionList = new MatTableDataSource([]);
  }
  ngOnInit() {
    // subscribe user details from commonservice
    this.userDetailsSubscription = this.commonService.userDatas
      .subscribe((allData) => {
        if (allData.authDetails) { // check if signe
          this.userId = allData.authDetails.uid;// bind user idd In
          this.superUserDetails = allData.superUserDetails
          this.userDetails = allData.userDetails
          if (allData.userDetails) {
            if (allData.userDetails.paymentViewSettings) {
              this.viewSettingArray = JSON.parse(JSON.stringify(allData.userDetails.paymentViewSettings)) //View setting array for customer list
              this.viewSettingSelected = this.viewSettingArray[this.viewId]; // particular view selected
            }
            // if user details exist
            if (allData.userDetails.superUserId) { //If the superuserid is set assign it
              this.superUserId = allData.userDetails.superUserId;
            } else {//If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
              this.superUserId = this.userId;
            }
            // set the field name
            if (allData.superUserDetails.fieldNames) {
              this.fieldNameCollection = allData.superUserDetails.fieldNames.fieldNameCollection
            }
            if (allData.userDetails.displayCollectionColumns) {
              this.displayColumnsSaved = allData.userDetails.displayCollectionColumns
            }
            this.customFields = this.superUserDetails.customFieldsPayment;
            if (this.displayColumnsSaved.length > 0) {
              //if table settings are stored in db, use the stored data
              this.columns = this.displayColumnsSaved;
            } else {
              this.columns = CollectionTableColumns;
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
            if (
              typeof allData.superUserDetails.paymentSettings !== 'undefined' ||
              allData.superUserDetails.paymentSettings !== null
            ) {
              this.paymentSettings = allData.superUserDetails.paymentSettings;
            }

            this.usrDataProfiles = allData.usrProfileData;
            [this.userIdsArray, this.userNamesArray] = this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names
            //get the details of user profile assigned to the user
            if (this.usrDataProfiles) {
              // check of collection access
              if (this.usrDataProfiles.isCheckedColl == false) {
                this.disableCreateColl = true;// disable add collection
                this.disableEditColl = true;// disable edit collection
                this.disableViewColl = true;// disable view collection
                this.disableCollDownload = true;
              } else {// if check box is true check indivitaul access for edit add view
                if (this.usrDataProfiles.collectionCreate == false) {
                  this.disableCreateColl = true;// disable add collection
                }
                if (this.usrDataProfiles.collectionEdit == false) {
                  this.disableEditColl = true;// disable edit collection
                }
                if (this.usrDataProfiles.collectionsView == false) {
                  this.disableViewColl = true;// disable view collection
                }
                if (this.usrDataProfiles.collDownload == false) {
                  this.disableCollDownload = true;
                }
              }
            }
            [this.userIdArray, this.userList] = this.commonService.createUserlist(this.usrDataProfiles.dialogdataAccessRule, this.userId);
            this.getViewData()
          }
        }
      });
  }
  // for create collection
  onCreatePayment() {
    // need to check why the data is passed like this?
    this.dialog.open(Paymentreceipt1Component, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        mode: 'createCustSelect',
        company: 'Individual',
        customerName: '',
        componentName: this.constructor.name,
      },
    });
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.userDetailsSubscription?.unsubscribe();
    this.paymentSubscription?.unsubscribe();
  }
  // back button click
  onBack() {
    this.location.back();
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
      if (this.paymentSubscription && !this.paymentSubscription.closed) {
        this.paymentSubscription?.unsubscribe();
      }
      this.paymentSubscription = this.commonService
        .readPrimaryData(this.superUserId, 'paymentsreceived', queryData, this.userIdArray)
        .subscribe((data) => {
          this.dataRead = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as any;
          });
          this.dataRead = this.dataRead.filter((element) =>
            this.userIdArray.includes(element.createdById)
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
          this.collectionList.data = this.dataRead;
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
      data: ['paymentsreceived', this.viewId, mode, this.sortFieldDef],
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
        this.viewServiceService.onSaveView(this.userId, this.viewSettingArray, 'paymentsreceived').then(res=>{
          this.snackBar.open('View has been deleted', '', { duration: 2000 });
        })
      }
    });
  }
}

