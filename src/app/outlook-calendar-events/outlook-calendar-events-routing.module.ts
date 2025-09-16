import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutlookCalendarEventsListComponent } from './outlook-calendar-events-list/outlook-calendar-events-list.component';
import { MsalRedirectComponent } from '@azure/msal-angular';

const routes: Routes = [
  {
    path: '',
    component: OutlookCalendarEventsListComponent,
    data: {
      title: 'event',
      animation: 'calendar',
    },
  },
  {
    //lazy load outlook module
    path: 'auth',
    component: MsalRedirectComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutlookCalendarEventsRoutingModule { }
