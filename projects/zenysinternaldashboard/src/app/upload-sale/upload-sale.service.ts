import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UploadSaleService {

  constructor(private db: AngularFirestore) {
    
  }
  getSales(id: string) {
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref.orderBy('createdDate', 'desc')
      )
      .snapshotChanges();
  }
  userDetails(id){
    return this.db
    .doc('users/' + id)
    .valueChanges();
  }
  saveExcelSales(id,saleId, lines, stages) {
    return this.db.doc('users/' + id + '/sales/'+saleId).set({
      ...lines,'stageHistory': stages
    }) 
  }
}
