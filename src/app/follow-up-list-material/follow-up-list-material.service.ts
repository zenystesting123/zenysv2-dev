import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class FollowUpListMaterialService {
  constructor(private db: AngularFirestore) {}

  // update followup task as completed
  UpdateFollowupTaskAsCompleted(followUpId: string, completed, uid, changeLog) {
    this.db
      .doc('users/' + uid + '/Follow Ups/' + followUpId)
      .update({ completedStatus: completed, changeLog, lastModifiedDate: new Date().getTime() });
  }

  //get customer details
  async readCustRecord(uId: string, id: string) {
    return this.db
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
  
  // updating  assigned to in Follow ups collection
  onUpdateFollowUp(
    userId,
    id,
    assignedTo,
    assignedToName,
    associatedBranch,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/Follow Ups/' + id).update({
      assignedTo,
      assignedToName,
      associatedBranch,
      assignedToDate: new Date().getTime(),
      changeLog,
      lastModifiedDate: new Date().getTime()
    });
  }
}
