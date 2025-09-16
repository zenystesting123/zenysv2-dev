import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { AngularFirestore } from '@angular/fire/firestore';
import { UserData, CustomerData, DocData, LineItemData, DbUserData, ShippingData } from '../data.model';
@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class InvoiceFormService {

  // Create variables to hold the user data, customer data, document data ,document type and line items from the form
  logoSelected: boolean = false;//for checking if the logo is selcted
  signSelected: boolean = false;//for checking if the signature is selected
  userData: UserData =
    {
      logo: null,
      signature: null,
      signatoryname: null,
      designation: null,
      statefrom: null,
      youraddressline: null,
      yourdistrict: null,
      yourgst: null,
      yourcompanyname: null,
      yourpincode: null,
      yourcountry: null,
      showSign: null
    }; //User Data
  dbUserData: DbUserData =
    {
      contactname: null,
      contactno: null,
      email: null
    };//user Data which is storing on db
  customerData: CustomerData =
    {
      billpincode: null,
      billdistrict: null,
      stateto: null,
      billcountry: null,
      billgst: null,
      billcompanyname: null,
      billaddressline: null,
      deliveredto: null,
      delto: null,
    }; // Customer data
    shipData: ShippingData={
      shipname:null,
      shipaddress:null,
      shipcompanyname:null,
      zip:null,
      frieghttype:null,
      shipdate:null,
      grossweight:null,
      totalpackage:null,
      shipto:null,
      shipdet:null,
      requisition:null,
      shipvia:null,
      fob:null,
      shippingterms:null
    };
  docData: DocData =
    {
      date: null,
      duedate: null,
      docValidity: null,
      sgstvalue: 0,
      cgstvalue: 0,
      igstvalue: 0,
      cessvalue: 0,
      vatvalue:0,
      discountValue:0,
      discountedAmount:0,
      total: 0,
      invoiceno: null,
      quatationreference: null,
      alltotal: 0,
      purchaseorder: null,
      paymentterm: null,
      invoiceorquote: null,
      bankdetails: null,
      notes: null,
      currency: "INR",
      includetax: true,
      includecess: null,
      interstate: null,
      includeunit: true,
      includeDiscount: false,
      docTitle: '',
      docType: null,
      country:null,
     embarkation:null,
     discharge:null,
     taxType:'gst'
    
    }; //Document header data such as document number, type etc
  lineItem: LineItemData =
    {
      slno: 0, amountInclTax: null, unit: null, amount: null, item: null, qty: null, rate: null,discountAmount:null,discountRate:0,
      cgstRate: 0, igstRate: 0, sgstRate: 0, cessRate: 0,vatRate:0, cgstAmount: null, igstAmount: null,vatAmount:null,
      sgstAmount: null, cessAmount: null, description: null,discountedAmount:null,hsnCode :null
    };//Line item Data
  itemList = []; //Array to hold the line items
  constructor() { this.itemList.push(this.lineItem); }// initially insert and empty row into the line item list
  // function to store the data submitted by user from the form 
  setValues(userData: UserData,
    customerData: CustomerData,
    docData: DocData,
    dbUserData: DbUserData,
    itemList) {
    this.userData = userData;
    console.log(this.userData)
    this.customerData = customerData;
    this.docData = docData;
    this.dbUserData = dbUserData;
    this.itemList = itemList;
  }
setShip(shipData:ShippingData){
  this.shipData=shipData;
}
  // Read the user data
  getValuesUserData() { return this.userData }
  getValuesCustomerData() { return this.customerData }
  // Read the Document header data
  getValuesDocData() { return this.docData }
  //Read the user storing data
  getValuesDbUserData() { return this.dbUserData }
  //Read the line item data 
  getItemList() { return this.itemList; }
  getshipData(){ return this.shipData;}
  //For storing the user email contactnumber and contactname in db
  //  create(dbUserData)
  //  {return this.firestore.collection('guest').add(this.dbUserData);}


}

