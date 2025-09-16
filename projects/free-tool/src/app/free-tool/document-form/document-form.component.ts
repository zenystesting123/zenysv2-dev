/* -------------------------------------------------------------------
Description : First Time User can create Estimate , Quotation and invoice
              On save the document save the default user details and billed from details in user profile
              save Customer
              save sale
              Save the Document
-------------------------------------------------------------- */

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AdminProfile,
  customFieldNamesData,
  SearchTerm,
  SearchTermSale,
  SubUserProfile,
  SuperUserProfile,
} from '../data.model';
import { DocumentFormService } from './document-form.service';
import { FormArray, FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NetworkCheckService } from '../../networkcheck.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Observable, Subject } from 'rxjs';
import * as firebase from 'firebase';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { finalize, takeUntil } from 'rxjs/operators';
import { Currencies, Currency } from 'src/app/currencies';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from 'src/app/search/search.service';
import { Meta, Title } from '@angular/platform-browser';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { ZenysmainaccountService } from '../zenysmainaccount.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DocSettingsBottomSheetComponent } from '../doc-settings-bottom-sheet/doc-settings-bottom-sheet.component';
import { CustomerData, ItemsList, userData } from 'src/app/document-management-new/estimate-management/estimate.model';
import { DocumentData } from 'src/app/document-management-new/invoice-management/invoice.model';
import { defaultProfileFields } from 'src/app/data-models';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss'],
})
export class DocumentFormComponent implements OnInit, OnDestroy {
  date = new Date().getTime(); // current date
  userId: string; // for storing current userid
  saleStatus: string[] = [
    // default sale status
    'Inquiry',
    'Opportunity',
    'Confirmed',
    'Sale-Completed',
    'Lost/Dropped',
  ];
  profile = {
    code: '',
    country: '',
    companyName: '',
    contactNo: '',
    firstname: '',
    secondName: '',
    isCompany: true,
  };
  customerStatus: string[] = [
    // default customer status
    'Lead',
    'Prospect',
    'Opportunity',
    'Customer-Won',
    'Lost/Rejected',
  ];
  freeDateEnd = new Date(); // validity of plan
  custLeadOpn: string = 'Online,Offline'; // default lead option
  custLead: string[] = ['Online', 'Offline']; // default lead
  superUserProfileData: SuperUserProfile; // super user profile data
  AdminProfileData: AdminProfile; // admin profile data
  SubUserProfileData: SubUserProfile; // sub user profile data
  panelOpenState1 = true; // billing address and document details panel
  panelOpenState2 = false; // item details panel
  panelOpenState3 = false; // additional details panel
  userData: userData = {
    signatoryName: null,
    designation: null,
    state: null,
    addressline1: null,
    addressline2: null,
    gst: null,
    companyName: null,
    pinCode: null,
    country: null,
    contactname: null,
    contactno: null,
    email: null,
    // secondName: null,
    city: null,
  }; //userData interface
  customerData: CustomerData = {
    custID: null,
    pinCode: null,
    district: null,
    state: null,
    country: null,
    gst: null,
    fname1: null,
    sname: null,
    surname: null,
    companyName: null,
    addressline1: null,
    addressline2: null,
    countryCode: null,
    contactNumber: null,
    email: null,
    deliveryPinCode: null,
    deliveryDistrict: null,
    deliveryState: null,
    deliveryCountry: null,
    deliveryContactName: null,
    deliveryAddressline1: null,
    deliveryAddressline2: null,
    deliveryContactNumber: null,
    isDeliveryAddressPresent: false,
    contactAssignedToOwner: '',
    orgID: '',
    deliverycountryCode: '',
    deliveryCompanyName: '',
    deliveryEmail: ''
  }; //Customer data interface
  docData: DocumentData = {
    saleID: null,
    saleTitle: null,
    docValidity: null,
    docDate: null,
    dueDate: null,
    sgstValue: 0,
    cgstValue: 0,
    igstValue: 0,
    cessValue: 0,
    vatValue: 0,
    discountValue: 0,
    discountedAmount: 0,
    total: 0,
    docNumber: null,
    quoteRef: null,
    estRef: null,
    totalInclTax: 0,
    poRef: null,
    paymentTerm: null,
    docType: '',
    bankDetails: null,
    notes: null,
    currency: 'INR',
    includeTax: true,
    includeCess: null,
    includeUnit: true,
    includeDiscount: false,
    interState: null,
    docTitle: '',
    createdDate: null,
    taxType: 'gst',
    docPrefix: null,
    prefixAndDocNumber: null,
    cancel: false,
    saleAssignedToOwner: null,
    statusApproved: true,
    gstStateCode: null,
    gstPlaceOfSupplyCode: null,
  }; //DocData interface
  lineItem: ItemsList = {
    slno: 0,
    amount: null,
    amountInclTax: null,
    item: null,
    qty: null,
    unit: null,
    rate: null,
    cgstRate: 0,
    igstRate: 0,
    sgstRate: 0,
    cessRate: 0,
    vatRate: 0,
    discountRate: 0,
    vatAmount: null,
    cgstAmount: null,
    igstAmount: null,
    sgstAmount: null,
    cessAmount: null,
    discountAmount: null,
    discountedAmount: null,
    description: null,
    hsnCode: null
  }; //initializing the LineItemData interface
  itemList = [this.lineItem];
  submitted: boolean = false; // for Checking if the required fields are filled before submitting
  isMobilesize: boolean; // mobile size check
  noItem: number = 0; // number of line item
  lineItemForm: FormGroup; // form group for line item
  @ViewChild('form') public userFrm: NgForm;
  networkConnection: boolean; // for checking netwrok connrction
  imageSize: number = 512000; // uploading image max size
  private onDestroy$: Subject<void> = new Subject<void>(); //Subject that emits when the component has been destroyed.
  currencyList: Currency[] = []; // list of currency
  logoUpload: AngularFireUploadTask; //for uploading logo
  signUpload: AngularFireUploadTask; //for uploading signature
  categoryList: string[] = []; //get category list
  saleInvoicedVal: number = 0; // invoiced amount for sale updation
  custInvoicedVal: number = 0; // invoiced amount for customer updation
  fileLogo: File; // for logo upload
  fileSignature: File; // for ign upload
  logo: string = null; // stores logo path in user profile
  logoStatus: boolean = false; // status of logo
  sign: string = null; // stores sign path in user profile
  signStatus: boolean = false; // status of sign
  email: string; // amil id of user
  logoPreview: File; // showing preview of logo
  signPreview: File; // showing preview of sign
  isLoaded: boolean = false; // checks for spinner
  userName: string; // user name
  expenseCategoryList: string[]; // expense category list
  isMessageOpen: boolean = true; //for closing signup card
  timeZone = '';// for saving time zone in user details
  tzOffset = new Date().getTimezoneOffset();// for saving time zone offest in user details
  constructor(
    private afAuth: AngularFireAuth,
    public documentFormService: DocumentFormService,
    private analytics: AngularFireAnalytics,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    private storage: AngularFireStorage,
    private snack: MatSnackBar,
    public networkCheck: NetworkCheckService,
    private _bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private titleService: Title,
    private meta: Meta,
    private breakpointObserver: BreakpointObserver,
    private mainaccountserv: ZenysmainaccountService,
    private commonService:CommonService
  ) {
    breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .subscribe((result) => {
        if (result.matches) {
          this.isMobilesize = true;
        } else {
          this.isMobilesize = false;
        }
      });
    // check the route and set the doc type
    route.params.subscribe((val) => {
      let route = this.route.snapshot.paramMap.get('docType');
      if (route == 'free-invoice-generator') {
        this.docData.docType = 'Invoice';
        this.docData.docTitle = 'Invoice';
      } else if (route == 'free-quotation-generator') {
        this.docData.docType = 'Quotation';
        this.docData.docTitle = 'Quotation';
      } else if (route == 'free-estimate-generator') {
        this.docData.docType = 'Estimate';
        this.docData.docTitle = 'Estimate';
      }
    });
    // adding meta tag for invoice , quotation and estimate
    if (this.docData.docType == 'Invoice') {
      this.titleService.setTitle('Free Invoice Generator - Zenys');
      this.meta.updateTag({
        name: 'description',
        content:
          'Zenys Free Invoice Generator lets you create invoices with your business logo. Fill in the fields and download the PDF Invoices with our Free Invoice Maker.',
      });
      this.meta.updateTag({
        name: 'og:title',
        content:
          'Free Invoice Generator, Free Online Invoice Maker, Zenys Invoice Creator',
      });
      this.meta.updateTag({
        name: 'og:description',
        content:
          'Zenys Free Invoice Generator lets you create invoices with your business logo. Fill in the fields and download the PDF Invoices with our Free Invoice Maker.',
      });
      this.meta.updateTag({
        name: 'og:url',
        content: 'https://app.zenys.org/free-tool/create/Invoice',
      });
      this.meta.updateTag({ name: 'og:type', content: 'website' });
    }
    if (this.docData.docType == 'Estimate') {
      this.titleService.setTitle('Free Estimate Maker | Zenys');
      // update meta tags
      this.meta.updateTag({
        name: 'description',
        content:
          'Zenys Free Estimate Generator lets you create estimates with your business logo. Fill in the fields and download the PDF Estimates with our Free Estimate Maker.',
      });
      this.meta.updateTag({
        name: 'og:title',
        content: 'Estimate Maker, Estimate Generator,Estimate Template',
      });
      this.meta.updateTag({
        name: 'og:description',
        content:
          'Zenys Free Estimate Generator lets you create estimates with your business logo. Fill in the fields and download the PDF Estimates with our Free Estimate Maker.',
      });
      this.meta.updateTag({
        name: 'og:url',
        content: 'https://app.zenys.org/free-tool/create/Estimate',
      });
      this.meta.updateTag({ name: 'og:type', content: 'website' });
    }
    if (this.docData.docType == 'Quotation') {
      this.titleService.setTitle('Free Online Quotation Generator | Zenys');
      // update meta tags
      this.meta.updateTag({
        name: 'description',
        content:
          'Zenys Free Quotation Generator lets you create quotations with your business logo. Fill in the fields and download the PDF Quotations with our Quotation Maker.',
      });
      this.meta.updateTag({
        name: 'og:title',
        content: 'Online Quotation Generator, Quote Template',
      });
      this.meta.updateTag({
        name: 'og:description',
        content:
          'Zenys Free Quotation Generator lets you create quotations with your business logo. Fill in the fields and download the PDF Quotations with our Quotation Maker.',
      });
      this.meta.updateTag({
        name: 'og:url',
        content: 'https://app.zenys.org/free-tool/create/Quotation',
      });
      this.meta.updateTag({ name: 'og:type', content: 'website' });
    }

    this.currencyList = Currencies.getCurencies(); //get currency list
    this.categoryList = this.searchService.getCategory(); //get category list
    this.expenseCategoryList = this.documentFormService.getCategory(); // Get the list of expense categories from data modal file
    this.lineItemForm = new FormGroup({
      // initialize line item form
      itemList: new FormArray([]),
    });
    // push the line item in form group
    this.itemList.forEach((lineItem) =>
      (<FormArray>this.lineItemForm.get('itemList')).push(
        this.createItemFormGroup(lineItem)
      )
    );
  }

