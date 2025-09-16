import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  custId: any;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  attachmentsToCollection(
    id: string,
    cid: string,
    name: string,
    url: any,
    path: any,
    date: any,
    uname: string,
    size: number,
    certType: string
  ) {
    return this.afs
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

  //get docs

  getDocsX(superUserId: string, custId: any) {
    return this.afs
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
  getDocsXII(superUserId: string, custId: any) {
    return this.afs
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
  getDocsDegree(superUserId: string, custId: any) {
    return this.afs
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
  getDegreeMarklist(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `degreeSemMarklist`
      )
      .valueChanges();
  }
  //delete doc

  getDegreeConsolidated(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `degreeConsolidated`
      )
      .valueChanges();
  }

  getDegreeProvisional(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `degreeProvisional`
      )
      .valueChanges();
  }
  getIeltsCertificate(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `ielts`
      )
      .valueChanges();
  }
  getDocsPassport(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `passport`
      )
      .valueChanges();
  }

  //letter of reccomendation 1
  getDocLOR1(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `LetterOfRecommendation1`
      )
      .valueChanges();
  }
  //letter of reccomendation 2
  getDocLOR2(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `LetterOfRecommendation2`
      )
      .valueChanges();
  }

  //statement of purpose
  getDocSOP(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `statementOfPurpose`
      )
      .valueChanges();
  }
  getDocResume(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `resume`
      )
      .valueChanges();
  }
  getCas(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `cas`
      )
      .valueChanges();
  }
  getMedCert(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `medicalCert`
      )
      .valueChanges();
  }
  getFinProof(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `financialProof`
      )
      .valueChanges();
  }
  getbankCoverLetter(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `bankCoverLetter`
      )
      .valueChanges();
  }
  getOfferLetter(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `offerLetter`
      )
      .valueChanges();
  }
  getfeeReciept(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `feeReciept`
      )
      .valueChanges();
  }
  getbirthCert(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `birthCert`
      )
      .valueChanges();
  }
  getBrpCard(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `brpCard`
      )
      .valueChanges();
  }

  
  
  
  
  
    
  
  //medium of instruction
  getDocMOI(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `mediumOfInstruction`
      )
      .valueChanges();
  }
  getOthers1(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `others1`
      )
      .valueChanges();
  }
  getOthers2(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `others2`
      )
      .valueChanges();
  }
  getOthers3(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `others3`
      )
      .valueChanges();
  }
  getOthers4(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `others4`
      )
      .valueChanges();
  }
  getOthers5(superUserId: string, custId: any) {
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          custId +
          `/attachments/` +
          `others5`
      )
      .valueChanges();
  }

  //******* delete doc from firestore
  deleteDoc(superUserId: string, id: any,docRef:string){
    return this.afs
      .doc(
        `users/` +
          superUserId +
          `/customers/` +
          id +
          `/attachments/` +
          docRef
      )
      .delete();
  }

 
  /**Delete from storage */

  delFromStorage(storageFileurl: any) {
    return this.storage.storage
      .refFromURL(`gs://zenysdevelopment.appspot.com/` + storageFileurl)
      .delete();
  }
  changeDocVerification(superUserId, custId, certType, verificationStatus) {
    return this.afs
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
}
