import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class RazorpaysubmerchantService {

  constructor(private http:HttpClient,private db: AngularFirestore) { }
  createSub(data){
    return this.http.post(environment.cloudFunctions.createSubMerchant,data)
  }
  test(data){
    return this.http.post(environment.cloudFunctions.scheduledFunction ,data)
  }
  updateSuperUser(superUserId,data){
    return this.db.doc("users/"+superUserId).update(data)
  }
  createStripe(data){
    return this.http.post(environment.cloudFunctions.createStripe,data)
  }
  sendEmail(data) {
    return this.db.collection('email/').add(data);
  }
  retrieveStripe(data){
    return this.http.post(environment.cloudFunctions.retriveStripe,data)
  }
}
