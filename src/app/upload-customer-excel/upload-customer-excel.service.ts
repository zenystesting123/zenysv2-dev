import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UploadCustomerExcelService {
  constructor( private db: AngularFirestore) {
  }
//for saving each line of csv uploaded in to db
  saveExcel(id, lines, stages, date) {
    return this.db.collection('users/' + id + '/customers').add({ ...lines, 'stageHistory': stages, 'currentStatusDate': date });
  }
  // read already existing branches under this superuser
  getBranches(id: string) {
    return this.db
      .collection('users/' + id + '/branches', (ref) => ref)
      .snapshotChanges();
  }
}
