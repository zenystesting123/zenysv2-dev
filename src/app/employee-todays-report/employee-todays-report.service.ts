import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class EmployeeTodaysReportService {
  constructor(private db: AngularFirestore) {}

  // fetch attendance data
  getAttendanceData(dt) {
    return this.db.doc(dt).valueChanges();
  }

  // fetch employee details
  getEmployeeDetails(sid) {
    return this.db
      .collection('users/' + sid + '/employees', (ref) =>
        ref.orderBy('createdDate', 'desc')
      )
      .snapshotChanges();
  }
}
