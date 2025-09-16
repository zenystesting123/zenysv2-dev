// *********************************************************************************
// Description: Mail list in web
// Inputs:
// Outputs:
// ***********************************************************************************

import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { GoogleCalendarEventService } from 'src/app/calendar-events/google-calendar-event.service';
import { GoosleapitofirebaseService } from 'src/app/gmail/googleapis/goosleapitofirebase.service';
import { ComposemailComponent } from '../composemail/composemail.component';
import { MatDialog } from '@angular/material/dialog';
import { loggedIn } from '@angular/fire/auth-guard';
import { EncryptDecryptComponent } from '../encrypt-decrypt/encrypt-decrypt.component';
import { take } from 'rxjs/operators';
import { get } from 'http';
import { EMailMessageModel } from 'src/app/data-models';

@Component({
  selector: 'app-gmaillist',
  templateUrl: './gmaillist.component.html',
  styleUrls: ['./gmaillist.component.scss'],
})
export class GmaillistComponent implements OnInit {
  @Input() superUserId: String = '';
  @Input() custId: string = '';
  @Input() saleId: string = '';
  @Input() serviceId = '';
  @Input() toMail: String = '';
  @Input() parentSubject: Subject<any>; // used to detect the click of tab in customers page
  //event emitted to show mail chosen is gmail
  @Output() mailChoosen = new EventEmitter<string>();
  connectgmaildisp: boolean = true; // to show the login button
  displayedColumns2: string[] = ['To', 'Subject', 'Body', 'Date'];
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

