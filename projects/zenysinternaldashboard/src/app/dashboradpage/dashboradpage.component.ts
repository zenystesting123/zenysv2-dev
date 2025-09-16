import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboradpage',
  templateUrl: './dashboradpage.component.html',
  styleUrls: ['./dashboradpage.component.scss']
})
export class DashboradpageComponent implements OnInit {
  user:Observable<any>;
  userId?:string;
  constructor(
    private afAuth:AngularFireAuth,
    private router:Router
  ) {
    this.user = this.afAuth.authState;
    this.user.subscribe(user=>{
      this.userId = user.uid;
      console.log(this.userId);
    })
   }

  ngOnInit(): void {
  }
  gotoCustomerReport(){
    console.log("called")
    this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
      this.router.navigate(['zenysinternaldashboard/myDashboard/contacts-report', this.userId])
    })
  }
  callContactreport(id:string){
    this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
      this.router.navigate(['zenysinternaldashboard/myDashboard/contacts-report', id])
    })
  }
}
