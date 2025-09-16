import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { TableService } from '../customer-list/table.service';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
@Injectable({
  providedIn: 'root'
})
export class CustomerListGridViewService {
  constructor(private afs: AngularFirestore, public tableService: TableService) { }
  getDocuments(lastDateTime: any, lastDocumentId, pageSize: number, stageId: string, superUserId: string, userId: string) {
    
    let firstQuery = 'assignedTo';
    let date = new Date();
    let firstDay;
    let lastDay;
    let start;
    let end;
    if (this.tableService.secondViewSelected == 'To be converted') {
      if (lastDateTime != null) {
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId)
            .where('inPipeline', '==', true)
            .where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray)
            .orderBy('dateCreated', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(pageSize ).startAfter(lastDateTime, lastDocumentId);
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
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId)
            .where('inPipeline', '==', true)
            .where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray)
            .orderBy('dateCreated', 'desc').limit(pageSize )
            .orderBy(firebase.firestore.FieldPath.documentId())
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
    else if (this.tableService.secondViewSelected == 'Created today' || this.tableService.secondViewSelected == 'Created this week'
      || this.tableService.secondViewSelected == 'Created this month') {

      if (this.tableService.secondViewSelected == 'Created this month') {
        firstDay = new Date(startOfMonth(date)); //find first day of the week
        lastDay = new Date(endOfMonth(date)); // find lastday of the week
        start = firstDay.getTime();
        end = lastDay.getTime();
      } else if (this.tableService.secondViewSelected == 'Created today') {
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
      } else if (this.tableService.secondViewSelected == 'Created this week') {
        let firstDay = new Date(startOfWeek(date)); //find first day of the week
        let lastDay = new Date(endOfWeek(date)); // find lastday of the week
        start = firstDay.getTime();
        end = lastDay.getTime();
      }
      if (lastDateTime != null) {
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('dateCreated', '>=', start)
            .where('dateCreated', '<=', end).where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray).orderBy('dateCreated', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(pageSize ).startAfter(lastDateTime, lastDocumentId);
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
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('dateCreated', '>=', start)
            .where('dateCreated', '<=', end).where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray).orderBy('dateCreated', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(pageSize );
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
    else if (this.tableService.secondViewSelected == 'To be contacted today' || this.tableService.secondViewSelected == 'To be contacted tomorrow') {

      if (this.tableService.secondViewSelected == 'To be contacted today') {
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
      } else if (this.tableService.secondViewSelected == 'To be contacted tomorrow') {

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
      if (lastDateTime != null) {
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('nextFollowupDate', '>=', firstDay)
            .where('nextFollowupDate', '<=', lastDay).where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray).orderBy('nextFollowupDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(pageSize ).startAfter(lastDateTime, lastDocumentId);
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
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('nextFollowupDate', '>=', firstDay)
            .where('nextFollowupDate', '<=', lastDay).where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray).orderBy('nextFollowupDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(pageSize );
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
    else if (this.tableService.secondViewSelected == 'By next contact date') {
      if (lastDateTime != null) {
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('nextFollowupDate', '!=', '')
            .where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray).orderBy('nextFollowupDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(pageSize ).startAfter(lastDateTime, lastDocumentId);
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
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('nextFollowupDate', '!=', '').where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray)
            .orderBy('nextFollowupDate', 'asc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(pageSize );
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
    else if (this.tableService.secondViewSelected == 'Last note added date') {
      if (lastDateTime != null) {
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray).orderBy('lastNoteDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(pageSize ).startAfter(lastDateTime, lastDocumentId);
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
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray).orderBy('lastNoteDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(pageSize );
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
    else if (this.tableService.secondViewSelected == 'Last edited date') {
      if (lastDateTime != null) {
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray).orderBy('lastModifiedDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(pageSize ).startAfter(lastDateTime, lastDocumentId);
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
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray).orderBy('lastModifiedDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(pageSize );
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
    else if (this.tableService.secondViewSelected == 'All contacts') {
      if (lastDateTime != null) {
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray).orderBy('dateCreated', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(pageSize ).startAfter(lastDateTime, lastDocumentId);
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
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray).orderBy('dateCreated', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(pageSize );
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
    else if (this.tableService.secondViewSelected == 'Converted this month') {
      firstDay = new Date(startOfMonth(date)); //find first day of the week
      lastDay = new Date(endOfMonth(date)); // find lastday of the week
      start = firstDay.getTime();
      end = lastDay.getTime();
      if (lastDateTime != null) {
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('won', '==', true).where('currentStatusDate', '>=', start)
            .where('currentStatusDate', '<=', end).where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray)
            .orderBy('currentStatusDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(pageSize ).startAfter(lastDateTime, lastDocumentId);
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
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('won', '==', true).where('currentStatusDate', '>=', start)
            .where('currentStatusDate', '<=', end).where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray).orderBy('currentStatusDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(pageSize );
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

    } else if (this.tableService.secondViewSelected == 'Lost this month') {
      firstDay = new Date(startOfMonth(date)); //find first day of the week
      lastDay = new Date(endOfMonth(date)); // find lastday of the week
      start = firstDay.getTime();
      end = lastDay.getTime();
      if (lastDateTime != null) {
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('lost', '==', true).where('currentStatusDate', '>=', start)
            .where('currentStatusDate', '<=', end).where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray).orderBy('currentStatusDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(pageSize ).startAfter(lastDateTime, lastDocumentId);
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
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId).where('status', '==', stageId).where('lost', '==', true).where('currentStatusDate', '>=', start)
            .where('currentStatusDate', '<=', end).where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray).orderBy('currentStatusDate', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId()).limit(pageSize );
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
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId)
            .where('status', '==', stageId)
            .where('status', '==', this.tableService.selectedStatus)
            .where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray)
            .orderBy('dateCreated', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(pageSize ).startAfter(lastDateTime, lastDocumentId);
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
        const collectionRef = this.afs.collection('users/' + superUserId + '/customers', ref => {
          return ref.where(firstQuery, '==', userId)
            .where('status', '==', stageId)
            .where('status', '==', this.tableService.selectedStatus)
            .where('selectedContactPipeline', 'in', this.tableService.selectedPipelineNameArray)
            .orderBy('dateCreated', 'desc')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(pageSize );
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
