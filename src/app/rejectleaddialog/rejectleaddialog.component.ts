/*Component for rejecting a contact by selecting the reason for rejection
Author: Mohan
Date: 6/3/2020
*/

import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RejectleadserviceService } from './rejectleadservice.service';

@Component({
  selector: 'app-rejectleaddialog',
  templateUrl: './rejectleaddialog.component.html',
  styleUrls: ['./rejectleaddialog.component.scss'],
  providers: [DatePipe]
})
export class RejectleaddialogComponent implements OnInit {
  rejectionReason:string = null;
rejectionDate : Date = new Date();
  contactStatus:string = null;
  userId:string;
  custId:string

  constructor(private _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) data, private dialogRef: MatDialogRef<RejectleaddialogComponent>, private service: RejectleadserviceService, private datePipe: DatePipe) {
this.userId=data.userId;
this.custId = data.custId;
   }

  ngOnInit(): void {
  }

  onSubmit() {
    // console.log("id"+this.custId)
    // console.log("reason"+this.rejectionReason)
    this.service.rejectContact(this.userId,this.custId,{'status':'Rejected', 'rejectionReason':this.rejectionReason, 'rejectionDate':this.rejectionDate})
    this._snackBar.open("Contact status changed to Rejected!","",{
      duration: 2000,
    });
    
    this.dialogRef.close();// close the dialogue
  }
  onCancel() {
    this.dialogRef.close();// close the dialogue
  }

  changeValue(value){
    this.rejectionReason = value;

  }

}
