import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CalendarEventsRoutingModule } from './calendar-events-routing.module';
import { DayViewComponent } from './day-view/day-view.component';
import { GoogleCalandarEventsListComponent } from './google-calandar-events-list/google-calandar-events-list.component';
import { WeekViewComponent } from './week-view/week-view.component';
import { MonthViewComponent } from './month-view/month-view.component';
import { GoogleCalandarEventsDetailsComponent } from './google-calandar-events-details/google-calandar-events-details.component';
import { SearchableDatePickerComponent } from './searchable-date-picker/searchable-date-picker.component';
import { DocumentManagementNewModule } from '../document-management-new/document-management-new.module';
import { CommonSearchModule } from '../common-search/common-search.module';
@NgModule({
  declarations: [
    DayViewComponent,
    GoogleCalandarEventsListComponent,
    GoogleCalandarEventsDetailsComponent,
    MonthViewComponent,
    WeekViewComponent,
    SearchableDatePickerComponent,
  ],
  imports: [SharedModule, CalendarEventsRoutingModule,DocumentManagementNewModule,CommonSearchModule],
})
export class CalendarEventsModule {}
