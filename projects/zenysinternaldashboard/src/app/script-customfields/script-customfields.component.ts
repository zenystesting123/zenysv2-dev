/*--------------------------------------------------------------------------------
Description: Script for making updates to the user profile records
Use this script for scenarios such as new fields to be added in the user record
How to use: Add functions for specific updates to be done and selectively call the required function to update the records (below line 60)
Author: Mohan
Created Date: Nov 2021
Change log:


--------------------------------------------------------------------------------*/

import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  Profile,
  customFields,
  Customer,
  Sales,
  customFieldNamesData,
  SuperUserProfile,
  AdminProfile,
  SubUserProfile,
  UserAccessDetails,
} from 'src/app/data-models';
import { CustomfieldsService } from './customfields.service';

@Component({
  selector: 'app-script-customfields',
  templateUrl: './script-customfields.component.html',
  styleUrls: ['./script-customfields.component.scss'],
})
export class ScriptCustomfieldsComponent implements OnInit {
  profile: Profile;
  custSelectedFields = [];
  saleSelectedFields = [];
  userSubscription: Subscription;
  custCustomFieldArray = []; //array to hold the custom fields for customer
  saleCustomFieldArray = []; //array to hold the custom fields for sales
  customFieldNames = customFieldNamesData.data;
  superUserProfileData = SuperUserProfile.data;
  AdminProfileData = AdminProfile.data2;
  SubUserProfileData = SubUserProfile.data3;

  customFields: customFields = {
    //Custom field data type
    fieldName: null,
    fieldType: null,
    categoriesOpn: null,
    value: null,
    defaultValue: null,
    mandatory: null,
    categories: null,
    isActive: null,
  };
  contactsSubscription: any;
  custAddnlFieldVals: any[];
  salesAddnlFieldVals: any[];
  users: Profile[];
  defProfiles: any;
  profiles: UserAccessDetails[];
  updatedProfiles: number =0;
  noSubProfUpdated: number =0;
  noDefFieldNamesUpdated: number =0;

