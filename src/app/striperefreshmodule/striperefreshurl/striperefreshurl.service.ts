import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class StriperefreshurlService {

  constructor(private http:HttpClient) { }
  getnewLink(accountId){
  return this.http.post(environment.cloudFunctions.createAccountLink,{accountId:accountId})
  }

}
