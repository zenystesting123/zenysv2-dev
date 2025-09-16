import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class MessgaeTemplateService {
  constructor(private db: AngularFirestore) {}

  // save sms api settings to superUser
  updateSmsApiSettings(
    superUserId: string,
    smsApiUserName,
    smsApiPwd,
    smsApiSenderId,
    smsApiEntityId
  ) {
    return this.db.doc('users/' + superUserId).update({
      smsApiUserName,
      smsApiPwd,
      smsApiSenderId,
      smsApiEntityId,
    });
  }
  // save wa api settings to superUser
  updateWaApiSettings(
    superUserId: string,
    waBusProvider,
    waBusAuthKey,
    waBusURL,
    waBusIntId,
    waBusAppId,
    waBusSourceNo
  ) {
    return this.db.doc('users/' + superUserId).update({
      waBusProvider,
      waBusAuthKey,
      waBusURL,
      waBusIntId,
      waBusAppId,
      waBusSourceNo
    });
  }
  // create new email template
  create(sid, newtemplate) {
    return this.db
      .collection('users/' + sid + '/messageTemplates')
      .add({ ...newtemplate });
  }
  // read email templates
  getMessageTemplates(sid: string) {
    return this.db
      .collection('users/' + sid + '/messageTemplates', (ref) => ref)
      .snapshotChanges();
  }
  // update template
  updateTemplate(
    sid: string,
    templateId: string,
    tName,
    body,
    tType,
    tRecType,
    smsApiTemplateId,
    templateNameSpaceWa,
    tLangCode,
    image_link,
    video_link,
    document_link,
    document_name
  ) {
    const templId = smsApiTemplateId ? smsApiTemplateId : '';
    this.db.doc('users/' + sid + '/messageTemplates/' + templateId).update({
      templateName: tName,
      body: body,
      templateType: tType,
      tempRecType: tRecType,
      smsApiTemplateId: templId,
      templateNameSpaceWa,
      tLangCode,
      image_link,
      video_link,
      document_link,
      document_name,
    });
  }
  // delete selected template
  deleteTemplate(sid, templateId) {
    this.db.doc('users/' + sid + '/messageTemplates/' + templateId).delete();
  }
}
