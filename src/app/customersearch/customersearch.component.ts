import { Customer } from 'src/app/data-models';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface User {
  name: string;
}

@Component({
  selector: 'app-customersearch',
  templateUrl: './customersearch.component.html',
  styleUrls: ['./customersearch.component.scss']
})
export class CustomersearchComponent implements OnInit {
  @Output() selectCustomerEvent = new EventEmitter();
  myControl = new FormControl();
  filteredOptions: Observable<Customer[]>;
  user: firebase.default.UserInfo;
  customers: Customer[];
  selectedCust: string = "";
  selectedCustId: string = "";
  userId: string;
  userDetails: Observable<any>;
  superUserId: any;
  customerlistService: any;
  dataAccessRule: any;
  userRole: any;
  accountType: any;
  constructor(
    private db: AngularFirestore, private afAuth: AngularFireAuth,) {

    //Get the list of customers for the user
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        this.userId = this.user.uid;
        this.db.doc<any>('users/' + this.user.uid).valueChanges().subscribe(d => {
          if (d) {
            if (d.superUserId) {
              this.superUserId = d.superUserId
            }
            else {
              this.superUserId = this.user.uid
            }
            this.dataAccessRule = d.dataAccessRule;
            this.userRole = d.userRole;
            this.accountType = d.accountType;
            this.db.collection('users/' + this.superUserId + '/customers', ref => ref.orderBy('dateCreated', "desc")).snapshotChanges().subscribe(data => {
              this.customers = data.map(e => {
                return {
                  id: e.payload.doc.id,
                  ...e.payload.doc.data() as {}
                } as Customer;

              })
              this.filteredOptions = this.myControl.valueChanges
                .pipe(
                  startWith(''),
                  map(value => typeof value === 'string' ? value : value.fname1),
                  map(fname1 => fname1 ? this._filter(fname1) : this.customers.slice())
                );
              //console.log("logging the customer list: ", this.customers)
            });
          }
        })


      }

    })
    setInterval(() => {
      this.selectCustomerEvent.emit(this.selectedCust);
      // console.log("value",this.selectedCust)
    }, 100);
  }

  ngOnInit(): void {
  }

  displayFn(customer: Customer): string {
    if (customer && customer.firstName) {
      this.selectedCustId = customer.id;
    }

    return customer && customer.firstName ? customer.firstName : '';

  }

  private _filter(name: string): Customer[] {
    const filterValue = name.toLowerCase();

    return this.customers.filter(option => option.firstName.toLowerCase().indexOf(filterValue) === 0);
  }
  companycheck(company: string) {
    if (company == 'N/A') {
      return "Individual";
    }
    else if (company != 'N/A') {
      return company;
    }
  }
}
