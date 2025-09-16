import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChangecuststatService {
  constructor(private db: AngularFirestore) {}
  // updating fn
  updateContactStatus(
    uId: string,
    id: string,
    status,
    stageHistory,
    updateDate,
    inPipeline,
    won,
    lost,
    rejectionReasonValue,
    changeLog
  ) {
    this.db.doc('users/' + uId + '/customers/' + id).update({
      status: status,
      stageHistory: stageHistory,
      currentStatusDate: updateDate,
      inPipeline,
      won,
      lost,
      rejectionReasonValue,
      changeLog,
      lastModifiedDate: new Date().getTime(),
    });
  }
}
