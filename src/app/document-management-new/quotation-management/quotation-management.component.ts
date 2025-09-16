/*------------------------------------------------
Description : For display bill from,bill to, additional filed and doc details
----------------------------------------------------*/
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { CommonService } from 'src/app/common.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Profile } from 'src/app/data-models';
import { LoadingDialogComponent } from 'src/app/document-management-new/loading-dialog/loading-dialog.component';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { MatDialog } from '@angular/material/dialog';
import { Currencies } from 'src/app/currencies';
import { QuotationService } from './quotation.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
@Component({
  selector: 'app-quotation-management',
  templateUrl: './quotation-management.component.html',
  styleUrls: ['./quotation-management.component.scss']
})
export class QuotationManagementComponent implements OnInit, OnDestroy {
  userDetailsSubscription: Subscription
  docEditSubscription: Subscription
  networkConnection: boolean; // for checking netwrok connection
  superUserDetails: Profile;
  userDetails: Profile;
  
  changeLog: any = {}; //changeLog for quotation
  constructor(public quotationService: QuotationService, private location: Location, public networkCheck: NetworkCheckService, public dialog: MatDialog,
    private route: ActivatedRoute, private _snackBar: MatSnackBar, private analytics: AngularFireAnalytics, private router: Router,
    public commonService: CommonService, private fb: FormBuilder,) {

    route.params.subscribe((val) => {
      this.quotationService.getUrlInfo(val)
    })
    // initialize all the fom, arrays and fields 
    this.quotationService.billingDetailspanel = true;
    this.quotationService.additionalFields = [this.quotationService.additionalFieldModel]
    this.quotationService.productSummaryUiData = new BehaviorSubject({
      currency: null,
      total: null,
      discountTotal: null,
      totalAfterDiscount: null,
      cgstTotal: null,
      sgstTotal: null,
      cessTotal: null,
      vatTotal: null,
      igstTotal: null,
      totalIncludingTax: null,
      totalAmountDiscounted: null,
      showDiscountTotal: false,
      showTotalAfterDiscount: false,
      showCgstTotal: false,
      showSgstTotal: false,
      showCessTotal: false,
      showVatTotal: false,
      showIgstTotal: false,
      showTotalIncludingTax: false,
    });
    this.quotationService.document = {
      billingAmountDetails: {
        currency: 'INR',
        includeCess: false,
        includeUnit: true,
        includeTax: true,
        interState: false,
        includeDiscount: false,
        taxType: 'gst',

      },
      itemList: [this.quotationService.createEmptyProduct()],
      summaryData: {
        currency: 'INR',
        cessValue: 0,
        cgstValue: 0,
        vatValue: 0,
        igstValue: 0,
        sgstValue: 0,
        total: 0,
        totalAfterDiscount: 0,
        totalInclTax: 0,
        totalAmountDiscounted: 0
      },
    }
    this.quotationService.quotation = {
      additionalFieldsArr: [],
      createdBy: null,
      sharedDocId: null,
      customerData: {
        addressline1: null,
        addressline2: null,
        companyName: null,
        contactNumber: null,
        country: null,
        countryCode: '+91',
        custID: null,
        contactAssignedToOwner: null,
        orgID: null,
        district: null,
        email: null,
        fname1: null,
        gst: null,
        isDeliveryAddressPresent: false,
        pinCode: null,
        sname: null,
        state: null,
        surname: null,
        deliveryAddressline1: null,
        deliveryAddressline2: null,
        deliveryContactName: null,
        deliveryContactNumber: null,
        deliverycountryCode:null,
        deliveryCountry: null,
        deliveryDistrict: null,
        deliveryPinCode: null,
        deliveryState: null,
        deliveryCompanyName:null,
        deliveryEmail:null,
      },
      docData: {
        bankDetails: null,
        cancel: false,
        cessValue: null,
        cgstValue: null,
        createdDate: null,
        currency: null,
        discountValue: 0,
        discountedAmount: 0,
        docDate: null,
        docNumber: null,
        docPrefix: null,
        docTitle: null,
        docType: null,
        docValidity: null,
        igstValue: 0,
        includeCess: false,
        includeDiscount: false,
        includeTax: false,
        includeUnit: false,
        interState: false,
        notes: null,
        prefixAndDocNumber: null,
        saleAssignedToOwner: null,
        saleID: null,
        saleTitle: null,
        sgstValue: 0,
        statusApproved: false,
        taxType: null,
        total: 0,
        totalInclTax: 0,
        vatValue: 0,
        gstPlaceOfSupplyCode: null,
        gstStateCode: null,
        estRef: null
      },
      searchTerm: {
        companyName: null,
        firstName: null,
        secondName: null,
        surname: null,
      },
      userData: {
        addressline1: null,
        addressline2: null,
        city: null,
        companyName: null,
        contactname: null,
        contactno: null,
        country: null,
        designation: null,
        email: null,
        gst: null,
        pinCode: null,
        // secondName: null,
        signatoryName: null,
        state: null,
      },
      itemList: [
        {
          amount: 0,
          amountInclTax: 0,
          cessAmount: 0,
          cessRate: 0,
          cgstAmount: 0,
          cgstRate: 0,
          description: null,
          discountAmount: 0,
          discountRate: 0,
          discountedAmount: 0,
          hsnCode: null,
          igstAmount: 0,
          igstRate: 0,
          item: null,
          qty: 0,
          rate: 0,
          sgstAmount: 0,
          sgstRate: 0,
          slno: 0,
          unit: null,
          vatAmount: 0,
          vatRate: 0,

        }
      ]
    }
    this.quotationService.billingAmountDetailsForm = this.fb.group({
      currency: [null, Validators.required],
      includeUnit: [true],
      includeTax: [true],
      includeDiscount: [false],
      taxType: ['gst', Validators.required],
      interState: [false],
      includeCess: [false],
      showTaxtype: [false],
      showCess: [false],
      showIgst: [false],
    })
    this.quotationService.productTableForm = this.fb.group({
      showUnit: [false],
      showDiscount: [false],
      showVat: [false],
      showcgst: [false],
      showSgst: [false],
      showIgst: [false],
      showCess: [false],
      itemList: this.fb.array([], Validators.required)
    })
    this.quotationService.billFromForm = this.fb.group({
      logo: [null],
      showLogo: [false],
      billFromCompanyName: [null, Validators.minLength(2)],
      billFromContactname: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      billFromSecondName: [null, [Validators.minLength(1), Validators.maxLength(60)]],
      billFromAddressline1: [null, [Validators.minLength(2)]],
      billFromAddressline2: [null, [Validators.minLength(2)]],
      billFromCity: [null, [Validators.minLength(2)]],
      billFromPinCode: [null,],
      billFromState: [null, [Validators.minLength(2)]],
      billFromCountry: [null, [Validators.minLength(2)]],
      billFromGst: [null,]
    })
    this.quotationService.signatureAndAdditionalDetailsForm = this.fb.group({
      notes: [null],
      bankDetails: [null],
      signature: [null],
      showSignature: [false],
      signatoryName: [null],
      designation: [null, [Validators.minLength(1), Validators.maxLength(15)]],
      signatoryContactname: [null],
      signatoryContactno: [null],
      signatoryEmail: [null, Validators.email],
    })
    this.quotationService.billToForm = this.fb.group({
      showTags: false,
      fieldNameContact: ['Contact'],
      fieldNameSale: ['Sale'],
      fieldNameOrganization: ['Organization'],
      billToCompanyName: [null, [Validators.minLength(2), Validators.maxLength(60)]],
      billToFname1: [null, [Validators.minLength(3), Validators.maxLength(100)]],
      billToSname: [null],
      billToSurname: [null],
      billToAddressline1: [null, [Validators.minLength(3), Validators.maxLength(100)]],
      billToAddressline2: [null, [Validators.minLength(3), Validators.maxLength(100)]],
      billToDistrict: [null, [Validators.minLength(3), Validators.maxLength(50)]],
      billToPinCode: [null, [Validators.minLength(4), Validators.maxLength(12)]],
      billToState: [null, [Validators.minLength(3), Validators.maxLength(50)]],
      billToCountry: [null, [Validators.minLength(2)]],
      billToCountryCode: ['+91', [Validators.minLength(2)]],
      billToContactNumber: [null],
      billToEmail: [null, Validators.email],
      billToGst: [null,]
    })
    this.quotationService.deliverdToForm = this.fb.group({
      isDeliveryAddressPresent: [false],
      fieldNameContact: ['Contact'],
      fieldNameOrg: ['Organization'],
      deliveryContactName: [null, [Validators.minLength(3), Validators.maxLength(100)]],
      deliveryAddressline1: [null, [Validators.minLength(3), Validators.maxLength(100)]],
      deliveryAddressline2: [null, [Validators.minLength(3), Validators.maxLength(100)]],
      deliveryDistrict: [null, [Validators.minLength(3), Validators.maxLength(50)]],
      deliveryPinCode: [null, [Validators.minLength(4), Validators.maxLength(12)]],
      deliveryState: [null, [Validators.minLength(3), Validators.maxLength(50)]],
      deliveryCountry: [null, [Validators.minLength(2)]],
      deliverycountryCode: ['+91', [Validators.minLength(2)]],
      deliveryContactNumber: [null],
      deliveryCompanyName: [null, [Validators.minLength(2), Validators.maxLength(100)]],
      deliveryEmail:[null, Validators.email],
    })
    this.quotationService.docDetailsForm = this.fb.group({
      docTitle: ['Quotation'],
      prefixAndDocNumber: [{ value: null, disabled: true }],
      docDate: [null, Validators.required],
      docValidity: [null,],
      gstPlaceOfSupplyCode: [null,],
      gstStateCode: [null,],
      estRef: [{ value: null, disabled: true }],
    })
    this.quotationService.additionalFieldForm = this.fb.group({
      additionalFields: this.fb.array([]),
    })
    this.quotationService.mainForm = this.fb.group({
      docTitle: ['Quotation', Validators.required],
    })
    this.quotationService.formValueChanges()
    this.quotationService.upDateUiData();
  }

