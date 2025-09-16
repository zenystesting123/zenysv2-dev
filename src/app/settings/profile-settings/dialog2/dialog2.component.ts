import { Component, OnInit,Inject, OnDestroy, } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { InvitationModel, subUsers } from 'src/app/data-models';
import { ProfileSettingsService } from '../profile-settings.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog2',
  templateUrl: './dialog2.component.html',
  styleUrls: ['./dialog2.component.scss'],
})
export class Dialog2Component implements OnInit, OnDestroy {
  plan: any;
  noofSubusers: any;
  newPlan: String;
  newNosubs: number;
  subuserCount = 0; //variable to hold the active users count
  invitationsCount = 0; //pending/declined invitation count
  invitationSubscription: Subscription; //subscription from invitations collection

  constructor(
    public dialogRef: MatDialogRef<Dialog2Component>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceInst: ProfileSettingsService
  ) {
    // console.log(this.data.noofSubusers)
    // console.log(this.data.plan)
    this.plan = this.data.plan;
    this.noofSubusers = this.data.noofSubusers;
    this.newNosubs = this.noofSubusers;
    if (!!!this.plan.plan) this.plan.plan = 'gold';
  }
  ngOnInit() {
    // fetch invitations of this superuser and check
    this.invitationSubscription = this.serviceInst
      .getInvitation(this.data.superUserId)
      .subscribe((data) => {
        const invitations = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as InvitationModel;
        });
        const filteredInvitations1 = invitations.filter(function (e) {
          return e.status === 'active';
        });
        this.subuserCount = filteredInvitations1.length; //active users count
        const filteredInvitations2 = invitations.filter(function (e) {
          return e.status == 'invited' || e.status == 'declined';
        });
        this.invitationsCount = filteredInvitations2.length; //prnding/declined invitations count
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onOKClick() {
    this.dialogRef.close({ newPlan: this.newPlan, newNosubs: this.newNosubs });
  }
  ngOnDestroy(): void {
      this.invitationSubscription?.unsubscribe();//unsubscribe subscriptions
  }
}
