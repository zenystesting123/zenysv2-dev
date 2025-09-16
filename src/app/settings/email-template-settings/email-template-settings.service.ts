import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class EmailTemplateSettingsService {

  constructor(private db: AngularFirestore, private http: HttpClient) {}
  
  // create new email template
  create(sid, newtemplate) {
    return this.db
      .collection('users/' + sid + '/emailTemplates')
      .add({ ...newtemplate });
  }
  // read email templates
  getEmailTemplates(sid: string) {
    return this.db
      .collection('users/' + sid + '/emailTemplates', (ref) => ref)
      .snapshotChanges();
  }
  // update template
  updateTemplate(sid: string, templateId: string, tName, subject, body, tType) {
    this.db
      .doc('users/' + sid + '/emailTemplates/' + templateId)
      .update({
        templateName: tName,
        subject: subject,
        body: body,
        templateType: tType,
      });
  }
// delete selected template
  deleteTemplate(sid, templateId) {
    this.db
      .doc('users/' + sid + '/emailTemplates/' + templateId)
      .delete();
  }

  saveSMTP(sid, data) {
    return this.db.doc('users/' + sid + '/SMTPsettings/SMTP').set(data);
  }
  getSMTP(sid) {
    return this.db.doc('users/' + sid + '/SMTPsettings/SMTP').valueChanges();
  }
  testSMTP(data) {
    return this.http.post(environment.cloudFunctions.nodemailer, data);
  }
}
