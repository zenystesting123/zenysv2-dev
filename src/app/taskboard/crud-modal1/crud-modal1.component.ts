/*********************************************************************************
Description: component used for adding/editing task
Inputs: task bottomsheet data and popup data
Outputs:
***********************************************************************************/

import {
  defaultTaskSettings,
  Sales,
  Service,
  taskSettings,
  addFieldsArr,
  Profile,
  customFields,
  Task,
  PlanDocLimit,
  Attachments,
} from './../../data-models';
import { DialogData01 } from '../../contact/customerview/customerview.component';
import { CrudModal1Service } from './crud-modal1.service';
import {
  Component,
  OnInit,
  Inject,
  Optional,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { finalize, map, startWith, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TaskboardComponent } from '../taskboard.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { CommonService } from 'src/app/common.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { AppCustomDirective } from 'src/app/app.validators';
@Component({
  selector: 'app-crud-modal1',
  templateUrl: './crud-modal1.component.html',
  styleUrls: ['./crud-modal1.component.scss'],
  animations: [
    trigger('FlyIn', [
      transition('void=>*', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate('100ms'),
      ]),
      transition('*=>void', [
        animate('100ms', style({ opacity: 0, transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
})
export class CrudModal1Component implements OnInit, OnDestroy {
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  superUserDetails: Profile; //to store superuser's details from commonservice file
  superUserId: string; //to store the id of superuser
  superUserName: string; //to store the full name of superuser
  superFirstName: string; //to store the first name of superuser
  superSecondName: string; //to store the second name of superuser
  userId: string; //to store the id of current user
  userName: string; //to store the full name of current user
  firstName: string; //to store the first name of current user
  secondName: string; //to store the second name of current user
  subUsers: any[]; //to store list of subusers
  allSubUsers: any[] = []; //to include superuser along with subusers to display in dropdown
  dataAccessRule: string; //to store current user's data access rule
  saleDataAccessRule: string = 'Own'; // data access rule for sale
  serviceDataAccessRule: string = 'Own'; // data access rule for service
  plan = ''; //to store current user's subscription plan
  branches = []; //to store list of branches
  associatedBranch = ''; // to store current associated branch
  prevAssBranch = ''; //to store last saved associated branch to save in changeLog
  superUserBranchId: string = 'n/a';
  assignedTo: string; //to store assigned to Id
  assignedToName: string; //to store assigned to name
  //used as a data type reference for customFieldsTask object stored under superuser
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
  //data model for additionalfields array stored in each task record
  addFieldArrModel: addFieldsArr = {
    fieldValue: null,
  };
  //additionalFieldLength: number; //to store length of customFieldsTask object
  additionalFields = [this.additionalFieldModel]; //to store customFieldsTask data and value from each task together to display in form
  addFieldsArray = [this.addFieldArrModel]; //to store additional fields in each task
  activeFieldsLength: number = 0; //get no of active additional fields
  //get task customisation fields from data model
  taskSettings: taskSettings = defaultTaskSettings.CONST_VALUE;
  fieldNameTask: string = 'Task'; //to store custom field name of task module
  fieldNameContact: string = 'Contact'; //to store custom field name of contact module
  fieldNameOrganization = 'Organization'; //to store custom field name of organization module
  fieldNameSale: string = 'Sale'; //to store custom field name of sales module
  fieldNameService: string = 'Service'; //to store custom field name of services module
  customerId: string = null; //to store selected customers id
  customersFirstName: string = null; //to store selected customers firstname
  customersSecondName: string = null; //to store selected customers secondname
  customersSurname: string = null; //to store selected customers secondname
  customerName: any; //to store customer's full name
  customersCompany: string = null; //to store selected customers company
  submitted: boolean = false; //to check form is submitted or not
  filteredOptionsSale: Observable<Sales[]>; //observable to store sales in auto complete
  filteredOptionsService: Observable<Service[]>; //observable to store sales in auto complete
  salesList: Sales[] = []; //to store sales list after selecting customer
  servicesList: Service[] = []; //to store sales list after selecting customer
  salesDetails: any = null; //for storing selected sales details
  servicesDetails: any = null; //for storing selected services details
  salesTitle: any = null; //to store sale title
  salesId: any = null; //to store sale id
  servicesTitle: any = null; //to store sale title
  servicesId: any = null; //to store sale id
  taskDetails: Task; //to store tasks details
  defaultPriority: string = 'MEDIUM'; //for binding default priority
  dueDate: any; //to store due date of task
  prevStatus: any; //to store previous sale status
  prevSaleId: any; //to store previous sale id
  prevSaleTitle: any; //to store previous sale title
  prevServiceId: any; //to store previous sale id
  prevServiceTitle: any; //to store previous sale title
  commentsTask = []; //to store comments of task while updating
  commentTask: string; //variable to store newly added comment
  commentId: string; //to store comments id
  networkConnection: boolean; //to check network connnectivity
  disableReAssign = false; //disable assign to
  removable: boolean = true; //to remove selected chip
  userForm: FormGroup; //current formgroup to store form data
  previousForm: FormGroup; //stores the form data before making any changes to use in changelog
  changeLog: any = {}; //stores existing changelog array from db
  addedComments: any[] = []; // stores newly added comments
  deletedComments: any[] = []; //stores deleted comments
  updatedComments: any = {}; //stores changed comments
  prevComments: any = {}; //stores previous comments
  prevComment: any; //last prev comment
  comlen: number; //stores the length of comments
  orgId = null; //organisation id
  attachmentSize: any;
  totalUserCount: number = 1;
  currentlyUploaded: number;
  totalUploadLimit: number;
  uploadFileLimit: any = [];
  uploadPercentage: number;
  tasksId: string;
  attachments: any[] = [];
  taskReset: boolean = true; // prevents subscription from resetting form and saved data on adding or removing attachments
  formReset: boolean = true; //prevents subscription from resetting form data
  daTime: any;
  uploadedFiles: any[] = [];
  fileID: number = 1;
  fileUploading: boolean = false;
  uploadProgress$: Observable<any>; //to display upload progress of attachment
  snapshot: Observable<any>; //to upload attachment
  downloadUrl: any;
  progress: any = null;
  uploadCompleted: boolean;
  contactSelected: boolean = false;
  companySelected: boolean = false;
  prevOrgId: string;
  prevCustomersCompany: string;
  previousCustomerName: any; // to store previous value of customer's fullname
  taskStatusOpn: any[];
  taskDefaultOption: any = ['Open', 'Completed'];
  @ViewChild('file') file;
  oldAssignedTo: string; // old assigne
  assignedToDate: number = null; // old assigned to date
  initialStatus: string;

  //custom pipe to implement sorting of data wrt date modified in changeLog
  propName = 'dateModified'; //property for sorting
  customsort = (a, b) => {
    //returns the greater date first
    return Number(b.value[this.propName]) - Number(a.value[this.propName]);
  };

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private analytics: AngularFireAnalytics,
    public commonService: CommonService,
    public db: CrudModal1Service,
    private snack: MatSnackBar,
    private storage: AngularFireStorage,
    public networkCheck: NetworkCheckService,
    public fb: FormBuilder,
    private route: ActivatedRoute,

    @Optional() public dialogRef: MatDialogRef<TaskboardComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public datas: DialogData01,
    @Optional() @Inject(MAT_DIALOG_DATA) public data
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
    this.uploadFileLimit = PlanDocLimit.sizeLimit;
    //getting userdata through common service file
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(async (allData) => {
        if (allData) {
          //getting superuser details
          this.superUserDetails = allData.superUserDetails;
          this.superUserId = allData.userDetails.superUserId;
          this.superUserName = allData.superUserDetails.lastname
            ? allData.superUserDetails.firstname +
              ' ' +
              allData.superUserDetails.lastname
            : allData.superUserDetails.firstname;
          this.superFirstName = allData.superUserDetails.firstname;
          this.superSecondName = allData.superUserDetails.lastname;

          this.taskStatusOpn = allData.superUserDetails.taskStatusOpn
            ? allData.superUserDetails.taskStatusOpn
            : this.taskDefaultOption;

          //getting current user details
          this.userId = allData.authDetails.uid;
          this.userName = allData.userDetails.lastname
            ? allData.userDetails.firstname + ' ' + allData.userDetails.lastname
            : allData.userDetails.firstname;
          this.firstName = allData.userDetails.firstname;
          this.secondName = allData.userDetails.lastname;

          //getting subUser details
          this.subUsers = allData.subUsers;
          this.allSubUsers = this.createUserlist();

          //getting the data access rule for current user
          // for access rule check for sale
          if (allData.usrProfileData?.saleDataAccessRule) {
            this.saleDataAccessRule = allData.usrProfileData.saleDataAccessRule;
          }
          // for access rule check for service
          if (allData.usrProfileData?.serviceDataAccessRule) {
            this.serviceDataAccessRule =
              allData.usrProfileData.serviceDataAccessRule;
          }
          //getting the current user's subscribed plan
          this.plan = allData.superUserDetails.plan;
          //get branches
          this.branches = allData.branches;
          //get superUser's associated branch
          if (allData.superUserDetails.associatedBranch) {
            this.superUserBranchId = allData.superUserDetails.associatedBranch;
          }
          //find the associated branch for newly created tasks
          if (this.datas?.mode != 'update' && this.taskReset) {
            //find the branch of current user
            for (let i = 0; i < this.allSubUsers.length; i++) {
              //find the current user in subuserlist
              if (this.userId === this.allSubUsers[i].userId) {
                //if branch available for the user
                if (this.allSubUsers[i].branchId) {
                  //associated branch is current user's branch
                  this.associatedBranch = this.allSubUsers[i].branchId;
                } else {
                  //if no branch available
                  this.associatedBranch = 'NA';
                }
              }
            }
          }

          //assigning default assigned to as current user for creating task
          if (this.taskReset) {
            //Assigned to person is the current user who creates the task
            this.assignedTo = this.userId;
            this.assignedToName = this.userName;
          }
          //get total attachment size from db
          this.attachmentSize = this.superUserDetails.totalAttachmentsSize;
          if (!this.attachmentSize) {
            this.attachmentSize = 0;
          }
          this.totalUserCount = allData.superUserDetails.noSubusers + 1;
          this.currentlyUploaded =
            allData.superUserDetails.totalAttachmentsSize;

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

          //getting field customisation data and check if all fields added in data model are available in db through common service file
          if (
            allData.superUserDetails.taskSettings &&
            typeof allData.superUserDetails.taskSettings !== 'undefined' &&
            allData.superUserDetails.taskSettings !== null
          ) {
            this.taskSettings = allData.superUserDetails.taskSettings;
            if (allData.superUserDetails.taskSettings) {
              this.commonService.checkCustomField(
                defaultTaskSettings.CONST_VALUE,
                allData.superUserDetails.taskSettings
              );
            }
          }
          //getting all the customisable fieldnames
          if (allData.superUserDetails.fieldNames) {
            //getting custom name for customer, task and sales
            this.fieldNameTask =
              allData.superUserDetails.fieldNames.fieldNameTask;
            this.fieldNameContact =
              allData.superUserDetails.fieldNames.fieldNameContact;
            this.fieldNameOrganization = allData.superUserDetails?.fieldNames
              ?.fieldNameOrganization
              ? allData.superUserDetails?.fieldNames?.fieldNameOrganization
              : 'Organization';
            this.fieldNameSale =
              allData.superUserDetails.fieldNames.fieldNameSale;
            this.fieldNameService =
              allData.superUserDetails.fieldNames.fieldNameService;
          }
          if (this.taskReset) {
            //Create popup
            if (this.datas?.mode == 'create' && this.formReset) {
              this.formReset = false;

              //getting additional fields
              this.additionalFields = allData.superUserDetails.customFieldsTask;

              //find the no of active additionals fields
              this.additionalFields?.forEach((field) => {
                if (field.isActive) {
                  this.activeFieldsLength = this.activeFieldsLength + 1;
                }
              });

              //populate userform for create mode
              this.userForm = this.fb.group({
                title: [
                  null,
                  [
                    Validators.required,
                    Validators.maxLength(100),
                    AppCustomDirective.whiteSpaceOnly,
                  ],
                ],
                description: [null],
                salesDetails: [null],
                servicesDetails: [null],
                priority: [this.defaultPriority],
                dueDate: [null],
                additionalFields: this.fb.array([]),
              });
              //update validators based on field customisation
              this.updateValidators();
              //push additional fields to form array
              this.addAdditionalFieldsFormControls();
            }

            //Update popup
            if (this.datas?.mode == 'update' && this.formReset) {
              //getting existing data from common service file to bind in the form fields
              this.taskDetails = this.commonService.getTaskToEdit();
              if (this.taskDetails) {
                //existing data for the current task from db
                this.tasksId = this.datas.id;
                this.customerId = this.taskDetails?.customerId;
                //getting additional fields
                this.additionalFields =
                  allData.superUserDetails.customFieldsTask;

                //find the no of active additionals fields
                this.additionalFields?.forEach((field) => {
                  if (field.isActive) {
                    this.activeFieldsLength = this.activeFieldsLength + 1;
                  }
                });
                //store customer's fullname
                if (
                  this.taskDetails?.name &&
                  this.taskDetails?.lastName &&
                  this.taskDetails?.surname
                ) {
                  this.customerName =
                    this.taskDetails?.name +
                    ' ' +
                    this.taskDetails.lastName +
                    ' ' +
                    this.taskDetails?.surname;
                } else if (
                  this.taskDetails?.name &&
                  this.taskDetails?.lastName &&
                  !this.taskDetails?.surname
                ) {
                  this.customerName =
                    this.taskDetails?.name + ' ' + this.taskDetails.lastName;
                } else if (
                  this.taskDetails?.name &&
                  !this.taskDetails?.lastName &&
                  this.taskDetails?.surname
                ) {
                  this.customerName =
                    this.taskDetails?.name + ' ' + this.taskDetails.surname;
                } else {
                  this.customerName = this.taskDetails?.name
                    ? this.taskDetails?.name
                    : null;
                }
                //to store previous customers name
                this.previousCustomerName = this.customerName
                  ? this.customerName
                  : null;
                this.customersFirstName = this.taskDetails?.name
                  ? this.taskDetails?.name
                  : null;
                this.customersSecondName = this.taskDetails?.lastName
                  ? this.taskDetails?.lastName
                  : null;
                this.customersSurname = this.taskDetails?.surname
                  ? this.taskDetails?.surname
                  : null;
                this.customersCompany = this.taskDetails?.company;
                this.prevCustomersCompany = this.taskDetails?.company;
                this.orgId = this.taskDetails?.orgId
                  ? this.taskDetails?.orgId
                  : null;
                this.prevOrgId = this.taskDetails?.orgId
                  ? this.taskDetails?.orgId
                  : null;

                this.dueDate = this.taskDetails?.dueDate?.toDate();
                this.prevStatus = this.taskDetails?.status;
                this.assignedTo = this.taskDetails?.assignedTo;
                this.assignedToName = this.commonService.getAssignedToName(
                  this.taskDetails?.assignedTo
                );
                // get old assigned to date
                if (this.taskDetails?.assignedToDate) {
                  this.assignedToDate = this.taskDetails?.assignedToDate;
                }
                // get old assignee
                if (this.taskDetails?.assignedTo) {
                  this.oldAssignedTo = this.taskDetails?.assignedTo;
                }
                this.associatedBranch = this.taskDetails?.associatedBranch
                  ? this.taskDetails?.associatedBranch
                  : '';
                this.prevAssBranch = this.taskDetails?.associatedBranch
                  ? this.taskDetails?.associatedBranch
                  : '';
                this.prevSaleId = this.taskDetails?.saleId;
                this.prevSaleTitle = this.taskDetails?.saleTitle;
                this.salesId = this.taskDetails?.saleId
                  ? this.taskDetails?.saleId
                  : null;
                this.salesTitle = this.taskDetails?.saleTitle
                  ? this.taskDetails?.saleTitle
                  : null;

                this.prevServiceId = this.taskDetails?.serviceId;
                this.prevServiceTitle = this.taskDetails?.serviceTitle;
                this.servicesId = this.taskDetails?.serviceId
                  ? this.taskDetails?.serviceId
                  : null;
                this.servicesTitle = this.taskDetails?.serviceTitle
                  ? this.taskDetails?.serviceTitle
                  : null;

                this.changeLog = this.taskDetails?.changeLog
                  ? this.taskDetails?.changeLog
                  : {};
                // this.taskStatus = this.taskDetails?.taskStatus?this.taskDetails?.taskStatus?
                if (this.taskDetails.status) {
                  if (!this.taskStatusOpn.includes(this.taskDetails.status)) {
                    this.taskDetails.status = null;
                  }
                }

                //disable reassign only in update mode. User should be able to re-assign in create mode - as per requirement @MK 28/09/2022
                if (
                  allData.usrProfileData.isCheckedTask === false ||
                  allData.usrProfileData.taskReAssign === false
                ) {
                  this.disableReAssign = true;
                }

                //getting additional fields data from db
                this.addFieldsArray = this.taskDetails?.additionalFieldsArr;
                //add the additional fields value to additionalFields object to display in popup
                if (this.taskDetails?.additionalFieldsArr) {
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

                //initialising form for update mode
                this.userForm = this.fb.group({
                  title: [
                    this.taskDetails.title,
                    [
                      Validators.required,
                      Validators.maxLength(100),
                      AppCustomDirective.whiteSpaceOnly,
                    ],
                  ],
                  description: [this.taskDetails.description],
                  salesDetails: [null],
                  servicesDetails: [null],
                  priority: [this.taskDetails.priority],
                  status: [this.taskDetails.status],
                  dueDate: [this.taskDetails.dueDate?.toDate()],
                  commentTask: [''],
                  additionalFields: this.fb.array([]),
                  comments: this.fb.array([]),
                });
                //update validators based on field customisation
                this.updateValidators();

                //push additional fields data to FormArray
                this.additionalFields?.forEach((field) => {
                  //if fieldValue is date, change timestamp to date format
                  if (field.fieldType == 'date') {
                    //Add validator if field is mandatory
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
                    }
                    //Remove validator if field is not mandatory
                    else if (field.mandatory == false) {
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
                          fieldValue: [
                            field.value ? field.value.toDate() : null,
                          ],
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
                    //if fieldValue is not a date
                    //Add validator if field is mandatory
                    if (field.mandatory == true) {
                      (this.userForm.get('additionalFields') as FormArray).push(
                        this.fb.group({
                          fieldValue: [field.value, Validators.required],
                          fieldName: field.fieldName,
                        })
                      );
                    }
                    //Remove validator if field is not mandatory
                    else if (field.mandatory == false) {
                      (this.userForm.get('additionalFields') as FormArray).push(
                        this.fb.group({
                          fieldValue: [field.value],
                          fieldName: field.fieldName,
                        })
                      );
                    }
                  }
                });

                //getting comments added for task
                this.db
                  .getCommentsTask(this.superUserId, datas.id) //datas.id : current task id
                  .pipe(takeUntil(this.onDestroy$))
                  .subscribe((data) => {
                    this.commentsTask = data.map((e) => {
                      return {
                        id: e.payload.doc.id,
                        ...(e.payload.doc.data() as {}),
                      } as {};
                    });
                    //push the data into the comment formArray here after subscription is executed
                    const add = this.userForm.get('comments') as FormArray;
                    //clear the array before pushing data else data duplicates
                    add.clear();
                    //push controls for comments
                    this.commentsTask.forEach((doc) => {
                      doc.isEditable = false;
                      add.push(
                        this.fb.group({
                          id: doc.id,
                          body: doc.body,
                          postedTime: doc.postedTime,
                          userId: doc.userId,
                          userName: doc.userName,
                          isEditable: false, //isEditable used for representing the comment to edit
                        })
                      );
                    });
                  });

                //fetching attachments
                this.db
                  .getAttachments(this.superUserId, this.tasksId)
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
              }
            }

            //create from customer
            if (this.datas?.mode == 'custCreate' && this.formReset) {
              this.formReset = false;
              //getting customerId and orgId from dialogue data
              this.customerId = this.datas.cid;
              this.customersFirstName = this.datas.firstName
                ? this.datas.firstName
                : null;
              this.customersSecondName = this.datas.secondName
                ? this.datas.secondName
                : null;
              this.customersSurname = this.datas.surname
                ? this.datas.surname
                : null;
              this.orgId = this.datas.orgId ? this.datas.orgId : null;
              this.customersCompany = this.datas.company;
              //getting additional fields
              this.additionalFields = allData.superUserDetails.customFieldsTask;

              //find the no of active additionals fields
              this.additionalFields?.forEach((field) => {
                if (field.isActive) {
                  this.activeFieldsLength = this.activeFieldsLength + 1;
                }
              });
              this.userForm = this.fb.group({
                title: [
                  '',
                  [
                    Validators.required,
                    Validators.maxLength(100),
                    AppCustomDirective.whiteSpaceOnly,
                  ],
                ],
                description: [''],
                salesDetails: [null],
                servicesDetails: [null],
                priority: [this.defaultPriority],
                dueDate: [''],
                additionalFields: this.fb.array([]),
              });
              //update validators based on field customisation
              this.updateValidators();
              //push additional fields data to FormArray
              this.addAdditionalFieldsFormControls();
            }

            //create from organization
            if (this.datas?.mode == 'orgCreate' && this.formReset) {
              this.formReset = false;
              //getting orgId from dialogue data

              this.orgId = this.datas.orgId ? this.datas.orgId : null;
              this.customersCompany = this.datas.company;
              //getting additional fields
              this.additionalFields = allData.superUserDetails.customFieldsTask;

              //find the no of active additionals fields
              this.additionalFields?.forEach((field) => {
                if (field.isActive) {
                  this.activeFieldsLength = this.activeFieldsLength + 1;
                }
              });
              this.userForm = this.fb.group({
                title: [
                  '',
                  [
                    Validators.required,
                    Validators.maxLength(100),
                    AppCustomDirective.whiteSpaceOnly,
                  ],
                ],
                description: [''],
                salesDetails: [null],
                servicesDetails: [null],
                priority: [this.defaultPriority],
                dueDate: [''],
                additionalFields: this.fb.array([]),
              });
              //update validators based on field customisation
              this.updateValidators();
              //push additional fields data to FormArray
              this.addAdditionalFieldsFormControls();
            }

            //create from sale
            if (this.datas?.mode == 'saleCreate' && this.formReset) {
              this.formReset = false;
              //getting customerId, orgId and sale details from dialogue data
              this.customerId = this.datas.cid;
              this.customersFirstName = this.datas.firstName
                ? this.datas.firstName
                : null;
              this.customersSecondName = this.datas.secondName
                ? this.datas.secondName
                : null;
              this.customersSurname = this.datas.surname
                ? this.datas.surname
                : null;
              this.orgId = this.datas.orgId ? this.datas.orgId : null;
              this.customersCompany = this.datas.company;
              this.salesId = this.datas.sid;
              this.salesTitle = this.datas.saleName;
              //getting additional fields
              this.additionalFields = allData.superUserDetails.customFieldsTask;

              //find the no of active additionals fields
              this.additionalFields?.forEach((field) => {
                if (field.isActive) {
                  this.activeFieldsLength = this.activeFieldsLength + 1;
                }
              });

              this.userForm = this.fb.group({
                title: [
                  '',
                  [
                    Validators.required,
                    Validators.maxLength(100),
                    AppCustomDirective.whiteSpaceOnly,
                  ],
                ],
                description: [''],
                salesDetails: [null],
                servicesDetails: [null],
                priority: [this.defaultPriority],
                dueDate: [''],
                additionalFields: this.fb.array([]),
              });
              //update validators based on field customisation
              this.updateValidators();
              //push additional fields data to FormArray
              this.addAdditionalFieldsFormControls();
            }

            //create from service
            if (this.datas?.mode == 'serviceCreate' && this.formReset) {
              this.formReset = false;
              //getting customerId, orgId and service details from dialogue data
              this.customerId = this.datas.cid;
              this.customersFirstName = this.datas.firstName
                ? this.datas.firstName
                : null;
              this.customersSecondName = this.datas.secondName
                ? this.datas.secondName
                : null;
              this.customersSurname = this.datas.surname
                ? this.datas.surname
                : null;
              this.orgId = this.datas.orgId ? this.datas.orgId : null;
              this.customersCompany = this.datas.company;
              this.servicesId = this.datas.sid;
              this.servicesTitle = this.datas.serviceName;
              //getting additional fields
              this.additionalFields = allData.superUserDetails.customFieldsTask;

              //find the no of active additionals fields
              this.additionalFields?.forEach((field) => {
                if (field.isActive) {
                  this.activeFieldsLength = this.activeFieldsLength + 1;
                }
              });
              this.userForm = this.fb.group({
                title: [
                  '',
                  [
                    Validators.required,
                    Validators.maxLength(100),
                    AppCustomDirective.whiteSpaceOnly,
                  ],
                ],
                description: [''],
                salesDetails: [null],
                servicesDetails: [null],
                priority: [this.defaultPriority],
                dueDate: [''],
                additionalFields: this.fb.array([]),
              });
              //update validators based on field customisation
              this.updateValidators();
              //push additional fields data to FormArray
              this.addAdditionalFieldsFormControls();
            }

            //get sales and services list based on data access rule
            if (this.customerId) {
              this.contactSelected = true;
              this.getSaleAndService(
                this.superUserId,
                this.userId,
                this.customerId,
                this.saleDataAccessRule,
                this.serviceDataAccessRule,
                'both'
              );
            }
            if (this.orgId) {
              this.companySelected = true;
            }
            //To populate sale form control with sale details
            if (this.salesId) {
              this.db
                .getSale(this.superUserId, this.salesId)
                .pipe(takeUntil(this.onDestroy$))
                .subscribe((data) => {
                  this.salesDetails = data;
                  this.userForm
                    .get('salesDetails')
                    .patchValue(this.salesDetails);
                });
            }
            //To populate service form control with service details
            if (this.servicesId) {
              let service: any;
              this.db
                .getService(this.superUserId, this.servicesId)
                .pipe(takeUntil(this.onDestroy$))
                .subscribe((data) => {
                  this.servicesDetails = data;
                  this.userForm
                    .get('servicesDetails')
                    .patchValue(this.servicesDetails);
                });
            }
            if (this.datas?.mode == 'update' && this.formReset) {
              this.formReset = false;
              setTimeout(() => {
                //get initial loaded form for changeLog
                this.previousForm = ChangeLogComponent.cloneAbstractControl(
                  this.userForm
                );
              }, 1000);
            }
          }
        }
      });
  }

  ngOnInit() {}

  inputAttachment() {
    //prevent form resetting while updating attachment size on uploading document
    this.taskReset = false;
    let element: HTMLElement = document.getElementsByName(
      'attachment_1'
    )[0] as HTMLElement;
    this.file.nativeElement.value = '';
    element.click();
  }
  // upload attachment
  uploadAttachmentTask(event) {
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
        const filePath = `attachment/${this.userId}/tasks/${Date.now()}_${str}`;
        //if mode is update
        if (this.datas?.mode == 'update') {
          //add the attached file details to changelog
          this.changeLog = ChangeLogComponent.saveLog(
            this.constructor.name,
            this.userId,
            this.userName,
            '',
            { addedAttachment: str },
            this.changeLog
          );
        }
        //calls function to upload attachment
        this.uploadAttachment(
          filePath,
          file,
          this.tasksId,
          str,
          date,
          name,
          size,
          newSize,
          'tasks',
          '',
          this.changeLog
        );
      }
    }
  }
  //function to upload attachment
  uploadAttachment(
    filePath,
    file,
    custId,
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
          //get download url for the file
          downloadURL = await ref.getDownloadURL().toPromise();
          if (form === 'tasks') {
            if (this.datas?.mode == 'update') {
              //add to attachments collection
              this.db
                .attachmentsToCollection(
                  this.superUserId,
                  custId,
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
                      'tasks',
                      custId,
                      changeLog
                    );
                  }
                  //add uploaded file to temp array uploaded files
                  this.uploadedFiles.push({
                    id: res.id,
                    filePath: filePath,
                    downloadURL: downloadURL,
                    file: file,
                    custId: custId,
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
                  this.snack.open('Attachment added successfully', '', {
                    duration: 2000,
                  });
                  //update commonservice file upload status as false
                  this.commonService.updateStatus(false);
                })
                .catch((e) => {
                  //if upload fails, show error message
                  this.snack.open('Error!!! Attachment not added', '', {
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
                custId: custId,
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
              this.taskReset = false;
              //update total file size under superuser
              this.db.updateSize(this.superUserId, newSize);
              //attachment uploaded message
              this.snack.open('Attachment uploaded successfully', '', {
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
    this.taskReset = false;
    //open confirmation popup to confirm delete
    let dialog = this.dialog.open(ConfirmationpopupComponent, {
      data: {
        taskId: this.tasksId,
        scenario: this.datas?.mode != 'update' ? 'create' : 'update',
        smode: 'attachmentDeleteTask',
        path: item.path,
        itemId: item.id ? item.id : null,
        url: item.downloadURL,
        orginalPath: item.fileName,
        userId: this.superUserId,
        size: item.size,
        changeLog: ChangeLogComponent.saveLog(
          this.constructor.name,
          this.userId,
          this.userName,
          '',
          { deletedAttachment: item.fileName },
          this.changeLog
        ),
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
  //go to customer details page
  onViewCustomer(customerId: string) {
    let link: string = 'dash/contact/customerdetails/' + customerId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }
  //go to organisation details page
  onViewOrganization(orgId: string) {
    let link: string = 'dash/organisation/orgdetails/' + orgId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }
  //go to sale details page
  onViewSale(saleId: string) {
    let link: string = 'dash/sales/saleview/' + saleId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }
  //go to support details page
  onViewSupport(supportId: string) {
    let link: string = 'dash/service/service-details/' + supportId;
    this.router.navigate([]).then((result) => {
      window.open(link, '_blank');
    });
  }
  //update validators of the fields based on field customisation in settings
  updateValidators() {
    if (this.taskSettings) {
      //description
      if (this.taskSettings?.description?.mandatory === true) {
        this.userForm.controls['description'].setValidators([
          Validators.required,
        ]);
      } else {
        this.userForm.controls['description'].clearValidators();
      }
      this.userForm.controls['description'].updateValueAndValidity();
      //priority
      if (this.taskSettings?.priority?.mandatory === true) {
        this.userForm.controls['priority'].setValidators([Validators.required]);
      } else {
        this.userForm.controls['priority'].clearValidators();
      }
      this.userForm.controls['priority'].updateValueAndValidity();
      //dueDate
      if (this.taskSettings?.dueDate?.mandatory === true) {
        this.userForm.controls['dueDate'].setValidators([Validators.required]);
      } else {
        this.userForm.controls['dueDate'].clearValidators();
      }
      this.userForm.controls['dueDate'].updateValueAndValidity();
      //status
      if (this.datas.mode == 'update') {
        if (this.taskSettings?.status?.mandatory === true) {
          this.userForm.controls['status'].setValidators([Validators.required]);
        } else {
          this.userForm.controls['status'].clearValidators();
        }
        this.userForm.controls['status'].updateValueAndValidity();
      }
      //saleDetails
      if (this.datas.mode != 'saleCreate') {
        if (this.taskSettings?.saleTitle?.mandatory === true) {
          this.userForm.controls['salesDetails'].setValidators([
            Validators.required,
          ]);
        } else {
          this.userForm.controls['salesDetails'].clearValidators();
        }
        this.userForm.controls['salesDetails'].updateValueAndValidity();
      }
      //serviceDetails
      if (this.datas.mode != 'serviceCreate') {
        if (this.taskSettings?.serviceTitle?.mandatory === true) {
          this.userForm.controls['servicesDetails'].setValidators([
            Validators.required,
          ]);
        } else {
          this.userForm.controls['servicesDetails'].clearValidators();
        }
        this.userForm.controls['servicesDetails'].updateValueAndValidity();
      }
    }
  }
  //push additional fields data to FormArray
  addAdditionalFieldsFormControls() {
    this.additionalFields?.forEach((field) => {
      //if fieldValue is date, change timestamp to date format
      if (field.fieldType == 'date') {
        //Add validator if field is mandatory
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
        }
        //Remove validator if field is not mandatory
        else if (field.mandatory == false) {
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
        //if fieldValue is not a date
        //Add validator if field is mandatory
        if (field.mandatory == true) {
          (this.userForm.get('additionalFields') as FormArray).push(
            this.fb.group({
              fieldValue: [field.defaultValue, Validators.required],
              fieldName: field.fieldName,
            })
          );
        }
        //Remove validator if field is not mandatory
        else if (field.mandatory == false) {
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
  //on removing customer chip
  onClearContact() {
    this.customerId = null;
    this.customerName = null;
    this.customersFirstName = null;
    this.customersSecondName = null;
    this.customersSurname = null;
    this.contactSelected = false;
    this.salesDetails = null;
    this.salesList = [];
    this.salesId = null;
    this.salesTitle = null;
    this.servicesDetails = null;
    this.servicesList = [];
    this.servicesId = null;
    this.servicesTitle = null;

    this.userForm.patchValue({
      salesDetails: null,
      servicesDetails: null,
    });
    this.userForm.get('salesDetails').markAsDirty();
    this.userForm.get('servicesDetails').markAsDirty();
  }
  //on removing organisation chip
  onClearCompany() {
    this.orgId = null;
    this.customersCompany = null;
    this.companySelected = false;
  }
  //on removing sale chip
  onClearSale() {
    this.salesDetails = null;
    this.salesId = null;
    this.salesTitle = null;
    this.userForm.patchValue({ salesDetails: null });
    this.userForm.get('salesDetails').markAsDirty();
  }
  //on removing service chip
  onClearService() {
    this.servicesDetails = null;
    this.servicesId = null;
    this.servicesTitle = null;
    this.userForm.patchValue({ servicesDetails: null });
    this.userForm.get('servicesDetails').markAsDirty();
  }
  //triggered while selecting a sale in auto complete
  saleSelected(selectedSale) {
    let insales = this.checkinSales(selectedSale); // check if customer selected or nor
    if (insales) {
      this.salesTitle = selectedSale.saleTitle;
      this.salesId = selectedSale.id;
    }
  }
  //triggered while selecting a service in auto complete
  serviceSelected(selectedService) {
    let inservice = this.checkinServices(selectedService); // check if customer selected or nor
    if (inservice) {
      this.servicesTitle = selectedService.serviceTitle;
      this.servicesId = selectedService.id;
    }
  }
  // check whether the sale selected is in the sales list
  checkinSales(selectedSale) {
    if (selectedSale) return !!this.salesList.includes(selectedSale);
  }
  // check whether the service selected is in the services list
  checkinServices(selectedService) {
    if (selectedService) return !!this.servicesList.includes(selectedService);
  }
  //triggered while creating task in web view
  onSubmit(form, GAevent) {
    this.analytics.logEvent(GAevent);
    let datePlaced = new Date().getTime();
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

    //object to store values to db
    var formDetailsTask = {
      title: form.value.title,
      description: form.value.description,
      orgId: this.orgId,
      dueDate: form.value.dueDate,
      priority: form.value.priority,
      saleId: this.salesId,
      saleTitle: this.salesTitle,
      serviceId: this.servicesId,
      serviceTitle: this.servicesTitle,
      assignedTo: this.assignedTo,
      assignedToName: this.assignedToName,
      additionalFieldsArr: additionalFields,
    };
    this.initialStatus = this.taskStatusOpn[0];
    //creating task
    this.db
      .CreateTask(
        this.superUserId,
        formDetailsTask,
        datePlaced,
        this.customerId,
        this.customersFirstName,
        this.customersSecondName,
        this.customersSurname,
        this.customersCompany,
        this.userId,
        this.userName,
        this.associatedBranch,
        ChangeLogComponent.saveLog(
          this.constructor.name,
          this.userId,
          this.userName,
          '',
          '',
          this.changeLog
        ),
        this.initialStatus
      )
      .then((res) => {
        if (this.uploadedFiles.length > 0) {
          for (let i = 0; i < this.uploadedFiles.length; i++) {
            this.db
              .attachmentsToCollection(
                this.superUserId,
                res.id,
                this.uploadedFiles[i].str,
                this.uploadedFiles[i].downloadURL,
                this.uploadedFiles[i].filePath,
                this.uploadedFiles[i].date,
                this.uploadedFiles[i].name,
                this.uploadedFiles[i].size
              )
              .then((res) => {
                this.snack.open('Attachment added successfully', '', {
                  duration: 2000,
                });
                this.commonService.updateStatus(false);
              })
              .catch((e) => {
                this.snack.open('Error!!! Attachment not added', '', {
                  duration: 2000,
                });
                this.commonService.updateStatus(false);
              });
          }
        }
      });

    let message = this.fieldNameTask + ' Successfully Created';
    this.snack.open(message, '', {
      duration: 2000,
    });

    //checking for popup for closing
    if (this.datas) {
      this.dialogRef.close();
    }
  }
  //triggered while updating task in web view
  onUpdate(form) {
    Object.keys(this.prevComments).forEach((key2) => {
      let present: boolean = false;
      Object.keys(this.updatedComments).forEach((key1) => {
        if (key1 == key2) {
          present = true;
        }
      });

      if (present == false) {
        delete this.prevComments[key2];
      }
    });

    let datePlaced = new Date().getTime();
    let completedDate = null;
    //setting complete date while updating as complete
    if (form.value.status == 'Completed') {
      form.value.completedDate = datePlaced;
    }

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

    // if old assignee is not equal to new assignee update assigned to date
    if (this.oldAssignedTo != this.assignedTo) {
      this.assignedToDate = new Date().getTime();
    }
    let formDetailsTask = {
      title: form.value.title,
      description: form.value.description,
      customerId: this.customerId,
      orgId: this.orgId,
      dueDate: form.value.dueDate,
      priority: form.value.priority,
      saleId: this.salesId,
      saleTitle: this.salesTitle,
      serviceId: this.servicesId,
      serviceTitle: this.servicesTitle,
      assignedTo: this.assignedTo,
      assignedToName: this.assignedToName,
      additionalFieldsArr: additionalFields,
      status: form.value.status,
      completedDate: completedDate,
      assignedToDate: this.assignedToDate,
    };

    let additionalData = {
      curAssignedTo: {
        assignedTo:
          this.taskDetails?.assignedTo != this.assignedTo
            ? this.assignedTo
            : null,
        assignedToName:
          this.commonService.getAssignedToName(this.taskDetails?.assignedTo) !=
          this.assignedToName
            ? this.assignedToName
            : null,
      },
      prevAssignedTo: {
        assignedTo: this.taskDetails?.assignedTo,
        assignedToName: this.commonService.getAssignedToName(
          this.taskDetails?.assignedTo
        ),
      },
      addedComments: this.addedComments,
      deletedComments: this.deletedComments,
      curComments: this.updatedComments,
      prevComments: this.prevComments,
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
        companyName: this.customersCompany,
      },
      prevOrgId: {
        //previous values
        orgId: this.prevOrgId,
        companyName: this.prevCustomersCompany,
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
    };

    //changeLog for task popup
    let newChangeLog = ChangeLogComponent.saveLogReactiveForm(
      'CrudModal1Component',
      this.userId,
      this.userName,
      this.previousForm,
      this.userForm,
      this.changeLog,
      additionalData
    );
    if (this.datas && newChangeLog != null) {
      //updating in popup
      this.db.updateTask(
        this.superUserId,
        this.datas.id,
        formDetailsTask,
        this.customerId,
        this.customersFirstName,
        this.customersSecondName,
        this.customersSurname,
        this.customersCompany,
        this.associatedBranch,
        newChangeLog
      );
    }

    let message = this.fieldNameTask + ' Successfully Updated';
    this.snack.open(message, '', {
      duration: 2000,
    });
    //checking for popup for closing
    if (this.datas) {
      this.dialogRef.close(true);
    }
  }
  //closing bottomsheet/popup
  close() {
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
        newSize = newSize - this.uploadedFiles[i].size;
        this.db.updateSize(this.superUserId, newSize);
        if (this.datas?.mode == 'update') {
          this.db.deleteDocTask(
            this.superUserId,
            this.tasksId,
            this.uploadedFiles[i].id
          );
          if(Array.isArray(this.changeLog)){
            this.changeLog.splice(this.changeLog.length - 1, 1);
          } else {
            let changeLogLen = Object.keys(this.changeLog).length;
            delete this.changeLog[changeLogLen - 1];
          }
          this.db.updateChangeLog(
            this.superUserId,
            'tasks',
            this.tasksId,
            this.changeLog
          );
        }
      }
    }
    if (this.datas) {
      this.dialogRef.close(false);
    }
  }
  //to display sale name in autocomplete
  displayFnSale(sale: Sales): string {
    return sale && sale.saleTitle;
  }
  //to display service name in autocomplete
  displayFnService(service: Service): string {
    return service && service.serviceTitle;
  }
  createUserlist() {
    //function to create list of users as per data acces rule
    let userList: any[] = [];
    let userIdArray = [];
    if (this.subUsers) {
      // create array of subuser ids and names
      this.subUsers.forEach((elem) => {
        userIdArray.push(elem.userId);
        userList.push({
          firstname: elem.firstname,
          lastname: elem.lastname ? elem.lastname : '',
          userId: elem.userId,
          branchId: elem.branchId ? elem.branchId : 'NA',
          status: elem.status,
        });
      });
    }
    userIdArray.push(this.superUserId);
    userList.push({
      firstname: this.superFirstName,
      lastname: this.superSecondName ? this.superSecondName : '',
      userId: this.superUserId,
      branchId: this.superUserDetails.associatedBranch
        ? this.superUserDetails.associatedBranch
        : 'NA',
    });
    return userList;
  }
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
    this.assignedToName = $event;
  }
  branchIdEventHandler($event: any) {
    this.associatedBranch = $event;
  }
  //checking for network
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  //for saving new comment
  saveTaskComment() {
    this.commentTask = this.userForm.get('commentTask').value;

    if (this.commentTask) {
      let newComment = {
        body: this.commentTask,
        userId: this.userId,
        userName: this.secondName
          ? this.firstName + ' ' + this.secondName
          : this.firstName,
        postedTime: new Date(),
      };

      this.db.createCommentCollection(
        this.superUserId,
        this.datas.id,
        newComment,
        ChangeLogComponent.saveLog(
          this.constructor.name,
          this.userId,
          this.userName,
          {},
          { addedComment: this.commentTask },
          this.changeLog
        )
      );

      this.userForm.get('commentTask').patchValue('');
      this.snack.open('Comment Saved', '', {
        duration: 2000,
      });
    }
  }
  //for editing existing comment
  editTaskComment(comment) {
    this.prevComment = comment.value.body;
    comment.patchValue({
      isEditable: true,
    });
  }
  //for updating new comment to db
  updateTaskComment(comment) {
    if (this.prevComment != comment.value.body) {
      let body = comment.value.body;
      this.db
        .updateCommentCollection(
          this.superUserId,
          this.datas.id,
          comment.value.id,
          body,
          ChangeLogComponent.saveLog(
            this.constructor.name,
            this.userId,
            this.userName,
            { comments: this.prevComment },
            { comments: body },
            this.changeLog
          )
        )
        .then((res) => {
          this.snack.open('Comment Saved', ' ', {
            duration: 2000,
          });
        })
        .catch((e) => {});
    }
    comment.patchValue({
      isEditable: false,
    });
  }
  //for deleting a task comment
  deleteTaskComment(comment) {
    this.db
      .deleteComment(
        this.superUserId,
        this.datas.id,
        comment.id,
        ChangeLogComponent.saveLog(
          this.constructor.name,
          this.userId,
          this.userName,
          {},
          { deletedComment: comment.body },
          this.changeLog
        )
      )
      .then((res) => {
        this.snack.open('Selected Comment deleted', '', {
          duration: 2000,
        });
      })
      .catch((e) => {});
  }
  //for checking data error in form
  TypeError() {
    this.submitted = true;
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
      this.customersCompany = $event;
    }
  }
  //returns the customer details from common-org component
  contSelectedEventHander(selectedCust: any) {
    // if customer selected
    this.customerId = selectedCust?.id; // customer id

    if (this.customerId) {
      this.contactSelected = true;
    }
    this.customersFirstName = selectedCust?.firstName
      ? selectedCust?.firstName
      : null;
    this.customersSecondName = selectedCust?.secondName
      ? selectedCust?.secondName
      : null;
    this.customersSurname = selectedCust?.surname
      ? selectedCust?.surname
      : null;
    if (selectedCust?.secondName && selectedCust?.surname) {
      // if second name & surname is there
      this.customerName =
        selectedCust?.firstName +
        ' ' +
        selectedCust?.secondName +
        ' ' +
        selectedCust?.surname;
    } else if (selectedCust?.secondName && !selectedCust?.surname) {
      this.customerName =
        selectedCust?.firstName + ' ' + selectedCust?.secondName;
    } else if (!selectedCust?.secondName && selectedCust?.surname) {
      this.customerName = selectedCust?.firstName + ' ' + selectedCust?.surname;
    } else {
      this.customerName = selectedCust?.firstName;
    }

    if (selectedCust.orgId) {
      this.orgId = selectedCust.orgId;
      this.customersCompany = selectedCust.companyName
        ? selectedCust.companyName
        : null;
      this.companySelected = true;
    }
    this.salesList = [];
    this.salesDetails = null;
    this.salesId = null;
    this.salesTitle = null;
    this.userForm.get('salesDetails').patchValue(null);
    this.userForm.get('salesDetails').markAsDirty();

    this.servicesList = [];
    this.servicesDetails = null;
    this.servicesId = null;
    this.servicesTitle = null;
    this.userForm.get('servicesDetails').patchValue(null);
    this.userForm.get('servicesDetails').markAsDirty();
    //get sales and services list based on data access rule
    if (this.customerId) {
      this.getSaleAndService(
        this.superUserId,
        this.userId,
        this.customerId,
        this.saleDataAccessRule,
        this.serviceDataAccessRule,
        'both'
      );
    }
  }
  //function to get sales and services based on data access rule
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
  //function to get services based on data access rule
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
  //get filter values to show in dropdown
  getAllSales(superUserId, queryId: string[], saleDataAccessRule, custId) {
    return new Promise<void>(async (resolve) => {
      (await this.db.getSales(superUserId, queryId, saleDataAccessRule, custId))
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.salesList = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Sales;
          });
          // filter sales
          this.filteredOptionsSale = this.userForm
            .get('salesDetails')
            .valueChanges.pipe(
              startWith(''),
              map((value) =>
                typeof value === 'string' ? value : value?.saleTitle
              ),
              map((saleTitle) =>
                saleTitle
                  ? this._filterSales(saleTitle)
                  : this.salesList.slice()
              )
            );
          resolve();
        });
    });
  }
  //get filter values to show in dropdown
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
          this.servicesList = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Service;
          });
          // filter services
          this.filteredOptionsService = this.userForm
            .get('servicesDetails')
            .valueChanges.pipe(
              startWith(''),
              map((value) =>
                typeof value === 'string' ? value : value?.serviceTitle
              ),
              map((serviceTitle) =>
                serviceTitle
                  ? this._filterServices(serviceTitle)
                  : this.servicesList.slice()
              )
            );
          resolve();
        });
    });
  }
  // filter sales list
  private _filterSales(name: string): Sales[] {
    const filterValue = name.toLowerCase();
    return this.salesList.filter(
      (option) => option.saleTitle.toLowerCase().indexOf(filterValue) === 0
    );
  }
  // filter sales service
  private _filterServices(name: string): Service[] {
    const filterValue = name.toLowerCase();
    return this.servicesList.filter(
      (option) => option.serviceTitle.toLowerCase().indexOf(filterValue) === 0
    );
  }
  //for unsubscribing
  ngOnDestroy() {
    //close all the subscription
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
