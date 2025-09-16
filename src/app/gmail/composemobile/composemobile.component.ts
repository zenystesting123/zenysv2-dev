// *********************************************************************************
// Description: Compose mail popup
// Inputs: data variable initialised from customer service file
// Outputs: clickClose event trigger
// ***********************************************************************************
import { Component, OnInit,  Output, EventEmitter, HostListener} from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { GoosleapitofirebaseService } from '../googleapis/goosleapitofirebase.service';
import {ComposemailService} from '../composemail/composemail.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { _fixedSizeVirtualScrollStrategyFactory } from '@angular/cdk/scrolling';
import { CustomerDetailsService } from 'src/app/contact/customer-details/customer-details.service';
import { GoogleCalendarEventService } from 'src/app/calendar-events/google-calendar-event.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-composemobile',
  templateUrl: './composemobile.component.html',
  styleUrls: ['./composemobile.component.scss']
})
export class ComposemobileComponent implements OnInit {

  replythreadId:string; // variable set to thread id if its a reply
  mailid:string=""; // mail id to which the mail is sent
  mailsubject:string="";// mail subject
  mailbody:string=""; // mail body
  mailcc:string=""; // cc for the mails
  mailbcc:string=""; // bcc s for the mail
  showcc:boolean=false; // show or hide cc
  showbcc:boolean=false; //show or hide bcc
  files:any[]=[]; // contains the files attached
  files2:any // this is used as a temporary variable during deletion of attachment file
  size:number[]=[];// the total size of the attachment
  editorConfig: AngularEditorConfig = {
    maxHeight: '250px',
    editable: true,
    minHeight: '200px',
    translate: 'yes',
    showToolbar: false,
    outline:false
  }
  templates:any=[]; // all the tamplates of sale or contact
  data:any  // this contains the values passed from the gmail list
  emailTemplateSubscription:Subscription
  @Output() clickClose= new EventEmitter() // this is used to let the gmail list know that the windoe have been closed so that this window is hidden or shown
  getSalesDetails: Subscription;
  getCustomerDetails: Subscription;
  // the following variables are used for templates
  saletitle: any;
  customer: string;
  saleAssignedTo: any;
  customerFName: any;
  customerSName: any;
  customerCName: any;
  type: string;
  contact: any;
  sale: any;
  assignedTo: any;
  constructor(public goog:GoogleCalendarEventService,public httpServ:ComposemailService ,
    // public dialogRef: MatDialogRef<ComposemailComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService:CommonService,
    public cds:CustomerDetailsService,
    public db:GoosleapitofirebaseService,public snack:MatSnackBar) {
    this.data=cds.passdata
    this.type=""
        if(this.data.saleid==""||!this.data.saleid) // to get the email templates that are sale type or contact type
         this.type="Contact"
        else
         this.type="Sale"
      // fetching all the email templates of the specifc type
        this.emailTemplateSubscription=this.db.getEmailTemplates(this.data.superuserid,this.type).subscribe((data)=>{
          this.templates=data
        })

    if(this.data.saleid){
            this.getSalesDetailsfn()
            this.getCustomerDetailsfn()
            //else use the customerId to use the templates
          }else if(this.data.customerid){
            this.getCustomerDetailsfn()
          }


    // console.log(this.data)
  if(this.data.link){
    this.mailbody="Please find attached document\n"+this.data.link
  }
  if(this.data.tomail){
    this.mailid=this.data.tomail
  }

  if(this.data.reply){
    this.replythreadId=this.data.reply.threadId
    this.mailsubject="Re: " + this.data.reply.Subject
    // this.mailid=this.data.reply.to
  }


     }

  ngOnInit(): void {


  }


