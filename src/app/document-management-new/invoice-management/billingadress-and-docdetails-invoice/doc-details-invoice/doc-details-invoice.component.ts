/*------------------------------------------------
Description : For handle doc details display
Input:docData
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getStateCodes } from 'src/app/model/state-code';
import { DocumentData } from '../../invoice.model';
import { InvoicesService } from '../../invoices.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
@Component({
  selector: 'app-doc-details-invoice',
  templateUrl: './doc-details-invoice.component.html',
  styleUrls: ['./doc-details-invoice.component.scss']
})
export class DocDetailsInvoiceComponent implements OnInit {
  //here docData are taken via input because any changes are not allowed while editing the doc
  @Input() docData: DocumentData;
  StateCodes = getStateCodes.StateCodes; //state codes fetch from state-code.ts
  constructor(public invoicesService: InvoicesService) {}
  get form(): FormGroup {
    return this.invoicesService.docDetailsForm;
  }
  ngOnInit(): void {
    if (this.invoicesService.scenario != 'create') {
      if (this.invoicesService.scenario == 'edit') {
        // in edit bind all the doc numbering details
        this.invoicesService.invoice.docData.docNumber = this.docData?.docNumber
        this.invoicesService.invoice.docData.docPrefix = this.docData?.docPrefix
        this.invoicesService.invoice.docData.prefixAndDocNumber = this.docData?.prefixAndDocNumber;
        if(this.docData?.statusApproved != undefined){
        this.invoicesService.invoice.docData.statusApproved = this.docData?.statusApproved ? this.docData?.statusApproved : false
        }else{
          this.invoicesService.invoice.docData.statusApproved = false
        }
          this.form.patchValue({
            prefixAndDocNumber: this.docData?.prefixAndDocNumber,

          })
      } else if (this.invoicesService.scenario == 'invfromquote' || this.invoicesService.scenario == 'invfromest') {
        //  bind all the doc numbering details which cant taken from estimate/quo docs
        this.invoicesService.invoice.docData.docNumber = this.invoicesService.invoice.docData?.docNumber
        this.invoicesService.invoice.docData.docPrefix = this.invoicesService.invoice.docData?.docPrefix
        this.invoicesService.invoice.docData.prefixAndDocNumber = this.invoicesService.invoice.docData?.prefixAndDocNumber
        this.form.patchValue({
          prefixAndDocNumber: this.invoicesService.invoice.docData?.prefixAndDocNumber,
        })
      }
      // bind all common field which is not related to invoice details taken from userdetails
      this.invoicesService.docDetailsForm.patchValue({ docTitle: this.docData.docTitle ? this.docData.docTitle : 'Invoice' })
      this.invoicesService.invoice.docData.saleID = this.docData?.saleID ? this.docData?.saleID : null
      this.invoicesService.invoice.docData.saleTitle = this.docData?.saleTitle ? this.docData?.saleTitle : null
      this.invoicesService.invoice.docData.saleAssignedToOwner = this.docData?.saleAssignedToOwner ? this.docData?.saleAssignedToOwner : null
      this.invoicesService.invoice.docData.cancel = this.docData?.cancel ? this.docData?.cancel : false
      this.invoicesService.invoice.docData.createdDate = this.docData?.createdDate
      this.invoicesService.invoice.docData.docType = this.docData?.docType
      this.invoicesService.invoice.docData.gstPlaceOfSupplyCode = this.docData?.gstPlaceOfSupplyCode ? this.docData?.gstPlaceOfSupplyCode : null
      this.invoicesService.invoice.docData.gstStateCode = this.docData?.gstStateCode ? this.docData?.gstStateCode : null
      this.invoicesService.invoice.docData.docTitle = this.docData?.docTitle ? this.docData?.docTitle : '',
        this.invoicesService.invoice.docData.docDate = this.docData?.docDate ? this.docData?.docDate.toDate() : this.docData?.docDate,
        this.invoicesService.invoice.docData.dueDate = this.docData?.dueDate ? this.docData?.dueDate.toDate() : this.docData?.dueDate,
        this.invoicesService.invoice.docData.docValidity = this.docData?.docValidity ? this.docData?.docValidity.toDate() : this.docData?.docValidity
      this.invoicesService.invoice.docData.poRef = this.docData?.poRef ? this.docData?.poRef : null
      this.invoicesService.invoice.docData.paymentTerm = this.docData?.paymentTerm ? this.docData?.paymentTerm : null
      this.invoicesService.invoice.docData.quoteRef = this.docData?.quoteRef ? this.docData?.quoteRef : null
      this.invoicesService.invoice.docData.estRef = this.docData?.estRef ? this.docData?.estRef : null

      this.form.patchValue({

        docDate: this.docData?.docDate ? this.docData?.docDate.toDate() : this.docData?.docDate,
        dueDate: this.docData?.dueDate ? this.docData?.dueDate.toDate() : this.docData?.dueDate,
        gstPlaceOfSupplyCode: this.docData?.gstPlaceOfSupplyCode ? this.docData?.gstPlaceOfSupplyCode : null,
        gstStateCode: this.docData?.gstStateCode ? this.docData?.gstStateCode : null,
        poRef: this.docData?.poRef ? this.docData?.poRef : null,
        paymentTerm: this.docData?.paymentTerm ? this.docData?.paymentTerm : null,
        estRef: this.docData?.estRef ? this.docData?.estRef : null,
        quoteRef: this.docData?.quoteRef ? this.docData?.quoteRef : null,
      })
      //get form values before change
      this.invoicesService.prevDocDetailsForm = ChangeLogComponent.cloneAbstractControl(this.form);
    }
  }
  // for clear state code set form value null
  clearStateCode() {
    this.form.patchValue({
      gstStateCode: null
    })
    this.form.get('gstStateCode').markAsDirty();

  }
  // for clear Place Of SupplyCode set form value null
  clearPlaceOfSupplyCode() {
    this.form.patchValue({
      gstPlaceOfSupplyCode: null
    })
    this.form.get('gstPlaceOfSupplyCode').markAsDirty();
  }
  // get the state code in specific format  
  getSateCodeValue(state: string, tin: string, stateCode: string) {
    return state + ' (' + tin + ') ' + stateCode
  }
}
