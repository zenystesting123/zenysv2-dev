/**
 * LoginPageComponent
 * 
 * This component provides a comprehensive authentication interface for users to sign in,
 * sign up, and reset their passwords. It features a modern, responsive design with
 * multiple authentication scenarios and improved user experience.
 * 
 * Key Features:
 * - Multiple authentication scenarios (landing, login, signup, password reset, Google signin)
 * - Reactive forms with comprehensive validation
 * - Google OAuth integration
 * - Password visibility toggle
 * - Responsive design for mobile and desktop
 * - Loading states and error handling
 * - Automatic navigation based on user role (admin vs regular user)
 * - Form validation with user-friendly error messages
 * 
 * Authentication Methods:
 * - Email/Password authentication
 * - Google OAuth authentication
 * - Password reset via email
 * 
 * Security Features:
 * - Form validation to prevent invalid submissions
 * - Secure password requirements
 * - Admin role detection and navigation
 * - Error handling with user-friendly messages
 * 
 * @author Zenys Development Team
 * @version 2.0
 * @since 2024
 */

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { FormValidationService, FormFieldConfig } from '../../services/form-validation.service';
import { CommonService } from '../../common.service';
import { ConfirmationpopupComponent } from '../../confirmationpopup/confirmationpopup.component';

/**
 * Enumeration of possible login scenarios/states
 * Controls which UI elements are displayed to the user
 */
