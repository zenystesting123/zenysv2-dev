/**********************************************************************************
Description: Component is used to connect fbPages to CRM form configuration UI.
             This page list all the pages and forms configured in Facebook through graph api.
Inputs: 
Outputs:
Child : pageSettingsComponent :-
        Description: Used to map fb form fields with CRM fields to add a contact through fb lead forms.
**********************************************************************************/
import { Component, OnChanges, OnInit, SimpleChanges,OnDestroy } from '@angular/core';
import * as firebase from 'firebase';
import { FbLeadsServService } from './fb-leads-serv.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { CommonService } from '../common.service';
import { Location } from '@angular/common';
declare const FB: any;

@Component({
  selector: 'app-fb-leads',
  templateUrl: './fb-leads.component.html',
  styleUrls: ['./fb-leads.component.scss']
})


export class FbLeadsComponent implements OnInit, OnDestroy {
  fb_pages=[] //lists the pages configured in fb
  pageaccountDetails: any; //stores the details of the pages
  longUAT:string; //long access token recieved from graph api
  pageData: any; //page details
  fbloginStat: boolean = false;//FB Login status
  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.
  leadForms: any; //forms present in the selected page
  formQuestions: any; //fields present in the selected form
  pageSelected: boolean = false; //selected page Name 
  superUserID:string;  //superuser's docID
  commonServiceUserSubscription: Subscription; //common service user subscription
  formPresent: boolean = true; //flag to check if form already available in db
  selectedPageID: string; //selected page's ID
  selectedPageName: string; //selected page's Name
  selectedFormID: string; //selected form's ID
  selectedFormName: string; //selected form's Name
  formSelected: boolean = false; //flag to check if form is selected or not
  forms: {}[]; //to store all forms details stored in db
  formIds: any[]; //stored form id's
  filteredOptions: any[] = []; //filtered forms list in form search
  searchTerm = ''; //input entry to search in tag users
  fieldNameContact: string = 'Contact';//contact fieldName

  constructor(
   public fbLeadsService: FbLeadsServService,
   public commonService: CommonService,
   private location: Location
  ) { }

