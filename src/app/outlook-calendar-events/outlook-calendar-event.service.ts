import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { OutlookCalendarEventDetails } from '../data-models';
import { environment } from 'src/environments/environment';
import { MsalGuardAuthRequest, MsalGuardConfiguration, MsalModule, MsalService } from '@azure/msal-angular';
import { PopupRequest } from '@azure/msal-browser';
import { HttpClient } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { resolve } from 'dns';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})

export class OutlookCalendarEventService {
  outlookUser: any; //check the user is loged in
  calendarList: OutlookCalendarEventDetails[] = []; // listing day wise event
  weekList: OutlookCalendarEventDetails[] = []; // listing week wise event
  weekVisible: boolean = false; // for enable week view
  monthVisible: boolean = false; // for enable month view
  dayVisible: boolean = false; // for enable day view
  selectedMonthfirstDate: Date; // first day of month
  selectedMonthLastDate: Date; //last day of month
  selectedWeekfirstDate: Date; // first day of week
  selectedWeekLastDate: Date; // last day of week
  selectedDay: Date; // selected day
  nextDay: Date; // next day for limiting day view
  selectedMonthCalendarList: OutlookCalendarEventDetails[] = []; // listing month wise event
  calendarView: string; // for storing view of calendar(day/week/month)
  calendarListToday: OutlookCalendarEventDetails[] = []; // listing todays event for dashhome
  dayEventLength: number = 0; // calculating number of events for dash home
  currentDay: Date; //to store current date
  nextDays: Date; //to store next date
  todayMeetingVisible: boolean = false; // for displaying event length card in home page
  msalGuardConfig:MsalGuardAuthRequest; //masl configuration variable to connect to outlook server
  constructor(
    public db: AngularFirestore,
    public authService: MsalService,
    public http: HttpClient,
    public snack: MatSnackBar
  ) {}
  //login user  
  async login() {
    return new Promise<void>((resolve) => {
    //call login function
    if (this.msalGuardConfig){
      this.authService.loginPopup({...this.msalGuardConfig} as PopupRequest)
        .subscribe({
          next: (result) => {
            this.outlookUser = this.checkloginStatus();
            resolve();
          },
          //dont remove logs kept on purpose
          error: (error) => console.log(error)
        });
    } else {
      this.authService.loginPopup()
        .subscribe({
          next: (result) => {
            this.outlookUser = this.checkloginStatus();
            resolve();
          },
          //dont remove logs kept on purpose
          error: (error) => console.log(error)
        });
    }
  });
  }

  //To check if user is already logged in
  checkloginStatus() {
    //if already logged, getAllAccounts gets the list of logged in accounts
    if(this.authService.instance.getAllAccounts().length > 0){
      return true;
    } else return false;
  }

