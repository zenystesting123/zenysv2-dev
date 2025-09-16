import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { LeadPurchaseService } from './lead-purchase.service';
@Component({
  selector: 'app-lead-purchase',
  templateUrl: './lead-purchase.component.html',
  styleUrls: ['./lead-purchase.component.scss'],
})
export class LeadPurchaseComponent implements OnInit, OnDestroy {
  subcriptionUser: Subscription;
  subcriptionUserDetails: Subscription;
  subcriptionUserSubmitted: Subscription; 
  subcriptionLead: Subscription;
  user: firebase.default.UserInfo;
  leadPoints: number;
  leadPointsCust: number;
  pointsEarnedLead: number;
  noPurchasesLead: number;
  usersId: string;
  leadId: string;
  constructor(
    public dialogRef: MatDialogRef<LeadPurchaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _snackBar: MatSnackBar,
    private afAuth: AngularFireAuth,
    private db: LeadPurchaseService
  ) {}
  ngOnInit(): void {
    this.subcriptionUser = this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        this.usersId = this.user.uid;
        this.leadId = this.data.id;
        this.subcriptionUserDetails =  this.db.getUser('/users', this.usersId).subscribe((data) => {
          this.leadPoints = data.leadPoints;
        })
        this.subcriptionUserSubmitted =  this.db.getLeadShareUser('/users', this.data.submittedBy).subscribe((data)=>{
         this.leadPointsCust = data.leadPoints;
       })
       this.subcriptionLead = this.db.getSharedLeads('/SharedLeads', this.data.id).subscribe((data)=>{
          this.pointsEarnedLead = data.pointsEarned;
          this.noPurchasesLead = data.noPurchases;
        })
      }
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
  onSubmit() {
    let datePlaced = new Date().getTime();
    this.pointsEarnedLead = this.pointsEarnedLead + this.data.leadScore;
    this.noPurchasesLead = this.noPurchasesLead + 1;
    this.leadPoints = this.leadPoints - this.data.leadScore;
    this.leadPointsCust = this.leadPointsCust + this.data.leadScore;
    this.db.updateUser(this.leadPoints, this.usersId);
    this.db.updateUserShare(this.leadPointsCust, this.data.submittedBy);
    this.db.updateLead(
      this.pointsEarnedLead,
      this.noPurchasesLead,
      this.leadId
    );
    this.db.createLeadPurchases(
      this.leadId,
      this.usersId,
      datePlaced,
      this.data.leadScore
    );
        this.db.createPurchasedLead(
          this.usersId,
          this.leadId,
          datePlaced,
          this.data.leadScore,
          this.data.firstName,
          this.data.lastName,
          this.data.companyName,
          this.data.leadEmail,
          this.data.leadContactNo,
          this.data.description,
          this.data.submittedBy
        );
    this._snackBar.open('Successfully Purchased Lead', 'Done', {
      duration: 2000,
    });
    this.dialogRef.close();
  }
  ngOnDestroy() {
    this.subcriptionUser.unsubscribe();
    this.subcriptionUserDetails.unsubscribe();
    this.subcriptionUserSubmitted.unsubscribe();
    this.subcriptionLead.unsubscribe();
  }
}
