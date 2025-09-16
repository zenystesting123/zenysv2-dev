/**********************************************************************************
Description: Component is used to display/edit loggedin user/ his superUsers profile Details
             and to display and update Subscription Details
             TAB : User Profile -Both in web and Mobile,
             TAB : Subsctiption Details - Only in Web
Inputs:
Outputs:
**********************************************************************************/
import { ProfileSettingsService } from './profile-settings.service';
import { Branch, DefaulViewList, Profile, UserAccessDetails, subUsers } from './../../data-models';
import {
  Component,
  Inject,
  OnInit,
  NgZone,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, concat, Subject, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { SearchService } from './../../search/search.service';
import { CommonService } from 'src/app/common.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Dialog2Component } from './dialog2/dialog2.component';
import {
  ICustomWindow,
  RazorservService,
} from '../../razorpaytest/razorserv.service';
import { environment } from 'src/environments/environment';
import { getCountryCodes } from 'src/app/countryCode';
import { take, takeUntil } from 'rxjs/operators';
// var jstz=require("jstimezonedetect")
import * as jstz from 'jstimezonedetect';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import * as data from 'src/app/timeZoneList.json';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  products: any = (data as any).default;
  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.
  CountryCodes = getCountryCodes.CountryCodes; //country codes fetch from countrycodes.ts
  public defaultCode = this.CountryCodes[97].dial_code; //default countrycode is assigned to India

  monthlyAmount: number; // monthly gold amount=59000
  yearlyAmount: number; // yearly gold amount 590000
  monthlyDayssetoff = 2592000000 / 1000; // monthly days setOff
  yearlyDayssetoff = 31536000000 / 1000; // yearly days setOff
  monthlyAmountDmd: number; // monthly Diamond amount 94400
  yearlyAmountDmd: number; // yearly Diamond amount 944000
  yearlyAmountSlv: number; // yearly Diamond amount 944000
  monthlyPlanDMD: string; //monthly diamond plan ID to be stored
  monthlyplanGLD: string; //monthly gold plan ID to be stored
  yearlyplanDMD: string; //yearly diamond plan ID to be stored
  yeaarlyplanGLD: string; //yearly gold plan ID to be stored
  yearlyplanSLV: string; //yearly silver plan ID to be stored
  categories: string; //categories is saved to seperate variable for mat-select
  userId: string = ''; //logged in users id
  allrequests: any[];

  form1: BehaviorSubject<any> = new BehaviorSubject(null); //after checking for account type data assigning is under this observable
  superUserData: Profile = null; //two way binding variable for user profile edit form

  superUserId: string = ' '; //logged in users super user id

  accountType: string = ''; //account type user
  notEdit: boolean = true; //to block direct route
  notEditMode: boolean = true; //edit button enabliong of mobile
  notEditModeView: boolean = true; //edit button enabling of preference view
  notEditModeInfo: boolean = true; //general info edit button
  notEditModeAdd: boolean = true; //address part edit button
  categoryOthers: boolean = false; //if category is others
  category: boolean = false; //boolean to check and display extra form field if category is "Others"
  subscriptions: any[];
  progressBarStatus: Boolean = false;
  isMobilesize: Boolean = false;
  isTabletsize: Boolean = false;
  branches: Branch[] = []; //branches under super user
  userPlan = '';
  assBranchName = '';

  categoryList: string[] = []; //categories fetching search service
  trAccrequested: Boolean = false;
  mytrreqdetails: any;
  fifsc: string = '';
  faccnumber: string = '';
  fbankname: string = '';
  tempfifsc: string = '';
  tempfaccnumber: string = '';
  tempfbankname: string = '';
  traccedit: Boolean = false;

  usrProfileData: UserAccessDetails; //access control check
  currentPlanDetails: any;
  currentPlanIndex: number;
  noSubusers: number;
  userDetailsSubscription: Subscription; //userdetails subscription from commonservice
  superUserSubscription: Subscription; //superuser details subscription
  transferAccReqSubscription: Subscription;
  user: firebase.default.UserInfo; //authentication info

  razorpay_key = environment.RAZORPAY_KEY_ID;
  paymentHistory: any;
  private _window: ICustomWindow;
  public rzp: any;
  place: string;
  currency: string;
  timeZoneList: any[] = [];
  timeZone = '';
  userData: Profile ;// current user data
  userassBranchName = '';//current user associated branch
  // customisable field names
  fieldNameContact: string = 'Contact';
  fieldNameSale: string = 'Sale';
  fieldNameService = 'Support';
  fieldNameFollowup: string = 'FollowUp';
  fieldNameTask: string = 'Task';
  defaulViewList:DefaulViewList[]=[];// view lists
  contactDefaultView:string// default view for contact
  saleDefaultView:string// default view for contact
  serviceDefaultView:string// default view for contact
  taskDefaultView:string// default view for contact
  followUpDefaultView:string// default view for contact

  constructor(
    public db: ProfileSettingsService,
    private snack: MatSnackBar,
    private location: Location,
    private searchService: SearchService,
    private razor: RazorservService,
    private zone: NgZone,
    public commonService: CommonService,
    public dialog: MatDialog,
    public networkCheck: NetworkCheckService
  ) {
    this.defaulViewList = DefaulViewList.getDefaulView(); //get view list from modal
    var myzone = jstz.determine().name();
    // myzone="europe/Set"
    // console.log(myzone);
    // var place:string
    if (myzone == 'Asia/Calcutta') this.place = 'India';
    else if (myzone.includes('Europe/')) this.place = 'Europe';
    else this.place = 'US';
    this.monthlyAmount = environment.MONTHLY_AMOUNT_GOLD[this.place];
    this.monthlyAmountDmd = environment.MONTHLY_AMOUNT_DMD[this.place];
    this.yearlyAmount = environment.YEARLY_AMOUNT_GOLD[this.place];
    this.yearlyAmountDmd = environment.YEARLY_AMOUNT_DMD[this.place];
    this.yearlyAmountSlv = environment.YEARLY_AMOUNT_SLV[this.place];
    this.yearlyplanSLV = environment.RZP_YEARY_PLAN_ID_SLV[this.place];
    this.yearlyplanDMD = environment.RZP_YEARY_PLAN_ID_DMD[this.place];
    this.monthlyPlanDMD = environment.RZP_MONTHLY_PLAN_ID_DMD[this.place];
    this.yeaarlyplanGLD = environment.RZP_YEARY_PLAN_ID[this.place];
    this.monthlyplanGLD = environment.RZP_MONTHLY_PLAN_ID[this.place];
    this.currency = environment.CURRENCY[this.place];
    this._window = this.razor.nativeWindow;
    this.categoryList = this.searchService.getCategory();

    //get the details of user profile assigned to the user
    this.usrProfileData = this.commonService.getProfileData();
    if (this.usrProfileData) {
      if (this.usrProfileData[0]) {
        // disable Settings view
        if (this.usrProfileData[0].isCheckedSett == false) {
          this.notEdit = true;
        } else {
          if (this.usrProfileData[0].settView == false) {
            this.notEdit = true;
          } else {
            this.notEdit = false;
          }
        }
      }
    }
    //to get userphotoURL from commonService, fetch auth details
    this.user = this.commonService.getUserAuthDetails();
    //subscribing the observable stored in common service the userdetails
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          this.isTabletsize = allData.isTabetSize;
          this.isMobilesize = allData.isMobileSize;

          //           const ct = require('countries-and-timezones');
          //           const timezones = ct.getAllTimezones();
          // console.log(timezones);
          // this.timeZoneList = Object.keys(timezones);
          // console.log(this.timeZoneList);

          // const countries = ct.getAllCountries();
          // console.log(countries);

          let data = allData.userDetails;
          let superUserData = allData.superUserDetails;
          this.userData = allData.userDetails;// save current user details
          this.userId = allData.userId;
          this.usrProfileData = allData.usrProfileData;
          this.timeZone = allData.superUserDetails.timeZone;
          this.contactDefaultView = this.userData?.contactDefaultView
          this.saleDefaultView = this.userData?.saleDefaultView
          this.serviceDefaultView = this.userData?.serviceDefaultView
          this.taskDefaultView = this.userData?.taskDefaultView
          this.followUpDefaultView = this.userData?.followUpDefaultView
          if (data.superUserId) {
            this.superUserId = data.superUserId;
          } else {
            //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
            this.superUserId = this.userId;
          }

          this.userPlan = allData.superUserDetails.plan;
          this.branches = allData.branches;

          this.assBranchName = this.branches.find(
            (item) => item.id === allData.superUserDetails?.associatedBranch
          )?.name;

          this.userassBranchName = allData.subUsers.find(
            (item) => item.userId === this.userId
          )?.branchName;

          this.superUserData = superUserData; //fields are binded with this form
          this.noSubusers = this.superUserData?.noSubusers + 1;
          this.progressBarStatus = true;
          // to provide category array, category is saving to seperate local variable
          this.categories = this.superUserData?.category;
          if (this.categories == 'Others') {
            this.category = true;
          }

          if (this.superUserData.fieldNames) {
            // assigning custom field names
            this.fieldNameContact = this.superUserData.fieldNames.fieldNameContact;
            this.fieldNameSale = this.superUserData.fieldNames.fieldNameSale;
            this.fieldNameTask = this.superUserData.fieldNames.fieldNameTask;
            this.fieldNameFollowup =this.superUserData.fieldNames.fieldNameFollowup;
              if (this.superUserData?.fieldNames?.fieldNameService) {
                this.fieldNameService =
                  this.superUserData.fieldNames.fieldNameService;
              }
          }

          var date = Date.now();
          if (this.superUserData?.paymentHistory) {
            for (let i = 0; i < this.superUserData.paymentHistory.length; i++) {
              if (
                this.superUserData.paymentHistory[i].paymentMode == 'manual'
              ) {
                if (
                  this.superUserData.paymentHistory[i].currentCycleEnd >
                    date / 1000 &&
                  this.superUserData.paymentHistory[i].currentCycleStartDate <
                    date / 1000
                ) {
                  this.currentPlanDetails =
                    this.superUserData.paymentHistory[i];
                  this.currentPlanIndex = i;
                }
              }
              if (
                this.superUserData.paymentHistory[i].paymentMode ==
                'subscription'
              ) {
                if (
                  this.superUserData.paymentHistory[i].subscriptionEnd >
                    date / 1000 &&
                  this.superUserData.paymentHistory[i].subscriptionStart <
                    date / 1000
                ) {
                  this.currentPlanDetails =
                    this.superUserData.paymentHistory[i];
                  this.currentPlanIndex = i;
                }
              }
            }
          }

          this.transferAccReqSubscription = this.db
            .getTransferaccreqs(this.userId)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
              (data) => {
                this.mytrreqdetails = data;
                this.traccedit = false;
                if (!!this.mytrreqdetails) {
                  // this.mytrreqdetails = data

                  (this.fbankname = this.tempfbankname =
                    this.mytrreqdetails.Name),
                    (this.fifsc = this.tempfifsc = this.mytrreqdetails.IFSC),
                    (this.faccnumber = this.tempfaccnumber =
                      this.mytrreqdetails.AccountNumber);
                }
              },
              (err) => {
                // console.log(err);
              }
            );
        }
      }
    );
  }
  ngOnInit(): void {
    // console.log(data);
    // console.log(data[0]);
    this.timeZoneList = Object.keys(data[0]);
    // console.log(this.timeZoneList);
  }
  // form when editing general info
  onUpdate(form) {
    this.notEditModeInfo = true;
    this.notEditModeAdd = true;
    if (!form.value.countryCode) {
      form.value.countryCode = '91';
    }
    if (form.value.category != 'Others') {
      form.value.categoryOthers = '';
    }
    if(form.value.phone){
      form.value.phone = form.value.phone + ''; //phone nu,ber type converting to string
    }
    if (!form.value.timeZone) {
      // users timezone field is saved along with other datas
      if (
        typeof Intl === 'object' &&
        typeof Intl.DateTimeFormat === 'function'
      ) {
        form.value.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }else{
        form.value.timeZone = 'Asia/Calcutta'
      }
    }
    this.notEditMode = !this.notEditMode;
    const ct = require('countries-and-timezones');
    const tzOffset = ct.getTimezone(form.value.timeZone);
    const formDetails = { ...form.value, tzOffset: tzOffset };
    this.db.update('/users', this.superUserId, formDetails);
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
  // form when address is editing
  onUpdate1(form) {

    this.notEditModeInfo = true;
    this.notEditModeAdd = true;
    this.notEditMode = !this.notEditMode;
    this.db.update('/users', this.superUserId, form.value);
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }
  // Edit button activating fields
  onTogglenotEditMode() {
    this.notEditMode = !this.notEditMode;
  }
  // Edit button activating fields
  onTogglenotEditModeView() {
    // reset view
    this.userData.contactDefaultView = this.contactDefaultView
    this.userData.saleDefaultView = this.saleDefaultView
    this.userData.serviceDefaultView = this.serviceDefaultView
    this.userData.taskDefaultView = this.taskDefaultView
    this.userData.followUpDefaultView = this.followUpDefaultView
    this.notEditModeView = !this.notEditModeView;
  }
  // edit button on general info card activating
  onTogglenotEditModeInfo() {
    this.notEditMode = false;
    this.notEditModeAdd = true;
    this.traccedit = false;
    this.notEditModeInfo = false;
  }
  // edit button on address card activating
  onTogglenotEditModeAdd() {
    this.notEditModeInfo = true;
    this.traccedit = false;
    this.notEditModeAdd = false;
  }
  // tolbar back button
  onBack() {
    this.location.back();
  }
  // cancel button
  onCancel() {
    this.notEditModeInfo = true;
    this.traccedit = false;
    this.notEditModeAdd = true;
    this.faccnumber = this.tempfaccnumber;
    this.fbankname = this.tempfbankname;
    this.fifsc = this.tempfifsc;
  }
  // toggle edit of transfer account details
  traccEdit() {
    this.notEditModeInfo = true;
    this.notEditModeAdd = true;
    this.traccedit = !this.traccedit;
  }
  // save the account details
  sendRequest() {
    var data = {
      Name: this.fbankname,
      IFSC: this.fifsc,
      AccountNumber: this.faccnumber,
      id: this.userId,
      dateRequested: Date.now(),
      requestStatus: 'Request Pending',
    };
    // console.log(data)
    this.db.saveRequest(data);
    this.snack.open('Successfully updated', 'done', {
      duration: 5000,
    });
  }
  //  function to find the updated amount for upgradation
  findAmount(packageDuration, plan) {
    var amount = 0;
    var nosubusers;
    this.noSubusers ? (nosubusers = this.noSubusers) : (nosubusers = 1);
    if (packageDuration == 'monthly') {
      // var currentPlan=''
      if (plan) {
        if (plan == 'gold') {
          amount = this.monthlyAmount;
        } else if (plan == 'diamond') {
          amount = this.monthlyAmountDmd;
        }
        return amount * nosubusers;
      } else return this.monthlyAmount * nosubusers;
    }
    if (packageDuration == 'yearly') {
      if (plan) {
        if (plan == 'gold') {
          amount = this.yearlyAmount;
        } else if (plan == 'diamond') {
          amount = this.yearlyAmountDmd;
        } else if (plan == 'leadManagement') {
          amount = this.yearlyAmountSlv;
        }
        return amount * nosubusers;
      } else return this.yearlyAmount * nosubusers;
    }
  }
  cancelSubscription(subid): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '350px',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {

        // this.animal = result;
        if (result == 'yes') {
          this.db
            .cancelsub(subid)
            .pipe(take(1))
            .subscribe((data) => {
              // console.log(data)
              var updatecurrentSub;
              updatecurrentSub = this.currentPlanDetails;
              updatecurrentSub.subscriptionCancelOn = Math.round(
                Date.now() / 1000
              );
              updatecurrentSub.subscriptionEnd =
                this.currentPlanDetails.currentCycleEnd;
              this.superUserData.paymentHistory[this.currentPlanIndex] =
                updatecurrentSub;
              // console.log(this.userId)
              this.db
                .updatePaymentHistory(
                  this.userId,
                  this.superUserData.paymentHistory
                )
                .then(() => {
                  this.currentPlanDetails = updatecurrentSub;
                });
            });
        }
      });
  }
  upgradePlan(currentPlan, noofSubusers) {
    const dialogRef = this.dialog.open(Dialog2Component, {
      width: '350px',
      data: { plan: currentPlan, noofSubusers: noofSubusers, superUserId: this.superUserId },
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          if (currentPlan.paymentMode == 'manual') {
            var amount1 = 0;
            var amount2 = 0;
            var monthlyGldtoDmd =
              (this.monthlyAmountDmd - this.monthlyAmount) /
              this.monthlyDayssetoff;
            var yearlyGldtoDmd =
              (this.yearlyAmountDmd - this.yearlyAmount) /
              this.yearlyDayssetoff;
            if (result) {
              if (this.currentPlanDetails.paymentMode == 'manual') {
                if (result.newPlan.plan != this.currentPlanDetails.plan) {
                  if (this.currentPlanDetails.packageDuration == 'monthly') {
                    if (
                      result.newPlan == 'diamond' &&
                      this.currentPlanDetails.plan == 'gold'
                    ) {
                      amount1 =
                        this.noSubusers *
                        monthlyGldtoDmd *
                        (this.currentPlanDetails.currentCycleEnd -
                          Date.now() / 1000);
                    }
                  }
                  if (this.currentPlanDetails.packageDuration == 'yearly') {
                    if (
                      result.newPlan == 'diamond' &&
                      this.currentPlanDetails.plan == 'gold'
                    ) {
                      amount1 =
                        this.noSubusers *
                        yearlyGldtoDmd *
                        (this.currentPlanDetails.currentCycleEnd -
                          Date.now() / 1000);
                    }
                  }
                }
                if (result.newNosubs != this.noSubusers) {
                  var tempamount = {
                    monthly: {
                      diamond: this.monthlyAmountDmd / this.monthlyDayssetoff,
                      gold: this.monthlyAmount / this.monthlyDayssetoff,
                    },
                    yearly: {
                      diamond: this.yearlyAmountDmd / this.yearlyDayssetoff,
                      gold: this.yearlyAmount / this.yearlyDayssetoff,
                    },
                  };
                  amount2 =
                    (result.newNosubs - this.noSubusers) *
                    (this.currentPlanDetails.currentCycleEnd -
                      Date.now() / 1000) *
                    tempamount[this.currentPlanDetails.packageDuration][
                      result.newPlan
                    ];
                }
                var totalamount = amount1 + amount2;
                if (totalamount > 0)
                  this.initPay(
                    Math.ceil(totalamount),
                    result.newPlan,
                    result.newNosubs,
                    this.noSubusers,
                    this.currentPlanDetails.plan
                  );
              }
            }
          } else if (currentPlan.paymentMode == 'subscription') {
            var plan_id = '';
            var subUpdateData: any = {};

            if (
              currentPlan.packageDuration == 'monthly' &&
              result.newPlan == 'diamond'
            ) {
              plan_id = this.monthlyPlanDMD;
            } else if (
              currentPlan.packageDuration == 'yearly' &&
              result.newPlan == 'diamond'
            ) {
              plan_id = this.yearlyplanDMD;
            }
            if (plan_id != '') {
              subUpdateData.plan_id = plan_id;
            }
            if (result.newNosubs != this.noSubusers)
              subUpdateData.quantity = result.newNosubs;
            if (!!subUpdateData) {
              subUpdateData.subscription_id = currentPlan.subscription_id;
              //   this.db.updateSubscription(subUpdateData).pipe(take(1)).subscribe((data)=>{
              //   this.snack.open("Your subscription have been updated, changes will be reflected after amount deducted from your account",'', {
              //     duration: 500,
              //   })
              // })
            }
          }
        }
      });
  }
  async initPay(amount, plan, newnoOfSubs, oldnoSubs, oldPlan) {
    var options: any = {
      key: this.razorpay_key,
      // name:this.userData.firstName+,
      decription: 'Update plan',
      // amount:this.acamount,
      // prefill:{
      //   name:"Akhil Tom Abraham",
      //   email:"akhiltomabraham93@gmail.com"
      // },
      notes: {},
      theme: {
        color: '#3880FF',
      },
      modal: {
        ondismiss: () => {
          this.zone.run<any>(() => {
            // console.log('failed');
          });
        },
      },
    };

    options.amount = amount;
    var temprazor = this.razor;
    var temp = amount;
    var tempdb = this.db;
    var tempuserId = this.superUserId;
    var tempCurrentPlan = this.currentPlanDetails;
    var tempPaymentHistory = this.superUserData.paymentHistory;
    var tempcurrentIndex = this.currentPlanIndex;
    var tempmonthlyGLDamount = this.monthlyAmount;
    var tempmonthlyDMDamount = this.monthlyAmountDmd;
    var tempyearlyGLDamount = this.yearlyAmount;
    var tempyearlyDMDamount = this.yearlyAmountDmd;

    if (!tempCurrentPlan.updateHistory) {
      tempCurrentPlan.updateHistory = [];
    }
    // var extsub= this.extendsubscriptiondata

    options.handler = function (response) {
      tempdb.addpaytoorder(
        tempuserId,
        response.razorpay_order_id,
        response.razorpay_payment_id,
        Number(temp)
      );
      temprazor
        .getpayment(response.razorpay_payment_id)
        .pipe(take(1))
        .subscribe(
          (res) => {
            tempdb.savepayment(tempuserId, res);
            tempCurrentPlan.plan = plan;
            if (plan == 'diamond') {
              if (tempCurrentPlan.packageDuration == 'monthly')
                tempCurrentPlan.amount = tempmonthlyDMDamount * newnoOfSubs;
              else if (tempCurrentPlan.packageDuration == 'yearly')
                tempCurrentPlan.amount = tempyearlyDMDamount * newnoOfSubs;
            } else if (plan == 'gold') {
              if (tempCurrentPlan.packageDuration == 'monthly')
                tempCurrentPlan.amount = tempmonthlyGLDamount * newnoOfSubs;
              else if (tempCurrentPlan.packageDuration == 'yearly')
                tempCurrentPlan.amount = tempyearlyGLDamount * newnoOfSubs;
            }

            tempCurrentPlan.updateHistory.push({
              updateDate: Date.now() / 1000,
              updateAmount: amount,
              oldPlan: oldPlan,
              oldnoSubs: oldnoSubs,
            });
            tempPaymentHistory[tempcurrentIndex] = tempCurrentPlan;
            tempdb.updateUser(tempuserId, {
              paymentHistory: tempPaymentHistory,
              noSubusers: newnoOfSubs - 1,
              plan: plan,
            });
          },
          (err) => {
            console.log(err);
          }
        );
    };
    // console.log(this.options)
    await this.razor
      .createOrder({
        amount: amount,
        receipt: 'temp reciept',
        currency: this.currency,
      })
      .pipe(take(1))
      .subscribe(
        (res: any) => {
          var orderData = res;
          this.db.saveorders(this.superUserId, orderData);
          options.order_id = res.id;
          this.rzp = new this.razor.nativeWindow['Razorpay'](options);
          this.rzp.open();
        },
        (err) => {}
      );
  }
  // on destroy
  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    if (this.transferAccReqSubscription) {
      this.transferAccReqSubscription.unsubscribe();
    }
    if (this.userDetailsSubscription) {
      this.userDetailsSubscription.unsubscribe();
    }
    this.superUserSubscription?.unsubscribe();
  }
  onUpdateView(viewForm){
    this.notEditModeView = !this.notEditModeView;
    const formDetails = { ...viewForm.value};
    this.db.update('/users', this.userId, formDetails);
    this.snack.open('Successfully updated', '', {
      duration: 500,
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onOKClick() {
    this.dialogRef.close('yes');
  }
}
