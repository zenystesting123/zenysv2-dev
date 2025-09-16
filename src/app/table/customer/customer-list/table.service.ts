import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Customer } from '../../../data-models';
import { map } from 'rxjs/operators';
import { startOfMonth, endOfMonth, endOfWeek, startOfWeek } from 'date-fns';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { MatTableDataSource } from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  secondViewSelected = 'To be converted';
  viewSelected = 'To be converted';
  lastDateTime = null;
  lastDocumentId = '';
  pageSize: number = 10;
  pageIndex = 0;
  customerList: MatTableDataSource<Customer>; // customer list
  pipelineCustomerSelection: any = '';// pipeline selected for customer
  selectedPipelineNameArray: Array<number> = [];
  selectedStatus: string = '';
  statusArray: any = []; //to store status of customer
  stageCollapseArray = [];
  constructor(private afs: AngularFirestore) {
  }
  getData(superUserId, userId, selectedPipelineNameArray) {
    let firstQuery = 'assignedTo';
    let date = new Date();
    let firstDay;
    let lastDay;
    let start;
    let end;
    if (this.secondViewSelected == 'To be converted') {
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId)
            .where('inPipeline', '==', true)
            .where('selectedContactPipeline', 'in', selectedPipelineNameArray)
            .orderBy('dateCreated', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId)
            .where('inPipeline', '==', true).where('selectedContactPipeline', 'in', selectedPipelineNameArray)
            .orderBy('dateCreated', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }
    }
    else if (this.secondViewSelected == 'Created today' || this.secondViewSelected == 'Created this week' || this.secondViewSelected == 'Created this month') {
      if (this.secondViewSelected == 'Created this month') {
        firstDay = new Date(startOfMonth(date)); //find first day of the week
        lastDay = new Date(endOfMonth(date)); // find lastday of the week
        start = firstDay.getTime();
        end = lastDay.getTime();
      } else if (this.secondViewSelected == 'Created today') {
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
        start = firstDay.getTime();
        end = lastDay.getTime();
      } else if (this.secondViewSelected == 'Created this week') {
        let firstDay = new Date(startOfWeek(date)); //find first day of the week
        let lastDay = new Date(endOfWeek(date)); // find lastday of the week
        start = firstDay.getTime();
        end = lastDay.getTime();
      }
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('dateCreated', '>=', start)
            .where('dateCreated', '<=', end).where('selectedContactPipeline', 'in', selectedPipelineNameArray).orderBy('dateCreated', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('dateCreated', '>=', start)
            .where('dateCreated', '<=', end).where('selectedContactPipeline', 'in', selectedPipelineNameArray).orderBy('dateCreated', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }
    }
    else if (this.secondViewSelected == 'To be contacted today' || this.secondViewSelected == 'To be contacted tomorrow') {

      if (this.secondViewSelected == 'To be contacted today') {
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
      } else if (this.secondViewSelected == 'To be contacted tomorrow') {

        firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          0,
          0,
          0,
          0
        );
        lastDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          23,
          59,
          59,
          999
        );
      }
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('nextFollowupDate', '>=', firstDay)
            .where('nextFollowupDate', '<=', lastDay).where('selectedContactPipeline', 'in', selectedPipelineNameArray).orderBy('nextFollowupDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('nextFollowupDate', '>=', firstDay)
            .where('nextFollowupDate', '<=', lastDay).where('selectedContactPipeline', 'in', selectedPipelineNameArray).orderBy('nextFollowupDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }
    }
    else if (this.secondViewSelected == 'By next contact date') {
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('nextFollowupDate', '!=', '')
            .where('selectedContactPipeline', 'in', selectedPipelineNameArray).orderBy('nextFollowupDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('nextFollowupDate', '!=', '').where('selectedContactPipeline', 'in', selectedPipelineNameArray)
            .orderBy('nextFollowupDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }
    }
    else if (this.secondViewSelected == 'Last note added date') {
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('selectedContactPipeline', 'in', selectedPipelineNameArray).orderBy('lastNoteDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('selectedContactPipeline', 'in', selectedPipelineNameArray).orderBy('lastNoteDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }
    }
    else if (this.secondViewSelected == 'Last edited date') {
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('selectedContactPipeline', 'in', selectedPipelineNameArray).orderBy('lastModifiedDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('selectedContactPipeline', 'in', selectedPipelineNameArray).orderBy('lastModifiedDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }
    }
    else if (this.secondViewSelected == 'All contacts') {
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('selectedContactPipeline', 'in', selectedPipelineNameArray).orderBy('dateCreated', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('selectedContactPipeline', 'in', selectedPipelineNameArray).orderBy('dateCreated', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }
    }
    else if (this.secondViewSelected == 'Converted this month') {
      firstDay = new Date(startOfMonth(date)); //find first day of the week
      lastDay = new Date(endOfMonth(date)); // find lastday of the week
      start = firstDay.getTime();
      end = lastDay.getTime();
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('won', '==', true).where('currentStatusDate', '>=', start)
            .where('currentStatusDate', '<=', end).where('selectedContactPipeline', 'in', selectedPipelineNameArray)
            .orderBy('currentStatusDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('won', '==', true).where('currentStatusDate', '>=', start)
            .where('currentStatusDate', '<=', end).where('selectedContactPipeline', 'in', selectedPipelineNameArray).orderBy('currentStatusDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }

    } else if (this.secondViewSelected == 'Lost this month') {
      firstDay = new Date(startOfMonth(date)); //find first day of the week
      lastDay = new Date(endOfMonth(date)); // find lastday of the week
      start = firstDay.getTime();
      end = lastDay.getTime();
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('lost', '==', true).where('currentStatusDate', '>=', start)
            .where('currentStatusDate', '<=', end).where('selectedContactPipeline', 'in', selectedPipelineNameArray).orderBy('currentStatusDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('lost', '==', true).where('currentStatusDate', '>=', start)
            .where('currentStatusDate', '<=', end).where('selectedContactPipeline', 'in', selectedPipelineNameArray).orderBy('currentStatusDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }

    } else if (this.secondViewSelected == 'status') {
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId)
            .where('status', '==', this.selectedStatus)
            .where('selectedContactPipeline', 'in', selectedPipelineNameArray)
            .orderBy('dateCreated', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId)
            .where('status', '==', this.selectedStatus)
            .where('selectedContactPipeline', 'in', selectedPipelineNameArray)
            .orderBy('dateCreated', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Customer;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }
    }
  }
  getMyViews(userId) {
    return this.afs
      .collection('users/' + userId + '/myViews', (ref) =>
        ref.where('module', '==', 'customers')
      ).snapshotChanges();
  }
  getPublicViews(userId) {
    return this.afs
      .collection('users/' + userId + '/publicViews', (ref) =>
        ref.where('module', '==', 'customers')
      ).snapshotChanges();
  }
  onDeleteMyView(userId, docId: string) {
    return this.afs.doc('users/' + userId + '/myViews/' + docId).delete();
  }
  onDeletePublicView(superUserId, docId: string) {
    return this.afs.doc('users/' + superUserId + '/publicViews/' + docId).delete();
  }
}
