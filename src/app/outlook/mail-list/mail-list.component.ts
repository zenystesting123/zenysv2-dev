// *********************************************************************************
// Description: Mail list in web
// Inputs:
// Outputs:
// ***********************************************************************************

import { Component, OnInit, Input, HostListener, Inject, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject, Subscription, throwError } from 'rxjs';
import { ComposeMailComponent } from '../compose-mail/compose-mail.component';
import { MatDialog } from '@angular/material/dialog';
import { EncryptDecryptComponent } from '../encrypt-decrypt/encrypt-decrypt.component';
import { catchError, filter, retry, take, takeUntil } from 'rxjs/operators';
import { EMailMessageModel } from 'src/app/data-models';
import { OutlookService } from '../outlook.service'
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { InteractionStatus, PopupRequest } from '@azure/msal-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
//UserProfile Object
type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
};
@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit, OnDestroy {
  profile!: ProfileType;

  @Input() superUserId: String = ''; //superuserId
  @Input() custId: string = ''; //customerId if customer present
  @Input() saleId: string = ''; //saleId if called from sales module 
  @Input() serviceId = ''; //serviceId if called from support module
  @Input() toMail: String = ''; //customer's mail id to which mail is sent
  @Input() parentSubject: Subject<any>; // used to detect the click of tab in customers page
  //event emitted to show mail chosen is outlook
  @Output() mailChoosen = new EventEmitter<string>();
  connectoutlookdisp: boolean = true; // to show the login button
  displayedColumns2: string[] = ['To', 'Subject', 'Body', 'Date']; //table headers for mail list
  dataSource2: any[] = []; // datasource for table
  totalunread: number = 0; // total number of unread threads
  mailexist: boolean; // false if there have been no mails send
  hideTab0Flag = true; //hide or show the connect to google button
  passtomail: any; // this is passed to compose mail tab

  // subscriptions
  mailDbSubscription: Subscription;
  loggedInMailId: string; //stores current logged in users's mail id
  //stores a single message
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
  } //store all the messages send/received for a thread
  msgHistory: EMailMessageModel[] = []; //stores all the message histories from db
  dataFetched: boolean = false; //to check if data was already stored in db
  response: any[] = []; //stores response from gapi for every threads
  checkedHistory: boolean = false; //If msghistory in db are fetched once
  checkedNewMails: boolean = false; //if newmails are fetched once
  path: string; //To identity module from which mail is send
  Id: string; //to store custid, saleid, or serv id based on the module
  isIframe = false; //used to call login window
  loginDisplay = false; //shows log in button based on this flag
  page: string; //to navigate back to the page on logout
  module: string; //to navigate back to the page on logout
  /** Subject that emits when the component has been destroyed. */
  private readonly _destroying$ = new Subject<void>();
  
  constructor(
    @Inject(MSAL_GUARD_CONFIG) 
    private msalGuardConfig: MsalGuardConfiguration, 
    private broadcastService: MsalBroadcastService, 
    private authService: MsalService,
    public db: OutlookService,
    public dialog: MatDialog,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    //Check if 'EMail' tab is clicked
    this.parentSubject.pipe(takeUntil(this._destroying$)).subscribe((event) => {
      if (event == 'Email') {
        this.tabClick();
      }
    });
  }
  // when email tab is clicked
  tabClick() {
    //to check login window status
    this.isIframe = window !== window.parent && !window.opener;
    this.broadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
    })
  }
  //To check if user is already logged in
  setLoginDisplay() {
    //if already logged, getAllAccounts gets the list of logged in accounts
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    //Check if user has logged in
    if (this.loginDisplay) {
      //emit event on connecting to outlook
      this.mailChoosen.emit("outlook");
      //set flag not to show connect to gmail button
      this.connectoutlookdisp = false; 
      //fetch all emails
      this.getemails(); 
    }
    // else show connect to gmail button
    else {
      this.connectoutlookdisp = true;
      //emit event on disconnecting from outlook
      this.mailChoosen.emit("");
    }
  }

  //logout of gapi
  logout() {
    //logout url, if using localhost will take http://localhost:4200/ only
    this.authService.logoutPopup({
      mainWindowRedirectUri: (environment.currentUrl == 'http://127.0.0.1:4200/' ? 'http://localhost:4200/': environment.currentUrl) + '/dash/'+ this.module + '/' + this.page + '/' + this.Id 
    });
    //show connect to gmail button
    this.connectoutlookdisp = true;
    //emit event on disconnecting from outlook
    this.mailChoosen.emit("");
    //clear values in table data source
    this.dataSource2 = [];
  }
  //login to microsoft account
  async login() {
    //call login function
    if (this.msalGuardConfig.authRequest){
      this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
        .subscribe({
          next: (result) => {
            this.setLoginDisplay();
          },
          error: (error) => console.log(error)
        });
    } else {
      this.authService.loginPopup()
        .subscribe({
          next: (result) => {
            this.setLoginDisplay();
          },
          error: (error) => console.log(error)
        });
    }
  }

  //get all the emails of sale or Customer from db
  async getemails() {
    //initialize data source array
    this.dataSource2 = [];
    //initialise messageHistory
    this.msgHistory = []
    this.checkedHistory = false;
    this.checkedNewMails = false;
    this.path = '';
    this.Id = '';
    if (this.saleId == '' && this.serviceId == '') {
      this.module = 'contact'
      this.page = 'customerdetails'
      this.path = 'customerId';
      this.Id = this.custId;
    }
    if (this.saleId != '') {
      this.module = 'sales'
      this.page = 'saleview'
      this.path = 'saleId';
      this.Id = this.saleId;
    }
    if (this.serviceId != '') {
      this.module = 'service'
      this.page = 'service-details'
      this.path = 'serviceId';
      this.Id = this.serviceId;
    }
    //get already saved mails details from db
    var rawdata: any = await this.getMailThreads(this.Id, this.path)
    await this.getallemail(rawdata);
  }

  // convert all mime messages to readable data
  async getallemail(data: any[]) {
    if (data.length > 0) {
      //to display no email message
      this.mailexist = true;
    } else {
      //to display no email message
      this.mailexist = false;
    }
    //initialize unread message count
    this.totalunread = 0;
    //get current logged in user's mail id
    this.loggedInMailId = await this.getProfile();
    
    //check if any new mails available in inbox for all the threads
    if(!this.checkedNewMails)
      data = await this.checkNewMails(data);
    
    //If message history available in db, display messages from db
    if(Object.keys(this.msgHistory).length > 0 ){
      
      Object.values(this.msgHistory).forEach((message,index) => {
        //push each message to dataSource2 to display in table
         this.dataSource2[index] = {
          body: "",
          data: JSON.parse(JSON.stringify(message[0].body)), //assign body to data since data is used to display body IN HTML for directly fetched data
          date: message[0].date,
          from: message[0].from,
          threadId: message[0].threadId,
          id: message[0].messageID,
          subject: message[0].subject,
          to: message[0].to,
          msgtoread: false,
          messageHistory: message,
          loggedInUser: data[index].loggedInUser
        };
      })
      
      //decrypt all the body to display in html
      this.dataSource2.forEach((datas,index) => {
        datas.data = JSON.parse(JSON.stringify(EncryptDecryptComponent.decryptUsingAES256(datas.data, datas.id)));
        //data contains html, which is converted to plain text
        datas.data = this.convertToPlain(datas.data);
        if(this.response[index]){
          //check if all messages exist in db
          Object.values(this.response[index])?.forEach(message =>{
            //set unread flag true if message contains labels UNREAD and INBOX
            if(message['isRead'] == false){
              datas.msgtoread = true;
            }
          });
        }
      })
      //count total unread messages
      this.settotalUnread();
      //sort datasource to show last mail first
      this.dataSource2 = this.dataSource2.sort((a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    }
  }

  //returns the response from gapi
  getThreadMessages(index, threadId) {
    return new Promise<Object>((resolve) => {
      //Define the header preference to fetch text response
      const headerDict = {
        'Prefer': 'outlook.body-content-type="text"'
      }
      //pass it as options to api call
      const requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };

      //get thread messages using gapi
      this.http.get("https://graph.microsoft.com/beta/me/mailFolders/inbox/messages?$filter=conversationId eq '"+ threadId + "'", requestOptions)
        .pipe(retry(2))
        .pipe(catchError(err => {
          console.log(err)
          return throwError(err);
        }))
        .subscribe((res) => {
          resolve(res['value']);
      });
    });
  }

  //function to get logged in user's mail id
  getProfile() {
    //access graph api to retrieve profile details of signed in user
    return new Promise<string>((resolve) => {  
      this.http.get('https://graph.microsoft.com/beta/me')
      .pipe(retry(2))
      .pipe(catchError(err => {
        console.log(err)
        return throwError(err);
      }))
      .subscribe((profile: ProfileType) => {
        //save current user's mail id
        let loggedInMailId = profile.userPrincipalName;
        console.log(loggedInMailId)
        resolve(loggedInMailId);
      }); 
    });
  }
  //get new mails if present
  getMailThreads(Id, path){
    return new Promise<Object>((resolve) => {
      //get all email threads for this customer from db
      this.mailDbSubscription = this.db
        .getmailsfromdb(this.superUserId, Id, path)
        .pipe(take(1))
        .subscribe((data) => {
          resolve(data);
        });
    });
  }

  //checks for new messages available for every thread
  async checkNewMails(data: any[]){
      return new Promise<Object[]>(async (resolve) => {
      var dbUpdated = false;
      for (let i = 0; i < data.length; i++) { 
        //for each thread, get its messageHistory from db
        this.msgHistory[i] = data[i].messageHistory ? JSON.parse(JSON.stringify(data[i].messageHistory)) : {};
        //if message thread was sent by current logged in user, check if there is any new mails available in gmail account
        if(data[i].loggedInUser == this.loggedInMailId){
                    
          //get all the emails from email account
          const res:any = await this.getThreadMessages(i, data[i].threadId);
          this.response[i] = res;
          //check if new mails available by checking its length
          //if(Object.values(res).length > Object.values(data[i].messageHistory).length){
            var messagehistory:any[] = [];
            //get existing msg history from db
            Object.values(data[i].messageHistory).forEach((msg, index) => {
              messagehistory[index] = msg;
            })
            //check if all messages exist in db
            Object.values(this.response[i]).forEach(async message =>{
              var present = false;
              messagehistory.forEach((msg)=> { 
                
                //if fetched message id exist in db
                if(message['id'] == msg.messageID){
                  present = true;
                  
                }
              })
              //if not present, add it to db
              if(present == false){
                
                //get the new message in readable format using parser
                let newMessage = await this.parser(message);
                //create the message object
                var messageObj:EMailMessageModel = {
                  threadId: message['conversationId'] ? message['conversationId'] : '',
                  from: newMessage['from'] ? newMessage['from'] : '',
                  to: newMessage['to'] ? newMessage['to'] : '',
                  cc: newMessage['cc'] ? newMessage['cc'] : '',
                  bcc: newMessage['bcc'] ? newMessage['bcc'] : '',
                  messageID: newMessage['messageID'] ? newMessage['messageID'] : '',
                  //encrypt the body
                  body: newMessage['body'] ? EncryptDecryptComponent.encryptUsingAES256(newMessage['body'], message['id']) : '',
                  subject: newMessage['subject'] ? newMessage['subject'] : '',
                  date: newMessage['date'] ? newMessage['date'] : '',
                  attachments: newMessage['attachments'] ? newMessage['attachments'] : [],
                }
                //add the message object to message history obj
                let msgHistoryLen = Object.keys(messagehistory).length;
                messagehistory[msgHistoryLen] = messageObj;
                //if new messages present, add to db
                if(Object.values(data[i].messageHistory).length < messagehistory.length)
                  //set flag if db is updated
                  dbUpdated = true;
                  //update message history in db
                  this.db.updateMessageHistory(
                    this.superUserId,
                    data[i].threadId,
                    messagehistory,
                    this.loggedInMailId
                  );
              }
            })
        }
      } 
      this.checkedNewMails = true; 
      //get updated data from db if db is updated
      if(dbUpdated){
        var rawdata: any = await this.getMailThreads(this.Id, this.path)
        for (let i = 0; i < rawdata.length; i++) { 
          //for each thread, get its messageHistory from db
          this.msgHistory[i] = data[i].messageHistory ? JSON.parse(JSON.stringify(data[i].messageHistory)) : {};
        }
        //return updated data from db
        resolve(rawdata);
      } else {
        resolve(data);
      }
    });
  }

  //open specific mail thread
  openemail(id, threadId, messageHistory,loggedInUser) {
    //object to pass to showemailthread component
    this.passtomail = {
      id: id,
      threadId: threadId,
      reply: {
        superuserid: this.superUserId,
        customerid: this.custId,
        tomail: this.toMail,
      },
      saleId: this.saleId,
      serviceId: this.serviceId,
      messageHistory: messageHistory,
      loggedInUser: loggedInUser,
      loggedInMailId: this.loggedInMailId

    };
    this.hideTab0Flag = false;
    //set unread to false after opening a message
    if(loggedInUser == this.loggedInMailId){
      let len = this.dataSource2.length;
      for (let i = 0; i < len; i++) {
        if (this.dataSource2[i].id == id) {
          this.dataSource2[i].msgtoread = false;
        }
      }
      //get total count of unread messages
      this.settotalUnread();
    }
  }
  //parse the gapi response to readable data
  parser(response) {
    return new Promise<Object>(async (resolve) => {
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

      result.from = response.from.emailAddress.address;
      result.to = response.sender.emailAddress.address;
      result.date = response.sentDateTime;
      result.subject = response.subject;  
      result.messageID = response.id;
      result.cc = response.ccRecipients;
      result.bcc = response.bccRecipients;

      if (response.body.contentType === 'html') {
        //result.body = this.decode_alternative(response.body.content);
        result.body = this.convertToPlain(response.body.content);
      }
      if (response.body.contentType === 'text') {
        //result.body = this.decode_alternative(response.body.content);
        result.body = response.body.content;
      }
      if (response.hasAttachments) {
        this.http.get('https://graph.microsoft.com/beta/me/mailFolders/inbox/messages/'+response.id+'/attachments')
          .pipe(retry(2))
          .pipe(catchError(err => {
            console.log(err)
            return throwError(err);
          }))
          .subscribe((attRes) => { 
            Object.values(attRes['value']).forEach((val,ind) => {
              result.attachments.push({
                attachmentId: val['id'],
                mimeType: val['contentType'],
                filename: val['name'],
                size: val['size'],
              });
            })
            resolve(result);
          })
      } else {
        resolve(result);
      }  
    })
  }

  // functon to get all the unread threads
  settotalUnread() {
    this.totalunread = this.dataSource2.filter((m) => {
      return m.msgtoread == true;
    }).length;
  }

  // function to open the compose mail popup
  sendemailpopup(url) {
    var data: any = {
      superuserid: this.superUserId,
      customerid: this.custId,
      link: url,
      tomail: this.toMail,
      saleid: this.saleId,
      serviceid: this.serviceId,
      loggedInMailId: this.loggedInMailId,
      messageHistory: this.messageHistory
    };
    const dialogRef = this.dialog.open(ComposeMailComponent, {
      panelClass: 'dialog-panel-class',
      data: data,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getemails();
    })
  }

  //convert html data to plain text
  convertToPlain(html){
    // Create a new div element
    var tempDivElement = document.createElement("div");
    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;
    // Retrieve the text property of the element 
    return tempDivElement.textContent || tempDivElement.innerText || "";
}

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.mailDbSubscription?.unsubscribe();
    this.parentSubject?.unsubscribe();
    this._destroying$.next();
    this._destroying$.complete();
  }
}
