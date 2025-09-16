/*------------------------------------------------
Description : For handle bill form display
Input: superUserDetails,userData
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Profile } from 'src/app/data-models';
import { userData } from '../../estimate.model';
import { EstimateService } from '../../estimate.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';

@Component({
  selector: 'app-bill-from',
  templateUrl: './bill-from.component.html',
  styleUrls: ['./bill-from.component.scss']
})
export class BillFromComponent implements OnInit {
  //here userdetails are taken via input because while editing the doc it will not change the userdetails if other user edit the any other field under user collection
  @Input() superUserDetails: Profile;
  @Input() userData: userData;
  constructor(private estimateService: EstimateService) {}
  get form(): FormGroup {
    return this.estimateService.billFromForm;
  }
  ngOnInit(): void {
    if (this.estimateService.scenario == 'create') {
      // get contact name if it is set in estimateContactDetails else take user name
      let contactName
      if (this.superUserDetails.estimateContactDetails?.contactName) {
        contactName = this.superUserDetails.estimateContactDetails?.contactName
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
      //in edit scenario bind all details to the array which is used for saving and in the form
      this.estimateService.estimate.userData.addressline1 = this.userData?.addressline1,
        this.estimateService.estimate.userData.addressline2 = this.userData?.addressline2,
        this.estimateService.estimate.userData.city = this.userData?.city,
        this.estimateService.estimate.userData.companyName = this.userData?.companyName,
        this.estimateService.estimate.userData.contactname = this.userData?.contactname,
        this.estimateService.estimate.userData.country = this.userData?.country,
        this.estimateService.estimate.userData.gst = this.userData?.gst,
        this.estimateService.estimate.userData.pinCode = this.userData?.pinCode,
        this.estimateService.estimate.userData.state = this.userData?.state,
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
        //get form values before change
        this.estimateService.prevBillFromForm = ChangeLogComponent.cloneAbstractControl(this.form);
    }
  }
  // on bill from name changes contact name on footer also changes
  onContactNameChange() {
    this.estimateService.signatureAndAdditionalDetailsForm.patchValue({ signatoryContactname: this.estimateService.billFromForm.value.billFromContactname })
    this.estimateService.signatureAndAdditionalDetailsForm.get('signatoryContactname').markAsDirty();
  }
}
