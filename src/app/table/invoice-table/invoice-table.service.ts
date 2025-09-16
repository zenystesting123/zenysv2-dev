import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Invoice } from 'src/app/data-models';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { startOfMonth, endOfMonth, endOfWeek, startOfWeek, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class InvoiceTableService {
  filterViewSelected = "This Week";// secondary filter view name
  viewSelected = "This Week Quotation"; // display view name
  lastDateTime = null;
  lastDocumentId = '';
  pageSize: number = 10;
  pageIndex = 0;
  invList: MatTableDataSource<Invoice>; // Inv list
  constructor(private afs: AngularFirestore) {}

  getData(superUserId) {
    let date = new Date();
    if (this.filterViewSelected == "This Week") {
      let firstDay = new Date(startOfWeek(date)); //find first day of the week
      let lastDay = new Date(endOfWeek(date)); // find lastday of the week
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/Invoices', ref => {
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
        return this.afs.collection('users/' + superUserId + '/Invoices', ref => {
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
        return this.afs.collection('users/' + superUserId + '/Invoices', ref => {
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
        return this.afs.collection('users/' + superUserId + '/Invoices', ref => {
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
        return this.afs.collection('users/' + superUserId + '/Invoices', ref => {
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
        return this.afs.collection('users/' + superUserId + '/Invoices', ref => {
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
        return this.afs.collection('users/' + superUserId + '/Invoices', ref => {
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
        return this.afs.collection('users/' + superUserId + '/Invoices', ref => {
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
