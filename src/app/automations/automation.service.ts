import { Injectable } from '@angular/core';
import {CommonService} from '../common.service'
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class AutomationService {

contactRules:any;
salesRules:any;
datafromOperation:any
currentRule:any
superUserId:String


  constructor(
    private common:CommonService,
    public db:AngularFirestore,
    private http:HttpClient,
    ) {
    this.superUserId=this.common.superUserData.superUserId
   }
  
  
saveAutomation(id,data){
  return this.db.collection("users/"+id+'/automations').add(data)
}

getEmailTemplates(){
  return this.db.collection("users/"+this.superUserId+"/emailTemplates").valueChanges({idField: 'Id'})
}

getSMSTemplates(){
  return this.db.collection("users/"+this.superUserId+"/messageTemplates").valueChanges({idField: 'Id'})
}


getAllAutomations(){
  return this.db.collection("users/"+this.superUserId+"/automations").valueChanges({idField:'Id'})
}
deleteAutomation(Id){
  return this.db.doc("users/"+this.superUserId+"/automations/"+Id).delete()
}

getAutomationDoc(id){
  return this.db.doc("users/"+this.superUserId+"/automations/"+id).valueChanges({idField:'Id'})
}
updateAutomationDoc(id,data){
  return this.db.doc("users/"+this.superUserId+"/automations/"+id).set(data)
}
updateAutomationDoc2(id,data){
  return this.db.doc("users/"+this.superUserId+"/automations/"+id).update(data)
}
  };



  
