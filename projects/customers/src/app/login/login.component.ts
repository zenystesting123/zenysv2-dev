import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {
  FirebaseUISignInFailure,
  FirebaseUISignInSuccessWithAuthResult,
} from 'firebaseui-angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: Observable<any>; //
  userDetailsAuth: any = null; //user details from auth module
  isMobilesize:boolean=false;
  isTabletsize:boolean=false;

  constructor(private afAuth: AngularFireAuth, private router: Router,private breakpointObserver:BreakpointObserver) {
    breakpointObserver
    .observe([Breakpoints.TabletLandscape, Breakpoints.TabletPortrait])
    .subscribe((result) => {
      if (result.matches) {
        this.isTabletsize = true;
      } else {
        this.isTabletsize = false;
      }
    });
  breakpointObserver
    .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
    .subscribe((result) => {
      if (result.matches) {
        this.isMobilesize = true;
      } else {
        this.isMobilesize = false;
      }
    });
  }
 

  ngOnInit(): void {
    this.user = this.afAuth.authState;
    this.user.subscribe((user) => {
      if (user) {
        console.log("hello")
        console.log(user)
        this.userDetailsAuth = user;
        this.router.navigate(['/createCustomer']);
      } else {

      }
    });
  }

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    console.log("signInSuccessData")
    // this.router.navigate(['/loading']);
  }

  errorCallback(errorData: FirebaseUISignInFailure) {}

  uiShownCallback() {
    //console.log("UI shown")
  }
  logout() {
    this.afAuth.signOut();
  }
  onSuccess(event) {
    console.log("event"+event)
    // this.router.navigate(['/loading']);
  }

  onError(event) {}

}
