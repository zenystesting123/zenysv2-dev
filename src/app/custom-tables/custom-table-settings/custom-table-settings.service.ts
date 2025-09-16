import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CustomTableSettingsService {

  constructor(private db: AngularFirestore) { }
  updateDisplayColumn(userId:string, keyValuePair: {}) {
   return this.db.doc('users/' + userId).update(keyValuePair)
  }
}
