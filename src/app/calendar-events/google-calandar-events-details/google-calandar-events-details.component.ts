/*---------------------------------------------------------------------------
Description: Its Used for View/add/edit/delete Events

-----------------------------------------------------------------------------*/
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  AttendessEmail,
  CalendarEventDetails,
  Customer,
  EventDate,
  OverRides,
  ReminderDetails,
  SubUsers,
} from 'src/app/data-models';
import { GoogleCalendarEventService } from '../google-calendar-event.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SnackbarService } from 'src/app/snack-bar.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { CommonService } from 'src/app/common.service';
import { NetworkCheckService } from 'src/app/networkcheck.service';
@Component({
  selector: 'app-google-calandar-events-details',
  templateUrl: './google-calandar-events-details.component.html',
  styleUrls: ['./google-calandar-events-details.component.scss'],
})
export class GoogleCalandarEventsDetailsComponent implements OnInit, OnDestroy {
  filteredOptions: Observable<Customer[]>; //observe contacts list
  customers: Customer[]; // store array of contacts
  superUserId: string; // Super user Id
  userId: string; // user Id
  selectable = true; // used in mat chip
  removable = true; // used in mat chip
  separatorKeysCodes: number[] = [ENTER, COMMA]; // used in mat chip
  emailList: string[] = []; //array of contacts emails
  endsAt: Date; //end date
  startsAt: Date; // start date
  scenarioForDatePicker: string; // scenario of popup(edit/delete/create)
  private onDestroy$: Subject<void> = new Subject<void>(); // Subject that emits when the component has been destroyed.
  networkConnection: boolean; // checks network connection
  contDataAccessRule: string; //stores contact accesrule 
  fieldNameContact='Contact'
  allSubUsers: SubUsers[] = [];// stores all user list
  superUserBranchId: string = 'n/a'; // stores super user branch id
  onlyCustomerSearch:boolean=true;// for customer search component for adding different style
  useremailSearch:boolean=true;//passing to for user search component for adding different style
  constructor(
    private analytics: AngularFireAnalytics,
    @Optional()
    public dialogRef: MatDialogRef<GoogleCalandarEventsDetailsComponent>,
    public afAuth: AngularFireAuth,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public googleCalendarEventService: GoogleCalendarEventService,
    public snackBarService: SnackbarService,
    private commonService: CommonService, public networkCheck: NetworkCheckService,
  ) {}

