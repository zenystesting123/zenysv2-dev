
/*------------------------------------------------
Description : For handle signtature and item details display
Input:superUserDetails
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Profile } from 'src/app/data-models';
import { DocumentData, userData } from '../quotation.model';
import { QuotationService } from '../quotation.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
@Component({
  selector: 'app-signature-and-additionaldetails-quote',
  templateUrl: './signature-and-additionaldetails-quote.component.html',
  styleUrls: ['./signature-and-additionaldetails-quote.component.scss']
})
export class SignatureAndAdditionaldetailsQuoteComponent implements OnInit {
  @Input() superUserDetails: Profile
  userData: userData;
  docData: DocumentData;
  constructor(public quotationService: QuotationService) {}
  get form(): FormGroup {
    return this.quotationService.signatureAndAdditionalDetailsForm;
  }
  ngOnInit(): void {
    // take userdata and docdata from service used in edit scenario
    this.userData = this.quotationService.userData
    this.docData = this.quotationService.docData
    if (this.quotationService.scenario == 'create') {
      // bind default details from user in create scenario
       // get contact name... if it is set in quotationContactDetails else take user name... from user profile
      let contactName
      if (this.superUserDetails.quotationContactDetails?.contactName) {
        contactName = this.superUserDetails.quotationContactDetails?.contactName
      } else {
        contactName = (this.superUserDetails.firstname ? this.superUserDetails.firstname : '') + (this.superUserDetails.lastname ? ' ' + this.superUserDetails.lastname : '');
      }
      let contactNumber
      if (this.superUserDetails.quotationContactDetails?.contactNumber) {
        contactNumber = this.superUserDetails.quotationContactDetails?.contactNumber
      } else {
        contactNumber = this.superUserDetails.phone ? this.superUserDetails.phone : null;
      }
      let email
      if (this.superUserDetails.quotationContactDetails?.email) {
        email = this.superUserDetails.quotationContactDetails?.email
      } else {
        email = this.superUserDetails.email ? this.superUserDetails.email : null;
      }
      let signatoryName
      if (this.superUserDetails.quotationContactDetails?.signatoryName) {
        signatoryName = this.superUserDetails.quotationContactDetails?.signatoryName
      } else {
        signatoryName = (this.superUserDetails.firstname ? this.superUserDetails.firstname : '') + (this.superUserDetails.lastname ? ' ' + this.superUserDetails.lastname : '');
      }
      let designation
      if (this.superUserDetails.quotationContactDetails?.designation) {
        designation = this.superUserDetails.quotationContactDetails?.designation
      } else {
        designation = '';
      }
      this.form.patchValue({
        notes: this.superUserDetails.quotationNote ? this.superUserDetails.quotationNote : null,
        bankDetails: this.superUserDetails.bankDetails ? this.superUserDetails.bankDetails : null,
        showSignature: this.superUserDetails.signStatus ? this.superUserDetails.signStatus : false,
        signatoryName: signatoryName,
        signatoryContactname: contactName,
        signatoryContactno: contactNumber,
        signatoryEmail: email,
        designation: designation,
      })
    }

    else {
      if (this.quotationService.scenario == 'edit') {
        // bind notes in edit scenario
        this.quotationService.quotation.docData.notes = this.docData?.notes
        this.form.patchValue({
          notes: this.docData?.notes,
        })
        // bind common details which is not effect the doc type
        this.quotationService.quotation.docData.bankDetails = this.docData?.bankDetails,
          this.quotationService.quotation.userData.signatoryName = this.userData?.signatoryName,
          this.quotationService.quotation.userData.contactname = this.userData?.contactname,
          this.quotationService.quotation.userData.contactno = this.userData?.contactno ? this.userData?.contactno : null,
          this.quotationService.quotation.userData.email = this.userData?.email,
          this.quotationService.quotation.userData.designation = this.userData?.designation,
          this.form.patchValue({

            bankDetails: this.docData?.bankDetails,
            showSignature: this.superUserDetails.signStatus,
            signatoryName: this.userData?.signatoryName,
            signatoryContactname: this.userData?.contactname,
            signatoryContactno: this.userData?.contactno ? this.userData?.contactno : null,
            signatoryEmail: this.userData?.email,
            designation: this.userData?.designation,
          })
      }
      else if (this.quotationService.scenario == 'quotefromest') {
          // get contact name... if it is set in quotationContactDetails else take user name... estimate saved details
        let contactName
        if (this.superUserDetails.quotationContactDetails?.contactName) {
          contactName = this.superUserDetails.quotationContactDetails?.contactName
        } else {
          contactName = this.userData?.contactname
        }
        let contactNumber
        if (this.superUserDetails.quotationContactDetails?.contactNumber) {
          contactNumber = this.superUserDetails.quotationContactDetails?.contactNumber
        } else {
          contactNumber = this.userData?.contactno ? this.userData?.contactno : null;
        }
        let email
        if (this.superUserDetails.quotationContactDetails?.email) {
          email = this.superUserDetails.quotationContactDetails?.email
        } else {
          email = this.userData?.email;
        }
        let signatoryName
        if (this.superUserDetails.quotationContactDetails?.signatoryName) {
          signatoryName = this.superUserDetails.quotationContactDetails?.signatoryName
        } else {
          signatoryName = this.userData?.signatoryName
        }
        let designation
        if (this.superUserDetails.quotationContactDetails?.designation) {
          designation = this.superUserDetails.quotationContactDetails?.designation
        } else {
          designation = this.userData?.designation;
        }
        // bind notes based on dctype
        this.quotationService.quotation.docData.notes = this.superUserDetails.quotationNote
        this.form.patchValue({
          notes: this.superUserDetails.quotationNote,
        })
        // bind common details which is not effect the doc type
        this.quotationService.quotation.docData.bankDetails = this.docData?.bankDetails,
          this.quotationService.quotation.userData.signatoryName =signatoryName,
          this.quotationService.quotation.userData.contactname = contactName,
          this.quotationService.quotation.userData.contactno = contactNumber,
          this.quotationService.quotation.userData.email = email,
          this.quotationService.quotation.userData.designation = designation,
          this.form.patchValue({

            bankDetails: this.docData?.bankDetails,
            showSignature: this.superUserDetails.signStatus,
            signatoryName: signatoryName,
            signatoryContactname: contactName,
            signatoryContactno: contactNumber,
            signatoryEmail: email,
            designation: designation,
          })
      }
      //get form values before change
      this.quotationService.prevSignatureAndAdditionalDetailsForm = ChangeLogComponent.cloneAbstractControl(this.form);
    }
  }
  // update panel state
  updatePanleState(val: boolean) {
    if (val == true) {
      this.quotationService.updatePanleState(false, false, val)
    }
  }
  // update contact name in bill fromm details also
  onContactNameChange() {
    this.quotationService.billFromForm.patchValue({ billFromContactname: this.quotationService.signatureAndAdditionalDetailsForm.value.signatoryContactname })
    this.quotationService.billFromForm.get('billFromContactname').markAsDirty();
  }
}
