import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GeneralSettingsService {

  constructor(private db: AngularFirestore) { }

  enableProfileLock(
    superUserId: string,
    lockAccessAutoLogout,
    accessLockAutoLogoutThreshold
  ) {
    return this.db
      .doc('users/' + superUserId)
      .update({
        lockAccessAutoLogout,
        accessLockAutoLogoutThreshold
      });
  }
  enableAutoLogout(
    superUserId: string,
    autoLogoutActive:boolean
  ){
    return this.db.doc("users/"+superUserId).update({
      autoLogoutActive:autoLogoutActive
    })
  }
  disableDuplicate(
    superUserId: string,duplicateEmailDisable,duplicateContactNumberDisable
  ){
    return this.db.doc("users/"+superUserId).update({
      duplicateEmailDisable:duplicateEmailDisable,
      duplicateContactNumberDisable:duplicateContactNumberDisable
    })
  }
  //updates isProdCheckMandatory in user collection
  disableProductCheck(
    superUserId: string,
    isProdCheckMandatory:boolean
  ){
    return this.db.doc("users/"+superUserId).update({
      isProdCheckMandatory:isProdCheckMandatory
    })
  }

  // //default customer type as individual
  // defaultCustomerType(superUserId: string,isCustomerIndividual){
  //   return this.db.doc("users/"+superUserId).update({
  //     isCustomerIndividual:isCustomerIndividual
  //   })

  // }
}
