import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CommonService } from 'src/app/common.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComposeMailService {

  constructor(public http:HttpClient,private db:AngularFirestore,private common:CommonService) { }

   // get Email Templates
   getEmailTemplates(superuserId, type) {
    return this.db
      .collection('users/' + superuserId + '/emailTemplates/', (ref) =>
        ref.where('templateType', '==', type)
      )
      .valueChanges();
  }

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
  // update message history
  updateMessageHistory(superuserId, mailthreadid, messageHistory, loggedInMailId) {
    return this.db
      .collection('users/' + superuserId + '/OutlookMails/')
      .doc(mailthreadid)
      .update({ messageHistory, loggedInUser: loggedInMailId });
  }

  // save mails id to db
  savemailid(
    superuserId,
    customerid,
    saleId,
    serviceId,
    loggedInUser,
    mailthreadid,
    messageHistory
  ) {
    var writeData: any = {
      threadId: mailthreadid,
      loggedInUser: loggedInUser,
      customerId: customerid,
      numberofmessages: 1,
      newmsgflag: false,
      messageHistory: messageHistory,
    };
    if (saleId != '') {
      writeData.saleId = saleId;
    }
    if (serviceId != '') {
      writeData.serviceId = serviceId;
    }
    return this.db
      .collection('users/' + superuserId + '/OutlookMails/')
      .doc(mailthreadid)
      .set(writeData);
  }
}
