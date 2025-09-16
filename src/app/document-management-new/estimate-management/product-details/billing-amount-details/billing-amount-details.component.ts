/*------------------------------------------------
Description : For handle table configuraton display
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Currencies, Currency } from 'src/app/currencies';
import { Profile } from 'src/app/data-models';
import { DocumentData } from '../../estimate.model';
import { EstimateService } from '../../estimate.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';

@Component({
  selector: 'app-billing-amount-details',
  templateUrl: './billing-amount-details.component.html',
  styleUrls: ['./billing-amount-details.component.scss']
})
export class BillingAmountDetailsComponent implements OnInit {
  @Input() superUserDetails: Profile
  @Input() docData: DocumentData
  currencyList: Currency[] = Currencies.getCurencies(); // get currency list;
  constructor(public estimateService: EstimateService, public formBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (this.estimateService.scenario == 'create') {
      // get default details from super user
      this.form.patchValue({
        currency: this.superUserDetails.currency,
        taxType: this.superUserDetails.taxType ? this.superUserDetails.taxType : 'gst',
      })
    }
    if (this.estimateService.scenario == 'edit') {
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
      //get form values before change
      this.estimateService.prevBillingAmountDetailsForm = ChangeLogComponent.cloneAbstractControl(this.form);
    }
    //get all binded data from ui and update the item summary and update the doc  used for saving
    this.estimateService.getDataFromUI()
  }
  get form(): FormGroup {
    return this.estimateService.billingAmountDetailsForm;
  }
  //used update the item summary and update the doc  used for saving
  onTaxTypeChange() {
    this.estimateService.getDataFromUI();
  }
  onCurrencyChange() {
    this.estimateService.getDataFromUI()
  }
  onUnitChange() {
    this.estimateService.getDataFromUI()
  }
  onTaxChange() {
    this.estimateService.getDataFromUI()
  }
  onDiscountChange() {
    this.estimateService.getDataFromUI()
  }
  onIgstChange() {
    this.estimateService.getDataFromUI()
  }
  onCessChange() {
    this.estimateService.getDataFromUI()
  }
}
