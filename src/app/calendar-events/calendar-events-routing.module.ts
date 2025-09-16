import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoogleCalandarEventsListComponent } from './google-calandar-events-list/google-calandar-events-list.component';

const routes: Routes = [
  {
    path: '',
    component: GoogleCalandarEventsListComponent,
    data: {
      title: 'event',
      animation: 'calendar',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarEventsRoutingModule {}
