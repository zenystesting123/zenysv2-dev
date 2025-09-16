import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class SharedSalesServService {

  constructor(public db:AngularFirestore) {
   }
getAllSharedSales(email){
  return this.db.collection('shared', ref=>ref.where('customerEmail','==',email)).valueChanges()
}
getsalesinShared(userId,saleId){
  return this.db.doc('users/'+userId+'/sales/'+saleId).snapshotChanges()

}
getUserData(userId){
return this.db.doc('users/'+userId).valueChanges()
}


}
