
/*----------------------------------------------------
Description : For payment due notification setting
              Can activate sms and email here
              can choose sms and email template for invoice
              for getting acces to sms  'smsEnabled' boolean must be true now it should add to db for access it

------------------------------------------------------------*/
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import { messageTemplateModel } from 'src/app/data-models';
import { DocumentsetttingsService } from '../documentsettings/documentsetttings.service';
import { emailTemplateModel } from '../email-template-settings/email-template.model';

@Component({
  selector: 'app-payment-due',
  templateUrl: './payment-due.component.html',
  styleUrls: ['./payment-due.component.scss'],
})
export class PaymentDueComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  fieldNameContact: string = 'Contact'; // feild name for contact
  userId: string; //current user id
  isSmsEnabled: boolean = false; // sms enabled check
  smsActivated: boolean = false;// sms activate check
  emailActivated: boolean = false; // email activate check
  emailTemplates: emailTemplateModel[] = []; // email templates
  smsTemplates: messageTemplateModel[] = []; // sms templates
  selectedSmsTemplate: string; // selected sms template
  selectedEmailTemplate: string;// selected email template
  superUserId: string; // super user id
  selectedEmailTemplateName:string; // selected template name
  selectedSMSTemplateName:string; // selected template name
  accountType:string;
  constructor(
    public db: DocumentsetttingsService,
    private snack: MatSnackBar,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        if (allData) {
          if (allData.userDetails) {
            this.userId = allData.authDetails.uid;

            if (allData.superUserDetails.fieldNames) {
              this.fieldNameContact =
                allData.superUserDetails.fieldNames.fieldNameContact;
            }
            // superuserId assigning
            if (allData.userDetails.superUserId) {
              this.superUserId = allData.userDetails.superUserId;
            } else {
              //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
              this.superUserId = this.userId;
            }
            this.accountType=allData.userDetails.accountType
            if (allData.superUserDetails.smsEnabled) {
              this.isSmsEnabled = allData.superUserDetails.smsEnabled;
            }
            if (allData.superUserDetails.smsActivated) {
              this.smsActivated = allData.superUserDetails.smsActivated;
            }
            if (allData.superUserDetails.emailActivated) {
              this.emailActivated = allData.superUserDetails.emailActivated;
            }
            if (allData.superUserDetails.selectedSmsTemplate) {
              this.selectedSmsTemplate =
                allData.superUserDetails.selectedSmsTemplate;
            }
            if (allData.superUserDetails.selectedEmailTemplate) {
              this.selectedEmailTemplate =
                allData.superUserDetails.selectedEmailTemplate;
            }
            //read invoice email template
            this.db
              .getEmailTemplates(this.superUserId, 'Invoice')
              .pipe(takeUntil(this.onDestroy$))
              .subscribe((data) => {
                let doc = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as emailTemplateModel;
                });
                this.emailTemplates = doc;
                if(this.selectedEmailTemplate){
                  this.emailTemplates.forEach(element => {
                    if(element.id == this.selectedEmailTemplate){
                      this.selectedEmailTemplateName=element.templateName
                    }
                  });
                }
              });
              //read invoice sms template
            this.db
              .getSMSTemplates(this.superUserId, 'SMS', 'Invoice')
              .pipe(takeUntil(this.onDestroy$))
              .subscribe((data) => {
                let doc = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as messageTemplateModel;
                });
                this.smsTemplates = doc;
                if(this.selectedSmsTemplate){
                  this.smsTemplates.forEach(element => {
                    if(element.id == this.selectedSmsTemplate){
                      this.selectedSMSTemplateName=element.templateName
                    }
                  });
                }
              });
          }
        }
      });
  }
  // on destroy
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  smsTemplate() {
    // if template is selected add selected template and sms activate boolean to user
    if (this.selectedSmsTemplate) {
      this.db.smsTemplateUpdate(
        this.superUserId,
        this.smsActivated,
        this.selectedSmsTemplate
      ).then((res)=>{
        this.snack.open('Successfully Updated', '', {
          duration: 2000,
        });
      })
    } else {
      this.snack.open('Please Choose a Template', '', {
        duration: 2000,
      });
    }

  }
  emailTemplate() {
      // if template is selected add selected template and email activate boolean to user
    if (this.selectedEmailTemplate) {
      this.db.emailTemplateUpdate(
        this.superUserId,
        this.emailActivated,
        this.selectedEmailTemplate
      ).then((res)=>{
        this.snack.open('Successfully Updated', '', {
          duration: 2000,
        });
      })

    } else {
      this.snack.open('Please Choose a Template', '', {
        duration: 2000,
      });
    }

  }
  // on selecting template adding the template id to selectedSmsTemplate
  selectSmsTemplate(id) {
    this.selectedSmsTemplate = id;
  }
  // on selecting template adding the template id to selectedEmailTemplate
  selectEmailTemplate(id) {
    this.selectedEmailTemplate = id;
  }
}
