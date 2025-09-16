import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ContactDetails } from '../contact-model';

@Injectable({
  providedIn: 'root',
})
export class ContactFormService {

  constructor(private db: AngularFirestore) { }
  getNew() {
    return this.db.collection('users').doc<any>('CTHSx7bZtEO79BS4B3AfKhOq2ZJ3').valueChanges();
  }

  attachmentsToCollection( superUserId, custId,name, url, path, date, uname, size) {
    return this.db
      .collection('users/' + superUserId + '/customers/' + custId + '/attachments')
      .add({
        fileName: name,
        downloadURL: url,
        path: path,
        date: date,
        uploaded: uname,
        size: size,
      });
  }

  createContact(customerDetail: ContactDetails, superUserId) {
    customerDetail.stageHistory = customerDetail.stageHistory.map((obj) => {
      return Object.assign({}, obj);
    });
    return this.db
      .collection('users/' + superUserId + '/customers')
      .add(Object.assign({}, customerDetail));
  }
}
