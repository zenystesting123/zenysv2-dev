import { Observable, Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
// import { DocService } from './doc.service';
import { EstimatemanagementService } from './estimatemanagement.service';
import {
  CustomerData,
  DocData,
  LineItemData,
  Sales,
  UserData,
  PaymentReceipt
} from './../data-models';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Profile } from './../data-models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { DocpreviewComponent } from '../docpreview/docpreview.component';


@Component({
  selector: 'app-estimatemanagement',
  templateUrl: './estimatemanagement.component.html',
  styleUrls: ['./estimatemanagement.component.scss']
})
export class EstimatemanagementComponent implements OnInit {
  cust1Subscription: Subscription;
  user1Subscription: Subscription;
  user2Subscription: Subscription;
  docSubscription: Subscription;
  userDetailsSubscription: Subscription;
  superUserSubscription:Subscription;

  paymentReceiptSubscription: Subscription;
  paymentList:any[];
  paymentLink:any;

  custID: string; //Customer ID of customer for which document is to be processed
  docID: string; //Document ID of document which needs to be viewed/ edited
  scenario: string; //
  docType: string; //Type of document (invoice/ quotation etc)
  userData: UserData; //userData interface
  customerData: CustomerData; //Customer data interface
  docData: DocData; //DocData interface
  // dbUserData: DbUserData;
  //Need to check whether this is really required
  lineItem: LineItemData = {
    slno: 0,
    amount: null,
    amountInclTax: null,
    item: null,
    qty: null,
    unit: null,
    rate: null,
    cgstRate: 0,
    igstRate: 0,
    sgstRate: 0,
    cessRate: 0,
    vatRate:0,
    vatAmount: null,
    cgstAmount: null,
    igstAmount: null,
    sgstAmount: null,
    cessAmount: null,
    description: null,
  }; //initializing the LineItemData interface
  itemList:LineItemData[] = [this.lineItem]; //Line item list stored in an array
  previewMode: boolean = false; //Whether currently document is being previewed
  user: Observable<any>;
  userDetailsAuth: any = null; //user deatails from auth module
  userSignedIn: boolean = false; //whether user is currently signed in
  docSaved: boolean = false; //whether document has been written to database
  lastDocNo: number = 0; //Last document number created (read from user profile)
  saleID: string = ''; //Sale ID under which document is to be created
  loading: boolean = true;
  viewModeLoading: boolean = true;
  usertype: any = null;
  masterId: any = null;
  dataAccessRule: any;
  superUserId: any;
  userRole: any;
  accountType: any;
  logo: boolean;
  sign: boolean;
  userDetails: Observable<Profile>;
  userId: any;
  sale: Observable<Sales>;
  editSubscribed:boolean=false;
  isSmallScreen: boolean = false;
  isTabletsize: boolean = false;
  isMobilesize: boolean = false;
  printTemplate:string=""
  constructor(
    public service: EstimatemanagementService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private router: Router,
    private afAuth: AngularFireAuth,private _snackBar: MatSnackBar,private breakpointObserver: BreakpointObserver
  ) {
    this.isSmallScreen = breakpointObserver.isMatched('(max-width: 599px)');

    breakpointObserver.observe([
      Breakpoints.TabletLandscape,
      Breakpoints.TabletPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this.isTabletsize = true;
      }
      else {
        this.isTabletsize = false;
      }
    });
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this.isMobilesize = true;
      }
      else {
        this.isMobilesize = false;
      }
    });
    //check for changes at a fixed interval to prevent the issue with initial display of data read from database
    setInterval(() => {
      this.ref.detectChanges();
    }, 500);
    route.params.subscribe((val) => {
      //Section 1: Get the information passed on to the module using router link
      this.scenario = this.route.snapshot.paramMap.get('scn');
      this.docType = this.route.snapshot.paramMap.get('docType');
      this.custID = this.route.snapshot.paramMap.get('custID');
      this.docID = this.route.snapshot.paramMap.get('docID');
      this.saleID = this.route.snapshot.paramMap.get('saleID');
      if (this.scenario == 'view') {
        this.previewMode = true;
      } else {
        this.previewMode = false;
      }
    });
  }
  ngOnInit(): void {
    //Section 2: Get the user details from Auth and based on scenario, load the details of user, customer and document
    
    this.service.getuserIDfromshared(this.saleID).subscribe((user:any) => {
      if (user) {
        console.log(user)
        // this.userDetailsAuth = user;
        this.userSignedIn = true;
        this.userId = user.userId;
        this.userDetails = this.service.getUsers(this.userId);
        this.user2Subscription = this.userDetails.subscribe((userdata) => {
          console.log(userdata)
          if (userdata) {
            if (userdata.superUserId) {
              //If the superuserid is set assign it
              this.superUserId = userdata.superUserId;
            }
            else {
              //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
              this.superUserId = this.userId;
            }
            this.dataAccessRule = userdata.dataAccessRule;
            this.userRole = userdata.userRole;
            this.accountType = userdata.accountType;
            this.sale = this.service.getSale(
              this.saleID,
              this.superUserId
            );
            //If scenario is to edit an existing document or view and existing document, read all the document details from the database
            if (this.scenario == 'edit' || this.scenario == 'view') {
              //Read the details from the document being viewed or edited
              this.docSubscription = this.service
                .getDocumentDetails(this.superUserId, this.docType, this.docID)
                .subscribe((docdata) => {
                  console.log(docdata)
                  this.paymentLink=docdata?.paymentLink
                  this.userData = docdata.userData;
                  this.customerData = docdata.customerData;
                  this.docData = docdata.docData;
                  this.docData.docDate = docdata.docData.docDate.toDate();
                  if (docdata.docData.docValidity != null) {
                    this.docData.docValidity = docdata.docData.docValidity.toDate();
                  } else {
                    this.docData.docValidity = docdata.docData.docValidity;
                  }
                  if (docdata.docData.dueDate != null) {
                    this.docData.dueDate = docdata.docData.dueDate.toDate();
                  } else {
                    this.docData.dueDate = docdata.docData.dueDate;
                  }
                  this.itemList = docdata.itemList;
                  this.saleID = docdata.docData.saleID;
                  this.custID = docdata.customerData.custID;
                  this.paymentReceiptSubscription=this.service.getPaymentReceipt(this.superUserId,this.docData.docNumber).subscribe(data=>{
                    this.paymentList = data.map(e=>{
                      return {
                        id:e.payload.doc.id,
                        ...e.payload.doc.data() as {}
                      } as PaymentReceipt
                    });
                  })
                  this.editSubscribed=true;
                  this.viewModeLoading=false
                  if(!this.docData.taxType){
                    this.docData.taxType='gst';
                  }
                  console.log(this.userData)
                });
            }

            //If scenario is to create a new quotation
           
          }
        });
        this.userDetails = this.service.getUsers(this.userId);
        this.userDetailsSubscription = this.userDetails.subscribe((data) => {
          this.printTemplate=data.printTemplate
          if (data) {
            if (data.superUserId) {
              //If the superuserid is set assign it
              this.superUserId = data.superUserId;
            } else {
              //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
              this.superUserId = this.userId;
            }
            if(this.superUserId==this.userId){
              this.logo=data.logoStatus
              this.sign=data.signStatus
              if (this.logo) {
                const userStorageRef1 = firebase.default
                  .storage()
                  .ref()
                  .child('logo/' + this.superUserId);
                userStorageRef1.getDownloadURL().then((url1) => {
                  this.userData.logo = url1;
                });
              }
  
              if (this.sign) {
  
                const userStorageRef2 = firebase.default
                  .storage()
                  .ref()
                  .child('sign/' + this.superUserId);
                userStorageRef2.getDownloadURL().then((url2) => {
                  this.userData.signature = url2;
                });
  
              }
  
            }else{
              this.service.getUsers(this.superUserId).subscribe(data=>{
          this.printTemplate=data.printTemplate
                this.logo=data.logoStatus
                this.sign=data.signStatus
                if (this.logo) {
                  const userStorageRef1 = firebase.default
                    .storage()
                    .ref()
                    .child('logo/' + this.superUserId);
                  userStorageRef1.getDownloadURL().then((url1) => {
                    this.userData.logo = url1;
                  });
                }
    
                if (this.sign) {
    
                  const userStorageRef2 = firebase.default
                    .storage()
                    .ref()
                    .child('sign/' + this.superUserId);
                  userStorageRef2.getDownloadURL().then((url2) => {
                    this.userData.signature = url2;
                  });
    
                }
    
              })
            }
            this.dataAccessRule = data.dataAccessRule;
            this.userRole = data.userRole;
            this.accountType = data.accountType;
            
            
            this.loading = false;
          }
        });
      }
      else {
        //user is not signed in
        this.userDetailsAuth = null;
        this.userSignedIn = false;
      }
    });
  }
  ngOnDestroy(): void {
    if(!!this.user1Subscription)this.user1Subscription.unsubscribe()
    if(!!this.user2Subscription)this.user2Subscription.unsubscribe()
    if (this.editSubscribed) {
      this.docSubscription.unsubscribe();
    }
    else if (this.scenario == 'create') {
      this.cust1Subscription.unsubscribe();
      if(this.superUserId != this.userId){
        this.superUserSubscription.unsubscribe()
      }
    }
    this.userDetailsSubscription.unsubscribe();
    this.docData.docValidity=null;
    this.docData.docDate=null;
    this.docData.dueDate= null;
    this.docData.sgstValue= 0;
    this.docData.cgstValue= 0;
    this.docData.igstValue= 0;
    this.docData.cessValue= 0;
    this.docData.total= 0,
    this.docData.quoteRef= null;
    this.docData.estRef=null;
    this.docData.totalInclTax= 0;
    this.docData.poRef= null;
    this.docData.paymentTerm= null;
    this.docData.docType= null;
    this.docData.includeTax= true;
    this.docData.includeCess= null;
    this.docData.includeUnit=true;
    this.docData.interState= null;
    this.docData.amountCollected= 0;
    this.docData.createdDate=null;
    this.userData.designation=null;
    this.userData.logo=null;
    this.userData.signature=null;
    if(this.itemList.length>0){
      for(let i=1;i<this.itemList.length;){      
        this.itemList.splice(i,1)
      }
     this.itemList.forEach(list=>{
      list.slno= 0;
      list.amount= null;
      list.amountInclTax= null;
      list.item= null;
      list.qty= null;
      list.unit= null;
      list.rate= null;
      list.cgstRate= 0;
      list.igstRate= 0;
      list.sgstRate= 0;
      list.cessRate= 0;
      list.vatRate=0;
      list.vatAmount= null;
      list.cgstAmount= null;
      list.igstAmount= null;
      list.sgstAmount= null;
      list.cessAmount= null;
      list.description= null;
    })
    }
   
  }
  //If user clicks on the preview button in form, then pass the data from form to this component and make it available to the preview component.
  previewClicked(data) {
    this.userData = data[0];
    this.customerData = data[1];
    this.docData = data[2];
    this.itemList = data[3];
    this.previewMode = true;
  }
  getLastDocNo(data) {
    //Get the last document number generated for the user from user profile document
    if (!data.estimateNoLast) {
      this.lastDocNo = data.estimateNoInit;
    } else {
      this.lastDocNo = data.estimateNoLast;
    }
    if (!this.previewMode) {
      this.docData.docNumber = (this.lastDocNo + 1).toString(); // increment the document number from the last created document no
    } else {
      // If preview mode, then do not increment. This is required to ensure that once document is geenrated from est, the correct document mode is displayed in preview
      this.docData.docNumber = this.lastDocNo.toString();
    }
  }
  editClicked(data) {
    this.userData = data[0];
    this.customerData = data[1];
    this.docData = data[2];
    this.docData.saleID = this.saleID;
    this.itemList = data[3];
    this.previewMode=data[4];
    this.scenario=data[5];
  }
  generateClicked(data) {
    this.user1Subscription.unsubscribe();
    this.user2Subscription.unsubscribe();
    if (this.editSubscribed) {
      this.docSubscription.unsubscribe();  
    }
    else if (this.scenario == 'create') {
      this.cust1Subscription.unsubscribe();
      if(this.superUserId != this.userId){
        this.superUserSubscription.unsubscribe()
      }
    }   
   
    

    this.userDetailsSubscription.unsubscribe();
    this.viewModeLoading=false;
    this.userData = data[0];
    this.customerData = data[1];
    this.docData = data[2];
    this.docData.saleID = this.saleID;
    this.itemList = data[3];
    this.previewMode = true; // go to preview mode once document is generated
    //write the document data to the database
    switch (this.scenario) {
      case 'Scenario1': {
        // Scenario1 : Unsigned user creating a document, save only the user details if available
        break;
      }
      case 'create': {
        this.docData.createdDate = new Date().getTime();
        // Scenario2 : Signed in user creating fresh document for selected customer
        //write to the corresponding document record
        this.service.createDocument(
          this.userData,
          this.customerData,
          this.docData,
          this.itemList,
          this.docType,
          this.docData.docNumber,
          this.superUserId,
          this.userDetailsAuth.uid
        );
        this.previewMode = true; //Display the preview
        this.docSaved = true;
        this.service.updateDocNo(this.superUserId, {
          estimateNoLast: this.lastDocNo + 1,
        });
        this._snackBar.open('Successfully Created', this.docData.docType, {
          duration: 2000,
        });
        break;
      }
      case 'edit': {
        // Scenario3 : Signed in user ediitng an existing document
        //read the details of the user and customer and apply it to the document form;
        this.service.createDocument(
          this.userData,
          this.customerData,
          this.docData,
          this.itemList,
          this.docType,
          this.docData.docNumber,
          this.superUserId,
          this.userDetailsAuth.uid
        );
        this._snackBar.open('Successfully Updated', this.docData.docType, {
          duration: 2000,
        });
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }
  contactView(){
    this.router.navigate(['/dash/contact/customerdetails/', this.custID])
  }
// sharedoc

shareClicked(data){
  console.log("share invoice")
  this.service.getCustdetails(this.superUserId,this.customerData.custID).subscribe(res=>{
    this.service.getsharedwithid(this.docData.saleID).subscribe(res2=>{
      var data:any={}
      if(res2.data())
      {
        this.service.addinvoicetoshare(this.docData.saleID,this.docData.docNumber).then(()=>{
          this.service.sendEmail({
            to:res.data().email,
            template:{
              name:"sharedDoc",
              data:{
                userName:this.userData.contactname,
                link:"www.zenysapp.org"
              }
            }
            // html:"A document have been send to you by "+this.userData.companyName=="N/A"?this.userData.contactname:this.userData.companyName+". Click the link <a href=''>Click here</a> "
          })
          this.service.togglesharestatus(this.superUserId,this.docData.docNumber,true)
        })
      }
      else{
        // console.log("false")
        this.service.initshareinvoice({
          saleID:this.docData.saleID,
          userId:this.superUserId,
          customerEmail:res.data().email,
          shareDate:Date.now()
        }).then(()=>
        {
          this.service.addinvoicetoshare(this.docData.saleID,this.docData.docNumber).then(()=>{
            this.service.sendEmail({
              to:res.data().email,
              template:{
                name:"sharedDoc",
                data:{
                  userName:this.userData.contactname,
                  link:"www.zenysapp.org"
                }
              }
            })
          this.service.togglesharestatus(this.superUserId,this.docData.docNumber,true)
          })
        }
        )
      }
      console.log(data)
    })
  })
  }


}
