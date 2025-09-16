import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContactdashboardService {
  user:firebase.default.UserInfo ;

  constructor(private afAuth : AngularFireAuth,private db: AngularFirestore) {
  }

  getLeads(userId){
    return this.db.collection('users/'+userId+'/customers' ,ref=>ref.where('status','==','Lead')).snapshotChanges(); 
  }
  getProspect(userId){
    return this.db.collection('users/'+userId+'/customers' ,ref=>ref.where('status','==','Prospect')).snapshotChanges(); 
  }
  getOpportunity(userId){
    return this.db.collection('users/'+userId+'/customers' ,ref=>ref.where('status','==','Opportunity')).snapshotChanges();
  }
  getCustomer(userId){
    return this.db.collection('users/'+userId+'/customers' ,ref=>ref.where('status','==','Customer')).snapshotChanges();
  }
  getInquiries(userId){
    return this.db.collection('users/' + userId + '/Inquiries').snapshotChanges();
  }
  getCustomers(userId){
    return this.db.collection('users/'+userId+'/customers').snapshotChanges();
  }
  
}
