import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class OrganisationSettingService {

  constructor( private db:AngularFirestore) { }
    //customisable field
    updateFieldCustomization(superUserId, organisationSettings) {
      return this.db.doc('users/' + superUserId).update({
        organisationSettings
       });
    }
    updateOrgfieldName(superUserId: string, fieldName) {
      var nestedkey = 'fieldNameOrganization';
      return this.db.doc('users/' + superUserId).update({
        [`fieldNames.${nestedkey}`]: fieldName,
      });
    }
}
