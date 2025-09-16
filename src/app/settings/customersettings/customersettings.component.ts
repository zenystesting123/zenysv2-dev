/*********************************************************************************
Description: component used for adding/editing/deleteing status and additional fields of customer
Inputs: Customer status and additional fields
Outputs:
***********************************************************************************/

import {
  contactSettings,
  Customer,
  customFields,
  defaultContactSettings,
  fieldNameLEngth,
  pipelineNameLength,
  statusChange,
} from './../../data-models';
import { StatusPopupComponent } from './../status-popup/status-popup.component';
import { CustomersettingsService } from './customersettings.service';
import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/common.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { takeUntil } from 'rxjs/operators';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Pipelines } from 'src/app/model/pipeline.modal';

export interface statusDatas {
  statusAgeArray: any;
  //interface used to send data while updating/adding data in status popup component
  type: string; //to share which type of component like customer/sales
  uid: string; //to share users id
  statusArray: any[]; //to share current status array
  currentData: string; //to share data before editing
  currentDataAge: string; //to share data before editing
  currentIndex: number; //to share index of editing data
  mode: string; //to share which mode it is like update/add/delete
  selectedPipeline: number;
}
@Component({
  selector: 'app-customersettings',
  templateUrl: './customersettings.component.html',
  styleUrls: ['./customersettings.component.scss'],
})
export class CustomersettingsComponent implements OnInit, OnDestroy {
  value: string; //to store value of edit
  customerStatus: any = []; //to store status array
  addNewField: boolean = false; //variable used to hide and show add new field
  trueValue: boolean = true; //to disable drag and drop
  currentIndex: number; //to store selected status index number
  panelOpenState = false; //to set mat accordian collapsed as default
  replaced: string; //to store edited string
  editFname: any; //to store fieldname while editing
  editFieldType: any; //to store fieldtype while editing
  editMandatory: any; //to store set mandatory or not while editing
  editDefaultValue: any; //to store default value while editing
  editCategoriesOpn: any; //to store category options while editing
  ageChecked: boolean = false;

  mandatory: boolean = false; //seting mandatory as false;
  statusValues: statusChange = {
    //to share values while editing and deleting to other component
    type: null, //which component type is like customer/status
    uid: null, //share users id
    statusArray: [], //to share status array
    statusAgeArray: [],
    currentIndex: null, //index of selected value
    currentData: null, //selected value
    currentDataAge: null, //selected age
    mode: null, //which mode it is like delete,update....
    ageChecked: false,
  };

  userDetailsSubscription: Subscription; //for subscribing to user details
  profileDefinitionSubscription: Subscription; //for subscribing to profile definition
  edited: boolean = false; //setting editing div as hidden
  added: boolean = false; //setting editing div as hidden
  private onDestroy$: Subject<void> = new Subject<void>(); //for destorying subscription
  user: any; //for storing user details
  optionsLead: any[]; //to store options in lead source
  editIndex: number; //for storing index of edited variable
  notEditMode: boolean = true; //for setting edit mode disabled
  superUserId: string; //for storing super user id
  userId = ''; //userId of current logged in user
  userName = ''; //user name of current logged in user
  notEdit: boolean = true; //for setting edit mode disabled from user defention
  fieldName: string; //for storing field name while adding
  categories: string; //for storing categories while adding
  form: any; //to store user data
  defaultValue: string; //for storing default value while adding
  fieldType: string; //for storing field type while adding
  changes: boolean = false; //to disable save change button
  progressBarStatus: boolean = false; //for hidding loader
  editedField: boolean = false; //edited value while adding new field
  accountType: string; //to store users account type
  isMobilesize: Boolean = false; //store to check mobile view
  isTabletsize: Boolean = false; //store to check tablet view
  userProfileData: any;
  networkConnection: boolean; //network check
  usrProfileData: any;
  superUserDetails: any; //to store super user details
  fieldNameContact = 'Contact'; //to store contact custom name
  currentCustomField: any = []; //to store additional fields
  customFields: customFields = {
    //to store values of additional field while editing and adding
    fieldName: null, //to store fields name
    fieldType: null, //to store the fields type
    categoriesOpn: null, //to store options if category type selected
    value: null, //to store value of that field while editing
    defaultValue: null, //to store default values
    mandatory: null, //to check where field is set as mandatory
    categories: null, //array to store options of category
    isActive: null, //to check wheter the field is activated or not
  };
  dataAccessRule: string;
  replacedAge: any;
  saveEnable: boolean = true;
  maxLength = pipelineNameLength.PIPELINE_NAME_LENGTH;
  fieldCustomisationForm: FormGroup;
  settingsConfigured = false;
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;
  customFieldPipeline: boolean = true;
  editContact: boolean = false;
  editContactNotes: boolean = false;
  editFollowUp: boolean = false;
  editMeeting: boolean = false;
  editTask: boolean = false;
  editCollection: boolean = false;
  fieldMaxLength = fieldNameLEngth.FIELD_NAME_LENGTH; //maxlength from datamodel.ts, but not implemented for products and services
  fieldNameContactNotes: string = 'Note'; //local variable to store field name contact notes
  fieldNameFollowup: string = 'FollowUp'; //local variable to store followup field name
  fieldNameMeeting: string = 'Meeting'; //local variable to store field name meeting
  fieldNameTask: string = 'Task'; //local variable to store field name task
  fieldNameCollection: string = 'Collection'; //local variable to store field name collection
  addDoc: boolean = false;
  documentList: FormArray;
  uploadDocItem:any;
  docUploadArray: any;
  documentName: string//to store document name
  docValidationCheck: boolean = false//document validation
  csv_type: boolean = false;//to get doctype of value csv
  pdf_type: boolean = false;//to get doctype of value pdf
  doc_type: boolean = false;//to get doctype of value pdf
 docx_type: boolean = false;//to get doctype of value pdf
  msWord_type: boolean = false;//to get doctype of value msword
  png_type: boolean = false;//to get doctype of value png
  jpeg_type: boolean = false;//to get doctype of value jpeg
  jpg_type: boolean = false;//to get doctype of value jpg
  editedDoc: boolean = false;
  contactDocs: any[] = [];//arrary for storing customDocument
  edit_documentName: any;//to get edited_documentName
  edit_docValidationCheck: boolean//document validation
  edit_csv_type: boolean = false;//to get edited_doctype of value csv
  edit_msWord_type: boolean = false;//to get edited_doctype of value word
  edit_jpg_type: boolean = false;//to get edited_doctype of value jpg
  edit_pdf_type: boolean = false;//to get edited_doctype of value pdf
  edit_png_type: boolean = false;//to get edited_doctype of value png
  edit_jpeg_type: boolean = false;//to get edited_doctype of value jpeg
  edit_doc_type: boolean = false;//to get edited_doctype of value doc
  edit_docx_type: boolean = false;//to get edited_doctype of value docx
  expDocPanel: boolean;//to expand mat-panel
  editDocIndex: any;//get index of customDocument for edit
  docIdentifier: any;//identifier for document
  previousDocName: any;
  pipelines: Pipelines[] = [];
  rejectionReasonArray: Array<string> = [];

