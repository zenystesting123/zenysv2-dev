/*---------------------------------------
Description : Used for Customised Time select and search

------------------------------------------*/

export class DateTimePicker {
  timeInterValInMinute = 15; // set the time interval
  startDate: Date = new Date(); // set start date as current date
  endDate: Date = new Date(); // set end date as current date
  isEditable: boolean = false; // for update scenario
  // add minutes to the time
  addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000);
  }
  // checks if start and end date is same
  isSameDate(startDate: Date, endDate: Date) {
    let diff = this.getMinutesDifference(startDate, endDate);
    if (diff >= 0 && diff <= 1440) {
      return true;
    } else {
      return false;
    }
  }
  // find minute difference
  getMinutesDifference(start: Date, end: Date): number {
    let diffMs = end.getTime() - start.getTime(); // milliseconds
    return Math.floor(diffMs / 60000);
  }
  // get the date list if start and end date is same list first value will be start time and start time is 12:am if both are different the both starts from 12:am
  getNewTimeList(startMinute: number = 0): TimePicker[] {
    let array: TimePicker[] = [];
    let dt = 60 / this.timeInterValInMinute;
    let listLength = dt * 24;
    for (let i = 0; i < listLength; i++) {
      let timePicker = new TimePicker();
      timePicker.minute = startMinute + i * this.timeInterValInMinute;
      array.push(timePicker);
    }
    return array;
  }
}
// data class for datetime
export class DateWithTime {
  hour: Number = 0;
  minute: Number = 0;
  hourWithType: Number = 0;
  validDateTime = false;
  validHour = false;
  validMinute = false;
}
// sets the time
export class TimePicker {
  minute: number = 0; // initialize minutes

  //return time in redable fortmat for ui
  getTime(): String {
    return this.minuteConvert(this.minute);
  }

  // convert minutes to readable string
  minuteConvert(value): String {
    // if time  greater than 1440(ie 24 hr)
    if (value > 1440) {
      value = value - 1440; // gets time
    }
    var num = value; // bilnd value to num
    var hours = num / 60; // gets hour
    var rhours = Math.floor(hours); // floor of hour
    var minutes = (hours - rhours) * 60; // gets minutes
    var rminutes = Math.round(minutes); // floor of minutes
    if (rhours > 12) {
      // if hour greater than 12
      if (rminutes < 10) {
        // add 0 if minutes less than 10
        return rhours - 12 + ':' + '0' + rminutes + ' pm';
      } else {
        return rhours - 12 + ':' + rminutes + ' pm';
      }
    } else {
      // if hour less than 12
      if (rhours == 0) {
        // if hour equal to zero
        if (rminutes < 10) {
          // add 0 if minutes less than 10
          return '12:' + '0' + rminutes + ' am';
        } else {
          return '12:' + rminutes + ' am';
        }
      } else if (rhours == 12) {
        // if hour equal to 12
        if (rminutes < 10) {
          // add 0 if minutes less than 10
          return '12:' + '0' + rminutes + ' pm';
        } else {
          return '12:' + rminutes + ' pm';
        }
      } else {
        if (rminutes < 10) {
          // add 0 if minutes less than 10
          return rhours + ':' + '0' + rminutes + ' am';
        } else {
          return rhours + ':' + rminutes + ' am';
        }
      }
    }
  }
}