  getCustomerDetailsfn(){
    this.getCustomerDetails=this.httpServ.getCustomerDetails(this.data.customerid).pipe(take(1)).subscribe((data:any)=>{
      this.contact=data
      this.customerFName = data.firstName ? data.firstName : "Firstname not available";
            this.customerSName = data.secondName ? data.secondName : ' '
            this.customerCName = data.companyName ? data.companyName : "Company Name not available"
            if(this.type=="Contact")
            {
            this.getAssignedToDetails(data.assignedTo)
          }

    })
  }
  getSalesDetailsfn(){
    this.getSalesDetails=this.httpServ.getSalesDetails(this.data.saleid).pipe(take(1)).subscribe((data:any)=>{
      this.sale=data
      this.saletitle = data.saleTitle
              this.customer = data.firstName+" "+(data.secondName ? data.secondName : " ")
              this.saleAssignedTo = data.assignedToName;
              if(this.type=="Sale")
              {
              this.getAssignedToDetails(data.assignedTo)
            }
    })
  }
  getAssignedToDetails(Id){
    if(Id!=this.commonService.superUserData.superUserId)
    {
      this.httpServ.getAssignedTo(Id).subscribe((data)=>{
      this.assignedTo=data
    })
  }
  else
  this.assignedTo=this.commonService.superUserData
  }

// show or hide cc
showccfn(){
  this.showcc=!this.showcc
  // console.log(this.showcc)
}

// show or hide bcc
showbccfn(){
  this.showbcc=!this.showbcc
}

//  function to send mail
sndMail2(){
  // check if all fields are valid
  if(this.mailid==""||this.mailbody==""||this.mailsubject==""){
    this.snack.open("Required fields are empty", "", {
      duration: 1000,
    })
  }
  else{
  this.clickClose.emit()
  //payload contains all the information of the mail including body, mail to address
   var payload:any={
      from:"me",
      to:this.mailid.toString(),
      cc:this.mailcc.toString(),
      bcc:this.mailbcc.toString(),
      html:this.mailbody.toString(),
      subject :this.mailsubject.toString()
    }
    if(this.data.reply){
      payload.inReplyTo=this.data.reply.messageID.toString()
      payload.references =this.data.reply.messageID.toString()
    }
    if(this.files){
      payload.attachments=this.files
    }
    this.httpServ.mailer(payload).pipe(take(1)).subscribe((data)=>{ // sending the data to nodemailer to convert to mime
      const raw = window.btoa(unescape(encodeURIComponent(data))).replace(/\+/g, '-').replace(/\//g, '_');
      if(this.data.reply){ // checks if mail is a reply
        this.goog.gapi.client.gmail.users.messages.send({
          'userId': 'me',
          'resource': {
            'raw': raw,
            'threadId':this.data.reply.threadId // thread id is included so it becomes a reply
          }
        }).then(res => {
          // console.log(res);
        this.snack.open("Email sent", "", {
          duration: 2000,
        })
        });
      }
      else{
      this.goog.gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
          'raw': raw
        }
      }).then(res => {
        // console.log(res);
        let serviceId = ''
      this.db.savemailid(this.data.superuserid,this.data.customerid,this.data.saleid, serviceId,'', res.result.threadId, payload) //mail thread is saved to db only when its not a reply
      this.snack.open("Email send", "", {
        duration: 2000,
      });
      });}

    })

// this.dialogRef.close()
  }
}
//attachments are added using this function
fileChangeEvent(event){
  var sizeloc=0
  // console.log(event.target.files[0].size)
  this.size.length>0?this.size.map((m)=>{sizeloc+=m}):sizeloc=0
  // console.log(sizeloc)
  const reader = new FileReader();
  reader.readAsDataURL(event.target.files[0])
  // console.log(path)
  reader.onload=()=>{
    // console.log(reader.result)
    // if(this.size+reader.result.length>25000)
  this.files.push({path:reader.result,filename:event.target.files[0].name})
  this.size.push(event.target.files[0].size)
this.files2=this.files

  }
  // console.log(this.files)

}
// delete specific file from attachment
deleteFile(i){
  // console.log(i)
  this.files2.splice(i,1)
  this.files=this.files2
  this.size.splice(i,1)
}

