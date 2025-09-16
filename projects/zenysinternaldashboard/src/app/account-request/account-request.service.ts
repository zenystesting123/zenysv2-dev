import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AccountRequestService {

  constructor(private db:AngularFirestore) { 
    
    
  }
  getAlltransferAccountrequests(){
   return this.db.collection("transferAccRequests").valueChanges()      
  }
  updatetransferRequest(userId,data){
    return this.db.doc("transferAccRequests/"+userId).update(data)
  }
  updateUser(userId,rzrAccountId){
    return this.db.doc("users/"+userId).update({rzrAccountId:rzrAccountId})
  }
  getUser(userId){
    return this.db.doc("users/"+userId).valueChanges()
  }
  
}
