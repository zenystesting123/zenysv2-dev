import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationpopupService {
  constructor(private db: AngularFirestore, private storage: AngularFireStorage) {}

  // attachment size under user updating
  updateSize(id: any, size: any) {
    return this.db.doc('users/' + id).update({ totalAttachmentsSize: size });
  }
    //for saving logs of deleting documents
    addToDeleteLog(id, lines) {
      return this.db.collection('users/' + id + '/deleteLogs').add({ ...lines });
    }
  // delete task
  deleteT(id: string, superId) {
    return this.db
      .doc('users/' + superId + '/tasks/' + id)
      .delete()
      .then(async (res) => {
        const qry = await this.db
          .collection('users/' + superId + '/tasks/' + id + '/comments')
          .ref.get();
        qry.forEach((doc) => {
          doc.ref.delete();
        });

        const qryAtt = await this.db
          .collection('users/' + superId + '/tasks/' + id + '/attachments')
          .ref.get();
        qryAtt.forEach((doc) => {
          doc.ref.delete();
        });
      });
  }

  // get attachmets under task
  getAttachments(superUserId: string, taskId: string) {
    return this.db
      .collection(
        'users/' + superUserId + '/tasks/' + taskId + '/attachments',
        (ref) => ref.orderBy('date', 'desc')
      )
      .snapshotChanges();
  }

  // delete image under public profile gallery
  deleteImgOrginal(uid, id: string) {
    this.db.doc('public-profile/' + uid + '/gallery/' + id).delete();
  }
  // delete service under public profile
  deleteServicesPP(uid: string, id: string) {
    this.db.doc('public-profile/' + uid + '/profileServices/' + id).delete();
  }
  // delete attachment under sales
  deleteAttachment(uid: string, sid: string, id: string, changeLog) {
    return this.db
      .doc('users/' + uid + '/sales/' + sid + '/attachments/' + id)
      .delete().then(res => {
        this.db
          .doc('users/' + uid + '/sales/' + sid)
          .update({  changeLog, lastModifiedDate: new Date().getTime() });
      })
  }
  // delete attachment under customer
  deleteAttachmentCust(uid: string, cid: string, id: string, changeLog) {
    return this.db
      .doc('users/' + uid + '/customers/' + cid + '/attachments/' + id)
      .delete().then(res => {
        this.db
          .doc('users/' + uid + '/customers/' + cid)
          .update({  changeLog, lastModifiedDate: new Date().getTime() });
      })
  }
  // delete attachment under customer
  deleteCustomDocument(uid: string, cid: string, id: string, changeLog,collectionName:string) {
    return this.db
      .doc('users/' + uid + `/${collectionName}/` + cid + '/documents/' + id)
      .delete().then(res => {
        this.db
          .doc('users/' + uid + `/${collectionName}/` + cid)
          .update({  changeLog, lastModifiedDate: new Date().getTime() });
      })
  }
  // delete attachment under org
  deleteAttachmentOrg(uid: string, cid: string, id: string, changeLog) {
    return this.db
      .doc('users/' + uid + '/Organisations/' + cid + '/attachments/' + id)
      .delete().then(res => {
        this.db
          .doc('users/' + uid + '/Organisations/' + cid)
          .update({  changeLog, lastModifiedDate: new Date().getTime() });
      })
  }
  // delete attachment under service
  deleteServiceAttachment(uid: string, cid: string, id: string, changeLog) {
    return this.db
      .doc('users/' + uid + '/services/' + cid + '/attachments/' + id)
      .delete().then(res => {
        this.db
          .doc('users/' + uid + '/services/' + cid)
          .update({  changeLog, lastModifiedDate: new Date().getTime() });
      })
  }
  // delete attachment under public profile
  deleteAttachmentProfile(uid: string, id: string) {
    this.db.doc('public-profile/' + uid + '/profileDocuments/' + id).delete();
  }
  // task completed updating function
  updateTaskStatus(id: string, superId, changeLog) {
    this.db
      .doc('users/' + superId + '/tasks/' + id)
      .update({ status: 'Completed', changeLog, lastModifiedDate: new Date().getTime() });
  }

  //delete task doc from firestore
  deleteDocTask(superUserId: string, id: any, docRef:string){
    return this.db
      .doc(
        `users/` +
          superUserId +
          `/tasks/` +
          id +
          `/attachments/` +
          docRef
      )
      .delete();
  }

  updateChangeLog(superUserId: string, module: string, id: any, changeLog: any) {
    this.db
      .doc('users/' + superUserId + '/' + module + '/' + id)
      .update({  changeLog, lastModifiedDate: new Date().getTime() });
  }

  //delete from storage
  delFromStorageTask(storageFileurl: any) {
    return this.storage.storage
      .refFromURL(`gs://zenysdevelopment.appspot.com/` + storageFileurl)
      .delete();
  }
    // create new note under customer
    writeNote(
      note,
      createdById: string,
      createdDate: any,
      customerId: string,
      cratedByName: string,
      userId: string,
      changeLog
    ) {   
     return this.db
        .collection(
          'users/' + createdById + '/customers/' + customerId + '/Notes'
        )
        .add({
          ...note,
          createdById: userId,
          createdDate: createdDate,
          cratedByName: cratedByName,
        })
        .then((res) => {
        return  this.db
            .doc('users/' + createdById + '/customers/' + customerId)
            .update({
              changeLog: changeLog,
              lastModifiedDate: new Date().getTime(),
              lastNoteDate: new Date().getTime(),
              lastAddedNote: note.notes,
              lastNoteId: res.id,
            });
        });
    }
}