// select the template
selectTemplate(template){
  var superUserDetails=this.commonService.superUserData
  var assignedTo=this.assignedTo


if (this.type == "Contact") {
  var contact=this.contact
  var str:any = template.body
  .replace(/\#\[contact.Company Name\]/g, contact.companyName)
  .replace(/\#\[contact.First Name\]/g, contact.firstName)
  .replace(/\#\[contact.Second Name\]/g, contact.secondName)
  .replace(/\#\[contact.Contact No\]/g, contact.contactNo)
  .replace(/\#\[contact.Email\]/g, contact.email)
  .replace(/\#\[contact.Priority\]/g, contact.priority)
  .replace(/\#\[contact.Status\]/g, this.commonService.getStatusName('customers', contact.selectedContactPipeline, contact.status))
  .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
  .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
  .replace(/\#\[user.Last Name\]/g, assignedTo.lastname)
  .replace(/\#\[user.Contact No\]/g, assignedTo.phone)
  .replace(/\#\[user.Email\]/g, assignedTo.email);

if (superUserDetails.customFieldsContact) {
  // let str = "console.log(msgData.html";
  let teststring = str;
  for (
    let i = 0;
    i < superUserDetails.customFieldsContact.length;
    i++
  ) {
    var str1 =
      "\\#\\[contact." +
      superUserDetails.customFieldsContact[i].fieldName +
      "\\]";
    // console.log(str1);
    // console.log(contact.additionalFieldsArray[i]);
    var re = new RegExp(str1, "g");
    teststring = teststring.replace(
      re,
      contact.additionalFieldsArray[i]
    );
  }
  // str += ")";
  // console.log(teststring);
  str = teststring;
}
} else if (this.type == "Sale") {
  var contact=this.contact
  var sale=this.sale
  if(contact)
  {
  // customername = sale.firstName + " " + sale.secondName;
  var str = template.body
  .replace(/\#\[sale.Sale Title\]/g, sale.saleTitle)
  .replace(
    /\#\[sale.Estimated Value\]/g,
    sale.estimatedValue
  )
  .replace(/\#\[sale.Start Date\]/g, this.convertDate(sale.startDate))
  .replace(
    /\#\[sale.Expected Completion Date\]/g,
    this.convertDate(sale.expCompletionDate)
  )
  .replace(/\#\[sale.Stage\]/g, this.commonService.getStatusName('sales', sale.selectedSalePipeline,sale.salesStage))
  .replace(/\#\[sale.Priority\]/g, sale.priority)
  .replace(/\#\[sale.Assigned To\]/g, sale.assignedTo)
  .replace(/\#\[sale.Description\]/g, sale.description)
  .replace(
    /\#\[contact.Company Name\]/g,
    contact.companyName
  )
  .replace(/\#\[contact.First Name\]/g, contact.firstName)
  .replace(
    /\#\[contact.Second Name\]/g,
    contact.secondName
  )
  .replace(/\#\[contact.Contact No\]/g, contact.contactNo)
  .replace(/\#\[contact.Email\]/g, contact.email)
  .replace(/\#\[contact.Priority\]/g, contact.priority)
  .replace(/\#\[contact.Status\]/g, this.commonService.getStatusName('customers', contact.selectedContactPipeline, contact.status))
  .replace(
    /\#\[contact.Assigned To\]/g,
    contact.assignedToName
  )
  .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
  .replace(/\#\[user.Last Name\]/g, assignedTo.lastname)
  .replace(/\#\[user.Contact No\]/g, assignedTo.phone)
  .replace(/\#\[user.Email\]/g, assignedTo.email);

// contact additional fields
if (superUserDetails.customFieldsContact) {
  // let str = "console.log(msgData.html";
  let teststring = str;
  for (
    let i = 0;
    i < superUserDetails.customFieldsContact.length;
    i++
  ) {
    var str1 =
      "\\#\\[contact." +
      superUserDetails.customFieldsContact[i].fieldName +
      "\\]";
    // console.log(str1);
    // console.log(contact.additionalFieldsArray[i]);
    var re = new RegExp(str1, "g");
    teststring = teststring.replace(
      re,
      contact.additionalFieldsArray[i]
    );
  }
  // str += ")";
  // console.log(teststring);
  str = teststring;
}

// sale additional fields
if (superUserDetails.customFieldsSale) {
  let str2 = str;
  for (
    let i = 0;
    i < superUserDetails.customFieldsSale.length;
    i++
  ) {
    var str1 =
      "\\#\\[sale." +
      superUserDetails.customFieldsSale[i].fieldName +
      "\\]";
    var re = new RegExp(str1, "g");
    str2 = str2.replace(re, sale.additionalFieldsArray[i]);
  }
  str = str2;
}
}
}
this.mailbody=str;
  this.mailsubject=template.subject



}
convertDate(date) {
  if(date){
      // console.log(date)
  // console.log(date.toDate())
  var d = new Date(date.toDate());
 var month
 var day
 var year
  // console.log(d)
  // console.log(d.getDate())
  // console.log(d.getMonth())
  // console.log(d.getFullYear())
  ( month = "" + (d.getMonth() + 1)),
    (day = "" + d.getDate()),
    (year = d.getFullYear());

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("-");
  }else return 'Date is not provided'
}

@HostListener('window:beforeunload')
  public ngOnDestroy():void{
  this.emailTemplateSubscription.unsubscribe()
}
}