  constructor(
    public goog: GoogleCalendarEventService,
    public db2: GoosleapitofirebaseService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    //Check if 'EMail' tab is clicked
    this.parentSubject.subscribe((event) => {
      if (event == 'Email') {
        this.tabClick();
      }
    });
  }
  // when email tab is clicked
  tabClick() {
    //Check if user has logged in
    if (this.goog.checkloginStatus()) {
      //set flag not to show connect to gmail button
      this.connectgmaildisp = false; 
      //emit event on connecting to gmail
      this.mailChoosen.emit("gmail");
      //fetch all emails
      this.getemails(); 
    }
    // else show connect to gmail button
    else this.connectgmaildisp = true;
  }
  //logout of gapi
  logout() {
    this.goog.logoutFromGoogleMail();
    //emit event on connecting to gmail
    this.mailChoosen.emit("");
    //show connect to gmail button
    this.connectgmaildisp = true;
    //clear values in table data source
    this.dataSource2 = [];
  }
  //login to gapi
  async login() {
    //call login function
    await this.goog.login();
    //emit event on connecting to gmail
    this.mailChoosen.emit("gmail");
    //hide connect to gmail button
    this.connectgmaildisp = false;
    //fetch all the emails
    this.getemails();
  }
  //get all the emails of sale or Customer from db
  async getemails() {
    //initialize data source array
    this.dataSource2 = [];
    this.checkedHistory = false;
    this.checkedNewMails = false;
    this.path = '';
    this.Id = '';
    if (this.saleId == '' && this.serviceId == '') {
      this.path = 'customerId';
      this.Id = this.custId;
    }
    if (this.saleId != '') {
      this.path = 'saleId';
      this.Id = this.saleId;
    }
    if (this.serviceId != '') {
      this.path = 'serviceId';
      this.Id = this.serviceId;
    }
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
    let loggedInMailProfile = await this.goog.gapi.client.gmail.users.getProfile({userId: 'me'});
    this.loggedInMailId = loggedInMailProfile.result.emailAddress;
    //initialise messageHistory
    this.msgHistory = []
    //initialise dataSource2
    this.dataSource2 = []
    //check if data history is available for all the mails
    if(!this.checkedHistory)
      data = await this.checkHistory(data);
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
          id: message[0].threadId,
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
        datas.data = this.convertToPlain(datas.data)
        if(this.response[index]){
          //check if all messages exist in db
          this.response[index]?.messages?.forEach(message =>{
            //set unread flag true if message contains labels UNREAD and INBOX
            if(message.labelIds.includes("UNREAD") && message.labelIds.includes("INBOX")){
              datas.msgtoread = true;
            }
          });
        }
      })
      //count total unread messages
      this.settotalUnread();
      //reverse datasource to show last mail first
      this.dataSource2.reverse();
    }
  }
  //returns the response from gapi
  getThreadMessages(index, threadId) {
    return new Promise<Object>((resolve) => {
      //get thread messages using gapi
      this.goog.gapi.client.gmail.users.threads.get({
        userId: 'me',
        id: threadId.toString(),
      }).execute((res) => {
        if(!res.error) {
          resolve(res);
        }
      });
    });
  }
  getMailThreads(Id, path){
    return new Promise<Object>((resolve) => {
      //get all email threads for this customer from db
      this.mailDbSubscription = this.db2
        .getmailsfromdb(this.superUserId, Id, path)
        .pipe(take(1))
        .subscribe((data) => {
          resolve(data);
        });
    });
  }

  //checks if data history available
  async checkHistory(data: any[]){
    return new Promise<Object[]>(async (resolve) => {
      
      /* If message history not available for a thread in db, fetch the mails and store the history in db  */
      for (let i = 0; i < data.length; i++) {     
        //check if messageHistory is available in db
        if(!data[i].messageHistory){
          //Get all mails from gmail through gapi
          const res:any = await this.getThreadMessages(i, data[i].threadId);
          if(res){
            let messageHistory:EMailMessageModel[] = []
            //res.messages contains the details of all messages for this threadId
            res.messages.forEach((msg,index) =>{
              
              //send each message object to parser to separate the data
              let newMessage = JSON.parse(JSON.stringify(this.parser(msg)));
              //construct the message object to create the message history to save in db
              var message:EMailMessageModel = {
                threadId: msg.id,
                from: newMessage.from ? newMessage.from : '',
                to: newMessage.to ? newMessage.to : '',
                cc: newMessage.cc ? newMessage.cc : '',
                bcc: newMessage.bcc ? newMessage.bcc : '',
                messageID: newMessage.messageID ? newMessage.messageID : '',
                //Encrypt the body of the message to store in db
                body: newMessage.body ? EncryptDecryptComponent.encryptUsingAES256(newMessage.body, msg.id) : '',
                subject: newMessage.subject ? newMessage.subject : '',
                date: newMessage.date ? newMessage.date : '',
                attachments: newMessage.attachments ? newMessage.attachments : []
              }
              
              //Final message history object with all the messages
              messageHistory[index] = JSON.parse(JSON.stringify(message));
              
            })
            
            //Add message history to db
            this.db2.updateMessageHistory(
              this.superUserId,
              data[i].threadId,
              messageHistory,
              this.loggedInMailId
            );
          }
        }
      }
      this.checkedHistory = true;
      var rawdata: any = await this.getMailThreads(this.Id, this.path)
      resolve(rawdata);
    });
  }

  //checks for new messages available for every thread
  async checkNewMails(data: any[]){
      return new Promise<Object[]>(async (resolve) => {
      
      for (let i = 0; i < data.length; i++) { 
        //for each thread, get its messageHistory from db
        this.msgHistory[i] = data[i].messageHistory ? JSON.parse(JSON.stringify(data[i].messageHistory)) : {};
          
        //if message thread was sent by current logged in user, check if there is any new mails available in gmail account
        if(data[i].loggedInUser == this.loggedInMailId){
                    
          //get all the emails from email account
          const res:any = await this.getThreadMessages(i, data[i].threadId);
          
          this.response[i] = res;
          //check if new mails available by checking its length
          if(res.messages.length > Object.values(data[i].messageHistory).length){
            var messagehistory:any[] = [];
            //get existing msg history from db
            Object.values(data[i].messageHistory).forEach((msg, index) => {
              messagehistory[index] = msg;
            })
            
            //check if all messages exist in db
            this.response[i].messages.forEach(message =>{
              var present = false;
              messagehistory.forEach((msg)=> { 
                
                //if fetched message id exist in db
                if(message.id == msg.threadId){
                  present = true;
                  
                }
              })
              //if not present, add it to db
              if(present == false){
                
                //get the new message in readable format using parser
                let newMessage = this.parser(message);
                
                //create the message object
                var messageObj:EMailMessageModel = {
                  threadId: message.id ? message.id : '',
                  from: newMessage.from ? newMessage.from : '',
                  to: newMessage.to ? newMessage.to : '',
                  cc: newMessage.cc ? newMessage.cc : '',
                  bcc: newMessage.bcc ? newMessage.bcc : '',
                  messageID: newMessage.messageID ? newMessage.messageID : '',
                  //encrypt the body
                  body: newMessage.body ? EncryptDecryptComponent.encryptUsingAES256(newMessage.body, message.id) : '',
                  subject: newMessage.subject ? newMessage.subject : '',
                  date: newMessage.date ? newMessage.date : '',
                  attachments: newMessage.attachments ? newMessage.attachments : [],
                }
                
                //add the message object to message history obj
                let msgHistoryLen = Object.keys(messagehistory).length;
                messagehistory[msgHistoryLen] = messageObj;
              }
            })
            
            //if new messages present, add to db
            if(Object.values(data[i].messageHistory).length !== messagehistory.length)
              //update message history in db
              this.db2.updateMessageHistory(
                this.superUserId,
                data[i].threadId,
                messagehistory,
                this.loggedInMailId
              );
          }
        }
      } 
      this.checkedNewMails = true; 
      var rawdata: any = await this.getMailThreads(this.Id, this.path)
      resolve(rawdata);
    });
  }

  //open specific mail thread
  openemail(id,messageHistory,loggedInUser) {
    //object to pass to showemailthread component
    this.passtomail = {
      id: id,
      reply: {
        superuserid: this.superUserId,
        customerid: this.custId,
        tomail: this.toMail,
      },
      saleId: this.saleId,
      serviceId: this.serviceId,
      messageHistory: messageHistory,
      loggedInUser: loggedInUser

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
  //decodes the response from gapi and get the required data from response
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
  //get plain text from response data
  decode_alternative(input) {
    // this way does not escape special "B" characters
    return window.atob(input.replace(/-/g, '+').replace(/_/g, '/'));
  }
  // gets the snippet of the mail to show as table
  mailmapper(array: any[]) {
    var mailsmall = {
      from: '',
      to: '',
      subject: '',
      date: '',
      body: '',
    };
    for (let i = 0; i < array.length; i++) {
      if (array[i].name == 'To') {
        mailsmall.to = array[i].value;
      }
      if (array[i].name == 'From') {
        mailsmall.from = array[i].value;
      }
      if (array[i].name == 'Subject') {
        mailsmall.subject = array[i].value;
      }
      if (array[i].name == 'Date') {
        mailsmall.date = array[i].value;
      }
    }
    return mailsmall;
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
    const dialogRef = this.dialog.open(ComposemailComponent, {
      width: '700px',
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
  }
}
