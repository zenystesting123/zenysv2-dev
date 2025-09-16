import { Sales, Customer, Invoice, PaymentReceipt, OrganisationModel } from './../data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class Paymentreceipt1Service {
  constructor(public http: HttpClient, private db: AngularFirestore) {}
  ///for getting all customer for auto complete of selecting customer
  getCustomers(id) {
    return this.db.collection('users/' + id + '/customers').snapshotChanges();
  }
  //for getting details of a particular sale
  getSale(userId: string, saleId: string) {
    return this.db
      .doc<Sales>('users/' + userId + '/sales/' + saleId)
      .valueChanges();
  }
  //get details of a purticular customer
  getCustomer(userId: string, custId: string) {
    return this.db
      .doc<Customer>('users/' + userId + '/customers/' + custId)
      .valueChanges();
  }

  //get details of a purticular org
  getOrg(userId: string, orgId: string) {
    return this.db
      .doc<OrganisationModel>('users/' + userId + '/Organisations/' + orgId)
      .valueChanges();
  }
  //for adding new payment recipet
  addPaymentReceipt(
    uId: string,
    form,
    saleId: string,
    saleTitle,
    createdById,
    createDate,
    invoice,
    prefixAndDocNumber,
    cId,
    cname,
    csecname,
    ccompany,
    orgId,
    fieldArray,
    changeLog
  ) {
    return this.db.collection('users/' + uId + '/paymentsreceived').add({
      ...form,
      saleid: saleId,
      saleTitle: saleTitle,
      createdById: createdById,
      createDate: createDate,
      invoiceno: invoice,
      invoiceprefixAndDocNumber: prefixAndDocNumber,
      customerId: cId,
      customerName: cname,
      customerSecondName: csecname,
      customerCompany: ccompany,
      additionalFieldsArr: fieldArray,
      orgId,
      changeLog
    });
  }
  //updating payment reciept
  updatePaymentReceipt(
    uId,
    payRecId,
    form: any,
    invoice,
    prefixAndDocNumber,
    fieldArray,
    changeLog
  ) {
    return this.db
      .doc('users/' + uId + '/paymentsreceived/' + payRecId)
      .update({
        ...form,
        invoiceno: invoice,
        invoiceprefixAndDocNumber: prefixAndDocNumber,
        additionalFieldsArr: fieldArray,
        changeLog
      });
  }
  //get invoice with specific sale id
  getInvoicesForSale(sId, uId) {
    return this.db
      .collection('users/' + uId + '/Invoices', (ref) =>
        ref.where('docData.saleID', '==', sId).orderBy('docData.createdDate', 'desc')
      )
      .snapshotChanges();
  }
  //get invoice with specific customer id
  getInvoicesForCustomer(customerId, uId) {
    return this.db
      .collection('users/' + uId + '/Invoices', (ref) =>
        ref.where('customerData.custID', '==', customerId).orderBy('docData.createdDate', 'desc')
      )
      .snapshotChanges();
  }
  //get payment details while updating
  getPaymentDetails(id: string, id1: string) {
    return this.db
      .doc<PaymentReceipt>('users/' + id + '/paymentsreceived/' + id1)
      .valueChanges();
  }
  //getting all sales
  async getAllSalesFromDb(superUserId: string, queryId: string[], dataAccessRule, custId) {
    if (dataAccessRule === 'All') {
      return await this.db
        .collection<Sales>('users/' + superUserId + '/sales', (ref) =>
          ref.orderBy('createdDate', 'desc').where('customerId', '==', custId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Own' || dataAccessRule === 'Team') {
      return await this.db
        .collection<Sales>('users/' + superUserId + '/sales', (ref) =>
          ref.orderBy('createdDate', 'desc').where('assignedTo', 'in', queryId).where('customerId', '==', custId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Branch') {
      return await this.db
        .collection<Sales>('users/' + superUserId + '/sales', (ref) =>
          ref.orderBy('createdDate', 'desc').where('associatedBranch', 'in', queryId).where('customerId', '==', custId)
        )
        .snapshotChanges();
    }
  }
  //update changeLog of any module
  updateChangeLog(userId, modName, id, changeLog) {
    this.db
      .doc('users/' + userId + '/' + modName + '/' + id)
      .update({ changeLog, lastModifiedDate: new Date().getTime() });
  }
}
