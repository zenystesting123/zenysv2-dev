import { Component, HostListener, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppCustomDirective } from '../app.validators';
import { ChangeLogComponent } from '../change-log/change-log.component';
import { CommonService } from '../common.service';
import {
  addFieldsArr,
  Customer,
  customFields,
  defaultServiceSettings,
  Expenses,
  FollowUps,
  Invoice,
  modules,
  OrganisationModel,
  PaymentReceipt,
  prodmodel,
  ProductInSaleModel,
  ProductModel,
  Profile,
  SearchTerm,
  SearchTermService,
  Service,
  serviceSettings,
  StageHistoryModel,
  Task,
  UserAccessDetails,
} from '../data-models';
import { NetworkCheckService } from '../networkcheck.service';
import { CrudServiceService } from './crud-service.service';
import { Pipelines } from '../model/pipeline.modal';

@Component({
  selector: 'app-crud-service',
  templateUrl: './crud-service.component.html',
  styleUrls: ['./crud-service.component.scss'],
})
export class CrudServiceComponent implements OnInit {
  userForm: FormGroup; //formcontrols for reactive form
  submitClicked: boolean = false; //to check submit clicked or not
  onSubmitForm: boolean = false; //to check whether the from is submitted or not
  custData: any = {
    //to store customers name and company name
    firstName: null,
    secondName: null,
    companyName: null,
    surname: null,
  };
  defaultValuesArray: any[];
  userData: Service = {
    //to store service information
    taggedUsers: null,
    selectedServPipeline: 0,
    associatedBranch: 'NA',
    id: null,
    firstName: null,
    secondName: null,
    companyName: null,
    surname: null,
    additionalFieldsArray: null,
    serviceTitle: null,
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
    servicesStage: null,
    servicesType: null,
    priority: null,
    assignedTo: null,
    assignedToName: null,
    collectionMode: null,
    collectedAmount: null,
    customerId: null,
    EstimatedValue: null,
    invoicedAmount: null,
    createdDate: null,
    days: null,
    daysRange: null,
    completedserviceDate: null,
    confirmedserviceDate: null,
    opportunityDate: null,
    inquiryDate: null,
    expenseAmount: null,
    stageHistory: null,
    searchTerm: null,
    sequenceNumber: null,
    additionalFieldsArr: null,
    inPipeline: null,
    won: null,
    lost: null,
    createdBy: null,
    changeLog: null,
    orgId: null,
    contactOwner: null,
    lastAddedNote: '',
    lastNoteDate: null,
    lastNoteId: '',
    rejectionReasonValue: '',
    assignedToDate: null,
    lastModifiedDate:  null,
    countryCode: null,
    contactNumber: null,
    altCountryCode: null,
    altContactNumber: null,
  };
  rejectionReasonArr: string[] = []; //rejection reason array
  rejectionReasonArrPresent = true; //if reason for rerejection array is present/not
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
    fieldValue: null,
  };
  additionalFields = [this.additionalFieldModel];
  addFieldsArray = [this.addFieldArrModel]; //to store additional fields in sales
  additionalFieldLength: number; //store additional fields length
  authSubcription: Subscription; //for subscribing auth
  userDetailSubcription: Subscription; //for subscribing userdetails
  serviceUsersSubscription: Subscription; //for subscribing services while updating
  titleName: string; //to store form heading nam
  subUsers: any[]; //to store subusers array
  loader: boolean = false; //to enable loader while uploading
  expenses: Expenses[]; //to store expenses array
  firstname: string; //store users firstname
  secondname: string; //store users second name
  userId: any; //to store user id
  superUserId: any; //store superuser id
  dataAccessRule: any; //to store access rule
  userRole: any; //to store users role
  accountType: any; //to store account type of user
  forms: any; //to store servicedetails while updating
  stageHistories: any[]; //to store history of stages in service
  followupUpdated: boolean = false; //to check followup data updated in db
  taskUpdated: boolean = false; //to check task data updated in db
  expenseUpdated: boolean = false; //to check expense data updated in db
  paymentUpdated: boolean = false; //to check payment data updated in db
  quotUpdated: boolean = false; //to check quotation data updated in db
  invUpdated: boolean = false; //to check invoice data updated in db
  estUpdated: boolean = false; //to check estimate data updated in db
  stageHistory: any[] = []; //to store new stage history
  stageValues: StageHistoryModel = {
    //to store latest stages value while updating and creating
    date: null,
    stageId: null,
    pipelineId: null,
  };
  paymentSubscription: Subscription; //for subscribing payment list
  taskSubscription: Subscription; //for subscribing task list
  followupSubscription: Subscription; //for subscribing task list
  invoiceSubscription: Subscription; //for subscribing invoice list
  quotationSubscription: Subscription; //for subscribing quotation list
  estimateSubscription: Subscription; //for subscribing estimate list
  payments: PaymentReceipt[] = []; //for storing payments list
  invoices: Invoice[] = []; //for storing invoice list
  quotations: Invoice[] = []; //for storing quotation list
  estimates: Invoice[] = []; //for storing estimate list
  tasks: Task[] = []; //for storing task list
  followups: FollowUps[] = []; //for storing followups list
  userDetailsSubscription: Subscription; //for subscribing to user details
  serviceTitle: string;
  networkConnection: boolean; //for checking is connection active or not
  userDataProfile: UserAccessDetails;
  // disableEditservice: boolean = false;//disabled fields in service
  fieldList: any = [' ']; //defaulting field list
  statusArray: any[]; //to store status of service
  fieldListArray: any; //to store values of additional fields
  additionalList = [this.fieldList]; //defining additional fields
  additionalListForm: FormGroup; //setting values as rective form
  additionalListDefaultForm: FormGroup; //for setting default values to additoinal field
  collectionMode: any; //to store collection mode of service
  assignedTo: any; //to store services assigned to value
  superUserDetails: Profile; //to store super user details
  fieldNameContact: string = 'Contact'; //setting default value for contact
  fieldNameService: string = 'Support'; //setting default values for service
  fieldNameItems = 'Products and Service';
  superUserFirstName: string; //for storing super user first name
  superUserSecondName: string; //for storing super user last name
  serviceSequenceNumber: number; // for updating sequence number in user
  searchOrg: string = 'Org'; //Mode for searching contact - Organization name/ contact person name
  selectedServPipeline: number; //index of selected service pipeline name
  inPipeline = false;
  won = false;
  lost = false;

  dateError = false;
  identify;
  allSubUsers: any[] = []; //to store subUsers based on access rule
  usersFirstName: string; // super user firstname
  usersLastName: string; // super user last name
  currentUserFirstName: string;
  currentUserLastName: string;
  assignedToName: string;
  disableReAssign = false;
  surname = '';
  serviceSettings: serviceSettings = defaultServiceSettings.CONST_VALUE;
  associatedBranch = '';
  prevAssBranch = '';
  branches = [];
  plan = '';

  previousForm: FormGroup;
  changeLog: any;
  userName: string;

  deletedProducts: any = {};
  addedProducts: any = {};
  orgId = '';
  orgName = '';
  customerId = '';
  prevOrgId = '';
  prevOrgName = '';
  prevCustid = '';
  contactOwner: string;
  orgSelected = false;
  contactSelected = false;
  daTime: Date;
  formReset: boolean = true;
  customerName: any; // to store customer's fullname
  previousCustomerName: any; // to store previous value of customer's fullname
  //store the previous value of pipeline to use in changeLog
  previousPipeline: number;
  //store the previous value of status to use in changeLog
  previousStage: string;
  previousAssignedTo: string;
  previousAssignedToName: string;
  assignedToDate:number=null;// old assigned to date
  servicePipelines: Pipelines[] = [];
  constructor(
    // private analytics: AngularFireAnalytics,
    private router: Router,
    public dialogRef: MatDialogRef<CrudServiceComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data,
    private db: CrudServiceService,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    let loopOnce = false;
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {

          //for storing user id
          this.userId = allData.userId;
          this.userName = allData.userDetails.lastname
            ? allData.userDetails.firstname + ' ' + allData.userDetails.lastname
            : allData.userDetails.firstname;
          this.accountType = allData.userDetails.accountType;
          //Check screen size form common service file
          //checking customer typeisCustomerIndividual

          //condition to check where the user is a super user or not
          if (allData.userDetails.superUserId) {
            this.superUserDetails = allData.superUserDetails;
            this.superUserId = allData.userDetails.superUserId;
            this.plan = allData.superUserDetails.plan;


            if(this.commonService.userPlan.multiPipelineAccess){
              this.servicePipelines = JSON.parse(JSON.stringify(allData.servicePipelines));
             }else{
               this.servicePipelines.push(JSON.parse(JSON.stringify(allData.servicePipelines))[0]);
             }

             if(this.formReset){
              this.selectedServPipeline = this.servicePipelines[0].pipelineId;
             this.pipelineChangedEvent(this.selectedServPipeline)
             }

            this.superUserFirstName = allData.superUserDetails.firstname;
            this.superUserSecondName = allData.superUserDetails.lastname;
          } else {
            this.superUserId = allData.userId;
            //getting status of customer

            this.userRole = allData.userDetails.userRole;

            this.superUserFirstName = allData.superUserDetails.firstname;
            this.superUserSecondName = allData.superUserDetails.lastname;
          }
          this.userData.servicesStage = this.statusArray[0].stageId;
          if (this.superUserDetails?.fieldNames?.fieldNameService) {
            this.fieldNameService =
              this.superUserDetails.fieldNames.fieldNameService;
          }
          // assign reason rejection array to local variable
          if (
            allData.superUserDetails?.serviceSettings?.rejectionReason
              ?.rejectionReason
          ) {
            this.rejectionReasonArr =
              allData.superUserDetails?.serviceSettings?.rejectionReason?.rejectionReason?.split(
                ','
              );
              this.rejectionReasonArrPresent = true;
          } else {
            this.rejectionReasonArr[0] = 'No options are available';
            this.rejectionReasonArrPresent = false;
          }

          //customisable field config
          //getting additional field
          if (!!allData.superUserDetails.serviceSettings) {
            this.serviceSettings = allData.superUserDetails.serviceSettings;
          }

          if (this.accountType == 'SuperUser') {
            this.firstname = allData.superUserDetails.firstname;
            this.secondname = allData.superUserDetails.lastname;
          } else {
            this.firstname = allData.userDetails.firstname;
            this.secondname = allData.userDetails.lastname;
          }

          //getting sub users details
          this.subUsers = allData.subUsers;
          this.dataAccessRule = allData.usrProfileData.dialogdataAccessRule; // for access rule check
          this.allSubUsers = this.commonService.createUserlist('All', 'any')[1];
          this.branches = allData.branches;
          if (this.data.scenario != 'edit' && this.formReset) {
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

          //if mode of service is edit
          if (this.formReset && this.data.scenario == 'edit') {

            this.formReset = false;
            //getting additional field
            this.additionalFields =
              allData.superUserDetails.customFieldsService;
            this.additionalFieldLength = this.additionalFields?.length;
            if (!this.additionalFieldLength) {
              this.additionalFieldLength = 0;
            }
            //to get intial value of additional field w/o data change
            if (!loopOnce) {
              this.defaultValuesArray = [];
              this.additionalFields?.forEach((val) => {
                this.defaultValuesArray?.push(val.defaultValue);
              });
            }
            if (
              allData.usrProfileData.isCheckedService === false ||
              allData.usrProfileData.serviceReAssign === false
            ) {
              this.disableReAssign = true;
            }
            //getting service data from common service file
            let serviceDetails = this.commonService.getServiceToEdit();
            this.customerId = serviceDetails.customerId;
            this.userData.countryCode = serviceDetails.countryCode ? serviceDetails.countryCode :null;
            this.userData.contactNumber = serviceDetails.contactNumber ? serviceDetails.contactNumber :null;
            this.userData.altCountryCode = serviceDetails.altCountryCode ? serviceDetails.altCountryCode :null;
            this.userData.altContactNumber = serviceDetails.altContactNumber ? serviceDetails.altContactNumber :null;
            if (serviceDetails.customerId) {
              this.contactSelected = true;
            } else {
              this.contactSelected = false;
            }
            this.contactOwner = serviceDetails.contactOwner;
            //assigning values to all field
            this.forms = serviceDetails;
            this.custData.firstName = serviceDetails.firstName;
            this.custData.secondName = serviceDetails.secondName;
            this.custData.companyName = serviceDetails.companyName;
            this.custData.surname = serviceDetails.surname
              ? serviceDetails.surname
              : '';
            //current customer's fullname
            if (
              serviceDetails.firstName &&
              serviceDetails.secondName &&
              serviceDetails.surname
            ) {
              this.customerName =
                serviceDetails.firstName +
                ' ' +
                serviceDetails.secondName +
                ' ' +
                serviceDetails.surname;
            } else if (
              serviceDetails.firstName &&
              serviceDetails.secondName &&
              !serviceDetails.surname
            ) {
              this.customerName =
                serviceDetails.firstName + ' ' + serviceDetails.secondName;
            } else if (
              serviceDetails.firstName &&
              !serviceDetails.secondName &&
              serviceDetails.surname
            ) {
              this.customerName =
                serviceDetails.firstName + ' ' + serviceDetails.surname;
            } else {
              this.customerName = serviceDetails.firstName
                ? serviceDetails.firstName
                : null;
            }
            //store previous customer name to add in change log
            this.previousCustomerName = this.customerName
              ? this.customerName
              : null;
            this.prevCustid = serviceDetails.customerId;
            this.orgName = serviceDetails.companyName;
            this.orgId = serviceDetails.orgId ? serviceDetails.orgId : '';
            if (serviceDetails.orgId) {
              this.orgSelected = true;
            } else {
              this.orgSelected = false;
            }
            this.prevOrgName = serviceDetails.companyName;
            this.prevOrgId = serviceDetails.orgId ? serviceDetails.orgId : '';
            this.userData.serviceTitle = serviceDetails.serviceTitle;
            this.userData.description = serviceDetails.description;
            this.userData.estimatedValue = serviceDetails.estimatedValue;
            this.userData.expCompletionDate =
              serviceDetails.expCompletionDate.toDate();
            this.userData.startDate = serviceDetails.startDate.toDate();
            this.userData.servicesType = serviceDetails.servicesType;
            this.userData.priority = serviceDetails.priority;
            this.userData.collectionMode = serviceDetails.collectionMode;
            this.collectionMode = serviceDetails.collectionMode;
            this.assignedTo = serviceDetails.assignedTo;
            this.previousAssignedTo = serviceDetails.assignedTo;
            // get old assigned to date
            if (serviceDetails.assignedToDate) {
              this.assignedToDate = serviceDetails.assignedToDate
            }
            this.associatedBranch = serviceDetails.associatedBranch
              ? serviceDetails.associatedBranch
              : '';
            this.prevAssBranch = serviceDetails.associatedBranch
              ? serviceDetails.associatedBranch
              : '';
            this.userData.assignedToName = this.commonService.getAssignedToName(serviceDetails.assignedTo);
            this.previousAssignedToName = this.userData.assignedToName;
            this.changeLog = serviceDetails.changeLog;
            //store previous pipeline
            this.previousPipeline = serviceDetails.selectedServPipeline;
            //store previous status
            this.previousStage = serviceDetails.servicesStage;
            this.userData.rejectionReasonValue =
              serviceDetails.rejectionReasonValue
                ? serviceDetails.rejectionReasonValue
                : '';

            this.selectedServPipeline = serviceDetails.selectedServPipeline;
            this.pipelineChangedEvent(this.selectedServPipeline);

            this.userData.servicesStage = serviceDetails.servicesStage;

            this.fieldListArray = serviceDetails.additionalFieldsArray;
            this.additionalListDefaultForm = new FormGroup({});
            this.additionalListForm = new FormGroup({});
            //getting values pushed to field array
            this.addFieldsArray = serviceDetails.additionalFieldsArr;
            if (serviceDetails.additionalFieldsArr) {
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
            //setting group as form group
            this.additionalListForm = new FormGroup({
              additonalFields: new FormArray([]),
            });
            this.additionalFields?.forEach((additonalFields) =>
              (<FormArray>this.additionalListForm.get('additonalFields')).push(
                this.createItemFormGroup(additonalFields)
              )
            );
            if (this.fieldListArray?.length == 0) {
              for (let i = 0; i < this.additionalFields?.length; i++) {
                this.additionalFields[i].value = ' ';
              }
            }
            this.userData.assignedTo = this.data.assignedTo;
            this.userData.collectionMode = this.data.collectionMode;
            //setting titile name as update
            this.titleName = 'Update';

            this.userForm = this.fb.group(
              {
                serviceTitle: [
                  this.userData.serviceTitle,
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
                  },
                ],
                collectionMode: [this.collectionMode],
                startDate: [
                  this.userData.startDate,
                  [Validators.required, AppCustomDirective.fromDateValidator],
                ],
                expCompletionDate: [
                  this.userData.expCompletionDate,
                  [Validators.required, AppCustomDirective.fromDateValidator],
                ],
                selectedServPipeline: [this.selectedServPipeline],
                servicesStage: [this.userData.servicesStage],
                rejectionReasonVal: [this.userData.rejectionReasonValue],
                priority: [this.userData.priority],
                //assignedTo: [this.assignedTo],
                description: [this.userData.description],
                additionalFields: this.fb.array([]),
                selectedProduct: [''],
                selProdCat: '',

                prodFormArray: this.fb.array([]),
              },
              { validators: this.checkDateValidation }
            );
            //customisable field settings
            if (this.serviceSettings) {
              //selectedServPipeline
              if (
                this.serviceSettings?.selectedServPipeline?.mandatory === true
              ) {
                this.userForm.controls['selectedServPipeline'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls[
                  'selectedServPipeline'
                ].clearValidators();
              }
              this.userForm.controls[
                'selectedServPipeline'
              ].updateValueAndValidity();
              //servicesStage
              if (this.serviceSettings?.servicesStage?.mandatory === true) {
                this.userForm.controls['servicesStage'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['servicesStage'].clearValidators();
              }
              this.userForm.controls['servicesStage'].updateValueAndValidity();
              //priority
              if (this.serviceSettings?.priority?.mandatory === true) {
                this.userForm.controls['priority'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['priority'].clearValidators();
              }
              this.userForm.controls['priority'].updateValueAndValidity();
              //description
              if (this.serviceSettings?.description?.mandatory === true) {
                this.userForm.controls['description'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['description'].clearValidators();
              }
              this.userForm.controls['description'].updateValueAndValidity();

              //customisable field settings ends here
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
            if (this.userForm) {
              this.loader = false;
            }
            //form gets completely loaded after this subscription
            this.previousForm = ChangeLogComponent.cloneAbstractControl(
              this.userForm
            );
          }
          //if senerio is create from customer or from full layout
          else if (
            this.formReset &&
            (this.data.scenario == 'create' ||
              this.data.scenario == 'createfromCustomer')
          ) {
            this.formReset = false;
            //getting additional field
            this.additionalFields =
              allData.superUserDetails.customFieldsService;
            this.additionalFieldLength = this.additionalFields?.length;
            if (!this.additionalFieldLength) {
              this.additionalFieldLength = 0;
            }
            //to get intial value of additional field w/o data change
            if (!loopOnce) {
              this.defaultValuesArray = [];
              this.additionalFields?.forEach((val) => {
                this.defaultValuesArray?.push(val.defaultValue);
              });
            }
            if (this.data.title) {
              this.userData.serviceTitle = this.data.title;
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
            this.userData.assignedToName =
              this.firstname + ' ' + this.secondname;

            //getting customers name and details from db if created form customer view
            this.serviceUsersSubscription = this.db
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
                if (customer?.orgId) {
                  this.orgSelected = true;
                } else {
                  this.orgSelected = false;
                }
                this.orgName = customer?.companyName
                  ? customer?.companyName
                  : '';
                if (customer) {
                  this.userData.countryCode = customer.code ? customer.code : null;
                  this.userData.contactNumber = customer.contactNo ? customer.contactNo : null;
                  this.userData.altCountryCode = customer.altContactCode ? customer.altContactCode : null;
                  this.userData.altContactNumber = customer.alternateContactNumber ? customer.alternateContactNumber : null;
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
            if (this.statusArray) {
              this.userData.servicesStage = this.statusArray[0].stageId;
            }
            // if(this.isCustomerIndividual === true){
            //   this.searchOrg = "Contact"
            // }
            // if (this.isCustomerIndividual === true) {
            //   this.searchOrg = 'Contact';
            // }
            //form controls for create
            this.userForm = this.fb.group(
              {
                serviceTitle: [
                  this.userData.serviceTitle,
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
                  },
                ],
                collectionMode: [this.collectionMode],
                startDate: [
                  this.userData.startDate,
                  [Validators.required, AppCustomDirective.fromDateValidator],
                ],
                expCompletionDate: [
                  this.userData.expCompletionDate,
                  [Validators.required, AppCustomDirective.fromDateValidator],
                ],
                selectedServPipeline: [this.selectedServPipeline],
                servicesStage: [this.userData.servicesStage],
                rejectionReasonVal: [this.userData.rejectionReasonValue],
                priority: [this.userData.priority],
                //assignedTo: [this.assignedTo],
                description: [this.userData.description],
                additionalFields: this.fb.array([]),
                selectedProduct: [''],
                selProdCat: '',
                prodFormArray: this.fb.array([]),
              },
              { validators: this.checkDateValidation }
            );
            //customisable field settings
            if (this.serviceSettings) {
              //selectedServPipeline
              if (
                this.serviceSettings?.selectedServPipeline?.mandatory === true
              ) {
                this.userForm.controls['selectedServPipeline'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls[
                  'selectedServPipeline'
                ].clearValidators();
              }
              this.userForm.controls[
                'selectedServPipeline'
              ].updateValueAndValidity();
              //servicesStage
              if (this.serviceSettings?.servicesStage?.mandatory === true) {
                this.userForm.controls['servicesStage'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['servicesStage'].clearValidators();
              }
              this.userForm.controls['servicesStage'].updateValueAndValidity();
              //priority
              if (this.serviceSettings?.priority?.mandatory === true) {
                this.userForm.controls['priority'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['priority'].clearValidators();
              }
              this.userForm.controls['priority'].updateValueAndValidity();
              //description
              if (this.serviceSettings?.description?.mandatory === true) {
                this.userForm.controls['description'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['description'].clearValidators();
              }
              this.userForm.controls['description'].updateValueAndValidity();
              //customisable field settings ends here
            }
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
          } else if (this.formReset && this.data.scenario == 'createfromOrg') {
            this.formReset = false;
            //getting additional field
            this.additionalFields =
              allData.superUserDetails.customFieldsService;
            this.additionalFieldLength = this.additionalFields?.length;
            if (!this.additionalFieldLength) {
              this.additionalFieldLength = 0;
            }
            //to get intial value of additional field w/o data change
            if (!loopOnce) {
              this.defaultValuesArray = [];
              this.additionalFields?.forEach((val) => {
                this.defaultValuesArray?.push(val.defaultValue);
              });
            }
            this.orgId = this.data.id;
            this.orgSelected = true;
            this.orgName = this.data.orgName;
            if (this.data.title) {
              this.userData.serviceTitle = this.data.title;
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
            this.userData.assignedToName =
              this.firstname + ' ' + this.secondname;

            //getting customers name and details from db if created form customer view
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
            if (this.statusArray) {
              this.userData.servicesStage = this.statusArray[0].stageId;
            }
            // if(this.isCustomerIndividual === true){
            //   this.searchOrg = "Contact"
            // }
            // if (this.isCustomerIndividual === true) {
            //   this.searchOrg = 'Contact';
            // }
            //form controls for create
            this.userForm = this.fb.group(
              {
                serviceTitle: [
                  this.userData.serviceTitle,
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
                  },
                ],
                collectionMode: [this.collectionMode],
                startDate: [
                  this.userData.startDate,
                  [Validators.required, AppCustomDirective.fromDateValidator],
                ],
                expCompletionDate: [
                  this.userData.expCompletionDate,
                  [Validators.required, AppCustomDirective.fromDateValidator],
                ],
                selectedServPipeline: [this.selectedServPipeline],
                servicesStage: [this.userData.servicesStage],
                rejectionReasonVal: [this.userData.rejectionReasonValue],
                priority: [this.userData.priority],
                //assignedTo: [this.assignedTo],
                description: [this.userData.description],
                additionalFields: this.fb.array([]),
                selectedProduct: [''],
                selProdCat: '',
                prodFormArray: this.fb.array([]),
              },
              { validators: this.checkDateValidation }
            );
            //customisable field settings
            if (this.serviceSettings) {
              //selectedServPipeline
              if (
                this.serviceSettings?.selectedServPipeline?.mandatory === true
              ) {
                this.userForm.controls['selectedServPipeline'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls[
                  'selectedServPipeline'
                ].clearValidators();
              }
              this.userForm.controls[
                'selectedServPipeline'
              ].updateValueAndValidity();
              //servicesStage
              if (this.serviceSettings?.servicesStage?.mandatory === true) {
                this.userForm.controls['servicesStage'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['servicesStage'].clearValidators();
              }
              this.userForm.controls['servicesStage'].updateValueAndValidity();
              //priority
              if (this.serviceSettings?.priority?.mandatory === true) {
                this.userForm.controls['priority'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['priority'].clearValidators();
              }
              this.userForm.controls['priority'].updateValueAndValidity();
              //description
              if (this.serviceSettings?.description?.mandatory === true) {
                this.userForm.controls['description'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.userForm.controls['description'].clearValidators();
              }
              this.userForm.controls['description'].updateValueAndValidity();
              //customisable field settings ends here
            }
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
          }
          //disabling field

          this.userDataProfile = allData.usrProfileData;
          if (this.userDataProfile) {
            // disable contact section
            // if (this.userDataProfile.isCheckedservice == false) {
            //   this.disableEditservice = true;
            // } else {
            //   if (this.userDataProfile.servicesEdit == false) {
            //     this.disableEditservice = true;
            //   }
            // }
          }
        }
      }
    );
  }
  pipelineChangedEvent(pipelineId){
    this.selectedServPipeline = pipelineId
    var result = this.servicePipelines.filter(obj => {
      return obj.pipelineId === pipelineId
    })
    if(result.length > 0){
      this.statusArray = result[0].pipelineStages.map(({ name, stageId }) => ({
        name, stageId
      }));
    }else{
      this.selectedServPipeline = null
      this.statusArray = []
    }

     //In update scenario, if user has changed the pipeline and returns back to the saved pipeline, restore saved status
     if (
      this.data.scenario == 'edit' &&
      this.selectedServPipeline == this.previousPipeline
    ) {
      this.custData.servicesStage = this.previousStage;
      this.userForm?.controls.servicesStage.setValue(this.custData.servicesStage);
    }else{
      if(this.statusArray?.length > 0){
        this.custData.servicesStage = this.statusArray[0].stageId;
        this.userForm?.controls.servicesStage.setValue(this.statusArray[0].stageId);
      }else{
      this.custData.servicesStage = null;
      this.userForm?.controls.servicesStage.setValue(null);
      }
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
  //triggered while a cusomer is selected form auto complete
  orgIdEventHander($event) {
    if ($event) {
      this.orgId = $event;
    } else {
      this.orgId = '';
    }
  }
  orgNameEventHander($event) {
    if ($event) {
      this.orgName = $event;
    } else {
      this.orgName = '';
    }
  }
  contSelectedEventHander($event: any) {
    this.custData = $event;
    if (this.custData) {
      this.userData.countryCode = this.custData.code ? this.custData.code : null;
      this.userData.contactNumber = this.custData.contactNo ? this.custData.contactNo : null;
      this.userData.altCountryCode = this.custData.altContactCode ? this.custData.altContactCode : null;
      this.userData.altContactNumber = this.custData.alternateContactNumber ? this.custData.alternateContactNumber : null;
    } else {
      this.userData.countryCode =  null;
      this.userData.contactNumber = null;
      this.userData.altCountryCode =  null;
      this.userData.altContactNumber = null;
    }
  }

  //checking network enabled or not
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  //seperating each value in additional field
  createItemFormGroup(additonalFields) {
    return new FormGroup({
      categories: new FormControl(additonalFields.categories),
      categoriesOpn: new FormControl(additonalFields.categoriesOpn),
      defaultValue: new FormControl(additonalFields.defaultValue),
      fieldName: new FormControl(additonalFields.fieldName),
      fieldType: new FormControl(additonalFields.fieldType),
      mandatory: new FormControl(additonalFields.mandatory),
      value: new FormControl(additonalFields.value),
    });
  }
  onNoClick1() {
    this.userForm.reset();
    this.dialogRef.close();
  }

  //saving assignedToName while selecting assigned to
  onAssignedToSelected(firstName, lastName) {
    this.userData.assignedToName = firstName + ' ' + (lastName ? lastName : '');
  }
  // if status is rejected, set validators acc to settings, else set value null
  statusSelected($event) {
    if (
      this.serviceSettings.rejectionReasonVal?.mandatory === true &&
      $event === this.statusArray[this.statusArray.length - 1]
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

    let firstName = '';
    let secondName = '';
    let companyName = '';
    let surname = '';
    let orgId = '';

    this.loader = true;
    this.submitClicked = true;
    //triggering analytics
    // this.analytics.logEvent(GAevent);
    let selectedIndex;
    let statusArray = [];
    let datePlaced = new Date().getTime(); //Get TimeStamp
    //storing status
    statusArray = this.statusArray;

    this.onSubmitForm = true;
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

      this.serviceTitle = form.value.serviceTitle;
      let searchTerm: SearchTermService;
      //for storing search value
      if (secondName) {
        searchTerm = {
          firstName: firstName.toLowerCase(),
          secondName: secondName.toLowerCase(),
          companyName: companyName.toLowerCase(),
          surname: surname ? surname.toLowerCase() : surname,
        };
      } else {
        searchTerm = {
          firstName: firstName.toLowerCase(),
          secondName: secondName,
          companyName: companyName.toLowerCase(),
          surname: surname ? surname.toLowerCase() : surname,
        };
      }
      //checking is submit is selceetd from create form
      if (this.data.scenario == 'create') {
        form.value.invoicedAmount = 0; //Initialize the invoicedAmount to 0
        form.value.collectedAmount = 0; //initialize the amount collected to 0

        this.stageValues.date = datePlaced;
        this.stageValues.stageId = form.value.servicesStage;
        this.stageValues.pipelineId = this.selectedServPipeline;
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

        if (this.commonService.superUserData.serviceSequentialNumber) {
          this.serviceSequenceNumber =
            this.commonService.superUserData.serviceSequentialNumber + 1;
        } else {
          this.serviceSequenceNumber = 1;
        }
        if (
          form.value.servicesStage ===
          this.statusArray[this.statusArray.length - 1].stageId
        ) {
          this.lost = true;
          this.won = false;
          this.inPipeline = false;
        } else if (
          form.value.servicesStage ===
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
          // additionalField: form.value.additionalField,
          rejectionReasonValue: form.value.rejectionReasonVal
            ? form.value.rejectionReasonVal
            : '',
          assignedTo: this.assignedTo,
          associatedBranch: this.associatedBranch ? this.associatedBranch : '',
          collectedAmount: form.value.collectedAmount,
          collectionMode: form.value.collectionMode
            ? form.value.collectionMode
            : '100% on completion',
          estimatedValue: form.value.estimatedValue
            ? form.value.estimatedValue
            : this.userData.estimatedValue,
          expCompletionDate: form.value.expCompletionDate,
          invoicedAmount: form.value.invoicedAmount,
          priority: form.value.priority,
          serviceTitle: form.value.serviceTitle,
          servicesStage: form.value.servicesStage,
          startDate: form.value.startDate,
          createdBy: this.userId,
          selectedServPipeline: this.selectedServPipeline
            ? this.selectedServPipeline
            : 0,
          description: form.value.description,
          orgId: orgId,
          contactOwner: this.custData.assignedTo
            ? this.custData.assignedTo
            : null,
            countryCode :  this.userData.countryCode ? this.userData.countryCode: null,
          contactNumber : this.userData.contactNumber ?this.userData.contactNumber : null,
          altCountryCode :  this.userData.altCountryCode ?  this.userData.altCountryCode : null,
          altContactNumber : this.userData.altContactNumber ? this.userData.altContactNumber : null,
        };

        //creating service

        this.db
          .createservice(
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
            this.serviceSequenceNumber,
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
            this.db
              .updateserviceSequenceNumber(
                this.superUserId,
                this.serviceSequenceNumber
              )
              .then((result) => {
                this.dialogRef.close();
                let message = 'Successfully added';
                this._snackBar.open(message, ' ', {
                  duration: 2000,
                });
                //navigating to new services
                this.router.navigate([
                  'dash/service/service-details/' + res.id,
                ]);
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

             this.stageValues.date = datePlaced;
            this.stageValues.stageId= form.value.servicesStage;
            this.stageValues.pipelineId = this.selectedServPipeline;
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

        for (let i = 0; i < this.additionalFields?.length; i++) {
          this.additionalFields[i].defaultValue = this.defaultValuesArray[i];
        }
        if (this.commonService.superUserData.serviceSequentialNumber) {
          this.serviceSequenceNumber =
            this.commonService.superUserData.serviceSequentialNumber + 1;
        } else {
          this.serviceSequenceNumber = 1;
        }
        if (
          form.value.servicesStage ===
          this.statusArray[this.statusArray.length - 1].stageId
        ) {
          this.lost = true;
          this.won = false;
          this.inPipeline = false;
        } else if (
          form.value.servicesStage ===
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
          // additionalField: form.value.additionalField,
          rejectionReasonValue: form.value.rejectionReasonVal
            ? form.value.rejectionReasonVal
            : '',
          assignedTo: this.assignedTo,
          associatedBranch: this.associatedBranch ? this.associatedBranch : '',
          collectedAmount: form.value.collectedAmount,
          collectionMode: form.value.collectionMode
            ? form.value.collectionMode
            : '100% on completion',
          estimatedValue: form.value.estimatedValue
            ? form.value.estimatedValue
            : this.userData.estimatedValue,
          expCompletionDate: form.value.expCompletionDate,
          invoicedAmount: form.value.invoicedAmount,
          priority: form.value.priority,
          serviceTitle: form.value.serviceTitle,
          servicesStage: form.value.servicesStage,
          startDate: form.value.startDate,
          createdBy: this.userId,
          selectedServPipeline: this.selectedServPipeline
            ? this.selectedServPipeline
            : 0,
          description: form.value.description,
          orgId: orgId,
          contactOwner: this.custData.assignedTo
            ? this.custData.assignedTo
            : null,
          countryCode :  this.userData.countryCode ? this.userData.countryCode: null,
          contactNumber : this.userData.contactNumber ?this.userData.contactNumber : null,
          altCountryCode :  this.userData.altCountryCode ?  this.userData.altCountryCode : null,
          altContactNumber : this.userData.altContactNumber ? this.userData.altContactNumber : null,
        };

        //creating service
        this.db
          .createservice(
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
            this.serviceSequenceNumber,
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
            this.db
              .updateserviceSequenceNumber(
                this.superUserId,
                this.serviceSequenceNumber
              )
              .then((result) => {
                this.dialogRef.close();
                let message = 'Successfully added';
                this._snackBar.open(message, ' ', {
                  duration: 2000,
                });
                //navigating to new sake
                this.router.navigate([
                  'dash/service/service-details/' + res.id,
                ]);
              });
          });
        //if submit clicked while editing
      } else if (this.data.scenario == 'edit') {
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
        //checking service status is changed because we need to update history
        if (form.value.servicesStage == this.forms.servicesStage) {
          this.stageHistories = this.forms?.stageHistory;
        }
        if (form.value.servicesStage != this.forms.servicesStage) {
          let statusArrays = this.statusArray;
          let currentHistory = this.forms?.stageHistory;


          this.stageValues.date = datePlaced;
          this.stageValues.stageId= form.value.servicesStage;
          this.stageValues.pipelineId = this.selectedServPipeline;
          currentHistory.push(this.stageValues);
          this.stageHistories = currentHistory;
        }
        if (
          form.value.servicesStage ===
          this.statusArray[this.statusArray.length - 1].stageId
        ) {
          this.lost = true;
          this.won = false;
          this.inPipeline = false;
        } else if (
          form.value.servicesStage ===
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
      // if old assignee is not equal to new assignee update assigned to date
        if(this.previousAssignedTo != this.assignedTo){
         this.assignedToDate = new Date().getTime()
        }
        let formDetails = {
          // additionalField: form.value.additionalField,
          rejectionReasonValue: form.value.rejectionReasonVal
            ? form.value.rejectionReasonVal
            : '',
          assignedTo: this.assignedTo,
          associatedBranch: this.associatedBranch ? this.associatedBranch : '',
          collectionMode: form.value.collectionMode
            ? form.value.collectionMode
            : '100% on completion',
          estimatedValue: form.value.estimatedValue
            ? form.value.estimatedValue
            : this.userData.estimatedValue,
          expCompletionDate: form.value.expCompletionDate,
          priority: form.value.priority,
          serviceTitle: form.value.serviceTitle,
          servicesStage: form.value.servicesStage,
          startDate: form.value.startDate,
          selectedServPipeline: this.selectedServPipeline,
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
          assignedToDate:this.assignedToDate,
          countryCode :  this.userData.countryCode ? this.userData.countryCode: null,
          contactNumber : this.userData.contactNumber ?this.userData.contactNumber : null,
          altCountryCode :  this.userData.altCountryCode ?  this.userData.altCountryCode : null,
          altContactNumber : this.userData.altContactNumber ? this.userData.altContactNumber : null,
        };
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
          pipelineArray: this.servicePipelines,
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
            // customerId: this.custData.id ? this.custData.id : this.customerId,
            // firstName: firstName,
            // secondName: secondName,
            // surname: surname,
          },
          prevContact: {
            //previous value
            selectedCust: this.previousCustomerName
              ? this.previousCustomerName
              : null,
            //customerId: this.prevCustid,
            // firstName: this.prevfirstName,
            // secondName: this.prevsecondName,
            // surname: this.prevsurname,
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
        //if pipeline has changed and status has also changed, then need to mark status as dirty
        //to get the change in changelog
        if (
          this.previousPipeline != this.selectedServPipeline &&
          this.previousStage != form.value.servicesStage
        ) {
          this.userForm.get('servicesStage').markAsDirty();
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
        //update service
        if (
          form.value.servicesStage != this.forms.servicesStage &&
          newChangeLog != null
        ) {
          //for updating service with status change

          this.db.updateservice(
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
          form.value.servicesStage == this.forms.servicesStage &&
          newChangeLog != null
        ) {
          //for updating service without status change
          this.db.updateserviceNostatusChange(
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

        //checking whether service title is changed or not
        if (this.serviceTitle != this.forms.serviceTitle) {
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
                this.db.onUpdatePaymentserviceTitle(
                  this.superUserId,
                  paymentelement.id,
                  this.serviceTitle,
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
                this.db.onUpdateTaskserviceTitle(
                  this.superUserId,
                  taskelement.id,
                  this.serviceTitle,
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
            .getAllFollowups(this.superUserId, this.data.id)
            .subscribe((data) => {
              this.followups = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as FollowUps;
              });
              //changing field name for each task using task id
              this.followups.forEach((followupselement) => {
                this.db.onUpdateFollowupserviceTitle(
                  this.superUserId,
                  followupselement.id,
                  this.serviceTitle,
                  secondName ? firstName + ' ' + secondName : firstName,
                  companyName
                );
              });
              //setting followup data as updated
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
                this.db.onUpdateInvoiceserviceTitle(
                  this.superUserId,
                  invelement.id,
                  this.serviceTitle,
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
                this.db.onUpdateQuotationserviceTitle(
                  this.superUserId,
                  quoelement.id,
                  this.serviceTitle,
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
                this.db.onUpdateEstimateserviceTitle(
                  this.superUserId,
                  estelement.id,
                  this.serviceTitle,
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
          this.quotationSubscription = this.db
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
                this.db.onUpdateExpenseserviceTitle(
                  this.superUserId,
                  expelement.id,
                  this.serviceTitle,
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
              let message = 'Successfully Updated';
              this._snackBar.open(message, ' ', {
                duration: 2000,
              });
              //close popup
              if(form.value.servicesStage != this.forms.servicesStage){
                this.dialogRef.close('changed status');
              }else{
                this.dialogRef.close('not changed status');
              }
              this.loader = false;
            }
          }, 200);
        } else {
          //close popup
          this.loader = false;
          if(form.value.servicesStage != this.forms.servicesStage){
            this.dialogRef.close('changed status');
          }else{
            this.dialogRef.close('not changed status');
          }
          let message = 'Successfully Updated';
          this._snackBar.open(message, ' ', {
            duration: 2000,
          });
        }
      }
    }
  }


  checkDateValidation: ValidatorFn = (
    control: FormGroup
  ): ValidationErrors | null => {
    try {
      let startingDatefield = control.get('startDate').value;
      let endingDatefield = control.get('expCompletionDate').value;

      if (
        this.serviceSettings.startDate.display === true &&
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

  assignedToNameEventHander($event: any) {
    this.userData.assignedToName = $event;
  }

  branchIdEventHandler($event: any) {
    this.associatedBranch = $event;
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    //unsubscribing subscription
    this.authSubcription?.unsubscribe();
    this.userDetailsSubscription?.unsubscribe();
    this.quotationSubscription?.unsubscribe();
    this.invoiceSubscription?.unsubscribe();
    this.taskSubscription?.unsubscribe();
    this.followupSubscription?.unsubscribe();
    this.paymentSubscription?.unsubscribe();
    this.estimateSubscription?.unsubscribe();
    this.serviceUsersSubscription?.unsubscribe();
    this.additionalFields = [];
  }
}
