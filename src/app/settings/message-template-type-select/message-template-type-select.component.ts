import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageTemplateTypes, SMSTemplateTypes, SMSTemplateTypes_Invoicing, SMSTemplateTypes_leadManagement } from 'src/app/data-models';

@Component({
  selector: 'app-message-template-type-select',
  templateUrl: './message-template-type-select.component.html',
  styleUrls: ['./message-template-type-select.component.scss'],
})
export class MessageTemplateTypeSelectComponent implements OnInit {
  templateType: string;
  tempTypeList: string[] = [];
  tempType: MessageTemplateTypes = null;
  smsTempFor: string;
  smsType: SMSTemplateTypes = null;
  smsTypeList = [];

  constructor(
    public dialogRef: MatDialogRef<MessageTemplateTypeSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    const typeArray = this.getSMStType();
    let arr;
    //based on user plan configuration, remove sale and service templates
    if(this.data.userPlan == 'invoicing'){
      arr = [
        this.data.fieldNames.fieldNameContact,
        this.data.fieldNames.fieldNameEstimate,
        this.data.fieldNames.fieldNameQuotation,
        this.data.fieldNames.fieldNameInvoice
        
      ];
    } else if(this.data.userPlan == 'leadManagement'){
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
    //console.log(this.data.fieldNames);
    this.smsTypeList = arr.map(function (x, i) {
      return { display: x, value: typeArray[i] };
    });
    //console.log(this.smsTypeList);
    this.tempTypeList = this.gettType();
  }
  // fetching template types saved in data-model.ts-SMS or Whatsapp
  gettType(): string[] {
    this.tempType = new MessageTemplateTypes();
    return this.tempType.templateTypes;
  }
  // fetching SMS template types saved in data-model.ts - contact,sale,sales doc, task
  getSMStType(): string[] {

    //based on user plan configuration, remove sale and service templates
    if(this.data.userPlan == 'invoicing'){
      this.smsType = new SMSTemplateTypes_Invoicing();
    } else if(this.data.userPlan == 'leadManagement'){
      this.smsType = new SMSTemplateTypes_leadManagement();
    } else {
      this.smsType = new SMSTemplateTypes();
    }
    return this.smsType.templateTypes;
  }
  // cancel button function of popup
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}

}
