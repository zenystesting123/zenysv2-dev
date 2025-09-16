import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { addFieldsArr, Customer, customFields, Profile, Sales, SubUsers } from 'src/app/data-models';
import { UserDatas } from 'src/app/model/productfeatures.model';
import { environment } from 'src/environments/environment';
import { Product } from '../product-search/product.model';
import { RazorService } from '../razor.service';
import { CustomerData, Document, DocumentData, Estimate, ItemList, ItemsList, ProductSummaryUiData, userData } from './estimate.model';
@Injectable({
  providedIn: 'root'
})
export class EstimateService {
  //for storing panel states
  billingDetailspanel: boolean = false;
  productPanel: boolean = false;
  bottomPanel: boolean = false;

  billingAmountDetailsForm: FormGroup;// billing amount details form
  productTableForm: FormGroup;// product details form
  productSummaryUiData: BehaviorSubject<ProductSummaryUiData>// product summary details form
  document: Document;//used for item calculation
  billFromForm: FormGroup;// billing form details form
  signatureAndAdditionalDetailsForm: FormGroup;// user contact details form
  docDetailsForm: FormGroup;// doc details form
  billToForm: FormGroup;// bill to details form
  additionalFieldForm: FormGroup; // form group for line item
  prevAdditionalFieldForm: FormGroup; //to store formArray values before any change
  orgID: string; //org ID of customer for which document is to be processed
  custID: string; //Customer ID of customer for which document is to be processed
  saleID: string; //sale ID of customer for which document is to be processed
  docID: string; //Document ID of document which needs to be viewed/ edited
  docType: string;
  scenario: string; // scenario for the doc(create,edit,view)
  disableSaveButton: boolean = true;
  superUserId: string; // super user id
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
  additionalFields = [this.additionalFieldModel];
  additionalFieldLength: number; //store additional fields length
  mainForm: FormGroup;// main form having doc title
  deliverdToForm: FormGroup;// delivering details form
  estimate: Estimate;// for saving document
  contDataAccessRule: string; //stores contact accesrule 
  orgDataAccessRule: string;//stores org accesrule 
  saleDataAccessRule: string;//stores sale accesrule 
  userId: string; // stores user id
  subUsers: SubUsers[] = [];// stores subuser list
  superUserBranchId: string = 'n/a'; // stores super user branch id
  estimateAutoPayLinkEnable: boolean; //for check payment link enable or not
  rzrAccountId: string;
  stripeAccountId: string;
  payLinkMode: string;
  paymentLink: any;
  userData: userData;// stores userdata
  docData: DocumentData;// stores docdata
  itemLists: ItemsList[];// store items list
  customerData: CustomerData;// store customer data
  isLoaded: boolean = false;// used to display page afret reading al data
  estimateOrgTag: boolean = false;//for check org tag required
  estimateContactTag: boolean = false;//for check contact tag required
  estimateSaleTag: boolean = false;//for check sale tag required
  daTime: any;
  formResetDisable: boolean = false;// to handle form reset issue while having changes in user 
  hsnCodeDisplay: boolean=true;// for HSN Code Display
  userName: string; //to store current user name
  deletedProducts: any = {}; //deleted items
  addedProducts: any = {}; //added items
  newProduct: boolean = false; //flag indicates addition of a new product
  //store previous values of all the forms to use in changelog
  prevBillingAmountDetailsForm : FormGroup;
  prevProductTableForm : FormGroup;
  prevBillFromForm : FormGroup;
  prevSignatureAndAdditionalDetailsForm : FormGroup;
  prevBillToForm : FormGroup;
  prevDeliverdToForm : FormGroup;
  prevDocDetailsForm : FormGroup;
  prevMainForm : FormGroup;
  constructor(private fb: FormBuilder, private firestore: AngularFirestore, public dialog: MatDialog, public rzrserv: RazorService,
  ) { 
    this.additionalFieldForm = this.fb.group({
      additionalFields: this.fb.array([]),
    })
    this.prevAdditionalFieldForm = this.fb.group({
      additionalFields: this.fb.array([]),
    })

   
  }
  get itemList(): FormArray {
    return <FormArray>this.productTableForm.get('itemList');
  }
  //for adding empty product
  addProduct() {
    this.document.itemList.push(this.createEmptyProduct());
    this.estimate.itemList.push({
      amount: 0,
      amountInclTax: 0,
      cessAmount: 0,
      cessRate: 0,
      cgstAmount: 0,
      cgstRate: 0,
      description: null,
      discountAmount: 0,
      discountRate: 0,
      discountedAmount: 0,
      hsnCode: null,
      igstAmount: 0,
      igstRate: 0,
      item: null,
      qty: 0,
      rate: 0,
      sgstAmount: 0,
      sgstRate: 0,
      slno: 0,
      unit: null,
      vatAmount: 0,
      vatRate: 0,
    });
    this.updateValues();
  }
  // create a empty product when a sale is selected and it doent have an item
  createEmptyProduct(): ItemList {
    let singleProduct: ItemList = {
      totalProductRate: 0,
      amountInclTax: 0,
      cessAmount: 0,
      cessPercentage: 0,
      cgstAmount: 0,
      cgstPercentage: 0,
      vatPercentage: 0,
      vatAmount: 0,
      description: null,
      igstAmount: 0,
      igstPercentage: 0,
      item: null,
      qty: 1,
      unit: null,
      rate: 0,
      sgstAmount: 0,
      sgstPercentage: 0,
      slno: 0,
      hsnCode: null,
      discountPercentage: 0,
      rateAfterDiscount: 0,
      amountDiscounted: 0
    }
    return singleProduct
  }
  // remove item by its position
  removeProduct(index) {
    //If an empty product is deleted, thta is not added to changelog
    if(this.estimate.itemList[index].item){
      this.deletedProducts[Object.keys(this.deletedProducts).length] = {
        'item': this.estimate.itemList[index].item,
        'index': index
      };
    }
    this.document.itemList.splice(index, 1);
    this.estimate.itemList.splice(index, 1);
    this.itemList?.removeAt(index)
    ////for changeLog purpose: Deleted products are removed from prevForm for comparing the values modified,
    //without this, you get a console error on adding new product and modifying its value
    if (this.scenario != 'create') {
      const addPrevForm = this.prevProductTableForm.get('itemList') as FormArray;
      addPrevForm.removeAt(index);
    }
    this.updateValues();
  }
  // create an empty iitem in form
  createProduct(item: ItemList): FormGroup {
    return this.fb.group({
      item: [item.item, Validators.required],
      itemErrorMessage: [item.item == null ? 'Required' : null],
      description: [item.description],
      unit: [item.unit],
      hsnCode: [item.hsnCode ? item.hsnCode : null],
      qty: [item.qty, Validators.required],
      qtyErrorMessage: [item.qty == null ? 'Required' : null],
      rate: [item.rate, Validators.required],
      rateErrorMessage: [item.rate == null ? 'Required' : null],
      sgstPercentage: [item.sgstPercentage, Validators.required],
      sgstPercentageErrorMessage: [item.sgstPercentage == null ? 'Required' : null],
      cgstPercentage: [item.cgstPercentage, Validators.required],
      cgstPercentageErrorMessage: [item.cgstPercentage == null ? 'Required' : null],
      igstPercentage: [item.igstPercentage, Validators.required],
      igstPercentageErrorMessage: [item.igstPercentage == null ? 'Required' : null],
      cessPercentage: [item.cessPercentage, Validators.required],
      cessPercentageErrorMessage: [item.cessPercentage == null ? 'Required' : null],
      discountPercentage: [item.discountPercentage, Validators.required],
      discountPercentageErrorMessage: [item.discountPercentage == null ? 'Required' : null],
      vatPercentage: [item.vatPercentage, Validators.required],
      vatPercentageErrorMessage: [item.vatPercentage == null ? 'Required' : null],
      amountInclTax: [item.amountInclTax],
      showDeleteButton: [(this.document.itemList.length > 1 == true)]
    })
  }
  // update the calulated values to ui and add visibilty for fileds and for bind values to doc used for saving
  upDateUiData() {

    this.billingAmountDetailsForm.patchValue({
      currency: this.document.billingAmountDetails.currency,
      includeUnit: this.document.billingAmountDetails.includeUnit,
      includeTax: this.document.billingAmountDetails.includeTax,
      includeDiscount: this.document.billingAmountDetails.includeDiscount,
      taxType: this.document.billingAmountDetails.taxType,
      interState: this.document.billingAmountDetails.interState,
      includeCess: this.document.billingAmountDetails.includeCess,
      showTaxtype: this.document.billingAmountDetails.includeTax == true,
      showCess: (this.document.billingAmountDetails.includeTax == true && this.document.billingAmountDetails.taxType == 'gst'),
      showIgst: (this.document.billingAmountDetails.includeTax == true && this.document.billingAmountDetails.taxType == 'gst'),
    })
    this.markAllControlsAsDirty([this.billingAmountDetailsForm]);

    this.productTableForm.patchValue({
      showUnit: this.getUnitVisibilty(),
      showDiscount: this.getDiscountVisibility(),
      showVat: this.getVatVisibility(),
      showcgst: this.getCgstVisibility(),
      showSgst: this.getSgstVisibility(),
      showIgst: this.getIgstVisibility(),
      showCess: this.getCessVisibility(),

    })
    this.markAllControlsAsDirty([this.productTableForm]);

    this.document.itemList.forEach((item, index) => {
      if (this.itemList?.at(index)) {
        this.itemList?.at(index).patchValue(
          {
            item: item.item,
            itemErrorMessage: (item.item == null || item.item == '') ? 'Required' : null,
            description: item.description,
            unit: item.unit,
            hsnCode: item.hsnCode ? item.hsnCode : null,
            qty: item.qty,
            qtyErrorMessage: item.qty == null ? 'Required' : null,
            rate: item.rate,
            rateErrorMessage: item.rate == null ? 'Required' : null,
            sgstPercentage: item.sgstPercentage,
            sgstPercentageErrorMessage: item.sgstPercentage == null ? 'Required' : null,
            cgstPercentage: item.cgstPercentage,
            cgstPercentageErrorMessage: item.cgstPercentage == null ? 'Required' : null,
            igstPercentage: item.igstPercentage,
            igstPercentageErrorMessage: item.igstPercentage == null ? 'Required' : null,
            cessPercentage: item.cessPercentage,
            cessPercentageErrorMessage: item.cessPercentage == null ? 'Required' : null,
            discountPercentage: item.discountPercentage,
            discountPercentageErrorMessage: item.discountPercentage == null ? 'Required' : null,
            vatPercentage: item.vatPercentage,
            vatPercentageErrorMessage: item.vatPercentage == null ? 'Required' : null,
            amountInclTax: item.amountInclTax,
            showDeleteButton: (this.document.itemList.length > 1 == true)
          }
        );
        
        Object.values(this.addedProducts).forEach(product => {
          if(product['index'] == index){
            product['item'] = item.item;
            const addPrevForm = this.prevProductTableForm?.get('itemList') as FormArray;
            addPrevForm?.at(index)?.patchValue(
              {
                item: item.item,
                itemErrorMessage: (item.item == null || item.item == '') ? 'Required' : null,
                description: item.description,
                unit: item.unit,
                hsnCode: item.hsnCode ? item.hsnCode : null,
                qty: item.qty,
                qtyErrorMessage: item.qty == null ? 'Required' : null,
                rate: item.rate,
                rateErrorMessage: item.rate == null ? 'Required' : null,
                sgstPercentage: item.sgstPercentage,
                sgstPercentageErrorMessage: item.sgstPercentage == null ? 'Required' : null,
                cgstPercentage: item.cgstPercentage,
                cgstPercentageErrorMessage: item.cgstPercentage == null ? 'Required' : null,
                igstPercentage: item.igstPercentage,
                igstPercentageErrorMessage: item.igstPercentage == null ? 'Required' : null,
                cessPercentage: item.cessPercentage,
                cessPercentageErrorMessage: item.cessPercentage == null ? 'Required' : null,
                discountPercentage: item.discountPercentage,
                discountPercentageErrorMessage: item.discountPercentage == null ? 'Required' : null,
                vatPercentage: item.vatPercentage,
                vatPercentageErrorMessage: item.vatPercentage == null ? 'Required' : null,
                amountInclTax: item.amountInclTax,
                showDeleteButton: (this.document.itemList.length > 1 == true)
              }
            );
        
          }
        })
              
        this.markAllControlsAsDirty([this.itemList?.at(index)]);
        
      } else {
        if(this.newProduct){
          this.addedProducts[Object.keys(this.addedProducts).length] = {
            'item': item.item,
            'index': index
          };
          //for changeLog purpose: New products are added to prevForm for comparing the values modified,
          //without this, you get a console error on adding new product and modifying its value
          if (this.scenario != 'create') {
            const addPrevForm = this.prevProductTableForm?.get('itemList') as FormArray;
            addPrevForm.push(this.createProduct(item));
          }
          this.newProduct = false;
        }
        this.itemList?.push(this.createProduct(item));
      }
    })

    let ProductSummary: ProductSummaryUiData = {
      currency: this.document.summaryData.currency,
      total: this.document.summaryData.total.toString(),
      discountTotal: this.document.summaryData.totalAmountDiscounted.toString(),
      totalAfterDiscount: this.document.summaryData.totalAfterDiscount.toString(),
      cgstTotal: this.document.summaryData.cgstValue.toString(),
      sgstTotal: this.document.summaryData.sgstValue.toString(),
      cessTotal: this.document.summaryData.cessValue.toString(),
      vatTotal: this.document.summaryData.vatValue.toString(),
      igstTotal: this.document.summaryData.igstValue.toString(),
      totalIncludingTax: this.document.summaryData.totalInclTax.toString(),
      totalAmountDiscounted: this.document.summaryData.totalAmountDiscounted.toString(),
      showDiscountTotal: this.getDiscountVisibility(),
      showTotalAfterDiscount: this.getDiscountVisibility(),
      showCgstTotal: this.getCgstVisibility(),
      showSgstTotal: this.getSgstVisibility(),
      showCessTotal: this.getCessVisibility(),
      showVatTotal: this.getVatVisibility(),
      showIgstTotal: this.getIgstVisibility(),
      showTotalIncludingTax: this.getTotalIncltaxVisibility()
    }

    this.productSummaryUiData.next(ProductSummary)
    this.updateValidCheck();
  }
  // get data from ui and ind to document used for calucations
  getDataFromUI() {
    this.document.billingAmountDetails.currency = this.billingAmountDetailsForm.value.currency;
    this.document.billingAmountDetails.includeUnit = this.billingAmountDetailsForm.value.includeUnit
    this.document.billingAmountDetails.includeTax = this.billingAmountDetailsForm.value.includeTax
    this.document.billingAmountDetails.includeDiscount = this.billingAmountDetailsForm.value.includeDiscount
    this.document.billingAmountDetails.taxType = this.billingAmountDetailsForm.value.taxType
    this.document.billingAmountDetails.interState = this.billingAmountDetailsForm.value.interState
    this.document.billingAmountDetails.includeCess = this.billingAmountDetailsForm.value.includeCess
    this.productTableForm.value.itemList.forEach((item, index) => {
      this.document.itemList[index].item = item.item;
      this.document.itemList[index].description = item.description;
      this.document.itemList[index].unit = item.unit;
      this.document.itemList[index].hsnCode = item.hsnCode ? item.hsnCode : null;
      this.document.itemList[index].qty = item.qty;
      this.document.itemList[index].rate = item.rate;
      this.document.itemList[index].sgstPercentage = item.sgstPercentage;
      this.document.itemList[index].cgstPercentage = item.cgstPercentage;
      this.document.itemList[index].igstPercentage = item.igstPercentage;
      this.document.itemList[index].cessPercentage = item.cessPercentage;
      this.document.itemList[index].discountPercentage = item.discountPercentage;
      this.document.itemList[index].vatPercentage = item.vatPercentage;
    })
    this.updateValues();
  }
  // when the form value changed calls this function for calculation of item summary 
  updateValues() {
    this.document.itemList.forEach((data, index) => {
      this.document.itemList[index].rateAfterDiscount = Math.round((this.getTotalRateAfterDiscount(data) + Number.EPSILON) * 100) / 100;
      this.document.itemList[index].sgstAmount = Math.round((this.getProductSgstAmount(data) + Number.EPSILON) * 100) / 100;
      this.document.itemList[index].cgstAmount = Math.round((this.getProductCgstAmount(data) + Number.EPSILON) * 100) / 100;
      this.document.itemList[index].igstAmount = Math.round((this.getProductIgstAmount(data) + Number.EPSILON) * 100) / 100;
      this.document.itemList[index].cessAmount = Math.round((this.getProductCessAmount(data) + Number.EPSILON) * 100) / 100;
      this.document.itemList[index].vatAmount = Math.round((this.getProductVatAmount(data) + Number.EPSILON) * 100) / 100;
      this.document.itemList[index].totalProductRate = Math.round((this.getTotalRate(data) + Number.EPSILON) * 100) / 100;
      this.document.itemList[index].amountInclTax = Math.round((this.getProductAmoutInclTax(data) + Number.EPSILON) * 100) / 100;
      this.document.itemList[index].amountDiscounted = Math.round((this.getAmountDiscounted(data) + Number.EPSILON) * 100) / 100;


      this.estimate.itemList[index].amount = this.document.itemList[index].totalProductRate;
      this.estimate.itemList[index].amountInclTax = this.document.itemList[index].amountInclTax;
      this.estimate.itemList[index].description = this.document.itemList[index].description
      this.estimate.itemList[index].hsnCode = this.document.itemList[index].hsnCode
      this.estimate.itemList[index].item = this.document.itemList[index].item
      this.estimate.itemList[index].qty = this.document.itemList[index].qty
      this.estimate.itemList[index].rate = this.document.itemList[index].rate
      this.estimate.itemList[index].slno = index
      this.estimate.itemList[index].unit = this.document.itemList[index].unit


      this.estimate.itemList[index].cessAmount = this.document.itemList[index].cessAmount
      if (this.estimate.itemList[index].cessAmount == 0) {
        this.estimate.itemList[index].cessRate = 0
      } else {
        this.estimate.itemList[index].cessRate = this.document.itemList[index].cessPercentage
      }
      this.estimate.itemList[index].cgstAmount = this.document.itemList[index].cgstAmount
      if (this.estimate.itemList[index].cgstAmount == 0) {
        this.estimate.itemList[index].cgstRate = 0
      } else {
        this.estimate.itemList[index].cgstRate = this.document.itemList[index].cgstPercentage
      }
      this.estimate.itemList[index].discountedAmount = this.document.itemList[index].amountDiscounted
      if (this.estimate.itemList[index].discountedAmount == 0) {
        this.estimate.itemList[index].discountAmount = 0
        this.estimate.itemList[index].discountRate = 0
      } else {
        this.estimate.itemList[index].discountAmount = this.document.itemList[index].rateAfterDiscount
        this.estimate.itemList[index].discountRate = this.document.itemList[index].discountPercentage
      }


      this.estimate.itemList[index].igstAmount = this.document.itemList[index].igstAmount
      if (this.estimate.itemList[index].igstAmount == 0) {
        this.estimate.itemList[index].igstRate = 0
      } else {
        this.estimate.itemList[index].igstRate = this.document.itemList[index].igstPercentage
      }


      this.estimate.itemList[index].sgstAmount = this.document.itemList[index].sgstAmount
      if (this.estimate.itemList[index].sgstAmount == 0) {
        this.estimate.itemList[index].sgstRate = 0

      } else {
        this.estimate.itemList[index].sgstRate = this.document.itemList[index].sgstPercentage

      }

      this.estimate.itemList[index].vatAmount = this.document.itemList[index].vatAmount
      if (this.estimate.itemList[index].vatAmount == 0) {
        this.estimate.itemList[index].vatRate = 0
      } else {
        this.estimate.itemList[index].vatRate = this.document.itemList[index].vatPercentage
      }

    })
    this.document.summaryData = {
      currency: this.document.billingAmountDetails.currency,
      cessValue: Math.round((this.document.itemList.reduce((accumulator, obj) => { return accumulator + obj.cessAmount; }, 0) + Number.EPSILON) * 100) / 100,
      cgstValue: Math.round((this.document.itemList.reduce((accumulator, obj) => { return accumulator + obj.cgstAmount; }, 0) + Number.EPSILON) * 100) / 100,
      vatValue: Math.round((this.document.itemList.reduce((accumulator, obj) => { return accumulator + obj.vatAmount; }, 0) + Number.EPSILON) * 100) / 100,
      igstValue: Math.round((this.document.itemList.reduce((accumulator, obj) => { return accumulator + obj.igstAmount; }, 0) + Number.EPSILON) * 100) / 100,
      sgstValue: Math.round((this.document.itemList.reduce((accumulator, obj) => { return accumulator + obj.sgstAmount; }, 0) + Number.EPSILON) * 100) / 100,
      total: Math.round((this.document.itemList.reduce((accumulator, obj) => { return accumulator + obj.totalProductRate; }, 0) + Number.EPSILON) * 100) / 100,
      totalAfterDiscount: Math.round((this.document.itemList.reduce((accumulator, obj) => { return accumulator + obj.rateAfterDiscount; }, 0) + Number.EPSILON) * 100) / 100,
      totalInclTax: Math.round((this.document.itemList.reduce((accumulator, obj) => { return accumulator + obj.amountInclTax; }, 0) + Number.EPSILON) * 100) / 100,
      totalAmountDiscounted: Math.round((this.document.itemList.reduce((accumulator, obj) => { return accumulator + obj.amountDiscounted; }, 0) + Number.EPSILON) * 100) / 100,
    }

    this.estimate.docData.cessValue = this.document.summaryData.cessValue;
    this.estimate.docData.cgstValue = this.document.summaryData.cgstValue;
    this.estimate.docData.discountValue = this.document.summaryData.totalAmountDiscounted
    this.estimate.docData.currency = this.document.billingAmountDetails.currency;
    this.estimate.docData.discountedAmount = this.document.summaryData.totalAfterDiscount
    this.estimate.docData.igstValue = this.document.summaryData.igstValue
    this.estimate.docData.includeCess = this.billingAmountDetailsForm.value.includeCess
    this.estimate.docData.includeDiscount = this.billingAmountDetailsForm.value.includeDiscount
    this.estimate.docData.includeTax = this.billingAmountDetailsForm.value.includeTax
    this.estimate.docData.includeUnit = this.billingAmountDetailsForm.value.includeUnit
    this.estimate.docData.interState = this.billingAmountDetailsForm.value.interState
    this.estimate.docData.sgstValue = this.document.summaryData.sgstValue
    this.estimate.docData.taxType = this.billingAmountDetailsForm.value.taxType
    this.estimate.docData.total = this.document.summaryData.total
    this.estimate.docData.totalInclTax = this.document.summaryData.totalInclTax
    this.estimate.docData.vatValue = this.document.summaryData.vatValue;

    this.upDateUiData();

  }
  // used to find the amount based on quantity rate ,discount and tax values
  getProductSgstAmount(data: ItemList): number {
    let sgst = 0
    if (this.document.billingAmountDetails.includeTax == true) {
      if (this.document.billingAmountDetails.taxType == 'gst') {
        if (!this.document.billingAmountDetails.interState) {
          sgst = this.getTotalRateAfterDiscount(data) * (data.sgstPercentage / 100);
        }
      }
    }
    return sgst
  }
  getProductCgstAmount(data: ItemList): number {
    let cgst = 0
    if (this.document.billingAmountDetails.includeTax == true) {
      if (this.document.billingAmountDetails.taxType == 'gst') {
        if (!this.document.billingAmountDetails.interState) {
          cgst = this.getTotalRateAfterDiscount(data) * (data.cgstPercentage / 100);
        }
      }
    }
    return cgst
  }
  getProductIgstAmount(data: ItemList): number {
    let igst = 0
    if (this.document.billingAmountDetails.includeTax == true) {
      if (this.document.billingAmountDetails.taxType == 'gst') {
        if (this.document.billingAmountDetails.interState) {
          igst = this.getTotalRateAfterDiscount(data) * (data.igstPercentage / 100);
        }
      }
    }
    return igst
  }
  getProductCessAmount(data: ItemList): number {
    let cess = 0
    if (this.document.billingAmountDetails.includeTax == true) {
      if (this.document.billingAmountDetails.taxType == 'gst') {
        if (this.document.billingAmountDetails.includeCess) {
          cess = this.getTotalRateAfterDiscount(data) * (data.cessPercentage / 100);
        }
      }
    }
    return cess
  }
  getProductVatAmount(data: ItemList): number {
    let vat = 0
    if (this.document.billingAmountDetails.includeTax == true) {
      if (this.document.billingAmountDetails.taxType == 'vat') {
        vat = this.getTotalRateAfterDiscount(data) * (data.vatPercentage / 100);

      }
    }
    return vat
  }

