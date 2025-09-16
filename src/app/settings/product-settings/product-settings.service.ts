import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { ProductModel } from 'src/app/data-models';

@Injectable({
  providedIn: 'root',
})
export class ProductSettingsService {
  constructor(private db: AngularFirestore) {}

  updateProductSett(superUserId, productUnits) {
    return this.db.doc('users/' + superUserId).set(
      {
        productUnits: productUnits,
      },
      { merge: true }
    );
  }
  updateProdCategories(superUserId, productCategories) {
    return this.db.doc('users/' + superUserId).update({ productCategories });
  }
  getProducts(sid, catName) {
    // return this.db.collection('users/' + sid + 'products').snapshotChanges();
    return this.db
      .collection('users/' + sid + '/products', (ref) =>
        ref.where('prodCategory', '==', catName)
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
              } as ProductModel)
          )
        )
      )
      .toPromise();
  }
  async updateCatNameInProd(sid, pid, catName){
    return await this.db.doc('users/'+sid+'/products/'+pid).update({prodCategory: catName})
  }
  getSaleswithItems(pId) {
    return this.db
      .collectionGroup('items', (ref) => ref.where('productId', '==', pId))
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
  updateFieldCustomization(superUserId, productSettings) {
    return this.db.doc('users/' + superUserId).update({
      productSettings,
    });
  }
  //for updating latest additional field update to db in user level
  updateCustomFields(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsProduct: fields });
  }
    // Items
    updateItemsfieldName(superUserId: string, fieldName) {
      var nestedkey = 'fieldNameItems';
      return this.db.doc('users/' + superUserId).update({
        [`fieldNames.${nestedkey}`]: fieldName,
      });
    }
    updateItemscategoryfieldName(superUserId: string, fieldName) {
      var nestedkey = 'fieldNameItemsCategory';
      return this.db.doc('users/' + superUserId).update({
        [`fieldNames.${nestedkey}`]: fieldName,
      });
    }
}
