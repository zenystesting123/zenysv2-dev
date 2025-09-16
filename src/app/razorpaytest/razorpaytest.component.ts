// *********************************************************************************
// Description: Razorpay payment page

// ***********************************************************************************

import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { ICustomWindow, RazorservService } from './razorserv.service';
import { environment } from './../../environments/environment';
import { RazortodbService } from './razortodb.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { SelectpopupComponent } from './selectpopup/selectpopup.component';
import { CommonService } from '../common.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
// var jstz=require('jstimezonedetect');
import * as jstz from 'jstimezonedetect';

// import {} from "jstimezonedetect" as jstz

@Component({
  selector: 'app-razorpaytest',
  templateUrl: './razorpaytest.component.html',
  styleUrls: ['./razorpaytest.component.scss'],
})
export class RazorpaytestComponent implements OnInit {
  // current user data
  userId: any;
  userData: any;

  // previous subscription data
  previoussubdata: any;

  name: string = null; //name of the user
  email: string = null; // email of the user
  description: string = null; // description used in razorpay (will be replaced later)
  acamount: number; // the amount to be debited through payment
  reciept: string = 'sjjdsjdjshjdhsjdywvdjv'; // dummy reciept id
  WindowRef: any; // used for window popup for razorpay

  // for subscription

  namesub: string; // name used for subscription popu
  emailsub: string; // email used for subscription popup
  descriptionsub: string; // description used for subscription popup
  amountsub: number; // amount used for subscription popup
  countsub: number; // number of recurring payments to be done for subscriptions
  periodsub: string; // the time period field for razorpay subscriptions
  namecustsub: string; // name of the user to be displayed in subsciprion popup

  orderData: any; // if order is created it is stored in this variable
  dayssetOff: number = 0; // no of days set off for different plans(in millisecods)
  subscriptionType: any; // the type of subscription monthly or yearly
  nextstartDate: any; // to create a new subscription or payment if current subscription exist this date is set as the date on  which the new subscription starts
  planIdforsubscription: any; // plan id for subscription
  monthvarforsub: any; // variable used to set the set Off days for monthly or yearly plans 365 days or 30 days
  superUserId: any;
  monthlyAmount: number; // monthly gold amount
  yearlyAmount: number; // yearly gold amount
  monthlyDayssetoff = 2592000000 / 1000; //  (30 (days)* 24(hrs) * 60(min) * 60(sec) * 1000)/1000 divided by 1000 to get the date in razorpay format
  yearlyDayssetoff = 31536000000 / 1000; // (360 (days)* 24(hrs) * 60(min) * 60(sec) * 1000)/1000 divided by 1000 to get the date in razorpay format
  monthlyAmountDmd: number; // monthly diamond amount
  yearlyAmountDmd: number; // yearly diamond amount
  yearlyAmountSlv: number; // yearly silver amount
  subscriptionmothlyplan_id: string; // monthly plan Id for gold
  subscriptionyearlyplan_id: string; // yearly plan Id for gold
  subscriptionmothlyplan_id_dmd: string; // monthly plan Id for diamond
  subscriptionyearlyplan_id_dmd: string; // yearly plan Id for diamond
  subscriptionyearlyplan_id_slv: string; // yearly plan Id for silver
  currencyforPay: string;
  razorpay_key = environment.RAZORPAY_KEY_ID; // zenys razorpay key
  userDataSubscription: Subscription;
  place: string;
  constructor(
    private zone: NgZone,
    private razor: RazorservService,
    private db: RazortodbService,
    public router: Router,
    public dialog: MatDialog,
    private location: Location,
    private common: CommonService
  ) {
    var myzone = jstz.determine().name();
    // myzone="europe/Set"
    // console.log(myzone)
    // var place:string
    if (myzone == 'Asia/Calcutta') this.place = 'India';
    else if (myzone.includes('Europe/')) this.place = 'Europe';
    else this.place = 'US';
    this.monthlyAmount = environment.MONTHLY_AMOUNT_GOLD[this.place];
    this.monthlyAmountDmd = environment.MONTHLY_AMOUNT_DMD[this.place];
    this.yearlyAmount = environment.YEARLY_AMOUNT_GOLD[this.place];
    this.yearlyAmountDmd = environment.YEARLY_AMOUNT_DMD[this.place];
    //get yearly ammount for silver plan from environment file
    this.yearlyAmountSlv = environment.YEARLY_AMOUNT_SLV[this.place];
    this.subscriptionmothlyplan_id =
      environment.RZP_MONTHLY_PLAN_ID[this.place];
    this.subscriptionyearlyplan_id = environment.RZP_YEARY_PLAN_ID[this.place];
    this.subscriptionmothlyplan_id_dmd =
      environment.RZP_MONTHLY_PLAN_ID_DMD[this.place];
    this.subscriptionyearlyplan_id_dmd =
      environment.RZP_YEARY_PLAN_ID_DMD[this.place];
      //plan id for silver plan
      this.subscriptionyearlyplan_id_slv =
      environment.RZP_YEARY_PLAN_ID_SLV[this.place];
    this.options.currency = environment.CURRENCY[this.place];
    this.currencyforPay = environment.CURRENCY[this.place];
    this._window = this.razor.nativeWindow; // used to initialise the razorpay popup window
    this.superUserId = this.common.superUserData.superUserId; // gets super User Id from common file
    this.userDataSubscription = this.common.userDatas.subscribe((data) => {
      this.userData = data.superUserDetails; // getting the userData to fill the popup options
      this.options.name =
        this.userData.firstname +
        ' ' +
        (!!this.userData.lastname ? this.userData.lastname : '');
      this.options.prefill = {
        name:
          this.userData.firstname +
          ' ' +
          (!!this.userData.lastname ? this.userData.lastname : ''),
        email: this.userData.email ? this.userData.email : '',
      };
    });

    // },err=>{console.log(err)})
  }
  // paymentHandler =function  (response:any)

