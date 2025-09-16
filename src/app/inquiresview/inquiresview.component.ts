
import { InquirestableComponent } from './../inquirestable/inquirestable.component';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogDatain {

  id:string;
  mode:string;
  Message:string;
  Date:string;
  Name:string; 
  Phone:string;
  Email:string;
  Status:string;

}
@Component({
  selector: 'app-inquiresview',
  templateUrl: './inquiresview.component.html',
  styleUrls: ['./inquiresview.component.scss']
})
export class InquiresviewComponent implements OnInit {

  constructor( public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,   public dialogRef: MatDialogRef<InquirestableComponent>,) {
  
   }

  ngOnInit(): void {
  }
  close(){
    this.dialogRef.close();
  }
  // createOppotunity(){
  //   this.dialogRef.close();
  //   this.dialog.open(OpportunityCustomerComponent, {
  //     width: '1200px',
  //     data: {
  //       id:this.data.id,
  //       mode:"create",
  //       Message:this.data.Message,
  //       Date:this.data.Date,
  //       Name:this.data.Name,
  //       Phone:this.data.Phone,
  //       Email:this.data.Email,
  //       Status:this.data.Status,
  //     }
  //   });
  // }

}
