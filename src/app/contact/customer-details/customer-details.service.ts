import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import {
  Attachments,
  Customer,
  CustomerNotes,
  FollowUps,
  Invoice,
  PaymentReceipt,
  Sales,
} from '../../data-models';

@Injectable({
  providedIn: 'root',
})
export class CustomerDetailsService {
  passdata: any;
  tab: Number;

  constructor(private db: AngularFirestore) {}

  // fetching all FollowUps
  getAllFollowUps(cusId: string, userId: string) {
    return this.db
      .collection<FollowUps>('users/' + userId + '/Follow Ups', (ref) =>
        ref.where('customerId', '==', cusId)
      )
      .snapshotChanges();
  }
  // followup task completed update under followups collection
  UpdateTask(followUpId: string, completed, uid, changeLog) {
    this.db
      .doc('users/' + uid + '/Follow Ups/' + followUpId)
      .update({ completedStatus: completed, changeLog, lastModifiedDate: new Date().getTime()});
  }
  // add attachment under customers attachment collection
  attachmentsToCollection(id, cid, name, url, path, date, uname, size) {
    return this.db
      .collection('users/' + id + '/customers/' + cid + '/attachments')
      .add({
        fileName: name,
        downloadURL: url,
        path: path,
        date: date,
        uploaded: uname,
        size: size,
      });
  }
  // read details of particular cuatomer
  readCustRecord(uId: string, id: string) {
    return this.db
      .doc<Customer>('users/' + uId + '/customers/' + id)
      .valueChanges();
  }
  // get attachments under customer
  getAttachments(userId: string, custId: string) {
    return this.db
      .collection(
        'users/' + userId + '/customers/' + custId + '/attachments',
        (ref) => ref.orderBy('date', 'desc')
      )
      .snapshotChanges();
  }
  // get attachments under task
  getAttachmentsTask(userId: string, taskId: string) {
    return this.db
        .collection<Attachments>(
          'users/' + userId + '/tasks/' + taskId + '/attachments')
        .snapshotChanges();
  }
  // get sales based on dataAccessRule
  getSales(cusId: string, userId: string, _dataAccesRule: string, _subId) {
    return this.db
      .collection<Sales>('users/' + userId + '/sales', (ref) =>
        ref.where('customerId', '==', cusId)
      )
      .snapshotChanges();
  }
  // get sales based on dataAccessRule
  getServices(cusId: string, userId: string, _dataAccesRule: string, _subId) {
    return this.db
      .collection<Sales>('users/' + userId + '/services', (ref) =>
        ref.where('customerId', '==', cusId)
      )
      .snapshotChanges();
  }
  // update total attachment size under user
  updateSize(id: any, size: any) {
    return this.db.doc('users/' + id).update({ totalAttachmentsSize: size });
  }
  // update taggeduser field to contact doc
  updateTaggedUser(id, custId, taggedUsers) {
    return this.db
      .doc('users/' + id + '/customers/' + custId)
      .update({ taggedUsers });
  }
  // quotations associated with this customer
  getQuotations(userId: string, custId: string, _dataAccessRule, _subId) {
    return this.db
      .collection('users/' + userId + '/Quotations', (ref) =>
        ref.where('customerData.custID', '==', custId)
      )
      .snapshotChanges();
  }
  // estimates associated with this customer
  getEstimate(userId: string, custId: string, _dataAccessRule, _subId) {
    return this.db
      .collection('users/' + userId + '/Estimates', (ref) =>
        ref.where('customerData.custID', '==', custId)
      )
      .snapshotChanges();
  }
  // invoicess associated with this customer
  getInvoices(id: string, custId: string, _dataAccessRule, _subId) {
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref.where('customerData.custID', '==', custId)
      )
      .snapshotChanges();
  }
  //expenses associated with this customer
  getExpenses(id: string, custId: string, _dataAccessRule, _subId) {
    return this.db
      .collection('users/' + id + '/Expenses', (ref) =>
        ref.where('customerId', '==', custId)
      )
      .snapshotChanges();
  }
  // collections associated with this customer
  getPaymentReceipt(id: string, custId: string) {
    return this.db
      .collection<PaymentReceipt>('users/' + id + '/paymentsreceived', (ref) =>
        ref.where('customerId', '==', custId)
      )
      .snapshotChanges();
  }
  // fetching open tasks only
  getTasks(id: string, _uid: string, custId, _rule, _account,lastStatusOption) {
    //MK - 28th July 2022 - Changing access rule check
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref
          .where('customerId', '==', custId)
          .where('status', '!=', lastStatusOption).orderBy('status')
          .orderBy('date', 'asc')
      )
      .snapshotChanges();

  }
  // fetching all tasks to this customer
  getAllTasks(id: string, _uid: string, custId, _rule, _account) {
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref.where('customerId', '==', custId).orderBy('date', 'desc')
      )
      .snapshotChanges();

  }
  // create new note under customer
  writeNote(
    form,
    createdById: string,
    createdDate: any,
    customerId: string,
    cratedByName: string,
    userId: string,
    changeLog
  ) {
    this.db
      .collection(
        'users/' + createdById + '/customers/' + customerId + '/Notes'
      )
      .add({
        ...form,
        createdById: userId,
        createdDate: createdDate,
        cratedByName: cratedByName,
      })
      .then((res) => {
        this.db
          .doc('users/' + createdById + '/customers/' + customerId)
          .update({
            changeLog: changeLog,
            lastModifiedDate: new Date().getTime(),
            lastNoteDate: new Date().getTime(),
            lastAddedNote: form.notes,
            lastNoteId: res.id,
          });
      });
  }
  // update edited note under customer
  updateNote(
    notes,
    createdById: string,
    customerId: string,
    noteId,
    changeLog,
    lastNoteId: string
  ) {
    this.db
      .doc(
        'users/' + createdById + '/customers/' + customerId + '/Notes/' + noteId
      )
      .update({
        notes: notes,
      })
      .then((_res) => {
        if (lastNoteId != noteId) {
          // if last note is not updating
          this.db
            .doc('users/' + createdById + '/customers/' + customerId)
            .update({
              changeLog: changeLog,
              lastModifiedDate: new Date().getTime(),
            });
        } else {
          // if last note is updating then in customer update last note date and note
          this.db
            .doc('users/' + createdById + '/customers/' + customerId)
            .update({
              changeLog: changeLog,
              lastModifiedDate: new Date().getTime(),
              lastNoteDate: new Date().getTime(),
              lastAddedNote: notes,
            });
        }
      });
  }
  // fetch notes under this customer
  readNote(custId: string, uId: string) {
    return this.db
      .collection<CustomerNotes>(
        'users/' + uId + '/customers/' + custId + '/Notes',
        (ref) => ref.orderBy('createdDate', 'desc')
      )
      .snapshotChanges();
  }
  // fetch document under this customer
 fetchdocuments(custId: string, uId: string) {
    return this.db
      .collection<any>(
        'users/' + uId + '/customers/' + custId + '/documents'
      )
      .snapshotChanges();
  }
  //  update assignedTo field
  updateAssignedTo(
    id: string,
    cid: string,
    assignedTo: string,
    assignedToname: string,
    associatedBranch,
    changeLog: any
  ) {
    console.log(    id,
      cid,
      assignedTo,
      assignedToname,
      associatedBranch,
      changeLog)
    this.db.doc('users/' + id + '/customers/' + cid).update({
      assignedTo: assignedTo,
      assignedToName: assignedToname,
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  //  update assignedTo field
  updateBranch(
    id: string,
    cid: string,
    associatedBranch: string,
    changeLog: any
  ) {
    this.db.doc('users/' + id + '/customers/' + cid).update({
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
    });
  }
  // updating  assigned to in tasks collection from superuser
  onUpdateTask(
    userId,
    id,
    assignedTo,
    assignedToName,
    associatedBranch,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/tasks/' + id).update({
      assignedTo,
      assignedToName,
      associatedBranch,
      changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  // updating  assigned to in Followups collection from subuser
  onUpdateFollowUp(userId, id, assignedTo, assignedToName, associatedBranch, changeLog) {
    return this.db
      .doc('users/' + userId + '/Follow Ups/' + id)
      .update({ assignedTo, assignedToName, associatedBranch, assignedToDate: new Date().getTime(), changeLog, lastModifiedDate: new Date().getTime()});
  }
  // updating  assigned to in sales collection from subuser
  onUpdateSale(
    userId,
    id,
    assignedTo,
    assignedToName,
    associatedBranch,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/sales/' + id).update({
      assignedTo,
      assignedToName,
      associatedBranch,
      changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  // updating  assigned to in sales collection from subuser
  onUpdateService(
    userId,
    id,
    assignedTo,
    assignedToName,
    associatedBranch,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/services/' + id).update({
      assignedTo,
      assignedToName,
      associatedBranch,
      changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  updateChangeLog(userId, modName, id, changeLog) {
    this.db
      .doc('users/' + userId + '/' + modName + '/' + id)
      .update({ changeLog, lastModifiedDate: new Date().getTime() });
  }
  async getDocsWithCustomer(
    id: string,
    customerId: string,
    assignedTo: string,
    DocType: string,
    queryField1,
    queryField2
  ): Promise<Invoice[]> {
    return await this.db
      .collection('users/' + id + '/' + DocType, (ref) =>
        ref
          .where(queryField1, '==', customerId)
          .where(queryField2, '==', assignedTo)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Invoice)
          )
        )
      )
      .toPromise();
  }
  onUpdateDocs(userId, id, docType, assignedTo, scenario) {
    if (scenario == 'fromcust') {
      return this.db.doc('users/' + userId + '/' + docType + '/' + id).update({
        'customerData.contactAssignedToOwner': assignedTo,
      });
    } else {
      return this.db.doc('users/' + userId + '/' + docType + '/' + id).update({
        'docData.saleAssignedToOwner': assignedTo,
      });
    }
  }
  getAllContWaTemp(superUserId) {
    return this.db
      .collection('users/' + superUserId + '/messageTemplates', (ref) =>
        ref
          .where('templateType', '==', 'WhatsApp')
          .where('tempRecType', '==', 'Contact')
      )
      .snapshotChanges();
  }
  // delete particular customer under users customer collection
  onDeleteCustomer(userId, id) {
    return this.db.doc('users/' + userId + '/customers/' + id).delete();
  }
  // delete selected followups under users followups collection
  onDeleteFollowUps(userId, id) {
    return this.db.doc('users/' + userId + '/Follow Ups/' + id).delete();
  }
  // delete particular tasks under users taks collection
  onDeleteTasks(userId, id) {
    return this.db
      .doc('users/' + userId + '/tasks/' + id)
      .delete()
      .then(async (_res) => {
        //delete comments from task
        const qry = await this.db
          .collection('users/' + userId + '/tasks/' + id + '/comments')
          .ref.get();
        qry.forEach((doc) => {
          doc.ref.delete();
        });
        //delete attachments from task
        const qryAtt = await this.db
          .collection('users/' + userId + '/tasks/' + id + '/attachments')
          .ref.get();
        qryAtt.forEach((doc) => {
          doc.ref.delete();
        });
      });
  }
  //for saving logs of deleting documents
  addToDeleteLog(id, lines) {
    return this.db.collection('users/' + id + '/deleteLogs').add({ ...lines });
  }
  //verification changes
  changeDocVerification(superUserId, custId, docId, verifiedBy,verifiedId,verifyDate,verifyVal,changeLog) {
    return this.db
      .doc(
        'users/' +
          superUserId +
          '/customers/' +
          custId +
          '/documents/' +
          docId
      )
      .update({
        verificationStatus: verifyVal,
        verificationDate:verifyDate,
        verifiedBy:verifiedBy,
        verifiedById:verifiedId
      }).then(_res => {
       return this.db
          .doc('users/' + superUserId +  '/customers/' + custId)
          .update({changeLog:changeLog,lastModifiedDate:new Date().getTime()});
  })
}
}
