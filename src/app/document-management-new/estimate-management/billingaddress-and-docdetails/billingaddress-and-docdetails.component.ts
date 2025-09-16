/*------------------------------------------------
Description : For display bill from,bill to, additional filed and doc details
Input:superUserDetails (used not to reset the form while a filed is edited in userdetils)
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { Profile } from 'src/app/data-models';
import { CustomerData, DocumentData, userData } from '../estimate.model';
import { EstimateService } from '../estimate.service';

@Component({
  selector: 'app-billingaddress-and-docdetails',
  templateUrl: './billingaddress-and-docdetails.component.html',
  styleUrls: ['./billingaddress-and-docdetails.component.scss']
})
export class BillingaddressAndDocdetailsComponent implements OnInit {
  @Input() superUserDetails: Profile;
  orgID: string;
  custID: string;
  saleID: string;
  userData: userData;
  docData: DocumentData;
  customerData: CustomerData;
  constructor(public estimateService: EstimateService) { }

  ngOnInit(): void {
    //bind all the ids and user,customer,doc realted details from service which is related to route used for blocking tags in sub component
    // used not to reset the form while a filed is edited in userdetils or others
    this.orgID = this.estimateService.orgID;
    this.custID = this.estimateService.custID;
    this.saleID = this.estimateService.saleID;
    this.userData = this.estimateService.userData;
    this.docData = this.estimateService.docData;
    this.customerData = this.estimateService.customerData
  }
  // for update panel state
  updatePanleState(val: boolean) {
    if (val == true) {
      this.estimateService.updatePanleState(val, false, false)
    }
  }
}
