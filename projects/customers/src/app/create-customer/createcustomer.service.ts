import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class CreatecustomerService {

  constructor(private db: AngularFirestore) {

   }

getCustomer(userId){
  return this.db.doc("customers/"+userId).valueChanges()
}
createCustomer(userId,data){
  return this.db.doc("customers/"+userId).set(data)
}

}
