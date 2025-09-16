import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import {
  CustomerNotes,
  FollowUps,
  OrganisationModel,
  PaymentReceipt,
  Sales,
} from 'src/app/data-models';

@Injectable({
  providedIn: 'root',
})
export class OrganisationDetailsService {
  constructor(private db: AngularFirestore, private http: HttpClient) {}

  // fetching all FollowUps
  getAllFollowUps(orgId: string, userId: string) {
    //removing data access rule based check - MK on 30 July 2022
    return this.db
      .collection<FollowUps>('users/' + userId + '/Follow Ups', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }

  // followup task completed update under followups collection
  UpdateTask(followUpId: string, completed, uid, changeLog) {
    this.db
      .doc('users/' + uid + '/Follow Ups/' + followUpId)
      .update({ completedStatus: completed, changeLog, lastModifiedDate: new Date().getTime() });
  }

  // add attachment under Organisations attachment collection
  attachmentsToCollection(id, cid, name, url, path, date, uname, size) {
    return this.db
      .collection('users/' + id + '/Organisations/' + cid + '/attachments')
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
  readOrgRecord(uId: string, id: string) {
    return this.db
      .doc<OrganisationModel>('users/' + uId + '/Organisations/' + id)
      .valueChanges();
  }

  // get attachmets under customer
  getAttachments(userId: string, orgId: string) {
    return this.db
      .collection(
        'users/' + userId + '/Organisations/' + orgId + '/attachments',
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

  // get contacts
  getContacs(orgId: string, superUserId: string) {
    return this.db
      .collection<Sales>('users/' + superUserId + '/customers', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }
  // get sales based on dataAccessRule
  getSales(orgId: string, superUserId: string) {
    return this.db
      .collection<Sales>('users/' + superUserId + '/sales', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }
  // get sales based on dataAccessRule
  getServices(orgId: string, superUserId: string) {
    return this.db
      .collection<Sales>('users/' + superUserId + '/services', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }

  // update total attachment size under user
  updateSize(id: any, size: any) {
    this.db.doc('users/' + id).update({ totalAttachmentsSize: size });
  }

  // quotations associated with this customer
  getQuotations(userId: string, orgID: string) {
    let field = 'customerData.orgID';
    return this.db
      .collection('users/' + userId + '/Quotations', (ref) =>
        ref.where('customerData.orgID', '==', orgID)
      )
      .snapshotChanges();
  }

  // estimates associated with this customer
  getEstimate(userId: string, orgID: string) {
    return this.db
      .collection('users/' + userId + '/Estimates', (ref) =>
        ref.where('customerData.orgID', '==', orgID)
      )
      .snapshotChanges();
  }

  // invoicess associated with this customer
  getInvoices(id: string, orgID: string) {
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref.where('customerData.orgID', '==', orgID)
      )
      .snapshotChanges();
  }

  // collections associated with this customer
  getPaymentReceipt(id: string, orgId: string) {
    return this.db
      .collection<PaymentReceipt>('users/' + id + '/paymentsreceived', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }

  // have to cionfirm if its using
  // getPaymentReceiptsubUser(id: string, orgId: string, subId) {
  //   return this.db
  //     .collection<PaymentReceipt>('users/' + id + '/paymentsreceived', (ref) =>
  //       ref
  //         .where('orgId', '==', orgId)
  //         .where('status', '==', 'Open')
  //         .where('assignedTo', '==', subId)
  //     )
  //     .snapshotChanges();
  // }

  // fetching open tasks only
  getTasks(superUserId: string, orgId,lastStatusOption) {
    //MK - 28th July 2022 - Changing access rule check
    return this.db
      .collection('users/' + superUserId + '/tasks', (ref) =>
        ref.where('orgId', '==', orgId) .where('status', '!=', lastStatusOption).orderBy('status') // Add 'status' as the first argument
      )
      .snapshotChanges();
  }

  // fetching all tasks to this customer
  getAllTasks(id: string, orgId) {
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }

  // create new note under customer
  writeNote(
    form,
    createdById: string,
    createdDate: any,
    orgId: string,
    cratedByName: string,
    userId: string,
    changeLog: any
  ) {
    this.db
      .collection('users/' + createdById + '/Organisations/' + orgId + '/Notes')
      .add({
        ...form,
        createdById: userId,
        createdDate: createdDate,
        cratedByName: cratedByName,
      })
      .then((res) => {
        this.db.doc('users/' + createdById + '/Organisations/' + orgId).update({
          changeLog: changeLog,
          lastModifiedDate: new Date().getTime(),
        });
      });
  }

  // update edited note under customer
  updateNote(notes, createdById: string, orgId: string, noteId, changeLog) {
    this.db
      .doc(
        'users/' + createdById + '/Organisations/' + orgId + '/Notes/' + noteId
      )
      .update({
        notes: notes,
      })
      .then((res) => {
        this.db.doc('users/' + createdById + '/Organisations/' + orgId).update({
          changeLog: changeLog,
          lastModifiedDate: new Date().getTime(),
        });
      });
  }

  // fetch notes under this customer
  readNote(orgId: string, uId: string) {
    return this.db
      .collection<CustomerNotes>(
        'users/' + uId + '/Organisations/' + orgId + '/Notes',
        (ref) => ref.orderBy('createdDate', 'desc')
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
    this.db.doc('users/' + id + '/Organisations/' + cid).update({
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
    this.db.doc('users/' + id + '/Organisations/' + cid).update({
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
    });
  }

  //for deleting a task
  deleteTask(userId, taskid: string) {
    return this.db.doc('users/' + userId + '/tasks/' + taskid).delete().then(async (res) => {
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
  // read already existing branches under this superuser
  getBranches(id: string) {
    return this.db
      .collection('users/' + id + '/branches', (ref) => ref)
      .snapshotChanges();
  }
  deleteOrg(superUserId, orgId: string) {
    this.db.doc('users/' + superUserId + '/Organisations/' + orgId).delete();
  }
  //for saving logs of deleting documents
  addToDeleteLog(id, lines) {
    return this.db.collection('users/' + id + '/deleteLogs').add({ ...lines });
  }
}
