import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  ExpenseCategories,
  Profile,
  defaultProfileFields,
} from './../data-models';
import { ZenysmainaccountService } from '../zenysmainaccount.service';

@Injectable({
  providedIn: 'root',
})
export class CreateProfileService {
  constructor(
    private db: AngularFirestore,
    private mainaccService: ZenysmainaccountService
  ) {}
  getpublicProf(id) {
    return this.db.doc<Profile>('public-profile/' + id).valueChanges();
  }
  updateProfileId(publicId, user) {
    this.db.collection('users').doc(user.uid).update({
      publicProfileID: publicId,
    });
  }
  getCategory(): string[] {
    const category = new ExpenseCategories();
    return category.categories;
  }
  create(newtemplate, userId) {
    return this.db
      .collection('users')
      .doc(userId)
      .collection('profilesDefault')
      .add({ ...newtemplate });
  }
  createProfile(
    uid,
    email,
    form1,
    form2,
    timeZone,
    tzOffset,
    plan,
    expenseCategory,
    fieldNames
  ) {
    return this.db
      .collection('users')
      .doc(uid)
      .set({
        ...form1,
        ...form2,
        ...defaultProfileFields.CONTENT,
        timeZone,
        tzOffset,
        email: email,
        superUserId: uid,
        accountType: 'SuperUser',
        expenseCategory: expenseCategory,
        plan: plan,
        zenysCustId: uid, //added for customer creation in Zenys Main Account
        fieldNames,
      })
      .then((data) => {
        //Once a new user is created, automatically create a contact in Zenys account
        this.mainaccService
          .createCustomer(uid, form1, email, form2)
          .then((resp) => {
            this.mainaccService.updateContactSequenceNumber();
          });
      });
  }
  createCustomProfile(
    uid,
    email,
    form1,
    form2,
    timeZone,
    tzOffset,
    plan,
    expenseCategory,
    customFields
  ) {
    return this.db
      .collection('users')
      .doc(uid)
      .set({
        ...form1,
        ...form2,
        ...defaultProfileFields.CONTENT,
        timeZone,
        tzOffset,
        email: email,
        superUserId: uid,
        accountType: 'SuperUser',
        expenseCategory: expenseCategory,
        plan: plan,
        zenysCustId: uid, //added for customer creation in Zenys Main Account
        ...customFields,
      })
      .then((data) => {
        //Once a new user is created, automatically create a contact in Zenys account
        this.mainaccService
          .createCustomer(uid, form1, email, form2)
          .then((resp) => {
            this.mainaccService.updateContactSequenceNumber();
          });
      });
  }
}