  private _window: ICustomWindow;
  public rzp: any; // razorpay object variable

  // options for razorpay payment popup
  public options: any = {
    key: this.razorpay_key,
    decription: 'description',
    notes: {},
    theme: {
      color: '#3880FF',
    },
    modal: {
      ondismiss: () => {
        //if payment window is closed or payment failed
        this.zone.run<any>(() => {
          console.log('failed');
        });
      },
    },
  };

  ngOnInit() {}

  //******Section for pay as you go (manual non recurring payment) ********************/
  // payment function
  async initPay(planType: string, quantity: number) {
    this.options.amount = this.acamount;

    // local variables dont have scope in the razorpay callbacks hence re-initialising here
    var temprazor = this.razor;
    var temp = this.acamount;
    var tempdb = this.db;
    var tempuserId = this.superUserId;
    var prevsubdata = this.userData;
    var days = this.dayssetOff;
    var subType = this.subscriptionType;
    var router = this.router;
    var tempcurrency = this.currencyforPay;
    // the handler function handles the callbacks once the payment is successful in the case of pay as you go (manual payment)
    this.options.handler = function (response) {
      tempdb.addpaytoorder(
        tempuserId,
        response.razorpay_order_id,
        response.razorpay_payment_id,
        Number(temp)
      ); // update the order once the payment is done
      temprazor
        .getpayment(response.razorpay_payment_id)
        .pipe(take(1))
        .subscribe(
          (res) => {
            tempdb.savepayment(tempuserId, res); // fetch the payment details from razorpay
            // tempdb.updateUser(tempuserId,{latestpayment_id:response.razorpay_payment_id})
          },
          (err) => {
            console.log(err);
          }
        );

      if (typeof prevsubdata.paymentHistory == 'undefined') {
        // if payment history doesnt exist i.e. writing to the collection for the first time
        var date1 = Math.floor(Date.now() / 1000);
        var date2 = date1 + days; // add 30 days or 365 days to today
        var dbdata = {
          // data to be store in payment History array of the userData
          payment_id: response.razorpay_payment_id,
          packageDuration: subType,
          paymentMode: 'manual',
          currentCycleStartDate: date1,
          currentCycleEnd: date2,
          plan: planType,
          amount: temp,
          currency: tempcurrency,
        };
        console.log(dbdata);
        tempdb.updateUser(tempuserId, {
          // updating the user
          plan: planType,
          payingCustFromDate: date1,
          packageType: 'single',
          noSubusers: quantity - 1,
          latestpayment_id: response.razorpay_payment_id,
          paymentHistory: [dbdata],
        });
        console.log("1")
        router.navigate(['/dash/home']);
      } else {
        // already payments have been done before
        var date1 = Math.floor(Date.now() / 1000);
        var date2 = date1 + days;
        if (
          prevsubdata.paymentHistory[0].paymentMode == 'manual' &&
          prevsubdata.paymentHistory[0].currentCycleEnd < date1
        ) {
          // if previous payment cycle has expired
          prevsubdata.paymentHistory.unshift({
            payment_id: response.razorpay_payment_id,
            packageDuration: subType,
            paymentMode: 'manual',
            currentCycleStartDate: date1,
            currentCycleEnd: date2,
            plan: planType,
            amount: temp,
            currency: tempcurrency,
          });
          var dbdata1 = {
            plan: planType,
            packageDuration: subType,
            currentCycleStartDate: date1,
            currentCycleEnd: date2,
            paymentHistory: prevsubdata.paymentHistory,
            amount: temp,
            noSubusers: quantity - 1,
            latestpayment_id: response.razorpay_payment_id,
          };
          console.log(dbdata1);
          tempdb.updateUser(tempuserId, dbdata1);
          console.log("2")
          router.navigate(['/dash/home']);
        }

        // else if previous payment is manual and havent expired new plan duration starts on the date the previous one ends
        else if (
          prevsubdata.paymentHistory[0].paymentMode == 'manual' &&
          prevsubdata.paymentHistory[0].currentCycleEnd > date1
        ) {
          let date2: any = prevsubdata.paymentHistory[0].currentCycleEnd + days;
          let date1 = prevsubdata.paymentHistory[0].currentCycleEnd;
          prevsubdata.paymentHistory.unshift({
            payment_id: response.razorpay_payment_id,
            packageDuration: subType,
            paymentMode: 'manual',
            currentCycleStartDate: date1,
            currentCycleEnd: date2,
            plan: planType,
            amount: temp,
            currency: tempcurrency,
          });
          tempdb.updateUser(tempuserId, {
            currentCycleStartDate: date1,
            currentCycleEnd: date2,
            noSubusers: quantity - 1,
            latestpayment_id: response.razorpay_payment_id,
            paymentHistory: prevsubdata.paymentHistory,
          });
          console.log("3")
          router.navigate(['/dash/home']);
        }
        // subscription to manual migration
        if (prevsubdata.paymentHistory[0].paymentMode == 'subscription') {
          // if previous subscription has expired
          if (prevsubdata.paymentHistory[0].subscriptionEnd < date1) {
            var dbdata2 = {
              payment_id: response.razorpay_payment_id,
              paymentMode: 'manual',
              packageDuration: subType,
              currentCycleStartDate: date1,
              currentCycleEnd: date2,
              plan: planType,
              amount: temp,
              currency: tempcurrency,
            };
            tempdb.updateUser(tempuserId, {
              paymentMode: 'manual',
              plan: planType,
              noSubusers: quantity - 1,
              latestpayment_id: response.razorpay_payment_id,
              packageDuration: subType,
              currentCycleStartDate: date1,
              currentCycleEnd: date2,
              paymentHistory: dbdata2,
            });
            console.log("4")
            router.navigate(['/dash/home']);
          }
          // if previous subscription havent expired the new subscription starts on the date the previous one ends
          else if (prevsubdata.paymentHistory[0].subscriptionEnd > date1) {
            let date2: any =
              prevsubdata.paymentHistory[0].subscriptionEnd + days;
            let date1 = prevsubdata.subscriptionEnd;
            prevsubdata.paymentHistory.unshift({
              payment_id: response.razorpay_payment_id,
              packageDuration: subType,
              paymentMode: 'manual',
              currentCycleStartDate: date1,
              currentCycleEnd: date2,
              plan: planType,
              amount: temp,
              currency: tempcurrency,
            });
            let paymentHistory = prevsubdata.paymentHistory;
            tempdb.updateUser(tempuserId, {
              // plan:planType,
              currentCycleStartDate: date1,
              currentCycleEnd: date2,
              noSubusers: quantity - 1,
              latestpayment_id: response.razorpay_payment_id,
              paymentHistory: paymentHistory,
            });
            console.log("5")
            router.navigate(['/dash/home']);
          }
        }
      }
    };
    // create an order through razorpay api
    await this.razor
      .createOrder({
        amount: this.acamount,
        currency: this.currencyforPay,
        receipt: this.reciept,
      })
      .pipe(take(1))
      .subscribe(
        (res: any) => {
          this.orderData = res;
          this.db.saveorders(this.superUserId, this.orderData); // saving that order
          this.options.order_id = res.id; // using that order to create a payment popup
          this.rzp = new this.razor.nativeWindow['Razorpay'](this.options); // initialise the popup window
          this.rzp.open(); // open the popup window
        },
        (err) => {}
      );
  }
  //******Section for pay as you go (manual non recurring payment) ENDS HERE********************/

