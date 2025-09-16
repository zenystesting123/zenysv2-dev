import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Profile } from '../../data-models';

@Injectable({
  providedIn: 'root'
})
export class ProfileCheckService {

  constructor(private db: AngularFirestore) {
    
   }
  getNews(path1,itemId:string) {
    return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
  }
}