  getTotalRate(data: ItemList): number {
    return data.qty * data.rate
  }
  getTotalRateAfterDiscount(data: ItemList): number {
    return data.qty * this.getRateAfterDiscount(data)
  }
  getProductAmoutInclTax(data: ItemList): number {

    return this.getTotalRateAfterDiscount(data) +
      this.getProductSgstAmount(data) +
      this.getProductCgstAmount(data) +
      this.getProductIgstAmount(data) +
      this.getProductCessAmount(data) +
      this.getProductVatAmount(data)
  }
  getDiscountedTotalAmount(data: ItemList): number {
    let discountedTotalAmount
    this.getDiscountedAmount(data)
    return discountedTotalAmount
  }
  getDiscountedAmount(data: ItemList): number {
    let discountedAmount = data.rate;
    if (data.discountPercentage > 0 && this.document.billingAmountDetails.includeDiscount) {
      discountedAmount = this.getTotalRate(data) * (1 - data.discountPercentage / 100);
    }
    return discountedAmount
  }
  getRateAfterDiscount(data: ItemList): number {
    let rateAfterDiscount = data.rate;
    if (data.discountPercentage > 0 && this.document.billingAmountDetails.includeDiscount) {
      let discCalc = data.rate * (1 - data.discountPercentage / 100);
      rateAfterDiscount = discCalc
    }

    return rateAfterDiscount
  }
  getAmountDiscounted(data: ItemList): number {
    let amountDiscounted = this.getTotalRate(data) - this.getTotalRateAfterDiscount(data)
    return amountDiscounted
  }

  
  // used to set the field visibiliity getUnitVisibilty() to getTotalIncltaxVisibility().
  getUnitVisibilty() {
    return this.document.billingAmountDetails.includeUnit == true
  }
  getDiscountVisibility() {
    return this.document.billingAmountDetails.includeDiscount == true
  }
  getVatVisibility() {
    return (this.document.billingAmountDetails.includeTax == true && this.document.billingAmountDetails.taxType == 'vat')
  }
  getCgstVisibility() {
    return (this.document.billingAmountDetails.includeTax == true && this.document.billingAmountDetails.interState != true && this.document.billingAmountDetails.taxType == 'gst')
  }
  getSgstVisibility() {
    return (this.document.billingAmountDetails.includeTax == true && this.document.billingAmountDetails.interState != true && this.document.billingAmountDetails.taxType == 'gst')
  }
  getIgstVisibility() {
    return (this.document.billingAmountDetails.includeTax == true && this.document.billingAmountDetails.interState == true && this.document.billingAmountDetails.taxType == 'gst')
  }
  getCessVisibility() {
    return (this.document.billingAmountDetails.includeTax == true && this.document.billingAmountDetails.includeCess == true && this.document.billingAmountDetails.taxType == 'gst')
  }
  getTotalIncltaxVisibility() {
    return this.document.billingAmountDetails.includeTax == true
  }
  // if item is selected bind items values to document and call updateValues() to set calcutions and the bind values to ui
  setProduct(index: number, product: Product) {
    
    this.document.itemList[index].item = product.itemName;
    this.document.itemList[index].description = product.description;
    this.document.itemList[index].unit = product.unit;
    this.document.itemList[index].hsnCode = product.hsnCode ? product.hsnCode : null;
    this.document.itemList[index].rate = product.rate;
    this.document.itemList[index].sgstPercentage = product.sgstPercentage;
    this.document.itemList[index].cgstPercentage = product.cgstPercentage;
    this.document.itemList[index].igstPercentage = product.igstPercentage;
    this.document.itemList[index].discountPercentage = product.discountPercentage;
    this.document.itemList[index].vatPercentage = product.vatPercentage;
    if (product.discountPercentage > 0) {
      this.document.billingAmountDetails.includeDiscount = true
      this.billingAmountDetailsForm.patchValue({ includeDiscount: true })
      this.billingAmountDetailsForm.get('includeDiscount').markAsDirty();

    }
    this.updateValues();
  }
  // get logo url
  updateLogo(superuserData: Profile) {
    let logo = null
    if (superuserData.logoStatus) {
      // if logo status is true get logo from storage
      const userStorageRef1 = firebase.default
        .storage()
        .ref()
        .child('logo/' + superuserData.superUserId);
      userStorageRef1.getDownloadURL().then((url1) => {
        logo = url1;
        this.billFromForm.patchValue({
          logo: logo,
        })
        this.billFromForm.get('logo').markAsDirty();
      });
    }
  }
  // get signature url
  updateSignature(superuserData: Profile) {
    let signature = null
    if (superuserData.signStatus) {
      // if logo status is true get logo from storage
      const userStorageRef1 = firebase.default
        .storage()
        .ref()
        .child('sign/' + superuserData.superUserId);
      userStorageRef1.getDownloadURL().then((url1) => {
        signature = url1;
        this.signatureAndAdditionalDetailsForm.patchValue({
          signature: signature,
        })
        this.signatureAndAdditionalDetailsForm.get('signature').markAsDirty();
      });
    }
  }
  // if org/customer is there then bind its address values in bill to form

