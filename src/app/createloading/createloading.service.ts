import { Profile, ReportSettingsData, defaultProfileFields } from './../data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CreateloadingService {

  ReportSettings = ReportSettingsData;
  constructor(private firestore: AngularFirestore) {}

  getUser(docName: string) {
    return this.firestore.doc<Profile>('users/' + docName).valueChanges();
  }
  async getUserDetails(userId: string) {
    return await this.firestore
      .doc<Profile>('users/' + userId)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
  }
  // check invitations with this email
  getInvitations(mail) {
    return this.firestore
      .collection('invitations', (ref) => ref.where('email', '==', mail))
      .snapshotChanges();
  }
  getDetails(sId, mail){
    return this.firestore
    .collection('users/' + sId + 'employees', (ref) => ref.where('officialEmail', '==', mail))
    .snapshotChanges();
  }
  getEmployeeDetails(email) {

    return this.firestore.collectionGroup('employees', (ref) =>
    ref
      .where('officialEmail', '==', email)).snapshotChanges();
  }
  setEmployeeIDFn(superUserId,id,employeeID){
    return this.firestore.collection('users/' + superUserId + '/employees').doc(id).set({
      employeeID: employeeID
  }, { merge: true });
  }
  setNoCRMAccess(docId, bool){
    return this.firestore.collection('users').doc(docId).set({
      CRMAccess: bool
  }, { merge: true });
  }
  createDefaultProfile(
    timeZone,
    tzOffset,
    date,
    saleStatus,
    customerStatus,
    plan,
    freeDateend,
    customerStatOpn,
    saleStatusOpn,
    taskStatusOpn,
    custleadOpn,
    custLead,
    expenseCategory,
    userId,
    userEmail,
    firstName,
    crmAccess,
    accType,
    lastName,
    superUserId,
    phone,
    code,
    company,
    category,
    categoryOthers
  ) {

    return this.firestore.collection('users').doc(userId).set({
      timeZone,
      tzOffset,
      CRMAccess: crmAccess,
      email: userEmail,
      firstname: firstName,
      superUserId: superUserId,
      accountType: accType,
      noSubusers: 0,
      plan: plan,
      zenysCustId: userId, //added for customer creation in Zenys Main Account
      lastname: lastName,
      phone:phone,
      countryCode: code,
      company: company,
      category: category,
      categoryOthers: categoryOthers,
      expenseCategory: expenseCategory,
      ...defaultProfileFields.CONTENT
    });
  }

  createCustomFieldNames(fieldNames, userId){

    return this.firestore.collection('users/').doc(userId).set({fieldNames : fieldNames}, { merge: true });
   }
   create(newtemplate, userId){
    // return this.db.collection('users/' + this.user.uid + '/profilesDefault').add({...newtemplate});
    return this.firestore.collection('users').doc(userId).collection('profilesDefault').add({...newtemplate});
  }
  createDefaultProfileSub(
    timeZone,
    tzOffset,
    date,
    saleStatus,
    customerStatus,
    plan,
    freeDateend,
    customerStatOpn,
    saleStatusOpn,
    taskStatusOpn,
    custleadOpn,
    custLead,
    expenseCategory,
    userId,
    userEmail,
    firstName,
    accType,
    lname,
    superUserId,
    phone,
    code,
    company,
    category,
    categoryOthers
  ) {
    return this.firestore.collection('users').doc(userId).set({
      timeZone,
      tzOffset,
      email: userEmail,
      firstname: firstName,
      superUserId: superUserId,
      accountType: accType,
      plan: plan,
      zenysCustId: userId, //added for customer creation in Zenys Main Account
      lastname: lname,
      phone:phone,
      countryCode: code,
      company: company,
      category: category,
      categoryOthers: categoryOthers,
      expenseCategory: expenseCategory,
      ...defaultProfileFields.CONTENT
    });
  }

}
