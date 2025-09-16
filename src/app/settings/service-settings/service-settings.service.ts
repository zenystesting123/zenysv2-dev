import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ServiceSettingsService {
  constructor(private db: AngularFirestore) { }
  //for getting profile defaults to enable and disable edit
  readProfileDefinition(superUserId: string, profilename: string) {
    return this.db
      .collection<any>('users/' + superUserId + '/profilesDefault', (ref) =>
        ref.where('profileName', '==', profilename)
      )
      .valueChanges();
  }
  //for updating latest additional field update to db in user level
  updateCustomFields(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsService: fields });
  }

  //customisable field setting
  updateFieldCustomization(superUserId, serviceSettings) {
    return this.db.doc('users/' + superUserId).update({
      serviceSettings,
    });
  }
  updateServicefieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameService';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  // serviceNotes
  updateContactNotesfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameServiceNotes';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  //service customdDocument_Upload
  docUpload(id, fields) {
    return this.db.doc('users/' + id).update({ serviceCustomDoc: fields });
  }
}
