import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-settings-new',
  templateUrl: './settings-new.component.html',
  styleUrls: ['./settings-new.component.scss']
})
export class SettingsNewComponent implements OnInit {
  userDetailsSubscription: Subscription; //for subscribing to user details
  isMobilesize: Boolean = false; //store to check mobile view
  isTabletsize: Boolean = false; //store to check tablet view
  superUserDetails: any; //to store super user details
  fieldNameContact: string = 'Contact'; //local variable to store field name contact notes
  fieldNameFollowup: string = 'FollowUp'; //local variable to store followup field name
  fieldNameTask: string = 'Task'; //local variable to store field name task
  fieldNameExpense: string = 'Expense'; //local variable to store field name expense
  fieldNameProduct: string = 'Product'; //local variable to store field name product
  fieldNameSale: string = 'Sale'; //local variable to store field name sale
  fieldNamePayment: string = 'Payment'; //local variable to store field name sale
  fieldNameSupport: string = 'Support'; //local variable to store field name sale
  fieldNameOrg: string = 'Organisation'; //local variable to store field name sale
  constructor(
  private route:Router,
  public commonService: CommonService,
  private location: Location,

  ) {
      //Check screen size form common service file
      if (this.commonService.isTabletsize) {
        this.isTabletsize = true;
      } else {
        this.isTabletsize = false;
      }
      if (this.commonService.isMobilesize) {
        this.isMobilesize = true;
      } else {
        this.isMobilesize = false;
      }
       //getting data from common service file related to the user
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          this.superUserDetails = allData.superUserDetails;
          if (this.superUserDetails.fieldNames) {
            //getting field name to display
            this.fieldNameContact = this.superUserDetails.fieldNames.fieldNameContact;
            this.fieldNameFollowup = this.superUserDetails.fieldNames.fieldNameFollowup;
            this.fieldNameTask = this.superUserDetails.fieldNames.fieldNameTask;
            this.fieldNameExpense = this.superUserDetails.fieldNames.fieldNameExpense;
            this.fieldNameProduct = this.fieldNameProduct?this.fieldNameProduct:this.superUserDetails.fieldNames.fieldNameItems;
            this.fieldNameSale = this.superUserDetails.fieldNames.fieldNameSale;
            this.fieldNameOrg = this.superUserDetails.fieldNames.fieldNameOrganization?this.superUserDetails.fieldNames.fieldNameOrganization:'Organization';
          }
   }
  })
}

  ngOnInit(): void {
  }
   //triggered on clicking back icon to moving back to previous page
   onBack() {
    this.location.back();
  }
  public ngOnDestroy(): void {
    this.userDetailsSubscription?.unsubscribe;
  }

}
