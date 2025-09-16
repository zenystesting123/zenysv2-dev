/*---------------------------------------------------------------------------
Description: Its Used for Displaying day view
Input : view date
-----------------------------------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OutlookCalendarEventDetails } from 'src/app/data-models';
import { OutlookCalendarEventService } from '../outlook-calendar-event.service';
import { OutlookCalendarEventsDetailsComponent } from '../outlook-calendar-events-details/outlook-calendar-events-details.component';

@Component({
  selector: 'app-day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss']
})
export class DayViewComponent implements OnInit {
  @Input() viewDate: Date; // input selected date 
  dayEvents: OutlookCalendarEventDetails[];// list of day event
  constructor(
    public outlookCalendarEventService: OutlookCalendarEventService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}
  onViewDetails(res) { // on click the card open view popup
    const dialogRef = this.dialog.open(OutlookCalendarEventsDetailsComponent, {
      width: '600px',
      disableClose: true,
      data: { result: res, scenario: 'view' },
    });
  }
  counter(i: number) { // for adding 24 rows
    return new Array(i);
  }
  //get day events for selected date
  getEventOnSelectedDate() {
    this.dayEvents = [];
    // get all day wise event and push to dayEvents
    this.outlookCalendarEventService.calendarList.forEach((ins) => {
      let startDate = new Date(ins.start.dateTime);
      startDate.setHours(0, 0, 0);
      this.viewDate.setHours(0, 0, 0);
      if (this.viewDate.toString() == startDate.toString()) {
        this.dayEvents.push(ins);
      }
    });
  }
  //get events to display on each row
  getEvent(int: number): OutlookCalendarEventDetails[] {
    this.getEventOnSelectedDate();
    let data: OutlookCalendarEventDetails[] = [];
    // display event corresponding to hour row
    this.dayEvents.forEach((ins) => {
      let startDate = new Date(ins.start.dateTime).getHours();
      if (int == startDate) {
        data.push(ins);
      }
    });
    return data;
  }
  //go to previous day event
  onDecrementDay() { 
    // on decrement day
    let firstDay = this.outlookCalendarEventService.selectedDay;
    firstDay = new Date(firstDay.getTime() - 1000 * 60 * 60 * 24);
    this.onDayChange(firstDay);
  }
  //go to next day event
  onIncrementDay() { 
    // on increment day
    let firstDay = this.outlookCalendarEventService.selectedDay;
    firstDay = new Date(firstDay.getTime() + 1000 * 60 * 60 * 24);
    this.onDayChange(firstDay);
  }
  //on selecting new
  onDayChange(viewDate: Date) { 
    // get selected date wise event
    this.viewDate = viewDate;
    var currentDay = viewDate;
    currentDay.setHours(0, 0, 0); // set first day hour to zero
    var nextDay = new Date(currentDay.getTime() + 1000 * 60 * 60 * 24); // end of the first date

    this.outlookCalendarEventService.selectedDay = currentDay; // set current day to service
    this.outlookCalendarEventService.nextDay = nextDay; // set next day to service

    this.getSelecteDayDataFromDB();
  }

  // fetch selected date wise event
  getSelecteDayDataFromDB() {
    this.outlookCalendarEventService.getDayCalendar();
  }
}
