/**********************************************************************************
Description: Component is used to create, display, edit and delete message template types
             created under this user/his SuperUser
             Only in web


Inputs:
Outputs:
**********************************************************************************/
import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AngularEditorComponent,
  AngularEditorConfig,
} from '@kolkov/angular-editor';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import { MatDialog } from '@angular/material/dialog';
import {
  messageTemplateModel,
  Profile,
  SMSTemplateTypes,
  UserAccessDetails,
  waLanguages,
} from 'src/app/data-models';
import { UserFeatures } from 'src/app/model/productfeatures.model';
import { MessageTemplateTypeSelectComponent } from '../message-template-type-select/message-template-type-select.component';
import { MessageTemplateConfirmationComponent } from '../message-template-confirmation/message-template-confirmation.component';
import { MessgaeTemplateService } from './messgae-template.service';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadFilesComponent } from 'src/app/upload-files/upload-files.component';
import { LanguageModel } from '../../data-models';

@Component({
  selector: 'app-message-template',
  templateUrl: './message-template.component.html',
  styleUrls: ['./message-template.component.scss'],
})
export class MessageTemplateComponent implements OnInit, OnDestroy {
  @ViewChild('editor', { static: false }) editor: AngularEditorComponent;

  private onDestroy$: Subject<void> = new Subject<void>(); //ngOndestroy variable

  progressBarStatus: Boolean = false; //progressBarStatus

  superUserId: string; //SuperUserId
  templateId: string; //id of a particular template created
  templateName: string = ''; //name of the selected template if a template is selected
  smsApiTemplateId = ''; //sms api template id variable
  templateNameSpaceWa = ''; //whatsapp business api template name space
  tLangCode = ''; //whatsapp business api language codes
  tempType: string; //type of the selected template if a template is selected
  body: string = ''; //body of the selected template if a template is selected
  messageTemplateArray: messageTemplateModel[]; //email tem plates subscibing is saved in this array
  templateNameArray = []; //template names are saved in this array
  templateDisp: boolean = false; //only if we select a template, this var becomes true and thus template will get displayed
  editMode: boolean = false; //edit button function is controlled by this variable
  userId: string; //logged in users id
  oninit: Boolean = true; //oninit buttons lijke edit and delete is hiding by checking this variable
  usrProfileData: UserAccessDetails; //user profile
  notEdit: boolean = true; //restrict direct routes by checking access
  superUserData: Profile; //superuser profile variable
  userData: Profile; //logged in users profile
  smsTempFor: string = ''; //selected SMS template for
  output = ''; //var holds options for contact additional fields
  outputSale = ''; //var holds options for sale additional fields
  outputService = '';
  outputEst = '';
  outputQuot = '';
  outputInv = '';
  outputColl = '';

  angEditorContent: string; //variable hold data of angular editor innerHTML

  editorConfig: AngularEditorConfig = {
    maxHeight: '450px',
    editable: true,
    minHeight: '300px',
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
    toolbarHiddenButtons: [[], ['fontSize', 'insertImage', 'insertVideo']],
  }; //editable is true after clicking edit template button

  editorConfig1: AngularEditorConfig = {
    maxHeight: '450px',
    editable: false,
    minHeight: '300px',
    enableToolbar: false,
    showToolbar: false,
    translate: 'yes',
    toolbarHiddenButtons: [[], ['fontSize', 'insertImage', 'insertVideo']],
  }; //default case editor is not ediatble

  userPlan: UserFeatures;
  networkConnection: boolean; // checks network connection
  fieldNames: any;
  plan: any;
  crudForm: FormGroup; //form for sms settings
  crudWaForm: FormGroup; //form for whatsapp settings
  // form datas for sms api activation
  formData = {
    smsApiUserName: '',
    smsApiPwd: '',
    smsApiSenderId: '',
    smsApiEntityId: '',
  };
  // formdata for whatsapp api integration
  formWaData = {
    waBusProvider: '',
    waBusAuthKey: '',
    waBusURL: '',
    waBusIntId: '',
    waBusAppId: '',
    waBusSourceNo: '',
  };
  image_link = ''; //image url saved with message template
  document_link = ''; //doc url saved with message template
  document_name = ''; //doc name saved with message template
  video_link = ''; //video url saved with message template
  showImageInp = false; //boolean to show image input fields
  showVideoInp = false; //boolean to show video input fields
  showDocInp = false; //boolean to show doc input fields

