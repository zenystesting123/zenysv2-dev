
import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Addnewsale1Component } from '../addnewsale1/addnewsale1.component';
import { Customer } from '../data-models';
import { Paymentreceipt1Component } from '../paymentreceipt1/paymentreceipt1.component';
import { SelectsaledialogComponent } from '../selectsaledialog/selectsaledialog.component';

@Component({
  selector: 'app-customer-search-pop-up',
  templateUrl: './customer-search-pop-up.component.html',
  styleUrls: ['./customer-search-pop-up.component.scss'],
})
export class CustomerSearchPopUpComponent implements OnInit, OnDestroy {
  @Output() selectCustomerEvent = new EventEmitter();
  myControl = new FormControl();
  filteredOptions: Observable<Customer[]>;
  subscribeAuth: Subscription;
  subscribeUser: Subscription;
  subscribeCustomer: Subscription;
  user: firebase.default.UserInfo;
  customers: Customer[];
  selectedCust: any = '';
  customer:any;
  superUserId: any;
  constructor( private router: Router,
    public dialogRef: MatDialogRef<CustomerSearchPopUpComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    //Get the list of customers for the user
    this.subscribeAuth = this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        this.subscribeUser = this.db
          .doc<any>('users/' + this.user.uid)
          .valueChanges()
          .subscribe((dat) => {
            if (dat.superUserId) {
              this.superUserId = dat.superUserId;
            } else {
              this.superUserId = this.user.uid;
            }
            this.subscribeCustomer = this.db
              .collection('users/' + this.superUserId + '/customers', (ref) =>
                ref.orderBy('dateCreated', 'desc')
              )
              .snapshotChanges()
              .subscribe((data) => {
                this.customers = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Customer;
                });
                // console.log(this.customers)
                this.filteredOptions = this.myControl.valueChanges.pipe(
                  startWith(''),
                  map((value) =>
                    typeof value === 'string' ? value : value.fname1
                  ),
                  map((fname1) =>
                    fname1 ? this._filter(fname1) : this.customers.slice()
                  )
                );
                // console.log(this.filteredOptions)
              });
          });
      }
    });
    setInterval(() => {
      this.selectCustomerEvent.emit(this.selectedCust);
    }, 100);
  }

  ngOnInit(): void {
  }
  companycheck(company:string){
    if(company=='N/A'){
      return "Individual";
    }
    else if (company!='N/A'){
      return company;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit(id: any) {
    if (this.data.type == 'sale') {
      const dialogRef = this.dialog.open(Addnewsale1Component, {
        panelClass: 'custom-dialog-container',
        width: '800px',
        data: { scenario: 'create',
        id: id },
      });
      dialogRef.afterClosed().subscribe((result) => {});
    }
    else if(this.data.type == 'saleMobile'){
      this.router.navigate(["/dash/addsale", 'create', id])
    }
    else if(this.data.type == 'payment'){
      let company;
      let name;
      company=this.selectedCust.companyName;
      name=this.selectedCust.firstName;

      this.dialog.open(Paymentreceipt1Component, {
        disableClose: true,
        data: {

          cid: id,
          mode: "createCust",
          company: company,
          customerName: name,
          componentName: this.constructor.name,
        }
      });
    }
    else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      dialogConfig.data = {
        userId: this.user.uid,
        docType:this.data.type,
        id: id,
      };
      const dialogRef = this.dialog.open(
        SelectsaledialogComponent,
        dialogConfig
      );
    }
  }
  displayFn(customer: Customer): string {
    return customer && customer.firstName ? customer.firstName : '';
  }
  private _filter(name: string): Customer[] {
    const filterValue = name.toLowerCase();

    return this.customers.filter(
      (option) =>
        ( option.firstName + option.secondName)
          .toLowerCase()
          .indexOf(filterValue) === 0
    );
  }
  ngOnDestroy() {
    this.subscribeAuth.unsubscribe();
    this.subscribeUser.unsubscribe();
    this.subscribeCustomer.unsubscribe();
  }
}
