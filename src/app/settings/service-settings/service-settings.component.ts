import { Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import {
  customFields,
  defaultServiceSettings,
  fieldNameLEngth,
  pipelineNameLength,
  Profile,
  serviceSettings,
  statusChange,
} from 'src/app/data-models';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { StatusPopupComponent } from '../status-popup/status-popup.component';
import { ServiceSettingsService } from './service-settings.service';
import { Pipelines } from 'src/app/model/pipeline.modal';

@Component({
  selector: 'app-service-settings',
  templateUrl: './service-settings.component.html',
  styleUrls: ['./service-settings.component.scss'],
})
export class ServiceSettingsComponent implements OnInit, OnDestroy {
  value: string; //to store value of edit
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
  edited: boolean = false; //setting editing div as hidden
  added: boolean = false; //setting editing div as hidden
  user: any; //for storing user details
  optionsLead: any[]; //to store options in lead source
  editIndex: number; //for storing index of edited variable
  notEditMode = true; //for setting edit mode disabled
  superUserId: string; //for storing super user id
  notEdit = true; //for setting edit mode disabled from user defention
  fieldName: string; //for storing field name while adding
  categories: string; //for storing categories while adding
  defaultValue: string; //for storing default value while adding
  filteredServiceAgeStatus: any = [];
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
  superUserDetails: Profile = null; //to store super user details
  fieldNameService = 'Support'; //to store service custom name
  fieldNameServiceNotes: string = 'Note'; //local variable to store field name service notes
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
  maxLength = pipelineNameLength.PIPELINE_NAME_LENGTH;
  settingsConfigured: boolean = false;
  editService = false;
  editServiceNotes: boolean = false;
  serviceSettings: serviceSettings = defaultServiceSettings.CONST_VALUE;
  fieldCustomisationForm: FormGroup;
  customFieldPipeline: boolean = true;
  fieldMaxLength = fieldNameLEngth.FIELD_NAME_LENGTH; //maxlength from datamodel.ts, but not implemented for products and services
  addDoc: boolean = false;
  uploadDocItem:any;
  docUploadArray: any;
  documentName: string//to store document name
  docValidationCheck: boolean = false//document validation
  csv_type: boolean = false;//to get doctype of value csv
  pdf_type: boolean = false;//to get doctype of value pdf
  msWord_type: boolean = false;//to get doctype of value word
  png_type: boolean = false;//to get doctype of value png
  jpeg_type: boolean = false;//to get doctype of value jpeg
  jpg_type: boolean = false;//to get doctype of value jp
  doc_type: boolean = false;//to get doctype of value pdf
  docx_type: boolean = false;//to get doctype of value pdf
  editedDoc: boolean = false;
  serviceDocs: any[] = [];//arrary for storing customDocument
  edit_doc_type: boolean = false;//to get edited_doctype of value doc
  edit_docx_type: boolean = false;//to get edited_doctype of value docx
  edit_documentName: any;//to get edited_documentName
  edit_docValidationCheck: boolean//document validation
  edit_csv_type: boolean = false;//to get edited_doctype of value csv
  edit_msWord_type: boolean = false;//to get edited_doctype of value word
  edit_jpg_type: boolean = false;//to get edited_doctype of value jpg
  edit_pdf_type: boolean = false;//to get edited_doctype of value pdf
  edit_png_type: boolean = false;//to get edited_doctype of value png
  edit_jpeg_type: boolean = false;//to get edited_doctype of value jpeg
  expDocPanel: boolean;//to expand mat-panel
  editDocIndex: any;//get index of customDocument for edit
  docIdentifier: any;//identifier for document
  previousDocName: any;
  pipelines: Pipelines[] = [];//service pipelines
  userId = ''; //userId of current logged in user
  userName = ''; //user name of current logged in user
  rejectionReasonArray: Array<string> = [];
  constructor(
    private snack: MatSnackBar,
    public dialog: MatDialog,
    private db: ServiceSettingsService,
    private location: Location,
    public commonService: CommonService,
    public networkCheck: NetworkCheckService
  ) {
    //getting data from common service file related to the user
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          this.user = allData.userDetails;
          this.pipelines = JSON.parse(JSON.stringify(allData.servicePipelines));
          // if(this.commonService.userPlan.multiPipelineAccess){
          //   // do nothing
          // }else{
          //   this.pipelines.length = 1;
          // }
          //condition to check where the user is a super user or not
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
          this.userId = allData.userId;
          this.userName = allData.userDetails.lastname?(allData.userDetails.firstname+' '+allData.userDetails.lastname):allData.userDetails.firstname;

          this.superUserId = allData.userDetails.superUserId;

          this.superUserDetails = allData.superUserDetails;
          this.serviceDocs = allData.superUserDetails.serviceCustomDoc?allData.superUserDetails.serviceCustomDoc:this.serviceDocs;

          if (this.superUserDetails?.fieldNames) {
            this.fieldNameService =
              this.superUserDetails.fieldNames.fieldNameService;
          }
          if (this.superUserDetails?.fieldNames?.fieldNameServiceNotes) {
            this.fieldNameServiceNotes =
              this.superUserDetails.fieldNames.fieldNameServiceNotes;
          }

          //age activate variable
          this.ageChecked = !!this.superUserDetails.actserviceAgeing;
        


         
          


          //for storing all custom fields from db
          this.currentCustomField = this.superUserDetails?.customFieldsService;
          //customisable fields starts here
          if (
            typeof allData.superUserDetails.serviceSettings === 'undefined' ||
            allData.superUserDetails.serviceSettings === null
          ) {
            this.settingsConfigured = false;
          } else {
            this.settingsConfigured = true;
            this.serviceSettings = allData.superUserDetails.serviceSettings;
            if (allData.superUserDetails.serviceSettings) {
              if (allData.superUserDetails.serviceSettings.assignedTo) {
                this.serviceSettings.assignedTo =
                  this.serviceSettings.assignedTo;
              } else {
                this.serviceSettings.assignedTo =
                  defaultServiceSettings.CONST_VALUE.assignedTo;
              }
            }
          }
          this.rejectionReasonArray = this.serviceSettings?.rejectionReason?.rejectionReason?.split(',')
          if (this.commonService.userPlan.multiPipelineAccess) {
            this.customFieldPipeline = true;
            this.fieldCustomisationForm = new FormGroup({
              rejectionReason: new FormGroup({
                rejectionReason: new FormControl(
                  this.serviceSettings?.rejectionReason?.rejectionReason
                ),
              }), //reason for rejection options
              rejectionReasonVal: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.rejectionReasonVal?.displayName
                ),
                display: new FormControl(
                  this.serviceSettings?.rejectionReasonVal?.display
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.rejectionReasonVal?.mandatory
                ),
              }), //reason for rejection settings
              selectedCust: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.selectedCust.displayName,
                  [Validators.required]
                ),
                display: new FormControl(
                  this.serviceSettings?.selectedCust?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.selectedCust?.mandatory,
                  Validators.required
                ),
              }),
              serviceTitle: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.serviceTitle.displayName,
                  [Validators.required]
                ),
                display: new FormControl(
                  this.serviceSettings?.serviceTitle?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.serviceTitle?.mandatory,
                  Validators.required
                ),
              }),
              startDate: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.startDate.displayName,
                  [Validators.required]
                ),
                display: new FormControl(
                  this.serviceSettings?.startDate?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.startDate?.mandatory,
                  Validators.required
                ),
              }),
              expCompletionDate: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.expCompletionDate.displayName,
                  [Validators.required]
                ),
                display: new FormControl(
                  this.serviceSettings?.expCompletionDate?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.expCompletionDate?.mandatory,
                  Validators.required
                ),
              }),
              selectedServPipeline: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.selectedServPipeline.displayName
                ),
                display: new FormControl(
                  this.serviceSettings?.selectedServPipeline?.display
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.selectedServPipeline?.mandatory
                ),
              }),
              servicesStage: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.servicesStage.displayName
                ),
                display: new FormControl(
                  this.serviceSettings?.servicesStage?.display
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.servicesStage?.mandatory
                ),
              }),
              priority: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.priority.displayName
                ),
                display: new FormControl(
                  this.serviceSettings?.priority?.display
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.priority?.mandatory
                ),
              }),
              description: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.description.displayName
                ),
                display: new FormControl(
                  this.serviceSettings?.description?.display
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.description?.mandatory
                ),
              }),
              assignedTo: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.assignedTo.displayName
                ),
                display: new FormControl(
                  this.serviceSettings?.assignedTo?.display
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.assignedTo?.mandatory
                ),
              }),
            });
          } else {
            this.customFieldPipeline = false;
            this.fieldCustomisationForm = new FormGroup({
              rejectionReason: new FormGroup({
                rejectionReason: new FormControl(
                  this.serviceSettings?.rejectionReason?.rejectionReason
                ),
              }), //reason for rejection options
              rejectionReasonVal: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.rejectionReasonVal?.displayName
                ),
                display: new FormControl(
                  this.serviceSettings?.rejectionReasonVal?.display
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.rejectionReasonVal?.mandatory
                ),
              }), //reason for rejection settings
              selectedCust: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.selectedCust.displayName,
                  [Validators.required]
                ),
                display: new FormControl(
                  this.serviceSettings?.selectedCust?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.selectedCust?.mandatory,
                  Validators.required
                ),
              }),
              serviceTitle: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.serviceTitle.displayName,
                  [Validators.required]
                ),
                display: new FormControl(
                  this.serviceSettings?.serviceTitle?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.serviceTitle?.mandatory,
                  Validators.required
                ),
              }),
              startDate: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.startDate.displayName,
                  [Validators.required]
                ),
                display: new FormControl(
                  this.serviceSettings?.startDate?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.startDate?.mandatory,
                  Validators.required
                ),
              }),
              expCompletionDate: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.expCompletionDate.displayName,
                  [Validators.required]
                ),
                display: new FormControl(
                  this.serviceSettings?.expCompletionDate?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.expCompletionDate?.mandatory,
                  Validators.required
                ),
              }),
              selectedServPipeline: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.selectedServPipeline.displayName
                ),
                display: new FormControl(
                  this.serviceSettings?.selectedServPipeline?.display
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.selectedServPipeline?.mandatory
                ),
              }),
              servicesStage: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.servicesStage.displayName
                ),
                display: new FormControl(
                  this.serviceSettings?.servicesStage?.display
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.servicesStage?.mandatory
                ),
              }),
              priority: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.priority.displayName
                ),
                display: new FormControl(
                  this.serviceSettings?.priority?.display
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.priority?.mandatory
                ),
              }),
              description: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.description.displayName
                ),
                display: new FormControl(
                  this.serviceSettings?.description?.display
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.description?.mandatory
                ),
              }),
              assignedTo: new FormGroup({
                displayName: new FormControl(
                  this.serviceSettings?.assignedTo.displayName
                ),
                display: new FormControl(
                  this.serviceSettings?.assignedTo?.display
                ),
                mandatory: new FormControl(
                  this.serviceSettings?.assignedTo?.mandatory
                ),
              }),
            });
          }
          this.fieldCustomisationForm
            .get('selectedCust.display')
            .setValue(true);
          this.fieldCustomisationForm.get('selectedCust.display').disable();
          this.fieldCustomisationForm
            .get('selectedCust.mandatory')
            .setValue(true);
          this.fieldCustomisationForm.get('selectedCust.mandatory').disable();
          //serviceTitle
          this.fieldCustomisationForm
            .get('serviceTitle.display')
            .setValue(true);
          this.fieldCustomisationForm.get('serviceTitle.display').disable();
          this.fieldCustomisationForm
            .get('serviceTitle.mandatory')
            .setValue(true);
          this.fieldCustomisationForm.get('serviceTitle.mandatory').disable();
          //startdate
          this.fieldCustomisationForm.get('startDate.display').setValue(true);
          this.fieldCustomisationForm.get('startDate.display').disable();
          this.fieldCustomisationForm.get('startDate.mandatory').setValue(true);
          this.fieldCustomisationForm.get('startDate.mandatory').disable();
          //expCompletionDate
          this.fieldCustomisationForm
            .get('expCompletionDate.display')
            .setValue(true);
          this.fieldCustomisationForm
            .get('expCompletionDate.display')
            .disable();
          this.fieldCustomisationForm
            .get('expCompletionDate.mandatory')
            .setValue(true);
          this.fieldCustomisationForm
            .get('expCompletionDate.mandatory')
            .disable();
          //priority
          this.fieldCustomisationForm.get('priority.display').setValue(true);
          this.fieldCustomisationForm.get('priority.display').disable();
          this.fieldCustomisationForm.get('priority.mandatory').setValue(true);
          this.fieldCustomisationForm.get('priority.mandatory').disable();
          //servicesStage
          this.fieldCustomisationForm
            .get('servicesStage.display')
            .setValue(true);
          this.fieldCustomisationForm.get('servicesStage.display').disable();
          this.fieldCustomisationForm
            .get('servicesStage.mandatory')
            .setValue(true);
          this.fieldCustomisationForm.get('servicesStage.mandatory').disable();
          //assignedTo
          this.fieldCustomisationForm.get('assignedTo.display').setValue(true);
          this.fieldCustomisationForm.get('assignedTo.display').disable();
          this.fieldCustomisationForm
            .get('assignedTo.mandatory')
            .setValue(true);
          this.fieldCustomisationForm.get('assignedTo.mandatory').disable();
          this.disableDisplaydescription();
          this.disableReasonRejection();
          this.disablepipeline();
          //disabling loader
          this.progressBarStatus = true;
        }
      }
    );
  }

  ngOnInit(): void {}
  //edit custom document
  editDoc(i){
    this.editedDoc = true;
    this.expDocPanel = true;
    this.editDocIndex = i;
    this.edit_documentName = this.serviceDocs[i].documentName;
    this.previousDocName = this.serviceDocs[i].documentName;
    this.edit_docValidationCheck= this.serviceDocs[i].docValidation;
    this.edit_csv_type = this.serviceDocs[i].doctypes.csv;
    this.edit_msWord_type = this.serviceDocs[i].doctypes.word;
    this.edit_jpg_type = this.serviceDocs[i].doctypes.jpg;
    this.edit_pdf_type = this.serviceDocs[i].doctypes.pdf;
    this.edit_jpeg_type = this.serviceDocs[i].doctypes.jpeg;
    this.edit_png_type = this.serviceDocs[i].doctypes.png;
    this.docIdentifier = this.serviceDocs[i].docIdentifier;
    this.edit_doc_type = this.serviceDocs[i].doctypes.doc;
    this.edit_docx_type = this.serviceDocs[i].doctypes.docx;

  }
  //delete customdocument
  deleteDocument(index){
    //opening pop up for delete confirmation
    this.dialog.open(StatusPopupComponent, {
      disableClose: true,
      data: {
        type: 'serviceCustomDoc',
        uid: this.superUserId,
        statusArray: this.serviceDocs,
        currentIndex: index,
      },
    });
  }
  //submit edit document
  documentEdit(){
    if(this.previousDocName != this.edit_documentName){
    let docNameEditArray = [];
    this.serviceDocs.forEach((ele) =>{ docNameEditArray.push(ele.documentName.toLowerCase())})
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
      this.serviceDocs[this.editDocIndex] = documentObj;
      this.db.docUpload(this.superUserId, this.serviceDocs).then(() => {
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
      this.serviceDocs[this.editDocIndex] = documentObj;
      this.db.docUpload(this.superUserId, this.serviceDocs).then(() => {
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
  //customdoc upload
  customDocUpload(){
    if (this.serviceDocs.length != 0) {
      let docNameArray = [];
      this.serviceDocs.forEach((ele) =>{ docNameArray.push(ele.documentName.toLowerCase())})
      if(docNameArray.includes(this.documentName.toLowerCase())){
        this.snack.open('Document with same name exist!!', '', {
          duration: 2000,
        });
      }else{
        if (this.msWord_type === true) {
          this.doc_type = true;
          this.docx_type = true;
        }
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
        this.serviceDocs.push(documentObj)
        this.db.docUpload(this.superUserId, this.serviceDocs).then(() => {
          this.addDoc = false;
          this.snack.open('Custom document added successfully', '', {
            duration: 2000,
          });
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
      this.serviceDocs.push(documentObj)
      this.db.docUpload(this.superUserId, this.serviceDocs).then(() => {
        this.addDoc = false;
        this.snack.open('Custom document added successfully', '', {
          duration: 2000,
        });
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
  editServicefn() {
    this.editService = true;
  }
  // clear button on Sale field actions
  clearService() {
    this.editService = false;
    this.fieldNameService = this.superUserDetails.fieldNames.fieldNameService;
  }
  // save button on contact field actions
  saveService() {
    this.editService = false;
    this.db.updateServicefieldName(this.superUserId, this.fieldNameService);
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
  //notes
  // ContactNotes field actions
  editServiceNotesfn() {
    this.editServiceNotes = true;
  }

  clearServiceNotes() {
    this.editServiceNotes = false;
    this.fieldNameServiceNotes =
      this.superUserDetails.fieldNames.fieldNameServiceNotes;
  }

  saveServiceNotes() {
    this.editServiceNotes = false;
    this.db.updateContactNotesfieldName(
      this.superUserId,
      this.fieldNameServiceNotes
    );
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
  // disable display if reason for rejection is mandatory
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
      let val = this.serviceSettings.rejectionReasonVal?.display;
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
  //customisable field section starts here
  disableDisplaydescription() {
    // description
    if (
      this.fieldCustomisationForm.get('description.mandatory').value === true
    ) {
      this.fieldCustomisationForm.get('description.display').setValue(true);
      this.fieldCustomisationForm.get('description.display').disable();
    } else {
      let val = this.serviceSettings.description.display;
      this.fieldCustomisationForm.get('description.display').setValue(val);
      this.fieldCustomisationForm.get('description.display').enable();
    }
  }
  disablepipeline() {
    // selectedServPipeline
    if (
      this.fieldCustomisationForm.get('selectedServPipeline.mandatory')
        .value === true
    ) {
      this.fieldCustomisationForm
        .get('selectedServPipeline.display')
        .setValue(true);
      this.fieldCustomisationForm.get('selectedServPipeline.display').disable();
    } else {
      let val = this.serviceSettings.selectedServPipeline.display;
      this.fieldCustomisationForm
        .get('selectedServPipeline.display')
        .setValue(val);
      this.fieldCustomisationForm.get('selectedServPipeline.display').enable();
    }
  }
  onSubmitCustomField() {
    // description
    if (
      this.fieldCustomisationForm.getRawValue().description.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('description.displayName')
        .setValue(defaultServiceSettings.CONST_VALUE.description.displayName);
    }
    if (
      this.fieldCustomisationForm.getRawValue().description.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('description.displayName')
        .setValue(defaultServiceSettings.CONST_VALUE.description.displayName);
    }
    //rejectionReasonVal display name is not provided
    if (
      this.fieldCustomisationForm.getRawValue().rejectionReasonVal
        .displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('rejectionReasonVal.displayName')
        .setValue(
          defaultServiceSettings.CONST_VALUE.rejectionReasonVal.displayName
        );
    }
    this.db.updateFieldCustomization(
      this.superUserId,
      this.fieldCustomisationForm.getRawValue()
    );
    this.snack.open('Successfully updated', '', {
      duration: 2000,
    });
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
    this.userDetailsSubscription?.unsubscribe();
  }
}
