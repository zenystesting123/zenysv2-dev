import { Component, HostListener, OnInit } from '@angular/core';
import { RazorservService } from '../razorserv.service';
import {MatDialog,} from '@angular/material/dialog';
import { InvoicemodalComponent } from '../invoicemodal/invoicemodal.component';
import {CommonService} from "../../common.service"
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  userId:any
  datasource:any
  userData:any
  userDataSubscription:Subscription
  cancelSubSubscription:Subscription
  constructor(
    private common:CommonService,
    private razor:RazorservService,
   
    public dialog: MatDialog
  ) {
    // this.userId = firebase.default.auth().currentUser.uid
    // console.log(this.userId)  
      
}

  ngOnInit(): void {
    this.userDataSubscription=this.common.userDatas.subscribe((data)=>{
      this.userData=data.superUserDetails
      if(!!this.userData.paymentHistory)
      this.datasource=this.userData?.paymentHistory.filter(data=>data.paymentMode=="subscription") 
    })
   
  
  
  }
  displayedColumns: string[] = ['id', 'validity_start', 'validity_end',"duration","charge_at","view" ];


openDialog(id,type){

  const dialogRef = this.dialog.open(InvoicemodalComponent, {
    width: '80%',
    data: {subscription_id:id,type:type}
  });


}

cancelSubscription(id){
  this.cancelSubSubscription=this.razor.cancelsub(id).subscribe((data)=>{
    console.log(data)
  })
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

@HostListener('window:beforeunload')
public ngOnDestroy():void{
this.userDataSubscription.unsubscribe()
if(!!this.cancelSubSubscription){
  this.cancelSubSubscription.unsubscribe()
}
}



}
