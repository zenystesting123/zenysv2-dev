/*--------------------------------------------------------------
Description : Preview the invoice of subscription invoioce added by zenys main account

--------------------------------------------------------------- */

import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Preview1Service } from './preview.service';
import { PreviewService } from 'src/app/document-management-new/preview/preview.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import * as html2pdf from 'html2pdf.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit, OnDestroy {
  userDetailsSubscription: Subscription;
  sharedDocDetailsSubscription: Subscription;
  docDetailsSubscription: Subscription;
  privewTemplateSelected: string = 'template1'
  sharedDocId: string;
  isMobilesize:boolean=false
  mobSizeObserver: Subscription; // observing mobile size
  constructor(
    private location: Location,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public service: Preview1Service,
    public previewService: PreviewService,
    private analytics: AngularFireAnalytics,
    private _snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.mobSizeObserver = breakpointObserver
    .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
    .subscribe((result) => {
      if (result.matches) {
        this.isMobilesize = true;
      } else {
        this.isMobilesize = false;
      }
    });
    route.params.subscribe((val) => {
      //Section 1: Get the information passed on to the module using router link
      this.sharedDocId = this.route.snapshot.paramMap.get('id'); // get doc id
      this.sharedDocDetailsSubscription = this.service
        .getDocument(this.sharedDocId)
        .subscribe((sharedDocData) => {
          this.previewService.docID = sharedDocData.docId;
          this.previewService.docType = sharedDocData.docType;
          this.userDetailsSubscription = this.service.getUser(sharedDocData.userId).subscribe((mainUserDetails) => {
            this.previewService.superUserId = mainUserDetails.superUserId
            this.privewTemplateSelected = mainUserDetails.printTemplate
            this.previewService.fieldNameEstimate = mainUserDetails.fieldNames?.fieldNameEstimate ? mainUserDetails.fieldNames?.fieldNameEstimate : 'Estimate'
            this.previewService.fieldNameQuotation = mainUserDetails.fieldNames?.fieldNameQuotation ? mainUserDetails.fieldNames?.fieldNameQuotation : 'Quotation'
            // get the  document details from main account with documnt id
            this.docDetailsSubscription = this.service.getDocumentDetails(this.previewService.superUserId, this.previewService.docID, this.previewService.docType)
              .subscribe((docdata) => {
                this.previewService.updateDataFromdocViewer(mainUserDetails, docdata)
              });
          });
        });
    });

  }
  ngOnInit(): void {


  }
  onSendEvent() {
    if (this.previewService.docData.docType == 'Estimate') {
      this.analytics.logEvent('btn_dwld_est_web');
    }
    else if (this.previewService.docData.docType == 'Quotation') {
      this.analytics.logEvent('btn_dwld_quote_web');
    }
    else if (this.previewService.docData.docType == 'Invoice') {
      this.analytics.logEvent('btn_dwld_inv_web');
    }
    else {

    }
  }
  // cick back buttn
  onBack() {
    this.location.back();
  }
  ngOnDestroy(): void {
    this.userDetailsSubscription?.unsubscribe();
    this.docDetailsSubscription?.unsubscribe();
    this.sharedDocDetailsSubscription?.unsubscribe();
    this.mobSizeObserver?.unsubscribe();
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
      dueDate: null,
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
      deliverycountryCode: '',
      deliveryCountry: '',
      deliveryDistrict: '',
      deliveryPinCode: '',
      deliveryState: '',
      deliveryCompanyName: '',
      deliveryEmail: ''
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
  }
  downloadAsPdf() {
    var element = document.getElementById('printsection');
    var opt = {
      margin: [5, 0, 5, 0],
      filename:
        this.previewService.docData.docTitle + ' ' + this.previewService.docData.prefixAndDocNumber + '.pdf', // set file name
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, dpi: 96, letterRendering: true, useCORS: true },
      jsPDF: {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16,
      },
    };
    html2pdf().from(element).set(opt).save();
    if (this.previewService.docData.docType == 'Estimate') {
      this.analytics.logEvent('btn_dwld_est_web');
    }
    else if (this.previewService.docData.docType == 'Quotation') {
      this.analytics.logEvent('btn_dwld_quote_web');
    }
    else {
      this.analytics.logEvent('btn_dwld_inv_web');
    }
    this._snackBar.open('Successfully Downloaded', '', {
      duration: 2000,
    });
  }
}
