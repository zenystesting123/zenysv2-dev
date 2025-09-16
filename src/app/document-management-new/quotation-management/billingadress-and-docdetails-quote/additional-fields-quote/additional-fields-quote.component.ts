/*------------------------------------------------
Description : For handle additional field display
----------------------------------------------------*/
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuotationService } from '../../quotation.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';

@Component({
  selector: 'app-additional-fields-quote',
  templateUrl: './additional-fields-quote.component.html',
  styleUrls: ['./additional-fields-quote.component.scss']
})
export class AdditionalFieldsQuoteComponent implements OnInit {

  constructor(public quotationService: QuotationService) {}
  //get form frm service
  get form(): FormGroup {
    return this.quotationService.additionalFieldForm;
  }
  ngOnInit(): void {
    //get form values before change
    this.quotationService.prevAdditionalFieldForm = ChangeLogComponent.cloneAbstractControl(this.form);
  }
}
