import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { ConfirmationpopupComponent } from '../confirmationpopup/confirmationpopup.component';
import { environment } from '../../environments/environment';

export interface AuthError {
  code: string;
  message: string;
  userFriendlyMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdminSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private dialog: MatDialog
  ) {
    // Listen to auth state changes
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAdminSubject.next(user.email === environment.adminEmail);
      } else {
        this.isAdminSubject.next(false);
      }
    });
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmailAndPassword(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const isAdmin = userCredential.user.email === environment.adminEmail;
      this.isAdminSubject.next(isAdmin);
      
      // Navigate based on admin status
      this.navigateAfterLogin(isAdmin);
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<void> {
    try {
      const provider = new firebase.default.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const userCredential = await this.afAuth.signInWithPopup(provider);
      const isAdmin = userCredential.user.email === environment.adminEmail;
      this.isAdminSubject.next(isAdmin);
      
      // Navigate based on admin status
      this.navigateAfterLogin(isAdmin);
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmailAndPassword(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const isAdmin = userCredential.user.email === environment.adminEmail;
      this.isAdminSubject.next(isAdmin);
      
      // Navigate to profile creation for new users
      this.router.navigate(['/create-profile']);
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.isAdminSubject.next(false);
      this.router.navigate(['/login']);
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    return this.isAdminSubject.value;
  }

  /**
   * Navigate user after successful login based on admin status
   */
  private navigateAfterLogin(isAdmin: boolean): void {
    if (isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dash/home']);
    }
  }

  /**
   * Handle authentication errors with user-friendly messages
   */
  private handleAuthError(error: any): void {
    const authError = this.mapToAuthError(error);

    this.dialog.open(ConfirmationpopupComponent, {
      width: '400px',
      data: {
        smode: 'errorMsg',
        message: authError.userFriendlyMessage,
        head: authError.message,
      },
    });
  }

  /**
   * Map Firebase auth errors to user-friendly messages
   */
  private mapToAuthError(error: any): AuthError {
    const errorMap: { [key: string]: AuthError } = {
      'auth/wrong-password': {
        code: error.code,
        message: 'Wrong Password',
        userFriendlyMessage: 'The password you entered is incorrect. Please try again.'
      },
      'auth/user-not-found': {
        code: error.code,
        message: 'User Not Found',
        userFriendlyMessage: 'No account found with this email address.'
      },
      'auth/invalid-email': {
        code: error.code,
        message: 'Invalid Email',
        userFriendlyMessage: 'Please provide a valid email address.'
      },
      'auth/too-many-requests': {
        code: error.code,
        message: 'Too Many Attempts',
        userFriendlyMessage: 'Too many failed login attempts. Please try again later.'
      },
      'auth/email-already-in-use': {
        code: error.code,
        message: 'Email Already in Use',
        userFriendlyMessage: 'An account with this email already exists.'
      },
      'auth/weak-password': {
        code: error.code,
        message: 'Weak Password',
        userFriendlyMessage: 'Password should be at least 6 characters long.'
      },
      'auth/network-request-failed': {
        code: error.code,
        message: 'Network Error',
        userFriendlyMessage: 'Please check your internet connection and try again.'
      }
    };

    return errorMap[error.code] || {
      code: error.code || 'unknown',
      message: 'Authentication Error',
      userFriendlyMessage: error.message || 'An unexpected error occurred. Please try again.'
    };
  }

  /**
   * Check if user signed up with OAuth provider
   */
  async checkSignInMethods(email: string): Promise<string[]> {
    try {
      return await firebase.default.auth().fetchSignInMethodsForEmail(email);
    } catch (error) {
      console.error('Error checking sign-in methods:', error);
      return [];
    }
  }
}
