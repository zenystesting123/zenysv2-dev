import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class SaletabService {
  constructor(private db: AngularFirestore) {}
  saveBasic(userId, saleId, data) {
    return this.db.doc('users/' + userId + '/sales/' + saleId).update(data);
  }
}
