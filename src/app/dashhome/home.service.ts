import { Customer, Profile, Sales } from './../data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private db: AngularFirestore, private http: HttpClient) {}
  // get current month  customers
  getCustomers(id: String, first, last) {
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .orderBy('dateCreated', 'desc')
          .where('dateCreated', '>=', first)
          .where('dateCreated', '<=', last)
      )
      .snapshotChanges();
  }
  // get current month customer for sub user
  getCustomerssubuser(id: String, id1, first, last) {
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('assignedTo', '==', id1)
          .orderBy('dateCreated', 'desc')
          .where('dateCreated', '>=', first)
          .where('dateCreated', '<=', last)
      )
      .snapshotChanges();
  }
  // get  current month sales for sub user
  getSalessubuser(id, id1, first, last) {
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .orderBy('createdDate', 'desc')
          .where('assignedTo', '==', id1)
          .where('createdDate', '>=', first)
          .where('createdDate', '<=', last)
      )
      .snapshotChanges();
  }
  //get current month sales or super user
  getSales(id: string, first, last) {
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .orderBy('createdDate', 'desc')
          .where('createdDate', '>=', first)
          .where('createdDate', '<=', last)
      )
      .snapshotChanges();
  }
  // get inquiries list
  getInquiries(id: string) {
    return this.db
      .collection('users/' + id + '/Inquiries', (ref) =>
        ref.where('status', '==', 'No action taken')
      )
      .snapshotChanges();
  }
  // needed to check
  getInquiriessubuser(id: string, id1) {
    return this.db
      .collection('users/' + id + '/Inquiries', (ref) =>
        ref
          .where('createdBy', '==', id1)
          .where('status', '==', 'No action taken')
      )
      .snapshotChanges();
  }

    // Get todays task for current users
    getOpenTasks(id: string, userId: string) {
      let date = new Date();
      let firstDay = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0,
        0
      );
     let lastDay = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23,
        59,
        59,
        999
      );
      return this.db
        .collection('users/' + id + '/tasks', (ref) =>
        ref.where('assignedTo', '==', userId)
            .where('dueDate', '>=', firstDay)
            .where('dueDate', '<=', lastDay)
            .orderBy('dueDate', "asc")
        )
        .snapshotChanges();
    }

  // Get todays task for current users
  getTasks(id: string, userId: string,lastStatus) {
    let date1 = new Date();
    let date = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
      0,
      0,
      0
    );
    let date2 = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
      23,
      59,
      59,
      999
    );
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref
          .where('assignedTo', '==', userId)
          .where('dueDate', '>=', date).where('dueDate', '<=', date2)
          .where('status', '!=', lastStatus)
      )
      .snapshotChanges();
  }
  // get recent invoices for super user
  getInvoices(id: string) {
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref.orderBy('docData.createdDate', 'desc').limit(3)
      )
      .snapshotChanges();
  }

  //for only current month payment for super user
  getPayment(id: string, first, last) {
    return this.db
      .collection('users/' + id + '/paymentsreceived', (ref) =>
        ref.where('paymentDate', '>=', first).where('paymentDate', '<=', last)
      )
      .snapshotChanges();
  }
  //for only current month invoice for super user
  getInvoicesDash(id: string, first, last) {
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref
          .where('docData.docDate', '>=', first)
          .where('docData.docDate', '<=', last)
      )
      .snapshotChanges();
  }
  // Get todays follow ups for current users
  getFollowUps(id: string, uid) {
    let date1 = new Date();
    let date = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
      0,
      0,
      0
    );
    let date2 = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
      23,
      59,
      59,
      999
    );
    return this.db
      .collection('users/' + id + '/Follow Ups', (ref) =>
        ref
          .where('assignedTo', '==', uid)
          .where('completedStatus', '==', false)
          .where('callStartDate', '>=', date).where('callStartDate', '<=', date2)
      )
      .snapshotChanges();
  }

    // Get todays follow ups for current users
    getOpenFollowUps(id: string, uid) {
      let date = new Date();
      let firstDay = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0,
        0
      );
     let lastDay = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23,
        59,
        59,
        999
      );
      return this.db
        .collection('users/' + id + '/Follow Ups', (ref) =>
          ref
            .where('assignedTo', '==', uid)
            .where('completedStatus', '==', false)
            .where('direction','==','Outbound').where('callStartDate', '>=', firstDay)
            .where('callStartDate', '<=', lastDay)
            .orderBy('callStartDate', "asc")
        )
        .snapshotChanges();
    }

  getRecentPayment(id: string) {
    return this.db
      .collection('users/' + id + '/paymentsreceived', (ref) =>
        ref.orderBy('paymentDate', 'desc').limit(2)
      )
      .snapshotChanges();
  }
  // get recent payments
  getRecentPaymentSubUser(id: string, mId) {
    return this.db
      .collection('users/' + mId + '/paymentsreceived', (ref) =>
        ref.where('createdById', '==', id).orderBy('paymentDate', 'desc').limit(2)
      )
      .snapshotChanges();
  }
  // close setting card
  onUpdatesettingCard(uid) {
    this.db.doc('users/' + uid).update({ firstSettingsCard: false });
  }
  //closing the guidance prompt
  onUpdateUserFirstTimeStatus(uid) {
    this.db.doc('users/' + uid).update({ isFirstTimeUser: false });
  }
  // get public profile
  getProfile(path1, itemId: string) {
    return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
  }
  // get recent sales for sub user mobile
  getSalessubuserMobile(id, id1) {
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .orderBy('createdDate', 'desc')
          .where('assignedTo', '==', id1)
          .limit(1)
      )
      .snapshotChanges();
  }
  // get recent sales for sub user
  getRecentSalesSubuser(id, id1) {
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .orderBy('createdDate', 'desc')
          .where('assignedTo', '==', id1)
          .limit(3)
      )
      .snapshotChanges();
  }
  // get sales for super user in mobile
  getSalesMobile(id: string) {
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref.orderBy('createdDate', 'desc').limit(1)
      )
      .snapshotChanges();
  }
  // get recent sales for super user
  getRecentSales(id: string) {
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref.orderBy('createdDate', 'desc').limit(3)
      )
      .snapshotChanges();
  }
  // get customer for super user in mobile
  getCustomersMobile(id: String) {
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref.orderBy('dateCreated', 'desc').limit(1)
      )
      .snapshotChanges();
  }
  // get recent customers for super user
  getRecentCustomers(id: String) {
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref.orderBy('dateCreated', 'desc').limit(3)
      )
      .snapshotChanges();
  }
  // get custmer for sub user in mobile
  getCustomersSubuserMobile(id: String, id1) {
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('assignedTo', '==', id1)
          .orderBy('dateCreated', 'desc')
          .limit(1)
      )
      .snapshotChanges();
  }
  // get recent customers for sub user
  getRecentCustomersSubuser(id: String, id1) {
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('assignedTo', '==', id1)
          .orderBy('dateCreated', 'desc')
          .limit(3)
      )
      .snapshotChanges();
  }
  // get recent invoices for super user in mobile
  getInvoicesMobile(id: string) {
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref.orderBy('docData.createdDate', 'desc').limit(1)
      )
      .snapshotChanges();
  }
  // get recent customers for sub user in mobile
  getInvoicesSubUserMobile(id: string, mId) {
    return this.db
      .collection('users/' + mId + '/Invoices', (ref) =>
        ref.where('docData.saleAssignedToOwner', '==', id).limit(1)
      )
      .snapshotChanges();
  }
  // get recent collection for super user in mobile
  getRecentPaymentMobile(id: string) {
    return this.db
      .collection('users/' + id + '/paymentsreceived', (ref) =>
        ref.orderBy('paymentDate', 'desc').limit(1)
      )
      .snapshotChanges();
  }
  // get recent collection for sub user in mobile
  getRecentPaymentSubUserMobile(id: string, mId) {
    return this.db
      .collection('users/' + mId + '/paymentsreceived', (ref) =>
        ref.where('createdById', '==', id).orderBy('paymentDate', 'desc').limit(1)
      )
      .snapshotChanges();
  }
  // get subscription details
  getsubscription(subscription_id) {
    return this.http.post(environment.cloudFunctions.getsubscription, {
      subscription_id: subscription_id,
    });
  }
  // update payment history
  updatePaymentHistory(id, paymentHistory) {
    return this.db
      .doc('users/' + id)
      .update({ paymentHistory: paymentHistory });
  }

  // check for invitations which are not declined or confirmed
  getInvitations() {
    return this.db
      .collection('invitations', (ref) => ref.where('status', '==', 'invited'))
      .snapshotChanges();
  }
  // invitation declined
  declineinv(invId) {
    return this.db.doc('invitations/' + invId).update({ status: 'declined' });
  }
  // send email for the invited superuser on declining
  sendEmail(data) {
    return this.db.collection('email/').add(data);
  }
  // invitation confirmed and update accountType and superuserId accordingly
  // and also add under subuser collection of superUser
  updateAccount(id, accountType, superUserId) {
    return this.db
      .doc('users/' + id)
      .update({ accountType: accountType, superUserId: superUserId });
  }
  updateSubUser(superUserId, newUser) {
    return this.db
      .collection('users/' + superUserId + '/subUsers')
      .add({ ...newUser });
  }
  // invitation confirmed
  confirminv(invId) {
    return this.db.doc('invitations/' + invId).update({ status: 'active' });
  }
    // get date wise fileter for  sub user
    async getDateWiseContactTeam(
      id: string,
      userId: string,
      startDate,
      endDate
    ): Promise<Customer[]> {
      return await this.db
        .collection('users/' + id + '/customers', (ref) =>
          ref
            .where('assignedTo', '==', userId)
            .orderBy('dateCreated', 'desc')
            .where('dateCreated', '>=', startDate)
            .where('dateCreated', '<=', endDate)
        )
        .snapshotChanges()
        .pipe(take(1))
        .pipe(
          map((actions) =>
            actions.map(
              (a) =>
                ({
                  id: a.payload.doc.id,
                  ...(a.payload.doc.data() as {}),
                } as Customer)
            )
          )
        )
        .toPromise();
    }
    async getDateWiseSalesForTeam(
      id: string,
      userId: string,
      startDate,
      endDate
    ) : Promise<Sales[]> {
      return await this.db
        .collection('users/' + id + '/sales', (ref) =>
          ref
            .where('assignedTo', '==', userId)
            .orderBy('createdDate', 'desc')
            .where('createdDate', '>=', startDate)
            .where('createdDate', '<=', endDate)
        )
        .snapshotChanges()
        .pipe(take(1))
        .pipe(
          map((actions) =>
            actions.map(
              (a) =>
                ({
                  id: a.payload.doc.id,
                  ...(a.payload.doc.data() as {}),
                } as Sales)
            )
          )
        )
        .toPromise();
    }
}
