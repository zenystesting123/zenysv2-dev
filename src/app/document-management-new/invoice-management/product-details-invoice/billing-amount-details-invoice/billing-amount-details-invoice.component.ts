/*------------------------------------------------
Description : For handle table configuraton display
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Currencies, Currency } from 'src/app/currencies';
import { Profile } from 'src/app/data-models';
import { DocumentData } from '../../invoice.model';
import { InvoicesService } from '../../invoices.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
@Component({
  selector: 'app-billing-amount-details-invoice',
  templateUrl: './billing-amount-details-invoice.component.html',
  styleUrls: ['./billing-amount-details-invoice.component.scss']
})
export class BillingAmountDetailsInvoiceComponent implements OnInit {

  @Input() superUserDetails: Profile
  @Input() docData: DocumentData
  currencyList: Currency[] = Currencies.getCurencies(); // get currency list;
  constructor(public invoicesService: InvoicesService, public formBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (this.invoicesService.scenario == 'create') {
      // get default details from super user
      this.form.patchValue({
        currency: this.superUserDetails.currency,
        taxType: this.superUserDetails.taxType ? this.superUserDetails.taxType : 'gst',
      })
    }
    if (this.invoicesService.scenario == 'edit' || this.invoicesService.scenario == 'invfromquote' || this.invoicesService.scenario == 'invfromest') {
      // bind all details from readed doc
      this.form.patchValue({
        currency: this.docData.currency,
        includeUnit: this.docData.includeUnit,
        includeTax: this.docData.includeTax,
        includeDiscount: this.docData.includeDiscount,
        taxType: this.docData.taxType,
        interState: this.docData.interState,
        includeCess: this.docData.includeCess,
        showTaxtype: this.docData.includeTax == true,
        showCess: (this.docData.includeTax == true && this.docData.taxType == 'gst'),
        showIgst: (this.docData.includeTax == true && this.docData.taxType == 'gst'),
      })
    }
    //get all binded data from ui and update the item summary and update the doc  used for saving
    this.invoicesService.getDataFromUI()
    //get form values before change
    this.invoicesService.prevBillingAmountDetailsForm = ChangeLogComponent.cloneAbstractControl(this.form);
  }

  get form(): FormGroup {
    return this.invoicesService.billingAmountDetailsForm;
  }
  //used update the item summary and update the doc  used for saving
  onTaxTypeChange() {
    this.invoicesService.getDataFromUI();
  }
  onCurrencyChange() {
    this.invoicesService.getDataFromUI()
  }
  onUnitChange() {
    this.invoicesService.getDataFromUI()
  }
  onTaxChange() {
    this.invoicesService.getDataFromUI()
  }
  onDiscountChange() {
    this.invoicesService.getDataFromUI()
  }
  onIgstChange() {
    this.invoicesService.getDataFromUI()
  }
  onCessChange() {
    this.invoicesService.getDataFromUI()
  }
}
