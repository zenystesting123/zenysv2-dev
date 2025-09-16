import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FollowUps } from '../../../data-models';
import { map } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { endOfWeek, startOfWeek } from 'date-fns';
import { GridContainerService } from '../grid-container/grid-container.service';

@Injectable({
  providedIn: 'root',
})
export class FollowupListService {
  constructor(
    private afs: AngularFirestore,
    private parentService: GridContainerService
  ) {}
  // read customer details
  async readCustRecord(uId: string, id: string) {
    return this.afs
      .collection<any>('users/' + uId + '/customers/')
      .doc(id)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  getData(
    lastDate: any,
    lastId,
    batch: number,
    followupType: string,
    superUserId,
    userId
  ) {
    let date = new Date();
    let firstDay;
    let lastDay;
    let collectionRef;
    if (this.parentService.secondViewSelected == 'Todays call') {
      firstDay = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0,
        0
      );
      lastDay = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23,
        59,
        59,
        999
      );
      if (lastDate != null) {
        if (followupType === 'Upcoming') {
          collectionRef = this.afs.collection(
            'users/' + superUserId + '/Follow Ups',
            (ref) => {
              return ref
                .where('assignedTo', '==', userId)
                .where('completedStatus', '==', false)
                .where('callStartDate', '>=', firstDay)
                .where('callStartDate', '<=', lastDay)
                .orderBy('callStartDate', 'asc')
                .orderBy(firebase.firestore.FieldPath.documentId())
                .limit(batch + 1)
                .startAfter(lastDate, lastId);
            }
          );
        } else if (followupType === 'OverDue') {
          return Promise.resolve([]);
        } else if (followupType === 'Completed') {
          collectionRef = this.afs.collection(
            'users/' + superUserId + '/Follow Ups',
            (ref) => {
              return ref
                .where('assignedTo', '==', userId)
                .where('completedStatus', '==', true)
                .where('callStartDate', '>=', firstDay)
                .where('callStartDate', '<=', lastDay)
                .orderBy('callStartDate', 'asc')
                .orderBy(firebase.firestore.FieldPath.documentId())
                .limit(batch + 1)
                .startAfter(lastDate, lastId);
            }
          );
        } else {
          return Promise.resolve([]);
        }

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
      } else {
        if (followupType === 'Upcoming') {
          collectionRef = this.afs.collection(
            'users/' + superUserId + '/Follow Ups',
            (ref) => {
              return ref
                .where('assignedTo', '==', userId)
                .where('completedStatus', '==', false)
                .where('callStartDate', '>=', firstDay)
                .where('callStartDate', '<=', lastDay)
                .orderBy('callStartDate', 'asc')
                .orderBy(firebase.firestore.FieldPath.documentId())
                .limit(batch + 1);
            }
          );
        } else if (followupType === 'OverDue') {
          return Promise.resolve([]);
        } else if (followupType === 'Completed') {
          collectionRef = this.afs.collection(
            'users/' + superUserId + '/Follow Ups',
            (ref) => {
              return ref
                .where('assignedTo', '==', userId)
                .where('completedStatus', '==', true)
                .where('callStartDate', '>=', firstDay)
                .where('callStartDate', '<=', lastDay)
                .orderBy('callStartDate', 'asc')
                .orderBy(firebase.firestore.FieldPath.documentId())
                .limit(batch + 1);
            }
          );
        } else {
          return Promise.resolve([]);
        }
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
    } else if (this.parentService.secondViewSelected == 'This weeks call') {
      firstDay = new Date(startOfWeek(date)); //find first day of the week
      lastDay = new Date(endOfWeek(date)); // find lastday of the week
      let dateLt = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0,
        0
      ); //set the time to zero (12 AM) to include all records from that day
      if (lastDate != null) {
        if (followupType === 'Upcoming') {
          collectionRef = this.afs.collection(
            'users/' + superUserId + '/Follow Ups',
            (ref) => {
              return ref
                .where('assignedTo', '==', userId)
                .where('completedStatus', '==', false)
                .where('callStartDate', '>=', dateLt)
                .where('callStartDate', '<=', lastDay)
                .orderBy('callStartDate', 'asc')
                .orderBy(firebase.firestore.FieldPath.documentId())
                .limit(batch + 1)
                .startAfter(lastDate, lastId);
            }
          );
        } else if (followupType === 'OverDue') {
          collectionRef = this.afs.collection(
            'users/' + superUserId + '/Follow Ups',
            (ref) => {
              return ref
                .where('assignedTo', '==', userId)
                .where('completedStatus', '==', false)
                .where('callStartDate', '>=', firstDay)
                .where('callStartDate', '<', dateLt)
                .orderBy('callStartDate', 'asc')
                .orderBy(firebase.firestore.FieldPath.documentId())
                .limit(batch + 1)
                .startAfter(lastDate, lastId);
            }
          );
        } else if (followupType === 'Completed') {
          collectionRef = this.afs.collection(
            'users/' + superUserId + '/Follow Ups',
            (ref) => {
              return ref
                .where('assignedTo', '==', userId)
                .where('completedStatus', '==', true)
                .where('callStartDate', '>=', firstDay)
                .where('callStartDate', '<=', lastDay)
                .orderBy('callStartDate', 'asc')
                .orderBy(firebase.firestore.FieldPath.documentId())
                .limit(batch + 1)
                .startAfter(lastDate, lastId);
            }
          );
        } else {
          return Promise.resolve([]);
        }
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
      } else {
        if (followupType === 'Upcoming') {
          collectionRef = this.afs.collection(
            'users/' + superUserId + '/Follow Ups',
            (ref) => {
              return ref
                .where('assignedTo', '==', userId)
                .where('completedStatus', '==', false)
                .where('callStartDate', '>=', dateLt)
                .where('callStartDate', '<=', lastDay)
                .orderBy('callStartDate', 'asc')
                .orderBy(firebase.firestore.FieldPath.documentId())
                .limit(batch + 1);
            }
          );
        } else if (followupType === 'OverDue') {
          collectionRef = this.afs.collection(
            'users/' + superUserId + '/Follow Ups',
            (ref) => {
              return ref
                .where('assignedTo', '==', userId)
                .where('completedStatus', '==', false)
                .where('callStartDate', '>=', firstDay)
                .where('callStartDate', '<', dateLt)
                .orderBy('callStartDate', 'asc')
                .orderBy(firebase.firestore.FieldPath.documentId())
                .limit(batch + 1);
            }
          );
        } else if (followupType === 'Completed') {
          collectionRef = this.afs.collection(
            'users/' + superUserId + '/Follow Ups',
            (ref) => {
              return ref
                .where('assignedTo', '==', userId)
                .where('completedStatus', '==', true)
                .where('callStartDate', '>=', firstDay)
                .where('callStartDate', '<=', lastDay)
                .orderBy('callStartDate', 'asc')
                .orderBy(firebase.firestore.FieldPath.documentId())
                .limit(batch + 1);
            }
          );
        } else {
          return Promise.resolve([]);
        }
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
    } else if (this.parentService.secondViewSelected == 'Overdue call') {
      let today = new Date();
      let dateLt = new Date(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
        0,
        0,
        0
      ); //set the time to zero (12 AM) to include all records from that day

      if (lastDate != null) {
        if (followupType === 'Upcoming') {
          return Promise.resolve([]);
        } else if (followupType === 'OverDue') {
          collectionRef = this.afs.collection(
            'users/' + superUserId + '/Follow Ups',
            (ref) => {
              return ref
                .where('assignedTo', '==', userId)
                .where('completedStatus', '==', false)
                .where('callStartDate', '<', dateLt)
                .orderBy('callStartDate', 'asc')
                .orderBy(firebase.firestore.FieldPath.documentId())
                .limit(batch + 1)
                .startAfter(lastDate, lastId);
            }
          );
        } else if (followupType === 'Completed') {
          return Promise.resolve([]);
        } else {
          return Promise.resolve([]);
        }
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
      } else {
        if (followupType === 'OverDue') {
          collectionRef = this.afs.collection(
            'users/' + superUserId + '/Follow Ups',
            (ref) => {
              return ref
                .where('assignedTo', '==', userId)
                .where('completedStatus', '==', false)
                .where('callStartDate', '<', dateLt)
                .orderBy('callStartDate', 'asc')
                .orderBy(firebase.firestore.FieldPath.documentId())
                .limit(batch + 1);
            }
          );
        } else {
          return Promise.resolve([]);
        }
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
  }
}
