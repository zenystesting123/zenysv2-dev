import { fbLeadsIntegrationModel } from 'src/app/data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class PageSettingsService {
  constructor(private db: AngularFirestore) {}

  // read already existing user profiles under this superuser
  getDefaultProfiles(id: string) {
    return this.db
      .collection('users/' + id + '/profilesDefault', (ref) => ref)
      .snapshotChanges();
  }
  
  //updates fb lead Field Settings in user level
  updateFieldSettings(pageId, pageName, formId, formName, fields, assignedToArray, assignedToRole, profileName, byProfileCallerIndex, byUserCallerIndex) {
    return this.db
      .doc('FBForms/' + formId)
      .update({ pageName, formName, Fields: fields, assignedToArray, assignedToRole, profileName, byProfileCallerIndex, byUserCallerIndex });
  }

  //add form to db
  addNewLeadForm(
    superUserID,
    pageId,
    pageName,
    formId,
    formName,
    assignedToArray,
    assignedToRole,
    byProfileCallerIndex,
    byUserCallerIndex,
    formFields,
    profileName
  ) {
    return this.db
      .collection('FBForms/')
      .doc(formId)
      .set({
        superUserID,
        pageId,
        pageName,
        formId,
        formName,
        assignedToArray,
        assignedToRole,
        byProfileCallerIndex,
        byUserCallerIndex,
        Fields: formFields,
        profileName
      });
  }

  //fetch all leadd forms under superuser
  getFbLeadsIntegrationForms(superUserId) {
    return this.db
      .collection<fbLeadsIntegrationModel>('FBForms', (ref) =>
        ref.where('superUserID', '==', superUserId)
      )
      .snapshotChanges();
  }

  //delete fbform
  deleteFbLeadsIntegrationForms(formId) {
    return this.db
        .doc('FBForms/'+formId)
        .delete();
        
  }
}