  //******Section for subscription activation (recurring payment) STARTS HERE********************/
  // create subscription function
  subscription(planType: string, quantity) {
    // the l;ocal variables doesnt have scope in the call back functions so it is re declared and initialised in this function
    var subemail = this.userData.email;
    var subname =
      this.userData.firstname +
      ' ' +
      (!!this.userData.lastname ? this.userData.lastname : '');
    var razorpay_key = this.razorpay_key;
    var monthvar = this.monthvarforsub;
    var tempdb = this.db;
    var temprazor = this.razor;
    var tempid = this.superUserId;
    var tempuserdata = this.userData;
    var subType = this.subscriptionType;
    var router = this.router;
    var description = this.namesub;
    var amount = this.amountsub;
    var tempcurrency = this.currencyforPay;
    var optionsforsub: any = {
      // options for creating subscription
      name: this.namesub,
      period: this.periodsub,
      interval: 1,
      amount: this.amountsub,
      description: this.descriptionsub,
      quantity: quantity,
      plan_id: this.planIdforsubscription, // this is the plan for subscription
      notes: {
        note1: '',
      },
      count: this.countsub,
    };
    if (!!this.nextstartDate) {
      //  console.log(this.nextstartDate)
      optionsforsub.start_at = this.nextstartDate; // nextstartdate is initialsed if and only if there are previous ongoing manual payment or subscriptions
    }
    var optionsforpay = {
      // options to show popup window for payment of subscription. A subscription becomes active only if its paid (either a full payment of a subscription amount or a test payment of Rs.5 )
      key: razorpay_key,
      subscription_id: 'sub_00000000000001', //will be replaced later with real sub id.
      name: this.namecustsub,
      description: description,

      // "image": "/your_logo.png",
      // handler handles the operations once the subscription payment is done
      handler: function (response) {
        // tempdb.updateUser(tempid,{latestsubscription_id:response.razorpay_subscription_id}) // update the user to get the last subscription id
        temprazor
          .getsubscription(response.razorpay_subscription_id)
          .pipe(take(1))
          .subscribe(
            (res: any) => {
              // get the plan and subscription detals from razorpay
              tempdb.savesubscription(tempid, res); // save the subscription details to db
              // console.log(res)
              // if there are no previous subscirption or payments done
              if (typeof tempuserdata.paymentHistory == 'undefined') {
                var dbdata = {
                  plan: planType,
                  packageDuration: subType,
                  packageType: 'single',
                  paymentMode: 'subscription',
                  payingCustFromDate: res.created_at,
                  currentCycleStartDate: res.current_start,
                  currentCycleEnd: res.current_end,
                  subscriptionStart: res.current_start,
                  subscriptionEnd: res.end_at + monthvar,
                  latestsubscription_id: response.razorpay_subscription_id,
                  noSubusers: quantity - 1,
                  paymentHistory: [
                    {
                      subscription_id: response.razorpay_subscription_id,
                      packageDuration: subType,
                      paymentMode: 'subscription',
                      currentCycleStartDate: res.current_start,
                      currentCycleEnd: res.current_end,
                      subscriptionStart: res.current_start,
                      subscriptionEnd: res.end_at + monthvar,
                      charge_at: res.charge_at,
                      plan: planType,
                      amount: amount * quantity,
                      currency: tempcurrency,
                    },
                  ],
                };
                console.log(dbdata);
                tempdb.updateUser(tempid, dbdata);
              }
              // if the previous payment have not ended
              else {
                tempuserdata.paymentHistory.unshift({
                  subscription_id: response.razorpay_subscription_id,
                  packageDuration: subType,
                  paymentMode: 'subscription',
                  currentCycleStartDate: res.current_start,
                  currentCycleEnd: res.current_end,
                  subscriptionStart: res.start_at,
                  subscriptionEnd: res.end_at + monthvar,
                  charge_at: res.charge_at,
                  plan: planType,
                  currency: tempcurrency,
                });
                var dbdata2: any = {
                  packageDuration: subType,
                  packageType: 'single',
                  paymentMode: 'subscription',
                  subscriptionStart: res.start_at,
                  subscriptionEnd: res.end_at + monthvar,
                  paymentHistory: tempuserdata.paymentHistory,
                  amount: amount * quantity,
                  latestsubscription_id: response.razorpay_subscription_id,
                  noSubusers: quantity - 1,
                };
                if (res.start_at <= Date.now() / 1000) {
                  dbdata2.plan = planType;
                }

                console.log(dbdata2);
                tempdb.updateUser(tempid, dbdata2);
              }
            },
            (err) => {
              console.log(err);
            }
          );
          console.log("6")
        router.navigate(['/dash/home']);
      },
      prefill: {
        name: subname,
        email: subemail,
        // "contact": "+919876543210"
      },
      theme: {
        color: '#F37254',
      },
    };
    this.razor
      .subscriptions(optionsforsub)
      .pipe(take(1))
      .subscribe(
        (res: any) => {
          // create the subscription from razorpay

          //console.log(res)
          optionsforpay.subscription_id = res.sub.id;
          //console.log(optionsforpay)
          this.rzp = new this.razor.nativeWindow['Razorpay'](optionsforpay); // open the subscriptions page
          this.rzp.open();
        },
        (err) => {
          // console.log(err)
        }
      );
  }

