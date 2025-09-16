import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Profile } from 'projects/customers/src/app/data-models';

@Injectable({
  providedIn: 'root'
})
export class ProfileConfirmationService {
  user:firebase.default.UserInfo ;
  usid:any
 
  constructor(private db: AngularFirestore,private db1: AngularFireDatabase) { 
    this.usid = firebase.default.auth().currentUser.uid
  }

  deleteImgOrginal(uid,id:string){
    this.db.doc('public-profile/' + uid + '/gallery/' + id).delete(); 
    
  }
  deleteImg(uid,id:string){
    this.db.doc('users/' +uid + '/thumbnails/' + id).delete(); 
    
  }
  deleteAttachmentProfile(uid:string,id:string){
  
    this.db.doc('public-profile/' + uid + '/profileDocuments/' + id).delete();
} 
  getNews(path1,itemId:string) {
    return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
  }
  getUserSettings(userId) {
    return this.db.doc<Profile>('users/' + userId).valueChanges();
  }
  getUsers(id) {
    return this.db.doc<any>('users/' + id).valueChanges();
  }
  deleteServicesPP(uid:string,id:string){
    this.db.doc('public-profile/' + uid + '/profileServices/' + id).delete(); 
  }
}
