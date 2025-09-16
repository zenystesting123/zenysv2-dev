import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Sales,Customer, Profile} from '../data-models';
import { CommonService } from '../common.service';
@Component({
  selector: 'app-selectsaledialog',
  templateUrl: './selectsaledialog.component.html',
  styleUrls: ['./selectsaledialog.component.scss'],
})
export class SelectsaledialogComponent implements OnInit, OnDestroy {
  @Output() selectCustomerEvent = new EventEmitter();
  myControl = new FormControl({disabled:true});
  filteredOptions: Observable<Sales[]>;
  user: firebase.default.UserInfo;
  sales: Sales[];
  selectedSale: any = '';
  userId: string;
  custId: string;
  docType: string;
  subscribeAuth: Subscription;
  subscribeUser: Subscription;
  subscribeSale: Subscription;
  id: string;
  superUserId: any;
  // for customer selection
  @Output() selectCustomerEvent1 = new EventEmitter();
  myControl1 = new FormControl();
  filteredOptions1: Observable<any[]>;
  subscribeAuth1: Subscription;
  subscribeUser1: Subscription;
  subscribeCustomer: Subscription;
  user1: firebase.default.UserInfo;
  customers: Customer[];
  selectedCust: any = '';
  customer:any;
  superUserId1: any;
  custData:any;
  custinclude:boolean=false;
  saleinclude:boolean=false;
  unsubscribeflag:boolean=false;
  
  superUserDetails:Profile;
  fieldNameContact:string = 'Contact';
  fieldNameSale : string='Sale';
  searchOrg:string = "Org";//Mode for searching contact - Organization name/ contact person name
  // end of for customer selection
  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<SelectsaledialogComponent>,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    public commonService:CommonService
  ) {

    this.superUserDetails = this.commonService.getSuperUserData();
    if(this.superUserDetails.fieldNames){
    this.fieldNameContact = this.superUserDetails.fieldNames.fieldNameContact;
    this.fieldNameSale = this.superUserDetails.fieldNames.fieldNameSale;
    }

    this.userId = data.userId;
    this.custId = data.custId;
    this.docType = data.docType;
    this.id = data.id;
    this.custData=data.custdata;
    this.filteredOptions=null
    // console.log(this.id)
    // console.log(this.custData)
    //Get the list of sales for the user
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
            if(this.id!=null)
            {
              this.custinclude=true;
              this.selectedCust=
              this.subscribeSale = this.db
              .collection('users/' + this.superUserId + '/sales', (ref) =>
                ref
                  .where('customerId', '==', this.id)
              )
              .snapshotChanges()
              .subscribe((data) => {
                this.sales = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Sales;
                });
                this.filteredOptions = this.myControl.valueChanges.pipe(
                  startWith(''),
                  map((value) =>
                    typeof value === 'string' ? value : value.saleTitle
                  ),
                  map((saleTitle) =>
                    saleTitle ? this._filter(saleTitle) : this.sales.slice()
                  )
                );
              });
            }
              // for customerselection

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
                if(this.id!=null)
          {
            // console.log(this.customers)
            if(!!this.customers){
            this.selectedCust=this.customers.filter((cus)=>{return cus.id==this.id})[0]
            this.myControl1.setValue(this.selectedCust)
            this.myControl1.disable()}
            // console.log(this.selectedCust)
        }

                // console.log(this.customers)
                this.filteredOptions1 = this.myControl1.valueChanges.pipe(
                  startWith(''),
                  map((value) =>
                    typeof value === 'string' ? value : value.fname1
                  ),
                  map((fname1) =>
                    fname1 ? this._filter1(fname1) : this.customers.slice()
                  )
                );
                
              });
          
          // for customerselection end
          });
          
      }
    });
    setInterval(() => {
      this.selectCustomerEvent.emit(this.selectedSale);
    }, 100);
  }

  ngOnInit(): void {
    // console.log('id' + this.id);
  }

  displayFn(sale: Sales): string {
    if (sale && sale.saleTitle) {
    }

    return sale && sale.saleTitle ? sale.saleTitle : '';
  }
  

  private _filter(name: string): Sales[] {
    const filterValue = name.toLowerCase();

    return this.sales.filter(
      (option) => option.firstName.toLowerCase().indexOf(filterValue) === 0
    );
  }

  onSubmit() {
    this.unsubscribeflag=true
    if (this.custId){
      if(this.docType == 'Invoice'){
      this.router.navigate([
        '/dash/document/documentinvoicemanagement',
        this.myControl.value.id,
        'create',
        this.docType,
        this.custId,
        'na',
      ]);
    }
   else if(this.docType == 'Quotation'){
      this.router.navigate([
        '/dash/document/documentquotationmanagement',
        this.myControl.value.id,
        'create',
        this.docType,
        this.custId,
        'na',
      ]);
    }
   else {
      this.router.navigate([
        '/dash/document/documentmanagement',
        this.myControl.value.id,
        'create',
        this.docType,
        this.custId,
        'na',
      ]);
    }
    }
    else{
      if(this.docType == 'Invoice'){
      this.router.navigate([
        '/dash/document/documentinvoicemanagement',
        this.myControl.value.id,
        'create',
        this.docType,
        this.myControl.value.customerId,
        'na',
      ]);
    }
   else if(this.docType == 'Quotation'){
      this.router.navigate([
        '/dash/document/documentquotationmanagement',
        this.myControl.value.id,
        'create',
        this.docType,
        this.myControl.value.customerId,
        'na',
      ]);
    }
   else{
      this.router.navigate([
        '/dash/document/documentmanagement',
        this.myControl.value.id,
        'create',
        this.docType,
        this.myControl.value.customerId,
        'na',
      ]);
    }
    }
    this.dialogRef.close(); // close the dialogue
  }
  onCancel() {
    this.dialogRef.close();
  }
  ngOnDestroy() {
    this.subscribeAuth.unsubscribe();
    this.subscribeUser.unsubscribe();
    if(this.unsubscribeflag)
    this.subscribeSale.unsubscribe();
  }
