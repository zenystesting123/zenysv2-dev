import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Service } from 'src/app/data-models';

@Injectable({
  providedIn: 'root',
})
export class ServiceListService {
  constructor(private db: AngularFirestore) {}

  // update Service status from drag and drop in Service list view
  onUpdateserviceStatus(
    userId,
    id,
    status,
    stageHistories,
    datePlaced,
    inPipeline,
    won,
    lost,
    rejectionReasonValue,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/services/' + id).update({
      servicesStage: status,
      stageHistory: stageHistories,
      currentStatusDate: datePlaced,
      inPipeline,
      won,
      lost,
      rejectionReasonValue,
      changeLog,
      lastModifiedDate: new Date().getTime(),
    });
  }
  // updating  assigned to in service collection from superuser
  onUpdateServiceMain(userId, id, assignedToName, associatedBranch, changeLog) {
    return this.db.doc('users/' + userId + '/services/' + id).update({
      assignedTo: userId,
      assignedToName: assignedToName,
      associatedBranch,
      changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  // updating  assigned to in service collection from subuser
  onUpdateserviceSub(
    userId,
    subUserId,
    id,
    assignedToName,
    associatedBranch,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/services/' + id).update({
      assignedTo: subUserId,
      assignedToName: assignedToName,
      associatedBranch,
      changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  // get all open tasks with this Service
  getAllOpenTaskswithService(id: string, serviceId,lastStatusOption) {
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref.where('serviceId', '==', serviceId).where('status', '!=', lastStatusOption)
      )
      .snapshotChanges();
  }
  // updating  assigned to in tasks collection from superuser
  onUpdateTaskMain(userId, id, assignedToName, associatedBranch, changeLog) {
    return this.db.doc('users/' + userId + '/tasks/' + id).update({
      assignedTo: userId,
      assignedToName: assignedToName,
      associatedBranch,
      changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  //code commented
  // updating  assigned to in tasks collection from subuser
  // onUpdateTaskSub(
  //   userId,
  //   subUserId,
  //   id,
  //   assignedToName,
  //   associatedBranch,
  //   changeLog
  // ) {
  //   return this.db.doc('users/' + userId + '/tasks/' + id).update({
  //     assignedTo: subUserId,
  //     assignedToName: assignedToName,
  //     associatedBranch,
  //     changeLog,
  //     lastModifiedDate: new Date().getTime(),
  //     assignedToDate: new Date().getTime(),
  //   });
  // }
  //code commented
  //delete product
  // deleteProduct(sid, serviceId, productId) {
  //   this.db
  //     .doc('users/' + sid + '/services/' + serviceId + '/items/' + productId)
  //     .delete();
  // }
  //code commented
  // update product under this particular service
  // updateProductFromDialog(
  //   sid: string,
  //   serviceId: string,
  //   productId: string,
  //   unitPrice,
  //   quantity,
  //   discount
  // ) {
  //   this.db
  //     .doc('users/' + sid + '/services/' + serviceId + '/items/' + productId)
  //     .update({
  //       unitPrice: unitPrice,
  //       quantity: quantity,
  //       discount: discount,
  //     });
  // }
  //code commented

  //  get products under user
  // getProducts(sid: string) {
  //   return this.db.collection('users/' + sid + '/products').snapshotChanges();
  // }
  //code commented

  // // selected product save to DB
  // addProduct(sid, serviceId, newProduct) {
  //   return this.db
  //     .collection('users/' + sid + '/services/' + serviceId + '/items')
  //     .add({ ...newProduct });
  // }
  //code commented

  // // get products saved under this particuar service
  // getServiceProducts(sid: string, serviceId: string) {
  //   return this.db
  //     .collection('users/' + sid + '/services/' + serviceId + '/items')
  //     .snapshotChanges();
  // }
  getService(userId, id) {
    return this.db
      .doc<Service>('users/' + userId + '/services/' + id)
      .valueChanges();
  }
  // get all followUps of this customer
  getFollowUpsWithService(id: string, serviceId, assignedTo) {
    return this.db
      .collection('users/' + id + '/Follow Ups', (ref) =>
        ref
          .where('serviceId', '==', serviceId)
          .where('completedStatus', '==', false)
          .where('assignedTo', '==', assignedTo)
      )
      .snapshotChanges();
  }
  // get all open tasks of this customer
  getTaskswithService(id: string, serviceId, assignedTo,lastStatusOption) {
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref
          .where('serviceId', '==', serviceId)
          .where('status', '!=', lastStatusOption)
          .where('assignedTo', '==', assignedTo)
      )
      .snapshotChanges();
  }
  // updating  assigned to in tasks collection from subuser
  onUpdateTask(
    userId,
    id,
    assignedTo,
    assignedToName,
    associatedBranch,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/tasks/' + id).update({
      assignedTo,
      assignedToName,
      associatedBranch,
      changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  // updating  assigned to in Follow ups collection from superuser
  onUpdateFollowUp(userId, id, assignedTo, assignedToName, associatedBranch, changeLog) {
    return this.db.doc('users/' + userId + '/Follow Ups/' + id).update({
      assignedTo,
      assignedToName,
      associatedBranch,
      assignedToDate: new Date().getTime(),
      changeLog,
      lastModifiedDate: new Date().getTime()
    });
  }

}
