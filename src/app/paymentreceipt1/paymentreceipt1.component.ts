/*********************************************************************************
Description: component used for payment CRU operation
Inputs: get payment datas while updating
Outputs:
***********************************************************************************/
import { HostListener, OnDestroy } from '@angular/core';
import { Paymentreceipt1Service } from './paymentreceipt1.service';
import {
  DialogData1,
  SalesdetailsComponent,
} from '../sales-view/salesdetails/salesdetails.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  Sales,
  PaymentReceipt,
  Customer,
  Profile,
  Invoice,
  defaultPaymentSettings,
  paymentSettings,
  customFields,
  addFieldsArr,
} from './../data-models';
import { take, takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NetworkCheckService } from '../networkcheck.service';
import { CommonService } from '../common.service';
import { Currencies } from '../currencies';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { HttpClient } from '@angular/common/http';
import { ChangeLogComponent } from '../change-log/change-log.component';

@Component({
  selector: 'app-paymentreceipt1',
  templateUrl: './paymentreceipt1.component.html',
  styleUrls: ['./paymentreceipt1.component.scss'],
})
export class Paymentreceipt1Component implements OnInit, OnDestroy {
  protected onDestroy$ = new Subject<void>(); //to set ondestroy
  saleId: string; //for storing sale id
  saletitle: any; //for storing sale title
  docId: string; //to store invoice id
  userId: any; //for storing user id
  superUserId: any; //for storing superuser id
  saleDataAccessRule: string = 'Own'; // data access rule for sale
  loader: boolean = false; //to enable while data is being updated in documents
  updatedSaleTitle: string = ''; //to store updated sale title
  updatedSaleId: string = ''; //to store updated sale title
  customerName: string; //to store customer name
  paymentType: any = 'Against Invoice'; //setting default payment type
  today = new Date().getTime(); //for storing todays date
  customerss: Customer[]; //setting cutsomer list for auto complete
  sale: Observable<Sales>; //to store sale details
  public userDetailsSubscription: Subscription; //subscription for userdetails
  customerData: Observable<Customer>; //observable to store customer details
  invoices: Invoice[] = []; //store invoice while sale selected
  sales: Sales[]; //store sales list
  invoiceSelected: boolean = false; //check is invoice selected or not
  paymentDetails: Observable<PaymentReceipt>; //to store payment details while updating
  customerId: any; //to store customer id
  invoiced: any; //to store invoice data
  customerCompany: any; //to store customers company
  invoicedValue: any; //to store invoiced value
  customerSecName: string; //store selected customers second name
  paymentDate: any; //to store payments date
  amountCollected: number; //to store collected amount
  paymentMode: string; //to store payment mode
  prevInvoiceNo: any; //to store previous invoice number
  chequeValue1: string = null; //storing first field values in check
  chequeValue2: string = null; //storing second field values in check
  currencyList: any = []; //for storing currency list
  currency: any; //for storing currency in form
  networkConnection: boolean; //boolean to check whether network found or not
  invoicesSubscriptionList: Subscription; //subscription for invoices
  paymentSubscriptionData: Subscription; //subscription for payment data
  customerSubscription: Subscription; //subscription for customer
  customerDetailsSubscription: Subscription; //subscription for customer details
  saleDetailSubscription: Subscription; //subscription for sale details
  superUserDetails: Profile; //for storing super user details
  fieldNameContact: string = 'Contact'; //setting default value for customer
  fieldNamePayment: string = 'Payment'; //setting default value for payment
  fieldNameSale: string = 'Sale'; //setting default value for sale
  submitClicked: boolean = false; //to check form submitted or not
  prefixAndDocNumber: string; //to store invoices prefix and docnumber
  prevPrefixAndDocNumber: string; //to store previous invoices prefix and docnumber while updating
  prevPayment: string; //to store previous payment type
  userForm: FormGroup;
  activeFieldsLength: number = 0; //get no of active additional fields
  paymentSettings: paymentSettings = defaultPaymentSettings.CONST_VALUE;
  additionalFieldModel: customFields = {
    //used as a data type reference for additional field
    fieldName: null,
    fieldType: null,
    categories: null,
    categoriesOpn: null,
    defaultValue: null,
    isActive: null,
    mandatory: null,
    value: null,
  };
  addFieldArrModel: addFieldsArr = {
    fieldValue: null,
  };
  additionalFields = [this.additionalFieldModel]; //to store addditonal fields array
  additionalFieldLength: number; //to store additional field length
  addFieldsArray = [this.addFieldArrModel]; //to store additional fields in customer
  orgId = '';
  scenario = '';
  contactSelected: boolean;
  orgSelected: boolean;
  removable: boolean = true; //to remove selected chip
  daTime: Date;
  formReset: boolean = true;
  subReset: boolean = true;
  customerReset: boolean = true;
  saleReset: boolean = true;
  subUsers: any[]; //to store list of subusers
  superUserBranchId: string = 'n/a';
  userUid: string; //to store the id of current user
  custSelected: boolean;
  userData: Profile; //to store userdata
  userName: string; //to store username
  prevOrgName: string; //previous orgName
  prevOrgId: string; // previous orgId
  previousForm: FormGroup; //previous form values
  previousCustomerName: any; //previous customer name before updating
  prevSaleTitle: string; //previous saleTitle before updating
  paymentChangeLog: any = {}; //payment change log
  //custom pipe to implement sorting of data wrt date modified in changeLog
  propName = 'dateModified'; //property for sorting
  customsort =
   ((a, b)=>{
    //returns the greater date first
    return Number(b.value[this.propName]) - Number(a.value[this.propName]);
  });
  changeLogLength: number; //no of changelog records
  constructor(
    private analytics: AngularFireAnalytics,
    private db: Paymentreceipt1Service,
    public commonService: CommonService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    @Optional() public dialogRef: MatDialogRef<SalesdetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData1,
    public networkCheck: NetworkCheckService
  ) {
    //getting currency list from common service file
    this.currencyList = Currencies.getCurencies();
    //getting data from common service file related to the user
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          this.superUserDetails = allData.superUserDetails;//super user detaisl
          //getting field name to display
          if (this.superUserDetails.fieldNames) {
            this.fieldNameContact = this.superUserDetails?.fieldNames?.fieldNameContact;//contact field name
            this.fieldNameSale = this.superUserDetails?.fieldNames?.fieldNameSale;// sale field name
            this.fieldNamePayment = this.superUserDetails?.fieldNames?.fieldNameCollection;// collection field name
          }
          //customisation field settings
          if (
            allData.superUserDetails.paymentSettings &&
            typeof allData.superUserDetails.paymentSettings !== 'undefined' &&
            allData.superUserDetails.paymentSettings !== null
          ) {
            this.paymentSettings = allData.superUserDetails.paymentSettings;
            if (allData.superUserDetails.paymentSettings) {
              this.commonService.checkCustomField(
                defaultPaymentSettings.CONST_VALUE,
                allData.superUserDetails.paymentSettings
              );
            }
          }
          this.subUsers = allData.subUsers;//subuser list
          this.userId = allData.userId; //current user
          this.userData = allData.userDetails;// logged in / current user  data
          this.userName =this.userData.firstname + (this.userData.lastname ? ' ' + this.userData.lastname : '');//get current userName
          this.superUserId = allData.userDetails.superUserId;// superuserId
          this.currency = allData.superUserDetails.currency;//default currency for supperuser
          this.userUid = allData.authDetails.uid;//auth id

          // for data access rule check for sale
          if (allData.usrProfileData?.saleDataAccessRule) {
            this.saleDataAccessRule = allData.usrProfileData.saleDataAccessRule;
          }
          //get superUser's associated branch
          if (allData.superUserDetails.associatedBranch) {
            this.superUserBranchId = allData.superUserDetails.associatedBranch;
          }
          //checking if the update mode and load data using id
          if (this.data?.mode == 'update' && this.formReset) {
            this.scenario = 'edit';
            this.formReset = false;
            this.additionalFields =
              allData.superUserDetails.customFieldsPayment;

            //find the no of active additionals fields
            this.additionalFields?.forEach((field) => {
              if (field.isActive) {
                this.activeFieldsLength = this.activeFieldsLength + 1;
              }
            });
            this.docId = this.data.paymentId;
            //getting payment details from common service file
            let paymentDetails = this.commonService.getPaymentToEdit();
            if (paymentDetails) {
              //assigning values for each variable
              if (paymentDetails.invoiceno != 'N/A') {
                this.invoiced = paymentDetails.invoiceno;
                this.invoicedValue = paymentDetails.invoiceno;
              } else {
                this.invoiced = null;
                this.invoicedValue = null;
              }
              
              this.prevPrefixAndDocNumber =
                paymentDetails.invoiceprefixAndDocNumber;
              this.saletitle = paymentDetails.saleTitle;
              this.prevSaleTitle = paymentDetails.saleTitle;
              this.paymentDate = paymentDetails.paymentDate.toDate();
              this.amountCollected = paymentDetails.amountCollected;
              this.paymentMode = paymentDetails.paymentMode;
              this.paymentType = paymentDetails.paymentType;
              this.currency = paymentDetails.currency;
              this.prevInvoiceNo = paymentDetails.invoiceno;
              this.prevPayment = paymentDetails.paymentType;
              this.addFieldsArray = paymentDetails.additionalFieldsArr;
              this.customerCompany = paymentDetails.customerCompany;
              this.prevOrgName = paymentDetails.customerCompany ? paymentDetails.customerCompany : null;
              this.orgId = paymentDetails.orgId;
              this.prevOrgId = paymentDetails.orgId;
              this.customerId = paymentDetails.customerId;
              this.previousCustomerName = paymentDetails.customerSecondName ?
                 paymentDetails.customerName + ' ' + paymentDetails.customerSecondName : 
                 paymentDetails.customerName;
              this.paymentChangeLog = paymentDetails.changeLog ? paymentDetails.changeLog : {};
              this.saleId = paymentDetails.saleid;

              if (paymentDetails.saleid) {
                this.updatedSaleId = paymentDetails.saleid;
              }
              if (paymentDetails.customerId) {
                //getting sale details using customer id
                this.getSaleDataAccessRule(
                  this.superUserId,
                  this.userUid,
                  paymentDetails.customerId,
                  this.saleDataAccessRule
                );
                // .subscribe((data) => {
                //   this.sales = data.map((e) => {
                //     return {
                //       id: e.payload.doc.id,
                //       ...(e.payload.doc.data() as {}),
                //     } as Sales;
                //   });
                // });
                this.contactSelected = true;
              } else {
                this.contactSelected = false;
              }
              if (paymentDetails.orgId) {
                this.orgSelected = true;
              } else {
                this.orgSelected = false;
              }
              this.updatedSaleTitle = paymentDetails.saleTitle;
              if (paymentDetails.paymentMode == 'Cheque') {
                this.chequeValue1 = paymentDetails.chequeNo ? paymentDetails.chequeNo : null;
                this.chequeValue2 = paymentDetails.chequeBank ? paymentDetails.chequeBank : null;
              }
              if (paymentDetails.additionalFieldsArr) {
                const addFieldsLength = Object.keys(this.addFieldsArray).length;
                for (let i = 0; i < this.additionalFields?.length; i++) {
                  this.additionalFields[i].value = '';
                }

                if (addFieldsLength != 0) {
                  //storing fields value in customer to additional field array
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
              this.paymentDetails = this.db.getPaymentDetails(
                this.superUserId,
                this.docId
              );
              this.paymentSubscriptionData = this.paymentDetails.subscribe(
                (data) => {
                  
                  if (data.invoiceno != 'N/A') {
                    this.invoiced = data.invoiceno;
                    this.invoicedValue = data.invoiceno;
                  } else {
                    this.invoiced = null;
                    this.invoicedValue = null;
                  }
                  this.prevPrefixAndDocNumber = data.invoiceprefixAndDocNumber;
                  this.saletitle = data.saleTitle;
                  this.prevSaleTitle = data.saleTitle ? data.saleTitle : null;
                  this.paymentDate = data.paymentDate.toDate();
                  this.amountCollected = data.amountCollected;
                  this.paymentMode = data.paymentMode;
                  this.paymentType = data.paymentType;
                  this.prevPayment = data.paymentType;
                  this.currency = data.currency;
                  this.prevInvoiceNo = data.invoiceno;
                  this.customerCompany = data.customerCompany;
                  this.prevOrgName = data.customerCompany ? data.customerCompany : null;
                  this.orgId = data.orgId;
                  this.prevOrgId = data.orgId;
                  this.customerId = data.customerId;
                  this.saleId = data.saleid;
                  this.previousCustomerName = data.customerSecondName ? 
                    data.customerName + ' ' + data.customerSecondName : 
                    data.customerName;
                  this.paymentChangeLog = data.changeLog ? data.changeLog : {};
                  if (data.paymentMode == 'Cheque') {
                    this.chequeValue1 = data.chequeNo ? data.chequeNo : null;
                    this.chequeValue2 = data.chequeBank ? data.chequeBank : null;
                  }
                  this.addFieldsArray = data.additionalFieldsArr;
                  if (data.additionalFieldsArr) {
                    const addFieldsLength = Object.keys(
                      this.addFieldsArray
                    ).length;
                    for (let i = 0; i < this.additionalFields?.length; i++) {
                      this.additionalFields[i].value = '';
                    }
                    if (addFieldsLength != 0) {
                      //storing fields value in customer to additional field array
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
                  if (data.customerId) {
                    this.getSaleDataAccessRule(
                      this.superUserId,
                      this.userUid,
                      paymentDetails.customerId,
                      this.saleDataAccessRule
                    );

                    this.contactSelected = true;
                  } else {
                    this.contactSelected = false;
                  }
                  if (data.orgId) {
                    this.orgSelected = true;
                  } else {
                    this.orgSelected = false;
                  }
                  if (data.saleid) {
                    this.updatedSaleId = data.saleid;
                  }
                  this.updatedSaleTitle = data.saleTitle;
                }
              );
            }

            this.userForm = this.fb.group({
              saletitle: [this.saletitle],
              paymentType: [this.paymentType, Validators.required],
              invoiced: [this.invoiced, Validators.required],
              currency: [this.currency, Validators.required],
              amountCollected: [this.amountCollected, Validators.required],
              paymentDate: [this.paymentDate, Validators.required],
              paymentMode: [this.paymentMode, Validators.required],
              chequeNo: [this.chequeValue1],
              chequeBank: [this.chequeValue2],
              additionalFields: this.fb.array([]),
            });
            if (!this.invoiced) {
              this.userForm.get('invoiced').setValidators(null);
              this.userForm.get('invoiced').updateValueAndValidity();
            }
            //additional fields
            this.additionalFields?.forEach((field) => {
              if (field.mandatory == true) {
                if (field.fieldType == 'date') {
                  (this.userForm.get('additionalFields') as FormArray).push(
                    this.fb.group({
                      fieldValue: [
                        !!field.value ? field.value.toDate() : '',
                        Validators.required,
                      ],
                      fieldName: field.fieldName,
                    })
                  );
                } else if (field.fieldType == 'date_time') {
                  (this.userForm.get('additionalFields') as FormArray).push(
                    this.fb.group({
                      fieldValue: [
                        field.value ? field.value.toDate() : null,
                        Validators.required,
                      ],
                      fieldValue2: [
                        field.value
                          ? new Date(field.value.seconds * 1e3)
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
                  (this.userForm.get('additionalFields') as FormArray).push(
                    this.fb.group({
                      fieldValue: [field.value, Validators.required],
                      fieldName: field.fieldName,
                    })
                  );
                }
              } else {
                if (field.fieldType == 'date') {
                  (this.userForm.get('additionalFields') as FormArray).push(
                    this.fb.group({
                      fieldValue: !!field.value ? field.value.toDate() : '',
                      fieldName: field.fieldName,
                    })
                  );
                } else if (field.fieldType == 'date_time') {
                  (this.userForm.get('additionalFields') as FormArray).push(
                    this.fb.group({
                      fieldValue: [field.value ? field.value.toDate() : null],
                      fieldValue2: [
                        field.value
                          ? new Date(field.value.seconds * 1e3)
                              .toString()
                              .split(' ')[4]
                          : '',
                      ],
                      fieldName: field.fieldName,
                      fieldType: field.fieldType,
                    })
                  );
                } else {
                  (this.userForm.get('additionalFields') as FormArray).push(
                    this.fb.group({
                      fieldValue: field.value,
                      fieldName: field.fieldName,
                    })
                  );
                }
              }
            });
            this.userForm.controls.paymentMode.valueChanges.subscribe(
              (value) => {
                if (value == 'Cheque') {
                  this.userForm
                    .get('chequeNo')
                    .setValidators([Validators.required]);
                  this.userForm
                    .get('chequeBank')
                    .setValidators([Validators.required]);
                } else {
                  this.userForm.get('chequeNo').setValidators(null);
                  this.userForm.get('chequeBank').setValidators(null);
                }
                this.userForm.get('chequeNo').updateValueAndValidity();
                this.userForm.get('chequeBank').updateValueAndValidity();
              }
            );
            this.userForm.controls.paymentType.valueChanges.subscribe(
              (value) => {
                if (value == 'Against Invoice') {
                  this.userForm
                    .get('invoiced')
                    .setValidators([Validators.required]);
                } else {
                  this.userForm.get('invoiced').setValidators(null);
                }
                this.userForm.get('invoiced').updateValueAndValidity();
              }
            );

            //save the previous form to create change log
            this.previousForm = ChangeLogComponent.cloneAbstractControl(
              this.userForm
            );
            //find change log length
            this.changeLogLength = Object.keys(this.paymentChangeLog).length;

          }
          //form in create scenarios
          if (
            (this.data?.mode == 'createCust' ||
              this.data?.mode == 'create' ||
              this.data?.mode == 'createCustSelect' ||
              this.data?.mode == 'createfromOrg') &&
            this.formReset
          ) {
            this.formReset = false;
            if (this.data.mode == 'createCust' || this.data.mode == 'create') {
              this.scenario = 'createfromCustomer';
            } else if (this.data?.mode == 'createfromOrg') {
              this.scenario = 'createfromOrg';
            } else {
              this.scenario = 'create';
            }
            if (this.data.customerId) {
              this.customerId = this.data.customerId;
              this.contactSelected = true;
              //getSale based on data access rule
              this.getSaleDataAccessRule(
                this.superUserId,
                this.userUid,
                this.customerId,
                this.saleDataAccessRule
              );
            } else {
              this.contactSelected = false;
            }
            if (this.data.saleId) {
              this.updatedSaleId = this.data.saleId;
              this.updatedSaleTitle = this.data?.saleTitle;
            }
            if (this.data.orgId) {
              this.orgId = this.data.orgId;
              this.orgSelected = true;
            } else {
              this.orgSelected = false;
            }
            this.additionalFields = allData.superUserDetails.customFieldsPayment;

            //find the no of active additionals fields
            this.additionalFields?.forEach((field) => {
              if (field.isActive) {
                this.activeFieldsLength = this.activeFieldsLength + 1;
              }
            });
            //paymentForm
            this.userForm = this.fb.group({
              saletitle: [null],
              paymentType: ['Against Invoice', Validators.required],
              invoiced: [null, Validators.required],
              currency: ['INR', Validators.required],
              amountCollected: [null, Validators.required],
              paymentDate: [null, Validators.required],
              paymentMode: [null, Validators.required],
              chequeNo: [null, Validators.required],
              chequeBank: [null, Validators.required],
              additionalFields: this.fb.array([]),
            });
            //additional fields
            this.additionalFields?.forEach((field) => {
              if (field.mandatory == true) {
                if (field.fieldType == 'date') {
                  (this.userForm.get('additionalFields') as FormArray).push(
                    this.fb.group({
                      fieldValue: [
                        !!field.defaultValue ? field.defaultValue.toDate() : '',
                        Validators.required,
                      ],
                      fieldName: field.fieldName,
                    })
                  );
                } else if (field.fieldType == 'date_time') {
                  (this.userForm.get('additionalFields') as FormArray).push(
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
                } else {
                  (this.userForm.get('additionalFields') as FormArray).push(
                    this.fb.group({
                      fieldValue: [field.defaultValue, Validators.required],
                      fieldName: field.fieldName,
                    })
                  );
                }
              } else {
                if (field.fieldType == 'date') {
                  (this.userForm.get('additionalFields') as FormArray).push(
                    this.fb.group({
                      fieldValue: [
                        !!field.defaultValue ? field.defaultValue.toDate() : '',
                      ],
                      fieldName: field.fieldName,
                    })
                  );
                } else if (field.fieldType == 'date_time') {
                  (this.userForm.get('additionalFields') as FormArray).push(
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
                } else {
                  (this.userForm.get('additionalFields') as FormArray).push(
                    this.fb.group({
                      fieldValue: field.defaultValue,
                      fieldName: field.fieldName,
                    })
                  );
                }
              }
            });
            //validation based on paymentMode
            this.userForm.controls.paymentMode.valueChanges.subscribe(
              (value) => {
                if (value == 'Cheque') {
                  this.userForm
                    .get('chequeNo')
                    .setValidators([Validators.required]);
                  this.userForm
                    .get('chequeBank')
                    .setValidators([Validators.required]);
                } else {
                  this.userForm.get('chequeNo').setValidators(null);
                  this.userForm.get('chequeBank').setValidators(null);
                }
                this.userForm.get('chequeNo').updateValueAndValidity();
                this.userForm.get('chequeBank').updateValueAndValidity();
              }
            );
            //validation based on paymentType
            this.userForm.controls.paymentType.valueChanges.subscribe(
              (value) => {
                if (value == 'Against Invoice') {
                  this.userForm
                    .get('invoiced')
                    .setValidators([Validators.required]);
                } else {
                  this.userForm.get('invoiced').setValidators(null);
                }
                this.userForm.get('invoiced').updateValueAndValidity();
              }
            );
          }

          //getting details from create form sale view
          if (this.subReset == true) {
            this.saleId = this.data.saleId;
            this.docId = this.data.paymentId;
            this.customerId = this.data.customerId;
            this.customerCompany = this.data?.company;
          }
          this.subReset = false;
          //getting sales details using id
          if (this.saleId) {
            this.sale = this.db.getSale(this.superUserId, this.saleId);
            this.saleDetailSubscription = this.sale.subscribe((val) => {
              if (this.saleReset == true) {
                this.saletitle = val?.saleTitle;
                this.customerId = val?.customerId;
                if (this.data?.mode == 'create') {
                  this.orgId = val.orgId ? val.orgId : '';
                }
              }
              this.saleReset = false;
            });
            //using sale id getting invoice list
            this.invoicesSubscriptionList?.unsubscribe();
            this.invoicesSubscriptionList = this.db
              .getInvoicesForSale(this.saleId, this.superUserId)
              .subscribe((data) => {
                this.invoices = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Invoice;
                });
              });
          } else {
            if (this.customerId) {
              //using customer id getting invoice list
              this.invoicesSubscriptionList?.unsubscribe();
              this.invoicesSubscriptionList = this.db
                .getInvoicesForCustomer(this.customerId, this.superUserId)
                .subscribe((data) => {
                  this.invoices = data.map((e) => {
                    return {
                      id: e.payload.doc.id,
                      ...(e.payload.doc.data() as {}),
                    } as Invoice;
                  });
                });
            }
          }
          //getting customers details using customer id
          if (this.customerId) {
            this.customerData = this.db.getCustomer(
              this.superUserId,
              this.customerId
            );
            this.customerDetailsSubscription = this.customerData.subscribe(
              (data) => {
                if (this.customerReset == true) {
                  this.customerSecName = data?.secondName;
                  this.customerName = data.firstName;
                  if (this.scenario != 'edit' && this.data?.mode != 'create') {
                    this.orgId = data.orgId ? data.orgId : '';
                  }
                }
                this.customerReset = false;
              }
            );
          }
        }
      }
    );
  }

  ngOnInit(): void {}
  //triggered while a organisation is selected form auto complete,to get organisation ID
  orgIdEventHander($event) {
    if ($event) {
      this.orgId = $event;
    } else {
      this.orgId = '';
    }
  }
  //triggered while a organisation is selected form auto complete,to get organisation name
  orgNameEventHander($event) {
    if ($event) {
      this.customerCompany = $event;
    } else {
      this.customerCompany = '';
    }
  }
    //triggered while a customer is selected form auto complete,to get customer name & Id
  contSelectedEventHander($event: any) {
    const customer = $event;
    this.customerId = customer?.id;
    this.customerName = customer?.firstName;
    this.customerSecName = customer?.secondName;
    this.custSelected = true;
    //getting sales with customer id
    if (this.customerId) {
      //using customer id getting invoice list
      this.invoicesSubscriptionList?.unsubscribe();

      this.invoicesSubscriptionList = this.db
        .getInvoicesForCustomer(this.customerId, this.superUserId)
        .subscribe((data) => {
          this.invoices = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
        });
      this.getSaleDataAccessRule(
        this.superUserId,
        this.userUid,
        this.customerId,
        this.saleDataAccessRule
      );
    } else {
      this.userForm.get('saletitle')?.setValue(null);
      this.userForm.get('invoiced')?.setValue(null);
      this.invoices = [];
      this.saleId = '';
      this.customerId = '';

      this.updatedSaleId = null;
      this.updatedSaleTitle = null;
      this.invoiced = 'N/A';
      this.prefixAndDocNumber = null;
      this.sales = [];
      this.invoicesSubscriptionList?.unsubscribe();
    }
  }
  //triggered on selecting an sale
  onSaleTitle(value) {
    if (value) {
      let saleValues;
      saleValues = value.split(',');
      this.updatedSaleTitle = saleValues[0];
      this.updatedSaleId = saleValues[1];
      //getting invoices with selected sale id
      this.invoicesSubscriptionList?.unsubscribe();
      this.invoicesSubscriptionList = this.db
        .getInvoicesForSale(this.updatedSaleId, this.superUserId)
        .subscribe((data) => {
          this.invoices = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
          if(this.invoices.length === 0){
            this.userForm.controls.invoiced.setValue(null);
          }
        });
    }
  }
  //to remove selected sale detaisl from the payment form
  onClearSale() {
    this.updatedSaleId = null;
    this.updatedSaleTitle = null;
    this.invoiced = 'N/A';
    this.prefixAndDocNumber = null;
    this.userForm.get('saletitle')?.setValue(null);
    this.userForm.get('invoiced')?.setValue(null);
    this.invoices = [];
    this.saleId = '';
    if (this.customerId) {
      //using customer id getting invoice list
      this.invoicesSubscriptionList?.unsubscribe();
      this.invoicesSubscriptionList = this.db
        .getInvoicesForCustomer(this.customerId, this.superUserId)
        .subscribe((data) => {
          this.invoices = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Invoice;
          });
        });
    }
  }
  //getting invoice id from invoice select
  onInvoice(value) {
    this.docId = value;
    this.invoiceSelected = true;
  }
  //to get prefix of invoice
  invoiceDetails(value) {
    this.prefixAndDocNumber = value.docData.prefixAndDocNumber;
  }
  //triggered while creating payment reciept
  onSubmit(form, GAevent) {
    this.submitClicked = true;
    this.analytics.logEvent(GAevent);
    this.paymentType = form.value.paymentType;
    this.invoiced = form.value.invoiced;
    //setting default invoice as "N/A"
    if (this.paymentType != 'Against Invoice') {
      this.invoiced = 'N/A';
      this.prefixAndDocNumber = null;
    }
    if (!this.invoiced) {
      this.invoiced = 'N/A';
      this.prefixAndDocNumber = null;
    }
    if (!this.prefixAndDocNumber) {
      this.prefixAndDocNumber = null;
    }
    //saving  sale name if payment is from customer view
    if (
      this.data?.mode == 'createCust' ||
      this.data?.mode == 'createCustSelect' ||
      this.data?.mode == 'createfromOrg' ||
      this.data?.mode == 'create'
    ) {
      this.saletitle = this.updatedSaleTitle;
      this.saleId = this.updatedSaleId;
    }
    let st = form.value;
    //check whether additional field present or not
    if (!st.additionalField) {
      st.additionalField = '';
    }
    st.additionalField = 'value added';
    let additionalFields = <addFieldsArr>{};
    let fromArray = form.get('additionalFields') as FormArray;
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
      if (
        fromArray.at(index).value.fieldValue == null ||
        fromArray.at(index).value.fieldValue == ''
      ) {
        this.daTime = null;
      }
      additionalFields[index] = {
        fieldValue: control.value.fieldValue2
          ? this.daTime
          : control.value.fieldValue,
      };
    });
    let formDetails;
    if (form.value.paymentMode == 'Cheque') {
      formDetails = {
        amountCollected: form.value.amountCollected,
        paymentMode: form.value.paymentMode,
        paymentType: form.value.paymentType,
        paymentDate: form.value.paymentDate,
        currency: form.value.currency,
        chequeNo: form.value.chequeNo,
        chequeBank: form.value.chequeBank,
      };
    } else {
      formDetails = {
        amountCollected: form.value.amountCollected,
        paymentMode: form.value.paymentMode,
        paymentType: form.value.paymentType,
        paymentDate: form.value.paymentDate,
        currency: form.value.currency,
      };
    }
    //adding payment new payment to db
    this.db
      .addPaymentReceipt(
        this.superUserId,
        formDetails,
        this.saleId,
        this.saletitle,
        this.userId,
        this.today,
        this.invoiced,
        this.prefixAndDocNumber,
        this.customerId,
        this.customerName,
        this.customerSecName,
        this.customerCompany ? this.customerCompany : '',
        this.orgId ? this.orgId : '',
        additionalFields,
        ChangeLogComponent.saveLog(
          this.constructor.name,
          this.userId,
          this.userName,
          '',
          '',
          {}
        )
      )
      .then(() => {
        if(this.customerId){
          let customer = this.db.getCustomer(this.superUserId,this.customerId);
          customer.pipe(take(1)).subscribe(
            (data) => {
            //Add changelog for customer
            let changeLog = ChangeLogComponent.saveLog(
              this.data?.componentName,
              this.userId,
              this.userName,
              '',
              {'addedPayment': {'amount': form.value.amountCollected,
                                'currency': form.value.currency }},
              data.changeLog
            );
            this.db.updateChangeLog(
              this.superUserId,
              'customers',
              this.customerId,
              changeLog
            );
          })
        }
        if(this.saleId){
          let sale = this.db.getSale(this.superUserId,this.saleId);
          sale.pipe(take(1)).subscribe(
            (data) => {
            //Add changelog for sale
            let changeLog = ChangeLogComponent.saveLog(
              this.data?.componentName,
              this.userId,
              this.userName,
              '',
              {'addedPayment': {'amount': form.value.amountCollected,
                                'currency': form.value.currency }},
              data.changeLog
            );
            this.db.updateChangeLog(
              this.superUserId,
              'sales',
              this.saleId,
              changeLog
            );
            })
        }

        if(this.orgId){
          let org = this.db.getOrg(this.superUserId,this.orgId);
          org.pipe(take(1)).subscribe(
            (data) => {
            //Add changelog for org
            let changeLog = ChangeLogComponent.saveLog(
              this.data?.componentName,
              this.userId,
              this.userName,
              '',
              {'addedPayment': {'amount': form.value.amountCollected,
                                'currency': form.value.currency }},
              data.changeLog
            );
            this.db.updateChangeLog(
              this.superUserId,
              'Organisations',
              this.orgId,
              changeLog
            );
            })
        }

        let message = this.fieldNamePayment + ' Successfully Created';
        this._snackBar.open(message, ' ', {
          duration: 2000,
        });
      });
    this.dialogRef.close();
  }
  //triggered while updating payment reciept
  onUpdate(form) {
    this.submitClicked = true;
    this.invoiced = form.value.invoiced;
    if (!this.invoiceSelected) {
      //giving prev invoice amount if its not selected
      this.invoiced = form.value.invoiced;
      if (!this.prevPrefixAndDocNumber) {
        this.prevPrefixAndDocNumber = this.invoiced;
      }
      this.prefixAndDocNumber = this.prevPrefixAndDocNumber;
    }
    //getting new invoice
    this.paymentType = form.value.paymentType;
    if (this.paymentType != 'Against Invoice') {
      this.invoiced = 'N/A';
      this.prefixAndDocNumber = null;
    }
    // form.paymentType = this.paymentType
    //getting new payment id
    if (this.data?.paymentId) {
      this.docId = this.data.paymentId;
    }
    if (form.value.paymentMode != 'Cheque') {
      form.value.chequeNo = null;
      form.value.chequeBank = null;
    }
    let additionalFields = <addFieldsArr>{};
    let fromArray = form.get('additionalFields') as FormArray;
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
      if (
        fromArray.at(index).value.fieldValue == null ||
        fromArray.at(index).value.fieldValue == ''
      ) {
        this.daTime = null;
      }
      additionalFields[index] = {
        fieldValue: control.value.fieldValue2
          ? this.daTime
          : control.value.fieldValue,
      };
    });
    this.saletitle = this.updatedSaleTitle;
    this.saleId = this.updatedSaleId;

