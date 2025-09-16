import { Profile,Gallery } from '../../data-models';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class UploadTaskService {
  user:firebase.default.UserInfo ;
  usid:any;
  constructor(private db: AngularFirestore,private db1: AngularFireDatabase,private afAuth : AngularFireAuth) {
    afAuth.authState.subscribe(user => this.user=user);
    this.usid = firebase.default.auth().currentUser?.uid
    }
  
   getNew(path1,itemId:string) {
    return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
  }
}
