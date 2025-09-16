import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentManagementNewRoutingModule } from './document-management-new-routing.module';
import { EstimateManagementComponent } from './estimate-management/estimate-management.component';
import { SharedModule } from '../shared/shared.module';
import { ProductDetailsComponent } from './estimate-management/product-details/product-details.component';
import { BillingAmountDetailsComponent } from './estimate-management/product-details/billing-amount-details/billing-amount-details.component';
import { ProductTableComponent } from './estimate-management/product-details/product-table/product-table.component';
import { ProductSummaryComponent } from './estimate-management/product-details/product-summary/product-summary.component';
import { SignatureAndAdditionaldetailsComponent } from './estimate-management/signature-and-additionaldetails/signature-and-additionaldetails.component';
import { BillingaddressAndDocdetailsComponent } from './estimate-management/billingaddress-and-docdetails/billingaddress-and-docdetails.component';
import { BillFromComponent } from './estimate-management/billingaddress-and-docdetails/bill-from/bill-from.component';
import { DocDetailsComponent } from './estimate-management/billingaddress-and-docdetails/doc-details/doc-details.component';
import { DeliveryAddressComponent } from './estimate-management/billingaddress-and-docdetails/delivery-address/delivery-address.component';
import { BillToComponent } from './estimate-management/billingaddress-and-docdetails/bill-to/bill-to.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { AdditionalFieldsComponent } from './estimate-management/billingaddress-and-docdetails/additional-fields/additional-fields.component';
import { SearchPopupComponent } from './search-popup/search-popup.component';
import { PreviewComponent } from './preview/preview.component';
import { ToolBarComponent } from './preview/tool-bar/tool-bar.component';
import { SideBarComponent } from './preview/side-bar/side-bar.component';
import { BillFromPreviewComponent } from './preview/bill-from-preview/bill-from-preview.component';
import { LogoPreviewComponent } from './preview/logo-preview/logo-preview.component';
import { AdditionalFieldPreviewComponent } from './preview/additional-field-preview/additional-field-preview.component';
import { DocDetailPreviewEstimateComponent } from './preview/doc-detail-preview-estimate/doc-detail-preview-estimate.component';
import { BillToPreviewComponent } from './preview/bill-to-preview/bill-to-preview.component';
import { DeliveredToPreviewComponent } from './preview/delivered-to-preview/delivered-to-preview.component';
import { TablePreviewComponent } from './preview/table-preview/table-preview.component';
import { ItemSummaryPreviewComponent } from './preview/item-summary-preview/item-summary-preview.component';
import { UserSignAndDetailsPreviewComponent } from './preview/user-sign-and-details-preview/user-sign-and-details-preview.component';
import { FooterPreviewComponent } from './preview/footer-preview/footer-preview.component';
import { QuotationManagementComponent } from './quotation-management/quotation-management.component';
import { SignatureAndAdditionaldetailsQuoteComponent } from './quotation-management/signature-and-additionaldetails-quote/signature-and-additionaldetails-quote.component';
import { ProductDetailsQuoteComponent } from './quotation-management/product-details-quote/product-details-quote.component';
import { BillingAmountDetailsQuoteComponent } from './quotation-management/product-details-quote/billing-amount-details-quote/billing-amount-details-quote.component';
import { ProductSummaryQuoteComponent } from './quotation-management/product-details-quote/product-summary-quote/product-summary-quote.component';
import { ProductTableQuoteComponent } from './quotation-management/product-details-quote/product-table-quote/product-table-quote.component';
import { BillingadressAndDocdetailsQuoteComponent } from './quotation-management/billingadress-and-docdetails-quote/billingadress-and-docdetails-quote.component';
import { AdditionalFieldsQuoteComponent } from './quotation-management/billingadress-and-docdetails-quote/additional-fields-quote/additional-fields-quote.component';
import { BillFromQuoteComponent } from './quotation-management/billingadress-and-docdetails-quote/bill-from-quote/bill-from-quote.component';
import { BillToQuoteComponent } from './quotation-management/billingadress-and-docdetails-quote/bill-to-quote/bill-to-quote.component';
import { DeliveryAddressQuoteComponent } from './quotation-management/billingadress-and-docdetails-quote/delivery-address-quote/delivery-address-quote.component';
import { InvoiceManagementComponent } from './invoice-management/invoice-management.component';
import { SignatureAndAdditionaldetailsInvoiceComponent } from './invoice-management/signature-and-additionaldetails-invoice/signature-and-additionaldetails-invoice.component';
import { DocDetailsInvoiceComponent } from './invoice-management/billingadress-and-docdetails-invoice/doc-details-invoice/doc-details-invoice.component';
import { DocDetailsQuoteComponent } from './quotation-management/billingadress-and-docdetails-quote/doc-details-quote/doc-details-quote.component';
import { DocDetailsPreviewQuotationComponent } from './preview/doc-details-preview-quotation/doc-details-preview-quotation.component';
import { DocDetailsPreviewInvoiceComponent } from './preview/doc-details-preview-invoice/doc-details-preview-invoice.component';
import { BillingadressAndDocdetailsInvoiceComponent } from './invoice-management/billingadress-and-docdetails-invoice/billingadress-and-docdetails-invoice.component';
import { ProductDetailsInvoiceComponent } from './invoice-management/product-details-invoice/product-details-invoice.component';
import { BillingAmountDetailsInvoiceComponent } from './invoice-management/product-details-invoice/billing-amount-details-invoice/billing-amount-details-invoice.component';
import { BillFromInvoiceComponent } from './invoice-management/billingadress-and-docdetails-invoice/bill-from-invoice/bill-from-invoice.component';
import { BillToInvoiceComponent } from './invoice-management/billingadress-and-docdetails-invoice/bill-to-invoice/bill-to-invoice.component';
import { DeliveryAddressInvoiceComponent } from './invoice-management/billingadress-and-docdetails-invoice/delivery-address-invoice/delivery-address-invoice.component';
import { ProductSummaryInvoiceComponent } from './invoice-management/product-details-invoice/product-summary-invoice/product-summary-invoice.component';
import { ProductTableInvoiceComponent } from './invoice-management/product-details-invoice/product-table-invoice/product-table-invoice.component';
import { AdditionalfieldsInvoiceComponent } from './invoice-management/billingadress-and-docdetails-invoice/additionalfields-invoice/additionalfields-invoice.component';
import { CancelDocumentComponent } from './cancel-document/cancel-document.component';
import { SharedocpopupComponent } from './sharedocpopup/sharedocpopup.component';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { PreviewDoc1Component } from './preview/preview-doc1/preview-doc1.component';
import { PreviewDoc2Component } from './preview/preview-doc2/preview-doc2.component';
import { PreviewDoc3Component } from './preview/preview-doc3/preview-doc3.component';
import { PreviewDoc4Component } from './preview/preview-doc4/preview-doc4.component';
import { PreviewDoc5Component } from './preview/preview-doc5/preview-doc5.component';
import { PreviewDoc6Component } from './preview/preview-doc6/preview-doc6.component';
import { PreviewDoc7Component } from './preview/preview-doc7/preview-doc7.component';
import { PreviewDoc8Component } from './preview/preview-doc8/preview-doc8.component';
import { PreviewDoc9Component } from './preview/preview-doc9/preview-doc9.component';
import { PreviewDoc10Component } from './preview/preview-doc10/preview-doc10.component';
import { DocTitileComponent } from './preview/doc-titile/doc-titile.component';
import { AdditionalNotesComponent } from './preview/additional-notes/additional-notes.component';
import { BankDetailsComponent } from './preview/bank-details/bank-details.component';
import { StatenamePlaceofsupplyComponent } from './preview/statename-placeofsupply/statename-placeofsupply.component';
import { BillFromNameComponent } from './preview/bill-from-name/bill-from-name.component';



