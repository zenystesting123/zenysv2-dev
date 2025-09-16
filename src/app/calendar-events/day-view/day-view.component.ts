/*---------------------------------------------------------------------------
Description: Its Used for Displaying day view
Input : view date
-----------------------------------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEventDetails } from 'src/app/data-models';
import { GoogleCalandarEventsDetailsComponent } from '../google-calandar-events-details/google-calandar-events-details.component';
import { GoogleCalendarEventService } from '../google-calendar-event.service';

@Component({
  selector: 'app-day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss'],
})
export class DayViewComponent implements OnInit {
  @Input() viewDate: Date; // input selected date 
  dayEvents: CalendarEventDetails[];// list of day event
  constructor(
    public googleCalendarEventService: GoogleCalendarEventService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}
  onViewDetails(res) { // on click the card open view popup
    const dialogRef = this.dialog.open(GoogleCalandarEventsDetailsComponent, {
      width: '600px',
      disableClose: true,
      data: { result: res, scenario: 'view' },
    });
  }
  counter(i: number) { // for adding 24 rows
    return new Array(i);
  }
  getEventOnSelectedDate() {
    this.dayEvents = [];
    // get all day wise event and push to dayEvents
    this.googleCalendarEventService.calendarList.forEach((ins) => {
      let startDate = new Date(ins.start.dateTime);
      startDate.setHours(0, 0, 0);
      this.viewDate.setHours(0, 0, 0);
      if (this.viewDate.toString() == startDate.toString()) {
        this.dayEvents.push(ins);
      }
    });
  }
  getEvent(int: number): CalendarEventDetails[] {
    this.getEventOnSelectedDate();
    let data: CalendarEventDetails[] = [];
    // display event corresponding to hour row
    this.dayEvents.forEach((ins) => {
      let startDate = new Date(ins.start.dateTime).getHours();
      if (int == startDate) {
        data.push(ins);
      }
    });
    return data;
  }
  onDecrementDay() { // on decrement day
    let firstDay = this.googleCalendarEventService.selectedDay;
    firstDay = new Date(firstDay.getTime() - 1000 * 60 * 60 * 24);
    this.onDayChange(firstDay);
  }
  onIncrementDay() { // on increment day
    let firstDay = this.googleCalendarEventService.selectedDay;
    firstDay = new Date(firstDay.getTime() + 1000 * 60 * 60 * 24);
    this.onDayChange(firstDay);
  }
  onDayChange(viewDate: Date) { // get selected date wise event
    this.viewDate = viewDate;
    var currentDay = viewDate;
    currentDay.setHours(0, 0, 0); // set first day hour to zero
    var nextDay = new Date(currentDay.getTime() + 1000 * 60 * 60 * 24); // end of the first date

    this.googleCalendarEventService.selectedDay = currentDay; // set current day to service
    this.googleCalendarEventService.nextDay = nextDay; // set next day to service

    this.getSelecteDayDataFromDB();
  }
  getSelecteDayDataFromDB() {// fetch selected date wise ecent from db
    this.googleCalendarEventService.getDayCalendar();
  }
}
