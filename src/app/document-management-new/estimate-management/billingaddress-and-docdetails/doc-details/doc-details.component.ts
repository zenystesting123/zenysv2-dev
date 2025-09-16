/*------------------------------------------------
Description : For handle doc details display
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DocumentData } from '../../estimate.model';
import { EstimateService } from '../../estimate.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';

@Component({
  selector: 'app-doc-details',
  templateUrl: './doc-details.component.html',
  styleUrls: ['./doc-details.component.scss']
})
export class DocDetailsComponent implements OnInit {
  @Input() docData: DocumentData;
  constructor(private estimateService: EstimateService) {}
  get form(): FormGroup {
    return this.estimateService.docDetailsForm;
  }
  ngOnInit(): void {
    if (this.estimateService.scenario == 'edit') {
      // in edit bind all the doc details
      this.estimateService.docDetailsForm.patchValue({ docTitle: this.docData.docTitle ? this.docData.docTitle : 'Estimate' })
      this.estimateService.estimate.docData.saleID = this.docData?.saleID ? this.docData?.saleID : null
      this.estimateService.estimate.docData.saleTitle = this.docData?.saleTitle ? this.docData?.saleTitle : null
      this.estimateService.estimate.docData.saleAssignedToOwner = this.docData?.saleAssignedToOwner ? this.docData?.saleAssignedToOwner : null
      this.estimateService.estimate.docData.cancel = this.docData?.cancel ? this.docData?.cancel : false
      this.estimateService.estimate.docData.createdDate = this.docData?.createdDate
      this.estimateService.estimate.docData.docNumber = this.docData?.docNumber
      this.estimateService.estimate.docData.docPrefix = this.docData?.docPrefix
      this.estimateService.estimate.docData.prefixAndDocNumber = this.docData?.prefixAndDocNumber
      this.estimateService.estimate.docData.docType = this.docData?.docType
      if(this.docData?.statusApproved != undefined){
      this.estimateService.estimate.docData.statusApproved = this.docData?.statusApproved ? this.docData?.statusApproved : false
      }else{
        this.estimateService.estimate.docData.statusApproved = false
      }
      this.estimateService.estimate.docData.docTitle = this.docData?.docTitle ? this.docData?.docTitle : '',
        this.estimateService.estimate.docData.prefixAndDocNumber = this.docData?.prefixAndDocNumber,
        this.estimateService.estimate.docData.docDate = this.docData?.docDate.toDate(),
        this.estimateService.estimate.docData.docValidity = this.docData?.docValidity ? this.docData?.docValidity.toDate() : this.docData?.docValidity
      this.form.patchValue({
        docTitle: this.docData?.docTitle,
        prefixAndDocNumber: this.docData?.prefixAndDocNumber,
        docDate: this.docData?.docDate.toDate(),
        docValidity: this.docData?.docValidity ? this.docData?.docValidity.toDate() : this.docData?.docValidity
      })
      //get form values before change
      this.estimateService.prevDocDetailsForm = ChangeLogComponent.cloneAbstractControl(this.form);
    }
  }

}

