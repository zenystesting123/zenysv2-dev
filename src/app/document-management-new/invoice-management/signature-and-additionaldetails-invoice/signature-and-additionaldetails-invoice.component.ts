/*------------------------------------------------
Description : For handle signtature and item details display
Input:superUserDetails
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Profile } from 'src/app/data-models';
import { DocumentData, userData } from '../invoice.model';
import { InvoicesService } from '../invoices.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
@Component({
  selector: 'app-signature-and-additionaldetails-invoice',
  templateUrl: './signature-and-additionaldetails-invoice.component.html',
  styleUrls: ['./signature-and-additionaldetails-invoice.component.scss']
})
export class SignatureAndAdditionaldetailsInvoiceComponent implements OnInit {

  @Input() superUserDetails: Profile
  userData: userData;
  docData: DocumentData;
  constructor(public invoicesService: InvoicesService) {}
  get form(): FormGroup {
    return this.invoicesService.signatureAndAdditionalDetailsForm;
  }
  ngOnInit(): void {
    // take userdata and docdata from service used in edit scenario
    this.userData = this.invoicesService.userData
    this.docData = this.invoicesService.docData
    if (this.invoicesService.scenario == 'create') {
      // bind default details from user in create scenario
       // get contact name... if it is set in invoiceContactDetails else take user name... from user profile
      let contactName
      if (this.superUserDetails.invoiceContactDetails?.contactName) {
        contactName = this.superUserDetails.invoiceContactDetails?.contactName
      } else {
        contactName = (this.superUserDetails.firstname ? this.superUserDetails.firstname : '') + (this.superUserDetails.lastname ? ' ' + this.superUserDetails.lastname : '');
      }
      let contactNumber
      if (this.superUserDetails.invoiceContactDetails?.contactNumber) {
        contactNumber = this.superUserDetails.invoiceContactDetails?.contactNumber
      } else {
        contactNumber = this.superUserDetails.phone ? this.superUserDetails.phone : null;
      }
      let email
      if (this.superUserDetails.invoiceContactDetails?.email) {
        email = this.superUserDetails.invoiceContactDetails?.email
      } else {
        email = this.superUserDetails.email ? this.superUserDetails.email : null;
      }
      let signatoryName
      if (this.superUserDetails.invoiceContactDetails?.signatoryName) {
        signatoryName = this.superUserDetails.invoiceContactDetails?.signatoryName
      } else {
        signatoryName = (this.superUserDetails.firstname ? this.superUserDetails.firstname : '') + (this.superUserDetails.lastname ? ' ' + this.superUserDetails.lastname : '');
      }
      let designation
      if (this.superUserDetails.invoiceContactDetails?.designation) {
        designation = this.superUserDetails.invoiceContactDetails?.designation
      } else {
        designation = '';
      }
      this.form.patchValue({
        notes: this.superUserDetails.invoiceNote ? this.superUserDetails.invoiceNote : null,
        bankDetails: this.superUserDetails.bankDetails ? this.superUserDetails.bankDetails : null,
        showSignature: this.superUserDetails.signStatus ? this.superUserDetails.signStatus : false,
        signatoryName: signatoryName,
        signatoryContactname: contactName,
        signatoryContactno: contactNumber,
        signatoryEmail: email,
        designation: designation
      })
    }
    else {
      if (this.invoicesService.scenario == 'edit') {
        // bind notes in edit scenario
        this.invoicesService.invoice.docData.notes = this.docData?.notes
        this.form.patchValue({
          notes: this.docData?.notes
        })
        // bind common details which is not effect the doc type
        this.invoicesService.invoice.docData.bankDetails = this.docData?.bankDetails,
          this.invoicesService.invoice.userData.signatoryName = this.userData?.signatoryName,
          this.invoicesService.invoice.userData.contactname = this.userData?.contactname,
          this.invoicesService.invoice.userData.contactno = this.userData?.contactno ? this.userData?.contactno : null,
          this.invoicesService.invoice.userData.email = this.userData?.email,
          this.invoicesService.invoice.userData.designation = this.userData?.designation,
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
      else if (this.invoicesService.scenario == 'invfromquote' || this.invoicesService.scenario == 'invfromest') {
         // get contact name... if it is set in invoiceContactDetails else take user name... estimate/quo saved details
        let contactName
        if (this.superUserDetails.invoiceContactDetails?.contactName) {
          contactName = this.superUserDetails.invoiceContactDetails?.contactName
        } else {
          contactName = this.userData?.contactname
        }
        let contactNumber
        if (this.superUserDetails.invoiceContactDetails?.contactNumber) {
          contactNumber = this.superUserDetails.invoiceContactDetails?.contactNumber
        } else {
          contactNumber = this.userData?.contactno ? this.userData?.contactno : null;
        }
        let email
        if (this.superUserDetails.invoiceContactDetails?.email) {
          email = this.superUserDetails.invoiceContactDetails?.email
        } else {
          email = this.userData?.email;
        }
        let signatoryName
        if (this.superUserDetails.invoiceContactDetails?.signatoryName) {
          signatoryName = this.superUserDetails.invoiceContactDetails?.signatoryName
        } else {
          signatoryName = this.userData?.signatoryName
        }
        let designation
        if (this.superUserDetails.invoiceContactDetails?.designation) {
          designation = this.superUserDetails.invoiceContactDetails?.designation
        } else {
          designation = this.userData?.designation;
        }
        // bind notes based on dctype
        this.invoicesService.invoice.docData.notes = this.superUserDetails.invoiceNote
        this.form.patchValue({
          notes: this.superUserDetails.invoiceNote,
        })
        // bind common details which is not effect the doc type
        this.invoicesService.invoice.docData.bankDetails = this.docData?.bankDetails,
          this.invoicesService.invoice.userData.signatoryName =signatoryName,
          this.invoicesService.invoice.userData.contactname = contactName,
          this.invoicesService.invoice.userData.contactno = contactNumber,
          this.invoicesService.invoice.userData.email = email,
          this.invoicesService.invoice.userData.designation =designation,
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
      this.invoicesService.prevSignatureAndAdditionalDetailsForm = ChangeLogComponent.cloneAbstractControl(this.form);
    }
  }
  // update panel state
  updatePanleState(val: boolean) {
    if (val == true) {
      this.invoicesService.updatePanleState(false, false, val)
    }
  }
  // update contact name in bill fromm details also
  onContactNameChange() {
    this.invoicesService.billFromForm.patchValue({ billFromContactname: this.invoicesService.signatureAndAdditionalDetailsForm.value.signatoryContactname })
    this.invoicesService.billFromForm.get('billFromContactname').markAsDirty();
  }
}
