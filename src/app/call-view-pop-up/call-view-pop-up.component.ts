import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FollowUps } from '../data-models';

@Component({
  selector: 'app-call-view-pop-up',
  templateUrl: './call-view-pop-up.component.html',
  styleUrls: ['./call-view-pop-up.component.scss']
})
export class CallViewPopUpComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CallViewPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FollowUps[],private router:Router
  ) { }
  onCustomerDetails(customerId){
      let link = '/dash/contact/customerdetails/'+customerId
      this.router.navigate([]).then(result => {  window.open(link, '_blank'); });

  }
  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
