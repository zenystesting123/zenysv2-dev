/*------------------------------------------------
Description : For handle table settings, table and items summary display
----------------------------------------------------*/
import { Component, Input,  OnInit } from '@angular/core';
import { Profile } from 'src/app/data-models';
import { DocumentData, ItemsList } from '../estimate.model';
import { EstimateService } from '../estimate.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  productPanel = false; // item details panel
  @Input() superUserDetails: Profile; // used to give data as input to child component
  docData:DocumentData
  itemLists:ItemsList[]
  constructor(public estimateService: EstimateService) { }

  ngOnInit(): void {
     // used to give data as input to child component
    this.docData=this.estimateService.docData
    this.itemLists=this.estimateService.itemLists
  }
  //panel state update
  updatePanleState(val: boolean) {
    if (val == true) {
      this.estimateService.updatePanleState(false, val, false)
    }
  }
}
