/*------------------------------------------------
Description : For handle table configuraton display
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Currencies, Currency } from 'src/app/currencies';
import { Profile } from 'src/app/data-models';
import { DocumentData } from '../../quotation.model';
import { QuotationService } from '../../quotation.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
@Component({
  selector: 'app-billing-amount-details-quote',
  templateUrl: './billing-amount-details-quote.component.html',
  styleUrls: ['./billing-amount-details-quote.component.scss']
})
export class BillingAmountDetailsQuoteComponent implements OnInit {

  @Input() superUserDetails: Profile
  @Input() docData: DocumentData
  currencyList: Currency[] = Currencies.getCurencies(); // get currency list;
  constructor(public quotationService: QuotationService, public formBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (this.quotationService.scenario == 'create') {
      // get default details from super user
      this.form.patchValue({
        currency: this.superUserDetails.currency,
        taxType: this.superUserDetails.taxType ? this.superUserDetails.taxType : 'gst',
      })
    }
   else if (this.quotationService.scenario == 'edit' || this.quotationService.scenario == 'quotefromest') {
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
    this.quotationService.getDataFromUI()
    //get form values before change
    this.quotationService.prevBillingAmountDetailsForm = ChangeLogComponent.cloneAbstractControl(this.form);
  }

  get form(): FormGroup {
    return this.quotationService.billingAmountDetailsForm;
  }
  //used update the item summary and update the doc  used for saving
  onTaxTypeChange() {
    this.quotationService.getDataFromUI();
  }
  onCurrencyChange() {
    this.quotationService.getDataFromUI()
  }
  onUnitChange() {
    this.quotationService.getDataFromUI()
  }
  onTaxChange() {
    this.quotationService.getDataFromUI()
  }
  onDiscountChange() {
    this.quotationService.getDataFromUI()
  }
  onIgstChange() {
    this.quotationService.getDataFromUI()
  }
  onCessChange() {
    this.quotationService.getDataFromUI()
  }
}