export type LoginScenario = 'landing' | 'login' | 'signup' | 'resetPassword' | 'googleSignin';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  // ==================== FORM GROUPS ====================
  /** Reactive form for user login */
  loginForm: FormGroup;
  /** Reactive form for user signup */
  signupForm: FormGroup;
  /** Reactive form for password reset */
  resetPasswordForm: FormGroup;

  // ==================== COMPONENT STATE ====================
  /** Current UI scenario/state determining which form to display */
  scenario: LoginScenario = 'landing';
  /** General loading state for any async operation */
  isLoading = false;
  /** Controls password visibility toggle in forms */
  showPassword = false;
  /** Indicates if the current user is an admin */
  isAdmin = false;

  // ==================== BUTTON STATES ====================
  /** Disables login button during processing */
  disableLoginBtn = false;
  /** Disables signup button during processing */
  disableSignupBtn = false;
  /** Disables reset password button during processing */
  disableResetBtn = false;

  // ==================== FORM CONFIGURATIONS ====================
  /** Configuration for login form validation and error messages */
  private loginFormConfig: FormFieldConfig[];
  /** Configuration for signup form validation and error messages */
  private signupFormConfig: FormFieldConfig[];
  /** Configuration for password reset form validation and error messages */
  private resetPasswordFormConfig: FormFieldConfig[];

  /**
   * Constructor for LoginPageComponent
   * 
   * @param router Router service for navigation
   * @param dialog MatDialog service for displaying confirmation popups
   * @param authService AuthService for authentication operations
   * @param formValidationService FormValidationService for form configuration
   * @param commonService CommonService for shared functionality
   */
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private formValidationService: FormValidationService,
    private commonService: CommonService
  ) {
    // Initialize form configurations
    this.loginFormConfig = this.formValidationService.getLoginFormConfig();
    this.signupFormConfig = this.formValidationService.getSignupFormConfig();
    this.resetPasswordFormConfig = this.formValidationService.getPasswordResetFormConfig();

    // Initialize forms
    this.loginForm = this.formValidationService.createFormGroup(this.loginFormConfig);
    this.signupForm = this.formValidationService.createFormGroup(this.signupFormConfig);
    this.resetPasswordForm = this.formValidationService.createFormGroup(this.resetPasswordFormConfig);
  }

  /**
   * Angular lifecycle hook - Component initialization
   * Sets up subscriptions for user data and admin status changes
   */
  ngOnInit(): void {
    // Subscribe to user data changes
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        if (data) {
          // Handle authenticated users
          if (data.authDetails && data.userDetails) {
            if (data.userDetails.accessLockAutologout === true) {
                this.router.navigate(['/user-login-locked']);
              } else {
                    this.router.navigate(['/dash/home']);
                  }
          } else if (data.authDetails && !data.userDetails && !this.isAdmin) {
            // User authenticated but no profile - show error (skip for admin users)
                this.dialog.open(ConfirmationpopupComponent, {
                  width: '400px',
                  data: {
                    smode: 'NotAUser',
                message: 'There is no user corresponding to this identifier',
                    head: 'User not found',
                  },
                });
              }
            }
      });

    // Subscribe to auth service admin status changes
    this.authService.isAdmin$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((isAdmin) => {
        if (isAdmin !== null) {
          this.isAdmin = isAdmin;
          this.navigateAfterLogin(isAdmin);
        }
      });
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // ==================== SCENARIO NAVIGATION METHODS ====================
  
  /**
   * Switches to login form scenario
   * Resets all forms to clear any previous data
   */
  showLoginForm(): void {
    this.scenario = 'login';
    this.resetAllForms();
  }

  /**
   * Switches to signup form scenario
   * Resets all forms to clear any previous data
   */
  showSignupForm(): void {
    this.scenario = 'signup';
    this.resetAllForms();
  }

  /**
   * Switches to password reset form scenario
   * Pre-fills email from login form if available
   * Resets all forms to clear any previous data
   */
  showResetPasswordForm(): void {
    // Pre-fill email if available from login form
    const email = this.loginForm.get('email')?.value;
    if (email) {
      this.resetPasswordForm.get('email')?.setValue(email);
    }
    this.scenario = 'resetPassword';
  }

  /**
   * Switches to landing page scenario
   * Resets all forms to clear any previous data
   */
  showLandingPage(): void {
    this.scenario = 'landing';
    this.resetAllForms();
  }

  // Form submission methods
  async onSubmitLogin(): Promise<void> {
    if (!this.formValidationService.validateForm(this.loginForm)) {
      return;
    }

    this.setLoadingState(true, 'login');
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.signInWithEmailAndPassword(email, password);
    } catch (error) {
      // Error handling is done in AuthService
      this.setLoadingState(false, 'login');
    }
  }

  async onSubmitSignup(): Promise<void> {
    if (!this.formValidationService.validateForm(this.signupForm)) {
      return;
    }

    this.setLoadingState(true, 'signup');
    const { email, password } = this.signupForm.value;

    try {
      await this.authService.signUpWithEmailAndPassword(email, password);
    } catch (error) {
      // Error handling is done in AuthService
      this.setLoadingState(false, 'signup');
    }
  }

  async onSubmitResetPassword(): Promise<void> {
    if (!this.formValidationService.validateForm(this.resetPasswordForm)) {
      return;
    }

    this.setLoadingState(true, 'reset');
    const { email } = this.resetPasswordForm.value;

    try {
      await this.authService.sendPasswordResetEmail(email);
      this.showSuccessDialog('Password Reset', 'Password reset email sent successfully. Please check your inbox.');
      this.showLandingPage();
    } catch (error) {
      // Error handling is done in AuthService
    } finally {
      this.setLoadingState(false, 'reset');
    }
  }

  async onGoogleSignIn(): Promise<void> {
    this.setLoadingState(true, 'login');

    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      // Error handling is done in AuthService
      this.setLoadingState(false, 'login');
    }
  }

  // Helper methods
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private resetAllForms(): void {
    this.formValidationService.resetForm(this.loginForm);
    this.formValidationService.resetForm(this.signupForm);
    this.formValidationService.resetForm(this.resetPasswordForm);
    this.setLoadingState(false, 'all');
  }

  private setLoadingState(loading: boolean, type: 'login' | 'signup' | 'reset' | 'all'): void {
    this.isLoading = loading;

    switch (type) {
      case 'login':
        this.disableLoginBtn = loading;
        break;
      case 'signup':
        this.disableSignupBtn = loading;
        break;
      case 'reset':
        this.disableResetBtn = loading;
        break;
      case 'all':
        this.disableLoginBtn = loading;
        this.disableSignupBtn = loading;
        this.disableResetBtn = loading;
        break;
    }
  }

  private navigateAfterLogin(isAdmin: boolean): void {
    if (isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dash/home']);
    }
  }

  private showSuccessDialog(title: string, message: string): void {
    this.dialog.open(ConfirmationpopupComponent, {
      width: '400px',
      data: {
        smode: 'success',
        message: message,
        head: title,
      },
    });
  }

  // Form getters for template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get signupEmail() { return this.signupForm.get('email'); }
  get signupPassword() { return this.signupForm.get('password'); }
  get resetEmail() { return this.resetPasswordForm.get('email'); }

  // Error message getters
  getEmailErrorMessage(): string {
    return this.formValidationService.getErrorMessage(this.email!, this.loginFormConfig[0]);
  }

  getPasswordErrorMessage(): string {
    return this.formValidationService.getErrorMessage(this.password!, this.loginFormConfig[1]);
  }

  getSignupEmailErrorMessage(): string {
    return this.formValidationService.getErrorMessage(this.signupEmail!, this.signupFormConfig[0]);
  }

  getSignupPasswordErrorMessage(): string {
    return this.formValidationService.getErrorMessage(this.signupPassword!, this.signupFormConfig[1]);
  }

  getResetEmailErrorMessage(): string {
    return this.formValidationService.getErrorMessage(this.resetEmail!, this.resetPasswordFormConfig[0]);
  }

  // Loading state getters
  get isLoginLoading(): boolean {
    return this.isLoading && this.disableLoginBtn;
  }

  get isSignupLoading(): boolean {
    return this.isLoading && this.disableSignupBtn;
  }

  get isResetLoading(): boolean {
    return this.isLoading && this.disableResetBtn;
  }

  @HostListener('window:beforeunload')
  onBeforeUnload(): void {
    this.ngOnDestroy();
  }
}
