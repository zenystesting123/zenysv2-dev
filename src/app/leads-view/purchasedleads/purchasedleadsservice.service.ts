import { Leads,PurchasedLeads,Profile } from '../../data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root',
})
export class PurchasedleadsService {
  constructor(private readonly afs: AngularFirestore) {}

  readPurchasedLeads(userId) {
    return this.afs
      .collection<PurchasedLeads>(
        'users/' + userId + '/PurchasedLeads',
        (ref) => ref.orderBy('purchasedDate', 'desc')
      )
      .snapshotChanges();
  }
  purchasedLeadUpdation(uid: string, purchasedId: string, leadSharedRating: number) {
    return this.afs
      .doc('users/' + uid + '/PurchasedLeads/' + purchasedId)
      .update({ leadSharedRating: leadSharedRating });
  }
  sharedLeadUpdation(leadId, leadRatingNoLead, rateLead) {
    return this.afs
      .doc('SharedLeads/' + leadId)
      .update({ noOfRatingReceived: leadRatingNoLead, leadSharedRating: rateLead });
  }
  userUpdation(submittedBy: string, leadRatingNoUser, rateUser) {
    return this.afs
      .doc('users/' + submittedBy)
      .update({ noOfRatingReceived: leadRatingNoUser, leadSharedRating: rateUser });
  }

  getLead(leadId) {
    return this.afs.doc<Leads>('SharedLeads/' + leadId).valueChanges();
  }
  getUser(submittedBy) {
    return this.afs.doc<Profile>('users/' + submittedBy).valueChanges();
  }
}
