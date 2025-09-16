import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Customer, Sales, SearchTerm, Service } from "src/app/data-models";
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommonScriptService {
  constructor(private db: AngularFirestore) { }

  async getAllCustomerPromise(userId: string): Promise<Customer[]> {
    return await this.db
      .collection('users/' + userId + '/customers', (ref) =>
        ref.where('surname', '!=', null)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
            ({
              id: a.payload.doc.id,
              ...(a.payload.doc.data() as {}),
            } as Customer)
          )
        )
      )
      .toPromise();
  }
  async getAllServicePromise(userId: string, custId: string): Promise<Service[]> {
    return await this.db
      .collection('users/' + userId + '/services', (ref) =>
        ref.where('customerId', '==', custId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
            ({
              id: a.payload.doc.id,
              ...(a.payload.doc.data() as {}),
            } as Service)
          )
        )
      )
      .toPromise();
  }
  async getAllSalePromise(userId: string, custId: string): Promise<Sales[]> {
    return await this.db
      .collection('users/' + userId + '/sales', (ref) =>
        ref.where('customerId', '==', custId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
            ({
              id: a.payload.doc.id,
              ...(a.payload.doc.data() as {}),
            } as Sales)
          )
        )
      )
      .toPromise();
  }
  async updateSaleSeachTerm(userId: string, saleId: string, surname: string, surnameLowerCase: string) {
    return await this.db.doc('users/' + userId + '/sales/' + saleId).update({
      'surname': surname,
      'searchTerm.surname': surnameLowerCase,
    });
  }
  async updateServiceSeachTerm(userId: string, serviceId: string, surname: string, surnameLowerCase: string) {
    return await this.db.doc('users/' + userId + '/services/' + serviceId).update({
      'surname': surname,
      'searchTerm.surname': surnameLowerCase,
    });
  }
}