import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EmployeeMonthlyReportService {

  constructor(private db: AngularFirestore) { }

  getEmployees(sid: string) {
    return this.db.collection('users/' + sid + '/employees').snapshotChanges();
  }

  getMonthlyData(sid: string, documentID: string, yearMonth){
    return this.db.collection('users/' + sid + '/attendance/' + yearMonth).snapshotChanges();
  }
}
