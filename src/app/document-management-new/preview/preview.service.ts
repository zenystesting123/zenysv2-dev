import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { CommonService } from 'src/app/common.service';
import { Profile, SubUsers } from 'src/app/data-models';
import { UserDatas } from 'src/app/model/productfeatures.model';
import { CustomerData, ItemsList, userData } from '../estimate-management/estimate.model';
import { DocumentData } from '../invoice-management/invoice.model';
import { Toolbar } from './preview.model';
@Injectable({
  providedIn: 'root'
})
export class PreviewService {
  fieldNameEstimate: string;
  fieldNameQuotation: string;
  docID: string;
  docType: string;
  previewLoaded: boolean = false;
  userData: userData;
  docData: DocumentData = {
    bankDetails: '',
    cancel: false,
    cessValue: 0,
    cgstValue: 0,
    createdDate: 0,
    currency: '',
    discountValue: 0,
    discountedAmount: 0,
    docDate: null,
    docNumber: '',
    docPrefix: '',
    docTitle: '',
    docType: '',
    docValidity: null,
    dueDate: null,
    igstValue: 0,
    includeCess: false,
    includeDiscount: false,
    includeTax: false,
    includeUnit: false,
    interState: false,
    notes: '',
    prefixAndDocNumber: '',
    saleAssignedToOwner: '',
    saleID: '',
    saleTitle: '',
    sgstValue: 0,
    statusApproved: false,
    taxType: '',
    total: 0,
    totalInclTax: 0,
    vatValue: 0,
    estRef: null,
    quoteRef: null,
    gstPlaceOfSupplyCode: null,
    gstStateCode: null,
    poRef: null,
    paymentTerm: null
  };
  itemList: ItemsList[];
  customerData: CustomerData = {
    addressline1: '',
    addressline2: '',
    companyName: '',
    contactNumber: '',
    country: '',
    countryCode: '',
    custID: '',
    contactAssignedToOwner: '',
    orgID: '',
    district: '',
    email: '',
    fname1: '',
    gst: '',
    isDeliveryAddressPresent: false,
    pinCode: '',
    sname: '',
    state: '',
    surname: '',
    deliveryAddressline1: '',
    deliveryAddressline2: '',
    deliveryContactName: '',
    deliveryContactNumber: '',
    deliverycountryCode: '',
    deliveryCountry: '',
    deliveryDistrict: '',
    deliveryPinCode: '',
    deliveryState: '',
    deliveryCompanyName: '',
    deliveryEmail: ''
  };
  superUserId: string;
  userId: string
  toolbar: Toolbar;
  disableDocView: boolean = false;
  disableDocDownload: boolean = false;// document download disable
  disableDocEdit: boolean = false;
  disableViewContact: boolean = false;
  disableViewOrg: boolean = false;
  fieldNameSale: string = 'Sale'; // fieldname for sale
  paymentLink: any;
  signature: string;
  logo: string;
  docColor: string = '#3a9efd';
  filteredAdditionalField: any = [];
  additionalFields: any[];
  rzrAccountId: string; // account id of razopay
  stripeAccountId: any;
  payLinkMode: string;
  fieldNameContact: string = 'Contact'; //customisable field name
  fieldNameOrganization = 'Organization';
  collectedAmount: number;
  documentTypeFeildName: string
  superUserData: Profile = null; //logged in users superuser data from common servcie
  subUsers: SubUsers[] = []; //subusers under super user
  invoice: any;
  invoiceWaTemp: any;
  hsnCodeDisplay: boolean=true;// for HSN Code Display
  changeLog: any; //changeLog for the doc
  userName: string; //current user's name to stor in changeLog
  constructor(private firestore: AngularFirestore, private commonService: CommonService) {
    this.toolbar = {
      documentTypeFeildName: null,
      prefixAndDocNumber: null,
      fieldNameQuotation: null,
      fieldNameInvoice: null,
      statusApproved: false,
      createQuotation: false,
      createInvoice: false,
      sendPaymentLink: false,
      shareDocument: false,
      shared: false,
      cancelStatus: false,
      disableDownload: false,
      disablCreateQuo: false,
      disableCreateInvoice: false,
      disableEdit: false,
      disableSendPaymentLink: false,
      disableShareDocument: false,
      disableShared: false,
      disableCancelStatus: false,
    }
  }
  getSuperUserData(){
    //get superuserdata
    this.commonService.userDatas.subscribe((allData) => {
      this.superUserData = allData.superUserDetails;
      this.subUsers = allData.subUsers;
      this.userName = allData.userDetails.lastname ?  
        allData.userDetails.firstname + ' ' + allData.userDetails.lastname : 
        allData.userDetails.firstname;
    })
  }
  // get id from route
  getUrlInfo(val) {
    //Section 1: Get the information passed on to the module using router link
    this.docID = val.docID // document id
    this.docType = val.docType // document type
  }
  // get est data
  getDocumentEstimateDetails(userId, docId) {
    return this.firestore
      .doc<any>('users/' + userId + '/Estimates/' + docId)
      .valueChanges();
  }
  // get quo data
  getDocumentQuotationDetails(userId, docId) {
    return this.firestore
      .doc<any>('users/' + userId + '/Quotations/' + docId)
      .valueChanges();
  }
  // gets inv data
  getDocumentInvoiceDetails(userId, docId) {
    return this.firestore
      .doc<any>('users/' + userId + '/Invoices/' + docId)
      .valueChanges();
  }

