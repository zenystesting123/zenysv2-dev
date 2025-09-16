/*------------------------------------------------
Description : For handle table settings, table and items summary display
----------------------------------------------------*/
import { Component, Input,  OnInit } from '@angular/core';
import { Profile } from 'src/app/data-models';
import { DocumentData, ItemsList } from '../quotation.model';
import { QuotationService } from '../quotation.service';
@Component({
  selector: 'app-product-details-quote',
  templateUrl: './product-details-quote.component.html',
  styleUrls: ['./product-details-quote.component.scss']
})
export class ProductDetailsQuoteComponent implements OnInit {

  productPanel = false; // item details panel
  @Input() superUserDetails: Profile; // used to give data as input to child component
  docData:DocumentData
  itemLists:ItemsList[]
  constructor(public quotationService: QuotationService) { }

  ngOnInit(): void {
     // used to give data as input to child component
    this.docData=this.quotationService.docData
    this.itemLists=this.quotationService.itemLists
  }
  //panel state update
  updatePanleState(val: boolean) {
    if (val == true) {
      this.quotationService.updatePanleState(false, val, false)
    }
  }
}

