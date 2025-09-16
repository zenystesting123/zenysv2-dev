/*------------------------------------------------
Description : For handle additional field display
----------------------------------------------------*/
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InvoicesService } from '../../invoices.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';

@Component({
  selector: 'app-additionalfields-invoice',
  templateUrl: './additionalfields-invoice.component.html',
  styleUrls: ['./additionalfields-invoice.component.scss']
})
export class AdditionalfieldsInvoiceComponent implements OnInit {

  constructor(public invoicesService: InvoicesService) {}
  //get form frm service
  get form(): FormGroup {
    return this.invoicesService.additionalFieldForm;
  }
  ngOnInit(): void {
    //get form values before change
    this.invoicesService.prevAdditionalFieldForm = ChangeLogComponent.cloneAbstractControl(this.form);
  }
}


