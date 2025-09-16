/*********************************************************************************
Description: component used for edit/add/delete categories of expenses
Inputs: categories of expenses
Outputs:
***********************************************************************************/

import { PaymentSettingsService } from './payment-settings.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { StatusPopupComponent } from '../status-popup/status-popup.component';
import { Location } from '@angular/common';
import { customFields, defaultExpenseSettings, defaultPaymentSettings, expenseSettings, fieldNameLEngth, paymentSettings, UserAccessDetails } from 'src/app/data-models';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { FormControl, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-payment-settings',
  templateUrl: './payment-settings.component.html',
  styleUrls: ['./payment-settings.component.scss'],
})
export class PaymentSettingsComponent implements OnInit, OnDestroy {
  value: string; //for storing edited values
  items: any = []; //for storing categories for first time
  filtered: any = []; //for storing categories after filtering
  form: any; //used for storing user details
  currentIndex: number; //for storing index of selected element
  replaced: string; //for storing edited variable
  saves: boolean; //check whether savechange button clicked
  userDetailsSubscription: Subscription; //for subscribing userdetails
  edited: boolean = false; //setting edit field hidden
  added: boolean = false; //setting add field hidden
  id: string; //for storing user id
  user: any; //storing user details
  status: string; //storing category array
  superUserId: string; //storing super user id
  notEdit = true; //disabling edit mode by default
  changes: boolean = false; //for checking rearraging of category made
  progressBarStatus: boolean = false; //for enabling loader
  accountType: string; //for saving user datatype
  isMobilesize: Boolean = false; //for enabling mobile screen size
  isTabletsize: Boolean = false; //for enabling tablet screen size
  superUserDetails: any; //store super user details
fieldNamePayment: string = "Payment"; //custom expense name
networkConnection: boolean; //network check
  usrProfileData: UserAccessDetails = null; //to check restriction on settings
  disableSettingsView = false; //settings view is disabled
  currentCustomField: any = []; //to store additional fields
  fieldName: string; //for storing field name while adding
  defaultValue: string; //for storing default value while adding
  fieldType: string; //for storing field type while adding
  categories: string; //for storing categories while adding
  mandatory: boolean = false; //seting mandatory as false;
  editIndex: number; //for storing index of edited variable
  editedField: boolean = false; //edited value while adding new field
  editFname: any; //to store fieldname while editing
  editFieldType: any; //to store fieldtype while editing
  editMandatory: any; //to store set mandatory or not while editing
  editDefaultValue: any; //to store default value while editing
  editCategoriesOpn: any; //to store category options while editing
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
  addNewField: boolean = false; //variable used to hide and show add new field
  dataAccessRule: string;
  fieldCustomisationForm: FormGroup;
  settingsConfigured = false;
  editCollection: boolean = false;
  fieldNameCollection: string = 'Collection'; //local variable to store field name collection
  paymentSettings:paymentSettings = defaultPaymentSettings.CONST_VALUE;
  fieldMaxLength = fieldNameLEngth.FIELD_NAME_LENGTH; //maxlength from datamodel.ts, but not implemented for products and services

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private snack: MatSnackBar,
    public dialog: MatDialog,
    private db: PaymentSettingsService,
    private location: Location,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService
  ) {
    this.superUserDetails = this.commonService.getSuperUserData();
    // if (this.superUserDetails.fieldNames) {
    //   //getting field name to display
    //   this.fieldNamePayment = this.superUserDetails.fieldNames.fieldNamePayment;
    // }
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      //getting data from common service file related to the user
      (allData) => {
        if (allData) {
          // to check if settings is restricted
          this.usrProfileData = allData.usrProfileData;
          if (this.usrProfileData) {
            this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;
            // disable Settings view
            if (this.usrProfileData.isCheckedSett == false) {
              this.disableSettingsView = true;
            } else {
              if (this.usrProfileData.settView == false) {
                this.disableSettingsView = true;
              } else {
                this.disableSettingsView = false;
              }
            }
          }
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
          this.user = allData.userDetails;
          this.id=allData.userId;
           //for storing all custom fields from db
          //condition to check where the user is a super user or not
          if (allData.userDetails.accountType == 'SuperUser') {
            this.superUserId = allData.userDetails.superUserId;
            this.form = allData.userDetails;
            this.accountType = allData.userDetails.accountType;


            this.filtered = this.items;
            //disabling loader
            this.progressBarStatus = true;
            this.currentCustomField = allData.userDetails.customFieldsPayment;

          } else {
            this.id = allData.superUserDetails.superUserId;
            // console.log(allData.superUserDetails.superUserId)
            this.superUserId = allData.userDetails.superUserId;
            this.form = allData.superUserDetails;
            this.accountType = allData.superUserDetails.accountType;

            this.filtered = this.items;
            //disabling loader
            this.progressBarStatus = true;
            this.currentCustomField = allData.superUserDetails.customFieldsPayment;

          }
          if (this.superUserDetails.fieldNames) {
            //getting field name to display
            this.fieldNameCollection = allData.superUserDetails.fieldNames.fieldNameCollection;
          }
          //customisation fields start here
          if (
            typeof allData.superUserDetails.paymentSettings === 'undefined' ||
            allData.superUserDetails.paymentSettings === null
          ) {
            this.settingsConfigured = false;

          } else {
            this.settingsConfigured = true;
            this.paymentSettings = allData.superUserDetails.paymentSettings;
            if(allData.superUserDetails.paymentSettings){
              this.commonService.checkCustomField(defaultPaymentSettings.CONST_VALUE,allData.superUserDetails.paymentSettings)
            }

          }
          // console.log("Super User",allData.superUserDetails);
          this.fieldCustomisationForm = new FormGroup({
            // saletitle: new FormGroup({
            //   displayName: new FormControl(
            //    this.paymentSettings?.saletitle.displayName,
            //     [Validators.required, Validators.minLength(2)]
            //   ),
            //   display: new FormControl(
            //     this.paymentSettings?.saletitle?.display,
            //     Validators.required
            //   ),
            //   mandatory: new FormControl(
            //    this.paymentSettings?.saletitle?.mandatory,
            //     Validators.required
            //   ),
            // }),
            paymentType: new FormGroup({
              displayName: new FormControl(
                this.paymentSettings?.paymentType?.displayName,
                [Validators.required]
              ),
              display: new FormControl(
                this.paymentSettings?.currency?.display,
                Validators.required
              ),
              mandatory: new FormControl(
                this.paymentSettings?.currency?.mandatory,
                Validators.required
              ),
            }),
            invoiceprefixAndDocNumber: new FormGroup({
              displayName: new FormControl(
                this.paymentSettings?.invoiceprefixAndDocNumber?.displayName,
                [Validators.required]
              ),
              display: new FormControl(
                this.paymentSettings?.invoiceprefixAndDocNumber?.display,
                Validators.required
              ),
              mandatory: new FormControl(
                this.paymentSettings?.invoiceprefixAndDocNumber?.mandatory,
                Validators.required
              ),
            }),
            currency: new FormGroup({
              displayName: new FormControl(
                this.paymentSettings?.currency?.displayName,
                [Validators.required]
              ),
              display: new FormControl(
                this.paymentSettings?.currency?.display,
                Validators.required
              ),
              mandatory: new FormControl(
                this.paymentSettings?.currency?.mandatory,
                Validators.required
              ),
            }),
            amountCollected: new FormGroup({
              displayName: new FormControl(
                this.paymentSettings?.amountCollected?.displayName,
                [Validators.required]
              ),
              display: new FormControl(
                this.paymentSettings?.amountCollected?.display,
                Validators.required
              ),
              mandatory: new FormControl(
                this.paymentSettings?.amountCollected?.mandatory,
                Validators.required
              ),
            }),
            paymentDate: new FormGroup({
              displayName: new FormControl(
                this.paymentSettings?.paymentDate?.displayName,
                [Validators.required]
              ),
              display: new FormControl(
                this.paymentSettings?.paymentDate?.display,
                Validators.required
              ),
              mandatory: new FormControl(
                this.paymentSettings?.paymentDate?.mandatory,
                Validators.required
              ),
            }),
            paymentMode: new FormGroup({
              displayName: new FormControl(
                this.paymentSettings?.paymentMode?.displayName,
                [Validators.required]
              ),
              display: new FormControl(
                this.paymentSettings?.paymentMode?.display,
                Validators.required
              ),
              mandatory: new FormControl(
                this.paymentSettings?.paymentMode?.mandatory,
                Validators.required
              ),
            }),
            chequeNo: new FormGroup({
              displayName: new FormControl(
                this.paymentSettings?.chequeNo?.displayName,
                [Validators.required]
              ),
              display: new FormControl(
                this.paymentSettings?.chequeNo?.display,
                Validators.required
              ),
              mandatory: new FormControl(
                this.paymentSettings?.chequeNo?.mandatory,
                Validators.required
              ),
            }),
            chequeBank: new FormGroup({
              displayName: new FormControl(
                this.paymentSettings?.chequeBank?.displayName,
                [Validators.required]
              ),
              display: new FormControl(
                this.paymentSettings?.chequeBank?.display,
                Validators.required
              ),
              mandatory: new FormControl(
                this.paymentSettings?.chequeBank?.mandatory,
                Validators.required
              ),
            }),

          });
          // this.fieldCustomisationForm.get('saletitle.display').setValue(true);
          // this.fieldCustomisationForm.get('saletitle.display').disable();
          // this.fieldCustomisationForm.get('saletitle.mandatory').setValue(true);
          // this.fieldCustomisationForm.get('saletitle.mandatory').disable();
          this.fieldCustomisationForm.get('paymentType.display').setValue(true);
          this.fieldCustomisationForm.get('paymentType.display').disable();
          this.fieldCustomisationForm.get('paymentType.mandatory').setValue(true);
          this.fieldCustomisationForm.get('paymentType.mandatory').disable();
          this.fieldCustomisationForm.get('invoiceprefixAndDocNumber.display').setValue(true);
          this.fieldCustomisationForm.get('invoiceprefixAndDocNumber.display').disable();
          this.fieldCustomisationForm.get('invoiceprefixAndDocNumber.mandatory').setValue(true);
          this.fieldCustomisationForm.get('invoiceprefixAndDocNumber.mandatory').disable();
          this.fieldCustomisationForm.get('currency.display').setValue(true);
          this.fieldCustomisationForm.get('currency.display').disable();
          this.fieldCustomisationForm.get('currency.mandatory').setValue(true);
          this.fieldCustomisationForm.get('currency.mandatory').disable();
          this.fieldCustomisationForm.get('amountCollected.display').setValue(true);
          this.fieldCustomisationForm.get('amountCollected.display').disable();
          this.fieldCustomisationForm.get('amountCollected.mandatory').setValue(true);
          this.fieldCustomisationForm.get('amountCollected.mandatory').disable();
          this.fieldCustomisationForm.get('paymentDate.display').setValue(true);
          this.fieldCustomisationForm.get('paymentDate.display').disable();
          this.fieldCustomisationForm.get('paymentDate.mandatory').setValue(true);
          this.fieldCustomisationForm.get('paymentDate.mandatory').disable();
          this.fieldCustomisationForm.get('paymentMode.display').setValue(true);
          this.fieldCustomisationForm.get('paymentMode.display').disable();
          this.fieldCustomisationForm.get('paymentMode.mandatory').setValue(true);
          this.fieldCustomisationForm.get('paymentMode.mandatory').disable();
          this.fieldCustomisationForm.get('chequeBank.display').setValue(true);
          this.fieldCustomisationForm.get('chequeBank.display').disable();
          this.fieldCustomisationForm.get('chequeBank.mandatory').setValue(true);
          this.fieldCustomisationForm.get('chequeBank.mandatory').disable();
          this.fieldCustomisationForm.get('chequeNo.display').setValue(true);
          this.fieldCustomisationForm.get('chequeNo.display').disable();
          this.fieldCustomisationForm.get('chequeNo.mandatory').setValue(true);
          this.fieldCustomisationForm.get('chequeNo.mandatory').disable();

        }
      }
    );
  }
  ngOnInit(): void {}
  // //customisable fields
  onSubmit() {
    this.db.updateFieldCustomization(
      this.superUserId,
      this.fieldCustomisationForm.getRawValue()
    );
    this.snack.open('Successfully updated', '', {
      duration: 2000,
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
  // //add a new category to expense
  // add() {
  //   //adding category by input field in status popup component
  //   this.dialog.open(StatusPopupComponent, {
  //     disableClose: true,
  //     data: {
  //       type: 'add',
  //       uid: this.id,
  //       statusArray: this.filtered,
  //       mode: 'expense',
  //     },
  //   });
  // }
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  // //edit a category
  // edit(data) {
  //   let index;
  //   //getting index of exepnse to be edited
  //   index = this.filtered.findIndex((s) => s === data);
  //   this.currentIndex = index;
  //   this.replaced = data;
  //   //console.log("Current Index : "+ this.currentIndex)
  //   //console.log("Item Replaced : "+ this.replaced)
  //   //opening edit popup and passing id value and category array
  //   this.dialog.open(StatusPopupComponent, {
  //     disableClose:true,
  //     data: {
  //       type: 'edit',
  //       uid: this.id,
  //       statusArray: this.filtered,
  //       currentIndex: this.currentIndex,
  //       currentData: this.replaced,
  //       mode: 'expense',
  //     },
  //   });
  // }

  //to go back to previous page
  onBack() {
    this.location.back();
  }
  //for editing a currently existing value

  // delete(data) {
  //   let index;
  //   //getting index of exepnse to be deleted
  //   index = this.filtered.findIndex((s) => s === data);
  //   //opening confirmation popup and passing index,value,array
  //   this.dialog.open(StatusPopupComponent, {
  //     disableClose: true,
  //     data: {
  //       type: 'delete',
  //       uid: this.id,
  //       statusArray: this.filtered,
  //       currentIndex: index,
  //       currentData: data,
  //       mode: 'expense',
  //     },
  //   });
  // }
   //clear defaultValue field on selection change
   clear() {
    this.defaultValue = '';
  }
  //additional field settings
  // addField() {
  //   if (this.currentCustomField?.length >= 10) {
  //     this.snack.open(
  //       'You can add to a maximum of 10 additional fields only!',
  //       '',
  //       {
  //         duration: 2000,
  //       }
  //     );
  //   } else {
  //     this.addNewField = true;
  //   }
  // }
  //editing a field in additional field triggered while clicking update button in edit additional field
  // editField(i) {
  //   this.editIndex = i;
  //   //for enabling expanded view in accordian
  //   this.editedField = true;
  //   //for binding data in fields
  //   this.editFname = this.currentCustomField[i].fieldName;
  //   this.editFieldType = this.currentCustomField[i].fieldType;
  //   this.editMandatory = this.currentCustomField[i].mandatory;
  //   if (this.editFieldType == 'date') {
  //     this.editDefaultValue = !!this.currentCustomField[i].defaultValue
  //       ? this.currentCustomField[i].defaultValue.toDate
  //         ? this.currentCustomField[i].defaultValue.toDate()
  //         : this.currentCustomField[i].defaultValue
  //       : null;
  //   } else this.editDefaultValue = this.currentCustomField[i].defaultValue;

  //   this.editCategoriesOpn = this.currentCustomField[i].categoriesOpn;
  // }
   //for deleting an additional field on clicking delete icon in additional fields
  //  deleteField(i) {
  //   let index = i;
  //   //opening pop up for delete confirmation
  //   this.dialog.open(StatusPopupComponent, {
  //     data: {
  //       type: 'deleteFieldPayment',
  //       uid: this.id,
  //       statusArray: this.currentCustomField,
  //       currentIndex: index,
  //     },
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
   //triggered while in add field div submit button
  //  submitField() {
  //   //if no additional field previously added
  //   if (!this.currentCustomField) {
  //     console.log(this.currentCustomField);

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
  //   //if data type is category we have to split options to an array to list in form
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
  //   //setting field active as default
  //   this.customFields.isActive = true;
  //   //setting mandatory field to array as false if not selected
  //   if (!this.mandatory) {
  //     this.customFields.mandatory = false;
  //   } else {
  //     this.customFields.mandatory = this.mandatory;
  //   }
  //   // pushing new field array to existing additionalfields array
  //   console.log("customfields,",this.customFields,"Current Custom field",this.currentCustomField);

  //   this.currentCustomField.push(this.customFields);
  //   //storing this new updated custom field array to db

  //   //reseting all variable after updating
  //   this.fieldName = null;
  //   this.fieldType = null;
  //   this.defaultValue = null;
  //   this.categories = null;
  //   this.mandatory = false;
  //   this.addNewField = false;
  //   // this.customFields.defaultValue = null;

  //   this.db
  //     .updateCustomFields(this.id, this.currentCustomField)
  //     .then(() => {
  //       this.snack.open('Custom field added successfully', '', {
  //         duration: 2000,
  //       });
  //     });
  // }
   //triggered while clicking submit in edit from accordian
  //  submitEditField(index) {
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
  //   //if data type is category we have to split options to an array to list in form
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
  //   this.db.updateCustomFields(this.id, this.currentCustomField);
  //   //reseting all variable after updating
  //   this.fieldName = null;
  //   this.fieldType = null;
  //   this.defaultValue = null;
  //   this.categories = null;
  //   this.mandatory = false;
  //   this.addNewField = false;
  //   this.editedField = false;
  //   this.editDefaultValue = null;
  //   this.snack.open('Custom field updated successfully', '', {
  //     duration: 2000,
  //   });
  // }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    //unsubscribing subscription;
    this.userDetailsSubscription?.unsubscribe;
  }
}
