/*------------------------------------------------
Description : For handle items summary display
----------------------------------------------------*/
import { Component, OnInit } from '@angular/core';
import { ProductSummaryUiData } from '../../quotation.model';
import { QuotationService } from '../../quotation.service';

@Component({
  selector: 'app-product-summary-quote',
  templateUrl: './product-summary-quote.component.html',
  styleUrls: ['./product-summary-quote.component.scss']
})
export class ProductSummaryQuoteComponent implements OnInit {
  productSummaryUiData: ProductSummaryUiData;
  constructor(public quotationService: QuotationService) { }

  ngOnInit(): void {
     // subscribe the product summary data
    this.quotationService.productSummaryUiData.subscribe((data) => {
      this.productSummaryUiData = data;
    })
    
  }
}
