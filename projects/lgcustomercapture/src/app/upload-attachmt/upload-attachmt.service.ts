import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UploadAttachmtService {

  constructor(private db: AngularFirestore) { }
  getNew() {
    return this.db.collection('users').doc<any>('CTHSx7bZtEO79BS4B3AfKhOq2ZJ3').valueChanges();
  }

  attachmentsToCollection( name, url, path, date, uname, size) {
    return this.db
      .collection('users/' + 'CTHSx7bZtEO79BS4B3AfKhOq2ZJ3' + '/customers/' + 'oxoSIR706q7gKiEdEZ4Z' + '/attachments')
      .add({
        fileName: name,
        downloadURL: url,
        path: path,
        date: date,
        uploaded: uname,
        size: size,
      });
  }

}
