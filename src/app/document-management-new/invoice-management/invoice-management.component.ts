/*------------------------------------------------
Description : For display bill from,bill to, additional field and doc details
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
import { InvoicesService } from './invoices.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
@Component({
  selector: 'app-invoice-management',
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.scss']
})
export class InvoiceManagementComponent implements OnInit, OnDestroy {
  userDetailsSubscription: Subscription
  docEditSubscription: Subscription
  networkConnection: boolean; // for checking netwrok connection
  superUserDetails: Profile;
  userDetails: Profile;
  changeLog: any = {};//changeLog for invoice
  
  constructor(public invoicesService: InvoicesService, private location: Location, public networkCheck: NetworkCheckService, public dialog: MatDialog,
    private route: ActivatedRoute, private _snackBar: MatSnackBar, private analytics: AngularFireAnalytics, private router: Router,
    public commonService: CommonService, private fb: FormBuilder,) {
    route.params.subscribe((val) => {
      this.invoicesService.getUrlInfo(val)
    })
    // initialize all the fom, arrays and fields 
    this.invoicesService.billingDetailspanel = true;
    this.invoicesService.additionalFields = [this.invoicesService.additionalFieldModel]
    this.invoicesService.productSummaryUiData = new BehaviorSubject({
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
    this.invoicesService.document = {
      billingAmountDetails: {
        currency: 'INR',
        includeCess: false,
        includeUnit: true,
        includeTax: true,
        interState: false,
        includeDiscount: false,
        taxType: 'gst',

      },
      itemList: [this.invoicesService.createEmptyProduct()],
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
    this.invoicesService.invoice = {
      additionalFieldsArr: [],
      createdBy: null,
      sharedDocId: null,
      collectedAmount: 0,
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
        deliverycountryCode: null,
        deliveryCountry: null,
        deliveryDistrict: null,
        deliveryPinCode: null,
        deliveryState: null,
        deliveryCompanyName: null,
        deliveryEmail: null
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
        dueDate: null,
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
        estRef: null,
        quoteRef: null,
        poRef: null,
        paymentTerm: null
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
    this.invoicesService.billingAmountDetailsForm = this.fb.group({
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
    this.invoicesService.productTableForm = this.fb.group({
      showUnit: [false],
      showDiscount: [false],
      showVat: [false],
      showcgst: [false],
      showSgst: [false],
      showIgst: [false],
      showCess: [false],
      itemList: this.fb.array([], Validators.required)
    })
    this.invoicesService.billFromForm = this.fb.group({
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
    this.invoicesService.signatureAndAdditionalDetailsForm = this.fb.group({
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
    this.invoicesService.billToForm = this.fb.group({
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
    this.invoicesService.deliverdToForm = this.fb.group({
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
      deliveryEmail: [null, Validators.email],
    })
    this.invoicesService.docDetailsForm = this.fb.group({
      docTitle: ['Invoice'],
      prefixAndDocNumber: [{ value: null, disabled: true }],
      docDate: [null, Validators.required],
      dueDate: [null,],
      gstPlaceOfSupplyCode: [null,],
      gstStateCode: [null,],
      estRef: [{ value: null, disabled: true }],
      quoteRef: [{ value: null, disabled: true }],
      poRef: [null,],
      paymentTerm: [null,]
    })
    // this.invoicesService.additionalFieldForm = new FormGroup({
    //   additionalFieldsArr: new FormArray([]),
    // })
    this.invoicesService.additionalFieldForm = this.fb.group({
      additionalFields: this.fb.array([]),
    })
    this.invoicesService.mainForm = this.fb.group({
      docTitle: ['Invoice', Validators.required],
    })
    this.invoicesService.formValueChanges()
    this.invoicesService.upDateUiData();
  }

  ngOnInit(): void {
    this.userDetailsSubscription = this.commonService.userDatas
      .subscribe((allData) => {
        if (allData) {
          this.invoicesService.updateFormDetailsFromUserdata(allData)
          if (this.invoicesService.scenario == 'edit' && !this.invoicesService.formResetDisable) {
            this.invoicesService.formResetDisable=true;
            //getting additional field
            this.invoicesService.additionalFields =
            allData.superUserDetails.customFieldsInvoices;
            this.invoicesService.additionalFieldLength = this.invoicesService.additionalFields?.length;
            //Read the details from the document being viewed or edited
            this.docEditSubscription = this.invoicesService.getDocumentDetails(this.invoicesService.superUserId, this.invoicesService.docID)
              .subscribe((data) => {
                if (data) {
                  this.invoicesService.mainForm.patchValue({ docTitle: data.docData.docTitle ? data.docData.docTitle : 'Invoice' })
                  this.changeLog = data.changeLog ? data.changeLog : {};
                  this.invoicesService.updateEditalue(data);
                  //save values of current form in temp variable to use in changelog
                  this.invoicesService.prevBillingAmountDetailsForm = ChangeLogComponent.cloneAbstractControl(this.invoicesService.billingAmountDetailsForm);
                  this.invoicesService.prevProductTableForm = ChangeLogComponent.cloneAbstractControl(this.invoicesService.productTableForm);
                  this.invoicesService.prevBillFromForm = ChangeLogComponent.cloneAbstractControl(this.invoicesService.billFromForm);
                  this.invoicesService.prevSignatureAndAdditionalDetailsForm = ChangeLogComponent.cloneAbstractControl(this.invoicesService.signatureAndAdditionalDetailsForm);
                  this.invoicesService.prevBillToForm = ChangeLogComponent.cloneAbstractControl(this.invoicesService.billToForm);
                  this.invoicesService.prevDeliverdToForm = ChangeLogComponent.cloneAbstractControl(this.invoicesService.deliverdToForm);
                  this.invoicesService.prevDocDetailsForm = ChangeLogComponent.cloneAbstractControl(this.invoicesService.docDetailsForm);
                  this.invoicesService.prevAdditionalFieldForm = ChangeLogComponent.cloneAbstractControl(this.invoicesService.additionalFieldForm);
                  
                }

              });
          }
          if (this.invoicesService.scenario == 'invfromquote' && !this.invoicesService.formResetDisable) {
            this.invoicesService.formResetDisable=true;
            //getting additional field
            this.invoicesService.additionalFields =
            allData.superUserDetails.customFieldsInvoices;
            this.invoicesService.additionalFieldLength = this.invoicesService.additionalFields?.length;
            //Read the details from the document being created from quottaion
            this.docEditSubscription = this.invoicesService.getQuotationDocumentDetails(this.invoicesService.superUserId, this.invoicesService.docID)
              .subscribe((data) => {
                if (data) {
                  this.invoicesService.updateInoviceEditalue(data, allData)
                }

              });
          }
          if (this.invoicesService.scenario == 'invfromest' && !this.invoicesService.formResetDisable) {
            this.invoicesService.formResetDisable=true;
            //getting additional field
            this.invoicesService.additionalFields =
            allData.superUserDetails.customFieldsInvoices;
            this.invoicesService.additionalFieldLength = this.invoicesService.additionalFields?.length;
            //Read the details from the document being created from estimate
            this.docEditSubscription = this.invoicesService.getEstimateDocumentDetails(this.invoicesService.superUserId, this.invoicesService.docID)
              .subscribe((data) => {
                if (data) {
                  this.invoicesService.updateInoviceEditalue(data, allData)
                }

              });
          }
          // bind super user details
          this.superUserDetails = allData.superUserDetails;
          
        }
      })
  }
  get form(): FormGroup {
    return this.invoicesService.mainForm;
  }
  changeDocTitle() {
    this.invoicesService.onDocTitleChange()
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
    this.invoicesService.isLoaded = false;
    this.invoicesService.formResetDisable=false;
  }
  // save doc
  saveDocument() {
    // check validation and throw msg if form is not valid and check the manadatory check which is added from settings
    if (!this.onCheckNetwork() || this.invoicesService.disableSaveButton) {
      this.invoicesService.markFormTouched()// for highlighing invalid fields
      this._snackBar.open('Please Fill All The Mandatory Fields', 'Done', {
        duration: 2000,
      });
    } else {
      // check if tagging of org,customer/sale is required and show error message
      if ((this.invoicesService.invoiceOrgTag && this.invoicesService.invoice.customerData.orgID == null)) {
        this._snackBar.open('Tag ' + this.invoicesService.billToForm.value.fieldNameOrganization, ' ', {
          duration: 2000,
        });
      }
      else if ((this.invoicesService.invoiceContactTag && this.invoicesService.invoice.customerData.custID == null)) {
        this._snackBar.open('Tag ' + this.invoicesService.billToForm.value.fieldNameContact, ' ', {
          duration: 2000,
        });
      }
      else if ((this.invoicesService.invoiceSaleTag && this.invoicesService.invoice.docData.saleID == null)) {
        this._snackBar.open('Tag ' + this.invoicesService.billToForm.value.fieldNameSale, ' ', {
          duration: 2000,
        });
      }
      else {
        this.invoicesService.bindAddtionalDetails();// set additional filed in doc  for saving
        switch (this.invoicesService.scenario) {
          case 'create': {
            this.docCreate();
            break;
          }
          case 'invfromest': {
            this.docCreate();
            break;
          }
          case 'invfromquote': {
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
              this.invoicesService.userId,
              this.invoicesService.userName,
              this.invoicesService.prevBillingAmountDetailsForm,
              this.invoicesService.billingAmountDetailsForm,
              newChangeLog,
              {}
            );
            if(billingAmountDetailsFormChanges !== null)
              newChangeLog = billingAmountDetailsFormChanges;
            //2
            let prevItemLength = this.invoicesService.prevProductTableForm.get('itemList').value.length;
          let curItemLength = this.invoicesService.productTableForm.get('itemList').value.length;
          //remove item if it doesnot have a name. It happens when user clicks add item and delete it without saving 
          for(let i = 0 ; i < Object.values(this.invoicesService.addedProducts).length; i++){
            if(this.invoicesService.addedProducts[i].item == null)
            delete this.invoicesService.addedProducts[i] 
          }
          let additionalData = {
            addedProducts: this.invoicesService.addedProducts,
            deletedProducts: this.invoicesService.deletedProducts
          };
          let productTableFormChanges = null;
          // if(prevItemLength == curItemLength){
            productTableFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.invoicesService.userId,
              this.invoicesService.userName,
              this.invoicesService.prevProductTableForm,
              this.invoicesService.productTableForm,
              newChangeLog,
              additionalData
            );
            this.invoicesService.addedProducts = {};
            this.invoicesService.deletedProducts = {};
          // } 
            if(productTableFormChanges != null)
              newChangeLog = productTableFormChanges;
            //3  
            let billFromFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.invoicesService.userId,
              this.invoicesService.userName,
              this.invoicesService.prevBillFromForm,
              this.invoicesService.billFromForm,
              newChangeLog,
              {}
            );
            if(billFromFormChanges != null)
              newChangeLog = billFromFormChanges;
            //4
            let signatureAndAdditionalDetailsFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.invoicesService.userId,
              this.invoicesService.userName,
              this.invoicesService.prevSignatureAndAdditionalDetailsForm,
              this.invoicesService.signatureAndAdditionalDetailsForm,
              newChangeLog,
              {}
            );
            if(signatureAndAdditionalDetailsFormChanges != null)
              newChangeLog = signatureAndAdditionalDetailsFormChanges;
            //5
            let billToFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.invoicesService.userId,
              this.invoicesService.userName,
              this.invoicesService.prevBillToForm,
              this.invoicesService.billToForm,
              newChangeLog,
              {}
            );
            if(billToFormChanges != null)
              newChangeLog = billToFormChanges;
            //6
            let deliverdToFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.invoicesService.userId,
              this.invoicesService.userName,
              this.invoicesService.prevDeliverdToForm,
              this.invoicesService.deliverdToForm,
              newChangeLog,
              {}
            );
            if(deliverdToFormChanges != null)
             newChangeLog = deliverdToFormChanges;
            //7
            let docDetailsFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.invoicesService.userId,
              this.invoicesService.userName,
              this.invoicesService.prevDocDetailsForm,
              this.invoicesService.docDetailsForm,
              newChangeLog,
              {}
            );
            if(docDetailsFormChanges != null)
              newChangeLog = docDetailsFormChanges;
            //8
            let additionalFieldFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.invoicesService.userId,
              this.invoicesService.userName,
              this.invoicesService.prevAdditionalFieldForm,
              this.invoicesService.additionalFieldForm,
              newChangeLog,
              {}
            );
            if(additionalFieldFormChanges != null)
              newChangeLog = additionalFieldFormChanges;
            

            // update document
            this.invoicesService.editDocument(newChangeLog).then((result) => {
              dialogRefEdit.close()
              this._snackBar.open('Successfully Updated', '', {
                duration: 2000,
              });
              this.router.navigate([
                '/dash/document/Invoice/',
                this.invoicesService.docID
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
    this.invoicesService.invoice.docData.createdDate = new Date().getTime();// set created date
    this.invoicesService.invoice.docData.docType = this.invoicesService.docType;// set doc type
    // open loading component
    const dialogRef = this.invoicesService.dialog.open(LoadingDialogComponent, {
      width: '250px',
      disableClose: true,
    });
    this.analytics.logEvent('btn_create_quote_web');
     //add changeLog on create
    let changeLog = ChangeLogComponent.saveLog(
      this.constructor.name,
      this.invoicesService.userId,
      this.invoicesService.userName,
      '',
      '',
      {}
    );
    // create document
    this.invoicesService.createDocument(changeLog).then((result) => {
      this.invoicesService.addedProducts = {};
      this.invoicesService.deletedProducts = {};
      this.invoicesService.docID = result.id;
      let docNum = 0;
      // if invoice AutoPayLink is Enable send payment link
      if (this.invoicesService.invoiceAutoPayLinkEnable) {
        this.invClicked()
      }
      if (this.commonService.superUserData.invoiceNoLast) {
        docNum = this.commonService.superUserData.invoiceNoLast;
      }
      // update the last doc num in superauserdetails
      this.invoicesService.updateDocNo(this.invoicesService.superUserId, {
        invoiceNoLast: docNum + 1,
      }).then((reslt) => {
        // create share doc used for preview
        this
          .invoicesService.createSharedDoc(this.invoicesService.superUserId, result.id, this.invoicesService.invoice.docData.docType)
          .then((res) => {
            // update share doc id in document
            this
              .invoicesService.UpdateshareDocumentId(
                this.invoicesService.superUserId,
                result.id,
                this.invoicesService.invoice.docData.docType,
                res.id
              ).then((reslt) => {
                this._snackBar.open('Successfully Created', ' ', {
                  duration: 2000,
                });
                dialogRef.close()
                this.router.navigate([
                  '/dash/document/Invoice/',
                  this.invoicesService.docID
                ]);
              })
          })
      })
    })
  }

  invClicked() {


    if (this.invoicesService.rzrAccountId || this.invoicesService.stripeAccountId) {
      this.
        invoicesService.getCustdetails(this.invoicesService.superUserId, this.invoicesService.custID)
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
    if (this.invoicesService.rzrAccountId && !this.invoicesService.payLinkMode) {
      if (this.invoicesService.invoice.docData.currency == 'INR') {
        var basicunit = Currencies.getCurencies().filter(
          (cur) => cur.isoCode == this.invoicesService.invoice.docData.currency
        )[0].basicUnit;
        var dat = {
          amount: this.invoicesService.invoice.docData.totalInclTax * basicunit,
          name: this.invoicesService.invoice.customerData.fname1 + ' ' + this.invoicesService.invoice.customerData.sname,
          contact: contactNo,
          email: email,
          currency: this.invoicesService.invoice.docData.currency,
          account_id: this.invoicesService.rzrAccountId,
        };
        this.invoicesService.rzrserv.makepaylink(dat).subscribe(
          (res: any) => {
            this.invoicesService.sendEmail({
              to: email,
              template: {
                name: 'payLink',
                data: {
                  userName: this.invoicesService.invoice.userData.companyName
                    ? this.invoicesService.invoice.userData.companyName
                    : this.invoicesService.invoice.userData.contactname,
                  customerName:
                    this.invoicesService.invoice.customerData.fname1 + ' ' + this.invoicesService.invoice.customerData.sname,
                  paymentLink: res.short_url,
                },
              },
            });
            this
              .invoicesService.savepaymentLink(
                {
                  ...res,
                  paidFlag: false,
                  userId: this.invoicesService.userId,
                  superUserId: this.invoicesService.superUserId,
                  docNo: this.invoicesService.docID,
                  customerId: this.invoicesService.invoice.customerData.custID,
                  saleId: this.invoicesService.invoice.docData.saleID,
                  saleTitle: this.invoicesService.invoice.docData.saleTitle,
                  companyName: this.invoicesService.invoice.customerData.companyName,
                  customerName:
                    this.invoicesService.invoice.customerData.fname1 +
                    (this.invoicesService.invoice.customerData.sname ? this.invoicesService.invoice.customerData.sname : ''),
                },
                res.id
              )
              .then((data) => {
                this
                  .invoicesService.updateDocafterLinkcreation(this.invoicesService.userId, this.invoicesService.docID, res, this.invoicesService.docType)
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
    else if (this.invoicesService.rzrAccountId && this.invoicesService.payLinkMode == "RazorpayPartner") {
      var basicunit = Currencies.getCurencies().filter(
        (cur) => cur.isoCode == this.invoicesService.invoice.docData.currency
      )[0].basicUnit;
      var dat = {
        amount: this.invoicesService.invoice.docData.totalInclTax * basicunit,
        name: this.invoicesService.invoice.customerData.fname1 + ' ' + this.invoicesService.invoice.customerData.sname,
        contact: contactNo,
        email: email,
        currency: this.invoicesService.invoice.docData.currency,
        account_id: this.invoicesService.rzrAccountId,
      };
      this.invoicesService.rzrserv.makepaylinkSubMerchant(dat).subscribe(
        (res: any) => {
          if (res.short_url) {
            var urlobj = { short_url: res.short_url }
            this.invoicesService.paymentLink = urlobj
            this.invoicesService.sendEmail({
              to: email,
              template: {
                name: 'Paylink',
                data: {
                  userName: this.invoicesService.invoice.userData.companyName
                    ? this.invoicesService.invoice.userData.companyName
                    : this.invoicesService.invoice.userData.contactname,
                  customerName:
                    this.invoicesService.invoice.customerData.fname1 + ' ' + this.invoicesService.invoice.customerData.sname,
                  paymentLink: res.short_url,
                },
              },
            });
            const paymentLinkData = {
              ...res,
              paidFlag: false,
              userId: this.invoicesService.userId,
              superUserId: this.invoicesService.superUserId,
              docNo: this.invoicesService.docID,
              customerId: this.invoicesService.invoice.customerData.custID,
              saleId: this.invoicesService.invoice.docData.saleID,
              saleTitle: this.invoicesService.invoice.docData.saleTitle,
              companyName: this.invoicesService.invoice.customerData.companyName,
              customerName: this.invoicesService.invoice.customerData.fname1,
              customerSecondName: (this.invoicesService.invoice.customerData.sname ? this.invoicesService.invoice.customerData.sname : ''),
              type: this.invoicesService.docType
            }
            if (this.invoicesService.invoice.docData.prefixAndDocNumber) {
              paymentLinkData.docprefixAndDocNumber = this.invoicesService.invoice.docData.prefixAndDocNumber
            }
            this
              .invoicesService.savepaymentLink(
                paymentLinkData,
                res.id
              )
              .then((data) => {
                this
                  .invoicesService.updateDocafterLinkcreation(this.invoicesService.userId, this.invoicesService.docID, res, this.invoicesService.docType)
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
    else if (this.invoicesService.stripeAccountId && this.invoicesService.payLinkMode == "StripeConnect") {
      this.invoicesService.makeShortUrl(this.invoicesService.superUserId, this.invoicesService.docID, this.invoicesService.docType).then(data => {
        this.invoicesService.getShortUrl(this.invoicesService.superUserId, this.invoicesService.docID, this.invoicesService.docType).subscribe((data: any) => {
          if (!!data.shortUrl) {
            var urlobj = { short_url: data.shortUrl, }
            this.invoicesService.paymentLink = urlobj
            this.invoicesService.sendEmail({
              to: email,
              template: {
                name: 'Paylink',
                data: {
                  userName: this.invoicesService.invoice.userData.companyName
                    ? this.invoicesService.invoice.userData.companyName
                    : this.invoicesService.invoice.userData.contactname,
                  customerName:
                    this.invoicesService.invoice.customerData.fname1 + ' ' + this.invoicesService.invoice.customerData.sname,
                  paymentLink: data.shortUrl,
                },
              },
            });
            this
              .invoicesService.updateDocafterLinkcreation(this.invoicesService.userId, this.invoicesService.docID, { short_url: data.shortUrl }, this.invoicesService.docType)
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
