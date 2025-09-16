/*********************************************************************************
Description: component used for expense CRU operation
Inputs: get data from bottom sheet expense through selector
Outputs:
***********************************************************************************/

import { Expenses1Service } from './expenses1.service';
import {
  ExpensesData,
  SalesdetailsComponent,
} from '../sales-view/salesdetails/salesdetails.component';
import {
  Component,
  OnDestroy,
  Inject,
  Input,
  OnInit,
  Optional,
  HostListener,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  addFieldsArr,
  Attachments,
  Customer,
  customFields,
  defaultExpenseSettings,
  Expenses,
  expenseSettings,
  OrganisationModel,
  PlanDocLimit,
  Sales,
} from '../data-models';
import { finalize, take, takeUntil } from 'rxjs/operators';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Currencies } from '../currencies';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { CommonService } from '../common.service';
import { ConfirmationpopupComponent } from '../confirmationpopup/confirmationpopup.component';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { ChangeLogComponent } from '../change-log/change-log.component';

@Component({
  selector: 'app-expenses1',
  templateUrl: './expenses1.component.html',
  styleUrls: ['./expenses1.component.scss'],
})
export class Expenses1Component implements OnInit, OnDestroy {
  protected onDestroy$ = new Subject<void>();

  superUserId: string; //for storing superuser's id
  superUserDetails: any; //super user details
  userId: string; //for storing user's uid
  userName: string; //for storing user name

  customerId: string = null; //for storing custoemrs id
  prevCustId: string = null; //variable to store previous customer id while updating
  customerFirstName: string = null; //store customers first name
  customerSecondName: string = null; //store customers second name
  previousCustomerName: string = null; //previous CustomerName
  customers: Customer[] = []; //for storing all customers from database

  orgId: string = null; //current org id
  prevOrgId: string = null; // previous orgId
  customerCompany: string = null; //store customers company name
  prevOrgName: string = null; //previous orgName
  organisations: OrganisationModel[] = []; //list of organisations

  saleId: string = null; //variable to store new sale id while updating
  prevSaleId: string = null; //variable to store previous sale id while updating
  saleTitle: string = null; //storing data to bind in select
  prevSaleTitle: string = null; //previous SaleTitle
  sales: Sales[] = []; //array to store all sales in

  expenseID: string = null; //current expense id
  expenseDetails: Expenses; //for getting details corresponding to expense while updating
  expenseData: Observable<Expenses>; //observable to fetch expense data from db
  inpModule: string = 'expense'; //for customer validation check in common-org component
  expDate: any; //variable for storing expense date
  ExpensePayments: Expenses[]; //array to store all expense in db for sales
  expensePaymentsCustomer: Expenses[]; //array to store all expense in db customer
  currency: string; //variable to store currency type of expense
  previousCurrency: string; //previous Currency
  currencyList: any = []; //array used to get all currency and its short name from common service file
  amount: number; //variable to store amount of expense
  previousAmount: number; //previous Amount
  descriptions: string; //variable to store descriptions of expense
  category: string; //variable to store category of expense
  categoryList: string[] = []; //get all selected categories by default form common service file
  totalExpenseAmountCollected: number; //to store total expense amount to store in corresponding customer and sale

  showAttachments: boolean = false; //flag indicates whether to show attachments
  attachmentSize: any; //total attachment size under superuser
  totalUserCount: number = 1; //no of users
  currentlyUploaded: number; //no of files uploaded
  totalUploadLimit: number; //total limit for file data
  uploadFileLimit: any = []; //limit for file data
  uploadPercentage: number; //indicates upload percentage of attachment
  plan = ''; //to store current user's subscription plan
  fileUploading: boolean = false; //if file is being uploaded, set it true
  uploadedFiles: any[] = []; //list of newly attached files
  uploadProgress$: Observable<any>; //to display upload progress of attachment
  snapshot: Observable<any>; //to upload attachment
  downloadUrl: any; //firebase url to download file
  fileID: number = 1; //file's id
  addedAttachments: any[] = []; // stores newly added attachments
  deletedAttachments: any[] = []; // stores deleted attachments
  attachments: any[] = []; //attachments associated with this particular sale

  fieldNameContact = ''; //cutsom name for contact
  fieldNameSale = ''; //cutsom name for sale
  fieldNameExpense = ''; //cutsom name for expense
  fieldNameOrganization = 'Organization';
  fieldNameItems: string = 'Expense'; //customisable field name
  fieldNameItemsCategory: string = 'Category'; //customisable field name category

  //reactive forms used
  userForm: FormGroup; //main form to store field values
  previousForm: FormGroup; //previous form values

  //used as a data type reference for additional field
  additionalFieldModel: customFields = {
    fieldName: null,
    fieldType: null,
    categories: null,
    categoriesOpn: null,
    defaultValue: null,
    isActive: null,
    mandatory: null,
    value: null,
  };
  //additional fields array model
  addFieldArrModel: addFieldsArr = {
    fieldValue: null,
  };
  additionalFields = [this.additionalFieldModel]; //to store addditonal fields array
  addFieldsArray = [this.addFieldArrModel]; //to store additional fields in customer
  additionalFieldLength: number; //to store additional field length
  activeFieldsLength: number = 0; //get no of active additional fields

  expReset: boolean = true; //to prevent default values reset
  formReset: boolean = true; //to prevent form reset
  chipDisplay: boolean = false; // display in chips common component
  contactSelected: boolean = false; //contact selected input to common component
  companySelected: boolean = false; //company selected input to common component

  daTime: any; //to convert date time

  //custom field names
  expenseSettings: expenseSettings = defaultExpenseSettings.CONST_VALUE;
  expenseChangeLog:any = {}; //stores expense change log values
  //custom pipe to implement sorting of data wrt date modified in changeLog
  propName = 'dateModified'; //property for sorting
  customsort = (a, b) => {
    //returns the greater date first
    return Number(b.value[this.propName]) - Number(a.value[this.propName]);
  };
  changeLogLength: number; //length of changelog records

