import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { customFields, defaultExpenseSettings, defaultorganisationSettings, expenseSettings, fieldNameLEngth, organisationSettings } from 'src/app/data-models';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { CommonService } from 'src/app/common.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrganisationSettingService } from './organisation-setting.service';

@Component({
  selector: 'app-organisation-setting',
  templateUrl: './organisation-setting.component.html',
  styleUrls: ['./organisation-setting.component.scss']
})
export class OrganisationSettingComponent implements OnInit {
  isMobilesize: Boolean = false; //store to check mobile view
  isTabletsize: Boolean = false; //store to check tablet view
  notEdit:boolean = true; //for setting edit mode disabled from user defention
  progressBarStatus: boolean = false; //for hidding loader
  settingsConfigured = false;

  userProfileData: any;
  networkConnection: boolean; //network check
  usrProfileData: any;
  superUserDetails: any; //to store super user details
  fieldNameOrg: string = "Organization"; //to store organisation custom name
  currentCustomField: any = []; //to store additional fields
  userDetailsSubscription: Subscription; //for subscribing to user details
  customFields: customFields = {
    //to store values of additional field while editing and adding
    fieldName: null, //to store fields name
    fieldType: null, //to store the fields type
    categoriesOpn: null, //to store options if category type selected
    value: null, //to store value of that field while editing
    defaultValue: null, //to store default values
    mandatory: null, //to check where field is set as mandatory
    categories: null, //array to store options of category
    isActive: null, //to check wheter the field is activated or not
  };
  editOrg: boolean = false;
  fieldMaxLength = fieldNameLEngth.FIELD_NAME_LENGTH; //maxlength from datamodel.ts, but not implemented for products and services
  dataAccessRule: string;
  superUserId: string; //for storing super user id
  fieldCustomisationForm: FormGroup;
  organisationSettings:organisationSettings = defaultorganisationSettings.CONST_VALUE;

