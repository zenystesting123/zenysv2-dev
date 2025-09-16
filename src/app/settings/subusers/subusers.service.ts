import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import {
  Customer,
  defaultProfileFields,
  ExpenseCategories,
  Profile,
  Sales,
  Service,
} from 'src/app/data-models';

@Injectable({
  providedIn: 'root',
})
export class SubusersService {
  expenseCategory: string[];

  constructor(private db: AngularFirestore) {
    this.expenseCategory = this.getCategory();
  }
  getCategory(): string[] {
    let cat = new ExpenseCategories();
    return cat.categories;
  }
  // fetching subusers
  getsubUsers(id: string) {
    return this.db
      .collection('users/' + id + '/subUsers', (ref) => ref)
      .snapshotChanges();
  }
  // updating subuser in users subuser collection
  onUpdateReportsToName(userId, id, reportsToName) {
    this.db.doc('users/' + userId + '/subUsers/' + id).update({
      reportsToName: reportsToName,
    });
  }
  updateSubUser(
    userId,
    id,
    accountType,
    reportsToId,
    reportsToName,
    firstname,
    lastname,
    contactNo,
    email,
    code,
    branchId,
    branchName,
    extensionNumber:string,
    callerId:string
  ) {
    extensionNumber = extensionNumber.toString();
    callerId = callerId.toString();
    this.db.doc('users/' + userId + '/subUsers/' + id).update({
      accountType: accountType,
      reportsToName: reportsToName,
      reportsToId: reportsToId,
      firstname,
      lastname,
      contactNo,
      email,
      code,
      branchId,
      branchName,
      extensionNumber,
      callerId:callerId
    });
  }
  // updating subuser in users subuser collection
  updateSubUserAcc(userId, id, accountType) {
    this.db.doc('users/' + userId + '/subUsers/' + id).update({
      accountType: accountType,
    });
  }
  // updating subuser details in main users collection
  updateUser(
    id,
    superuserId,
    accountType,
    firstname,
    lastname,
    contactNo,
    email,
    code
  ) {
    this.db.doc('users/' + id).update({
      accountType: accountType,
      superUserId: superuserId,
      firstname,
      lastname,
      phone: contactNo,
      email,
      countryCode: code,
    });
  }
  // updating subuser details in main users collection
  updateUserAcc(id, accountType) {
    this.db.doc('users/' + id).update({ accountType: accountType });
  }
  // create new user profile under this superuser
  create(id: string, newtemplate) {
    this.db
      .collection('users/' + id + '/profilesDefault')
      .add({ ...newtemplate });
  }
  // read already existing user profiles under this superuser
  getDefaultProfiles(id: string) {
    return this.db
      .collection('users/' + id + '/profilesDefault', (ref) => ref)
      .snapshotChanges();
  }
  // update changes made for a userprofile under this superuser
  updateProfiles(
    id: string,
    profileId: string,
    profileName,
    profileDescription,
    dialogdataAccessRule,
    isCheckedCont,
    isCheckedSale,
    isCheckedSalesEst,
    isCheckedSalesQuot,
    isCheckedSalesInv,
    isCheckedDashB,
    isCheckedNotes,
    isCheckedFoll,
    isCheckedAtt,
    isCheckedSett,
    contactsView,
    contactsCreate,
    contactsEdit,
    contactsDelete,
    salesView,
    salesCreate,
    salesEdit,
    salesDelete,
    salesDViewEst,
    salesDCreateEst,
    salesDEditEst,
    salesDViewQuot,
    salesDCreateQuot,
    salesDEditQuot,
    salesDViewInv,
    salesDCreateInv,
    salesDEditInv,
    DBView,
    DBDownloadReports,
    notesView,
    notesCreate,
    notesEdit,
    notesDelete,
    follView,
    follCreate,
    follEdit,
    follDelete,
    attView,
    attAdd,
    attRemove,
    settView,
    settEdit,
    isCheckedColl,
    isCheckedExp,
    DBReportsView,
    collectionsView,
    collectionCreate,
    collectionEdit,
    collectionDelete,
    expView,
    expCreate,
    expEdit,
    expDelete,
    isCheckedItems,
    itemsView,
    itemsCreate,
    itemsEdit,
    itemsDelete,
    contactsDownload,
    salesDownload,
    estDownload,
    quotDownload,
    invDownload,
    expDownload,
    collDownload,
    contattView,
    contattAdd,
    contattRemove,
    saleattView,
    saleattAdd,
    saleattRemove,
    serviceattView,
    serviceattAdd,
    serviceattRemove,
    isCheckedContAtt,
    isCheckedSaleAtt,
    isCheckedServiceAtt,
    contactReAssign,
    saleReAssign,
    followUpReAssign,
    servicesView,
    servicesEdit,
    servicesCreate,
    servicesDelete,
    serviceReAssign,
    taskReAssign,
    isCheckedService,
    isCheckedTask,
    servicesDownload,
    contactDataAccessRule,
    saleDataAccessRule,
    serviceDataAccessRule,
    taskDataAccessRule,
    followUpDataAccessRule,
    orgDataAccessRule,
    isCheckedOrg,
    orgsView,
    orgsCreate,
    orgsEdit,
    orgsDelete,
    orgsDownload,
    orgReAssign
  ) {
    this.db.doc('users/' + id + '/profilesDefault/' + profileId).set(
      {
        profileName: profileName,
        profileDescription: profileDescription,
        dialogdataAccessRule: dialogdataAccessRule,
        isCheckedCont: isCheckedCont,
        isCheckedSale: isCheckedSale,
        isCheckedSalesEst: isCheckedSalesEst,
        isCheckedSalesQuot: isCheckedSalesQuot,
        isCheckedSalesInv: isCheckedSalesInv,
        isCheckedDashB: isCheckedDashB,
        isCheckedNotes: isCheckedNotes,
        isCheckedFoll: isCheckedFoll,
        isCheckedAtt: isCheckedAtt,
        isCheckedSett: isCheckedSett,
        contactsView: contactsView,
        contactsCreate: contactsCreate,
        contactsEdit: contactsEdit,
        contactsDelete: contactsDelete,
        salesView: salesView,
        salesCreate: salesCreate,
        salesEdit: salesEdit,
        salesDelete: salesDelete,
        salesDViewEst: salesDViewEst,
        salesDCreateEst: salesDCreateEst,
        salesDEditEst: salesDEditEst,
        salesDViewQuot: salesDViewQuot,
        salesDCreateQuot: salesDCreateQuot,
        salesDEditQuot: salesDEditQuot,
        salesDViewInv: salesDViewInv,
        salesDCreateInv: salesDCreateInv,
        salesDEditInv: salesDEditInv,
        DBView: DBView,
        DBDownloadReports: DBDownloadReports,
        notesView: notesView,
        notesCreate: notesCreate,
        notesEdit: notesEdit,
        notesDelete: notesDelete,
        follView: follView,
        follCreate: follCreate,
        follEdit: follEdit,
        follDelete: follDelete,
        attView: attView,
        attAdd: attAdd,
        attRemove: attRemove,
        settView: settView,
        settEdit: settEdit,
        isCheckedColl: isCheckedColl,
        isCheckedExp: isCheckedExp,
        DBReportsView: DBReportsView,
        collectionsView: collectionsView,
        collectionCreate: collectionCreate,
        collectionEdit: collectionEdit,
        collectionDelete: collectionDelete,
        expView: expView,
        expCreate: expCreate,
        expEdit: expEdit,
        expDelete: expDelete,
        isCheckedItems: isCheckedItems,
        itemsView: itemsView,
        itemsCreate: itemsCreate,
        itemsEdit: itemsEdit,
        itemsDelete: itemsDelete,
        contactsDownload: contactsDownload,
        salesDownload: salesDownload,
        estDownload: estDownload,
        quotDownload: quotDownload,
        invDownload: invDownload,
        expDownload: expDownload,
        collDownload: collDownload,
        contattView,
        contattAdd,
        contattRemove,
        saleattView,
        saleattAdd,
        saleattRemove,
        serviceattView,
        serviceattAdd,
        serviceattRemove,
        isCheckedContAtt,
        isCheckedSaleAtt,
        isCheckedServiceAtt,
        contactReAssign,
        saleReAssign,
        followUpReAssign,
        servicesView,
        servicesEdit,
        servicesCreate,
        servicesDelete,
        serviceReAssign,
        taskReAssign,
        isCheckedService,
        isCheckedTask,
        servicesDownload,
        contactDataAccessRule,
        saleDataAccessRule,
        serviceDataAccessRule,
        taskDataAccessRule,
        followUpDataAccessRule,
        orgDataAccessRule,
        isCheckedOrg,
        orgsView,
        orgsCreate,
        orgsEdit,
        orgsDelete,
        orgsDownload,
        orgReAssign,
      },
      { merge: true }
    );
  }

