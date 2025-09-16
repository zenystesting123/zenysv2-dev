import { Location } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import {
  customFields,
  defaultProductSettings,
  fieldNameLEngth,
  itemMax,
  ProductCategories,
  ProductModel,
  ProductSettings,
  ProductUnits,
  Profile,
  Sales,
  UserAccessDetails,
} from 'src/app/data-models';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { StatusPopupComponent } from '../status-popup/status-popup.component';
import { ProductSettingsService } from './product-settings.service';

@Component({
  selector: 'app-product-settings',
  templateUrl: './product-settings.component.html',
  styleUrls: ['./product-settings.component.scss'],
})
export class ProductSettingsComponent implements OnInit, OnDestroy {
  progressBarStatus = false;
  disableSett = false;
  userDetailsSubscription: Subscription;
  superUserId = '';
  fieldNameItems = 'Products';
  productCategories = '';
  productCategoriesCopy = '';
  pCats: ProductCategories = null;
  unitTypes = '';
  disabledField = true;
  prodUnitaArray = '';
  prodUnitaArrayCopy = '';
  pUnits: ProductUnits = null; //current product unit

  networkConnection: boolean; //network check
  prodCatArray = [];
  superUserDetails: Profile = null;

  // field customisation
  fieldCustomisationForm: FormGroup;
  settingsConfigured = false;
  taxType = 'gst';

  // additional field
  currentCustomField: any = []; //to store additional fields
  customFields: customFields = {
    //to store values of additional field while editing and adding
    fieldName: null, //to store fields name
    fieldType: null, //to store the fields type
    categoriesOpn: null, //to store options if category type selected
    value: null, //to store value of that field while editing
    defaultValue: null, //to store default values
    mandatory: null, //to check where field is set as mandatory
    categories: null, //array to store options of category
    isActive: null, //to check wheter the field is activated or not
  };
  addNewField: boolean = false; //variable used to hide and show add new field button
  editFname: any; //to store fieldname while editing
  editFieldType: any; //to store fieldtype while editing
  editMandatory: any; //to store set mandatory or not while editing
  editDefaultValue: any; //to store default value while editing
  editCategoriesOpn: any; //to store category options while editing
  editIndex: number; //for storing index of edited variable
  fieldName: string; //for storing field name while adding
  categories: string; //for storing categories while adding
  defaultValue: string; //for storing default value while adding
  fieldType: string; //for storing field type while adding
  mandatory: boolean = false; //seting mandatory as false;
  editedField: boolean = false; //edited value while adding new field
  dataAccessRule = 'Own';
  productSettings: ProductSettings = defaultProductSettings.CONST_VALUE;
  editItems: boolean = false;
  editItemsCategory: boolean = false;
  fieldNameItemsCategory: string = 'Category'; //local variable to store field name items category
  fieldMaxLength = fieldNameLEngth.FIELD_NAME_LENGTH; //maxlength from datamodel.ts, but not implemented for products and services
  usrProfileData: UserAccessDetails=null;

