/**********************************************************************************
Description: Component is used to list  sale with product
**********************************************************************************/
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/common.service';
import { ViewBuilderComponent } from 'src/app/view-builder/view-builder.component';
import { saleViewSettingsDef, ProductListItem, SalesWithItemArray, customFieldsReport, saleSettings, defaultSaleSettings, ProductSettings, defaultProductSettings, modules } from 'src/app/data-models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusPopupComponent } from 'src/app/settings/status-popup/status-popup.component';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { ViewServiceService } from 'src/app/view-builder/view-service.service';
import { CommonListDataService } from 'src/app/common-list-data.service';
@Component({
  selector: 'app-sales-product',
  templateUrl: './sales-product.component.html',
  styleUrls: ['./sales-product.component.scss']
})
export class SalesProductComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator; // for table pagination
  @ViewChild(MatSort) sort: MatSort; // for table sorting
  isloaded: boolean = false; //progressbar
  documentsArray: MatTableDataSource<ProductListItem>; //mat-table datasource
  userDetailsSubscription: Subscription; //userdata subscription from commonservice
  saleFilterSubscription: Subscription; // sale filer subscription
  superUserId: string = ''; //logged in users superuserid
  userId: string = ''; //logged in users id
  disableViewSale: boolean = false;//disable view Sale based on profile access
  disableSaleDownload = false;//disable view Sale based on profile access
  viewId: number = 0;//View selected for displaying the data
  viewSettingArray: any = saleViewSettingsDef.DATA//customer view settings array
  viewSettingSelected: any = this.viewSettingArray[0]; //particular view chosen by user
  userIdArray: any; // for storig users id
  userList: any;// for storig users list
  cardFields: any; // for storig sale cardFields
  displayFields: any; // for storig sale cardFields
  fieldNameItems: string = 'Products and Service'; //custom field names for product
  productSettings: ProductSettings = defaultProductSettings.CONST_VALUE;
  fieldNameContact: string = 'Contact'; //custom field names
  fieldNameSale: string = 'Sale' // fieldname sale
  fieldNameFollowup: string = 'FollowUp';//setting default value for followup
  fieldNameContactNotes: string = 'Note'; //setting default value for note
  saleSettings: saleSettings = defaultSaleSettings.CONST_VALUE;
  displayedColumns: string[] = [
    // column for table
    'prodName',
    'prodCategory',
    'qty',
    'rate',
    'discount',
    'amountAfterDiscount',
    'saleTitle',
    'selectedSalePipeline',
    'salesStage',
    'customer',
    'createdDate',
    'startDate',
    'endDate',
    'assignedTo',
    'inpipeline',
    'won',
    'lost'
  ];
  customFieldsProduct: customFieldsReport[]=[];
  customFieldsProductValue: customFieldsReport[] = [];
  customFieldSale: any = [];// for storing custome field sale
  alertPopupStatus:boolean=false;// to open the alert dialoge once 
  constructor(
    public dialog: MatDialog,
    private location: Location,
    public commonService: CommonService,
    private _snackBar: MatSnackBar,
    private viewServiceService: ViewServiceService,
    private commonListDataService: CommonListDataService,
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
          this.customFieldSale = allData.superUserDetails.customFieldsSale;// for getting custom field sale
          
          this.customFieldsProduct = allData.superUserDetails.customFieldsProduct;
          this.customFieldsProductValue=[]
          this.displayedColumns=[
            // column for table
            'prodName',
            'prodCategory',
            'qty',
            'rate',
            'discount',
            'amountAfterDiscount',
            'saleTitle',
            'selectedSalePipeline',
            'salesStage',
            'customer',
            'createdDate',
            'startDate',
            'endDate',
            'assignedTo',
            'inpipeline',
            'won',
            'lost'
          ];
          this.customFieldsProduct?.forEach((element) => {
            this.customFieldsProductValue.push(element);
            if(element.isActive){
              this.displayedColumns.push(element.fieldName);
            }             
          });

          

          //checking data rule for view and download
          if (allData.usrProfileData) {
            if (allData.usrProfileData.isCheckedSale == false) {
              this.disableViewSale = true;
              this.disableSaleDownload = true;
            } else {
              if (allData.usrProfileData.salesView == false) {
                this.disableViewSale = true;
              }
              if (allData.usrProfileData.salesDownload == false) {
                this.disableSaleDownload = true;
              }
            }
          }
          //getting field name
          if (allData.superUserDetails.fieldNames) {
            this.fieldNameContact =
              allData.superUserDetails.fieldNames.fieldNameContact;
            this.fieldNameSale = allData.superUserDetails.fieldNames.fieldNameSale;
            this.fieldNameItems =
              allData.superUserDetails.fieldNames.fieldNameItems;   
              this.fieldNameFollowup =
              allData.superUserDetails.fieldNames.fieldNameFollowup;
              this.fieldNameContactNotes =
              allData.superUserDetails.fieldNames.fieldNameContactNotes ? allData.superUserDetails.fieldNames.fieldNameContactNotes:'Note';       
          }
          [this.cardFields, this.displayFields] =
            this.commonService.getCardFields('sale',this.fieldNameContactNotes,this.fieldNameFollowup);// getting sale card fields
          if (
            typeof allData.superUserDetails.saleSettings === 'undefined' ||
            allData.superUserDetails.saleSettings === null
          ) {
            this.saleSettings = this.saleSettings;
          } else {
            this.saleSettings = allData.superUserDetails.saleSettings;
          }
          if (
            typeof allData.superUserDetails.productSettings === 'undefined' ||
            allData.superUserDetails.productSettings === null
          ) {
            this.productSettings = this.productSettings;
          } else {
            this.productSettings = allData.superUserDetails.productSettings;
          }
          // getting sale view settings
          if (allData.userDetails.saleViewSettings) {
            this.viewSettingArray = JSON.parse(JSON.stringify(allData.userDetails.saleViewSettings)) //View setting array for customer list
            this.viewSettingSelected = this.viewSettingArray[this.viewId]; // particular view selected
          }
          // get user ids
          [this.userIdArray, this.userList] = this.commonService.createUserlist(allData.usrProfileData.dialogdataAccessRule, this.userId);
          this.getViewData();// get data to display
        }
      }
    );
  }
  //triggered while clicking back button
  onBack() {
    this.location.back();
  }
  // on destroy to unsubscribe
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.userDetailsSubscription?.unsubscribe();
    this.saleFilterSubscription?.unsubscribe();
  }
  ngAfterViewInit() {
    this.documentsArray.paginator = this.paginator; //for pagination
    this.documentsArray.sort = this.sort; //for pagination
  }
  // view filter
  viewChanged(viewIndex) {
    this.viewId = viewIndex;// get view id
    this.viewSettingSelected = this.viewSettingArray[this.viewId]; // particular view selected
    this.alertPopupStatus=false;// popup status set as false to open poup if next view contactins deletd add field
    this.getViewData(); // get data to display
  }
  getViewData() {
    this.isloaded = false;// to show progressbar
    // open a popup if deleted additional field is used in custom view query
    if (this.viewSettingSelected.primaryQuery.queryField == 'additionalFieldsArr'
      && !this.customFieldSale[this.viewSettingSelected.primaryQuery.ind].isActive) {
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
      && !this.customFieldSale[this.viewSettingSelected.sortField.ind].isActive) {
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
          && !this.customFieldSale[element.ind].isActive) {
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
    let queryData = this.commonService.getQueryData(this.viewSettingSelected.primaryQuery); // get primary query
    let sortField = this.viewSettingSelected.sortField;// get sort field
    let sortOrder = this.viewSettingSelected.sortOrder;//get sort order
    if (queryData) {
      // unsubscripbe the previous subscription
      if (this.saleFilterSubscription && !this.saleFilterSubscription.closed) {
        this.saleFilterSubscription?.unsubscribe();
      }
      let dataRead: SalesWithItemArray[] = []
      this.saleFilterSubscription = this.commonService
        .readPrimaryData(this.superUserId, 'sales', queryData, this.userIdArray)
        .subscribe((data) => {
          dataRead = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as SalesWithItemArray;
          });
          // filter - createdby is included in user id array
          dataRead = dataRead.filter((element) =>
            this.userIdArray.includes(element.createdBy)
          );
          dataRead = this.commonService.sortData(dataRead, sortField, sortOrder)// sort data
          // check if filter is present
          if (this.viewSettingSelected.filters.length > 0) {
            let filterData = this.viewSettingSelected.filters;
            filterData.forEach((element) => {
              let filterQuery = this.commonService.getQueryData(element);
              dataRead = dataRead.filter((record) =>
                this.commonService.filterData(record, filterQuery)
              );
            });
          }
          // add fullName  of customer and amount after discount for each items
          let prodList: ProductListItem[] = [];
          for (var val of dataRead) {
            if (val.itemsArray != undefined) {
              let items: any[] = Object.values(val.itemsArray);
              if (items.length > 0) {
                for (var ele of items) {
                  let amount = ele.unitPrice * (1 - ele.discount / 100);
                  let amtAfterDisc = ele.quantity * amount;

                  let fullName = val.secondName
                    ? val.firstName + ' ' + val.secondName
                    : val.firstName;

                  let item = new ProductListItem(
                    ele.prodName,
                    ele.productId,
                    ele.prodCategory ? ele.prodCategory : null,
                    ele.quantity,
                    ele.unitPrice,
                    ele.discount,
                    amtAfterDisc,
                    val.saleTitle,
                    this.commonService.getStatusName(modules.sales, val.selectedSalePipeline,val.salesStage),
                    this.commonService.getPipelineNames(modules.sales, val.selectedSalePipeline),
                    fullName,
                    val.createdDate,
                    val.startDate?.toDate(),
                    val.expCompletionDate?.toDate(),
                    val.assignedToName,
                    ele.additionalFieldsArr ? ele.additionalFieldsArr : [],
                    val.createdBy,
                    val.assignedTo,
                    val.inPipeline,
                    val.won,
                    val.lost
                  );
                  prodList.push(item);
                }
              }
            }
          }
          this.documentsArray.data = prodList
          this.isloaded = true;
        });
    } else {
      this.isloaded = true;
    }
  }
  //Function to open the popup to edit views
  editView(mode) {
    //call the popup for card field customization
    let dialogRef = this.dialog.open(ViewBuilderComponent, {
      data: ['sales', this.viewId, mode, this.cardFields],
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((res) => {
      // Receive data from dialog component
      // If new view has been added, then read the new view and load data
      if (res.response == 'Add') {
        this.viewId = this.viewSettingArray.length - 1;
        this.viewSettingSelected = this.viewSettingArray[this.viewId];
        this.commonListDataService.saleListDataLoaded = false;
        this.getViewData();
      } else {
        this.commonListDataService.saleListDataLoaded = false;
        this.viewSettingSelected = this.viewSettingArray[this.viewId];
      }
    });
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
        this.commonListDataService.saleListDataLoaded = false;
        this.viewServiceService.onSaveView(this.userId, this.viewSettingArray, 'sales').then(res=>{
          this._snackBar.open('View has been deleted', '', { duration: 2000 });
        })
      }
    });
  }

  noDataMessage() {
    this._snackBar.open('No data to download', '', {
      duration: 2000,
    });
  }
}
