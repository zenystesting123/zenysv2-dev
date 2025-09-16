import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserinfoService {

  constructor(private db:AngularFirestore) { }
  getUsers() { 
    return this.db
    .collection("users")
    .snapshotChanges()
  }
}