  constructor(
    private snack: MatSnackBar,
    public dialog: MatDialog,
    private db: CustomersettingsService,
    private _bottomSheet: MatBottomSheet,
    private location: Location,
    public commonService: CommonService,
    public networkCheck: NetworkCheckService,
  ) {

    //Check screen size form common service file
    if (this.commonService.isTabletsize) {
      this.isTabletsize = true;
    } else {
      this.isTabletsize = false;
    }
    if (this.commonService.isMobilesize) {
      this.isMobilesize = true;
    } else {
      this.isMobilesize = false;
    }

    //getting data from common service file related to the user
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          this.superUserId = allData.userDetails.superUserId;
          this.superUserDetails = allData.superUserDetails;
          this.userId = allData.userId;
          this.userName = allData.userDetails.lastname?(allData.userDetails.firstname+' '+allData.userDetails.lastname):allData.userDetails.firstname;
          this.pipelines = JSON.parse(JSON.stringify(allData.customerPipelines));
          // if(this.commonService.userPlan.multiPipelineAccess){
          //   // do nothing
          // }else{
          //   this.pipelines.length = 1;
          // }

          if (this.superUserDetails.fieldNames) {
            //getting field name to display
            this.fieldNameContact =
              this.superUserDetails.fieldNames.fieldNameContact;
            this.fieldNameContactNotes =
              this.superUserDetails.fieldNames.fieldNameContactNotes;
            this.fieldNameFollowup =
              this.superUserDetails.fieldNames.fieldNameFollowup;
            this.fieldNameMeeting =
              this.superUserDetails.fieldNames.fieldNameMeeting;
            this.fieldNameTask = this.superUserDetails.fieldNames.fieldNameTask;
            this.fieldNameCollection =
              this.superUserDetails.fieldNames.fieldNameCollection;
          }

          //age activate variable
          this.ageChecked = !!this.superUserDetails.actCustAgeing;
         
          //removing last 2  status from array to show as reorderable

          
          this.form = this.superUserDetails;
        
          //for storing all custom fields from db
          this.currentCustomField = this.superUserDetails.customFieldsContact;

          //for checking which fields are enabled
          this.usrProfileData = allData.usrProfileData;
          if (this.usrProfileData) {
            this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;

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
          //disabling loader
          this.progressBarStatus = true;
          //customisation fields starts here
          if (
            typeof allData.superUserDetails.contactSettings === 'undefined' ||
            allData.superUserDetails.contactSettings === null
          ) {
            this.settingsConfigured = false;
            // this.contactSettings = this.contactSettings;
          } else {
            this.settingsConfigured = true;
            this.contactSettings = allData.superUserDetails.contactSettings;
            if (allData.superUserDetails.contactSettings) {
              this.commonService.checkCustomField(
                defaultContactSettings.CONST_VALUE,
                allData.superUserDetails.contactSettings
              );
            }
          }
          this.rejectionReasonArray = this.contactSettings?.rejectionReason?.rejectionReason?.split(',')
          this.contactDocs = allData.superUserDetails.contactCustomDoc?allData.superUserDetails.contactCustomDoc:this.contactDocs;
          //if there is multiple pipeline access, show all five pipelines else show single pipeline
          if (
            this.commonService.userPlan.multiPipelineAccess
          ) {
            this.customFieldPipeline = true;
            this.fieldCustomisationForm = new FormGroup({
              custLeadOpn: new FormGroup({
                custLeadOpn: new FormControl(
                  this.form.custLeadOpn,
                  Validators.required
                ),
              }),
              rejectionReason: new FormGroup({
                rejectionReason: new FormControl(this.contactSettings.rejectionReason?.rejectionReason),
              }), //reason for rejection options
              
              companyName: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.companyName?.displayName,
                  [Validators.required, Validators.minLength(2)]
                ),
                display: new FormControl(
                  this.contactSettings?.companyName?.display,

                  // Validators.required
                ),
                mandatory: new FormControl(
                  this.contactSettings?.companyName?.mandatory,
                  // Validators.required
                ),
              }),
              salutation: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.salutation?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.salutation?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.salutation?.mandatory
                ),
              }),
              firstName: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.firstName?.displayName,
                  [Validators.required, Validators.minLength(2)]
                ),
                display: new FormControl(
                  this.contactSettings?.firstName?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.contactSettings?.firstName?.mandatory,
                  Validators.required
                ),
              }),
              secondName: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.secondName?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.secondName?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.secondName?.mandatory
                ),
              }),
              surname: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.surname?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.surname?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.contactSettings?.surname?.mandatory,
                  Validators.required
                ),
              }),
              
              contactNo: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.contactNo?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.contactNo?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.contactNo?.mandatory
                ),
              }),

              alternateContactNumber: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.alternateContactNumber?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.alternateContactNumber?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.alternateContactNumber?.mandatory
                ),
              }),
              email: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.email?.displayName
                ),
                display: new FormControl(this.contactSettings?.email?.display),
                mandatory: new FormControl(
                  this.contactSettings?.email?.mandatory
                ),
              }),
              priority: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.priority?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.priority?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.priority?.mandatory
                ),
              }),
              selectedContactPipeline: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.selectedContactPipeline?.displayName,
                  [Validators.required]
                ),
                display: new FormControl(
                  this.contactSettings?.selectedContactPipeline?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.contactSettings?.selectedContactPipeline?.mandatory,
                  Validators.required
                ),
              }),
              status: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.status?.displayName,
                  [Validators.required]
                ),
                display: new FormControl(
                  this.contactSettings?.status?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.contactSettings?.status?.mandatory,
                  Validators.required
                ),
              }),
              custLeadValue: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.custLeadValue?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.custLeadValue?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.custLeadValue?.mandatory
                ),
              }),
              rejectionReasonVal: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.rejectionReasonVal?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.rejectionReasonVal?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.rejectionReasonVal?.mandatory
                ),
              }), //reason for rejection settings
              department: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.department?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.department?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.department?.mandatory
                ),
              }),
              assignedTo: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.assignedTo?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.assignedTo?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.assignedTo?.mandatory
                ),
              }),
              //here
              billingaddress1: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.billingaddress1?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.billingaddress1?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.billingaddress1?.mandatory
                ),
              }),
              billingaddress2: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.billingaddress2?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.billingaddress2?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.billingaddress2?.mandatory
                ),
              }),
              district: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.district?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.district?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.district?.mandatory
                ),
              }),
              state: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.state?.displayName
                ),
                display: new FormControl(this.contactSettings?.state?.display),
                mandatory: new FormControl(
                  this.contactSettings?.state?.mandatory
                ),
              }),
              country: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.country?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.country?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.country?.mandatory
                ),
              }),
              bpin: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.bpin?.displayName
                ),
                display: new FormControl(this.contactSettings?.bpin?.display),
                mandatory: new FormControl(
                  this.contactSettings?.bpin?.mandatory
                ),
              }),
              taxId: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.taxId?.displayName
                ),
                display: new FormControl(this.contactSettings?.taxId?.display),
                mandatory: new FormControl(
                  this.contactSettings?.taxId?.mandatory
                ),
              }),
            });
          } else {
            this.customFieldPipeline = false;
            this.fieldCustomisationForm = new FormGroup({
              custLeadOpn: new FormGroup({
                custLeadOpn: new FormControl(
                  this.form.custLeadOpn,
                  Validators.required
                ),
              }),
              rejectionReason: new FormGroup({
                rejectionReason: new FormControl(
                  this.contactSettings.rejectionReason?.rejectionReason
                ),
              }), //reason for rejection options
              companyName: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.companyName?.displayName,
                  [Validators.required, Validators.minLength(2)]
                ),
                display: new FormControl(
                  this.contactSettings?.companyName?.display,

                  // Validators.required
                ),
                mandatory: new FormControl(
                  this.contactSettings?.companyName?.mandatory,
                  // Validators.required
                ),
              }),
              salutation: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.salutation?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.salutation?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.salutation?.mandatory
                ),
              }),
              firstName: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.firstName?.displayName,
                  [Validators.required, Validators.minLength(2)]
                ),
                display: new FormControl(
                  this.contactSettings?.firstName?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.contactSettings?.firstName?.mandatory,
                  Validators.required
                ),
              }),
              secondName: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.secondName?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.secondName?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.secondName?.mandatory
                ),
              }),
              surname: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.surname?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.surname?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.contactSettings?.surname?.mandatory,
                  Validators.required
                ),
              }),
              contactNo: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.contactNo?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.contactNo?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.contactNo?.mandatory
                ),
              }),
              alternateContactNumber: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.alternateContactNumber?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.alternateContactNumber?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.alternateContactNumber?.mandatory
                ),
              }),
              email: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.email?.displayName
                ),
                display: new FormControl(this.contactSettings?.email?.display),
                mandatory: new FormControl(
                  this.contactSettings?.email?.mandatory
                ),
              }),
              priority: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.priority?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.priority?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.priority?.mandatory
                ),
              }),
              selectedContactPipeline: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.selectedContactPipeline?.displayName,
                  [Validators.required]
                ),
                display: new FormControl(
                  this.contactSettings?.selectedContactPipeline?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.contactSettings?.selectedContactPipeline?.mandatory,
                  Validators.required
                ),
              }),
              status: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.status?.displayName,
                  [Validators.required]
                ),
                display: new FormControl(
                  this.contactSettings?.status?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.contactSettings?.status?.mandatory,
                  Validators.required
                ),
              }),
              custLeadValue: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.custLeadValue?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.custLeadValue?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.custLeadValue?.mandatory
                ),
              }),
              rejectionReasonVal: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.rejectionReasonVal?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.rejectionReasonVal?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.rejectionReasonVal?.mandatory
                ),
              }), //reason for rejection settings
              department: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.department?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.department?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.department?.mandatory
                ),
              }),
              assignedTo: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.assignedTo?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.assignedTo?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.assignedTo?.mandatory
                ),
              }),
              //here
              billingaddress1: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.billingaddress1?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.billingaddress1?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.billingaddress1?.mandatory
                ),
              }),
              billingaddress2: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.billingaddress2?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.billingaddress2?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.billingaddress2?.mandatory
                ),
              }),
              district: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.district?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.district?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.district?.mandatory
                ),
              }),
              state: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.state?.displayName
                ),
                display: new FormControl(this.contactSettings?.state?.display),
                mandatory: new FormControl(
                  this.contactSettings?.state?.mandatory
                ),
              }),
              country: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.country?.displayName
                ),
                display: new FormControl(
                  this.contactSettings?.country?.display
                ),
                mandatory: new FormControl(
                  this.contactSettings?.country?.mandatory
                ),
              }),
              bpin: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.bpin?.displayName
                ),
                display: new FormControl(this.contactSettings?.bpin?.display),
                mandatory: new FormControl(
                  this.contactSettings?.bpin?.mandatory
                ),
              }),
              taxId: new FormGroup({
                displayName: new FormControl(
                  this.contactSettings?.taxId?.displayName
                ),
                display: new FormControl(this.contactSettings?.taxId?.display),
                mandatory: new FormControl(
                  this.contactSettings?.taxId?.mandatory
                ),
              }),
            });
          }



          // companyName
          this.fieldCustomisationForm.get('companyName.display').setValue(true);
          this.fieldCustomisationForm.get('companyName.display').disable();
          this.fieldCustomisationForm
            .get('companyName.mandatory')
            .setValue(true);
          this.fieldCustomisationForm.get('companyName.mandatory').disable();
          //firstName
          this.fieldCustomisationForm.get('firstName.display').setValue(true);
          this.fieldCustomisationForm.get('firstName.display').disable();
          this.fieldCustomisationForm.get('firstName.mandatory').setValue(true);
          this.fieldCustomisationForm.get('firstName.mandatory').disable();
          //status
          this.fieldCustomisationForm.get('status.display').setValue(true);
          this.fieldCustomisationForm.get('status.display').disable();
          this.fieldCustomisationForm.get('status.mandatory').setValue(true);
          this.fieldCustomisationForm.get('status.mandatory').disable();

          this.fieldCustomisationForm.get('priority.display').setValue(true);
          this.fieldCustomisationForm.get('priority.display').disable();
          this.fieldCustomisationForm.get('priority.mandatory').setValue(true);
          this.fieldCustomisationForm.get('priority.mandatory').disable();
          this.fieldCustomisationForm.get('assignedTo.display').setValue(true);
          this.fieldCustomisationForm.get('assignedTo.display').disable();
          this.fieldCustomisationForm
            .get('assignedTo.mandatory')
            .setValue(true);
          this.fieldCustomisationForm.get('assignedTo.mandatory').disable();

          this.disableReasonRejection();
          // this.disableCompanyName();
          this.disableSalutation();
          // this.disableFirstName();
          this.disableSecondName();
          this.disableSurname();
          this.disableCountry();
          this.disableContactNum();
          // this.disableCountryCode();
          this.disablealtContactNum();
          // this.disablealtCountry();
          this.disableEmail();
          // this.disablePriority();
          this.disablePipeline();
          // this.disableStatus();
          this.disableLeadSource();
          this.disableDept();
          //  this.disableAssignedTo();
          this.disableDistrict();
          this.disablebilAdrs1();
          this.disablebilAdrs2();
          this.disableState();
          this.disablepinOrzip();
          this.disabletaxIdNum();

          //customisation form end here
        }
      }
    );
  }
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  ngOnInit(): void {}
  //edit customdocument
  editDoc(i){
    this.editedDoc = true;
    this.expDocPanel = true;
    this.editDocIndex = i;
    this.edit_documentName = this.contactDocs[i].documentName;
    this.previousDocName = this.contactDocs[i].documentName;
    this.edit_docValidationCheck= this.contactDocs[i].docValidation;
    this.edit_csv_type = this.contactDocs[i].doctypes.csv;
    this.edit_msWord_type = this.contactDocs[i].doctypes.word;
    this.edit_jpg_type = this.contactDocs[i].doctypes.jpg;
    this.edit_pdf_type = this.contactDocs[i].doctypes.pdf;
    this.edit_jpeg_type = this.contactDocs[i].doctypes.jpeg;
    this.edit_png_type = this.contactDocs[i].doctypes.png;
    this.docIdentifier = this.contactDocs[i].docIdentifier;
    this.edit_doc_type = this.contactDocs[i].doctypes.doc;
    this.edit_docx_type = this.contactDocs[i].doctypes.docx;
  }
  //delete custom document
  deleteDocument(index){
    //opening pop up for delete confirmation
    this.dialog.open(StatusPopupComponent, {
      disableClose: true,
      data: {
        type: 'contactCustomDoc',
        uid: this.superUserId,
        statusArray: this.contactDocs,
        currentIndex: index,
      },
    });
  }
  //submit edit custom document
  documentEdit(){
    if(this.previousDocName != this.edit_documentName){
    let docNameEditArray = [];
    this.contactDocs.forEach((ele) =>{ docNameEditArray.push(ele.documentName.toLowerCase())})
    if(!docNameEditArray.includes(this.edit_documentName)){
      if(this.edit_msWord_type === true){
        this.edit_doc_type = true;
        this.edit_docx_type = true;
      }
     else if(this.edit_msWord_type === false){
        this.edit_doc_type = false;
        this.edit_docx_type = false;
      }
      let documentObj = {
        documentName: this.edit_documentName,
        docValidation: this.edit_docValidationCheck,
        docIdentifier:this.docIdentifier,
        doctypes: {
          pdf: this.edit_pdf_type,
          word: this.edit_msWord_type,
          csv: this.edit_csv_type,
          png: this.edit_png_type,
          jpeg: this.edit_jpeg_type,
          jpg: this.edit_jpg_type,
          doc:this.edit_doc_type,
          docx:this.edit_docx_type
        }
      }
      this.contactDocs[this.editDocIndex] = documentObj;
      this.db.docUpload(this.superUserId, this.contactDocs).then(() => {
        this.addDoc = false;
        this.snack.open('Document updated successfully', '', {
          duration: 2000,
        });
        this.edit_documentName = null;
        this.edit_docValidationCheck = false;
        this.edit_pdf_type = false;
        this.edit_msWord_type = false;
        this.edit_csv_type = false;
        this.edit_png_type = false;
        this.edit_jpeg_type = false;
        this.edit_jpg_type = false;
        this.edit_doc_type = false;
        this.edit_docx_type = false;
      })
    } else{
      this.snack.open('Document name exist!', '', {
        duration: 2000,
      });
    }
  }
    else {
      if(this.edit_msWord_type === true){
        this.edit_doc_type = true;
        this.edit_docx_type = true;
      }
     else if(this.edit_msWord_type === false){
        this.edit_doc_type = false;
        this.edit_docx_type = false;
      }
      let documentObj = {
        documentName: this.edit_documentName,
        docValidation: this.edit_docValidationCheck,
        docIdentifier:this.docIdentifier,
        doctypes: {
          pdf: this.edit_pdf_type,
          word: this.edit_msWord_type,
          csv: this.edit_csv_type,
          png: this.edit_png_type,
          jpeg: this.edit_jpeg_type,
          jpg: this.edit_jpg_type,
          doc:this.edit_doc_type,
          docx:this.edit_docx_type
        }
      }
      this.contactDocs[this.editDocIndex] = documentObj;
      this.db.docUpload(this.superUserId, this.contactDocs).then(() => {
        this.addDoc = false;
        this.snack.open('Document updated successfully', '', {
          duration: 2000,
        });
        this.edit_documentName = null;
        this.edit_docValidationCheck = false;
        this.edit_pdf_type = false;
        this.edit_msWord_type = false;
        this.edit_csv_type = false;
        this.edit_png_type = false;
        this.edit_jpeg_type = false;
        this.edit_jpg_type = false;
        this.edit_doc_type = false;
        this.edit_docx_type = false;
      })

    }

  }
  addNewDoc(){
    this.addDoc = true;
    this.expDocPanel = false;
  }
  closeAddDoc(){
    this.addDoc =false;
  }
  //custom document upload
  customDocUpload(){
    if (this.contactDocs.length != 0) {//check if custom docs are present
      let docNameArray = []; //array to store custom documents name
      this.contactDocs.forEach((ele) =>{ docNameArray.push(ele.documentName.toLowerCase())})
      if(docNameArray.includes(this.documentName.toLowerCase())){ // check for document name duplication
        this.snack.open('Document with same name exist!!', '', {
          duration: 2000,
        });
      }else{
        //msword docs can be of type doc and docx
        if (this.msWord_type === true) {
          this.doc_type = true;
          this.docx_type = true;
        }
        //custom document object
        let documentObj = { 
          documentName: this.documentName,
          docIdentifier: this.documentName,
          docValidation: this.docValidationCheck,
          doctypes: {
            pdf: this.pdf_type,
            word: this.msWord_type,
            csv: this.csv_type,
            png: this.png_type,
            jpeg: this.jpeg_type,
            jpg: this.jpg_type,
            doc: this.doc_type,
            docx: this.docx_type
          }
        }
        //adding custom document to array
        this.contactDocs.push(documentObj)
        //saving to databse
        this.db.docUpload(this.superUserId, this.contactDocs).then(() => {
          this.addDoc = false;
          this.snack.open('Custom document added successfully', '', {
            duration: 2000,
          });
          //resetting value to null
          this.documentName = null;
          this.docValidationCheck = null;
          this.pdf_type = false;
          this.msWord_type = false;
          this.csv_type = false;
          this.png_type = false;
          this.jpeg_type = false;
          this.jpg_type = false;
          this.doc_type = false,
          this.docx_type = false;
        })
      }
      }
     else {
      if (this.msWord_type === true) {
        this.doc_type = true;
        this.docx_type = true;
      }
      //msword docs can be of type doc and docx
      let documentObj = {
        documentName: this.documentName,
        docIdentifier: this.documentName,
        docValidation: this.docValidationCheck,
        doctypes: {
          pdf: this.pdf_type,
          word: this.msWord_type,
          csv: this.csv_type,
          png: this.png_type,
          jpeg: this.jpeg_type,
          jpg: this.jpg_type,
          doc: this.doc_type,
          docx: this.docx_type
        }
      }
      this.contactDocs.push(documentObj)
      //saving to databse
      this.db.docUpload(this.superUserId, this.contactDocs).then(() => {
        this.addDoc = false;
        this.snack.open('Custom document added successfully', '', {
          duration: 2000,
        });
        //resetting value to null
        this.documentName = null;
        this.docValidationCheck = null;
        this.pdf_type = false;
        this.msWord_type = false;
        this.csv_type = false;
        this.png_type = false;
        this.jpeg_type = false;
        this.jpg_type = false;
        this.doc_type = false,
          this.docx_type = false;
      })
    }
  }

  //contact field actions
  editContactfn() {
    this.editContact = true;
  }
