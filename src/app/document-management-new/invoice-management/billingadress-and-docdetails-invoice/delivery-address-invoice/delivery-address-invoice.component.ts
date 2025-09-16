/*------------------------------------------------
Description : For handle delivery address field display
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getCountryCodes } from 'src/app/countryCode';
import { CustomerData } from '../../invoice.model';
import { InvoicesService } from '../../invoices.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
@Component({
  selector: 'app-delivery-address-invoice',
  templateUrl: './delivery-address-invoice.component.html',
  styleUrls: ['./delivery-address-invoice.component.scss']
})
export class DeliveryAddressInvoiceComponent implements OnInit {
  CountryCodes = getCountryCodes.CountryCodes; //country codes fetch from countrycodes.ts
  //here customerData are taken via input because any changes are not allowed while editing the doc ...(eg:if customer details edited the bill to part will reset)
  @Input() customerData: CustomerData;
  constructor(private invoicesService: InvoicesService,) {}
  get form(): FormGroup {
    return this.invoicesService.deliverdToForm;
  }
  ngOnInit(): void {
    //bind data to form and doc  in edit , create invoice from estimate scenario and invoice from quotation scenario
    if (this.invoicesService.scenario != 'create') {
      this.invoicesService.invoice.customerData.isDeliveryAddressPresent = this.customerData.isDeliveryAddressPresent ? this.customerData.isDeliveryAddressPresent : false;
        this.invoicesService.invoice.customerData.deliveryContactName = this.customerData.deliveryContactName ? this.customerData.deliveryContactName : null;
        this.invoicesService.invoice.customerData.deliveryCompanyName = this.customerData.deliveryCompanyName ? this.customerData.deliveryCompanyName : null;
        this.invoicesService.invoice.customerData.deliveryEmail = this.customerData.deliveryEmail ? this.customerData.deliveryEmail : null;
        this.invoicesService.invoice.customerData.deliveryAddressline1 = this.customerData.deliveryAddressline1 ? this.customerData.deliveryAddressline1 : null;
        this.invoicesService.invoice.customerData.deliveryAddressline2 = this.customerData.deliveryAddressline2 ? this.customerData.deliveryAddressline2 : null;
        this.invoicesService.invoice.customerData.deliveryDistrict = this.customerData.deliveryDistrict ? this.customerData.deliveryDistrict : null;
        this.invoicesService.invoice.customerData.deliveryPinCode = this.customerData.deliveryPinCode ? this.customerData.deliveryPinCode : null;
        this.invoicesService.invoice.customerData.deliveryState = this.customerData.deliveryState ? this.customerData.deliveryState : null;
        this.invoicesService.invoice.customerData.deliveryCountry = this.customerData.deliveryCountry ? this.customerData.deliveryState : null;
        this.invoicesService.invoice.customerData.deliveryContactNumber = this.customerData.deliveryContactNumber ? this.customerData.deliveryContactNumber : null
        this.invoicesService.invoice.customerData.deliverycountryCode = this.customerData.deliverycountryCode?this.customerData.deliverycountryCode:null
        this.form.patchValue({
        isDeliveryAddressPresent: this.customerData.isDeliveryAddressPresent ? this.customerData.isDeliveryAddressPresent : false,
        deliveryContactName: this.customerData.deliveryContactName ? this.customerData.deliveryContactName : null,
        deliveryCompanyName: this.customerData.deliveryCompanyName ? this.customerData.deliveryCompanyName : null,
        deliveryEmail: this.customerData.deliveryEmail ? this.customerData.deliveryEmail : null,
        deliveryAddressline1: this.customerData.deliveryAddressline1 ? this.customerData.deliveryAddressline1 : null,
        deliveryAddressline2: this.customerData.deliveryAddressline2 ? this.customerData.deliveryAddressline2 : null,
        deliveryDistrict: this.customerData.deliveryDistrict ? this.customerData.deliveryDistrict : null,
        deliveryPinCode: this.customerData.deliveryPinCode ? this.customerData.deliveryPinCode : null,
        deliveryState: this.customerData.deliveryState ? this.customerData.deliveryState : null,
        deliveryCountry: this.customerData.deliveryCountry ? this.customerData.deliveryCountry : null,
        deliveryContactNumber: this.customerData.deliveryContactNumber ? this.customerData.deliveryContactNumber : null,
        deliverycountryCode: this.customerData.deliverycountryCode ? this.customerData.deliverycountryCode:null
      })
      //get form values before change
      this.invoicesService.prevDeliverdToForm = ChangeLogComponent.cloneAbstractControl(this.form);
    }
  }
  //clear delivery address 
  clearDeliveryAddress() {
    if (!this.invoicesService.deliverdToForm.value.isDeliveryAddressPresent) {
      let fieldNameOrganization=this.form.value.fieldNameOrg
      let fieldNameContact=this.form.value.fieldNameContact
      this.invoicesService.deliverdToForm.reset()
      this.form.patchValue({ fieldNameOrg: fieldNameOrganization})
      this.form.patchValue({ fieldNameContact: fieldNameContact})
      //marking the isDeliveryAddressPresent control as dirty to get its value in changelog
      this.form.controls.isDeliveryAddressPresent.markAsDirty();
    }
  }
  //bind billed to adress to delivery address fields and form
  onCopyBillToAddress(){
    let fname1=this.invoicesService.invoice.customerData.fname1?this.invoicesService.invoice.customerData.fname1+' ':''
    let sname=this.invoicesService.invoice.customerData.sname?this.invoicesService.invoice.customerData.sname+' ':''
    let surname=this.invoicesService.invoice.customerData.surname?this.invoicesService.invoice.customerData.surname:''
    this.form.patchValue({
      deliveryContactName:fname1+sname+surname,
      deliveryCompanyName: this.invoicesService.invoice.customerData.companyName?this.invoicesService.invoice.customerData.companyName:'',
      deliveryEmail: this.invoicesService.invoice.customerData.email?this.invoicesService.invoice.customerData.email:'',
      deliveryAddressline1: this.invoicesService.invoice.customerData.addressline1 ? this.invoicesService.invoice.customerData.addressline1:'',
      deliveryAddressline2: this.invoicesService.invoice.customerData.addressline2 ? this.invoicesService.invoice.customerData.addressline2:'',
      deliveryDistrict: this.invoicesService.invoice.customerData.district ? this.invoicesService.invoice.customerData.district:'',
      deliveryPinCode: this.invoicesService.invoice.customerData.pinCode ?  this.invoicesService.invoice.customerData.pinCode:'',
      deliveryState: this.invoicesService.invoice.customerData.state ? this.invoicesService.invoice.customerData.state:'',
      deliveryCountry: this.invoicesService.invoice.customerData.country ? this.invoicesService.invoice.customerData.country :'',
      deliveryContactNumber: this.invoicesService.invoice.customerData.contactNumber?this.invoicesService.invoice.customerData.contactNumber:'',
      deliverycountryCode: this.invoicesService.invoice.customerData.countryCode?this.invoicesService.invoice.customerData.countryCode:'',
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
