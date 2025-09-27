import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationpopupComponent } from 'src/app/confirmationpopup/confirmationpopup.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  // login form
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  // forgot password form
  resetPwdForm = new FormGroup({
    resetMail: new FormControl('', [Validators.required, Validators.email]),
  });
  scenario = 'login'; //on loading to dispaly login and signup options
  disableLoginBtn = false; //disable login button of login form
  disableResetBtn = false; //disable cancel and send button of reset form
  loginMail = ''; //logged in users mail
  authDetails: any = null;
  isLoading = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private commonService: CommonService,
    private afAuth: AngularFireAuth
  ) { }
  ngOnInit(): void {
    this.commonService.userDatas
    .pipe(takeUntil(this.onDestroy$))
    .subscribe((datas) => {
      if (datas && datas.authDetails) {
        this.authDetails = datas.authDetails;
        // If user is already authenticated, navigate to appropriate page
        if (datas.userDetails) {
          if (datas.userDetails.accessLockAutologout === true) {
            this.router.navigate(['/user-login-locked']);
          } else {
            this.router.navigate(['/dash/home']);
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get resetMail() {
    return this.resetPwdForm.get('resetMail');
  }
  selectedLandingLogin() {
    this.scenario = 'landingLogin';
  }
  resetPassword() {
    this.scenario = 'resetPassword';
  }
  onSUbmitResetForm() {
    if (!this.resetPwdForm.valid) {
      return;
    }

    this.disableResetBtn = true;
    this.isLoading = true;
    const { resetMail } = this.resetPwdForm.value;

    firebase.default
      .auth()
      .sendPasswordResetEmail(resetMail)
      .then(() => {
        this.isLoading = false;
        this.disableResetBtn = false;
        this.scenario = 'landingLogin';
        this.dialog.open(ConfirmationpopupComponent, {
          width: '400px',
          data: {
            smode: 'success',
            message: 'Password reset email sent successfully. Please check your inbox.',
            head: 'Email Sent',
          },
        });
      })
      .catch((err) => {
        this.isLoading = false;
        this.disableResetBtn = false;
        this.showErrorDialog('Reset Failed', err.message);
      });
  }
  onSUbmitLoginForm() {
    if (!this.loginForm.valid) {
      return;
    }

    this.disableLoginBtn = true;
    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    // Check for admin access first
    if (email === environment.adminEmail) {
      // For admin, we still need to authenticate with Firebase
      this.authenticateUser(email, password, true);
    } else {
      this.authenticateUser(email, password, false);
    }
  }

  private authenticateUser(email: string, password: string, isAdmin: boolean = false) {
    firebase.default
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((resp) => {
        this.loginMail = email;
        this.isLoading = false;

        if (isAdmin) {
          this.router.navigate(['/admin']);
        } else {
          // Navigate directly to dashboard - the CommonService will handle user details loading
          this.router.navigate(['/dash/home']);
        }
      })
      .catch(async (err) => {
        this.isLoading = false;
        this.disableLoginBtn = false;

        if (err.code === 'auth/wrong-password') {
          // Check if user signed up with OAuth provider
          try {
            const signInMethods = await firebase.default
              .auth()
              .fetchSignInMethodsForEmail(email);

            if (signInMethods.length > 0 && signInMethods[0] === 'google.com') {
              this.dialog.open(ConfirmationpopupComponent, {
                width: '400px',
                data: {
                  smode: 'errorMsg',
                  message: 'This email was registered with Google. Please use Google Sign-In.',
                  head: 'Use Google Sign-In',
                },
              });
            } else {
              this.showErrorDialog('Wrong Password', err.message);
            }
          } catch (fetchError) {
            this.showErrorDialog('Wrong Password', err.message);
          }
        } else if (err.code === 'auth/user-not-found') {
          this.showErrorDialog('User not found', 'There is no user corresponding to this identifier');
        } else if (err.code === 'auth/invalid-email') {
          this.showErrorDialog('Invalid Email', 'Please provide a valid email address');
        } else if (err.code === 'auth/too-many-requests') {
          this.showErrorDialog('Too Many Attempts', 'Please try again later');
        } else {
          this.showErrorDialog('Login Failed', err.message);
        }
      });
  }

  private showErrorDialog(head: string, message: string) {
    this.dialog.open(ConfirmationpopupComponent, {
      width: '400px',
      data: {
        smode: 'errorMsg',
        message: message,
        head: head,
      },
    });
  }
}
