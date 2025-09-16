import { Profile ,hsnCodeDisplay} from './../../data-models';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DocumentsetttingsService {
  constructor(private db: AngularFirestore, private db1: AngularFireDatabase) { }

  // for subusers superuserdata is fetched from Db
  getNew(path1, itemId: string) {
    return this.db.collection(path1).doc<any>(itemId).valueChanges();
  }

  // updating default content fn
  update(path1, itemId: string, item: Profile) {
    return this.db.collection(path1).doc(itemId).update(item);
  }

  // update logo
  updateImg1(col: string, doc: string, logo: string) {
    return this.db.collection(col).doc(doc).update({ logo });
  }

  // update signature
  updateImg2(col: string, doc: string, sign: string) {
    this.db.collection(col).doc(doc).update({ sign });
  }

  // update template fn
  updatePreview(id, name: string) {
    this.db.doc('users/' + id).update({ printTemplate: name });
  }

  // updating logo stAtus fn
  logoStatus(id, status) {
    this.db.collection('users').doc(id).update({ logoStatus: status });
  }
  updateLeadCaptureLogo(leadCaptureId, logoPath){
    return this.db.doc('sharedLeadCaptureForms/' + leadCaptureId).update({ logoUrl: logoPath });
  }
  

  autoPayLinkEnable(id, type, status) {
    var data: any = {}
    data[type + "AutoPayLinkEnable"] = status
    // console.log(data)
    return this.db.doc('users/' + id).update(data)
  }

  // updating sign status
  signStatus(id, status) {
    this.db.collection('users').doc(id).update({ signStatus: status });
  }

  // color updating fn
  updateDocumentColor(superUserId: string, color) {
    this.db.doc('users/' + superUserId).update({ documentColor: color });
  }

  updateEstimateNumber(superUserId: string, prefix, number) {
    return this.db
      .doc('users/' + superUserId)
      .update({ estimateNumberPrefix: prefix, estimateNoLast: number });
  }
  updateQuotationNumber(superUserId: string, prefix, number) {
    return this.db
      .doc('users/' + superUserId)
      .update({ quotationNumberPrefix: prefix, quoteNoLast: number });
  }
  updateInvoiceNumber(superUserId: string, prefix, number) {
    return this.db
      .doc('users/' + superUserId)
      .update({ invoiceNumberPrefix: prefix, invoiceNoLast: number });
  }
  smsTemplateUpdate(superUserId: string, smsActivated, selectedSmsTemplate) {
    return this.db
      .doc('users/' + superUserId)
      .update({
        smsActivated: smsActivated,
        selectedSmsTemplate: selectedSmsTemplate,
      });
  }
  emailTemplateUpdate(
    superUserId: string,
    emailActivated,
    selectedEmailTemplate
  ) {
    return this.db
      .doc('users/' + superUserId)
      .update({
        emailActivated: emailActivated,
        selectedEmailTemplate: selectedEmailTemplate,
      });
  }
  // get Email Templates
  getEmailTemplates(superuserId, type) {
    return this.db
      .collection<any>('users/' + superuserId + '/emailTemplates/', (ref) =>
        ref.where('templateType', '==', type)
      )
      .snapshotChanges();
  }
  getSMSTemplates(superuserId, type, recType) {
    return this.db
      .collection<any>('users/' + superuserId + '/messageTemplates/', (ref) =>
        ref
          .where('templateType', '==', type)
          .where('tempRecType', '==', recType)
      )
      .snapshotChanges();
  }
  docApproval(
    superUserId: string,
    estimateApproval,
    quotationApproval,
    invoiceApproval
  ) {
    return this.db
      .doc('users/' + superUserId)
      .update({
        estimateApproval: estimateApproval,
        quotationApproval: quotationApproval,
        invoiceApproval: invoiceApproval,
      });
  }
  logOutTimeUpdate(
    superUserId: string,
    selectedtime
  ) {
    return this.db
      .doc('users/' + superUserId)
      .update({
        logOutTime: selectedtime,
      });
  }

  followUpOutComesUpdate(superUserId: string, ivrIntegrationEnable, ivrServiceProvider, ivrToken, callerList, enableOutboundCallsViaCallBridging, callBridgingServiceProvider, autoCallToken,DIDNumber,autoCallURL,channelID) {
    return this.db
      .doc('users/' + superUserId)
      .update({
        ivrIntegrationEnable: ivrIntegrationEnable,
        ivrServiceProvider: ivrServiceProvider,
        ivrToken: ivrToken,
        callerList: callerList,
        enableOutboundCallsViaCallBridging: enableOutboundCallsViaCallBridging,
        callBridgingServiceProvider: callBridgingServiceProvider,
        autoCallToken: autoCallToken,
        DIDNumber:DIDNumber,
        autoCallURL:autoCallURL,
        channelID:channelID,
      });
  }
  followUpOutComesUpdateVoxbay(superUserId: string, ivrIntegrationEnable, ivrServiceProvider,  callerList, enableOutboundCallsViaCallBridging, callBridgingServiceProvider, uid,callerid,pin,extension,callType) {
    // console.log("IVR PROV",callBridgingServiceProvider)
    return this.db
      .doc('users/' + superUserId)
      .update({
        ivrIntegrationEnable: ivrIntegrationEnable,
        ivrServiceProvider: ivrServiceProvider,
        callerList: callerList,
        enableOutboundCallsViaCallBridging: enableOutboundCallsViaCallBridging,
        callBridgingServiceProvider: callBridgingServiceProvider,
        voxbayUid: uid,
        voxbayPin:pin,
        extensionNumber:extension,
        voxbayCallerid:callerid,
        outboundCallType:callType
      });
  }
  //outcome update in customisable fields

  customUpOutcomeUpdate(superUserId: string, followUpOutcome) {
    return this.db
      .doc('users/' + superUserId)
      .update({ followUpOutcome: followUpOutcome })
  }
  customStatusUpdate(superUserId: string, followUpStatus,) {
    return this.db
      .doc('users/' + superUserId)
      .update({ followUpStatus: followUpStatus })
  }//customisable fie;ds in followup
  updateFieldCustomization(superUserId, followUpSettings) {
    return this.db.doc('users/' + superUserId).update({
      followUpSettings,
    });
  }
  //for updating latest additional field update to db in user level
  updateCustomFields(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsEstimate: fields });
  }
  updateCustomFieldsInvoice(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsInvoices: fields });
  }
  updateCustomFieldsQuotation(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsQuotation: fields });
  }
  //Followup
  updateFollowupfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameFollowup';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  saveRequiredFields(superUserId: string, estimateOrgTag: boolean, estimateContactTag: boolean,
    estimateSaleTag: boolean, quotationOrgTag: boolean,
    quotationContactTag: boolean, quotationSaleTag: boolean,
    invoiceOrgTag: boolean, invoiceContactTag: boolean, invoiceSaleTag: boolean) {
    return this.db.doc('users/' + superUserId).update({
      estimateOrgTag: estimateOrgTag,
      estimateContactTag: estimateContactTag,
      estimateSaleTag: estimateSaleTag,
      quotationOrgTag: quotationOrgTag,
      quotationContactTag: quotationContactTag,
      quotationSaleTag: quotationSaleTag,
      invoiceOrgTag: invoiceOrgTag,
      invoiceContactTag: invoiceContactTag,
      invoiceSaleTag: invoiceSaleTag
    });
  }
  hsnCodeDisplay(superUserId: string, hsnCodeDisplay: hsnCodeDisplay){
    return this.db.doc('users/' + superUserId).update({
      hsnCodeDisplay: hsnCodeDisplay,
    });
  }
}
