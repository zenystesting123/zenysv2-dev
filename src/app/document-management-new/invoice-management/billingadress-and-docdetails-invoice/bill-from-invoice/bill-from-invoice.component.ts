/*------------------------------------------------
Description : For handle bill form display
Input: superUserDetails,userData
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Profile } from 'src/app/data-models';
import { userData } from '../../invoice.model';
import { InvoicesService } from '../../invoices.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
@Component({
  selector: 'app-bill-from-invoice',
  templateUrl: './bill-from-invoice.component.html',
  styleUrls: ['./bill-from-invoice.component.scss']
})
export class BillFromInvoiceComponent implements OnInit {
   //here userdetails are taken via input because while editing the doc it will not change the userdetails if other user edit the any other field under user collection
  @Input() superUserDetails: Profile;
  @Input() userData: userData;
  constructor(private invoicesService: InvoicesService) {}
  get form(): FormGroup {
    return this.invoicesService.billFromForm;
  }
  ngOnInit(): void {
    if (this.invoicesService.scenario == 'create') {
      // get contact name if it is set in invoiceContactDetails else take user name
      let contactName
      if (this.superUserDetails.invoiceContactDetails?.contactName) {
        contactName = this.superUserDetails.invoiceContactDetails?.contactName
      } else {
        contactName = (this.superUserDetails.firstname ? this.superUserDetails.firstname : '') + (this.superUserDetails.lastname ? ' ' + this.superUserDetails.lastname : '');
      }
      this.form.patchValue({
        showLogo: this.superUserDetails.logoStatus? this.superUserDetails.logoStatus : false,// for display logo
        billFromCompanyName: this.superUserDetails.company ? this.superUserDetails.company : null,
        billFromContactname: contactName,
        billFromAddressline1: this.superUserDetails.street1? this.superUserDetails.street1 : null,
        billFromAddressline2: this.superUserDetails.street2? this.superUserDetails.street2 : null,
        billFromCity: this.superUserDetails.city? this.superUserDetails.city : null,
        billFromPinCode: this.superUserDetails.pincode? this.superUserDetails.pincode : null,
        billFromState: this.superUserDetails.state? this.superUserDetails.state : null,
        billFromCountry: this.superUserDetails.country? this.superUserDetails.country : null,
        billFromGst: this.superUserDetails.gstnumber? this.superUserDetails.gstnumber : null,
      })
    } else {
      if (this.invoicesService.scenario == 'edit') {
        //in edit scenario bind all details to the array which is used for saving and in the form
        this.invoicesService.invoice.userData.addressline1 = this.userData?.addressline1,
        this.invoicesService.invoice.userData.addressline2 = this.userData?.addressline2,
        this.invoicesService.invoice.userData.city = this.userData?.city,
        this.invoicesService.invoice.userData.companyName = this.userData?.companyName,
        this.invoicesService.invoice.userData.contactname = this.userData?.contactname,
        this.invoicesService.invoice.userData.country = this.userData?.country,
        this.invoicesService.invoice.userData.gst = this.userData?.gst,
        this.invoicesService.invoice.userData.pinCode = this.userData?.pinCode,
        this.invoicesService.invoice.userData.state = this.userData?.state,
        this.form.patchValue({
          showLogo: this.superUserDetails.logoStatus,
          billFromAddressline1: this.userData?.addressline1,
          billFromAddressline2: this.userData?.addressline2,
          billFromCity: this.userData?.city,
          billFromCompanyName: this.userData?.companyName,
          billFromContactname: this.userData?.contactname,
          billFromCountry: this.userData?.country,
          billFromGst: this.userData?.gst,
          billFromPinCode: this.userData?.pinCode,
          billFromState: this.userData?.state,
        })
                          
      }else{
        // get contact name if it is set in invoiceContactDetails else take user name saved in quo/est
        let contactName
        if (this.superUserDetails.invoiceContactDetails?.contactName) {
          contactName = this.superUserDetails.invoiceContactDetails?.contactName
        } else {
          contactName = this.userData?.contactname
        }
        this.invoicesService.invoice.userData.addressline1 = this.userData?.addressline1,
        this.invoicesService.invoice.userData.addressline2 = this.userData?.addressline2,
        this.invoicesService.invoice.userData.city = this.userData?.city,
        this.invoicesService.invoice.userData.companyName = this.userData?.companyName,
        this.invoicesService.invoice.userData.contactname = contactName,
        this.invoicesService.invoice.userData.country = this.userData?.country,
        this.invoicesService.invoice.userData.gst = this.userData?.gst,
        this.invoicesService.invoice.userData.pinCode = this.userData?.pinCode,
        this.invoicesService.invoice.userData.state = this.userData?.state,
        this.form.patchValue({
          showLogo: this.superUserDetails.logoStatus,
          billFromAddressline1: this.userData?.addressline1,
          billFromAddressline2: this.userData?.addressline2,
          billFromCity: this.userData?.city,
          billFromCompanyName: this.userData?.companyName,
          billFromContactname: contactName,
          billFromCountry: this.userData?.country,
          billFromGst: this.userData?.gst,
          billFromPinCode: this.userData?.pinCode,
          billFromState: this.userData?.state,
        })
      }
      //get form values before change
      this.invoicesService.prevBillFromForm = ChangeLogComponent.cloneAbstractControl(this.form);
    }
  }
   // on bill from name changes contact name on footer also changes
  onContactNameChange() {
    this.invoicesService.signatureAndAdditionalDetailsForm.patchValue({ signatoryContactname: this.invoicesService.billFromForm.value.billFromContactname })
    this.invoicesService.signatureAndAdditionalDetailsForm.get('signatoryContactname').markAsDirty();
  }
}
