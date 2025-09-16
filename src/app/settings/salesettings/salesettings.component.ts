/*********************************************************************************
Description: component used for adding/editing/deleteing status and additional fields of sales
Inputs: sale status and additional fields
Outputs:
***********************************************************************************/

import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesettingsService } from './salesettings.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/common.service';
import { StatusPopupComponent } from '../status-popup/status-popup.component';
import {
  customFields,
  defaultSaleSettings,
  fieldNameLEngth,
  itemMax,
  pipelineNameLength,
  saleSettings,
  statusChange,
} from 'src/app/data-models';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { newArray } from '@angular/compiler/src/util';
import { Pipelines } from 'src/app/model/pipeline.modal';
export interface statusDatas {
  //interface used to send data while updating/adding data in status popup component
  type: string; //to share which type of component like customer/sales
  uid: string; //to share users id
  statusArray: any[]; //to share current status array
  currentData: string; //to share data before editing
  currentIndex: number; //to share index of editing data
  mode: string; //to share which mode it is like update/add/delete
}
@Component({
  selector: 'app-salesettings',
  templateUrl: './salesettings.component.html',
  styleUrls: ['./salesettings.component.scss'],
})
export class SalesettingsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  value: string; //to store value of edit
  userData: any; //to store users data
  currentIndex: number; //to store selected status index number
  replaced: string; //to store edited string
  subArray1: any = []; //for storing sub array
  edited: boolean = false; //setting editing div as hidden
  added: boolean = false; //setting editing div as hidden
  userId: string; //for storing users id
  user: any; //for storing user details
  panelOpenState = false; //to set mat accordian collapsed as default
  notEditMode = true; //for setting edit mode disabled
  statusValues: statusChange = {
    //to share values while editing and deleting to other component
    type: null, //which component type is like customer/status
    uid: null, //share users id
    statusArray: [], //to share status array
    statusAgeArray: [],
    currentIndex: null, //index of selected value
    currentData: null, //selected value
    currentDataAge: null,
    mode: null, //which mode it is like delete,update....
    ageChecked: false,
  };
  trueValue: boolean = true; //to disable drag and drop
  replacedAge: any;
  changes: boolean = false; //to check any change made to array
  superUserId: string; //for storing super user id
  notEdit = true; //for setting edit mode disabled from user defention
  progressBarStatus: boolean = false; //for hidding loader
  accountType: string; //to store users account type
  isMobilesize: Boolean = false; //store to check mobile view
  isTabletsize: Boolean = false; //store to check tablet view
  userProfileData: any;
  usrProfileData: any;
  networkConnection: boolean; //network check
  editIndex: number; //for storing index of edited variable
  editedField: boolean = false;
  editFname: any; //to store fieldname while editing
  editFieldType: any; //to store fieldtype while editing
  editMandatory: any; //to store set mandatory or not while editing
  editDefaultValue: any; //to store default value while editing
  editCategoriesOpn: any; //to store category options while editing
  fieldName: string; //for storing field name while adding
  fieldType: string; //for storing field type while adding
  defaultValue: string; //for storing default value while adding
  fieldNameSale: StaticRange; //to store custom feild name
  fieldNameItems: string = 'Products and Service'; //local variable to store field name items
  categories: string; //for storing categories while adding
  superUserDetails: any; //to store super user details
  userDetailsSubscription: Subscription; //for subscribing to user details
  profileDefinitionSubscription: Subscription; //for subscribing to profile definition
  mandatory: any; //to check is the field mandatory or not
  addNewField: boolean = false; //to check should we hide add new field hidden or not
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
  ageChecked: boolean = false;

  maxLength = pipelineNameLength.PIPELINE_NAME_LENGTH;
  displayQnty: boolean;
  maxItems = itemMax.MAX_ITEM;
  fieldCustomisationForm: FormGroup;
  saleSettings: saleSettings = defaultSaleSettings.CONST_VALUE;
  settingsConfigured = false;
  customFieldPipeline: boolean = true;
  editSale: boolean = false;
  editSaleNotes: boolean = false;
  editEstimate: boolean = false;
  editQuotation: boolean = false;
  editInvoice: boolean = false;
  fieldMaxLength = fieldNameLEngth.FIELD_NAME_LENGTH; //maxlength from datamodel.ts, but not implemented for products and services
  fieldNameSaleNotes: string = 'Note'; //local variable to store field name sale notes
  fieldNameEstimate: string = 'Estimate'; //local variable to store field name estimate
  fieldNameQuotation: string = 'Quotation'; //local variable to store field name Quotation
  fieldNameInvoice: string = 'Invoice'; //local variable to store field name invoice
  constructorName: string;
  addDoc: boolean = false;

  uploadDocItem: any;
  docUploadArray: any;
  documentName: string//to store document name
  docValidationCheck: boolean = false;//document validation
  csv_type: boolean = false;//to get doctype of value csv
  pdf_type: boolean = false;//to get doctype of value pdf
  msWord_type: boolean = false;//to get doctype of value msword
  png_type: boolean = false;//to get doctype of value png
  jpeg_type: boolean = false;//to get doctype of value jpeg
  jpg_type: boolean = false;//to get doctype of value jpg
  doc_type: boolean = false;//to get doctype of value doc
 docx_type: boolean = false;//to get doctype of value docx
  editedDoc: boolean = false;
   saleDocs:any[] = [];//arrary for storing customDocument
  edit_documentName: any;//to get edited_documentName
  edit_docValidationCheck: boolean//document validation
  edit_csv_type: boolean ;//to get edited_doctype of value csv
  edit_msWord_type: boolean ;//to get edited_doctype of value msword
  edit_jpg_type: boolean ;//to get dedited_octype of value jpg
  edit_pdf_type: boolean ;//to get edited_doctype of value pdf
  edit_png_type: boolean;//to get edited_doctype of value png
   edit_doc_type: boolean = false;//to get edited_doctype of value png
  edit_docx_type: boolean = false;//to get edited_doctype of value jpeg
  edit_jpeg_type: boolean ;//to get edited_doctype of value jpeg
  expDocPanel: boolean;//to expand mat-panel
  editDocIndex: any;//get index of customDocument for edit
  docIdentifier: string;//identifier for document
  previousDocName: any;
  pipelines: Pipelines[] = [];
  rejectionReasonArray: Array<string> = [];
  userName = '';

  constructor(
    public dialog: MatDialog,
    private location: Location,
    public networkCheck: NetworkCheckService,
    private snack: MatSnackBar,
    private _bottomSheet: MatBottomSheet,
    private db: SalesettingsService,
    public commonService: CommonService
  ) {
    //getting data from common service file related to the user
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          this.user = allData.userDetails;
          this.userId = allData.userId;
          this.userName = allData.userDetails.lastname?(allData.userDetails.firstname+' '+allData.userDetails.lastname):allData.userDetails.firstname;
          this.pipelines = JSON.parse(JSON.stringify(allData.salePipelines));
          // if(this.commonService.userPlan.multiPipelineAccess){
          //   // do nothing
          // }else{
          //   this.pipelines.length = 1;
          // }
          this.constructorName = this.constructor.name;
          //Check screen size userData common service file
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
          this.usrProfileData = allData.usrProfileData;
          if (this.usrProfileData) {
            this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;
          }
          this.saleDocs = allData.superUserDetails.saleCustomDoc?allData.superUserDetails.saleCustomDoc:this.saleDocs;

          //condition to check where the user is a super user or not
          if (allData.userDetails.accountType == 'SuperUser') {
            this.superUserId = allData.userDetails.superUserId;
            this.userData = allData.userDetails;
            this.accountType = allData.userDetails.accountType;

            // for status age active
            this.ageChecked = !!this.userData.actSaleAgeing;

            //for storing all custom fields from db
            this.currentCustomField = allData.userDetails.customFieldsSale;
          } else {
            this.superUserId = allData.userDetails.superUserId;
            this.userId = allData.userId;
            this.userData = allData.superUserDetails;
            this.accountType = allData.superUserDetails.accountType;
           

            // for status age active
            this.ageChecked = !!this.userData.actSaleAgeing;

            //for storing all custom fields from db
            this.currentCustomField = allData.superUserDetails.customFieldsSale;
          }
          if (allData.superUserDetails.itemQtyDisplay === false) {
            this.displayQnty = false;
          } else {
            this.displayQnty = true;
          }
          if (allData.superUserDetails.itemMaxAllowed) {
            this.maxItems = allData.superUserDetails.itemMaxAllowed;
          }
          this.superUserDetails = allData.superUserDetails;
          if (this.superUserDetails.fieldNames) {
            //getting field name to display
            this.fieldNameSale = this.superUserDetails.fieldNames.fieldNameSale;
            this.fieldNameItems =
              this.superUserDetails.fieldNames.fieldNameItems;
            this.fieldNameSaleNotes =
              this.superUserDetails.fieldNames.fieldNameSaleNotes;
            this.fieldNameEstimate =
              this.superUserDetails.fieldNames.fieldNameEstimate;
            this.fieldNameQuotation =
              this.superUserDetails.fieldNames.fieldNameQuotation;
            this.fieldNameInvoice =
              this.superUserDetails.fieldNames.fieldNameInvoice;
          }
         
          //customisable field starts here
          if (
            typeof allData.superUserDetails.saleSettings === 'undefined' ||
            allData.superUserDetails.saleSettings === null
          ) {
            this.settingsConfigured = false;
          } else {
            this.settingsConfigured = true;
            this.saleSettings = allData.superUserDetails.saleSettings;
            //   if(allData.superUserDetails.saleSettings){
            //   if(allData.superUserDetails.saleSettings.value){
            //     this.saleSettings.value = this.saleSettings.value;
            //   }
            //   else{
            //     this.saleSettings.value = defaultSaleSettings.CONST_VALUE.value;
            //   }
            //   if(allData.superUserDetails.saleSettings.expense){
            //     this.saleSettings.expense = this.saleSettings.expense;
            //   }
            //   else{
            //     this.saleSettings.expense = defaultSaleSettings.CONST_VALUE.expense;
            //   }
            //   if(allData.superUserDetails.saleSettings.invoiced){
            //     this.saleSettings.invoiced = this.saleSettings.invoiced;
            //   }
            //   else{
            //     this.saleSettings.invoiced = defaultSaleSettings.CONST_VALUE.invoiced;
            //   }
            //   if(allData.superUserDetails.saleSettings.collected){
            //     this.saleSettings.collected = this.saleSettings.collected;
            //   }
            //   else{
            //     this.saleSettings.collected = defaultSaleSettings.CONST_VALUE.collected;
            //   }
            // }
            if (allData.superUserDetails.saleSettings) {
              this.commonService.checkCustomField(
                defaultSaleSettings.CONST_VALUE,
                allData.superUserDetails.saleSettings
              );
            }
          }
          this.rejectionReasonArray = this.saleSettings?.rejectionReason?.rejectionReason?.split(',')

          //for checking which fields are enabled
          this.usrProfileData = this.commonService.getProfileData();
          // console.log('ysr prfl access', this.usrProfileData);
          if (this.usrProfileData) {
            this.userProfileData = this.usrProfileData[0];
            if (this.userProfileData) {
              // disable addSale and sale view
              if (this.usrProfileData[0].isCheckedSett == false) {
                this.notEdit = true;
              } else {
                if (this.usrProfileData[0].settView == false) {
                  this.notEdit = true;
                } else {
                  this.notEdit = false;
                }
              }
            }
          } else {
            // if failed to fetch data from commonService
            this.profileDefinitionSubscription = this.db
              .readProfileDefinition(this.userId, this.accountType)
              .pipe(takeUntil(this.onDestroy$))
              .subscribe((usrProfiles) => {
                if (usrProfiles) {
                  if (usrProfiles[0]) {
                    if (usrProfiles[0].isCheckedSett == false) {
                      this.notEdit = true;
                    } else {
                      if (usrProfiles[0].settView == false) {
                        this.notEdit = true;
                      } else {
                        this.notEdit = false;
                      }
                    }
                  }
                }
              });
          }
          //form initialisation
          if (this.commonService.userPlan.multiPipelineAccess) {
            this.customFieldPipeline = true;
            this.fieldCustomisationForm = new FormGroup({
              rejectionReason: new FormGroup({
                rejectionReason: new FormControl(
                  this.saleSettings?.rejectionReason?.rejectionReason
                ),
              }), //reason for rejection options
              rejectionReasonVal: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.rejectionReasonVal?.displayName
                ),
                display: new FormControl(
                  this.saleSettings?.rejectionReasonVal?.display
                ),
                mandatory: new FormControl(
                  this.saleSettings?.rejectionReasonVal?.mandatory
                ),
              }), //reason for rejection settings
              selectedCust: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.selectedCust.displayName,
                  Validators.required
                ),
                display: new FormControl(
                  this.saleSettings?.selectedCust?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.saleSettings?.selectedCust?.mandatory,
                  Validators.required
                ),
              }),
              saleTitle: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.saleTitle.displayName,
                  Validators.required
                ),
                display: new FormControl(
                  this.saleSettings?.saleTitle?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.saleSettings?.saleTitle?.mandatory,
                  Validators.required
                ),
              }),
              expCompletionDate: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.expCompletionDate.displayName,
                  Validators.required
                ),
                display: new FormControl(
                  this.saleSettings?.expCompletionDate?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.saleSettings?.expCompletionDate?.mandatory,
                  Validators.required
                ),
              }),
              estimatedValue: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.estimatedValue.displayName
                ),
                display: new FormControl(
                  this.saleSettings?.estimatedValue?.display
                ),
                mandatory: new FormControl(
                  this.saleSettings?.estimatedValue?.mandatory
                ),
              }),
              collectionMode: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.collectionMode.displayName
                ),
                display: new FormControl(
                  this.saleSettings?.collectionMode?.display
                ),
                mandatory: new FormControl(
                  this.saleSettings?.collectionMode?.mandatory
                ),
              }),
              startDate: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.startDate.displayName
                ),
                display: new FormControl(this.saleSettings?.startDate?.display),
                mandatory: new FormControl(
                  this.saleSettings?.startDate?.mandatory
                ),
              }),
              selectedSalePipeline: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.selectedSalePipeline.displayName
                ),
                display: new FormControl(
                  this.saleSettings?.selectedSalePipeline?.display
                ),
                mandatory: new FormControl(
                  this.saleSettings?.selectedSalePipeline?.mandatory
                ),
              }),
              salesStage: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.salesStage.displayName
                ),
                display: new FormControl(
                  this.saleSettings?.salesStage?.display
                ),
                mandatory: new FormControl(
                  this.saleSettings?.salesStage?.mandatory
                ),
              }),
              priority: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.priority.displayName
                ),
                display: new FormControl(this.saleSettings?.priority?.display),
                mandatory: new FormControl(
                  this.saleSettings?.priority?.mandatory
                ),
              }),
              description: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.description.displayName
                ),
                display: new FormControl(
                  this.saleSettings?.description?.display
                ),
                mandatory: new FormControl(
                  this.saleSettings?.description?.mandatory
                ),
              }),
              // selectedProduct: new FormGroup({
              //   displayName: new FormControl(
              //     this.saleSettings?.selectedProduct.displayName
              //   ),
              //   display: new FormControl(
              //     this.saleSettings?.selectedProduct?.display
              //   ),
              //   mandatory: new FormControl(
              //     this.saleSettings?.selectedProduct?.mandatory
              //   ),
              // }),
              // selProdCat: new FormGroup({
              //   displayName: new FormControl(
              //     this.saleSettings?.selProdCat.displayName
              //   ),
              //   display: new FormControl(
              //     this.saleSettings?.selProdCat?.display
              //   ),
              //   mandatory: new FormControl(
              //     this.saleSettings?.selProdCat?.mandatory
              //   ),
              // }),
              assignedTo: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.assignedTo.displayName
                ),
                display: new FormControl(
                  this.saleSettings?.assignedTo?.display
                ),
                mandatory: new FormControl(
                  this.saleSettings?.assignedTo?.mandatory
                ),
              }),
              // value: new FormGroup({
              //   displayName: new FormControl(
              //     this.saleSettings?.value.displayName
              //   ),
              //   display: new FormControl(this.saleSettings?.value?.display),
              //   mandatory: new FormControl(this.saleSettings?.value?.mandatory),
              // }),
              // expense: new FormGroup({
              //   displayName: new FormControl(
              //     this.saleSettings?.expense.displayName
              //   ),
              //   display: new FormControl(this.saleSettings?.expense?.display),
              //   mandatory: new FormControl(
              //     this.saleSettings?.expense?.mandatory
              //   ),
              // }),
              // invoiced: new FormGroup({
              //   displayName: new FormControl(
              //     this.saleSettings?.invoiced.displayName
              //   ),
              //   display: new FormControl(this.saleSettings?.invoiced?.display),
              //   mandatory: new FormControl(
              //     this.saleSettings?.invoiced?.mandatory
              //   ),
              // }),
              // collected: new FormGroup({
              //   displayName: new FormControl(
              //     this.saleSettings?.collected.displayName
              //   ),
              //   display: new FormControl(this.saleSettings?.collected?.display),
              //   mandatory: new FormControl(
              //     this.saleSettings?.collected?.mandatory
              //   ),
              // }),
            });
          } else {
            this.customFieldPipeline = false;
            this.fieldCustomisationForm = new FormGroup({
              rejectionReason: new FormGroup({
                rejectionReason: new FormControl(
                  this.saleSettings?.rejectionReason?.rejectionReason
                ),
              }), //reason for rejection options
              rejectionReasonVal: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.rejectionReasonVal?.displayName
                ),
                display: new FormControl(
                  this.saleSettings?.rejectionReasonVal?.display
                ),
                mandatory: new FormControl(
                  this.saleSettings?.rejectionReasonVal?.mandatory
                ),
              }), //reason for rejection settings
              selectedCust: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.selectedCust.displayName,
                  Validators.required
                ),
                display: new FormControl(
                  this.saleSettings?.selectedCust?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.saleSettings?.selectedCust?.mandatory,
                  Validators.required
                ),
              }),
              saleTitle: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.saleTitle.displayName,
                  Validators.required
                ),
                display: new FormControl(
                  this.saleSettings?.saleTitle?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.saleSettings?.saleTitle?.mandatory,
                  Validators.required
                ),
              }),
              expCompletionDate: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.expCompletionDate.displayName,
                  Validators.required
                ),
                display: new FormControl(
                  this.saleSettings?.expCompletionDate?.display,
                  Validators.required
                ),
                mandatory: new FormControl(
                  this.saleSettings?.expCompletionDate?.mandatory,
                  Validators.required
                ),
              }),
              estimatedValue: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.estimatedValue.displayName
                ),
                display: new FormControl(
                  this.saleSettings?.estimatedValue?.display
                ),
                mandatory: new FormControl(
                  this.saleSettings?.estimatedValue?.mandatory
                ),
              }),
              collectionMode: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.collectionMode.displayName
                ),
                display: new FormControl(
                  this.saleSettings?.collectionMode?.display
                ),
                mandatory: new FormControl(
                  this.saleSettings?.collectionMode?.mandatory
                ),
              }),
              startDate: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.startDate.displayName
                ),
                display: new FormControl(this.saleSettings?.startDate?.display),
                mandatory: new FormControl(
                  this.saleSettings?.startDate?.mandatory
                ),
              }),
              selectedSalePipeline: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.selectedSalePipeline.displayName
                ),
                display: new FormControl(
                  this.saleSettings?.selectedSalePipeline?.display
                ),
                mandatory: new FormControl(
                  this.saleSettings?.selectedSalePipeline?.mandatory
                ),
              }),
              salesStage: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.salesStage.displayName
                ),
                display: new FormControl(
                  this.saleSettings?.salesStage?.display
                ),
                mandatory: new FormControl(
                  this.saleSettings?.salesStage?.mandatory
                ),
              }),
              priority: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.priority.displayName
                ),
                display: new FormControl(this.saleSettings?.priority?.display),
                mandatory: new FormControl(
                  this.saleSettings?.priority?.mandatory
                ),
              }),
              description: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.description.displayName
                ),
                display: new FormControl(
                  this.saleSettings?.description?.display
                ),
                mandatory: new FormControl(
                  this.saleSettings?.description?.mandatory
                ),
              }),
              assignedTo: new FormGroup({
                displayName: new FormControl(
                  this.saleSettings?.assignedTo.displayName
                ),
                display: new FormControl(
                  this.saleSettings?.assignedTo?.display
                ),
                mandatory: new FormControl(
                  this.saleSettings?.assignedTo?.mandatory
                ),
              }),
              // value: new FormGroup({
              //   displayName: new FormControl(
              //     this.saleSettings?.value.displayName
              //   ),
              //   display: new FormControl(this.saleSettings?.value?.display),
              //   mandatory: new FormControl(this.saleSettings?.value?.mandatory),
              // }),
              // expense: new FormGroup({
              //   displayName: new FormControl(
              //     this.saleSettings?.expense.displayName
              //   ),
              //   display: new FormControl(this.saleSettings?.expense?.display),
              //   mandatory: new FormControl(
              //     this.saleSettings?.expense?.mandatory
              //   ),
              // }),
              // invoiced: new FormGroup({
              //   displayName: new FormControl(
              //     this.saleSettings?.invoiced.displayName
              //   ),
              //   display: new FormControl(this.saleSettings?.invoiced?.display),
              //   mandatory: new FormControl(
              //     this.saleSettings?.invoiced?.mandatory
              //   ),
              // }),
              // collected: new FormGroup({
              //   displayName: new FormControl(
              //     this.saleSettings?.collected.displayName
              //   ),
              //   display: new FormControl(this.saleSettings?.collected?.display),
              //   mandatory: new FormControl(
              //     this.saleSettings?.collected?.mandatory
              //   ),
              // }),
            });
          }
          // //disabling default fields
          this.fieldCustomisationForm
            .get('selectedCust.display')
            .setValue(true);
          this.fieldCustomisationForm.get('selectedCust.display').disable();
          this.fieldCustomisationForm
            .get('selectedCust.mandatory')
            .setValue(true);
          this.fieldCustomisationForm.get('selectedCust.mandatory').disable();
          // // saletitle
          this.fieldCustomisationForm.get('saleTitle.display').setValue(true);
          this.fieldCustomisationForm.get('saleTitle.display').disable();
          this.fieldCustomisationForm.get('saleTitle.mandatory').setValue(true);
          this.fieldCustomisationForm.get('saleTitle.mandatory').disable();
          // // expCompletionDate
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
          // // // selectedSalePipeline
          // this.fieldCustomisationForm.get('selectedSalePipeline.display').setValue(true);
          // this.fieldCustomisationForm.get('selectedSalePipeline.display').disable();
          // this.fieldCustomisationForm.get('selectedSalePipeline.mandatory').setValue(true);
          // this.fieldCustomisationForm.get('selectedSalePipeline.mandatory').disable();
          // // salesStage
          this.fieldCustomisationForm.get('salesStage.display').setValue(true);
          this.fieldCustomisationForm.get('salesStage.display').disable();
          this.fieldCustomisationForm
            .get('salesStage.mandatory')
            .setValue(true);
          this.fieldCustomisationForm.get('salesStage.mandatory').disable();
          // // priority
          this.fieldCustomisationForm.get('priority.display').setValue(true);
          this.fieldCustomisationForm.get('priority.display').disable();
          this.fieldCustomisationForm.get('priority.mandatory').setValue(true);
          this.fieldCustomisationForm.get('priority.mandatory').disable();
          //value
          // this.fieldCustomisationForm.get('value.display').setValue(true);
          // this.fieldCustomisationForm.get('value.display').disable();
          // this.fieldCustomisationForm.get('value.mandatory').setValue(true);
          // this.fieldCustomisationForm.get('value.mandatory').disable();
          //expense
          // this.fieldCustomisationForm.get('expense.display').setValue(true);
          // this.fieldCustomisationForm.get('expense.display').disable();
          // this.fieldCustomisationForm.get('expense.mandatory').setValue(true);
          // this.fieldCustomisationForm.get('expense.mandatory').disable();
          // //invoiced
          // this.fieldCustomisationForm.get('invoiced.display').setValue(true);
          // this.fieldCustomisationForm.get('invoiced.display').disable();
          // this.fieldCustomisationForm.get('invoiced.mandatory').setValue(true);
          // this.fieldCustomisationForm.get('invoiced.mandatory').disable();
          // //collected
          // this.fieldCustomisationForm.get('collected.display').setValue(true);
          // this.fieldCustomisationForm.get('collected.display').disable();
          // this.fieldCustomisationForm.get('collected.mandatory').setValue(true);
          // this.fieldCustomisationForm.get('collected.mandatory').disable();
          //
          this.disableEstVal();
          this.disableCollMode();
          this.disablestartDate();
          this.disableSelecetedPipeline();
          // this.disableSalesStage();
          // this.disablePriority();
          // this.disableselectedProduct();
          // this.disableselProdCat();
          this.disableDescription();
          this.disableReasonRejection();
          this.disableAssignedTo();
          // this.disableAssignedToName();
          //disabling loader
          this.progressBarStatus = true;
        }
      }
    );
  }
  //edit cusom Document
  editDoc(i){
    this.editedDoc = true;
    this.expDocPanel = true;
    this.editDocIndex = i;
    this.edit_documentName = this.saleDocs[i].documentName;
    this.previousDocName = this.saleDocs[i].documentName;
    this.edit_docValidationCheck= this.saleDocs[i].docValidation;
    this.edit_csv_type = this.saleDocs[i].doctypes.csv;
    this.edit_msWord_type = this.saleDocs[i].doctypes.word;
    this.edit_jpg_type = this.saleDocs[i].doctypes.jpg;
    this.edit_pdf_type = this.saleDocs[i].doctypes.pdf;
    this.edit_jpeg_type = this.saleDocs[i].doctypes.jpeg;
    this.edit_png_type = this.saleDocs[i].doctypes.png;
    this.docIdentifier = this.saleDocs[i].docIdentifier;
    this.edit_doc_type = this.saleDocs[i].doctypes.doc;
    this.edit_docx_type = this.saleDocs[i].doctypes.docx;
  }
  //delete custom document
  deleteDocument(index){
    //opening pop up for delete confirmation
    this.dialog.open(StatusPopupComponent, {
      disableClose: true,
      data: {
        type: 'saleCustomDoc',
        uid: this.superUserId,
        statusArray: this.saleDocs,
        currentIndex: index,
      },
    });
  }
  //submit edit cusom Document
  documentEdit(){
    if(this.previousDocName != this.edit_documentName){
    let docNameEditArray = [];
    this.saleDocs.forEach((ele) =>{ docNameEditArray.push(ele.documentName.toLowerCase())})
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
      this.saleDocs[this.editDocIndex] = documentObj;
      this.db.docUpload(this.superUserId, this.saleDocs).then(() => {
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
      this.saleDocs[this.editDocIndex] = documentObj;
      this.db.docUpload(this.superUserId, this.saleDocs).then(() => {
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
  //add customdocument
  customDocUpload(){
    if (this.saleDocs.length != 0) {
      let docNameArray = [];
      this.saleDocs.forEach((ele) =>{ docNameArray.push(ele.documentName.toLowerCase())})
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
        this.saleDocs.push(documentObj)
        this.db.docUpload(this.superUserId, this.saleDocs).then(() => {
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
      this.saleDocs.push(documentObj)
      this.db.docUpload(this.superUserId, this.saleDocs).then(() => {
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

  ngOnInit(): void {}
  // edit button on Sale field actions
  editSalefn() {
    this.editSale = true;
  }
  // clear button on Sale field actions
  clearSale() {
    this.editSale = false;
    this.fieldNameSale = this.superUserDetails.fieldNames.fieldNameSale;
  }
  // save button on contact field actions
  saveSale() {
    this.editSale = false;
    this.db.updateSalefieldName(this.superUserId, this.fieldNameSale);
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
  // edit button on SaleNotes field actions
  editSaleNotesfn() {
    this.editSaleNotes = true;
  }
  // clear button on SaleNotes field actions
  clearSaleNotes() {
    this.editSaleNotes = false;
    this.fieldNameSaleNotes =
      this.superUserDetails.fieldNames.fieldNameSaleNotes;
  }
  // save button on SaleNotes field actions
  saveSaleNotes() {
    this.editSaleNotes = false;
    this.db.updateSaleNotesfieldName(this.superUserId, this.fieldNameSaleNotes);
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
  // edit button on Estimate field actions
  editEstimatefn() {
    this.editEstimate = true;
  }
  // clear button on contact field actions
  clearEstimate() {
    this.editEstimate = false;
    this.fieldNameEstimate = this.superUserDetails.fieldNames.fieldNameEstimate;
  }
  // save button on contact field actions
  saveEstimate() {
    this.editEstimate = false;
    this.db.updateEstimatefieldName(this.superUserId, this.fieldNameEstimate);
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
  // edit button on Quotation field actions
  editQuotationfn() {
    this.editQuotation = true;
  }
  // clear button on Quotation field actions
  clearQuotation() {
    this.editQuotation = false;
    this.fieldNameQuotation =
      this.superUserDetails.fieldNames.fieldNameQuotation;
  }
  // save button on Quotation field actions
  saveQuotation() {
    this.editQuotation = false;
    this.db.updateQuotationfieldName(this.superUserId, this.fieldNameQuotation);
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
  // edit button on Invoice field actions
  editInvoicefn() {
    this.editInvoice = true;
  }
  // clear button on Invoice field actions
  clearInvoice() {
    this.editInvoice = false;
    this.fieldNameInvoice = this.superUserDetails.fieldNames.fieldNameInvoice;
  }
  // save button on Invoice field actions
  saveInvoice() {
    this.editInvoice = false;
    this.db.updateInvoicefieldName(this.superUserId, this.fieldNameInvoice);
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
  //customisasible fied disable controls
  disableEstVal() {
    // estimated value
    if (
      this.fieldCustomisationForm.get('estimatedValue.mandatory').value === true
    ) {
      this.fieldCustomisationForm.get('estimatedValue.display').setValue(true);
      this.fieldCustomisationForm.get('estimatedValue.display').disable();
    } else {
      let val = this.saleSettings.estimatedValue.display;
      this.fieldCustomisationForm.get('estimatedValue.display').setValue(val);
      this.fieldCustomisationForm.get('estimatedValue.display').enable();
    }
  }
  disableCollMode() {
    // collectionMode
    if (
      this.fieldCustomisationForm.get('collectionMode.mandatory').value === true
    ) {
      this.fieldCustomisationForm.get('collectionMode.display').setValue(true);
      this.fieldCustomisationForm.get('collectionMode.display').disable();
    } else {
      let val = this.saleSettings.collectionMode.display;
      this.fieldCustomisationForm.get('collectionMode.display').setValue(val);
      this.fieldCustomisationForm.get('collectionMode.display').enable();
    }
  }
  disablestartDate() {
    // startDate
    if (this.fieldCustomisationForm.get('startDate.mandatory').value === true) {
      this.fieldCustomisationForm.get('startDate.display').setValue(true);
      this.fieldCustomisationForm.get('startDate.display').disable();
    } else {
      let val = this.saleSettings.startDate.display;
      this.fieldCustomisationForm.get('startDate.display').setValue(val);
      this.fieldCustomisationForm.get('startDate.display').enable();
    }
  }
  disableSelecetedPipeline() {
    // selectedSalePipeline
    if (
      this.fieldCustomisationForm.get('selectedSalePipeline.mandatory')
        .value === true
    ) {
      this.fieldCustomisationForm
        .get('selectedSalePipeline.display')
        .setValue(true);
      this.fieldCustomisationForm.get('selectedSalePipeline.display').disable();
    } else {
      let val = this.saleSettings.selectedSalePipeline.display;
      this.fieldCustomisationForm
        .get('selectedSalePipeline.display')
        .setValue(val);
      this.fieldCustomisationForm.get('selectedSalePipeline.display').enable();
    }
  }

  disableselectedProduct() {
    // selectedProduct
    if (
      this.fieldCustomisationForm.get('selectedProduct.mandatory').value ===
      true
    ) {
      this.fieldCustomisationForm.get('selectedProduct.display').setValue(true);
      this.fieldCustomisationForm.get('selectedProduct.display').disable();
    } else {
      let val = this.saleSettings.selectedProduct.display;
      this.fieldCustomisationForm.get('selectedProduct.display').setValue(val);
      this.fieldCustomisationForm.get('selectedProduct.display').enable();
    }
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
      let val = this.saleSettings.rejectionReasonVal?.display;
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
  disableDescription() {
    // description
    if (
      this.fieldCustomisationForm.get('description.mandatory').value === true
    ) {
      this.fieldCustomisationForm.get('description.display').setValue(true);
      this.fieldCustomisationForm.get('description.display').disable();
    } else {
      let val = this.saleSettings.description.display;
      this.fieldCustomisationForm.get('description.display').setValue(val);
      this.fieldCustomisationForm.get('description.display').enable();
    }
  }
  disableAssignedTo() {
    // assignedTo
    if (
      this.fieldCustomisationForm.get('assignedTo.mandatory').value === true
    ) {
      this.fieldCustomisationForm.get('assignedTo.display').setValue(true);
      this.fieldCustomisationForm.get('assignedTo.display').disable();
    } else {
      let val = this.saleSettings.assignedTo.display;
      this.fieldCustomisationForm.get('assignedTo.display').setValue(val);
      this.fieldCustomisationForm.get('assignedTo.display').enable();
    }
  }
  //field customisation submit button
  onSubmitCustField() {
    // estimatedValue
    if (
      this.fieldCustomisationForm.getRawValue().estimatedValue.displayName ===
      ''
    ) {
      this.fieldCustomisationForm
        .get('estimatedValue.displayName')
        .setValue(defaultSaleSettings.CONST_VALUE.estimatedValue.displayName);
    }
    // collectionMode
    if (
      this.fieldCustomisationForm.getRawValue().collectionMode.displayName ===
      ''
    ) {
      this.fieldCustomisationForm
        .get('collectionMode.displayName')
        .setValue(defaultSaleSettings.CONST_VALUE.collectionMode.displayName);
    }
    // startDate
    if (
      this.fieldCustomisationForm.getRawValue().startDate.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('startDate.displayName')
        .setValue(defaultSaleSettings.CONST_VALUE.startDate.displayName);
    }
    // // selectedSalePipeline
    if (
      this.fieldCustomisationForm.getRawValue().selectedSalePipeline
        .displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('selectedSalePipeline.displayName')
        .setValue(
          defaultSaleSettings.CONST_VALUE.selectedSalePipeline.displayName
        );
    }
    // // salesStage
    // if (this.fieldCustomisationForm.getRawValue().salesStage.displayName === '') {
    //   this.fieldCustomisationForm
    //     .get('salesStage.displayName')
    //     .setValue(defaultSaleSettings.CONST_VALUE.salesStage.displayName);
    // }
    // // priority
    // if (this.fieldCustomisationForm.getRawValue().priority.displayName === '') {
    //   this.fieldCustomisationForm
    //     .get('priority.displayName')
    //     .setValue(defaultSaleSettings.CONST_VALUE.priority.displayName);
    // }
    // description
    if (
      this.fieldCustomisationForm.getRawValue().description.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('description.displayName')
        .setValue(defaultSaleSettings.CONST_VALUE.description.displayName);
    }
    // // selectedProduct
    // if (this.fieldCustomisationForm.getRawValue().selectedProduct.displayName === '') {
    //   this.fieldCustomisationForm
    //     .get('selectedProduct.displayName')
    //     .setValue(defaultSaleSettings.CONST_VALUE.selectedProduct.displayName);
    // }
    // // selProdCat
    // if (this.fieldCustomisationForm.getRawValue().selProdCat.displayName === '') {
    //   this.fieldCustomisationForm
    //     .get('selProdCat.displayName')
    //     .setValue(defaultSaleSettings.CONST_VALUE.selProdCat.displayName);
    // }
    // assignedTo
    if (
      this.fieldCustomisationForm.getRawValue().assignedTo.displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('assignedTo.displayName')
        .setValue(defaultSaleSettings.CONST_VALUE.assignedTo.displayName);
    }
    // // assignedToName
    // if (this.fieldCustomisationForm.getRawValue().assignedToName.displayName === '') {
    //   this.fieldCustomisationForm
    //     .get('assignedToName.displayName')
    //     .setValue(defaultSaleSettings.CONST_VALUE.assignedToName.displayName);
    // }
    //rejectionReasonVal display name is not provided
    if (
      this.fieldCustomisationForm.getRawValue().rejectionReasonVal
        .displayName === ''
    ) {
      this.fieldCustomisationForm
        .get('rejectionReasonVal.displayName')
        .setValue(
          defaultSaleSettings.CONST_VALUE.rejectionReasonVal.displayName
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

  saveProdSett() {
    this.db.itemMaxAllowedFn(this.superUserId, this.maxItems);
    this.snack.open('Successfully updated', '', {
      duration: 2000,
    });
  }
  qntyDisplay(event) {
    this.db.itemQtyDisplayFn(this.superUserId, event.checked);
    this.snack.open('Successfully updated', '', {
      duration: 2000,
    });
  }
  editpipelinename(pipeline) {
    pipeline.editPipelineName = true;
  }



  //to enable and disable edit mode
  onTogglenotEditMode() {
    this.notEditMode = !this.notEditMode;
  }
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  //triggered while dragging and dropping /rearranging the current status
  drop(event: CdkDragDrop<any[]>, index) {
    // console.log(index, event);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.db.updateSaleStatusPipeline(
        this.superUserId,
        event.container.data,
        index
      );
      this.snack.open('Successfully updated', '', {
        duration: 2000,
      });
    }
    // console.log(event.container.data)
  }




  //triggered on clicking back icon to moving back to previous page
  onBack() {
    this.location.back();
  }
  //triggered while clicking add field button
  // addField() {
  //   let activeFields = [];
  //   //finding number of active fields in db
  //   for (let i = 0; i < this.currentCustomField?.length; i++) {
  //     if (this.currentCustomField[i].isActive) {
  //       activeFields.push(this.currentCustomField[i]);
  //     }
  //   }
  //   //if number of additonal field greater than 10 we have to restrict addition of field
  //   if (activeFields?.length >= 10) {
  //     this.snack.open('You can only add maximum 10 additional fields', '', {
  //       duration: 2000,
  //     });
  //   }
  //   //if number of active field below 10
  //   else {
  //     this.addNewField = true;
  //   }
  // }
  // //triggered while in add field div submit button
  // submitField() {
  //   //if no additional field previously added
  //   if (!this.currentCustomField) {
  //     this.currentCustomField = [];
  //   }
  //   let options;
  //   let optionArray = [];
  //   //setting new value in customfields array
  //   this.customFields.fieldName = this.fieldName;
  //   this.customFields.fieldType = this.fieldType;
  //   //adding default value if default value exists
  //   if (this.defaultValue) {
  //     this.customFields.defaultValue = this.defaultValue;
  //   } else {
  //     this.customFields.defaultValue = null;
  //   }
  //   //if data type is category we have to split options to an array to list in userData
  //   if (this.categories) {
  //     options = this.categories?.split(',');
  //     // pushing variable in to array as array elemnts
  //     for (var i = options?.length - 1; i >= 0; i--) {
  //       optionArray.push(options[i].trim());
  //     }
  //     // setting options and default value if type is category
  //     this.customFields.categories = optionArray;
  //     this.customFields.categoriesOpn = this.categories;
  //   } else {
  //     //for setting null if no options are given in category option
  //     this.customFields.categories = null;
  //     this.customFields.categoriesOpn = null;
  //   }
  //   //setting mandatory field to array as false if not selected
  //   if (!this.mandatory) {
  //     this.customFields.mandatory = false;
  //   } else {
  //     this.customFields.mandatory = this.mandatory;
  //   }
  //   this.customFields.isActive = true;
  //   // pushing new field array to existing additionalfields array
  //   this.currentCustomField.push(this.customFields);
  //   //storing this new updated custom field array to db

  //   //reseting all variable after updating
  //   this.fieldName = null;
  //   this.fieldType = null;
  //   this.defaultValue = null;
  //   this.categories = null;
  //   //this.customFields.defaultValue = null;
  //   this.mandatory = false;
  //   this.addNewField = false;
  //   this.db
  //     .updateCustomFields(this.userId, this.currentCustomField)
  //     .then(() => {
  //       this.snack.open('Custom field added successfully', '', {
  //         duration: 2000,
  //       });
  //     });
  // }
  // submitEditField(index) {
  //   //if no additional field previously added
  //   if (!this.currentCustomField) {
  //     this.currentCustomField = [];
  //   }
  //   let options;
  //   let optionArray = [];
  //   //setting new value in customfields array
  //   this.customFields.fieldName = this.editFname;
  //   this.customFields.fieldType = this.editFieldType;
  //   //adding default value if default value exists
  //   if (this.editDefaultValue) {
  //     this.customFields.defaultValue = this.editDefaultValue;
  //   }
  //   //if no default value setting it as null
  //   else {
  //     this.customFields.defaultValue = null;
  //   }
  //   //if data type is category we have to split options to an array to list in userData
  //   if (this.editCategoriesOpn) {
  //     options = this.editCategoriesOpn?.split(',');
  //     // pushing variable in to array as array elemnts
  //     for (var i = options?.length - 1; i >= 0; i--) {
  //       optionArray.push(options[i].trim());
  //     }
  //     // setting options and default value if type is category
  //     this.customFields.categories = optionArray;
  //     this.customFields.categoriesOpn = this.editCategoriesOpn;
  //   } else {
  //     //for setting null if no options are given in category option
  //     this.customFields.categories = null;
  //     this.customFields.categoriesOpn = null;
  //   }
  //   //setting mandatory field to array
  //   this.customFields.mandatory = this.editMandatory;
  //   //setting field active as default
  //   this.customFields.isActive = true;
  //   //storing setted customfield to main customfield array from db
  //   this.currentCustomField[this.editIndex] = this.customFields;
  //   //storing this new updated custom field array to db
  //   this.db.updateCustomFields(this.userId, this.currentCustomField);
  //   //reseting all variable after updating
  //   this.fieldName = null;
  //   this.fieldType = null;
  //   this.defaultValue = null;
  //   this.categories = null;
  //   this.mandatory = false;
  //   this.addNewField = false;
  //   this.editedField = false;
  //   this.snack.open('Custom field edited successfully', '', {
  //     duration: 2000,
  //   });
  // }
  //triggered while cliking close button in add div used for closing
  submitFieldClose() {
    this.addNewField = false;
  }
  //triggered while closing mat accordian
  EditFieldClose() {
    this.editedField = false;
  }
  //editing a field in additional field triggered while clicking update button in edit additional field
  // editField(i) {
  //   this.editIndex = i;
  //   //for enabling expanded view in accordian
  //   this.editedField = true;
  //   //for binding data in fields
  //   this.editFname = this.currentCustomField[i].fieldName;
  //   this.editFieldType = this.currentCustomField[i].fieldType;
  //   this.editMandatory = this.currentCustomField[i].mandatory;
  //   if (this.editFieldType == 'date')
  //     this.editDefaultValue = !!this.currentCustomField[i].defaultValue
  //       ? this.currentCustomField[i].defaultValue.toDate
  //         ? this.currentCustomField[i].defaultValue.toDate()
  //         : this.currentCustomField[i].defaultValue
  //       : null;
  //   else this.editDefaultValue = this.currentCustomField[i].defaultValue;
  //   this.editCategoriesOpn = this.currentCustomField[i].categoriesOpn;
  // }
  ageValueChange(event) {
    //console.log(event.checked)
    this.db.updateSaleAgeActive(this.userId, event.checked);
    // this.db.updateSaleStatus()
  }
  //clear defaultValue field on selection change
  clear() {
    this.defaultValue = '';
  }
  //for deleting an additional field on clicking delete icon in additional fields
  // deleteField(i) {
  //   let index = i;
  //   //opening pop up for delete confirmation
  //   this.dialog.open(StatusPopupComponent, {
  //     disableClose: true,
  //     data: {
  //       type: 'deleteFieldSale',
  //       uid: this.userId,
  //       statusArray: this.currentCustomField,
  //       currentIndex: index,
  //     },
  //   });
  // }
  addPipeline(pipeline, i) {
    //pass value to StatusPopup component having text field to add new status
    this.dialog.open(StatusPopupComponent, {
      disableClose: true,
      data: {
        type: 'add',
        uid: this.superUserId,
        statusArray: pipeline.pipelineStages.map(({ name }) => {
          return name;
        }),
        statusAgeArray: pipeline.pipelineStages.map(({ age }) => {
          return age;
        }),
        ageChecked: this.ageChecked,
        mode: 'salePipeline',
        selectedPipeline: i,
      },
    });
  }
  edit_pipeline(pipeline, item, showAge, i, k) {
    //passing status values into StatusPopup component having text field to edit
    this.dialog.open(StatusPopupComponent, {
      disableClose: true,
      data: {
        type: 'edit',
        uid: this.superUserId,
        statusArray: pipeline.pipelineStages.map(({ name }) => {
          return name;
        }),
        statusAgeArray: pipeline.pipelineStages.map(({ age }) => {
          return age;
        }),
        currentIndex: k,
        currentData: item.name,
        currentDataAge: item.age,
        ageChecked: showAge ? this.ageChecked : false,
        mode: 'salePipeline',
        selectedPipeline: i,
      },
    });
  }
  deletePipeline(pipeline, item, i, k) {
    //passing status values into StatusPopup component to confirmation
    this.dialog.open(StatusPopupComponent, {
      disableClose: true,
      data: {
        type: 'delete',
        uid: this.superUserId,
        statusArray: pipeline.pipelineStages.map(({ name }) => {
          return name;
        }),
        statusAgeArray: pipeline.pipelineStages.map(({ age }) => {
          return age;
        }),
        currentIndex: k,
        currentData: item.name,
        mode: 'salePipeline',
        selectedPipeline: i,
      },
    });
  }
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    //to unsubscribe subscriptions
    this.userDetailsSubscription?.unsubscribe;
    this.profileDefinitionSubscription?.unsubscribe;
    this.onDestroy$.next();
  }
}
