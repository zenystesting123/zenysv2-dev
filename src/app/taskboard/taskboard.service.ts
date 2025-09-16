
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TaskboardService {
  // user: firebase.default.UserInfo;
  // usid: any

  constructor(private db: AngularFirestore) {
    //this.usid = firebase.default.auth().currentUser.uid
  }
    // updating  assigned to in tasks collection
    onUpdateTask(
      userId,
      id,
      assignedTo,
      assignedToName,
      associatedBranch,
      changeLog
    ) {

      return this.db.doc('users/' + userId + '/tasks/' + id).update({
        assignedTo,
        assignedToName,
        associatedBranch,
        changeLog,
        lastModifiedDate: new Date().getTime(),
        assignedToDate: new Date().getTime(),
      });
    }

}
