/*------------------------------------------------
Description : For display bill from,bill to, additional filed and doc details
Input:superUserDetails (used not to reset the form while a filed is edited in userdetils)
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { Profile } from 'src/app/data-models';
import { CustomerData, DocumentData, userData } from '../quotation.model';
import { QuotationService } from '../quotation.service';

@Component({
  selector: 'app-billingadress-and-docdetails-quote',
  templateUrl: './billingadress-and-docdetails-quote.component.html',
  styleUrls: ['./billingadress-and-docdetails-quote.component.scss']
})
export class BillingadressAndDocdetailsQuoteComponent implements OnInit {

  @Input() superUserDetails: Profile;
  orgID: string;
  custID: string;
  saleID: string;
  userData: userData;
  docData: DocumentData;
  customerData: CustomerData;
  constructor(public quotationService: QuotationService) { }

  ngOnInit(): void {
    //bind all the ids and user,customer,doc realted details from service which is related to route used for blocking tags in sub component
    // used not to reset the form while a filed is edited in userdetils or others
    this.orgID = this.quotationService.orgID;
    this.custID = this.quotationService.custID;
    this.saleID = this.quotationService.saleID;
    this.userData = this.quotationService.userData;
    this.docData = this.quotationService.docData;
    this.customerData = this.quotationService.customerData
  }
  // for update panel state
  updatePanleState(val: boolean) {
    if (val == true) {
      this.quotationService.updatePanleState(val, false, false)
    }
  }
}