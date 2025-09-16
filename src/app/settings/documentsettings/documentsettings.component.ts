/**********************************************************************************
Description: Component is used to configure Sales Documents
             edit and update using templates, logo, signature, default sales doument details
Inputs:
Outputs:
**********************************************************************************/
import {  customFields, DocContactDetails, hsnCodeDisplay, Profile, SharedLeadCaptureModel, UserAccessDetails } from './../../data-models';
import { DocumentsetttingsService } from './documentsetttings.service';
import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import * as firebase from 'firebase';
import { Observable, Subject, Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { TemplatePrev5Component } from './../../templates/template-prev5/template-prev5.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { TemplatePrevService } from './../../templates/template-prev.service';
import { CommonService } from 'src/app/common.service';
import { Currencies } from 'src/app/currencies';
import {
  DialogDataNumbering,
  DocumentnumberingPopupComponent,
} from '../documentnumbering-popup/documentnumbering-popup.component';
import { LeadCaptureSettingsService } from '../lead-capture-settings/lead-capture-settings.service';

@Component({
  selector: 'app-documentsettings',
  templateUrl: './documentsettings.component.html',
  styleUrls: ['./documentsettings.component.scss'],
})
export class DocumentsettingsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>(); //ng on destroy variable

  notEdit: Boolean = true; //direct route blocking variable according to user access permission

  imageSize: number = 512000; //restricting image size
  logoPreview: boolean = false; //disbling and enabling preview of logo
  signPreview: boolean = true; //disbling and enabling preview of sign

  userLogo: any; //to capture URL of logo
  userSign: any; //to capture URL of sign

  documentData: any; //default content form

  id: string; //storing superuserid/userid based on account type

  // variables for logo and signature uploading status
  task: AngularFireUploadTask;
  percentage1: Observable<number>; //storing percentage of logo
  percentage2: Observable<number>; //storing percentage of signature
  snapshot: Observable<any>; //observable for get upload details
  downloadURL: Observable<string>; //storing downlaod url of logo
  downloadURL1: Observable<string>; //storing downlaod url of signature

  [signpath: string]: any;

  dbL: boolean = true; //logo fetched from DB
  prvL: boolean = false; //logo preview
  dbS: boolean = true; //sign fetched from Db
  prvS: boolean = false; //sign preview
  logoStatus: boolean; //logostautus under superuser profile
  signStatus: boolean; // sign status undfer superuser profile
  accountType: string = ''; //account type of logged in user
  temp1Click: boolean = false; //checkbox on template 1
  temp2Click: boolean = false; //checkbox on template 2
  temp3Click: boolean = false; //checkbox on template 3
  temp4Click: boolean = false; //checkbox on template 4
  temp5Click: boolean = false; //checkbox on template 5
  temp6Click: boolean = false; //checkbox on template 6
  temp7Click: boolean = false; //checkbox on template 7
  temp8Click: boolean = false; //checkbox on template 8
  temp9Click: boolean = false; //checkbox on template 9
  temp10Click: boolean = false; //checkbox on template 10
  logoLoader: boolean = false; //logo loader
  logoExisting: boolean = false; //local variable to check logo status
  signExisting: boolean = false; //local variable to check sign status

  // customisable field names
  fieldNameContact: string = 'Contact'; // field name for contact
  fieldNameOrganization = 'Organization';
  fieldNameSale: string = 'Sale';
  fieldNameEstimate: string = 'Estimate';
  fieldNameQuotation: string = 'Quotation';
  fieldNameInvoice: string = 'Invoice';
    progressBarStatus: Boolean = false;

  notEditMode: Boolean = true; //edit button enabling default content
  logoplacehoplder: string = 'assets/images/logoplaceholder.PNG'; //dummy logo image
  signplaceholder: string = 'assets/images/sign.PNG'; //dummy sign image
  usrProfileData: UserAccessDetails; //user profile data
  docColor: string = '#3a9efd'; //default doc color
  nextEstimateNumber: number = 0;
  nextQuotationNumber: number = 0;
  nextInvoiceNumber: number = 0;

  userDetailsSubscription: Subscription;
  superUserDetails: Profile = null;
  superUserId: string = '';
  invoiceAutoPayLinkEnabled:boolean
  estimateAutoPayLinkEnabled:boolean
  quotationAutoPayLinkEnabled:boolean
  currentCustomField: any = []; //to store additional fields
  currentCustomFieldQuotation: any = []; //to store additional fields
  currentCustomFieldInvoices: any = []; //to store additional fields
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
  estimateOrgTag:boolean=false;
  estimateContactTag:boolean=false;
  estimateSaleTag:boolean=false;

  quotationOrgTag:boolean=false;
  quotationContactTag:boolean=false;
  quotationSaleTag:boolean=false;

  invoiceOrgTag:boolean=false;
  invoiceContactTag:boolean=false;
  invoiceSaleTag:boolean=false;
  index = 0;

  estimateContactDetails:DocContactDetails;// for estimate contactdetails save/display
  invoiceContactDetails:DocContactDetails;// for invoice contactdetails save/display
  quotationContactDetails:DocContactDetails;// for quotation contactdetails save/display

  hsnCodeDisplay: hsnCodeDisplay = hsnCodeDisplay.DATA;// for HSN Code Display

  constructor(
    public dialog: MatDialog,
    public db: DocumentsetttingsService,
    public leadCaptureService: LeadCaptureSettingsService,
    private snack: MatSnackBar,
    private storage: AngularFireStorage,
    private locationback: Location,
    private templatePreviewService: TemplatePrevService,
    private commonService: CommonService
  ) {
    this.currencyList = Currencies.getCurencies(); //get currency list from currencies.ts
    // initializing estimate/quotation and invoice contactdetails
    this.estimateContactDetails={
      contactName: '',
      contactNumber: '',
      email: '',
      signatoryName: '',
      designation: ''
    };
    this.quotationContactDetails={
      contactName: '',
      contactNumber: '',
      email: '',
      signatoryName: '',
      designation: ''
    };
    this.invoiceContactDetails={
      contactName: '',
      contactNumber: '',
      email: '',
      signatoryName: '',
      designation: ''
    };
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          // check for layout
          this.isTabletsize = allData.isTabetSize;
          this.isMobilesize = allData.isMobileSize;
          this.invoiceAutoPayLinkEnabled=!!allData.superUserDetails.invoiceAutoPayLinkEnable
          this.estimateAutoPayLinkEnabled=!!allData.superUserDetails.estimateAutoPayLinkEnable
          this.quotationAutoPayLinkEnabled=!!allData.superUserDetails.quotationAutoPayLinkEnable

          this.estimateOrgTag = allData.superUserDetails.estimateOrgTag ? allData.superUserDetails.estimateOrgTag : false
          this.estimateContactTag = allData.superUserDetails.estimateContactTag ? allData.superUserDetails.estimateContactTag : false
          this.estimateSaleTag = allData.superUserDetails.estimateSaleTag ? allData.superUserDetails.estimateSaleTag : false

          this.quotationOrgTag = allData.superUserDetails.quotationOrgTag ? allData.superUserDetails.quotationOrgTag : false
          this.quotationContactTag= allData.superUserDetails.quotationContactTag ? allData.superUserDetails.quotationContactTag : false
          this.quotationSaleTag= allData.superUserDetails.quotationSaleTag ? allData.superUserDetails.quotationSaleTag : false

          this.invoiceOrgTag= allData.superUserDetails.invoiceOrgTag ? allData.superUserDetails.invoiceOrgTag : false
          this.invoiceContactTag= allData.superUserDetails.invoiceContactTag ? allData.superUserDetails.invoiceContactTag : false
          this.invoiceSaleTag= allData.superUserDetails.invoiceSaleTag ? allData.superUserDetails.invoiceSaleTag : false

          if(allData.superUserDetails.hsnCodeDisplay){
            this.hsnCodeDisplay=allData.superUserDetails.hsnCodeDisplay
          }
          // for fetching estimate/quotation and invoice contact details
          if(allData.superUserDetails.estimateContactDetails){
            this.estimateContactDetails=allData.superUserDetails.estimateContactDetails
          }
          if(allData.superUserDetails.quotationContactDetails){
            this.quotationContactDetails=allData.superUserDetails.quotationContactDetails
          }
          if(allData.superUserDetails.invoiceContactDetails){
            this.invoiceContactDetails=allData.superUserDetails.invoiceContactDetails
          }

          // check for access control and thus block settings view
          this.usrProfileData = allData.usrProfileData;
          if (this.usrProfileData) {
            this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;
            // disable settings view
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

          // userDetails, superUserDetails and usrerid assigned to a variable
          let userData = allData.userDetails;
          this.superUserDetails = allData.superUserDetails;
          this.userId = allData.userId;
          this.accountType = userData.accountType;
          this.currentCustomField = this.superUserDetails.customFieldsEstimate;
          this.currentCustomFieldInvoices = this.superUserDetails.customFieldsInvoices;
          this.currentCustomFieldQuotation = this.superUserDetails.customFieldsQuotation;
          if (this.superUserDetails.fieldNames) {
            // custom field names checking
            this.fieldNameSale = this.superUserDetails.fieldNames.fieldNameSale;
            this.fieldNameContact =
            allData.superUserDetails.fieldNames.fieldNameContact;
            this.fieldNameOrganization = allData.superUserDetails.fieldNames
            .fieldNameOrganization
            ? allData.superUserDetails.fieldNames.fieldNameOrganization
            : 'Organization';
            this.fieldNameEstimate =
              this.superUserDetails.fieldNames.fieldNameEstimate;
            this.fieldNameQuotation =
              this.superUserDetails.fieldNames.fieldNameQuotation;
            this.fieldNameInvoice =
              this.superUserDetails.fieldNames.fieldNameInvoice;
              }
                //for storing all custom fields from db

          // superuserId assigning
          if (userData.superUserId) {
            this.superUserId = userData.superUserId;
          } else {
            //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
            this.superUserId = this.userId;
          }

          // check for account type and thus assigning datas
          if (userData.accountType == 'SuperUser') {
            this.id = this.userId; //userId is stored to a common variable

            //print template under user profile is fetching and binding to checkbox on templates
            this.prev = userData.printTemplate;

            // two way binding form
            this.documentData = userData;

            // check for logo under user profile and assign it o a boolean local variable
            // and then if its true; fetch data from firebase storage
            if (userData.logo) {
              this.logoExisting = true;
            }
            // check for Sign under user profile and assign it o a boolean local variable
            // and then if its true; fetch data from firebase storage
            if (userData.sign) {
              this.signExisting = true;
            }
            this.currentCustomField = allData.userDetails.customFieldsEstimate;
            this.currentCustomFieldInvoices = allData.userDetails.customFieldsInvoices;
            this.currentCustomFieldQuotation = allData.userDetails.customFieldsQuotation;
          } else {
            // for subusers we are fetching superuser data from DB, since updations are not reflecting
            this.id = this.superUserId;
            this.documentData = this.superUserDetails;
            this.prev = this.superUserDetails.printTemplate;

            if (this.superUserDetails.logo) {
              this.logoExisting = true;
            }
            if (this.superUserDetails.sign) {
              this.signExisting = true;
            }
            this.currentCustomField = allData.superUserDetails.customFieldsEstimate;
            this.currentCustomFieldInvoices = allData.superUserDetails.customFieldsInvoices;
            this.currentCustomFieldQuotation = allData.superUserDetails.customFieldsQuotation;
          }


          if (this.documentData) {
            if (this.prev === 'template1') {
              this.temp1Click = true;
              this.temp2Click = false;
              this.temp3Click = false;
              this.temp4Click = false;
              this.temp5Click = false;
              this.temp6Click = false;
              this.temp7Click = false;
              this.temp8Click = false;
              this.temp9Click = false;
              this.temp10Click = false;
            }
            if (this.prev === 'template2') {
              this.temp1Click = false;
              this.temp2Click = true;
              this.temp3Click = false;
              this.temp4Click = false;
              this.temp5Click = false;
              this.temp6Click = false;
              this.temp7Click = false;
              this.temp8Click = false;
              this.temp9Click = false;
              this.temp10Click = false;
            }
            if (this.prev === 'template3') {
              this.temp1Click = false;
              this.temp2Click = false;
              this.temp3Click = true;
              this.temp4Click = false;
              this.temp5Click = false;
              this.temp6Click = false;
              this.temp7Click = false;
              this.temp8Click = false;
              this.temp9Click = false;
              this.temp10Click = false;
            }
            if (this.prev === 'template4') {
              this.temp1Click = false;
              this.temp2Click = false;
              this.temp3Click = false;
              this.temp4Click = true;
              this.temp5Click = false;
              this.temp6Click = false;
              this.temp7Click = false;
              this.temp8Click = false;
              this.temp9Click = false;
              this.temp10Click = false;
            }
            if (this.prev === 'template5') {
              this.temp1Click = false;
              this.temp2Click = false;
              this.temp3Click = false;
              this.temp4Click = false;
              this.temp5Click = true;
              this.temp6Click = false;
              this.temp7Click = false;
              this.temp8Click = false;
              this.temp9Click = false;
              this.temp10Click = false;
            }
            if (this.prev === 'template6') {
              this.temp1Click = false;
              this.temp2Click = false;
              this.temp3Click = false;
              this.temp4Click = false;
              this.temp5Click = false;
              this.temp6Click = true;
              this.temp7Click = false;
              this.temp8Click = false;
              this.temp9Click = false;
              this.temp10Click = false;
            }
            if (this.prev === 'template7') {
              this.temp1Click = false;
              this.temp2Click = false;
              this.temp3Click = false;
              this.temp4Click = false;
              this.temp5Click = false;
              this.temp6Click = false;
              this.temp7Click = true;
              this.temp8Click = false;
              this.temp9Click = false;
              this.temp10Click = false;
            }
            if (this.prev === 'template8') {
              this.temp1Click = false;
              this.temp2Click = false;
              this.temp3Click = false;
              this.temp4Click = false;
              this.temp5Click = false;
              this.temp6Click = false;
              this.temp7Click = false;
              this.temp8Click = true;
              this.temp9Click = false;
              this.temp10Click = false;
            }
            if (this.prev === 'template9') {
              this.temp1Click = false;
              this.temp2Click = false;
              this.temp3Click = false;
              this.temp4Click = false;
              this.temp5Click = false;
              this.temp6Click = false;
              this.temp7Click = false;
              this.temp8Click = false;
              this.temp9Click = true;
              this.temp10Click = false;
            }
            if (this.prev === 'template10') {
              this.temp1Click = false;
              this.temp2Click = false;
              this.temp3Click = false;
              this.temp4Click = false;
              this.temp5Click = false;
              this.temp6Click = false;
              this.temp7Click = false;
              this.temp8Click = false;
              this.temp9Click = false;
              this.temp10Click = true;
            } else if (!this.prev) {
              this.temp1Click = true;
            }
            // check for logo under user profile and assign it o a boolean local variable
            // and then if its true; fetch data from firebase storage
            if (this.logoExisting) {
              const userStorageRef1 = firebase.default
                .storage()
                .ref()
                .child('logo/' + this.id);
              userStorageRef1.getDownloadURL().then((url1) => {
                this.userLogo = url1;
              });
            }

            // check for sign under user profile and assign it o a boolean local variable
            // and then if its true; fetch data from firebase storage
            if (this.signExisting) {
              const userStorageRef2 = firebase.default
                .storage()
                .ref()
                .child('sign/' + this.id);
              userStorageRef2.getDownloadURL().then((url2) => {
                this.userSign = url2;
              });
            }

            this.logoStatus = this.documentData?.logoStatus; //logo status under user profile
            this.signStatus = this.documentData?.signStatus; //sign status under user profile
            // fetching document number under user proifle and displaying next estimate number by adding +1

            if (this.documentData.estimateNoLast) {
              this.nextEstimateNumber = this.documentData.estimateNoLast + 1;
            } else {
              this.nextEstimateNumber = 1;
            }
            if (this.documentData.quoteNoLast) {
              this.nextQuotationNumber = this.documentData.quoteNoLast + 1;
            } else {
              this.nextQuotationNumber = 1;
            }
            if (this.documentData.invoiceNoLast) {
              this.nextInvoiceNumber = this.documentData.invoiceNoLast + 1;
            } else {
              this.nextInvoiceNumber = 1;
            }
            // doc color is fetching and assigning to local variable
            if (this.documentData.documentColor) {
              this.docColor = this.documentData.documentColor;
            }
            this.progressBarStatus = true;
          }
        }
      }
    );
  }

  ngOnInit() {}
       //clear defaultValue field on selection change
       clear() {
        this.defaultValue = '';
      }
      //triggered while closing mat accordian
      EditFieldClose() {
        this.editedField = false;
      }
    //triggered while clicking add field button
    // addField(doc) {
    //   if(doc == "estimate"){
    //     this.currentCustomField = this.currentCustomField;
    //   }
    //   else if(doc == "quotation"){
    //     this.currentCustomField = this.currentCustomFieldQuotation;

    //   }
    //   else if(doc == "invoice"){
    //     this.currentCustomField = this.currentCustomFieldInvoices;

    //   }
    //   else{}
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

  //     //triggered while in add field div submit button
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
  //     .updateCustomFields(this.superUserId, this.currentCustomField)
  //     .then(() => {
  //       this.snack.open('Custom field added successfully', '', {
  //         duration: 2000,
  //       });

  //     });
  // }
  // submitFieldInvoice() {
  //   //if no additional field previously added
  //   if (!this.currentCustomFieldInvoices) {
  //     this.currentCustomFieldInvoices = [];
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
  //   this.currentCustomFieldInvoices.push(this.customFields);
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
  //     .updateCustomFieldsInvoice(this.superUserId, this.currentCustomFieldInvoices)
  //     .then(() => {
  //       this.snack.open('Custom field added successfully', '', {
  //         duration: 2000,
  //       });

  //     });
  // }
  // submitFieldQuotation() {
  //   //if no additional field previously added
  //   if (!this.currentCustomFieldQuotation) {
  //     this.currentCustomFieldQuotation = [];
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
  //   this.currentCustomFieldQuotation.push(this.customFields);
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
  //     .updateCustomFieldsQuotation(this.superUserId, this.currentCustomFieldQuotation)
  //     .then(() => {
  //       this.snack.open('Custom field added successfully', '', {
  //         duration: 2000,
  //       });

  //     });
  // }
    //triggered while clicking submit in edit from accordian
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
    //   this.db.updateCustomFields(this.superUserId, this.currentCustomField);
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
    // submitEditFieldInvoice(index) {
    //   //if no additional field previously added
    //   if (!this.currentCustomFieldInvoices) {
    //     this.currentCustomFieldInvoices = [];
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
    //   this.currentCustomFieldInvoices[this.editIndex] = this.customFields;
    //   //storing this new updated custom field array to db
    //   this.db.updateCustomFieldsInvoice(this.superUserId, this.currentCustomFieldInvoices);
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
    // submitEditFieldQuotation(index) {
    //   //if no additional field previously added
    //   if (!this.currentCustomFieldQuotation) {
    //     this.currentCustomFieldQuotation = [];
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
    //   this.currentCustomFieldQuotation[this.editIndex] = this.customFields;
    //   //storing this new updated custom field array to db
    //   this.db.updateCustomFieldsQuotation(this.superUserId, this.currentCustomFieldQuotation);
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
  // editFieldInvoice(i) {
  //   this.editIndex = i;
  //   //for enabling expanded view in accordian
  //   this.editedField = true;
  //   //for binding data in fields
  //   this.editFname = this.currentCustomFieldInvoices[i].fieldName;
  //   this.editFieldType = this.currentCustomFieldInvoices[i].fieldType;
  //   this.editMandatory = this.currentCustomFieldInvoices[i].mandatory;
  //   if (this.editFieldType == 'date') {
  //     this.editDefaultValue = !!this.currentCustomFieldInvoices[i].defaultValue
  //       ? this.currentCustomFieldInvoices[i].defaultValue.toDate
  //         ? this.currentCustomFieldInvoices[i].defaultValue.toDate()
  //         : this.currentCustomFieldInvoices[i].defaultValue
  //       : null;
  //   } else this.editDefaultValue = this.currentCustomFieldInvoices[i].defaultValue;

  //   this.editCategoriesOpn = this.currentCustomFieldInvoices[i].categoriesOpn;
  // }
  // editFieldQuotation(i) {
  //   this.editIndex = i;
  //   //for enabling expanded view in accordian
  //   this.editedField = true;
  //   //for binding data in fields
  //   this.editFname = this.currentCustomFieldQuotation[i].fieldName;
  //   this.editFieldType = this.currentCustomFieldQuotation[i].fieldType;
  //   this.editMandatory = this.currentCustomFieldQuotation[i].mandatory;
  //   if (this.editFieldType == 'date') {
  //     this.editDefaultValue = !!this.currentCustomFieldQuotation[i].defaultValue
  //       ? this.currentCustomFieldQuotation[i].defaultValue.toDate
  //         ? this.currentCustomFieldQuotation[i].defaultValue.toDate()
  //         : this.currentCustomFieldQuotation[i].defaultValue
  //       : null;
  //   } else this.editDefaultValue = this.currentCustomFieldQuotation[i].defaultValue;

  //   this.editCategoriesOpn = this.currentCustomFieldQuotation[i].categoriesOpn;
  // }

  // //for deleting an additional field on clicking delete icon in additional fields
  // deleteField(i,doc) {
  //   let index = i;
  //   //opening pop up for delete confirmation
  //   this.dialog.open(StatusPopupComponent, {
  //     disableClose: true,
  //     data: {
  //       type: doc,
  //       uid: this.superUserId,
  //       statusArray: this.currentCustomField,
  //       currentIndex: index,
  //     },
  //   });
  // }
  //for deleting an additional field on clicking delete icon in additional fields
  // deleteField(i) {
  //   let index = i;
  //   //opening pop up for delete confirmation
  //   this.dialog.open(StatusPopupComponent, {
  //     disableClose: true,
  //     data: {
  //       type: "deleteFieldEstimate",
  //       uid: this.superUserId,
  //       statusArray: this.currentCustomField,
  //       currentIndex: index,
  //     },
  //   });
  // }
  // deleteFieldQoutation(i) {
  //   let index = i;
  //   //opening pop up for delete confirmation
  //   this.dialog.open(StatusPopupComponent, {
  //     disableClose: true,
  //     data: {
  //       type: "deleteFieldQuotation",
  //       uid: this.superUserId,
  //       statusArray: this.currentCustomFieldQuotation,
  //       currentIndex: index,
  //     },
  //   });
  // }
  // deleteFieldInvoice(i) {
  //   let index = i;
  //   //opening pop up for delete confirmation
  //   this.dialog.open(StatusPopupComponent, {
  //     disableClose: true,
  //     data: {
  //       type: "deleteFieldInvoice",
  //       uid: this.superUserId,
  //       statusArray: this.currentCustomFieldInvoices,
  //       currentIndex: index,
  //     },
  //   });
  // }

    //triggered while cliking close button in add div used for closing
    submitFieldClose() {
      this.addNewField = false;
    }
  ///ends here

  // default content form updating
  onUpdated(form) {
    if (!form.value.currency) {
      form.value.currency = 'INR';
    }
    if (!form.value.taxType) {
      form.value.taxType = 'gst';
    }
    if (!form.value.estimateNoInit) {
      form.value.estimateNoInit = 0;
    }
    if (!form.value.invoiceNoInit) {
      form.value.invoiceNoInit = 0;
    }
    if (!form.value.quoteNoInit) {
      form.value.quoteNoInit = 0;
    }
    this.notEditMode = !this.notEditMode;
    this.db.update('/users', this.id, form.value).then((res) => {
      this.snack.open('Settings updated!', '', {
        duration: 2000,
      });
    });
  }

  // status of logo and sign updating fns
  logoStatusUpdate() {
    this.db.logoStatus(this.id, this.logoStatus);
  }
  signStatusUpdate() {
    this.db.signStatus(this.id, this.signStatus);
  }

  // signature selecting and uploading fns
  openS() {
    let element: HTMLElement = document.getElementsByClassName(
      'sign-selector'
    )[0] as HTMLElement;
    element.click();
  }
  startUpload1(event: FileList) {
    const file = event.item(0);

    if (file?.type.split('/')[0] !== 'image') {
      return;
    }
    if (file?.size > this.imageSize) {
      this.snack.open('Image must be below 512kb', '', {
        duration: 2000,
      });

      return;
    }
    const signPath = `sign/${this.id}`;

    this.task = this.storage.upload(signPath, file);

    this.dbS = false;

    this.percentage2 = this.task.percentageChanges();
    if (this.percentage2) {
      this.signImage = null;
      this.signLoader = true;
      this.prvS = false;
    }

    const ref = this.storage.ref(signPath);

    this.task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL1 = ref.getDownloadURL();

          this.downloadURL1
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((url2) => {
              this.signImage = url2;
              this.signLoader = false;
              this.prvS = true;
              this.signStatusUpdate();
              this.db.updateImg2('users', this.id, signPath);
              this.snack.open('Signature uploaded successfully', '', {
                duration: 2000,
              });
            });
        })
      )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
    this.signExisting = true;
    this.signStatus = true;
  }

  // logo selecting and uplioading fns
  openL() {
    let element: HTMLElement = document.getElementsByClassName(
      'logo-selector'
    )[0] as HTMLElement;
    element.click();
  }
  startUpload2(event: FileList) {
    const file = event.item(0);
    if (file) {
      if (file.type.split('/')[0] !== 'image') {
        this.snack.open('Only image file accepted', '', {
          duration: 2000,
        });
        return;
      }
      if (file.size > this.imageSize) {
        this.snack.open('Image must be below 512kb', '', {
          duration: 2000,
        });

        return;
      }

      const logoPath = `logo/${this.id}`;
      const customMetadata = { app: 'mvp!' };
      this.task = this.storage.upload(logoPath, file, { customMetadata });

      this.percentage1 = this.task.percentageChanges();

      const ref = this.storage.ref(logoPath);
      if (this.percentage1) {
        this.logoLoader = true;
        this.dbL = false;
        this.prvL = false;
      }

      this.task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = ref.getDownloadURL();
            this.downloadURL
              .pipe(takeUntil(this.onDestroy$))
              .subscribe((url) => {
                this.image = url;
                this.logoLoader = false;
                this.prvL = true;
                this.logoStatusUpdate();
                this.db.updateImg1('users', this.id, logoPath)
                .then(res => {
                  this.leadCaptureService.getSharedLeadCaptureForms(this.id)
                  .pipe(takeUntil(this.onDestroy$))
                  .subscribe((data) => {
                    this.sharedDetails = data.map((e) => {
                      return {
                        id: e.payload.doc.id,
                        ...(e.payload.doc.data() as {}),
                      } as SharedLeadCaptureModel;
                    });
                    if (this.sharedDetails[0]) {
                      let leadCaptureId = this.sharedDetails[0].id;
                      this.db.updateLeadCaptureLogo(leadCaptureId, logoPath)
                    }
                  })
                })
                this.snack.open('Logo uploaded successfully', '', {
                  duration: 2000,
                });
              });
          })
        )
        .pipe(takeUntil(this.onDestroy$))
        .subscribe();
      this.logoExisting = true;
      this.logoStatus = true;
    }
  }

  // if template 1 is selected
  temp1() {
    const dialogRef = this.dialog.open(TemplatePrev5Component, {
      data: {
        id: '1',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.templatePreviewService.updatePreview(this.id, 'template1');
          localStorage.setItem('preview', 'template1');
          this.temp1Click = true;
          this.temp2Click = false;
          this.temp3Click = false;
          this.temp4Click = false;
          this.temp5Click = false;
          this.temp6Click = false;
          this.temp7Click = false;
          this.temp8Click = false;
          this.temp9Click = false;
          this.temp10Click = false;
          this.snack.open('Successfully Updated Template', '', {
            duration: 2000,
          });
        }
      });
  }
  // if template 2 is selected
  temp2() {
    const dialogRef = this.dialog.open(TemplatePrev5Component, {
      data: {
        id: '2',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.templatePreviewService.updatePreview(this.id, 'template2');
          localStorage.setItem('preview', 'template2');
          this.temp1Click = false;
          this.temp2Click = true;
          this.temp3Click = false;
          this.temp4Click = false;
          this.temp5Click = false;
          this.temp6Click = false;
          this.temp7Click = false;
          this.temp8Click = false;
          this.temp9Click = false;
          this.temp10Click = false;
          this.snack.open('Successfully Updated Template', '', {
            duration: 2000,
          });
        }
      });
  }
  // if template 3 is selected
  temp3() {
    const dialogRef = this.dialog.open(TemplatePrev5Component, {
      data: {
        id: '3',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.templatePreviewService.updatePreview(this.id, 'template3');
          localStorage.setItem('preview', 'template3');
          this.temp1Click = false;
          this.temp2Click = false;
          this.temp3Click = true;
          this.temp4Click = false;
          this.temp5Click = false;
          this.temp6Click = false;
          this.temp7Click = false;
          this.temp8Click = false;
          this.temp9Click = false;
          this.temp10Click = false;
          this.snack.open('Successfully Updated Template', '', {
            duration: 2000,
          });
        }
      });
  }
  // if template 4 is selected
  temp4() {
    const dialogRef = this.dialog.open(TemplatePrev5Component, {
      data: {
        id: '4',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.templatePreviewService.updatePreview(this.id, 'template4');
          localStorage.setItem('preview', 'template4');
          this.temp1Click = false;
          this.temp2Click = false;
          this.temp3Click = false;
          this.temp4Click = true;
          this.temp5Click = false;
          this.temp6Click = false;
          this.temp7Click = false;
          this.temp8Click = false;
          this.temp9Click = false;
          this.temp10Click = false;
          this.snack.open('Successfully Updated Template', '', {
            duration: 2000,
          });
        }
      });
  }
  // if template 5 is selected
  temp5() {
    const dialogRef = this.dialog.open(TemplatePrev5Component, {
      data: {
        id: '5',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.templatePreviewService.updatePreview(this.id, 'template5');
          localStorage.setItem('preview', 'template5');
          this.temp1Click = false;
          this.temp2Click = false;
          this.temp3Click = false;
          this.temp4Click = false;
          this.temp5Click = true;
          this.temp6Click = false;
          this.temp7Click = false;
          this.temp8Click = false;
          this.temp9Click = false;
          this.temp10Click = false;
          this.snack.open('Successfully Updated Template', '', {
            duration: 2000,
          });
        }
      });
  }

  // if template 6 is selected
  temp6() {
    const dialogRef = this.dialog.open(TemplatePrev5Component, {
      data: {
        id: '6',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.templatePreviewService.updatePreview(this.id, 'template6');
          localStorage.setItem('preview', 'template6');
          this.temp1Click = false;
          this.temp2Click = false;
          this.temp3Click = false;
          this.temp4Click = false;
          this.temp5Click = false;
          this.temp6Click = true;
          this.temp7Click = false;
          this.temp8Click = false;
          this.temp9Click = false;
          this.temp10Click = false;
          this.snack.open('Successfully Updated Template', '', {
            duration: 2000,
          });
        }
      });
  }
  // if template 7 is selected
  temp7() {
    const dialogRef = this.dialog.open(TemplatePrev5Component, {
      data: {
        id: '7',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.templatePreviewService.updatePreview(this.id, 'template7');
          localStorage.setItem('preview', 'template7');
          this.temp1Click = false;
          this.temp2Click = false;
          this.temp3Click = false;
          this.temp4Click = false;
          this.temp5Click = false;
          this.temp6Click = false;
          this.temp7Click = true;
          this.temp8Click = false;
          this.temp9Click = false;
          this.temp10Click = false;
          this.snack.open('Successfully Updated Template', '', {
            duration: 2000,
          });
        }
      });
  }
  // if template 8 is selected
  temp8() {
    const dialogRef = this.dialog.open(TemplatePrev5Component, {
      data: {
        id: '8',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.templatePreviewService.updatePreview(this.id, 'template8');
          localStorage.setItem('preview', 'template8');
          this.temp1Click = false;
          this.temp2Click = false;
          this.temp3Click = false;
          this.temp4Click = false;
          this.temp5Click = false;
          this.temp6Click = false;
          this.temp7Click = false;
          this.temp8Click = true;
          this.temp9Click = false;
          this.temp10Click = false;
          this.snack.open('Successfully Updated Template', '', {
            duration: 2000,
          });
        }
      });
  }
  // if template 9 is selected
  temp9() {
    const dialogRef = this.dialog.open(TemplatePrev5Component, {
      data: {
        id: '9',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.templatePreviewService.updatePreview(this.id, 'template9');
          localStorage.setItem('preview', 'template9');
          this.temp1Click = false;
          this.temp2Click = false;
          this.temp3Click = false;
          this.temp4Click = false;
          this.temp5Click = false;
          this.temp6Click = false;
          this.temp7Click = false;
          this.temp8Click = false;
          this.temp9Click = true;
          this.snack.open('Successfully Updated Template', '', {
            duration: 2000,
          });
        }
      });
  }
  // if template 10 is selected
  temp10() {
    const dialogRef = this.dialog.open(TemplatePrev5Component, {
      data: {
        id: '10',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.templatePreviewService.updatePreview(this.id, 'template10');
          localStorage.setItem('preview', 'template10');
          this.temp1Click = false;
          this.temp2Click = false;
          this.temp3Click = false;
          this.temp4Click = false;
          this.temp5Click = false;
          this.temp6Click = false;
          this.temp7Click = false;
          this.temp8Click = false;
          this.temp9Click = false;
          this.temp10Click = true;
          this.snack.open('Successfully Updated Template', '', {
            duration: 2000,
          });
        }
      });
  }

  //on edit and updating, disable data with this variable
  onTogglenotEditMode() {
    this.notEditMode = !this.notEditMode;
  }
  onBack() {
    this.locationback.back();
  }
  // on destroy
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    if (this.userDetailsSubscription) {
      this.userDetailsSubscription.unsubscribe();
    }
  }

  // clicking on a particular template
  mouseEnter1(div: string) {
    this.temp1();
  }
  mouseEnter2(div: string) {
    this.temp2();
  }
  mouseEnter3(div: string) {
    this.temp3();
  }
  mouseEnter4(div: string) {
    this.temp4();
  }
  mouseEnter5(div: string) {
    this.temp5();
  }
  mouseEnter6(div: string) {
    this.temp6();
  }
  mouseEnter7(div: string) {
    this.temp7();
  }
  mouseEnter8(div: string) {
    this.temp8();
  }
  mouseEnter9(div: string) {
    this.temp9();
  }
  mouseEnter10(div: string) {
    this.temp10();
  }
  mouseLeave(div: string) {
    this.dialogRef.close();
  }

  // update theme color fn
  updateThemeColor() {
    this.db.updateDocumentColor(this.id, this.docColor);
  }

  // actions while clicking on reset button on document numbering
  onDocumentNumberReset(value, prefix, currentNumber): void {
    if (!currentNumber) {
      currentNumber = 0;
    }
    const dialogRef = this.dialog.open(DocumentnumberingPopupComponent, {
      width: '400px',
      data: {
        docType: value,
        docPrefix: prefix,
        CurrentDocNumber: currentNumber,
        superUserId: this.id,
      },
    });
    const dialogSubmitSubscription = dialogRef.componentInstance.submitClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((docDataNumbering: DialogDataNumbering) => {
        if (docDataNumbering.docType == 'Estimate') {
          this.db
            .updateEstimateNumber(
              docDataNumbering.superUserId,
              docDataNumbering.docPrefix,
              docDataNumbering.CurrentDocNumber
            )
            .then((res) => {
              this.snack.open('Successfully Updated', '', {
                duration: 2000,
              });
            });
        }
        if (docDataNumbering.docType == 'Quotation') {
          this.db
            .updateQuotationNumber(
              docDataNumbering.superUserId,
              docDataNumbering.docPrefix,
              docDataNumbering.CurrentDocNumber
            )
            .then((res) => {
              this.snack.open('Successfully Updated', '', {
                duration: 2000,
              });
            });
        }
        if (docDataNumbering.docType == 'Invoice') {
          this.db
            .updateInvoiceNumber(
              docDataNumbering.superUserId,
              docDataNumbering.docPrefix,
              docDataNumbering.CurrentDocNumber
            )
            .then((res) => {
              this.snack.open('Successfully Updated', '', {
                duration: 2000,
              });
            });
        }
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {});
  }
  paymentLinkAuto(event,type){
    this.db.autoPayLinkEnable(this.id,type,event.checked)

  }
  saveRequiredFields() {
    this.db.saveRequiredFields(
      this.superUserId,
      this.estimateOrgTag,
      this.estimateContactTag,
      this.estimateSaleTag,
      this.quotationOrgTag,
      this.quotationContactTag,
      this.quotationSaleTag,
      this.invoiceOrgTag,
      this.invoiceContactTag,
      this.invoiceSaleTag
    ) .then((res) => {
      this.snack.open('Successfully Updated', '', {
        duration: 2000,
      });
    })
  }
  hsnCodeDisplaySettings() {
    // save hsn code display 
    this.db.hsnCodeDisplay(
      this.superUserId,
      this.hsnCodeDisplay,).then((res) => {
        this.snack.open('Successfully Updated', '', {
          duration: 2000,
        });
      })
  }
}
