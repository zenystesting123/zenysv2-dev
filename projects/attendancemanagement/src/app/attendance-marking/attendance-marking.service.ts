import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AttendanceMarkingService {
  constructor(private db: AngularFirestore) {}

  setStatus(
    basePath,
    attStatus,
    superUserId,
    date,
    employeeName,
    employeeID,
    loginTime,
    logoutTime,
    activeTime,
    activeTimeNo,
    autoLogouts
  ) {
    return this.db.doc(basePath).set(
      {
        [employeeID]: {
          attStatus: attStatus,
          superUserId: superUserId,
          date: date,
          id: date,
          employeeName: employeeName,
          checkOut: null,
          checkOutUpdated: null,
          checkIn: null,
          checkInUpdated: null,
          employeeId: employeeID,
          loginTime: loginTime,
          logoutTime: logoutTime,
          activeTime: activeTime,
          activeTimeNo: activeTimeNo,
          autoLogouts
        },
      },
      { merge: true }
    );
  }

  updateStatus(
    basePath,
    attStatus,
    superUserId,
    date,
    employeeName,
    employeeID,
    loginTime,
    logoutTime,
    activeTime,
    activeTimeNo,
    autoLogouts
  ) {
    return this.db.doc(basePath).update(
      {
        [employeeID]: {
          attStatus: attStatus,
          superUserId: superUserId,
          date: date,
          id: date,
          employeeName: employeeName,
          checkOut: null,
          checkOutUpdated: null,
          checkIn: null,
          checkInUpdated: null,
          employeeId: employeeID,
          loginTime: loginTime,
          logoutTime: logoutTime,
          activeTime: activeTime,
          activeTimeNo: activeTimeNo,
          autoLogouts
        },
      }
    );
  }

  setOtherStatus(
    basePath,
    attStatus,
    superUserId,
    date,
    employeeName,
    employeeID,
    loginTime,
    logoutTime,
    activeTime,
    activeTimeNo,
    autoLogouts
  ) {
    return this.db.doc(basePath).set(
      {
        [employeeID]: {
          attStatus: attStatus,
          superUserId: superUserId,
          date: date,
          id: date,
          employeeName: employeeName,
          checkOut: null,
          checkOutUpdated: null,
          checkIn: null,
          checkInUpdated: null,
          employeeId: employeeID,
          loginTime: loginTime,
          logoutTime: logoutTime,
          activeTime: activeTime,
          activeTimeNo: activeTimeNo,
          autoLogouts
        },
      },
      { merge: true }
    );
  }

  updateOtherStatus(
    basePath,
    attStatus,
    superUserId,
    date,
    employeeName,
    employeeID,
    loginTime,
    logoutTime,
    activeTime,
    activeTimeNo,
    autoLogouts
  ) {
    return this.db.doc(basePath).update(
      {
        [employeeID]: {
          attStatus: attStatus,
          superUserId: superUserId,
          date: date,
          id: date,
          employeeName: employeeName,
          checkOut: null,
          checkOutUpdated: null,
          checkIn: null,
          checkInUpdated: null,
          employeeId: employeeID,
          loginTime: loginTime,
          logoutTime: logoutTime,
          activeTime: activeTime,
          activeTimeNo: activeTimeNo,
          autoLogouts
        },
      }
    );
  }

  updateCheckOut(
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
        autoLogouts
      },
    });
  }

  updateCheckIn(
    basePath,
    checkIn,
    checkInUpdated,
    aStatus,
    cOut,
    cOutUp,
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
        checkOut: cOut,
        checkOutUpdated: cOutUp,
        checkIn: checkIn,
        checkInUpdated: checkInUpdated,
        employeeId: employeeID,
        loginTime: loginTime,
        logoutTime: logoutTime,
        activeTime: activeTime,
        activeTimeNo: activeTimeNo,
        autoLogouts
      },
    });
  }

  getEmployeeDetails(email) {
    return this.db
      .collectionGroup('employees', (ref) =>
        ref.where('officialEmail', '==', email)
      )
      .snapshotChanges();
  }
  setEmployeeIDFn(superUserId, id, employeeID) {
    return this.db
      .collection('users/' + superUserId + '/employees')
      .doc(id)
      .set(
        {
          employeeID: employeeID,
        },
        { merge: true }
      );
  }
  setNoCRMAccess(docId, bool) {
    return this.db.collection('users').doc(docId).set(
      {
        CRMAccess: bool,
      },
      { merge: true }
    );
  }
  //Function for getting the list of contacts
  getAttendanceData(collectionPath) {
    return this.db.collection(collectionPath).snapshotChanges();
  }
}
