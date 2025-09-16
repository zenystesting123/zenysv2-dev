/*-----------------------------------------------
  Description : create profile page
  input: common service userdatas subscription
  ---------------------------------------------------------------- */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../common.service';
import { Subscription } from 'rxjs';
import {
  AdminProfile,
  Overseas_fields,
  SubUserProfile,
  SuperUserProfile,
  customFieldNamesData,
  indianStates,
  realEst_fields,
  teleMaerketing_fields,
} from '../data-models';
import { CreateProfileService } from './create-profile.service';
import { SearchService } from '../search/search.service';
import { getCountryCodes } from '../countryCode';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
})
export class CreateProfileComponent implements OnInit {
  createProfileFormGroup: FormGroup; //basic details form
  addressFormGroup: FormGroup; //address form
  commonServiceSubscription: Subscription; //common service subscription
  authDetails: any; // successfully logged in users aurh details
  timeZone = ''; //to save timezone
  tzOffset = new Date().getTimezoneOffset(); //to save time zone offset
  plan: string = 'free'; //default plan to be saved
  categoryList: string[] = []; //categories to show in basic details form
  userProfilesAdded: boolean = false; //to cehvk if profiles are added to avoid repeatation of data write
  countries = getCountryCodes.CountryCodes; //country codes fetch from countrycodes.ts
  states = indianStates; //states to show if country is india
  assignedToName = '';