   // gets contact details
   getContactDetails(userId, custId) {
    return this.firestore
      .doc<any>('users/' + userId + '/customers/' + custId)
      .valueChanges();
  }

  // gets sale data
  getSaleDetails(userId, saleId) {
    return this.firestore
      .doc<any>('users/' + userId + '/sales/' + saleId)
      .valueChanges();
  }
  // update data after reading doc
  updateData(allData: UserDatas, data) {
    this.invoice = data;
    // assign whatsapp templates from common service
    this.invoiceWaTemp = allData.whatsAppTemplates.filter(templates => templates.tempRecType === 'Invoice');
    this.itemList = data.itemList
    if (allData.superUserDetails.fieldNames) {
      this.fieldNameSale = allData.superUserDetails.fieldNames.fieldNameSale;
      this.fieldNameContact = allData.superUserDetails.fieldNames.fieldNameContact;
      this.fieldNameOrganization = allData.superUserDetails.fieldNames.fieldNameOrganization;
    }
    if (allData.superUserDetails.documentColor) {
      this.docColor = allData.superUserDetails.documentColor; // get color of document
    }
    this.collectedAmount = data.collectedAmount
    this.customerData = data.customerData
    this.userData = data.userData
    this.docData = data.docData
    if (this.docData.docDate) {
      this.docData.docDate = this.docData.docDate.toDate()
    }
    if (this.docData.docValidity) {
      this.docData.docValidity = this.docData.docValidity.toDate()
    }
    if (this.docData.dueDate) {
      this.docData.dueDate = this.docData.dueDate.toDate()
    }
    this.itemList = data.itemList
    this.paymentLink = data.paymentLink;

    this.updateLogo(allData.superUserDetails)
    this.updateSignature(allData.superUserDetails)
    if (allData.usrProfileData) {
      // check contact view access
      if (allData.usrProfileData.isCheckedCont == false) {
        // check contact check box is checked if not disable contact view
        this.disableViewContact = true;
      } else if (allData.usrProfileData.contactsView == false) {
        // check contact view access
        this.disableViewContact = true;
      }
      // check orgsView  access
      if (allData.usrProfileData.isCheckedOrg == false) {
        // check orgsView check box is checked if not disable contact view
        this.disableViewOrg = true;
      } else if (allData.usrProfileData.orgsView == false) {
        // check contact view access
        this.disableViewOrg = true;
      }
    }

    this.toolBarDataUpdate(allData, data)
    if (this.docType == "Estimate") {
      this.additionalFields = allData.superUserDetails.customFieldsEstimate;
      if(allData.superUserDetails.hsnCodeDisplay){
        this.hsnCodeDisplay = allData.superUserDetails.hsnCodeDisplay.estimate
      }
    }
    else if (this.docType == "Quotation") {
      this.additionalFields = allData.superUserDetails.customFieldsQuotation;
      if(allData.superUserDetails.hsnCodeDisplay){
        this.hsnCodeDisplay = allData.superUserDetails.hsnCodeDisplay.quotation
      }
    }
    else {
      this.additionalFields = allData.superUserDetails.customFieldsInvoices;
      if(allData.superUserDetails.hsnCodeDisplay){
        this.hsnCodeDisplay = allData.superUserDetails.hsnCodeDisplay.invoice
      }
    }

    if (data.additionalFieldsArr) {
      let fieldListArray = data.additionalFieldsArr;
      const fieldListLen = Object.keys(fieldListArray).length;
      for (let i = 0; i < this.additionalFields?.length; i++) {
        this.additionalFields[i].datavalue = '';
      }
      if (fieldListLen != 0) {
        for (let i = 0; i < fieldListLen; i++) {
          if (this.additionalFields[i]) {
            this.additionalFields[i].datavalue =
              fieldListArray[i].fieldValue;
          }
        }
      }
    } else {
      for (let i = 0; i < this.additionalFields?.length; i++) {
        this.additionalFields[i].datavalue = '';
      }
    }
    this.filteredAdditionalField = [];
    for (let i = 0; i < this.additionalFields?.length; i++) {
      if (this.additionalFields[i].isActive) {
        this.filteredAdditionalField.push(this.additionalFields[i]);
      }
    }
    this.changeLog = data.changeLog ? data.changeLog : {}
    this.previewLoaded = true
  }
  // get logo
  updateLogo(superuserData: Profile) {
    let logo = null
    if (superuserData.logoStatus) {
      // if logo status is true get logo from storage
      const userStorageRef1 = firebase.default
        .storage()
        .ref()
        .child('logo/' + superuserData.superUserId);
      userStorageRef1.getDownloadURL().then((url1) => {
        logo = url1;
        this.logo = logo
      });
    }
  }
  // get signature
  updateSignature(superuserData: Profile) {
    let signature = null
    if (superuserData.signStatus) {
      // if logo status is true get logo from storage
      const userStorageRef1 = firebase.default
        .storage()
        .ref()
        .child('sign/' + superuserData.superUserId);
      userStorageRef1.getDownloadURL().then((url1) => {
        signature = url1;
        this.signature = signature
      });
    }
  }
  // update data in toolbar
  toolBarDataUpdate(allData: UserDatas, data) {
    let documentTypeFeildName
    if (this.docData.docType == 'Estimate') {
      documentTypeFeildName = allData.superUserDetails.fieldNames?.fieldNameEstimate ? allData.superUserDetails.fieldNames?.fieldNameEstimate : 'Estimate';
    } else if (this.docData.docType == 'Quotation') {
      documentTypeFeildName = allData.superUserDetails.fieldNames?.fieldNameQuotation ? allData.superUserDetails.fieldNames?.fieldNameQuotation : 'Quotation';
    } else if (this.docData.docType == 'Invoice') {
      documentTypeFeildName = allData.superUserDetails.fieldNames?.fieldNameInvoice ? allData.superUserDetails.fieldNames?.fieldNameInvoice : "Invoice";
    } else {
    }
    let approveAccess = false
    if (allData.userId == this.superUserId) {
      approveAccess = true;
    } else {
      allData.subUsers.forEach(element => {
        if (this.docData.saleAssignedToOwner == element.userId) {
          if (allData.userId == element.reportsToId) {
            approveAccess = true;
          }
        }
      });
    }
    let disableDocQuot = false;
    let disableDocInv = false;
    if (allData.usrProfileData.isCheckedSalesQuot == false) {
      disableDocQuot = true;
    } else {

      if (allData.usrProfileData.salesDCreateQuot == false) {
        disableDocQuot = true;
      }
    }
    if (allData.usrProfileData.isCheckedSalesInv == false) {
      disableDocInv = true;
    } else {
      if (allData.usrProfileData.salesDCreateInv == false) {
        disableDocInv = true;
      }
    }

    this.toolbar = {
      documentTypeFeildName: documentTypeFeildName,
      prefixAndDocNumber: this.docData.prefixAndDocNumber,
      fieldNameQuotation: allData.superUserDetails.fieldNames?.fieldNameQuotation ? allData.superUserDetails.fieldNames?.fieldNameQuotation : 'Quotation',
      fieldNameInvoice: allData.superUserDetails.fieldNames?.fieldNameInvoice ? allData.superUserDetails.fieldNames?.fieldNameInvoice : "Invoice",
      statusApproved: !this.docData.statusApproved && approveAccess,
      createQuotation: this.docData.docType == 'Estimate',
      createInvoice: this.docData.docType == 'Estimate' || this.docData.docType == 'Quotation',
      sendPaymentLink: this.docData.docType == 'Invoice',
      shareDocument: !data?.shareStatus,
      shared: data?.shareStatus,
      cancelStatus: !this.docData.cancel,
      disableDownload: !this.docData.statusApproved ||this.disableDocDownload,
      disablCreateQuo: this.commonService.addDocLimitaion.addQuotationDisable || this.docData.cancel || disableDocQuot,
      disableCreateInvoice: this.commonService.addDocLimitaion.addInvoiceDisable || this.docData.cancel || disableDocInv,
      disableEdit: this.docData.cancel || this.disableDocEdit,
      disableSendPaymentLink: !this.commonService.userPlan.collectOnlinePaymentsFromCustomers || this.docData.cancel || !this.docData.statusApproved,
      disableShareDocument: !this.commonService.userPlan.shareInvoices || this.docData.cancel || !this.docData.statusApproved,
      disableShared: this.docData.cancel,
      disableCancelStatus: this.docData.cancel,
    }
  }
  // approve doc
  approveDocument() {
    if (this.docType == 'Estimate') {
      this.firestore
        .doc('users/' + this.superUserId + '/Estimates/' + this.docID)
        .update({ 'docData.statusApproved': true });
    } else if (this.docType == 'Invoice') {
      this.firestore
        .doc('users/' + this.superUserId + '/Invoices/' + this.docID)
        .update({ 'docData.statusApproved': true });
    } else {
      this.firestore
        .doc('users/' + this.superUserId + '/Quotations/' + this.docID)
        .update({ 'docData.statusApproved': true });
    }
  }
  // cancel doc
  updateDocumentCancel(superUserId: string, docID, docType, changeLog) {
    if (docType == 'Estimate') {
      this.firestore
        .doc('users/' + superUserId + '/Estimates/' + docID)
        .update({ 'docData.cancel': true, changeLog });
    } else if (docType == 'Invoice') {
      this.firestore
        .doc('users/' + superUserId + '/Invoices/' + docID)
        .update({ 'docData.cancel': true, changeLog });
    } else {
      this.firestore
        .doc('users/' + superUserId + '/Quotations/' + docID)
        .update({ 'docData.cancel': true, changeLog });
    }
  }
  // used to update data from docviewer bez tjhere is only one user profile in docviewer common service all data concept is not there refer updateData() used here
  updateDataFromdocViewer(userdata: Profile, data) {
    this.itemList = data.itemList

    if (userdata.documentColor) {
      this.docColor = userdata.documentColor; // get color of document
    }
    this.customerData = data.customerData
    this.userData = data.userData
    this.docData = data.docData
    if (this.docData.docDate) {
      this.docData.docDate = this.docData.docDate.toDate()
    }
    if (this.docData.docValidity) {
      this.docData.docValidity = this.docData.docValidity.toDate()
    }
    if (this.docData.dueDate) {
      this.docData.dueDate = this.docData.dueDate.toDate()
    }
    this.itemList = data.itemList
    if (this.docData.docType == 'Estimate') {
      this.documentTypeFeildName = userdata.fieldNames?.fieldNameEstimate ? userdata.fieldNames?.fieldNameEstimate : 'Estimate';
    } else if (this.docData.docType == 'Quotation') {
      this.documentTypeFeildName = userdata.fieldNames?.fieldNameQuotation ? userdata.fieldNames?.fieldNameQuotation : 'Quotation';
    } else if (this.docData.docType == 'Invoice') {
      this.documentTypeFeildName = userdata.fieldNames?.fieldNameInvoice ? userdata.fieldNames?.fieldNameInvoice : "Invoice";
    }
    this.updateLogo(userdata)
    this.updateSignature(userdata)
    if (this.docType == "Estimate") {
      this.additionalFields = userdata.customFieldsEstimate;
    }
    else if (this.docType == "Quotation") {
      this.additionalFields = userdata.customFieldsQuotation;
    }
    else {
      this.additionalFields = userdata.customFieldsInvoices;
    }
    if (data.additionalFieldsArr) {
      let fieldListArray = data.additionalFieldsArr;
      const fieldListLen = Object.keys(fieldListArray).length;
      for (let i = 0; i < this.additionalFields?.length; i++) {
        this.additionalFields[i].datavalue = '';
      }
      if (fieldListLen != 0) {
        for (let i = 0; i < fieldListLen; i++) {
          if (this.additionalFields[i]) {
            this.additionalFields[i].datavalue =
              fieldListArray[i].fieldValue;
          }
        }
      }
    } else {
      for (let i = 0; i < this.additionalFields?.length; i++) {
        this.additionalFields[i].datavalue = '';
      }
    }
    this.filteredAdditionalField = [];
    for (let i = 0; i < this.additionalFields?.length; i++) {
      if (this.additionalFields[i].isActive) {
        this.filteredAdditionalField.push(this.additionalFields[i]);
      }
    }
    this.previewLoaded = true
  } 
  //Fetch all whatsapp templates for invoice
  getAllInvoiceWaTemp(superUserId) {
    return this.firestore
      .collection('users/' + superUserId + '/messageTemplates', (ref) =>
        ref
          .where('templateType', '==', 'WhatsApp')
          .where('tempRecType', '==', 'Invoice')
      )
      .snapshotChanges();
  }
}