  billToFormPatchValueForAddress(data) {
    this.billToForm.patchValue({
      billToCompanyName: data.companyName ? data.companyName : null,
      billToAddressline1: data.billingaddress1,
      billToAddressline2: data.billingaddress2,
      billToDistrict: data.district,
      billToPinCode: data.bpin,
      billToState: data.state,
      billToCountry: data.country,
      billToCountryCode: data.code ? data.code : '+91',
      billToContactNumber: data.contactNo ? data.contactNo : null,
      billToEmail: data.email ? data.email : null,
      billToGst: data.taxId
    })
    this.markAllControlsAsDirty([this.billToForm]);

  } 
  //To mark all controls of the form as dirty
  markAllControlsAsDirty(abstractControls: AbstractControl[]): void {
    abstractControls.forEach((abstractControl) => {
      if (abstractControl instanceof FormControl) {
        (abstractControl as FormControl).markAsDirty({ onlySelf: true });
      } else if (abstractControl instanceof FormGroup) {
        this.markAllControlsAsDirty(
          Object.values((abstractControl as FormGroup).controls)
        );
      } else if (abstractControl instanceof FormArray) {
        this.markAllControlsAsDirty((abstractControl as FormArray).controls);
      }
    });
  }

  // if org/customer is removed the bind empty values to address
  billToFormPatchEmptyValueForAddress() {
    this.billToForm.patchValue({
      billToCompanyName: '',
      billToAddressline1: '',
      billToAddressline2: '',
      billToDistrict: '',
      billToPinCode: '',
      billToState: '',
      billToCountry: '',
      billToCountryCode: '',
      billToContactNumber: '',
      billToEmail: '',
      billToGst: '',
    })
    this.markAllControlsAsDirty([this.billToForm]);
  }
  // additional field create scenario
  createItemFormGroupDefault() {
    //push additional fields data to FormArray
    this.additionalFields?.forEach((field) => {
      if (field.fieldType == 'date') {
        if (field.mandatory == true) {
          (this.additionalFieldForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [
                field.defaultValue ? field.defaultValue.toDate() : '',
                Validators.required,
              ],
              fieldName: field.fieldName,
            })
          );
        } else if (field.mandatory == false) {
          (this.additionalFieldForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [
                field.defaultValue ? field.defaultValue.toDate() : '',
              ],
              fieldName: field.fieldName,
            })
          );
        }
      }
      else if (field.fieldType == 'date_time') {
        if (field.mandatory == true) {
          (this.additionalFieldForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [
                field.defaultValue ? field.defaultValue.toDate() : null,
                Validators.required,
              ],
              fieldValue2: [
                field.defaultValue
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
        } else if (field.mandatory == false) {
          (this.additionalFieldForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [
                field.defaultValue ? field.defaultValue.toDate() : null,
              ],
              fieldValue2: [
                field.defaultValue
                  ? new Date(field.defaultValue.seconds * 1e3)
                      .toString()
                      .split(' ')[4]
                  : '',
              ],
              fieldName: field.fieldName,
              fieldType: field.fieldType,
            })
          );
        }
      }
       else {
        if (field.mandatory == true) {                                                                                                                                            
          (this.additionalFieldForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.defaultValue, Validators.required],
              fieldName: field.fieldName,
            })
          );
        } else if (field.mandatory == false) {
          (this.additionalFieldForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.defaultValue],
              fieldName: field.fieldName,
            })
          );
        }
      }
    });
  }
  // additional field edit scenario
  createItemFormGroupEdit(additionalFieldsArr) {
    
    let addFieldsArray = additionalFieldsArr;
    if (additionalFieldsArr) {
      const addFieldsLength = Object.keys(
        addFieldsArray
      ).length;
      for (let i = 0; i < this.additionalFields?.length; i++) {
        this.additionalFields[i].value = '';
      }
      if (addFieldsLength != 0) {
        //getting values pushed to field array
        for (let i = 0; i < addFieldsLength; i++) {
          this.additionalFields[i].value =
            addFieldsArray[i].fieldValue;
        }
      }
    } else {
      for (let i = 0; i < this.additionalFields?.length; i++) {
        this.additionalFields[i].value = '';
      }
    }
    // this.additionalFieldForm = this.fb.group({
    //   additionalFields: this.fb.array([]),
    // })
    //push additional fields data to FormArray
    this.additionalFields?.forEach((field) => {
      if (field.fieldType == 'date') {
        // field.value=field.value
        if (field.mandatory == true) {
          let val = field.value
          if (val?.seconds != undefined) {
            (this.additionalFieldForm.get('additionalFields') as FormArray).push(
              this.fb.group({
                fieldValue: [
                  field.value ? field.value.toDate() : '',
                  Validators.required,
                ],
                fieldName: field.fieldName,
              })
            );
          } else {
            (this.additionalFieldForm.get('additionalFields') as FormArray).push(
              this.fb.group({
                fieldValue: [
                  field.value ? field.value : '',
                  Validators.required,
                ],
                fieldName: field.fieldName,
              })
            );
          }
          
        } else if (field.mandatory == false) {
          let val = field.value
          if (val?.seconds != undefined) {
            (this.additionalFieldForm.get('additionalFields') as FormArray).push(
              this.fb.group({
                fieldValue: [field.value ? field.value.toDate() : ''],
                fieldName: field.fieldName,
              })
            );
          } else {
            (this.additionalFieldForm.get('additionalFields') as FormArray).push(
              this.fb.group({
                fieldValue: [field.value ? field.value : ''],
                fieldName: field.fieldName,
              })
            );
          }

        }
      }
      else if (field.fieldType == 'date_time') {
        if (field.mandatory == true) {
          (this.additionalFieldForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [
                field.value ? field.value.toDate() : null,
                Validators.required,
              ],
              fieldValue2: [
                field.value
                  ? new Date(field.value.seconds * 1e3).toString().split(' ')[4]
                  : '',
                Validators.required,
              ],
              fieldName: field.fieldName,
              fieldType: field.fieldType,
            })
          );
        } else if (field.mandatory == false) {
          (this.additionalFieldForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.value ? field.value.toDate() : null],
              fieldValue2: [
                field.value
                  ? new Date(field.value.seconds * 1e3).toString().split(' ')[4]
                  : '',
              ],
              fieldName: field.fieldName,
              fieldType: field.fieldType,
            })
          );
        }

      } 
      else {
        if (field.mandatory == true) {
          (this.additionalFieldForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.value, Validators.required],
              fieldName: field.fieldName,
            })
          );
        } else if (field.mandatory == false) {
          (this.additionalFieldForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.value],
              fieldName: field.fieldName,
            })
          );
        }
      }
    });

    //push additional fields data to previous from as well since we cannot take a deep copy of formarray
    this.additionalFields?.forEach((field) => {
      if (field.fieldType == 'date') {
        // field.value=field.value
        if (field.mandatory == true) {
          let val = field.value
          if (val?.seconds != undefined) {
            (this.prevAdditionalFieldForm.get('additionalFields') as FormArray).push(
              this.fb.group({
                fieldValue: [
                  field.value ? field.value.toDate() : '',
                  Validators.required,
                ],
                fieldName: field.fieldName,
              })
            );
          } else {
            (this.prevAdditionalFieldForm.get('additionalFields') as FormArray).push(
              this.fb.group({
                fieldValue: [
                  field.value ? field.value : '',
                  Validators.required,
                ],
                fieldName: field.fieldName,
              })
            );
          }
          
        } else if (field.mandatory == false) {
          let val = field.value
          if (val?.seconds != undefined) {
            (this.prevAdditionalFieldForm.get('additionalFields') as FormArray).push(
              this.fb.group({
                fieldValue: [field.value ? field.value.toDate() : ''],
                fieldName: field.fieldName,
              })
            );
          } else {
            (this.prevAdditionalFieldForm.get('additionalFields') as FormArray).push(
              this.fb.group({
                fieldValue: [field.value ? field.value : ''],
                fieldName: field.fieldName,
              })
            );
          }

        }
      }
      else if (field.fieldType == 'date_time') {
        if (field.mandatory == true) {
          (this.prevAdditionalFieldForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [
                field.value ? field.value.toDate() : null,
                Validators.required,
              ],
              fieldValue2: [
                field.value
                  ? new Date(field.value.seconds * 1e3).toString().split(' ')[4]
                  : '',
                Validators.required,
              ],
              fieldName: field.fieldName,
              fieldType: field.fieldType,
            })
          );
        } else if (field.mandatory == false) {
          (this.prevAdditionalFieldForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.value ? field.value.toDate() : null],
              fieldValue2: [
                field.value
                  ? new Date(field.value.seconds * 1e3).toString().split(' ')[4]
                  : '',
              ],
              fieldName: field.fieldName,
              fieldType: field.fieldType,
            })
          );
        }

      } 
      else {
        if (field.mandatory == true) {
          (this.prevAdditionalFieldForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.value, Validators.required],
              fieldName: field.fieldName,
            })
          );
        } else if (field.mandatory == false) {
          (this.prevAdditionalFieldForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.value],
              fieldName: field.fieldName,
            })
          );
        }
      }
    });
    
  }
  //Get the information passed on to the module using router link
  getUrlInfo(val) {
    this.scenario = val.scn; // scenarion for document
    this.orgID = val.orgID; // customer id
    this.custID = val.custID // customer id
    this.saleID = val.saleID// sale id
    this.docID = val.docID // document id
    this.docType = val.docType // document type
    if (this.scenario == 'create') {
      this.createItemFormGroupDefault()
    } 
    else{
      this.createItemFormGroupEdit(this.additionalFields);
    }
  }
  // update user details in doc form and get data need for doc creation/edit
  updateFormDetailsFromUserdata(allData: UserDatas) {
    this.superUserId = allData.userDetails.superUserId;
    this.userId = allData.userId;
    //get user name
    this.userName = allData.userDetails.lastname
    ? allData.userDetails.firstname + ' ' + allData.userDetails.lastname
    : allData.userDetails.firstname;

    this.subUsers = allData.subUsers;

    this.estimateOrgTag = allData.superUserDetails.estimateOrgTag ? allData.superUserDetails.estimateOrgTag : false
    this.estimateContactTag = allData.superUserDetails.estimateContactTag ? allData.superUserDetails.estimateContactTag : false
    this.estimateSaleTag = allData.superUserDetails.estimateSaleTag ? allData.superUserDetails.estimateSaleTag : false

    if (allData.superUserDetails.hsnCodeDisplay) {
      this.hsnCodeDisplay = allData.superUserDetails.hsnCodeDisplay.estimate
    }
    if (allData.superUserDetails.fieldNames) {
      this.deliverdToForm.patchValue({ fieldNameContact: allData.superUserDetails.fieldNames.fieldNameContact ? allData.superUserDetails.fieldNames.fieldNameContact : 'Contact' })
      this.deliverdToForm.patchValue({ fieldNameOrg: allData.superUserDetails.fieldNames.fieldNameOrganization ? allData.superUserDetails.fieldNames.fieldNameOrganization : 'Organization' })
      this.billToForm.patchValue({ fieldNameContact: allData.superUserDetails.fieldNames.fieldNameContact ? allData.superUserDetails.fieldNames.fieldNameContact : 'Contact' })
      this.billToForm.patchValue({ fieldNameSale: allData.superUserDetails.fieldNames.fieldNameSale ? allData.superUserDetails.fieldNames.fieldNameSale : 'Sale' })
      this.billToForm.patchValue({ fieldNameOrganization: allData.superUserDetails.fieldNames.fieldNameOrganization ? allData.superUserDetails.fieldNames.fieldNameOrganization : 'Organization' })
    }
   
    this.estimateAutoPayLinkEnable = (!!allData.superUserDetails.estimateAutoPayLinkEnable)
    if (allData.usrProfileData) {
      this.contDataAccessRule = allData.usrProfileData.contactDataAccessRule ? allData.usrProfileData.contactDataAccessRule : 'Own';
      this.orgDataAccessRule = allData.usrProfileData.orgDataAccessRule ? allData.usrProfileData.orgDataAccessRule : 'Own';
      this.saleDataAccessRule = allData.usrProfileData.saleDataAccessRule ? allData.usrProfileData.saleDataAccessRule : 'Own';
    }
    if (allData.superUserDetails.associatedBranch) {
      this.superUserBranchId = allData.superUserDetails.associatedBranch
    }
    this.rzrAccountId = allData.superUserDetails?.rzrAccountId;
    this.stripeAccountId = allData.superUserDetails?.stripeAccountId;
    this.payLinkMode = allData.superUserDetails?.payLinkMode
    if (this.scenario == 'create' &&  !this.formResetDisable) {
      this.formResetDisable=true;
      //getting additional field
      this.additionalFields =allData.superUserDetails.customFieldsEstimate;
      this.additionalFieldLength = this.additionalFields?.length;
      this.estimate.createdBy = allData.userId;
      this.mainForm.patchValue({ docTitle: allData.superUserDetails.fieldNames?.fieldNameEstimate ? allData.superUserDetails.fieldNames?.fieldNameEstimate : 'Estimate' })
      this.docDetailsForm.patchValue({ docTitle: allData.superUserDetails.fieldNames?.fieldNameEstimate ? allData.superUserDetails.fieldNames?.fieldNameEstimate : 'Estimate' })

      this.getPrefixAndDocNumber(allData.superUserDetails.estimateNumberPrefix, allData.superUserDetails.estimateNoLast)
      this.createItemFormGroupDefault();
      if (allData.superUserDetails?.estimateApproval) {
        this.estimate.docData.statusApproved = false;
      } else {
        this.estimate.docData.statusApproved = true;
      }
      if (this.custID == 'none') {
        this.custID = null

      }
      if (this.docID == 'none') {
        this.docID = null

      }
      if (this.orgID == 'none') {
        this.orgID = null

      }
      if (this.saleID == 'none') {
        this.saleID = null
      }
      this.isLoaded = true
    }

    this.updateLogo(allData.superUserDetails)
    this.updateSignature(allData.superUserDetails)
  }
  // update values on edit mode
  updateEditalue(data) {
    this.estimate.docData.docTitle = data.docData?.docTitle;
    this.estimate.createdBy = data?.createdBy;
    this.estimate.sharedDocId = data?.sharedDocId;
    this.saleID = data.docData?.saleID; // bind sale id
    this.custID = data.customerData?.custID; // bind customer id
    this.orgID = data.customerData?.orgID; // bind orgID 
    this.userData = data?.userData;
    this.docData = data?.docData;
    this.customerData = data?.customerData;
    this.itemLists = data?.itemList
    this.paymentLink = data?.paymentLink;
    this.createItemFormGroupEdit(data?.additionalFieldsArr)
    this.estimate.itemList = []
    this.itemLists?.forEach((item, index) => {
      this.document.itemList[index] = this.createEmptyProduct()
      this.document.itemList[index].totalProductRate = item.amount,
        this.document.itemList[index].amountInclTax = item.amountInclTax,
        this.document.itemList[index].cessAmount = item.cessAmount,
        this.document.itemList[index].cessPercentage = item.cessRate,
        this.document.itemList[index].cgstAmount = item.cgstAmount,
        this.document.itemList[index].cgstPercentage = item.cgstRate,
        this.document.itemList[index].vatPercentage = item.vatRate,
        this.document.itemList[index].vatAmount = item.vatAmount,
        this.document.itemList[index].description = item.description,
        this.document.itemList[index].igstAmount = item.igstAmount,
        this.document.itemList[index].igstPercentage = item.igstRate,
        this.document.itemList[index].item = item.item,
        this.document.itemList[index].qty = item.qty,
        this.document.itemList[index].unit = item.unit,
        this.document.itemList[index].rate = item.rate,
        this.document.itemList[index].sgstAmount = item.sgstAmount,
        this.document.itemList[index].sgstPercentage = item.sgstRate,
        this.document.itemList[index].slno = item.slno,
        this.document.itemList[index].hsnCode = item.hsnCode ? item.hsnCode : null,
        this.document.itemList[index].discountPercentage = item.discountRate,
        this.document.itemList[index].rateAfterDiscount = item.discountAmount,
        this.document.itemList[index].amountDiscounted = item.discountedAmount
      if (item.discountRate > 0) {
        this.document.billingAmountDetails.includeDiscount = true
        this.billingAmountDetailsForm.patchValue({ includeDiscount: true })
        this.billingAmountDetailsForm.get('includeDiscount').markAsDirty();
      }
      this.estimate.itemList.push(
        {
          amount: 0,
          amountInclTax: 0,
          cessAmount: 0,
          cessRate: 0,
          cgstAmount: 0,
          cgstRate: 0,
          description: null,
          discountAmount: 0,
          discountRate: 0,
          discountedAmount: 0,
          hsnCode: null,
          igstAmount: 0,
          igstRate: 0,
          item: null,
          qty: 0,
          rate: 0,
          sgstAmount: 0,
          sgstRate: 0,
          slno: 0,
          unit: null,
          vatAmount: 0,
          vatRate: 0,
        })
    })
    this.updateValues();
    this.isLoaded = true;
  }
  // calls when doc title changed
  onDocTitleChange() {
    this.docDetailsForm.patchValue({ docTitle: this.mainForm.value.docTitle })
    this.docDetailsForm.get('docTitle').markAsDirty();
  }
  // used to update panel state
  updatePanleState(billingDetailspanel: boolean, productPanel: boolean, bottomPanel: boolean) {
    this.billingDetailspanel = billingDetailspanel;
    this.productPanel = productPanel;
    this.bottomPanel = bottomPanel;
  }
  // check if all form is valid or not  
  updateValidCheck() {
    if (this.billingAmountDetailsForm.valid &&
      this.productTableForm.valid && this.billFromForm.valid && this.mainForm.valid &&
      this.signatureAndAdditionalDetailsForm.valid && this.docDetailsForm.valid &&
      this.billToForm.valid && this.additionalFieldForm.valid && this.deliverdToForm.valid
    ) {
      this.disableSaveButton = false
    } else {
      this.disableSaveButton = true
    }
  }
 
  // for getting value changes for all form
  formValueChanges() {
    this.billFromForm.valueChanges.subscribe((data) => {
      this.bindUserAddressData(this.billFromForm.value);
      this.updateValidCheck()
    })
    this.signatureAndAdditionalDetailsForm.valueChanges.subscribe((data) => {
      this.bindUserData();
      this.updateValidCheck()
    })
    this.mainForm.valueChanges.subscribe((data) => {
      this.estimate.docData.docTitle = this.mainForm.value.docTitle
      this.updateValidCheck()
    })

    this.docDetailsForm.valueChanges.subscribe((data) => {
      this.bindDocData()
      this.updateValidCheck()
    })
    this.billToForm.valueChanges.subscribe((data) => {
      this.bindCustomerData();
      this.updateValidCheck()
    })
    this.additionalFieldForm.valueChanges.subscribe((data) => {
      this.updateValidCheck()
    })
    this.deliverdToForm.valueChanges.subscribe((data) => {
      this.bindDeliveryData();
      this.updateValidCheck()
    })
  }
  // bind data document array as per the form value is changing
  bindAddtionalDetails() {
    let additionalFields = <addFieldsArr>{};
    let fromArray = this.additionalFieldForm.get('additionalFields') as FormArray;
    fromArray.controls.forEach((control, index) => {
      if (fromArray.at(index).value.fieldValue) {
        if (fromArray.at(index).value.fieldType == 'date_time') {
          if (
            fromArray.at(index).value.fieldValue2 == '' ||
            fromArray.at(index).value.fieldValue2 == undefined
          ) {
            fromArray.at(index).value.fieldValue2 = '00:00';
          }
        }
      }
      if (fromArray.at(index).value.fieldValue2) {
        var time_splitEdit = fromArray.at(index).value.fieldValue2.split(':');
        const date_timEditVal = new Date(
          new Date(fromArray.at(index).value.fieldValue).getFullYear(),
          new Date(fromArray.at(index).value.fieldValue).getMonth(),
          new Date(fromArray.at(index).value.fieldValue).getDate(),
          Number(time_splitEdit ? time_splitEdit[0] : null),
          Number(time_splitEdit ? time_splitEdit[1] : null)
        );
        this.daTime = date_timEditVal;
      }
      //incase of only selecting timeValue,field is stored as null
      if(fromArray.at(index).value.fieldValue == null || fromArray.at(index).value.fieldValue == '' ){
        this.daTime = null;
      }
      additionalFields[index] = {
        fieldValue: control.value.fieldValue2
          ? this.daTime
          : control.value.fieldValue,
      };
    });
    this.estimate.additionalFieldsArr = []
    this.estimate.additionalFieldsArr = additionalFields
  }
  bindCustomerData() {
    this.estimate.customerData.addressline1 = this.billToForm.value.billToAddressline1;
    this.estimate.customerData.addressline2 = this.billToForm.value.billToAddressline2;
    this.estimate.customerData.companyName = this.billToForm.value.billToCompanyName;
    this.estimate.customerData.contactNumber = this.billToForm.value.billToContactNumber ? this.billToForm.value.billToContactNumber + '' : this.billToForm.value.billToContactNumber;
    this.estimate.customerData.country = this.billToForm.value.billToCountry;
    this.estimate.customerData.countryCode = this.billToForm.value.billToCountryCode;
    this.estimate.customerData.district = this.billToForm.value.billToDistrict;
    this.estimate.customerData.email = this.billToForm.value.billToEmail;
    this.estimate.customerData.fname1 = this.billToForm.value.billToFname1;
    this.estimate.customerData.gst = this.billToForm.value.billToGst;
    this.estimate.customerData.pinCode = this.billToForm.value.billToPinCode;
    this.estimate.customerData.sname = this.billToForm.value.billToSname;
    this.estimate.customerData.state = this.billToForm.value.billToState;
    this.estimate.customerData.surname = this.billToForm.value.billToSurname;
    this.estimate.searchTerm.firstName = this.billToForm.value.billToFname1 ? this.billToForm.value.billToFname1.toLowerCase() : ''
    this.estimate.searchTerm.secondName = this.billToForm.value.billToSname ? this.billToForm.value.billToSname.toLowerCase() : ''
    this.estimate.searchTerm.surname = this.billToForm.value.billToSurname ? this.billToForm.value.billToSurname.toLowerCase() : ''
    this.estimate.searchTerm.companyName = this.billToForm.value.billToCompanyName ? this.billToForm.value.billToCompanyName.toLowerCase() : ''
  }
  bindDeliveryData() {
    this.estimate.customerData.isDeliveryAddressPresent = this.deliverdToForm.value.isDeliveryAddressPresent;
    this.estimate.customerData.deliveryAddressline1 = this.deliverdToForm.value.deliveryAddressline1;
    this.estimate.customerData.deliveryAddressline2 = this.deliverdToForm.value.deliveryAddressline2;
    this.estimate.customerData.deliveryContactName = this.deliverdToForm.value.deliveryContactName;
    this.estimate.customerData.deliveryCompanyName = this.deliverdToForm.value.deliveryCompanyName;
    this.estimate.customerData.deliveryEmail = this.deliverdToForm.value.deliveryEmail;
    this.estimate.customerData.deliveryContactNumber = this.deliverdToForm.value.deliveryContactNumber ? this.deliverdToForm.value.deliveryContactNumber + '' : this.deliverdToForm.value.deliveryContactNumber;
    this.estimate.customerData.deliverycountryCode = this.deliverdToForm.value.deliverycountryCode;
    this.estimate.customerData.deliveryCountry = this.deliverdToForm.value.deliveryCountry;
    this.estimate.customerData.deliveryDistrict = this.deliverdToForm.value.deliveryDistrict;
    this.estimate.customerData.deliveryPinCode = this.deliverdToForm.value.deliveryPinCode;
    this.estimate.customerData.deliveryState = this.deliverdToForm.value.deliveryState;
  }
  bindUserAddressData(data) {
    this.estimate.userData.addressline1 = this.billFromForm.value.billFromAddressline1;
    this.estimate.userData.addressline2 = this.billFromForm.value.billFromAddressline2;
    this.estimate.userData.city = this.billFromForm.value.billFromCity;
    this.estimate.userData.companyName = this.billFromForm.value.billFromCompanyName;
    this.estimate.userData.contactname = this.billFromForm.value.billFromContactname;
    this.estimate.userData.country = this.billFromForm.value.billFromCountry;
    this.estimate.userData.gst = this.billFromForm.value.billFromGst;
    this.estimate.userData.pinCode = this.billFromForm.value.billFromPinCode;
    // this.estimate.userData.secondName = this.billFromForm.value.secondName;
    this.estimate.userData.state = this.billFromForm.value.billFromState;
  }
  bindUserData() {
    this.estimate.userData.contactno = this.signatureAndAdditionalDetailsForm.value.signatoryContactno ? this.signatureAndAdditionalDetailsForm.value.signatoryContactno + '' : this.signatureAndAdditionalDetailsForm.value.signatoryContactno;
    this.estimate.userData.designation = this.signatureAndAdditionalDetailsForm.value.designation;
    this.estimate.userData.email = this.signatureAndAdditionalDetailsForm.value.signatoryEmail;
    this.estimate.userData.signatoryName = this.signatureAndAdditionalDetailsForm.value.signatoryName;
    this.estimate.docData.bankDetails = this.signatureAndAdditionalDetailsForm.value.bankDetails;
    this.estimate.docData.notes = this.signatureAndAdditionalDetailsForm.value.notes;
  }
  bindDocData() {
    this.estimate.docData.docDate = this.docDetailsForm.value.docDate;
    this.estimate.docData.docValidity = this.docDetailsForm.value.docValidity;
  }
  // update item based on selected sale items
  updateItem(saleItemList) {
    this.document.itemList.forEach((element, index) => {
      this.itemList?.removeAt(index)
    });
    if (saleItemList?.length > 0) {
      let itemList: ItemList[] = []
      this.document.itemList = itemList
      this.estimate.itemList = []
      saleItemList?.forEach((element, index) => {
        itemList[index] = this.createEmptyProduct()
        itemList[index].item = element.prodName;
        itemList[index].qty = element.quantity;
        itemList[index].description = element.prodDes;
        itemList[index].unit = element.unit;
        itemList[index].rate = element.unitPrice;
        itemList[index].sgstPercentage = element.sgst;
        itemList[index].cgstPercentage = element.cgst;
        itemList[index].igstPercentage = element.igst;
        itemList[index].discountPercentage = element.discount;
        itemList[index].vatPercentage = element.vatRate;
        itemList[index].hsnCode = element.hsnCode ? element.hsnCode : null;
        if (element.discount > 0) {
          this.document.billingAmountDetails.includeDiscount = true
          this.billingAmountDetailsForm.patchValue({ includeDiscount: true })
          this.billingAmountDetailsForm.get('includeDiscount').markAsDirty();
        }
        this.estimate.itemList.push(
          {
            amount: 0,
            amountInclTax: 0,
            cessAmount: 0,
            cessRate: 0,
            cgstAmount: 0,
            cgstRate: 0,
            description: null,
            discountAmount: 0,
            discountRate: 0,
            discountedAmount: 0,
            hsnCode: null,
            igstAmount: 0,
            igstRate: 0,
            item: null,
            qty: 0,
            rate: 0,
            sgstAmount: 0,
            sgstRate: 0,
            slno: 0,
            unit: null,
            vatAmount: 0,
            vatRate: 0,
          })
      });
      this.document.itemList = itemList
    } else {
      this.document.itemList = [this.createEmptyProduct()]
      this.estimate.itemList = [{
        amount: 0,
        amountInclTax: 0,
        cessAmount: 0,
        cessRate: 0,
        cgstAmount: 0,
        cgstRate: 0,
        description: null,
        discountAmount: 0,
        discountRate: 0,
        discountedAmount: 0,
        hsnCode: null,
        igstAmount: 0,
        igstRate: 0,
        item: null,
        qty: 0,
        rate: 0,
        sgstAmount: 0,
        sgstRate: 0,
        slno: 0,
        unit: null,
        vatAmount: 0,
        vatRate: 0,
      }]
    }
    this.updateValues();
  }
  //if the form is not valid mark the invalid field
  markFormTouched() {
    if (!this.billingAmountDetailsForm.valid) {
      this.billingAmountDetailsForm.markAllAsTouched();
    }
    if (!this.productTableForm.valid) {
      this.productTableForm.markAllAsTouched();
    }
    if (!this.billFromForm.valid) {
      this.billFromForm.markAllAsTouched();
    }
    if (!this.mainForm.valid) {
      this.mainForm.markAllAsTouched();
    }
    if (!this.signatureAndAdditionalDetailsForm.valid) {
      this.signatureAndAdditionalDetailsForm.markAllAsTouched();
    }
    if (!this.docDetailsForm.valid) {
      this.docDetailsForm.markAllAsTouched();
    }
    if (!this.billToForm.valid) {
      this.billToForm.markAllAsTouched();
    }
    if (!this.additionalFieldForm.valid) {
      this.additionalFieldForm.markAllAsTouched();
    }
    if (!this.deliverdToForm.valid) {
      this.deliverdToForm.markAllAsTouched();
    }
  }
  //set prefix and docnumber
  getPrefixAndDocNumber(prefix, estimateNoLast) {
    if (!prefix) {
      prefix = '';
    }
    let docNumber = 0;
    if (estimateNoLast) {
      docNumber = estimateNoLast;
    }
    this.docDetailsForm.patchValue({
      prefixAndDocNumber: prefix + (docNumber + 1)
    })
    this.docDetailsForm.get('prefixAndDocNumber').markAsDirty();
    let num = docNumber + 1
    this.estimate.docData.docNumber = num.toString()
    this.estimate.docData.docPrefix = prefix
    this.estimate.docData.prefixAndDocNumber = prefix + (docNumber + 1)
  }
  getCustomerDetails(custId: string) {
    return this.firestore
      .doc<Customer>('users/' + this.superUserId + '/customers/' + custId)
      .valueChanges()
  }
  getOrgDetails(orgId: string) {
    return this.firestore
      .doc<Customer>('users/' + this.superUserId + '/Organisations/' + orgId)
      .valueChanges()
  }
  getSaleDetails(saleId: string) {
    return this.firestore
      .doc<Sales>('users/' + this.superUserId + '/sales/' + saleId)
      .valueChanges()
  }
  // get document details for edit
  getDocumentDetails(userId, docId) {
    return this.firestore
      .doc<any>('users/' + userId + '/Estimates/' + docId)
      .valueChanges();
  }
  createDocument(changeLog) {
    return this.firestore
      .collection('users/' + this.superUserId + '/Estimates/')
      .add({
        ...this.estimate, changeLog
      })
  }
  editDocument(changeLog) {
    if(Object.keys(changeLog).length > 0)
      return this.firestore.collection('users/' + this.superUserId + '/Estimates/')
        .doc(this.docID)
        .set({
          ...this.estimate, changeLog
        })
    else
      return this.firestore.collection('users/' + this.superUserId + '/Estimates/')
      .doc(this.docID)
      .set({
        ...this.estimate
      })
  }
  updateDocNo(userId, keyValuePair: {}) {
    return this.firestore.doc<Profile>('users/' + userId).update(keyValuePair);
  }
  createSharedDoc(userID, documentId, docType) {
    return this.firestore.collection('sharedDocument').add({
      docId: documentId,
      userId: userID,
      docType: docType
    })
  }
  UpdateshareDocumentId(superUserId, docID, docType, sharedId) {
    return this.firestore
      .doc('users/' + superUserId + '/Estimates/' + docID)
      .update({ sharedDocId: 'https://' + environment.docViewerDomain + '/docview/' + sharedId });
  }
  getCustdetails(userId: string, customerId: string) {
    return this.firestore
      .doc<any>('users/' + userId + '/customers/' + customerId)
      .get();
  }
  updateDocafterLinkcreation(userId, docnumber, paymentLink, type) {
    return this.firestore
      .collection('users/' + userId + '/' + type + 's/')
      .doc(docnumber)
      .update({ paymentLink: paymentLink });
  }
  sendEmail(data) {
    return this.firestore.collection('email/').add(data);
  }
  savepaymentLink(data, paymentLinkid) {
    return this.firestore
      .collection('paymentLinks')
      .doc(paymentLinkid)
      .set(data);
  }
  makeShortUrl(superUserId, docID, type) {
    return this.firestore.collection("urls").doc("" + superUserId + "-" + docID + "-" + type).set(
      { url: environment.currentUrl + "stripe/stripeCheckout/" + superUserId + "/" + docID + "/" + type })
  }
  getShortUrl(superUserId, docID, type) {
    return this.firestore.collection("urls").doc("" + superUserId + "-" + docID + "-" + type).valueChanges()
  }
}