  //   function to initialise monthly payment gold plan
  monthlyPAYG(quantity) {
    this.acamount = this.monthlyAmount * quantity;
    this.subscriptionType = 'monthly';
    this.dayssetOff = this.monthlyDayssetoff;
    this.initPay('gold', quantity);
  }

  //   function to initialise yearly payment gold plan
  yearlyPAYG(quantity) {
    this.acamount = this.yearlyAmount * quantity;
    this.subscriptionType = 'yearly';
    this.dayssetOff = this.yearlyDayssetoff;
    this.initPay('gold', quantity);
  }
  //   function to initialise monthly subscription gold plan
  monthlySUB(quantity) {
    this.monthvarforsub = this.monthlyDayssetoff;
    this.planIdforsubscription = this.subscriptionmothlyplan_id;
    (this.namesub = 'monthly subscription'),
      (this.periodsub = this.subscriptionType = 'monthly'),
      (this.amountsub = this.monthlyAmount);
    this.descriptionsub = 'subscription for' + this.superUserId;
    this.countsub = 24;
    this.namecustsub =
      this.userData.firstname +
      ' ' +
      (this.userData.lastname ? this.userData.lastname : '');
    if (typeof this.userData.paymentHistory != 'undefined') {
      var today = Math.floor(Date.now() / 1000);

      if (this.userData.paymentHistory[0].paymentMode == 'subscription') {
        if (this.userData.paymentHistory[0].subscriptionEnd < today) {
          this.nextstartDate = null;
        }
        if (this.userData.paymentHistory[0].subscriptionEnd > today) {
          this.nextstartDate = this.userData.paymentHistory[0].subscriptionEnd;
        }
      }
      if (this.userData.paymentHistory[0].paymentMode == 'manual') {
        if (this.userData.paymentHistory[0].currentCycleEnd < today) {
          this.nextstartDate = null;
        }
        if (this.userData.paymentHistory[0].currentCycleEnd > today) {
          this.nextstartDate = this.userData.paymentHistory[0].currentCycleEnd;
        }
      }
    }
    this.subscription('gold', quantity);
  }

