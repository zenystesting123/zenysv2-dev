import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ShortURLModel } from '../data-models';

@Injectable({
  providedIn: 'root',
})
export class UploadFilesService {
  constructor(private db: AngularFirestore) {}

  saveAttachments(id, date, name, url, type, size, shortUrl, userId) {
    return this.db.collection('users/' + id + '/uploadedFiles').add({
      createdAt: date,
      name: name,
      url: url,
      type: type,
      size,
      shortUrl: shortUrl,
      createdBy: userId
    });
  }
  createUrl(lengthyUrl){
    return this.db
      .collection('urls')
      .add({'url':lengthyUrl});
  }
  fetchShortUrl(id){
    return this.db
    .doc<ShortURLModel>('urls/' + id)
    .valueChanges();
  }
  getFiles(superUserId) {
    return this.db
      .collection('users/' + superUserId + '/uploadedFiles', (ref) => ref)
      .snapshotChanges();
  }
  deleteFile(superUserId, fileId) {
    return this.db.doc('users/' + superUserId + '/uploadedFiles/' + fileId).delete();
  }
  // update total attachment size under user
  updateSize(id: any, size: any) {
    this.db.doc('users/' + id).update({ totalAttachmentsSize: size });
  }
}
