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
  OnDestroy,
  HostListener,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComposeMailComponent } from '../compose-mail/compose-mail.component';
import { CommonService } from '../../common.service';
import { EncryptDecryptComponent } from '../encrypt-decrypt/encrypt-decrypt.component';
import { catchError, retry, takeUntil } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { EMailMessageModel } from 'src/app/data-models';
import { ShowMailthreadService } from './show-mailthread.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-show-mailthread',
  templateUrl: './show-mailthread.component.html',
  styleUrls: ['./show-mailthread.component.scss']
})
export class ShowMailthreadComponent implements OnInit,OnDestroy {

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
    public dialog: MatDialog,
    public db: ShowMailthreadService,
    private http: HttpClient
  ) {
    this.common.userDatas.pipe(takeUntil(this.onDestroy$)).subscribe((data) => {
      this.isTabletsize = data.isTabetSize;
      this.isMobilesize = data.isMobileSize;
    });
  }

  async ngOnInit(): Promise<void> {
    
    //find current logged in user's email id
    this.loggedInMailId = this.data.loggedInMailId;
    //get email with current thread id
    this.db
      .getmail(this.data.reply.superuserid, this.data.threadId)
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
              const _markAsRead = {
                messageIds: [this.data.id]
              };
              this.http.post('https://graph.microsoft.com/beta/admin/serviceAnnouncement/messages/markRead', _markAsRead);
            }
          } 
          this.loader = false;
        }
    });
  }

  //called on sending reply mail
  sendemailpopup(to, subject, messageID) {
    //to send reply using composeemail Component
    const dialogRef = this.dialog.open(ComposeMailComponent, {
      width: '700px',
      data: {
        superuserid: this.data.reply.superuserid,
        customerid: this.data.reply.customerid,
        saleid: this.data.saleId,
        serviceid: this.data.serviceId,
        tomail: to,
        reply: {
          threadId: this.data.threadId,
          Subject: subject,
          messageID: messageID,
        },
        loggedInMailId: this.loggedInMailId,
        messageHistory: this.messageHistory
      },
    });
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

  //to get attachment to download
  downloadattach(id, messageId, mimetype, filename) {
    //get attachment reference through graph api
    this.http.get('https://graph.microsoft.com/beta/me/messages/'+messageId+'/attachments/' + id)
    .pipe(retry(2))
      .pipe(catchError(err => {
        console.log(err)
        return throwError(err);
      }))
    .subscribe((res) => {
      //convert attachment obtained to downloadable link format
      this.downloadfrombase64(res['contentBytes'], filename, mimetype);
    });
  }
  
  //converts downloadable file to download link
  downloadfrombase64(base64string, filename, mimeType) {
    var newString = base64string.replace(/-/g, '+').replace(/_/g, '/');
    const source = `data:${mimeType};base64,${newString}`;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${filename}`;
    link.click();
  }

   // ondestroy
   @HostListener('window:beforeunload')
   ngOnDestroy() {
     this.onDestroy$.next();
     this.onDestroy$.complete();
   }
}