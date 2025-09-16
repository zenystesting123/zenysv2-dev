import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { CommonService } from '../common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NetworkCheckService } from '../networkcheck.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  itemMax,
  ProductCategories,
  ProductModel,
  Profile,
  Sales,
  UserAccessDetails,
} from '../data-models';
// import { ConfirmationpopupComponent } from '../confirmationpopup/confirmationpopup.component';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';

import { ProductSettingsService } from '../settings/product-settings/product-settings.service';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss'],
})
export class ProductCategoryComponent implements OnInit {
  networkConnection: boolean; //network check
  dataAccessRule = 'Own';
  progressBarStatus = false;
  fieldNameItems = 'Products';
  userDetailsSubscription: Subscription;
  superUserId = '';
  superUserDetails: Profile = null;
  usrProfileData: UserAccessDetails = null;
  prodCatArray = [];
  productCategories = '';
  pCats: ProductCategories = null;
  disableView = false;
  disableEdit = false;
  disableDelete = false;
  disableCreate = false;
  fieldNameItemsCategory = 'Category';

  constructor(
    private location: Location,
    public commonService: CommonService,
    private snack: MatSnackBar,
    public networkCheck: NetworkCheckService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          this.superUserId = allData.userDetails.superUserId;
          this.superUserDetails = allData.superUserDetails;
          this.usrProfileData = allData.usrProfileData;

          if (allData.usrProfileData.isCheckedItems == false) {
            this.disableView = true;
            this.disableCreate = true;
            this.disableEdit = true;
            this.disableDelete = true;
            this.progressBarStatus = true;
          } else {
            if (allData.usrProfileData.itemsCreate == false) {
              this.disableCreate = true;
            }
            if (allData.usrProfileData.itemsView === false) {
              this.disableView = true;
            }
            if (allData.usrProfileData.itemsEdit === false) {
              this.disableEdit = true;
            }
            if (allData.usrProfileData.itemsDelete === false) {
              this.disableDelete = true;
            }
          }
          // fetch details if settings is permitted
          if (this.disableView == false) {
            this.dataAccessRule = allData.usrProfileData.dialogdataAccessRule;
            this.fieldNameItems =
              allData.superUserDetails?.fieldNames?.fieldNameItems;

            // if (allData.superUserDetails?.fieldNames?.fieldNameItemsCategory) {
            //   this.fieldNameItemsCategory =
            //     allData.superUserDetails?.fieldNames?.fieldNameItemsCategory;
            // }
            if(allData.superUserDetails?.productSettings?.category?.displayName){
              this.fieldNameItemsCategory = allData.superUserDetails.productSettings.category.displayName;
            }
            if (
              allData.superUserDetails.productCategories &&
              allData.superUserDetails.productCategories?.length > 0
            ) {
              this.productCategories =
                allData.superUserDetails.productCategories.join();
              this.prodCatArray = allData.superUserDetails.productCategories;
            } else {
              let prodCatArray = this.getCats();
              this.productCategories = prodCatArray.join();
              this.prodCatArray = this.getCats();
            }
            this.progressBarStatus = true;
          }
        }
      }
    );
  }
  // get categoriess
  getCats(): string[] {
    this.pCats = new ProductCategories();
    return this.pCats.prodCats;
  }
  add() {
    //adding category by input field in status popup component
    this.dialog.open(ChildProductSettings, {
      disableClose: true,
      width: '400px',
      data: {
        scenario: 'add',
        superUserId: this.superUserId,
        productCategories: this.prodCatArray,
        fieldNameItemsCategory: this.fieldNameItemsCategory
      },
    });
  }
  //edit a category
  edit(categoryName, index) {
    // console.log(index, categoryName);
    this.dialog.open(ChildProductSettings, {
      disableClose: true,
      width: '400px',
      data: {
        scenario: 'edit',
        catName: categoryName,
        selIndex: index,
        superUserId: this.superUserId,
        productCategories: this.prodCatArray,
        fieldNameItemsCategory: this.fieldNameItemsCategory
      },
    });
  }
  delete(categoryName, index) {
    // console.log(index, categoryName);
    this.dialog.open(ChildProductSettings, {
      disableClose: true,
      width: '400px',
      data: {
        scenario: 'delete',
        catName: categoryName,
        selIndex: index,
        superUserId: this.superUserId,
        productCategories: this.prodCatArray,
        fieldNameItemsCategory: this.fieldNameItemsCategory
      },
    });
  }
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  onBack() {
    this.location.back();
  }
  public ngOnDestroy(): void {
    this.userDetailsSubscription?.unsubscribe();
  }
}

@Component({
  selector: 'child-product-settings',
  templateUrl: 'child-product-settings.html',
  styleUrls: ['./product-category.component.scss'],
})
export class ChildProductSettings {
  superUserId = '';
  prodCatArray: Array<string> = [];
  prodCatArrayCopy: Array<string> = [];
  selectedCatName = '';
  allCatNameArray = [];
  loader = false;
  selectedIndex: number;
  productsArray: ProductModel[] = [];
  productIdArray: Array<string> = [];
  salesArray = [];
  existingPCatNameArray: Array<string> = [];
  sales: Sales[] = [];
  superuserData: Profile = null;
  saleCollectionUpdated = false;
  prodCollnUpdated = false;
  formReset = true;

