import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatacardSettingsService {

  constructor(private db: AngularFirestore) { }
  getContactForms(id, template) {
    return this.db.doc('users/' + id + '/Contact-forms/' + template).valueChanges()
  }
  updateContactForm(id, array, template) {
    this.db.doc('users/' + id + '/Contact-forms/' + template).update({ form: array });
  }
  updateContactFormName(id, name, template) {
    this.db.doc('users/' + id + '/Contact-forms/' + template).update({ formName: name });
  }
  deleteContactForms(uid,formId){
    return this.db.doc('users/' + uid + '/Contact-forms/' + formId).delete();
  }
  getAllContactForms(id: String) {
  
    return this.db.collection('users/' + id + '/Contact-forms').snapshotChanges();
  }
  saveFormName(uid,name,contactFormNo) {

    return this.db.doc('users/' + uid + '/Contact-forms/'+ contactFormNo).set({ 
      form:[],formName:name
    });
  }
}
