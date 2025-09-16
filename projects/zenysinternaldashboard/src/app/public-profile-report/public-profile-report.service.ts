import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PublicProfileReportService {

  constructor(private db:AngularFirestore) { }
  getPublicProfileDetails() { 
    return this.db
    .collection("public-profile")
    .snapshotChanges()
  }
}