  //unsubscribe the subscriptions on leaving page
  ngOnDestroy(): void {
    this.commonServiceUserSubscription?.unsubscribe;
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
  
  ngOnInit(): void {
    this.fb_pages = [];
    //subscribe to common service file and get userDatas
    this.commonServiceUserSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        //get the super user id
        this.superUserID = allData.superUserDetails.superUserId;
        //find the custom field name for Contact module
        if(allData.superUserDetails.fieldNames){
          this.fieldNameContact = allData.superUserDetails.fieldNames.fieldNameContact;
        }
      });
  // let self = this;
    //this.loaderService.show();
    //self.applicationId = "466740060734339";  // **Enter your Created FB App's ID**
    //self.loadFBSDK();
    //initialize SDK for facebook by passing a collection of initialization parameters that control the setup of the SDK
    //appId - Your application ID.
    //xfbml - Determines whether XFBML tags used by social plugins are parsed, and therefore whether the plugins are rendered or not.
    //version - Determines which versions of the Graph API and any API dialogs or plugins are invoked when using the .api() and .ui() functions.
    (<any>window).fbAsyncInit = () => {
      FB.init({
        appId: '961512658158567', //replace with production
        xfbml: false,
        version: 'v15.0'
      });
    };
    //loads and initialises sdk
    (function (d, s, id) {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-js-sdk'));
    //take forms data from db
    this.fbLeadsService.getForms(this.superUserID).pipe(takeUntil(this.onDestroy$))
    .subscribe((data) => {
      this.forms = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as {};
      });
      //store form id values in separate array
      this.formIds = this.forms.map(val => val['id']);
    });
  }

  //invoked when user clicks the fb login button
   myFacebookLogin() {
    //call login function for authentication and get login response
    FB.login((loginResponse) => {
      //if userID is obtainedc in login response, login success
      if(loginResponse.authResponse.userID){
        this.fbloginStat = true;
      }
      //Receive the authentication token from login response, which is saved as shortUAT
      let shortUAT = loginResponse.authResponse.accessToken;
      //call the cloud function to call the graph api using shortUAT
      //to retrieve the page data and long UAT
      const getLong_FB_UAT = firebase.default
      .functions()
      .httpsCallable('getLong_FB_UAT');
      getLong_FB_UAT({shortUAT}).then((resp) => {
        //store the long access token
        this.longUAT = resp.data.LongUAT;
        //store the page data
        this.pageData = resp.data.pages.data;
      })
      //pass the permissions to the graph api so that the app can retrieve corresponding information.
      //'pages_show_list' - allows your app to access the list of Pages a person manages.
      //'leads_retrieval' - allows your app to retrieve and read all information captured by a lead ads form associated with an ad created in Ads Manager or the Marketing API.
      //'pages_manage_ads' - allows your app to manage ads associated with the Page.
      //'pages_manage_metadata' - allows your app to subscribe and receive webhooks about activity on the Page, and to update settings on the Page.
      //'pages_read_engagement' - allows your app to read content (posts, photos, videos, events) posted by the Page, read followers data (including name, PSID), and profile picture, and read metadata and other insights about the Page.
    }, { scope : ['pages_show_list', 'leads_retrieval', 'pages_manage_ads', 'pages_manage_metadata', 'pages_read_engagement']});
  }

  //Function not used now. But keeping for reference
  //Used to retrieve list of pages using short UAT
  getUserInfo(userId) {
    //this function was used earlier to get list of pages using short UAT
    let self = this;
    //api call to retrieve name, account details and email of the user
    //accounts contains the page details
    FB.api(
      "/" + userId + '?fields=name,accounts,email',
      (result) => {
        if (result && !result.error) {
          self.pageaccountDetails = result.accounts.data
        }
        else {
        }
      });
  }

  //invoked when user selects the page from the page list
  subscribeApp(page_id, page_name, page_access_token) {
    //First check if a db entry is present for the selected page
    this.pageSelected = true;
    let self = this;
    this.fbLeadsService.readPageRecord(page_id).pipe(takeUntil(this.onDestroy$))
    .subscribe((doc) => {
      if(doc){
        //Page is already connected - nothing needs to be done
      } else {
        //if entry is not present in db
        FB.api( //suscribe the page to app
          '/' + page_id + '/subscribed_apps','post',{access_token: page_access_token, subscribed_fields: ['leadgen']},
          function(response) {
            if(response.success){
              //add the page details to database
              self.fbLeadsService.createFBPageRecord(page_id,page_name, page_access_token,self.superUserID)
            }
          }
        );
      }
      //selected page details are updated
      this.selectedPageID = page_id;
      this.selectedPageName = page_name;
      //get form associated with page
      this.getForms(page_id,page_access_token) 
    })
  }

  //
  getQuestions(formId, formName){
    this.selectedFormID = formId;
    this.selectedFormName = formName;
    let self = this;
    //check if formId is present in db
    this.fbLeadsService.readFormRecord(formId).pipe(takeUntil(this.onDestroy$))
      .subscribe((doc) => {
        if(doc){
          //Page is already connected - nothing needs to be done
          this.formPresent = true;
          this.formSelected = true;

        } else {
          //if entry is not present in db
          this.formPresent = false;
          this.formSelected = true;
        }
      });
    FB.api('/'+formId,
      'post',
      {access_token: this.longUAT,fields:['questions']},
      function(response){
        //console.log("Questions associated with form", response)
        self.formQuestions = response.questions;
      }
    )
  }

  //fetch the forms present in the page 
  getForms(pageID,pageAccessToken){
    let self = this;
    //api call to retrive the forms data 
    FB.api('/v16.0/ '+pageID+'/leadgen_forms',
    'get',
    {access_token: pageAccessToken},
    function(response){
      self.leadForms= response.data;
      //show form names on initial load before searching
      self.filteredOptions = response.data;
    }
    )
  }

  //triggered on clicking back icon to moving back to previous page
  onBack() {
    this.location.back();
  }

  //search form name entered by the user
  applyFilter($event) {
    //search for the user input data in the form names
    this.searchTerm = $event;
    //filter subuser list with user input
    this.filteredOptions = this.leadForms.filter((item) =>
      item.name.toLowerCase().includes($event)
    );
  }

  //invoked when user clears search form
  clearSearchTerm() {
    //input box values are cleared
    this.searchTerm = '';
    //reset filteredOptions value with all the forms
    this.filteredOptions = [...this.leadForms];
  }

  }
