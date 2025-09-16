import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { RazorservService } from '../razorserv.service';
import { RazortodbService } from '../razortodb.service';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { InvoicemodalComponent } from '../invoicemodal/invoicemodal.component';
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  userId:any
  datasource:any
  userData:any

  constructor(
    private razor:RazorservService,
    private db:RazortodbService,
    private router:Router,
    public dialog: MatDialog
  ) {
    this.userId = firebase.default.auth().currentUser.uid
    // console.log(this.userId)  
    
   
}

  ngOnInit(): void {
    this.db.getUsers(this.userId).subscribe(res=>{
     //  console.log(this.userData)
     if(res.superUserId==this.userId)
     {
      this.userData=res
     if(!!this.userData.paymentHistory)
      this.datasource=this.userData?.paymentHistory.filter(data=>data.paymentMode=="manual")
    }
    else
    {
      this.db.getUsers(res.superUserId).subscribe(res2=>{
        this.userData=res2
        if(!!this.userData.paymentHistory)
         this.datasource=this.userData?.paymentHistory.filter(data=>data.paymentMode=="manual")
      },err2=>{console.log(err2)})

    }
   
   }
   
   ,err=>{console.log(err)})
   
  
  
  }
  displayedColumns: string[] = ['id', "plan",'validity_start', 'validity_end', "duration","amount" ];


openDialog(id,type){

  const dialogRef = this.dialog.open(InvoicemodalComponent, {
    width: '80%',
    data: {subscription_id:id,type:type}
  });


}
findAmount(packageDuration,plan){
  var amount=0
  if(packageDuration=="monthly"){
    // var currentPlan=''
    if(plan){
      if(plan=='gold'){
        amount=590
      }
      else if(plan=='diamond'){
        amount=944
      }
      return amount
    }
    else
    return 590
  }
  if(packageDuration=="yearly"){
   
    if(plan){
      if(plan=='gold'){
        amount=5900
      }
      else if(plan=='diamond'){
        amount=9440
      }
      return amount
    }
    else
    return 5900
  }
}

}
