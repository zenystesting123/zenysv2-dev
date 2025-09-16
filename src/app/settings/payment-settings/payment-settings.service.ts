import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class PaymentSettingsService {

  constructor(private db: AngularFirestore) { }
   //for updating latest additional field update to db in user level
   updateCustomFields(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsPayment: fields });
  }
  updateFieldCustomization(superUserId, paymentSettings) {
    return this.db.doc('users/' + superUserId).update({
      paymentSettings
     });
  }
    // Collection
    updateCollectionfieldName(superUserId: string, fieldName) {
      var nestedkey = 'fieldNameCollection';
      return this.db.doc('users/' + superUserId).update({
        [`fieldNames.${nestedkey}`]: fieldName,
      });
    }
}
