import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FollowUps, Sales, Service } from '../data-models';
@Injectable({
  providedIn: 'root',
})
export class FollowupTaskCreateService {
  user: firebase.default.UserInfo;
  constructor(private db: AngularFirestore) { }
  // for create followup
  CreateTasks(superUserId, followUpData) {
    this.db.collection('users/' + superUserId + '/Follow Ups').add({
      ...followUpData, lastModifiedDate: new Date().getTime()
    });
  }
  // for update task
  UpdateTask(superuserId, form, followUpId: string, changeLog) {
    return this.db
      .doc('users/' + superuserId + '/Follow Ups/' + followUpId)
      .update({
        ...form, changeLog, lastModifiedDate: new Date().getTime()
      });
  }
  // for get a particular follow up
  getFollowUp(userId: string, followUpId: string) {
    return this.db
      .doc<FollowUps>('users/' + userId + '/Follow Ups/' + followUpId)
      .valueChanges();
  }
  // } // for create followup
  CreateNextFollowupTasks(superUserId, form) {
    this.db.collection('users/' + superUserId + '/Follow Ups').add({
      ...form, lastModifiedDate: new Date().getTime()
    });
  }
  //getting all sales
  async getSales(superUserId: string, queryId: string[], dataAccessRule, custId) {
    if (dataAccessRule === 'All') {
      return await this.db
        .collection<Sales>('users/' + superUserId + '/sales', (ref) =>
          ref.orderBy('createdDate', 'desc').where('customerId', '==', custId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Own' || dataAccessRule === 'Team') {
      return await this.db
        .collection<Sales>('users/' + superUserId + '/sales', (ref) =>
          ref.orderBy('createdDate', 'desc')
            .where('assignedTo', 'in', queryId).where('customerId', '==', custId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Branch') {
      return await this.db
        .collection<Sales>('users/' + superUserId + '/sales', (ref) =>
          ref.orderBy('createdDate', 'desc')
            .where('associatedBranch', 'in', queryId)
            .where('customerId', '==', custId)
        )
        .snapshotChanges();
    }
  }
  //getting all services
  async getServices(superUserId: string, queryId: string, dataAccessRule, custId) {
    if (dataAccessRule === 'All') {
      return await this.db
        .collection<Service>('users/' + superUserId + '/services', (ref) =>
          ref.orderBy('createdDate', 'desc').where('customerId', '==', custId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Own' || dataAccessRule === 'Team') {
      return await this.db
        .collection<Service>('users/' + superUserId + '/services', (ref) =>
          ref.orderBy('createdDate', 'desc')
            .where('assignedTo', 'in', queryId).where('customerId', '==', custId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Branch') {
      return await this.db
        .collection<Service>('users/' + superUserId + '/services', (ref) =>
          ref.orderBy('createdDate', 'desc')
            .where('associatedBranch', 'in', queryId).where('customerId', '==', custId)
        )
        .snapshotChanges();
    }
  }
}
