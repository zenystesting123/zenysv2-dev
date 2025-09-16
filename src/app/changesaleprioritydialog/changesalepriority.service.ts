import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChangesalepriorityService {
  constructor(private db: AngularFirestore) {}

  //update sale prioriy fn
  updateSalePriority(uId: string, id: string, data: {}) {
    this.db.doc('users/' + uId + '/sales/' + id).update(data);
  }
}
