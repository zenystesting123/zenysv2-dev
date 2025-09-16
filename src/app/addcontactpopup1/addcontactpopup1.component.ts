/*********************************************************************************
Description: component used for adding/editing customers
Inputs: customer details while updating
Outputs:
***********************************************************************************/

import {
  FollowUps,
  PaymentReceipt,
  Sales,
  Task,
  Expenses,
  UserAccessDetails,
  customFields,
  SearchTerm,
  addFieldsArr,
  Service,
  contactSettings,
  defaultContactSettings,
  StageHistoryModel,
} from './../data-models';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Inject,
  HostListener,
  Optional,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Addcontactservices1Service } from './addcontactservices1.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Customer, Profile } from '../data-models';
import { take } from 'rxjs/operators';
import * as countrycode from 'country-json/src/country-by-calling-code.json';
import { NetworkCheckService } from '../networkcheck.service';
import { CommonService } from '../common.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import {
  FormArray,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { getCountryCodes } from 'src/app/countryCode';
import { ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeLogComponent } from '../change-log/change-log.component';
import { Pipelines } from '../model/pipeline.modal';

@Component({
  selector: 'app-addcontactpopup1',
  templateUrl: './addcontactpopup1.component.html',
  styleUrls: ['./addcontactpopup1.component.scss'],
})
export class Addcontactpopup1Component implements OnInit, OnDestroy {
  addContactForm: FormGroup;
  CountryCodes = getCountryCodes.CountryCodes; //country codes fetch from countrycodes.ts
  public defaultCode = ''; //storing default code value
  assignedTo: string; //to store assigned users user id
  assignedToName: string; //to store assigned users name
  plan: string; //to store subscription plan
  expenses: Expenses[]; //to store expenses for this customer
  companyName: string; //to store customers company name
  disableAddFoll: boolean = false; //to enable and disable fields according to userdetails
  custData: Customer = {
    taggedUsers: null,
    inPipeline: null,
    won: null,
    lost: null,
    orgId: null,
    associatedBranch: 'NA',
    unConfirmedSales: null,
    amountToBeCollected: null,
    taskOpen: null,
    lifeTimeValue: null,
    leadSource: null,
    custLeadValue: null,
    id: null,
    pan: null,
    createdBy: null,
    taxId: null,
    additionalFieldsArray: null,
    additionalFieldsArr: null,
    assignedTo: null,
    assignedToDate: null,
    assignedToName: null,
    billingaddress1: null,
    billingaddress2: null,
    bpin: null,
    companyName: null,
    code: null,
    altContactCode: null,
    collectedAmount: null,
    contactNo: null,
    country: null,
    createdDate: null,
    days: null,
    daysRange: null,
    district: null,
    email: null,
    firstName: null,
    dateCreated: null,
    followUpFlag: null,
    invoicedAmount: null,
    month: null,
    ongoingSales: null,
    priority: null,
    saleOngoingValue: null,
    salePipelineValue: null,
    secondName: null,
    state: null,
    status: null,
    totalAmountCollected: null,
    createdYear: null,
    isCompany: null,
    stageHistory: null,
    currentStatusDate: null,
    custLead: null,
    searchTerm: null,
    sequenceNumber: null,
    salutation: null,
    surname: null,
    alternateContactNumber: null,
    department: null,
    selectedContactPipeline: 0,
    changeLog: null,
    lastAddedNote: '',
    lastNoteDate: null,
    lastNoteId: '',
    rejectionReasonValue: '',
    nextFollowupDate: '',
    lastModifiedDate: null,
  }; //data type to store customer details
  formDetails: any;
  form: any; //to store cntact details while updating
  customerNames: string; //to store customers name
  @Input() id: any; //to store customers id by route
  @Input() scenario: any; //to store mode through route
  subscription: Subscription; //to subscribe users data
  customerNewId: string; //to store newly created customers id
  submitted: boolean = false; //to check user is submitted once or not
  month: any; //to store current month
  createdYear: any;
  fieldsetDisabled: boolean; //to disable the fields in view mode
  subUsers: any[]; //to store subusers array
  titleName: string; //to store title of the mode
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
  countrycode: any = (countrycode as any).default; //to store country code as default
  additionalFields = [this.additionalFieldModel]; //to store addditonal fields array
  addFieldsArray = [this.addFieldArrModel]; //to store additional fields in customer
  fname: any = null; //to store first name of user
  secondname: any = null; //to store second name of user
  superFirstName: any = null; //to store first name of super
  superSecondName: any = null; //to store second name of super
  dataAccessRule: any; //for storing data acess rule of user
  superUserId: any; //to store super user id
  userRole: any; //to store users role
  accountType: any; //to store users account type
  userId: string; //to store users id
  stageHistory: any[] = []; //to store stage history of customer
  stageValues: StageHistoryModel = {
    //to store stage values as data type
    date: null,
    stageId: null,
    pipelineId: null,
  };
  //additionalFieldLength: number; //to store additional field length
  loader: boolean = false; //to show updating data
  inputData: any; //for storing data from user level
  stageHistories: any[]; //to store current stage history
  saleSubscription: Subscription; //subscription of sale list
  serviceSubscription: Subscription; //subscription of service list
  followUpSubscription: Subscription; //subscription of follow up list
  taskSubscription: Subscription; //subscription of task list
  paymentSubscription: Subscription; //subscription of payment recipt list
  expenseSubscription: Subscription; //subscription of expense list
  sales: Sales[] = []; //store sales list
  services: Service[] = []; //store services list
  followUps: FollowUps[] = []; //to store followup list
  tasks: Task[] = []; //to store task list
  payments: PaymentReceipt[] = []; //to store payment list
  saleUpdated: boolean = false; //to check sales data updated in db
  serviceUpdated: boolean = false; //to check service data updated in db
  followupUpdated: boolean = false; //to check followup data updated in db
  taskUpdated: boolean = false; //to check task data updated in db
  expenseUpdated: boolean = false; //to check expense data updated in db
  paymentUpdated: boolean = false; //to check payment data updated in db
  disableButton: boolean = false;
  customerFirstName: string; //to store customers first name for search
  leadSourceArray: any = []; //to store lead source array
  rejectionReasonArr: string[] = []; //rejection reason options saved as an array
  rejectionReasonArrPresent = true; //if reason for rerejection array is present/not
  customerSecondName: string; //to store customers second name
  customerSurname: string; //to store customers surname
  networkConnection: boolean; //to check wheter internet connectivity is presesnt
  userDetailsSubscription: Subscription; //for subscribing to user details
  statusArray: any = []; //to store status of customer
  userCode: any; //to store default phone code
  userProfileData: UserAccessDetails;
  usrProfileData: UserAccessDetails;
  disableEditContact: boolean = false; //to check wheter field is disabled
  disableReAssign = false; //disable assign to
  superUserDetails: Profile; //to store super users details
  fieldNameContact: string = 'Contact'; //to store edited field name defaulted as contact
  contactSequenceNumber: number; // for updating sequence number in user
  customerPipelines: Pipelines[] = [];
  duplicateEmailDisable: boolean = false; // email duplicate disable
  duplicateContactNumberDisable: boolean = false; // contact number duplicate disable
  selectedContactPipeline: number = 0; //index of selected contact pipeline name
  isMobilesize = false;
  inPipeline = false;
  won = false;
  lost = false;
  oldEmail: string;
  oldContactNumber: string;
  oldAltContactNumber: string;
  allSubUsers: any[] = [];
  showAddress: boolean = false;
  myControl = new FormControl(); // form controller
  filteredOptions: any;
  submitDisable: boolean = false;
  //customisation field
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  settingsConfigured: boolean = false;
  changeLog: any;
  previousForm: FormGroup;
  userName: string;
  associatedBranch = '';
  prevAssBranch = '';
  branches = [];
  orgId = '';
  orgName = 'Individual';
  inpModule = 'Contact';
  prevOrgId = '';
  prevOrgName = '';
  orgSelected = false;
  prevAltContactCode: string;
  daTime: any;
  formReset: boolean = true;
  activeFieldsLength: number = 0; //get no of active additional fields
  //store the previous value of pipeline to use in changeLog
  previousPipeline: number;
  //store the previous value of status to use in changeLog
  previousStatus: string;
  previousAssignedTo: string;
  previousAssignedToName: string;
  // noSpacePattern = /^[^\s]+$/; // regular expression that disallows spaces
  oldAssignedTo: string; // old assigne
  assignedToDate: number = null; // old assigned to date
  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
  constructor(
    private analytics: AngularFireAnalytics,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() public dialogRef: MatDialogRef<Addcontactpopup1Component>,
    private _snackBar: MatSnackBar,
    private db: Addcontactservices1Service,
    private router: Router,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private fb: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private loc: Location,
    private route: ActivatedRoute
  ) {
    //getting user details form
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          this.isMobilesize = allData.isMobileSize; // get screen size
          //to get super user details form common service file
          this.superUserDetails = allData.superUserDetails;

          if (this.superUserDetails.fieldNames) {
            //getting custom field name
            this.fieldNameContact =
              this.superUserDetails.fieldNames.fieldNameContact;
          }
          if (data) {
            //if data is passed through popup
            this.scenario = data.scenario;
            this.id = this.data.id;
            this.superUserDetails = this.superUserDetails;
            // this.contactSettings = data.contactSettings;
          } else {
            route.params.subscribe((val) => {
              this.scenario = this.route.snapshot.paramMap.get('scn');
              this.id = this.route.snapshot.paramMap.get('id');
            });
          }
          //for storing

          this.userId = allData.userId;
          //Check screen size form common service file
          this.superUserId = allData.userDetails.superUserId;
          //getting additional field
          this.userName = allData.userDetails.lastname
            ? allData.userDetails.firstname + ' ' + allData.userDetails.lastname
            : allData.userDetails.firstname;

          this.accountType = allData.superUserDetails.accountType;
          this.plan = allData.superUserDetails.plan;
          //getting status of customer
          //if there is multiple pipeline access, show all five pipelines else show single pipeline
          this.customerPipelines = JSON.parse(JSON.stringify(allData.customerPipelines));
          if (this.commonService.userPlan.multiPipelineAccess) {
            // do nothing
          } else {
            this.customerPipelines.length = 1;
          }
          this.selectedContactPipeline = this.customerPipelines[0].pipelineId;
          if(this.formReset){
          this.pipelineChangedEvent(this.selectedContactPipeline);
          }
          //checking duplicate email
          if (allData.superUserDetails.duplicateEmailDisable) {
            this.duplicateEmailDisable =
              allData.superUserDetails.duplicateEmailDisable;
          }
          if (allData.superUserDetails.duplicateContactNumberDisable) {
            this.duplicateContactNumberDisable =
              allData.superUserDetails.duplicateContactNumberDisable;
          }

          this.custData.status = this.statusArray[0].stageId;
          this.userCode = allData.superUserDetails.countryCode;
          //getting lead source array
          this.leadSourceArray = allData.superUserDetails.custLead;
          // assign reason rejection array to local variable
          if (
            allData.superUserDetails?.contactSettings?.rejectionReason
              ?.rejectionReason
          ) {
            this.rejectionReasonArr =
              allData.superUserDetails?.contactSettings?.rejectionReason?.rejectionReason?.split(
                ','
              );
              this.rejectionReasonArrPresent = true;
          } else {
            this.rejectionReasonArr[0] = 'No options are available';
            this.rejectionReasonArrPresent = false;
          }

          //getting users name
          this.fname = allData.superUserDetails.firstname;
          this.secondname = allData.superUserDetails.lastname
            ? allData.superUserDetails.lastname
            : '';
          this.superFirstName = allData.userDetails.firstname;
          this.superSecondName = allData.userDetails.lastname
            ? allData.userDetails.lastname
            : '';

          this.userRole = this.superUserDetails.userRole;

          //getting sub users details
          this.subUsers = allData.subUsers;
          this.dataAccessRule = allData.usrProfileData.dialogdataAccessRule; // for access rule check
          this.allSubUsers = this.commonService.createUserlist('All', 'any')[1];
          this.branches = allData.branches;

          this.fieldsetDisabled = false;

          //defaulting userCode to india if not saved
          if (!this.userCode) {
            this.userCode = '+91';
          }
          //customisation field
          if (
            typeof allData.superUserDetails.contactSettings === 'undefined' ||
            allData.superUserDetails.contactSettings === null
          ) {
            // this.settingsConfigured = false;
            this.contactSettings = this.contactSettings;
          } else {
            // this.settingsConfigured = true;
            this.contactSettings = allData.superUserDetails.contactSettings;
          }
          //if mode is edit in form
          if (this.scenario == 'edit' && this.formReset) {
            this.formReset = false;
            //reassigning field disable
            if (
              allData.usrProfileData.isCheckedCont === false ||
              allData.usrProfileData.contactReAssign === false
            ) {
              this.disableReAssign = true;
            }

            this.additionalFields =
              allData.superUserDetails.customFieldsContact;
            //find the no of active additionals fields
            this.additionalFields?.forEach((field) => {
              if (field.isActive) {
                this.activeFieldsLength = this.activeFieldsLength + 1;
              }
            });
            //getting values for editing from common service filw
            let customerDetails = this.commonService.getCustomerToEdit();
            this.orgId = customerDetails.orgId ? customerDetails.orgId : '';
            if (customerDetails.orgId) {
              this.orgSelected = true;
            } else {
              this.orgSelected = false;
            }
            this.orgName = customerDetails.companyName
              ? customerDetails.companyName
              : '';
            this.prevOrgId = customerDetails.orgId
              ? customerDetails.orgId
              : null;
            this.prevOrgName = customerDetails.companyName
              ? customerDetails.companyName
              : '';
            this.custData.assignedTo = customerDetails.assignedTo;
            this.previousAssignedTo = customerDetails.assignedTo;
            this.associatedBranch = customerDetails.associatedBranch
              ? customerDetails.associatedBranch
              : '';
            this.prevAssBranch = customerDetails.associatedBranch
              ? customerDetails.associatedBranch
              : '';
            this.inputData = customerDetails;

            // Reactive approach using patchValue
            // this.addContactForm.patchValue(customerDetails);
            //assigning values to all fields
            this.form = customerDetails;

            this.prevAltContactCode = customerDetails.altContactCode
              ? customerDetails.altContactCode
              : '';

            this.custData.billingaddress1 = customerDetails.billingaddress1;
            this.custData.billingaddress2 = customerDetails.billingaddress2;
            this.custData.bpin = customerDetails.bpin;
            this.custData.code = customerDetails.code;
            this.custData.code = customerDetails.code;
            this.changeLog = customerDetails.changeLog;
            // this.custData.altContactCode = (data.alternateContactNumber?data.altContactCode?data.altContactCode:this.userCode:'')
            this.custData.altContactCode = customerDetails.altContactCode
              ? customerDetails.altContactCode
              : '';
            // this.custData.altContactCode = customerDetails.altContactCode?customerDetails.code:this.userCode;

            this.custData.collectedAmount = customerDetails.collectedAmount;
            this.custData.contactNo = customerDetails.contactNo;
            this.oldContactNumber = customerDetails.contactNo;
            this.oldAltContactNumber = customerDetails.alternateContactNumber;
            this.custData.country = customerDetails.country;
            this.custData.companyName = customerDetails.companyName;
            this.custData.createdDate = customerDetails.createdDate;
            this.custData.district = customerDetails.district;
            this.custData.email = customerDetails.email;
            this.oldEmail = customerDetails.email;
            this.custData.firstName = customerDetails.firstName;
            this.custData.taxId = customerDetails.taxId;
            this.custData.invoicedAmount = customerDetails.invoicedAmount;
            this.custData.month = customerDetails.month;
            this.custData.ongoingSales = customerDetails.ongoingSales;
            this.custData.pan = customerDetails.pan;
            this.custData.priority = customerDetails.priority;
            this.custData.saleOngoingValue = customerDetails.saleOngoingValue;
            this.custData.salePipelineValue = customerDetails.salePipelineValue;
            this.custData.secondName = customerDetails.secondName;
            this.custData.state = customerDetails.state;
            this.custData.totalAmountCollected =
              customerDetails.totalAmountCollected;
            this.custData.createdYear = customerDetails.createdYear;
            this.custData.isCompany = customerDetails.isCompany;
            this.custData.custLeadValue = customerDetails.custLeadValue;
            this.custData.custLead = customerDetails.custLead;
            this.custData.assignedToName = this.commonService.getAssignedToName(
              customerDetails.assignedTo
            );
            this.previousAssignedToName = this.custData.assignedToName;
            this.addFieldsArray = customerDetails.additionalFieldsArr;
            this.custData.salutation = customerDetails.salutation
              ? customerDetails.salutation
              : '';
            this.custData.surname = customerDetails.surname
              ? customerDetails.surname
              : '';
            this.custData.alternateContactNumber =
              customerDetails.alternateContactNumber
                ? customerDetails.alternateContactNumber
                : '';
            this.custData.department = customerDetails.department
              ? customerDetails.department
              : '';

            this.selectedContactPipeline =
              customerDetails.selectedContactPipeline;
            this.pipelineChangedEvent(this.selectedContactPipeline);
            //store previous pipeline
            this.previousPipeline = customerDetails.selectedContactPipeline;
            //store previous status
            this.previousStatus = customerDetails.status;
            this.custData.status = customerDetails.status;
            this.custData.rejectionReasonValue =
              customerDetails.rejectionReasonValue
                ? customerDetails.rejectionReasonValue
                : '';
            if (customerDetails.additionalFieldsArr) {
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
            // get old assignee
            if (customerDetails.assignedTo) {
              this.oldAssignedTo = customerDetails.assignedTo;
            }
            // get old assigned to date
            if (customerDetails.assignedToDate) {
              this.assignedToDate = customerDetails.assignedToDate;
            }
            //getting customers details using customer id
            if (!customerDetails) {
              this.custData = this.db.getValuesCustData();
              this.db
                .getCustomer(this.id, this.superUserId)
                .subscribe((data) => {
                  this.custData.assignedTo = data.assignedTo;
                  this.previousAssignedTo = this.custData.assignedTo;
                  this.associatedBranch = data.associatedBranch
                    ? data.associatedBranch
                    : '';
                  this.prevAssBranch = data.associatedBranch
                    ? data.associatedBranch
                    : '';
                  this.inputData = data;
                  this.custData.billingaddress1 = data.billingaddress1;
                  this.custData.billingaddress2 = data.billingaddress2;
                  this.custData.bpin = data.bpin;
                  this.custData.code = data.code;
                  this.custData.altContactCode = data.altContactCode;
                  // this.custData.altContactCode = (data.alternateContactNumber?data.altContactCode?data.code:this.userCode:data.altContactCode)
                  // this.custData.altContactCode = data.altContactCode;
                  this.custData.collectedAmount = data.collectedAmount;
                  this.custData.contactNo = data.contactNo;
                  this.oldContactNumber = data.contactNo;
                  this.oldAltContactNumber = data.alternateContactNumber;
                  this.custData.country = data.country;
                  this.custData.companyName = data.companyName;
                  this.prevOrgName = data.companyName ? data.companyName : null;
                  this.custData.createdDate = data.createdDate;
                  this.custData.district = data.district;
                  this.custData.email = data.email;
                  this.oldEmail = data.email;
                  this.custData.firstName = data.firstName;
                  this.custData.taxId = data.taxId;
                  this.custData.invoicedAmount = data.invoicedAmount;
                  this.custData.month = data.month;
                  this.custData.ongoingSales = data.ongoingSales;
                  this.custData.pan = data.pan;
                  this.custData.priority = data.priority;
                  this.custData.saleOngoingValue = data.saleOngoingValue;
                  this.custData.salePipelineValue = data.salePipelineValue;
                  this.custData.secondName = data.secondName;
                  this.custData.state = data.state;
                  this.custData.totalAmountCollected =
                    data.totalAmountCollected;
                  this.custData.createdYear = data.createdYear;
                  this.custData.isCompany = data.isCompany;
                  this.custData.custLeadValue = data?.custLeadValue;
                  this.custData.custLead = data?.custLead;
                  this.custData.assignedToName =
                    this.commonService.getAssignedToName(data.assignedTo);
                  this.previousAssignedToName = this.custData.assignedToName;
                  this.changeLog = data.changeLog;
                  this.custData.salutation = data.salutation
                    ? data.salutation
                    : '';
                  this.custData.surname = data.surname ? data.surname : '';
                  this.custData.alternateContactNumber =
                    data.alternateContactNumber
                      ? data.alternateContactNumber
                      : '';
                  this.custData.department = data.department
                    ? data.department
                    : '';

                  this.selectedContactPipeline = data.selectedContactPipeline;
                  this.pipelineChangedEvent(this.selectedContactPipeline);
                  this.custData.status = data.status;
                  this.custData.rejectionReasonValue =
                    data.rejectionReasonValue;
                  //store previous pipeline
                  this.previousPipeline = data.selectedContactPipeline;
                  //store previous status
                  this.previousStatus = data.status;
                  //getting additional fields array
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
                  // get old assignee
                  if (data.assignedTo) {
                    this.oldAssignedTo = data.assignedTo;
                  }
                  // get old assigned to date
                  if (data.assignedToDate) {
                    this.assignedToDate = data.assignedToDate;
                  }
                });
            }
            this.titleName = 'Update';

            if (!!this.custData.status) {
              this.addContactForm = this.fb.group({
                firstName: [
                  this.custData.firstName,
                  [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(60),
                    // Validators.pattern(this.noSpacePattern)
                  ],
                ],
                companyName: [
                  this.custData.companyName,
                  [Validators.minLength(2), Validators.maxLength(60)],
                ],
                secondName: [
                  this.custData.secondName,
                  Validators.maxLength(60),
                ],
                // code: [this.custData.code, Validators.required],
                contactNo: [this.custData.contactNo],
                email: [this.custData.email],
                priority: [this.custData.priority],
                selectedContactPipeline: [this.selectedContactPipeline],
                status: [this.custData.status, Validators.required],
                rejectionReasonVal: [this.custData.rejectionReasonValue],
                // assignedTo: [this.custData.assignedTo],
                custLeadValue: [this.custData.custLeadValue],
                billingaddress1: [
                  this.custData.billingaddress1,
                  [Validators.minLength(3), Validators.maxLength(100)],
                ],
                billingaddress2: [
                  this.custData.billingaddress2,
                  [Validators.minLength(3), Validators.maxLength(100)],
                ],
                district: [
                  this.custData.district,
                  [Validators.minLength(3), Validators.maxLength(50)],
                ],
                state: [
                  this.custData.state,
                  [Validators.minLength(3), Validators.maxLength(50)],
                ],
                bpin: [
                  this.custData.bpin,
                  [Validators.minLength(4), Validators.maxLength(12)],
                ],
                country: [this.custData.country, [Validators.minLength(2)]],
                taxId: [this.custData.taxId],
                salutation: [this.custData.salutation],
                surname: [this.custData.surname, Validators.maxLength(50)],
                department: [this.custData.department],
                // altContactCode: [this.custData.altContactCode, Validators.required],
                alternateContactNumber: [this.custData.alternateContactNumber],
                additionalFields: this.fb.array([]),
              });

              if (this.orgId) {
                this.addContactForm.controls.companyName.disable();
              }
              //additional fields
              this.additionalFields?.forEach((field) => {
                if (field.mandatory == true) {
                  if (field.fieldType == 'date') {
                    (
                      this.addContactForm.get('additionalFields') as FormArray
                    ).push(
                      this.fb.group({
                        fieldValue: [
                          !!field.value ? field.value.toDate() : '',
                          Validators.required,
                        ],
                        fieldName: field.fieldName,
                      })
                    );
                  } else if (field.fieldType == 'date_time') {
                    (
                      this.addContactForm.get('additionalFields') as FormArray
                    ).push(
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
                    (
                      this.addContactForm.get('additionalFields') as FormArray
                    ).push(
                      this.fb.group({
                        fieldValue: [field.value, Validators.required],
                        fieldName: field.fieldName,
                      })
                    );
                  }
                } else {
                  if (field.fieldType == 'date') {
                    (
                      this.addContactForm.get('additionalFields') as FormArray
                    ).push(
                      this.fb.group({
                        fieldValue: !!field.value ? field.value.toDate() : '',
                        fieldName: field.fieldName,
                      })
                    );
                  } else if (field.fieldType == 'date_time') {
                    (
                      this.addContactForm.get('additionalFields') as FormArray
                    ).push(
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
                    (
                      this.addContactForm.get('additionalFields') as FormArray
                    ).push(
                      this.fb.group({
                        fieldValue: field.value,
                        fieldName: field.fieldName,
                      })
                    );
                  }
                }
              });
              //customisable field in edit scenario starts here
              if (this.contactSettings) {
                //secondName
                if (this.contactSettings?.secondName?.mandatory === true) {
                  this.addContactForm.controls['secondName'].setValidators([
                    Validators.required,
                  ]);
                } else {
                  this.addContactForm.controls['secondName'].setValidators(
                    null
                  );
                }

                if (
                  this.contactSettings?.secondName?.display === true &&
                  this.contactSettings?.secondName?.mandatory === true
                ) {
                  this.addContactForm.controls['secondName'].setValidators([
                    ...(this.addContactForm.controls['secondName'].validator
                      ? [this.addContactForm.controls['secondName'].validator]
                      : []),
                    Validators.maxLength(50),
                  ]);
                } else if (this.contactSettings?.secondName?.display === true) {
                  this.addContactForm.controls['secondName'].setValidators([
                    Validators.maxLength(50),
                  ]);
                }

                this.addContactForm.controls[
                  'secondName'
                ].updateValueAndValidity();

                //contactNo
                if (this.contactSettings?.contactNo?.mandatory === true) {
                  this.addContactForm.controls['contactNo'].setValidators([
                    Validators.required,
                  ]);
                } else {
                  this.addContactForm.controls['contactNo'].clearValidators();
                }
                this.addContactForm.controls[
                  'contactNo'
                ].updateValueAndValidity();
                //email
                if (this.contactSettings?.email?.mandatory === true) {
                  this.addContactForm.controls['email'].setValidators([
                    Validators.required,
                  ]);
                } else {
                  this.addContactForm.controls['email'].clearValidators();
                }
                this.addContactForm.controls['email'].updateValueAndValidity();
                //
                //priority
                if (this.contactSettings?.priority?.mandatory === true) {
                  this.addContactForm.controls['priority'].setValidators([
                    Validators.required,
                  ]);
                } else {
                  this.addContactForm.controls['priority'].clearValidators();
                }
                this.addContactForm.controls[
                  'priority'
                ].updateValueAndValidity();
                //pipeline
                if (
                  this.contactSettings?.selectedContactPipeline?.mandatory ===
                  true
                ) {
                  this.addContactForm.controls[
                    'selectedContactPipeline'
                  ].setValidators([Validators.required]);
                } else {
                  this.addContactForm.controls[
                    'selectedContactPipeline'
                  ].clearValidators();
                }
                this.addContactForm.controls[
                  'selectedContactPipeline'
                ].updateValueAndValidity();
                //custLeadValue/leadSource
                if (this.contactSettings?.custLeadValue?.mandatory === true) {
                  this.addContactForm.controls['custLeadValue'].setValidators([
                    Validators.required,
                  ]);
                } else {
                  this.addContactForm.controls[
                    'custLeadValue'
                  ].clearValidators();
                }
                this.addContactForm.controls[
                  'custLeadValue'
                ].updateValueAndValidity();
                //billingaddress1
                if (this.contactSettings?.billingaddress1?.mandatory === true) {
                  this.addContactForm.controls['billingaddress1'].setValidators(
                    [Validators.required]
                  );
                } else {
                  this.addContactForm.controls[
                    'billingaddress1'
                  ].clearValidators();
                }
                this.addContactForm.controls[
                  'billingaddress1'
                ].updateValueAndValidity();
                //billingaddress2
                if (this.contactSettings?.billingaddress2?.mandatory === true) {
                  this.addContactForm.controls['billingaddress2'].setValidators(
                    [Validators.required]
                  );
                } else {
                  this.addContactForm.controls[
                    'billingaddress2'
                  ].clearValidators();
                }
                this.addContactForm.controls[
                  'billingaddress2'
                ].updateValueAndValidity();
                //district
                if (this.contactSettings?.district?.mandatory === true) {
                  this.addContactForm.controls['district'].setValidators([
                    Validators.required,
                  ]);
                } else {
                  this.addContactForm.controls['district'].clearValidators();
                }
                this.addContactForm.controls[
                  'district'
                ].updateValueAndValidity();
                //state
                if (this.contactSettings?.state?.mandatory === true) {
                  this.addContactForm.controls['state'].setValidators([
                    Validators.required,
                  ]);
                } else {
                  this.addContactForm.controls['state'].clearValidators();
                }
                this.addContactForm.controls['state'].updateValueAndValidity();
                //bpin/pinorzip
                if (this.contactSettings?.bpin?.mandatory === true) {
                  this.addContactForm.controls['bpin'].setValidators([
                    Validators.required,
                  ]);
                } else {
                  this.addContactForm.controls['bpin'].clearValidators();
                }
                this.addContactForm.controls['bpin'].updateValueAndValidity();
                //country
                if (this.contactSettings?.country?.mandatory === true) {
                  this.addContactForm.controls['country'].setValidators([
                    Validators.required,
                  ]);
                } else {
                  this.addContactForm.controls['country'].clearValidators();
                }
                this.addContactForm.controls[
                  'country'
                ].updateValueAndValidity();
                //taxId
                if (this.contactSettings?.taxId?.mandatory === true) {
                  this.addContactForm.controls['taxId'].setValidators([
                    Validators.required,
                  ]);
                } else {
                  this.addContactForm.controls['taxId'].clearValidators();
                }
                this.addContactForm.controls['taxId'].updateValueAndValidity();
                //salutation
                if (this.contactSettings?.salutation?.mandatory === true) {
                  this.addContactForm.controls['salutation'].setValidators([
                    Validators.required,
                  ]);
                } else {
                  this.addContactForm.controls['salutation'].clearValidators();
                }
                this.addContactForm.controls[
                  'salutation'
                ].updateValueAndValidity();
                //surname
                if (this.contactSettings?.surname?.mandatory === true) {
                  this.addContactForm.controls['surname'].setValidators([
                    Validators.required,
                  ]);
                } else {
                  this.addContactForm.controls['surname'].setValidators(null);
                }

                if (
                  this.contactSettings?.surname?.display === true &&
                  this.contactSettings?.surname?.mandatory === true
                ) {
                  this.addContactForm.controls['surname'].setValidators([
                    ...(this.addContactForm.controls['surname'].validator
                      ? [this.addContactForm.controls['surname'].validator]
                      : []),
                    Validators.maxLength(50),
                  ]);
                } else if (this.contactSettings?.surname?.display === true) {
                  this.addContactForm.controls['surname'].setValidators([
                    Validators.maxLength(50),
                  ]);
                }

                this.addContactForm.controls[
                  'surname'
                ].updateValueAndValidity();

                //department
                if (this.contactSettings?.department?.mandatory === true) {
                  this.addContactForm.controls['department'].setValidators([
                    Validators.required,
                  ]);
                } else {
                  this.addContactForm.controls['department'].clearValidators();
                }
                this.addContactForm.controls[
                  'surname'
                ].updateValueAndValidity();
                //alternateContactNumber
                if (
                  this.contactSettings?.alternateContactNumber?.mandatory ===
                  true
                ) {
                  this.addContactForm.controls[
                    'alternateContactNumber'
                  ].setValidators([Validators.required]);
                } else {
                  this.addContactForm.controls[
                    'alternateContactNumber'
                  ].clearValidators();
                }
                this.addContactForm.controls[
                  'alternateContactNumber'
                ].updateValueAndValidity();
                //
              }
              //customisable fields end here
            }
          }

          // if getting value of created form inquiry list
          else if (this.data?.mode == 'create' && this.formReset) {
            this.formReset = false;
            this.additionalFields =
              allData.superUserDetails.customFieldsContact;
            //find the no of active additionals fields
            this.additionalFields?.forEach((field) => {
              if (field.isActive) {
                this.activeFieldsLength = this.activeFieldsLength + 1;
              }
            });
            this.custData = this.db.getValuesCustData();
            //binding data got form inquiry list like phone,email,name
            this.custData.assignedTo = this.userId; //set user id as default assigned to
            if (this.custData.assignedTo) {
              for (let i = 0; i < this.allSubUsers.length; i++) {
                if (this.custData.assignedTo === this.allSubUsers[i].userId) {
                  if (this.allSubUsers[i].branchId) {
                    this.associatedBranch = this.allSubUsers[i].branchId;
                  } else {
                    this.associatedBranch = 'NA';
                  }
                }
              }
            }
            this.custData.contactNo = this.data.Phone;
            this.custData.email = this.data.Email;
            this.custData.firstName = this.data.Name;
            // this.defaultCode = this.userCode; //Default the value for country code
            this.custData.code = this.userCode;
            this.custData.altContactCode = this.userCode;

            this.custData.priority = 'Medium'; //Default the value for priority
            this.custData.isCompany = true; //Default to company
            this.selectedContactPipeline = this.customerPipelines[0].pipelineId;
            this.pipelineChangedEvent(this.selectedContactPipeline);
            this.custData.status = this.statusArray[0].stageId; //defaulting status as first one
            this.custData.assignedToName = this.fname + ' ' + this.secondname; //setting assigned to name as users
            this.titleName = 'Add '; //giving popup title as create

            this.addContactForm = this.fb.group({
              firstName: [
                this.custData.firstName,
                [
                  Validators.required,
                  Validators.minLength(3),
                  Validators.maxLength(60),
                  // Validators.pattern(this.noSpacePattern)
                ],
              ],
              secondName: [this.custData.secondName, Validators.maxLength(60)],
              // code: [this.userCode, Validators.required],
              contactNo: [this.custData.contactNo],
              email: [this.custData.email, Validators.email],
              priority: [this.custData.priority],
              selectedContactPipeline: [this.selectedContactPipeline],
              status: [this.custData.status, Validators.required],
              rejectionReasonVal: [this.custData.rejectionReasonValue],
              // assignedTo: [this.custData.assignedTo],
              custLeadValue: [this.custData.custLeadValue],
              billingaddress1: [
                this.custData.billingaddress1,
                [Validators.minLength(3), Validators.maxLength(100)],
              ],
              billingaddress2: [
                this.custData.billingaddress2,
                [Validators.minLength(3), Validators.maxLength(100)],
              ],
              district: [
                this.custData.district,
                [Validators.minLength(3), Validators.maxLength(50)],
              ],
              state: [
                this.custData.state,
                [Validators.minLength(3), Validators.maxLength(50)],
              ],
              bpin: [
                this.custData.bpin,
                [Validators.minLength(4), Validators.maxLength(12)],
              ],
              country: [this.custData.country, [Validators.minLength(2)]],
              taxId: [this.custData.taxId],
              salutation: [this.custData.salutation],
              surname: [this.custData.surname, Validators.maxLength(50)],
              department: [this.custData.department],
              // altContactCode: [this.userCode, Validators.required],
              alternateContactNumber: [this.custData.alternateContactNumber],
              additionalFields: this.fb.array([]),
            });

            this.additionalFields?.forEach((field) => {
              if (field.mandatory == true) {
                if (field.fieldType == 'date') {
                  (
                    this.addContactForm.get('additionalFields') as FormArray
                  ).push(
                    this.fb.group({
                      fieldValue: [
                        !!field.defaultValue ? field.defaultValue.toDate() : '',
                        Validators.required,
                      ],
                      fieldName: field.fieldName,
                    })
                  );
                } else if (field.fieldType == 'date_time') {
                  (
                    this.addContactForm.get('additionalFields') as FormArray
                  ).push(
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
                  (
                    this.addContactForm.get('additionalFields') as FormArray
                  ).push(
                    this.fb.group({
                      fieldValue: [field.defaultValue, Validators.required],
                      fieldName: field.fieldName,
                    })
                  );
                }
              } else {
                if (field.fieldType == 'date') {
                  (
                    this.addContactForm.get('additionalFields') as FormArray
                  ).push(
                    this.fb.group({
                      fieldValue: !!field.defaultValue
                        ? field.defaultValue.toDate()
                        : '',
                      fieldName: field.fieldName,
                    })
                  );
                } else if (field.fieldType == 'date_time') {
                  (
                    this.addContactForm.get('additionalFields') as FormArray
                  ).push(
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
                  (
                    this.addContactForm.get('additionalFields') as FormArray
                  ).push(
                    this.fb.group({
                      fieldValue: field.defaultValue,
                      fieldName: field.fieldName,
                    })
                  );
                }
              }
            });
          } else if (this.scenario == 'create' && this.formReset) {
            this.formReset = false;
            this.additionalFields =
              allData.superUserDetails.customFieldsContact;
            //find the no of active additionals fields
            this.additionalFields?.forEach((field) => {
              if (field.isActive) {
                this.activeFieldsLength = this.activeFieldsLength + 1;
              }
            });
            if (this.data && this.data.orgId) {
              this.orgId = this.data.orgId;
              this.orgSelected = true;
              this.orgName = this.data.orgName;
            }

            this.fieldsetDisabled = false;
            this.custData.contactNo = this.data?.Phone;
            this.custData.priority = 'Medium'; //Default the value for priority
            this.selectedContactPipeline = this.customerPipelines[0].pipelineId;
            this.pipelineChangedEvent(this.selectedContactPipeline);
            this.custData.status = this.statusArray[0].stageId; //defaulting status as first one
            this.custData.assignedTo = this.userId; //set user id as default assigned to
            if (this.custData.assignedTo) {
              for (let i = 0; i < this.allSubUsers.length; i++) {
                if (this.custData.assignedTo === this.allSubUsers[i].userId) {
                  if (this.allSubUsers[i].branchId) {
                    this.associatedBranch = this.allSubUsers[i].branchId;
                  } else {
                    this.associatedBranch = 'NA';
                  }
                }
              }
            }

            this.custData.code = this.userCode;
            this.custData.altContactCode = this.userCode;
            //customer type based on general seeting

            this.custData.assignedToName =
              this.superFirstName + ' ' + this.superSecondName; //setting assigned to name as users
            this.titleName = 'Add '; //giving popup title as create

            this.addContactForm = this.fb.group({
              companyName: [this.orgName],
              firstName: [
                this.custData.firstName,
                [
                  Validators.required,
                  Validators.minLength(3),
                  Validators.maxLength(60),
                  // Validators.pattern(this.noSpacePattern)
                ],
              ],
              secondName: [this.custData.secondName, Validators.maxLength(60)],
              // code: [this.userCode, Validators.required],
              contactNo: [this.custData.contactNo],
              email: [this.custData.email],
              priority: [this.custData.priority],
              selectedContactPipeline: [this.selectedContactPipeline],
              status: [this.custData.status, Validators.required],
              rejectionReasonVal: [this.custData.rejectionReasonValue],
              // assignedTo: [this.custData.assignedTo],
              custLeadValue: [this.custData.custLeadValue],
              billingaddress1: [
                this.custData.billingaddress1,
                [Validators.minLength(3), Validators.maxLength(100)],
              ],
              billingaddress2: [
                this.custData.billingaddress2,
                [Validators.minLength(3), Validators.maxLength(100)],
              ],
              district: [
                this.custData.district,
                [Validators.minLength(3), Validators.maxLength(50)],
              ],
              state: [
                this.custData.state,
                [Validators.minLength(3), Validators.maxLength(50)],
              ],
              bpin: [
                this.custData.bpin,
                [Validators.minLength(4), Validators.maxLength(12)],
              ],
              country: [this.custData.country, [Validators.minLength(2)]],
              taxId: [this.custData.taxId],
              salutation: [this.custData.salutation],
              surname: [this.custData.surname, Validators.maxLength(50)],
              department: [this.custData.department],
              // altContactCode: [this.userCode, Validators.required],
              alternateContactNumber: [this.custData.alternateContactNumber],
              additionalFields: this.fb.array([]),
            });

            //customisable field validations
            if (this.contactSettings) {
              //secondName
              if (this.contactSettings?.secondName?.mandatory === true) {
                this.addContactForm.controls['secondName'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.addContactForm.controls['secondName'].setValidators(null);
              }

              if (
                this.contactSettings?.secondName?.display === true &&
                this.contactSettings?.secondName?.mandatory === true
              ) {
                this.addContactForm.controls['secondName'].setValidators([
                  ...(this.addContactForm.controls['secondName'].validator
                    ? [this.addContactForm.controls['secondName'].validator]
                    : []),
                  Validators.maxLength(50),
                ]);
              } else if (this.contactSettings?.secondName?.display === true) {
                this.addContactForm.controls['secondName'].setValidators([
                  Validators.maxLength(50),
                ]);
              }

              this.addContactForm.controls[
                'secondName'
              ].updateValueAndValidity();

              //contactNo
              if (this.contactSettings?.contactNo?.mandatory === true) {
                this.addContactForm.controls['contactNo'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.addContactForm.controls['contactNo'].clearValidators();
              }
              this.addContactForm.controls[
                'contactNo'
              ].updateValueAndValidity();
              //email
              if (this.contactSettings?.email?.mandatory === true) {
                this.addContactForm.controls['email'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.addContactForm.controls['email'].clearValidators();
              }
              this.addContactForm.controls['email'].updateValueAndValidity();
              //
              //priority
              if (this.contactSettings?.priority?.mandatory === true) {
                this.addContactForm.controls['priority'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.addContactForm.controls['priority'].clearValidators();
              }
              this.addContactForm.controls['priority'].updateValueAndValidity();
              //piepeline
              if (
                this.contactSettings?.selectedContactPipeline?.mandatory ===
                true
              ) {
                this.addContactForm.controls[
                  'selectedContactPipeline'
                ].setValidators([Validators.required]);
              } else {
                this.addContactForm.controls[
                  'selectedContactPipeline'
                ].clearValidators();
              }
              this.addContactForm.controls[
                'selectedContactPipeline'
              ].updateValueAndValidity();
              //custLeadValue/leadSource
              if (this.contactSettings?.custLeadValue?.mandatory === true) {
                this.addContactForm.controls['custLeadValue'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.addContactForm.controls['custLeadValue'].clearValidators();
              }
              this.addContactForm.controls[
                'custLeadValue'
              ].updateValueAndValidity();
              //billingaddress1
              if (this.contactSettings?.billingaddress1?.mandatory === true) {
                this.addContactForm.controls['billingaddress1'].setValidators([
                  Validators.required,
                  Validators.minLength(3),
                  Validators.maxLength(60),
                ]);
              } else {
                this.addContactForm.controls[
                  'billingaddress1'
                ].clearValidators();
              }
              this.addContactForm.controls[
                'billingaddress1'
              ].updateValueAndValidity();
              //billingaddress2
              if (this.contactSettings?.billingaddress2?.mandatory === true) {
                this.addContactForm.controls['billingaddress2'].setValidators([
                  Validators.required,
                  Validators.minLength(3),
                  Validators.maxLength(60),
                ]);
              } else {
                this.addContactForm.controls[
                  'billingaddress2'
                ].clearValidators();
              }
              this.addContactForm.controls[
                'billingaddress2'
              ].updateValueAndValidity();
              //district
              if (this.contactSettings?.district?.mandatory === true) {
                this.addContactForm.controls['district'].setValidators([
                  Validators.required,
                  Validators.minLength(3),
                  Validators.maxLength(60),
                ]);
              } else {
                this.addContactForm.controls['district'].clearValidators();
              }
              this.addContactForm.controls['district'].updateValueAndValidity();
              //state
              if (this.contactSettings?.state?.mandatory === true) {
                this.addContactForm.controls['state'].setValidators([
                  Validators.required,
                  Validators.minLength(3),
                  Validators.maxLength(60),
                ]);
              } else {
                this.addContactForm.controls['state'].clearValidators();
              }
              this.addContactForm.controls['state'].updateValueAndValidity();
              //bpin/pinorzip
              if (this.contactSettings?.bpin?.mandatory === true) {
                this.addContactForm.controls['bpin'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.addContactForm.controls['bpin'].clearValidators();
              }
              this.addContactForm.controls['bpin'].updateValueAndValidity();
              //country
              if (this.contactSettings?.country?.mandatory === true) {
                this.addContactForm.controls['country'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.addContactForm.controls['country'].clearValidators();
              }
              this.addContactForm.controls['country'].updateValueAndValidity();
              //taxId
              if (this.contactSettings?.taxId?.mandatory === true) {
                this.addContactForm.controls['taxId'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.addContactForm.controls['taxId'].clearValidators();
              }
              this.addContactForm.controls['taxId'].updateValueAndValidity();
              //salutation
              if (this.contactSettings?.salutation?.mandatory === true) {
                this.addContactForm.controls['salutation'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.addContactForm.controls['salutation'].clearValidators();
              }
              this.addContactForm.controls[
                'salutation'
              ].updateValueAndValidity();
              //surname
              if (this.contactSettings?.surname?.mandatory === true) {
                this.addContactForm.controls['surname'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.addContactForm.controls['surname'].setValidators(null);
              }

              if (
                this.contactSettings?.surname?.display === true &&
                this.contactSettings?.surname?.mandatory === true
              ) {
                this.addContactForm.controls['surname'].setValidators([
                  ...(this.addContactForm.controls['surname'].validator
                    ? [this.addContactForm.controls['surname'].validator]
                    : []),
                  Validators.maxLength(50),
                ]);
              } else if (this.contactSettings?.surname?.display === true) {
                this.addContactForm.controls['surname'].setValidators([
                  Validators.maxLength(50),
                ]);
              }

              this.addContactForm.controls['surname'].updateValueAndValidity();

              //department
              if (this.contactSettings?.department?.mandatory === true) {
                this.addContactForm.controls['department'].setValidators([
                  Validators.required,
                ]);
              } else {
                this.addContactForm.controls['department'].clearValidators();
              }
              this.addContactForm.controls['surname'].updateValueAndValidity();
              //alternateContactNumber
              if (
                this.contactSettings?.alternateContactNumber?.mandatory === true
              ) {
                this.addContactForm.controls[
                  'alternateContactNumber'
                ].setValidators([Validators.required]);
              } else {
                this.addContactForm.controls[
                  'alternateContactNumber'
                ].clearValidators();
              }
              this.addContactForm.controls[
                'alternateContactNumber'
              ].updateValueAndValidity();
              //
            }
            //customisable field validation ends here

            this.additionalFields?.forEach((field) => {
              if (field.mandatory == true) {
                if (field.fieldType == 'date') {
                  (
                    this.addContactForm.get('additionalFields') as FormArray
                  ).push(
                    this.fb.group({
                      fieldValue: [
                        !!field.defaultValue ? field.defaultValue.toDate() : '',
                        Validators.required,
                      ],
                      fieldName: field.fieldName,
                    })
                  );
                } else if (field.fieldType == 'date_time') {
                  (
                    this.addContactForm.get('additionalFields') as FormArray
                  ).push(
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
                  (
                    this.addContactForm.get('additionalFields') as FormArray
                  ).push(
                    this.fb.group({
                      fieldValue: [field.defaultValue, Validators.required],
                      fieldName: field.fieldName,
                    })
                  );
                }
              } else {
                if (field.fieldType == 'date') {
                  (
                    this.addContactForm.get('additionalFields') as FormArray
                  ).push(
                    this.fb.group({
                      fieldValue: [
                        !!field.defaultValue ? field.defaultValue.toDate() : '',
                      ],
                      fieldName: field.fieldName,
                    })
                  );
                } else if (field.fieldType == 'date_time') {
                  (
                    this.addContactForm.get('additionalFields') as FormArray
                  ).push(
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
                  (
                    this.addContactForm.get('additionalFields') as FormArray
                  ).push(
                    this.fb.group({
                      fieldValue: field.defaultValue,
                      fieldName: field.fieldName,
                    })
                  );
                }
              }
            });
          }
          this.usrProfileData = this.commonService.getProfileData();
          if (this.usrProfileData) {
            this.userProfileData = this.usrProfileData[0];
            if (this.userProfileData) {
              // disable contact section
              if (this.usrProfileData[0].isCheckedCont == false) {
                this.disableEditContact = true;
              } else {
                if (this.usrProfileData[0].contactsEdit == false) {
                  this.disableEditContact = true;
                }
              }
              if (this.usrProfileData[0].isCheckedFoll == false) {
                this.disableAddFoll = true;
              } else if (this.usrProfileData[0].follView == false) {
                this.disableAddFoll = true;
              }
            }
          }
        }
      }
    );

    // check restriction
    //save the previous form to create change log
    this.previousForm = ChangeLogComponent.cloneAbstractControl(
      this.addContactForm
    );
  }

  ngOnInit(): void {}
  //getting formcontrols of form
  get formcontrols() {
    return this.addContactForm.controls;
  }
  pipelineChangedEvent(pipelineId) {
    this.selectedContactPipeline = pipelineId;
    var result = this.customerPipelines.filter((obj) => {
      return obj.pipelineId === pipelineId;
    });
    if (result.length > 0) {
      this.statusArray = result[0].pipelineStages.map(({ name, stageId }) => ({
        name,
        stageId,
      }));
    } else {
      this.selectedContactPipeline = null;
      this.statusArray = [];
    }

    //In update scenario, if user has changed the pipeline and returns back to the saved pipeline, restore saved status
    if (
      this.scenario == 'edit' &&
      this.selectedContactPipeline == this.previousPipeline
    ) {
      this.custData.status = this.previousStatus;
      this.addContactForm?.controls.status.setValue(this.custData.status);
    } else {
      if (this.statusArray?.length > 0) {
        this.custData.status = this.statusArray[0].stageId;
        this.addContactForm?.controls.status.setValue(
          this.statusArray[0].stageId
        );
      } else {
        this.custData.status = null;
        this.addContactForm?.controls.status.setValue(null);
      }
    }
  }
  async onUpdate(form) {
    if (form.value.contactNo) {
      form.value.contactNo = form.value.contactNo + '';
    }
    if (form.value.alternateContactNumber) {
      form.value.alternateContactNumber =
        form.value.alternateContactNumber + '';
    }
    let contactNumDuplicate = false;
    let altContactNumDuplicate = false;
    let emailDuplicate = false;
    // if old assignee is not equal to new assignee update assigned to date
    if (this.oldAssignedTo != this.custData.assignedTo) {
      this.assignedToDate = new Date().getTime();
    }
    if (this.duplicateEmailDisable && this.oldEmail != form.value.email) {
      if (form.value.email) {
        let contactEmailData = await this.db.getEmailWithContact(
          this.superUserId,
          form.value.email
        );
        if (contactEmailData.length > 0) {
          emailDuplicate = true;
        }
      }
    } else {
      emailDuplicate = false;
    }

    if (
      this.duplicateContactNumberDisable &&
      this.oldContactNumber != form.value.contactNo
    ) {
      if (form.value.contactNo) {
        let contactNumData = await this.db.getContactNumWithContact(
          this.superUserId,
          form.value.contactNo
        );
        if (contactNumData.length > 0) {
          contactNumDuplicate = true;
        }
        if (!contactNumDuplicate) {
          let contactNumData = await this.db.getAltContactNumWithContact(
            this.superUserId,
            form.value.contactNo
          );
          if (contactNumData.length > 0) {
            contactNumDuplicate = true;
          }
        }
      }
    } else {
      contactNumDuplicate = false;
    }
    if (
      this.duplicateContactNumberDisable &&
      this.oldAltContactNumber != form.value.alternateContactNumber
    ) {
      if (form.value.alternateContactNumber) {
        let altContactNumData = await this.db.getAltContactNumWithContact(
          this.superUserId,
          form.value.alternateContactNumber
        );
        if (altContactNumData.length > 0) {
          altContactNumDuplicate = true;
        }
        if (!altContactNumDuplicate) {
          let altContactNumData = await this.db.getContactNumWithContact(
            this.superUserId,
            form.value.alternateContactNumber
          );
          if (altContactNumData.length > 0) {
            altContactNumDuplicate = true;
          }
        }
      }
    } else {
      altContactNumDuplicate = false;
    }

    if (!contactNumDuplicate && !emailDuplicate && !altContactNumDuplicate) {
      if (form.value.alternateContactNumber) {
        form.value.alternateContactNumber =
          form.value.alternateContactNumber + '';
      }
      this.disableButton = true;
      //if no leadSource as null if not present
      if (!form.value.custLeadValue) {
        form.value.custLeadValue = null;
      }

      //defaulting contact number as null if not present
      if (!form.value.contactNo && !form.value.alternateContactNumber) {
        this.custData.code = '';
        this.custData.altContactCode = '';
      }
      if (!form.value.contactNo) {
        this.custData.code = '';
      }
      if (!form.value.alternateContactNumber) {
        this.custData.altContactCode = '';
      }
      let datePlaced = new Date().getTime(); //Get TimeStamp
      //getting customers first naem and second name
      this.customerFirstName = form.value.firstName;
      this.customerSecondName = form.value.secondName;
      this.customerSurname = form.value.surname;
      if (form.value.secondName && form.value.surname) {
        // if second name & surname is there
        this.customerNames =
          form.value.firstName +
          ' ' +
          form.value.secondName +
          ' ' +
          form.value.surname;
      } else if (form.value.secondName && !form.value.surname) {
        this.customerNames = form.value.firstName + ' ' + form.value.secondName;
      } else if (!form.value.secondName && form.value.surname) {
        this.customerNames = form.value.firstName + ' ' + form.value.surname;
      } else {
        this.customerNames = form.value.firstName;
      }
      //checking whether status is changed or not
      if (form.status != this.inputData.status) {
        this.month = new Date().getMonth();
        this.createdYear = new Date().getFullYear();
        let statusArray = this.statusArray;
        //checking whether stage history is not found
        let currentHistory = this.inputData?.stageHistory;

        if (!currentHistory) {
          currentHistory = [];
        }
        //adding new status with new data
        this.stageValues.date = datePlaced;
        this.stageValues.stageId = form.value.status;
        this.stageValues.pipelineId = this.selectedContactPipeline;
        currentHistory.push(this.stageValues);
        this.stageHistories = currentHistory;
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

      //storing search for customer name /comapny name in search bar
      let searchTerm: SearchTerm = {
        firstName: '',
        secondName: '',
        companyName: '',
        surname: '',
      };

      searchTerm.firstName = this.customerFirstName.toLowerCase();
      searchTerm.companyName = this.orgName.toLowerCase();
      //added here
      searchTerm.surname = this.customerSurname.toLowerCase();
      if (this.customerSecondName) {
        searchTerm.secondName = this.customerSecondName.toLowerCase();
      } else {
        searchTerm.secondName = this.customerSecondName;
      }
      if (this.customerSurname) {
        searchTerm.surname = this.customerSurname.toLowerCase();
      } else {
        searchTerm.surname = this.customerSurname;
      }
      if (
        form.value.status ===
        this.statusArray[this.statusArray.length - 1].stageId
      ) {
        this.lost = true;
        this.won = false;
        this.inPipeline = false;
      } else if (
        form.value.status ===
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

      ///changes made here
      let formDetails = {
        rejectionReasonValue: form.value.rejectionReasonVal
          ? form.value.rejectionReasonVal
          : '',
        assignedTo: this.custData.assignedTo,
        associatedBranch: this.associatedBranch ? this.associatedBranch : '',
        isCompany: this.orgId && this.orgId.length > 0 ? true : false,
        orgId: this.orgId ? this.orgId : '',
        companyName: this.orgId ? this.orgName : form.value.companyName,
        firstName: form.value.firstName,
        secondName: form.value.secondName,
        code: this.custData.code,
        contactNo: form.value.contactNo,
        email: form.value.email,
        selectedContactPipeline: form.value.selectedContactPipeline,
        status: form.value.status,
        priority: form.value.priority,
        custLeadValue: form.value.custLeadValue,
        billingaddress1: form.value.billingaddress1,
        billingaddress2: form.value.billingaddress2,
        district: form.value.district,
        state: form.value.state,
        bpin: form.value.bpin,
        country: form.value.country,
        taxId: form.value.taxId,
        salutation: form.value.salutation,
        surname: form.value.surname,
        department: form.value.department,
        alternateContactNumber: form.value.alternateContactNumber,
        altContactCode: this.custData.altContactCode,
        assignedToDate: this.assignedToDate,
      };
      let additionalData = {
        //send pipeline names to changelog
        pipelineArray: this.customerPipelines,
        curAssignedTo: {
          assignedTo:
            this.previousAssignedTo != this.custData.assignedTo
              ? this.custData.assignedTo
              : null,
          assignedToName:
            this.previousAssignedToName != this.custData.assignedToName
              ? this.custData.assignedToName
              : null,
        },
        prevAssignedTo: {
          assignedTo: this.previousAssignedTo,
          assignedToName: this.previousAssignedToName,
        },
        curCountryCode: {
          countryCode:
            this.form?.code != this.custData.code ? this.custData.code : null,
        },
        prevCountryCode: {
          countryCode: this.form?.code,
        },
        curAltContactCode: {
          altCountryCode:
            this.prevAltContactCode != this.custData.altContactCode
              ? this.custData.altContactCode
              : null,
        },
        prevAltContactCode: {
          altCountryCode: this.prevAltContactCode,
        },
        currentOrgId: this.orgId
          ? {
              orgId: this.orgId,
              companyName: this.orgName,
            }
          : {
              orgId: null,
              companyName: form.value.companyName,
            },
        prevOrgId: {
          orgId: this.prevOrgId ? this.prevOrgId : null,
          companyName: this.prevOrgName,
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
        this.previousPipeline != form.value.selectedContactPipeline &&
        this.previousStatus != form.value.status
      ) {
        this.addContactForm.get('status').markAsDirty();
      }

      //changeLog for sale popup
      let newChangeLog = ChangeLogComponent.saveLogReactiveForm(
        this.constructor.name,
        this.userId,
        this.userName,
        this.previousForm,
        this.addContactForm,
        this.changeLog,
        additionalData
      );
      if(formDetails.contactNo){
        formDetails.contactNo = formDetails.contactNo+'';
      }
      if(formDetails.alternateContactNumber){
        formDetails.alternateContactNumber = formDetails.alternateContactNumber+'';
      }
      // checking status changed
      if (form.value.status != this.inputData.status && newChangeLog != null) {
        //update customer detail if status is changed
        this.db.update(
          this.id,
          formDetails,
          datePlaced,
          this.custData.assignedToName,
          this.superUserId,
          this.stageHistories,
          datePlaced,
          additionalFields,
          searchTerm,
          this.inPipeline,
          this.won,
          this.lost,
          newChangeLog
        );
      }
      // checking status changed
      if (form.value.status == this.inputData.status && newChangeLog != null) {
        //update customer details if status is not changed
        this.db.updateCustNostatusChange(
          this.id,
          formDetails,
          datePlaced,
          this.custData.assignedToName,
          this.superUserId,
          additionalFields,
          searchTerm,
          this.inPipeline,
          this.won,
          this.lost,
          newChangeLog
        );
      }
      //checking whether company name /customer name changed
      if (
        this.customerFirstName != this.inputData.firstName ||
        this.customerSecondName != this.inputData.secondName ||
        this.customerSurname != this.inputData.surname ||
        this.form?.code != this.custData.code ||
        this.oldContactNumber != form.value.contactNo ||
        this.prevAltContactCode != this.custData.altContactCode ||
        this.oldAltContactNumber != form.value.alternateContactNumber
      ) {
        this.loader = true;
        let secondName;
        if (this.customerSecondName) {
          secondName = this.customerSecondName.toLowerCase();
        } else {
          secondName = this.customerSecondName;
        }
        let surname;
        if (this.customerSurname) {
          surname = this.customerSurname.toLowerCase();
        } else {
          surname = this.customerSurname;
        }
        //saving company name and cutsomers name in lowercase for seaching
        let firstName = this.customerFirstName.toLowerCase();
        let companyName = this.orgName.toLowerCase();
        let searchTermDoc: SearchTerm = {
          firstName: '',
          secondName: '',
          companyName: '',
          surname: '',
        };
        searchTermDoc.firstName = this.customerFirstName.toLowerCase();
        searchTermDoc.companyName = this.orgName.toLowerCase();

        if (this.customerSecondName) {
          searchTermDoc.secondName = this.customerSecondName.toLowerCase();
        } else {
          searchTermDoc.secondName = this.customerSecondName;
        }
        //changes made here
        // let surname;
        if (this.customerSurname) {
          searchTermDoc.surname = this.customerSurname.toLowerCase();
        } else {
          searchTermDoc.surname = this.customerSurname;
        }
        //geting sales list for updating
        this.saleSubscription = this.db
          .getAllSales(this.superUserId, this.id)
          .pipe(take(1))
          .subscribe((data) => {
            this.sales = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as Sales;
            });
            //changing field name for each sales using sales id
            this.sales.forEach((saleElement) => {
              this.db.onUpdateSaleCustomerName(
                this.superUserId,
                saleElement.id,
                this.customerFirstName,
                this.customerSecondName,
                this.customerSurname,
                this.orgName,
                firstName,
                secondName,
                surname,
                companyName,
                this.custData.code,
                form.value.contactNo,
                this.custData.altContactCode,
                form.value.alternateContactNumber
              );
            });
            //setting sales data as updated
            this.saleUpdated = true;
          });

        //geting service list for updating
        this.serviceSubscription = this.db
          .getAllServices(this.superUserId, this.id)
          .pipe(take(1))
          .subscribe((data) => {
            this.services = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as Service;
            });
            //changing field name for each sales using sales id
            this.services.forEach((serviceElement) => {
              this.db.onUpdateServiceCustomerName(
                this.superUserId,
                serviceElement.id,
                this.customerFirstName,
                this.customerSecondName,
                this.customerSurname,
                this.orgName,
                firstName,
                secondName,
                surname,
                companyName,
                this.custData.code,
                form.value.contactNo,
                this.custData.altContactCode,
                form.value.alternateContactNumber
              );
            });
            //setting service data as updated
            this.serviceUpdated = true;
          });

        if (
          this.customerFirstName != this.inputData.firstName ||
          this.customerSecondName != this.inputData.secondName ||
          this.customerSurname != this.inputData.surname
        ) {
          //added here

          //geting follow up list for updating
          this.followUpSubscription = this.db
            .getAllFollowUps(this.superUserId, this.id)
            .pipe(take(1))
            .subscribe((data) => {
              this.followUps = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as FollowUps;
              });
              //changing field name for each follow up using follow up id
              this.followUps.forEach((element) => {
                this.db.onUpdateFollowUpCustomerName(
                  this.superUserId,
                  element.id,
                  this.customerNames,
                  this.orgName
                );
              });
              //setting follow up data as updated
              this.followupUpdated = true;
            });
          //geting task list for updating
          this.taskSubscription = this.db
            .getAllTasks(this.superUserId, this.id)
            .pipe(take(1))
            .subscribe((data) => {
              this.tasks = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as Task;
              });
              //changing field name for each task using task id
              this.tasks.forEach((taskelement) => {
                this.db.onUpdateTaskCustomerName(
                  this.superUserId,
                  taskelement.id,
                  this.customerFirstName,
                  this.customerSecondName,
                  this.customerSurname,
                  this.orgName
                );
              });
              //setting task data as updated
              this.taskUpdated = true;
            });
          //geting payment list for updating
          this.paymentSubscription = this.db
            .getAllPayments(this.superUserId, this.id)
            .pipe(take(1))
            .subscribe((data) => {
              this.payments = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as PaymentReceipt;
              });
              //changing field name for each payment using payment id
              this.payments.forEach((paymentelement) => {
                this.db.onUpdatePaymentCustomerName(
                  this.superUserId,
                  paymentelement.id,
                  this.customerFirstName,
                  this.customerSecondName,
                  this.orgName
                );
              });
              //setting payment data as updated
              this.paymentUpdated = true;
            });

          //geting expense list for updating
          this.expenseSubscription = this.db
            .getAllExpenses(this.superUserId, this.id)
            .pipe(take(1))
            .subscribe((data) => {
              this.expenses = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as Expenses;
              });
              //changing field name for each expense using expense id
              this.expenses.forEach((expelement) => {
                this.db.onUpdateExpenseCustomerName(
                  this.superUserId,
                  expelement.id,
                  this.customerFirstName,
                  this.customerSecondName,
                  this.orgName
                );
              });
              //setting expense data as updated
              this.expenseUpdated = true;
            });
        } else {
          this.expenseUpdated = true;
          this.followupUpdated = true;
          this.taskUpdated = true;
          this.paymentUpdated = true;
        }
        //setting an interval to make sure updates all done
        var interval = setInterval(() => {
          // if all data is updated then closing interval and navigate to customer details
          if (
            this.expenseUpdated == true &&
            this.saleUpdated == true &&
            this.followupUpdated == true &&
            this.taskUpdated == true &&
            this.paymentUpdated == true &&
            this.serviceUpdated == true
          ) {
            //clearing interval since all data is updated
            clearInterval(interval);
            //navigating to updated customer
            let message = this.fieldNameContact + ' updated successfully';
            this._snackBar.open(message, ' ', {
              duration: 2000,
            });
            //close popup
            if (this.isMobilesize === false) {
              if(form.value.status != this.inputData.status){
                this.dialogRef.close('changed status');
              }else{
                this.dialogRef.close('not changed status');
              }
            }
            if (this.isMobilesize === true) {
              this.router.navigate(['dash/contact/customerdetails/' + this.id]);
            }
            this.loader = false;
          }
        }, 200);
      }
      //if no change made to name and company name
      else {
        //navigating to that customers detail page
        let message = this.fieldNameContact + ' updated successfully';
        this._snackBar.open(message, ' ', {
          duration: 2000,
        });
        //close popup
        if (this.isMobilesize === false) {
          if(form.value.status != this.inputData.status){
            this.dialogRef.close('changed status');
          }else{
            this.dialogRef.close('not changed status');
          }

        }
        if (this.isMobilesize === true) {
          this.router.navigate(['dash/contact/customerdetails/' + this.id]);
        }
      }
    } else if (
      contactNumDuplicate &&
      emailDuplicate &&
      altContactNumDuplicate
    ) {
      this.submitDisable = false;
      this._snackBar.open(
        'Contact number, alternate contact number and Email already exists ',
        '',
        {
          duration: 2000,
        }
      );
    } else if (
      contactNumDuplicate &&
      emailDuplicate &&
      !altContactNumDuplicate
    ) {
      this.submitDisable = false;
      this._snackBar.open('Contact number and Email already exists ', '', {
        duration: 2000,
      });
    } else if (
      !contactNumDuplicate &&
      emailDuplicate &&
      altContactNumDuplicate
    ) {
      this.submitDisable = false;
      this._snackBar.open(
        'Alternate contact number and Email already exists ',
        '',
        {
          duration: 2000,
        }
      );
    } else if (
      contactNumDuplicate &&
      !emailDuplicate &&
      altContactNumDuplicate
    ) {
      this.submitDisable = false;
      this._snackBar.open(
        'Contact number and alternate contact number already exists',
        '',
        {
          duration: 2000,
        }
      );
    } else if (contactNumDuplicate) {
      this.submitDisable = false;
      this._snackBar.open('Contact number already exists ', '', {
        duration: 2000,
      });
    } else if (emailDuplicate) {
      this.submitDisable = false;
      this._snackBar.open('Email already exists ', '', {
        duration: 2000,
      });
    } else if (altContactNumDuplicate) {
      this.submitDisable = false;
      this._snackBar.open('Alternate contact number already exists ', '', {
        duration: 2000,
      });
    } else {
    }
  }
  back() {
    //to go back to previous page
    if (this.isMobilesize === false) {
      this.dialogRef.close('back');
    } else {
      this.loc.back();
    }
  }
  // if status is rejected, set validators acc to settings, else set value null
  statusSelected(statusId) {
    var result = this.statusArray.filter((obj) => {
      return obj.stageId === statusId;
    });
    const statusObj = result[0];
    if (
      this.contactSettings.rejectionReasonVal?.mandatory === true &&
      statusObj === this.statusArray[this.statusArray.length - 1]
    ) {
      this.addContactForm.controls['rejectionReasonVal'].setValidators(
        Validators.required
      );
    } else {
      this.addContactForm.controls['rejectionReasonVal'].clearValidators();
      this.addContactForm.controls['rejectionReasonVal'].setValue('');
    }
  }
  //triggered while creating a new customer
  onSubmit(form, GAevent) {
    this.submitDisable = true;
    this.dbUpdate(form, GAevent);
  }
  async dbUpdate(form, GAevent) {
    if (form.value.contactNo) {
      form.value.contactNo = form.value.contactNo + '';
    }
    if (form.value.alternateContactNumber) {
      form.value.alternateContactNumber =
        form.value.alternateContactNumber + '';
    }
    //checking duplicate entries if enabled
    let contactNumDuplicate = false;
    let altContactNumDuplicate = false;
    let emailDuplicate = false;
    if (this.duplicateEmailDisable) {
      if (form.value.email) {
        let contactEmailData = await this.db.getEmailWithContact(
          this.superUserId,
          form.value.email
        );
        if (contactEmailData.length > 0) {
          emailDuplicate = true;
        }
      }
    } else {
      emailDuplicate = false;
    }
    if (this.duplicateContactNumberDisable) {
      if (form.value.contactNo) {
        let contactNumData = await this.db.getContactNumWithContact(
          this.superUserId,
          form.value.contactNo
        );
        if (contactNumData.length > 0) {
          contactNumDuplicate = true;
        }
        if (!contactNumDuplicate) {
          let contactNumData = await this.db.getAltContactNumWithContact(
            this.superUserId,
            form.value.contactNo
          );
          if (contactNumData.length > 0) {
            contactNumDuplicate = true;
          }
        }
      }
    } else {
      contactNumDuplicate = false;
    }
    if (this.duplicateContactNumberDisable) {
      if (form.value.alternateContactNumber) {
        let altContactNumData = await this.db.getAltContactNumWithContact(
          this.superUserId,
          form.value.alternateContactNumber
        );
        if (altContactNumData.length > 0) {
          altContactNumDuplicate = true;
        }
        if (!altContactNumDuplicate) {
          let altContactNumData = await this.db.getContactNumWithContact(
            this.superUserId,
            form.value.alternateContactNumber
          );
          if (altContactNumData.length > 0) {
            altContactNumDuplicate = true;
          }
        }
      }
    } else {
      altContactNumDuplicate = false;
    }
    if (!contactNumDuplicate && !emailDuplicate && !altContactNumDuplicate) {
      if (form.value.alternateContactNumber) {
        form.value.alternateContactNumber =
          form.value.alternateContactNumber + '';
      }

      //for triggering google analytics
      this.analytics.logEvent(GAevent);

      let datePlaced = new Date().getTime(); //Get TimeStamp
      this.month = new Date().getMonth(); //
      this.createdYear = new Date().getFullYear();

      //for creating new stage history to customer
      //adding new status with new data
      this.stageValues.date = datePlaced;
      this.stageValues.stageId = form.value.status;
      this.stageValues.pipelineId = this.selectedContactPipeline;
      this.stageHistory.push(this.stageValues);

      form.value.salePipelineValue = 0; //Set initital value for sales in pipeline
      form.value.saleOngoingValue = 0; //Set initial value for ongoing Sales
      form.value.collectedAmount = 0; // Set inital value for total amount collected from customer
      form.value.invoicedAmount = 0; // set initial value for total amount invoiced to customer
      form.value.ongoingSales = 0; // set initial value for total amount ongoing in sale
      form.totalAmountCollected = 0; // set initial value for collected amount
      if (!form.value.contactNo && !form.value.alternateContactNumber) {
        this.custData.code = '';
        this.custData.altContactCode = '';
      }
      if (!form.value.contactNo) {
        this.custData.code = '';
      }
      if (!form.value.alternateContactNumber) {
        this.custData.altContactCode = '';
      }
      //checking whether assigned to is not selected if not setting users name

      let st = form.value;
      //checking whether first name is given or not
      if (st.secondName != null) {
        this.customerNames = st.firstName + ' ' + st.secondName;
      }
      if (st.secondName == null) {
        this.customerNames = st.firstName;
      }
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

      //getting assigned to value and assigned to name
      this.assignedTo = st.assignedTo;
      this.assignedToName = this.custData.assignedToName;
      //
      let searchTerm: SearchTerm = {
        firstName: '',
        secondName: '',
        companyName: '',
        surname: '',
      };
      //saving company name and cutsomers name in lowercase for seaching
      searchTerm.firstName = form.value.firstName.toLowerCase();
      searchTerm.companyName = this.orgName.toLowerCase();
      if (form.value.secondName) {
        searchTerm.secondName = form.value.secondName.toLowerCase();
      } else {
        searchTerm.secondName = form.value.secondName;
      }
      if (form.value.surname) {
        searchTerm.surname = form.value.surname.toLowerCase();
      } else {
        searchTerm.surname = form.value.surname;
      }
      if (this.commonService.superUserData.contactSequentialNumber) {
        this.contactSequenceNumber =
          this.commonService.superUserData.contactSequentialNumber + 1;
      } else {
        this.contactSequenceNumber = 1;
      }
      //for creating a new customer in db

      if (
        form.value.status ===
        this.statusArray[this.statusArray.length - 1].stageId
      ) {
        this.lost = true;
        this.won = false;
        this.inPipeline = false;
      } else if (
        form.value.status ===
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
        // assignedTo: form.value.assignedTo,
        assignedTo: this.custData.assignedTo,
        associatedBranch: this.associatedBranch ? this.associatedBranch : '',
        isCompany: this.orgId && this.orgId.length > 0 ? true : false,
        orgId: this.orgId ? this.orgId : '',
        companyName: this.orgId ? this.orgName : form.value.companyName,
        firstName: form.value.firstName,
        secondName: form.value.secondName,
        code: this.custData.code,
        contactNo: form.value.contactNo,
        email: form.value.email,
        selectedContactPipeline: form.value.selectedContactPipeline,
        status: form.value.status,
        priority: form.value.priority,
        custLeadValue: form.value.custLeadValue,
        billingaddress1: form.value.billingaddress1,
        billingaddress2: form.value.billingaddress2,
        district: form.value.district,
        state: form.value.state,
        bpin: form.value.bpin,
        country: form.value.country,
        taxId: form.value.taxId,
        salutation: form.value.salutation,
        surname: form.value.surname,
        department: form.value.department,
        alternateContactNumber: form.value.alternateContactNumber,
        altContactCode: this.custData.altContactCode,
        collectedAmount: form.value.collectedAmount,
        invoicedAmount: form.value.invoicedAmount,
        ongoingSales: form.value.ongoingSales,
        saleOngoingValue: form.value.saleOngoingValue,
        salePipelineValue: form.value.salePipelineValue,
        totalAmountCollected: form.value.totalAmountCollected,
        assignedToDate: new Date().getTime(),
      };
      if(formDetails.contactNo){
        formDetails.contactNo = formDetails.contactNo+'';
      }
      if(formDetails.alternateContactNumber){
        formDetails.alternateContactNumber = formDetails.alternateContactNumber+'';
      }
      this.db
        .create(
          this.userId,
          formDetails,
          datePlaced,
          this.custData.assignedToName,
          this.month,
          this.createdYear,
          this.superUserId,
          this.stageHistory,
          datePlaced,
          additionalFields,
          searchTerm,
          this.contactSequenceNumber,
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
          this.customerNewId = res.id;
          //checking is customer created from inquires table
          if (this.id) {
            //updating that customer is created to inquiry
            this.db.opportunityCreated(this.superUserId, this.id);
          }

          this.db
            .updateContactSequenceNumber(
              this.superUserId,
              this.contactSequenceNumber
            )
            .then((result) => {
              let message = this.fieldNameContact + ' added successfully';
              this._snackBar.open(message, ' ', {
                duration: 2000,
              });
              //routing to new customer created
              if (this.data?.followUpId) {
                let customerName;
                if (form.value.secondName) {
                  customerName =
                    form.value.firstName + ' ' + form.value.secondName;
                } else {
                  customerName = form.value.firstName;
                }

                this.db
                  .updateFollowup(
                    this.superUserId,
                    this.data?.followUpId,
                    this.customerNewId,
                    customerName,
                    this.orgName
                  )
                  .then((result) => {
                    this.router.navigate([
                      'dash/contact/customerdetails/' + this.customerNewId,
                    ]);
                    //close popup
                    if (this.isMobilesize === false) {
                      this.dialogRef.close();
                    }
                  });
              } else {
                this.router.navigate([
                  'dash/contact/customerdetails/' + this.customerNewId,
                ]);
                //close popup
                if (this.isMobilesize === false) {
                  this.dialogRef.close();
                }
              }
            });
        })
        //if any error occures while creating customer
        .catch((e) => {
          this._snackBar.open('Error while Adding ', '', {
            duration: 2000,
          });
        });
      if (this.isMobilesize === false) {
        this.dialogRef.close();
      }
    } else if (
      contactNumDuplicate &&
      emailDuplicate &&
      altContactNumDuplicate
    ) {
      this.submitDisable = false;
      this._snackBar.open(
        'Contact number, alternate contact number and Email already exists ',
        '',
        {
          duration: 2000,
        }
      );
    } else if (
      contactNumDuplicate &&
      emailDuplicate &&
      !altContactNumDuplicate
    ) {
      this.submitDisable = false;
      this._snackBar.open('Contact number and Email already exists ', '', {
        duration: 2000,
      });
    } else if (
      !contactNumDuplicate &&
      emailDuplicate &&
      altContactNumDuplicate
    ) {
      this.submitDisable = false;
      this._snackBar.open(
        'Alternate contact number and Email already exists ',
        '',
        {
          duration: 2000,
        }
      );
    } else if (
      contactNumDuplicate &&
      !emailDuplicate &&
      altContactNumDuplicate
    ) {
      this.submitDisable = false;
      this._snackBar.open(
        'Contact number and alternate contact number already exists',
        '',
        {
          duration: 2000,
        }
      );
    } else if (contactNumDuplicate) {
      this.submitDisable = false;
      this._snackBar.open('Contact number already exists ', '', {
        duration: 2000,
      });
    } else if (emailDuplicate) {
      this.submitDisable = false;
      this._snackBar.open('Email already exists ', '', {
        duration: 2000,
      });
    } else if (altContactNumDuplicate) {
      this.submitDisable = false;
      this._snackBar.open('Alternate contact number already exists ', '', {
        duration: 2000,
      });
    } else {
    }
  }

  // to show error message if mandatory field is not given
  TypeError(form) {
    this._snackBar.open('Please fill all the mandatory fields', '', {
      duration: 2000,
    });
    this.submitted = true;
  }

  //to get assigned users name if selected
  onAssignedToSelected(firstName, lastName) {
    this.custData.assignedToName = firstName + ' ' + lastName;
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
      this.addContactForm.controls.companyName.patchValue(this.orgName);
      this.addContactForm.controls.companyName.disable();
    } else {
      this.orgName = 'Individual';
      this.addContactForm.controls.companyName.patchValue(this.orgName);
      this.addContactForm.controls.companyName.enable();
    }
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    //for unsubscribing subscription
    this.subscription?.unsubscribe();
    this.saleSubscription?.unsubscribe();
    this.paymentSubscription?.unsubscribe();
    this.followUpSubscription?.unsubscribe();
    this.taskSubscription?.unsubscribe();
    this.userDetailsSubscription?.unsubscribe();
    this.serviceSubscription?.unsubscribe();
  }

  //checking for network
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }

  //assigned to search field
  assignedToEventHander($event: any) {
    this.custData.assignedTo = $event;
    if (this.custData.assignedTo) {
      for (let i = 0; i < this.allSubUsers.length; i++) {
        if (this.custData.assignedTo === this.allSubUsers[i].userId) {
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
    this.custData.assignedToName = $event;
  }
  branchIdEventHandler($event: any) {
    this.associatedBranch = $event;
  }
  //code to searchbale feld
  countryCodeEventHander($event: any) {
    this.custData.code = $event;
  }
  altContactCodeEventHander($event: any) {
    this.custData.altContactCode = $event;
  }
  toggleAddress() {
    this.showAddress = !this.showAddress;
  }
}
