import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { Customer } from '../data-models';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Addcontactservices1Service {
  userData: Customer = {
    //for setting contact details with data type
    rejectionReasonValue: '',
    taggedUsers: null,
    inPipeline: null,
    won: null,
    lost: null,
    orgId: null,
    unConfirmedSales: null,
    associatedBranch: null,
    amountToBeCollected: null,
    taskOpen: null,
    lifeTimeValue: null,
    id: null,
    pan: null,
    taxId: null,
    assignedTo: null,
    leadSource: null,
    assignedToName: null,
    billingaddress1: null,
    billingaddress2: null,
    custLeadValue: null,
    bpin: null,
    createdBy: null,
    companyName: null,
    code: null,
    altContactCode: null,
    custLead: null,
    collectedAmount: null,
    contactNo: null,
    country: null,
    dateCreated: null,
    additionalFieldsArray: null,
    additionalFieldsArr: null,
    days: null,
    daysRange: null,
    createdDate: null,
    district: null,
    email: null,
    firstName: null,
    followUpFlag: null,
    invoicedAmount: null,
    month: null,
    ongoingSales: null,
    priority: null,
    saleOngoingValue: null,
    salePipelineValue: null,
    secondName: null,
    state: null,
    status: null,
    totalAmountCollected: null,
    createdYear: null,
    isCompany: null,
    stageHistory: null,
    currentStatusDate: null,
    searchTerm: null,
    sequenceNumber: null,
    salutation: null,
    surname: null,
    alternateContactNumber: null,
    department: null,
    selectedContactPipeline: 0,
    changeLog: null,
    lastAddedNote: '',
    lastNoteDate: null,
    lastNoteId: '',
    nextFollowupDate: '',
    lastModifiedDate: null,
    assignedToDate: null
  };

  constructor(private db: AngularFirestore) {}
  //for sharing customer data type
  getValuesCustData() {
    return this.userData;
  }
  //for creating a new customer in db
  create(
    userId,
    form,
    date,
    assignedToName,
    month,
    year,
    sid,
    stages,
    updateDate,
    fieldArray,
    searchTerm,
    contactSequentialNumber,
    inPipeline, won, lost, changeLog
  ) {
    return this.db.collection('users/' + sid + '/customers').add({
      ...form,
      dateCreated: date,
      assignedToName: assignedToName,
      month: month,
      createdYear: year,
      totalAmountCollected: 0,
      followUpFlag: 0,
      createdBy: userId,
      additionalFieldsArr: fieldArray,
      stageHistory: stages,
      currentStatusDate: updateDate,
      searchTerm: searchTerm,
      sequenceNumber: contactSequentialNumber,
      inPipeline, won, lost, changeLog, lastModifiedDate: new Date().getTime()
    });
  }
  //for updating inquiry if creating customer from inquiry list
  opportunityCreated(uid, id: string) {
    return this.db
      .doc('users/' + uid + '/Inquiries/' + id)
      .update({ status: 'Opportunity Created' });
  }

  //update customer detail if status is changed
  update(
    id: string,
    form,
    date,
    assignedToName,
    sid,
    stageHistory,
    updateDate,
    fieldArray,
    searchTerm,
    inPipeline, won, lost, changeLog
  ) {
    return this.db.doc('users/' + sid + '/customers/' + id).update({
      ...form,
      assignedToName: assignedToName,
      stageHistory: stageHistory,
      currentStatusDate: updateDate,
      additionalFieldsArr: fieldArray,
      searchTerm: searchTerm,
      inPipeline, won, lost, changeLog, lastModifiedDate: new Date().getTime()
    });
  }
  //update customer details if status is not changed
  updateCustNostatusChange(
    id: string,
    form,
    date,
    assignedToName,
    sid,
    fieldArray,
    searchTerm,inPipeline, won, lost, changeLog
  ) {

    return this.db.doc('users/' + sid + '/customers/' + id).update({
      ...form,
      assignedToName: assignedToName,
      additionalFieldsArr: fieldArray,
      searchTerm: searchTerm,inPipeline, won, lost, changeLog, lastModifiedDate: new Date().getTime()
    });
  }
  updateinsub(
    id: string,
    form,
    date,
    assignedToName,
    month,
    year,
    leadDate,
    prospectDate,
    opportunityDate,
    customerDate,
    rejectionDate,
    category1Title,
    category2Title,
    custField1,
    custField2,
    custField3,
    custField4,
    mid
  ) {
    return this.db.doc('users/' + mid + '/customers/' + id).update({
      ...form,
      assignedToName: assignedToName,
      month: month,
      year: year,
      leadStageDate: leadDate,
      prospStageDate: prospectDate,
      oppStageDate: opportunityDate,
      customerDate: customerDate,
      rejectionDate: rejectionDate,
      custCategory1Title: category1Title,
      custCategory2Title: category2Title,
      custField1Title: custField1,
      custField2Title: custField2,
      custField3Title: custField3,
      custField4Title: custField4,
    });
  }
  //getting customer details while updating
  getCustomer(id: string, uId: string) {
    return this.db
      .doc<Customer>('users/' + uId + '/customers/' + id)
      .valueChanges();
  }
  //for getting all sales with customer id
  getAllSales(id: string, customerId) {
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref.where('customerId', '==', customerId)
      )
      .snapshotChanges();
  }
  //added here
  //for getting all services with customer id
  getAllServices(id: string, customerId) {
    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref.where('customerId', '==', customerId)
      )
      .snapshotChanges();
  }
  //for getting all followup with customer id
  getAllFollowUps(id: string, customerId) {
    return this.db
      .collection('users/' + id + '/Follow Ups', (ref) =>
        ref.where('customerId', '==', customerId)
      )
      .snapshotChanges();
  }
  //for getting all payments with customer id
  getAllPayments(id: string, customerId) {
    return this.db
      .collection('users/' + id + '/paymentsreceived', (ref) =>
        ref.where('customerId', '==', customerId)
      )
      .snapshotChanges();
  }
  //for getting all task with customer id
  getAllTasks(id: string, customerId) {
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref.where('customerId', '==', customerId)
      )
      .snapshotChanges();
  }
  //for getting all expense with customer id
  getAllExpenses(id: string, customerId) {
    return this.db
      .collection('users/' + id + '/Expenses', (ref) =>
        ref.where('customerId', '==', customerId)
      )
      .snapshotChanges();
  }
  //update change in sale list
  onUpdateSaleCustomerName(
    id,
    saleId,
    customerFirstName,
    customerSecondName,
    customerSurname,
    companyName,
    firstName,
    secondName,
    surname,
    companyNames,
    countryCode,
    contactNumber,
    altCountryCode,
    altContactNumber
  ) {
    return this.db
      .doc('users/' + id + '/sales/' + saleId)
      .update({
        firstName: customerFirstName,
        secondName: customerSecondName,
        surname:customerSurname,
        // companyName: companyName,
        'searchTerm.firstName': firstName,
        'searchTerm.secondName': secondName,
        'searchTerm.surname' : surname,
        // 'searchTerm.companyName': companyNames,
        countryCode: countryCode,
        contactNumber: contactNumber,
        altCountryCode: altCountryCode, 
        altContactNumber: altContactNumber
      });
  }
  //update change in service list
  onUpdateServiceCustomerName(
    id,
    serviceId,
    customerFirstName,
    customerSecondName,
    customerSurname,
    companyName,
    firstName,
    secondName,
    surname,
    companyNames,
    countryCode,
    contactNumber,
    altCountryCode,
    altContactNumber
  ) {
    return this.db
      .doc('users/' + id + '/services/' + serviceId)
      .update({
        firstName: customerFirstName,
        secondName: customerSecondName,
        surname:customerSurname,
        // companyName: companyName,
        'searchTerm.firstName': firstName,
        'searchTerm.secondName': secondName,
        'searchTerm.surname' : surname,
        // 'searchTerm.companyName': companyNames,
        countryCode: countryCode,
        contactNumber: contactNumber,
        altCountryCode: altCountryCode, 
        altContactNumber: altContactNumber
      });
  }
  //update change in followup list
  onUpdateFollowUpCustomerName(id, followUpId, customerName, companyName) {
    return this.db
      .doc('users/' + id + '/Follow Ups/' + followUpId)
      .update({ customerName: customerName });
  }
  //update change in task list
  onUpdateTaskCustomerName(
    id,
    taskId,
    customerFirstName,
    customerSecondName,
    customerSurname,
    companyName
  ) {
    return this.db
      .doc('users/' + id + '/tasks/' + taskId)
      .update({
        name: customerFirstName,
        lastName: customerSecondName,
        surname: customerSurname
        // company: companyName,
      });
  }
  //update change in payment list
  onUpdatePaymentCustomerName(
    id,
    paymentId,
    customerFirstName,
    customerSecondName,
    companyName
  ) {
    return this.db
      .doc('users/' + id + '/paymentsreceived/' + paymentId)
      .update({
        customerName: customerFirstName,
        customerSecondName: customerSecondName,
        // customerCompany: companyName,
      });
  }
 
  //update change in expense list
  onUpdateExpenseCustomerName(
    id,
    expId,
    customerFirstName,
    customerSecondName,
    companyName
  ) {
    return this.db
      .doc('users/' + id + '/Expenses/' + expId)
      .update({
        customerFirstName: customerFirstName,
        customerSecondName: customerSecondName,
        // customerCompany: companyName,
      });
  }
  //for updating contactsequencenumber
  updateContactSequenceNumber(id: string, contactSequentialNumber) {
    return this.db
      .doc('users/' + id)
      .update({ contactSequentialNumber: contactSequentialNumber });
  }
  async getEmailWithContact(superUserId, email): Promise<any> {
    return await this.db
      .collection('users/' + superUserId + '/customers', (ref) =>
        ref.where('email', '==', email)
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
              } as Customer)
          )
        )
      )
      .toPromise();
  }

  async getContactNumWithContact(superUserId, contactNo): Promise<Customer[]> {
    return await this.db
      .collection('users/' + superUserId + '/customers', (ref) =>
        ref.where('contactNo', '==', contactNo)
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
              } as Customer)
          )
        )
      )
      .toPromise();
  }
  async getAltContactNumWithContact(superUserId, alternateContactNumber): Promise<Customer[]> {
    return await this.db
      .collection('users/' + superUserId + '/customers', (ref) =>
        ref.where('alternateContactNumber', '==', alternateContactNumber)
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
              } as Customer)
          )
        )
      )
      .toPromise();
  }
  updateFollowup(id: string, followupId: string, customerId, customerName, companyName) {
    return this.db
      .doc('users/' + id + '/Follow Ups/' + followupId)
      .update({
        customerId: customerId,
        customerName:customerName,
        // companyName:companyName,
      });
  }
}
