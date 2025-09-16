/*------------------------------------------------------------------------------------------------
Description : Home page For web and mobile
in Web:       Shows guideline card setting cards
              Shows the number of todays task , meeting and followups
              shows the number of open inquiries
              Shows recent contact, salesm invoices and payment
              Have contact sales and invoicing and payment chart
              Shows the inivitation message if the user get and invitation


---------------------------------------------------------------------------------------------------*/

import {
  Customer,
  Invoice,
  Task,
  Sales,
  PaymentReceipt,
  Inquiries,
  FollowUps,
  InvitationModel,
  Profile,
  UserAccessDetails,
  SubUsers,
} from './../data-models';
import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { SelectsaledialogComponent } from '../selectsaledialog/selectsaledialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Addcontactpopup1Component } from '../addcontactpopup1/addcontactpopup1.component';
import { Addnewsale1Component } from '../addnewsale1/addnewsale1.component';
import { DatePipe } from '@angular/common';

import { NetworkCheckService } from '../networkcheck.service';
import { CommonService } from '../common.service';
import { take, takeUntil } from 'rxjs/operators';
import { GoogleCalendarEventService } from '../calendar-events/google-calendar-event.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { CrudModal1Component } from '../taskboard/crud-modal1/crud-modal1.component';
import { FollowupTaskCreateComponent } from '../followup-task-create/followup-task-create.component';
import { GoogleCalandarEventsDetailsComponent } from '../calendar-events/google-calandar-events-details/google-calandar-events-details.component';
import { OutlookCalendarEventService } from '../outlook-calendar-events/outlook-calendar-event.service';
import { OutlookCalendarEventsDetailsComponent } from '../outlook-calendar-events/outlook-calendar-events-details/outlook-calendar-events-details.component';

