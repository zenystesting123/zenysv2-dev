import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocSettingsService {
  yourAddressAdded:boolean=false;
  ToAddressAdded:boolean=false;
  itemsAdded:boolean=false;
  docDataAdded:boolean=false;
  contactAdded:boolean=false;
  youDetailsFrom:string;
  constructor() { }
}
