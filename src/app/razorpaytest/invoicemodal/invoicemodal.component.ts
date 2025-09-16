import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
// import { AnyNaptrRecord, AnyNsRecord } from 'dns';
import { RazorservService } from '../razorserv.service';


@Component({
  selector: 'app-invoicemodal',
  templateUrl: './invoicemodal.component.html',
  styleUrls: ['./invoicemodal.component.scss']
})
export class InvoicemodalComponent implements OnInit {
  dataSource:any
  @Input() data:any
  key:String

  constructor( public razor:RazorservService) { 
    this.key=environment.RAZORPAY_KEY_ID
      // razor.subscriptioninvoices(this.data.subscription_id).subscribe((res:any)=>{
      //   if(this.data.type=="subscription"){
      //     // console.log(this.data.subscription_id)
      //     this.dataSource=res.items.filter(dat=>dat.subscription_id==this.data.subscription_id)
      //   // console.log(this.dataSource)
      //   }
        
      //   console.log(res.items)
      // },(err)=>{

      // })

    }

  ngOnInit(): void {
    console.log(this.data)
    this.razor.subscriptioninvoices(this.data.subscription_id).subscribe((res:any)=>{
        
        this.dataSource=res.items
        console.log(res.items)
      },(err)=>{
        if(err)
        console.log("error in loading invoice")
      })

  }
displayedColumns: string[] = [
'id','amount',
'amount_due',
'amount_paid',
'billing_end',
'billing_start','paid_at',"download"    ];


}
