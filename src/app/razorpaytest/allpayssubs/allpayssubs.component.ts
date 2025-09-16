// *********************************************************************************
// Description: Component that displays all invoices of the user including payments done and subscription recurring payments
//               The data is fetched from the invoices of zenys main account 
// ***********************************************************************************
import {
  Component,
  OnInit,
  ViewChild,
  AfterContentInit,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonService } from 'src/app/common.service';
import { ZenysmainaccountService } from 'src/app/zenysmainaccount.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-allpayssubs',
  templateUrl: './allpayssubs.component.html',
  styleUrls: ['./allpayssubs.component.scss']
})
export class AllpayssubsComponent implements OnInit,AfterContentInit {
  displayedColumns: string[] = [ //for table to display the invoices
    // 'docNumber',
    // 'companyName',
    // 'name',
    'saleTitle',
    'docDate',
    'totalInclTax',
    'collectedAmount',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  page: number = 1;
  pagesize: number = 10;
  documentsArray: any; // variable that holds all the invoices
  userId: string; 
getInvoicesSubs:Subscription // subscription to get all the invoices
  constructor(private router:Router,private razdb:ZenysmainaccountService,private common:CommonService) { 
    //fetching all the invoices from zenys main account
    this.getInvoicesSubs=this.razdb.getInvoicesFromZenys(this.common.superUserData.zenysCustId).subscribe((data)=>{
      this.documentsArray=data
    })

  }

  ngOnInit(): void {
  }
  route(){
  this.router.navigate(['dash/razorpay/razorpay'])
  }
  getSelectedIndex(){
    return 1
  }
  ngAfterContentInit() {

  }
  invoiceRoute(docviewrId){
    window.open(docviewrId, "_blank");
  }
  @HostListener('window:beforeunload')
  ngOnDestroy(){
  this.getInvoicesSubs.unsubscribe()
  }
}
