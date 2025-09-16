import { ProfileServices } from './../data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AddNewServiceService {

  constructor(private db: AngularFirestore) { }
//for creating service as per form
  createService(id:string,date,form,image){
  
    this.db.collection("public-profile/"+id+"/profileServices/").add({...form,date:date,imageURL:image});
  }
  //for getting service details from db
  getServiceDetails(id,itemId:string) {
    return this.db.collection("public-profile/"+id+"/profileServices").doc<ProfileServices>(itemId).valueChanges();
  }
  //for updating service details if no images uploaded
  updateService(id:string,sid,form){
    return this.db.doc('public-profile/' + id + '/profileServices/' + sid).update({...form});
  }
  //for updating service details if image uploaded
  updateService1(id:string,sid,form,image){
    return this.db.doc('public-profile/' + id + '/profileServices/' + sid).update({...form,imageURL:image});
  }
}