  //   function to initialise yearly subscription gold plan
  yearlySUB(quantity) {
    this.monthvarforsub = this.yearlyDayssetoff;
    this.planIdforsubscription = this.subscriptionyearlyplan_id;
    (this.namesub = 'yearly subscription'),
      (this.periodsub = this.subscriptionType = 'yearly'),
      (this.amountsub = this.yearlyAmount);
    this.descriptionsub = 'subscription for' + this.superUserId;
    this.countsub = 5;
    this.namecustsub =
      this.userData.firstname +
      ' ' +
      (this.userData.secondname ? this.userData.secondname : '');
    if (typeof this.userData.paymentHistory != 'undefined') {
      var today = Math.floor(Date.now() / 1000);

      if (this.userData.paymentHistory[0].paymentMode == 'subscription') {
        if (this.userData.paymentHistory[0].subscriptionEnd < today) {
          this.nextstartDate = null;
        }
        if (this.userData.paymentHistory[0].subscriptionEnd > today) {
          this.nextstartDate = this.userData.paymentHistory[0].subscriptionEnd;
        }
      }
      if (this.userData.paymentHistory[0].paymentMode == 'manual') {
        if (this.userData.paymentHistory[0].currentCycleEnd < today) {
          this.nextstartDate = null;
        }
        if (this.userData.paymentHistory[0].currentCycleEnd > today) {
          this.nextstartDate = this.userData.paymentHistory[0].currentCycleEnd;
        }
      }
    }
    this.subscription('gold', quantity);
  }

