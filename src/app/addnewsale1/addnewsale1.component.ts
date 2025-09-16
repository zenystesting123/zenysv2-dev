/*********************************************************************************
Description: Component used for adding/editing sales
Inputs: sale details while updating
Outputs:
***********************************************************************************/

import { Addnewsale1Service } from './addnewsale1.service';
import { map, startWith } from 'rxjs/operators';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, Observable } from 'rxjs';
import {
  Profile,
  Sales,
  Customer,
  PaymentReceipt,
  Invoice,
  Task,
  Expenses,
  UserAccessDetails,
  customFields,
  SearchTermSale,
  ProductModel,
  ProductInSaleModel,
  prodmodel,
  addFieldsArr,
  ProductCategories,
  ProductSettings,
  itemMax,
  defaultProductSettings,
  saleSettings,
  defaultSaleSettings,
  FollowUps,
  SearchTerm,
  StageHistoryModel,
} from '../data-models';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NetworkCheckService } from '../networkcheck.service';
import { CommonService } from '../common.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Location } from '@angular/common';
import { ChangeLogComponent } from '../change-log/change-log.component';
import { AppCustomDirective } from '../app.validators';
import { Pipelines } from '../model/pipeline.modal';

@Component({
  selector: 'app-addnewsale1',
  templateUrl: './addnewsale1.component.html',
  styleUrls: ['./addnewsale1.component.scss'],
})
export class Addnewsale1Component implements OnInit, OnDestroy {
  userForm: FormGroup; //formcontrols for reactive form
  isProdCheckMandatory: boolean; //determines whether product should be added while creating a sale
  //to store customers name and company name
  custData: any = {
    firstName: null,
    secondName: null,
    surname: null,
    companyName: null,
  };
  //to store sale information
  userData: Sales = {
    rejectionReasonValue: '',
    taggedUsers: null,
    itemsArray: null,
    orgId: null,
    id: null,
    associatedBranch: null,
    firstName: null,
    secondName: null,
    surname: null,
    companyName: null,
    additionalFieldsArray: null,
    additionalFieldsArr: null,
    saleTitle: null,
    additionalFieldDate: null,
    description: null,
    estimatedValue: 0,
    expCompletionDate: null,
    startDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0
    ),
    salesStage: null,
    salesType: null,
    priority: null,
    assignedTo: null,
    assignedToName: null,
    collectionMode: null,
    saleField2: null,
    saleField1: null,
    saleField3: null,
    saleField4: null,
    saleCategory1: null,
    saleCategory2: null,
    saleField1Name: null,
    saleField2Name: null,
    saleField3Name: null,
    saleField4Name: null,
    collectedAmount: null,
    customerId: null,
    EstimatedValue: null,
    invoicedAmount: null,
    saleCategory1Name: null,
    saleCategory2Name: null,
    createdDate: null,
    days: null,
    daysRange: null,
    completedSaleDate: null,
    confirmedSaleDate: null,
    opportunityDate: null,
    inquiryDate: null,
    expenseAmount: null,
    stageHistory: null,
    searchTerm: null,
    sequenceNumber: null,
    selectedSalePipeline: 0,
    changeLog: null,
    inPipeline: null,
    won: null,
    lost: null,
    createdBy: null,
    contactOwner: null,
    lastAddedNote: '',
    lastNoteDate: null,
    lastNoteId: '',
    assignedToDate: null,
    lastModifiedDate: null,
    countryCode: '',
    contactNumber: '',
    altCountryCode: '',
    altContactNumber: '',
  };
  rejectionReasonArr: string[] = []; //rejection reason options saved as an array
  //to store additional field data
  additionalFieldModel: customFields = {
    fieldName: null,
    fieldType: null,
    categories: null,
    categoriesOpn: null,
    defaultValue: null,
    mandatory: null,
    value: null,
    isActive: null,
  };
  //model for storing additional fields of each customer
  addFieldArrModel: addFieldsArr = {
    fieldValue: null,
  };
  //to store customField object for sale under superuser
  additionalFields = [this.additionalFieldModel];
  //to store additional fields in sales
  addFieldsArray = [this.addFieldArrModel];
  titleName: string; //to store form heading nam
  allSubUsers: any[] = []; //to store subUsers based on access rule
  assignedToName: string; //assignedTo person's name
  loader: boolean = false; //to enable loader while uploading
  expenses: Expenses[]; //to store expenses array
  firstname: string; //store users firstname
  secondname: string; //store users second name
  surname: string; //store users surname
  userId: string; //to store user id
  superUserId: string; //store superuser id
  dataAccessRule: string; //to store access rule
  accountType: string; //to store account type of user
  forms: any; //to store saledetails while updating
  stageHistories: any[]; //to store history of stages in sale
  followupUpdated: boolean = false; //to check followup data updated in db
  taskUpdated: boolean = false; //to check task data updated in db
  expenseUpdated: boolean = false; //to check expense data updated in db
  paymentUpdated: boolean = false; //to check payment data updated in db
  quotUpdated: boolean = false; //to check quotation data updated in db
  invUpdated: boolean = false; //to check invoice data updated in db
  estUpdated: boolean = false; //to check estimate data updated in db
  stageHistory: any[] = []; //to store new stage history
  //to store stage values as data type
  stageValues: StageHistoryModel = {
    date: null,
    stageId: null,
    pipelineId: null,
  };
  paymentSubscription: Subscription; //for subscribing payment list
  taskSubscription: Subscription; //for subscribing task list
  followupSubscription: Subscription; //for subscribing followup list
  invoiceSubscription: Subscription; //for subscribing invoice list
  quotationSubscription: Subscription; //for subscribing quotation list
  estimateSubscription: Subscription; //for subscribing estimate list
  expenseSubscription: Subscription; //for subscribing estimate list
  userDetailsSubscription: Subscription; //for subscribing to user details
  saleUsersSubscription: Subscription; //for subscribing sales while updating

  payments: PaymentReceipt[] = []; //for storing payments list
  invoices: Invoice[] = []; //for storing invoice list
  quotations: Invoice[] = []; //for storing quotation list
  estimates: Invoice[] = []; //for storing estimate list
  tasks: Task[] = []; //for storing task list
  followups: FollowUps[] = []; //for storing followup list
  saleTitle: string; //to store the sale title
  networkConnection: boolean; //for checking is connection active or not
  usrDataProfile: UserAccessDetails; //user access details for all users
  userDataProfile: UserAccessDetails; //current user's user access details
  disableEditSale: boolean = false; //disabled fields in sale
  statusArray: any[]; //to store status of sale
  collectionMode: string; //to store collection mode of sale
  assignedTo: string; //to store sales assigned to value
  superUserDetails: Profile; //to store super user details
  fieldNameContact: string = 'Contact'; //setting default value for contact
  fieldNameSale: string = 'Sale'; //setting default values for sale
  fieldNameItems = 'Products and Service'; //setting default values for products and services
  fieldNameItemsCategory = 'Category'; //setting default values for category
  saleSequenceNumber: number; // for updating sequence number in user
  products: ProductModel[] = []; //all products fetched in create sale to show in autocomplete
  selectedProduct: any = null; //to store the selected product from the product list
  //filtered values to display in category autocomplete
  filteredOptionsCategory: Observable<string[]>;
  //filtered values to display in products autocomplete
  filteredOptionsProd: Observable<ProductModel[]>;
  addProdOption = false; //flag to disable adding more products if its turned off in settings
  disableEstOption = false; //disabled changing estimated value in the form
  plan: string; //to store user subscripton plan

  prod = new prodmodel(); //to store selected product as an obj
  prodArray = []; //array of products
  completeProdArray = []; //array of all products
  productEstValue = 0; //estimated value of the product
  prodCatArray: any = []; //array of product categories
  selectedSalePipeline: number; //index of selected sale pipeline name
  dateError = false; //to show date validation
  inPipeline = false; //check whether sale is in pipeline
  won = false; //check whether sale is won
  lost = false; //check whether sale is lost
  selProdCat = ''; //selected product category
  disableSubmit: boolean = false; //to disable submit button
  disableReAssign = false; //to prevent reassigning sale
  previousForm: FormGroup; //form group to store old form data before change
  changeLog: any; //to store changes in form
  userName: string; //current user's full name

  productSettings: ProductSettings = defaultProductSettings.CONST_VALUE; //customisable field names for products
  itemsQtyDisplay: boolean; //to display quantity in ui
  maxItems: number = itemMax.MAX_ITEM; //Allowed max no of items
  deletedProducts: any = {}; //currently deleted products
  addedProducts: any = {}; //currently added products
  saleSettings: saleSettings = defaultSaleSettings.CONST_VALUE; //customisable fieldnames for sales
  associatedBranch = ''; //branch name
  prevAssBranch = ''; //previous branch name
  branches = []; //to store all branch details
  orgId = ''; //current org id
  orgName = ''; //current org name
  customerId = ''; //current customer id
  prevOrgId = ''; //previous org id
  prevOrgName = ''; //previous org name
  prevCustid = ''; //previous customer id

  contactOwner: string; //current contact owner
  contactSelected: boolean; //flag to check if contact is tagged
  orgSelected: boolean; //flag to check if org is tagged
  daTime: any; //to store date
  formReset: boolean = true; //to prevent form from resetting when subscription reruns
  activeFieldsLength: number = 0; //get no of active additional fields
  customerName: string; //to store customer's fullname
  previousCustomerName: string; //to store previous value of customer's fullname
  //store the previous value of pipeline to use in changeLog
  previousPipeline: number;
  //store the previous value of status to use in changeLog
  previousStage: string;
  previousAssignedTo: string; // old assignee id
  previousAssignedToName: string; //old assigne's name
  assignedToDate: number = null; // old assigned to date
  salePipelines: Pipelines[] = []; //to store sale pipelines

  constructor(
    private analytics: AngularFireAnalytics,
    private router: Router,
    @Optional() public dialogRef: MatDialogRef<Addnewsale1Component>,
    private _snackBar: MatSnackBar,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private db: Addnewsale1Service,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    if (!data) {
      route.params.subscribe((val) => {
        const scn = this.route.snapshot.paramMap.get('scn');
        const saleID = this.route.snapshot.paramMap.get('id');
        this.data = {
          scenario: scn,
          id: saleID,
        };
      });
    }
    //getting user details form
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          //to get super user details form common service file
          this.superUserDetails = allData.superUserDetails;
          if (this.superUserDetails.fieldNames) {
            //getting custom field name
            this.fieldNameContact =
              this.superUserDetails.fieldNames.fieldNameContact;
            this.fieldNameSale = this.superUserDetails.fieldNames.fieldNameSale;
            this.fieldNameItems =
              this.superUserDetails.fieldNames.fieldNameItems;

            if (
              allData.superUserDetails?.productSettings?.category?.displayName
            ) {
              this.fieldNameItemsCategory =
                allData.superUserDetails.productSettings.category.displayName;
            }
          }
          // assign reason rejection array to local variable
          if (
            allData.superUserDetails?.saleSettings?.rejectionReason
              ?.rejectionReason
          ) {
            this.rejectionReasonArr =
              allData.superUserDetails?.saleSettings?.rejectionReason?.rejectionReason?.split(
                ','
              );
              
          } else {
            this.rejectionReasonArr[0] = 'No options are available';
            
          }

          //for storing user id
          this.userId = allData.userId;
          this.userName = allData.userDetails.lastname
            ? allData.userDetails.firstname + ' ' + allData.userDetails.lastname
            : allData.userDetails.firstname;
          this.accountType = allData.userDetails.accountType;

          this.superUserId = allData.userDetails.superUserId;
          this.plan = allData.superUserDetails.plan;
          this.isProdCheckMandatory =
            allData.superUserDetails.isProdCheckMandatory;

          //getting status of customer
          //if there is multiple pipeline access, show all five pipelines else show single pipeline
          this.salePipelines = JSON.parse(
            JSON.stringify(allData.salePipelines)
          );
          if (this.commonService.userPlan.multiPipelineAccess) {
            // do nothing
          } else {
            this.salePipelines.length = 1;
          }
          this.selectedSalePipeline = this.salePipelines[0].pipelineId;
          if (this.formReset) {
            this.pipelineChangedEvent(this.selectedSalePipeline);
          }

          if (
            typeof allData.superUserDetails.productCategories === 'undefined' ||
            allData.superUserDetails.productCategories?.length === 0
          ) {
            this.prodCatArray = this.getCats();
          } else {
            this.prodCatArray = allData.superUserDetails.productCategories;
          }
          if (allData.superUserDetails.productSettings) {
            this.productSettings = allData.superUserDetails.productSettings;
          }
          if (
            typeof allData.superUserDetails.saleSettings === 'undefined' ||
            allData.superUserDetails.saleSettings === null
          ) {
            this.saleSettings = this.saleSettings;
          } else {
            this.saleSettings = allData.superUserDetails.saleSettings;
          }

          if (allData.superUserDetails?.itemQtyDisplay === false) {
            this.itemsQtyDisplay = false;
          } else {
            this.itemsQtyDisplay = true;
          }
          this.maxItems = allData.superUserDetails.itemMaxAllowed
            ? allData.superUserDetails.itemMaxAllowed
            : itemMax.MAX_ITEM;

          //fetch all products from DB
          this.products = allData.products;

          if (this.accountType == 'SuperUser') {
            this.firstname = allData.superUserDetails.firstname;
            this.secondname = allData.superUserDetails.lastname;
          } else {
            this.firstname = allData.userDetails.firstname;
            this.secondname = allData.userDetails.lastname;
          }
          this.dataAccessRule = allData.usrProfileData.dialogdataAccessRule; // for access rule check
          //getting sub users details
          this.allSubUsers = this.commonService.createUserlist('All', 'any')[1];
          this.branches = allData.branches;
          if (this.data.scenario != 'edit') {
            for (let i = 0; i < this.allSubUsers.length; i++) {
              if (this.userId === this.allSubUsers[i].userId) {
                if (this.allSubUsers[i].branchId) {
                  this.associatedBranch = this.allSubUsers[i].branchId;
                } else {
                  this.associatedBranch = 'NA';
                }
              }
            }
          }

          //if mode of sale is edit
          if (this.data.scenario == 'edit' && this.formReset) {
            this.formReset = false;
            if (
              allData.usrProfileData.isCheckedSale === false ||
              allData.usrProfileData.saleReAssign === false
            ) {
              this.disableReAssign = true;
            }
            this.loader = true;
            //getting additional field
            this.additionalFields = allData.superUserDetails.customFieldsSale;

            //find the no of active additionals fields
            this.additionalFields?.forEach((field) => {
              if (field.isActive) {
                this.activeFieldsLength = this.activeFieldsLength + 1;
              }
            });
            //getting sale data from common service file
            let saleDetails = this.commonService.getSaleToEdit();
            this.customerId = saleDetails.customerId;
            this.userData.countryCode = saleDetails.countryCode
              ? saleDetails.countryCode
              : null;
            this.userData.contactNumber = saleDetails.contactNumber
              ? saleDetails.contactNumber
              : null;
            this.userData.altCountryCode = saleDetails.altCountryCode
              ? saleDetails.altCountryCode
              : null;
            this.userData.altContactNumber = saleDetails.altContactNumber
              ? saleDetails.altContactNumber
              : null;
            if (saleDetails.customerId) {
              this.contactSelected = true;
            } else {
              this.contactSelected = false;
            }
            this.contactOwner = saleDetails.contactOwner;
            //assigning values to all field
            this.forms = saleDetails;
            this.custData.firstName = saleDetails.firstName;
            this.custData.secondName = saleDetails.secondName;
            this.custData.surname = saleDetails.surname
              ? saleDetails.surname
              : '';
            //current customer's fullname
            if (
              saleDetails.firstName &&
              saleDetails.secondName &&
              saleDetails.surname
            ) {
              this.customerName =
                saleDetails.firstName +
                ' ' +
                saleDetails.secondName +
                ' ' +
                saleDetails.surname;
            } else if (
              saleDetails.firstName &&
              saleDetails.secondName &&
              !saleDetails.surname
            ) {
              this.customerName =
                saleDetails.firstName + ' ' + saleDetails.secondName;
            } else if (
              saleDetails.firstName &&
              !saleDetails.secondName &&
              saleDetails.surname
            ) {
              this.customerName =
                saleDetails.firstName + ' ' + saleDetails.surname;
            } else {
              this.customerName = saleDetails.firstName
                ? saleDetails.firstName
                : null;
            }
            //store previous customer name to add in change log
            this.previousCustomerName = this.customerName
              ? this.customerName
              : null;

            this.custData.companyName = saleDetails.companyName;
            this.orgName = saleDetails.companyName;
            this.orgId = saleDetails.orgId ? saleDetails.orgId : '';
            if (saleDetails.orgId) {
              this.orgSelected = true;
            } else {
              this.orgSelected = false;
            }
            this.prevOrgName = saleDetails.companyName;
            this.prevOrgId = saleDetails.orgId ? saleDetails.orgId : '';
            this.prevCustid = saleDetails.customerId;
            this.userData.saleTitle = saleDetails.saleTitle;
            this.userData.description = saleDetails.description;
            this.userData.estimatedValue = saleDetails.estimatedValue;
            this.userData.expCompletionDate =
              saleDetails.expCompletionDate.toDate();
            this.userData.startDate = saleDetails.startDate?.toDate();
            this.userData.salesType = saleDetails.salesType;
            this.userData.priority = saleDetails.priority;
            this.userData.collectionMode = saleDetails.collectionMode;
            this.collectionMode = saleDetails.collectionMode;
            this.assignedTo = saleDetails.assignedTo;
            this.previousAssignedTo = this.assignedTo;
            this.associatedBranch = saleDetails.associatedBranch
              ? saleDetails.associatedBranch
              : '';
            this.prevAssBranch = saleDetails.associatedBranch
              ? saleDetails.associatedBranch
              : '';

            this.userData.assignedToName = this.commonService.getAssignedToName(
              saleDetails.assignedTo
            );
            this.previousAssignedToName = this.userData.assignedToName;
            //store previous pipeline
            this.previousPipeline = saleDetails.selectedSalePipeline;
            //store previous status
            this.previousStage = saleDetails.salesStage;
            this.selectedSalePipeline = saleDetails.selectedSalePipeline;
            this.pipelineChangedEvent(this.selectedSalePipeline);
            this.userData.salesStage = saleDetails.salesStage;
            this.userData.rejectionReasonValue =
              saleDetails.rejectionReasonValue
                ? saleDetails.rejectionReasonValue
                : '';
            this.changeLog = saleDetails.changeLog;
            this.addFieldsArray = saleDetails.additionalFieldsArr;

            // get old assigned to date
            if (saleDetails.assignedToDate) {
              this.assignedToDate = saleDetails.assignedToDate;
            }

            if (saleDetails.additionalFieldsArr) {
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

            this.userData.assignedTo = saleDetails.assignedTo;
            this.userData.collectionMode = saleDetails.collectionMode;
            //setting titile name as update
            this.titleName = 'Update';
            //form controls for editing
            this.userForm = this.fb.group(
              {
                saleTitle: [
                  this.userData.saleTitle,
                  [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                    AppCustomDirective.whiteSpaceOnly,
                  ],
                ],
                estimatedValue: [
                  {
                    value: this.userData.estimatedValue,
                    disabled: this.disableEstOption,
                  },
                ],
                collectionMode: [this.collectionMode],
                startDate: [
                  this.userData.startDate,
                  [AppCustomDirective.fromDateValidator],
                ],
                expCompletionDate: [
                  this.userData.expCompletionDate,
                  Validators.required,
                ],
                selectedSalePipeline: [this.selectedSalePipeline],
                salesStage: [this.userData.salesStage, Validators.required],
                rejectionReasonVal: [this.userData.rejectionReasonValue],
                priority: [this.userData.priority, Validators.required],
                description: [this.userData.description],
                additionalFields: this.fb.array([]),
                selectedProduct: [''],
                selProdCat: '',
                prodFormArray: this.fb.array([]),
              },
              { validators: this.checkDateValidation }
            );

            //customisable fiels section starts here
            if (this.saleSettings) {
              //estimatedValue
              if (this.saleSettings?.estimatedValue?.mandatory === true) {
                this.userForm.controls['estimatedValue'].setValidators(
                  Validators.required
                );
              } else {
                this.userForm.controls['estimatedValue'].clearValidators();
              }
              this.userForm.controls['estimatedValue'].updateValueAndValidity();
              //collectionMode
              if (this.saleSettings?.collectionMode?.mandatory === true) {
                this.userForm.controls['collectionMode'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['collectionMode'].clearValidators();
              }
              this.userForm.controls['collectionMode'].updateValueAndValidity();
              //startDate
              if (this.saleSettings?.startDate?.mandatory === true) {
                this.userForm.controls['startDate'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['startDate'].clearValidators();
              }
              this.userForm.controls['startDate'].setValidators([
                AppCustomDirective.fromDateValidator,
              ]);
              this.userForm.controls['startDate'].updateValueAndValidity();
              //selectedSalePipeline
              if (this.saleSettings?.selectedSalePipeline?.mandatory === true) {
                this.userForm.controls['selectedSalePipeline'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls[
                  'selectedSalePipeline'
                ].clearValidators();
              }
              this.userForm.controls[
                'selectedSalePipeline'
              ].updateValueAndValidity();
              //salesStage
              if (this.saleSettings?.salesStage?.mandatory === true) {
                this.userForm.controls['salesStage'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['salesStage'].clearValidators();
              }
              this.userForm.controls['salesStage'].updateValueAndValidity();
              //priority
              if (this.saleSettings?.priority?.mandatory === true) {
                this.userForm.controls['priority'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['priority'].clearValidators();
              }
              this.userForm.controls['priority'].updateValueAndValidity();
              //description
              if (this.saleSettings?.description?.mandatory === true) {
                this.userForm.controls['description'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['description'].clearValidators();
              }
              this.userForm.controls['description'].updateValueAndValidity();
            }
            //push additional fields data to FormArray
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

            // products section in edit scenario starts here
            // converting to array
            if (saleDetails?.itemsArray) {
              this.prodArray = Object.values(saleDetails.itemsArray).map(
                ({
                  id,
                  productId,
                  quantity,
                  discount,
                  unitPrice,
                  prodName,
                  prodCategory,
                }) => ({
                  id,
                  productId,
                  quantity,
                  discount,
                  unitPrice,
                  prodName,
                  prodCategory,
                })
              );
            }

            this.completeProdArray = this.prodArray;
            // check for products and disable estimated value field
            if (this.completeProdArray?.length > 0) {
              this.disableEstOption = true;
              this.userForm.get('estimatedValue').disable();
            }
            //push controls for prodFormArray
            this.prodArray.forEach((doc) => {
              const add = this.userForm.get('prodFormArray') as FormArray;
              add.push(
                this.fb.group({
                  id: doc.id,
                  productId: doc.productId,
                  quantity: [doc.quantity, Validators.required],
                  discount: [doc.discount, Validators.required],
                  unitPrice: [doc.unitPrice, Validators.required],
                  prodName: doc.prodName,
                  prodCategory: doc.prodCategory,
                })
              );
            });

            //form gets completely loaded after this subscription
            // creating a copy of the initial loaded form to use in change log
            this.previousForm = ChangeLogComponent.cloneAbstractControl(
              this.userForm
            );
            // products section in edit scenario ends here
            if (this.userForm) {
              this.loader = false;
            }
          }
          //if senerio is create from customer or from full layout
          else if (
            (this.data.scenario == 'create' ||
              this.data.scenario == 'createfromCustomer') &&
            this.formReset
          ) {
            this.formReset = false;
            //getting additional field
            this.additionalFields = allData.superUserDetails.customFieldsSale;

            //find the no of active additionals fields
            this.additionalFields?.forEach((field) => {
              if (field.isActive) {
                this.activeFieldsLength = this.activeFieldsLength + 1;
              }
            });
            if (this.data.title) {
              this.userData.saleTitle = this.data.title;
            }
            if (this.data.scenario == 'createfromCustomer') {
              this.customerId = this.data.id;
              this.contactSelected = true;
            }
            this.assignedTo = this.userId;
            if (this.assignedTo) {
              for (let i = 0; i < this.allSubUsers.length; i++) {
                if (this.assignedTo === this.allSubUsers[i].userId) {
                  if (this.allSubUsers[i].branchId) {
                    this.associatedBranch = this.allSubUsers[i].branchId;
                  } else {
                    this.associatedBranch = 'NA';
                  }
                }
              }
            }
            this.collectionMode = '100% on completion';
            //changes made here
            this.selectedSalePipeline = this.salePipelines[0].pipelineId;
            this.pipelineChangedEvent(this.selectedSalePipeline);
            this.userData.salesStage = this.statusArray[0].stageId; //defaulting status as first one
            this.userData.assignedToName =
              this.firstname + ' ' + this.secondname;

            //getting customers name and details from db if created form customer view
            this.saleUsersSubscription = this.db
              .getCustomer(this.data.id, this.superUserId)
              .subscribe((customer) => {
                if (customer?.secondName != null) {
                  this.custData.firstName = customer?.firstName;
                  this.custData.secondName = customer?.secondName;
                }
                if (customer?.secondName == null) {
                  this.custData.firstName = customer?.firstName;
                }
                this.custData.surname = customer?.surname
                  ? customer?.surname
                  : '';
                this.custData.companyName = customer?.companyName;
                this.orgId = customer?.orgId ? customer?.orgId : '';
                this.orgName = customer?.companyName
                  ? customer?.companyName
                  : '';
                if (customer) {
                  this.userData.countryCode = customer.code
                    ? customer.code
                    : null;
                  this.userData.contactNumber = customer.contactNo
                    ? customer.contactNo
                    : null;
                  this.userData.altCountryCode = customer.altContactCode
                    ? customer.altContactCode
                    : null;
                  this.userData.altContactNumber =
                    customer.alternateContactNumber
                      ? customer.alternateContactNumber
                      : null;

                  if (
                    customer.orgId !== null &&
                    customer.orgId !== '' &&
                    typeof customer.orgId !== 'undefined' &&
                    customer.companyName !== null &&
                    customer.companyName !== '' &&
                    typeof customer.companyName !== 'undefined'
                  ) {
                    this.orgSelected = true;
                  }
                  //setting default values while creating
                  this.assignedTo = this.userId;
                  this.collectionMode = '100% on completion';
                  this.userData.assignedToName =
                    this.firstname + ' ' + this.secondname;
                  if (this.assignedTo) {
                    for (let i = 0; i < this.allSubUsers.length; i++) {
                      if (this.assignedTo === this.allSubUsers[i].userId) {
                        if (this.allSubUsers[i].branchId) {
                          this.associatedBranch = this.allSubUsers[i].branchId;
                        } else {
                          this.associatedBranch = 'NA';
                        }
                      }
                    }
                  }
                }
              });
            this.titleName = 'Add';
            this.userData.priority = 'Medium'; //Inital value set to Medium by default
            this.userData.salesStage = this.statusArray[0].stageId;

            //form controls for create
            this.userForm = this.fb.group(
              {
                saleTitle: [
                  this.userData.saleTitle,
                  [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                    AppCustomDirective.whiteSpaceOnly,
                  ],
                ],
                estimatedValue: [
                  {
                    value: this.userData.estimatedValue,
                    disabled: this.disableEstOption,
                  },
                ],
                collectionMode: [this.collectionMode],
                startDate: [
                  this.userData.startDate,
                  [AppCustomDirective.fromDateValidator],
                ],
                expCompletionDate: [
                  this.userData.expCompletionDate,
                  Validators.required,
                ],
                selectedSalePipeline: [this.selectedSalePipeline],
                salesStage: [this.userData.salesStage, Validators.required],
                rejectionReasonVal: [this.userData.rejectionReasonValue],
                priority: [this.userData.priority, Validators.required],
                description: [this.userData.description],
                additionalFields: this.fb.array([]),
                selectedProduct: [''],
                selProdCat: '',
                prodFormArray: this.fb.array([]),
              },
              { validators: this.checkDateValidation }
            );

            //customisable field validation starts here
            if (this.saleSettings) {
              //estimatedValue
              if (this.saleSettings?.estimatedValue?.mandatory === true) {
                this.userForm.controls['estimatedValue'].setValidators(
                  Validators.required
                );
              } else {
                this.userForm.controls['estimatedValue'].clearValidators();
              }
              this.userForm.controls['estimatedValue'].updateValueAndValidity();
              //collectionMode
              if (this.saleSettings?.collectionMode?.mandatory === true) {
                this.userForm.controls['collectionMode'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['collectionMode'].clearValidators();
              }
              this.userForm.controls['collectionMode'].updateValueAndValidity();
              //startDate
              if (this.saleSettings?.startDate?.mandatory === true) {
                this.userForm.controls['startDate'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['startDate'].clearValidators();
              }
              this.userForm.controls['startDate'].setValidators([
                AppCustomDirective.fromDateValidator,
              ]);
              this.userForm.controls['startDate'].updateValueAndValidity();
              //selectedSalePipeline
              if (this.saleSettings?.selectedSalePipeline?.mandatory === true) {
                this.userForm.controls['selectedSalePipeline'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls[
                  'selectedSalePipeline'
                ].clearValidators();
              }
              this.userForm.controls[
                'selectedSalePipeline'
              ].updateValueAndValidity();
              //salesStage
              if (this.saleSettings?.salesStage?.mandatory === true) {
                this.userForm.controls['salesStage'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['salesStage'].clearValidators();
              }
              this.userForm.controls['salesStage'].updateValueAndValidity();
              //priority
              if (this.saleSettings?.priority?.mandatory === true) {
                this.userForm.controls['priority'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['priority'].clearValidators();
              }
              this.userForm.controls['priority'].updateValueAndValidity();
              //description
              if (this.saleSettings?.description?.mandatory === true) {
                this.userForm.controls['description'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['description'].clearValidators();
              }
              this.userForm.controls['description'].updateValueAndValidity();
            }
            //customisable field validation ends here
            //push additional fields data to FormArray
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
          } else if (this.data.scenario == 'createfromOrg' && this.formReset) {
            this.formReset = false;
            //getting additional field
            this.additionalFields = allData.superUserDetails.customFieldsSale;

            //find the no of active additionals fields
            this.additionalFields?.forEach((field) => {
              if (field.isActive) {
                this.activeFieldsLength = this.activeFieldsLength + 1;
              }
            });
            this.orgId = this.data.id;
            this.orgSelected = true;
            this.orgName = this.data.orgName;
            if (this.data.title) {
              this.userData.saleTitle = this.data.title;
            }
            this.assignedTo = this.userId;
            if (this.assignedTo) {
              for (let i = 0; i < this.allSubUsers.length; i++) {
                if (this.assignedTo === this.allSubUsers[i].userId) {
                  if (this.allSubUsers[i].branchId) {
                    this.associatedBranch = this.allSubUsers[i].branchId;
                  } else {
                    this.associatedBranch = 'NA';
                  }
                }
              }
            }
            this.collectionMode = '100% on completion';
            //changes made here
            this.selectedSalePipeline = this.salePipelines[0].pipelineId;
            this.pipelineChangedEvent(this.selectedSalePipeline);
            this.userData.salesStage = this.statusArray[0].stageId; //defaulting status as first one
            this.userData.assignedToName =
              this.firstname + ' ' + this.secondname;
            const organisation = this.commonService.getOrgToEdit();

            this.orgName = organisation.companyName;
            if (organisation) {
              //setting default values while creating
              this.assignedTo = this.userId;
              this.collectionMode = '100% on completion';
              this.userData.assignedToName =
                this.firstname + ' ' + this.secondname;
              if (this.assignedTo) {
                for (let i = 0; i < this.allSubUsers.length; i++) {
                  if (this.assignedTo === this.allSubUsers[i].userId) {
                    if (this.allSubUsers[i].branchId) {
                      this.associatedBranch = this.allSubUsers[i].branchId;
                    } else {
                      this.associatedBranch = 'NA';
                    }
                  }
                }
              }
            }
            this.titleName = 'Add';
            this.userData.priority = 'Medium'; //Inital value set to Medium by default
            this.userData.salesStage = this.statusArray[0].stageId;

            //form controls for create
            this.userForm = this.fb.group(
              {
                saleTitle: [
                  this.userData.saleTitle,
                  [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                    AppCustomDirective.whiteSpaceOnly,
                  ],
                ],
                estimatedValue: [
                  {
                    value: this.userData.estimatedValue,
                    disabled: this.disableEstOption,
                  },
                ],
                collectionMode: [this.collectionMode],
                startDate: [
                  this.userData.startDate,
                  [AppCustomDirective.fromDateValidator],
                ],
                expCompletionDate: [
                  this.userData.expCompletionDate,
                  Validators.required,
                ],
                selectedSalePipeline: [this.selectedSalePipeline],
                salesStage: [this.userData.salesStage, Validators.required],
                rejectionReasonVal: [this.userData.rejectionReasonValue],
                priority: [this.userData.priority, Validators.required],
                description: [this.userData.description],
                additionalFields: this.fb.array([]),
                selectedProduct: [''],
                selProdCat: '',
                prodFormArray: this.fb.array([]),
              },
              { validators: this.checkDateValidation }
            );

            //customisable field validation starts here
            if (this.saleSettings) {
              //estimatedValue
              if (this.saleSettings?.estimatedValue?.mandatory === true) {
                this.userForm.controls['estimatedValue'].setValidators(
                  Validators.required
                );
              } else {
                this.userForm.controls['estimatedValue'].clearValidators();
              }
              this.userForm.controls['estimatedValue'].updateValueAndValidity();
              //collectionMode
              if (this.saleSettings?.collectionMode?.mandatory === true) {
                this.userForm.controls['collectionMode'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['collectionMode'].clearValidators();
              }
              this.userForm.controls['collectionMode'].updateValueAndValidity();
              //startDate
              if (this.saleSettings?.startDate?.mandatory === true) {
                this.userForm.controls['startDate'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['startDate'].clearValidators();
              }
              this.userForm.controls['startDate'].setValidators([
                AppCustomDirective.fromDateValidator,
              ]);
              this.userForm.controls['startDate'].updateValueAndValidity();
              //selectedSalePipeline
              if (this.saleSettings?.selectedSalePipeline?.mandatory === true) {
                this.userForm.controls['selectedSalePipeline'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls[
                  'selectedSalePipeline'
                ].clearValidators();
              }
              this.userForm.controls[
                'selectedSalePipeline'
              ].updateValueAndValidity();
              //salesStage
              if (this.saleSettings?.salesStage?.mandatory === true) {
                this.userForm.controls['salesStage'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['salesStage'].clearValidators();
              }
              this.userForm.controls['salesStage'].updateValueAndValidity();
              //priority
              if (this.saleSettings?.priority?.mandatory === true) {
                this.userForm.controls['priority'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['priority'].clearValidators();
              }
              this.userForm.controls['priority'].updateValueAndValidity();
              //description
              if (this.saleSettings?.description?.mandatory === true) {
                this.userForm.controls['description'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['description'].clearValidators();
              }
              this.userForm.controls['description'].updateValueAndValidity();
            }
            //customisable field validation ends here
            //push additional fields data to FormArray
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
                      fieldType: field.fieldType,
                      fieldName: field.fieldName,
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
          //disabling field
          this.usrDataProfile = allData.usrProfileData;
          if (this.usrDataProfile) {
            this.userDataProfile = this.usrDataProfile[0];
            if (this.userDataProfile) {
              // disable contact section
              if (this.usrDataProfile[0].isCheckedSale == false) {
                this.disableEditSale = true;
              } else {
                if (this.usrDataProfile[0].salesEdit == false) {
                  this.disableEditSale = true;
                }
              }
            }
          }
        }
      }
    );
  }

  ngOnInit(): void {
    //get category list for autocomplete
    this.filteredOptionsCategory = this.userForm
      ?.get('selProdCat')
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCategory(value || ''))
      );
    //get product list for auto complete
    this.filteredOptionsProd = this.userForm
      ?.get('selectedProduct')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.fname1)),
        map((fname1) => this._filterProd(fname1))
      );
  }
  //function to return filtered category values in auto complete
  private _filterCategory(value: string): string[] {
    this.userForm.patchValue({
      selectedProduct: '',
    });
    this.addProdOption = false;
    const filterValue = value.toLowerCase();

    return this.prodCatArray.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  //function to return filtered product values in auto complete
  private _filterProd(value: string): ProductModel[] {
    //value entered in the input box
    const filterValue = value != undefined ? value.toLowerCase() : '';
    //get category value from form
    let category = this.userForm?.get('selProdCat').value.toLowerCase();
    //filterlist contains all the values filtered according to category
    let filterList = [];
    //filterlist should contains products based on category
    filterList = this.products.filter((option) =>
      option.prodCategory?.toLowerCase().includes(category)
    );
    //return filterlist to display in search autocomplete
    return filterList.filter((option) =>
      option.prodName.toLowerCase().includes(filterValue)
    );
  }
  //to get stage values
  pipelineChangedEvent(pipelineId) {
    this.selectedSalePipeline = pipelineId;
    var result = this.salePipelines.filter((obj) => {
      return obj.pipelineId === pipelineId;
    });
    if (result.length > 0) {
      this.statusArray = result[0].pipelineStages.map(({ name, stageId }) => ({
        name,
        stageId,
      }));
    } else {
      this.selectedSalePipeline = null;
      this.statusArray = [];
    }

    //In update scenario, if user has changed the pipeline and returns back to the saved pipeline, restore saved status
    if (
      this.data.scenario == 'edit' &&
      this.selectedSalePipeline == this.previousPipeline
    ) {
      this.userData.salesStage = this.previousStage;
      this.userForm?.controls.salesStage.setValue(this.userData.salesStage);
    } else {
      this.userData.salesStage = this.statusArray[0].stageId;
      this.userForm?.controls.salesStage.setValue(this.statusArray[0].stageId);
    }
  }
  //for closing popup
  onNoClick(): void {
    this.prodArray = this.completeProdArray;
    this.dialogRef?.close();
  }
  //returns additional fields formArray
  get additionalField(): FormArray {
    return this.userForm.get('additionalFields') as FormArray;
  }
  // if status is rejected, set validators acc to settings, else set value null
  statusSelected(statusId) {
    var result = this.statusArray.filter((obj) => {
      return obj.stageId === statusId;
    });
    const statusObj = result[0];
    if (
      this.saleSettings.rejectionReasonVal?.mandatory === true &&
      statusObj === this.statusArray[this.statusArray.length - 1]
    ) {
      this.userForm.controls['rejectionReasonVal'].setValidators(
        Validators.required
      );
    } else {
      this.userForm.controls['rejectionReasonVal'].clearValidators();
      this.userForm.controls['rejectionReasonVal'].setValue('');
    }
  }
  //triggered while selecting submit button in form
  onSubmit(form: any, GAevent) {
    this.disableSubmit = true;

    let firstName = '';
    let secondName = '';
    let companyName = '';
    let surname = '';
    let orgId = '';

    // products in array form change to nested object to save in DB
    let itemsArray = <ProductInSaleModel>{};

    this.prodArray.forEach((doc, index) => {
      for (let i = 0; i < this.products.length; i++) {
        if (doc.productId === this.products[i].id) {
          itemsArray[index] = {
            prodName: this.products[i].prodName,
            hsnCode: this.products[i].hsnCode ? this.products[i].hsnCode : '',
            prodDes: this.products[i].prodDes,
            currency: this.products[i].currency,
            unitPrice: doc.unitPrice,
            unit: this.products[i].unit,
            quantity: doc.quantity,
            discount: doc.discount,
            cgst: this.products[i].cgst,
            sgst: this.products[i].sgst,
            igst: this.products[i].igst,
            vatRate: this.products[i].vatRate,
            taxType: this.products[i].taxType,
            productId: this.products[i].id,
            prodCategory: this.products[i].prodCategory
              ? this.products[i].prodCategory
              : '',
            additionalFieldsArr: this.products[i].additionalFieldsArr
              ? this.products[i].additionalFieldsArr
              : null,
          };
        }
      }
    });

    if (
      form.value.estimatedValue == null ||
      form.value.estimatedValue == 'undefined'
    ) {
      form.value.estimatedValue = 0;
    }

    form.value.estimatedValue =
      this.disableEstOption == false
        ? form.value.estimatedValue
        : this.userData.estimatedValue;

    this.loader = true;
    //triggering analytics
    this.analytics.logEvent(GAevent);
    let selectedIndex;
    let statusArray = [];
    let datePlaced = new Date().getTime(); //Get TimeStamp
    //storing status
    statusArray = this.statusArray;
    if (this.custData) {
      firstName = this.custData.firstName;
      secondName = this.custData.secondName;
      surname = this.custData.surname ? this.custData.surname : '';
    }
    orgId = this.orgId;
    companyName = this.orgName;

    //checking assigned to is present
    if (this.assignedTo) {
      //defaulting company name
      if (form.value.cname == '') {
        form.value.cname = 'N/A';
      }
      //checking assigned to is user itself and setting assigned to name
      if (this.assignedTo == this.userId) {
        if (this.secondname != null) {
          this.userData.assignedToName = this.firstname + ' ' + this.secondname;
        } else {
          this.userData.assignedToName = this.firstname;
        }
      }

      this.saleTitle = form.value.saleTitle;
      let searchTerm: SearchTermSale;
      //for storing search value
      if (secondName) {
        searchTerm = {
          firstName: firstName.toLowerCase(),
          secondName: secondName.toLowerCase(),
          surname: surname ? surname.toLowerCase() : surname,
          companyName: companyName.toLowerCase(),
        };
      } else {
        searchTerm = {
          firstName: firstName.toLowerCase(),
          secondName: secondName,
          surname: surname ? surname.toLowerCase() : surname,
          companyName: companyName.toLowerCase(),
        };
      }
      //checking is submit is selceetd from create form
      if (this.data.scenario == 'create') {
        form.value.invoicedAmount = 0; //Initialize the invoicedAmount to 0
        form.value.collectedAmount = 0; //initialize the amount collected to 0
        //adding new status with new data
        this.stageValues.date = datePlaced;
        this.stageValues.stageId = form.value.salesStage;
        this.stageValues.pipelineId = this.selectedSalePipeline;
        this.stageHistory.push(this.stageValues);

        //pushing default value in additional field array
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
            var time_splitEdit = fromArray
              .at(index)
              .value.fieldValue2.split(':');
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

        if (this.commonService.superUserData.saleSequentialNumber) {
          this.saleSequenceNumber =
            this.commonService.superUserData.saleSequentialNumber + 1;
        } else {
          this.saleSequenceNumber = 1;
        }

        if (
          form.value.salesStage ===
          this.statusArray[this.statusArray.length - 1].stageId
        ) {
          this.lost = true;
          this.won = false;
          this.inPipeline = false;
        } else if (
          form.value.salesStage ===
          this.statusArray[this.statusArray.length - 2].stageId
        ) {
          this.lost = false;
          this.won = true;
          this.inPipeline = false;
        } else {
          this.lost = false;
          this.won = false;
          this.inPipeline = true;
        }

        let formDetails = {
          rejectionReasonValue: form.value.rejectionReasonVal
            ? form.value.rejectionReasonVal
            : '',
          assignedTo: this.assignedTo,
          associatedBranch: this.associatedBranch ? this.associatedBranch : '',
          collectedAmount: form.value.collectedAmount,
          collectionMode: form.value.collectionMode,
          estimatedValue: form.value.estimatedValue,
          expCompletionDate: form.value.expCompletionDate,
          invoicedAmount: form.value.invoicedAmount,
          priority: form.value.priority,
          saleTitle: form.value.saleTitle,
          selectedSalePipeline: form.value.selectedSalePipeline,
          salesStage: form.value.salesStage,
          startDate: form.value.startDate,
          createdBy: this.userId,
          description: form.value.description,
          orgId: this.orgId,
          contactOwner: this.custData.assignedTo
            ? this.custData.assignedTo
            : null,
          itemsArray,
          countryCode: this.userData.countryCode
            ? this.userData.countryCode
            : null,
          contactNumber: this.userData.contactNumber
            ? this.userData.contactNumber
            : null,
          altCountryCode: this.userData.altCountryCode
            ? this.userData.altCountryCode
            : null,
          altContactNumber: this.userData.altContactNumber
            ? this.userData.altContactNumber
            : null,
        };

        //creating sale
        this.db
          .createSale(
            this.custData ? this.custData.id : '',
            datePlaced,
            firstName,
            secondName,
            surname,
            companyName,
            this.userData.assignedToName,
            formDetails,
            this.superUserId,
            this.stageHistory,
            datePlaced,
            additionalFields,
            searchTerm,
            this.saleSequenceNumber,
            this.inPipeline,
            this.won,
            this.lost,
            ChangeLogComponent.saveLog(
              this.constructor.name,
              this.userId,
              this.userName,
              '',
              '',
              this.changeLog
            )
          )
          //getting response
          .then((res) => {
            if (this.data.purchasedId != null) {
              this.db.purchasedLeadUpdation(
                this.superUserId,
                this.data.purchasedId,
                res.id
              );
            }
            this.db
              .updateSaleSequenceNumber(
                this.superUserId,
                this.saleSequenceNumber
              )
              .then((result) => {
                this.dialogRef?.close();
                let message = this.fieldNameSale + ' successfully added';
                this._snackBar.open(message, ' ', {
                  duration: 2000,
                });
                //navigating to new sales
                this.router.navigate(['dash/sales/saleview/' + res.id]);
              });
          });
        //checking is submit is clicked from customer view
      } else if (
        this.data.scenario == 'createfromCustomer' ||
        this.data.scenario == 'createfromOrg'
      ) {
        form.value.invoicedAmount = 0; //Initialize the invoicedAmount to 0
        form.value.collectedAmount = 0; //initialize the amount collected to 0
        //setting stage history
        //adding new status with new data
        this.stageValues.date = datePlaced;
        this.stageValues.stageId = form.value.salesStage;
        this.stageValues.pipelineId = this.selectedSalePipeline;
        this.stageHistory.push(this.stageValues);

        //pushing value in additinal field to single value array
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
            var time_splitEdit = fromArray
              .at(index)
              .value.fieldValue2.split(':');
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

        if (this.commonService.superUserData.saleSequentialNumber) {
          this.saleSequenceNumber =
            this.commonService.superUserData.saleSequentialNumber + 1;
        } else {
          this.saleSequenceNumber = 1;
        }
        if (
          form.value.salesStage ===
          this.statusArray[this.statusArray.length - 1].stageId
        ) {
          this.lost = true;
          this.won = false;
          this.inPipeline = false;
        } else if (
          form.value.salesStage ===
          this.statusArray[this.statusArray.length - 2].stageId
        ) {
          this.lost = false;
          this.won = true;
          this.inPipeline = false;
        } else {
          this.lost = false;
          this.won = false;
          this.inPipeline = true;
        }

        //form details to add into database
        let formDetails = {
          rejectionReasonValue: form.value.rejectionReasonVal
            ? form.value.rejectionReasonVal
            : '',
          assignedTo: this.assignedTo,
          associatedBranch: this.associatedBranch ? this.associatedBranch : '',
          collectedAmount: form.value.collectedAmount,
          collectionMode: form.value.collectionMode,
          estimatedValue: form.value.estimatedValue,
          expCompletionDate: form.value.expCompletionDate,
          invoicedAmount: form.value.invoicedAmount,
          priority: form.value.priority,
          saleTitle: form.value.saleTitle,
          selectedSalePipeline: form.value.selectedSalePipeline,
          salesStage: form.value.salesStage,
          startDate: form.value.startDate,
          createdBy: this.userId,
          description: form.value.description,
          orgId: this.orgId,
          contactOwner: this.custData.assignedTo
            ? this.custData.assignedTo
            : null,
          itemsArray,
          countryCode: this.userData.countryCode
            ? this.userData.countryCode
            : null,
          contactNumber: this.userData.contactNumber
            ? this.userData.contactNumber
            : null,
          altCountryCode: this.userData.altCountryCode
            ? this.userData.altCountryCode
            : null,
          altContactNumber: this.userData.altContactNumber
            ? this.userData.altContactNumber
            : null,
        };
        //creating sale
        this.db
          .createSale(
            this.custData.id ? this.custData.id : this.customerId,
            datePlaced,
            firstName,
            secondName,
            surname,
            companyName,
            this.userData.assignedToName,
            formDetails,
            this.superUserId,
            this.stageHistory,
            datePlaced,
            additionalFields,
            searchTerm,
            this.saleSequenceNumber,
            this.inPipeline,
            this.won,
            this.lost,
            ChangeLogComponent.saveLog(
              this.constructor.name,
              this.userId,
              this.userName,
              '',
              '',
              this.changeLog
            )
          )
          .then((res) => {
            if (this.data.purchasedId != null) {
              this.db.purchasedLeadUpdation(
                this.superUserId,
                this.data.purchasedId,
                res.id
              );
            }
            this.db
              .updateSaleSequenceNumber(
                this.superUserId,
                this.saleSequenceNumber
              )
              .then((result) => {
                this.dialogRef?.close();
                let message = this.fieldNameSale + ' successfully added';
                this._snackBar.open(message, ' ', {
                  duration: 2000,
                });
                //navigating to new sake
                this.router.navigate(['dash/sales/saleview/' + res.id]);
              });
          });
        //if submit clicked while editing
      } else if (this.data.scenario == 'edit') {
        //pushing value in additional field to single value array
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
            var time_splitEdit = fromArray
              .at(index)
              .value.fieldValue2.split(':');
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

        //checking sale status is changed because we need to update history
        if (form.value.salesStage == this.forms.salesStage) {
          this.stageHistories = this.forms?.stageHistory;
        }
        if (form.value.salesStage != this.forms.salesStage) {
          let currentHistory = this.forms?.stageHistory;

          if (!currentHistory) {
            currentHistory = [];
          }
          //adding new status with new data
          this.stageValues.date = datePlaced;
          this.stageValues.stageId = form.value.salesStage;
          this.stageValues.pipelineId = this.selectedSalePipeline;
          currentHistory.push(this.stageValues);
          this.stageHistories = currentHistory;
        }

        if (
          form.value.salesStage ===
          this.statusArray[this.statusArray.length - 1].stageId
        ) {
          this.lost = true;
          this.won = false;
          this.inPipeline = false;
        } else if (
          form.value.salesStage ===
          this.statusArray[this.statusArray.length - 2].stageId
        ) {
          this.lost = false;
          this.won = true;
          this.inPipeline = false;
        } else {
          this.lost = false;
          this.won = false;
          this.inPipeline = true;
        }
        //to store fullname of customer in changeLog
        if (firstName && secondName && surname) {
          this.customerName = firstName + ' ' + secondName + ' ' + surname;
        } else if (firstName && secondName && !surname) {
          this.customerName = firstName + ' ' + secondName;
        } else if (firstName && !secondName && surname) {
          this.customerName = firstName + ' ' + surname;
        } else {
          this.customerName = firstName ? firstName : null;
        }

        let additionalData = {
          //send pipeline names to changelog
          pipelineArray: this.salePipelines,
          curAssignedTo: {
            assignedTo:
              this.previousAssignedTo != this.assignedTo
                ? this.assignedTo
                : null,
            assignedToName:
              this.previousAssignedToName != this.userData.assignedToName
                ? this.userData.assignedToName
                : null,
          },
          prevAssignedTo: {
            assignedTo: this.previousAssignedTo,
            assignedToName: this.previousAssignedToName,
          },
          addedProducts: this.addedProducts,
          deletedProducts: this.deletedProducts,
          currentOrgId: {
            orgId: this.orgId,
            companyName: this.orgName,
          },
          prevOrgId: {
            orgId: this.prevOrgId,
            companyName: this.prevOrgName,
          },
          //add contact name change to changelog
          currentContact: {
            //current value
            selectedCust: this.customerName ? this.customerName : null,
          },
          prevContact: {
            //previous value
            selectedCust: this.previousCustomerName
              ? this.previousCustomerName
              : null,
          },
          ...(this.branches.length > 0 && {
            currentAssBranch: this.branches.find(
              (item) => item.id === this.associatedBranch
            )?.name
              ? this.branches.find((item) => item.id === this.associatedBranch)
                  ?.name
              : 'None',
          }),
          ...(this.branches.length > 0 && {
            previousAssBranch:
              this.branches.length > 0
                ? this.branches.find((item) => item.id === this.prevAssBranch)
                    ?.name
                  ? this.branches.find((item) => item.id === this.prevAssBranch)
                      ?.name
                  : 'None'
                : '',
          }),
        };
        // if old assignee is not equal to new assignee update assigned to date
        if (this.previousAssignedTo != this.assignedTo) {
          this.assignedToDate = new Date().getTime();
        }

        //form details to update in database
        let formDetails = {
          rejectionReasonValue: form.value.rejectionReasonVal
            ? form.value.rejectionReasonVal
            : '',
          assignedTo: this.assignedTo,
          associatedBranch: this.associatedBranch ? this.associatedBranch : '',
          collectionMode: form.value.collectionMode,
          estimatedValue: form.value.estimatedValue,
          expCompletionDate: form.value.expCompletionDate,
          priority: form.value.priority,
          saleTitle: form.value.saleTitle,
          selectedSalePipeline: form.value.selectedSalePipeline,
          salesStage: form.value.salesStage,
          startDate: form.value.startDate,
          description: form.value.description,
          orgId: this.orgId,
          companyName: this.orgName,
          firstName,
          secondName,
          surname,
          searchTerm,
          customerId: this.custData.id ? this.custData.id : this.customerId,
          contactOwner: this.custData.assignedTo
            ? this.custData.assignedTo
            : null,
          assignedToDate: this.assignedToDate,
          itemsArray,
          countryCode: this.userData.countryCode
            ? this.userData.countryCode
            : null,
          contactNumber: this.userData.contactNumber
            ? this.userData.contactNumber
            : null,
          altCountryCode: this.userData.altCountryCode
            ? this.userData.altCountryCode
            : null,
          altContactNumber: this.userData.altContactNumber
            ? this.userData.altContactNumber
            : null,
        };
        //if pipeline has changed and status has also changed, then need to mark status as dirty
        //to get the change in changelog
        if (
          this.previousPipeline != form.value.selectedSalePipeline &&
          this.previousStage != form.value.salesStage
        ) {
          this.userForm.get('salesStage').markAsDirty();
        }
        //changeLog for sale popup
        let newChangeLog = ChangeLogComponent.saveLogReactiveForm(
          this.constructor.name,
          this.userId,
          this.userName,
          this.previousForm,
          this.userForm,
          this.changeLog,
          additionalData
        );

        if (
          form.value.salesStage != this.forms.salesStage &&
          newChangeLog != null
        ) {
          //update sale status changes are present
          this.db.updateSale(
            this.data.id,
            this.userData.assignedToName,
            formDetails,
            this.superUserId,
            this.stageHistories,
            datePlaced,
            additionalFields,
            this.inPipeline,
            this.won,
            this.lost,
            newChangeLog
          );
        }
        if (
          form.value.salesStage == this.forms.salesStage &&
          newChangeLog != null
        ) {
          //update sale status changes are not present
          this.db.updateSaleNostatusChange(
            this.data.id,
            this.userData.assignedToName,
            formDetails,
            this.superUserId,
            additionalFields,
            this.inPipeline,
            this.won,
            this.lost,
            newChangeLog
          );
        }

        //checking whether sale title is changed or not
        if (this.saleTitle != this.forms.saleTitle) {
          let searchTermDoc: SearchTerm = {
            firstName: '',
            secondName: '',
            companyName: '',
            surname: '',
          };
          searchTermDoc.firstName = firstName.toLowerCase();
          searchTermDoc.companyName = this.orgName.toLowerCase();

          if (secondName) {
            searchTermDoc.secondName = secondName.toLowerCase();
          } else {
            searchTermDoc.secondName = secondName;
          }
          //changes made here
          // let surname;
          if (surname) {
            searchTermDoc.surname = surname.toLowerCase();
          } else {
            searchTermDoc.surname = surname;
          }

          //geting payment list for updating
          this.paymentSubscription = this.db
            .getAllPayments(this.superUserId, this.data.id)
            .subscribe((data) => {
              this.payments = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as PaymentReceipt;
              });
              //changing field name for each payment using payment id
              this.payments.forEach((paymentelement) => {
                this.db.onUpdatePaymentSaleTitle(
                  this.superUserId,
                  paymentelement.id,
                  this.saleTitle,
                  firstName,
                  secondName,
                  companyName
                );
              });
              //setting payment data as updated
              this.paymentUpdated = true;
            });
          //geting task list for updating
          this.taskSubscription = this.db
            .getAllTasks(this.superUserId, this.data.id)
            .subscribe((data) => {
              this.tasks = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as Task;
              });
              //changing field name for each task using task id
              this.tasks.forEach((taskelement) => {
                this.db.onUpdateTaskSaleTitle(
                  this.superUserId,
                  taskelement.id,
                  this.saleTitle,
                  firstName,
                  secondName,
                  companyName
                );
              });
              //setting task data as updated
              this.taskUpdated = true;
            });

          //geting followup list for updating
          this.followupSubscription = this.db
            .getAllFollowup(this.superUserId, this.data.id)
            .subscribe((data) => {
              this.followups = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as FollowUps;
              });
              //changing field name for each followups using task id
              this.followups.forEach((followupelement) => {
                this.db.onUpdateFollowupSaleTitle(
                  this.superUserId,
                  followupelement.id,
                  this.saleTitle,
                  secondName ? firstName + ' ' + secondName : firstName,
                  companyName
                );
              });
              //setting followups data as updated
              this.followupUpdated = true;
            });

          //geting invoice list for updating
          this.invoiceSubscription = this.db
            .getAllInvoices(this.superUserId, this.data.id)
            .subscribe((data) => {
              this.invoices = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as Invoice;
              });
              //changing field name for each invoice using invoice id
              this.invoices.forEach((invelement) => {
                this.db.onUpdateInvoiceSaleTitle(
                  this.superUserId,
                  invelement.id,
                  this.saleTitle,
                  firstName,
                  secondName,
                  companyName,
                  searchTermDoc
                );
              });
              //setting invoice data as updated
              this.invUpdated = true;
            });
          //geting quoatation list for updating
          this.quotationSubscription = this.db
            .getAllQuotations(this.superUserId, this.data.id)
            .subscribe((data) => {
              this.quotations = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as Invoice;
              });
              //changing field name for each quotation using quotation id
              this.quotations.forEach((quoelement) => {
                this.db.onUpdateQuotationSaleTitle(
                  this.superUserId,
                  quoelement.id,
                  this.saleTitle,
                  firstName,
                  secondName,
                  companyName,
                  searchTermDoc
                );
              });
              //setting quotation data as updated
              this.quotUpdated = true;
            });
          //geting estimate list for updating
          this.estimateSubscription = this.db
            .getAllEstimates(this.superUserId, this.data.id)
            .subscribe((data) => {
              this.estimates = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as Invoice;
              });
              //changing field name for each estimate using estimate id
              this.estimates.forEach((estelement) => {
                this.db.onUpdateEstimateSaleTitle(
                  this.superUserId,
                  estelement.id,
                  this.saleTitle,
                  firstName,
                  secondName,
                  companyName,
                  searchTermDoc
                );
              });
              //setting estimate data as updated
              this.estUpdated = true;
            });
          //geting expense list for updating
          this.expenseSubscription = this.db
            .getAllExpenses(this.superUserId, this.data.id)
            .subscribe((data) => {
              this.expenses = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as Expenses;
              });
              //changing field name for each expense using expense id
              this.expenses.forEach((expelement) => {
                this.db.onUpdateExpenseSaleTitle(
                  this.superUserId,
                  expelement.id,
                  this.saleTitle,
                  firstName,
                  secondName,
                  companyName
                );
              });
              //setting expense data as updated
              this.expenseUpdated = true;
            });

          var interval = setInterval(() => {
            // if all data is updated then closing interval and navigate to customer details

            if (
              this.expenseUpdated == true &&
              this.taskUpdated == true &&
              this.followupUpdated == true &&
              this.paymentUpdated == true &&
              this.quotUpdated == true &&
              this.invUpdated == true &&
              this.estUpdated == true
            ) {
              //clearing interval since all data is updated

              clearInterval(interval);
              //navigating to updated customer
              let message = this.fieldNameSale + ' Successfully Updated';
              this._snackBar.open(message, ' ', {
                duration: 2000,
              });
              //close popup
              if (form.value.salesStage != this.forms.salesStage) {
                this.dialogRef?.close('changed status');
              } else {
                this.router.navigate(['dash/sales/saleview/' + this.data.id]);
              }
              this.loader = false;
            }
          }, 200);
        } else {
          //close popup
          this.loader = false;

          if (form.value.salesStage != this.forms.salesStage) {
            this.dialogRef?.close('changed status');
          } else {
            this.dialogRef?.close('not changed status');
          }

          //show message only if changes are present
          if (newChangeLog != null) {
            let message = this.fieldNameSale + ' Successfully Updated';
            this._snackBar.open(message, ' ', {
              duration: 2000,
            });
          } else {
            //if no changes in changelog
            let message = 'No changes to update';
            this._snackBar.open(message, ' ', {
              duration: 2000,
            });
          }
        }
      }
    }
  }
  // for customer selection
  displayFn(customer: Customer): string {
    return customer && customer?.companyName != 'Individual'
      ? customer?.secondName != null
        ? customer?.companyName +
          ' | ' +
          customer?.firstName +
          ' ' +
          customer.secondName
        : customer?.companyName + ' | ' + customer?.firstName
      : customer && customer?.firstName && customer?.secondName != null
      ? customer?.firstName + ' ' + customer?.secondName
      : customer?.firstName;
  }
  //called when user selects the product
  productSelected() {
    this.selectedProduct = this.userForm.get('selectedProduct').value;
    if (this.selectedProduct !== null) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.selectedProduct.prodName === this.products[i].prodName) {
          this.addProdOption = true;
          this.prod = {
            id: 'id',
            productId: this.selectedProduct.id,
            prodName: this.selectedProduct.prodName,
            quantity: 1,
            discount: this.selectedProduct.discount,
            unitPrice: this.selectedProduct.unitPrice,
            prodCategory: this.selectedProduct.prodCategory,
          };
        }
      }
    } else {
      this.addProdOption = false;
    }
  }
  //to find date validation error
  checkDateValidation: ValidatorFn = (
    control: FormGroup
  ): ValidationErrors | null => {
    try {
      let startingDatefield = control.get('startDate').value;
      let endingDatefield = control.get('expCompletionDate').value;

      if (
        this.saleSettings.startDate.display === true &&
        startingDatefield > endingDatefield &&
        endingDatefield
      ) {
        this.dateError = true;
        return {};
      } else {
        this.dateError = false;
        return {};
      }
    } catch (err) {}
  };
  //calls when a new product is added
  addProduct() {
    if (this.prodArray.length === this.maxItems) {
      this._snackBar.open('Limit reached', ' ', {
        duration: 5000,
      });
    } else {
      //push product data into prodFormArray when user adds new product
      const add = this.userForm.get('prodFormArray') as FormArray;
      add.push(
        this.fb.group({
          id: this.prod['id'],
          productId: this.prod['productId'],
          quantity: [
            this.prod['quantity'],
            this.itemsQtyDisplay === true ? [Validators.required] : [],
          ],
          discount: [
            this.prod['discount'],
            this.productSettings.discount.mandatory === true
              ? [Validators.required]
              : [],
          ],
          unitPrice: [
            this.prod['unitPrice'],
            this.productSettings.unitPrice.mandatory === true
              ? [Validators.required]
              : [],
          ],
          prodName: this.prod['prodName'],
          prodCategory: this.prod['prodCategory'],
        })
      );
      this.addedProducts[Object.keys(this.addedProducts).length] = this.prod;
      //for changeLog purpose: New products are added to prevForm for comparing the values modified,
      //without this, you get a console error on adding new product and modifying its value
      if (this.data.scenario == 'edit') {
        const addPrevForm = this.previousForm.get('prodFormArray') as FormArray;
        addPrevForm.push(
          this.fb.group({
            id: this.prod['id'],
            productId: this.prod['productId'],
            quantity: [
              this.prod['quantity'],
              this.itemsQtyDisplay === true ? [Validators.required] : [],
            ],
            discount: [
              this.prod['discount'],
              this.productSettings.discount.mandatory === true
                ? [Validators.required]
                : [],
            ],
            unitPrice: [
              this.prod['unitPrice'],
              this.productSettings.unitPrice.mandatory === true
                ? [Validators.required]
                : [],
            ],
            prodName: this.prod['prodName'],
            prodCategory: this.prod['prodCategory'],
          })
        );
      }
      this.userForm.patchValue({
        selectedProduct: '',
      });
      this.addProdOption = false;
      this.updateEstValue();
      this.disableEstOption = true;
      this.userForm.get('estimatedValue').disable();
    }
  }
  //clear product category value
  clearCategory() {
    //clear category and product values on clearing category
    this.userForm.patchValue({
      selProdCat: '',
      selectedProduct: '',
    });
    //disable add product icon
    this.addProdOption = false;
  }
  //clear product values
  clearProduct() {
    this.userForm.patchValue({
      selectedProduct: '',
    });
    this.addProdOption = false;
  }
  // autoComplete display function
  displayFnProduct(subject) {
    return subject ? subject.prodName : undefined;
  }
  //removes the formcontrol for products and deletes the product
  removeForm(index) {
    this.deletedProducts[Object.keys(this.deletedProducts).length] = {
      id: this.prodArray[index].productId,
      prodName: this.prodArray[index].prodName,
      prodCategory: this.prodArray[index].prodCategory,
    };
    this.prodArray.splice(index, 1);
    const add = this.userForm.get('prodFormArray') as FormArray;
    add.removeAt(index);
    ////for changeLog purpose: Deleted products are removed from prevForm for comparing the values modified,
    //without this, you get a console error on adding new product and modifying its value
    if (this.data.scenario == 'edit') {
      const addPrevForm = this.previousForm.get('prodFormArray') as FormArray;
      addPrevForm.removeAt(index);
    }
    this.updateEstValue();
    if (this.prodArray?.length === 0) {
      this.disableEstOption = false;
      this.userForm.get('estimatedValue').enable();
    }
  }
  //checking wheter company name is present or not
  companycheck(company: string) {
    if (company == 'N/A') {
      return 'Individual';
    } else if (company != 'N/A') {
      return company;
    }
  }
  //returns orgId when org is selected from auto-complete
  orgIdEventHander($event) {
    if ($event) {
      this.orgId = $event;
    } else {
      this.orgId = '';
    }
  }
  //returns org name when org is selected from auto-complete
  orgNameEventHander($event) {
    if ($event) {
      this.orgName = $event;
    } else {
      this.orgName = '';
    }
  }
  //returns customer details when contact is selected from auto-complete
  contSelectedEventHander($event: any) {
    this.custData = $event;
    if (this.custData) {
      this.userData.countryCode = this.custData.code
        ? this.custData.code
        : null;
      this.userData.contactNumber = this.custData.contactNo
        ? this.custData.contactNo
        : null;
      this.userData.altCountryCode = this.custData.altContactCode
        ? this.custData.altContactCode
        : null;
      this.userData.altContactNumber = this.custData.alternateContactNumber
        ? this.custData.alternateContactNumber
        : null;
    } else {
      this.userData.countryCode = null;
      this.userData.contactNumber = null;
      this.userData.altCountryCode = null;
      this.userData.altContactNumber = null;
    }
  }
  //checking network enabled or not
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  //recalculates estimated value
  updateEstValue() {
    this.prodArray = this.userForm.get('prodFormArray').value;
    this.productEstValue = 0; //ensure 0 before adding up
    for (let i = 0; i < this.prodArray.length; i++) {
      this.productEstValue +=
        this.prodArray[i].unitPrice *
        (1 - this.prodArray[i].discount / 100) *
        this.prodArray[i].quantity;
    }
    this.userData.estimatedValue = this.productEstValue;
    this.userForm.patchValue({
      estimatedValue: this.productEstValue,
    });
  }
  // get categoriess
  getCats(): string[] {
    let category: ProductCategories = null;
    category = new ProductCategories();
    return category.prodCats;
  }
  //returns assignedTo and branch details
  assignedToEventHander($event: any) {
    this.assignedTo = $event;
    if (this.assignedTo) {
      for (let i = 0; i < this.allSubUsers.length; i++) {
        if (this.assignedTo === this.allSubUsers[i].userId) {
          if (this.allSubUsers[i].branchId) {
            this.associatedBranch = this.allSubUsers[i].branchId;
          } else {
            this.associatedBranch = 'NA';
          }
        }
      }
    }
  }
  //returns assignedToName
  assignedToNameEventHander($event: any) {
    this.userData.assignedToName = $event;
  }
  //returns branch details
  branchIdEventHandler($event: any) {
    this.associatedBranch = $event;
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    //unsubscribing subscription
    this.userDetailsSubscription?.unsubscribe();
    this.quotationSubscription?.unsubscribe();
    this.invoiceSubscription?.unsubscribe();
    this.taskSubscription?.unsubscribe();
    this.followupSubscription?.unsubscribe();
    this.paymentSubscription?.unsubscribe();
    this.estimateSubscription?.unsubscribe();
    this.expenseSubscription?.unsubscribe();
    this.saleUsersSubscription?.unsubscribe();
    this.additionalFields = [];
  }
}
