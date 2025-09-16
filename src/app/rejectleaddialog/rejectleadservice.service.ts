import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
// import { Customers } from '../data-model.model';

@Injectable({
  providedIn: 'root'
})
export class RejectleadserviceService {

  constructor(private db: AngularFirestore) { }

  rejectContact(uId:string, id:string,data:{}) {
    return this.db.doc('users/' + uId + '/customers/' + id).update(data);
  }

}
