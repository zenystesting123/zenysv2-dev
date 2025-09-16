
import { Sales, PaymentReceipt, Profile, Invoice, Attachments, SalesNotes, Task, paymentDetails } from './../data-models';
import { ChangeDetectorRef, Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SalesDetailsService } from './sales-details.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import { ChangesaleprioritydialogComponent } from '../changesaleprioritydialog/changesaleprioritydialog.component';
// import { ChangesalestatdialogComponent } from '../changesalestatdialog/changesalestatdialog.component';
import * as firebase from 'firebase';
import { finalize, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { DOCUMENT } from '@angular/common';
import { ConfirmationpopupComponent } from '../confirmationpopup/confirmationpopup.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
// import { EmailpopupComponent } from '../emailpopup/emailpopup.component'
//import {GmailintService} from '../gmailint.service'
// import { ComposemailComponent } from '../composemail/composemail.component'
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NetworkCheckService } from '../networkcheck.service';
import { PlanDocLimit } from 'src/app/data-models';

export interface DialogData1 {
  cid: string;
  id: string;
  mode: string;
  id1: string;
  customerName: string;
  company: string;
  customerSecondName: string;
}


var $primary = "#536dfe",
  $success = "#40C057",
  $info = "#2F8BE6",
  $warning = "#F77E17",
  $danger = "#F55252",
  $label_color_light = "#E6EAEE";
var themeColors = [$primary, $warning, $success, $danger, $info];