  //   function to initialise monthly payment diamond plan
  monthlyPAYGDMD(quantity) {
    this.acamount = this.monthlyAmountDmd * quantity;
    this.subscriptionType = 'monthly';
    this.dayssetOff = this.monthlyDayssetoff;
    this.initPay('diamond', quantity);
  }

  //   function to initialise yearly payment diamond plan
  yearlyPAYGDMD(quantity) {
    this.acamount = this.yearlyAmountDmd * quantity;
    this.subscriptionType = 'yearly';
    this.dayssetOff = this.yearlyDayssetoff;
    this.initPay('diamond', quantity);
  }

  //   function to initialise monthly subscription  diamond plan
  monthlySUBDMD(quantity) {
    this.monthvarforsub = this.monthlyDayssetoff;
    this.planIdforsubscription = this.subscriptionmothlyplan_id_dmd;
    (this.namesub = 'Monthly Subscription'),
      (this.periodsub = this.subscriptionType = 'monthly'),
      (this.amountsub = this.monthlyAmountDmd);
    this.descriptionsub = 'subscription for' + this.superUserId;
    this.countsub = 24;
    this.namecustsub =
      this.userData.firstname +
      ' ' +
      (this.userData.lastname ? this.userData.lastname : '');
    if (typeof this.userData.paymentHistory != 'undefined') {
      var today = Math.floor(Date.now() / 1000);

      if (this.userData.paymentHistory[0].paymentMode == 'subscription') {
        if (this.userData.paymentHistory[0].subscriptionEnd < today) {
          this.nextstartDate = null;
        }
        if (this.userData.paymentHistory[0].subscriptionEnd > today) {
          this.nextstartDate = this.userData.paymentHistory[0].subscriptionEnd;
        }
      }
      if (this.userData.paymentHistory[0].paymentMode == 'manual') {
        if (this.userData.paymentHistory[0].currentCycleEnd < today) {
          this.nextstartDate = null;
        }
        if (this.userData.paymentHistory[0].currentCycleEnd > today) {
          this.nextstartDate = this.userData.paymentHistory[0].currentCycleEnd;
        }
      }
    }
    this.subscription('diamond', quantity);
  }

  //   function to initialise yearly subscription  diamond plan
  yearlySUBDMD(quantity) {
    this.monthvarforsub = this.yearlyDayssetoff;
    this.planIdforsubscription = this.subscriptionyearlyplan_id_dmd;
    (this.namesub = 'Yearly Subscription'),
      (this.periodsub = this.subscriptionType = 'yearly'),
      (this.amountsub = this.yearlyAmountDmd);
    this.descriptionsub = 'subscription for' + this.superUserId;
    this.countsub = 5;
    this.namecustsub =
      this.userData.firstname +
      ' ' +
      (this.userData.secondname ? this.userData.secondname : '');
    if (typeof this.userData.paymentHistory != 'undefined') {
      var today = Math.floor(Date.now() / 1000);

      if (this.userData.paymentHistory[0].paymentMode == 'subscription') {
        if (this.userData.paymentHistory[0].subscriptionEnd < today) {
          this.nextstartDate = null;
        }
        if (this.userData.paymentHistory[0].subscriptionEnd > today) {
          this.nextstartDate = this.userData.paymentHistory[0].subscriptionEnd;
        }
      }
      if (this.userData.paymentHistory[0].paymentMode == 'manual') {
        if (this.userData.paymentHistory[0].currentCycleEnd < today) {
          this.nextstartDate = null;
        }
        if (this.userData.paymentHistory[0].currentCycleEnd > today) {
          this.nextstartDate = this.userData.paymentHistory[0].currentCycleEnd;
        }
      }
    }
    this.subscription('diamond', quantity);
  }

