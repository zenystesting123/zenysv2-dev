import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RazorService {

  constructor(private http: HttpClient) { }
  makepaylink(data) {
    return this.http.post(environment.cloudFunctions.makepaylink, data)
  }
  makepaylinkSubMerchant(data) {
    return this.http.post(environment.cloudFunctions.createSubMerchantPayLink, data)
  }
}