  //subscriptions
  expenseDetailsSubscription: Subscription; //subscription for expense details from db
  saleCustomerSubscription: Subscription; //subscription for sales for that customer form db
  expensePaymentSubscription: Subscription; //subscription for expense payments from db
  userDetailsSubscription: Subscription; //subscription for all userdetails from common service file
  attachmentSubscription: Subscription; //subscription to get attachments

  @ViewChild('file') file; //same filenmae upload

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ExpensesData,
    @Optional() public dialogRef: MatDialogRef<SalesdetailsComponent>,
    private analytics: AngularFireAnalytics,
    public commonService: CommonService,
    private db: Expenses1Service,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private storage: AngularFireStorage
  ) {
    //for getting currency from common service file
    this.currencyList = Currencies.getCurencies();
    //to get super user details form common service file
    this.uploadFileLimit = PlanDocLimit.sizeLimit;
    //getting userdata through common service file
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      //getting data from common service file related to the user
      async (allData) => {
        if (allData) {
          //getting superuser details
          this.superUserDetails = allData.superUserDetails;
          this.superUserId = allData.userDetails.superUserId;
          //getting current user details
          this.userId = allData.userId;
          this.userName = allData.userDetails.lastname?allData.userDetails.firstname + ' ' + allData.userDetails.lastname: allData.userDetails.firstname;
          //getting field customisation data and check if all fields added in data model are available in db through common service file
          if (
            allData.superUserDetails.expenseSettings && typeof allData.superUserDetails.expenseSettings !== 'undefined' && allData.superUserDetails.expenseSettings !== null
          ) {
            this.expenseSettings = allData.superUserDetails.expenseSettings;
            if (allData.superUserDetails.expenseSettings) {
              this.commonService.checkCustomField(defaultExpenseSettings.CONST_VALUE, allData.superUserDetails.expenseSettings);
            }
          }

          //getting all the customisable fieldnames
          if (this.superUserDetails.fieldNames) {
            this.fieldNameContact = this.superUserDetails.fieldNames.fieldNameContact;
            this.fieldNameSale = this.superUserDetails.fieldNames.fieldNameSale;
            this.fieldNameExpense = this.superUserDetails.fieldNames.fieldNameExpense;
            this.fieldNameOrganization = this.superUserDetails.fieldNames.fieldNameOrganization? this.superUserDetails.fieldNames.fieldNameOrganization: 'Organization';
          }

          //getting currency
          this.currency = allData.superUserDetails.currency;
          //getting category list
          this.categoryList = allData.superUserDetails.expenseCategory;
          //get total attachment size from db
          this.attachmentSize = this.superUserDetails.totalAttachmentsSize;
          if (!this.attachmentSize) {
            this.attachmentSize = 0;
          }
          this.totalUserCount = allData.superUserDetails.noSubusers + 1;
          this.currentlyUploaded = allData.superUserDetails.totalAttachmentsSize;
          //getting the current user's subscribed plan
          this.plan = allData.superUserDetails.plan;
          if (this.plan == 'diamond') {
            this.totalUploadLimit =
              this.uploadFileLimit.diamond * this.totalUserCount;
          } else if (this.plan == 'gold') {
            this.totalUploadLimit =
              this.uploadFileLimit.gold * this.totalUserCount;
          } else {
            this.totalUploadLimit =
              this.uploadFileLimit.free * this.totalUserCount;
          }
          this.uploadPercentage = Math.round(
            (this.currentlyUploaded / this.totalUploadLimit) * 100
          );

          ///add'n fields
          this.additionalFields = allData.superUserDetails.customFieldsExpense;
          //find the no of active additionals fields
          this.additionalFields?.forEach((field) => {
            if (field.isActive) {
              this.activeFieldsLength = this.activeFieldsLength + 1;
            }
          });

          //update mode
          if (this.data?.mode == 'update' && this.expReset && this.formReset) {
            //after first entry, reset during subscription is prevented using formReset flag
            this.formReset = false;
            let enterOnce = true;

            this.expenseDetails = this.commonService.getExpenseToEdit();
            //checking is data is found in common service file
            if (this.expenseDetails) {
              if (enterOnce) {
                this.prevCustId = this.expenseDetails.customerId;
                this.prevSaleId = this.expenseDetails.saleId;
                enterOnce = false;
              }
              //expense id
              this.expenseID = this.expenseDetails.id;
              //customer details
              this.customerId = this.expenseDetails.customerId;
              if (this.customerId) {
                this.contactSelected = true;
              }
              this.customerFirstName = this.expenseDetails.customerFirstName;
              this.customerSecondName = this.expenseDetails.customerSecondName;
              this.previousCustomerName = this.expenseDetails.customerSecondName
                ? this.expenseDetails.customerFirstName +
                  ' ' +
                  this.expenseDetails.customerSecondName
                : this.expenseDetails.customerFirstName;

              //organisation details
              this.orgId = this.expenseDetails?.orgId
                ? this.expenseDetails?.orgId
                : null;
              this.prevOrgId = this.expenseDetails?.orgId
                ? this.expenseDetails?.orgId
                : null;
              if (this.orgId) {
                this.companySelected = true;
              }
              this.customerCompany = this.expenseDetails.customerCompany
                ? this.expenseDetails.customerCompany
                : null;
              this.prevOrgName = this.expenseDetails.customerCompany
                ? this.expenseDetails.customerCompany
                : null;

              //sale details
              this.saleId = this.expenseDetails.saleId;
              this.saleTitle = this.expenseDetails.saleTitle;
              this.prevSaleTitle = this.expenseDetails.saleTitle;

              this.expDate = this.expenseDetails.expenseDate.toDate();
              this.currency = this.expenseDetails.currency;
              this.previousCurrency = this.expenseDetails.currency;
              this.amount = this.expenseDetails.amount;
              this.previousAmount = this.expenseDetails.amount;
              this.descriptions = this.expenseDetails.descriptions;
              this.category = this.expenseDetails.category;

              this.addFieldsArray = this.expenseDetails.additionalFieldsArr;
              //get expense changelog
              this.expenseChangeLog = this.expenseDetails.changeLog
                ? this.expenseDetails.changeLog
                : {};
            } else {
              //getting all corresponding data related to expense using expense id
              this.expenseData = this.db.getExpenseDetails(
                this.superUserId,
                this.data?.expenseId
              );
              this.expenseDetailsSubscription = this.expenseData.subscribe(
                async (data) => {
                  this.expenseDetails = data;
                  if (enterOnce) {
                    this.prevCustId = data?.customerId;
                    this.prevSaleId = data?.saleId;
                    enterOnce = false;
                  }
                  //expense id
                  this.expenseID = this.data?.expenseId;
                  //customer details
                  this.customerId = data?.customerId;
                  if (this.customerId) {
                    this.contactSelected = true;
                  }
                  this.customerFirstName = data?.customerFirstName;
                  this.customerSecondName = data?.customerSecondName;
                  this.previousCustomerName = data?.customerSecondName
                    ? data?.customerFirstName + ' ' + data?.customerSecondName
                    : data?.customerFirstName;

                  //organisation details
                  this.orgId = data?.orgId ? data?.orgId : null;
                  this.prevOrgId = data?.orgId ? data?.orgId : null;
                  if (this.orgId) {
                    this.companySelected = true;
                  }
                  this.customerCompany = data?.customerCompany;
                  this.prevOrgName = data?.customerCompany
                    ? data?.customerCompany
                    : null;

                  //sale details
                  this.saleId = data?.saleId;
                  this.saleTitle = data?.saleTitle;
                  this.prevSaleTitle = data?.saleTitle;

                  this.expDate = data?.expenseDate.toDate();
                  this.currency = data?.currency;
                  this.previousCurrency = data?.currency;
                  this.amount = data?.amount;
                  this.previousAmount = data?.amount;
                  this.descriptions = data?.descriptions;
                  this.category = data?.category;

                  this.addFieldsArray = data?.additionalFieldsArr;
                  //get expense changelog
                  this.expenseChangeLog = data?.changeLog
                    ? data?.changeLog
                    : {};
                }
              );
            }

            //additional fields
            if (this.addFieldsArray) {
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

            //getting sales for customer if prev expense have customer id
            if (this.customerId) {
              this.getSalesForCustomer(this.superUserId, this.customerId);
            }

            // attachments fetching
            this.attachmentSubscription = this.db
              .getAttachments(this.superUserId, this.expenseDetails.id)
              .pipe(takeUntil(this.onDestroy$))
              .subscribe((data) => {
                this.attachments = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Attachments;
                });
                if (this.attachments) {
                  const attachmentsArray: any = Object.values(
                    this.attachments
                  );
                  this.attachments = attachmentsArray.sort(
                    (objA, objB) => Number(objB.date) - Number(objA.date)
                  );
                }
              });

            //reactive form for  update mode
            this.userForm = this.fb.group({
              expenseDate: [this.expDate, Validators.required],
              currency: [this.currency, Validators.required],
              amount: [this.amount, Validators.required],
              searchOrg: ['Org'],
              org: [this.orgId],
              selectedCust: [this.customerFirstName],
              saleTitleValue: [this.saleTitle],
              description: [this.descriptions],
              category: [this.category, Validators.required],
              additionalFields: this.fb.array([]),
            });

            //customisable field
            this.expenseValidation();
            //push additional fields to form array
            this.additionalFieldsEdit();
            
            //save the previous form to create change log
            this.previousForm = ChangeLogComponent.cloneAbstractControl(
              this.userForm
            );
            //find change log length
            this.changeLogLength = Object.keys(this.expenseChangeLog).length;
          }
          //create mode
          if (this.data?.mode == 'create' && this.expReset && this.formReset) {
            //after first entry, reset during subscription is prevented using formReset flag
            this.formReset = false;
            //get customer data from data
            this.customerId = this.data?.cid ? this.data?.cid : null;
            this.customerFirstName = this.data?.cfname
              ? this.data?.cfname
              : null;
            this.customerSecondName = this.data?.csname
              ? this.data?.csname
              : null;
            if (this.customerId) {
              this.contactSelected = true;
            }
            //get org details from data
            this.orgId = this.data.orgId ? this.data.orgId : null;
            this.customerCompany = this.data?.company
              ? this.data?.company
              : null;
            if (this.orgId) {
              this.companySelected = true;
            }
            //get sale details from data
            this.saleId = this.data?.sid ? this.data?.sid : null;
            this.saleTitle = this.data?.saleTitle ? this.data?.saleTitle : null;

            //getting sales for customer if prev expense have customer id
            if (this.customerId) {
              this.getSalesForCustomer(this.superUserId, this.customerId);
            }

            // reactive form for expense when data-mode is create
            this.userForm = this.fb.group({
              expenseDate: [null, Validators.required],
              currency: ['INR', Validators.required],
              amount: [null, Validators.required],
              searchOrg: ['Org'],
              org: [this.orgId],
              selectedCust: [null],
              saleTitleValue: [null],
              description: [null],
              category: [null, Validators.required],
              additionalFields: this.fb.array([]),
            });

            //customisable field
            this.expenseValidation();
            //push additional fields to form array
            this.additionalFieldsDefault();
          }
          //createFromList mode
          if (
            this.data?.mode == 'createFromList' &&
            this.expReset &&
            this.formReset
          ) {
            //after first entry, reset during subscription is prevented using formReset flag
            this.formReset = false;
            this.userForm = this.fb.group({
              expenseDate: [null, Validators.required],
              currency: ['INR', Validators.required],
              amount: [null, Validators.required],
              searchOrg: [null],
              org: [null],
              selectedCust: [null],
              saleTitleValue: [null],
              description: [null, Validators.required],
              category: [null, Validators.required],
              additionalFields: this.fb.array([]),
            });
            //customisable field
            this.expenseValidation();
            //push additional fields to form array
            this.additionalFieldsDefault();
          }
        }
      }
    );
  }

  ngOnInit(): void {}

  //to get userForm controls
  get userFormControls() {
    return this.userForm?.controls;
  }
  //to get additional fields form array
  get additionalField(): FormArray {
    return this.userForm?.get('additionalFields') as FormArray;
  }
  //get default values for additional fields
  additionalFieldsDefault(){
    //push additional fields into additionalFields form array
    this.additionalFields?.forEach((field) => {
      if (field.fieldType == 'date') {
        if (field.mandatory == true) {
          (this.userForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [
                field.defaultValue ? field.defaultValue.toDate() : '',
                Validators.required,
              ],
              fieldName: field.fieldName,
            })
          );
        } else if (field.mandatory == false) {
          (this.userForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [
                field.defaultValue ? field.defaultValue.toDate() : '',
              ],
              fieldName: field.fieldName,
            })
          );
        }
      } else if (field.fieldType == 'date_time') {
        if (field.mandatory == true) {
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
        } else if (field.mandatory == false) {
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
        }
      } else {
        if (field.mandatory == true) {
          (this.userForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.defaultValue, Validators.required],
              fieldName: field.fieldName,
            })
          );
        } else if (field.mandatory == false) {
          (this.userForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.defaultValue],
              fieldName: field.fieldName,
            })
          );
        }
      }
    });
  }
  //get default values for additional fields
  additionalFieldsEdit(){
    //push additional fields into additionalFields form array
    this.additionalFields?.forEach((field) => {
      if (field.fieldType == 'date') {
        if (field.mandatory == true) {
          (this.userForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [
                field.value ? field.value.toDate() : '',
                Validators.required,
              ],
              fieldName: field.fieldName,
            })
          );
        } else if (field.mandatory == false) {
          (this.userForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.value ? field.value.toDate() : ''],
              fieldName: field.fieldName,
            })
          );
        }
      } else if (field.fieldType == 'date_time') {
        if (field.mandatory == true) {
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
        } else if (field.mandatory == false) {
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
        }
      } else {
        if (field.mandatory == true) {
          (this.userForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.value, Validators.required],
              fieldName: field.fieldName,
            })
          );
        } else if (field.mandatory == false) {
          (this.userForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.value],
              fieldName: field.fieldName,
            })
          );
        }
      }
    });
  }
  //customisable field
  expenseValidation(){
    if (this.expenseSettings) {
      // expense date
      if (this.expenseSettings?.expenseDate?.mandatory === true) {
        this.userForm.controls['expenseDate'].setValidators([
          Validators.required,
        ]);
      } else {
        this.userForm.controls['expenseDate'].clearValidators();
      }
      this.userForm.controls['expenseDate'].updateValueAndValidity();
      //currency
      if (this.expenseSettings?.currency?.mandatory === true) {
        this.userForm.controls['currency'].setValidators([
          Validators.required,
        ]);
      } else {
        this.userForm.controls['currency'].clearValidators();
      }
      this.userForm.controls['currency'].updateValueAndValidity();
      //amount
      if (this.expenseSettings?.amount?.mandatory === true) {
        this.userForm.controls['amount'].setValidators([
          Validators.required,
        ]);
      } else {
        this.userForm.controls['amount'].clearValidators();
      }
      this.userForm.controls['amount'].updateValueAndValidity();
      //descriptions
      if (this.expenseSettings?.description?.mandatory === true) {
        this.userForm.controls['description'].setValidators([
          Validators.required,
        ]);
      } else {
        this.userForm.controls['description'].clearValidators();
      }
      this.userForm.controls['description'].updateValueAndValidity();
      //category
      if (this.expenseSettings?.category?.mandatory === true) {
        this.userForm.controls['category'].setValidators([
          Validators.required,
        ]);
      } else {
        this.userForm.controls['category'].clearValidators();
      }
      this.userForm.controls['category'].updateValueAndValidity();
    }
  }
  //on removing customer chip
  onClearContact() {
    this.customerId = null;
    this.customerFirstName = null;
    this.customerSecondName = null;
    this.contactSelected = false;
    this.userForm.controls.selectedCust.reset();
    this.userForm.controls.selectedCust.markAsDirty();
    this.saleId = null;
    this.saleTitle = null;
    this.userForm.controls.saleTitleValue.reset();
    this.userForm.controls.saleTitleValue.markAsDirty();
  }
  //on removing organisation chip
  onClearCompany() {
    this.orgId = null;
    this.customerCompany = null;
    this.companySelected = false;
    this.userForm.controls.org.reset();
    this.userForm.controls.org.markAsDirty();
  }
  //on removing sale chip
  onClearSale() {
    this.saleId = null;
    this.saleTitle = null;
    this.userForm.controls.saleTitleValue.reset();
    this.userForm.controls.saleTitleValue.markAsDirty();
  }
  //get customer details
  getCustomerDetails(superUserId, custId) {
    return new Promise<Object>(async (resolve) => {
      this.db.getCustDetails(superUserId, custId).subscribe((data) => {
        if (data) resolve(data);
      });
    });
  }
  //get organisation details
  getOrganisationDetails(superUserId, orgId) {
    return new Promise<Object>(async (resolve) => {
      this.db.getOrgDetails(superUserId, orgId).subscribe((data) => {
        if (data) resolve(data);
      });
    });
  }
  //get sales for a particular customer selected
  getSalesForCustomer(superUserId, custId) {
    return new Promise<Object[]>(async (resolve) => {
      this.saleCustomerSubscription = this.db
        .getSalesForCust(superUserId, custId)
        .subscribe((data) => {
          this.sales = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Sales;
          });
          resolve(data);
        });
    });
  }
  //selecting customer name from list
  async contSelectedEventHander(event) {
    let cust = event;
    // customer id
    this.customerId = cust?.id;
    if (this.customerId) {
      this.contactSelected = true;
    }
    this.customerFirstName = cust?.firstName ? cust?.firstName : null;
    this.customerSecondName = cust?.secondName ? cust?.secondName : null;
    //organisation details
    if (cust?.orgId) {
      this.orgId = cust?.orgId;
      this.customerCompany = cust?.companyName ? cust?.companyName : null;
      this.companySelected = true;
    }

    this.sales = null;
    this.saleId = null;
    this.saleTitle = null;
    this.userForm.controls.saleTitleValue.reset();
    this.userForm.controls.saleTitleValue.markAsDirty();

    //getting all sales for that customer selected in
    if (this.customerId) {
      this.getSalesForCustomer(this.superUserId, this.customerId);
    }
  }
  //returns the orgId from common-org component
  orgIdEventHander($event) {
    if ($event) {
      this.orgId = $event;
      if (this.orgId) {
        this.companySelected = true;
      }
    }
  }
  //returns the company name from common-org component
  orgNameEventHander($event) {
    if ($event) {
      this.customerCompany = $event;
    }
  }
  //selecting sale title in list
  onSaleTitle(value) {
    //seperating saletitle and sale if from variable
    this.saleTitle = value.saleTitle;
    this.saleId = value.id;
  }
  //submit from normal form
  onSubmit(form, GAevent) {
    this.analytics.logEvent(GAevent); //google analytics load
    let datePlaced = new Date().getTime(); //Get TimeStamp

    //additional fields
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

    //if no customer is selected in expense form
    if (!this.customerId) {
      this.customerId = null;
      this.customerFirstName = null;
      this.customerSecondName = null;
      this.saleId = null;
      this.saleTitle = null;
    }
    if (!this.orgId) {
      this.customerCompany = null;
    }

    //checking customer is selected
    if (this.customerId) {
      //checking where sale is not selected
      if (!this.saleId) {
        this.saleId = null;
        this.saleTitle = null;
      }
    }

    let formDetails = {
      customerId: this.customerId,
      customerFirstName: this.customerFirstName,
      customerSecondName: this.customerSecondName,
      orgId: this.orgId,
      customerCompany: this.customerCompany,
      saleId: this.saleId,
      saleTitle: this.saleTitle,
      amount: form.value.amount,
      category: form.value.category,
      currency: form.value.currency,
      descriptions: form.value.description,
      expenseDate: form.value.expenseDate,
      createdById: this.userId
    };
    //add expense changelog
    let expenseChangeLog = ChangeLogComponent.saveLog(
      this.constructor.name,
      this.userId,
      this.userName,
      '',
      '',
      {}
    );
    this.db
      .createExpenses(
        this.superUserId,
        datePlaced,
        formDetails,
        additionalFields,
        expenseChangeLog
      )
      .then(async (docRef) => {
        if (this.customerId) {
          await this.getSalesForCustomer(this.superUserId, this.customerId);
          let customer = this.customers.filter(
            (customer) => customer.id === this.customerId
          );
          if (customer.length > 0) {
            //Add changelog for customer
            let changeLog = ChangeLogComponent.saveLog(
              this.data?.componentName,
              this.userId,
              this.userName,
              '',
              {
                addedExpense: {
                  amount: form.value.amount,
                  currency: form.value.currency,
                },
              },
              customer[0].changeLog
            );
            this.db.updateChangeLog(
              this.superUserId,
              'customers',
              this.customerId,
              changeLog
            );
          }
        }
        if (this.saleId) {
          let sale = this.sales.filter((sale) => sale.id === this.saleId);
          if (sale.length > 0) {
            //Add changelog for customer
            let changeLog = ChangeLogComponent.saveLog(
              this.data?.componentName,
              this.userId,
              this.userName,
              '',
              {
                addedExpense: {
                  amount: form.value.amount,
                  currency: form.value.currency,
                },
              },
              sale[0].changeLog
            );
            this.db.updateChangeLog(
              this.superUserId,
              'sales',
              this.saleId,
              changeLog
            );
          }
        }
        if (this.orgId) {
          let org = this.organisations.filter((org) => org.id === this.orgId);
          if (org.length > 0) {
            //Add changelog for customer
            let changeLog = ChangeLogComponent.saveLog(
              this.data?.componentName,
              this.userId,
              this.userName,
              '',
              {
                addedExpense: {
                  amount: form.value.amount,
                  currency: form.value.currency,
                },
              },
              org[0].changeLog
            );
            this.db.updateChangeLog(
              this.superUserId,
              'Organisations',
              this.orgId,
              changeLog
            );
          }
        }

        if (this.uploadedFiles.length > 0) {
          for (let i = 0; i < this.uploadedFiles.length; i++) {
            this.db
              .attachmentsToCollection(
                this.superUserId,
                docRef.id,
                this.uploadedFiles[i].str,
                this.uploadedFiles[i].downloadURL,
                this.uploadedFiles[i].filePath,
                this.uploadedFiles[i].date,
                this.uploadedFiles[i].name,
                this.uploadedFiles[i].size
              )
              .then((res) => {
                this._snackBar.open('Attachment added successfully', '', {
                  duration: 2000,
                });
                this.commonService.updateStatus(false);
              })
              .catch((e) => {
                this._snackBar.open('Error!!! Attachment not added', '', {
                  duration: 2000,
                });
                this.commonService.updateStatus(false);
              });
          }
        }
        //updating total expense value in  sales starts here
        //checking whether sale is selected to update expense amount in sale
        if (this.saleId) {
          this.updatingTotalExpenseSale(this.saleId);
          //updating expense amount in sale ends here
        }
      });
    //close popup
    this.dialogRef.close();
    let message = this.fieldNameExpense + ' added successfully';
    this._snackBar.open(message, '', {
      duration: 2000,
    });
  }
  //updating expense from form
  onUpdate(form: FormGroup) {
    let customerFirstName;
    let customerSecondName;
    let customerCompany;

    if (this.customerId) {
      form.value.customerId = this.customerId;
      customerFirstName = this.customerFirstName;
      customerSecondName = this.customerSecondName;

      if (this.saleId) {
        form.value.saleId = this.saleId;
        form.value.saleTitle = this.saleTitle;
      } else {
        form.value.saleId = null;
        form.value.saleTitle = null;
      }
    } else {
      form.value.customerId = null;
      customerFirstName = null;
      customerSecondName = null;
      form.value.saleId = null;
      form.value.saleTitle = null;
    }

    if (!this.orgId) {
      customerCompany = null;
    } else {
      customerCompany = this.customerCompany;
    }

    let additionalFields = <addFieldsArr>{};//additional field controls
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
//expense details object
    let formDetails = {
      customerId: form.value.customerId,
      customerFirstName: customerFirstName,
      customerSecondName: customerSecondName,
      orgId: this.orgId,
      customerCompany: customerCompany,
      saleId: form.value.saleId,
      saleTitle: form.value.saleTitle,
      amount: form.value.amount,
      category: form.value.category,
      currency: form.value.currency,
      descriptions: form.value.description,
      expenseDate: form.value.expenseDate,
    };

    let custId = form.value.customerId;
    let saleId = form.value.saleId;
    let customerName = customerSecondName
      ? customerFirstName + ' ' + customerSecondName
      : customerFirstName;
    //get newly uploaded files
    this.uploadedFiles.forEach((file, index) => {
      this.addedAttachments[index] = { addedAttachment: file.str };
    });

    //additionalData to pass to changeLog component to get payment org changes
    let additionalData = {
      currentOrgId: {
        orgId: this.orgId,
        companyName: customerCompany,
      },
      prevOrgId: {
        orgId: this.prevOrgId ? this.prevOrgId : null,
        companyName: this.prevOrgName,
      },
      //add contact name change to changelog
      currentContact: {
        //current value
        selectedCust: customerName ? customerName : null,
      },
      prevContact: {
        //previous value
        selectedCust: this.previousCustomerName
          ? this.previousCustomerName
          : null,
      },
      // addedAttachments: this.addedAttachments,
      // deletedAttachments: this.deletedAttachments,
    };
    //To add sale title to changelog
    if (saleId != this.prevSaleId) {
      this.previousForm.addControl(
        'saleTitle',
        new FormControl(this.prevSaleTitle, Validators.required)
      );
      form.addControl(
        'saleTitle',
        new FormControl(form.value.saleTitle, Validators.required)
      );
      if (this.prevSaleTitle != form.value.saleTitle) {
        form.get('saleTitle').markAsDirty();
      }
    }
    form.get('saleTitleValue').markAsPristine();
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
      
    let newExpenseChangeLog = ChangeLogComponent.saveLogReactiveForm(
      this.constructor.name,
      this.userId,
      this.userName,
      this.previousForm,
      form,
      this.expenseChangeLog,
      additionalData
    );
    if (newExpenseChangeLog == null)
      newExpenseChangeLog = this.expenseChangeLog;

    //update expense with updated details
    this.db
      .updateExpenses(
        this.superUserId,
        this.expenseID,
        formDetails,
        additionalFields,
        newExpenseChangeLog
      )
      .then((res) => {
        if (custId) {
          let customer: any;
          //get customer details to get customer changelog
          this.getCustomerDetails(this.superUserId, custId).then((data) => {
            customer = data;
            if (customer) {
              if (newChangeLog) {
                //Add changelog for customer
                let changeLog = ChangeLogComponent.saveLog(
                  this.data?.componentName,
                  this.userId,
                  this.userName,
                  {
                    editedExpense: {
                      amount: newChangeLog[0].previousValues.amount
                        ? newChangeLog[0].previousValues.amount
                        : form.value.amount,
                      currency: newChangeLog[0].previousValues.currency
                        ? newChangeLog[0].previousValues.currency
                        : form.value.currency,
                      changedValues: newChangeLog[0].previousValues,
                    },
                  },
                  {
                    editedExpense: {
                      amount: form.value.amount,
                      currency: form.value.currency,
                      changedValues: newChangeLog[0].currentValues,
                    },
                  },
                  customer.changeLog
                );
                //update customer db
                this.db.updateChangeLog(
                  this.superUserId,
                  'customers',
                  custId,
                  changeLog
                );
              }
            }
          });
        }
        if (saleId) {
          this.getSalesForCustomer(this.superUserId, custId);
          let sale = this.sales.filter((sale) => sale.id === saleId);
          if (sale.length > 0) {
            if (newChangeLog) {
              //Add changelog for sales
              let changeLog = ChangeLogComponent.saveLog(
                this.data?.componentName,
                this.userId,
                this.userName,
                {
                  editedExpense: {
                    amount: newChangeLog[0].previousValues.amount
                      ? newChangeLog[0].previousValues.amount
                      : form.value.amount,
                    currency: newChangeLog[0].previousValues.currency
                      ? newChangeLog[0].previousValues.currency
                      : form.value.currency,
                    changedValues: newChangeLog[0].previousValues,
                  },
                },
                {
                  editedExpense: {
                    amount: form.value.amount,
                    currency: form.value.currency,
                    changedValues: newChangeLog[0].currentValues,
                  },
                },
                sale[0].changeLog
              );
              //update sales db
              this.db.updateChangeLog(
                this.superUserId,
                'sales',
                saleId,
                changeLog
              );
            }
          }
        }
        if (this.orgId) {
          let org: any;
          //get org details to get org changelog
          this.getOrganisationDetails(this.superUserId, this.orgId).then(
            (data) => {
              org = data;
              if (org) {
                //Add changelog for org
                if (newChangeLog) {
                  //Add changelog for org
                  let changeLog = ChangeLogComponent.saveLog(
                    this.data?.componentName,
                    this.userId,
                    this.userName,
                    {
                      editedExpense: {
                        amount: newChangeLog[0].previousValues.amount
                          ? newChangeLog[0].previousValues.amount
                          : form.value.amount,
                        currency: newChangeLog[0].previousValues.currency
                          ? newChangeLog[0].previousValues.currency
                          : form.value.currency,
                        changedValues: newChangeLog[0].previousValues,
                      },
                    },
                    {
                      editedExpense: {
                        amount: form.value.amount,
                        currency: form.value.currency,
                        changedValues: newChangeLog[0].currentValues,
                      },
                    },
                    org.changeLog
                  );
                  //update org db
                  this.db.updateChangeLog(
                    this.superUserId,
                    'Organisations',
                    this.orgId,
                    changeLog
                  );
                }
              }
            }
          );
        }
        //checking whether previous sale id was present and getting expense list
        if (this.prevSaleId && this.prevSaleId != this.saleId) {
          this.updatingTotalExpenseSale(this.prevSaleId);
        }
        
        if (this.saleId) {
          this.updatingTotalExpenseSale(this.saleId);
        }
      });
    //closing popup
    this.dialogRef.close();
    let message = this.fieldNameExpense + ' Successfully Updated';
    this._snackBar.open(message, '', {
      duration: 2000,
    });
  }
  //for updating total updated expense
  updatingTotalExpenseSale(saleId) {
    //getting expenses with selected sale
    this.expensePaymentSubscription = this.db
      .getExpensePaymentSale(this.superUserId, saleId)
      .pipe(take(1))
      .subscribe((data) => {
        this.ExpensePayments = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Expenses;
        });
        this.totalExpenseAmountCollected = 0;
        //totaling new total expense
        this.ExpensePayments.forEach((ele) => {
          this.totalExpenseAmountCollected =
            this.totalExpenseAmountCollected + ele.amount;
        });
        if (this.ExpensePayments?.length == 0) {
          this.totalExpenseAmountCollected = 0;
        }
        //updating new total expense value in db
        this.db.updateExpenseAmountSale(
          this.superUserId,
          saleId,
          this.totalExpenseAmountCollected
        );
      });
  }
 
  //for closing popup
  async closed() {
    //to remove uploaded file from firebase storage on cancel of popup
    if (this.uploadedFiles.length > 0) {
      let newSize = this.attachmentSize;
      for (let i = 0; i < this.uploadedFiles.length; i++) {
        const storageRef = firebase.default.storage().ref();
        // [START storage_delete_file]
        // Create a reference to the file to delete
        var desertRef = storageRef.child(this.uploadedFiles[i].filePath);
        // Delete the file
        desertRef.delete();
        // [END storage_delete_file]
        newSize = newSize - this.uploadedFiles[i].size
        this.db.updateSize(this.superUserId, newSize);
        if (this.data?.mode == 'update') {
          this.db.deleteDoc(
            this.superUserId,
            this.expenseID,
            this.uploadedFiles[i].id
          );
          let changeLogLength = Object.keys(this.expenseChangeLog).length;
          delete this.expenseChangeLog[changeLogLength - 1];
          this.db.updateChangeLog(this.superUserId, 'Expenses', this.expenseID, this.expenseChangeLog)
        }
      }
    }
    
    //for closing popup
    this.dialogRef.close();
  }

  inputAttachment() {
    //prevent form resetting while updating attachment size on uploading document
    this.expReset = false;
    // this.file.nativeElement.value = '';
    let element: HTMLElement = document.getElementsByName(
      'attachmentExp'
    )[0] as HTMLElement;
    this.file.nativeElement.value = '';
    element.click();
  }

  // upload attachhment
  uploadAttachmentExp(event) {
    //if any file is selected, event.target.files will contain the list of selected files
    //if this check not placed,this function will be executed even if we select a file and cancel the upload
    if (event.target.files.length > 0) {
      let date = new Date().getTime();
      let str;
      let size;
      let downloadURL;
      let file;
      let newSize;
      let name = this.userName;
      //get file name
      str = event.target.files[0].name;
      file = event.target.files[0];
      //get file size
      size = event.target.files[0].size / 1024 / 1024;
      //find the new size after uploading the file
      newSize = this.attachmentSize + size;
      //check if total file size exceeds upload size limit
      if (newSize > this.totalUploadLimit && this.plan == 'diamond') {
        //show file size limit exceeded message for diamond plan
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: 'diamond',
            size: this.uploadFileLimit.diamond,
          },
        });
      } else if (newSize > this.totalUploadLimit && this.plan == 'gold') {
        //show file size limit exceeded message for gold plan
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: 'gold',
            size: this.uploadFileLimit.gold,
          },
        });
      } else if (newSize > this.totalUploadLimit && this.plan == 'free') {
        //show file size limit exceeded message for free plan
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: 'free',
            size: this.uploadFileLimit.free,
          },
        });
      } 
      //if file size not exceeded
      else {
        //construct the file path to store attachment for tasks in db
        const filePath = `attachment/${this.userId}/Expenses/${Date.now()}_${str}`;
        //if mode is update
        if (this.data?.mode == 'update') {
          let addedAttachments = [];
          addedAttachments.push({
              'addedAttachment': str
            });
          //add the attached file details to changelog
          this.expenseChangeLog = ChangeLogComponent.saveLog(
            this.constructor.name,
            this.userId,
            this.userName,
            '',
            { addedAttachments: addedAttachments},
            this.expenseChangeLog
          );
        }
        //calls function to upload attachment
        this.uploadAttachment(
          filePath,
          file,
          this.expenseID,
          str,
          date,
          name,
          size,
          newSize,
          'Expenses',
          '',
          this.expenseChangeLog
        );
        // this._snackBar.open('Attachment added successfully', '', {
        //   duration: 2000,
        // });
      }
    }
  }
  //function to upload attachment
  uploadAttachment(
    filePath,
    file,
    expenseId,
    str,
    date,
    name,
    size,
    newSize,
    form,
    otherId,
    changeLog
  ) {
    //set upload status in commonservice file
    this.commonService.updateStatus(true);
    this.fileUploading = true;
    let downloadURL;
    //upload file to storage
    const task = this.storage.upload(filePath, file);
    //get storage reference to the file
    const ref = this.storage.ref(filePath);
    //get upload percentage
    this.uploadProgress$ = task.percentageChanges();
    task
      .snapshotChanges()
      .pipe(
        finalize(async () => {
          downloadURL = await ref.getDownloadURL().toPromise();
          if (form === 'Expenses') {
            if (this.data?.mode == 'update') {
              this.db
                .attachmentsToCollection(
                  this.superUserId,
                  expenseId,
                  str,
                  downloadURL,
                  filePath,
                  date,
                  name,
                  size
                )
                .then((res) => {
                  //update total file size
                  this.db.updateSize(this.superUserId, newSize);
                  if (changeLog) {
                    //update changelog
                    this.db.updateChangeLog(
                      this.superUserId,
                      'Expenses',
                      this.expenseID,
                      changeLog
                    );
                  }
                  //add uploaded file to temp array uploaded files
                  this.uploadedFiles.push({
                    id: res.id,
                    filePath: filePath,
                    downloadURL: downloadURL,
                    file: file,
                    expenseId: expenseId,
                    str: str,
                    date: date,
                    name: name,
                    size: size,
                    newSize: newSize,
                  });
                  //add uploaded file to temp array attachments
                  this.attachments.push({
                    fileName: str,
                    id: res.id,
                    downloadURL: downloadURL,
                    path: filePath,
                    date: date,
                    uploaded: name,
                    size: size,
                  });
                  //show attachment uploaded message
                  this._snackBar.open('Attachment added successfully', '', {
                    duration: 2000,
                  });
                  //update commonservice file upload status as false
                  this.commonService.updateStatus(false);
                })
                .catch((e) => {
                  //if upload fails, show error message
                  this._snackBar.open('Error!!! Attachment not added', '', {
                    duration: 2000,
                  });
                  this.commonService.updateStatus(false);
                });
            } 
            //for create mode do not upload the file to attachments collection now.
            //file uploaded on submit only
            else {
              //add uploaded file to temp array uploaded files
              this.uploadedFiles.push({
                id: this.fileID,
                filePath: filePath,
                downloadURL: downloadURL,
                file: file,
                expenseId: expenseId,
                str: str,
                date: date,
                name: name,
                size: size,
                newSize: newSize,
              });
              //add uploaded file to temp array attachments
              this.attachments.push({
                fileName: str,
                id: this.fileID,
                downloadURL: downloadURL,
                path: filePath,
                date: date,
                uploaded: name,
                size: size,
              });
              //file ID incremented to use for next uploaded file
              //helps in tracking file for delete
              this.fileID = this.fileID + 1;
              //to prevent form reset issue on updating total filesize under superuser
              this.expReset = false;
              //update total file size under superuser
              this.db.updateSize(this.superUserId, newSize);
              //attachment uploaded message
              this._snackBar.open('Attachment uploaded successfully', '', {
                duration: 2000,
              });
              //update commonservice file after upload
              this.commonService.updateStatus(false);
            }
          }
          //file uploading completed
          this.fileUploading = false;
        })
      )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
    //get download url
    this.snapshot = task.snapshotChanges().pipe(
      finalize(async () => {
        this.downloadUrl = await ref.getDownloadURL().toPromise();
      })
    );
  }
  //calls when file uploading completed
  uploadComplete() {
    //set upload status flag false
    this.fileUploading = false;
  }
  //to delete attachment
  deleteAttach(item) {
    //prevent form resetting while updating attachment size on deleting document
    this.expReset = false;
    let deletedAttachments = [];
    deletedAttachments.push({
      deletedAttachment: item.fileName,
    });
    //open confirmation popup to confirm delete
    let dialog = this.dialog.open(ConfirmationpopupComponent, {
      data: {
        expId: this.expenseID,
        scenario: this.data?.mode != 'update' ? 'create' : 'update',
        smode: 'attachmentDeleteExp',
        path: item.path,
        itemId: item.id ? item.id : null,
        url: item.downloadURL,
        orginalPath: item.fileName,
        userId: this.superUserId,
        componentName: this.data?.componentName,
        userName: this.userName,
        size: item.size,
        changeLog: this.expenseChangeLog,
        deletedAttachments: deletedAttachments
      },
    });
    //in case of create scenarios, if uploaded file is deleted, remove it from this.attachments and this.uploaded file
    //delete if cancel delete is not done
    dialog.afterClosed().subscribe((result) => {
      if (result != 'cancel') {
        
        //find the index of the item in the temp array attachments
        this.attachments.forEach((elem, index) => {
          if (elem.id == item.id) {
            //remove item from that index
            this.attachments.splice(index, 1);
          }
        });
        //delete the item from uploaded files as well
        this.uploadedFiles.forEach((elem, index) => {
          if (elem.id == item.id) {
            //remove item from that index
            this.uploadedFiles.splice(index, 1);
          }
        });
      }
    });
  }
  
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    //unsubscribing subscription
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.expenseDetailsSubscription?.unsubscribe;
    this.saleCustomerSubscription?.unsubscribe;
    this.expensePaymentSubscription?.unsubscribe;
    this.userDetailsSubscription?.unsubscribe;
    this.attachmentSubscription?.unsubscribe;
  }
}
