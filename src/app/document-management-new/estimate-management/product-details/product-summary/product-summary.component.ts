/*------------------------------------------------
Description : For handle items summary display
----------------------------------------------------*/
import { Component, OnInit } from '@angular/core';
import { ProductSummaryUiData } from '../../estimate.model';
import { EstimateService } from '../../estimate.service';

@Component({
  selector: 'app-product-summary',
  templateUrl: './product-summary.component.html',
  styleUrls: ['./product-summary.component.scss']
})
export class ProductSummaryComponent implements OnInit {
  productSummaryUiData: ProductSummaryUiData;
  constructor(public estimateService: EstimateService) { }

  ngOnInit(): void {
    // subscribe the product summary data
    this.estimateService.productSummaryUiData.subscribe((data) => {
      this.productSummaryUiData = data;
    }) 
  }
}
