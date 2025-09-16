import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChangesalestatService {
  constructor(private db: AngularFirestore) {}

  // sale status updating fn
  updateSaleStatus(
    uId: string,
    saleId: string,
    status,
    stageHistory,
    updateDate,
    inPipeline,
    won,
    lost,
    rejectionReasonValue,
    changeLog
  ) {
    this.db.doc('users/' + uId + '/sales/' + saleId).update({
      salesStage: status,
      stageHistory: stageHistory,
      currentStatusDate: updateDate,
      inPipeline,
      won,
      lost,
      rejectionReasonValue,
      changeLog,
      lastModifiedDate: new Date().getTime(),
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
  //  get products under user
  getProducts(sid: string) {
    return this.db.collection('users/' + sid + '/products').snapshotChanges();
  }
  // selected product save to DB
  addProduct(sid, saleId, newProduct) {
    return this.db
      .collection('users/' + sid + '/sales/' + saleId + '/items')
      .add({ ...newProduct });
  }
  // update estimated value in sales
  updateSaleEstValue(uId: string, saleId: string, estValue) {
    this.db.doc('users/' + uId + '/sales/' + saleId).update({
      estimatedValue: estValue,
    });
  }
  updateItemField(superUserId, saleId, itemsArray) {
    return this.db
      .doc('users/' + superUserId + '/sales/' + saleId)
      .update({ itemsArray });
  }
}
