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
   * Get the main account ID, skipping creation if it doesn't exist
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
          // Skip creation if account doesn't exist - just log and return null
          console.warn('No main account exists - customer addition will be skipped');
          return of(null);
        }
      }),
      catchError(error => {
        console.error('Error getting main account:', error);
        console.warn('No main account exists - customer addition will be skipped');
        return of(null);
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
    if (!mainAccountId) {
      return of(false);
    }
    return this.db.doc(`users/${mainAccountId}`).valueChanges().pipe(
      map(data => !!data),
      catchError((error) => {
        console.warn('Error checking main account existence:', error);
        return of(false);
      })
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
      ],
      // Add pipeline configuration at root level for easier access
      pipelines: {
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
      }
    };

    return from(this.db.doc(`users/${mainAccountId}`).set(mainAccountData)).pipe(
      map(() => {
        this.mainAccountId = mainAccountId;
        console.log('Main account created successfully:', mainAccountId);
        return mainAccountId;
      }),
      catchError(error => {
        console.error('Error creating main account:', error);
        return of(null);
      })
    );
  }


  /**
   * Initialize the main account and return both ID and name
   */
  initializeMainAccount(): Observable<{accountId: string | null, assignedToName: string}> {
    return this.getMainAccountId().pipe(
      map(accountId => ({
        accountId,
        assignedToName: this.assignedToName
      }))
    );
  }
}
