import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSettingsService {

  constructor(private db: AngularFirestore) { }

  updateEmpSett(superUserId, employeePrefix, employeeNoInit){
    return this.db.doc('users/'+superUserId).set(
      {
        employeePrefix: employeePrefix,
        employeeNoInit: employeeNoInit,
      },
      { merge: true }
    );
  }

  updateEmpIDTemp(superUserId, employeeIDTemp){
    return this.db.doc('users/'+superUserId).set(
      {
        employeeIDTemp: employeeIDTemp
      },
      { merge: true }
    );
  }

}