  //logout of outlook
  logout() {
    //logout url, if using localhost will take http://localhost:4200/ only
    this.authService.logoutPopup({
      mainWindowRedirectUri: (environment.currentUrl == 'http://127.0.0.1:4200/' ? 'http://localhost:4200/': environment.currentUrl) + '/dash/events' 
    });
    this.outlookUser = null;
    this.dayEventLength = 0;
  }
  // get day wise events
  async getDayCalendar() {
   
    //call graph api to retrive the events
    this.http.get("https://graph.microsoft.com/v1.0/me/calendarview?startdatetime="+this.selectedDay?.toISOString()+"&enddatetime="+this.nextDay?.toISOString())
    .pipe(retry(2))
        .pipe(catchError(err => {
          //logs kept on purpose
          console.log(err)
          return throwError(err);
        }))
        .subscribe((res) => {
        const events = res['value'];
        this.calendarList = [];
        Object.values(res['value']).forEach((val,index) => {
        //obj to store event details  
        this.calendarList[index] = {
          id: val['id'],
          summary: val['subject'],
          location: val['location']['displayName'],
          description: val['bodyPreview'],
          recurrence: val['recurrence'],
          attendees: val['attendees'],
          start: {
            dateTime: new Date(val['start']['dateTime']+'Z'),
            timeZone: 'Asia/Kolkata'},
          end: {
              dateTime: new Date(val['end']['dateTime']+'Z'),
              timeZone: 'Asia/Kolkata'},
          reminders: val['reminderMinutesBeforeStart']
        }
      })
      this.dayVisible = true;
        return events;
      });
  }
  //get current day events
  async getDayCalendarToday() {
    //call graph api to retrive currents day's events
    this.http.get("https://graph.microsoft.com/v1.0/me/calendarview?startdatetime="+this.currentDay?.toISOString()+"&enddatetime="+this.nextDays?.toISOString())
    .pipe(retry(2))
        .pipe(catchError(err => {
          //log kept on purpose
          console.log(err)
          return throwError(err);
        }))
        .subscribe((res) => {
        const events = res['value'];
        this.calendarListToday = [];
        Object.values(res['value']).forEach((val,index) => {
        //obj to store events details  
        this.calendarListToday[index] = {
          id: val['id'],
          summary: val['subject'],
          location: val['location']['displayName'],
          description: val['bodyPreview'],
          recurrence: val['recurrence'],
          attendees: val['attendees'],
          start: {
            dateTime: new Date(val['start']['dateTime']+'Z'),
            timeZone: 'Asia/Kolkata'},
          end: {
              dateTime: new Date(val['end']['dateTime']+'Z'),
              timeZone: 'Asia/Kolkata'},
          reminders: val['reminderMinutesBeforeStart']
        }
      })
      this.dayEventLength = this.calendarListToday.length;
      this.todayMeetingVisible = true;
      return events;
      });
  }
  //get events for the week
  async getWeek() {
    // call graph api to get week events
    this.http.get("https://graph.microsoft.com/v1.0/me/calendarview?startdatetime="+this.selectedWeekfirstDate?.toISOString()+"&enddatetime="+this.selectedWeekLastDate?.toISOString())
    .pipe(retry(2))
        .pipe(catchError(err => {
          //dont remove logs kept on purpose
          console.log(err)
          return throwError(err);
        }))
        .subscribe((res) => {
        const events = res['value'];
        this.weekList = []; 
        Object.values(res['value']).forEach((val,index) => {
        //obj to store week's events  
        this.weekList[index] = {
          id: val['id'],
          summary: val['subject'],
          location: val['location']['displayName'],
          description: val['bodyPreview'],
          recurrence: val['recurrence'],
          attendees: val['attendees'],
          start: {
            dateTime: new Date(val['start']['dateTime']+'Z'),
            timeZone: 'Asia/Kolkata'},
          end: {
              dateTime: new Date(val['end']['dateTime']+'Z'),
              timeZone: 'Asia/Kolkata'},
          reminders: val['reminderMinutesBeforeStart']
        }
      })
      this.weekVisible = true;
      });
  }
  //get events for the month
  async getMonth() {
    // call graph api to get month events
    this.http.get("https://graph.microsoft.com/v1.0/me/calendarview?startdatetime="+this.selectedMonthfirstDate?.toISOString()+"&enddatetime="+this.selectedMonthLastDate?.toISOString())
    .pipe(retry(2))
        .pipe(catchError(err => {
          //dont remove logs kept on purpose
          console.log(err)
          return throwError(err);
        }))
        .subscribe((res) => {
        const events = res['value'];
        this.selectedMonthCalendarList = [];
        Object.values(res['value']).forEach((val,index) => {
        //obj to store events details  
        this.selectedMonthCalendarList[index] = {
          id: val['id'],
          summary: val['subject'],
          location: val['location']['displayName'],
          description: val['bodyPreview'],
          recurrence: val['recurrence'],
          attendees: val['attendees'],
          start: {
            dateTime: new Date(val['start']['dateTime']+'Z'),
            timeZone: 'Asia/Kolkata'},
          end: {
              dateTime: new Date(val['end']['dateTime']+'Z'),
              timeZone: 'Asia/Kolkata'},
          reminders: val['reminderMinutesBeforeStart']
        }
      })
      this.monthVisible = true;
      });
  }
  //add event to outlook calendar
  insertMeet(event: OutlookCalendarEventDetails): Promise<Boolean> {
    //create event object in JSON format
    //create the list of attendees
    let attendees: any[] = [];
    event.attendees.forEach((att,ind) => {
      attendees.push({
        "emailAddress": {
          "address":att.email,
        },
        "type": "required"
      })
    })
    //json obj required to send event details through api
    let newEvent = {
      "subject": event.summary,
      "start": {
          "dateTime": event.start.dateTime,
          "timeZone": event.start.timeZone
        },
      "end": {
          "dateTime": event.end.dateTime,
          "timeZone": event.end.timeZone
        },
      "body": {
          "contentType": "HTML",
          "content": event.description
        },
      "attendees": attendees
    }
    // for adding event
    return new Promise<Boolean>((resolve) => {
      this.http.post('https://graph.microsoft.com/v1.0/me/events', newEvent)
      .pipe(retry(2))
      .pipe(catchError(err => {
        //dont remove logs kept on purpose
        console.log(err)
        this.snack.open('Add new event failed! Please try again', '', {
          duration: 3000,
        });
        return throwError(err);
      }))
      .subscribe(result => {
       if(result){
          resolve(true);
        } else {
          resolve(false);
        }
      })
      
    });
  }
    // for updating event
  updateEvent(event): Promise<Boolean> {
    //create the list of attendees
    let attendees: any[] = [];
    event.attendees.forEach((att,ind) => {
      attendees.push({
        "emailAddress": {
          "address":att.email,
        },
        "type": "required"
      })
    })
    let newEvent = {
      "subject": event.summary,
      "start": {
          "dateTime": event.start.dateTime,
          "timeZone": event.start.timeZone
        },
      "end": {
          "dateTime": event.end.dateTime,
          "timeZone": event.end.timeZone
        },
      "body": {
          "contentType": "HTML",
          "content": event.description
        },
      "attendees": attendees
    }

    // for adding event
    return new Promise<Boolean>((resolve) => {
      this.http.patch('https://graph.microsoft.com/v1.0/me/events/'+event['id'], newEvent)
      .pipe(retry(2))
      .pipe(catchError(err => {
        //dont remove logs kept on purpose
        console.log(err)
        this.snack.open('Update event failed! Please try again', '', {
          duration: 3000,
        });
        return throwError(err);
      }))
      .subscribe(result => {
       if(result){
          resolve(true);
        } else {
          resolve(false);
        }
      })
      
    });
  }
  // for deleting event
  deleteEvent(event): Promise<Boolean>  {
    return new Promise<Boolean>((resolve) => {
      this.http.delete('https://graph.microsoft.com/v1.0/me/events/'+event['id'])
      .pipe(retry(2))
      .pipe(catchError(err => {
        //dont remove logs kept on purpose
        console.log(err)
        this.snack.open('Delete event failed! Please try again', '', {
          duration: 3000,
        });
        return throwError(err);
      }))
      .subscribe(result => {
        if(result == null){
          resolve(true);
        } else {
          resolve(false);
        }
      })
    });
  }
  //get all contact with email
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
