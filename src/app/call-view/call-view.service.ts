import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { endOfWeek, startOfWeek } from 'date-fns';
import { FollowUps } from '../data-models';
@Injectable({
  providedIn: 'root',
})
export class CallViewService {
  constructor(private db: AngularFirestore) {}
  getFollowUps(id: string) {
    // Get this todays follow ups for all users (super user scenario)
    let date = new Date();
    let firstDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0
    ); //set the time to zero (12 AM) to include all records from that day
    let lastDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    ); //set the time to zero (12 AM) to include all records from that day

    return this.db
      .collection('users/' + id + '/Follow Ups', (ref) =>
        ref
          .where('callStartDate', '>=', firstDay)
          .where('callStartDate', '<=', lastDay)
      )
      .snapshotChanges();
  }

  getFollowUpssubuser(mid, uid) {
    // Get this week  follow ups for sub users
    let date = new Date();
    let firstDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0
    ); //set the time to zero (12 AM) to include all records from that day
    let lastDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    ); //set the time to zero (12 AM) to include all records from that day
    return this.db
      .collection('users/' + mid + '/Follow Ups', (ref) =>
        ref
          .where('assignedTo', '==', uid)
          .where('callStartDate', '>=', firstDay)
          .where('callStartDate', '<=', lastDay)
      )
      .snapshotChanges();
  }

  // on date wise filter all followups
  getFollowUpsSuperUserFilter(id: string, first, last) {
    return this.db
      .collection('users/' + id + '/Follow Ups', (ref) =>
        ref
          .orderBy('callStartDate', 'asc')
          .where('callStartDate', '>=', first)
          .where('callStartDate', '<=', last)
      )
      .snapshotChanges();
  }
  // on date wise  assigned to user filter
  getFollowUpssubuserFilter(mid, uid, first, last) {
    return this.db
      .collection('users/' + mid + '/Follow Ups', (ref) =>
        ref
          .where('assignedTo', '==', uid)
          .where('callStartDate', '>=', first)
          .where('callStartDate', '<=', last)
      )
      .snapshotChanges();
  }
  // on date wise  assigned to user filter
  async getFollowUpsTeamFilter(mid, uid, first, last): Promise<FollowUps[]> {
    return await this.db
      .collection('users/' + mid + '/Follow Ups', (ref) =>
        ref
          .where('assignedTo', '==', uid)
          .where('callStartDate', '>=', first)
          .where('callStartDate', '<=', last)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as FollowUps)
          )
        )
      )
      .toPromise();
  }
  async getFollowUpsTeam(mid, uid): Promise<FollowUps[]> {
    // Get todays follow ups for sub users
    let date = new Date();
    let firstDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0
    ); //set the time to zero (12 AM) to include all records from that day
    let lastDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    ); //set the time to zero (12 AM) to include all records from that day

    return this.db
      .collection('users/' + mid + '/Follow Ups', (ref) =>
        ref
          .where('assignedTo', '==', uid)
          .where('callStartDate', '>=', firstDay)
          .where('callStartDate', '<=', lastDay)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as FollowUps)
          )
        )
      )
      .toPromise();
  }
 
}
