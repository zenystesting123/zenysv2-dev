/*--------------------------------------------------------------------
This component is no longer used and will be removed from the project soon.
Please use customer


---------------------------------------------------------------------*/


import { RejectleaddialogComponent } from '../../rejectleaddialog/rejectleaddialog.component';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
// import { CustomerArray, Customers, Invoice,  Meeting, Payments, SalesDetails, TaskData, Task, CustomerNotes, User } from '../data-model.model';
import { CustomerviewService } from './customerview.service';
import { ChangecuststatdialogComponent } from '../../changecuststatdialog/changecuststatdialog.component';
import { ChangecustprioritydialogComponent } from '../../changecustprioritydialog/changecustprioritydialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudModal1Component } from '../../taskboard/crud-modal1/crud-modal1.component';
import { SelectsaledialogComponent } from '../../selectsaledialog/selectsaledialog.component';
import { Paymentreceipt1Component } from '../../paymentreceipt1/paymentreceipt1.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
// import { CalendarEvent } from 'angular-calendar';
import * as firebase from 'firebase';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { Customer, FollowUps,Invoice ,PaymentReceipt,Sales ,Task,Profile} from '../../data-models';
import { FollowupTaskCreateComponent } from 'src/app/followup-task-create/followup-task-create.component';
import { Addnewsale1Component } from 'src/app/addnewsale1/addnewsale1.component';

export interface DialogData01 {
  surname: string;

  id: string;
  mode: string;
  cid: string;
  orgId: string;
  company: string;
  customerName: string;
  saleName:string;
  serviceName:string;
  sid:string;
  firstName:string;
  secondName:string;
}

@Component({
  selector: 'app-customerview',
  templateUrl: './customerview.component.html',
  styleUrls: ['./customerview.component.scss']
})
export class CustomerviewComponent implements OnInit, OnDestroy {
  completedLength: number = 0
  loading: boolean = true;
  custId: string;
  orgId: string;
  user: Observable<any>; //
  userDetailsAuth: any = null; //user details from auth module
  customerDetails: Observable<Customer>;
  salesList: Sales[];
  quotations: Invoice[];
  estimate: Invoice[];
  paymentReceipts: PaymentReceipt[];
  tasks: Task[];
  invoices: any[];
  cname: string;
  // private meetingSubscription: Subscription;
  // meetings: any[];
  sname: string;
  id: string;
  fname: string;
  users: any;
  form: any;
  private taskSubscription: Subscription;
  followUps: FollowUps[];
  userid: any;
  folloupAmt: number;
  documetsArrays: Customer[] = [];
  isTabletsize: boolean = false;
  isMobilesize: boolean = false;
  act: string;
  customerNote: string;
  customerNotes: any[];//collection of csuomter notes
  userName: string;
  dataAccessRule: any;
  superUserId: any;
  userRole: any;
  accountType: any;
  userId: any;
  userDetails: Observable<Profile>;
  surname: string;
  

  constructor(public dialog: MatDialog, private snack: MatSnackBar, private router: Router, private afAuth: AngularFireAuth, private db: AngularFirestore,
    private breakpointObserver: BreakpointObserver, private ref: ChangeDetectorRef, private route: ActivatedRoute, private customerviewservice: CustomerviewService) {

    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 500);
    //Get the customer ID passed on via router
    route.params.subscribe(val => {
      //Section 1: Get the information passed on to the module using router link
      this.custId = this.route.snapshot.paramMap.get('custId');

    })

