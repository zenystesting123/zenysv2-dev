import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { Service } from 'src/app/data-models';

@Injectable({
  providedIn: 'root'
})
export class SupportListService {
  secondViewSelected = 'To be closed';
  viewSelected = 'To be closed';
  lastDateTime = null;
  lastDocumentId = '';
  pageSize: number = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [10, 20, 30]; //page size options for table
  serviceList: MatTableDataSource<Service>; // Sales list
  pipelineServiceSelection: any = ''; // pipeline selected for sale
  selectedPipelineNameArray: Array<number> = [];
  selectedStatus: string = '';
  statusArray: any = []; //to store status of customer
  stageCollapseArray = [];

  constructor(private afs: AngularFirestore) { }
  getData(superUserId, userId, selectedPipelineNameArray) {
    let firstQuery = 'assignedTo';
    let date = new Date();
    let start;
    let end;
    if (this.secondViewSelected == 'To be closed') {
      if (this.lastDateTime != null) {
        return this.afs
          .collection('users/' + superUserId + '/services', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('inPipeline', '==', true)
              .where('selectedServPipeline', 'in', selectedPipelineNameArray)
              .orderBy('createdDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1)
              .startAfter(this.lastDateTime, this.lastDocumentId);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as Service;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      } else {
        return this.afs
          .collection('users/' + superUserId + '/services', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('inPipeline', '==', true)
              .where('selectedServPipeline', 'in', selectedPipelineNameArray)
              .orderBy('createdDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as Service;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      }
    } else if (
      this.secondViewSelected == 'start today' ||
      this.secondViewSelected == 'start this week' ||
      this.secondViewSelected == 'start this month'
    ) {
      if (this.secondViewSelected == 'start today') {
        start = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          0,
          0,
          0
        );
        end = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          23,
          59,
          59
        );
      } else if (this.secondViewSelected == 'start this week') {
        start = new Date(startOfWeek(date)); //find first day of the week
        end = new Date(endOfWeek(date)); // find lastday of the week
      } else if (this.secondViewSelected == 'start this month') {
        start = new Date(startOfMonth(date)); //find first day of the week
        end = new Date(endOfMonth(date)); // find lastday of the week
      }
      if (this.lastDateTime != null) {
        return this.afs
          .collection('users/' + superUserId + '/services', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('startDate', '>=', start)
              .where('startDate', '<=', end)
              .where('selectedServPipeline', 'in', selectedPipelineNameArray)
              .orderBy('startDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1)
              .startAfter(this.lastDateTime, this.lastDocumentId);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as Service;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      } else {
        return this.afs
          .collection('users/' + superUserId + '/services', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('startDate', '>=', start)
              .where('startDate', '<=', end)
              .where('selectedServPipeline', 'in', selectedPipelineNameArray)
              .orderBy('startDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as Service;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      }
    } else if (
      this.secondViewSelected == 'closing today' ||
      this.secondViewSelected == 'closing this week' ||
      this.secondViewSelected == 'closing this month'
    ) {
      if (this.secondViewSelected == 'closing today') {
        start = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          0,
          0,
          0
        );
        end = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          23,
          59,
          59
        );
      } else if (this.secondViewSelected == 'closing this week') {
        start = new Date(startOfWeek(date)); //find first day of the week
        end = new Date(endOfWeek(date)); // find lastday of the week
      } else if (this.secondViewSelected == 'closing this month') {
        start = new Date(startOfMonth(date)); //find first day of the week
        end = new Date(endOfMonth(date)); // find lastday of the week
      }
      if (this.lastDateTime != null) {
        return this.afs
          .collection('users/' + superUserId + '/services', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('expCompletionDate', '>=', start)
              .where('expCompletionDate', '<=', end)
              .where('selectedServPipeline', 'in', selectedPipelineNameArray)
              .orderBy('expCompletionDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1)
              .startAfter(this.lastDateTime, this.lastDocumentId);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as Service;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      } else {
        return this.afs
          .collection('users/' + superUserId + '/services', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('expCompletionDate', '>=', start)
              .where('expCompletionDate', '<=', end)
              .where('selectedServPipeline', 'in', selectedPipelineNameArray)
              .orderBy('expCompletionDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as Service;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      }
    } else if (
      this.secondViewSelected == 'edited today' ||
      this.secondViewSelected == 'edited this week' ||
      this.secondViewSelected == 'edited this month'
    ) {
      if (this.secondViewSelected == 'edited today') {
        start = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          0,
          0,
          0
        ).getTime();
        end = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          23,
          59,
          59
        ).getTime();
      } else if (this.secondViewSelected == 'edited this week') {
        start = new Date(startOfWeek(date)).getTime(); //find first day of the week
        end = new Date(endOfWeek(date)).getTime(); // find lastday of the week
      } else if (this.secondViewSelected == 'edited this month') {
        start = new Date(startOfMonth(date)).getTime(); //find first day of the week
        end = new Date(endOfMonth(date)).getTime(); // find lastday of the week
      }
      if (this.lastDateTime != null) {
        return this.afs
          .collection('users/' + superUserId + '/services', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('lastModifiedDate', '>=', start)
              .where('lastModifiedDate', '<=', end)
              .where('selectedServPipeline', 'in', selectedPipelineNameArray)
              .orderBy('lastModifiedDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1)
              .startAfter(this.lastDateTime, this.lastDocumentId);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as Service;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      } else {
        return this.afs
          .collection('users/' + superUserId + '/services', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('lastModifiedDate', '>=', start)
              .where('lastModifiedDate', '<=', end)
              .where('selectedServPipeline', 'in', selectedPipelineNameArray)
              .orderBy('lastModifiedDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as Service;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      }
    } else if (
      this.secondViewSelected == 'note today' ||
      this.secondViewSelected == 'note this week' ||
      this.secondViewSelected == 'note this month'
    ) {
      if (this.secondViewSelected == 'note today') {
        start = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          0,
          0,
          0
        ).getTime();
        end = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          23,
          59,
          59
        ).getTime();
      } else if (this.secondViewSelected == 'note this week') {
        start = new Date(startOfWeek(date)).getTime(); //find first day of the week
        end = new Date(endOfWeek(date)).getTime(); // find lastday of the week
      } else if (this.secondViewSelected == 'note this month') {
        start = new Date(startOfMonth(date)).getTime(); //find first day of the week
        end = new Date(endOfMonth(date)).getTime(); // find lastday of the week
      }
      if (this.lastDateTime != null) {
        return this.afs
          .collection('users/' + superUserId + '/services', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('lastNoteDate', '>=', start)
              .where('lastNoteDate', '<=', end)
              .where('selectedServPipeline', 'in', selectedPipelineNameArray)
              .orderBy('lastNoteDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1)
              .startAfter(this.lastDateTime, this.lastDocumentId);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as Service;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      } else {
        return this.afs
          .collection('users/' + superUserId + '/services', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('lastNoteDate', '>=', start)
              .where('lastNoteDate', '<=', end)
              .where('selectedServPipeline', 'in', selectedPipelineNameArray)
              .orderBy('lastNoteDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as Service;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      }
    } else if (this.secondViewSelected == 'All Support') {
      if (this.lastDateTime != null) {
        return this.afs
          .collection('users/' + superUserId + '/services', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('selectedServPipeline', 'in', selectedPipelineNameArray)
              .orderBy('createdDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1)
              .startAfter(this.lastDateTime, this.lastDocumentId);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as Service;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      } else {
        return this.afs
          .collection('users/' + superUserId + '/services', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('selectedServPipeline', 'in', selectedPipelineNameArray)
              .orderBy('createdDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as Service;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      }
    } else if (this.secondViewSelected == 'status') {
      if (this.lastDateTime != null) {
        return this.afs
          .collection('users/' + superUserId + '/services', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('servicesStage', '==', this.selectedStatus)
              .where('selectedServPipeline', 'in', selectedPipelineNameArray)
              .orderBy('createdDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1)
              .startAfter(this.lastDateTime, this.lastDocumentId);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as Service;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      } else {
        return this.afs
          .collection('users/' + superUserId + '/services', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('servicesStage', '==', this.selectedStatus)
              .where('selectedServPipeline', 'in', selectedPipelineNameArray)
              .orderBy('createdDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(this.pageSize + 1);
          })
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as Service;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      }
    }
  }
  getMyViews(userId) {
    return this.afs
      .collection('users/' + userId + '/myViews', (ref) =>
        ref.where('module', '==', 'services')
      ).snapshotChanges();
  }
  getPublicViews(userId) {
    return this.afs
      .collection('users/' + userId + '/publicViews', (ref) =>
        ref.where('module', '==', 'services')
      ).snapshotChanges();
  }
  onDeleteMyView(userId, docId: string) {
    return this.afs.doc('users/' + userId + '/myViews/' + docId).delete();
  }
  onDeletePublicView(superUserId, docId: string) {
    return this.afs.doc('users/' + superUserId + '/publicViews/' + docId).delete();
  }
}
