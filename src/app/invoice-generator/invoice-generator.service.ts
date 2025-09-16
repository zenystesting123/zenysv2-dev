import { PaymentReceipt, Profile, Sales } from './../data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { CustomerData,DocData, LineItemData, UserData } from './../data-models';
@Injectable({
  providedIn: 'root'
})
export class InvoiceGeneratorService {
  userDetails: any = null; // vairbale to hold user details if user is signed in
  userSignedIn: boolean = false; // whether user is currenlty logged in 
  target: any;
  logoSelected: boolean = false;
  collectedAmount:any=0; 
  signSelected: boolean = false;
  userData: UserData = {
    logo: null,
    signature: null,
    signatoryName: null,
    designation: null,
    state: null,
    addressline1: null,
    addressline2: null,
    // district: null,
    gst: null,
    companyName: null,
    pinCode: null,
    country: null,
    contactname: null,
    contactno: null,
    email: null ,
  }; //User Data
  // dbUserData: DbUserData = {
  //   contactname: null,
  //   contactno: null,
  //   email: null
  // };
  customerData: CustomerData = {
    custID:null,
    pinCode: null,
    district: null,
    state: null,
    country: null,
    gst: null,
    fname1:null,
    sname:null,
    companyName: null,
    addressline1: null,
    addressline2: null
  }; // Customer data
  docData: DocData = {
    saleID: null,
    docValidity:null,
    docDate: null,
    dueDate: null,
    sgstValue: 0,
    cgstValue: 0,
    igstValue: 0,
    cessValue: 0,
    total: 0,
    docNumber: null,
    quoteRef: null,
    estRef:null,
    totalInclTax: 0,
    poRef: null,
    paymentTerm: null,
    docType: null,
    bankDetails: null,
    notes: null,
    currency: 'INR',
    includeTax: null,
    includeCess: null,
    includeUnit:null,
    interState: null,
    docTitle: '',
    amountCollected: 0,
    createdDate:null
  };
  lineItem: LineItemData = { slno: 0, amountInclTax: null, amount: null, item: null, qty: null,unit:null, rate: null, cgstRate: 0, igstRate: 0, sgstRate: 0, cessRate: 0, cgstAmount: null, igstAmount: null, sgstAmount: null, cessAmount: null, description: null };
  itemList = []; //Array to hold the line items
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {
    this.itemList.push(this.lineItem);// initially insert and empty row into the line item list
  }
 setValues(userData: UserData,
    customerData: CustomerData,
    docData: DocData,
    itemList
  ) {
    this.userData = userData;
    // console.log(this.userData)
    this.customerData = customerData;
    this.docData = docData;
    this.itemList = itemList;
  }
 getValuesUserData() {
    return this.userData
  }
 getValuesCustomerData() {
    return this.customerData
  }
 getValuesDocData() {
    return this.docData
  }
 getItemList() {
    return this.itemList;
  }
  // create(dbUserData) {
  //   return this.firestore.collection('guest').add(this.dbUserData);
  // }
  getUserDetails(userId) {
    return this.firestore.doc<any>('users/'+userId).valueChanges();
  }
  getCustomerDetails(userId,custId) {
    return this.firestore.doc<any>('users/'+userId+'/customers/'+custId).valueChanges();
  }
  getDocumentDetails(userId,docId) {
  
      return this.firestore.doc<any>('users/' + userId + '/Invoices/' + docId).valueChanges();
   
  }
  getDocumentQuotationDetails(userId,docId){
    return this.firestore.doc<any>('users/' + userId + '/Quotations/' + docId).valueChanges();
  }
  getDocumentEstimateDetails(userId,docId){
    return this.firestore.doc<any>('users/' + userId + '/Estimates/' + docId).valueChanges();
  }
  createDocument(userData, customerData, docData, itemList, docType, docID,superuserId, userId) {
    if (docType == "Invoice") {
      return this.firestore.collection('users/'+superuserId+'/Invoices/').doc(docID).set({ userData, customerData, docData, itemList ,'collectedAmount': this.collectedAmount,'createdBy':userId});
    } else if (docType == "Quotation") {
      return this.firestore.collection('users/'+superuserId+'/Quotations/').doc(docID).set({ userData, customerData, docData, itemList,'createdBy':userId });
    } else if (docType == "Estimate") {
      return this.firestore.collection('users/'+superuserId+'/Estimates/').doc(docID).set({ userData, customerData, docData, itemList,'createdBy':userId });
    }
    else { return null }
  }
  createDocumentbysub(userData, customerData, docData, itemList, docType, docID, userId,mId) {
    if (docType == "Invoice") {
      return this.firestore.collection('users/'+mId+'/Invoices/').doc(docID).set({ userData, customerData, docData, itemList ,'collectedAmount': this.collectedAmount,'createdBy':userId});
    } else if (docType == "Quotation") {
      return this.firestore.collection('users/'+mId+'/Quotations/').doc(docID).set({ userData, customerData, docData, itemList,'createdBy':userId });
    } else if (docType == "Estimate") {
      return this.firestore.collection('users/'+mId+'/Estimates/').doc(docID).set({ userData, customerData, docData, itemList,'createdBy':userId });
    }
    else { return null }
  }
  updateDocNo(userId, keyValuePair:{}){
    return this.firestore.doc<any>('users/' + userId).update(keyValuePair);
   }
  setSaleDocInvValue(userId:string,saleId:string, keyValuePair:{}){
    return this.firestore.collection('users/'+userId+'/sales/').doc(saleId).update(keyValuePair);
  }
  getSaleDocInvValue(userId:string,saleId:string){
    return this.firestore.doc<any>('users/'+userId+'/sales/'+saleId).valueChanges();
  }
  setCustInvValue(userId:string,custId:string, keyValuePair:{}){
    return this.firestore.collection('users/'+userId+'/customers/').doc(custId).update(keyValuePair);
  }
  getCustInvValue(userId:string,custId:string){
    return this.firestore.doc<any>('users/'+userId+'/customers/'+custId).valueChanges();
  }
  getform(id:String){
    return this.firestore.collection('users/' + id + '/documentsettings').snapshotChanges();
  }
  getUser(userId:string){
    return this.firestore.doc<Profile>('users/' + userId ).valueChanges();
  }
  updateImg1(col:string,doc:string,logo:string){
    return this.firestore.collection(col).doc(doc).update({logo});
  }
  getUsers(id1){
    return this.firestore.doc<any>('users/'+ id1).valueChanges();
  }
  getPaymentReceipt(id:string,docNumber){
    return this.firestore.collection<PaymentReceipt>('users/' + id+'/paymentsreceived', (ref) =>
    ref
      .where('invoiceno', '==', docNumber)).snapshotChanges();
  }
  getSale(saleId:string,userId:string){
    return this.firestore.doc<Sales>('users/' + userId + '/sales/'+ saleId).valueChanges();
  }
}
