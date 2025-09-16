import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isThisHour } from 'date-fns/esm';
import { Observable } from 'rxjs';
import { ReportleadService } from './reportlead.service';

@Component({
  selector: 'app-reportleaddialog',
  templateUrl: './reportleaddialog.component.html',
  styleUrls: ['./reportleaddialog.component.scss']
})
export class ReportleaddialogComponent implements OnInit {
  incorrectRequirement: boolean = false;
  incorrectContact: boolean = false;
  reqMet: boolean = false;
  leadId: string;
  invalidContactFlag:boolean;
  invalidReqFlag:boolean;
  reqMetFlag:boolean;
  purchasedLeadId:string;
  invContactCount: number;
  invReqCount: number;
  reqMetCount: number;
  user: Observable<any>; //
  userDetailsAuth: any = null; //user details from auth module

  constructor(@Inject(MAT_DIALOG_DATA) data, private dialogRef: MatDialogRef<ReportleaddialogComponent>, private service: ReportleadService, private afAuth: AngularFireAuth) {
    this.leadId = data.id;//get the lead id passed on to the dialog
    this.purchasedLeadId=data.purchasedLeadId
    this.invalidContactFlag=data.invalidContactFlag;
    this.invalidReqFlag=data.invalidReqFlag;
    this.reqMetFlag=data.reqMetFlag;
  }


  ngOnInit(): void {
    this.user = this.afAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetailsAuth = user;
          this.service.getLeadDetails(this.leadId).subscribe((data) => {
            this.invContactCount=data.invContactCount
            this.invReqCount=data.invReqCount
            this.reqMetCount=data.reqMetCount
          })
        }
      })
  }
  onSubmit() {
    this.service.purchasedLeadUpdation(this.userDetailsAuth.uid,this.purchasedLeadId,this.incorrectContact,this.incorrectRequirement,this.reqMet)
    if(this.incorrectContact){
      this.invContactCount=this.invContactCount+1
    }
    else if(this.incorrectRequirement){
      this.invReqCount=this.invReqCount+1
    }
    else if(this.reqMet){
      this.reqMetCount=this.reqMetCount+1
    }
    this.service.SharsharedLeadUpdate(this.leadId,this.invContactCount,this.invReqCount,this.reqMetCount)
    this.dialogRef.close();

  }
  onCancel() {
    this.dialogRef.close();// close the dialogue
  }

}
