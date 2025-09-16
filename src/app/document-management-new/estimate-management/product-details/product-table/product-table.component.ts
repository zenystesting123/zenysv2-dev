/*------------------------------------------------
Description : For handle table display
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup, } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProductSearchComponent } from 'src/app/document-management-new/product-search/product-search.component';
import { Product } from 'src/app/document-management-new/product-search/product.model';
import { ItemsList } from '../../estimate.model';
import { EstimateService } from '../../estimate.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';


@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit {
  @Input() itemLists: ItemsList[]
  constructor(public estimateService: EstimateService, public dialog: MatDialog) {}
  ngOnInit(): void {
    //get form values before change
    this.estimateService.prevProductTableForm = ChangeLogComponent.cloneAbstractControl(this.form);
  }
  get itemList(): FormArray {
    return <FormArray>this.estimateService.productTableForm.get('itemList');
  }
  get form(): FormGroup {
    return this.estimateService.productTableForm;
  }
  // add empty item
  addItem() {
    this.estimateService.newProduct = true;
    this.estimateService.addProduct()
    
  }
  // remove item based on index
  removeItem(index) {
    this.estimateService.removeProduct(index)
  }
  changeItemValue() {
    this.estimateService.getDataFromUI()
  }
  //get all binded data from ui and update the item summary and update the doc  used for saving
  changeDescriptionValue() {
    this.estimateService.getDataFromUI()
  }
  changeHsnValue() {
    this.estimateService.getDataFromUI()
  }
  changeQtyValue(event) {
    // if we type '.' it will not considor in value changes section and on upDateUiData in service this  will reset
    if (event.keyCode != '110') {
      this.estimateService.getDataFromUI()
    }
  }
  changeUnitValue() {
    this.estimateService.getDataFromUI()
  }
  changeRateValue(event) {
    if (event.keyCode != '110') {
      this.estimateService.getDataFromUI()
    }
  }
  changeDiscountValue(event) {
    if (event.keyCode != '110') {
      this.estimateService.getDataFromUI()
    }
  }
  changeCGSTValue(event) {
    if (event.keyCode != '110') {
      this.estimateService.getDataFromUI()
    }
  }
  changeSGSTValue(event) {
    if (event.keyCode != '110') {
      this.estimateService.getDataFromUI()
    }
  }
  changeVATValue(event) {
    if (event.keyCode != '110') {
      this.estimateService.getDataFromUI()
    }
  }
  changeIGSTValue(event) {
    if (event.keyCode != '110') {
      this.estimateService.getDataFromUI()
    }
  }
  changeCESSValue(event) {
    if (event.keyCode != '110') {
      this.estimateService.getDataFromUI()
    }
  }

  // used to search item
  onSearchItem(index: number) {
    const dialogRef = this.dialog.open(ProductSearchComponent, {
      width: '600px',
      data: { index: index, superUserId: this.estimateService.superUserId },
    });
    const dialogSubmitSubscription =
      dialogRef.componentInstance.submitClicked.subscribe(
        (item: Product) => {
          // if item is selected bind details in form and doc
          this.estimateService.setProduct(index, item)
        })
  }
}
