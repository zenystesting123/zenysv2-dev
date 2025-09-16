import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Profile } from '../data-models';

@Injectable({
  providedIn: 'root'
})
export class TemplatePrevService {

  path1:string;
  user:firebase.default.UserInfo ;

  constructor(private db: AngularFirestore,private db1: AngularFireDatabase,private afAuth : AngularFireAuth) {
    afAuth.authState.subscribe(user => this.user=user);
   }
  updatePreview(id:string,name:string){
    return this.db.doc('users/' + id ).update({printTemplate:name});
    
  } 
  getNew(path1,itemId:string) {
    return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
  }
}
