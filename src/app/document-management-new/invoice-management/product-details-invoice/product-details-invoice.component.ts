/*------------------------------------------------
Description : For handle table settings, table and items summary display
----------------------------------------------------*/
import { Component, Input,  OnInit } from '@angular/core';
import { Profile } from 'src/app/data-models';
import { DocumentData, ItemsList } from '../invoice.model';
import { InvoicesService } from '../invoices.service';

@Component({
  selector: 'app-product-details-invoice',
  templateUrl: './product-details-invoice.component.html',
  styleUrls: ['./product-details-invoice.component.scss']
})
export class ProductDetailsInvoiceComponent implements OnInit {

  productPanel = false; // item details panel
  @Input() superUserDetails: Profile; // used to give data as input to child component
  docData:DocumentData
  itemLists:ItemsList[]
  constructor(public invoicesService: InvoicesService) { }

  ngOnInit(): void {
    // used to give data as input to child component
    this.docData=this.invoicesService.docData
    this.itemLists=this.invoicesService.itemLists
  }
  //panel state update
  updatePanleState(val: boolean) {
    if (val == true) {
      this.invoicesService.updatePanleState(false, val, false)
    }
  }
}