// var themeColors = [$primary, $warning, $success, $danger, $info];
@Component({
  selector: 'app-dashhome',
  templateUrl: './dashhome.component.html',
  styleUrls: ['./dashhome.component.scss'],
  animations: [
    trigger('FlyIn', [
      transition('void=>*', [
        style({ opacity: 0, transform: 'translateY(-50%)' }),
        animate('100ms'),
      ]),
      transition('*=>void', [
        animate('100ms', style({ opacity: 0, transform: 'translateY(-100%)' })),
      ]),
    ]),
    trigger('fadeIn', [
      transition('void=>*', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('400ms', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition('*=>void', [
        animate('400ms', style({ opacity: 0, transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class DashhomeComponent implements OnInit, OnDestroy {
  invitations: InvitationModel[]; // for storing invitations
  invitedEmail: string; //store user email id and used for checking this email exist on invitation list
  invitation: InvitationModel; // for storing invited details
  pendingInvitation: boolean = false; // checking pending invitation
  lastName: string; // user last name
  isSuperUser: boolean = false; // check if user type is super user or not
  settingsView: boolean = false; //checks for mobile view side toolbar setting open or not
  networkConnection: boolean; // for hecking the network connection
  // monthWisepaymentCollectionLength: number; // current month payment list length
  // currentMonthInvoiceLength: number; // current month invoice list length
  expiryFlag: boolean; // checking plan vaidity
  inquiryLength: number = 0; // store pending inquiry list length
  // customerList: Customer[]; // stores customer list
  invoices: Invoice[]; // stores invoice list
  // currentMonthInvoices: Invoice[]; // list of current month invoices
  balanceDaysFlag: boolean; // checking balance day of user plan
  sales: Sales[]; // sales list
  inquiries: Inquiries[]; // inquiries list
  isMobilesize: boolean = false; // checks for mobile size
  // currentMonthPaymentRecevied: PaymentReceipt[]; // list of current month payments
  lengthOfCustomerFlag: boolean = false; // check if customer created or not(for preenting add sale)
  lengthOfSaleFlag: boolean = false; // check if sales created or not(for preenting add documents)
  userId: string; //Logged in user's id
  superUserId: string; //org level data is stored in the super user id (super user Id will be same as user Id for single user scenario)
  dataAccessRule: string; // check user acess rule(all, own)
  accountType: string; // store account type of uer
  todaytask: Task[] = []; // stores todays task
  openTasks: Task[] = []; // stores todays task
  today: Date; // current day
  disableInvoices: boolean; // disable invoice creation
  isLoaded: boolean = false; // check all datas are fetched from db
  plan: string; // user plan
  activeSubscriptionDateEnd: number; // stores active subscription end date
  invoicedAmount: number = 0; // stores invoiced amount
  collectedAmount: number = 0; // stores collected amount
  // todayFollowUps: FollowUps[] = []; // stores toays followups
  openFollowUps: FollowUps[] = []; // stores open followups
  todayFollowUpsLength: number = 0; // stores todays followup length
  recentPayment: PaymentReceipt[]; // stores recent payments
  // saleStatusEstimateValue: number[]; // store sales estimated
  profileVisiblity: Boolean = false; // for showing profile creation card
  // customerStatusCount: number[]; // for storing customer status length (for chart series)
  settingsCard: boolean; // configure settingscard display boolean
  publicProfileID: string; // stores public profile id
  isProfileCreated: boolean = false; // checks is profile created
  currentDateForMeeting: Date = new Date(); // currwnt date for meeting
  connectGMailCalendarDisplay: boolean = true; // checks if google calendar loaded or not
  connectOutlookCalendarDisplay: boolean = true; // checks if outlook calendar loaded or not
  userName: string; // user first name
  usrProfileData: UserAccessDetails; // user profile access details
  disableSett: boolean = false; // disable settings
  disableAddContact: boolean = false; // disable dd contact
  disableViewContact: boolean = false; // disble view contact
  disableSaleView: boolean = false; // disable sales view
  disableSaleAdd: boolean = false; // disale add sale
  disableDocView: boolean = false; // disable doc view
  disableDocEst: boolean = false; // disable doc view
  disableDocQuot: boolean = false; // disable doc view
  disableDocInv: boolean = false; // disable doc view
  disableDocCreateInv = false;
  disableCollView = false;
  isFirstTimeUser: boolean; // check for guide line card
  subscriptioncyclepaymentflag: boolean; // not used now
  recentCustomers: Customer[]; // recent customer list
  recentSales: Sales[]; // recent sales list
  superUserDetails: Profile; // stores super user details
  fieldNameContact: string = 'Contact'; // feild name for contact
  fieldNameSale: string = 'Sale'; // feild name for sale
  fieldNameFollowup: string = 'FollowUp'; // feild name for followup
  fieldNameTask: string = 'Task'; // feild name for task
  fieldNameMeeting: string = 'Meeting'; // feild name for meeting
  fieldNameEstimate: string = 'Estimate'; // feild name for Estimate
  fieldNameQuotation: string = 'Quotation'; // feild name for Quotation
  fieldNameInvoice: string = 'Invoice'; // feild name for Invoice
  fieldNameCollection: string = 'Collection'; // feild name for Collection
  fieldNameExpense: string = 'Expense';
  fieldNameItems: string = 'Products and Service';
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  disableInvBtn: boolean = false; //to disable confirm/decline invitation button after one click
  user: firebase.default.UserInfo;
  subUsers: SubUsers[];
  isInquiryApiRunning: boolean = false;
  isSaleApiRunning: boolean = false;
  isCustomerApiRunning: boolean = false;
  isInvoiceApiRunning: boolean = false;
  isPaymentApiRunning: boolean = false;
  // isInvoiceMonthWiseApiRunning: boolean = false;
  // isPaymentMonthWiseApiRunning: boolean = false;
  // isCustomerMonthWiseApiRunning: boolean = false;
  // isSaleMonthWiseApiRunning: boolean = false;
  isCustomerSubWiseApiRunning: boolean = false;
  isSaleSubApiRunning: boolean = false;
  isInvoiceSubApiRunning: boolean = false;
  isPaymentSubApiRunning: boolean = false;
  isCustomerSubMonthWiseApiRunning: boolean = false;
  isSaleSubMonthWiseApiRunning: boolean = false;
  // isTaskApiRunning: boolean = false;
  isFollowupApiRunning: boolean = false;
  // isCustomerTeamWiseApiRunning: boolean = false;
  // isSaleTeamRunning: boolean = false;
  isOpenTaskApiRunning: boolean = false;
  taskDialog: any;
  followUpDialog: any;
  taskOptions: any;
  defaultTaskOption: any = ['Open','Completed'];//default taskOption value
  lastTaskStatusOpn:string;
  enableLiteMode:boolean=false;//enable lite mode
  gmailConnected: boolean; //to check if gmail calendar is connected
  outlookConnected: boolean; //to check if outlook calendar is connected
  constructor(
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private router: Router,
    private afAuth: AngularFireAuth,
    private homeService: HomeService,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    public googleCalendarEventService: GoogleCalendarEventService,
    public outlookCalendarEventService: OutlookCalendarEventService,
    private snack: MatSnackBar,
    private changeDetectorRef:ChangeDetectorRef
  ) {
    // this.customerStatusCount = []; //initializing the customer status count
    // this.saleStatusEstimateValue = []; //initializing the sale status count
    this.today = new Date(); // bind current day
    //getting the user details by subscribing userdatas
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        if (allData.authDetails) {
          this.user = allData.authDetails;
          // check if signed in
          this.isMobilesize = allData.isMobileSize; // get screen size
          this.userId = allData.authDetails.uid; //read the id of the signed in user
          let userData = allData.userDetails; // get user details
          if(allData.userDetails.enableLiteMode){
            this.enableLiteMode = allData.userDetails.enableLiteMode
          }
          if (userData) {
            // if user data exists
            this.invitedEmail = userData.email; // bind the mail id
            this.isFirstTimeUser = userData.isFirstTimeUser; // bind is first time user to show the guideline card
            // configure settingscard display boolean
            if (userData.firstSettingsCard == false) {
              this.settingsCard = userData.firstSettingsCard;
            } else if (userData.firstSettingsCard) {
              this.settingsCard = userData.firstSettingsCard;
            }
            this.userName = userData?.firstname; // bind the user first name
            this.lastName = userData?.lastname; // bind user second name
            if (userData.accountType == 'SuperUser') {
              // if account type is super user set isSuperUser as true
              this.isSuperUser = true;
            } else if (userData.accountType == 'Admin') {
              // if account type is admin user set isSuperUser as true
              this.isSuperUser = true;
            } else {
              // if account type is not super user or admin set isSuperUser as false
              this.isSuperUser = false;
            }
            this.subUsers = allData.subUsers;
            // check if the user is in invitations collection
            this.homeService
              .getInvitations()
              .pipe(takeUntil(this.onDestroy$))
              .subscribe((data) => {
                this.invitations = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as InvitationModel;
                });
                if (this.invitations.length > 0) {
                  // checks initation list length
                  for (let i = 0; i < this.invitations.length; i++) {
                    if (this.invitations[i].email === this.invitedEmail) {
                      // checks if user email id is in that list
                      this.invitation = this.invitations[i];
                      if (this.invitation) {
                        // if email exist in that list set pending initation as true
                        this.pendingInvitation = true;
                        break;
                      }
                    }
                  }
                }
              });
            if (userData.superUserId) {
              // sets the super user id
              this.superUserId = userData.superUserId;
            } else {
              this.superUserId = this.userId; //if there is no superuserId present in user details use user id as super user id
            }
            // profile settings access checks
            this.usrProfileData = allData.usrProfileData;

            if (this.usrProfileData) {
              // setting dataAccessRule
              this.dataAccessRule = this.usrProfileData.dialogdataAccessRule;
              // disable settings
              if (this.usrProfileData.isCheckedSett == false) {
                // if the check box is false
                this.disableSett = true; // disable setting
              } else if (this.usrProfileData.settView == false) {
                // if disable setting
                this.disableSett = true; // disable setting
              }
              // contact access check for contact
              if (this.usrProfileData.isCheckedCont == false) {
                // if the check box is false
                this.disableAddContact = true; // disable add contact
                this.disableViewContact = true; // disable view contact
              } else {
                if (this.usrProfileData.contactsCreate == false) {
                  // if disable add contact
                  this.disableAddContact = true; // disable add contact
                }
                if (this.usrProfileData.contactsView == false) {
                  // if disable view contact
                  this.disableViewContact = true; // disable view contact
                }
              }
              // disable Sale create and view
              if (this.usrProfileData.isCheckedSale == false) {
                // if the check box is false
                this.disableSaleAdd = true; // disable add sale
                this.disableSaleView = true; // disable view sale
              } else {
                if (this.usrProfileData.salesCreate == false) {
                  // if disable add sale
                  this.disableSaleAdd = true; // disable add sale
                }
                if (this.usrProfileData.salesView == false) {
                  // if disable view sales
                  this.disableSaleView = true; // disable view sale
                }
              }
              // disable Sale doc create and view
              if (this.usrProfileData.isCheckedSalesEst == false) {
                this.disableDocEst = true;
              } else {
                if (this.usrProfileData.salesDViewEst == false) {
                  this.disableDocEst = true;
                }
              }
              if (this.usrProfileData.isCheckedSalesQuot == false) {
                this.disableDocQuot = true;
              } else {
                if (this.usrProfileData.salesDViewQuot == false) {
                  this.disableDocQuot = true;
                }
              }


              if (this.usrProfileData.isCheckedSalesInv == false) {
                this.disableInvoices = true; // disable add sale doc
                this.disableDocInv = true;
                this.disableDocCreateInv = true;
              } else {
                if (this.usrProfileData.salesDViewInv == false) {
                  this.disableDocInv = true;
                  this.disableInvoices = true; // disable add sale doc
                }
                if (this.usrProfileData.salesDCreateInv == false) {
                  this.disableDocCreateInv = true;
                }
              }

              // disable collection
              if (this.usrProfileData.isCheckedColl == false) {
                this.disableCollView = true;
              } else if (this.usrProfileData.collectionsView == false) {
                this.disableCollView = true;
              }
            }

            if (userData.accountType == 'SuperUser') {
              // if account type is super user
              this.profileVisiblity = true; // for displaying the profile creation button only for super user
              this.publicProfileID = userData.publicProfileID;
              //checking whether profile is already created or not
              this.homeService
                .getProfile('/public-profile', this.publicProfileID)
                .pipe(take(1))
                .subscribe((profile) => {
                  if (profile) {
                    this.isProfileCreated = true; // if profile already created set isProfileCreated as true
                  }
                });
            } else {
              //if it is a subuser the profile creation button is hided
              this.profileVisiblity = false;
            }
            this.accountType = userData.accountType;
            // set the field name from super user
            let superUserData = allData.superUserDetails;
            this.superUserDetails = superUserData;
            if (this.superUserDetails.fieldNames) {
              this.fieldNameContact =
                this.superUserDetails.fieldNames.fieldNameContact; // for contact
              this.fieldNameSale =
                this.superUserDetails.fieldNames.fieldNameSale; // for sale
              this.fieldNameTask =
                this.superUserDetails.fieldNames.fieldNameTask; // for task
              this.fieldNameMeeting =
                this.superUserDetails.fieldNames.fieldNameMeeting; // for meeting
              this.fieldNameFollowup =
                this.superUserDetails.fieldNames.fieldNameFollowup; // for followup
              this.fieldNameEstimate =
                this.superUserDetails.fieldNames.fieldNameEstimate; // for estimate
              this.fieldNameQuotation =
                this.superUserDetails.fieldNames.fieldNameQuotation; // for quotation
              this.fieldNameInvoice =
                this.superUserDetails.fieldNames.fieldNameInvoice; // for invoice
              this.fieldNameCollection =
                this.superUserDetails.fieldNames.fieldNameCollection; // for collection
              this.fieldNameExpense =
                this.superUserDetails.fieldNames.fieldNameExpense; // for expense
              this.fieldNameItems =
                this.superUserDetails.fieldNames.fieldNameItems; // for roduct and services
            }

            //taskOptions
            this.taskOptions = this.superUserDetails.taskStatusOpn?this.superUserDetails.taskStatusOpn:this.defaultTaskOption
            this.lastTaskStatusOpn = this.taskOptions[this.taskOptions.length - 1]
            this.plan = superUserData?.plan; // get user plan
            
            
            // this.customerStatus = superUserData.custStatus; // bind super user customer status
            // this.saleStatus = superUserData.saleStatus; // bind super user sale status
            // checking and updating subscriptions and payments
            // get the current subscription details if the cyclehas ended from razorpay and check the status if its active. if its active save the payment history in db
            if (superUserData?.plan != 'free') {
              if (
                superUserData?.paymentHistory[0].paymentMode == 'subscription'
              ) {
                this.activeSubscriptionDateEnd =
                  superUserData?.paymentHistory[0].subscriptionEnd;
                let subcycleend =
                  superUserData?.paymentHistory[0].currentCycleEnd;
                if (subcycleend < Date.now() / 1000) {
                  this.homeService
                    .getsubscription(
                      superUserData?.paymentHistory[0].subscription_id
                    )
                    .subscribe((data: any) => {
                      if (data.status == 'pending' || data.status == 'halted') {
                        this.subscriptioncyclepaymentflag = false;
                      }
                      if (data.status == 'active') {
                        var paymentupdate = {
                          charge_at: data.charge_at,
                          currentCycleEnd: data.current_end,
                          currentCycleStartDate: data.current_start,
                          packageDuration:
                            superUserData?.paymentHistory[0].packageDuration,
                          paymentMode: 'subscription',
                          subscriptionEnd:
                            superUserData?.paymentHistory[0].subscriptionEnd,
                          subscriptionStart:
                            superUserData?.paymentHistory[0].subscriptionStart,
                          subscription_id:
                            superUserData?.paymentHistory[0].subscription_id,
                        };
                        var paymentHistory = superUserData?.paymentHistory;
                        paymentHistory[0] = paymentupdate;
                        this.homeService.updatePaymentHistory(
                          this.superUserId,
                          paymentHistory
                        );
                      }
                    });
                }
                if (this.activeSubscriptionDateEnd < Date.now() / 1000) {
                  // if paln validity ended set expiryFlag as true
                  this.expiryFlag = true;
                }
                if (this.activeSubscriptionDateEnd > Date.now() / 1000) {
                  this.expiryFlag = false;
                  if (
                    this.activeSubscriptionDateEnd - Date.now() / 1000 <
                    604800
                  ) {
                    // if paln validity ended set expiryFlag as true
                    this.balanceDaysFlag = true;
                  }
                }
              }
              // checks if plan subscription is ended
              if (superUserData?.paymentHistory[0].paymentMode == 'manual') {
                this.activeSubscriptionDateEnd =
                  superUserData?.paymentHistory[0].currentCycleEnd;
                if (
                  superUserData?.paymentHistory[0].currentCycleEnd <
                  Date.now() / 1000
                ) {
                  // if paln validity ended set expiryFlag as true
                  this.expiryFlag = true;
                }
                if (
                  superUserData?.paymentHistory[0].currentCycleEnd >
                  Date.now() / 1000
                ) {
                  this.expiryFlag = false;
                  if (
                    this.activeSubscriptionDateEnd - Date.now() / 1000 <
                    604800
                  )
                    // if paln validity ended set expiryFlag as true
                    this.balanceDaysFlag = true;
                }
              }
            }
            if (this.dataAccessRule) {
              //if data access rule is all
              if (this.dataAccessRule == 'All') {
                // if (this.isMobilesize) {
                //assigned to superuserId for mobile view
                // this.getInquiryFromSuperUser(); // get inquiry list
                // this.getSalesFromSuperUserMobile(); // get sales list
                // this.getCustomerFromSuperUserMobile(); // get customer list
                // this.getInvoiceFromSuperUserMobile(); // get invoice list
                // this.getRecentPaymentReceiptFromSuperUserMobile(); // get collection list

                // here the chart is loaded in mobile also need to change whilemoving to mobile
                // its used for getting month wise invoice payment customer and sales list
                // this.getInvoiceFromSuperUserForChart();
                // this.getPaymentReceiptFromSuperUserForChart();
                // this.getMonthWiseCustomerFromSuperUser();
                // this.getMonthWiseSalesFromSuperUser();
                // ***********------*******
                // } else {
                //assigned to  superuserId
                this.getRecentCustomerFromSuperUser(); // get recent customer for recent card
                this.getRecentSalesFromSuperUser();
                this.getInquiryFromSuperUser(); // get inquiry list
                // this.getMonthWiseCustomerFromSuperUser(); // get current moth wise created customer for chart
                // this.getMonthWiseSalesFromSuperUser(); // get current moth wise created sales for chart
                this.getRecentInvoiceFromSuperUser(); // get recent invoices
                // this.getInvoiceFromSuperUserForChart(); // get current moth wise created invoice for chart
                // this.getPaymentReceiptFromSuperUserForChart(); // get current moth wise created collction for chart
                this.getRecentPaymentReceiptFromSuperuser(); // get recent payments
                // }
              } else if (this.dataAccessRule == 'Own') {
                // if (this.isMobilesize) {
                //assigned to  userId
                // this.getCustomerFromSubUserMobile(); // get customer list
                // this.getSalesFromSubUserMobile(); // get skales list
                // this.getInvoiceFromSubUserMobile(); // get invoice list
                // this.getRecentPaymentReceiptSubUserFromApiMobile(); // get collection list
                // here the chart is loaded in mobile also need to change whilemoving to mobile
                // its used for getting month wise  customer and sales list
                // this.getMonthWiseCustomerFromSubUser();
                // this.getMonthWiseSalesFromSubUser();
                // } else {
                //assigned to userId
                this.getRecentCustomerFromSubUser(); // get recent customer
                this.getRecentSalesFromSubUser();
                // this.getMonthWiseCustomerFromSubUser(); // get current month wise created customer for chart
                // this.getMonthWiseSalesFromSubUser(); // get current month wise created sales for chart
                this.getInquiryFromSubUser(); //need to check for subuser inquiy needed or not
                // }
              } else if (this.dataAccessRule == 'Team') {
                // for team aacess rule
                // if (this.isMobilesize) {
                //assigned to  userId
                // this.getCustomerFromSubUserMobile(); // get customer list
                // this.getSalesFromSubUserMobile(); // get sales list
                // this.getInvoiceFromSubUserMobile(); // get invoice list
                // this.getRecentPaymentReceiptSubUserFromApiMobile(); // get collection list
                // here the chart is loaded in mobile also need to change whilemoving to mobile
                // its used for getting month wise  customer and sales list
                // this.getMonthWiseCustomerFromSubUser();
                // this.getMonthWiseSalesFromSubUser();
                // } else {
                //assigned to userId
                // this.getMonthWiseCustomerTeam(); // get current month wise created customer for chart
                // this.getMonthWiseSalesTeam(); // get current month wise created sales for chart
                // }
              }
            } else {
              //data access rule is not set
              // if (this.isMobilesize) {
              //assigned to superuserId for mobile view
              // this.getInquiryFromSuperUser(); // get inquiry list
              // this.getSalesFromSuperUserMobile(); // get sales list
              // this.getCustomerFromSuperUserMobile(); // get customer list
              // this.getInvoiceFromSuperUserMobile(); // get invoice list
              // this.getRecentPaymentReceiptFromSuperUserMobile(); // get collection list

              // here the chart is loaded in mobile also need to change whilemoving to mobile
              // its used for getting month wise invoice payment customer and sales list
              // this.getInvoiceFromSuperUserForChart();
              // this.getPaymentReceiptFromSuperUserForChart();
              // this.getMonthWiseCustomerFromSuperUser();
              // this.getMonthWiseSalesFromSuperUser();
              // } else {
              //assigned to  superuserId
              this.getRecentCustomerFromSuperUser(); // get recent customer for recent card
              this.getRecentSalesFromSuperUser();
              this.getInquiryFromSuperUser(); // get inquiry list
              // this.getMonthWiseCustomerFromSuperUser(); // get current moth wise created customer for chart
              // this.getMonthWiseSalesFromSuperUser(); // get current moth wise created sales for chart
              this.getRecentInvoiceFromSuperUser(); // get recent invoices
              // this.getInvoiceFromSuperUserForChart(); // get current moth wise created invoice for chart
              // this.getPaymentReceiptFromSuperUserForChart(); // get current moth wise created collction for chart
              this.getRecentPaymentReceiptFromSuperuser(); // get recent payments
              // }
            }
            // this.getFollowupListFromApi(); //read followup from super user id assignedto the current user
            this.getOpenFollowupListFromApi(); //read open followup from super user id assignedto the current user
            // this.getTaskFromApi(); //read task from super user id assignedto the current user
            this.getOpenTasksFromApi(); //Read all the open taks
          }
        }
      });
  }
  ngOnInit(): void {
    //for initialize the google login part
    this.googleCalendarEventService.initClient.subscribe((data) => {
      if (data) {
        this.onDayChange(this.currentDateForMeeting); //getting current days meeting
        this.connectGMailCalendarDisplay = false; // check if user is already login if not show the connect calendar part
        this.gmailConnected = true;
      } else {
        this.connectGMailCalendarDisplay = true;
        this.gmailConnected = false;
      }
      this.changeDetectorRef.detectChanges();
    });
    //to initialize the outlook login part
    if (this.outlookCalendarEventService.checkloginStatus()) {
      this.onDayChangeOutlook(this.currentDateForMeeting); //fetch day wise event
      this.connectOutlookCalendarDisplay = false;  //hide connect
      this.outlookConnected = true;
    } else {
      this.connectOutlookCalendarDisplay = true;
      this.outlookConnected = false;
    }
    this.changeDetectorRef.detectChanges();
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    // on destroy
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  //adding the sale
  onAddSale() {
    const dialogRef = this.dialog.open(Addnewsale1Component, {
      width: '800px',
      height: 'auto',
      disableClose: true,
      data: { scenario: 'create' },
    });
  }
  //adding the customer and limiting is the free user contact creation if there is more than limited customers
  onAddCustomer() {
    if (
      this.plan == 'free' &&
      this.commonService.addDocLimitaion.addSaleDisable
    ) {
    } else {
      const dialogRef = this.dialog.open(Addcontactpopup1Component, {
        width: '580px',
        height: 'auto',
        minHeight: '100px',
        disableClose: true,
        data: { scenario: 'create' },
      });
    }
  }
  //creating the invoice
  onCreateInvoice() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      userId: this.userId,
      docType: 'Invoice',
      id: null,
    };
    const dialogRef = this.dialog.open(SelectsaledialogComponent, dialogConfig);
  }



  // remove this
  // get current month payments for super user
  // getPaymentReceiptFromSuperUserForChart() {
  //   // this.isPaymentMonthWiseApiRunning = true;
  //   let date = new Date();
  //   let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  //   let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  //   this.homeService
  //     .getPayment(this.superUserId, firstDay, lastDay)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.currentMonthPaymentRecevied = [];
  //       this.currentMonthPaymentRecevied = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as PaymentReceipt;
  //       });
  //       this.monthWisepaymentCollectionLength =
  //         this.currentMonthPaymentRecevied?.length;
  //       // this.isPaymentMonthWiseApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }
  // get recent payment for super user
  getRecentPaymentReceiptFromSuperuser() {
    this.isPaymentApiRunning = true;
    this.homeService
      .getRecentPayment(this.superUserId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.recentPayment = [];
        this.recentPayment = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as PaymentReceipt;
        });
        this.isPaymentApiRunning = false;
        this.updateValueToUi();
      });
  }
  // get recent payment for sub user
  getRecentPaymentReceiptSubUserFromApi() {
    this.homeService
      .getRecentPaymentSubUser(this.userId, this.superUserId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.recentPayment = [];
        this.recentPayment = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as PaymentReceipt;
        });
      });
  }
  // get recent invoices for super user
  getRecentInvoiceFromSuperUser() {
    this.isInvoiceApiRunning = true;
    this.homeService
      .getInvoices(this.superUserId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.invoices = [];
        this.invoices = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Invoice;
        });
        this.isInvoiceApiRunning = false;
        this.updateValueToUi();
      });
  }
  //remove this
  // get current month invoics for super user
  // getInvoiceFromSuperUserForChart() {
  //   this.isInvoiceMonthWiseApiRunning = true;
  //   let date = new Date();
  //   let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  //   let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  //   this.homeService
  //     .getInvoicesDash(this.superUserId, firstDay, lastDay)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.currentMonthInvoices = [];
  //       this.currentMonthInvoices = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as Invoice;
  //       });
  //       this.currentMonthInvoiceLength = this.currentMonthInvoices?.length;
  //       this.isInvoiceMonthWiseApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }




  // get all open followups for today
  getOpenFollowupListFromApi() {
    this.isFollowupApiRunning = true;
    this.homeService
      .getOpenFollowUps(this.superUserId, this.userId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.openFollowUps = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as FollowUps;
        });
        // this.todayFollowUpsLength = this.todayFollowUps.length;
        this.isFollowupApiRunning = false;
        this.updateValueToUi();
      });
  }
  //remove this
  // get all open followups for today
  // getFollowupListFromApi() {
  //   this.isFollowupApiRunning = true;
  //   this.homeService
  //     .getFollowUps(this.superUserId, this.userId)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.todayFollowUps = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as FollowUps;
  //       });
  //       this.todayFollowUpsLength = this.todayFollowUps.length;
  //       this.isFollowupApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }
  //closing the guidance prompt
  onCloseCard() {
    this.homeService.onUpdateUserFirstTimeStatus(this.userId);
  }
  // closing card of configure Settings of First Time USer
  onCloseCard2() {
    this.homeService.onUpdatesettingCard(this.userId);
  }
  // for guidance car routing
  docSettings() {
    // route to document settings
    this.router.navigate(['/dash/settings/docsettings']);
  }
  custSettings() {
    // route to customer settings
    this.router.navigate(['/dash/settings/custsettings']);
  }
  saleSettings() {
    // route to sale settings
    this.router.navigate(['/dash/settings/salessettings']);
  }
  profileSettings() {
    // route to profile settings
    this.router.navigate(['/dash/settings/profilesettings']);
  }

  // get inquiry list for super user
  getInquiryFromSuperUser() {
    this.isInquiryApiRunning = true;
    this.homeService
      .getInquiries(this.superUserId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.inquiries = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Inquiries;
        });
        // find the length and if view status is false increase badge number
        this.inquiryLength = this.inquiries.length;
        //remove this
        // this.badgeNo = 0;
        // for (let i = 0; i < this.inquiries.length; i++) {
        //   if (this.inquiries[i].viewStatus == false) {
        //     this.badgeNo++;
        //   }
        // }
        this.isInquiryApiRunning = false;
        this.updateValueToUi();
      });
  }
  // get current month wise customer for super user
  // getMonthWiseCustomerFromSuperUser() {
  //   this.isCustomerMonthWiseApiRunning = true;
  //   let date = new Date();
  //   let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  //   let last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  //   last.setHours(23);
  //   last.setMinutes(59);
  //   last.setSeconds(59);
  //   last.setMilliseconds(999);
  //   let lastDay = new Date(last).getTime();
  //   this.homeService
  //     .getCustomers(this.superUserId, firstDay, lastDay)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.customerList = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as Customer;
  //       });
  //       this.customerStatusCount = []; // initialize status count
  //       this.customerStatus.forEach((stats) => {
  //         // for each the customer status
  //         let tempCustomer = this.customerList.filter(
  //           // filter by status
  //           (it) => it.status === stats
  //         );
  //         if (tempCustomer != null) {
  //           // if status equals push the length
  //           this.customerStatusCount.push(tempCustomer.length); // gert length of status according too customer ststus
  //         } else {
  //           // if customer status not equals to status push 0
  //           this.customerStatusCount.push(0);
  //         }
  //       });
  //        this.isCustomerMonthWiseApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }
  // get current month wise sales for super user
  // getMonthWiseSalesFromSuperUser() {
  //   this.isSaleMonthWiseApiRunning = true;
  //   let date = new Date();
  //   let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  //   let last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  //   last.setHours(23);
  //   last.setMinutes(59);
  //   last.setSeconds(59);
  //   last.setMilliseconds(999);
  //   let lastDay = new Date(last).getTime();
  //   this.homeService
  //     .getSales(this.superUserId, firstDay, lastDay)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.sales = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as Sales;
  //       });
  //       this.saleStatusEstimateValue = []; // initialize status count
  //       this.saleStatus.forEach((status) => {
  //         // fore each the sale status
  //         let tempSales = this.sales.filter((it) => it.salesStage === status); // filter by status
  //         let estimateSum = 0; // initialize estimate sum
  //         if (tempSales != null) {
  //           tempSales.forEach((ele) => {
  //             // sum the sale estimate
  //             estimateSum += ele.estimatedValue;
  //           });
  //           estimateSum = Math.round(estimateSum); // round the estimated value
  //         }
  //         this.saleStatusEstimateValue.push(estimateSum); // push estimate sum
  //       });
  //       this.isSaleMonthWiseApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }
  // get current month wise customer for sub user
  // getMonthWiseCustomerFromSubUser() {
  //   this.isCustomerSubMonthWiseApiRunning = true;
  //   let date = new Date();
  //   let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  //   let last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  //   last.setHours(23);
  //   last.setMinutes(59);
  //   last.setSeconds(59);
  //   last.setMilliseconds(999);
  //   let lastDay = new Date(last).getTime();
  //   this.homeService
  //     .getCustomerssubuser(this.superUserId, this.userId, firstDay, lastDay)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.customerList = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as Customer;
  //       });
  //       this.customerStatusCount = []; // initialize status count
  //       this.customerStatus.forEach((stats) => {
  //         // for each the customer status
  //         let tempCustomer = this.customerList.filter(
  //           // filter by status
  //           (it) => it.status === stats
  //         );
  //         if (tempCustomer != null) {
  //           // if status equals push the length
  //           this.customerStatusCount.push(tempCustomer.length); // gert length of status according too customer ststus
  //         } else {
  //           // if customer status not equals to status push 0
  //           this.customerStatusCount.push(0);
  //         }
  //       });
  //       this.isCustomerSubMonthWiseApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }
  // get current month wise sales for sub user
  // getMonthWiseSalesFromSubUser() {
  //   this.isSaleSubMonthWiseApiRunning = true;
  //   let date = new Date();
  //   let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  //   let last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  //   last.setHours(23);
  //   last.setMinutes(59);
  //   last.setSeconds(59);
  //   last.setMilliseconds(999);
  //   let lastDay = new Date(last).getTime();
  //   this.homeService
  //     .getSalessubuser(this.superUserId, this.userId, firstDay, lastDay)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.sales = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as Sales;
  //       });

  //       this.saleStatusEstimateValue = []; // initialize status count
  //       this.saleStatus.forEach((status) => {
  //         // fore each the sale status
  //         let tempSales = this.sales.filter((it) => it.salesStage === status); // filter by status
  //         let estimateSum = 0; // initialize estimate sum
  //         if (tempSales != null) {
  //           tempSales.forEach((ele) => {
  //             // sum the sale estimate
  //             estimateSum += ele.estimatedValue;
  //           });
  //           estimateSum = Math.round(estimateSum); // round the estimated value
  //         }
  //         this.saleStatusEstimateValue.push(estimateSum); // push estimate sum
  //       });
  //       this.isSaleSubMonthWiseApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }
  //need to chek if it is required
  getInquiryFromSubUser() {
    this.isInquiryApiRunning = true;
    this.homeService
      .getInquiriessubuser(this.superUserId, this.userId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.inquiries = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Inquiries;
        });
        this.inquiryLength = this.inquiries.length;
        this.isInquiryApiRunning = false;
        this.updateValueToUi();
      });
  }
  // get todats task for current
  getOpenTasksFromApi() {
    this.isOpenTaskApiRunning = true;
    this.homeService
      .getOpenTasks(this.superUserId, this.userId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
       let tasks = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Task;
        });
        // filter pen task
        this.openTasks = tasks.filter(task => task.status !== this.lastTaskStatusOpn);
        this.isOpenTaskApiRunning = false;
        this.updateValueToUi();
      });
  }
  // remove this
  // getTaskFromApi() {
  //   this.isTaskApiRunning = true;
  //   this.homeService
  //     .getTasks(this.superUserId, this.userId)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.todaytask = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as Task;
  //       });
  //       this.isTaskApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }
  //remove this
  // // get sales for super user in mobile
  // getSalesFromSuperUserMobile() {
  //   this.isSaleApiRunning = true;
  //   this.homeService
  //     .getSalesMobile(this.superUserId)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.sales = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as Sales;
  //       });
  //       this.isSaleApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }
  // get recent sales for super user
  getRecentSalesFromSuperUser() {
    this.isSaleApiRunning = true;
    this.homeService
      .getRecentSales(this.superUserId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.recentSales = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Sales;
        });
        if (this.recentCustomers?.length >= 1) {
          this.lengthOfCustomerFlag = true;
        }
        if (this.recentSales.length >= 1) {
          this.lengthOfSaleFlag = true;
        }
        this.isSaleApiRunning = false;
        this.updateValueToUi();
      });
  }
  //remove this
  // get recent sales for sub user mobile
  // getSalesFromSubUserMobile() {
  //   this.isSaleSubApiRunning = true;
  //   this.homeService
  //     .getSalessubuserMobile(this.superUserId, this.userId)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.sales = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as Sales;
  //       });
  //       this.isSaleSubApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }
  // get recent sales for sub user
  getRecentSalesFromSubUser() {
    this.isSaleApiRunning = true;
    this.homeService
      .getRecentSalesSubuser(this.superUserId, this.userId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.recentSales = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Sales;
        });
        if (this.recentCustomers?.length >= 1) {
          this.lengthOfCustomerFlag = true;
        }
        if (this.recentSales.length >= 1) {
          this.lengthOfSaleFlag = true;
        }
        this.isSaleApiRunning = false;
        this.updateValueToUi();
      });
  }
  // get customer for super user in mobile
  // getCustomerFromSuperUserMobile() {
  //   this.isCustomerApiRunning = true;
  //   this.homeService
  //     .getCustomersMobile(this.superUserId)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.customerList = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as Customer;
  //       });
  //       this.isCustomerApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }
  // get recent customers for super user
  getRecentCustomerFromSuperUser() {
    this.isCustomerApiRunning = true;
    this.homeService
      .getRecentCustomers(this.superUserId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.recentCustomers = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Customer;
        });
        this.isCustomerApiRunning = false;
        this.updateValueToUi();

      });
  }
  //remove this
  // get custmer for sub user in mobile
  // getCustomerFromSubUserMobile() {
  //   this.isCustomerSubWiseApiRunning = true;
  //   this.homeService
  //     .getCustomersSubuserMobile(this.superUserId, this.userId)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.customerList = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as Customer;
  //       });
  //       this.isCustomerSubWiseApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }
  // get recent customers for sub user
  getRecentCustomerFromSubUser() {
    this.isCustomerSubWiseApiRunning = true;
    this.homeService
      .getRecentCustomersSubuser(this.superUserId, this.userId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.recentCustomers = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Customer;
        });


        this.isCustomerSubWiseApiRunning = false;
        this.updateValueToUi();
      });
  }
  // // get recent invoices for super user in mobile
  // getInvoiceFromSuperUserMobile() {
  //   this.isInvoiceApiRunning = true;
  //   this.homeService
  //     .getInvoicesMobile(this.superUserId)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.invoices = [];
  //       this.invoices = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as Invoice;
  //       });
  //       this.isInvoiceApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }
  //remove this
  // // get recent customers for sub user in mobile
  // getInvoiceFromSubUserMobile() {
  //   this.isInvoiceSubApiRunning = true;
  //   this.homeService
  //     .getInvoicesSubUserMobile(this.userId, this.superUserId)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.invoices = [];
  //       this.invoices = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as Invoice;
  //       });
  //       this.isInvoiceSubApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }
  // get recent collection for super user in mobile
  // getRecentPaymentReceiptFromSuperUserMobile() {
  //   this.isPaymentApiRunning = true;
  //   this.homeService
  //     .getRecentPaymentMobile(this.superUserId)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.recentPayment = [];
  //       this.recentPayment = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as PaymentReceipt;
  //       });
  //       this.isPaymentApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }
  //remove this..
  // // get recent collection for sub user in mobile
  // getRecentPaymentReceiptSubUserFromApiMobile() {
  //   this.isPaymentSubApiRunning = true;
  //   this.homeService
  //     .getRecentPaymentSubUserMobile(this.userId, this.superUserId)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data) => {
  //       this.recentPayment = [];
  //       this.recentPayment = data.map((e) => {
  //         return {
  //           id: e.payload.doc.id,
  //           ...(e.payload.doc.data() as {}),
  //         } as PaymentReceipt;
  //       });
  //       this.isPaymentSubApiRunning = false;
  //       this.updateValueToUi();
  //     });
  // }
  //getting the current date meetings
  onDayChange(currentDateForMeeting: Date) {
    this.currentDateForMeeting = currentDateForMeeting;
    var currentDay = currentDateForMeeting;
    currentDay.setHours(0, 0, 0);
    var nextDay = new Date(currentDay.getTime() + 1000 * 60 * 60 * 24);
    this.googleCalendarEventService.currentDay = currentDay;
    this.googleCalendarEventService.nextDays = nextDay;
    this.googleCalendarEventService.calendarView = 'dayMobile';
    this.googleCalendarEventService.getDayCalendarToday();

  }
  //login for google
  async onGoogleLogin() {
    await this.googleCalendarEventService.login();
    this.gmailConnected = this.googleCalendarEventService.checkloginStatus();
    this.connectGMailCalendarDisplay = false;
    this.onDayChange(this.currentDateForMeeting);

  }

  //login for outlook
  async onOutlookLogin() {
    await this.outlookCalendarEventService.login();
    this.outlookConnected = this.outlookCalendarEventService.checkloginStatus();
    console.log(this.outlookConnected)
    this.connectOutlookCalendarDisplay = false;
    this.onDayChangeOutlook(this.currentDateForMeeting);

  }

   //getting the current date meetings
   onDayChangeOutlook(currentDateForMeeting: Date) {
    this.currentDateForMeeting = currentDateForMeeting;
    var currentDay = currentDateForMeeting;
    currentDay.setHours(0, 0, 0);
    var nextDay = new Date(currentDay.getTime() + 1000 * 60 * 60 * 24);
    this.outlookCalendarEventService.currentDay = currentDay;
    this.outlookCalendarEventService.nextDays = nextDay;
    this.outlookCalendarEventService.calendarView = 'dayMobile';
    this.outlookCalendarEventService.getDayCalendarToday();

  }

  // for network checks
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  // toggle nav bar settings for mobile
  toggleSettingsView() {
    this.settingsView = !this.settingsView;
  }


  // decline invitation for user
  onDeclineInv() {
    this.disableInvBtn = true; //disable button from further clicking
    this.pendingInvitation = false;
    // step 1:change status of invitation to declined
    this.homeService
      .declineinv(this.invitation.id)
      .then((res) => {
        // step 2:trigger a mail to invited person
        this.homeService
          .sendEmail({
            to: this.invitation.superUserEmail,
            template: {
              name: 'decliningInvitation',
              data: {
                userName: this.userName,
                accountType: this.invitation.accountType,
              },
            },
          })
          .then((res) => {
            this.snack.open('Invitation', 'declined', {
              duration: 3000,
            });
          })
          .catch((e) => {
            this.snack.open('Declining invitation failed', 'error', {
              duration: 3000,
            });
          });
      })
      .catch((e) => {
        this.snack.open('Declining invitation failed', 'error', {
          duration: 3000,
        });
      });
  }
  onConfirmedInv() {
    this.disableInvBtn = true; //disable button from further clicking
    // step 1: users accountType change to invited role, superuserId change to invited's id
    this.homeService
      .updateAccount(
        this.userId,
        this.invitation.accountType,
        this.invitation.superUserId
      )
      .then((res) => {
        // step 2:add userid under invited's subuser collection
        let newUser = {
          userId: this.userId,
          accountType: this.invitation.accountType,
          email: this.invitation.email,
          firstname: this.userName,
          lastname: this.lastName,
        };
        this.homeService.updateSubUser(this.invitation.superUserId, newUser);
      })
      .then((res2) => {
        // step 3:status of invitation changed to active
        this.homeService.confirminv(this.invitation.id);
      })
      .then((res4) => {
        // step 4: confirmation mail sending to invited person
        this.homeService.sendEmail({
          to: this.invitation.superUserEmail,
          template: {
            name: 'confirmInvitation',
            data: {
              userName: this.userName,
              accountType: this.invitation.accountType,
            },
          },
        });
      })
      .then((res5) => {
        this.snack.open('Invitation', 'confirmed', {
          duration: 3000,
        });
        this.pendingInvitation = false;
      })
      .catch((e) => {
        this.snack.open('Confirming invitation failed', 'error', {
          duration: 3000,
        });
      });
  }

  // get current month wise customer for team
  // async getMonthWiseCustomerTeam() {
  //   this.isCustomerTeamWiseApiRunning =true
  //   let date = new Date();
  //   let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  //   let last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  //   last.setHours(23);
  //   last.setMinutes(59);
  //   last.setSeconds(59);
  //   last.setMilliseconds(999);
  //   let lastDay = new Date(last).getTime();

  //   let contactList: Customer[] = [];
  //   for (let subUser of this.subUsers) {
  //     if (subUser.reportsToId == this.userId) {
  //       let contacts = await this.homeService.getDateWiseContactTeam(
  //         this.superUserId,
  //         subUser.userId,
  //         firstDay,
  //         lastDay
  //       );
  //       contactList.push(...contacts);
  //     }
  //   }
  //   let userContact = await this.homeService.getDateWiseContactTeam(
  //     this.superUserId,
  //     this.userId,
  //     firstDay,
  //     lastDay
  //   );
  //   contactList.push(...userContact);
  //   this.recentCustomers =contactList;
  //   this.customerList = contactList;
  //   this.customerStatusCount = []; // initialize status count
  //   this.customerStatus.forEach((stats) => {
  //     // for each the customer status
  //     let tempCustomer = this.customerList.filter(
  //       // filter by status
  //       (it) => it.status === stats
  //     );
  //     if (tempCustomer != null) {
  //       // if status equals push the length
  //       this.customerStatusCount.push(tempCustomer.length); // gert length of status according too customer ststus
  //     } else {
  //       // if customer status not equals to status push 0
  //       this.customerStatusCount.push(0);
  //     }
  //   });
  //   this.isCustomerTeamWiseApiRunning = false;
  //   this.updateValueToUi();
  // }
  // get current month wise sales for team
  // async getMonthWiseSalesTeam() {
  //   this.isSaleTeamRunning = true;
  //   let date = new Date();
  //   let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  //   let last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  //   last.setHours(23);
  //   last.setMinutes(59);
  //   last.setSeconds(59);
  //   last.setMilliseconds(999);
  //   let lastDay = new Date(last).getTime();
  //   let saleList: Sales[] = [];
  //   for (let subUser of this.subUsers) {
  //     if (subUser.reportsToId == this.userId) {
  //       let sales = await this.homeService.getDateWiseSalesForTeam(
  //         this.superUserId,
  //         subUser.userId,
  //         firstDay,
  //         lastDay
  //       );
  //       saleList.push(...sales);
  //     }
  //   }
  //   let userSales = await this.homeService.getDateWiseSalesForTeam(
  //     this.superUserId,
  //     this.userId,
  //     firstDay,
  //     lastDay
  //   );
  //   saleList.push(...userSales);
  //   this.sales = saleList;
  //   this.recentSales = saleList;
  //   if (this.recentCustomers?.length >= 1) {
  //     this.lengthOfCustomerFlag = true;
  //   }
  //   this.saleStatusEstimateValue = []; // initialize status count
  //   this.saleStatus.forEach((status) => {
  //     // fore each the sale status
  //     let tempSales = this.sales.filter((it) => it.salesStage === status); // filter by status
  //     let estimateSum = 0; // initialize estimate sum
  //     if (tempSales != null) {
  //       tempSales.forEach((ele) => {
  //         // sum the sale estimate
  //         estimateSum += ele.estimatedValue;
  //       });
  //       estimateSum = Math.round(estimateSum); // round the estimated value
  //     }
  //     this.saleStatusEstimateValue.push(estimateSum); // push estimate sum
  //   });
  //   this.isSaleTeamRunning = false;
  //   this.updateValueToUi();
  // }
  updateValueToUi() {
    //checking all the subscription is completed or not
    if (
      this.isInquiryApiRunning ||
      this.isSaleApiRunning ||
      this.isCustomerApiRunning ||
      this.isInvoiceApiRunning ||
      this.isPaymentApiRunning ||
      // this.isInvoiceMonthWiseApiRunning ||
      // this.isPaymentMonthWiseApiRunning ||
      // this.isCustomerMonthWiseApiRunning ||
      // this.isSaleMonthWiseApiRunning ||
      this.isCustomerSubWiseApiRunning ||
      this.isSaleSubApiRunning ||
      this.isInvoiceSubApiRunning ||
      this.isPaymentSubApiRunning ||
      this.isCustomerSubMonthWiseApiRunning ||
      this.isSaleSubMonthWiseApiRunning ||
      this.isFollowupApiRunning
      // this.isTaskApiRunning ||
      // this.isSaleTeamRunning
      // ||
      // // this.isCustomerTeamWiseApiRunning
    ) {
      return;
    }
    this.isLoaded = true; // set isLoaded to true ie. ends spinner
  }

  updateTask(task, taskid: string) {
    this.commonService.updateTaskToEdit(task);
    this.taskDialog = this.dialog.open(CrudModal1Component, {
      width: '1060px',
      height: 'auto',
      disableClose: true,
      data: {
        id: taskid, mode: "update"
      }
    });
    this.taskDialog.afterClosed().subscribe(x => {
      this.taskDialog = null;
    });
  }



  onEditFollowUps(followUp
    // on edit button clicked. Open edit followups
  ) {
    let taskId: string = followUp.id;
    let customerId: string = followUp.customerId;
    let companyName: string = followUp.companyNam;
    let customerName: string = followUp.customerName;
    this.commonService.followUpDetails = followUp;
    this.followUpDialog = this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        id: customerId, // pass customer id
        companyNames: companyName, // pass company name
        customerNames: customerName, // pass customer name
        contactNumber: followUp.contactNumber ? followUp.contactNumber:'', // pass customer number
        countryCode: followUp.countryCode ? followUp.countryCode:'', // pass customer country code
        scenario: 'edit', // scenario for followup popup
        followUpId: taskId, // pass task id
        subUsers: this.subUsers, // pass sub user list
        fname: this.superUserDetails.firstname, // pass super user first name
        lastname: this.superUserDetails.lastname, // pass super user second name
        editFrom: 'table', // pass from  which part the popup is open
      },
    });
    this.followUpDialog.afterClosed().subscribe(x => {
      this.followUpDialog = null;
    });

  }

  dateCheck(date) {
    let inputDateTemp = date?.seconds * 1000;
    let inputDateFormatted = this.datepipe.transform(inputDateTemp, 'yyyy-MM-dd');

    let today = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    if (inputDateFormatted < today) {
      return 'Overdue'
    } else if (inputDateFormatted == today) {
      return 'Due today';
    } else {
      return '';
    }
  }

  onViewEvent(res) { // on click the card open view popup
    console.log(res)
    let dialogRef = this.dialog.open(GoogleCalandarEventsDetailsComponent, {
      width: '600px',
      disableClose: true,
      data: { result: res, scenario: 'view' },
    });
    dialogRef.afterClosed().subscribe(x => {
      dialogRef = null;
    });
  }

  onViewEventOutlook(res) { // on click the card open view popup
    console.log(res)
    let dialogRef = this.dialog.open(OutlookCalendarEventsDetailsComponent, {
      width: '600px',
      disableClose: true,
      data: { result: res, scenario: 'view' },
    });
    dialogRef.afterClosed().subscribe(x => {
      dialogRef = null;
    });
  }

  // navigate to cutsomer list based on the mode selected
  onContactTableRoute(){
    if(this.enableLiteMode){
      this.router.navigate(['/dash/customer-list']);
    }else{
      this.router.navigate(['/dash/contact/customerlist']);
    }
  }
  onFollowupTableRoute() {
    if (this.enableLiteMode) {
      this.router.navigate(['/dash/followup-lite']);
    } else {
      this.router.navigate(['/dash/followuplist']);
    }
  }
  onTaskTableRoute() {
    if (this.enableLiteMode) {
      this.router.navigate(['/dash/task-list']);
    } else {
      this.router.navigate(['/dash/tasks']);
    }
  }
}
