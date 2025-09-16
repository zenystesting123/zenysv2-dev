import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StriperefreshurlService } from './striperefreshurl.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-striperefreshurl',
  templateUrl: './striperefreshurl.component.html',
  styleUrls: ['./striperefreshurl.component.scss']
})
export class StriperefreshurlComponent implements OnInit {
  accountId: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private serv:StriperefreshurlService
  ) {
    route.params.subscribe((val) => {
    this.accountId=val['accountId']
    console.log(this.accountId)
    if(this.accountId){
      this.serv.getnewLink(this.accountId).subscribe((data:any)=>{
        console.log(data)
        if(data.url){
          this.document.location.href = data.url;
        }
      })
    }
    })
   }

  ngOnInit(): void {
  }

}
