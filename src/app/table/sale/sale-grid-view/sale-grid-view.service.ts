import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { SaleTableService } from '../sale-list/sale-table.service';
@Injectable({
  providedIn: 'root'
})
export class SaleGridViewService {
  constructor(private afs: AngularFirestore, public tableService: SaleTableService) { }
  getDocuments(lastDateTime: any, lastDocumentId, pageSize: number, stageId: string, superUserId: string, userId: string) {

    let firstQuery = 'assignedTo';
    let date = new Date();
    let start;
    let end;
    if (this.tableService.secondViewSelected == 'To be converted') {
      if (lastDateTime != null) {
        const collectionRef = this.afs
          .collection('users/' + superUserId + '/sales', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('salesStage', '==', stageId)
              .where('inPipeline', '==', true)
              .where('selectedSalePipeline', 'in', this.tableService.selectedPipelineNameArray)
              .orderBy('createdDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize)
              .startAfter(lastDateTime, lastDocumentId);
          })
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
        const collectionRef = this.afs
          .collection('users/' + superUserId + '/sales', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('inPipeline', '==', true)
              .where('salesStage', '==', stageId)
              .where('selectedSalePipeline', 'in', this.tableService.selectedPipelineNameArray)
              .orderBy('createdDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize);
          })
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
    else if (
      this.tableService.secondViewSelected == 'start today' ||
      this.tableService.secondViewSelected == 'start this week' ||
      this.tableService.secondViewSelected == 'start this month'
    ) {
      if (this.tableService.secondViewSelected == 'start today') {
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
      } else if (this.tableService.secondViewSelected == 'start this week') {
        start = new Date(startOfWeek(date)); //find first day of the week
        end = new Date(endOfWeek(date)); // find lastday of the week
      } else if (this.tableService.secondViewSelected == 'start this month') {
        start = new Date(startOfMonth(date)); //find first day of the week
        end = new Date(endOfMonth(date)); // find lastday of the week
      }
      if (lastDateTime != null) {
        const collectionRef = this.afs
          .collection('users/' + superUserId + '/sales', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('salesStage', '==', stageId)
              .where('startDate', '>=', start)
              .where('startDate', '<=', end)
              .where('selectedSalePipeline', 'in', this.tableService.selectedPipelineNameArray)
              .orderBy('startDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize)
              .startAfter(lastDateTime, lastDocumentId);
          })
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
        const collectionRef = this.afs
          .collection('users/' + superUserId + '/sales', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('salesStage', '==', stageId)
              .where('startDate', '>=', start)
              .where('startDate', '<=', end)
              .where('selectedSalePipeline', 'in', this.tableService.selectedPipelineNameArray)
              .orderBy('startDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize);
          })
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
    } else if (
      this.tableService.secondViewSelected == 'closing today' ||
      this.tableService.secondViewSelected == 'closing this week' ||
      this.tableService.secondViewSelected == 'closing this month'
    ) {
      if (this.tableService.secondViewSelected == 'closing today') {
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
      } else if (this.tableService.secondViewSelected == 'closing this week') {
        start = new Date(startOfWeek(date)); //find first day of the week
        end = new Date(endOfWeek(date)); // find lastday of the week
      } else if (this.tableService.secondViewSelected == 'closing this month') {
        start = new Date(startOfMonth(date)); //find first day of the week
        end = new Date(endOfMonth(date)); // find lastday of the week
      }
      if (lastDateTime != null) {
        const collectionRef = this.afs
          .collection('users/' + superUserId + '/sales', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('salesStage', '==', stageId)
              .where('expCompletionDate', '>=', start)
              .where('expCompletionDate', '<=', end)
              .where('selectedSalePipeline', 'in', this.tableService.selectedPipelineNameArray)
              .orderBy('expCompletionDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize)
              .startAfter(lastDateTime, lastDocumentId);
          })
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
        const collectionRef = this.afs
          .collection('users/' + superUserId + '/sales', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('salesStage', '==', stageId)
              .where('expCompletionDate', '>=', start)
              .where('expCompletionDate', '<=', end)
              .where('selectedSalePipeline', 'in', this.tableService.selectedPipelineNameArray)
              .orderBy('expCompletionDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize);
          })
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
    } else if (
      this.tableService.secondViewSelected == 'edited today' ||
      this.tableService.secondViewSelected == 'edited this week' ||
      this.tableService.secondViewSelected == 'edited this month'
    ) {
      if (this.tableService.secondViewSelected == 'edited today') {
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
      } else if (this.tableService.secondViewSelected == 'edited this week') {
        start = new Date(startOfWeek(date)).getTime(); //find first day of the week
        end = new Date(endOfWeek(date)).getTime(); // find lastday of the week
      } else if (this.tableService.secondViewSelected == 'edited this month') {
        start = new Date(startOfMonth(date)).getTime(); //find first day of the week
        end = new Date(endOfMonth(date)).getTime(); // find lastday of the week
      }
      if (lastDateTime != null) {
        const collectionRef = this.afs
          .collection('users/' + superUserId + '/sales', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('salesStage', '==', stageId)
              .where('lastModifiedDate', '>=', start)
              .where('lastModifiedDate', '<=', end)
              .where('selectedSalePipeline', 'in', this.tableService.selectedPipelineNameArray)
              .orderBy('lastModifiedDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize)
              .startAfter(lastDateTime, lastDocumentId);
          })
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
        const collectionRef = this.afs
          .collection('users/' + superUserId + '/sales', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('salesStage', '==', stageId)
              .where('lastModifiedDate', '>=', start)
              .where('lastModifiedDate', '<=', end)
              .where('selectedSalePipeline', 'in', this.tableService.selectedPipelineNameArray)
              .orderBy('lastModifiedDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize);
          })
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
    } else if (
      this.tableService.secondViewSelected == 'note today' ||
      this.tableService.secondViewSelected == 'note this week' ||
      this.tableService.secondViewSelected == 'note this month'
    ) {
      if (this.tableService.secondViewSelected == 'note today') {
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
      } else if (this.tableService.secondViewSelected == 'note this week') {
        start = new Date(startOfWeek(date)).getTime(); //find first day of the week
        end = new Date(endOfWeek(date)).getTime(); // find lastday of the week
      } else if (this.tableService.secondViewSelected == 'note this month') {
        start = new Date(startOfMonth(date)).getTime(); //find first day of the week
        end = new Date(endOfMonth(date)).getTime(); // find lastday of the week
      }
      if (lastDateTime != null) {
        const collectionRef = this.afs
          .collection('users/' + superUserId + '/sales', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('salesStage', '==', stageId)
              .where('lastNoteDate', '>=', start)
              .where('lastNoteDate', '<=', end)
              .where('selectedSalePipeline', 'in', this.tableService.selectedPipelineNameArray)
              .orderBy('lastNoteDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize)
              .startAfter(lastDateTime, lastDocumentId);
          })
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
        const collectionRef = this.afs
          .collection('users/' + superUserId + '/sales', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('salesStage', '==', stageId)
              .where('lastNoteDate', '>=', start)
              .where('lastNoteDate', '<=', end)
              .where('selectedSalePipeline', 'in', this.tableService.selectedPipelineNameArray)
              .orderBy('lastNoteDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize);
          })
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
    } else if (this.tableService.secondViewSelected == 'All Sales') {
      if (lastDateTime != null) {
        const collectionRef = this.afs
          .collection('users/' + superUserId + '/sales', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('salesStage', '==', stageId)
              .where('selectedSalePipeline', 'in', this.tableService.selectedPipelineNameArray)
              .orderBy('createdDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize)
              .startAfter(lastDateTime, lastDocumentId);
          })
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
        const collectionRef = this.afs
          .collection('users/' + superUserId + '/sales', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('salesStage', '==', stageId)
              .where('selectedSalePipeline', 'in', this.tableService.selectedPipelineNameArray)
              .orderBy('createdDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize);
          })
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
    } else if (this.tableService.secondViewSelected == 'status') {
      if (lastDateTime != null) {
        const collectionRef = this.afs
          .collection('users/' + superUserId + '/sales', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('salesStage', '==', stageId)
              .where('salesStage', '==', this.tableService.selectedStatus)
              .where('selectedSalePipeline', 'in', this.tableService.selectedPipelineNameArray)
              .orderBy('createdDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize)
              .startAfter(lastDateTime, lastDocumentId);
          })
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
        const collectionRef = this.afs
          .collection('users/' + superUserId + '/sales', (ref) => {
            return ref
              .where(firstQuery, '==', userId)
              .where('salesStage', '==', stageId)
              .where('salesStage', '==', this.tableService.selectedStatus)
              .where('selectedSalePipeline', 'in', this.tableService.selectedPipelineNameArray)
              .orderBy('createdDate', 'desc')
              .orderBy(firebase.firestore.FieldPath.documentId())
              .limit(pageSize);
          })
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
