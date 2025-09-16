import {
  PaymentReceipt,
  Sales,
  SalesNotes,
  FollowUps,
  Invoice,
} from '../../data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class SalesdetailsService {
  constructor(private db: AngularFirestore) {}
  // update taggeduser field to sales doc
  updateTaggedUser(id, saleId, taggedUsers) {
    return this.db
      .doc('users/' + id + '/sales/' + saleId)
      .update({ taggedUsers });
  }
  //read this particular sale for sale details
  getSale(saleId: string, userId: string) {
    return this.db
      .doc<Sales>('users/' + userId + '/sales/' + saleId)
      .valueChanges();
  }
  // get quoatations associated with this sale
  getQuotations(userId: string, saleId: string) {
    return this.db
      .collection('users/' + userId + '/Quotations', (ref) =>
        ref.where('docData.saleID', '==', saleId)
      )
      .snapshotChanges();
  }
  // get estimates associated with this sale
  getEstimates(userId: string, saleId: string) {
    return this.db
      .collection('users/' + userId + '/Estimates', (ref) =>
        ref.where('docData.saleID', '==', saleId)
      )
      .snapshotChanges();
  }
  // get attachments associated with this sale
  getAttachments(userId: string, saleId: string) {
    return this.db
      .collection(
        'users/' + userId + '/sales/' + saleId + '/attachments',
        (ref) => ref.orderBy('date', 'desc')
      )
      .snapshotChanges();
  }

  // get attachmets under task
  getAttachmentsTask(userId: string, taskId: string) {
    return this.db
      .collection(
        'users/' + userId + '/tasks/' + taskId + '/attachments',
        (ref) => ref.orderBy('date', 'desc')
      )
      .snapshotChanges();
  }

  // get collectionss associated with this sale
  getPaymentReceipt(id: string, saleId: string) {
    return this.db
      .collection<PaymentReceipt>('users/' + id + '/paymentsreceived', (ref) =>
        ref.orderBy('paymentDate', 'asc').where('saleid', '==', saleId)
      )
      .snapshotChanges();
  }
  // save attachment under sales collection
  attachmentsToCollection(id, cid, sid, name, url, path, date, size, username) {
    return this.db
      .collection('users/' + id + '/sales/' + sid + '/attachments')
      .add({
        customername: cid,
        fileName: name,
        downloadURL: url,
        path: path,
        date: date,
        size: size,
        uname: username,
      });
  }
  // get invoices associated with this sale
  getInvoices(id: string, saleId: string) {
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref.where('docData.saleID', '==', saleId)
      )
      .snapshotChanges();
  }
  // get expenses associated with this sale
  getExpenses(id: string, sId) {
    return this.db
      .collection('users/' + id + '/Expenses', (ref) =>
        ref.where('saleId', '==', sId)
      )
      .snapshotChanges();
  }
  // sales notes store to DB
  writeNote(
    form,
    createdById: string,
    createdDate: any,
    saleId: string,
    cratedByName: string,
    userid: string,
    changeLog
  ) {
    this.db
      .collection('users/' + createdById + '/sales/' + saleId + '/Notes')
      .add({
        ...form,
        createdById: userid,
        createdDate: createdDate,
        cratedByName: cratedByName,
      })
      .then((res) => {
        this.db.doc('users/' + createdById + '/sales/' + saleId).update({
          changeLog: changeLog,
          lastModifiedDate: new Date().getTime(),
          lastNoteDate: new Date().getTime(),
          lastAddedNote: form.notes,
          lastNoteId: res.id,
        });
      });
  }
  // update sale notes
  updateNote(
    notes,
    createdById: string,
    saleId: string,
    noteId: string,
    changeLog,
    lastNoteId: string
  ) {
    this.db
      .doc('users/' + createdById + '/sales/' + saleId + '/Notes/' + noteId)
      .update({
        notes: notes,
      })
      .then((_res) => {
        if (lastNoteId != noteId) {
          // if last note is not updating
          this.db.doc('users/' + createdById + '/sales/' + saleId).update({
            changeLog: changeLog,
            lastModifiedDate: new Date().getTime(),
          });
        } else {
          // if last note is updating then in customer update last note date and note
          this.db.doc('users/' + createdById + '/sales/' + saleId).update({
            changeLog: changeLog,
            lastModifiedDate: new Date().getTime(),
            lastNoteDate: new Date().getTime(),
            lastAddedNote: notes,
          });
        }
      });
  }
  // update attachment size under user profile
  updateSize(id: any, size: any) {
    this.db.doc('users/' + id).update({ totalAttachmentsSize: size });
  }
  // fetch sale notes
  readNote(saleId: string, uId: string) {
    return this.db
      .collection<SalesNotes>(
        'users/' + uId + '/sales/' + saleId + '/Notes',
        (ref) => ref.orderBy('createdDate', 'desc')
      )
      .snapshotChanges();
  }
  // get open tasks
  getTasks(id: string, uid: string, saleId, rule, account,lastStatusOption) {
    if (account == 'SuperUser') {
      return this.db
        .collection('users/' + id + '/tasks', (ref) =>
          ref.where('saleId', '==', saleId).where('status', '!=', lastStatusOption)
        )
        .snapshotChanges();
    } else {
      if (rule == 'All') {
        return this.db
          .collection('users/' + id + '/tasks', (ref) =>
            ref.where('saleId', '==', saleId).where('status', '!=', lastStatusOption)
          )
          .snapshotChanges();
      } else {
        return this.db
          .collection('users/' + id + '/tasks', (ref) =>
            ref
              .where('status', '!=', lastStatusOption)
              .where('saleId', '==', saleId)
              .where('assignedTo', '==', uid)
              .orderBy('status')
              .orderBy('date', 'desc')
          )
          .snapshotChanges();
      }
    }
  }
  // get all tasks
  getAllTasks(id: string, _uid: string, saleId, _rule, _account) {
    //MK - 2nd Aug 2022 - removing data access rul;e based fetching of tasks
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref.where('saleId', '==', saleId)
      )
      .snapshotChanges();
  }

  initshareinvoice(data) {
    return this.db.doc('shared/' + data.saleID).set(data);
  }
  getsharedwithid(saleId) {
    return this.db.doc<any>('shared/' + saleId).get();
  }
  addinvoicetoshare(saleId, id) {
    return this.db
      .doc('shared/' + saleId + '/Attachments/' + id)
      .set({ attachmentId: id, shareDate: Date.now() });
  }
  saveSharedinUser(userid, data) {
    return this.db.doc('users/' + userid + '/shared/' + data.saleID).set(data);
  }
  togglesharestatus(userid, id, saleid, shareStatus) {
    this.db
      .doc('users/' + userid + '/sales/' + saleid + '/attachments/' + id)
      .update({ shareStatus: shareStatus });
  }
  // get customer details associated with this sale
  getCustdetails(userId: string, customerId: string) {
    return this.db
      .doc<any>('users/' + userId + '/customers/' + customerId)
      .get();
  }

  // to send an email
  sendEmail(data) {
    return this.db.collection('email/').add(data);
  }

  //  get products under user
  getProducts(sid: string) {
    return this.db.collection('users/' + sid + '/products').snapshotChanges();
  }
  updateItemField(superUserId, saleId, itemsArray, changeLog) {
    return this.db
      .doc('users/' + superUserId + '/sales/' + saleId)
      .update({
        itemsArray,
        changeLog,
        lastModifiedDate: new Date().getTime(),
      });
  }
  // // selected product save to DB
  addProduct(sid, saleId, newProduct) {
    return this.db
      .collection('users/' + sid + '/sales/' + saleId + '/items')
      .add({ ...newProduct });
  }
  // update product under this particular sale
  updateProduct(
    sid: string,
    saleId: string,
    productId: string,
    prodDes,
    currency,
    unitPrice,
    unit,
    quantity,
    discount,
    cgst,
    sgst,
    igst,
    vatRate
  ) {
    this.db
      .doc('users/' + sid + '/sales/' + saleId + '/items/' + productId)
      .update({
        prodDes: prodDes,
        currency: currency,
        unitPrice: unitPrice,
        unit: unit,
        quantity: quantity,
        discount: discount,
        cgst: cgst,
        sgst: sgst,
        igst: igst,
        vatRate: vatRate,
      });
  }
  //delete product
  deleteProduct(sid, saleId, productId) {
    this.db
      .doc('users/' + sid + '/sales/' + saleId + '/items/' + productId)
      .delete();
  }
  // update product under this particular sale
  updateProductFromDialog(
    sid: string,
    saleId: string,
    productId: string,
    unitPrice,
    quantity,
    discount
  ) {
    this.db
      .doc('users/' + sid + '/sales/' + saleId + '/items/' + productId)
      .update({
        unitPrice: unitPrice,
        quantity: quantity,
        discount: discount,
      });
  }
  // create sale task comments collection
  createCommentCollection(sid, id, newComment) {
    return this.db
      .collection('users/' + sid + '/tasks/' + id + '/comments')
      .add({ ...newComment });
  }
  // update task
  updateTask(
    sid: string,
    id,
    title,
    description,
    priority,
    status,
    dueDate,
    assignedToName,
    assignedTo
  ) {
    this.db.doc('users/' + sid + '/tasks/' + id).update({
      title: title,
      description: description,
      priority: priority,
      status: status,
      dueDate: dueDate,
      assignedTo: assignedTo,
      assignedToName: assignedToName,
    });
  }
  // update assigned to from sales details
  updateAssignedTo(
    id: string,
    sid: string,
    assignedTo: string,
    assignedToname: string,
    associatedBranch,
    changeLog
  ) {
    this.db.doc('users/' + id + '/sales/' + sid).update({
      assignedTo: assignedTo,
      assignedToName: assignedToname,
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }

  // update assigned to from sales details
  updateBranch(id: string, sid: string, associatedBranch, changeLog) {
    this.db.doc('users/' + id + '/sales/' + sid).update({
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
    });
  }
  //for deleting a task
  deleteTask(userId, taskid: string) {
    return this.db.doc('users/' + userId + '/tasks/' + taskid).delete().then(async (_res) => {
      const qry = await this.db
        .collection('users/' + userId + '/tasks/' + taskid + '/comments')
        .ref.get();
      qry.forEach((doc) => {
        doc.ref.delete();
      });

      const qryAtt = await this.db
        .collection('users/' + userId + '/tasks/' + taskid + '/attachments')
        .ref.get();
      qryAtt.forEach((doc) => {
        doc.ref.delete();
      });
    });
  }
  // update estimated value in sales
  updateSaleEstValue(uId: string, saleId: string, estValue) {
    this.db.doc('users/' + uId + '/sales/' + saleId).update({
      estimatedValue: estValue,
    });
  }
  // followup task completed update under followups collection
  UpdateTask(followUpId: string, completed, uid, changeLog) {
    this.db
      .doc('users/' + uid + '/Follow Ups/' + followUpId)
      .update({ completedStatus: completed, changeLog, lastModifiedDate: new Date().getTime() });
  }
  // fetching all FollowUps
  getAllFollowUps(saleId: string, userId: string) {
    return this.db
      .collection<FollowUps>('users/' + userId + '/Follow Ups', (ref) =>
        ref.where('saleId', '==', saleId)
      )
      .snapshotChanges();
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
    return this.db
      .doc('users/' + userId + '/tasks/' + id)
      .update({
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
  updateChangeLog(userId, modName, id, changeLog) {
    this.db
      .doc('users/' + userId + '/' + modName + '/' + id)
      .update({ changeLog, lastModifiedDate: new Date().getTime() });
  }
  async getDocsWithSale(
    id: string,
    saleId,
    assignedTo,
    DocType
  ): Promise<Invoice[]> {
    return await this.db
      .collection('users/' + id + '/' + DocType, (ref) =>
        ref
          .where('docData.saleID', '==', saleId)
          .where('docData.saleAssignedToOwner', '==', assignedTo)
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
  onUpdateDocs(userId, id, docType, assignedTo) {
    return this.db.doc('users/' + userId + '/' + docType + '/' + id).update({
      'docData.saleAssignedToOwner': assignedTo,
    });
  }

  getAllSaleWaTemp(superUserId) {
    return this.db
      .collection('users/' + superUserId + '/messageTemplates', (ref) =>
        ref
          .where('templateType', '==', 'WhatsApp')
          .where('tempRecType', '==', 'Sale')
      )
      .snapshotChanges();
  }
  //for saving logs of deleting documents
  addToDeleteLog(id, lines) {
    return this.db.collection('users/' + id + '/deleteLogs').add({ ...lines });
  }
   // fetch document under this customer
 fetchdocuments(saleId: string, uId: string) {
  return this.db
    .collection<any>(
      'users/' + uId + '/sales/' + saleId + '/documents'
    )
    .snapshotChanges();
}
//verification changes
changeDocVerification(superUserId, saleId, docId, verifiedBy,verifiedId,verifyDate,verifyVal,changeLog) {
  return this.db
    .doc(
      'users/' +
        superUserId +
        '/sales/' +
        saleId +
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
         .doc('users/' + superUserId +  '/sales/' + saleId)
         .update({changeLog:changeLog,lastModifiedDate:new Date().getTime()});
 });
}
}
