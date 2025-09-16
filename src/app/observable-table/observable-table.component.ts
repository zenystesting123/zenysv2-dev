import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FollowUps, Profile } from '../data-models';
import {DataSource} from '@angular/cdk/collections';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-observable-table',
  templateUrl: './observable-table.component.html',
  styleUrls: ['./observable-table.component.scss'],
  changeDetection:ChangeDetectionStrategy.Default
})
export class ObservableTableComponent implements OnInit {

  openFollowUps: Observable<FollowUps[]>;
  folloupAmt: number;
  completedLength: number;

  constructor(private db: AngularFirestore,
    private _snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    ) {
    this.openFollowUps = this.getOpenFollowUps('WlWjGoPwE5enWHWGDZMK6EVk5CA2').pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as FollowUps;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  trackByFn(index,item) {
    console.log(index,item)
    return index;
  }

  //get all the open follow ups using the following sort order -> Date, Customer id
  getOpenFollowUps( userId: string, ) {

      return this.db.collection<FollowUps>('users/' + userId + '/Follow Ups', ref => ref.where('completedStatus', '==', false).orderBy('callStartDate','desc').orderBy('customerId','asc').limit(10)).snapshotChanges();
  }

  updateCustomer(id, uid, amt) {
    return this.db.doc('users/' + uid + '/customers/' + id).update({ 'followUpFlag': amt });
 }
  UpdateTask(followUpId: string, completed, uid) {
     return this.db.doc('users/' + uid + '/Follow Ups/' + followUpId).update({ 'completedStatus': completed, lastModifiedDate: new Date().getTime() });
  }
  markasCompleted(taskId: string, customerId:string, index:number) {

    this.folloupAmt = 0;
    let completed = true;
    this.UpdateTask(taskId, completed, 'WlWjGoPwE5enWHWGDZMK6EVk5CA2')

    this.changeDetectorRef.detectChanges();
    this._snackBar.open('Follow up task closed', 'success', {
      duration: 5000,
    });
    this.updateCustomer(customerId, 'WlWjGoPwE5enWHWGDZMK6EVk5CA2', this.folloupAmt).then(res => {
      this.completedLength = 0;

    })

  }

  // display as cards with option to mark as closed
  ngOnInit(): void {
  }

}


