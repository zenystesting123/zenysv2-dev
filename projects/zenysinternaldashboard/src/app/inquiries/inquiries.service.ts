import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root'
})


export class InquiriesService {

  constructor(private db:AngularFirestore) { }

  // get User 
  getNew(path1,itemId:string) {
    return this.db.collection(path1).doc<any>(itemId).valueChanges();
  }
  // get inquiries
  // getInquiries(){
  //   return this.db.collectionGroup('Inquiries').get().toPromise()
  //   .then(function(querySnapshot) {
  //     querySnapshot.forEach(function(doc) {
  //       console.info(doc.id, ' => ', doc.data());
  //     });
  //   });
  // }
  getDBInquries(){
    return this.db.collectionGroup('Inquiries').get()
  }
  getInquires(){
    return this.db.collectionGroup('Inquiries').snapshotChanges();
  }
}
