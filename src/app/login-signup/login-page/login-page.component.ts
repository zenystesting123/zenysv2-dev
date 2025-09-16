/*------------------------------------------------------
Description : Login/Signup page
--------------------------------------------------------- */
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  // login form
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  // signup form
  signupForm = new FormGroup({
    mail: new FormControl('', [Validators.required, Validators.email]),
    pwd: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  // forgot password form
  resetPwdForm = new FormGroup({
    resetMail: new FormControl('', [Validators.required, Validators.email]),
  });
  scenario = 'landingLogin'; //on loading to dispaly login and signup options
  disableLoginBtn = false; //disable login button of login form
  disableSignUpBtn = false; //disable cancel and save button of signup form
  disableResetBtn = false; //disable cancel and send button of reset form
  show: boolean = false; //to show/hide password
  loginMail = ''; //logged in users mail
  googleMail = ''; //signed in with oogle case

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    // subscribe user details from common service
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((datas) => {
        if (datas) {
          if (datas.authDetails) {
            //get auth datas and if user signed in navigate to home page
            if (datas.userDetails) {
              if (datas.userDetails.accessLockAutologout === true) {
                this.router.navigate(['/user-login-locked']);
              } else {
                if (this.disableLoginBtn === false) {
                  this.router.navigate(['/dash/home']);
                } else {
                  if (this.loginMail === datas.userDetails.email) {
                    this.router.navigate(['/dash/home']);
                  }
                }
              }
            } else {
              if (datas.authDetails.email === this.loginMail) {
                // trying to sign in without signup case
                this.dialog.open(ConfirmationpopupComponent, {
                  width: '400px',
                  data: {
                    smode: 'NotAUser',
                    message:
                      'There is no user corresponding to this identifier',
                    head: 'User not found',
                  },
                });
              }
            }
          }
        }
      });
  }
  // click event function toggle password
  passwordToggle() {
    this.show = !this.show;
  }
  // get methods for handling validation errors in reactive forms
  get resetMail() {
    return this.loginForm.get('resetMail');
  }
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get mail() {
    return this.signupForm.get('mail');
  }
  get pwd() {
    return this.signupForm.get('pwd');
  }

  // back to login page
  selectedLandingLogin() {
    this.scenario = 'landingLogin';
  }
  // to display login form
  selectedLogin() {
    this.scenario = 'login';
  }
  // to display signupoptions
  selectedSignUpLanding() {
    this.scenario = 'landingSignUp';
  }

  // methos to handle when Troble for signing in is clicked
  resetPassword() {
    if (!!this.loginForm.get('email').value) {
      const email = this.loginForm.get('email').value;
      this.resetPwdForm.get('resetMail').setValue(email);
    }
    this.scenario = 'resetPassword';
  }
  // after entering recovery mail call this method to handle password reset
  onSUbmitResetForm() {
    this.disableResetBtn = true;
    const { resetMail } = this.resetPwdForm.value;
    firebase.default
      .auth()
      .sendPasswordResetEmail(resetMail)
      .then(() => {
        this.scenario = 'landingLogin';
      })
      .catch((err) => {
        this.dialog.open(ConfirmationpopupComponent, {
          width: '400px',
          data: {
            smode: 'errorMsg',
            message: err.message,
            head: err.code,
          },
        });
      });
  }
  // sign in with google
  signInWithGoogle() {
    this.disableLoginBtn = true;
    var provider = new firebase.default.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    return this.afAuth
      .signInWithPopup(provider)
      .then((resp) => {
        this.loginMail = resp.user.email;
        // this.router.navigate(['/dash/home']);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }
  // signup method
  onSUbmitSignUpForm() {
    this.disableSignUpBtn = true;
    if (!this.signupForm.valid) {
      return;
    }
    const { mail, pwd } = this.signupForm.value;
    firebase.default
      .auth()
      .createUserWithEmailAndPassword(mail, pwd)
      .then((resp) => {
        this.router.navigate(['/create-profile']);
      })
      .catch((err) => {
        this.dialog.open(ConfirmationpopupComponent, {
          width: '400px',
          data: {
            smode: 'errorMsg',
            message: err.message,
            head: 'Email is already in use',
          },
        });
        this.signupForm.reset();
        this.disableSignUpBtn = false;
      });
  }
  // login method
  onSUbmitLoginForm() {
    this.disableLoginBtn = true;
    if (!this.loginForm.valid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    firebase.default
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((resp) => {
        this.loginMail = email;
      })
      .catch(async (err) => {
        if (err.code === 'auth/wrong-password') {
          this.googleMail = email;
          // Check if User has signed up with a OAuthProvider
          const result = firebase.default
            .auth()
            .fetchSignInMethodsForEmail(email)
            .then(function (res) {
              // … show OAuthProvider Login Button
              let re = res[0];
              return re;
            });
          if (result) {
            if ((await result) === 'google.com') {
              this.scenario = 'googleSignin';
              this.loginForm.reset();
              this.disableLoginBtn = false;
            } else {
              this.dialog.open(ConfirmationpopupComponent, {
                width: '400px',
                data: {
                  smode: 'errorMsg',
                  message: err.message,
                  head: 'Wrong Password',
                },
              });
              this.loginForm.reset();
              this.disableLoginBtn = false;
            }
          }
        } else {
          this.dialog.open(ConfirmationpopupComponent, {
            width: '400px',
            data: {
              smode: 'errorMsg',
              message: err.message,
              head: 'User not found',
            },
          });
          this.loginForm.reset();
          this.disableLoginBtn = false;
        }
      });
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    // on destroy
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
