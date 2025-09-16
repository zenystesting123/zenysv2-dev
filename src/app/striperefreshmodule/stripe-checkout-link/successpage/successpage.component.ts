import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { StripeCheckoutLinkService } from '../stripe-checkout-link.service';

@Component({
  selector: 'app-successpage',
  templateUrl: './successpage.component.html',
  styleUrls: ['./successpage.component.scss']
})
export class SuccesspageComponent implements OnInit {
  // invoiceId: any;
  userId: any;
  docData: any;
  custDetails:any;
  stripeSessionId:any;
  paymentDone:Boolean=false
  type:any
  docId: any;
  constructor(private serv:StripeCheckoutLinkService,
    // private stripeService: StripeService
    private route: ActivatedRoute,
    ) {
      route.params.subscribe((val) => {
        this.docId=val['docId']
        this.type=val['type']
        this.userId=val['userId']
        console.log(this.userId)
        // console.log(this.invoiceId)
        this.serv.getDoc(this.userId,this.docId,this.type).subscribe((data1:any)=>{
          console.log(data1)
          this.docData=data1.docData
          this.stripeSessionId=data1.stripeSessionId
          if(data1.collectedAmount!=data1.docData.totalInclTax){
            console.log("payment done first time")
        this.serv.getCustomer(this.userId)
        .pipe(take(1))        
        .subscribe((data:any)=>{
            this.custDetails=data
            this.serv.retrieveCheckoutSession({
              // invoiceId:this.invoiceId,
              // invoiceNo:this.docData.docNumber,
              // customerId:data1.customerData.custID,
              // customerName:data1.customerData.fname1+" "+data1.customerData.sname?data1.customerData.sname:"",
              // companyName:data1.customerData.companyName,
              // userId:this.userId,
              // saleId:data1.docData.saleID,
              // saleTitle:data1.docData.saleTitle,
              sessionId:this.stripeSessionId,
              stripeAccountId:data.stripeAccountId,
              // createdBy:data1.createdBy
            }).subscribe((data:any)=>{
              console.log(data)
              if(data.payment_status=="paid"){
                this.paymentDone=true
              }
            })
          })
        }
        })  
               

      })
     }
  

  ngOnInit(): void {
  }

}
