import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { endOfWeek, startOfWeek } from 'date-fns';
import { FollowUps } from 'src/app/data-models';

@Injectable({
  providedIn: 'root',
})
export class GridContainerService {
  // table parameters
  firstViewSelected: string = 'Assigned to me'; // primary filter view name
  secondViewSelected = 'Todays call'; // secondary filter view name
  viewSelected = "Assigned to me/ Today's Call"; // display view name
  lastDateTime = null; // last date of document readed
  lastDocumentId = ''; // last id of document readed
  pageSize: number = 10; //selected page size
  pageIndex = 0; // selected page index
  followupList: MatTableDataSource<FollowUps>; // followup list
  dataLoaded = false;

  constructor(private afs: AngularFirestore) {}
  // update followup task as completed
  UpdateFollowupTaskAsCompleted(followUpId: string, completed, uid, changeLog) {
    return this.afs
      .doc('users/' + uid + '/Follow Ups/' + followUpId)
      .update({ completedStatus: completed, changeLog });
  }

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

  getData(superUserId, userId) {
    let firstQuery = 'assignedTo';
    if (this.firstViewSelected == 'Created by me') {
      firstQuery = 'createdBy';
    }
    let date = new Date();
    let firstDay;
    let lastDay;
    if (this.secondViewSelected == 'Todays call') {
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
      if (this.lastDateTime != null) {
        return this.afs
          .collection('users/' + superUserId + '/Follow Ups', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('callStartDate', '>=', firstDay)
              .where('callStartDate', '<=', lastDay)
              .orderBy('callStartDate', 'asc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1)
              .startAfter(this.lastDateTime, this.lastDocumentId);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as FollowUps;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      } else {
        return this.afs
          .collection('users/' + superUserId + '/Follow Ups', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('callStartDate', '>=', firstDay)
              .where('callStartDate', '<=', lastDay)
              .orderBy('callStartDate', 'asc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as FollowUps;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      }
    } else if (this.secondViewSelected == 'This weeks call') {
      firstDay = new Date(startOfWeek(date)); //find first day of the week
      lastDay = new Date(endOfWeek(date)); // find lastday of the week
      if (this.lastDateTime != null) {
        return this.afs
          .collection('users/' + superUserId + '/Follow Ups', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('callStartDate', '>=', firstDay)
              .where('callStartDate', '<=', lastDay)
              .orderBy('callStartDate', 'asc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1)
              .startAfter(this.lastDateTime, this.lastDocumentId);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as FollowUps;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      } else {
        return this.afs
          .collection('users/' + superUserId + '/Follow Ups', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('callStartDate', '>=', firstDay)
              .where('callStartDate', '<=', lastDay)
              .orderBy('callStartDate', 'asc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as FollowUps;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      }
    } else if (this.secondViewSelected == 'Overdue call') {
      let today = new Date();
      let dateNew = new Date(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
        0,
        0,
        0
      ); //set the time to zero (12 AM) to include all records from that day

      if (this.lastDateTime != null) {
        return this.afs
          .collection('users/' + superUserId + '/Follow Ups', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('callStartDate', '<', dateNew)
              .where('completedStatus', '==', false)
              .orderBy('callStartDate', 'asc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1)
              .startAfter(this.lastDateTime, this.lastDocumentId);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as FollowUps;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      } else {
        return this.afs
          .collection('users/' + superUserId + '/Follow Ups', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('callStartDate', '<', dateNew)
              .where('completedStatus', '==', false)
              .orderBy('callStartDate', 'asc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as FollowUps;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      }
    }
  }
}