  onNoClick(): void {
    // cancel popup
    this.dialogRef.close();
  }
  ngOnInit(): void {
    if (this.data.scenario == 'create') {
      // if scenario is create set start and end date to current date and set scenario for date picker
      this.startsAt = new Date();
      this.endsAt = new Date();
      this.scenarioForDatePicker = 'create';
    } else {
      if (this.data.result.attendees) {
        // if here is a conactlist extract email from the list and store it to an array
        this.emailList = [];
        this.data.result.attendees.forEach((element) => {
          this.emailList.push(element.email);
        });
      }
    }
    // subscribe userdetails from common service
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        let authDetails = data.authDetails; //auth details
        if (authDetails) {
          let userData = data.userDetails; // get user details from common service
          if (userData.superUserId) {
            //check if superuser id exist
            this.superUserId = userData.superUserId;
          } else {
            this.superUserId = authDetails.uid;
          }
          this.userId = data.userId;
          this.contDataAccessRule = data.usrProfileData.contactDataAccessRule ? data.usrProfileData.contactDataAccessRule : 'Own';
          this.fieldNameContact = data.superUserDetails.fieldNames?.fieldNameContact ? data.superUserDetails.fieldNames?.fieldNameContact : 'Contact';
          this.allSubUsers = this.commonService.createUserlist('All', 'any')[1];
          if (data.superUserDetails.associatedBranch) {
            this.superUserBranchId = data.superUserDetails.associatedBranch
          }
          if (data.usrProfileData.dialogdataAccessRule == 'All') {
            // if data access rule is all fetch all the contact using superuser id
            this.googleCalendarEventService
              .getCustomerWithEmail(this.superUserId)
              .pipe(takeUntil(this.onDestroy$))
              .subscribe((data) => {
                this.customers = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Customer;
                });
                this.customers = this.customers.filter((c) => c.email !== ''); //filter conatct with email
              });
          } else {
            // if data access rule is not all fetch the contact assigned to current user
            this.googleCalendarEventService
              .getCustomerWithEmailSubUser(this.superUserId, authDetails.uid)
              .pipe(takeUntil(this.onDestroy$))
              .subscribe((data) => {
                this.customers = data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                    ...(e.payload.doc.data() as {}),
                  } as Customer;
                });
                this.customers = this.customers.filter((c) => c.email !== ''); //filter conatct with email
              });
          }
        }
      });
  }
  onSubmit(form: NgForm, GAevent) {
    // on add event
    this.analytics.logEvent(GAevent); // add ga event
    // add values to calendareventdetails calss
    let obj = new CalendarEventDetails();
    obj.summary = this.data.result.summary;
    obj.location = this.data.result.location;
    obj.description = this.data.result.description;
    obj.start = new EventDate(this.startsAt, 'Asia/Kolkata');
    obj.end = new EventDate(this.endsAt, 'Asia/Kolkata');
    obj.recurrence = ['RRULE:FREQ=DAILY;COUNT=1']; // default
    let attendessEmail: AttendessEmail[] = [];
    this.emailList.forEach((element) => {
      attendessEmail.push(new AttendessEmail(element));
    });

    obj.attendees = attendessEmail;
    let override: OverRides[] = [];
    override.push(new OverRides('email', 24 * 60));
    override.push(new OverRides('popup', 10));
    obj.reminders = new ReminderDetails(false, override); // default
    form.resetForm();
    // add meeting
    this.googleCalendarEventService.insertMeet(obj).subscribe((data) => {
      if (data == true) {
        // gettng the snack  bar message twice so added a common snack bar
        this.snackBarService.showSnackBar('Successfully Added Event');
        if (this.googleCalendarEventService.calendarView == 'day') {
          // if its day view fetch day wise data
          this.googleCalendarEventService.getDayCalendar();
        } else if (this.googleCalendarEventService.calendarView == 'week') {
          // if its week view fetch week wise data
          this.googleCalendarEventService.getWeek();
        } else {
          //  fetch month wise data
          this.googleCalendarEventService.getMonth();
        }
      } else {
        // show error message when its fail
        this.snackBarService.showSnackBar('An error occured');
      }
    });
    this.dialogRef.close(); // close popu
  }
  onUpdate(form: NgForm) {
    // update the event
    this.data.result['summary'] = this.data.result.summary;
    this.data.result['location'] = this.data.result.location;
    this.data.result['description'] = this.data.result.description;
    this.data.result.start['dateTime'] = this.startsAt;
    this.data.result.end['dateTime'] = this.endsAt;
    let attendessEmail: AttendessEmail[] = [];
    this.emailList.forEach((element) => {
      attendessEmail.push(new AttendessEmail(element));
    });

    this.data.result.attendees = attendessEmail;
    let updatedData = this.data.result;
    // update the event
    this.googleCalendarEventService
      .updateEvent(updatedData)
      .subscribe((data) => {
        if (data == true) {
          // if updated
          // gettng the snack  bar message twice so added a common snack bar
          this.snackBarService.showSnackBar('Successfully Updated Event');
          console.log("calendarView",this.googleCalendarEventService.calendarView)
          if (this.googleCalendarEventService.calendarView == 'day') {
            // if its day view fetch day wise data
            this.googleCalendarEventService.getDayCalendar();
          } else if (this.googleCalendarEventService.calendarView == 'week') {
            // if its week view fetch week wise data
            this.googleCalendarEventService.getWeek();
          } else {
            //  fetch month wise data
            this.googleCalendarEventService.getMonth();
          }
        } else {
          // show error message when its fail
          this.snackBarService.showSnackBar('An error occured');
        }
      });
    this.dialogRef.close(); // close dialog
  }
  onDelete() {
    // delete event
    let deleteData = this.data.result;
    this.googleCalendarEventService
      .deleteEvent(deleteData)
      .subscribe((data) => {
        if (data == true) {
          this.snackBarService.showSnackBar('Successfully Deleted Event'); // snack bar message

          if (this.googleCalendarEventService.calendarView == 'day') {
            // if its day view fetch day wise data
            this.googleCalendarEventService.getDayCalendar();
          } else if (this.googleCalendarEventService.calendarView == 'week') {
            // if its week view fetch week wise data
            this.googleCalendarEventService.getWeek();
          } else if (this.googleCalendarEventService.calendarView == 'dayMobile') {
            // if its day view fetch day wise data in home page
            this.googleCalendarEventService.getDayCalendarToday();
          }
          else {
            //  fetch month wise data
            this.googleCalendarEventService.getMonth();
          }
        } else {
          // show error message when its fail
          this.snackBarService.showSnackBar('An error occured');
        }
      });
    this.dialogRef.close(); // close dialog
  }
  onDeleteEvent() {
    // on delete clicked in view mode
    this.data.scenario = 'delete';
    this.scenarioForDatePicker = 'delete';
  }
  onUpdateEvent() {
    // on update clicked in view mode
    this.data.scenario = 'update';
    this.scenarioForDatePicker = 'update';
    this.startsAt = new Date(this.data.result.start.dateTime);
    this.endsAt = new Date(this.data.result.end.dateTime);
  }

  remove(attendees: string): void {
    // if removed the chip remove email from array
    const index = this.emailList.indexOf(attendees);
    if (index >= 0) {
      this.emailList.splice(index, 1);
    }

  }
  dateTimeChanges(data) {
    // set start and end date
    this.startsAt = data[0];
    this.endsAt = data[1];
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    // ondestroy
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
   // for check network connection
   onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  customerSelect(data) {
    //if customer is slected bind custid and billing address
    if (data[0]?.id) {
      if (data[0]?.email) {
        this.emailList.push(data[0]?.email)
      }else{
        this.snackBarService.showSnackBar('No email present');
      }
    }
  }
  userEmitEvent(data) {
    //if user is slected push email to 
    if (data?.userId) {
      if (data?.email) {
        this.emailList.push(data?.email)
      }else{
        this.snackBarService.showSnackBar('No email present');
      }
    }
  }
}
