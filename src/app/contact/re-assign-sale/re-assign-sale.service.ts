import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Invoice } from 'src/app/data-models';
@Injectable({
  providedIn: 'root',
})
export class ReAssignSaleService {
  constructor(private db: AngularFirestore) { }
  // get all sales with this customer
  getAllSalesWithCustomer(userId, customerId, assignedTo) {
    return this.db
      .collection('users/' + userId + '/sales', (ref) =>
        ref
          .where('customerId', '==', customerId)
          .where('assignedTo', '==', assignedTo)
      )
      .snapshotChanges();
  }
  // get all sales with this customer
  getAllServicesWithCustomer(userId, customerId, assignedTo) {
    return this.db
      .collection('users/' + userId + '/services', (ref) =>
        ref
          .where('customerId', '==', customerId)
          .where('assignedTo', '==', assignedTo)
      )
      .snapshotChanges();
  }
  // updating  assigned to in sales collection from superuser
  onUpdateServiceMain(userId, id, assignedToName, associatedBranch, changeLog) {
    return this.db.doc('users/' + userId + '/services/' + id).update({
      assignedTo: userId,
      assignedToName: assignedToName,
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  // updating  assigned to in sales collection from subuser
  onUpdateServiceSub(
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
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  // updating  assigned to in sales collection from superuser
  onUpdateSaleMain(userId, id, assignedToName, associatedBranch, changeLog) {
    return this.db.doc('users/' + userId + '/sales/' + id).update({
      assignedTo: userId,
      assignedToName: assignedToName,
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  // updating  assigned to in sales collection from subuser
  onUpdateSaleSub(
    userId,
    subUserId,
    id,
    assignedToName,
    associatedBranch,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/sales/' + id).update({
      assignedTo: subUserId,
      assignedToName: assignedToName,
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  // updating  assigned to in customers collection from superuser
  onUpdateCustomerMain(
    userId,
    id,
    assignedToName,
    associatedBranch,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/customers/' + id).update({
      assignedTo: userId,
      assignedToName: assignedToName,
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  // updating  assigned to in sales collection from subuser
  onUpdateCustomerSub(
    userId,
    id,
    subUserId,
    assignedToName,
    associatedBranch,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/customers/' + id).update({
      assignedTo: subUserId,
      assignedToName: assignedToName,
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  // get all followUps of this customer
  getFollowUpsWithCustomer(id: string, customerId, assignedTo) {
    return this.db
      .collection('users/' + id + '/Follow Ups', (ref) =>
        ref
          .where('customerId', '==', customerId)
          .where('completedStatus', '==', false)
          .where('assignedTo', '==', assignedTo)
      )
      .snapshotChanges();
  }

  // get all open tasks of this customer
  getTaskswithCustomer(id: string, customerId, assignedTo) {
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref
          .where('customerId', '==', customerId)
          .where('status', '!=', 'Completed')
          .where('assignedTo', '==', assignedTo)
      )
      .snapshotChanges();
  }
  // updating  assigned to in tasks collection from superuser
  onUpdateTaskMain(userId, id, assignedToName, associatedBranch, changeLog) {
    return this.db.doc('users/' + userId + '/tasks/' + id).update({
      assignedTo: userId,
      assignedToName: assignedToName,
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  // updating  assigned to in tasks collection from subuser
  onUpdateTaskSub(
    userId,
    subUserId,
    id,
    assignedToName,
    associatedBranch,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/tasks/' + id).update({
      assignedTo: subUserId,
      assignedToName: assignedToName,
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }
  // updating  assigned to in Follow ups collection from superuser
  onUpdateFollowUpsMain(userId, id, assignedToName, associatedBranch, changeLog) {
    return this.db.doc('users/' + userId + '/Follow Ups/' + id).update({
      assignedTo: userId,
      assignedToName: assignedToName,
      associatedBranch,
      assignedToDate: new Date().getTime(),
      changeLog,
      lastModifiedDate: new Date().getTime()
    });
  }

  // updating  assigned to in Followups collection from subuser
  onUpdateFollowUpsSub(
    userId,
    subUserId,
    id,
    assignedToName,
    associatedBranch,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/Follow Ups/' + id).update({
      assignedTo: subUserId,
      assignedToName: assignedToName,
      associatedBranch,
      assignedToDate: new Date().getTime(),
      changeLog,
      lastModifiedDate: new Date().getTime()
    });
  }

  // getDocsWithCustomer(id: string, customerId, assignedTo,DocType) {
  //   return this.db
  //     .collection('users/' + id +'/'+ DocType, (ref) =>
  //       ref
  //         .where('customerData.custID', '==', customerId)
  //         .where('customerData.contactAssignedToOwner', '==', assignedTo)
  //     )
  //     .snapshotChanges();
  // }
  async getDocsWithCustomer(id: string, customerId: string, assignedTo: string,DocType: string,queryField1,queryField2): Promise<Invoice[]> {
    return await this.db
      .collection('users/' + id +'/'+ DocType, (ref) =>
      ref.where(queryField1, '==', customerId)
      .where(queryField2, '==', assignedTo)
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
              } as Invoice)
          )
        )
      )
      .toPromise();
  }
  // onUpdateDocsMain(userId, id,docType) {
  //   return this.db.doc('users/' + userId +'/'+ docType +'/'+ id).update({
  //     'customerData.contactAssignedToOwner': userId,
  //   });
  // }
  onUpdateDocsMain(userId, id,docType,scenario) {
   if(scenario == 'fromcust'){
    return this.db.doc('users/' + userId +'/'+ docType +'/'+ id).update({
      'customerData.contactAssignedToOwner': userId,
    });
   }else{
    return this.db.doc('users/' + userId +'/'+ docType +'/'+ id).update({
      'docData.saleAssignedToOwner': userId,
    });
   }

  }
  onUpdateDocsSub(userId,subUserId,id,docType,scenario) {
   if(scenario == 'fromcust'){
    return this.db.doc('users/' + userId +'/'+ docType +'/'+ id).update({
      'customerData.contactAssignedToOwner': subUserId,
    });
   }else{
    return this.db.doc('users/' + userId +'/'+ docType +'/'+ id).update({
      'docData.saleAssignedToOwner': subUserId,
    });
   }

  }
}