  constructor(
    private location: Location,
    public commonService: CommonService,
    private serviceInstance: ProductSettingsService,
    private snack: MatSnackBar,
    public networkCheck: NetworkCheckService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {

        this.superUserId = allData.userDetails.superUserId;
        this.superUserDetails = allData.superUserDetails;
        this.usrProfileData = allData.usrProfileData;

        if (allData.usrProfileData.isCheckedSett == false) {
          this.disableSett = true;
          this.progressBarStatus = true;
        } else {
          if (allData.usrProfileData.settView == false) {
            this.disableSett = true;
          } else {
            this.disableSett = false;
          }
        }
        // fetch details if settings is permitted
        if (this.disableSett == false) {
          this.dataAccessRule = allData.usrProfileData.dialogdataAccessRule;
          this.fieldNameItems =
            allData.superUserDetails?.fieldNames?.fieldNameItems;

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

          if (
            allData.superUserDetails.productUnits &&
            allData.superUserDetails.productUnits?.length > 0
          ) {
            this.prodUnitaArray =
              allData.superUserDetails?.productUnits?.join();
          } else {
            let unitArray = this.getunits(); //product units array from data-model.ts
            this.prodUnitaArray = unitArray.join();
          }
          // if (this.superUserDetails.fieldNames.fieldNameItemsCategory) {
          //   this.fieldNameItemsCategory =
          //     this.superUserDetails.fieldNames.fieldNameItemsCategory;
          // }
          if(allData.superUserDetails?.productSettings?.category?.displayName){
            this.fieldNameItemsCategory = allData.superUserDetails.productSettings.category.displayName;
          }
          this.progressBarStatus = true;
          this.prodUnitaArrayCopy = this.prodUnitaArray;
          this.productCategoriesCopy = this.productCategories;

          // field customisation starts here
          this.taxType = allData.superUserDetails.taxType;
          // console.log(allData.superUserDetails.productSettings);
          if (
            typeof allData.superUserDetails.productSettings === 'undefined' ||
            allData.superUserDetails.productSettings === null
          ) {
            this.settingsConfigured = false;
          } else {
            this.settingsConfigured = true;
            this.productSettings = allData.superUserDetails.productSettings;
          }

          if (allData.superUserDetails.taxType === 'gst') {
            this.fieldCustomisationForm = new FormGroup({
              productName: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.productName.displayName,
                  [Validators.required, Validators.minLength(2)]
                ),
                display: new FormControl(
                  this.productSettings?.productName?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.productSettings?.productName?.mandatory,
                  Validators.required
                ),
              }),
              hsnCode: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.hsnCode?.displayName
                ),
                display: new FormControl(
                  this.productSettings?.hsnCode?.display
                ),
                mandatory: new FormControl(
                  this.productSettings?.hsnCode?.mandatory
                ),
              }),
              category: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.category?.displayName
                ),
                display: new FormControl(
                  this.productSettings?.category?.display
                ),
                mandatory: new FormControl(
                  this.productSettings?.category?.mandatory
                ),
              }),
              currency: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.currency?.displayName
                ),
                display: new FormControl(
                  this.productSettings?.currency?.display
                ),
                mandatory: new FormControl(
                  this.productSettings?.currency?.mandatory
                ),
              }),
              unitPrice: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.unitPrice?.displayName
                ),
                display: new FormControl(
                  this.productSettings?.unitPrice?.display
                ),
                mandatory: new FormControl(
                  this.productSettings?.unitPrice?.mandatory
                ),
              }),
              units: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.units?.displayName
                ),
                display: new FormControl(this.productSettings?.units?.display),
                mandatory: new FormControl(
                  this.productSettings?.units?.mandatory
                ),
              }),
              discount: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.discount?.displayName
                ),
                display: new FormControl(
                  this.productSettings?.discount?.display
                ),
                mandatory: new FormControl(
                  this.productSettings?.discount?.mandatory
                ),
              }),
              cgst: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.cgst?.displayName
                ),
                display: new FormControl(this.productSettings?.cgst?.display),
                mandatory: new FormControl(
                  this.productSettings?.cgst?.mandatory
                ),
              }),
              sgst: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.sgst?.displayName
                ),
                display: new FormControl(this.productSettings?.sgst?.display),
                mandatory: new FormControl(
                  this.productSettings?.sgst?.mandatory
                ),
              }),
              igst: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.igst?.displayName
                ),
                display: new FormControl(this.productSettings?.igst?.display),
                mandatory: new FormControl(
                  this.productSettings?.igst?.mandatory
                ),
              }),
              description: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.description?.displayName
                ),
                display: new FormControl(
                  this.productSettings?.description?.display
                ),
                mandatory: new FormControl(
                  this.productSettings?.description?.mandatory
                ),
              }),
              availability: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.availability?.displayName
                ),
                display: new FormControl(
                  this.productSettings?.availability?.display
                ),
                mandatory: new FormControl(
                  this.productSettings?.availability?.mandatory
                ),
              }),
            });
          } else {
            this.fieldCustomisationForm = new FormGroup({
              productName: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.productName.displayName,
                  [Validators.required, Validators.minLength(2)]
                ),
                display: new FormControl(
                  this.productSettings?.productName?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.productSettings?.productName?.mandatory,
                  Validators.required
                ),
              }),
              hsnCode: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.hsnCode?.displayName
                ),
                display: new FormControl(
                  this.productSettings?.hsnCode?.display
                ),
                mandatory: new FormControl(
                  this.productSettings?.hsnCode?.mandatory
                ),
              }),
              category: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.category?.displayName
                ),
                display: new FormControl(
                  this.productSettings?.category?.display
                ),
                mandatory: new FormControl(
                  this.productSettings?.category?.mandatory
                ),
              }),
              currency: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.currency?.displayName
                ),
                display: new FormControl(
                  this.productSettings?.currency?.display
                ),
                mandatory: new FormControl(
                  this.productSettings?.currency?.mandatory
                ),
              }),
              unitPrice: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.unitPrice?.displayName
                ),
                display: new FormControl(
                  this.productSettings?.unitPrice?.display
                ),
                mandatory: new FormControl(
                  this.productSettings?.unitPrice?.mandatory
                ),
              }),
              units: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.units?.displayName
                ),
                display: new FormControl(this.productSettings?.units?.display),
                mandatory: new FormControl(
                  this.productSettings?.units?.mandatory
                ),
              }),
              discount: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.discount?.displayName
                ),
                display: new FormControl(
                  this.productSettings?.discount?.display
                ),
                mandatory: new FormControl(
                  this.productSettings?.discount?.mandatory
                ),
              }),
              vat: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.vat?.displayName
                ),
                display: new FormControl(this.productSettings?.vat?.display),
                mandatory: new FormControl(
                  this.productSettings?.vat?.mandatory
                ),
              }),
              description: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.description?.displayName
                ),
                display: new FormControl(
                  this.productSettings?.description?.display
                ),
                mandatory: new FormControl(
                  this.productSettings?.description?.mandatory
                ),
              }),
              availability: new FormGroup({
                displayName: new FormControl(
                  this.productSettings?.availability?.displayName
                ),
                display: new FormControl(
                  this.productSettings?.availability?.display
                ),
                mandatory: new FormControl(
                  this.productSettings?.availability?.mandatory
                ),
              }),
            });
          }
          this.fieldCustomisationForm.get('productName.display').setValue(true);
          this.fieldCustomisationForm.get('productName.display').disable();
          this.fieldCustomisationForm
            .get('productName.mandatory')
            .setValue(true);
          this.fieldCustomisationForm.get('productName.mandatory').disable();

          this.disableDisplayCode();
          this.disableDisplayCat();
          this.disableDisplayCurrency();
          this.disableDisplayUPrice();
          this.disableDisplayUnits();
          this.disableDisplayDiscount();
          this.disableDisplayDesc();
          this.disableDisplayAvail();
          if (this.taxType === 'gst') {
            this.disableDisplayCgst();
            this.disableDisplaySgst();
            this.disableDisplayIgst();
          } else {
            this.disableDisplayVat();
          }
          // field customisation ends here

          // additional field
          //for storing all custom fields from db
          this.currentCustomField = this.superUserDetails?.customFieldsProduct;
        }
      }
    );
  }
  // edit button on Items field actions
  editItemsfn() {
    this.editItems = true;
  }
  // clear button on Items field actions
  clearItems() {
    this.editItems = false;
    this.fieldNameItems = this.superUserDetails.fieldNames.fieldNameItems;
  }
  // save button on Items field actions
  saveItems() {
    this.editItems = false;
    this.serviceInstance.updateItemsfieldName(
      this.superUserId,
      this.fieldNameItems
    );
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
    // edit button on Items category field actions
    editItemsCategoryfn() {
      this.editItemsCategory = true;
    }
    // clear button on Items field actions
    clearItemsCategory() {
      this.editItemsCategory = false;
      this.fieldNameItemsCategory =
      this.superUserDetails.productSettings.category.displayName;
    }
    // save button on Items field actions
    saveItemsCategory() {
      this.editItemsCategory = false;
      this.serviceInstance.updateItemscategoryfieldName(
        this.superUserId,
        this.fieldNameItemsCategory
      );
      this.snack.open('Successfully updated', '', {
        duration: 500,
      });
    }
  disableDisplayCode() {
    // hsn code
    if (this.fieldCustomisationForm.get('hsnCode.mandatory').value === true) {
      this.fieldCustomisationForm.get('hsnCode.display').setValue(true);
      this.fieldCustomisationForm.get('hsnCode.display').disable();
      // this.fieldCustomisationForm
      //   .get('hsnCode.displayName')
      //   .setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      let val = this.productSettings.hsnCode.display;
      this.fieldCustomisationForm.get('hsnCode.display').setValue(val);
      this.fieldCustomisationForm.get('hsnCode.display').enable();
      // this.fieldCustomisationForm.get('hsnCode.displayName').clearValidators();
    }
  }
  disableDisplayCat() {
    // category
    if (this.fieldCustomisationForm.get('category.mandatory').value === true) {
      this.fieldCustomisationForm.get('category.display').setValue(true);
      this.fieldCustomisationForm.get('category.display').disable();
      // this.fieldCustomisationForm
      //   .get('category.displayName')
      //   .setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      let val = this.productSettings.category.display;
      this.fieldCustomisationForm.get('category.display').setValue(val);
      this.fieldCustomisationForm.get('category.display').enable();
      // this.fieldCustomisationForm.get('category.displayName').clearValidators();
    }
  }
  disableDisplayCurrency() {
    // currency
    if (this.fieldCustomisationForm.get('currency.mandatory').value === true) {
      this.fieldCustomisationForm.get('currency.display').setValue(true);
      this.fieldCustomisationForm.get('currency.display').disable();
      // this.fieldCustomisationForm
      //   .get('currency.displayName')
      //   .setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      let val = this.productSettings.currency.display;
      this.fieldCustomisationForm.get('currency.display').setValue(val);
      this.fieldCustomisationForm.get('currency.display').enable();
      // this.fieldCustomisationForm.get('currency.displayName').clearValidators();
    }
  }
  disableDisplayUPrice() {
    // unitPrice
    if (this.fieldCustomisationForm.get('unitPrice.mandatory').value === true) {
      this.fieldCustomisationForm.get('unitPrice.display').setValue(true);
      this.fieldCustomisationForm.get('unitPrice.display').disable();
      // this.fieldCustomisationForm
      //   .get('unitPrice.displayName')
      //   .setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      let val = this.productSettings.unitPrice.display;
      this.fieldCustomisationForm.get('unitPrice.display').setValue(val);
      this.fieldCustomisationForm.get('unitPrice.display').enable();
      // this.fieldCustomisationForm
      //   .get('unitPrice.displayName')
      //   .clearValidators();
    }
  }
  disableDisplayUnits() {
    // units
    if (this.fieldCustomisationForm.get('units.mandatory').value === true) {
      this.fieldCustomisationForm.get('units.display').setValue(true);
      this.fieldCustomisationForm.get('units.display').disable();
      // this.fieldCustomisationForm
      //   .get('units.displayName')
      //   .setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      let val = this.productSettings.units.display;
      this.fieldCustomisationForm.get('units.display').setValue(val);
      this.fieldCustomisationForm.get('units.display').enable();
      // this.fieldCustomisationForm.get('units.displayName').clearValidators();
    }
  }
  disableDisplayDiscount() {
    // discount
    if (this.fieldCustomisationForm.get('discount.mandatory').value === true) {
      this.fieldCustomisationForm.get('discount.display').setValue(true);
      this.fieldCustomisationForm.get('discount.display').disable();
      // this.fieldCustomisationForm
      //   .get('discount.displayName')
      //   .setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      let val = this.productSettings.discount.display;
      this.fieldCustomisationForm.get('discount.display').setValue(val);
      this.fieldCustomisationForm.get('discount.display').enable();
      // this.fieldCustomisationForm.get('discount.displayName').clearValidators();
    }
  }
  disableDisplayCgst() {
    // cgst
    if (this.fieldCustomisationForm.get('cgst.mandatory').value === true) {
      this.fieldCustomisationForm.get('cgst.display').setValue(true);
      this.fieldCustomisationForm.get('cgst.display').disable();
      // this.fieldCustomisationForm
      //   .get('cgst.displayName')
      //   .setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      let val =
        this.settingsConfigured === true
          ? this.productSettings?.cgst?.display
          : true;
      this.fieldCustomisationForm.get('cgst.display').setValue(val);
      this.fieldCustomisationForm.get('cgst.display').enable();
      // this.fieldCustomisationForm.get('cgst.displayName').clearValidators();
    }
  }
  disableDisplaySgst() {
    // sgst
    if (this.fieldCustomisationForm.get('sgst.mandatory').value === true) {
      this.fieldCustomisationForm.get('sgst.display').setValue(true);
      this.fieldCustomisationForm.get('sgst.display').disable();
      // this.fieldCustomisationForm
      //   .get('sgst.displayName')
      //   .setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      let val =
        this.settingsConfigured === true
          ? this.productSettings?.sgst?.display
          : true;
      this.fieldCustomisationForm.get('sgst.display').setValue(val);
      this.fieldCustomisationForm.get('sgst.display').enable();
      // this.fieldCustomisationForm.get('sgst.displayName').clearValidators();
    }
  }
  disableDisplayIgst() {
    // igst
    if (this.fieldCustomisationForm.get('igst.mandatory').value === true) {
      this.fieldCustomisationForm.get('igst.display').setValue(true);
      this.fieldCustomisationForm.get('igst.display').disable();
      // this.fieldCustomisationForm
      //   .get('igst.displayName')
      //   .setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      let val =
        this.settingsConfigured === true
          ? this.productSettings?.igst?.display
          : true;
      this.fieldCustomisationForm.get('igst.display').setValue(val);
      this.fieldCustomisationForm.get('igst.display').enable();
      // this.fieldCustomisationForm.get('igst.displayName').clearValidators();
    }
  }
  disableDisplayVat() {
    // vat
    if (this.taxType === 'vat') {
      if (this.fieldCustomisationForm.get('vat.mandatory').value === true) {
        this.fieldCustomisationForm.get('vat.display').setValue(true);
        this.fieldCustomisationForm.get('vat.display').disable();
        // this.fieldCustomisationForm
        //   .get('vat.displayName')
        //   .setValidators([Validators.required, Validators.minLength(2)]);
      } else {
        let val =
          this.settingsConfigured === true
            ? this.productSettings?.vat?.display
            : true;
        this.fieldCustomisationForm.get('vat.display').setValue(val);
        this.fieldCustomisationForm.get('vat.display').enable();
        // this.fieldCustomisationForm.get('vat.displayName').clearValidators();
      }
    }
  }
  disableDisplayDesc() {
    // description
    if (
      this.fieldCustomisationForm.get('description.mandatory').value === true
    ) {
      this.fieldCustomisationForm.get('description.display').setValue(true);
      this.fieldCustomisationForm.get('description.display').disable();
      // this.fieldCustomisationForm
      //   .get('description.displayName')
      //   .setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      let val = this.productSettings.description.display;
      this.fieldCustomisationForm.get('description.display').setValue(val);
      this.fieldCustomisationForm.get('description.display').enable();
      // this.fieldCustomisationForm
      //   .get('description.displayName')
      //   .clearValidators();
    }
  }
  disableDisplayAvail() {
    // availability
    if (
      this.fieldCustomisationForm.get('availability.mandatory').value === true
    ) {
      this.fieldCustomisationForm.get('availability.display').setValue(true);
      this.fieldCustomisationForm.get('availability.display').disable();
      // this.fieldCustomisationForm
      //   .get('availability.displayName')
      //   .setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      let val = this.productSettings.availability.display;
      this.fieldCustomisationForm.get('availability.display').setValue(val);
      this.fieldCustomisationForm.get('availability.display').enable();
      // this.fieldCustomisationForm
      //   .get('availability.displayName')
      //   .clearValidators();
    }
  }

  // field customisation submit button
  onSubmit() {
    // hsn code
    if (this.fieldCustomisationForm.getRawValue().hsnCode.displayName === '') {
      this.fieldCustomisationForm
        .get('hsnCode.displayName')
        .setValue(defaultProductSettings.CONST_VALUE.hsnCode.displayName);
    }
    // category
    if (this.fieldCustomisationForm.getRawValue().category.displayName === '') {
      this.fieldCustomisationForm
        .get('category.displayName')
        .setValue(defaultProductSettings.CONST_VALUE.category.displayName);
    }
    // currency
    if (this.fieldCustomisationForm.getRawValue().currency.displayName === '') {
      this.fieldCustomisationForm
        .get('currency.displayName')
        .setValue(defaultProductSettings.CONST_VALUE.currency.displayName);
    }
    // unitPrice
    if (
      this.fieldCustomisationForm.getRawValue().unitPrice.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('unitPrice.displayName')
        .setValue(defaultProductSettings.CONST_VALUE.unitPrice.displayName);
    }
    // units
    if (this.fieldCustomisationForm.getRawValue().units.displayName === '') {
      this.fieldCustomisationForm
        .get('units.displayName')
        .setValue(defaultProductSettings.CONST_VALUE.units.displayName);
    }
    // discount
    if (this.fieldCustomisationForm.getRawValue().discount.displayName === '') {
      this.fieldCustomisationForm
        .get('discount.displayName')
        .setValue(defaultProductSettings.CONST_VALUE.discount.displayName);
    }
    // cgst
    if (
      this.taxType === 'gst' &&
      this.fieldCustomisationForm.getRawValue().cgst.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('cgst.displayName')
        .setValue(defaultProductSettings.CONST_VALUE.cgst.displayName);
    }
    // sgst
    if (
      this.taxType === 'gst' &&
      this.fieldCustomisationForm.getRawValue().sgst.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('sgst.displayName')
        .setValue(defaultProductSettings.CONST_VALUE.sgst.displayName);
    }
    // igst
    if (
      this.taxType === 'gst' &&
      this.fieldCustomisationForm.getRawValue().igst.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('igst.displayName')
        .setValue(defaultProductSettings.CONST_VALUE.igst.displayName);
    }
    // vat
    if (
      this.taxType === 'vat' &&
      this.fieldCustomisationForm.getRawValue().vat.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('vat.displayName')
        .setValue(defaultProductSettings.CONST_VALUE.vat.displayName);
    }
    // description
    if (
      this.fieldCustomisationForm.getRawValue().description.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('description.displayName')
        .setValue(defaultProductSettings.CONST_VALUE.description.displayName);
    }
    // availability
    if (
      this.fieldCustomisationForm.getRawValue().availability.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('availability.displayName')
        .setValue(defaultProductSettings.CONST_VALUE.availability.displayName);
    }


    this.serviceInstance.updateFieldCustomization(
      this.superUserId,
      this.fieldCustomisationForm.getRawValue()
    );
    this.snack.open('Successfully updated', '', {
      duration: 2000,
    });
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
  onBack() {
    this.location.back();
  }
  onEdit() {
    this.disabledField = false;
  }
  onUpdate() {
    // console.log(this.prodUnitaArray);
    this.disabledField = true;
    const unitArray = this.prodUnitaArray.split(',');
    this.serviceInstance.updateProductSett(this.superUserId, unitArray);
    this.snack.open('Successfully updated', '', {
      duration: 2000,
    });
  }
  onCancel() {
    this.disabledField = true;
    this.prodUnitaArray = this.prodUnitaArrayCopy;
    this.productCategories = this.productCategoriesCopy;
  }
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
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
      },
    });
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
      },
    });
  }

  // additional field add button
  // //triggered while clicking add field button
  // addField() {
  //   if (this.currentCustomField?.length >= 10) {
  //     this.snack.open(
  //       'You can add to a maximum of 10 additional fields only!',
  //       '',
  //       {
  //         duration: 2000,
  //       }
  //     );
  //   } else {
  //     this.addNewField = true;
  //   }
  // }
  // //triggered while clicking submit in edit from accordian
  // submitEditField(index) {
  //   //if no additional field previously added
  //   if (!this.currentCustomField) {
  //     this.currentCustomField = [];
  //   }
  //   let options;
  //   let optionArray = [];
  //   //setting new value in customfields array
  //   this.customFields.fieldName = this.editFname;
  //   this.customFields.fieldType = this.editFieldType;
  //   //adding default value if default value exists
  //   if (this.editDefaultValue) {
  //     this.customFields.defaultValue = this.editDefaultValue;
  //   }
  //   //if no default value setting it as null
  //   else {
  //     this.customFields.defaultValue = null;
  //   }
  //   //if data type is category we have to split options to an array to list in form
  //   if (this.editCategoriesOpn) {
  //     options = this.editCategoriesOpn?.split(',');
  //     // pushing variable in to array as array elemnts
  //     for (var i = options?.length - 1; i >= 0; i--) {
  //       optionArray.push(options[i].trim());
  //     }
  //     // setting options and default value if type is category
  //     this.customFields.categories = optionArray;
  //     this.customFields.categoriesOpn = this.editCategoriesOpn;
  //   } else {
  //     //for setting null if no options are given in category option
  //     this.customFields.categories = null;
  //     this.customFields.categoriesOpn = null;
  //   }
  //   //setting mandatory field to array
  //   this.customFields.mandatory = this.editMandatory;
  //   //setting field active as default
  //   this.customFields.isActive = true;
  //   //storing setted customfield to main customfield array from db
  //   this.currentCustomField[this.editIndex] = this.customFields;
  //   //storing this new updated custom field array to db
  //   this.serviceInstance.updateCustomFields(
  //     this.superUserId,
  //     this.currentCustomField
  //   );
  //   //reseting all variable after updating
  //   this.fieldName = null;
  //   this.fieldType = null;
  //   this.defaultValue = null;
  //   this.categories = null;
  //   this.mandatory = false;
  //   this.addNewField = false;
  //   this.editedField = false;
  //   this.editDefaultValue = null;
  //   this.snack.open('Custom field updated successfully', '', {
  //     duration: 2000,
  //   });
  // }
  //clear defaultValue field on selection change
  clear() {
    this.defaultValue = '';
  }
  //triggered while in add field div submit button
  // submitField() {
  //   //if no additional field previously added
  //   if (!this.currentCustomField) {
  //     this.currentCustomField = [];
  //   }
  //   let options;
  //   let optionArray = [];
  //   //setting new value in customfields array
  //   this.customFields.fieldName = this.fieldName;
  //   this.customFields.fieldType = this.fieldType;
  //   //adding default value if default value exists
  //   if (this.defaultValue) {
  //     this.customFields.defaultValue = this.defaultValue;
  //   } else {
  //     this.customFields.defaultValue = null;
  //   }
  //   //if data type is category we have to split options to an array to list in form
  //   if (this.categories) {
  //     options = this.categories?.split(',');
  //     // pushing variable in to array as array elemnts
  //     for (var i = options?.length - 1; i >= 0; i--) {
  //       optionArray.push(options[i].trim());
  //     }
  //     // setting options and default value if type is category
  //     this.customFields.categories = optionArray;
  //     this.customFields.categoriesOpn = this.categories;
  //   } else {
  //     //for setting null if no options are given in category option
  //     this.customFields.categories = null;
  //     this.customFields.categoriesOpn = null;
  //   }
  //   //setting field active as default
  //   this.customFields.isActive = true;
  //   //setting mandatory field to array as false if not selected
  //   if (!this.mandatory) {
  //     this.customFields.mandatory = false;
  //   } else {
  //     this.customFields.mandatory = this.mandatory;
  //   }
  //   // pushing new field array to existing additionalfields array
  //   this.currentCustomField.push(this.customFields);
  //   //storing this new updated custom field array to db

  //   //reseting all variable after updating
  //   this.fieldName = null;
  //   this.fieldType = null;
  //   this.defaultValue = null;
  //   this.categories = null;
  //   this.mandatory = false;
  //   this.addNewField = false;
  //   //this.customFields.defaultValue = null;
  //   //this.snack.open('Custom field added successfully', '', {
  //   //  duration: 2000,
  //   //});
  //   this.serviceInstance
  //     .updateCustomFields(this.superUserId, this.currentCustomField)
  //     .then(() => {
  //       this.snack.open('Custom field added successfully', '', {
  //         duration: 2000,
  //       });
  //     });
  // }
  //triggered while cliking close button in add div used for closing
  submitFieldClose() {
    this.addNewField = false;
  }
  //triggered while closing mat accordian
  EditFieldClose() {
    this.editedField = false;
  }
  //editing a field in additional field triggered while clicking update button in edit additional field
  // editField(i) {
  //   this.editIndex = i;
  //   //for enabling expanded view in accordian
  //   this.editedField = true;
  //   //for binding data in fields
  //   this.editFname = this.currentCustomField[i].fieldName;
  //   this.editFieldType = this.currentCustomField[i].fieldType;
  //   this.editMandatory = this.currentCustomField[i].mandatory;
  //   if (this.editFieldType == 'date') {
  //     this.editDefaultValue = !!this.currentCustomField[i].defaultValue
  //       ? this.currentCustomField[i].defaultValue.toDate
  //         ? this.currentCustomField[i].defaultValue.toDate()
  //         : this.currentCustomField[i].defaultValue
  //       : null;
  //   } else this.editDefaultValue = this.currentCustomField[i].defaultValue;

  //   this.editCategoriesOpn = this.currentCustomField[i].categoriesOpn;
  // }
  //for deleting an additional field on clicking delete icon in additional fields
  // deleteField(i) {
  //   let index = i;
  //   //opening pop up for delete confirmation
  //   this.dialog.open(StatusPopupComponent, {
  //     disableClose: true,
  //     data: {
  //       type: 'deleteFieldProduct',
  //       uid: this.superUserId,
  //       statusArray: this.currentCustomField,
  //       currentIndex: index,
  //     },
  //   });
  // }
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.userDetailsSubscription?.unsubscribe();
  }
}
@Component({
  selector: 'child-product-settings',
  templateUrl: 'child-product-settings.html',
  styleUrls: ['./product-settings.component.scss'],
})
export class ChildProductSettings {
  superUserId = '';
  prodCatArray: Array<string> = [];
  prodCatArrayCopy: Array<string> = [];
  selectedCatName = '';
  allCatNameArray = [];
  isUpdating = false;
  selectedIndex: number;
  productsArray: ProductModel[] = [];
  productIdArray: Array<string> = [];
  salesArray = [];
  existingPCatNameArray: Array<string> = [];
  superuserData: Profile = null;
  sales: Sales[] = [];

