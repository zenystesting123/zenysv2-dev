/*------------------------------------------------
Description :connect all forms (billing addres and document details,product details and signature and additionaldetails)
----------------------------------------------------*/
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { EstimateService } from './estimate.service';
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
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
@Component({
  selector: 'app-estimate-management',
  templateUrl: './estimate-management.component.html',
  styleUrls: ['./estimate-management.component.scss']
})
export class EstimateManagementComponent implements OnInit, OnDestroy {
  userDetailsSubscription: Subscription
  docEditSubscription: Subscription
  networkConnection: boolean; // for checking netwrok connection
  superUserDetails: Profile;
  userDetails: Profile;
  
  changeLog: any = {}; //changeLog for estimate
  constructor(public estimateService: EstimateService, private location: Location, public networkCheck: NetworkCheckService, public dialog: MatDialog,
    private route: ActivatedRoute, private _snackBar: MatSnackBar, private analytics: AngularFireAnalytics, private router: Router,
    public commonService: CommonService, private fb: FormBuilder,) {
    route.params.subscribe((val) => {
      this.estimateService.getUrlInfo(val)
    })
    // initialize all the fom, arrays and fields 
    this.estimateService.billingDetailspanel = true;
    this.estimateService.additionalFields = [this.estimateService.additionalFieldModel]
    this.estimateService.productSummaryUiData = new BehaviorSubject({
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
    this.estimateService.document = {
      billingAmountDetails: {
        currency: 'INR',
        includeCess: false,
        includeUnit: true,
        includeTax: true,
        interState: false,
        includeDiscount: false,
        taxType: 'gst',

      },
      itemList: [this.estimateService.createEmptyProduct()],
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
    this.estimateService.estimate = {
      changeLog: {},
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
        deliverycountryCode: null,
        deliveryCountry: null,
        deliveryDistrict: null,
        deliveryPinCode: null,
        deliveryState: null,
        deliveryCompanyName: null,
        deliveryEmail: null,
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
    this.estimateService.billingAmountDetailsForm = this.fb.group({
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
    this.estimateService.productTableForm = this.fb.group({
      showUnit: [false],
      showDiscount: [false],
      showVat: [false],
      showcgst: [false],
      showSgst: [false],
      showIgst: [false],
      showCess: [false],
      itemList: this.fb.array([], Validators.required)
    })
    this.estimateService.billFromForm = this.fb.group({
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
    this.estimateService.signatureAndAdditionalDetailsForm = this.fb.group({
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
    this.estimateService.billToForm = this.fb.group({
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
    this.estimateService.deliverdToForm = this.fb.group({
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
    this.estimateService.docDetailsForm = this.fb.group({
      docTitle: ['Estimate'],
      prefixAndDocNumber: [{ value: null, disabled: true }],
      docDate: [null, Validators.required],
      docValidity: [null,]
    })
    // this.estimateService.additionalFieldForm = new FormGroup({
    //   additionalFieldsArr: new FormArray([]),
    // })
    this.estimateService.additionalFieldForm = this.fb.group({
      additionalFields: this.fb.array([]),
    })
    this.estimateService.mainForm = this.fb.group({
      docTitle: ['Estimate', Validators.required],
    })
    this.estimateService.formValueChanges()
    this.estimateService.upDateUiData();
  }

  ngOnInit(): void {
    this.userDetailsSubscription = this.commonService.userDatas
      .subscribe((allData) => {
        if (allData) {
          this.estimateService.updateFormDetailsFromUserdata(allData)
          if (this.estimateService.scenario == 'edit' && !this.estimateService.formResetDisable) {
              this.estimateService.formResetDisable=true;
              //getting additional field
              this.estimateService.additionalFields =allData.superUserDetails.customFieldsEstimate;
              this.estimateService.additionalFieldLength = this.estimateService.additionalFields?.length;
            //Read the details from the document being viewed or edited
            this.docEditSubscription = this.estimateService.getDocumentDetails(this.estimateService.superUserId, this.estimateService.docID)
              .subscribe((data) => {
                if (data) {
                  this.estimateService.mainForm.patchValue({ docTitle: data.docData.docTitle ? data.docData.docTitle : 'Estimate' })
                  this.changeLog = data.changeLog ? data.changeLog : {};
                  this.estimateService.updateEditalue(data)
                  
                  //save values of current form in temp variable to use in changelog
                  this.estimateService.prevBillingAmountDetailsForm = ChangeLogComponent.cloneAbstractControl(this.estimateService.billingAmountDetailsForm);
                  this.estimateService.prevProductTableForm = ChangeLogComponent.cloneAbstractControl(this.estimateService.productTableForm);
                  this.estimateService.prevBillFromForm = ChangeLogComponent.cloneAbstractControl(this.estimateService.billFromForm);
                  this.estimateService.prevSignatureAndAdditionalDetailsForm = ChangeLogComponent.cloneAbstractControl(this.estimateService.signatureAndAdditionalDetailsForm);
                  this.estimateService.prevBillToForm = ChangeLogComponent.cloneAbstractControl(this.estimateService.billToForm);
                  this.estimateService.prevDeliverdToForm = ChangeLogComponent.cloneAbstractControl(this.estimateService.deliverdToForm);
                  this.estimateService.prevDocDetailsForm = ChangeLogComponent.cloneAbstractControl(this.estimateService.docDetailsForm);
                  this.estimateService.prevMainForm = ChangeLogComponent.cloneAbstractControl(this.estimateService.mainForm);
                  
                }
              });
          }
          // bind super user details
          this.superUserDetails = allData.superUserDetails
          
        }
      })
  }
  get form(): FormGroup {
    return this.estimateService.mainForm;
  }
  changeDocTitle() {
    this.estimateService.onDocTitleChange()
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
    this.estimateService.isLoaded = false;
    this.estimateService.formResetDisable=false;
  }
  // save doc
  saveDocument() {
    // check validation and throw msg if form is not valid and check the manadatory check which is added from settings
    if (!this.onCheckNetwork() || this.estimateService.disableSaveButton) {
      this.estimateService.markFormTouched()// for highlighing invalid fields
      this._snackBar.open('Please Fill All The Mandatory Fields', 'Done', {
        duration: 2000,
      });
    } else {
      // check if tagging of org,customer/sale is required and show error message
      if ((this.estimateService.estimateOrgTag && this.estimateService.estimate.customerData.orgID == null)) {
        this._snackBar.open('Tag ' + this.estimateService.billToForm.value.fieldNameOrganization, ' ', {
          duration: 2000,
        });
      }
      else if ((this.estimateService.estimateContactTag && this.estimateService.estimate.customerData.custID == null)) {
        this._snackBar.open('Tag ' + this.estimateService.billToForm.value.fieldNameContact, ' ', {
          duration: 2000,
        });
      }
      else if ((this.estimateService.estimateSaleTag && this.estimateService.estimate.docData.saleID == null)) {
        this._snackBar.open('Tag ' + this.estimateService.billToForm.value.fieldNameSale, ' ', {
          duration: 2000,
        });
      }
      else {
        this.estimateService.bindAddtionalDetails();// set additional filed in doc  for saving
        if (this.estimateService.scenario == 'create') {
          this.estimateService.estimate.docData.createdDate = new Date().getTime();// set created date
          this.estimateService.estimate.docData.docType = this.estimateService.docType;// set doc type
          // open loading component
          const dialogRef = this.estimateService.dialog.open(LoadingDialogComponent, {
            width: '250px',
            disableClose: true,
          });
          this.analytics.logEvent('btn_create_est_web');
          //add changeLog on create
          let changeLog = ChangeLogComponent.saveLog(
            this.constructor.name,
            this.estimateService.userId,
            this.estimateService.userName,
            '',
            '',
            {}
          );
          // create document
          this.estimateService.createDocument(changeLog).then((result) => {
            this.estimateService.addedProducts = {};
            this.estimateService.deletedProducts = {};
            this.estimateService.docID = result.id;
            let docNum = 0;
            // if estimate AutoPayLink is Enable send payment link
            if (this.estimateService.estimateAutoPayLinkEnable) {
              this.invClicked()
            }
            if (this.commonService.superUserData.estimateNoLast) {
              docNum = this.commonService.superUserData.estimateNoLast;
            }
            // update the last doc num in superauserdetails
            this.estimateService.updateDocNo(this.estimateService.superUserId, {
              estimateNoLast: docNum + 1,
            }).then((reslt) => {
              // create share doc used for preview
              this
                .estimateService.createSharedDoc(this.estimateService.superUserId, result.id, this.estimateService.estimate.docData.docType)
                .then((res) => {
                  // update share doc id in document
                  this
                    .estimateService.UpdateshareDocumentId(
                      this.estimateService.superUserId,
                      result.id,
                      this.estimateService.estimate.docData.docType,
                      res.id
                    ).then((reslt) => {
                      this._snackBar.open('Successfully Created', ' ', {
                        duration: 2000,
                      });
                      dialogRef.close()
                      this.router.navigate([
                        '/dash/document/Estimate/',
                        this.estimateService.docID
                      ]);
                    })
                })
            })
          })
        }
        else {
          const dialogRefEdit = this.dialog.open(LoadingDialogComponent, {
            width: '250px',
            disableClose: true,
          });

          let newChangeLog = this.changeLog;  
          //get updated values in changelog
          //1
          let billingAmountDetailsFormChanges = ChangeLogComponent.saveLogReactiveForm(
            this.constructor.name,
            this.estimateService.userId,
            this.estimateService.userName,
            this.estimateService.prevBillingAmountDetailsForm,
            this.estimateService.billingAmountDetailsForm,
            newChangeLog,
            {}
          );
          if(billingAmountDetailsFormChanges !== null)
            newChangeLog = billingAmountDetailsFormChanges;
          //2
          let prevItemLength = this.estimateService.prevProductTableForm.get('itemList').value.length;
          let curItemLength = this.estimateService.productTableForm.get('itemList').value.length;
          //remove item if it doesnot have a name. It happens when user clicks add item and delete it without saving 
          for(let i = 0 ; i < Object.values(this.estimateService.addedProducts).length; i++){
            if(this.estimateService.addedProducts[i].item == null)
            delete this.estimateService.addedProducts[i] 
          }
          let additionalData = {
            addedProducts: this.estimateService.addedProducts,
            deletedProducts: this.estimateService.deletedProducts
          };
          let productTableFormChanges = null;
          // if(prevItemLength == curItemLength){
            productTableFormChanges = ChangeLogComponent.saveLogReactiveForm(
              this.constructor.name,
              this.estimateService.userId,
              this.estimateService.userName,
              this.estimateService.prevProductTableForm,
              this.estimateService.productTableForm,
              newChangeLog,
              additionalData
            );
            this.estimateService.addedProducts = {};
            this.estimateService.deletedProducts = {};
          // } 
          if(productTableFormChanges != null)
            newChangeLog = productTableFormChanges;
          //3  
          let billFromFormChanges = ChangeLogComponent.saveLogReactiveForm(
            this.constructor.name,
            this.estimateService.userId,
            this.estimateService.userName,
            this.estimateService.prevBillFromForm,
            this.estimateService.billFromForm,
            newChangeLog,
            {}
          );
          if(billFromFormChanges != null)
            newChangeLog = billFromFormChanges;
          //4
          let signatureAndAdditionalDetailsFormChanges = ChangeLogComponent.saveLogReactiveForm(
            this.constructor.name,
            this.estimateService.userId,
            this.estimateService.userName,
            this.estimateService.prevSignatureAndAdditionalDetailsForm,
            this.estimateService.signatureAndAdditionalDetailsForm,
            newChangeLog,
            {}
          );
          if(signatureAndAdditionalDetailsFormChanges != null)
            newChangeLog = signatureAndAdditionalDetailsFormChanges;
          //5
          let billToFormChanges = ChangeLogComponent.saveLogReactiveForm(
            this.constructor.name,
            this.estimateService.userId,
            this.estimateService.userName,
            this.estimateService.prevBillToForm,
            this.estimateService.billToForm,
            newChangeLog,
            {}
          );
          if(billToFormChanges != null)
            newChangeLog = billToFormChanges;
          //6
          
          let deliverdToFormChanges = ChangeLogComponent.saveLogReactiveForm(
            this.constructor.name,
            this.estimateService.userId,
            this.estimateService.userName,
            this.estimateService.prevDeliverdToForm,
            this.estimateService.deliverdToForm,
            newChangeLog,
            {}
          );
          if(deliverdToFormChanges != null)
           newChangeLog = deliverdToFormChanges;
          //7
          let docDetailsFormChanges = ChangeLogComponent.saveLogReactiveForm(
            this.constructor.name,
            this.estimateService.userId,
            this.estimateService.userName,
            this.estimateService.prevDocDetailsForm,
            this.estimateService.docDetailsForm,
            newChangeLog,
            {}
          );
          if(docDetailsFormChanges != null)
            newChangeLog = docDetailsFormChanges;
          //8
          let additionalFieldFormChanges = ChangeLogComponent.saveLogReactiveForm(
            this.constructor.name,
            this.estimateService.userId,
            this.estimateService.userName,
            this.estimateService.prevAdditionalFieldForm,
            this.estimateService.additionalFieldForm,
            newChangeLog,
            {}
          );
          if(additionalFieldFormChanges != null)
            newChangeLog = additionalFieldFormChanges;
                    
          
          // update document
          this.estimateService.editDocument(newChangeLog).then((result) => {
            dialogRefEdit.close()
            this._snackBar.open('Successfully Updated', '', {
              duration: 2000,
            });
            this.router.navigate([
              '/dash/document/Estimate/',
              this.estimateService.docID
            ]);
          })
        }
      }
    }
  }

  invClicked() {


    if (this.estimateService.rzrAccountId || this.estimateService.stripeAccountId) {
      this.
        estimateService.getCustdetails(this.estimateService.superUserId, this.estimateService.custID)
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
    if (this.estimateService.rzrAccountId && !this.estimateService.payLinkMode) {
      if (this.estimateService.estimate.docData.currency == 'INR') {
        var basicunit = Currencies.getCurencies().filter(
          (cur) => cur.isoCode == this.estimateService.estimate.docData.currency
        )[0].basicUnit;
        var dat = {
          amount: this.estimateService.estimate.docData.totalInclTax * basicunit,
          name: this.estimateService.estimate.customerData.fname1 + ' ' + this.estimateService.estimate.customerData.sname,
          contact: contactNo,
          email: email,
          currency: this.estimateService.estimate.docData.currency,
          account_id: this.estimateService.rzrAccountId,
        };
        this.estimateService.rzrserv.makepaylink(dat).subscribe(
          (res: any) => {
            this.estimateService.sendEmail({
              to: email,
              template: {
                name: 'payLink',
                data: {
                  userName: this.estimateService.estimate.userData.companyName
                    ? this.estimateService.estimate.userData.companyName
                    : this.estimateService.estimate.userData.contactname,
                  customerName:
                    this.estimateService.estimate.customerData.fname1 + ' ' + this.estimateService.estimate.customerData.sname,
                  paymentLink: res.short_url,
                },
              },
            });
            this
              .estimateService.savepaymentLink(
                {
                  ...res,
                  paidFlag: false,
                  userId: this.estimateService.userId,
                  superUserId: this.estimateService.superUserId,
                  docNo: this.estimateService.docID,
                  customerId: this.estimateService.estimate.customerData.custID,
                  saleId: this.estimateService.estimate.docData.saleID,
                  saleTitle: this.estimateService.estimate.docData.saleTitle,
                  companyName: this.estimateService.estimate.customerData.companyName,
                  customerName:
                    this.estimateService.estimate.customerData.fname1 +
                    (this.estimateService.estimate.customerData.sname ? this.estimateService.estimate.customerData.sname : ''),
                },
                res.id
              )
              .then((data) => {
                this
                  .estimateService.updateDocafterLinkcreation(this.estimateService.userId, this.estimateService.docID, res, this.estimateService.docType)
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
    else if (this.estimateService.rzrAccountId && this.estimateService.payLinkMode == "RazorpayPartner") {
      var basicunit = Currencies.getCurencies().filter(
        (cur) => cur.isoCode == this.estimateService.estimate.docData.currency
      )[0].basicUnit;
      var dat = {
        amount: this.estimateService.estimate.docData.totalInclTax * basicunit,
        name: this.estimateService.estimate.customerData.fname1 + ' ' + this.estimateService.estimate.customerData.sname,
        contact: contactNo,
        email: email,
        currency: this.estimateService.estimate.docData.currency,
        account_id: this.estimateService.rzrAccountId,
      };
      this.estimateService.rzrserv.makepaylinkSubMerchant(dat).subscribe(
        (res: any) => {
          if (res.short_url) {
            var urlobj = { short_url: res.short_url }
            this.estimateService.paymentLink = urlobj
            this.estimateService.sendEmail({
              to: email,
              template: {
                name: 'Paylink',
                data: {
                  userName: this.estimateService.estimate.userData.companyName
                    ? this.estimateService.estimate.userData.companyName
                    : this.estimateService.estimate.userData.contactname,
                  customerName:
                    this.estimateService.estimate.customerData.fname1 + ' ' + this.estimateService.estimate.customerData.sname,
                  paymentLink: res.short_url,
                },
              },
            });
            const paymentLinkData = {
              ...res,
              paidFlag: false,
              userId: this.estimateService.userId,
              superUserId: this.estimateService.superUserId,
              docNo: this.estimateService.docID,
              customerId: this.estimateService.estimate.customerData.custID,
              saleId: this.estimateService.estimate.docData.saleID,
              saleTitle: this.estimateService.estimate.docData.saleTitle,
              companyName: this.estimateService.estimate.customerData.companyName,
              customerName: this.estimateService.estimate.customerData.fname1,
              customerSecondName: (this.estimateService.estimate.customerData.sname ? this.estimateService.estimate.customerData.sname : ''),
              type: this.estimateService.docType
            }
            if (this.estimateService.estimate.docData.prefixAndDocNumber) {
              paymentLinkData.docprefixAndDocNumber = this.estimateService.estimate.docData.prefixAndDocNumber
            }
            this
              .estimateService.savepaymentLink(
                paymentLinkData,
                res.id
              )
              .then((data) => {
                this
                  .estimateService.updateDocafterLinkcreation(this.estimateService.userId, this.estimateService.docID, res, this.estimateService.docType)
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
    else if (this.estimateService.stripeAccountId && this.estimateService.payLinkMode == "StripeConnect") {
      this.estimateService.makeShortUrl(this.estimateService.superUserId, this.estimateService.docID, this.estimateService.docType).then(data => {
        this.estimateService.getShortUrl(this.estimateService.superUserId, this.estimateService.docID, this.estimateService.docType).subscribe((data: any) => {
          if (!!data.shortUrl) {
            var urlobj = { short_url: data.shortUrl, }
            this.estimateService.paymentLink = urlobj
            this.estimateService.sendEmail({
              to: email,
              template: {
                name: 'Paylink',
                data: {
                  userName: this.estimateService.estimate.userData.companyName
                    ? this.estimateService.estimate.userData.companyName
                    : this.estimateService.estimate.userData.contactname,
                  customerName:
                    this.estimateService.estimate.customerData.fname1 + ' ' + this.estimateService.estimate.customerData.sname,
                  paymentLink: data.shortUrl,
                },
              },
            });
            this
              .estimateService.updateDocafterLinkcreation(this.estimateService.userId, this.estimateService.docID, { short_url: data.shortUrl }, this.estimateService.docType)
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