  private onDestroy$: Subject<void> = new Subject<void>(); //on destroy variable

  constructor(
    public dialogRef: MatDialogRef<ChildProductSettings>,
    @Inject(MAT_DIALOG_DATA) public data,
    public commonService: CommonService,
    private serviceInstance: ProductSettingsService,
    public dialog: MatDialog
  ) {
    this.commonService.userDatas.subscribe((allData) => {
      if (allData && this.formReset === true) {
        this.formReset = false;
        this.superuserData = allData.superUserDetails;
        (this.selectedCatName = data.catName),
          (this.selectedIndex = data.selIndex);
        this.superUserId = data.superUserId;
        this.prodCatArray = data.productCategories;
        this.prodCatArrayCopy = data.productCategories;

        if (data.scenario === 'add') {
          this.existingPCatNameArray = this.prodCatArray;
        } else if (data.scenario === 'edit') {
          for (let k = 0; k < this.prodCatArray.length; k++) {
            if (this.prodCatArray[k] !== this.data.catName) {
              this.existingPCatNameArray.push(this.prodCatArray[k]);
            }
          }
        }
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onUpdate() {
    const newCatName = this.selectedCatName;
    // console.log(this.existingPCatNameArray);
    // check for duplication
    if (this.existingPCatNameArray.includes(newCatName)) {
      this.dialog.open(ConfirmationpopupComponent, {
        width: '400px',
        data: {
          smode: 'duplicateCatName',
        },
      });
    } else {
      this.loader = true;
      // console.log('proceed', newCatName, this.selectedIndex);
      this.prodCatArray[this.selectedIndex] = newCatName;
      // console.log(this.prodCatArray);
      let itemArr = [];
      const maxItems = this.superuserData.itemMaxAllowed
        ? this.superuserData.itemMaxAllowed
        : itemMax.MAX_ITEM;

      // update at superuser level
      await this.serviceInstance.updateProdCategories(
        this.superUserId,
        this.prodCatArray
      );

      const productsArr = await this.serviceInstance.getProducts(
        this.superUserId,
        this.data.catName
      );

      if (productsArr?.length > 0) {
        // update in all collections
        // update in products collection

        productsArr.forEach(async (product) => {
          // const itemsArr = await this.serviceInstance.getSaleswithItems(item.id);
          // itemsArr.forEach(async (item) => {
          //   let userID = item.refId.split('/')[1];
          //   let saleID = item.refId.split('/')[3];
          //   let itemID = item.refId.split('/')[5];
          //   await this.serviceInstance.updateCatNameInItem(
          //     userID,
          //     saleID,
          //     itemID,
          //     newCatName
          //   );
          // });

          for (let index = 0; index < maxItems; index++) {
            await this.getAllSalesWithItems(
              this.superUserId,
              index,
              product.id
            );
            itemArr = itemArr.concat(this.sales);
          }
          if (itemArr?.length > 0) {
            itemArr = itemArr.filter((el, i, a) => i === a.indexOf(el)); // remove duplicate entries if any


            itemArr.forEach(async (item) => {
              for (let i = 0; i < maxItems; i++) {
                if (item.itemsArray[i]?.productId === product.id) {
                  item.itemsArray[i].prodCategory = newCatName;
                }
              }
              await this.serviceInstance.updateCatNameInItem(
                this.superUserId,
                item.id,
                item.itemsArray
              );
            });
            this.saleCollectionUpdated = true;
          }else{
            this.saleCollectionUpdated = true
          }
          await this.serviceInstance.updateCatNameInProd(
            this.superUserId,
            product.id,
            newCatName
          );
          this.prodCollnUpdated = true;
        });

        var interval = setInterval(() => {
          // if all data is updated then closing interval and navigate to customer details

          if (
            this.saleCollectionUpdated == true &&
            this.prodCollnUpdated == true
          ) {
            //clearing interval since all data is updated

            clearInterval(interval);
            //navigating to updated customer
            this.loader = false;
            this.dialogRef.close();
          }
        }, 200);
      } else {
        this.loader = false;
        this.dialogRef.close();
      }
    }
  }
  getAllSalesWithItems(userId, index, id) {
    return new Promise<void>((resolve) => {
      this.serviceInstance
        .getSaleItems(userId, index, id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.sales = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Sales;
          });
          resolve();
        });
    });
  }
  onDelete() {
    this.prodCatArray.splice(this.selectedIndex, 1);

    // update at superuser level
    this.serviceInstance.updateProdCategories(
      this.superUserId,
      this.prodCatArray
    );
    this.dialogRef.close();
    // how to handle products alraedy existing with this category
  }
  onAdd() {
    // check for duplication
    if (this.existingPCatNameArray.includes(this.selectedCatName)) {
      this.dialog.open(ConfirmationpopupComponent, {
        width: '400px',
        data: {
          smode: 'duplicateCatName',
        },
      });
    } else {
      this.prodCatArray[this.prodCatArray?.length] = this.selectedCatName;
      // update at superuser level
      this.serviceInstance.updateProdCategories(
        this.superUserId,
        this.prodCatArray
      );
      this.dialogRef.close();
    }
  }
}
