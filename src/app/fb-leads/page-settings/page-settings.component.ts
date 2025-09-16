/**********************************************************************************
Description: Component is used to configure fb Lead Forms and create mapping between fb form fields and CRM fields.
             Data submitted through fb forms are captured and saved to CRM db using mapped CRM fields.
Inputs: mode, page_ID, page_Name, form_ID, form_Name, questions/fields present in the form, obtained from the parent component
Outputs:
Parent : fbLeadsComponent :-
        Description: Used to retrieve the page details, configured in fb and pass it to child component to create field mapping and configuration
**********************************************************************************/

import {
  contactSettings,
  defaultContactSettings,
  fbLeadsIntegrationFields,
  fbLeadsIntegrationModel,
  fbLeadsModel,
  mapToFields,
  questionsModel
} from 'src/app/data-models';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { CommonService } from 'src/app/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAccessDetails } from './../../data-models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { PageSettingsService } from './page-settings.service';
import { FormControl, NgForm } from '@angular/forms';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Pipelines } from 'src/app/model/pipeline.modal';

@Component({
  selector: 'app-page-settings',
  templateUrl: './page-settings.component.html',
  styleUrls: ['./page-settings.component.scss'],
})
export class PageSettingsComponent implements OnInit, OnDestroy {
  /** Subject that emits when the component has been destroyed.*/
  private onDestroy$: Subject<void> = new Subject<void>();
  @Input() labelPosition: 'before' | 'after'; //for checkbox label
  @Input() mode: string; //to get the modes - create/edit
  @Input() page_ID: string; //page id
  @Input() page_Name: string; //page name
  @Input() form_ID: string; //form id
  @Input() form_Name: string; //form name
  @Input() questions: questionsModel[]; //fields of the form
  @ViewChild('leadCaptureForm') leadCaptureForm: NgForm; //form element
  progressBarStatus: Boolean = false; //progressBarStatus
  userDetailsSubscription: Subscription; //Common service subscription to get userdetails
  superUserId: any; //to store superuser's id
  superUserDetails: any; //to store superuser's details
  superUserName: string; //to store superuser's name
  columns = []; //to store each form's fields
  leadSource: any[]; //to store lead source values
  plan: any; //to store user's subscription plan
  customerPipelines: Pipelines[] = []; //to store pipelineNames of customer
  selectedContactPipeline: number; //to store current pipeline number of customer
  statusArray: any[]; //to store the status Array
  customerStatus: string; //to store current status
  formId: string[] = []; //initialise first form id as 0
  selectedFormId: number = 0; //set initial form id selected as 0
  forms: any[] = []; //to store the form names
  maxLimitForm: number = 5; //to limit the number of forms created
  formFields: any = []; //to store entire form object
  urlSafe: SafeResourceUrl; //to bypass url check in iframe
  select: boolean = false; //to check if form is selected or not
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
  pageDetails: fbLeadsIntegrationModel[]; //model for creating leadcapture from object
  editFormTitle: boolean = false; //edited form title
  //customisation field
  contactSettings: contactSettings;
  activeFormsLength: number; //To store the length of active forms
  activeStatus: boolean[] = []; //to store the active status of the form
  firstFormId: number; //To store the form id of first active form
  valReset: boolean = true; //to prevent value being reset on change in subscription
  form_id_selected: string; //selected form id
  mapToFields: any[] = []; //fields to which fbfields are mapped
  mappedFields: any[] = []; //fields of crm that are mapped to fb fields
  subUserList: any[] = []; //stores subuser details
  assignedToArray: any[] = []; //store assignedToArray for each form
  byProfileCallerIndexArray: number[] = []; //stores byProfileCallerIndex for each form
  byUserCallerIndexArray: number[] = []; //stores byUserCallerIndex for each form
  assignedToRoleArray: any[] = []; //stores assignedtoRole for each form
  selectedAssignedToArray: any[] = []; //assignedToArray of selected form
  selectedAssignedToRole: any; //AssignedToRole of selected form
  selectedByProfileCallerIndex: number; //byProfileCallerIndex of selected form
  selectedByUserCallerIndex: number; //byUserCallerIndex of selected form
  lastData: any[]; //save last chosen configuration
  defaultByProfileCallerIndex: number = 0; //default value for byProfileCallerIndex
  defaultByUserCallerIndex: number = 0; //default value for byUserCallerIndex
  defaultAssignedToRole = 'By User';  //default value for AssignedToRole
  defaultAssignedToArray: any[] = []; //default value for AssignedToArray
  pageId: string[] = []; //initialise first form id as 0
  pageName: string[] = []; //initialise first form id as 0
  profileName: string[] = []; //stores profileName for each form
  selectedProfileName: string; //profileName of selected form
  defaultProfiles: {}[]; //Currently available profiles
  profilesList: any[]; //profile list to display in dropdown
  filteredOptions: Observable<string[]>; //filtered taggedUsers list
  selectedAssignedToArrayName = []; //to store assignedToArray for the selected form
  separatorKeysCodes: number[] = [ENTER, COMMA]; //mat autocomplete key codes
  searchCtrl = new FormControl('');//assignedTo input formcontrol
  @ViewChild('searchInput') searchInput: ElementRef; //input box element for searching form

