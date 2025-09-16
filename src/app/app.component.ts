import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { SwUpdate } from '@angular/service-worker';
import { PwaserviceService } from './pwaserv/pwaservice.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { CommonService } from './common.service';
import {
  Branch,
  Inquiries,
  messageTemplateModel,
  OrganisationModel,
  ProductModel,
  Profile,
  SubUsers,
  UserAccessDetails,
} from './data-models';
import { takeUntil } from 'rxjs/operators';
import {
  PlanDetails,
  UserDatas,
  UserFeatures,
} from './model/productfeatures.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { FullLayoutService } from './full-layout/full-layout.service';
import { PushnotificationService } from './pushnotification.service';
import { Platform } from '@angular/cdk/platform';
import { Pipelines } from './model/pipeline.modal';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @HostListener('window:mousemove', ['$event']) //event for mouse move,scoll and keydown triggers the activecheck function
  @HostListener('window:scroll', ['$event'])
  @HostListener('window:keydown', ['$event'])
  activeCheck(event: KeyboardEvent) {
    //reset timer
    localStorage.setItem(
      'timeOutTime',
      JSON.stringify(Date.now() + this.timeOuttime)
    );
    if (this.timerIdle) {
      //this.timeridle is undefined when logged out
      this.timerIdle = setTimeout(() => {
        const timeinStorage = JSON.parse(localStorage.getItem('timeOutTime'));
        if (this.afAuth && Date.now() > timeinStorage) {
          /* console.log(
            this.commonService.getLogOut(),
            !!this.superUserDetails.autoLogoutActive
          );*/
          if (!!this.superUserDetails.autoLogoutActive) {
            if (this.commonService.getLogOut() === true) {
              //console.log('loggedOut in app.component');
              this.dialog.closeAll();
              this.commonService.updateAutoLogOut(true);
              this.commonService.callLogOut.next(true);
            } else {
              this.dialog.closeAll();
              this.afAuth.signOut().then(resp=>{
                window.location.reload();
                })
            }
          }
        } else {
        }
      }, this.timeOuttime);
    }
  }
  title = 'Zenys';
  timeOuttime = 900000;
  subUsers: SubUsers[]; //store subusers details
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  userPlan: UserFeatures;
  uploadProgress$: Observable<number>; //to display upload progress of attachment
  isTabletsize: boolean = false; // checking tablet size
  isMobilesize: boolean = false; // checking mobile size
  tabSizeObserver: Subscription; // observing tablet size
  mobSizeObserver: Subscription; // observing mobile size
  downloadUrl: any;
  userDetails: Profile; // current user details
  superUserDetails: Profile; // super user details
  authDetails: firebase.default.UserInfo; // authenticati details
  userProfileData: UserAccessDetails; // user profile access details
  isLoaded: boolean = false; // checking all datas are fetched
  planFetch: string; // user plan (free,gold,diamond,invoicing)
  isInquiryApiRunning: boolean = true; // for checking inquiry subscription is done
  inquiries: Inquiries[]; // inquiries list
  superUserId: string; // super User id
  snapshot: Observable<any>; //to upload attachment
  timerIdle: any;
  autoLogouts = 0; //to get no of auto logouts of employees
  branches: Branch[] = [];
  products: ProductModel[] = [];
  organisations: OrganisationModel[] = [];
  whatsAppTemplates: messageTemplateModel[] = []; //to hold the fetrched whatsapp message templates
  isiOs = false; //boolean to check if platform is ios
  isAndroid = false; //boolean to check if platform is Android
  superUserSubscription: Subscription;// for closing super user subscription
  customerPipelines : Pipelines[]=[]; // customer pipeline array
  salePipelines : Pipelines[]=[];// sale pipeline array
  servicePipelines : Pipelines[]=[];// service pipeline array
  customerPipelineApiRunning: boolean = true;
  salePipelineApiRunning: boolean = true;
  servicePipelineApiRunning: boolean = true;
  loggedInMail = ''; //mail of logged in user
  constructor(
    private swUpdate: SwUpdate,
    public PWA: PwaserviceService,
    public afAuth: AngularFireAuth,
    private commonService: CommonService,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public fullLayoutService: FullLayoutService,
    private Push: PushnotificationService,
    public platform: Platform //to get the platform of logged in user if android/ios/browser
  ) {

    if (this.platform.IOS) {
      this.isiOs = true; //if platform is ios, boolean is set to true
    }
    if (this.platform.ANDROID) {
      this.isAndroid = true; //if platform is android, boolean is set to true
    }
    this.userDetails = null;
    this.superUserDetails = null;
    this.userProfileData = null;
    this.inquiries = []; // ensure empty array before assigning values
    this.subUsers = []; // ensure empty array before assigning values
    this.branches = []; // ensure empty array before assigning values
    this.products = []; // ensure empty array before assigning values
    this.organisations = []; // ensure empty array before assigning values
    this.whatsAppTemplates = []; // ensure empty array before assigning values
    this.authDetails = null;
    this.customerPipelines = [];
    this.salePipelines = [];
    this.servicePipelines = [];

    // check Layout subscription (mobile or tablet  screen)
    this.tabSizeObserver = breakpointObserver
      .observe([Breakpoints.TabletLandscape, Breakpoints.TabletPortrait])
      .subscribe((result) => {
        if (result.matches) {
          this.isTabletsize = true;
        } else {
          this.isTabletsize = false;
        }
        this.commonService.isTabletsize = this.isTabletsize; //Update the data in common service file
      });
    this.mobSizeObserver = breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .subscribe((result) => {
        if (result.matches) {
          this.isMobilesize = true;
        } else {
          this.isMobilesize = false;
        }
        this.commonService.isMobilesize = this.isMobilesize; //Update the data in common service file
      });

    swUpdate.available.subscribe((event) => {});

    // for PWA installation
    window.addEventListener('beforeinstallprompt', (event) => {
      this.PWA.promptEvent = event;
    });
  }
  ngOnInit() {
    //authSubscription subscription
    this.afAuth.authState.pipe(takeUntil(this.onDestroy$)).subscribe((user) => {
      if (user) {
        this.loggedInMail = user.email;
        this.authDetails = user; // bind auth detaios
        // if user
        this.commonService.updateUserAuthDetails(user); //update auth details to common service

        //user details subscription
        this.commonService
          .getUserDetailsFromDb(user.uid)//Entry point
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((userDetails) => {
            if (userDetails){
              if(userDetails.email === this.loggedInMail) {
                this.userDetails = userDetails; // bind user details
                this.superUserId = userDetails.superUserId; // bind super user id
                this.commonService.updateUserData(userDetails); //update user details to common service

                //close super details subscription
                if (this.superUserSubscription && !this.superUserSubscription.closed) {
                  this.superUserSubscription.unsubscribe()
                }
                // get super user details
                this.superUserSubscription = this.commonService
                  .getSuperUserDetailsFromDb(userDetails.superUserId)
                  .pipe(takeUntil(this.onDestroy$))
                  .subscribe((superuserData) => {

                    this.superUserDetails = superuserData; // bind super user details
                    if (this.superUserDetails.logOutTime) {
                      this.timeOuttime = this.superUserDetails.logOutTime;
                    }
                    this.timerIdle = setTimeout(() => {
                      const timeinStorage = JSON.parse(
                        localStorage.getItem('timeOutTime')
                      );
                      if (Date.now() > timeinStorage) {
                        if (!!this.superUserDetails.autoLogoutActive) {
                          if (this.commonService.getLogOut() === true) {
                            // console.log('loggedOut');
                            this.commonService.updateAutoLogOut(true);
                            this.commonService.callLogOut.next(true);
                          } else {
                            this.dialog.closeAll();
                            this.afAuth.signOut().then(resp=>{
                              window.location.reload();
                              })
                          }
                        }
                      } else {
                      }
                    }, this.timeOuttime);
                    this.planFetch = PlanDetails.getPlan(superuserData); // checks the plan is ended or not if eneded return free
                    this.commonService.onUpdatePlanCheck(this.planFetch); // update plan check to common service
                    this.commonService.updateSuperUserData(superuserData); //update super user details to common service
                    //getting the userplan based features
                    // update userplan to common service
                    this.userPlan = PlanDetails.getFeaturePrevilage(
                      //if current plan expires return free plan
                      PlanDetails.getPlan(superuserData)
                    );
                    if(superuserData.createdDate>1704047399000){
                      this.userPlan.serviceAccess = false;
                    }
                    this.commonService.updateUserPlan(this.userPlan); // update user plan to common service

                    // fetch all sub user profiles
                    this.commonService
                      .getsubUsersFormDb(userDetails.superUserId)
                      .pipe(takeUntil(this.onDestroy$))
                      .subscribe((data) => {
                        this.subUsers = data.map((e) => {
                          return {
                            id: e.payload.doc.id,
                            ...(e.payload.doc.data() as {}),
                          } as SubUsers;
                        });
                        // this.subUsers = subUsers.filter(function (e) {
                        //   return e.status != 'suspended';
                        // });
                        // console.log(this.subUsers)
                        this.subUsers.sort((a, b) =>
                          a.firstname < b.firstname ? -1 : 1
                        ); //sort names in ascending order
                        this.commonService.updatesubUserDetails(this.subUsers); //update sub user details to common service
                      });

                    // fetch branches
                    this.commonService
                      .getbranchesFormDb(userDetails.superUserId)
                      .pipe(takeUntil(this.onDestroy$))
                      .subscribe((data) => {
                        this.branches = data.map((e) => {
                          return {
                            id: e.payload.doc.id,
                            ...(e.payload.doc.data() as {}),
                          } as Branch;
                        });
                        this.branches.sort((a, b) => (a.name < b.name ? -1 : 1)); //sort names in ascending order
                        this.commonService.updatebranchDetails(this.branches); //update sub user details to common service
                      });

                    // fetch products
                    this.commonService
                      .getproductsFormDb(userDetails.superUserId)
                      .pipe(takeUntil(this.onDestroy$))
                      .subscribe((data) => {
                        this.products = data.map((e) => {
                          return {
                            id: e.payload.doc.id,
                            ...(e.payload.doc.data() as {}),
                          } as ProductModel;
                        });
                        this.products.sort((a, b) =>
                          a.prodName < b.prodName ? -1 : 1
                        ); //sort names in ascending order
                        this.commonService.updateproductDetails(this.products); //update sub user details to common service
                      });

                    // fetch organisations
                    this.commonService
                      .getorgsFormDb(userDetails.superUserId)
                      .pipe(takeUntil(this.onDestroy$))
                      .subscribe((data) => {
                        this.organisations = data.map((e) => {
                          return {
                            id: e.payload.doc.id,
                            ...(e.payload.doc.data() as {}),
                          } as OrganisationModel;
                        });
                        // console.log(this.organisations)
                        this.organisations.sort((a, b) =>
                          a.companyName < b.companyName ? -1 : 1
                        ); //sort names in ascending order
                        this.commonService.updateOrgDetails(this.organisations); //update sub user details to common service
                      });

                    // fetch whatsapp templates
                    this.commonService
                      .getAllWaTemp(userDetails.superUserId)
                      .pipe(takeUntil(this.onDestroy$))
                      .subscribe((data) => {
                        this.whatsAppTemplates = data.map((e) => {
                          return {
                            id: e.payload.doc.id,
                            ...(e.payload.doc.data() as {}),
                          } as messageTemplateModel;
                        });
                        this.whatsAppTemplates.sort((a, b) =>
                          a.templateName < b.templateName ? -1 : 1
                        ); //sort names in ascending order
                        this.commonService.updateWhatsappTemplates(
                          this.whatsAppTemplates
                        ); //update whatsapp templates to common service
                      });
                    //read the user access control
                    this.commonService
                      .getProfileDefinitionFromDb(
                        userDetails.superUserId,
                        userDetails.accountType
                      )
                      .pipe(takeUntil(this.onDestroy$))
                      .subscribe((userProfileData) => {
                        if (userProfileData) {
                          this.userProfileData = userProfileData[0];
                          this.commonService.updateUsrProfileDetails(userProfileData); //update user access control details to common service
                          if (this.userProfileData?.dialogdataAccessRule == 'All') {
                            // get customer,sales,inquiry,followup list for mobile for user access control is all
                            this.getInqiryListFromApi();
                          } else if (
                            this.userProfileData?.dialogdataAccessRule != 'All'
                          ) {
                            // get customer,sales,inquiry,followup list for mobile for user access control is not all
                            this.getInqiryListFromApi();
                          }
                                        // read customer pipeline

                          this.commonService
                            .getCustomerPipeline(this.superUserId)
                            .pipe(takeUntil(this.onDestroy$))
                            .subscribe((customerPipeline) => {
                              if (customerPipeline) {
                                this.customerPipelines = customerPipeline.customerPipelines;
                                this.commonService.updateCustomerPipelines(
                                  this.customerPipelines
                                );
                                this.customerPipelineApiRunning = false;
                                this.updateValueToUi();
                              }
                            });
                          // read sale pipeline

                          this.commonService
                            .getSalePipeline(this.superUserId)
                            .pipe(takeUntil(this.onDestroy$))
                            .subscribe((salePipeline) => {
                              if (salePipeline) {
                                this.salePipelines = salePipeline.salePipelines;
                                this.commonService.updateSalePipelines(this.salePipelines);
                                this.salePipelineApiRunning = false;
                                this.updateValueToUi();
                              }
                            });
                          // read service pipeline
                          this.commonService
                            .getServicePipeline(this.superUserId)
                            .pipe(takeUntil(this.onDestroy$))
                            .subscribe((servicePipeline) => {
                              if (servicePipeline) {
                                this.servicePipelines = servicePipeline.servicePipelines;
                                this.commonService.updateSuppPipelines(
                                  this.servicePipelines
                                );
                                this.servicePipelineApiRunning = false;
                                this.updateValueToUi();
                              }
                            });
                        }
                      });
                  });

              }
            } else {
              //writing data to observable
              let user = new UserDatas(
                this.userDetails,
                this.superUserDetails,
                this.authDetails?.uid,
                this.userProfileData,
                this.inquiries,
                this.subUsers,
                this.authDetails,
                this.isMobilesize,
                this.isTabletsize,
                this.branches,
                this.products,
                this.organisations,
                this.whatsAppTemplates,
                this.customerPipelines,
                this.salePipelines,
                this.servicePipelines,
              );
              this.commonService.userDatas.next(user as UserDatas); // write as observable
              this.isLoaded = true; // set loaded true if user data doesnt exist
            }
          });
      } else {
        //writing data to observable
        let user = new UserDatas(
          this.userDetails,
          this.superUserDetails,
          this.authDetails?.uid,
          this.userProfileData,
          this.inquiries,
          this.subUsers,
          this.authDetails,
          this.isMobilesize,
          this.isTabletsize,
          this.branches,
          this.products,
          this.organisations,
          this.whatsAppTemplates,
          this.customerPipelines,
          this.salePipelines,
          this.servicePipelines,
        );
        this.commonService.userDatas.next(user as UserDatas); // write as observable
        this.isLoaded = true; // set loaded true if auth details doesnt exist
      }
    });
  }
  updateValueToUi() {
    //checking all the subscription is completed or not
    if (this.isInquiryApiRunning || this.customerPipelineApiRunning || this.salePipelineApiRunning || this.servicePipelineApiRunning) {
      return;
    }
    //writing data to observable
    let user = new UserDatas(
      this.userDetails,
      this.superUserDetails,
      this.authDetails?.uid,
      this.userProfileData,
      this.inquiries,
      this.subUsers,
      this.authDetails,
      this.isMobilesize,
      this.isTabletsize,
      this.branches,
      this.products,
      this.organisations,
      this.whatsAppTemplates,
      this.customerPipelines,
      this.salePipelines,
      this.servicePipelines,
    );
    this.commonService.userDatas.next(user as UserDatas); // write as observable
    this.isLoaded = true; // set isLoaded to true ie. ends spinner
  }

  // get inquiry
  getInqiryListFromApi() {

    this.fullLayoutService
      .getInquiries(this.superUserId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.inquiries = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Inquiries;
        });

        this.isInquiryApiRunning = false;
        this.updateValueToUi();
      });
  }
  @HostListener('window:beforeunload')
  // on destroy
  ngOnDestroy() {
    // removed ng destroy because executed when login and all subscription gets closd
    // this.onDestroy$.next();
    // this.onDestroy$.complete();
    // if (this.tabSizeObserver) {
    //   this.tabSizeObserver.unsubscribe();
    // }
    // if (this.mobSizeObserver) {
    //   this.mobSizeObserver.unsubscribe();
    // }
  }
}
