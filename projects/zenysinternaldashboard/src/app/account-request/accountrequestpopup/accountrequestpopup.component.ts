import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AccountRequestService } from '../account-request.service';
@Component({
  selector: 'app-accountrequestpopup',
  templateUrl: './accountrequestpopup.component.html',
  styleUrls: ['./accountrequestpopup.component.scss']
})
export class AccountrequestpopupComponent implements OnInit {
  originalindb:string=""
  rzrAccountId:string=""
  editToggle:boolean=true
  email:string

  constructor(public dialogRef: MatDialogRef<AccountrequestpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,public serv:AccountRequestService) {
      console.log(this.data)
      this.serv.getUser(this.data.id).subscribe((data:any)=>{
        this.email=data.email
        if(data.rzrAccountId){
          this.rzrAccountId=data.rzrAccountId
          this.originalindb=data.rzrAccountId
        }
      })
     }

  ngOnInit(): void {
  }

  updateRequest(){
    this.serv.updateUser(this.data.id,this.rzrAccountId).then(()=>{
  this.serv.updatetransferRequest(this.data.id,{dateApproved:Date.now(),requestStatus:"Approved",rzrAccountId:this.rzrAccountId}).then(()=>{
    this.dialogRef.close()
  })    
    })
  }
  editToggler(){
    this.editToggle=!this.editToggle
  }
  closeDialog(){
    this.dialogRef.close()
  }

}
