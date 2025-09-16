import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { EMail } from 'src/app/data-models';

@Injectable({
  providedIn: 'root',
})
export class GoosleapitofirebaseService {
  passdata: any;

  constructor(private firestore: AngularFirestore) {}

  // save mails id to db
  savemailid(
    superuserId,
    customerid,
    saleId,
    serviceId,
    loggedInUser,
    mailthreadid,
    messageHistory
  ) {
    var writeData: any = {
      threadId: mailthreadid,
      loggedInUser: loggedInUser,
      customerId: customerid,
      numberofmessages: 1,
      newmsgflag: false,
      messageHistory: messageHistory,
    };
    if (saleId != '') {
      writeData.saleId = saleId;
    }
    if (serviceId != '') {
      writeData.serviceId = serviceId;
    }
    return this.firestore
      .collection('users/' + superuserId + '/Email/')
      .doc(mailthreadid)
      .set(writeData);
  }

  // update message history
  updateMessageHistory(superuserId, mailthreadid, messageHistory, loggedInMailId) {
    return this.firestore
      .collection('users/' + superuserId + '/Email/')
      .doc(mailthreadid)
      .update({ messageHistory, loggedInUser: loggedInMailId });
  }

  //get mails from db
  getmailsfromdb(superuserId, CustSaleId, path) {
    return this.firestore
      .collection('users/' + superuserId + '/Email/', (ref) =>
        ref.where(path, '==', CustSaleId)
      )
      .valueChanges();
  }

  //get Email thread from db
  getmail(superuserId, threadId) {
    return this.firestore
      .doc<EMail>('users/' + superuserId + '/Email/' + threadId)
      .valueChanges();
  }

  // get Email Templates
  getEmailTemplates(superuserId, type) {
    return this.firestore
      .collection('users/' + superuserId + '/emailTemplates/', (ref) =>
        ref.where('templateType', '==', type)
      )
      .valueChanges();
  }
}
