import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UploadTaskService {

  constructor(private db: AngularFirestore) { }
  getTask(id: string) {
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref.orderBy('date', 'desc')
      )
      .snapshotChanges();
  }
  userDetails(id){
    return this.db
    .doc('users/' + id)
    .valueChanges();
  }
  saveExcelTask(id,taskId, lines) {
    return this.db.doc('users/' + id + '/tasks/'+taskId).set({
      ...lines
    }) 
  }
}
