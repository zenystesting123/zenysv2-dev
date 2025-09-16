import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Profile, SharedDocument } from 'src/app/data-models';
@Injectable({
  providedIn: 'root'
})
export class Preview1Service {
  constructor(private db: AngularFirestore) { }
  getDocument(id: string) {
    return this.db.doc<SharedDocument>('sharedDocument/' + id).valueChanges();
  }
   getDocumentDetails(userId, docId,docType) {
     if(docType=='Invoice'){
      return this.db
      .doc<any>('users/' + userId + '/Invoices/' + docId)
      .valueChanges();
     }
     else if(docType=='Estimate'){
      return this.db
      .doc<any>('users/' + userId + '/Estimates/' + docId)
      .valueChanges();
     }
     else if(docType=='Quotation'){
      return this.db
      .doc<any>('users/' + userId + '/Quotations/' + docId)
      .valueChanges();
     }
     else{
       
     }
  }
  getUser(userId: string) {
    return this.db.doc<Profile>('users/' + userId).valueChanges();
  }
}
