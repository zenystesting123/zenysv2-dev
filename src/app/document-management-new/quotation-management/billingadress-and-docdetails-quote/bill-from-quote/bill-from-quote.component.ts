/*------------------------------------------------
Description : For handle bill form display
Input: superUserDetails,userData
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Profile } from 'src/app/data-models';
import { userData } from '../../quotation.model';
import { QuotationService } from '../../quotation.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
@Component({
  selector: 'app-bill-from-quote',
  templateUrl: './bill-from-quote.component.html',
  styleUrls: ['./bill-from-quote.component.scss']
})
export class BillFromQuoteComponent implements OnInit {
  //here userdetails are taken via input because while editing the doc it will not change the userdetails if other user edit the any other field under user collection
  @Input() superUserDetails: Profile;
  @Input() userData: userData;
  constructor(private quotationService: QuotationService) {}
  get form(): FormGroup {
    return this.quotationService.billFromForm;
  }
  ngOnInit(): void {
    if (this.quotationService.scenario == 'create') {
      // get contact name if it is set in quotationContactDetails else take user name
      let contactName
      if (this.superUserDetails.quotationContactDetails?.contactName) {
        contactName = this.superUserDetails.quotationContactDetails?.contactName
      } else {
        contactName = (this.superUserDetails.firstname ? this.superUserDetails.firstname : '') + (this.superUserDetails.lastname ? ' ' + this.superUserDetails.lastname : '');
      }
      this.form.patchValue({
        showLogo: this.superUserDetails.logoStatus ? this.superUserDetails.logoStatus : false,// for display logo
        billFromCompanyName: this.superUserDetails.company ? this.superUserDetails.company : null,
        billFromContactname: contactName,
        billFromAddressline1: this.superUserDetails.street1 ? this.superUserDetails.street1 : null,
        billFromAddressline2: this.superUserDetails.street2 ? this.superUserDetails.street2 : null,
        billFromCity: this.superUserDetails.city ? this.superUserDetails.city : null,
        billFromPinCode: this.superUserDetails.pincode ? this.superUserDetails.pincode : null,
        billFromState: this.superUserDetails.state ? this.superUserDetails.state : null,
        billFromCountry: this.superUserDetails.country ? this.superUserDetails.country : null,
        billFromGst: this.superUserDetails.gstnumber ? this.superUserDetails.gstnumber : null,
      })
    } else {
      if (this.quotationService.scenario == 'edit') {
        //in edit scenario bind all details to the array which is used for saving and in the form
        this.quotationService.quotation.userData.addressline1 = this.userData?.addressline1,
          this.quotationService.quotation.userData.addressline2 = this.userData?.addressline2,
          this.quotationService.quotation.userData.city = this.userData?.city,
          this.quotationService.quotation.userData.companyName = this.userData?.companyName,
          this.quotationService.quotation.userData.contactname = this.userData?.contactname,
          this.quotationService.quotation.userData.country = this.userData?.country,
          this.quotationService.quotation.userData.gst = this.userData?.gst,
          this.quotationService.quotation.userData.pinCode = this.userData?.pinCode,
          this.quotationService.quotation.userData.state = this.userData?.state,
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
      } else {
        // get contact name if it is set in quotationContactDetails else take user name saved in estimate
        let contactName
        if (this.superUserDetails.quotationContactDetails?.contactName) {
          contactName = this.superUserDetails.quotationContactDetails?.contactName
        } else {
          contactName = this.userData?.contactname
        }
        //in create quofrom est scenario bind all details to the array which is used for saving and in the form
        this.quotationService.quotation.userData.addressline1 = this.userData?.addressline1,
          this.quotationService.quotation.userData.addressline2 = this.userData?.addressline2,
          this.quotationService.quotation.userData.city = this.userData?.city,
          this.quotationService.quotation.userData.companyName = this.userData?.companyName,
          this.quotationService.quotation.userData.contactname = contactName,
          this.quotationService.quotation.userData.country = this.userData?.country,
          this.quotationService.quotation.userData.gst = this.userData?.gst,
          this.quotationService.quotation.userData.pinCode = this.userData?.pinCode,
          this.quotationService.quotation.userData.state = this.userData?.state,
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
      //get form details before change
      this.quotationService.prevBillFromForm = ChangeLogComponent.cloneAbstractControl(this.form);
    }
  }
  // on bill from name changes contact name on footer also changes
  onContactNameChange() {
    this.quotationService.signatureAndAdditionalDetailsForm.patchValue({ signatoryContactname: this.quotationService.billFromForm.value.billFromContactname })
    this.quotationService.signatureAndAdditionalDetailsForm.get('signatoryContactname').markAsDirty();
  }
}
