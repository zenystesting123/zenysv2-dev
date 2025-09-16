import { leadCaptureFields } from 'src/app/data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class LeadCaptureSettingsService {
  constructor(private db: AngularFirestore) {}

  // read already existing user profiles under this superuser
  getDefaultProfiles(id: string) {
    return this.db
      .collection('users/' + id + '/profilesDefault', (ref) => ref)
      .snapshotChanges();
  }

  //updates Lead Capture Field Settings in user level
  updateFieldSettings(
    leadCaptureId,
    fields,
    forms,
    formTitles,
    logoStatus,
    activeStatus,
    logoUrl,
    byProfileCallerIndex,
    byUserCallerIndex,
    assignedToRole,
    assignedToArray,
    profileName
  ) {
    
    return this.db
      .doc('sharedLeadCaptureForms/' + leadCaptureId)
      .update({
        leadCaptureFields: fields,
        leadCaptureFormNames: forms,
        leadCaptureFormTitles: formTitles,
        logoStatus,
        activeStatus,
        logoUrl,
        byProfileCallerIndex,
        byUserCallerIndex,
        assignedToRole,
        assignedToArray,
        profileName
      });
  }

  //updates form name on edit
  updateFormName(leadCaptureId, forms) {
    return this.db
      .doc('sharedLeadCaptureForms/' + leadCaptureId)
      .update({ leadCaptureFormNames: forms });
  }

  //updates form title on edit
  updateFormTitle(leadCaptureId, formTitles) {
    return this.db
      .doc('sharedLeadCaptureForms/' + leadCaptureId)
      .update({ leadCaptureFormTitles: formTitles });
  }

  //adds new form to shared lead capture collection
  createSharedLeadCaptureForm(
    superUserId: string,
    fields,
    forms,
    formTitles,
    logoStatus,
    activeStatus,
    logoUrl,
    byProfileCallerIndex,
    byUserCallerIndex,
    assignedToRole,
    assignedToArray,
    profileName
  ) {
    return this.db
      .collection('sharedLeadCaptureForms')
      .add({
        superUserId: superUserId,
        leadCaptureFields: fields,
        leadCaptureFormNames: forms,
        leadCaptureFormTitles: formTitles,
        logoStatus,
        activeStatus,
        logoUrl,
        byProfileCallerIndex,
        byUserCallerIndex,
        assignedToRole,
        assignedToArray,
        profileName
      });
  }

  //deletes the deleted form details from sharedLeadCaptureForms collection
  deleteSharedLeadCaptureForm(id) {
    return this.db.doc('sharedLeadCaptureForms/' + id).delete();
  }

  updateSharedFormId(id, sharedID, url) {
    return this.db
      .doc('sharedLeadCaptureForms/' + id)
      .update({ sharedFormIds: sharedID, sharedFormURLs: url });
  }

  getSharedLeadCaptureForms(superUserId) {
    return this.db
      .collection('sharedLeadCaptureForms', (ref) =>
        ref.where('superUserId', '==', superUserId)
      )
      .snapshotChanges();
  }

  logoStatus(id, logoStatus) {
    return this.db.doc('sharedLeadCaptureForms/' + id).update({ logoStatus });
  }
}
