import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutlookCalendarEventsRoutingModule } from './outlook-calendar-events-routing.module';
import { DayViewComponent } from './day-view/day-view.component';
import { OutlookCalendarEventsDetailsComponent } from './outlook-calendar-events-details/outlook-calendar-events-details.component';
import { OutlookCalendarEventsListComponent } from './outlook-calendar-events-list/outlook-calendar-events-list.component';
import { MonthViewComponent } from './month-view/month-view.component';
import { SearchableDatePickerComponent } from './searchable-date-picker/searchable-date-picker.component';
import { WeekViewComponent } from './week-view/week-view.component';
import { SharedModule } from '../shared/shared.module';
import { DocumentManagementNewModule } from '../document-management-new/document-management-new.module';
import { CommonSearchModule } from '../common-search/common-search.module';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { MSAL_GUARD_CONFIG, MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { OutlookCalendarEventService } from './outlook-calendar-event.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    DayViewComponent,
    OutlookCalendarEventsDetailsComponent,
    OutlookCalendarEventsListComponent,
    MonthViewComponent,
    SearchableDatePickerComponent,
    WeekViewComponent
  ],
  imports: [
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        clientId: environment.outlookClientId, // Application (client) ID from the app registration
        authority: 'https://login.microsoftonline.com/common/', // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
        redirectUri: '/auth' // This is your redirect URI
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      }
    }),  
    {
      interactionType: InteractionType.Redirect, // MSAL Guard Configuration
      authRequest: {
        scopes: ['User.Read', 'Mail.Read', 'Mail.Send', 'Mail.ReadWrite', 'Calendars.Read', 'Calendars.ReadWrite', 'Calendars.Read.Shared', 'Calendars.ReadWrite.Shared', 'Calendars.ReadBasic']
      }
  }, {
    interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
    protectedResourceMap: new Map([ 
        ['https://graph.microsoft.com/beta/me', ['User.Read']],
        ['https://graph.microsoft.com/beta/me/messages', ['Mail.Read']],
        ['https://graph.microsoft.com/beta/me/sendMail', ['Mail.Send']],
        ['https://graph.microsoft.com/v1.0/me/calendarview',['Calendars.Read', 'Calendars.ReadWrite', 'Calendars.ReadBasic']],
        ['https://graph.microsoft.com/v1.0/me/events',['Calendars.Read', 'Calendars.ReadWrite', 'Calendars.ReadBasic']]
        
    ])
  }),
    CommonModule,
    OutlookCalendarEventsRoutingModule,
    DocumentManagementNewModule,
    SharedModule,
    DocumentManagementNewModule,
    CommonSearchModule,
    HttpClientModule,
  ],
  providers: [
    OutlookCalendarEventService,
    MsalGuard, // MsalGuard added as provider here
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
  ],
  bootstrap: [
    MsalRedirectComponent // MsalRedirectComponent bootstrapped here
  ],
})
export class OutlookCalendarEventsModule {}
