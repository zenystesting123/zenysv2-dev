import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  changeLogModel,
  CustomerDetails,
  ExpenseCategories,
  FollowupDirection,
  FollowupOutcome,
  FollowupStatus,
  Profile,
  SalesDetails,
} from 'src/app/data-models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentFormService {
  category: ExpenseCategories = null;
  constructor(private db: AngularFirestore) {}
  // create profile
  createDefaultProfile(
    userId,
    email,
    expenseCategory,
    logoStatus,
    signStatus,
    firstname,
    category,
    company,
    countryCode,
    estimateNoLast,
    quoteNoLast,
    invoiceNoLast,
    phone,
    country,
    pincode,
    state,
    street1,
    street2,
    logo,
    sign,
    city,
    fieldNames,
    invoiceNumberPrefix,
    estimateNumberPrefix,
    quotationNumberPrefix,
    publicProfileID,
    timeZone,
    tzOffset,
    userData
  ) {
    return this.db.collection('users').doc(userId).set({
      superUserId: userId,
      accountType: 'SuperUser',
      plan: 'free',
      expenseCategory: expenseCategory,
      email: email,
      zenysCustId: userId, //added for customer creation in Zenys Main Account
      logoStatus: logoStatus,
      signStatus: signStatus,
      firstname: firstname,
      category: category,
      company: company,
      countryCode: countryCode,
      estimateNoLast: estimateNoLast,
      quoteNoLast: quoteNoLast,
      invoiceNoLast: invoiceNoLast,
      lastname:'',
      phone: phone,
      country: country,
      pincode: pincode,
      state: state,
      street1: street1,
      street2: street2,
      logo: logo,
      sign: sign,
      city: city,
      fieldNames: fieldNames,
      estimateNumberPrefix: estimateNumberPrefix,
      invoiceNumberPrefix: invoiceNumberPrefix,
      quotationNumberPrefix: quotationNumberPrefix,
      publicProfileID:publicProfileID,
      timeZone:timeZone,
      tzOffset:tzOffset,
      followUpStatus: FollowupStatus.DATA,
      followUpOutcome:FollowupOutcome.DATA,
      followUpDirection:FollowupDirection.DATA,
      ...userData
    });
  }
  // craete profile data
  createProfileData(newtemplate, userId) {
    this.db
      .collection('users')
      .doc(userId)
      .collection('profilesDefault')
      .add({ ...newtemplate });
  }
  // create contactfor the document
  createContact(customerDetail: CustomerDetails, superUserId) {
    
    customerDetail.stageHistory = customerDetail.stageHistory.map((obj) => {
      return Object.assign({}, obj);
    });
    return this.db
      .collection('users/' + superUserId + '/customers')
      .add(Object.assign({}, customerDetail));
  }
  // create sale for the document
  createSale(saleDetail, superUserId:string) {
    let changeLog = <changeLogModel>{};
    changeLog[0] = {
      changedBy: superUserId,
      changedByName: saleDetail.firstName,
      changesFrom: 'sampleData',
      dateModified: new Date().getTime(),
      currentValues: '',
      previousValues: '',
    };
    return this.db
      .collection('users/' + superUserId + '/sales')
      .add({saleDetail,
        assignedTo: superUserId,
        assignedToName:  saleDetail.firstName,
        createdBy: superUserId,
        changeLog,
        associatedBranch: 'NA',});
  }

  // // set nvoiced value for sale
  // setSaleDocInvValue(userId: string, saleId: string, keyValuePair: {}) {
  //   return this.db
  //     .collection('users/' + userId + '/sales/')
  //     .doc(saleId)
  //     .update(keyValuePair);
  // }
  // // set nvoiced value for customer
  // setCustInvValue(userId: string, custId: string, keyValuePair: {}) {
  //   return this.db
  //     .collection('users/' + userId + '/customers/')
  //     .doc(custId)
  //     .update(keyValuePair);
  // }
  // crate document
  createDocument(
    userData,
    customerData,
    docData,
    itemList,
    docType,
    superuserId,
    userId,
    searchTerm
  ) {
    if (docType == 'Invoice') {
      return this.db.collection('users/' + superuserId + '/Invoices/').add({
        userData,
        customerData,
        docData,
        itemList,
        collectedAmount: 0,
        createdBy: userId,
        searchTerm: searchTerm,
        additionalFieldsArr:[]
      });
    } else if (docType == 'Quotation') {
      return this.db.collection('users/' + superuserId + '/Quotations/').add({
        userData,
        customerData,
        docData,
        itemList,
        createdBy: userId,
        searchTerm: searchTerm,
        additionalFieldsArr:[]
      });
    } else if (docType == 'Estimate') {
      return this.db.collection('users/' + superuserId + '/Estimates/').add({
        userData,
        customerData,
        docData,
        itemList,
        createdBy: userId,
        searchTerm: searchTerm,
        additionalFieldsArr:[]
      });
    } else {
      return null;
    }
  }
  // get expense category list
  getCategory(): string[] {
    this.category = new ExpenseCategories();
    return this.category.categories;
  }
  UpdateshareDocumentId(superUserId,docID,docType,sharedId) {
    if(docType=="Estimate"){
     return this.db
     .doc('users/' + superUserId + '/Estimates/' + docID)
     .update({ sharedDocId:'https://'+environment.docViewerDomain+'/docview/'+sharedId });
    }
    else if(docType=="Quotation"){
     return this.db
     .doc('users/' + superUserId + '/Quotations/' + docID)
     .update({ sharedDocId:'https://'+environment.docViewerDomain+'/docview/'+sharedId });
    }
   else  if(docType=="Invoice"){
     return this.db
     .doc('users/' + superUserId + '/Invoices/' + docID)
     .update({ sharedDocId:'https://'+environment.docViewerDomain+'/docview/'+sharedId });
    }
    else{
 
    }
     
   }
   createSharedDoc(userID,documentId,docType){
    return  this.db.collection('sharedDocument').add({
        docId:documentId,
        userId:userID,
        docType:docType
      })
    }
}
