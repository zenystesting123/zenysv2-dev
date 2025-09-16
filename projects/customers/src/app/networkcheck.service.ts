import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NetworkCheckService {
  isConnectionAvailable: boolean = navigator.onLine;
  constructor(private httpClient: HttpClient) {

    window.addEventListener('online', () => {
      this.isConnectionAvailable = true;
    });

    window.addEventListener('offline', () => {
      this.isConnectionAvailable = false;
    });

  }
  onNetworkCheck(){
      return this.isConnectionAvailable
  }
}