// for selecting customer
displayFn1(customer: Customer): string {
  if (this.searchOrg == "Org"){
    return customer && customer.companyName? customer.companyName : '';

  }
  else {
    return customer && customer.firstName
    ? customer.firstName +
    ' ' +
    (customer.secondName ? customer.secondName : '')
    : '';

  }
}
private _filter1(name: string): Customer[] {
  const filterValue = name.toLowerCase();

  if (this.searchOrg == "Org"){
    return this.customers.filter(
      (option) =>
        (option.companyName)
          .toLowerCase()
          .indexOf(filterValue) === 0
    );
  }
  else{
    return this.customers.filter(
      (option) =>
        (option.firstName + option.secondName)
          .toLowerCase()
          .indexOf(filterValue) === 0
    );
  }
 
}


companycheck(company:string){
  if(company=='N/A'){
    return "Individual";
  }
  else if (company!='N/A'){
    return company;
  }
}

customerselectionfunction(){
  if(this.selectedCust){
    this.selectedSale=null
  if(this.customers.includes(this.selectedCust)){
    this.custinclude=true;
   
     this.myControl.enable()
      this.subscribeSale = this.db
                .collection('users/' + this.superUserId + '/sales', (ref) =>
                  ref
                    .where('customerId', '==', this.selectedCust.id)
                )
                .snapshotChanges()
                .subscribe((data) => {
                  this.sales = data.map((e) => {
                    return {
                      id: e.payload.doc.id,
                      ...(e.payload.doc.data() as {}),
                    } as Sales;
                  });
                  this.filteredOptions = this.myControl.valueChanges.pipe(
                    startWith(''),
                    map((value) =>
                      typeof value === 'string' ? value : value.saleTitle
                    ),
                    map((saleTitle) =>
                      saleTitle ? this._filter(saleTitle) : this.sales.slice()
                    )
                  );
                });
  
  
  
  }
  else
  {
  this.custinclude=false
  this.selectedSale=null
  this.sales=null
  this.myControl.disable()
}
  
  // console.log(this.custinclude)
  // console.log(this.selectedCust)
  
}

}

saleselectionfunction(){
  // console.log(this.selectedSale)
  if(this.sales){
  if(this.sales.includes(this.selectedSale))
this.saleinclude=true
else
this.saleinclude=false
// console.log(this.saleinclude)
}
}





// for selecting customer end



}