  constructor(
    private db:OrganisationSettingService,
    private snack: MatSnackBar,
    private location: Location,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
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
          this.superUserId = allData.userDetails.superUserId;
          
          this.superUserDetails = allData.superUserDetails;
          // if (this.superUserDetails.fieldNames?.fieldNameOrg) {
          //   //getting field name to display
          //   this.fieldNameOrg = this.superUserDetails.fieldNames.fieldNameContact;
          // }
          this.currentCustomField = this.superUserDetails.customFieldsOrganisation;
           //for checking which fields are enabled
           this.usrProfileData = allData.usrProfileData;
           if (this.usrProfileData) {
             this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;
 
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
           if (this.superUserDetails.fieldNames.fieldNameOrganization) {
            //getting field name to display
            this.fieldNameOrg = this.superUserDetails.fieldNames.fieldNameOrganization?this.superUserDetails.fieldNames.fieldNameOrganization:'Organization';

           }
           //disabling loader
           this.progressBarStatus = true;
           //customisation fields starts here
          if (
            typeof allData.superUserDetails.organisationSettings === 'undefined' ||
            allData.superUserDetails.organisationSettings === null
          ) {
            this.settingsConfigured = false;
          } else {
            this.settingsConfigured = true;
            this.organisationSettings = allData.superUserDetails.organisationSettings;
            if (allData.superUserDetails.organisationSettings) {
              this.commonService.checkCustomField(defaultorganisationSettings.CONST_VALUE, allData.superUserDetails.organisationSettings)
            }
          }
          this.fieldCustomisationForm = new FormGroup({
            companyName: new FormGroup({
              displayName: new FormControl(
               this.organisationSettings?.companyName.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.organisationSettings?.companyName?.display,
                Validators.required
              ),
              mandatory: new FormControl(
               this.organisationSettings?.companyName?.mandatory,
                Validators.required
              ),
            }),
            contactNo: new FormGroup({
              displayName: new FormControl(
               this.organisationSettings?.contactNo.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.organisationSettings?.contactNo?.display,
                Validators.required
              ),
              mandatory: new FormControl(
               this.organisationSettings?.contactNo?.mandatory,
                Validators.required
              ),
            }),
            invoiced: new FormGroup({
              displayName: new FormControl(
               this.organisationSettings?.invoiced.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.organisationSettings?.invoiced?.display,
                Validators.required
              ),
              mandatory: new FormControl(
               this.organisationSettings?.invoiced?.mandatory,
                Validators.required
              ),
            }),
            collected: new FormGroup({
              displayName: new FormControl(
               this.organisationSettings?.collected.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.organisationSettings?.collected?.display,
                Validators.required
              ),
              mandatory: new FormControl(
               this.organisationSettings?.collected?.mandatory,
                Validators.required
              ),
            }),
            billingaddress1: new FormGroup({
              displayName: new FormControl(
               this.organisationSettings?.billingaddress1.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.organisationSettings?.billingaddress1?.display,
                Validators.required
              ),
              mandatory: new FormControl(
               this.organisationSettings?.billingaddress1?.mandatory,
                Validators.required
              ),
            }),
            billingaddress2: new FormGroup({
              displayName: new FormControl(
               this.organisationSettings?.billingaddress2.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.organisationSettings?.billingaddress2?.display,
                Validators.required
              ),
              mandatory: new FormControl(
               this.organisationSettings?.billingaddress2?.mandatory,
                Validators.required
              ),
            }),
            district: new FormGroup({
              displayName: new FormControl(
               this.organisationSettings?.district.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.organisationSettings?.district?.display,
                Validators.required
              ),
              mandatory: new FormControl(
               this.organisationSettings?.district?.mandatory,
                Validators.required
              ),
            }),
            taxId: new FormGroup({
              displayName: new FormControl(
               this.organisationSettings?.taxId.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.organisationSettings?.taxId?.display,
                Validators.required
              ),
              mandatory: new FormControl(
               this.organisationSettings?.taxId?.mandatory,
                Validators.required
              ),
            }),
            bpin: new FormGroup({
              displayName: new FormControl(
               this.organisationSettings?.bpin.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.organisationSettings?.bpin?.display,
                Validators.required
              ),
              mandatory: new FormControl(
               this.organisationSettings?.bpin?.mandatory,
                Validators.required
              ),
            }),
            state: new FormGroup({
              displayName: new FormControl(
               this.organisationSettings?.state.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.organisationSettings?.state?.display,
                Validators.required
              ),
              mandatory: new FormControl(
               this.organisationSettings?.state?.mandatory,
                Validators.required
              ),
            }),
            country: new FormGroup({
              displayName: new FormControl(
               this.organisationSettings?.country.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.organisationSettings?.country?.display,
                Validators.required
              ),
              mandatory: new FormControl(
               this.organisationSettings?.country?.mandatory,
                Validators.required
              ),
            }),
            details: new FormGroup({
              displayName: new FormControl(
               this.organisationSettings?.details.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.organisationSettings?.details?.display,
                Validators.required
              ),
              mandatory: new FormControl(
               this.organisationSettings?.details?.mandatory,
                Validators.required
              ),
            }),
            website: new FormGroup({
              displayName: new FormControl(
               this.organisationSettings?.website.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.organisationSettings?.website?.display,
                Validators.required
              ),
              mandatory: new FormControl(
               this.organisationSettings?.website?.mandatory,
                Validators.required
              ),
            }),
            email: new FormGroup({
              displayName: new FormControl(
               this.organisationSettings?.email.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.organisationSettings?.email?.display,
                Validators.required
              ),
              mandatory: new FormControl(
               this.organisationSettings?.email?.mandatory,
                Validators.required
              ),
            }),
           
          });
          // companyName
          this.fieldCustomisationForm.get('companyName.display').setValue(true);
          this.fieldCustomisationForm.get('companyName.display').disable();
          this.fieldCustomisationForm.get('companyName.mandatory').setValue(true);
          this.fieldCustomisationForm.get('companyName.mandatory').disable();
          //invoiced
          this.fieldCustomisationForm.get('invoiced.display').setValue(true);
          this.fieldCustomisationForm.get('invoiced.display').disable();
          this.fieldCustomisationForm.get('invoiced.mandatory').setValue(true);
          this.fieldCustomisationForm.get('invoiced.mandatory').disable();
          //collected
          this.fieldCustomisationForm.get('collected.display').setValue(true);
          this.fieldCustomisationForm.get('collected.display').disable();
          this.fieldCustomisationForm.get('collected.mandatory').setValue(true);
          this.fieldCustomisationForm.get('collected.mandatory').disable();
          this.disableContactNum();
          this.disablebilAdrs1();
          this.disablebilAdrs2();
          this.disableDistrict();
          this.disableState();
          this.disableCountry();
          this.disablepinOrzip();
          this.disabletaxIdNum()
          this.disableDetails();
          this.disableWebsite();
          this.disableEmail();
   }
  })
}

  ngOnInit(): void {
  }
  disableContactNum() {
    // contactNumber
    if (this.fieldCustomisationForm.get('contactNo.mandatory').value === true) {
      this.fieldCustomisationForm.get('contactNo.display').setValue(true);
      this.fieldCustomisationForm.get('contactNo.display').disable();

    } else {
      let val = this.organisationSettings.contactNo.display;
      this.fieldCustomisationForm.get('contactNo.display').setValue(val);
      this.fieldCustomisationForm.get('contactNo.display').enable();
    }
  }
  disablebilAdrs1() {
    // billingAddressOne
    if (this.fieldCustomisationForm.get('billingaddress1.mandatory').value === true) {
      this.fieldCustomisationForm.get('billingaddress1.display').setValue(true);
      this.fieldCustomisationForm.get('billingaddress1.display').disable();

    } else {
      let val = this.organisationSettings.billingaddress1.display;
      this.fieldCustomisationForm.get('billingaddress1.display').setValue(val);
      this.fieldCustomisationForm.get('billingaddress1.display').enable();
    }
  }
  disablebilAdrs2() {
    // billingAddressTwo
    if (this.fieldCustomisationForm.get('billingaddress2.mandatory').value === true) {
      this.fieldCustomisationForm.get('billingaddress2.display').setValue(true);
      this.fieldCustomisationForm.get('billingaddress2.display').disable();

    } else {
      let val = this.organisationSettings.billingaddress2.display;
      this.fieldCustomisationForm.get('billingaddress2.display').setValue(val);
      this.fieldCustomisationForm.get('billingaddress2.display').enable();
    }
  }
  disableDistrict() {
    // district
    if (this.fieldCustomisationForm.get('district.mandatory').value === true) {
      this.fieldCustomisationForm.get('district.display').setValue(true);
      this.fieldCustomisationForm.get('district.display').disable();

    } else {
      let val = this.organisationSettings.district.display;
      this.fieldCustomisationForm.get('district.display').setValue(val);
      this.fieldCustomisationForm.get('district.display').enable();
    }
  }
  disableState() {
    // state
    if (this.fieldCustomisationForm.get('state.mandatory').value === true) {
      this.fieldCustomisationForm.get('state.display').setValue(true);
      this.fieldCustomisationForm.get('state.display').disable();

    } else {
      let val = this.organisationSettings.state.display;
      this.fieldCustomisationForm.get('state.display').setValue(val);
      this.fieldCustomisationForm.get('state.display').enable();
    }
  }
  disableCountry() {
    // country
    if (this.fieldCustomisationForm.get('country.mandatory').value === true) {
      this.fieldCustomisationForm.get('country.display').setValue(true);
      this.fieldCustomisationForm.get('country.display').disable();

    } else {
      let val = this.organisationSettings.country.display;
      this.fieldCustomisationForm.get('country.display').setValue(val);
      this.fieldCustomisationForm.get('country.display').enable();
    }
  }
  disablepinOrzip() {
    // pinOrzip
    if (this.fieldCustomisationForm.get('bpin.mandatory').value === true) {
      this.fieldCustomisationForm.get('bpin.display').setValue(true);
      this.fieldCustomisationForm.get('bpin.display').disable();

    } else {
      let val = this.organisationSettings.bpin.display;
      this.fieldCustomisationForm.get('bpin.display').setValue(val);
      this.fieldCustomisationForm.get('bpin.display').enable();
    }
  }
  disabletaxIdNum() {
    // pinOrzip
    if (this.fieldCustomisationForm.get('taxId.mandatory').value === true) {
      this.fieldCustomisationForm.get('taxId.display').setValue(true);
      this.fieldCustomisationForm.get('taxId.display').disable();

    } else {
      let val = this.organisationSettings.taxId.display;
      this.fieldCustomisationForm.get('taxId.display').setValue(val);
      this.fieldCustomisationForm.get('taxId.display').enable();
    }
  }
  disableDetails() {
    // pinOrzip
    if (this.fieldCustomisationForm.get('details.mandatory').value === true) {
      this.fieldCustomisationForm.get('details.display').setValue(true);
      this.fieldCustomisationForm.get('details.display').disable();

    } else {
      let val = this.organisationSettings.details.display;
      this.fieldCustomisationForm.get('details.display').setValue(val);
      this.fieldCustomisationForm.get('details.display').enable();
    }
  }
  disableWebsite() {
    // pinOrzip
    if (this.fieldCustomisationForm.get('website.mandatory').value === true) {
      this.fieldCustomisationForm.get('website.display').setValue(true);
      this.fieldCustomisationForm.get('website.display').disable();

    } else {
      let val = this.organisationSettings.website.display;
      this.fieldCustomisationForm.get('website.display').setValue(val);
      this.fieldCustomisationForm.get('website.display').enable();
    }
  }
  disableEmail() {
    // pinOrzip
    if (this.fieldCustomisationForm.get('email.mandatory').value === true) {
      this.fieldCustomisationForm.get('email.display').setValue(true);
      this.fieldCustomisationForm.get('email.display').disable();

    } else {
      let val = this.organisationSettings.email.display;
      this.fieldCustomisationForm.get('email.display').setValue(val);
      this.fieldCustomisationForm.get('email.display').enable();
    }
  }
  onSubmit(){
    if (this.fieldCustomisationForm.getRawValue().billingaddress1.displayName === '') {
      this.fieldCustomisationForm
        .get('billingaddress1.displayName')
        .setValue(defaultorganisationSettings.CONST_VALUE.billingaddress1.displayName);
    }
    //billingAddressTwo
    if (this.fieldCustomisationForm.getRawValue().billingaddress2.displayName === '') {
      this.fieldCustomisationForm
        .get('billingaddress2.displayName')
        .setValue(defaultorganisationSettings.CONST_VALUE.billingaddress2.displayName);
    }
    //district
    if (this.fieldCustomisationForm.getRawValue().district.displayName === '') {
      this.fieldCustomisationForm
        .get('district.displayName')
        .setValue(defaultorganisationSettings.CONST_VALUE.district.displayName);
    }
    //state
    if (this.fieldCustomisationForm.getRawValue().state.displayName === '') {
      this.fieldCustomisationForm
        .get('state.displayName')
        .setValue(defaultorganisationSettings.CONST_VALUE.state.displayName);
    }
    //country
    if (this.fieldCustomisationForm.getRawValue().country.displayName === '') {
      this.fieldCustomisationForm
        .get('country.displayName')
        .setValue(defaultorganisationSettings.CONST_VALUE.country.displayName);
    }
    //
    if (this.fieldCustomisationForm.getRawValue().contactNo.displayName === '') {
      this.fieldCustomisationForm
        .get('contactNo.displayName')
        .setValue(defaultorganisationSettings.CONST_VALUE.contactNo.displayName);
    }
    //pinOrzip
    if (this.fieldCustomisationForm.getRawValue().bpin.displayName === '') {
      this.fieldCustomisationForm
        .get('bpin.displayName')
        .setValue(defaultorganisationSettings.CONST_VALUE.bpin.displayName);
    }
    //
    if (this.fieldCustomisationForm.getRawValue().taxId.displayName === '') {
      this.fieldCustomisationForm
        .get('taxId.displayName')
        .setValue(defaultorganisationSettings.CONST_VALUE.taxId.displayName);
    }
    if (this.fieldCustomisationForm.getRawValue().details.displayName === '') {
      this.fieldCustomisationForm
        .get('details.displayName')
        .setValue(defaultorganisationSettings.CONST_VALUE.details.displayName);
    }
    if (this.fieldCustomisationForm.getRawValue().website.displayName === '') {
      this.fieldCustomisationForm
        .get('website.displayName')
        .setValue(defaultorganisationSettings.CONST_VALUE.website.displayName);
    }
    if (this.fieldCustomisationForm.getRawValue().email.displayName === '') {
      this.fieldCustomisationForm
        .get('email.displayName')
        .setValue(defaultorganisationSettings.CONST_VALUE.email.displayName);
    }
    
    this.db.updateFieldCustomization(
      this.superUserId,
      this.fieldCustomisationForm.getRawValue()
    );
    this.snack.open('Successfully updated', '', {
      duration: 2000,
    });
  }
  editOrgfn() {
    this.editOrg = true;
  }

  clearOrg() {
    this.editOrg = false;
    this.fieldNameOrg = this.superUserDetails.fieldNames.fieldNameOrganization;
  }

  saveOrg() {
    this.editOrg = false;
    this.db.updateOrgfieldName(
      this.superUserId,
      this.fieldNameOrg
    );
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  onBack() {
    this.location.back();
  }
  public ngOnDestroy(): void {
    //to unsubscribe subscriptions
    this.userDetailsSubscription?.unsubscribe;
  }

}
