import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChannelpartnerService {

  constructor(private db: AngularFirestore) {
    
  }
  getSales(id: string) {
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref.orderBy('createdDate', 'desc')
      )
      .snapshotChanges();
  }
}
