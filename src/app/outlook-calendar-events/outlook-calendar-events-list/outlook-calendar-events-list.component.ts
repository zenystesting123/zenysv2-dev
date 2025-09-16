import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { CommonService } from 'src/app/common.service';
import { OutlookCalendarEventDetails, EventDate } from 'src/app/data-models';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { Location } from '@angular/common';
import { endOfMonth, startOfMonth } from 'date-fns';
import { OutlookCalendarEventsDetailsComponent } from '../outlook-calendar-events-details/outlook-calendar-events-details.component';
import { OutlookCalendarEventService } from '../outlook-calendar-event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-outlook-calendar-events-list',
  templateUrl: './outlook-calendar-events-list.component.html',
  styleUrls: ['./outlook-calendar-events-list.component.scss']
})
export class OutlookCalendarEventsListComponent implements OnInit {
  addNewEvent: OutlookCalendarEventDetails; // for adding event
  view: string = 'day'; // current view of calendar
  viewDate: Date = new Date(); // current date
  selectedDate: Date; // for selecting a date
  connectCalendarDisplay: boolean = true; // for check login
  @ViewChild('fromInput', {
    read: MatInput,
  })
  fromInput: MatInput; // date input
  constructor(
    public networkCheck: NetworkCheckService,
    public outlookCalendarEventService: OutlookCalendarEventService,
    public location: Location,
    public dialog: MatDialog,
    public commonService: CommonService,
    private changeDetectorRef:ChangeDetectorRef,
    private router: Router
  ) { 
    this.outlookCalendarEventService.calendarView = this.view; // passing view to service
    let startDate = new EventDate(null, null); // setting start date
    let endDate = new EventDate(null, null); // setting end date
    this.addNewEvent = {
      // initializing event values
      id: null,
      summary: null,
      description: null,
      location: null,
      recurrence: null,
      attendees: null,
      start: startDate,
      end: endDate,
      reminders: null,
    };
  }

  ngOnInit(): void {
    // subscribe client init for checking if calendar loaded
      if (this.outlookCalendarEventService.checkloginStatus()) {
        this.onDayChange(this.viewDate); //fetch day wise event
        this.connectCalendarDisplay = false;  //hide connect 
      } else {
        this.connectCalendarDisplay = true;
      }
      this.changeDetectorRef.detectChanges();  
    
  }
  async onLogIn() {
    // login using msal auth service
    await this.outlookCalendarEventService.login();
    if (this.outlookCalendarEventService.checkloginStatus()) {
      this.onDayChange(this.viewDate); //fetch day wise event
      this.connectCalendarDisplay = false;  //hide connect 
    } else {
      this.connectCalendarDisplay = true;
    }
    this.changeDetectorRef.detectChanges();  
  }
  onLogOut() {
    // logout
    this.outlookCalendarEventService.logout();
  }
  onAddEvent() {
    // adding new event
    const dialogRef = this.dialog.open(OutlookCalendarEventsDetailsComponent, {
      width: '600px',
      disableClose: true,
      data: { result: this.addNewEvent, scenario: 'create' },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  onWeekChange(viewDate: Date) {
    // on click week view
    this.viewDate = viewDate;
    this.selectedDate = null;
    this.outlookCalendarEventService.calendarView = this.view; //upadate view in service
    var firstDay = new Date( //find first day of the week
      viewDate.setDate(viewDate.getDate() - viewDate.getDay())
    );
    var lastDay = new Date( // find lastday of the week
      viewDate.setDate(viewDate.getDate() - viewDate.getDay() + 6)
    );
    firstDay.setHours(0, 0, 0);
    lastDay.setHours(23, 59, 59, 999); // set last day hour to 11:59:59:999
    this.outlookCalendarEventService.selectedWeekfirstDate = firstDay; //upadate first day of week in service
    this.outlookCalendarEventService.selectedWeekLastDate = lastDay; //upadate last day of week  in service
    this.outlookCalendarEventService.getWeek(); //fetch week wise event
  }
  onMonthChange(viewDate: Date) {
    // on click month view
    this.viewDate = viewDate;
    this.selectedDate = null;
    this.outlookCalendarEventService.calendarView = this.view; //upadate view in service
    var firstDay = startOfMonth(viewDate); //find first day of the month
    var lastDay = endOfMonth(viewDate); // find lastday of the month
    firstDay.setHours(0, 0, 0);
    lastDay.setHours(23, 59, 59, 999); // set last day hour to 11:59:59:999
    this.outlookCalendarEventService.selectedMonthfirstDate = firstDay; //upadate first day of month  in service
    this.outlookCalendarEventService.selectedMonthLastDate = lastDay; //upadate last day of month  in service
    this.getSelectedMothDataFromDB(); //fetch month wise event
  }
  onDayChange(viewDate: Date) {
    // on click day view
    this.viewDate = viewDate;
    this.selectedDate = null;
    this.outlookCalendarEventService.calendarView = this.view; //upadate view in service
    var currentDay = viewDate; //find current day
    currentDay.setHours(0, 0, 0);
    var nextDay = new Date(currentDay.getTime() + 1000 * 60 * 60 * 24); // next day calculation
    this.outlookCalendarEventService.selectedDay = currentDay; //upadate current day in service
    this.outlookCalendarEventService.nextDay = nextDay; //upadate current day in service
    this.getSelecteDayDataFromDB(); //fetch day wise event
  }
  getSelecteDayDataFromDB() {
    this.outlookCalendarEventService.getDayCalendar(); //fetch day wise event
  }
  getSelectedMothDataFromDB() {
    this.outlookCalendarEventService.getMonth();  //fetch month wise event
  }
  onChooseDate(e) { // date wise filter based on view
    if (this.view == 'day') {
      this.onDayChange(this.selectedDate);
    } else if (this.view == 'month') {
      this.onMonthChange(this.selectedDate);
    } else if (this.view == 'week') {
      this.onWeekChange(this.selectedDate);
    }
  }
  onBackMob() {
    // on back click
    this.location.back();
  }
  resetDateWeb() {
    // reset choosed date
    this.selectedDate = null;
    this.fromInput.value = '';
  }

}
