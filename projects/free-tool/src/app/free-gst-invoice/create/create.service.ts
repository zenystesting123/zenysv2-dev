import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})



export class CreateService {

  constructor(private db: AngularFirestore) {
   // this.db.collection('/Subscribers').valueChanges().subscribe(val=> console.log(val));
   
   }
  
  userCreate(subscibers){
    return this.db.collection('/Subscribers').add({subscibers,dateCreated: new Date().toLocaleDateString()});
  }

  userQueries1(user){
   // return this.db.collection('/previewclick').add(user);
  }

  // Delete(id)
  // {
  //   this.db.collection('Subscribers/').doc(id).delete();
  // }
  getAll(){
    return this.db.collection('/Subscribers').snapshotChanges();
  }

 

}
