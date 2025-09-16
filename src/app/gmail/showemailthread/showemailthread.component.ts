// *********************************************************************************
// Description: show the mail thread selected
// Inputs: data from the previous page
// Outputs: ClickReply sends the thread id to compose mail tab to send as reply
// ***********************************************************************************

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComposemailComponent } from '../composemail/composemail.component';
import { CustomerDetailsService } from 'src/app/contact/customer-details/customer-details.service';
import { GoogleCalendarEventService } from 'src/app/calendar-events/google-calendar-event.service';
import { CommonService } from '../../common.service';
import { GoosleapitofirebaseService } from '../googleapis/goosleapitofirebase.service';
import { EncryptDecryptComponent } from '../encrypt-decrypt/encrypt-decrypt.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EMailMessageModel } from 'src/app/data-models';

@Component({
  selector: 'app-showemailthread',
  templateUrl: './showemailthread.component.html',
  styleUrls: ['./showemailthread.component.scss'],
})
export class ShowemailthreadComponent implements OnInit, OnDestroy {
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  @Input() data: any;
  @Output() clickReply = new EventEmitter<any>();
  threadmessages: any[] = [];
  isTabletsize: boolean;
  isMobilesize: boolean;
  loader: boolean = true;
  //stores the current logged in user's mailid
  loggedInMailId: string;
  //stores a single message from the mail thread
  messageHistory: EMailMessageModel = {
    threadId: '',
    from: '',
    to: '',
    cc: '',
    bcc: '',
    messageID: '',
    body: '',
    subject: '',
    date: '',
    attachments: []
  };

  constructor(
    private common: CommonService,
    public goog: GoogleCalendarEventService,
    public dialog: MatDialog,
    public db: CustomerDetailsService,
    public serv: GoosleapitofirebaseService,
    private ref: ChangeDetectorRef
  ) {
    this.common.userDatas.subscribe((data) => {
      this.isTabletsize = data.isTabetSize;
      this.isMobilesize = data.isMobileSize;
    });
  }

  async ngOnInit(): Promise<void> {
    
    //find current logged in user's email id
    let loggedInMailProfile = await this.goog.gapi.client.gmail.users.getProfile({ userId: 'me' });
    this.loggedInMailId = loggedInMailProfile.result.emailAddress;
    //get email with current thread id
    this.serv
      .getmail(this.data.reply.superuserid, this.data.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((datas) => {
        if (this.data) {
          //get messageHistory of opened message from db
          this.messageHistory = JSON.parse(JSON.stringify(datas.messageHistory)) ? JSON.parse(JSON.stringify(datas.messageHistory)) : {};
          //If messageHistory has values, display email messages from db
          if(Object.keys(this.messageHistory).length > 0){ 
            //push each message from message history to this.threaded messages to display in html
            this.threadmessages = []
            //push each message to threadmessages array to display in html
            Object.values(this.messageHistory).forEach((message) => {
              this.threadmessages.push(JSON.parse(JSON.stringify(message)));
            })
            //decrypt the body
            this.threadmessages.forEach(message => {
              message.body = EncryptDecryptComponent.decryptUsingAES256(message.body, message.threadId);
            })
            //reverse to show last mail first
            this.threadmessages.reverse();

             //if message thread was sent by current logged in user, mark all unread messages in gmail as read
            if(this.data.loggedInUser == this.loggedInMailId){
              //Change the label of all unread messages to read when user opens the message
              this.goog.gapi.client.gmail.users.threads
                .modify({ userId: 'me', id: this.data.id, removeLabelIds: ['UNREAD'] })
                .execute((res) => {
                  // console.log(res)
                });
            }
            
          } else {
            //if message history not available, display mails directly from gapi
            this.goog.gapi.client.gmail.users.threads
              .get({ userId: 'me', id: this.data.id })
              .execute((res) => {
                //get each message to threadmessage in required format
                res.messages.map((data) => {
                  this.threadmessages.unshift(this.parser(data));
                });
                this.loader = false;
                this.ref.detectChanges();
              });
            //if message is read remove UNREAD label from Gapi
            this.goog.gapi.client.gmail.users.threads
              .modify({ userId: 'me', id: this.data.id, removeLabelIds: ['UNREAD'] })
              .execute((res) => {
                // console.log(res)
              });
            //get attachments 
            for (let i = 0; i < this.threadmessages.length; i++) {
              var filteredforattachments = this.threadmessages[
                i
              ].messages.payload.parts.filter((m) => {
                m.body.attachmentId != undefined;
              });
              
            }
          }
          this.loader = false;
        }
    });
  }

  sendemailpopup(to, subject, messageID) {
    //to send reply using composeemail Component
    const dialogRef = this.dialog.open(ComposemailComponent, {
      width: '700px',
      data: {
        superuserid: this.data.reply.superuserid,
        customerid: this.data.reply.customerid,
        saleid: this.data.saleId,
        serviceid: this.data.serviceId,
        tomail: to,
        reply: {
          threadId: this.data.id,
          Subject: subject,
          messageID: messageID,
        },
        loggedInMailId: this.loggedInMailId,
        messageHistory: this.messageHistory
      },
    });
  }
  //to extract the messages in the required format from gapi response
  parser(response) {
    const result: any = {
      from: '',
      to: '',
      date: '',
      subject: '',
      messageID: '',
      text: '',
      body: '',
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
      })[0].value);

    
    var test = 1;
    let parts = [response.payload];

    while (parts.length) {
      test += 1;
      let part = parts.shift();
      if (part.parts) parts = parts.concat(part.parts);
      if (part.mimeType === 'text/plain')
        result.text = this.decode_alternative(part.body.data);
      if (part.mimeType === 'text/html')
        result.body = this.decode_alternative(part.body.data);
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

  decode_alternative(input) {
    // this way does not escape special "B" characters
    return window.atob(input.replace(/-/g, '+').replace(/_/g, '/'));
  }
  downloadattach(id, messageId, mimetype, filename) {
   this.goog.gapi.client.gmail.users.messages.attachments
      .get({
        userId: 'me',
        id: id,
        messageId: messageId,
      })
      .execute((res) => {
        this.downloadfrombase64(res.data, filename, mimetype);
      });
  }
  downloadfrombase64(base64string, filename, mimeType) {
    var newString = base64string.replace(/-/g, '+').replace(/_/g, '/');
    const source = `data:${mimeType};base64,${newString}`;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${filename}`;
    link.click();
  }

  gotocomposemob(to, subject, messageID) {
    this.db.passdata = {
      superuserid: this.data.reply.superuserid,
      customerid: this.data.reply.customerid,
      saleid: this.data.saleId,
      tomail: to,
      reply: {
        threadId: this.data.id,
        Subject: subject,
        messageID: messageID,
      },
    };

    this.clickReply.emit();

  }
   // ondestroy
   @HostListener('window:beforeunload')
   ngOnDestroy() {
     this.onDestroy$.next();
     this.onDestroy$.complete();
   }
}