  //SILVER PLANS
  
  //function to initialise yearly payment silver plan by manual payment
  yearlyPAYGSLV(quantity) {
    //amount to be paid 
    this.acamount = this.yearlyAmountSlv * quantity;
    //subscription type set as yearly payment
    this.subscriptionType = 'yearly';
    this.dayssetOff = this.yearlyDayssetoff;
    //initialise payment
    this.initPay('leadManagement', quantity);
  }

  //   function to initialise yearly subscription silver plan
  yearlySUBSLV(quantity) {
    this.monthvarforsub = this.yearlyDayssetoff;
    this.planIdforsubscription = this.subscriptionyearlyplan_id_slv;
    //for yealrly subscription
    (this.namesub = 'Yearly Subscription'),
      (this.periodsub = this.subscriptionType = 'yearly'),
      (this.amountsub = this.yearlyAmountSlv);
    this.descriptionsub = 'subscription for' + this.superUserId;
    this.countsub = 5;
    this.namecustsub =
      this.userData.firstname +
      ' ' +
      (this.userData.secondname ? this.userData.secondname : '');
    if (typeof this.userData.paymentHistory != 'undefined') {
      var today = Math.floor(Date.now() / 1000);

      if (this.userData.paymentHistory[0].paymentMode == 'subscription') {
        if (this.userData.paymentHistory[0].subscriptionEnd < today) {
          this.nextstartDate = null;
        }
        if (this.userData.paymentHistory[0].subscriptionEnd > today) {
          this.nextstartDate = this.userData.paymentHistory[0].subscriptionEnd;
        }
      }
      if (this.userData.paymentHistory[0].paymentMode == 'manual') {
        if (this.userData.paymentHistory[0].currentCycleEnd < today) {
          this.nextstartDate = null;
        }
        if (this.userData.paymentHistory[0].currentCycleEnd > today) {
          this.nextstartDate = this.userData.paymentHistory[0].currentCycleEnd;
        }
      }
    }
    //create subscription
    this.subscription('leadManagement', quantity);
  }

  // returns the type of the obj
  typeOf(obj) {
    return typeof obj;
  }

  homepage() {
    console.log("7")
    this.router.navigate(['/dash/home']);
  }

  onBack() {
    this.location.back();
  }

  openpopup(plan) {
    const dialogRef = this.dialog.open(SelectpopupComponent, {
      width: '500px',
      data: { plan: plan, currency: this.currencyforPay, place: this.place },
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          // get plan and number of sub users

          if (plan == 'gold') {
            if (result.plan == 'paygyearly')
              //manual payment yearly
              this.yearlyPAYG(result.quantity);
            else if (result.plan == 'paygmonthly')
              //manual payment monthly
              this.monthlyPAYG(result.quantity);
            else if (result.plan == 'subyearly')
              // subscription yearly
              this.yearlySUB(result.quantity);
            else if (result.plan == 'submonthly')
              //subscription monthly
              this.monthlySUB(result.quantity);
          }
          if (plan == 'diamond') {
            if (result.plan == 'paygyearly')
              this.yearlyPAYGDMD(result.quantity);
            else if (result.plan == 'paygmonthly')
              this.monthlyPAYGDMD(result.quantity);
            else if (result.plan == 'subyearly')
              this.yearlySUBDMD(result.quantity);
            else if (result.plan == 'submonthly')
              this.monthlySUBDMD(result.quantity);
          }
          if (plan == 'leadManagement') {
            console.log('silver');
            console.log(result.plan);
            if (result.plan == 'paygyearly')
            //manual payment yearly
              this.yearlyPAYGSLV(result.quantity);
            else if (result.plan == 'subyearly')
              // subscription yearly
              this.yearlySUBSLV(result.quantity);
          }
        }
      });
  }
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.userDataSubscription.unsubscribe();
  }
}
