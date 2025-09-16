import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Profile } from '../../data-models';
@Injectable({
  providedIn: 'root'
})
export class LeadAddPopupService {
  user:firebase.default.UserInfo ;
  usid:any 
  constructor(private db: AngularFirestore) { 
    this.usid = firebase.default.auth().currentUser.uid
  }
  getNew(path1,itemId:string) {
    return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
  }
  createLead(form,date,leadSharedRating){
    return this.db.collection('SharedLeads/').add({...form,'createDate':date,'submittedBy': this.usid,
    'noPurchases':1,'usrProfileScore':leadSharedRating,'pointsEarned':0,'reqStatus':'open'
    ,'leadSharedRating':3,'invReqCount':0,'invContactCount':0,'reqMetCount':0,'noOfRatingReceived':0});
  }
}