  constructor(private customFieldService: CustomfieldsService) {
    //console.log("Custome Field names array",this.customFieldNames)
    this.userSubscription = this.customFieldService
      .getAllUsers()
      .subscribe((data) => {
        this.users = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Profile;
        });
        console.log('users loaded', this.users.length);
        //Add function calls to update user profiles here
        //this.transfCustFields(users);
      });
  }

  executeScript() {
    this.userSubscription.unsubscribe();
    this.updateSubUserNo(this.users);
    this.updateDefaultProfiles(this.users);
    console.log('Script executed');
    //step 1: get the list of users
  }

  //function to transfrom the previous custom fields for contacts and sales documents to new custom field format
  transfCustFields(users) {
    users.forEach((user) => {
      //Upate the customer setting fields
      this.custSelectedFields = [];
      this.custCustomFieldArray = [];

      if (user.custField1Check == true) {
        this.custSelectedFields.push('custField1');
        this.custCustomFieldArray.push({
          fieldName: user.custField1Name,
          fieldType: 'inputField',
          categoriesOpn: null,
          value: null,
          defaultValue: null,
          mandatory: null,
          categories: null,
          isActive: true,
        });
      }

      if (user.custField2Check == true) {
        this.custSelectedFields.push('custField2');
        this.custCustomFieldArray.push({
          fieldName: user.custField2Name,
          fieldType: 'inputField',
          categoriesOpn: null,
          value: null,
          defaultValue: null,
          mandatory: null,
          categories: null,
          isActive: true,
        });
      }
      if (user.custField3Check == true) {
        this.custSelectedFields.push('custField3');
        this.custCustomFieldArray.push({
          fieldName: user.custField3Name,
          fieldType: 'inputField',
          categoriesOpn: null,
          value: null,
          defaultValue: null,
          mandatory: null,
          categories: null,
          isActive: true,
        });
      }
      if (user.custField4Check == true) {
        this.custSelectedFields.push('custField4');
        this.custCustomFieldArray.push({
          fieldName: user.custField4Name,
          fieldType: 'inputField',
          categoriesOpn: null,
          value: null,
          defaultValue: null,
          mandatory: null,
          categories: null,
          isActive: true,
        });
      }
      if (user.custCategory1Check == true) {
        this.custSelectedFields.push('custCategory1');
        this.custCustomFieldArray.push({
          fieldName: user.custCategory1Name,
          fieldType: 'category',
          categoriesOpn: user.custCategory1Opn,
          value: null,
          defaultValue: null,
          mandatory: null,
          categories: user.custCategory1,
          isActive: true,
        });
      }
      if (user.custCategory2Check == true) {
        this.custSelectedFields.push('custCategory2');
        this.custCustomFieldArray.push({
          fieldName: user.custCategory2Name,
          fieldType: 'category',
          categoriesOpn: user.custCategory2Opn,
          value: null,
          defaultValue: null,
          mandatory: null,
          categories: user.custCategory1,
          isActive: true,
        });
      }
      //Upate the sales setting fields
      this.saleSelectedFields = [];
      this.saleCustomFieldArray = [];
      if (user.saleField1Check == true) {
        console.log('entered the sale field1check');
        this.saleSelectedFields.push('saleField1');
        this.saleCustomFieldArray.push({
          fieldName: user.saleField1Name,
          fieldType: 'inputField',
          categoriesOpn: null,
          value: null,
          defaultValue: null,
          mandatory: null,
          categories: null,
          isActive: true,
        });
      }

      if (user.saleField2Check == true) {
        this.saleSelectedFields.push('saleField2');
        this.saleCustomFieldArray.push({
          fieldName: user.saleField2Name,
          fieldType: 'inputField',
          categoriesOpn: null,
          value: null,
          defaultValue: null,
          mandatory: null,
          categories: null,
          isActive: true,
        });
      }
      if (user.saleField3Check == true) {
        this.saleSelectedFields.push('saleField3');
        this.saleCustomFieldArray.push({
          fieldName: user.saleField3Name,
          fieldType: 'inputField',
          categoriesOpn: null,
          value: null,
          defaultValue: null,
          mandatory: null,
          categories: null,
          isActive: true,
        });
      }
      if (user.saleField4Check == true) {
        this.saleSelectedFields.push('saleField4');
        this.saleCustomFieldArray.push({
          fieldName: user.saleField4Name,
          fieldType: 'inputField',
          categoriesOpn: null,
          value: null,
          defaultValue: null,
          mandatory: null,
          categories: null,
          isActive: true,
        });
      }
      if (user.saleCategory1Check == true) {
        this.saleSelectedFields.push('saleCategory1');
        this.saleCustomFieldArray.push({
          fieldName: user.saleCategory1Name,
          fieldType: 'category',
          categoriesOpn: user.saleCategory1Opn,
          value: null,
          defaultValue: null,
          mandatory: null,
          categories: user.saleCategory1,
          isActive: true,
        });
      }
      if (user.saleCategory2Check == true) {
        this.saleSelectedFields.push('saleCategory2');
        this.saleCustomFieldArray.push({
          fieldName: user.saleCategory2Name,
          fieldType: 'category',
          categoriesOpn: user.saleCategory2Opn,
          value: null,
          defaultValue: null,
          mandatory: null,
          categories: user.saleCategory2,
          isActive: true,
        });
      }
      // console.log(
      //   'Logging customer selected fields',
      //   this.custSelectedFields
      // );
      // console.log('Logging sales selected fields', this.saleSelectedFields);
      // console.log(
      //   'Logging customer custom fields',
      //   this.custCustomFieldArray
      // );
      // console.log('Logging sales custom fields', this.saleCustomFieldArray);
      // //Update the custome customer fields to db
      this.customFieldService.updatecustCustomFields(
        user.id,
        this.custCustomFieldArray
      );
      // console.log('Updated custom fields for sales');
      this.customFieldService.updatecustSalesFields(
        user.id,
        this.saleCustomFieldArray
      );
      // console.log('Updated custom fields for sales');

      //take each contact
      this.contactsSubscription = this.customFieldService
        .getAllContacts(user.id)
        .pipe(take(1))
        .subscribe((data) => {
          let contacts = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Customer;
          });
          //For each contact
          contacts.forEach((contact) => {
            this.custAddnlFieldVals = [];
            //Loop through the fields that are activated
            this.custSelectedFields.forEach((fieldElement) => {
              if (eval('contact.' + fieldElement)) {
                this.custAddnlFieldVals.push(eval('contact.' + fieldElement));
                /*console.log(
                'Logging the selected field',
                eval('element.' + fieldElement)
              );*/
              }
            });
            //save to db with field name additionalFieldsArray
            // console.log('Customer name is ', contact.firstName);
            // console.log(
            //   'Logginf the contact custom values',
            //   this.custAddnlFieldVals
            // );
            this.customFieldService.updateContactsAddnlFields(
              user.id,
              contact.id,
              this.custAddnlFieldVals
            );
          });
        });

      //take each sales
      this.contactsSubscription = this.customFieldService
        .getAllSales(user.id)
        .pipe(take(1))
        .subscribe((data) => {
          let sales = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Sales;
          });
          //For each sale
          sales.forEach((sale) => {
            this.salesAddnlFieldVals = [];
            //Loop through the fields that are activated
            this.saleSelectedFields.forEach((fieldElement) => {
              if (eval('sale.' + fieldElement)) {
                this.salesAddnlFieldVals.push(eval('sale.' + fieldElement));
                /*console.log(
              'Logging the selected field',
              eval('element.' + fieldElement)
            );*/
              }
            });
            //save to db with field name additionalFieldsArray
            // console.log('Sale title is ', sale.saleTitle);
            // console.log(
            //   'Logging the sales custom values',
            //   this.custAddnlFieldVals
            // );
            this.customFieldService.updateSalesAddnlFields(
              user.id,
              sale.id,
              this.salesAddnlFieldVals
            );
          });
        });
      console.log('Updfated the data for', user.id);
    });
  }

  //function to add default user profile collection, number of subusers and custome field names array
  updateSubUserNo(users: Profile[]) {
    let noUser = users.length;
    //console.log('No of users', noUser);
    let i = 0;

    for (i = 0; i <noUser ; i++) {
      //console.log(users[i].id);
      //Check and update the no of subusers field if required
      if (users[i].noSubusers) {
        //console.log("No of subusers:", users[i].noSubusers)
      } else {
        //console.log("No of subusers not defined")
        this.customFieldService.setNoSubUsers(users[i].id);
        this.noSubProfUpdated++;
      }

      //Check and update the custom field names if required
      if (users[i].fieldNames) {
        //console.log("Field names array present")
      } else {
        //console.log("Added field names array")
        this.customFieldService.setFieldNamesArray(
          users[i].id,
          this.customFieldNames
        );
        this.noDefFieldNamesUpdated ++;
      }
    }
    //console.log("noSubUsers added to:", noSubProfUpdated)
    //console.log("defFieldNames added to:", noDefFieldNamesUpdated)
  }
  //Check if the collection for default profiles is present
  updateDefaultProfiles(users: Profile[]) {
    console.log("Updating user profiles")
    users.forEach((element) => {

      this.defProfiles = this.customFieldService
        .getUserProfiles(element.id)
        .pipe(take(1))
        .subscribe((data) => {
          this.profiles = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as UserAccessDetails;
          });

          //console.log('profiles present', this.profiles);
          //console.log(element.id);

                if(this.profiles.length == 0 ){

                  //console.log("default profiles added");
                  this.customFieldService.createDefaultProfile(element.id,this.superUserProfileData);
                  this.customFieldService.createDefaultProfile(element.id,this.AdminProfileData);
                  this.customFieldService.createDefaultProfile(element.id,this.SubUserProfileData);
                  this.updatedProfiles ++;
                  //console.log("profile updated", this.updatedProfiles)
                  this.defProfiles.unsubscribe();

                } else{
                  //console.log("default profiles present",data);
                  this.defProfiles.unsubscribe();
                }
        });

    });
    //console.log("Completed updating default user profiles. Profiles updated: ", updatedProfiles)
  }

  ngOnInit(): void { }
}
