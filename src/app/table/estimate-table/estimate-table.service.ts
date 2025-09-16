/*****************************************************
Descrition : table for estimate, take data dynamically based on the page size
 * ************************************************************* */
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { endOfMonth, endOfQuarter, endOfWeek, endOfYear, startOfMonth, startOfQuarter, startOfWeek, startOfYear } from 'date-fns';
import { Invoice } from 'src/app/data-models';
@Injectable({
  providedIn: 'root'
})
export class EstimateTableService {
  filterViewSelected = "This Week";// secondary filter view name
  viewSelected = "This Week Estimate"; // display view name
  lastDateTime = null; // last date of document readed
  lastDocumentId = ''; // last id of document readed
  pageSize: number = 10; //selected page size 
  pageIndex = 0; // selected page index
  estimateList: MatTableDataSource<Invoice>; // list
  constructor(private afs: AngularFirestore) {

  }
  getData(superUserId) {
    let date = new Date();
    if (this.filterViewSelected == "This Week") {
      let firstDay = new Date(startOfWeek(date)); //find first day of the week
      let lastDay = new Date(endOfWeek(date)); // find lastday of the week
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/Estimates', ref => {
          return ref.where(
            'docData.docDate',
            '>=',
            firstDay
          ).where(
            'docData.docDate',
            '<=',
            lastDay
          )
            .orderBy('docData.docDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Invoice;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/Estimates', ref => {
          return ref.where(
            'docData.docDate',
            '>=',
            firstDay
          ).where(
            'docData.docDate',
            '<=',
            lastDay
          )
            .orderBy('docData.docDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Invoice;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }
    } else if (this.filterViewSelected == "This Month") {
      let firstDay = new Date(startOfMonth(date)); //find first day of the week
      let lastDay = new Date(endOfMonth(date)); // find lastday of the week
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/Estimates', ref => {
          return ref.where(
            'docData.docDate',
            '>=',
            firstDay
          ).where(
            'docData.docDate',
            '<=',
            lastDay
          )
            .orderBy('docData.docDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Invoice;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/Estimates', ref => {
          return ref.where(
            'docData.docDate',
            '>=',
            firstDay
          ).where(
            'docData.docDate',
            '<=',
            lastDay
          )
            .orderBy('docData.docDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Invoice;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }
    } else if (this.filterViewSelected == "This Quarter") {
      let firstDay = new Date(startOfQuarter(date)); //find first day of the week
      let lastDay = new Date(endOfQuarter(date)); // find lastday of the week
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/Estimates', ref => {
          return ref.where(
            'docData.docDate',
            '>=',
            firstDay
          ).where(
            'docData.docDate',
            '<=',
            lastDay
          )
            .orderBy('docData.docDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Invoice;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/Estimates', ref => {
          return ref.where(
            'docData.docDate',
            '>=',
            firstDay
          ).where(
            'docData.docDate',
            '<=',
            lastDay
          )
            .orderBy('docData.docDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Invoice;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }
    } else if (this.filterViewSelected == "This Year") {
      let firstDay = new Date(startOfYear(date)); //find first day of the week
      let lastDay = new Date(endOfYear(date)); // find lastday of the week
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/Estimates', ref => {
          return ref.where(
            'docData.docDate',
            '>=',
            firstDay
          ).where(
            'docData.docDate',
            '<=',
            lastDay
          )
            .orderBy('docData.docDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Invoice;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/Estimates', ref => {
          return ref.where(
            'docData.docDate',
            '>=',
            firstDay
          ).where(
            'docData.docDate',
            '<=',
            lastDay
          )
            .orderBy('docData.docDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Invoice;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }
    } 

  }

}