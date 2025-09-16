/**********************************************************************************
Description: Component is used to create, display, edit and delete email template types
             created under this user/his SuperUser
             and to cofigure SMTP Settings
             Only in web

             CHILD : Description :- email-template-type.html - CHILD POPUP TO SELECT TEMPLATE TYPE BEFORE CREATING A NEW TEMPLATE
                     Output :- Template type to create new email template
Inputs:
Outputs:
**********************************************************************************/
import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  OnDestroy,
  Inject,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AngularEditorComponent,
  AngularEditorConfig,
} from '@kolkov/angular-editor';
import { Subject } from 'rxjs';
import { EmailTemplateSettingsService } from './email-template-settings.service';
import { emailTemplateModel } from './email-template.model';
import { Location } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  customFieldNamesData,
  EmailTemplateTypes,
  EmailTemplateTypes_Invoicing,
  EmailTemplateTypes_leadManagement,
  Profile,
  UserAccessDetails,
} from 'src/app/data-models';
import { UserFeatures } from 'src/app/model/productfeatures.model';
import { Router } from '@angular/router';
import { UploadFilesComponent } from 'src/app/upload-files/upload-files.component';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-email-template-settings',
  templateUrl: './email-template-settings.component.html',
  styleUrls: ['./email-template-settings.component.scss'],
})
export class EmailTemplateSettingsComponent implements OnInit, OnDestroy {
  @ViewChild('editor', { static: false }) editor: AngularEditorComponent;

  private onDestroy$: Subject<void> = new Subject<void>(); //ngOndestroy variable

  progressBarStatus: Boolean = false; //progressBarStatus

  sid: string; //SuperUserId
  templateId: string; //id of a particular template created
  templateName: string = ''; //name of the selected template if a template is selected
  tempType: string; //type of the selected template if a template is selected
  subject: string = ''; //subject of the selected template if a template is selected
  body: string = ''; //body of the selected template if a template is selected
  emailTemplateArray = []; //email tem plates subscibing is saved in this array
  templateNameArray = []; //template names are saved in this array
  emailTemplate: emailTemplateModel; //variable holds the all datat of a particular template selected
  templateDisp: boolean = false; //only if we select a template, this var becomes true and thus template will get displayed
  editMode: boolean = false; //edit button function is controlled by this variable
  userId: string; //logged in users id
  oninit: Boolean = true; //oninit buttons lijke edit and delete is hiding by checking this variable
  usrProfileData: UserAccessDetails; //user profile
  notEdit: boolean = true; //restrict direct routes by checking access
  superUserData: Profile; //superuser profile variable
  userData: Profile; //logged in users profile

  // output string variable after adding additional field fieldnames to be added with other field options
  output = ''; //for contact
  outputSale = ''; //for sale
  outputService = ''; //for service
  outputEst = ''; //for estimate
  outputQuot = ''; //for quotation
  outputInv = ''; //for invoice
  outputColl = ''; //for collection

  angEditorContent: string; //variable hold data of angular editor innerHTML

  editorConfig: AngularEditorConfig = {
    maxHeight: '450px',
    editable: true,
    minHeight: '300px',
    translate: 'yes',
    toolbarHiddenButtons: [[], ['fontSize', 'insertImage', 'insertVideo']],
  }; //editable is true after clicking edit template button

  editorConfig1: AngularEditorConfig = {
    maxHeight: '450px',
    editable: false,
    minHeight: '300px',
    translate: 'yes',
    toolbarHiddenButtons: [[], ['fontSize', 'insertImage', 'insertVideo']],
  }; //default case editor is not ediatble

  userPlan: UserFeatures;

  // variables for SMTP settings
  mailId: string = '';
  password: string = '';
  SMTPUrl: string = '';
  smtpServer: string = '';
  provider: string = '';
  port: string = '';
  SMTPpresent: Boolean = false;
  encryption: Boolean;
  editEnable: Boolean;
  hide: Boolean = true;
  fieldNames: any;
  plan: any;

