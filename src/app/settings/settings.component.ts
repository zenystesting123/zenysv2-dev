import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
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
  fieldNameOrg: string = 'Organization'; //local variable to store field name sale
  plan: any;
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
          this.plan = this.superUserDetails.plan;

          if (this.superUserDetails.fieldNames) {
            //getting field name to display
            this.fieldNameContact = this.superUserDetails.fieldNames.fieldNameContact;
            this.fieldNameFollowup = this.superUserDetails.fieldNames.fieldNameFollowup;
            this.fieldNameTask = this.superUserDetails.fieldNames.fieldNameTask;
            this.fieldNameExpense = this.superUserDetails.fieldNames.fieldNameExpense;
            this.fieldNameProduct = this.superUserDetails.fieldNames.fieldNameItems?this.superUserDetails.fieldNames.fieldNameItems:'Product';
            this.fieldNameSale = this.superUserDetails.fieldNames.fieldNameSale;
            this.fieldNameSupport = this.superUserDetails.fieldNames.fieldNameService?this.superUserDetails.fieldNames.fieldNameService:'Support';
            this.fieldNamePayment = this.superUserDetails.fieldNames.fieldNameCollection?this.superUserDetails.fieldNames.fieldNameCollection:'Payment';
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
