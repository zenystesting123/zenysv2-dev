/*------------------------------------------------
Description : For handle doc details display
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getStateCodes } from 'src/app/model/state-code';
import { DocumentData } from '../../quotation.model';
import { QuotationService } from '../../quotation.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';

@Component({
  selector: 'app-doc-details-quote',
  templateUrl: './doc-details-quote.component.html',
  styleUrls: ['./doc-details-quote.component.scss']
})
export class DocDetailsQuoteComponent implements OnInit {

  @Input() docData: DocumentData;
  StateCodes = getStateCodes.StateCodes; //state codes fetch from state-code.ts
  constructor(public quotationService: QuotationService) {}
  get form(): FormGroup {
    return this.quotationService.docDetailsForm;
  }
  ngOnInit(): void {
    if (this.quotationService.scenario == 'edit' || this.quotationService.scenario == 'quotefromest') {
      if (this.quotationService.scenario == 'edit') {
      // in edit bind all the doc numbering details
        this.quotationService.quotation.docData.docNumber = this.docData?.docNumber
        this.quotationService.quotation.docData.docPrefix = this.docData?.docPrefix
        this.quotationService.quotation.docData.prefixAndDocNumber = this.docData?.prefixAndDocNumber
        if(this.docData?.statusApproved != undefined){
          this.quotationService.quotation.docData.statusApproved = this.docData?.statusApproved ? this.docData?.statusApproved : false
        }else{
          this.quotationService.quotation.docData.statusApproved = false
        }
        this.form.patchValue({
          prefixAndDocNumber: this.docData?.prefixAndDocNumber,
        })
      } else {
         //  bind all the doc numbering details which cant taken from estimate
        this.quotationService.quotation.docData.docNumber = this.quotationService.quotation.docData?.docNumber
        this.quotationService.quotation.docData.docPrefix = this.quotationService.quotation.docData?.docPrefix
        this.quotationService.quotation.docData.prefixAndDocNumber = this.quotationService.quotation.docData?.prefixAndDocNumber
        this.form.patchValue({
          prefixAndDocNumber: this.quotationService.quotation.docData?.prefixAndDocNumber,
        })
      }
      // bind all common field which is not related to quotation details taken from userdetails
      this.quotationService.docDetailsForm.patchValue({ docTitle: this.docData.docTitle ? this.docData.docTitle : 'Quotation' })
      this.quotationService.quotation.docData.saleID = this.docData?.saleID ? this.docData?.saleID : null
      this.quotationService.quotation.docData.saleTitle = this.docData?.saleTitle ? this.docData?.saleTitle : null
      this.quotationService.quotation.docData.saleAssignedToOwner = this.docData?.saleAssignedToOwner ? this.docData?.saleAssignedToOwner : null
      this.quotationService.quotation.docData.cancel = this.docData?.cancel ? this.docData?.cancel : false
      this.quotationService.quotation.docData.createdDate = this.docData?.createdDate
      this.quotationService.quotation.docData.docType = this.docData?.docType
      this.quotationService.quotation.docData.gstPlaceOfSupplyCode = this.docData?.gstPlaceOfSupplyCode ? this.docData?.gstPlaceOfSupplyCode : null
      this.quotationService.quotation.docData.gstStateCode = this.docData?.gstStateCode ? this.docData?.gstStateCode : null
      this.quotationService.quotation.docData.estRef = this.docData?.estRef ? this.docData?.estRef : null
      this.quotationService.quotation.docData.docTitle = this.docData?.docTitle ? this.docData?.docTitle : '',
        this.quotationService.quotation.docData.docDate = this.docData?.docDate ? this.docData?.docDate.toDate() : this.docData?.docDate,
        this.quotationService.quotation.docData.docValidity = this.docData?.docValidity ? this.docData?.docValidity.toDate() : this.docData?.docValidity
      this.form.patchValue({
        docDate: this.docData?.docDate ? this.docData?.docDate.toDate() : this.docData?.docDate,
        docValidity: this.docData?.docValidity ? this.docData?.docValidity.toDate() : this.docData?.docValidity,
        gstPlaceOfSupplyCode: this.docData?.gstPlaceOfSupplyCode ? this.docData?.gstPlaceOfSupplyCode : null,
        gstStateCode: this.docData?.gstStateCode ? this.docData?.gstStateCode : null,
        estRef: this.docData?.estRef ? this.docData?.estRef : null,
      })
      //get form details before change
      this.quotationService.prevDocDetailsForm = ChangeLogComponent.cloneAbstractControl(this.form);
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

