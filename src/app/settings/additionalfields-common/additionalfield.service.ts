import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdditionalfieldService {

  constructor(private db: AngularFirestore) { }
    //for updating latest additional field update to db in user level
    updateCustomFields(id,fieldName,fields) {
      // console.log(fields)
      var obj={}
      obj[fieldName]=fields;
      // console.log(obj)
      // return this.db.doc('users/' + id).update({ customFieldsContact: fields });
      return this.db.doc('users/' + id).update(obj);
    }
}
