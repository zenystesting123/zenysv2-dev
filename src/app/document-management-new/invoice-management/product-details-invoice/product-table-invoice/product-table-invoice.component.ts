/*------------------------------------------------
Description : For handle table display
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup, } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProductSearchComponent } from 'src/app/document-management-new/product-search/product-search.component';
import { Product } from 'src/app/document-management-new/product-search/product.model';
import { InvoicesService } from '../../invoices.service';
import { ItemsList } from '../../invoice.model';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';
@Component({
  selector: 'app-product-table-invoice',
  templateUrl: './product-table-invoice.component.html',
  styleUrls: ['./product-table-invoice.component.scss']
})
export class ProductTableInvoiceComponent implements OnInit {

  @Input() itemLists: ItemsList[]
  constructor(public invoicesService: InvoicesService, public dialog: MatDialog) {}
  ngOnInit(): void {
     //get form values before change
     this.invoicesService.prevProductTableForm = ChangeLogComponent.cloneAbstractControl(this.form);
  }

  get form(): FormGroup {
    return this.invoicesService.productTableForm;
  }
  get itemList(): FormArray {
    return <FormArray>this.invoicesService.productTableForm.get('itemList');
  }
  // add empty item
  addItem() {
    this.invoicesService.newProduct = true;
    this.invoicesService.addProduct()
  }
  // remove item based on index
  removeItem(index) {
    this.invoicesService.removeProduct(index)
  }
  //get all binded data from ui and update the item summary and update the doc  used for saving
  changeItemValue() {
    this.invoicesService.getDataFromUI()
  }
  changeDescriptionValue() {
    this.invoicesService.getDataFromUI()
  }
  changeHsnValue() {
    this.invoicesService.getDataFromUI()
  }
  changeQtyValue(event) {
    // if we type '.' it will not considor in value changes section and on upDateUiData in service this  will reset
    if (event.keyCode != '110') {
      this.invoicesService.getDataFromUI()
    }
  }
  changeUnitValue() {
    this.invoicesService.getDataFromUI()
  }
  changeRateValue(event) {
    if (event.keyCode != '110') {
      this.invoicesService.getDataFromUI()
    }
  }
  changeDiscountValue(event) {
    if (event.keyCode != '110') {
      this.invoicesService.getDataFromUI()
    }
  }
  changeCGSTValue(event) {
    if (event.keyCode != '110') {
      this.invoicesService.getDataFromUI()
    }
  }
  changeSGSTValue(event) {
    if (event.keyCode != '110') {
      this.invoicesService.getDataFromUI()
    }
  }
  changeVATValue(event) {
    if (event.keyCode != '110') {
      this.invoicesService.getDataFromUI()
    }
  }
  changeIGSTValue(event) {
    if (event.keyCode != '110') {
      this.invoicesService.getDataFromUI()
    }
  }
  changeCESSValue(event) {
    if (event.keyCode != '110') {
      this.invoicesService.getDataFromUI()
    }
  }


  // used to search item
  onSearchItem(index: number) {
    const dialogRef = this.dialog.open(ProductSearchComponent, {
      width: '600px',
      data: { index: index, superUserId: this.invoicesService.superUserId },
    });
    const dialogSubmitSubscription =
      dialogRef.componentInstance.submitClicked.subscribe(
        (item: Product) => {
          // if item is selected bind details in form and doc
          this.invoicesService.setProduct(index, item)
        })
  }
}

