import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Expenses, OrganisationModel } from '../data-models';
import { Customer } from 'projects/customers/src/app/data-models';

@Injectable({
  providedIn: 'root',
})
export class Expenses1Service {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}
  //for creating new expenses with repective form values
  createExpenses(
    superUserId,
    date,
    formDetails,
    fieldArray,
    changeLog
  ) {
    return this.db.collection('users/' + superUserId + '/Expenses').add({
      ...formDetails,
      date: date,
      additionalFieldsArr: fieldArray,
      changeLog,
    });
  }
  //for getting customer details
  getCustDetails(superUserId, custId) {
    return this.db
      .doc<Customer>('users/' + superUserId + '/customers/' + custId)
      .valueChanges();
  }
  //for getting org details
  getOrgDetails(superUserId, orgId) {
    return this.db
      .doc<OrganisationModel>(
        'users/' + superUserId + '/Organisations/' + orgId
      )
      .valueChanges();
  }
  //for updating expenses with latest values
  updateExpenses(id, expId, form, fieldArray, changeLog) {
    return this.db
      .doc('users/' + id + '/Expenses/' + expId)
      .update({ ...form, additionalFieldsArr: fieldArray, changeLog });
  }
  //for getting detail of a paticular expense using expense id while updating
  getExpenseDetails(id: string, id1: string) {
    return this.db
      .doc<Expenses>('users/' + id + '/Expenses/' + id1)
      .valueChanges();
  }
  //for getting expense having a particular sale id for taking total expense for a sale
  getExpensePaymentSale(uId, sId) {
    return this.db
      .collection('users/' + uId + '/Expenses', (ref) =>
        ref.where('saleId', '==', sId)
      )
      .snapshotChanges();
  }
  
  //for getting sales under a paticular customer used after selecting customer in autocomplete
  getSalesForCust(uId, cId) {
    return this.db
      .collection('users/' + uId + '/sales', (ref) =>
        ref.where('customerId', '==', cId)
      )
      .snapshotChanges();
  }
  //updating new expense amount in sales
  updateExpenseAmountSale(uId: string, sId, amount) {
    if (uId) {
      return this.db
        .doc('users/' + uId + '/sales/' + sId)
        .update({ expenseAmount: amount });
    }
  }
  
  // add attachment under customers attachment collection
  attachmentsToCollection(id, cid, name, url, path, date, uname, size) {
    return this.db
      .collection('users/' + id + '/Expenses/' + cid + '/attachments/')
      .add({
        fileName: name,
        downloadURL: url,
        path: path,
        date: date,
        uploaded: uname,
        size: size,
      });
  }
  // get attachments associated with this expense
  getAttachments(userId: string, expenseId: string) {
    return this.db
      .collection(
        'users/' + userId + '/Expenses/' + expenseId + '/attachments',
        (ref) => ref.orderBy('date', 'desc')
      )
      .snapshotChanges();
  }
  // update total attachment size under user
  updateSize(id: any, size: any) {
    this.db.doc('users/' + id).update({ totalAttachmentsSize: size });
  }
  //******* delete doc from firestore
  deleteDoc(superUserId: string, id: any, docRef: string) {
    return this.db
      .doc(
        `users/` + superUserId + `/Expenses/` + id + `/attachments/` + docRef
      )
      .delete();
  }
  //update changeLog of any module
  updateChangeLog(userId, modName, id, changeLog) {
    this.db
      .doc('users/' + userId + '/' + modName + '/' + id)
      .update({ changeLog, lastModifiedDate: new Date().getTime() });
  }
}