  // send email inviting subuser
  sendEmail(data) {
    return this.db.collection('email/').add(data);
  }
  // invitation records
  invitation(invitation) {
    this.db.collection('invitations/').add({ ...invitation });
  }
  // read data from invitation collection
  getInvitation(superUserId) {
    return this.db
      .collection('invitations/', (ref) =>
        ref.where('superUserId', '==', superUserId)
      )
      .snapshotChanges();
  }
  // updating subuser in users subuser collection if removed from subuser list
  removeSubUser(userId, id) {
    return this.db.doc('users/' + userId + '/subUsers/' + id).delete();
  }
  suspendSubUser(sId, id) {
    return this.db
      .doc('users/' + sId + '/subUsers/' + id)
      .update({ status: 'suspended' });
  }
  activateSubUser(sId, id) {
    return this.db
      .doc('users/' + sId + '/subUsers/' + id)
      .update({ status: 'active' });
  }
  // updating subuser details in main users collection if removed from subuser list
  upsateSubUserDetails(id) {
    return this.db.doc('users/' + id).update({
      accountType: 'SuperUser',
      superUserId: id,
      dataAccessRule: 'All',
      category: 'General Sales'
    });
  }
  // updating subuser details in main users collection if removed from subuser list
  reActivateSubUserDetails(id, accountType, superUserId) {
    return this.db.doc('users/' + id).update({
      accountType,
      superUserId,
    });
  }
  // updating subuser details in main users collection if removed from subuser list-employeee case
  upsateSubUserDetailsEmployee(id, sId) {
    // console.log('called');
    this.db.doc('users/' + id).update({
      CRMAccess: false,
      superUserId: sId,
    });
  }
  activateSubUserDetailsEmployee(id, sId) {
    this.db.doc('users/' + id).update({
      CRMAccess: true,
      superUserId: sId,
    });
  }
  // removing from invitation
  removeInv(id) {
    return this.db.doc('invitations/' + id).delete();
  }
  updateInvitationEmp(invId, email) {
    this.db.doc('invitations/' + invId).update({
      crmAccess: false,
      accountType: null,
      status: null,
      email: email,
      reportsToId: null,
      reportsToName: null,
    });
  }
  // update suspend scenario
  updateInvitationEmpActivate(invId, email, accountType, rId, rName) {
    this.db.doc('invitations/' + invId).update({
      crmAccess: true,
      accountType,
      status: 'active',
      email: email,
      reportsToId: rId,
      reportsToName: rName,
    });
  }
  updateInvitationEmpSuspend(invId, email) {
    this.db.doc('invitations/' + invId).update({
      crmAccess: false,
      accountType: null,
      status: '',
      email: email,
      reportsToId: null,
      reportsToName: null,
    });
  }
  updateInvReportsTo(
    invId,
    aType,
    rId,
    rName,
    firstname,
    lastname,
    email,
    contactNo,
    code,
    branchId,
    branchName
  ) {
    this.db.doc('invitations/' + invId).update({
      accountType: aType,
      reportsToId: rId,
      reportsToName: rName,
      employeeFName: firstname,
      employeeLName: lastname,
      email,
      contactNo: contactNo,
      code,
      branchId,
      branchName,
    });
  }
  getUser(sId) {
    return this.db.doc<Profile>('users/' + sId).valueChanges();
  }
  updateInEmpColl(sId, docId) {
    this.db.doc('users/' + sId + '/employees/' + docId).update({
      CRMAccess: false,
      accType: null,
      reportsToId: null,
      reportsToName: null,
    });
  }
  updateATypeInEmpColl(
    sId,
    docId,
    aType,
    rId,
    rName,
    firstname,
    lastname,
    contactNo,
    email,
    code
  ) {
    this.db.doc('users/' + sId + '/employees/' + docId).update({
      accType: aType,
      reportsToId: rId,
      reportsToName: rName,
      employeeFirstName: firstname,
      employeeSecondName: lastname,
      contactNo: contactNo,
      officialEmail: email,
      code,
    });
  }
  updateEmloyeeAcc(sId, docId, aType) {
    this.db.doc('users/' + sId + '/employees/' + docId).update({
      accType: aType,
    });
  }
  updateATypeInv(invId, aType) {
    this.db.doc('invitations/' + invId).update({
      accountType: aType,
    });
  }
  // check invitations with this email
  getInvitations(mail) {
    return this.db
      .collection('invitations', (ref) => ref.where('email', '==', mail))
      .snapshotChanges();
  }
  getSubUserEmail(email) {
    return this.db
      .collectionGroup('subUsers', (ref) => ref.where('email', '==', email))
      .get();
  }
  enableUser(invId) {
    this.db.doc('invitations/' + invId).update({
      accessLockAutologout: false,
    });
  }
  enableatUser(userId) {
    return this.db.doc('users/' + userId).update({
      accessLockAutologout: false,
    });
  }
  enablesubUser(superId, subId) {
    this.db.doc('users/' + superId + '/subUsers/' + subId).update({
      accessLockAutologout: false,
    });
  }
  // add new branch to collection
  addNewBranch(sid, branch) {
    this.db.collection('users/' + sid + '/branches/').add({ ...branch });
  }
  // update new branch to collection
  updateBranch(sid, branchId, name) {
    this.db.doc('users/' + sid + '/branches/' + branchId).update({
      name,
    });
  }
  // read already existing branches under this superuser
  getBranches(id: string) {
    return this.db
      .collection('users/' + id + '/branches', (ref) => ref)
      .snapshotChanges();
  }
  removeBranch(sId, bId) {
    return this.db.doc('users/' + sId + '/branches/' + bId).delete();
  }
  // updating subuser in users subuser collection
  onUpdateBranchName(userId, id, branchName) {
    this.db.doc('users/' + userId + '/subUsers/' + id).update({
      branchName,
    });
  }
  updateInvitationBranch(invId, branchName) {
    this.db.doc('invitations/' + invId).update({
      branchName,
    });
  }

