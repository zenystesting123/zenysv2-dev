/**********************************************************************************
Description: Component is used to dispalylist of sales under this user, on default shows 50 recent sales
             Only for Web
Inputs: userdata, superuser data, access control settings, layout observer from common service
Outputs:
**********************************************************************************/
import { Invoice, Sales } from '../../data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class SaleService {

  constructor(private db: AngularFirestore) {}

  getSale(userId, id) {
    return this.db
      .doc<Sales>('users/' + userId + '/sales/' + id)
      .valueChanges();
  }

  onUpdateSaleStatus(
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
    return this.db.doc('users/' + userId + '/sales/' + id).update({
      salesStage: status,
      stageHistory: stageHistories,
      currentStatusDate: datePlaced,
      inPipeline,
      won,
      lost,
      rejectionReasonValue,
      changeLog,
      lastModifiedDate: new Date().getTime()
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
      changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }

  //  get products under user
  getProducts(sid: string) {
    return this.db.collection('users/' + sid + '/products').snapshotChanges();
  }

  // selected product save to DB
  addProduct(sid, saleId, newProduct) {
    return this.db
      .collection('users/' + sid + '/sales/' + saleId + '/items')
      .add({ ...newProduct });
  }

  // get all followUps of this customer
  getFollowUpsWithSale(id: string, saleId, assignedTo) {
    return this.db
      .collection('users/' + id + '/Follow Ups', (ref) =>
        ref
          .where('saleId', '==', saleId)
          .where('completedStatus', '==', false)
          .where('assignedTo', '==', assignedTo)
      )
      .snapshotChanges();
  }

  async getDocsWithSale(id: string, saleId, assignedTo,DocType): Promise<Invoice[]> {
    return await this.db
      .collection('users/' + id +'/'+ DocType, (ref) =>
      ref.where('docData.saleID', '==', saleId)
      .where('docData.saleAssignedToOwner', '==', assignedTo)
      ).snapshotChanges()
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

  // get all open tasks of this customer
  getTaskswithSale(id: string, saleId, assignedTo,lastStatusOption) {
    return this.db
      .collection('users/' + id + '/tasks', (ref) =>
        ref
          .where('saleId', '==', saleId)
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

  onUpdateDoc(userId, id, assignedTo, docType) {
    return this.db.doc('users/' + userId   +'/'+ docType +'/' + id).update({
      'docData.saleAssignedToOwner':assignedTo,
    });
  }

  updateItemField(superUserId, saleId, itemsArray, changeLog){
    return this.db
      .doc('users/' + superUserId + '/sales/' + saleId)
      .update({itemsArray, changeLog, lastModifiedDate: new Date().getTime()});
  }
}
