/*------------------------------------------------
Description : For handle signtature and item details display
Input:superUserDetails
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Profile } from 'src/app/data-models';
import { DocumentData, userData } from '../estimate.model';
import { EstimateService } from '../estimate.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';

@Component({
  selector: 'app-signature-and-additionaldetails',
  templateUrl: './signature-and-additionaldetails.component.html',
  styleUrls: ['./signature-and-additionaldetails.component.scss']
})
export class SignatureAndAdditionaldetailsComponent implements OnInit {
  @Input() superUserDetails: Profile
  userData: userData;
  docData: DocumentData;
  constructor(public estimateService: EstimateService) {}
  get form(): FormGroup {
    return this.estimateService.signatureAndAdditionalDetailsForm;
  }
  ngOnInit(): void {
    // take userdata and docdata from service used in edit scenario
    this.userData = this.estimateService.userData
    this.docData = this.estimateService.docData
    if (this.estimateService.scenario == 'create') {
      // bind default details from user in create scenario
      // get contact name... if it is set in estimateContactDetails else take user name... from user profile
      let contactName
      if (this.superUserDetails.estimateContactDetails?.contactName) {
        contactName = this.superUserDetails.estimateContactDetails?.contactName
      } else {
        contactName = (this.superUserDetails.firstname ? this.superUserDetails.firstname : '') + (this.superUserDetails.lastname ? ' ' + this.superUserDetails.lastname : '');
      }
      let contactNumber
      if (this.superUserDetails.estimateContactDetails?.contactNumber) {
        contactNumber = this.superUserDetails.estimateContactDetails?.contactNumber
      } else {
        contactNumber = this.superUserDetails.phone ? this.superUserDetails.phone : null;
      }
      let email
      if (this.superUserDetails.estimateContactDetails?.email) {
        email = this.superUserDetails.estimateContactDetails?.email
      } else {
        email = this.superUserDetails.email ? this.superUserDetails.email : null;
      }
      let signatoryName
      if (this.superUserDetails.estimateContactDetails?.signatoryName) {
        signatoryName = this.superUserDetails.estimateContactDetails?.signatoryName
      } else {
        signatoryName =  (this.superUserDetails.firstname ? this.superUserDetails.firstname : '') + (this.superUserDetails.lastname ? ' ' + this.superUserDetails.lastname : '');
      }
      let designation
      if (this.superUserDetails.estimateContactDetails?.designation) {
        designation = this.superUserDetails.estimateContactDetails?.designation
      } else {
        designation = '';
      }
      this.form.patchValue({
        notes: this.superUserDetails.estimateNote ? this.superUserDetails.estimateNote : null,
        bankDetails: this.superUserDetails.bankDetails ? this.superUserDetails.bankDetails : null,
        showSignature: this.superUserDetails.signStatus ? this.superUserDetails.signStatus : false,
        signatoryName: signatoryName,
        signatoryContactname: contactName,
        signatoryContactno: contactNumber,
        signatoryEmail: email,
        designation:designation,
      })
    }
    else {
      // bind details in edit scenario
      this.estimateService.estimate.docData.notes = this.docData?.notes,
        this.estimateService.estimate.docData.bankDetails = this.docData?.bankDetails,
        this.estimateService.estimate.userData.signatoryName = this.userData?.signatoryName,
        this.estimateService.estimate.userData.contactname = this.userData?.contactname,
        this.estimateService.estimate.userData.contactno = this.userData?.contactno ? this.userData?.contactno : null,
        this.estimateService.estimate.userData.email = this.userData?.email,
        this.estimateService.estimate.userData.designation = this.userData?.designation,
        this.form.patchValue({
          notes: this.docData?.notes,
          bankDetails: this.docData?.bankDetails,
          showSignature: this.superUserDetails.signStatus,
          signatoryName: this.userData?.signatoryName,
          signatoryContactname: this.userData?.contactname,
          signatoryContactno: this.userData?.contactno ? this.userData?.contactno : null,
          signatoryEmail: this.userData?.email,
          designation: this.userData?.designation,
        })
        //get form values before change
        this.estimateService.prevSignatureAndAdditionalDetailsForm = ChangeLogComponent.cloneAbstractControl(this.form);
    }
  }
  // update panel state
  updatePanleState(val: boolean) {
    if (val == true) {
      this.estimateService.updatePanleState(false, false, val)
    }
  }
  // update contact name in bill fromm details also
  onContactNameChange() {
    this.estimateService.billFromForm.patchValue({ billFromContactname: this.estimateService.signatureAndAdditionalDetailsForm.value.contactname })
    this.estimateService.billFromForm.get('billFromContactname').markAsDirty();
  }
}
