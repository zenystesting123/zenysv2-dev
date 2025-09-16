import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { EMail } from 'src/app/data-models';

@Injectable({
  providedIn: 'root'
})
export class ShowMailthreadService {

  constructor(private firestore: AngularFirestore) { }

  //get Email thread from db
  getmail(superuserId, threadId) {
    return this.firestore
      .doc<EMail>('users/' + superuserId + '/OutlookMails/' + threadId)
      .valueChanges();
  }
}
