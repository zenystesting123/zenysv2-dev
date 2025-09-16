import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UploadProductService {

  constructor(private db: AngularFirestore) { }
  getProducts(sid:string){
    return this.db
    .collection('users/' + sid + '/products',ref=>ref.orderBy('dateCreated',"desc")).snapshotChanges()
  }
  userDetails(id){
    return this.db
    .doc('users/' + id)
    .valueChanges();
  }
  saveExcelProd(id,prodId, lines){
    return this.db.doc('users/' + id + '/products/'+prodId).set({
      ...lines
    }) 
  }
}
