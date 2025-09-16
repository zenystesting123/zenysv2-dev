/*----------------------------------------------------------------
Description : Search filter used for search products and sale for documnt creation
Input: list of search item
Output : selected item details / sale title 

--------------------------------------------------------------------- */
import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonSearch, CommonSearchArgsModel } from 'src/app/data-models';
@Component({
  selector: 'app-common-search',
  templateUrl: './common-search.component.html',
  styleUrls: ['./common-search.component.scss'],
})
export class CommonSearchComponent implements OnInit, OnDestroy {
  searchList: CommonSearch[]; // search list
  @Output() submitClicked = new EventEmitter<CommonSearch>();
  protected _onDestroy = new Subject<void>(); //Subject that emits when the component has been destroyed.
  public searchFilterCtrl: FormControl = new FormControl(); // search filter form controller
  public filteredProduct: ReplaySubject<CommonSearch[]> = new ReplaySubject<
    CommonSearch[]
  >(1); // filtered list
  constructor(
    public dialogRef: MatDialogRef<CommonSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CommonSearchArgsModel
  ) {
    this.searchList = []; // initialise search list
    // observe searh filter value changes
    this.searchFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filerList();
      });
  }
  protected filerList() {
    // if no search list return
    if (!this.searchList) {
      return;
    }
    // get the search keyword
    let search: string | CommonSearch = this.searchFilterCtrl.value;
    // if search is a string ie no value selected from list
    if (typeof search === 'string') {
      if (search) {
        // if search is not null the filter the list according to the search value
        let searchValue: string = search.toLocaleLowerCase();
        let list = this.searchList.filter((item) =>
          item.value.toLocaleLowerCase().includes(searchValue)
        );
        this.filteredProduct.next(list); //add filter list to the select option
      } else {
        this.filteredProduct.next(this.searchList); // if no searchvalue the show all the list in select option
      }
    } else {
      //if its an object ie a list is selected emit the list
      this.submitClicked.emit(search);
      this.dialogRef.close(); // close dialog
    }
  }

  ngOnInit(): void {
    if (this.data.placeHolderText == 'One Time Sale') {
      // if place holder is One Time Sale set search value as One Time Sale
      this.searchFilterCtrl = new FormControl('One Time Sale');
    }
    this.searchList = this.data.searchItemList; // bind input search list to searchList
    this.filteredProduct.next(this.searchList); // add list to the select option
  }

  onNoClick(): void {
    this.dialogRef.close(); // close dialog
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  // if submit clicked
  onAdd() {
    // this is for if the list is empty and the user can add sale title
    let data = this.searchFilterCtrl.value;
    let newData = new CommonSearch('', data,'', true);
    this.submitClicked.emit(newData); // pass the sale id ,title and a boolean for checking if sale is selected or add new title
    this.dialogRef.close(); // close dialog
  }
}
