/*-----------------------------------------------------------
Description : Select start and end date and time
Input : start and end date
Output : start and end date

--------------------------------------------------------------------*/

import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {
  DateTimePicker,
  DateWithTime,
  TimePicker,
} from 'src/app/model/customized-date-picker.model';

@Component({
  selector: 'app-searchable-date-picker',
  templateUrl: './searchable-date-picker.component.html',
  styleUrls: ['./searchable-date-picker.component.scss'],
})
export class SearchableDatePickerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  public startTimeCtrl: FormControl = new FormControl(); // observe start time value changes
  public endTimeCtrl: FormControl = new FormControl(); // observe end time value changes
  public startTimeFilterCtrl: FormControl = new FormControl(); // observe start time search box changes
  public endTimeFilterCtrl: FormControl = new FormControl(); // observe end time search box changes
  /** list of start time */
  public filteredStartTime: ReplaySubject<TimePicker[]> = new ReplaySubject<
    TimePicker[]
  >(1);
  /** list of end time  */
  public filteredEndTime: ReplaySubject<TimePicker[]> = new ReplaySubject<
    TimePicker[]
  >(1);
  @ViewChild('singleSelect', { static: true })
  singleSelect!: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  datePick: DateTimePicker = new DateTimePicker(); // save selected
  startDateList!: TimePicker[]; // inital start time list
  endDateList!: TimePicker[]; // initial end time list
  regexPattern = '/^(0?[1-9]|1[012])(:[0-5]d) [APap][mM]$/'; // pattern check for time
  startDate!: Date;
  startDateBind!: Date; // for binding start date in html
  endDate!: Date;
  endDateBind!: Date; // for binding end date in html
  endDayVisible: boolean = true; // for visible the end date
  @Input() startsAt: Date; // input start date from form
  @Input() endsAt: Date; // input end date from form
  @Input() scenarioForDatePicker: string; // input scenario from form
  @Output() dateTimeChanges = new EventEmitter(); // output the value
  timeGap: number = 60; // initial time gap for start time and end time
  currentStartTimeSelected: TimePicker; //temp variable for storing selected start time
  currentEndTimeSelected: TimePicker; //temp variable for storing selected end time
  constructor() {}

  ngOnInit() {
    if (this.scenarioForDatePicker == 'update') {
      this.datePick.isEditable = true; //if edit
    }

    let date = new Date(this.startsAt.getTime()); // extract date without time from form input
    let Starthour = date.getHours(); // extract hour from form input
    let Startminutes = date.getMinutes(); // extract minutes from form input
    let startCurrentHourMinutes = Starthour * 60 + Startminutes; // extract hour and minute for initail selection
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    this.startDate = new Date(date.getTime()); // start date with out time
    this.startDateBind = new Date(date.getTime()); //binding start date with out time to view

    this.startDateList = this.datePick.getNewTimeList(); // extract start time list
    let gap = this.timeGap; // initail time gap

    if (this.datePick.isEditable) {
      // value calculated if it is editable
      let timePicker = new TimePicker();
      timePicker.minute = startCurrentHourMinutes;

      let index = this.startDateList.findIndex(
        (item) => item.minute == startCurrentHourMinutes
      );

      if (index == -1) {
        this.startDateList.push(timePicker);
      }

      this.timeGap = this.datePick.getMinutesDifference(
        this.startsAt,
        this.endsAt
      );
      gap = this.timeGap % (60 * 24);
    }
    // sort time list based on time
    this.startDateList.sort((a, b) =>
      a.minute > b.minute ? 1 : b.minute > a.minute ? -1 : 0
    );
    // find initial start time
    this.currentStartTimeSelected = this.startDateList.find(
      (timmePicker) => timmePicker.minute >= startCurrentHourMinutes
    );

    // bind start time list to ui
    this.filteredStartTime.next(this.startDateList.slice());
    // set value to ui
    this.setStartTimeValuetoUi(this.currentStartTimeSelected.getTime());
    // geting end time list
    this.endDateList = this.datePick.getNewTimeList(
      this.currentStartTimeSelected.minute
    );

    let timePiker = new TimePicker();

    timePiker.minute = this.currentStartTimeSelected.minute + gap;
    // set end time initial value
    let endIndex = this.endDateList.findIndex(
      (item) => item.minute == timePiker.minute
    );
    // push end time if itis not in the list
    if (endIndex == -1) {
      this.endDateList.push(timePiker);
    }
    // sort time list based on time
    this.endDateList.sort((a, b) =>
      a.minute > b.minute ? 1 : b.minute > a.minute ? -1 : 0
    );
    // find initial end time
    this.currentEndTimeSelected = this.endDateList.find(
      (timmePicker) =>
        timmePicker.minute >= this.currentStartTimeSelected.minute + gap
    );

    // set start date with time
    this.datePick.startDate = this.datePick.addMinutes(
      this.startDate,
      this.currentStartTimeSelected.minute
    );
    // set end date with time
    this.datePick.endDate = this.datePick.addMinutes(
      this.datePick.startDate,
      this.timeGap
    );

    let end = new Date(this.datePick.endDate.getTime());
    end.setHours(0);
    end.setMinutes(0);
    end.setSeconds(0);
    this.endDate = end; // set end date without time
    this.endDateBind = end; //binding end date with out time to view

    this.filteredEndTime.next(this.endDateList.slice()); // bind end time list list to ui
    // end date bind to ui
    this.setEndTimeValuetoUi(this.currentEndTimeSelected.getTime());

    this.emitUpdatedValue(); // emit updated value
    // observe start time value changes
    this.startTimeCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        let previuos = this.currentStartTimeSelected.minute;
        // find selected time
        this.currentStartTimeSelected = this.startDateList.find(
          (date) => date.getTime() == this.startTimeCtrl.value
        );
        // set updated start date with time
        this.datePick.startDate = this.datePick.addMinutes(
          this.startDate,
          this.currentStartTimeSelected.minute
        );
        // set updated start date with time
        this.datePick.endDate = this.datePick.addMinutes(
          this.datePick.startDate,
          this.timeGap
        );

        let endold = new Date(this.datePick.endDate.getTime());
        endold.setHours(0);
        endold.setMinutes(0);
        endold.setSeconds(0);
        this.endDate = endold; // set updated end date value with out time
        this.endDateBind = endold; //binding updated end date with out time to view

        //calculate end time
        let difference = this.datePick.getMinutesDifference(
          this.endDate,
          this.datePick.endDate
        );
        // if same date show start time as initial in the list
        if (this.startDate == this.endDate) {
          this.endDateList = this.datePick.getNewTimeList(
            this.currentStartTimeSelected.minute
          );
        } else {
          // if start and end date are different show 12 am as initial in the list
          this.endDateList = this.datePick.getNewTimeList(0);
        }

        let timePiker = new TimePicker();
        timePiker.minute = difference;
        // find end time in the list
        let endIndex = this.endDateList.findIndex(
          (item) => item.minute == timePiker.minute
        );

        if (endIndex == -1) {
          // if updated end time is not in the list push the time
          this.endDateList.push(timePiker);
        }
        // sort updated end time
        this.endDateList.sort((a, b) =>
          a.minute > b.minute ? 1 : b.minute > a.minute ? -1 : 0
        );

        this.currentEndTimeSelected = this.endDateList.find(
          (timmePicker) => timmePicker.minute == difference
        );
        // set updated start date with time
        this.datePick.startDate = this.datePick.addMinutes(
          this.startDate,
          this.currentStartTimeSelected.minute
        );
        // set updated end date with time
        this.datePick.endDate = this.datePick.addMinutes(
          this.datePick.startDate,
          this.timeGap
        );

        let end = new Date(this.datePick.endDate.getTime());
        end.setHours(0);
        end.setMinutes(0);
        end.setSeconds(0);
        this.endDate = end; // set updated end date without time
        this.endDateBind = end; //binding updated end date with out time to view

        this.filteredEndTime.next(this.endDateList.slice()); // bind updated end time list list to ui
        this.setEndTimeValuetoUi(this.currentEndTimeSelected.getTime());
        // claculate the time gap between start and end time
        this.timeGap = this.datePick.getMinutesDifference(
          this.datePick.startDate,
          this.datePick.endDate
        );
      });
    // observe end time value changes
    this.endTimeCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.currentEndTimeSelected = this.endDateList.find(
          (date) => date.getTime() == this.endTimeCtrl.value
        );

        this.datePick.endDate = this.datePick.addMinutes(
          this.endDate,
          this.currentEndTimeSelected.minute
        );

        let end = new Date(this.datePick.endDate.getTime());

        end.setHours(0);
        end.setMinutes(0);
        end.setSeconds(0);

        this.endDate = end;
        this.endDateBind = end;

        this.timeGap = this.datePick.getMinutesDifference(
          this.datePick.startDate,
          this.datePick.endDate
        );

        this.emitUpdatedValue();
      });

    // listen for search field value changes
    this.startTimeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filerStartTime();
      });
    this.endTimeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filerEndTime();
      });
  }

  emitUpdatedValue() {
    this.dateTimeChanges.emit([this.datePick.startDate, this.datePick.endDate]);
  }

  ngAfterViewInit() {
    this.setInitialValueToStartTime();
    this.setInitialValueToEndTime();
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredStartTime are loaded initially
   */
  protected setInitialValueToStartTime() {
    this.filteredStartTime
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredStartTime are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: Date, b: Date) => a && b && a == b;
      });
  }
  protected setInitialValueToEndTime() {
    this.filteredEndTime
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredStartTime are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: Date, b: Date) => a && b && a == b;
      });
  }

  //set the start time vale to ui
  setStartTimeValuetoUi(date: String) {
    this.startTimeCtrl.setValue(date);
  }
  //set end time value to ui
  setEndTimeValuetoUi(date: String) {
    this.endTimeCtrl.setValue(date);
  }
  //on start time changes
  onChangeEventStartDate(event: any) {
    // get minutes difference of start dates
    let startdifference = this.datePick.getMinutesDifference(
      this.startDate,
      this.datePick.startDate
    );
    // bind start date
    this.startDate = new Date(this.startDateBind);
    // add minutes difference to start date
    this.datePick.startDate = this.datePick.addMinutes(
      this.startDate,
      startdifference
    );
    // get minutes difference of end dates
    let difference = this.datePick.getMinutesDifference(
      this.endDate,
      this.datePick.endDate
    );
    //if start date and end date is same get end date list where list starting value is start time selected
    if (this.startDate == this.endDate) {
      this.endDateList = this.datePick.getNewTimeList(
        this.currentStartTimeSelected.minute
      );
    } else {
      //if start date and end date is not same get end date list where list starting value is 12:00 am
      this.endDateList = this.datePick.getNewTimeList(0);
    }
    // bind end date difference to timePicker.minutes
    let timePiker = new TimePicker();
    timePiker.minute = difference;
    // bind current end time selected to ui
    let endIndex = this.endDateList.findIndex(
      (item) => item.minute == timePiker.minute
    );
    // if index is -1 the push the time to list
    if (endIndex == -1) {
      this.endDateList.push(timePiker);
    }
    // sort the list
    this.endDateList.sort((a, b) =>
      a.minute > b.minute ? 1 : b.minute > a.minute ? -1 : 0
    );

    this.currentEndTimeSelected = this.endDateList.find(
      (timmePicker) => timmePicker.minute == difference
    );

    this.datePick.endDate = this.datePick.addMinutes(
      this.datePick.startDate,
      this.timeGap
    );

    let end = new Date(this.datePick.endDate.getTime());
    end.setHours(0);
    end.setMinutes(0);
    end.setSeconds(0);
    this.endDate = end;
    this.endDateBind = end;

    this.filteredEndTime.next(this.endDateList.slice());
    this.setEndTimeValuetoUi(this.currentEndTimeSelected.getTime());

    this.emitUpdatedValue();
  }
  // on change end date
  onChangeEventEndDate(event: any) {
    // get minutes difference of end dates
    let difference = this.datePick.getMinutesDifference(
      this.endDate,
      this.datePick.endDate
    );
    // bind end date
    this.endDate = new Date(this.endDateBind);
    // add minutes difference to end date
    this.datePick.endDate = this.datePick.addMinutes(this.endDate, difference);
    // get minutes difference of start and end dates
    this.timeGap = this.datePick.getMinutesDifference(
      this.datePick.startDate,
      this.datePick.endDate
    );
    //if start date and end date is same get end date list where list starting value is start time selected
    if (this.startDate == this.endDate) {
      this.endDateList = this.datePick.getNewTimeList(
        this.currentStartTimeSelected.minute
      );
    } else {
      //if start date and end date is not same get end date list where list starting value is 12:00 am
      this.endDateList = this.datePick.getNewTimeList(0);
    }
    // bind start and end date difference to timePicker.minutes
    let timePiker = new TimePicker();
    timePiker.minute = difference;

    let endIndex = this.endDateList.findIndex(
      (item) => item.minute == timePiker.minute
    );
    // if index is -1 the push the time to list
    if (endIndex == -1) {
      this.endDateList.push(timePiker);
    }
    // sort the list
    this.endDateList.sort((a, b) =>
      a.minute > b.minute ? 1 : b.minute > a.minute ? -1 : 0
    );

    this.currentEndTimeSelected = this.endDateList.find(
      (timmePicker) => timmePicker.minute == difference
    );

    this.filteredEndTime.next(this.endDateList.slice());
    this.setEndTimeValuetoUi(this.currentEndTimeSelected.getTime());

    //emiting updated values
    this.emitUpdatedValue();
  }

  //filter the start time
  protected filerStartTime() {
    if (!this.startDateList) {
      return;
    }
    // get the search keyword
    let search = this.startTimeFilterCtrl.value;
    if (!search) {
      this.filteredStartTime.next(this.startDateList.slice());
      return;
    } else {
      let dateList: TimePicker[] = [];

      dateList = this.startDateList
        .slice()
        .filter((startTime) => startTime.getTime().startsWith(search));

      let time = this.getTimeWithType(search);

      if (time.validDateTime) {
        let timePicker = new TimePicker();
        timePicker.minute = +time.hourWithType * 60 + +time.minute;
        if (dateList.length == 0) {
          dateList.push(timePicker);
          this.startDateList.push(timePicker);
        }
      }
      this.startDateList.sort((a, b) =>
        a.minute > b.minute ? 1 : b.minute > a.minute ? -1 : 0
      );
      this.filteredStartTime.next(dateList);
    }
  }
  //filter the end time
  protected filerEndTime() {
    if (!this.endDateList) {
      return;
    }
    // get the search keyword
    let search = this.endTimeFilterCtrl.value;
    if (!search) {
      this.filteredEndTime.next(this.endDateList.slice());
      return;
    } else {
      let dateList: TimePicker[] = [];

      dateList = this.endDateList
        .slice()
        .filter((startTime) => startTime.getTime().startsWith(search));

      let time = this.getTimeWithType(search);

      if (time.validDateTime) {
        let timePicker = new TimePicker();
        timePicker.minute = +time.hourWithType * 60 + +time.minute;

        if (dateList.length == 0) {
          dateList.push(timePicker);
          this.endDateList.push(timePicker);
        }
      }
      this.filteredEndTime.next(dateList);
    }
  }
  // get time
  getTimeWithType(search: string): DateWithTime {
    let dateWithTime = new DateWithTime();
    //evalute search string is in valid format or not
    let validTime = search.search(this.regexPattern);
    //  checking  search string is in valid format or not
    if (validTime) {
      //split minute and hour
      let stringTime = search.split(':');
      //checking splited string lengh
      if (stringTime.length > 0) {
        // geting hour from string
        let hour = stringTime[0];
        // checking enterd time valid or not
        if (Number(hour) < 13) {
          //convert hour to number
          dateWithTime.hour = Number(hour);
          //setting hour as valid
          dateWithTime.validHour = true;
          // cheching minutes included or not
          if (stringTime.length > 1) {
            //getting minute from string
            let minute = stringTime[1];
            let stringTimeMinute = minute.split(' ');

            // cheching am or pm inclued
            if (stringTimeMinute.length > 0) {
              let minutes = stringTimeMinute[0];
              if (minutes != '') {
                if (Number(minutes) < 60) {
                  //conver string minute to number
                  dateWithTime.minute = Number(minutes);
                  //setting minute as valid
                  dateWithTime.validMinute = true;
                  let stringType = search.split(' ');
                  // checking am or pm included
                  if (stringType.length > 1) {
                    let timeType = stringType[1];
                    // getting hour as number for checking
                    let hourDigit = Number(hour);
                    // conert to 24 hour format

                    if (
                      timeType.toLocaleLowerCase() == 'am' ||
                      timeType.toLocaleLowerCase() == 'a'
                    ) {
                      // if 122 then set is as 0
                      if (hourDigit == 12) {
                        dateWithTime.hourWithType = Number(0);
                      } else {
                        // else set the actual value
                        dateWithTime.hourWithType = Number(hourDigit);
                      }

                      //set the time as valid
                      dateWithTime.validDateTime = true;
                    } else if (
                      timeType.toLocaleLowerCase() == 'pm' ||
                      timeType.toLocaleLowerCase() == 'p'
                    ) {
                      // hour greater than 24 make as pm and hour convert to 12 hr format
                      if (hourDigit == 12) {
                        dateWithTime.hourWithType = Number(hourDigit);
                      } else {
                        dateWithTime.hourWithType = Number((hourDigit += 12));
                      }
                      // setting the time as a valid time
                      dateWithTime.validDateTime = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return dateWithTime;
  }
  // check if end date should visible or not
  updateEndDateVisibility() {
    if (
      this.datePick.isSameDate(this.datePick.startDate, this.datePick.endDate)
    ) {
      this.endDayVisible = false; // if same date not visible end date
    } else {
      this.endDayVisible = true; // if not same date visible end date
    }
  }
}
