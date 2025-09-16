import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Leads, Profile } from '../../data-models';
@Injectable({
  providedIn: 'root'
})
export class LeadPurchaseService {
  user:firebase.default.UserInfo ;
  usid:any 


  constructor(private db: AngularFirestore) { 
    this.usid = firebase.default.auth().currentUser.uid
  }
  getUser(path1,itemId:string) {
    return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
  }
  getLeadShareUser(path1,itemId:string) {
    return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
  }
  getSharedLeads(path1,itemId:string) {
    return this.db.collection(path1).doc<Leads>(itemId).valueChanges();
  }
 createPurchasedLead(usersId,leadId,datePlaced,leadScore,firstName,lastName,companyName,leadEmail,leadContactNo,description,submittedBy){
  return this.db.collection('users/' + usersId + '/PurchasedLeads').add({'leadId':leadId,'purchasedDate':datePlaced,
  'purchaseValue':leadScore,'leadSharedRating':0,'invalidContactFlag':false,
  'invalidReqFlag':false,'reqMetFlag':false,'firstName':firstName,'lastName':lastName,'companyName':companyName,'leadEmail':leadEmail,'leadContactNo':leadContactNo,'title':description,'submittedBy':submittedBy});

 }
  updateUser(leadPoints,usersId){
    return this.db.doc('users/' + usersId).update({'leadPoints':leadPoints});
  }
  updateUserShare(leadPointsCust,submittedBy){
    return this.db.doc('users/' + submittedBy).update({'leadPoints':leadPointsCust});
  }
  updateLead(pointsEarnedLead,noPurchasesLead,leadId){
    return this.db.doc('SharedLeads/'+leadId).update({'pointsEarned':pointsEarnedLead,'noPurchases':noPurchasesLead})
  }
  createLeadPurchases(leadId,usersId,datePlaced,leadScore){
    this.db.collection('SharedLeads/' + leadId + '/LeadPurchases').add({'purchasedBy':usersId,'purchaseDate':datePlaced,'purchaseValue':leadScore});
  }
  getLeadPurchases(id){
    return this.db.collection('SharedLeads/' + id + '/LeadPurchases',ref=>ref).snapshotChanges();
  }
}