  ngOnInit(): void {
    //authSubscription subscription
    this.afAuth.authState.pipe(takeUntil(this.onDestroy$)).subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.email = user.email;
        this.userName = user.displayName;
        //user details subscription
        this.documentFormService
          .getUserDetailsFromDb(user.uid)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((details) => {
            if (!details) {
              // if user details not exist add he details from the form
              this.isLoaded = true; //display the loader
              const logoPath = `logo/${this.userId}`; //logo path
              const signPath = `sign/${this.userId}`; // sig path
              const customMetadata = { app: 'mvp!' };
              if (this.fileLogo) {
                // if logo added
                this.logoUpload = this.storage.upload(logoPath, this.fileLogo, {
                  customMetadata,
                });
              }
              if (this.fileSignature) {
                //if sign added
                this.signUpload = this.storage.upload(
                  signPath,
                  this.fileSignature
                );
              }

              const refLogo = this.storage.ref(logoPath);
              const refSign = this.storage.ref(signPath);
              let downloadURL: Observable<string> = null;
              let downloadURLSign: Observable<string> = null;
              // if log and signature added subscribe both logo and sign response for storing logo and sign in document
              if (this.logoUpload && this.signUpload) {
                this.logoUpload
                  .snapshotChanges()
                  .pipe(
                    finalize(() => {
                      downloadURL = refLogo.getDownloadURL();
                      downloadURL
                        .pipe(takeUntil(this.onDestroy$))
                        .subscribe((url) => {
                          const userStorageRef1 = firebase.default
                            .storage()
                            .ref()
                            .child('logo/' + this.userId);
                          userStorageRef1.getDownloadURL().then((url1) => {
                            if (url) {
                              this.logo = logoPath;
                              this.logoStatus = true;
                            }

                            this.signUpload
                              .snapshotChanges()
                              .pipe(
                                finalize(() => {
                                  downloadURLSign = refSign.getDownloadURL();

                                  downloadURLSign
                                    .pipe(takeUntil(this.onDestroy$))
                                    .subscribe((url3) => {
                                      const userStorageRef2 = firebase.default
                                        .storage()
                                        .ref()
                                        .child('sign/' + this.userId);
                                      userStorageRef2
                                        .getDownloadURL()
                                        .then((url2) => {
                                          if (url2) {
                                            this.sign = signPath;
                                            this.signStatus = true;
                                          }
                                          //store the userdetails
                                          this.onStoreDatas();
                                        });
                                    });
                                })
                              )
                              .pipe(takeUntil(this.onDestroy$))
                              .subscribe();
                          });
                        });
                    })
                  )
                  .pipe(takeUntil(this.onDestroy$))
                  .subscribe();
              } else if (!this.logoUpload && !this.signUpload) {
                //if both logo and sign is not added  then store the user details
                this.onStoreDatas();
              } else if (this.logoUpload && !this.signUpload) {
                // if logo added and not  sign then  subscribe the logo response for storing logo in document
                this.logoUpload
                  .snapshotChanges()
                  .pipe(
                    finalize(() => {
                      downloadURL = refLogo.getDownloadURL();
                      downloadURL
                        .pipe(takeUntil(this.onDestroy$))
                        .subscribe((url) => {
                          const userStorageRef1 = firebase.default
                            .storage()
                            .ref()
                            .child('logo/' + this.userId);
                          userStorageRef1.getDownloadURL().then((url1) => {
                            if (url) {
                              this.logo = logoPath;
                              this.logoStatus = true;
                            }
                            // store the user details
                            this.onStoreDatas();
                          });
                        });
                    })
                  )
                  .pipe(takeUntil(this.onDestroy$))
                  .subscribe();
              } else if (!this.logoUpload && this.signUpload) {
                //if only sign added  then subscribe the sign response for storing sign in document
                this.signUpload
                  .snapshotChanges()
                  .pipe(
                    finalize(() => {
                      downloadURLSign = refSign.getDownloadURL();

                      downloadURLSign
                        .pipe(takeUntil(this.onDestroy$))
                        .subscribe((url3) => {
                          const userStorageRef2 = firebase.default
                            .storage()
                            .ref()
                            .child('sign/' + this.userId);
                          userStorageRef2.getDownloadURL().then((url2) => {
                            if (url2) {
                              this.sign = signPath;
                              this.signStatus = true;
                            }
                            //store user details
                            this.onStoreDatas();
                          });
                        });
                    })
                  )
                  .pipe(takeUntil(this.onDestroy$))
                  .subscribe();
              }
            } else {
              // if user details exist navigate to home here user details is not store and documents will not store
              this.router.navigate(['dash/home']);
              this._snackBar.open('Please create document from here', 'ok', {
                duration: 2000,
              });
            }
          });
      } else {
      }
    });
  }
  // storing user details
  onStoreDatas() {
    let userData = defaultProfileFields.CONTENT
    //send google analytics event when the profile is created
    this.analytics.logEvent('btn_signup_freeTool');
    let fieldNames = customFieldNamesData.data;
    let category = this.categoryList[0];

    let company;
    if (this.userData.companyName != null) {
      company = this.userData.companyName;
    } else {
      company = '';
    }
    let countryCode = '+91';

    let invoiceNumberPrefix = '';
    let estimateNumberPrefix = '';
    let quotationNumberPrefix = '';
    let estimateNoLast = 0;
    let quoteNoLast = 0;
    let invoiceNoLast = 0;
    if (this.docData.docType == 'Estimate') {
      userData.estimateNoInit = Number(this.docData.docNumber);
      estimateNoLast = Number(this.docData.docNumber);
      userData.estimateNote = this.docData.notes;
    } else if (this.docData.docType == 'Quotation') {
      userData.quoteNoInit = Number(this.docData.docNumber);
      quoteNoLast = Number(this.docData.docNumber);
      userData.quotationNote = this.docData.notes;
    } else if (this.docData.docType == 'Invoice') {
      userData.invoiceNoInit = Number(this.docData.docNumber);
      invoiceNoLast = Number(this.docData.docNumber);
      userData.invoiceNote = this.docData.notes;
    }
    if (this.docData.docType == 'Estimate') {
      estimateNumberPrefix = this.docData.docPrefix;
    } else if (this.docData.docType == 'Quotation') {
      quotationNumberPrefix = this.docData.docPrefix;
    } else if (this.docData.docType == 'Invoice') {
      invoiceNumberPrefix = this.docData.docPrefix;
    }
    // let lastname;
    // if (this.userData.secondName) {
    //   lastname = this.userData.secondName;
    // } else {
    //   lastname = '';
    // }

    let phone = this.userData.contactno;
    userData.currency = this.docData.currency;
    userData.taxType = this.docData.taxType;
    userData.bankDetails = this.docData.bankDetails;
    let country = this.userData.country;
    userData.gstnumber = this.userData.gst;
    let pincode = this.userData.pinCode;
    let state = this.userData.state;
    let street1 = this.userData.addressline1;
    let street2 = this.userData.addressline2;
    let city = this.userData.city;
    let profileIdData;
    let publicProfileID;
    if (company) {
      profileIdData = company.replace(/[^a-zA-Z ]/g, '');
    } else {
      profileIdData = this.userName.replace(/[^a-zA-Z ]/g, '');
    }
    let random = Math.floor(Math.random() * 100000 + 1);
    publicProfileID = profileIdData + random;
    //angular fns for reading user timezone
    if (
      typeof Intl === 'object' &&
      typeof Intl.DateTimeFormat === 'function'
    ) {
      this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const ct = require('countries-and-timezones');
      this.tzOffset = ct.getTimezone(this.timeZone);
    }
    //create the user profile
    this.documentFormService
      .createDefaultProfile(
        this.userId,
        this.email,
        this.expenseCategoryList,
        this.logoStatus,
        this.signStatus,
        this.userName,
        category,
        company,
        countryCode,
        estimateNoLast,
        quoteNoLast,
        invoiceNoLast,
        phone,
        country,
        pincode,
        state,
        street1,
        street2,
        this.logo,
        this.sign,
        city,
        fieldNames,
        invoiceNumberPrefix,
        estimateNumberPrefix,
        quotationNumberPrefix,
        publicProfileID,
        this.timeZone,
        this.tzOffset,
        userData
      )
      .then((result) => {

        //console.log(data)
        //Once a new user is created, automatically create a contact in Zenys account
        this.mainaccountserv.createCustomerFromFreeTool(this.userId, this.email,
          countryCode, this.userData.companyName, phone, this.userName,  street1, street2,
          pincode, country, state, userData.gstnumber


        ).then(() => {
          this.mainaccountserv.updateContactSequenceNumber()

          console.log("saved to zenys")
        })
        //.report
        this.commonService.addSampleReport(this.userId);
        // dashboard report
        this.commonService.addSampleDashBoardReport(this.userId);
        // addDefaultPipeline after this only add sample contact/sale and service should be called
        this.commonService.addDefaultPipeline(
          this.userId
        );
        // 1.contact
        this.commonService.addSampleContact(this.userName, this.userId);
        // 2.sale
        this.commonService.addSampleSale(this.userName, this.userId);
        // 3.service
        this.commonService.addSampleService(this.userName, this.userId);
        // 4.task
        this.commonService.addSampleTask(this.userName, this.userId);
        // 5.followup
        this.commonService.addSampleCall(this.userName, this.userId);
        // 6.organisation
        this.commonService.addSampleOrg(this.userName, this.userId);
        // 7.email templates
        this.commonService.addEmailTemp1(this.userId);
        this.commonService.addEmailTemp2(this.userId);
        this.commonService.addEmailTemp3(this.userId);
        this.commonService.addEmailTemp4(this.userId);
        this.commonService.addEmailTemp5(this.userId);
        // 8.add automations
        this.commonService.addAutom1(this.userId)
        this.commonService.addAutom2(this.userId)
        this.commonService.addAutom3(this.userId)
        this.commonService.addAutom4(this.userId)
        this.commonService.addAutom5(this.userId)
        this.commonService.addAutom6(this.userId)
        this.commonService.addAutom7(this.userId)
        this.saveDoc();
      })

    /*.catch((err) => {
      this._snackBar.open('An error occured', 'ok', {
        duration: 2000,
      });
      this.isLoaded = false;
    });*/
    // aftrer saving the profile save the user profiles
    this.superUserProfileData = SuperUserProfile.data;
    this.AdminProfileData = AdminProfile.data2;
    this.SubUserProfileData = SubUserProfile.data3;
    this.documentFormService.createProfileData(
      this.superUserProfileData,
      this.userId
    );

    // adding Admin profile to DB
    this.documentFormService.createProfileData(
      this.AdminProfileData,
      this.userId
    );

    // adding SubUser profile to DB
    this.documentFormService.createProfileData(
      this.SubUserProfileData,
      this.userId
    );
  }

  createItemFormGroup(lineItem) {
    return new FormGroup({
      item: new FormControl(lineItem.item),
      qty: new FormControl(lineItem.qty),
      unit: new FormControl(lineItem.unit),
      rate: new FormControl(lineItem.rate),
      sgstRate: new FormControl(lineItem.sgstRate),
      cgstRate: new FormControl(lineItem.cgstRate),
      description: new FormControl(lineItem.description),
      igstRate: new FormControl(lineItem.igstRate),
      cessRate: new FormControl(lineItem.cessRate),
      vatRate: new FormControl(lineItem.vatRate),
      discountRate: new FormControl(lineItem.discountRate),
      amount: new FormControl(lineItem.amount),
    });
  }

  //adding a row of lineitem
  addFieldValue() {
    this.noItem += 1;
    var emptyPayOff = {
      slno: this.noItem,
      amountInclTax: null,
      amount: null,
      item: null,
      qty: null,
      unit: null,
      rate: null,
      cgstRate: 0,
      igstRate: 0,
      sgstRate: 0,
      cessRate: 0,
      vatRate: 0,
      discountRate: 0,
      vatAmount: null,
      cgstAmount: null,
      igstAmount: null,
      sgstAmount: null,
      cessAmount: null,
      discountAmount: null,
      discountedAmount: null,
      description: null,
      hsnCode:null
    };
    this.itemList.push(emptyPayOff);
    (<FormArray>this.lineItemForm.get('itemList')).push(
      this.createItemFormGroup(emptyPayOff)
    );
  }

  //deleting a row of line item
  deleteFieldValue(index: number) {
    this.noItem -= 1;
    this.itemList.splice(index, 1);
    (<FormArray>this.lineItemForm.get('itemList')).removeAt(index);
    this.updateDocheaderAmounts();
  }

  //calculating the row amount
  getAmount(i) {
    let rate = this.itemList[i].rate;
    let dicountPercentage = this.itemList[i].discountRate;
    let discountedAmount = rate;
    if (dicountPercentage > 0 && this.docData.includeDiscount) {
      discountedAmount = rate * (1 - dicountPercentage / 100);
      let discound = rate - discountedAmount;
      this.itemList[i].discountAmount = discound * this.itemList[i].qty;
    } else {
      this.itemList[i].discountAmount = 0;
      this.itemList[i].discountRate = 0;
    }
    let discountedTotalAmount = this.itemList[i].qty * discountedAmount;

    let amount = this.itemList[i].qty * rate;

    let amtInclTax = 0;
    let sgst = 0;
    let cgst = 0;
    let igst = 0;
    let cess = 0;
    let vat = 0;

    if (this.docData.includeTax == true) {
      if (this.docData.taxType == 'gst') {
        if (this.docData.interState) {
          igst = discountedTotalAmount * (this.itemList[i].igstRate / 100);
          this.itemList[i].cgstRate = 0;
          this.itemList[i].sgstRate = 0;
        } else {
          cgst = discountedTotalAmount * (this.itemList[i].cgstRate / 100);
          sgst = discountedTotalAmount * (this.itemList[i].sgstRate / 100);
          this.itemList[i].igstRate = 0;
        }
        if (this.docData.includeCess) {
          cess = discountedTotalAmount * (this.itemList[i].cessRate / 100);
        } else {
          this.itemList[i].cessRate = 0;
        }
      } else {
        this.itemList[i].cessRate = 0;
        this.itemList[i].cgstRate = 0;
        this.itemList[i].sgstRate = 0;
        this.itemList[i].igstRate = 0;
      }

      if (this.docData.taxType == 'vat') {
        vat = discountedTotalAmount * (this.itemList[i].vatRate / 100);
      } else {
        this.itemList[i].vatRate = 0;
      }
    } else {
      this.itemList[i].cessRate = 0;
      this.itemList[i].cgstRate = 0;
      this.itemList[i].sgstRate = 0;
      this.itemList[i].igstRate = 0;
      this.itemList[i].vatRate = 0;
      this.docData.interState = false;
      this.docData.includeCess = false;
    }
    amtInclTax = discountedTotalAmount + cess + cgst + sgst + igst + vat;
    this.itemList[i].amountInclTax = amtInclTax;
    this.itemList[i].amount = amount;
    this.itemList[i].cessAmount = cess;
    this.itemList[i].cgstAmount = cgst;
    this.itemList[i].sgstAmount = sgst;
    this.itemList[i].igstAmount = igst;
    this.itemList[i].vatAmount = vat;
    this.itemList[i].discountedAmount = discountedTotalAmount;

    this.updateDocheaderAmounts();

    this.itemList[i].amountInclTax =
      Math.round((this.itemList[i].amountInclTax + Number.EPSILON) * 100) / 100;
    return this.itemList[i].amountInclTax;
  }

  //calculating the total amounts
  updateDocheaderAmounts() {
    (this.docData.sgstValue = 0),
      (this.docData.cgstValue = 0),
      (this.docData.igstValue = 0),
      (this.docData.cessValue = 0),
      (this.docData.vatValue = 0),
      (this.docData.discountValue = 0),
      (this.docData.discountedAmount = 0),
      (this.docData.total = 0),
      (this.docData.totalInclTax = 0),
      this.itemList.forEach((element) => {
        this.docData.sgstValue += element.sgstAmount;
        this.docData.cgstValue += element.cgstAmount;
        this.docData.igstValue += element.igstAmount;
        this.docData.cessValue += element.cessAmount;
        this.docData.vatValue += element.vatAmount;
        this.docData.discountValue += element.discountAmount;
        this.docData.discountedAmount += element.discountedAmount;
        this.docData.total += element.amount;
        this.docData.totalInclTax +=
          element.discountedAmount +
          element.sgstAmount +
          element.cgstAmount +
          element.igstAmount +
          element.cessAmount +
          element.vatAmount;
        this.docData.sgstValue =
          Math.round((this.docData.sgstValue + Number.EPSILON) * 100) / 100;
        this.docData.cgstValue =
          Math.round((this.docData.cgstValue + Number.EPSILON) * 100) / 100;
        this.docData.igstValue =
          Math.round((this.docData.igstValue + Number.EPSILON) * 100) / 100;
        this.docData.cessValue =
          Math.round((this.docData.cessValue + Number.EPSILON) * 100) / 100;
        this.docData.vatValue =
          Math.round((this.docData.vatValue + Number.EPSILON) * 100) / 100;
        this.docData.discountValue =
          Math.round((this.docData.discountValue + Number.EPSILON) * 100) / 100;

        this.docData.discountedAmount =
          Math.round((this.docData.discountedAmount + Number.EPSILON) * 100) /
          100;

        this.docData.total =
          Math.round((this.docData.total + Number.EPSILON) * 100) / 100;
        this.docData.totalInclTax =
          Math.round((this.docData.totalInclTax + Number.EPSILON) * 100) / 100;
      });
  }

  // toasting the error
  TypeError() {
    this.submitted = true;
    this._snackBar.open('Please Fill All The Mandatory Fields', 'Done', {
      duration: 2000,
    });
  }

  onVat() {
    this.docData.includeCess = false;
    this.docData.interState = false;
  }
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  onBottomSheet(docData) {
    this._bottomSheet.open(DocSettingsBottomSheetComponent, {
      data: {
        docData: docData,
      },
    });
  }

  saveDoc() {
    this.customerData.fname1 = this.customerData.companyName;
    this.userData.contactname = this.userName;
    this.docData.prefixAndDocNumber = this.docData.docNumber;
    //adding search term array
    let searchTermDoc: SearchTerm;
      searchTermDoc = {
        firstName: this.customerData.fname1.toLowerCase(),
        secondName: '',
        companyName: '',
        surname: ''
      };
    if (this.docData.docPrefix) {
      this.docData.prefixAndDocNumber =
        this.docData.docPrefix + this.docData.docNumber;
    } else {
      this.docData.prefixAndDocNumber = this.docData.docNumber;
    }

    // create estimate
    if (this.docData.docType == 'Estimate') {
      this.documentFormService
        .createDocument(
          this.userData,
          this.customerData,
          this.docData,
          this.itemList,
          this.docData.docType,
          this.userId,
          this.userId,
          searchTermDoc
        )
        .then((result) => {
          this.documentFormService
            .createSharedDoc(this.userId, result.id, this.docData.docType)
            .then((res) => {
              this.documentFormService
                .UpdateshareDocumentId(
                  this.userId,
                  result.id,
                  this.docData.docType,
                  res.id
                ).then((res) => {
                  if (this.isMobilesize) {
                    this.analytics.logEvent('btn_create_est_mob');
                  }
                  else {
                    this.analytics.logEvent('btn_create_est_web');
                  }

                  this.isLoaded = true;
                  this._snackBar.open(
                    'Successfully Created',
                    this.docData.docType,
                    {
                      duration: 2000,
                    }
                  );
                  this.router.navigate([
                    '/dash/document/Estimate',
                    result.id,
                  ]);
                })
            })

        })
        .catch((error) => {
          this._snackBar.open('An error occured', 'ok', {
            duration: 2000,
          });
          this.isLoaded = false;
        });
    } else if (this.docData.docType == 'Quotation') {
      // craete quotation
      this.docData.createdDate = new Date().getTime();
      this.documentFormService
        .createDocument(
          this.userData,
          this.customerData,
          this.docData,
          this.itemList,
          this.docData.docType,

          this.userId,
          this.userId,
          searchTermDoc
        )
        .then((result) => {
          this.documentFormService
            .createSharedDoc(this.userId, result.id, this.docData.docType)
            .then((res) => {
              this.documentFormService
                .UpdateshareDocumentId(
                  this.userId,
                  result.id,
                  this.docData.docType,
                  res.id
                ).then((res) => {
                  if (this.isMobilesize) {
                    this.analytics.logEvent('btn_create_quote_mob');
                  }
                  else {
                    this.analytics.logEvent('btn_create_quote_web');
                  }
                  this.isLoaded = true;
                  this._snackBar.open(
                    'Successfully Created',
                    this.docData.docType,
                    {
                      duration: 2000,
                    }
                  );
                  this.router.navigate([
                    '/dash/document/Quotation',
                    result.id,
                  ]);
                })
            })

        })
        .catch((error) => {
          this._snackBar.open('An error occured', 'ok', {
            duration: 2000,
          });
          this.isLoaded = false;
        });
    } else if (this.docData.docType == 'Invoice') {
      // create invoice
      this.docData.createdDate = new Date().getTime();

      this.documentFormService
        .createDocument(
          this.userData,
          this.customerData,
          this.docData,
          this.itemList,
          this.docData.docType,

          this.userId,
          this.userId,
          searchTermDoc
        )
        .then((result) => {
          this.documentFormService
            .createSharedDoc(this.userId, result.id, this.docData.docType)
            .then((res) => {
              this.documentFormService
                .UpdateshareDocumentId(
                  this.userId,
                  result.id,
                  this.docData.docType,
                  res.id
                ).then((res) => {
                  if (this.isMobilesize) {
                    this.analytics.logEvent('btn_create_inv_mob');
                  }
                  else {
                    this.analytics.logEvent('btn_create_inv_web');
                  }
                  this.saleInvoicedVal = this.docData.totalInclTax;

                  // add invoiced amount to customer
                  this.custInvoicedVal = this.docData.totalInclTax;

                  this.isLoaded = true; // stop spinner
                  this._snackBar.open(
                    'Successfully Created',
                    this.docData.docType,
                    {
                      duration: 2000,
                    }
                  );
                  this.router.navigate([
                    '/dash/document/Invoice',
                    result.id,
                  ]);
                })
            })

        })
        .catch((error) => {
          this._snackBar.open('An error occured', 'ok', {
            duration: 2000,
          });
          this.isLoaded = false;
        });
    }
  }
  // logo seletion
  openLogo() {
    let element: HTMLElement = document.getElementsByClassName(
      'logo-selector'
    )[0] as HTMLElement;
    element.click();
  }
  // sign selection
  openSignature() {
    let element: HTMLElement = document.getElementsByClassName(
      'sign-selector'
    )[0] as HTMLElement;
    element.click();
  }
  // uplaod logo
  uploadLogo(event: FileList) {
    this.fileLogo = event.item(0);
    if (this.fileLogo.type.split('/')[0] !== 'image') {
      this.snack.open('only image file accepted', 'ok', {
        duration: 5000,
      });
      this.fileLogo = null;
      return;
    }
    if (this.fileLogo.size > this.imageSize) {
      this.snack.open('Image must be below 512kb', 'Ok', {
        duration: 5000,
      });
      this.fileLogo = null;
      return;
    }
    if (event && event[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.logoPreview = event.target.result;
      };
      reader.readAsDataURL(event[0]);
    }
  }
  // upload sign
  uploadSign(event: FileList) {
    this.fileSignature = event.item(0);
    if (this.fileSignature.type.split('/')[0] !== 'image') {
      this.fileSignature = null;
      return;
    }
    if (this.fileSignature.size > this.imageSize) {
      this.snack.open('image must be below 512kb', 'ok', {
        duration: 5000,
      });
      this.fileSignature = null;
      return;
    }
    if (event && event[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.signPreview = event.target.result;
      };
      reader.readAsDataURL(event[0]);
    }
  }
  // on sav documnent open the login popup
  async generateDocument() {
    this.analytics.logEvent('btn_freeTool_Save'); //send google analytics event
    await this.afAuth.signInWithPopup(
      new firebase.default.auth.GoogleAuthProvider()
    );
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    // ondestroy
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  onCloseCard() {
    this.isMessageOpen = false;
  }
  onLogIn() {
    window.location.href = 'https://zenys.org/';
    this.analytics.logEvent('btn_signup_freetool_web');
    //this.router.navigate(['/login'])
  }
  onLogInMob() {
    window.location.href = 'https://zenys.org/';
    this.analytics.logEvent('btn_signup_freetool_mob');
    //this.router.navigate(['/login'])
  }
}
