import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class UploadCustomerService {

  constructor(private db: AngularFirestore) { }
  getCustomer(id: string) {
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref.orderBy('dateCreated', 'desc')
      )
      .snapshotChanges();
  }
  userDetails(id){
    return this.db
    .doc('users/' + id)
    .valueChanges();
  }
  saveExcel(id,custId, lines, stages) {
    return this.db.doc('users/' + id + '/customers/'+custId).set({
      ...lines,'stageHistory': stages
    })
  }
  saveCustomer(sid, lines){
    console.log(lines);
    return this.db.collection('users/' + sid + '/customers').add({ ...lines})
  }
  getSubUsers(id: string) {
    return this.db
      .collection('users/' + id + '/subUsers', (ref) =>
        ref.orderBy('dateCreated', 'desc')
      )
      .snapshotChanges();
  }


  public importFromFile(bstr: string): XLSX.AOA2SheetOpts {
    /* read workbook */
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* save data */
    const data = <XLSX.AOA2SheetOpts>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

    console.log(data)

    return data;
  }

}
