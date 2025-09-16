import { Task, Sales, Service, Customer, OrganisationModel } from './../../data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class CrudModal1Service {

  constructor(private db: AngularFirestore,private storage: AngularFireStorage) {}
  
  //getting task to update from db
  getTaskToEdit(superUserId: string, taskId: string) {
    return this.db
      .doc<Task>('users/' + superUserId + '/tasks/' + taskId)
      .valueChanges();
  }
  
  //for getting selected sale details
  getSale(superUserId: string, saleId: string) {
    return this.db.doc('users/' + superUserId + '/sales/'+ saleId).valueChanges();
  }

  //for getting selected service details
  getService(superUserId: string, serviceId: string) {
    return this.db.doc('users/' + superUserId + '/services/'+ serviceId).valueChanges();
  }
    
  //getting all sales
  async getSales(superUserId: string, queryId: string[], dataAccessRule, custId) {
    if (dataAccessRule === 'All') {
      return await this.db
        .collection<Sales>('users/' + superUserId + '/sales', (ref) =>
          ref.orderBy('createdDate', 'desc').where('customerId', '==', custId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Own' || dataAccessRule === 'Team') {
      return await this.db
        .collection<Sales>('users/' + superUserId + '/sales', (ref) =>
          ref.orderBy('createdDate', 'desc').where('assignedTo', 'in', queryId).where('customerId', '==', custId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Branch') {
      return await this.db
        .collection<Sales>('users/' + superUserId + '/sales', (ref) =>
          ref.orderBy('createdDate', 'desc').where('associatedBranch', 'in', queryId).where('customerId', '==', custId)
        )
        .snapshotChanges();
    }
  }

  //getting all services
  async getServices(superUserId: string, queryId: string, dataAccessRule, custId) {
    if (dataAccessRule === 'All') {
      return await this.db
        .collection<Service>('users/' + superUserId + '/services', (ref) =>
          ref.orderBy('createdDate', 'desc').where('customerId', '==', custId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Own' || dataAccessRule === 'Team') {
      return await this.db
        .collection<Service>('users/' + superUserId + '/services', (ref) =>
          ref.orderBy('createdDate', 'desc').where('assignedTo', 'in', queryId).where('customerId', '==', custId)
        )
        .snapshotChanges();
    } else if (dataAccessRule === 'Branch') {
      return await this.db
        .collection<Service>('users/' + superUserId + '/services', (ref) =>
          ref.orderBy('createdDate', 'desc').where('associatedBranch', 'in', queryId).where('customerId', '==', custId)
        )
        .snapshotChanges();
    }
  }

  //for creating tasks
  CreateTask(
    uid,
    form,
    date,
    id,
    name,
    sname,
    surname,
    cname,
    userId,
    userName,
    associatedBranch,
    changeLog,
    statusInitial
  ) {
    return this.db.collection('users/' + uid + '/tasks').add({
      ...form,
      date: date,
      customerId: id,
      name: name,
      company: cname,
      status: statusInitial,
      lastName: sname,
      surname: surname,
      createdBy: userId,
      createdByName: userName,
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime(),
    });
  }

  //for updating tasks
  updateTask(
    uid,
    id: string,
    form,
    cid,
    fname,
    sname,
    surname,
    cname,
    associatedBranch,
    changeLog
  ) {
    if (!sname) {
      sname = ' ';
    }
    return this.db.doc('users/' + uid + '/tasks/' + id).update({
      ...form,
      customerId: cid,
      name: fname,
      company: cname,
      lastName: sname,
      surname: surname,
      associatedBranch,
      changeLog: changeLog,
      lastModifiedDate: new Date().getTime()
    });
  }

  // add attachment under customers attachment collection
  attachmentsToCollection(id, cid, name, url, path, date, uname, size) {
    return this.db
      .collection('users/' + id + '/tasks/' + cid + '/attachments/')
      .add({
        fileName: name,
        downloadURL: url,
        path: path,
        date: date,
        uploaded: uname,
        size: size,
      });
  }

  //update changeLog in db
  updateChangeLog(userId, modName, id, changeLog){
    this.db
        .doc('users/' + userId + '/' + modName + '/' + id)
        .update({ changeLog, lastModifiedDate: new Date().getTime() });
  }

  // get attachmets under tasks
  getAttachments(userId: string, taskId: string) {
    return this.db
      .collection('users/' + userId + '/tasks/' + taskId + '/attachments')
      .snapshotChanges();
  }

  // create sale task comments collection
  createCommentCollection(sid, id, newComment, changeLog) {
    return this.db
      .collection('users/' + sid + '/tasks/' + id + '/comments')
      .add({ ...newComment }).then(res => {
        this.db
          .doc(
            'users/' + sid + '/tasks/' + id 
          )
          .update({
            changeLog: changeLog, lastModifiedDate: new Date().getTime()
          });
      })
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
  updateCommentCollection(sid: string, id, commentId: string, body, changeLog) {
    return this.db
      .doc('users/' + sid + '/tasks/' + id + '/comments/' + commentId)
      .update({ body: body }).then(res => {
        this.db
          .doc(
            'users/' + sid + '/tasks/' + id
          )
          .update({
            changeLog: changeLog,
            lastModifiedDate: new Date().getTime()
          })
      })
  }
  
  //for deleting comments
  deleteComment(sid, taskid, commentId, changeLog) {
    return this.db
      .doc('users/' + sid + '/tasks/' + taskid + '/comments/' + commentId)
      .delete().then(res => {
        this.db
          .doc(
            'users/' + sid + '/tasks/' + taskid
          )
          .update({
            changeLog: changeLog,
            lastModifiedDate: new Date().getTime()
          })
      })
  }
  
  // attachment size under user updating
  updateSize(id: any, size: any) {
    return this.db.doc('users/' + id).update({ totalAttachmentsSize: size });
  }

  //delete task doc from firestore
  deleteDocTask(superUserId: string, id: any, docRef:string){
    return this.db
      .doc(
        `users/` +
          superUserId +
          `/tasks/` +
          id +
          `/attachments/` +
          docRef
      )
      .delete();
  }
}
