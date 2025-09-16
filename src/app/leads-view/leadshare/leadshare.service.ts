import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Leads, Profile } from '../../data-models';

@Injectable({
  providedIn: 'root',
})
export class LeadshareService {
  user: firebase.default.UserInfo;
  usid: any;

  constructor(private db: AngularFirestore) {
    this.usid = firebase.default.auth().currentUser.uid;
  }
  getlead() {
    return this.db
      .collection('SharedLeads/', (ref) => ref.orderBy('createDate', 'desc'))
      .snapshotChanges();
  }

  getNew(path1, itemId: string) {
    return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
  }
  getLeadDetails(id: string) {
    return this.db.doc<Leads>('SharedLeads/' + id).valueChanges();
  }
  getUser(path1, itemId: string) {
    return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
  }
  getUserPurchasedLead(usersId: string) {
    return this.db
      .collection('users/' + usersId + '/PurchasedLeads', (ref) => ref)
      .snapshotChanges();
  }
}