  languages: LanguageModel[] = waLanguages;
  smsType: SMSTemplateTypes = null;
  smsTypeList = [];
  smsTempForfieldName = '';

  constructor(
    private _snackBar: MatSnackBar,
    private db: MessgaeTemplateService,
    private location: Location,
    public commonService: CommonService,
    public dialog: MatDialog,
    public networkCheck: NetworkCheckService,
    private fb: FormBuilder
  ) {}

  // fetching SMS template types saved in data-model.ts - contact,sale,sales doc, task
  getSMStType(): string[] {
    this.smsType = new SMSTemplateTypes();
    return this.smsType.templateTypes;
  }

  ngOnInit(): void {
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        let authDetails = allData.authDetails; // bind auth details
        if (authDetails) {
          this.userId = authDetails.uid; // bind user id
          this.userData = allData.userDetails; // bind current user details
          this.superUserId = allData.userDetails.superUserId;
          if (this.userData) {
            this.usrProfileData = allData.usrProfileData;
            if (this.usrProfileData) {
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
            }
            // check plan restriction and thus block direct Route
            this.superUserData = allData.superUserDetails;
            this.plan = allData.superUserDetails.plan;
            this.fieldNames = this.superUserData.fieldNames;

            const typeArray = this.getSMStType();
            const arr = [
              this.fieldNames.fieldNameContact,
              this.fieldNames.fieldNameSale,
              this.fieldNames.fieldNameService,
              this.fieldNames.fieldNameEstimate,
              this.fieldNames.fieldNameQuotation,
              this.fieldNames.fieldNameInvoice,
              this.fieldNames.fieldNameCollection,
            ];

            this.smsTypeList = arr.map(function (x, i) {
              return { display: x, value: typeArray[i] };
            });

            this.output = '';
            this.outputSale = '';
            this.outputService = '';
            this.outputEst = '';
            this.outputQuot = '';
            this.outputInv = '';
            this.outputColl = '';

            // contact addi fields
            if (this.superUserData.customFieldsContact) {
              const custContArray =
                this.superUserData.customFieldsContact.filter((e) => {
                  return e.isActive == true;
                });
              // contact addirional field extraction
              const newArray = custContArray.map(({ fieldName }) => ({
                fieldName,
              }));

              for (let i = 0; i < newArray.length; i++) {
                this.output += `<option value="[contact.${newArray[i].fieldName}]">${newArray[i].fieldName}</option>`;
              }
            }

            // sale addi fields
            if (this.superUserData.customFieldsSale) {
              const custSaleArray = this.superUserData.customFieldsSale.filter(
                (e) => {
                  return e.isActive == true;
                }
              );
              // sale additional field extraction
              let newArraySale = custSaleArray.map(({ fieldName }) => ({
                fieldName,
              }));

              for (let i = 0; i < newArraySale.length; i++) {
                this.outputSale += `<option value="[sale.${newArraySale[i].fieldName}]">${newArraySale[i].fieldName}</option>`;
              }
            }

            // service addi fields
            if (this.superUserData.customFieldsService) {
              const custServiceArray =
                this.superUserData.customFieldsService.filter((e) => {
                  return e.isActive == true;
                });
              // sale additional field extraction
              let newArrayService = custServiceArray.map(({ fieldName }) => ({
                fieldName,
              }));

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

            this.userPlan = this.commonService.userPlan; //getting the userplan based features
            // read message templates using superuserid
            this.db
              .getMessageTemplates(this.superUserId)
              .pipe(takeUntil(this.onDestroy$))
              .subscribe((data) => {
                this.messageTemplateArray = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as messageTemplateModel;
                });

                // templateNames are stored in an array
                this.templateNameArray = [];
                for (let i = 0; i < this.messageTemplateArray.length; i++) {
                  this.templateNameArray.push(
                    this.messageTemplateArray[i].templateName
                  );
                }
                this.progressBarStatus = true;
              });

            // formdata population from superuser deatils
            this.formData.smsApiUserName = this.superUserData.smsApiUserName
              ? this.superUserData.smsApiUserName
              : '';
            this.formData.smsApiPwd = this.superUserData.smsApiPwd
              ? this.superUserData.smsApiPwd
              : '';
            this.formData.smsApiEntityId = this.superUserData.smsApiEntityId
              ? this.superUserData.smsApiEntityId
              : '';
            this.formData.smsApiSenderId = this.superUserData.smsApiSenderId
              ? this.superUserData.smsApiSenderId
              : '';

            this.formWaData.waBusProvider = this.superUserData.waBusProvider
              ? this.superUserData.waBusProvider
              : '';
            this.formWaData.waBusAuthKey = this.superUserData.waBusAuthKey
              ? this.superUserData.waBusAuthKey
              : '';
            this.formWaData.waBusURL = this.superUserData.waBusURL
              ? this.superUserData.waBusURL
              : '';
            this.formWaData.waBusIntId = this.superUserData.waBusIntId
              ? this.superUserData.waBusIntId
              : '';
            this.formWaData.waBusAppId = this.superUserData.waBusAppId
              ? this.superUserData.waBusAppId
              : '';
            this.formWaData.waBusSourceNo = this.superUserData.waBusSourceNo
              ? this.superUserData.waBusSourceNo
              : '';

            if (this.formData) {
              // reactive form declaration
              this.crudForm = this.fb.group({
                smsApiUserName: [
                  this.formData.smsApiUserName,
                  [Validators.required],
                ],
                smsApiPwd: [this.formData.smsApiPwd, [Validators.required]],
                smsApiSenderId: [
                  this.formData.smsApiSenderId,
                  [Validators.required],
                ],
                smsApiEntityId: [
                  this.formData.smsApiEntityId,
                  [Validators.required],
                ],
              });
            }

            if (this.formWaData) {
              this.crudWaForm = this.fb.group({
                waBusProvider: [
                  this.formWaData.waBusProvider,
                  [Validators.required],
                ],
                waBusAuthKey: [
                  this.formWaData.waBusAuthKey,
                  [Validators.required],
                ],
                waBusURL: [this.formWaData.waBusURL, [Validators.required]],
                waBusIntId: [this.formWaData.waBusIntId],
                waBusAppId: [this.formWaData.waBusAppId],
                waBusSourceNo: [this.formWaData.waBusSourceNo],
              });
            }
          }
        }
      });
  }
  providerSelected($event) {
    if ($event === 'moplet') {
      this.crudWaForm.get('waBusURL').setValue('https://api.panel.moplet.com'); //set the selected value
      this.crudWaForm.controls['waBusIntId'].setValidators(Validators.required);
      this.crudWaForm.controls['waBusAppId'].setValidators(Validators.required);
      this.crudWaForm.controls['waBusSourceNo'].setValue('');
    } else if ($event === 'gupshup') {
      this.crudWaForm
        .get('waBusURL')
        .setValue('http://api.gupshup.io/sm/api/v1/template/msg'); //set the selected value
      this.crudWaForm.controls['waBusSourceNo'].setValidators(
        Validators.required
      );
      this.crudWaForm.controls['waBusIntId'].setValue('');
      this.crudWaForm.controls['waBusAppId'].setValue('');
    }
  }
  // on submit sms settings form
  smsForm() {
    this.db
      .updateSmsApiSettings(
        this.superUserId,
        this.crudForm.value.smsApiUserName,
        this.crudForm.value.smsApiPwd,
        this.crudForm.value.smsApiSenderId,
        this.crudForm.value.smsApiEntityId
      )
      .then((resp) => {
        this._snackBar.open('Successfully updated', '', {
          duration: 2000,
        });
      })
      .catch((err) => {
        this._snackBar.open('Error occured!!', '', {
          duration: 2000,
        });
      });
  }
  // on submit whatsapp settings form
  waForm() {
    this.db
      .updateWaApiSettings(
        this.superUserId,
        this.crudWaForm.value.waBusProvider,
        this.crudWaForm.value.waBusAuthKey,
        this.crudWaForm.value.waBusURL,
        this.crudWaForm.value.waBusIntId,
        this.crudWaForm.value.waBusAppId,
        this.crudWaForm.value.waBusSourceNo
      )
      .then((resp) => {
        this._snackBar.open('Successfully updated', '', {
          duration: 2000,
        });
      })
      .catch((err) => {
        this._snackBar.open('Error occured!!', '', {
          duration: 2000,
        });
      });
  }
  // if file is uploaded from uploaded files
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
          if (result.msgData.type === 'image') {
            this.image_link = result.msgData.shortUrl;
          } else if (result.msgData.type === 'video') {
            this.video_link = result.msgData.shortUrl;
          } else if (
            result.msgData.type !== 'image' &&
            result.msgData.type !== 'video' &&
            result.msgData.type !== 'audio'
          ) {
            this.document_link = result.msgData.shortUrl;
            this.document_name = result.msgData.name;
          }
        }
      });
  }
  // clear video url added
  removeVideo() {
    this.video_link = '';
    this.showVideoInp = false;
  }
  // clear image url added
  removeImage() {
    this.image_link = '';
    this.showImageInp = false;
  }
  // clear doc details added
  removeDoc() {
    this.document_link = '';
    this.document_name = '';
    this.showDocInp = false;
  }
  // show image input field
  showIm() {
    this.showImageInp = true;
    this.showVideoInp = false;
    this.showDocInp = false;
  }
  // show video inp field
  showVid() {
    this.showImageInp = false;
    this.showVideoInp = true;
    this.showDocInp = false;
  }
  // show doc inp field
  showDoc() {
    this.showImageInp = false;
    this.showVideoInp = false;
    this.showDocInp = true;
  }
  // create new template
  addTemplate() {
    // angular-editors content is saved to a local variable
    this.angEditorContent = document.getElementsByClassName(
      'angular-editor-textarea'
    )[0].innerHTML;

    // checking all fields and also size, then write to DB
    // sms template id is checked only for SMS template type
    if (
      this.templateName == '' ||
      this.body == '' ||
      (this.tempType === 'SMS' && this.smsApiTemplateId == '')
    ) {
      this._snackBar.open('All fields are mandatory', 'Error!', {
        duration: 2000,
      });
    } else if (this.angEditorContent.length > 950000) {
      this._snackBar.open('Content size limit exceeds 1MB', '', {
        duration: 2000,
      });
    } else {
      this.body = this.angEditorContent;
      this.templateDisp = false;
      this.editMode = false;
      let newTemplate = {
        templateName: this.templateName,
        body: this.body,
        templateType: this.tempType,
        tempRecType: this.smsTempFor,
        smsApiTemplateId: this.smsApiTemplateId,
        templateNameSpaceWa: this.templateNameSpaceWa,
        tLangCode: this.tLangCode,
        image_link: this.image_link,
        video_link: this.video_link,
        document_link: this.document_link,
        document_name: this.document_name,
      };
      this.db
        .create(this.superUserId, newTemplate)
        .then((res) => {
          this.templateDisp = false;
          this._snackBar.open('New Message Template added', '', {
            duration: 2000,
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
    // sms template id is checked only for SMS template type
    if (
      this.templateName == '' ||
      this.body == '' ||
      (this.tempType === 'SMS' && this.smsApiTemplateId == '')
    ) {
      this._snackBar.open('All fields are mandatory', 'Error!', {
        duration: 2000,
      });
    } else if (this.angEditorContent.length > 950000) {
      this._snackBar.open('Content size limit exceeds 1MB', '', {
        duration: 2000,
      });
    } else {
      this.body = this.angEditorContent;
      this.templateDisp = false;
      this.editMode = false;
      if (!this.tempType) {
        this.tempType = 'Template not added';
      }
      if (!this.smsTempFor) {
        this.smsTempFor = 'Record type not added';
      }
      this.db.updateTemplate(
        this.superUserId,
        this.templateId,
        this.templateName,
        this.body,
        this.tempType,
        this.smsTempFor,
        this.smsApiTemplateId,
        this.templateNameSpaceWa,
        this.tLangCode,
        this.image_link,
        this.video_link,
        this.document_link,
        this.document_name
      );

      this._snackBar.open('Template updated', '', {
        duration: 2000,
      });

      this.templateDisp = false;
      this.cancel();
      this.oninit = true;
    }
  }
  // if a particular template is selected to dis[play its values and to show edit and delete buttons]
  selectTemplate(id) {
    this.templateDisp = true;
    for (let i = 0; i < this.messageTemplateArray.length; i++) {
      if (this.messageTemplateArray[i].id == id) {
        // assign the selected ones values to fields
        this.templateName = this.messageTemplateArray[i].templateName;
        this.body = this.messageTemplateArray[i].body;
        this.templateId = this.messageTemplateArray[i].id;
        this.tempType = this.messageTemplateArray[i].templateType;
        this.smsTempFor = this.messageTemplateArray[i].tempRecType;
        this.smsTempForfieldName = this.smsTypeList.find(
          (val) => val.value === this.smsTempFor
        )?.display;
        this.smsApiTemplateId = this.messageTemplateArray[i].smsApiTemplateId
          ? this.messageTemplateArray[i].smsApiTemplateId
          : '';
        this.templateNameSpaceWa = this.messageTemplateArray[i]
          .templateNameSpaceWa
          ? this.messageTemplateArray[i].templateNameSpaceWa
          : '';
        this.tLangCode = this.messageTemplateArray[i].tLangCode
          ? this.messageTemplateArray[i].tLangCode
          : '';
        this.image_link = this.messageTemplateArray[i].image_link
          ? this.messageTemplateArray[i].image_link
          : '';
        this.video_link = this.messageTemplateArray[i].video_link
          ? this.messageTemplateArray[i].video_link
          : '';
        this.document_link = this.messageTemplateArray[i].document_link
          ? this.messageTemplateArray[i].document_link
          : '';
        this.document_name = this.messageTemplateArray[i].document_name
          ? this.messageTemplateArray[i].document_name
          : '';
      }
    }
  }
  // clearing all input fields
  cancel() {
    this.templateName = '';
    this.body = '';
    this.tempType = '';
    this.smsTempFor = '';
    this.smsApiTemplateId = '';
    this.templateNameSpaceWa = '';
    this.tLangCode = '';
    this.image_link = '';
    this.video_link = '';
    this.document_link = '';
    this.document_name = '';
    this.smsTempForfieldName = '';
  }
  // resetting all to default values
  onCancel() {
    this.cancel();
    this.oninit = true;
    this.editMode = false;
    this.templateDisp = false;
  }
  // if edit button is clicked enabling edit template function
  edit() {
    this.editMode = true;
    this.templateDisp = false;
    this.oninit = false;
  }
  // delete selected email template
  delete() {
    const dialogRef = this.dialog.open(MessageTemplateConfirmationComponent, {
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
            this.db.deleteTemplate(this.superUserId, this.templateId);

            this._snackBar.open('Template deleted', '', {
              duration: 2000,
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
  // new email template creating function
  createTemplate() {
    const dialogRef = this.dialog.open(MessageTemplateTypeSelectComponent, {
      width: '400px',
      data: {
        fieldNames: this.fieldNames,
        userPlan : this.plan
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.templateName = '';
          this.body = '';
          this.smsApiTemplateId = '';
          this.editMode = false;
          this.templateDisp = false;
          this.oninit = false;
          this.tempType = result[0];
          this.smsTempFor = result[1];
          this.smsTempForfieldName = this.smsTypeList.find(
            (val) => val.value === this.smsTempFor
          )?.display;
        } else {
          this.cancel();
          this.oninit = true;
        }
      });
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

  // keyup event listening for '#' in angular editor
  onKeyup(event) {
    var templateType = this.smsTempFor;
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
  // for check network connection
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
}