//clear contact field name
  clearContact() {
    this.editContact = false;
    this.fieldNameContact = this.superUserDetails.fieldNames.fieldNameContact;
  }

  saveContact() {
    this.editContact = false;
    this.db.updateContactfieldName(this.superUserId, this.fieldNameContact);
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
  // ContactNotes field actions
  editContactNotesfn() {
    this.editContactNotes = true;
  }
//clears contact notes
  clearContactNotes() {
    this.editContactNotes = false;
    this.fieldNameContactNotes =
      this.superUserDetails.fieldNames.fieldNameContactNotes;
  }
//saves contact notes
  saveContactNotes() {
    this.editContactNotes = false;
    this.db.updateContactNotesfieldName(
      this.superUserId,
      this.fieldNameContactNotes
    );
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
  // FollowUp field actions
  editFollowUpfn() {
    this.editFollowUp = true;
  }
  // clear button on FollowUp field actions
  clearFollowUp() {
    this.editFollowUp = false;
    this.fieldNameFollowup = this.superUserDetails.fieldNames.fieldNameFollowup;
  }
  // save button on FollowUp field actions
  saveFollowUp() {
    this.editFollowUp = false;
    this.db.updateFollowupfieldName(this.superUserId, this.fieldNameFollowup);
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
  // edit button on Meeting field actions
  editMeetingfn() {
    this.editMeeting = true;
  }
  // clear button on Meeting field actions
  clearMeeting() {
    this.editMeeting = false;
    this.fieldNameMeeting = this.superUserDetails.fieldNames.fieldNameMeeting;
  }
  // save button on Meeting field actions
  saveMeeting() {
    this.editMeeting = false;
    this.db.updateMeetingfieldName(this.superUserId, this.fieldNameMeeting);
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
  // edit button on Task field actions
  editTaskfn() {
    this.editTask = true;
  }
  // clear button on Task field actions
  clearTask() {
    this.editTask = false;
    this.fieldNameTask = this.superUserDetails.fieldNames.fieldNameTask;
  }
  // save button on Task field actions
  saveTask() {
    this.editTask = false;
    this.db.updateTaskfieldName(this.superUserId, this.fieldNameTask);
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
  // edit button on Collection field actions
  editCollectionfn() {
    this.editCollection = true;
  }
  // clear button on contact field actions
  clearCollection() {
    this.editCollection = false;
    this.fieldNameCollection =
      this.superUserDetails.fieldNames.fieldNameCollection;
  }
  // save button on Collection field actions
  saveCollection() {
    this.editCollection = false;
    this.db.updateCollectionfieldName(
      this.superUserId,
      this.fieldNameCollection
    );
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }

  //customisable field
  disableSalutation() {
    // salutation
    if (
      this.fieldCustomisationForm.get('salutation.mandatory').value === true
    ) {
      this.fieldCustomisationForm.get('salutation.display').setValue(true);
      this.fieldCustomisationForm.get('salutation.display').disable();
    } else {
      let val = this.contactSettings.salutation.display;
      this.fieldCustomisationForm.get('salutation.display').setValue(val);
      this.fieldCustomisationForm.get('salutation.display').enable();
    }
  }

  disableSecondName() {
    // secondName
    if (
      this.fieldCustomisationForm.get('secondName.mandatory').value === true
    ) {
      this.fieldCustomisationForm.get('secondName.display').setValue(true);
      this.fieldCustomisationForm.get('secondName.display').disable();
    } else {
      let val = this.contactSettings.secondName.display;
      this.fieldCustomisationForm.get('secondName.display').setValue(val);
      this.fieldCustomisationForm.get('secondName.display').enable();
    }
  }
  disableSurname() {
    // surname
    if (this.fieldCustomisationForm.get('surname.mandatory').value === true) {
      this.fieldCustomisationForm.get('surname.display').setValue(true);
      this.fieldCustomisationForm.get('surname.display').disable();
    } else {
      let val = this.contactSettings.surname.display;
      this.fieldCustomisationForm.get('surname.display').setValue(val);
      this.fieldCustomisationForm.get('surname.display').enable();
    }
  }
  disablePipeline() {
    // selectedContactPipeline
    if (
      this.fieldCustomisationForm.get('selectedContactPipeline.mandatory')
        .value === true
    ) {
      this.fieldCustomisationForm
        .get('selectedContactPipeline.display')
        .setValue(true);
      this.fieldCustomisationForm
        .get('selectedContactPipeline.display')
        .disable();
    } else {
      let val = this.contactSettings.selectedContactPipeline.display;
      this.fieldCustomisationForm
        .get('selectedContactPipeline.display')
        .setValue(val);
      this.fieldCustomisationForm
        .get('selectedContactPipeline.display')
        .enable();
    }
  }
  disableContactNum() {
    // contactNumber
    if (this.fieldCustomisationForm.get('contactNo.mandatory').value === true) {
      this.fieldCustomisationForm.get('contactNo.display').setValue(true);
      this.fieldCustomisationForm.get('contactNo.display').disable();
    } else {
      let val = this.contactSettings.contactNo.display;
      this.fieldCustomisationForm.get('contactNo.display').setValue(val);
      this.fieldCustomisationForm.get('contactNo.display').enable();
    }
  }
  disablealtContactNum() {
    // altContactNumber
    if (
      this.fieldCustomisationForm.get('alternateContactNumber.mandatory')
        .value === true
    ) {
      this.fieldCustomisationForm
        .get('alternateContactNumber.display')
        .setValue(true);
      this.fieldCustomisationForm
        .get('alternateContactNumber.display')
        .disable();
    } else {
      let val = this.contactSettings.alternateContactNumber.display;
      this.fieldCustomisationForm
        .get('alternateContactNumber.display')
        .setValue(val);
      this.fieldCustomisationForm
        .get('alternateContactNumber.display')
        .enable();
    }
  }
  disableEmail() {
    // email
    if (this.fieldCustomisationForm.get('email.mandatory').value === true) {
      this.fieldCustomisationForm.get('email.display').setValue(true);
      this.fieldCustomisationForm.get('email.display').disable();
    } else {
      let val = this.contactSettings.email.display;
      this.fieldCustomisationForm.get('email.display').setValue(val);
      this.fieldCustomisationForm.get('email.display').enable();
    }
  }
  disableLeadSource() {
    // leadSource
    if (
      this.fieldCustomisationForm.get('custLeadValue.mandatory').value === true
    ) {
      this.fieldCustomisationForm.get('custLeadValue.display').setValue(true);
      this.fieldCustomisationForm.get('custLeadValue.display').disable();
    } else {
      let val = this.contactSettings.custLeadValue.display;
      this.fieldCustomisationForm.get('custLeadValue.display').setValue(val);
      this.fieldCustomisationForm.get('custLeadValue.display').enable();
    }
  }
  // disable disaply if reason for rejection is mandatory
  disableReasonRejection() {
    if (
      this.fieldCustomisationForm.get('rejectionReasonVal.mandatory').value ===
      true
    ) {
      this.fieldCustomisationForm
        .get('rejectionReasonVal.display')
        .setValue(true);
      this.fieldCustomisationForm.get('rejectionReasonVal.display').disable();
      this.fieldCustomisationForm
        .get('rejectionReason.rejectionReason')
        .setValidators([Validators.required]);
    } else {
      let val = this.contactSettings.rejectionReasonVal?.display;
      this.fieldCustomisationForm
        .get('rejectionReasonVal.display')
        .setValue(val);
      this.fieldCustomisationForm.get('rejectionReasonVal.display').enable();
      this.fieldCustomisationForm
        .get('rejectionReason.rejectionReason')
        .clearValidators();
    }
    this.fieldCustomisationForm
      .get('rejectionReason.rejectionReason')
      .updateValueAndValidity();
  }
  disableDept() {
    // department
    if (
      this.fieldCustomisationForm.get('department.mandatory').value === true
    ) {
      this.fieldCustomisationForm.get('department.display').setValue(true);
      this.fieldCustomisationForm.get('department.display').disable();
    } else {
      let val = this.contactSettings.department.display;
      this.fieldCustomisationForm.get('department.display').setValue(val);
      this.fieldCustomisationForm.get('department.display').enable();
    }
  }

  disablebilAdrs1() {
    // billingAddressOne
    if (
      this.fieldCustomisationForm.get('billingaddress1.mandatory').value ===
      true
    ) {
      this.fieldCustomisationForm.get('billingaddress1.display').setValue(true);
      this.fieldCustomisationForm.get('billingaddress1.display').disable();
    } else {
      let val = this.contactSettings.billingaddress1.display;
      this.fieldCustomisationForm.get('billingaddress1.display').setValue(val);
      this.fieldCustomisationForm.get('billingaddress1.display').enable();
    }
  }
  disablebilAdrs2() {
    // billingAddressTwo
    if (
      this.fieldCustomisationForm.get('billingaddress2.mandatory').value ===
      true
    ) {
      this.fieldCustomisationForm.get('billingaddress2.display').setValue(true);
      this.fieldCustomisationForm.get('billingaddress2.display').disable();
    } else {
      let val = this.contactSettings.billingaddress2.display;
      this.fieldCustomisationForm.get('billingaddress2.display').setValue(val);
      this.fieldCustomisationForm.get('billingaddress2.display').enable();
    }
  }
  disableDistrict() {
    // district
    if (this.fieldCustomisationForm.get('district.mandatory').value === true) {
      this.fieldCustomisationForm.get('district.display').setValue(true);
      this.fieldCustomisationForm.get('district.display').disable();
    } else {
      let val = this.contactSettings.district.display;
      this.fieldCustomisationForm.get('district.display').setValue(val);
      this.fieldCustomisationForm.get('district.display').enable();
    }
  }
  disableState() {
    // state
    if (this.fieldCustomisationForm.get('state.mandatory').value === true) {
      this.fieldCustomisationForm.get('state.display').setValue(true);
      this.fieldCustomisationForm.get('state.display').disable();
    } else {
      let val = this.contactSettings.state.display;
      this.fieldCustomisationForm.get('state.display').setValue(val);
      this.fieldCustomisationForm.get('state.display').enable();
    }
  }
  disableCountry() {
    // country
    if (this.fieldCustomisationForm.get('country.mandatory').value === true) {
      this.fieldCustomisationForm.get('country.display').setValue(true);
      this.fieldCustomisationForm.get('country.display').disable();
    } else {
      let val = this.contactSettings.country.display;
      this.fieldCustomisationForm.get('country.display').setValue(val);
      this.fieldCustomisationForm.get('country.display').enable();
    }
  }
  disablepinOrzip() {
    // pinOrzip
    if (this.fieldCustomisationForm.get('bpin.mandatory').value === true) {
      this.fieldCustomisationForm.get('bpin.display').setValue(true);
      this.fieldCustomisationForm.get('bpin.display').disable();
    } else {
      let val = this.contactSettings.bpin.display;
      this.fieldCustomisationForm.get('bpin.display').setValue(val);
      this.fieldCustomisationForm.get('bpin.display').enable();
    }
  }
  disabletaxIdNum() {
    // pinOrzip
    if (this.fieldCustomisationForm.get('taxId.mandatory').value === true) {
      this.fieldCustomisationForm.get('taxId.display').setValue(true);
      this.fieldCustomisationForm.get('taxId.display').disable();
    } else {
      let val = this.contactSettings.taxId.display;
      this.fieldCustomisationForm.get('taxId.display').setValue(val);
      this.fieldCustomisationForm.get('taxId.display').enable();
    }
  }

  onSubmit() {
    //salutation
    if (
      this.fieldCustomisationForm.getRawValue().salutation.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('salutation.displayName')
        .setValue(defaultContactSettings.CONST_VALUE.salutation.displayName);
    }

    //secondName
    if (
      this.fieldCustomisationForm.getRawValue().secondName.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('secondName.displayName')
        .setValue(defaultContactSettings.CONST_VALUE.secondName.displayName);
    }
    //surname
    if (this.fieldCustomisationForm.getRawValue().surname.displayName === '') {
      this.fieldCustomisationForm
        .get('surname.displayName')
        .setValue(defaultContactSettings.CONST_VALUE.surname.displayName);
    }
    //selectedContactPipeline
    if (
      this.fieldCustomisationForm.getRawValue().selectedContactPipeline
        .displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('selectedContactPipeline.displayName')
        .setValue(
          defaultContactSettings.CONST_VALUE.selectedContactPipeline.displayName
        );
    }
    //contactNumber
    if (
      this.fieldCustomisationForm.getRawValue().contactNo.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('contactNo.displayName')
        .setValue(defaultContactSettings.CONST_VALUE.contactNo.displayName);
    }
    //altContactNumber
    if (
      this.fieldCustomisationForm.getRawValue().alternateContactNumber
        .displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('alternateContactNumber.displayName')
        .setValue(
          defaultContactSettings.CONST_VALUE.alternateContactNumber.displayName
        );
    }
    //email
    if (this.fieldCustomisationForm.getRawValue().email.displayName === '') {
      this.fieldCustomisationForm
        .get('email.displayName')
        .setValue(defaultContactSettings.CONST_VALUE.email.displayName);
    }

    //leadSource
    if (
      this.fieldCustomisationForm.getRawValue().custLeadValue.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('custLeadValue.displayName')
        .setValue(defaultContactSettings.CONST_VALUE.custLeadValue.displayName);
    }
    //rejectionReasonVal display name is not provided
    if (
      this.fieldCustomisationForm.getRawValue().rejectionReasonVal
        .displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('rejectionReasonVal.displayName')
        .setValue(
          defaultContactSettings.CONST_VALUE.rejectionReasonVal.displayName
        );
    }
    //department
    if (
      this.fieldCustomisationForm.getRawValue().department.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('department.displayName')
        .setValue(defaultContactSettings.CONST_VALUE.department.displayName);
    }

    //billingAddressOne
    if (
      this.fieldCustomisationForm.getRawValue().billingaddress1.displayName ===
      ''
    ) {
      this.fieldCustomisationForm
        .get('billingaddress1.displayName')
        .setValue(
          defaultContactSettings.CONST_VALUE.billingaddress1.displayName
        );
    }
    //billingAddressTwo
    if (
      this.fieldCustomisationForm.getRawValue().billingaddress2.displayName ===
      ''
    ) {
      this.fieldCustomisationForm
        .get('billingaddress2.displayName')
        .setValue(
          defaultContactSettings.CONST_VALUE.billingaddress2.displayName
        );
    }
    //district
    if (this.fieldCustomisationForm.getRawValue().district.displayName === '') {
      this.fieldCustomisationForm
        .get('district.displayName')
        .setValue(defaultContactSettings.CONST_VALUE.district.displayName);
    }
    //state
    if (this.fieldCustomisationForm.getRawValue().state.displayName === '') {
      this.fieldCustomisationForm
        .get('state.displayName')
        .setValue(defaultContactSettings.CONST_VALUE.state.displayName);
    }
    //country
    if (this.fieldCustomisationForm.getRawValue().country.displayName === '') {
      this.fieldCustomisationForm
        .get('country.displayName')
        .setValue(defaultContactSettings.CONST_VALUE.country.displayName);
    }
    //
    if (this.fieldCustomisationForm.getRawValue().state.displayName === '') {
      this.fieldCustomisationForm
        .get('state.displayName')
        .setValue(defaultContactSettings.CONST_VALUE.state.displayName);
    }
    //pinOrzip
    if (this.fieldCustomisationForm.getRawValue().bpin.displayName === '') {
      this.fieldCustomisationForm
        .get('bpin.displayName')
        .setValue(defaultContactSettings.CONST_VALUE.bpin.displayName);
    }
    //
    if (this.fieldCustomisationForm.getRawValue().taxId.displayName === '') {
      this.fieldCustomisationForm
        .get('taxId.displayName')
        .setValue(defaultContactSettings.CONST_VALUE.taxId.displayName);
    }
    //
    this.db.updateFieldCustomization(
      this.superUserId,
      this.fieldCustomisationForm.getRawValue()
    );
    this.snack.open('Successfully updated', '', {
      duration: 2000,
    });
  }

  onUpdatingLeadSource(form) {
    let leadOpn = [];
    //making the field disabled after updating
    this.notEditMode = !this.notEditMode;

    //if no lead source option given setting it with default value
    if (!form.value.custLeadOpn.custLeadOpn) {
      form.value.custLeadOpn.custLeadOpn = 'Online,Offline';
    }
    //storing options into seperate array
    this.optionsLead = form.value.custLeadOpn.custLeadOpn?.split(',');
    for (var i = this.optionsLead?.length - 1; i >= 0; i--) {
      leadOpn.push(this.optionsLead[i].trim());
    }
    if (!leadOpn) {
      leadOpn = [];
    }
    let custLeadOpnVal = form.value.custLeadOpn;
    // this.fieldCustomisationForm.controls.custLeadOpn.disable()
    //storing new leadsource into user level
    this.db.updateCust('/users', this.superUserId, custLeadOpnVal, leadOpn);
    this.snack.open('Settings updated successfully', '', {
      duration: 2000,
    });
  }
  //to enable and disable edit mode
  onTogglenotEditMode() {
    this.notEditMode = !this.notEditMode;
    this.fieldCustomisationForm.controls.custLeadOpn.enable();
  }
  onToggleCancelMode() {
    this.notEditMode = !this.notEditMode;
    // this.fieldCustomisationForm.controls.custLeadOpn.disable()
  }
  //triggered on clicking back icon to moving back to previous page
  onBack() {
    this.location.back();
  }
  //clear defaultValue field on selection change
  clear() {
    this.defaultValue = '';
  }

  //triggered while cliking close button in add div used for closing
  submitFieldClose() {
    this.addNewField = false;
  }
  //triggered while closing mat accordian
  EditFieldClose() {
    this.editedField = false;
  }

  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }

  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    //to unsubscribe subscriptions
    this.profileDefinitionSubscription?.unsubscribe;
    this.userDetailsSubscription?.unsubscribe;
    this.onDestroy$.next();
  }
}
