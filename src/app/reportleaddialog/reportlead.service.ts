import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class ReportleadService {
  user:firebase.default.UserInfo ;
  usid:any 


  constructor(private db: AngularFirestore) { 
    this.usid = firebase.default.auth().currentUser.uid
  }

  getLeadDetails(leadId:string){
    return this.db.doc<any>('SharedLeads/' +  leadId).valueChanges(); 

  }
  purchasedLeadUpdation(uid:string,purchasedId:string,incorrectContact:boolean,incorrectRequirement:boolean,reqMet:boolean){
    return this.db.doc('Users/'+uid + '/PurchasedLeads/'+ purchasedId).update({invalidContactFlag:incorrectContact,invalidReqFlag:incorrectRequirement,reqMetFlag:reqMet});
  }
  SharsharedLeadUpdate(leadId:string,invContactCount:number,invReqCount:number,reqMetCount:number){
    return this.db.doc('SharedLeads/'+leadId).update({invContactCount:invContactCount,invReqCount:invReqCount,reqMetCount:reqMetCount})
  }
}

