import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Profile } from '../data-models';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationpopupService {

  user:firebase.default.UserInfo ;
  usid:any
 
  constructor(private db: AngularFirestore,private db1: AngularFireDatabase) { 
    this.usid = firebase.default.auth().currentUser.uid
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
  updateSize(id:any,size:any){

    return this.db.doc('users/' + id ).update({'totalAttachmentsSize':size});
  }
  deleteT(id:string,superId){
    this.db.doc('users/' + superId + '/tasks/' + id).delete(); 
  }
  deleteImgOrginal(uid,id:string){
    this.db.doc('public-profile/' + uid + '/gallery/' + id).delete(); 
    
  }
  deleteImg(uid,id:string){
    this.db.doc('users/' +uid + '/thumbnails/' + id).delete(); 
    
  }
  // deleteServices(uid:string,id:string){
  //   this.db.doc('users/' + this.usid + '/profileServices/' + id).delete(); 
  // }
  deleteServicesPP(uid:string,id:string){
    this.db.doc('public-profile/' + uid + '/profileServices/' + id).delete(); 
  }
  deleteAttachment(uid:string,sid:string,id:string){

    this.db.doc('users/' + uid + '/sales/' + sid + '/attachments/'+id).delete(); 
  }
  deleteAttachmentCust(uid:string,cid:string,id:string){

    this.db.doc('users/' + uid + '/customers/' + cid + '/attachments/'+id).delete(); 
  }
  deleteAttachmentProfile(uid:string,id:string){
  
    this.db.doc('public-profile/' + uid + '/profileDocuments/' + id).delete();
} 
  updateTaskStatus(id:string,superId){
    return this.db.doc('users/' + superId + '/tasks/' + id).update({status:"Completed"});
  } 
}