    let formDetails;
    if (form.value.paymentMode == 'Cheque') {
      formDetails = {
        amountCollected: form.value.amountCollected,
        paymentMode: form.value.paymentMode,
        paymentType: form.value.paymentType,
        paymentDate: form.value.paymentDate,
        currency: form.value.currency,
        chequeNo: form.value.chequeNo,
        chequeBank: form.value.chequeBank,
        saleTitle: this.saletitle,
        saleid: this.saleId,
        orgId: this.orgId ? this.orgId : '',
        customerId: this.customerId,
        customerName: this.customerName,
        customerSecondName: this.customerSecName,
        customerCompany: this.customerCompany ? this.customerCompany : '',
      };
    } else if (form.value.paymentMode == 'Cash') {
      formDetails = {
        amountCollected: form.value.amountCollected,
        paymentMode: form.value.paymentMode,
        paymentType: form.value.paymentType,
        paymentDate: form.value.paymentDate,
        currency: form.value.currency,
        chequeNo: form.value.chequeNo,
        chequeBank: form.value.chequeBank,
        saleTitle: this.saletitle,
        saleid: this.saleId,
        orgId: this.orgId ? this.orgId : '',
        customerId: this.customerId,
        customerName: this.customerName,
        customerSecondName: this.customerSecName,
        customerCompany: this.customerCompany ? this.customerCompany : '',
      };
    } else if (form.value.paymentMode == 'Account Transfer') {
      formDetails = {
        amountCollected: form.value.amountCollected,
        paymentMode: form.value.paymentMode,
        paymentType: form.value.paymentType,
        paymentDate: form.value.paymentDate,
        currency: form.value.currency,
        chequeNo: form.value.chequeNo,
        chequeBank: form.value.chequeBank,
        saleTitle: this.saletitle,
        saleid: this.saleId,
        orgId: this.orgId ? this.orgId : '',
        customerId: this.customerId,
        customerName: this.customerName,
        customerSecondName: this.customerSecName,
        customerCompany: this.customerCompany ? this.customerCompany : '',
      };
    } else {
      formDetails = {
        amountCollected: form.value.amountCollected,
        paymentMode: form.value.paymentMode,
        paymentType: form.value.paymentType,
        paymentDate: form.value.paymentDate,
        currency: form.value.currency,
        saleTitle: this.saletitle,
        saleid: this.saleId,
        orgId: this.orgId ? this.orgId : '',
        customerId: this.customerId,
        customerName: this.customerName,
        customerSecondName: this.customerSecName,
        customerCompany: this.customerCompany ? this.customerCompany : '',
      };
    }
    let customerName = this.customerSecName ? this.customerName + ' ' + this.customerSecName : this.customerName;
    //additionalData to pass to changeLog component to get payment org changes
    let additionalData = {
      currentOrgId: {
              orgId: this.orgId ? this.orgId : null,
              companyName: this.customerCompany ? this.customerCompany : null,
            },
        prevOrgId: {
          orgId: this.prevOrgId ? this.prevOrgId : null,
          companyName: this.prevOrgName ? this.prevOrgName : null,
        },
        //add contact name change to changelog
      currentContact: {
        //current value
        selectedCust: customerName ? customerName : null,
      },
      prevContact: {
        //previous value
        selectedCust: this.previousCustomerName ? this.previousCustomerName : null,
      },
    };
    //To add sale title to changelog
    form.controls.saletitle.patchValue(this.saletitle)
    if(this.prevSaleTitle != this.saletitle){
      form.get('saletitle').markAsDirty();
    }