  ngOnInit(): void {
    this.userDetailsSubscription = this.commonService.userDatas
      .subscribe((allData) => {
        if (allData) {
          this.quotationService.updateFormDetailsFromUserdata(allData)
          if (this.quotationService.scenario == 'edit' && !this.quotationService.formResetDisable) {
            this.quotationService.formResetDisable=true;
            //getting additional field
            this.quotationService.additionalFields =allData.superUserDetails.customFieldsQuotation;
            this.quotationService.additionalFieldLength = this.quotationService.additionalFields?.length;
            //Read the details from the document being viewed or edited
            this.docEditSubscription = this.quotationService.getDocumentDetails(this.quotationService.superUserId, this.quotationService.docID)
              .subscribe((data) => {
                if (data) {
                  this.quotationService.mainForm.patchValue({ docTitle: data.docData.docTitle ? data.docData.docTitle : 'Quotation' })
                  this.changeLog = data.changeLog ? data.changeLog : {};
                  this.quotationService.updateEditalue(data);
                  //save values of current form in temp variable to use in changelog
                  this.quotationService.prevBillingAmountDetailsForm = ChangeLogComponent.cloneAbstractControl(this.quotationService.billingAmountDetailsForm);
                  this.quotationService.prevProductTableForm = ChangeLogComponent.cloneAbstractControl(this.quotationService.productTableForm);
                  this.quotationService.prevBillFromForm = ChangeLogComponent.cloneAbstractControl(this.quotationService.billFromForm);
                  this.quotationService.prevSignatureAndAdditionalDetailsForm = ChangeLogComponent.cloneAbstractControl(this.quotationService.signatureAndAdditionalDetailsForm);
                  this.quotationService.prevBillToForm = ChangeLogComponent.cloneAbstractControl(this.quotationService.billToForm);
                  this.quotationService.prevDeliverdToForm = ChangeLogComponent.cloneAbstractControl(this.quotationService.deliverdToForm);
                  this.quotationService.prevDocDetailsForm = ChangeLogComponent.cloneAbstractControl(this.quotationService.docDetailsForm);
                  this.quotationService.prevAdditionalFieldForm = ChangeLogComponent.cloneAbstractControl(this.quotationService.additionalFieldForm);
                 
                }
              });
          }
          if (this.quotationService.scenario == 'quotefromest' && !this.quotationService.formResetDisable) {
            this.quotationService.formResetDisable=true;
            //getting additional field
            this.quotationService.additionalFields =allData.superUserDetails.customFieldsQuotation;
            this.quotationService.additionalFieldLength = this.quotationService.additionalFields?.length;
            //Read the details from the document being created from estimate
            this.docEditSubscription = this.quotationService.getEstimateDocumentDetails(this.quotationService.superUserId, this.quotationService.docID)
              .subscribe((data) => {
                if (data) {
                  this.quotationService.updateEstimateEditalue(data, allData)
                }

              });
          }
          // bind super user details
          this.superUserDetails = allData.superUserDetails
          
        }
      })
  }
  get form(): FormGroup {
    return this.quotationService.mainForm;
  }
  changeDocTitle() {
    this.quotationService.onDocTitleChange()
  }

