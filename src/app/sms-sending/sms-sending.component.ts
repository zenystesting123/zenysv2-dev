import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RazorpaysubmerchantService } from '../settings/razorpaysubmerchant/razorpaysubmerchant.service';

@Component({
  selector: 'app-sms-sending',
  templateUrl: './sms-sending.component.html',
  styleUrls: ['./sms-sending.component.scss']
})
export class SmsSendingComponent implements OnInit {

  constructor(private http: HttpClient,private serv:RazorpaysubmerchantService,) { }

  ngOnInit(): void {
  }
  sendSms(){
    // http://rocket.sdctechnologies.co.in/api/mt/SendSMS?user=demo&password=demo123&senderid=WEBSMS&channel=Promo&DCS=0&flashsms=0&number=91989xxxxxxx&text=test message&route=##
    const headers = new HttpHeaders()
    const params = new HttpParams()
    let url="https://secure.sdctechnologies.co.in/api/mt/SendSMS?user=crmhits&password=crm2020&senderid=WEBSMS&channel=Trans&DCS=0&flashsms=0&number=919731180022&text=testmessages&route=14"
    let data=this.http.post(url,
    {headers, params})

    console.log("HTTPs req", data)
    data.subscribe((val)=>{
      console.log("HTTPs req",val)
    })

    let url2="http://rocket.sdctechnologies.co.in/api/mt/SendSMS?user=crmhits&password=crm2020&senderid=WEBSMS&channel=Trans&DCS=0&flashsms=0&number=919731180022&text=testmessages&route=14"
    let data2=this.http.post(url2,
    {headers, params})

    console.log("HTTP req", data2)
    data2.subscribe((val)=>{
      console.log("HTTP req",val)
    })
  }
  apiRequest(){
    let data=[];
    this.serv.createSub(data).subscribe((data:any)=>{
      console.log(data)

  })
}

}
