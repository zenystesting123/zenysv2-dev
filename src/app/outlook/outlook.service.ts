import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class OutlookService {

  constructor(private firestore: AngularFirestore) { }

  //get mails from db
  getmailsfromdb(superuserId, CustSaleId, path) {
    
    return this.firestore
      .collection('users/' + superuserId + '/OutlookMails/', (ref) =>
        ref.where(path, '==', CustSaleId)
      )
      .valueChanges();
  }

  // update message history
  updateMessageHistory(superuserId, mailthreadid, messageHistory, loggedInMailId) {
    console.log("Updating db")
    return this.firestore
      .collection('users/' + superuserId + '/OutlookMails/')
      .doc(mailthreadid)
      .update({ messageHistory, loggedInUser: loggedInMailId });
  }
  
}