    //To get invoice number in changeLog
    this.previousForm.controls.invoiced.patchValue(this.prevPrefixAndDocNumber)
    form.controls.invoiced.patchValue(this.prefixAndDocNumber)
    if(this.prevPrefixAndDocNumber != this.prefixAndDocNumber){
      form.get('invoiced').markAsDirty();
    }

    //changeLog for payment popup
    //pass previous form and current form and get the changes and add it to corresponding module's changelog
    let newChangeLog = ChangeLogComponent.saveLogReactiveForm(
      this.constructor.name,
      this.userId,
      this.userName,
      this.previousForm,
      form,
      {},
      additionalData
    );

    let newPaymentChangeLog = ChangeLogComponent.saveLogReactiveForm(
      this.constructor.name,
      this.userId,
      this.userName,
      this.previousForm,
      form,
      this.paymentChangeLog,
      additionalData
    );
      
    //update current payment reciept
    this.db
      .updatePaymentReceipt(
        this.superUserId,
        this.docId,
        formDetails,
        this.invoiced,
        this.prefixAndDocNumber,
        additionalFields,
        newPaymentChangeLog ? newPaymentChangeLog : this.paymentChangeLog
      )
      .then(() => {
        if( newChangeLog){
          if(this.customerId) {
            let customer = this.db.getCustomer(this.superUserId,this.customerId);
            customer.pipe(take(1)).subscribe(
              (data) => {         
              //Add changelog for customer
              let changeLog = ChangeLogComponent.saveLog(
                this.data?.componentName,
                this.userId,
                this.userName,
                {'editedPayment': { 'amount': newChangeLog[0]?.previousValues.amountCollected ? newChangeLog[0]?.previousValues.amountCollected : form.value.amountCollected,
                                    'currency': newChangeLog[0]?.previousValues.currency ? newChangeLog[0]?.previousValues.currency : form.value.currency,
                                    'changedValues': newChangeLog[0]?.previousValues}},
                {'editedPayment': { 'amount': form.value.amountCollected,
                                    'currency': form.value.currency,
                                    'changedValues': newChangeLog[0]?.currentValues}},
                data?.changeLog
              );
              //update customer db
              this.db.updateChangeLog( 
                this.superUserId,
                'customers',
                this.customerId,
                changeLog
              );
            })
          }

          if(this.saleId) {
            let sale = this.db.getSale(this.superUserId,this.saleId);
            sale.pipe(take(1)).subscribe(
              (data) => {         
              //Add changelog for sale
              let changeLog = ChangeLogComponent.saveLog(
                this.data?.componentName,
                this.userId,
                this.userName,
                {'editedPayment': { 'amount': newChangeLog[0]?.previousValues.amountCollected ? newChangeLog[0]?.previousValues.amountCollected : form.value.amountCollected,
                                    'currency': newChangeLog[0]?.previousValues.currency ? newChangeLog[0]?.previousValues.currency : form.value.currency,
                                    'changedValues': newChangeLog[0]?.previousValues}},
                {'editedPayment': { 'amount': form.value.amountCollected,
                                    'currency': form.value.currency,
                                    'changedValues': newChangeLog[0]?.currentValues}},
                data?.changeLog
              );
              //update sale db
              this.db.updateChangeLog( 
                this.superUserId,
                'sales',
                this.saleId,
                changeLog
              );
            })
          }

          if(this.orgId){
            let org = this.db.getOrg(this.superUserId,this.orgId);
            org.pipe(take(1)).subscribe(
              (data) => {
              //Add changelog for org
              let changeLog = ChangeLogComponent.saveLog(
                this.data?.componentName,
                this.userId,
                this.userName,
                {'editedPayment': { 'amount': newChangeLog[0]?.previousValues.amountCollected ? newChangeLog[0]?.previousValues.amountCollected : form.value.amountCollected,
                                    'currency': newChangeLog[0]?.previousValues.currency ? newChangeLog[0]?.previousValues.currency : form.value.currency,
                                    'changedValues': newChangeLog[0]?.previousValues}},
                {'editedPayment': { 'amount': form.value.amountCollected,
                                    'currency': form.value.currency,
                                    'changedValues': newChangeLog[0]?.currentValues}},
                data?.changeLog
              );
              //update org db
              this.db.updateChangeLog(
                this.superUserId,
                'Organisations',
                this.orgId,
                changeLog
              );
              })
          }

        }
        // if (this.invoiced != this.prevInvoiceNo || this.amountCollected != form.amountCollected) {
        //   //cloud fn for updating payment amount in sale cust& invoice
        //   this.http.post(environment.cloudFunctions.updatePaymentAmountOnEdit, {
        //     saleid: this.saleId,
        //     customerId: this.customerId,
        //     invoiceno: this.invoiced,
        //     userUid: this.superUserId,
        //     prevInvoiceNo: this.prevInvoiceNo
        //   }).subscribe(() => {
        //     this.dialogRef.close();
        //   })
        // }
        // else {
        //   this.dialogRef.close();
        // }
        this._snackBar.open(
          this.fieldNamePayment + ' Successfully Updated',
          ' ',
          {
            duration: 2000,
          }
        );
      });
    this.dialogRef.close();
  }
  //closing popup
  closed() {
    this.dialogRef.close();
  }
 
  //function to get sales based on data access rule
  async getSaleDataAccessRule(superUserId, userId, custId, saleDataAccessRule) {
    await this.getSales(superUserId, userId, saleDataAccessRule, custId);
  }
  //function to get sales based on data access rule
  async getSales(superUserId, userId, saleDataAccessRule, custId) {
    let queryIdSale: string[] = [];
    if (saleDataAccessRule == 'Own') {
      queryIdSale = [userId];
    } else if (saleDataAccessRule === 'Team') {
      this.subUsers.forEach((element) => {
        if (element.reportsToId === userId) {
          queryIdSale.push(element.userId);
        }
      });
      queryIdSale.push(userId);
    } else if (saleDataAccessRule === 'Branch') {
      const branchId = this.subUsers.find(
        (item) => item.userId === userId
      )?.branchId;
      if (branchId) {
        queryIdSale.push(branchId);
      } else {
        if (userId == this.superUserId) {
          queryIdSale.push(this.superUserBranchId);
        } else {
          queryIdSale.push('n/a');
        }
      }
    }
    await this.getAllSales(
      superUserId,
      queryIdSale,
      saleDataAccessRule,
      custId
    );
  }
  //get filter values to show in dropdown
  getAllSales(superUserId, queryId: string[], saleDataAccessRule, custId) {
    return new Promise<void>(async (resolve) => {
      (
        await this.db.getAllSalesFromDb(
          superUserId,
          queryId,
          saleDataAccessRule,
          custId
        )
      )
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.sales = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Sales;
          });
          if (this.custSelected) {
            if (this.data.mode == 'create' || this.data.mode == 'update') {
              const sale = this.sales.find((item) => item.id === this.saleId);
              if (sale && sale !== null && typeof sale !== 'undefined') {
                this.saleId = sale.id;
                let str = `${sale.saleTitle},${sale.id}`;
                this.userForm.get('saleTitle').setValue(str);
                this.onSaleTitle(str);
              } else {
                this.userForm.get('saletitle').setValue(null);
              }
            }
            this.updatedSaleId = null;
            this.updatedSaleTitle = null;
          }
          this.custSelected = false;
          // // filter sales
          // this.filteredOptionsSale = this.userForm
          //   .get('salesDetails')
          //   .valueChanges.pipe(
          //     startWith(''),
          //     map((value) =>
          //       typeof value === 'string' ? value : value?.saleTitle
          //     ),
          //     map((saleTitle) =>
          //       saleTitle
          //         ? this._filterSales(saleTitle)
          //         : this.salesList.slice()
          //     )
          //   );
          resolve();
        });
    });
  }
  //checking network is present or not
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    //unsubscribing subscription
    this.userDetailsSubscription?.unsubscribe();
    this.invoicesSubscriptionList?.unsubscribe();
    this.paymentSubscriptionData?.unsubscribe();
    this.customerSubscription?.unsubscribe();
    this.customerDetailsSubscription?.unsubscribe();
    this.saleDetailSubscription?.unsubscribe();
  }
}
