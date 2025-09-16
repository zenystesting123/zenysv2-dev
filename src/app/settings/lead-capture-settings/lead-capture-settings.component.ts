import {
  contactSettings,
  defaultContactSettings,
  leadCaptureModel,
  SharedLeadCaptureModel,
  taggedUsers,
} from 'src/app/data-models';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { CommonService } from 'src/app/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { leadCaptureFields, UserAccessDetails } from './../../data-models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LeadCaptureSettingsService } from './lead-capture-settings.service';
import * as firebase from 'firebase';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipInputEvent, MatChipEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Pipelines } from 'src/app/model/pipeline.modal';

@Component({
  selector: 'app-lead-capture-settings',
  templateUrl: './lead-capture-settings.component.html',
  styleUrls: ['./lead-capture-settings.component.scss'],
})
export class LeadCaptureSettingsComponent implements OnInit, OnDestroy {
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  @Input() labelPosition: 'before' | 'after';
  @ViewChild('ref') ref;
  progressBarStatus: Boolean = false; //progressBarStatus
  userDetailsSubscription: any; //Common service subscription to get userdetails
  superUserId: any; //to store superuser's id
  superUserDetails: any; //to store superuser's details
  superUserName: string; //to store superuser's name
  columns = []; //to store each form's fields
  leadSource: any[]; //to store lead source values
  plan: any; //to store user's subscription plan
  customerPipelines: Pipelines[] = [];
  selectedContactPipeline: number; //to store current pipeline number of customer
  statusArray: any = []; //to store the status Array
  customerStatus: string; //to store current status
  formId: number = 0; //initialise first form id as 0
  selectedFormId: number = 0; //set initial form id selected as 0
  forms: any[] = []; //to store the form names
  maxLimitForm: number = 5; //to limit the number of forms created
  leadCapFields: any = []; //to store entire form object
  urlSafe: SafeResourceUrl; //to bypass url check in iframe
  select: boolean = false; //
  selectedForm: boolean = false; //to store selected form name
  usrProfileData: UserAccessDetails; //user profile data
  notEdit: boolean = true; //restrict direct routes by checking access
  displayFormField: boolean = false; //flag to display add new form field
  formName: string; //to store newly added form name
  setedit: boolean = false; //flag to display edit form name field
  editFormName: string; //to store edited form name
  formToEdit: any; //to store form id to edit
  subUsers: any[]; //to store subusers array
  customFields: any[]; //to store additional fields for customer
  subUserNames: any = []; //to store subuser names
  subUserIDs: any = []; //to store subuser id
  dataSaved: boolean = false; //flag to set when data saved
  leadCaptureId: string; //id of leadcaptureform in db
  url: string; //to store domain url
  selectedFormName: any; //to store selected form name
  selectedFormTitle: any; //to store selected form title
  sharedDetails: SharedLeadCaptureModel[]; //model for creating leadcapture from object
  editFormTitle: boolean = false; //edited form title
  formTitles: any[] = []; //array to store all form titles
  logoStatus: boolean[] = []; //to check if logo should be displayed or not
  logoStatusVal: boolean = false; //to use in form to display logo
  logoExisting: boolean = false; //local variable to check logo existing in db
  userLogo: any; //url of logo
  logoplaceholder: string = 'assets/images/logoplaceholder.PNG'; //dummy logo image
  //customisation field
  contactSettings: contactSettings;
  activeFormsLength: number; //To store the length of active forms
  activeStatus: boolean[] = []; //to store the active status of the form
  firstFormId: number; //To store the form id of first active form
  valReset: boolean = true; //to prevent value being reset on change in subscription
  subUserList: any[] = []; //stores subuser details
  byProfileCallerIndex: number[] = []; //to store byProfileCallerIndex
  byUserCallerIndex: number[] = []; //to store  byUserCallerIndex
  assignedToRole: string[] = []; //to store assignedToRole
  assignedToArray = []; //to store assignedTo IDs
  selectedbyProfileCallerIndex: number; //to store the byProfileCallerIndex for the selected form
  selectedbyUserCallerIndex: number; //to store the byUserCallerIndex for the selected form
  selectedAssignedToRole: string; //to store assignedToRole for the selected form
  selectedAssignedToArray = []; //to store assignedToArray for the selected form
  subUserDocIds: any[]; //subuser document IDs
  defaultProfiles: {}[]; //store default profile
  profilesList: any[]; //store list of profile names
  profileNames: any[] = []; //stores profile names for each form
  selectedProfileName: any; //stores the profile name for selected form
  filteredOptions: Observable<string[]>; //filtered taggedUsers list
  selectedAssignedToArrayName = []; //to store assignedToArray for the selected form
  separatorKeysCodes: number[] = [ENTER, COMMA]; //mat autocomplete key codes
  searchCtrl = new FormControl(''); //assignedTo input formcontrol
  @ViewChild('searchInput') searchInput: ElementRef;
  constructor(
    private location: Location,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private db: LeadCaptureSettingsService,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private snack: MatSnackBar,
    public sanitizer: DomSanitizer,
    public announcer: LiveAnnouncer
  ) {
    //getting data from common service file related to the user
    this.userDetailsSubscription = this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        if (allData) {
          //store superuser id
          this.superUserId = allData.userDetails.superUserId;
          //store superuser details
          this.superUserDetails = allData.superUserDetails;
          //store superuser full name
          this.superUserName = this.superUserDetails.lastname
            ? this.superUserDetails.firstname +
              ' ' +
              this.superUserDetails.lastname
            : this.superUserDetails.firstname;
          //check if logo available in db
          if (allData.userDetails.accountType == 'SuperUser') {
            if (allData.userDetails.logo) {
              this.logoExisting = true;
            }
          } else {
            if (this.superUserDetails.logo) {
              this.logoExisting = true;
            }
          }

          // check for logo under user profile and assign it o a boolean local variable
          // and then if its true; fetch data from firebase storage
          if (this.logoExisting) {
            const userStorageRef1 = firebase.default
              .storage()
              .ref()
              .child('logo/' + this.superUserId);
            userStorageRef1.getDownloadURL().then((url1) => {
              this.userLogo = url1;
            });
          }
          this.userLogo = this.userLogo ? this.userLogo : null;
          //getting sub users details
          this.subUsers = allData.subUsers;
          //filter active users
          this.subUsers = this.subUsers.filter(function (e) {
            return e.status != 'suspended';
          });
          if (this.subUsers) {
            this.subUsers.forEach((subUser, index) => {
              //store subuser ids and names in an array
              this.subUserList[index] = {
                docId: subUser.id, //docID also stored for the purpose of using in AssignedToArray
                userId: subUser.userId,
                name: subUser.lastname
                  ? subUser.firstname + ' ' + subUser.lastname
                  : subUser.firstname,
              };
            });
            //store superuser id in subuser array
            this.subUserList[this.subUsers.length] = {
              docId: this.superUserId,
              userId: this.superUserId,
              name: this.superUserDetails.lastname
                ? this.superUserDetails.firstname +
                  ' ' +
                  this.superUserDetails.lastname
                : this.superUserDetails.firstname,
            };
          } else {
            //if no subuser added, store superuser details
            this.subUserList[this.subUsers.length] = {
              docId: this.superUserId,
              userId: this.superUserId,
              name: this.superUserDetails.lastname
                ? this.superUserDetails.firstname +
                  ' ' +
                  this.superUserDetails.lastname
                : this.superUserDetails.firstname,
            };
          }
          //get docIDs of the subuser
          this.subUserDocIds = this.subUserList.map((val) => val.docId);
          this.subUserNames = this.subUserList.map((val) => val.name);

          //assigning filteredOptions w.r.t searchterm
          this.filteredOptions = this.searchCtrl.valueChanges.pipe(
            startWith(''),
            map((name: string | '') =>
              name ? this._filter(name) : this.subUserList.slice()
            )
          );

          // read profiles from DB
          this.db
            .getDefaultProfiles(this.superUserId)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((data) => {
              this.defaultProfiles = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as {};
              });
              // for selecting the profile, to create a mat-select we are storing the profile names under this user in an array
              this.profilesList = [];
              let pArray = this.defaultProfiles.map(function (item) {
                return item['profileName'];
              });
              pArray.forEach((value, index) => {
                if (value == 'SuperUser') pArray.splice(index, 1);
              });
              this.profilesList = pArray;
            });

