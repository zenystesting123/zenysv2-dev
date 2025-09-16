import { Sales } from './../data-models';
import { Customer } from 'src/app/data-models';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';



@Component({
  selector: 'app-selectcustsale',
  templateUrl: './selectcustsale.component.html',
  styleUrls: ['./selectcustsale.component.scss']
})
export class SelectcustsaleComponent implements OnInit {
  myControlCust = new FormControl();
  myControlSale = new FormControl();

  filteredOptions: Observable<Customer[]>;
  filteredOptionsSales: Observable<Sales[]>;
  user: firebase.default.UserInfo;
  customers: Customer[];
  sales: Sales[];
  selectedCust: string = "";
  selectedCustId: string = "";
  userId: string;
  custId: string;
  docType: string;
  selectedSale: string;

  //constructor(@Inject(MAT_DIALOG_DATA) data, private dialogRef: MatDialogRef<SelectcustsaleComponent>, private db: AngularFirestore, private afAuth: AngularFireAuth,)
  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth,) {
    //get the input data provided from calling component
    //this.userId = data.userId;
    //this.custId = data.custId;
    //this.docType = data.docType;
this.filteredOptions = null;
this.filteredOptionsSales = null;
    this.afAuth.authState.subscribe(user => {

      // if customer id is provided as an input, get the list of sales for that particular customer

      if (user) {
        this.user = user;
        

        this.db.collection('users/' + this.user.uid + '/sales', ref => ref.orderBy('date', "desc")).snapshotChanges().subscribe(data => {
          this.sales = data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as {}
            } as Sales;
    
          })
          this.filteredOptionsSales = this.myControlSale.valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.title),
              map(title => title ? this._filterSales(title) : this.sales.slice())
            );
          //console.log("logging the customer list: ", this.filteredOptionsSales);
        });
      }

    })
  }

  ngOnInit(): void {
  }

  displayFn(customer: Customer): string {
    if (customer && customer.firstName) {
      this.selectedCustId = customer.id;
      //this.getSalesList();
      //console.log("Customer ID is ", this.selectedCustId);
    }

    return customer && customer.firstName ? customer.firstName : '';

  }
  //Display function for list of sales
  displayFnSale(sales: Sales): string {
    if (sales && sales.saleTitle) {
      this.selectedSale = sales.id;
      //console.log("Customer ID is ", this.selectedCustId);
    }

    return sales && sales.saleTitle ? sales.saleTitle : '';

  }

  private _filter(name: string): Customer[] {
    const filterValue = name.toLowerCase();

    return this.customers.filter(option => option.firstName.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterSales(name: string): Sales[] {
    const filterValue = name.toLowerCase();

    return this.sales.filter(option => option.saleTitle.toLowerCase().indexOf(filterValue) === 0);
  }


}
