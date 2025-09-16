/*------------------------------------------------
Description : For display bill from,bill to, additional filed and doc details
Input:superUserDetails (used not to reset the form while a filed is edited in userdetils)
----------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { Profile } from 'src/app/data-models';
import { CustomerData, DocumentData, userData } from '../invoice.model';
import { InvoicesService } from '../invoices.service';
@Component({
  selector: 'app-billingadress-and-docdetails-invoice',
  templateUrl: './billingadress-and-docdetails-invoice.component.html',
  styleUrls: ['./billingadress-and-docdetails-invoice.component.scss']
})
export class BillingadressAndDocdetailsInvoiceComponent implements OnInit {
  @Input() superUserDetails: Profile;
  orgID: string;
  custID: string;
  saleID: string;
  userData:userData;
  docData: DocumentData;
  customerData: CustomerData;
  constructor(public invoicesService: InvoicesService) { }

  ngOnInit(): void {
    //bind all the ids and user,customer,doc realted details from service which is related to route used for blocking tags in sub component
    // used not to reset the form while a filed is edited in userdetils or others
    this.orgID=this.invoicesService.orgID;
    this.custID=this.invoicesService.custID;
    this.saleID=this.invoicesService.saleID;
    this.userData=this.invoicesService.userData;
    this.docData=this.invoicesService.docData;
    this.customerData=this.invoicesService.customerData
  }
   // for update panel state
  updatePanleState(val: boolean) {
    if (val == true) {
      this.invoicesService.updatePanleState(val, false, false)
    }
  }
}
