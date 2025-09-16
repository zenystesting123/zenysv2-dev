import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { ProductModel } from '../data-models';

@Injectable({
  providedIn: 'root',
})
export class ProductsAndServicesService {
  constructor(private db: AngularFirestore) {}
  // create Product
  createProduct(sid, newProduct) {
    return this.db
      .collection('users/' + sid + '/products')
      .add({ ...newProduct });
  }
  // get products in descending order
  getProducts(sid: string) {
    return this.db
      .collection('users/' + sid + '/products', (ref) =>
        ref.orderBy('dateCreated', 'desc')
      )
      .snapshotChanges();
  }
  // get Single product
  getSingleProduct(sid, id: string) {
    return this.db
      .doc<ProductModel>('users/' + sid + '/products/' + id)
      .valueChanges();
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
  //delete product
  deleteProduct(sid, productId) {
    this.db.doc('users/' + sid + '/products/' + productId).delete();
  }
  // CSV ADDITION
  saveExcel(id, lines) {
    return this.db.collection('users/' + id + '/products').add({ ...lines });
  }
  getSaleswithItems(prodId) {
    return this.db
      .collectionGroup('sales', (ref) => ref.where('productId', '==', prodId))
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
                ref: a.payload.doc.ref,
                refId: a.payload.doc.ref.path,
              } as any)
          )
        )
      )
      .toPromise();
  }

  getSaleItems(sId, index, prodId){
    let queryItem = `itemsArray.${index}.productId`;
    return this.db.collection('users/' + sId + '/sales' , (ref) =>
    ref.where(queryItem, '==', prodId)
  ).snapshotChanges();
  }
  async updateCatNameInItem(
    sid,
    saleid,
    itemsArray
  ) {

    return await this.db
      .doc('users/' + sid + '/sales/' + saleid)
      .update({ itemsArray });
  }
}
