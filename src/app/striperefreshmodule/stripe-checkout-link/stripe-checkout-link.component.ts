import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StripeCheckoutLinkService } from './stripe-checkout-link.service';
import { ActivatedRoute } from '@angular/router';
import { Currencies } from '../../currencies';
// import { StripeService } from 'ngx-stripe';
declare var Stripe;
@Component({
  selector: 'app-stripe-checkout-link',
  templateUrl: './stripe-checkout-link.component.html',
  styleUrls: ['./stripe-checkout-link.component.scss']
})
export class StripeCheckoutLinkComponent implements OnInit {
  // invoiceId: any;
  userId: any;
  docData: any;
  custDetails:any;
  doccustDetails:any;
  createdBy: any;
  alreadyPaid:Boolean=false
  totalInclTax:any
  currency: any;
  loader:boolean=false
  type: void;
  docId:any
  constructor(private serv:StripeCheckoutLinkService,
    // private stripeService: StripeService
    private route: ActivatedRoute,
    ) {
      route.params.subscribe((val) => {
        this.docId=val['docId']
        this.userId=val['userId']
        this.type=val['type']
        console.log(this.userId)
        // console.log(this.invoiceId)
        this.serv.getDoc(this.userId,this.docId,this.type).subscribe((data:any)=>{
          console.log(data)
          if(data.collectedAmount==data.docData.totalInclTax){
            this.alreadyPaid=true
          }
          this.totalInclTax=data.docData.totalInclTax
          this.currency=data.docData.currency
          this.docData=data.docData
          this.doccustDetails=data.customerData
          this.createdBy=data.createdBy
        })  
        this.serv.getCustomer(this.userId).subscribe(data=>{
          this.custDetails=data
        })       

      })
     }
  

  ngOnInit(): void {
  }
  checkout() {
    this.loader=true
    console.log(this.custDetails.stripeAccountId)
    var basicunit = Currencies.getCurencies().filter(
      (cur) => cur.isoCode == this.docData.currency
    )[0].basicUnit;
    var amount= this.docData.totalInclTax * basicunit      
    var stripe = Stripe(environment.stripePublishableKey, {
      stripeAccount: this.custDetails.stripeAccountId?this.custDetails.stripeAccountId:"",
    })
    const data={
      stripeAccountId: this.custDetails.stripeAccountId?this.custDetails.stripeAccountId:"",
      currency:this.docData.currency.toLowerCase(),
      docId:this.docId,
      amount:amount,
      superUserId:this.userId,
      createdById: this.createdBy,
      customerCompany: this.doccustDetails.companyName,
      customerId: this.doccustDetails.custID,
      customerName: this.doccustDetails.fname1,
      customerSecondName: this.doccustDetails.sname?this.doccustDetails.sname:"",
      docprefixAndDocNumber: this.docData.prefixAndDocNumber?(this.docData.prefixAndDocNumber):null,
      saleTitle: this.docData.saleTitle,
      saleid: this.docData.saleID,
      type:this.type

    }
    console.log(data)
    // Check the server.js tab to see an example implementation
    this.serv.createCheckoutSession(data)
      .subscribe((session:any) => {
        console.log(session)
        if(!!session.sessionId){
        this.serv.updateDoc(this.userId,this.docId,session.sessionId,this.type).then(()=>{
          stripe.redirectToCheckout({ sessionId: session.sessionId }).then(function (result) {
            console.log(result.error.message);
        }
            )
        })
      }
          
        })    
      
  }

}
