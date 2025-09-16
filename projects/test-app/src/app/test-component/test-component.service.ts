import { Injectable } from '@angular/core';
// import {}
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class TestComponentService {
  constructor(private db: AngularFirestore) {}
  addDoc(superUserId, customerId, data) {
    return this.db
      .collection(
        'users/' + superUserId + '/customers/' + customerId + '/trialCollection'
      )
      .add(data);
  }
  getAllDocs(superUserId, customerId) {
    return this.db
      .collection(
        'users/' + superUserId + '/customers/' + customerId + '/trialCollection'
      )
      .valueChanges();
  }
  attachmentsToCollection(
    id: string,
    cid: string,
    name: any,
    url: any,
    path: any,
    date: any,
    uname: any,
    size: any,
    certType: string
  ) {
    return this.db
      .doc('users/' + id + '/customers/' + cid + '/attachments/' + certType)
      .set({
        fileName: name,
        downloadURL: url,
        path: path,
        date: date,
        uploaded: uname,
        size: size,
        certType: certType,
        verification: 'pending',
      });
  }
  changeDocVerification(superUserId, custId, certType, verificationStatus) {
    return this.db
      .doc(
        'users/' +
          superUserId +
          '/customers/' +
          custId +
          '/attachments/' +
          certType
      )
      .update({
        verification: verificationStatus,
      });
  }
  //get docs

  getDocsX(superUserId, custId) {
    return this.db
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `class10`
      )
      .valueChanges();
  }
  getDocsXII(superUserId, custId) {
    return this.db
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `class12`
      )
      .valueChanges();
  }
  getDocsDegree(superUserId, custId) {
    return this.db
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `degree`
      )
      .valueChanges();
  }

  //delete doc

  deleteDocX(superUserId, custId) {
    return this.db
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `class10`
      )
      .delete();
  }

  deleteDocXII(superUserId, custId) {
    return this.db
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `class12`
      )
      .delete();
  }
  deleteDocDegree(superUserId, custId) {
    return this.db
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `degree`
      )
      .delete();
  }
}
