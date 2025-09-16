import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, from, Observable, zip } from 'rxjs';
import { concatMap, delay, switchMap } from 'rxjs/operators';
import { Customer, OrganisationModel } from '../data-models';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CommonOrgTagService {
  constructor(private db: AngularFirestore) { }

  //getting all customers
  getAllCustomers(
    superUserId: string,
    queryId: string,
    dataAccessRule,
    queryArray
  ) {
    if (dataAccessRule === 'All') {
      return this.db
        .collection<Customer>('users/' + superUserId + '/customers', (ref) =>
          ref.orderBy('dateCreated', 'desc')
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Own') {
      return this.db
        .collection<Customer>('users/' + superUserId + '/customers', (ref) =>
          ref.orderBy('dateCreated', 'desc').where('assignedTo', '==', queryId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Branch') {

      return this.db
        .collection<Customer>('users/' + superUserId + '/customers', (ref) =>
          ref
            .orderBy('dateCreated', 'desc')
            .where('associatedBranch', '==', queryId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Team') {
      return this.db
        .collection<Customer>('users/' + superUserId + '/customers', (ref) =>
          ref
            .orderBy('dateCreated', 'desc')
            .where('assignedTo', 'in', queryArray)
        )
        .snapshotChanges();
    }
  }
  //getting all organisations
  getAllOrgs(superUserId: string, queryId: string, dataAccessRule, queryArr) {
    if (dataAccessRule === 'All') {
      return this.db
        .collection<OrganisationModel>(
          'users/' + superUserId + '/Organisations',
          (ref) => ref.orderBy('createdDate', 'desc')
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Own') {
      return this.db
        .collection<OrganisationModel>(
          'users/' + superUserId + '/Organisations',
          (ref) =>
            ref
              .orderBy('createdDate', 'desc')
              .where('assignedTo', '==', queryId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Branch') {

      return this.db
        .collection<OrganisationModel>(
          'users/' + superUserId + '/Organisations',
          (ref) =>
            ref
              .orderBy('createdDate', 'desc')
              .where('associatedBranch', '==', queryId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Team') {
      return this.db
        .collection<OrganisationModel>(
          'users/' + superUserId + '/Organisations',
          (ref) =>
            ref
              .orderBy('createdDate', 'desc')
              .where('assignedTo', 'in', queryArr)
        )
        .snapshotChanges();
    }
  }

  getDataByFirstName(superUserId: string,
    queryId: string,
    dataAccessRule,
    queryArray, searchTerm: string) {
    if (dataAccessRule === 'All') {
      return this.db
        .collection('users/' + superUserId + '/customers', (ref) =>
          ref
            .where('searchTerm.firstName', '>=', searchTerm)
            .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')
        )
        .snapshotChanges();
    }
    else if (dataAccessRule === 'Own') {
      return this.db
        .collection('users/' + superUserId + '/customers', (ref) =>
          ref
            .where('searchTerm.firstName', '>=', searchTerm)
            .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff').where('assignedTo', '==', queryId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Branch') {

      return this.db
        .collection('users/' + superUserId + '/customers', (ref) =>
          ref
            .where('searchTerm.firstName', '>=', searchTerm)
            .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')
            .where('associatedBranch', '==', queryId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Team') {
      return this.db
        .collection('users/' + superUserId + '/customers', (ref) =>
          ref
            .where('searchTerm.firstName', '>=', searchTerm)
            .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')
            .where('assignedTo', 'in', queryArray)
        )
        .snapshotChanges();
    }
  }
  getDataBySecondName(superUserId: string,
    queryId: string,
    dataAccessRule,
    queryArray, searchTerm: string) {
    if (dataAccessRule === 'All') {
      return this.db
        .collection('users/' + superUserId + '/customers', (ref) =>
          ref
            .where('searchTerm.secondName', '>=', searchTerm)
            .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')
        )
        .snapshotChanges();
    }
    else if (dataAccessRule === 'Own') {
      return this.db
        .collection('users/' + superUserId + '/customers', (ref) =>
          ref
            .where('searchTerm.secondName', '>=', searchTerm)
            .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff').where('assignedTo', '==', queryId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Branch') {

      return this.db
        .collection('users/' + superUserId + '/customers', (ref) =>
          ref
            .where('searchTerm.secondName', '>=', searchTerm)
            .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')
            .where('associatedBranch', '==', queryId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Team') {
      return this.db
        .collection('users/' + superUserId + '/customers', (ref) =>
          ref
            .where('searchTerm.secondName', '>=', searchTerm)
            .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')
            .where('assignedTo', 'in', queryArray)
        )
        .snapshotChanges();
    }
  }
  getDataBySurname(superUserId: string,
    queryId: string,
    dataAccessRule,
    queryArray, searchTerm: string) {
    if (dataAccessRule === 'All') {
      return this.db
        .collection('users/' + superUserId + '/customers', (ref) =>
          ref
            .where('searchTerm.surname', '>=', searchTerm)
            .where('searchTerm.surname', '<=', searchTerm + '\uf8ff')
        )
        .snapshotChanges();
    }
    else if (dataAccessRule === 'Own') {
      return this.db
        .collection('users/' + superUserId + '/customers', (ref) =>
          ref
            .where('searchTerm.surname', '>=', searchTerm)
            .where('searchTerm.surname', '<=', searchTerm + '\uf8ff').where('assignedTo', '==', queryId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Branch') {

      return this.db
        .collection('users/' + superUserId + '/customers', (ref) =>
          ref
            .where('searchTerm.surname', '>=', searchTerm)
            .where('searchTerm.surname', '<=', searchTerm + '\uf8ff')
            .where('associatedBranch', '==', queryId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Team') {
      return this.db
        .collection('users/' + superUserId + '/customers', (ref) =>
          ref
            .where('searchTerm.surname', '>=', searchTerm)
            .where('searchTerm.surname', '<=', searchTerm + '\uf8ff')
            .where('assignedTo', 'in', queryArray)
        )
        .snapshotChanges();
    }
  }
  // get customer when minimum 3 input characters are typed and call the api in 2 seconds time out.
  getCustomersList(superUserId: string,
    queryId: string,
    dataAccessRule,
    queryArray, searchTerm: string) {
    // timeout is 2 secons and call api in 2 second time out if the user doesnt change input in that time gap
    let fakeResponse = [1];
    return from(fakeResponse).pipe(
      concatMap(item => of(item).pipe(delay(2000)))
    )
      .pipe(
        switchMap(delay => {

          const firstNameArray = this.getDataByFirstName(superUserId, queryId, dataAccessRule, queryArray, searchTerm)
          const secondNameArray = this.getDataBySecondName(superUserId, queryId, dataAccessRule, queryArray, searchTerm)
          const surnameArray = this.getDataBySurname(superUserId, queryId, dataAccessRule, queryArray, searchTerm)

          let custList = combineLatest([firstNameArray, secondNameArray, surnameArray])
            .pipe(
              switchMap(customers => {
                const [firstNameArray, secondNameArray, surnameArray] = customers;
                const combined = firstNameArray.concat(secondNameArray);
                const combineLatest = combined.concat(surnameArray);
                return of(combineLatest);
              })
            );
          return zip(of(delay), custList)
        }),
      )
  }
}
