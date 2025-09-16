/**********************************************************************************
Description: Component displays all Products and Services added-in web and mobile
              child : add-product.html-component using for CRUD operations - in web as a popup and in mobile as a seperate component
              child : delete-confirmation.html-a confirmation popup if user really intend to delete an existing product
Inputs:
Outputs:
**********************************************************************************/

import { DOCUMENT, Location } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  Optional,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  addFieldsArr,
  customFields,
  defaultProductSettings,
  DisplayColumn,
  itemMax,
  ItemsImport,
  ProductCategories,
  ProductModel,
  ProductSettings,
  ProductUnits,
  productViewSettingsDef,
  Profile,
  Sales,
  UserAccessDetails,
} from '../data-models';
import { ProductsAndServicesService } from './products-and-services.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Currencies } from '../currencies';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from '../common.service';
import { NetworkCheckService } from '../networkcheck.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { ConfirmationpopupComponent } from '../confirmationpopup/confirmationpopup.component';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { saveAs } from 'file-saver';
import { AppCustomDirective } from '../app.validators';
import { ProductTableColumnsGST, ProductTableColumnsVAT } from '../model/custom-report.model';
import { StatusPopupComponent } from '../settings/status-popup/status-popup.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ViewServiceService } from '../view-builder/view-service.service';
import { ChildCustomReportTableComponent } from '../custom-tables/child-custom-report-table/child-custom-report-table.component';

