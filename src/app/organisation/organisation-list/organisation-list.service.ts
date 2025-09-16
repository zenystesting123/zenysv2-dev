import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CustomerNotes, PaymentReceipt } from 'src/app/data-models';

@Injectable({
  providedIn: 'root',
})
export class OrganisationListService {
  constructor(private db: AngularFirestore) {}

  //  update assignedTo field
  updateAssignedTo(
    id: string,
    cid: string,
    assignedTo: string,
    assignedToname: string,
    associatedBranch,
    changeLog: any
  ) {
    return this.db.doc('users/' + id + '/Organisations/' + cid).update({
      assignedTo: assignedTo,
      assignedToName: assignedToname,
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  deleteOrg(superUserId, orgId: string) {
    this.db.doc('users/' + superUserId + '/Organisations/' + orgId).delete();
  }
  deleteAtt(superUserId, orgId: string, attId) {
    this.db.doc('users/' + superUserId + '/Organisations/' + orgId + '/attachments/' + attId ).delete();
  }
  deleteNotes(superUserId, orgId: string, notesId) {
    this.db.doc('users/' + superUserId + '/Organisations/' + orgId + '/Notes/' + notesId).delete();
  }

  getAllCustomer(userId, orgId) {
    return this.db
      .collection('users/' + userId + '/customers', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }
  getAllSale(userId, orgId) {
    return this.db
      .collection('users/' + userId + '/sales', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }
  getAllService(userId, orgId) {
    return this.db
      .collection('users/' + userId + '/services', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }
  // get all followUps of this customer
  getAllFollowUps(id: string, orgId) {
    return this.db
      .collection('users/' + id + '/Follow Ups', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }
  // get all open tasks of this customer
  getAllTasks(id: string, orgId) {
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }
  // quotations associated with this customer
  getQuotations(userId: string, orgID: string) {
    const field = 'customerData.orgID';
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
  // exps associated with this customer
  getExp(id: string, orgId: string) {
    return this.db
      .collection<PaymentReceipt>('users/' + id + '/Expenses', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
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
  // fetch notes under this customer
  readNote(orgId: string, uId: string) {
    return this.db
      .collection<CustomerNotes>(
        'users/' + uId + '/Organisations/' + orgId + '/Notes',
        (ref) => ref.orderBy('createdDate', 'desc')
      )
      .snapshotChanges();
  }
  async onUpdateCustomer(userId, custId) {
    return await this.db
      .doc('users/' + userId + '/customers/' + custId)
      .update({ orgId: '', companyName: '' });
  }
  async onUpdateSale(userId, custId) {
    return await this.db
      .doc('users/' + userId + '/sales/' + custId)
      .update({ orgId: '', companyName: '' });
  }
  async onUpdateSupport(userId, custId) {
    return await this.db
      .doc('users/' + userId + '/services/' + custId)
      .update({ orgId: '', companyName: '' });
  }
  async onUpdateTask(userId, custId) {
    return await this.db
      .doc('users/' + userId + '/tasks/' + custId)
      .update({ orgId: '', company: '' });
  }
  async onUpdateFoll(userId, custId) {
    return await this.db
      .doc('users/' + userId + '/Follow Ups/' + custId)
      .update({ orgId: '', companyName: '' });
  }
  //update change in payment list
  onUpdatePaymentOrg(id, paymentId) {
    return this.db
      .doc('users/' + id + '/paymentsreceived/' + paymentId)
      .update({
        customerCompany: '',
        orgId: '',
      });
  }
  //update change in invoice list
  onUpdateInvoiceOrg(id, invoiceId) {
    return this.db.doc('users/' + id + '/Invoices/' + invoiceId).update({
      'customerData.orgID': '',
      'customerData.companyName': '',
      'searchTerm.companyName': '',
    });
  }
  //update change in estimate list
  onUpdateEstimateOrg(id, quoId) {
    return this.db.doc('users/' + id + '/Estimates/' + quoId).update({
      'customerData.orgID': '',
      'customerData.companyName': '',
      'searchTerm.companyName': '',
    });
  }
  //update change in quotation list
  onUpdateQuotationOrg(id, estId) {
    return this.db.doc('users/' + id + '/Quotations/' + estId).update({
      'customerData.orgID': '',
      'customerData.companyName': '',
      'searchTerm.companyName': '',
    });
  }
  //update change in expense list
  onUpdateExpenseOrg(id, expId) {
    return this.db.doc('users/' + id + '/Expenses/' + expId).update({
      customerCompany: '',
      orgId: '',
    });
  }
  // update total attachment size under user
  updateSize(id: any, size: any) {
    this.db.doc('users/' + id).update({ totalAttachmentsSize: size });
  }

}
