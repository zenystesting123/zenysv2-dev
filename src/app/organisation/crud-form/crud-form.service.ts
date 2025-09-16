import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Customer, OrganisationModel } from 'src/app/data-models';

@Injectable({
  providedIn: 'root',
})
export class CrudFormService {
  constructor(private db: AngularFirestore) {}

  // for add Organisation
  addOrganisation(
    superUserId,
    form,
  ) {
    return this.db.collection('users/' + superUserId + '/Organisations').add({
      ...form,
    });
  }

  // update Organisation details
  updateOrganisation(
    superUserId,
    orgId,
    form,
    code,
    contactNo,
    assignedTo,
    assignedToName,
    associatedBranch,
    searchTerm,
    additionalFields,
    changeLog,
    lastModifiedDate,
    assignedToDate
  ) {
    return this.db
      .doc<OrganisationModel>(
        'users/' + superUserId + '/Organisations/' + orgId
      )
      .update({
        ...form,
        code,
        contactNo,
        assignedTo,
        assignedToName,
        associatedBranch,
        searchTerm,
        changeLog,
        lastModifiedDate,
        additionalFieldsArr: additionalFields,
        assignedToDate
      });
  }
  //getting customer details while updating
  getAllCustomers(uId: string, orgId) {
    return this.db
      .collection('users/' + uId + '/customers', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }
  //for getting all sales with customer id
  getAllSales(id: string, orgId) {
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }
  //added here
  //for getting all services with customer id
  getAllServices(id: string, orgId) {
    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }
  //for getting all followup with customer id
  getAllFollowUps(id: string, orgId) {
    return this.db
      .collection('users/' + id + '/Follow Ups', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }
  //for getting all payments with customer id
  getAllPayments(id: string, orgId) {
    return this.db
      .collection('users/' + id + '/paymentsreceived', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }
  //for getting all invoices with customer id
  getAllInvoices(id: string, orgId) {
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref.where('customerData.custID', '==', orgId)
      )
      .snapshotChanges();
  }
  //for getting all quotation with customer id
  getAllQuotations(id: string, orgId) {
    return this.db
      .collection('users/' + id + '/Quotations', (ref) =>
        ref.where('customerData.custID', '==', orgId)
      )
      .snapshotChanges();
  }
  //for getting all estimate with customer id
  getAllEstimates(id: string, orgId) {
    return this.db
      .collection('users/' + id + '/Estimates', (ref) =>
        ref.where('customerData.custID', '==', orgId)
      )
      .snapshotChanges();
  }
  //for getting all task with customer id
  getAllTasks(id: string, orgId) {
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }
  //for getting all expense with customer id
  getAllExpenses(id: string, orgId) {
    return this.db
      .collection('users/' + id + '/Expenses', (ref) =>
        ref.where('orgId', '==', orgId)
      )
      .snapshotChanges();
  }
  //update change in sale list
  onUpdateCustomerName(id, saleId, companyName, companyNames) {
    return this.db.doc('users/' + id + '/customers/' + saleId).update({
      companyName: companyName,
      'searchTerm.companyName': companyNames,
    });
  }
  //update change in sale list
  onUpdateSaleCustomerName(id, saleId, companyName, companyNames) {
    return this.db.doc('users/' + id + '/sales/' + saleId).update({
      companyName: companyName,
      'searchTerm.companyName': companyNames,
    });
  }
  //update change in service list
  onUpdateServiceCustomerName(id, serviceId, companyName, companyNames) {
    return this.db.doc('users/' + id + '/services/' + serviceId).update({
      companyName: companyName,
      'searchTerm.companyName': companyNames,
    });
  }
  //update change in followup list
  onUpdateFollowUpCustomerName(id, followUpId, companyName) {
    return this.db
      .doc('users/' + id + '/Follow Ups/' + followUpId)
      .update({ companyName: companyName });
  }
  //update change in task list
  onUpdateTaskCustomerName(id, taskId, companyName) {
    return this.db.doc('users/' + id + '/tasks/' + taskId).update({
      company: companyName,
    });
  }
  //update change in payment list
  onUpdatePaymentCustomerName(id, paymentId, companyName) {
    return this.db
      .doc('users/' + id + '/paymentsreceived/' + paymentId)
      .update({
        customerCompany: companyName,
      });
  }
  //update change in invoice list
  onUpdateInvoiceCustomerName(id, invoiceId, companyName, companyNames) {
    return this.db.doc('users/' + id + '/Invoices/' + invoiceId).update({
      'customerData.companyName': companyName,
      'searchTerm.companyName': companyNames,
    });
  }
  //update change in estimate list
  onUpdateEstimateCustomerName(id, quoId, companyName, companyNames) {
    return this.db.doc('users/' + id + '/Estimates/' + quoId).update({
      'customerData.companyName': companyName,
      'searchTerm.companyName': companyNames,
    });
  }
  //update change in quotation list
  onUpdateQuotationCustomerName(id, estId, companyName, companyNames) {
    return this.db.doc('users/' + id + '/Quotations/' + estId).update({
      'customerData.companyName': companyName,
      'searchTerm.companyName': companyNames,
    });
  }
  sendMailoncreate(email) {
    return this.db.collection('email').add(email);
  }
  //update change in expense list
  onUpdateExpenseCustomerName(id, expId, companyName) {
    return this.db.doc('users/' + id + '/Expenses/' + expId).update({
      customerCompany: companyName,
    });
  }
  updateOrgSequenceNumber(id: string, orgSequenceNumber) {
    return this.db.doc('users/' + id).update({ orgSequenceNumber });
  }
}
