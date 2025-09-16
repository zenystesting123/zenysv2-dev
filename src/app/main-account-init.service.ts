import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { Observable, of, from } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MainAccountInitService {
  private mainAccountId: string | null = null;
  private assignedToName: string = 'SuperUser';

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  /**
   * Get the main account ID, creating it if it doesn't exist
   */
  getMainAccountId(): Observable<string> {
    if (this.mainAccountId) {
      return of(this.mainAccountId);
    }

    return this.checkMainAccountExists().pipe(
      switchMap(exists => {
        if (exists) {
          this.mainAccountId = environment.ZenysMainAccount;
          return of(this.mainAccountId);
        } else {
          return this.createMainAccount();
        }
      }),
      catchError(error => {
        console.error('Error getting main account:', error);
        // Fallback: use current user ID or create a temporary account
        return this.createFallbackAccount();
      })
    );
  }

  /**
   * Get the assigned to name
   */
  getAssignedToName(): string {
    return this.assignedToName;
  }

  /**
   * Check if the main account exists in the database
   */
  private checkMainAccountExists(): Observable<boolean> {
    const mainAccountId = environment.ZenysMainAccount;
    return this.db.doc(`users/${mainAccountId}`).valueChanges().pipe(
      map(data => !!data),
      catchError(() => of(false))
    );
  }

  /**
   * Create the main account if it doesn't exist
   */
  private createMainAccount(): Observable<string> {
    const mainAccountId = environment.ZenysMainAccount;
    const mainAccountData = {
      email: 'admin@zenys.com',
      firstName: 'Zenys',
      lastName: 'Admin',
      companyName: 'Zenys',
      role: 'admin',
      isMainAccount: true,
      dateCreated: Date.now(),
      createdYear: new Date().getFullYear(),
      month: new Date().getMonth(),
      contactSequentialNumber: 0,
      customerPipelines: [
        {
          pipelineId: 1,
          pipelineName: 'Default Pipeline',
          pipelineStages: [
            {
              stageId: 'lead',
              stageName: 'Lead',
              stageOrder: 1
            },
            {
              stageId: 'prospect',
              stageName: 'Prospect',
              stageOrder: 2
            },
            {
              stageId: 'opportunity',
              stageName: 'Opportunity',
              stageOrder: 3
            },
            {
              stageId: 'won',
              stageName: 'Won',
              stageOrder: 4
            },
            {
              stageId: 'lost',
              stageName: 'Lost',
              stageOrder: 5
            }
          ]
        }
      ]
    };

    return from(this.db.doc(`users/${mainAccountId}`).set(mainAccountData)).pipe(
      map(() => {
        this.mainAccountId = mainAccountId;
        console.log('Main account created successfully:', mainAccountId);
        return mainAccountId;
      }),
      catchError(error => {
        console.error('Error creating main account:', error);
        return this.createFallbackAccount();
      })
    );
  }

  /**
   * Create a fallback account using current user or generate a temporary one
   */
  private createFallbackAccount(): Observable<string> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          // Use current user as main account
          this.mainAccountId = user.uid;
          return of(user.uid);
        } else {
          // Generate a temporary account ID
          const tempAccountId = 'temp_main_' + Date.now();
          this.mainAccountId = tempAccountId;
          console.warn('Using temporary main account ID:', tempAccountId);
          return of(tempAccountId);
        }
      }),
      catchError(() => {
        // Ultimate fallback
        const fallbackId = 'fallback_main_' + Date.now();
        this.mainAccountId = fallbackId;
        console.warn('Using fallback main account ID:', fallbackId);
        return of(fallbackId);
      })
    );
  }

  /**
   * Initialize the main account and return both ID and name
   */
  initializeMainAccount(): Observable<{accountId: string, assignedToName: string}> {
    return this.getMainAccountId().pipe(
      map(accountId => ({
        accountId,
        assignedToName: this.assignedToName
      }))
    );
  }
}
