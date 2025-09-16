import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Invoice } from 'src/app/data-models';
import { map, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class EstimateListService {
  constructor(private db: AngularFirestore) {
  }
  // get recent estimates for data access rule is all
  getRecentEstimate(superuserId:string) {
    return this.db
      .collection('users/' + superuserId + '/Estimates', (ref) =>
        ref.orderBy('docData.docDate', 'desc').limit(50)
      )
      .snapshotChanges();
  }
  // get recent estimates for data access rule is not all 
  getRecentEstimateforsubuser(superuserId:string, userId:string) {
    return this.db
      .collection('users/' + superuserId + '/Estimates', (ref) =>
        ref
          .where('docData.saleAssignedToOwner', '==', userId) // for data access rule not all
          .orderBy('docData.docDate', 'desc')
          .limit(50)
      )
      .snapshotChanges();
  }
  
 // date wise filtered estimates for data access rule is all 
  getEstimateFromSuperUserFilter(superuserId:string, first, last) {
    return this.db
      .collection('users/' + superuserId + '/Estimates', (ref) =>
        ref
          .orderBy('docData.docDate', 'asc')
          .where('docData.docDate', '>=', first)
          .where('docData.docDate', '<=', last)
      )
      .snapshotChanges();
  }
  // date wise filtered estimates for data access rule is not all 
  getEstimateforSubUserFilter(superuserId:string, userId:string, first, last) {
    return this.db
      .collection('users/' + superuserId + '/Estimates', (ref) =>
        ref
          .where('docData.saleAssignedToOwner', '==', userId)// for data access rule not all
          .orderBy('docData.docDate', 'asc')
          .where('docData.docDate', '>=', first)
          .where('docData.docDate', '<=', last)
      )
      .snapshotChanges();
  }
   // get recent estimates for Team
   async  getRecentEstimateForTeam(superuserId:string, userId:string) : Promise<Invoice[]> {
    return await this.db
      .collection('users/' + superuserId + '/Estimates', (ref) =>
        ref
          .where('docData.saleAssignedToOwner', '==', userId) // for data access rule not all
          .orderBy('docData.docDate', 'desc')
          .limit(50)
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
              } as Invoice)
          )
        )
      )
      .toPromise();
  }
    // date wise filtered estimates for team
    async  getEstimateFilterForTeam(superuserId:string, userId:string, first, last) : Promise<Invoice[]> {
      return await this.db
        .collection('users/' + superuserId + '/Estimates', (ref) =>
          ref
            .where('docData.saleAssignedToOwner', '==', userId)// for data access rule not all
            .orderBy('docData.docDate', 'asc')
            .where('docData.docDate', '>=', first)
            .where('docData.docDate', '<=', last)
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
              } as Invoice)
          )
        )
      )
      .toPromise();
    }
}
