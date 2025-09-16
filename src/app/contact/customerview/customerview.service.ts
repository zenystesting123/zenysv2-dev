import { PaymentReceipt,Sales } from '../../data-models';
import {  Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {Customer,CustomerNotes,FollowUps,Profile} from '../../data-models'

@Injectable({
  providedIn: 'root'
})
export class CustomerviewService {

  constructor(private db: AngularFirestore) {

  }
  getNew(path1, itemId: string) {
    return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
  }
  updateCustCategory1(id: string, cid: string, value: any) {
    return this.db.doc('users/' + id + '/customers/' + cid).update({ custCategory1: value });
  }
  updateCustCategory2(id: string, cid: string, value: any) {
    return this.db.doc('users/' + id + '/customers/' + cid).update({ custCategory2: value });
  }
  getUsers(id) {
    return this.db.doc<any>('users/' + id).valueChanges();
  }

  readCustRecord(uId: string, id: string,) {
    return this.db.doc<Customer>('users/' + uId + '/customers/' + id).valueChanges();
  }

  getSales(cusId: string, userId: string,dataAccesRule:string,subId) {
    if(dataAccesRule=='Own'){
      return this.db.collection<Sales>('users/' + userId + '/sales', ref => ref.where("customerId", "==", cusId).where('assignedTo', '==', subId)).snapshotChanges();

    }
    else{
      return this.db.collection<Sales>('users/' + userId + '/sales', ref => ref.where("customerId", "==", cusId)).snapshotChanges();
    }
  }
  
  updateCustomer(id, uid, amt) {
    return this.db.doc('users/' + uid + '/customers/' + id).update({ 'followUpFlag': amt });
  }

  getQuotations(userId: string, custId: string,dataAccessRule,subId) {
    if(dataAccessRule=='Own' ){
      return this.db.collection('users/' + userId + '/Quotations', ref => ref.where('customerData.custID', '==', custId).where('createdBy', '==', subId)).snapshotChanges();
    }
    else{
      return this.db.collection('users/' + userId + '/Quotations', ref => ref.where('customerData.custID', '==', custId)).snapshotChanges();
    }

  }
  
  
  getEstimate(userId: string, custId: string,dataAccessRule,subId) {
    if(dataAccessRule=='Own'){
      return this.db.collection('users/' + userId + '/Estimates', ref => ref.where('customerData.custID', '==', custId).where('createdBy', '==', subId)).snapshotChanges();

    }
    else{
      return this.db.collection('users/' + userId + '/Estimates', ref => ref.where('customerData.custID', '==', custId)).snapshotChanges();

    }

  }
  getcust(id: String, custid) {
    return this.db.doc<any>('users/' + id + '/customers/' + custid).valueChanges();
  }
  getPaymentReceipt(id: string, custId: string) {
    return this.db.collection<PaymentReceipt>('users/' + id + '/paymentsreceived', ref => ref.where('customerId', '==', custId)).snapshotChanges();

  }
  getPaymentReceiptsubUser(id: string, custId: string, subId) {
    return this.db.collection<PaymentReceipt>('users/' + id + '/paymentsreceived', ref => ref.where('customerId', '==', custId).where('assignedTo', '==', subId)).snapshotChanges();

  }
  getTasks(id: string, custId) {
    return this.db.collection('users/' + id + '/tasks', ref => ref.where('customerId', '==', custId)).snapshotChanges();
  }
  
  // getMeetings(id: string, custId) {
  //   return this.db.collection('users/' + id + '/meeting', ref => ref.where('customerId', '==', custId)).snapshotChanges();
  // }
  
  UpdateTask(followUpId: string, completed, uid) {
    return this.db.doc('users/' + uid + '/Follow Ups/' + followUpId).update({ 'completedStatus': completed, lastModifiedDate: new Date().getTime() });
  }
  getInvoices(id: string, custId: string,dataAccessRule,subId) {
    if(dataAccessRule=='Own'){
      return this.db.collection('users/' + id + '/Invoices', ref => ref.where('customerData.custID', '==', custId).where('createdBy', '==', subId)).snapshotChanges();

    }
    else{
      return this.db.collection('users/' + id + '/Invoices', ref => ref.where('customerData.custID', '==', custId)).snapshotChanges();

    }

  }
  
  getFollowUps(cusId: string, userId: string,dataAccessRule,subId) {
    if(dataAccessRule=='Own'){
      return this.db.collection<FollowUps>('users/' + userId + '/Follow Ups', ref => ref.where("customerId", "==", cusId).where('assignedTo', '==', subId)).snapshotChanges();

    }
    else{
      return this.db.collection<FollowUps>('users/' + userId + '/Follow Ups', ref => ref.where("customerId", "==", cusId)).snapshotChanges();

    }

  }
  
  getform(id: String, cusId: string) {
    return this.db.collection('users/' + id + '/tasks', ref => ref.where("customerId", "==", cusId)).snapshotChanges();
  }
  getformsubUser(id: String, cusId: string, subId) {
    return this.db.collection('users/' + id + '/tasks', ref => ref.where("customerId", "==", cusId).where('assignedTo', '==', subId)).snapshotChanges();
  }

  writeNote(form, createdById: string, createdDate: any, customerId: string, cratedByName: string) {
    this.db.collection('users/' + createdById + '/customers/' + customerId + '/Notes').add({
      ...form, createdById: createdById, createdDate: createdDate, cratedByName: cratedByName
    })
  }
  readNote(custId: string, uId: string,) {
    return this.db.collection<CustomerNotes>('users/' + uId + '/customers/' + custId + '/Notes', ref => ref.orderBy("createdDate", "desc")).snapshotChanges();
  }

}