  constructor(
    private location: Location,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    private snack: MatSnackBar,
    public sanitizer: DomSanitizer,
    private db: PageSettingsService,
    private cdRef: ChangeDetectorRef,
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
                docId: subUser.id,
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
          //stores the Ids of all available subusers to create a default array for assignedTo
          this.defaultAssignedToArray = this.subUserList.map(
            value => value.docId
          );

          //assigning filteredOptions w.r.t searchterm
          this.filteredOptions = this.searchCtrl.valueChanges.pipe(
            startWith(''),
            map((name: string | '') => (name ? this._filter(name) : this.subUserList.slice())),
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
            //we dont need superuser profile in the list, hence removing it
            pArray.forEach((value, index) => {
              if (value == 'SuperUser') pArray.splice(index, 1);
            });
            this.profilesList = pArray;
          });


          //get the details of user profile assigned to the user to check access control
          this.usrProfileData = allData.usrProfileData;
          if (this.usrProfileData) {
            //check if setting view is allowed
            if (this.usrProfileData.isCheckedSett == false) {
              this.notEdit = true;
            } else {
              //check if user has view access to the settings
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
            //getting customisation field from data-model if its not available in db
            this.contactSettings = defaultContactSettings.CONST_VALUE;
          } else {
            //if available, get customisation field from db
            this.contactSettings = allData.superUserDetails.contactSettings;
          }

          //get customFields for contact
          this.customFields = allData.superUserDetails.customFieldsContact;
          //get lead source
          this.leadSource = allData.superUserDetails.custLead;

          //get current subscription plan
          this.plan = allData.superUserDetails.plan;
          //get customer pipelines from common service file
          this.customerPipelines = JSON.parse(JSON.stringify(allData.customerPipelines));
          //if user has multiple pipeline access, show all pipelines 
          if (this.commonService.userPlan.multiPipelineAccess) {
          // do nothing
          } else {
            //if user doesnt have multiple pipeline access, show first pipeline
            this.customerPipelines.length = 1;
          }
          //initialise first pipeline's id as default pipeline value
          this.selectedContactPipeline =
            this.customerPipelines[0]?.pipelineId;
            //get the status array and current default status id 
          this.pipelineChangedEvent(this.selectedContactPipeline);
          //If its in edit mode
          if (this.mode == 'edit') {
            //get all the forms under this superuser from fbLeadIntegration collection
            this.db
              .getFbLeadsIntegrationForms(this.superUserId)
              .pipe(takeUntil(this.onDestroy$))
              .subscribe((data) => {
                this.pageDetails = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as fbLeadsIntegrationModel;
                });

                //if leadcapture fields available in db
                if (this.pageDetails) {
                  //find the number of forms present
                  this.activeFormsLength = this.pageDetails.length;
                  this.pageDetails.forEach((form, index) => {
                    //get page id
                    this.pageId[index] = form.pageId;
                    //get page name
                    this.pageName[index] = form.pageName;
                    //get form id
                    this.formId[index] = form.formId;
                    //get form names
                    this.forms[index] = form.formName;
                    //get forms object
                    this.formFields[index] = form.Fields;
                    //get assignedto array
                    this.assignedToArray[index] = form.assignedToArray;
                    //get the assignedto role
                    this.assignedToRoleArray[index] = form.assignedToRole;
                    //get byprofilecallerIndex
                    this.byProfileCallerIndexArray[index] =
                      form.byProfileCallerIndex;
                      //get byUserCallerIndex
                    this.byUserCallerIndexArray[index] = form.byUserCallerIndex;
                    //get the profilename
                    this.profileName[index] = form.profileName;
                  });
                } else {
                  //if fields not available in db, initialise the fields
                  this.formFields = [];
                  this.forms = [];
                  this.formId = [];
                }

                //assign selected form as first form in the array. Get values of the selected form into corresponding variables to display in UI
                this.page_ID = this.pageId[this.selectedFormId];
                this.page_Name = this.pageName[this.selectedFormId];
                this.selectedFormName = this.forms[this.selectedFormId];
                this.form_id_selected = this.formId[this.selectedFormId];
                this.selectedAssignedToArray =
                  this.assignedToArray[this.selectedFormId] ?
                  this.assignedToArray[this.selectedFormId] :
                  [];
                //check if selectedArray has any inactive user, if its there, remove it. Always do this check because 
                //if any subuser was suspended after saving this form data, that has to be removed
                this.selectedAssignedToArray.forEach((docId,index) => {
                  if(!this.defaultAssignedToArray.includes(docId)) {
                    this.selectedAssignedToArray.splice(index,1);
                  }
                })
                //using selected assignedtoArray, get the assignedToArrayName
                if(this.selectedAssignedToArray.length > 0){
                  this.selectedAssignedToArrayName = []
                  //separate user names  to show in the list
                  this.selectedAssignedToArray.forEach((docId, index) => {
                      this.subUserList.forEach(user => {
                        if(docId == user.docId){
                          this.selectedAssignedToArrayName[index] = user.name;
                        }
                      })
                    })
                } else {
                  this.selectedAssignedToArrayName = [];
                }
                //fetch assignedtoRole for selected form
                this.selectedAssignedToRole =
                  this.assignedToRoleArray[this.selectedFormId];
                //get byProfileCallerIndex for selected form  
                this.selectedByProfileCallerIndex =
                  this.byProfileCallerIndexArray[this.selectedFormId];
                  //get byUserCallerIndex for selected form  
                this.selectedByUserCallerIndex =
                  this.byUserCallerIndexArray[this.selectedFormId];
                  //get profile name for selected form
                 this.selectedProfileName = this.profileName[this.selectedFormId] ? this.profileName[this.selectedFormId] : '';
                //if form fields are available in db, we return the form fields from this function
                if (this.formFields != undefined) this.getColumns();
                this.progressBarStatus = true;
              });
          //create mode for configuring new forms    
          } else if (this.mode == 'create') {
            //if fields not available in db, initialise the fields
            this.formFields = [];
            this.forms = [];
            this.formId = [];
            //assign selected form as first form in the array
            this.selectedFormName = this.form_Name;
            //get selected form's id
            this.form_id_selected = this.form_ID;
            //initialise selected form's assignedToArray
            this.selectedAssignedToArray = [];
            //initialise selected form's assignedToArrayName
            this.selectedAssignedToArrayName = [];
            //initialise assignedToRole with default value 'By User'
            this.selectedAssignedToRole = this.defaultAssignedToRole;
            //set byProfileCallerIndex as 0
            this.selectedByProfileCallerIndex =
              this.defaultByProfileCallerIndex;
            //set byUserCallerIndex as 0
            this.selectedByUserCallerIndex = this.defaultByUserCallerIndex;
            //set profilename as ''
            this.selectedProfileName = '';
            //if formfields are not undefined, we get the formfields for selected form 
            if (this.formFields != undefined) this.getColumns();
            this.progressBarStatus = true;
          }
        } else {
          //if data not avaialable show progress bar
          this.progressBarStatus = false;
        }
      });
  }

  ngOnInit(): void {}
  
   //remove assigned to name chip
   remove(index: number, assignee: string): void {
    //remove assignedto user from assignedToArray and assignedToArrayName when user removes the assigneee
    this.selectedAssignedToArrayName.splice(index, 1);
    this.selectedAssignedToArray.splice(index,1);
    //show message on removing assignee
    this.announcer.announce(`Removed ${assignee}`);
    this.searchInput.nativeElement.focus();
  }
  //add assignee to array when selected from subuser list
  selected(event: MatAutocompleteSelectedEvent): void {
    //add assignee name to name array
    this.selectedAssignedToArrayName.push(event.option.value.name);
    //add assignee id to assignedToArray
    this.selectedAssignedToArray.push(event.option.value.docId);
    this.searchInput.nativeElement.focus();
  }
  //filter for mat autocomplete
  private _filter(value: any): string[] {
    //if value is string, filter the subuserlist using the string
    if(typeof value === 'string'){
      //change the value to lowecase for matching string without case
      const filterValue = value.toLowerCase();
      //filter subuser's naem using the value
      return this.subUserList.filter(val => val.name.toLowerCase().includes(filterValue));
    }
  }

  //called on selecting checkbox when assignee is selected
  toggleSelection(option){
    //chwck if selected option is already present
    if(this.selectedAssignedToArray.includes(option.docId)){
      //if present, remove it on uncheck
      let index = this.selectedAssignedToArray.findIndex(val => val === option.docId);
      if(index >= 0) {
        this.selectedAssignedToArrayName.splice(index, 1);
        this.selectedAssignedToArray.splice(index,1);
      }
    } else {
      //if selected option not present in assignedToArray, add it on check
      this.selectedAssignedToArrayName.push(option.name);
      this.selectedAssignedToArray.push(option.docId);
    }
    this.searchInput.nativeElement.focus();
  }
  //Function is invoked when there is a change in any parameter values
  ngOnChanges() {
    //On create mode
    if (this.mode == 'create') {
      //if fields not available in db, initialise the fields
      this.formFields = [];
      this.forms = [];
      this.formId = [];
      //assign selected form as the input form passed to the component
      this.selectedFormName = this.form_Name;
      //get selected form id
      this.form_id_selected = this.form_ID;
      //initialise all required fields
      this.selectedAssignedToArray = [];
      this.selectedAssignedToArrayName = [];
      this.selectedAssignedToRole = this.defaultAssignedToRole;
      this.selectedByProfileCallerIndex =
        this.defaultByProfileCallerIndex;
      this.selectedByUserCallerIndex = this.defaultByUserCallerIndex;
      this.selectedProfileName = '';
      //generate fbFields for new form
      this.getColumns();
     //on edit mode 
     }else {
        //get all the forms under this superuser from fbLeadIntegration collection
        this.db
          .getFbLeadsIntegrationForms(this.superUserId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((data) => {
            this.pageDetails = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as fbLeadsIntegrationModel;
            });

            //if leadcapture fields available in db
            if (this.pageDetails) {
              //find the no of active forms
              this.activeFormsLength = this.pageDetails.length;
              this.pageDetails.forEach((form, index) => {
                //get page id
                this.pageId[index] = form.pageId;
                //get page name
                this.pageName[index] = form.pageName;
                //get form id
                this.formId[index] = form.formId;
                //get form names
                this.forms[index] = form.formName;
                //get forms object
                this.formFields[index] = form.Fields;
                this.assignedToArray[index] = form.assignedToArray;
                this.assignedToRoleArray[index] = form.assignedToRole;
                this.byProfileCallerIndexArray[index] =
                  form.byProfileCallerIndex;
                this.byUserCallerIndexArray[index] = form.byUserCallerIndex;
                this.profileName[index] = form.profileName;
              });
            } else {
              //if fields not available in db, initialise the fields
              this.formFields = [];
              this.forms = [];
              this.formId = [];
            }

            //assign selected form as first form in the array
            this.page_ID = this.pageId[this.selectedFormId];
            this.page_Name = this.pageName[this.selectedFormId];
            this.selectedFormName = this.forms[this.selectedFormId];
            this.form_id_selected = this.formId[this.selectedFormId];
            this.selectedAssignedToArray =
              this.assignedToArray[this.selectedFormId] ?
              this.assignedToArray[this.selectedFormId] :
               [];
            //check if selectedArray has any inactive user, if its there, remove it
            this.selectedAssignedToArray.forEach((docId,index) => {
              if(!this.defaultAssignedToArray.includes(docId)) {
                this.selectedAssignedToArray.splice(index,1);
              }
            })
            if(this.selectedAssignedToArray.length > 0){
              this.selectedAssignedToArrayName = []
              //separate user names  to show in the list
              this.selectedAssignedToArray.forEach((docId, index) => {
                this.subUserList.forEach(user => {
                  if(docId == user.docId){
                    this.selectedAssignedToArrayName[index] = user.name;
                  }
                })
              })
            } else {
              this.selectedAssignedToArrayName = [];
            }
            this.selectedAssignedToRole =
              this.assignedToRoleArray[this.selectedFormId];
            this.selectedByProfileCallerIndex =
              this.byProfileCallerIndexArray[this.selectedFormId];
            this.selectedByUserCallerIndex =
              this.byUserCallerIndexArray[this.selectedFormId];
             this.selectedProfileName = this.profileName[this.selectedFormId] ? this.profileName[this.selectedFormId] : '';
            //if form fields available in db
            if (this.formFields != undefined) this.getColumns();
            this.progressBarStatus = true;
          });
    }
  }

  //on clicking back arrow in toolbar
  onBack() {
    this.location.back();
  }

  //function to assign fields of selected form
  getColumns() {
    this.columns = [];
    //if form Fields present in db, get that values into this.columns object
    if (this.formFields !== undefined) {
      if (this.formFields[this.selectedFormId]) {
        this.selectedForm = true;
        const fieldObj = this.formFields[this.selectedFormId];
        this.columns = Object.values(fieldObj);
      } else {
        this.selectedForm = false;
      }
    }
    //if not in db, get values from data model
    if (this.formFields == undefined || this.selectedForm == false) {
      this.questions?.forEach((field, index) => {
        this.columns.push({
          columnDef: field.key,
          header: field.label,
          mappedField: true,
          mappedTo: null,
          position: index,
          display: true,
          inputType: field.type == 'PHONE' ? 'number' : 'inputField',
          categories: null,
          mandatory: false,
          defaultValue: null,
          customField: false,
        });
      });

      //push default fields from data model to this.columns
      fbLeadsIntegrationFields.data.forEach((obj, index) => {
        this.columns.push(obj);
      });
      //get the status value for the first pipeline present in pipeline array
      this.pipelineChangedEvent(this.customerPipelines[0]?.pipelineId);
    }

    // Adding field customisation values to display headers
    this.columns.forEach((col) => {
      if (!col.mappedField) {
        if (this.contactSettings[col.columnDef]) {
          col.header = this.contactSettings[col.columnDef].displayName;
        }
      }
    });

    //Add categories data to display in dropdown
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].columnDef == 'selectedContactPipeline') {
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
        //push lead source values to categories
      } else if (this.columns[i].columnDef == 'custLeadValue') {
        this.columns[i].categories = this.leadSource;
        this.columns[i].defaultValue = this.columns[i].defaultValue
          ? this.columns[i].defaultValue
          : this.leadSource[0];
          //push priority values to categories
      } else if (this.columns[i].columnDef == 'priority') {
        this.columns[i].categories = ['Low', 'Medium', 'High'];
        this.columns[i].defaultValue = this.columns[i].defaultValue
          ? this.columns[i].defaultValue
          : 'Medium';
          //get assignedto values, ie subuser ids
      } else if (this.columns[i].columnDef == 'assignedTo') {
        this.columns[i].categories = this.subUserIDs;
        this.columns[i].defaultValue = this.columns[i].defaultValue
          ? this.columns[i].defaultValue
          : this.superUserId;
          //get ssignedto names. ie. subuser names
      } else if (this.columns[i].columnDef == 'assignedToName') {
        this.columns[i].categories = this.subUserNames;
        this.columns[i].defaultValue = this.columns[i].defaultValue
          ? this.columns[i].defaultValue
          : this.superUserName;
      }
    }

    //generate the list of CRM fields to map to fb page fields
    let ind = 0;
    mapToFields.data.forEach((field) => {
      this.mapToFields[ind++] = {
        columnDef: field.columnDef,
        header: field.header,
        inputType: field.inputType

      };
    });
    //push additional fields also to mapping fields
    if (this.customFields?.length > 0) {
      this.customFields.forEach((field, index) => {
        if (field.isActive) {
          this.mapToFields[ind++] = {
            columnDef: field.fieldName,
            header: field.fieldName,
            customField: true,
            isActive: true,
            custIndex: index,
            inputType: field.fieldType
          };
        }
      });
    }

    if (this.customFields?.length > 0) {
      //Check if all the additional fields are available in leadCaptureFields
      this.customFields.forEach((field, index) => {
        let present: boolean = false;
        this.columns.forEach((col) => {
          if (index == col.custIndex) {
            present = true;
            if (!col.mappedField) {
              (col.columnDef = field.fieldName), (col.header = field.fieldName);
            }
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
              mappedField: false,
              mappedTo: null,
              position: noOfCols,
              display: false,
              inputType: field.fieldType,
              categories: field.categories,
              mandatory: field.mandatory,
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
              mappedField: false,
              mappedTo: null,
              position: noOfCols,
              display: false,
              inputType: field.fieldType,
              categories: field.categories,
              mandatory: field.mandatory,
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
              mappedField: false,
              mappedTo: null,
              position: noOfCols,
              display: false,
              inputType: field.fieldType,
              categories: field.categories,
              mandatory: field.mandatory,
              defaultValue: field.defaultValue,
              customField: true,
              custIndex: index,
              isActive: field.isActive,
            });
          }
        }
      });

      //convert date and date_time fields in additional fields if it was not converted
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
    this.mappedFields = [];
    //Get the list of all mapped fields
    this.columns.forEach((field) => {
      if (field.mappedField) {
        if (field.mappedTo !== null) this.mappedFields.push(field.mappedTo);
      }
    });
    //store the current columns values in temp variable
    this.lastData = JSON.parse(JSON.stringify(this.columns));
  }

  //to convert time value
  getTimeValue(defaultValue) {
    return new Date(defaultValue.seconds * 1e3).toString().split(' ')[4];
  }

  //when user select a form get selected forms title, id, status etc
  onSelectForm(i) {
    this.select = true;
    this.selectedForm = false;
    //assign the form's id as the selected formid
    this.selectedFormId = i;
    //get selected form's name
    this.selectedFormName = this.forms[this.selectedFormId];
    this.form_id_selected = this.formId[this.selectedFormId];
    //get assignedToArray for the form
    this.selectedAssignedToArray = this.assignedToArray[this.selectedFormId];
    //get assignedto names from subuserlist
    if(this.selectedAssignedToArray.length > 0){
      this.selectedAssignedToArrayName = []
      //separate user names  to show in the list
      this.selectedAssignedToArray.forEach((docId, index) => {
        this.subUserList.forEach(user => {
          if(docId == user.docId){
            this.selectedAssignedToArrayName[index] = user.name;
          }
        })
      })
    } else {
      this.selectedAssignedToArrayName = [];
    }
    //get assigned  to role for selected form
    this.selectedAssignedToRole = this.assignedToRoleArray[this.selectedFormId];
    //get profile name for selected form
    this.selectedProfileName = this.profileName[this.selectedFormId];
    //fetch the fields using getColumns()
    this.getColumns();
  }

  //on deleting a form
  deleteForm(formId) {
    //open confirmation popup to show delete confirmation button
    let dialog = this.dialog.open(ConfirmationpopupComponent, {
      data: {
        smode: 'LeadCaptureFormDelete',
        formName: this.selectedFormName
      },
    });
    //perform delete action on confirming delete form
    dialog.afterClosed().subscribe(result => {
      if(result == 'delete'){
        this.progressBarStatus = false;
        //delete form from fb
        this.db.deleteFbLeadsIntegrationForms(formId)
          .then((res) => {
            this.progressBarStatus = true;
            this.snack.open('Form deleted successfully', '', {
              duration: 2000,
            });
          });

        //make selected form as the first form after delete
        this.onSelectForm(0);
      }
    });
  }

  //on drag and drop fields to arrange position of field in the form
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    //swap the index of current and previous values
    this.columns[event.currentIndex].position = event.currentIndex;
    this.columns[event.previousIndex].position = event.previousIndex;
    //save the newly arranged feilds to db
    this.saveChanges();
  }
  //triggers when user changes the assigned role
  changeAssignedArray(){
    //when user selects 'By Profile' reset byProfileCallerIndex, assignedto array
    if(this.selectedAssignedToRole == 'By Profile'){
      this.selectedAssignedToArray = [];
      this.selectedAssignedToArrayName = [];
      this.selectedByProfileCallerIndex = 0;
    } else {
      //when user selects 'By User' reset byUserCallerIndex
      this.selectedByUserCallerIndex = 0;
    }
  }

  //first function to execute when a fb field is mapped To a CRM field
  updateMappedFields(mappedField, indexOfCol) {
    //if newly mapped field is not present in mappedFields array, add it to the array to get a list of mapped CRM fields
    if (!this.mappedFields.includes(mappedField.columnDef)) {
      this.mappedFields.push(mappedField.columnDef);
      //If newly mapped field is a custom field, make the fb field a custom field and copy custom field values into it
      if (mappedField.customField) {
        //Also,delete the custom field from this.columns to avoid repetition, copy category, input type and default values before deleting
        let delIndex = this.columns.findIndex(
          (val) => val.custIndex == mappedField.custIndex
        );
        if (delIndex >= 0 && !this.columns[delIndex].mappedField) {
          this.columns[indexOfCol].customField = true;
          this.columns[indexOfCol].isActive = mappedField.isActive;
          this.columns[indexOfCol].custIndex = mappedField.custIndex;
          this.columns[indexOfCol].categories =
            this.columns[delIndex].categories;
          this.columns[indexOfCol].inputType = this.columns[delIndex].inputType;
          this.columns[indexOfCol].defaultValue =
            this.columns[delIndex].defaultValue;
          //delete the mapped field from this.columns to remove repetition
          this.columns.splice(delIndex, 1);

        }
      }
      //If mapped field is a default field
      else {
        //find the index of mapped field in this.columns and delete it to avoid repetition
        let delIndex = this.columns.findIndex(
          (val) => val.columnDef == mappedField.columnDef
        );

        if (delIndex >= 0 && !this.columns[delIndex].mappedField) {
          //if element found in this.columns, copy category, input type, default values before deleting

          this.columns[indexOfCol].customField = false;
          this.columns[indexOfCol].isActive = false;
          this.columns[indexOfCol].custIndex = null;
          this.columns[indexOfCol].categories =
            this.columns[delIndex].categories;
          this.columns[indexOfCol].inputType = this.columns[delIndex].inputType;
          this.columns[indexOfCol].defaultValue =
            this.columns[delIndex].defaultValue;
          //delete the mapped field from this.columns to remove repetition
          this.columns.splice(delIndex, 1);
        } else {
          //mapped element is not available in this.columns, so search for mapped field in mapToFields
          //if element found in mapToFields, copy input type, and clear default values
          this.columns[indexOfCol].customField = false;
          this.columns[indexOfCol].isActive = false;
          this.columns[indexOfCol].custIndex = null;
          this.columns[indexOfCol].categories =
            mappedField.categories ? mappedField.categories : null;
          this.columns[indexOfCol].inputType = mappedField.inputType;
          this.columns[indexOfCol].defaultValue = mappedField.defaultValue;
        }
      }
    }
    //store this.columns value for finding lastMappedField and push it again to this.columns on changing mappedField
    this.lastData = JSON.parse(JSON.stringify(this.columns));

  }
  //second function to get executed when when a fb field is mapped To a CRM field
  updateM(indexOfCol) {
    //calls only when there is a change in drop down value selection
    let lastMappedFieldArray: fbLeadsModel = null;
    let lastMappedField = null;
    //find the last mapped field
    lastMappedField = this.lastData[indexOfCol].mappedTo;
    //If it is there, remove from mappedFields
    if (lastMappedField) {
      //remove last mapped field from mappedFields list since it is not mapped anymore
      if (this.mappedFields.includes(lastMappedField)) {
        //find the index of last mapped field in mapped fields
        let ind = this.mappedFields.findIndex((val) => val == lastMappedField);
        //delete the index
        this.mappedFields.splice(ind, 1);

        //Now, need to populate back this.columns with last mapped field, so that it would appear in default fields again
        //So find last mapped field's details either from fbLeadsIntegrationFields or from customFields and push it to this.columns
        fbLeadsIntegrationFields.data.forEach((defaultField) => {
          if (defaultField.columnDef == lastMappedField) {
            lastMappedFieldArray = defaultField;
            this.columns.push(lastMappedFieldArray);
          }
        });
        //if couldn't find last mapped field's details from fbLeadsIntegrationFields, check in customFields and push it to this.columns
        if (!lastMappedFieldArray) {
          this.customFields.forEach((field, index) => {
            if (field.fieldName == lastMappedField) {
              let noOfCols = this.columns.length;
              if (field.fieldType == 'date_time') {
                this.columns.push({
                  columnDef: field.fieldName,
                  header: field.fieldName,
                  mappedField: false,
                  mappedTo: null,
                  position: noOfCols,
                  display: false,
                  inputType: field.fieldType,
                  categories: field.categories,
                  mandatory: field.mandatory,
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
                  mappedField: false,
                  mappedTo: null,
                  position: noOfCols,
                  display: false,
                  inputType: field.fieldType,
                  categories: field.categories,
                  mandatory: field.mandatory,
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
                  mappedField: false,
                  mappedTo: null,
                  position: noOfCols,
                  display: false,
                  inputType: field.fieldType,
                  categories: field.categories,
                  mandatory: field.mandatory,
                  defaultValue: field.defaultValue,
                  customField: true,
                  custIndex: index,
                  isActive: field.isActive,
                });
              }
            }
          });
        }
        JSON.parse(JSON.stringify(this.columns));
      }
    }
  }

  //save values enetered in default values
  saveDefaultValue(form) {

    //if assignedTo value not selected, assigned to will be superuser
    this.selectedAssignedToRole = form.value.assignedToRole;
    //selected profile
    if(this.selectedAssignedToRole == 'By User'){
      this.selectedProfileName = ''
    }
    //getting form values
    let cols = form.value;

    //assign values from form to default values of each field in the column obj
    for (let i = 0; i < this.columns.length; i++) {
      //initialise with empty string
      this.columns[i].defaultValue = '';
      for (var j in cols) {
        //if field is not a custom field, its name is columnDef value, so get it and assign the value to defaultValue
        if (!this.columns[i].customField && this.columns[i].columnDef == j) {
          //assign each value to defaultvalue
          this.columns[i].defaultValue = typeof cols[j] !== "undefined"  ? cols[j] : null;

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
    if (this.formFields == undefined) this.formFields = [];

    this.formFields = fieldsArray;

    if (this.mode == 'edit') {
      //update the object in db
      this.db
        .updateFieldSettings(
          this.page_ID,
          this.page_Name,
          this.form_id_selected,
          this.selectedFormName,
          this.formFields,
          this.selectedAssignedToArray,
          this.selectedAssignedToRole,
          this.selectedProfileName,
          this.selectedByProfileCallerIndex,
          this.selectedByUserCallerIndex
        )
        .then((res) => {
          this.progressBarStatus = true;
          this.snack.open('Form settings updated successfully', '', {
            duration: 2000,
          });
        });
    //if mode is create, add a new record in db    
    } else if (this.mode == 'create') {
      this.db
        .addNewLeadForm(
          this.superUserId,
          this.page_ID,
          this.page_Name,
          this.form_ID,
          this.form_Name,
          this.selectedAssignedToArray,
          this.selectedAssignedToRole,
          this.defaultByProfileCallerIndex,
          this.defaultByUserCallerIndex,
          this.formFields,
          this.selectedProfileName
        )
        .then((res) => {
          //console.log('New Form added');
        });
    }
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
      if (this.columns[i].columnDef == 'selectedContactPipeline') {
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

  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    //to unsubscribe subscriptions
    this.userDetailsSubscription?.unsubscribe;
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
