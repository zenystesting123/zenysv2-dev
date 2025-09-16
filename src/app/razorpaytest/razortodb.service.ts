import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatStartDate } from '@angular/material/datepicker';


@Injectable({
  providedIn: 'root'
})
export class RazortodbService {
  ZenysmainAccountId: string="I8kYnSfv7VXDjHN8PpHqhKA9gZq2"

  constructor(private db: AngularFirestore) { }

  getUsers(id){
    return this.db.doc<any>('users/'+id).valueChanges();
  }

updateUser(id,data){
  return this.db.doc<any>('users/'+id).update(data)
}

  subadd(id,startDate,endDate,subscriptionType,lastpaymentid,subscribeDate){
    return this.db.collection('users/' + id+ "/subscriptiondata"  ).doc("1").set({
      superUserid:id,
      startDate:startDate,
      endDate:endDate,
      subscriptionType:subscriptionType,
      lastpaymentid:lastpaymentid,
      subscribeDate:subscribeDate
    })
  }
  subfetch(id){
    return this.db.doc<any>('users/'+id+'/subscriptiondata/1').valueChanges()
  }
  subext(id,startDate,endDate,subscriptionType,lastpaymentid,subscribeDate){
    return this.db.doc<any>('users/' + id + '/subscriptiondata').update({
      superUserid:id,
      startDate:startDate,
      endDate:endDate,
      subscriptionType:subscriptionType,
      lastpaymentid:lastpaymentid,
      subscribeDate:subscribeDate
    })

  }
  savepayment(id,paymentdata){
    return this.db.collection('users/' + id +'/payments').add(paymentdata)
  }
  saveorders(id,orderdata){
    return this.db.collection('users/' + id +'/orders').doc(orderdata.id).set(orderdata)
  }
  saveplan(id,plandata){
    return this.db.collection('users/' + id +'/plan').doc(plandata.id).set(plandata)
  }
  savesubscription(id,subdata){
    return this.db.collection('users/' + id +'/subscription').doc(subdata.id).set(subdata)
  }
  addpaytoorder(id,orderdbID,payment_id,amount_paid){
    return this.db.collection('users/' + id+ "/orders").doc(orderdbID).update({
      payment_id:payment_id,
      amount_paid:amount_paid,
      amount_due:0
    }) 

  }
  
  

  

}