@Component({
  selector: 'app-sales-details',
  templateUrl: './sales-details.component.html',
  styleUrls: ['./sales-details.component.scss'],
  animations: [
    trigger('FlyIn', [
      transition('void=>*', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate('100ms')
      ]),
      transition('*=>void', [
        animate
          ('100ms', style({ opacity: 0, transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class SalesDetailsComponent implements OnInit {

  // @Input() file: File;
  customerId: string;
  saleId = this.route.snapshot.paramMap.get('saleId');
  spinner: boolean = true;
  //saleId: string; //Sale Id of the sale
  user: firebase.default.UserInfo;
  taskDetails: paymentDetails = {
    id:null,
    saleId:null,
    mode:null,
    custId:null,
    userId:null,
    custFname:null,
    custSname:null,
    saleTitle:null,
    custComp:null,
    smode:null
  }
  sale: Observable<Sales>;
  uploadProgress$: Observable<number>;
  uploadReset:Observable<number>;
  saleValue: number;
  task: AngularFireUploadTask;
  tasks: firebase.default.storage.UploadTask
  invoicedAmount: number=0
  collectedAmount: number;
  quotations: Invoice[];
  estimates: Invoice[];
  attachments: Attachments[];
  paymentReceipts: PaymentReceipt[];
  invoices: any[];
  userid: string;
  downloadURL: Observable<string>;
  fileURL: any;
  users: any;
  form: any;
  dataAccessRule: any;
  superUserId: any;
  userRole: any;
  accountType: any;
  userId: any;
  userDetails: Observable<Profile>;
  isTabletsize: boolean = false;
  isMobilesize: boolean = false;
  progressBarStatus: boolean = false;
  estimateAmount: number=0;
  customerfirstname: any;
  customersecondname: any;
  company: any;
  saleField4Name: any;
  saleField3Name: any;
  saleField2Name: any;
  saleField1Name: any;
  saleField4Check: boolean = false;
  saleField3Check: boolean = false;
  saleField2Check: boolean = false;
  saleField1Check: boolean = false;
  saleCategory1: any = [];
  saleCategory2: any = [];
  taskss: Task[];
  saleName: string;
  saleCategory1Check: any;
  saleCategory2Check: any;
  saleStatus: any;
  addDetExp: Boolean = false;
  attExp: Boolean = false;
  attachmentSize:any;
  customerName: string;
  plan:any;
  dataSource: any;
  displayedColumns: string[] = ['Date', 'Invoice No', 'Payment Mode', 'Amount'];

  dataSourceAtt: any;
  displayedColumnAtt: string[] = ['Date', 'Filename', 'Uploaded', 'edit'];

  userName: string;
  saleNotes: any[]; //collection of csuomter notes

  isHovering: boolean;
  networkConnection:boolean;
  taskStatusOption: any;
  lastStatusoption: any;
  taskDefaultOption: any = ['Open','Completed'];
  dragAreaClass: string;
  totalUploadLimit: number;
  uploadFileLimit: any = [];
  totalUserCount: number = 1;

  constructor(@Inject(DOCUMENT) private document: Document,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    private ref: ChangeDetectorRef,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    private breakpointObserver: BreakpointObserver,
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private salesdetailsService: SalesDetailsService, public networkCheck:NetworkCheckService,
    //for email
    //public goog:GmailintService,
    private location: Location) {
    this.saleId = this.route.snapshot.paramMap.get('saleId');
    this.salesdetailsService.getuserfromShared(this.saleId).subscribe((data:any)=>{

      this.userId=data.userId
          // this.userId = this.user.uid;
          this.userDetails = this.salesdetailsService.getUsers(this.userId);
          this.userDetails.subscribe(data => {
            if (data) {
              if (data.superUserId) {
                //If the superuserid is set assign it
                this.superUserId = data.superUserId;
              }
              else {
                //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
                this.superUserId = this.userId;
              }
              this.dragAreaClass = 'dragarea';
              this.uploadFileLimit = PlanDocLimit.sizeLimit;

        this.totalUserCount = data.noSubusers + 1;
              if (data.plan == 'diamond') {
                this.totalUploadLimit =
                  this.uploadFileLimit.diamond * this.totalUserCount;
              } else if (data.plan == 'gold') {
                this.totalUploadLimit =
                  this.uploadFileLimit.gold * this.totalUserCount;
              } else {
                this.totalUploadLimit =
                  this.uploadFileLimit.free * this.totalUserCount;
              }
              this.dataAccessRule = data.dataAccessRule;
              this.userRole = data.userRole;
              this.accountType = data.accountType;
              this.taskStatusOption = data.taskStatusOpn?data.taskStatusOpn:this.taskDefaultOption;
          this.lastStatusoption = this.taskStatusOption[this.taskStatusOption.length - 1];
              //Read the customer form customization settings
              // this.saleStatus = data.saleStatus;
              this.attachmentSize=data.totalAttachmentsSize;
              if(!this.attachmentSize){
                this.attachmentSize=0;
              }
              // console.log( data.dataAccessRule)
              // console.log(data.saleField1Name)
              // console.log(this.saleField2Name);
              // console.log(this.saleCategory2Check)



              this.sale = this.salesdetailsService.getSale(this.saleId, this.superUserId);
              this.sale.subscribe(data => {
                // console.log(data)
                this.saleName = data.saleTitle
                this.saleValue = data.estimatedValue;
                // this.invoicedAmount = data.invoicedAmount;
                this.collectedAmount = data.collectedAmount;
                this.customerId = data.customerId;
                // this.estimateAmount = data.estimatedValue;
                this.customerfirstname = data.firstName;
                this.customersecondname = data.secondName;
                this.company = data.companyName;

              })

              this.salesdetailsService.getAttachments(this.superUserId, this.saleId).subscribe(data => {
                this.attachments = data.map(e => {
                  return {
                    id: e.payload.doc.id,
                    ...e.payload.doc.data() as {}
                  } as Attachments;
                }).filter(data=>data.shareStatus==true)
                setTimeout(() => {
                  this.dataSourceAtt = new MatTableDataSource([]);
                  this.dataSourceAtt = this.attachments;
                }, 500);
              });
              this.salesdetailsService.readNote(this.saleId, this.superUserId).subscribe(data => {
                //console.log("uid",this.userDetailsAuth.uid)
                //console.log("cid",this.custId)
                this.saleNotes = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as SalesNotes;
                });
              });




              //@MK 24/5/2021 - replaced the data access rule based fetching of document details, instead getting all documents for a sale
              this.salesdetailsService.getQuotations(this.superUserId, this.saleId).subscribe(data => {
                this.quotations = data.map(e => {
                  return {
                    id: e.payload.doc.id,
                    ...e.payload.doc.data() as {}
                  } as Invoice;

                }).filter(data=>data.shareStatus==true)
              });
              this.salesdetailsService.getEstimates(this.superUserId, this.saleId).subscribe(data => {
                this.estimateAmount=0
                this.estimates = data.map(e => {
                  return {
                    id: e.payload.doc.id,
                    ...e.payload.doc.data() as {}
                  } as Invoice;

                }).filter(data=>data.shareStatus==true)
                this.estimates.forEach(ele=>{this.estimateAmount=this.estimateAmount+ele.docData.totalInclTax})
              });
              this.salesdetailsService.getInvoices(this.superUserId, this.saleId).subscribe(data => {
                this.invoicedAmount=0
                this.invoices = data.map(e => {
                  return {
                    id: e.payload.doc.id,
                    ...e.payload.doc.data() as {}
                  } as Invoice;
                }).filter(data=>data.shareStatus==true)
                this.invoices.forEach(ele=>{this.invoicedAmount=this.invoicedAmount+ele.docData.totalInclTax})
              });


              // get the list of payments
              this.salesdetailsService.getPaymentReceipt(this.superUserId, this.saleId).subscribe(data => {
                this.paymentReceipts = data.map(e => {
                  return {
                    id: e.payload.doc.id,
                    ...e.payload.doc.data() as {}
                  } as PaymentReceipt;
                });
                this.salesdetailsService.getTasks(this.superUserId, this.userId, this.saleId, this.dataAccessRule, this.accountType,this.lastStatusoption).subscribe(data => {
                  this.taskss = data.map(e => {
                    return {
                      id: e.payload.doc.id,
                      ...e.payload.doc.data() as {}
                    } as Task;

                  })
                  this.progressBarStatus=true;
                })
                setTimeout(() => {
                  this.dataSource = new MatTableDataSource([]);
                  this.dataSource = this.paymentReceipts;
                }, 500);
              });


              //get the list of invoices

            }
          })


    })
    // this.userid = firebase.default.auth().currentUser.uid
    if (this.userid)
    this.salesdetailsService.getNew('/users', this.userid).pipe(take(1)).subscribe(p => this.form = p);
    // afAuth.authState.subscribe(user => this.users = user);
    //check for data update and show the data without user inputs
    setInterval(() => {
      this.ref.detectChanges()
    }, 200);
    //

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
    // setInterval(()=>{
    //   console.log(this.attachments)
    // },200)
  }
  downloadAttachment(url) {
    this.document.location.href = url;
  }

  tasksRoute() {
    this.router.navigate(['/dash/tasks/sale', this.saleId]);
  }
  // deleteAttachment(id, path, url, filename,size) {
  //   this.dialog.open(ConfirmationpopupComponent, {
  //     data: {
  //       taskId: id, smode: "attachmentDelete", path: path, url: url, orginalPath: filename,
  //       saleId: this.saleId, userId: this.superUserId,size:size

  //     }
  //   });
  // }
  // createQuote() { //create a quote for a paritcular sale ID
  //   this.router.navigate(['/dash/documentquotationmanagement/', this.saleId, "create", "Quotation", this.customerId, "none"])

  // }

  resetBar(){
    this.uploadProgress$ =this.uploadReset;
  }
  // paymentBottom(){
  //   this.taskDetails.saleId=this.saleId;
  //   this.taskDetails.mode="createBtm";
  //   this.taskDetails.smode="create";
  //   this.taskDetails.custId=this.customerId;
  //   this.taskDetails.userId=this.userId;
  //   this.taskDetails.saleTitle=this.saleName;
  //   this.taskDetails.custFname=this.customerfirstname;
  //   this.taskDetails.custSname=this.customersecondname;
  //   this.taskDetails.custComp=this.company;



  // }
  uploadAttachment(event, type) {

    let date = new Date().getTime();
    let str;
    let size;
    let downloadURL;
    let file;
    let newSize;
    let name = this.form?.firstname + " " + this.form?.lastname
    if (type == 'drag') {
      str = event.name;
      file = event;
      size = event.size / 1024 / 1024;
    }else{
      if (event.target.files.length > 0) {
        str = event.target.files[0].name;
        file = event.target.files[0];
        size=event.target.files[0].size/1024/1024;
      }
    }

    if(file){
      newSize=this.attachmentSize+size;
      if (newSize > this.totalUploadLimit && this.plan == 'diamond') {
        this.snack.open("Limit exceeded", "", {
          duration: 5000,
        });
      } else if (newSize > this.totalUploadLimit && this.plan == 'gold') {
        this.snack.open("Limit exceeded", "", {
          duration: 5000,
        });
      } else if (newSize > this.totalUploadLimit && this.plan == 'free') {
        this.snack.open("Limit exceeded", "", {
          duration: 5000,
        });
      }else{
      let storageRef = firebase.default.storage().ref();
      const filePath = `attachment/${this.superUserId}/sale/${Date.now()}_${str}`;
      // this.tasks= storageRef.child(filePath).put(event.file);
      this.task = this.storage.upload(filePath, file);
      const ref = this.storage.ref(filePath);
      // console.log('uploaded!');
      // this.tasks.snapshot.ref.getDownloadURL
      this.uploadProgress$ = this.task.percentageChanges()
      this.task.snapshotChanges().pipe(
        finalize(async () => {
          downloadURL = await ref.getDownloadURL().toPromise();

          this.salesdetailsService.attachmentsToCollection(this.superUserId, name, this.saleId, str, downloadURL, filePath, date,size);
          // console.log(this.superUserId,newSize)
          this.salesdetailsService.updateSize(this.superUserId,newSize);
          this.snack.open("Attachment added successfully", "done", {
            duration: 5000,
          });
        })
      )
        .subscribe();
      }
    }
  }
  openL() {
    let element: HTMLElement = document.getElementsByClassName('attachment-selector')[0] as HTMLElement;
    element.click();
  }
  // editPayment(id) {


  //   this.dialog.open(PaymentreceiptComponent, {
  //     width: '700px',
  //     height: 'auto',
  //     data: {
  //       id: this.saleId,
  //       cid: this.customerId,
  //       mode: "update",
  //       id1: id

  //     }
  //   });
  // }
  // editPaymentMob(id){
  //   this.taskDetails.saleId=this.saleId;
  //   this.taskDetails.mode="createBtm";
  //   this.taskDetails.smode="update";
  //   this.taskDetails.id=id;
  //   this.taskDetails.saleTitle=this.saleName;


  // }
  // updateSaleCategory1(value) {
  //   this.salesdetailsService.updateSaleCategory1(this.superUserId, this.saleId, value);
  //   this.snack.open("Updation successful", "", {
  //     duration: 3000,
  //   });
  // }
  // updateSaleCategory2(value) {

  //   this.salesdetailsService.updateSaleCategory2(this.superUserId, this.saleId, value);
  //   this.snack.open("Updation successful", "", {
  //     duration: 3000,
  //   });
  // }
  // viewPayment(id) {
  //   // console.log("view")
  //   this.dialog.open(PaymentreceiptComponent, {
  //     width: '700px',
  //     height: 'auto',
  //     data: {
  //       id: this.saleId,
  //       cid: this.customerId,
  //       mode: "view",
  //       id1: id

  //     }
  //   });
  // }
  createInvoice() {//create an invoice for a paritcular sale ID

    this.router.navigate(['/dash/documentinvoicemanagement/', this.saleId, "create", "Invoice", this.customerId, "none"])
  }
  createEstimate() {
    this.router.navigate(['/dash/documentmanagement/', this.saleId, "create", "Estimate", this.customerId, "none"])
  }
  createInvoiceMob() {//create an invoice for a paritcular sale ID

    this.router.navigate(['/documentinvoicemanagement/', this.saleId, "create", "Invoice", this.customerId, "none"])
  }
  createEstimateMob() {
    this.router.navigate(['/documentmanagement/', this.saleId, "create", "Estimate", this.customerId, "none"])
  }
  createQuoteMob() { //create a quote for a paritcular sale ID
    this.router.navigate(['/documentquotationmanagement/', this.saleId, "create", "Quotation", this.customerId, "none"])

  }
  ngOnInit(): void {

  }
  // addTask() {
  //   this.dialog.open(CrudModalComponent, {
  //     width: '700px',
  //     height: 'auto',
  //     data: {
  //       sid: this.saleId,
  //       cid: this.customerId,
  //       mode: 'saleCreate',
  //       company: this.company,
  //       firstName: this.customerfirstname,
  //       secondName: this.customersecondname,
  //       saleName: this.saleName
  //     },
  //   });
  // }

  // updateSaleStage(stage: string) {
  //   const dialogConfig = new MatDialogConfig();

  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;

  //   dialogConfig.data = {
  //     userId: this.superUserId,
  //     saleId: this.saleId,
  //     status: stage
  //   };

  //   const dialogRef = this.dialog.open(ChangesalestatdialogComponent, dialogConfig);

  // }
  // updateSalePriority(priority: string) {
  //   const dialogConfig = new MatDialogConfig();

  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;

  //   dialogConfig.data = {
  //     userId: this.superUserId,
  //     saleId: this.saleId,
  //     priority: priority
  //   };
  //   const dialogRef = this.dialog.open(ChangesaleprioritydialogComponent, dialogConfig);

  // }
  openDialog() {

  }
  // onViewSale() {
  //   if (this.isMobilesize == false) {
  //     const dialogRef = this.dialog.open(AddnewsaleComponent, {
  //       panelClass: 'custom-dialog-container',
  //       width: '748px',
  //       height: 'auto',
  //       data: { scenario: "view", id: this.saleId }
  //     });
  //     dialogRef.afterClosed().subscribe(result => {

  //     });
  //   }
  //   if (this.isMobilesize == true) {
  //     this.router.navigate(["/addsale", 'view', this.saleId])
  //   }

  // }
  // onEditSale() {
  //   if (this.isMobilesize == false) {
  //     // console.log("hello")
  //     const dialogRef = this.dialog.open(AddnewsaleComponent, {
  //       panelClass: 'custom-dialog-container',
  //       width: '748px',
  //       height: 'auto',
  //       data: { scenario: "edit", id: this.saleId }
  //     });
  //     dialogRef.afterClosed().subscribe(result => {
  //       // console.log(result);

  //     });
  //   }
  //   if (this.isMobilesize == true) {
  //     this.router.navigate(["/addsale", 'edit', this.saleId])
  //   }
  // }
  onAddMob() {
    this.router.navigate(['/addsale', 'create'])
  }
  // getValue(value: number, invoiced: number, collected: number) {
  //   this.afAuth.authState.subscribe(user => {
  //     if (user) {
  //       this.user = user;
  //       if (value > 1) {
  //         // console.log(value);
  //         this.spinner = false;
  //       }
  //     }

  //   })


  // }
  AddDetToExpand() {
    this.addDetExp = !this.addDetExp;
  }
  AddDetToCollapse() {
    this.addDetExp = !this.addDetExp;
  }

  // async sndMail(url) {
  //   // console.log(url)
  //   //await this.goog.login()
  //   this.sendemailpopup(url)
  // }

  // sendemailpopup(url) {
  //   const dialogRef = this.dialog.open(ComposemailComponent, {
  //     width: '700px',
  //     data: {
  //       superuserid: this.superUserId,
  //       customerid: this.customerId,
  //       link: url
  //     }
  //   })
  // }
  onBack() {
    this.location.back();
  }
  onBackMob(){
    this.router.navigate(['/dash/sales/salelist-mobileview'])
  }
  contactView() {
    this.router.navigate(['/dash/contact/customerdetails/', this.customerId])
  }
  contactViewMob() {
    this.router.navigate(['/customerdetails/', this.customerId])
  }
  toggleHover(event: boolean) {
    this.isHovering = event;
  }
  @HostListener('dragover', ['$event']) onDragOver(event: any) {
    this.dragAreaClass = 'droparea';
    event.preventDefault();
  }
  @HostListener('dragenter', ['$event']) onDragEnter(event: any) {
    this.dragAreaClass = 'droparea';
    event.preventDefault();
  }
  @HostListener('dragend', ['$event']) onDragEnd(event: any) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }
  @HostListener('dragleave', ['$event']) onDragLeave(event: any) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }
  @HostListener('drop', ['$event']) onDrop(event: any){
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      let files: FileList = event.dataTransfer.files[0];
      this.uploadAttachment(files, 'drag');
    }
  }
  onDrops(files: FileList) {
    console.log('called')

    let date = new Date().getTime();
    let str;
    let downloadURL;
    let file
    let size;
    let newSize;
    let sumSize=0;
    let name = this.form?.firstname + " " + this.form?.lastname
    // let datePlaced = new Date().getTime();
    for (let i = 0; i < files.length; i++) {
      if (files.length > 0) {
        str = files[0].name;
        file = files[0];
        size=files[0].size/1024/1024;
      }
      sumSize=size+sumSize

      newSize=this.attachmentSize+sumSize
      if(newSize>1024&&this.plan=="paid"){
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: "attachment1GB"
          }
        });
      }
      else if(newSize>512&&this.plan=="free"){
        this.dialog.open(ConfirmationpopupComponent, {
          data: {
            smode: "attachment512MB"
          }
        });
      }
      else{
    let storageRef = firebase.default.storage().ref();
    const filePath = `attachment/${this.user.uid}/sale/${Date.now()}_${str}`;
    // this.tasks= storageRef.child(filePath).put(event.file);
    this.task = this.storage.upload(filePath, file);
    const ref = this.storage.ref(filePath);
    // console.log('uploaded!');
    // this.tasks.snapshot.ref.getDownloadURL
    this.task.snapshotChanges().pipe(
      finalize(async () => {
        downloadURL = await ref.getDownloadURL().toPromise();

        this.salesdetailsService.attachmentsToCollection(this.superUserId,name, this.saleId, str, downloadURL, filePath, date,size);
        this.snack.open("Attachment added successfully", "done", {
          duration: 5000,
        });
      })
    )
      .subscribe();
    }
    newSize=this.attachmentSize+sumSize
    this.salesdetailsService.updateSize(this.superUserId,newSize);
  }
  }
  AttToExpand() {
    this.attExp = !this.attExp
  }
  AttToCollapse() {
    this.attExp = !this.attExp
  }
  onSubmitNote(form: NgForm) {
    let createdDate = new Date().getTime();
    this.salesdetailsService.writeNote(
      form.value,
      this.superUserId,
      createdDate,
      this.saleId,
      this.userName
    );
    form.reset(); //reset the form after writing the data
  }

  onCheckNetwork(){
    return this.networkConnection=this.networkCheck.onNetworkCheck();
  }

// share attachment

// shareClicked(attachmentid){
//   console.log("share invoice")
//   this.salesdetailsService.getCustdetails(this.userId,this.customerId).subscribe(res=>{
//     this.salesdetailsService.getsharedwithid(this.saleId).subscribe(res2=>{
//       var data:any={}
//       if(res2.data())
//       {
//         this.salesdetailsService.addinvoicetoshare(this.saleId,attachmentid).then(()=>{
//           this.salesdetailsService.sendEmail({
//             to:res.data().email,
//             template:{
//               name:"sharedDoc",
//               data:{
//                 userName:this.userName,
//                 link:"www.zenysapp.org"
//               }
//             }
//             // html:"A document have been send to you by "+this.userData.companyName=="N/A"?this.userData.contactname:this.userData.companyName+". Click the link <a href=''>Click here</a> "
//           })
//           this.salesdetailsService.togglesharestatus(this.userId,attachmentid,this.saleId,true)
//         })
//       }
//       else{
//         // console.log("false")
//         this.salesdetailsService.initshareinvoice({
//           saleID:this.saleId,
//           userId:this.userId,
//           customerEmail:res.data().email,
//           shareDate:Date.now()
//         }).then(()=>
//         {
//           this.salesdetailsService.addinvoicetoshare(this.saleId,attachmentid).then(()=>{
//             this.salesdetailsService.sendEmail({
//               to:res.data().email,
//               template:{
//                 name:"sharedDoc",
//                 data:{
//                   userName:this.userName,
//                   link:"www.zenysapp.org"
//                 }
//               }
//             })
//           this.salesdetailsService.togglesharestatus(this.userId,attachmentid,this.saleId,true)
//           })
//         }
//         )
//       }
//       console.log(data)
//     })
//   })
//   }




}
