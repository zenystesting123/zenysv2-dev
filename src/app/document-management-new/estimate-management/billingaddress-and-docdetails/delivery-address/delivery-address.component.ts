/*------------------------------------------------
Description : For handle delivery address field display
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getCountryCodes } from 'src/app/countryCode';
import { CustomerData } from '../../estimate.model';
import { EstimateService } from '../../estimate.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';

@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss']
})
export class DeliveryAddressComponent implements OnInit {
  //here customerData are taken via input because any changes are not allowed while editing the doc ...(eg:if customer details edited the bill to part will reset)
  @Input() customerData: CustomerData;
  CountryCodes = getCountryCodes.CountryCodes; //country codes fetch from countrycodes.ts
  constructor(private estimateService: EstimateService) {}
  get form(): FormGroup {
    return this.estimateService.deliverdToForm;
  }
  ngOnInit(): void {
    //bind data to form and doc  in edit 
    if (this.estimateService.scenario == 'edit') {
      this.estimateService.estimate.customerData.isDeliveryAddressPresent = this.customerData.isDeliveryAddressPresent ?this.customerData.isDeliveryAddressPresent:false;
      this.estimateService.estimate.customerData.deliveryContactName = this.customerData.deliveryContactName ?  this.customerData.deliveryContactName:null;
      this.estimateService.estimate.customerData.deliveryCompanyName = this.customerData.deliveryCompanyName ?  this.customerData.deliveryCompanyName:null;
      this.estimateService.estimate.customerData.deliveryEmail = this.customerData.deliveryEmail ?  this.customerData.deliveryEmail:null;
      this.estimateService.estimate.customerData.deliveryAddressline1 = this.customerData.deliveryAddressline1 ? this.customerData.deliveryAddressline1:null;
      this.estimateService.estimate.customerData.deliveryAddressline2 = this.customerData.deliveryAddressline2 ?this.customerData.deliveryAddressline2:null;
      this.estimateService.estimate.customerData.deliveryDistrict = this.customerData.deliveryDistrict ? this.customerData.deliveryDistrict:null;
      this.estimateService.estimate.customerData.deliveryPinCode = this.customerData.deliveryPinCode ? this.customerData.deliveryPinCode:null;
      this.estimateService.estimate.customerData.deliveryState = this.customerData.deliveryState ?  this.customerData.deliveryState:null;
      this.estimateService.estimate.customerData.deliveryCountry = this.customerData.deliveryCountry?  this.customerData.deliveryState:null;
      this.estimateService.estimate.customerData.deliveryContactNumber = this.customerData.deliveryContactNumber?this.customerData.deliveryContactNumber:null
      this.estimateService.estimate.customerData.deliverycountryCode = this.customerData.deliverycountryCode?this.customerData.deliverycountryCode:null
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
     //get form values before change
      this.estimateService.prevDeliverdToForm = ChangeLogComponent.cloneAbstractControl(this.form);
    }
  }
  //clear delivery address 
  clearDeliveryAddress() {
    if(!this.estimateService.deliverdToForm.value.isDeliveryAddressPresent){
      let fieldNameOrganization=this.form.value.fieldNameOrg
      let fieldNameContact=this.form.value.fieldNameContact
      this.estimateService.deliverdToForm.reset()
      this.form.patchValue({ fieldNameOrg: fieldNameOrganization})
      this.form.patchValue({ fieldNameContact: fieldNameContact})
      //marking the isDeliveryAddressPresent control as dirty to get its value in changelog
      this.form.controls.isDeliveryAddressPresent.markAsDirty();
    }
    
  }
  //bind billed to adress to delivery address fields and form
  onCopyBillToAddress(){
    let fname1=this.estimateService.estimate.customerData.fname1?this.estimateService.estimate.customerData.fname1+' ':''
    let sname=this.estimateService.estimate.customerData.sname?this.estimateService.estimate.customerData.sname+' ':''
    let surname=this.estimateService.estimate.customerData.surname?this.estimateService.estimate.customerData.surname:''
    this.form.patchValue({
      deliveryContactName:fname1+sname+surname,
      deliveryCompanyName: this.estimateService.estimate.customerData.companyName?this.estimateService.estimate.customerData.companyName:'',
      deliveryEmail: this.estimateService.estimate.customerData.email?this.estimateService.estimate.customerData.email:'',
      deliveryAddressline1: this.estimateService.estimate.customerData.addressline1 ? this.estimateService.estimate.customerData.addressline1:'',
      deliveryAddressline2: this.estimateService.estimate.customerData.addressline2 ? this.estimateService.estimate.customerData.addressline2:'',
      deliveryDistrict: this.estimateService.estimate.customerData.district ? this.estimateService.estimate.customerData.district:'',
      deliveryPinCode: this.estimateService.estimate.customerData.pinCode ?  this.estimateService.estimate.customerData.pinCode:'',
      deliveryState: this.estimateService.estimate.customerData.state ? this.estimateService.estimate.customerData.state:'',
      deliveryCountry: this.estimateService.estimate.customerData.country ? this.estimateService.estimate.customerData.country :'',
      deliveryContactNumber: this.estimateService.estimate.customerData.contactNumber?this.estimateService.estimate.customerData.contactNumber:'',
      deliverycountryCode: this.estimateService.estimate.customerData.countryCode?this.estimateService.estimate.customerData.countryCode:'',
    })
    this.estimateService.markAllControlsAsDirty([this.form]);
  }
}
