/*------------------------------------------------
Description : For handle delivery address field display
Input:customerData
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getCountryCodes } from 'src/app/countryCode';
import { CustomerData } from '../../quotation.model';
import { QuotationService } from '../../quotation.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';

@Component({
  selector: 'app-delivery-address-quote',
  templateUrl: './delivery-address-quote.component.html',
  styleUrls: ['./delivery-address-quote.component.scss']
})
export class DeliveryAddressQuoteComponent implements OnInit {
  CountryCodes = getCountryCodes.CountryCodes; //country codes fetch from countrycodes.ts
  //here customerData are taken via input because any changes are not allowed while editing the doc ...(eg:if customer details edited the bill to part will reset)
  @Input() customerData: CustomerData;
  constructor(private quotationService: QuotationService,) {}
  get form(): FormGroup {
    return this.quotationService.deliverdToForm;
  }
  ngOnInit(): void {
    //bind data to form and doc  in edit and create quotation from estimate scenario
    if (this.quotationService.scenario == 'edit' || this.quotationService.scenario == 'quotefromest' ) {
      this.quotationService.quotation.customerData.isDeliveryAddressPresent = this.customerData.isDeliveryAddressPresent ?this.customerData.isDeliveryAddressPresent:false;
      this.quotationService.quotation.customerData.deliveryContactName = this.customerData.deliveryContactName ?  this.customerData.deliveryContactName:null;
      this.quotationService.quotation.customerData.deliveryCompanyName = this.customerData.deliveryCompanyName ?  this.customerData.deliveryCompanyName:null;
      this.quotationService.quotation.customerData.deliveryEmail = this.customerData.deliveryEmail ?  this.customerData.deliveryEmail:null;
      this.quotationService.quotation.customerData.deliveryAddressline1 = this.customerData.deliveryAddressline1 ? this.customerData.deliveryAddressline1:null;
      this.quotationService.quotation.customerData.deliveryAddressline2 = this.customerData.deliveryAddressline2 ?this.customerData.deliveryAddressline2:null;
      this.quotationService.quotation.customerData.deliveryDistrict = this.customerData.deliveryDistrict ? this.customerData.deliveryDistrict:null;
      this.quotationService.quotation.customerData.deliveryPinCode = this.customerData.deliveryPinCode ? this.customerData.deliveryPinCode:null;
      this.quotationService.quotation.customerData.deliveryState = this.customerData.deliveryState ?  this.customerData.deliveryState:null;
      this.quotationService.quotation.customerData.deliveryCountry = this.customerData.deliveryCountry?  this.customerData.deliveryState:null;
      this.quotationService.quotation.customerData.deliveryContactNumber = this.customerData.deliveryContactNumber?this.customerData.deliveryContactNumber:null;
      this.quotationService.quotation.customerData.deliverycountryCode = this.customerData.deliverycountryCode?this.customerData.deliverycountryCode:null
      this.form.patchValue({
        isDeliveryAddressPresent: this.customerData.isDeliveryAddressPresent ?this.customerData.isDeliveryAddressPresent:false,
        deliveryContactName: this.customerData.deliveryContactName?this.customerData.deliveryContactName:null,
        deliveryCompanyName: this.customerData.deliveryCompanyName?this.customerData.deliveryCompanyName:null,
        deliveryEmail: this.customerData.deliveryEmail?this.customerData.deliveryEmail:null,
        deliveryAddressline1: this.customerData.deliveryAddressline1 ? this.customerData.deliveryAddressline1:null,
        deliveryAddressline2: this.customerData.deliveryAddressline2 ? this.customerData.deliveryAddressline2:null,
        deliveryDistrict: this.customerData.deliveryDistrict ? this.customerData.deliveryDistrict:null,
        deliveryPinCode: this.customerData.deliveryPinCode ?  this.customerData.deliveryPinCode:null,
        deliveryState: this.customerData.deliveryState ? this.customerData.deliveryState:null,
        deliveryCountry: this.customerData.deliveryCountry ? this.customerData.deliveryCountry :null,
        deliveryContactNumber: this.customerData.deliveryContactNumber ? this.customerData.deliveryContactNumber:null,
        deliverycountryCode: this.customerData.deliverycountryCode ? this.customerData.deliverycountryCode:null
      })
      //get form details before change
      this.quotationService.prevDeliverdToForm = ChangeLogComponent.cloneAbstractControl(this.form);
    }
  }
  //clear delivery address 
  clearDeliveryAddress() {
    if(!this.quotationService.deliverdToForm.value.isDeliveryAddressPresent){
      let fieldNameOrganization=this.form.value.fieldNameOrg
      let fieldNameContact=this.form.value.fieldNameContact
      this.quotationService.deliverdToForm.reset()
      this.form.patchValue({ fieldNameOrg: fieldNameOrganization})
      this.form.patchValue({ fieldNameContact: fieldNameContact})
      //marking the isDeliveryAddressPresent control as dirty to get its value in changelog
      this.form.controls.isDeliveryAddressPresent.markAsDirty();
    }
  }
 //bind billed to adress to delivery address fields and form
  onCopyBillToAddress(){
    let fname1=this.quotationService.quotation.customerData.fname1?this.quotationService.quotation.customerData.fname1+' ':''
    let sname=this.quotationService.quotation.customerData.sname?this.quotationService.quotation.customerData.sname+' ':''
    let surname=this.quotationService.quotation.customerData.surname?this.quotationService.quotation.customerData.surname:''
    this.form.patchValue({
      deliveryContactName:fname1+sname+surname,
      deliveryCompanyName: this.quotationService.quotation.customerData.companyName?this.quotationService.quotation.customerData.companyName:'',
      deliveryEmail: this.quotationService.quotation.customerData.email?this.quotationService.quotation.customerData.email:'',
      deliveryAddressline1: this.quotationService.quotation.customerData.addressline1 ? this.quotationService.quotation.customerData.addressline1:'',
      deliveryAddressline2: this.quotationService.quotation.customerData.addressline2 ? this.quotationService.quotation.customerData.addressline2:'',
      deliveryDistrict: this.quotationService.quotation.customerData.district ? this.quotationService.quotation.customerData.district:'',
      deliveryPinCode: this.quotationService.quotation.customerData.pinCode ?  this.quotationService.quotation.customerData.pinCode:'',
      deliveryState: this.quotationService.quotation.customerData.state ? this.quotationService.quotation.customerData.state:'',
      deliveryCountry: this.quotationService.quotation.customerData.country ? this.quotationService.quotation.customerData.country :'',
      deliveryContactNumber: this.quotationService.quotation.customerData.contactNumber?this.quotationService.quotation.customerData.contactNumber:'',
      deliverycountryCode: this.quotationService.quotation.customerData.countryCode?this.quotationService.quotation.customerData.countryCode:'',
    })
    this.form.get('deliveryContactName').markAsDirty();
    this.form.get('deliveryCompanyName').markAsDirty();
    this.form.get('deliveryEmail').markAsDirty();
    this.form.get('deliveryAddressline1').markAsDirty();
    this.form.get('deliveryAddressline2').markAsDirty();
    this.form.get('deliveryDistrict').markAsDirty();
    this.form.get('deliveryPinCode').markAsDirty();
    this.form.get('deliveryState').markAsDirty();
    this.form.get('deliveryCountry').markAsDirty();
    this.form.get('deliveryContactNumber').markAsDirty();
    this.form.get('deliverycountryCode').markAsDirty();
  }
}
