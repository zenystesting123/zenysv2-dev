/*---------------------------------------------------
Description : used for mobile view document setting popup for document creation 
              Used in both free tool and main tool mobile view
Input : Document Data
Output: Document Data
------------------------------------------------------------------------- */
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { Currencies, Currency } from 'src/app/currencies';
import { DocData } from 'src/app/data-models';
@Component({
  selector: 'app-doc-settings-bottom-sheet',
  templateUrl: './doc-settings-bottom-sheet.component.html',
  styleUrls: ['./doc-settings-bottom-sheet.component.scss'],
})
export class DocSettingsBottomSheetComponent implements OnInit {
  docData: DocData; // stores the inut
  currencyList: Currency[] = []; // stores currency list
  // add a temporary field for document data storage so that the changed data will not reflect to parent component until submit is clicked
  currencyTemp: string; //for currency
  includeUnitTemp: boolean;// for include unit checkbox
  includeDiscountTemp: boolean;;// for discount unit checkbox
  includeTaxTemp: boolean;;// for include tax checkbox
  taxTypeTemp: string; // for tax type selection
  interStateTemp: boolean; // for inter state checkbox
  includeCessTemp: boolean; // for include cess checkbox
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<DocSettingsBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data
  ) {
    this.currencyList = Currencies.getCurencies(); // get all currencyfor currency selection 
    this.docData = data.docData; // bind doc data input
    this.currencyTemp = this.docData.currency; // stores currency to temp field
    this.includeUnitTemp = this.docData.includeUnit; // stores includeUnit to temp field
    this.includeDiscountTemp = this.docData.includeDiscount; // stores includeDiscount to temp field
    this.includeTaxTemp = this.docData.includeTax; // stores includeTax to temp field
    this.taxTypeTemp = this.docData.taxType; // stores taxType to temp field
    this.interStateTemp = this.docData.interState; // stores interState to temp field
    this.includeCessTemp = this.docData.includeCess; // stores includeCess to temp field
  }

  ngOnInit(): void {}
  closeComponentSheetMenu() { // on close bottom sheet
    this._bottomSheetRef.dismiss();
  }
  onVat() {// on select vat uncheck include cess and inter starte
    this.docData.includeCess = false; 
    this.docData.interState = false;
  }
  // on submit clicked
  onSubmit() {
    // bind temp variables to daoc data
    this.docData.currency = this.currencyTemp;
    this.docData.includeUnit = this.includeUnitTemp;
    this.docData.includeDiscount = this.includeDiscountTemp;
    this.docData.includeTax = this.includeTaxTemp;
    this.docData.taxType = this.taxTypeTemp;
    this.docData.interState = this.interStateTemp;
    this.docData.includeCess = this.includeCessTemp;
    this._bottomSheetRef.dismiss();//close bottom sheet
  }
}
