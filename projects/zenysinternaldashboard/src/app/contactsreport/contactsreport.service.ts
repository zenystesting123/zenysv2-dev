import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContactsreportService {

  constructor(private db:AngularFirestore) { }
  getCustomers(id:string){
    return this.db
    .collection('users/' + id + '/customers', (ref) => ref)
    .snapshotChanges();
  }
  getNew(path1,itemId:string) {
    return this.db.collection(path1).doc<any>(itemId).valueChanges();
  }
}
