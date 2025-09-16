import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Customer, Profile, Sales } from 'src/app/data-models';
import * as firebase from 'firebase';
import {
  Pipelines,
  customerPipelines,
  salePipelines,
  servicePipelines,
} from 'src/app/model/pipeline.modal';

@Injectable({
  providedIn: 'root',
})
export class StatusScriptService {
  fire = firebase.default.firestore();
  userRef = this.fire.collection('users');
  count = 0;
  called = 0;
  constructor(private db: AngularFirestore) {}

  async updateUser(userId, contactStatus, saleStatus) {
    console.log(userId, contactStatus, saleStatus);
    return await this.db
      .doc('users/' + userId)
      .update({ contactStatus: contactStatus, saleStages: saleStatus });
  }
  // getUserLength(){
  // //   return this.db.collection("users").get().subscribe(function(querySnapshot) {
  // //     console.log(querySnapshot.size);
  // // });
  // firebase.default
  // .firestore()
  // .collection("users")
  // .onSnapshot((snapshot) => {
  //   const data = snapshot.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));
  //   console.log("All data in 'books' collection", data);
  // });
  // }

  // getUsers(){
  //   return this.db.collection('users').snapshotChanges();
  // }

  getSingleUser(itemId: string) {
    return this.db.collection('users').doc<Profile>(itemId).valueChanges();
  }

  getCustomerPipeline(userId) {
    return this.db
      .doc<customerPipelines>(
        'users/' + userId + '/pipelines/customerPipelines'
      )
      .valueChanges();
  }

  async getAllProfile(userId) {
    return await this.db
      .collection('users/' + userId + '/profilesDefault')
      .snapshotChanges();
  }

  async onUpdateProfile(userId, profileId) {
    this.called++;
    console.log('executed', this.called, 'time');
    return await this.db
      .doc('users/' + userId + '/profilesDefault/' + profileId)
      .update({
        // isCheckedContAtt: true,
        // isCheckedSaleAtt: true,
        // isCheckedServiceAtt: true,
        // contattView: true,
        // contattAdd: true,
        // contattRemove: true,
        // saleattView: true,
        // saleattAdd: true,
        // saleattRemove: true,
        // serviceattView: true,
        // serviceattAdd: true,
        // serviceattRemove: true,
        orgDataAccessRule: 'All',
        isCheckedOrg: true,
        orgsView: true,
        orgsCreate: true,
        orgsEdit: true,
        orgsDelete: true,
        orgsDownload: true,
        orgReAssign: true,
      });
  }
  async onUpdateProfile2(userId, profileId, dataAccessRule) {
    this.called++;
    console.log('executed', this.called, 'time');
    return await this.db
      .doc('users/' + userId + '/profilesDefault/' + profileId)
      .update({
        contactReAssign: true,
        saleReAssign: true,
        followUpReAssign: true,
        servicesView: true,
        servicesEdit: true,
        servicesCreate: true,
        servicesDelete: true,
        serviceReAssign: true,
        taskReAssign: true,
        isCheckedService: true,
        isCheckedTask: true,
        servicesDownload: true,
        contactDataAccessRule: dataAccessRule,
        saleDataAccessRule: dataAccessRule,
        serviceDataAccessRule: dataAccessRule,
        taskDataAccessRule: dataAccessRule,
        followUpDataAccessRule: dataAccessRule,
      });
  }

  getAllCustomer(userId) {
    return this.db
      .collection('users/' + userId + '/customers')
      .snapshotChanges();
  }

  // read already existing branches under this superuser
  getBranches(id: string) {
    return this.db
      .collection('users/' + id + '/branches', (ref) => ref)
      .snapshotChanges();
  }

  // read already existing branches under this superuser
  getSubUsers(id: string) {
    return this.db
      .collection('users/' + id + '/subUsers', (ref) => ref)
      .snapshotChanges();
  }

  getAllSale(userId) {
    return this.db.collection('users/' + userId + '/sales').snapshotChanges();
  }

  getAllService(userId) {
    return this.db
      .collection('users/' + userId + '/services')
      .snapshotChanges();
  }

