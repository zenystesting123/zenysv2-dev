import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../common.service';
import { docCreationLimits } from '../model/productfeatures.model';
export interface ModalData {
  firstName: string;
  fieldNameContact: string;
  fieldNameSale: string;
  fieldNameEstimate: string;
  fieldNameQuotation: string;
  fieldNameInvoice: string;
}
@Component({
  selector: 'app-free-user-popup',
  templateUrl: './free-user-popup.component.html',
  styleUrls: ['./free-user-popup.component.scss'],
})
export class FreeUserPopupComponent implements OnInit {
  Contact_monthly_limit: number = 0;
  Sales_monthly_limit: number = 0;
  Inv_monthly_limit: number = 0;
  Quote_monthly_limit: number = 0;
  Est_monthly_limit: number = 0;
  userName: string;
  fieldNameContact: string = 'Contact';
  fieldNameSale: string = 'Sale';
  fieldNameEstimate: string = 'Estimate';
  fieldNameQuotation: string = 'Quotation';
  fieldNameInvoice: string = 'Invoice';
  constructor(
    public dialogRef: MatDialogRef<FreeUserPopupComponent>,
    public commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {
    this.userName = data.firstName;
    this.fieldNameContact=data.fieldNameContact;
    this.fieldNameSale=data.fieldNameSale;
    this.fieldNameEstimate=data.fieldNameEstimate;
    this.fieldNameQuotation=data.fieldNameQuotation;
    this.fieldNameInvoice=data.fieldNameInvoice;
    this.Contact_monthly_limit = docCreationLimits.Contact_monthly_limit;
    this.Sales_monthly_limit = docCreationLimits.Sales_monthly_limit;
    this.Inv_monthly_limit = docCreationLimits.Inv_monthly_limit;
    this.Quote_monthly_limit = docCreationLimits.Quote_monthly_limit;
    this.Est_monthly_limit = docCreationLimits.Est_monthly_limit;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}
}