  private onDestroy$: Subject<void> = new Subject<void>(); //on destroy variable

  constructor(
    public dialogRef: MatDialogRef<ChildProductSettings>,
    @Inject(MAT_DIALOG_DATA) public data,
    public commonService: CommonService,
    private serviceInstance: ProductSettingsService,
    public dialog: MatDialog
  ) {
    this.commonService.userDatas.subscribe(allData=>{
      if(allData){
        this.superuserData = allData.superUserDetails;
        (this.selectedCatName = data.catName), (this.selectedIndex = data.selIndex);
        this.superUserId = data.superUserId;
        this.prodCatArray = data.productCategories;
        this.prodCatArrayCopy = data.productCategories;

        // console.log(this.prodCatArray);

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
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onUpdate() {
    // console.log(this.existingPCatNameArray);
    // check for duplication
    if (this.existingPCatNameArray.includes(this.selectedCatName)) {
      this.dialog.open(ConfirmationpopupComponent, {
        width: '400px',
        data: {
          smode: 'duplicateCatName',
        },
      });
    } else {
      // console.log('proceed', this.selectedCatName, this.selectedIndex);
      this.prodCatArray[this.selectedIndex] = this.selectedCatName;
      // console.log(this.prodCatArray);

      // update at superuser level
      this.serviceInstance.updateProdCategories(
        this.superUserId,
        this.prodCatArray
      );

      // update in all collections
      // update in products collection
      // console.log(this.data.catName, this.selectedCatName);
      const productsArr = await this.serviceInstance.getProducts(this.superUserId, this.data.catName);
      productsArr.forEach(async (product) => {
        await this.serviceInstance.updateCatNameInProd(
          this.superUserId,
          product.id,
          this.selectedCatName
        );
        // const itemsArr = await this.serviceInstance.getSaleswithItems(item.id);
        // itemsArr.forEach(async (item) => {
        //   let userID = item.refId.split('/')[1];
        //   let saleID = item.refId.split('/')[3];
        //   let itemID = item.refId.split('/')[5];
        //   await this.serviceInstance.updateCatNameInItem(
        //     userID,
        //     saleID,
        //     itemID,
        //     this.selectedCatName
        //   );
        // });
        let itemArr = [];
        let maxItems = this.superuserData.itemMaxAllowed
        ? this.superuserData.itemMaxAllowed
        : itemMax.MAX_ITEM;
        for (let index = 0; index < maxItems; index++) {
          await this.getAllSalesWithItems(
            this.superUserId,
            index,
            product.id
          );
          itemArr = itemArr.concat(this.sales);
        }

        itemArr.forEach(async (item) => {
          for (let i = 0; i < maxItems; i++) {

            if (item.itemsArray[i]?.productId === product.id) {

              item.itemsArray[i].prodCategory = this.selectedCatName;
            }
          }
          await this.serviceInstance.updateCatNameInItem(
            this.superUserId,
            item.id,
            item.itemsArray
          );
        });
      });




      // await this.getProducts();
      // console.log(this.productsArray);
      // console.log(this.productIdArray)
      // update in items collection
      // await this.getSales()
      this.dialogRef.close();
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