  backClick() {
    //return back to the previous screen
    this.location.back();
  }
  // on network check
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    // on destroy
    this.docEditSubscription?.unsubscribe();
    this.userDetailsSubscription?.unsubscribe();
    this.quotationService.isLoaded = false;
    this.quotationService.formResetDisable = false;
  }
  // save doc
  saveDocument() {
    // check validation and throw msg if form is not valid and check the manadatory check which is added from settings
    if (!this.onCheckNetwork() || this.quotationService.disableSaveButton) {
      this.quotationService.markFormTouched()// for highlighing invalid fields
      this._snackBar.open('Please Fill All The Mandatory Fields', 'Done', {
        duration: 2000,
      });
    } else {
      // check if tagging of org,customer/sale is required and show error message
      if ((this.quotationService.quoteOrgTag && this.quotationService.quotation.customerData.orgID == null)) {
        this._snackBar.open('Tag ' + this.quotationService.billToForm.value.fieldNameOrganization, ' ', {
          duration: 2000,
        });
      }
      else if ((this.quotationService.quoteContactTag && this.quotationService.quotation.customerData.custID == null)) {
        this._snackBar.open('Tag ' + this.quotationService.billToForm.value.fieldNameContact, ' ', {
          duration: 2000,
        });
      }
      else if ((this.quotationService.quoteSaleTag && this.quotationService.quotation.docData.saleID == null)) {
        this._snackBar.open('Tag ' + this.quotationService.billToForm.value.fieldNameSale, ' ', {
          duration: 2000,
        });
      }
      else {
        this.quotationService.bindAddtionalDetails();// set additional filed in doc  for saving
        switch (this.quotationService.scenario) {
          case 'create': {
            this.docCreate();
            break;
          }
          case 'quotefromest': {
            this.docCreate();
            break;
          }
          case 'edit': {
            const dialogRefEdit = this.dialog.open(LoadingDialogComponent, {
              width: '250px',
              disableClose: true,
            });

            let newChangeLog = this.changeLog;  
            //get updated values in changelog
            //1
            let billingAmountDetailsFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.quotationService.userId,
              this.quotationService.userName,
              this.quotationService.prevBillingAmountDetailsForm,
              this.quotationService.billingAmountDetailsForm,
              newChangeLog,
              {}
            );
            if(billingAmountDetailsFormChanges !== null)
              newChangeLog = billingAmountDetailsFormChanges;
            //2
            let prevItemLength = this.quotationService.prevProductTableForm.get('itemList').value.length;
          let curItemLength = this.quotationService.productTableForm.get('itemList').value.length;
          //remove item if it doesnot have a name. It happens when user clicks add item and delete it without saving 
          for(let i = 0 ; i < Object.values(this.quotationService.addedProducts).length; i++){
            if(this.quotationService.addedProducts[i].item == null)
            delete this.quotationService.addedProducts[i] 
          }
          let additionalData = {
            addedProducts: this.quotationService.addedProducts,
            deletedProducts: this.quotationService.deletedProducts
          };
          let productTableFormChanges = null;
          // if(prevItemLength == curItemLength){
            productTableFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.quotationService.userId,
              this.quotationService.userName,
              this.quotationService.prevProductTableForm,
              this.quotationService.productTableForm,
              newChangeLog,
              additionalData
            );
            this.quotationService.addedProducts = {};
            this.quotationService.deletedProducts = {};
          // } 
            if(productTableFormChanges != null)
              newChangeLog = productTableFormChanges;
            //3  
            let billFromFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.quotationService.userId,
              this.quotationService.userName,
              this.quotationService.prevBillFromForm,
              this.quotationService.billFromForm,
              newChangeLog,
              {}
            );
            if(billFromFormChanges != null)
              newChangeLog = billFromFormChanges;
            //4
            let signatureAndAdditionalDetailsFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.quotationService.userId,
              this.quotationService.userName,
              this.quotationService.prevSignatureAndAdditionalDetailsForm,
              this.quotationService.signatureAndAdditionalDetailsForm,
              newChangeLog,
              {}
            );
            if(signatureAndAdditionalDetailsFormChanges != null)
              newChangeLog = signatureAndAdditionalDetailsFormChanges;
            //5
            let billToFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.quotationService.userId,
              this.quotationService.userName,
              this.quotationService.prevBillToForm,
              this.quotationService.billToForm,
              newChangeLog,
              {}
            );
            if(billToFormChanges != null)
              newChangeLog = billToFormChanges;
            //6
            let deliverdToFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.quotationService.userId,
              this.quotationService.userName,
              this.quotationService.prevDeliverdToForm,
              this.quotationService.deliverdToForm,
              newChangeLog,
              {}
            );
            if(deliverdToFormChanges != null)
             newChangeLog = deliverdToFormChanges;
            //7
            let docDetailsFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.quotationService.userId,
              this.quotationService.userName,
              this.quotationService.prevDocDetailsForm,
              this.quotationService.docDetailsForm,
              newChangeLog,
              {}
            );
            if(docDetailsFormChanges != null)
              newChangeLog = docDetailsFormChanges;
            //8
            let additionalFieldFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.quotationService.userId,
              this.quotationService.userName,
              this.quotationService.prevAdditionalFieldForm,
              this.quotationService.additionalFieldForm,
              newChangeLog,
              {}
            );
            if(additionalFieldFormChanges != null)
              newChangeLog = additionalFieldFormChanges;
            

            // update document
            this.quotationService.editDocument(newChangeLog).then((result) => {
              dialogRefEdit.close()
              this._snackBar.open('Successfully Updated', '', {
                duration: 2000,
              });
              this.router.navigate([
                '/dash/document/Quotation/',
                this.quotationService.docID
              ]);
            })
            break;
          }
          default: {
            //statements;
            break;
          }
        }
      }
    }
  }
  docCreate() {
    this.quotationService.quotation.docData.createdDate = new Date().getTime();// set created date
    this.quotationService.quotation.docData.docType = this.quotationService.docType;// set doc type
     // open loading component
    const dialogRef = this.quotationService.dialog.open(LoadingDialogComponent, {
      width: '250px',
      disableClose: true,
    });
    this.analytics.logEvent('btn_create_quote_web');
    //add changeLog on create
    let changeLog = ChangeLogComponent.saveLog(
      this.constructor.name,
      this.quotationService.userId,
      this.quotationService.userName,
      '',
      '',
      {}
    );
 // create document
    this.quotationService.createDocument(changeLog).then((result) => {
      this.quotationService.addedProducts = {};
      this.quotationService.deletedProducts = {};
      this.quotationService.docID = result.id;
      let docNum = 0;
      // if quotation AutoPayLink is Enable send payment link
      if (this.quotationService.quotationAutoPayLinkEnable) {
        this.invClicked()
      }
      if (this.commonService.superUserData.quoteNoLast) {
        docNum = this.commonService.superUserData.quoteNoLast;
      }
      // update the last doc num in superauserdetails
      this.quotationService.updateDocNo(this.quotationService.superUserId, {
        quoteNoLast: docNum + 1,
      }).then((reslt) => {
          // create share doc used for preview
        this
          .quotationService.createSharedDoc(this.quotationService.superUserId, result.id, this.quotationService.quotation.docData.docType)
          .then((res) => {
            // update share doc id in document
            this
              .quotationService.UpdateshareDocumentId(
                this.quotationService.superUserId,
                result.id,
                this.quotationService.quotation.docData.docType,
                res.id
              ).then((reslt) => {
                this._snackBar.open('Successfully Created', ' ', {
                  duration: 2000,
                });
                dialogRef.close()
                this.router.navigate([
                  '/dash/document/Quotation/',
                  this.quotationService.docID
                ]);
              })
          })
      })
    })
  }

  invClicked() {


    if (this.quotationService.rzrAccountId || this.quotationService.stripeAccountId) {
      this.
        quotationService.getCustdetails(this.quotationService.superUserId, this.quotationService.custID)
        .subscribe((res) => {
          this.makepaylink(
            res.data().contactNo
              ? res.data().code + '' + res.data().contactNo
              : '',
            res.data().email
          );
        });
    } else {
      this._snackBar.open(
        'Register your account details with Zenys for creating payment link',
        null,
        { duration: 4000 }
      );
    }
  }
  makepaylink(contactNo, email) {
    if (this.quotationService.rzrAccountId && !this.quotationService.payLinkMode) {
      if (this.quotationService.quotation.docData.currency == 'INR') {
        var basicunit = Currencies.getCurencies().filter(
          (cur) => cur.isoCode == this.quotationService.quotation.docData.currency
        )[0].basicUnit;
        var dat = {
          amount: this.quotationService.quotation.docData.totalInclTax * basicunit,
          name: this.quotationService.quotation.customerData.fname1 + ' ' + this.quotationService.quotation.customerData.sname,
          contact: contactNo,
          email: email,
          currency: this.quotationService.quotation.docData.currency,
          account_id: this.quotationService.rzrAccountId,
        };
        this.quotationService.rzrserv.makepaylink(dat).subscribe(
          (res: any) => {
            this.quotationService.sendEmail({
              to: email,
              template: {
                name: 'payLink',
                data: {
                  userName: this.quotationService.quotation.userData.companyName
                    ? this.quotationService.quotation.userData.companyName
                    : this.quotationService.quotation.userData.contactname,
                  customerName:
                    this.quotationService.quotation.customerData.fname1 + ' ' + this.quotationService.quotation.customerData.sname,
                  paymentLink: res.short_url,
                },
              },
            });
            this
              .quotationService.savepaymentLink(
                {
                  ...res,
                  paidFlag: false,
                  userId: this.quotationService.userId,
                  superUserId: this.quotationService.superUserId,
                  docNo: this.quotationService.docID,
                  customerId: this.quotationService.quotation.customerData.custID,
                  saleId: this.quotationService.quotation.docData.saleID,
                  saleTitle: this.quotationService.quotation.docData.saleTitle,
                  companyName: this.quotationService.quotation.customerData.companyName,
                  customerName:
                    this.quotationService.quotation.customerData.fname1 +
                    (this.quotationService.quotation.customerData.sname ? this.quotationService.quotation.customerData.sname : ''),
                },
                res.id
              )
              .then((data) => {
                this
                  .quotationService.updateDocafterLinkcreation(this.quotationService.userId, this.quotationService.docID, res, this.quotationService.docType)
                  .then((data2) => {
                  });
              });
          },
          (err) => {
            // console.log(err);
          }
        );
        return null;
      } else {
        this._snackBar.open(
          'Payment links for tranfer linked accounts can only be created for Indian Currency',
          null,
          { duration: 4000 }
        );
      }
    }
    else if (this.quotationService.rzrAccountId && this.quotationService.payLinkMode == "RazorpayPartner") {
      var basicunit = Currencies.getCurencies().filter(
        (cur) => cur.isoCode == this.quotationService.quotation.docData.currency
      )[0].basicUnit;
      var dat = {
        amount: this.quotationService.quotation.docData.totalInclTax * basicunit,
        name: this.quotationService.quotation.customerData.fname1 + ' ' + this.quotationService.quotation.customerData.sname,
        contact: contactNo,
        email: email,
        currency: this.quotationService.quotation.docData.currency,
        account_id: this.quotationService.rzrAccountId,
      };
      this.quotationService.rzrserv.makepaylinkSubMerchant(dat).subscribe(
        (res: any) => {
          if (res.short_url) {
            var urlobj = { short_url: res.short_url }
            this.quotationService.paymentLink = urlobj
            this.quotationService.sendEmail({
              to: email,
              template: {
                name: 'Paylink',
                data: {
                  userName: this.quotationService.quotation.userData.companyName
                    ? this.quotationService.quotation.userData.companyName
                    : this.quotationService.quotation.userData.contactname,
                  customerName:
                    this.quotationService.quotation.customerData.fname1 + ' ' + this.quotationService.quotation.customerData.sname,
                  paymentLink: res.short_url,
                },
              },
            });
            const paymentLinkData = {
              ...res,
              paidFlag: false,
              userId: this.quotationService.userId,
              superUserId: this.quotationService.superUserId,
              docNo: this.quotationService.docID,
              customerId: this.quotationService.quotation.customerData.custID,
              saleId: this.quotationService.quotation.docData.saleID,
              saleTitle: this.quotationService.quotation.docData.saleTitle,
              companyName: this.quotationService.quotation.customerData.companyName,
              customerName: this.quotationService.quotation.customerData.fname1,
              customerSecondName: (this.quotationService.quotation.customerData.sname ? this.quotationService.quotation.customerData.sname : ''),
              type: this.quotationService.docType
            }
            if (this.quotationService.quotation.docData.prefixAndDocNumber) {
              paymentLinkData.docprefixAndDocNumber = this.quotationService.quotation.docData.prefixAndDocNumber
            }
            this
              .quotationService.savepaymentLink(
                paymentLinkData,
                res.id
              )
              .then((data) => {
                this
                  .quotationService.updateDocafterLinkcreation(this.quotationService.userId, this.quotationService.docID, res, this.quotationService.docType)
                  .then((data2) => {
                  });
              });
          }
          else if (!!!res.short_url) {
            this._snackBar.open(
              'Payment links cannot be created for this amount. You can contact Razorpay Customer care to know the maximum amount that can be used to create payment link in your account. ',
              null,
              { duration: 6000 }
            );
          }
        },
        (err) => {
          // console.log(err);
        }
      );
      return null;
    }
    else if (this.quotationService.stripeAccountId && this.quotationService.payLinkMode == "StripeConnect") {
      this.quotationService.makeShortUrl(this.quotationService.superUserId, this.quotationService.docID, this.quotationService.docType).then(data => {
        this.quotationService.getShortUrl(this.quotationService.superUserId, this.quotationService.docID, this.quotationService.docType).subscribe((data: any) => {
          if (!!data.shortUrl) {
            var urlobj = { short_url: data.shortUrl, }
            this.quotationService.paymentLink = urlobj
            this.quotationService.sendEmail({
              to: email,
              template: {
                name: 'Paylink',
                data: {
                  userName: this.quotationService.quotation.userData.companyName
                    ? this.quotationService.quotation.userData.companyName
                    : this.quotationService.quotation.userData.contactname,
                  customerName:
                    this.quotationService.quotation.customerData.fname1 + ' ' + this.quotationService.quotation.customerData.sname,
                  paymentLink: data.shortUrl,
                },
              },
            });
            this
              .quotationService.updateDocafterLinkcreation(this.quotationService.userId, this.quotationService.docID, { short_url: data.shortUrl }, this.quotationService.docType)
              .then((data2) => {
              });
          }
        })
      }, err => {
        // console.log(err)
      })

    }
  }
}
