/*---------------------------------------------------------------------------
Description: Its Used for Displaying month view
Input : view date

-----------------------------------------------------------------------------*/
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { endOfMonth, startOfMonth } from 'date-fns';
import { CalendarEventDetails } from 'src/app/data-models';
import { GoogleCalandarEventsDetailsComponent } from '../google-calandar-events-details/google-calandar-events-details.component';
import { GoogleCalendarEventService } from '../google-calendar-event.service';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss'],
})
export class MonthViewComponent implements OnInit {
  @Input() viewDate: Date; // get input of view dat
  eventLength: number; // get length of event
  moreEventLength: number; // for showinh how many events in the menu if event legth is greater than 2
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  constructor(
    public googleCalendarEventService: GoogleCalendarEventService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}
  counter(i: number) {
    // divides row of 5
    return new Array(i);
  }
  counterColumn(i: number) {
    // divides column of 7
    return new Array(i);
  }

  getDateString(rowCount: number, colCount: number) {
    // displaying date
    var colValue = colCount + 1;
    var count = 0;
    if (rowCount == 0) {
      count = colValue;
    } else if (rowCount == 1) {
      count = colValue + 7;
    } else if (rowCount == 2) {
      count = colValue + 14;
    } else if (rowCount == 3) {
      count = colValue + 21;
    } else if (rowCount == 4) {
      count = colValue + 28;
    }
    var monthStartDayNumber =
      this.googleCalendarEventService.selectedMonthfirstDate.getDay();
    var lastDate =
      this.googleCalendarEventService.selectedMonthLastDate.getDate();
    let countsLast = count - monthStartDayNumber;
    if (count < monthStartDayNumber) {
      return 0;
    } else if (lastDate < countsLast) {
      return 0;
    } else {
      let counts = count - monthStartDayNumber;
      return counts;
    }
  }

  getTaskDate(dateIndex: number): CalendarEventDetails[] {
    // get events based on the date
    dateIndex -= 1;
    let completeData: CalendarEventDetails[] =
      this.googleCalendarEventService.selectedMonthCalendarList;
    let filterDateEvents: CalendarEventDetails[] = [];
    var day = new Date(this.googleCalendarEventService.selectedMonthfirstDate);
    day.setDate(day.getDate() + dateIndex);
    completeData.forEach((ins) => {
      let startDate = new Date(ins.start.dateTime);
      startDate.setHours(0, 0, 0);
      day.setHours(0, 0, 0);
      if (day.toString() == startDate.toString()) {
        filterDateEvents.push(ins);
      }
    });
    this.eventLength = filterDateEvents.length;
    this.moreEventLength = this.eventLength - 2;
    return filterDateEvents;
  }

  getDayString(index: number) {
    // for displaying the day
    var weekday = new Array(7);
    weekday[0] = 'Sunday';
    weekday[1] = 'Monday';
    weekday[2] = 'Tuesday';
    weekday[3] = 'Wednesday';
    weekday[4] = 'Thursday';
    weekday[5] = 'Friday';
    weekday[6] = 'Saturday';

    return weekday[index];
  }
  onViewDetails(res) {
    // on click event for view
    const dialogRef = this.dialog.open(GoogleCalandarEventsDetailsComponent, {
      width: '600px',
      disableClose: true,
      data: { result: res, scenario: 'view' },
    });

  }
  onIncrementMonth() {
    // on montyh increase
    let firstDay = this.googleCalendarEventService.selectedMonthfirstDate;
    firstDay.setMonth(firstDay.getMonth() + 1); // add one month extra and fetch events
    this.onMonthChange(firstDay);
  }
  onDecrementMonth() {
    // on month decrease
    let firstDay = this.googleCalendarEventService.selectedMonthfirstDate;
    firstDay.setMonth(firstDay.getMonth() - 1); // minuse one month and fetch events
    this.onMonthChange(firstDay);
  }
  onMonthChange(viewDate: Date) {
    // fetch month wise data
    this.viewDate = viewDate;
    var firstDay = startOfMonth(viewDate);
    var lastDay = endOfMonth(viewDate);
    firstDay.setHours(0, 0, 0);
    lastDay.setHours(23, 59, 59, 999);

    this.googleCalendarEventService.selectedMonthfirstDate = firstDay;
    this.googleCalendarEventService.selectedMonthLastDate = lastDay;
    this.getSelectedMothDataFromDB();
  }
  getSelectedMothDataFromDB() {
    // fetch month wise data from db
    this.googleCalendarEventService.getMonth();
  }
}
