/*--------------------------------
Description :Side bar for showing customer/org details, sale title, doc details and payment details
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { PreviewService } from '../preview.service';
import { salesDocsFieldNames } from 'src/app/data-models';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
//custom pipe to implement sorting of data wrt
  // date modified in changeLog/created date in salestable
  propName = 'dateModified'; //property for sorting
  customsort = (a, b) => {
    //returns the greater date first
    return Number(b.value[this.propName]) - Number(a.value[this.propName]);
  };
  changeLogLength: number; //no of records in changelog
  docFieldNames = salesDocsFieldNames.CONST_VALUE; //default field names to use in changelog
  
  constructor(public previewService: PreviewService, private router: Router, public commonService: CommonService) { 
    this.changeLogLength = Object.keys(this.previewService.changeLog).length;
  }

  ngOnInit(): void {
  }
  contactView() {
    // on click conact and route to detail page
    this.router.navigate([
      '/dash/contact/customerdetails/',
      this.previewService.customerData.custID,
    ]);
  }
  orgView(){
     // on click conact and route to detail page
     this.router.navigate([
      '/dash/organisation/orgdetails/',
      this.previewService.customerData.orgID,
    ]);
  }
  
}
