import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { CalendarEventDetails } from '../data-models';
import { environment } from 'src/environments/environment';
import { ComposemobileComponent } from '../gmail/composemobile/composemobile.component';
import { Router } from '@angular/router';
declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendarEventService {
  gapi: any;
  googleuser: any; //check the user is loged in
  calendarList: CalendarEventDetails[]; // listing day wise event
  weekList: CalendarEventDetails[]; // listing week wise event
  weekVisible: boolean = false; // for enable week view
  monthVisible: boolean = false; // for enable month view
  dayVisible: boolean = false; // for enable day view
  selectedMonthfirstDate: Date; // first day of month
  selectedMonthLastDate: Date; //last day of month
  selectedWeekfirstDate: Date; // first day of week
  selectedWeekLastDate: Date; // last day of week
  selectedDay: Date; // selected day
  nextDay: Date; // next day for limiting day view
  selectedMonthCalendarList: CalendarEventDetails[]; // listing month wise event
  calendarView: string; // for storing view of calendar(day/week/month)
  calendarListToday: CalendarEventDetails[]; // listing todays event for dashhome
  dayEventLength: number = 0; // calculating number of events for dash home
  currentDay: Date;
  nextDays: Date;
  todayMeetingVisible: boolean = false; // for displaying event length card in home page
  constructor(
    public db: AngularFirestore,
    private router: Router,
    private zone: NgZone
    ) {}
  // once the gapi is loaded initclient returns true. all other functionalities of gapi can be used only after this.
  initClient = new Observable<any>((observer) => {
    //client init , loading calendar / gmail
    gapi.load('client', () => {
      gapi.client
        .init({
          // apiKey: 'AIzaSyDkHIhzGjy358lVXGMUo12yRRGtO6OdfMI',
          apiKey: environment.firebaseConfig.apiKey,
          //  apiKey:"AIzaSyDKxquNFwgTGp4FQxstKtFVqQIfp4ktc0I",
          // clientId:
          // '926474914640-piu0vi3s1ger30cdp66b2i8h5d234hjh.apps.googleusercontent.com',
          clientId: environment.clientId,
          discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
            'https://gmail.googleapis.com/$discovery/rest?version=v1',
            'https://people.googleapis.com/$discovery/rest?version=v1',
          ],
          scope:
            'https://www.googleapis.com/auth/calendar https://mail.google.com/',
        })
        .then(() => {
          if (this.checkloginStatus()) observer.next(true);
          else observer.next(false);
        });
      gapi.client.load('calendar', 'v3', () => {}); // loads calendar
      gapi.client.load('gmail', 'v1', () => {}); // loads gmail
    });
    this.gapi = gapi;
    return gapi;
  });

  async login() {
    // login
    if (!this.googleuser) {
      const googleauth = gapi.auth2.getAuthInstance();// initialise the google auth object 
      const googleUser = await googleauth.signIn();// open google authentication window and wait for sign in
      const token = googleUser.getAuthResponse().id_token;
      this.googleuser = googleUser;
      googleauth.isSignedIn.listen((val) => { });
    }
  }
  checkloginStatus() {
    // checks login status
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
      return true;
    } else return false;
  }
  logoutFromGoogleMail() {
    // log out gapi
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      this.googleuser = null;
    });
    this.dayEventLength = 0;
  }

  logout() {
    // log out gapi
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      this.googleuser = null;
      this.zone.run(() =>
        this.router.navigate(['/dash/events'])
      )
    });
    this.dayEventLength = 0;
  }

  async getDayCalendar() {
    // get day wise eveny
    const events = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: this.selectedDay?.toISOString(), // start time
      timeMax: this.nextDay?.toISOString(), // end time
      showDeleted: false,
      singleEvents: true,
      maxResults: 100,
      orderBy: 'startTime',
    });

    this.calendarList = events.result['items'];
    this.dayVisible = true;

    return events;
  }
  async getDayCalendarToday() {
    // get current day event
    const events = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: this.currentDay?.toISOString(), // start time
      timeMax: this.nextDays?.toISOString(), // end time
      showDeleted: false,
      singleEvents: true,
      maxResults: 100,
      orderBy: 'startTime',
    });
    this.calendarListToday = events.result['items'];
    this.dayEventLength = this.calendarListToday.length;
    this.todayMeetingVisible = true;
    return events;
  }

  async getWeek() {
    // get week events
    const events = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: this.selectedWeekfirstDate?.toISOString(), // start time
      timeMax: this.selectedWeekLastDate?.toISOString(), // end time
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
    });
    this.weekList = events.result['items'];
    this.weekVisible = true;
  }
  async getMonth() {
    // get month events
    const events = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: this.selectedMonthfirstDate?.toISOString(), // start time
      timeMax: this.selectedMonthLastDate?.toISOString(), // end time
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
    });
    this.selectedMonthCalendarList = events.result['items'];
    this.monthVisible = true;
  }

  insertMeet(event: CalendarEventDetails): Observable<Boolean> {
    // for adding event
    return new Observable<Boolean>((observer) => {
      return gapi.client.calendar.events
        .insert({
          calendarId: 'primary',
          resource: event,
        })
        .then(
          (resolve) => {
            observer.next(true);
          },
          (reject) => {
            observer.next(false);
          }
        )
        .catch((reject) => {
          observer.next(false);
        });
    });
  }

  updateEvent(event): Observable<Boolean> {
    // for updating event
    return new Observable<Boolean>((observer) => {
      return gapi.client.calendar.events
        .update({
          calendarId: 'primary',
          eventId: event['id'],
          resource: event,
        })
        .then(
          (resolve) => {
            observer.next(true);
          },
          (reject) => {
            observer.next(false);
          }
        )
        .catch((reject) => {
          observer.next(false);
        });
    });
  }

  deleteEvent(event): Observable<Boolean> {
    // for deleting event
    return new Observable<Boolean>((observer) => {
      return gapi.client.calendar.events
        .delete({
          calendarId: 'primary',
          eventId: event['id'],
        })
        .then(
          (resolve) => {
            observer.next(true);
          },
          (reject) => {
            observer.next(false);
          }
        )
        .catch((err) => {
          observer.next(false);
        });
    });
  }

  getCustomerWithEmail(superUserId) {
    // get customers with email
    return this.db
      .collection('users/' + superUserId + '/customers', (ref) =>
        ref.where('email', '!=', null)
      )
      .snapshotChanges();
  }

  getCustomerWithEmailSubUser(superUserId, userId) {
    // get customers with email for sub user
    return this.db
      .collection('users/' + superUserId + '/customers', (ref) =>
        ref.where('assignedTo', '==', userId).where('email', '!=', null)
      )
      .snapshotChanges();
  }

}
