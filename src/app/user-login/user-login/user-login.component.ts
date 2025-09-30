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
import { AuthService } from 'src/app/services/auth.service';
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
    private afAuth: AngularFireAuth,
    private authService: AuthService
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
  async onSUbmitResetForm() {
    if (!this.resetPwdForm.valid) {
      return;
    }

    this.disableResetBtn = true;
    this.isLoading = true;
    const { resetMail } = this.resetPwdForm.value;

    try {
      await this.authService.sendPasswordResetEmail(resetMail);
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
    } catch (err) {
      this.isLoading = false;
      this.disableResetBtn = false;
      this.showErrorDialog('Reset Failed', err.message);
    }
  }
  async onSUbmitLoginForm() {
    if (!this.loginForm.valid) {
      return;
    }

    this.disableLoginBtn = true;
    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.signInWithEmailAndPassword(email, password);
      // Navigation is handled by AuthService
    } catch (err) {
      this.isLoading = false;
      this.disableLoginBtn = false;
      // Error handling is done in AuthService
    }
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
