import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Profile } from '../data-models';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  constructor(private firestore: AngularFirestore) {}
  createService(date, email, message,name,month,year,contactNumber) {
    return this.firestore
      .collection('users/' + environment.ZenysMainAccount + '/Inquiries')
      .add({
        'date': date,
        'email': email,
        'message': message,
        'name':name,
        'month':month,
        'year':year,
        'status':'No action taken',
        'phone':contactNumber,
        'viewStatus':false
      });
  }
  getUserDetailsFromDb(userId:string) {// for getting user details
    return this.firestore.doc<Profile>('users/' + userId).valueChanges();
  }
}
