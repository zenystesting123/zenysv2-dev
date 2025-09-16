import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class InquirestableService {
  constructor(private db: AngularFirestore) {}

  // fetch inquiries from DB
  getInquiries(id: string) {
    return this.db
      .collection('users/' + id + '/Inquiries', (ref) =>
        ref.orderBy('date', 'desc').limit(50)
      )
      .snapshotChanges();
  }

  //delete Inquiry
  deleteInquiry(sid, inquiriesId) {
    return this.db.doc('users/' + sid + '/Inquiries/' + inquiriesId).delete();
  }

  // Inquiry view status updating function
  updateinquiry(sid: string, inquiriesId: string, viewStatus) {
    return this.db
      .doc('users/' + sid + '/Inquiries/' + inquiriesId)
      .update({ viewStatus: viewStatus });
  }
  
  // reject Inquiry
  rejectInquiry(sid: string, inquiriesId: string) {
    return this.db
      .doc('users/' + sid + '/Inquiries/' + inquiriesId)
      .update({ status: 'Rejected' });
  }

  // inquiries fetch on date filter
  getInquiriesFilter(id: string, startDate, endDate) {
    return this.db
      .collection('users/' + id + '/Inquiries', (ref) =>
        ref
          .orderBy('date', 'asc')
          .where('date', '>=', startDate)
          .where('date', '<=', endDate)
      )
      .snapshotChanges();
  }
}
