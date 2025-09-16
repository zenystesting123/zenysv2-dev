/*-----------------------------------------------------------
Descripion : For create / update followup task
------------------------------------------------------------------------*/
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import {
  addFieldsArr,
  customFields,
  defaultfollowUpSettings,
  FollowupDirection,
  FollowupOutcome,
  followUpSettings,
  FollowupStatus,
  Sales,
  Service,
} from '../data-models';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { NetworkCheckService } from '../networkcheck.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { CommonService } from '../common.service';
import { FollowupTaskCreateService } from './followup-task-create.service';
import { Router } from '@angular/router';
import { ChangeLogComponent } from '../change-log/change-log.component';
@Component({
  selector: 'app-followup-task-create',
  templateUrl: './followup-task-create.component.html',
  styleUrls: ['./followup-task-create.component.scss'],
})
export class FollowupTaskCreateComponent implements OnInit, OnDestroy {
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  custId: string; // folloup customer id
  scenario: string; //stores scenario  for followups(edit/update)
  companyNames: string; //stores compnay name customer
  customerNames: string; // stores customer name
  contactNumber: string; // stores customer contactNumber
  countryCode: string; // stores customer countryCode
  followUpId: string; // followup id for edit scenario
  titleName: string = 'Add'; // title name for popup card
  followUpData: any = {
    // initialize followup data
    callDuration: null,
    callEndDate: null,
    callEndTime: null,
    destinationNumber: null,
    displayNumber: null,
    sourceNumber: null,
    resourceURL:''
  };
  userId: string; // user id
  superUserId: string; // super user id
  saleDataAccessRule: string = 'Own'; // data access rule for sale
  serviceDataAccessRule: string = 'Own'; // data access rule for service
  filteredSales: Observable<Sales[]>; // filtered customer list
  filteredService: Observable<Service[]>; // filtered customer list
  sales: Sales[]; // sales list
  services: Service[]; // services list
  saleControl = new FormControl(); // form controller
  serviceControl = new FormControl(); // form controller
  networkConnection: boolean; // checks network connection
  fieldNameFollowup: string = 'FollowUp'; // field name for followup
  fieldNameContact: string = 'Contact'; // field name for contact
  fieldNameSale: string = 'Sale'; // field name for sale
  fieldNameservice: string = 'Support';// field name for support
  isLoaded: boolean = false;
  followUpOutcomeArray: string[] = FollowupOutcome.DATA; // followup outcome array
  followUpStatusArray: string[] = FollowupStatus.DATA; // followup status array
  directionArray: string[] = []; // followup direction array
  ivrIntegrationEnable: boolean = false; //ivr enable check
  form: FormGroup;
  saleTitle: string = ''; // selected sale title
  prevSaleTitle: string = '';//store prev value of saletitle
  saleId: string = '';// selected sale id
  prevSaleId: string = ''; //store prev value of saleid
  serviceTitle: string = '';// selected service title
  prevServiceTitle: string = '';//store prev value of service title
  serviceId: string = '';// selected service id
  prevServiceId: string = ''; //store prev value of service id
  additionalFieldLength: number; //store additional fields length
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

  additionalFieldsNextFollowup = [this.additionalFieldModel];
  addFieldArrModel: addFieldsArr = {
    //model for storing additional fields of each customer
    fieldValue: null,
  };
  addFieldsArray = [this.addFieldArrModel]; //to store additional fields in sales
  nextFollowUpDate: any = null; // next followup date
  nextFollowUpTime: string = null; // next followup time
  allSubUsers: any[] = []; // all sub users
  subUsers: any[] = []; // sub users list
  assignedToName: string; // selected assigned to name
  assignedTo: string; // selected asisgne dto id
  nextFollowupClicked: boolean = false;
  disableReAssign: boolean = false; // for disable reassign
  contactLoaded: boolean = false; // contact loaded check
  associatedBranch = ''; // branch id
  branches = []; // for storing branch array
  plan = '';// selected plan name
  followUpSettings: followUpSettings = defaultfollowUpSettings.CONST_VALUE;
  orgId = ''; // for storing organization id
  // displaying chip
  chipDisplay: boolean = false;
  contactSelected: boolean = false;
  companySelected: boolean = false;
  superUserBranchId: string = 'n/a';
  daTime: any;
  formResetDisable: boolean = false;// to handle form reset issue while having changes in user
  oldAssignedTo:string;// old assigne
  assignedToDate:number=null;// old assigned to date
  previousForm: FormGroup; //stores the form data before making any changes to use in changelog
  changeLog: any = {}; //stores existing changelog array from db
  //custom pipe to implement sorting of data wrt date modified in changeLog
  propName = 'dateModified'; //property for sorting
  customsort =
   ((a, b)=>{
    //returns the greater date first
    return Number(b.value[this.propName]) - Number(a.value[this.propName]);
  });
  userName: string; //current username
  prevAssignedTo: string; //assignedTo value before change
  prevAssignedToName: string; //assignedToName value before change
  prevOrgId: string; //org Id value before change
  prevOrgName: string; //org Name value before change
  prevCustomerName: string; //customer name value before change
  prevAssBranch: string; //associated branch value before change
  changeLogLength: number; //length of changelog records

