import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Customer } from '../data-models';

@Injectable({
  providedIn: 'root',
})
export class CrudServiceService {
  constructor(private db: AngularFirestore) {}
 //geting customer details using id
  getCustomer(id: string, uId: string) {
    return this.db
      .doc<Customer>('users/' + uId + '/customers/' + id)
      .valueChanges();
  }
  //for creating service
  createservice(
    id: string,
    datePlaced,
    firstName,
    secondName,
    surname,
    companyName,
    assignedToName,
    form,
    sid,
    stages,
    updateDate,
    fieldArray,
    searchTerm,
    serviceSequenceNumber,
    inPipeline,
    won,
    lost,
    changeLog
  ) {
    return this.db.collection('users/' + sid + '/services').add({
      ...form,
      createdDate: datePlaced,
      firstName: firstName,
      secondName: secondName,
      surname,
      companyName: companyName,
      assignedToName: assignedToName,
      customerId: id,
      collectedAmount: 0,
      additionalFieldsArr: fieldArray,
      currentStatusDate: updateDate,
      searchTerm: searchTerm,
      sequenceNumber: serviceSequenceNumber,
      stageHistory: stages,
      inPipeline,
      won,
      lost,
      changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
 //for updating service with status change
  updateservice(
    id: string,
    assignedToName,
    form,
    sid,
    stageHistory,
    updateDate,
    fieldArray,
    inPipeline,
    won,
    lost,
    changeLog
  ) {
    this.db.doc('users/' + sid + '/services/' + id).update({
      ...form,
      assignedToName: assignedToName,
      additionalFieldsArr: fieldArray,
      stageHistory: stageHistory,
      currentStatusDate: updateDate,
      inPipeline,
      won,
      lost,
      changeLog,
      lastModifiedDate: new Date().getTime(),
    });
  }
  //for updating service without status change
  updateserviceNostatusChange(
    id: string,
    assignedToName,
    form,
    sid,
    fieldArray,
    inPipeline,
    won,
    lost,
    changeLog
  ) {
    this.db.doc('users/' + sid + '/services/' + id).update({
      ...form,
      assignedToName: assignedToName,
      additionalFieldsArr: fieldArray,
      inPipeline,
      won,
      lost,
      changeLog,
      lastModifiedDate: new Date().getTime(),
    });
  }

  //getting all payment with serviceID
  getAllPayments(id: string, serviceId) {
    return this.db
      .collection('users/' + id + '/paymentsreceived', (ref) =>
        ref.where('serviceid', '==', serviceId)
      )
      .snapshotChanges();
  }
  //getting all invoice with serviceID
  getAllInvoices(id: string, serviceId) {
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref.where('docData.serviceID', '==', serviceId)
      )
      .snapshotChanges();
  }
  //getting all quotation with serviceID
  getAllQuotations(id: string, serviceId) {
    return this.db
      .collection('users/' + id + '/Quotations', (ref) =>
        ref.where('docData.serviceID', '==', serviceId)
      )
      .snapshotChanges();
  }
  //getting all task with serviceID
  getAllTasks(id: string, serviceId) {
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref.where('serviceId', '==', serviceId)
      )
      .snapshotChanges();
  }
  //getting all followup with serviceID
  getAllFollowups(id: string, serviceId) {
    return this.db
      .collection('users/' + id + '/Follow Ups', (ref) =>
        ref.where('serviceId', '==', serviceId)
      )
      .snapshotChanges();
  }
  //getting all estimate with serviceID
  getAllEstimates(id: string, serviceId) {
    return this.db
      .collection('users/' + id + '/Estimates', (ref) =>
        ref.where('docData.serviceID', '==', serviceId)
      )
      .snapshotChanges();
  }
  //getting all expense with serviceID
  getAllExpenses(id: string, serviceId) {
    return this.db
      .collection('users/' + id + '/Expenses', (ref) =>
        ref.where('serviceId', '==', serviceId)
      )
      .snapshotChanges();
  }
  //updating service title in payments
  onUpdatePaymentserviceTitle(
    id,
    paymentId,
    serviceTitle,
    customerFirstName,
    customerSecondName,
    companyName
  ) {
    return this.db
      .doc('users/' + id + '/paymentsreceived/' + paymentId)
      .update({
        serviceTitle: serviceTitle,
      });
  }
  //updating service title in invoice
  onUpdateInvoiceserviceTitle(
    id,
    invoiceId,
    serviceTitle,
    customerFirstName,
    customerSecondName,
    companyName,
    searchTerm
  ) {
    return this.db
      .doc('users/' + id + '/Invoices/' + invoiceId)
      .update({
        'docData.serviceTitle': serviceTitle,
      });
  }
  //updating service title in quotation
  onUpdateQuotationserviceTitle(
    id,
    quoId,
    serviceTitle,
    customerFirstName,
    customerSecondName,
    companyName,
    searchTerm
  ) {
    return this.db
      .doc('users/' + id + '/Quotations/' + quoId)
      .update({
        'docData.serviceTitle': serviceTitle,
      });
  }
  //updating service title in estimates
  onUpdateEstimateserviceTitle(
    id,
    estId,
    serviceTitle,
    customerFirstName,
    customerSecondName,
    companyName,
    searchTerm
  ) {
    return this.db
      .doc('users/' + id + '/Estimates/' + estId)
      .update({
        'docData.serviceTitle': serviceTitle,
      });
  }
  //updating service title in expense
  onUpdateExpenseserviceTitle(
    id,
    expId,
    serviceTitle,
    customerFirstName,
    customerSecondName,
    companyName
  ) {
    return this.db
      .doc('users/' + id + '/Expenses/' + expId)
      .update({
        serviceTitle: serviceTitle,
      });
  }
  //updating service title in task
  onUpdateTaskserviceTitle(
    id,
    taskId,
    serviceTitle,
    customerFirstName,
    customerSecondName,
    companyName
  ) {
    return this.db
      .doc('users/' + id + '/tasks/' + taskId)
      .update({
        serviceTitle: serviceTitle,
      });
  }
  //updating service title in followup
  onUpdateFollowupserviceTitle(
    id,
    followupId,
    serviceTitle,
    customerName,
    companyName
  ) {
    return this.db
      .doc('users/' + id + '/Follow Ups/' + followupId)
      .update({ serviceTitle: serviceTitle,});
  }
  updateserviceSequenceNumber(id: string, serviceSequentialNumber) {
    return this.db
      .doc('users/' + id)
      .update({ serviceSequentialNumber: serviceSequentialNumber });
  }
}
