import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import {
  Attachments,
  Expenses,
  FollowUps,
  Invoice,
  PaymentReceipt,
  Sales,
  Service,
  Task,
} from 'src/app/data-models';

@Injectable({
  providedIn: 'root',
})
export class DeleteContactsService {
  constructor(private db: AngularFirestore) {}

  async getDocsWithCustomer(
    id: string,
    customerId: string,
    DocType: string
  ): Promise<Invoice[]> {
    return await this.db
      .collection('users/' + id + '/' + DocType, (ref) =>
        ref.where('customerData.custID', '==', customerId)
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
  async getSalesWithCustomer(id: string, customerId: string): Promise<Sales[]> {
    return await this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref.where('customerId', '==', customerId)
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
              } as Sales)
          )
        )
      )
      .toPromise();
  }
  async getServicesWithCustomer(
    id: string,
    customerId: string
  ): Promise<Service[]> {
    return await this.db
      .collection('users/' + id + '/services', (ref) =>
        ref.where('customerId', '==', customerId)
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
              } as Service)
          )
        )
      )
      .toPromise();
  }
  async getCollsWithCustomer(
    id: string,
    customerId: string
  ): Promise<PaymentReceipt[]> {
    return await this.db
      .collection('users/' + id + '/paymentsreceived', (ref) =>
        ref.where('customerId', '==', customerId)
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
              } as PaymentReceipt)
          )
        )
      )
      .toPromise();
  }
  async getExpsWithCustomer(
    id: string,
    customerId: string
  ): Promise<Expenses[]> {
    return await this.db
      .collection('users/' + id + '/Expenses', (ref) =>
        ref.where('customerId', '==', customerId)
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
              } as Expenses)
          )
        )
      )
      .toPromise();
  }
  async getCallsWithCustomer(
    id: string,
    customerId: string
  ): Promise<FollowUps[]> {
    return await this.db
      .collection('users/' + id + '/Follow Ups', (ref) =>
        ref.where('customerId', '==', customerId)
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
              } as FollowUps)
          )
        )
      )
      .toPromise();
  }
  async getTasksWithCustomer(id: string, customerId: string): Promise<Task[]> {
    return await this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref.where('customerId', '==', customerId)
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
              } as Task)
          )
        )
      )
      .toPromise();
  }
  async getAttsWithCustomer(id: string, cid): Promise<Attachments[]> {
    return await this.db
      .collection(
        'users/' + id + '/customers/' + cid + '/attachments',
        (ref) => ref
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
              } as Attachments)
          )
        )
      )
      .toPromise();
  }
  //for saving logs of deleting documents
  addToDeleteLog(id, lines) {
    return this.db.collection('users/' + id + '/deleteLogs').add({ ...lines });
  }
  // get all sales of this customer
  getSaleswithCustomer(id: string, customerId) {
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref.where('customerId', '==', customerId)
      )
      .snapshotChanges();
  }

  // get all invoices of this customer
  getInvoiceswithCustomer(id: string, customerId) {
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref.where('customerData.custID', '==', customerId)
      )
      .snapshotChanges();
  }
  // get all sales of this customer
  getServiceswithCustomer(id: string, customerId) {
    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref.where('customerId', '==', customerId)
      )
      .snapshotChanges();
  }

  // get all followUps of this customer
  getFollowUpsWithCustomer(id: string, customerId) {
    return this.db
      .collection('users/' + id + '/Follow Ups', (ref) =>
        ref.where('customerId', '==', customerId)
      )
      .snapshotChanges();
  }
  // get all tasks of this customer
  getTaskswithCustomer(id: string, customerId) {
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref.where('customerId', '==', customerId)
      )
      .snapshotChanges();
  }
  //  get all attachments of this customer
  getAttachmentsWithCustomer(id: string, cid) {
    return this.db
      .collection(
        'users/' + id + '/customers/' + cid + '/attachments',
        (ref) => ref
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
    return this.db.doc('users/' + userId + '/tasks/' + id).delete().then(async (res) => {
      //delete comments from task
      const qry = await this.db
        .collection('users/' + userId + '/tasks/' + id + '/comments')
        .ref.get();
      qry.forEach((doc) => {
        doc.ref.delete();
      });
      //delete attachemnts from task
      const qryAtt = await this.db
        .collection('users/' + userId + '/tasks/' + id + '/attachments')
        .ref.get();
      qryAtt.forEach((doc) => {
        doc.ref.delete();
      });
    });
  }
  // update total attachment size under user
  updateSize(id: any, size: any) {
    this.db.doc('users/' + id).update({ totalAttachmentsSize: size });
  }
  deleteAtt(superUserId, orgId: string, attId) {
    this.db
      .doc(
        'users/' + superUserId + '/customers/' + orgId + '/attachments/' + attId
      )
      .delete();
  }
  // quotations associated with this customer
  getQuotations(userId: string, custId: string, dataAccessRule, subId) {
    return this.db
      .collection('users/' + userId + '/Quotations', (ref) =>
        ref.where('customerData.custID', '==', custId)
      )
      .snapshotChanges();
  }
  // estimates associated with this customer
  getEstimate(userId: string, custId: string, dataAccessRule, subId) {
    return this.db
      .collection('users/' + userId + '/Estimates', (ref) =>
        ref.where('customerData.custID', '==', custId)
      )
      .snapshotChanges();
  }
  // invoicess associated with this customer
  getInvoices(id: string, custId: string, dataAccessRule, subId) {
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref.where('customerData.custID', '==', custId)
      )
      .snapshotChanges();
  }
  //expenses associated with this customer
  getExpenses(id: string, custId: string, dataAccessRule, subId) {
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
  // get attachmets under task
  getAttachmentsTask(userId: string, taskId: string) {
    return this.db
      .collection(
        'users/' + userId + '/tasks/' + taskId + '/attachments',
        (ref) => ref.orderBy('date', 'desc')
      )
      .snapshotChanges();
  }
}