  createDefaultProfileSub(
    timeZone,
    tzOffset,
    plan,
    userId,
    userEmail,
    firstName,
    accType,
    lname,
    superUserId,
    phone,
    code,
    company,
    category,
    categoryOthers
  ) {
    return this.db
      .collection('users')
      .doc(userId)
      .set({
        timeZone,
        tzOffset,
        email: userEmail,
        firstname: firstName,
        superUserId: superUserId,
        accountType: accType,
        plan: plan,
        zenysCustId: userId, //added for customer creation in Zenys Main Account
        lastname: lname,
        phone: phone,
        countryCode: code,
        company: company,
        category: category,
        categoryOthers: categoryOthers,
        expenseCategory: this.expenseCategory,
        ...defaultProfileFields.CONTENT,
      });
  }
  createCustomFieldNames(fieldNames, userId) {
    return this.db
      .collection('users/')
      .doc(userId)
      .set({ fieldNames: fieldNames }, { merge: true });
  }
  createProfiles(newtemplate, userId) {
    return this.db
      .collection('users')
      .doc(userId)
      .collection('profilesDefault')
      .add({ ...newtemplate });
  }
  addSubUser(superUserId, newUser) {
    return this.db
      .collection('users/' + superUserId + '/subUsers')
      .add({ ...newUser });
  }
  // contacts assigned to this user
  async getContactWithSubsuer(superUserId, subUserId): Promise<any> {
    return await this.db
      .collection('users/' + superUserId + '/customers', (ref) =>
        ref.where('assignedTo', '==', subUserId)
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
  // sale assigned to this user
  async getSaleWithSubsuer(superUserId, subUserId): Promise<any> {
    return await this.db
      .collection('users/' + superUserId + '/sales', (ref) =>
        ref.where('assignedTo', '==', subUserId)
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
              } as Sales)
          )
        )
      )
      .toPromise();
  }
  // service assigned to this user
  async getSupportWithSubsuer(superUserId, subUserId): Promise<any> {
    return await this.db
      .collection('users/' + superUserId + '/services', (ref) =>
        ref.where('assignedTo', '==', subUserId)
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
              } as Service)
          )
        )
      )
      .toPromise();
  }
}