  constructor(
    private _snackBar: MatSnackBar,
    private db: EmailTemplateSettingsService,
    private location: Location,
    public commonService: CommonService,
    public dialog: MatDialog,
    private router: Router,
    public networkCheck: NetworkCheckService
  ) {}

  ngOnInit(): void {
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        if (allData) {
          this.userData = allData.userDetails; //fetch logged in users data from commonservice to check for account type
          this.userId = allData.userId; //fetch logged in users id from commonservice
          this.sid = this.userData.superUserId;
          //get the details of user profile assigned to the user to check access control
          this.usrProfileData = allData.usrProfileData;

          if (this.usrProfileData) {
            if (this.usrProfileData.isCheckedSett == false) {
              this.notEdit = true;
            } else {
              if (this.usrProfileData.settView == false) {
                this.notEdit = true;
              } else {
                this.notEdit = false;
              }
            }
          }

          // check plan restriction and thus block direct Route
          this.superUserData = allData.superUserDetails;
          this.plan = allData.superUserDetails.plan;
          if (this.superUserData) {
            this.fieldNames = this.superUserData.fieldNames;
            //getting the userplan based features
            this.userPlan = this.commonService.getUserPlan();
          }
          if (this.sid) {
            // before assigning, ensure empty string
            this.output = '';
            this.outputSale = '';
            this.outputService = '';
            this.outputEst = '';
            this.outputQuot = '';
            this.outputInv = '';
            this.outputColl = '';

            // contact addi field
            if (this.superUserData.customFieldsContact) {
              const customContArray =
                this.superUserData.customFieldsContact.filter((e) => {
                  return e.isActive == true;
                });
              // contact addirional field extraction
              const newArray = customContArray.map(({ fieldName }) => ({
                fieldName,
              }));

              for (let i = 0; i < newArray.length; i++) {
                this.output += `<option value="[contact.${newArray[i].fieldName}]">${newArray[i].fieldName}</option>`;
              }
            }

            // sale addi field
            if (this.superUserData.customFieldsSale) {
              const customfieldsaleArray =
                this.superUserData.customFieldsSale.filter((e) => {
                  return e.isActive == true;
                });
              // sale additional field extraction
              const newArraySale = customfieldsaleArray.map(
                ({ fieldName }) => ({
                  fieldName,
                })
              );

              for (let i = 0; i < newArraySale.length; i++) {
                this.outputSale += `<option value="[sale.${newArraySale[i].fieldName}]">${newArraySale[i].fieldName}</option>`;
              }
            }

            // service addi field
            if (this.superUserData.customFieldsService) {
              const customfieldserviceArray =
              this.superUserData.customFieldsService.filter((e) => {
                return e.isActive == true;
              });
              // sale additional field extraction
              let newArrayService = customfieldserviceArray.map(
                ({ fieldName }) => ({
                  fieldName,
                })
              );

              for (let i = 0; i < newArrayService.length; i++) {
                this.outputService += `<option value="[service.${newArrayService[i].fieldName}]">${newArrayService[i].fieldName}</option>`;
              }
            }

            // est addi field
            if (this.superUserData.customFieldsEstimate) {
              const customEstArray =
                this.superUserData.customFieldsEstimate.filter((e) => {
                  return e.isActive == true;
                });
              // contact addirional field extraction
              const newArrayEst = customEstArray.map(({ fieldName }) => ({
                fieldName,
              }));

              for (let i = 0; i < newArrayEst.length; i++) {
                this.outputEst += `<option value="[estimate.${newArrayEst[i].fieldName}]">${newArrayEst[i].fieldName}</option>`;
              }
            }

            // quot addi field
            if (this.superUserData.customFieldsQuotation) {
              const customQuotArray =
                this.superUserData.customFieldsQuotation.filter((e) => {
                  return e.isActive == true;
                });
              // contact addirional field extraction
              const newArrayQuot = customQuotArray.map(({ fieldName }) => ({
                fieldName,
              }));

              for (let i = 0; i < newArrayQuot.length; i++) {
                this.outputQuot += `<option value="[quotation.${newArrayQuot[i].fieldName}]">${newArrayQuot[i].fieldName}</option>`;
              }
            }

            // inv addi field
            if (this.superUserData.customFieldsInvoices) {
              const customInvArray =
                this.superUserData.customFieldsInvoices.filter((e) => {
                  return e.isActive == true;
                });
              // contact addirional field extraction
              const newArrayInv = customInvArray.map(({ fieldName }) => ({
                fieldName,
              }));

              for (let i = 0; i < newArrayInv.length; i++) {
                this.outputInv += `<option value="[invoice.${newArrayInv[i].fieldName}]">${newArrayInv[i].fieldName}</option>`;
              }
            }

            // coll addi field
            if (this.superUserData.customFieldsPayment) {
              const customCollArray =
                this.superUserData.customFieldsPayment.filter((e) => {
                  return e.isActive == true;
                });
              // contact addirional field extraction
              const newArrayColl = customCollArray.map(({ fieldName }) => ({
                fieldName,
              }));

              for (let i = 0; i < newArrayColl.length; i++) {
                this.outputColl += `<option value="[collection.${newArrayColl[i].fieldName}]">${newArrayColl[i].fieldName}</option>`;
              }
            }

            // read email templates using superuserid
            this.db
              .getEmailTemplates(this.sid)
              .pipe(takeUntil(this.onDestroy$))
              .subscribe((data) => {
                this.emailTemplateArray = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as emailTemplateModel;
                });

                this.getSMTP();
                //based on user plan configuration, allow only contact templates
                if(this.plan == 'leadManagement'){
                  this.emailTemplateArray = this.emailTemplateArray.filter(type => type.templateType == "Contact")
                }
                //based on user plan configuration, allow only contact and sale doc templates
                if(this.plan == 'invoicing'){
                  this.emailTemplateArray = this.emailTemplateArray.filter(type => type.templateType == "Contact" || type.templateType == "Estimate" || type.templateType == "Quotation" || type.templateType == "Invoice")
                }
                // templateNames are stored in an array
                this.templateNameArray = [];
                for (let i = 0; i < this.emailTemplateArray.length; i++) {
                  this.templateNameArray.push(
                    this.emailTemplateArray[i].templateName
                  );
                }
                this.progressBarStatus = true;
              });
          }
        }
      });
  }
  dispalyType(type) {
    let value = '';
    if (type === 'Contact') {
      value = this.fieldNames.fieldNameContact
        ? this.fieldNames.fieldNameContact
        : 'Contact';
    } else if (type === 'Sale') {
      value = this.fieldNames.fieldNameSale
        ? this.fieldNames.fieldNameSale
        : 'Sale';
    } else if (type === 'Service') {
      value = this.fieldNames.fieldNameService
        ? this.fieldNames.fieldNameService
        : 'Support';
    } else if (type === 'Estimate') {
      value = this.fieldNames.fieldNameEstimate
        ? this.fieldNames.fieldNameEstimate
        : 'Estimate';
    } else if (type === 'Quotation') {
      value = this.fieldNames.fieldNameQuotation
        ? this.fieldNames.fieldNameQuotation
        : 'Quotation';
    } else if (type === 'Invoice') {
      value = this.fieldNames.fieldNameInvoice
        ? this.fieldNames.fieldNameInvoice
        : 'Invoice';
    } else if (type === 'Collection') {
      value = this.fieldNames.fieldNameCollection
        ? this.fieldNames.fieldNameCollection
        : 'Collection';
    }
    return value;
  }
  getSMTP() {
    this.db
      .getSMTP(this.sid)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        if (data) {
          this.SMTPpresent = true;
          this.editEnable = false;
          this.provider = data.type ? data.type : 'mailService';
          if (this.provider == 'mailService') {
            this.SMTPUrl = data.SMTP.SMTPUrl ? data.SMTP.SMTPUrl : data.SMTP;
            this.mailId = data.From ? data.From : '';
          }
          if (this.provider == 'personalMail') {
            this.smtpServer = data.SMTP.host;
            this.port = data.SMTP.port;
            this.mailId = data.SMTP.auth.user;
            this.password = data.SMTP.auth.pass;
            this.encryption = data.SMTP.secure;
          }
        } else this.editEnable = true;
      });
  }
  // create new template
  addTemplate() {
    // angular-editors content is saved to a local variable
    this.angEditorContent = document.getElementsByClassName(
      'angular-editor-textarea'
    )[0].innerHTML;

    // checking all fields and also size, then write to DB
    if (this.templateName == '' || this.subject == '' || this.body == '') {
      this._snackBar.open('All fields are mandatory', '', {
        duration: 500,
      });
    } else if (this.angEditorContent.length > 950000) {
      this._snackBar.open('Content size limit exceeds 1MB', '', {
        duration: 500,
      });
    } else {
      this.body = this.angEditorContent;
      this.templateDisp = false;
      this.editMode = false;
      let newTemplate = {
        templateName: this.templateName,
        subject: this.subject,
        body: this.body,
        templateType: this.tempType,
      };
      this.db
        .create(this.sid, newTemplate)
        .then((res) => {
          this.templateDisp = false;
          this._snackBar.open('New Email Template added', '', {
            duration: 500,
          });
        })
        .catch((e) => {
          this._snackBar.open(e, '', {
            duration: 2000,
          });
        });
      this.cancel();
      this.oninit = true;
    }
  }
  // update template
  updateTemplate() {
    this.angEditorContent = document.getElementsByClassName(
      'angular-editor-textarea'
    )[0].innerHTML;

    // check for all fields and size, then write to DB
    if (this.templateName == '' || this.subject == '' || this.body == '') {
      this._snackBar.open('All fields are mandatory', '', {
        duration: 500,
      });
    } else if (this.angEditorContent.length > 950000) {
      this._snackBar.open('Content size limit exceeds 1MB', '', {
        duration: 500,
      });
    } else {
      this.body = this.angEditorContent;
      this.templateDisp = false;
      this.editMode = false;
      if (!this.tempType) {
        this.tempType = 'Template not added';
      }
      this.db.updateTemplate(
        this.sid,
        this.templateId,
        this.templateName,
        this.subject,
        this.body,
        this.tempType
      );

      this._snackBar.open('Template updated', '', {
        duration: 500,
      });

      this.templateDisp = false;
      this.cancel();
      this.oninit = true;
    }
  }
  // if a particular template is selected to dis[play its values and to show edit and delete buttons]
  selectTemplate(s) {
    this.templateDisp = true;
    for (let i = 0; i < this.emailTemplateArray.length; i++) {
      if (this.emailTemplateArray[i].id == s) {
        // assign the selected ones values to fields
        this.templateName = this.emailTemplateArray[i].templateName;
        this.subject = this.emailTemplateArray[i].subject;
        this.body = this.emailTemplateArray[i].body;
        this.templateId = this.emailTemplateArray[i].id;
        this.tempType = this.emailTemplateArray[i].templateType;
      }
    }
  }
  // clearing all input fields
  cancel() {
    this.templateName = '';
    this.subject = '';
    this.body = '';
    this.tempType = '';
  }
  // resetting all to default values
  onCancel() {
    this.cancel();
    this.oninit = true;
    this.editMode = false;
    this.templateDisp = false;
  }
  onUploadFile() {
    const dialogRef = this.dialog.open(UploadFilesComponent, {
      width: '800px',
      data: 'opened as dialog',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
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
  // if edit button is clicked enabling edit template function
  edit() {
    this.editMode = true;
    this.templateDisp = false;
    this.oninit = false;
  }
  // delete selected email template
  delete() {
    const dialogRef = this.dialog.open(DeleteConfirmationEmail, {
      width: '400px',
      data: {
        templateName: this.templateName,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          if (result == 'delete') {
            this.templateDisp = false;
            this.db.deleteTemplate(this.sid, this.templateId);

            this._snackBar.open('Template deleted', '', {
              duration: 500,
            });

            this.cancel();
            this.oninit = true;
          }
        }
      });
  }
  onBack() {
    this.location.back();
  }
  //functiom to save the SMTP settings
  saveSMTP() {
    var SMTP: any = {};
    if (this.provider == 'personalMail') {
      SMTP = {
        host: this.smtpServer,
        port: this.port,
        secure: this.encryption,
        auth: {
          user: this.mailId,
          pass: this.password,
        },
      };
      if (this.encryption == false) {
        SMTP.tls = {
          ciphers: 'SSLv3',
        };
      }
      this.db
        .saveSMTP(this.sid, { SMTP: SMTP, type: this.provider })
        .then(() => {
          this.editEnable = false;
        });
    } else if (this.provider == 'mailService') {
      this.db
        .saveSMTP(this.sid, {
          SMTP: this.SMTPUrl,
          From: this.mailId,
          type: this.provider,
        })
        .then(() => {
          this.editEnable = false;
        });
    }
  }
  // function to test the current setting
  testSMTP() {
    var SMTP: any = {};
    if (this.provider == 'personalMail') {
      SMTP = {
        host: this.smtpServer,
        port: this.port,
        secure: this.encryption,
        auth: {
          user: this.mailId,
          pass: this.password,
        },
      };
      if (this.encryption == false) {
        SMTP.tls = {
          ciphers: 'SSLv3',
        };
      }
      this.db
        .testSMTP({
          from: SMTP,
          to: this.mailId,
          subject: 'test mail',
          html: 'testing smtp settings from zenys app',
        })
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {});
    } else if (this.provider == 'mailService') {
      this.db
        .testSMTP({
          from: this.SMTPUrl,
          to: this.mailId,
          subject: 'test mail',
          html: 'testing smtp settings from zenys app',
        })
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {});
    }
  }
  cancelSMTP() {
    this.getSMTP();
  }
  // new email template creating function
  createTemplate() {
    const dialogRef = this.dialog.open(EmailTemplateType, {
      width: '400px',
      data: {
        fieldNames: this.fieldNames,
        userPlan: this.plan
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.templateName = '';
          this.subject = '';
          this.body = '';
          this.editMode = false;
          this.templateDisp = false;
          this.oninit = false;
          this.tempType = result;
        } else {
          this.cancel();
          this.oninit = true;
        }
      });
  }

  exportTojson() {
    // exportData is your array which you want to dowanload as json and sample.json is your file name, customize the below lines as per your need.
    let exportData = this.emailTemplateArray;
    return saveAs(
      new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }),
      'emailTemplates.json'
    );
  }

  // function to remove the dropdown appeared with '#' in angularEdoitor
  functionChanged(value) {
    var text = value.target.value;

    if (value.target.value) {
      var selected = document.getElementById('mySelect');

      selected.remove();
    }
    var sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      var range = sel.getRangeAt(0);
      range.insertNode(document.createTextNode(text));
    }
  }
  // SMTP edit enabling fn
  toggleEdit() {
    this.editEnable = true;
  }
  // keyup event listening for '#' in angular editor
  onKeyup(event) {
    var templateType = this.tempType;
    var select = document.createElement('SELECT');
    select.id = 'mySelect';
    select.onchange = this.functionChanged;

    var contactOptions = `
    <optgroup label="Contact">
      <option value="[contact.Company Name]">Company Name</option>
      <option value="[contact.First Name]">First Name</option>
      <option value="[contact.Second Name]">Second Name</option>
      <option value="[contact.Contact No]">Contact No</option>
      <option value="[contact.Email]">Email</option>
      <option value="[contact.Priority]">Priority</option>
      <option value="[contact.Status]">Status</option>
      <option value="[contact.Assigned To]">Assigned To</option>${this.output}
    </optgroup>
    <optgroup label="Assigned To User">
      <option value="[user.First Name]">First name</option>
      <option value="[user.Last Name]">Last Name</option>
      <option value="[user.Contact No]">Contact No</option>
      <option value="[user.Email]">Email</option>
    </optgroup>
    `;

    var saleOptions = `
    <optgroup label="Sale">
      <option value="[sale.Sale Title]">Sale Title</option>
      <option value="[sale.Estimated Value]">Estimated Value</option>
      <option value="[sale.Start Date]">Start Date</option>
      <option value="[sale.Expected Completion Date]">Expected Completion Date</option>
      <option value="[sale.Stage]">Stage</option>
      <option value="[sale.Priority]">Priority</option>
      <option value="[sale.Assigned To]">Assigned To</option>
      <option value="[sale.Description]">Description</option>
      ${this.outputSale}
    </optgroup>
    ${contactOptions}
    `;

    var serviceOptions = `
    <optgroup label="Service">
      <option value="[service.Service Title]">Service Title</option>
      <option value="[service.Start Date]">Start Date</option>
      <option value="[service.Expected Completion Date]">Expected Completion Date</option>
      <option value="[service.Stage]">Stage</option>
      <option value="[service.Priority]">Priority</option>
      <option value="[service.Assigned To]">Assigned To</option>
      <option value="[service.Description]">Description</option>
      ${this.outputService}
    </optgroup>
    ${contactOptions}
    `;

    if (templateType == 'Contact') {
      select.innerHTML = `<option value=" ">Select Option</option>${contactOptions}`;
    } else if (templateType == 'Sale') {
      select.innerHTML = `<option value=" ">Select Option</option>${saleOptions}`;
    } else if (templateType == 'Service') {
      select.innerHTML = `<option value=" ">Select Option</option>${serviceOptions}`;
    } else if (templateType == 'Estimate') {
      select.innerHTML = `
      <option value=" ">Select Option</option>
      <optgroup label="Estimate">
      <option value="[estimate.Date]">Date</option>
      <option value="[estimate.Doc Prefix]">Doc Prefix</option>
      <option value="[estimate.Doc No]">Doc No</option>
      <option value="[estimate.Validity]">Validity</option>
      <option value="[estimate.Currency]">Currency</option>
      <option value="[estimate.Bank Details]">Bank Details</option>
      <option value="[estimate.Amount Including Tax]">Amount Including Tax</option>
      <option value="[estimate.Sale]">Sale</option>
      <option value="[estimate.Customer]">Customer</option>
      <option value="[estimate.Notes]">Notes</option>
      <option value="[estimate.Amount Collected]">Amount Collected</option>
      <option value="[estimate.Doc URL]">Document URL</option>
      ${this.outputEst}
      </optgroup>
      ${saleOptions}
      `;
    } else if (templateType == 'Quotation') {
      select.innerHTML = `
      <option value=" ">Select Option</option>
      <optgroup label="Quotation">
      <option value="[quotation.Date]">Date</option>
      <option value="[quotation.Doc Prefix]">Doc Prefix</option>
      <option value="[quotation.Doc No]">Doc No</option>
      <option value="[quotation.Validity]">Validity</option>
      <option value="[quotation.Currency]">Currency</option>
      <option value="[quotation.Bank Details]">Bank Details</option>
      <option value="[quotation.Amount Including Tax]">Amount Including Tax</option>
      <option value="[quotation.Sale]">Sale</option>
      <option value="[quotation.Customer]">Customer</option>
      <option value="[quotation.Notes]">Notes</option>
      <option value="[quotation.Amount Collected]">Amount Collected</option>
      <option value="[quotation.Doc URL]">Document URL</option>
      ${this.outputQuot}
      </optgroup>
      ${saleOptions}
      `;
    } else if (templateType == 'Invoice') {
      select.innerHTML = `
      <option value=" ">Select Option</option>
      <optgroup label="Invoice">
      <option value="[invoice.Date]">Date</option>
      <option value="[invoice.Doc Prefix]">Doc Prefix</option>
      <option value="[invoice.Doc No]">Doc No</option>
      <option value="[invoice.Due Date]">Due Date</option>
      <option value="[invoice.Currency]">Currency</option>
      <option value="[invoice.Bank Details]">Bank Details</option>
      <option value="[invoice.Amount Including Tax]">Amount Including Tax</option>
      <option value="[invoice.Sale]">Sale</option>
      <option value="[invoice.Customer]">Customer</option>
      <option value="[invoice.Notes]">Notes</option>
      <option value="[invoice.Amount Collected]">Amount Collected</option>
      <option value="[invoice.Doc URL]">Document URL</option>
      ${this.outputInv}
      </optgroup>
      ${saleOptions}
      `;
    } else if (templateType == 'Collection') {
      select.innerHTML = `
      <optgroup label="Collection">
      <option value=" ">Select</option>
      <option value="[collection.Payment Date]">Payment Date</option>
      <option value="[collection.Payment Mode]">Payment Mode</option>
      <option value="[collection.Payment Type]">Payment Type</option>
      <option value="[collection.Sale]">Sale</option>
      <option value="[collection.Customer]">Customer</option>
      <option value="[collection.Amount Collected]">Amount Collected</option>
      <option value="[collection.Doc Prefix and No]">Invoice Prefix and No</option>
      <option value="[collection.Currency]">Currency</option>
      <option value="[collection.Cheque details]">Cheque details</option>
      ${this.outputColl}
      </optgroup>
      ${saleOptions}
      `;
    }

    if (event.key == '#') {
      var sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        var range = sel.getRangeAt(0);
        range.insertNode(select);
      }
    }
  }
  // on destroy
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
//CHILD POPUP TO SELECT TEMPLATE TYPE BEFORE CREATING A NEW TEMPLATE
@Component({
  selector: 'email-template-type',
  templateUrl: 'email-template-type.html',
  styleUrls: ['./email-template-settings.component.scss'],
})
export class EmailTemplateType {
  templateType: string;
  tempTypeList = [];
  tempType: EmailTemplateTypes = null;

