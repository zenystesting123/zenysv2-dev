/*------------------------------------------------
Description : For handle items summary display
----------------------------------------------------*/
import { Component, OnInit } from '@angular/core';
import { ProductSummaryUiData } from '../../invoice.model';
import { InvoicesService } from '../../invoices.service';

@Component({
  selector: 'app-product-summary-invoice',
  templateUrl: './product-summary-invoice.component.html',
  styleUrls: ['./product-summary-invoice.component.scss']
})
export class ProductSummaryInvoiceComponent implements OnInit {

  productSummaryUiData: ProductSummaryUiData;
  constructor(public invoicesService:InvoicesService) { }

  ngOnInit(): void {
     // subscribe the product summary data
    this.invoicesService.productSummaryUiData.subscribe((data) => {
      this.productSummaryUiData = data;
    })
    
  }
}
