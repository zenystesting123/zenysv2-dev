import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class CustomerlistService {
  constructor(private db: AngularFirestore) { }
  // in list if drag and dropped, update customer status
  onUpdateCustomer(
    userId,
    id,
    status,
    stageHistories,
    datePlaced,
    inPipeline,
    won,
    lost,
    rejectionReasonValue,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/customers/' + id).update({
      status: status,
      stageHistory: stageHistories,
      currentStatusDate: datePlaced,
      inPipeline,
      won,
      lost,
      rejectionReasonValue,
      changeLog,
      lastModifiedDate: new Date().getTime(),
    });
  }
  getEmailSMTP(userId) {
    return this.db
      .doc<any>('users/' + userId + '/SMTPsettings/SMTP')
      .valueChanges();
  }
  // fetch email templates from db only for contacts
  getEmailTemplates(superUserId) {
    return this.db
      .collection('users/' + superUserId + '/emailTemplates', (ref) =>
        ref.where('templateType', '==', 'Contact')
      )
      .snapshotChanges();
  }
  // fetch todays bulk emails
  getBulkEmails(superUserId) {
    var startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    var endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return this.db
      .collection('users/' + superUserId + '/bulkMails', (ref) =>
        ref.where('date', '>=', startOfToday).where('date', '<=', endOfToday)
      )
      .snapshotChanges();
  }
  // fetch message templates from db only for contacts
  getSMSTemplates(superUserId) {
    return this.db
      .collection('users/' + superUserId + '/messageTemplates', (ref) =>
        ref.where('tempRecType', '==', 'Contact')
      )
      .snapshotChanges();
  }
  // fetch message templates from db only for contacts
  getBulkMessagesCount(superUserId) {
    var startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    var endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return this.db
      .collection('users/' + superUserId + '/bulkMessaging', (ref) =>
        ref.where('date', '>=', startOfToday).where('date', '<=', endOfToday)
      )
      .snapshotChanges();
  }
  // pipeline and status DB update function
  updatePipelineAndStatus(
    uId: string,
    id: string,
    pipeline,
    status,
    stageHistory,
    inPipeline,
    won,
    lost,
    rejectionReasonValue,
    changeLog
  ) {
    return this.db.doc('users/' + uId + '/customers/' + id).update({
      selectedContactPipeline: pipeline,
      status: status,
      stageHistory: stageHistory,
      currentStatusDate: new Date().getTime(),
      inPipeline,
      won,
      lost,
      rejectionReasonValue,
      changeLog,
      lastModifiedDate: new Date().getTime(),
    });
  }
  getMyViews(userId) {
    const collectionRef = this.db.collection(
      'users/' + userId + '/myviews',
      (ref) => ref.where('module', '==', 'customers')
    );
    return collectionRef
      .get()
      .toPromise()
      .then((querySnapshot) => {
        const documents: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const documentWithId = Object.assign({ id: doc.id }, data);
          documents.push(documentWithId);
        });
        
        return documents;
      });
  }
}
