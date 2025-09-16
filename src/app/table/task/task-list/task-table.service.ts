import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Task } from '../../../data-models';
import { map } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { MatTableDataSource } from '@angular/material/table';
@Injectable({
  providedIn: 'root'
})
export class TaskTableService {
  firstViewSelected: string = 'Assigned to me';// primary filter view name
  secondViewSelected = "Open task";// secondary filter view name
  viewSelected = "Assigned to me/ Open task"; // display view name
  lastDateTime = null; // last date of document readed
  lastDocumentId = ''; // last id of document readed
  pageSize: number = 10; //selected page size 
  pageIndex = 0; // selected page index
  taskList: MatTableDataSource<Task>; // task list
  constructor(private afs: AngularFirestore) {

  }
  getData(superUserId, userId, statusOption) {
    let firstQuery = 'assignedTo';
    if (this.firstViewSelected == 'Created by me') {
      firstQuery = 'createdBy'
    }
    if (this.secondViewSelected == "Open task") {

      let openStatus = JSON.parse(
        JSON.stringify(statusOption)
      )
      openStatus.pop()
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/tasks', ref => {
          return ref.where(firstQuery, '==', userId)
            .where('status', 'in', openStatus)
            .orderBy('dueDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Task;
              
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/tasks', ref => {
          return ref.where(firstQuery, '==', userId)
            .where('status', 'in', openStatus)
            .orderBy('dueDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Task;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }
    } else if (this.secondViewSelected == "Completed task") {
      let lastStatus = JSON.parse(
        JSON.stringify(statusOption[statusOption.length - 1])
      )
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/tasks', ref => {
          return ref.where(firstQuery, '==', userId)
            .where('status', '==', lastStatus)
            .orderBy('dueDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Task;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/tasks', ref => {
          return ref.where(firstQuery, '==', userId)
            .where('status', '==', lastStatus)
            .orderBy('dueDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Task;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }
    } else if (this.secondViewSelected == "Due today") {

      let openStatus = JSON.parse(
        JSON.stringify(statusOption)
      )
      openStatus.pop()
      let date = new Date();
      let start = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0,
        0
      );
      let end = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23,
        59,
        59,
        999
      );
      if (this.lastDateTime != null) {
        return this.afs.collection('users/' + superUserId + '/tasks', ref => {
          return ref.where(firstQuery, '==', userId)
            .where('status', 'in', openStatus)
            .where('dueDate', '>=', start)
            .where('dueDate', '<=', end)
            .orderBy('dueDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1).startAfter(this.lastDateTime, this.lastDocumentId);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Task;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      } else {
        return this.afs.collection('users/' + superUserId + '/tasks', ref => {
          return ref.where(firstQuery, '==', userId)
            .where('status', 'in', openStatus)
            .where('dueDate', '>=', start)
            .where('dueDate', '<=', end)
            .orderBy('dueDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(this.pageSize + 1);
        }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Task;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }
    }

  }

}
