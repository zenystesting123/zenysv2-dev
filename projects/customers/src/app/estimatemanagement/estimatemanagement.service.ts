import { PaymentReceipt, Profile, Sales } from './../data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserData, CustomerData, DocData, LineItemData } from './../data-models';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class EstimatemanagementService  {

  // Create variables to hold the user data, customer data, document data ,document type and line items from the form
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
    secondName:null
  }; //User Data
  // dbUserData: DbUserData = {
  //   contactname: null,
  //   contactno: null,
  //   email: null
  // };//user Data which is storing on db
  // docType: DocType={
  //   doctype:'',
  //   invoice:'',
  //   quatation:'',
  //   estimate:'',
  //   proforma:'' 
  // }; 
  //document type
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
    saleTitle: null,
    docValidity:null,
    docDate: null,
    dueDate: null,
    sgstValue: 0,
    cgstValue: 0,
    igstValue: 0,
    cessValue: 0,
    vatValue:0,
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
    currency: null,
    includeTax: true,
    includeCess: null,
    includeUnit:true,
    interState: null,
    docTitle: '',
    amountCollected: 0,
    createdDate:null,
    taxType:'gst',
  };
   //Document header data such as document number, type etc
  lineItem: LineItemData = { slno: 0, amountInclTax: null, amount: null, item: null, qty: null,unit:null, rate: null, cgstRate: 0, igstRate: 0, sgstRate: 0, cessRate: 0, cgstAmount: null,vatRate:0,
    vatAmount: null, igstAmount: null, sgstAmount: null, cessAmount: null, description: null };
  itemList = []; //Array to hold the line items

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {




    this.itemList.push(this.lineItem);// initially insert and empty row into the line item list
  }

  // function to store the data submitted by user from the form 
  setValues(userData: UserData,
    customerData: CustomerData,
    docData: DocData,
    // dbUserData: DbUserData,
    // docType:DocType,
    itemList
  ) {
    this.userData = userData;
    // console.log(this.userData)
    this.customerData = customerData;
    this.docData = docData;
    // this.dbUserData = dbUserData;
    // this.docType=docType;
    this.itemList = itemList;
    //console.log("logging from service file", this.userData,this.customerData,this.docData,this.itemList);
  }

  // Read the user data
  getValuesUserData() {
    return this.userData
  }

  // getValuesDocType() {
  //   return this.docType
  // }
  // Read the customer data
  getValuesCustomerData() {
    return this.customerData
  }

  // Read the Document header data
  getValuesDocData() {
    return this.docData
  }
  //Read the user storing data
  // getValuesDbUserData() {
  //   return this.dbUserData
  // }

  //Read the line item data 
  getItemList() {
    return this.itemList;
  }
 
  getCustomerDetails(userId,custId) {
    return this.firestore.doc<any>('users/'+userId+'/customers/'+custId).valueChanges();
  }
  getDocumentDetails(userId,docType,docId) {
    console.log('users/' + userId + '/' + docType +'/' + docId)
    // console.log(userId)

      return this.firestore.doc<any>('users/' + userId + '/' + docType +'s/' + docId).valueChanges(); 
  }
  createDocument(userData, customerData, docData, itemList, docType, docID,superuserId, userId) {
      return this.firestore.collection('users/'+superuserId+'/Estimates/').doc(docID).set({ userData, customerData, docData, itemList,'createdBy':userId });
  }
  //not used now
  createDocumentbysub(userData, customerData, docData, itemList, docType, docID, userId,mId) {
    if (docType == "Invoice") {
      //console.log("Invoice saved");
      return this.firestore.collection('users/'+mId+'/Invoices/').doc(docID).set({ userData, customerData, docData, itemList ,'collectedAmount': this.collectedAmount,'createdBy':userId});
    } else if (docType == "Quotation") {
      //console.log("Quotation saved");
      return this.firestore.collection('users/'+mId+'/Quotations/').doc(docID).set({ userData, customerData, docData, itemList,'createdBy':userId });
    } else if (docType == "Estimate") {
      //console.log("Quotation saved");
      return this.firestore.collection('users/'+mId+'/Estimates/').doc(docID).set({ userData, customerData, docData, itemList,'createdBy':userId });
    }
    else { return null }
  }
  updateDocNo(userId, keyValuePair:{}){
    return this.firestore.doc<any>('users/' + userId).update(keyValuePair);
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
  getSale(saleId:string,userId:string){
    return this.firestore.doc<Sales>('users/' + userId + '/sales/'+ saleId).valueChanges();
  }
  getSaleTitle(userId:string,saleId:string){
    return this.firestore.doc<Sales>('users/' + userId + '/sales/'+ saleId).valueChanges();
  }
  updateLogo(col:string,doc:string,logo:string){
    return this.firestore.collection(col).doc(doc).update({'logo':logo,'logoStatus':true});
  }
  updateSignature(col:string,doc:string,sign:string){
    return this.firestore.collection(col).doc(doc).update({'sign':sign,'signStatus':true});
  }

// share document
initshareinvoice(data){
  console.log(data)
  return this.firestore.doc("shared/"+data.saleID).set(data)
}
getsharedwithid(saleId){
  return this.firestore.doc<any>("shared/"+saleId).get()
}
addinvoicetoshare(saleId,docnumber){
    return this.firestore.doc("shared/"+saleId+"/Estimates/"+docnumber).set({docNumber:docnumber,shareDate:Date.now()})
}
saveSharedinUser(userid,data){
  return this.firestore.doc("users/"+userid+"/shared/"+data.saleID).set(data)
}
togglesharestatus(userid,docNumber,shareStatus){
  return this.firestore.doc("users/"+userid+"/Estimates/"+docNumber).update({shareStatus:shareStatus})
}
getCustdetails(userId:string,customerId:string){
  return this.firestore.doc<any>('users/' + userId + '/customers/'+ customerId).get();
}

sendEmail(data){
  return this.firestore.collection("email/").add(data)
}

getuserIDfromshared(saleId){
  return this.firestore.doc("shared/"+saleId).valueChanges()
}
getPaymentReceipt(id:string,docNumber){
  return this.firestore.collection<PaymentReceipt>('users/' + id+'/paymentsreceived', (ref) =>
  ref
    .where('invoiceno', '==', docNumber)).snapshotChanges();
}


}