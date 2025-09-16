/*--------------------------------
Description : Read the doc details and based on the preview show the selected preview
-------------------------------- */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { PreviewService } from './preview.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {
  userDetailsSubscription: Subscription;
  docDetailsSubscription: Subscription;
  privewTemplateSelected:string='template1'
  constructor(public previewService: PreviewService, public networkCheck: NetworkCheckService,
    private route: ActivatedRoute, private _snackBar: MatSnackBar,
    public commonService: CommonService) {
    route.params.subscribe((val) => {
      this.previewService.getUrlInfo(val)
    })
  }

  ngOnInit(): void {
    this.userDetailsSubscription = this.commonService.userDatas
      .subscribe((allData) => {
        if (allData) {
          this.previewService.superUserId = allData.userDetails.superUserId
          this.previewService.userId = allData.userId
          this.previewService.fieldNameEstimate = allData.superUserDetails.fieldNames?.fieldNameEstimate ? allData.superUserDetails.fieldNames?.fieldNameEstimate : 'Estimate'
          this.previewService.fieldNameQuotation = allData.superUserDetails.fieldNames?.fieldNameQuotation ? allData.superUserDetails.fieldNames?.fieldNameQuotation : 'Quotation'
          this.previewService.rzrAccountId = allData.superUserDetails?.rzrAccountId;
          this.previewService.stripeAccountId = allData.superUserDetails?.stripeAccountId;
          this.previewService.payLinkMode=allData.superUserDetails?.payLinkMode
          this.privewTemplateSelected=allData.superUserDetails.printTemplate
          //check access rule to block document edit,dowload and view
          if (allData.usrProfileData) {
            if (this.previewService.docType == 'Estimate') {
              if (allData.usrProfileData.isCheckedSalesEst == false) {
                this.previewService.disableDocView = true;
                this.previewService.disableDocEdit = true;
                this.previewService.disableDocDownload = true;
              } else {
                if (allData.usrProfileData.salesDViewEst == false) {
                  this.previewService.disableDocView = true;
                }
                if (allData.usrProfileData.salesDEditEst == false) {
                  this.previewService.disableDocEdit = true;
                }
                if (allData.usrProfileData.estDownload == false) {
                  this.previewService.disableDocDownload = true;
                }
              }
            }
            else if (this.previewService.docType == 'Quotation') {
              if (allData.usrProfileData.isCheckedSalesQuot == false) {
                this.previewService.disableDocView = true;
                this.previewService.disableDocEdit = true;
                this.previewService.disableDocDownload = true;
              } else {
                if (allData.usrProfileData.salesDViewQuot == false) {
                  this.previewService.disableDocView = true;
                }
                if (allData.usrProfileData.salesDEditQuot == false) {
                  this.previewService.disableDocEdit = true;
                }
                if (allData.usrProfileData.quotDownload == false) {
                  this.previewService.disableDocDownload = true;
                }
              }
            }
            else {
              if (allData.usrProfileData.isCheckedSalesInv == false) {
                this.previewService.disableDocView = true;
                this.previewService.disableDocEdit = true;
                this.previewService.disableDocDownload = true;
              } else {
                if (allData.usrProfileData.salesDViewInv == false) {
                  this.previewService.disableDocView = true;
                }
                if (allData.usrProfileData.salesDEditInv == false) {
                  this.previewService.disableDocEdit = true;
                }
                if (allData.usrProfileData.invDownload == false) {
                  this.previewService.disableDocDownload = true;
                }
              }
            }
          }
          if (!this.previewService.disableDocView) {
            if (this.previewService.docID) {
              if (this.previewService.docType == 'Estimate') {
                this.docDetailsSubscription = this.previewService
                  .getDocumentEstimateDetails(this.previewService.superUserId, this.previewService.docID)
                  .subscribe((data) => {
                    this.previewService.updateData(allData, data)
                  })
              }
              else if (this.previewService.docType == 'Quotation') {
                this.docDetailsSubscription = this.previewService
                  .getDocumentQuotationDetails(this.previewService.superUserId, this.previewService.docID)
                  .subscribe((data) => {
                    this.previewService.updateData(allData, data)
                  })
              }
              else if (this.previewService.docType == 'Invoice') {
                this.docDetailsSubscription = this.previewService
                  .getDocumentInvoiceDetails(this.previewService.superUserId, this.previewService.docID)
                  .subscribe((data) => {
                    this.previewService.updateData(allData, data)
                  })
              } else { }
            }
          }else{
            this.previewService.previewLoaded=true;
          }
        }
      })
  }
  ngOnDestroy(): void {
    this.userDetailsSubscription?.unsubscribe();
    this.docDetailsSubscription?.unsubscribe();
    this.previewService.previewLoaded = false;
    this.previewService.docData = {
      bankDetails: '',
      cancel: false,
      cessValue: 0,
      cgstValue: 0,
      createdDate: 0,
      currency: '',
      discountValue: 0,
      discountedAmount: 0,
      docDate: null,
      docNumber: '',
      docPrefix: '',
      docTitle: '',
      docType: '',
      docValidity: null,
      dueDate:null,
      igstValue: 0,
      includeCess: false,
      includeDiscount: false,
      includeTax: false,
      includeUnit: false,
      interState: false,
      notes: '',
      prefixAndDocNumber: '',
      saleAssignedToOwner: '',
      saleID: '',
      saleTitle: '',
      sgstValue: 0,
      statusApproved: false,
      taxType: '',
      total: 0,
      totalInclTax: 0,
      vatValue: 0,
      estRef: null,
      quoteRef: null,
      gstPlaceOfSupplyCode: null,
      gstStateCode: null,
      poRef: null,
      paymentTerm: null
    };
    this.previewService.itemList = []
    this.previewService.customerData = {
      addressline1: '',
      addressline2: '',
      companyName: '',
      contactNumber: '',
      country: '',
      countryCode: '',
      custID: '',
      contactAssignedToOwner: '',
      orgID: '',
      district: '',
      email: '',
      fname1: '',
      gst: '',
      isDeliveryAddressPresent: false,
      pinCode: '',
      sname: '',
      state: '',
      surname: '',
      deliveryAddressline1: '',
      deliveryAddressline2: '',
      deliveryContactName: '',
      deliveryContactNumber: '',
      deliverycountryCode:'',
      deliveryCountry: '',
      deliveryDistrict: '',
      deliveryPinCode: '',
      deliveryState: '',
      deliveryCompanyName:'',
      deliveryEmail:''
    };
    this.previewService.toolbar = {
      documentTypeFeildName: null,
      prefixAndDocNumber: null,
      fieldNameQuotation: null,
      fieldNameInvoice: null,
      statusApproved: false,
      createQuotation: false,
      createInvoice: false,
      sendPaymentLink: false,
      shareDocument: false,
      shared: false,
      cancelStatus: false,
      disableDownload: false,
      disablCreateQuo: false,
      disableCreateInvoice: false,
      disableEdit: false,
      disableSendPaymentLink: false,
      disableShareDocument: false,
      disableShared: false,
      disableCancelStatus: false,
    }
    this.previewService.filteredAdditionalField = [];
    this.previewService.additionalFields = [];
    this.previewService.disableDocView = false;
    this.previewService.disableDocEdit = false;
    this.previewService.disableViewContact = false;
    this.previewService.disableViewOrg = false;
    this.previewService.disableDocDownload=false;
  }
}