  constructor(
    public dialogRef: MatDialogRef<EmailTemplateType>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    const typeArray = this.gettType();
    let arr;
    //console.log(this.data.userPlan)
    //based on user plan configuration, remove sale and service templates
    if(this.data.userPlan == 'invoicing') {
      arr = [
        this.data.fieldNames.fieldNameContact,
        this.data.fieldNames.fieldNameEstimate,
        this.data.fieldNames.fieldNameQuotation,
        this.data.fieldNames.fieldNameInvoice
      ];
    } else if(this.data.userPlan == 'leadManagement') {
      arr = [
        this.data.fieldNames.fieldNameContact
      ];
    } else {
      arr = [
        this.data.fieldNames.fieldNameContact,
        this.data.fieldNames.fieldNameSale,
        this.data.fieldNames.fieldNameService,
        this.data.fieldNames.fieldNameEstimate,
        this.data.fieldNames.fieldNameQuotation,
        this.data.fieldNames.fieldNameInvoice,
        this.data.fieldNames.fieldNameCollection,
      ];
    }

    // this.tempTypeList = this.gettType();
    // console.log(this.data.fieldNames);
    this.tempTypeList = arr.map(function (x, i) {
      return { display: x, value: typeArray[i] };
    });
    // console.log(this.tempTypeList);
  }
  // fetching template types saved in data-model.ts
  gettType(): string[] {
    //based on user plan configuration, remove sale and service templates
    if(this.data.userPlan == 'invoicing') {
      this.tempType = new EmailTemplateTypes_Invoicing();
    } else if(this.data.userPlan == 'leadManagement') {
      this.tempType = new EmailTemplateTypes_leadManagement();
    } else {
      this.tempType = new EmailTemplateTypes();
    }
    return this.tempType.templateTypes;
  }
  // cancel button function of popup
  onNoClick(): void {
    this.dialogRef.close();
  }
}
// delete confirmation
@Component({
  selector: 'delete-confirmation-email',
  templateUrl: 'delete-confirmation-email.html',
  styleUrls: ['./email-template-settings.component.scss'],
})
export class DeleteConfirmationEmail {
  delete = 'delete';
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationEmail>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
