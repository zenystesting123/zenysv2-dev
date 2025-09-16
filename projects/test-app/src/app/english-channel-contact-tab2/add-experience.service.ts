import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AddExperienceService {
  constructor(private db: AngularFirestore) {}
  getCustDetails(userId, custId) {
    return this.db
      .doc('users/' + userId + '/customers/' + custId)
      .valueChanges();
  }
  updateCust(userId, custId, data) {
    return this.db.doc('users/' + userId + '/customers/' + custId).update(data);
  }
}
