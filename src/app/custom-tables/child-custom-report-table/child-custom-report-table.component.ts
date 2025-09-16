/**********************************************************************************
Description: Component added as child componenmt for custom-report-table - products and services crud form
Inputs:
Outputs:
**********************************************************************************/
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { Currencies } from 'src/app/currencies';
import {
  ProductCategories,
  ProductModel,
  ProductSettings,
  ProductUnits,
  Sales,
  addFieldsArr,
  customFields,
  defaultProductSettings,
  itemMax,
} from 'src/app/data-models';
import { CustomReportTableService } from '../custom-report-table/custom-report-table.service';
import { AppCustomDirective } from 'src/app/app.validators';
import { map, startWith, take } from 'rxjs/operators';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-child-custom-report-table',
  templateUrl: './child-custom-report-table.component.html',
  styleUrls: ['./child-custom-report-table.component.scss'],
})
export class ChildCustomReportTableComponent implements OnInit {
  scenario = ''; //case for add/edit/delete

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
  daTime: any;

  product: ProductModel = null; //updating single product
  itemArr = []; //if code/category/addi field is changed, we have to update it in items collection under sale
  sales: Sales[] = []; //to update changed products details in sales

  constructor(
    public dialogRef: MatDialogRef<ChildCustomReportTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public commonService: CommonService,
    private serviceinst: CustomReportTableService,
    public networkCheck: NetworkCheckService,
    private _snackBar: MatSnackBar
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
    }
    this.additionalFieldLength = this.additionalFields?.length;
    if (!this.additionalFieldLength) {
      this.additionalFieldLength = 0;
    }

    this.currencyList = Currencies.getCurencies();
    // Products and services are shown as alist, and if scenario is view, product details are shown in mobile
    // details are fetched from commonservcie, and an else is provided to confirm if failed to fetch fromn common sevrcie
    if (this.scenario == 'view' || this.scenario == 'edit') {
      // this.disabledOnView = true;
      let singleProduct = this.commonService.getProductToEdit();
      if (singleProduct) {
        this.product = singleProduct;
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

  ngOnInit(): void {}
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
  //currency event handler
  currEventHander($event) {
    if ($event !== null) {
      this.crudProductForm.get('currency').setValue($event); //clear the selected customer
    }
  }

  // product category autocomplete
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
  // cancel button function
  onNoClick1(): void {
    this.dialogRef.close();
  }
  // reactive form error handling
  public errorHandling = (control: string, error: string) => {
    return this.crudProductForm.controls[control].hasError(error);
  };
  //update function
  async onUpdate() {
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
      i < this.crudProductForm.value.additionalFields.length;
      i++
    ) {
      if (this.crudProductForm.value.additionalFields[i].fieldValue) {
        if (
          this.crudProductForm.value.additionalFields[i].fieldType ==
          'date_time'
        ) {
          if (
            this.crudProductForm.value.additionalFields[i].fieldValue2 == '' ||
            this.crudProductForm.value.additionalFields[i].fieldValue2 ==
              undefined
          ) {
            this.crudProductForm.value.additionalFields[i].fieldValue2 =
              '00:00';
          }
        }
      }
      if (this.crudProductForm.value.additionalFields[i].fieldValue2) {
        var time_splitEdit =
          this.crudProductForm.value.additionalFields[i].fieldValue2.split(':');
        const date_timEditVal = new Date(
          new Date(
            this.crudProductForm.value.additionalFields[i].fieldValue
          ).getFullYear(),
          new Date(
            this.crudProductForm.value.additionalFields[i].fieldValue
          ).getMonth(),
          new Date(
            this.crudProductForm.value.additionalFields[i].fieldValue
          ).getDate(),
          Number(time_splitEdit ? time_splitEdit[0] : null),
          Number(time_splitEdit ? time_splitEdit[1] : null)
        );
        this.daTime = date_timEditVal;
      }
      //incase of only selecting timeValue,field is stored as null
      if (
        this.crudProductForm.value.additionalFields[i].fieldValue == null ||
        this.crudProductForm.value.additionalFields[i].fieldValue == ''
      ) {
        this.daTime = null;
      }
      additionalFields[i] = {
        fieldValue: this.crudProductForm.value.additionalFields[i].fieldValue2
          ? this.daTime
          : this.crudProductForm.value.additionalFields[i].fieldValue,
      };
    }
    this.serviceinst.updateProductWIthAdd(
      this.data.superUserId,
      this.product.id,
      this.crudProductForm.value.prodName,
      pCode,
      this.crudProductForm.value.prodDes,
      this.crudProductForm.value.currency
        ? this.crudProductForm.value.currency
        : 'INR',
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

    // if code/category/addi field is changed, we have to update it in items collection under sale
    if (
      this.product.hsnCode !== this.crudProductForm.value.hsnCode ||
      this.product.prodCategory !== this.crudProductForm.value.prodCategory ||
      this.product.additionalFieldsArr !== additionalFields
    ) {
      this.itemArr = [];
      let maxItems = this.data.itemMaxAllowed
        ? this.data.itemMaxAllowed
        : itemMax.MAX_ITEM;
      for (let index = 0; index < maxItems; index++) {
        await this.getAllSalesWithItems(
          this.data.superUserId,
          index,
          this.product.id
        );
        this.itemArr = this.itemArr.concat(this.sales);
      }

      this.itemArr.forEach(async (item) => {
        for (let i = 0; i < maxItems; i++) {
          if (item.itemsArray[i]?.productId === this.product.id) {
            (item.itemsArray[i].hsnCode = this.crudProductForm.value.hsnCode),
              (item.itemsArray[i].prodCategory =
                this.crudProductForm.value.prodCategory),
              (item.itemsArray[i].additionalFieldsArr = additionalFields);
          }
        }
        await this.serviceinst.updateCatNameInItem(
          this.data.superUserId,
          item.id,
          item.itemsArray
        );
      });
    }
    this._snackBar.open('Item updated', '', {
      duration: 2000,
    });
  }
  // fetch all sales with this products
  getAllSalesWithItems(userId, index, id) {
    return new Promise<void>((resolve) => {
      this.serviceinst
        .getSaleItems(userId, index, id)
        .pipe(take(1))
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
  // category selected event handler
  categorySelected($event) {
    this.crudProductForm.get('prodCategory').setValue($event.option.value); //set the selected value
  }
  // clear category function
  clearCategory() {
    this.crudProductForm.get('prodCategory').setValue(null); //set the selected value
  }
}
