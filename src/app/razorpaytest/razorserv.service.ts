// *********************************************************************************
// Description: RContains all the http requests in razorpay component

// ***********************************************************************************

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
export interface ICustomWindow extends Window{
   __custom_global_stuff:string
}
function  getWindow():any{
  return window;
}


@Injectable({
  providedIn: 'root'
})
export class RazorservService {
  get nativeWindow():ICustomWindow{
    return getWindow()
  }

  constructor(
    private http: HttpClient
  ) { }

  
//  function to create an order
  createOrder(orderDetails) {
    return this.http.post(environment.cloudFunctions.createOrder, orderDetails);
  }

 
//  function to create subscription
subscriptions(options){
  return this.http.post(environment.cloudFunctions.subscription,options);
}

// function to get a created payment
getpayment(payment_id){
  return  this.http.post(environment.cloudFunctions.getpayment,{payment_id:payment_id})
}

// function to get a crated subscription details
getplansubs(subscriptions_id){
  return  this.http.post(environment.cloudFunctions.subplans,{subscriptions_id:subscriptions_id})
}


//  function to delete a subscription
cancelsub(subscription_id){
  return this.http.post(environment.cloudFunctions.cancelsubscription,{subscription_id:subscription_id})
}

// function to get all the invoices of a subscription used in invoice modal 
subscriptioninvoices(subscription_id){
  return this.http.post(environment.cloudFunctions.getsubscriptioninvoices,{subscription_id:subscription_id})
}
getsubscription(subscription_id) {
  return this.http.post(environment.cloudFunctions.getsubscription, {
    subscription_id: subscription_id,
  });
}


}