          //get the details of user profile assigned to the user to check access control
          this.usrProfileData = allData.usrProfileData;
          if (this.usrProfileData) {
            if (this.usrProfileData.isCheckedSett == false) {
              this.notEdit = true;
            } else {
              if (this.usrProfileData.settView == false) {
                this.notEdit = true;
              } else {
                this.notEdit = false;
              }
            }
          }
          //customisation field
          if (
            typeof allData.superUserDetails.contactSettings === 'undefined' ||
            allData.superUserDetails.contactSettings === null
          ) {
            this.contactSettings = defaultContactSettings.CONST_VALUE;
          } else {
            this.contactSettings = allData.superUserDetails.contactSettings;
          }
          //get customFields for contact
          this.customFields = allData.superUserDetails.customFieldsContact;
          //get lead source
          this.leadSource = allData.superUserDetails.custLead;
          //get current subscription plan
          this.plan = allData.superUserDetails.plan;
          //get domain url from environment file
          this.url = environment.leadCaptureDomain;
          //this.url = 'http://localhost:4200';
          //get leadcapture form details from sharedLeadCapture collection
          this.db
            .getSharedLeadCaptureForms(this.superUserId)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((data) => {
              this.sharedDetails = data.map((e) => {
                return {
                  id: e.payload.doc.id,
                  ...(e.payload.doc.data() as {}),
                } as SharedLeadCaptureModel;
              });
              //if leadcapture fields available in db
              if (this.sharedDetails[0]) {
                //get document id
                this.leadCaptureId = this.sharedDetails[0].id;
                //get forms object
                this.leadCapFields = this.sharedDetails[0].leadCaptureFields;
                //get form names
                this.forms = this.sharedDetails[0].leadCaptureFormNames;
                //get form title
                this.formTitles = this.sharedDetails[0].leadCaptureFormTitles;
                //get logo status
                this.logoStatus = this.sharedDetails[0].logoStatus;
                //get active status of each form
                this.activeStatus = this.sharedDetails[0].activeStatus;
                //by profile caller index
                this.byProfileCallerIndex =
                  this.sharedDetails[0].byProfileCallerIndex;
                //by user caller index
                this.byUserCallerIndex =
                  this.sharedDetails[0].byUserCallerIndex;
                //assigned to role - by user or by profile
                this.assignedToRole = this.sharedDetails[0].assignedToRole;
                //assigned to role - by user or by profile
                this.assignedToArray = this.sharedDetails[0].assignedToArray;
                //selected profile
                this.profileNames = this.sharedDetails[0].profileName;

                //if form title, logo status and activeStatus not created in db, add it to existing object
                //otherwise newly created form structure will be wrong
                if (!this.formTitles && this.leadCapFields?.length > 0) {
                  this.formTitles = [];
                  this.leadCapFields.forEach((field) => {
                    //store title as 'Contact Us' initially, user can change it later
                    this.formTitles.push('Contact Us');
                  });
                }
                if (!this.logoStatus && this.leadCapFields?.length > 0) {
                  this.logoStatus = [];
                  this.leadCapFields.forEach((field) => {
                    //initially set logoStatus as false
                    this.logoStatus.push(false);
                  });
                }
                if (!this.activeStatus && this.leadCapFields?.length > 0) {
                  this.activeStatus = [];
                  this.leadCapFields.forEach((field) => {
                    //initially set logoStatus as false
                    this.activeStatus.push(true);
                  });
                }

                if (
                  !this.byProfileCallerIndex &&
                  this.leadCapFields?.length > 0
                ) {
                  this.byProfileCallerIndex = [];
                  this.leadCapFields.forEach((field) => {
                    //initially set byProfileCallerIndex as 0
                    this.byProfileCallerIndex.push(0);
                  });
                }

                if (!this.byUserCallerIndex && this.leadCapFields?.length > 0) {
                  this.byUserCallerIndex = [];
                  this.leadCapFields.forEach((field) => {
                    //initially set byUserCallerIndex as 0
                    this.byUserCallerIndex.push(0);
                  });
                }

                if (!this.assignedToRole && this.leadCapFields?.length > 0) {
                  this.assignedToRole = [];
                  this.leadCapFields.forEach((field) => {
                    //initially set byUserCallerIndex as 0
                    this.assignedToRole.push('By User');
                  });
                }

                if (!this.profileNames && this.leadCapFields?.length > 0) {
                  this.profileNames = [];
                  this.leadCapFields.forEach((field) => {
                    //initially set profileName as '' since default role assigned is by users
                    this.profileNames.push('');
                  });
                }

                //if assignedtoarray is not present in db
                if (!this.assignedToArray && this.leadCapFields?.length > 0) {
                  this.assignedToArray = [];
                  this.leadCapFields.forEach((field) => {
                    if (field) {
                      //get assignedTo value from the columns and store its id in assignedto array
                      Object.values(field)?.forEach((col: leadCaptureModel) => {
                        if (col.columnDef == 'assignedTo') {
                          let subUserId = col.defaultValue;
                          let subUser = this.subUserList.filter(
                            (val) => val.userId == subUserId
                          );
                          let subUserDocId = subUser.map((val) => val.docId);
                          //initially set assignedto array as subuser id of already saved subuser
                          this.assignedToArray.push(subUserDocId);
                        }
                      });
                    } else {
                      //push null value for inactive forms
                      this.assignedToArray.push(null);
                    }
                  });
                }
              } else {
                //if fields not available in db, initialise the fields
                this.leadCaptureId = null;
                this.leadCapFields = [];
              }
              //initialise form names array
              if (this.forms == undefined) this.forms = [];
              //initialise form titles array
              if (this.formTitles == undefined) this.formTitles = [];

              //find the no of active forms
              this.activeFormsLength = 0;
              this.activeFormsLength =
                this.activeStatus?.filter(Boolean).length;
              //prevent reset of selected form id on subscription change else always first form will be loaded on subscription change
              if (this.valReset) {
                this.valReset = false;
                //find the index of first true element in activeStatus to get the id of first active form
                const trueVal = (element) => element == true;
                this.firstFormId = this.activeStatus?.findIndex(trueVal);
                //first form to display is the first active form
                this.selectedFormId = this.firstFormId;
              }

              //assign selected form as first form in the array
              this.selectedFormName = this.forms[this.selectedFormId];
              //get the title of the selected form
              this.selectedFormTitle = this.formTitles[this.selectedFormId];
              //get the logo status of the selected form
              this.logoStatusVal = this.logoStatus[this.selectedFormId]
                ? this.logoStatus[this.selectedFormId]
                : false;
              //get the profile index of the selected form
              this.selectedbyProfileCallerIndex = this.byProfileCallerIndex[
                this.selectedFormId
              ]
                ? this.byProfileCallerIndex[this.selectedFormId]
                : 0;
              //get the user index of the selected form
              this.selectedbyUserCallerIndex = this.byUserCallerIndex[
                this.selectedFormId
              ]
                ? this.byUserCallerIndex[this.selectedFormId]
                : 0;
              //get the assigned to role value of the selected form
              this.selectedAssignedToRole = this.assignedToRole[
                this.selectedFormId
              ]
                ? this.assignedToRole[this.selectedFormId]
                : 'By User';
              //get the assigned to array value of the selected form
              this.selectedAssignedToArray = this.assignedToArray[
                this.selectedFormId
              ]
                ? this.assignedToArray[this.selectedFormId]
                : [];
              //check if selectedArray has any inactive user, if its there, remove it
              this.selectedAssignedToArray.forEach((docId, index) => {
                if (!this.subUserDocIds.includes(docId)) {
                  this.selectedAssignedToArray.splice(index, 1);
                }
              });
              if (this.selectedAssignedToArray.length > 0) {
                this.selectedAssignedToArrayName = [];
                //separate user names to display in the list
                this.selectedAssignedToArray.forEach((docId, index) => {
                  this.subUserList.forEach((user) => {
                    if (docId == user.docId) {
                      this.selectedAssignedToArrayName[index] = user.name;
                    }
                  });
                });
              } else {
                this.selectedAssignedToArrayName = [];
              }

              //get the logo status of the selected form
              this.logoStatusVal = this.logoStatus[this.selectedFormId]
                ? this.logoStatus[this.selectedFormId]
                : false;
              //get the profilename for the selected form
              this.selectedProfileName = this.profileNames[this.selectedFormId]
                ? this.profileNames[this.selectedFormId]
                : '';
              //create the url for iframe
              this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.url + '/' + this.leadCaptureId + '/' + this.selectedFormId
              );
              //getting pipeline of customer
              this.customerPipelines = JSON.parse(JSON.stringify(allData.customerPipelines));
              if (this.commonService.userPlan.multiPipelineAccess) {
                // do nothing
              } else {
                this.customerPipelines.length = 1;
              }
              this.selectedContactPipeline =
                this.customerPipelines[0]?.pipelineId;
              this.pipelineChangedEvent(this.selectedContactPipeline);

              //if form fields available in db
              if (this.leadCapFields != undefined) this.getColumns();
              this.progressBarStatus = true;
            });
        } else {
          this.progressBarStatus = false;
        }
      });
  }

  ngOnInit(): void {}
  //remove chip
  remove(index: number, assignee: string): void {
    this.selectedAssignedToArrayName.splice(index, 1);
    this.selectedAssignedToArray.splice(index, 1);
    this.searchInput.nativeElement.focus();
    //this.announcer.announce(`Removed ${assignee}`);
  }
  //add subuser when selected
  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedAssignedToArrayName.push(event.option.value.name);
    this.selectedAssignedToArray.push(event.option.value.docId);
    this.searchInput.nativeElement.focus();
  }
  //filter for mat autocomplete
  private _filter(value: any): string[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.subUserList.filter((val) =>
        val.name.toLowerCase().includes(filterValue)
      );
    }
  }

  //on toggle selection in checkbox
  toggleSelection(option) {
    //if selected option already present, remove it on uncheck
    if (this.selectedAssignedToArray.includes(option.docId)) {
      //if present, remove it on uncheck
      let index = this.selectedAssignedToArray.findIndex(
        (val) => val === option.docId
      );

      if (index >= 0) {
        this.selectedAssignedToArrayName.splice(index, 1);
        this.selectedAssignedToArray.splice(index, 1);
      }
    } else {
      //if selected option not present in assignedToArray, add it on check
      this.selectedAssignedToArrayName.push(option.name);
      this.selectedAssignedToArray.push(option.docId);
    }
    this.searchInput.nativeElement.focus();
  }
  //on clicking back arrow in toolbar
  onBack() {
    this.location.back();
  }
  //function to assign fields of selected form
  getColumns() {
    this.columns = [];
    //if leadCaptureFields present in db, get that values into this.columns onject
    if (this.leadCapFields !== undefined) {
      if (this.leadCapFields[this.selectedFormId]) {
        this.selectedForm = true;
        const fieldObj = this.leadCapFields[this.selectedFormId];
        this.columns = Object.values(fieldObj);
      } else {
        this.selectedForm = false;
      }
    }
    //if not in db, get values from data model
    if (this.leadCapFields == undefined || this.selectedForm == false) {
      this.columns = leadCaptureFields.data;
      this.pipelineChangedEvent(this.customerPipelines[0]?.pipelineId);
    }

    // Adding field customisation values to display headers
    this.columns.forEach((col) => {
      if (this.contactSettings[col.columnDef]) {
        col.header = this.contactSettings[col.columnDef].displayName;
      }
      //pipeline value saved in contactSetting is diff from variable name assigned here
      //so need to manually find columDef with value pipeline and assign displayname from contactSettings to it
      if (this.contactSettings.selectedContactPipeline) {
        if (col.columnDef == 'pipeline') {
          col.header = this.contactSettings.selectedContactPipeline.displayName;
        }
      }
    });

    //Add categories data to display in dropdown
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].columnDef == 'pipeline') {
        //get pipelineIds
        let pipelineIds = [];
        this.customerPipelines.forEach(pipe => {
          pipelineIds.push(pipe.pipelineId);
        })
        this.columns[i].categories = pipelineIds;
        this.getStatusArray(this.columns[i].defaultValue);
      } else if (this.columns[i].columnDef == 'status') {
        //get only status array names to push to categories
        let statusIds = [];
        this.statusArray.forEach(elem => {
          statusIds.push(elem.stageId);
        })
        this.columns[i].categories = statusIds;
      } else if (this.columns[i].columnDef == 'custLeadValue') {
        this.columns[i].categories = this.leadSource;
        this.columns[i].defaultValue = this.columns[i].defaultValue
          ? this.columns[i].defaultValue
          : this.leadSource[0];
      }
      /*Assigned to fields are removed from this.columns to implement assignedtoArray concept*/
      // } else if (this.columns[i].columnDef == 'assignedTo') {
      //   this.columns[i].categories = this.assignedToArray;
      //   this.columns[i].defaultValue = this.columns[i].defaultValue ? this.columns[i].defaultValue : this.superUserId;
      // } else if (this.columns[i].columnDef == 'assignedToName') {
      //   this.columns[i].categories = this.subUserNames;
      //   this.columns[i].defaultValue = this.columns[i].defaultValue ? this.columns[i].defaultValue : this.superUserName;
      // }
    }

    if (this.customFields?.length > 0) {
      //Check if all the additional fields are available in leadCaptureFields
      this.customFields.forEach((field, index) => {
        let present: boolean = false;
        this.columns.forEach((col) => {
          if (index == col.custIndex) {
            present = true;
            (col.columnDef = field.fieldName),
              (col.header = field.fieldName),
              (col.categories = field.categories),
              // col.mandatory = field.mandatory;
              (col.isActive = field.isActive);
          }
        });
        //if not available, push them to this.columns
        if (present == false) {
          let noOfCols = this.columns.length;
          //if field type is date_time, convert date and time format
          if (field.fieldType == 'date_time') {
            this.columns.push({
              columnDef: field.fieldName,
              header: field.fieldName,
              position: noOfCols,
              display: false,
              inputType: field.fieldType,
              categories: field.categories,
              mandatory: false,
              fieldType: 'default_field',
              defaultValue: field.defaultValue
                ? field.defaultValue.toDate()
                : '',
              defaultValue2: field.defaultValue
                ? this.getTimeValue(field.defaultValue)
                : '00:00',
              customField: true,
              custIndex: index,
              isActive: field.isActive,
            });
            //if field type is date, convert date format
          } else if (field.fieldType == 'date') {
            this.columns.push({
              columnDef: field.fieldName,
              header: field.fieldName,
              position: noOfCols,
              display: false,
              inputType: field.fieldType,
              categories: field.categories,
              mandatory: false,
              fieldType: 'default_field',
              defaultValue: field.defaultValue
                ? field.defaultValue.toDate()
                : '',
              customField: true,
              custIndex: index,
              isActive: field.isActive,
            });
          } else {
            //push other than date fields
            this.columns.push({
              columnDef: field.fieldName,
              header: field.fieldName,
              position: noOfCols,
              display: false,
              inputType: field.fieldType,
              categories: field.categories,
              mandatory: false,
              fieldType: 'default_field',
              defaultValue: field.defaultValue,
              customField: true,
              custIndex: index,
              isActive: field.isActive,
            });
          }
        }
      });

      //convert date and date_time fields if not converted
      for (let i = 0; i < this.columns.length; i++) {
        if (
          this.columns[i].customField == true &&
          (this.columns[i].inputType == 'date' ||
            this.columns[i].inputType == 'date_time')
        ) {
          this.columns[i].defaultValue = this.columns[i].defaultValue
            ? !!this.columns[i].defaultValue.toDate
              ? this.columns[i].defaultValue.toDate()
              : this.columns[i].defaultValue
            : '';
        }
      }
    } else {
      //if no custom fields available, add other fields to this.columns
      const tempArray: any = [];
      let index = 0;
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].customField === false) {
          tempArray[index++] = this.columns[i];
        }
      }
      this.columns = tempArray;
    }
  }

  // update logostatus on clicking toggle button
  logoStatusUpdate(i) {
    this.progressBarStatus = false;
    if (this.logoStatus.length == 0) {
      this.logoStatus.push(this.logoStatusVal);
    } else {
      this.logoStatus[i] = this.logoStatusVal;
    }
    //save logo status to db
    this.db.logoStatus(this.leadCaptureId, this.logoStatus).then((res) => {
      this.progressBarStatus = true;
    });
  }

  //Add new form field enabled
  addNewForm() {
    //check if max forms added
    if (this.activeFormsLength >= this.maxLimitForm) {
      this.snack.open('You have reached the maximum limit', '', {
        duration: 2000,
      });
    } else {
      //if limit not reached display add form field
      this.formName = '';
      this.displayFormField = true;
    }
  }
  //creates new form on submitted values in add form field
  createForm() {
    this.progressBarStatus = false;
    //new form id
    this.formId = this.forms.length;
    //push new form name to forms array
    this.forms.push(this.formName);
    //add title of new form as 'contact us' by default
    this.formTitles.push('Contact Us');
    //now selected form will be the new form
    this.selectedFormId = this.formId;
    //logo status of new form will be false by default
    this.logoStatus.push(false);
    //active status of new form will be true by default
    this.activeStatus.push(true);
    this.logoStatusVal = false;
    //push default byProfileCallerIndex value
    this.byProfileCallerIndex.push(0);
    //push default byUserCallerIndex value
    this.byUserCallerIndex.push(0);
    //push default assignedToRole value
    this.assignedToRole.push('By User');
    //push default profile name
    this.profileNames.push('');
    //generate the fields for the new form in getColumns()
    this.getColumns();
    //Convert fields array as object before saving to db
    const fieldsArray = {};
    Object.keys(this.columns).forEach((key, index) => {
      fieldsArray[index] = this.columns[key];
    });
    //push the new columns values
    if (this.leadCapFields == undefined) this.leadCapFields = [];
    this.leadCapFields[this.selectedFormId] = fieldsArray;
    //convert to object before saving to db as it doesnot allow array of arrays
    const assignToArray = {};
    Object.keys(this.assignedToArray).forEach((key, index) => {
      assignToArray[index] = this.assignedToArray[key];
    });
    //push assignedto array values for the new form
    assignToArray[this.selectedFormId] = [];

    //if this is the first form, add it to the new collection
    if (this.sharedDetails.length == 0) {
      this.db
        .createSharedLeadCaptureForm(
          this.superUserId,
          this.leadCapFields,
          this.forms,
          this.formTitles,
          this.logoStatus,
          this.activeStatus,
          this.userLogo,
          this.byProfileCallerIndex,
          this.byUserCallerIndex,
          this.assignedToRole,
          assignToArray,
          this.profileNames
        )
        .then((result) => {
          this.leadCaptureId = result.id;
          this.progressBarStatus = true;
          this.snack.open('Form added successfully', '', {
            duration: 2000,
          });
        });
    } else {
      //if collection exists, update it
      this.db
        .updateFieldSettings(
          this.leadCaptureId,
          this.leadCapFields,
          this.forms,
          this.formTitles,
          this.logoStatus,
          this.activeStatus,
          this.userLogo,
          this.byProfileCallerIndex,
          this.byUserCallerIndex,
          this.assignedToRole,
          assignToArray,
          this.profileNames
        )
        .then((result) => {
          this.progressBarStatus = true;
          this.snack.open('Form added successfully', '', {
            duration: 2000,
          });
        });
    }
    //hide add new form field
    this.displayFormField = false;
  }
  //display edit title field
  editTitle() {
    this.editFormTitle = true;
  }
  //clear title on closing title field
  clearTitle(i) {
    this.editFormTitle = false;
    this.selectedFormTitle = this.formTitles[this.selectedFormId];
  }
  //save newly edited form title
  saveTitle(i, formTitle) {
    this.progressBarStatus = false;
    this.editFormTitle = false;
    this.formTitles[i] = formTitle;
    this.db.updateFormTitle(this.leadCaptureId, this.formTitles).then((res) => {
      this.progressBarStatus = true;
      this.snack.open('Successfully updated', '', {
        duration: 500,
      });
    });
  }
  //to convert time value
  getTimeValue(defaultValue) {
    return new Date(defaultValue.seconds * 1e3).toString().split(' ')[4];
  }
  //when user select a form get selected forms title, id, stauts etc
  onSelectForm(i) {
    //get all values for the currently selected form
    this.select = true;
    this.selectedForm = false;
    this.selectedFormId = i;
    this.selectedFormName = this.forms[this.selectedFormId];
    this.selectedFormTitle = this.formTitles[this.selectedFormId];
    this.logoStatusVal = this.logoStatus[this.selectedFormId];
    this.selectedbyProfileCallerIndex =
      this.byProfileCallerIndex[this.selectedFormId];
    this.selectedbyUserCallerIndex =
      this.byUserCallerIndex[this.selectedFormId];
    this.selectedAssignedToRole = this.assignedToRole[this.selectedFormId];
    this.selectedAssignedToArray = this.assignedToArray[this.selectedFormId]
      ? this.assignedToArray[this.selectedFormId]
      : [];
    if (this.selectedAssignedToArray.length > 0) {
      this.selectedAssignedToArrayName = [];
      //separate user names to display in the list
      this.selectedAssignedToArray.forEach((docId, index) => {
        this.subUserList.forEach((user) => {
          if (docId == user.docId) {
            this.selectedAssignedToArrayName[index] = user.name;
          }
        });
      });
    } else {
      this.selectedAssignedToArrayName = [];
    }
    this.selectedProfileName = this.profileNames[this.selectedFormId];
    //generate link for copying selected form
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.url + '/' + this.leadCaptureId + '/' + this.selectedFormId
    );
    this.getColumns();
  }
  //on editing form name
  editformName(i, elem) {
    this.editFormName = elem;
    this.setedit = true;
    this.formToEdit = i;
  }
  //save edited form name to db
  submitFormName(i) {
    this.progressBarStatus = false;
    this.forms[i] = this.editFormName;
    this.db.updateFormName(this.leadCaptureId, this.forms).then((res) => {
      this.progressBarStatus = true;
      this.snack.open('Form name updated successfully', '', {
        duration: 2000,
      });
    });
    this.setedit = false;
  }
  //on deleting a form
  deleteForm(i) {
    //open confirmation popup
    let dialog = this.dialog.open(ConfirmationpopupComponent, {
      data: {
        smode: 'LeadCaptureFormDelete',
        formName: this.forms[i],
      },
    });
    //perform delete action on confirming delete form
    dialog.afterClosed().subscribe((result) => {
      if (result == 'delete') {
        this.progressBarStatus = false;
        //remove form fields from main object
        this.leadCapFields[i] = null;
        //remove form name
        this.forms[i] = null;
        //remove form title
        this.formTitles[i] = null;
        //remove logo status
        this.logoStatus[i] = false;
        //set active status to false
        this.activeStatus[i] = false;
        //update values after delete in db
        this.byProfileCallerIndex[i] = null;
        this.byUserCallerIndex[i] = null;
        this.assignedToRole[i] = null;
        this.assignedToArray[i] = null;
        this.profileNames[i] = null;

        //Convert arrays to objects to save to db
        const assignToArray = {};
        Object.keys(this.assignedToArray).forEach((key, index) => {
          assignToArray[index] = this.assignedToArray[key];
        });

        this.db
          .updateFieldSettings(
            this.leadCaptureId,
            this.leadCapFields,
            this.forms,
            this.formTitles,
            this.logoStatus,
            this.activeStatus,
            this.userLogo,
            this.byProfileCallerIndex,
            this.byUserCallerIndex,
            this.assignedToRole,
            assignToArray,
            this.profileNames
          )
          .then((res) => {
            this.progressBarStatus = true;
            this.snack.open('Form deleted successfully', '', {
              duration: 2000,
            });
          });

        //find the index of first true element in activeStatus to get the id of first active form
        const trueVal = (element) => element == true;
        this.firstFormId = this.activeStatus?.findIndex(trueVal);
        //first form to display is the first active form
        this.selectedFormId = this.firstFormId;

        //make selected form as the first form after delete
        this.onSelectForm(this.firstFormId);
      }
    });
  }
  //on drag and drop fields
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.columns[event.currentIndex].position = event.currentIndex;
    this.columns[event.previousIndex].position = event.previousIndex;
    //save the newly arranged feilds to db
    this.saveChanges();
  }
  //convert a field type on selecting check box
  toggleInputField(i) {
    //clear field values if not category, otherwise default values entered before changing field type appear on form
    if (
      this.columns[i].fieldType == 'default_field' &&
      this.columns[i].columnDef == 'pipeline'
    ) {
      this.columns[i].defaultValue = 0;
    } else if (
      this.columns[i].fieldType == 'default_field' &&
      this.columns[i].inputType == 'category'
    ) {
      this.columns[i].defaultValue = this.columns[i].categories[0];
    } else if (
      this.columns[i].fieldType == 'default_field' &&
      this.columns[i].inputType == 'date_time'
    ) {
      this.columns[i].defaultValue = '';
      this.columns[i].defaultValue2 = '00:00';
    } else if (this.columns[i].fieldType == 'default_field') {
      this.columns[i].defaultValue = '';
    }
    //toggle field type on selecting checkbox
    if (this.columns[i].fieldType == 'default_field') {
      this.columns[i].fieldType = 'input_field';
    } else {
      this.columns[i].fieldType = 'default_field';
    }
  }
  //save values enetered in default values
  saveDefaultValue(form) {
    this.assignedToRole[this.selectedFormId] = this.selectedAssignedToRole;
    this.assignedToArray[this.selectedFormId] = this.selectedAssignedToArray;
    this.profileNames[this.selectedFormId] = this.selectedProfileName;
    // //if assignedTo value not selected, assigned to will be superuser
    // form.value.assignedToName = form.value.assignedToName
    //   ? form.value.assignedToName
    //   : this.superUserDetails.lastname
    //   ? this.superUserDetails.firstname + ' ' + this.superUserDetails.lastname
    //   : this.superUserDetails.firstname;
    //getting form values
    let cols = form.value;
    //store assignedtoname to variable
    // let assignedToName = form.value.assignedToName;
    // let assignedIndex;
    // if(form.value.assignedToName){
    //   //find index of selected assignedtoname
    //   assignedIndex = this.subUserNames.findIndex(
    //     (s) => s === assignedToName
    //   );

    //   let assignedTo = this.subUserIDs[assignedIndex];
    //   Object.assign(form.value,{assignedTo: assignedTo});
    // }

    //assign values from form to default values of each field in the column obj
    for (let i = 0; i < this.columns.length; i++) {
      //initialise with empty string
      this.columns[i].defaultValue = '';
      for (var j in cols) {
        //if field is not a custom fields, its name id columnDef value, so get it and assign the value to defaultValue
        if (!this.columns[i].customField && this.columns[i].columnDef == j) {
          //assign assignedto value using index obtained from assigned to name
          // if (this.columns[i].columnDef == 'assignedTo') {
          //   this.columns[i].defaultValue = this.subUserIDs[assignedIndex];

          // }
          // else {
          //assign each value to defaultvalue
          this.columns[i].defaultValue = cols[j];
          //}
        }
        //if field is a customfield, its name is its index, so get value from form using index
        //consider only active fields else values get wrongly assigned to inactive fields with same name
        else if (this.columns[i].customField) {
          if (this.columns[i].isActive) {
            if (this.columns[i].custIndex == j) {
              //store the form value to default value
              this.columns[i].defaultValue = cols[j];
            }
          } else {
            //set inactive field's value as null
            this.columns[i].defaultValue = null;
          }
        }
      }
    }
    //convert date and time values to 00 if not selected in the form
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].inputType == 'date_time') {
        if (
          this.columns[i].defaultValue2 == '' ||
          this.columns[i].defaultValue2 == undefined
        ) {
          this.columns[i].defaultValue2 = '00:00';
        }
      }
    }
    this.saveChanges();
  }
  //update changes to db
  saveChanges() {
    this.progressBarStatus = false;
    this.dataSaved = true;
    const fieldsArray = {};
    //add the changed form value to main object to save in db
    Object.keys(this.columns).forEach((key, index) => {
      fieldsArray[index] = this.columns[key];
    });
    if (this.leadCapFields == undefined) this.leadCapFields = [];

    this.leadCapFields[this.selectedFormId] = fieldsArray;
    const assignToArray = {};
    Object.keys(this.assignedToArray).forEach((key, index) => {
      assignToArray[index] = this.assignedToArray[key];
    });

    //update the object in db
    this.db
      .updateFieldSettings(
        this.leadCaptureId,
        this.leadCapFields,
        this.forms,
        this.formTitles,
        this.logoStatus,
        this.activeStatus,
        this.userLogo,
        this.byProfileCallerIndex,
        this.byUserCallerIndex,
        this.assignedToRole,
        assignToArray,
        this.profileNames
      )
      .then((res) => {
        this.progressBarStatus = true;
        this.snack.open('Form settings updated successfully', '', {
          duration: 2000,
        });
      });
  }



  //to get the value of selected pipeline and status
  pipelineChangedEvent(pipelineId) {
    this.getStatusArray(pipelineId);
    //get only status array names to push to categories
    let statusIds = [];
    this.statusArray.forEach(elem => {
      statusIds.push(elem.stageId);
    })
    //assign selected pipeline and status values to column fields
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].columnDef == 'status') {
        this.columns[i].categories = statusIds;
        this.columns[i].defaultValue = this.statusArray[0]?.stageId;
      }
      if (this.columns[i].columnDef == 'pipeline') {
        this.columns[i].defaultValue = this.selectedContactPipeline;
      }
    }
  }
  //to get status array
  getStatusArray(pipelineId) {
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
  }

  //function to enable copying link
  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snack.open('Link copied successfully', '', {
      duration: 500,
    });
  }
  //triggers when user changes the assigned role
  changeAssignedArray() {
    if (this.selectedAssignedToRole == 'By Profile') {
      this.selectedAssignedToArray = [];
      this.selectedAssignedToArrayName = [];
      //separate user names  to show in the list
      // this.selectedAssignedToArray.forEach((docId, index) => {
      //   this.subUserList.forEach(user => {
      //     if(docId == user.docId){
      //       this.selectedAssignedToArrayName[index] = user.name;
      //     }
      //   })
      // })
      this.byProfileCallerIndex[this.selectedFormId] = 0;
    } else {
      this.byUserCallerIndex[this.selectedFormId] = 0;
    }
  }
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    //to unsubscribe subscriptions
    this.userDetailsSubscription?.unsubscribe;
  }
}
