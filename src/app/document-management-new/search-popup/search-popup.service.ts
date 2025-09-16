import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Customer, OrganisationModel, Sales, SubUsers } from 'src/app/data-models';

@Injectable({
  providedIn: 'root'
})
export class SearchPopupService {
  isLoading: boolean = true;
  orgLoading: boolean = false;
  saleLoading: boolean = false;

  orgs: BehaviorSubject<OrganisationModel[]> = new BehaviorSubject([]);
  sales: BehaviorSubject<Sales[]> = new BehaviorSubject([]);

  constructor(private firestore: AngularFirestore,) {

  }
  getOrgsFromDb(superUserId: string, userId: string, _onDestroy, dataAccessRule: string, subUsers: SubUsers[], superUserBranchId: string) {
    this.orgLoading = true;
    this.updateIsLoaded()
    let queryId: string[] = [];
    queryId = this.getUsersId(superUserId, userId, dataAccessRule, subUsers, superUserBranchId);
    return new Promise<void>(async (resolve) => {
      (await this.getAllOrgs(superUserId, queryId, dataAccessRule))
        .pipe(takeUntil(_onDestroy))
        .subscribe((data) => {
          let newOrganisations = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as OrganisationModel;
          });
          this.orgs.next(newOrganisations)
          this.orgLoading = false;
          this.updateIsLoaded()
          resolve();
        });
    });
  }
 
  getSalesFromDb(superUserId: string, userId: string, _onDestroy, dataAccessRule: string, subUsers: SubUsers[], superUserBranchId: string, custId: string) {
    this.saleLoading = true;
    this.updateIsLoaded()
    let queryId: string[] = [];
    queryId = this.getUsersId(superUserId, userId, dataAccessRule, subUsers, superUserBranchId);

    return new Promise<void>(async (resolve) => {
      (await this.getAllSales(superUserId, queryId, dataAccessRule, custId))
        .pipe(takeUntil(_onDestroy))
        .subscribe((data) => {
          let newsale = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Sales;
          });
          this.sales.next(newsale)
          this.saleLoading = false;
          this.updateIsLoaded()
          resolve();
        });
    });
  }
  updateIsLoaded() {
    if (!this.orgLoading && !this.saleLoading) {
      this.isLoading = false;
    }
    else {
      this.isLoading = true;
    }

  }
  getUsersId(superUserId, userId, dataAccessRule, subUsers, superUserBranchId): string[] {
    let queryId: string[] = [];
    if (dataAccessRule == 'Own') {
      queryId = [userId];
    }
    else if (dataAccessRule === 'Team') {
      subUsers.forEach(element => {
        if (element.reportsToId === userId) {
          queryId.push(element.userId)
        }
      });
      queryId.push(userId)
    }
    else if (dataAccessRule === 'Branch') {
      const branchId = subUsers.find(
        (item) => item.userId === userId
      )?.branchId;
      if (branchId) {
        queryId.push(branchId)
      } else {
        if (userId == superUserId) {
          queryId.push(superUserBranchId)
        }
        else {
          queryId.push('n/a')
        }
      }
    }
    return queryId
  }
  //getting sales
  async getAllSales(superUserId: string, queryId: string[], dataAccessRule, custId) {
    if (dataAccessRule === 'All') {
      return await this.firestore
        .collection<Sales>('users/' + superUserId + '/sales', (ref) =>
          ref.orderBy('createdDate', 'desc').where('customerId', '==', custId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Own' || dataAccessRule === 'Team') {
      return await this.firestore
        .collection<Sales>('users/' + superUserId + '/sales', (ref) =>
          ref.orderBy('createdDate', 'desc').where('assignedTo', 'in', queryId).where('customerId', '==', custId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Branch') {
      return await this.firestore
        .collection<Sales>('users/' + superUserId + '/sales', (ref) =>
          ref.orderBy('createdDate', 'desc').where('associatedBranch', 'in', queryId).where('customerId', '==', custId)
        )
        .snapshotChanges();
    }
  }
  //getting customers
  async getAllCustomers(superUserId: string, queryId: string[], dataAccessRule) {
    if (dataAccessRule === 'All') {
      return await this.firestore
        .collection<Customer>('users/' + superUserId + '/customers', (ref) =>
          ref.orderBy('dateCreated', 'desc')
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Own' || dataAccessRule === 'Team') {
      return await this.firestore
        .collection<Customer>('users/' + superUserId + '/customers', (ref) =>
          ref.orderBy('dateCreated', 'desc').where('assignedTo', 'in', queryId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Branch') {
      return await this.firestore
        .collection<Customer>('users/' + superUserId + '/customers', (ref) =>
          ref
            .orderBy('dateCreated', 'desc')
            .where('associatedBranch', 'in', queryId)
        )
        .snapshotChanges();
    }
  }
  //getting organisations
  async getAllOrgs(superUserId: string, queryId: string[], dataAccessRule) {
    if (dataAccessRule === 'All') {
      return await this.firestore
        .collection<OrganisationModel>(
          'users/' + superUserId + '/Organisations',
          (ref) => ref.orderBy('createdDate', 'desc')
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Own' || dataAccessRule === 'Team') {
      return await this.firestore
        .collection<OrganisationModel>(
          'users/' + superUserId + '/Organisations',
          (ref) =>
            ref
              .orderBy('createdDate', 'desc')
              .where('assignedTo', 'in', queryId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Branch') {
      return await this.firestore
        .collection<OrganisationModel>(
          'users/' + superUserId + '/Organisations',
          (ref) =>
            ref
              .orderBy('createdDate', 'desc')
              .where('associatedBranch', 'in', queryId)
        )
        .snapshotChanges();
    }
  }
}
