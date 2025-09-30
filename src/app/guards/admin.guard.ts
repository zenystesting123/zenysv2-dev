import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {
  
  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAdminAccess();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAdminAccess();
  }

  private checkAdminAccess(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => {
        if (!user) {
          // User not authenticated, redirect to login
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: this.router.url } 
          });
          return false;
        }

        // Check if user is admin
        const isAdmin = this.authService.isAdmin();
        
        if (!isAdmin) {
          // User is not admin, redirect to home with error message
          this.router.navigate(['/dash/home'], { 
            queryParams: { error: 'access_denied' } 
          });
          return false;
        }

        // User is admin, allow access
        return true;
      }),
      catchError(error => {
        console.error('Admin guard error:', error);
        // On error, redirect to login
        this.router.navigate(['/login'], { 
          queryParams: { returnUrl: this.router.url } 
        });
        return of(false);
      })
    );
  }
}













