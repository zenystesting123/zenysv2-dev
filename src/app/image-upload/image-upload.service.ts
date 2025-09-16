import { Profile } from './../data-models';
import { Injectable } from '@angular/core';
import { AngularFireDatabase,AngularFireList} from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  path1:string;
  user:firebase.default.UserInfo ;
  constructor(private db: AngularFirestore,private db1: AngularFireDatabase,private afAuth : AngularFireAuth) {
    afAuth.authState.subscribe(user => this.user=user);
   }
  updateImg1(col:string,doc:string,logo:string){
    return this.db.collection(col).doc(doc).update({logo});
  }

  updateImg2(col:string,doc:string,sign:string){
    return this.db.collection(col).doc(doc).update({sign});
  }
  updateImg3(col:string,doc:string,dp:string){
    return this.db.collection(col).doc(doc).update({dp});
  }
  updateUrl1(col:string,doc:string,url:string){
    return this.db.collection(col).doc(doc).update(url);
  }
  getNew(path1, itemId: string) {
    return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
  }
  logoStatus(id,status){
    this.db.collection("users").doc(id).update({logoStatus:status});
    // console.log("uploaded logo")
  }
  signStatus(id,status){
    this.db.collection("users").doc(id).update({signStatus:status});
    // console.log("uploaded sign")
  }
}