  disbaleButton:boolean=false;// disable save/update button
  constructor(
    private analytics: AngularFireAnalytics,
    @Optional()

    private _snackBar: MatSnackBar,
    @Optional() public dialogRef: MatDialogRef<FollowupTaskCreateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private db: FollowupTaskCreateService,
    public networkCheck: NetworkCheckService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.directionArray = FollowupDirection.DATA;
  }
  ngOnInit() {
    // its for web view popup
    if (this.data) {
      // get all data passed t popup
      this.custId = this.data.id; //customer id
      this.orgId = this.data.orgId ? this.data.orgId : null; //customer id
      if (this.custId) {
        this.contactSelected = true;
      }
      if (this.orgId) {
        this.companySelected = true;
      }
      this.followUpId = this.data.followUpId; // followup id
      this.scenario = this.data.scenario; //scenario for followup
      this.companyNames = this.data.companyNames
        ? this.data.companyNames
        : null; //company name
      this.customerNames = this.data.customerNames; //custome name
      this.contactNumber =  this.data.contactNumber ? this.data.contactNumber :'';
      this.countryCode =  this.data.countryCode ? this.data.countryCode :'';
    }
    // subscribe user details
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        if (allData.authDetails) {
          this.userId = allData.authDetails.uid; // get user i
          //get user name
          this.userName = allData.userDetails.lastname
            ? allData.userDetails.firstname + ' ' + allData.userDetails.lastname
            : allData.userDetails.firstname;
          if (allData.userDetails) {
            // if user details exist
            if (allData.userDetails.superUserId) {
              // check supper user id exist
              this.superUserId = allData.userDetails.superUserId;
            } else {
              // else assign user id as suer user id
              this.superUserId = this.userId;
            }
            if (!this.assignedTo) {
              this.assignedTo = allData.userId;
              this.assignedToName =
                allData.userDetails.firstname +
                ' ' +
                (allData.userDetails.lastname
                  ? allData.userDetails.lastname
                  : ''); //assigned to user name
            }
            this.subUsers = allData.subUsers;
            this.allSubUsers = this.commonService.createUserlist(
              'All',
              'any'
            )[1];
            this.plan = allData.superUserDetails.plan;
            this.branches = allData.branches;
            if (allData.superUserDetails.associatedBranch) {
              this.superUserBranchId =
                allData.superUserDetails.associatedBranch;
            }
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

            // restrict reassign followup
            if (allData.usrProfileData.isCheckedFoll == false) {
              this.disableReAssign = true;
            } else {
              if (allData.usrProfileData.followUpReAssign == false) {
                this.disableReAssign = true;
              }
            }

            if (allData.superUserDetails.fieldNames) {
              // for contact and followup fieldname set
              this.fieldNameContact =
                allData.superUserDetails.fieldNames.fieldNameContact;
              this.fieldNameSale =
                allData.superUserDetails.fieldNames.fieldNameSale;
              this.fieldNameFollowup =
                allData.superUserDetails.fieldNames.fieldNameFollowup;
              if (allData.superUserDetails?.fieldNames?.fieldNameService) {
                this.fieldNameservice =
                  allData.superUserDetails.fieldNames.fieldNameService;
              }
            }
            if (allData.superUserDetails.ivrIntegrationEnable) {
              this.ivrIntegrationEnable =
                allData.superUserDetails.ivrIntegrationEnable;
            }
            if (allData.usrProfileData?.saleDataAccessRule) {
              this.saleDataAccessRule =
                allData.usrProfileData.saleDataAccessRule; // for access rule check
            }
            if (allData.usrProfileData?.serviceDataAccessRule) {
              this.serviceDataAccessRule =
                allData.usrProfileData.serviceDataAccessRule; // for access rule check
            }

            // outcome array
            if (allData.superUserDetails.followUpOutcome) {
              this.followUpOutcomeArray =
                allData.superUserDetails.followUpOutcome;
            }

            // status array
            if (allData.superUserDetails.followUpStatus) {
              this.followUpStatusArray =
                allData.superUserDetails.followUpStatus;
            }
            // direction array
            if (allData.superUserDetails.followUpDirection) {
              this.directionArray =
                allData.superUserDetails.followUpDirection;
            }

            //customisable field
            if (allData.superUserDetails.followUpSettings) {
              this.followUpSettings = allData.superUserDetails.followUpSettings;
            }
            // net followup additional field
            this.additionalFieldsNextFollowup =
                allData.superUserDetails.customFieldsFollowUp;
            if (
              (this.scenario == 'create' ||
              this.scenario == 'customerSelectFollowUp' ||
              this.scenario == 'create from sale' ||
              this.scenario == 'create from service') && !this.formResetDisable
            ) {
              this.formResetDisable=true;
              //getting additional field
              this.additionalFields =
                allData.superUserDetails.customFieldsFollowUp;
              this.additionalFieldLength = this.additionalFields?.length;
              if (!this.additionalFieldLength) {
                this.additionalFieldLength = 0;
              }
              this.form = this.fb.group({
                callStartDate: [null, Validators.required],
                callStartTime: [null],
                direction: ['Outbound', Validators.required],
                status: [null],
                nextFollowUpDate: [null],
                nextFollowUpTime: [null],
                nextFollowUpNotes: [null],
                outcome: [null],
                notes: [null],
                completedStatus: [false],
                additionalFields: this.fb.array([]),
              });
              this.createItemFormGroupDefault();
              //customisable field validations
              if (this.followUpSettings) {
                // hsn code
                if (this.followUpSettings?.callStartTime?.mandatory === true) {
                  this.form.controls['callStartTime'].setValidators([
                    Validators.required,
                  ]);
                } else {
                  this.form.controls['callStartTime'].clearValidators();
                }
                this.form.controls['callStartTime'].updateValueAndValidity();

                //notes
                if (this.followUpSettings?.notes?.mandatory === true) {
                  this.form.controls['notes'].setValidators([
                    Validators.required,
                  ]);
                } else {
                  this.form.controls['notes'].clearValidators();
                }
                this.form.controls['notes'].updateValueAndValidity();
              }
            }
            if (this.scenario == 'edit' && !this.formResetDisable) {
              
              //getting additional field
              this.additionalFields =
                allData.superUserDetails.customFieldsFollowUp;
              this.additionalFieldLength = this.additionalFields?.length;
              if (!this.additionalFieldLength) {
                this.additionalFieldLength = 0;
              }
              // for edit scenario
              if (this.commonService.followUpDetails) {
                this.assignedTo = this.commonService.followUpDetails.assignedTo;
                this.prevAssignedTo = this.commonService.followUpDetails.assignedTo;
                this.prevAssignedToName = this.commonService.getAssignedToName(this.commonService.followUpDetails.assignedTo);
                this.orgId = this.commonService.followUpDetails.orgId
                  ? this.commonService.followUpDetails.orgId
                  : null;
                this.prevOrgId = this.orgId;
                this.prevOrgName = this.commonService.followUpDetails.companyName ? this.commonService.followUpDetails.companyName : null;
                this.prevCustomerName = this.commonService.followUpDetails.customerName ? this.commonService.followUpDetails.customerName : null;
                this.prevAssBranch = this.commonService.followUpDetails.associatedBranch
                  ? this.commonService.followUpDetails.associatedBranch
                  : '';
                this.changeLog = this.commonService.followUpDetails.changeLog
                  ? this.commonService.followUpDetails.changeLog
                  : {};
                if (this.orgId) {
                  this.companySelected = true;
                }
                this.form = this.fb.group({
                  callStartDate: [
                    this.commonService.followUpDetails.callStartDate?.toDate()
                      ? this.commonService.followUpDetails.callStartDate?.toDate()
                      : null,
                    Validators.required,
                  ],
                  callStartTime: [
                    this.commonService.followUpDetails.callStartTime
                      ? this.commonService.followUpDetails.callStartTime
                      : null,
                  ],
                  direction: [
                    this.commonService.followUpDetails.direction
                      ? this.commonService.followUpDetails.direction
                      : null,
                    Validators.required,
                  ],
                  status: [
                    this.commonService.followUpDetails.status
                      ? this.commonService.followUpDetails.status
                      : '',
                  ],
                  nextFollowUpDate: [null],
                  nextFollowUpNotes: [null],
                  nextFollowUpTime: [null],
                  outcome: [
                    this.commonService.followUpDetails.outcome
                      ? this.commonService.followUpDetails.outcome
                      : '',
                  ],
                  notes: [
                    this.commonService.followUpDetails.notes
                      ? this.commonService.followUpDetails.notes
                      : null,
                  ],
                  completedStatus: [
                    this.commonService.followUpDetails.completedStatus,
                  ],
                  additionalFields: this.fb.array([]),
                });
                //customisable field validation
                if (this.followUpSettings) {
                  // hsn code
                  if (
                    this.followUpSettings?.callStartTime?.mandatory === true
                  ) {
                    this.form.controls['callStartTime'].setValidators([
                      Validators.required,
                    ]);
                  } else {
                    this.form.controls['callStartTime'].clearValidators();
                  }
                  this.form.controls['callStartTime'].updateValueAndValidity();
                  //outcome
                  if (this.followUpSettings?.outcome?.mandatory === true) {
                    this.form.controls['outcome'].setValidators([
                      Validators.required,
                    ]);
                  } else {
                    this.form.controls['outcome'].clearValidators();
                  }
                  this.form.controls['outcome'].updateValueAndValidity();
                  //status
                  if (this.followUpSettings?.status?.mandatory === true) {
                    this.form.controls['status'].setValidators([
                      Validators.required,
                    ]);
                  } else {
                    this.form.controls['status'].clearValidators();
                  }
                  this.form.controls['status'].updateValueAndValidity();
                  //notes
                  if (this.followUpSettings?.notes?.mandatory === true) {
                    this.form.controls['notes'].setValidators([
                      Validators.required,
                    ]);
                  } else {
                    this.form.controls['notes'].clearValidators();
                  }
                  this.form.controls['notes'].updateValueAndValidity();
                }

                this.addFieldsArray =
                  this.commonService.followUpDetails.additionalFieldsArr;
                if (this.commonService.followUpDetails.additionalFieldsArr) {
                  const addFieldsLength = Object.keys(
                    this.addFieldsArray
                  ).length;
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
                this.createItemFormGroupEdit();
                this.contactSelected = true;
                // read from common service
                this.assignedToName = this.commonService.getAssignedToName(this.commonService.followUpDetails.assignedTo);
                this.associatedBranch = this.commonService.followUpDetails
                  .associatedBranch
                  ? this.commonService.followUpDetails.associatedBranch
                  : '';
                this.companyNames =
                  this.commonService.followUpDetails.companyName; //company name
                this.customerNames =
                  this.commonService.followUpDetails.customerName; //custome name
                this.contactNumber =
                  this.commonService.followUpDetails.contactNumber ?  this.commonService.followUpDetails.contactNumber:''; //contactNumber
                this.countryCode =
                  this.commonService.followUpDetails.countryCode ?  this.commonService.followUpDetails.countryCode:''; //countryCode
                if (this.commonService.followUpDetails.saleId) {
                  this.saleId = this.commonService.followUpDetails.saleId;
                  this.prevSaleId = this.commonService.followUpDetails.saleId;
                }

                if (this.commonService.followUpDetails.saleTitle) {
                  this.saleTitle = this.commonService.followUpDetails.saleTitle;
                  this.prevSaleTitle = this.commonService.followUpDetails.saleTitle;
                }
                if (this.commonService.followUpDetails.serviceId) {
                  this.serviceId = this.commonService.followUpDetails.serviceId;
                  this.prevServiceId = this.commonService.followUpDetails.serviceId;
                }
                if (this.commonService.followUpDetails.serviceTitle) {
                  this.serviceTitle =
                    this.commonService.followUpDetails.serviceTitle;
                    this.prevServiceTitle =
                    this.commonService.followUpDetails.serviceTitle;
                }

                if (this.ivrIntegrationEnable) {
                  if (this.commonService.followUpDetails.callDuration) {
                    this.followUpData.callDuration =
                      this.commonService.followUpDetails.callDuration;
                  }
                  if (this.commonService.followUpDetails.callEndTime) {
                    this.followUpData.callEndTime =
                      this.commonService.followUpDetails.callEndTime;
                  }
                  if (this.commonService.followUpDetails.destinationNumber) {
                    this.followUpData.destinationNumber =
                      this.commonService.followUpDetails.destinationNumber;
                  }
                  if (this.commonService.followUpDetails.displayNumber) {
                    this.followUpData.displayNumber =
                      this.commonService.followUpDetails.displayNumber;
                  }
                  if (this.commonService.followUpDetails.sourceNumber) {
                    this.followUpData.sourceNumber =
                      this.commonService.followUpDetails.sourceNumber;
                  }
                  if (this.commonService.followUpDetails.resourceURL) {
                    this.followUpData.resourceURL =
                      this.commonService.followUpDetails.resourceURL;
                  }
                }

                // get old assignee
                if(this.commonService.followUpDetails.assignedTo){
                  this.oldAssignedTo = this.commonService.followUpDetails.assignedTo
                }
                // get old assigned to date
                if(this.commonService.followUpDetails.assignedToDate){
                  this.assignedToDate = this.commonService.followUpDetails.assignedToDate
                }
              } else {
                // if followup details doent exoits n service
                this.db
                  .getFollowUp(this.superUserId, this.followUpId)
                  .pipe(takeUntil(this.onDestroy$))
                  .subscribe((data) => {
                    this.assignedTo = data.assignedTo;
                    this.prevAssignedTo =  data.assignedTo;
                    this.prevAssignedToName = this.commonService.getAssignedToName(data.assignedTo);
                    this.orgId = data.orgId ? data.orgId : null;
                    this.prevOrgId = this.orgId;
                    this.prevOrgName = data.companyName ? data.companyName : null;
                    this.prevCustomerName = data.customerName ? data.customerName : null;
                    this.prevAssBranch = data.associatedBranch
                      ? data.associatedBranch
                      : '';
                    this.changeLog = data.changeLog ? data.changeLog : {};
                    this.form.setValue({
                      callStartDate: data.callStartDate?.toDate()
                        ? data.callStartDate?.toDate()
                        : null,
                      callStartTime: data.callStartTime
                        ? data.callStartTime
                        : null,
                      direction: data.direction ? data.direction : null,
                      status: data.status ? data.status : '',
                      nextFollowUpDate: [null],
                      nextFollowUpNotes: [null],
                      nextFollowUpTime: [null],
                      outcome: data.outcome ? data.outcome : '',
                      notes: data.notes ? data.notes : null,
                      completedStatus: data.completedStatus,
                    });
                    //customisable field validation
                    if (this.followUpSettings) {
                      // hsn code
                      if (
                        this.followUpSettings?.callStartTime?.mandatory === true
                      ) {
                        this.form.controls['callStartTime'].setValidators([
                          Validators.required,
                        ]);
                      } else {
                        this.form.controls['callStartTime'].clearValidators();
                      }
                      this.form.controls[
                        'callStartTime'
                      ].updateValueAndValidity();
                      //outcome
                      if (this.followUpSettings?.outcome?.mandatory === true) {
                        this.form.controls['outcome'].setValidators([
                          Validators.required,
                        ]);
                      } else {
                        this.form.controls['outcome'].clearValidators();
                      }
                      this.form.controls['outcome'].updateValueAndValidity();
                      //status
                      if (this.followUpSettings?.status?.mandatory === true) {
                        this.form.controls['status'].setValidators([
                          Validators.required,
                        ]);
                      } else {
                        this.form.controls['status'].clearValidators();
                      }
                      this.form.controls['status'].updateValueAndValidity();
                      //notes
                      if (this.followUpSettings?.notes?.mandatory === true) {
                        this.form.controls['notes'].setValidators([
                          Validators.required,
                        ]);
                      } else {
                        this.form.controls['notes'].clearValidators();
                      }
                      this.form.controls['notes'].updateValueAndValidity();
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
                    this.createItemFormGroupEdit();
                    this.contactSelected = true;
                    if (this.orgId) {
                      this.companySelected = true;
                    }
                    this.assignedToName = this.commonService.getAssignedToName(data.assignedTo);
                    this.associatedBranch = data.associatedBranch
                      ? data.associatedBranch
                      : '';
                    this.companyNames = data.companyName; //company name
                    this.customerNames = data.customerName; //custome name
                    this.contactNumber = data.contactNumber ? data.contactNumber :''; //contactNumber
                    this.countryCode = data.countryCode ? data.countryCode:''; //countryCode
                    if (data.saleId) {
                      this.saleId = data.saleId;
                      this.prevSaleId = data.saleId;
                    }
                    if (data.saleTitle) {
                      this.saleTitle = data.saleTitle;
                      this.prevSaleTitle = data.saleTitle;
                    }
                    if (data.serviceId) {
                      this.serviceId = data.serviceId;
                      this.prevServiceId = data.serviceId;
                    }
                    if (data.serviceTitle) {
                      this.serviceTitle = data.serviceTitle;
                      this.prevServiceTitle = data.serviceTitle;
                    }

                    if (this.ivrIntegrationEnable) {
                      if (data.callDuration) {
                        this.followUpData.callDuration = data.callDuration;
                      }
                      if (data.callEndTime) {
                        this.followUpData.callEndTime = data.callEndTime;
                      }
                      if (data.destinationNumber) {
                        this.followUpData.destinationNumber =
                          data.destinationNumber;
                      }
                      if (data.displayNumber) {
                        this.followUpData.displayNumber = data.displayNumber;
                      }
                      if (data.sourceNumber) {
                        this.followUpData.sourceNumber = data.sourceNumber;
                      }
                      if (data.resourceURL) {
                        this.followUpData.resourceURL = data.resourceURL;
                      }
                    }
                    // get old assignee
                    if(data.assignedTo){
                      this.oldAssignedTo = data.assignedTo
                    }
                    // get old assigned to date
                    if(data.assignedToDate){
                      this.assignedToDate = data.assignedToDate
                    }
                  });
              }

              this.titleName = 'Update'; // update the title name as Update
            }
            if (this.scenario == 'create from sale') {
              if (this.data) {
                this.saleId = this.data.saleId;
                this.saleTitle = this.data.saleTitle;
              } 
            }
            if (this.scenario == 'create from service') {
              if (this.data) {
                this.serviceId = this.data.serviceId;
                this.serviceTitle = this.data.serviceTitle;
              } 
            }
            if (
              this.scenario == 'create' ||
              this.scenario == 'customerSelectFollowUp' ||
              this.scenario == 'create from sale' ||
              this.scenario == 'create from service' ||
              this.scenario == 'edit'
            ) {
              // if (this.dataAccessRule == 'All') {
              if (this.custId) {
                this.getSaleAndService(
                  this.superUserId,
                  this.userId,
                  this.custId,
                  this.saleDataAccessRule,
                  this.serviceDataAccessRule,
                  'both'
                );
              } else {
                this.isLoaded = true;
              }
            } else {
              this.isLoaded = true;
            }
            if (this.scenario == 'edit' && !this.formResetDisable) {
              this.formResetDisable=true;
              //get initial loaded form for changeLog
              this.previousForm = ChangeLogComponent.cloneAbstractControl(
                this.form
              );
            }
            //find chnageLog length
            this.changeLogLength = Object.keys(this.changeLog).length;

          }
        }
      });
  }
  get additionalField(): FormArray {
    return this.form.get('additionalFields') as FormArray;
  }
  // on close popup / bottom sheet
  onNoClick(): void {
    if (this.data) {
      // forr pop up closing
      this.dialogRef.close('Cancel');
    }
  }