  async onUpdateService(userId, serviceId, inPipeline, won, lost) {
    console.log('Updating service', userId, serviceId);
    return this.db
      .doc('users/' + userId + '/services/' + serviceId)
      .update({ selectedServPipeline: 0, inPipeline, won, lost });
  }
  async onUpdateSale(userId, saleId, inPipeline, won, lost) {
    console.log('Updating sale', userId, saleId);
    return this.db
      .doc('users/' + userId + '/sales/' + saleId)
      .update({ selectedSalePipeline: 0, inPipeline, won, lost });
  }
  async onUpdateCustomer(userId, custId, inPipeline, won, lost) {
    return this.db
      .doc('users/' + userId + '/customers/' + custId)
      .update({ selectedContactPipeline: 0, inPipeline, won, lost });
  }
  async onUpdateCustomerBranch(userId, custId, associatedBranch) {
    console.log(userId, custId, associatedBranch);
    return this.db
      .doc('users/' + userId + '/customers/' + custId)
      .update({ associatedBranch });
  }
  async onUpdateSaleBranch(userId, custId, associatedBranch) {
    console.log(userId, custId, associatedBranch);
    return this.db
      .doc('users/' + userId + '/sales/' + custId)
      .update({ associatedBranch });
  }
  async onUpdateSupportBranch(userId, custId, associatedBranch) {
    return this.db
      .doc('users/' + userId + '/services/' + custId)
      .update({ associatedBranch });
  }
  async onUpdateTaskBranch(userId, custId, associatedBranch) {
    return this.db
      .doc('users/' + userId + '/tasks/' + custId)
      .update({ associatedBranch });
  }
  async onUpdateFollBranch(userId, custId, associatedBranch) {
    return this.db
      .doc('users/' + userId + '/Follow Ups/' + custId)
      .update({ associatedBranch });
  }
  // get all followUps of this customer
  getFollowUps(id: string) {
    return this.db.collection('users/' + id + '/Follow Ups').snapshotChanges();
  }
  // get all open tasks of this customer
  getTasks(id: string) {
    return this.db.collection('users/' + id + '/tasks').snapshotChanges();
  }
  // get products saved under this particuar sale
  getSaleProducts(sid: string, saleId: string) {
    return this.db
      .collection('users/' + sid + '/sales/' + saleId + '/items')
      .snapshotChanges();
  }
  checkItemsCollection(sid: string, saleId: string) {
    console.log('service console', sid, saleId);
    return this.db
      .collection('users/' + sid + '/sales/' + saleId + '/items')
      .get();
  }
  async onUpdateSaleItem(userId, saleId, itemsArray) {
    console.log('Updating sale', userId, saleId);
    return this.db
      .doc('users/' + userId + '/sales/' + saleId)
      .update({ itemsArray });
  }

  // add pipelines collection with customerPipelines
  updatePipeLinenames(id, module, pNames) {
    console.log(pNames);
    if (module === 'Customer') {
      return this.db
        .collection('users/' + id + '/pipelines')
        .doc('customerPipelines')
        .set({ ...pNames });
    }
    if (module === 'Sales') {
      return this.db
        .collection('users/' + id + '/pipelines')
        .doc('salePipelines')
        .set({ ...pNames });
    }
    if (module === 'Service') {
      return this.db
        .collection('users/' + id + '/pipelines')
        .doc('servicePipelines')
        .set({ ...pNames });
    }
  }

  async getAllCustomers(id: string): Promise<any[]> {
    return await this.db
      .collection('users/' + id + '/customers', (ref) => ref)
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as any)
          )
        )
      )
      .toPromise();
  }
  updateContactStatus(
    userId,
    customerId,
    selectedContactPipeline,
    status,
    stageHistory
  ) {
    console.log(
      userId,
      customerId,
      selectedContactPipeline,
      status,
      stageHistory
    );
    return this.db.doc('users/' + userId + '/customers/' + customerId).update({
      selectedContactPipeline,
      status,
      stageHistory:[stageHistory],
    });
  }
  getServicePipeline(userId) {
    return this.db
      .doc<servicePipelines>('users/' + userId + '/pipelines/servicePipelines')
      .valueChanges();
  }
  getAllServiceForPipeline(superUserId) {
    const collectionRef = this.db.collection(
      'users/' + superUserId + '/services',
      (ref) => ref
    );
    return collectionRef
      .get()
      .toPromise()
      .then((querySnapshot) => {
        const documents: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const documentWithId = Object.assign({ id: doc.id }, data);
          documents.push(documentWithId);
        });
        return documents;
      });
  }
  updateServicePipelineAndStatus(
    userId,
    serviceId,
    selectedServPipeline,
    servicesStage,
    stageHistory
  ) {
    console.log(
      userId,
      serviceId,
      selectedServPipeline,
      servicesStage,
      stageHistory
    );
    return this.db.doc('users/' + userId + '/services/' + serviceId).update({
      selectedServPipeline,
      servicesStage,
      stageHistory:[stageHistory],
    });
  }
  getSalePipeline(userId) {
    return this.db
      .doc<salePipelines>('users/' + userId + '/pipelines/salePipelines')
      .valueChanges();
  }
  getAllSaleForPipeline(superUserId) {
    const collectionRef = this.db.collection(
      'users/' + superUserId + '/sales',
      (ref) => ref
    );
    return collectionRef
      .get()
      .toPromise()
      .then((querySnapshot) => {
        const documents: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const documentWithId = Object.assign({ id: doc.id }, data);
          documents.push(documentWithId);
        });
        return documents;
      });
  }

  updateSalePipelineAndStatus(
    userId,
    saleId,
    selectedSalePipeline,
    salesStage,
    stageHistory
  ) {
    console.log(userId, saleId, selectedSalePipeline, salesStage, stageHistory);
    return this.db.doc('users/' + userId + '/sales/' + saleId).update({
      selectedSalePipeline,
      salesStage,
      stageHistory:[stageHistory]
    });
  }
}
