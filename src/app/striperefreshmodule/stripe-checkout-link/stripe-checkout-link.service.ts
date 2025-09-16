import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class StripeCheckoutLinkService {

  constructor(private http:HttpClient,private db:AngularFirestore) {
    
   }
   createCheckoutSession(data){
     return this.http.post(environment.cloudFunctions.checkoutSession,data)
   }
   updateDoc(userId,docId,stripeSessionId,type){
     return this.db.doc("users/"+userId+"/"+type+"s/"+docId).update({stripeSessionId:stripeSessionId})
   }
    getDoc(userId,docId,type){
     return this.db.doc("users/"+userId+"/"+type+"s/"+docId).valueChanges()
    } 
    getCustomer(userId){
     return this.db.doc("users/"+userId).valueChanges()
    }  
    retrieveCheckoutSession(data){
     return this.http.post(environment.cloudFunctions.retrieveSession,data)
    }
}
