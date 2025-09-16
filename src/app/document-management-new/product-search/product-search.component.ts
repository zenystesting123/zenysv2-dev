/*---------------------------------------------------
Description : product search popup
Input : index of line item and superuser id
Outut: selected item
---------------------------------------------------- */
import { Component, EventEmitter, HostListener, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProductSearchService } from './product-search.service';
import { Product } from './product.model';
export interface DialogData {
  index: string;
  superUserId: string;
}
@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit, OnDestroy {
  @Output() submitClicked = new EventEmitter<Product>();
  myControl = new FormControl('');
  options: Product[] = []
  filteredOptions: Observable<Product[]>;
  protected _onDestroy = new Subject<void>(); //Subject that emits when the component has been destroyed.
  constructor(
    public dialogRef: MatDialogRef<ProductSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public productSearchService: ProductSearchService,
  ) { }

  ngOnInit() {
    //get porduct list
    this.productSearchService.getproductsFromDb(this.data.superUserId, this._onDestroy)
    this.productSearchService.options.subscribe((data) => {
      this.options = data;
      this._filter(this.myControl.value)
    })

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  // search by item name
  private _filter(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.itemName.toLowerCase().includes(filterValue));
  }
  // on item select
  onItemSelection(value) {
    const itemId = value.option.value;
    let item = this.options.filter(option => option.id == itemId)
    if (item[0]) {
      this.submitClicked.emit(item[0]);// emit data to parent component
    }
    this.dialogRef.close()
  }

  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    // on destroy
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
