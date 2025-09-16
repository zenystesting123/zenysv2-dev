import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { TaskTableService } from '../task-list/task-table.service';
import { E } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root'
})
export class TaskGridViewService {

  constructor(private afs: AngularFirestore, public tableService: TaskTableService) {

  }
  getData(lastDateTime: any, lastDocumentId, pageSize: number, followupView: string, superUserId: string, userId: string,
    statusOption, lastTaskStatusOpn) {
    let firstQuery = 'assignedTo';
    if (this.tableService.firstViewSelected == 'Created by me') {
      firstQuery = 'createdBy'
    }
    if (this.tableService.secondViewSelected == "Open task") {

      let openStatus = JSON.parse(
        JSON.stringify(statusOption)
      )
      openStatus.pop()
      if (lastDateTime != null) {
        let collectionRef
        let today = new Date();
        let date = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0,
          0,
          0,
          0,);
        if (followupView == 'Upcoming') {
          collectionRef = this.afs.collection('users/' + superUserId + '/tasks', ref => {
            return ref.where(firstQuery, '==', userId)
              .where('status', 'in', openStatus)
              .where('dueDate', '>=', date)
              .orderBy('dueDate', 'asc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize).startAfter(lastDateTime, lastDocumentId);
          });
        }
        else if (followupView == 'OverDue') {
          collectionRef = this.afs.collection('users/' + superUserId + '/tasks', ref => {
            return ref.where(firstQuery, '==', userId)
              .where('status', 'in', openStatus)
              .where('dueDate', '<', date)
              .orderBy('dueDate', 'asc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize).startAfter(lastDateTime, lastDocumentId);
          });
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
        let collectionRef
        let today = new Date();
        let date = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0,
          0,
          0,
          0);
        if (followupView == 'Upcoming') {


          collectionRef = this.afs.collection('users/' + superUserId + '/tasks', ref => {
            return ref.where(firstQuery, '==', userId)
              .where('status', 'in', openStatus)
              .where('dueDate', '>=', date)
              .orderBy('dueDate', 'asc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize);
          });
        }
        else if (followupView == 'OverDue') {
          collectionRef = this.afs.collection('users/' + superUserId + '/tasks', ref => {
            return ref.where(firstQuery, '==', userId)
              .where('status', 'in', openStatus)
              .where('dueDate', '<', date)
              .orderBy('dueDate', 'asc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize);
          });
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
    } else if (this.tableService.secondViewSelected == "Completed task") {

      let lastStatus = JSON.parse(
        JSON.stringify(statusOption[statusOption.length - 1])
      )
      if (lastDateTime != null) {
        let collectionRef
        if (followupView == 'Completed') {
          collectionRef = this.afs.collection('users/' + superUserId + '/tasks', ref => {
            return ref.where(firstQuery, '==', userId)
              .where('status', '==', lastStatus)
              .orderBy('dueDate', 'asc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize).startAfter(lastDateTime, lastDocumentId);
          });
        }
        else {
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
        let collectionRef
        if (followupView == 'Completed') {
          collectionRef = this.afs.collection('users/' + superUserId + '/tasks', ref => {
            return ref.where(firstQuery, '==', userId)
              .where('status', '==', lastStatus)
              .orderBy('dueDate', 'asc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize);
          });
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
    else if (this.tableService.secondViewSelected == "Due today") {

      let openStatus = JSON.parse(
        JSON.stringify(statusOption)
      )
      openStatus.pop();
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
      if (lastDateTime != null) {
        let collectionRef
        if (followupView == 'Upcoming') {
          collectionRef = this.afs.collection('users/' + superUserId + '/tasks', ref => {
            return ref.where(firstQuery, '==', userId)
              .where('status', 'in', openStatus)
              .where('dueDate', '>=', start)
              .where('dueDate', '<=', end)
              .orderBy('dueDate', 'asc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize).startAfter(lastDateTime, lastDocumentId);
          });
        }
        else {
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
        let collectionRef
        if (followupView == 'Upcoming') {
          collectionRef = this.afs.collection('users/' + superUserId + '/tasks', ref => {
            return ref.where(firstQuery, '==', userId)
              .where('status', 'in', openStatus)
              .where('dueDate', '>=', start)
              .where('dueDate', '<=', end)
              .orderBy('dueDate', 'asc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize);
          });
        }
        else {
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
