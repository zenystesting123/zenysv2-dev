import {
  Component,
  ChangeDetectorRef,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { PurchasedleadsService } from './purchasedleadsservice.service';
import { Observable, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ReportleaddialogComponent } from '../../reportleaddialog/reportleaddialog.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PurchasedLeads } from '../../data-models';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Addnewsale1Component } from 'src/app/addnewsale1/addnewsale1.component';
export enum StarRatingColor {
  primary = 'primary',
  accent = 'accent',
  warn = 'warn',
}

@Component({
  selector: 'app-purchasedleads',
  templateUrl: './purchasedleads.component.html',
  styleUrls: ['./purchasedleads.component.scss'],
})
export class PurchasedleadsComponent implements OnInit, OnDestroy {
  isTabletsize: boolean = false;
  isMobilesize: boolean = false;
  subscribeLead: Subscription;
  subscribeUser: Subscription;
  subscribeUserDetails: Subscription;
  subscribePurchasedLead: Subscription;
  rateLead: number;
  rateUser: number;
  noOfRatingReceivedLead: number = 0;
  noOfRatingReceivedUser: number = 0;
  currentScroreLead: number;
  currentScroreUser: number;
  @Input('starCount') private starCount: number = 5;
  @Input('color') private color: string = 'accent';
  @Output() private ratingUpdated = new EventEmitter();
  private snackBarDuration: number = 2000;
  private ratingArr = [];
  user: Observable<any>; //
  userDetailsAuth: any = null; //user details from auth module
  purchasedLeads: PurchasedLeads[];
  reportFlag: boolean = false;
  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,private breakpointObserver: BreakpointObserver,
    public service: PurchasedleadsService,
    private readonly afs: AngularFirestore,
    private ref: ChangeDetectorRef,
    private afAuth: AngularFireAuth
  ) {
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
  }

  ngOnInit(): void {
    this.user = this.afAuth.authState;
    this.subscribeUserDetails = this.user.subscribe((user) => {
      if (user) {
        this.userDetailsAuth = user;
        this.subscribePurchasedLead = this.service
          .readPurchasedLeads(this.userDetailsAuth.uid)
          .subscribe((data) => {
            this.purchasedLeads = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as PurchasedLeads;
            });
          });
      }
    });
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }
  openDialog(
    leadID: string,
    customerId: string,
    id: string,
    invalidContactFlag: string,
    invalidReqFlag: string,
    reqMetFlag: string
  ): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: leadID,
      custId: customerId,
      purchasedLeadId: id,
      invalidContactFlag: invalidContactFlag,
      invalidReqFlag: invalidReqFlag,
      reqMetFlag: reqMetFlag,
    };
    const dialogRef = this.dialog.open(ReportleaddialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {});
  }
  setReportFlag() {
    this.reportFlag = true;
  }
  // onAddContact(
  //   id,
  //   firstName,
  //   lastName,
  //   companyName,
  //   leadEmail,
  //   leadContactNo,
  //   title
  // ) {
  //   this.dialog.open(OpportunityCustomerComponent, {
  //     width: '1000px',
  //     data: {
  //       scenario: 'create',
  //       from: 'PurchasedLead',
  //       id: id,
  //       firstName: firstName,
  //       lastName: lastName,
  //       leadEmail: leadEmail,
  //       leadContactNo: leadContactNo,
  //       companyName: companyName,
  //       title:title
  //     },
  //   });
  // }
  onViewSale(saleId: string) {
    const dialogRef = this.dialog.open(Addnewsale1Component, {
      panelClass: 'custom-dialog-container',
      width: '800px',
      data: { scenario: 'view', id: saleId },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  onViewCustomer(custId: string) {
    this.router.navigate(['/dash/addcontacts', 'view', custId]);
  }
  onAddSale(customerId: string, purchaseId,title:string) {
    if( this.isMobilesize == false){
    const dialogRef = this.dialog.open(Addnewsale1Component, {
      panelClass: 'custom-dialog-container',
      width:"800px",
      data: { scenario: 'create', id: customerId, purchasedId: purchaseId,title:title },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  if( this.isMobilesize == true){
    this.router.navigate(["/dash/addsale", 'create', customerId,purchaseId,title])
  }
  }
  onClickRating(leadSharedRating: number) {
    this.snackBar.open('You rated ' + leadSharedRating + ' / ' + this.starCount, '', {
      duration: this.snackBarDuration,
    });
    this.ratingUpdated.emit(leadSharedRating);
    return false;
  }
  onClick(
    leadSharedRating: number,
    purchasedLeadId: string,
    leadId: string,
    submittedBy: string
  ) {
    this.onLead(leadId, leadSharedRating, submittedBy);
    this.service.purchasedLeadUpdation(
      this.userDetailsAuth.uid,
      purchasedLeadId,
      leadSharedRating
    );
  }
  onLead(leadId: string, leadSharedRating: number, submittedBy: string) {
    this.subscribeLead = this.service.getLead(leadId).subscribe((data) => {
      this.noOfRatingReceivedLead = data.noOfRatingReceived;
      this.currentScroreLead = data.leadSharedRating;
      this.subscribeLead.unsubscribe();
      this.rateLead =
        (this.currentScroreLead * this.noOfRatingReceivedLead + leadSharedRating) /
        (this.noOfRatingReceivedLead + 1);
      let leadRatingNoLead = this.noOfRatingReceivedLead + 1;
      this.service.sharedLeadUpdation(leadId, leadRatingNoLead, this.rateLead);
    });
    this.onUser(submittedBy, leadSharedRating);
  }
  onUser(submittedBy: string, leadSharedRating: number) {
    this.subscribeUser = this.service.getUser(submittedBy).subscribe((data) => {
      this.noOfRatingReceivedUser = data.noOfRatingReceived;
      this.currentScroreUser = data.leadSharedRating;
      this.subscribeUser.unsubscribe();
      this.rateUser =
        (this.currentScroreUser * this.noOfRatingReceivedUser + leadSharedRating) /
        (this.noOfRatingReceivedUser + 1);
      let leadRatingNoUser = this.noOfRatingReceivedUser + 1;
      this.service.userUpdation(submittedBy, leadRatingNoUser, this.rateUser);
      // console.log("rate"+this.rateUser)
      // console.log("nos"+this.noOfRatingReceivedUser)
    });
  }
  showIcon(index: number, leadSharedRating: number) {
    if (leadSharedRating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
  ngOnDestroy() {
    this.subscribeUserDetails.unsubscribe();
    this.subscribePurchasedLead.unsubscribe();
  }
}
