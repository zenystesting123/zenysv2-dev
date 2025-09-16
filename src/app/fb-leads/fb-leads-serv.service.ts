import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FbLeadsServService {

  constructor(private db: AngularFirestore) { }

   // read details of particular FB page
   readPageRecord(pageId: string) {
    return this.db.doc<any>('FBPages/' + pageId).valueChanges();
  }

  // read details of particular form
   readFormRecord(formId: string) {
    return this.db.doc<any>('FBForms/' + formId).valueChanges();
  }

  //getForms 
  getForms(superUserId) {
    return this.db.collection('FBForms' ,ref=>ref.where('superUserID','==',superUserId)).snapshotChanges(); 
  }

  //create an FB page record
  createFBPageRecord(pageId,pageName,pageToken,superUserID){
     this.db.collection('FBPages').doc(pageId).set({
      pageId:pageId,pageName:pageName,pageToken:pageToken,superUserID:superUserID
    })

  }

}