@Component({
  selector: 'app-products-and-services',
  templateUrl: './products-and-services.component.html',
  styleUrls: ['./products-and-services.component.scss'],
})
export class ProductsAndServicesComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>(); //ondestroy variables

  superUserId: string = ' '; //loogged in users superuserid
  userId: string = ' '; //logged in users id
  products: ProductModel[] = []; //variable holds the data fetching from DB
  currentProductCode: string; //while editing we are saving current products code in this variable
  dataSource: any; //for mat-table data
  currency: string; //currency of super user profile
  taxType: string; //taxtype of super user prfile
  message: string; //snackbar message
  usrProfileData: UserAccessDetails; //to check access control settings, user profile data from common service
  disableItemsView: boolean = false; //according to profile,view is restricted with a boolean variable
  disableItemsCreate: boolean = false; //according to profile,create is restricted with a boolean variable
  disableItemsEdit: boolean = false; //according to profile,edit is restricted with a boolean variable
  disableItemsDelete: boolean = false; //according to profile,delete is restricted with a boolean variable
  progressBarStatus: boolean = false; //progressbar boolean value
  userData: Profile; //logged in user data from CommonService
  superuserData: Profile; //Superuserd data

  // variables for CSV data uploading
  fileReaded: any;
  csvLine: number;
  dataArray: ItemsImport = {
    additionalFieldsArr: null,
    prodName: null,
    hsnCode: null,
    prodDes: null,
    prodCategory: null,
    unitPrice: null,
    unit: null,
    discount: null,
    cgst: null,
    sgst: null,
    igst: null,
    availability: null,
    vatRate: null,
  };
  productsMob: ProductModel[] = []; //variable holds products to display in Mobile
  filterArray1: ProductModel[] = []; //for filtering we are storing data in 1 array on date 1
  filterArray2: ProductModel[] = []; // for date 2 filtering we need 2nd array to check includes values
  filter: string; //search by product variable
  // to delete
  isFilterApplied: boolean = false; //to change the dispaly message we are checking if filter is applied or not
  itemArr = [];
  sales: Sales[] = [];
  fieldNameItems: string = 'Products and Service'; //custom field names
  fieldNameItemsCategory: string = 'Category'; //custom field names category

  columnsDispaly = [];
  displayName: string = 'displayProductColumns';
  tableName: string = 'Products';
  tableDefaultData = [];
  displayColumnsSaved: DisplayColumn[] = [];
  tableDataArray: MatTableDataSource<ProductModel>; //mat-table datasource
  userIdsArray: any[] = [];
  userNamesArray: any[] = [];
  customFields: any[] = [];
  viewId: number = 0; //View selected for displaying the data
  viewSettingArray: any = productViewSettingsDef.DATA; //org view settings array
  viewSettingSelected: any = this.viewSettingArray[0]; //particular view chosen by user
    // table data is stored in other variables for filtering and reset
    filterArrayDuplicate: MatTableDataSource<ProductModel>;
    filterArray: MatTableDataSource<ProductModel>;
    resetDateArray: MatTableDataSource<ProductModel>;
    productsArray: MatTableDataSource<ProductModel>;
    dataRead: any[];
    secondaryFilterSet: boolean = false; //Field to check if secondary filter has been set or not
    secondaryFilterField: any;
    secondaryFilterValue: any;
    alertPopupStatus:boolean=false;// to open the alert dialoge once
    selection = new SelectionModel<ProductModel>(true, []);
    productSubscription: Subscription;
    dataReadTableData: any[];
    userList: any;
    sortField: any;
    sortOrder: any;
    sortOrderSet: boolean = false;

  @ViewChild(MatSort) sort?: MatSort;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  productSettings: ProductSettings = defaultProductSettings.CONST_VALUE;
  daTime: any;
  isActiveAddFLength = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private location: Location,
    public dialog: MatDialog,
    private serviceInstance: ProductsAndServicesService,
    private _snackBar: MatSnackBar,
    public commonService: CommonService,
    public networkCheck: NetworkCheckService,
    private router: Router,
    private analytics: AngularFireAnalytics,
    private viewServiceService: ViewServiceService
  ) {}

  ngOnInit(): void {
    this.tableDataArray = new MatTableDataSource([]);
    this.productsArray = new MatTableDataSource([]);
    this.filterArray = new MatTableDataSource([]);
    this.filterArrayDuplicate = new MatTableDataSource([]);
    this.resetDateArray = new MatTableDataSource([]);

    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {

        [this.userIdsArray, this.userNamesArray] =
        this.commonService.createGroupigArrayAssignedTo(); //Get the list of user id and names
        this.customFields =
        allData.superUserDetails.customFieldsProduct;

        // check for access
        this.usrProfileData = allData.usrProfileData;
        if (this.usrProfileData) {
          if (this.usrProfileData.isCheckedItems == false) {
            this.disableItemsDelete = true;
            this.disableItemsEdit = true;
            this.disableItemsView = true;
            this.disableItemsCreate = true;
          } else {
            if (this.usrProfileData.itemsView == false) {
              this.disableItemsView = true;
            }
            if (this.usrProfileData.itemsCreate == false) {
              this.disableItemsCreate = true;
            }
            if (this.usrProfileData.itemsEdit == false) {
              this.disableItemsEdit = true;
            }
            if (this.usrProfileData.itemsDelete == false) {
              this.disableItemsDelete = true;
            }
          }
        }

        // reading userdetails and userId from commonservice then items from DB
        this.userId = allData.userId;
        this.userData = allData.userDetails;
        this.superUserId = allData.userDetails.superUserId;
        this.superuserData = allData.superUserDetails;

        if (this.superuserData) {
          if(this.superuserData.taxType === 'gst'){
            this.tableDefaultData = ProductTableColumnsGST
          }else{
            this.tableDefaultData = ProductTableColumnsVAT
          }
          if (this.superuserData.fieldNames) {
            this.fieldNameItems = this.superuserData.fieldNames.fieldNameItems;
            // if (this.superuserData.fieldNames.fieldNameItemsCategory) {
            //   this.fieldNameItemsCategory =
            //     this.superuserData.fieldNames.fieldNameItemsCategory;
            // }
            if (
              allData.superUserDetails?.productSettings?.category?.displayName
            ) {
              this.fieldNameItemsCategory =
                allData.superUserDetails.productSettings.category.displayName;
            }
          }
          if (this.fieldNameItems == 'Products and Service') {
            this.message = 'Product';
          } else {
            this.message = this.fieldNameItems;
          }
          this.currency = this.superuserData.currency;
          this.taxType = this.superuserData.taxType;

          if (this.superuserData.productSettings) {
            this.productSettings = this.superuserData.productSettings;
          }
          if (allData.userDetails.productViewSettings) {
            this.viewSettingArray = JSON.parse(
              JSON.stringify(allData.userDetails.productViewSettings)
            ); //View setting array for org list
            this.viewSettingSelected = this.viewSettingArray[this.viewId]; // particular view selected
          }
          if (allData.userDetails.displayProductColumns) {
            this.displayColumnsSaved = allData.userDetails.displayProductColumns;
          }

          if (this.displayColumnsSaved.length > 0) {
            //if table settings are stored in db, use the stored data
            this.columnsDispaly = this.displayColumnsSaved;
            // remove select column if settings already saved in DB
            var ind = this.columnsDispaly.findIndex(p => p.columnDef == "select");
            if (ind > -1) {
              this.columnsDispaly.splice(ind, 1);
            }
          }

          this.getViewData();
        }
      });
  }
  getViewData() {
    this.progressBarStatus=false;
    // open a popup if deleted additional field is used in custom view query
    if(this.viewSettingSelected.primaryQuery.queryField=='additionalFieldsArr'
      && !this.customFields[this.viewSettingSelected.primaryQuery.ind].isActive){
        if(!this.alertPopupStatus){
          this.dialog.open(StatusPopupComponent, {
            disableClose: true,
            data: {
              type: 'Addtional_field_custom_view',
            },
          });
        }
        this.alertPopupStatus = true;
    }
    else if(this.viewSettingSelected.sortField.fieldType=='Additional'
    && !this.customFields[this.viewSettingSelected.sortField.ind].isActive){
      if(!this.alertPopupStatus){
        this.dialog.open(StatusPopupComponent, {
          disableClose: true,
          data: {
            type: 'Addtional_field_custom_view',
          },
        });
      }
      this.alertPopupStatus = true;

    }
    else{
      this.viewSettingSelected.filters?.forEach(element => {
        if(element.queryField=='additionalFieldsArr'
        && !this.customFields[element.ind].isActive){
          if(!this.alertPopupStatus){
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
    let queryData = this.commonService.getQueryData(
      this.viewSettingSelected.primaryQuery
    );

    if (queryData) {
      if (this.productSubscription && !this.productSubscription.closed) {
        this.productSubscription.unsubscribe();
      }

      this.productSubscription = this.commonService
        .readPrimaryData(
          this.superUserId,
          'products',
          queryData,
          this.userIdsArray
        )
        .subscribe((data) => {
          this.dataRead = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as any;
          });

          //Filter the data read based on data access rule
          if (
            this.usrProfileData.dialogdataAccessRule == 'Team' ||
            this.usrProfileData.dialogdataAccessRule == 'Own'
          ) {
            if (this.userIdsArray) {
              this.dataRead = this.dataRead.filter((element) =>
                this.userIdsArray.includes(element.assignedTo)
              );
            } else {
              [this.userIdsArray, this.userList] =
                this.commonService.createUserlist(
                  this.usrProfileData.dialogdataAccessRule,
                  this.userId
                );
              this.dataRead = this.dataRead.filter((element) =>
                this.userIdsArray.includes(element.assignedTo)
              );
            }
          } else if (this.usrProfileData.dialogdataAccessRule == 'Branch') {
            let branchId = this.commonService.getBranch(this.userId);
            this.dataRead = this.dataRead.filter(
              (element) => element.associatedBranch === branchId
            );
          }




          this.dataReadTableData = this.dataRead;

          // check if filter is present
          if (this.viewSettingSelected.filters.length > 0) {
            let filterData = this.viewSettingSelected.filters;
            filterData.forEach((element) => {
              let querFiled = element.queryField;
              let filterQuery = this.commonService.getQueryData(element);
              this.dataRead = this.dataRead.filter((record) =>
                this.commonService.filterData(record, filterQuery)
              );

            });
          }

          // this.organisationsArray.paginator = this.paginator;
          // this.organisationsArray.sort = this.sort;

          this.products = this.dataRead;
            this.filterArray.data =
            this.dataRead =
            this.resetDateArray.data =
            this.tableDataArray.data =
            this.filterArrayDuplicate.data =
              this.dataRead;



          //If any filter was active,
          // reapply the filter to make sure that filter does not get reset automatically on subscription update
          if (this.secondaryFilterSet == true) {
            this.secondaryFilter(
              this.secondaryFilterField,
              this.secondaryFilterValue
            );
          }
          //If any custom sorting by field was active,
          // reapply the filter to make sure that filter does not get reset automatically on subscription update

          if (this.sortOrderSet == true) {
            this.setSortOrder(this.sortOrder);
          }
          this.progressBarStatus = true;
        });
    }else{
      this.progressBarStatus=true;
    }
  }

  secondaryFilter(field, value) {

    this.secondaryFilterSet = true;
    this.secondaryFilterField = field;
    this.secondaryFilterValue = value;
    let filteredData = [];
    filteredData = this.dataRead.filter((record) => {
      return record[this.secondaryFilterField] === this.secondaryFilterValue;
    });
    this.products = filteredData;
    this.tableDataArray.data = filteredData;
  }
  //function to sort card data when sort order is changed
  setSortOrder(order) {
    this.sortOrderSet = true;
    this.sortOrder = order;
    this.products = this.commonService.sortData(
      this.products,
      this.sortField,
      this.sortOrder
    );
  }

  // download CSV template of items
  // downloadTemplate() {
  //   this.document.location.href =
  //     'https://firebasestorage.googleapis.com/v0/b/zenysdevelopment.appspot.com/o/Templates%2Fproductstemplate.csv?alt=media&token=e7453251-2d7b-4d9b-80c3-9382aef3ac21';
  // }
  downloadTemplate() {
    const csvHead = [
      `${this.productSettings.productName.displayName}`,
      `${this.productSettings.hsnCode.displayName}`,
      `${this.productSettings.description.displayName}`,
      `${this.productSettings.category.displayName}`,
      `${this.productSettings.unitPrice.displayName}`,
      `${this.productSettings.units.displayName}`,
      `${this.productSettings.discount.displayName}(%)`,
      `CGST(%)`,
      `SGST(%)`,
      `IGST(%)`,
      `VAT Rate(%)`,
      `${this.productSettings.availability.displayName}(TRUE/FALSE)`,
    ];
    //getting field name of all additional field into defaault fields array
    if (this.superuserData.customFieldsProduct?.length > 0) {
      for (const addiF of this.superuserData.customFieldsProduct) {
        if (addiF.isActive === true) {
          if (addiF.fieldType === 'date') {
            csvHead.push(`${addiF.fieldName}(dd/MM/yyyy or dd-MM-yyyy)`);
          } else if (addiF.fieldType === 'date_time') {
            csvHead.push(
              `${addiF.fieldName}(dd/MM/yyyy HH:MM:SS or dd-MM-yyyy HH:MM:SS)`
            );
          } else if (
            addiF.fieldType !== 'date' &&
            addiF.fieldType !== 'date_time'
          ) {
            csvHead.push(addiF.fieldName);
          }
        }
      }
    }
    //separating each heading into rows by adding lines
    const csvArray = csvHead.toString();
    //setting file type as csv
    var blob = new Blob([csvArray], { type: 'text/csv' });
    //setting download funtionality to setted csv with name "contact_template.csv"
    saveAs(blob, 'product_template.csv');
  }
  openL() {
    let element: HTMLElement = document.getElementsByClassName(
      'csv-selector'
    )[0] as HTMLElement;
    element.click();
  }
  // upload items via CSV
  csv2Array(fileInput: any) {
    this.onReset();
    if (fileInput.target.files[0].name.includes('.csv')) {
      this.fileReaded = fileInput.target.files[0];
      let reader: FileReader = new FileReader();
      reader.readAsText(this.fileReaded);
      reader.onload = (e) => {
        const csv: string = reader.result as string;
        this.csvLine = csv.split('\n').length - 2;
        let allTextLines = csv.split(/\r|\n|\r/);
        // split headers based on comma
        let headers = allTextLines[0].split(',');
        let lines = [];
        let tarr = [];

        if (headers.length < 12 + this.isActiveAddFLength) {
          this._snackBar.open('Error!! Please Stick on Template', '', {
            duration: 2000,
          });
        } else {
          for (let i = 0; i < allTextLines.length; i++) {
            // split content based on comma
            let data = allTextLines[i].split(',');
            if (data.length === headers.length) {
              for (let j = 0; j < headers.length; j++) {
                tarr.push(data[j]);
              }
              lines.push(tarr);
            }
          }
          // for loop starting from index after headers, thus contents are saved accordingly to each variable
          for (let k = headers.length; k < tarr.length; k) {
            this.dataArray.prodName = tarr[k++];
            this.dataArray.hsnCode = tarr[k++];
            this.dataArray.prodDes = tarr[k++];
            this.dataArray.prodCategory = tarr[k++];
            this.dataArray.unitPrice = Number(tarr[k++]);
            this.dataArray.unit = tarr[k++];
            this.dataArray.discount = Number(tarr[k++]);
            this.dataArray.cgst = Number(tarr[k++]);
            this.dataArray.sgst = Number(tarr[k++]);
            this.dataArray.igst = Number(tarr[k++]);
            this.dataArray.vatRate = Number(tarr[k++]);
            this.dataArray.availability = tarr[k++]?.toLowerCase();

            let additionalFields = <addFieldsArr>{};
            for (
              let x = 0;
              x < this.superuserData?.customFieldsProduct?.length;
              x++
            ) {
              if (
                this.superuserData?.customFieldsProduct[x].isActive === true
              ) {
                let currentValue;
                currentValue = tarr[k++]?.replaceAll('"', '');

                if (
                  typeof currentValue !== 'undefined' &&
                  currentValue !== '' &&
                  currentValue !== null
                ) {
                  if (
                    this.superuserData?.customFieldsProduct[x].fieldType ===
                    'date'
                  ) {
                    // starts here

                    const str = currentValue;

                    if (str.includes('/')) {
                      const [day, month, year] = str.split('/');
                      const date = new Date(+year, +month - 1, +day);
                      additionalFields[x] = {
                        fieldValue: date,
                      };
                    } else if (str.includes('-')) {
                      const [day, month, year] = str.split('-');
                      const date = new Date(+year, +month - 1, +day);
                      additionalFields[x] = {
                        fieldValue: date,
                      };
                    } else {
                      //not in dd/mm/yyyy or dd-MM-yyyy format
                      additionalFields[x] = {
                        fieldValue: null,
                      };
                    }

                    // ends here
                  } else if (
                    this.superuserData?.customFieldsProduct[x].fieldType ==
                    'date_time'
                  ) {
                    let xx = currentValue.split(' ');

                    // date field
                    const str = xx[0];
                    const timeField = xx[1] ? xx[1] : '00:00';
                    const timeFieldSplit = timeField?.split(':');
                    let hoursTime = timeFieldSplit[0];
                    const minTime = timeFieldSplit[1] ? timeFieldSplit[1] : 0;
                    const secTime = timeFieldSplit[2] ? timeFieldSplit[2] : 0;
                    const amPm = xx[2];
                    if (amPm && amPm !== '12') {
                      if (amPm === 'PM' || amPm === 'Pm' || amPm === 'pm') {
                        hoursTime = +hoursTime + 12;
                      }
                    } else if (amPm && amPm == '12') {
                      if (amPm === 'AM' || amPm === 'Am' || amPm === 'am') {
                        hoursTime = 0;
                      }
                    }

                    if (str.includes('/')) {
                      const [day, month, year] = str.split('/');
                      const date = new Date(
                        +year,
                        +month - 1,
                        +day,
                        +hoursTime,
                        +minTime,
                        +secTime
                      );

                      additionalFields[x] = {
                        fieldValue: date,
                      };
                    } else if (str.includes('-')) {
                      const [day, month, year] = str.split('-');
                      const date = new Date(
                        +year,
                        +month - 1,
                        +day,
                        +hoursTime,
                        +minTime,
                        +secTime
                      );

                      additionalFields[x] = {
                        fieldValue: date,
                      };
                    } else {
                      //not in dd/mm/yyyy or dd-MM-yyyy format
                      additionalFields[x] = {
                        fieldValue: null,
                      };
                    }
                  } else {
                    //not date addi fields
                    additionalFields[x] = {
                      fieldValue: currentValue,
                    };
                  }
                } else {
                  additionalFields[x] = {
                    fieldValue: null,
                  };
                }
              } else {
                additionalFields[x] = {
                  fieldValue: null,
                };
              }
              //setting additional field values array to dataArray
              this.dataArray.additionalFieldsArr = additionalFields;
            }

            if (headers.length > 12 + this.isActiveAddFLength) {
              //w.k.t header length in template is (12 + this.superuserData?.customFieldsProduct?.length)
              let unwantedlength =
                headers.length - (12 + this.isActiveAddFLength);
              for (let l = 0; l < unwantedlength; l++) {
                tarr[k++];
              }
            }

            let available: boolean = false;
            if (this.dataArray.availability) {
              if (this.dataArray.availability == 'false') {
                available = false;
              } else {
                available = true;
              }
            }
            let date = new Date().getTime(); //current date is saving with data
            // new product to be saved is creted with the datas and current date
            let newProduct = {
              prodName: this.dataArray.prodName ? this.dataArray.prodName : '',
              hsnCode: this.dataArray.hsnCode ? this.dataArray.hsnCode : 'N/A',
              prodDes: this.dataArray.prodDes ? this.dataArray.prodDes : '',
              prodCategory: this.dataArray.prodCategory
                ? this.dataArray.prodCategory
                : '',
              currency: this.currency,
              unitPrice: this.dataArray.unitPrice
                ? this.dataArray.unitPrice
                : 0,
              unit: this.dataArray.unit ? this.dataArray.unit : '',
              taxType: this.taxType,
              discount: this.dataArray.discount ? this.dataArray.discount : 0,
              cgst: this.dataArray.cgst ? this.dataArray.cgst : 0,
              sgst: this.dataArray.sgst ? this.dataArray.sgst : 0,
              igst: this.dataArray.igst ? this.dataArray.igst : 0,
              availability: available,
              vatRate: this.dataArray.vatRate ? this.dataArray.vatRate : 0,
              dateCreated: date,
              additionalFieldsArr: this.dataArray.additionalFieldsArr
                ? this.dataArray.additionalFieldsArr
                : null,
            };
            if (this.dataArray.prodName.length > 1) {
              this.serviceInstance
                .saveExcel(this.superUserId, newProduct)
                .then((res) => {
                  this._snackBar.open(this.message + ' added', '', {
                    duration: 2000,
                  });
                })
                .catch((e) => {
                  this._snackBar.open(
                    'Failed to add' + ' ' + this.message,
                    'error',
                    {
                      duration: 2000,
                    }
                  );
                });
            } else {
              this._snackBar.open(
                `${this.productSettings.productName.displayName} is mandatory`,
                'Error!',
                {
                  duration: 2000,
                }
              );
            }
          }
        }
      };
    } else {
      this.dialog.open(ConfirmationpopupComponent, {
        width: '400px',
        data: {
          smode: 'typenotcsv',
        },
      });
    }
  }

  onBack() {
    this.location.back();
  }
  // clear button function
  onReset() {
    this.filter = null;
    this.isFilterApplied = false;
  }
  // create new product web
  addProd() {
    this.onReset();
    const dialogRef = this.dialog.open(ChildCustomReportTableComponent, {
      width: '800px',
      disableClose: true,
      data: {
        scenario: 'create',
        currency: this.currency,
        taxType: this.taxType,
        fieldNameItems: this.fieldNameItems,
        fieldNameItemsCategory: this.fieldNameItemsCategory,
        arrayProductcategories: this.superuserData.productCategories,
        arrayProductUnits: this.superuserData.productUnits,
        productSettings: this.productSettings,
        customFieldsProduct: this.superuserData.customFieldsProduct,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {

            let date = new Date().getTime();
            let pCode = '';
            if (
              result.hsnCode == 'N/A' ||
              result.hsnCode == ' ' ||
              !result.hsnCode
            ) {
              pCode = 'N/A';
            } else {
              pCode = result.hsnCode;
            }
            //pushing default value in additional field array
            let additionalFields = <addFieldsArr>{};
            for (let i = 0; i < result.additionalFields.length; i++) {
              if (result.additionalFields[i].fieldValue) {
                if (result.additionalFields[i].fieldType == 'date_time') {
                  if (
                    result.additionalFields[i].fieldValue2 == '' ||
                    result.additionalFields[i].fieldValue2 == undefined
                  ) {
                    result.additionalFields[i].fieldValue2 = '00:00';
                  }
                }
              }
              if (result.additionalFields[i].fieldValue2) {
                var time_splitEdit =
                  result.additionalFields[i].fieldValue2.split(':');
                const date_timEditVal = new Date(
                  new Date(result.additionalFields[i].fieldValue).getFullYear(),
                  new Date(result.additionalFields[i].fieldValue).getMonth(),
                  new Date(result.additionalFields[i].fieldValue).getDate(),
                  Number(time_splitEdit ? time_splitEdit[0] : null),
                  Number(time_splitEdit ? time_splitEdit[1] : null)
                );
                this.daTime = date_timEditVal;
              }
              //incase of only selecting timeValue,field is stored as null
              if (
                result.additionalFields[i].fieldValue == null ||
                result.additionalFields[i].fieldValue == ''
              ) {
                this.daTime = null;
              }
              additionalFields[i] = {
                fieldValue: result.additionalFields[i].fieldValue2
                  ? this.daTime
                  : result.additionalFields[i].fieldValue,
              };
            }

            let newProduct = {
              prodName: result.prodName,
              hsnCode: pCode,
              prodDes: result.prodDes ? result.prodDes : '',
              currency: result.currency ? result.currency : 'INR',
              unitPrice: result.unitPrice ? result.unitPrice : 0,
              unit: result.unit ? result.unit : '',
              taxType: this.taxType,
              discount: result.discount ? result.discount : 0,
              cgst: result.cgst ? result.cgst : 0,
              sgst: result.sgst ? result.sgst : 0,
              igst: result.igst ? result.igst : 0,
              availability: result.availability,
              vatRate: result.vatRate ? result.vatRate : 0,
              prodCategory: result.prodCategory ? result.prodCategory : '',
              dateCreated: date,
              additionalFieldsArr: additionalFields,
            };
            this.analytics.logEvent('btn_create_prod_web');
            this.serviceInstance
              .createProduct(this.superUserId, newProduct)
              .then((res) => {
                this._snackBar.open(this.message + ' added', '', {
                  duration: 2000,
                });
              })
              .catch((e) => {
                this._snackBar.open('Failed to add ' + this.message, '', {
                  duration: 2000,
                });
              });

        }
      });
  }

  // ondestroy
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
// PRODUCTS CRUD POPUP
@Component({
  selector: 'add-product',
  templateUrl: 'add-product.html',
  styleUrls: ['./products-and-services.component.scss'],
})
export class AddProduct {
  private onDestroy$: Subject<void> = new Subject<void>(); //ondestroy variable

  // auto-complete
  myControl = new FormControl('');
  filteredOptions: Observable<string[]>;

  // local varibles to hold product details
  productName: string = '';
  productCode: string = '';
  productDes: string = '';
  currency: string = '';
  unitPrice: number = 0;
  unit: string = '';
  taxType: string = '';
  discount: number = 0;
  cgst: number = 0;
  sgst: number = 0;
  igst: number = 0;
  availability: boolean = true;
  vatRate: number = 0;
  productCategory: string = '';

  currencyList = []; //currency array currencies.ts
  prodUnitaArray: string[] = []; //product units array from data-model.ts
  pUnits: ProductUnits = null; //current product unit
  pCats: ProductCategories = null;
  prodCatArray: string[] = [];
  scenario: string; //scenario whether create/view/edit
  superUserId: string; // logged in users super users id
  productId: string; // single products id
  disabledOnView: boolean = false; //mat-form-fileds are disable if scenario is view by this variable
  usrProfileData: UserAccessDetails = null; //user access control
  disableItemsEdit: boolean = false; //check if user has edit access on products edit
  disableItemsDelete: boolean = false; //checvk if user has access on product delete
  productCodeArray = []; //product codes are saved inside an array to check uniqueness of code
  fieldNameItems: string = 'Products and Service'; //customisable field name
  fieldNameItemsCategory: string = 'Category'; //customisable field name category
  message: string = 'Product'; //mat-snackbar message

  // field customisation
  crudProductForm: FormGroup;
  productSettings: ProductSettings = defaultProductSettings.CONST_VALUE;

  // additional fields
  additionalFieldModel: customFields = {
    //to store additional field data
    fieldName: null,
    fieldType: null,
    categories: null,
    categoriesOpn: null,
    defaultValue: null,
    mandatory: null,
    value: null,
    isActive: null,
  };
  addFieldArrModel: addFieldsArr = {
    //model for storing additional fields of each customer
    fieldValue: null,
  };
  additionalFields = [this.additionalFieldModel];
  addFieldsArray = [this.addFieldArrModel]; //to store additional fields in sales
  additionalFieldLength: number; //store additional fields length

  constructor(
    private analytics: AngularFireAnalytics,
    private serviceinst: ProductsAndServicesService,
    @Optional() public dialogRef: MatDialogRef<AddProduct>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private route: ActivatedRoute,
    private location: Location,
    private _snackBar: MatSnackBar,
    private router: Router,
    public commonService: CommonService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public networkCheck: NetworkCheckService
  ) {
    if (data) {
      this.currency = data.currency;
      this.taxType = data.taxType;
      this.scenario = data.scenario;
      if (
        typeof data.productSettings !== 'undefined' &&
        data.productSettings !== null
      ) {
        this.productSettings = data.productSettings;
      }

      //getting additional field
      this.additionalFields = data.customFieldsProduct;
      if (
        typeof data.arrayProductUnits === 'undefined' ||
        data.arrayProductUnits?.length === 0
      ) {
        this.prodUnitaArray = this.getunits();
      } else {
        this.prodUnitaArray = data.arrayProductUnits;
      }
      if (
        typeof data.arrayProductcategories === 'undefined' ||
        data.arrayProductcategories?.length === 0
      ) {
        this.prodCatArray = this.getCats();
      } else {
        this.prodCatArray = data.arrayProductcategories;
      }
    } else {
      route.params.subscribe((val) => {
        this.currency = this.route.snapshot.paramMap.get('currency');
        this.taxType = this.route.snapshot.paramMap.get('taxType');
        this.scenario = this.route.snapshot.paramMap.get('scn');
        this.superUserId = this.route.snapshot.paramMap.get('superUserId');
        this.productId = this.route.snapshot.paramMap.get('productId');
        this.fieldNameItems = this.route.snapshot.paramMap.get('fieldName');
        this.fieldNameItemsCategory = this.route.snapshot.paramMap.get(
          'fieldNameItemsCategory'
        );
      });
      this.commonService.userDatas.subscribe((allData) => {
        if (typeof allData.superUserDetails.productUnits === 'undefined') {
          this.prodUnitaArray = this.getunits();
        } else {
          this.prodUnitaArray = allData.superUserDetails.productUnits;
        }
        if (typeof allData.superUserDetails.productCategories === 'undefined') {
          this.prodCatArray = this.getCats();
        } else {
          this.prodCatArray = allData.superUserDetails.productCategories;
        }
        //getting additional field
        this.additionalFields = allData.superUserDetails.customFieldsProduct;
        if (allData.superUserDetails.productSettings) {
          this.productSettings = allData.superUserDetails.productSettings;
        }
        // To check edit and delete permission in mobile
        this.usrProfileData = allData.usrProfileData;

        if (this.usrProfileData) {
          if (this.usrProfileData.isCheckedItems == false) {
            this.disableItemsDelete = true;
            this.disableItemsEdit = true;
          } else {
            if (this.usrProfileData.itemsEdit == false) {
              this.disableItemsEdit = true;
            }
            if (this.usrProfileData.itemsDelete == false) {
              this.disableItemsDelete = true;
            }
          }
        }
      });
    }

    this.additionalFieldLength = this.additionalFields?.length;
    if (!this.additionalFieldLength) {
      this.additionalFieldLength = 0;
    }

    this.currencyList = Currencies.getCurencies();

    // assignimg snackbar message according to customisable field name
    if (this.fieldNameItems == 'Products and Service') {
      this.message = 'Product';
    } else {
      this.message = this.fieldNameItems;
    }

    // Products and services are shown as alist, and if scenario is view, product details are shown in mobile
    // details are fetched from commonservcie, and an else is provided to confirm if failed to fetch fromn common sevrcie
    if (this.scenario == 'view' || this.scenario == 'edit') {
      // this.disabledOnView = true;
      let singleProduct = this.commonService.getProductToEdit();
      if (singleProduct) {
        this.productName = singleProduct.prodName;
        this.productCode = singleProduct.hsnCode;
        this.productDes = singleProduct.prodDes;
        this.currency = singleProduct.currency;
        this.unitPrice = singleProduct.unitPrice;
        this.unit = singleProduct.unit;
        this.taxType = singleProduct.taxType;
        this.discount = singleProduct.discount;
        this.cgst = singleProduct.cgst;
        this.sgst = singleProduct.sgst;
        this.igst = singleProduct.igst;
        this.availability = singleProduct.availability;
        this.vatRate = singleProduct.vatRate;
        this.productCategory = singleProduct.prodCategory;
        this.addFieldsArray = singleProduct.additionalFieldsArr;
        if (singleProduct.additionalFieldsArr) {
          const addFieldsLength = Object.keys(this.addFieldsArray).length;
          for (let i = 0; i < this.additionalFields?.length; i++) {
            this.additionalFields[i].value = '';
          }
          if (addFieldsLength != 0) {
            //getting values pushed to field array
            for (let i = 0; i < addFieldsLength; i++) {
              this.additionalFields[i].value =
                this.addFieldsArray[i].fieldValue;
            }
          }
        } else {
          for (let i = 0; i < this.additionalFields?.length; i++) {
            this.additionalFields[i].value = '';
          }
        }
      } else {
        this.serviceinst
          .getSingleProduct(this.superUserId, this.productId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((singleProduct) => {
            if (singleProduct) {
              this.productName = singleProduct.prodName;
              this.productCode = singleProduct.hsnCode;
              this.productDes = singleProduct.prodDes;
              this.currency = singleProduct.currency;
              this.unitPrice = singleProduct.unitPrice;
              this.unit = singleProduct.unit;
              this.taxType = singleProduct.taxType;
              this.discount = singleProduct.discount;
              this.cgst = singleProduct.cgst;
              this.sgst = singleProduct.sgst;
              this.igst = singleProduct.igst;
              this.availability = singleProduct.availability;
              this.vatRate = singleProduct.vatRate;
              this.productCategory = singleProduct.prodCategory;
            }
          });
      }
      let currentProductCode = this.productCode;
      for (var i = 0; i < this.productCodeArray.length; i++) {
        if (this.productCodeArray[i] === currentProductCode) {
          this.productCodeArray.splice(i, 1);
        }
      }
    }

    // reactive form section starts here
    this.crudProductForm = new FormGroup({
      prodName: new FormControl(this.productName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(200),
        AppCustomDirective.whiteSpaceOnly,
      ]),
      hsnCode: new FormControl(this.productCode),
      prodDes: new FormControl(this.productDes),
      currency: new FormControl(this.currency),
      unitPrice: new FormControl(this.unitPrice),
      unit: new FormControl(this.unit),
      discount: new FormControl(this.discount),
      cgst: new FormControl(this.cgst),
      sgst: new FormControl(this.sgst),
      igst: new FormControl(this.igst),
      availability: new FormControl(this.availability),
      vatRate: new FormControl(this.vatRate),
      prodCategory: new FormControl(this.productCategory, [
        this.requireMatch.bind(this),
      ]),
      additionalFields: this.fb.array([]),
    });

    //additional fields
    this.additionalFields?.forEach((field) => {
      if (field.mandatory == true) {
        if (field.fieldType == 'date') {
          (this.crudProductForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [
                this.data.scenario === 'edit'
                  ? !!field.value
                    ? field.value.toDate()
                    : ''
                  : !!field.defaultValue
                  ? field.defaultValue.toDate()
                  : '',
                Validators.required,
              ],
              fieldName: field.fieldName,
            })
          );
        } else if (field.fieldType == 'date_time') {
          (this.crudProductForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [
                this.data.scenario === 'edit'
                  ? !!field.value
                    ? field.value.toDate()
                    : ''
                  : !!field.defaultValue
                  ? field.defaultValue.toDate()
                  : '',
                Validators.required,
              ],
              fieldValue2: [
                this.data.scenario === 'edit'
                  ? !!field.value
                    ? new Date(field.value.seconds * 1e3)
                        .toString()
                        .split(' ')[4]
                    : ''
                  : !!field.defaultValue
                  ? new Date(field.defaultValue.seconds * 1e3)
                      .toString()
                      .split(' ')[4]
                  : '',
                Validators.required,
              ],
              fieldName: field.fieldName,
              fieldType: field.fieldType,
            })
          );
        } else {
          (this.crudProductForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [
                this.data.scenario === 'edit'
                  ? field.value
                  : field.defaultValue,
                Validators.required,
              ],
              fieldName: field.fieldName,
            })
          );
        }
      } else {
        if (field.fieldType == 'date') {
          (this.crudProductForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue:
                this.data.scenario === 'edit'
                  ? !!field.value
                    ? field.value.toDate()
                    : ''
                  : !!field.defaultValue
                  ? field.defaultValue.toDate()
                  : '',
              fieldName: field.fieldName,
            })
          );
        } else if (field.fieldType == 'date_time') {
          (this.crudProductForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [
                this.data.scenario === 'edit'
                  ? !!field.value
                    ? field.value.toDate()
                    : ''
                  : !!field.defaultValue
                  ? field.defaultValue.toDate()
                  : '',
              ],
              fieldValue2: [
                this.data.scenario === 'edit'
                  ? !!field.value
                    ? new Date(field.value.seconds * 1e3)
                        .toString()
                        .split(' ')[4]
                    : ''
                  : !!field.defaultValue
                  ? new Date(field.defaultValue.seconds * 1e3)
                      .toString()
                      .split(' ')[4]
                  : '',
              ],
              fieldName: field.fieldName,
              fieldType: field.fieldType,
            })
          );
        } else {
          (this.crudProductForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue:
                this.data.scenario === 'edit'
                  ? field.value
                  : field.defaultValue,
              fieldName: field.fieldName,
            })
          );
        }
      }
    });

    if (this.productSettings) {
      // hsn code
      if (this.productSettings?.hsnCode?.mandatory === true) {
        this.crudProductForm.controls['hsnCode'].setValidators([
          Validators.required,
        ]);
      } else {
        this.crudProductForm.controls['hsnCode'].clearValidators();
      }
      this.crudProductForm.controls['hsnCode'].updateValueAndValidity();
      // description
      if (this.productSettings?.description?.mandatory === true) {
        this.crudProductForm.controls['prodDes'].setValidators([
          Validators.required,
        ]);
      } else {
        this.crudProductForm.controls['prodDes'].clearValidators();
      }
      this.crudProductForm.controls['prodDes'].updateValueAndValidity();
      // currency
      if (this.productSettings?.currency?.mandatory === true) {
        this.crudProductForm.controls['currency'].setValidators([
          Validators.required,
        ]);
      } else {
        this.crudProductForm.controls['currency'].clearValidators();
      }
      this.crudProductForm.controls['currency'].updateValueAndValidity();
      // unitPrice
      if (this.productSettings?.unitPrice?.mandatory === true) {
        this.crudProductForm.controls['unitPrice'].setValidators([
          Validators.required,
        ]);
      } else {
        this.crudProductForm.controls['unitPrice'].clearValidators();
      }
      this.crudProductForm.controls['unitPrice'].updateValueAndValidity();
      // units
      if (this.productSettings?.units?.mandatory === true) {
        this.crudProductForm.controls['unit'].setValidators([
          Validators.required,
        ]);
      } else {
        this.crudProductForm.controls['unit'].clearValidators();
      }
      this.crudProductForm.controls['unit'].updateValueAndValidity();
      // discount
      if (this.productSettings?.discount?.mandatory === true) {
        this.crudProductForm.controls['discount'].setValidators([
          Validators.required,
        ]);
      } else {
        this.crudProductForm.controls['discount'].clearValidators();
      }
      this.crudProductForm.controls['discount'].updateValueAndValidity();
      // cgst
      if (this.productSettings?.cgst?.mandatory === true) {
        this.crudProductForm.controls['cgst'].setValidators([
          Validators.required,
        ]);
      } else {
        this.crudProductForm.controls['cgst'].clearValidators();
      }
      this.crudProductForm.controls['cgst'].updateValueAndValidity();
      // sgst
      if (this.productSettings?.sgst?.mandatory === true) {
        this.crudProductForm.controls['sgst'].setValidators([
          Validators.required,
        ]);
      } else {
        this.crudProductForm.controls['sgst'].clearValidators();
      }
      this.crudProductForm.controls['sgst'].updateValueAndValidity();
      // igst
      if (this.productSettings?.igst?.mandatory === true) {
        this.crudProductForm.controls['igst'].setValidators([
          Validators.required,
        ]);
      } else {
        this.crudProductForm.controls['igst'].clearValidators();
      }
      this.crudProductForm.controls['igst'].updateValueAndValidity();
      // availability
      if (this.productSettings?.availability?.mandatory === true) {
        this.crudProductForm.controls['availability'].setValidators([
          Validators.required,
        ]);
      } else {
        this.crudProductForm.controls['availability'].clearValidators();
      }
      this.crudProductForm.controls['availability'].updateValueAndValidity();
      // vat
      if (this.productSettings?.vat?.mandatory === true) {
        this.crudProductForm.controls['vatRate'].setValidators([
          Validators.required,
        ]);
      } else {
        this.crudProductForm.controls['vatRate'].clearValidators();
      }
      this.crudProductForm.controls['vatRate'].updateValueAndValidity();
    }

    // for auto-complete starts
    this.filteredOptions = this.crudProductForm
      .get('prodCategory')
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    // autocomplete ends
  }

  currEventHander($event) {
    if ($event !== null) {
      this.crudProductForm.get('currency').setValue($event); //clear the selected customer
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.prodCatArray.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  // custom validation check for category
  private requireMatch(control: FormControl): ValidationErrors | null {
    const selection: any = control.value;
    if (
      !!this.crudProductForm?.get('prodCategory')?.value &&
      this.prodCatArray &&
      this.prodCatArray.indexOf(selection) < 0
    ) {
      return { requireMatch: true };
    }
    return {};
  }
  categorySelected($event) {
    // if (this.data?.scenario === 'edit') {
    //   this.data.prodCategory = optionSelected;
    // } else {
    //   this.productCategory = optionSelected;
    // }
    this.crudProductForm.get('prodCategory').setValue($event.option.value); //set the selected value
  }
  clearCategory() {
    // if (this.data?.scenario === 'edit') {
    //   this.data.prodCategory = null;
    // } else {
    //   this.productCategory = null;
    // }
    this.crudProductForm.get('prodCategory').setValue(null); //set the selected value
  }
  // get Units
  getunits(): string[] {
    this.pUnits = new ProductUnits();
    return this.pUnits.prodUnits;
  }
  // get categoriess
  getCats(): string[] {
    this.pCats = new ProductCategories();
    return this.pCats.prodCats;
  }
  // cancel button function
  onNoClick1(): void {
    this.dialogRef.close();
  }
  onBack() {
    this.location.back();
  }
  // add product fn
  addProductMobile() {
    if (this.productCodeArray.includes(this.crudProductForm.value.hsnCode)) {
      this._snackBar.open(this.message + ' ' + 'Code already exists', '', {
        duration: 2000,
      });
    } else {
      let date = new Date().getTime();
      let pCode = '';
      if (
        this.crudProductForm.value.hsnCode == 'N/A' ||
        this.crudProductForm.value.hsnCode == ' ' ||
        !this.crudProductForm.value.hsnCode
      ) {
        pCode = 'N/A';
      } else {
        pCode = this.crudProductForm.value.hsnCode;
      }
      //pushing default value in additional field array
      let additionalFields = <addFieldsArr>{};
      for (
        let i = 0;
        i < this.crudProductForm.value.addFieldsFormArray.length;
        i++
      ) {
        additionalFields[i] = {
          fieldValue: this.crudProductForm.value.addFieldsFormArray[i],
        };
      }
      let newProduct = {
        prodName: this.crudProductForm.value.prodName,
        hsnCode: pCode,
        prodDes: this.crudProductForm.value.prodDes
          ? this.crudProductForm.value.prodDes
          : '',
        currency: this.crudProductForm.value.currency,
        unitPrice: this.crudProductForm.value.unitPrice
          ? this.crudProductForm.value.unitPrice
          : 0,
        unit: this.crudProductForm.value.unit
          ? this.crudProductForm.value.unit
          : '',
        taxType: this.taxType,
        discount: this.crudProductForm.value.discount
          ? this.crudProductForm.value.discount
          : 0,
        cgst: this.crudProductForm.value.cgst
          ? this.crudProductForm.value.cgst
          : 0,
        sgst: this.crudProductForm.value.sgst
          ? this.crudProductForm.value.sgst
          : 0,
        igst: this.crudProductForm.value.igst
          ? this.crudProductForm.value.igst
          : 0,
        availability: this.crudProductForm.value.availability,
        vatRate: this.crudProductForm.value.vatRate
          ? this.crudProductForm.value.vatRate
          : 0,
        prodCategory: this.crudProductForm.value.prodCategory
          ? this.crudProductForm.value.prodCategory
          : '',
        dateCreated: date,
        additionalFieldsArr: additionalFields,
      };
      this.analytics.logEvent('btn_create_prod_mob');
      this.serviceinst
        .createProduct(this.superUserId, newProduct)
        .then((res) => {
          this._snackBar.open(this.message + ' added', '', {
            duration: 2000,
          });
          this.router.navigate(['/dash/products-and-services']);
        })
        .catch((e) => {
          this._snackBar.open('Failed to add ' + this.message, '', {
            duration: 2000,
          });
        });
    }
  }
  // on edit view is changed to edit and thus disabled fields get enabled
  onEditProduct() {
    // this.disabledOnView = false;
    let currentProductCode = this.productCode;
    for (var i = 0; i < this.productCodeArray.length; i++) {
      if (this.productCodeArray[i] === currentProductCode) {
        this.productCodeArray.splice(i, 1);
      }
    }
  }
  // edit function
  editProductMobile() {
    if (this.productCodeArray.includes(this.crudProductForm.value.hsnCode)) {
      this._snackBar.open(this.message + ' ' + 'Code already exists', '', {
        duration: 2000,
      });
    } else {
      let pCode = '';
      if (
        this.crudProductForm.value.hsnCode == 'N/A' ||
        this.crudProductForm.value.hsnCode == ' ' ||
        !this.crudProductForm.value.hsnCode
      ) {
        pCode = 'N/A';
      } else {
        pCode = this.crudProductForm.value.hsnCode;
      }
      //pushing default value in additional field array
      let additionalFields = <addFieldsArr>{};
      for (
        let i = 0;
        i < this.crudProductForm.value.addFieldsFormArray.length;
        i++
      ) {
        additionalFields[i] = {
          fieldValue: this.crudProductForm.value.addFieldsFormArray[i],
        };
      }
      this.serviceinst.updateProductWIthAdd(
        this.superUserId,
        this.productId,
        this.crudProductForm.value.prodName,
        pCode,
        this.crudProductForm.value.prodDes,
        this.crudProductForm.value.currency,
        this.crudProductForm.value.unitPrice
          ? this.crudProductForm.value.unitPrice
          : 0,
        this.crudProductForm.value.unit,
        this.taxType,
        this.crudProductForm.value.discount
          ? this.crudProductForm.value.discount
          : 0,
        this.crudProductForm.value.cgst ? this.crudProductForm.value.cgst : 0,
        this.crudProductForm.value.sgst ? this.crudProductForm.value.sgst : 0,
        this.crudProductForm.value.igst ? this.crudProductForm.value.igst : 0,
        this.crudProductForm.value.availability,
        this.crudProductForm.value.vatRate
          ? this.crudProductForm.value.vatRate
          : 0,
        this.crudProductForm.value.prodCategory
          ? this.crudProductForm.value.prodCategory
          : '',
        additionalFields
      );
      this._snackBar.open(this.message + ' updated', '', {
        duration: 2000,
      });
      this.router.navigate(['/dash/products-and-services']);
    }

    // if theres no product code, else if product code already exists, or a valid product code is there - 3 conditions checking while saving an existing product
  }
  public errorHandling = (control: string, error: string) => {
    return this.crudProductForm.controls[control].hasError(error);
  };
  // delete confirmation
  deleteProd() {
    const dialogRef = this.dialog.open(DeleteConfirmation, {
      data: {
        productName: this.productName,
        productId: this.productId,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.onDelete();
          this.router.navigate(['/dash/products-and-services']);
        }
      });
  }
  // delete function
  onDelete() {
    this.serviceinst.deleteProduct(this.superUserId, this.productId);

    this._snackBar.open(this.message + ' deleted', '', {
      duration: 2000,
    });
  }
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
// PRODUCTS DELETE CONFIRMATION POPUP
@Component({
  selector: 'delete-confirmation',
  templateUrl: 'delete-confirmation.html',
  styleUrls: ['./products-and-services.component.scss'],
})
export class DeleteConfirmation {
  constructor(
    public dialogRef1: MatDialogRef<DeleteConfirmation>,
    @Inject(MAT_DIALOG_DATA) public data,
    public networkCheck: NetworkCheckService
  ) {}
  onNoClick(): void {
    this.dialogRef1.close();
  }
}
