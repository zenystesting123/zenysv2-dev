import { Profile } from './../../data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileSettingsService {
  constructor(private db: AngularFirestore, private http: HttpClient) {}

  // for subusers superuserdata is fetched from Db
  getNew(path1, itemId: string) {
    return this.db.collection(path1).doc<any>(itemId).valueChanges();
  }

  // update profile settings
  update(path1, itemId: string, item: Profile) {
    this.db.collection(path1).doc(itemId).update(item);
  }
  getTransferaccreqs(Id) {
    return this.db.collection('transferAccRequests/').doc(Id).valueChanges();
  }
  saveRequest(data) {
    return this.db.collection('transferAccRequests/').doc(data.id).set(data);
  }

  cancelsub(subscription_id) {
    return this.http.post(environment.cloudFunctions.cancelsubscription, {
      subscription_id: subscription_id,
    });
  }
  updatePaymentHistory(superUserId, paymentHistory) {
    return this.db
      .doc('users/' + superUserId)
      .update({ paymentHistory: paymentHistory });
  }
  savepayment(id, paymentdata) {

    return this.db.collection('users/' + id + '/payments').add(paymentdata);
  }
  saveorders(id, orderdata) {
    return this.db
      .collection('users/' + id + '/orders')
      .doc(orderdata.id)
      .set(orderdata);
  }
  addpaytoorder(id, orderdbID, payment_id, amount_paid) {
    return this.db
      .collection('users/' + id + '/orders')
      .doc(orderdbID)
      .update({
        payment_id: payment_id,
        amount_paid: amount_paid,
        amount_due: 0,
      });
  }
  getpayment(payment_id) {
    return this.http.post(environment.cloudFunctions.getpayment, {
      payment_id: payment_id,
    });
  }
  updateUser(superUserId, data) {
    return this.db.doc('users/' + superUserId).update(data);
  }
  updateSubscription(data) {
    // return this.http.post(environment.cloudFunctions.updateSubscription,data)
  }
  // read already existing branches under this superuser
  getBranches(id: string) {
    return this.db
      .collection('users/' + id + '/branches', (ref) => ref)
      .snapshotChanges();
  }
    // read data from invitation collection
    getInvitation(superUserId) {
      return this.db
        .collection('invitations/', (ref) =>
          ref.where('superUserId', '==', superUserId)
        )
        .snapshotChanges();
    }
}
