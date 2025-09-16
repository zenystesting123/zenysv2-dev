// *********************************************************************************
// Description: Compose mail popup
// Inputs: data variable injected from sale view or customer view
// ***********************************************************************************

import {
  Component,
  OnInit,
  Inject,
  HostListener,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { GoosleapitofirebaseService } from '../googleapis/goosleapitofirebase.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ComposemailService } from './composemail.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { _fixedSizeVirtualScrollStrategyFactory } from '@angular/cdk/scrolling';
import { GoogleCalendarEventService } from 'src/app/calendar-events/google-calendar-event.service';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { Customer, EMailMessageModel, Service } from 'src/app/data-models';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { take } from 'rxjs/operators';
import { UploadFilesComponent } from 'src/app/upload-files/upload-files.component';
import { EncryptDecryptComponent } from '../encrypt-decrypt/encrypt-decrypt.component';
import { GmaillistComponent } from '../gmaillist/gmaillist.component';

// import {GoosleapitofirebaseService} from './goosleapitofirebase.service'

@Component({
  selector: 'app-composemail',
  templateUrl: './composemail.component.html',
  styleUrls: ['./composemail.component.scss'],
})
export class ComposemailComponent implements OnInit, OnDestroy {
  customerFName: string; //customer first name
  customerSName: string; //customer second name
  customerCName: string; //customer compnay name
  saletitle: string; //sale title
  customer: string; //sale customer name
  saleAssignedTo: string; // sale assigned to name

  replythreadId: string; // thread id if its a reply
  mailid: string = ''; // mail id to which the details are to be sent
  mailsubject: string = ''; // the mail subject
  mailbody: string = ''; // the mail body
  mailcc: string = ''; // mail cc
  mailbcc: string = ''; // mail bcc
  showcc: boolean = false; //varibale to show or hide the cc
  showbcc: boolean = false; // varibale to show or hide the bcc
  files: any[] = []; // array containing all the attached files
  files2: any; // temporary variable to store the files
  size: number[] = []; // used as a temporary variable
  editorConfig: AngularEditorConfig = {
    maxHeight: '250px',
    editable: true,
    minHeight: '225px',
    translate: 'yes',
    outline: false,
    toolbarHiddenButtons: [[], ['fontSize', 'insertImage', 'insertVideo']],
  };
  templates: any = []; // email Templates

  // Subscriptions
  userDetailsSubscription: Subscription;
  emailTemplateSubscription: Subscription;
  getCustomerDetails: Subscription;
  getSalesDetails: Subscription;
  getServicesDetails: Subscription;
  assignedTo: any;
  sale: any;
  type: string;
  contact: any;
  service: Service = null;
  servicetitle = '';
  serviceAssignedTo = '';
  messageHistory: any = {} //store all the messages sent to db
  submitDisable: boolean = false; //to stop creating duplicate entries on double click

  constructor(
    private analytics: AngularFireAnalytics,
    public goog: GoogleCalendarEventService,
    public httpServ: ComposemailService,
    public dialogRef: MatDialogRef<ComposemailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public db: GoosleapitofirebaseService,
    public commonService: CommonService,
    public snack: MatSnackBar,
    private zone: NgZone,
    public dialog: MatDialog
  ) {
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        this.type = '';
        if (this.data.saleid == '' || !this.data.saleid) {
          // to get the email templates that are sale type or contact type
          if (this.data.serviceid == '' || !this.data.serviceid) {
            this.type = 'Contact';
          } else {
            this.type = 'Service';
          }
        } else {
          this.type = 'Sale';
        }

        // fetching all the email templates of the specifc type
        this.emailTemplateSubscription = this.db
          .getEmailTemplates(this.data.superuserid, this.type)
          .subscribe((data) => {
            this.templates = data;
          });
        // if sale id is present get the sales details to use the template
        if (this.data.saleid) {
          this.getSalesDetailsfn();
          this.getCustomerDetailsfn();
          //else use the customerId to use the templates
        } else if (this.type == 'Service') {
          this.getServicesDetailsfn();
          this.getCustomerDetailsfn();
        } else if (this.data.customerid) {
          this.getCustomerDetailsfn();
        }
      }
    );
    if (this.data.link) {
      this.mailbody = 'Please find attached document\n' + this.data.link;
    }

    // to get the email from customer
    if (this.data.tomail) {
      this.mailid = this.data.tomail;
    }

    // if the mail is a reply
    if (this.data.reply) {
      this.replythreadId = this.data.reply.threadId;
      if(!this.data.reply.Subject.startsWith("Re: ")) {
        this.mailsubject = 'Re: ' + this.data.reply.Subject;
      } else {
        this.mailsubject = this.data.reply.Subject;
      }
    }
  }

  ngOnInit(): void {}

  //function to hide or show cc
  showccfn() {
    this.showcc = !this.showcc;
  }

  //function to hide or show bcc
  showbccfn() {
    this.showbcc = !this.showbcc;
  }
  getCustomerDetailsfn() {
    this.getCustomerDetails = this.httpServ
      .getCustomerDetails(this.data.customerid)
      .pipe(take(1))
      .subscribe((data: any) => {
        this.contact = data;
        this.customerFName = data.firstName
          ? data.firstName
          : 'Firstname not available';
        this.customerSName = data.secondName ? data.secondName : ' ';
        this.customerCName = data.companyName
          ? data.companyName
          : 'Company Name not available';
        if (this.type == 'Contact') {
          this.getAssignedToDetails(data.assignedTo);
        }
      });
  }
  getSalesDetailsfn() {
    this.getSalesDetails = this.httpServ
      .getSalesDetails(this.data.saleid)
      .pipe(take(1))
      .subscribe((data: any) => {
        this.sale = data;
        this.saletitle = data.saleTitle;
        this.customer =
          data.firstName + ' ' + (data.secondName ? data.secondName : ' ');
        this.saleAssignedTo = data.assignedToName;
        if (this.type == 'Sale') {
          this.getAssignedToDetails(data.assignedTo);
        }
      });
  }
  getServicesDetailsfn() {
    this.getServicesDetails = this.httpServ
      .getServicesDetails(this.data.serviceid)
      .pipe(take(1))
      .subscribe((data: any) => {
        this.service = data;
        this.servicetitle = data.serviceTitle;
        this.customer = data.secondName
          ? data.firstName + ' ' + data.secondName
          : ' ';
        this.serviceAssignedTo = data.assignedToName;
        if (this.type == 'Service') {
          this.getAssignedToDetails(data.assignedTo);
        }
      });
  }
  getAssignedToDetails(Id) {
    if (Id != this.commonService.superUserData.superUserId) {
      this.httpServ.getAssignedTo(Id).subscribe((data) => {
        this.assignedTo = data;
      });
    } else this.assignedTo = this.commonService.superUserData;
  }

  // function to send the mail. Binded to send button
  sndMail2(GAevent) {
    this.submitDisable = true;
    this.analytics.logEvent(GAevent);
    // payload conatins all the information of the mail
    var payload: any = {
      from: 'me',
      to: this.mailid.toString(),
      cc: this.mailcc.toString(),
      bcc: this.mailbcc.toString(),
      html: this.mailbody.toString(),
      subject: this.mailsubject.toString(),
    };
    //if its a reply, add messageID to payload
    if (this.data.reply) {
      payload.inReplyTo = this.data.reply.messageID ? this.data.reply.messageID.toString() : '';
      payload.references = this.data.reply.messageID ? this.data.reply.messageID.toString() : '';
    }
    //add attachments to payload
    if (this.files) {
      payload.attachments = this.files;
    }
    //send payload to cloud function to convert data to sending format
    this.httpServ
      .mailer(payload)
      .pipe(take(1))
      .subscribe((data) => {
        // send the payload to nodemailer to convert to mime using nodemailer cloudfunction
        const raw = window
          .btoa(unescape(encodeURIComponent(data)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_');
        if (this.data.reply) {
          //for sending reply
          this.goog.gapi.client.gmail.users.messages
            .send({
              userId: 'me',
              resource: {
                raw: raw,
                threadId: this.data.reply.threadId,
              },
            })
            .then((res) => {
              //get the mails to obtain data to store in message history
              this.goog.gapi.client.gmail.users.threads
              .get({ userId: 'me', id: res.result.threadId })
              .execute((result) => {
                //variable to store current message
                let newMessage;
                //send the message to parser to separate the data
                result.messages.forEach((message,index) =>{
                  //get the current sent message
                  if(message.id == res.result.id)
                  newMessage = this.parser(message);
                })
                //previous message history
                this.messageHistory = this.data.messageHistory;
                //get current message to add to existing message history
                var message:EMailMessageModel = {
                  threadId: res.result.id,
                  from: this.data.loggedInMailId,
                  to: this.mailid,
                  cc: this.mailcc,
                  bcc: this.mailbcc,
                  //encrypt the body
                  body: EncryptDecryptComponent.encryptUsingAES256(this.mailbody, res.result.id),
                  subject: this.mailsubject,
                  date: res.headers.date,
                  attachments: newMessage.attachments,
                  messageID: this.data.reply.messageID
                }
                //get length of message history
                let msgHistoryLen = Object.keys(this.messageHistory).length;
                //add new message to message history
                this.messageHistory[msgHistoryLen] = message;
                //update db
                this.db.updateMessageHistory(
                  this.data.superuserid,
                  res.result.threadId,
                  this.messageHistory,
                  this.data.loggedInMailId
                );
                this.zone.run(() => {
                  //close compose mail popup
                  this.dialogRef.close();
                  this.snack.open('Email sent', '', {
                    duration: 2000,
                  });
                });

              });
            });
        } else {
          //if its a newly composed mail
          this.goog.gapi.client.gmail.users.messages
            .send({
              userId: 'me',
              resource: {
                raw: raw,
              },
            })
            .then((res) => {
              //get the sent mail details through gapi
              this.goog.gapi.client.gmail.users.threads
              .get({ userId: 'me', id: res.result.threadId })
              .execute((result) => {
                //parse it to extract required data
                let newMessage;
                result.messages.forEach((message,index) =>{
                  newMessage = this.parser(message);
                })
                //construct new message to store in message history
                var message:EMailMessageModel = {
                  threadId: res.result.threadId,
                  from: this.data.loggedInMailId,
                  to: this.mailid,
                  cc: this.mailcc,
                  bcc: this.mailbcc,
                  body: EncryptDecryptComponent.encryptUsingAES256(this.mailbody, res.result.threadId),
                  subject: this.mailsubject,
                  date: res.headers.date,
                  attachments: newMessage.attachments,
                  messageID: newMessage.messageID ? newMessage.messageID : ''
                }
                //add first message to message history since its a new mail
                this.messageHistory[0] = message;
                //sabe to db
                this.db.savemailid(
                  this.data.superuserid,
                  this.data.customerid,
                  this.data.saleid,
                  this.data.serviceid,
                  this.data.loggedInMailId,
                  res.result.threadId,
                  this.messageHistory
                ).then(res => {
                  this.zone.run(() => {
                    //close compose mail popup
                    this.dialogRef.close();
                    this.snack.open('Email sent', '', {
                      duration: 2000,
                    });
                  });
                })
              })

            });
        }
      });

  }

  //  to add attachments
  fileChangeEvent(event) {
    var sizeloc = 0;
    this.size.length > 0
      ? this.size.map((m) => {
          sizeloc += m;
        })
      : (sizeloc = 0);
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.files.push({
        path: reader.result,
        filename: event.target.files[0].name,
      });
      this.size.push(event.target.files[0].size);
      this.files2 = this.files;
    };
  }

  //  to delete a file from attachment
  deleteFile(i) {
    this.files2.splice(i, 1);
    this.files = this.files2;
    this.size.splice(i, 1);
  }

  // fn to replace fields if a template is selected from cont/sale/service details
  selectTemplate(template) {
    var superUserDetails = this.commonService.superUserData;
    var assignedTo = this.assignedTo;

    if (this.type == 'Contact') {
      var contact = this.contact;
      var str: any = template.body
        .replace(/\#\[contact.Company Name\]/g, contact.companyName)
        .replace(/\#\[contact.First Name\]/g, contact.firstName)
        .replace(/\#\[contact.Second Name\]/g, contact.secondName)
        .replace(/\#\[contact.Contact No\]/g, contact.contactNo)
        .replace(/\#\[contact.Email\]/g, contact.email)
        .replace(/\#\[contact.Priority\]/g, contact.priority)
        .replace(/\#\[contact.Status\]/g, this.commonService.getStatusName('customers', contact.selectedContactPipeline,contact.status))
        .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
        .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
        .replace(/\#\[user.Last Name\]/g, assignedTo.lastname)
        .replace(/\#\[user.Contact No\]/g, assignedTo.phone)
        .replace(/\#\[user.Email\]/g, assignedTo.email);

      // cont addi fields replacing section - date and date and time must be handles seperately
      if (superUserDetails.customFieldsContact) {
        let teststring = str;
        for (let i = 0; i < superUserDetails.customFieldsContact.length; i++) {
          if (superUserDetails.customFieldsContact[i].isActive === true) {
            var str1 =
              '\\#\\[contact.' +
              superUserDetails.customFieldsContact[i].fieldName +
              '\\]';

            var re = new RegExp(str1, 'g');
            teststring = teststring.replace(
              re,
              contact.additionalFieldsArr
                ? contact.additionalFieldsArr[i + '']?.fieldValue
                  ? superUserDetails.customFieldsContact[i].fieldType == 'date'
                    ? typeof contact.additionalFieldsArr[i + ''].fieldValue ==
                      'object'
                      ? this.convertDate(
                          contact.additionalFieldsArr[i + ''].fieldValue
                        )
                      : 'Date not provided'
                    : superUserDetails.customFieldsContact[i].fieldType ==
                      'date_time'
                    ? this.convertDateTime(
                        contact.additionalFieldsArr[i + ''].fieldValue
                      )
                    : contact.additionalFieldsArr[i + '']?.fieldValue
                  : 'Value not provided'
                : 'Value not provided'
            );
          }
        }
        str = teststring;
      }
    } else if (this.type == 'Sale') {
      var contact = this.contact;
      var sale = this.sale;
      if (contact) {
        var str = template.body
          .replace(/\#\[sale.Sale Title\]/g, sale.saleTitle)
          .replace(/\#\[sale.Estimated Value\]/g, sale.estimatedValue)
          .replace(/\#\[sale.Start Date\]/g, this.convertDate(sale.startDate))
          .replace(
            /\#\[sale.Expected Completion Date\]/g,
            this.convertDate(sale.expCompletionDate)
          )
          .replace(/\#\[sale.Stage\]/g, this.commonService.getStatusName('sales', sale.selectedSalePipeline,sale.salesStage))
          .replace(/\#\[sale.Priority\]/g, sale.priority)
          .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
          .replace(/\#\[sale.Description\]/g, sale.description)
          .replace(/\#\[contact.Company Name\]/g, contact.companyName)
          .replace(/\#\[contact.First Name\]/g, contact.firstName)
          .replace(/\#\[contact.Second Name\]/g, contact.secondName)
          .replace(/\#\[contact.Contact No\]/g, contact.contactNo)
          .replace(/\#\[contact.Email\]/g, contact.email)
          .replace(/\#\[contact.Priority\]/g, contact.priority)
          .replace(/\#\[contact.Status\]/g, this.commonService.getStatusName('customers', contact.selectedContactPipeline,contact.status))
          .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
          .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
          .replace(/\#\[user.Last Name\]/g, assignedTo.lastname)
          .replace(/\#\[user.Contact No\]/g, assignedTo.phone)
          .replace(/\#\[user.Email\]/g, assignedTo.email);

        // contact additional fields
        if (superUserDetails.customFieldsContact) {
          let teststring = str;
          for (
            let i = 0;
            i < superUserDetails.customFieldsContact.length;
            i++
          ) {
            if (superUserDetails.customFieldsContact[i].isActive == true) {
              var str1 =
                '\\#\\[contact.' +
                superUserDetails.customFieldsContact[i].fieldName +
                '\\]';

              var re = new RegExp(str1, 'g');
              teststring = teststring.replace(
                re,
                (contact.additionalFieldsArr[i + '']?.fieldValue)
                  ? superUserDetails.customFieldsContact[i].fieldType == 'date'
                    ? typeof contact.additionalFieldsArr[i + ''].fieldValue ==
                      'object'
                      ? this.convertDate(
                          contact.additionalFieldsArr[i + ''].fieldValue
                        )
                      : 'Date not provided'
                    : superUserDetails.customFieldsContact[i].fieldType ==
                      'date_time'
                    ? this.convertDateTime(
                        contact.additionalFieldsArr[i + ''].fieldValue
                      )
                    : contact.additionalFieldsArr[i + ''].fieldValue
                  : 'Value not provided'
              );
            }
          }

          str = teststring;
        }

        // sale additional fields
        if (superUserDetails.customFieldsSale) {
          let str2 = str;
          for (let i = 0; i < superUserDetails.customFieldsSale.length; i++) {
            if (superUserDetails.customFieldsSale[i].isActive === true) {
              var str1 =
                '\\#\\[sale.' +
                superUserDetails.customFieldsSale[i].fieldName +
                '\\]';
              var re = new RegExp(str1, 'g');
              str2 = str2.replace(
                re,
                (sale.additionalFieldsArr[i + '']?.fieldValue)
                  ? superUserDetails.customFieldsSale[i].fieldType == 'date'
                    ? typeof sale.additionalFieldsArr[i + ''].fieldValue ==
                      'object'
                      ? this.convertDate(
                          sale.additionalFieldsArr[i + ''].fieldValue
                        )
                      : 'Date not provided'
                    : superUserDetails.customFieldsSale[i].fieldType ==
                      'date_time'
                    ? this.convertDateTime(
                        sale.additionalFieldsArr[i + ''].fieldValue
                      )
                    : sale.additionalFieldsArr[i + ''].fieldValue
                  : 'Value not provided'
              );
            }
          }
          str = str2;
        }
      }
    } else if (this.type == 'Service') {
      var contact = this.contact;
      var service = this.service;
      if (service) {
        var str = template.body
          .replace(/\#\[service.Service Title\]/g, service.serviceTitle)
          .replace(/\#\[service.Estimated Value\]/g, service.estimatedValue)
          .replace(
            /\#\[service.Start Date\]/g,
            this.convertDate(service.startDate)
          )
          .replace(
            /\#\[service.Expected Completion Date\]/g,
            this.convertDate(service.expCompletionDate)
          )
          .replace(/\#\[service.Stage\]/g, this.commonService.getStatusName('services', service.selectedServPipeline,service.servicesStage))
          .replace(/\#\[service.Priority\]/g, service.priority)
          .replace(/\#\[service.Assigned To\]/g, service.assignedToName)
          .replace(/\#\[service.Description\]/g, service.description)
          .replace(/\#\[contact.Company Name\]/g, contact.companyName)
          .replace(/\#\[contact.First Name\]/g, contact.firstName)
          .replace(/\#\[contact.Second Name\]/g, contact.secondName)
          .replace(/\#\[contact.Contact No\]/g, contact.contactNo)
          .replace(/\#\[contact.Email\]/g, contact.email)
          .replace(/\#\[contact.Priority\]/g, contact.priority)
          .replace(/\#\[contact.Status\]/g, this.commonService.getStatusName('customers', contact.selectedContactPipeline,contact.status))
          .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
          .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
          .replace(/\#\[user.Last Name\]/g, assignedTo.lastname)
          .replace(/\#\[user.Contact No\]/g, assignedTo.phone)
          .replace(/\#\[user.Email\]/g, assignedTo.email);

        // contact additional fields
        if (superUserDetails.customFieldsContact) {
          let teststring = str;
          for (
            let i = 0;
            i < superUserDetails.customFieldsContact.length;
            i++
          ) {
            if (superUserDetails.customFieldsContact[i].isActive === true) {
              var str1 =
                '\\#\\[contact.' +
                superUserDetails.customFieldsContact[i].fieldName +
                '\\]';

              var re = new RegExp(str1, 'g');

              teststring = teststring.replace(
                re,
                (contact.additionalFieldsArr[i + '']?.fieldValue)
                  ? superUserDetails.customFieldsContact[i].fieldType == 'date'
                    ? typeof contact.additionalFieldsArr[i + ''].fieldValue ==
                      'object'
                      ? this.convertDate(
                          contact.additionalFieldsArr[i + ''].fieldValue
                        )
                      : 'Date not provided'
                    : superUserDetails.customFieldsContact[i].fieldType ==
                      'date_time'
                    ? this.convertDateTime(
                        contact.additionalFieldsArr[i + ''].fieldValue
                      )
                    : contact.additionalFieldsArr[i + ''].fieldValue
                  : 'Value not provided'
              );
            }
          }

          str = teststring;
        }

        // sale additional fields
        if (
          superUserDetails.customFieldsService &&
          service.additionalFieldsArr
        ) {
          let str2 = str;
          for (
            let i = 0;
            i < superUserDetails.customFieldsService.length;
            i++
          ) {
            if (superUserDetails.customFieldsService[i].isActive === true) {
              {
                var str1 =
                  '\\#\\[service.' +
                  superUserDetails.customFieldsService[i].fieldName +
                  '\\]';
                var re = new RegExp(str1, 'g');
                str2 = str2.replace(
                  re,
                  service.additionalFieldsArr[i + '']
                    ? service.additionalFieldsArr[i + ''].fieldValue
                      ? superUserDetails.customFieldsService[i].fieldType ==
                        'date'
                        ? this.convertDate(
                            service.additionalFieldsArr[i + ''].fieldValue
                          )
                        : superUserDetails.customFieldsService[i].fieldType ==
                          'date_time'
                        ? this.convertDateTime(
                            service.additionalFieldsArr[i + ''].fieldValue
                          )
                        : service.additionalFieldsArr[i + ''].fieldValue
                      : ''
                    : ''
                );
              }
            }
          }
          str = str2;
        }
      }
    }
    this.mailbody = str;
    this.mailsubject = template.subject;
  }

  // upload file function
  onUploadFile() {
    const dialogRef = this.dialog.open(UploadFilesComponent, {
      width: '800px',
      data: 'opened as dialog',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        var mydiv = document.getElementsByClassName(
          'angular-editor-textarea'
        )[0];
        var newcontent = document.createElement('div');
        newcontent.innerHTML = '<br>' + result.data;
        newcontent.style.color = 'blue';

        while (newcontent.firstChild) {
          mydiv.appendChild(newcontent.firstChild);
        }
      }
    });
  }
  // to convert date and time from timestamp to string
  convertDateTime(date) {
    if (date && typeof date === 'object') {
      const n = date.toDate();
      let d = n.toLocaleString('en-GB');
      return d;
    } else {
      return 'Invalid date/date not provided';
    }
  }
  //convert to date string
  convertDate(date) {
    if (date && typeof date === 'object') {
      const n = date.toDate();
      let d = n.toLocaleDateString('en-GB');
      return d;
    } else {
      return 'Invalid date/date not provided';
    }
  }
  //parse the gapi response to readable data
  parser(response) {
    const result: any = {
      from: '',
      to: '',
      date: '',
      subject: '',
      messageID: '',
      text: '',
      body: '',
      cc: '',
      bcc: '',
      attachments: [],
    };
    result.from = response.payload.headers.filter((data) => {
      return data.name == 'From';
    })[0].value;
    (result.to = response.payload.headers.filter((data) => {
      return data.name == 'To';
    })[0].value),
      (result.date = response.payload.headers.filter((data) => {
        return data.name == 'Date';
      })[0].value),
      (result.subject = response.payload.headers.filter((data) => {
        return data.name == 'Subject';
      })[0].value),
      (result.messageID = response.payload.headers.filter((data) => {
        return data.name == 'Message-Id' || data.name == 'Message-ID';
      })[0].value),
      (result.cc = response.payload.headers.filter((data) => {
        return data.name == 'Cc';
      })[0]?.value),
      (result.bcc = response.payload.headers.filter((data) => {
        return data.name == 'Bcc';
      })[0]?.value);

    var test = 1;
    let parts = [response.payload];

    while (parts.length) {
      test += 1;
      let part = parts.shift();

      if (part.parts) parts = parts.concat(part.parts);

      if (part.mimeType === 'text/plain') {
        result.text = this.decode_alternative(part.body.data);
      }
      if (part.mimeType === 'text/html') {
        result.body = this.decode_alternative(part.body.data);
        result.body = this.convertToPlain(result.body)
      }
      if (part.body.attachmentId) {
        result.attachments.push({
          partId: part.partId,
          mimeType: part.mimeType,
          filename: part.filename,
          body: part.body,
        });
      }
    }
    return result;
  }
  //convert html to plain text
  decode_alternative(input) {
    // this way does not escape special "B" characters
    return window.atob(input.replace(/-/g, '+').replace(/_/g, '/'));
  }
  //converts html text to plain text
  convertToPlain(html){
    // Create a new div element
    var tempDivElement = document.createElement("div");
    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;
    // Retrieve the text property of the element
    return tempDivElement.textContent || tempDivElement.innerText || "";
  }

  // on desrtroy
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.userDetailsSubscription.unsubscribe();
    this.emailTemplateSubscription.unsubscribe();
    this.getServicesDetails?.unsubscribe();
  }
}
