import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Profile } from 'src/app/data-models';
@Injectable({
  providedIn: 'root'
})
export class CustomfieldsService {

  constructor(private db: AngularFirestore) { }

  getAllUsers() {
    return this.db.collection<Profile>('users').snapshotChanges();
  }
  getAllContacts(usrId) {
    return this.db.collection('users/'+usrId+'/customers').snapshotChanges();
  }
  getAllSales(usrId) {
    return this.db.collection('users/'+usrId+'/sales').snapshotChanges();
  }
  updatecustCustomFields(usrId,custCustFields){
    return this.db.doc('users/'+usrId).update({'customFieldsContact':custCustFields})
  }
  updatecustSalesFields(usrId, custSalesFields){
    return this.db.doc('users/'+usrId).update({'customFieldsSale':custSalesFields})
  }
  updateContactsAddnlFields(usrId,customerId,valuesArray){
    return this.db.doc('users/'+usrId+'/customers/'+customerId).update({'additionalFieldsArray':valuesArray})
  }
  updateSalesAddnlFields(usrId,saleId,valuesArray){
    return this.db.doc('users/'+usrId+'/sales/'+saleId).update({'additionalFieldsArray':valuesArray})
  }
  setNoSubUsers(usrId){
    return this.db.doc('users/'+usrId).update({'noSubusers':0})
  }

  setFieldNamesArray(usrId,fieldNamesArray){
    return this.db.doc('users/'+usrId).update({'fieldNames':fieldNamesArray})
  }

  getUserProfiles(id) {
    return this.db.collection<any>('users/'+id+'/profilesDefault/').snapshotChanges();
  }

  createDefaultProfile(id,profileData){
    return this.db.collection<any>('users/'+id+'/profilesDefault/').add(profileData);

  }

}
