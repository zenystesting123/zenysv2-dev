// *********************************************************************************
// Description: Popup for selecting no of subusers and payment type and duration
// Inputs:data
// Outputs:
// ***********************************************************************************

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import{environment} from "../../../environments/environment"
import { RazortodbService } from '../razortodb.service';
import { Subject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
@Component({
  selector: 'app-selectpopup',
  templateUrl: './selectpopup.component.html',
  styleUrls: ['./selectpopup.component.scss']
})
export class SelectpopupComponent implements OnInit {
  value: any="sub"
  duration:any="yearly"
  noofSubUsers:number=1
  totalAmount:number
  amountYearlyDMD:number
  amountMonthlyDMD:number
  amountMonthlyGLD:number
  amountYearlyGLD:number
  amountYearlySLV:number
  currency: string;
  networkConnection: boolean;
  commonServiceUserSubscription: Subscription; //common service user subscription


  constructor(
    public dialogRef: MatDialogRef<SelectpopupComponent>,
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private db:RazortodbService
  ) {
    if(data.currency=="INR"){
      this.currency="₹."
    }
    else if(data.currency=="USD"){
      this.currency="$."
    }
    else if(data.currency=="EUR"){
      this.currency="€."
    }
    this.amountYearlyDMD=Math.round(environment.YEARLY_AMOUNT_DMD[data.place]/100)
    this.amountMonthlyDMD=Math.round(environment.MONTHLY_AMOUNT_DMD[data.place]/100)
    this.amountYearlyGLD=Math.round(environment.YEARLY_AMOUNT_GOLD[data.place]/100)
    this.amountMonthlyGLD=Math.round(environment.MONTHLY_AMOUNT_GOLD[data.place]/100)
    this.amountYearlySLV=Math.round(environment.YEARLY_AMOUNT_SLV[data.place]/100)
  }

  ngOnInit(): void {
    this.commonServiceUserSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if(allData.superUserDetails.noSubusers === 0){
          this.noofSubUsers = 1;
        }else{
          this.noofSubUsers = allData.superUserDetails.noSubusers;
        }
      });
  }
  onSelect(){
    this.dialogRef.close({plan:this.value+""+this.duration,quantity:this.noofSubUsers});
  }
  onClose(): void {
    this.dialogRef.close();
  }
  onCheckNetwork() {
    return this.networkConnection = this.networkCheck.onNetworkCheck();
  }

}
