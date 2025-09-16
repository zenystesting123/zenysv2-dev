import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DashboardgridService {
  currentDashboardId: string='';
  constructor(private db: AngularFirestore) { }

  saveDashboard(userId: string, currentDashboardIndex, dashboardSettings) {
    this.db.doc('users/' + userId + '/dashBoardReports/' + currentDashboardIndex).update({ ...dashboardSettings })
  }
  //get reports under a user
  getDashboardReports(uId: string) {
    return this.db
      .collection('users/' + uId + '/dashBoardReports', (ref) => ref.orderBy('createdDate', 'asc'))
      .snapshotChanges();
  }
  //getting all followup under a user
  getDashboardReportsOneTime(id: String): Promise<any[]> {
    return this.db
      .collection('users/' + id + '/dashBoardReports', (ref) =>
        ref
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
            ({
              id: a.payload.doc.id,
              ...(a.payload.doc.data() as {}),
            } as any)
          )
        )
      )
      .toPromise();
  }
    // create a new report
    createDashboardReport(userId:string, data) {
      return this.db.collection('users/' + userId + '/dashBoardReports').add({
         ...data,createdDate : new Date().getTime()
       });
     }
}
