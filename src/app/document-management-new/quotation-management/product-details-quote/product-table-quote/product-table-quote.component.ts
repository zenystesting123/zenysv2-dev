/*------------------------------------------------
Description : For handle table display
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup, } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProductSearchComponent } from 'src/app/document-management-new/product-search/product-search.component';
import { Product } from 'src/app/document-management-new/product-search/product.model';
import { ItemsList } from '../../quotation.model';
import { QuotationService } from '../../quotation.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
@Component({
  selector: 'app-product-table-quote',
  templateUrl: './product-table-quote.component.html',
  styleUrls: ['./product-table-quote.component.scss']
})
export class ProductTableQuoteComponent implements OnInit {

  @Input() itemLists: ItemsList[]
  constructor(public quotationService: QuotationService, public dialog: MatDialog) {}
  ngOnInit(): void {
    //get form values before change
    this.quotationService.prevProductTableForm = ChangeLogComponent.cloneAbstractControl(this.form);
  }

  get form(): FormGroup {
    return this.quotationService.productTableForm;
  }

  get itemList(): FormArray {
    return <FormArray>this.quotationService.productTableForm.get('itemList');
  }
  // add empty item
  addItem() {
    this.quotationService.newProduct = true;
    this.quotationService.addProduct()
  }
  // remove item based on index
  removeItem(index) {
    this.quotationService.removeProduct(index)
  }
  //get all binded data from ui and update the item summary and update the doc  used for saving
  changeItemValue() {
    this.quotationService.getDataFromUI()
  }
  changeDescriptionValue() {
    this.quotationService.getDataFromUI()
  }
  changeHsnValue() {
    this.quotationService.getDataFromUI()
  }
  changeQtyValue(event) {
    // if we type '.' it will not considor in value changes section and on upDateUiData in service this  will reset
    if (event.keyCode != '110') {
      this.quotationService.getDataFromUI()
    }
  }
  changeUnitValue() {
    this.quotationService.getDataFromUI()
  }
  changeRateValue(event) {
    if (event.keyCode != '110') {
      this.quotationService.getDataFromUI()
    }
  }
  changeDiscountValue(event) {
    if (event.keyCode != '110') {
      this.quotationService.getDataFromUI()
    }
  }
  changeCGSTValue(event) {
    if (event.keyCode != '110') {
      this.quotationService.getDataFromUI()
    }
  }
  changeSGSTValue(event) {
    if (event.keyCode != '110') {
      this.quotationService.getDataFromUI()
    }
  }
  changeVATValue(event) {
    if (event.keyCode != '110') {
      this.quotationService.getDataFromUI()
    }
  }
  changeIGSTValue(event) {
    if (event.keyCode != '110') {
      this.quotationService.getDataFromUI()
    }
  }
  changeCESSValue(event) {
    if (event.keyCode != '110') {
      this.quotationService.getDataFromUI()
    }
  }

  // used to search item
  onSearchItem(index: number) {
    const dialogRef = this.dialog.open(ProductSearchComponent, {
      width: '600px',
      data: { index: index, superUserId: this.quotationService.superUserId },
    });
    const dialogSubmitSubscription =
      dialogRef.componentInstance.submitClicked.subscribe(
        (item: Product) => {
          // if item is selected bind details in form and doc
          this.quotationService.setProduct(index, item)
        })
  }
}
