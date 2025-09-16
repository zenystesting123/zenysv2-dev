import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  FollowUps,
  PaymentReceipt,
  ProductInSaleModel,
  SalesNotes,
  Service,
  Task,
} from 'src/app/data-models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceDetailsService {
  constructor(private db: AngularFirestore, private http: HttpClient) {}
  // update taggeduser field to services doc
  updateTaggedUser(id, serviceId, taggedUsers) {
    return this.db
      .doc('users/' + id + '/services/' + serviceId)
      .update({ taggedUsers });
  }
  //read this particular service for service details
  getservice(serviceId: string, userId: string) {
    return this.db
      .doc<Service>('users/' + userId + '/services/' + serviceId)
      .valueChanges();
  }
  // get quoatations associated with this service
  getQuotations(userId: string, serviceId: string) {
    return this.db
      .collection('users/' + userId + '/Quotations', (ref) =>
        ref.where('docData.serviceID', '==', serviceId)
      )
      .snapshotChanges();
  }
  // get estimates associated with this service
  getEstimates(userId: string, serviceId: string) {
    return this.db
      .collection('users/' + userId + '/Estimates', (ref) =>
        ref.where('docData.serviceID', '==', serviceId)
      )
      .snapshotChanges();
  }
  // get attachments associated with this service
  getAttachments(userId: string, serviceId: string) {
    return this.db
      .collection(
        'users/' + userId + '/services/' + serviceId + '/attachments',
        (ref) => ref.orderBy('date', 'desc')
      )
      .snapshotChanges();
  }

  // get attachmets under task
  getAttachmentsTask(userId: string, taskId: string) {
    return this.db
      .collection(
        'users/' + userId + '/tasks/' + taskId + '/attachments',
        (ref) => ref.orderBy('date', 'desc')
      )
      .snapshotChanges();
  }
  // get collectionss associated with this service
  getPaymentReceipt(id: string, serviceId: string) {
    return this.db
      .collection<PaymentReceipt>('users/' + id + '/paymentsreceived', (ref) =>
        ref.where('serviceid', '==', serviceId)
      )
      .snapshotChanges();
  }
  // save attachment under services collection
  attachmentsToCollection(id, cid, sid, name, url, path, date, size, username) {
    return this.db
      .collection('users/' + id + '/services/' + sid + '/attachments')
      .add({
        customername: cid,
        fileName: name,
        downloadURL: url,
        path: path,
        date: date,
        size: size,
        uname: username,
      });
  }
  // get invoices associated with this service
  getInvoices(id: string, serviceId: string) {
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref.where('docData.serviceID', '==', serviceId)
      )
      .snapshotChanges();
  }
  // get expenses associated with this service
  getExpenses(id: string, sId) {
    return this.db
      .collection('users/' + id + '/Expenses', (ref) =>
        ref.where('serviceId', '==', sId)
      )
      .snapshotChanges();
  }
  // get quoatations associated with this service (subuser scenario : created by subuser)
  getQuotationssubUser(userId: string, serviceId: string, subid) {
    return this.db
      .collection('users/' + userId + '/Quotations', (ref) =>
        ref
          .where('docData.serviceID', '==', serviceId)
          .where('createdBy', '==', subid)
      )
      .snapshotChanges();
  }
  // get estimates associated with this service (subuser scenario : created by subuser)
  getEstimatessubUser(userId: string, serviceId: string, subid) {
    return this.db
      .collection('users/' + userId + '/Estimates', (ref) =>
        ref
          .where('docData.serviceID', '==', serviceId)
          .where('createdBy', '==', subid)
      )
      .snapshotChanges();
  }
  // get invoices associated with this service (subuser scenario : created by subuser)
  getInvoicessubUser(id: string, serviceId: string, subid) {
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref
          .where('docData.serviceID', '==', serviceId)
          .where('createdBy', '==', subid)
      )
      .snapshotChanges();
  }
  // services notes store to DB
  writeNote(
    form,
    createdById: string,
    createdDate: any,
    serviceId: string,
    cratedByName: string,
    userid: string,
    changeLog
  ) {
    this.db
      .collection('users/' + createdById + '/services/' + serviceId + '/Notes')
      .add({
        ...form,
        createdById: userid,
        createdDate: createdDate,
        cratedByName: cratedByName,
      })
      .then((res) => {
        this.db.doc('users/' + createdById + '/services/' + serviceId).update({
          changeLog: changeLog,
          lastModifiedDate: new Date().getTime(),
          lastNoteDate: new Date().getTime(),
          lastAddedNote: form.notes,
          lastNoteId: res.id,
        });
      });
  }
  // update service notes
  updateNote(
    notes,
    createdById: string,
    serviceId: string,
    noteId: string,
    changeLog,
    lastNoteId: string
  ) {
    this.db
      .doc(
        'users/' + createdById + '/services/' + serviceId + '/Notes/' + noteId
      )
      .update({
        notes: notes,
      })
      .then((res) => {
        if (lastNoteId != noteId) {
          // if last note is not updating
          this.db
            .doc('users/' + createdById + '/services/' + serviceId)
            .update({
              changeLog: changeLog,
              lastModifiedDate: new Date().getTime(),
            });
        } else {
          // if last note is updating then in customer update last note date and note
          this.db
            .doc('users/' + createdById + '/services/' + serviceId)
            .update({
              changeLog: changeLog,
              lastModifiedDate: new Date().getTime(),
              lastNoteDate: new Date().getTime(),
              lastAddedNote: notes,
            });
        }
      });
  }
  // update attachment size under user profile
  updateSize(id: any, size: any) {
    this.db.doc('users/' + id).update({ totalAttachmentsSize: size });
  }
  // fetch service notes
  readNote(serviceId: string, uId: string) {
    return this.db
      .collection<SalesNotes>(
        'users/' + uId + '/services/' + serviceId + '/Notes',
        (ref) => ref.orderBy('createdDate', 'desc')
      )
      .snapshotChanges();
  }
  // get open tasks
  getTasks(id: string, uid: string, serviceId, rule, account,lastStatusOption) {
    if (account == 'SuperUser') {
      return this.db
        .collection('users/' + id + '/tasks', (ref) =>
          ref.where('serviceId', '==', serviceId).where('status', '!=', lastStatusOption)
        )
        .snapshotChanges();
    } else {
      if (rule == 'All') {
        return this.db
          .collection('users/' + id + '/tasks', (ref) =>
            ref
              .where('serviceId', '==', serviceId)
              .where('status', '!=', lastStatusOption)
          )
          .snapshotChanges();
      } else {
        return this.db
          .collection('users/' + id + '/tasks', (ref) =>
            ref
              .where('status', '!=', lastStatusOption)
              .where('serviceId', '==', serviceId)
              .where('assignedTo', '==', uid)
              .orderBy('status') 
              .orderBy('date', 'desc')
          )
          .snapshotChanges();
      }
    }
  }
  // get all tasks
  getAllTasks(id: string, uid: string, serviceId, rule, account) {
    if (account == 'SuperUser') {
      return this.db
        .collection('users/' + id + '/tasks', (ref) =>
          ref.where('serviceId', '==', serviceId)
        )
        .snapshotChanges();
    } else {
      if (rule == 'All') {
        return this.db
          .collection('users/' + id + '/tasks', (ref) =>
            ref.where('serviceId', '==', serviceId)
          )
          .snapshotChanges();
      } else {
        return this.db
          .collection('users/' + id + '/tasks', (ref) =>
            ref
              .orderBy('date', 'desc')
              .where('serviceId', '==', serviceId)
              .where('assignedTo', '==', uid)
          )
          .snapshotChanges();
      }
    }
  }

  initshareinvoice(data) {
    // console.log(data);
    return this.db.doc('shared/' + data.serviceID).set(data);
  }
  getsharedwithid(serviceId) {
    return this.db.doc<any>('shared/' + serviceId).get();
  }
  addinvoicetoshare(serviceId, id) {
    return this.db
      .doc('shared/' + serviceId + '/Attachments/' + id)
      .set({ attachmentId: id, shareDate: Date.now() });
  }
  saveSharedinUser(userid, data) {
    return this.db
      .doc('users/' + userid + '/shared/' + data.serviceID)
      .set(data);
  }
  togglesharestatus(userid, id, serviceid, shareStatus) {
    this.db
      .doc('users/' + userid + '/services/' + serviceid + '/attachments/' + id)
      .update({ shareStatus: shareStatus });
  }
  // get customer details associated with this service
  getCustdetails(userId: string, customerId: string) {
    return this.db
      .doc<any>('users/' + userId + '/customers/' + customerId)
      .get();
  }

  // to send an email
  sendEmail(data) {
    return this.db.collection('email/').add(data);
  }

  //  get products under user
  getProducts(sid: string) {
    return this.db.collection('users/' + sid + '/products').snapshotChanges();
  }

  // selected product save to DB
  addProduct(sid, serviceId, newProduct) {
    return this.db
      .collection('users/' + sid + '/services/' + serviceId + '/items')
      .add({ ...newProduct });
  }
  // get products saved under this particuar service
  getserviceProducts(sid: string, serviceId: string) {
    return this.db
      .collection('users/' + sid + '/services/' + serviceId + '/items')
      .snapshotChanges();
  }
  // update product under this particular service
  updateProduct(
    sid: string,
    serviceId: string,
    productId: string,
    prodDes,
    currency,
    unitPrice,
    unit,
    quantity,
    discount,
    cgst,
    sgst,
    igst,
    vatRate
  ) {
    this.db
      .doc('users/' + sid + '/services/' + serviceId + '/items/' + productId)
      .update({
        prodDes: prodDes,
        currency: currency,
        unitPrice: unitPrice,
        unit: unit,
        quantity: quantity,
        discount: discount,
        cgst: cgst,
        sgst: sgst,
        igst: igst,
        vatRate: vatRate,
      });
  }
  //delete product
  deleteProduct(sid, serviceId, productId) {
    this.db
      .doc('users/' + sid + '/services/' + serviceId + '/items/' + productId)
      .delete();
  }
  // update product under this particular service
  updateProductFromDialog(
    sid: string,
    serviceId: string,
    productId: string,
    unitPrice,
    quantity,
    discount
  ) {
    this.db
      .doc('users/' + sid + '/services/' + serviceId + '/items/' + productId)
      .update({
        unitPrice: unitPrice,
        quantity: quantity,
        discount: discount,
      });
  }
  // create service task comments collection
  createCommentCollection(sid, id, newComment) {
    return this.db
      .collection('users/' + sid + '/tasks/' + id + '/comments')
      .add({ ...newComment });
  }
  // get comments
  getCommentsTask(sid: string, id) {
    return this.db
      .collection('users/' + sid + '/tasks/' + id + '/comments', (ref) =>
        ref.orderBy('postedTime', 'desc')
      )
      .snapshotChanges();
  }
  // update comments collection
  updateCommentCollection(sid: string, id, commentId: string, body) {
    this.db
      .doc('users/' + sid + '/tasks/' + id + '/comments/' + commentId)
      .update({ body: body });
  }
  getSingleComment(sid, id: string, commentId) {
    return this.db
      .doc<Task>('users/' + sid + '/tasks/' + id + '/comments/' + commentId)
      .valueChanges();
  }
  deleteComment(sid, taskid, commentId) {
    return this.db
      .doc('users/' + sid + '/tasks/' + taskid + '/comments/' + commentId)
      .delete();
  }
  // update task
  updateTask(
    sid: string,
    id,
    title,
    description,
    priority,
    status,
    dueDate,
    assignedToName,
    assignedTo
  ) {
    this.db.doc('users/' + sid + '/tasks/' + id).update({
      title: title,
      description: description,
      priority: priority,
      status: status,
      dueDate: dueDate,
      assignedTo: assignedTo,
      assignedToName: assignedToName,
    });
  }
  // get subusers details
  getSubusersList(sid: string) {
    return this.db.collection('users/' + sid + '/subUsers').snapshotChanges();
  }
  // update assigned to from services details
  updateAssignedTo(
    id: string,
    sid: string,
    assignedTo: string,
    assignedToname: string,
    associatedBranch,
    changeLog: any
  ) {
    this.db.doc('users/' + id + '/services/' + sid).update({
      assignedTo: assignedTo,
      assignedToName: assignedToname,
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }

  // update assigned to from services details
  updateBranch(id: string, sid: string, associatedBranch, changeLog: any) {
    this.db.doc('users/' + id + '/services/' + sid).update({
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
    });
  }

  // get last notes
  getlastNote(serviceId: string, uId: string) {
    return this.db
      .collection<SalesNotes>(
        'users/' + uId + '/services/' + serviceId + '/Notes',
        (ref) => ref.orderBy('createdDate', 'desc').limit(1)
      )
      .snapshotChanges();
  }
  // get Single product
  getSingleProduct(sid, serviceId, productId: string) {
    return this.db
      .doc<ProductInSaleModel>(
        'users/' + sid + '/services/' + serviceId + '/items/' + productId
      )
      .valueChanges();
  }
  //for deleting a task
  deleteTask(userId, taskid: string) {
    return this.db
      .doc('users/' + userId + '/tasks/' + taskid)
      .delete()
      .then(async (res) => {
        const qry = await this.db
          .collection('users/' + userId + '/tasks/' + taskid + '/comments')
          .ref.get();
        qry.forEach((doc) => {
          doc.ref.delete();
        });

        const qryAtt = await this.db
          .collection('users/' + userId + '/tasks/' + taskid + '/attachments')
          .ref.get();
        qryAtt.forEach((doc) => {
          doc.ref.delete();
        });
      });
  }
  // update estimated value in services
  updateserviceEstValue(uId: string, serviceId: string, estValue) {
    this.db.doc('users/' + uId + '/services/' + serviceId).update({
      estimatedValue: estValue,
    });
  }
  // priority updating fn
  updateServicePriority(uId: string, id: string, data: {}) {
    this.db.doc('users/' + uId + '/services/' + id).update(data);
  }
  // stage updating fn
  updateServiceStage(
    uId: string,
    id: string,
    status,
    stageHistory,
    updateDate,
    inPipeline,
    won,
    lost,
    rejectionReasonValue,
    changeLog
  ) {
    this.db.doc('users/' + uId + '/services/' + id).update({
      servicesStage: status,
      stageHistory: stageHistory,
      currentStatusDate: updateDate,
      inPipeline,
      won,
      lost,
      rejectionReasonValue,
      changeLog,
      lastModifiedDate: new Date().getTime(),
    });
  }

  // followup task completed update under followups collection
  UpdateTask(followUpId: string, completed, uid, changeLog) {
    this.db
      .doc('users/' + uid + '/Follow Ups/' + followUpId)
      .update({ completedStatus: completed, changeLog, lastModifiedDate: new Date().getTime()});
  }
  // fetching all FollowUps
  getAllFollowUps(serviceId: string, userId: string) {
    return this.db
      .collection<FollowUps>('users/' + userId + '/Follow Ups', (ref) =>
        ref.where('serviceId', '==', serviceId)
      )
      .snapshotChanges();
  }

  // read already existing branches under this superuser
  getBranches(id: string) {
    return this.db
      .collection('users/' + id + '/branches', (ref) => ref)
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
  updateChangeLog(userId, modName, id, changeLog) {
    this.db
      .doc('users/' + userId + '/' + modName + '/' + id)
      .update({ changeLog, lastModifiedDate: new Date().getTime() });
  }
  getAllServiceWaTemp(superUserId) {
    return this.db
      .collection('users/' + superUserId + '/messageTemplates', (ref) =>
        ref
          .where('templateType', '==', 'WhatsApp')
          .where('tempRecType', '==', 'Service')
      )
      .snapshotChanges();
  }
  //for saving logs of deleting documents
  addToDeleteLog(id, lines) {
    return this.db.collection('users/' + id + '/deleteLogs').add({ ...lines });
  }
   // fetch document under this customer
 fetchdocuments(custId: string, uId: string) {
  return this.db
    .collection<any>(
      'users/' + uId + '/services/' + custId + '/documents'
    )
    .snapshotChanges();
}
 //verification changes
 changeDocVerification(superUserId, custId, docId, verifiedBy,verifiedId,verifyDate,verifyVal,changeLog) {
  return this.db
    .doc(
      'users/' +
        superUserId +
        '/services/' +
        custId +
        '/documents/' +
        docId
    )
    .update({
      verificationStatus: verifyVal,
      verificationDate:verifyDate,
      verifiedBy:verifiedBy,
      verifiedById:verifiedId
    }).then(res => {
      return this.db
         .doc('users/' + superUserId +  '/services/' + custId)
         .update({changeLog:changeLog,lastModifiedDate:new Date().getTime()});
 });
}
}
