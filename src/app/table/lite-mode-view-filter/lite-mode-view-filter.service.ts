import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LiteModeViewFilterService {

  constructor(private db: AngularFirestore) { }
  onSaveMyView(userId, viewSettings, module) {
    return this.db.collection('users/' + userId + '/myViews').add({
      ...viewSettings,
      module: module
    });
  }
  onSavePublicViews(superUserId, viewSettings, module, userId) {
    return this.db.collection('users/' + superUserId + '/publicViews').add({
      ...viewSettings,
      module: module,
      createdBy: userId
    });
  }
  onEditMyView(userId, viewSettings, docId) {
    return this.db.doc('users/' + userId + '/myViews/' + docId).update({
      ...viewSettings,
    });
  }
  onEditPublicViews(superUserId, viewSettings,  docId) {
    return this.db.doc('users/' + superUserId + '/publicViews/' + docId).update({
      ...viewSettings
    });
  }
}
