import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Customer, Sales } from '../data-models';

@Injectable({
  providedIn: 'root',
})
export class Addnewsale1Service {
  userData: Sales = {
    //sale data model reference
    rejectionReasonValue: '',
    taggedUsers: null,
    itemsArray: null,
    orgId: null,
    id: null,
    associatedBranch: null,
    firstName: null,
    secondName: null,
    surname: null,
    additionalFieldsArray: null,
    additionalFieldsArr: null,
    companyName: null,
    saleTitle: null,
    description: null,
    estimatedValue: null,
    expCompletionDate: null,
    additionalFieldDate: null,
    startDate: null,
    salesStage: null,
    salesType: null,
    priority: null,
    assignedTo: null,
    assignedToName: null,
    collectionMode: null,
    saleField2: null,
    saleField1: null,
    saleField3: null,
    saleField4: null,
    saleCategory1: null,
    saleCategory2: null,
    saleField1Name: null,
    saleField2Name: null,
    saleField3Name: null,
    saleField4Name: null,
    collectedAmount: null,
    customerId: null,
    EstimatedValue: null,
    invoicedAmount: null,
    saleCategory1Name: null,
    saleCategory2Name: null,
    createdDate: null,
    days: null,
    daysRange: null,
    completedSaleDate: null,
    confirmedSaleDate: null,
    opportunityDate: null,
    inquiryDate: null,
    stageHistory: null,
    expenseAmount: null,
    searchTerm: null,
    sequenceNumber: null,
    selectedSalePipeline: null,
    changeLog: null,
    inPipeline: null,
    won: null,
    lost: null,
    createdBy: null,
    contactOwner: null,
    lastAddedNote: '',
    lastNoteDate: null,
    lastNoteId: '',
    assignedToDate: null,
    lastModifiedDate: null,
    countryCode: '',
    contactNumber: '',
    altCountryCode: '',
    altContactNumber: '',
  };

  constructor(private db: AngularFirestore) {}

  //geting customer details using id
  getCustomer(id: string, uId: string) {
    return this.db
      .doc<Customer>('users/' + uId + '/customers/' + id)
      .valueChanges();
  }
  //for creating sale
  createSale(
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
    saleSequenceNumber,
    inPipeline,
    won,
    lost,
    changeLog
  ) {
    return this.db.collection('users/' + sid + '/sales').add({
      ...form,
      createdDate: datePlaced,
      firstName: firstName,
      secondName: secondName,
      surname: surname,
      companyName: companyName,
      assignedToName: assignedToName,
      customerId: id,
      collectedAmount: 0,
      additionalFieldsArr: fieldArray,
      currentStatusDate: updateDate,
      searchTerm: searchTerm,
      sequenceNumber: saleSequenceNumber,
      stageHistory: stages,
      inPipeline,
      won,
      lost,
      changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  //for updating sale with status change
  updateSale(
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
    this.db.doc('users/' + sid + '/sales/' + id).update({
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
  //for updating sale without status change
  updateSaleNostatusChange(
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
    this.db.doc('users/' + sid + '/sales/' + id).update({
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
  //update saleId in purchased
  purchasedLeadUpdation(id, purchasedId: string, res: string) {
    return this.db
      .doc('users/' + id + '/PurchasedLeads/' + purchasedId)
      .update({ saleId: res });
  }
  //getting all payment with saleID
  getAllPayments(id: string, saleId) {
    return this.db
      .collection('users/' + id + '/paymentsreceived', (ref) =>
        ref.where('saleid', '==', saleId)
      )
      .snapshotChanges();
  }
  //getting all invoice with saleID
  getAllInvoices(id: string, saleId) {
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref.where('docData.saleID', '==', saleId)
      )
      .snapshotChanges();
  }
  //getting all quotation with saleID
  getAllQuotations(id: string, saleId) {
    return this.db
      .collection('users/' + id + '/Quotations', (ref) =>
        ref.where('docData.saleID', '==', saleId)
      )
      .snapshotChanges();
  }
  //getting all task with saleID
  getAllTasks(id: string, saleId) {
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref.where('saleId', '==', saleId)
      )
      .snapshotChanges();
  }
  //getting all followup with saleID
  getAllFollowup(id: string, saleId) {
    return this.db
      .collection('users/' + id + '/Follow Ups', (ref) =>
        ref.where('saleId', '==', saleId)
      )
      .snapshotChanges();
  }
  //getting all estimate with saleID
  getAllEstimates(id: string, saleId) {
    return this.db
      .collection('users/' + id + '/Estimates', (ref) =>
        ref.where('docData.saleID', '==', saleId)
      )
      .snapshotChanges();
  }
  //getting all expense with saleID
  getAllExpenses(id: string, saleId) {
    return this.db
      .collection('users/' + id + '/Expenses', (ref) =>
        ref.where('saleId', '==', saleId)
      )
      .snapshotChanges();
  }
  //updating sale title in payments
  onUpdatePaymentSaleTitle(
    id,
    paymentId,
    saleTitle,
    customerFirstName,
    customerSecondName,
    companyName
  ) {
    return this.db
      .doc('users/' + id + '/paymentsreceived/' + paymentId)
      .update({
        saleTitle: saleTitle,
      });
  }
  //updating sale title in invoice
  onUpdateInvoiceSaleTitle(
    id,
    invoiceId,
    saleTitle,
    customerFirstName,
    customerSecondName,
    companyName,
    searchTerm
  ) {
    return this.db.doc('users/' + id + '/Invoices/' + invoiceId).update({
      'docData.saleTitle': saleTitle,
    });
  }
  //updating sale title in quotation
  onUpdateQuotationSaleTitle(
    id,
    quoId,
    saleTitle,
    customerFirstName,
    customerSecondName,
    companyName,
    searchTerm
  ) {
    return this.db.doc('users/' + id + '/Quotations/' + quoId).update({
      'docData.saleTitle': saleTitle,
    });
  }
  //updating sale title in estimates
  onUpdateEstimateSaleTitle(
    id,
    estId,
    saleTitle,
    customerFirstName,
    customerSecondName,
    companyName,
    searchTerm
  ) {
    return this.db.doc('users/' + id + '/Estimates/' + estId).update({
      'docData.saleTitle': saleTitle,
    });
  }
  //updating sale title in expense
  onUpdateExpenseSaleTitle(
    id,
    expId,
    saleTitle,
    customerFirstName,
    customerSecondName,
    companyName
  ) {
    return this.db.doc('users/' + id + '/Expenses/' + expId).update({
      saleTitle: saleTitle,
    });
  }
  //updating sale title in task
  onUpdateTaskSaleTitle(
    id,
    taskId,
    saleTitle,
    customerFirstName,
    customerSecondName,
    companyName
  ) {
    return this.db.doc('users/' + id + '/tasks/' + taskId).update({
      saleTitle: saleTitle,
    });
  }
  //updating sale title in followup
  onUpdateFollowupSaleTitle(
    id,
    followupId,
    saleTitle,
    customerName,
    companyName
  ) {
    return this.db.doc('users/' + id + '/Follow Ups/' + followupId).update({
      saleTitle: saleTitle,
    });
  }
  //update sale sequence number in user collection
  updateSaleSequenceNumber(id: string, saleSequentialNumber) {
    return this.db
      .doc('users/' + id)
      .update({ saleSequentialNumber: saleSequentialNumber });
  }
  // read already existing branches under this superuser
  getBranches(id: string) {
    return this.db
      .collection('users/' + id + '/branches', (ref) => ref)
      .snapshotChanges();
  }
}