    this.afAuth.authState.subscribe(user => {
      this.userDetailsAuth=user;
      this.userId=this.userDetailsAuth.uid;
      this.userDetails = this.customerviewservice.getUsers(this.userId);
      this.userDetails.subscribe(data => {
        if (data) {
          if (data.superUserId) {
            //If the superuserid is set assign it
            this.superUserId = data.superUserId;

            // console.log(this.form)
          }
          else {
            //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
            this.superUserId = this.id;

            // console.log(this.form)
          }
          this.customerviewservice.getNew('/users', this.superUserId).pipe(take(1)).subscribe(p => this.form = p);
          this.dataAccessRule = data.dataAccessRule;
          this.userRole = data.userRole;
          this.accountType = data.accountType;


          this.customerDetails = this.customerviewservice.readCustRecord(this.superUserId, this.custId);
          this.customerDetails.subscribe(data => {
            this.cname = data.companyName;
            this.orgId = data.orgId;
            this.id = this.custId;
            this.fname = data.firstName;
            this.sname = data.secondName;
            this.surname = data.surname;
            this.loading = false;
          })

          // get the list of sales

          this.customerviewservice.getSales(this.custId, this.superUserId, this.dataAccessRule, this.userId).subscribe(data => {
            this.salesList = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as {}
              } as Sales
            });
          });
          // get the list of quotations
          this.customerviewservice.getQuotations(this.superUserId, this.custId, this.dataAccessRule, this.userId).subscribe(data => {
            this.quotations = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as {}
              } as Invoice;

            })
          });
          this.customerviewservice.getEstimate(this.superUserId, this.custId, this.dataAccessRule, this.userId).subscribe(data => {
            this.estimate = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as {}
              } as Invoice;

            })
          });
          this.customerviewservice.getInvoices(this.superUserId, this.custId, this.dataAccessRule, this.userId).subscribe(data => {
            this.invoices = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as {}
              } as Invoice;
            })
          });
          //get the follow up list
          this.customerviewservice.getFollowUps(this.custId, this.superUserId, this.dataAccessRule, this.userId).subscribe(data => {
            this.followUps = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as {}
              } as FollowUps
            });
            let length = this.followUps.length;
            for (let i = 0; i < length; i++) {
              if (!this.followUps[i].completedStatus) {
                this.completedLength = this.completedLength + 1;
              }
              // this.completedLength=  this.followUps[i].completed.length;

            }
          });
          // get the list of payments
          this.customerviewservice.getPaymentReceipt(this.superUserId, this.custId).subscribe(data => {
            this.paymentReceipts = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as {}
              } as PaymentReceipt;
            });
          });

          // this.meetingSubscription = this.customerviewservice.getMeetings(this.superUserId, this.custId).subscribe(data => {
          //   this.meetings = data.map(e => {
          //     return {
          //       id: e.payload.doc.id,
          //       ...e.payload.doc.data() as {}
          //     } as {};
          //   })
          // });

          this.taskSubscription = this.customerviewservice.getform(this.superUserId, this.custId).subscribe(data => {
            this.tasks = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as {}
              } as Task;

            })
          })
        }
      })
      //Get the username of the logged in account
      this.customerviewservice.getUsers(this.userId).subscribe(data => {
        this.userName = data.firstname;
      })


    })

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
    //   console.log(this.form)
    // },100)
  }

  ngOnInit(): void {
    this.id = firebase.default.auth().currentUser.uid
    if (this.id) {
      this.userId = this.id;
      this.userDetails = this.customerviewservice.getUsers(this.id);
      this.userDetails.subscribe(data => {
        if (data) {
          if (data.superUserId) {
            //If the superuserid is set assign it
            this.superUserId = data.superUserId;
            this.customerviewservice.getNew('/users', this.superUserId).pipe(take(1)).subscribe(p => this.form = p);
            // console.log(this.form)
          }
          else {
            //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
            this.superUserId = this.id;
            this.customerviewservice.getNew('/users', this.superUserId).pipe(take(1)).subscribe(p => this.form = p);
            // console.log(this.form)
          }

          this.dataAccessRule = data.dataAccessRule;
          this.userRole = data.userRole;
          this.accountType = data.accountType;


          this.customerDetails = this.customerviewservice.readCustRecord(this.superUserId, this.custId);
          this.customerDetails.subscribe(data => {
            this.cname = data.companyName;
            this.id = this.custId;
            this.fname = data.firstName;
            this.sname = data.secondName;
            this.loading = false;
          })

          // get the list of sales

          this.customerviewservice.getSales(this.custId, this.superUserId, this.dataAccessRule, this.userId).subscribe(data => {
            this.salesList = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as {}
              } as Sales
            });
          });
          // get the list of quotations
          this.customerviewservice.getQuotations(this.superUserId, this.custId, this.dataAccessRule, this.userId).subscribe(data => {
            this.quotations = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as {}
              } as Invoice;

            })
          });
          this.customerviewservice.getEstimate(this.superUserId, this.custId, this.dataAccessRule, this.userId).subscribe(data => {
            this.estimate = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as {}
              } as Invoice;

            })
          });
          this.customerviewservice.getInvoices(this.superUserId, this.custId, this.dataAccessRule, this.userId).subscribe(data => {
            this.invoices = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as {}
              } as Invoice;
            })
          });
          //get the follow up list
          this.customerviewservice.getFollowUps(this.custId, this.superUserId, this.dataAccessRule, this.userId).subscribe(data => {
            this.followUps = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as {}
              } as FollowUps
            });
            let length = this.followUps.length;
            for (let i = 0; i < length; i++) {
              if (!this.followUps[i].completedStatus) {
                this.completedLength = this.completedLength + 1;
              }
              // this.completedLength=  this.followUps[i].completed.length;

            }
          });
          // get the list of payments
          this.customerviewservice.getPaymentReceipt(this.superUserId, this.custId).subscribe(data => {
            this.paymentReceipts = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as {}
              } as PaymentReceipt;
            });
          });

          //get the list of invoices




          // this.meetingSubscription = this.customerviewservice.getMeetings(this.superUserId, this.custId).subscribe(data => {
          //   this.meetings = data.map(e => {
          //     return {
          //       id: e.payload.doc.id,
          //       ...e.payload.doc.data() as {}
          //     } as {};
          //   })
          // });

          this.taskSubscription = this.customerviewservice.getform(this.superUserId, this.custId).subscribe(data => {
            this.tasks = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as {}
              } as Task;

            })
          })
        }
      })
      //Get the username of the logged in account
      this.customerviewservice.getUsers(this.userId).subscribe(data => {
        this.userName = data.firstname;
      })


    }

  }

  onSubmitNote(form: NgForm) {

    let createdDate = new Date().getTime();
    this.customerviewservice.writeNote(form.value, this.superUserId, createdDate, this.id, this.userName);
    form.reset();//reset the form after writing the data
  }
  viewPayment(id, sid) {
    // console.log("view")
    this.dialog.open(Paymentreceipt1Component, {
      disableClose: true,
      data: {

        mode: "view",
        id1: id,
        id: sid

      }
    });
  }
  //Dialog for rejecting a lead
  openDialog(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      userId: this.superUserId,
      custId: this.custId
    };
    const dialogRef = this.dialog.open(RejectleaddialogComponent, dialogConfig);
  }
  //SelectsaledialogComponent

  createDoc(docType: string) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      userId: this.superUserId,
      custId: this.custId,
      docType: docType,
      id: this.custId
    };

    const dialogRef = this.dialog.open(SelectsaledialogComponent, dialogConfig);

  }
  updateCustCategory1(value) {

    this.customerviewservice.updateCustCategory1(this.superUserId, this.custId, value);
    this.snack.open("Updation successful", "", {
      duration: 3000,
    });
  }
  updateCustCategory2(value) {

    this.customerviewservice.updateCustCategory2(this.superUserId, this.custId, value);
    this.snack.open("Updation successful", "", {
      duration: 3000,
    });
  }

  updateCustomerstage(status: string) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      userId: this.superUserId,
      custId: this.custId,
      status: status
    };

    const dialogRef = this.dialog.open(ChangecuststatdialogComponent, dialogConfig);

  }

  updateCustomerPriority(priority: string) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      userId: this.superUserId,
      custId: this.custId,
      priority: priority
    };
    const dialogRef = this.dialog.open(ChangecustprioritydialogComponent, dialogConfig);
  }
  // modalData: {
  //   action: string; // actions like editing and deleting a meeting
  //   event: CalendarEvent; // its the calendae event

  // };
  // onMeetingAdd() {
  //   this.act = "Create"
  //   const dialogRef = this.dialog.open(CalendarAddPopUpComponent, {
  //     width: '600px',
  //     data: {
  //       title: this.modalData?.event.title,
  //       desciption: this.modalData?.event.description,
  //       assignedCustomer: this.modalData?.event.assignedCustomer,
  //       start: this.modalData?.event.start,
  //       end: this.modalData?.event.end, scn: this.act
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {

  //   });
  // }
  onAddSale() {
   if(this.isMobilesize == false) {
    const dialogRef = this.dialog.open(Addnewsale1Component,

      {
      width:"800px",
      data: { scenario: "createfromCustomer", id: this.custId }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
   }
   if(this.isMobilesize == true) {
    this.router.navigate(["/dash/addsale", 'create', this.custId])
   }

  }
  addPayment() {
    this.dialog.open(Paymentreceipt1Component, {
      disableClose: true,
      data: {
        // id:this.saleId,
        orgId: this.orgId,
        cid: this.custId,
        mode: "createCust",
        company: this.cname,
        customerName: this.fname,
        componentName: this.constructor.name
      }
    });
  }
  editPayment(id, sid) {
    this.dialog.open(Paymentreceipt1Component, {
      disableClose: true,
      data: {
        id: sid,
        cid: this.custId,
        mode: "update",
        id1: id,
        componentName: this.constructor.name,

      }
    });
  }
  addTask() {
    this.dialog.open(CrudModal1Component, {
      disableClose: true,
      width: '520px',
      height: 'auto',
      data: {
        cid: this.custId,
        orgId: this.orgId,
        mode: "custCreate",
        company: this.cname,
        firstName: this.fname,
        secondName:this.sname,
        surname: this.surname,

      }
    });
  }
  onCreateFollowUps() {
    let customerNames = this.fname + ' ' + this.sname
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: { id: this.id, companyNames: this.cname, customerNames: customerNames, scenario: "create" }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  onViewCustomer() {
    this.router.navigate(['/dash/addcontacts', 'view', this.custId])
  }
  markasCompleted(taskId: string) {

    this.folloupAmt = this.folloupAmt - 1;
    this.customerviewservice.updateCustomer(this.custId, this.superUserId, this.folloupAmt);
    let completed = true;
    this.customerviewservice.UpdateTask(taskId, completed, this.superUserId);
    this.completedLength = 0;



  }
  onEditCustomer() {
    this.router.navigate(['/dash/addcontacts', 'edit', this.custId])
  }
  onEditFollowUps(taskId: string) {
    let customerNames = this.fname + ' ' + this.sname
    const dialogRef = this.dialog.open(FollowupTaskCreateComponent, {
      width: '700px',
      disableClose: true,
      data: { id: this.id, companyNames: this.cname, customerNames: customerNames, scenario: "edit", followUpId: taskId }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  ngOnDestroy() {
    //this.taskSubscription.unsubscribe();
    //this.meetingSubscription.unsubscribe();
  }
}
