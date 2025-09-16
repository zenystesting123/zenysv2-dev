import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class EmployeeListService {
  constructor(private db: AngularFirestore) {}
  // addEmployee
  addEmployee(sid, newEmployee) {
    return this.db
      .collection('users/' + sid + '/employees')
      .add({ ...newEmployee });
  }
  // get products in descending order
  getEmployees(sid: string) {
    return this.db
      .collection('users/' + sid + '/employees', (ref) =>
        ref.orderBy('createdDate', 'desc')
      )
      .snapshotChanges();
  }
  // send email to employee
  sendEmail(data) {
    return this.db.collection('email/').add(data);
  }
  // update employee
  updateEmployee(
    sid: string,
    employeeId: string,
    employeeFirstName,
    employeeSecondName,
    dateOfBirth,
    gender,
    contactNo,
    personalEmail,
    officialEmail,
    emergencyContactPerson,
    emergencyContactNo,
    commAddLine1,
    commAddLine2,
    commAddDist,
    commAddState,
    commAddCountry,
    commAddZip,
    permAddLine1,
    permAddLine2,
    permAddDist,
    permAddState,
    permAddCountry,
    permAddZip,
    status,
    dateOfJoining,
    exitDate,
    designation,
    bloodGroup,
    imageURL,
    CRMAccess,
    accType,
    reportsToId,
    reportsToName, code
  ) {
    return this.db.doc('users/' + sid + '/employees/' + employeeId).update({
      employeeFirstName,
      employeeSecondName,
      dateOfBirth,
      gender,
      contactNo,
      personalEmail,
      officialEmail,
      emergencyContactPerson,
      emergencyContactNo,
      commAddLine1,
      commAddLine2,
      commAddDist,
      commAddState,
      commAddCountry,
      commAddZip,
      permAddLine1,
      permAddLine2,
      permAddDist,
      permAddState,
      permAddCountry,
      permAddZip,
      status,
      dateOfJoining,
      exitDate,
      designation,
      bloodGroup,
      imageURL,
      CRMAccess,
      accType,
      reportsToId,
      reportsToName, code
    });
  }

  // save id as docId
  saveDocId(superUserId, docId: string) {
    return this.db
      .collection('users/' + superUserId + '/employees/')
      .doc(docId)
      .set(
        {
          docId: docId,
        },
        { merge: true }
      );
  }
  // fetching subusers
  getsubUsers(id:string){
    return this.db.collection('users/' + id + '/subUsers', (ref) => ref).snapshotChanges();
  }
  // add to invitation
  invitation(invitation) {
    return this.db.collection('invitations/').add({ ...invitation });
  }
  // check invitations with this email
  getInvitations(mail) {
    return this.db
      .collection('invitations', (ref) => ref.where('email', '==', mail))
      .snapshotChanges();
  }

    // check invitations with this email
    getInvitationsdocId(docId) {
      return this.db
        .collection('invitations', (ref) => ref.where('docId', '==', docId))
        .snapshotChanges();
    }

  getInvitationsSuperUser(mail) {
    return this.db
      .collection('invitations', (ref) =>
        ref.where('superUserEmail', '==', mail)
      )
      .snapshotChanges();
  }
  // updating subuser in users subuser collection if removed from subuser list
  removeSubUser(superUserId, id) {
    return this.db.doc('users/' + superUserId + '/subUsers/' + id).delete();
  }
  // updating subuser details in main users collection if removed from subuser list
  upsateSubUserDetails(id) {
    this.db.doc('users/' + id).update({
      accountType: 'SuperUser',
      superUserId: id,
      dataAccessRule: 'All',
      CRMAccess: false,
    });
  }
  updateInvitationEmp(invId, email, fName, lName, cNo, code) {
    this.db.doc('invitations/' + invId).update({
      crmAccess: false,
      accountType: null,
      status: null,
      email: email,
      reportsToId: null,
      reportsToName: null,
      employeeFName: fName,
      employeeLName: lName,
      contactNo: cNo,
      code: code
    });
  }
  updateInvitationSub(invId, accountType, email, rId, rName, fName, lName, cNo, code) {
    this.db.doc('invitations/' + invId).update({
      accountType: accountType,
      status: 'invited',
      crmAccess: true,
      email: email,
      reportsToId: rId,
      reportsToName: rName,
      employeeFName: fName,
      employeeLName: lName,
      contactNo: cNo,
      code: code
    });
  }
  updateUserFields(id,
    employeeFirstName,
    employeeSecondName,
    contactNo,
    permAddLine1,
    permAddLine2,
    permAddDist,
    permAddState,
    permAddCountry,
    permAddZip, code){
    this.db.doc('users/' + id).update({
      country: permAddCountry,
      city: permAddDist,
      firstname: employeeFirstName,
      lastname: employeeSecondName,
      phone: contactNo,
      pincode: permAddZip,
      state: permAddState,
      street1: permAddLine1,
      street2: permAddLine2,
      countryCode: code
    });
  }
  updateAddUserFields(id,
    employeeFirstName,
    employeeSecondName,
    contactNo,
    permAddLine1,
    permAddLine2,
    permAddDist,
    permAddState,
    permAddCountry,
    permAddZip,accountType, rId, rName, code
    ){
    this.db.doc('users/' + id).update({
      country: permAddCountry,
      city: permAddDist,
      firstname: employeeFirstName,
      lastname: employeeSecondName,
      phone: contactNo,
      pincode: permAddZip,
      state: permAddState,
      street1: permAddLine1,
      street2: permAddLine2,
      accountType: accountType,
      crmAccess: true,
      reportsToId: rId,
      reportsToName: rName,
      countryCode: code
    });
  }
  // removing from invitation
  removeInv(id) {
    return this.db.doc('invitations/' + id).delete();
  }
  getTodaysSub(yearMonth, superUserId, date) {
    return this.db
      .collectionGroup(yearMonth, (ref) =>
        ref.where('superUserId', '==', superUserId).where('date', '==', date)
      )
      .snapshotChanges();
  }
  updateEmployeeNo(superUserId, employeenumber) {
    employeenumber++;
    return this.db.doc('users/' + superUserId).update({
      employeeNoInit: employeenumber,
    });
  }
  getEmployeeDetails(email) {
    return this.db
      .collectionGroup('employees', (ref) =>
        ref.where('officialEmail', '==', email)
      )
      .get();
  }
  // updating
  upsateCRMfield(id) {
    this.db.doc('users/' + id).update({
      CRMAccess: true,
    });
  }
  // delete selected user case of changing emails
  deleteUser(sid) {
    return this.db
      .doc('users/' + sid)
      .delete();
  }
  // check if sucj]h a user exists or not
  checkUser(sId){
    return this.db.collection('users/').doc(sId).get();
  }

  // read already existing user profiles under this superuser
  getDefaultProfiles(sId: string) {
    return this.db
      .collection('users/' + sId + '/profilesDefault', (ref) => ref)
      .snapshotChanges();
  }

    // updating subuser in users subuser collection
    updateSubUser(userId, id, accountType, rId, rName, fName, lName, cNo, code) {
      this.db
        .doc('users/' + userId + '/subUsers/' + id)
        .update({
          accountType: accountType,
          reportsToId: rId,
          reportsToName: rName,
          firstname: fName,
          lastname:lName,
          contactNo: cNo,
          code
         });
    }
      // updating subuser details in main users collection
  updateUser(id, accountType) {
    this.db.doc('users/' + id).update({ accountType: accountType });
  }
  updateInv(invId, accType, rId, rName, fName, lName, cNo, code){
    this.db.doc('invitations/' + invId).update({
      accountType: accType,
      reportsToId: rId,
      reportsToName: rName,
      employeeFName: fName,
      employeeLName: lName,
      contactNo: cNo,
      code
    });
  }
  updateAddUserFieldsCRMFalse(id,
    employeeFirstName,
    employeeSecondName,
    contactNo,
    permAddLine1,
    permAddLine2,
    permAddDist,
    permAddState,
    permAddCountry,
    permAddZip,accountType, rId, rName, code
    ){
    this.db.doc('users/' + id).update({
      country: permAddCountry,
      city: permAddDist,
      firstname: employeeFirstName,
      lastname: employeeSecondName,
      phone: contactNo,
      pincode: permAddZip,
      state: permAddState,
      street1: permAddLine1,
      street2: permAddLine2,
      accountType: accountType,
      crmAccess: false,
      reportsToId: rId,
      reportsToName: rName,
      countryCode: code
    });
  }
  updateInvitationCRMFalse(invId,
    employeeFName,
    employeeLName,
    docId,
    ) {
    return this.db.doc('invitations/' + invId).update({
      employeeStatus: true,
      employeeFName: employeeFName,
      employeeLName: employeeLName,
      crmAccess: false,
      docId: docId,
      accountType: null,
      status: null,
      reportsToId: null,
      reportsToName: null
    });
  }
  updateInvitationCRMTrue(invId,
    employeeFName,
    employeeLName,
    docId,
    accountType,
    rId,
    rName,
    contactNo,
    code,
    ) {
    return this.db.doc('invitations/' + invId).update({
      employeeStatus: true,
      employeeFName: employeeFName,
      employeeLName: employeeLName,
      crmAccess: true,
      docId: docId,
      accountType: accountType,
      reportsToId: rId,
      reportsToName: rName,
      contactNo,
      code,
    });
  }

  updateReportsEmp(sid, employeeId, rId, rName){
    return this.db.doc('users/' + sid + '/employees/' + employeeId).update({
      reportsToId: rId,
      reportsToName: rName
    })
  }
}