  // on add/update followup task
  onSubmitTask(GAevent) {
    this.disbaleButton = true;
    if (!this.assignedToName) {
      // if assigned to name is not there set it as emoy
      this.assignedToName = '';
    }
    let dateCreated = new Date().getTime(); // get todays date
    if (
      // for add followup
      this.scenario == 'create' ||
      this.scenario == 'customerSelectFollowUp' ||
      this.scenario == 'create from sale' ||
      this.scenario == 'create from service'
    ) {
      // analytics event adding
        this.analytics.logEvent(GAevent);
      //pushing default value in additional field array
      let additionalFields = <addFieldsArr>{};
      let fromArray = this.form.get('additionalFields') as FormArray;
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

      let callStartTimeSplit;
      //spliting the the time for getting hours and minute
      if(this.form.value.callStartTime){
        callStartTimeSplit = this.form.value.callStartTime.split(':');
      }
      // add houres and minute to call start date
      let startDate =  new Date(
        new Date(this.form.value.callStartDate).getFullYear(),
        new Date(this.form.value.callStartDate).getMonth(),
        new Date(this.form.value.callStartDate).getDate(),
        Number(callStartTimeSplit ? callStartTimeSplit[0] : null),
        Number(callStartTimeSplit ? callStartTimeSplit[1] : null)
      );


      let followUpData = {
        // initialize followup data
        assignedTo: this.assignedTo,
        associatedBranch: this.associatedBranch ? this.associatedBranch : '',
        companyName: this.companyNames,
        orgId: this.orgId,
        completedStatus: this.form.value.completedStatus,
        customerId: this.custId,
        customerName: this.customerNames,
        contactNumber: this.contactNumber ? this.contactNumber:'',
        countryCode: this.countryCode ? this.countryCode:'',
        callStartDate: startDate,
        dateCreated: dateCreated,
        notes: this.form.value.notes,
        callStartTime: this.form.value.callStartTime,
        assignedToName: this.assignedToName,
        outcome: this.form.value.outcome,
        status: this.form.value.status,
        direction: this.form.value.direction,
        saleId: this.saleId,
        saleTitle: this.saleTitle,
        serviceId: this.serviceId,
        serviceTitle: this.serviceTitle,
        createdBy: this.userId,
        additionalFieldsArr: additionalFields,
        assignedToDate: new Date().getTime(),
        changeLog: ChangeLogComponent.saveLog(
          'FollowupTaskCreateComponent',
          this.userId,
          this.userName,
          '',
          '',
          {}
        )
      };
      // for next followup
      if(this.form.value.completedStatus){
        let dateValueChanges: boolean = false;
        dateValueChanges = this.onDateChanges(
          this.nextFollowUpDate,
          this.form.value.nextFollowUpDate
        );
        if (dateValueChanges) {
          this.nextFollowupCreate();
        } else {
        }
      }

      //create a new follow up task
      this.db.CreateTasks(this.superUserId, followUpData);
      this._snackBar.open(this.fieldNameFollowup + ' added successfully', '', {
        duration: 2000,
      });
    }
    if (this.scenario == 'edit') {
      //pushing default value in additional field array
      let additionalFields = <addFieldsArr>{};
      let fromArray = this.form.get('additionalFields') as FormArray;
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

      let callStartTimeSplit;
      //spliting the the time for getting hours and minute
      if(this.form.value.callStartTime){
        callStartTimeSplit = this.form.value.callStartTime.split(':');
      }
      // add houres and minute to call start date
      let startDate =  new Date(
        new Date(this.form.value.callStartDate).getFullYear(),
        new Date(this.form.value.callStartDate).getMonth(),
        new Date(this.form.value.callStartDate).getDate(),
        Number(callStartTimeSplit ? callStartTimeSplit[0] : null),
        Number(callStartTimeSplit ? callStartTimeSplit[1] : null)
      );
      // if old assignee is not equal to new assignee update assigned to date
      if(this.oldAssignedTo != this.assignedTo){
        this.assignedToDate = new Date().getTime()
      }
      let followUpData = {
        // initialize followup data
        assignedTo: this.assignedTo,
        associatedBranch: this.associatedBranch ? this.associatedBranch : '',
        companyName: this.companyNames,
        orgId: this.orgId,
        completedStatus: this.form.value.completedStatus,
        customerId: this.custId,
        customerName: this.customerNames,
        contactNumber: this.contactNumber ? this.contactNumber:'',
        countryCode: this.countryCode ? this.countryCode:'',
        callStartDate: startDate,
        notes: this.form.value.notes,
        callStartTime: this.form.value.callStartTime,
        assignedToName: this.assignedToName,
        outcome: this.form.value.outcome,
        status: this.form.value.status,
        direction: this.form.value.direction,
        saleId: this.saleId,
        saleTitle: this.saleTitle,
        serviceId: this.serviceId,
        serviceTitle: this.serviceTitle,
        createdBy: this.userId,
        additionalFieldsArr: additionalFields,
        assignedToDate:this.assignedToDate
      };

      let additionalData = {
        curAssignedTo: {
          assignedTo:
            this.prevAssignedTo != this.assignedTo
              ? this.assignedTo
              : null,
          assignedToName:
          this.prevAssignedToName != this.assignedToName
              ? this.assignedToName
              : null,
        },
        prevAssignedTo: {
          assignedTo: this.prevAssignedTo,
          assignedToName: this.prevAssignedToName,
        },
        //associated branch to changelog
        ...(this.branches.length > 0 && {
          currentAssBranch:
            this.branches.length > 0
              ? this.branches.find((item) => item.id === this.associatedBranch)
                  ?.name
              : '',
        }),
        ...(this.branches.length > 0 && {
          previousAssBranch:
            this.branches.length > 0
              ? this.branches.find((item) => item.id === this.prevAssBranch)?.name
                ? this.branches.find((item) => item.id === this.prevAssBranch)
                    ?.name
                : 'None'
              : '',
        }),
        //Add organisation changes to changeLog
        currentOrgId: {
          //current values
          orgId: this.orgId,
          companyName: this.companyNames,
        },
        prevOrgId: {
          //previous values
          orgId: this.prevOrgId,
          companyName: this.prevOrgName,
        },
        //add contact name change to changelog
        currentContact: {
          //current value
          selectedCust: this.customerNames ? this.customerNames : null,
        },
        prevContact: {
          //previous value
          selectedCust: this.prevCustomerName ? this.prevCustomerName : null,
        },
      };
      this.prevSaleId = this.prevSaleId ? this.prevSaleId : null;
      this.prevServiceId = this.prevServiceId ? this.prevServiceId : null;
      //To add sale title to changelog
      if(this.saleId != this.prevSaleId){
        this.previousForm.addControl('saleTitle', new FormControl(this.prevSaleTitle, Validators.required));
        this.form.addControl('saleTitle', new FormControl(this.saleTitle, Validators.required));
        if(this.prevSaleTitle != this.saleTitle){
          this.form.get('saleTitle').markAsDirty();
        }
      }

      //To add service title to changelog
      if(this.serviceId != this.prevServiceId){
        this.previousForm.addControl('serviceTitle', new FormControl(this.prevServiceTitle, Validators.required));
        this.form.addControl('serviceTitle', new FormControl(this.serviceTitle, Validators.required));
        if(this.prevServiceTitle != this.serviceTitle){
          this.form.get('serviceTitle').markAsDirty();
        }
      }

      //changeLog for task popup
      let newChangeLog = ChangeLogComponent.saveLogReactiveForm(
        'FollowupTaskCreateComponent',
        this.userId,
        this.userName,
        this.previousForm,
        this.form,
        this.changeLog,
        additionalData
      );
      if(newChangeLog == null){
        newChangeLog = this.changeLog;
      }

     // for next followup
     if(this.form.value.completedStatus){
      let dateValueChanges: boolean = false;
      dateValueChanges = this.onDateChanges(
        this.nextFollowUpDate,
        this.form.value.nextFollowUpDate
      );
      if (dateValueChanges) {
        this.nextFollowupCreate();
      } else {
      }
    }
    this.db
        .UpdateTask(this.superUserId, followUpData, this.followUpId, newChangeLog)
        .then(() => {
          this._snackBar.open(
            this.fieldNameFollowup + ' updated successfully',
            '',
            {
              duration: 2000,
            }
          );
        });
    }
    if (this.data) {
      // for popup close
      this.dialogRef.close('Update');
    }
  }
  onDateChanges(oldValue: any, newVale: any) {
    if (oldValue?.getTime() != newVale?.getTime()) {
      return true;
    }
    return false;
  }
  @HostListener('window:beforeunload')
  // on destroy
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // set company name to individual if its N/A, for old contacts
  companycheck(company: string) {
    if (company == 'N/A') {
      return 'Individual';
    } else if (company != 'N/A') {
      return company;
    }
  }
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }

  // filter sales list
  private _filterSales(name: string): Sales[] {
    const filterValue = name.toLowerCase();
    return this.sales.filter(
      (option) => option.saleTitle.toLowerCase().indexOf(filterValue) === 0
    );
  }
  // filter sales service
  private _filterServices(name: string): Service[] {
    const filterValue = name.toLowerCase();
    return this.services.filter(
      (option) => option.serviceTitle.toLowerCase().indexOf(filterValue) === 0
    );
  }
  // set details of selected sale
  selectSale(selectedSale) {
    let insales = this.checkinSales(selectedSale); // check if customer selected or nor
    if (insales) {
      // if sales selected
      this.saleTitle = selectedSale.saleTitle;
      this.saleId = selectedSale.id;
    }
  }
  // set details of selected service
  selectService(selectedService) {
    let inservice = this.checkinServices(selectedService); // check if customer selected or nor
    if (inservice) {
      // if sales selected
      this.serviceTitle = selectedService.serviceTitle;
      this.serviceId = selectedService.id;
    }
  }
  // check whether the sale is selcted or not
  checkinSales(selectedSale) {
    if (selectedSale) return !!this.sales.includes(selectedSale);
  }
  // check whether the service is selcted or not
  checkinServices(selectedService) {
    if (selectedService) return !!this.services.includes(selectedService);
  }
  // display sale selected
  displaySale(sale: Sales): string {
    return sale && sale.saleTitle;
  }
  // display sale selected
  displayService(sevice: Service): string {
    return sevice && sevice.serviceTitle;
  }
  // remove selected contact
  onClearContact() {
    this.custId = null;
    // this.companyNames = null;
    this.customerNames = null;
    this.contactNumber = '';
    this.countryCode = '';
    this.saleId = null;
    this.saleTitle = null;
    this.serviceId = null;
    this.serviceTitle = null;
    this.contactSelected = false;
    // this.customerControl.reset();
    this.saleControl.reset();
    this.serviceControl.reset();
    if (!this.contactLoaded) {
      if (this.custId) {
        this.getSaleAndService(
          this.superUserId,
          this.userId,
          this.custId,
          this.saleDataAccessRule,
          this.serviceDataAccessRule,
          'both'
        );
      } else {
        this.isLoaded = true;
      }
      this.contactLoaded = true;
    }
  }
   // remove selected company
  onClearCompany() {
    this.orgId = null;
    this.companyNames = null;
    this.companySelected = false;
  }
   // remove selected sale
  onClearSale() {
    this.saleId = null;
    this.saleTitle = null;
    this.saleControl.reset();
    if (this.custId) {
      this.getSaleAndService(
        this.superUserId,
        this.userId,
        this.custId,
        this.saleDataAccessRule,
        this.serviceDataAccessRule,
        'sale'
      );
    }
  }
   // remove selected service
  onClearService() {
    this.serviceId = null;
    this.serviceTitle = null;
    this.serviceControl.reset();
    if (this.custId) {
      this.getSaleAndService(
        this.superUserId,
        this.userId,
        this.custId,
        this.saleDataAccessRule,
        this.serviceDataAccessRule,
        'service'
      );
    }
  }
  //create next followup
  nextFollowupCreate() {
    let additionalFieldsArr: any[] = [];
    additionalFieldsArr = this.createAddFieldForNextFollwup(
      this.additionalFieldsNextFollowup
    );
    let callStartTimeSplit;
    //spliting the the time for getting hours and minute
    if (this.form.value.nextFollowUpTime) {
      callStartTimeSplit = this.form.value.nextFollowUpTime.split(':');
    }
    // add houres and minute to call start date
    let startDate = new Date(
      new Date(this.form.value.nextFollowUpDate).getFullYear(),
      new Date(this.form.value.nextFollowUpDate).getMonth(),
      new Date(this.form.value.nextFollowUpDate).getDate(),
      Number(callStartTimeSplit ? callStartTimeSplit[0] : null),
      Number(callStartTimeSplit ? callStartTimeSplit[1] : null)
    );

    let followUpData = {
      assignedTo: this.assignedTo,
      associatedBranch: this.associatedBranch ? this.associatedBranch : '',
      companyName: this.companyNames,
      orgId: this.orgId,
      completedStatus: false,
      customerId: this.custId,
      customerName: this.customerNames,
      contactNumber: this.contactNumber ? this.contactNumber:'',
      countryCode: this.countryCode ? this.countryCode:'',
      callStartDate: startDate,
      dateCreated: new Date().getTime(),
      notes: this.form.value.nextFollowUpNotes,
      callStartTime: this.form.value.nextFollowUpTime,
      assignedToName: this.assignedToName,
      outcome: null,
      status: null,
      direction: 'Outbound',
      createdBy: this.userId,
      saleId: this.saleId,
      saleTitle: this.saleTitle,
      serviceId: this.serviceId,
      serviceTitle: this.serviceTitle,
      additionalFieldsArr: additionalFieldsArr,
      assignedToDate: new Date().getTime(),
      changeLog: ChangeLogComponent.saveLog(
        this.constructor.name,
        this.userId,
        this.userName,
        '',
        '',
        {}
      )

    };
    //create a next follow up task
    this.db.CreateNextFollowupTasks(this.superUserId, followUpData);
    this._snackBar.open(
      'Next ' + this.fieldNameFollowup + ' added successfully',
      '',
      {
        duration: 2000,
      }
    );
  }
  createItemFormGroupDefault() {
    //push additional fields data to FormArray
    this.additionalFields?.forEach((field) => {
      if (field.fieldType == 'date') {
        if (field.mandatory == true) {
          (this.form.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [
                field.defaultValue ? field.defaultValue.toDate() : '',
                Validators.required,
              ],
              fieldName: field.fieldName,
            })
          );
        } else if (field.mandatory == false) {
          (this.form.get('additionalFields') as FormArray).push(
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
          (this.form.get('additionalFields') as FormArray).push(
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
          (this.form.get('additionalFields') as FormArray).push(
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
          (this.form.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.defaultValue, Validators.required],
              fieldName: field.fieldName,
            })
          );
        } else if (field.mandatory == false) {
          (this.form.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.defaultValue],
              fieldName: field.fieldName,
            })
          );
        }
      }
    });
  }
  createItemFormGroupEdit() {
    //push additional fields data to FormArray
    this.additionalFields?.forEach((field) => {
      if (field.fieldType == 'date') {
        if (field.mandatory == true) {
          (this.form.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [
                field.value ? field.value.toDate() : '',
                Validators.required,
              ],

              fieldName: field.fieldName,
            })
          );
        } else if (field.mandatory == false) {
          (this.form.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.value ? field.value.toDate() : ''],
              fieldName: field.fieldName,
            })
          );
        }
      } else if (field.fieldType == 'date_time') {
        if (field.mandatory == true) {
          (this.form.get('additionalFields') as FormArray).push(
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
          (this.form.get('additionalFields') as FormArray).push(
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

      } else {
        if (field.mandatory == true) {
          (this.form.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.value, Validators.required],
              fieldName: field.fieldName,
            })
          );
        } else if (field.mandatory == false) {
          (this.form.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.value],
              fieldName: field.fieldName,
            })
          );
        }
      }
    });
  }
  createAddFieldForNextFollwup(additionalFieldsNextFollowup) {
    let additionalFieldsArr: any[] = [];
    additionalFieldsNextFollowup?.forEach((field, i) => {
      if (field.fieldType == 'date') {
        additionalFieldsArr[i] = {
          fieldValue: field.defaultValue ? field.defaultValue.toDate() : '',
        };
      } else if (field.fieldType == 'date_time') {
        additionalFieldsArr[i] = {
          fieldValue: field.defaultValue ? field.defaultValue.toDate() : '',
        };
      } else {
        additionalFieldsArr[i] = { fieldValue: field.defaultValue };
      }
    });
    return additionalFieldsArr;
  }
  assignedToEventHander($event: any) {
    this.assignedTo = $event;
    if (
      this.assignedTo &&
      this.branches?.length > 0 &&
      this.plan == 'diamond'
    ) {
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
    this.assignedToName = $event;
  }
  branchIdEventHandler($event: any) {
    this.associatedBranch = $event;
  }
  onNextFollowupClicked() {
    this.nextFollowupClicked = !this.nextFollowupClicked;
    this.form.patchValue({ nextFollowUpDate: null });
    this.form.patchValue({ nextFollowUpTime: null });
    this.form.patchValue({ nextFollowUpNotes: null });
  }
  //triggered while a cusomer is selected form auto complete
  orgIdEventHander($event) {
    if ($event) {
      this.orgId = $event;
      if (this.orgId) {
        this.companySelected = true;
      }
    }
  }
  orgNameEventHander($event) {
    if ($event) {
      this.companyNames = $event;
    }
  }
  contSelectedEventHander(selectedCust: any) {
    // if customer selected
    this.custId = selectedCust?.id; // customer id
    if (this.custId) {
      this.contactSelected = true;
    }
    if (selectedCust?.secondName && selectedCust?.surname) {
      // if second name & surname is there
      this.customerNames =
        selectedCust?.firstName +
        ' ' +
        selectedCust?.secondName +
        ' ' +
        selectedCust?.surname;
    } else if (selectedCust?.secondName && !selectedCust?.surname) {
      this.customerNames =
        selectedCust?.firstName + ' ' + selectedCust?.secondName;
    } else if (!selectedCust?.secondName && selectedCust?.surname) {
      this.customerNames =
        selectedCust?.firstName + ' ' + selectedCust?.surname;
    } else {
      this.customerNames = selectedCust?.firstName;
    }
    this.contactNumber = selectedCust.contactNo ? selectedCust.contactNo:'';
    this.countryCode = selectedCust.code ? selectedCust.code:'';
    if (selectedCust.orgId) {
      this.orgId = selectedCust.orgId;
      this.companyNames = selectedCust.companyName
        ? selectedCust.companyName
        : null;
      this.companySelected = true;
    }
    this.saleId = null;
    this.saleTitle = null;
    this.serviceId = null;
    this.serviceTitle = null;
    this.saleControl.reset();
    this.serviceControl.reset();
    if (this.custId) {
      this.getSaleAndService(
        this.superUserId,
        this.userId,
        this.custId,
        this.saleDataAccessRule,
        this.serviceDataAccessRule,
        'both'
      );
    }
  }
  async getSaleAndService(
    superUserId,
    userId,
    custId,
    saleDataAccessRule,
    serviceDataAccessRule,
    read
  ) {
    if (read == 'both') {
      await this.getSales(superUserId, userId, saleDataAccessRule, custId);
      await this.getService(superUserId, userId, serviceDataAccessRule, custId);
    } else if (read == 'sale') {
      await this.getSales(superUserId, userId, saleDataAccessRule, custId);
    } else if (read == 'service') {
      await this.getService(superUserId, userId, serviceDataAccessRule, custId);
    }
    this.isLoaded = true;
  }
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
  async getService(superUserId, userId, serviceDataAccessRule, custId) {
    let queryIdService: string[] = [];
    if (serviceDataAccessRule == 'Own') {
      queryIdService = [userId];
    } else if (serviceDataAccessRule === 'Team') {
      this.subUsers.forEach((element) => {
        if (element.reportsToId === userId) {
          queryIdService.push(element.userId);
        }
      });
      queryIdService.push(userId);
    } else if (serviceDataAccessRule === 'Branch') {
      const branchId = this.subUsers.find(
        (item) => item.userId === userId
      )?.branchId;
      if (branchId) {
        queryIdService.push(branchId);
      } else {
        if (userId == this.superUserId) {
          queryIdService.push(this.superUserBranchId);
        } else {
          queryIdService.push('n/a');
        }
      }
    }
    await this.getAllServices(
      superUserId,
      queryIdService,
      serviceDataAccessRule,
      custId
    );
  }
  getAllSales(superUserId, queryId: string[], saleDataAccessRule, custId) {
    return new Promise<void>(async (resolve) => {
      (await this.db.getSales(superUserId, queryId, saleDataAccessRule, custId))
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.sales = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Sales;
          });
          // filter sales
          this.filteredSales = this.saleControl.valueChanges.pipe(
            startWith(''),
            map((value) =>
              typeof value === 'string' ? value : value?.saleTitle
            ),
            map((saleTitle) =>
              saleTitle ? this._filterSales(saleTitle) : this.sales.slice()
            )
          );
          resolve();
        });
    });
  }
  getAllServices(superUserId, queryId, serviceDataAccessRule, custId) {
    return new Promise<void>(async (resolve) => {
      (
        await this.db.getServices(
          superUserId,
          queryId,
          serviceDataAccessRule,
          custId
        )
      )
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.services = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Service;
          });
          // filter services
          this.filteredService = this.serviceControl.valueChanges.pipe(
            startWith(''),
            map((value) =>
              typeof value === 'string' ? value : value?.serviceTitle
            ),
            map((serviceTitle) =>
              serviceTitle
                ? this._filterServices(serviceTitle)
                : this.services.slice()
            )
          );
          resolve();
        });
    });
  }
  // go to organization details page
  onViewOrg() {
    let link: string = 'dash/organisation/orgdetails/' + this.orgId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }

  // go to customer details page
  onViewCustomer() {
    let link: string = 'dash/contact/customerdetails/' + this.custId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }
 // go to sale details page
  onViewSale() {
    let link: string = 'dash/sales/saleview/' + this.saleId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }
 // go to support details page
  onViewSupport() {
    let link: string = 'dash/service/service-details/' + this.serviceId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }
}
