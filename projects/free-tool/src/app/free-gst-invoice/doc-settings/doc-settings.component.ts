import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ErrorStateMatcher } from '@angular/material/core';
import { DocSettingsService } from './doc-settings.service';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-doc-settings',
  templateUrl: './doc-settings.component.html',
  styleUrls: ['./doc-settings.component.scss']
})
export class DocSettingsComponent implements OnInit {
  docData:any
  customerData:any
  userData:any
  dbUserData:any
  scenario:string
  yourcompanynameTemp:string
  youraddresslineTemp:string
  yourgstTemp:string

  billcompanynameTemp:string
  billaddresslineTemp:string
  billgstTemp:string
  deliveredtoTemp:string
  deltoTemp:string

  contactnameTemp:string
  contactnoTemp:string
  emailTemp:string

  currencyTemp:string;
  includeunitTemp:string;
  includeTaxTemp:boolean;
  taxTypeTemp:boolean;
  interstateTemp:boolean;
  includecessTemp:boolean;
  includeDiscountTemp:string;
  constructor(private _bottomSheetRef: MatBottomSheetRef<DocSettingsComponent>,public docSettingsService:DocSettingsService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data) { 
     

      this.docData=data.docData;
      this.customerData=data.customerData;
      this.userData=data.userData;
      this.dbUserData=data.dbUserData;
      this.scenario=data.scenario;
      this.yourcompanynameTemp=data.userData.yourcompanyname;
      this.youraddresslineTemp=data.userData.youraddressline;
      this.yourgstTemp=data.userData.yourgst;

      this.billcompanynameTemp=data.customerData.billcompanyname;
      this.billaddresslineTemp=data.customerData.billaddressline;
      this.billgstTemp=data.customerData.billgst;
      this.deltoTemp=data.customerData.delto;
      this.deliveredtoTemp=data.customerData.deliveredto;

      this.contactnameTemp=data.dbUserData.contactname;
      this.contactnoTemp=data.dbUserData.contactno;
      this.emailTemp=data.dbUserData.email;

      this.currencyTemp=data.docData.currency
      this.includeunitTemp=data.docData.includeunit
      this.includeDiscountTemp=data.docData.includeDiscount;
      this.includeTaxTemp=data.docData.includetax
      this.taxTypeTemp=data.docData.taxType
      this.interstateTemp=data.docData.interstate
      this.includecessTemp=data.docData.includecess
      }

  ngOnInit(): void {
  }
 
  currencyControl = new FormControl('', [
    Validators.required,
  ]);

  submitYourAddress(){
    this.docSettingsService.yourAddressAdded=true;
    this.userData.yourcompanyname=this.yourcompanynameTemp;
    this.userData.youraddressline=this.youraddresslineTemp;
    this.userData.yourgst=this.yourgstTemp;
    this._bottomSheetRef.dismiss();
  }
  submitToAddress(){
    this.docSettingsService.ToAddressAdded=true;
    this.customerData.billcompanyname=this.billcompanynameTemp;
    this.customerData.billaddressline=this.billaddresslineTemp;
    this.customerData.billgst=this.billgstTemp;
    this.customerData.delto=this.deltoTemp;
    this.customerData.deliveredto=this.deliveredtoTemp;
    this._bottomSheetRef.dismiss();
  }
 
  submitContact(){
    this.docSettingsService.contactAdded=true;
    this.dbUserData.contactname=this.contactnameTemp
    this.dbUserData.contactno=this.contactnoTemp
    this.dbUserData.email=this.emailTemp
    this._bottomSheetRef.dismiss();
  }
  submitSetting(){
    this.docData.currency=this.currencyTemp
    this.docData.includeunit=this.includeunitTemp
    this.docData.includeDiscount=this.includeDiscountTemp
    this.docData.includetax=this.includeTaxTemp
    this.docData.taxType=this.taxTypeTemp
    this.docData.interstate=this.interstateTemp
    this.docData.includecess=this.includecessTemp
    this._bottomSheetRef.dismiss();
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onVat() {
    this.includecessTemp = false;
    this.interstateTemp = false;
  }
}
