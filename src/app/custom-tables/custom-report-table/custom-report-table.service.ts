import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class CustomReportTableService {
  constructor(private db: AngularFirestore, private http: HttpClient) {}
  // fetch message templates from db only for contacts
  getBulkMessagesCount(superUserId) {
    var startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    var endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return this.db
      .collection('users/' + superUserId + '/bulkMessaging', (ref) =>
        ref.where('date', '>=', startOfToday).where('date', '<=', endOfToday)
      )
      .snapshotChanges();
  }
  // fetch todays bulk emails
  getBulkEmails(superUserId) {
    var startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    var endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return this.db
      .collection('users/' + superUserId + '/bulkMails', (ref) =>
        ref.where('date', '>=', startOfToday).where('date', '<=', endOfToday)
      )
      .snapshotChanges();
  }
  //delete product
  deleteProduct(sid, productId) {
    this.db.doc('users/' + sid + '/products/' + productId).delete();
  }
  // updateProduct
  updateProduct(
    sid: string,
    productId: string,
    prodName,
    hsnCode,
    prodDes,
    currency,
    unitPrice,
    unit,
    taxType,
    discount,
    cgst,
    sgst,
    igst,
    availability,
    vatRate,
    prodCategory
  ) {
    this.db.doc('users/' + sid + '/products/' + productId).update({
      prodName: prodName,
      hsnCode: hsnCode,
      prodDes: prodDes,
      currency: currency,
      unitPrice: unitPrice,
      unit: unit,
      taxType: taxType,
      discount: discount,
      cgst: cgst,
      sgst: sgst,
      igst: igst,
      availability: availability,
      vatRate: vatRate,
      prodCategory: prodCategory,
    });
  }
  // updateProduct
  updateProductWIthAdd(
    sid: string,
    productId: string,
    prodName,
    hsnCode,
    prodDes,
    currency,
    unitPrice,
    unit,
    taxType,
    discount,
    cgst,
    sgst,
    igst,
    availability,
    vatRate,
    prodCategory,
    additionalFieldsArr
  ) {
    this.db.doc('users/' + sid + '/products/' + productId).update({
      prodName,
      hsnCode,
      prodDes,
      currency,
      unitPrice,
      unit,
      taxType,
      discount,
      cgst,
      sgst,
      igst,
      availability,
      vatRate,
      prodCategory,
      additionalFieldsArr,
    });
  }
  getSaleItems(sId, index, prodId) {
    let queryItem = `itemsArray.${index}.productId`;
    return this.db
      .collection('users/' + sId + '/sales', (ref) =>
        ref.where(queryItem, '==', prodId)
      )
      .snapshotChanges();
  }
  async updateCatNameInItem(sid, saleid, itemsArray) {
    return await this.db
      .doc('users/' + sid + '/sales/' + saleid)
      .update({ itemsArray });
  }
}