  constructor(
    private _formBuilder: FormBuilder,
    public commonService: CommonService,
    private serviceInstance: CreateProfileService,
    private searchService: SearchService,
    private analytics: AngularFireAnalytics,
    private router: Router,
    private afAuth: AngularFireAuth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.commonServiceSubscription = this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.authDetails = user; // bind auth detaios
        this.categoryList = this.searchService.getCategory(); //Get the list of categories form the data modal file to display in the create profile form
        // users timezone field is saved along with other datas
        if (
          typeof Intl === 'object' &&
          typeof Intl.DateTimeFormat === 'function'
        ) {
          this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const ct = require('countries-and-timezones');
          this.tzOffset = ct.getTimezone(this.timeZone);
        }

        // firdt form declaration
        this.createProfileFormGroup = this._formBuilder.group({
          firstname: [this.authDetails.displayName, Validators.required],
          lastname: [''],
          countryCode: ['+91'],
          phone: [''],
          company: [''],
          category: ['General Sales', Validators.required],
          categoryOthers: [''],
        });

        // 2nd form declaration
        this.addressFormGroup = this._formBuilder.group({
          street1: ['', [Validators.minLength(3), Validators.maxLength(100)]],
          street2: ['', [Validators.minLength(3), Validators.maxLength(100)]],
          city: ['', [Validators.minLength(3), Validators.maxLength(50)]],
          state: ['', [Validators.minLength(3), Validators.maxLength(50)]],
          pincode: ['', [Validators.minLength(4), Validators.maxLength(12)]],
          country: ['', [Validators.minLength(2)]],
          gstnumber: [''],
        });

        // Trigger change detection after forms are created
        this.cdr.detectChanges();
      }
    });
  }

  onSubmits(GAevent) {
    let firstValue;
    let first;
    let publicProfileId;
    let catName;
    if (this.createProfileFormGroup.value.phone) {
      this.createProfileFormGroup.value.phone =
        this.createProfileFormGroup.value.phone + '';
    }
    //let path;

    //Following section is for removing special characters for creating the public profile id
    if (this.createProfileFormGroup.value.company) {
      firstValue = this.createProfileFormGroup.value.company;
      first = firstValue.replace(/[^a-zA-Z ]/g, '');
    } else {
      firstValue = this.createProfileFormGroup.value.firstname;
      first = firstValue.replace(/[^a-zA-Z ]/g, '');
    }

    this.analytics.logEvent(GAevent);

    this.createProfileFormGroup.value.estimateNoInit = 0;
    this.createProfileFormGroup.value.quoteNoInit = 0;
    this.createProfileFormGroup.value.invoiceNoInit = 0;

    if (this.createProfileFormGroup.value.lastname) {
      this.assignedToName =
        this.createProfileFormGroup.value.firstname +
        ' ' +
        this.createProfileFormGroup.value.lastname;
    } else {
      this.assignedToName = this.createProfileFormGroup.value.firstname;
    }
    catName = this.createProfileFormGroup.value.category; //assigning to local variable

    //Create profile and write to the db
    const expenseCategoryList = this.serviceInstance.getCategory(); // Get the list of expense categories from data modal file

    // according to selected profiles, update datas-contact status/sale stages/report titles,
    if (catName === 'Overseas Education') {
      this.serviceInstance
        .createCustomProfile(
          this.authDetails.uid,
          this.authDetails.email,
          this.createProfileFormGroup.value,
          this.addressFormGroup.value,
          this.timeZone,
          this.tzOffset,
          this.plan,
          expenseCategoryList,
          Overseas_fields
        )
        .then((resp1) => {
          // addDefaultPipeline after this only add sample contact/sale and service should be called
          this.commonService.addDefaultPipeline(this.authDetails.uid, catName);
        })
        .then((resp2) => {
          this.commonService.addSampleReport(this.authDetails.uid, catName);
          this.commonService.addAutom1(this.authDetails.uid, catName);
          this.commonService.addAutom5(this.authDetails.uid, catName);
        })
        .then((resp3) => {
          this.addSampleData();
        });
    } else if (catName === 'Real Estate') {
      this.serviceInstance
        .createCustomProfile(
          this.authDetails.uid,
          this.authDetails.email,
          this.createProfileFormGroup.value,
          this.addressFormGroup.value,
          this.timeZone,
          this.tzOffset,
          this.plan,
          expenseCategoryList,
          realEst_fields
        )
        .then((resp1) => {
          // addDefaultPipeline after this only add sample contact/sale and service should be called
          this.commonService.addDefaultPipeline(this.authDetails.uid, catName);
        })
        .then((resp2) => {
          this.commonService.addSampleReport(this.authDetails.uid, catName);
          this.commonService.addAutom1(this.authDetails.uid, catName);
          this.commonService.addAutom5(this.authDetails.uid, catName);
        })
        .then((resp3) => {
          this.addSampleData();
        });
    } else if (catName === 'Tele-Sales') {
      this.serviceInstance
        .createCustomProfile(
          this.authDetails.uid,
          this.authDetails.email,
          this.createProfileFormGroup.value,
          this.addressFormGroup.value,
          this.timeZone,
          this.tzOffset,
          this.plan,
          expenseCategoryList,
          teleMaerketing_fields
        )
        .then((resp1) => {
          // addDefaultPipeline after this only add sample contact/sale and service should be called
          this.commonService.addDefaultPipeline(this.authDetails.uid, catName);
        })
        .then((resp2) => {
          this.commonService.addSampleReport(this.authDetails.uid, catName);
          this.commonService.addAutom1(this.authDetails.uid, catName);
          this.commonService.addAutom5(this.authDetails.uid, catName);
        })
        .then((resp3) => {
          this.addSampleData();
        });
    } else {
      this.serviceInstance
        .createProfile(
          this.authDetails.uid,
          this.authDetails.email,
          this.createProfileFormGroup.value,
          this.addressFormGroup.value,
          this.timeZone,
          this.tzOffset,
          this.plan,
          expenseCategoryList,
          customFieldNamesData.data
        )
        .then((resp1) => {
          // addDefaultPipeline after this only add sample contact/sale and service should be called
          this.commonService.addDefaultPipeline(this.authDetails.uid, catName);
        })
        .then((resp2) => {
          this.commonService.addSampleReport(this.authDetails.uid, catName);
          this.commonService.addAutom1(this.authDetails.uid, catName);
          this.commonService.addAutom5(this.authDetails.uid, catName);
        })
        .then((resp3) => {
          this.addSampleData();
        });
    }

    //Check if a public profile exists with the same name, if not write the data
    let publicProfIDNotCreated = true;
    while (publicProfIDNotCreated) {
      let random = Math.floor(Math.random() * 100000 + 1);
      publicProfileId = first + random;
      let data;
      this.serviceInstance
        .getpublicProf(publicProfileId)
        .pipe(take(1))
        .subscribe((p) => (data = p));
      if (!data) {
        publicProfIDNotCreated = false;
        this.serviceInstance.updateProfileId(publicProfileId, this.authDetails);
        break;
      }
    }
    this.router.navigate(['dash/razorpay/razorpay']);
  }
  addSampleData() {
    // add sample contact, sale, service, task and followup
    // dashboard report
    this.commonService.addSampleDashBoardReport(this.authDetails.uid);
    // 1.contact
    this.commonService.addSampleContact(
      this.assignedToName,
      this.authDetails.uid
    );
    // 2.sale
    this.commonService.addSampleSale(this.assignedToName, this.authDetails.uid);
    // 3.service
    this.commonService.addSampleService(
      this.assignedToName,
      this.authDetails.uid
    );
    // 4.task
    this.commonService.addSampleTask(this.assignedToName, this.authDetails.uid);
    // 5.followup
    this.commonService.addSampleCall(this.assignedToName, this.authDetails.uid);
    // 6.organisation
    this.commonService.addSampleOrg(this.assignedToName, this.authDetails.uid);
    // 7.email templates
    this.commonService.addEmailTemp1(this.authDetails.uid);
    this.commonService.addEmailTemp2(this.authDetails.uid);
    this.commonService.addEmailTemp3(this.authDetails.uid);
    this.commonService.addEmailTemp4(this.authDetails.uid);
    this.commonService.addEmailTemp5(this.authDetails.uid);
    // 8.add automations
    this.commonService.addAutom2(this.authDetails.uid);
    this.commonService.addAutom3(this.authDetails.uid);
    this.commonService.addAutom4(this.authDetails.uid);
    this.commonService.addAutom6(this.authDetails.uid);
    this.commonService.addAutom7(this.authDetails.uid);

    // adding SuperUser profile to DB
    this.serviceInstance.create(SuperUserProfile.data, this.authDetails.uid);
    // adding Admin profile to DB
    this.serviceInstance.create(AdminProfile.data2, this.authDetails.uid);
    // adding SubUser profile to DB
    this.serviceInstance.create(SubUserProfile.data3, this.authDetails.uid);
  }
}
