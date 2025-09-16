import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, tap, map, takeUntil, delay, take } from 'rxjs/operators';

export interface SnackBarQueueItem {
  message: string;
  beingDispatched: boolean;
  configParams?: MatSnackBarConfig;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService implements OnDestroy {

  private readonly snackBarQueue = new BehaviorSubject<SnackBarQueueItem[]>([]);
  private readonly snackBarQueue$ = this.snackBarQueue.asObservable();
  private readonly ngDestroy = new Subject();


  constructor(
    private matSnackBar: MatSnackBar,
    private zone: NgZone
    // private store: Store<AppState>,
  ) {
    /* Dispatches all queued snack bars one by one */
    this.snackBarQueue$
     .pipe(
       filter(queue => queue.length > 0 && !queue[0].beingDispatched),
       tap(() => {
         const updatedQueue = this.snackBarQueue.value;
         updatedQueue[0].beingDispatched = true;
         this.snackBarQueue.next(updatedQueue);
       }),
       map(queue => queue[0]),
       takeUntil(this.ngDestroy))
     .subscribe(snackBarItem => this.showSnackbar(snackBarItem.message, snackBarItem.configParams));
  }

  public ngOnDestroy() {
    this.snackBarQueue.next([]);
    this.snackBarQueue.complete();
    this.ngDestroy.next();
    this.ngDestroy.complete();
  }

  public queueSnackBar(message: string, configParams?: MatSnackBarConfig) {
    this.snackBarQueue.next(
      this.snackBarQueue.value.concat([{ message, configParams, beingDispatched: false }]),
    );
  }

  private showSnackbar(message: string, configParams?: MatSnackBarConfig) {
    const duration = this.getDuration(configParams);
    this.removeDismissedSnackBar(
      this.matSnackBar.open(message, 'OK', { duration }).afterDismissed(),
    );
    // this.triggerAction(configParams);
  }

  /* Remove dismissed snack bar from queue and triggers another one to appear */
  private removeDismissedSnackBar(dismissed: Observable<MatSnackBarDismiss>) {
    dismissed
      .pipe(
        delay(1000),
        take(1))
      .subscribe(() => {
        const updatedQueue = this.snackBarQueue.value;
        if (updatedQueue[0].beingDispatched) updatedQueue.shift();
        this.snackBarQueue.next(updatedQueue);
      });
  }

  private getDuration(configParams?: MatSnackBarConfig): number {
    if (configParams && configParams.duration) return configParams.duration;
    else return 10000;
  }

  /* In case you would like to dispatch actions in nxrx when snack bar is shown, etc */
  // private triggerAction(configParams?: MatSnackBarConfig) {
  //   if (configParams && configParams.triggerAction) {
  //     if (configParams.triggerAction === 'FREE_LIMIT_WARNING_SHOWN') {
  //       this.store.dispatch(new FreeLimitWarningShown());
  //     }
  //   }
  // }


 public showSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['background-red'];
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'center';
    config.duration = 2000;
    this.zone.run(() => {
      this.matSnackBar.open(message, '', config);
    });
  }
  
}