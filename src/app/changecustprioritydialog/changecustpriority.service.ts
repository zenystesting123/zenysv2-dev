import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChangecustpriorityService {

  constructor(private db: AngularFirestore) { }
  // updating fn
  updateContactPriority(uId:string, id:string,data:{}) {
    this.db.doc('users/' + uId + '/customers/' + id).update(data);
  }
}