@NgModule({
  declarations: [EstimateManagementComponent, BillingAmountDetailsComponent, ProductTableComponent, ProductDetailsComponent
    , ProductSummaryComponent, SignatureAndAdditionaldetailsComponent,
    BillingaddressAndDocdetailsComponent, BillFromComponent, DocDetailsComponent,
    DeliveryAddressComponent, BillToComponent, ProductSearchComponent, AdditionalFieldsComponent,
    SearchPopupComponent, PreviewComponent, ToolBarComponent, SideBarComponent, 
    BillFromPreviewComponent, LogoPreviewComponent, AdditionalFieldPreviewComponent,
    DocDetailPreviewEstimateComponent, BillToPreviewComponent, DeliveredToPreviewComponent, TablePreviewComponent,
    ItemSummaryPreviewComponent, UserSignAndDetailsPreviewComponent, FooterPreviewComponent,
    QuotationManagementComponent,
    SignatureAndAdditionaldetailsQuoteComponent,
    ProductDetailsQuoteComponent,

    BillingAmountDetailsQuoteComponent,

    ProductSummaryQuoteComponent,
    ProductTableQuoteComponent,
    BillingadressAndDocdetailsQuoteComponent,
    AdditionalFieldsQuoteComponent,
    BillFromQuoteComponent,
    BillToQuoteComponent,
    DeliveryAddressQuoteComponent,
    InvoiceManagementComponent,
    SignatureAndAdditionaldetailsInvoiceComponent,
    DocDetailsInvoiceComponent,
    DocDetailsQuoteComponent,
    DocDetailsPreviewQuotationComponent,
    DocDetailsPreviewInvoiceComponent,
    BillingadressAndDocdetailsInvoiceComponent,
    ProductDetailsInvoiceComponent,
    BillingAmountDetailsInvoiceComponent,
    ProductSummaryInvoiceComponent,
    ProductTableInvoiceComponent,
    AdditionalfieldsInvoiceComponent,
    BillFromInvoiceComponent,
    BillToInvoiceComponent,
    DeliveryAddressInvoiceComponent,
    CancelDocumentComponent,
    SharedocpopupComponent,
    LoadingDialogComponent,
    PreviewDoc1Component,
    PreviewDoc2Component,
    PreviewDoc3Component,
    PreviewDoc4Component,
    PreviewDoc5Component,
    PreviewDoc6Component,
    PreviewDoc7Component,
    PreviewDoc8Component,
    PreviewDoc9Component,
    PreviewDoc10Component,
    DocTitileComponent,
    AdditionalNotesComponent,
    BankDetailsComponent,
    StatenamePlaceofsupplyComponent,
    BillFromNameComponent,
  ],
  imports: [
    CommonModule,
    DocumentManagementNewRoutingModule,
    SharedModule
  ],
  exports: [
    BillFromPreviewComponent,
    LogoPreviewComponent,
    AdditionalFieldPreviewComponent,
    DocDetailPreviewEstimateComponent,
    BillToPreviewComponent,
    DeliveredToPreviewComponent,
    TablePreviewComponent,
    ItemSummaryPreviewComponent,
    UserSignAndDetailsPreviewComponent,
    FooterPreviewComponent,
    DocDetailsPreviewQuotationComponent,
    DocDetailsPreviewInvoiceComponent,
    PreviewDoc1Component,
    PreviewDoc2Component,
    PreviewDoc3Component,
    PreviewDoc4Component,
    PreviewDoc5Component,
    PreviewDoc6Component,
    PreviewDoc7Component,
    PreviewDoc8Component,
    PreviewDoc9Component,
    PreviewDoc10Component,
    DocTitileComponent,
    AdditionalNotesComponent,
    BankDetailsComponent,
    StatenamePlaceofsupplyComponent,
    BillFromNameComponent,
    SearchPopupComponent
  ]
})
export class DocumentManagementNewModule { }
