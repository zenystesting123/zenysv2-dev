import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import {CommonService} from '../../common.service'
@Injectable({
  providedIn: 'root'
})
export class ComposemailService {

  constructor(public http:HttpClient,private db:AngularFirestore,private common:CommonService) { }

// Http to convert mail to mime before sending
  mailer(mailOptions){
    return this.http.post(environment.cloudFunctions.mailer,mailOptions,{responseType: 'text'})
  }
  // get the customer details to use in template
  getCustomerDetails(customerId){
    return this.db.doc("users/"+this.common.superUserData.superUserId+"/customers/"+customerId).valueChanges()
  }
  // get the sales details to use in template
  getSalesDetails(saleId){
    return this.db.doc("users/"+this.common.superUserData.superUserId+"/sales/"+saleId).valueChanges()
  }
  getServicesDetails(serviceId){
    return this.db.doc("users/"+this.common.superUserData.superUserId+"/services/"+serviceId).valueChanges()
  }
  getAssignedTo(Id){
    return this.db.doc("users/"+Id).valueChanges()
  }

}
