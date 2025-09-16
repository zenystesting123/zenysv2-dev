import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Category } from '../data-models';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
filterDistrict:string=null;
filterCategory:string=null;
filterState:string=null;
category:Category=null;
locationClick:boolean=false;

  constructor(private db: AngularFirestore) { }


  getProfile(){
    return this.db.collection('public-profile/').snapshotChanges();
  }

  getCategory():string[]{
    this.category= new Category()
    return this.category.categories;
  }

}
