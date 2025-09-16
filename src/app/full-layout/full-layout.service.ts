import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  changeLogModel,
  Customer,
  Notification,
  OrganisationModel,
  Profile,
  rejectedCont,
} from '../data-models';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FullLayoutService {
  rejectedContacts: any = [];
  rejectedCount: number = 0;
  rejCount = 0; // to show the rejected Count in mat-list
  uploadedRec: number = 0;
  progressCSV = 0;
  showCloseBtn = false;
  failedCsv: boolean = false;

  constructor(private db: AngularFirestore, private http: HttpClient) {}

  getEmployeeDetails(email) {
    return this.db
      .collectionGroup('employees', (ref) =>
        ref.where('officialEmail', '==', email)
      )
      .snapshotChanges();
  }

  changesubscriptionPmtDoneCurrentCycle(userId, value) {
    this.db
      .doc<any>('users/' + userId)
      .update({ subscriptionPmtDoneCurrentCycle: value });
  }
  //for saving each line of csv uploaded in to db
  async saveExcel(
    id,
    lines,
    stages,
    date,
    changeLog,
    totalRec,
    duplicateEmailDisable,
    duplicateContactNumberDisable,
    dataLength
  ) {
    let emailExists = false; //boolean if email is already present
    let contNoExists = false;//boolean if cont no is already present
    let altContExists = false;//boolean if alt cont no is already present
    let firstNameMissing = false; //boolean if first name missing case

    // local variables to hold DB search for email and cont no and alt cont no
    let contactEmailData;
    let contactNumData1;
    let contactNumData2;
    let contactNumData3;
    let contactNumData4;

    // if disable check is on and email present
    if (duplicateEmailDisable === true && lines.email?.length > 0) {
      contactEmailData = await this.getEmailWithContact(id, lines.email);
    }

    // if duplicate check is on and contact number present
    if (duplicateContactNumberDisable == true && lines.contactNo?.length > 0) {
      contactNumData1 = await this.getAltContactNumWithContact(
        id,
        lines.contactNo
      );
      contactNumData2 = await this.getContactNumWithContact(
        id,
        lines.contactNo
      );
    }

    // if duplicate check is on and alt cont no present
    if (
      duplicateContactNumberDisable == true &&
      lines.alternateContactNumber?.length > 0
    ) {
      contactNumData3 = await this.getAltContactNumWithContact(
        id,
        lines.alternateContactNumber
      );
      contactNumData4 = await this.getContactNumWithContact(
        id,
        lines.alternateContactNumber
      );
    }

    // reason is assigned according to rejection cause, and the object is pushed to rejected Array
    if (
      dataLength < 25 ||
      !lines.firstName ||
      typeof lines.firstName === 'undefined' ||
      lines.firstName === '' ||
      lines.firstName?.length < 3
    ) {
      let rejCont: rejectedCont = {
        reason: 'Mandatory firstname not found/empty row',
        count: this.rejCount,
      };
      let element = { ...rejCont, ...lines };
      this.rejectedContacts.push(element);
      firstNameMissing = true;
    } else if (contactEmailData?.length > 0) {
      emailExists = true;
      let rejCont: rejectedCont = {
        reason: 'Email already present',
        count: this.rejCount,
      };
      let element = { ...rejCont, ...lines };
      this.rejectedContacts.push(element);
    } else if (contactNumData1?.length > 0 || contactNumData2?.length > 0) {
      contNoExists = true;
      let rejCont: rejectedCont = {
        reason: 'Duplicate contact number issue found',
        count: this.rejCount,
      };
      let element = { ...rejCont, ...lines };
      this.rejectedContacts.push(element);
    } else if (contactNumData3?.length > 0 || contactNumData4?.length > 0) {
      altContExists = true;
      let rejCont: rejectedCont = {
        reason: 'Alternate contact number already exists',
        count: this.rejCount,
      };
      let element = { ...rejCont, ...lines };
      this.rejectedContacts.push(element);
    }

    // if conditions are met save to DB
    if (
      dataLength >= 25 &&
      emailExists === false &&
      contNoExists === false &&
      altContExists === false &&
      firstNameMissing === false
    ) {
      return await this.db.collection('users/' + id + '/customers').add({
        ...lines,
        createdMode: 'CSVUpload',
        stageHistory: stages,
        currentStatusDate: date,
        changeLog,
        lastModifiedDate: new Date().getTime(),
        assignedToDate: new Date().getTime(),
      });
    } else {
      // rejected contacts functions
      this.rejCount++; // to get the rejected count

      if (this.rejCount != 0) {
        this.failedCsv = true;
        this.rejectedCount = this.rejectedContacts.length;
      }
      this.progressCSV =
        ((this.uploadedRec + this.rejectedContacts.length) / totalRec) * 100;

      if (this.uploadedRec + this.rejectedContacts.length === totalRec) {
        this.showCloseBtn = true;
      }
    }
  }
  async getEmailWithContact(superUserId, email): Promise<any> {
    return await this.db
      .collection('users/' + superUserId + '/customers', (ref) =>
        ref.where('email', '==', email)
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
  async getContactNumWithContact(superUserId, contactNo): Promise<Customer[]> {
    return await this.db
      .collection('users/' + superUserId + '/customers', (ref) =>
        ref.where('contactNo', '==', contactNo)
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
  async getAltContactNumWithContact(
    superUserId,
    alternateContactNumber
  ): Promise<Customer[]> {
    return await this.db
      .collection('users/' + superUserId + '/customers', (ref) =>
        ref.where('alternateContactNumber', '==', alternateContactNumber)
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
  getCustomer(id: string) {
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref.orderBy('dateCreated', 'desc')
      )
      .snapshotChanges();
  }
  getAllCustomers(id: String) {
    return this.db.collection('users/' + id + '/customers').snapshotChanges();
  }
  savesubscription(id, subdata) {
    return this.db
      .collection('users/' + id + '/subscription')
      .doc(subdata.id)
      .set(subdata);
  }
  updatePaymentHistory(id, paymentHistory) {
    return this.db
      .doc('users/' + id)
      .update({ paymentHistory: paymentHistory });
  }
  updatePlan(id, plan) {
    return this.db.doc('users/' + id).update({ plan: plan });
  }
  getsubscription(subscription_id) {
    return this.http.post(environment.cloudFunctions.getsubscription, {
      subscription_id: subscription_id,
    });
  }
  getSuperUserDetails(superUserId: string) {
    return this.db.doc<Profile>('users/' + superUserId).valueChanges();
  }
  getCustomers(id: String) {
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref.orderBy('dateCreated', 'desc').limit(50)
      )
      .snapshotChanges();
  }

  getCustomerssubuser(id: String, id1) {
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .orderBy('dateCreated', 'desc')
          .where('assignedTo', '==', id1)
          .limit(50)
      )
      .snapshotChanges();
  }
  getSalessubuser(id, id1) {
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref.where('assignedTo', '==', id1)
      )
      .snapshotChanges();
  }
  getSales(id: string) {
    return this.db
      .collection('users/' + id + '/sales', (ref) => ref)
      .snapshotChanges();
  }
  getInquiries(id: string) {
    return this.db
      .collection('users/' + id + '/Inquiries', (ref) =>
        ref.orderBy('date', 'desc')
      )
      .snapshotChanges();
  }
  getFollowUps(id: string) {
    return this.db
      .collection('users/' + id + '/Follow Ups', (ref) =>
        ref.orderBy('callStartDate', 'asc')
      )
      .snapshotChanges();
  }
  getFollowUpssubuser(mid, uid) {
    return this.db
      .collection('users/' + mid + '/Follow Ups', (ref) =>
        ref.where('assignedTo', '==', uid)
      )
      .snapshotChanges();
  }
  //function for getting the details of the user
  getUsers(id) {
    return this.db.doc<any>('users/' + id).valueChanges();
  }
  getInvoiceMonthFromApi(superUserId, firstDay, lastDay) {
    return this.db
      .collection('users/' + superUserId + '/Invoices', (ref) =>
        ref
          .where('docData.createdDate', '>=', firstDay)
          .where('docData.createdDate', '<=', lastDay)
      )
      .snapshotChanges();
  }
  getSalesMonthFromApi(superUserId, firstDay, lastDay) {
    return this.db
      .collection('users/' + superUserId + '/sales', (ref) =>
        ref
          .where('createdDate', '>=', firstDay)
          .where('createdDate', '<=', lastDay)
      )
      .snapshotChanges();
  }
  getTask(userId, id) {
    return this.db.doc('users/' + userId + '/tasks/' + id).valueChanges();
  }
  getFollowUp(userId, id) {
    return this.db.doc('users/' + userId + '/Follow Ups/' + id).valueChanges();
  }
  getContact(userId, id) {
    return this.db.doc('users/' + userId + '/customers/' + id).valueChanges();
  }
  getOrg(userId, id) {
    return this.db
      .doc<OrganisationModel>('users/' + userId + '/Organisations/' + id)
      .valueChanges();
  }
  getSale(userId, id) {
    return this.db.doc('users/' + userId + '/sales/' + id).valueChanges();
  }
  getService(userId, id) {
    return this.db.doc('users/' + userId + '/services/' + id).valueChanges();
  }
  getCustomerMonthFromApi(superUserId, firstDay, lastDay) {
    return this.db
      .collection('users/' + superUserId + '/customers', (ref) =>
        ref
          .where('dateCreated', '>=', firstDay)
          .where('dateCreated', '<=', lastDay)
      )
      .snapshotChanges();
  }
  getQuotationMonthFromApi(superUserId, firstDay, lastDay) {
    return this.db
      .collection('users/' + superUserId + '/Quotations', (ref) =>
        ref
          .where('docData.createdDate', '>=', firstDay)
          .where('docData.createdDate', '<=', lastDay)
      )
      .snapshotChanges();
  }
  getEstimatesMonthFromApi(superUserId, firstDay, lastDay) {
    return this.db
      .collection('users/' + superUserId + '/Estimates', (ref) =>
        ref
          .where('docData.createdDate', '>=', firstDay)
          .where('docData.createdDate', '<=', lastDay)
      )
      .snapshotChanges();
  }

  // to get help video from resources corresponding to page
  getHelpVideos(page) {
    return this.db
      .collection('help/resources/videos', (ref) =>
        ref.where('page', '==', page)
      )
      .snapshotChanges();
  }
  // to get help topics from resources corresponding to page
  getHelpTopics(page) {
    return this.db
      .collection('help/resources/helpTopics', (ref) =>
        ref.where('page', '==', page)
      )
      .snapshotChanges();
  }
  //mark notification as read
  onUpdateNotificationStatus(id, notificationId) {
    return this.db
      .doc('users/' + id + '/Notifications/' + notificationId)
      .update({ viewStatus: true });
  }
  //update notification count
  onUpdateNotificationCount(id, notificationLength) {
    var firestore = this.db;
    var docRef = firestore.collection('users').doc(id);
    docRef.update({ notificationCount: notificationLength });
  }
  updateSequenceNumber(id, count) {
    this.db.doc('users/' + id).update({ contactSequentialNumber: count });
  }
  // read data from invitation collection
  getInvitation(email) {
    return this.db
      .collection('invitations/', (ref) =>
        ref.where('email', '==', email).where('employeeStatus', '==', true)
      )
      .snapshotChanges();
  }

  getAttendance(dt) {
    return this.db.doc(dt).valueChanges();
  }
  updateLogOutTime(
    basePath,
    checkOut,
    checkOutUpdated,
    aStatus,
    cIn,
    cInUp,
    sId,
    employeeID,
    dat,
    eName,
    ID,
    loginTime,
    logoutTime,
    activeTime,
    activeTimeNo,
    autoLogouts
  ) {
    return this.db.doc(basePath).update({
      [employeeID]: {
        attStatus: aStatus,
        superUserId: sId,
        date: dat,
        id: ID,
        employeeName: eName,
        checkOut: checkOut,
        checkOutUpdated: checkOutUpdated,
        checkIn: cIn,
        checkInUpdated: cInUp,
        employeeId: employeeID,
        loginTime: loginTime,
        logoutTime: logoutTime,
        activeTime: activeTime,
        activeTimeNo: activeTimeNo,
        autoLogouts,
      },
    });
  }

  updateLogInTime(
    basePath,
    checkOut,
    checkOutUpdated,
    aStatus,
    cIn,
    cInUp,
    sId,
    employeeID,
    dat,
    eName,
    ID,
    loginTime,
    logoutTime,
    activeTime,
    activeTimeNo
  ) {
    return this.db.doc(basePath).update({
      [employeeID]: {
        attStatus: aStatus,
        superUserId: sId,
        date: dat,
        id: ID,
        employeeName: eName,
        checkOut: checkOut,
        checkOutUpdated: checkOutUpdated,
        checkIn: cIn,
        checkInUpdated: cInUp,
        employeeId: employeeID,
        loginTime: loginTime,
        logoutTime: logoutTime,
        activeTime: activeTime,
        activeTimeNo: activeTimeNo,
      },
    });
  }

  setLogInTime(
    basePath,
    checkOut,
    checkOutUpdated,
    aStatus,
    cIn,
    cInUp,
    sId,
    employeeID,
    dat,
    eName,
    ID,
    loginTime,
    logoutTime,
    activeTime,
    activeTimeNo
  ) {
    return this.db.doc(basePath).set(
      {
        [employeeID]: {
          attStatus: aStatus,
          superUserId: sId,
          date: dat,
          id: ID,
          employeeName: eName,
          checkOut: checkOut,
          checkOutUpdated: checkOutUpdated,
          checkIn: cIn,
          checkInUpdated: cInUp,
          employeeId: employeeID,
          loginTime: loginTime,
          logoutTime: logoutTime,
          activeTime: activeTime,
          activeTimeNo: activeTimeNo,
        },
      },
      { merge: true }
    );
  }
  // lock user update in invitation collection
  lockUser(id: string) {
    return this.db.doc('invitations/' + id).update({
      accessLockAutologout: true,
    });
  }
  lockatUser(id: string) {
    return this.db.doc('users/' + id).update({
      accessLockAutologout: true,
    });
  }

  // lock user update in subuser collection
  lockSubUser(superUserId: string, subId: string) {
    return this.db.doc('users/' + superUserId + '/subUsers/' + subId).update({
      accessLockAutologout: true,
    });
  }
  getNotifyFollowUp(superUserId: string, UserId: string) {
    return this.db
      .collection('users/' + superUserId + '/Follow Ups', (ref) =>
        ref
          .orderBy('dateCreated', 'desc')
          .where('assignedTo', '==', UserId)
          .where('notified', '==', false)
      )
      .snapshotChanges();
  }
  UpdateFollowupNotified(superUserId: string, followUpId: string) {
    this.db
      .doc('users/' + superUserId + '/Follow Ups/' + followUpId)
      .update({ notified: true, lastModifiedDate: new Date().getTime() });
  }
  // read already existing branches under this superuser
  getBranches(id: string) {
    return this.db
      .collection('users/' + id + '/branches', (ref) => ref)
      .snapshotChanges();
  }

  updateChangeLog(userId, modName, id, changeLog) {
    this.db
      .doc('users/' + userId + '/' + modName + '/' + id)
      .update({ changeLog, lastModifiedDate: new Date().getTime() });
  }
  addCall(sid, followUpData) {
    return this.db.collection('users/' + sid + '/Follow Ups').add({
      ...followUpData, lastModifiedDate: new Date().getTime(),
      assignedToDate: new Date().getTime()
    });
  }
  //add customDocument
  documentToCollection(
    id,
    cid,
    name,
    url,
    path,
    date,
    uname,
    size,
    customDocIdentifier,
    module,
    changeLog
  ) {
    return this.db
      .collection('users/' + id + `/${module}/` + cid + '/documents/')
      .add({
        fileName: name,
        downloadURL: url,
        path: path,
        uploadedDate: date,
        size: size,
        uploadedBy: uname,
        docIdentifier: customDocIdentifier,
      })
      .then((res) => {
        return this.db.doc('users/' + id + `/${module}/` + cid).update({
          changeLog: changeLog,
          lastModifiedDate: new Date().getTime(),
        });
      });
  }
  // delete attachment under document collection
  deleteCustomDocument(
    uid: string,
    cid: string,
    id: string,
    collectionName: string
  ) {
    return this.db
      .doc('users/' + uid + `/${collectionName}/` + cid + '/documents/' + id)
      .delete();
  }

  updateEnableLiteMode(userId: string, enableLiteMode: boolean) {
   return this.db.doc('users/' + userId).update({ enableLiteMode: enableLiteMode });
  }
  // load recent notifications first time
  loadNotifRecent(uid) {
    return this.db
      .collection('users/' + uid + '/Notifications', (ref) =>
        ref.limit(20).orderBy('createdDate', 'desc')
      )
      .snapshotChanges();
  }
  // read previous page of recent notification
  prevPageRecent(
    uid,
    firstInResponse_recent,
    prev_strt_at_recent,
    pagination_clicked_count_recent
  ) {
    return this.db
      .collection('users/' + uid + '/Notifications', (ref) =>
        ref
          .orderBy('createdDate', 'desc')
          .startAt(
            this.get_prev_startAt_recent(
              prev_strt_at_recent,
              pagination_clicked_count_recent
            )
          )
          .endBefore(firstInResponse_recent)
          .limit(20)
      )
      .get();
  }
  // read next page of recent notification
  nextpageRecent(uid, lastInResponse_recent) {
    return this.db
      .collection('users/' + uid + '/Notifications', (ref) =>
        ref
          .limit(20)
          .orderBy('createdDate', 'desc')
          .startAfter(lastInResponse_recent)
      )
      .get();
  }
  // load unread notifications initially
  loadItemsUnread(uid) {
    return this.db
      .collection('users/' + uid + '/Notifications', (ref) =>
        ref
          .limit(20)
          .orderBy('createdDate', 'desc')
          .where('viewStatus', '==', false)
      )
      .snapshotChanges();
  }
  // load unread notifications initially
  loadItemsUnreadBadge(uid) {
    return this.db
      .collection('users/' + uid + '/Notifications', (ref) =>
        ref
          .limit(21)
          .orderBy('createdDate', 'desc')
          .where('viewStatus', '==', false)
      )
      .snapshotChanges();
  }
  // read previous page of unread notification
  prevPageUnread(
    uid,
    prev_strt_at_unRead,
    pagination_clicked_count_unRead,
    firstInResponse_unRead
  ) {
    return this.db
      .collection('users/' + uid + '/Notifications', (ref) =>
        ref
          .orderBy('createdDate', 'desc')
          .startAt(
            this.get_prev_startAt_unRead(
              prev_strt_at_unRead,
              pagination_clicked_count_unRead
            )
          )
          .endBefore(firstInResponse_unRead)
          .limit(20)
          .where('viewStatus', '==', false)
      )
      .get();
  }
  // read next page of unread notification
  nxtPageUnread(uid, lastInResponse_unRead) {
    return this.db
      .collection('users/' + uid + '/Notifications', (ref) =>
        ref
          .limit(20)
          .orderBy('createdDate', 'desc')
          .startAfter(lastInResponse_unRead)
          .where('viewStatus', '==', false)
      )
      .get();
  }
  //Return the Unread Doc rem where previous page will startAt
  get_prev_startAt_unRead(
    prev_strt_at_unRead,
    pagination_clicked_count_unRead
  ) {
    if (prev_strt_at_unRead.length > pagination_clicked_count_unRead + 1)
      prev_strt_at_unRead.splice(
        prev_strt_at_unRead.length - 2,
        prev_strt_at_unRead.length - 1
      );
    return prev_strt_at_unRead[pagination_clicked_count_unRead - 1];
  }
  //Return the Recent Doc rem where previous page will startAt
  get_prev_startAt_recent(
    prev_strt_at_recent,
    pagination_clicked_count_recent
  ) {
    if (prev_strt_at_recent.length > pagination_clicked_count_recent + 1)
      prev_strt_at_recent.splice(
        prev_strt_at_recent.length - 2,
        prev_strt_at_recent.length - 1
      );
    return prev_strt_at_recent[pagination_clicked_count_recent - 1];
  }

  updateUnread(uid) {
    this.db
      .collection('users/' + uid + '/Notifications')
      .get()
      .toPromise()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.update({
            viewStatus: true,
          });
        });
      });
  }
}
