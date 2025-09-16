import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private firestore: AngularFirestore) {}

  // check invitations with this email
  getInvitations(mail) {

    return this.firestore
      .collection('invitations', (ref) => ref.where('email', '==', mail))
      .snapshotChanges();
  }
}
