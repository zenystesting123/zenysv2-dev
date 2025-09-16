/*---------------------------------------------------------------------------
Description: Its Used for Displaying week view
Input : view date

-----------------------------------------------------------------------------*/
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEventDetails } from 'src/app/data-models';
import { GoogleCalandarEventsDetailsComponent } from '../google-calandar-events-details/google-calandar-events-details.component';
import { GoogleCalendarEventService } from '../google-calendar-event.service';

@Component({
  selector: 'app-week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss'],
})
export class WeekViewComponent implements OnInit {
  @Input() viewDate: Date;// input view date
  weekEvent: CalendarEventDetails[]; // week events
  eventLength: number; //event length in a day
  moreEventLength: number; // ength of events for displaying in the menu
  constructor(
    public googleCalendarEventService: GoogleCalendarEventService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  counterColumn(i: number) { //divide 7 column
    return new Array(i);
  }
  counterColumnTitle(i: number) { //divide 7 column
    return new Array(i);
  }
  counter(i: number) { //divide 24 rows
    return new Array(i);
  }
  getDayString(index: number) { // displaying the day
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
  getDateString(index: number) { // displaying the week dates
    var firstday = new Date(
      this.viewDate.setDate(this.viewDate.getDate() - this.viewDate.getDay())
    );
    let weekDay = new Date(firstday.setDate(firstday.getDate() + index));

    return weekDay.getDate();
  }
 
  getTask(time: number, dateIndex: number): CalendarEventDetails[] { // set events based on week days
    let data: CalendarEventDetails[] = [];
    let completeData: CalendarEventDetails[] =
      this.googleCalendarEventService.weekList;
    let filterDateEvents: CalendarEventDetails[] = [];
    var firstday = new Date(
      this.viewDate.setDate(this.viewDate.getDate() - this.viewDate.getDay())
    );
    new Date(firstday.setDate(firstday.getDate() + dateIndex));

    completeData.forEach((ins) => {
      let startDate = new Date(ins.start.dateTime);
      startDate.setHours(0, 0, 0);
      firstday.setHours(0, 0, 0);
      if (firstday.toString() == startDate.toString()) {
        filterDateEvents.push(ins);
      }
    });

    filterDateEvents.forEach((ins) => {
      let startDate = new Date(ins.start.dateTime).getHours();
      if (time == startDate) {
        data.push(ins);
      }
    });
    this.eventLength = data.length;
    this.moreEventLength = this.eventLength - 2;
    return data;
  }
  onViewDetails(res) { // on click view
    const dialogRef = this.dialog.open(GoogleCalandarEventsDetailsComponent, {
      width: '600px',
      disableClose: true,
      data: { result: res, scenario: 'view' },
    });

  }
  onDecrementWeek() { // on decrement week
    let firstDay = this.googleCalendarEventService.selectedWeekfirstDate;
    firstDay.setDate(firstDay.getDate() - 7); // minus 7 days
    this.onWeekChange(firstDay);
  }
  onIncrementWeek() { // on increment week
    let firstDay = this.googleCalendarEventService.selectedWeekfirstDate;
    firstDay.setDate(firstDay.getDate() + 7); // add one week extra
    this.onWeekChange(firstDay);
  }
  onWeekChange(viewDate: Date) { // get week wise events
    this.viewDate = viewDate;
    var firstDay = new Date(
      viewDate.setDate(viewDate.getDate() - viewDate.getDay())
    );
    var lastDay = new Date(
      viewDate.setDate(viewDate.getDate() - viewDate.getDay() + 6)
    );
    firstDay.setHours(0, 0, 0);
    lastDay.setHours(23, 59, 59, 999);
    this.googleCalendarEventService.selectedWeekfirstDate = firstDay;
    this.googleCalendarEventService.selectedWeekLastDate = lastDay;
    this.googleCalendarEventService.getWeek();
  }
}
